export type WorkspaceType =
  | 'home'
  | 'browser'
  | 'companion'
  | 'tasks'
  | 'library'
  | 'history'
  | 'settings'
  | 'research'
  | 'create'
  | 'code';

export interface RecentWorkspace {
  id: string;
  title: string;
  description: string;
  status: 'In progress' | 'Completed' | 'Queued';
  timeInfo: string;
  category: 'research' | 'code' | 'marketing' | 'builder' | 'general';
  thumbnailUrl?: string;
}

export interface LibraryItem {
  id: string;
  title: string;
  type: 'document' | 'research' | 'image' | 'code' | 'presentation';
  createdAt: string;
  size: string;
  summary: string;
  isReal: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'warning';
}

export interface UserProfile {
  name: string;
  initials: string;
  email: string;
  role: string;
  plan: string;
}

export interface BrowserTab {
  id: string;
  title: string;
  url: string;
  favicon?: string;
  isLoading?: boolean;
}

