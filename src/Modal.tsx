import React, { SFC } from 'react'

import './styles/modal.scss'

interface ModalProps {
  isOpeModal?: boolean
  onClick?: (e: any)=> void
}

const Modal: SFC<ModalProps> = ({ isOpeModal, onClick }) => {
  return (
    <div onClick={onClick} className={`popup__container ${isOpeModal ? 'popup__container-active' : ''}`}>
      <div className={`popup__box ${isOpeModal ? 'popup__box-active' : ''}`}>Your data</div>
    </div>
  );
}
 
export default Modal;
