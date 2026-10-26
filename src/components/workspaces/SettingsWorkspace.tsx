import React, { useState, useEffect } from 'react';
import {
  Settings,
  Database,
  Cpu,
  Shield,
  Palette,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
  Save,
} from 'lucide-react';
import {
  getSupabaseCredentials,
  saveSupabaseCredentials,
  testConnection,
  isSupabaseConfigured,
} from '../../lib/supabase';
import { SUPABASE_SQL_SCHEMA } from '../SupabaseConfigModal';

interface SettingsWorkspaceProps {
  onNotify?: (title: string, message: string) => void;
}

export const SettingsWorkspace: React.FC<SettingsWorkspaceProps> = ({ onNotify }) => {
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [model, setModel] = useState('adal-multimodal-v2');
  const [status, setStatus] = useState<{ loading: boolean; success?: boolean; message?: string }>({
    loading: false,
  });
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [autoSyncHistory, setAutoSyncHistory] = useState(true);
  const [multimodalVision, setMultimodalVision] = useState(true);

  useEffect(() => {
    const creds = getSupabaseCredentials();
    setUrl(creds.url);
    setAnonKey(creds.anonKey);
  }, []);

  const handleTest = async () => {
    setStatus({ loading: true });
    const res = await testConnection(url, anonKey);
    setStatus({ loading: false, success: res.success, message: res.message });
  };

  const handleSave = () => {
    saveSupabaseCredentials(url, anonKey);
    setStatus({
      loading: false,
      success: true,
      message: 'Supabase configuration saved and updated successfully!',
    });
    onNotify?.('Settings Saved', 'Supabase credentials and companion preferences updated.');
  };

  const copySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full glass-panel rounded-2xl p-5 overflow-y-auto no-scrollbar border border-white/10 select-none">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-indigo-500 flex items-center justify-center text-white shadow-md">
            <Settings size={16} />
          </div>
          <div>
            <h2 className="text-[16px] font-bold text-white">Settings</h2>
            <p className="text-[11px] text-[#BAC7E8]">
              Manage Supabase backend, AI models, preferences, and privacy
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[12px] font-semibold shadow-lg shadow-cyan-500/20 hover:scale-105 transition"
        >
          <Save size={13} />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="space-y-6 max-w-4xl">
        {/* Section 1: Supabase Configuration */}
        <div className="p-4 rounded-2xl bg-[#131938]/80 border border-white/15 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database size={16} className="text-emerald-400" />
              <h3 className="text-[14px] font-semibold text-white">
                Supabase Integration
              </h3>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isSupabaseConfigured()
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}
            >
              {isSupabaseConfigured() ? 'Connected' : 'Not Connected'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-[#BAC7E8] mb-1">
                Supabase Project URL
              </label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://xyz.supabase.co"
                className="w-full px-3.5 py-2 rounded-xl bg-[#0f142e] border border-white/15 text-[12px] text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#BAC7E8] mb-1">
                Supabase Publishable / Anon Key
              </label>
              <input
                type="password"
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                placeholder="sb_publishable_..."
                className="w-full px-3.5 py-2 rounded-xl bg-[#0f142e] border border-white/15 text-[12px] text-white focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          {status.message && (
            <div
              className={`p-2.5 rounded-xl text-[11px] flex items-center gap-2 ${
                status.success
                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
              }`}
            >
              {status.success ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
              <span>{status.message}</span>
            </div>
          )}

          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleTest}
              disabled={status.loading || !url}
              className="px-3.5 py-1.5 rounded-xl glass-pill text-[11px] text-white hover:border-cyan-400 transition"
            >
              {status.loading ? 'Testing...' : 'Test Connection'}
            </button>
            <button
              onClick={copySql}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl glass-pill text-[11px] text-cyan-300 hover:text-white transition"
            >
              <Copy size={12} />
              <span>{copiedSchema ? 'SQL Copied!' : 'Copy Database Schema SQL'}</span>
            </button>
          </div>
        </div>

        {/* Section 2: AI Provider & Model */}
        <div className="p-4 rounded-2xl bg-[#131938]/80 border border-white/15 space-y-3">
          <div className="flex items-center gap-2">
            <Cpu size={16} className="text-cyan-400" />
            <h3 className="text-[14px] font-semibold text-white">AI Provider & Core Model</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { id: 'adal-multimodal-v2', label: 'AdaL Multimodal Engine (Default)', tag: 'Active' },
              { id: 'claude-3-5-sonnet', label: 'Anthropic Claude 3.5 Sonnet', tag: 'Supported' },
              { id: 'gpt-4o', label: 'OpenAI GPT-4o Omni', tag: 'Supported' },
              { id: 'gemini-2-flash', label: 'Google Gemini 2.0 Flash', tag: 'Supported' },
            ].map((m) => (
              <div
                key={m.id}
                onClick={() => setModel(m.id)}
                className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition ${
                  model === m.id
                    ? 'bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border-cyan-400/60 shadow-md'
                    : 'bg-[#0f142e] border-white/10 hover:border-white/20'
                }`}
              >
                <div>
                  <h4 className="text-[12px] font-semibold text-white">{m.label}</h4>
                  <p className="text-[10px] text-[#8D9BBF]">Autonomous task execution</p>
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300">
                  {m.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Privacy & Automated Sync */}
        <div className="p-4 rounded-2xl bg-[#131938]/80 border border-white/15 space-y-3">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-purple-400" />
            <h3 className="text-[14px] font-semibold text-white">Privacy & Autonomous Permissions</h3>
          </div>

          <div className="space-y-2">
            <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#0f142e] border border-white/10 cursor-pointer">
              <span className="text-[12px] text-white">Sync browsing events to Supabase history</span>
              <input
                type="checkbox"
                checked={autoSyncHistory}
                onChange={(e) => setAutoSyncHistory(e.target.checked)}
                className="w-4 h-4 accent-cyan-400 rounded"
              />
            </label>
            <label className="flex items-center justify-between p-2.5 rounded-xl bg-[#0f142e] border border-white/10 cursor-pointer">
              <span className="text-[12px] text-white">Enable AdaL multimodal perception & viewport landmarks</span>
              <input
                type="checkbox"
                checked={multimodalVision}
                onChange={(e) => setMultimodalVision(e.target.checked)}
                className="w-4 h-4 accent-cyan-400 rounded"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

