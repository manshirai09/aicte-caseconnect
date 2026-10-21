/**
 * AICTE CaseConnect - Local Storage & Reactive State Service
 * Provides local demo persistence with full separation of data concerns.
 */

import {
  CaseRecord,
  Institution,
  OverlapSuggestion,
  CoordinationRequest,
  AuditLogEntry,
  MatcherWeights,
  UserRole,
  BureauType,
  CaseStatus,
  CasePriority,
  UserProfile,
} from '../types';
import {
  INITIAL_CASES,
  INITIAL_INSTITUTIONS,
  INITIAL_COORDINATION_REQUESTS,
  INITIAL_AUDIT_LOGS,
} from './seedData';
import {
  DEFAULT_MATCHER_WEIGHTS,
  generateCrossBureauSuggestions,
  evaluateOverlapPair,
} from './matchingEngine';

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'USR-SENIOR-01',
    name: 'Prof. T. G. Sitharam',
    email: 'chairman@aicte-india.org',
    role: 'Senior Management',
    bureau: 'Regulation Bureau',
    designation: 'Executive Chairman & Appellate Authority',
    employeeId: 'AICTE-EXEC-001',
    password: 'password123',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'USR-RB-01',
    name: 'Shri Arvind Sharma',
    email: 'rb.director@aicte-india.org',
    role: 'RB Officer',
    bureau: 'Regulation Bureau',
    designation: 'Director (Regulation Bureau)',
    employeeId: 'AICTE-RB-014',
    password: 'password123',
    createdAt: '2026-01-05T00:00:00Z',
  },
  {
    id: 'USR-PGRC-01',
    name: 'Dr. Ramesh Chandra',
    email: 'pgrc.officer1@aicte-india.org',
    role: 'PGRC Officer',
    bureau: 'PGRC',
    designation: 'Chief Public Grievance Redressal Officer',
    employeeId: 'AICTE-PGRC-007',
    password: 'password123',
    createdAt: '2026-01-10T00:00:00Z',
  },
  {
    id: 'USR-REGIONAL-01',
    name: 'Dr. M. S. Gaikwad',
    email: 'wro.officer@aicte-india.org',
    role: 'Regional Officer',
    bureau: 'Regulation Bureau',
    designation: 'Regional Director (Western Region)',
    employeeId: 'AICTE-WRO-022',
    region: 'Western',
    password: 'password123',
    createdAt: '2026-02-01T00:00:00Z',
  },
  {
    id: 'USR-ADMIN-01',
    name: 'Er. Alok Srivastava',
    email: 'admin.caseconnect@aicte-india.org',
    role: 'Administrator',
    bureau: 'Regulation Bureau',
    designation: 'Chief Systems & Security Administrator',
    employeeId: 'AICTE-IT-003',
    password: 'password123',
    createdAt: '2026-01-01T00:00:00Z',
  },
];

const STORAGE_KEYS = {
  CASES: 'aicte_cases_v1',
  INSTITUTIONS: 'aicte_institutions_v1',
  SUGGESTIONS: 'aicte_suggestions_v1',
  COORDINATIONS: 'aicte_coordinations_v1',
  AUDIT_LOGS: 'aicte_audit_logs_v1',
  WEIGHTS: 'aicte_matcher_weights_v1',
  ACTIVE_ROLE: 'aicte_active_role_v1',
  USERS: 'aicte_users_v1',
  CURRENT_USER: 'aicte_current_user_v1',
};

export class AppDataService {
  private static instance: AppDataService;

  private cases: CaseRecord[] = [];
  private institutions: Institution[] = [];
  private suggestions: OverlapSuggestion[] = [];
  private coordinations: CoordinationRequest[] = [];
  private auditLogs: AuditLogEntry[] = [];
  private weights: MatcherWeights = DEFAULT_MATCHER_WEIGHTS;
  private activeRole: UserRole = 'Senior Management';
  private users: UserProfile[] = [];
  private currentUser: UserProfile | null = null;
  private listeners: Set<() => void> = new Set();

