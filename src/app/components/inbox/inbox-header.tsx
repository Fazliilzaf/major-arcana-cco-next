import { ChevronDown, Menu, User } from "lucide-react"
import { MailboxSelector } from "./mailbox-selector"

interface InboxHeaderProps {
  selectedMailboxes: string[]
  onToggleMailbox: (mailboxId: string) => void
  onToggleMobileWorklist: () => void
  onToggleCustomerDrawer: () => void
}

/**
 * Top bar of the inbox page. Contains the mobile menu trigger, the
 * mailbox selector, the "Ägarvy" placeholder, a compact stats line and
 * the tablet/mobile customer-drawer trigger.
 */
export function InboxHeader({
  selectedMailboxes,
  onToggleMailbox,
  onToggleMobileWorklist,
  onToggleCustomerDrawer,
}: InboxHeaderProps) {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-2 sm:px-4 py-1.5">
      <div className="flex items-center gap-1 sm:gap-1.5">
        {/* Mobile-only worklist trigger */}
        <button
          type="button"
          onClick={onToggleMobileWorklist}
          className="lg:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Öppna worklist"
        >
          <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>

        <MailboxSelector
          selectedMailboxes={selectedMailboxes}
          onToggleMailbox={onToggleMailbox}
        />

        {/* Ägarvy placeholder button - visual only for now */}
        <button
          type="button"
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          Ägarvy
          <ChevronDown className="h-2.5 w-2.5" />
        </button>

        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] text-gray-600 dark:text-gray-400 ml-auto">
          1 oägda · 2 hög risk · vecka 2026-04-22 17:18
        </span>

        {/* Customer drawer trigger (tablet + mobile only) */}
        <button
          type="button"
          onClick={onToggleCustomerDrawer}
          className="xl:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title="Kundinfo"
          aria-label="Öppna kundinfo"
        >
          <User className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>
    </header>
  )
}
