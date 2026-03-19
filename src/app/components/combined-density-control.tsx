import { ChevronDown, LayoutGrid, List, Menu, Target, Briefcase, BarChart3, Check } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { ViewDensity } from './view-density-toggle';
import { DensityMode } from './density-mode-selector';

interface CombinedDensityControlProps {
  viewDensity: ViewDensity;
  densityMode: DensityMode;
  onViewDensityChange: (density: ViewDensity) => void;
  onDensityModeChange: (mode: DensityMode) => void;
}

export function CombinedDensityControl({
  viewDensity,
  densityMode,
  onViewDensityChange,
  onDensityModeChange,
}: CombinedDensityControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleViewDensityChange = (newDensity: ViewDensity) => {
    onViewDensityChange(newDensity);
    const labels = {
      comfortable: 'Comfortable',
      compact: 'Compact',
      'super-compact': 'Super Compact'
    };
    toast.success(labels[newDensity], { duration: 1000 });
    setIsOpen(false); // Close dropdown after selection
  };

  const handleDensityModeChange = (newMode: DensityMode) => {
    onDensityModeChange(newMode);
    const labels = {
      focus: 'Fokus',
      work: 'Arbete',
      overview: 'Översikt'
    };
    toast.success(labels[newMode], { duration: 1000 });
    setIsOpen(false); // Close dropdown after selection
  };

  // Get current icon based on view density
  const getCurrentIcon = () => {
    switch (viewDensity) {
      case 'comfortable':
        return <LayoutGrid className="h-3 w-3" />;
      case 'compact':
        return <List className="h-3 w-3" />;
      case 'super-compact':
        return <Menu className="h-3 w-3" />;
    }
  };

  // Get current mode label
  const getCurrentModeLabel = () => {
    switch (densityMode) {
      case 'focus':
        return 'Fokus';
      case 'work':
        return 'Arbete';
      case 'overview':
        return 'Översikt';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Compact Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-all ${
          isOpen 
            ? 'bg-pink-100 text-pink-700 shadow-sm' 
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
        }`}
        title="Ändra vy och läge"
        aria-label="Ändra vy-täthet och arbetsläge"
      >
        {getCurrentIcon()}
        <span className="text-xs font-medium">{getCurrentModeLabel()}</span>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-2 animate-in fade-in slide-in-from-top-1 duration-200">
          {/* View Density Section */}
          <div className="px-3 py-2 border-b border-gray-100">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Vy-täthet</p>
            <div className="space-y-0.5">
              <button
                onClick={() => handleViewDensityChange('comfortable')}
                className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm transition-all ${
                  viewDensity === 'comfortable'
                    ? 'bg-pink-50 text-pink-700 font-medium'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <LayoutGrid className="h-4 w-4" />
                  <div className="text-left">
                    <div className="font-medium">Comfortable</div>
                    <div className="text-[10px] text-gray-500">~8-12 mail</div>
                  </div>
                </div>
                {viewDensity === 'comfortable' && <Check className="h-4 w-4 text-pink-600" />}
              </button>

              <button
                onClick={() => handleViewDensityChange('compact')}
                className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm transition-all ${
                  viewDensity === 'compact'
                    ? 'bg-pink-50 text-pink-700 font-medium'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <List className="h-4 w-4" />
                  <div className="text-left">
                    <div className="font-medium">Compact</div>
                    <div className="text-[10px] text-gray-500">~15-20 mail</div>
                  </div>
                </div>
                {viewDensity === 'compact' && <Check className="h-4 w-4 text-pink-600" />}
              </button>

              <button
                onClick={() => handleViewDensityChange('super-compact')}
                className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm transition-all ${
                  viewDensity === 'super-compact'
                    ? 'bg-pink-50 text-pink-700 font-medium'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Menu className="h-4 w-4" />
                  <div className="text-left">
                    <div className="font-medium">Super Compact</div>
                    <div className="text-[10px] text-gray-500">~25-30 mail</div>
                  </div>
                </div>
                {viewDensity === 'super-compact' && <Check className="h-4 w-4 text-pink-600" />}
              </button>
            </div>
          </div>

          {/* Density Mode Section */}
          <div className="px-3 py-2">
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Arbetsläge</p>
            <div className="space-y-0.5">
              <button
                onClick={() => handleDensityModeChange('focus')}
                className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm transition-all ${
                  densityMode === 'focus'
                    ? 'bg-pink-50 text-pink-700 font-medium'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  <span>Fokus</span>
                </div>
                {densityMode === 'focus' && <Check className="h-4 w-4 text-pink-600" />}
              </button>

              <button
                onClick={() => handleDensityModeChange('work')}
                className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm transition-all ${
                  densityMode === 'work'
                    ? 'bg-pink-50 text-pink-700 font-medium'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  <span>Arbete</span>
                </div>
                {densityMode === 'work' && <Check className="h-4 w-4 text-pink-600" />}
              </button>

              <button
                onClick={() => handleDensityModeChange('overview')}
                className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm transition-all ${
                  densityMode === 'overview'
                    ? 'bg-pink-50 text-pink-700 font-medium'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span>Översikt</span>
                </div>
                {densityMode === 'overview' && <Check className="h-4 w-4 text-pink-600" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}