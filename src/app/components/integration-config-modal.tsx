import {
  X,
  Link2,
  Settings as SettingsIcon,
  RefreshCw,
  Activity,
  Eye,
  EyeOff,
  Copy,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Trash2,
  PlayCircle,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

type IntegrationId =
  | 'calendly'
  | 'stripe'
  | 'twilio'
  | 'slack'
  | 'looker'
  | 'zapier'
  | string;

interface IntegrationSummary {
  id: IntegrationId;
  name: string;
  description: string;
  icon: any;
  isConnected: boolean;
}

interface IntegrationConfigModalProps {
  integration: IntegrationSummary;
  onClose: () => void;
  onDisconnect?: () => void;
}

type TabId = 'connection' | 'settings' | 'sync' | 'activity';

interface CredentialField {
  key: string;
  label: string;
  placeholder: string;
  type: 'text' | 'secret' | 'url';
  helper?: string;
}

interface SettingField {
  key: string;
  label: string;
  helper?: string;
  type: 'text' | 'select' | 'toggle' | 'number';
  options?: { value: string; label: string }[];
  defaultValue?: string | number | boolean;
}

interface IntegrationBlueprint {
  credentials: CredentialField[];
  settings: SettingField[];
  docsUrl: string;
  webhookUrl?: string;
  syncLabel: string;
  activity: { id: string; title: string; meta: string; status: 'success' | 'warning' | 'error' }[];
}

const BLUEPRINTS: Record<string, IntegrationBlueprint> = {
  calendly: {
    docsUrl: 'https://developer.calendly.com/',
    webhookUrl: 'https://cco.hairtp.se/api/webhooks/calendly',
    syncLabel: 'Tillgänglighet och bokningar',
    credentials: [
      {
        key: 'personalAccessToken',
        label: 'Personal Access Token',
        placeholder: 'eyJraWQiOiIxYz...',
        type: 'secret',
        helper: 'Hämtas från Calendly → Integrations → API & Webhooks.',
      },
      {
        key: 'organizationUri',
        label: 'Organization URI',
        placeholder: 'https://api.calendly.com/organizations/AAAA',
        type: 'url',
      },
    ],
    settings: [
      {
        key: 'defaultEventType',
        label: 'Standard-bokningstyp',
        type: 'select',
        options: [
          { value: 'consultation-30', label: 'Konsultation (30 min)' },
          { value: 'consultation-60', label: 'Konsultation (60 min)' },
          { value: 'follow-up-15', label: 'Uppföljning (15 min)' },
        ],
        defaultValue: 'consultation-30',
      },
      {
        key: 'autoInsertBookingLink',
        label: 'Infoga bokningslänk automatiskt',
        type: 'toggle',
        defaultValue: true,
        helper: 'AI-copilot föreslår länk när kund vill boka.',
      },
      {
        key: 'reminderHours',
        label: 'Påminnelse före möte (timmar)',
        type: 'number',
        defaultValue: 24,
      },
    ],
    activity: [
      { id: '1', title: 'Synkade 47 möten', meta: 'för 5 min sedan', status: 'success' },
      { id: '2', title: 'Ny bokning: Anna Svensson', meta: 'för 1 tim sedan', status: 'success' },
      { id: '3', title: 'Webhook mottagen: invitee.created', meta: 'för 2 tim sedan', status: 'success' },
    ],
  },
  stripe: {
    docsUrl: 'https://stripe.com/docs/api',
    webhookUrl: 'https://cco.hairtp.se/api/webhooks/stripe',
    syncLabel: 'Betalningar och fakturor',
    credentials: [
      {
        key: 'publishableKey',
        label: 'Publishable key',
        placeholder: 'pk_live_...',
        type: 'text',
      },
      {
        key: 'secretKey',
        label: 'Secret key',
        placeholder: 'sk_live_...',
        type: 'secret',
        helper: 'Lagras krypterat. Används endast på servern.',
      },
      {
        key: 'webhookSecret',
        label: 'Webhook signing secret',
        placeholder: 'whsec_...',
        type: 'secret',
      },
    ],
    settings: [
      {
        key: 'defaultCurrency',
        label: 'Standardvaluta',
        type: 'select',
        options: [
          { value: 'sek', label: 'SEK - Svensk krona' },
          { value: 'eur', label: 'EUR - Euro' },
          { value: 'usd', label: 'USD - US Dollar' },
        ],
        defaultValue: 'sek',
      },
      {
        key: 'autoSendReceipts',
        label: 'Skicka kvitton automatiskt',
        type: 'toggle',
        defaultValue: true,
      },
      {
        key: 'testMode',
        label: 'Testläge',
        type: 'toggle',
        defaultValue: false,
        helper: 'Använder test-nycklar istället för live.',
      },
    ],
    activity: [
      { id: '1', title: 'Betalning mottagen: 2 495 kr', meta: 'för 12 min sedan', status: 'success' },
      { id: '2', title: 'Faktura skickad till Marcus Berg', meta: 'för 34 min sedan', status: 'success' },
      { id: '3', title: 'Webhook retry: payment_intent.succeeded', meta: 'igår 16:42', status: 'warning' },
    ],
  },
  twilio: {
    docsUrl: 'https://www.twilio.com/docs',
    webhookUrl: 'https://cco.hairtp.se/api/webhooks/twilio',
    syncLabel: 'SMS och samtalslogg',
    credentials: [
      {
        key: 'accountSid',
        label: 'Account SID',
        placeholder: 'ACxxxxxxxxxxxxxxxx',
        type: 'text',
      },
      {
        key: 'authToken',
        label: 'Auth Token',
        placeholder: '•••••••••••••••',
        type: 'secret',
      },
      {
        key: 'fromNumber',
        label: 'Avsändarnummer',
        placeholder: '+46701234567',
        type: 'text',
        helper: 'Twilio-nummer som används för utgående SMS.',
      },
    ],
    settings: [
      {
        key: 'maskCallerId',
        label: 'Maska kundens nummer för agenter',
        type: 'toggle',
        defaultValue: true,
      },
      {
        key: 'smsSignature',
        label: 'SMS-signatur',
        type: 'text',
        defaultValue: '- HairTP Clinic',
      },
      {
        key: 'dailyLimit',
        label: 'Daglig SMS-gräns per kund',
        type: 'number',
        defaultValue: 3,
      },
    ],
    activity: [],
  },
  slack: {
    docsUrl: 'https://api.slack.com/',
    webhookUrl: 'https://cco.hairtp.se/api/webhooks/slack',
    syncLabel: 'Notifieringar och kommandon',
    credentials: [
      {
        key: 'workspace',
        label: 'Workspace',
        placeholder: 'hairtp.slack.com',
        type: 'text',
      },
      {
        key: 'botToken',
        label: 'Bot User OAuth Token',
        placeholder: 'xoxb-...',
        type: 'secret',
      },
    ],
    settings: [
      {
        key: 'defaultChannel',
        label: 'Standardkanal för aviseringar',
        type: 'select',
        options: [
          { value: 'cco-inbox', label: '#cco-inbox' },
          { value: 'cco-urgent', label: '#cco-urgent' },
          { value: 'cco-bookings', label: '#cco-bookings' },
        ],
        defaultValue: 'cco-inbox',
      },
      {
        key: 'notifyUnassigned',
        label: 'Avisera vid otilldelade konversationer',
        type: 'toggle',
        defaultValue: true,
      },
      {
        key: 'notifyUrgent',
        label: 'Avisera vid hög prioritet',
        type: 'toggle',
        defaultValue: true,
      },
      {
        key: 'quietHours',
        label: 'Tyst tid',
        type: 'select',
        options: [
          { value: 'off', label: 'Av' },
          { value: 'nights', label: '22:00 - 07:00' },
          { value: 'weekends', label: 'Helger' },
        ],
        defaultValue: 'nights',
      },
    ],
    activity: [
      { id: '1', title: 'Notis skickad till #cco-urgent', meta: 'för 3 min sedan', status: 'success' },
      { id: '2', title: '/cco reply använt av @lisa', meta: 'för 18 min sedan', status: 'success' },
    ],
  },
  looker: {
    docsUrl: 'https://cloud.google.com/looker/docs',
    syncLabel: 'Dashboards och rapporter',
    credentials: [
      {
        key: 'instanceUrl',
        label: 'Instance URL',
        placeholder: 'https://hairtp.cloud.looker.com',
        type: 'url',
      },
      {
        key: 'clientId',
        label: 'Client ID',
        placeholder: 'xxxxxxxxxxxx',
        type: 'text',
      },
      {
        key: 'clientSecret',
        label: 'Client Secret',
        placeholder: '••••••••',
        type: 'secret',
      },
    ],
    settings: [
      {
        key: 'defaultDashboard',
        label: 'Standarddashboard',
        type: 'text',
        defaultValue: 'CCO Overview',
      },
      {
        key: 'embedInApp',
        label: 'Bädda in dashboards i CCO',
        type: 'toggle',
        defaultValue: true,
      },
    ],
    activity: [],
  },
  zapier: {
    docsUrl: 'https://zapier.com/developer',
    webhookUrl: 'https://cco.hairtp.se/api/webhooks/zapier',
    syncLabel: 'Triggers och actions',
    credentials: [
      {
        key: 'apiKey',
        label: 'Zapier API-nyckel',
        placeholder: 'zap_live_...',
        type: 'secret',
      },
    ],
    settings: [
      {
        key: 'enabledTriggers',
        label: 'Aktiverade triggers',
        type: 'select',
        options: [
          { value: 'all', label: 'Alla events' },
          { value: 'urgent', label: 'Endast hög prioritet' },
          { value: 'custom', label: 'Anpassade (se regler)' },
        ],
        defaultValue: 'urgent',
      },
      {
        key: 'retryFailed',
        label: 'Försök igen vid fel',
        type: 'toggle',
        defaultValue: true,
      },
    ],
    activity: [
      { id: '1', title: '12 zaps körda idag', meta: 'senaste 24h', status: 'success' },
      { id: '2', title: 'Zap failed: "Nytt lead → HubSpot"', meta: 'igår 14:01', status: 'error' },
    ],
  },
};

const DEFAULT_BLUEPRINT: IntegrationBlueprint = {
  docsUrl: '#',
  syncLabel: 'Data',
  credentials: [
    {
      key: 'apiKey',
      label: 'API-nyckel',
      placeholder: '••••••••',
      type: 'secret',
    },
  ],
  settings: [],
  activity: [],
};

function StatusDot({ connected }: { connected: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] font-semibold ${
        connected
          ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
          : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
      }`}
    >
      <span className={`w-1 h-1 rounded-full ${connected ? 'bg-green-500' : 'bg-gray-400'}`} />
      {connected ? 'Aktiv' : 'Ej ansluten'}
    </span>
  );
}

export function IntegrationConfigModal({
  integration,
  onClose,
  onDisconnect,
}: IntegrationConfigModalProps) {
  const blueprint = BLUEPRINTS[integration.id] ?? DEFAULT_BLUEPRINT;

  const [activeTab, setActiveTab] = useState<TabId>('connection');
  const [credentials, setCredentials] = useState<Record<string, string>>(() =>
    Object.fromEntries(blueprint.credentials.map((c) => [c.key, '']))
  );
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [settingsState, setSettingsState] = useState<Record<string, string | number | boolean>>(() =>
    Object.fromEntries(
      blueprint.settings.map((s) => [s.key, s.defaultValue ?? (s.type === 'toggle' ? false : '')])
    )
  );
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'ok' | 'fail' | null>(null);
  const [lastSync, setLastSync] = useState<string>('för 5 min sedan');
  const [syncing, setSyncing] = useState(false);
  const [autoSync, setAutoSync] = useState(true);
  const [syncInterval, setSyncInterval] = useState('15m');
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const tabs: { id: TabId; label: string; icon: any }[] = useMemo(
    () => [
      { id: 'connection', label: 'Anslutning', icon: Link2 },
      { id: 'settings', label: 'Inställningar', icon: SettingsIcon },
      { id: 'sync', label: 'Synk', icon: RefreshCw },
      { id: 'activity', label: 'Aktivitet', icon: Activity },
    ],
    []
  );

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    await new Promise((r) => setTimeout(r, 900));
    const hasAnyCredential = Object.values(credentials).some((v) => v.trim().length > 3);
    const ok = integration.isConnected || hasAnyCredential;
    setTestResult(ok ? 'ok' : 'fail');
    setTesting(false);
    if (ok) {
      toast.success(`Anslutningen till ${integration.name} fungerar`);
    } else {
      toast.error('Kunde inte verifiera anslutningen. Kontrollera nycklarna.');
    }
  };

  const handleManualSync = async () => {
    setSyncing(true);
    await new Promise((r) => setTimeout(r, 1100));
    setSyncing(false);
    setLastSync('just nu');
    toast.success(`${integration.name} synkad`);
  };

  const handleSave = () => {
    setDirty(false);
    toast.success(`Inställningar för ${integration.name} sparade`);
  };

  const handleCopyWebhook = async () => {
    if (!blueprint.webhookUrl) return;
    try {
      await navigator.clipboard.writeText(blueprint.webhookUrl);
      toast.success('Webhook-URL kopierad');
    } catch {
      toast.error('Kunde inte kopiera');
    }
  };

  const handleDisconnect = () => {
    if (!onDisconnect) return;
    onDisconnect();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="integration-config-title"
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 p-3 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-start gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center flex-shrink-0">
              <integration.icon className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h2
                  id="integration-config-title"
                  className="text-[13px] font-bold text-gray-900 dark:text-gray-100 truncate"
                >
                  Konfigurera {integration.name}
                </h2>
                <StatusDot connected={integration.isConnected} />
              </div>
              <p className="text-[9px] text-gray-600 dark:text-gray-400 mt-0.5 truncate">
                {integration.description}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Stäng"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 px-3 pt-2 border-b border-gray-200 dark:border-gray-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1 px-2 py-1.5 text-[10px] font-semibold border-b-2 -mb-px transition-colors ${
                activeTab === tab.id
                  ? 'border-pink-600 text-pink-700 dark:text-pink-400'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
              aria-selected={activeTab === tab.id}
              role="tab"
            >
              <tab.icon className="h-3 w-3" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {activeTab === 'connection' && (
            <div className="space-y-3">
              <div className="space-y-2">
                {blueprint.credentials.map((field) => {
                  const isSecret = field.type === 'secret';
                  const show = revealed[field.key];
                  return (
                    <div key={field.key}>
                      <label className="block text-[9px] font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        {field.label}
                      </label>
                      <div className="relative">
                        <input
                          type={isSecret && !show ? 'password' : 'text'}
                          value={credentials[field.key] ?? ''}
                          onChange={(e) => {
                            setCredentials({ ...credentials, [field.key]: e.target.value });
                            setDirty(true);
                            setTestResult(null);
                          }}
                          placeholder={field.placeholder}
                          className="w-full px-2 py-1.5 pr-8 text-[10px] bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 focus:border-pink-500 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                        />
                        {isSecret && (
                          <button
                            type="button"
                            onClick={() => setRevealed({ ...revealed, [field.key]: !show })}
                            className="absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
                            aria-label={show ? 'Dölj' : 'Visa'}
                          >
                            {show ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          </button>
                        )}
                      </div>
                      {field.helper && (
                        <p className="text-[8px] text-gray-500 dark:text-gray-500 mt-0.5">{field.helper}</p>
                      )}
                    </div>
                  );
                })}
              </div>

              {blueprint.webhookUrl && (
                <div className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-md p-2">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[9px] font-semibold text-gray-700 dark:text-gray-300">
                      Webhook-URL
                    </span>
                    <button
                      onClick={handleCopyWebhook}
                      className="flex items-center gap-1 text-[8px] font-semibold text-pink-700 dark:text-pink-400 hover:underline"
                    >
                      <Copy className="h-2.5 w-2.5" />
                      Kopiera
                    </button>
                  </div>
                  <code className="block text-[9px] font-mono text-gray-800 dark:text-gray-200 break-all">
                    {blueprint.webhookUrl}
                  </code>
                  <p className="text-[8px] text-gray-500 mt-1">
                    Klistra in denna URL i {integration.name}-dashboarden för att ta emot events.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between gap-2 pt-1">
                <a
                  href={blueprint.docsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-[9px] font-semibold text-gray-700 dark:text-gray-300 hover:text-pink-700"
                >
                  <ExternalLink className="h-3 w-3" />
                  API-dokumentation
                </a>
                <div className="flex items-center gap-1.5">
                  {testResult === 'ok' && (
                    <span className="flex items-center gap-1 text-[9px] font-semibold text-green-700 dark:text-green-400">
                      <CheckCircle2 className="h-3 w-3" /> Ansluten
                    </span>
                  )}
                  {testResult === 'fail' && (
                    <span className="flex items-center gap-1 text-[9px] font-semibold text-red-700 dark:text-red-400">
                      <AlertCircle className="h-3 w-3" /> Misslyckades
                    </span>
                  )}
                  <button
                    onClick={handleTestConnection}
                    disabled={testing}
                    className="px-2 py-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-md font-semibold text-[9px] hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                  >
                    {testing ? 'Testar…' : 'Testa anslutning'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-2.5">
              {blueprint.settings.length === 0 && (
                <p className="text-[10px] text-gray-500 dark:text-gray-400">
                  Den här integrationen har inga inställningar ännu.
                </p>
              )}
              {blueprint.settings.map((field) => {
                const value = settingsState[field.key];
                if (field.type === 'toggle') {
                  const checked = Boolean(value);
                  return (
                    <div
                      key={field.key}
                      className="flex items-start justify-between gap-3 p-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-md"
                    >
                      <div>
                        <p className="text-[10px] font-semibold text-gray-900 dark:text-gray-100">
                          {field.label}
                        </p>
                        {field.helper && (
                          <p className="text-[8px] text-gray-500 mt-0.5">{field.helper}</p>
                        )}
                      </div>
                      <button
                        role="switch"
                        aria-checked={checked}
                        onClick={() => {
                          setSettingsState({ ...settingsState, [field.key]: !checked });
                          setDirty(true);
                        }}
                        className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors flex-shrink-0 ${
                          checked ? 'bg-pink-600' : 'bg-gray-300 dark:bg-gray-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-3 w-3 transform rounded-full bg-white transition ${
                            checked ? 'translate-x-3.5' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  );
                }
                if (field.type === 'select') {
                  return (
                    <div key={field.key}>
                      <label className="block text-[9px] font-semibold text-gray-700 dark:text-gray-300 mb-1">
                        {field.label}
                      </label>
                      <select
                        value={String(value ?? '')}
                        onChange={(e) => {
                          setSettingsState({ ...settingsState, [field.key]: e.target.value });
                          setDirty(true);
                        }}
                        className="w-full px-2 py-1.5 text-[10px] bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 text-gray-900 dark:text-gray-100"
                      >
                        {field.options?.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      {field.helper && (
                        <p className="text-[8px] text-gray-500 mt-0.5">{field.helper}</p>
                      )}
                    </div>
                  );
                }
                return (
                  <div key={field.key}>
                    <label className="block text-[9px] font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      {field.label}
                    </label>
                    <input
                      type={field.type === 'number' ? 'number' : 'text'}
                      value={String(value ?? '')}
                      onChange={(e) => {
                        setSettingsState({
                          ...settingsState,
                          [field.key]:
                            field.type === 'number' ? Number(e.target.value) : e.target.value,
                        });
                        setDirty(true);
                      }}
                      className="w-full px-2 py-1.5 text-[10px] bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-pink-500 text-gray-900 dark:text-gray-100"
                    />
                    {field.helper && (
                      <p className="text-[8px] text-gray-500 mt-0.5">{field.helper}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'sync' && (
            <div className="space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-md p-2">
                  <p className="text-[8px] uppercase tracking-wide text-gray-500">Senaste synk</p>
                  <p className="text-[11px] font-bold text-gray-900 dark:text-gray-100 mt-0.5">
                    {lastSync}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-md p-2">
                  <p className="text-[8px] uppercase tracking-wide text-gray-500">Synkar</p>
                  <p className="text-[11px] font-bold text-gray-900 dark:text-gray-100 mt-0.5">
                    {blueprint.syncLabel}
                  </p>
                </div>
              </div>

              <div className="flex items-start justify-between gap-3 p-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-md">
                <div>
                  <p className="text-[10px] font-semibold text-gray-900 dark:text-gray-100">
                    Automatisk synk
                  </p>
                  <p className="text-[8px] text-gray-500 mt-0.5">
                    Kör i bakgrunden enligt valt intervall.
                  </p>
                </div>
                <button
                  role="switch"
                  aria-checked={autoSync}
                  onClick={() => {
                    setAutoSync(!autoSync);
                    setDirty(true);
                  }}
                  className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors flex-shrink-0 ${
                    autoSync ? 'bg-pink-600' : 'bg-gray-300 dark:bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition ${
                      autoSync ? 'translate-x-3.5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              <div>
                <label className="block text-[9px] font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Synkintervall
                </label>
                <div className="grid grid-cols-4 gap-1">
                  {[
                    { v: '5m', l: '5 min' },
                    { v: '15m', l: '15 min' },
                    { v: '1h', l: '1 tim' },
                    { v: '24h', l: 'Dagligen' },
                  ].map((opt) => (
                    <button
                      key={opt.v}
                      onClick={() => {
                        setSyncInterval(opt.v);
                        setDirty(true);
                      }}
                      disabled={!autoSync}
                      className={`px-2 py-1 text-[9px] font-semibold rounded-md border transition-colors disabled:opacity-40 ${
                        syncInterval === opt.v
                          ? 'bg-pink-600 text-white border-pink-600'
                          : 'bg-white dark:bg-gray-950 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:border-pink-300'
                      }`}
                    >
                      {opt.l}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleManualSync}
                disabled={syncing}
                className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-md font-semibold text-[10px] hover:from-pink-700 hover:to-rose-700 disabled:opacity-60"
              >
                {syncing ? (
                  <RefreshCw className="h-3 w-3 animate-spin" />
                ) : (
                  <PlayCircle className="h-3 w-3" />
                )}
                {syncing ? 'Synkar…' : 'Kör manuell synk nu'}
              </button>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-1.5">
              {blueprint.activity.length === 0 ? (
                <div className="text-center py-6">
                  <Activity className="h-6 w-6 text-gray-300 dark:text-gray-700 mx-auto mb-1" />
                  <p className="text-[10px] text-gray-500">Ingen aktivitet ännu.</p>
                </div>
              ) : (
                blueprint.activity.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start gap-2 p-2 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-md"
                  >
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        event.status === 'success'
                          ? 'bg-green-100 dark:bg-green-900/40'
                          : event.status === 'warning'
                          ? 'bg-amber-100 dark:bg-amber-900/40'
                          : 'bg-red-100 dark:bg-red-900/40'
                      }`}
                    >
                      {event.status === 'success' && (
                        <CheckCircle2 className="h-3 w-3 text-green-700 dark:text-green-300" />
                      )}
                      {event.status === 'warning' && (
                        <AlertCircle className="h-3 w-3 text-amber-700 dark:text-amber-300" />
                      )}
                      {event.status === 'error' && (
                        <AlertCircle className="h-3 w-3 text-red-700 dark:text-red-300" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-semibold text-gray-900 dark:text-gray-100">
                        {event.title}
                      </p>
                      <p className="text-[8px] text-gray-500 mt-0.5">{event.meta}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 p-2.5 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
          <div>
            {integration.isConnected && onDisconnect && (
              <button
                onClick={handleDisconnect}
                className="flex items-center gap-1 px-2 py-1 text-[9px] font-semibold text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-md"
              >
                <Trash2 className="h-3 w-3" />
                Koppla från
              </button>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={onClose}
              className="px-2.5 py-1 text-[10px] font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
            >
              Avbryt
            </button>
            <button
              onClick={handleSave}
              disabled={!dirty}
              className="px-3 py-1 text-[10px] font-semibold bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-md hover:from-pink-700 hover:to-rose-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Spara ändringar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
