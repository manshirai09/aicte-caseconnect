/**
 * AICTE CaseConnect - Institution Intelligence & Cross-Bureau Coordination Platform
 * Smart India Hackathon SIH26264 MVP
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { FilterBar } from './components/common/FilterBar';
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

  const renderActiveView = () => {
    switch (currentView) {
      case 'dashboard':
        return <OverviewDashboard />;
      case 'cases':
        return <CaseManagement />;
      case 'institutions':
        return <InstitutionRegistry />;
      case 'institution360':
        return <Institution360 />;
      case 'overlap':
        return <CrossBureauReview />;
      case 'coordination':
        return <CoordinationWorkflow />;
      case 'sla':
        return <SLAEscalations />;
      case 'analytics':
        return <AnalyticsReports />;
      case 'audit':
        return <AuditTrailView />;
      case 'admin':
        return <SystemAdmin />;
      case 'benchmark':
        return <BenchmarkView />;
      default:
        return <OverviewDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans antialiased text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Top AICTE Navigation Bar */}
      <Header />

      {/* Global Filter Bar (visible across dashboard, cases, institutions, and reports) */}
      {(currentView === 'dashboard' || currentView === 'cases' || currentView === 'analytics') && (
        <FilterBar />
      )}

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
