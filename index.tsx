import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("React Error Boundary Caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', color: '#b91c1c', backgroundColor: '#fef2f2', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Oops! The Island had a tremor.</h1>
          <p style={{ marginBottom: '1rem' }}>Something went wrong while rendering.</p>
          <pre style={{ backgroundColor: '#fff', padding: '1rem', border: '2px solid #e0d9b4', borderRadius: '1rem', overflow: 'auto', maxWidth: '100%' }}>
            {this.state.error?.toString()}
          </pre>
          <button onClick={() => window.location.reload()} style={{ marginTop: '2rem', padding: '1rem 2rem', background: '#8bc34a', color: 'white', borderRadius: '1rem', fontWeight: 'bold' }}>
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);