import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Wifi, WifiOff } from "lucide-react";

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true
  );
  const [wasOffline, setWasOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (wasOffline) {
        toast.success(
          <div className="flex items-center gap-2">
            <Wifi className="h-4 w-4" />
            <span>Anslutningen är återställd</span>
          </div>,
          {
            duration: 3000,
          }
        );
        setWasOffline(false);
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setWasOffline(true);
      toast.error(
        <div className="flex items-center gap-2">
          <WifiOff className="h-4 w-4" />
          <span>Ingen internetanslutning</span>
        </div>,
        {
          duration: 5000,
        }
      );
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [wasOffline]);

  return { isOnline, wasOffline };
}
