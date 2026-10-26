import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  Mic,
  Image as ImageIcon,
  CheckCircle,
  ListTodo,
  Loader2,
  CheckCircle2,
  ChevronRight,
  Maximize2,
  Minimize2,
  Bot,
  Wand2,
  Globe,
  FileEdit,
  Code,
} from 'lucide-react';
import {
  companionEngine,
  AdaLCompanionState,
  AdaLContext,
} from '../lib/adalCompanion';
import {
  CompanionMessage,
  AutonomousTaskPlan,
  recordCompanionMessage,
  getLocalChatHistory,
  isSupabaseConfigured,
} from '../lib/supabase';

interface AICompanionProps {
  currentUrl?: string;
  currentTitle?: string;
  onNavigateTab?: (url: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  userName?: string;
}

export const AICompanion: React.FC<AICompanionProps> = ({
  currentUrl = 'https://en.wikipedia.org/wiki/Artificial_intelligence',
  currentTitle = 'Artificial Intelligence',
  onNavigateTab,
  isCollapsed = false,
  onToggleCollapse,
  userName = 'Akash',
}) => {
  const [messages, setMessages] = useState<CompanionMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activePlan, setActivePlan] = useState<AutonomousTaskPlan | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const SUGGESTED_PROMPTS = [
    { label: 'Explore new AI tools', icon: Wand2 },
    { label: 'Analyze a website', icon: Globe },
    { label: 'Generate an image', icon: ImageIcon },
    { label: 'Write a blog post', icon: FileEdit },
    { label: 'Help with coding', icon: Code },
  ];

