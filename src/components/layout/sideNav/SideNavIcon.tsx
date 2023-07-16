import { IconButton } from '@mui/material';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { IconDirectionType, SideNavStyle } from '@/types/sidenav';
import { useNavResponsive } from '@/hooks/useNavResponsive';

type SideNavIconProps = {
  setNavStyle: Dispatch<SetStateAction<SideNavStyle>>;
};

export const SideNavStrechIcon = ({ setNavStyle }: SideNavIconProps) => {
  const [iconDirection, setIconDirection] =
    useState<IconDirectionType>('right');

  const handleClick = () => {
    const newState: IconDirectionType =
      iconDirection === 'left' ? 'right' : 'left';
    setNavStyle(newState === 'right' ? 'closed' : 'streched');
    setIconDirection(newState);
  };
  useNavResponsive(iconDirection);

  return (
    <IconButton
      sx={{
        background: 'white',
        position: 'absolute',
        top: '10%',
        right: '-20px',
        boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px ',
        zIndex: 10,
        ':active , :focus , :visited , :hover': {
          background: 'white'
        }
      }}
      onClick={handleClick}
    >
      {iconDirection === 'right' ? (
        <KeyboardArrowRightIcon />
      ) : (
        <KeyboardArrowLeftIcon />
      )}
    </IconButton>
  );
};
