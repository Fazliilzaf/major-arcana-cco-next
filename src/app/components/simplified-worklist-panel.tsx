import { Zap, CheckSquare, ChevronDown, ChevronRight, Inbox, Timer, AlertCircle, Calendar, CalendarClock, AlertTriangle, UserX, Stethoscope, Shield, Clock } from "lucide-react";
import { useState } from "react";
import { MinimalMessageItem } from "./minimal-message-item";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SimplifiedWorklistPanelProps {
  selectedMessage: string | null;
  onSelectMessage: (id: string) => void;
  activeFilters: string[];
  showSprintBox: boolean;
  selectedMailboxes: string[];
  snoozedMessages?: string[]; // IDs of messages marked as "later"
  onSnoozeMessage?: (messageId: string) => void;
  onUnsnoozeMessage?: (messageId: string) => void;
}

// Category definitions
interface Category {
  id: string;
  label: string;
  icon: any;
  color?: "red" | "blue" | "amber" | "purple" | "green";
}

const categories: Category[] = [
  { id: "all", label: "Alla trådar", icon: Inbox },
  { id: "later", label: "Senare", icon: Clock, color: "blue" },
  { id: "sprint", label: "Sprint", icon: Zap, color: "green" },
  { id: "act-now", label: "Agera nu", icon: AlertCircle, color: "red" },
  { id: "bookable", label: "Bokningsåkara", icon: Calendar, color: "blue" },
  { id: "today", label: "Idag", icon: Timer, color: "amber" },
  { id: "tomorrow", label: "Imorgon", icon: CalendarClock, color: "amber" },
  { id: "high-risk", label: "Hög risk", icon: AlertTriangle, color: "red" },
  { id: "unassigned", label: "Oägda", icon: UserX, color: "purple" },
  { id: "medical", label: "Medicinsk granskning", icon: Stethoscope, color: "purple" },
  { id: "admin", label: "Admin", icon: Shield },
];

// Sortable Category Component
function SortableCategory({ 
  category, 
  isExpanded, 
  messageCount, 
  onToggle,
  children,
  getColorClasses,
  getCategoryBgClasses,
  getCategoryHoverClasses
}: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const Icon = category.icon;

  return (
    <div ref={setNodeRef} style={style} className="border-b border-gray-100 dark:border-gray-800">
      {/* Category Header - Separated click and drag areas */}
      <div
        className={`flex items-center justify-between transition-colors ${
          getCategoryBgClasses(category.color)
        }`}
      >
        {/* Drag Handle - LEFT */}
        <button
          {...attributes}
          {...listeners}
          className="px-2 py-2 cursor-grab active:cursor-grabbing hover:bg-black/5 transition-colors"
          title="Dra för att omorganisera"
        >
          <div className="flex flex-col gap-0.5">
            <div className="w-1 h-1 rounded-full bg-gray-400"></div>
            <div className="w-1 h-1 rounded-full bg-gray-400"></div>
            <div className="w-1 h-1 rounded-full bg-gray-400"></div>
          </div>
        </button>

        {/* Clickable expand/collapse area - CENTER & RIGHT */}
        <button
          onClick={onToggle}
          className={`flex-1 flex items-center justify-between pr-3 py-2 ${getCategoryHoverClasses(category.color)}`}
          title="Klicka för att expandera/kollapsa"
        >
          <div className="flex items-center gap-2">
            {isExpanded ? (
              <ChevronDown className={`h-3.5 w-3.5 ${getColorClasses(category.color)}`} />
            ) : (
              <ChevronRight className={`h-3.5 w-3.5 ${getColorClasses(category.color)}`} />
            )}
            <Icon className={`h-3.5 w-3.5 ${getColorClasses(category.color)}`} />
            <span className="text-[11px] font-semibold text-gray-900 dark:text-gray-100">
              {category.label}
            </span>
          </div>
          <span className="text-[10px] font-semibold text-gray-600 dark:text-gray-400">
            {messageCount}
          </span>
        </button>
      </div>

      {/* Category Messages - Expandable */}
      {isExpanded && children}
    </div>
  );
}

