import React, { useState } from 'react';
import { ExternalLink, Globe, Compass, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';

interface WebviewContainerProps {
  url: string;
  onPageTitleChanged?: (title: string) => void;
  onPageUrlChanged?: (url: string) => void;
  onQuickNavigate?: (url: string) => void;
}

const PRESET_PAGES = [
  {
    title: 'Wikipedia: Artificial Intelligence',
    url: 'https://en.wikipedia.org/wiki/Artificial_intelligence',
    category: 'Research',
    badge: 'Embeddable',
  },
  {
    title: 'ArXiv Computer Science (AI)',
    url: 'https://arxiv.org/list/cs.AI/recent',
    category: 'Papers',
    badge: 'Embeddable',
  },
  {
    title: 'Supabase Documentation',
    url: 'https://supabase.com/docs',
    category: 'Database',
    badge: 'External',
  },
  {
    title: 'GitHub Explore',
    url: 'https://github.com/explore',
    category: 'Code',
    badge: 'External',
  },
];

export const WebviewContainer: React.FC<WebviewContainerProps> = ({
  url,
  onPageTitleChanged,
  onQuickNavigate,
}) => {
  const [loadError, setLoadError] = useState(false);
  const [key, setKey] = useState(0);

  const isHomeOrEmpty = !url || url === 'about:blank' || url === 'https://www.google.com';

  const handlePresetClick = (targetUrl: string, title: string) => {
    onQuickNavigate?.(targetUrl);
    onPageTitleChanged?.(title);
    setLoadError(false);
  };

  return (
    <div className="flex-1 w-full h-full relative bg-[#0f1117] flex flex-col overflow-hidden">
      {/* If Home / New Tab View */}
      {isHomeOrEmpty ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-4xl mx-auto w-full text-center select-none">
          <div className="p-3.5 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-2xl mb-4 text-indigo-400 shadow-xl shadow-indigo-500/10">
            <Compass size={36} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">
            Sharthi AI Browser
          </h1>
          <p className="text-xs text-gray-400 max-w-md mb-8 leading-relaxed">
            AI-native web canvas with real-time AdaL multimodal companion and Supabase memory integration.
          </p>

          {/* Quick Hub Grid */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
            {PRESET_PAGES.map((page, idx) => (
              <div
                key={idx}
                onClick={() => handlePresetClick(page.url, page.title)}
                className="group p-4 bg-[#14161f] hover:bg-[#1a1d29] border border-gray-800 hover:border-indigo-500/50 rounded-xl cursor-pointer transition flex items-center justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-wider">
                      {page.category}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-gray-800 text-gray-400">
                      {page.badge}
                    </span>
                  </div>
                  <h4 className="text-xs font-medium text-gray-200 group-hover:text-white transition">
                    {page.title}
                  </h4>
                  <p className="text-[11px] text-gray-500 truncate max-w-[240px]">
                    {page.url}
                  </p>
                </div>
                <div className="text-gray-500 group-hover:text-indigo-400 transition">
                  <ExternalLink size={14} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-2 text-[11px] text-gray-500 bg-[#12141a] px-3.5 py-1.5 rounded-full border border-gray-800">
            <Sparkles size={12} className="text-purple-400" />
            <span>Type any URL or topic in the Omnibox above to browse with AdaL</span>
          </div>
        </div>
      ) : (
        /* Webframe View */
        <div className="flex-1 relative w-full h-full">
          {loadError ? (
            <div className="flex-1 h-full flex flex-col items-center justify-center p-6 text-center">
              <AlertCircle size={32} className="text-amber-400 mb-3" />
              <h3 className="text-sm font-semibold text-gray-200 mb-1">
                Direct Iframe Display Restricted
              </h3>
              <p className="text-xs text-gray-400 max-w-md mb-4">
                This domain ({new URL(url).hostname}) restricts embedding inside iframes via CSP. You can launch it in a separate browser tab while AdaL continues tracking context and memory.
              </p>
              <div className="flex gap-2">
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium transition"
                >
                  <ExternalLink size={13} />
                  Open in New Tab
                </a>
                <button
                  onClick={() => setLoadError(false)}
                  className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs transition"
                >
                  Retry Embed
                </button>
              </div>
            </div>
          ) : (
            <iframe
              key={key}
              src={url}
              title="Browser Web Canvas"
              className="w-full h-full border-none bg-white"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              onError={() => setLoadError(true)}
            />
          )}
        </div>
      )}
    </div>
  );
};

