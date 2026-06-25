import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import React, { useEffect, useState } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  const [ready, setReady] = useState(false);
  const [Providers, setProviders] = useState<{
    Provider: React.ComponentType<any>;
    store: any;
    QueryClientProvider: React.ComponentType<any>;
    queryClient: any;
  } | null>(null);

  useEffect(() => {
    // Dynamically load remote modules on the client side only
    Promise.all([
      import('react-redux'),
      import('shared_remote/store'),
      import('@tanstack/react-query'),
      import('shared_remote/apiHelper'),
    ]).then(([
      { Provider },
      { store },
      { QueryClientProvider },
      { queryClient },
    ]) => {
      setProviders({
        Provider,
        store,
        QueryClientProvider,
        queryClient,
      });
      setReady(true);
    }).catch(err => {
      console.error("Failed to load MFE providers in auth:", err);
    });
  }, []);

  if (!ready || !Providers) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
          <span className="text-sm font-medium tracking-wide">Initializing Auth MFE...</span>
        </div>
      </div>
    );
  }

  const { Provider, store, QueryClientProvider, queryClient } = Providers;

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </Provider>
  );
}
