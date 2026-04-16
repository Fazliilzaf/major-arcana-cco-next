import { Calendar, CreditCard, Phone, BarChart3, MessageCircle, Zap, Check, Plus, Settings } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { IntegrationConfigModal } from '../components/integration-config-modal';

interface Integration {
  id: string;
  name: string;
  description: string;
  icon: any;
  category: 'calendar' | 'payment' | 'communication' | 'analytics' | 'automation';
  isConnected: boolean;
  features: string[];
  logo?: string;
}

const INTEGRATIONS: Integration[] = [
  {
    id: 'calendly',
    name: 'Calendly',
    description: '1-click booking directly in conversations',
    icon: Calendar,
    category: 'calendar',
    isConnected: true,
    features: ['Auto-sync availability', 'Embed booking links', 'Calendar sync'],
  },
  {
    id: 'stripe',
    name: 'Stripe',
    description: 'Send payment links and track transactions',
    icon: CreditCard,
    category: 'payment',
    isConnected: true,
    features: ['Payment links', 'Invoice generation', 'Revenue tracking'],
  },
  {
    id: 'twilio',
    name: 'Twilio',
    description: 'SMS and voice calls from conversations',
    icon: Phone,
    category: 'communication',
    isConnected: false,
    features: ['Send SMS', 'Make calls', 'Phone number masking'],
  },
  {
    id: 'slack',
    name: 'Slack',
    description: 'Team notifications and quick actions',
    icon: MessageCircle,
    category: 'communication',
    isConnected: true,
    features: ['Conversation alerts', 'Reply from Slack', 'Team mentions'],
  },
  {
    id: 'looker',
    name: 'Looker',
    description: 'Advanced analytics and custom dashboards',
    icon: BarChart3,
    category: 'analytics',
    isConnected: false,
    features: ['Custom reports', 'Embedded dashboards', 'Data export'],
  },
  {
    id: 'zapier',
    name: 'Zapier',
    description: 'Connect to 1000+ apps with workflows',
    icon: Zap,
    category: 'automation',
    isConnected: false,
    features: ['Custom workflows', '1000+ app integrations', 'Automated actions'],
  },
];

