import { Mail, Phone, Star, CheckCircle2, AlertCircle, Calendar, MessageSquare, TrendingUp, Users, ExternalLink, Edit3, Plus, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import type { UnifiedCustomer, EmailAlias, PhoneAlias } from "./customer-identity-manager";

interface UnifiedCustomerProfileProps {
  customer: UnifiedCustomer;
  onSetPrimaryEmail: (email: string) => void;
  onAddEmail: (email: string) => void;
  onRemoveEmail: (email: string) => void;
  onOpenMergeDialog: () => void;
}

export function UnifiedCustomerProfile({
  customer,
  onSetPrimaryEmail,
  onAddEmail,
  onRemoveEmail,
  onOpenMergeDialog,
}: UnifiedCustomerProfileProps) {
  const [showAllEmails, setShowAllEmails] = useState(false);
  const [showAddEmail, setShowAddEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");

  const handleSetPrimary = (email: string) => {
    onSetPrimaryEmail(email);
    toast.success(`⭐ ${email} är nu primär email-adress`);
  };

  const handleAddEmail = () => {
    if (!newEmail || !newEmail.includes("@")) {
      toast.error("❌ Ogiltig email-adress");
      return;
    }
    onAddEmail(newEmail);
    toast.success(`✅ La till ${newEmail}`);
    setNewEmail("");
    setShowAddEmail(false);
  };

  const handleRemoveEmail = (email: string) => {
    if (customer.emails.find(e => e.email === email)?.isPrimary) {
      toast.error("❌ Kan inte ta bort primär email-adress");
      return;
    }
    onRemoveEmail(email);
    toast.success(`🗑️ Tog bort ${email}`);
  };

  const primaryEmail = customer.emails.find((e) => e.isPrimary);
  const otherEmails = customer.emails.filter((e) => !e.isPrimary);
  const displayedEmails = showAllEmails ? otherEmails : otherEmails.slice(0, 2);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Users className="h-4 w-4 text-pink-600" />
          Kundidentitet
        </h3>
        {customer.mergedProfiles.length > 0 && (
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">
            {customer.mergedProfiles.length + 1} profiler sammanslagna
          </span>
        )}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-200 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="h-4 w-4 text-pink-600" />
            <span className="text-xs text-gray-600">Konversationer</span>
          </div>
          <div className="text-xl font-bold text-gray-900">{customer.totalConversations}</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span className="text-xs text-gray-600">LTV</span>
          </div>
          <div className="text-xl font-bold text-green-900">
            {customer.lifetimeValue ? `${customer.lifetimeValue.toLocaleString("sv-SE")} kr` : "—"}
          </div>
        </div>
      </div>

      {/* Primary Email */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-gray-700">Primär email-adress</label>
          <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
        </div>
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-300 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-amber-700 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 text-sm truncate">
                {primaryEmail?.email}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                {primaryEmail?.verified && (
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle2 className="h-3 w-3" />
                    Verifierad
                  </span>
                )}
                <span>{primaryEmail?.messageCount} meddelanden</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500 mt-2 pt-2 border-t border-amber-200">
            <span>Första: {primaryEmail?.firstSeen}</span>
            <span>Senaste: {primaryEmail?.lastUsed}</span>
          </div>
        </div>
      </div>

      {/* Other Email Addresses */}
      {otherEmails.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-gray-700">
              Andra email-adresser ({otherEmails.length})
            </label>
            {otherEmails.length > 2 && (
              <button
                onClick={() => setShowAllEmails(!showAllEmails)}
                className="text-xs text-pink-600 hover:text-pink-700"
              >
                {showAllEmails ? "Visa färre" : "Visa alla"}
              </button>
            )}
          </div>

          <div className="space-y-2">
            {displayedEmails.map((email, idx) => (
              <div
                key={idx}
                className="bg-gray-50 border border-gray-200 rounded-lg p-3 hover:border-pink-300 transition-colors group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <Mail className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 text-sm truncate">
                        {email.email}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                        {email.verified && (
                          <span className="flex items-center gap-1 text-green-600">
                            <CheckCircle2 className="h-3 w-3" />
                            Verifierad
                          </span>
                        )}
                        <span>{email.messageCount} msg</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleSetPrimary(email.email)}
                      className="p-1 hover:bg-amber-100 rounded text-amber-600"
                      title="Sätt som primär"
                    >
                      <Star className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleRemoveEmail(email.email)}
                      className="p-1 hover:bg-red-100 rounded text-red-600"
                      title="Ta bort"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
                  <span>Första: {email.firstSeen}</span>
                  <span>Senaste: {email.lastUsed}</span>
                </div>
              </div>
            ))}

            {!showAllEmails && otherEmails.length > 2 && (
              <div className="text-center">
                <button
                  onClick={() => setShowAllEmails(true)}
                  className="text-xs text-gray-600 hover:text-pink-600"
                >
                  +{otherEmails.length - 2} till...
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Email */}
      {showAddEmail ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Mail className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-900">Lägg till email-adress</span>
          </div>
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="email@example.com"
            className="w-full px-3 py-2 text-sm border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddEmail();
              if (e.key === "Escape") {
                setShowAddEmail(false);
                setNewEmail("");
              }
            }}
          />
          <div className="flex items-center gap-2">
            <Button
              onClick={handleAddEmail}
              className="flex-1 h-8 text-xs bg-blue-600 hover:bg-blue-700"
            >
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Lägg till
            </Button>
            <Button
              onClick={() => {
                setShowAddEmail(false);
                setNewEmail("");
              }}
              variant="outline"
              className="flex-1 h-8 text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Avbryt
            </Button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddEmail(true)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg hover:border-pink-400 hover:bg-pink-50 transition-colors group"
        >
          <Plus className="h-4 w-4 text-gray-400 group-hover:text-pink-600" />
          <span className="text-sm text-gray-600 group-hover:text-pink-600">
            Lägg till email-adress
          </span>
        </button>
      )}

      {/* Phone Numbers */}
      {customer.phones.length > 0 && (
        <div>
          <label className="text-xs font-semibold text-gray-700 block mb-2">
            Telefonnummer ({customer.phones.length})
          </label>
          <div className="space-y-2">
            {customer.phones.map((phone, idx) => (
              <div
                key={idx}
                className={`rounded-lg p-3 border ${
                  phone.isPrimary
                    ? "bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-300"
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-600" />
                  <span className="font-medium text-gray-900 text-sm">{phone.phone}</span>
                  {phone.isPrimary && (
                    <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                  )}
                  {phone.verified && (
                    <CheckCircle2 className="h-3 w-3 text-green-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="h-4 w-4 text-gray-600" />
          <span className="text-xs font-semibold text-gray-700">Tidslinj</span>
        </div>
        <div className="space-y-1 text-xs text-gray-600">
          <div className="flex items-center justify-between">
            <span>Första kontakt:</span>
            <span className="font-medium text-gray-900">{customer.firstContact}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Senaste kontakt:</span>
            <span className="font-medium text-gray-900">{customer.lastContact}</span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-gray-300">
            <span>Totalt meddelanden:</span>
            <span className="font-semibold text-pink-600">{customer.totalMessages}</span>
          </div>
        </div>
      </div>

      {/* Merge Action */}
      <div className="pt-3 border-t border-gray-200">
        <Button
          onClick={onOpenMergeDialog}
          variant="outline"
          className="w-full border-pink-300 hover:bg-pink-50 hover:border-pink-400"
        >
          <Users className="h-4 w-4 mr-2 text-pink-600" />
          <span className="text-pink-600">Slå ihop med annan profil</span>
        </Button>
      </div>
    </div>
  );
}
