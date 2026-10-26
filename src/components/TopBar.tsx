import React from 'react';
import {
  Search,
  Sparkles,
  Bell,
  ChevronDown,
  Database,
  Command,
} from 'lucide-react';
import { UserProfile } from '../types';

interface TopBarProps {
  onOpenCommandPalette: () => void;
  onToggleNotifications: () => void;
  unreadNotificationsCount: number;
  isSupabaseConnected: boolean;
  onOpenSupabaseSettings: () => void;
  user: UserProfile;
}

export const TopBar: React.FC<TopBarProps> = ({
  onOpenCommandPalette,
  onToggleNotifications,
  unreadNotificationsCount,
  isSupabaseConnected,
  onOpenSupabaseSettings,
  user,
}) => {
  return (
    <header className="h-14 flex items-center justify-between px-2 mb-2 select-none">
      {/* Central Search / Omnibox Pill */}
      <div className="flex-1 max-w-xl">
        <div
          onClick={onOpenCommandPalette}
          className="flex items-center justify-between w-full h-11 px-4 rounded-2xl glass-pill cursor-pointer hover:border-cyan-400/40 transition duration-200 shadow-md group"
        >
          <div className="flex items-center gap-2.5 text-[#BAC7E8]">
            <Search size={16} className="text-[#8D9BBF] group-hover:text-cyan-300 transition" />
            <span className="text-[13px] text-[#8D9BBF] group-hover:text-[#BAC7E8] transition">
              Search or ask anything...
            </span>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-white/10 border border-white/10 text-[11px] text-[#8D9BBF] group-hover:text-white transition">
            <Command size={11} />
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Supabase Status Pill */}
        <button
          onClick={onOpenSupabaseSettings}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-[12px] font-medium border transition ${
            isSupabaseConnected
              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25'
              : 'bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/25'
          }`}
          title="Supabase Connected Database"
        >
          <Database size={13} />
          <span className="hidden md:inline">
            {isSupabaseConnected ? 'Supabase Sync' : 'Connect DB'}
          </span>
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isSupabaseConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
            }`}
          />
        </button>

        {/* Quick Sparkle Action */}
        <button
          onClick={onOpenCommandPalette}
          className="w-10 h-10 rounded-2xl glass-pill flex items-center justify-center text-[#BAC7E8] hover:text-cyan-300 hover:scale-105 transition"
          title="Quick Commands"
        >
          <Sparkles size={16} />
        </button>

        {/* Notifications Bell */}
        <button
          onClick={onToggleNotifications}
          className="relative w-10 h-10 rounded-2xl glass-pill flex items-center justify-center text-[#BAC7E8] hover:text-white hover:scale-105 transition"
          title="Notifications"
        >
          <Bell size={16} />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#18DDF5]" />
          )}
        </button>

        {/* User Profile Pill */}
        <div className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-2xl glass-pill cursor-pointer hover:border-white/30 transition">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#713BFF] to-[#C044FF] flex items-center justify-center text-[12px] font-bold text-white shadow-md shadow-purple-500/30 border border-white/20">
            {user.initials}
          </div>
          <span className="text-[13px] font-medium text-white hidden sm:inline">
            {user.name}
          </span>
          <ChevronDown size={14} className="text-[#8D9BBF]" />
        </div>
      </div>
    </header>
  );
};

