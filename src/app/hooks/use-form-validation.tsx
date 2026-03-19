import { useState } from "react";

interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => boolean;
  message: string;
}

interface FieldValidation {
  [key: string]: ValidationRule[];
}

interface ValidationErrors {
  [key: string]: string | null;
}

export function useFormValidation(fields: FieldValidation) {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const validateField = (fieldName: string, value: string): string | null => {
    const rules = fields[fieldName];
    if (!rules) return null;

    for (const rule of rules) {
      // Required validation
      if (rule.required && !value.trim()) {
        return rule.message;
      }

      // Min length validation
      if (rule.minLength && value.length < rule.minLength) {
        return rule.message;
      }

      // Max length validation
      if (rule.maxLength && value.length > rule.maxLength) {
        return rule.message;
      }

      // Pattern validation
      if (rule.pattern && !rule.pattern.test(value)) {
        return rule.message;
      }

      // Custom validation
      if (rule.custom && !rule.custom(value)) {
        return rule.message;
      }
    }

    return null;
  };

  const validate = (fieldName: string, value: string) => {
    const error = validateField(fieldName, value);
    setErrors((prev) => ({ ...prev, [fieldName]: error }));
    return error === null;
  };

  const validateAll = (values: { [key: string]: string }): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    Object.keys(fields).forEach((fieldName) => {
      const error = validateField(fieldName, values[fieldName] || "");
      newErrors[fieldName] = error;
      if (error) isValid = false;
    });

    setErrors(newErrors);
    return isValid;
  };

  const touch = (fieldName: string) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
  };

  const reset = () => {
    setErrors({});
    setTouched({});
  };

  return {
    errors,
    touched,
    validate,
    validateAll,
    touch,
    reset,
    hasError: (fieldName: string) => touched[fieldName] && !!errors[fieldName],
    getError: (fieldName: string) => (touched[fieldName] ? errors[fieldName] : null),
  };
}

// Common validation rules
export const emailRule: ValidationRule = {
  pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  message: "Ogiltig e-postadress",
};

export const phoneRule: ValidationRule = {
  pattern: /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
  message: "Ogiltigt telefonnummer",
};

export const requiredRule = (fieldName: string): ValidationRule => ({
  required: true,
  message: `${fieldName} är obligatoriskt`,
});

export const minLengthRule = (length: number): ValidationRule => ({
  minLength: length,
  message: `Minst ${length} tecken krävs`,
});

export const maxLengthRule = (length: number): ValidationRule => ({
  maxLength: length,
  message: `Max ${length} tecken tillåtna`,
});
