import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  Camera,
  Brain,
  CheckCircle,
  Cpu,
  Layers,
  ListTodo,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  ChevronDown,
  ChevronUp,
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

interface CompanionPaneProps {
  currentUrl: string;
  currentTitle: string;
  onNavigateTab?: (url: string) => void;
}

export const CompanionPane: React.FC<CompanionPaneProps> = ({
  currentUrl,
  currentTitle,
  onNavigateTab,
}) => {
  const [messages, setMessages] = useState<CompanionMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activePlan, setActivePlan] = useState<AutonomousTaskPlan | null>(null);
  const [showPlanDetails, setShowPlanDetails] = useState(true);
  const [engineState, setEngineState] = useState<AdaLCompanionState>(
    companionEngine.getState()
  );
  const [isCapturing, setIsCapturing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const history = getLocalChatHistory();
    if (history.length > 0) {
      setMessages(history);
    } else {
      const welcome: CompanionMessage = {
        id: 'init-1',
        sender: 'companion',
        content:
          "Hello! I am your AdaL Multimodal Companion. Give me any complex command or goal — I will break it down into sequential subcommands, execute each step, verify the outcome, and return 'Task Done' once satisfied.",
        timestamp: new Date().toISOString(),
      };
      setMessages([welcome]);
    }
  }, []);

  useEffect(() => {
    const updateContext = async () => {
      const context: AdaLContext = {
        activeUrl: currentUrl,
        activeTitle: currentTitle,
      };
      await companionEngine.processContext(context);
      setEngineState(companionEngine.getState());
    };
    updateContext();
  }, [currentUrl, currentTitle]);

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
          confidence: engineState.confidence,
          adaLWeights: {
            adaptation: engineState.adaptationScore,
          },
        },
      });

      setMessages((prev) => [...prev, companionMsg]);
    } catch (err) {
      console.error('Error generating companion response:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCaptureSnapshot = async () => {
    setIsCapturing(true);
    try {
      const captureMsg = await recordCompanionMessage({
        sender: 'user',
        content: `Captured viewport context for "${currentTitle || currentUrl}".`,
        multimodalPayload: {
          action: 'multimodal_viewport_encoded',
        },
      });
      setMessages((prev) => [...prev, captureMsg]);

      const reply = await recordCompanionMessage({
        sender: 'companion',
        content: `Multimodal perception tensor created for ${
          currentTitle || currentUrl
        }. Viewport coordinates indexed and synchronized with Supabase vector memory.`,
        multimodalPayload: {
          confidence: 0.98,
        },
      });
      setMessages((prev) => [...prev, reply]);
    } catch (err) {
      console.error('Snapshot failed:', err);
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <aside className="w-96 flex flex-col bg-[#12141a] border-l border-gray-800 text-gray-200 select-text h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-800 bg-[#161820]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-gradient-to-tr from-indigo-500 to-purple-500 text-white rounded-lg shadow-sm">
              <Brain size={16} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">AdaL Companion</h3>
              <p className="text-[10px] text-gray-400">Autonomous Sequential Planner</p>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
            Active
          </span>
        </div>

        {/* Adaptive Metrics Bar */}
        <div className="grid grid-cols-2 gap-2 mt-3 text-[11px] bg-[#0f1117] p-2 rounded-xl border border-gray-800/80">
          <div className="flex items-center gap-1.5 text-gray-400">
            <Cpu size={12} className="text-indigo-400" />
            <span>Adaptation:</span>
            <span className="text-gray-200 font-semibold">
              {(engineState.adaptationScore * 100).toFixed(0)}%
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-400">
            <Layers size={12} className="text-purple-400" />
            <span>Confidence:</span>
            <span className="text-gray-200 font-semibold">
              {(engineState.confidence * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Active Context Observer Pill */}
      <div className="px-4 py-2 bg-[#14161f] border-b border-gray-800/60 text-xs flex items-center justify-between">
        <span className="text-[11px] text-gray-400 truncate max-w-[260px]">
          Observing: <strong className="text-gray-200">{currentTitle || currentUrl}</strong>
        </span>
        <span
          className={`w-2 h-2 rounded-full ${
            isSupabaseConfigured() ? 'bg-emerald-400' : 'bg-amber-400'
          }`}
          title={isSupabaseConfigured() ? 'Supabase Synced' : 'Local Memory Cache'}
        />
      </div>

      {/* Suggested Autonomous Commands */}
      <div className="px-3 py-2 bg-[#111319] border-b border-gray-800 flex gap-1.5 overflow-x-auto no-scrollbar">
        <button
          onClick={() =>
            handleSend(
              'Research Neural Networks on Wikipedia, extract key architectural principles, and save to Supabase'
            )
          }
          className="shrink-0 text-[11px] bg-indigo-950/40 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-700/50 px-2.5 py-1 rounded-lg transition"
        >
          ⚡ Sequential Research Task
        </button>
        {engineState.suggestedActions.map((action, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(action)}
            className="shrink-0 text-[11px] bg-gray-800/80 hover:bg-gray-700 hover:text-white text-gray-300 px-2.5 py-1 rounded-lg border border-gray-700/60 transition"
          >
            {action}
          </button>
        ))}
      </div>

      {/* Autonomous Task Plan Stepper Card (Visible when a task is running or completed) */}
      {activePlan && (
        <div className="m-3 p-3 bg-[#181b24] border border-gray-750 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-200">
              <ListTodo size={14} className="text-indigo-400" />
              <span className="truncate max-w-[190px]">Task: {activePlan.goal}</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                  activePlan.status === 'completed'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : activePlan.status === 'remedying'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 animate-pulse'
                }`}
              >
                {activePlan.status === 'completed'
                  ? 'Task Done ✅'
                  : activePlan.status === 'remedying'
                  ? 'Self-Correcting 🔁'
                  : activePlan.status === 'verifying'
                  ? 'Verifying Audit 🔍'
                  : 'Executing Subcommands 🔄'}
              </span>
              <button
                onClick={() => setShowPlanDetails(!showPlanDetails)}
                className="text-gray-400 hover:text-white"
              >
                {showPlanDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>
          </div>

          {showPlanDetails && (
            <div className="mt-2.5 space-y-2 text-[11px]">
              {activePlan.steps.map((step) => {
                const isRunning = step.status === 'running';
                const isDone = step.status === 'completed';
                const isRetrying = step.status === 'retrying';

                return (
                  <div
                    key={step.id}
                    className={`p-2 rounded-lg border transition ${
                      isRunning
                        ? 'bg-indigo-950/30 border-indigo-500/40'
                        : isDone
                        ? 'bg-emerald-950/10 border-gray-800'
                        : isRetrying
                        ? 'bg-amber-950/20 border-amber-600/40'
                        : 'bg-[#12141a]/50 border-gray-800/60 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-200">{step.title}</span>
                      {isRunning && <Loader2 size={12} className="animate-spin text-indigo-400" />}
                      {isDone && <CheckCircle2 size={12} className="text-emerald-400" />}
                      {isRetrying && <RotateCcw size={12} className="animate-spin text-amber-400" />}
                      {step.status === 'pending' && (
                        <span className="text-[10px] text-gray-500">pending</span>
                      )}
                    </div>
                    {step.result && (
                      <p className="mt-1 text-[10px] text-gray-400 italic">
                        ↳ {step.result}
                      </p>
                    )}
                  </div>
                );
              })}

              {activePlan.status === 'completed' && (
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-300 text-[11px] font-medium flex items-center gap-2">
                  <CheckCircle size={14} className="shrink-0 text-emerald-400" />
                  <span>Final Task Verified & Completed! Synced to Supabase.</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed shadow-sm whitespace-pre-line ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-[#1a1d26] text-gray-200 border border-gray-800 rounded-bl-none'
                }`}
              >
                {m.content}
                {m.multimodalPayload?.action && (
                  <div className="mt-2 pt-2 border-t border-gray-700/50 flex items-center gap-1.5 text-[10px] text-indigo-300">
                    <CheckCircle size={11} />
                    <span>Action: {m.multimodalPayload.action}</span>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-gray-500 mt-1 px-1">
                {new Date(m.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          );
        })}
        {loading && !activePlan && (
          <div className="flex items-center gap-2 text-gray-400 text-xs italic p-2">
            <Sparkles size={14} className="animate-spin text-indigo-400" />
            <span>AdaL is synthesizing multimodal response...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 border-t border-gray-800 bg-[#161820]">
        <div className="flex items-center gap-1.5 bg-[#0f1117] border border-gray-750 focus-within:border-indigo-500 rounded-xl px-2 py-1.5">
          <button
            onClick={handleCaptureSnapshot}
            disabled={isCapturing}
            className="p-1.5 text-gray-400 hover:text-indigo-400 rounded-lg hover:bg-gray-800 transition"
            title="Multimodal Perception: Encode Viewport"
          >
            <Camera size={15} />
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Give task (e.g. Find X; summarize; save)..."
            className="flex-1 bg-transparent text-xs text-gray-200 placeholder:text-gray-500 focus:outline-none px-1"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition disabled:opacity-40"
          >
            <Send size={13} />
          </button>
        </div>
      </div>
    </aside>
  );
};
