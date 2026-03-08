import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-red-50 text-red-900 border-2 border-red-200">
                    <h1 className="text-3xl font-bold mb-4">Something went wrong.</h1>
                    <p className="text-lg mb-4">An unexpected error has occurred in the application.</p>
                    <pre className="bg-white p-4 rounded text-sm text-left w-full max-w-2xl overflow-auto border border-red-300 whitespace-pre-wrap">
                        {this.state.error?.toString()}
                    </pre>
                    <button
                        className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition font-bold"
                        onClick={() => window.location.reload()}
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
