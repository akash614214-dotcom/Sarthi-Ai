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

  return (
    <div className="flex-1 flex flex-col justify-between py-2 px-3 overflow-y-auto no-scrollbar">
      {/* Central Hero Section */}
      <div className="flex flex-col items-center justify-center pt-2 pb-4 text-center select-none">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-2xl shadow-cyan-500/30">
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

        <p className="text-[12px] text-[#BAC7E8] font-normal tracking-wide">
          Your AI-Native Browser with Autonomous Multimodal Companion
        </p>
      </div>

      {/* 5 Capability Cards in a Compact, Neat Row */}
      <div className="flex items-center justify-center gap-3 my-2 max-w-3xl mx-auto w-full">
        {CAPABILITY_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              onClick={card.action}
              className="glass-card rounded-2xl w-[122px] h-[126px] flex flex-col items-center justify-center text-center cursor-pointer group select-none shrink-0 border border-white/15 hover:border-cyan-400/50 hover:scale-[1.03] transition duration-200"
            >
              {/* Circular Icon badge with thin ring */}
              <div className="w-10 h-10 rounded-full border border-white/25 bg-white/5 flex items-center justify-center text-white mb-2.5 group-hover:border-cyan-400/70 group-hover:text-cyan-300 transition duration-200 shadow-sm">
                <Icon size={18} />
              </div>
              <h3 className="text-[13px] font-bold text-white mb-0.5 tracking-wide">
                {card.title}
              </h3>
              <p className="text-[10px] text-[#BAC7E8] line-clamp-1">
                {card.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Recent Workspaces Section */}
      <div className="mt-4 max-w-4xl mx-auto w-full">
        <div className="flex items-center justify-between mb-2.5 px-1">
          <h2 className="text-[13px] font-semibold text-white tracking-wide">
            Recent Workspaces
          </h2>
          <button
            onClick={() => onSelectWorkspace('library')}
            className="flex items-center gap-1 text-[11px] text-[#BAC7E8] hover:text-cyan-300 transition"
          >
            <span>View all</span>
            <ArrowRight size={12} />
          </button>
        </div>

        {/* 4 Recent Workspace Cards matching reference */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* 1. Startup Research */}
          <div
            onClick={() => onSelectWorkspace('research')}
            className="glass-card rounded-2xl p-3 cursor-pointer group flex flex-col justify-between min-h-[118px] border border-white/15"
          >
            <div className="w-full h-11 rounded-xl bg-gradient-to-r from-blue-900/60 to-cyan-950/60 border border-blue-500/20 mb-2 p-2 flex items-center justify-between overflow-hidden">
              <TrendingUp size={16} className="text-cyan-400" />
              <div className="flex items-end gap-1 h-5">
                <span className="w-1 h-2 bg-cyan-400/50 rounded-sm" />
                <span className="w-1 h-3.5 bg-cyan-400/70 rounded-sm" />
                <span className="w-1 h-5 bg-cyan-400 rounded-sm" />
                <span className="w-1 h-3 bg-cyan-400/60 rounded-sm" />
              </div>
            </div>
            <div>
              <h4 className="text-[12px] font-semibold text-white group-hover:text-cyan-300 transition line-clamp-1">
                Startup Research
              </h4>
              <p className="text-[10px] text-[#8D9BBF] mt-0.5">
                In progress • 12 min
              </p>
            </div>
          </div>

          {/* 2. Website Builder */}
          <div
            onClick={() => onSelectWorkspace('create')}
            className="glass-card rounded-2xl p-3 cursor-pointer group flex flex-col justify-between min-h-[118px] border border-white/15"
          >
            <div className="w-full h-11 rounded-xl bg-gradient-to-r from-purple-950/60 to-indigo-950/60 border border-purple-500/20 mb-2 p-2 flex items-center justify-between overflow-hidden">
              <Layout size={16} className="text-purple-400" />
              <div className="w-12 h-6 border border-white/20 rounded bg-white/5 flex flex-col gap-0.5 p-1">
                <span className="w-full h-1 bg-purple-400/60 rounded-xs" />
                <span className="w-2/3 h-1 bg-white/30 rounded-xs" />
              </div>
            </div>
            <div>
              <h4 className="text-[12px] font-semibold text-white group-hover:text-cyan-300 transition line-clamp-1">
                Website Builder
              </h4>
              <p className="text-[10px] text-[#8D9BBF] mt-0.5">
                Completed • 2 days ago
              </p>
            </div>
          </div>

          {/* 3. Marketing Content */}
          <div
            onClick={() => onSelectWorkspace('create')}
            className="glass-card rounded-2xl p-3 cursor-pointer group flex flex-col justify-between min-h-[118px] border border-white/15"
          >
            <div className="w-full h-11 rounded-xl bg-gradient-to-r from-indigo-950/60 to-pink-950/60 border border-indigo-500/20 mb-2 p-2 flex items-center justify-between overflow-hidden">
              <FileText size={16} className="text-indigo-400" />
              <div className="w-10 h-6 border border-white/20 rounded bg-white/5 flex flex-col justify-around p-1">
                <span className="w-full h-0.5 bg-white/40" />
                <span className="w-4/5 h-0.5 bg-indigo-400/80" />
                <span className="w-3/5 h-0.5 bg-white/30" />
              </div>
            </div>
            <div>
              <h4 className="text-[12px] font-semibold text-white group-hover:text-cyan-300 transition line-clamp-1">
                Marketing Content
              </h4>
              <p className="text-[10px] text-[#8D9BBF] mt-0.5">
                Completed • 4 days ago
              </p>
            </div>
          </div>

          {/* 4. Code Assistant */}
          <div
            onClick={() => onSelectWorkspace('code')}
            className="glass-card rounded-2xl p-3 cursor-pointer group flex flex-col justify-between min-h-[118px] border border-white/15"
          >
            <div className="w-full h-11 rounded-xl bg-gradient-to-r from-slate-900/80 to-purple-950/70 border border-pink-500/20 mb-2 p-2 flex items-center justify-between overflow-hidden">
              <Terminal size={16} className="text-pink-400" />
              <div className="font-mono text-[9px] text-pink-300/80">
                &gt; adal.run()
              </div>
            </div>
            <div>
              <h4 className="text-[12px] font-semibold text-white group-hover:text-cyan-300 transition line-clamp-1">
                Code Assistant
              </h4>
              <p className="text-[10px] text-[#8D9BBF] mt-0.5">
                In progress • 1 hr
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
