import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole, BureauType } from '../../types';
import {
  X,
  Lock,
  Mail,
  User,
  Shield,
  Briefcase,
  Building2,
  CheckCircle2,
  ArrowRight,
  UserCheck,
  UserPlus,
  KeyRound,
  Info,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    login,
    signup,
    users,
    currentUser,
    logout,
  } = useApp();

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [loginError, setLoginError] = useState('');

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupRole, setSignupRole] = useState<UserRole>('PGRC Officer');
  const [signupBureau, setSignupBureau] = useState<BureauType>('PGRC');
  const [signupDesignation, setSignupDesignation] = useState('Assistant Grievance Officer');
  const [signupEmployeeId, setSignupEmployeeId] = useState(`AICTE-${Math.floor(1000 + Math.random() * 9000)}`);
  const [signupRegion, setSignupRegion] = useState('Western');
  const [signupPassword, setSignupPassword] = useState('password123');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('password123');
  const [signupError, setSignupError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleRoleChange = (role: UserRole) => {
    setSignupRole(role);
    if (role === 'RB Officer') {
      setSignupBureau('Regulation Bureau');
      setSignupDesignation('Regulation Scrutiny Officer');
    } else if (role === 'PGRC Officer') {
      setSignupBureau('PGRC');
      setSignupDesignation('Public Grievance Redressal Officer');
    } else if (role === 'Senior Management') {
      setSignupBureau('Regulation Bureau');
      setSignupDesignation('Advisor / Joint Secretary');
    } else if (role === 'Regional Officer') {
      setSignupBureau('Regulation Bureau');
      setSignupDesignation('Regional Officer');
    } else if (role === 'Administrator') {
      setSignupBureau('Regulation Bureau');
      setSignupDesignation('Systems & Security Administrator');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!loginEmail.trim()) {
      setLoginError('Please enter your official AICTE email.');
      return;
    }
    const res = login(loginEmail, loginPassword);
    if (res.success) {
      setIsAuthModalOpen(false);
    } else {
      setLoginError(res.error || 'Authentication failed.');
    }
  };

  const handleQuickLogin = (email: string) => {
    setLoginError('');
    const res = login(email, 'password123');
    if (res.success) {
      setIsAuthModalOpen(false);
    } else {
      setLoginError(res.error || 'Quick login failed.');
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');

    if (!signupName.trim() || !signupEmail.trim()) {
      setSignupError('Officer Name and Official Email are required.');
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setSignupError('Passwords do not match.');
      return;
    }

    const res = signup({
      name: signupName,
      email: signupEmail,
      role: signupRole,
      bureau: signupBureau,
      designation: signupDesignation,
      employeeId: signupEmployeeId,
      region: signupRole === 'Regional Officer' ? signupRegion : undefined,
      password: signupPassword,
    });

    if (res.success) {
      setIsAuthModalOpen(false);
    } else {
      setSignupError(res.error || 'Officer registration failed.');
    }
  };

  const roleDescriptions: Record<UserRole, { badge: string; desc: string; permissions: string[] }> = {
    'Senior Management': {
      badge: 'Executive Oversight',
      desc: 'AICTE Chairman, Vice-Chairman, and Member Secretary executive appellate authority.',
      permissions: ['Portfolio Dashboard Oversight', 'All Bureaus Full Visibility', 'Policy Escalation Reports', 'Audit Trail Inspection'],
    },
    'RB Officer': {
      badge: 'Regulation Bureau',
      desc: 'Handles regulatory inspections, faculty norms compliance, and show-cause proceedings.',
      permissions: ['RB Cases Management', 'Issue Show-Cause Notices', 'Dispatch Coordination to PGRC', 'Corroboration Reports'],
    },
    'PGRC Officer': {
      badge: 'Public Grievance',
      desc: 'Investigates petitions from students, parents, faculty, and public grievances.',
      permissions: ['PGRC Grievance Intake', 'Cross-Bureau Overlap Adjudication', 'Respond to Coordination', 'Affidavit Scrutiny'],
    },
    'Regional Officer': {
      badge: 'Regional Jurisdiction',
      desc: 'Regional Office Scrutiny Committee monitoring state-level institutional activities.',
      permissions: ['Region-Scoped Case View', 'Surprise Visit Reporting', 'State Scrutiny Dossiers'],
    },
    'Administrator': {
      badge: 'System Admin',
      desc: 'IT systems management, matching algorithm weights tuning, and security logs auditing.',
      permissions: ['Algorithm Weight Calibration', 'SLA Threshold Governance', 'Audit Trail Export', 'Data Recovery & Reset'],
    },
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-2xl w-full flex flex-col animate-in zoom-in-95 overflow-hidden">
        {/* Top Header Banner with Emblem */}
        <div className="bg-slate-900 text-white p-5 border-b border-slate-800 relative">
          <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600 absolute top-0 left-0" />

          <div className="flex items-center justify-between mt-1">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-white p-0.5 border border-amber-400 shadow-md flex items-center justify-center overflow-hidden shrink-0">
                <img
                  src="/assets/aistudio/AICTE_325fa493.jpeg"
                  alt="AICTE Logo"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                  <span>AICTE CaseConnect Identity Portal</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Role-Based Access Control (RBAC) & Cross-Bureau Authentication
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Toggle Tabs */}
          <div className="flex gap-2 mt-4 pt-3 border-t border-slate-800/80 text-xs">
            <button
              onClick={() => {
                setAuthModalMode('login');
                setLoginError('');
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold transition ${
                authModalMode === 'login'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Officer Sign In</span>
            </button>
            <button
              onClick={() => {
                setAuthModalMode('signup');
                setSignupError('');
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-bold transition ${
                authModalMode === 'signup'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Register Officer (Role Model)</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[75vh] text-xs">
          {authModalMode === 'login' ? (
            <div className="space-y-5">
              {/* Quick 1-Click Role Profiles for Evaluation */}
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-emerald-600" />
                    <span>Quick Sign-In by Officer Role (Pre-configured Profiles)</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">1-Click Fast Auth</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {users.slice(0, 5).map(u => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => handleQuickLogin(u.email)}
                      className={`text-left p-2.5 rounded border transition flex flex-col justify-between hover:border-blue-500 hover:bg-blue-50/50 ${
                        currentUser?.id === u.id
                          ? 'border-blue-500 bg-blue-50/40 ring-1 ring-blue-300'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 truncate">{u.name}</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded font-semibold bg-slate-100 text-slate-700">
                          {u.role}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500 truncate mt-0.5">{u.designation}</span>
                      <span className="text-[10px] text-blue-700 font-mono mt-1">{u.email}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Standard Email / Password Form */}
              <form onSubmit={handleLoginSubmit} className="space-y-4 pt-1">
                <div className="flex items-center gap-2">
                  <div className="h-px bg-slate-200 flex-1" />
                  <span className="text-slate-400 font-medium text-[11px] uppercase tracking-wider">
                    Or Sign In with Official Email
                  </span>
                  <div className="h-px bg-slate-200 flex-1" />
                </div>

                {loginError && (
                  <div className="p-3 rounded bg-rose-50 border border-rose-200 text-rose-800 font-medium flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-600" />
                    <span>{loginError}</span>
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Official AICTE / NIC Email ID</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      placeholder="e.g. pgrc.officer1@aicte-india.org"
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={e => setLoginPassword(e.target.value)}
                      placeholder="Enter credentials"
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Default prototype password: <code className="font-mono text-slate-600">password123</code>
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Secured via role-aware intranet session
                  </span>
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm transition"
                  >
                    <span>Authenticate Officer</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <form onSubmit={handleSignupSubmit} className="space-y-4">
              {signupError && (
                <div className="p-3 rounded bg-rose-50 border border-rose-200 text-rose-800 font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-600" />
                  <span>{signupError}</span>
                </div>
              )}

              {/* Role Selection Model */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-800">
                  Select Officer Role (Access Control Model)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(['Senior Management', 'RB Officer', 'PGRC Officer', 'Regional Officer', 'Administrator'] as UserRole[]).map(role => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleRoleChange(role)}
                      className={`text-left p-3 rounded-lg border transition ${
                        signupRole === role
                          ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-300'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-900">{role}</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-semibold bg-slate-100 text-slate-700">
                          {roleDescriptions[role].badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{roleDescriptions[role].desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Role Permissions Card */}
              <div className="p-3.5 rounded-lg bg-blue-50/60 border border-blue-200 space-y-1.5">
                <span className="font-bold text-blue-900 block flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-blue-700" />
                  <span>Granted Permissions for {signupRole}:</span>
                </span>
                <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-700 pt-1">
                  {roleDescriptions[signupRole].permissions.map((p, idx) => (
                    <div key={idx} className="flex items-center gap-1">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Officer Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name & Title</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={signupName}
                      onChange={e => setSignupName(e.target.value)}
                      placeholder="e.g. Dr. Rajesh K. Nair"
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded text-xs bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Official Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={signupEmail}
                      onChange={e => setSignupEmail(e.target.value)}
                      placeholder="e.g. rajesh.nair@aicte-india.org"
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded text-xs bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Bureau / Cell Affiliation</label>
                  <select
                    value={signupBureau}
                    onChange={e => setSignupBureau(e.target.value as BureauType)}
                    className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-xs font-medium"
                  >
                    <option value="PGRC">Public Grievance Redressal Cell (PGRC)</option>
                    <option value="Regulation Bureau">Regulation Bureau (RB)</option>
                    <option value="Approval Bureau">Approval Bureau</option>
                    <option value="Legal Cell">Legal Cell</option>
                    <option value="Skill Development">Skill Development Bureau</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Official Designation</label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={signupDesignation}
                      onChange={e => setSignupDesignation(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded text-xs bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Employee / Officer ID</label>
                  <input
                    type="text"
                    required
                    value={signupEmployeeId}
                    onChange={e => setSignupEmployeeId(e.target.value)}
                    className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-xs font-mono"
                  />
                </div>

                {signupRole === 'Regional Officer' && (
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Assigned AICTE Region</label>
                    <select
                      value={signupRegion}
                      onChange={e => setSignupRegion(e.target.value)}
                      className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-xs"
                    >
                      <option value="Western">Western Region (Mumbai/Pune)</option>
                      <option value="Northern">Northern Region (Kanpur/Lucknow)</option>
                      <option value="Southern">Southern Region (Chennai)</option>
                      <option value="Eastern">Eastern Region (Kolkata)</option>
                      <option value="North-Western">North-Western (Chandigarh/Jaipur)</option>
                      <option value="Central">Central Region (Bhopal)</option>
                    </select>
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={signupPassword}
                    onChange={e => setSignupPassword(e.target.value)}
                    className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    required
                    value={signupConfirmPassword}
                    onChange={e => setSignupConfirmPassword(e.target.value)}
                    className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Registered account will immediately persist to storage docket.
                </span>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm transition"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Register & Create Officer Session</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
