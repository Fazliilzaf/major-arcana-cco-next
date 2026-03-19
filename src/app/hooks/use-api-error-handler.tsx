import { toast } from "sonner";
import { AlertCircle, WifiOff, ServerCrash, Ban } from "lucide-react";

export interface ApiError {
  status?: number;
  message: string;
  details?: any;
}

export function useApiErrorHandler() {
  const handleError = (error: ApiError | Error) => {
    // Check if it's a network error
    if (!navigator.onLine) {
      toast.error(
        <div className="flex items-center gap-2">
          <WifiOff className="h-4 w-4" />
          <div>
            <p className="font-semibold">Ingen internetanslutning</p>
            <p className="text-xs">Kontrollera din uppkoppling och försök igen</p>
          </div>
        </div>,
        { duration: 5000 }
      );
      return;
    }

    // Type guard to check if error is ApiError
    const apiError = error as ApiError;

    // Handle different HTTP status codes
    if (apiError.status) {
      switch (apiError.status) {
        case 400:
          toast.error(
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <div>
                <p className="font-semibold">Ogiltig begäran</p>
                <p className="text-xs">{apiError.message || "Kontrollera din inmatning och försök igen"}</p>
              </div>
            </div>
          );
          break;

        case 401:
          toast.error(
            <div className="flex items-center gap-2">
              <Ban className="h-4 w-4" />
              <div>
                <p className="font-semibold">Ej auktoriserad</p>
                <p className="text-xs">Du måste logga in igen</p>
              </div>
            </div>,
            {
              duration: 10000,
              action: {
                label: "Logga in",
                onClick: () => {
                  // Redirect to login
                  window.location.href = "/login";
                },
              },
            }
          );
          break;

        case 403:
          toast.error(
            <div className="flex items-center gap-2">
              <Ban className="h-4 w-4" />
              <div>
                <p className="font-semibold">Åtkomst nekad</p>
                <p className="text-xs">Du har inte behörighet för denna åtgärd</p>
              </div>
            </div>
          );
          break;

        case 404:
          toast.error(
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <div>
                <p className="font-semibold">Hittades inte</p>
                <p className="text-xs">{apiError.message || "Resursen kunde inte hittas"}</p>
              </div>
            </div>
          );
          break;

        case 429:
          toast.error(
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <div>
                <p className="font-semibold">För många försök</p>
                <p className="text-xs">Vänta en stund innan du försöker igen</p>
              </div>
            </div>,
            { duration: 8000 }
          );
          break;

        case 500:
        case 502:
        case 503:
        case 504:
          toast.error(
            <div className="flex items-center gap-2">
              <ServerCrash className="h-4 w-4" />
              <div>
                <p className="font-semibold">Serverfel</p>
                <p className="text-xs">Ett fel uppstod på servern. Försök igen om en stund</p>
              </div>
            </div>,
            {
              duration: 8000,
              action: {
                label: "Försök igen",
                onClick: () => {
                  window.location.reload();
                },
              },
            }
          );
          break;

        default:
          toast.error(
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <div>
                <p className="font-semibold">Ett fel uppstod</p>
                <p className="text-xs">{apiError.message || "Försök igen senare"}</p>
              </div>
            </div>
          );
      }
    } else {
      // Generic error
      toast.error(
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <div>
            <p className="font-semibold">Ett fel uppstod</p>
            <p className="text-xs">{error.message || "Något gick fel. Försök igen"}</p>
          </div>
        </div>
      );
    }

    // Log error for debugging
    console.error("API Error:", error);
  };

  return { handleError };
}

// Helper function to create standardized API errors
export function createApiError(status: number, message: string, details?: any): ApiError {
  return {
    status,
    message,
    details,
  };
}

// Example usage with fetch
export async function fetchWithErrorHandling<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw createApiError(
        response.status,
        error.message || `Request failed with status ${response.status}`,
        error
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      throw createApiError(0, "Nätverksfel - kontrollera din anslutning");
    }
    throw error;
  }
}
