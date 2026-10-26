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
  Home,
  ShieldCheck,
  Compass,
  Globe,
  BookOpen,
  Code2,
  Cpu,
} from 'lucide-react';
import { BrowserTab } from '../../types';

interface BrowserWorkspaceProps {
  onAskCompanion?: (prompt: string) => void;
}

const DEFAULT_TABS: BrowserTab[] = [
  {
    id: 'tab-1',
    title: 'Sarthi Browser',
    url: 'about:home',
  },
];

const SPEED_DIALS = [
  {
    title: 'Google',
    url: 'https://www.google.com',
    icon: Search,
    category: 'Search',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'ArXiv cs.AI',
    url: 'https://arxiv.org/list/cs.AI/recent',
    icon: BookOpen,
    category: 'Research',
    color: 'from-purple-500 to-pink-500',
  },
  {
    title: 'GitHub',
    url: 'https://github.com',
    icon: Code2,
    category: 'Code',
    color: 'from-gray-700 to-slate-900',
  },
  {
    title: 'Wikipedia',
    url: 'https://en.wikipedia.org',
    icon: Globe,
    category: 'Encyclopedia',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    title: 'Hugging Face',
    url: 'https://huggingface.co',
    icon: Cpu,
    category: 'Models',
    color: 'from-amber-500 to-orange-600',
  },
  {
    title: 'Supabase Docs',
    url: 'https://supabase.com/docs',
    icon: Compass,
    category: 'Docs',
    color: 'from-emerald-500 to-teal-600',
  },
];

