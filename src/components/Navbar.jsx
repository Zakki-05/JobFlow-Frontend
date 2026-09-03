import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Menu, Database, LogOut, User as UserIcon, Sparkles, ChevronDown } from 'lucide-react';

const Navbar = ({ onOpenMobileMenu }) => {
  const { user, logout, triggerSeedData } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const handleSeedData = async () => {
    setSeeding(true);
    await triggerSeedData();
    setSeeding(false);
  };

  return (
    <header className="sticky top-0 z-30 h-16 glass-panel border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Engine Online</span>
          <span className="px-2 py-0.5 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-500/30 text-[10px] font-sans font-bold">
            Fresher Edition
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Seed Demo Data Button */}
        <button
          onClick={handleSeedData}
          disabled={seeding}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-50"
          title="Populate demo jobs, applications, skills, and interviews"
        >
          <Database className={`w-3.5 h-3.5 ${seeding ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{seeding ? 'Seeding Data...' : 'Seed Demo Data'}</span>
        </button>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-800/60 border border-slate-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
              {user?.username?.slice(0, 2).toUpperCase() || 'JF'}
            </div>
            <div className="hidden md:block text-left text-xs">
              <p className="font-semibold text-slate-200 leading-none">{user?.first_name || user?.username}</p>
              <p className="text-[11px] text-slate-400 leading-none mt-1">{user?.profile?.target_role || 'Candidate'}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {dropdownOpen && (
            <div
              onClick={() => setDropdownOpen(false)}
              className="absolute right-0 mt-2 w-56 glass-panel rounded-2xl shadow-2xl py-2 border border-slate-800 z-50 animate-in fade-in slide-in-from-top-2"
            >
              <div className="px-4 py-2 border-b border-slate-800/80">
                <p className="text-xs font-semibold text-white">{user?.username}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
              </div>

              <a
                href="/profile"
                className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-300 hover:bg-indigo-600/20 hover:text-indigo-300 transition-colors"
              >
                <UserIcon className="w-4 h-4" />
                Profile Preferences
              </a>

              <div className="border-t border-slate-800/80 my-1"></div>

              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-4 py-2 text-xs font-medium text-rose-400 hover:bg-rose-950/40 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
