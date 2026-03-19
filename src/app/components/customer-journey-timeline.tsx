import { Mail, Calendar, CreditCard, Stethoscope, TrendingUp, Clock, AlertCircle } from 'lucide-react';

interface TimelineEvent {
  id: string;
  date: string;
  type: 'contact' | 'booking' | 'payment' | 'treatment' | 'upsell' | 'followup';
  title: string;
  description: string;
  metadata?: any;
  icon: any;
  color: string;
}

interface CustomerJourneyTimelineProps {
  customerName: string;
  events: TimelineEvent[];
}

const SAMPLE_EVENTS: TimelineEvent[] = [
  {
    id: '1',
    date: 'Jan 2024',
    type: 'contact',
    title: 'First contact (Lead)',
    description: 'Email: "Prisfråga laser"',
    metadata: { respondedBy: 'Sara L.', responseTime: '2h' },
    icon: Mail,
    color: 'blue',
  },
  {
    id: '2',
    date: 'Feb 2024',
    type: 'booking',
    title: 'Booked consultation',
    description: 'Booking: 15 Feb 10:00',
    metadata: { service: 'Laser consultation' },
    icon: Calendar,
    color: 'green',
  },
  {
    id: '3',
    date: 'Feb 2024',
    type: 'payment',
    title: 'Payment received',
    description: 'Payment: 2,500 kr',
    metadata: { method: 'Stripe', status: 'completed' },
    icon: CreditCard,
    color: 'purple',
  },
  {
    id: '4',
    date: 'Mar 2024',
    type: 'treatment',
    title: 'Treatment completed',
    description: 'Visit: Completed',
    metadata: { satisfaction: 5, provider: 'Dr. Andersson' },
    icon: Stethoscope,
    color: 'pink',
  },
  {
    id: '5',
    date: 'Mar 2024',
    type: 'upsell',
    title: 'Upsell recommended',
    description: 'Recommended filler (+3,200 kr)',
    metadata: { status: 'pending' },
    icon: TrendingUp,
    color: 'amber',
  },
  {
    id: '6',
    date: 'Apr 2024',
    type: 'followup',
    title: '⚠️ Dormant!',
    description: 'Last contact: 14 days ago',
    metadata: { risk: 'churn', action: 'Follow up needed' },
    icon: AlertCircle,
    color: 'red',
  },
];

export function CustomerJourneyTimeline({ 
  customerName = 'Emma Anderson',
  events = SAMPLE_EVENTS 
}: CustomerJourneyTimelineProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Customer Journey</h3>
          <p className="text-sm text-gray-600">{customerName}'s complete timeline</p>
        </div>
        <div className="text-xs text-gray-500">
          {events.length} events
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-gray-200 via-gray-300 to-gray-200" />

        {/* Events */}
        <div className="space-y-6">
          {events.map((event, index) => (
            <TimelineEventCard key={event.id} event={event} isLatest={index === events.length - 1} />
          ))}
        </div>
      </div>

      {/* Predictive Next Step */}
      <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
            <Clock className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-blue-900 mb-1">🔮 Predicted Next Step</h4>
            <p className="text-xs text-blue-800">
              Usually books again after <strong>8 weeks</strong> • Expected: <strong>May 15</strong>
            </p>
            <button className="mt-2 px-3 py-1.5 bg-white border-2 border-blue-300 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-50 transition-all">
              Send Reminder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineEventCard({ event, isLatest }: { event: TimelineEvent; isLatest: boolean }) {
  const colorClasses: Record<string, { bg: string; border: string; text: string; gradient: string }> = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      gradient: 'from-blue-500 to-cyan-500',
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-700',
      gradient: 'from-green-500 to-emerald-500',
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-700',
      gradient: 'from-purple-500 to-pink-500',
    },
    pink: {
      bg: 'bg-pink-50',
      border: 'border-pink-200',
      text: 'text-pink-700',
      gradient: 'from-pink-500 to-rose-500',
    },
    amber: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-700',
      gradient: 'from-amber-500 to-orange-500',
    },
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-700',
      gradient: 'from-red-500 to-orange-500',
    },
  };

  const colors = colorClasses[event.color];

  return (
    <div className="relative flex gap-4">
      {/* Icon */}
      <div className="relative z-10 flex-shrink-0">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-lg ${
          isLatest ? 'ring-4 ring-pink-200 ring-offset-2' : ''
        }`}>
          <event.icon className="h-5 w-5 text-white" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 pb-2">
        <div className={`bg-white border-2 ${colors.border} rounded-xl p-4 ${
          isLatest ? 'shadow-lg' : ''
        }`}>
          {/* Date Badge */}
          <div className="flex items-center justify-between mb-2">
            <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-semibold ${colors.bg} ${colors.text}`}>
              {event.date}
            </span>
            {isLatest && (
              <span className="px-2 py-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold rounded-md">
                LATEST
              </span>
            )}
          </div>

          {/* Title & Description */}
          <h4 className="text-sm font-bold text-gray-900 mb-1">{event.title}</h4>
          <p className="text-xs text-gray-600 mb-3">{event.description}</p>

          {/* Metadata */}
          {event.metadata && (
            <div className={`${colors.bg} rounded-lg p-2 space-y-1`}>
              {Object.entries(event.metadata).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 capitalize">{key}:</span>
                  <span className={`font-semibold ${colors.text}`}>{String(value)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Compact version for sidebar
export function CustomerJourneyTimelineCompact({ events = SAMPLE_EVENTS }: { events?: TimelineEvent[] }) {
  return (
    <div className="space-y-2">
      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Journey</h4>
      <div className="space-y-2">
        {events.slice(0, 4).map((event) => (
          <div key={event.id} className="flex items-center gap-2 text-xs">
            <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${
              event.color === 'blue' ? 'from-blue-500 to-cyan-500' :
              event.color === 'green' ? 'from-green-500 to-emerald-500' :
              event.color === 'purple' ? 'from-purple-500 to-pink-500' :
              event.color === 'pink' ? 'from-pink-500 to-rose-500' :
              event.color === 'amber' ? 'from-amber-500 to-orange-500' :
              'from-red-500 to-orange-500'
            } flex items-center justify-center flex-shrink-0`}>
              <event.icon className="h-3 w-3 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">{event.title}</p>
              <p className="text-gray-500 text-[10px]">{event.date}</p>
            </div>
          </div>
        ))}
        {events.length > 4 && (
          <button className="w-full text-xs text-pink-600 font-semibold hover:text-pink-700">
            View all {events.length} events →
          </button>
        )}
      </div>
    </div>
  );
}
