import { Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export function ThemeSelector() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Apply theme to document
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    toast.success(newTheme === "dark" ? "Mörkt tema aktiverat" : "Ljust tema aktiverat");
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-[12px] font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
    >
      {theme === "light" ? (
        <>
          <Sun className="h-3.5 w-3.5 text-amber-500" />
          <span>Ljust</span>
        </>
      ) : (
        <>
          <Moon className="h-3.5 w-3.5 text-blue-500" />
          <span>Mörkt</span>
        </>
      )}
    </button>
  );
}
