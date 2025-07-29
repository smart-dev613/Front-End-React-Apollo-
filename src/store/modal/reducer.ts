import { ModalState, ModalActionTypes, ADD_MODAL, REMOVE_MODAL, REMOVE_TWO_MODALS, SET_MODAL_ERROR } from './types'

const initialState: ModalState = {
  modals: [],
  modalError: null
}

export function modalReducer(state = initialState, action: ModalActionTypes): ModalState {
  switch (action.type) {
    case ADD_MODAL:
      return {
        ...state,
        modals: [...state.modals, action.modalInfo]
      }
    case REMOVE_MODAL:
      return {
        ...state,
        modals: [
          ...state.modals.filter(item => item.type !== action.modalType)
        ]
      }
    case REMOVE_TWO_MODALS:
      let newModals = [...state.modals]
      newModals.pop()
      newModals.pop()
      return {
        ...state,
        modals: newModals
      }
    case SET_MODAL_ERROR:
      return {
        ...state,
        modalError: action.modalError
      }
    default:
      return state
  }
}
