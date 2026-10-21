import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CaseRecord, CaseStatus, CasePriority, BureauType } from '../../types';
import { StatusBadge, PriorityBadge, BureauBadge } from '../common/Badges';
import { CaseDetailDrawer } from './CaseDetailDrawer';
import { exportCasesToCsv } from '../../services/exportService';
import {
  Search,
  Plus,
  Download,
  Filter,
  Eye,
  GitCompareArrows,
  AlertTriangle,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Building,
} from 'lucide-react';

export const CaseManagement: React.FC = () => {
  const {
    filteredCases,
    selectedCaseId,
    setSelectedCaseId,
    viewCaseDetails,
    setIsNewCaseModalOpen,
    viewInstitution360,
    suggestions,
  } = useApp();

  const [sortField, setSortField] = useState<'dateReceived' | 'dueDate' | 'priority' | 'status' | 'id'>('dateReceived');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Sorting
  const sortedCases = useMemo(() => {
    return [...filteredCases].sort((a, b) => {
      let comparison = 0;
      if (sortField === 'dateReceived') {
        comparison = new Date(a.dateReceived).getTime() - new Date(b.dateReceived).getTime();
      } else if (sortField === 'dueDate') {
        comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (sortField === 'priority') {
        const pOrder: Record<CasePriority, number> = { Critical: 4, High: 3, Medium: 2, Low: 1 };
        comparison = pOrder[a.priority] - pOrder[b.priority];
      } else if (sortField === 'status') {
        comparison = a.status.localeCompare(b.status);
      } else {
        comparison = a.id.localeCompare(b.id);
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }, [filteredCases, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(sortedCases.length / pageSize) || 1;
  const paginatedCases = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedCases.slice(start, start + pageSize);
  }, [sortedCases, currentPage, pageSize]);

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const selectedCase = filteredCases.find(c => c.id === selectedCaseId);

  return (
    <div className="p-6 space-y-4">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Case Management Portal</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cross-Bureau complaint docket, state investigations, and regulatory show-cause proceedings
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => exportCasesToCsv(filteredCases)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsNewCaseModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Case</span>
          </button>
        </div>
      </div>

      {/* Case Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider select-none">
              <tr>
                <th className="py-3 px-3.5 cursor-pointer hover:text-slate-900" onClick={() => toggleSort('id')}>
                  <div className="flex items-center gap-1">
                    <span>Case ID</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3.5">Institution & Permanent ID</th>
                <th className="py-3 px-3.5">Bureau</th>
                <th className="py-3 px-3.5">Category & Subject</th>
                <th className="py-3 px-3.5 cursor-pointer hover:text-slate-900" onClick={() => toggleSort('priority')}>
                  <div className="flex items-center gap-1">
                    <span>Priority</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3.5 cursor-pointer hover:text-slate-900" onClick={() => toggleSort('status')}>
                  <div className="flex items-center gap-1">
                    <span>Status</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3.5 cursor-pointer hover:text-slate-900" onClick={() => toggleSort('dueDate')}>
                  <div className="flex items-center gap-1">
                    <span>Target Due Date</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedCases.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    No cases match current filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedCases.map(c => {
                  const isOverdue =
                    c.status !== 'Resolved' &&
                    c.status !== 'Closed' &&
                    new Date(c.dueDate).getTime() < new Date('2026-10-21').getTime();

                  const hasSuggestions = suggestions.some(
                    s => (s.sourceCaseId === c.id || s.targetCaseId === c.id) && s.status === 'Pending Review'
                  );

                  return (
                    <tr
                      key={c.id}
                      className="hover:bg-blue-50/40 transition cursor-pointer group"
                      onClick={() => viewCaseDetails(c.id)}
                    >
                      <td className="py-3 px-3.5 font-mono font-bold text-blue-900 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span>{c.id}</span>
                          {hasSuggestions && (
                            <span
                              title="Cross-bureau overlap detected!"
                              className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"
                            />
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3.5 max-w-xs">
                        <div className="font-semibold text-slate-900 truncate">{c.institutionName}</div>
                        <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                          <span>ID: {c.aictePermanentId}</span>
                          <span>•</span>
                          <span>{c.district}, {c.state}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <BureauBadge bureau={c.bureau} />
                      </td>
                      <td className="py-3 px-3.5 max-w-sm">
                        <div className="font-medium text-slate-800 line-clamp-1">{c.title}</div>
                        <div className="text-[11px] text-slate-500 truncate">{c.category}</div>
                      </td>
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <PriorityBadge priority={c.priority} />
                      </td>
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <div className={`font-mono text-xs ${isOverdue ? 'text-rose-600 font-bold' : 'text-slate-700'}`}>
                          {c.dueDate}
                        </div>
                        {isOverdue && (
                          <span className="text-[10px] text-rose-600 font-semibold uppercase block">
                            Breached
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3.5 text-right whitespace-nowrap" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => viewCaseDetails(c.id)}
                            className="p-1 rounded text-slate-500 hover:text-blue-600 hover:bg-slate-100 transition"
                            title="Inspect Case"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="px-4 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-600">
          <div>
            Showing <strong className="text-slate-900">{Math.min(sortedCases.length, (currentPage - 1) * pageSize + 1)}</strong> to{' '}
            <strong className="text-slate-900">{Math.min(sortedCases.length, currentPage * pageSize)}</strong> of{' '}
            <strong className="text-slate-900">{sortedCases.length}</strong> cases
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 rounded border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 rounded border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Case Detail Drawer Modal */}
      {selectedCase && (
        <CaseDetailDrawer
          caseItem={selectedCase}
          onClose={() => setSelectedCaseId(null)}
        />
      )}
    </div>
  );
};
