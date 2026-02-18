
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RotateCcw, Home, CloudRain } from 'lucide-react';

interface ErrorBoundaryProps {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * Standard Error Boundary component for catching runtime UI crashes.
 * Inherits from React.Component as required by React for error boundaries.
 */
// Fix: Directly import Component and extend it to ensure TypeScript correctly resolves inherited properties like 'state' and 'props'
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  // Fix: Using class property for state initialization to resolve property existence issues in TypeScript
  state: ErrorBoundaryState = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('🏝️ Island System Crash:', error, errorInfo);
  }

  private handleReset = () => {
    window.location.reload();
  };

  private handleReturnHome = () => {
    window.location.href = '/';
  };

  public render() {
    // Fix: Accessing inherited state and props members through 'this'
    const { hasError } = this.state;
    const { fallback, children } = this.props;

    if (hasError) {
      if (fallback) return fallback;

      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#f7f9e4] text-center animate-fadeIn">
          <div className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-8 border-white relative max-w-md w-full">
            
            <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                <div className="bg-[#ff7b72] p-5 rounded-[2.5rem] shadow-lg border-4 border-white animate-bounce-slight">
                    <CloudRain size={48} className="text-white fill-current" />
                </div>
            </div>

            <div className="mt-8 space-y-6">
                <h1 className="text-3xl font-black text-[#4b7d78] tracking-tighter uppercase leading-none">
                    Island Under High Tide!
                </h1>
                <p className="text-slate-500 font-bold leading-relaxed text-sm">
                    A small storm hit this part of the island. Don't worry, your progress is likely safe. Let's try to head back to the docks.
                </p>

                <div className="space-y-3">
                    <button 
                        onClick={this.handleReset}
                        className="w-full bg-[#8bc34a] text-white py-4 rounded-[2rem] font-black text-lg shadow-[0_6px_0_#5a9a3b] border-2 border-white flex items-center justify-center gap-3 bubble-button"
                    >
                        <RotateCcw size={20} /> Rebuild Island
                    </button>
                    <button 
                        onClick={this.handleReturnHome}
                        className="w-full bg-white text-[#8d99ae] py-4 rounded-[2rem] font-black text-sm uppercase tracking-widest border-2 border-slate-100 hover:text-[#4b7d78] transition-all"
                    >
                        <Home size={16} className="inline mr-2" /> Back to Safety
                    </button>
                </div>
            </div>

            <div className="mt-8 pt-6 border-t-2 border-dashed border-slate-100 opacity-20">
                <ShieldAlert size={24} className="mx-auto text-slate-400" />
            </div>
          </div>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
