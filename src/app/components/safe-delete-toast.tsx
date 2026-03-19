import { toast } from "sonner";
import { Undo2 } from "lucide-react";

interface DeleteAction {
  id: string;
  type: "message" | "conversation" | "draft";
  data: any;
  onUndo: () => void;
}

// Store deleted items temporarily for undo
const deletedItems = new Map<string, DeleteAction>();

export function safeDelete(action: DeleteAction) {
  // Store the deleted item
  deletedItems.set(action.id, action);

  // Show toast with undo button
  toast.success(
    <div className="flex items-center justify-between gap-3 w-full">
      <span>
        {action.type === "message" && "Meddelande raderat"}
        {action.type === "conversation" && "Konversation raderad"}
        {action.type === "draft" && "Utkast raderat"}
      </span>
      <button
        onClick={() => handleUndo(action.id)}
        className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all"
      >
        <Undo2 className="h-3 w-3" />
        Ångra
      </button>
    </div>,
    {
      duration: 5000, // 5 seconds to undo
      onDismiss: () => {
        // Permanently delete if not undone
        deletedItems.delete(action.id);
      },
    }
  );

  // Auto-cleanup after 5 seconds
  setTimeout(() => {
    if (deletedItems.has(action.id)) {
      deletedItems.delete(action.id);
    }
  }, 5000);
}

function handleUndo(id: string) {
  const action = deletedItems.get(id);
  if (action) {
    action.onUndo();
    deletedItems.delete(id);
    toast.success("Återställd!");
  }
}

// Bulk delete with undo
export function safeBulkDelete(actions: DeleteAction[]) {
  const count = actions.length;
  
  // Store all items
  actions.forEach(action => {
    deletedItems.set(action.id, action);
  });

  toast.success(
    <div className="flex items-center justify-between gap-3 w-full">
      <span>{count} objekt raderade</span>
      <button
        onClick={() => handleBulkUndo(actions.map(a => a.id))}
        className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all"
      >
        <Undo2 className="h-3 w-3" />
        Ångra alla
      </button>
    </div>,
    {
      duration: 5000,
      onDismiss: () => {
        actions.forEach(action => deletedItems.delete(action.id));
      },
    }
  );

  // Auto-cleanup
  setTimeout(() => {
    actions.forEach(action => {
      if (deletedItems.has(action.id)) {
        deletedItems.delete(action.id);
      }
    });
  }, 5000);
}

function handleBulkUndo(ids: string[]) {
  let restored = 0;
  ids.forEach(id => {
    const action = deletedItems.get(id);
    if (action) {
      action.onUndo();
      deletedItems.delete(id);
      restored++;
    }
  });
  
  if (restored > 0) {
    toast.success(`${restored} objekt återställda!`);
  }
}

// Export utility to check if an item is in deletion queue
export function isInDeletionQueue(id: string): boolean {
  return deletedItems.has(id);
}

// Clear all pending deletions (useful for cleanup)
export function clearDeletionQueue() {
  deletedItems.clear();
}

// Simplified wrapper for easier use in components
export function showSafeDeleteToast({ 
  itemName, 
  onUndo 
}: { 
  itemName: string; 
  onUndo: () => void;
}) {
  const id = `delete-${Date.now()}-${Math.random()}`;
  
  safeDelete({
    id,
    type: "message",
    data: { itemName },
    onUndo,
  });
}

// Simplified wrapper for bulk deletes
export function showBulkSafeDeleteToast({
  count,
  type = "meddelanden",
  onUndo,
}: {
  count: number;
  type?: string;
  onUndo: () => void;
}) {
  const actions: DeleteAction[] = Array.from({ length: count }, (_, i) => ({
    id: `bulk-${Date.now()}-${i}`,
    type: "message" as const,
    data: {},
    onUndo,
  }));

  safeBulkDelete(actions);
}