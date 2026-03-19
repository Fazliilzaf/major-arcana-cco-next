import { Loader2 } from "lucide-react";

// Skeleton shimmer effect
const shimmer = "animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]";

// Full page loader
export function FullPageLoader({ message = "Laddar..." }: { message?: string }) {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-pink-600" />
        <p className="text-sm font-medium text-gray-600">{message}</p>
      </div>
    </div>
  );
}

// Message list skeleton
export function MessageListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-2 p-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-lg border border-gray-100 bg-white p-3"
        >
          <div className="flex items-start gap-3">
            {/* Avatar skeleton */}
            <div className={`h-10 w-10 rounded-full ${shimmer}`} />
            
            <div className="flex-1 space-y-2">
              {/* Name and time */}
              <div className="flex items-center justify-between">
                <div className={`h-4 w-32 rounded ${shimmer}`} />
                <div className={`h-3 w-12 rounded ${shimmer}`} />
              </div>
              
              {/* Subject */}
              <div className={`h-3 w-48 rounded ${shimmer}`} />
              
              {/* Preview */}
              <div className={`h-3 w-full rounded ${shimmer}`} />
              
              {/* Tags */}
              <div className="flex gap-2">
                <div className={`h-5 w-16 rounded-full ${shimmer}`} />
                <div className={`h-5 w-20 rounded-full ${shimmer}`} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Conversation detail skeleton
export function ConversationSkeleton() {
  return (
    <div className="h-full p-5">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-3">
        <div className={`h-6 w-48 rounded ${shimmer}`} />
        <div className={`h-8 w-8 rounded ${shimmer}`} />
      </div>

      {/* Messages */}
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3">
            <div className={`h-10 w-10 rounded-full ${shimmer}`} />
            <div className="flex-1 space-y-2">
              <div className={`h-4 w-40 rounded ${shimmer}`} />
              <div className={`h-24 w-full rounded-lg ${shimmer}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Customer intelligence skeleton
export function IntelligenceSkeleton() {
  return (
    <div className="h-full p-4">
      {/* Profile */}
      <div className="mb-4 flex items-start gap-3 rounded-xl border border-gray-200 p-3">
        <div className={`h-12 w-12 rounded-full ${shimmer}`} />
        <div className="flex-1 space-y-2">
          <div className={`h-4 w-32 rounded ${shimmer}`} />
          <div className={`h-3 w-48 rounded ${shimmer}`} />
          <div className={`h-3 w-40 rounded ${shimmer}`} />
        </div>
      </div>

      {/* Stats */}
      <div className="mb-4 grid grid-cols-3 gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`h-20 rounded-lg ${shimmer}`} />
        ))}
      </div>

      {/* Details */}
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className={`h-16 rounded-lg ${shimmer}`} />
        ))}
      </div>
    </div>
  );
}

// Inline spinner (for buttons, etc.)
export function Spinner({ size = "sm" }: { size?: "xs" | "sm" | "md" | "lg" }) {
  const sizeClasses = {
    xs: "h-3 w-3",
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <Loader2 className={`animate-spin ${sizeClasses[size]}`} />
  );
}

// Loading overlay (for modals, etc.)
export function LoadingOverlay({ message = "Laddar..." }: { message?: string }) {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="text-center">
        <Loader2 className="mx-auto mb-2 h-6 w-6 animate-spin text-pink-600" />
        <p className="text-xs font-medium text-gray-600">{message}</p>
      </div>
    </div>
  );
}

// Button loading state
export function ButtonLoader() {
  return (
    <div className="flex items-center gap-2">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span>Laddar...</span>
    </div>
  );
}

// Generic loading spinner with text (used in integration)
export function LoadingSpinner({ 
  size = "medium", 
  text 
}: { 
  size?: "small" | "medium" | "large"; 
  text?: string;
}) {
  const sizeClasses = {
    small: "h-4 w-4",
    medium: "h-6 w-6",
    large: "h-8 w-8",
  };

  const textSizeClasses = {
    small: "text-xs",
    medium: "text-sm",
    large: "text-base",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <Loader2 className={`animate-spin text-pink-600 ${sizeClasses[size]}`} />
      {text && (
        <p className={`font-medium text-gray-600 ${textSizeClasses[size]}`}>
          {text}
        </p>
      )}
    </div>
  );
}