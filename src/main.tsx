
import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient } from '@tanstack/react-query';

// Certifique-se de que o React esteja completamente inicializado antes de importar o App
// que pode conter componentes como React-PDF que dependem dele
import App from './App.tsx';
import './index.css';
import { QueryClientProvider } from '@tanstack/react-query';

// Inicialize o cliente de consulta após as importações do React
const queryClient = new QueryClient();

// Renderize a aplicação
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
