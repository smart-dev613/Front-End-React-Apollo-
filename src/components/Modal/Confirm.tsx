import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import { closeCurrentModal } from '../../store/modal/action'
import ModalFooter from './ModalFooter'
import Button from '../Form/Button'

interface DispatchProps {
  closeCurrentModal: (modalType: string, keepModal?: boolean) => void
}

interface ParentProps {
  info: any // @@TODO - should make this more strict as we know what info will look like
}


type Props = DispatchProps & ParentProps

class SuccessModalContent extends Component<Props> {
  public constructor (props: Props) {
    super(props)

    this.closeModal = this.closeModal.bind(this)
  }

  public closeModal () {
    this.props.closeCurrentModal('SUCCESS')
  }

  public render () {
    return (
      <div className='modal-content'>
        <div className='modal-header'>
          <h5 className='modal-title'>
            {this.props.info.additionalData.Title}
          </h5>
          <button type='button' className='close' onClick={this.closeModal} aria-label='Close'>
            <span aria-hidden='true'>&times;</span>
          </button>
        </div>
        <div className='modal-body'>
          <div>{this.props.info.additionalData.Details}</div>
        </div>
        <ModalFooter>
          <Button text='Close' addClassName='btn-danger' onClick={this.closeModal} />
        </ModalFooter>
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({
    closeCurrentModal
  }, dispatch)
}

export default connect(null, mapDispatchToProps)(SuccessModalContent)
