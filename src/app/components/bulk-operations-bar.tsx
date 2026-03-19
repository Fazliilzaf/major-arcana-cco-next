import { Archive, UserPlus, Tag, Clock, Trash2, Star, AlertCircle, CheckSquare, X } from 'lucide-react';
import { toast } from 'sonner';

interface BulkOperationsBarProps {
  selectedCount: number;
  onClearSelection: () => void;
  onBulkAssign: () => void;
  onBulkTag: () => void;
  onBulkSnooze: () => void;
  onBulkArchive: () => void;
  onBulkDelete: () => void;
  onBulkVIP: () => void;
}

export function BulkOperationsBar({
  selectedCount,
  onClearSelection,
  onBulkAssign,
  onBulkTag,
  onBulkSnooze,
  onBulkArchive,
  onBulkDelete,
  onBulkVIP,
}: BulkOperationsBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-full shadow-2xl border-2 border-white px-5 py-3 flex items-center gap-3">
        {/* Counter */}
        <div className="flex items-center gap-2 pr-3 border-r border-pink-400/50">
          <CheckSquare className="h-4 w-4" />
          <span className="text-sm font-bold">{selectedCount} selected</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <BulkButton
            icon={UserPlus}
            label="Assign"
            shortcut="A"
            onClick={onBulkAssign}
          />
          <BulkButton
            icon={Tag}
            label="Tag"
            shortcut="T"
            onClick={onBulkTag}
          />
          <BulkButton
            icon={Clock}
            label="Snooze"
            shortcut="S"
            onClick={onBulkSnooze}
          />
          <BulkButton
            icon={Archive}
            label="Archive"
            shortcut="D"
            onClick={onBulkArchive}
          />
          <BulkButton
            icon={Star}
            label="VIP"
            shortcut="V"
            onClick={onBulkVIP}
          />
          <div className="w-px h-6 bg-pink-400/50 mx-1" />
          <BulkButton
            icon={Trash2}
            label="Delete"
            onClick={onBulkDelete}
            danger
          />
        </div>

        {/* Clear */}
        <button
          onClick={onClearSelection}
          className="ml-2 p-1.5 rounded-full hover:bg-white/20 transition-colors"
          title="Clear selection (ESC)"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function BulkButton({
  icon: Icon,
  label,
  shortcut,
  onClick,
  danger = false,
}: {
  icon: any;
  label: string;
  shortcut?: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
        danger
          ? 'hover:bg-red-500 hover:shadow-lg'
          : 'hover:bg-white/20 hover:shadow-lg'
      }`}
      title={shortcut ? `${label} (${shortcut})` : label}
    >
      <Icon className="h-3.5 w-3.5" />
      <span>{label}</span>
      {shortcut && (
        <kbd className="ml-1 px-1.5 py-0.5 text-[10px] bg-white/20 rounded border border-white/30">
          {shortcut}
        </kbd>
      )}
    </button>
  );
}
