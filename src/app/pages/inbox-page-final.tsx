import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels"
import { SimplifiedWorklistPanel } from "../components/simplified-worklist-panel"
import { ConversationFocusPanel } from "../components/conversation-focus-panel"
import { CustomerIntelligencePanel } from "../components/customer-intelligence-panel"
import { InboxHeader } from "../components/inbox/inbox-header"
import { MobileDrawer } from "../components/inbox/mobile-drawer"
import { useInboxState } from "../hooks/use-inbox-state"

/**
 * InboxPageFinal
 *
 * Top-level inbox page rendered on `/`. Responsible only for composing
 * the header, the 3-column desktop layout and the mobile/tablet
 * drawers. All state and interaction logic lives in `useInboxState`,
 * and the individual panels own their own presentation.
 *
 * Layout breakpoints:
 *  - `<lg`  : Single-column conversation view + left drawer for worklist
 *  - `lg`   : 2 columns (worklist + conversation), customer panel in drawer
 *  - `xl`   : Full 3-column resizable layout
 */
export function InboxPageFinal() {
  const inbox = useInboxState()

  const worklistProps = {
    selectedMessage: inbox.selectedMessage,
    activeFilters: inbox.activeFilters,
    showSprintBox: inbox.showSprintBox,
    selectedMailboxes: inbox.selectedMailboxes,
    snoozedMessages: inbox.snoozedMessages,
    onSnoozeMessage: inbox.snoozeMessage,
    onUnsnoozeMessage: inbox.unsnoozeMessage,
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <InboxHeader
        selectedMailboxes={inbox.selectedMailboxes}
        onToggleMailbox={inbox.toggleMailbox}
        onToggleMobileWorklist={() => inbox.setShowMobileWorklist((v) => !v)}
        onToggleCustomerDrawer={() => inbox.setShowCustomerDrawer((v) => !v)}
      />

      {/* Mobile worklist drawer (hidden on lg+) */}
      <MobileDrawer
        open={inbox.showMobileWorklist}
        onClose={() => inbox.setShowMobileWorklist(false)}
        title="Worklist"
        side="left"
        hideAt="lg"
      >
        <SimplifiedWorklistPanel
          {...worklistProps}
          onSelectMessage={(id) => {
            inbox.setSelectedMessage(id)
            inbox.setShowMobileWorklist(false)
          }}
        />
      </MobileDrawer>

      {/* Tablet/mobile customer drawer (hidden on xl+) */}
      <MobileDrawer
        open={inbox.showCustomerDrawer}
        onClose={() => inbox.setShowCustomerDrawer(false)}
        title="Kundinfo"
        side="right"
        hideAt="xl"
      >
        <CustomerIntelligencePanel />
      </MobileDrawer>

      {/* Desktop: 3-column resizable layout */}
      <div className="flex-1 overflow-hidden hidden lg:flex">
        <PanelGroup direction="horizontal">
          <Panel defaultSize={25} minSize={20} maxSize={40}>
            <SimplifiedWorklistPanel
              {...worklistProps}
              onSelectMessage={inbox.setSelectedMessage}
            />
          </Panel>

          <PanelResizeHandle className="w-1 bg-gray-200 dark:bg-gray-700 hover:bg-pink-400 dark:hover:bg-pink-600 transition-colors cursor-col-resize active:bg-pink-500 dark:active:bg-pink-500" />

          <Panel defaultSize={50} minSize={30} maxSize={60}>
            <ConversationFocusPanel
              selectedMessage={inbox.selectedMessage}
              onSnoozeMessage={inbox.snoozeMessage}
            />
          </Panel>

          <PanelResizeHandle className="w-1 bg-gray-200 dark:bg-gray-700 hover:bg-pink-400 dark:hover:bg-pink-600 transition-colors cursor-col-resize active:bg-pink-500 dark:active:bg-pink-500" />

          <Panel defaultSize={25} minSize={20} maxSize={40}>
            <CustomerIntelligencePanel />
          </Panel>
        </PanelGroup>
      </div>

      {/* Mobile/tablet: conversation only, worklist is in a drawer */}
      <div className="flex-1 overflow-hidden lg:hidden">
        <ConversationFocusPanel
          selectedMessage={inbox.selectedMessage}
          onSnoozeMessage={inbox.snoozeMessage}
        />
      </div>
    </div>
  )
}
