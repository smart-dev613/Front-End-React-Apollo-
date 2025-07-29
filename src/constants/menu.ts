
export enum PlatformEventMenuPage {
  
  //TICKET = 'TICKET',
  CALENDAR = 'CALENDAR',
  HOME = 'HOME',
  CONTENT = 'CONTENT',
  CONTENT_CUSTOM = 'CONTENT_CUSTOM',
  COMPANIES = 'COMPANIES',
  ATTENDEES = 'ATTENDEES',
  CONTENT_PRICING = 'CONTENT_PRICING',
  ADMIN = 'ADMIN',
  CART = 'CART'
}

export const PAGE_MAPPING: { [key: string]: any[] } = {
  ADMIN: [
    { label: 'cluster', type: PlatformEventMenuPage.ADMIN, adminOnly: true, link: "/cluster-management"},
    { label: 'transactions', type: PlatformEventMenuPage.ADMIN, adminOnly: true, link: "/transaction-history"},
    { label: 'setting', type: PlatformEventMenuPage.ADMIN, adminOnly: true, link: "/settings"},
    { label: 'spaces', type: PlatformEventMenuPage.ADMIN, adminOnly: true, link: "/spaces"},
    { label: 'invitation', type: PlatformEventMenuPage.ADMIN, adminOnly: true, link: "/invited"}
  ],
  REGULAR: [
    //{ label: 'home', type: PlatformEventMenuPage.HOME },
    //{ label: 'cart', type: PlatformEventMenuPage.CART },
    // { label: 'ticket', type: PlatformEventMenuPage.TICKET },
    { label: 'calendar', type: PlatformEventMenuPage.CALENDAR },
    { label: 'content', type: PlatformEventMenuPage.CONTENT },
    { label: 'companies', type: PlatformEventMenuPage.COMPANIES },
    { label: 'attendees', type: PlatformEventMenuPage.ATTENDEES },
    { label: 'pricing', type: PlatformEventMenuPage.CONTENT_PRICING },
    
  ],
  TRADE: [
    //{ label: 'home', type: PlatformEventMenuPage.HOME },
    //{ label: 'cart', type: PlatformEventMenuPage.CART},
    //{ label: 'ticket', type: PlatformEventMenuPage.TICKET },
    { label: 'calendar', type: PlatformEventMenuPage.CALENDAR },
    { label: 'agenda', type: PlatformEventMenuPage.CONTENT },
    { label: 'companies', type: PlatformEventMenuPage.COMPANIES },
    { label: 'attendees', type: PlatformEventMenuPage.ATTENDEES },
    { label: 'pricing', type: PlatformEventMenuPage.CONTENT_PRICING }
  ],
  RESTAURANT: [
    //{ label: 'home', type: PlatformEventMenuPage.HOME },
    //{ label: 'cart', type: PlatformEventMenuPage.CART},
    { label: 'calendar', type: PlatformEventMenuPage.CALENDAR },
    { label: 'services', type: PlatformEventMenuPage.CONTENT },
    { label: 'suppliers', type: PlatformEventMenuPage.COMPANIES, adminOnly: true },
    { label: 'clients', type: PlatformEventMenuPage.ATTENDEES, adminOnly: true },
    { label: 'pricing', type: PlatformEventMenuPage.CONTENT_PRICING }
  ],
  SALON: [
    //{ label: 'home', type: PlatformEventMenuPage.HOME },
    //{ label: 'cart', type: PlatformEventMenuPage.CART},
    // { label: 'ticket', type: PlatformEventMenuPage.TICKET },
    { label: 'calendar', type: PlatformEventMenuPage.CALENDAR },
    { label: 'services', type: PlatformEventMenuPage.CONTENT },
    { label: 'suppliers', type: PlatformEventMenuPage.COMPANIES, adminOnly: true },
    { label: 'clients', type: PlatformEventMenuPage.ATTENDEES, adminOnly: true },
    { label: 'pricing', type: PlatformEventMenuPage.CONTENT_PRICING }
  ],
  MEETINGROOMS: [
    //{ label: 'home', type: PlatformEventMenuPage.HOME },
    //{ label: 'cart', type: PlatformEventMenuPage.CART},
    { label: 'calendar', type: PlatformEventMenuPage.CALENDAR },
    { label: 'content', type: PlatformEventMenuPage.CONTENT },
    { label: 'companies', type: PlatformEventMenuPage.COMPANIES },
    { label: 'attendees', type: PlatformEventMenuPage.ATTENDEES },
    { label: 'pricing', type: PlatformEventMenuPage.CONTENT_PRICING }
  ],
  GATHERING: [
    //{ label: 'home', type: PlatformEventMenuPage.HOME },
    //{ label: 'cart', type: PlatformEventMenuPage.CART},
    // { label: 'ticket', type: PlatformEventMenuPage.TICKET },
    { label: 'calendar', type: PlatformEventMenuPage.CALENDAR },
    { label: 'info', type: PlatformEventMenuPage.CONTENT },
    { label: 'suppliers', type: PlatformEventMenuPage.COMPANIES, adminOnly: true },
    { label: 'guests', type: PlatformEventMenuPage.ATTENDEES },
    { label: 'pricing', type: PlatformEventMenuPage.CONTENT_PRICING }
  ],
  EXHIBITION: [
    //{ label: 'home', type: PlatformEventMenuPage.HOME },
    //{ label: 'cart', type: PlatformEventMenuPage.CART},
    // { label: 'ticket', type: PlatformEventMenuPage.TICKET },
    { label: 'calendar', type: PlatformEventMenuPage.CALENDAR },
    { label: 'info', type: PlatformEventMenuPage.CONTENT },
    { label: 'companies', type: PlatformEventMenuPage.COMPANIES },
    { label: 'attendees', type: PlatformEventMenuPage.ATTENDEES },
    { label: 'pricing', type: PlatformEventMenuPage.CONTENT_PRICING }
  ],
  BIRTHDAY: [
    //{ label: 'home', type: PlatformEventMenuPage.HOME },
    //{ label: 'cart', type: PlatformEventMenuPage.CART},
    // { label: 'ticket', type: PlatformEventMenuPage.TICKET },
    { label: 'calendar', type: PlatformEventMenuPage.CALENDAR },
    { label: 'info', type: PlatformEventMenuPage.CONTENT },
    { label: 'suppliers', type: PlatformEventMenuPage.COMPANIES, adminOnly: true },
    { label: 'guest', type: PlatformEventMenuPage.ATTENDEES },
    { label: 'pricing', type: PlatformEventMenuPage.CONTENT_PRICING }
  ],
  MECHANIC: [
    //{ label: 'home', type: PlatformEventMenuPage.HOME },
    //{ label: 'cart', type: PlatformEventMenuPage.CART},
    { label: 'calendar', type: PlatformEventMenuPage.CALENDAR },
    { label: 'services', type: PlatformEventMenuPage.CONTENT },
    { label: 'suppliers', type: PlatformEventMenuPage.COMPANIES, adminOnly: true },
    { label: 'clients', type: PlatformEventMenuPage.ATTENDEES, adminOnly: true },
    { label: 'pricing', type: PlatformEventMenuPage.CONTENT_PRICING }
  ],
  PHOTOGRAPHY: [
    //{ label: 'home', type: PlatformEventMenuPage.HOME },
    //{ label: 'cart', type: PlatformEventMenuPage.CART},
    { label: 'calendar', type: PlatformEventMenuPage.CALENDAR },
    { label: 'services', type: PlatformEventMenuPage.CONTENT },
    { label: 'suppliers', type: PlatformEventMenuPage.COMPANIES, adminOnly: true },
    { label: 'clients', type: PlatformEventMenuPage.ATTENDEES, adminOnly: true },
    { label: 'pricing', type: PlatformEventMenuPage.CONTENT_PRICING }
  ],
  CINEMA: [
    //{ label: 'home', type: PlatformEventMenuPage.HOME },
    //{ label: 'cart', type: PlatformEventMenuPage.CART},
    { label: 'calendar', type: PlatformEventMenuPage.CALENDAR },
    { label: 'movies', type: PlatformEventMenuPage.CONTENT },
    { label: 'suppliers', type: PlatformEventMenuPage.COMPANIES, adminOnly: true },
    { label: 'members', type: PlatformEventMenuPage.ATTENDEES, adminOnly: true },
    { label: 'pricing', type: PlatformEventMenuPage.CONTENT_PRICING }
  ],
  MUSEUM: [
    //{ label: 'home', type: PlatformEventMenuPage.HOME },
    //{ label: 'cart', type: PlatformEventMenuPage.CART},
    { label: 'calendar', type: PlatformEventMenuPage.CALENDAR },
    { label: 'info', type: PlatformEventMenuPage.CONTENT },
    { label: 'suppliers', type: PlatformEventMenuPage.COMPANIES, adminOnly: true },
    { label: 'members', type: PlatformEventMenuPage.ATTENDEES, adminOnly: true },
    { label: 'pricing', type: PlatformEventMenuPage.CONTENT_PRICING }
  ],
  CONFERENCES: [
    //{ label: 'home', type: PlatformEventMenuPage.HOME },
    //{ label: 'cart', type: PlatformEventMenuPage.CART},
    { label: 'calendar', type: PlatformEventMenuPage.CALENDAR },
    { label: 'info', type: PlatformEventMenuPage.CONTENT },
    { label: 'companies', type: PlatformEventMenuPage.COMPANIES },
    { label: 'attendees', type: PlatformEventMenuPage.ATTENDEES },
    { label: 'pricing', type: PlatformEventMenuPage.CONTENT_PRICING }
  ],
  WEDDINGS: [
    //{ label: 'home', type: PlatformEventMenuPage.HOME },
    //{ label: 'cart', type: PlatformEventMenuPage.CART},
    // { label: 'ticket', type: PlatformEventMenuPage.TICKET },
    { label: 'calendar', type: PlatformEventMenuPage.CALENDAR },
    { label: 'info', type: PlatformEventMenuPage.CONTENT },
    { label: 'suppliers', type: PlatformEventMenuPage.COMPANIES, adminOnly: true },
    { label: 'guests', type: PlatformEventMenuPage.ATTENDEES },
    { label: 'pricing', type: PlatformEventMenuPage.CONTENT_PRICING }
  ],
  TENNIS: [
    //{ label: 'home', type: PlatformEventMenuPage.HOME },
    //{ label: 'cart', type: PlatformEventMenuPage.CART},
    { label: 'calendar', type: PlatformEventMenuPage.CALENDAR },
    { label: 'info', type: PlatformEventMenuPage.CONTENT },
    { label: 'suppliers', type: PlatformEventMenuPage.COMPANIES, adminOnly: true },
    { label: 'members', type: PlatformEventMenuPage.ATTENDEES, adminOnly: true },
    { label: 'pricing', type: PlatformEventMenuPage.CONTENT_PRICING }
  ],
  BASKETBALL: [
    //{ label: 'home', type: PlatformEventMenuPage.HOME },
    //{ label: 'cart', type: PlatformEventMenuPage.CART},
    { label: 'calendar', type: PlatformEventMenuPage.CALENDAR },
    { label: 'info', type: PlatformEventMenuPage.CONTENT },
    { label: 'suppliers', type: PlatformEventMenuPage.COMPANIES, adminOnly: true },
    { label: 'members', type: PlatformEventMenuPage.ATTENDEES, adminOnly: true },
    { label: 'pricing', type: PlatformEventMenuPage.CONTENT_PRICING }
  ],
  FOOTBALL: [
    //{ label: 'home', type: PlatformEventMenuPage.HOME },
    //{ label: 'cart', type: PlatformEventMenuPage.CART},
    { label: 'calendar', type: PlatformEventMenuPage.CALENDAR },
    { label: 'info', type: PlatformEventMenuPage.CONTENT },
    { label: 'suppliers', type: PlatformEventMenuPage.COMPANIES, adminOnly: true },
    { label: 'members', type: PlatformEventMenuPage.ATTENDEES, adminOnly: true },
    { label: 'pricing', type: PlatformEventMenuPage.CONTENT_PRICING }
  ],
  SQUASH: [
    //{ label: 'home', type: PlatformEventMenuPage.HOME },
    //{ label: 'cart', type: PlatformEventMenuPage.CART},
    { label: 'calendar', type: PlatformEventMenuPage.CALENDAR },
    { label: 'info', type: PlatformEventMenuPage.CONTENT },
    { label: 'suppliers', type: PlatformEventMenuPage.COMPANIES, adminOnly: true },
    { label: 'members', type: PlatformEventMenuPage.ATTENDEES, adminOnly: true },
    { label: 'pricing', type: PlatformEventMenuPage.CONTENT_PRICING }
  ],
  GARAGE: [
    //{ label: 'home', type: PlatformEventMenuPage.HOME },
    //{ label: 'cart', type: PlatformEventMenuPage.CART},
    { label: 'calendar', type: PlatformEventMenuPage.CALENDAR },
    { label: 'info', type: PlatformEventMenuPage.CONTENT },
    { label: 'suppliers', type: PlatformEventMenuPage.COMPANIES, adminOnly: true },
    { label: 'clients', type: PlatformEventMenuPage.ATTENDEES, adminOnly: true },
    { label: 'pricing', type: PlatformEventMenuPage.CONTENT_PRICING }
  ],
  RUGBY: [
    //{ label: 'home', type: PlatformEventMenuPage.HOME },
    //{ label: 'cart', type: PlatformEventMenuPage.CART},
    { label: 'calendar', type: PlatformEventMenuPage.CALENDAR },
    { label: 'info', type: PlatformEventMenuPage.CONTENT },
    { label: 'suppliers', type: PlatformEventMenuPage.COMPANIES, adminOnly: true },
    { label: 'members', type: PlatformEventMenuPage.ATTENDEES, adminOnly: true },
    { label: 'pricing', type: PlatformEventMenuPage.CONTENT_PRICING }
  ],
  AFL: [
    //{ label: 'home', type: PlatformEventMenuPage.HOME },
    //{ label: 'cart', type: PlatformEventMenuPage.CART},
    { label: 'calendar', type: PlatformEventMenuPage.CALENDAR },
    { label: 'info', type: PlatformEventMenuPage.CONTENT },
    { label: 'suppliers', type: PlatformEventMenuPage.COMPANIES, adminOnly: true },
    { label: 'members', type: PlatformEventMenuPage.ATTENDEES, adminOnly: true },
    { label: 'pricing', type: PlatformEventMenuPage.CONTENT_PRICING }
  ],
  SPORT: [
    //{ label: 'home', type: PlatformEventMenuPage.HOME },
    //{ label: 'cart', type: PlatformEventMenuPage.CART},
    { label: 'calendar', type: PlatformEventMenuPage.CALENDAR },
    { label: 'info', type: PlatformEventMenuPage.CONTENT },
    { label: 'suppliers', type: PlatformEventMenuPage.COMPANIES, adminOnly: true },
    { label: 'members', type: PlatformEventMenuPage.ATTENDEES, adminOnly: true },
    { label: 'pricing', type: PlatformEventMenuPage.CONTENT_PRICING }
  ],
  NFL: [
    //{ label: 'home', type: PlatformEventMenuPage.HOME },
    //{ label: 'cart', type: PlatformEventMenuPage.CART},
    { label: 'calendar', type: PlatformEventMenuPage.CALENDAR },
    { label: 'info', type: PlatformEventMenuPage.CONTENT },
    { label: 'suppliers', type: PlatformEventMenuPage.COMPANIES, adminOnly: true },
    { label: 'members', type: PlatformEventMenuPage.ATTENDEES, adminOnly: true },
    { label: 'pricing', type: PlatformEventMenuPage.CONTENT_PRICING }
  ],
  SURGERY: [
    //{ label: 'home', type: PlatformEventMenuPage.HOME },
    //{ label: 'cart', type: PlatformEventMenuPage.CART},
    { label: 'calendar', type: PlatformEventMenuPage.CALENDAR },
    { label: 'info', type: PlatformEventMenuPage.CONTENT },
    { label: 'suppliers', type: PlatformEventMenuPage.COMPANIES, adminOnly: true },
    { label: 'clients', type: PlatformEventMenuPage.ATTENDEES, adminOnly: true },
    { label: 'pricing', type: PlatformEventMenuPage.CONTENT_PRICING }
  ],
  DENTIST: [
    //{ label: 'home', type: PlatformEventMenuPage.HOME },
    //{ label: 'cart', type: PlatformEventMenuPage.CART},
    { label: 'calendar', type: PlatformEventMenuPage.CALENDAR },
    { label: 'info', type: PlatformEventMenuPage.CONTENT },
    { label: 'suppliers', type: PlatformEventMenuPage.COMPANIES, adminOnly: true },
    { label: 'clients', type: PlatformEventMenuPage.ATTENDEES, adminOnly: true },
    { label: 'pricing', type: PlatformEventMenuPage.CONTENT_PRICING }
  ],
}
