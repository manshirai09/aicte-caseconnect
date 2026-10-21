import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StatusBadge, PriorityBadge, BureauBadge, ConfidenceBadge } from '../common/Badges';
import {
  Building2,
  Calendar,
  MapPin,
  Mail,
  Phone,
  ShieldAlert,
  GitCompareArrows,
  Network,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  History,
  FileText,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export const Institution360: React.FC = () => {
  const {
    institutions,
    selectedInstitutionId,
    setSelectedInstitutionId,
    cases,
    suggestions,
    coordinations,
    viewCaseDetails,
    setCurrentView,
    setCoordinationTargetPair,
    setIsNewCoordinationModalOpen,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'cases' | 'timeline' | 'coordination' | 'recurring'>('cases');

  const institution = institutions.find(i => i.id === selectedInstitutionId) || institutions[0];

  // Cases for this institution (matching both ID or AICTE Permanent ID)
  const instCases = cases.filter(
    c => c.institutionId === institution.id || c.aictePermanentId === institution.aictePermanentId
  );

  const openCases = instCases.filter(c => c.status !== 'Resolved' && c.status !== 'Closed');
  const resolvedCases = instCases.filter(c => c.status === 'Resolved' || c.status === 'Closed');
  const overdueCases = openCases.filter(c => new Date(c.dueDate).getTime() < new Date('2026-10-21').getTime());

  // Overlap suggestions involving this institution's cases
  const instCaseIds = new Set(instCases.map(c => c.id));
  const relevantSuggestions = suggestions.filter(
    s => instCaseIds.has(s.sourceCaseId) || instCaseIds.has(s.targetCaseId)
  );

  // Coordination requests involving this institution
  const relevantCoordinations = coordinations.filter(
    cr => cr.institutionId === institution.id || cr.aictePermanentId === institution.aictePermanentId
  );

  // Unified Chronological Timeline across all Bureaus
  const unifiedTimeline = React.useMemo(() => {
    const events: {
      id: string;
      date: string;
      caseId: string;
      bureau: string;
      title: string;
      actor: string;
      remarks: string;
      type: 'action' | 'coordination' | 'overlap';
    }[] = [];

    instCases.forEach(c => {
      c.actionsHistory.forEach(act => {
        events.push({
          id: act.id,
          date: act.timestamp,
          caseId: c.id,
          bureau: c.bureau,
          title: `${act.action} (${c.id})`,
          actor: `${act.user} (${act.bureau})`,
          remarks: act.remarks,
          type: 'action',
        });
      });
    });

    relevantCoordinations.forEach(cr => {
      events.push({
        id: cr.id,
        date: cr.createdAt,
        caseId: cr.sourceCaseId,
        bureau: cr.fromBureau,
        title: `Coordination Dispatched (${cr.requestId})`,
        actor: `${cr.requestingOfficer} -> ${cr.toBureau}`,
        remarks: cr.reason,
        type: 'coordination',
      });
      cr.responses.forEach(r => {
        events.push({
          id: r.id,
          date: r.timestamp,
          caseId: cr.targetCaseId,
          bureau: r.bureau,
          title: `Coordination Responded (${cr.requestId})`,
          actor: r.officerName,
          remarks: r.message,
          type: 'coordination',
        });
      });
    });

    return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [instCases, relevantCoordinations]);

  const recurringData = institution.recurringIssues.map(ri => ({
    name: ri.category.length > 25 ? ri.category.slice(0, 22) + '...' : ri.category,
    fullName: ri.category,
    count: ri.count,
  }));

  return (
    <div className="p-6 space-y-6">
      {/* Quick Institution Switcher / Canonical Demo Bar */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-3 shadow-2xs text-xs">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-blue-600" />
          <span className="font-semibold text-slate-700">Select Dossier:</span>
          <select
            value={institution.id}
            onChange={e => setSelectedInstitutionId(e.target.value)}
            className="border border-slate-300 rounded px-2.5 py-1 bg-white font-bold text-slate-900"
          >
            {institutions.map(inst => (
              <option key={inst.id} value={inst.id}>
                {inst.name} ({inst.aictePermanentId})
              </option>
            ))}
          </select>
        </div>

        {institution.id === 'INST-DEMO-SUNRISE' ? (
          <div className="flex items-center gap-2 bg-amber-50 text-amber-900 px-3 py-1 rounded border border-amber-200 text-xs">
            <span className="font-bold">★ Active Canonical Demo:</span>
            <span>Sunrise Institute of Technology (Permanent ID: 1-XXXXXXX - Fictional Demo Identifier)</span>
          </div>
        ) : (
          <button
            onClick={() => setSelectedInstitutionId('INST-DEMO-SUNRISE')}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold underline"
          >
            Switch to Canonical Demo (Sunrise Institute of Technology)
          </button>
        )}
      </div>

      {/* Institution Master Header Dossier */}
      <div className="bg-slate-900 text-white rounded-lg p-6 shadow-md border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-blue-900 text-blue-200 border border-blue-700">
                Permanent ID: {institution.aictePermanentId}
              </span>
              <span
                className={`text-xs font-bold uppercase px-2.5 py-0.5 rounded ${
                  institution.approvalStatus === 'Approved'
                    ? 'bg-emerald-900/80 text-emerald-200 border border-emerald-700'
                    : 'bg-rose-900/80 text-rose-200 border border-rose-700'
                }`}
              >
                {institution.approvalStatus}
              </span>
              <span className="text-xs text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                {institution.institutionType}
              </span>
            </div>

            <h1 className="text-xl font-bold tracking-tight text-white">{institution.name}</h1>

            {institution.aliases.length > 0 && (
              <p className="text-xs text-slate-300">
                <span className="text-slate-400 font-medium">Alternate Aliases / Acronyms:</span>{' '}
                {institution.aliases.join(' • ')}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-1">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {institution.address}
              </span>
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {institution.contactEmail}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {institution.contactPhone}
              </span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 border-t lg:border-t-0 lg:border-l border-slate-800 pt-4 lg:pt-0 lg:pl-6 shrink-0">
            <div className="text-center px-3">
              <span className="text-[10px] uppercase text-slate-400 block font-semibold">Total Cases</span>
              <span className="text-2xl font-bold font-mono text-white">{instCases.length}</span>
            </div>
            <div className="text-center px-3">
              <span className="text-[10px] uppercase text-slate-400 block font-semibold">Active Open</span>
              <span className="text-2xl font-bold font-mono text-blue-400">{openCases.length}</span>
            </div>
            <div className="text-center px-3">
              <span className="text-[10px] uppercase text-slate-400 block font-semibold">Overdue</span>
              <span className={`text-2xl font-bold font-mono ${overdueCases.length > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                {overdueCases.length}
              </span>
            </div>
            <div className="text-center px-3">
              <span className="text-[10px] uppercase text-slate-400 block font-semibold">Risk Index</span>
              <span className="text-2xl font-bold font-mono text-amber-400">{institution.riskIndex}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-slate-200 bg-white px-4 rounded-t-lg text-xs font-semibold">
        <button
          onClick={() => setActiveTab('cases')}
          className={`py-3 px-4 border-b-2 transition ${
            activeTab === 'cases'
              ? 'border-blue-600 text-blue-600 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Institutional Cases ({instCases.length})
        </button>
        <button
          onClick={() => setActiveTab('timeline')}
          className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'timeline'
              ? 'border-blue-600 text-blue-600 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <History className="w-3.5 h-3.5" />
          <span>Unified Cross-Bureau Timeline ({unifiedTimeline.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('coordination')}
          className={`py-3 px-4 border-b-2 flex items-center gap-1.5 transition ${
            activeTab === 'coordination'
              ? 'border-blue-600 text-blue-600 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Network className="w-3.5 h-3.5" />
          <span>Coordination Requests ({relevantCoordinations.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('recurring')}
          className={`py-3 px-4 border-b-2 transition ${
            activeTab === 'recurring'
              ? 'border-blue-600 text-blue-600 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          Recurring Violation Hotspots
        </button>
      </div>

      {/* Tab Panels */}
      <div className="bg-white rounded-b-lg border border-t-0 border-slate-200 p-6 shadow-sm">
        {activeTab === 'cases' && (
          <div className="space-y-5">
            {/* Cross-Bureau Link Suggestions Alert */}
            {relevantSuggestions.length > 0 && (
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-900">
                    <GitCompareArrows className="w-4 h-4 text-rose-600" />
                    <span>Suggested Cross-Bureau Matches for {institution.name}</span>
                  </div>
                  <button
                    onClick={() => setCurrentView('overlap')}
                    className="text-xs text-rose-700 hover:text-rose-900 font-semibold underline"
                  >
                    Open Overlap Review Dashboard
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {relevantSuggestions.map(sug => (
                    <div key={sug.id} className="bg-white p-3 rounded border border-rose-200 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900">{sug.sourceCaseId}</span>
                          <span className="text-slate-400">↔</span>
                          <span className="font-mono font-bold text-slate-900">{sug.targetCaseId}</span>
                        </div>
                        <ConfidenceBadge band={sug.confidenceBand} score={sug.overallScore} />
                      </div>
                      <p className="text-slate-600 line-clamp-2">{sug.shortExplanation}</p>
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[11px] text-slate-500 font-medium">Status: {sug.status}</span>
                        <button
                          onClick={() => {
                            setCoordinationTargetPair({
                              sourceCaseId: sug.sourceCaseId,
                              targetCaseId: sug.targetCaseId,
                            });
                            setIsNewCoordinationModalOpen(true);
                          }}
                          className="px-2.5 py-1 text-xs rounded bg-blue-600 text-white font-semibold hover:bg-blue-700"
                        >
                          Initiate Coordination
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cases Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700 border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Case ID</th>
                    <th className="py-2.5 px-3">Bureau</th>
                    <th className="py-2.5 px-3">Subject & Category</th>
                    <th className="py-2.5 px-3">Priority</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Received / Due</th>
                    <th className="py-2.5 px-3">Related Cases</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {instCases.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        No registered complaint cases for this institution.
                      </td>
                    </tr>
                  ) : (
                    instCases.map(c => {
                      const isOverdue =
                        c.status !== 'Resolved' &&
                        c.status !== 'Closed' &&
                        new Date(c.dueDate).getTime() < new Date('2026-10-21').getTime();

                      return (
                        <tr key={c.id} className="hover:bg-slate-50 transition cursor-pointer" onClick={() => viewCaseDetails(c.id)}>
                          <td className="py-3 px-3 font-mono font-bold text-blue-900 whitespace-nowrap">
                            {c.id}
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            <BureauBadge bureau={c.bureau} />
                          </td>
                          <td className="py-3 px-3 max-w-sm">
                            <div className="font-semibold text-slate-900 line-clamp-1">{c.title}</div>
                            <div className="text-[11px] text-slate-500">{c.category}</div>
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            <PriorityBadge priority={c.priority} />
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            <StatusBadge status={c.status} />
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap font-mono text-[11px]">
                            <div>Recv: {c.dateReceived}</div>
                            <div className={isOverdue ? 'text-rose-600 font-bold' : 'text-slate-500'}>
                              Due: {c.dueDate} {isOverdue && '(!)'}
                            </div>
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            {c.relatedCases.length > 0 ? (
                              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono font-semibold text-[11px]">
                                {c.relatedCases.length} Linked
                              </span>
                            ) : (
                              <span className="text-slate-400 text-[11px]">None</span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-right whitespace-nowrap" onClick={e => e.stopPropagation()}>
                            <button
                              onClick={() => viewCaseDetails(c.id)}
                              className="px-2.5 py-1 text-xs rounded border border-slate-300 hover:bg-slate-100 font-medium"
                            >
                              Inspect
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'timeline' && (
          <div className="space-y-4">
            <div className="text-xs text-slate-500 mb-2">
              Chronological log of cross-bureau official activities, notices, inspections, and status transitions for this institution:
            </div>
            <div className="relative border-l-2 border-slate-200 ml-4 space-y-4 py-2">
              {unifiedTimeline.map(ev => (
                <div key={ev.id} className="ml-5 relative">
                  <div
                    className={`absolute -left-[27px] top-1.5 w-3.5 h-3.5 rounded-full ring-4 ring-white ${
                      ev.type === 'coordination' ? 'bg-cyan-600' : 'bg-blue-600'
                    }`}
                  />
                  <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900">{ev.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(ev.date).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600">
                      Officer / Unit: <strong className="text-slate-800">{ev.actor}</strong>
                    </p>
                    {ev.remarks && (
                      <p className="mt-1 text-slate-700 bg-white p-2.5 rounded border border-slate-100 leading-relaxed">
                        {ev.remarks}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'coordination' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-600">
                Cross-Bureau Joint Inquiries and Corroboration Requests:
              </span>
              <button
                onClick={() => {
                  const firstCase = instCases[0]?.id || '';
                  const secondCase = instCases[1]?.id || firstCase;
                  setCoordinationTargetPair({ sourceCaseId: firstCase, targetCaseId: secondCase });
                  setIsNewCoordinationModalOpen(true);
                }}
                className="px-3 py-1.5 text-xs font-semibold rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                + New Coordination Request
              </button>
            </div>

            {relevantCoordinations.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                No cross-bureau coordination requests have been initiated for this institution yet.
              </div>
            ) : (
              relevantCoordinations.map(cr => (
                <div key={cr.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-blue-900">{cr.requestId}</span>
                      <span className="font-medium text-slate-700">
                        {cr.fromBureau} ➔ {cr.toBureau}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 font-bold text-[10px]">
                      {cr.status}
                    </span>
                  </div>
                  <p className="text-slate-700 font-medium">Requested Action: {cr.requestedAction}</p>
                  <p className="text-slate-600 bg-white p-2.5 rounded border border-slate-200">{cr.reason}</p>
                  <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                    <span>Target Response Date: {cr.targetResponseDate}</span>
                    <span>Officer: {cr.requestingOfficer}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'recurring' && (
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase text-slate-600">Recurring Grievance & Violation Hotspots</h4>
            <p className="text-xs text-slate-500">
              Aggregated complaint trends indicating institutional systemic failure patterns:
            </p>

            <div className="h-64 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={recurringData} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={160} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '6px', color: '#fff', fontSize: '12px' }}
                  />
                  <Bar dataKey="count" fill="#4f46e5" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
