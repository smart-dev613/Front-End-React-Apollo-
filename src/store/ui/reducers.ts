import {
  UIState,
  SET_PAGE,
  UiActionTypes,
  SET_SEARCHBAR_SHOW,
  SET_SEARCH_TEXT,
  SET_SEARCHBAR_HIDE,
  SET_LANGUAGE,
  SET_IS_EDIT,
  SET_IS_VIEW_MODE,
  SET_CHANNEL_DATA_ERROR,
  SET_NOTIFICATION_ACTIVITY_FALSE,
  SET_NOTIFICATION_ACTIVITY_TRUE,
  SET_NOTIFICATION_FETCHING_FALSE,
  SET_NOTIFICATION_FETCHING_TRUE,
} from './types'

const initialState: UIState = {
  page: null,
  notificationActivity: false, 
  notificationFetching: false,
  language: localStorage.getItem('i18nextLng'),
  isLoading: false,
  showSearch: false,
  searchText: '',
  isEdit: false,
  isViewMode: false,
  channelDataError: null,
}

export function uiReducer(state = initialState, action: UiActionTypes): UIState {
  switch (action.type) {
    case SET_PAGE:
      return {
        ...state,
        page: action.page,
      }
    case SET_LANGUAGE:
      return {
        ...state,
        language: action.language,
      }
    case SET_SEARCH_TEXT:
      return {
        ...state,
        searchText: action.searchText,
      }
    case SET_SEARCHBAR_SHOW:
      return {
        ...state,
        showSearch: !state.showSearch,
      }
    case SET_SEARCHBAR_HIDE:
      return {
        ...state,
        showSearch: false,
      }
    case SET_IS_EDIT:
      return {
        ...state,
        isEdit: action.isEdit,
      }
    case SET_IS_VIEW_MODE:
      return {
        ...state,
        isViewMode: action.isViewMode,
      }
    case SET_CHANNEL_DATA_ERROR:
      return {
        ...state,
        channelDataError: action.channelDataError,
      }
    case SET_NOTIFICATION_ACTIVITY_TRUE:
      return {
        ...state,
        notificationActivity: true
      }
    case SET_NOTIFICATION_ACTIVITY_FALSE:
      return {
        ...state,
        notificationActivity: false
      }

    case SET_NOTIFICATION_FETCHING_TRUE:
      return {
        ...state,
        notificationFetching: true
      }
    case SET_NOTIFICATION_FETCHING_FALSE:
      return {
        ...state,
        notificationFetching: false
      }
    default:
      return state
  }
}
