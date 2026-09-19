import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { PollarProvider } from '@pollar/react';
import App from './App.tsx';
import './index.css';

const pollarClientConfig = {
  apiKey:
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_POLLAR_PUBLISHABLE_KEY) ||
    'pk_live_funda_institutional_0921',
  stellarNetwork: 'testnet' as const,
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PollarProvider client={pollarClientConfig}>
      <App />
    </PollarProvider>
  </StrictMode>,
);
