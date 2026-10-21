import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Search,
  PlusCircle,
  ShieldAlert,
  UserCheck,
  RotateCcw,
  Sparkles,
  Layers,
  ChevronDown,
  Building2,
  FileCheck2,
  Lock,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeRole,
    setActiveRole,
    searchQuery,
    setSearchQuery,
    setIsNewCaseModalOpen,
    resetToSeedData,
    setCurrentView,
    suggestions,
    coordinations,
    currentUser,
    setIsAuthModalOpen,
    setAuthModalMode,
    logout,
  } = useApp();

  const [roleMenuOpen, setRoleMenuOpen] = React.useState(false);
  const pendingOverlapCount = suggestions.filter(s => s.status === 'Pending Review').length;
  const activeCoordCount = coordinations.filter(c => c.status === 'Requested' || c.status === 'Information Requested').length;

  const roles: UserRole[] = [
    'Senior Management',
    'RB Officer',
    'PGRC Officer',
    'Regional Officer',
    'Administrator',
  ];

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      {/* Top micro tricolor bar (Government of India / AICTE portal signature) */}
      <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600 opacity-90" />

      <div className="px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Brand & AICTE Emblem styling */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-full bg-white p-0.5 border border-amber-400/80 shadow-md flex items-center justify-center shrink-0 overflow-hidden ring-1 ring-amber-300/50">
            <img
              src="/assets/aistudio/AICTE_325fa493.jpeg"
              alt="AICTE Official Emblem"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                AICTE CaseConnect
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-900 text-blue-300 border border-blue-700">
                SIH26264 MVP
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Cross-Bureau Institution Intelligence & Case Coordination System
            </p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-xl relative hidden md:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search Permanent ID (e.g. 1-XXXXXXX), Institute, Case ID, Officer..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-800/90 text-slate-100 placeholder-slate-400 rounded-md border border-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Action Controls & Role Switcher */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Quick Demo Jump: Sunrise Institute */}
          <button
            onClick={() => {
              setCurrentView('institution360');
            }}
            title="Jump directly to Sunrise Institute of Technology 360 profile"
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition"
          >
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Demo: Sunrise Tech (1-XXXXXXX)</span>
          </button>

          {/* Quick Benchmark Run */}
          <button
            onClick={() => setCurrentView('benchmark')}
            title="Run Matcher Precision & Recall Benchmark"
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/60 text-indigo-200 transition"
          >
            <FileCheck2 className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Benchmark</span>
          </button>

          {/* New Case Button */}
          <button
            onClick={() => setIsNewCaseModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Case</span>
          </button>

          {/* Officer Account & Authentication Menu */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className="flex items-center gap-2 px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 transition"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white font-bold text-[10px] flex items-center justify-center shrink-0 shadow-xs border border-white/20">
                  {currentUser.name.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('')}
                </div>
                <div className="text-left hidden sm:block">
                  <span className="text-[10px] text-slate-400 block leading-tight truncate max-w-[120px]">
                    {currentUser.designation}
                  </span>
                  <span className="font-semibold text-slate-100 truncate max-w-[130px] block leading-tight">
                    {currentUser.name}
                  </span>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {roleMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setRoleMenuOpen(false)} />
                  <div className="absolute right-0 mt-1.5 w-72 rounded-lg bg-white text-slate-900 shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                    {/* Active User Dossier */}
                    <div className="px-3.5 pb-2.5 border-b border-slate-100 bg-slate-50/70">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                          <p className="text-[10px] text-blue-700 font-mono">{currentUser.email}</p>
                        </div>
                        <span className="text-[9px] uppercase font-mono font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                          {currentUser.role}
                        </span>
                      </div>
                      <div className="mt-2 text-[10px] text-slate-500 space-y-0.5">
                        <div>Bureau: <strong className="text-slate-700">{currentUser.bureau}</strong></div>
                        <div>Employee ID: <strong className="text-slate-700 font-mono">{currentUser.employeeId}</strong></div>
                        {currentUser.region && (
                          <div>Region: <strong className="text-slate-700">{currentUser.region}</strong></div>
                        )}
                      </div>
                    </div>

                    {/* Quick Role Switcher */}
                    <div className="px-3 py-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                        Switch Active Role Mode
                      </p>
                      <div className="space-y-0.5">
                        {roles.map(r => (
                          <button
                            key={r}
                            onClick={() => {
                              setActiveRole(r);
                              setRoleMenuOpen(false);
                            }}
                            className={`w-full text-left px-2 py-1.5 text-xs flex items-center justify-between rounded hover:bg-blue-50 transition ${
                              activeRole === r ? 'font-bold text-blue-700 bg-blue-50/60' : 'text-slate-700'
                            }`}
                          >
                            <span>{r}</span>
                            {activeRole === r && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Auth Actions */}
                    <div className="border-t border-slate-100 px-2 pt-2 space-y-1">
                      <button
                        onClick={() => {
                          setAuthModalMode('login');
                          setIsAuthModalOpen(true);
                          setRoleMenuOpen(false);
                        }}
                        className="w-full text-left px-2 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded flex items-center gap-1.5 transition font-medium"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                        <span>Sign In as Another Officer</span>
                      </button>

                      <button
                        onClick={() => {
                          setAuthModalMode('signup');
                          setIsAuthModalOpen(true);
                          setRoleMenuOpen(false);
                        }}
                        className="w-full text-left px-2 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded flex items-center gap-1.5 transition font-medium"
                      >
                        <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Register New Officer (Role Model)</span>
                      </button>

                      <button
                        onClick={() => {
                          logout();
                          setRoleMenuOpen(false);
                        }}
                        className="w-full text-left px-2 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded flex items-center gap-1.5 transition font-medium"
                      >
                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Sign Out Session</span>
                      </button>

                      <div className="border-t border-slate-100 pt-1">
                        <button
                          onClick={() => {
                            resetToSeedData();
                            setRoleMenuOpen(false);
                          }}
                          className="w-full text-left px-2 py-1 text-[11px] text-rose-600 hover:bg-rose-50 rounded flex items-center gap-1.5 transition font-medium"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reset to Factory Seed Data</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  setAuthModalMode('login');
                  setIsAuthModalOpen(true);
                }}
                className="px-3 py-1 text-xs font-semibold rounded bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setAuthModalMode('signup');
                  setIsAuthModalOpen(true);
                }}
                className="px-3 py-1 text-xs font-bold rounded bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs transition"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Demo Notice Sub-banner */}
      <div className="bg-slate-950 px-4 py-1 text-[11px] text-slate-400 flex flex-wrap items-center justify-between border-t border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>
            Operating in <strong className="text-slate-200">{activeRole}</strong> context. Simulated AICTE Intranet Environment.
          </span>
        </div>
        <div className="flex items-center gap-4">
          {pendingOverlapCount > 0 && (
            <button
              onClick={() => setCurrentView('overlap')}
              className="text-amber-400 hover:text-amber-300 underline font-medium"
            >
              {pendingOverlapCount} Cross-Bureau Overlap Suggestions Awaiting Review
            </button>
          )}
          {activeCoordCount > 0 && (
            <button
              onClick={() => setCurrentView('coordination')}
              className="text-cyan-400 hover:text-cyan-300 underline font-medium"
            >
              {activeCoordCount} Active Coordination Requests
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
