import { X, TrendingUp, CheckCircle2, Clock, Zap, Mail, BarChart3 } from "lucide-react";
import { Button } from "./ui/button";

interface StatsDashboardModalProps {
  onClose: () => void;
}

export function StatsDashboardModal({ onClose }: StatsDashboardModalProps) {
  const stats = {
    thisWeek: {
      handled: 127,
      avgResponseTime: "2h 14m",
      slaCompliance: 98,
      sprintMode: "45%",
      topCategory: "Bokningar (58)",
    },
    today: {
      handled: 18,
      pending: 12,
      snoozed: 3,
      avgResponseTime: "1h 48m",
    },
    overall: {
      totalHandled: 1247,
      slaBreaches: 3,
      customerSatisfaction: 4.8,
      avgHandlingTime: "5m 32s",
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-4xl rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-pink-100 to-pink-200">
              <BarChart3 className="h-5 w-5 text-pink-900" />
            </div>
            <div>
              <h3 className="text-[18px] font-semibold text-gray-900">Statistik & Insikter</h3>
              <p className="text-[12px] text-gray-500">Senaste 7 dagarna</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* This Week Summary */}
        <div className="mb-6">
          <h4 className="text-[14px] font-semibold text-gray-900 mb-3">Denna vecka</h4>
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-emerald-50 to-white p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span className="text-[11px] font-medium text-gray-600">Hanterade mail</span>
              </div>
              <p className="text-[28px] font-bold text-gray-900">{stats.thisWeek.handled}</p>
              <p className="text-[10px] text-emerald-600 mt-1">+12% från förra veckan</p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-blue-50 to-white p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-[11px] font-medium text-gray-600">Svarstid (median)</span>
              </div>
              <p className="text-[28px] font-bold text-gray-900">{stats.thisWeek.avgResponseTime}</p>
              <p className="text-[10px] text-blue-600 mt-1">18% snabbare</p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-pink-50 to-white p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-pink-600" />
                <span className="text-[11px] font-medium text-gray-600">SLA-efterlevnad</span>
              </div>
              <p className="text-[28px] font-bold text-gray-900">{stats.thisWeek.slaCompliance}%</p>
              <p className="text-[10px] text-pink-600 mt-1">Utmärkt prestanda!</p>
            </div>
          </div>
        </div>

        {/* Today Stats */}
        <div className="mb-6">
          <h4 className="text-[14px] font-semibold text-gray-900 mb-3">Idag</h4>
          <div className="grid grid-cols-4 gap-3">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
              <p className="text-[11px] text-gray-600 mb-1">Hanterade</p>
              <p className="text-[20px] font-bold text-gray-900">{stats.today.handled}</p>
            </div>
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
              <p className="text-[11px] text-amber-700 mb-1">Väntande</p>
              <p className="text-[20px] font-bold text-amber-900">{stats.today.pending}</p>
            </div>
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
              <p className="text-[11px] text-blue-700 mb-1">Snoozed</p>
              <p className="text-[20px] font-bold text-blue-900">{stats.today.snoozed}</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
              <p className="text-[11px] text-gray-600 mb-1">Svarstid</p>
              <p className="text-[14px] font-bold text-gray-900">{stats.today.avgResponseTime}</p>
            </div>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="mb-6">
          <h4 className="text-[14px] font-semibold text-gray-900 mb-3">Prestandainsikter</h4>
          <div className="space-y-3">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] font-medium text-gray-700">Snabbläge användning</span>
                <span className="text-[12px] font-bold text-gray-900">{stats.thisWeek.sprintMode}</span>
              </div>
              <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600" style={{ width: stats.thisWeek.sprintMode }}></div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] font-medium text-gray-700">SLA-efterlevnad</span>
                <span className="text-[12px] font-bold text-emerald-700">{stats.thisWeek.slaCompliance}%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600" style={{ width: `${stats.thisWeek.slaCompliance}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Categories */}
        <div className="mb-6">
          <h4 className="text-[14px] font-semibold text-gray-900 mb-3">Mest hanterade kategorier</h4>
          <div className="space-y-2">
            {[
              { name: "Bokningar", count: 58, percent: 45 },
              { name: "Frågor om behandling", count: 32, percent: 25 },
              { name: "Avbokningar", count: 21, percent: 17 },
              { name: "Uppföljning", count: 16, percent: 13 },
            ].map((category, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 p-2.5">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-medium text-gray-700">{category.name}</span>
                    <span className="text-[11px] text-gray-500">{category.count} mail</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-pink-400 to-pink-500" style={{ width: `${category.percent}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Overall Stats */}
        <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-4">
          <h4 className="text-[13px] font-semibold text-gray-900 mb-3">Total statistik</h4>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-[10px] text-gray-500 mb-1">Totalt hanterade</p>
              <p className="text-[16px] font-bold text-gray-900">{stats.overall.totalHandled}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 mb-1">SLA-överträdelser</p>
              <p className="text-[16px] font-bold text-red-700">{stats.overall.slaBreaches}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 mb-1">Kundnöjdhet</p>
              <p className="text-[16px] font-bold text-gray-900">{stats.overall.customerSatisfaction}/5</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-500 mb-1">Handläggningstid</p>
              <p className="text-[16px] font-bold text-gray-900">{stats.overall.avgHandlingTime}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={onClose}
            className="rounded-full bg-pink-900 px-6 py-2.5 text-[13px] font-semibold text-white hover:bg-pink-800"
          >
            Stäng
          </Button>
        </div>
      </div>
    </div>
  );
}
