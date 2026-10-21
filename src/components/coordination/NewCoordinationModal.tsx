import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { BureauType, CasePriority, CoordinationRequest } from '../../types';
import { X, Network, Send, AlertCircle, Building2 } from 'lucide-react';

export const NewCoordinationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const {
    cases,
    institutions,
    activeRole,
    createCoordination,
    coordinationTargetPair,
  } = useApp();

  const [sourceCaseId, setSourceCaseId] = useState('');
  const [targetCaseId, setTargetCaseId] = useState('');
  const [reason, setReason] = useState('');
  const [requestedAction, setRequestedAction] = useState<CoordinationRequest['requestedAction']>('Corroborate Assessment Records');
  const [targetResponseDays, setTargetResponseDays] = useState(14);
  const [priority, setPriority] = useState<CasePriority>('High');

  useEffect(() => {
    if (coordinationTargetPair) {
      setSourceCaseId(coordinationTargetPair.sourceCaseId);
      setTargetCaseId(coordinationTargetPair.targetCaseId);
    } else if (cases.length >= 2) {
      setSourceCaseId(cases[0].id);
      setTargetCaseId(cases[1].id);
    }
  }, [coordinationTargetPair, cases]);

  if (!isOpen) return null;

  const caseA = cases.find(c => c.id === sourceCaseId);
  const caseB = cases.find(c => c.id === targetCaseId);

  const fromBureau = caseA?.bureau || (activeRole.includes('RB') ? 'Regulation Bureau' : 'PGRC');
  const toBureau: BureauType = caseB?.bureau || (fromBureau === 'PGRC' ? 'Regulation Bureau' : 'PGRC');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert('Please provide a specific administrative reason and purpose for cross-bureau coordination.');
      return;
    }

    const dueDateObj = new Date();
    dueDateObj.setDate(dueDateObj.getDate() + Number(targetResponseDays));
    const targetResponseDate = dueDateObj.toISOString().split('T')[0];

    const instName = caseA?.institutionName || caseB?.institutionName || 'Unknown Entity';
    const instId = caseA?.institutionId || caseB?.institutionId || 'INST-UNKNOWN';
    const permId = caseA?.aictePermanentId || caseB?.aictePermanentId || 'PENDING';

    createCoordination({
      sourceCaseId,
      targetCaseId,
      institutionId: instId,
      institutionName: instName,
      aictePermanentId: permId,
      fromBureau,
      toBureau,
      reason,
      requestedAction,
      targetResponseDate,
      priority,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl border border-slate-200 max-w-xl w-full flex flex-col animate-in zoom-in-95">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between rounded-t-lg">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-cyan-600 text-white">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Initiate Cross-Bureau Coordination Request</h3>
              <p className="text-[11px] text-slate-400">Formal inter-bureau evidence sharing and joint inquiry</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Linked Case Pairs */}
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Requesting Case (Origin)</label>
              <select
                value={sourceCaseId}
                onChange={e => setSourceCaseId(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 bg-white font-mono"
              >
                {cases.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.id} ({c.bureau}) - {c.institutionName.slice(0, 18)}...
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-slate-500 mt-1 block">Bureau: <strong>{fromBureau}</strong></span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Counterpart Case</label>
              <select
                value={targetCaseId}
                onChange={e => setTargetCaseId(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 bg-white font-mono"
              >
                {cases.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.id} ({c.bureau}) - {c.institutionName.slice(0, 18)}...
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-slate-500 mt-1 block">Bureau: <strong>{toBureau}</strong></span>
            </div>
          </div>

          {/* Requested Action & Priority */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Requested Inter-Bureau Action</label>
              <select
                value={requestedAction}
                onChange={e => setRequestedAction(e.target.value as any)}
                className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 bg-white"
              >
                <option value="Corroborate Assessment Records">Corroborate Assessment Records</option>
                <option value="Joint Inspection Committee">Joint Inspection Committee</option>
                <option value="Provide Past Inspection Reports">Provide Past Inspection Reports</option>
                <option value="Regulatory Show-Cause Alignment">Regulatory Show-Cause Alignment</option>
                <option value="Information Clarification">Information Clarification</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Priority Level</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as any)}
                className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 bg-white font-semibold"
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          {/* Target Response Window */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Target Response Window: <strong className="text-blue-700 font-mono">{targetResponseDays} Days</strong>
            </label>
            <input
              type="range"
              min={3}
              max={30}
              step={1}
              value={targetResponseDays}
              onChange={e => setTargetResponseDays(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>3 Days (Urgent)</span>
              <span>14 Days (Standard)</span>
              <span>30 Days (Comprehensive)</span>
            </div>
          </div>

          {/* Coordination Reason */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Coordination Purpose & Evidence Requisition Memo:
            </label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="e.g. Student grievance alleges fraudulent faculty marks; requesting Regulation Bureau surprise inspection findings and teacher attendance logs..."
              className="w-full text-xs border border-slate-300 rounded p-2.5 bg-white leading-relaxed"
            />
          </div>

          {/* Notice */}
          <div className="bg-cyan-50 border border-cyan-200 rounded p-3 text-cyan-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-cyan-700 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Dispatching this coordination request will link both case dossiers, update the institution 360 timeline, and notify the desk officer of <strong>{toBureau}</strong>.
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
              className="px-5 py-2 rounded bg-cyan-700 hover:bg-cyan-800 text-white font-bold shadow-sm transition"
            >
              Dispatch Coordination Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
