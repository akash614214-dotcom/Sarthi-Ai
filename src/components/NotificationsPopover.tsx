import React from 'react';
import { Bell, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';
import { AppNotification } from '../types';

interface NotificationsPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onClear: () => void;
}

export const NotificationsPopover: React.FC<NotificationsPopoverProps> = ({
  isOpen,
  onClose,
  notifications,
  onClear,
}) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-16 right-6 z-50 w-80 glass-panel rounded-2xl border border-white/20 shadow-2xl p-3 select-none text-white animate-in fade-in">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <Bell size={14} className="text-cyan-400" />
          <span className="text-[12px] font-bold">Notifications</span>
        </div>
        <div className="flex items-center gap-2">
          {notifications.length > 0 && (
            <button
              onClick={onClear}
              className="text-[10px] text-[#8D9BBF] hover:text-white transition"
            >
              Clear
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 text-[#8D9BBF] hover:text-white rounded-lg hover:bg-white/10"
          >
            <X size={12} />
          </button>
        </div>
      </div>

      <div className="space-y-2 max-h-72 overflow-y-auto no-scrollbar">
        {notifications.length === 0 ? (
          <div className="py-6 text-center text-[11px] text-[#8D9BBF]">
            No new notifications
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[11px] space-y-0.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">{n.title}</span>
                <span className="text-[9px] text-[#8D9BBF]">{n.time}</span>
              </div>
              <p className="text-[#BAC7E8] text-[10px] leading-tight">{n.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

