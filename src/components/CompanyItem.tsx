import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch, compose } from 'redux'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FaCalendarPlus } from "react-icons/fa"
import { AppState } from '../store/root'
import { UIState } from '../store/ui/types'
import { UserState } from '../store/user/types'
import { getCompaniesDetails } from '../store/user/action'
import KeywordList from './pages/KeywordList'
import download from '../../download.png'
import { Link } from 'react-router-dom'
import { withApollo } from 'react-apollo'
import { GET_EVENT_INFO } from '../gql/queries'
import ApolloClient from 'apollo-client'
import companyLogo from '../assets/images/icons/company_placeholder.jpg'
import profileLogo from '../assets/images/profile_placeholder.png'
import { closeCurrentModal } from '../store/modal/action'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

interface CompanyProps {
  data: {
    name: string
    Introduction: string
    logoURL: string
    type?: string
    profiles : any[]
    profileEn: {
      keywords: string[],
      bio: string
    }
    id: string,
    invitee: {
      profiles: any,
      avatar: string,
      user: {
        Introduction: string,
        firstName: string,
        lastName: string,
        avatar: string,
        Keywords : any[]
      },
      company: {
        id: string
      },

    }
  }

}

interface ListFormatAttendeesProps {

  eventType: string
  id: string
  invitationStatus: string
  invitee: {
  },
  truncateText: (arg0: string) => string
}

interface DetailsProps {
  detail: CompanyProps
  getCompaniesDetails: any
  client: ApolloClient<any>

}

interface DispatchProps {
  ui: UIState,
  user: UserState
  closeCurrentModal: (type: string) => void
}

interface CompanyState {
  Keywords: string[],
  title: string,
  Img: string,
  isEditing: boolean,
  currentUrl: string

}


type Props = DetailsProps & DispatchProps & ListFormatAttendeesProps

class Company extends Component<Props, CompanyState> {

  public constructor(props: Props) {
    super(props)
    this.state = {
      Keywords: ['#Microsoft', '#Office', '#MS Defender', '#Washington'],
      title: '',
      Img: '',
      isEditing: false,
      currentUrl: '',
    }

    this.cancelEdit = this.cancelEdit.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.BookMeeting = this.BookMeeting.bind(this)
    this.CloseModal = this.CloseModal.bind(this)
  }
  public cancelEdit() {

    this.setState({ isEditing: !this.state.isEditing });
  }
  public handleSubmit() {
    // console.log('submitted form')
    // this.props.setLoadingOverlay(true)
    // if (this.state.isEditing) {
    //   this.setState({ isEditing: !this.state.isEditing }, () => {
    if (this.state.isEditing) {
      this.setState({ isEditing: !this.state.isEditing })
    } else {
      this.setState({ isEditing: !this.state.isEditing })
    }


  }
  public CloseModal = () => {
    this.props.closeCurrentModal('DATA_DETAIL_MODAL')
  }

  public BookMeeting() {

  }

  public componentDidMount() {
    this.props.getCompaniesDetails(this.props.detail.data.id)
    this.setState({ currentUrl: window.location.pathname.substring(1).split('/')[1] })
    // this.setState({invitee: this.props.detail.data.invitee.user || {}})
  }

  // public static getDerivedStateFromProps(nextProps: any, prevState: {}){
  //   this.setState({
  //     title: nextProps.title,
  //     msg: nextProps.msg,
  //   })
  // }

