import { X, Zap, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

export function WelcomeModal({ onClose }: { onClose: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);

  const features = [
    {
      title: '⌨️ Keyboard-First',
      description: 'Press ⌘K for command palette. R for reply, S for snooze, D for done.',
      cta: 'Try ⌘K now',
    },
    {
      title: '🚀 Bulk Operations',
      description: 'Select multiple conversations and perform batch actions instantly.',
      cta: 'Learn more',
    },
    {
      title: '🔍 Smart Filters',
      description: '5 pre-built views: Sprint Queue, High-Value Leads, Churn Risk, Upsells, Team Overview.',
      cta: 'Explore views',
    },
    {
      title: '🤖 AI Co-Pilot',
      description: 'Get context-aware response suggestions in 4 different tones.',
      cta: 'See AI in action',
    },
    {
      title: '📊 Analytics',
      description: 'Track team performance, personal stats, and coaching insights.',
      cta: 'View dashboard',
    },
    {
      title: '🎬 Macros',
      description: 'Automate workflows with pre-built and custom macros.',
      cta: 'Build workflow',
    },
  ];

  const currentFeature = features[currentStep];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-600 to-rose-600 text-white px-8 py-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2">🚀 Welcome to CCO Power Edition</h1>
              <p className="text-pink-100">12+ power features for customer support excellence</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/20 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Progress */}
        <div className="px-8 pt-6">
          <div className="flex items-center gap-2 mb-6">
            {features.map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-2 rounded-full transition-all ${
                  i <= currentStep ? 'bg-gradient-to-r from-pink-500 to-rose-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="px-8 pb-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{currentFeature.title.split(' ')[0]}</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {currentFeature.title.substring(3)}
            </h2>
            <p className="text-gray-600 text-lg">{currentFeature.description}</p>
          </div>

          {/* Quick Links */}
          {currentStep === features.length - 1 && (
            <div className="grid grid-cols-2 gap-3 mb-6">
              <QuickLink to="/showcase" label="🎯 See All Features" />
              <QuickLink to="/analytics" label="📊 Analytics" />
              <QuickLink to="/templates" label="📝 Templates" />
              <QuickLink to="/integrations" label="🔌 Integrations" />
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between">
            {currentStep > 0 ? (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-6 py-2 text-gray-600 font-semibold hover:text-gray-900 transition-colors"
              >
                ← Back
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-6 py-2 text-gray-600 font-semibold hover:text-gray-900 transition-colors"
              >
                Skip tour
              </button>
            )}

            {currentStep < features.length - 1 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg font-semibold hover:from-pink-700 hover:to-rose-700 transition-all shadow-sm"
              >
                Next Feature
                <Zap className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-sm"
              >
                <CheckCircle className="h-4 w-4" />
                Get Started
              </button>
            )}
          </div>
        </div>

        {/* Footer Tip */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-200 px-8 py-4">
          <p className="text-sm text-blue-900 text-center">
            💡 Press <kbd className="px-2 py-1 bg-white border border-blue-300 rounded text-xs font-semibold">⌘K</kbd> anytime to open the command palette
          </p>
        </div>
      </div>
    </div>
  );
}

function QuickLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-gray-200 rounded-lg font-semibold text-sm text-gray-700 hover:border-pink-300 hover:bg-pink-50 transition-all"
    >
      {label}
    </Link>
  );
}
