import { Target, Calendar, AlertTriangle, GripHorizontal } from "lucide-react";
import { toast } from "sonner";
import { useState, useRef, useEffect } from "react";

interface DoThisNowCardProps {
  action: string;
  description: string;
  urgentReason: string;
  onQuickAction?: () => void;
  actionButtonText?: string;
}

export function DoThisNowCard({ 
  action, 
  description, 
  urgentReason, 
  onQuickAction,
  actionButtonText = "Snabbåtgärd"
}: DoThisNowCardProps) {
  const [height, setHeight] = useState(200); // Default height i pixels
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);

  const MIN_HEIGHT = 120;
  const MAX_HEIGHT = 500;

  // Handle mouse move during drag
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaY = e.clientY - startYRef.current;
      const newHeight = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, startHeightRef.current + deltaY));
      setHeight(newHeight);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      // Save to localStorage
      localStorage.setItem('do-this-now-height', height.toString());
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'row-resize';
    } else {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, height]);

  // Load height from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('do-this-now-height');
    if (saved) {
      setHeight(parseInt(saved, 10));
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    startYRef.current = e.clientY;
    startHeightRef.current = height;
  };

  const handleDoubleClick = () => {
    setHeight(200); // Reset to default
    localStorage.removeItem('do-this-now-height');
  };

  return (
    <div className="flex flex-col">
      <div 
        className="rounded-lg bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-300 shadow-sm overflow-hidden flex flex-col"
        style={{ height: `${height}px` }}
      >
        {/* Header */}
        <div className="flex items-center gap-2 p-3 flex-shrink-0">
          <Target className="h-4 w-4 text-amber-700" />
          <h5 className="text-xs font-bold text-gray-900 uppercase tracking-wide">
            🎯 GÖR DETTA NU ★★★
          </h5>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-3">
          {/* Action */}
          <div>
            <p className="text-sm font-bold text-gray-900 mb-1">
              {action}
            </p>
            <p className="text-[11px] text-gray-700">
              {description}
            </p>
          </div>

          {/* Quick Action Button (om tillgänglig) */}
          {onQuickAction && (
            <button
              onClick={onQuickAction}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-pink-600 to-rose-600 text-white text-[11px] font-bold hover:from-pink-700 hover:to-rose-700 transition-all shadow-sm"
            >
              <Calendar className="h-3.5 w-3.5" />
              {actionButtonText}
            </button>
          )}

          {/* Urgent Reason */}
          <div className="rounded-lg bg-white/60 border border-amber-300 p-2.5">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-700 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-amber-900 uppercase tracking-wide mb-0.5">
                  ⚡ Varför i fokus
                </p>
                <p className="text-[11px] text-amber-800 leading-tight">
                  {urgentReason}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Resize Handle */}
      <div 
        className="relative group cursor-row-resize"
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
        style={{ height: '12px', marginTop: '-6px', marginBottom: '-6px' }}
      >
        <div 
          className={`absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 bg-transparent hover:bg-amber-400 transition-colors flex items-center justify-center ${
            isDragging ? 'bg-amber-500' : ''
          }`}
          style={{ height: '4px' }}
        >
          <GripHorizontal 
            className={`h-3 w-3 text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity ${
              isDragging ? 'opacity-100' : ''
            }`}
          />
        </div>
        <div 
          className={`absolute inset-0 ${isDragging ? 'bg-amber-100/20' : ''}`}
        />
      </div>
    </div>
  );
}