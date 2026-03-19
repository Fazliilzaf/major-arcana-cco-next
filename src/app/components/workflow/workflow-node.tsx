import { Mail, Clock, GitBranch, Zap, AlertCircle, Repeat, Split, Merge } from 'lucide-react';
import { WorkflowNode } from '../../pages/workflow-builder-page';

interface WorkflowNodeComponentProps {
  node: WorkflowNode;
  isSelected: boolean;
  onClick: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}

export function WorkflowNodeComponent({ 
  node, 
  isSelected, 
  onClick,
  onDelete,
  onDuplicate,
}: WorkflowNodeComponentProps) {
  const nodeStyles = {
    trigger: {
      icon: Zap,
      color: 'from-purple-500 to-pink-500',
      border: 'border-purple-300',
      bg: 'bg-purple-50',
    },
    action: {
      icon: Mail,
      color: 'from-blue-500 to-cyan-500',
      border: 'border-blue-300',
      bg: 'bg-blue-50',
    },
    condition: {
      icon: GitBranch,
      color: 'from-amber-500 to-orange-500',
      border: 'border-amber-300',
      bg: 'bg-amber-50',
    },
    wait: {
      icon: Clock,
      color: 'from-green-500 to-emerald-500',
      border: 'border-green-300',
      bg: 'bg-green-50',
    },
    loop: {
      icon: Repeat,
      color: 'from-indigo-500 to-purple-500',
      border: 'border-indigo-300',
      bg: 'bg-indigo-50',
    },
    split: {
      icon: Split,
      color: 'from-pink-500 to-rose-500',
      border: 'border-pink-300',
      bg: 'bg-pink-50',
    },
    merge: {
      icon: Merge,
      color: 'from-teal-500 to-cyan-500',
      border: 'border-teal-300',
      bg: 'bg-teal-50',
    },
  };

  const style = nodeStyles[node.type];
  const Icon = style.icon;

  return (
    <div
      className="absolute cursor-pointer group"
      style={{ left: node.position.x, top: node.position.y }}
      onClick={onClick}
    >
      <div
        className={`w-[300px] bg-white border-2 rounded-xl transition-all ${
          isSelected
            ? `${style.border} shadow-2xl scale-105 ring-4 ring-offset-2 ${style.border.replace('border-', 'ring-')}`
            : `border-gray-200 hover:${style.border} hover:shadow-lg`
        }`}
      >
        {/* Node Header */}
        <div className={`flex items-center gap-3 px-4 py-3 border-b ${style.border} ${style.bg} rounded-t-xl`}>
          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${style.color} flex items-center justify-center flex-shrink-0`}>
            <Icon className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">
              {node.type}
            </div>
            <div className="text-sm font-bold text-gray-900 truncate">
              {node.label}
            </div>
          </div>
        </div>

        {/* Node Body */}
        <div className="px-4 py-3">
          <div className="space-y-2">
            {Object.entries(node.config).slice(0, 2).map(([key, value]) => (
              <div key={key} className="flex items-start gap-2">
                <div className="text-xs text-gray-500 capitalize min-w-[80px]">{key}:</div>
                <div className="text-xs text-gray-900 font-semibold flex-1 truncate">
                  {String(value)}
                </div>
              </div>
            ))}
            {Object.keys(node.config).length > 2 && (
              <div className="text-xs text-gray-400">
                +{Object.keys(node.config).length - 2} more...
              </div>
            )}
          </div>
        </div>

        {/* Connection Point */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 border-gray-300 rounded-full group-hover:border-pink-500 group-hover:bg-pink-500 transition-all" />
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 border-gray-300 rounded-full group-hover:border-pink-500 group-hover:bg-pink-500 transition-all" />
      </div>

      {/* Quick Actions (on hover) */}
      {isSelected && (
        <div className="absolute -right-2 top-1/2 -translate-y-1/2 flex flex-col gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
            className="w-8 h-8 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all shadow-sm flex items-center justify-center"
            title="Duplicate"
          >
            <svg className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="w-8 h-8 bg-white border-2 border-gray-300 rounded-lg hover:border-red-500 hover:bg-red-50 transition-all shadow-sm flex items-center justify-center"
            title="Delete"
          >
            <svg className="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
