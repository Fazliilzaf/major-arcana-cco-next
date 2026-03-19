import { RouterProvider } from "react-router";
import { LanguageProvider } from "./context/language-context";
import { MailboxProvider } from "./context/mailbox-context";
import { ThemeProvider } from "./context/theme-context";
import { DensityProvider } from "./context/density-context";
import { ErrorBoundary } from "./components/error-boundary";
import { useNetworkStatus } from "./hooks/use-network-status";
import { InstallPrompt } from "./components/install-prompt";
import { Toaster } from "sonner";
import { router } from "./routes";

function NetworkMonitor() {
  useNetworkStatus();
  return null;
}

function AppContent() {
  return (
    <>
      <RouterProvider router={router} />
      <InstallPrompt />
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <DensityProvider>
          <LanguageProvider>
            <MailboxProvider>
              <NetworkMonitor />
              <AppContent />
              <Toaster position="top-right" richColors />
            </MailboxProvider>
          </LanguageProvider>
        </DensityProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}