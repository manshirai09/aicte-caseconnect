import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CaseRecord, CaseStatus, CaseCategory } from '../../types';
import { StatusBadge, PriorityBadge } from '../common/Badges';
import {
  FileText,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  Calendar,
  Send,
  HelpCircle,
  Printer,
  QrCode,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export const ComplainantPortal: React.FC = () => {
  const {
    cases,
    createCase,
    currentUser,
    viewInstitution360,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'track' | 'new' | 'notices'>('track');
  const [selectedCase, setSelectedCase] = useState<CaseRecord | null>(null);

  // New Grievance Form State
  const [grievanceTitle, setGrievanceTitle] = useState('');
  const [grievanceCategory, setGrievanceCategory] = useState<CaseCategory>('Student Harassment & Ragging');
  const [institutionName, setInstitutionName] = useState(currentUser?.institutionName || 'Sunrise Institute of Technology');
  const [permanentId, setPermanentId] = useState(currentUser?.institutionId || '1-XXXXXXX');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccessDocket, setSubmitSuccessDocket] = useState<string | null>(null);

  // Filter complaints associated with the student/complainant (or student petitions)
  const myComplaints = cases.filter(c => {
    if (c.complainantType === 'Student') return true;
    if (c.complainantType === 'Parent') return true;
    if (c.complainantType === 'Faculty') return true;
    return false;
  });

  const handleCreateGrievance = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newRec = createCase({
        title: grievanceTitle,
        description: description,
        institutionName,
        institutionId: 'INST-DEMO-SUNRISE',
        aictePermanentId: permanentId,
        sourceChannel: 'AICTE Web Portal',
        bureau: 'PGRC',
        category: grievanceCategory,
        subcategory: 'Student Petition Sub-clause',
        priority: 'High',
        status: 'New',
        assignedOfficer: {
          id: 'USR-PGRC-01',
          name: 'PGRC Public Intake Officer',
          email: 'pgrc.intake@aicte-india.org',
          bureau: 'PGRC',
        },
        dateReceived: new Date().toISOString().split('T')[0],
        dueDate: '2026-11-15',
        region: 'Western',
        state: currentUser?.state || 'Maharashtra',
        district: 'Pune',
        complainantType: 'Student',
      });

      setIsSubmitting(false);
      setSubmitSuccessDocket(newRec.id);
      setGrievanceTitle('');
      setDescription('');
    }, 400);
  };

  const getStageNumber = (status: CaseStatus) => {
    switch (status) {
      case 'New': return 1;
      case 'Under Review': return 2;
      case 'Coordination Requested':
      case 'In Progress': return 3;
      case 'Awaiting Information':
      case 'Escalated': return 4;
      case 'Resolved':
      case 'Closed': return 5;
      default: return 1;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md relative overflow-hidden">
        <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600 absolute top-0 left-0" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-blue-600/30 border border-blue-500/40 text-blue-400 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-tight">
                  Student & Citizen Grievance Redressal Portal
                </h1>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Citizen Services
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Complainant: <strong className="text-slate-200">{currentUser?.name || 'Aaditya Verma'}</strong> • {currentUser?.institutionName || 'Sunrise Institute of Technology'} ({currentUser?.institutionId || 'PID: 1-XXXXXXX'})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveTab('new');
                setSubmitSuccessDocket(null);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>File New Grievance</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mt-6 pt-4 border-t border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('track')}
            className={`px-4 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'track' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            My Registered Complaints ({myComplaints.length})
          </button>
          <button
            onClick={() => setActiveTab('new')}
            className={`px-4 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'new' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            File New Complaint
          </button>
          <button
            onClick={() => setActiveTab('notices')}
            className={`px-4 py-1.5 rounded-lg font-semibold transition ${
              activeTab === 'notices' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            Official AICTE Notices & Hearing Dates
          </button>
        </div>
      </div>

      {/* Tab 1: Track My Complaints */}
      {activeTab === 'track' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              Active Grievance Dockets & Case Progression
            </h2>
            <span className="text-xs text-slate-500">
              Showing official grievances filed under your student identity
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {myComplaints.map(c => {
              const stage = getStageNumber(c.status);
              return (
                <div
                  key={c.id}
                  className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4 hover:border-blue-400 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                          {c.id}
                        </span>
                        <StatusBadge status={c.status} />
                        <PriorityBadge priority={c.priority} />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mt-1.5">{c.title}</h3>
                      <p className="text-xs text-slate-600 mt-1 line-clamp-2">{c.description}</p>
                    </div>

                    <div className="text-right text-xs text-slate-500 shrink-0">
                      <div>Filed On: <strong className="font-mono text-slate-800">{c.dateReceived}</strong></div>
                      <div>Target Resolution: <strong className="font-mono text-slate-800">{c.dueDate}</strong></div>
                    </div>
                  </div>

                  {/* 5-Stage Live Progress Stepper */}
                  <div className="py-2">
                    <div className="relative flex items-center justify-between">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 z-0" />
                      <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-500 z-0 transition-all duration-500"
                        style={{ width: `${((stage - 1) / 4) * 100}%` }}
                      />

                      {[
                        { num: 1, label: 'Intake Received' },
                        { num: 2, label: 'Preliminary Scrutiny' },
                        { num: 3, label: 'Inter-Bureau Inquiry' },
                        { num: 4, label: 'Official Hearing' },
                        { num: 5, label: 'Final Redressal' },
                      ].map(s => {
                        const isDone = stage >= s.num;
                        const isCurrent = stage === s.num;
                        return (
                          <div key={s.num} className="relative z-10 flex flex-col items-center">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition ${
                                isDone
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'bg-white border-2 border-slate-300 text-slate-400'
                              } ${isCurrent ? 'ring-4 ring-emerald-100 ring-offset-1' : ''}`}
                            >
                              {isDone ? '✓' : s.num}
                            </div>
                            <span
                              className={`text-[10px] mt-1 font-medium whitespace-nowrap hidden sm:block ${
                                isCurrent ? 'text-slate-900 font-bold' : 'text-slate-500'
                              }`}
                            >
                              {s.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Footer Action and Details */}
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="text-slate-500 text-[11px]">
                      <span>Assigned Bureau: <strong>{c.bureau}</strong></span>
                      <span className="mx-2">•</span>
                      <span>Investigating Officer: <strong>{c.assignedOfficer.name}</strong></span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedCase(c)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium transition"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Download Acknowledgement Slip</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: File New Complaint */}
      {activeTab === 'new' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-2xs space-y-6">
          {submitSuccessDocket ? (
            <div className="text-center py-8 space-y-4 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Official Grievance Registered Successfully!
              </h2>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-slate-700">
                <div>Grievance Docket Number: <strong className="text-blue-700 font-bold">{submitSuccessDocket}</strong></div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Dispatched to: AICTE Public Grievance Redressal Cell (PGRC) & Western Regional Office
                </div>
              </div>
              <p className="text-xs text-slate-500">
                You will receive status updates as the scrutiny panel verifies the petition with the college administration.
              </p>
              <button
                onClick={() => setActiveTab('track')}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm transition"
              >
                Track My Grievance Status
              </button>
            </div>
          ) : (
            <form onSubmit={handleCreateGrievance} className="space-y-5">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Lodge Formal Petition or Institutional Grievance
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Submissions are reviewed directly by the AICTE Public Grievance Redressal Cell under statutory protection.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Institution / Engineering College <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={institutionName}
                    onChange={e => setInstitutionName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    AICTE Permanent Institute ID
                  </label>
                  <input
                    type="text"
                    value={permanentId}
                    onChange={e => setPermanentId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Primary Grievance Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={grievanceCategory}
                    onChange={e => setGrievanceCategory(e.target.value as CaseCategory)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Student Harassment & Ragging">Student Harassment & Anti-Ragging Violation</option>
                    <option value="Fee & Financial Malpractice">Fee Irregularity / Capitation Fee / Refund Refusal</option>
                    <option value="Faculty & Staff Inadequacy">Faculty Absenteeism / Phantom Staff / Non-Payment</option>
                    <option value="Internal Assessment & Examination Irregularity">Examination & Internal Assessment Malpractice</option>
                    <option value="Infrastructure & Laboratory Deficit">Laboratory / Library / Infrastructure Deficit</option>
                    <option value="Document Forgery & Unapproved Courses">Unapproved Division / Course Misleading</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Grievance Subject / Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={grievanceTitle}
                    onChange={e => setGrievanceTitle(e.target.value)}
                    placeholder="e.g. Non-refund of cautionary deposit and withholding of original academic transcripts"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Detailed Complaint Narrative & Specific Dates <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Provide specific details, semester/branch, dates of incident, formal complaints made to college principal, and relief requested..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-blue-600 mt-0.5" />
                <span>
                  <strong>Whistleblower & Identity Protection:</strong> Under the AICTE Grievance Regulations, complainants can request confidential hearing status to prevent administrative retaliation.
                </span>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('track')}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-2 transition"
                >
                  {isSubmitting ? 'Registering...' : 'Submit Grievance to AICTE'}
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Tab 3: Official Notices */}
      {activeTab === 'notices' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Official AICTE Hearing Schedule & Bulletins</h2>
              <p className="text-xs text-slate-500 mt-0.5">Statutory directives published for your enrolled institution</p>
            </div>
            <span className="px-2.5 py-1 rounded bg-blue-100 text-blue-800 text-[10px] font-mono font-bold">
              Updated Today
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">
                  Notice: Standing Hearing Committee Hearing — Sunrise Institute of Technology
                </span>
                <span className="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded font-mono font-bold">
                  Nov 04, 2026
                </span>
              </div>
              <p className="text-xs text-slate-600">
                The Western Regional Scrutiny Board has summoned college authorities regarding Case PGRC-2026-0001 (Fee & Examination Malpractice). Complainants may participate via hybrid virtual conference link.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">
                  Advisory: Mandated Anti-Ragging Cell & Student Counselor Compliance
                </span>
                <span className="text-[10px] text-slate-600 bg-slate-200 px-2 py-0.5 rounded font-mono font-bold">
                  General Directive
                </span>
              </div>
              <p className="text-xs text-slate-600">
                All approved technical institutions must prominently display the 24x7 National Anti-Ragging Toll-Free Helpline (1800-180-5522) across all campus blocks.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Official Acknowledgement Slip Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 max-w-lg w-full overflow-hidden p-6 space-y-4 animate-in zoom-in-95">
            <div className="border-b-2 border-slate-800 pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src="/assets/aistudio/AICTE_325fa493.jpeg"
                  alt="AICTE Logo"
                  className="w-10 h-10 object-contain rounded-full border border-amber-400"
                />
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight">
                    All India Council for Technical Education
                  </h3>
                  <p className="text-[10px] text-slate-500">Public Grievance Redressal Cell (PGRC)</p>
                </div>
              </div>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-slate-100 rounded text-slate-600">
                FORM AICTE-PGRC-ACK
              </span>
            </div>

            <div className="text-center py-2">
              <h4 className="text-sm font-bold text-slate-900 underline">
                GRIEVANCE REGISTRATION ACKNOWLEDGEMENT SLIP
              </h4>
              <p className="text-[10px] text-slate-500 mt-0.5">Valid for judicial, RTI & institutional tracking</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Docket Number:</span>
                <span className="font-bold text-blue-700">{selectedCase.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Institution:</span>
                <span className="font-bold text-slate-900 font-sans truncate max-w-[220px]">{selectedCase.institutionName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">AICTE Permanent ID:</span>
                <span className="font-bold text-slate-900">{selectedCase.aictePermanentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Category:</span>
                <span className="font-bold text-slate-900 font-sans">{selectedCase.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Intake Date:</span>
                <span className="font-bold text-slate-900">{selectedCase.dateReceived}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="font-bold text-emerald-700 font-sans">{selectedCase.status}</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-dashed border-slate-300 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <QrCode className="w-8 h-8 text-slate-700 shrink-0" />
                <span className="text-[10px] leading-tight">
                  Scan QR code with DigiLocker or AICTE mobile app to verify authentic registration timestamp.
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedCase(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-lg transition"
              >
                Close Slip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
