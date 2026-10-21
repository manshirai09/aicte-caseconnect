import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole, MatcherWeights } from '../../types';
import { DEFAULT_MATCHER_WEIGHTS } from '../../services/matchingEngine';
import {
  ShieldCheck,
  UserCheck,
  Sliders,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Info,
  Server,
  Lock,
  FileCheck2,
} from 'lucide-react';

export const SystemAdmin: React.FC = () => {
  const {
    activeRole,
    setActiveRole,
    weights,
    setWeights,
    resetToSeedData,
    cases,
    institutions,
    auditLogs,
    users,
    currentUser,
    setIsAuthModalOpen,
    setAuthModalMode,
    switchUser,
  } = useApp();

  const [localWeights, setLocalWeights] = useState<MatcherWeights>({ ...weights });

  const totalWeight =
    localWeights.permanentId +
    localWeights.nameAlias +
    localWeights.geo +
    localWeights.category +
    localWeights.textTfidf +
    localWeights.temporal;

  const handleWeightSave = (e: React.FormEvent) => {
    e.preventDefault();
    setWeights(localWeights);
  };

  const handleResetWeights = () => {
    setLocalWeights(DEFAULT_MATCHER_WEIGHTS);
    setWeights(DEFAULT_MATCHER_WEIGHTS);
  };

  const roles: { role: UserRole; desc: string; access: string[] }[] = [
    {
      role: 'Senior Management',
      desc: 'AICTE Chairman, Member Secretary, and Bureau Chief executive oversight',
      access: ['Full cross-bureau visibility', 'Executive analytics & reporting', 'Audit trail inspection', 'All cases read-access'],
    },
    {
      role: 'RB Officer',
      desc: 'Regulation Bureau desk officer handling compliance, inspections, and show cause notices',
      access: ['RB cases creation & edits', 'Initiate coordination to PGRC', 'Show cause notice drafting', 'Respond to coordination'],
    },
    {
      role: 'PGRC Officer',
      desc: 'Public Grievance Redressal Cell officer investigating student/faculty petitions',
      access: ['PGRC grievance intake', 'Affidavit gathering', 'Cross-bureau overlap review', 'Respond to coordination'],
    },
    {
      role: 'Regional Officer',
      desc: 'Regional Office scrutiny committee (e.g. Western, Northern, Southern Region)',
      access: ['Region-scoped case visibility', 'Surprise inspection dossiers', 'State-level institutional reports'],
    },
    {
      role: 'Administrator',
      desc: 'System IT administrator managing algorithm weights, SLA rules, and audit logs',
      access: ['Matcher weight tuning', 'Audit log export', 'System reset to seed data', 'User role switching'],
    },
  ];

  const productionChecklist = [
    { task: 'Single Sign-On (SSO)', status: 'Simulated for Prototype', prod: 'Integrate with GoI Jan Parichay / MeriPehchan SAML2' },
    { task: 'Database Persistence', status: 'LocalStorage Reactive State', prod: 'Provisioned PostgreSQL via Cloud SQL or Firestore' },
    { task: 'CPGRAMS / National Portal Sync', status: 'Simulated CPGRAMS Intake', prod: 'Authorized REST API / NIC Data Bridge' },
    { task: 'Document Encryption', status: 'Standard Text Storage', prod: 'AES-256 at rest, SHA-256 integrity hashing' },
    { task: 'Audit Trail Immutability', status: 'Persistent Client Log', prod: 'WORM (Write Once Read Many) Cloud Logging' },
    { task: 'Notification Dispatch', status: 'In-App Toast Alerts', prod: 'Gov SMS Gateway (CDAC) & NIC Email SMTP' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                User & System Administration
              </h1>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-mono font-bold">
                Admin Console
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Algorithm weight calibration, demo role switcher, and production readiness governance
            </p>
          </div>
          <button
            onClick={() => {
              if (confirm('Are you sure you want to restore initial factory seed data? All custom cases will be reset.')) {
                resetToSeedData();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded bg-rose-50 text-rose-700 border border-rose-300 hover:bg-rose-100 transition shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Factory Seed Data</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Matcher Algorithm Weight Tuner */}
        <div className="lg:col-span-6 bg-white rounded-lg border border-slate-200 p-5 shadow-sm space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-blue-600" />
                <span>Cross-Bureau Matcher Weights Calibration</span>
              </h3>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Dynamically adjust multi-signal weights for overlap score calculation
              </p>
            </div>
            <button
              onClick={handleResetWeights}
              className="text-xs text-blue-600 hover:underline font-semibold"
            >
              Reset to Defaults
            </button>
          </div>

          <form onSubmit={handleWeightSave} className="space-y-4">
            {/* Permanent ID */}
            <div className="space-y-1">
              <div className="flex justify-between font-bold text-slate-700">
                <span>1. Exact AICTE Permanent ID Match</span>
                <span className="font-mono text-blue-700">{localWeights.permanentId}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={60}
                value={localWeights.permanentId}
                onChange={e => setLocalWeights({ ...localWeights, permanentId: Number(e.target.value) })}
                className="w-full accent-blue-600"
              />
              <p className="text-[10px] text-slate-400">Primary institution identity anchor.</p>
            </div>

            {/* Name & Alias */}
            <div className="space-y-1">
              <div className="flex justify-between font-bold text-slate-700">
                <span>2. Institution Name & Alias Similarity</span>
                <span className="font-mono text-blue-700">{localWeights.nameAlias}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={40}
                value={localWeights.nameAlias}
                onChange={e => setLocalWeights({ ...localWeights, nameAlias: Number(e.target.value) })}
                className="w-full accent-blue-600"
              />
              <p className="text-[10px] text-slate-400">Levenshtein and acronym resolution when ID is missing.</p>
            </div>

            {/* State & District */}
            <div className="space-y-1">
              <div className="flex justify-between font-bold text-slate-700">
                <span>3. Geographic Alignment (State & District)</span>
                <span className="font-mono text-blue-700">{localWeights.geo}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={30}
                value={localWeights.geo}
                onChange={e => setLocalWeights({ ...localWeights, geo: Number(e.target.value) })}
                className="w-full accent-blue-600"
              />
            </div>

            {/* Issue Category */}
            <div className="space-y-1">
              <div className="flex justify-between font-bold text-slate-700">
                <span>4. Complaint Category Alignment</span>
                <span className="font-mono text-blue-700">{localWeights.category}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={40}
                value={localWeights.category}
                onChange={e => setLocalWeights({ ...localWeights, category: Number(e.target.value) })}
                className="w-full accent-blue-600"
              />
            </div>

            {/* TF-IDF / Key Terms */}
            <div className="space-y-1">
              <div className="flex justify-between font-bold text-slate-700">
                <span>5. Text Vocabulary & Keyword Overlap</span>
                <span className="font-mono text-blue-700">{localWeights.textTfidf}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={40}
                value={localWeights.textTfidf}
                onChange={e => setLocalWeights({ ...localWeights, textTfidf: Number(e.target.value) })}
                className="w-full accent-blue-600"
              />
            </div>

            {/* Temporal Proximity */}
            <div className="space-y-1">
              <div className="flex justify-between font-bold text-slate-700">
                <span>6. Temporal Proximity (Days Delta)</span>
                <span className="font-mono text-blue-700">{localWeights.temporal}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={20}
                value={localWeights.temporal}
                onChange={e => setLocalWeights({ ...localWeights, temporal: Number(e.target.value) })}
                className="w-full accent-blue-600"
              />
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <span className="font-mono text-slate-500">
                Total Weight Sum: <strong className={totalWeight === 100 ? 'text-emerald-600' : 'text-rose-600'}>{totalWeight}%</strong>
              </span>
              <button
                type="submit"
                className="px-4 py-1.5 rounded bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-2xs"
              >
                Apply Weights & Re-score Docket
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Role Permissions Matrix */}
        <div className="lg:col-span-6 bg-white rounded-lg border border-slate-200 p-5 shadow-sm space-y-4 text-xs">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Officer Roles & Access Matrix</span>
            </h3>
            <p className="text-slate-500 text-[11px] mt-0.5">
              Switch roles to experience role-aware case routing, permissions, and coordination queues
            </p>
          </div>

          <div className="space-y-3">
            {roles.map(r => {
              const isActive = activeRole === r.role;
              return (
                <div
                  key={r.role}
                  className={`p-3.5 rounded-lg border transition ${
                    isActive
                      ? 'border-blue-500 bg-blue-50/20 ring-1 ring-blue-200'
                      : 'border-slate-200 bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 text-xs">{r.role}</span>
                    {isActive ? (
                      <span className="px-2 py-0.5 rounded bg-blue-600 text-white text-[10px] font-bold">
                        ACTIVE ROLE
                      </span>
                    ) : (
                      <button
                        onClick={() => setActiveRole(r.role)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        Switch Role
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600">{r.desc}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {r.access.map((acc, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.2 rounded bg-white border border-slate-200 text-slate-700">
                        ✓ {acc}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Registered Officer Accounts (Role Model Database) */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm space-y-4 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-blue-600" />
              <span>Registered Officer Accounts & Role Assignments ({users.length})</span>
            </h3>
            <p className="text-slate-500 text-[11px] mt-0.5">
              Managed officer profiles, designated bureaus, credentials, and active RBAC authorities
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setAuthModalMode('login');
                setIsAuthModalOpen(true);
              }}
              className="px-3 py-1.5 border border-slate-300 rounded bg-white hover:bg-slate-50 text-slate-700 font-semibold shadow-2xs"
            >
              Sign In with Account
            </button>
            <button
              onClick={() => {
                setAuthModalMode('signup');
                setIsAuthModalOpen(true);
              }}
              className="px-3.5 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-2xs transition"
            >
              + Register New Officer (Role Model)
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
              <tr>
                <th className="py-2 px-3">Officer Name</th>
                <th className="py-2 px-3">Role Model</th>
                <th className="py-2 px-3">Bureau / Cell</th>
                <th className="py-2 px-3">Official Email</th>
                <th className="py-2 px-3">Employee ID</th>
                <th className="py-2 px-3">Designation</th>
                <th className="py-2 px-3 text-right">Session State</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map(u => {
                const isCurrent = currentUser?.id === u.id;
                return (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900">{u.name}</div>
                      {u.region && (
                        <span className="text-[10px] text-slate-500">{u.region} Region</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap font-medium text-slate-700">
                      {u.bureau}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap font-mono text-[11px] text-blue-700">
                      {u.email}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap font-mono text-[11px] text-slate-600">
                      {u.employeeId}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap text-slate-600">
                      {u.designation}
                    </td>
                    <td className="py-2.5 px-3 text-right whitespace-nowrap">
                      {isCurrent ? (
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Active Session</span>
                        </span>
                      ) : (
                        <button
                          onClick={() => switchUser(u.id)}
                          className="px-2.5 py-1 text-xs rounded border border-slate-300 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition font-medium"
                        >
                          Switch To
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Production Readiness Governance Checklist */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm space-y-3 text-xs">
        <div className="border-b border-slate-100 pb-2">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Server className="w-4 h-4 text-slate-700" />
            <span>AICTE Enterprise Production-Readiness Checklist</span>
          </h3>
          <p className="text-slate-500 text-[11px]">
            Governance roadmap for deploying CaseConnect on National Informatics Centre (NIC) infrastructure
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          {productionChecklist.map((item, idx) => (
            <div key={idx} className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
              <span className="font-bold text-slate-900 block">{item.task}</span>
              <div className="text-[11px]">
                <span className="text-slate-500">Prototype Status:</span>{' '}
                <strong className="text-amber-700">{item.status}</strong>
              </div>
              <div className="text-[11px]">
                <span className="text-slate-500">Production Requirement:</span>{' '}
                <span className="text-slate-700">{item.prod}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
