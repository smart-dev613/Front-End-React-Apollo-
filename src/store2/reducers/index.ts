import { combineReducers } from "redux";
import { attReducer } from "./attReducer";

const reducers2 = combineReducers({
    attdences : attReducer
})

export default reducers2;