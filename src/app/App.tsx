import { useState } from "react";
import { RouterProvider } from "react-router";
import { LanguageProvider } from "./context/language-context";
import { MailboxProvider } from "./context/mailbox-context";
import { ThemeProvider } from "./context/theme-context";
import { DensityProvider } from "./context/density-context";
import { ErrorBoundary } from "./components/error-boundary";
import { useNetworkStatus } from "./hooks/use-network-status";
import { InstallPrompt } from "./components/install-prompt";
import { AppSplashScreen } from "./components/app-splash-screen";
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
  // Splash-skärmen rendereras ovanpå appen vid första laddningen
  // och tas bort ur DOM:en när fade-out är klar.
  const [splashDone, setSplashDone] = useState(false);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <DensityProvider>
          <LanguageProvider>
            <MailboxProvider>
              <NetworkMonitor />
              <AppContent />
              <Toaster position="top-right" richColors />
              {!splashDone && (
                <AppSplashScreen onFinish={() => setSplashDone(true)} />
              )}
            </MailboxProvider>
          </LanguageProvider>
        </DensityProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
