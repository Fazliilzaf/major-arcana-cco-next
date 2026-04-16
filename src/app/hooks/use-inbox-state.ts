import { useCallback, useMemo, useState } from "react"
import { mailboxes } from "../data/mailboxes"

/**
 * Central state container for the inbox page.
 *
 * Bundles the state that was previously inlined in inbox-page-final.tsx:
 *  - Selected message + mobile view toggles
 *  - Active filters (with expanded rows) and derived sprint-box flag
 *  - Selected mailbox ids
 *  - Snoozed message ids
 *
 * Keeping all interaction logic here lets the page become a thin
 * composition layer that only wires props into the existing panels.
 */
export function useInboxState() {
  // --- Selection ---
  const [selectedMessage, setSelectedMessage] = useState<string | null>("1")

  // --- Filters ---
  const [activeFilters, setActiveFilters] = useState<string[]>(["all"])
  const [expandedFilters, setExpandedFilters] = useState<string[]>([])

  const toggleFilter = useCallback((filterId: string) => {
    setActiveFilters((prev) => {
      // Clicking "all" always resets the filter to just "all"
      if (filterId === "all") return ["all"]

      // Clicking any other filter while "all" is active replaces "all"
      if (prev.includes("all")) return [filterId]

      // Toggle the filter; fall back to "all" if nothing is left
      if (prev.includes(filterId)) {
        const next = prev.filter((f) => f !== filterId)
        return next.length === 0 ? ["all"] : next
      }
      return [...prev, filterId]
    })
  }, [])

  const toggleExpandedFilter = useCallback((filterId: string) => {
    setExpandedFilters((prev) =>
      prev.includes(filterId) ? prev.filter((f) => f !== filterId) : [...prev, filterId],
    )
  }, [])

  const showSprintBox = useMemo(
    () => activeFilters.includes("sprint") || activeFilters.includes("act-now"),
    [activeFilters],
  )

  // --- Mailboxes ---
  const [selectedMailboxes, setSelectedMailboxes] = useState<string[]>(() =>
    mailboxes.map((m) => m.id),
  )

  const toggleMailbox = useCallback((mailboxId: string) => {
    setSelectedMailboxes((prev) => {
      if (prev.includes(mailboxId)) {
        // Prevent deselecting the last mailbox
        const next = prev.filter((id) => id !== mailboxId)
        return next.length === 0 ? prev : next
      }
      return [...prev, mailboxId]
    })
  }, [])

  // --- Snooze ---
  const [snoozedMessages, setSnoozedMessages] = useState<string[]>([])

  const snoozeMessage = useCallback((messageId: string) => {
    setSnoozedMessages((prev) => (prev.includes(messageId) ? prev : [...prev, messageId]))
  }, [])

  const unsnoozeMessage = useCallback((messageId: string) => {
    setSnoozedMessages((prev) => prev.filter((id) => id !== messageId))
  }, [])

  // --- Mobile / tablet UI ---
  const [showMobileWorklist, setShowMobileWorklist] = useState(false)
  const [showCustomerDrawer, setShowCustomerDrawer] = useState(false)

  return {
    // selection
    selectedMessage,
    setSelectedMessage,

    // filters
    activeFilters,
    expandedFilters,
    toggleFilter,
    toggleExpandedFilter,
    showSprintBox,

    // mailboxes
    selectedMailboxes,
    toggleMailbox,

    // snooze
    snoozedMessages,
    snoozeMessage,
    unsnoozeMessage,

    // mobile
    showMobileWorklist,
    setShowMobileWorklist,
    showCustomerDrawer,
    setShowCustomerDrawer,
  }
}

export type InboxState = ReturnType<typeof useInboxState>
