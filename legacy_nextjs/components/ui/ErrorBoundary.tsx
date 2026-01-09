'use client';

import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

/**
 * Reusable Error Boundary component
 * Catches JavaScript errors anywhere in the child component tree
 */
export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('[ErrorBoundary] Caught error:', error);
        console.error('[ErrorBoundary] Component stack:', errorInfo.componentStack);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-center">
                    <p className="text-red-600 font-medium text-sm">發生錯誤</p>
                    <p className="text-red-400 text-xs mt-1">
                        {this.state.error?.message || '未知錯誤'}
                    </p>
                    <button
                        onClick={() => this.setState({ hasError: false, error: null })}
                        className="mt-3 px-4 py-1.5 bg-red-100 hover:bg-red-200 text-red-600 text-xs rounded-lg transition-colors"
                    >
                        重試
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
