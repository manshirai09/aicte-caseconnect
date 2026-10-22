import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { UserProfile, UserRole, BureauType, AccountStatus } from '../../types';
import {
  UserCheck,
  ShieldCheck,
  ShieldAlert,
  Search,
  Filter,
  PlusCircle,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  Edit,
  Mail,
  Lock,
  Building2,
  MapPin,
  Clock,
  Eye,
} from 'lucide-react';

export const AdminUserManagement: React.FC = () => {
  const {
    users,
    currentUser,
    adminApproveUser,
    adminRejectUser,
    adminToggleUserStatus,
    adminUpdateUserRole,
    adminCreateOfficer,
    switchUser,
  } = useApp();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Provision Officer Modal State
  const [isProvisionOpen, setIsProvisionOpen] = useState(false);
  const [provName, setProvName] = useState('');
  const [provEmail, setProvEmail] = useState('');
  const [provRole, setProvRole] = useState<UserRole>('RB Officer');
  const [provBureau, setProvBureau] = useState<BureauType>('Regulation Bureau');
  const [provDesignation, setProvDesignation] = useState('Scrutiny Officer');
  const [provEmployeeId, setProvEmployeeId] = useState(`AICTE-${Math.floor(1000 + Math.random() * 9000)}`);
  const [provRegion, setProvRegion] = useState('Western');
  const [provPassword, setProvPassword] = useState('password123');

  // Edit Role Modal State
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [newRole, setNewRole] = useState<UserRole>('RB Officer');
  const [newBureau, setNewBureau] = useState<BureauType>('Regulation Bureau');

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
      if (statusFilter !== 'ALL' && u.accountStatus !== statusFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.employeeId.toLowerCase().includes(q) ||
          u.designation.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [users, roleFilter, statusFilter, search]);

  const pendingUsers = users.filter(u => u.accountStatus === 'PENDING_APPROVAL');

  const handleCreateOfficer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!provName.trim() || !provEmail.trim()) return;

    adminCreateOfficer({
      name: provName,
      email: provEmail,
      role: provRole,
      bureau: provBureau,
      designation: provDesignation,
      employeeId: provEmployeeId,
      region: provRole === 'Regional Officer' ? provRegion : undefined,
      password: provPassword,
      accountStatus: 'ACTIVE',
    });

    setIsProvisionOpen(false);
    setProvName('');
    setProvEmail('');
  };

  const handleUpdateRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    adminUpdateUserRole(editingUser.id, newRole, newBureau);
    setEditingUser(null);
  };

  return (
    <div className="space-y-6">
      {/* Pending Approvals Queue Banner (if any) */}
      {pendingUsers.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Pending Officer Registrations Awaiting Verification ({pendingUsers.length})</span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-bold">
              Action Required
            </span>
          </div>
          <p className="text-xs text-amber-800">
            The following personnel have registered requesting privileged AICTE officer clearances. Review their credentials and grant or reject access:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {pendingUsers.map(u => (
              <div key={u.id} className="bg-white p-3 rounded-lg border border-amber-200 shadow-2xs space-y-2 text-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-bold text-slate-900 block">{u.name}</span>
                    <span className="text-[11px] text-blue-700 font-mono">{u.email}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[10px] font-bold">
                    {u.role}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500">
                  <div>Application ID: <strong className="font-mono text-slate-700">{u.employeeId}</strong></div>
                  <div>Designation: {u.designation}</div>
                  {u.institutionName && <div>Affiliation: {u.institutionName}</div>}
                </div>
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    onClick={() => adminRejectUser(u.id, 'Identity unverified')}
                    className="px-2.5 py-1 rounded bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-semibold text-[11px] transition"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => adminApproveUser(u.id)}
                    className="px-3 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700 font-bold text-[11px] shadow-2xs transition flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Approve & Grant Clearance</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Control Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-blue-600" />
            <span>Platform User Accounts & Role-Based Access Control (RBAC)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Administer officer profiles, manage privileges, suspend or authorize access credentials
          </p>
        </div>

        <button
          onClick={() => setIsProvisionOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Provision Authorized Officer</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search user name, email, employee ID..."
              className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 w-64"
            />
          </div>

          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="text-xs py-1.5 px-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">All Roles</option>
            <option value="Senior Management">Senior Management</option>
            <option value="RB Officer">RB Officer</option>
            <option value="PGRC Officer">PGRC Officer</option>
            <option value="Regional Officer">Regional Officer</option>
            <option value="Administrator">Administrator</option>
            <option value="Student / Complainant">Student / Complainant</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="text-xs py-1.5 px-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="PENDING_APPROVAL">PENDING APPROVAL</option>
            <option value="SUSPENDED">SUSPENDED</option>
          </select>
        </div>

        <span className="text-xs text-slate-500 font-mono">
          Showing <strong>{filteredUsers.length}</strong> of {users.length} accounts
        </span>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700 border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
            <tr>
              <th className="py-2.5 px-3">Officer / User</th>
              <th className="py-2.5 px-3">Role Model</th>
              <th className="py-2.5 px-3">Bureau / Cell</th>
              <th className="py-2.5 px-3">Designation & ID</th>
              <th className="py-2.5 px-3">Account Status</th>
              <th className="py-2.5 px-3">Last Login</th>
              <th className="py-2.5 px-3 text-right">Admin Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.map(u => {
              const isCurrent = currentUser?.id === u.id;
              return (
                <tr key={u.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-3 px-3">
                    <span className="font-bold text-slate-900 block">{u.name}</span>
                    <span className="text-[10px] text-blue-700 font-mono">{u.email}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200 whitespace-nowrap">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-medium text-slate-700">
                    {u.bureau}
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-slate-800 block truncate max-w-[160px]">{u.designation}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{u.employeeId}</span>
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    {u.accountStatus === 'ACTIVE' && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200 inline-flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                        ACTIVE
                      </span>
                    )}
                    {u.accountStatus === 'PENDING_APPROVAL' && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-200 inline-flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600" />
                        PENDING APPROVAL
                      </span>
                    )}
                    {u.accountStatus === 'SUSPENDED' && (
                      <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold border border-rose-200 inline-flex items-center gap-1">
                        <XCircle className="w-3 h-3 text-rose-600" />
                        SUSPENDED
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-mono text-[10px] text-slate-500 whitespace-nowrap">
                    {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Never'}
                  </td>
                  <td className="py-3 px-3 text-right whitespace-nowrap space-x-1.5">
                    {u.accountStatus === 'PENDING_APPROVAL' ? (
                      <>
                        <button
                          onClick={() => adminApproveUser(u.id)}
                          className="px-2 py-1 text-[11px] rounded bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-2xs"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => adminRejectUser(u.id, 'Application denied')}
                          className="px-2 py-1 text-[11px] rounded bg-rose-100 text-rose-700 font-semibold hover:bg-rose-200"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingUser(u);
                            setNewRole(u.role);
                            setNewBureau(u.bureau);
                          }}
                          className="px-2 py-1 text-[11px] rounded border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium"
                          title="Modify assigned role"
                        >
                          Edit Role
                        </button>
                        <button
                          onClick={() => adminToggleUserStatus(u.id)}
                          className={`px-2 py-1 text-[11px] rounded font-medium border ${
                            u.accountStatus === 'ACTIVE'
                              ? 'border-rose-200 text-rose-700 hover:bg-rose-50'
                              : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                          }`}
                        >
                          {u.accountStatus === 'ACTIVE' ? 'Suspend' : 'Reactivate'}
                        </button>
                        <button
                          onClick={() => switchUser(u.id)}
                          className="px-2 py-1 text-[11px] rounded bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold"
                        >
                          {isCurrent ? 'Current' : 'Switch To'}
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Provision Officer Modal */}
      {isProvisionOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in zoom-in-95">
            <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-bold">Direct Officer Account Provisioning</h3>
              </div>
              <button onClick={() => setIsProvisionOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateOfficer} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={provName}
                    onChange={e => setProvName(e.target.value)}
                    placeholder="e.g. Dr. Rajesh K. Nair"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Official AICTE Email *</label>
                  <input
                    type="email"
                    required
                    value={provEmail}
                    onChange={e => setProvEmail(e.target.value)}
                    placeholder="name@aicte-india.org"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Role Model *</label>
                  <select
                    value={provRole}
                    onChange={e => setProvRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="Senior Management">Senior Management</option>
                    <option value="RB Officer">RB Officer</option>
                    <option value="PGRC Officer">PGRC Officer</option>
                    <option value="Regional Officer">Regional Officer</option>
                    <option value="Administrator">Administrator</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Primary Bureau *</label>
                  <select
                    value={provBureau}
                    onChange={e => setProvBureau(e.target.value as BureauType)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  >
                    <option value="Regulation Bureau">Regulation Bureau</option>
                    <option value="PGRC">PGRC</option>
                    <option value="Approval Bureau">Approval Bureau</option>
                    <option value="Legal Cell">Legal Cell</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Official Designation</label>
                  <input
                    type="text"
                    value={provDesignation}
                    onChange={e => setProvDesignation(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Employee ID</label>
                  <input
                    type="text"
                    value={provEmployeeId}
                    onChange={e => setProvEmployeeId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProvisionOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg font-medium text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm"
                >
                  Provision Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Role Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in zoom-in-95">
            <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-bold">Modify Assigned Role: {editingUser.name}</h3>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleUpdateRole} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">New Role Model</label>
                <select
                  value={newRole}
                  onChange={e => setNewRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="Senior Management">Senior Management</option>
                  <option value="RB Officer">RB Officer</option>
                  <option value="PGRC Officer">PGRC Officer</option>
                  <option value="Regional Officer">Regional Officer</option>
                  <option value="Administrator">Administrator</option>
                  <option value="Student / Complainant">Student / Complainant</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Bureau</label>
                <select
                  value={newBureau}
                  onChange={e => setNewBureau(e.target.value as BureauType)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="Regulation Bureau">Regulation Bureau</option>
                  <option value="PGRC">PGRC</option>
                  <option value="Approval Bureau">Approval Bureau</option>
                  <option value="Legal Cell">Legal Cell</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm"
                >
                  Save Role Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
