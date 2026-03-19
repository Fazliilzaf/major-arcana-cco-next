import { useState, useEffect } from "react";
import { X, FileText, Tag, Calendar, User, Filter, Search, Eye, Lock, Users, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { getAllNotesFromStorage, getNotesByCustomer, getNotesByConversation, type NoteData } from "./notes-dialog";
import { toast } from "sonner";

interface NotesViewerPanelProps {
  isOpen: boolean;
  onClose: () => void;
  filterByCustomer?: string;
  filterByConversation?: string;
}

export function NotesViewerPanel({ 
  isOpen, 
  onClose,
  filterByCustomer,
  filterByConversation 
}: NotesViewerPanelProps) {
  const [notes, setNotes] = useState<NoteData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [visibilityFilter, setVisibilityFilter] = useState<string>("all");
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isOpen) {
      loadNotes();
    }
  }, [isOpen, filterByCustomer, filterByConversation]);

  const loadNotes = () => {
    let loadedNotes: NoteData[] = [];
    
    if (filterByCustomer) {
      loadedNotes = getNotesByCustomer(filterByCustomer);
    } else if (filterByConversation) {
      loadedNotes = getNotesByConversation(filterByConversation);
    } else {
      loadedNotes = getAllNotesFromStorage();
    }

    // Sort by timestamp (newest first)
    loadedNotes.sort((a, b) => {
      const dateA = new Date(a.timestamp || 0).getTime();
      const dateB = new Date(b.timestamp || 0).getTime();
      return dateB - dateA;
    });

    setNotes(loadedNotes);
  };

  const handleDeleteNote = (noteId: string) => {
    const NOTES_STORAGE_KEY = 'hairtp_customer_notes';
    const allNotes = getAllNotesFromStorage();
    const filteredNotes = allNotes.filter(note => note.id !== noteId);
    localStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(filteredNotes));
    loadNotes();
    toast.success("Anteckning borttagen");
  };

  const toggleNoteExpansion = (noteId: string) => {
    const newExpanded = new Set(expandedNotes);
    if (newExpanded.has(noteId)) {
      newExpanded.delete(noteId);
    } else {
      newExpanded.add(noteId);
    }
    setExpandedNotes(newExpanded);
  };

  if (!isOpen) return null;

  // Apply filters
  let filteredNotes = notes.filter(note => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesContent = note.content.toLowerCase().includes(query);
      const matchesTags = note.tags.some(tag => tag.toLowerCase().includes(query));
      if (!matchesContent && !matchesTags) return false;
    }

    // Category filter
    if (categoryFilter !== "all" && note.category !== categoryFilter) return false;

    // Priority filter
    if (priorityFilter !== "all" && note.priority !== priorityFilter) return false;

    // Visibility filter
    if (visibilityFilter !== "all" && note.visibility !== visibilityFilter) return false;

    return true;
  });

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      kundprofil: "Kundprofil",
      konversation: "Konversation",
      medicinsk: "Medicinsk",
      betalning: "Betalning",
      sla: "SLA/Eskalering",
      intern: "Intern",
      uppfoljning: "Uppföljning",
    };
    return labels[category] || category;
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      kundprofil: "👤",
      konversation: "💬",
      medicinsk: "🏥",
      betalning: "💰",
      sla: "🚨",
      intern: "🔒",
      uppfoljning: "📅",
    };
    return icons[category] || "📝";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700";
      case "medium": return "text-yellow-700 dark:text-yellow-300 bg-yellow-100 dark:bg-yellow-900/30 border-yellow-300 dark:border-yellow-700";
      case "low": return "text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700";
      default: return "text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-900/30 border-gray-300 dark:border-gray-700";
    }
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case "public": return <Eye className="h-2.5 w-2.5" />;
      case "team": return <Users className="h-2.5 w-2.5" />;
      case "private": return <Lock className="h-2.5 w-2.5" />;
      default: return <Eye className="h-2.5 w-2.5" />;
    }
  };

  const formatDate = (timestamp?: string) => {
    if (!timestamp) return "Okänt datum";
    const date = new Date(timestamp);
    return date.toLocaleString("sv-SE", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-6xl w-full border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
          <div className="flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-pink-600 dark:text-pink-400" />
            <h3 className="text-[11px] font-bold text-gray-900 dark:text-gray-100">
              Alla Anteckningar
            </h3>
            <span className="text-[9px] text-gray-500 dark:text-gray-400">
              • {filteredNotes.length} av {notes.length} anteckningar
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Filters */}
        <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <div className="grid grid-cols-4 gap-2">
            {/* Search */}
            <div className="col-span-2">
              <label className="text-[8px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide block mb-0.5">
                <Search className="h-2.5 w-2.5 inline mr-0.5" />
                Sök
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Sök i innehåll eller taggar..."
                className="w-full px-2 py-1 text-[9px] border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-1 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div>
              <label className="text-[8px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide block mb-0.5">
                <Filter className="h-2.5 w-2.5 inline mr-0.5" />
                Kategori
              </label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-2 py-1 text-[9px] border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">Alla</option>
                <option value="kundprofil">👤 Kundprofil</option>
                <option value="konversation">💬 Konversation</option>
                <option value="medicinsk">🏥 Medicinsk</option>
                <option value="betalning">💰 Betalning</option>
                <option value="sla">🚨 SLA</option>
                <option value="intern">🔒 Intern</option>
                <option value="uppfoljning">📅 Uppföljning</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <label className="text-[8px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide block mb-0.5">
                Prioritet
              </label>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full px-2 py-1 text-[9px] border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-1 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="all">Alla</option>
                <option value="high">🔴 Hög</option>
                <option value="medium">🟡 Medel</option>
                <option value="low">🟢 Låg</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto p-3">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-8 w-8 text-gray-400 dark:text-gray-600 mx-auto mb-2" />
              <p className="text-[10px] text-gray-600 dark:text-gray-400">
                {notes.length === 0 ? "Inga anteckningar än" : "Inga anteckningar matchar filtren"}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredNotes.map((note) => {
                const isExpanded = expandedNotes.has(note.id || "");
                return (
                  <div
                    key={note.id}
                    className="border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 overflow-hidden hover:border-purple-300 dark:hover:border-purple-600 transition-all"
                  >
                    {/* Note Header */}
                    <div className="px-3 py-2 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                          <span className="text-base leading-none">{getCategoryIcon(note.category)}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <h4 className="text-[10px] font-bold text-gray-900 dark:text-gray-100">
                                {getCategoryLabel(note.category)}
                              </h4>
                              <span className={`px-1.5 py-0.5 rounded text-[7px] font-bold border ${getPriorityColor(note.priority)}`}>
                                {note.priority === "high" ? "🔴 HÖG" : note.priority === "medium" ? "🟡 MEDEL" : "🟢 LÅG"}
                              </span>
                              <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[7px] font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
                                {getVisibilityIcon(note.visibility)}
                                {note.visibility === "public" ? "Publik" : note.visibility === "team" ? "Team" : "Privat"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <Calendar className="h-2.5 w-2.5 text-gray-500 dark:text-gray-400" />
                              <span className="text-[8px] text-gray-600 dark:text-gray-400">
                                {formatDate(note.timestamp)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleNoteExpansion(note.id || "")}
                            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                            title={isExpanded ? "Dölj" : "Visa mer"}
                          >
                            {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                          </button>
                          <button
                            onClick={() => handleDeleteNote(note.id || "")}
                            className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
                            title="Ta bort"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Note Content */}
                    <div className="px-3 py-2">
                      <p className={`text-[9px] text-gray-800 dark:text-gray-200 whitespace-pre-wrap ${!isExpanded && "line-clamp-2"}`}>
                        {note.content}
                      </p>

                      {/* Tags */}
                      {note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {note.tags.map((tag, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-[8px] font-medium border border-purple-200 dark:border-purple-700"
                            >
                              <Tag className="h-2 w-2" />
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Auto-linked items (expanded view) */}
                      {isExpanded && note.autoLinkedTo && (
                        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-[8px] font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-1">
                            Kopplad till:
                          </p>
                          <div className="space-y-0.5">
                            {note.autoLinkedTo.customers && note.autoLinkedTo.customers.length > 0 && (
                              <div className="flex items-center gap-1 text-[8px] text-gray-600 dark:text-gray-400">
                                <User className="h-2.5 w-2.5" />
                                <span>{note.autoLinkedTo.customers.join(", ")}</span>
                              </div>
                            )}
                            {note.autoLinkedTo.conversations && note.autoLinkedTo.conversations.length > 0 && (
                              <div className="flex items-center gap-1 text-[8px] text-gray-600 dark:text-gray-400">
                                💬
                                <span>{note.autoLinkedTo.conversations.join(", ")}</span>
                              </div>
                            )}
                            {note.autoLinkedTo.treatments && note.autoLinkedTo.treatments.length > 0 && (
                              <div className="flex items-center gap-1 text-[8px] text-gray-600 dark:text-gray-400">
                                🏥
                                <span>{note.autoLinkedTo.treatments.join(", ")}</span>
                              </div>
                            )}
                            {note.autoLinkedTo.bookings && note.autoLinkedTo.bookings.length > 0 && (
                              <div className="flex items-center gap-1 text-[8px] text-gray-600 dark:text-gray-400">
                                📅
                                <span>{note.autoLinkedTo.bookings.join(", ")}</span>
                              </div>
                            )}
                            {note.autoLinkedTo.teamMembers && note.autoLinkedTo.teamMembers.length > 0 && (
                              <div className="flex items-center gap-1 text-[8px] text-gray-600 dark:text-gray-400">
                                👥
                                <span>{note.autoLinkedTo.teamMembers.join(", ")}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-3 py-2 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <div className="text-[8px] text-gray-600 dark:text-gray-400">
            Totalt: <span className="font-bold text-pink-600 dark:text-pink-400">{notes.length}</span> anteckningar sparade
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-[10px] font-bold text-white bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 rounded shadow-sm hover:shadow transition-all"
          >
            Stäng
          </button>
        </div>
      </div>
    </div>
  );
}
