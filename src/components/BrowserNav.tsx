import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Plus,
  X,
  Search,
  Database,
  Bot,
} from 'lucide-react';

export interface Tab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
}

interface BrowserNavProps {
  tabs: Tab[];
  activeTabId: string;
  onSelectTab: (id: string) => void;
  onCloseTab: (id: string) => void;
  onNewTab: () => void;
  onNavigate: (url: string) => void;
  onReload: () => void;
  onGoBack: () => void;
  onGoForward: () => void;
  isSupabaseConnected: boolean;
  onOpenSupabaseModal: () => void;
  isCompanionOpen: boolean;
  onToggleCompanion: () => void;
}

export const BrowserNav: React.FC<BrowserNavProps> = ({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onNewTab,
  onNavigate,
  onReload,
  onGoBack,
  onGoForward,
  isSupabaseConnected,
  onOpenSupabaseModal,
  isCompanionOpen,
  onToggleCompanion,
}) => {
  const activeTab = tabs.find((t) => t.id === activeTabId);
  const [inputUrl, setInputUrl] = useState(activeTab?.url || '');

  React.useEffect(() => {
    if (activeTab) {
      setInputUrl(activeTab.url);
    }
  }, [activeTab?.url]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let target = inputUrl.trim();
    if (!target) return;

    if (!target.startsWith('http://') && !target.startsWith('https://')) {
      if (target.includes('.') && !target.includes(' ')) {
        target = 'https://' + target;
      } else {
        target = `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(target)}`;
      }
    }
    onNavigate(target);
  };

  return (
    <div className="flex flex-col bg-[#12141a] border-b border-gray-800/80 select-none">
      {/* Tab Bar */}
      <div className="flex items-center gap-1 px-3 pt-2 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`group flex items-center gap-2 max-w-[200px] min-w-[120px] px-3 py-1.5 rounded-t-xl text-xs font-medium cursor-pointer transition border-t border-x ${
                isActive
                  ? 'bg-[#181a20] text-white border-gray-700/80 shadow-sm'
                  : 'bg-transparent text-gray-400 border-transparent hover:bg-gray-800/40 hover:text-gray-200'
              }`}
            >
              <span className="truncate flex-1">{tab.title || 'New Tab'}</span>
              {tabs.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseTab(tab.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-gray-700 text-gray-400 hover:text-white transition"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          );
        })}

        <button
          onClick={onNewTab}
          className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800/60 transition ml-1"
          title="New Tab"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Navigation Controls & Omnibox */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[#181a20]">
        <div className="flex items-center gap-1 text-gray-400">
          <button
            onClick={onGoBack}
            className="p-1.5 hover:text-white rounded-lg hover:bg-gray-800/80 transition"
            title="Back"
          >
            <ArrowLeft size={16} />
          </button>
          <button
            onClick={onGoForward}
            className="p-1.5 hover:text-white rounded-lg hover:bg-gray-800/80 transition"
            title="Forward"
          >
            <ArrowRight size={16} />
          </button>
          <button
            onClick={onReload}
            className="p-1.5 hover:text-white rounded-lg hover:bg-gray-800/80 transition"
            title="Reload"
          >
            <RotateCw size={15} />
          </button>
        </div>

        {/* Omnibox */}
        <form onSubmit={handleSubmit} className="flex-1 relative">
          <div className="flex items-center w-full bg-[#12141a] border border-gray-750 hover:border-gray-600 focus-within:border-indigo-500 rounded-xl px-3 py-1.5 transition">
            <Search size={14} className="text-gray-500 mr-2 shrink-0" />
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Enter URL or search topic..."
              className="w-full bg-transparent text-xs text-gray-200 placeholder:text-gray-500 focus:outline-none"
            />
            <span className="text-[10px] text-gray-500 uppercase tracking-widest px-1.5 py-0.5 bg-gray-800/60 rounded">
              AdaL
            </span>
          </div>
        </form>

        {/* Supabase Status Button */}
        <button
          onClick={onOpenSupabaseModal}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition ${
            isSupabaseConnected
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
              : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
          }`}
          title="Supabase Database Status"
        >
          <Database size={13} />
          <span className="hidden sm:inline">
            {isSupabaseConnected ? 'Supabase Synced' : 'Connect Supabase'}
          </span>
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isSupabaseConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
            }`}
          />
        </button>

        {/* Companion Toggle */}
        <button
          onClick={onToggleCompanion}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition ${
            isCompanionOpen
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'bg-gray-800/80 text-gray-300 hover:text-white hover:bg-gray-700'
          }`}
          title="Toggle AdaL Multimodal Companion"
        >
          <Bot size={14} />
          <span>AdaL</span>
        </button>
      </div>
    </div>
  );
};

