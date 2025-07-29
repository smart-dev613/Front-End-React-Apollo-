import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import { closeCurrentModal } from '../../store/modal/action'
import { setLoadingOverlay } from '../../store/ui/action'
// import { getAllCompanies } from '../../store/user/action'
// import { newCompany } from '../../providers/company'
// import { validateEmail } from '../../utils/helper'
// import Form from '../Form/Form'
// import FormGroup from '../Form/FormGroup'
// import FormRow from '../Form/FormRow'
// import Label from '../Form/Label'
// import Input from '../Form/Input'
import Button from '../Form/Button'
import ModalFooter from './ModalFooter'
import { Translation, Trans } from 'react-i18next'

interface DispatchProps {
  closeCurrentModal: (type: string) => void
  setLoadingOverlay: (loading: boolean) => void
}

type Props = DispatchProps

interface NewCompanyState {
  companyName: string
  companyUrl: string
  companyEmail: string
  formFieldErrors: string[]
  formErrorMsg: string
}

class NewCompany extends Component<Props, NewCompanyState> {
  public constructor (props: Props) {
    super(props)

    this.state = {
      companyName: null,
      companyUrl: null,
      companyEmail: null,
      formFieldErrors: [],
      formErrorMsg: null
    }

    // this.handleSubmit = this.handleSubmit.bind(this)
    // this.inputChange = this.inputChange.bind(this)
    // this.closeModal = this.closeModal.bind(this)
  }

  // public inputChange (e: React.ChangeEvent<HTMLInputElement>): void {
  //   e.persist()
  //   let keys = ['companyName', 'companyUrl', 'companyEmail']
  //   let target = Reflect.get(e, 'target')

  //   let stateChange = {}

  //   keys.forEach(thisKey => {
  //     if (Reflect.get(target, 'id') === thisKey) {
  //       Reflect.set(stateChange, thisKey, Reflect.get(target, 'value'))
  //     }
  //   })
  //   this.setState(stateChange)
  // }

  // public handleSubmit (e: React.MouseEvent | React.FormEvent) {
  //   e.preventDefault()
  //   this.props.setLoadingOverlay(true)
  //   let formData = {
  //     name: this.state.companyName,
  //     url: this.state.companyUrl,
  //     email: this.state.companyEmail
  //   }
  //   let errorArr = []

  //   // form validation
  //   if (!formData.name) errorArr.push('companyName')
  //   if (!formData.url) errorArr.push('companyUrl')
  //   if (!validateEmail(formData.email)) errorArr.push('companyEmail')

  //   this.setState({ formFieldErrors: errorArr, formErrorMsg: null }, () => {
  //     if (this.state.formFieldErrors.length > 1) {
  //       this.setState({formErrorMsg: 'Please complete the missing fields' }, () => this.props.setLoadingOverlay(false))
  //     } else if (this.state.formFieldErrors.length === 1 && this.state.formFieldErrors.includes('companyEmail')) {
  //       this.setState({formErrorMsg: 'Please check your email address' }, () => this.props.setLoadingOverlay(false))
  //     } else {
  //       newCompany(formData)
  //         .then((result: any) => { // @@TODO - Make response interface - gc 20/09/19
  //           if (result.result !== 'success') {
  //             // @TOOD - HANDLE ERRORRR gc 20/09/19
  //             this.props.setLoadingOverlay(false)

  //           } else {
  //             this.props.getAllCompanies()
  //             this.closeModal()
  //             this.props.setLoadingOverlay(false)
  //           }
  //         })
  //         .catch(err => {
  //           if (err instanceof DOMException) {
  //             // @TOOD - HANDLE ERRORRR gc 20/09/19
  //             this.props.setLoadingOverlay(false)
  //           } else {
  //             // @TOOD - HANDLE ERRORRR gc 20/09/19
  //             this.props.setLoadingOverlay(false)
  //             console.log(err)
  //           }
  //         })
  //     }
  //   })
    
  // }

  // public closeModal () {
  //   this.props.closeCurrentModal('NEW_COMPANY')
  // }

  public render() {
    const { formFieldErrors, formErrorMsg } = this.state
    return (
      <Translation>
        {
          () =>
            <StyledQrCodeModal className='modal-content'>
              <div className='modal-header'>
                <h4>
                  <Trans i18nKey='NewCompanyHeader'>trans</Trans>
                </h4>
                <button type='button' className='close'  aria-label='Close'>
                  <span aria-hidden='true'>&times;</span>
                </button>
              </div>
              <div className='modal-body'>
                {/* <Form id='NewCompany' onSubmit={this.handleSubmit}>
                  <FormRow>
                    <FormGroup>
                      <Label labelFor='companyName' colSize='3'><Trans i18nKey='NewCompanyName'>trans</Trans></Label>
                      <Input
                        onChange={this.inputChange}
                        id='companyName'
                        name='companyName'
                        type='text'
                        placeholder='Company Name'
                        colSize='9'
                        fieldError={formFieldErrors.includes('companyName')}
                      />
                    </FormGroup>
                  </FormRow>
                  <FormRow>
                    <FormGroup>
                      <Label labelFor='companyUrl' colSize='3'><Trans i18nKey='NewCompanyUrl'>trans</Trans></Label>
                      <Input
                        onChange={this.inputChange}
                        id='companyUrl'
                        name='companyUrl'
                        type='text'
                        placeholder='Company URL'
                        colSize='9'
                        fieldError={formFieldErrors.includes('companyUrl')}
                      />
                    </FormGroup>
                  </FormRow>
                  <FormRow>
                    <FormGroup addClassName='mb-0'>
                      <Label labelFor='companyEmail' colSize='3'><Trans i18nKey='NewCompanyEmail'>trans</Trans></Label>
                      <Input
                        onChange={this.inputChange}
                        id='companyEmail'
                        name='companyEmail'
                        type='email'
                        placeholder='Company Email'
                        colSize='9'
                        fieldError={formFieldErrors.includes('companyEmail')}
                      />
                    </FormGroup>
                  </FormRow>
                </Form> */}
              </div>
              {/* <ModalFooter addClassName='wrap' >
                {
                  formErrorMsg && <div className='alert alert-danger text-center mt-3'>{formErrorMsg}</div>
                }
                <Button text='Cancel' addClassName='btn-danger' onClick={this.closeModal} /> 
                <Button text='Create' addClassName='btn-primary' onClick={this.handleSubmit} />
              </ModalFooter> */}
            </StyledQrCodeModal>
        }
      </Translation>
    )
  }
}

const StyledQrCodeModal = styled.div`
  @media (max-width: 768px) {
    .wrap {
      flex-wrap: wrap-reverse;
    }
  }
`

const mapDispatchToProps = function (dispatch: Dispatch) {
  return bindActionCreators({
    closeCurrentModal,
    setLoadingOverlay,
    // getAllCompanies 
  }, dispatch)
}

export default connect(null, mapDispatchToProps)(NewCompany)