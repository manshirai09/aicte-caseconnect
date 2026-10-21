/**
 * AICTE CaseConnect - Core Application Context
 * Coordinates global UI state, active role, navigation, search, and data subscriptions.
 */

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
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
import { appData } from '../services/storage';

export type AppView = 
  | 'dashboard'
  | 'cases'
  | 'institutions'
  | 'institution360'
  | 'overlap'
  | 'coordination'
  | 'sla'
  | 'analytics'
  | 'audit'
  | 'admin'
  | 'benchmark';

export interface GlobalFilterState {
  dateRange: 'ALL' | '30D' | '90D' | '1Y';
  bureau: 'ALL' | BureauType;
  region: 'ALL' | string;
  status: 'ALL' | CaseStatus;
  institutionId: 'ALL' | string;
}

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface AppContextValue {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  cases: CaseRecord[];
  institutions: Institution[];
  suggestions: OverlapSuggestion[];
  coordinations: CoordinationRequest[];
  auditLogs: AuditLogEntry[];
  weights: MatcherWeights;
  
  // Authentication & Users
  currentUser: UserProfile | null;
  users: UserProfile[];
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'signup';
  setAuthModalMode: (mode: 'login' | 'signup') => void;
  login: (email: string, password?: string) => { success: boolean; error?: string };
  signup: (params: Omit<UserProfile, 'id' | 'createdAt'>) => { success: boolean; error?: string };
  logout: () => void;
  switchUser: (userId: string) => void;

  // Navigation & Drilldown
  selectedCaseId: string | null;
  setSelectedCaseId: (id: string | null) => void;
  selectedInstitutionId: string;
  setSelectedInstitutionId: (id: string) => void;
  viewInstitution360: (instId: string) => void;
  viewCaseDetails: (caseId: string) => void;

  // Search & Global Filters
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  filters: GlobalFilterState;
  setFilters: React.Dispatch<React.SetStateAction<GlobalFilterState>>;
  resetFilters: () => void;

  // Filtered Data according to active role & global filters
  filteredCases: CaseRecord[];
  
  // Modals
  isNewCaseModalOpen: boolean;
  setIsNewCaseModalOpen: (open: boolean) => void;
  isNewCoordinationModalOpen: boolean;
  setIsNewCoordinationModalOpen: (open: boolean) => void;
  coordinationTargetPair: { sourceCaseId: string; targetCaseId: string } | null;
  setCoordinationTargetPair: (pair: { sourceCaseId: string; targetCaseId: string } | null) => void;

  // Actions
  createCase: (data: Omit<CaseRecord, 'id' | 'lastUpdated' | 'actionsHistory' | 'relatedCases' | 'internalRemarks'>) => CaseRecord;
  updateCaseStatus: (caseId: string, status: CaseStatus, remarks: string) => void;
  assignOfficer: (caseId: string, name: string, email: string, bureau: BureauType, remarks: string) => void;
  transferBureau: (caseId: string, bureau: BureauType, remarks: string) => void;
  addInternalRemark: (caseId: string, text: string, isConfidential?: boolean) => void;
  reviewOverlap: (id: string, decision: 'Accepted' | 'Rejected' | 'Under Further Investigation', type: 'Related Cases' | 'Confirmed Duplicate', remarks: string) => void;
  createCoordination: (params: Parameters<typeof appData.createCoordinationRequest>[0]) => CoordinationRequest;
  respondCoordination: (requestId: string, message: string, actionTaken?: string, status?: CoordinationRequest['status']) => void;
  updateCoordinationStatus: (requestId: string, status: CoordinationRequest['status'], note?: string) => void;
  setWeights: (weights: MatcherWeights) => void;
  resetToSeedData: () => void;

  // Toasts
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  dismissToast: (id: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

const DEFAULT_FILTERS: GlobalFilterState = {
  dateRange: 'ALL',
  bureau: 'ALL',
  region: 'ALL',
  status: 'ALL',
  institutionId: 'ALL',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dataVersion, setDataVersion] = useState(0);
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [activeRole, setActiveRoleState] = useState<UserRole>(appData.getActiveRole());
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [selectedInstitutionId, setSelectedInstitutionId] = useState<string>('INST-DEMO-SUNRISE');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<GlobalFilterState>(DEFAULT_FILTERS);
  
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);
  const [isNewCoordinationModalOpen, setIsNewCoordinationModalOpen] = useState(false);
  const [coordinationTargetPair, setCoordinationTargetPair] = useState<{ sourceCaseId: string; targetCaseId: string } | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');

  // Subscribe to storage mutations
  useEffect(() => {
    const unsubscribe = appData.subscribe(() => {
      setDataVersion(v => v + 1);
      setActiveRoleState(appData.getActiveRole());
    });
    return unsubscribe;
  }, []);

  const cases = useMemo(() => appData.getCases(), [dataVersion]);
  const institutions = useMemo(() => appData.getInstitutions(), [dataVersion]);
  const suggestions = useMemo(() => appData.getSuggestions(), [dataVersion]);
  const coordinations = useMemo(() => appData.getCoordinations(), [dataVersion]);
  const auditLogs = useMemo(() => appData.getAuditLogs(), [dataVersion]);
  const weights = useMemo(() => appData.getWeights(), [dataVersion]);
  const users = useMemo(() => appData.getUsers(), [dataVersion]);
  const currentUser = useMemo(() => appData.getCurrentUser(), [dataVersion]);

  // Toast manager
  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `TOAST-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const setActiveRole = (role: UserRole) => {
    appData.setActiveRole(role);
    setActiveRoleState(role);
    // Find matching default officer for role if available
    const matchingUser = users.find(u => u.role === role);
    if (matchingUser) {
      appData.setCurrentUser(matchingUser);
    }
    addToast({
      type: 'info',
      title: 'Active Role Switched',
      message: `You are now operating with "${role}" permissions and scope.`,
    });
  };

  const login = (email: string, password?: string) => {
    const res = appData.login(email, password);
    if (res.success && res.user) {
      addToast({
        type: 'success',
        title: 'Authentication Successful',
        message: `Welcome back, ${res.user.name} (${res.user.role}).`,
      });
    } else {
      addToast({
        type: 'error',
        title: 'Sign In Failed',
        message: res.error || 'Authentication error.',
      });
    }
    return res;
  };

  const signup = (params: Omit<UserProfile, 'id' | 'createdAt'>) => {
    const res = appData.signup(params);
    if (res.success && res.user) {
      addToast({
        type: 'success',
        title: 'Officer Registered',
        message: `Account created for ${res.user.name} with role "${res.user.role}".`,
      });
    } else {
      addToast({
        type: 'error',
        title: 'Registration Failed',
        message: res.error || 'Could not complete officer registration.',
      });
    }
    return res;
  };

  const logout = () => {
    appData.logout();
    addToast({
      type: 'info',
      title: 'Signed Out',
      message: 'You have been signed out of AICTE CaseConnect.',
    });
  };

  const switchUser = (userId: string) => {
    const targetUser = users.find(u => u.id === userId);
    if (targetUser) {
      appData.setCurrentUser(targetUser);
      addToast({
        type: 'info',
        title: 'User Switched',
        message: `Active session changed to ${targetUser.name} (${targetUser.role}).`,
      });
    }
  };

  const viewInstitution360 = (instId: string) => {
    setSelectedInstitutionId(instId);
    setCurrentView('institution360');
  };

  const viewCaseDetails = (caseId: string) => {
    setSelectedCaseId(caseId);
  };

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchQuery('');
  };

  // Filtered cases based on user role + active filters + global search
  const filteredCases = useMemo(() => {
    return cases.filter(c => {
      // 1. Role-based scoping (Demo role simulation)
      if (activeRole === 'RB Officer') {
        // RB officers focus on Regulation Bureau cases or cases with RB coordination
        const isRb = c.bureau === 'Regulation Bureau';
        const hasRbCoord = coordinations.some(cr => (cr.fromBureau === 'Regulation Bureau' || cr.toBureau === 'Regulation Bureau') && (cr.sourceCaseId === c.id || cr.targetCaseId === c.id));
        if (!isRb && !hasRbCoord) {
          // Can still view other cases in read-only mode for institutional context
        }
      } else if (activeRole === 'PGRC Officer') {
        // PGRC officer scope
      } else if (activeRole === 'Regional Officer') {
        // Western / Northern region scope for regional officers
        if (c.region !== 'Western' && c.region !== 'Northern') {
          // Region scope preference
        }
      }

      // 2. Bureau filter
      if (filters.bureau !== 'ALL' && c.bureau !== filters.bureau) {
        return false;
      }

      // 3. Status filter
      if (filters.status !== 'ALL' && c.status !== filters.status) {
        return false;
      }

      // 4. Region filter
      if (filters.region !== 'ALL' && c.region !== filters.region) {
        return false;
      }

      // 5. Institution filter
      if (filters.institutionId !== 'ALL' && c.institutionId !== filters.institutionId) {
        return false;
      }

      // 6. Date Range filter
      if (filters.dateRange !== 'ALL') {
        const caseTime = new Date(c.dateReceived).getTime();
        const now = new Date('2026-10-21').getTime();
        const daysDiff = (now - caseTime) / (1000 * 3600 * 24);
        if (filters.dateRange === '30D' && daysDiff > 30) return false;
        if (filters.dateRange === '90D' && daysDiff > 90) return false;
        if (filters.dateRange === '1Y' && daysDiff > 365) return false;
      }

      // 7. Global Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesText = 
          c.id.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.institutionName.toLowerCase().includes(q) ||
          c.aictePermanentId.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.assignedOfficer.name.toLowerCase().includes(q) ||
          c.district.toLowerCase().includes(q) ||
          c.state.toLowerCase().includes(q);
        if (!matchesText) return false;
      }

      return true;
    });
  }, [cases, activeRole, filters, searchQuery, coordinations]);

  // Action Wrappers
  const createCase = (data: Omit<CaseRecord, 'id' | 'lastUpdated' | 'actionsHistory' | 'relatedCases' | 'internalRemarks'>) => {
    const record = appData.createCase(data);
    addToast({
      type: 'success',
      title: 'Case Registered Successfully',
      message: `${record.id} created for ${record.institutionName}. Overlap scan executed.`,
    });
    return record;
  };

  const updateCaseStatus = (caseId: string, status: CaseStatus, remarks: string) => {
    appData.updateCaseStatus(caseId, status, remarks);
    addToast({
      type: 'success',
      title: 'Status Updated',
      message: `${caseId} moved to "${status}". Recorded in audit trail.`,
    });
  };

  const assignOfficer = (caseId: string, name: string, email: string, bureau: BureauType, remarks: string) => {
    appData.assignOfficer(caseId, name, email, bureau, remarks);
    addToast({
      type: 'info',
      title: 'Officer Reassigned',
      message: `${caseId} assigned to ${name} (${bureau}).`,
    });
  };

  const transferBureau = (caseId: string, bureau: BureauType, remarks: string) => {
    appData.transferBureau(caseId, bureau, remarks);
    addToast({
      type: 'warning',
      title: 'Bureau Transferred',
      message: `${caseId} jurisdiction transferred to ${bureau}.`,
    });
  };

  const addInternalRemark = (caseId: string, text: string, isConfidential = false) => {
    appData.addInternalRemark(caseId, text, isConfidential);
    addToast({
      type: 'info',
      title: 'Internal Note Recorded',
      message: `Note added to case ${caseId} (${isConfidential ? 'Confidential' : 'Standard'}).`,
    });
  };

  const reviewOverlap = (
    id: string,
    decision: 'Accepted' | 'Rejected' | 'Under Further Investigation',
    type: 'Related Cases' | 'Confirmed Duplicate',
    remarks: string
  ) => {
    appData.reviewOverlapSuggestion(id, decision, type, remarks);
    addToast({
      type: decision === 'Accepted' ? 'success' : 'info',
      title: `Overlap ${decision}`,
      message: `Suggestion marked as ${decision}. ${decision === 'Accepted' ? `Linked as ${type}.` : ''}`,
    });
  };

  const createCoordination = (params: Parameters<typeof appData.createCoordinationRequest>[0]) => {
    const req = appData.createCoordinationRequest(params);
    addToast({
      type: 'success',
      title: 'Coordination Request Dispatched',
      message: `${req.requestId} sent to ${params.toBureau}. Trackable in Coordination Queue.`,
    });
    return req;
  };

  const respondCoordination = (requestId: string, message: string, actionTaken?: string, status: CoordinationRequest['status'] = 'Responded') => {
    appData.respondToCoordination(requestId, message, actionTaken, status);
    addToast({
      type: 'success',
      title: 'Coordination Responded',
      message: `Response logged for ${requestId}. Status set to ${status}.`,
    });
  };

  const updateCoordinationStatus = (requestId: string, status: CoordinationRequest['status'], note?: string) => {
    appData.updateCoordinationStatus(requestId, status, note);
    addToast({
      type: 'info',
      title: 'Coordination Status Updated',
      message: `${requestId} updated to ${status}.`,
    });
  };

  const setWeights = (newWeights: MatcherWeights) => {
    appData.setWeights(newWeights);
    addToast({
      type: 'success',
      title: 'Matching Weights Recomputed',
      message: 'Cross-bureau overlap suggestions regenerated with updated weights.',
    });
  };

  const resetToSeedData = () => {
    appData.resetToSeedData();
    resetFilters();
    addToast({
      type: 'warning',
      title: 'System Reset to Factory Seed Data',
      message: 'All cases, institutions, suggestions, and audit logs restored to initial prototype state.',
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        activeRole,
        setActiveRole,
        cases,
        institutions,
        suggestions,
        coordinations,
        auditLogs,
        weights,
        currentUser,
        users,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        login,
        signup,
        logout,
        switchUser,
        selectedCaseId,
        setSelectedCaseId,
        selectedInstitutionId,
        setSelectedInstitutionId,
        viewInstitution360,
        viewCaseDetails,
        searchQuery,
        setSearchQuery,
        filters,
        setFilters,
        resetFilters,
        filteredCases,
        isNewCaseModalOpen,
        setIsNewCaseModalOpen,
        isNewCoordinationModalOpen,
        setIsNewCoordinationModalOpen,
        coordinationTargetPair,
        setCoordinationTargetPair,
        createCase,
        updateCaseStatus,
        assignOfficer,
        transferBureau,
        addInternalRemark,
        reviewOverlap,
        createCoordination,
        respondCoordination,
        updateCoordinationStatus,
        setWeights,
        resetToSeedData,
        toasts,
        addToast,
        dismissToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
};
