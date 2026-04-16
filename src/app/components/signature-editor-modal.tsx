import { X, Edit2, Wand2, Save, RotateCcw, Globe, Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { AnimatedSignatureLogo } from "./animated-signature-logo";
import signatureLogo from "@/assets/74e827600f608f517f2916a96a413e7032a66eb4.png";

// Instagram and Facebook icons
function Instagram({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function Facebook({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

interface Signature {
  id: string;
  name: string;
  title: string;
  phone: string;
  email: string;
  address: string;
  website: string;
  instagram: string;
  facebook: string;
  greeting: string;
  logo: string;
}

interface SignatureEditorModalProps {
  onClose: () => void;
  onSignatureChange: (signatureId: string) => void;
  currentSignature: Signature;
  selectedSignatureId: string;
}

export function SignatureEditorModal({ onClose, onSignatureChange, currentSignature, selectedSignatureId }: SignatureEditorModalProps) {
  const [signature, setSignature] = useState<Signature>(currentSignature);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    // Save the edited signature (in a real app, this would update the signature store)
    toast.success("Signatur sparad!");
    onClose();
  };

  const handleSelectSignature = (signatureId: string) => {
    const newSignature = defaultSignatures[signatureId];
    if (newSignature) {
      setSignature(newSignature);
      onSignatureChange(signatureId);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSignature({ ...signature, logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[18px] font-semibold text-gray-900">Redigera e-postsignatur</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Signature selector */}
        <div className="mb-4 flex gap-2">
          <button
            onClick={() => handleSelectSignature('fazli')}
            className={`flex-1 rounded-lg border p-2 text-[12px] font-medium transition-all ${
              selectedSignatureId === 'fazli'
                ? 'border-pink-300 bg-pink-50 text-pink-900'
                : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Fazli Krasniqi
          </button>
          <button
            onClick={() => handleSelectSignature('egzona')}
            className={`flex-1 rounded-lg border p-2 text-[12px] font-medium transition-all ${
              selectedSignatureId === 'egzona'
                ? 'border-pink-300 bg-pink-50 text-pink-900'
                : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Egzona Krasniqi
          </button>
        </div>

        <div className="space-y-4">
          {/* Greeting */}
          <div>
            <label className="block text-[12px] font-medium text-gray-700 mb-1">
              Hälsningsfras
            </label>
            <input
              type="text"
              value={signature.greeting}
              onChange={(e) => setSignature({ ...signature, greeting: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-[13px] focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
              placeholder="Bästa hälsningar,"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block text-[12px] font-medium text-gray-700 mb-1">
              Namn
            </label>
            <input
              type="text"
              value={signature.name}
              onChange={(e) => setSignature({ ...signature, name: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-[13px] focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
              placeholder="Fazli Krasniqi"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-[12px] font-medium text-gray-700 mb-1">
              Titel
            </label>
            <input
              type="text"
              value={signature.title}
              onChange={(e) => setSignature({ ...signature, title: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-[13px] focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
              placeholder="Hårspecialist I Hårtransplantationer & PRP-injektioner"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-[12px] font-medium text-gray-700 mb-1">
              Telefon
            </label>
            <input
              type="text"
              value={signature.phone}
              onChange={(e) => setSignature({ ...signature, phone: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-[13px] focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
              placeholder="031-881166"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-[12px] font-medium text-gray-700 mb-1">
              E-post
            </label>
            <input
              type="email"
              value={signature.email}
              onChange={(e) => setSignature({ ...signature, email: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-[13px] focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
              placeholder="contact@hairtpclinic.com"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-[12px] font-medium text-gray-700 mb-1">
              Adress
            </label>
            <input
              type="text"
              value={signature.address}
              onChange={(e) => setSignature({ ...signature, address: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-[13px] focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
              placeholder="Vasaplatsen 2, 411 34 Göteborg"
            />
          </div>

          {/* Social Links */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[12px] font-medium text-gray-700 mb-1">
                Webbplats
              </label>
              <input
                type="url"
                value={signature.website}
                onChange={(e) => setSignature({ ...signature, website: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-[13px] focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-gray-700 mb-1">
                Instagram
              </label>
              <input
                type="url"
                value={signature.instagram}
                onChange={(e) => setSignature({ ...signature, instagram: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-[13px] focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
                placeholder="https://instagram.com/..."
              />
            </div>
            <div>
              <label className="block text-[12px] font-medium text-gray-700 mb-1">
                Facebook
              </label>
              <input
                type="url"
                value={signature.facebook}
                onChange={(e) => setSignature({ ...signature, facebook: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-[13px] focus:border-pink-300 focus:outline-none focus:ring-2 focus:ring-pink-100"
                placeholder="https://facebook.com/..."
              />
            </div>
          </div>

          {/* Logo Upload */}
          <div className="mt-4">
            <label className="block text-[12px] font-medium text-gray-700 mb-1">
              Ladda upp logotyp
            </label>
            <div className="flex items-center">
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 rounded-full bg-pink-900 px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-pink-800"
              >
                <Upload className="h-4 w-4 mr-2" />
                Ladda upp
              </Button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
              />
              {signature.logo && (
                <div className="ml-4">
                  <img
                    src={signature.logo}
                    alt="Uploaded Logo"
                    className="w-10 h-10 object-contain"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="mt-6 border-t border-gray-200 pt-4">
            <p className="text-[12px] font-medium text-gray-700 mb-3">Förhandsvisning</p>
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <SignaturePreview signature={signature} />
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 rounded-full border-gray-200 px-4 py-2.5 text-[13px] font-medium text-gray-700 hover:bg-gray-50"
          >
            Avbryt
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1 rounded-full bg-pink-900 px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-pink-800"
          >
            Spara signatur
          </Button>
        </div>
      </div>
    </div>
  );
}

function SignaturePreview({ signature }: { signature: Signature }) {
  return (
    <div className="bg-white p-4">
      <p className="text-[8px] text-gray-800 mb-3.5">{signature.greeting}</p>
      
      <div className="flex gap-2.5 items-center">
        {/* Logo - Cirkulär HairTP Clinic logo med drop-in animation */}
        <div className="flex-shrink-0">
          <AnimatedSignatureLogo
            src={signature.logo}
            alt="HairTP Clinic"
            className="w-[87px] h-[87px] object-contain"
          />
        </div>

        {/* Vertical divider - 25% större */}
        <div className="w-[2px] bg-[#C5B5A5] h-[87px] flex-shrink-0"></div>

        {/* Info - Vertikalt centrerad */}
        <div className="flex-1 flex flex-col justify-center">
          {/* Name - beige/taupe färg som i bilden */}
          <p className="text-[8px] font-normal mb-0.5" style={{ color: '#C5B5A5' }}>
            {signature.name}
          </p>
          {/* Title - Bold svart */}
          <p className="text-[8px] font-bold text-gray-900 mb-0.5">{signature.title}</p>
          {/* Phone */}
          <p className="text-[8px] text-gray-900 mb-0.5">{signature.phone}</p>
          {/* Email */}
          <p className="text-[8px] text-gray-900 mb-0.5">{signature.email}</p>
          {/* Address */}
          <p className="text-[8px] text-gray-900 mb-2">{signature.address}</p>
          
          {/* Social Icons - Neutral design med enkel outline istället för mörka cirklar */}
          <div className="flex items-center gap-1.5">
            {signature.website && (
              <a 
                href={signature.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="Webbplats"
              >
                <Globe className="h-3.5 w-3.5" strokeWidth={1.5} />
              </a>
            )}
            {signature.instagram && (
              <a 
                href={signature.instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="Instagram"
              >
                <Instagram className="h-3.5 w-3.5" />
              </a>
            )}
            {signature.facebook && (
              <a 
                href={signature.facebook} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="Facebook"
              >
                <Facebook className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export const defaultSignatures: { [key: string]: Signature } = {
  "fazli": {
    id: "fazli",
    name: "Fazli Krasniqi",
    title: "Hårspecialist I Hårtransplantationer & PRP-injektioner",
    phone: "031-881166",
    email: "contact@hairtpclinic.com",
    address: "Vasaplatsen 2, 411 34 Göteborg",
    website: "https://hairtpclinic.com",
    instagram: "https://instagram.com/hairtpclinic",
    facebook: "https://facebook.com/hairtpclinic",
    greeting: "Bästa hälsningar,",
    logo: signatureLogo,
  },
  "egzona": {
    id: "egzona",
    name: "Egzona Krasniqi",
    title: "Hårspecialist I Hårtransplantationer & PRP-injektioner",
    phone: "031-881166",
    email: "contact@hairtpclinic.com",
    address: "Vasaplatsen 2, 411 34 Göteborg",
    website: "https://hairtpclinic.com",
    instagram: "https://instagram.com/hairtpclinic",
    facebook: "https://facebook.com/hairtpclinic",
    greeting: "Bästa hälsningar,",
    logo: signatureLogo,
  },
};
