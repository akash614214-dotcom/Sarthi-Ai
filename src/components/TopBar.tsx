import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  Bell,
  ChevronDown,
  LogIn,
  UserPlus,
  LogOut,
  User,
} from 'lucide-react';
import { UserProfile } from '../types';

interface TopBarProps {
  onOpenCommandPalette: () => void;
  onToggleNotifications: () => void;
  unreadNotificationsCount: number;
  user: UserProfile;
  onOpenAuthModal: (mode: 'signin' | 'signup') => void;
  onSignOut: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenCommandPalette,
  onToggleNotifications,
  unreadNotificationsCount,
  user,
  onOpenAuthModal,
  onSignOut,
}) => {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <header className="h-12 flex items-center justify-between px-1 mb-2 select-none relative">
      {/* Central Search / Omnibox Pill matching Screenshot 2 */}
      <div className="flex-1 max-w-xl">
        <div
          onClick={onOpenCommandPalette}
          className="flex items-center justify-between w-full h-10 px-4 rounded-2xl glass-pill cursor-pointer hover:border-cyan-400/40 transition duration-200 shadow-sm group"
        >
          <div className="flex items-center gap-2.5 text-[#BAC6E8]">
            <Search size={15} className="text-[#8D9BBF] group-hover:text-cyan-300 transition" />
            <span className="text-[12.5px] text-[#8D9BBF] group-hover:text-[#BAC6E8] transition">
              Search or ask anything...
            </span>
          </div>

          <div className="flex items-center text-[#8D9BBF] group-hover:text-cyan-300 transition">
            <Sparkles size={14} />
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2">
        {/* Quick Sparkle Action */}
        <button
          onClick={onOpenCommandPalette}
          className="w-9 h-9 rounded-2xl glass-pill flex items-center justify-center text-[#BAC6E8] hover:text-cyan-300 transition"
          title="Quick Commands"
        >
          <Sparkles size={15} />
        </button>

        {/* Notifications Bell */}
        <button
          onClick={onToggleNotifications}
          className="relative w-9 h-9 rounded-2xl glass-pill flex items-center justify-center text-[#BAC6E8] hover:text-white transition"
          title="Notifications"
        >
          <Bell size={15} />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#18DDF5]" />
          )}
        </button>

        {/* User Profile Pill or Sign In/Sign Up */}
        {user.isAuthenticated ? (
          <div className="relative">
            <div
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-2xl glass-pill cursor-pointer hover:border-white/30 transition shadow-sm"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#713BFF] to-[#C04CFF] flex items-center justify-center text-[11px] font-bold text-white shadow-md shadow-purple-500/30 border border-white/20">
                {user.initials}
              </div>
              <span className="text-[12px] font-medium text-white hidden sm:inline">
                {user.name}
              </span>
              <ChevronDown size={13} className="text-[#8D9BBF]" />
            </div>

            {/* Profile Dropdown */}
            {profileDropdownOpen && (
              <div className="absolute right-0 top-11 z-50 w-52 glass-panel rounded-2xl border border-white/20 shadow-2xl p-2 text-white animate-in fade-in">
                <div className="px-3 py-2 border-b border-white/10">
                  <p className="text-[12px] font-bold text-white">{user.name}</p>
                  <p className="text-[10px] text-[#8D9BBF] truncate">{user.email}</p>
                  <span className="inline-block mt-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
                    {user.plan}
                  </span>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onOpenAuthModal('signin');
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] text-[#BAC6E8] hover:text-white hover:bg-white/10 transition"
                  >
                    <User size={13} />
                    <span>Switch Account</span>
                  </button>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onSignOut();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] text-rose-300 hover:text-rose-200 hover:bg-rose-500/10 transition"
                  >
                    <LogOut size={13} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onOpenAuthModal('signin')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-2xl glass-pill text-[11.5px] font-medium text-[#BAC6E8] hover:text-white hover:border-cyan-400/50 transition"
            >
              <LogIn size={13} className="text-cyan-400" />
              <span>Sign In</span>
            </button>
            <button
              onClick={() => onOpenAuthModal('signup')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-[11.5px] font-semibold shadow-md shadow-purple-500/20 hover:scale-105 transition"
            >
              <UserPlus size={13} />
              <span className="hidden sm:inline">Sign Up</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
