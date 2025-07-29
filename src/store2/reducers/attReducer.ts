import { ActionsTypes } from '../constants/action-types';

const initialState = {
  //products: [],
  //selectedProduct: {},
  max_att: 0
};

export const attReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ActionsTypes.SET_MAX_ATT:
      return { ...state, products: payload };

    // case ActionsTypes.SELECTED_PRODUCT:
    //   return { ...state, selectedProduct: payload };

    // case ActionsTypes.REMOVE_SELECTED_PRODUCT:
    //   return {};

    default:
      return state;
  }
};
