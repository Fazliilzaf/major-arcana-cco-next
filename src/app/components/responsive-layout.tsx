import { ReactNode, useState } from "react";
import { Menu, X } from "lucide-react";

interface ResponsiveLayoutProps {
  leftColumn: ReactNode;
  centerColumn: ReactNode;
  rightColumn: ReactNode;
  isFocusMode?: boolean;
}

export function ResponsiveLayout({ 
  leftColumn, 
  centerColumn, 
  rightColumn,
  isFocusMode = false 
}: ResponsiveLayoutProps) {
  const [showLeftMobile, setShowLeftMobile] = useState(false);
  const [showRightMobile, setShowRightMobile] = useState(false);

  if (isFocusMode) {
    return <div className="flex-1">{centerColumn}</div>;
  }

  return (
    <>
      {/* Desktop & Laptop (>= 1024px) - Three columns */}
      <div className="hidden lg:flex flex-1 overflow-hidden">
        <div className="w-1/4 min-w-[300px] max-w-[400px] border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          {leftColumn}
        </div>
        <div className="flex-1 overflow-y-auto">
          {centerColumn}
        </div>
        <div className="w-1/4 min-w-[300px] max-w-[400px] border-l border-gray-200 dark:border-gray-700 overflow-y-auto">
          {rightColumn}
        </div>
      </div>

      {/* Tablet (768px - 1023px) - Two columns + drawer */}
      <div className="hidden md:flex lg:hidden flex-1 overflow-hidden">
        <div className="w-1/3 min-w-[280px] border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
          {leftColumn}
        </div>
        <div className="flex-1 overflow-y-auto relative">
          {centerColumn}
          
          {/* Right panel toggle button */}
          <button
            onClick={() => setShowRightMobile(true)}
            className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg flex items-center justify-center hover:shadow-xl transition-all z-30"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        
        {/* Right panel drawer */}
        {showRightMobile && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setShowRightMobile(false)}
            />
            <div className="fixed right-0 top-0 bottom-0 w-80 bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-y-auto animate-in slide-in-from-right duration-200">
              <button
                onClick={() => setShowRightMobile(false)}
                className="sticky top-4 left-4 w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
              {rightColumn}
            </div>
          </>
        )}
      </div>

      {/* Mobile (< 768px) - Single column + drawers */}
      <div className="flex md:hidden flex-1 overflow-hidden relative">
        {/* Main content */}
        <div className="flex-1 overflow-y-auto">
          {centerColumn}
        </div>

        {/* Bottom navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t-2 border-gray-200 dark:border-gray-700 p-4 flex items-center justify-around z-30">
          <button
            onClick={() => setShowLeftMobile(true)}
            className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">Messages</span>
          </button>
          <button
            onClick={() => setShowRightMobile(true)}
            className="flex flex-col items-center gap-1 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">Customer</span>
          </button>
        </div>

        {/* Left drawer */}
        {showLeftMobile && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setShowLeftMobile(false)}
            />
            <div className="fixed left-0 top-0 bottom-0 w-full max-w-sm bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-y-auto animate-in slide-in-from-left duration-200">
              <button
                onClick={() => setShowLeftMobile(false)}
                className="sticky top-4 right-4 ml-auto mr-4 w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
              {leftColumn}
            </div>
          </>
        )}

        {/* Right drawer */}
        {showRightMobile && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setShowRightMobile(false)}
            />
            <div className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-y-auto animate-in slide-in-from-right duration-200">
              <button
                onClick={() => setShowRightMobile(false)}
                className="sticky top-4 left-4 w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
              {rightColumn}
            </div>
          </>
        )}
      </div>
    </>
  );
}

// Hook to detect screen size
export function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<"mobile" | "tablet" | "laptop" | "desktop">("desktop");

  useState(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 768) setBreakpoint("mobile");
      else if (width < 1024) setBreakpoint("tablet");
      else if (width < 1440) setBreakpoint("laptop");
      else setBreakpoint("desktop");
    };

    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);
    return () => window.removeEventListener("resize", updateBreakpoint);
  });

  return breakpoint;
}
