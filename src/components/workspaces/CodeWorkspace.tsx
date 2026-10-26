import React, { useState } from 'react';
import {
  Code2,
  Play,
  Bug,
  Sparkles,
  FileCode,
  CheckCircle,
  Copy,
  Terminal,
} from 'lucide-react';

export const CodeWorkspace: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState('src/lib/adalCompanion.ts');
  const [codePrompt, setCodePrompt] = useState('Optimize the sequential task decomposition loop and add telemetry hooks');
  const [testOutput, setTestOutput] = useState<string | null>(
    `✓ tsconfig.json typecheck passed\n✓ vite build compiled in 2.83s\n✓ 1637 modules transformed\n✓ 0 syntax or runtime warnings`
  );

  const SAMPLE_CODE = `// Sharthi AI — AdaL Autonomous Sequential Executor
export async function executeSequentialPlan(
  plan: AutonomousTaskPlan,
  context: AdaLContext
): Promise<ExecutionOutcome> {
  for (const step of plan.steps) {
    step.status = 'running';
    await dispatchAction(step.actionType, step.targetPayload);
    step.status = 'completed';
  }
  
  // Verification check: validate completion criteria
  const isSatisfied = await auditGoalCompletion(plan.goal);
  if (!isSatisfied) {
    return remedyMissingSubcommands(plan);
  }
  return { status: 'Task Done', verified: true };
}`;

  return (
    <div className="flex-1 flex flex-col h-full glass-panel rounded-2xl p-5 overflow-y-auto no-scrollbar border border-white/10 select-text">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10 select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md">
            <Code2 size={16} />
          </div>
          <div>
            <h2 className="text-[16px] font-bold text-white">Code Workspace</h2>
            <p className="text-[11px] text-[#BAC7E8]">
              Intelligent debugging, architecture analysis, and syntax sandboxing
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1">
        {/* Left Control Column */}
        <div className="lg:col-span-4 space-y-4 select-none">
          <div>
            <label className="block text-[12px] font-semibold text-white mb-1.5">
              Target File / Module
            </label>
            <select
              value={selectedFile}
              onChange={(e) => setSelectedFile(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#141b3a] border border-white/15 text-[12px] text-white focus:outline-none"
            >
              <option value="src/lib/adalCompanion.ts">src/lib/adalCompanion.ts</option>
              <option value="src/lib/supabase.ts">src/lib/supabase.ts</option>
              <option value="src/App.tsx">src/App.tsx</option>
            </select>
          </div>

          <div>
            <label className="block text-[12px] font-semibold text-white mb-1.5">
              Code Assistant Prompt
            </label>
            <textarea
              rows={3}
              value={codePrompt}
              onChange={(e) => setCodePrompt(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#141b3a] border border-white/15 text-[12px] text-white focus:border-cyan-400 focus:outline-none resize-none"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() =>
                setTestOutput('Running AdaL debugger...\n✓ Step verification validated\n✓ No deadlocks found')
              }
              className="flex-1 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[12px] font-semibold flex items-center justify-center gap-1.5 shadow-md hover:scale-[1.01] transition"
            >
              <Bug size={14} />
              <span>Analyze Code</span>
            </button>
            <button
              onClick={() =>
                setTestOutput('Running test suite...\n✓ 12/12 unit tests passed (0 failures)')
              }
              className="px-3.5 py-2 rounded-xl glass-pill text-[12px] text-emerald-400 hover:text-white transition flex items-center gap-1"
            >
              <Play size={13} />
              <span>Test</span>
            </button>
          </div>

          {/* Test / Console Output */}
          <div className="mt-4 p-3 rounded-xl bg-black/40 border border-white/10 font-mono text-[11px] text-emerald-300">
            <div className="flex items-center gap-1.5 text-[10px] text-[#8D9BBF] mb-1.5 pb-1 border-b border-white/10">
              <Terminal size={12} />
              <span>Terminal & Test Output</span>
            </div>
            <pre className="whitespace-pre-wrap">{testOutput}</pre>
          </div>
        </div>

        {/* Right Code Viewer */}
        <div className="lg:col-span-8 flex flex-col h-full bg-[#0d1226] rounded-2xl border border-white/15 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#121838] border-b border-white/10 select-none">
            <div className="flex items-center gap-2 text-[12px] text-[#BAC7E8]">
              <FileCode size={14} className="text-cyan-400" />
              <span>{selectedFile}</span>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(SAMPLE_CODE)}
              className="flex items-center gap-1 text-[11px] text-[#8D9BBF] hover:text-white transition"
            >
              <Copy size={12} />
              <span>Copy</span>
            </button>
          </div>
          <pre className="p-4 text-[12px] font-mono text-cyan-200 overflow-x-auto leading-relaxed flex-1 no-scrollbar">
            {SAMPLE_CODE}
          </pre>
        </div>
      </div>
    </div>
  );
};

