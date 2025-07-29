import ApolloClient from 'apollo-client'

import { UIState } from '../../../../store/ui/types';
import { UserState } from '../../../../store/user/types';

export interface Props {
  ui: UIState;
  user: UserState;
  closeCurrentModal: any;
  data: any;
  client: any;
}
