import { useState, useRef } from 'react';
import { Plus, Trash2, Copy, Settings } from 'lucide-react';
import { Workflow, WorkflowNode } from '../../pages/workflow-builder-page';
import { WorkflowNodeComponent } from './workflow-node';
import { toast } from 'sonner';

interface WorkflowCanvasProps {
  workflow: Workflow;
  onUpdate: (workflow: Workflow) => void;
}

export function WorkflowCanvas({ workflow, onUpdate }: WorkflowCanvasProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Sample nodes for demo
  const sampleNodes: WorkflowNode[] = [
    {
      id: '1',
      type: 'trigger',
      label: 'New VIP Customer',
      config: { event: 'customer.created', filter: 'isVIP = true' },
      position: { x: 100, y: 100 },
      connections: ['2'],
    },
    {
      id: '2',
      type: 'action',
      label: 'Send Welcome Email',
      config: { template: 'vip-welcome', to: '{{customer.email}}' },
      position: { x: 100, y: 250 },
      connections: ['3'],
    },
    {
      id: '3',
      type: 'action',
      label: 'Assign to Senior',
      config: { assignTo: 'senior-specialist' },
      position: { x: 100, y: 400 },
      connections: ['4'],
    },
    {
      id: '4',
      type: 'wait',
      label: 'Wait 3 Days',
      config: { duration: '3d' },
      position: { x: 100, y: 550 },
      connections: ['5'],
    },
    {
      id: '5',
      type: 'condition',
      label: 'Check Engagement',
      config: { condition: 'email.opened = true' },
      position: { x: 100, y: 700 },
      connections: ['6', '7'],
    },
    {
      id: '6',
      type: 'action',
      label: 'Send Product Tour',
      config: { template: 'product-tour' },
      position: { x: -100, y: 850 },
      connections: [],
    },
    {
      id: '7',
      type: 'action',
      label: 'Follow-up Reminder',
      config: { template: 'vip-reminder' },
      position: { x: 300, y: 850 },
      connections: [],
    },
  ];

  const nodes = workflow.nodes.length > 0 ? workflow.nodes : sampleNodes;

  const handleAddNode = () => {
    toast.info('🎨 Drag a node from the sidebar');
  };

  const handleDeleteNode = (nodeId: string) => {
    toast.success('🗑️ Node deleted');
  };

  const handleDuplicateNode = (nodeId: string) => {
    toast.success('📋 Node duplicated');
  };

  return (
    <div className="flex-1 relative bg-gray-50 overflow-hidden">
      {/* Canvas Controls */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoom(Math.max(50, zoom - 10))}
              className="px-2 py-1 text-gray-700 hover:bg-gray-100 rounded font-semibold"
            >
              −
            </button>
            <span className="text-sm font-semibold text-gray-700 w-12 text-center">{zoom}%</span>
            <button
              onClick={() => setZoom(Math.min(200, zoom + 10))}
              className="px-2 py-1 text-gray-700 hover:bg-gray-100 rounded font-semibold"
            >
              +
            </button>
          </div>
        </div>
        <button
          onClick={handleAddNode}
          className="p-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg hover:from-pink-700 hover:to-rose-700 transition-all shadow-sm"
          title="Add node"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Grid Background */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `
          linear-gradient(to right, #e5e7eb 1px, transparent 1px),
          linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
      }} />

      {/* Canvas */}
      <div
        ref={canvasRef}
        className="absolute inset-0 overflow-auto"
        style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left' }}
      >
        <div className="relative" style={{ width: '2000px', height: '2000px' }}>
          {/* Connection Lines */}
          <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
            {nodes.map(node => 
              node.connections.map(targetId => {
                const target = nodes.find(n => n.id === targetId);
                if (!target) return null;

                const startX = node.position.x + 150;
                const startY = node.position.y + 50;
                const endX = target.position.x + 150;
                const endY = target.position.y;

                const midY = (startY + endY) / 2;

                return (
                  <g key={`${node.id}-${targetId}`}>
                    <path
                      d={`M ${startX} ${startY} L ${startX} ${midY} L ${endX} ${midY} L ${endX} ${endY}`}
                      stroke={node.type === 'condition' ? '#f59e0b' : '#ec4899'}
                      strokeWidth="2"
                      fill="none"
                      strokeDasharray={node.type === 'condition' ? '5,5' : '0'}
                    />
                    {/* Arrow */}
                    <polygon
                      points={`${endX},${endY} ${endX - 5},${endY - 8} ${endX + 5},${endY - 8}`}
                      fill={node.type === 'condition' ? '#f59e0b' : '#ec4899'}
                    />
                  </g>
                );
              })
            )}
          </svg>

          {/* Nodes */}
          {nodes.map(node => (
            <WorkflowNodeComponent
              key={node.id}
              node={node}
              isSelected={selectedNode === node.id}
              onClick={() => setSelectedNode(node.id)}
              onDelete={() => handleDeleteNode(node.id)}
              onDuplicate={() => handleDuplicateNode(node.id)}
            />
          ))}
        </div>
      </div>

      {/* Node Inspector (when selected) */}
      {selectedNode && (
        <div className="absolute bottom-4 right-4 w-80 bg-white border-2 border-gray-200 rounded-xl shadow-2xl z-20 animate-in slide-in-from-right-4 duration-300">
          <div className="border-b border-gray-200 px-4 py-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900">Node Settings</h3>
            <button
              onClick={() => setSelectedNode(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          <div className="p-4">
            {(() => {
              const node = nodes.find(n => n.id === selectedNode);
              if (!node) return null;

              return (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Node Type
                    </label>
                    <div className="px-3 py-2 bg-gray-100 rounded-lg text-sm font-semibold text-gray-900 capitalize">
                      {node.type}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Label
                    </label>
                    <input
                      type="text"
                      value={node.label}
                      onChange={() => {}}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Configuration
                    </label>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <pre className="text-xs text-gray-700 font-mono">
                        {JSON.stringify(node.config, null, 2)}
                      </pre>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Empty State */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Börja bygga ditt arbetsflöde</h3>
            <p className="text-sm text-gray-600">Dra noder från sidofältet för att komma igång</p>
          </div>
        </div>
      )}
    </div>
  );
}