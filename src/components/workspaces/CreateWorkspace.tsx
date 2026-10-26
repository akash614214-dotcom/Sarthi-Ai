import React, { useState } from 'react';
import {
  SquarePen,
  FileText,
  Presentation,
  Megaphone,
  Image as ImageIcon,
  Code,
  Sparkles,
  CheckCircle2,
  Copy,
  Download,
} from 'lucide-react';

export const CreateWorkspace: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'docs' | 'slides' | 'marketing' | 'images'>('docs');
  const [prompt, setPrompt] = useState('Draft an executive summary and product launch announcement for Sharthi AI');
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState<string | null>(
    `# Sharthi AI: Product Launch Announcement\n\n**Tagline**: Your AI-Native Browser with Autonomous Multimodal Companion\n\n### Overview\nToday marks the dawn of browser evolution. Sharthi AI transforms the traditional web viewer into an active collaborative canvas. Built upon Adaptive Learning (AdaL), Sharthi AI doesn't just display web pages — it decomposes complex queries, executes sequential multi-step automations, and verifies task completion in real-time.\n\n### Key Highlights\n- **Autonomous Multimodal Companion**: Live perception of viewport landmarks and textual semantics.\n- **Sequential Task Decomposition**: Self-correcting task planner with quality audit loops.\n- **Supabase Persistence**: Episodic memory, pgvector embeddings, and multi-device sync.\n\nAvailable now for creators, researchers, and developers.`
  );

  const CATEGORIES = [
    { id: 'docs', label: 'Docs & Reports', icon: FileText },
    { id: 'slides', label: 'Presentations', icon: Presentation },
    { id: 'marketing', label: 'Marketing Copy', icon: Megaphone },
    { id: 'images', label: 'Visual Assets', icon: ImageIcon },
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setOutput(
        `# Generated Content: ${prompt}\n\n**Format**: ${activeCategory.toUpperCase()}\n**Status**: Completed & Verified\n\n- Section 1: Executive Overview formulated.\n- Section 2: Competitive analysis and strategic recommendations integrated.\n- Section 3: Call-to-action generated for target audience.`
      );
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col h-full glass-panel rounded-2xl p-5 overflow-y-auto no-scrollbar border border-white/10 select-text">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10 select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md">
            <SquarePen size={16} />
          </div>
          <div>
            <h2 className="text-[16px] font-bold text-white">Create Workspace</h2>
            <p className="text-[11px] text-[#BAC7E8]">
              Generate documents, pitch decks, marketing assets, and visual briefs
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1">
        {/* Left Form */}
        <div className="lg:col-span-5 space-y-4 select-none">
          <div>
            <label className="block text-[12px] font-semibold text-white mb-1.5">
              Select Output Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id as any)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-[12px] font-medium transition ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-purple-400/50 shadow-md'
                        : 'bg-white/5 border-white/10 text-[#8D9BBF] hover:text-white'
                    }`}
                  >
                    <Icon size={15} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-white mb-1.5">
              Creative Prompt & Requirements
            </label>
            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want to create..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#141b3a] border border-white/15 text-[12px] text-white focus:border-purple-400 focus:outline-none resize-none"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 text-white text-[13px] font-semibold shadow-lg shadow-purple-500/20 hover:scale-[1.01] transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Sparkles size={16} />
            <span>{isGenerating ? 'Generating Draft...' : 'Generate Content'}</span>
          </button>
        </div>

        {/* Right Output Preview */}
        <div className="lg:col-span-7 flex flex-col h-full bg-[#121838]/80 rounded-2xl border border-white/15 p-4 overflow-y-auto no-scrollbar">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10 select-none">
            <span className="text-[12px] font-semibold text-purple-300">
              Generated Canvas Preview
            </span>
            {output && (
              <button
                onClick={() => navigator.clipboard.writeText(output)}
                className="flex items-center gap-1 text-[11px] text-[#BAC7E8] hover:text-white transition"
              >
                <Copy size={12} />
                <span>Copy</span>
              </button>
            )}
          </div>

          {output ? (
            <div className="text-[12px] text-gray-200 leading-relaxed whitespace-pre-wrap font-sans">
              {output}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-[#8D9BBF] select-none">
              <FileText size={32} className="mb-2 opacity-50 text-purple-400" />
              <p className="text-[12px]">Enter a prompt to create documents, slides, or marketing copy.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

