import { Component, ErrorInfo, ReactNode } from "react";
import { Alert, Button } from "antd";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Onverwachte fout:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Alert
          message="Fout"
          description={
            <div>
              <p>Er is iets misgegaan. Probeer het opnieuw.</p>
              <p>{this.state.error?.message}</p>
              <Button
                type="primary"
                onClick={() => window.location.reload()}
                style={{ marginTop: 16 }}
              >
                Pagina Vernieuwen
              </Button>
            </div>
          }
          type="error"
          showIcon
        />
      );
    }

    return this.props.children;
  }
}
