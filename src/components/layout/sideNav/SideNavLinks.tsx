import { FlexCenter } from '@/components/customStyle/FlexCenter';
import { PageLink, SideNavStyle } from '@/types/sidenav';
import { Box, Button, IconButton } from '@mui/material';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { navLinks } from './util/links.util';
import { appPallete } from '@/styles/theme';

type Props = {
  navStyle: SideNavStyle;
};

export const NavLinks = ({ navStyle }: Props) => {
  const links = useMemo(() => navLinks, []);
  const { pathname } = useRouter();

  const isActivePath = (myNavPath: string) => {
    const NotHomePage = myNavPath === '/' && pathname.length > 2;
    if (NotHomePage) return false;
    return pathname.includes(myNavPath);
  };
  return (
    <FlexCenter sx={{ flexDirection: 'column', gap: '10px' }}>
      {links.map((Link) => (
        <SideNavLink
          key={Link.path}
          link={Link}
          navStyle={navStyle}
          isActive={isActivePath(Link.path)}
        />
      ))}
    </FlexCenter>
  );
};

type SideNavProps = {
  isActive: boolean;
  navStyle: SideNavStyle;
  link: PageLink;
};
export const SideNavLink = ({ isActive, navStyle, link }: SideNavProps) => {
  const { push } = useRouter();

  const hadnleClick = () => push(link.path);
  return (
    <FlexCenter sx={{ width: '100%', height: '35px' }}>
      {navStyle === 'closed' && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {isActive && (
            <Box
              sx={{
                position: 'absolute',
                left: '0'
              }}
              height={'35px'}
              width={'7px'}
              bgcolor={'white'}
            ></Box>
          )}
          <IconButton onClick={hadnleClick}>
            <link.Icon sx={{ color: 'white' }} />
          </IconButton>
        </Box>
      )}

      {navStyle === 'streched' && (
        <Button
          fullWidth
          variant='text'
          onClick={hadnleClick}
          sx={{
            background: 'white',
            ':focus,:active': { backgroundColor: 'white' }
          }}
          startIcon={<link.Icon sx={{ color: appPallete[500] }} />}
        >
          {link.label}
        </Button>
      )}
    </FlexCenter>
  );
};
