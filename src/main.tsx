
// Importar React primeiro para garantir sua inicialização
import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { initializePdfUtils } from './services/pdf/utils';

// Certifique-se de que o React esteja completamente inicializado
// e inicialize os utilitários PDF antes de importar o App
initializePdfUtils();

// Agora importe o App que pode conter componentes React-PDF
import App from './App.tsx';
import './index.css';

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
