import { WifiOff, AlertCircle } from "lucide-react";
import { useNetworkStatus } from "../hooks/use-network-status";

export function OfflineBanner() {
  const { isOnline } = useNetworkStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-2.5 text-white shadow-lg">
      <WifiOff className="h-4 w-4 animate-pulse" />
      <p className="text-sm font-semibold">
        Du är offline - Vissa funktioner kan vara begränsade
      </p>
      <AlertCircle className="h-4 w-4" />
    </div>
  );
}
