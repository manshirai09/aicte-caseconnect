import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CaseRecord, CaseStatus, BureauType, CasePriority } from '../../types';
import { StatusBadge, PriorityBadge, BureauBadge, ConfidenceBadge } from '../common/Badges';
import {
  X,
  Building,
  UserCheck,
  Calendar,
  AlertCircle,
  Clock,
  ArrowRightLeft,
  MessageSquare,
  Lock,
  Unlock,
  GitCompareArrows,
  Send,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';

export const CaseDetailDrawer: React.FC<{
  caseItem: CaseRecord;
  onClose: () => void;
}> = ({ caseItem, onClose }) => {
  const {
    updateCaseStatus,
    assignOfficer,
    transferBureau,
    addInternalRemark,
    suggestions,
    setCurrentView,
    viewInstitution360,
    setCoordinationTargetPair,
    setIsNewCoordinationModalOpen,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'details' | 'history' | 'remarks' | 'suggestions'>('details');

  // Status update state
  const [newStatus, setNewStatus] = useState<CaseStatus>(caseItem.status);
  const [statusRemarks, setStatusRemarks] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Assign officer state
  const [isAssigning, setIsAssigning] = useState(false);
  const [officerName, setOfficerName] = useState(caseItem.assignedOfficer.name);
  const [officerEmail, setOfficerEmail] = useState(caseItem.assignedOfficer.email);
  const [officerBureau, setOfficerBureau] = useState<BureauType>(caseItem.assignedOfficer.bureau);

  // Transfer bureau state
  const [isTransferring, setIsTransferring] = useState(false);
  const [transferTargetBureau, setTransferTargetBureau] = useState<BureauType>(caseItem.bureau);
  const [transferRemarks, setTransferRemarks] = useState('');

  // Internal remark state
  const [remarkText, setRemarkText] = useState('');
  const [isConfidential, setIsConfidential] = useState(false);

  // Filter cross-bureau suggestions involving this case
  const relatedSuggestions = suggestions.filter(
    s => s.sourceCaseId === caseItem.id || s.targetCaseId === caseItem.id
  );

  const isOverdue = 
    caseItem.status !== 'Resolved' && 
    caseItem.status !== 'Closed' && 
    new Date(caseItem.dueDate).getTime() < new Date('2026-10-21').getTime();

  const handleStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!statusRemarks.trim()) {
      alert('A justification remark is mandatory for official case status changes.');
      return;
    }
    updateCaseStatus(caseItem.id, newStatus, statusRemarks);
    setStatusRemarks('');
    setIsUpdatingStatus(false);
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    assignOfficer(caseItem.id, officerName, officerEmail, officerBureau, 'Assigned by authorized official');
    setIsAssigning(false);
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferRemarks.trim()) {
      alert('Mandatory transfer explanation required.');
      return;
    }
    transferBureau(caseItem.id, transferTargetBureau, transferRemarks);
    setIsTransferring(false);
    setTransferRemarks('');
  };

  const handleRemarkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!remarkText.trim()) return;
    addInternalRemark(caseItem.id, remarkText, isConfidential);
    setRemarkText('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-in fade-in">
      <div className="w-full max-w-3xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-900 text-blue-200 border border-blue-700">
                {caseItem.id}
              </span>
              <BureauBadge bureau={caseItem.bureau} />
              <StatusBadge status={caseItem.status} />
              <PriorityBadge priority={caseItem.priority} />
              {isOverdue && (
                <span className="px-2 py-0.5 rounded bg-rose-900 text-rose-200 text-xs font-bold animate-pulse">
                  OVERDUE SLA
                </span>
              )}
            </div>
            <h2 className="text-base font-bold text-white mt-1.5 line-clamp-1">
              {caseItem.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Institution Reference Banner */}
        <div className="bg-slate-50 px-6 py-2.5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <Building className="w-4 h-4 text-slate-500" />
            <span className="font-bold text-slate-900">{caseItem.institutionName}</span>
            <span className="font-mono text-slate-600 bg-white px-1.5 py-0.5 rounded border border-slate-200">
              ID: {caseItem.aictePermanentId}
            </span>
            <span className="text-slate-500">• {caseItem.district}, {caseItem.state}</span>
          </div>
          <button
            onClick={() => {
              onClose();
              viewInstitution360(caseItem.institutionId);
            }}
            className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
          >
            <span>Open Institution 360</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-slate-200 px-6 text-xs font-medium bg-white">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-3 px-3 border-b-2 transition ${
              activeTab === 'details'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Case Dossier
          </button>
          <button
            onClick={() => setActiveTab('suggestions')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'suggestions'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Cross-Bureau Matches</span>
            {relatedSuggestions.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-800 font-bold">
                {relatedSuggestions.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-3 px-3 border-b-2 transition ${
              activeTab === 'history'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Audit Timeline ({caseItem.actionsHistory.length})
          </button>
          <button
            onClick={() => setActiveTab('remarks')}
            className={`py-3 px-3 border-b-2 flex items-center gap-1 transition ${
              activeTab === 'remarks'
                ? 'border-blue-600 text-blue-600 font-bold'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>Internal Notes</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-700">
              {caseItem.internalRemarks.length}
            </span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'details' && (
            <div className="space-y-6">
              {/* Complaint Description */}
              <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-2xs">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Official Complaint Narrative / Evidence Statement
                </h4>
                <p className="text-xs text-slate-800 leading-relaxed whitespace-pre-line bg-slate-50 p-3 rounded border border-slate-100">
                  {caseItem.description}
                </p>
                {caseItem.subcategory && (
                  <div className="mt-2 text-xs text-slate-600">
                    <span className="font-semibold text-slate-700">Specific Allegation:</span> {caseItem.subcategory}
                  </div>
                )}
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-500 block text-[10px] uppercase">Grievance Category</span>
                  <span className="font-semibold text-slate-800 block mt-0.5">{caseItem.category}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-500 block text-[10px] uppercase">Source Channel</span>
                  <span className="font-semibold text-slate-800 block mt-0.5">{caseItem.sourceChannel}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-500 block text-[10px] uppercase">Complainant Group</span>
                  <span className="font-semibold text-slate-800 block mt-0.5">{caseItem.complainantType || 'General Public'}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-500 block text-[10px] uppercase">Date Received</span>
                  <span className="font-mono text-slate-800 block mt-0.5">{caseItem.dateReceived}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-500 block text-[10px] uppercase">Due Target Date</span>
                  <span className={`font-mono block mt-0.5 font-bold ${isOverdue ? 'text-rose-600' : 'text-slate-800'}`}>
                    {caseItem.dueDate} {isOverdue && '(Breached)'}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-200">
                  <span className="text-slate-500 block text-[10px] uppercase">Assigned Officer</span>
                  <span className="font-semibold text-slate-800 block mt-0.5">{caseItem.assignedOfficer.name}</span>
                </div>
              </div>

              {/* Established Related Cases */}
              {caseItem.relatedCases.length > 0 && (
                <div className="border border-blue-200 bg-blue-50/40 rounded-lg p-4">
                  <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wide flex items-center gap-1.5 mb-2">
                    <GitCompareArrows className="w-4 h-4 text-blue-700" />
                    <span>Established Related Case Links ({caseItem.relatedCases.length})</span>
                  </h4>
                  <div className="space-y-2">
                    {caseItem.relatedCases.map((rel, idx) => (
                      <div key={idx} className="bg-white p-2.5 rounded border border-blue-200 text-xs flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-blue-900">{rel.caseId}</span>
                            <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold text-[10px]">
                              {rel.relationshipType}
                            </span>
                            <span className="text-slate-500 text-[11px] font-mono">Score: {rel.confidenceScore}%</span>
                          </div>
                          <p className="text-slate-600 text-[11px] mt-1">{rel.note}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Modals / Inline Forms */}
              <div className="border-t border-slate-200 pt-4 space-y-3">
                <h4 className="text-xs font-bold uppercase text-slate-700">Official Operational Actions</h4>
                
                {/* Status Update Control */}
                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800">Update Official Case Status</span>
                    <button
                      onClick={() => setIsUpdatingStatus(!isUpdatingStatus)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      {isUpdatingStatus ? 'Cancel' : 'Change Status'}
                    </button>
                  </div>

                  {isUpdatingStatus && (
                    <form onSubmit={handleStatusSubmit} className="space-y-2.5 mt-3 pt-3 border-t border-slate-200">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">New Status</label>
                        <select
                          value={newStatus}
                          onChange={e => setNewStatus(e.target.value as CaseStatus)}
                          className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 bg-white"
                        >
                          <option value="New">New</option>
                          <option value="Under Review">Under Review</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Awaiting Information">Awaiting Information</option>
                          <option value="Coordination Requested">Coordination Requested</option>
                          <option value="Escalated">Escalated</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Official Reason / Remarks (Mandatory for Audit Trail)
                        </label>
                        <textarea
                          value={statusRemarks}
                          onChange={e => setStatusRemarks(e.target.value)}
                          placeholder="Provide regulatory justification for status transition..."
                          rows={2}
                          required
                          className="w-full text-xs border border-slate-300 rounded p-2 bg-white"
                        />
                      </div>

                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setIsUpdatingStatus(false)}
                          className="px-3 py-1 text-xs border rounded bg-white text-slate-700"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-3 py-1 text-xs font-semibold rounded bg-blue-600 text-white hover:bg-blue-700"
                        >
                          Confirm Status Change
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                {/* Transfer Bureau Control */}
                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800">Transfer Bureau Jurisdiction</span>
                    <button
                      onClick={() => setIsTransferring(!isTransferring)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      {isTransferring ? 'Cancel' : 'Transfer Jurisdiction'}
                    </button>
                  </div>

                  {isTransferring && (
                    <form onSubmit={handleTransferSubmit} className="space-y-2.5 mt-3 pt-3 border-t border-slate-200">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Transfer to Bureau</label>
                        <select
                          value={transferTargetBureau}
                          onChange={e => setTransferTargetBureau(e.target.value as BureauType)}
                          className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 bg-white"
                        >
                          <option value="PGRC">PGRC (Public Grievance Redressal Cell)</option>
                          <option value="Regulation Bureau">Regulation Bureau (RB)</option>
                          <option value="Approval Bureau">Approval Bureau</option>
                          <option value="Legal Cell">Legal Cell</option>
                          <option value="Skill Development">Skill Development Bureau</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Transfer Justification
                        </label>
                        <textarea
                          value={transferRemarks}
                          onChange={e => setTransferRemarks(e.target.value)}
                          placeholder="Explain why another Bureau has primary jurisdiction..."
                          rows={2}
                          required
                          className="w-full text-xs border border-slate-300 rounded p-2 bg-white"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setIsTransferring(false)}
                          className="px-3 py-1 text-xs border rounded bg-white text-slate-700"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-3 py-1 text-xs font-semibold rounded bg-indigo-600 text-white hover:bg-indigo-700"
                        >
                          Transfer Jurisdiction
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                {/* Reassign Officer */}
                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800">Reassign Desk Officer</span>
                    <button
                      onClick={() => setIsAssigning(!isAssigning)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      {isAssigning ? 'Cancel' : 'Reassign'}
                    </button>
                  </div>

                  {isAssigning && (
                    <form onSubmit={handleAssignSubmit} className="space-y-2.5 mt-3 pt-3 border-t border-slate-200">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Officer Name</label>
                          <input
                            type="text"
                            value={officerName}
                            onChange={e => setOfficerName(e.target.value)}
                            required
                            className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Officer Email</label>
                          <input
                            type="email"
                            value={officerEmail}
                            onChange={e => setOfficerEmail(e.target.value)}
                            required
                            className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 bg-white"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setIsAssigning(false)}
                          className="px-3 py-1 text-xs border rounded bg-white text-slate-700"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-3 py-1 text-xs font-semibold rounded bg-blue-600 text-white hover:bg-blue-700"
                        >
                          Save Assignment
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'suggestions' && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs text-blue-900 leading-relaxed">
                Explainable matching engine scanned concurrent cases in other Bureaus. Review decision signals before taking action.
              </div>

              {relatedSuggestions.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  No active cross-bureau overlap suggestions found for this case.
                </div>
              ) : (
                relatedSuggestions.map(sug => {
                  const counterpartId = sug.sourceCaseId === caseItem.id ? sug.targetCaseId : sug.sourceCaseId;
                  return (
                    <div key={sug.id} className="border border-slate-200 rounded-lg p-4 bg-white shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-blue-900">{counterpartId}</span>
                          <ConfidenceBadge band={sug.confidenceBand} score={sug.overallScore} />
                        </div>
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-100 font-medium text-slate-700">
                          {sug.status}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700">{sug.shortExplanation}</p>

                      <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded border border-slate-100">
                        <div>
                          <span className="text-slate-500 block">Permanent ID Match:</span>
                          <span className="font-medium text-slate-800">
                            {sug.signals.permanentIdMatch.matched ? 'Exact Match (100%)' : 'Different / Missing'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Category Similarity:</span>
                          <span className="font-medium text-slate-800">
                            {(sug.signals.categorySimilarity.score * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Text Vocabulary Overlap:</span>
                          <span className="font-medium text-slate-800">
                            {(sug.signals.textSimilarity.score * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Days Apart:</span>
                          <span className="font-medium text-slate-800">
                            {sug.signals.temporalProximity.daysDifference} days
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => {
                            onClose();
                            setCurrentView('overlap');
                          }}
                          className="px-2.5 py-1 text-xs border rounded text-slate-700 hover:bg-slate-50"
                        >
                          Inspect Full Comparison
                        </button>
                        <button
                          onClick={() => {
                            setCoordinationTargetPair({
                              sourceCaseId: caseItem.id,
                              targetCaseId: counterpartId,
                            });
                            setIsNewCoordinationModalOpen(true);
                          }}
                          className="px-3 py-1 text-xs rounded bg-blue-600 text-white font-semibold hover:bg-blue-700"
                        >
                          Initiate Coordination
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase text-slate-500">Chrono Audit Trail</h4>
              <div className="relative border-l-2 border-slate-200 ml-3 space-y-4 py-2">
                {caseItem.actionsHistory.map((act, index) => (
                  <div key={act.id || index} className="ml-4 relative">
                    <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-white" />
                    <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{act.action}</span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(act.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        By: <strong className="text-slate-800">{act.user}</strong> ({act.role} - {act.bureau})
                      </p>
                      {act.remarks && (
                        <p className="mt-1 text-xs text-slate-700 bg-white p-2 rounded border border-slate-100">
                          {act.remarks}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'remarks' && (
            <div className="space-y-4">
              <form onSubmit={handleRemarkSubmit} className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Add Investigating Note</span>
                  <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isConfidential}
                      onChange={e => setIsConfidential(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>Mark Confidential</span>
                  </label>
                </div>
                <textarea
                  value={remarkText}
                  onChange={e => setRemarkText(e.target.value)}
                  placeholder="Record officer remarks, inspection notes, or phone verification outcomes..."
                  rows={2}
                  className="w-full text-xs border border-slate-300 rounded p-2 bg-white"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded bg-slate-900 text-white hover:bg-slate-800"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Save Note</span>
                  </button>
                </div>
              </form>

              <div className="space-y-2.5">
                {caseItem.internalRemarks.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">No internal notes added yet.</p>
                ) : (
                  caseItem.internalRemarks.map(rem => (
                    <div
                      key={rem.id}
                      className={`p-3 rounded border text-xs ${
                        rem.isConfidential
                          ? 'bg-amber-50/50 border-amber-200'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900">{rem.officerName}</span>
                          <span className="text-slate-500 text-[10px]">({rem.officerBureau})</span>
                          {rem.isConfidential && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-200 text-amber-900 font-bold flex items-center gap-1">
                              <Lock className="w-2.5 h-2.5" />
                              CONFIDENTIAL
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(rem.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">{rem.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
