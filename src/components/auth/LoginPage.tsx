import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Building2,
  KeyRound,
  Sparkles,
} from 'lucide-react';
import { ForgotPasswordModal } from './ForgotPasswordModal';

export const LoginPage: React.FC = () => {
  const { login, setCurrentView, users } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  // Quick Demo Fill Roles
  const demoAccounts: { role: UserRole; name: string; email: string; bureau: string; badge: string }[] = [
    {
      role: 'Senior Management',
      name: 'Prof. T. G. Sitharam (Chairman)',
      email: 'chairman@aicte-india.org',
      bureau: 'Executive Council',
      badge: 'Appellate Authority',
    },
    {
      role: 'RB Officer',
      name: 'Shri Arvind Sharma (Director RB)',
      email: 'rb.director@aicte-india.org',
      bureau: 'Regulation Bureau',
      badge: 'Show-Cause & Norms',
    },
    {
      role: 'PGRC Officer',
      name: 'Dr. Ramesh Chandra (Chief Grievance)',
      email: 'pgrc.officer1@aicte-india.org',
      bureau: 'PGRC Cell',
      badge: 'Petitions & Investigations',
    },
    {
      role: 'Regional Officer',
      name: 'Dr. M. S. Gaikwad (Western Region)',
      email: 'wro.officer@aicte-india.org',
      bureau: 'Western Regional Office',
      badge: 'State Scrutiny (MH & Goa)',
    },
    {
      role: 'Administrator',
      name: 'Er. Alok Srivastava (Systems Admin)',
      email: 'admin.caseconnect@aicte-india.org',
      bureau: 'IT Cell',
      badge: 'RBAC & User Governance',
    },
    {
      role: 'Student / Complainant',
      name: 'Aaditya Verma (Engineering Student)',
      email: 'student.aaditya@gmail.com',
      bureau: 'Public / Citizen',
      badge: 'Grievance Tracking',
    },
  ];

  const handleQuickSelect = (accEmail: string) => {
    setEmail(accEmail);
    setPassword('password123');
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) {
      setError('Please provide your registered account email.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = login(email, password);
      setLoading(false);
      if (!res.success) {
        setError(res.error || 'Authentication error.');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Tricolour Accent Line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600 fixed top-0 left-0 z-50 shadow-md" />

      {/* Decorative Background Mesh */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-blue-600 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-indigo-700 blur-3xl" />
      </div>

      {/* Navigation Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white p-0.5 border border-amber-400 shadow-md flex items-center justify-center overflow-hidden shrink-0">
            <img
              src="/assets/aistudio/AICTE_325fa493.jpeg"
              alt="AICTE Logo"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm tracking-tight">AICTE CaseConnect</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300 border border-blue-700/50">
                Official Portal
              </span>
            </div>
            <p className="text-[10px] text-amber-400 font-medium">
              One Institution. Connected Cases. Coordinated Action.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('dashboard')}
            className="text-xs text-slate-400 hover:text-white transition px-2.5 py-1 rounded hover:bg-slate-800"
          >
            ← Public Dashboard Preview
          </button>
          <button
            onClick={() => setCurrentView('signup')}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition shadow-sm"
          >
            Create Account
          </button>
        </div>
      </header>

      {/* Main Content Form */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
          {/* Left Column: Form */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400 font-mono">
                  All India Council for Technical Education
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
                  Sign In to AICTE CaseConnect
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Secure access for AICTE Bureaus, Regional Offices, and Registered Complainants
                </p>
              </div>

              {error && (
                <div className="mb-5 p-3 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-200 text-xs flex items-start gap-2.5 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                  <div>
                    <strong className="block font-semibold">Access Denied</strong>
                    <span>{error}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Official Email Address or Username <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="e.g. officer@aicte-india.org"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-300">
                      Password <span className="text-rose-400">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsForgotModalOpen(true)}
                      className="text-[11px] text-blue-400 hover:text-blue-300 hover:underline transition"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between py-1 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-slate-400 hover:text-slate-200">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Remember this device for 30 days</span>
                  </label>
                  <span className="text-[11px] text-slate-500 font-mono">256-bit SSL</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition transform active:scale-[0.99]"
                >
                  {loading ? (
                    <span>Verifying Credentials...</span>
                  ) : (
                    <>
                      <span>Sign In to Workstation</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>New student or complainant?</span>
              <button
                onClick={() => setCurrentView('signup')}
                className="font-semibold text-blue-400 hover:text-blue-300 transition"
              >
                Register Citizen Account →
              </button>
            </div>
          </div>

          {/* Right Column: Demo Role Selector & Security Notice */}
          <div className="lg:col-span-5 bg-slate-900/90 border-t lg:border-t-0 lg:border-l border-slate-800 p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                <Sparkles className="w-4 h-4" />
                <span>Quick Role-Model Sign In</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Click any persona to auto-populate official verified credentials and explore their authorized view:
              </p>

              <div className="space-y-2">
                {demoAccounts.map(acc => (
                  <button
                    key={acc.email}
                    onClick={() => handleQuickSelect(acc.email)}
                    className={`w-full text-left p-2.5 rounded-xl border transition flex items-center justify-between ${
                      email.toLowerCase() === acc.email.toLowerCase()
                        ? 'border-blue-500 bg-blue-950/40 text-white'
                        : 'border-slate-800 bg-slate-950/50 hover:bg-slate-800/60 text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">{acc.role}</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                          {acc.badge}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate max-w-[200px]">{acc.name}</p>
                      <p className="text-[9px] text-blue-400 font-mono">{acc.email}</p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400 space-y-1">
              <div className="flex items-center gap-1 text-slate-300 font-semibold text-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero-Trust RBAC Policy</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                Role authorization is determined strictly server-side from registered records. Unapproved registrations are denied entry until reviewed by AICTE Admin.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-3 border-t border-slate-800 bg-slate-950 text-center text-[11px] text-slate-500 relative z-10">
        All India Council for Technical Education (AICTE), Ministry of Education, Govt. of India • Nelson Mandela Marg, Vasant Kunj, New Delhi - 110070
      </footer>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
      />
    </div>
  );
};
