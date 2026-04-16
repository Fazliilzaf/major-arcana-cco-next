import { useEffect, useState } from "react";
import { Users, Search, Filter, Download, Upload, Settings, TrendingUp, Mail, Phone, Star, CheckSquare, Square } from "lucide-react";
import { CustomerIdentityManager } from "./customer-identity-manager";
import { ContactMergeModal } from "./contact-merge-modal";
import { BulkMergePanel } from "./bulk-merge-panel";
import type { UnifiedCustomer, MergeSuggestion } from "./customer-identity-manager";
import { mockUnifiedCustomers, mockMergeSuggestions } from "../data/mock-customer-identity-data";
import { toast } from "sonner";
import { Button } from "./ui/button";
import type { MergeOptions } from "./contact-merge-modal";
import {
  ExportCustomersModal,
  ImportCustomersModal,
  CustomerIdentitySettingsModal,
  DEFAULT_SETTINGS,
  type CustomerIdentitySettings,
} from "./customer-identity-modals";

const SETTINGS_STORAGE_KEY = "hairtp.customerIdentity.settings.v1";

export function CustomerIdentityPage() {
  const [customers, setCustomers] = useState<UnifiedCustomer[]>(mockUnifiedCustomers);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "vip" | "merged" | "duplicates">("all");
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [selectedCustomerA, setSelectedCustomerA] = useState<UnifiedCustomer | null>(null);
  const [selectedCustomerB, setSelectedCustomerB] = useState<UnifiedCustomer | null>(null);
  const [showBulkMerge, setShowBulkMerge] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState<Set<string>>(new Set());
  const [showExport, setShowExport] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<CustomerIdentitySettings>(DEFAULT_SETTINGS);

  // Ladda sparade inställningar från localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      }
    } catch {
      // Ignorera fel vid läsning
    }
  }, []);

  const handleSaveSettings = (next: CustomerIdentitySettings) => {
    setSettings(next);
    try {
      window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignorera fel vid sparning
    }

    // Tillämpa VIP-tröskeln direkt på befintliga kunder
    setCustomers((prev) =>
      prev.map((c) => ({
        ...c,
        isVIP: c.isVIP || (c.lifetimeValue ?? 0) >= next.defaultVIPThreshold,
      })),
    );
  };

  const handleImportCustomers = (newCustomers: UnifiedCustomer[]) => {
    setCustomers((prev) => [...newCustomers, ...prev]);
  };

  const handleResetData = () => {
    setCustomers(mockUnifiedCustomers);
    setSelectedCustomers(new Set());
  };

  // Filter customers
  const filteredCustomers = customers.filter((customer) => {
    // Search filter
    const matchesSearch = 
      customer.primaryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.emails.some(e => e.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      customer.phones.some(p => p.phone.includes(searchQuery));

    if (!matchesSearch) return false;

    // Status filter
    if (filterStatus === "vip") return customer.isVIP;
    if (filterStatus === "merged") return customer.mergedProfiles.length > 0;
    if (filterStatus === "duplicates") {
      // Check if this customer has potential duplicates
      return mockMergeSuggestions.some(
        s => s.customerA.id === customer.id || s.customerB.id === customer.id
      );
    }

    return true;
  });

  // Statistics
  const stats = {
    total: customers.length,
    vip: customers.filter(c => c.isVIP).length,
    merged: customers.filter(c => c.mergedProfiles.length > 0).length,
    duplicates: mockMergeSuggestions.length,
    totalEmails: customers.reduce((sum, c) => sum + c.emails.length, 0),
    totalConversations: customers.reduce((sum, c) => sum + c.totalConversations, 0),
    totalLTV: customers.reduce((sum, c) => sum + (c.lifetimeValue || 0), 0),
  };

  const handleMerge = (customerAId: string, customerBId: string) => {
    const customerA = customers.find(c => c.id === customerAId);
    const customerB = customers.find(c => c.id === customerBId);
    
    if (customerA && customerB) {
      setSelectedCustomerA(customerA);
      setSelectedCustomerB(customerB);
      setShowMergeModal(true);
    }
  };

  const handleConfirmMerge = (primaryId: string, secondaryId: string, options: MergeOptions) => {
    const primary = customers.find(c => c.id === primaryId);
    const secondary = customers.find(c => c.id === secondaryId);

    if (!primary || !secondary) return;

    // Merge the profiles
    const mergedCustomer: UnifiedCustomer = {
      ...primary,
      primaryName: options.primaryName,
      emails: options.keepAllEmails 
        ? [...primary.emails, ...secondary.emails]
        : primary.emails,
      phones: options.keepAllPhones
        ? [...primary.phones, ...secondary.phones]
        : primary.phones,
      totalConversations: primary.totalConversations + secondary.totalConversations,
      totalMessages: primary.totalMessages + secondary.totalMessages,
      lifetimeValue: (primary.lifetimeValue || 0) + (secondary.lifetimeValue || 0),
      mergedProfiles: [...primary.mergedProfiles, secondaryId],
      tags: [...new Set([...primary.tags, ...secondary.tags])],
      notes: options.combineNotes 
        ? `${primary.notes}\n\n--- Merged from ${secondary.primaryName} ---\n${secondary.notes}`
        : primary.notes,
    };

    // Update customers list
    setCustomers(prev => 
      prev
        .filter(c => c.id !== secondaryId)
        .map(c => c.id === primaryId ? mergedCustomer : c)
    );

    toast.success(`✅ Slog ihop ${secondary.primaryName} med ${primary.primaryName}`);
  };

  const handleSplit = (customerId: string, emailToSplit: string) => {
    toast.info(`🔧 Split-funktionalitet under utveckling för ${emailToSplit}`);
  };

  const handleSetPrimaryEmail = (customerId: string, email: string) => {
    setCustomers(prev => prev.map(customer => {
      if (customer.id === customerId) {
        return {
          ...customer,
          emails: customer.emails.map(e => ({
            ...e,
            isPrimary: e.email === email,
          })),
        };
      }
      return customer;
    }));
  };

  const toggleCustomerSelection = (customerId: string) => {
    const newSelection = new Set(selectedCustomers);
    if (newSelection.has(customerId)) {
      newSelection.delete(customerId);
    } else {
      newSelection.add(customerId);
    }
    setSelectedCustomers(newSelection);
  };

  const handleBulkMerge = (customerIds: string[], primaryCustomerId: string) => {
    const primaryCustomer = customers.find(c => c.id === primaryCustomerId);
    if (!primaryCustomer) return;

    const customersToMerge = customers.filter(c => customerIds.includes(c.id) && c.id !== primaryCustomerId);

    // Merge all into primary
    let mergedCustomer = { ...primaryCustomer };

    customersToMerge.forEach(customer => {
      mergedCustomer = {
        ...mergedCustomer,
        emails: [...mergedCustomer.emails, ...customer.emails],
        phones: [...mergedCustomer.phones, ...customer.phones],
        totalConversations: mergedCustomer.totalConversations + customer.totalConversations,
        totalMessages: mergedCustomer.totalMessages + customer.totalMessages,
        lifetimeValue: (mergedCustomer.lifetimeValue || 0) + (customer.lifetimeValue || 0),
        mergedProfiles: [...mergedCustomer.mergedProfiles, customer.id],
        tags: [...new Set([...mergedCustomer.tags, ...customer.tags])],
      };
    });

    // Update customers list
    setCustomers(prev =>
      prev
        .filter(c => !customerIds.includes(c.id) || c.id === primaryCustomerId)
        .map(c => c.id === primaryCustomerId ? mergedCustomer : c)
    );

    setSelectedCustomers(new Set());
    setShowBulkMerge(false);
    toast.success(`✅ Slog ihop ${customersToMerge.length} profiler med ${primaryCustomer.primaryName}`);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      {/* Header - ULTRA KOMPAKT */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="px-3 py-2">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-[14px] font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center shadow-md">
                  <Users className="h-3 w-3 text-white" />
                </div>
                Kundidentitetshantering
              </h1>
              <p className="text-[8px] text-gray-600 dark:text-gray-400 mt-0.5">
                Hantera kundprofiler, slå ihop dubbletter och få fullständig överblick
              </p>
            </div>

            <div className="flex items-center gap-1">
              <Button
                onClick={() => setShowExport(true)}
                variant="outline"
                className="flex items-center gap-1 text-[9px] h-6 px-2"
              >
                <Download className="h-2.5 w-2.5" />
                Exportera
              </Button>
              <Button
                onClick={() => setShowImport(true)}
                variant="outline"
                className="flex items-center gap-1 text-[9px] h-6 px-2"
              >
                <Upload className="h-2.5 w-2.5" />
                Importera
              </Button>
              <Button
                onClick={() => setShowSettings(true)}
                variant="outline"
                className="flex items-center gap-1 text-[9px] h-6 px-2"
              >
                <Settings className="h-2.5 w-2.5" />
                Inställningar
              </Button>
            </div>
          </div>

          {/* Statistics Bar - ULTRA KOMPAKT */}
          <div className="grid grid-cols-5 gap-1.5">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800 rounded-md p-1.5">
              <div className="flex items-center gap-1 mb-0.5">
                <Users className="h-2.5 w-2.5 text-blue-600" />
                <span className="text-[8px] text-blue-700 dark:text-blue-300 font-medium">Totalt Kunder</span>
              </div>
              <div className="text-[14px] font-bold text-blue-900 dark:text-blue-100">{stats.total}</div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30 border border-amber-200 dark:border-amber-800 rounded-md p-1.5">
              <div className="flex items-center gap-1 mb-0.5">
                <Star className="h-2.5 w-2.5 text-amber-600" />
                <span className="text-[8px] text-amber-700 dark:text-amber-300 font-medium">VIP Kunder</span>
              </div>
              <div className="text-[14px] font-bold text-amber-900 dark:text-amber-100">{stats.vip}</div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800 rounded-md p-1.5">
              <div className="flex items-center gap-1 mb-0.5">
                <Mail className="h-2.5 w-2.5 text-green-600" />
                <span className="text-[8px] text-green-700 dark:text-green-300 font-medium">Email-adresser</span>
              </div>
              <div className="text-[14px] font-bold text-green-900 dark:text-green-100">{stats.totalEmails}</div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border border-purple-200 dark:border-purple-800 rounded-md p-1.5">
              <div className="flex items-center gap-1 mb-0.5">
                <TrendingUp className="h-2.5 w-2.5 text-purple-600" />
                <span className="text-[8px] text-purple-700 dark:text-purple-300 font-medium">Total LTV</span>
              </div>
              <div className="text-[14px] font-bold text-purple-900 dark:text-purple-100">
                {(stats.totalLTV / 1000).toFixed(0)}k kr
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30 border border-red-200 dark:border-red-800 rounded-md p-1.5">
              <div className="flex items-center gap-1 mb-0.5">
                <Users className="h-2.5 w-2.5 text-red-600" />
                <span className="text-[8px] text-red-700 dark:text-red-300 font-medium">Dubbletter</span>
              </div>
              <div className="text-[14px] font-bold text-red-900 dark:text-red-100">{stats.duplicates}</div>
            </div>
          </div>
        </div>

        {/* Toolbar - ULTRA KOMPAKT */}
        <div className="px-3 py-1.5 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Sök efter namn, email eller telefon..."
                className="w-full pl-7 pr-2 py-1 text-[9px] border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-1">
              <Filter className="h-3 w-3 text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-2 py-1 text-[9px] border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white"
              >
                <option value="all">Alla kunder</option>
                <option value="vip">VIP kunder</option>
                <option value="merged">Sammanslagna</option>
                <option value="duplicates">Möjliga dubbletter</option>
              </select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedCustomers.size > 0 && (
            <div className="flex items-center gap-2 ml-3">
              <span className="text-[10px] text-gray-600 dark:text-gray-400 font-medium">
                {selectedCustomers.size} valda
              </span>
              <Button
                onClick={() => setShowBulkMerge(true)}
                disabled={selectedCustomers.size < 2}
                className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-[9px] h-6 px-2"
              >
                <Users className="h-3 w-3 mr-1" />
                Bulk Merge ({selectedCustomers.size})
              </Button>
              <Button
                onClick={() => setSelectedCustomers(new Set())}
                variant="outline"
                className="text-[9px] h-6 px-2"
              >
                Avmarkera alla
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Customer List - KOMPRIMERAD */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-3">
            {filteredCustomers.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-600 font-medium">Inga kunder hittades</p>
                <p className="text-[11px] text-gray-500 mt-1">Prova att ändra dina sökkriterier</p>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    className={`bg-white rounded-lg border p-2.5 hover:shadow-md transition-all cursor-pointer ${
                      selectedCustomers.has(customer.id)
                        ? "border-pink-500 bg-pink-50"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {/* Selection Checkbox */}
                      <button
                        onClick={() => toggleCustomerSelection(customer.id)}
                        className="mt-0.5 flex-shrink-0"
                      >
                        {selectedCustomers.has(customer.id) ? (
                          <CheckSquare className="h-4 w-4 text-pink-600" />
                        ) : (
                          <Square className="h-4 w-4 text-gray-400 hover:text-pink-500" />
                        )}
                      </button>

                      {/* Customer Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <h3 className="text-sm font-semibold text-gray-900">{customer.primaryName}</h3>
                          {customer.isVIP && (
                            <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                          )}
                          {customer.mergedProfiles.length > 0 && (
                            <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-medium">
                              {customer.mergedProfiles.length + 1} profiler
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div>
                            <div className="flex items-center gap-1 text-gray-600 mb-0.5">
                              <Mail className="h-2.5 w-2.5" />
                              <span className="font-medium">
                                {customer.emails.find(e => e.isPrimary)?.email}
                              </span>
                            </div>
                            {customer.emails.length > 1 && (
                              <div className="text-[10px] text-pink-600 ml-3.5">
                                +{customer.emails.length - 1} andra email-adresser
                              </div>
                            )}
                          </div>

                          {customer.phones.length > 0 && (
                            <div className="flex items-center gap-1 text-gray-600">
                              <Phone className="h-2.5 w-2.5" />
                              <span>{customer.phones.find(p => p.isPrimary)?.phone}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-3 mt-2 pt-2 border-t border-gray-200 text-[10px] text-gray-600">
                          <div>
                            <span className="font-medium">{customer.totalConversations}</span> konv.
                          </div>
                          <div>
                            <span className="font-medium">{customer.totalMessages}</span> msg
                          </div>
                          {customer.lifetimeValue && (
                            <div className="text-pink-600 font-semibold">
                              {customer.lifetimeValue.toLocaleString("sv-SE")} kr LTV
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Customer Identity Manager */}
        <div className="w-96 border-l border-gray-200 bg-white overflow-y-auto">
          <CustomerIdentityManager
            customers={customers}
            onMerge={handleMerge}
            onSplit={handleSplit}
            onSetPrimaryEmail={handleSetPrimaryEmail}
          />
        </div>
      </div>

      {/* Modals */}
      {showMergeModal && selectedCustomerA && selectedCustomerB && (
        <ContactMergeModal
          isOpen={showMergeModal}
          onClose={() => {
            setShowMergeModal(false);
            setSelectedCustomerA(null);
            setSelectedCustomerB(null);
          }}
          customerA={selectedCustomerA}
          customerB={selectedCustomerB}
          onConfirmMerge={handleConfirmMerge}
        />
      )}

      {showBulkMerge && (
        <BulkMergePanel
          isOpen={showBulkMerge}
          onClose={() => setShowBulkMerge(false)}
          selectedCustomerIds={Array.from(selectedCustomers)}
          customers={customers.filter(c => selectedCustomers.has(c.id))}
          onConfirmBulkMerge={handleBulkMerge}
        />
      )}

      {showExport && (
        <ExportCustomersModal
          customers={customers}
          onClose={() => setShowExport(false)}
        />
      )}

      {showImport && (
        <ImportCustomersModal
          existingCustomers={customers}
          onClose={() => setShowImport(false)}
          onImport={handleImportCustomers}
        />
      )}

      {showSettings && (
        <CustomerIdentitySettingsModal
          initialSettings={settings}
          onClose={() => setShowSettings(false)}
          onSave={handleSaveSettings}
          onResetData={handleResetData}
        />
      )}
    </div>
  );
}
