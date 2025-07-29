import { ActionsTypes } from './types';

export const setAtt = (att) => {
  return {
    type: ActionsTypes.SET_MAX_ATT,
    payload: att,
  };
};


export const maxAtt = (att) => {
  return {
    type: ActionsTypes.GET_MAX_ATT,
    payload: att,
  };
};