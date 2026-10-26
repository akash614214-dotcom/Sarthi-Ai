import React from 'react';
import {
  Home,
  Globe,
  Bot,
  CheckSquare,
  FolderOpen,
  History,
  Settings,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { WorkspaceType } from '../types';

interface SidebarProps {
  activeWorkspace: WorkspaceType;
  onSelectWorkspace: (workspace: WorkspaceType) => void;
  unreadTasksCount?: number;
}

interface NavItem {
  id: WorkspaceType;
  label: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'browser', label: 'Browser', icon: Globe },
  { id: 'companion', label: 'AI Companion', icon: Bot },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'library', label: 'Library', icon: FolderOpen },
  { id: 'history', label: 'History', icon: History },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeWorkspace,
  onSelectWorkspace,
  unreadTasksCount = 2,
}) => {
  return (
    <aside className="w-[230px] shrink-0 h-full flex flex-col justify-between p-3.5 glass-panel rounded-3xl border border-white/10 select-none">
      {/* Brand Header */}
      <div>
        <div
          onClick={() => onSelectWorkspace('home')}
          className="flex items-center gap-3 px-2 py-3 mb-4 cursor-pointer group"
        >
          <div className="relative w-8 h-8 rounded-xl overflow-hidden shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition duration-300">
            <img
              src="/sharthi-logo.png"
              alt="Sharthi AI Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[17px] font-bold text-white tracking-wide">
              Sharthi
            </span>
            <span className="text-[17px] font-semibold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Ai
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeWorkspace === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectWorkspace(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-[13px] font-medium transition duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#713BFF]/45 to-[#248CFF]/35 text-white shadow-[0_4px_16px_rgba(113,59,255,0.35)] border border-white/20'
                    : 'text-[#BAC7E8] hover:text-white hover:bg-white/10 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={17}
                    className={
                      isActive
                        ? 'text-cyan-300'
                        : 'text-[#8D9BBF] group-hover:text-white'
                    }
                  />
                  <span>{item.label}</span>
                </div>

                {item.id === 'tasks' && unreadTasksCount > 0 && (
                  <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                    {unreadTasksCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Promotional Brand Card */}
      <div className="relative overflow-hidden rounded-2xl p-3 border border-white/15 bg-gradient-to-b from-[#1c224a]/70 to-[#0e132e]/90 shadow-xl group">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[11px] font-semibold text-white/90 leading-tight">
              Smarter tools.
            </p>
            <p className="text-[11px] font-semibold bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent leading-tight">
              Bigger dreams.
            </p>
          </div>
          <div className="w-10 h-8 rounded-lg overflow-hidden border border-purple-400/30 shadow-md shadow-purple-500/20 relative shrink-0">
            <img
              src="/mountain-sunset.jpg"
              alt="Landscape"
              className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
            />
            <div className="absolute inset-0 bg-purple-500/10" />
          </div>
        </div>
      </div>
    </aside>
  );
};

