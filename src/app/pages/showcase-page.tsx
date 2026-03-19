import { useState } from 'react';
import { CommandPalette } from '../components/command-palette';
import { BulkOperationsBar } from '../components/bulk-operations-bar';
import { SavedViewsPanel, SavedView } from '../components/saved-views-panel';
import { CollisionWarning, LivePresenceIndicator } from '../components/collision-warning';
import { AICopilot } from '../components/ai-copilot';
import { MacroBuilder } from '../components/macro-builder';
import { CustomerJourneyTimeline } from '../components/customer-journey-timeline';
import { SnoozeModal } from '../components/snooze-modal';
import { toast } from 'sonner';

export function ShowcasePage() {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [selectedCount, setSelectedCount] = useState(0);
  const [showCollisionWarning, setShowCollisionWarning] = useState(false);
  const [showSnoozeModal, setShowSnoozeModal] = useState(false);
  const [activeViewId, setActiveViewId] = useState<string | null>(null);

  const features = [
    { id: 'command-palette', name: '⌨️ Kommandopalett', description: 'Tryck ⌘K för att öppna' },
    { id: 'bulk-ops', name: '🚀 Bulkoperationer', description: 'Välj flera objekt' },
    { id: 'saved-views', name: '🔍 Sparade vyer', description: 'Smarta filter' },
    { id: 'collision', name: '👥 Kollisionsdetektering', description: 'Live-samarbete' },
    { id: 'ai-copilot', name: '🤖 AI Co-Pilot', description: 'Smarta förslag' },
    { id: 'macros', name: '🎬 Makron', description: 'Arbetsflödesautomatisering' },
    { id: 'journey', name: '🗺️ Kundresa', description: 'Tidslinjevy' },
    { id: 'snooze', name: '⏰ Snooze Engine', description: 'Smart schemaläggning' },
  ];

  return (
    <div className="h-full overflow-y-auto bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto p-3 space-y-3">
        {/* Header - ULTRA KOMPAKT */}
        <div className="text-center mb-3">
          <h1 className="text-[16px] font-bold text-gray-900 dark:text-gray-100 mb-1">🚀 CCO Power Features Showcase</h1>
          <p className="text-[9px] text-gray-600 dark:text-gray-400">Alla 12+ power user-funktioner på ett ställe</p>
        </div>

        {/* Feature Grid - ULTRA KOMPAKT */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
          {features.map((feature) => (
            <button
              key={feature.id}
              onClick={() => setSelectedFeature(feature.id)}
              className={`p-2 rounded-lg border transition-all text-left ${
                selectedFeature === feature.id
                  ? 'border-pink-500 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30 shadow-lg'
                  : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-pink-300'
              }`}
            >
              <h3 className="text-[10px] font-bold text-gray-900 dark:text-gray-100 mb-0.5">{feature.name}</h3>
              <p className="text-[8px] text-gray-600 dark:text-gray-400">{feature.description}</p>
            </button>
          ))}
        </div>

        {/* Feature Demos - ULTRA KOMPAKT */}
        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-3">
          {selectedFeature === 'command-palette' && (
            <div>
              <h2 className="text-[12px] font-bold text-gray-900 dark:text-gray-100 mb-2">⌨️ Kommandopalett</h2>
              <p className="text-[9px] text-gray-600 dark:text-gray-400 mb-2">
                Global sökning och snabbåtgärder. Tryck <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-[8px]">⌘K</kbd> var som helst.
              </p>
              <button
                onClick={() => setShowCommandPalette(true)}
                className="px-2.5 py-1 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-md font-semibold hover:from-pink-700 hover:to-rose-700 text-[9px]"
              >
                Öppna Kommandopalett
              </button>
            </div>
          )}

          {selectedFeature === 'bulk-ops' && (
            <div>
              <h2 className="text-[12px] font-bold text-gray-900 dark:text-gray-100 mb-2">🚀 Bulkoperationer</h2>
              <p className="text-[9px] text-gray-600 dark:text-gray-400 mb-2">
                Välj flera konversationer och utför gruppåtgärder.
              </p>
              <div className="space-y-2 mb-2">
                <button
                  onClick={() => setSelectedCount(selectedCount + 1)}
                  className="px-2.5 py-1 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 text-[9px]"
                >
                  Simulera Val ({selectedCount} valda)
                </button>
                <button
                  onClick={() => setSelectedCount(0)}
                  className="ml-2 px-2.5 py-1 bg-gray-600 text-white rounded-md font-semibold hover:bg-gray-700 text-[9px]"
                >
                  Rensa
                </button>
              </div>
              <BulkOperationsBar
                selectedCount={selectedCount}
                onClearSelection={() => setSelectedCount(0)}
                onBulkAssign={() => toast.info('Bulk assign')}
                onBulkTag={() => toast.info('Bulk tag')}
                onBulkSnooze={() => toast.info('Bulk snooze')}
                onBulkArchive={() => toast.info('Bulk archive')}
                onBulkDelete={() => toast.info('Bulk delete')}
                onBulkVIP={() => toast.info('Bulk VIP')}
              />
            </div>
          )}

          {selectedFeature === 'saved-views' && (
            <div>
              <h2 className="text-[12px] font-bold text-gray-900 dark:text-gray-100 mb-2">🔍 Sparade Vyer & Smarta Filter</h2>
              <SavedViewsPanel
                activeViewId={activeViewId}
                onSelectView={(view: SavedView) => {
                  setActiveViewId(view.id);
                  toast.success(`Växlade till: ${view.name}`);
                }}
              />
            </div>
          )}

          {selectedFeature === 'collision' && (
            <div>
              <h2 className="text-[12px] font-bold text-gray-900 dark:text-gray-100 mb-2">👥 Kollisionsdetektering</h2>
              <p className="text-[9px] text-gray-600 dark:text-gray-400 mb-2">
                Se när teammedlemmar tittar på samma konversation. Förhindra konflikter.
              </p>
              <div className="mb-2">
                <LivePresenceIndicator
                  users={[
                    { name: 'Sara L.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sara' },
                    { name: 'Egzona K.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Egzona' },
                  ]}
                />
              </div>
              <button
                onClick={() => setShowCollisionWarning(true)}
                className="px-2.5 py-1 bg-amber-600 text-white rounded-md font-semibold hover:bg-amber-700 text-[9px]"
              >
                Visa Kollisionsvarning
              </button>
            </div>
          )}

          {selectedFeature === 'ai-copilot' && (
            <div>
              <h2 className="text-[12px] font-bold text-gray-900 dark:text-gray-100 mb-2">🤖 AI-Assistent</h2>
              <AICopilot
                customerName="Emma Anderson"
                customerHistory="15 maj 2024"
                currentIntent="Booking"
                onAccept={(text) => toast.success('AI-förslag accepterat!')}
                onRegenerate={() => toast.info('Regenererar...')}
              />
            </div>
          )}

          {selectedFeature === 'macros' && (
            <div>
              <h2 className="text-[12px] font-bold text-gray-900 dark:text-gray-100 mb-2">🎬 Makron & Arbetsflöden</h2>
              <MacroBuilder />
            </div>
          )}

          {selectedFeature === 'journey' && (
            <div>
              <h2 className="text-[12px] font-bold text-gray-900 dark:text-gray-100 mb-2">🗺️ Kundresa</h2>
              <CustomerJourneyTimeline customerName="Emma Anderson" />
            </div>
          )}

          {selectedFeature === 'snooze' && (
            <div>
              <h2 className="text-[12px] font-bold text-gray-900 dark:text-gray-100 mb-2">⏰ Snooze & Uppföljning</h2>
              <p className="text-[9px] text-gray-600 dark:text-gray-400 mb-2">
                Smart snoozing med kalendersynk, betalningstriggrar och mer.
              </p>
              <button
                onClick={() => setShowSnoozeModal(true)}
                className="px-2.5 py-1 bg-purple-600 text-white rounded-md font-semibold hover:bg-purple-700 text-[9px]"
              >
                Öppna Snooze Modal
              </button>
            </div>
          )}

          {!selectedFeature && (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 text-[9px]">Välj en funktion ovan för att se den i aktion</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
      />

      {showCollisionWarning && (
        <CollisionWarning
          otherUser={{
            name: 'Sara Lindqvist',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sara',
            action: 'typing',
            duration: 15,
          }}
          onProceed={() => setShowCollisionWarning(false)}
          onPickAnother={() => setShowCollisionWarning(false)}
        />
      )}

      {showSnoozeModal && (
        <SnoozeModal
          conversationId="123"
          customerName="Emma Anderson"
          onClose={() => setShowSnoozeModal(false)}
          onSnooze={() => setShowSnoozeModal(false)}
        />
      )}
    </div>
  );
}