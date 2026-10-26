import { createClient, SupabaseClient } from '@supabase/supabase-js';

const STORAGE_KEY_URL = 'sharthi_supabase_url';
const STORAGE_KEY_KEY = 'sharthi_supabase_anon_key';

export function getSupabaseCredentials(): { url: string; anonKey: string } {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';
  const localUrl = localStorage.getItem(STORAGE_KEY_URL) || '';
  const localKey = localStorage.getItem(STORAGE_KEY_KEY) || '';

  return {
    url: localUrl || envUrl,
    anonKey: localKey || envKey,
  };
}

export function saveSupabaseCredentials(url: string, anonKey: string) {
  if (url) localStorage.setItem(STORAGE_KEY_URL, url.trim());
  else localStorage.removeItem(STORAGE_KEY_URL);

  if (anonKey) localStorage.setItem(STORAGE_KEY_KEY, anonKey.trim());
  else localStorage.removeItem(STORAGE_KEY_KEY);

  supabaseInstance = null;
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance;

  const { url, anonKey } = getSupabaseCredentials();
  if (url && anonKey) {
    try {
      supabaseInstance = createClient(url, anonKey);
      return supabaseInstance;
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      return null;
    }
  }
  return null;
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabaseCredentials();
  return Boolean(url && anonKey && url.startsWith('http'));
}

export async function testConnection(url?: string, anonKey?: string): Promise<{ success: boolean; message: string }> {
  try {
    const testUrl = url || getSupabaseCredentials().url;
    const testKey = anonKey || getSupabaseCredentials().anonKey;

    if (!testUrl || !testKey) {
      return { success: false, message: 'Please provide both Supabase URL and Anon Key' };
    }

    const testClient = createClient(testUrl, testKey);
    const { error } = await testClient.auth.getSession();
    if (error) {
      return { success: false, message: error.message };
    }
    return { success: true, message: 'Connected to Supabase successfully!' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Connection failed' };
  }
}

export interface BrowsingRecord {
  id: string;
  url: string;
  title: string;
  timestamp: string;
  summary?: string;
}

export interface CompanionMessage {
  id: string;
  sender: 'user' | 'companion' | 'system';
  content: string;
  timestamp: string;
  multimodalPayload?: {
    screenshot?: string;
    action?: string;
    confidence?: number;
    adaLWeights?: Record<string, number>;
  };
}

export interface AutonomousStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'retrying';
  actionType: 'navigate' | 'extract' | 'synthesize' | 'verify' | 'store_db' | 'remedy';
  targetPayload?: Record<string, any>;
  result?: string;
}

export interface AutonomousTaskPlan {
  id: string;
  goal: string;
  status: 'decomposing' | 'executing' | 'verifying' | 'remedying' | 'completed';
  steps: AutonomousStep[];
  verificationCriteria: string;
  isVerifiedCompleted: boolean;
  finalOutput?: string;
  createdAt: string;
  updatedAt: string;
}

export async function recordBrowsingEvent(record: Omit<BrowsingRecord, 'id' | 'timestamp'>) {
  const client = getSupabaseClient();
  const entry = {
    ...record,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  };

  if (client) {
    try {
      await client.from('browsing_history').insert([
        {
          url: entry.url,
          title: entry.title,
          page_summary: entry.summary,
        },
      ]);
    } catch (err) {
      console.warn('Supabase insert failed, using fallback storage:', err);
    }
  }

  const current = JSON.parse(localStorage.getItem('sharthi_history') || '[]');
  localStorage.setItem('sharthi_history', JSON.stringify([entry, ...current.slice(0, 99)]));
}

export async function recordCompanionMessage(message: Omit<CompanionMessage, 'id' | 'timestamp'>) {
  const client = getSupabaseClient();
  const entry: CompanionMessage = {
    ...message,
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
  };

  if (client) {
    try {
      await client.from('companion_messages').insert([
        {
          sender: entry.sender,
          content: entry.content,
          multimodal_payload: entry.multimodalPayload,
        },
      ]);
    } catch (err) {
      console.warn('Supabase message insert failed, using fallback:', err);
    }
  }

  const current = JSON.parse(localStorage.getItem('sharthi_companion_chat') || '[]');
  localStorage.setItem('sharthi_companion_chat', JSON.stringify([...current, entry]));
  return entry;
}

export function getLocalChatHistory(): CompanionMessage[] {
  try {
    return JSON.parse(localStorage.getItem('sharthi_companion_chat') || '[]');
  } catch {
    return [];
  }
}

export async function recordAutonomousTask(plan: AutonomousTaskPlan) {
  const client = getSupabaseClient();

  if (client) {
    try {
      await client.from('autonomous_tasks').insert([
        {
          id: plan.id,
          goal: plan.goal,
          status: plan.status === 'completed' ? 'completed' : 'in_progress',
          steps: plan.steps,
        },
      ]);
    } catch (err) {
      console.warn('Supabase task insert failed, using local storage:', err);
    }
  }

  const tasks = JSON.parse(localStorage.getItem('sharthi_autonomous_tasks') || '[]');
  const existingIndex = tasks.findIndex((t: AutonomousTaskPlan) => t.id === plan.id);
  if (existingIndex >= 0) {
    tasks[existingIndex] = plan;
  } else {
    tasks.unshift(plan);
  }
  localStorage.setItem('sharthi_autonomous_tasks', JSON.stringify(tasks.slice(0, 50)));
}

export async function updateAutonomousTask(plan: AutonomousTaskPlan) {
  const client = getSupabaseClient();

  if (client) {
    try {
      await client
        .from('autonomous_tasks')
        .update({
          status: plan.status === 'completed' ? 'completed' : 'in_progress',
          steps: plan.steps,
        })
        .eq('id', plan.id);
    } catch (err) {
      console.warn('Supabase task update failed:', err);
    }
  }

  const tasks = JSON.parse(localStorage.getItem('sharthi_autonomous_tasks') || '[]');
  const existingIndex = tasks.findIndex((t: AutonomousTaskPlan) => t.id === plan.id);
  if (existingIndex >= 0) {
    tasks[existingIndex] = plan;
    localStorage.setItem('sharthi_autonomous_tasks', JSON.stringify(tasks));
  }
}
