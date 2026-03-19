import { useState } from "react";
import { X, Mail, User, AtSign, Sparkles, Tag, Plus, Check } from "lucide-react";
import { Button } from "./ui/button";

interface AddMailboxModalProps {
  onClose: () => void;
  onAdd: (mailbox: { 
    email: string; 
    name: string; 
    signatureId: string; 
    tones: string[]; 
    categories: string[];
  }) => void;
  availableSignatures: { id: string; name: string }[];
}

const DEFAULT_CATEGORIES = [
  { id: "booking", label: "Bokning", icon: "📅", color: "blue" },
  { id: "support", label: "Support", icon: "💬", color: "green" },
  { id: "vip", label: "VIP", icon: "⭐", color: "yellow" },
  { id: "billing", label: "Ekonomi", icon: "💰", color: "purple" },
  { id: "info", label: "Information", icon: "ℹ️", color: "gray" },
  { id: "marketing", label: "Marknadsföring", icon: "📢", color: "pink" },
  { id: "consultation", label: "Konsultation", icon: "🩺", color: "teal" },
  { id: "general", label: "Allmänt", icon: "📧", color: "slate" },
];

const DEFAULT_TONES = [
  { id: "professional", label: "Professionell" },
  { id: "warm", label: "Varm" },
  { id: "casual", label: "Casual" },
  { id: "formal", label: "Formell" },
];

