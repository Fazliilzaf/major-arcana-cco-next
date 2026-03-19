// Skeleton Loaders för alla komponenter

export function MessageListSkeleton() {
  return (
    <div className="animate-pulse space-y-0">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-start gap-3">
            {/* Avatar */}
            <div className="h-10 w-10 rounded-full bg-gray-200" />
            
            {/* Content */}
            <div className="flex-1 space-y-2">
              {/* Sender & Time */}
              <div className="flex items-center justify-between">
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="h-3 w-12 bg-gray-200 rounded" />
              </div>
              
              {/* Subject */}
              <div className="h-4 w-48 bg-gray-200 rounded" />
              
              {/* Preview */}
              <div className="h-3 w-full bg-gray-200 rounded" />
              
              {/* Badges */}
              <div className="flex gap-2">
                <div className="h-5 w-16 bg-gray-200 rounded-full" />
                <div className="h-5 w-20 bg-gray-200 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ConversationSkeleton() {
  return (
    <div className="h-full flex flex-col bg-white animate-pulse">
      {/* Header */}
      <div className="border-b border-gray-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gray-200" />
            <div className="space-y-2">
              <div className="h-5 w-40 bg-gray-200 rounded" />
              <div className="h-3 w-24 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-20 bg-gray-200 rounded-lg" />
            <div className="h-8 w-20 bg-gray-200 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[70%] space-y-2 ${i % 2 === 0 ? '' : 'items-end'}`}>
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className={`h-24 w-full bg-gray-200 rounded-xl ${i % 2 === 0 ? 'rounded-tl-none' : 'rounded-tr-none'}`} />
              <div className="h-3 w-20 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Reply Box */}
      <div className="border-t border-gray-200 p-4">
        <div className="h-32 w-full bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
}

export function CustomerPanelSkeleton() {
  return (
    <div className="h-full bg-white border-l border-gray-200 p-6 animate-pulse space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-gray-200" />
        <div className="flex-1 space-y-2">
          <div className="h-5 w-32 bg-gray-200 rounded" />
          <div className="h-3 w-24 bg-gray-200 rounded" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="h-3 w-16 bg-gray-200 rounded" />
            <div className="h-6 w-20 bg-gray-200 rounded" />
          </div>
        ))}
      </div>

      {/* Sections */}
      {[...Array(3)].map((_, i) => (
        <div key={i} className="space-y-3">
          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="space-y-2">
            <div className="h-3 w-full bg-gray-200 rounded" />
            <div className="h-3 w-full bg-gray-200 rounded" />
            <div className="h-3 w-3/4 bg-gray-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function WorkflowCanvasSkeleton() {
  return (
    <div className="h-full bg-gray-50 animate-pulse relative">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `
          linear-gradient(to right, #e5e7eb 1px, transparent 1px),
          linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
      }} />

      {/* Nodes */}
      <div className="absolute inset-0 p-12 space-y-8">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-80 h-32 bg-gray-200 rounded-xl shadow-sm" style={{
            marginLeft: i % 2 === 0 ? '100px' : '300px'
          }} />
        ))}
      </div>
    </div>
  );
}

export function AnalyticsSkeleton() {
  return (
    <div className="p-6 space-y-6 animate-pulse">
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
            <div className="h-10 w-10 rounded-lg bg-gray-200" />
            <div className="h-8 w-24 bg-gray-200 rounded" />
            <div className="h-4 w-32 bg-gray-200 rounded" />
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="h-6 w-48 bg-gray-200 rounded mb-4" />
        <div className="h-64 bg-gray-200 rounded-lg" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="h-6 w-32 bg-gray-200 rounded mb-4" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-4 w-8 bg-gray-200 rounded" />
              <div className="h-4 flex-1 bg-gray-200 rounded" />
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="h-4 w-20 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Generic loading spinner
export function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className="flex items-center justify-center p-8">
      <div className={`${sizes[size]} border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin`} />
    </div>
  );
}

// Page transition loader
export function PageTransitionLoader() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="h-1 bg-gradient-to-r from-pink-600 via-rose-600 to-pink-600 animate-pulse" />
      <div className="h-1 bg-gradient-to-r from-pink-600 to-rose-600 animate-[shimmer_1s_ease-in-out_infinite]" 
           style={{
             backgroundSize: '200% 100%',
             animation: 'shimmer 1.5s ease-in-out infinite',
           }} />
    </div>
  );
}

// Inline content loader (for small updates)
export function InlineLoader() {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <div className="h-4 w-4 border-2 border-pink-200 border-t-pink-600 rounded-full animate-spin" />
      <span>Loading...</span>
    </div>
  );
}

// Success/Error feedback with animation
export function FeedbackLoader({ 
  type, 
  message 
}: { 
  type: 'success' | 'error' | 'loading';
  message: string;
}) {
  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
      type === 'success' ? 'bg-green-50 text-green-800' :
      type === 'error' ? 'bg-red-50 text-red-800' :
      'bg-blue-50 text-blue-800'
    }`}>
      {type === 'loading' && (
        <div className="h-5 w-5 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
      )}
      {type === 'success' && (
        <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )}
      {type === 'error' && (
        <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      )}
      <span className="text-sm font-semibold">{message}</span>
    </div>
  );
}
