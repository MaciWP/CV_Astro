// src/components/ErrorBoundary.jsx
/**
 * Error Boundary component for handling React errors gracefully
 * Prevents the entire UI from crashing when individual components fail
 * File: src/components/ErrorBoundary.jsx
 */
import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render shows the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Store error details for potential logging
        this.setState({ error, errorInfo });

        // Log error to console in development
        console.error('Error caught by ErrorBoundary:', error);
        console.error('Component stack:', errorInfo?.componentStack);

        // Here you could send the error to a logging service
        // if (process.env.NODE_ENV === 'production') {
        //   sendErrorToLoggingService(error, errorInfo);
        // }
    }

    resetErrorBoundary = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
    };

    render() {
        if (this.state.hasError) {
            // Render fallback UI that matches Swiss design aesthetics
            return (
                <div className="border-l-4 border-brand-red bg-light-secondary dark:bg-dark-secondary p-4 my-3 rounded-none shadow-sm">
                    <div className="flex items-start">
                        <div className="flex-shrink-0 mt-0.5">
                            <i className="fas fa-exclamation-circle text-brand-red text-lg"></i>
                        </div>

                        <div className="ml-3 w-full">
                            <h3 className="text-lg font-medium text-light-text dark:text-dark-text">
                                {this.props.fallbackTitle || 'Something went wrong'}
                            </h3>

                            <div className="mt-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
                                <p>{this.props.fallbackMessage || 'There was an error loading this content.'}</p>
                            </div>

                            {this.props.showReset && (
                                <div className="mt-3">
                                    <button
                                        onClick={this.resetErrorBoundary}
                                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-none text-white bg-brand-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-red transition-colors"
                                    >
                                        {this.props.resetButtonText || 'Try again'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        // When there's no error, render children normally
        return this.props.children;
    }
}

export default ErrorBoundary;