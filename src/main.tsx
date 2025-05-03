
import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initializePdfUtils } from './services/pdf/utils';

// Initialize PDF utilities before importing components that might use them
initializePdfUtils();

// Now import the application components
import App from './App';
import './index.css';

// Create the query client after React is loaded
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
    },
  },
});

// Render the application
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
