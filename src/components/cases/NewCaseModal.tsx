import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BureauType, CaseCategory, CasePriority, SourceChannel } from '../../types';
import { X, Building2, AlertCircle, FilePlus2, Check } from 'lucide-react';

export const NewCaseModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { institutions, createCase, activeRole, setCurrentView, viewCaseDetails } = useApp();

  const [selectedInstId, setSelectedInstId] = useState<string>(institutions[0]?.id || '');
  const [isManualInst, setIsManualInst] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualPermanentId, setManualPermanentId] = useState('');
  const [manualState, setManualState] = useState('Maharashtra');
  const [manualDistrict, setManualDistrict] = useState('Pune');
  const [manualRegion, setManualRegion] = useState<'Northern' | 'Western' | 'Southern' | 'Eastern' | 'North-Western' | 'Central'>('Western');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [bureau, setBureau] = useState<BureauType>(activeRole.includes('RB') ? 'Regulation Bureau' : 'PGRC');
  const [category, setCategory] = useState<CaseCategory>('Internal Assessment & Examination Irregularity');
  const [subcategory, setSubcategory] = useState('');
  const [priority, setPriority] = useState<CasePriority>('High');
  const [sourceChannel, setSourceChannel] = useState<SourceChannel>('CPGRAMS');
  const [complainantType, setComplainantType] = useState<any>('Student');

  if (!isOpen) return null;

  const currentSelectedInst = institutions.find(i => i.id === selectedInstId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert('Please fill out both the case title and complaint description.');
      return;
    }

    const instName = isManualInst ? manualName : currentSelectedInst?.name || 'Unknown Institution';
    const permId = isManualInst ? (manualPermanentId || 'PENDING') : currentSelectedInst?.aictePermanentId || 'PENDING';
    const stateVal = isManualInst ? manualState : currentSelectedInst?.state || 'Maharashtra';
    const distVal = isManualInst ? manualDistrict : currentSelectedInst?.district || 'Pune';
    const regVal = isManualInst ? manualRegion : currentSelectedInst?.region || 'Western';

    const now = new Date();
    const dateReceived = now.toISOString().split('T')[0];
    
    // SLA due date: Critical = 7 days, High = 21 days, Medium = 30 days
    const dueDays = priority === 'Critical' ? 7 : priority === 'High' ? 21 : 30;
    const dueDateObj = new Date();
    dueDateObj.setDate(dueDateObj.getDate() + dueDays);
    const dueDate = dueDateObj.toISOString().split('T')[0];

    const newRecord = createCase({
      title,
      description,
      institutionId: isManualInst ? `INST-NEW-${Date.now()}` : selectedInstId,
      aictePermanentId: permId,
      institutionName: instName,
      sourceChannel,
      bureau,
      category,
      subcategory: subcategory || category,
      priority,
      status: 'New',
      assignedOfficer: {
        id: `OFF-AUTO`,
        name: `Officer (${activeRole})`,
        email: 'officer@aicte-india.org',
        bureau,
      },
      dateReceived,
      dueDate,
      region: regVal,
      state: stateVal,
      district: distVal,
      complainantType,
    });

    onClose();
    // Open the new case in drawer for immediate inspection
    viewCaseDetails(newRecord.id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col animate-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between rounded-t-lg">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-blue-600 text-white">
              <FilePlus2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Register New Institutional Case</h3>
              <p className="text-[11px] text-slate-400">Intake module with automated cross-bureau overlap analysis</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Institution Selection */}
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-800 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>Target Institution</span>
              </label>
              <button
                type="button"
                onClick={() => setIsManualInst(!isManualInst)}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
              >
                {isManualInst ? 'Pick from AICTE Registry' : '+ Enter Unlisted / New Entity'}
              </button>
            </div>

            {!isManualInst ? (
              <div>
                <select
                  value={selectedInstId}
                  onChange={e => setSelectedInstId(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded px-3 py-2 bg-white"
                >
                  {institutions.map(inst => (
                    <option key={inst.id} value={inst.id}>
                      {inst.name} — [Permanent ID: {inst.aictePermanentId}] ({inst.district}, {inst.state})
                    </option>
                  ))}
                </select>
                {currentSelectedInst && (
                  <p className="text-[11px] text-slate-500 mt-1.5">
                    Approval Status: <strong className="text-slate-800">{currentSelectedInst.approvalStatus}</strong> • Existing open cases:{' '}
                    <strong className="text-slate-800">{currentSelectedInst.openCasesCount}</strong>
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-2.5">
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Institution Name</label>
                  <input
                    type="text"
                    required
                    value={manualName}
                    onChange={e => setManualName(e.target.value)}
                    placeholder="Full registered college name..."
                    className="w-full text-xs border border-slate-300 rounded px-3 py-1.5 bg-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">AICTE Permanent ID (if known)</label>
                    <input
                      type="text"
                      value={manualPermanentId}
                      onChange={e => setManualPermanentId(e.target.value)}
                      placeholder="e.g. 1-2812948211 or leave blank"
                      className="w-full text-xs border border-slate-300 rounded px-3 py-1.5 bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">State</label>
                    <input
                      type="text"
                      value={manualState}
                      onChange={e => setManualState(e.target.value)}
                      className="w-full text-xs border border-slate-300 rounded px-3 py-1.5 bg-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bureau & Source Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Bureau Jurisdiction</label>
              <select
                value={bureau}
                onChange={e => setBureau(e.target.value as BureauType)}
                className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 bg-white font-medium"
              >
                <option value="PGRC">PGRC (Grievance Cell)</option>
                <option value="Regulation Bureau">Regulation Bureau (RB)</option>
                <option value="Approval Bureau">Approval Bureau</option>
                <option value="Legal Cell">Legal Cell</option>
                <option value="Skill Development">Skill Development</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Source Channel</label>
              <select
                value={sourceChannel}
                onChange={e => setSourceChannel(e.target.value as SourceChannel)}
                className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 bg-white"
              >
                <option value="CPGRAMS">CPGRAMS (Portal)</option>
                <option value="AICTE Web Portal">AICTE Web Portal</option>
                <option value="Physical Petition">Physical Petition / Dak</option>
                <option value="Court Directive">Court Directive</option>
                <option value="Email / Vigilance Reference">Email / Vigilance Reference</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Priority</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as CasePriority)}
                className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 bg-white font-semibold"
              >
                <option value="Critical">Critical (7-Day SLA)</option>
                <option value="High">High (21-Day SLA)</option>
                <option value="Medium">Medium (30-Day SLA)</option>
                <option value="Low">Low (45-Day SLA)</option>
              </select>
            </div>
          </div>

          {/* Category & Subcategory */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Grievance / Issue Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as CaseCategory)}
                className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 bg-white"
              >
                <option value="Faculty & Staff Inadequacy">Faculty & Staff Inadequacy</option>
                <option value="Internal Assessment & Examination Irregularity">Internal Assessment & Examination Irregularity</option>
                <option value="Fee & Financial Malpractice">Fee & Financial Malpractice</option>
                <option value="Infrastructure & Laboratory Deficit">Infrastructure & Laboratory Deficit</option>
                <option value="Capitation Fee / Admission Fraud">Capitation Fee / Admission Fraud</option>
                <option value="Student Harassment & Ragging">Student Harassment & Ragging</option>
                <option value="Document Forgery & Unapproved Courses">Document Forgery & Unapproved Courses</option>
                <option value="Governance & Administrative Non-Compliance">Governance & Administrative Non-Compliance</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Complainant Affiliation</label>
              <select
                value={complainantType}
                onChange={e => setComplainantType(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 bg-white"
              >
                <option value="Student">Enrolled Student</option>
                <option value="Faculty">Faculty / Staff Member</option>
                <option value="Parent">Parent / Guardian</option>
                <option value="Whistleblower / Anonymous">Whistleblower / Anonymous</option>
                <option value="Inspector">AICTE Expert Committee Inspector</option>
                <option value="Public Representative">Public Representative</option>
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Case Subject / Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Non-payment of salary and illegal deduction of attendance marks..."
              className="w-full text-xs border border-slate-300 rounded px-3 py-2 bg-white"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Detailed Complaint Statement</label>
            <textarea
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={4}
              placeholder="Provide exact factual narrative, dates, departments involved, and reference documents..."
              className="w-full text-xs border border-slate-300 rounded p-3 bg-white leading-relaxed"
            />
          </div>

          {/* System Notice */}
          <div className="p-3 rounded bg-blue-50 border border-blue-100 flex items-start gap-2 text-slate-600">
            <AlertCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Upon submission, the explainable cross-bureau matching engine will automatically scan existing records across Regulation Bureau and PGRC to detect potential overlaps.
            </p>
          </div>

          {/* Actions */}
          <div className="pt-2 flex justify-end gap-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded text-slate-700 hover:bg-slate-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm transition"
            >
              Register Case & Execute Overlap Scan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
