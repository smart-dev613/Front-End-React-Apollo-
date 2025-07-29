import ApolloClient from 'apollo-client'

import { UIState } from '../../../../store/ui/types';
import { UserState } from '../../../../store/user/types';
import { ShowModal } from '../../../../store/modal/types';

export interface Props {
  ui: UIState;
  user: UserState;
  userData: UserState['userData'];
  setCurrentPage: any;
  showModal: ShowModal;
  client: ApolloClient<any>;
}
