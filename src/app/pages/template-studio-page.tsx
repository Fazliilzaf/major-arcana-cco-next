import { useState } from 'react';
import { FileText, Plus, Trash2, Copy, BarChart3, Globe, Edit3, TrendingUp, Eye, Send } from 'lucide-react';
import { toast } from 'sonner';

interface Template {
  id: string;
  name: string;
  content: string;
  category: string;
  variables: string[];
  stats: {
    usageCount: number;
    openRate: number;
    responseRate: number;
    conversionRate: number;
  };
  languages: string[];
  versions: number;
}

const SAMPLE_TEMPLATES: Template[] = [
  {
    id: '1',
    name: 'Bokningsbekräftelse',
    content: 'Hej {{customer.name}}! 👋\n\nTack för din bokning. Din tid är bekräftad:\n\n📅 {{booking.date}}\n⏰ {{booking.time}}\n📍 {{clinic.address}}\n\nSes snart!',
    category: 'booking',
    variables: ['customer.name', 'booking.date', 'booking.time', 'clinic.address'],
    stats: {
      usageCount: 142,
      openRate: 98,
      responseRate: 45,
      conversionRate: 87,
    },
    languages: ['sv', 'en'],
    versions: 3,
  },
  {
    id: '2',
    name: 'Prissättning',
    content: 'Hej {{customer.name}}!\n\nTack för din förfrågan. Här är vår prissättning:\n\n{{#if customer.isVIP}}\n🌟 VIP-pris: {{price.vip}} kr (15% rabatt)\n{{else}}\n💰 Standardpris: {{price.standard}} kr\n{{/if}}\n\nVill du boka?\n\nMvh,\n{{agent.name}}',
    category: 'pricing',
    variables: ['customer.name', 'customer.isVIP', 'price.vip', 'price.standard', 'agent.name'],
    stats: {
      usageCount: 89,
      openRate: 94,
      responseRate: 38,
      conversionRate: 72,
    },
    languages: ['sv', 'en', 'es'],
    versions: 5,
  },
  {
    id: '3',
    name: 'Föreslå ny tid',
    content: 'Hej {{customer.name}}! 😊\n\nJag ser att den föreslagna tiden inte passade. Här är andra alternativ:\n\n{{#each available_slots}}\n• {{this.day}} {{this.time}}\n{{/each}}\n\nVilken passar bäst?',
    category: 'booking',
    variables: ['customer.name', 'available_slots'],
    stats: {
      usageCount: 67,
      openRate: 96,
      responseRate: 52,
      conversionRate: 91,
    },
    languages: ['sv'],
    versions: 2,
  },
];

