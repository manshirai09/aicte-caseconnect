/**
 * AICTE CaseConnect - Institution Intelligence & Cross-Bureau Coordination Platform
 * Integrated Dashboard for Monitoring and Tracking Institution-Related Complaint Cases
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { ToastContainer } from './components/common/ToastContainer';

// Feature Views
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { CaseManagement } from './components/cases/CaseManagement';
import { InstitutionRegistry } from './components/institutions/InstitutionRegistry';
import { Institution360 } from './components/institutions/Institution360';
import { CrossBureauReview } from './components/overlap/CrossBureauReview';
import { CoordinationWorkflow } from './components/coordination/CoordinationWorkflow';
import { SLAEscalations } from './components/sla/SLAEscalations';
import { AnalyticsReports } from './components/analytics/AnalyticsReports';
import { AuditTrailView } from './components/audit/AuditTrailView';
import { SystemAdmin } from './components/admin/SystemAdmin';
import { BenchmarkView } from './components/benchmark/BenchmarkView';
import { UserProfileView } from './components/profile/UserProfileView';

// Role-Specific Views & Auth
import { RegulationDashboard } from './components/dashboard/RegulationDashboard';
import { GrievanceDashboard } from './components/dashboard/GrievanceDashboard';
import { RegionalDashboard } from './components/dashboard/RegionalDashboard';
import { ComplainantPortal } from './components/complainant/ComplainantPortal';
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';
import { RoleGuard } from './components/auth/RoleGuard';

// Modals
import { NewCaseModal } from './components/cases/NewCaseModal';
import { NewCoordinationModal } from './components/coordination/NewCoordinationModal';
import { AuthModal } from './components/auth/AuthModal';

const MainAppContent: React.FC = () => {
  const {
    currentView,
    isNewCaseModalOpen,
    setIsNewCaseModalOpen,
    isNewCoordinationModalOpen,
    setIsNewCoordinationModalOpen,
  } = useApp();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // If user navigated to dedicated full-page auth
  if (currentView === 'login') {
    return (
      <>
        <LoginPage />
        <ToastContainer />
      </>
    );
  }

  if (currentView === 'signup') {
    return (
      <>
        <SignupPage />
        <ToastContainer />
      </>
    );
  }

  const renderActiveView = () => {
    switch (currentView) {
      case 'dashboard':
        return <OverviewDashboard />;
      case 'regulation':
        return (
          <RoleGuard
            allowedRoles={['RB Officer', 'Senior Management', 'Administrator']}
            featureName="Regulation Bureau Workstation"
          >
            <RegulationDashboard />
          </RoleGuard>
        );
      case 'grievance':
        return (
          <RoleGuard
            allowedRoles={['PGRC Officer', 'Senior Management', 'Administrator']}
            featureName="Public Grievance Redressal Cell Workstation"
          >
            <GrievanceDashboard />
          </RoleGuard>
        );
      case 'regional':
        return (
          <RoleGuard
            allowedRoles={['Regional Officer', 'Senior Management', 'Administrator']}
            featureName="Regional Office Scrutiny Workstation"
          >
            <RegionalDashboard />
          </RoleGuard>
        );
      case 'complainant':
        return <ComplainantPortal />;
      case 'cases':
        return (
          <RoleGuard
            allowedRoles={['Senior Management', 'RB Officer', 'PGRC Officer', 'Regional Officer', 'Administrator']}
            featureName="Official AICTE Inter-Bureau Case Registry"
          >
            <CaseManagement />
          </RoleGuard>
        );
      case 'institutions':
        return <InstitutionRegistry />;
      case 'institution360':
        return <Institution360 />;
      case 'overlap':
        return (
          <RoleGuard
            allowedRoles={['Senior Management', 'RB Officer', 'PGRC Officer', 'Administrator']}
            featureName="Cross-Bureau Overlap Adjudication"
          >
            <CrossBureauReview />
          </RoleGuard>
        );
      case 'coordination':
        return (
          <RoleGuard
            allowedRoles={['Senior Management', 'RB Officer', 'PGRC Officer', 'Administrator']}
            featureName="Inter-Bureau Coordination Requests"
          >
            <CoordinationWorkflow />
          </RoleGuard>
        );
      case 'sla':
        return (
          <RoleGuard
            allowedRoles={['Senior Management', 'RB Officer', 'PGRC Officer', 'Regional Officer', 'Administrator']}
            featureName="SLA & Escalations Desk"
          >
            <SLAEscalations />
          </RoleGuard>
        );
      case 'analytics':
        return <AnalyticsReports />;
      case 'audit':
        return (
          <RoleGuard
            allowedRoles={['Senior Management', 'Administrator']}
            featureName="System Audit & Compliance Docket"
          >
            <AuditTrailView />
          </RoleGuard>
        );
      case 'admin':
        return (
          <RoleGuard
            allowedRoles={['Administrator']}
            featureName="AICTE Systems & User Administration Console"
          >
            <SystemAdmin />
          </RoleGuard>
        );
      case 'benchmark':
        return <BenchmarkView />;
      case 'profile':
        return <UserProfileView />;
      default:
        return <OverviewDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans antialiased text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Top AICTE Navigation Bar */}
      <Header />

      {/* Main Body with Collapsible Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Modals */}
      <NewCaseModal
        isOpen={isNewCaseModalOpen}
        onClose={() => setIsNewCaseModalOpen(false)}
      />

      <NewCoordinationModal
        isOpen={isNewCoordinationModalOpen}
        onClose={() => setIsNewCoordinationModalOpen(false)}
      />

      {/* Authentication & Role Model Modal */}
      <AuthModal />

      {/* Floating Notifications */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
