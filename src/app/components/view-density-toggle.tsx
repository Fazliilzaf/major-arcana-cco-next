import { LayoutGrid, List, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export type ViewDensity = 'comfortable' | 'compact' | 'super-compact';

interface ViewDensityToggleProps {
  onChange?: (density: ViewDensity) => void;
}

export function ViewDensityToggle({ onChange }: ViewDensityToggleProps) {
  const [density, setDensity] = useState<ViewDensity>('comfortable');

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('cco-view-density');
    if (saved && (saved === 'comfortable' || saved === 'compact' || saved === 'super-compact')) {
      setDensity(saved as ViewDensity);
      onChange?.(saved as ViewDensity);
    }
  }, [onChange]);

  const handleDensityChange = (newDensity: ViewDensity) => {
    setDensity(newDensity);
    localStorage.setItem('cco-view-density', newDensity);
    onChange?.(newDensity);
    
    // Visual feedback
    const labels = {
      comfortable: 'Comfortable · Mer info, färre meddelanden',
      compact: 'Compact · Balanserad vy',
      'super-compact': 'Super Compact · Fler meddelanden, mindre info'
    };
    toast.success(labels[newDensity], { duration: 1500 });
  };

  return (
    <div className="flex items-center gap-0.5 bg-gray-100 rounded-lg p-0.5">
      <button
        onClick={() => handleDensityChange('comfortable')}
        className={`p-1 rounded transition-all duration-200 ${
          density === 'comfortable'
            ? 'bg-white text-pink-600 shadow-sm scale-105'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
        }`}
        title="Comfortable - Mer info, färre meddelanden"
        aria-label="Comfortable view density"
      >
        <LayoutGrid className="w-2.5 h-2.5" />
      </button>
      <button
        onClick={() => handleDensityChange('compact')}
        className={`p-1 rounded transition-all duration-200 ${
          density === 'compact'
            ? 'bg-white text-pink-600 shadow-sm scale-105'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
        }`}
        title="Compact - Balanserad vy"
        aria-label="Compact view density"
      >
        <List className="w-2.5 h-2.5" />
      </button>
      <button
        onClick={() => handleDensityChange('super-compact')}
        className={`p-1 rounded transition-all duration-200 ${
          density === 'super-compact'
            ? 'bg-white text-pink-600 shadow-sm scale-105'
            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
        }`}
        title="Super Compact - Fler meddelanden, mindre info"
        aria-label="Super compact view density"
      >
        <Menu className="w-2.5 h-2.5" />
      </button>
    </div>
  );
}