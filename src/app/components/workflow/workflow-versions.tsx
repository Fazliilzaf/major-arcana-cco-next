import { GitBranch, ArrowRight, RotateCcw, Copy } from 'lucide-react';
import { Workflow } from '../../pages/workflow-builder-page';
import { toast } from 'sonner';

export function WorkflowVersions({ workflow }: { workflow: Workflow }) {
  const versions = [
    {
      version: 'v3.0',
      date: '2024-03-15',
      author: 'Sara L.',
      changes: ['La till AI-förslagssteg', 'Ändrade SLA från 24h → 12h', 'Uppdaterade e-postmall'],
      isCurrent: true,
    },
    {
      version: 'v2.1',
      date: '2024-02-20',
      author: 'Egzona K.',
      changes: ['Fixade timeout för betalnings-webhook', 'Förbättrad felhantering'],
      isCurrent: false,
    },
    {
      version: 'v2.0',
      date: '2024-01-10',
      author: 'Johan B.',
      changes: ['Omstrukturerade villkorslogik', 'Optimerad prestanda'],
      isCurrent: false,
    },
  ];

  return (
    <div className="h-full overflow-y-auto bg-gray-50 p-3">
      <div className="max-w-4xl mx-auto space-y-3">
        <div>
          <h2 className="text-[14px] font-bold text-gray-900">Versionshistorik</h2>
          <p className="text-[9px] text-gray-600 mt-0.5">Spåra ändringar och återställ vid behov</p>
        </div>

        {/* Version Timeline */}
        <div className="space-y-2">
          {versions.map((v, i) => (
            <div key={v.version} className="relative">
              {/* Connector Line */}
              {i < versions.length - 1 && (
                <div className="absolute left-[19px] top-10 bottom-0 w-0.5 bg-gray-200 -mb-2" />
              )}

              <div className={`bg-white border rounded-lg p-2.5 ${
                v.isCurrent ? 'border-pink-300 shadow-md' : 'border-gray-200'
              }`}>
                <div className="flex items-start gap-2.5">
                  {/* Version Badge */}
                  <div className={`w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0 ${
                    v.isCurrent
                      ? 'bg-gradient-to-br from-pink-500 to-rose-500'
                      : 'bg-gray-100'
                  }`}>
                    <GitBranch className={`h-4 w-4 ${v.isCurrent ? 'text-white' : 'text-gray-600'}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <h3 className="text-[11px] font-bold text-gray-900">{v.version}</h3>
                      {v.isCurrent && (
                        <span className="px-1.5 py-0.5 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[7px] font-bold rounded">
                          AKTUELL
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] text-gray-600 mb-1.5">
                      <span>{v.date}</span>
                      <span>•</span>
                      <span>av {v.author}</span>
                    </div>

                    {/* Changes */}
                    <div className="mb-2">
                      <h4 className="text-[8px] font-bold text-gray-700 uppercase tracking-wide mb-1">
                        Ändringar:
                      </h4>
                      <ul className="space-y-0.5">
                        {v.changes.map((change, j) => (
                          <li key={j} className="text-[9px] text-gray-700 flex items-start gap-1.5">
                            <ArrowRight className="h-2.5 w-2.5 text-pink-500 flex-shrink-0 mt-0.5" />
                            {change}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Actions */}
                    {!v.isCurrent && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => toast.success(`Återställd till ${v.version}`)}
                          className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-md text-[8px] font-semibold hover:from-pink-700 hover:to-rose-700 transition-all"
                        >
                          <RotateCcw className="h-2 w-2" />
                          Återställ
                        </button>
                        <button
                          onClick={() => toast.success('Version förgrenad')}
                          className="flex items-center gap-1 px-2.5 py-1 bg-white border border-gray-300 text-gray-700 rounded-md text-[8px] font-semibold hover:bg-gray-50 transition-all"
                        >
                          <Copy className="h-2 w-2" />
                          Förgrena
                        </button>
                        <button className="px-2.5 py-1 text-gray-600 text-[8px] font-semibold hover:text-gray-900 transition-all">
                          Visa skillnad →
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Diff Preview */}
        <div className="bg-white rounded-lg border border-gray-200 p-2.5">
          <h3 className="text-[10px] font-bold text-gray-900 mb-2">Skillnad: v3.0 ← v2.1</h3>
          <div className="bg-gray-900 rounded-md p-2 font-mono text-[9px]">
            <div className="text-red-400">- Mall: "bokning-bekrafta-gammal"</div>
            <div className="text-green-400">+ Mall: "bokning-bekrafta-v2"</div>
            <div className="text-green-400">+ Inkludera: Kundhistorik-sammanfattning</div>
            <div className="text-gray-500 mt-1">...</div>
            <div className="text-green-400">+ OM betalningsmetod = "faktura"</div>
            <div className="text-green-400">+   DÅ vänta_på_betalning(timeout: 24h)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
