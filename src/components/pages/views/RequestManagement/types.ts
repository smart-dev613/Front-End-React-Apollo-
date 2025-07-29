import ApolloClient from 'apollo-client'

import { UIState } from '../../../../store/ui/types';
import { UserState } from '../../../../store/user/types';

export interface Props {
  ui: UIState;
  user: UserState;
  userData: UserState['userData'];
  setCurrentPage: any;
  showModal: any;
  client: ApolloClient<any>;
}
