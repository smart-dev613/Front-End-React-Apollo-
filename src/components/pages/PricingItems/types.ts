import ApolloClient from 'apollo-client';
import { UserState } from '../../../store/user/types';

export interface PricingItem {
    
}


interface StateProps {
    page: string;
    user: UserState;
    client: ApolloClient<any>;
    showSearch: boolean;
}

export interface Props extends StateProps {
    setCurrentPage: (page: string) => void;
}
