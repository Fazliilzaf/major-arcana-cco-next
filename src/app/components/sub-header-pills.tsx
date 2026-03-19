export function SubHeaderPills() {
  const pills = [
    { label: "Hair TP Clinic - contact", active: true },
    { label: "2 agera nu", count: 2, color: "red" },
    { label: "1 bokningsåkara", count: 1, color: "blue" },
    { label: "Alla trådar", count: 7 },
    { label: "Agera nu", count: 2, color: "red" },
    { label: "Bokningsålar", count: 1, color: "blue" },
    { label: "Följ upp idag", count: 1, color: "amber" },
    { label: "Väntar på patient", count: 1 },
    { label: "Medicinsk granskning", count: 1, color: "purple" },
    { label: "Admin", count: 1 },
  ];

  const getColorClasses = (color?: string) => {
    switch (color) {
      case "red":
        return "bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700";
      case "blue":
        return "bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700";
      case "amber":
        return "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700";
      case "purple":
        return "bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-700";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700";
    }
  };

  return (
    <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-1.5">
      <div className="flex items-center gap-1.5 flex-wrap">
        {pills.map((pill, index) => (
          <span
            key={index}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium border transition-colors ${
              pill.active
                ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 border-gray-900 dark:border-gray-100"
                : getColorClasses(pill.color)
            }`}
          >
            {pill.label}
            {pill.count !== undefined && ` ${pill.count}`}
          </span>
        ))}
        <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] text-gray-600 dark:text-gray-400">
          1 oågda · 2 hög risk · vecka 2026-04-22 17:18
        </span>
        <button className="ml-auto px-2 py-0.5 rounded text-[9px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-colors">
          Uppdatera preview
        </button>
      </div>
    </div>
  );
}
