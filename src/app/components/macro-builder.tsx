import { useState } from 'react';
import { Play, Plus, Trash2, GripVertical, FileText, Tag, Clock, UserPlus, Archive, Zap, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface MacroAction {
  id: string;
  type: 'template' | 'tag' | 'assign' | 'snooze' | 'sla' | 'archive';
  config: any;
}

interface Macro {
  id: string;
  name: string;
  description: string;
  actions: MacroAction[];
  trigger: 'manual' | 'auto';
  shortcut?: string;
  autoCondition?: string;
}

const DEFAULT_MACROS: Macro[] = [
  {
    id: 'booking-flow',
    name: 'Booking Confirmation Flow',
    description: 'Complete workflow for booking confirmations',
    trigger: 'manual',
    shortcut: '⌘⇧B',
    actions: [
      { id: '1', type: 'template', config: { templateId: 'booking-confirm' } },
      { id: '2', type: 'tag', config: { tag: 'pending-payment' } },
      { id: '3', type: 'sla', config: { hours: 24 } },
      { id: '4', type: 'assign', config: { assignTo: 'current-user' } },
      { id: '5', type: 'snooze', config: { days: 2 } },
    ]
  },
  {
    id: 'vip-greeting',
    name: 'VIP Customer Greeting',
    description: 'Special handling for VIP customers',
    trigger: 'auto',
    autoCondition: 'customer.isVIP === true',
    actions: [
      { id: '1', type: 'template', config: { templateId: 'vip-greeting' } },
      { id: '2', type: 'assign', config: { assignTo: 'senior-specialist' } },
      { id: '3', type: 'sla', config: { hours: 1 } },
    ]
  },
];

export function MacroBuilder() {
  const [macros, setMacros] = useState<Macro[]>(DEFAULT_MACROS);
  const [editingMacro, setEditingMacro] = useState<Macro | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleRunMacro = (macro: Macro) => {
    toast.success(`🎬 Running macro: ${macro.name}`, {
      description: `${macro.actions.length} actions executed`
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Macros & Workflows</h2>
          <p className="text-sm text-gray-600">Automate repetitive tasks</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg font-semibold hover:from-pink-700 hover:to-rose-700 transition-all shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Create Macro
        </button>
      </div>

      {/* Macros List */}
      <div className="grid gap-3">
        {macros.map(macro => (
          <MacroCard
            key={macro.id}
            macro={macro}
            onRun={() => handleRunMacro(macro)}
            onEdit={() => setEditingMacro(macro)}
            onDelete={() => {
              setMacros(macros.filter(m => m.id !== macro.id));
              toast.success(`Deleted: ${macro.name}`);
            }}
          />
        ))}
      </div>

      {/* Create/Edit Modal */}
      {(isCreating || editingMacro) && (
        <MacroEditorModal
          macro={editingMacro}
          onClose={() => {
            setIsCreating(false);
            setEditingMacro(null);
          }}
          onSave={(macro) => {
            if (editingMacro) {
              setMacros(macros.map(m => m.id === macro.id ? macro : m));
              toast.success('Macro updated!');
            } else {
              setMacros([...macros, { ...macro, id: Date.now().toString() }]);
              toast.success('Macro created!');
            }
            setIsCreating(false);
            setEditingMacro(null);
          }}
        />
      )}
    </div>
  );
}

function MacroCard({ 
  macro, 
  onRun, 
  onEdit, 
  onDelete 
}: { 
  macro: Macro; 
  onRun: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const actionIcons: Record<string, any> = {
    template: FileText,
    tag: Tag,
    assign: UserPlus,
    snooze: Clock,
    sla: Zap,
    archive: Archive,
  };

  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-pink-300 hover:shadow-md transition-all group">
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0">
          <Play className="h-6 w-6 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex-1">
              <h3 className="text-sm font-bold text-gray-900">{macro.name}</h3>
              <p className="text-xs text-gray-600 mt-0.5">{macro.description}</p>
            </div>
            <div className="flex items-center gap-1">
              {macro.trigger === 'auto' ? (
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-md">
                  Auto
                </span>
              ) : (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-md">
                  Manual
                </span>
              )}
              {macro.shortcut && (
                <kbd className="px-2 py-1 text-xs font-semibold text-gray-600 bg-gray-100 border border-gray-300 rounded shadow-sm">
                  {macro.shortcut}
                </kbd>
              )}
            </div>
          </div>

          {/* Actions Preview */}
          <div className="flex items-center gap-1.5 flex-wrap mb-3">
            {macro.actions.map((action, i) => {
              const Icon = actionIcons[action.type];
              return (
                <div
                  key={action.id}
                  className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md text-xs text-gray-700"
                >
                  {Icon && <Icon className="h-3 w-3" />}
                  <span className="capitalize">{action.type}</span>
                </div>
              );
            })}
          </div>

          {/* Auto Condition */}
          {macro.autoCondition && (
            <div className="mb-3 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs text-amber-900">
                <strong>Trigger:</strong> {macro.autoCondition}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onRun}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg text-xs font-semibold hover:from-pink-700 hover:to-rose-700 transition-all"
            >
              <Play className="h-3.5 w-3.5" />
              Run Now
            </button>
            <button
              onClick={onEdit}
              className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-all"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MacroEditorModal({ 
  macro, 
  onClose, 
  onSave 
}: { 
  macro: Macro | null;
  onClose: () => void;
  onSave: (macro: Macro) => void;
}) {
  const [name, setName] = useState(macro?.name || '');
  const [description, setDescription] = useState(macro?.description || '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
          <h2 className="text-lg font-bold text-gray-900">
            {macro ? 'Edit Macro' : 'Create New Macro'}
          </h2>
        </div>

        <div className="p-6 space-y-4">
          {/* Basic Info */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">
              Macro Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Booking Confirmation Flow"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-1">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this macro do?"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Actions Builder - Simplified */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Actions (Drag to reorder)
            </label>
            <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-4">
              <p className="text-sm text-gray-600 text-center">
                Drag & drop action builder coming soon! 🚀
              </p>
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 font-semibold hover:bg-gray-100 rounded-lg transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave({
                id: macro?.id || '',
                name,
                description,
                actions: macro?.actions || [],
                trigger: macro?.trigger || 'manual',
              });
            }}
            className="px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold rounded-lg hover:from-pink-700 hover:to-rose-700 transition-all"
          >
            Save Macro
          </button>
        </div>
      </div>
    </div>
  );
}
