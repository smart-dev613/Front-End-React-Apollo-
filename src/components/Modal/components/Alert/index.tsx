import React from 'react'
import { AlertBody } from './components/general';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { SFC } from 'react';

interface ModalProps {
  isOpeModal?: boolean;
  onClick?: (e: any) => void;
}

const AlertContent: SFC<ModalProps> =({onClick, isOpeModal}) =>{
    return (
      <AlertBody>
        <div className={`cart-alert ${isOpeModal ? 'in' : 'out'}`}>
          <h4>Item added to cart</h4>
          <FontAwesomeIcon onClick={onClick} icon={faTimes} />
        </div>
      </AlertBody>
    );
}

export default AlertContent;