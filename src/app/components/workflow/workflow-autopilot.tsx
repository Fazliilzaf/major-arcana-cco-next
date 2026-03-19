import { Sparkles, TrendingUp, Zap, Check, X } from 'lucide-react';
import { useState } from 'react';
import { Workflow } from '../../pages/workflow-builder-page';
import { toast } from 'sonner';

export function WorkflowAutopilot({ workflow }: { workflow: Workflow }) {
  const [autopilotEnabled, setAutopilotEnabled] = useState(true);

  const pendingActions = [
    {
      id: '1',
      type: 'merge',
      title: 'Slå samman dubblettsteg',
      description: 'Stegen "Skicka e-post A" och "Skicka e-post B" skickar båda e-post till samma kund. Slå samman dem?',
      impact: 'Sparar 28% körtid',
      confidence: 95,
    },
    {
      id: '2',
      type: 'optimize',
      title: 'Minska SLA på "Prisfrågor"',
      description: 'Teamet svarar alltid inom 1.5h. Ändra SLA från 4h → 2h?',
      impact: 'Förbättrar kundnöjdhet',
      confidence: 87,
    },
    {
      id: '3',
      type: 'suggest',
      title: 'Lägg till felhantering',
      description: 'Betalnings-webhook har 2.3% felfrekvens. Lägg till retry-logik?',
      impact: 'Ökar framgångsfrekvens till 98%+',
      confidence: 92,
    },
  ];

  const appliedActions = [
    { date: 'Idag', action: 'Minskade "Bokningsflöde" från 7 → 5 steg', impact: '-28% tid' },
    { date: 'Idag', action: 'Ökade "Merförsäljnings-sekvens" konvertering', impact: '+12%' },
    { date: 'Igår', action: 'Auto-fixade 3 timeout-problem', impact: '100% upptid' },
  ];

  return (
    <div className="h-full overflow-y-auto bg-gray-50 p-3">
      <div className="max-w-4xl mx-auto space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[14px] font-bold text-gray-900">Arbetsflödes-autopilot</h2>
            <p className="text-[9px] text-gray-600 mt-0.5">Intelligent självoptimering</p>
          </div>

          {/* Toggle */}
          <button
            onClick={() => {
              setAutopilotEnabled(!autopilotEnabled);
              toast.success(`Autopilot ${!autopilotEnabled ? 'aktiverad' : 'inaktiverad'}`);
            }}
            className={`relative w-12 h-6 rounded-full transition-colors ${
              autopilotEnabled ? 'bg-green-500' : 'bg-gray-300'
            }`}
          >
            <div
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${
                autopilotEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Status */}
        <div className={`rounded-lg border p-2.5 ${
          autopilotEnabled
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'
            : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="flex items-start gap-2.5">
            <div className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 ${
              autopilotEnabled
                ? 'bg-gradient-to-br from-green-500 to-emerald-500'
                : 'bg-gray-300'
            }`}>
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <h3 className={`text-[11px] font-bold mb-1 ${
                autopilotEnabled ? 'text-green-900' : 'text-gray-700'
              }`}>
                {autopilotEnabled ? '✨ Autopilot aktiv' : '⏸️ Autopilot pausad'}
              </h3>
              <p className={`text-[9px] ${
                autopilotEnabled ? 'text-green-800' : 'text-gray-600'
              }`}>
                {autopilotEnabled
                  ? 'Analyserar kontinuerligt arbetsflödesprestanda och föreslår optimeringar'
                  : 'Aktivera autopilot för att låta AI optimera dina arbetsflöden automatiskt'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Pending Actions */}
        {autopilotEnabled && (
          <div>
            <h3 className="text-[11px] font-bold text-gray-900 mb-2">
              🔄 Väntar på godkännande ({pendingActions.length})
            </h3>
            <div className="space-y-2">
              {pendingActions.map(action => (
                <div key={action.id} className="bg-white border border-gray-200 rounded-lg p-2.5 hover:border-purple-300 hover:shadow-md transition-all">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-md bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                      <Zap className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[10px] font-bold text-gray-900 mb-0.5">{action.title}</h4>
                      <p className="text-[9px] text-gray-600 mb-1.5">{action.description}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[8px] font-semibold rounded">
                          {action.impact}
                        </div>
                        <div className="text-[8px] text-gray-600">
                          {action.confidence}% säkerhet
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => toast.success(`Tillämpat: ${action.title}`)}
                          className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-md text-[8px] font-semibold hover:from-green-700 hover:to-emerald-700 transition-all"
                        >
                          <Check className="h-2.5 w-2.5" />
                          Godkänn
                        </button>
                        <button
                          onClick={() => toast.info('Åtgärd avfärdad')}
                          className="flex items-center gap-1 px-2.5 py-1 bg-white border border-gray-300 text-gray-700 rounded-md text-[8px] font-semibold hover:bg-gray-50 transition-all"
                        >
                          <X className="h-2.5 w-2.5" />
                          Avfärda
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Applied Actions */}
        <div>
          <h3 className="text-[11px] font-bold text-gray-900 mb-2">
            ✅ Senaste optimeringar
          </h3>
          <div className="bg-white rounded-lg border border-gray-200 p-2.5">
            <div className="space-y-2">
              {appliedActions.map((item, i) => (
                <div key={i} className="flex items-start gap-2 pb-2 border-b border-gray-100 last:border-0 last:pb-0">
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                    <Check className="h-3 w-3 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[9px] font-semibold text-gray-900">{item.action}</span>
                      <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-[7px] font-semibold rounded">
                        {item.impact}
                      </span>
                    </div>
                    <span className="text-[8px] text-gray-600">{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white rounded-lg border border-gray-200 p-2.5 text-center">
            <div className="text-[16px] font-bold text-gray-900 mb-0.5">47</div>
            <div className="text-[9px] text-gray-600">Optimeringar</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-2.5 text-center">
            <div className="text-[16px] font-bold text-gray-900 mb-0.5">23.4h</div>
            <div className="text-[9px] text-gray-600">Tid sparad</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-2.5 text-center">
            <div className="text-[16px] font-bold text-gray-900 mb-0.5">+18%</div>
            <div className="text-[9px] text-gray-600">Prestanda</div>
          </div>
        </div>
      </div>
    </div>
  );
}