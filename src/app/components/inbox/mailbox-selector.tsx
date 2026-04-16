import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { getMailboxButtonLabel, mailboxes } from "../../data/mailboxes"

interface MailboxSelectorProps {
  selectedMailboxes: string[]
  onToggleMailbox: (mailboxId: string) => void
}

/**
 * Dropdown that lets the user pick which mailboxes to include in the
 * inbox view. Owns its own open/close state so the parent header stays
 * lean.
 */
export function MailboxSelector({ selectedMailboxes, onToggleMailbox }: MailboxSelectorProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-bold bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors truncate max-w-[180px] sm:max-w-none"
      >
        <span className="truncate">{getMailboxButtonLabel(selectedMailboxes)}</span>
        <ChevronDown className="h-2.5 w-2.5 flex-shrink-0" />
      </button>

      {open && (
        <>
          {/* Mobile backdrop to dismiss on outside click */}
          <div
            className="fixed inset-0 z-40 lg:hidden"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          <div
            role="menu"
            className="absolute top-full left-0 mt-1 w-36 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 overflow-hidden"
          >
            <div className="px-2.5 py-1.5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20">
              <div className="text-[8px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Välj mailboxar
              </div>
            </div>

            <div className="py-1 max-h-64 overflow-y-auto">
              {mailboxes.map((mailbox, index) => {
                const isChecked = selectedMailboxes.includes(mailbox.id)
                const checkboxColor = index % 2 === 0 ? "accent-pink-500" : "accent-blue-500"

                return (
                  <label
                    key={mailbox.id}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gradient-to-r hover:from-pink-50 hover:to-purple-50 dark:hover:from-pink-950/20 dark:hover:to-purple-950/20 px-2.5 py-1 transition-all group"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onToggleMailbox(mailbox.id)}
                      className={`w-3.5 h-3.5 rounded border-2 ${
                        isChecked ? "border-transparent" : "border-gray-300 dark:border-gray-600"
                      } ${checkboxColor} focus:ring-2 focus:ring-pink-500 focus:ring-offset-0 transition-all`}
                    />
                    <div className="flex items-center gap-1.5">
                      <div className="text-[11px] font-semibold text-gray-800 dark:text-gray-200">
                        {mailbox.label}
                      </div>
                      {mailbox.messageCount ? (
                        <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                          {mailbox.messageCount}
                        </span>
                      ) : null}
                    </div>
                  </label>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
