import { Box } from '@mui/material';
import Head from 'next/head';
import { ReactNode } from 'react';
import { SideNav } from './sideNav/SideNav';

export const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <Head>
        <title>Kortifo</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Box
        sx={{
          display: 'flex',

          justifyContent: 'center',
          minWidth: '100%',
          minHeight: '100%'
        }}
      >
        <SideNav />
        <main id='main' className='closed'>
          {children}
        </main>
      </Box>
    </>
  );
};
