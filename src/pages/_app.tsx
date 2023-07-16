import { AppLayout } from '@/components/layout/AppLayout';
import '@/styles/globals.css';
import { theme } from '@/styles/theme';
import { ThemeProvider } from '@mui/material';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <AppLayout>
        <Component {...pageProps} />
      </AppLayout>
    </ThemeProvider>
  );
}