  public render() {
    const { slug } = this.props.client.readQuery({ query: GET_EVENT_INFO })
    //get the profile for the chosen language
    // const profile = this.props.ui.page == "Companies" ? this.props.detail.data.profiles.filter(x => x.locale === this.props.ui.language):
    //                 this.props.ui.page == "Attendees" ? this.props.detail.data.invitee.profiles.filter(x => x.locale === this.props.ui.language):[]

            
    // let currentUrl = window.location.pathname.substring(1).split('/')[1]
    // console.log(currentUrl)
    // console.log(this.props.detail.data.invitee.user)

    return (
      <StyledList className='container-fluid'>
        {this.state.currentUrl === 'companies' ? <div className='company-details'>
          <div className="block">
            <div className="flex1">

              {this.props.detail.data.logoURL ? <div className= 'imgContainer'><img className='companyImg' src={this.props.detail.data.logoURL} alt='company name' /></div> : <div className= 'imgContainer'><img className='companyImg' src={companyLogo} alt='company name' /></div>}
              <div className="detail-name">{this.props.detail.data.name}</div>
            </div>
            <div className='row overview'>
              <div className='col-sm-15 companyDescription'>
                <p>{this.props.ui.page == "Companies" ? (this.props.detail.data.profiles.filter((profile : any) => profile.locale === this.props.ui.language)[0] && this.props.detail.data.profiles.filter((profile : any) => profile.locale === this.props.ui.language).length > 0 ? this.props.detail.data.profiles.filter((profile : any) => profile.locale === this.props.ui.language)[0].bio : this.props.detail.data.profiles.filter((profile : any) => profile.locale === "en")[0] && this.props.detail.data.profiles.filter((profile : any) => profile.locale === "en").length > 0 ? this.props.detail.data.profiles.filter((profile : any) => profile.locale === "en")[0].bio : <span>This company has not provided an introduction.</span>):null }</p>
              </div>
            </div>
          </div>
          <div className='row keywords'>
            <KeywordList  isModal = {true} Keywords={this.props.detail.data.profiles.filter((profile : any) => profile.locale === this.props.ui.language).length>0 && this.props.detail.data.profiles.filter((profile : any) => profile.locale === this.props.ui.language)[0].keywords ? this.props.detail.data.profiles.filter((profile : any) => profile.locale === this.props.ui.language)[0].keywords.length > 0 ? this.props.detail.data.profiles.filter((profile : any) => profile.locale === this.props.ui.language)[0].keywords : this.props.detail.data.profiles.filter((profile : any) => profile.locale === "en").length>0 && this.props.detail.data.profiles.filter((profile : any) => profile.locale === "en")[0].keywords ? this.props.detail.data.profiles.filter((profile : any) => profile.locale === "en")[0].keywords.length > 0 ? this.props.detail.data.profiles.filter((profile : any) => profile.locale === "en")[0].keywords : [''] : [''] : this.props.detail.data.profiles.filter((profile : any) => profile.locale === "en").length>0 && this.props.detail.data.profiles.filter((profile : any) => profile.locale === "en")[0].keywords ? this.props.detail.data.profiles.filter((profile : any) => profile.locale === "en")[0].keywords.length > 0 ? this.props.detail.data.profiles.filter((profile : any) => profile.locale === "en")[0].keywords : [''] : ['']}/>
          </div>
          {/* {this.state.isEditing ? <button
                            type="submit"
                            className="btn-primary btn-tick btn"
                            onClick={this.handleSubmit}
                          >
                            <FontAwesomeIcon
                              icon="check"
                            />
                          </button> : <button
                            type="submit"
                            className="btn-edit btn btn-primary"
                            onClick={this.handleSubmit}
                          >
                            <FontAwesomeIcon
                              icon="pencil-alt"
                            />
                          </button>}
                
                          {this.state.isEditing && (
                            <button
                              type="submit"
                              className="btn btn-danger btn-close"
                              onClick={this.cancelEdit}
                            >
                              <FontAwesomeIcon icon={faTimes} />
                            </button>
                          )} */}
          <div className='booking-button' onClick={this.BookMeeting}>
            <Link to={`/${slug}/calendar?company_id=${this.props.detail.data.id}`}><button className='calendar-icon' onClick={this.CloseModal}><FaCalendarPlus /></button></Link>
          </div>
        </div>
          : null
        }
        {this.state.currentUrl === 'attendees' ? <div className='company-details'>
          <div className="block">
            <div className="flex1">

              {this.props.detail.data.invitee.avatar ? <div className= 'imgContainer'><img className='companyImg' src={this.props.detail.data.invitee.avatar} alt='company name' /> </div>: <div className= 'imgContainer'><img className='companyImg' src={profileLogo} alt='company name' /></div>}
              <div className="detail-name">{this.props.detail.data.invitee.user.firstName} {this.props.detail.data.invitee.user.lastName}</div>
            </div>
            <div className='row overview'>
              <div className='col-sm-15 companyDescription'>
                <p>{this.props.detail.data.invitee.profiles.filter((profile : any) => profile.locale === this.props.ui.language).length> 0 ? this.props.detail.data.invitee.profiles.filter((profile : any) => profile.locale === this.props.ui.language)[0].bio : (this.props.detail.data.invitee.profiles.filter((profile : any) => profile.locale === 'en').length> 0 ? this.props.detail.data.invitee.profiles.filter((profile : any) => profile.locale === 'en')[0].bio : <span>This user has not provided an introduction.</span>)}</p>
              </div>
            </div>
          </div>
          <div className='row keywords'>
            <KeywordList isModal = {true} Keywords={this.props.detail.data.invitee.profiles.filter((profile : any) => profile.locale === this.props.ui.language).length> 0 ? this.props.detail.data.invitee.profiles.filter((profile : any) => profile.locale === this.props.ui.language)[0].keywords.length > 0 ? this.props.detail.data.invitee.profiles.filter((profile : any) => profile.locale === this.props.ui.language)[0].keywords : (this.props.detail.data.invitee.profiles.filter((profile : any) => profile.locale === 'en').length> 0 ? this.props.detail.data.invitee.profiles.filter((profile : any) => profile.locale === 'en')[0].keywords.length > 0 ? this.props.detail.data.invitee.profiles.filter((profile : any) => profile.locale === 'en')[0].keywords : [''] : ['']) : (this.props.detail.data.invitee.profiles.filter((profile : any) => profile.locale === 'en').length> 0 ? this.props.detail.data.invitee.profiles.filter((profile : any) => profile.locale === 'en')[0].keywords.length > 0 ? this.props.detail.data.invitee.profiles.filter((profile : any) => profile.locale === 'en')[0].keywords : [''] : [''])} />
          </div>
          {/* {this.state.isEditing ? <button
                            type="submit"
                            className="btn-primary btn-tick btn"
                            onClick={this.handleSubmit}
                          >
                            <FontAwesomeIcon
                              icon="check"
                            />
                          </button> : <button
                            type="submit"
                            className="btn-edit btn btn-primary"
                            onClick={this.handleSubmit}
                          >
                            <FontAwesomeIcon
                              icon="pencil-alt"
                            />
                          </button>} */}

          {this.state.isEditing && (
            <button
              type="submit"
              className="btn btn-danger btn-close"
              onClick={this.cancelEdit}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          )}
          <div className='booking-button' onClick={this.BookMeeting}>
            {/*
              // @ts-ignore */}
            {this.state.currentUrl === 'attendees' ? <Link to={`/${slug}/calendar?company_id=${this.props.detail.data.invitee.company.id}&attendee_id=${this.props.detail.data.invitee.id}`}><button className='calendar-icon' onClick={this.CloseModal}><FaCalendarPlus /></button></Link> : <Link to={`/${slug}/calendar?company_id=${this.props.detail.data.invitee.company.id}`}><button className='calendar-icon' onClick={this.CloseModal}><FaCalendarPlus /></button></Link>}
          </div>
        </div>
          : null}

      </StyledList>
    )
  }
}

