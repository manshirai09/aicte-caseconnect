/**
 * AICTE CaseConnect - Data Model & Type Definitions
 * Covers Institutions, Cases, Overlap Signals, Coordination, SLA, and Audit Trails.
 */

export type BureauType = 'PGRC' | 'Regulation Bureau' | 'Approval Bureau' | 'Skill Development' | 'Legal Cell';

export type UserRole = 
  | 'Senior Management'
  | 'RB Officer'
  | 'PGRC Officer'
  | 'Regional Officer'
  | 'Administrator';

export type CaseStatus = 
  | 'New'
  | 'Under Review'
  | 'In Progress'
  | 'Awaiting Information'
  | 'Coordination Requested'
  | 'Escalated'
  | 'Resolved'
  | 'Closed';

export type CasePriority = 'Critical' | 'High' | 'Medium' | 'Low';

export type CaseCategory = 
  | 'Faculty & Staff Inadequacy'
  | 'Internal Assessment & Examination Irregularity'
  | 'Fee & Financial Malpractice'
  | 'Infrastructure & Laboratory Deficit'
  | 'Capitation Fee / Admission Fraud'
  | 'Student Harassment & Ragging'
  | 'Document Forgery & Unapproved Courses'
  | 'Governance & Administrative Non-Compliance';

export type SourceChannel = 
  | 'CPGRAMS'
  | 'AICTE Web Portal'
  | 'Physical Petition'
  | 'Court Directive'
  | 'Email / Vigilance Reference';

export interface ActionHistoryEntry {
  id: string;
  timestamp: string;
  user: string;
  role: UserRole;
  bureau: BureauType;
  action: string;
  previousValue?: string;
  newValue?: string;
  remarks: string;
}

export interface InternalRemark {
  id: string;
  timestamp: string;
  officerName: string;
  officerBureau: BureauType;
  officerRole: UserRole;
  text: string;
  isConfidential: boolean;
}

export interface RelatedCaseLink {
  caseId: string;
  relationshipType: 'Related Cases' | 'Confirmed Duplicate';
  confidenceScore: number;
  linkedAt: string;
  linkedBy: string;
  note: string;
}

export interface CaseRecord {
  id: string; // e.g. "PGRC-2024-0412" or "RB-2024-0199"
  title: string;
  description: string;
  institutionId: string; // Internal ID matching Institution.id
  aictePermanentId: string; // e.g. "1-2812948211" or "1-XXXXXXX"
  institutionName: string;
  sourceChannel: SourceChannel;
  bureau: BureauType;
  category: CaseCategory;
  subcategory: string;
  priority: CasePriority;
  status: CaseStatus;
  assignedOfficer: {
    id: string;
    name: string;
    email: string;
    bureau: BureauType;
  };
  dateReceived: string; // ISO date "YYYY-MM-DD"
  dueDate: string; // ISO date
  lastUpdated: string; // ISO datetime
  actionsHistory: ActionHistoryEntry[];
  relatedCases: RelatedCaseLink[];
  internalRemarks: InternalRemark[];
  region: 'Northern' | 'Western' | 'Southern' | 'Eastern' | 'North-Western' | 'Central';
  state: string;
  district: string;
  complainantType?: 'Student' | 'Faculty' | 'Parent' | 'Whistleblower / Anonymous' | 'Public Representative' | 'Inspector';
  isEscalated?: boolean;
}

export interface Institution {
  id: string;
  aictePermanentId: string; // e.g. "1-2812948211"
  name: string;
  aliases: string[];
  state: string;
  district: string;
  region: 'Northern' | 'Western' | 'Southern' | 'Eastern' | 'North-Western' | 'Central';
  institutionType: 'Engineering & Technology' | 'Management' | 'Pharmacy' | 'Architecture & Planning' | 'Polytechnic Diploma';
  establishmentYear: number;
  approvalStatus: 'Approved' | 'Under Scrutiny' | 'Show Cause Issued' | 'Approval Withdrawn';
  address: string;
  contactEmail: string;
  contactPhone: string;
  openCasesCount: number;
  totalCasesCount: number;
  overdueCasesCount: number;
  recurringIssues: { category: CaseCategory; count: number }[];
  riskIndex: number; // 0-100 calculated indicator
  lastActivityDate: string;
}

export type OverlapConfidenceBand = 
  | 'High-Priority Review'
  | 'Potentially Related'
  | 'Weak Match'
  | 'Identity Needs Verification';