export function AddMailboxModalAdvanced({ onClose, onAdd, availableSignatures }: AddMailboxModalProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [selectedTones, setSelectedTones] = useState<string[]>(["professional"]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["general"]);
  const [signatureId, setSignatureId] = useState("fazli");
  const [aiSuggestion, setAiSuggestion] = useState<string>("");

  // Custom categories & tones
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [tones, setTones] = useState(DEFAULT_TONES);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddTone, setShowAddTone] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryIcon, setNewCategoryIcon] = useState("📧");
  const [newToneName, setNewToneName] = useState("");

  // AI Smart Detection
  const handleEmailChange = (value: string) => {
    setEmail(value);
    
    const emailLower = value.toLowerCase();
    
    if (emailLower.includes("bokning") || emailLower.includes("booking")) {
      setSelectedCategories(["booking"]);
      setAiSuggestion("Bokningar");
      if (!name) setName("Bokningar");
    } else if (emailLower.includes("support") || emailLower.includes("help")) {
      setSelectedCategories(["support"]);
      setAiSuggestion("Support");
      if (!name) setName("Support");
    } else if (emailLower.includes("vip") || emailLower.includes("premium")) {
      setSelectedCategories(["vip"]);
      setSelectedTones(["warm"]);
      setAiSuggestion("VIP");
      if (!name) setName("VIP");
    } else if (emailLower.includes("kvitto") || emailLower.includes("faktura") || emailLower.includes("billing")) {
      setSelectedCategories(["billing"]);
      setAiSuggestion("Ekonomi");
      if (!name) setName("Ekonomi");
    } else if (emailLower.includes("info") || emailLower.includes("information")) {
      setSelectedCategories(["info"]);
      setAiSuggestion("Information");
      if (!name) setName("Information");
    } else if (emailLower.includes("marknad") || emailLower.includes("marketing")) {
      setSelectedCategories(["marketing"]);
      setSelectedTones(["casual"]);
      setAiSuggestion("Marknadsföring");
      if (!name) setName("Marknadsföring");
    } else if (emailLower.includes("kons") || emailLower.includes("consultation")) {
      setSelectedCategories(["consultation"]);
      setSelectedTones(["warm"]);
      setAiSuggestion("Konsultation");
      if (!name) setName("Konsultation");
    }
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleTone = (toneId: string) => {
    setSelectedTones(prev =>
      prev.includes(toneId)
        ? prev.filter(t => t !== toneId)
        : [...prev, toneId]
    );
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory = {
        id: newCategoryName.toLowerCase().replace(/\s+/g, '-'),
        label: newCategoryName,
        icon: newCategoryIcon,
        color: "purple",
      };
      setCategories([...categories, newCategory]);
      setSelectedCategories([...selectedCategories, newCategory.id]);
      setNewCategoryName("");
      setNewCategoryIcon("📧");
      setShowAddCategory(false);
    }
  };

  const handleAddTone = () => {
    if (newToneName.trim()) {
      const newTone = {
        id: newToneName.toLowerCase().replace(/\s+/g, '-'),
        label: newToneName,
      };
      setTones([...tones, newTone]);
      setSelectedTones([...selectedTones, newTone.id]);
      setNewToneName("");
      setShowAddTone(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && name && selectedCategories.length > 0 && selectedTones.length > 0) {
      onAdd({ 
        email, 
        name, 
        signatureId, 
        tones: selectedTones,
        categories: selectedCategories,
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-rose-500">
              <Mail className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Lägg till mailbox</h2>
              <p className="text-xs text-gray-500">Ny inkorg för HairTP Clinic</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email - Med AI Detection */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-700">
              <AtSign className="h-3.5 w-3.5" />
              E-postadress
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                placeholder="namn@hairtpclinic.com"
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-pink-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-100"
                required
              />
              {aiSuggestion && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] font-medium text-pink-600">
                  <Sparkles className="h-3 w-3" />
                  Auto-detekterat
                </div>
              )}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-gray-700">
              <User className="h-3.5 w-3.5" />
              Namn
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="t.ex. Bokningar, Support, VIP"
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-pink-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-100"
              required
            />
          </div>

          {/* Categories - MULTI-SELECT */}
          <div>
            <label className="mb-2 flex items-center justify-between text-xs font-semibold text-gray-700">
              <span className="flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5" />
                Kategorier ({selectedCategories.length} valda)
              </span>
              <button
                type="button"
                onClick={() => setShowAddCategory(!showAddCategory)}
                className="flex items-center gap-1 text-[10px] font-medium text-pink-600 hover:text-pink-700"
              >
                <Plus className="h-3 w-3" />
                Lägg till kategori
              </button>
            </label>

            {/* Add Category Form */}
            {showAddCategory && (
              <div className="mb-3 rounded-lg border border-pink-200 bg-pink-50 p-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCategoryIcon}
                    onChange={(e) => setNewCategoryIcon(e.target.value)}
                    placeholder="📧"
                    className="w-12 rounded-md border border-gray-200 px-2 py-1 text-center text-sm"
                  />
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Kategorinamn"
                    className="flex-1 rounded-md border border-gray-200 px-3 py-1 text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="rounded-md bg-pink-600 px-3 py-1 text-xs font-medium text-white hover:bg-pink-700"
                  >
                    Lägg till
                  </button>
                </div>
              </div>
            )}

            {/* Category Grid */}
            <div className="grid grid-cols-4 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCategory(cat.id)}
                  className={`relative flex flex-col items-center gap-1 rounded-lg border p-2.5 text-center transition-all ${
                    selectedCategories.includes(cat.id)
                      ? "border-pink-300 bg-pink-50 ring-2 ring-pink-100"
                      : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  {selectedCategories.includes(cat.id) && (
                    <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-pink-600">
                      <Check className="h-2.5 w-2.5 text-white" />
                    </div>
                  )}
                  <span className="text-base">{cat.icon}</span>
                  <span className="text-[9px] font-medium text-gray-700">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tones - MULTI-SELECT */}
          <div>
            <label className="mb-2 flex items-center justify-between text-xs font-semibold text-gray-700">
              <span>Tonaliteter ({selectedTones.length} valda)</span>
              <button
                type="button"
                onClick={() => setShowAddTone(!showAddTone)}
                className="flex items-center gap-1 text-[10px] font-medium text-pink-600 hover:text-pink-700"
              >
                <Plus className="h-3 w-3" />
                Lägg till tonalitet
              </button>
            </label>

            {/* Add Tone Form */}
            {showAddTone && (
              <div className="mb-3 rounded-lg border border-pink-200 bg-pink-50 p-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newToneName}
                    onChange={(e) => setNewToneName(e.target.value)}
                    placeholder="T.ex. Entusiastisk, Empatisk"
                    className="flex-1 rounded-md border border-gray-200 px-3 py-1.5 text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddTone}
                    className="rounded-md bg-pink-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-pink-700"
                  >
                    Lägg till
                  </button>
                </div>
              </div>
            )}

            {/* Tones Grid */}
            <div className="grid grid-cols-3 gap-2">
              {tones.map((tone) => (
                <button
                  key={tone.id}
                  type="button"
                  onClick={() => toggleTone(tone.id)}
                  className={`relative rounded-lg border px-3 py-2.5 text-xs font-medium transition-all ${
                    selectedTones.includes(tone.id)
                      ? "border-pink-300 bg-pink-50 text-pink-700 ring-2 ring-pink-100"
                      : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {selectedTones.includes(tone.id) && (
                    <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-pink-600">
                      <Check className="h-2.5 w-2.5 text-white" />
                    </div>
                  )}
                  {tone.label}
                </button>
              ))}
            </div>
          </div>

          {/* Signature */}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-700">
              Signatur
            </label>
            <select
              value={signatureId}
              onChange={(e) => setSignatureId(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 focus:border-pink-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-100"
            >
              {availableSignatures.map((sig) => (
                <option key={sig.id} value={sig.id}>
                  {sig.name}
                </option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              className="flex-1"
            >
              Avbryt
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600"
              disabled={selectedCategories.length === 0 || selectedTones.length === 0}
            >
              Lägg till mailbox
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}