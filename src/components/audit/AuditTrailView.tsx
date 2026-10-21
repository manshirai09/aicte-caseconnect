import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { exportAuditLogsToCsv } from '../../services/exportService';
import { History, Search, Download, Filter, ShieldCheck, UserCheck, Calendar } from 'lucide-react';

export const AuditTrailView: React.FC = () => {
  const { auditLogs } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => {
      if (actionFilter !== 'ALL' && log.actionType !== actionFilter) return false;

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matches =
          log.description.toLowerCase().includes(q) ||
          log.userName.toLowerCase().includes(q) ||
          log.targetId.toLowerCase().includes(q) ||
          log.userRole.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [auditLogs, searchTerm, actionFilter]);

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              System Audit Trail & Security Log
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-mono font-bold">
              Immutable Docket
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Cryptographic-style audit record of all case actions, status transitions, coordination memos, and role switches
          </p>
        </div>
        <button
          onClick={() => exportAuditLogsToCsv(filteredLogs)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Audit Log (CSV)</span>
        </button>
      </div>

      {/* Demo Security Notice */}
      <div className="bg-slate-50 border border-slate-200 rounded p-3 text-xs text-slate-600 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Security and Authentication Model:</strong> This prototype enforces role-aware permissions and complete transaction auditing. In production deployment, authentication operates via Government of India Single Sign-On (Parichay / Jan Parichay) with digital signature certificates (e-Sign/DSC) and TLS 1.3 encrypted data storage.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-3.5 rounded-lg border border-slate-200 flex flex-wrap items-center gap-3 text-xs shadow-2xs">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by case ID, acting officer, or action description..."
            className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <select
          value={actionFilter}
          onChange={e => setActionFilter(e.target.value)}
          className="border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-700 font-medium"
        >
          <option value="ALL">All Action Types</option>
          <option value="CASE_CREATE">Case Creation</option>
          <option value="CASE_UPDATE">Case Update / Notes</option>
          <option value="STATUS_CHANGE">Status Changes</option>
          <option value="ASSIGNMENT_CHANGE">Assignment Changes</option>
          <option value="RELATIONSHIP_CREATED">Relationship Linked</option>
          <option value="RELATIONSHIP_REJECTED">Relationship Rejected</option>
          <option value="COORDINATION_REQUEST">Coordination Requested</option>
          <option value="COORDINATION_RESPONSE">Coordination Responded</option>
          <option value="CONFIG_UPDATE">System / Role Switch</option>
        </select>

        <span className="text-xs text-slate-500 ml-auto font-mono">
          Showing <strong>{filteredLogs.length}</strong> events
        </span>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3.5">Log ID & Timestamp</th>
                <th className="py-2.5 px-3.5">Acting User / Officer</th>
                <th className="py-2.5 px-3.5">Action Type</th>
                <th className="py-2.5 px-3.5">Target Entity & ID</th>
                <th className="py-2.5 px-3.5">Description & Impact</th>
                <th className="py-2.5 px-3.5">Transition / Diff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No audit records match current filter.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-3.5 whitespace-nowrap font-mono text-[11px]">
                      <div className="font-bold text-slate-800">{log.id}</div>
                      <div className="text-slate-400">{new Date(log.timestamp).toLocaleString()}</div>
                    </td>
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <div className="font-bold text-slate-900">{log.userName}</div>
                      <div className="text-[11px] text-slate-500">
                        {log.userRole} • {log.userBureau}
                      </div>
                    </td>
                    <td className="py-3 px-3.5 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-mono text-[10px] font-bold">
                        {log.actionType}
                      </span>
                    </td>
                    <td className="py-3 px-3.5 whitespace-nowrap font-mono text-[11px]">
                      <span className="font-semibold text-blue-900">{log.targetId}</span>
                      <span className="text-slate-400 block text-[10px]">({log.targetEntity})</span>
                    </td>
                    <td className="py-3 px-3.5 max-w-sm">
                      <p className="text-slate-800 leading-snug">{log.description}</p>
                    </td>
                    <td className="py-3 px-3.5 whitespace-nowrap text-[11px] font-mono">
                      {log.previousValue || log.newValue ? (
                        <div className="flex items-center gap-1.5">
                          {log.previousValue && (
                            <span className="text-slate-400 line-through">{log.previousValue}</span>
                          )}
                          {log.previousValue && log.newValue && <span className="text-slate-400">➔</span>}
                          {log.newValue && (
                            <span className="text-emerald-700 font-bold">{log.newValue}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[10px]">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
