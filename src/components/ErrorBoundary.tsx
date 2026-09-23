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
        <div className="border border-[#ff2a5f]/40 bg-[#0c0e14] p-8 rounded-sm my-6 font-mono text-xs max-w-xl mx-auto shadow-2xl">
          <div className="flex items-center space-x-2 text-[#ff2a5f] mb-3">
            <span className="text-base font-bold">⚠</span>
            <span className="font-syne font-bold text-sm tracking-wide">VIEW RENDERING EXCEPTION</span>
          </div>
          <p className="text-[#94a3b8] leading-relaxed mb-4">
            An error occurred while rendering this section: <code className="text-[#ff2a5f]">{this.state.error?.message}</code>
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="px-4 py-2 rounded-sm bg-gradient-to-r from-[#00f0ff] to-[#38bdf8] text-[#040507] font-syne font-bold hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all"
          >
            Reload Cockpit
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
