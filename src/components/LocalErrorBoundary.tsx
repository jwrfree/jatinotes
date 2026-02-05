"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  name?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class LocalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`Error in component ${this.props.name || 'Unknown'}:`, error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="my-8 rounded-[2rem] border border-red-100 bg-red-50/50 p-8 text-center dark:border-red-900/20 dark:bg-red-900/10">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h3 className="mb-2 font-bold text-zinc-900 dark:text-zinc-100">
            Gagal memuat {this.props.name || 'bagian ini'}
          </h3>
          <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
            Terjadi kesalahan teknis. Silakan coba segarkan bagian ini.
          </p>
          <button
            onClick={this.handleReset}
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-bold text-zinc-600 shadow-sm border border-zinc-200 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800 transition-all"
          >
            <RefreshCw className="h-3 w-3" />
            Coba Lagi
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
