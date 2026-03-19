import { MoreHorizontal, Reply, MessageSquare, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Message {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  time: string;
  avatar: string;
  unread?: boolean;
  tag?: string;
  icon?: string;
  sla?: string;
  snoozed?: string;
}

const messages: Message[] = [
  {
    id: "1",
    sender: "Johan Lagerström",
    subject: "Bokning av tid",
    preview: "Hej, jag vill boka en tid...",
    time: "19:22",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    unread: true,
    sla: "SLA 1m",
  },
  {
    id: "2",
    sender: "Egzona Krasniqi",
    subject: "Fråga ang. faktura",
    preview: "Kan ni skicka senaste fakturan?",
    time: "10:32",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    unread: true,
  },
  {
    id: "3",
    sender: "Green Spa Music",
    subject: "Ny samarbetsförfrågan",
    preview: "Vi är intresserade av att samarbeta...",
    time: "08:45",
    avatar: "",
    icon: "reply",
  },
  {
    id: "4",
    sender: "Mail Delivery Subsystem",
    subject: "Orderbekräftelse",
    preview: "Din order 44521 är skickad",
    time: "08:12",
    avatar: "",
    icon: "mail",
    snoozed: "Snoozed till 14:00",
  },
  {
    id: "5",
    sender: "Johan Lagerström",
    subject: "Avbokning PrP",
    preview: "Hej jag måste min behandling...",
    time: "05:58",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    unread: true,
    sla: "SLA 2h",
  },
  {
    id: "6",
    sender: "Elias Nyberg",
    subject: "Återkoppling behandling",
    preview: "Jag ville säga...",
    time: "1gär",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
  },
  {
    id: "7",
    sender: "Egzona Krasniqi",
    subject: "Tack för hjälpen",
    preview: "",
    time: "25 apr",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    unread: true,
  },
];

export function MessageList() {
  const [selectedId, setSelectedId] = useState("1");

  const handleMessageClick = (message: Message) => {
    setSelectedId(message.id);
    toast.success(`Öppnade: ${message.subject}`);
  };

  const handleMoreOptions = (e: React.MouseEvent, sender: string) => {
    e.stopPropagation();
    toast.info(`Alternativ för ${sender}`);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <h2 className="text-[20px] font-semibold text-gray-900">Mejl</h2>
        <button 
          onClick={() => toast.info("Mejl-alternativ")}
          className="rounded-lg p-1.5 hover:bg-gray-50 transition-colors"
        >
          <MoreHorizontal className="h-[18px] w-[18px] text-gray-500" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            onClick={() => handleMessageClick(message)}
            className={`cursor-pointer border-b border-gray-50 px-5 py-3.5 transition-all ${
              message.unread ? "bg-rose-50/30" : ""
            } ${selectedId === message.id ? "bg-gray-50/70" : "hover:bg-gray-50/40"}`}
          >
            <div className="flex gap-3.5">
              {/* Unread Indicator */}
              <div className="flex items-start pt-2">
                {message.unread ? (
                  <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-sm" />
                ) : (
                  <div className="h-2 w-2" />
                )}
              </div>

              {/* Avatar */}
              <div className="flex-shrink-0">
                {message.avatar ? (
                  <img
                    src={message.avatar}
                    alt={message.sender}
                    className="h-12 w-12 rounded-full border border-gray-100 object-cover"
                  />
                ) : message.icon === "reply" ? (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-teal-100 to-teal-200 border border-teal-200">
                    <Reply className="h-[18px] w-[18px] text-teal-700" />
                  </div>
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-rose-100 to-rose-200 border border-rose-200">
                    <Mail className="h-[18px] w-[18px] text-rose-700" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-semibold text-gray-900">
                      {message.sender}
                    </p>
                    <p className="truncate text-[14px] font-semibold text-gray-800">
                      {message.subject}
                    </p>
                    {message.preview && (
                      <p className="mt-0.5 truncate text-[13px] text-gray-500">
                        {message.preview}
                      </p>
                    )}
                    {message.snoozed && (
                      <p className="mt-1 text-[12px] text-gray-400">
                        {message.snoozed}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className="text-[13px] text-gray-500">{message.time}</span>
                    {message.sla && (
                      <span className="rounded-md bg-rose-100/70 px-2.5 py-0.5 text-[11px] font-medium text-rose-900/80">
                        {message.sla}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}