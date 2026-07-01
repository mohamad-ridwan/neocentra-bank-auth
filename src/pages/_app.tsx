import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import React from 'react';
import dynamic from 'next/dynamic';
import { useRemoteCSS } from '@/hooks/useRemoteCSS';

const MfeProviders = dynamic(() => import('@/components/MfeProviders'), {
  ssr: false,
});

export default function App({ Component, pageProps }: AppProps) {
  const SHARED_MFE_URL =
    process.env.NEXT_PUBLIC_SHARED_URL || 'http://localhost:3342';

  const { loaded, error } = useRemoteCSS(
    SHARED_MFE_URL,
    'shared_remote',
    './Button'
  );

  const showContent = loaded || error;

  return (
    <MfeProviders>
      {showContent ? (
        <Component {...pageProps} />
      ) : (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 font-sans">
          Loading resources...
        </div>
      )}
    </MfeProviders>
  );
}


