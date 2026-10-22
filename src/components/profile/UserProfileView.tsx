import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BureauType, UserRole } from '../../types';
import { BureauBadge } from '../common/Badges';
import {
  User,
  Shield,
  Building2,
  Lock,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  FileText,
  Network,
  Eye,
  EyeOff,
  Bell,
  Clock,
  History,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export const UserProfileView: React.FC = () => {
  const {
    currentUser,
    updateUserProfile,
    changePassword,
    cases,
    coordinations,
    auditLogs,
    setCurrentView,
    viewCaseDetails,
    setIsAuthModalOpen,
    setAuthModalMode,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'assignments' | 'edit' | 'security' | 'activity'>('assignments');

  // Edit Profile form state
  const [name, setName] = useState(currentUser?.name || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [designation, setDesignation] = useState(currentUser?.designation || '');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 11 2958 1000');
  const [region, setRegion] = useState(currentUser?.region || 'Western');
  const [officeAddress, setOfficeAddress] = useState(
    currentUser?.officeAddress || 'AICTE Headquarters, Nelson Mandela Marg, Vasant Kunj, New Delhi - 110070'
  );
  const [secondaryBureaus, setSecondaryBureaus] = useState<BureauType[]>(
    currentUser?.secondaryBureaus || ['Approval Bureau', 'Legal Cell']
  );
  const [notificationsEnabled, setNotificationsEnabled] = useState(currentUser?.notificationsEnabled ?? true);
  const [profileSaving, setProfileSaving] = useState(false);

  // Change Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);

  // Sync state when currentUser changes
  React.useEffect(() => {
    if (currentUser) {
      setName(currentUser.name);
      setEmail(currentUser.email);
      setDesignation(currentUser.designation);
      setPhone(currentUser.phone || '+91 11 2958 1000');
      setRegion(currentUser.region || 'Western');
      setOfficeAddress(currentUser.officeAddress || 'AICTE Headquarters, Nelson Mandela Marg, Vasant Kunj, New Delhi - 110070');
      setSecondaryBureaus(currentUser.secondaryBureaus || ['Approval Bureau', 'Legal Cell']);
      setNotificationsEnabled(currentUser.notificationsEnabled ?? true);
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-4">
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-xs">
          <p className="font-bold">No active officer session found.</p>
          <p className="mt-1">Please sign in with your official AICTE credentials to access your profile and bureau assignments.</p>
        </div>
        <button
          onClick={() => {
            setAuthModalMode('login');
            setIsAuthModalOpen(true);
          }}
          className="px-4 py-2 rounded bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 shadow-sm"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  // Calculate officer caseload metrics
  const assignedCases = cases.filter(
    c => c.assignedOfficer.email.toLowerCase() === currentUser.email.toLowerCase() ||
         c.assignedOfficer.name.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[1] || currentUser.name.toLowerCase())
  );
  const openAssignedCases = assignedCases.filter(c => c.status !== 'Resolved' && c.status !== 'Closed');
  
  const officerCoordinations = coordinations.filter(
    c => c.fromBureau === currentUser.bureau || c.toBureau === currentUser.bureau
  );

  const officerLogs = auditLogs.filter(
    log => log.userId === currentUser.id || log.userName.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[0] || '')
  );

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);
    const res = updateUserProfile({
      name,
      email,
      designation,
      phone,
      region: currentUser.role === 'Regional Officer' ? region : currentUser.region,
      officeAddress,
      secondaryBureaus,
      notificationsEnabled,
    });
    setProfileSaving(false);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters in length.');
      return;
    }

    setPasswordSaving(true);
    const res = changePassword(currentPassword, newPassword);
    setPasswordSaving(false);

    if (res.success) {
      setPasswordSuccess('Password successfully updated and recorded in audit log.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPasswordError(res.error || 'Failed to update password.');
    }
  };

  const toggleSecondaryBureau = (bureau: BureauType) => {
    if (bureau === currentUser.bureau) return; // cannot toggle primary
    setSecondaryBureaus(prev =>
      prev.includes(bureau) ? prev.filter(b => b !== bureau) : [...prev, bureau]
    );
  };

  const allBureaus: BureauType[] = [
    'Regulation Bureau',
    'PGRC',
    'Approval Bureau',
    'Legal Cell',
    'Skill Development',
  ];

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Officer Identity Card Header */}
      <div className="bg-slate-900 text-white rounded-xl shadow-lg border border-slate-800 p-6 relative overflow-hidden">
        {/* Subtle decorative Gov tricolor line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600 absolute top-0 left-0" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mt-1">
          <div className="flex items-center gap-4">
            {/* AICTE Logo Emblem avatar */}
            <div className="w-16 h-16 rounded-full bg-white p-1 border-2 border-amber-400 shadow-md flex items-center justify-center shrink-0">
              <img
                src="/assets/aistudio/AICTE_325fa493.jpeg"
                alt="AICTE Official Emblem"
                className="w-full h-full object-contain rounded-full"
              />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white">{currentUser.name}</h1>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-blue-900 text-blue-200 border border-blue-700 font-semibold">
                  {currentUser.role}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Verified Official
                </span>
              </div>

              <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentUser.designation}</span>
                <span className="text-slate-500">•</span>
                <span className="text-amber-400 font-medium">{currentUser.bureau}</span>
              </p>

              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 mt-2 font-mono">
                <span>Employee ID: <strong className="text-slate-200">{currentUser.employeeId}</strong></span>
                <span>•</span>
                <span>Email: <strong className="text-slate-200">{currentUser.email}</strong></span>
                {currentUser.region && (
                  <>
                    <span>•</span>
                    <span>Region: <strong className="text-slate-200">{currentUser.region}</strong></span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stat Counters */}
          <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6 shrink-0 w-full md:w-auto justify-around md:justify-start">
            <div className="text-center px-3">
              <span className="text-[10px] uppercase text-slate-400 block font-semibold">Assigned Cases</span>
              <span className="text-2xl font-bold font-mono text-white">{assignedCases.length}</span>
            </div>
            <div className="text-center px-3">
              <span className="text-[10px] uppercase text-slate-400 block font-semibold">Open Caseload</span>
              <span className="text-2xl font-bold font-mono text-blue-400">{openAssignedCases.length}</span>
            </div>
            <div className="text-center px-3">
              <span className="text-[10px] uppercase text-slate-400 block font-semibold">Bureau Inquiries</span>
              <span className="text-2xl font-bold font-mono text-cyan-400">{officerCoordinations.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center border-b border-slate-200 bg-white px-4 rounded-t-lg text-xs font-semibold shadow-2xs">
        <button
          onClick={() => setActiveTab('assignments')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 transition ${
            activeTab === 'assignments'
              ? 'border-blue-600 text-blue-600 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Bureau Assignments & Jurisdictions</span>
        </button>

        <button
          onClick={() => setActiveTab('edit')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 transition ${
            activeTab === 'edit'
              ? 'border-blue-600 text-blue-600 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Edit Profile Details</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 transition ${
            activeTab === 'security'
              ? 'border-blue-600 text-blue-600 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          <span>Change Password & Security</span>
        </button>

        <button
          onClick={() => setActiveTab('activity')}
          className={`py-3 px-4 border-b-2 flex items-center gap-2 transition ${
            activeTab === 'activity'
              ? 'border-blue-600 text-blue-600 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Officer Activity Log ({officerLogs.length})</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div className="bg-white rounded-b-lg border border-t-0 border-slate-200 p-6 shadow-sm">
        {/* ============================================================== */}
        {/* TAB 1: BUREAU ASSIGNMENTS & JURISDICTIONS */}
        {/* ============================================================== */}
        {activeTab === 'assignments' && (
          <div className="space-y-6 text-xs">
            {/* Primary & Secondary Bureau Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Primary Bureau Box */}
              <div className="p-4 rounded-lg border border-blue-200 bg-blue-50/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-100 px-2 py-0.5 rounded">
                    Primary Operational Bureau
                  </span>
                  <BureauBadge bureau={currentUser.bureau} />
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900">{currentUser.bureau}</h3>
                  <p className="text-slate-600 text-[11px] mt-1 leading-relaxed">
                    {currentUser.bureau === 'Regulation Bureau'
                      ? 'Statutory compliance monitoring, faculty cadre ratio enforcement, continuous internal assessment audit, surprise inspections, and issuing formal regulatory show-cause notices.'
                      : currentUser.bureau === 'PGRC'
                      ? 'National Public Grievance Redressal Cell addressing petitions filed by students, parents, and faculty regarding capitation fee, examination malpractice, and anti-ragging complaints.'
                      : 'Governing statutory body overseeing approval processes, curriculum integration, and legal affairs across technical institutions.'}
                  </p>
                </div>

                <div className="pt-2 border-t border-blue-200/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-600">Administrative Posting:</span>
                  <strong className="text-slate-900">{currentUser.designation}</strong>
                </div>
              </div>

              {/* Secondary / Delegated Jurisdictions */}
              <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 bg-slate-200 px-2 py-0.5 rounded">
                    Delegated & Secondary Bureaus
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    {(currentUser.secondaryBureaus || []).length} Assigned
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {(currentUser.secondaryBureaus && currentUser.secondaryBureaus.length > 0) ? (
                    currentUser.secondaryBureaus.map((sb, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md bg-white border border-slate-300 font-semibold text-slate-800 shadow-2xs text-xs flex items-center gap-1.5"
                      >
                        <Building2 className="w-3.5 h-3.5 text-blue-600" />
                        <span>{sb}</span>
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-400">No secondary bureau delegations specified.</span>
                  )}
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
                  Secondary authorizations permit cross-bureau coordination review, evidence sharing, and joint inquiry participation.
                </p>
              </div>
            </div>

            {/* Assigned Committees and Panels */}
            <div className="p-4 rounded-lg border border-slate-200 bg-white space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-600" />
                <span>Assigned Standing Committees & Scrutiny Panels</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                {(currentUser.assignedCommittees && currentUser.assignedCommittees.length > 0) ? (
                  currentUser.assignedCommittees.map((comm, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-900 block">{comm}</span>
                        <span className="text-[10px] text-slate-500 mt-0.5 block">AICTE Authorized Member</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 col-span-3">No standing committee assignments listed.</p>
                )}
              </div>
            </div>

            {/* Active Caseload Table for Current Officer */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Assigned Actionable Complaint Cases ({assignedCases.length})</span>
                </h3>
                <button
                  onClick={() => setCurrentView('cases')}
                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                >
                  <span>View All in Case Management</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              {assignedCases.length === 0 ? (
                <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-lg border border-slate-200">
                  No cases currently assigned directly to this officer desk.
                </div>
              ) : (
                <div className="overflow-x-auto border border-slate-200 rounded-lg">
                  <table className="w-full text-left text-xs text-slate-700 border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="py-2 px-3">Case ID</th>
                        <th className="py-2 px-3">Target Institution</th>
                        <th className="py-2 px-3">Category</th>
                        <th className="py-2 px-3">Priority</th>
                        <th className="py-2 px-3">Status</th>
                        <th className="py-2 px-3">Target Due</th>
                        <th className="py-2 px-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {assignedCases.map(c => (
                        <tr
                          key={c.id}
                          onClick={() => viewCaseDetails(c.id)}
                          className="hover:bg-blue-50/40 transition cursor-pointer"
                        >
                          <td className="py-2.5 px-3 font-mono font-bold text-blue-900">{c.id}</td>
                          <td className="py-2.5 px-3 font-semibold text-slate-900">{c.institutionName}</td>
                          <td className="py-2.5 px-3 text-slate-600 truncate max-w-[200px]">{c.category}</td>
                          <td className="py-2.5 px-3">{c.priority}</td>
                          <td className="py-2.5 px-3">{c.status}</td>
                          <td className="py-2.5 px-3 font-mono text-[11px]">{c.dueDate}</td>
                          <td className="py-2.5 px-3 text-right">
                            <span className="text-blue-600 font-semibold hover:underline">Inspect</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: EDIT PROFILE DETAILS */}
        {/* ============================================================== */}
        {activeTab === 'edit' && (
          <form onSubmit={handleProfileSubmit} className="space-y-5 text-xs max-w-3xl">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Official Officer Details</h3>
              <p className="text-slate-500 text-[11px]">
                Maintain your official contact particulars and institutional bureau postings
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Officer Name & Title</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official AICTE / NIC Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official Designation</label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={designation}
                    onChange={e => setDesignation(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Official Contact / EPABX Phone</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+91 11 2958 1000"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Employee / Officer ID (Locked)</label>
                <input
                  type="text"
                  disabled
                  value={currentUser.employeeId}
                  className="w-full border border-slate-200 bg-slate-100 rounded px-3 py-2 text-xs font-mono text-slate-600 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Primary Bureau (Fixed Posting)</label>
                <input
                  type="text"
                  disabled
                  value={currentUser.bureau}
                  className="w-full border border-slate-200 bg-slate-100 rounded px-3 py-2 text-xs font-semibold text-slate-700 cursor-not-allowed"
                />
              </div>

              {currentUser.role === 'Regional Officer' && (
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Region</label>
                  <select
                    value={region}
                    onChange={e => setRegion(e.target.value)}
                    className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-xs font-medium"
                  >
                    <option value="Western">Western Region (Mumbai / Pune)</option>
                    <option value="Northern">Northern Region (Kanpur / Lucknow)</option>
                    <option value="Southern">Southern Region (Chennai / Bengaluru)</option>
                    <option value="Eastern">Eastern Region (Kolkata / Bhubaneswar)</option>
                    <option value="North-Western">North-Western Region (Chandigarh / Jaipur)</option>
                    <option value="Central">Central Region (Bhopal)</option>
                  </select>
                </div>
              )}

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Official Desk / Office Address</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <textarea
                    rows={2}
                    value={officeAddress}
                    onChange={e => setOfficeAddress(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Secondary Bureau Delegations Checkbox Group */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <label className="block font-bold text-slate-800">
                Secondary Bureau Inquiries & Delegations
              </label>
              <p className="text-[11px] text-slate-500">
                Select additional Bureaus where you have delegated coordination, investigation, or scrutiny authority:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                {allBureaus.map(b => {
                  const isPrimary = b === currentUser.bureau;
                  const isChecked = isPrimary || secondaryBureaus.includes(b);
                  return (
                    <label
                      key={b}
                      className={`p-2.5 rounded-lg border flex items-center gap-2 cursor-pointer transition ${
                        isPrimary
                          ? 'bg-blue-50/70 border-blue-300 text-blue-900 font-semibold'
                          : isChecked
                          ? 'bg-white border-blue-400 text-slate-900 font-medium'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      <input
                        type="checkbox"
                        disabled={isPrimary}
                        checked={isChecked}
                        onChange={() => toggleSecondaryBureau(b)}
                        className="rounded text-blue-600"
                      />
                      <span className="truncate">{b}</span>
                      {isPrimary && <span className="text-[9px] text-blue-700 font-mono">(Primary)</span>}
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="pt-2 border-t border-slate-100">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={e => setNotificationsEnabled(e.target.checked)}
                  className="rounded text-blue-600 w-4 h-4"
                />
                <div>
                  <span className="font-bold text-slate-800 block">Enable Cross-Bureau Escalation & Overlap Alerts</span>
                  <span className="text-[11px] text-slate-500 block">
                    Receive in-app high-priority toast alerts when related complaints or urgent SLA breaches are flagged.
                  </span>
                </div>
              </label>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
              <button
                type="submit"
                disabled={profileSaving}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition"
              >
                {profileSaving ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        )}

        {/* ============================================================== */}
        {/* TAB 3: CHANGE PASSWORD & SECURITY */}
        {/* ============================================================== */}
        {activeTab === 'security' && (
          <div className="space-y-6 text-xs max-w-xl">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Update Account Credentials</h3>
              <p className="text-slate-500 text-[11px]">
                Ensure your intranet credentials meet AICTE cyber security password complexity guidelines
              </p>
            </div>

            {passwordError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            {passwordSuccess && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Current Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    placeholder="Enter existing password"
                    className="w-full pl-9 pr-10 py-2 border border-slate-300 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-[10px] text-slate-400 mt-0.5 block">
                  Default prototype credential is: <code className="font-mono text-slate-600">password123</code>
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">New Password</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full pl-9 pr-10 py-2 border border-slate-300 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Confirm New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Re-type new password"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded text-xs bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 space-y-1">
                <span className="font-bold text-slate-800 block flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-blue-600" />
                  <span>AICTE Password Requirements:</span>
                </span>
                <ul className="text-[11px] list-disc list-inside space-y-0.5 text-slate-500">
                  <li>At least 6 characters in length</li>
                  <li>Recorded securely with timestamp in the system audit docket</li>
                  <li>Password changes invalidate all previous intranet sessions</li>
                </ul>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={passwordSaving}
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition"
                >
                  {passwordSaving ? 'Updating...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: OFFICER ACTIVITY LOG */}
        {/* ============================================================== */}
        {activeTab === 'activity' && (
          <div className="space-y-4 text-xs">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Recent Official Activity & Actions</h3>
              <p className="text-slate-500 text-[11px]">
                Audit trail of regulatory decisions, status updates, and coordination memos initiated by {currentUser.name}
              </p>
            </div>

            {officerLogs.length === 0 ? (
              <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-lg border border-slate-200">
                No recent activity records found for this officer ID.
              </div>
            ) : (
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left text-xs text-slate-700 border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3">Timestamp</th>
                      <th className="py-2.5 px-3">Action Type</th>
                      <th className="py-2.5 px-3">Target Entity</th>
                      <th className="py-2.5 px-3">Action Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {officerLogs.slice(0, 15).map(log => (
                      <tr key={log.id} className="hover:bg-slate-50/70">
                        <td className="py-2.5 px-3 whitespace-nowrap font-mono text-[11px] text-slate-500">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                            {log.actionType}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap font-mono text-[11px] text-blue-900 font-semibold">
                          {log.targetId}
                        </td>
                        <td className="py-2.5 px-3 text-slate-800">{log.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
