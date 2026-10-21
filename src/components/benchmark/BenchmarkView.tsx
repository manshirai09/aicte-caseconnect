import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { runMatcherEvaluation, getLabelledBenchmarkPairs } from '../../services/evaluationService';
import { ConfidenceBadge } from '../common/Badges';
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  Info,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const BenchmarkView: React.FC = () => {
  const { cases, institutions, weights, suggestions } = useApp();

  const [threshold, setThreshold] = useState(50);
  const [evaluationTime, setEvaluationTime] = useState<string>(new Date().toLocaleTimeString());

  const acceptedCount = suggestions.filter(s => s.status === 'Accepted').length;
  const rejectedCount = suggestions.filter(s => s.status === 'Rejected').length;

  const evaluationResult = React.useMemo(() => {
    return runMatcherEvaluation(cases, institutions, weights, threshold, acceptedCount, rejectedCount);
  }, [cases, institutions, weights, threshold, acceptedCount, rejectedCount, evaluationTime]);

  const benchmarkPairs = React.useMemo(() => {
    return getLabelledBenchmarkPairs(cases);
  }, [cases]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Cross-Bureau Matcher Evaluation & Benchmark Suite
              </h1>
              <span className="text-xs px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 font-bold">
                SIH26264 Evaluation Engine
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Automated testing suite evaluating matching accuracy, precision, recall, and F1 score against ground-truth pairs
            </p>
          </div>
          <button
            onClick={() => setEvaluationTime(new Date().toLocaleTimeString())}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Re-Run Benchmark Tests</span>
          </button>
        </div>

        {/* Realistic Data Disclosure */}
        <div className="mt-3 bg-slate-50 border border-slate-200 rounded p-3 text-xs text-slate-600 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Empirical Evaluation Policy:</strong> Metrics below are computed strictly from curated synthetic test pairs covering true positives, false positives, cross-institute similarities, and same-institution dissimilarities. No figures are hardcoded or fabricated.
          </p>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Precision */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase">Related-Case Precision</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-emerald-600">
              {(evaluationResult.precision * 100).toFixed(1)}%
            </span>
            <span className="text-xs text-slate-400 font-mono">TP / (TP + FP)</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Fraction of flagged links that are truly related.
          </p>
        </div>

        {/* Recall */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase">Related-Case Recall</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-blue-600">
              {(evaluationResult.recall * 100).toFixed(1)}%
            </span>
            <span className="text-xs text-slate-400 font-mono">TP / (TP + FN)</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Fraction of genuine cross-bureau links detected.
          </p>
        </div>

        {/* F1 Score */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase">F1 Harmonized Score</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-indigo-600">
              {(evaluationResult.f1Score * 100).toFixed(1)}%
            </span>
            <span className="text-xs text-slate-400 font-mono">Harmonic Mean</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Overall balanced operational effectiveness.
          </p>
        </div>

        {/* Institution Resolution Accuracy */}
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase">Institution Resolution</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono text-amber-600">
              {(evaluationResult.institutionResolutionAccuracy * 100).toFixed(1)}%
            </span>
            <span className="text-xs text-slate-400 font-mono">Accuracy</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Correct identity matching via Permanent ID & Aliases.
          </p>
        </div>
      </div>

      {/* Confusion Matrix and Threshold Slider */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Confusion Matrix */}
        <div className="lg:col-span-6 bg-white rounded-lg border border-slate-200 p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900">
            Confusion Matrix (Evaluated on Synthetic Labelled Pairs)
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-center">
              <span className="text-[11px] uppercase font-bold text-emerald-800 block">True Positives (TP)</span>
              <span className="text-3xl font-bold font-mono text-emerald-700 mt-1 block">
                {evaluationResult.truePositives}
              </span>
              <span className="text-[10px] text-emerald-600 mt-1 block">Correctly detected related cases</span>
            </div>

            <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-center">
              <span className="text-[11px] uppercase font-bold text-rose-800 block">False Positives (FP)</span>
              <span className="text-3xl font-bold font-mono text-rose-700 mt-1 block">
                {evaluationResult.falsePositives}
              </span>
              <span className="text-[10px] text-rose-600 mt-1 block">Incorrectly flagged unrelated cases</span>
            </div>

            <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-center">
              <span className="text-[11px] uppercase font-bold text-amber-800 block">False Negatives (FN)</span>
              <span className="text-3xl font-bold font-mono text-amber-700 mt-1 block">
                {evaluationResult.falseNegatives}
              </span>
              <span className="text-[10px] text-amber-600 mt-1 block">Missed genuine cross-bureau links</span>
            </div>

            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 text-center">
              <span className="text-[11px] uppercase font-bold text-blue-800 block">True Negatives (TN)</span>
              <span className="text-3xl font-bold font-mono text-blue-700 mt-1 block">
                {evaluationResult.trueNegatives}
              </span>
              <span className="text-[10px] text-blue-600 mt-1 block">Correctly rejected disparate cases</span>
            </div>
          </div>

          <div className="pt-2 text-xs text-slate-500 flex items-center justify-between">
            <span>Human Accepted Suggestions: <strong>{evaluationResult.acceptedSuggestionsCount}</strong></span>
            <span>Human Rejected Suggestions: <strong>{evaluationResult.rejectedSuggestionsCount}</strong></span>
          </div>
        </div>

        {/* Interactive Threshold Tuning */}
        <div className="lg:col-span-6 bg-white rounded-lg border border-slate-200 p-5 shadow-sm space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-900">
            Interactive Decision Threshold Calibrator
          </h3>
          <p className="text-slate-500">
            Adjust the match score cutoff to observe trade-offs between precision and recall in real time:
          </p>

          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between font-bold">
              <span className="text-slate-700">Classification Threshold:</span>
              <span className="text-base font-mono text-blue-700">{threshold}%</span>
            </div>
            <input
              type="range"
              min={25}
              max={85}
              step={1}
              value={threshold}
              onChange={e => setThreshold(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>25% (High Recall / Broad Detection)</span>
              <span>50% (Recommended Balance)</span>
              <span>85% (High Precision / Strict Match)</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1.5 mt-4">
            <span className="font-bold text-slate-700 block">Active Matcher Weights Formula:</span>
            <div className="grid grid-cols-3 gap-1.5 font-mono text-[10px] text-slate-600">
              <span>Permanent ID: {weights.permanentId}%</span>
              <span>Name/Alias: {weights.nameAlias}%</span>
              <span>Geo Alignment: {weights.geo}%</span>
              <span>Category: {weights.category}%</span>
              <span>TF-IDF Text: {weights.textTfidf}%</span>
              <span>Temporal: {weights.temporal}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Labelled Benchmark Case Pairs Inspection */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900">
          Curated Benchmark Test Pairs ({benchmarkPairs.length})
        </h3>
        <p className="text-xs text-slate-500">
          Inspection of individual synthetic pairs validating edge cases (e.g. same institute but distinct issues, different institutes with identical text):
        </p>

        <div className="space-y-3">
          {benchmarkPairs.map(bp => (
            <div key={bp.id} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-2 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-slate-900">{bp.id}</span>
                  <span className="font-bold text-slate-800">{bp.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase text-slate-500 font-semibold">Ground Truth:</span>
                  <span
                    className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                      bp.groundTruthLabel === 'RELATED' || bp.groundTruthLabel === 'DUPLICATE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {bp.groundTruthLabel}
                  </span>
                </div>
              </div>

              <p className="text-slate-600">{bp.description}</p>

              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 font-mono pt-1">
                <span>Case A: <strong>{bp.caseA.id}</strong> ({bp.caseA.bureau})</span>
                <span>•</span>
                <span>Case B: <strong>{bp.caseB.id}</strong> ({bp.caseB.bureau})</span>
                <span>•</span>
                <span>Institution Match: <strong>{bp.groundTruthSameInstitution ? 'Yes' : 'No'}</strong></span>
              </div>
              <p className="text-[11px] text-indigo-700 font-medium">Evaluation Note: {bp.notes}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
