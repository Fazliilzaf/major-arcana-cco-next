import type { ReactNode } from "react"
import { X } from "lucide-react"

interface MobileDrawerProps {
  open: boolean
  onClose: () => void
  title: string
  side: "left" | "right"
  /**
   * Visibility breakpoint. The drawer is hidden at this breakpoint and
   * above (e.g. `lg` hides it on desktop, `xl` hides it on wide
   * desktops).
   */
  hideAt: "lg" | "xl"
  children: ReactNode
}

/**
 * Generic slide-in drawer used for the mobile worklist (left) and the
 * tablet/mobile customer panel (right). Handles backdrop, close button
 * and slide-in animation; the parent only supplies the content.
 */
export function MobileDrawer({ open, onClose, title, side, hideAt, children }: MobileDrawerProps) {
  if (!open) return null

  const hiddenClass = hideAt === "lg" ? "lg:hidden" : "xl:hidden"
  const positionClass = side === "left" ? "left-0" : "right-0"
  const widthClass = side === "left" ? "w-[280px] sm:w-[320px]" : "w-[320px] sm:w-[360px]"
  const slideFromClass =
    side === "left" ? "animate-in slide-in-from-left" : "animate-in slide-in-from-right"

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-40 ${hiddenClass} animate-in fade-in duration-200`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={`fixed ${positionClass} top-0 bottom-0 ${widthClass} bg-white dark:bg-gray-900 z-50 ${hiddenClass} shadow-2xl overflow-hidden ${slideFromClass} duration-300`}
        role="dialog"
        aria-label={title}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Stäng"
          >
            <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
        {children}
      </aside>
    </>
  )
}
