/**
 * AICTE CaseConnect - Explainable Cross-Bureau Overlap Matching Engine
 * 
 * Computes multi-signal similarity:
 * 1. Exact AICTE Permanent ID match
 * 2. Normalized Institution Name and Alias fuzzy similarity
 * 3. State & District geographic alignment
 * 4. Complaint Category & Subcategory semantic overlap
 * 5. Term Frequency / Keyword overlap (TF-IDF approximation with key token matching)
 * 6. Temporal proximity (filing date delta)
 * 
 * Enforces explainability, transparency, and decision-support boundaries.
 */

import { CaseRecord, Institution, MatcherWeights, MatchingSignals, OverlapConfidenceBand, OverlapSuggestion } from '../types';

// Default configurable weights (Sum = 100)
export const DEFAULT_MATCHER_WEIGHTS: MatcherWeights = {
  permanentId: 35,
  nameAlias: 20,
  geo: 10,
  category: 15,
  textTfidf: 15,
  temporal: 5,
};

// Common Indian higher education stop words
const STOP_WORDS = new Set([
  'the', 'is', 'at', 'which', 'on', 'and', 'a', 'an', 'in', 'to', 'for', 'of', 'or', 'by',
  'with', 'as', 'it', 'that', 'this', 'from', 'be', 'are', 'was', 'were', 'has', 'have',
  'had', 'been', 'will', 'would', 'could', 'should', 'aicte', 'institution', 'college',
  'institute', 'student', 'students', 'complaint', 'case', 'report', 'reported', 'regarding',
  'against', 'matter', 'dated', 'petition', 'reference', 'grievance', 'action', 'per', 'rule',
  'rules', 'all', 'any', 'some', 'such', 'not', 'no', 'due', 'our', 'their', 'his', 'her'
]);

// Related category matrix for domain-aware category similarity
const RELATED_CATEGORIES: Record<string, string[]> = {
  'Faculty & Staff Inadequacy': [
    'Internal Assessment & Examination Irregularity',
    'Infrastructure & Laboratory Deficit',
    'Governance & Administrative Non-Compliance'
  ],
  'Internal Assessment & Examination Irregularity': [
    'Faculty & Staff Inadequacy',
    'Governance & Administrative Non-Compliance'
  ],
  'Fee & Financial Malpractice': [
    'Capitation Fee / Admission Fraud',
    'Governance & Administrative Non-Compliance'
  ],
  'Capitation Fee / Admission Fraud': [
    'Fee & Financial Malpractice',
    'Document Forgery & Unapproved Courses'
  ],
  'Student Harassment & Ragging': [
    'Governance & Administrative Non-Compliance'
  ],
  'Document Forgery & Unapproved Courses': [
    'Governance & Administrative Non-Compliance',
    'Capitation Fee / Admission Fraud'
  ],
  'Infrastructure & Laboratory Deficit': [
    'Faculty & Staff Inadequacy',
    'Governance & Administrative Non-Compliance'
  ],
  'Governance & Administrative Non-Compliance': [
    'Faculty & Staff Inadequacy',
    'Internal Assessment & Examination Irregularity',
    'Fee & Financial Malpractice'
  ]
};

/**
 * Tokenizes text and strips punctuation & stop words
 */
export function tokenizeText(text: string): string[] {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 2 && !STOP_WORDS.has(token));
}

/**
 * String normalization for institute names
 */
export function normalizeInstituteName(name: string): string {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/\b(institute|technology|engineering|college|of|and|for|sciences|tech|inst)\b/g, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

/**
 * Jaccard token similarity
 */
export function tokenJaccardSimilarity(strA: string, strB: string): number {
  const setA = new Set(tokenizeText(strA));
  const setB = new Set(tokenizeText(strB));
  if (setA.size === 0 || setB.size === 0) return 0;

  let intersection = 0;
  for (const item of setA) {
    if (setB.has(item)) intersection++;
  }
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

/**
 * Levenshtein distance based normalized similarity (0 to 1)
 */
export function stringSimilarity(s1: string, s2: string): number {
  const a = s1.toLowerCase().trim();
  const b = s2.toLowerCase().trim();
  if (a === b) return 1.0;
  if (!a || !b) return 0.0;

  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]) + 1;
      }
    }
  }

  const distance = dp[m][n];
  const maxLen = Math.max(m, n);
  return maxLen === 0 ? 1 : Math.max(0, (maxLen - distance) / maxLen);
}

/**
 * Computes individual matching signals between two cases
 */
