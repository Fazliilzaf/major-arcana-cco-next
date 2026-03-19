import { useState } from 'react';
import { Flame, DollarSign, AlertTriangle, Target, Users, Plus, Edit3, Trash2, Eye, EyeOff, Star } from 'lucide-react';
import { toast } from 'sonner';

export interface SavedView {
  id: string;
  name: string;
  icon: any;
  color: string;
  filters: ViewFilter[];
  count?: number;
  isDefault?: boolean;
  shortcut?: string;
}

export interface ViewFilter {
  field: string;
  operator: string;
  value: any;
}

interface SavedViewsPanelProps {
  activeViewId: string | null;
  onSelectView: (view: SavedView) => void;
}

const DEFAULT_VIEWS: SavedView[] = [
  {
    id: 'sprint-queue',
    name: 'My Sprint Queue',
    icon: Flame,
    color: 'from-red-500 to-orange-500',
    filters: [
      { field: 'sla', operator: '<', value: '1h' },
      { field: 'assignedTo', operator: '=', value: 'me' }
    ],
    count: 12,
    isDefault: true,
    shortcut: '⌘1'
  },
  {
    id: 'high-value',
    name: 'High-Value Leads',
    icon: DollarSign,
    color: 'from-purple-500 to-pink-500',
    filters: [
      { field: 'ltv', operator: '>', value: 50000 },
      { field: 'stage', operator: '=', value: 'lead' }
    ],
    count: 8,
    shortcut: '⌘2'
  },
  {
    id: 'churn-risk',
    name: 'Churn Risk',
    icon: AlertTriangle,
    color: 'from-orange-500 to-red-500',
    filters: [
      { field: 'churnRisk', operator: '=', value: 'high' },
      { field: 'lastContact', operator: '>', value: '14d' }
    ],
    count: 5,
    shortcut: '⌘3'
  },
  {
    id: 'upsell',
    name: 'Upsell Opportunities',
    icon: Target,
    color: 'from-green-500 to-emerald-500',
    filters: [
      { field: 'upsellOpportunity', operator: 'exists', value: true }
    ],
    count: 15,
    shortcut: '⌘4'
  },
  {
    id: 'unassigned',
    name: 'Team Overview',
    icon: Users,
    color: 'from-blue-500 to-indigo-500',
    filters: [
      { field: 'status', operator: 'in', value: ['unassigned', 'overdue'] }
    ],
    count: 23,
    shortcut: '⌘5'
  },
];

export function SavedViewsPanel({ activeViewId, onSelectView }: SavedViewsPanelProps) {
  const [views, setViews] = useState<SavedView[]>(DEFAULT_VIEWS);
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Saved Views</h3>
        <button
          onClick={() => setIsCreating(true)}
          className="p-1 rounded hover:bg-gray-100 transition-colors"
          title="Create new view"
        >
          <Plus className="h-3.5 w-3.5 text-gray-500" />
        </button>
      </div>

      {/* Views List */}
      <div className="space-y-1">
        {views.map((view) => (
          <SavedViewItem
            key={view.id}
            view={view}
            isActive={activeViewId === view.id}
            onClick={() => onSelectView(view)}
            onEdit={() => toast.info(`Edit: ${view.name}`)}
            onDelete={() => {
              setViews(views.filter(v => v.id !== view.id));
              toast.success(`Deleted: ${view.name}`);
            }}
          />
        ))}
      </div>

      {/* Create View Modal - Simplified */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Create Saved View</h3>
            <p className="text-sm text-gray-600 mb-4">
              Create custom filters to save time. Coming soon!
            </p>
            <button
              onClick={() => setIsCreating(false)}
              className="w-full px-4 py-2 bg-pink-600 text-white rounded-lg font-semibold hover:bg-pink-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SavedViewItem({
  view,
  isActive,
  onClick,
  onEdit,
  onDelete,
}: {
  view: SavedView;
  isActive: boolean;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      className="group relative"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <button
        onClick={onClick}
        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all ${
          isActive
            ? 'bg-gradient-to-r ' + view.color + ' text-white shadow-lg scale-[1.02]'
            : 'hover:bg-gray-100 text-gray-700'
        }`}
      >
        {/* Icon */}
        <div className={`flex items-center justify-center w-7 h-7 rounded-lg ${
          isActive ? 'bg-white/20' : 'bg-gray-100'
        }`}>
          <view.icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-gray-600'}`} />
        </div>

        {/* Content */}
        <div className="flex-1 text-left min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold truncate">{view.name}</span>
            {view.isDefault && !isActive && (
              <Star className="h-3 w-3 text-amber-500 fill-amber-500 flex-shrink-0" />
            )}
          </div>
          <p className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
            {view.count || 0} conversations
          </p>
        </div>

        {/* Shortcut */}
        {view.shortcut && (
          <kbd className={`px-1.5 py-0.5 text-[10px] font-semibold rounded ${
            isActive
              ? 'bg-white/20 text-white border border-white/30'
              : 'bg-gray-100 text-gray-600 border border-gray-300'
          }`}>
            {view.shortcut}
          </kbd>
        )}
      </button>

      {/* Actions (on hover) */}
      {showActions && !isActive && !view.isDefault && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-white rounded-lg shadow-lg border border-gray-200 px-1 py-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-1 rounded hover:bg-gray-100 transition-colors"
            title="Edit view"
          >
            <Edit3 className="h-3 w-3 text-gray-600" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 rounded hover:bg-red-50 transition-colors"
            title="Delete view"
          >
            <Trash2 className="h-3 w-3 text-red-600" />
          </button>
        </div>
      )}
    </div>
  );
}
