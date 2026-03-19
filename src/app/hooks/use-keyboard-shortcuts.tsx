import { useEffect } from "react";

interface KeyboardShortcutHandler {
  onNextMessage?: () => void;
  onPreviousMessage?: () => void;
  onReply?: () => void;
  onArchive?: () => void;
  onSnooze?: () => void;
  onSaveDraft?: () => void;
  onSend?: () => void;
  onSearch?: () => void;
  onShowHelp?: () => void;
  onNavigateTab?: (tabIndex: number) => void;
}

export function useKeyboardShortcuts(handlers: KeyboardShortcutHandler) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input/textarea
      const target = e.target as HTMLElement;
      const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA";

      // Allow certain shortcuts even in inputs
      const allowInInput = e.key === "Escape" || (e.metaKey && e.key === "Enter");
      
      if (isInput && !allowInInput) {
        // Allow '/' for search even in some contexts
        if (e.key === "/" && !e.metaKey && !e.ctrlKey) {
          e.preventDefault();
          handlers.onSearch?.();
        }
        return;
      }

      // J - Next message
      if (e.key === "j" || e.key === "J") {
        e.preventDefault();
        handlers.onNextMessage?.();
      }

      // K - Previous message
      if (e.key === "k" || e.key === "K") {
        e.preventDefault();
        handlers.onPreviousMessage?.();
      }

      // R - Reply
      if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        handlers.onReply?.();
      }

      // E - Archive
      if (e.key === "e" || e.key === "E") {
        e.preventDefault();
        handlers.onArchive?.();
      }

      // S - Snooze
      if (e.key === "s" || e.key === "S") {
        if (!e.shiftKey) {
          e.preventDefault();
          handlers.onSnooze?.();
        }
      }

      // D - Save draft
      if (e.key === "d" || e.key === "D") {
        e.preventDefault();
        handlers.onSaveDraft?.();
      }

      // Cmd/Ctrl + Enter - Send
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handlers.onSend?.();
      }

      // / - Focus search
      if (e.key === "/" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        handlers.onSearch?.();
      }

      // ? - Show help
      if (e.key === "?" && e.shiftKey) {
        e.preventDefault();
        handlers.onShowHelp?.();
      }

      // 1-5 - Navigate tabs
      if (e.key >= "1" && e.key <= "5" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        handlers.onNavigateTab?.(parseInt(e.key) - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlers]);
}
