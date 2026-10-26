import React from 'react';
import { ShieldAlert, AlertTriangle, Check, X } from 'lucide-react';

interface ApprovalDialogProps {
  isOpen: boolean;
  title: string;
  actionDescription: string;
  consequence: string;
  onApprove: () => void;
  onCancel: () => void;
}

export const ApprovalDialog: React.FC<ApprovalDialogProps> = ({
  isOpen,
  title,
  actionDescription,
  consequence,
  onApprove,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 select-none">
      <div className="w-full max-w-md glass-panel rounded-2xl border border-white/20 shadow-2xl p-5 text-white animate-in zoom-in-95">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <ShieldAlert size={20} />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-white">{title}</h3>
            <p className="text-[11px] text-[#BAC7E8]">Agent Permission Request</p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#141b3a] border border-white/10 my-3 text-[12px] space-y-1.5">
          <p className="text-[#BAC7E8]">
            <strong className="text-white">Action:</strong> {actionDescription}
          </p>
          <p className="text-amber-300 text-[11px]">
            <strong>Note:</strong> {consequence}
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 mt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-[12px] font-medium text-[#BAC7E8] hover:text-white hover:bg-white/10 transition"
          >
            Cancel
          </button>
          <button
            onClick={onApprove}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[12px] font-semibold shadow-lg shadow-blue-500/20 hover:scale-105 transition"
          >
            Approve & Execute
          </button>
        </div>
      </div>
    </div>
  );
};

