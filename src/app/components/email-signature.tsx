import { useState, useEffect } from "react";
import { Globe, Instagram } from "lucide-react";
import signatureLogo from "@/assets/74e827600f608f517f2916a96a413e7032a66eb4.png";

interface EmailSignatureProps {
  animated?: boolean;
}

export function EmailSignature({ animated = true }: EmailSignatureProps) {
  const [isVisible, setIsVisible] = useState(!animated);

  useEffect(() => {
    if (animated) {
      // Trigger animation after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [animated]);

  return (
    <div 
      className={`transition-all duration-700 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 -translate-y-4'
      }`}
    >
      {/* Divider */}
      <div className="mb-3 border-t border-gray-200" />

      {/* Greeting */}
      <p className="text-[13px] text-gray-800 mb-3">
        Bästa hälsningar,
      </p>

      {/* Signature Content */}
      <div className="flex items-start gap-4">
        {/* Logo */}
        <div className="flex-shrink-0">
          <img 
            src={signatureLogo} 
            alt="HairTP Clinic Logo" 
            className="w-[120px] h-[120px] object-contain"
          />
        </div>

        {/* Vertical Divider */}
        <div className="h-[120px] w-[2px] bg-gray-300 flex-shrink-0" />

        {/* Contact Info */}
        <div className="flex-1 py-1">
          {/* Name */}
          <p className="text-[13px] font-light text-gray-500 mb-1">
            Fazli Krasniqi
          </p>

          {/* Title */}
          <p className="text-[15px] font-semibold text-gray-900 mb-2 leading-tight">
            Hårspecialist I Hårtransplantationer & PRP-injektioner
          </p>

          {/* Phone */}
          <p className="text-[13px] text-gray-700 mb-0.5">
            031-881166
          </p>

          {/* Email */}
          <p className="text-[13px] text-gray-700 mb-0.5">
            contact@hairtpclinic.com
          </p>

          {/* Address */}
          <p className="text-[13px] text-gray-700 mb-3">
            Vasaplatsen 2, 411 34 Göteborg
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-2">
            <a 
              href="https://hairtpclinic.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Globe className="h-5 w-5" />
            </a>
            <a 
              href="https://instagram.com/hairtpclinic" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Instagram className="h-5 w-5" />
            </a>
            <a 
              href="https://facebook.com/hairtpclinic" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
