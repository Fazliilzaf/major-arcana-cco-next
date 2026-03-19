import { useState } from "react";
import { X, Users, AlertTriangle, CheckCircle2, Star, Mail, Phone, TrendingUp, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import type { UnifiedCustomer } from "./customer-identity-manager";

interface BulkMergePanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCustomerIds: string[];
  customers: UnifiedCustomer[];
  onConfirmBulkMerge: (customerIds: string[], primaryCustomerId: string) => void;
}

export function BulkMergePanel({
  isOpen,
  onClose,
  selectedCustomerIds,
  customers,
  onConfirmBulkMerge,
}: BulkMergePanelProps) {
  const [primaryCustomerId, setPrimaryCustomerId] = useState<string>(selectedCustomerIds[0] || "");
  const [expandedCustomers, setExpandedCustomers] = useState<Set<string>>(new Set());

  if (!isOpen || customers.length === 0) return null;

  const primaryCustomer = customers.find(c => c.id === primaryCustomerId);
  const secondaryCustomers = customers.filter(c => c.id !== primaryCustomerId);

  // Calculate merged stats
  const mergedStats = {
    totalEmails: customers.reduce((sum, c) => sum + c.emails.length, 0),
    totalPhones: customers.reduce((sum, c) => sum + c.phones.length, 0),
    totalConversations: customers.reduce((sum, c) => sum + c.totalConversations, 0),
    totalMessages: customers.reduce((sum, c) => sum + c.totalMessages, 0),
    totalLTV: customers.reduce((sum, c) => sum + (c.lifetimeValue || 0), 0),
    totalMergedProfiles: customers.reduce((sum, c) => sum + c.mergedProfiles.length, 0) + customers.length - 1,
  };

  const handleConfirm = () => {
    if (!primaryCustomerId) {
      toast.error("❌ Välj en primär kundprofil först!");
      return;
    }

    onConfirmBulkMerge(selectedCustomerIds, primaryCustomerId);
    onClose();
  };

  const toggleExpand = (customerId: string) => {
    const newExpanded = new Set(expandedCustomers);
    if (newExpanded.has(customerId)) {
      newExpanded.delete(customerId);
    } else {
      newExpanded.add(customerId);
    }
    setExpandedCustomers(newExpanded);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Bulk Merge - Slå ihop flera profiler</h2>
              <p className="text-xs text-gray-600">Kombinera {customers.length} kundprofiler till en</p>
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
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900">
              <p className="font-semibold mb-1">⚠️ Massiv sammanslagning av {customers.length} profiler</p>
              <p className="text-xs text-amber-700">
                Alla data från de sekundära profilerna kommer att slås ihop med den primära profilen. 
                Detta kan inte ångras automatiskt. Var noggrann med att välja rätt primär profil!
              </p>
            </div>
          </div>

          {/* Primary Customer Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Välj primär kundprofil (kommer att behålla sitt ID):
            </label>

            <div className="space-y-2">
              {customers.map((customer) => (
                <div key={customer.id}>
                  <div
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      primaryCustomerId === customer.id
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 bg-gray-50 hover:border-purple-300"
                    }`}
                    onClick={() => setPrimaryCustomerId(customer.id)}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        checked={primaryCustomerId === customer.id}
                        onChange={() => setPrimaryCustomerId(customer.id)}
                        className="mt-1 w-4 h-4 text-purple-600"
                      />

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{customer.primaryName}</h3>
                          {customer.isVIP && (
                            <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                          )}
                          {customer.mergedProfiles.length > 0 && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                              {customer.mergedProfiles.length + 1} profiler
                            </span>
                          )}
                          {primaryCustomerId === customer.id && (
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-semibold">
                              ⭐ PRIMÄR
                            </span>
                          )}
                        </div>

                        {/* Summary */}
                        <div className="grid grid-cols-3 gap-3 text-xs">
                          <div className="flex items-center gap-1 text-gray-600">
                            <Mail className="h-3 w-3" />
                            <span>{customer.emails.length} email</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <MessageSquare className="h-3 w-3" />
                            <span>{customer.totalConversations} konv.</span>
                          </div>
                          {customer.lifetimeValue && (
                            <div className="flex items-center gap-1 text-purple-600 font-semibold">
                              <TrendingUp className="h-3 w-3" />
                              <span>{customer.lifetimeValue.toLocaleString("sv-SE")} kr</span>
                            </div>
                          )}
                        </div>

                        {/* Expand/Collapse Details */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpand(customer.id);
                          }}
                          className="mt-2 flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 font-medium"
                        >
                          {expandedCustomers.has(customer.id) ? (
                            <>
                              <ChevronUp className="h-3 w-3" />
                              Dölj detaljer
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-3 w-3" />
                              Visa detaljer
                            </>
                          )}
                        </button>

                        {/* Expanded Details */}
                        {expandedCustomers.has(customer.id) && (
                          <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                            <div>
                              <div className="text-xs font-semibold text-gray-700 mb-1">Email-adresser:</div>
                              {customer.emails.map((email, idx) => (
                                <div key={idx} className="text-xs text-gray-600 ml-2">
                                  • {email.email} {email.isPrimary && "⭐"} ({email.messageCount} msg)
                                </div>
                              ))}
                            </div>

                            {customer.phones.length > 0 && (
                              <div>
                                <div className="text-xs font-semibold text-gray-700 mb-1">Telefon:</div>
                                {customer.phones.map((phone, idx) => (
                                  <div key={idx} className="text-xs text-gray-600 ml-2">
                                    • {phone.phone} {phone.isPrimary && "⭐"}
                                  </div>
                                ))}
                              </div>
                            )}

                            {customer.tags.length > 0 && (
                              <div>
                                <div className="text-xs font-semibold text-gray-700 mb-1">Taggar:</div>
                                <div className="flex flex-wrap gap-1">
                                  {customer.tags.map((tag, idx) => (
                                    <span key={idx} className="text-xs bg-gray-200 text-gray-700 px-2 py-0.5 rounded">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Merged Result Preview */}
          <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-green-900">Resultat efter bulk merge:</h3>
            </div>

            {primaryCustomer && (
              <div className="space-y-2 text-sm">
                <div className="font-semibold text-gray-900 mb-3">
                  Primär profil: {primaryCustomer.primaryName}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center justify-between bg-white rounded px-3 py-2">
                    <span className="text-gray-700">Totalt email-adresser:</span>
                    <span className="font-semibold text-gray-900">{mergedStats.totalEmails}</span>
                  </div>
                  <div className="flex items-center justify-between bg-white rounded px-3 py-2">
                    <span className="text-gray-700">Totalt telefonnummer:</span>
                    <span className="font-semibold text-gray-900">{mergedStats.totalPhones}</span>
                  </div>
                  <div className="flex items-center justify-between bg-white rounded px-3 py-2">
                    <span className="text-gray-700">Totalt konversationer:</span>
                    <span className="font-semibold text-gray-900">{mergedStats.totalConversations}</span>
                  </div>
                  <div className="flex items-center justify-between bg-white rounded px-3 py-2">
                    <span className="text-gray-700">Totalt meddelanden:</span>
                    <span className="font-semibold text-gray-900">{mergedStats.totalMessages}</span>
                  </div>
                </div>

                {mergedStats.totalLTV > 0 && (
                  <div className="mt-3 pt-3 border-t border-green-200">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700 font-medium">Kombinerat Lifetime Value:</span>
                      <span className="font-bold text-purple-600 text-lg">
                        {mergedStats.totalLTV.toLocaleString("sv-SE")} kr
                      </span>
                    </div>
                  </div>
                )}

                <div className="mt-3 pt-3 border-t border-green-200">
                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>Sammanslagna profiler i historik:</span>
                    <span className="font-semibold">{mergedStats.totalMergedProfiles}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* What will happen */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm">Vad kommer att hända:</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>{primaryCustomer?.primaryName}</strong> blir huvudprofilen och behåller sitt ID
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>
                  Alla {mergedStats.totalEmails} email-adresser kommer att kopplas till huvudprofilen
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>
                  Alla {mergedStats.totalPhones} telefonnummer kommer att kopplas till huvudprofilen
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>
                  Konversationshistorik ({mergedStats.totalConversations} konversationer) kombineras
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>
                  Lifetime Value från alla profiler summeras ({mergedStats.totalLTV.toLocaleString("sv-SE")} kr)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                <span>
                  Alla taggar kombineras (dubbletter tas bort automatiskt)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span className="text-amber-900">
                  De sekundära profilerna ({secondaryCustomers.length} st) kommer att <strong>raderas</strong>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Slår ihop <strong>{customers.length} profiler</strong> till <strong>1 unified profil</strong>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={onClose}
              variant="outline"
              className="px-6"
            >
              Avbryt
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!primaryCustomerId}
              className="px-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Users className="h-4 w-4 mr-2" />
              Slå ihop {customers.length} profiler
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
