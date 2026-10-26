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
  MoreVertical,
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
      color: 'from-blue-500 to-cyan-400',
      action: () => onSelectWorkspace('browser'),
    },
    {
      id: 'research',
      title: 'Research',
      description: 'Get insights',
      icon: Search,
      color: 'from-cyan-400 to-indigo-500',
      action: onOpenResearchComposer,
    },
    {
      id: 'create',
      title: 'Create',
      description: 'Docs, slides, media',
      icon: SquarePen,
      color: 'from-indigo-500 to-purple-500',
      action: onOpenCreateComposer,
    },
    {
      id: 'code',
      title: 'Code',
      description: 'Build & debug',
      icon: Code2,
      color: 'from-purple-500 to-pink-500',
      action: onOpenCodeWorkspace,
    },
    {
      id: 'automate',
      title: 'Automate',
      description: 'Let AI handle it',
      icon: Workflow,
      color: 'from-pink-500 to-cyan-400',
      action: () => onSelectWorkspace('tasks'),
    },
  ];

  const getWorkspaceIcon = (cat: RecentWorkspace['category']) => {
    switch (cat) {
      case 'research':
        return <TrendingUp size={16} className="text-cyan-400" />;
      case 'builder':
        return <Layout size={16} className="text-indigo-400" />;
      case 'marketing':
        return <FileText size={16} className="text-purple-400" />;
      case 'code':
        return <Terminal size={16} className="text-pink-400" />;
      default:
        return <TrendingUp size={16} className="text-blue-400" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between py-2 px-3 overflow-y-auto no-scrollbar">
      {/* Central Hero Section */}
      <div className="flex flex-col items-center justify-center pt-4 pb-6 text-center select-none">
        <div className="flex items-center gap-3 mb-2.5">
          <div className="w-11 h-11 rounded-2xl overflow-hidden shadow-xl shadow-cyan-500/25">
            <img
              src="/sharthi-logo.png"
              alt="Sharthi AI Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-wide">
            Sharthi{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Ai
            </span>
          </h1>
        </div>

        <p className="text-[13px] text-[#BAC7E8] max-w-lg font-medium tracking-wide">
          Your AI-Native Browser with Autonomous Multimodal Companion
        </p>
      </div>

      {/* 5 Capability Cards in a Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 my-2">
        {CAPABILITY_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              onClick={card.action}
              className="glass-card rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer group select-none min-h-[135px]"
            >
              <div
                className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${card.color} flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 mb-3 group-hover:scale-110 transition duration-300`}
              >
                <Icon size={20} />
              </div>
              <h3 className="text-[14px] font-semibold text-white mb-0.5 group-hover:text-cyan-300 transition">
                {card.title}
              </h3>
              <p className="text-[11px] text-[#8D9BBF] line-clamp-1">
                {card.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Recent Workspaces Section */}
      <div className="mt-5">
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-[14px] font-semibold text-white tracking-wide">
            Recent Workspaces
          </h2>
          <button
            onClick={() => onSelectWorkspace('library')}
            className="flex items-center gap-1 text-[12px] text-[#BAC7E8] hover:text-cyan-300 transition"
          >
            <span>View all</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {/* 4 Recent Workspace Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {recentWorkspaces.map((ws) => (
            <div
              key={ws.id}
              onClick={() => onOpenRecentWorkspace(ws)}
              className="glass-card rounded-2xl p-3.5 cursor-pointer group flex flex-col justify-between min-h-[115px]"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-1.5 rounded-xl bg-white/10 border border-white/10">
                    {getWorkspaceIcon(ws.category)}
                  </div>
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      ws.status === 'Completed'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    }`}
                  >
                    {ws.status}
                  </span>
                </div>
                <h4 className="text-[13px] font-semibold text-white group-hover:text-cyan-300 transition line-clamp-1">
                  {ws.title}
                </h4>
                <p className="text-[11px] text-[#8D9BBF] line-clamp-1 mt-0.5">
                  {ws.description}
                </p>
              </div>

              <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-[#8D9BBF]">
                <span>{ws.timeInfo}</span>
                <span className="group-hover:translate-x-0.5 transition text-cyan-400">
                  Open →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

