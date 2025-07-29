import { faBuilding, faClipboardList, faUser, faUsers, faTicketAlt } from "@fortawesome/free-solid-svg-icons"

export enum PlatformEventMenuPage {
  HOME = 'HOME',
  TICKET = 'TICKET',
  CALENDAR = 'CALENDAR',
  CONTENT = 'CONTENT',
  CONTENT_CUSTOM = 'CONTENT_CUSTOM',
  COMPANIES = 'COMPANIES',
  ATTENDEES = 'ATTENDEES',
  CONTENT_PRICING = 'CONTENT_PRICING',
  ADMIN = 'ADMIN',
  //CLUSTER = 'CLUSTER'
}

export const DEFAULT_MENUS_ORDER = [
  PlatformEventMenuPage.HOME,
  PlatformEventMenuPage.TICKET,
  PlatformEventMenuPage.CALENDAR,
  PlatformEventMenuPage.COMPANIES,
  PlatformEventMenuPage.CONTENT,
  PlatformEventMenuPage.ATTENDEES,
  PlatformEventMenuPage.CONTENT_PRICING,
  // PlatformEventMenuPage.CLUSTER,
]

export const MENUS_DATA = {
  [PlatformEventMenuPage.HOME]: { icon: 'home', link: '/' },
  [PlatformEventMenuPage.CALENDAR]: { icon: 'calendar', link: '/calendar' },
  [PlatformEventMenuPage.CONTENT]: { icon: faClipboardList, link: '/content' },
  [PlatformEventMenuPage.CONTENT_CUSTOM]: { icon: 'users', link: '/content' },
  [PlatformEventMenuPage.COMPANIES]: { icon: faBuilding, link: '/companies' },
  [PlatformEventMenuPage.TICKET]: { icon: faTicketAlt, link: '/ticket' },
  [PlatformEventMenuPage.ATTENDEES]: { icon: faUsers, link: '/attendees' },
  [PlatformEventMenuPage.CONTENT_PRICING]: { icon: 'search', link: '/revenue-management' },
  
  // [PlatformEventMenuPage.CLUSTER]: { icon: 'search', link: '/cluster-management' },
}
