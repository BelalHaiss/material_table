import { Components } from '@mui/material';

export type SideNavStyle = 'closed' | 'streched';

export type IconDirectionType = 'right' | 'left';
import { OverridableComponent } from '@mui/material/OverridableComponent';
export type PageLink = {
  path: string;
  label: string;
  Icon: OverridableComponent;
};
