import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { AppState } from '../../store/root'
import { bindActionCreators, Dispatch } from 'redux'
//import { setCurrentPage } from '../store/ui/action'
import { Translation, Trans } from 'react-i18next'

// import NavTile from '../Dashboard/NavTile'
import LanguagePicker from '../../components/LanguagePicker'
import Toggle from '../Form/Toggle'
import { showModal, closeCurrentModal } from '../../store/modal/action'
import { ShowModal } from '../../store/modal/types'
import CloseButton from '../../assets/images/icons/Close_CircleB.png'
import ModalFooter from './ModalFooter'


interface StateProps {
  page: string
}

interface DispatchProps {
  setCurrentPage: (page: string) => void
  closeCurrentModal: (type: string) => void
  showModal: ShowModal
  info: {additionalData: AdditionalData}
}

interface AdditionalData {
  id: number
  name: string 
}

interface UserDataModalState {
  actions: string[]
}

type Props = DispatchProps & StateProps
const actions = ['Digital Ads', 'Emails', 'SMS', 'Research Studies']

export class Dashboard extends Component<Props, UserDataModalState> {

  public constructor(props: Props){
    super(props)
    this.closeModal = this.closeModal.bind(this)
  }

  public closeModal () {
    this.props.closeCurrentModal('USERDATA_MODAL')
  }

  public componentDidMount () {
    //this.props.setCurrentPage('dashboard')
  }

  public render() {
    // console.log('props123', this.props.info.additionalData)
    const brandName = this.props.info.additionalData
    return (

      <Translation>
        {
          () =>
            <StyledDashboard className='modal-content'>
              <div className='modal-header width-header'>
                <h4>
                  <Trans i18nKey='GDPRHeader'>trans</Trans>
                </h4>
                <button type='button' className='close' onClick={this.closeModal} aria-label='Close'>
                  <span aria-hidden='true'>&times;</span>
                </button>
              </div>
              <div className='modal-body'>
                {/* <button className='btn close-button' onClick={this.closeModal}>x</button> */}
                <span className='heading'>
                  {brandName.name}
                </span>

                {actions.map((action) => (
                  <li key={action} className='listItems' ><span>{action}</span><span className='action-icons'><Toggle  isChecked={true} /></span></li>
                ))}

                <span className='warning-text'><p>You understand you may not receive promotions, offers, whitepapers, updates and many more exciting offers by saying <strong><i>No</i></strong>.</p></span>

              </div>
              <ModalFooter addClassName='wrap' >
                {
                  //formErrorMsg && <div className='alert alert-danger text-center mt-3'>{formErrorMsg}</div>
                }
                {/* <Button text='Cancel' addClassName='btn-danger' onClick={this.closeModal} /> 
              <Button text='Create' addClassName='btn-primary' onClick={this.handleSubmit} /> */}
              </ModalFooter>
            </StyledDashboard>
        }
      </Translation>








      
    )
  }
}

const StyledDashboard = styled.div`
  height: calc(100vh - 56px);
  display: flex;
  justify-content: center;
  align-items: center;
  color: #000;
  .width-header {
    width: 100%;
  }

  li {
    display: flex;
    width: 100%;
    list-style-type: none;
    border-bottom: 1px solid gray;
    margin: 5px 0px;
  }

  .action-icons {
    float: right;
    margin-left: auto;
  }

  .heading {
    font-size: xx-large;
    text-decoration: underline;
    margin-bottom: 20px;
    display: flex;
    justify-content: center;
  }

  .brandContainer {
    margin: 30px;
  }

  .close-button {
    position: absolute;
    color: #ffffff;
    top: 80px;
    right: 10px;
    border: none;
    background: none;
  }

  .close-btn-img {
    height: 30px;
    max-width: 35px;
    width: 30px;
    max-height: 35px;
  }

  .warning-text {
    text-align: center;
    padding: 10px;
  }
`

const mapStateToProps = function (state: AppState) {
  return {
    page: state.ui.page
  }
}

const mapDispatchToProps = function (dispatch: Dispatch) {
  return bindActionCreators(
    {
      // setCurrentPage
      showModal,
      closeCurrentModal
    },
    dispatch
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
