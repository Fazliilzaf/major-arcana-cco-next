import { Mail, Clock, GitBranch, Zap, AlertCircle, Repeat, Split, Merge, Database, Globe, Calculator, Bot } from 'lucide-react';

interface NodeTemplate {
  type: string;
  label: string;
  icon: any;
  color: string;
  description: string;
  category: 'triggers' | 'actions' | 'logic' | 'advanced';
}

const NODE_TEMPLATES: NodeTemplate[] = [
  // Triggers
  { type: 'trigger', label: 'E-post mottagen', icon: Mail, color: 'purple', description: 'Starta när e-post anländer', category: 'triggers' },
  { type: 'trigger', label: 'Schema', icon: Clock, color: 'purple', description: 'Kör enligt schema', category: 'triggers' },
  { type: 'trigger', label: 'Webhook', icon: Globe, color: 'purple', description: 'Extern händelse', category: 'triggers' },
  
  // Actions
  { type: 'action', label: 'Skicka e-post', icon: Mail, color: 'blue', description: 'Skicka mall-epost', category: 'actions' },
  { type: 'action', label: 'Tilldela', icon: Zap, color: 'blue', description: 'Tilldela till användare', category: 'actions' },
  { type: 'action', label: 'Tagga', icon: AlertCircle, color: 'blue', description: 'Lägg till/ta bort taggar', category: 'actions' },
  { type: 'action', label: 'Uppdatera DB', icon: Database, color: 'blue', description: 'Uppdatera databas', category: 'actions' },
  
  // Logic
  { type: 'condition', label: 'Om/Annars', icon: GitBranch, color: 'amber', description: 'Förgreningslogik', category: 'logic' },
  { type: 'wait', label: 'Vänta', icon: Clock, color: 'green', description: 'Fördröj körning', category: 'logic' },
  { type: 'loop', label: 'Loop', icon: Repeat, color: 'indigo', description: 'Upprepa åtgärder', category: 'logic' },
  { type: 'split', label: 'Dela', icon: Split, color: 'pink', description: 'Parallella vägar', category: 'logic' },
  { type: 'merge', label: 'Sammanfoga', icon: Merge, color: 'teal', description: 'Kombinera vägar', category: 'logic' },
  
  // Advanced
  { type: 'calculate', label: 'Beräkna', icon: Calculator, color: 'orange', description: 'Matematiska operationer', category: 'advanced' },
  { type: 'ai', label: 'AI-analys', icon: Bot, color: 'purple', description: 'AI-bearbetning', category: 'advanced' },
  { type: 'api', label: 'HTTP-förfrågan', icon: Globe, color: 'blue', description: 'Extern API-anrop', category: 'advanced' },
];

export function WorkflowSidebar() {
  const categories = [
    { id: 'triggers', label: '🔔 Triggers', color: 'purple' },
    { id: 'actions', label: '⚡ Åtgärder', color: 'blue' },
    { id: 'logic', label: '🔀 Logik', color: 'amber' },
    { id: 'advanced', label: '🚀 Avancerat', color: 'pink' },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2 border-b border-gray-200">
        <h3 className="text-[11px] font-bold text-gray-900">Komponentbibliotek</h3>
        <p className="text-[9px] text-gray-600 mt-0.5">Dra till canvas</p>
      </div>

      {/* Categories */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-3">
        {categories.map(category => {
          const nodes = NODE_TEMPLATES.filter(n => n.category === category.id);
          
          return (
            <div key={category.id}>
              <h4 className="text-[9px] font-bold text-gray-700 uppercase tracking-wide mb-1.5">
                {category.label}
              </h4>
              <div className="space-y-1">
                {nodes.map((node, i) => (
                  <NodeLibraryItem key={i} node={node} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Help */}
      <div className="border-t border-gray-200 p-2.5 bg-gradient-to-r from-blue-50 to-indigo-50">
        <p className="text-[9px] text-blue-900">
          💡 <strong>Tips:</strong> Klicka på en nod på canvasen för att redigera inställningar
        </p>
      </div>
    </div>
  );
}

function NodeLibraryItem({ node }: { node: NodeTemplate }) {
  const colorClasses: Record<string, { gradient: string; bg: string; border: string }> = {
    purple: { gradient: 'from-purple-500 to-pink-500', bg: 'bg-purple-50', border: 'border-purple-200' },
    blue: { gradient: 'from-blue-500 to-cyan-500', bg: 'bg-blue-50', border: 'border-blue-200' },
    amber: { gradient: 'from-amber-500 to-orange-500', bg: 'bg-amber-50', border: 'border-amber-200' },
    green: { gradient: 'from-green-500 to-emerald-500', bg: 'bg-green-50', border: 'border-green-200' },
    indigo: { gradient: 'from-indigo-500 to-purple-500', bg: 'bg-indigo-50', border: 'border-indigo-200' },
    pink: { gradient: 'from-pink-500 to-rose-500', bg: 'bg-pink-50', border: 'border-pink-200' },
    teal: { gradient: 'from-teal-500 to-cyan-500', bg: 'bg-teal-50', border: 'border-teal-200' },
    orange: { gradient: 'from-orange-500 to-red-500', bg: 'bg-orange-50', border: 'border-orange-200' },
  };

  const colors = colorClasses[node.color];

  return (
    <div
      draggable
      className={`flex items-center gap-1.5 p-1.5 rounded-md border ${colors.border} ${colors.bg} cursor-grab active:cursor-grabbing hover:shadow-md transition-all group`}
    >
      <div className={`w-7 h-7 rounded-md bg-gradient-to-br ${colors.gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
        <node.icon className="h-3.5 w-3.5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-bold text-gray-900">{node.label}</div>
        <div className="text-[8px] text-gray-600 truncate">{node.description}</div>
      </div>
    </div>
  );
}
