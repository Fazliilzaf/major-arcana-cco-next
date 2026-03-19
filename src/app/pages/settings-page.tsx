import { Moon, Sun, Maximize2, Minimize2, Layout, Palette, Bell, Keyboard, User, Shield, Calendar, CreditCard, MessageSquare, BarChart3, Sparkles, Sliders } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

type Theme = 'light' | 'dark' | 'auto';
type Density = 'compact' | 'comfortable' | 'spacious';

export function SettingsPage() {
  const [theme, setTheme] = useState<Theme>('light');
  const [density, setDensity] = useState<Density>('compact');
  const [sidebarSections, setSidebarSections] = useState([
    { id: 'ai-prediction', label: 'AI-förutsägelse', enabled: true, order: 1 },
    { id: 'metrics', label: 'Mätvärden', enabled: true, order: 2 },
    { id: 'templates', label: 'Mallar', enabled: true, order: 3 },
    { id: 'scheduling', label: 'Smart schemaläggning', enabled: true, order: 4 },
    { id: 'upsell', label: 'Merförsäljningsmöjligheter', enabled: false, order: 5 },
    { id: 'assignment', label: 'Auto-tilldela', enabled: true, order: 6 },
  ]);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    toast.success(`Tema: ${newTheme}`);
  };

  const handleDensityChange = (newDensity: Density) => {
    setDensity(newDensity);
    toast.success(`Täthet: ${newDensity}`);
  };

  const toggleSection = (id: string) => {
    setSidebarSections(sections =>
      sections.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s)
    );
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto p-3 space-y-3">
        {/* Header - ULTRA KOMPAKT */}
        <div>
          <h1 className="text-[14px] font-bold text-gray-900 dark:text-gray-100">Inställningar</h1>
          <p className="text-[9px] text-gray-600 dark:text-gray-400 mt-0.5">Anpassa din CCO-upplevelse</p>
        </div>

        {/* Appearance */}
        <SettingsSection
          icon={Palette}
          title="Utseende"
          description="Anpassa hur CCO ser ut"
        >
          {/* Theme */}
          <SettingItem label="Tema" description="Välj ditt färgschema">
            <div className="flex items-center gap-1.5">
              <ThemeButton
                theme="light"
                icon={Sun}
                label="Ljust"
                active={theme === 'light'}
                onClick={() => handleThemeChange('light')}
              />
              <ThemeButton
                theme="dark"
                icon={Moon}
                label="Mörkt"
                active={theme === 'dark'}
                onClick={() => handleThemeChange('dark')}
              />
              <ThemeButton
                theme="auto"
                icon={Sun}
                label="Auto"
                active={theme === 'auto'}
                onClick={() => handleThemeChange('auto')}
              />
            </div>
          </SettingItem>

          {/* Dark Mode Preview */}
          {theme === 'dark' && (
            <div className="mt-2 p-2.5 bg-gray-900 border border-gray-700 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-md bg-gray-800 flex items-center justify-center">
                  <Moon className="h-3.5 w-3.5 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-[10px] font-bold text-white">Förhandsvisning mörkt läge</h3>
                  <p className="text-[8px] text-gray-400">Skönt för ögonen vid sent arbete</p>
                </div>
              </div>
              <div className="bg-gray-800 rounded-md p-2 space-y-1.5">
                <div className="h-1.5 bg-gray-700 rounded w-3/4" />
                <div className="h-1.5 bg-gray-700 rounded w-1/2" />
              </div>
            </div>
          )}

          {/* Density */}
          <SettingItem
            label="Täthet"
            description="Kontrollera avstånd och informationstäthet"
          >
            <div className="flex items-center gap-1.5">
              <DensityButton
                density="compact"
                icon={Minimize2}
                label="Kompakt"
                description="Mer info, mindre plats"
                active={density === 'compact'}
                onClick={() => handleDensityChange('compact')}
              />
              <DensityButton
                density="comfortable"
                icon={Layout}
                label="Bekväm"
                description="Balanserad"
                active={density === 'comfortable'}
                onClick={() => handleDensityChange('comfortable')}
              />
              <DensityButton
                density="spacious"
                icon={Maximize2}
                label="Rymlig"
                description="Mer andrum"
                active={density === 'spacious'}
                onClick={() => handleDensityChange('spacious')}
              />
            </div>
          </SettingItem>
        </SettingsSection>

        {/* Sidebar Customization */}
        <SettingsSection
          icon={Layout}
          title="Sidofält-sektioner"
          description="Visa/dölj och omordna sektioner i kundsidofält"
        >
          <div className="space-y-1.5">
            {sidebarSections.map((section) => (
              <div
                key={section.id}
                className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded-md hover:border-pink-300 transition-all"
              >
                <div className="flex items-center gap-2">
                  <button className="cursor-grab text-gray-400 hover:text-gray-600">
                    <Layout className="h-3 w-3" />
                  </button>
                  <div>
                    <h4 className="text-[10px] font-semibold text-gray-900">{section.label}</h4>
                    <p className="text-[8px] text-gray-500">Ordning: {section.order}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleSection(section.id)}
                  className={`relative w-10 h-5 rounded-full transition-colors ${
                    section.enabled ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                      section.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
          <p className="text-[9px] text-gray-500 mt-2">
            💡 Dra för att omordna • Växla för att visa/dölja
          </p>
        </SettingsSection>

        {/* Calendar */}
        <SettingsSection
          icon={Calendar}
          title="Kalender"
          description="Kalenderintegrationer och inställningar"
        >
          <SettingToggle
            label="Google Calendar-synk"
            description="Synka möten och tillgänglighet"
            enabled={true}
          />
          <SettingToggle
            label="Outlook-integration"
            description="Koppla ditt Outlook-konto"
            enabled={false}
          />
          <SettingToggle
            label="Automatisk bokningsbekräftelse"
            description="Skicka bekräftelse vid ny bokning"
            enabled={true}
          />
        </SettingsSection>

        {/* Payment */}
        <SettingsSection
          icon={CreditCard}
          title="Betalning"
          description="Betalningsinställningar och fakturering"
        >
          <SettingToggle
            label="Betalningspåminnelser"
            description="Automatiska påminnelser för förfallna fakturor"
            enabled={true}
          />
          <SettingToggle
            label="Stripe-integration"
            description="Ta emot kortbetalningar"
            enabled={true}
          />
          <SettingToggle
            label="Swish-betalningar"
            description="Aktivera Swish för snabba betalningar"
            enabled={false}
          />
        </SettingsSection>

        {/* Communication */}
        <SettingsSection
          icon={MessageSquare}
          title="Kommunikation"
          description="E-post och meddelandeinställningar"
        >
          <SettingToggle
            label="E-postsignatur"
            description="Inkludera din signatur i alla svar"
            enabled={true}
          />
          <SettingToggle
            label="Läs-kvitton"
            description="Be om läsbekräftelse"
            enabled={false}
          />
          <SettingToggle
            label="Auto-svar utanför kontorstid"
            description="Automatiskt svar när kontoret är stängt"
            enabled={true}
          />
        </SettingsSection>

        {/* Analytics */}
        <SettingsSection
          icon={BarChart3}
          title="Analys"
          description="Datainsikter och rapportering"
        >
          <SettingToggle
            label="Veckosammanfattning"
            description="E-posta veckovis prestandarapport"
            enabled={true}
          />
          <SettingToggle
            label="Kundbeteende-spårning"
            description="Spåra kundinteraktioner för insikter"
            enabled={true}
          />
          <SettingToggle
            label="Export till Excel"
            description="Tillåt export av analysdata"
            enabled={true}
          />
        </SettingsSection>

        {/* Autopilot */}
        <SettingsSection
          icon={Sparkles}
          title="Autopilot"
          description="AI-drivna automatiseringar"
        >
          <SettingToggle
            label="Smart svar-förslag"
            description="AI föreslår svar baserat på innehåll"
            enabled={true}
          />
          <SettingToggle
            label="Automatisk prioritering"
            description="AI sorterar konversationer efter brådska"
            enabled={true}
          />
          <SettingToggle
            label="Churn-förutsägelse"
            description="Upptäck kunder i riskzonen"
            enabled={true}
          />
        </SettingsSection>

        {/* Notifications */}
        <SettingsSection
          icon={Bell}
          title="Aviseringar"
          description="Kontrollera när och hur du meddelas"
        >
          <SettingToggle
            label="Desktop-aviseringar"
            description="Få meddelanden även när CCO är i bakgrunden"
            enabled={true}
          />
          <SettingToggle
            label="Ljudvarningar"
            description="Spela ljud för nya meddelanden"
            enabled={false}
          />
          <SettingToggle
            label="SLA-varningar"
            description="Varna när SLA-deadline närmar sig"
            enabled={true}
          />
          <SettingToggle
            label="Team-omnämnanden"
            description="Meddela när någon @nämner dig"
            enabled={true}
          />
        </SettingsSection>

        {/* Keyboard Shortcuts */}
        <SettingsSection
          icon={Keyboard}
          title="Kortkommandon"
          description="Visa och anpassa genvägar"
        >
          <div className="space-y-1.5">
            <ShortcutRow shortcut="⌘K" description="Öppna kommandopalett" />
            <ShortcutRow shortcut="R" description="Svara på meddelande" />
            <ShortcutRow shortcut="A" description="Tilldela konversation" />
            <ShortcutRow shortcut="S" description="Snooze konversation" />
            <ShortcutRow shortcut="D" description="Markera som klar" />
            <ShortcutRow shortcut="⌘1-5" description="Växla mellan sparade vyer" />
          </div>
          <button className="mt-2 px-2.5 py-1 bg-white border border-gray-300 text-gray-700 rounded-md font-semibold hover:bg-gray-50 transition-all text-[9px]">
            Visa alla genvägar
          </button>
        </SettingsSection>

        {/* Account */}
        <SettingsSection
          icon={User}
          title="Konto"
          description="Din profil och preferenser"
        >
          <div className="flex items-center gap-3 p-2.5 bg-white border border-gray-200 rounded-lg">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=You"
              alt="Din avatar"
              className="w-12 h-12 rounded-full border-2 border-pink-300"
            />
            <div className="flex-1">
              <h3 className="text-[11px] font-bold text-gray-900">Ditt namn</h3>
              <p className="text-[9px] text-gray-600">din.email@hairtp.com</p>
            </div>
            <button className="px-2.5 py-1 bg-white border border-gray-300 text-gray-700 rounded-md font-semibold hover:bg-gray-50 transition-all text-[9px]">
              Redigera profil
            </button>
          </div>
        </SettingsSection>

        {/* Privacy & Security */}
        <SettingsSection
          icon={Shield}
          title="Integritet & Säkerhet"
          description="Kontrollera dina data- och säkerhetsinställningar"
        >
          <SettingToggle
            label="Tvåfaktors-autentisering"
            description="Lägg till ett extra säkerhetslager"
            enabled={false}
          />
          <SettingToggle
            label="Aktivitetsloggning"
            description="Spåra alla åtgärder för revisionsspår"
            enabled={true}
          />
          <button className="mt-2 px-2.5 py-1 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition-all text-[9px]">
            Radera konto
          </button>
        </SettingsSection>

        {/* CCO Customization */}
        <SettingsSection
          icon={Sliders}
          title="Anpassa din CCO-upplevelse"
          description="Finjustera gränssnittet efter dina behov"
        >
          <SettingToggle
            label="Kompakt konversationsvy"
            description="Visa fler konversationer samtidigt"
            enabled={true}
          />
          <SettingToggle
            label="Färgkodade prioriteter"
            description="Använd färger för att indikera brådska"
            enabled={true}
          />
          <SettingToggle
            label="Avancerade filter"
            description="Visa extra filtreringsalternativ"
            enabled={false}
          />
        </SettingsSection>
      </div>
    </div>
  );
}

function SettingsSection({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: any;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3">
      <div className="flex items-start gap-2 mb-3">
        <div className="w-8 h-8 rounded-md bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center flex-shrink-0">
          <Icon className="h-4 w-4 text-white" />
        </div>
        <div>
          <h2 className="text-[12px] font-bold text-gray-900">{title}</h2>
          <p className="text-[9px] text-gray-600">{description}</p>
        </div>
      </div>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

function SettingItem({
  label,
  description,
  children,
}: {
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2">
        <h3 className="text-[10px] font-semibold text-gray-900">{label}</h3>
        <p className="text-[9px] text-gray-600">{description}</p>
      </div>
      {children}
    </div>
  );
}

function ThemeButton({
  theme,
  icon: Icon,
  label,
  active,
  onClick,
}: {
  theme: Theme;
  icon: any;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex flex-col items-center gap-1.5 p-2.5 border rounded-lg transition-all ${
        active
          ? 'border-pink-500 bg-gradient-to-br from-pink-50 to-rose-50 shadow-sm'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      <div
        className={`w-8 h-8 rounded-md flex items-center justify-center ${
          active ? 'bg-gradient-to-br from-pink-500 to-rose-500' : 'bg-gray-100'
        }`}
      >
        <Icon className={`h-4 w-4 ${active ? 'text-white' : 'text-gray-600'}`} />
      </div>
      <span className={`text-[10px] font-semibold ${active ? 'text-pink-700' : 'text-gray-700'}`}>
        {label}
      </span>
    </button>
  );
}

function DensityButton({
  density,
  icon: Icon,
  label,
  description,
  active,
  onClick,
}: {
  density: Density;
  icon: any;
  label: string;
  description: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex flex-col items-center gap-1.5 p-2.5 border rounded-lg transition-all ${
        active
          ? 'border-pink-500 bg-gradient-to-br from-pink-50 to-rose-50 shadow-sm'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      <Icon className={`h-5 w-5 ${active ? 'text-pink-600' : 'text-gray-600'}`} />
      <div className="text-center">
        <div className={`text-[10px] font-semibold ${active ? 'text-pink-700' : 'text-gray-700'}`}>
          {label}
        </div>
        <div className="text-[8px] text-gray-500">{description}</div>
      </div>
    </button>
  );
}

function SettingToggle({
  label,
  description,
  enabled,
}: {
  label: string;
  description: string;
  enabled: boolean;
}) {
  const [isEnabled, setIsEnabled] = useState(enabled);

  return (
    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
      <div>
        <h4 className="text-[10px] font-semibold text-gray-900">{label}</h4>
        <p className="text-[9px] text-gray-600">{description}</p>
      </div>
      <button
        onClick={() => setIsEnabled(!isEnabled)}
        className={`relative w-10 h-5 rounded-full transition-colors ${
          isEnabled ? 'bg-green-500' : 'bg-gray-300'
        }`}
      >
        <div
          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
            isEnabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
}

function ShortcutRow({
  shortcut,
  description,
}: {
  shortcut: string;
  description: string;
}) {
  return (
    <div className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
      <span className="text-[10px] text-gray-900">{description}</span>
      <kbd className="px-2 py-0.5 bg-white border border-gray-300 rounded text-[9px] font-mono text-gray-700 shadow-sm">
        {shortcut}
      </kbd>
    </div>
  );
}
