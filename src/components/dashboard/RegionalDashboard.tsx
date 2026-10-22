import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge, PriorityBadge, BureauBadge } from '../common/Badges';
import {
  MapPin,
  Building2,
  ShieldCheck,
  Search,
  ExternalLink,
  Calendar,
  AlertTriangle,
  FileText,
  Clock,
  Filter,
} from 'lucide-react';

export const RegionalDashboard: React.FC = () => {
  const {
    cases,
    institutions,
    viewCaseDetails,
    viewInstitution360,
    currentUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'cases' | 'institutions'>('cases');
  const [search, setSearch] = useState('');

  const assignedRegion = currentUser?.region || 'Western';

  // Strictly enforce regional restriction at the data layer
  const regionalCases = useMemo(() => {
    return cases.filter(c => {
      if (c.region !== assignedRegion) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          c.id.toLowerCase().includes(q) ||
          c.institutionName.toLowerCase().includes(q) ||
          c.aictePermanentId.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.state.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [cases, assignedRegion, search]);

  const regionalInstitutions = useMemo(() => {
    return institutions.filter(inst => {
      // Check region or state match
      const isWestern = inst.state === 'Maharashtra' || inst.state === 'Goa' || inst.state === 'Gujarat';
      const isRegional = assignedRegion === 'Western' ? isWestern : true;
      if (!isRegional) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          inst.name.toLowerCase().includes(q) ||
          inst.aictePermanentId.toLowerCase().includes(q) ||
          inst.district.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [institutions, assignedRegion, search]);

  const overdueCount = regionalCases.filter(c => {
    if (c.status === 'Resolved' || c.status === 'Closed') return false;
    return new Date(c.dueDate).getTime() < new Date('2026-10-21').getTime();
  }).length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-md relative overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600 absolute top-0 left-0" />
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 flex items-center justify-center shrink-0">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight">
                {assignedRegion} Regional Office (WRO) Workstation
              </h1>
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                Authorized Regional Jurisdiction
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Logged in as <strong className="text-slate-200">{currentUser?.name || 'Regional Director'}</strong> • Local Scrutiny, Surprise Inspections & State Hearing Committees
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Active Scope: Maharashtra, Goa, Gujarat</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Regional Cases</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{regionalCases.length}</p>
          <span className="text-[10px] text-indigo-600 font-medium">Inside {assignedRegion} Jurisdiction</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Monitored Institutes</span>
          <p className="text-2xl font-black text-blue-600 mt-1">{regionalInstitutions.length}</p>
          <span className="text-[10px] text-blue-700 font-medium">Colleges in jurisdiction</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Regional Overdue</span>
          <p className="text-2xl font-black text-rose-600 mt-1">{overdueCount}</p>
          <span className="text-[10px] text-rose-700 font-medium">Requires local visit / summon</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Regional Hearing Panel</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">2 Active</p>
          <span className="text-[10px] text-emerald-700 font-medium">Standing Regional Committee</span>
        </div>
      </div>

      {/* Tabs and Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="flex rounded-lg bg-slate-200 p-0.5 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('cases')}
                className={`px-3 py-1 rounded-md transition ${
                  activeTab === 'cases' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Jurisdiction Cases ({regionalCases.length})
              </button>
              <button
                onClick={() => setActiveTab('institutions')}
                className={`px-3 py-1 rounded-md transition ${
                  activeTab === 'institutions' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Regional Colleges ({regionalInstitutions.length})
              </button>
            </div>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search in regional docket..."
              className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 w-64"
            />
          </div>
        </div>

        {activeTab === 'cases' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Case ID</th>
                  <th className="py-2.5 px-3">Institution & City</th>
                  <th className="py-2.5 px-3">Bureau</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Priority</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {regionalCases.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3 font-mono font-bold text-indigo-700">
                      {c.id}
                    </td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => viewInstitution360(c.institutionId)}
                        className="font-bold text-slate-900 hover:text-indigo-700 text-left hover:underline flex items-center gap-1"
                      >
                        <span>{c.institutionName}</span>
                        <ExternalLink className="w-3 h-3 text-slate-400" />
                      </button>
                      <span className="text-[10px] text-slate-500 font-mono">
                        PID: {c.aictePermanentId} • {c.state}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <BureauBadge bureau={c.bureau} />
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-medium text-slate-800">{c.category}</span>
                    </td>
                    <td className="py-3 px-3">
                      <PriorityBadge priority={c.priority} />
                    </td>
                    <td className="py-3 px-3">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => viewCaseDetails(c.id)}
                        className="px-2.5 py-1 text-xs font-semibold rounded bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition"
                      >
                        Regional Scrutiny
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">AICTE Permanent ID</th>
                  <th className="py-2.5 px-3">College / Institute Name</th>
                  <th className="py-2.5 px-3">District & State</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Open Cases</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {regionalInstitutions.map(inst => (
                  <tr key={inst.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">
                      {inst.aictePermanentId}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-900 block">{inst.name}</span>
                      <span className="text-[10px] text-slate-400">Aliases: {inst.aliases.join(', ')}</span>
                    </td>
                    <td className="py-3 px-3">
                      {inst.district}, {inst.state}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium">
                        {inst.institutionType}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`font-bold ${inst.openCasesCount > 0 ? 'text-rose-600' : 'text-slate-500'}`}>
                        {inst.openCasesCount} Open
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => viewInstitution360(inst.id)}
                        className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-800 transition"
                      >
                        View 360 Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
