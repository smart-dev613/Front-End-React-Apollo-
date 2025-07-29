import { UserState, UserActionTypes, LOGIN, SET_SESSION_PENDING, SET_USER_DATA, SET_COMPANY_DATA, EVENT_ATTENDANCE, SET_ALL_COMPANIES, SET_IS_ALREADY_REQUESTED, SET_CARTS,SET_IS_USER_SELECTED } from './types'

const initialState: UserState = {
  isLoggedIn: false,
  isSessionPending: false,
  isEventAttendee: {},
  isAlreadyRequested: false,
  userData: {} as any,
  companyData: {} as any,
  allCompanies: [] as any,
  carts: [] as any,
  isUserSelected : null
}

export function userReducer(state = initialState, action: UserActionTypes): UserState {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        isLoggedIn: true
      }
    case SET_IS_ALREADY_REQUESTED:
      return {
        ...state,
        isAlreadyRequested: action.data
      }
    case EVENT_ATTENDANCE:
      return {
        ...state,
        isEventAttendee: action.data
      }
    case SET_SESSION_PENDING:
      return {
        ...state,
        isSessionPending: action.pending
      }
    case SET_USER_DATA:
      return {
        ...state,
        userData: action.userData
      }
    case SET_COMPANY_DATA:
      return {
        ...state,
        companyData: action.companyData
      }
    case SET_ALL_COMPANIES:
      return {
        ...state,
        allCompanies: action.companies
      }
    case SET_CARTS:
      return {
        ...state,
        carts: action.carts
      }
    case SET_IS_USER_SELECTED:
        return {
          ...state,
          isUserSelected: action.UserSelection
        }
    default:
      return state
  }
}