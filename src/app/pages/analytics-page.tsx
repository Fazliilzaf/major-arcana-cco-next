import { BarChart3, TrendingUp, Clock, CheckCircle, Star, Award, Zap, Users, MessageSquare } from 'lucide-react';
import { useState } from 'react';

export function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');

  const teamStats = {
    avgResponseTime: '2h 14m',
    avgResponseTrend: -12,
    slaCompliance: 94,
    slaComplianceTrend: 3,
    conversationsPerAgent: 47,
    csatScore: 4.7,
    csatTrend: 5,
  };

  const personalStats = {
    conversationsClosed: 47,
    avgResponseTime: '1h 52m',
    templatesUsed: 89,
    templatesUsedTrend: 5,
    upsellsGenerated: 3,
    upsellRevenue: 4200,
  };

  const topPerformers = [
    { name: 'Sara L.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sara', count: 62, badge: '🏆' },
    { name: 'Egzona K.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Egzona', count: 58, badge: '🥈' },
    { name: 'Johan B.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Johan', count: 53, badge: '🥉' },
  ];

  const topTemplates = [
    { name: 'Bokningsbekräftelse', uses: 142, conversion: 87 },
    { name: 'Prissättning', uses: 89, conversion: 72 },
    { name: 'Föreslå ny tid', uses: 67, conversion: 91 },
  ];

  return (
    <div className="h-full overflow-y-auto bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto p-3 space-y-3">
        {/* Header - ULTRA KOMPAKT */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[14px] font-bold text-gray-900 dark:text-gray-100">Analysdashboard</h1>
            <p className="text-[9px] text-gray-600 dark:text-gray-400">Följ prestanda och förbättra över tid</p>
          </div>

          {/* Time Range Selector - KOMPAKT */}
          <div className="flex items-center gap-0.5 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-0.5">
            {(['day', 'week', 'month'] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-2.5 py-1 rounded-md text-[9px] font-bold transition-all ${
                  timeRange === range
                    ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {range === 'day' ? 'Idag' : range === 'week' ? 'Denna vecka' : 'Denna månad'}
              </button>
            ))}
          </div>
        </div>

        {/* Team Performance - ULTRA KOMPAKT */}
        <div>
          <h2 className="text-[11px] font-bold text-gray-900 dark:text-gray-100 mb-2">Teamprestanda</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
            <StatCard
              icon={Clock}
              label="Snitt svarstid"
              value={teamStats.avgResponseTime}
              trend={teamStats.avgResponseTrend}
              color="blue"
            />
            <StatCard
              icon={CheckCircle}
              label="SLA-efterlevnad"
              value={`${teamStats.slaCompliance}%`}
              trend={teamStats.slaComplianceTrend}
              color="green"
            />
            <StatCard
              icon={Users}
              label="Konv per agent"
              value={teamStats.conversationsPerAgent}
              color="purple"
            />
            <StatCard
              icon={Star}
              label="CSAT-poäng"
              value={teamStats.csatScore}
              trend={teamStats.csatTrend}
              color="amber"
              maxValue={5}
            />
          </div>
        </div>

        {/* Personal Stats - ULTRA KOMPAKT */}
        <div>
          <h2 className="text-[11px] font-bold text-gray-900 dark:text-gray-100 mb-2">Din prestanda</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="col-span-2">
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-3">
                <div className="grid grid-cols-3 gap-3">
                  <PersonalStatItem
                    icon={MessageSquare}
                    label="Konversationer avslutade"
                    value={personalStats.conversationsClosed}
                  />
                  <PersonalStatItem
                    icon={Clock}
                    label="Snitt svarstid"
                    value={personalStats.avgResponseTime}
                  />
                  <PersonalStatItem
                    icon={BarChart3}
                    label="Mallar använda"
                    value={`${personalStats.templatesUsed}%`}
                    trend={personalStats.templatesUsedTrend}
                  />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-3 text-white">
              <div className="flex items-start justify-between mb-2">
                <div className="w-7 h-7 rounded-md bg-white/20 flex items-center justify-center">
                  <Zap className="h-3.5 w-3.5" />
                </div>
                <div className="text-right">
                  <div className="text-[18px] font-bold">{personalStats.upsellsGenerated}</div>
                  <div className="text-[8px] text-white/80">Merförsäljningar</div>
                </div>
              </div>
              <div className="text-[16px] font-bold">{personalStats.upsellRevenue.toLocaleString()} kr</div>
              <div className="text-[8px] text-white/80 mt-0.5">Intäkter genererade</div>
            </div>
          </div>
        </div>

        {/* Leaderboard & Templates - ULTRA KOMPAKT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
          {/* Top Performers */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Award className="h-3.5 w-3.5 text-amber-500" />
              <h3 className="text-[11px] font-bold text-gray-900 dark:text-gray-100">Topppresterare</h3>
            </div>
            <div className="space-y-2">
              {topPerformers.map((performer, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-[14px]">{performer.badge}</span>
                  <img
                    src={performer.avatar}
                    alt={performer.name}
                    className="w-6 h-6 rounded-full border border-white dark:border-gray-800 shadow-sm"
                  />
                  <div className="flex-1">
                    <p className="text-[10px] font-semibold text-gray-900 dark:text-gray-100">{performer.name}</p>
                    <p className="text-[8px] text-gray-600 dark:text-gray-400">{performer.count} konversationer</p>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] font-bold text-gray-900 dark:text-gray-100">{performer.count}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Templates */}
          <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <BarChart3 className="h-3.5 w-3.5 text-blue-500" />
              <h3 className="text-[11px] font-bold text-gray-900 dark:text-gray-100">Populäraste mallar</h3>
            </div>
            <div className="space-y-2">
              {topTemplates.map((template, i) => (
                <div key={i} className="space-y-0.5">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-semibold text-gray-900 dark:text-gray-100">{template.name}</p>
                    <span className="text-[8px] font-medium text-gray-600 dark:text-gray-400">{template.uses}×</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                        style={{ width: `${template.conversion}%` }}
                      />
                    </div>
                    <span className="text-[8px] font-semibold text-gray-900 dark:text-gray-100 w-8 text-right">
                      {template.conversion}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coaching Insights - ULTRA KOMPAKT */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border border-purple-200 dark:border-purple-800 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <div className="w-7 h-7 rounded-md bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
              <Zap className="h-3.5 w-3.5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-[11px] font-bold text-gray-900 dark:text-gray-100 mb-1">💡 Coachinginsikt</h3>
              <p className="text-[9px] text-gray-700 dark:text-gray-300 mb-2 leading-relaxed">
                Du är <strong>23% långsammare</strong> på prisfrågor jämfört med ditt genomsnitt. 
                Överväg att använda "Prissättning"-mallen oftare för att spara tid.
              </p>
              <button className="px-2.5 py-1 bg-white dark:bg-gray-900 border border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 rounded-md font-semibold hover:bg-purple-50 dark:hover:bg-purple-950 transition-all text-[9px]">
                Visa prismall
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  trend, 
  color,
  maxValue 
}: { 
  icon: any; 
  label: string; 
  value: string | number; 
  trend?: number;
  color: string;
  maxValue?: number;
}) {
  const colorClasses: Record<string, string> = {
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-green-500 to-emerald-500',
    purple: 'from-purple-500 to-pink-500',
    amber: 'from-amber-500 to-orange-500',
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-2.5">
      <div className="flex items-start justify-between mb-1.5">
        <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="h-3 w-3 text-white" />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-0.5 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className={`h-2.5 w-2.5 ${trend < 0 ? 'rotate-180' : ''}`} />
            <span className="text-[9px] font-bold">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      <div className="text-[16px] font-bold text-gray-900 dark:text-gray-100 mb-0.5">
        {value}
        {maxValue && <span className="text-[11px] text-gray-400">/{maxValue}</span>}
      </div>
      <div className="text-[9px] text-gray-600 dark:text-gray-400">{label}</div>
    </div>
  );
}

function PersonalStatItem({ 
  icon: Icon, 
  label, 
  value, 
  trend 
}: { 
  icon: any; 
  label: string; 
  value: string | number;
  trend?: number;
}) {
  return (
    <div>
      <div className="flex items-center gap-1 mb-1">
        <Icon className="h-3 w-3 text-gray-500 dark:text-gray-400" />
        <span className="text-[8px] text-gray-600 dark:text-gray-400">{label}</span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <div className="text-[14px] font-bold text-gray-900 dark:text-gray-100">{value}</div>
        {trend !== undefined && (
          <div className={`flex items-center gap-0.5 text-[8px] font-semibold ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className={`h-2 w-2 ${trend < 0 ? 'rotate-180' : ''}`} />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
    </div>
  );
}