import { UIState } from '../../../../store/ui/types';
import { UserState } from '../../../../store/user/types';

export interface DispatchProps {
  ui: UIState;
  user: UserState;
  userData: UserState['userData'];
  setCurrentPage: any;
  setIsEditPage: any;
  showModal: any;
  client: any;
  setIsViewMode: any;
}

export type Props = DispatchProps
