import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { PollarProvider } from '@pollar/react';
import '@pollar/react/styles.css';
import App from './App.tsx';
import './index.css';

const pollarClientConfig = {
  apiKey:
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_POLLAR_PUBLISHABLE_KEY),
  stellarNetwork: 'testnet' as const,
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PollarProvider client={pollarClientConfig}>
      <App />
    </PollarProvider>
  </StrictMode>,
);
