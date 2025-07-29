import { ActionsTypes } from './types';

export const set_first = (payload) => {
  return {
    type: ActionsTypes.FIRST_CHECKED,
    payload: payload,
  };
};

export const set_last = (payload) => {
  return {
    type: ActionsTypes.LAST_CHECKED,
    payload: payload,
  };
};

export const set_avatar = (payload) => {
  return {
    type: ActionsTypes.AVATAR_CHECKED,
    payload: payload,
  };
};

export const set_company = (payload) => {
  return {
    type: ActionsTypes.COMPANY_CHEKCED,
    payload: payload,
  };
};