export function TemplateStudioPage() {
  const [templates, setTemplates] = useState<Template[]>(SAMPLE_TEMPLATES);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="h-full flex bg-gray-50">
      {/* Template List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Template Studio</h2>
            <button
              onClick={() => {
                setIsEditing(true);
                setSelectedTemplate(null);
              }}
              className="p-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg hover:from-pink-700 hover:to-rose-700 transition-all"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <input
            type="text"
            placeholder="Search templates..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
        </div>

        {/* Templates */}
        <div className="flex-1 overflow-y-auto p-2">
          {templates.map(template => (
            <button
              key={template.id}
              onClick={() => {
                setSelectedTemplate(template);
                setIsEditing(false);
              }}
              className={`w-full text-left p-3 rounded-lg mb-2 transition-all ${
                selectedTemplate?.id === template.id
                  ? 'bg-gradient-to-r from-pink-50 to-rose-50 border-2 border-pink-300'
                  : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-sm font-bold text-gray-900">{template.name}</h3>
                <span className="text-xs text-gray-500">{template.stats.usageCount}×</span>
              </div>
              <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                {template.content}
              </p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded">
                  <TrendingUp className="h-3 w-3" />
                  <span>{template.stats.conversionRate}%</span>
                </div>
                {template.languages.length > 1 && (
                  <div className="flex items-center gap-1 text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    <Globe className="h-3 w-3" />
                    <span>{template.languages.length}</span>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Template Detail/Editor */}
      <div className="flex-1 overflow-y-auto">
        {selectedTemplate ? (
          <TemplateDetail
            template={selectedTemplate}
            onEdit={() => setIsEditing(true)}
            onDelete={() => {
              setTemplates(templates.filter(t => t.id !== selectedTemplate.id));
              setSelectedTemplate(null);
              toast.success(`Deleted: ${selectedTemplate.name}`);
            }}
            onDuplicate={() => {
              const newTemplate = {
                ...selectedTemplate,
                id: Date.now().toString(),
                name: `${selectedTemplate.name} (Copy)`,
              };
              setTemplates([...templates, newTemplate]);
              toast.success('Template duplicated!');
            }}
          />
        ) : isEditing ? (
          <TemplateEditor
            onSave={(template) => {
              setTemplates([...templates, { ...template, id: Date.now().toString() }]);
              setIsEditing(false);
              toast.success('Template created!');
            }}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-2">Select a template</h3>
              <p className="text-sm text-gray-600">or create a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TemplateDetail({ 
  template, 
  onEdit, 
  onDelete, 
  onDuplicate 
}: { 
  template: Template;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
}) {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{template.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-md capitalize">
              {template.category}
            </span>
            <span className="text-xs text-gray-500">
              Version {template.versions}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onDuplicate}
            className="p-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
            title="Duplicate"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={onEdit}
            className="p-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
            title="Edit"
          >
            <Edit3 className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 bg-white border border-gray-300 text-red-600 rounded-lg hover:bg-red-50 transition-all"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-4 gap-4">
        <AnalyticCard
          icon={Eye}
          label="Usage Count"
          value={template.stats.usageCount}
          color="blue"
        />
        <AnalyticCard
          icon={Eye}
          label="Open Rate"
          value={`${template.stats.openRate}%`}
          color="green"
        />
        <AnalyticCard
          icon={Send}
          label="Response Rate"
          value={`${template.stats.responseRate}%`}
          color="purple"
        />
        <AnalyticCard
          icon={TrendingUp}
          label="Conversion"
          value={`${template.stats.conversionRate}%`}
          color="pink"
        />
      </div>

      {/* Content Preview */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3">Template Content</h3>
        <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
          <pre className="text-sm text-gray-900 whitespace-pre-wrap font-sans">
            {template.content}
          </pre>
        </div>
      </div>

      {/* Variables */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3">Variables ({template.variables.length})</h3>
        <div className="flex flex-wrap gap-2">
          {template.variables.map((variable, i) => (
            <code
              key={i}
              className="px-3 py-1.5 bg-purple-50 border border-purple-200 text-purple-700 rounded-lg text-xs font-mono"
            >
              {`{{${variable}}}`}
            </code>
          ))}
        </div>
      </div>

      {/* Languages */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3">Languages</h3>
        <div className="flex items-center gap-2">
          {template.languages.map((lang, i) => (
            <span
              key={i}
              className="px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-xs font-semibold uppercase"
            >
              {lang}
            </span>
          ))}
          <button className="px-3 py-1.5 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-50 transition-all">
            + Add Translation
          </button>
        </div>
      </div>
    </div>
  );
}

function TemplateEditor({ 
  onSave, 
  onCancel 
}: { 
  onSave: (template: Omit<Template, 'id'>) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState('');
  const [content, setContent] = useState('');

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Create Template</h1>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Template Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Bokningsbekräftelse"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Use {{variable}} for dynamic content..."
          rows={12}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            onSave({
              name,
              content,
              category: 'general',
              variables: [],
              stats: { usageCount: 0, openRate: 0, responseRate: 0, conversionRate: 0 },
              languages: ['sv'],
              versions: 1,
            });
          }}
          className="px-6 py-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg font-semibold hover:from-pink-700 hover:to-rose-700 transition-all"
        >
          Save Template
        </button>
        <button
          onClick={onCancel}
          className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function AnalyticCard({ 
  icon: Icon, 
  label, 
  value, 
  color 
}: { 
  icon: any;
  label: string;
  value: string | number;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-green-500 to-emerald-500',
    purple: 'from-purple-500 to-pink-500',
    pink: 'from-pink-500 to-rose-500',
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center mb-3`}>
        <Icon className="h-4 w-4 text-white" />
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-xs text-gray-600">{label}</div>
    </div>
  );
}
