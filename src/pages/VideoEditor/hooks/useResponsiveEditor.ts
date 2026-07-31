import { useEffect } from 'react';
import { useUiStore } from '../store';

/** Sync docked panels vs mobile sheets when viewport crosses breakpoints. */
export function useResponsiveEditor() {
  useEffect(() => {
    const phoneMq = window.matchMedia('(max-width: 767px)');
    const desktopPropsMq = window.matchMedia('(min-width: 1024px)');

    const sync = () => {
      const phone = phoneMq.matches;
      const desktopProps = desktopPropsMq.matches;

      if (phone) {
        useUiStore.setState({
          mediaPanelOpen: false,
          propertiesOpen: false,
          mobileModulesOpen: false,
          timelineExpanded: true,
        });
        return;
      }

      useUiStore.setState({
        mediaPanelOpen: true,
        propertiesOpen: desktopProps,
        mobileModulesOpen: false,
      });
    };

    sync();
    phoneMq.addEventListener('change', sync);
    desktopPropsMq.addEventListener('change', sync);
    return () => {
      phoneMq.removeEventListener('change', sync);
      desktopPropsMq.removeEventListener('change', sync);
    };
  }, []);
}
