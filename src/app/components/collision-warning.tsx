import { AlertTriangle, Eye, Clock, User } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CollisionWarningProps {
  otherUser: {
    name: string;
    avatar: string;
    action: 'viewing' | 'typing' | 'editing';
    duration: number; // seconds
  };
  onProceed: () => void;
  onPickAnother: () => void;
}

export function CollisionWarning({ otherUser, onProceed, onPickAnother }: CollisionWarningProps) {
  const [elapsed, setElapsed] = useState(otherUser.duration);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const actionText = {
    viewing: 'tittar på denna konversation',
    typing: 'skriver ett svar',
    editing: 'redigerar denna konversation'
  };

  const actionIcon = {
    viewing: Eye,
    typing: User,
    editing: User
  };

  const Icon = actionIcon[otherUser.action];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-3 w-full max-w-xs animate-in zoom-in-95 duration-300">
        {/* Header - KOMPAKT */}
        <div className="flex items-start gap-3 mb-3">
          <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-amber-400 to-orange-500">
            <AlertTriangle className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-[12px] font-bold text-gray-900">Någon annan är här</h3>
            <p className="text-[9px] text-gray-600 mt-0.5">
              Att öppna detta kan orsaka konflikter
            </p>
          </div>
        </div>

        {/* User Info - KOMPAKT */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-md border border-blue-200 p-2.5 mb-3">
          <div className="flex items-center gap-2">
            <img
              src={otherUser.avatar}
              alt={otherUser.name}
              className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
            />
            <div className="flex-1">
              <p className="text-[10px] font-semibold text-gray-900">{otherUser.name}</p>
              <div className="flex items-center gap-1 text-[8px] text-blue-700 mt-0.5">
                <Icon className="h-2.5 w-2.5" />
                <span>{actionText[otherUser.action]}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[8px] text-gray-600">
              <Clock className="h-2.5 w-2.5" />
              <span>{elapsed}s</span>
            </div>
          </div>
        </div>

        {/* Live Indicator - KOMPAKT */}
        {otherUser.action === 'typing' && (
          <div className="flex items-center gap-1.5 mb-3 px-2.5 py-1.5 bg-green-50 border border-green-200 rounded-md">
            <div className="flex gap-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse delay-75" />
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse delay-150" />
            </div>
            <span className="text-[8px] font-medium text-green-900">Skriver aktivt...</span>
          </div>
        )}

        {/* Actions - KOMPAKT */}
        <div className="flex flex-col gap-1.5">
          <button
            onClick={onProceed}
            className="w-full px-2.5 py-1.5 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-md font-semibold hover:from-pink-700 hover:to-rose-700 transition-all shadow-sm text-[9px]"
          >
            Öppna Ändå
          </button>
          <button
            onClick={onPickAnother}
            className="w-full px-2.5 py-1.5 bg-white border-2 border-gray-300 text-gray-700 rounded-md font-semibold hover:bg-gray-50 transition-all text-[9px]"
          >
            Välj Annan Konversation
          </button>
        </div>

        {/* Help Text - KOMPAKT */}
        <p className="text-[8px] text-gray-500 text-center mt-2">
          💡 Tips: Använd @mentions i anteckningar för att samordna med teamet
        </p>
      </div>
    </div>
  );
}

// Live Presence Indicators - KOMPAKT
export function LivePresenceIndicator({ users }: { users: Array<{ name: string; avatar: string }> }) {
  if (users.length === 0) return null;

  return (
    <div className="flex items-center gap-0.5">
      {users.slice(0, 3).map((user, i) => (
        <div
          key={i}
          className="relative"
          style={{ marginLeft: i > 0 ? '-6px' : '0' }}
        >
          <img
            src={user.avatar}
            alt={user.name}
            className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
            title={`${user.name} tittar`}
          />
          <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-green-500 border-2 border-white rounded-full" />
        </div>
      ))}
      {users.length > 3 && (
        <div className="w-5 h-5 rounded-full bg-gray-200 border-2 border-white shadow-sm flex items-center justify-center text-[8px] font-bold text-gray-700">
          +{users.length - 3}
        </div>
      )}
    </div>
  );
}