  useEffect(() => {
    const history = getLocalChatHistory();
    if (history.length > 0) {
      setMessages(history);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activePlan?.status]);

  const handleSend = async (customPrompt?: string) => {
    const textToSend = (customPrompt || input).trim();
    if (!textToSend || loading) return;

    setInput('');
    setLoading(true);

    const userMsg = await recordCompanionMessage({
      sender: 'user',
      content: textToSend,
    });
    setMessages((prev) => [...prev, userMsg]);

    try {
      const context: AdaLContext = {
        activeUrl: currentUrl,
        activeTitle: currentTitle,
      };

      const response = await companionEngine.runAutonomousQuery(
        textToSend,
        context,
        (progressPlan) => {
          setActivePlan({ ...progressPlan });
        },
        onNavigateTab
      );

      const companionMsg = await recordCompanionMessage({
        sender: 'companion',
        content: response.reply,
        multimodalPayload: {
          action: response.actionTaken,
        },
      });

      setMessages((prev) => [...prev, companionMsg]);
    } catch (err) {
      console.error('Companion error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (isCollapsed) {
    return (
      <div
        onClick={onToggleCollapse}
        className="w-12 h-full glass-panel rounded-3xl flex flex-col items-center justify-between py-6 cursor-pointer hover:border-cyan-400/40 transition"
        title="Expand AI Companion"
      >
        <div className="w-8 h-8 rounded-xl overflow-hidden shadow-lg shadow-cyan-500/20">
          <img src="/sharthi-logo.png" alt="Companion" className="w-full h-full object-cover" />
        </div>
        <div className="writing-mode-vertical text-[12px] font-medium text-[#BAC7E8] tracking-widest uppercase rotate-180">
          AI Companion
        </div>
        <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34D399]" />
      </div>
    );
  }

  return (
    <aside className="w-[290px] shrink-0 h-full flex flex-col justify-between p-3.5 glass-panel rounded-3xl border border-white/10 select-none text-white">
      {/* Top Header */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg overflow-hidden shadow-md shadow-cyan-500/20">
              <img src="/sharthi-logo.png" alt="Orb" className="w-full h-full object-cover" />
            </div>
            <span className="text-[13px] font-semibold text-white">AI Companion</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34D399] animate-pulse" />
              Online
            </span>
            {onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                className="p-1 text-[#8D9BBF] hover:text-white rounded-lg hover:bg-white/10 transition"
              >
                <Minimize2 size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Welcome Card */}
        <div className="mt-3.5 p-3 rounded-2xl bg-gradient-to-r from-[#248CFF]/20 to-[#713BFF]/25 border border-white/15 flex items-center gap-3 shadow-md">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-purple-500/30 shrink-0">
            <img src="/sharthi-logo.png" alt="Sharthi" className="w-full h-full object-cover" />
          </div>
          <div>
            <h4 className="text-[12px] font-bold text-white">Hey {userName}!</h4>
            <p className="text-[11px] text-[#BAC7E8] leading-tight">
              How can I help you today?
            </p>
          </div>
        </div>

        {/* 5 Suggested Action Buttons matching screenshot */}
        <div className="mt-3 space-y-1.5">
          {SUGGESTED_PROMPTS.map((prompt, idx) => {
            const Icon = prompt.icon;
            return (
              <button
                key={idx}
                onClick={() => handleSend(prompt.label)}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl glass-pill text-[12px] text-[#BAC7E8] hover:text-white hover:border-cyan-400/40 transition duration-200 text-left group"
              >
                <Icon size={14} className="text-[#8D9BBF] group-hover:text-cyan-300 transition shrink-0" />
                <span className="truncate">{prompt.label}</span>
              </button>
            );
          })}
        </div>

        {/* Autonomous Task Stepper Card (Visible when running a task) */}
        {activePlan && (
          <div className="mt-3 p-3 rounded-xl bg-[#141b3a]/70 border border-white/15 text-[11px]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-white truncate max-w-[170px]">
                {activePlan.goal}
              </span>
              <span
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                  activePlan.status === 'completed'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-cyan-500/20 text-cyan-300 animate-pulse'
                }`}
              >
                {activePlan.status === 'completed' ? 'Done ✅' : 'Executing 🔄'}
              </span>
            </div>

            <div className="space-y-1.5 max-h-36 overflow-y-auto no-scrollbar">
              {activePlan.steps.map((st) => (
                <div
                  key={st.id}
                  className={`flex items-center justify-between p-1.5 rounded-lg border text-[10px] ${
                    st.status === 'completed'
                      ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                      : st.status === 'running'
                      ? 'bg-cyan-950/30 border-cyan-500/40 text-cyan-200'
                      : 'bg-black/20 border-white/5 text-gray-400'
                  }`}
                >
                  <span className="truncate max-w-[190px]">{st.title}</span>
                  {st.status === 'completed' && <CheckCircle2 size={11} className="text-emerald-400 shrink-0" />}
                  {st.status === 'running' && <Loader2 size={11} className="animate-spin text-cyan-400 shrink-0" />}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Messages Scroll Area (if chat has items) */}
      {messages.length > 0 && (
        <div className="flex-1 overflow-y-auto my-2 pr-1 space-y-2 text-xs no-scrollbar max-h-56">
          {messages.slice(-8).map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[90%] rounded-2xl px-3 py-2 text-[11px] leading-relaxed select-text ${
                    isUser
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none shadow-md'
                      : 'bg-white/10 text-gray-200 border border-white/10 rounded-bl-none'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            );
          })}
          {loading && !activePlan && (
            <div className="flex items-center gap-2 text-cyan-300 text-[11px] p-2 italic">
              <Sparkles size={12} className="animate-spin" />
              <span>AdaL is reasoning...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Bottom Message Input Composer */}
      <div>
        <div className="p-1.5 rounded-2xl glass-pill flex items-center gap-1.5 border border-white/15 focus-within:border-cyan-400/50 transition">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 bg-transparent px-2 text-[12px] text-white placeholder:text-[#8D9BBF] focus:outline-none"
          />

          <button
            onClick={() => handleSend('Voice note: Summarize research points')}
            className="p-1.5 text-[#8D9BBF] hover:text-white rounded-lg hover:bg-white/10 transition"
            title="Voice Input"
          >
            <Mic size={14} />
          </button>

          <button
            onClick={() => handleSend('Analyze uploaded media')}
            className="p-1.5 text-[#8D9BBF] hover:text-white rounded-lg hover:bg-white/10 transition"
            title="Attach Media"
          >
            <ImageIcon size={14} />
          </button>

          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#713BFF] to-[#C044FF] text-white flex items-center justify-center shadow-lg shadow-purple-500/30 hover:scale-105 transition disabled:opacity-40 shrink-0"
          >
            <Send size={12} />
          </button>
        </div>

        {/* Footer Attribution */}
        <p className="text-center text-[10px] text-[#8D9BBF]/70 mt-2 font-medium">
          Powered by AdaL · Sylph
        </p>
      </div>
    </aside>
  );
};
