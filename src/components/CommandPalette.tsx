import React, { useState, useEffect } from 'react';
import {
  Search,
  Globe,
  Bot,
  CheckSquare,
  FolderOpen,
  History,
  Settings,
  Sparkles,
  ArrowRight,
  X,
  Code2,
} from 'lucide-react';
import { WorkspaceType } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWorkspace: (workspace: WorkspaceType) => void;
  onExecutePrompt: (prompt: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectWorkspace,
  onExecutePrompt,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const ACTIONS = [
    { label: 'Go to Home Dashboard', icon: Sparkles, action: () => onSelectWorkspace('home') },
    { label: 'Open Browser Workspace', icon: Globe, action: () => onSelectWorkspace('browser') },
    { label: 'Deep Research Workspace', icon: Search, action: () => onSelectWorkspace('research') },
    { label: 'Content & Slide Creator', icon: Sparkles, action: () => onSelectWorkspace('create') },
    { label: 'Code & Debugging Assistant', icon: Code2, action: () => onSelectWorkspace('code') },
    { label: 'View Autonomous Tasks', icon: CheckSquare, action: () => onSelectWorkspace('tasks') },
    { label: 'Artifact Library', icon: FolderOpen, action: () => onSelectWorkspace('library') },
    { label: 'Execution History', icon: History, action: () => onSelectWorkspace('history') },
    { label: 'Settings & Supabase Configuration', icon: Settings, action: () => onSelectWorkspace('settings') },
  ];

  const handleQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    if (query.startsWith('http://') || query.startsWith('https://')) {
      onSelectWorkspace('browser');
    } else {
      onExecutePrompt(query);
    }
    onClose();
  };

  const filtered = ACTIONS.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/60 backdrop-blur-md p-4 animate-in fade-in select-none">
      <div className="w-full max-w-xl glass-panel rounded-2xl border border-white/20 shadow-2xl overflow-hidden text-white">
        {/* Search Input Bar */}
        <form onSubmit={handleQuerySubmit} className="flex items-center px-4 py-3.5 border-b border-white/10">
          <Search size={18} className="text-cyan-400 mr-3" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, ask AdaL, or enter URL..."
            className="flex-1 bg-transparent text-[13px] text-white placeholder:text-[#8D9BBF] focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#8D9BBF] hover:text-white rounded-lg hover:bg-white/10 transition"
          >
            <X size={16} />
          </button>
        </form>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {query.trim() && (
            <div
              onClick={handleQuerySubmit}
              className="p-2.5 rounded-xl bg-gradient-to-r from-blue-600/30 to-purple-600/30 border border-cyan-400/30 flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-2.5 text-[12px]">
                <Sparkles size={15} className="text-cyan-400" />
                <span>
                  Execute prompt with AdaL: <strong className="text-white font-medium">"{query}"</strong>
                </span>
              </div>
              <ArrowRight size={13} className="text-cyan-400 group-hover:translate-x-1 transition" />
            </div>
          )}

          {filtered.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                onClick={() => {
                  item.action();
                  onClose();
                }}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-white/10 cursor-pointer text-[#BAC7E8] hover:text-white text-[12px] font-medium transition"
              >
                <div className="flex items-center gap-3">
                  <Icon size={15} className="text-cyan-400" />
                  <span>{item.label}</span>
                </div>
                <ArrowRight size={12} className="opacity-0 hover:opacity-100 transition" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

