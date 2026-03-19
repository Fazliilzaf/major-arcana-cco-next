import { useState, useEffect } from 'react';
import { Play, Save, Upload, Download, GitBranch, Users, BarChart3, TestTube, Sparkles, Zap, Check } from 'lucide-react';
import { WorkflowCanvas } from '../components/workflow/workflow-canvas';
import { WorkflowSidebar } from '../components/workflow/workflow-sidebar';
import { WorkflowAnalytics } from '../components/workflow/workflow-analytics';
import { WorkflowTemplates } from '../components/workflow/workflow-templates';
import { WorkflowTesting } from '../components/workflow/workflow-testing';
import { WorkflowVersions } from '../components/workflow/workflow-versions';
import { WorkflowCollaboration } from '../components/workflow/workflow-collaboration';
import { WorkflowAutopilot } from '../components/workflow/workflow-autopilot';
import { AISuggestions } from '../components/workflow/ai-suggestions';
import { toast } from 'sonner';

export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'wait' | 'loop' | 'split' | 'merge';
  label: string;
  config: any;
  position: { x: number; y: number };
  connections: string[];
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  version: string;
  nodes: WorkflowNode[];
  isActive: boolean;
  stats?: {
    executions: number;
    successRate: number;
    avgDuration: number;
  };
}

export function WorkflowBuilderPage() {
  const [activeTab, setActiveTab] = useState<'canvas' | 'analytics' | 'templates' | 'testing' | 'versions' | 'autopilot'>('canvas');
  const [workflow, setWorkflow] = useState<Workflow>({
    id: '1',
    name: 'VIP Onboarding Sequence',
    description: 'Automated onboarding for VIP customers',
    version: 'v3.0',
    nodes: [],
    isActive: true,
    stats: {
      executions: 847,
      successRate: 94.3,
      avgDuration: 12.3,
    },
  });
  
  const [showAISuggestions, setShowAISuggestions] = useState(true);
  const [showCollaboration, setShowCollaboration] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());
  const [isSaving, setIsSaving] = useState(false);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsSaving(true);
      setTimeout(() => {
        setIsSaving(false);
        setLastSaved(new Date());
      }, 500);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getTimeSinceLastSave = () => {
    const seconds = Math.floor((Date.now() - lastSaved.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ago`;
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setLastSaved(new Date());
      toast.success('💾 Workflow saved!');
    }, 500);
  };

  const handleRun = () => {
    toast.success('▶️ Workflow started!');
  };

  const handleExport = () => {
    toast.success('📤 Workflow exported!');
  };

  const tabs = [
    { id: 'canvas' as const, label: 'Builder', icon: Zap },
    { id: 'analytics' as const, label: 'Analys', icon: BarChart3 },
    { id: 'templates' as const, label: 'Mallar', icon: Upload },
    { id: 'testing' as const, label: 'Testning', icon: TestTube },
    { id: 'versions' as const, label: 'Versioner', icon: GitBranch },
    { id: 'autopilot' as const, label: 'Autopilot', icon: Sparkles },
  ];

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-950">
      {/* Header - ULTRA KOMPAKT */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-3 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-[14px] font-bold text-gray-900 dark:text-gray-100">{workflow.name}</h1>
                {/* Auto-save indicator */}
                <div className="flex items-center gap-1.5 text-[8px]">
                  {isSaving ? (
                    <span className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                      Sparar...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                      <Check className="h-2.5 w-2.5 text-green-600" />
                      Sparad {getTimeSinceLastSave()}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[8px] text-gray-600 dark:text-gray-400">{workflow.version}</span>
                <span className="text-[8px] text-gray-400 dark:text-gray-600">•</span>
                <span className={`text-[8px] font-semibold ${workflow.isActive ? 'text-green-600' : 'text-gray-600 dark:text-gray-400'}`}>
                  {workflow.isActive ? '● Aktiv' : '○ Inaktiv'}
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowCollaboration(!showCollaboration)}
              className="flex items-center gap-1 px-2 py-1 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 rounded-md text-[9px] font-semibold hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-all"
            >
              <Users className="h-2.5 w-2.5" />
              <span>3 redigerare</span>
            </button>
          </div>

          {/* Actions - ULTRA KOMPAKT */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleRun}
              className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-md font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-sm text-[9px]"
            >
              <Play className="h-3 w-3" />
              Testkör
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-md font-semibold hover:from-pink-700 hover:to-rose-700 transition-all shadow-sm text-[9px]"
            >
              <Save className="h-3 w-3" />
              Spara
            </button>
            <button
              onClick={handleExport}
              className="p-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
              title="Exportera arbetsflöde"
            >
              <Download className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Tabs - ULTRA KOMPAKT */}
        <div className="flex items-center gap-0.5 mt-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-[9px] font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <tab.icon className="h-2.5 w-2.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'canvas' && (
            <div className="h-full flex">
              <WorkflowSidebar />
              <WorkflowCanvas workflow={workflow} onUpdate={setWorkflow} />
            </div>
          )}
          {activeTab === 'analytics' && <WorkflowAnalytics workflow={workflow} />}
          {activeTab === 'templates' && <WorkflowTemplates />}
          {activeTab === 'testing' && <WorkflowTesting workflow={workflow} />}
          {activeTab === 'versions' && <WorkflowVersions workflow={workflow} />}
          {activeTab === 'autopilot' && <WorkflowAutopilot workflow={workflow} />}
        </div>

        {/* AI Suggestions Panel (Canvas only) */}
        {activeTab === 'canvas' && showAISuggestions && (
          <AISuggestions
            workflow={workflow}
            onClose={() => setShowAISuggestions(false)}
            onApplySuggestion={(suggestion) => {
              toast.success(`✨ Applied: ${suggestion}`);
            }}
          />
        )}
      </div>

      {/* Collaboration Panel */}
      {showCollaboration && (
        <WorkflowCollaboration
          workflowId={workflow.id}
          onClose={() => setShowCollaboration(false)}
        />
      )}
    </div>
  );
}