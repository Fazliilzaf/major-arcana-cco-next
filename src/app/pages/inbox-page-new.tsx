import { useState, useRef, useEffect } from "react";
import { WorklistPanel } from "../components/worklist-panel";
import { ConversationFocusPanel } from "../components/conversation-focus-panel";
import { SvarsstudioPanel } from "../components/svarsstudio-panel";
import { CustomerIntelligencePanel } from "../components/customer-intelligence-panel";
import { SubHeaderPills } from "../components/sub-header-pills";
import { GripVertical } from "lucide-react";

export function InboxPageNew() {
  const [selectedMessage, setSelectedMessage] = useState<string | null>("1");
  const [worklistWidth, setWorklistWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Resizing logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const newWidth = e.clientX;
      // Min 200px, Max 600px
      if (newWidth >= 200 && newWidth <= 600) {
        setWorklistWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing]);

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      {/* Sub-header Pills */}
      <SubHeaderPills />

      {/* 3-Column Layout */}
      <div ref={containerRef} className="flex-1 flex overflow-hidden">
        {/* LEFT: Worklist - RESIZABLE */}
        <div 
          className="flex-shrink-0 overflow-hidden relative"
          style={{ width: `${worklistWidth}px` }}
        >
          <WorklistPanel 
            selectedMessage={selectedMessage}
            onSelectMessage={setSelectedMessage}
          />
          
          {/* Resize Handle */}
          <div
            onMouseDown={() => setIsResizing(true)}
            className={`absolute top-0 right-0 h-full w-1.5 cursor-col-resize group transition-all z-20 ${
              isResizing 
                ? 'bg-pink-500' 
                : 'hover:bg-pink-400/50'
            }`}
          >
            <div className={`absolute top-1/2 right-0 -translate-y-1/2 transition-opacity ${
              isResizing ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}>
              <div className="bg-pink-500 rounded px-0.5 shadow-lg">
                <GripVertical className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* MIDDLE: Conversation - flex-1 */}
        <div className="flex-1 overflow-hidden border-r border-gray-200 dark:border-gray-800">
          <ConversationFocusPanel />
        </div>

        {/* RIGHT: Combined Panel - 360px */}
        <div className="w-[360px] flex-shrink-0 flex flex-col overflow-hidden">
          {/* Top: Svarsstudio */}
          <div className="flex-shrink-0 max-h-[50%] overflow-y-auto">
            <SvarsstudioPanel />
          </div>

          {/* Bottom: Customer Intelligence */}
          <div className="flex-1 overflow-hidden border-t border-gray-200 dark:border-gray-800">
            <CustomerIntelligencePanel />
          </div>
        </div>
      </div>
    </div>
  );
}