import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Sparkles,
  User,
  Settings,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  Plus,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/common/Button';

export const DashboardLayout: React.FC<{ children: React.ReactNode; onNewPortfolio?: () => void }> = ({
  children,
  onNewPortfolio,
}) => {
  const { user, signOut, isDemoMode } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Banner if in Demo Mode */}
      {isDemoMode && (
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border-b border-emerald-500/20 px-4 py-1.5 text-xs flex items-center justify-between text-slate-300">
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              <strong className="text-emerald-400 font-semibold">Demo Sandbox Active:</strong> Portfolios and auth are persisted in local workspace. Connect your Supabase credentials in <code className="bg-slate-800 px-1 py-0.5 rounded text-emerald-300">.env</code> to activate live cloud database & auth.
            </span>
          </div>
        </div>
      )}

      {/* Main Dashboard Header */}
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Breadcrumb */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              </div>
              <span className="font-display font-bold text-base tracking-tight text-white">
                Status 200
              </span>
            </Link>

            <nav className="hidden sm:flex items-center gap-1 pl-4 border-l border-slate-800 text-sm">
              <Link
                to="/dashboard"
                className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors ${
                  location.pathname === '/dashboard'
                    ? 'bg-slate-800 text-slate-100 font-medium'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Portfolios
              </Link>
              <Link
                to="/settings"
                className={`px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors ${
                  location.pathname === '/settings'
                    ? 'bg-slate-800 text-slate-100 font-medium'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Settings className="w-4 h-4" />
                Settings
              </Link>
            </nav>
          </div>

          {/* Right Header: CTA + User dropdown */}
          <div className="flex items-center gap-3">
            {onNewPortfolio && (
              <Button
                variant="primary"
                size="sm"
                onClick={onNewPortfolio}
                leftIcon={<Plus className="w-4 h-4" />}
                className="hidden sm:inline-flex"
              >
                New Portfolio
              </Button>
            )}

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-800 hover:border-slate-700 bg-slate-900/80 transition-colors"
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.fullName || 'User'}
                    className="w-7 h-7 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xs font-semibold">
                    {user?.fullName?.charAt(0).toUpperCase() || <User className="w-3.5 h-3.5" />}
                  </div>
                )}
                <span className="text-xs font-medium text-slate-200 max-w-[120px] truncate hidden md:block">
                  {user?.fullName || 'User'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setDropdownOpen(false)}
                    aria-hidden="true"
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl p-1.5 z-30 animate-slide-up text-xs">
                    <div className="px-3 py-2 border-b border-slate-800 mb-1">
                      <p className="font-semibold text-slate-200 truncate">{user?.fullName}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-slate-400" />
                      Dashboard
                    </Link>

                    <Link
                      to="/settings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      Account Settings
                    </Link>

                    <div className="my-1 border-t border-slate-800" />

                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};
