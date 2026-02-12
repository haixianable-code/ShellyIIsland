
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n'; // Initialize i18n

// 🏝️ Environment Bridge: Ensure process.env.API_KEY is accessible in the browser
// This maps Vite's VITE_ prefixed variables or injected environment variables 
// to the standard process.env object expected by the AI service.
if (typeof window !== 'undefined') {
  (window as any).process = (window as any).process || { env: {} };
  const env = (import.meta as any).env || {};
  // Prioritize API_KEY from process.env, but fallback to VITE_ version if available
  (window as any).process.env.API_KEY = (window as any).process.env.API_KEY || env.VITE_API_KEY;
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
