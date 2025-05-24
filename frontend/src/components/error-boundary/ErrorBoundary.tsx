import React, { ErrorInfo } from "react";
import { useNavigation, useResource, useNotification } from "@refinedev/core";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback
          error={this.state.error}
          resetErrorBoundary={this.resetErrorBoundary}
        />
      );
    }

    return this.props.children;
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null });
  };
}

interface ErrorFallbackProps {
  error: Error | null;
  resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  const { list } = useNavigation();
  const { open } = useNotification();

  React.useEffect(() => {
    open?.({
      type: "error",
      message: error?.message || "An unexpected error occurred",
      key: "error-boundary",
    });
  }, [error, open]);

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="w-full max-w-md p-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Something went wrong</AlertTitle>
          <AlertDescription className="mt-2">
            {error?.message || "An unexpected error occurred"}
          </AlertDescription>
        </Alert>

        <div className="mt-6 flex gap-4">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={resetErrorBoundary}
          >
            <RefreshCw className="h-4 w-4" />
            Try again
          </Button>
          <Button
            variant="default"
            className="flex items-center gap-2"
            onClick={() => {
              resetErrorBoundary();
              list("dashboard");
            }}
          >
            <Home className="h-4 w-4" />
            Go to dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

// Helper component to use as a wrapper
export const ErrorBoundaryContext: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <ErrorBoundary>{children}</ErrorBoundary>;
};
