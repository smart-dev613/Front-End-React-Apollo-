import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import { closeCurrentModal } from '../../store/modal/action'
import { setLoadingOverlay } from '../../store/ui/action'
import Form from '../Form/Form'
import FormGroup from '../Form/FormGroup'
import FormRow from '../Form/FormRow'
import Button from '../Form/Button'
import ModalFooter from './ModalFooter'
import { Translation, Trans } from 'react-i18next'

interface DispatchProps {
  closeCurrentModal: (type: string) => void
  setLoadingOverlay: (loading: boolean) => void
}

type Props = DispatchProps

interface NotificationState {
  companyName: string
  companyUrl: string
  companyEmail: string
  formFieldErrors: string[]
  formErrorMsg: string
  value: string
  headerValue: string
}

interface NotificationItems {
  id: number
  name: string
  event: string
  person: string
  location: string
  time: string
  date: string
}

class NotesModal extends Component<Props, NotificationState> {
  public constructor (props: Props) {
    super(props)

    this.state = {
      companyName: null,
      companyUrl: null,
      companyEmail: null,
      formFieldErrors: [],
      formErrorMsg: null,
      value: '',
      headerValue: ''
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  public handleSubmit (e: React.MouseEvent | React.FormEvent) {
    e.preventDefault()
    this.props.setLoadingOverlay(true)
    let formData = {
      name: this.state.companyName,
      url: this.state.companyUrl,
      email: this.state.companyEmail
    }
    let errorArr = []

    // form validation
    if (!formData.name) errorArr.push('companyName')
    if (!formData.url) errorArr.push('companyUrl')    
  }

  public closeModal () {
    this.props.closeCurrentModal('NOTES_MODAL')
  }

  public handleChange(event: any, type: string) {
    if(type == 'title'){
      this.setState({headerValue: event.target.value})
    }
    else if (type == 'content') {
      this.setState({value: event.target.value})
    }
  }

  public render() {
    const { formFieldErrors, formErrorMsg } = this.state
    return (
      <Translation>
        {
          () =>
            <StyledNotificationCodeModal className='modal-content'>
              <div className='modal-header'>
                <h4>
                  <Trans i18nKey='NotesHeader'>trans</Trans>
                </h4>
                <button type='button' className='close' onClick={this.closeModal} aria-label='Close'>
                  <span aria-hidden='true'>&times;</span>
                </button>
              </div>
              <div className='modal-body'>
                <Form id='addNotes' onSubmit={this.handleSubmit}>
                  <FormRow>
                    <FormGroup>
                      {/* <Label labelFor='companyName' colSize='3'><Trans i18nKey='EditCompanyName'>trans</Trans></Label>
                      <Input
                        
                        id='companyName'
                        name='companyName'
                        type='text'
                        placeholder='Company Name'
                        colSize='9'
                        fieldError={formFieldErrors.includes('companyName')}
                        value={companyName}
                      /> */}
                      <input type='text' value={this.state.headerValue} onChange={(event) => this.handleChange(event, 'title')} placeholder='Note Heading'/>
                    </FormGroup>
                  </FormRow>

                  <FormRow>
                    <FormGroup>
                      <textarea value={this.state.value} placeholder='Enter a note' className='content-text' onChange={(event) => this.handleChange(event, 'content')} cols={40} rows={10} />
                        
                    </FormGroup>
                  </FormRow>
                </Form>

                
              </div>
              <ModalFooter addClassName='wrap' >
                {
                  formErrorMsg && <div className='alert alert-danger text-center mt-3'>{formErrorMsg}</div>
                }
                <Button text='Cancel' addClassName='btn-danger' onClick={this.closeModal} /> 
                <Button text='Create' addClassName='btn-primary' onClick={this.handleSubmit} />
              </ModalFooter>
            </StyledNotificationCodeModal>
        }
      </Translation>
    )
  }
}

const StyledNotificationCodeModal = styled.div`
  @media (max-width: 768px) {
    .wrap {
      flex-wrap: wrap-reverse;
    }
  }

  .content-text {
    resize: none;
    display: flex;
    flex: 1;
  }

  input {
    display: flex;
    flex: 1;
  }
`

const mapDispatchToProps = function (dispatch: Dispatch) {
  return bindActionCreators({
    closeCurrentModal,
    setLoadingOverlay
  }, dispatch)
}

export default connect(null, mapDispatchToProps)(NotesModal)