export function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>(INTEGRATIONS);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'Alla', icon: Zap },
    { id: 'calendar', label: 'Kalender', icon: Calendar },
    { id: 'payment', label: 'Betalning', icon: CreditCard },
    { id: 'communication', label: 'Kommunikation', icon: MessageCircle },
    { id: 'analytics', label: 'Analys', icon: BarChart3 },
    { id: 'automation', label: 'Automatisering', icon: Zap },
  ];

  const filteredIntegrations = selectedCategory && selectedCategory !== 'all'
    ? integrations.filter(i => i.category === selectedCategory)
    : integrations;

  const connectedCount = integrations.filter(i => i.isConnected).length;

  const handleToggleConnection = (id: string) => {
    setIntegrations(integrations.map(i => {
      if (i.id === id) {
        const newStatus = !i.isConnected;
        toast.success(newStatus ? `✅ Ansluten till ${i.name}` : `Frånkopplad från ${i.name}`);
        return { ...i, isConnected: newStatus };
      }
      return i;
    }));
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto p-3 space-y-3">
        {/* Header - ULTRA KOMPAKT */}
        <div>
          <h1 className="text-[14px] font-bold text-gray-900 dark:text-gray-100">Integrationer</h1>
          <p className="text-[9px] text-gray-600 dark:text-gray-400 mt-0.5">
            Anslut CCO till dina favoritverktyg • {connectedCount} anslutna
          </p>
        </div>

        {/* Category Filter - ULTRA KOMPAKT */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id === 'all' ? null : category.id)}
              className={`flex items-center gap-1 px-2 py-1 rounded-md font-semibold text-[9px] whitespace-nowrap transition-all ${
                (category.id === 'all' && !selectedCategory) || selectedCategory === category.id
                  ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-sm'
                  : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-pink-300'
              }`}
            >
              <category.icon className="h-2.5 w-2.5" />
              {category.label}
            </button>
          ))}
        </div>

        {/* Integrations Grid - ULTRA KOMPAKT */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {filteredIntegrations.map(integration => (
            <IntegrationCard
              key={integration.id}
              integration={integration}
              onToggle={() => handleToggleConnection(integration.id)}
            />
          ))}
        </div>

        {/* Custom Integration CTA - ULTRA KOMPAKT */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border border-purple-200 dark:border-purple-800 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
              <Zap className="h-3.5 w-3.5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-[11px] font-bold text-gray-900 dark:text-gray-100 mb-1">Behöver du en anpassad integration?</h3>
              <p className="text-[9px] text-gray-700 dark:text-gray-300 mb-2">
                Använd vårt Webhook API eller kontakta oss för enterpriseintegrationer
              </p>
              <div className="flex items-center gap-1.5">
                <button className="px-2 py-1 bg-white dark:bg-gray-900 border border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 rounded-md font-semibold hover:bg-purple-50 dark:hover:bg-purple-950 transition-all text-[9px]">
                  Visa API-docs
                </button>
                <button className="px-2 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md font-semibold hover:from-purple-700 hover:to-pink-700 transition-all text-[9px]">
                  Kontakta försäljning
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function IntegrationCard({ 
  integration, 
  onToggle 
}: { 
  integration: Integration;
  onToggle: () => void;
}) {
  const [showConfig, setShowConfig] = useState(false);

  return (
    <div className={`bg-white dark:bg-gray-900 rounded-lg border transition-all ${
      integration.isConnected
        ? 'border-green-300 dark:border-green-700 shadow-sm'
        : 'border-gray-200 dark:border-gray-800 hover:border-pink-300'
    }`}>
      <div className="p-2.5">
        {/* Header - ULTRA KOMPAKT */}
        <div className="flex items-start gap-2 mb-2">
          <div className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 ${
            integration.isConnected
              ? 'bg-gradient-to-br from-green-500 to-emerald-500'
              : 'bg-gray-100 dark:bg-gray-800'
          }`}>
            <integration.icon className={`h-3.5 w-3.5 ${
              integration.isConnected ? 'text-white' : 'text-gray-600 dark:text-gray-400'
            }`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[10px] font-bold text-gray-900 dark:text-gray-100">{integration.name}</h3>
            <p className="text-[8px] text-gray-600 dark:text-gray-400 mt-0.5">{integration.description}</p>
          </div>
          {integration.isConnected && (
            <div className="flex items-center justify-center w-4 h-4 rounded-full bg-green-100 dark:bg-green-900">
              <Check className="h-2.5 w-2.5 text-green-700 dark:text-green-300" />
            </div>
          )}
        </div>

        {/* Features - ULTRA KOMPAKT */}
        <div className="space-y-1 mb-2">
          {integration.features.slice(0, 3).map((feature, i) => (
            <div key={i} className="flex items-center gap-1.5 text-[8px] text-gray-600 dark:text-gray-400">
              <div className="w-0.5 h-0.5 rounded-full bg-gray-400" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        {/* Actions - ULTRA KOMPAKT */}
        <div className="flex items-center gap-1">
          <button
            onClick={onToggle}
            className={`flex-1 px-2 py-1 rounded-md font-semibold text-[9px] transition-all ${
              integration.isConnected
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                : 'bg-gradient-to-r from-pink-600 to-rose-600 text-white hover:from-pink-700 hover:to-rose-700 shadow-sm'
            }`}
          >
            {integration.isConnected ? 'Koppla från' : 'Anslut'}
          </button>
          {integration.isConnected && (
            <button
              onClick={() => setShowConfig(true)}
              className="p-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
              title="Konfigurera"
            >
              <Settings className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Config Modal */}
      {showConfig && (
        <IntegrationConfigModal
          integration={integration}
          onClose={() => setShowConfig(false)}
          onDisconnect={onToggle}
        />
      )}
    </div>
  );
}
