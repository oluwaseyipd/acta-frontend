import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    showDetails: false,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
    });
    window.location.reload();
  };

  private toggleDetails = () => {
    this.setState((prevState) => ({ showDetails: !prevState.showDetails }));
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center bg-background p-6 relative overflow-hidden">
          {/* Glassmorphic background decorative circles */}
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10" />

          {/* Premium Fallback card */}
          <div className="w-full max-w-xl p-8 rounded-2xl border border-border/40 bg-card/60 backdrop-blur-xl shadow-2xl flex flex-col items-center text-center relative">
            <div className="p-4 rounded-full bg-destructive/15 text-destructive border border-destructive/25 mb-6 animate-bounce">
              <AlertTriangle className="h-10 w-10" />
            </div>

            <h1 className="text-2xl font-bold tracking-tight mb-2">Something went wrong</h1>
            <p className="text-muted-foreground text-sm max-w-md mb-8">
              An unexpected error occurred while rendering the page. Don't worry, your tasks are safe. Try reloading the application.
            </p>

            <button
              onClick={this.handleReset}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/95 shadow-md hover:shadow-lg transition-all duration-200 font-medium cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              Reload Application
            </button>

            {/* Error Detail Section */}
            {this.state.error && (
              <div className="w-full mt-8 border-t border-border/30 pt-6">
                <button
                  onClick={this.toggleDetails}
                  className="flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors mx-auto"
                >
                  {this.state.showDetails ? (
                    <>
                      Hide technical details <ChevronUp className="h-3 w-3" />
                    </>
                  ) : (
                    <>
                      Show technical details <ChevronDown className="h-3 w-3" />
                    </>
                  )}
                </button>

                {this.state.showDetails && (
                  <div className="mt-4 text-left p-4 rounded-lg bg-black/40 border border-border/20 text-xs font-mono text-destructive/90 max-h-48 overflow-y-auto scrollbar-thin whitespace-pre-wrap select-text">
                    <p className="font-semibold text-foreground mb-1">
                      Error: {this.state.error.message}
                    </p>
                    {this.state.errorInfo?.componentStack}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
