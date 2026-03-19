import { Link, useLocation, useNavigate } from "react-router";
import { Inbox, Users, Zap, BarChart3, MoreHorizontal } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export function NavigationTabs() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const moreDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Check if click is outside any dropdown
      const isOutsideDropdown = !document.querySelector('.subnav-dropdown')?.contains(target);
      const isOutsideMoreDropdown = moreDropdownRef.current && !moreDropdownRef.current.contains(target);
      
      if (isOutsideDropdown && openDropdown) {
        setOpenDropdown(null);
      }
      if (isOutsideMoreDropdown) {
        setShowMore(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown]);

  // Close dropdowns when route changes
  useEffect(() => {
    setOpenDropdown(null);
    setShowMore(false);
  }, [location.pathname]);

  // Primär navigation - 5 huvudkategorier
  const primaryTabs = [
    { 
      name: "Konversationer", 
      paths: ["/", "/later", "/sent"],
      icon: Inbox,
      gradient: "from-pink-500 to-rose-500",
      activeColor: "text-pink-600 border-pink-600",
      hoverColor: "hover:text-pink-700 hover:bg-pink-50",
      subnav: [
        { name: "Inkorg", path: "/" },
        { name: "Senare", path: "/later" },
        { name: "Skickade", path: "/sent" },
      ]
    },
    { 
      name: "Kunder", 
      paths: ["/customers"],
      icon: Users,
      gradient: "from-green-500 to-emerald-500",
      activeColor: "text-green-600 border-green-600",
      hoverColor: "hover:text-green-700 hover:bg-green-50"
    },
    { 
      name: "Automatisering", 
      paths: ["/workflows", "/templates", "/macros"],
      icon: Zap,
      gradient: "from-blue-500 to-cyan-500",
      activeColor: "text-blue-600 border-blue-600",
      hoverColor: "hover:text-blue-700 hover:bg-blue-50",
      subnav: [
        { name: "Arbetsflöden", path: "/workflows" },
        { name: "Mallar", path: "/templates" },
        { name: "Makron", path: "/macros" },
      ]
    },
    { 
      name: "Analys", 
      paths: ["/analytics"],
      icon: BarChart3,
      gradient: "from-purple-500 to-indigo-500",
      activeColor: "text-purple-600 border-purple-600",
      hoverColor: "hover:text-purple-700 hover:bg-purple-50"
    },
  ];

  const moreTabs = [
    { name: "Integrationer", path: "/integrations" },
    { name: "Inställningar", path: "/settings" },
    { name: "Showcase", path: "/showcase" },
  ];

  const isTabActive = (paths: string[]) => {
    return paths.some(path => {
      if (path === "/") return location.pathname === "/";
      return location.pathname.startsWith(path);
    });
  };

  const getActiveSubpath = (tab: typeof primaryTabs[0]) => {
    if (!tab.subnav) return null;
    return tab.subnav.find(sub => location.pathname === sub.path);
  };

  return (
    <nav className="border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 transition-colors">
      {/* Primär navigation - 30% STÖRRE */}
      <div className="px-6 flex gap-1">
        {primaryTabs.map((tab) => {
          const isActive = isTabActive(tab.paths);
          const Icon = tab.icon;
          const isDropdownOpen = openDropdown === tab.name;
          
          return (
            <div key={tab.name} className="relative group" ref={isDropdownOpen ? dropdownRef : undefined}>
              <button
                onClick={(e) => {
                  // If tab has subnav, toggle dropdown instead of navigating
                  if (tab.subnav && isActive) {
                    e.preventDefault();
                    setOpenDropdown(isDropdownOpen ? null : tab.name);
                  } else {
                    // Navigate if no subnav or not active
                    navigate(tab.paths[0]);
                  }
                }}
                className={`flex items-center gap-1.5 rounded-t-md px-3 py-1.5 text-[12px] font-bold transition-all cursor-pointer ${
                  isActive
                    ? `bg-gradient-to-br ${tab.gradient} text-white shadow-sm`
                    : `border-transparent text-gray-600 dark:text-gray-400 ${tab.hoverColor} dark:hover:bg-gray-800 dark:hover:text-gray-200`
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.name}
              </button>
              
              {/* Subnav dropdown - only show when explicitly opened */}
              {tab.subnav && isActive && isDropdownOpen && (
                <div className="absolute top-full left-0 mt-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-b-md shadow-lg py-1 min-w-[140px] z-10 subnav-dropdown">
                  {tab.subnav.map(sub => (
                    <Link
                      key={sub.path}
                      to={sub.path}
                      className={`block px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                        location.pathname === sub.path
                          ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }`}
                      onClick={() => setOpenDropdown(null)}
                    >
                      {sub.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* More dropdown - 30% STÖRRE */}
        <div className="relative">
          <button
            onClick={() => setShowMore(!showMore)}
            className={`flex items-center gap-1.5 rounded-t-md px-3 py-1.5 text-[12px] font-bold transition-all ${
              showMore || moreTabs.some(t => location.pathname === t.path)
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <MoreHorizontal className="h-3.5 w-3.5" />
            Mer
          </button>
          
          {showMore && (
            <div className="absolute top-full left-0 mt-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-b-md shadow-lg py-1 min-w-[140px] z-10" ref={moreDropdownRef}>
              {moreTabs.map(tab => (
                <Link
                  key={tab.path}
                  to={tab.path}
                  className={`block px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                    location.pathname === tab.path
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                  onClick={() => setShowMore(false)}
                >
                  {tab.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}