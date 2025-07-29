import { ActionsTypes } from './types';

const initialState = {
  //products: [],
  //selectedProduct: {},
  max_att: 0,
};

export const attReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ActionsTypes.SET_MAX_ATT:
      return { ...state, max_att: payload };
    
    case ActionsTypes.GET_MAX_ATT:
        return {
            ...state,
            att: state.max_att
        }
    

    default:
      return state;
  }
};
