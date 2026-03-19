import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useState } from "react";

interface ValidatedInputProps {
  label: string;
  type?: "text" | "email" | "tel" | "textarea";
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  validate?: (value: string) => string | null;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  className?: string;
}

export function ValidatedInput({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  onBlur,
  validate,
  required = false,
  disabled = false,
  rows = 3,
  className = "",
}: ValidatedInputProps) {
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleBlur = () => {
    setTouched(true);
    if (validate) {
      const validationError = validate(value);
      setError(validationError);
    }
    onBlur?.();
  };

  const handleChange = (newValue: string) => {
    onChange(newValue);
    if (touched && validate) {
      const validationError = validate(newValue);
      setError(validationError);
    }
  };

  const showError = touched && error;
  const showSuccess = touched && !error && value.trim().length > 0;

  const baseClasses = `w-full px-3 py-2 text-sm border rounded-lg transition-all focus:outline-none focus:ring-2 ${
    showError
      ? "border-red-300 bg-red-50 focus:ring-red-500 focus:border-red-500"
      : showSuccess
      ? "border-green-300 bg-green-50 focus:ring-green-500 focus:border-green-500"
      : "border-gray-300 bg-white focus:ring-pink-500 focus:border-pink-500"
  } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`;

  return (
    <div className="w-full">
      <label className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-gray-700">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">
        {type === "textarea" ? (
          <textarea
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            className={baseClasses}
          />
        ) : (
          <input
            type={type}
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            onBlur={handleBlur}
            placeholder={placeholder}
            disabled={disabled}
            className={baseClasses}
          />
        )}

        {/* Success/Error icon */}
        {(showSuccess || showError) && (
          <div className="absolute right-3 top-2.5">
            {showSuccess && <CheckCircle2 className="h-4 w-4 text-green-600" />}
            {showError && <AlertCircle className="h-4 w-4 text-red-600" />}
          </div>
        )}
      </div>

      {/* Error message */}
      {showError && (
        <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}

      {/* Helper text for success */}
      {showSuccess && (
        <p className="mt-1 flex items-center gap-1 text-xs text-green-600">
          <CheckCircle2 className="h-3 w-3" />
          Ser bra ut!
        </p>
      )}
    </div>
  );
}

// Example validation functions
export const validators = {
  email: (value: string): string | null => {
    if (!value.trim()) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? null : "Ogiltig e-postadress";
  },

  phone: (value: string): string | null => {
    if (!value.trim()) return null;
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/;
    return phoneRegex.test(value) ? null : "Ogiltigt telefonnummer";
  },

  required: (fieldName: string) => (value: string): string | null => {
    return value.trim().length > 0 ? null : `${fieldName} är obligatoriskt`;
  },

  minLength: (length: number) => (value: string): string | null => {
    return value.length >= length ? null : `Minst ${length} tecken krävs`;
  },

  maxLength: (length: number) => (value: string): string | null => {
    return value.length <= length ? null : `Max ${length} tecken tillåtna`;
  },

  combine: (...validatorFns: Array<(value: string) => string | null>) => (value: string): string | null => {
    for (const validator of validatorFns) {
      const error = validator(value);
      if (error) return error;
    }
    return null;
  },
};
