import React from 'react';
import { useApp, AppView } from '../../context/AppContext';
import {
  LayoutDashboard,
  FolderKanban,
  Building2,
  ScanEye,
  GitCompareArrows,
  Network,
  ClockAlert,
  BarChart3,
  History,
  ShieldCheck,
  FileCheck2,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
} from 'lucide-react';

export const Sidebar: React.FC<{ isCollapsed: boolean; setIsCollapsed: (val: boolean) => void }> = ({
  isCollapsed,
  setIsCollapsed,
}) => {
  const { currentView, setCurrentView, cases, suggestions, coordinations } = useApp();

  const openCasesCount = cases.filter(c => c.status !== 'Resolved' && c.status !== 'Closed').length;
  const overdueCount = cases.filter(c => {
    if (c.status === 'Resolved' || c.status === 'Closed') return false;
    return new Date(c.dueDate).getTime() < new Date('2026-10-21').getTime();
  }).length;
  const pendingOverlapCount = suggestions.filter(s => s.status === 'Pending Review').length;
  const pendingCoordCount = coordinations.filter(c => c.status === 'Requested' || c.status === 'Information Requested').length;

  const navItems: {
    id: AppView;
    label: string;
    icon: React.ReactNode;
    badge?: number;
    badgeColor?: string;
  }[] = [
    {
      id: 'dashboard',
      label: 'Overview Dashboard',
      icon: <LayoutDashboard className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'cases',
      label: 'Case Management',
      icon: <FolderKanban className="w-4 h-4 shrink-0" />,
      badge: openCasesCount,
      badgeColor: 'bg-blue-100 text-blue-800',
    },
    {
      id: 'institutions',
      label: 'Institution Registry',
      icon: <Building2 className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'institution360',
      label: 'Institution 360',
      icon: <ScanEye className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'overlap',
      label: 'Cross-Bureau Overlap',
      icon: <GitCompareArrows className="w-4 h-4 shrink-0" />,
      badge: pendingOverlapCount,
      badgeColor: 'bg-rose-100 text-rose-800 font-bold animate-pulse',
    },
    {
      id: 'coordination',
      label: 'Coordination Requests',
      icon: <Network className="w-4 h-4 shrink-0" />,
      badge: pendingCoordCount,
      badgeColor: 'bg-cyan-100 text-cyan-800 font-bold',
    },
    {
      id: 'sla',
      label: 'SLA & Escalations',
      icon: <ClockAlert className="w-4 h-4 shrink-0" />,
      badge: overdueCount,
      badgeColor: 'bg-amber-100 text-amber-900 font-bold',
    },
    {
      id: 'analytics',
      label: 'Analytics & Reports',
      icon: <BarChart3 className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'audit',
      label: 'Audit Trail',
      icon: <History className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'admin',
      label: 'User & System Admin',
      icon: <ShieldCheck className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'benchmark',
      label: 'Evaluation & Benchmark',
      icon: <FileCheck2 className="w-4 h-4 shrink-0" />,
    },
  ];

  return (
    <aside
      className={`bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-all duration-200 shrink-0 select-none ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Navigation Section */}
      <div className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
        {!isCollapsed ? (
          <div className="px-2.5 pb-3 mb-2 border-b border-slate-800/80 flex items-center gap-2.5">
            <img
              src="/assets/aistudio/AICTE_325fa493.jpeg"
              alt="AICTE Logo"
              className="w-7 h-7 rounded-full bg-white p-0.5 object-contain shadow-xs shrink-0"
            />
            <div className="overflow-hidden">
              <span className="text-[11px] font-bold text-slate-200 block truncate leading-tight">
                AICTE Governance
              </span>
              <span className="text-[9px] text-amber-400 block font-medium tracking-wide">
                योग: कर्मसु कौशलम्
              </span>
            </div>
          </div>
        ) : null}

        <div className={`px-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 ${isCollapsed ? 'hidden' : 'block'}`}>
          AICTE Bureaus / Cells
        </div>

        {navItems.map(item => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-md transition-all duration-150 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm font-semibold'
                  : 'hover:bg-slate-800/80 text-slate-300 hover:text-white'
              } ${isCollapsed ? 'justify-center px-0' : ''}`}
            >
              <div className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                {item.icon}
              </div>

              {!isCollapsed && (
                <div className="flex-1 flex items-center justify-between truncate">
                  <span className="truncate">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                        isActive ? 'bg-white text-blue-900 font-bold' : item.badgeColor || 'bg-slate-700 text-slate-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Collapse Toggle */}
      <div className="p-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        {!isCollapsed && (
          <div className="px-2 text-[10px] text-slate-500">
            <span>AICTE Intranet v2.4</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition mx-auto"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};