export const BrowserWorkspace: React.FC<BrowserWorkspaceProps> = ({
  onAskCompanion,
}) => {
  const [tabs, setTabs] = useState<BrowserTab[]>(DEFAULT_TABS);
  const [activeTabId, setActiveTabId] = useState('tab-1');
  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];
  const [urlInput, setUrlInput] = useState(
    activeTab.url === 'about:home' ? '' : activeTab.url
  );
  const [iframeError, setIframeError] = useState(false);

  const isHomepage = activeTab.url === 'about:home' || !activeTab.url;

  const handleSelectTab = (id: string) => {
    setActiveTabId(id);
    const selected = tabs.find((t) => t.id === id);
    if (selected) {
      setUrlInput(selected.url === 'about:home' ? '' : selected.url);
      setIframeError(false);
    }
  };

  const handleCloseTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length === 1) {
      // Reset to home rather than closing sole tab
      setTabs([{ id: 'tab-1', title: 'Sarthi Browser', url: 'about:home' }]);
      setActiveTabId('tab-1');
      setUrlInput('');
      return;
    }
    const remaining = tabs.filter((t) => t.id !== id);
    setTabs(remaining);
    if (activeTabId === id) {
      const nextActive = remaining[remaining.length - 1];
      setActiveTabId(nextActive.id);
      setUrlInput(nextActive.url === 'about:home' ? '' : nextActive.url);
    }
  };

  const handleNewTab = () => {
    const newId = `tab-${Date.now()}`;
    const newTab: BrowserTab = {
      id: newId,
      title: 'Sarthi Browser',
      url: 'about:home',
    };
    setTabs([...tabs, newTab]);
    setActiveTabId(newId);
    setUrlInput('');
    setIframeError(false);
  };

  const navigateTo = (targetUrl: string, title?: string) => {
    let cleanUrl = targetUrl.trim();
    if (!cleanUrl) return;

    if (cleanUrl === 'about:home') {
      setTabs((prev) =>
        prev.map((t) =>
          t.id === activeTabId ? { ...t, url: 'about:home', title: 'Sarthi Browser' } : t
        )
      );
      setUrlInput('');
      setIframeError(false);
      return;
    }

    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      if (cleanUrl.includes('.') && !cleanUrl.includes(' ')) {
        cleanUrl = 'https://' + cleanUrl;
      } else {
        cleanUrl = `https://www.google.com/search?q=${encodeURIComponent(cleanUrl)}`;
      }
    }

    let displayTitle = title || cleanUrl;
    try {
      displayTitle = new URL(cleanUrl).hostname;
    } catch {}

    setTabs((prev) =>
      prev.map((t) =>
        t.id === activeTabId ? { ...t, url: cleanUrl, title: displayTitle } : t
      )
    );
    setUrlInput(cleanUrl);
    setIframeError(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateTo(urlInput);
  };

  return (
    <div className="flex-1 flex flex-col h-full glass-panel rounded-2xl overflow-hidden border border-white/10">
      {/* Top Browser Toolbar & Tabs */}
      <div className="bg-[#101633]/85 border-b border-white/10 px-3 pt-2 select-none">
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
                <button
                  onClick={(e) => handleCloseTab(tab.id, e)}
                  className="p-0.5 rounded hover:bg-white/20 text-[#8D9BBF] hover:text-white"
                >
                  <X size={11} />
                </button>
              </div>
            );
          })}
          <button
            onClick={handleNewTab}
            className="p-1 text-[#BAC7E8] hover:text-white rounded-lg hover:bg-white/10 transition"
            title="New Tab"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Navigation Controls & Address Bar */}
        <div className="flex items-center gap-2 py-2">
          <div className="flex items-center gap-1 text-[#BAC7E8]">
            <button
              onClick={() => navigateTo('about:home')}
              className={`p-1.5 rounded-lg transition ${
                isHomepage ? 'text-cyan-400 bg-white/10' : 'hover:bg-white/10 hover:text-white'
              }`}
              title="Sarthi Home"
            >
              <Home size={14} />
            </button>
            <button
              onClick={() => window.history.back()}
              className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition"
              title="Back"
            >
              <ArrowLeft size={14} />
            </button>
            <button
              onClick={() => window.history.forward()}
              className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition"
              title="Forward"
            >
              <ArrowRight size={14} />
            </button>
            <button
              onClick={() => {
                setIframeError(false);
                navigateTo(activeTab.url);
              }}
              className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition"
              title="Reload"
            >
              <RotateCw size={13} />
            </button>
          </div>

          {/* Omnibox / Search */}
          <form onSubmit={handleSubmit} className="flex-1">
            <div className="flex items-center bg-[#151c3d] border border-white/15 focus-within:border-cyan-400/50 rounded-xl px-3 py-1.5 transition">
              <ShieldCheck size={13} className="text-emerald-400 mr-2 shrink-0" />
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Search with Sarthi AI or enter web address..."
                className="w-full bg-transparent text-[12px] text-white placeholder:text-[#8D9BBF] focus:outline-none"
              />
            </div>
          </form>

          {/* Quick AI Action */}
          {!isHomepage && (
            <button
              onClick={() =>
                onAskCompanion?.(`Analyze and synthesize key takeaways from ${activeTab.url}`)
              }
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[11px] font-semibold shadow-md shadow-blue-500/20 hover:scale-105 transition shrink-0"
            >
              <Sparkles size={12} />
              <span>AI Analyze</span>
            </button>
          )}
        </div>
      </div>

      {/* Main View Area */}
      <div className="flex-1 w-full h-full relative bg-[#090d21] overflow-hidden flex flex-col">
        {isHomepage ? (
          /* ========================================================= */
          /*  SIMPLE HOMEPAGE OF SARTHI AI BROWSER                     */
          /* ========================================================= */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none overflow-y-auto no-scrollbar">
            {/* Glowing Brand Logo & Title */}
            <div className="flex flex-col items-center mb-6">
              <div className="w-16 h-16 rounded-3xl overflow-hidden shadow-2xl shadow-cyan-500/30 mb-3 border border-white/15 hover:scale-105 transition duration-300">
                <img
                  src="/sharthi-logo.png"
                  alt="Sarthi AI"
                  className="w-full h-full object-cover"
                />
              </div>
              <h1 className="text-2xl font-extrabold text-white tracking-wide">
                Sarthi{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Browser
                </span>
              </h1>
              <p className="text-[12px] text-[#BAC7E8] mt-1 max-w-sm">
                Your AI-native canvas for intelligent exploration & autonomous research
              </p>
            </div>

            {/* Central Omnibox Search Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                navigateTo(urlInput);
              }}
              className="w-full max-w-xl mb-8"
            >
              <div className="flex items-center w-full px-4 py-3 rounded-2xl glass-card border border-white/20 shadow-xl focus-within:border-cyan-400/60 focus-within:shadow-[0_0_25px_rgba(24,221,245,0.25)] transition duration-200">
                <Search size={18} className="text-cyan-400 mr-3 shrink-0" />
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="Search the web or type a URL..."
                  className="w-full bg-transparent text-[13px] text-white placeholder:text-[#8D9BBF] focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-3 py-1 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[11px] font-semibold hover:scale-105 transition shrink-0 ml-2"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Speed Dials Grid */}
            <div className="w-full max-w-2xl">
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-[12px] font-semibold text-[#BAC7E8] tracking-wider uppercase">
                  Quick Access
                </span>
                <span className="text-[11px] text-[#8D9BBF]">Speed Dials</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {SPEED_DIALS.map((dial, idx) => {
                  const Icon = dial.icon;
                  return (
                    <div
                      key={idx}
                      onClick={() => navigateTo(dial.url, dial.title)}
                      className="glass-card rounded-2xl p-3 flex flex-col items-center justify-center cursor-pointer group hover:scale-105 transition duration-200 min-h-[95px]"
                    >
                      <div
                        className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${dial.color} flex items-center justify-center text-white shadow-md mb-2 group-hover:shadow-[0_0_15px_rgba(24,221,245,0.4)] transition`}
                      >
                        <Icon size={16} />
                      </div>
                      <span className="text-[12px] font-medium text-white group-hover:text-cyan-300 transition truncate max-w-[80px]">
                        {dial.title}
                      </span>
                      <span className="text-[9px] text-[#8D9BBF]">{dial.category}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Prompt suggestions footer */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2 max-w-xl">
              <span className="text-[11px] text-[#8D9BBF]">Try asking:</span>
              {[
                'Search recent ArXiv AI papers',
                'Compare multimodal foundation models',
                'Find trending AI repositories',
              ].map((query, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setUrlInput(query);
                    navigateTo(query);
                  }}
                  className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-[#BAC7E8] hover:text-cyan-300 transition"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        ) : iframeError ? (
          /* ========================================================= */
          /*  CSP FALLBACK VIEW                                        */
          /* ========================================================= */
          <div className="flex flex-col items-center justify-center h-full p-8 text-center select-none">
            <div className="p-3 bg-indigo-500/20 rounded-2xl text-cyan-400 mb-3 border border-indigo-500/30">
              <ExternalLink size={24} />
            </div>
            <h3 className="text-[14px] font-semibold text-white mb-1">
              External Page Protected by CSP
            </h3>
            <p className="text-[12px] text-[#BAC7E8] max-w-sm mb-4">
              This webpage restricts direct embedded iframes. You can open it in a native window while Sarthi AI Companion continues observing your context.
            </p>
            <div className="flex gap-2">
              <a
                href={activeTab.url}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl text-[12px] font-semibold shadow-lg shadow-cyan-500/20 hover:scale-105 transition"
              >
                Launch in Window
              </a>
              <button
                onClick={() => navigateTo('about:home')}
                className="px-3.5 py-2 glass-pill text-[12px] text-[#BAC7E8] hover:text-white rounded-xl transition"
              >
                Return to Sarthi Home
              </button>
            </div>
          </div>
        ) : (
          /* ========================================================= */
          /*  LIVE WEB VIEW IFRAME                                     */
          /* ========================================================= */
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
