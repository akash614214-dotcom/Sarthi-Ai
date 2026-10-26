import React, { useState, useEffect } from 'react';
import {
  getSupabaseCredentials,
  saveSupabaseCredentials,
  testConnection,
} from '../lib/supabase';
import { Database, CheckCircle2, AlertCircle, Copy, ExternalLink, X } from 'lucide-react';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved: () => void;
}

export const SUPABASE_SQL_SCHEMA = `-- Sharthi AI Companion & Browser Schema
create extension if not exists vector;

create table if not exists browsing_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  url text not null,
  title text,
  page_summary text,
  embedding vector(1536),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists companion_messages (
  id uuid primary key default gen_random_uuid(),
  sender text not null check (sender in ('user', 'companion', 'system')),
  content text,
  multimodal_payload jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);`;

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({
  isOpen,
  onClose,
  onConfigSaved,
}) => {
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [status, setStatus] = useState<{ loading: boolean; success?: boolean; message?: string }>({
    loading: false,
  });
  const [copiedSchema, setCopiedSchema] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const creds = getSupabaseCredentials();
      setUrl(creds.url);
      setAnonKey(creds.anonKey);
      setStatus({ loading: false });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTest = async () => {
    setStatus({ loading: true });
    const res = await testConnection(url, anonKey);
    setStatus({ loading: false, success: res.success, message: res.message });
  };

  const handleSave = () => {
    saveSupabaseCredentials(url, anonKey);
    onConfigSaved();
    onClose();
  };

  const copySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#181a20] border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
              <Database size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Connect Supabase</h2>
              <p className="text-xs text-gray-400">
                Sync companion memory, browsing history, and AdaL multimodal context
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800/80 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
          {/* Quick instructions */}
          <div className="bg-[#12141a] p-4 rounded-xl border border-gray-800/80">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Don't have a project yet? (Takes 2 minutes)
            </h3>
            <ol className="list-decimal list-inside space-y-1 text-xs text-gray-300">
              <li>
                Create a free project at{' '}
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:underline inline-flex items-center gap-1"
                >
                  supabase.com <ExternalLink size={12} />
                </a>
              </li>
              <li>Go to <strong>Project Settings</strong> → <strong>API</strong></li>
              <li>Copy the <strong>Project URL</strong> and <strong>anon (public)</strong> API Key below</li>
            </ol>
          </div>

          {/* Form fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Supabase Project URL
              </label>
              <input
                type="text"
                placeholder="https://xyzcompany.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#12141a] border border-gray-700/80 rounded-xl focus:border-emerald-500 focus:outline-none text-white text-sm placeholder:text-gray-600"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-300 mb-1.5">
                Supabase Anon / Public Key
              </label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#12141a] border border-gray-700/80 rounded-xl focus:border-emerald-500 focus:outline-none text-white text-sm placeholder:text-gray-600"
              />
            </div>
          </div>

          {/* Status Message */}
          {status.message && (
            <div
              className={`p-3 rounded-xl flex items-center gap-2.5 text-xs ${
                status.success
                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
              }`}
            >
              {status.success ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{status.message}</span>
            </div>
          )}

          {/* SQL Schema helper */}
          <div className="border border-gray-800 rounded-xl p-4 bg-[#12141a]/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-300">
                Recommended SQL Schema (Run in Supabase SQL Editor)
              </span>
              <button
                onClick={copySql}
                className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-lg transition"
              >
                <Copy size={12} />
                {copiedSchema ? 'Copied!' : 'Copy SQL'}
              </button>
            </div>
            <pre className="text-[11px] font-mono text-gray-400 bg-black/40 p-3 rounded-lg overflow-x-auto max-h-32 border border-gray-900">
              {SUPABASE_SQL_SCHEMA}
            </pre>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800 bg-[#14161c]">
          <button
            type="button"
            onClick={handleTest}
            disabled={status.loading || !url || !anonKey}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium rounded-xl transition disabled:opacity-50"
          >
            {status.loading ? 'Testing...' : 'Test Connection'}
          </button>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-400 hover:text-white text-xs font-medium rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

