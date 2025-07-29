import { Dispatch } from 'redux'
import { ModalInfo, ADD_MODAL, REMOVE_MODAL, REMOVE_TWO_MODALS, SET_MODAL_ERROR } from './types'
import { setLoadingTrue, setLoadingFalse } from '../ui/action'
import $ from 'jquery'

// ACTIONS (interact with reducer)
const addModal = (modalInfo: ModalInfo) => {
  return {
    type: ADD_MODAL,
    modalInfo
  }
}

const removeModal = (modalType: string) => {
  return {
    type: REMOVE_MODAL,
    modalType
  }
}

const removeTwoModals = () => {
  return {
    type: REMOVE_TWO_MODALS
  }
}

const setModalError = (modalError: string) => {
  return {
    type: SET_MODAL_ERROR,
    modalError
  }
}

// ACTION CREATORS (call these from components)

const emptyPromise = () => {
  return new Promise(resolve => resolve({ status: 'success', data: null }))
}


export const showModal = (modalType: string, modalSize: string, apiCall: (params: string) => any = null, callParams: string = null, additionalData: any = null) => (dispatch: Dispatch) => {
  return new Promise((resolve: any) => {
    dispatch(setLoadingTrue())
    dispatch(setModalError(null))
    if (!apiCall) apiCall = emptyPromise
    apiCall(callParams)
      .then((result: any) => {
        if (result.status !== 'success' && !result.result) {
          dispatch(setModalError(result.error))
        } else if (result.result !== 'success' && !result.status) {
          dispatch(setModalError(result.error))
        } else {
          dispatch(addModal({
            type: modalType,
            size: modalSize,
            data: result.data,
            additionalData: additionalData
          }))
          dispatch(setLoadingFalse())
        }
      })
      .then(() => resolve())
      .catch((err: any) => {
        console.log(err)
        dispatch(setModalError(err.toString()))
        // dispatch(errorHandlerGeneral(err))
        dispatch(setLoadingFalse())
        resolve()
      })
  })
}

export const closeTwoModals = (modalType: string) => (dispatch: Dispatch) => {
  return new Promise((resolve: any) => {
    $('#' + modalType + '_MODAL').on('hidden.bs.modal', () => {
      dispatch(removeTwoModals())
      resolve()
    }).modal('hide')
  })
}

export const closeCurrentModal = (modalType: string, keepModal?: boolean) => (dispatch: Dispatch) => {
  return new Promise((resolve: any) => {
    if (keepModal) {
      $('#' + modalType + '_MODAL').on('hidden.bs.modal', () => {
        resolve()
      }).modal('hide')
    } else {
      $('#' + modalType + '_MODAL').on('hidden.bs.modal', () => {
        dispatch(removeModal(modalType))
        resolve()
      }).modal('hide')
    }
  })
}
