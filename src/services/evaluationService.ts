/**
 * AICTE CaseConnect - Matcher Benchmark & Evaluation Test Suite
 * Evaluates the explainable matching engine against ground-truth labelled synthetic case pairs.
 * Computes:
 * - True Positives, False Positives, True Negatives, False Negatives
 * - Precision, Recall, F1 Score
 * - Institution Identity Resolution Accuracy
 * - Accepted vs Rejected suggestion review metrics
 */

import { CaseRecord, EvaluationResult, Institution, MatcherWeights } from '../types';
import { evaluateOverlapPair, DEFAULT_MATCHER_WEIGHTS } from './matchingEngine';

export interface LabelledTestCasePair {
  id: string;
  name: string;
  description: string;
  caseA: CaseRecord;
  caseB: CaseRecord;
  groundTruthLabel: 'RELATED' | 'UNRELATED' | 'DUPLICATE';
  groundTruthSameInstitution: boolean;
  expectedConfidenceBand?: string;
  notes: string;
}

/**
 * Curated ground-truth test suite of case pairs covering edge cases
 */
export function getLabelledBenchmarkPairs(cases: CaseRecord[]): LabelledTestCasePair[] {
  const findCase = (id: string) => cases.find(c => c.id === id);

  const demoPgrc = findCase('PGRC-2024-0891');
  const demoRb = findCase('RB-2024-0412');
  const demoUnrelated = findCase('PGRC-2024-0994');

  const pragatiPgrc = findCase('PGRC-2024-0711');
  const pragatiRb = findCase('RB-2024-0322');

  const apexRb = findCase('RB-2024-0550');
  const apexPgrc = findCase('PGRC-2024-0820');

  const crescent1 = findCase('PGRC-2024-1101');
  const crescent2 = findCase('PGRC-2024-1102');

  const silverOak = findCase('PGRC-2024-0555');
  const kalinga = findCase('PGRC-2024-0556');

  const pairs: LabelledTestCasePair[] = [];

  // 1. Positive: Sunrise Institute (PGRC vs RB) - Aligned faculty/assessment issue
  if (demoPgrc && demoRb) {
    pairs.push({
      id: 'BENCH-01',
      name: 'Sunrise Tech: Faculty Absence & Inspection Cadre Deficiency',
      description: 'PGRC student complaint on faculty unavailability vs RB inspection finding cadre deficiency & unmaintained registers.',
      caseA: demoPgrc,
      caseB: demoRb,
      groundTruthLabel: 'RELATED',
      groundTruthSameInstitution: true,
      notes: 'Should score >= 70% with high-priority or potentially related status.'
    });
  }

  // 2. Negative: Same institution (Sunrise Tech), totally distinct issues (Fee refund vs Faculty inspection)
  if (demoPgrc && demoUnrelated) {
    pairs.push({
      id: 'BENCH-02',
      name: 'Sunrise Tech: Faculty Absence vs Hostel Caution Deposit Refund',
      description: 'Same institution ID, but completely unrelated complaints (Academic/Faculty vs Hostel deposit refund).',
      caseA: demoPgrc,
      caseB: demoUnrelated,
      groundTruthLabel: 'UNRELATED',
      groundTruthSameInstitution: true,
      notes: 'Must NOT be marked related. Guardrail should cap score below threshold.'
    });
  }

  // 3. Positive: Pragati Institute Capitation Fee vs Regulatory Audit
  if (pragatiPgrc && pragatiRb) {
    pairs.push({
      id: 'BENCH-03',
      name: 'Pragati Institute: Capitation Fee vs State Fee Committee Audit',
      description: 'PGRC illegal development charge complaint vs RB regulatory fee ceiling breach directive.',
      caseA: pragatiPgrc,
      caseB: pragatiRb,
      groundTruthLabel: 'RELATED',
      groundTruthSameInstitution: true,
      notes: 'High financial category correlation and identical Permanent ID.'
    });
  }

  // 4. Positive: Apex Pharmacy Lab Equipment Shortage
  if (apexRb && apexPgrc) {
    pairs.push({
      id: 'BENCH-04',
      name: 'Apex Pharmacy: HPLC Equipment Deficit vs Student Lab Practice Grievance',
      description: 'RB surprise scrutiny of non-functional HPLC vs PGRC complaint regarding paper-only experiments.',
      caseA: apexRb,
      caseB: apexPgrc,
      groundTruthLabel: 'RELATED',
      groundTruthSameInstitution: true,
      notes: 'Strong infrastructure keyword and category alignment.'
    });
  }

  // 5. Positive / Duplicate: Crescent Global Business School Duplicate Text
  if (crescent1 && crescent2) {
    pairs.push({
      id: 'BENCH-05',
      name: 'Crescent Global: Identical Water/Mess Grievance across Channels',
      description: 'Same student grievance submitted to both CPGRAMS and AICTE Web Portal within 24 hours.',
      caseA: crescent1,
      caseB: crescent2,
      groundTruthLabel: 'DUPLICATE',
      groundTruthSameInstitution: true,
      notes: 'High text cosine similarity and tight temporal proximity.'
    });
  }

  // 6. Negative: Different institutions with similar generic complaint wording (Silver Oak vs Kalinga Tech)
  if (silverOak && kalinga) {
    pairs.push({
      id: 'BENCH-06',
      name: 'Cross-Institute Similar Text: CAD lab complaint at Silver Oak vs Kalinga Tech',
      description: 'Both complaints mention CAD computers and software, but refer to different colleges in Gujarat vs Odisha.',
      caseA: silverOak,
      caseB: kalinga,
      groundTruthLabel: 'UNRELATED',
      groundTruthSameInstitution: false,
      notes: 'Must be rejected as related cases because institutions, IDs, and states are different.'
    });
  }

  return pairs;
}

