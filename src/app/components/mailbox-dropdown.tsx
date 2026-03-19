import { useState, useRef, useEffect } from "react";
import { Mail, ChevronDown, Check, Plus, Inbox, Star } from "lucide-react";

interface Mailbox {
  id: string;
  email: string;
  name: string;
  signatureId: string;
  tone: "professional" | "warm" | "casual";
}

interface MailboxDropdownProps {
  mailboxes: Mailbox[];
  currentMailbox: Mailbox;
  onSelect: (mailboxId: string) => void;
  onAddNew: () => void;
}

export function MailboxDropdown({
  mailboxes,
  currentMailbox,
  onSelect,
  onAddNew,
}: MailboxDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (mailboxId: string) => {
    onSelect(mailboxId);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger Button - MER FÄRG! */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="group relative overflow-hidden flex items-center gap-1 rounded-full border border-pink-200 bg-gradient-to-r from-pink-50 via-rose-50 to-pink-50 px-1.5 py-0.5 text-[10px] font-semibold text-pink-700 shadow-sm hover:shadow-md hover:from-pink-100 hover:via-rose-100 hover:to-pink-100 hover:border-pink-300 transition-all duration-200"
      >
        {/* Subtle animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-pink-400/0 via-pink-400/10 to-pink-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <Mail className="relative h-2.5 w-2.5 text-pink-600 group-hover:text-pink-700" />
        <span className="relative">{currentMailbox.name}</span>
        <ChevronDown
          className={`relative h-2.5 w-2.5 text-pink-600 group-hover:text-pink-700 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1 w-64 rounded-lg border border-gray-200 bg-white shadow-xl">
          <div className="max-h-80 overflow-y-auto p-1">
            {/* Alla mail - Featured */}
            {mailboxes
              .filter((m) => m.id === "alla")
              .map((mailbox) => (
                <button
                  key={mailbox.id}
                  onClick={() => handleSelect(mailbox.id)}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs transition-colors ${
                    currentMailbox.id === mailbox.id
                      ? "bg-pink-50 text-pink-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-md ${
                        currentMailbox.id === mailbox.id
                          ? "bg-gradient-to-br from-pink-500 to-rose-500"
                          : "bg-gray-100"
                      }`}
                    >
                      <Inbox
                        className={`h-3.5 w-3.5 ${
                          currentMailbox.id === mailbox.id ? "text-white" : "text-gray-600"
                        }`}
                      />
                    </div>
                    <div>
                      <div className="font-semibold">{mailbox.name}</div>
                      <div className="text-[10px] text-gray-500">Visa alla inkorgar</div>
                    </div>
                  </div>
                  {currentMailbox.id === mailbox.id && (
                    <Check className="h-4 w-4 text-pink-600" />
                  )}
                </button>
              ))}

            {/* Divider */}
            <div className="my-1.5 border-t border-gray-100" />

            {/* Other Mailboxes */}
            {mailboxes
              .filter((m) => m.id !== "alla")
              .map((mailbox) => (
                <button
                  key={mailbox.id}
                  onClick={() => handleSelect(mailbox.id)}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-xs transition-colors ${
                    currentMailbox.id === mailbox.id
                      ? "bg-pink-50 text-pink-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-md ${
                        currentMailbox.id === mailbox.id
                          ? "bg-gradient-to-br from-pink-500 to-rose-500"
                          : "bg-gray-100"
                      }`}
                    >
                      <Mail
                        className={`h-3.5 w-3.5 ${
                          currentMailbox.id === mailbox.id ? "text-white" : "text-gray-600"
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{mailbox.name}</div>
                      <div className="text-[10px] text-gray-500">{mailbox.email}</div>
                    </div>
                  </div>
                  {currentMailbox.id === mailbox.id && (
                    <Check className="h-4 w-4 text-pink-600" />
                  )}
                </button>
              ))}

            {/* Divider */}
            <div className="my-1.5 border-t border-gray-100" />

            {/* Add New Mailbox */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddNew();
                setIsOpen(false);
              }}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-xs font-medium text-pink-600 transition-colors hover:bg-pink-50"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-pink-100">
                <Plus className="h-3.5 w-3.5 text-pink-600" />
              </div>
              Lägg till ny mailbox
            </button>
          </div>
        </div>
      )}
    </div>
  );
}