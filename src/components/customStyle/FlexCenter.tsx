import { Box, SxProps } from '@mui/material';
import { ReactNode } from 'react';

export function FlexCenter({
  children,
  sx
}: {
  children: ReactNode;
  sx?: SxProps;
}) {
  return (
    <Box display='flex' sx={sx} justifyContent='center' alignItems='center'>
      {children}
    </Box>
  );
}
