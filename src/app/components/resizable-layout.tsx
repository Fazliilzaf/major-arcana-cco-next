import { useState, useEffect, useRef, ReactNode } from 'react';

interface ResizableLayoutProps {
  leftColumn: ReactNode;
  centerColumn: ReactNode;
  rightColumn: ReactNode;
  isFocusMode?: boolean;
}

const DEFAULT_WIDTHS = {
  left: 25,
  center: 50,
  right: 25,
};

const MIN_WIDTH = 15;
const MAX_WIDTH = 70;

export function ResizableLayout({ leftColumn, centerColumn, rightColumn, isFocusMode = false }: ResizableLayoutProps) {
  const [widths, setWidths] = useState(DEFAULT_WIDTHS);
  const [isDragging, setIsDragging] = useState<'left' | 'right' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load saved widths from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('cco-column-widths');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setWidths(parsed);
      } catch (e) {
        // Ignore parsing errors
      }
    }
  }, []);

  // Save widths to localStorage
  const saveWidths = (newWidths: typeof DEFAULT_WIDTHS) => {
    localStorage.setItem('cco-column-widths', JSON.stringify(newWidths));
    setWidths(newWidths);
  };

  // Handle mouse move during drag
  useEffect(() => {
    if (!isDragging || !containerRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const mouseX = e.clientX - containerRect.left;
      const percentage = (mouseX / containerWidth) * 100;

      if (isDragging === 'left') {
        // Dragging left handle
        const newLeftWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, percentage));
        const remaining = 100 - newLeftWidth;
        const centerRatio = widths.center / (widths.center + widths.right);
        const newCenterWidth = remaining * centerRatio;
        const newRightWidth = remaining - newCenterWidth;

        setWidths({
          left: newLeftWidth,
          center: newCenterWidth,
          right: newRightWidth,
        });
      } else if (isDragging === 'right') {
        // Dragging right handle
        const newLeftAndCenterWidth = Math.max(
          widths.left + MIN_WIDTH,
          Math.min(100 - MIN_WIDTH, percentage)
        );
        const newRightWidth = 100 - newLeftAndCenterWidth;

        // Maintain left width, adjust center
        const newCenterWidth = newLeftAndCenterWidth - widths.left;

        setWidths({
          left: widths.left,
          center: newCenterWidth,
          right: newRightWidth,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(null);
      // Save to localStorage when drag ends
      saveWidths(widths);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, widths]);

  // Prevent text selection during drag
  useEffect(() => {
    if (isDragging) {
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'col-resize';
    } else {
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    }
  }, [isDragging]);

  const handleDoubleClick = (handle: 'left' | 'right') => {
    saveWidths(DEFAULT_WIDTHS);
  };

  return (
    <div ref={containerRef} className="flex flex-1 overflow-hidden relative">
      {/* Left Column */}
      <div
        className="border-r border-gray-200 bg-white flex flex-col"
        style={{ width: `${widths.left}%` }}
      >
        {leftColumn}
      </div>

      {/* Left Resize Handle */}
      <div
        className={`relative group ${isDragging === 'left' ? 'z-50' : 'z-10'}`}
        onMouseDown={() => setIsDragging('left')}
        onDoubleClick={() => handleDoubleClick('left')}
        style={{ width: '8px', marginLeft: '-4px', marginRight: '-4px' }}
      >
        <div
          className={`absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 bg-transparent hover:bg-pink-400 transition-colors cursor-col-resize ${
            isDragging === 'left' ? 'bg-pink-500' : ''
          }`}
          style={{ width: '4px' }}
        />
        <div
          className={`absolute inset-y-0 -left-1 right-0 cursor-col-resize ${
            isDragging === 'left' ? 'bg-pink-100/20' : ''
          }`}
        />
      </div>

      {/* Center Column */}
      <div
        className="border-r border-gray-200 bg-white flex flex-col"
        style={{ width: `${widths.center}%` }}
      >
        {centerColumn}
      </div>

      {/* Right Resize Handle */}
      <div
        className={`relative group ${isDragging === 'right' ? 'z-50' : 'z-10'}`}
        onMouseDown={() => setIsDragging('right')}
        onDoubleClick={() => handleDoubleClick('right')}
        style={{ width: '8px', marginLeft: '-4px', marginRight: '-4px' }}
      >
        <div
          className={`absolute inset-y-0 left-1/2 -translate-x-1/2 w-1 bg-transparent hover:bg-pink-400 transition-colors cursor-col-resize ${
            isDragging === 'right' ? 'bg-pink-500' : ''
          }`}
          style={{ width: '4px' }}
        />
        <div
          className={`absolute inset-y-0 left-0 -right-1 cursor-col-resize ${
            isDragging === 'right' ? 'bg-pink-100/20' : ''
          }`}
        />
      </div>

      {/* Right Column */}
      <div
        className="bg-white flex flex-col"
        style={{ width: `${widths.right}%` }}
      >
        {rightColumn}
      </div>
    </div>
  );
}