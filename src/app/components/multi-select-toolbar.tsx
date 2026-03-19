import { Archive, Trash2, Clock, CheckCircle2, X } from "lucide-react";
import { Button } from "./ui/button";
import { useLanguage } from "../context/language-context";
import { safeDelete, safeBulkDelete } from "./safe-delete-toast";

interface MultiSelectToolbarProps {
  selectedCount: number;
  selectedIds?: string[];
  onArchive: () => void;
  onDelete: () => void;
  onSnooze: () => void;
  onMarkHandled: () => void;
  onClearSelection: () => void;
}

export function MultiSelectToolbar({
  selectedCount,
  selectedIds = [],
  onArchive,
  onDelete,
  onSnooze,
  onMarkHandled,
  onClearSelection,
}: MultiSelectToolbarProps) {
  const { t } = useLanguage();
  
  if (selectedCount === 0) return null;

  const handleSafeDelete = () => {
    // Create delete actions for all selected messages
    const deleteActions = selectedIds.map((id) => ({
      id,
      type: "message" as const,
      data: { id }, // Store any data needed for restoration
      onUndo: () => {
        // This would restore the message in a real implementation
        console.log(`Restoring message ${id}`);
      },
    }));

    // Use safe bulk delete with undo functionality
    safeBulkDelete(deleteActions);
    
    // Call the original onDelete callback
    onDelete();
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-2xl">
      <div className="flex items-center gap-2 border-r border-gray-200 pr-3">
        <span className="text-[13px] font-semibold text-gray-900">{selectedCount} {t("multiselect.selected")}</span>
        <button
          onClick={onClearSelection}
          className="rounded-lg p-1 hover:bg-gray-100 transition-colors"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <Button
          onClick={onArchive}
          variant="outline"
          className="gap-1.5 rounded-full border-gray-200 px-3 py-1.5 text-[12px] font-medium text-gray-700 hover:bg-gray-50"
        >
          <Archive className="h-3.5 w-3.5" />
          {t("actions.archive")}
        </Button>

        <Button
          onClick={onSnooze}
          variant="outline"
          className="gap-1.5 rounded-full border-gray-200 px-3 py-1.5 text-[12px] font-medium text-gray-700 hover:bg-gray-50"
        >
          <Clock className="h-3.5 w-3.5" />
          {t("actions.snooze")}
        </Button>

        <Button
          onClick={onMarkHandled}
          variant="outline"
          className="gap-1.5 rounded-full border-gray-200 px-3 py-1.5 text-[12px] font-medium text-gray-700 hover:bg-gray-50"
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          {t("actions.markHandled")}
        </Button>

        <Button
          onClick={handleSafeDelete}
          variant="outline"
          className="gap-1.5 rounded-full border-red-200 bg-red-50 px-3 py-1.5 text-[12px] font-medium text-red-700 hover:bg-red-100"
        >
          <Trash2 className="h-3.5 w-3.5" />
          {t("actions.delete")}
        </Button>
      </div>
    </div>
  );
}