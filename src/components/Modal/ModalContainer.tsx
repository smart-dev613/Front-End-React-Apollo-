import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { AppState } from '../../store/root'
import ModalOuter from './ModalOuter'
import { ModalInfo } from '../../store/modal/types'

interface DispatchProps {
  modals: ModalInfo[]
}

type Props = DispatchProps

class ModalContainer extends Component<Props> {
  public render () {
    return (
      <StyledModalContainer className='modal-container' id='modalContainer'>
        {
          this.props.modals.map((modal, index) => {
            return <ModalOuter key={index} info={modal} isActive={index === (this.props.modals.length - 1)} />
          })
        }
      </StyledModalContainer>
    )
  }
}

const StyledModalContainer = styled.div`
  .modal-content {
    /* width: 90% !important; */
   
  }
`;

const mapStateToProps = function (state: AppState) {
  return {
    modals: state.modal.modals
  }
}

export default connect(mapStateToProps)(ModalContainer)
