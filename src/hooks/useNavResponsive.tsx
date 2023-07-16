import { SideNavWidth } from '@/styles/staticStyles';
import { IconDirectionType } from '@/types/sidenav';
import { useCallback, useEffect, useRef, useState } from 'react';

export function useNavResponsive(style: IconDirectionType) {
  const [initRender, setInitRender] = useState(true);
  const updateNavStyle = useCallback((dirction: IconDirectionType) => {
    const sideNav = document.querySelector('#side-nav') as HTMLElement;
    sideNav.style.width =
      dirction === 'right' ? SideNavWidth.closed : SideNavWidth.stretch;
  }, []);

  const updateMainStyle = useCallback((dirction: IconDirectionType) => {
    const mainElment = document.querySelector('main#main') as HTMLElement;
    mainElment.className = dirction === 'right' ? 'closed' : 'strech';
  }, []);

  useEffect(() => {
    if (initRender) return;
    updateMainStyle(style);
    updateNavStyle(style);
  }, [style]);
  useEffect(() => {
    setInitRender(false);
  }, []);
}
