import { Smartphone, Bell, Check, Clock, Tag } from 'lucide-react';

export function MobilePreview() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">📱 Mobile Companion App</h1>
          <p className="text-gray-600">Support on-the-go with push notifications and quick actions</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* iPhone Mockup */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Phone Frame */}
              <div className="w-[280px] h-[560px] bg-black rounded-[40px] p-3 shadow-2xl">
                {/* Screen */}
                <div className="w-full h-full bg-white rounded-[30px] overflow-hidden">
                  {/* Status Bar */}
                  <div className="bg-gray-50 px-6 py-3 flex items-center justify-between">
                    <span className="text-xs font-semibold">9:41</span>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-2.5 bg-gray-900 rounded-sm" />
                      <div className="w-1 h-2.5 bg-gray-900 rounded-sm" />
                    </div>
                  </div>

                  {/* App Header */}
                  <div className="bg-gradient-to-r from-pink-600 to-rose-600 px-4 py-4 text-white">
                    <h2 className="text-lg font-bold">CCO Inbox</h2>
                    <p className="text-xs text-white/80">3 urgent conversations</p>
                  </div>

                  {/* Conversation List */}
                  <div className="p-3 space-y-2">
                    <MobileConversationCard
                      name="Emma Anderson"
                      message="Hej! Jag vill boka en konsultation..."
                      time="2m"
                      priority="sprint"
                      unread
                    />
                    <MobileConversationCard
                      name="Johan Berg"
                      message="Vad kostar behandlingen?"
                      time="15m"
                      priority="high"
                      unread
                    />
                    <MobileConversationCard
                      name="Sara Lindqvist"
                      message="Tack för förra gången!"
                      time="1h"
                      priority="normal"
                    />
                  </div>

                  {/* Quick Actions Bar */}
                  <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-3 py-2 flex items-center justify-around">
                    <MobileActionButton icon={Bell} label="Notifs" badge={3} />
                    <MobileActionButton icon={Check} label="Done" />
                    <MobileActionButton icon={Clock} label="Later" />
                    <MobileActionButton icon={Tag} label="Tag" />
                  </div>
                </div>
              </div>

              {/* Notch */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-10" />
            </div>
          </div>

          {/* Features List */}
          <div className="space-y-4">
            <FeatureItem
              icon="🔔"
              title="Push Notifications"
              description="Get alerted for critical and sprint priority conversations"
            />
            <FeatureItem
              icon="⚡"
              title="Quick Reply"
              description="Use templates and AI suggestions for fast responses"
            />
            <FeatureItem
              icon="🎙️"
              title="Voice-to-Text"
              description="Dictate responses on the go"
            />
            <FeatureItem
              icon="✅"
              title="Approve AI Suggestions"
              description="Review and approve AI-generated responses"
            />
            <FeatureItem
              icon="⏰"
              title="Snooze & Assign"
              description="Quick actions without opening laptop"
            />
            <FeatureItem
              icon="📴"
              title="Offline Mode"
              description="Draft responses, sync when online"
            />
          </div>
        </div>

        {/* Coming Soon Badge */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold shadow-lg">
            <Smartphone className="h-5 w-5" />
            <span>Coming to iOS & Android</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileConversationCard({ 
  name, 
  message, 
  time, 
  priority, 
  unread 
}: { 
  name: string;
  message: string;
  time: string;
  priority: string;
  unread?: boolean;
}) {
  const priorityColors: Record<string, string> = {
    sprint: 'bg-red-500',
    high: 'bg-orange-500',
    normal: 'bg-gray-300',
  };

  return (
    <div className={`bg-white border rounded-lg p-3 ${unread ? 'border-pink-300 shadow-sm' : 'border-gray-200'}`}>
      <div className="flex items-start gap-2">
        <div className={`w-2 h-2 rounded-full mt-1.5 ${priorityColors[priority]}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <span className={`text-xs font-semibold ${unread ? 'text-gray-900' : 'text-gray-600'}`}>
              {name}
            </span>
            <span className="text-[10px] text-gray-500">{time}</span>
          </div>
          <p className={`text-[10px] truncate ${unread ? 'text-gray-700' : 'text-gray-500'}`}>
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}

function MobileActionButton({ 
  icon: Icon, 
  label, 
  badge 
}: { 
  icon: any; 
  label: string;
  badge?: number;
}) {
  return (
    <button className="relative flex flex-col items-center gap-1">
      <div className="relative">
        <Icon className="h-5 w-5 text-gray-600" />
        {badge && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-[8px] font-bold text-white">{badge}</span>
          </div>
        )}
      </div>
      <span className="text-[9px] text-gray-600 font-medium">{label}</span>
    </button>
  );
}

function FeatureItem({ 
  icon, 
  title, 
  description 
}: { 
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 bg-white rounded-lg border border-gray-200 p-4">
      <div className="text-2xl">{icon}</div>
      <div>
        <h3 className="text-sm font-bold text-gray-900">{title}</h3>
        <p className="text-xs text-gray-600 mt-0.5">{description}</p>
      </div>
    </div>
  );
}
