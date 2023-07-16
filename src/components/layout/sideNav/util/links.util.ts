import { PageLink } from '@/types/sidenav';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import HomeIcon from '@mui/icons-material/Home';
export const navLinks: PageLink[] = [
  {
    label: 'home',
    Icon: HomeIcon,
    path: '/'
  },
  {
    label: 'Questions',
    Icon: QuestionMarkIcon,
    path: '/questions'
  }
];