export function computeMatchingSignals(
  caseA: CaseRecord,
  caseB: CaseRecord,
  institutionsMap: Map<string, Institution>,
  weights: MatcherWeights = DEFAULT_MATCHER_WEIGHTS
): MatchingSignals {
  // 1. Permanent ID Match
  const idA = caseA.aictePermanentId?.trim();
  const idB = caseB.aictePermanentId?.trim();
  const hasIdA = Boolean(idA && idA !== 'PENDING' && idA !== 'UNVERIFIED');
  const hasIdB = Boolean(idB && idB !== 'PENDING' && idB !== 'UNVERIFIED');

  let permIdMatched = false;
  let permIdScore = 0;
  let permIdExplanation = '';

  if (hasIdA && hasIdB) {
    if (idA.toLowerCase() === idB.toLowerCase()) {
      permIdMatched = true;
      permIdScore = 1.0;
      permIdExplanation = `Identical AICTE Permanent ID match (${idA}). Strong identity signal.`;
    } else {
      permIdMatched = false;
      permIdScore = 0.0;
      permIdExplanation = `Different Permanent IDs (${idA} vs ${idB}). Distinct institutions.`;
    }
  } else {
    permIdMatched = false;
    permIdScore = 0.2; // partial fallback if ID missing
    permIdExplanation = `One or both Permanent IDs missing or unverified. Requires manual alias resolution.`;
  }

  // 2. Institution Name & Alias Similarity
  const nameA = caseA.institutionName || '';
  const nameB = caseB.institutionName || '';
  const normA = normalizeInstituteName(nameA);
  const normB = normalizeInstituteName(nameB);
  
  let nameSim = stringSimilarity(normA, normB);
  let matchedAlias: string | undefined = undefined;

  // Check aliases from registry if available
  const instA = institutionsMap.get(caseA.institutionId);
  const instB = institutionsMap.get(caseB.institutionId);

  if (instA?.aliases && instB) {
    for (const alias of instA.aliases) {
      const aliasSim = stringSimilarity(normalizeInstituteName(alias), normB);
      if (aliasSim > nameSim) {
        nameSim = aliasSim;
        matchedAlias = alias;
      }
    }
  }
  if (instB?.aliases && !matchedAlias) {
    for (const alias of instB.aliases) {
      const aliasSim = stringSimilarity(normalizeInstituteName(alias), normA);
      if (aliasSim > nameSim) {
        nameSim = aliasSim;
        matchedAlias = alias;
      }
    }
  }

  // If permanent ID matched 100%, name score is reinforced
  const nameScore = permIdMatched ? Math.max(nameSim, 0.95) : nameSim;
  const nameExplanation = matchedAlias 
    ? `Normalized name matched via alias "${matchedAlias}" with ${(nameScore * 100).toFixed(0)}% similarity.`
    : `Normalized name match score is ${(nameScore * 100).toFixed(0)}% ("${nameA}" vs "${nameB}").`;

  // 3. Geographic Similarity (State & District)
  const stateA = (caseA.state || '').trim().toLowerCase();
  const stateB = (caseB.state || '').trim().toLowerCase();
  const distA = (caseA.district || '').trim().toLowerCase();
  const distB = (caseB.district || '').trim().toLowerCase();

  let geoScore = 0;
  let stateMatch = false;
  let districtMatch = false;

  if (stateA && stateB && stateA === stateB) {
    stateMatch = true;
    if (distA && distB && distA === distB) {
      districtMatch = true;
      geoScore = 1.0;
    } else {
      geoScore = 0.6;
    }
  } else if (!stateA || !stateB) {
    geoScore = 0.3; // unknown
  }

  const geoExplanation = districtMatch 
    ? `Exact State (${caseA.state}) and District (${caseA.district}) match.`
    : stateMatch 
      ? `State match (${caseA.state}), differing or unrecorded districts.`
      : `Geographic mismatch (${caseA.state || 'N/A'} vs ${caseB.state || 'N/A'}).`;

  // 4. Category Similarity
  let catScore = 0;
  let catExact = false;
  let catRelated = false;

  if (caseA.category === caseB.category) {
    catExact = true;
    catScore = 1.0;
  } else {
    const relatedList = RELATED_CATEGORIES[caseA.category] || [];
    if (relatedList.includes(caseB.category)) {
      catRelated = true;
      catScore = 0.65;
    } else {
      catScore = 0.1;
    }
  }

  const catExplanation = catExact 
    ? `Identical grievance category: "${caseA.category}".`
    : catRelated 
      ? `Correlated categories: "${caseA.category}" aligns with "${caseB.category}".`
      : `Distinct categories: "${caseA.category}" vs "${caseB.category}".`;

  // 5. Keyword & TF-IDF Cosine Approximation
  const fullTextA = `${caseA.title} ${caseA.description} ${caseA.subcategory || ''}`;
  const fullTextB = `${caseB.title} ${caseB.description} ${caseB.subcategory || ''}`;
  
  const tokensA = tokenizeText(fullTextA);
  const tokensB = tokenizeText(fullTextB);
  const setA = new Set(tokensA);
  const setB = new Set(tokensB);

  const sharedTerms: string[] = [];
  for (const term of setA) {
    if (setB.has(term)) sharedTerms.push(term);
  }

  // Weight key domain words higher
  const domainKeywords = [
    'faculty', 'professors', 'attendance', 'salary', 'marks', 'internal',
    'assessment', 'exam', 'fees', 'refund', 'capitation', 'laboratory',
    'equipment', 'deficiency', 'approval', 'ragging', 'hostel', 'show-cause',
    'inspection', 'compliance', 'unauthorized', 'affidavit'
  ];
  let domainBoost = 0;
  for (const term of sharedTerms) {
    if (domainKeywords.includes(term)) domainBoost += 0.08;
  }

  const jaccard = tokenJaccardSimilarity(fullTextA, fullTextB);
  const textScore = Math.min(1.0, jaccard * 1.5 + domainBoost);

  const textExplanation = sharedTerms.length > 0
    ? `Shared key terminology: [${sharedTerms.slice(0, 5).join(', ')}${sharedTerms.length > 5 ? '...' : ''}] with ${(textScore * 100).toFixed(0)}% topical alignment.`
    : `Negligible vocabulary overlap between complaint narratives.`;

  // 6. Temporal Proximity
  const dateA = new Date(caseA.dateReceived).getTime();
  const dateB = new Date(caseB.dateReceived).getTime();
  let daysDiff = 999;
  let tempScore = 0.1;

  if (!isNaN(dateA) && !isNaN(dateB)) {
    daysDiff = Math.abs(Math.round((dateA - dateB) / (1000 * 60 * 60 * 24)));
    if (daysDiff <= 30) {
      tempScore = 1.0;
    } else if (daysDiff <= 90) {
      tempScore = 0.8;
    } else if (daysDiff <= 180) {
      tempScore = 0.55;
    } else if (daysDiff <= 365) {
      tempScore = 0.35;
    } else {
      tempScore = 0.15;
    }
  }

  const tempExplanation = daysDiff < 999 
    ? `Filed ${daysDiff} days apart (${caseA.dateReceived} vs ${caseB.dateReceived}).`
    : `Dates not verifiable.`;

  return {
    permanentIdMatch: {
      matched: permIdMatched,
      score: permIdScore,
      weight: weights.permanentId,
      explanation: permIdExplanation,
    },
    institutionNameSimilarity: {
      rawSimilarity: nameSim,
      score: nameScore,
      weight: weights.nameAlias,
      matchedAlias,
      explanation: nameExplanation,
    },
    geoSimilarity: {
      stateMatch,
      districtMatch,
      score: geoScore,
      weight: weights.geo,
      explanation: geoExplanation,
    },
    categorySimilarity: {
      exactMatch: catExact,
      relatedMatch: catRelated,
      score: catScore,
      weight: weights.category,
      explanation: catExplanation,
    },
    textSimilarity: {
      rawCosineTfidf: jaccard,
      sharedKeyTerms: sharedTerms,
      score: textScore,
      weight: weights.textTfidf,
      explanation: textExplanation,
    },
    temporalProximity: {
      daysDifference: daysDiff,
      score: tempScore,
      weight: weights.temporal,
      explanation: tempExplanation,
    },
  };
}

