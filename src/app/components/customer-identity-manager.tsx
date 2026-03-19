import { useState } from "react";
import { Users, Mail, Phone, AlertCircle, CheckCircle2, X, Merge, Split, Star, Calendar, MessageSquare, TrendingUp, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";

// Customer Identity Types
export interface EmailAlias {
  email: string;
  isPrimary: boolean;
  verified: boolean;
  firstSeen: string;
  lastUsed: string;
  messageCount: number;
}

export interface PhoneAlias {
  phone: string;
  isPrimary: boolean;
  verified: boolean;
  firstSeen: string;
  lastUsed: string;
}

export interface UnifiedCustomer {
  id: string;
  primaryName: string;
  emails: EmailAlias[];
  phones: PhoneAlias[];
  totalConversations: number;
  totalMessages: number;
  firstContact: string;
  lastContact: string;
  lifetimeValue?: number;
  isVIP?: boolean;
  mergedProfiles: string[]; // IDs of merged profiles
  tags: string[];
  notes: string;
}

export interface MergeSuggestion {
  id: string;
  customerA: UnifiedCustomer;
  customerB: UnifiedCustomer;
  confidence: number; // 0-100
  reasons: string[];
  autoMerge: boolean;
}

interface CustomerIdentityManagerProps {
  customers: UnifiedCustomer[];
  onMerge: (customerAId: string, customerBId: string) => void;
  onSplit: (customerId: string, emailToSplit: string) => void;
  onSetPrimaryEmail: (customerId: string, email: string) => void;
}

export function CustomerIdentityManager({
  customers,
  onMerge,
  onSplit,
  onSetPrimaryEmail,
}: CustomerIdentityManagerProps) {
  const [selectedCustomer, setSelectedCustomer] = useState<UnifiedCustomer | null>(null);
  const [showMergeSuggestions, setShowMergeSuggestions] = useState(true);

  // AI-generated merge suggestions
  const mergeSuggestions: MergeSuggestion[] = [
    {
      id: "merge-1",
      customerA: customers[0],
      customerB: customers[1],
      confidence: 95,
      reasons: [
        "Samma telefonnummer",
        "Liknande namn (Johan vs Johan A.)",
        "Båda från Göteborg",
      ],
      autoMerge: false,
    },
    {
      id: "merge-2",
      customerA: customers[2],
      customerB: customers[3],
      confidence: 87,
      reasons: [
        "Samma efternamn",
        "Liknande email-domän",
        "Kontaktade samma dag",
      ],
      autoMerge: false,
    },
  ];

  const handleAcceptMerge = (suggestion: MergeSuggestion) => {
    onMerge(suggestion.customerA.id, suggestion.customerB.id);
    toast.success(`✅ Slog ihop ${suggestion.customerA.primaryName} och ${suggestion.customerB.primaryName}`);
  };

  const handleRejectMerge = (suggestionId: string) => {
    toast.info("❌ Avvisade sammanslagningsförslag");
  };

  const handleSetPrimary = (customerId: string, email: string) => {
    onSetPrimaryEmail(customerId, email);
    toast.success(`⭐ ${email} är nu primär email-adress`);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header - KOMPRIMERAD */}
      <div className="flex items-center justify-between px-3 py-2 bg-white border-b border-gray-200">
        <div className="flex items-center gap-1.5">
          <Users className="h-4 w-4 text-pink-600" />
          <h2 className="text-xs font-semibold text-gray-900">Kundidentitetshantering</h2>
        </div>
        <button
          onClick={() => setShowMergeSuggestions(!showMergeSuggestions)}
          className="text-[10px] text-gray-600 hover:text-gray-900"
        >
          {showMergeSuggestions ? "Dölj" : "Visa"} förslag
        </button>
      </div>

      {/* AI Merge Suggestions - KOMPRIMERAD */}
      {showMergeSuggestions && mergeSuggestions.length > 0 && (
        <div className="p-2.5 bg-gradient-to-r from-pink-50 to-rose-50 border-b border-pink-200">
          <div className="flex items-center gap-1.5 mb-2">
            <AlertCircle className="h-3 w-3 text-pink-600" />
            <span className="text-[10px] font-semibold text-pink-900">
              🤖 AI-förslag: {mergeSuggestions.length} möjliga dubbletter
            </span>
          </div>

          <div className="space-y-1.5">
            {mergeSuggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="bg-white rounded-lg p-2 border border-pink-200 shadow-sm"
              >
                <div className="flex items-start justify-between mb-1.5">
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[11px] font-medium text-gray-900">
                        {suggestion.customerA.primaryName}
                      </span>
                      <Merge className="h-2.5 w-2.5 text-gray-400" />
                      <span className="text-[11px] font-medium text-gray-900">
                        {suggestion.customerB.primaryName}
                      </span>
                    </div>
                    <div className="text-[9px] text-gray-600 space-y-0.5">
                      {suggestion.reasons.map((reason, idx) => (
                        <div key={idx} className="flex items-center gap-1">
                          <CheckCircle2 className="h-2.5 w-2.5 text-green-600" />
                          <span>{reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="ml-2 flex items-center gap-0.5">
                    <div className="text-[9px] font-semibold text-pink-700 bg-pink-100 px-1.5 py-0.5 rounded">
                      {suggestion.confidence}%
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 mt-2">
                  <Button
                    onClick={() => handleAcceptMerge(suggestion)}
                    className="flex-1 h-6 text-[10px] bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600"
                  >
                    <Merge className="h-2.5 w-2.5 mr-1" />
                    Slå ihop
                  </Button>
                  <Button
                    onClick={() => handleRejectMerge(suggestion.id)}
                    variant="outline"
                    className="flex-1 h-6 text-[10px]"
                  >
                    <X className="h-2.5 w-2.5 mr-1" />
                    Inte samma
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Customer List - KOMPRIMERAD */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
        {customers.map((customer) => (
          <div
            key={customer.id}
            className={`bg-white rounded-lg p-3 border cursor-pointer transition-all ${
              selectedCustomer?.id === customer.id
                ? "border-pink-500 shadow-md"
                : "border-gray-200 hover:border-pink-300 hover:shadow-sm"
            }`}
            onClick={() => setSelectedCustomer(customer)}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900">
                    {customer.primaryName}
                  </h3>
                  {customer.isVIP && (
                    <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                  )}
                  {customer.mergedProfiles.length > 0 && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                      {customer.mergedProfiles.length + 1} profiler
                    </span>
                  )}
                </div>

                {/* Primary Email */}
                <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                  <Mail className="h-3 w-3" />
                  <span>{customer.emails.find((e) => e.isPrimary)?.email}</span>
                  {customer.emails.length > 1 && (
                    <span className="text-pink-600 font-medium">
                      +{customer.emails.length - 1} till
                    </span>
                  )}
                </div>

                {/* Phone */}
                {customer.phones.length > 0 && (
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Phone className="h-3 w-3" />
                    <span>{customer.phones.find((p) => p.isPrimary)?.phone}</span>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="ml-3 text-right">
                <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                  <MessageSquare className="h-3 w-3" />
                  <span>{customer.totalConversations} konv.</span>
                </div>
                {customer.lifetimeValue && (
                  <div className="flex items-center gap-1 text-xs font-semibold text-pink-600">
                    <TrendingUp className="h-3 w-3" />
                    <span>{customer.lifetimeValue.toLocaleString("sv-SE")} kr</span>
                  </div>
                )}
              </div>
            </div>

            {/* Expanded View */}
            {selectedCustomer?.id === customer.id && (
              <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                <div>
                  <div className="text-xs font-semibold text-gray-700 mb-1">
                    Alla email-adresser:
                  </div>
                  <div className="space-y-1">
                    {customer.emails.map((email, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-xs bg-gray-50 rounded p-2"
                      >
                        <div className="flex items-center gap-2">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <span className="text-gray-900">{email.email}</span>
                          {email.isPrimary && (
                            <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                          )}
                          {email.verified && (
                            <CheckCircle2 className="h-3 w-3 text-green-600" />
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-500">
                            {email.messageCount} msg
                          </span>
                          {!email.isPrimary && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSetPrimary(customer.id, email.email);
                              }}
                              className="text-pink-600 hover:text-pink-700 text-xs"
                            >
                              Sätt primär
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <div className="text-xs">
                  <div className="flex items-center justify-between text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Första kontakt: {customer.firstContact}</span>
                    </div>
                    <div>
                      <span>Senaste: {customer.lastContact}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {customer.mergedProfiles.length > 0 && (
                  <div className="pt-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.info("🔧 Split-funktion öppnas...");
                      }}
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
                    >
                      <Split className="h-3 w-3" />
                      Dela upp profil
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}