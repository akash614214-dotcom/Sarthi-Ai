import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { AICompanion } from './AICompanion';
import { HomeDashboard } from './workspaces/HomeDashboard';
import { BrowserWorkspace } from './workspaces/BrowserWorkspace';
import { ResearchWorkspace } from './workspaces/ResearchWorkspace';
import { CreateWorkspace } from './workspaces/CreateWorkspace';
import { CodeWorkspace } from './workspaces/CodeWorkspace';
import { TasksWorkspace } from './workspaces/TasksWorkspace';
import { LibraryWorkspace } from './workspaces/LibraryWorkspace';
import { HistoryWorkspace } from './workspaces/HistoryWorkspace';
import { SettingsWorkspace } from './workspaces/SettingsWorkspace';
import { CommandPalette } from './CommandPalette';
import { NotificationsPopover } from './NotificationsPopover';
import { ApprovalDialog } from './ApprovalDialog';
import { AuthModal } from './AuthModal';
import { LoginScreen } from './LoginScreen';
import { WorkspaceType, RecentWorkspace, AppNotification, UserProfile } from '../types';

export const AppShell: React.FC = () => {
  const [activeWorkspace, setActiveWorkspace] = useState<WorkspaceType>('home');
  const [isCompanionCollapsed, setIsCompanionCollapsed] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const [approvalModal, setApprovalModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    consequence: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    description: '',
    consequence: '',
    onConfirm: () => {},
  });

  // User auth state: compulsory login required before accessing browser workspace
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('sarthi_auth_user');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.isAuthenticated) return parsed;
      }
    } catch {}
    return {
      name: '',
      initials: '',
      email: '',
      role: '',
      plan: '',
      isAuthenticated: false,
    };
  });

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'Autonomous Research Verified',
      message: 'Neural Networks synthesis completed and indexed to memory.',
      time: '5m ago',
      read: false,
      type: 'success',
    },
    {
      id: 'notif-2',
      title: 'Vector Memory Synced',
      message: '4 new document embeddings stored with 1536-dim vector weights.',
      time: '25m ago',
      read: false,
      type: 'info',
    },
  ]);

  const [recentWorkspaces] = useState<RecentWorkspace[]>([
    {
      id: 'ws-1',
      title: 'Startup Research',
      description: 'Researching AI market opportunities & competitors.',
      status: 'In progress',
      timeInfo: 'In progress • 12 min',
      category: 'research',
    },
    {
      id: 'ws-2',
      title: 'Website Builder',
      description: 'Website planning and responsive design.',
      status: 'Completed',
      timeInfo: 'Completed • 2 days ago',
      category: 'builder',
    },
    {
      id: 'ws-3',
      title: 'Marketing Content',
      description: 'Marketing copy, launch presentation and campaign assets.',
      status: 'Completed',
      timeInfo: 'Completed • 4 days ago',
      category: 'marketing',
    },
    {
      id: 'ws-4',
      title: 'Code Assistant',
      description: 'Coding, refactoring, and debugging workspace.',
      status: 'In progress',
      timeInfo: 'In progress • 1 hr',
      category: 'code',
    },
  ]);

  const handleOpenRecentWorkspace = (ws: RecentWorkspace) => {
    if (ws.category === 'research') setActiveWorkspace('research');
    else if (ws.category === 'code') setActiveWorkspace('code');
    else if (ws.category === 'marketing' || ws.category === 'builder') setActiveWorkspace('create');
    else setActiveWorkspace('browser');
  };

  const handleNotify = (title: string, message: string) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title,
      message,
      time: 'Just now',
      read: false,
      type: 'success',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleSignOut = () => {
    localStorage.removeItem('sarthi_auth_user');
    setUser({
      name: '',
      initials: '',
      email: '',
      role: '',
      plan: '',
      isAuthenticated: false,
    });
  };

  const handleAuthSuccess = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    localStorage.setItem('sarthi_auth_user', JSON.stringify(updatedUser));
    handleNotify(
      'Authentication Successful',
      `Welcome ${updatedUser.name}! Sarthi Browser is unlocked.`
    );
  };

  // Compulsory Login Check: If user is not authenticated, show full-screen Login Screen!
  if (!user.isAuthenticated) {
    return <LoginScreen onLoginSuccess={handleAuthSuccess} />;
  }

  const renderActiveWorkspace = () => {
    switch (activeWorkspace) {
      case 'home':
        return (
          <HomeDashboard
            onSelectWorkspace={setActiveWorkspace}
            recentWorkspaces={recentWorkspaces}
            onOpenRecentWorkspace={handleOpenRecentWorkspace}
            onOpenResearchComposer={() => setActiveWorkspace('research')}
            onOpenCreateComposer={() => setActiveWorkspace('create')}
            onOpenCodeWorkspace={() => setActiveWorkspace('code')}
          />
        );
      case 'browser':
        return (
          <BrowserWorkspace
            onAskCompanion={(prompt) => {
              handleNotify('Companion Alert', `Processing browser query: "${prompt}"`);
            }}
          />
        );
      case 'research':
        return <ResearchWorkspace />;
      case 'create':
        return <CreateWorkspace />;
      case 'code':
        return <CodeWorkspace />;
      case 'tasks':
        return <TasksWorkspace />;
      case 'library':
        return <LibraryWorkspace />;
      case 'history':
        return <HistoryWorkspace />;
      case 'settings':
        return <SettingsWorkspace onNotify={handleNotify} />;
      default:
        return (
          <HomeDashboard
            onSelectWorkspace={setActiveWorkspace}
            recentWorkspaces={recentWorkspaces}
            onOpenRecentWorkspace={handleOpenRecentWorkspace}
            onOpenResearchComposer={() => setActiveWorkspace('research')}
            onOpenCreateComposer={() => setActiveWorkspace('create')}
            onOpenCodeWorkspace={() => setActiveWorkspace('code')}
          />
        );
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden flex items-center justify-center p-3 select-none">
      {/* Cinematic Mountain Sunset Backdrop with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0 transition-all duration-700"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 25%, rgba(113, 59, 255, 0.15) 0%, rgba(7, 11, 25, 0.45) 85%),
            linear-gradient(to bottom, rgba(7, 11, 25, 0.15) 0%, rgba(7, 11, 25, 0.55) 100%),
            url('/mountain-sunset.jpg')
          `,
          backgroundColor: '#070B19',
        }}
      />

      {/* Main Glass Shell Container */}
      <div className="relative z-10 w-full h-full rounded-[28px] border border-white/20 bg-[#0B1430]/25 backdrop-blur-[10px] shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex gap-3 p-3 overflow-hidden">
        {/* Left Navigation Sidebar */}
        <Sidebar
          activeWorkspace={activeWorkspace}
          onSelectWorkspace={setActiveWorkspace}
        />

        {/* Central Workspace Canvas */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Top Utility Bar */}
          <TopBar
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
            onToggleNotifications={() => setIsNotificationsOpen(!isNotificationsOpen)}
            unreadNotificationsCount={notifications.filter((n) => !n.read).length}
            user={user}
            onOpenAuthModal={(mode) => {
              setAuthMode(mode);
              setIsAuthModalOpen(true);
            }}
            onSignOut={handleSignOut}
          />

          {/* Central Workspace Content Area */}
          <main className="flex-1 overflow-hidden flex flex-col">
            {renderActiveWorkspace()}
          </main>
        </div>

        {/* Right Floating AI Companion Panel */}
        <AICompanion
          isCollapsed={isCompanionCollapsed}
          onToggleCollapse={() => setIsCompanionCollapsed(!isCompanionCollapsed)}
          userName={user.name ? user.name.split(' ')[0] : 'Akash'}
        />
      </div>

      {/* Sign In & Sign Up Modal (for switching accounts) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        initialMode={authMode}
      />

      {/* Floating Command Palette (Cmd + K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectWorkspace={setActiveWorkspace}
        onExecutePrompt={(prompt) => {
          handleNotify('Prompt Submitted', `AdaL received: "${prompt}"`);
        }}
      />

      {/* Notifications Popover */}
      <NotificationsPopover
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onClear={() => setNotifications([])}
      />

      {/* Approval Dialog for Sensitive Actions */}
      <ApprovalDialog
        isOpen={approvalModal.isOpen}
        title={approvalModal.title}
        actionDescription={approvalModal.description}
        consequence={approvalModal.consequence}
        onApprove={() => {
          approvalModal.onConfirm();
          setApprovalModal({ ...approvalModal, isOpen: false });
        }}
        onCancel={() => setApprovalModal({ ...approvalModal, isOpen: false })}
      />
    </div>
  );
};
