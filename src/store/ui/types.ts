export interface UIState {
  page?: string
  language: string
  isLoading: boolean
  notificationActivity: boolean
  notificationFetching: boolean
  showSearch?: boolean
  searchText: string
  isEdit: boolean
  isViewMode?: boolean
  channelDataError?: any
}

export type Branding = any // until we know what the branding data structure will look like
// then change Branding to an interface below
// export interface Branding {
  
// }

export const SET_PAGE = 'SET_PAGE'
export const SET_LOADING_TRUE = 'SET_LOADING_TRUE'
export const SET_LOADING_FALSE = 'SET_LOADING_FALSE'
export const SET_SEARCHBAR_SHOW = 'SET_SEARCHBAR_SHOW'
export const SET_SEARCHBAR_HIDE = 'SET_SEARCHBAR_HIDE'
export const SET_SEARCH_TEXT = 'SET_SEARCH_TEXT'
export const SET_LANGUAGE = 'SET_LANGUAGE'
export const SET_IS_EDIT = 'SET_IS_EDIT'
export const SET_IS_VIEW_MODE = 'SET_IS_VIEW_MODE'
export const SET_CHANNEL_DATA_ERROR = 'SET_CHANNEL_DATA_ERROR'
export const SET_NOTIFICATION_ACTIVITY_TRUE = 'SET_NOTIFICATION_ACTIVITY_TRUE'
export const SET_NOTIFICATION_ACTIVITY_FALSE = 'SET_NOTIFICATION_ACTIVITY_FALSE'
export const SET_NOTIFICATION_FETCHING_TRUE = 'SET_NOTIFICATION_FETCHING_TRUE'
export const SET_NOTIFICATION_FETCHING_FALSE = 'SET_NOTIFICATION_FETCHING_FALSE'

interface SetPageAction {
  type: typeof SET_PAGE,
  page: string
}

interface SetLanguageAction {
  type: typeof SET_LANGUAGE,
  language: string
}

interface SetSearchBarShow {
  type: typeof SET_SEARCHBAR_SHOW
}

interface SetLoadingTrueAction {
  type: typeof SET_LOADING_TRUE
}

interface SetLoadingFalseAction {
  type: typeof SET_LOADING_FALSE
}

interface SetSearchBarHide {
  type: typeof SET_SEARCHBAR_HIDE
}
interface SetSearchText {
  type: typeof SET_SEARCH_TEXT
  searchText:string
}
interface SetIsEdit {
  type: typeof SET_IS_EDIT
  isEdit:boolean
}
interface SetIsViewMode {
  type: typeof SET_IS_VIEW_MODE
  isViewMode:boolean
}

interface setNotificationActivityTrue {
  type: typeof SET_NOTIFICATION_ACTIVITY_TRUE
}
interface setNotificationActivityFalse {
  type: typeof SET_NOTIFICATION_ACTIVITY_FALSE
}
interface setNotificationFetchingTrue {
  type: typeof SET_NOTIFICATION_FETCHING_TRUE
}
interface setNotificationFetchingFalse {
  type: typeof SET_NOTIFICATION_FETCHING_FALSE
}

export type UiActionTypes = SetLanguageAction | SetPageAction | SetLoadingTrueAction | SetLoadingFalseAction | SetSearchBarShow | SetSearchBarHide | SetSearchText | SetIsEdit | SetIsViewMode | any  | setNotificationActivityTrue | setNotificationActivityFalse | setNotificationFetchingTrue | setNotificationFetchingFalse