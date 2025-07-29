import { userReducer } from './user/reducers'
import { uiReducer } from './ui/reducers'
import { modalReducer } from './modal/reducer' 
import { attReducer } from './att/reducer'
import { qrReducer } from './qr/reducer'
import { combineReducers } from 'redux'

export const rootReducer = combineReducers({
  user: userReducer,
  ui: uiReducer,
  modal: modalReducer,
  att: attReducer,
  qr: qrReducer
})

export type AppState = ReturnType<typeof rootReducer>