import { Avatar, Box, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { SideNavStyle } from '@/types/sidenav';
import { FlexCenter } from '../../customStyle/FlexCenter';
import { SideNavStrechIcon } from './SideNavIcon';
import { NavLinks, SideNavLink } from './SideNavLinks';
import { appPallete } from '@/styles/theme';
import { SideNavWidth } from '@/styles/staticStyles';
export const SideNav = () => {
  const [navStyle, setNavStyle] = useState<SideNavStyle>('closed');
  const activePath = '';

  return (
    <nav
      id='side-nav'
      style={{
        position: 'fixed',
        height: '97%',
        left: 10,
        width: SideNavWidth.closed
      }}
    >
      <Box
        sx={{
          padding: 1,
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          minWidth: '100%',
          borderRadius: '20px',
          background: appPallete[500],
          flexDirection: 'column'
        }}
      >
        {/* top part */}
        <SideNavStrechIcon setNavStyle={setNavStyle} />
        <FlexCenter sx={{ flex: 0 }}>
          <Avatar sx={{ bgcolor: 'white' }}>KORTIFO</Avatar>
        </FlexCenter>

        {/* NavBox */}
        <FlexCenter sx={{ flex: 1 }}>
          <NavLinks navStyle={navStyle} />
        </FlexCenter>
        {/* bottom part */}
        <FlexCenter sx={{ flex: 0 }}>
          <Avatar>Medo</Avatar>
        </FlexCenter>
      </Box>
    </nav>
  );
};
