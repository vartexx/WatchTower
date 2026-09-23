import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallbackView?: ReactNode;
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
    console.error('Uncaught error in component:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallbackView) {
        return this.props.fallbackView;
      }
      return (
        <div className="border border-[#ff746d]/40 bg-[#161a22] p-8 rounded-sm my-6 font-mono text-xs max-w-xl mx-auto shadow-2xl">
          <div className="flex items-center space-x-2 text-[#ff746d] mb-3">
            <span className="text-base font-bold">⚠</span>
            <span className="font-syne font-bold text-sm tracking-wide">VIEW RENDERING EXCEPTION</span>
          </div>
          <p className="text-[#7f939d] leading-relaxed mb-4">
            An error occurred while rendering this section: <code className="text-[#ff746d]">{this.state.error?.message}</code>
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="px-4 py-2 rounded-sm bg-[#6be1d6] text-[#0b161d] font-syne font-semibold hover:bg-[#5cd4c9] transition-all"
          >
            Reload Cockpit
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
