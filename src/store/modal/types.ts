export interface ModalState {
  modals: ModalInfo[]
  modalError: string
}

export interface ModalInfo {
  type: string
  size: string
  data?: any // TODO check this and replace with API response type
  additionalData?: any
}

export type ShowModal = (type: string, size: string, apiCall?: any, apiCallParams?: any, additionalInfo?: any) => void

export const ADD_MODAL = 'ADD_MODAL'
export const REMOVE_MODAL = 'REMOVE_MODAL'
export const REMOVE_TWO_MODALS = 'REMOVE_TWO_MODALS'
export const SET_MODAL_ERROR = 'SET_MODAL_ERROR'

interface AddModalAction {
  type: typeof ADD_MODAL
  modalInfo: ModalInfo
}

interface RemoveModalAction {
  type: typeof REMOVE_MODAL
  modalType: string
}

interface RemoveTwoModalsAction {
  type: typeof REMOVE_TWO_MODALS
}

interface SetModalErrorAction {
  type: typeof SET_MODAL_ERROR
  modalError: string
}

export type ModalActionTypes = AddModalAction | RemoveModalAction | RemoveTwoModalsAction | SetModalErrorAction