  private constructor() {
    this.initializeData();
  }

  public static getInstance(): AppDataService {
    if (!AppDataService.instance) {
      AppDataService.instance = new AppDataService();
    }
    return AppDataService.instance;
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  private initializeData() {
    try {
      const storedCases = localStorage.getItem(STORAGE_KEYS.CASES);
      const storedInstitutions = localStorage.getItem(STORAGE_KEYS.INSTITUTIONS);
      const storedSuggestions = localStorage.getItem(STORAGE_KEYS.SUGGESTIONS);
      const storedCoord = localStorage.getItem(STORAGE_KEYS.COORDINATIONS);
      const storedAudit = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
      const storedWeights = localStorage.getItem(STORAGE_KEYS.WEIGHTS);
      const storedRole = localStorage.getItem(STORAGE_KEYS.ACTIVE_ROLE);
      const storedUsers = localStorage.getItem(STORAGE_KEYS.USERS);
      const storedCurrentUser = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);

      if (storedCases && storedInstitutions) {
        this.cases = JSON.parse(storedCases);
        this.institutions = JSON.parse(storedInstitutions);
        this.suggestions = storedSuggestions ? JSON.parse(storedSuggestions) : [];
        this.coordinations = storedCoord ? JSON.parse(storedCoord) : [];
        this.auditLogs = storedAudit ? JSON.parse(storedAudit) : [];
        this.weights = storedWeights ? JSON.parse(storedWeights) : DEFAULT_MATCHER_WEIGHTS;
        this.users = storedUsers ? JSON.parse(storedUsers) : JSON.parse(JSON.stringify(INITIAL_USERS));
        this.currentUser = storedCurrentUser ? JSON.parse(storedCurrentUser) : (this.users[0] || null);
        this.activeRole = this.currentUser ? this.currentUser.role : ((storedRole as UserRole) || 'Senior Management');
      } else {
        this.resetToSeedData();
      }

      // If suggestions are empty, auto-generate from cases
      if (this.suggestions.length === 0) {
        this.regenerateSuggestions();
      }
    } catch (e) {
      console.error('Failed to load stored state, reverting to seed', e);
      this.resetToSeedData();
    }
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(this.cases));
      localStorage.setItem(STORAGE_KEYS.INSTITUTIONS, JSON.stringify(this.institutions));
      localStorage.setItem(STORAGE_KEYS.SUGGESTIONS, JSON.stringify(this.suggestions));
      localStorage.setItem(STORAGE_KEYS.COORDINATIONS, JSON.stringify(this.coordinations));
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(this.auditLogs));
      localStorage.setItem(STORAGE_KEYS.WEIGHTS, JSON.stringify(this.weights));
      localStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, this.activeRole);
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(this.users));
      if (this.currentUser) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(this.currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      }
    } catch (e) {
      console.warn('LocalStorage persist failed', e);
    }
    this.notify();
  }

  public resetToSeedData() {
    this.cases = JSON.parse(JSON.stringify(INITIAL_CASES));
    this.institutions = JSON.parse(JSON.stringify(INITIAL_INSTITUTIONS));
    this.coordinations = JSON.parse(JSON.stringify(INITIAL_COORDINATION_REQUESTS));
    this.auditLogs = JSON.parse(JSON.stringify(INITIAL_AUDIT_LOGS));
    this.weights = JSON.parse(JSON.stringify(DEFAULT_MATCHER_WEIGHTS));
    this.users = JSON.parse(JSON.stringify(INITIAL_USERS));
    this.currentUser = JSON.parse(JSON.stringify(INITIAL_USERS[0]));
    this.activeRole = this.currentUser ? this.currentUser.role : 'Senior Management';
    this.regenerateSuggestions();
    this.persist();
  }

  public regenerateSuggestions() {
    this.suggestions = generateCrossBureauSuggestions(this.cases, this.institutions, this.weights);
    this.persist();
  }

  // --- Auth & User Management ---
  public getUsers(): UserProfile[] {
    return [...this.users];
  }

  public getCurrentUser(): UserProfile | null {
    return this.currentUser ? { ...this.currentUser } : null;
  }

  public setCurrentUser(user: UserProfile) {
    this.currentUser = { ...user };
    this.activeRole = user.role;
    this.logAudit({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      userBureau: user.bureau,
      actionType: 'CONFIG_UPDATE',
      targetEntity: 'System',
      targetId: user.id,
      description: `Authenticated as ${user.name} (${user.role} - ${user.bureau})`,
    });
    this.persist();
  }

  public login(email: string, password?: string): { success: boolean; user?: UserProfile; error?: string } {
    const trimmedEmail = email.trim().toLowerCase();
    const user = this.users.find(u => u.email.toLowerCase() === trimmedEmail);
    if (!user) {
      return { success: false, error: 'No official AICTE account found with this email ID.' };
    }
    if (password && user.password && user.password !== password) {
      return { success: false, error: 'Incorrect credentials provided.' };
    }

    this.setCurrentUser(user);
    return { success: true, user };
  }

  public signup(params: Omit<UserProfile, 'id' | 'createdAt'>): { success: boolean; user?: UserProfile; error?: string } {
    const trimmedEmail = params.email.trim().toLowerCase();
    const exists = this.users.some(u => u.email.toLowerCase() === trimmedEmail);
    if (exists) {
      return { success: false, error: 'An officer account with this email address already exists.' };
    }

    const newUser: UserProfile = {
      ...params,
      id: `USR-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
    };

    this.users.unshift(newUser);
    this.setCurrentUser(newUser);

    this.logAudit({
      userId: newUser.id,
      userName: newUser.name,
      userRole: newUser.role,
      userBureau: newUser.bureau,
      actionType: 'CONFIG_UPDATE',
      targetEntity: 'System',
      targetId: newUser.id,
      description: `New officer account created and registered: ${newUser.name} as ${newUser.role}`,
    });

    this.persist();
    return { success: true, user: newUser };
  }

  public logout() {
    if (this.currentUser) {
      this.logAudit({
        userId: this.currentUser.id,
        userName: this.currentUser.name,
        userRole: this.currentUser.role,
        userBureau: this.currentUser.bureau,
        actionType: 'CONFIG_UPDATE',
        targetEntity: 'System',
        targetId: this.currentUser.id,
        description: `Officer ${this.currentUser.name} signed out.`,
      });
    }
    this.currentUser = null;
    this.persist();
  }

  // --- Getters ---
  public getCases(): CaseRecord[] {
    return [...this.cases];
  }

  public getInstitutions(): Institution[] {
    return [...this.institutions];
  }

  public getSuggestions(): OverlapSuggestion[] {
    return [...this.suggestions];
  }

  public getCoordinations(): CoordinationRequest[] {
    return [...this.coordinations];
  }

  public getAuditLogs(): AuditLogEntry[] {
    return [...this.auditLogs];
  }

  public getWeights(): MatcherWeights {
    return { ...this.weights };
  }

  public getActiveRole(): UserRole {
    return this.activeRole;
  }

  public setActiveRole(role: UserRole) {
    this.activeRole = role;
    localStorage.setItem(STORAGE_KEYS.ACTIVE_ROLE, role);
    this.logAudit({
      userId: 'USER-SYSTEM',
      userName: `Officer (${role})`,
      userRole: role,
      userBureau: role.includes('RB') ? 'Regulation Bureau' : role.includes('PGRC') ? 'PGRC' : 'Regulation Bureau',
      actionType: 'CONFIG_UPDATE',
      targetEntity: 'System',
      targetId: 'ROLE_SWITCH',
      description: `Active role switched to "${role}" for evaluation and testing.`,
    });
    this.notify();
  }

  public setWeights(newWeights: MatcherWeights) {
    this.weights = newWeights;
    this.regenerateSuggestions();
    this.logAudit({
      userId: 'OFF-ADM-01',
      userName: 'Administrator',
      userRole: 'Administrator',
      userBureau: 'Regulation Bureau',
      actionType: 'CONFIG_UPDATE',
      targetEntity: 'System',
      targetId: 'MATCHER_WEIGHTS',
      description: 'Updated cross-bureau matching algorithm weights.',
      metadata: newWeights,
    });
    this.persist();
  }

  // --- Audit Logger ---
  public logAudit(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) {
    const log: AuditLogEntry = {
      ...entry,
      id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
    };
    this.auditLogs.unshift(log);
  }

  // --- Case Mutations ---
  public createCase(newCase: Omit<CaseRecord, 'id' | 'lastUpdated' | 'actionsHistory' | 'relatedCases' | 'internalRemarks'>): CaseRecord {
    const prefix = newCase.bureau === 'PGRC' ? 'PGRC' : newCase.bureau === 'Regulation Bureau' ? 'RB' : 'AICTE';
    const id = `${prefix}-2026-${String(Math.floor(1000 + Math.random() * 9000))}`;
    
    const record: CaseRecord = {
      ...newCase,
      id,
      lastUpdated: new Date().toISOString(),
      actionsHistory: [
        {
          id: `ACT-${Date.now()}`,
          timestamp: new Date().toISOString(),
          user: `Officer (${this.activeRole})`,
          role: this.activeRole,
          bureau: newCase.bureau,
          action: 'Case Created',
          remarks: 'New case entered into CaseConnect system.'
        }
      ],
      relatedCases: [],
      internalRemarks: []
    };

    this.cases.unshift(record);

    // Update institution case counters
    const inst = this.institutions.find(i => i.id === record.institutionId || i.aictePermanentId === record.aictePermanentId);
    if (inst) {
      inst.totalCasesCount += 1;
      inst.openCasesCount += 1;
      inst.lastActivityDate = new Date().toISOString();
      const existingIssue = inst.recurringIssues.find(i => i.category === record.category);
      if (existingIssue) {
        existingIssue.count += 1;
      } else {
        inst.recurringIssues.push({ category: record.category, count: 1 });
      }
    }

    this.logAudit({
      userId: `USR-${this.activeRole}`,
      userName: `Officer (${this.activeRole})`,
      userRole: this.activeRole,
      userBureau: newCase.bureau,
      actionType: 'CASE_CREATE',
      targetEntity: 'Case',
      targetId: id,
      description: `Created new case: "${record.title}" for ${record.institutionName}`,
      newValue: record.status,
    });

    this.regenerateSuggestions();
    this.persist();
    return record;
  }

  public updateCaseStatus(caseId: string, newStatus: CaseStatus, remarks: string) {
    const c = this.cases.find(item => item.id === caseId);
    if (!c) return;

    const previousStatus = c.status;
    c.status = newStatus;
    c.lastUpdated = new Date().toISOString();

    c.actionsHistory.unshift({
      id: `ACT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: `Officer (${this.activeRole})`,
      role: this.activeRole,
      bureau: c.bureau,
      action: 'Status Change',
      previousValue: previousStatus,
      newValue: newStatus,
      remarks: remarks || 'Status updated by authorized officer.',
    });

    // Update institution counters if resolved/closed
    const inst = this.institutions.find(i => i.id === c.institutionId);
    if (inst) {
      if ((newStatus === 'Resolved' || newStatus === 'Closed') && (previousStatus !== 'Resolved' && previousStatus !== 'Closed')) {
        inst.openCasesCount = Math.max(0, inst.openCasesCount - 1);
      } else if ((previousStatus === 'Resolved' || previousStatus === 'Closed') && (newStatus !== 'Resolved' && newStatus !== 'Closed')) {
        inst.openCasesCount += 1;
      }
    }

    this.logAudit({
      userId: `USR-${this.activeRole}`,
      userName: `Officer (${this.activeRole})`,
      userRole: this.activeRole,
      userBureau: c.bureau,
      actionType: 'STATUS_CHANGE',
      targetEntity: 'Case',
      targetId: caseId,
      description: `Updated status of ${caseId} from "${previousStatus}" to "${newStatus}"`,
      previousValue: previousStatus,
      newValue: newStatus,
      metadata: { remarks },
    });

    this.persist();
  }

  public assignOfficer(caseId: string, officerName: string, officerEmail: string, bureau: BureauType, remarks: string) {
    const c = this.cases.find(item => item.id === caseId);
    if (!c) return;

    const prevOfficer = c.assignedOfficer.name;
    c.assignedOfficer = {
      id: `OFF-${Date.now()}`,
      name: officerName,
      email: officerEmail,
      bureau: bureau,
    };
    c.lastUpdated = new Date().toISOString();

    c.actionsHistory.unshift({
      id: `ACT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: `Officer (${this.activeRole})`,
      role: this.activeRole,
      bureau: c.bureau,
      action: 'Officer Reassigned',
      previousValue: prevOfficer,
      newValue: officerName,
      remarks: remarks || 'Case assigned to new desk officer.',
    });

    this.logAudit({
      userId: `USR-${this.activeRole}`,
      userName: `Officer (${this.activeRole})`,
      userRole: this.activeRole,
      userBureau: c.bureau,
      actionType: 'ASSIGNMENT_CHANGE',
      targetEntity: 'Case',
      targetId: caseId,
      description: `Reassigned case ${caseId} from ${prevOfficer} to ${officerName}`,
      previousValue: prevOfficer,
      newValue: officerName,
      metadata: { remarks },
    });

    this.persist();
  }

  public transferBureau(caseId: string, newBureau: BureauType, remarks: string) {
    const c = this.cases.find(item => item.id === caseId);
    if (!c) return;

    const prevBureau = c.bureau;
    c.bureau = newBureau;
    c.lastUpdated = new Date().toISOString();

    c.actionsHistory.unshift({
      id: `ACT-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: `Officer (${this.activeRole})`,
      role: this.activeRole,
      bureau: newBureau,
      action: 'Transferred Bureau',
      previousValue: prevBureau,
      newValue: newBureau,
      remarks: remarks || `Jurisdiction transferred from ${prevBureau} to ${newBureau}`,
    });

    this.logAudit({
      userId: `USR-${this.activeRole}`,
      userName: `Officer (${this.activeRole})`,
      userRole: this.activeRole,
      userBureau: newBureau,
      actionType: 'STATUS_CHANGE',
      targetEntity: 'Case',
      targetId: caseId,
      description: `Transferred jurisdiction of ${caseId} from ${prevBureau} to ${newBureau}`,
      previousValue: prevBureau,
      newValue: newBureau,
      metadata: { remarks },
    });

    this.regenerateSuggestions();
    this.persist();
  }

  public addInternalRemark(caseId: string, text: string, isConfidential = false) {
    const c = this.cases.find(item => item.id === caseId);
    if (!c) return;

    c.internalRemarks.unshift({
      id: `REM-${Date.now()}`,
      timestamp: new Date().toISOString(),
      officerName: `Officer (${this.activeRole})`,
      officerBureau: c.bureau,
      officerRole: this.activeRole,
      text,
      isConfidential,
    });
    c.lastUpdated = new Date().toISOString();

    this.logAudit({
      userId: `USR-${this.activeRole}`,
      userName: `Officer (${this.activeRole})`,
      userRole: this.activeRole,
      userBureau: c.bureau,
      actionType: 'CASE_UPDATE',
      targetEntity: 'Case',
      targetId: caseId,
      description: `Added internal note on ${caseId} (${isConfidential ? 'Confidential' : 'Standard'})`,
    });

    this.persist();
  }

  // --- Overlap Review Actions (Human In The Loop) ---
  public reviewOverlapSuggestion(
    suggestionId: string,
    decision: 'Accepted' | 'Rejected' | 'Under Further Investigation',
    relationshipType: 'Related Cases' | 'Confirmed Duplicate',
    remarks: string
  ) {
    const suggestion = this.suggestions.find(s => s.id === suggestionId);
    if (!suggestion) return;

    suggestion.status = decision;
    suggestion.reviewResult = {
      reviewedBy: `Officer (${this.activeRole})`,
      reviewedAt: new Date().toISOString(),
      relationshipType,
      decision,
      remarks,
    };

    const caseA = this.cases.find(c => c.id === suggestion.sourceCaseId);
    const caseB = this.cases.find(c => c.id === suggestion.targetCaseId);

    if (decision === 'Accepted') {
      // Establish bidirectional related-case link
      if (caseA && !caseA.relatedCases.some(l => l.caseId === suggestion.targetCaseId)) {
        caseA.relatedCases.push({
          caseId: suggestion.targetCaseId,
          relationshipType,
          confidenceScore: suggestion.overallScore,
          linkedAt: new Date().toISOString(),
          linkedBy: `Officer (${this.activeRole})`,
          note: remarks,
        });
        caseA.actionsHistory.unshift({
          id: `ACT-${Date.now()}`,
          timestamp: new Date().toISOString(),
          user: `Officer (${this.activeRole})`,
          role: this.activeRole,
          bureau: caseA.bureau,
          action: 'Related Case Linked',
          remarks: `Linked with ${suggestion.targetCaseId} as "${relationshipType}": ${remarks}`,
        });
      }

      if (caseB && !caseB.relatedCases.some(l => l.caseId === suggestion.sourceCaseId)) {
        caseB.relatedCases.push({
          caseId: suggestion.sourceCaseId,
          relationshipType,
          confidenceScore: suggestion.overallScore,
          linkedAt: new Date().toISOString(),
          linkedBy: `Officer (${this.activeRole})`,
          note: remarks,
        });
        caseB.actionsHistory.unshift({
          id: `ACT-${Date.now()}`,
          timestamp: new Date().toISOString(),
          user: `Officer (${this.activeRole})`,
          role: this.activeRole,
          bureau: caseB.bureau,
          action: 'Related Case Linked',
          remarks: `Linked with ${suggestion.sourceCaseId} as "${relationshipType}": ${remarks}`,
        });
      }

      this.logAudit({
        userId: `USR-${this.activeRole}`,
        userName: `Officer (${this.activeRole})`,
        userRole: this.activeRole,
        userBureau: caseA?.bureau || 'Regulation Bureau',
        actionType: 'RELATIONSHIP_CREATED',
        targetEntity: 'OverlapSuggestion',
        targetId: suggestionId,
        description: `Accepted suggestion between ${suggestion.sourceCaseId} and ${suggestion.targetCaseId} as "${relationshipType}"`,
        metadata: { remarks, score: suggestion.overallScore },
      });
    } else {
      this.logAudit({
        userId: `USR-${this.activeRole}`,
        userName: `Officer (${this.activeRole})`,
        userRole: this.activeRole,
        userBureau: caseA?.bureau || 'Regulation Bureau',
        actionType: 'RELATIONSHIP_REJECTED',
        targetEntity: 'OverlapSuggestion',
        targetId: suggestionId,
        description: `Review completed with decision: "${decision}" for ${suggestion.sourceCaseId} and ${suggestion.targetCaseId}`,
        metadata: { remarks, decision },
      });
    }

    this.persist();
  }

  // --- Coordination Workflow Actions ---
  public createCoordinationRequest(params: {
    sourceCaseId: string;
    targetCaseId: string;
    institutionId: string;
    institutionName: string;
    aictePermanentId: string;
    fromBureau: BureauType;
    toBureau: BureauType;
    reason: string;
    requestedAction: CoordinationRequest['requestedAction'];
    targetResponseDate: string;
    priority: CasePriority;
  }): CoordinationRequest {
    const count = this.coordinations.length + 1;
    const req: CoordinationRequest = {
      id: `COORD-${Date.now()}`,
      requestId: `COORD-2026-${String(count).padStart(4, '0')}`,
      ...params,
      requestingOfficer: `Officer (${this.activeRole})`,
      status: 'Requested',
      responses: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.coordinations.unshift(req);

    // Update status on source case if appropriate
    const sourceCase = this.cases.find(c => c.id === params.sourceCaseId);
    if (sourceCase && sourceCase.status !== 'Resolved' && sourceCase.status !== 'Closed') {
      sourceCase.status = 'Coordination Requested';
      sourceCase.actionsHistory.unshift({
        id: `ACT-${Date.now()}`,
        timestamp: new Date().toISOString(),
        user: `Officer (${this.activeRole})`,
        role: this.activeRole,
        bureau: params.fromBureau,
        action: 'Coordination Request Dispatched',
        remarks: `Dispatched coordination request ${req.requestId} to ${params.toBureau}: ${params.reason}`,
      });
    }

    this.logAudit({
      userId: `USR-${this.activeRole}`,
      userName: `Officer (${this.activeRole})`,
      userRole: this.activeRole,
      userBureau: params.fromBureau,
      actionType: 'COORDINATION_REQUEST',
      targetEntity: 'CoordinationRequest',
      targetId: req.requestId,
      description: `Cross-Bureau Coordination requested from ${params.fromBureau} to ${params.toBureau} regarding ${params.institutionName}`,
      metadata: { reason: params.reason, requestedAction: params.requestedAction },
    });

    this.persist();
    return req;
  }

  public respondToCoordination(requestId: string, message: string, actionTaken?: string, newStatus: CoordinationRequest['status'] = 'Responded') {
    const req = this.coordinations.find(r => r.id === requestId || r.requestId === requestId);
    if (!req) return;

    req.status = newStatus;
    req.updatedAt = new Date().toISOString();
    req.responses.push({
      id: `CR-${Date.now()}`,
      timestamp: new Date().toISOString(),
      officerName: `Officer (${this.activeRole})`,
      bureau: req.toBureau,
      message,
      actionTaken,
    });

    this.logAudit({
      userId: `USR-${this.activeRole}`,
      userName: `Officer (${this.activeRole})`,
      userRole: this.activeRole,
      userBureau: req.toBureau,
      actionType: 'COORDINATION_RESPONSE',
      targetEntity: 'CoordinationRequest',
      targetId: req.requestId,
      description: `Responded to coordination request ${req.requestId} (New status: ${newStatus})`,
      metadata: { message, actionTaken },
    });

    this.persist();
  }

  public updateCoordinationStatus(requestId: string, status: CoordinationRequest['status'], note?: string) {
    const req = this.coordinations.find(r => r.id === requestId || r.requestId === requestId);
    if (!req) return;

    req.status = status;
    req.updatedAt = new Date().toISOString();
    if (note) {
      req.responses.push({
        id: `CR-${Date.now()}`,
        timestamp: new Date().toISOString(),
        officerName: `Officer (${this.activeRole})`,
        bureau: this.activeRole.includes('PGRC') ? 'PGRC' : 'Regulation Bureau',
        message: `Status set to ${status}: ${note}`,
      });
    }

    this.logAudit({
      userId: `USR-${this.activeRole}`,
      userName: `Officer (${this.activeRole})`,
      userRole: this.activeRole,
      userBureau: 'Regulation Bureau',
      actionType: 'STATUS_CHANGE',
      targetEntity: 'CoordinationRequest',
      targetId: req.requestId,
      description: `Coordination request ${req.requestId} status updated to ${status}`,
    });

    this.persist();
  }
}

export const appData = AppDataService.getInstance();
