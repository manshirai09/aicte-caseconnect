import React from 'react';
import { useApp } from '../../context/AppContext';
import { BureauType, CaseStatus } from '../../types';
import { Filter, X, Calendar, Building, Layers, MapPin } from 'lucide-react';

export const FilterBar: React.FC = () => {
  const { filters, setFilters, resetFilters, institutions, filteredCases, cases } = useApp();

  const bureaus: BureauType[] = ['PGRC', 'Regulation Bureau', 'Approval Bureau', 'Legal Cell', 'Skill Development'];
  const statuses: CaseStatus[] = [
    'New',
    'Under Review',
    'In Progress',
    'Awaiting Information',
    'Coordination Requested',
    'Escalated',
    'Resolved',
    'Closed',
  ];
  const regions = ['Northern', 'Western', 'Southern', 'Eastern', 'North-Western', 'Central'];

  const hasActiveFilters = 
    filters.dateRange !== 'ALL' ||
    filters.bureau !== 'ALL' ||
    filters.region !== 'ALL' ||
    filters.status !== 'ALL' ||
    filters.institutionId !== 'ALL';

  return (
    <div className="bg-white border-b border-slate-200 px-4 py-2 text-xs">
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="flex items-center gap-1.5 text-slate-500 font-medium">
          <Filter className="w-3.5 h-3.5" />
          <span>Filters:</span>
        </div>

        {/* Bureau Filter */}
        <select
          value={filters.bureau}
          onChange={e => setFilters(prev => ({ ...prev, bureau: e.target.value as any }))}
          className="border border-slate-300 rounded px-2 py-1 bg-white text-slate-700 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="ALL">All Bureaus</option>
          {bureaus.map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>

        {/* Status Filter */}
        <select
          value={filters.status}
          onChange={e => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
          className="border border-slate-300 rounded px-2 py-1 bg-white text-slate-700 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="ALL">All Statuses</option>
          {statuses.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {/* Region Filter */}
        <select
          value={filters.region}
          onChange={e => setFilters(prev => ({ ...prev, region: e.target.value }))}
          className="border border-slate-300 rounded px-2 py-1 bg-white text-slate-700 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="ALL">All AICTE Regions</option>
          {regions.map(r => (
            <option key={r} value={r}>{r} Region</option>
          ))}
        </select>

        {/* Institution Filter */}
        <select
          value={filters.institutionId}
          onChange={e => setFilters(prev => ({ ...prev, institutionId: e.target.value }))}
          className="border border-slate-300 rounded px-2 py-1 bg-white text-slate-700 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 max-w-xs truncate"
        >
          <option value="ALL">All Institutions</option>
          {institutions.map(inst => (
            <option key={inst.id} value={inst.id}>
              {inst.name} ({inst.aictePermanentId})
            </option>
          ))}
        </select>

        {/* Date Range Filter */}
        <select
          value={filters.dateRange}
          onChange={e => setFilters(prev => ({ ...prev, dateRange: e.target.value as any }))}
          className="border border-slate-300 rounded px-2 py-1 bg-white text-slate-700 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="ALL">All Time</option>
          <option value="30D">Last 30 Days</option>
          <option value="90D">Last 90 Days</option>
          <option value="1Y">This Year</option>
        </select>

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-rose-600 hover:text-rose-800 font-medium px-2 py-1 rounded hover:bg-rose-50 transition"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        )}

        <div className="ml-auto text-xs text-slate-500">
          Showing <strong className="text-slate-800 font-mono">{filteredCases.length}</strong> of{' '}
          <strong className="text-slate-800 font-mono">{cases.length}</strong> cases
        </div>
      </div>
    </div>
  );
};
