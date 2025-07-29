import { ActionsTypes } from "../constants/action-types";

export const setAtt = (att)=>{
    return {
        type: ActionsTypes.SET_MAX_ATT,
        payload: att
    }
}