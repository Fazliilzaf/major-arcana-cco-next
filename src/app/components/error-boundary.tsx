import React, { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "./ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({ error, errorInfo });
    
    // Log to error tracking service (e.g., Sentry)
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex h-screen items-center justify-center bg-gray-50 p-6">
          <div className="w-full max-w-md text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </div>

            <h1 className="mb-2 text-2xl font-bold text-gray-900">
              Något gick fel
            </h1>
            
            <p className="mb-6 text-sm text-gray-600">
              Vi ber om ursäkt för besväret. Ett oväntat fel har inträffat.
            </p>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-left">
                <p className="mb-2 text-xs font-semibold text-red-900">
                  Fel (endast i utvecklingsläge):
                </p>
                <pre className="overflow-auto text-xs text-red-800">
                  {this.state.error.toString()}
                </pre>
                {this.state.errorInfo && (
                  <pre className="mt-2 overflow-auto text-xs text-red-800">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Button
                onClick={this.handleReset}
                className="flex items-center justify-center gap-2 rounded-lg bg-pink-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-pink-800"
              >
                <RefreshCw className="h-4 w-4" />
                Försök igen
              </Button>
              
              <Button
                onClick={this.handleReload}
                variant="outline"
                className="flex items-center justify-center gap-2 rounded-lg border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                <Home className="h-4 w-4" />
                Ladda om sidan
              </Button>
            </div>

            <p className="mt-6 text-xs text-gray-500">
              Om problemet kvarstår, kontakta support på{" "}
              <a href="mailto:support@hairtpclinic.se" className="text-pink-600 hover:underline">
                support@hairtpclinic.se
              </a>
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Lightweight error boundary for smaller components
export function ErrorFallback({ error, resetError }: { error: Error; resetError: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 p-6">
      <AlertTriangle className="mb-3 h-8 w-8 text-red-600" />
      <h3 className="mb-2 text-sm font-semibold text-gray-900">
        Kunde inte ladda komponenten
      </h3>
      <p className="mb-4 text-xs text-gray-600">{error.message}</p>
      <Button
        onClick={resetError}
        size="sm"
        className="flex items-center gap-1.5 text-xs"
      >
        <RefreshCw className="h-3 w-3" />
        Försök igen
      </Button>
    </div>
  );
}
