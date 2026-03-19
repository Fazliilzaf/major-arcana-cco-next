import { useState } from "react";
import { X, Merge, AlertTriangle, CheckCircle2, Mail, Phone, MessageSquare, TrendingUp, Calendar, Users } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import type { UnifiedCustomer, EmailAlias } from "./customer-identity-manager";

interface ContactMergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerA: UnifiedCustomer | null;
  customerB: UnifiedCustomer | null;
  onConfirmMerge: (primaryCustomerId: string, secondaryCustomerId: string, options: MergeOptions) => void;
}

interface MergeOptions {
  primaryName: string;
  primaryEmail: string;
  primaryPhone: string;
  keepAllEmails: boolean;
  keepAllPhones: boolean;
  combineNotes: boolean;
}

export function ContactMergeModal({
  isOpen,
  onClose,
  customerA,
  customerB,
  onConfirmMerge,
}: ContactMergeModalProps) {
  const [primaryCustomer, setPrimaryCustomer] = useState<"A" | "B">("A");
  const [selectedName, setSelectedName] = useState<string>(customerA?.primaryName || "");
  const [selectedEmail, setSelectedEmail] = useState<string>(
    customerA?.emails.find((e) => e.isPrimary)?.email || ""
  );
  const [selectedPhone, setSelectedPhone] = useState<string>(
    customerA?.phones.find((p) => p.isPrimary)?.phone || ""
  );
  const [keepAllEmails, setKeepAllEmails] = useState(true);
  const [keepAllPhones, setKeepAllPhones] = useState(true);
  const [combineNotes, setCombineNotes] = useState(true);

  if (!isOpen || !customerA || !customerB) return null;

  const handleMerge = () => {
    const primary = primaryCustomer === "A" ? customerA : customerB;
    const secondary = primaryCustomer === "A" ? customerB : customerA;

    const options: MergeOptions = {
      primaryName: selectedName,
      primaryEmail: selectedEmail,
      primaryPhone: selectedPhone,
      keepAllEmails,
      keepAllPhones,
      combineNotes,
    };

    onConfirmMerge(primary.id, secondary.id, options);
    toast.success(`✅ Slog ihop ${customerA.primaryName} och ${customerB.primaryName}`);
    onClose();
  };

  const allEmails = [...customerA.emails, ...customerB.emails];
  const allPhones = [...customerA.phones, ...customerB.phones];
  const totalConversations = customerA.totalConversations + customerB.totalConversations;
  const totalMessages = customerA.totalMessages + customerB.totalMessages;
  const combinedLTV = (customerA.lifetimeValue || 0) + (customerB.lifetimeValue || 0);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-pink-50 to-rose-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center">
              <Merge className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Slå ihop kundprofiler</h2>
              <p className="text-xs text-gray-600">Kombinera två kundprofiler till en</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {/* Warning */}
          <div className="mb-6 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900">
              <p className="font-semibold mb-1">⚠️ Denna åtgärd kombinerar två kundprofiler</p>
              <p className="text-xs text-amber-700">
                All historik, meddelanden och data kommer att slås ihop. Du kan dela upp profilena senare om det behövs.
              </p>
            </div>
          </div>

          {/* Customer Comparison */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Customer A */}
            <div
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                primaryCustomer === "A"
                  ? "border-pink-500 bg-pink-50"
                  : "border-gray-200 bg-gray-50 hover:border-pink-300"
              }`}
              onClick={() => setPrimaryCustomer("A")}
            >
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="radio"
                  checked={primaryCustomer === "A"}
                  onChange={() => setPrimaryCustomer("A")}
                  className="w-4 h-4 text-pink-600"
                />
                <span className="font-semibold text-gray-900">Profil A (Primär)</span>
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <div className="text-xs text-gray-600 mb-1">Namn:</div>
                  <div className="font-medium text-gray-900">{customerA.primaryName}</div>
                </div>

                <div>
                  <div className="text-xs text-gray-600 mb-1">Email ({customerA.emails.length}):</div>
                  {customerA.emails.slice(0, 2).map((email, idx) => (
                    <div key={idx} className="text-xs text-gray-700 flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {email.email}
                      {email.isPrimary && <span className="text-pink-600">★</span>}
                    </div>
                  ))}
                  {customerA.emails.length > 2 && (
                    <div className="text-xs text-gray-500">+{customerA.emails.length - 2} till</div>
                  )}
                </div>

                {customerA.phones.length > 0 && (
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Telefon:</div>
                    <div className="text-xs text-gray-700 flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {customerA.phones[0].phone}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-600 pt-2 border-t border-gray-200">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    {customerA.totalConversations} konv.
                  </div>
                  {customerA.lifetimeValue && (
                    <div className="flex items-center gap-1 text-pink-600 font-semibold">
                      <TrendingUp className="h-3 w-3" />
                      {customerA.lifetimeValue.toLocaleString("sv-SE")} kr
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Customer B */}
            <div
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                primaryCustomer === "B"
                  ? "border-pink-500 bg-pink-50"
                  : "border-gray-200 bg-gray-50 hover:border-pink-300"
              }`}
              onClick={() => setPrimaryCustomer("B")}
            >
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="radio"
                  checked={primaryCustomer === "B"}
                  onChange={() => setPrimaryCustomer("B")}
                  className="w-4 h-4 text-pink-600"
                />
                <span className="font-semibold text-gray-900">Profil B (Primär)</span>
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <div className="text-xs text-gray-600 mb-1">Namn:</div>
                  <div className="font-medium text-gray-900">{customerB.primaryName}</div>
                </div>

                <div>
                  <div className="text-xs text-gray-600 mb-1">Email ({customerB.emails.length}):</div>
                  {customerB.emails.slice(0, 2).map((email, idx) => (
                    <div key={idx} className="text-xs text-gray-700 flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {email.email}
                      {email.isPrimary && <span className="text-pink-600">★</span>}
                    </div>
                  ))}
                  {customerB.emails.length > 2 && (
                    <div className="text-xs text-gray-500">+{customerB.emails.length - 2} till</div>
                  )}
                </div>

                {customerB.phones.length > 0 && (
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Telefon:</div>
                    <div className="text-xs text-gray-700 flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {customerB.phones[0].phone}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-gray-600 pt-2 border-t border-gray-200">
                  <div className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    {customerB.totalConversations} konv.
                  </div>
                  {customerB.lifetimeValue && (
                    <div className="flex items-center gap-1 text-pink-600 font-semibold">
                      <TrendingUp className="h-3 w-3" />
                      {customerB.lifetimeValue.toLocaleString("sv-SE")} kr
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Merged Result Preview */}
          <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-green-900">Resultat efter sammanslagning:</h3>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Totalt antal email-adresser:</span>
                <span className="font-semibold text-gray-900">{allEmails.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Totalt antal konversationer:</span>
                <span className="font-semibold text-gray-900">{totalConversations}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Totalt antal meddelanden:</span>
                <span className="font-semibold text-gray-900">{totalMessages}</span>
              </div>
              {combinedLTV > 0 && (
                <div className="flex items-center justify-between pt-2 border-t border-green-200">
                  <span className="text-gray-700">Kombinerat LTV:</span>
                  <span className="font-bold text-pink-600 text-base">
                    {combinedLTV.toLocaleString("sv-SE")} kr
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Merge Options */}
          <div className="space-y-3 mb-6">
            <h3 className="font-semibold text-gray-900 text-sm">Inställningar:</h3>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={keepAllEmails}
                onChange={(e) => setKeepAllEmails(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-pink-600 rounded"
              />
              <div>
                <div className="text-sm font-medium text-gray-900">Behåll alla email-adresser</div>
                <div className="text-xs text-gray-600">
                  Alla {allEmails.length} email-adresser kommer att kopplas till kunden
                </div>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={keepAllPhones}
                onChange={(e) => setKeepAllPhones(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-pink-600 rounded"
              />
              <div>
                <div className="text-sm font-medium text-gray-900">Behåll alla telefonnummer</div>
                <div className="text-xs text-gray-600">
                  Alla telefonnummer kommer att sparas
                </div>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={combineNotes}
                onChange={(e) => setCombineNotes(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-pink-600 rounded"
              />
              <div>
                <div className="text-sm font-medium text-gray-900">Kombinera anteckningar</div>
                <div className="text-xs text-gray-600">
                  Interna anteckningar från båda profilerna slås ihop
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <Button
            onClick={onClose}
            variant="outline"
            className="px-6"
          >
            Avbryt
          </Button>
          <Button
            onClick={handleMerge}
            className="px-6 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
          >
            <Merge className="h-4 w-4 mr-2" />
            Slå ihop profiler
          </Button>
        </div>
      </div>
    </div>
  );
}
