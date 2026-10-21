import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Institution } from '../../types';
import { exportInstitutionsToCsv } from '../../services/exportService';
import {
  Building2,
  Search,
  Download,
  AlertTriangle,
  ExternalLink,
  MapPin,
  Calendar,
  Layers,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';

export const InstitutionRegistry: React.FC = () => {
  const { institutions, viewInstitution360 } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedRegion, setSelectedRegion] = useState('ALL');

  const filteredInstitutions = useMemo(() => {
    return institutions.filter(inst => {
      if (selectedType !== 'ALL' && inst.institutionType !== selectedType) return false;
      if (selectedRegion !== 'ALL' && inst.region !== selectedRegion) return false;

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matches =
          inst.name.toLowerCase().includes(q) ||
          inst.aictePermanentId.toLowerCase().includes(q) ||
          inst.aliases.some(a => a.toLowerCase().includes(q)) ||
          inst.district.toLowerCase().includes(q) ||
          inst.state.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [institutions, searchTerm, selectedType, selectedRegion]);

  return (
    <div className="p-6 space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Institution Registry</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            AICTE Approved Technical and Management Institutions Master Database
          </p>
        </div>
        <button
          onClick={() => exportInstitutionsToCsv(filteredInstitutions)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Registry CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-lg border border-slate-200 flex flex-wrap items-center gap-3 text-xs shadow-2xs">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search Permanent ID (e.g. 1-XXXXXXX), College Name, or Known Aliases..."
            className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded text-xs bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <select
          value={selectedType}
          onChange={e => setSelectedType(e.target.value)}
          className="border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-700"
        >
          <option value="ALL">All Disciplines</option>
          <option value="Engineering & Technology">Engineering & Technology</option>
          <option value="Management">Management</option>
          <option value="Pharmacy">Pharmacy</option>
          <option value="Architecture & Planning">Architecture & Planning</option>
          <option value="Polytechnic Diploma">Polytechnic Diploma</option>
        </select>

        <select
          value={selectedRegion}
          onChange={e => setSelectedRegion(e.target.value)}
          className="border border-slate-300 rounded px-2.5 py-1.5 bg-white text-slate-700"
        >
          <option value="ALL">All Regions</option>
          <option value="Northern">Northern</option>
          <option value="Western">Western</option>
          <option value="Southern">Southern</option>
          <option value="Eastern">Eastern</option>
          <option value="North-Western">North-Western</option>
          <option value="Central">Central</option>
        </select>

        <span className="text-slate-500 text-xs ml-auto">
          Found <strong className="text-slate-900 font-mono">{filteredInstitutions.length}</strong> institutions
        </span>
      </div>

      {/* Grid of Institution Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredInstitutions.map(inst => {
          const isUnderScrutiny = inst.approvalStatus === 'Under Scrutiny' || inst.approvalStatus === 'Show Cause Issued';
          return (
            <div
              key={inst.id}
              onClick={() => viewInstitution360(inst.id)}
              className="bg-white rounded-lg border border-slate-200 hover:border-blue-400 hover:shadow-md transition p-4 cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                    ID: {inst.aictePermanentId}
                  </span>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                      isUnderScrutiny
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {inst.approvalStatus}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mt-2 group-hover:text-blue-600 transition line-clamp-2">
                  {inst.name}
                </h3>

                {inst.aliases.length > 0 && (
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                    <span className="font-semibold text-slate-600">Aliases:</span> {inst.aliases.join(', ')}
                  </p>
                )}

                <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{inst.district}, {inst.state} ({inst.region} Region)</span>
                </div>

                <div className="mt-2 text-xs text-slate-500">
                  <span className="font-medium text-slate-700">{inst.institutionType}</span> • Est. {inst.establishmentYear}
                </div>

                {/* Recurring Issues Badges */}
                {inst.recurringIssues.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {inst.recurringIssues.map((ri, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-medium truncate max-w-[200px]"
                      >
                        {ri.category} ({ri.count})
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 block leading-tight">Open Cases</span>
                    <span className="font-bold font-mono text-slate-800">{inst.openCasesCount}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 block leading-tight">Overdue</span>
                    <span className={`font-bold font-mono ${inst.overdueCasesCount > 0 ? 'text-rose-600' : 'text-slate-800'}`}>
                      {inst.overdueCasesCount}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 block leading-tight">Risk Index</span>
                    <span className="font-bold font-mono text-amber-600">{inst.riskIndex}</span>
                  </div>
                </div>

                <div className="text-blue-600 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition">
                  <span>360 Dossier</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
