import React, { useState } from 'react';
import {
  History as HistoryIcon,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

export const HistoryWorkspace: React.FC = () => {
  const [query, setQuery] = useState('');

  const SESSIONS = [
    {
      id: 'h-1',
      title: 'Neural Networks & AdaL Synthesis Session',
      time: 'Today, 11:45 AM',
      tasksExecuted: 5,
      status: 'Completed',
      contextUrl: 'https://en.wikipedia.org/wiki/Artificial_intelligence',
    },
    {
      id: 'h-2',
      title: 'ArXiv cs.AI Browser Navigation',
      time: 'Today, 10:15 AM',
      tasksExecuted: 3,
      status: 'Completed',
      contextUrl: 'https://arxiv.org/list/cs.AI/recent',
    },
    {
      id: 'h-3',
      title: 'Supabase Server & pgvector Configuration',
      time: 'Yesterday, 4:30 PM',
      tasksExecuted: 4,
      status: 'Completed',
      contextUrl: 'https://supabase.com/docs',
    },
    {
      id: 'h-4',
      title: 'Glassmorphism Design System Implementation',
      time: '2 days ago',
      tasksExecuted: 6,
      status: 'Completed',
      contextUrl: 'localhost:5173',
    },
  ];

  const filtered = SESSIONS.filter((s) =>
    s.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col h-full glass-panel rounded-2xl p-5 overflow-y-auto no-scrollbar border border-white/10 select-none">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center text-white shadow-md">
            <HistoryIcon size={16} />
          </div>
          <div>
            <h2 className="text-[16px] font-bold text-white">Execution History</h2>
            <p className="text-[11px] text-[#BAC7E8]">
              Searchable audit log of past browser sessions, automations, and outcomes
            </p>
          </div>
        </div>

        <div className="flex items-center bg-[#151c3d] border border-white/15 rounded-xl px-3 py-1.5 w-60">
          <Search size={14} className="text-[#8D9BBF] mr-2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search history..."
            className="w-full bg-transparent text-[12px] text-white focus:outline-none placeholder:text-[#8D9BBF]"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((session) => (
          <div
            key={session.id}
            className="glass-card rounded-2xl p-4 border border-white/10 flex items-center justify-between cursor-pointer hover:border-cyan-400/40 transition"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  {session.status}
                </span>
                <span className="text-[11px] text-[#8D9BBF]">{session.time}</span>
              </div>
              <h4 className="text-[13px] font-semibold text-white">
                {session.title}
              </h4>
              <p className="text-[11px] text-[#BAC7E8] mt-0.5 truncate max-w-lg">
                Context: {session.contextUrl}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] text-[#8D9BBF]">
                {session.tasksExecuted} subcommands
              </span>
              <ArrowRight size={14} className="text-cyan-400" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