const StyledList = styled.div`
  .companyList {
    height: 172px;
    maring:.5rem;
  }
  .calendar-icon {
    color: #fff;
    margin: auto;
    padding: 0.5em;
    background: #a489ac;
    outline: none;
    border-radius: 5px;
    display: block;
    justify-content: center;
    font-size: 2.5rem;
    line-height: 4px;
    border: 0;
  }
  .btn-edit {
    position: absolute;
    top: 13px;
    right: 50px;
    border: none;
    //  color: #2dc3ca;
    z-index: 1;
  }
  .btn-tick {
    position: absolute;
    top: 13px;
    right: 100px;
    border: none;
    //  color: #2dc3ca;
    z-index: 1;
  }

  .btn-close {
    //  color: #dc3545;
    position: absolute;
    top: 13px;
    right: 50px;
    border: none;
    z-index: 1;
  }
  .detail-name {
    display: block;
    margin-left: 30px;
    font-weight: bold;
    font-size: 1.8rem;
    color: #727171;
  }
  // .company-details {
  //   position: absolute;
  //   top: 0;
  // }
  .block {
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
  }
  .pd {
    padding-top: 15px;
  }
  .keyword-pad {
    ul {
      border-radius: 5px;
      padding: 10px 5px 0px 5px;
      font-size: 0.75em;
      margin: 0px 10px 0px 0px;
    }
  }
  .keywords {
    padding: 10px 15px;
    margin: 20px 0px 40px 0px;
    font-size: 20px;
  }

  .keyword-pad {
    margin: 0;
  }

  .imgContainer {
    // border-radius: 50%;
    border: 3px solid grey;
    width: 140px;
    height: 140px;
    padding: 1%;

    display: flex;
    justify-content: center;
    flex-direction: column;

    img {
      max-width: 100%;
      //width: 100%;
      // height: 100%;
      // border-radius: 50%;
      //border: 3px solid grey;
    }
  }
  .companyDescription {
    padding-left: 15px;
    margin: 10px 0px 0px 14px;
    width: 100%;
    font-size: 19px;
    p {
      width: 100%;
    }
  }

  .keyword-pad {
    margin: 0;

    ul:not(:first-child) {
      margin-left: 0.5em;
    }
  }
  .block {
    display: block;
    .overview {
      font-weight: bold;
      color: #727171;
    }
  }
  .flex1 {
    display: flex;
    align-items: center;
    margin: 3em 0;
  }
  @media (max-width: 450px) {
    .itemCompanyName {
      font-weight: bold;
      font-size: 12px!important;
    }
  }

  @media (max-width: 764px) {
    .imgContainer {
      width: 100px;
      height: 100px;
    }

    .detail-name {
      font-size: 1.3rem;
      margin-left: 20px;
    }

    .flex {
      display: block;
      padding-right: 0px;
      width: 100%;
    }
    .flex1 span {
      padding-top: 15px;
      font-weight: bold;
    }
  }
`;

const mapStateToProps = (state: AppState) => ({
  user: state.user,
  ui: state.ui
})

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators({
    getCompaniesDetails,
    closeCurrentModal
  },
    dispatch)
}

export default compose(withApollo, connect(mapStateToProps, mapDispatchToProps))(Company)
