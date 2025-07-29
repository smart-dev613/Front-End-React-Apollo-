import ApolloClient from 'apollo-client';

import { UIState } from '../../../../store/ui/types';
import { PlatformEventMenuPage } from './constants';

export interface State {
  theme: {
    primaryColour?: string;
    secondaryColour?: string;
  };
  slug: string;
  menus?: any[];
  menusOrder?: PlatformEventMenuPage[];
}

export interface Props {
  isLoggedIn?: boolean;
  ui: UIState;
  user: any;
  currentPage?: string;
  client: ApolloClient<any>;
  menuDataItem: String;
}
