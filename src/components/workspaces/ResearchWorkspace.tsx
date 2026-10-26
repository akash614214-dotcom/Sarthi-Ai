import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  BookOpen,
  FileCheck,
  Download,
  Share2,
  CheckCircle2,
  Loader2,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface ResearchWorkspaceProps {
  onTriggerAgentTask?: (prompt: string) => void;
}

export const ResearchWorkspace: React.FC<ResearchWorkspaceProps> = ({
  onTriggerAgentTask,
}) => {
  const [topic, setTopic] = useState('Multimodal AI Architecture & AdaL');
  const [goals, setGoals] = useState('Analyze latency, memory footprint, and autonomous task execution loops');
  const [depth, setDepth] = useState<'comprehensive' | 'executive' | 'academic'>('comprehensive');
  const [isResearching, setIsResearching] = useState(false);
  const [researchOutput, setResearchOutput] = useState<string | null>(
    `# Executive Research Dossier: Multimodal AI Architecture & AdaL\n\n## 1. Core Paradigm\nMultimodal foundation models combined with Adaptive Learning (AdaL) loops bridge perception and autonomous browser actions. By observing DOM hierarchy, visual landmarks, and historical sessions, the agent autonomously formulates directed acyclic task graphs.\n\n## 2. Benchmark Comparisons\n- **Latency**: 380ms response loop for sequential subcommands\n- **Memory Footprint**: Client-side tensor embeddings synced with Supabase pgvector\n- **Verification Accuracy**: 94.6% task completion verification on browser automation benchmarks\n\n## 3. Verified Sources\n1. ArXiv cs.AI: Adaptive Multimodal Agents in Web Environments (2025)\n2. Nature Machine Intelligence: Continuous Feedback in Browser Automation\n3. Supabase pgvector Reference Architecture`
  );

  const handleStartResearch = () => {
    setIsResearching(true);
    setTimeout(() => {
      setIsResearching(false);
      setResearchOutput(
        `# Deep Research Synthesis: ${topic}\n\n**Goal**: ${goals}\n**Depth Level**: ${depth.toUpperCase()}\n\n### 1. Key Findings\n- Discovered 14 relevant publications across ArXiv and industry documentation.\n- Identified key optimization vectors for autonomous agent task execution.\n- Memory context successfully indexed for Supabase episodic recall.\n\n### 2. Next Steps & Recommended Actions\n- Export summary to Library Workspace.\n- Generate slide presentation draft.`
      );
      onTriggerAgentTask?.(`Deep research executed on "${topic}". Findings indexed in memory.`);
    }, 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full glass-panel rounded-2xl p-5 overflow-y-auto no-scrollbar border border-white/10 select-text">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10 select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center text-white shadow-md">
            <Search size={16} />
          </div>
          <div>
            <h2 className="text-[16px] font-bold text-white">Research Workspace</h2>
            <p className="text-[11px] text-[#BAC7E8]">
              Autonomous web exploration, evidence compilation & synthesis
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {researchOutput && (
            <button
              onClick={() => navigator.clipboard.writeText(researchOutput)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl glass-pill text-[11px] text-[#BAC7E8] hover:text-white transition select-none"
            >
              <Download size={13} />
              <span>Copy Report</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1">
        {/* Research Config Left Form */}
        <div className="lg:col-span-5 space-y-4 select-none">
          <div>
            <label className="block text-[12px] font-semibold text-white mb-1.5">
              Research Topic or Query
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#141b3a] border border-white/15 text-[13px] text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-white mb-1.5">
              Specific Objectives & Scope
            </label>
            <textarea
              rows={3}
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#141b3a] border border-white/15 text-[12px] text-white focus:border-cyan-400 focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-white mb-1.5">
              Analysis Depth
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['executive', 'comprehensive', 'academic'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setDepth(lvl)}
                  className={`py-2 rounded-xl text-[11px] font-semibold capitalize border transition ${
                    depth === lvl
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-cyan-400/50 shadow-md'
                      : 'bg-white/5 border-white/10 text-[#8D9BBF] hover:text-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleStartResearch}
            disabled={isResearching || !topic.trim()}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white text-[13px] font-semibold shadow-lg shadow-purple-500/20 hover:scale-[1.01] transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isResearching ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>AdaL is Synthesizing Findings...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Start Autonomous Research</span>
              </>
            )}
          </button>
        </div>

        {/* Research Dossier Output */}
        <div className="lg:col-span-7 flex flex-col h-full bg-[#121838]/80 rounded-2xl border border-white/15 p-4 overflow-y-auto no-scrollbar">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
            <span className="text-[12px] font-semibold text-cyan-300 flex items-center gap-1.5">
              <FileCheck size={14} />
              Generated Findings Report
            </span>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Verified & Cached
            </span>
          </div>

          {researchOutput ? (
            <div className="text-[12px] text-gray-200 leading-relaxed space-y-2 whitespace-pre-wrap font-sans">
              {researchOutput}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-[#8D9BBF]">
              <BookOpen size={32} className="mb-2 opacity-50 text-cyan-400" />
              <p className="text-[12px]">Configure topic and run autonomous research to compile dossier.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

