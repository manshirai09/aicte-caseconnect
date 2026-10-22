import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import {
  ShieldAlert,
  Lock,
  ArrowRight,
  UserCheck,
  Building2,
  AlertOctagon,
  LogOut,
} from 'lucide-react';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  requireActive?: boolean;
  featureName?: string;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  allowedRoles,
  requireActive = true,
  featureName = 'This Bureau Workspace',
}) => {
  const {
    currentUser,
    activeRole,
    redirectToRoleDashboard,
    setIsAuthModalOpen,
    setAuthModalMode,
    logout,
  } = useApp();

  const userRole = currentUser?.role || activeRole;
  const isAuthorized = !allowedRoles || allowedRoles.includes(userRole);
  const isApproved = !requireActive || !currentUser || currentUser.accountStatus === 'ACTIVE';

  if (!isAuthorized || !isApproved) {
    return (
      <div className="p-8 max-w-2xl mx-auto my-12 text-center">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden p-8 space-y-5">
          {/* Top Tricolour Stripe */}
          <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600 -mt-8 -mx-8 mb-6" />

          <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 text-rose-600 mx-auto flex items-center justify-center shadow-sm">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div>
            <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200">
              Clearance Level Restricted
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-2">
              Access Restricted: {featureName}
            </h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Your active role <strong className="text-slate-900 font-semibold font-mono">[{userRole}]</strong> does not have authorization to view or execute operations within this workspace. In accordance with the AICTE Inter-Bureau Coordination Directive, access is partitioned by statutory jurisdiction.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-left text-xs space-y-1">
            <p className="font-semibold text-slate-800">Authorized Personnel Roles:</p>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {(allowedRoles || ['Senior Management', 'Administrator', 'RB Officer', 'PGRC Officer']).map(r => (
                <span
                  key={r}
                  className="px-2 py-0.5 rounded bg-white border border-slate-300 text-slate-700 font-medium text-[11px]"
                >
                  ✓ {r}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => redirectToRoleDashboard(userRole)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition"
            >
              <span>Return to My Role Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                setAuthModalMode('login');
                setIsAuthModalOpen(true);
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition"
            >
              <UserCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Sign In as Another Officer</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
