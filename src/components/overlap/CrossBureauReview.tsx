import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { OverlapSuggestion, CaseRecord } from '../../types';
import { StatusBadge, PriorityBadge, BureauBadge, ConfidenceBadge } from '../common/Badges';
import {
  GitCompareArrows,
  CheckCircle,
  XCircle,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
  Info,
  Building2,
  Calendar,
  Layers,
  Sparkles,
  ExternalLink,
  Sliders,
  Check,
  X,
  Send,
} from 'lucide-react';

export const CrossBureauReview: React.FC = () => {
  const {
    suggestions,
    cases,
    reviewOverlap,
    viewInstitution360,
    setCurrentView,
    setCoordinationTargetPair,
    setIsNewCoordinationModalOpen,
  } = useApp();

  const [selectedSuggestionId, setSelectedSuggestionId] = useState<string>(
    suggestions[0]?.id || ''
  );
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'Pending Review' | 'Accepted' | 'Rejected' | 'Under Further Investigation'>('Pending Review');

  // Review Form state
  const [reviewDecision, setReviewDecision] = useState<'Accepted' | 'Rejected' | 'Under Further Investigation'>('Accepted');
  const [relationshipType, setRelationshipType] = useState<'Related Cases' | 'Confirmed Duplicate'>('Related Cases');
  const [reviewRemarks, setReviewRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredSuggestions = useMemo(() => {
    return suggestions.filter(s => {
      if (filterStatus === 'ALL') return true;
      return s.status === filterStatus;
    });
  }, [suggestions, filterStatus]);

  // Active selected suggestion
  const activeSuggestion = suggestions.find(s => s.id === selectedSuggestionId) || filteredSuggestions[0];

  const caseA = cases.find(c => c.id === activeSuggestion?.sourceCaseId);
  const caseB = cases.find(c => c.id === activeSuggestion?.targetCaseId);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSuggestion) return;
    if (!reviewRemarks.trim()) {
      alert('A written regulatory justification is mandatory to document the review decision in the audit trail.');
      return;
    }

    setIsSubmitting(true);
    reviewOverlap(activeSuggestion.id, reviewDecision, relationshipType, reviewRemarks);
    setIsSubmitting(false);
    setReviewRemarks('');

    // If accepted, offer to immediately launch coordination
    if (reviewDecision === 'Accepted' && caseA && caseB) {
      if (confirm('Relationship confirmed! Would you like to initiate a Cross-Bureau Coordination Request between the investigating officers now?')) {
        setCoordinationTargetPair({ sourceCaseId: caseA.id, targetCaseId: caseB.id });
        setIsNewCoordinationModalOpen(true);
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header and Regulatory Disclaimer */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Cross-Bureau Overlap Review
              </h1>
              <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">
                Decision Support Engine
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Side-by-side comparative inspection and Human-in-the-Loop review for multi-signal complaint matches
            </p>
          </div>
          <button
            onClick={() => setCurrentView('benchmark')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 transition shadow-2xs"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Open Precision & Recall Benchmark</span>
          </button>
        </div>

        {/* Essential Decision Support Notice */}
        <div className="mt-3 bg-amber-50/70 border border-amber-200 rounded-md p-3 text-xs text-amber-900 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Decision-Support Notice:</strong> The overall match score is an algorithmic decision-support indicator derived from weighted signals, not a statistical probability of guilt or duplicate submission. Matching Permanent IDs confirm institutional identity, but complaints may represent entirely distinct academic tracks. No cases are automatically merged, closed, or altered without explicit human officer verification.
          </p>
        </div>
      </div>

      {/* Main Review Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Ranked Candidate Queue */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Candidate Queue ({filteredSuggestions.length})
            </h3>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value as any)}
              className="text-xs border border-slate-300 rounded px-2 py-1 bg-white font-medium"
            >
              <option value="ALL">All Suggestions</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
              <option value="Under Further Investigation">Under Investigation</option>
            </select>
          </div>

          <div className="space-y-2.5 max-h-[750px] overflow-y-auto pr-1">
            {filteredSuggestions.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 bg-white rounded-lg border border-slate-200">
                No overlap suggestions found matching filter.
              </div>
            ) : (
              filteredSuggestions.map(sug => {
                const isSelected = activeSuggestion?.id === sug.id;
                const c1 = cases.find(c => c.id === sug.sourceCaseId);
                const c2 = cases.find(c => c.id === sug.targetCaseId);

                return (
                  <div
                    key={sug.id}
                    onClick={() => setSelectedSuggestionId(sug.id)}
                    className={`p-3.5 rounded-lg border transition-all cursor-pointer select-none ${
                      isSelected
                        ? 'border-blue-500 ring-2 ring-blue-100 bg-blue-50/20 shadow-sm'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <ConfidenceBadge band={sug.confidenceBand} score={sug.overallScore} />
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {sug.status}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-slate-900 line-clamp-1 mt-1">
                      {c1?.institutionName || 'Unknown Entity'}
                    </div>

                    <div className="flex items-center gap-1.5 mt-1 text-[11px] font-mono text-slate-600">
                      <span className="font-semibold text-blue-900">{sug.sourceCaseId}</span>
                      <span className="text-slate-400">({c1?.bureau})</span>
                      <span className="text-slate-400">↔</span>
                      <span className="font-semibold text-blue-900">{sug.targetCaseId}</span>
                      <span className="text-slate-400">({c2?.bureau})</span>
                    </div>

                    <p className="text-[11px] text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                      {sug.shortExplanation}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Comparative Inspection & Human Review Action */}
        <div className="lg:col-span-8 space-y-5">
          {activeSuggestion && caseA && caseB ? (
            <>
              {/* Evidence Signals Dashboard Card */}
              <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-slate-900">
                        Signal Evaluation & Scoring Breakdown
                      </h2>
                      <ConfidenceBadge band={activeSuggestion.confidenceBand} score={activeSuggestion.overallScore} />
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{activeSuggestion.recommendationLabel}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400">Suggested Action:</span>
                    <span className="block font-bold text-blue-900 text-xs">
                      {activeSuggestion.suggestedRelationshipType}
                    </span>
                  </div>
                </div>

                {/* Mathematical Weight Explanation Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  {/* Signal 1: Permanent ID */}
                  <div className={`p-3 rounded border ${activeSuggestion.signals.permanentIdMatch.matched ? 'bg-emerald-50/50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-700">1. Permanent ID</span>
                      <span className="font-mono font-bold text-slate-900">
                        {activeSuggestion.signals.permanentIdMatch.matched ? '100%' : '0%'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-tight">
                      {activeSuggestion.signals.permanentIdMatch.explanation}
                    </p>
                    <span className="text-[10px] text-slate-400 block mt-1 font-mono">
                      Weight: {activeSuggestion.signals.permanentIdMatch.weight}%
                    </span>
                  </div>

                  {/* Signal 2: Name / Alias */}
                  <div className="p-3 rounded border bg-slate-50 border-slate-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-700">2. Name & Alias</span>
                      <span className="font-mono font-bold text-slate-900">
                        {(activeSuggestion.signals.institutionNameSimilarity.score * 100).toFixed(0)}%
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-tight">
                      {activeSuggestion.signals.institutionNameSimilarity.explanation}
                    </p>
                    <span className="text-[10px] text-slate-400 block mt-1 font-mono">
                      Weight: {activeSuggestion.signals.institutionNameSimilarity.weight}%
                    </span>
                  </div>

                  {/* Signal 3: Geographic Match */}
                  <div className="p-3 rounded border bg-slate-50 border-slate-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-700">3. State & District</span>
                      <span className="font-mono font-bold text-slate-900">
                        {(activeSuggestion.signals.geoSimilarity.score * 100).toFixed(0)}%
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-tight">
                      {activeSuggestion.signals.geoSimilarity.explanation}
                    </p>
                    <span className="text-[10px] text-slate-400 block mt-1 font-mono">
                      Weight: {activeSuggestion.signals.geoSimilarity.weight}%
                    </span>
                  </div>

                  {/* Signal 4: Category Overlap */}
                  <div className="p-3 rounded border bg-slate-50 border-slate-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-700">4. Issue Category</span>
                      <span className="font-mono font-bold text-slate-900">
                        {(activeSuggestion.signals.categorySimilarity.score * 100).toFixed(0)}%
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-tight">
                      {activeSuggestion.signals.categorySimilarity.explanation}
                    </p>
                    <span className="text-[10px] text-slate-400 block mt-1 font-mono">
                      Weight: {activeSuggestion.signals.categorySimilarity.weight}%
                    </span>
                  </div>

                  {/* Signal 5: TF-IDF Text Cosine */}
                  <div className="p-3 rounded border bg-slate-50 border-slate-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-700">5. Vocabulary Overlap</span>
                      <span className="font-mono font-bold text-slate-900">
                        {(activeSuggestion.signals.textSimilarity.score * 100).toFixed(0)}%
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-tight">
                      {activeSuggestion.signals.textSimilarity.explanation}
                    </p>
                    <span className="text-[10px] text-slate-400 block mt-1 font-mono">
                      Weight: {activeSuggestion.signals.textSimilarity.weight}%
                    </span>
                  </div>

                  {/* Signal 6: Temporal Delta */}
                  <div className="p-3 rounded border bg-slate-50 border-slate-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-700">6. Temporal Proximity</span>
                      <span className="font-mono font-bold text-slate-900">
                        {(activeSuggestion.signals.temporalProximity.score * 100).toFixed(0)}%
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-tight">
                      {activeSuggestion.signals.temporalProximity.explanation}
                    </p>
                    <span className="text-[10px] text-slate-400 block mt-1 font-mono">
                      Weight: {activeSuggestion.signals.temporalProximity.weight}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Side-by-Side Comparison Dossier */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Case A Box */}
                <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div>
                      <span className="font-mono font-bold text-blue-900 text-xs block">{caseA.id}</span>
                      <span className="text-[11px] text-slate-500">Source Case (Case A)</span>
                    </div>
                    <BureauBadge bureau={caseA.bureau} />
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-900 leading-snug">{caseA.title}</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">{caseA.category}</p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded border border-slate-100 text-xs text-slate-700 leading-relaxed max-h-48 overflow-y-auto">
                    {caseA.description}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-2 border-t border-slate-100">
                    <div>
                      <span className="text-slate-400 block">Permanent ID:</span>
                      <span className="font-mono font-semibold text-slate-900">{caseA.aictePermanentId}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Date Received:</span>
                      <span className="font-mono text-slate-900">{caseA.dateReceived}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Complainant:</span>
                      <span className="text-slate-900">{caseA.complainantType || 'Student'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Status:</span>
                      <StatusBadge status={caseA.status} />
                    </div>
                  </div>
                </div>

                {/* Case B Box */}
                <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div>
                      <span className="font-mono font-bold text-blue-900 text-xs block">{caseB.id}</span>
                      <span className="text-[11px] text-slate-500">Target Match (Case B)</span>
                    </div>
                    <BureauBadge bureau={caseB.bureau} />
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-slate-900 leading-snug">{caseB.title}</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">{caseB.category}</p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded border border-slate-100 text-xs text-slate-700 leading-relaxed max-h-48 overflow-y-auto">
                    {caseB.description}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-2 border-t border-slate-100">
                    <div>
                      <span className="text-slate-400 block">Permanent ID:</span>
                      <span className="font-mono font-semibold text-slate-900">{caseB.aictePermanentId}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Date Received:</span>
                      <span className="font-mono text-slate-900">{caseB.dateReceived}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Complainant:</span>
                      <span className="text-slate-900">{caseB.complainantType || 'Inspector'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Status:</span>
                      <StatusBadge status={caseB.status} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Human-in-the-Loop Review Form */}
              <div className="bg-white rounded-lg border border-blue-200 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Officer Decision & Adjudication Action
                    </h3>
                    <p className="text-xs text-slate-500">
                      Record review outcome and establish persistent relational links in AICTE docket
                    </p>
                  </div>
                  {activeSuggestion.reviewResult && (
                    <div className="text-right text-xs">
                      <span className="text-slate-400">Reviewed by:</span>{' '}
                      <strong className="text-slate-800">{activeSuggestion.reviewResult.reviewedBy}</strong>
                      <span className="text-slate-400 block text-[10px]">
                        {new Date(activeSuggestion.reviewResult.reviewedAt).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Decision Selection */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1.5">Adjudication Outcome</label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => setReviewDecision('Accepted')}
                          className={`py-2 px-3 rounded border font-semibold text-center transition ${
                            reviewDecision === 'Accepted'
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          Accept Link
                        </button>
                        <button
                          type="button"
                          onClick={() => setReviewDecision('Rejected')}
                          className={`py-2 px-3 rounded border font-semibold text-center transition ${
                            reviewDecision === 'Rejected'
                              ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          Reject Match
                        </button>
                        <button
                          type="button"
                          onClick={() => setReviewDecision('Under Further Investigation')}
                          className={`py-2 px-3 rounded border font-semibold text-center transition ${
                            reviewDecision === 'Under Further Investigation'
                              ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          Investigate
                        </button>
                      </div>
                    </div>

                    {/* Relationship Type */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1.5">Relationship Classification</label>
                      <select
                        value={relationshipType}
                        onChange={e => setRelationshipType(e.target.value as any)}
                        disabled={reviewDecision === 'Rejected'}
                        className="w-full border border-slate-300 rounded px-3 py-2 bg-white text-slate-800 font-medium disabled:opacity-50"
                      >
                        <option value="Related Cases">Related Cases (Distinct complaints sharing institutional root cause)</option>
                        <option value="Confirmed Duplicate">Confirmed Duplicate (Identical petition re-submitted across channels)</option>
                      </select>
                    </div>
                  </div>

                  {/* Mandatory Written Review Reason */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Mandatory Officer Review Justification & Evidence Notes:
                    </label>
                    <textarea
                      required
                      value={reviewRemarks}
                      onChange={e => setReviewRemarks(e.target.value)}
                      rows={2}
                      placeholder="e.g. Verified that student CSE complaint correlates directly with Western Regional inspection finding of absent cadre professors..."
                      className="w-full border border-slate-300 rounded p-2.5 bg-white text-xs leading-relaxed"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <p className="text-[11px] text-slate-500">
                      * Rejecting a match keeps both cases completely intact without deletion.
                    </p>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-5 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm transition"
                    >
                      Record Adjudication in Audit Docket
                    </button>
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg border border-slate-200 p-12 text-center text-slate-400">
              Select a candidate pair from the queue to inspect side-by-side evidence and record review.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
