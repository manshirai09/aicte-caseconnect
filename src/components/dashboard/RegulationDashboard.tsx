import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CaseRecord, CaseStatus } from '../../types';
import { StatusBadge, PriorityBadge } from '../common/Badges';
import {
  FileText,
  AlertTriangle,
  Send,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Filter,
  PlusCircle,
  Search,
  Scale,
  Users,
} from 'lucide-react';

export const RegulationDashboard: React.FC = () => {
  const {
    cases,
    coordinations,
    viewCaseDetails,
    viewInstitution360,
    setIsNewCaseModalOpen,
    setIsNewCoordinationModalOpen,
    currentUser,
  } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Filter cases relevant to Regulation Bureau
  const rbCases = useMemo(() => {
    return cases.filter(c => {
      const isRb = c.bureau === 'Regulation Bureau';
      if (!isRb) return false;
      if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          c.id.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.institutionName.toLowerCase().includes(q) ||
          c.aictePermanentId.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [cases, statusFilter, search]);

  const activeShowCauseCount = rbCases.filter(c => c.category.includes('Faculty') || c.category.includes('Governance')).length;
  const overdueCount = rbCases.filter(c => {
    if (c.status === 'Resolved' || c.status === 'Closed') return false;
    return new Date(c.dueDate).getTime() < new Date('2026-10-21').getTime();
  }).length;
  const pendingCoordCount = coordinations.filter(
    cr => (cr.fromBureau === 'Regulation Bureau' || cr.toBureau === 'Regulation Bureau') &&
          (cr.status === 'Requested' || cr.status === 'Information Requested')
  ).length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-md relative overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600 absolute top-0 left-0" />
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-600/30 border border-blue-500/40 text-blue-400 flex items-center justify-center shrink-0">
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight">
                Regulation Bureau (RB) Workstation
              </h1>
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40">
                Statutory Regulatory Mandate
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Logged in as <strong className="text-slate-200">{currentUser?.name || 'RB Desk Officer'}</strong> • Scrutiny, Norms Adherence & Show-Cause Proceedings
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsNewCoordinationModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
          >
            <Send className="w-3.5 h-3.5 text-cyan-400" />
            <span>Dispatch to PGRC</span>
          </button>
          <button
            onClick={() => setIsNewCaseModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-sm transition"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Register RB Case</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active RB Cases</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{rbCases.length}</p>
          <span className="text-[10px] text-blue-600 font-medium">Under active regulation scrutiny</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Show-Cause / Norms</span>
          <p className="text-2xl font-black text-amber-600 mt-1">{activeShowCauseCount}</p>
          <span className="text-[10px] text-amber-700 font-medium">Faculty & governance violations</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Overdue SLA Violations</span>
          <p className="text-2xl font-black text-rose-600 mt-1">{overdueCount}</p>
          <span className="text-[10px] text-rose-700 font-medium">Require immediate compliance call</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Cross-Bureau Coordination</span>
          <p className="text-2xl font-black text-cyan-600 mt-1">{pendingCoordCount}</p>
          <span className="text-[10px] text-cyan-700 font-medium">Awaiting corroboration with PGRC</span>
        </div>
      </div>

      {/* Main Worklist Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900">Regulation Bureau Active Case Docket</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-mono font-bold">
              {rbCases.length}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Filter by Case, Permanent ID, or College..."
                className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 w-64"
              />
            </div>

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="text-xs py-1.5 px-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="New">New</option>
              <option value="In Progress">In Progress</option>
              <option value="Coordination Requested">Coordination Requested</option>
              <option value="Escalated">Escalated</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Case ID</th>
                <th className="py-2.5 px-3">Institution & Permanent ID</th>
                <th className="py-2.5 px-3">Violation Category</th>
                <th className="py-2.5 px-3">Priority</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Due Date</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rbCases.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-3 font-mono font-bold text-blue-700">
                    {c.id}
                  </td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() => viewInstitution360(c.institutionId)}
                      className="font-bold text-slate-900 hover:text-blue-700 text-left hover:underline flex items-center gap-1"
                    >
                      <span>{c.institutionName}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </button>
                    <span className="text-[10px] text-slate-500 font-mono">
                      PID: {c.aictePermanentId} • {c.state}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-medium text-slate-800">{c.category}</span>
                    <p className="text-[10px] text-slate-500 truncate max-w-xs">{c.title}</p>
                  </td>
                  <td className="py-3 px-3">
                    <PriorityBadge priority={c.priority} />
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={c.status} />
                  </td>
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-600">
                    {c.dueDate}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => viewCaseDetails(c.id)}
                      className="px-2.5 py-1 text-xs font-semibold rounded bg-blue-50 text-blue-700 hover:bg-blue-100 transition"
                    >
                      Inspect & Review
                    </button>
                  </td>
                </tr>
              ))}
              {rbCases.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    No Regulation Bureau cases match the active filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