export type OverlapReviewStatus = 
  | 'Pending Review'
  | 'Accepted'
  | 'Rejected'
  | 'Under Further Investigation';

export interface MatchingSignals {
  permanentIdMatch: {
    matched: boolean;
    score: number; // 0 or 1
    weight: number;
    explanation: string;
  };
  institutionNameSimilarity: {
    rawSimilarity: number; // 0 to 1
    score: number;
    weight: number;
    matchedAlias?: string;
    explanation: string;
  };
  geoSimilarity: {
    stateMatch: boolean;
    districtMatch: boolean;
    score: number; // 0, 0.5, or 1
    weight: number;
    explanation: string;
  };
  categorySimilarity: {
    exactMatch: boolean;
    relatedMatch: boolean;
    score: number; // 0, 0.5, or 1
    weight: number;
    explanation: string;
  };
  textSimilarity: {
    rawCosineTfidf: number; // 0 to 1
    sharedKeyTerms: string[];
    score: number;
    weight: number;
    explanation: string;
  };
  temporalProximity: {
    daysDifference: number;
    score: number; // 0 to 1
    weight: number;
    explanation: string;
  };
}

export interface OverlapSuggestion {
  id: string;
  sourceCaseId: string;
  targetCaseId: string;
  overallScore: number; // 0 to 100
  confidenceBand: OverlapConfidenceBand;
  status: OverlapReviewStatus;
  signals: MatchingSignals;
  shortExplanation: string;
  recommendationLabel: string;
  suggestedRelationshipType: 'Related Cases' | 'Confirmed Duplicate';
  createdAt: string;
  reviewResult?: {
    reviewedBy: string;
    reviewedAt: string;
    relationshipType: 'Related Cases' | 'Confirmed Duplicate';
    decision: 'Accepted' | 'Rejected' | 'Under Further Investigation';
    remarks: string;
  };
}

export type CoordinationStatus = 
  | 'Requested'
  | 'Accepted'
  | 'Information Requested'
  | 'Responded'
  | 'Completed'
  | 'Cancelled';

export interface CoordinationResponse {
  id: string;
  timestamp: string;
  officerName: string;
  bureau: BureauType;
  message: string;
  actionTaken?: string;
}

export interface CoordinationRequest {
  id: string;
  requestId: string; // e.g. "COORD-2024-001"
  sourceCaseId: string;
  targetCaseId: string;
  institutionId: string;
  institutionName: string;
  aictePermanentId: string;
  fromBureau: BureauType;
  toBureau: BureauType;
  requestingOfficer: string;
  assignedOfficer?: string;
  reason: string;
  requestedAction: 
    | 'Joint Inspection Committee'
    | 'Provide Past Inspection Reports'
    | 'Corroborate Assessment Records'
    | 'Regulatory Show-Cause Alignment'
    | 'Information Clarification';
  targetResponseDate: string;
  priority: CasePriority;
  status: CoordinationStatus;
  responses: CoordinationResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  userBureau: BureauType;
  actionType: 
    | 'CASE_CREATE'
    | 'CASE_UPDATE'
    | 'STATUS_CHANGE'
    | 'ASSIGNMENT_CHANGE'
    | 'OVERLAP_REVIEW'
    | 'RELATIONSHIP_CREATED'
    | 'RELATIONSHIP_REJECTED'
    | 'COORDINATION_REQUEST'
    | 'COORDINATION_RESPONSE'
    | 'CONFIG_UPDATE'
    | 'REPORT_EXPORT';
  targetEntity: 'Case' | 'Institution' | 'OverlapSuggestion' | 'CoordinationRequest' | 'System';
  targetId: string;
  description: string;
  previousValue?: string;
  newValue?: string;
  metadata?: Record<string, any>;
}

export interface MatcherWeights {
  permanentId: number; // default 35
  nameAlias: number; // default 20
  geo: number; // default 10
  category: number; // default 15
  textTfidf: number; // default 15
  temporal: number; // default 5
}

export interface EvaluationResult {
  totalTestPairs: number;
  truePositives: number;
  falsePositives: number;
  trueNegatives: number;
  falseNegatives: number;
  precision: number;
  recall: number;
  f1Score: number;
  institutionResolutionAccuracy: number;
  acceptedSuggestionsCount: number;
  rejectedSuggestionsCount: number;
  testedAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  bureau: BureauType;
  designation: string;
  employeeId: string;
  region?: string;
  password?: string;
  createdAt: string;
}

export interface AuthSession {
  user: UserProfile;
  token: string;
  loginTime: string;
}
