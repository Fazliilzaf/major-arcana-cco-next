import { X, Search, Filter, Calendar, User, Tag, Mail } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface AdvancedSearchModalProps {
  onClose: () => void;
  onSearch: (query: string, filters: any) => void;
}

export function AdvancedSearchModal({ onClose, onSearch }: AdvancedSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    sender: "",
    dateFrom: "",
    dateTo: "",
    tags: [] as string[],
    mailbox: "",
    hasAttachment: false,
  });

  const handleSearch = () => {
    if (!searchQuery.trim() && !filters.sender && !filters.dateFrom) {
      toast.error("Ange minst ett sökkriterium");
      return;
    }
    
    onSearch(searchQuery, filters);
    toast.success(`Söker efter: ${searchQuery || "med filter"}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-200">
              <Search className="h-5 w-5 text-blue-700" />
            </div>
            <div>
              <h3 className="text-[18px] font-semibold text-gray-900">Avancerad sökning</h3>
              <p className="text-[12px] text-gray-500">Sök i alla trådar och historik</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Main Search */}
        <div className="mb-6">
          <label className="block text-[12px] font-medium text-gray-700 mb-2">
            Sök i meddelanden
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Namn, ämne, nyckelord..."
              className="w-full rounded-lg border border-gray-200 pl-10 pr-4 py-3 text-[13px] focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          {/* Sender */}
          <div>
            <label className="block text-[11px] font-medium text-gray-600 mb-1.5">
              <User className="inline h-3 w-3 mr-1" />
              Från
            </label>
            <input
              type="text"
              value={filters.sender}
              onChange={(e) => setFilters({ ...filters, sender: e.target.value })}
              placeholder="Avsändare..."
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-[12px] focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Mailbox */}
          <div>
            <label className="block text-[11px] font-medium text-gray-600 mb-1.5">
              <Mail className="inline h-3 w-3 mr-1" />
              Mailbox
            </label>
            <select
              value={filters.mailbox}
              onChange={(e) => setFilters({ ...filters, mailbox: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-[12px] focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <option value="">Alla</option>
              <option value="bokning">Bokningar</option>
              <option value="info">Info</option>
              <option value="dr-svensson">Dr. Svensson</option>
            </select>
          </div>

          {/* Date From */}
          <div>
            <label className="block text-[11px] font-medium text-gray-600 mb-1.5">
              <Calendar className="inline h-3 w-3 mr-1" />
              Från datum
            </label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-[12px] focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* Date To */}
          <div>
            <label className="block text-[11px] font-medium text-gray-600 mb-1.5">
              <Calendar className="inline h-3 w-3 mr-1" />
              Till datum
            </label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-[12px] focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        {/* Attachment Filter */}
        <div className="mb-6">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.hasAttachment}
              onChange={(e) => setFilters({ ...filters, hasAttachment: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-[12px] text-gray-700">Endast med bifogade filer</span>
          </label>
        </div>

        {/* Search Results Preview */}
        <div className="mb-6 rounded-lg bg-blue-50 border border-blue-200 p-3">
          <p className="text-[11px] text-blue-900">
            <Filter className="inline h-3 w-3 mr-1" />
            Söker i: Alla meddelanden, konversationer och kundhistorik
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 rounded-full border-gray-200 px-4 py-2.5 text-[13px] font-medium text-gray-700 hover:bg-gray-50"
          >
            Avbryt
          </Button>
          <Button
            onClick={handleSearch}
            className="flex-1 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 text-[13px] font-semibold text-white hover:from-blue-700 hover:to-blue-800 shadow-lg"
          >
            <Search className="inline h-4 w-4 mr-1.5" />
            Sök
          </Button>
        </div>
      </div>
    </div>
  );
}
