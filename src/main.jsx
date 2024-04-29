import ReactDOM from 'react-dom/client';
import { App } from './App';

import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'https://2f2063e70a4230b850066096731ea1e4@o80000.ingest.sentry.io/4506358752870400',
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: ['*'],
    }),
    new Sentry.Replay(),
  ],
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
