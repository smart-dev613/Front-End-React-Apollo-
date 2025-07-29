import { ActionsTypes } from './types';

const initialState = {
  //products: [],
  //selectedProduct: {},
  // first_checked : null || localStorage.get('first_ch'),
  // first_checked: () => (JSON.parse(localStorage.getItem('first_ch')) == true ? true : false),
  // last_checked: () => (JSON.parse(localStorage.getItem('last_ch')) == true ? true : false),
  first_checked : false,
  last_checked: false,
  avatar_chekced: false,
  company_checked: false,
};

export const qrReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ActionsTypes.FIRST_CHECKED:
      // alert(payload)
      localStorage.setItem('first_ch', JSON.stringify(!state.first_checked));
      return { ...state,  first_checked: payload };
      // return { ...state,  first_checked: !state.first_checked };
    case ActionsTypes.LAST_CHECKED:
      localStorage.setItem('last_ch', JSON.stringify(!state.last_checked))
      return { ...state, last_checked: payload };
      // return { ...state, last_checked: !state.last_checked };
    
    case ActionsTypes.AVATAR_CHECKED:
      return { ...state, avatar_chekced: payload };
      // return { ...state, avatar_chekced: !state.avatar_chekced };

    case ActionsTypes.COMPANY_CHEKCED:
      return { ...state, company_checked: payload };
      // return { ...state, company_checked: !state.company_checked };
    
   
    

    default:
      return state;
  }
};
