import ApolloClient from 'apollo-client';
import { UserState } from '../../../../store/user/types';

export interface PricingItem {
    pricing: any,
    id:any,
    name: any,
    duration: any,
    quantity: any,
    currency: any,
    price: any,
    totalPrice:any,
    imageURL: any,
    tax: any
}

interface StateProps {
    page: string;
    user: UserState;
    client: ApolloClient<any>;
    showSearch: boolean;
}

export interface Props extends StateProps {
    setCurrentPage: (page: string) => void;
    fetchCarts: (id: string) => void;
}
