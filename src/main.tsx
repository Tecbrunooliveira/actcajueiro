import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initializePdfUtils } from './services/pdf/utils';
import './index.css';
import App from './App';

// Initialize PDF utilities before importing components that might use them
initializePdfUtils();

// Create the query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
    },
  },
});

// Make sure the DOM is ready before rendering
document.addEventListener('DOMContentLoaded', () => {
  // Render the application
  const rootElement = document.getElementById('root');
  if (rootElement) {
    createRoot(rootElement).render(
      <React.StrictMode>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </React.StrictMode>
    );
  } else {
    console.error('Root element not found!');
  }

  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js');
    });
  }
});
