import { useState } from "react";
import { ChevronDown, Menu, X, User, Globe } from "lucide-react";
import { SimplifiedWorklistPanel } from "../components/simplified-worklist-panel";
import { ConversationFocusPanel } from "../components/conversation-focus-panel";
import { CustomerIntelligencePanel } from "../components/customer-intelligence-panel";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { useLanguage } from "../context/language-context";

// Mailbox definitions
interface Mailbox {
  id: string;
  email: string;
  label: string;
}

const mailboxes: Mailbox[] = [
  { id: "egzona", email: "egzona@hairtpclinic.com", label: "Egzona" },
  { id: "contact", email: "contact@hairtpclinic.com", label: "Contact" },
  { id: "fazli", email: "fazli@hairtpclinic.com", label: "Fazli" },
  { id: "kvitto", email: "kvitto@hairtpclinic.com", label: "Kvitto" },
  { id: "info", email: "info@hairtpclinic.com", label: "Info" },
  { id: "kons", email: "kons@hairtpclinic.com", label: "Kons" },
  { id: "marknad", email: "marknad@hairtpclinic.com", label: "Marknad" },
];

export function InboxPageFinal() {
  const { language, setLanguage } = useLanguage();
  const [selectedMessage, setSelectedMessage] = useState<string | null>("1");
  const [activeFilters, setActiveFilters] = useState<string[]>(["all"]);
  const [expandedFilters, setExpandedFilters] = useState<string[]>([]);
  const [selectedMailboxes, setSelectedMailboxes] = useState<string[]>(mailboxes.map(m => m.id));
  const [showMailboxDropdown, setShowMailboxDropdown] = useState(false);
  
  // Mobile/Tablet states
  const [mobileView, setMobileView] = useState<"worklist" | "conversation" | "customer">("conversation");
  const [showMobileWorklist, setShowMobileWorklist] = useState(false);
  const [showCustomerDrawer, setShowCustomerDrawer] = useState(false);

  const handleToggleFilter = (filterId: string) => {
    setActiveFilters((prev) => {
      // If clicking "all", clear all other filters
      if (filterId === "all") {
        return ["all"];
      }

      // If "all" is active and clicking another filter, remove "all"
      if (prev.includes("all")) {
        return [filterId];
      }

      // Toggle the filter
      if (prev.includes(filterId)) {
        const newFilters = prev.filter((f) => f !== filterId);
        return newFilters.length === 0 ? ["all"] : newFilters;
      } else {
        return [...prev, filterId];
      }
    });
  };

  const handleToggleExpand = (filterId: string) => {
    setExpandedFilters((prev) => {
      if (prev.includes(filterId)) {
        return prev.filter((f) => f !== filterId);
      } else {
        return [...prev, filterId];
      }
    });
  };

  const handleMailboxToggle = (mailboxId: string) => {
    setSelectedMailboxes((prev) => {
      if (prev.includes(mailboxId)) {
        const newSelection = prev.filter((id) => id !== mailboxId);
        return newSelection.length === 0 ? prev : newSelection;
      } else {
        return [...prev, mailboxId];
      }
    });
  };

  // Show sprint box if sprint or act-now filter is active
  const showSprintBox = activeFilters.includes("sprint") || activeFilters.includes("act-now");

  // Get button text based on selected mailboxes
  const getMailboxButtonText = () => {
    if (selectedMailboxes.length === mailboxes.length) {
      return "Hair TP Clinic - Alla mailboxar";
    } else if (selectedMailboxes.length === 1) {
      const selectedMailbox = mailboxes.find(m => m.id === selectedMailboxes[0]);
      return `Hair TP Clinic - ${selectedMailbox?.label || "1 vald"}`;
    } else {
      return `Hair TP Clinic - ${selectedMailboxes.length} valda`;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      {/* Header with mailbox selector */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-2 sm:px-4 py-1.5">
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileWorklist(!showMobileWorklist)}
            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>

          {/* Mailbox Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowMailboxDropdown(!showMailboxDropdown)}
              className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-bold bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors truncate max-w-[180px] sm:max-w-none"
            >
              <span className="truncate">{getMailboxButtonText()}</span>
              <ChevronDown className="h-2.5 w-2.5 flex-shrink-0" />
            </button>

            {/* Dropdown Menu */}
            {showMailboxDropdown && (
              <>
                {/* Backdrop for mobile */}
                <div 
                  className="fixed inset-0 z-40 lg:hidden" 
                  onClick={() => setShowMailboxDropdown(false)}
                />
                
                <div className="absolute top-full left-0 mt-1 w-36 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden">
                  <div className="px-2.5 py-1.5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20">
                    <div className="text-[8px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                      Välj mailboxar
                    </div>
                  </div>
                  <div className="py-1 max-h-64 overflow-y-auto">
                    {mailboxes.map((mailbox, index) => {
                      // Count messages per mailbox (mock for now)
                      const messageCount = mailbox.id === "egzona" ? 2 : mailbox.id === "fazli" ? 2 : mailbox.id === "contact" ? 1 : mailbox.id === "kvitto" ? 1 : 0;
                      
                      // Alternate colors for checkboxes
                      const isChecked = selectedMailboxes.includes(mailbox.id);
                      const checkboxColor = index % 2 === 0 ? 'accent-pink-500' : 'accent-blue-500';
                      
                      return (
                        <label
                          key={mailbox.id}
                          className="flex items-center gap-2 cursor-pointer hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 dark:hover:from-pink-950/20 dark:hover:to-purple-950/20 px-2.5 py-1 transition-all group"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleMailboxToggle(mailbox.id)}
                            className={`w-3.5 h-3.5 rounded border-2 ${isChecked ? 'border-transparent' : 'border-gray-300 dark:border-gray-600'} ${checkboxColor} focus:ring-2 focus:ring-pink-500 focus:ring-offset-0 transition-all`}
                          />
                          <div className="flex items-center gap-1.5">
                            <div className="text-[11px] font-semibold text-gray-800 dark:text-gray-200">
                              {mailbox.label}
                            </div>
                            {messageCount > 0 && (
                              <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                {messageCount}
                              </span>
                            )}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Ägarvy Dropdown */}
          <button className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            Ägarvy
            <ChevronDown className="h-2.5 w-2.5" />
          </button>

          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] text-gray-600 dark:text-gray-400 ml-auto">
            1 oägda · 2 hög risk · vecka 2026-04-22 17:18
          </span>
          
          {/* Customer Info Button (Mobile/Tablet) */}
          <button
            onClick={() => setShowCustomerDrawer(!showCustomerDrawer)}
            className="xl:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title="Kundinfo"
          >
            <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* MOBILE: Worklist Drawer (overlay) */}
      {showMobileWorklist && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-in fade-in duration-200"
            onClick={() => setShowMobileWorklist(false)}
          />
          <div className="fixed left-0 top-0 bottom-0 w-[280px] sm:w-[320px] bg-white dark:bg-gray-900 z-50 lg:hidden shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Worklist</h3>
              <button
                onClick={() => setShowMobileWorklist(false)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            <SimplifiedWorklistPanel
              selectedMessage={selectedMessage}
              onSelectMessage={(id) => {
                setSelectedMessage(id);
                setShowMobileWorklist(false);
              }}
              activeFilters={activeFilters}
              showSprintBox={showSprintBox}
              selectedMailboxes={selectedMailboxes}
            />
          </div>
        </>
      )}

      {/* TABLET/MOBILE: Customer Drawer (overlay) */}
      {showCustomerDrawer && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40 xl:hidden animate-in fade-in duration-200"
            onClick={() => setShowCustomerDrawer(false)}
          />
          <div className="fixed right-0 top-0 bottom-0 w-[320px] sm:w-[360px] bg-white dark:bg-gray-900 z-50 xl:hidden shadow-2xl overflow-hidden animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Kundinfo</h3>
              <button
                onClick={() => setShowCustomerDrawer(false)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            <CustomerIntelligencePanel />
          </div>
        </>
      )}

      {/* DESKTOP: 3-Column Resizable Layout */}
      <div className="flex-1 overflow-hidden hidden lg:flex">
        <PanelGroup direction="horizontal">
          {/* LEFT: Simplified Worklist  */}
          <Panel defaultSize={25} minSize={20} maxSize={40}>
            <SimplifiedWorklistPanel
              selectedMessage={selectedMessage}
              onSelectMessage={setSelectedMessage}
              activeFilters={activeFilters}
              showSprintBox={showSprintBox}
              selectedMailboxes={selectedMailboxes}
            />
          </Panel>

          <PanelResizeHandle className="w-1 bg-gray-200 dark:bg-gray-700 hover:bg-pink-400 dark:hover:bg-pink-600 transition-colors cursor-col-resize active:bg-pink-500 dark:active:bg-pink-500" />

          {/* MIDDLE: Conversation - flex-1 */}
          <Panel defaultSize={50} minSize={30} maxSize={60}>
            <ConversationFocusPanel />
          </Panel>

          <PanelResizeHandle className="w-1 bg-gray-200 dark:bg-gray-700 hover:bg-pink-400 dark:hover:bg-pink-600 transition-colors cursor-col-resize active:bg-pink-500 dark:active:bg-pink-500" />

          {/* RIGHT: Customer Intelligence */}
          <Panel defaultSize={25} minSize={20} maxSize={40}>
            <CustomerIntelligencePanel />
          </Panel>
        </PanelGroup>
      </div>

      {/* MOBILE/TABLET: Conversation Only (no worklist) */}
      <div className="flex-1 overflow-hidden lg:hidden">
        <ConversationFocusPanel />
      </div>
    </div>
  );
}