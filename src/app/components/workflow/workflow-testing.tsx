import { Play, Pause, SkipForward, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useState } from 'react';
import { Workflow } from '../../pages/workflow-builder-page';
import { toast } from 'sonner';

export function WorkflowTesting({ workflow }: { workflow: Workflow }) {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const testData = {
    customer: { name: 'Emma Anderson', email: 'emma@example.com', isVIP: true },
    trigger: 'customer.created',
    currentTime: '2024-03-16 10:00:00',
  };

  const executionLog = [
    { time: '10:00:00', step: 'Arbetsflöde startat', status: 'success' },
    { time: '10:00:01', step: 'Trigger: Ny VIP-kund', status: 'success', details: 'Kund: Emma Anderson' },
    { time: '10:00:02', step: 'Skicka välkomst-epost', status: 'success', details: 'E-post ID: email_123' },
    { time: '10:00:03', step: 'Tilldela till senior', status: 'success', details: 'Tilldelad till: Sara L.' },
    { time: '10:00:04', step: 'Vänta 3 dagar', status: 'waiting', details: 'Återupptas: 2024-03-19 10:00:00' },
  ];

  return (
    <div className="h-full overflow-y-auto bg-gray-50 p-3">
      <div className="max-w-4xl mx-auto space-y-3">
        <div>
          <h2 className="text-[14px] font-bold text-gray-900">Arbetsflödes-testning</h2>
          <p className="text-[9px] text-gray-600 mt-0.5">Testkörning med simulerad data</p>
        </div>

        {/* Test Controls */}
        <div className="bg-white rounded-lg border border-gray-200 p-2.5">
          <h3 className="text-[10px] font-bold text-gray-900 mb-2">Testkonfiguration</h3>
          
          <div className="grid grid-cols-3 gap-2 mb-2">
            <div>
              <label className="block text-[8px] font-semibold text-gray-700 mb-0.5">Kund</label>
              <div className="px-2 py-1 bg-gray-50 border border-gray-200 rounded text-[9px]">
                {testData.customer.name}
              </div>
            </div>
            <div>
              <label className="block text-[8px] font-semibold text-gray-700 mb-0.5">Trigger</label>
              <div className="px-2 py-1 bg-gray-50 border border-gray-200 rounded text-[9px]">
                {testData.trigger}
              </div>
            </div>
            <div>
              <label className="block text-[8px] font-semibold text-gray-700 mb-0.5">Tid</label>
              <div className="px-2 py-1 bg-gray-50 border border-gray-200 rounded text-[9px]">
                {testData.currentTime}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setIsRunning(!isRunning);
                toast.success(isRunning ? 'Test pausat' : 'Test kör');
              }}
              className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-md font-semibold hover:from-green-700 hover:to-emerald-700 transition-all text-[8px]"
            >
              {isRunning ? <Pause className="h-2.5 w-2.5" /> : <Play className="h-2.5 w-2.5" />}
              {isRunning ? 'Pausa' : 'Kör test'}
            </button>
            <button
              onClick={() => toast.info('Hoppar till nästa steg')}
              className="flex items-center gap-1 px-2.5 py-1 bg-white border border-gray-300 text-gray-700 rounded-md font-semibold hover:bg-gray-50 transition-all text-[8px]"
            >
              <SkipForward className="h-2.5 w-2.5" />
              Hoppa över väntan
            </button>
          </div>
        </div>

        {/* Execution Log */}
        <div className="bg-white rounded-lg border border-gray-200 p-2.5">
          <h3 className="text-[10px] font-bold text-gray-900 mb-2">Körningslogg</h3>
          <div className="space-y-1.5">
            {executionLog.map((log, i) => (
              <div key={i} className="flex items-start gap-2 p-1.5 bg-gray-50 rounded">
                <div className="flex items-center justify-center w-4 h-4 rounded-full flex-shrink-0">
                  {log.status === 'success' && <CheckCircle className="h-3.5 w-3.5 text-green-600" />}
                  {log.status === 'error' && <XCircle className="h-3.5 w-3.5 text-red-600" />}
                  {log.status === 'waiting' && <Clock className="h-3.5 w-3.5 text-amber-600 animate-pulse" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[8px] font-mono text-gray-500">{log.time}</span>
                    <span className="text-[9px] font-semibold text-gray-900">{log.step}</span>
                  </div>
                  {log.details && (
                    <p className="text-[8px] text-gray-600 mt-0.5">{log.details}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Validation Results */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-2.5">
          <h3 className="text-[11px] font-bold text-green-900 mb-1.5">✅ Validering godkänd</h3>
          <ul className="text-[9px] text-green-800 space-y-0.5">
            <li>• Inga oändliga loopar upptäckta</li>
            <li>• Alla obligatoriska fält finns</li>
            <li>• SLA-begränsningar respekteras</li>
            <li>• Felhantering konfigurerad</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
