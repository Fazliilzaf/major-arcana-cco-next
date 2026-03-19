import { Inbox, Archive, Clock, FileText, Search, Wifi, AlertCircle, Users, MessageSquare } from "lucide-react";
import { Button } from "./ui/button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

function BaseEmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="max-w-md text-center">
        {icon && (
          <div className="mb-4 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              {icon}
            </div>
          </div>
        )}
        
        <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
        <p className="mb-6 text-sm text-gray-600">{description}</p>
        
        {action && (
          <Button
            onClick={action.onClick}
            className="rounded-lg bg-pink-900 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-800"
          >
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
}

// Generic EmptyState with variant support (for integration)
export function EmptyState({ 
  variant,
  title,
  description,
  actionLabel,
  onAction,
}: {
  variant?: "inbox" | "conversation" | "customer" | "search" | "archive" | "drafts" | "snoozed";
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  // Variant presets
  const variants = {
    inbox: {
      icon: <Inbox className="h-8 w-8 text-gray-400" />,
      title: "Inkorgen är tom!",
      description: "Du har inga meddelanden att hantera just nu.",
    },
    conversation: {
      icon: <MessageSquare className="h-8 w-8 text-gray-400" />,
      title: "Ingen konversation vald",
      description: "Välj ett meddelande från inkorgen för att se konversationen",
    },
    customer: {
      icon: <Users className="h-8 w-8 text-gray-400" />,
      title: "Ingen kund vald",
      description: "Välj ett meddelande för att se kundinformation",
    },
    search: {
      icon: <Search className="h-8 w-8 text-gray-400" />,
      title: "Inga resultat",
      description: "Ingen konversation matchade din sökning",
    },
    archive: {
      icon: <Archive className="h-8 w-8 text-gray-400" />,
      title: "Inget arkiverat ännu",
      description: "Arkiverade konversationer kommer att visas här",
    },
    drafts: {
      icon: <FileText className="h-8 w-8 text-gray-400" />,
      title: "Inga sparade utkast",
      description: "Du har inga utkast just nu",
    },
    snoozed: {
      icon: <Clock className="h-8 w-8 text-gray-400" />,
      title: "Inga snoozade meddelanden",
      description: "Du har inga meddelanden som väntar på uppföljning",
    },
  };

  const preset = variant ? variants[variant] : null;

  return (
    <BaseEmptyState
      icon={preset?.icon}
      title={title || preset?.title || "Tom"}
      description={description || preset?.description || "Ingen data tillgänglig"}
      action={onAction ? { label: actionLabel || "Ladda om", onClick: onAction } : undefined}
    />
  );
}

// Specific empty states
export function EmptyInbox() {
  return (
    <BaseEmptyState
      icon={<Inbox className="h-8 w-8 text-gray-400" />}
      title="Inkorgen är tom!"
      description="Fantastiskt jobbat! Du har inga meddelanden att hantera just nu. Ta dig en välförtjänt paus. ☕"
    />
  );
}

export function EmptyUnanswered() {
  return (
    <BaseEmptyState
      icon={<Inbox className="h-8 w-8 text-gray-400" />}
      title="Inga obesvarade meddelanden"
      description="Alla meddelanden är besvarade! Du är i fas med kunderna. 🎉"
    />
  );
}

export function EmptySnoozed() {
  return (
    <BaseEmptyState
      icon={<Clock className="h-8 w-8 text-gray-400" />}
      title="Inga snoozade meddelanden"
      description="Du har inga meddelanden som väntar på uppföljning. Snooze meddelanden för att påminnas senare."
    />
  );
}

export function EmptyDrafts() {
  return (
    <BaseEmptyState
      icon={<FileText className="h-8 w-8 text-gray-400" />}
      title="Inga sparade utkast"
      description="Du har inga utkast. Börja skriva ett svar och spara det som utkast för att slutföra senare."
    />
  );
}

export function EmptyArchive() {
  return (
    <BaseEmptyState
      icon={<Archive className="h-8 w-8 text-gray-400" />}
      title="Inget arkiverat ännu"
      description="Arkiverade konversationer kommer att visas här. Arkivera meddelanden för att hålla inkorgen ren."
    />
  );
}

export function EmptySearch() {
  return (
    <BaseEmptyState
      icon={<Search className="h-8 w-8 text-gray-400" />}
      title="Inga resultat"
      description="Ingen konversation matchade din sökning. Försök med andra sökord eller filter."
    />
  );
}

export function NoSelection() {
  return (
    <BaseEmptyState
      icon={<Inbox className="h-8 w-8 text-gray-400" />}
      title="Välj ett meddelande"
      description="Välj ett meddelande från listan för att visa konversationen här."
    />
  );
}

// Error states
export function OfflineState({ onRetry }: { onRetry?: () => void }) {
  return (
    <BaseEmptyState
      icon={<Wifi className="h-8 w-8 text-orange-500" />}
      title="Du är offline"
      description="Anslutningen till internet verkar ha förlorats. Kontrollera din uppkoppling och försök igen."
      action={onRetry ? { label: "Försök igen", onClick: onRetry } : undefined}
    />
  );
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <BaseEmptyState
      icon={<AlertCircle className="h-8 w-8 text-red-500" />}
      title="Något gick fel"
      description="Vi kunde inte ladda dina meddelanden. Försök igen om en stund."
      action={onRetry ? { label: "Försök igen", onClick: onRetry } : undefined}
    />
  );
}

export function LoadFailed({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <BaseEmptyState
      icon={<AlertCircle className="h-8 w-8 text-red-500" />}
      title="Kunde inte ladda data"
      description={message || "Ett fel uppstod när vi försökte hämta data. Kontrollera din anslutning och försök igen."}
      action={onRetry ? { label: "Försök igen", onClick: onRetry } : undefined}
    />
  );
}