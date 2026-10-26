import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Plus,
  X,
  Search,
  ExternalLink,
  Sparkles,
  BookOpen,
  Share2,
  Bookmark,
  ShieldCheck,
} from 'lucide-react';
import { BrowserTab } from '../../types';

interface BrowserWorkspaceProps {
  onAskCompanion?: (prompt: string) => void;
}

const DEFAULT_TABS: BrowserTab[] = [
  {
    id: 'tab-1',
    title: 'Wikipedia: Artificial Intelligence',
    url: 'https://en.wikipedia.org/wiki/Artificial_intelligence',
  },
  {
    id: 'tab-2',
    title: 'ArXiv AI Recent Papers',
    url: 'https://arxiv.org/list/cs.AI/recent',
  },
];

export const BrowserWorkspace: React.FC<BrowserWorkspaceProps> = ({
  onAskCompanion,
}) => {
  const [tabs, setTabs] = useState<BrowserTab[]>(DEFAULT_TABS);
  const [activeTabId, setActiveTabId] = useState('tab-1');
  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];
  const [urlInput, setUrlInput] = useState(activeTab.url);
  const [iframeError, setIframeError] = useState(false);

  const handleSelectTab = (id: string) => {
    setActiveTabId(id);
    const selected = tabs.find((t) => t.id === id);
    if (selected) {
      setUrlInput(selected.url);
      setIframeError(false);
    }
  };

  const handleCloseTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length === 1) return;
    const remaining = tabs.filter((t) => t.id !== id);
    setTabs(remaining);
    if (activeTabId === id) {
      setActiveTabId(remaining[remaining.length - 1].id);
      setUrlInput(remaining[remaining.length - 1].url);
    }
  };

  const handleNewTab = () => {
    const newId = `tab-${Date.now()}`;
    const newTab: BrowserTab = {
      id: newId,
      title: 'New Tab',
      url: 'https://en.wikipedia.org/wiki/Special:Search?search=AI',
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newId);
    setUrlInput(newTab.url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let target = urlInput.trim();
    if (!target) return;

    if (!target.startsWith('http://') && !target.startsWith('https://')) {
      if (target.includes('.') && !target.includes(' ')) {
        target = 'https://' + target;
      } else {
        target = `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(target)}`;
      }
    }

    setTabs((prev) =>
      prev.map((t) => (t.id === activeTabId ? { ...t, url: target, title: target } : t))
    );
    setUrlInput(target);
    setIframeError(false);
  };

  return (
    <div className="flex-1 flex flex-col h-full glass-panel rounded-2xl overflow-hidden border border-white/10">
      {/* Top Browser Toolbar & Tabs */}
      <div className="bg-[#101633]/80 border-b border-white/10 px-3 pt-2">
        {/* Tabs Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1.5">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            return (
              <div
                key={tab.id}
                onClick={() => handleSelectTab(tab.id)}
                className={`flex items-center gap-2 max-w-[200px] min-w-[130px] px-3 py-1.5 rounded-t-xl text-[12px] font-medium cursor-pointer transition ${
                  isActive
                    ? 'bg-[#1e2a5c] text-white border-t border-x border-white/15 shadow-md'
                    : 'bg-white/5 text-[#8D9BBF] hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="truncate flex-1">{tab.title}</span>
                {tabs.length > 1 && (
                  <button
                    onClick={(e) => handleCloseTab(tab.id, e)}
                    className="p-0.5 rounded hover:bg-white/20 text-[#8D9BBF] hover:text-white"
                  >
                    <X size={11} />
                  </button>
                )}
              </div>
            );
          })}
          <button
            onClick={handleNewTab}
            className="p-1 text-[#BAC7E8] hover:text-white rounded-lg hover:bg-white/10 transition"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Controls & URL Bar */}
        <div className="flex items-center gap-2 py-2">
          <div className="flex items-center gap-1 text-[#BAC7E8]">
            <button className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition">
              <ArrowLeft size={14} />
            </button>
            <button className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition">
              <ArrowRight size={14} />
            </button>
            <button
              onClick={() => setIframeError(false)}
              className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition"
            >
              <RotateCw size={13} />
            </button>
          </div>

          {/* URL Input Form */}
          <form onSubmit={handleSubmit} className="flex-1">
            <div className="flex items-center bg-[#151c3d] border border-white/15 focus-within:border-cyan-400/50 rounded-xl px-3 py-1.5">
              <ShieldCheck size={13} className="text-emerald-400 mr-2 shrink-0" />
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Enter URL or search topic..."
                className="w-full bg-transparent text-[12px] text-white placeholder:text-[#8D9BBF] focus:outline-none"
              />
            </div>
          </form>

          {/* Quick AI Actions for current page */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() =>
                onAskCompanion?.(`Summarize the contents of ${activeTab.url}`)
              }
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-medium shadow-md shadow-blue-500/20 hover:scale-105 transition"
            >
              <Sparkles size={12} />
              <span>Summarize</span>
            </button>

            <a
              href={activeTab.url}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-xl glass-pill text-[#BAC7E8] hover:text-white transition"
              title="Open in new window"
            >
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* Web Canvas View Area */}
      <div className="flex-1 w-full h-full relative bg-[#090d21]">
        {iframeError ? (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <div className="p-3 bg-indigo-500/20 rounded-2xl text-cyan-400 mb-3 border border-indigo-500/30">
              <ExternalLink size={24} />
            </div>
            <h3 className="text-[14px] font-semibold text-white mb-1">
              External Site Protected by CSP
            </h3>
            <p className="text-[12px] text-[#BAC7E8] max-w-sm mb-4">
              This webpage restricts direct embedded iframes. AdaL Companion continues tracking your context in the sidebar.
            </p>
            <a
              href={activeTab.url}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-[12px] font-semibold shadow-lg shadow-cyan-500/20 hover:scale-105 transition"
            >
              Launch in Native Window
            </a>
          </div>
        ) : (
          <iframe
            src={activeTab.url}
            title={activeTab.title}
            className="w-full h-full border-none bg-white/95"
            sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
            onError={() => setIframeError(true)}
          />
        )}
      </div>
    </div>
  );
};

