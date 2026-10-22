import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  KeyRound,
  Mail,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
} from 'lucide-react';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
  const { requestPasswordReset, resetPasswordWithToken } = useApp();

  const [step, setStep] = useState<'request' | 'reset' | 'success'>('request');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [generatedToken, setGeneratedToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleRequestToken = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) {
      setError('Please provide your registered account email address.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = requestPasswordReset(email);
      setLoading(false);
      if (res.success && res.token) {
        setGeneratedToken(res.token);
        setToken(res.token); // Auto-fill for seamless user testing
        setStep('reset');
      } else {
        setError(res.error || 'Account not found.');
      }
    }, 400);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!token.trim()) {
      setError('Please enter the reset token.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = resetPasswordWithToken(email, token, newPassword);
      setLoading(false);
      if (res.success) {
        setStep('success');
      } else {
        setError(res.error || 'Password reset failed.');
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in zoom-in-95">
        {/* Header Banner */}
        <div className="bg-slate-900 text-white p-5 border-b border-slate-800 relative">
          <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-white to-emerald-600 absolute top-0 left-0" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-600/30 border border-blue-500/40 rounded-lg text-blue-400">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Password Recovery</h3>
                <p className="text-[11px] text-slate-400">AICTE Security Token Verification</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {step === 'request' && (
            <form onSubmit={handleRequestToken} className="space-y-4 text-xs">
              <p className="text-slate-600 text-[11px]">
                Enter your registered AICTE CaseConnect email address. An expiring single-use security token (valid for 15 minutes) will be generated to reset your password.
              </p>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Registered Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. rb.director@aicte-india.org or student.aaditya@gmail.com"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-2 text-slate-600 hover:text-slate-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition"
                >
                  {loading ? 'Validating...' : 'Request Security Token'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {step === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4 text-xs">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[11px]">
                  <Clock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Security Token Generated (Valid for 15 mins)</span>
                </div>
                <p className="text-[10px] font-mono font-bold bg-white p-1 rounded border border-amber-300 inline-block text-amber-800">
                  {generatedToken}
                </p>
                <p className="text-[10px] text-amber-700">Token has been auto-filled into the field below for rapid validation.</p>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Security Token <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={token}
                  onChange={e => setToken(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  New Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Confirm New Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep('request')}
                  className="px-3 py-2 text-slate-600 hover:text-slate-800 font-medium"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition"
                >
                  {loading ? 'Updating...' : 'Set New Password'}
                  <ShieldCheck className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {step === 'success' && (
            <div className="text-center py-4 space-y-4 text-xs">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Password Reset Complete</h4>
                <p className="text-slate-500 mt-1">
                  Your credentials have been securely updated and recorded in the audit trail. You can now log in.
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm transition"
              >
                Proceed to Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
