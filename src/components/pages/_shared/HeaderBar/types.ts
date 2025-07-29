import ApolloClient from 'apollo-client';

import { UIState } from '../../../../store/ui/types';
import { ShowModal } from '../../../../store/modal/types';
import { UserState } from '../../../../store/user/types';

export interface DispatchProps {
  showModal: ShowModal;
  ui: UIState;
  user: UserState;
  carts: UserState['carts'];
  userData: UserState['userData'];
  fetchCarts: any;
  setSearchBarShow: (showSearch: boolean) => void;
  setSearchBarHide: (showSearch: boolean) => void;
  setNotificationFetchingLoading: (loading: boolean) => void;
  setLoadingOverlay: (loading: boolean) => void;
  updateUserData: (userData: object) => void;
}

export interface StateProps {
  notifications: string[]
  ProfileAvatar: string
  firstName: string
  lastName: string
  // history: History
  client: ApolloClient<any>
  userData: object;
}

export type Props = StateProps & DispatchProps

export interface CompanyInformation {
  address: object;
  _id: string | number;
  name: string;
  email: string;
}


export interface CurrentCompany {
  company: CompanyInformation;
  id: string;
  role: string;
}

export interface State {
  notificationsOpen: boolean
  searchShow: boolean
  theme: {
    secondaryColour?: string
    logoURL?: string
  }
  slug: string,
  notificationArray: any[]
}
