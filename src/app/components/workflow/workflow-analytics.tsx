import { TrendingUp, Clock, CheckCircle, AlertTriangle, Play, DollarSign } from 'lucide-react';
import { Workflow } from '../../pages/workflow-builder-page';

export function WorkflowAnalytics({ workflow }: { workflow: Workflow }) {
  const stats = workflow.stats || {
    executions: 847,
    successRate: 94.3,
    avgDuration: 12.3,
  };

  return (
    <div className="h-full overflow-y-auto bg-gray-50 p-3">
      <div className="max-w-6xl mx-auto space-y-3">
        {/* Header - ULTRA KOMPAKT */}
        <div>
          <h2 className="text-[14px] font-bold text-gray-900">Arbetsflödes-analys</h2>
          <p className="text-[9px] text-gray-600 mt-0.5">Prestandainsikter för "{workflow.name}"</p>
        </div>

        {/* Key Metrics - KOMPAKT GRID */}
        <div className="grid grid-cols-4 gap-2">
          <MetricCard
            icon={Play}
            label="Totala körningar"
            value={stats.executions.toLocaleString()}
            trend={12}
            color="blue"
          />
          <MetricCard
            icon={CheckCircle}
            label="Framgångsfrekvens"
            value={`${stats.successRate}%`}
            trend={2.1}
            color="green"
          />
          <MetricCard
            icon={Clock}
            label="Snitt-varaktighet"
            value={`${stats.avgDuration} min`}
            trend={-5}
            trendInverted
            color="purple"
          />
          <MetricCard
            icon={DollarSign}
            label="Tid sparad"
            value="23.4 tim"
            subtext="2 340 kr värde"
            color="amber"
          />
        </div>

        {/* Step Performance - KOMPAKT */}
        <div className="bg-white rounded-lg border border-gray-200 p-3">
          <h3 className="text-[12px] font-bold text-gray-900 mb-2">Stegprestanda</h3>
          <div className="space-y-1.5">
            {[
              { step: 'Skicka välkomst-epost', duration: '0.3s', success: 99.2 },
              { step: 'Tilldela till senior', duration: '0.1s', success: 100 },
              { step: 'Vänta 3 dagar', duration: '3d', success: 100 },
              { step: 'Kontrollera engagemang', duration: '0.5s', success: 94.3 },
              { step: 'Skicka uppföljning', duration: '0.4s', success: 97.8 },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                <div className="flex items-center gap-2">
                  <div className="text-[9px] font-bold text-gray-400">#{i + 1}</div>
                  <div>
                    <div className="text-[10px] font-semibold text-gray-900">{item.step}</div>
                    <div className="text-[8px] text-gray-600">Snitt: {item.duration}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold text-green-700">{item.success}%</div>
                  <div className="text-[8px] text-gray-500">framgång</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottleneck Detection - KOMPAKT */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-md bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-[12px] font-bold text-orange-900 mb-1">🔥 Flaskhals upptäckt</h3>
              <p className="text-[9px] text-orange-800 mb-2">
                Steg 4 "Vänta 3 dagar" tar betydligt längre än teamgenomsnittet (2.1 dagar).
              </p>
              <div className="flex items-center gap-2">
                <button className="px-2.5 py-1 bg-white border border-orange-300 text-orange-700 rounded-md font-semibold hover:bg-orange-50 transition-all text-[9px]">
                  Optimera detta steg
                </button>
                <button className="text-[9px] text-orange-700 font-semibold hover:text-orange-900">
                  Lär dig mer →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Conversion Impact - KOMPAKT GRID */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <h3 className="text-[10px] font-bold text-gray-900 mb-2">📈 Konverteringsgrad</h3>
            <div className="text-[24px] font-bold text-gray-900 mb-1">87.2%</div>
            <div className="flex items-center gap-1 text-[9px] text-green-600 font-semibold">
              <TrendingUp className="h-3 w-3" />
              +8.2% vs baslinje
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-3">
            <h3 className="text-[10px] font-bold text-gray-900 mb-2">💰 Intäktspåverkan</h3>
            <div className="text-[24px] font-bold text-gray-900 mb-1">124 000 kr</div>
            <div className="text-[9px] text-gray-600">
              Genererat från arbetsflödes-automatisering
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ 
  icon: Icon, 
  label, 
  value, 
  trend, 
  trendInverted = false,
  subtext,
  color 
}: { 
  icon: any;
  label: string;
  value: string;
  trend?: number;
  trendInverted?: boolean;
  subtext?: string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-green-500 to-emerald-500',
    purple: 'from-purple-500 to-pink-500',
    amber: 'from-amber-500 to-orange-500',
  };

  const isPositive = trendInverted ? (trend ? trend < 0 : false) : (trend ? trend > 0 : false);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-2.5">
      <div className={`w-7 h-7 rounded-md bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center mb-2`}>
        <Icon className="h-3.5 w-3.5 text-white" />
      </div>
      <div className="text-[18px] font-bold text-gray-900 mb-0.5">{value}</div>
      <div className="text-[9px] text-gray-600 mb-1">{label}</div>
      {trend !== undefined && (
        <div className={`flex items-center gap-0.5 text-[8px] font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          <TrendingUp className={`h-2.5 w-2.5 ${!isPositive ? 'rotate-180' : ''}`} />
          {Math.abs(trend)}%
        </div>
      )}
      {subtext && (
        <div className="text-[8px] text-gray-500 mt-0.5">{subtext}</div>
      )}
    </div>
  );
}
