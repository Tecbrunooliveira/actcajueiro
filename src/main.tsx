
import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initializePdfUtils } from './services/pdf/utils';

// Initialize PDF utilities before importing components that might use them
initializePdfUtils();

// Import the application components
import App from './App';
import './index.css';

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
});
