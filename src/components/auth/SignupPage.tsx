import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole, BureauType } from '../../types';
import {
  User,
  Mail,
  Lock,
  Phone,
  Building2,
  MapPin,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  Briefcase,
  Layers,
  Sparkles,
} from 'lucide-react';

export const SignupPage: React.FC = () => {
  const { signup, setCurrentView } = useApp();

  const [role, setRole] = useState<UserRole>('Student / Complainant');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+91 ');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [institutionName, setInstitutionName] = useState('Sunrise Institute of Technology');
  const [institutionId, setInstitutionId] = useState('1-XXXXXXX');
  const [state, setState] = useState('Maharashtra');
  const [region, setRegion] = useState('Western');
  const [designation, setDesignation] = useState('Student / Complainant');
  const [employeeId, setEmployeeId] = useState(`STU-${Math.floor(1000 + Math.random() * 9000)}`);
  const [bureau, setBureau] = useState<BureauType>('PGRC');
  const [consentTerms, setConsentTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingSuccess, setPendingSuccess] = useState<any | null>(null);

  const isOfficerRole = role !== 'Student / Complainant';

  const handleRoleSelection = (selected: UserRole) => {
    setRole(selected);
    setError('');
    if (selected === 'Student / Complainant') {
      setDesignation('Student / Citizen Complainant');
      setBureau('PGRC');
      setEmployeeId(`STU-${Math.floor(1000 + Math.random() * 9000)}`);
    } else if (selected === 'RB Officer') {
      setDesignation('Regulation Scrutiny Officer');
      setBureau('Regulation Bureau');
      setEmployeeId(`AICTE-RB-${Math.floor(100 + Math.random() * 900)}`);
    } else if (selected === 'PGRC Officer') {
      setDesignation('Assistant Grievance Redressal Officer');
      setBureau('PGRC');
      setEmployeeId(`AICTE-PGRC-${Math.floor(100 + Math.random() * 900)}`);
    } else if (selected === 'Regional Officer') {
      setDesignation('Regional Inspection Officer');
      setBureau('Regulation Bureau');
      setEmployeeId(`AICTE-REG-${Math.floor(100 + Math.random() * 900)}`);
    } else if (selected === 'Senior Management') {
      setDesignation('Appellate Advisor / Joint Secretary');
      setBureau('Regulation Bureau');
      setEmployeeId(`AICTE-EXEC-${Math.floor(100 + Math.random() * 900)}`);
    } else if (selected === 'Administrator') {
      setDesignation('Systems & Security Engineer');
      setBureau('Regulation Bureau');
      setEmployeeId(`AICTE-IT-${Math.floor(100 + Math.random() * 900)}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim() || !email.trim()) {
      setError('Please fill in your full name and email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters in length.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!consentTerms) {
      setError('Please agree to the AICTE Terms of Service and Verification Policy.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = signup({
        name: fullName,
        email,
        phone,
        role,
        bureau,
        designation,
        employeeId,
        institutionName,
        institutionId,
        state,
        region,
        password,
      });

      setLoading(false);
      if (res.success) {
        if (res.pendingApproval) {
          setPendingSuccess(res.user);
        }
        // If active, AppContext automatically redirects to role dashboard
      } else {
        setError(res.error || 'Registration failed.');
      }
    }, 450);
  };

  if (pendingSuccess) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl p-8 text-center space-y-5 animate-in zoom-in-95">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 mx-auto flex items-center justify-center shadow-lg">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
              Account Status: PENDING APPROVAL
            </span>
            <h2 className="text-xl font-bold text-white mt-2">Officer Registration Docket Submitted</h2>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
              Your request for <strong className="text-white">{pendingSuccess.role}</strong> credentials has been recorded. In accordance with AICTE zero-trust security policy, all privileged officer accounts must be verified and approved by the System Administrator before access is enabled.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-left text-xs space-y-1.5 font-mono">
            <div className="text-slate-400 flex justify-between">
              <span>Applicant Name:</span>
              <strong className="text-white font-sans">{pendingSuccess.name}</strong>
            </div>
            <div className="text-slate-400 flex justify-between">
              <span>Applied Role:</span>
              <strong className="text-blue-400">{pendingSuccess.role}</strong>
            </div>
            <div className="text-slate-400 flex justify-between">
              <span>Registered Email:</span>
              <strong className="text-slate-200">{pendingSuccess.email}</strong>
            </div>
            <div className="text-slate-400 flex justify-between">
              <span>Application ID:</span>
              <strong className="text-amber-400">{pendingSuccess.employeeId}</strong>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setCurrentView('login')}
              className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-sm"
            >
              Return to Sign In
            </button>
            <button
              onClick={() => setCurrentView('dashboard')}
              className="py-2.5 px-4 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-medium text-xs transition"
            >
              Public Dashboard Preview
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Tricolour Accent Line */}
      <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600 fixed top-0 left-0 z-50 shadow-md" />

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
                Registration Portal
              </span>
            </div>
            <p className="text-[10px] text-amber-400 font-medium">
              One Institution. Connected Cases. Coordinated Action.
            </p>
          </div>
        </div>

        <button
          onClick={() => setCurrentView('login')}
          className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 transition"
        >
          Already have an account? Sign In →
        </button>
      </header>

      {/* Main Registration Form */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10">
        <div className="w-full max-w-3xl bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 font-mono">
              Account Provisioning & Identity Registration
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
              Create AICTE CaseConnect Account
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Register as a student/complainant for instant access, or apply for an authorized AICTE bureau role.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <div>
                <strong className="block font-semibold">Validation Error</strong>
                <span>{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Account Category / Role Selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                1. Select Account Type & Role Model <span className="text-rose-400">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {[
                  {
                    id: 'Student / Complainant' as UserRole,
                    title: 'Student / Complainant',
                    desc: 'Instant citizen activation. Track complaints & grievances.',
                    badge: 'Public • Instant Active',
                    highlight: true,
                  },
                  {
                    id: 'RB Officer' as UserRole,
                    title: 'RB Officer',
                    desc: 'Regulation Bureau show-cause & norms compliance.',
                    badge: 'Officer • Needs Admin Approval',
                  },
                  {
                    id: 'PGRC Officer' as UserRole,
                    title: 'PGRC Officer',
                    desc: 'Public Grievance Redressal Cell investigations.',
                    badge: 'Officer • Needs Admin Approval',
                  },
                  {
                    id: 'Regional Officer' as UserRole,
                    title: 'Regional Officer',
                    desc: 'Western/Northern regional office jurisdiction.',
                    badge: 'Officer • Needs Admin Approval',
                  },
                  {
                    id: 'Senior Management' as UserRole,
                    title: 'Senior Management',
                    desc: 'Executive Chairman, VC, Member Secretary oversight.',
                    badge: 'Apex • Needs Admin Approval',
                  },
                  {
                    id: 'Administrator' as UserRole,
                    title: 'System Admin',
                    desc: 'System IT management, roles & weights governance.',
                    badge: 'IT Cell • Needs Admin Approval',
                  },
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleRoleSelection(item.id)}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                      role === item.id
                        ? 'border-blue-500 bg-blue-950/50 ring-1 ring-blue-500/50'
                        : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-xs text-white">{item.title}</span>
                        {role === item.id && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">{item.desc}</p>
                    </div>
                    <span
                      className={`mt-2 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded self-start ${
                        item.highlight
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {item.badge}
                    </span>
                  </button>
                ))}
              </div>

              {isOfficerRole && (
                <div className="mt-3 p-3 rounded-xl bg-amber-950/40 border border-amber-700/60 text-xs text-amber-200 flex items-start gap-2.5">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                  <div>
                    <strong className="block font-semibold">Strict Officer Scrutiny Policy:</strong>
                    <span>
                      Public users cannot automatically obtain officer credentials. Upon signup, your account will be placed into <span className="font-mono font-bold text-amber-300">PENDING APPROVAL</span> status and reviewed by an AICTE IT Administrator.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Personal & Contact Credentials */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                2. Contact & Identity Details
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="e.g. Aaditya S. Verma"
                      className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Email Address <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder={isOfficerRole ? 'officer@aicte-india.org' : 'name@example.com'}
                      className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Mobile / Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    {isOfficerRole ? 'Employee / ID Reference' : 'Roll No / Registration ID'}
                  </label>
                  <input
                    type="text"
                    value={employeeId}
                    onChange={e => setEmployeeId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Institution & Geographic Jurisdictions */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                3. Institution & Geographic Jurisdiction
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Associated Institution Name</label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={institutionName}
                      onChange={e => setInstitutionName(e.target.value)}
                      placeholder="e.g. Sunrise Institute of Technology"
                      className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">AICTE Permanent ID (if known)</label>
                  <input
                    type="text"
                    value={institutionId}
                    onChange={e => setInstitutionId(e.target.value)}
                    placeholder="e.g. 1-XXXXXXX"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">State / UT</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={state}
                      onChange={e => setState(e.target.value)}
                      placeholder="Maharashtra"
                      className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">AICTE Regional Jurisdiction</label>
                  <select
                    value={region}
                    onChange={e => setRegion(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Western">Western Region (Maharashtra, Goa, Gujarat)</option>
                    <option value="Northern">Northern Region (Delhi, UP, Haryana)</option>
                    <option value="Southern">Southern Region (Tamil Nadu, Kerala)</option>
                    <option value="Eastern">Eastern Region (West Bengal, Odisha, Bihar)</option>
                    <option value="Central">Central Region (MP, Chhattisgarh)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 4: Password & Security */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                4. Account Security Password <span className="text-rose-400">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Minimum 6 characters"
                      className="w-full pl-9 pr-10 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">Confirm Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Terms Consent */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
              <label className="flex items-start gap-2.5 cursor-pointer select-none text-slate-300">
                <input
                  type="checkbox"
                  required
                  checked={consentTerms}
                  onChange={e => setConsentTerms(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-[11px] leading-relaxed text-slate-400">
                  I hereby declare that all details provided are authentic. I agree to comply with the AICTE Act 1987, CaseConnect Terms of Service, and understand that fraudulent representations will be reported to competent authorities.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition"
            >
              {loading ? (
                <span>Registering Account...</span>
              ) : (
                <>
                  <span>
                    {isOfficerRole
                      ? 'Submit Officer Registration for Approval'
                      : 'Activate Student / Complainant Account'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 py-3 border-t border-slate-800 bg-slate-950 text-center text-[11px] text-slate-500 relative z-10">
        AICTE CaseConnect Identity & Access Management • Government of India
      </footer>
    </div>
  );
};
