import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import { ConfigError } from './config';
import { createQueryClient } from './queryClient';
import './styles/global.css';

const root = createRoot(document.getElementById('root')!);

try {
  const queryClient = createQueryClient();
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </StrictMode>,
  );
} catch (error) {
  // `config.ts` throws at import time if VITE_WP_API_URL is missing/invalid.
  const message = error instanceof ConfigError ? error.message : 'Error de configuración.';
  root.render(
    <main className="container" style={{ padding: '4rem 0' }}>
      <h1>Configuración incompleta</h1>
      <p>{message}</p>
    </main>,
  );
}