/**
 * Calculates overall match score and produces a fully explainable suggestion
 */
export function evaluateOverlapPair(
  caseA: CaseRecord,
  caseB: CaseRecord,
  institutionsMap: Map<string, Institution>,
  weights: MatcherWeights = DEFAULT_MATCHER_WEIGHTS
): OverlapSuggestion {
  const signals = computeMatchingSignals(caseA, caseB, institutionsMap, weights);

  const totalWeight = weights.permanentId + weights.nameAlias + weights.geo + weights.category + weights.textTfidf + weights.temporal;
  
  const weightedSum = 
    (signals.permanentIdMatch.score * weights.permanentId) +
    (signals.institutionNameSimilarity.score * weights.nameAlias) +
    (signals.geoSimilarity.score * weights.geo) +
    (signals.categorySimilarity.score * weights.category) +
    (signals.textSimilarity.score * weights.textTfidf) +
    (signals.temporalProximity.score * weights.temporal);

  let rawOverallScore = (weightedSum / (totalWeight || 100)) * 100;

  // Penalty guardrails from requirements:
  // 1. If permanent IDs are present and conflict completely (different institutions), cap score low
  if (caseA.aictePermanentId && caseB.aictePermanentId && 
      caseA.aictePermanentId !== caseB.aictePermanentId &&
      !signals.permanentIdMatch.matched) {
    rawOverallScore = Math.min(rawOverallScore, 34); // Cannot be classified as related if institutions are definitively different!
  }

  // 2. If same institution, but categories and text have near-zero overlap, score is limited to ~42%
  if (signals.permanentIdMatch.matched && signals.categorySimilarity.score <= 0.1 && signals.textSimilarity.score < 0.15) {
    rawOverallScore = Math.min(rawOverallScore, 44);
  }

  const overallScore = Math.round(rawOverallScore);

  // Confidence Bands
  let confidenceBand: OverlapConfidenceBand = 'Weak Match';
  let recommendationLabel = 'Review with caution — low correlation';

  if (!caseA.aictePermanentId || !caseB.aictePermanentId || caseA.aictePermanentId === 'PENDING' || caseB.aictePermanentId === 'PENDING') {
    confidenceBand = 'Identity Needs Verification';
    recommendationLabel = 'Institution identity unverified — confirm AICTE permanent ID first';
  } else if (overallScore >= 75) {
    confidenceBand = 'High-Priority Review';
    recommendationLabel = 'High-priority review — cross-bureau coordination strongly recommended';
  } else if (overallScore >= 50) {
    confidenceBand = 'Potentially Related';
    recommendationLabel = 'Potentially related — cross-bureau coordination recommended';
  } else if (overallScore >= 28) {
    confidenceBand = 'Weak Match';
    recommendationLabel = 'Same institution or common keywords — distinct issues likely';
  } else {
    confidenceBand = 'Weak Match';
    recommendationLabel = 'Low confidence correlation';
  }

  // Determine suggested relationship type (Decision Support, not automatic!)
  const isLikelyDuplicate = signals.permanentIdMatch.matched && 
                            signals.textSimilarity.score > 0.85 && 
                            signals.temporalProximity.daysDifference <= 14;

  const suggestedRelationshipType = isLikelyDuplicate ? 'Confirmed Duplicate' : 'Related Cases';

  // Generate clear synthesized human explanation
  let shortExplanation = '';
  if (signals.permanentIdMatch.matched && signals.categorySimilarity.score >= 0.6) {
    shortExplanation = `Matched via identical Permanent ID (${caseA.aictePermanentId}) and aligned issues in ${caseA.bureau} vs ${caseB.bureau} (${signals.textSimilarity.sharedKeyTerms.slice(0, 3).join(', ')}).`;
  } else if (signals.permanentIdMatch.matched) {
    shortExplanation = `Same institution ID (${caseA.aictePermanentId}), but distinct issue tracks (${caseA.category} vs ${caseB.category}).`;
  } else if (signals.institutionNameSimilarity.score > 0.85 && signals.geoSimilarity.score > 0.5) {
    shortExplanation = `High name and geographical similarity despite unverified ID (${caseA.institutionName}).`;
  } else {
    shortExplanation = `Topical or syntactic overlap with distinct institutional identities.`;
  }

  return {
    id: `OVERLAP-${caseA.id}-${caseB.id}`,
    sourceCaseId: caseA.id,
    targetCaseId: caseB.id,
    overallScore,
    confidenceBand,
    status: 'Pending Review',
    signals,
    shortExplanation,
    recommendationLabel,
    suggestedRelationshipType,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Scans a list of cases across bureaus and extracts overlap candidates
 */
export function generateCrossBureauSuggestions(
  cases: CaseRecord[],
  institutions: Institution[],
  weights: MatcherWeights = DEFAULT_MATCHER_WEIGHTS,
  minThreshold = 25
): OverlapSuggestion[] {
  const instMap = new Map<string, Institution>();
  institutions.forEach(inst => instMap.set(inst.id, inst));

  const suggestions: OverlapSuggestion[] = [];
  const processedPairs = new Set<string>();

  // Compare across different bureaus or cross-channel complaints
  for (let i = 0; i < cases.length; i++) {
    for (let j = i + 1; j < cases.length; j++) {
      const cA = cases[i];
      const cB = cases[j];

      // Avoid self-pairing
      if (cA.id === cB.id) continue;

      const pairKey = [cA.id, cB.id].sort().join(':::');
      if (processedPairs.has(pairKey)) continue;
      processedPairs.add(pairKey);

      // Only check if at least one match indicator exists (same ID, or name similarity > 0.6, or same state + category)
      const sameId = cA.aictePermanentId && cB.aictePermanentId && cA.aictePermanentId === cB.aictePermanentId;
      const sameInstName = cA.institutionName && cB.institutionName && 
        stringSimilarity(normalizeInstituteName(cA.institutionName), normalizeInstituteName(cB.institutionName)) > 0.6;
      const sameGeoCat = cA.state === cB.state && cA.category === cB.category;

      if (!sameId && !sameInstName && !sameGeoCat) {
        continue;
      }

      const suggestion = evaluateOverlapPair(cA, cB, instMap, weights);
      if (suggestion.overallScore >= minThreshold) {
        suggestions.push(suggestion);
      }
    }
  }

  // Sort by score descending
  return suggestions.sort((a, b) => b.overallScore - a.overallScore);
}
