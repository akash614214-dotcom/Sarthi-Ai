import React, { useState } from 'react';
import {
  CheckSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Filter,
  Plus,
  Play,
  Pause,
  RotateCcw,
} from 'lucide-react';
import { AutonomousTaskPlan } from '../../lib/supabase';

export const TasksWorkspace: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'running' | 'completed' | 'queued'>('all');

  const SAMPLE_TASKS = [
    {
      id: 'task-1',
      goal: 'Research Neural Networks on Wikipedia, extract key architectural principles, and save to Supabase',
      status: 'completed',
      stepsCount: 5,
      completedSteps: 5,
      time: '12 min ago',
      verified: true,
      lastStep: 'Audit Passed: Verified all 5 subcommands completed with 100% confidence',
    },
    {
      id: 'task-2',
      goal: 'Benchmark latency between client embeddings and pgvector storage',
      status: 'completed',
      stepsCount: 4,
      completedSteps: 4,
      time: '1 hour ago',
      verified: true,
      lastStep: 'Vector latency benchmark logged to Supabase',
    },
    {
      id: 'task-3',
      goal: 'Analyze ArXiv computer science publications and summarize key trends',
      status: 'running',
      stepsCount: 4,
      completedSteps: 2,
      time: 'Just now',
      verified: false,
      lastStep: 'Subcommand 2: Scanning viewport landmarks and citations...',
    },
    {
      id: 'task-4',
      goal: 'Build responsive glassmorphic dashboard interface matching master prompt',
      status: 'completed',
      stepsCount: 6,
      completedSteps: 6,
      time: '2 hours ago',
      verified: true,
      lastStep: 'UI components and theme tokens validated successfully',
    },
  ];

  const filteredTasks = SAMPLE_TASKS.filter((t) => {
    if (filter === 'all') return true;
    return t.status === filter;
  });

  return (
    <div className="flex-1 flex flex-col h-full glass-panel rounded-2xl p-5 overflow-y-auto no-scrollbar border border-white/10 select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center text-white shadow-md">
            <CheckSquare size={16} />
          </div>
          <div>
            <h2 className="text-[16px] font-bold text-white">Tasks Workspace</h2>
            <p className="text-[11px] text-[#BAC7E8]">
              Autonomous task scheduler, step executor, and verification monitor
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl glass-pill">
          {(['all', 'running', 'completed', 'queued'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1 rounded-lg text-[11px] font-semibold capitalize transition ${
                filter === tab
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm'
                  : 'text-[#8D9BBF] hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="glass-card rounded-2xl p-4 border border-white/10 flex flex-col justify-between"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      task.status === 'completed'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 animate-pulse'
                    }`}
                  >
                    {task.status === 'completed' ? 'Task Done ✅' : 'In Progress 🔄'}
                  </span>
                  <span className="text-[11px] text-[#8D9BBF]">{task.time}</span>
                  {task.verified && (
                    <span className="text-[10px] text-cyan-400 font-medium">
                      • Verified Audit
                    </span>
                  )}
                </div>
                <h3 className="text-[13px] font-semibold text-white leading-snug">
                  {task.goal}
                </h3>
                <p className="text-[11px] text-[#BAC7E8] mt-1.5 flex items-center gap-1.5">
                  <span className="text-cyan-400">↳</span> {task.lastStep}
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[11px] font-medium text-[#BAC7E8]">
                  Steps: {task.completedSteps}/{task.stepsCount}
                </span>
                <div className="w-24 h-1.5 bg-black/40 rounded-full overflow-hidden mt-1.5 border border-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500"
                    style={{
                      width: `${(task.completedSteps / task.stepsCount) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

