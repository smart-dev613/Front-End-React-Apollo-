import ApolloClient from 'apollo-client';
import { UIState } from '../../../store/ui/types';
import { UserState } from '../../../store/user/types';

export interface Props {
  theme?: any;
  ui: UIState;
  user: UserState;
  client: ApolloClient<any>;
}
