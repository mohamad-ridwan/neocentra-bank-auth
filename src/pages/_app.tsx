import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import React from 'react';
import dynamic from 'next/dynamic';

const MfeProviders = dynamic(() => import('@/components/MfeProviders'), {
  ssr: false,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MfeProviders>
      <Component {...pageProps} />
    </MfeProviders>
  );
}