export function SimplifiedWorklistPanel({
  selectedMessage,
  onSelectMessage,
  activeFilters,
  showSprintBox,
  selectedMailboxes,
  snoozedMessages,
  onSnoozeMessage,
  onUnsnoozeMessage,
}: SimplifiedWorklistPanelProps) {
  const [listMode, setListMode] = useState("normal");
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["all"]);
  const [orderedCategories, setOrderedCategories] = useState<Category[]>(categories);

  // Mock data
  const allMessages = [
    {
      id: "1",
      sender: "Anna Karlsson",
      subject: "Akut ombokning idag",
      preview: "Måste tyvärr ställa in imorgon...",
      time: "11:42",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      unread: true,
      sla: "1h",
      slaStatus: "breach" as const,
      priority: "sprint" as const,
      warmth: "hot" as const,
      intent: "Omboka",
      sentiment: "worried" as const,
      isVIP: true,
      receivedAt: "contact@",
      mailboxId: "contact",
      tags: ["sprint", "act-now", "today", "high-risk"],
    },
    {
      id: "2",
      sender: "Erik Johansson",
      subject: "Bokningsfråga fillers",
      preview: "Hej, jag undrar över priser...",
      time: "10:15",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      unread: true,
      sla: "2h",
      slaStatus: "warning" as const,
      priority: "sprint" as const,
      warmth: "warm" as const,
      intent: "Bokning",
      sentiment: "excited" as const,
      isVIP: false,
      receivedAt: "bokning@",
      mailboxId: "info",
      tags: ["sprint", "act-now", "bookable"],
    },
    {
      id: "3",
      sender: "Maria Andersson",
      subject: "Fråga om botox",
      preview: "Kan jag få information om...",
      time: "Igår",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      unread: false,
      sla: "4h",
      slaStatus: "ok" as const,
      priority: "normal" as const,
      warmth: "neutral" as const,
      intent: "Info",
      sentiment: "neutral" as const,
      isVIP: false,
      receivedAt: "info@",
      mailboxId: "info",
      tags: ["today", "bookable"],
    },
  ];

  const handleCategoryToggle = (categoryId: string) => {
    setExpandedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const getCategoryMessages = (categoryId: string) => {
    // Filter by selected mailboxes first
    const mailboxFilteredMessages = allMessages.filter(msg => 
      !selectedMailboxes || selectedMailboxes.length === 0 || selectedMailboxes.includes(msg.mailboxId)
    );

    if (categoryId === "all") {
      return mailboxFilteredMessages;
    }
    
    // Special handling for "later" category - shows snoozed messages
    if (categoryId === "later") {
      return mailboxFilteredMessages.filter((msg) => 
        snoozedMessages && snoozedMessages.includes(msg.id)
      );
    }
    
    return mailboxFilteredMessages.filter((msg) => msg.tags.includes(categoryId));
  };

  const getColorClasses = (color?: string) => {
    switch (color) {
      case "red":
        return "text-red-600 dark:text-red-400";
      case "blue":
        return "text-blue-600 dark:text-blue-400";
      case "amber":
        return "text-amber-600 dark:text-amber-400";
      case "purple":
        return "text-purple-600 dark:text-purple-400";
      case "green":
        return "text-emerald-600 dark:text-emerald-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  const getCategoryBgClasses = (color?: string) => {
    switch (color) {
      case "red":
        return "bg-red-50 dark:bg-red-950/30 border-l-4 border-l-red-500";
      case "blue":
        return "bg-blue-50 dark:bg-blue-950/30 border-l-4 border-l-blue-500";
      case "amber":
        return "bg-amber-50 dark:bg-amber-950/30 border-l-4 border-l-amber-500";
      case "purple":
        return "bg-purple-50 dark:bg-purple-950/30 border-l-4 border-l-purple-500";
      case "green":
        return "bg-emerald-50 dark:bg-emerald-950/30 border-l-4 border-l-emerald-500";
      default:
        return "bg-gray-50 dark:bg-gray-900/30 border-l-4 border-l-gray-400";
    }
  };

  const getCategoryHoverClasses = (color?: string) => {
    switch (color) {
      case "red":
        return "hover:bg-red-100 dark:hover:bg-red-950/50";
      case "blue":
        return "hover:bg-blue-100 dark:hover:bg-blue-950/50";
      case "amber":
        return "hover:bg-amber-100 dark:hover:bg-amber-950/50";
      case "purple":
        return "hover:bg-purple-100 dark:hover:bg-purple-950/50";
      case "green":
        return "hover:bg-emerald-100 dark:hover:bg-emerald-950/50";
      default:
        return "hover:bg-gray-100 dark:hover:bg-gray-800/50";
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setOrderedCategories((items) => {
        const oldIndex = items.findIndex(cat => cat.id === active.id);
        const newIndex = items.findIndex(cat => cat.id === over?.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-800 px-3 py-2">
        <h2 className="text-[11px] font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide">
          Worklist <span className="text-pink-600">({allMessages.filter(msg => !selectedMailboxes || selectedMailboxes.length === 0 || selectedMailboxes.includes(msg.mailboxId)).length})</span>
        </h2>
      </div>

      {/* Categories List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={orderedCategories.map(cat => cat.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex-1 overflow-y-auto">
            {orderedCategories.map((category) => {
              const categoryMessages = getCategoryMessages(category.id);
              const isExpanded = expandedCategories.includes(category.id);

              return (
                <SortableCategory
                  key={category.id}
                  category={category}
                  isExpanded={isExpanded}
                  messageCount={categoryMessages.length}
                  onToggle={() => handleCategoryToggle(category.id)}
                  getColorClasses={getColorClasses}
                  getCategoryBgClasses={getCategoryBgClasses}
                  getCategoryHoverClasses={getCategoryHoverClasses}
                >
                  <div className="bg-white dark:bg-gray-950">
                    {categoryMessages.length === 0 ? (
                      <div className="px-4 py-3 text-center text-[10px] text-gray-500 dark:text-gray-400">
                        Inga meddelanden
                      </div>
                    ) : (
                      categoryMessages.map((message) => (
                        <MinimalMessageItem
                          key={message.id}
                          message={message}
                          isSelected={selectedMessage === message.id}
                          onClick={() => onSelectMessage(message.id)}
                          showReceivedAt={true}
                        />
                      ))
                    )}
                  </div>
                </SortableCategory>
              );
            })}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}