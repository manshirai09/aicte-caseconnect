import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CoordinationRequest, CoordinationStatus } from '../../types';
import { StatusBadge, PriorityBadge, BureauBadge } from '../common/Badges';
import {
  Network,
  Plus,
  Send,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building2,
  Calendar,
  ExternalLink,
  ChevronDown,
  UserCheck,
} from 'lucide-react';

export const CoordinationWorkflow: React.FC = () => {
  const {
    coordinations,
    respondCoordination,
    updateCoordinationStatus,
    setIsNewCoordinationModalOpen,
    activeRole,
    viewCaseDetails,
    viewInstitution360,
  } = useApp();

  const [selectedCoordId, setSelectedCoordId] = useState<string>(
    coordinations[0]?.id || ''
  );
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Response inputs
  const [replyMessage, setReplyMessage] = useState('');
  const [replyActionTaken, setReplyActionTaken] = useState('');
  const [newStatusOnReply, setNewStatusOnReply] = useState<CoordinationStatus>('Responded');

  const filteredCoords = coordinations.filter(c => {
    if (filterStatus === 'ALL') return true;
    return c.status === filterStatus;
  });

  const activeCoord = coordinations.find(c => c.id === selectedCoordId) || filteredCoords[0];

  const handleResponseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCoord || !replyMessage.trim()) return;

    respondCoordination(activeCoord.id, replyMessage, replyActionTaken, newStatusOnReply);
    setReplyMessage('');
    setReplyActionTaken('');
  };

  const isReceivingBureau = React.useMemo(() => {
    if (!activeCoord) return true;
    if (activeRole === 'Senior Management' || activeRole === 'Administrator') return true;
    if (activeRole === 'RB Officer' && activeCoord.toBureau === 'Regulation Bureau') return true;
    if (activeRole === 'PGRC Officer' && activeCoord.toBureau === 'PGRC') return true;
    return false;
  }, [activeCoord, activeRole]);

  return (
    <div className="p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Cross-Bureau Coordination Requests
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-100 text-cyan-800 font-bold">
              Inter-Bureau Bridge
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Inter-bureau evidence exchange, joint inspection committees, and regulatory alignment requests
          </p>
        </div>
        <button
          onClick={() => setIsNewCoordinationModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded bg-cyan-700 hover:bg-cyan-800 text-white shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Coordination Request</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Coordination Docket */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Active Coordination Requests ({filteredCoords.length})
            </h3>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="text-xs border border-slate-300 rounded px-2 py-1 bg-white font-medium"
            >
              <option value="ALL">All Statuses</option>
              <option value="Requested">Requested</option>
              <option value="Accepted">Accepted</option>
              <option value="Information Requested">Info Requested</option>
              <option value="Responded">Responded</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
            {filteredCoords.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-lg border border-slate-200">
                No coordination requests matching filter.
              </div>
            ) : (
              filteredCoords.map(coord => {
                const isSelected = activeCoord?.id === coord.id;
                return (
                  <div
                    key={coord.id}
                    onClick={() => setSelectedCoordId(coord.id)}
                    className={`p-3.5 rounded-lg border transition-all cursor-pointer select-none ${
                      isSelected
                        ? 'border-cyan-600 ring-2 ring-cyan-100 bg-cyan-50/20 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono font-bold text-xs text-cyan-900">{coord.requestId}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                          coord.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : coord.status === 'Responded'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-900 animate-pulse'
                        }`}
                      >
                        {coord.status}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-slate-900 line-clamp-1">
                      {coord.institutionName}
                    </div>

                    <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-600 font-medium">
                      <span className="text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded">{coord.fromBureau}</span>
                      <span className="text-slate-400">➔</span>
                      <span className="text-slate-700 bg-cyan-100 text-cyan-900 px-1.5 py-0.5 rounded">{coord.toBureau}</span>
                    </div>

                    <p className="text-[11px] text-slate-600 mt-2 line-clamp-2">
                      <strong className="text-slate-700">{coord.requestedAction}:</strong> {coord.reason}
                    </p>

                    <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span>Target: <strong className="font-mono text-slate-700">{coord.targetResponseDate}</strong></span>
                      <span>{coord.responses.length} Responses</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Active Coordination Dossier & Response Channel */}
        <div className="lg:col-span-7 space-y-5">
          {activeCoord ? (
            <>
              {/* Detailed Request Card */}
              <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm space-y-4 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-base font-bold text-cyan-900">
                        {activeCoord.requestId}
                      </span>
                      <PriorityBadge priority={activeCoord.priority} />
                    </div>
                    <p className="text-slate-500 text-xs mt-0.5">
                      Created on {new Date(activeCoord.createdAt).toLocaleDateString()} by {activeCoord.requestingOfficer}
                    </p>
                  </div>

                  {/* Status Manager */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 text-[11px]">Workflow State:</span>
                    <select
                      value={activeCoord.status}
                      onChange={e => updateCoordinationStatus(activeCoord.id, e.target.value as any)}
                      className="text-xs font-bold border border-slate-300 rounded px-2.5 py-1 bg-white text-slate-800"
                    >
                      <option value="Requested">Requested</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Information Requested">Information Requested</option>
                      <option value="Responded">Responded</option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Institution & Bureau Direction */}
                <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-blue-600" />
                      <span className="font-bold text-slate-900">{activeCoord.institutionName}</span>
                      <span className="font-mono text-slate-600">({activeCoord.aictePermanentId})</span>
                    </div>
                    <button
                      onClick={() => viewInstitution360(activeCoord.institutionId)}
                      className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                    >
                      <span>Institution 360</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Requesting Bureau:</span>
                      <span className="font-semibold text-slate-800">{activeCoord.fromBureau}</span>
                      <button
                        onClick={() => viewCaseDetails(activeCoord.sourceCaseId)}
                        className="text-[11px] text-blue-600 underline block font-mono mt-0.5"
                      >
                        Case: {activeCoord.sourceCaseId}
                      </button>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase">Receiving Bureau:</span>
                      <span className="font-semibold text-slate-800">{activeCoord.toBureau}</span>
                      <button
                        onClick={() => viewCaseDetails(activeCoord.targetCaseId)}
                        className="text-[11px] text-blue-600 underline block font-mono mt-0.5"
                      >
                        Case: {activeCoord.targetCaseId}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Requested Action and Narrative */}
                <div>
                  <h4 className="font-bold text-slate-800 uppercase tracking-wide text-[11px]">
                    Requisition Action: {activeCoord.requestedAction}
                  </h4>
                  <p className="mt-1.5 p-3 rounded bg-white border border-slate-200 text-slate-800 leading-relaxed">
                    {activeCoord.reason}
                  </p>
                </div>
              </div>

              {/* Response Feed & Communication Thread */}
              <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm space-y-4 text-xs">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-cyan-700" />
                  <span>Inter-Bureau Responses & Evidence Logs ({activeCoord.responses.length})</span>
                </h3>

                <div className="space-y-3">
                  {activeCoord.responses.length === 0 ? (
                    <div className="p-4 text-center text-slate-400 bg-slate-50 rounded border border-slate-100">
                      No response has been logged yet by {activeCoord.toBureau}.
                    </div>
                  ) : (
                    activeCoord.responses.map(resp => (
                      <div key={resp.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900">{resp.officerName}</span>
                            <span className="px-1.5 py-0.2 rounded bg-cyan-100 text-cyan-900 font-semibold text-[10px]">
                              {resp.bureau}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(resp.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-slate-800 leading-relaxed bg-white p-2.5 rounded border border-slate-100">
                          {resp.message}
                        </p>
                        {resp.actionTaken && (
                          <div className="text-[11px] text-emerald-700 font-medium pt-1">
                            ✓ Action Recorded: {resp.actionTaken}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Response Entry Form */}
                <form onSubmit={handleResponseSubmit} className="pt-3 border-t border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-slate-800">
                      Record Response / Corroboration Statement:
                    </label>
                    <span className="text-[11px] text-slate-500">
                      Acting as: <strong className="text-slate-700">{activeRole}</strong>
                    </span>
                  </div>

                  <textarea
                    required
                    rows={3}
                    value={replyMessage}
                    onChange={e => setReplyMessage(e.target.value)}
                    placeholder="Enter formal response statement, inspection affidavit references, or corroborating examination findings..."
                    className="w-full text-xs border border-slate-300 rounded p-2.5 bg-white leading-relaxed"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-slate-600 mb-1">Administrative Action Taken (Optional)</label>
                      <input
                        type="text"
                        value={replyActionTaken}
                        onChange={e => setReplyActionTaken(e.target.value)}
                        placeholder="e.g. Scrutiny committee dossier annexed"
                        className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-600 mb-1">Advance Workflow State</label>
                      <select
                        value={newStatusOnReply}
                        onChange={e => setNewStatusOnReply(e.target.value as any)}
                        className="w-full text-xs border border-slate-300 rounded px-2.5 py-1.5 bg-white font-semibold"
                      >
                        <option value="Responded">Responded</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Information Requested">Request More Information</option>
                        <option value="Completed">Mark Coordination Completed</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 px-4 py-2 rounded bg-cyan-700 hover:bg-cyan-800 text-white font-bold shadow-sm transition"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Transmit Official Response</span>
                    </button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg border border-slate-200 p-12 text-center text-slate-400">
              Select a coordination request from the queue to view details and communication history.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
