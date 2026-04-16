/**
 * Mailbox data for the inbox mailbox selector.
 * Mock message counts live alongside the mailbox definition so the
 * header/selector stays a pure presentation component.
 */

export interface Mailbox {
  id: string
  email: string
  label: string
  /** Mock unread count rendered as a badge in the selector */
  messageCount?: number
}

export const mailboxes: Mailbox[] = [
  { id: "egzona", email: "egzona@hairtpclinic.com", label: "Egzona", messageCount: 2 },
  { id: "contact", email: "contact@hairtpclinic.com", label: "Contact", messageCount: 1 },
  { id: "fazli", email: "fazli@hairtpclinic.com", label: "Fazli", messageCount: 2 },
  { id: "kvitto", email: "kvitto@hairtpclinic.com", label: "Kvitto", messageCount: 1 },
  { id: "info", email: "info@hairtpclinic.com", label: "Info" },
  { id: "kons", email: "kons@hairtpclinic.com", label: "Kons" },
  { id: "marknad", email: "marknad@hairtpclinic.com", label: "Marknad" },
]

/**
 * Returns a human-readable label for the mailbox selector button based
 * on how many mailboxes are currently selected.
 */
export function getMailboxButtonLabel(selectedIds: string[]): string {
  if (selectedIds.length === mailboxes.length) {
    return "Hair TP Clinic - Alla mailboxar"
  }
  if (selectedIds.length === 1) {
    const selected = mailboxes.find((m) => m.id === selectedIds[0])
    return `Hair TP Clinic - ${selected?.label ?? "1 vald"}`
  }
  return `Hair TP Clinic - ${selectedIds.length} valda`
}
