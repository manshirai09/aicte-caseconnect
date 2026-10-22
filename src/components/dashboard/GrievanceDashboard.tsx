import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge, PriorityBadge } from '../common/Badges';
import {
  Users,
  AlertCircle,
  HelpCircle,
  Clock,
  CheckCircle2,
  ExternalLink,
  Search,
  Filter,
  PlusCircle,
  Scale,
  Send,
  GitCompareArrows,
} from 'lucide-react';

export const GrievanceDashboard: React.FC = () => {
  const {
    cases,
    suggestions,
    coordinations,
    viewCaseDetails,
    viewInstitution360,
    setIsNewCaseModalOpen,
    currentUser,
    setCurrentView,
  } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const pgrcCases = useMemo(() => {
    return cases.filter(c => {
      const isPgrc = c.bureau === 'PGRC';
      if (!isPgrc) return false;
      if (statusFilter !== 'ALL' && c.status !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          c.id.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.institutionName.toLowerCase().includes(q) ||
          c.complainantType?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [cases, statusFilter, search]);

  const studentPetitionsCount = pgrcCases.filter(c => c.complainantType === 'Student').length;
  const pendingOverlapReviews = suggestions.filter(s => s.status === 'Pending Review').length;
  const activeHearingsCount = pgrcCases.filter(c => c.status === 'In Progress' || c.status === 'Under Review').length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 shadow-md relative overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600 absolute top-0 left-0" />
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-cyan-600/30 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-white tracking-tight">
                Public Grievance Redressal Cell (PGRC) Workstation
              </h1>
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                Citizen Grievance Mandate
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Logged in as <strong className="text-slate-200">{currentUser?.name || 'Chief Grievance Officer'}</strong> • Student & Faculty Petitions, Ombudsman Hearings
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setCurrentView('overlap')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
          >
            <GitCompareArrows className="w-3.5 h-3.5 text-rose-400" />
            <span>Overlap Review ({pendingOverlapReviews})</span>
          </button>
          <button
            onClick={() => setIsNewCaseModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-sm transition"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Intake New Grievance</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Grievances</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{pgrcCases.length}</p>
          <span className="text-[10px] text-cyan-600 font-medium">Under PGRC cell investigation</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Student Petitions</span>
          <p className="text-2xl font-black text-blue-600 mt-1">{studentPetitionsCount}</p>
          <span className="text-[10px] text-blue-700 font-medium">Direct student & parent petitions</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pending Corroboration</span>
          <p className="text-2xl font-black text-rose-600 mt-1">{pendingOverlapReviews}</p>
          <span className="text-[10px] text-rose-700 font-medium">Cross-bureau matches to verify</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Hearings</span>
          <p className="text-2xl font-black text-amber-600 mt-1">{activeHearingsCount}</p>
          <span className="text-[10px] text-amber-700 font-medium">Ombudsman scrutiny scheduled</span>
        </div>
      </div>

      {/* PGRC Worklist Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-900">PGRC Petitions & Grievance Docket</h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-mono font-bold">
              {pgrcCases.length}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search petitioner, institute, case ID..."
                className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 w-64"
              />
            </div>

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="text-xs py-1.5 px-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="New">New Intake</option>
              <option value="In Progress">In Progress</option>
              <option value="Coordination Requested">Coordination Requested</option>
              <option value="Awaiting Information">Awaiting Affidavit</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Case ID</th>
                <th className="py-2.5 px-3">Institution & Location</th>
                <th className="py-2.5 px-3">Grievance Category</th>
                <th className="py-2.5 px-3">Complainant</th>
                <th className="py-2.5 px-3">Priority</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pgrcCases.map(c => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 px-3 font-mono font-bold text-cyan-700">
                    {c.id}
                  </td>
                  <td className="py-3 px-3">
                    <button
                      onClick={() => viewInstitution360(c.institutionId)}
                      className="font-bold text-slate-900 hover:text-cyan-700 text-left hover:underline flex items-center gap-1"
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
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-semibold border border-blue-200">
                      {c.complainantType || 'Student / Citizen'}
                    </span>
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
                      className="px-2.5 py-1 text-xs font-semibold rounded bg-cyan-50 text-cyan-700 hover:bg-cyan-100 transition"
                    >
                      Review Petition
                    </button>
                  </td>
                </tr>
              ))}
              {pgrcCases.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    No PGRC grievance records found matching criteria.
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
