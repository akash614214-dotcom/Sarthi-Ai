import React from 'react';
import {
  Globe,
  Search,
  SquarePen,
  Code2,
  Workflow,
  ArrowRight,
  TrendingUp,
  Layout,
  FileText,
  Terminal,
} from 'lucide-react';
import { WorkspaceType, RecentWorkspace } from '../../types';

interface HomeDashboardProps {
  onSelectWorkspace: (workspace: WorkspaceType) => void;
  recentWorkspaces: RecentWorkspace[];
  onOpenRecentWorkspace: (workspace: RecentWorkspace) => void;
  onOpenResearchComposer: () => void;
  onOpenCreateComposer: () => void;
  onOpenCodeWorkspace: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  onSelectWorkspace,
  recentWorkspaces,
  onOpenRecentWorkspace,
  onOpenResearchComposer,
  onOpenCreateComposer,
  onOpenCodeWorkspace,
}) => {
  const CAPABILITY_CARDS = [
    {
      id: 'browse',
      title: 'Browse',
      description: 'Explore the web',
      icon: Globe,
      action: () => onSelectWorkspace('browser'),
    },
    {
      id: 'research',
      title: 'Research',
      description: 'Get insights',
      icon: Search,
      action: onOpenResearchComposer,
    },
    {
      id: 'create',
      title: 'Create',
      description: 'Docs, slides, media',
      icon: SquarePen,
      action: onOpenCreateComposer,
    },
    {
      id: 'code',
      title: 'Code',
      description: 'Build & debug',
      icon: Code2,
      action: onOpenCodeWorkspace,
    },
    {
      id: 'automate',
      title: 'Automate',
      description: 'Let AI handle it',
      icon: Workflow,
      action: () => onSelectWorkspace('tasks'),
    },
  ];

  const renderThumbnail = (category: RecentWorkspace['category']) => {
    switch (category) {
      case 'research':
        return (
          <div className="w-full h-14 rounded-xl bg-gradient-to-tr from-[#162758]/80 to-[#101b44]/90 border border-blue-500/20 p-2 flex items-center justify-between overflow-hidden shadow-inner">
            <div className="p-1 rounded-lg bg-blue-500/20 text-cyan-300">
              <TrendingUp size={14} />
            </div>
            <div className="flex items-end gap-1 h-6">
              <span className="w-1.5 h-2.5 bg-cyan-400/50 rounded-xs" />
              <span className="w-1.5 h-4 bg-cyan-400/70 rounded-xs" />
              <span className="w-1.5 h-6 bg-cyan-400 rounded-xs" />
              <span className="w-1.5 h-3.5 bg-cyan-400/60 rounded-xs" />
            </div>
          </div>
        );
      case 'builder':
        return (
          <div className="w-full h-14 rounded-xl bg-gradient-to-tr from-[#2d1b58]/80 to-[#171444]/90 border border-purple-500/20 p-2 flex items-center justify-between overflow-hidden shadow-inner">
            <div className="p-1 rounded-lg bg-purple-500/20 text-purple-300">
              <Layout size={14} />
            </div>
            <div className="w-14 h-8 border border-white/20 rounded-md bg-white/5 flex flex-col gap-1 p-1">
              <span className="w-full h-1 bg-purple-400/80 rounded-xs" />
              <span className="w-3/4 h-1 bg-white/40 rounded-xs" />
              <span className="w-1/2 h-1 bg-cyan-400/60 rounded-xs" />
            </div>
          </div>
        );
      case 'marketing':
        return (
          <div className="w-full h-14 rounded-xl bg-gradient-to-tr from-[#1d2658]/80 to-[#151a44]/90 border border-indigo-500/20 p-2 flex items-center justify-between overflow-hidden shadow-inner">
            <div className="p-1 rounded-lg bg-indigo-500/20 text-indigo-300">
              <FileText size={14} />
            </div>
            <div className="w-12 h-8 border border-white/20 rounded-md bg-white/5 flex flex-col justify-around p-1">
              <span className="w-full h-0.5 bg-white/50" />
              <span className="w-4/5 h-0.5 bg-indigo-400" />
              <span className="w-3/5 h-0.5 bg-white/40" />
              <span className="w-4/5 h-0.5 bg-cyan-400/70" />
            </div>
          </div>
        );
      case 'code':
      default:
        return (
          <div className="w-full h-14 rounded-xl bg-gradient-to-tr from-[#0d142e]/90 to-[#1a1238]/90 border border-pink-500/20 p-2 flex items-center justify-between overflow-hidden shadow-inner">
            <div className="p-1 rounded-lg bg-pink-500/20 text-pink-300">
              <Terminal size={14} />
            </div>
            <div className="font-mono text-[9px] text-pink-300/90 leading-tight">
              &gt; adal.run()
              <br />
              <span className="text-cyan-300">✓ done</span>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between py-1 px-3 overflow-y-auto no-scrollbar">
      {/* Central Hero Section matching Screenshot 2 */}
      <div className="flex flex-col items-center justify-center pt-2 pb-3 text-center select-none">
        <div className="flex items-center gap-3 mb-1.5">
          <div className="w-11 h-11 rounded-2xl overflow-hidden shadow-xl shadow-cyan-500/30">
            <img
              src="/sharthi-logo.png"
              alt="Sharthi AI Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-wide">
            Sharthi{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Ai
            </span>
          </h1>
        </div>

        <p className="text-[12px] text-[#BAC6E8] font-normal tracking-wide">
          Your AI-Native Browser with Autonomous Multimodal Companion
        </p>
      </div>

      {/* 5 Capability Cards in a Compact Row matching Screenshot 2 */}
      <div className="flex items-center justify-center gap-3 my-2 max-w-3xl mx-auto w-full">
        {CAPABILITY_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              onClick={card.action}
              className="glass-card rounded-2xl w-[126px] h-[132px] flex flex-col items-center justify-center text-center cursor-pointer group select-none shrink-0 border border-white/15 hover:border-cyan-400/50 hover:scale-[1.03] transition duration-200"
            >
              {/* Circular Icon badge with thin ring */}
              <div className="w-10 h-10 rounded-full border border-white/20 bg-white/5 flex items-center justify-center text-white mb-2 group-hover:border-cyan-400/60 group-hover:text-cyan-300 transition duration-200 shadow-sm">
                <Icon size={18} />
              </div>
              <h3 className="text-[13px] font-bold text-white mb-0.5 tracking-wide">
                {card.title}
              </h3>
              <p className="text-[10px] text-[#BAC6E8] line-clamp-1">
                {card.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Recent Workspaces Section (4 Cards in a Row, Approx 3:2 aspect ratio) */}
      <div className="mt-4 max-w-4xl mx-auto w-full">
        <div className="flex items-center justify-between mb-2 px-1">
          <h2 className="text-[13px] font-semibold text-white tracking-wide">
            Recent Workspaces
          </h2>
          <button
            onClick={() => onSelectWorkspace('library')}
            className="flex items-center gap-1 text-[11px] text-[#BAC6E8] hover:text-cyan-300 transition"
          >
            <span>View all</span>
            <ArrowRight size={12} />
          </button>
        </div>

        {/* 4 Cards in 1 Row on Desktop, Approx 3:2 Aspect Ratio */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {recentWorkspaces.slice(0, 4).map((ws) => (
            <div
              key={ws.id}
              onClick={() => onOpenRecentWorkspace(ws)}
              className="glass-card rounded-2xl p-2.5 cursor-pointer group flex flex-col justify-between aspect-[3/2] border border-white/15 hover:border-cyan-400/40"
            >
              {/* Real Thumbnail Mockup */}
              {renderThumbnail(ws.category)}

              {/* Title & Status Metadata */}
              <div className="mt-1.5">
                <h4 className="text-[12px] font-semibold text-white group-hover:text-cyan-300 transition truncate">
                  {ws.title}
                </h4>
                <p className="text-[10px] text-[#8D9BBF] mt-0.5 truncate">
                  {ws.timeInfo}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
