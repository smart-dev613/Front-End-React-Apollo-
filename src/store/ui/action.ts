import { Dispatch } from 'redux'
import {
  SET_PAGE,
  SET_LOADING_TRUE,
  SET_LOADING_FALSE,
  SET_SEARCHBAR_SHOW,
  SET_SEARCH_TEXT,
  SET_SEARCHBAR_HIDE,
  SET_LANGUAGE,
  SET_IS_EDIT,
  SET_IS_VIEW_MODE,
  SET_CHANNEL_DATA_ERROR,
  SET_NOTIFICATION_FETCHING_FALSE,
  SET_NOTIFICATION_ACTIVITY_TRUE,
  SET_NOTIFICATION_ACTIVITY_FALSE,
  SET_NOTIFICATION_FETCHING_TRUE
} from './types'

// ACTIONS (interact with reducer)
export const setPage = (page: string) => {
  return {
    type: SET_PAGE,
    page,
  }
}

export const setSearchBarShow = () => {
  return {
    type: SET_SEARCHBAR_SHOW,
  }
}

export const setLanguage = (language: string) => {
  return {
    type: SET_LANGUAGE,
    language,
  }
}

export const SetSearchText = (searchText: string) => {
  return {
    type: SET_SEARCH_TEXT,
    searchText,
  }
}

export const setCurrentSearchText = (searchText: string) => (dispatch: Dispatch) => {
  dispatch(SetSearchText(searchText))
}

export const setSearchBarHide = () => {
  return {
    type: SET_SEARCHBAR_HIDE,
  }
}

export const setLoadingTrue = () => {
  return {
    type: SET_LOADING_TRUE,
  }
}

export const setLoadingFalse = () => {
  return {
    type: SET_LOADING_FALSE,
  }
}

export const setIsEdit = (isEdit: boolean) => {
  return {
    type: SET_IS_EDIT,
    isEdit,
  }
}

export const setIsViewMode = (isViewMode: boolean) => {
  return {
    type: SET_IS_VIEW_MODE,
    isViewMode,
  }
}

export const setChannelDataError = (channelDataError: any) => {
  return {
    type: SET_CHANNEL_DATA_ERROR,
    channelDataError,
  }
}

export const errorHandlerGeneral = (err: any) => {
  console.log(err)
  return { type: 'err' }
}

export const setNotificationActivityTrue = () => {
  return {
    type: SET_NOTIFICATION_ACTIVITY_TRUE,
  }
}
export const setNotificationActivityFalse = () => {
  return {
    type: SET_NOTIFICATION_ACTIVITY_FALSE,
  }
}
export const setNotificationFetchingTrue = () => {
  return {
    type: SET_NOTIFICATION_FETCHING_TRUE,
  }
}
export const setNotificationFetchingFalse = () => {
  return {
    type: SET_NOTIFICATION_FETCHING_FALSE,
  }
}

// ACTION CREATORS (call from components)
export const setCurrentPage = (page: string) => (dispatch: Dispatch) => {
  dispatch(setIsEdit(false))
  dispatch(setPage(page))
}

export const setCurrentLanguage = (language: string) => (dispatch: Dispatch) => {
  dispatch(setLanguage(language))
}

export const setNotificationActivityLoading = (loading: boolean) => (dispatch: Dispatch) => {
  if (loading) {
    dispatch(setNotificationActivityTrue())
  } else {
    dispatch(setNotificationActivityFalse())
  }
}
export const setNotificationFetchingLoading = (loading: boolean) => (dispatch: Dispatch) => {
  if (loading) {
    dispatch(setNotificationFetchingTrue())
  } else {
    dispatch(setNotificationFetchingFalse())
  }
}
export const setLoadingOverlay = (loading: boolean) => (dispatch: Dispatch) => {
  if (loading) {
    dispatch(setLoadingTrue())
  } else {
    dispatch(setLoadingFalse())
  }
}



export const setIsEditPage = (isEdit: boolean) => (dispatch: Dispatch) => {
  dispatch(setIsEdit(isEdit))
}
