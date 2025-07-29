import { PlatformEventMenuPage } from '../../_shared/Sidebar/constants';

export const MENU_LIST = [
  // {
  //   key: 'ticket',
  //   name: 'Ticket',
  //   icon: 'tic',
  //   url: '/ticket',
  //   menu: true,
  //   menu_key: PlatformEventMenuPage.TICKET,
  // },
  { key: 'calendar', name: 'Calendar', icon: 'cal', url: '/calendar' },
  {
    key: 'company',
    name: 'Company',
    icon: 'company',
    url: '/companies',
    menu: true,
    menu_key: PlatformEventMenuPage.COMPANIES,
  },
  { key: 'qr', name: 'QR', icon: 'qr', url: '/qr', modal: 'QR_CODE', menu: true },
  {
    key: 'content',
    name: 'Content',
    icon: 'agenda',
    url: '/content',
    menu: true,
    menu_key: PlatformEventMenuPage.CONTENT,
  },
  {
    key: 'attendees',
    name: 'Clients',
    icon: 'attendees',
    url: '/attendees',
    menu: true,
    menu_key: PlatformEventMenuPage.ATTENDEES,
  },
  { key: 'admin', name: 'Admin', icon: 'admin', url: '/admin' },
];
