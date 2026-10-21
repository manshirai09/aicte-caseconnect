import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CaseRecord, CasePriority, BureauType } from '../../types';
import { StatusBadge, PriorityBadge, BureauBadge } from '../common/Badges';
import {
  ClockAlert,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Calendar,
  Sliders,
  ArrowRight,
  ShieldAlert,
  UserCheck,
  Building,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export const SLAEscalations: React.FC = () => {
  const { cases, updateCaseStatus, viewCaseDetails } = useApp();

  const [activeTab, setActiveTab] = useState<'overdue' | 'dueSoon' | 'escalated' | 'rules'>('overdue');

  // Configurable prototype SLA rules (clearly labeled)
  const [slaRules, setSlaRules] = useState({
    criticalDays: 7,
    highDays: 21,
    mediumDays: 30,
    lowDays: 45,
    raggingDays: 7,
    feeDisputeDays: 21,
    pgrcStandard: 30,
    rbInspectionDays: 30,
  });

  const now = new Date('2026-10-21').getTime();

  // Overdue cases
  const overdueCases = useMemo(() => {
    return cases.filter(c => {
      if (c.status === 'Resolved' || c.status === 'Closed') return false;
      return new Date(c.dueDate).getTime() < now;
    }).map(c => {
      const daysOverdue = Math.max(1, Math.round((now - new Date(c.dueDate).getTime()) / (1000 * 3600 * 24)));
      return { ...c, daysOverdue };
    }).sort((a, b) => b.daysOverdue - a.daysOverdue);
  }, [cases, now]);

  // Due Soon (<7 days)
  const dueSoonCases = useMemo(() => {
    return cases.filter(c => {
      if (c.status === 'Resolved' || c.status === 'Closed') return false;
      const dueTime = new Date(c.dueDate).getTime();
      const daysLeft = (dueTime - now) / (1000 * 3600 * 24);
      return daysLeft >= 0 && daysLeft <= 7;
    }).map(c => {
      const daysLeft = Math.max(0, Math.round((new Date(c.dueDate).getTime() - now) / (1000 * 3600 * 24)));
      return { ...c, daysLeft };
    }).sort((a, b) => a.daysLeft - b.daysLeft);
  }, [cases, now]);

  // Escalated cases
  const escalatedCases = useMemo(() => {
    return cases.filter(c => c.status === 'Escalated' || c.isEscalated);
  }, [cases]);

  // Ageing Buckets calculation
  const ageingData = useMemo(() => {
    const buckets = [
      { name: '< 15 Days', count: 0 },
      { name: '15-30 Days', count: 0 },
      { name: '31-60 Days', count: 0 },
      { name: '> 60 Days (Critical)', count: 0 },
    ];
    cases.forEach(c => {
      if (c.status === 'Resolved' || c.status === 'Closed') return;
      const days = Math.round((now - new Date(c.dateReceived).getTime()) / (1000 * 3600 * 24));
      if (days < 15) buckets[0].count++;
      else if (days <= 30) buckets[1].count++;
      else if (days <= 60) buckets[2].count++;
      else buckets[3].count++;
    });
    return buckets;
  }, [cases, now]);

  const handleEscalate = (c: CaseRecord) => {
    updateCaseStatus(c.id, 'Escalated', 'Formally escalated to Bureau Head / Member Secretary due to SLA breach.');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                SLA & Escalation Monitoring
              </h1>
              <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold">
                Timeliness Control
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Case ageing distribution, SLA deadline breaches, and bureau escalation workflows
            </p>
          </div>
        </div>

        {/* Prototype Configuration Disclaimer */}
        <div className="mt-3 bg-slate-50 border border-slate-200 rounded p-2.5 text-xs text-slate-600">
          <strong>Configurable Prototype Rules:</strong> AICTE official Citizen Charter and grievance redressal guidelines specify standard response intervals (e.g. 7 days for anti-ragging, 30-45 days for general complaints). All SLA limits in this module are user-tunable prototype rules.
        </div>
      </div>

      {/* KPI Overview Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-rose-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-700 uppercase">Overdue Cases</span>
            <ClockAlert className="w-5 h-5 text-rose-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-rose-700">{overdueCases.length}</span>
            <span className="text-xs text-rose-600 font-medium">SLA Breached</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-amber-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-800 uppercase">Due Soon (&lt; 7 Days)</span>
            <AlertTriangle className="w-5 h-5 text-amber-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-amber-800">{dueSoonCases.length}</span>
            <span className="text-xs text-amber-700 font-medium">Needs Attention</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-purple-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-purple-800 uppercase">Escalated Queue</span>
            <Flame className="w-5 h-5 text-purple-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-purple-800">{escalatedCases.length}</span>
            <span className="text-xs text-purple-700 font-medium">Under Higher Scrutiny</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700 uppercase">Average Case Age</span>
            <Calendar className="w-5 h-5 text-slate-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-slate-900">22.4</span>
            <span className="text-xs text-slate-500 font-medium">Days from receipt</span>
          </div>
        </div>
      </div>

      {/* Ageing Bar Chart */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-1">Unresolved Case Ageing Breakdown</h3>
        <p className="text-xs text-slate-500 mb-4">Volume of active cases grouped by age since registration</p>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ageingData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '6px', color: '#fff', fontSize: '12px' }}
              />
              <Bar dataKey="count" fill="#e11d48" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-slate-200 bg-white px-4 rounded-t-lg text-xs font-semibold">
        <button
          onClick={() => setActiveTab('overdue')}
          className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'overdue'
              ? 'border-rose-600 text-rose-600 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Overdue Queue ({overdueCases.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('dueSoon')}
          className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'dueSoon'
              ? 'border-amber-600 text-amber-600 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Due Within 7 Days ({dueSoonCases.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('escalated')}
          className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'escalated'
              ? 'border-purple-600 text-purple-600 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>Escalated Cases ({escalatedCases.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('rules')}
          className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'rules'
              ? 'border-blue-600 text-blue-600 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Configurable SLA Rules</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="bg-white rounded-b-lg border border-t-0 border-slate-200 p-5 shadow-sm">
        {activeTab === 'overdue' && (
          <div className="space-y-3">
            {overdueCases.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No cases currently breach SLA deadlines.
              </div>
            ) : (
              overdueCases.map(c => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-lg border border-rose-200 bg-rose-50/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-rose-900">{c.id}</span>
                      <BureauBadge bureau={c.bureau} />
                      <PriorityBadge priority={c.priority} />
                      <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold font-mono">
                        {c.daysOverdue} Days Overdue
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900">{c.title}</h4>
                    <p className="text-[11px] text-slate-500 font-mono">
                      {c.institutionName} ({c.aictePermanentId}) • Due: {c.dueDate} • Assigned: {c.assignedOfficer.name}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => viewCaseDetails(c.id)}
                      className="px-3 py-1.5 border border-slate-300 rounded bg-white text-slate-700 hover:bg-slate-50 font-medium"
                    >
                      Inspect Case
                    </button>
                    {c.status !== 'Escalated' && (
                      <button
                        onClick={() => handleEscalate(c)}
                        className="px-3 py-1.5 rounded bg-rose-600 text-white hover:bg-rose-700 font-bold shadow-2xs"
                      >
                        Escalate Case
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'dueSoon' && (
          <div className="space-y-3">
            {dueSoonCases.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No cases due within the next 7 days.
              </div>
            ) : (
              dueSoonCases.map(c => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-lg border border-amber-200 bg-amber-50/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-amber-900">{c.id}</span>
                      <BureauBadge bureau={c.bureau} />
                      <PriorityBadge priority={c.priority} />
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold font-mono">
                        {c.daysLeft} Days Remaining
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900">{c.title}</h4>
                    <p className="text-[11px] text-slate-500 font-mono">
                      {c.institutionName} ({c.aictePermanentId}) • Target Due: {c.dueDate}
                    </p>
                  </div>
                  <button
                    onClick={() => viewCaseDetails(c.id)}
                    className="px-3 py-1.5 border border-slate-300 rounded bg-white text-slate-700 hover:bg-slate-50 font-medium"
                  >
                    Inspect Case
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'escalated' && (
          <div className="space-y-3">
            {escalatedCases.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No escalated cases currently active.
              </div>
            ) : (
              escalatedCases.map(c => (
                <div
                  key={c.id}
                  className="p-3.5 rounded-lg border border-purple-200 bg-purple-50/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-purple-900">{c.id}</span>
                      <BureauBadge bureau={c.bureau} />
                      <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold uppercase">
                        ESCALATED TO HEAD OF BUREAU
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900">{c.title}</h4>
                    <p className="text-[11px] text-slate-500 font-mono">
                      {c.institutionName} ({c.aictePermanentId}) • Assigned: {c.assignedOfficer.name}
                    </p>
                  </div>
                  <button
                    onClick={() => viewCaseDetails(c.id)}
                    className="px-3 py-1.5 border border-slate-300 rounded bg-white text-slate-700 hover:bg-slate-50 font-medium"
                  >
                    Inspect Dossier
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'rules' && (
          <div className="space-y-4 text-xs">
            <h4 className="font-bold text-slate-800 uppercase">Prototype SLA Target Windows (Days)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-2">
                <label className="font-bold text-slate-700 block">Critical Priority (Anti-Ragging / Vigilance)</label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={slaRules.criticalDays}
                  onChange={e => setSlaRules(prev => ({ ...prev, criticalDays: Number(e.target.value) }))}
                  className="w-full text-xs border border-slate-300 rounded px-2 py-1 bg-white font-mono"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-2">
                <label className="font-bold text-slate-700 block">High Priority (Regulatory Scrutiny / Inspection)</label>
                <input
                  type="number"
                  min={5}
                  max={60}
                  value={slaRules.highDays}
                  onChange={e => setSlaRules(prev => ({ ...prev, highDays: Number(e.target.value) }))}
                  className="w-full text-xs border border-slate-300 rounded px-2 py-1 bg-white font-mono"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-2">
                <label className="font-bold text-slate-700 block">Medium Priority (Standard Grievance)</label>
                <input
                  type="number"
                  min={10}
                  max={90}
                  value={slaRules.mediumDays}
                  onChange={e => setSlaRules(prev => ({ ...prev, mediumDays: Number(e.target.value) }))}
                  className="w-full text-xs border border-slate-300 rounded px-2 py-1 bg-white font-mono"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-2">
                <label className="font-bold text-slate-700 block">Low Priority (General Inquiries)</label>
                <input
                  type="number"
                  min={15}
                  max={120}
                  value={slaRules.lowDays}
                  onChange={e => setSlaRules(prev => ({ ...prev, lowDays: Number(e.target.value) }))}
                  className="w-full text-xs border border-slate-300 rounded px-2 py-1 bg-white font-mono"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
