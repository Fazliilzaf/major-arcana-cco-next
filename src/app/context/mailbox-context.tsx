import { createContext, useContext, useState, ReactNode } from "react";
import { defaultSignatures } from "../components/signature-editor-modal";
import { toast } from "sonner";

interface Mailbox {
  id: string;
  email: string;
  name: string;
  signatureId: string;
  tone: "professional" | "warm" | "casual";
  category?: string;
}

interface MailboxContextType {
  mailboxes: Mailbox[];
  currentMailbox: Mailbox;
  setCurrentMailbox: (mailboxId: string) => void;
  getCurrentSignature: () => any;
  addMailbox: (mailbox: Omit<Mailbox, "id">) => void;
  removeMailbox: (mailboxId: string) => void;
}

const defaultMailboxes: Mailbox[] = [
  {
    id: "alla",
    email: "Alla mail",
    name: "Alla mail",
    signatureId: "fazli",
    tone: "professional",
  },
  {
    id: "egzona",
    email: "egzona@hairtpclinic.com",
    name: "Egzona",
    signatureId: "egzona",
    tone: "warm",
  },
  {
    id: "contact",
    email: "contact@hairtpclinic.com",
    name: "Kontakt",
    signatureId: "fazli",
    tone: "professional",
  },
  {
    id: "fazli",
    email: "fazli@hairtpclinic.com",
    name: "Fazli",
    signatureId: "fazli",
    tone: "professional",
  },
  {
    id: "kvitto",
    email: "kvitto@hairtpclinic.com",
    name: "Kvitton",
    signatureId: "fazli",
    tone: "professional",
  },
  {
    id: "info",
    email: "info@hairtpclinic.com",
    name: "Info",
    signatureId: "egzona",
    tone: "professional",
  },
  {
    id: "kons",
    email: "kons@hairtpclinic.com",
    name: "Konsultation",
    signatureId: "fazli",
    tone: "warm",
  },
  {
    id: "marknad",
    email: "marknad@hairtpclinic.com",
    name: "Marknadsföring",
    signatureId: "egzona",
    tone: "casual",
  },
];

const MailboxContext = createContext<MailboxContextType | undefined>(undefined);

export function MailboxProvider({ children }: { children: ReactNode }) {
  const [mailboxes, setMailboxes] = useState<Mailbox[]>(defaultMailboxes);
  const [currentMailbox, setCurrentMailboxState] = useState<Mailbox>(defaultMailboxes[0]);

  const setCurrentMailbox = (mailboxId: string) => {
    const mailbox = mailboxes.find(m => m.id === mailboxId);
    if (mailbox) {
      setCurrentMailboxState(mailbox);
      toast.success(`Bytte till: ${mailbox.name} (${mailbox.tone} ton)`);
    }
  };

  const getCurrentSignature = () => {
    return defaultSignatures[currentMailbox.signatureId];
  };

  const addMailbox = (mailbox: Omit<Mailbox, "id">) => {
    const newMailbox: Mailbox = {
      id: Date.now().toString(),
      ...mailbox,
    };
    setMailboxes([...mailboxes, newMailbox]);
    toast.success(`Lade till: ${newMailbox.name} (${newMailbox.tone} ton)`);
  };

  const removeMailbox = (mailboxId: string) => {
    const updatedMailboxes = mailboxes.filter(m => m.id !== mailboxId);
    setMailboxes(updatedMailboxes);
    toast.success(`Tog bort: ${mailboxes.find(m => m.id === mailboxId)?.name}`);
  };

  return (
    <MailboxContext.Provider value={{ mailboxes, currentMailbox, setCurrentMailbox, getCurrentSignature, addMailbox, removeMailbox }}>
      {children}
    </MailboxContext.Provider>
  );
}

export function useMailbox() {
  const context = useContext(MailboxContext);
  if (!context) {
    throw new Error("useMailbox must be used within MailboxProvider");
  }
  return context;
}