/**
 * Runs evaluation against benchmark pairs using current weights and threshold
 */
export function runMatcherEvaluation(
  cases: CaseRecord[],
  institutions: Institution[],
  weights: MatcherWeights = DEFAULT_MATCHER_WEIGHTS,
  threshold = 50,
  acceptedCount = 0,
  rejectedCount = 0
): EvaluationResult {
  const instMap = new Map<string, Institution>();
  institutions.forEach(inst => instMap.set(inst.id, inst));

  const testPairs = getLabelledBenchmarkPairs(cases);

  let tp = 0; // Predicted related, actually related
  let fp = 0; // Predicted related, actually unrelated
  let tn = 0; // Predicted unrelated, actually unrelated
  let fn = 0; // Predicted unrelated, actually related
  let correctInstCount = 0;

  for (const pair of testPairs) {
    const suggestion = evaluateOverlapPair(pair.caseA, pair.caseB, instMap, weights);
    const predictedRelated = suggestion.overallScore >= threshold;
    const actuallyRelated = pair.groundTruthLabel === 'RELATED' || pair.groundTruthLabel === 'DUPLICATE';

    // Institution resolution test
    const idA = pair.caseA.aictePermanentId;
    const idB = pair.caseB.aictePermanentId;
    const sameIdDetected = idA && idB && idA !== 'PENDING' && idB !== 'PENDING' && idA === idB;
    if (Boolean(sameIdDetected) === pair.groundTruthSameInstitution) {
      correctInstCount++;
    }

    if (predictedRelated && actuallyRelated) {
      tp++;
    } else if (predictedRelated && !actuallyRelated) {
      fp++;
    } else if (!predictedRelated && !actuallyRelated) {
      tn++;
    } else if (!predictedRelated && actuallyRelated) {
      fn++;
    }
  }

  const precision = (tp + fp) > 0 ? tp / (tp + fp) : 1.0;
  const recall = (tp + fn) > 0 ? tp / (tp + fn) : 1.0;
  const f1Score = (precision + recall) > 0 ? (2 * precision * recall) / (precision + recall) : 0;
  const institutionResolutionAccuracy = testPairs.length > 0 ? correctInstCount / testPairs.length : 1.0;

  return {
    totalTestPairs: testPairs.length,
    truePositives: tp,
    falsePositives: fp,
    trueNegatives: tn,
    falseNegatives: fn,
    precision: Number(precision.toFixed(3)),
    recall: Number(recall.toFixed(3)),
    f1Score: Number(f1Score.toFixed(3)),
    institutionResolutionAccuracy: Number(institutionResolutionAccuracy.toFixed(3)),
    acceptedSuggestionsCount: acceptedCount,
    rejectedSuggestionsCount: rejectedCount,
    testedAt: new Date().toISOString(),
  };
}
