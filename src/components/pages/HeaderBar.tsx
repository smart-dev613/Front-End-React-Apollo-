import React, { Component, MouseEvent } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch, compose } from 'redux'
import { AppState } from '../../store/root'
import { showModal } from '../../store/modal/action'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ShowModal } from '../../store/modal/types'
import { UIState } from '../../store/ui/types'
import Button from '../Form/Button'
import moment from 'moment';

import { GET_EVENT_INFO } from '../../gql/queries'
import { withApollo } from 'react-apollo'
import ApolloClient from 'apollo-client'
import { getEmployeeCalendar } from '../../providers/events'
import { InvitationResponse, Invitation, EventInvitations } from '../pages/Calendar'
import store from './../../store/createStore'

import ModalContainer from '../Modal/ModalContainer'
import LanguagePicker from '../LanguagePicker'
import CompanySwitcher from '../CompanySwitcher'
import { UserState } from '../../store/user/types'
// import NotifB from '../assets/images/icons/NotifB.png'
import logo from '../../assets/images/inspired_logo.png'
import { setSearchBarShow,setSearchBarHide,setCurrentSearchText } from "../../store/ui/action"

interface StateProps {
  notifications: string[]
  ProfileAvatar: string
  firstName: string
  lastName: string
  // history: History
  client: ApolloClient<any>
}

interface CurrentCompany {
  company: CompanyInformation
  id: string
  role: string
}

interface CompanyInformation {
  address: object
  _id: string | number
  name: string
  email: string
  currency: string
}

interface DispatchProps {
  showModal: ShowModal
  ui: UIState
  user: UserState
  setSearchBarShow: (showSearch: boolean) => void
  setSearchBarHide: (showSearch: boolean) => void
}

type Props = StateProps & DispatchProps

interface HeaderState {
  notificationsOpen: boolean
  profilePlaceHolder: string
  searchShow: boolean
  theme: {
    secondaryColour?: string
    logoURL?: string
  }
  slug: string,
  notificationArray: any[]
}

const eventID = window.location.pathname.substring(1).split('/')[0]

class HeaderBar extends Component<Props, HeaderState> {
  public constructor (props: Props) {
    super(props)
    this.state = {
      profilePlaceHolder: 'https://placehold.it/60x60',
      notificationsOpen: false,
      searchShow: false,
      theme: {},
      slug: '',
      notificationArray: []
    }
    // this.notificationsOptions = this.notificationsOptions.bind(this)
    this.toggleNotifs = this.toggleNotifs.bind(this)
    this.toggleQrCodeModal = this.toggleQrCodeModal.bind(this)
    this.toggleSearch = this.toggleSearch.bind(this)
    this.handleBack = this.handleBack.bind(this)
    this.handleForward = this.handleForward.bind(this)
  }

  public componentDidMount() {
    const { event: { theme, slug, organiser } } = this.props.client.readQuery({query: GET_EVENT_INFO})
    // console.log('theme', theme)
    this.setState({ theme, slug })
    const state = store.getState();
    let memId = state.user.userData.selectedCompanyMembership?.id;
    if (organiser) {
      this.getCalendarSchedule(memId)
    }
  }


  public getCalendarSchedule (companyMembershipID: string) {
    let bookingSchedule = []
    
    getEmployeeCalendar([companyMembershipID]).then((res: InvitationResponse) => {
      if (res.data && res.data.getEmployeeCalendar.length > 0) {
        res.data.getEmployeeCalendar.forEach((resData: any) => {
          if (resData.eventInvitations.length > 0) {
            bookingSchedule = [...resData.eventInvitations]
            bookingSchedule.sort((a: any, b: any): any => {
              if(a.platformEventSlot  && b.platformEventSlot){
                return moment(a.platformEventSlot.startAt, 'DD/MM/YY HH:mm') > moment(b.platformEventSlot.startAt, 'DD/MM/YY HH:mm')
              }
            })
            const finalBookingArray = bookingSchedule.filter(item => (item.platformEventSlot !== null && item.invitationStatus === 'AWAITING'))
            this.setState({
              notificationArray: finalBookingArray,
            })
          }
        })
      }
    })
  }

  public toggleSearch = () => {
    if(!this.props.ui.showSearch){
      this.props.setSearchBarShow(true);
    } else{
      this.props.setSearchBarHide(false);
    }
    this.setState({ searchShow: !this.state.searchShow });
  };

  public toggleNotifs (e: MouseEvent) {
    e.preventDefault()
    this.props.showModal('NOTIFICATION_MODAL', 'lg')
    if (this.props.notifications) {
      this.setState({
        notificationsOpen: !this.state.notificationsOpen
      })
    }
  }

  public toggleQrCodeModal () {
    this.props.showModal('QR_CODE', 'lg')
  }

  public handleBack = () => {
    // this.props.history.goBack()
  }

  public handleForward = () => {
    // console.log(this.props.history)
    // this.props.history.go(+1)
  }

  public render() {

    let currentCompany: CurrentCompany
    if (this.props.user.allCompanies.length > 0) {
      console.log("Track companyData: ", this.props.user.companyData)
      currentCompany = this.props.user.allCompanies.find(ele => {
        return ele.company.id === this.props.user.companyData.id
      })
    }
    // console.log('currentCompany', currentCompany)

    const { notificationsOpen } = this.state
    //const { brandLogo } = this.props.ui
    return (
     
      <div>
        <div className="position-relative overflow-hidden">
          <StyledNav
            className="navbar navbar-expand-sm navbar-light fixed-top navbar-style borders-style"
            ui={this.props.ui}
            theme={this.state.theme}
          >
            <Link className="logo-wrapper" to={`/${this.state.slug}/`}>
              <img
                src={this.state.theme.logoURL !== 'undefined' ? this.state.theme.logoURL : logo}
                alt="Inspired logo"
                className="nav_logo_sml"
              />
            </Link>
            {/* <img src={logo} alt='Inspired logo' className='nav_logo' /> */}

            <span className="profile-wrapper">
              <CompanySwitcher event={event}/>
              <button type="button" className="btn p-1" onClick={this.toggleSearch}>
                <FontAwesomeIcon icon="search" color="white" /> 
              </button>
              <Link className="logo-wrapper" to={`/${eventID}`}>
                <button type="button" className="btn p-1">
                  <FontAwesomeIcon icon="home" color="white" size={"lg"} />
                </button>
              </Link>
              {/* <span className='search'>
                <button type='button' className='btn' onClick={this.toggleSearch}>
                  <FontAwesomeIcon icon='search' color='#757575' />
                </button>
              </span> */}
              {/* <StyledInput placeholder='search'/> */}
              {/* <button type='button' className='btn qrcode' onClick={this.toggleQrCodeModal}>
                <FontAwesomeIcon icon='qrcode' />
              </button> */}
              <button type="button" className="btn bell p-1" onClick={this.toggleNotifs}>
                <FontAwesomeIcon icon="bell" color="white" />
                <div className="badge">{this.state.notificationArray.length}</div>
              </button>
              {/* <LanguagePicker /> */}
              <Link to="/profile" className="profile-container">
              helloo
                <img
                  src={
                    this.props.ProfileAvatar === 'https://placehold.it/60x60'
                      ? this.state.profilePlaceHolder
                      : this.props.ProfileAvatar
                  }
                />
                <span className="user-firstname">{this.props.firstName}</span>
              </Link>
              <LanguagePicker />
            </span>
          </StyledNav>
          <StyledNotifs isOpen={notificationsOpen}>
            <span className="close-notifs" onClick={this.toggleNotifs}>
              <FontAwesomeIcon icon="times" />
            </span>
          </StyledNotifs>
          <StyledNavMobile ui={this.props.ui}>
            <div className="col-sm-10 mobile-devices-nav">
              <span className="navigator-btn-left" onClick={this.handleBack}>
                <FontAwesomeIcon icon="chevron-left" />
              </span>
              &nbsp;
              <span className="navigator-btn-right" onClick={this.handleForward}>
                <FontAwesomeIcon icon="chevron-right" />
              </span>
            </div>
          </StyledNavMobile>
        </div>
        <ModalContainer />
      </div>
    );
  }
}

const StyledNavMobile = styled.nav<{ui: UIState}>`
  
  .mobile-devices-nav {
    background-color: #81D1D0;
    display: none;
  }

  .search-input {
    margin: 40px 10px 0px 10px;
  }

  .navigator-btn-left {
    float: left;
    color: white;
  }

  .navigator-btn-right {
    float: right;
    color: white;
  }


`

/*masthead by moving language to the right of switcher (same for desktop)home, search, notifications, cart, avatar, switcher, language*/

const StyledNav = styled.nav<{ui: UIState}>`
  /* background: ${props => (props.theme && props.theme.primaryColour) ? props.theme.primaryColour : '#092935'}; */
  background-color:${props => (props.theme && props.theme.primaryColour) ? props.theme.primaryColour : '#092935'}; //use the selected primary color for the headerbar's background color
  // padding: 0 20px;
  margin: 0;
  justify-content: flex-start;
  box-shadow: 1px 3px 20px -8px rgba(0,0,0,0.3);
  height: 70px;

  @media only screen and (min-width: 360px) and (max-width: 449px) {
    padding:0!important;
    box-shadow: none!important;
    gap:0!important;
  }

  @media only screen and(min-width:450px){
    box-shadow: none!important;
  }

  .borders-style{
    box-shadow: 1px 3px 20px -8px rgba(0,0,0,0.3);
  }

  .companySelect {
    font-size: .75em;
    margin-right: 1em;
  }
  
  .logo-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .search {
    -webkit-transition: all .5s ease;
    -moz-transition: all .5s ease;
    -o-transition: all .5s ease;
    transition: all .5s ease;
    position: relative;
    left: 0px;
  }

  .search-text {
    margin-left: 5px;
    color: #fff;
  }

  .home-icon {
    margin: 0px 5px;
  }

  .placeholdericon {
    font-family: 'robotoregular', FontAwesome;
  }

  .profile-container{
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        background-color: white;
        padding: 0.25em 1em;
        border-radius: .5em;
      }
      .user-firstname{
        display: inline;
        color: black;
        text-decoration: none;
        padding-left: 0.5em;
        font-size: 14px;
    } 

  @media only screen and (min-width: 576px) {
    .nav_logo {
      transform: scaleX(1);
      opacity: 1;
    }

    .mobile-devices-nav {		
      display: none;		
    }
  }

  .nav_logo_sml {
    width: 45px;
    max-width: 45px;
    max-height: 45px;
  }

  .profile-wrapper {
    margin-left: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    margin-right: 0.5rem;

    @media only screen and (max-width:350px){
      gap: 0px!important;
    }

    .qrcode {
      margin-right: 5px;
      -webkit-transition: all .5s ease;
      -moz-transition: all .5s ease;
      -o-transition: all .5s ease;
      transition: all .5s ease;
      opacity: 0;
      visibility: hidden;
      color: #757575;
      
      &:hover {
        color: #212529;
      }
    }
    
    .bell {
      margin-right: 5px;
      -webkit-transition: all .5s ease;
      -moz-transition: all .5s ease;
      -o-transition: all .5s ease;
      transition: all .5s ease;
      color: #757575;
      z-index: 1;
      
      &:hover {
        color: #212529;
      }

    }

    .badge {
      background-color: #2DC3CA;
      position: relative;
      top: -12px;
      left: -15px;
      -webkit-transition: all .5s ease;
      -moz-transition: all .5s ease;
      -o-transition: all .5s ease;
      transition: all .5s ease;
    }

    @media only screen and (max-width: 576px) {
      .qrcode {
        opacity: 1;
        visibility: visible;
      }
      .bell {
        margin-right: 0;
      }
      .badge {
        left: -10px;
      }

      .mobile-devices-nav{		
        display: block;		
      }
    }

    img {
      padding: 0;
      border: none;
      height: 30px;
      width: 30px;
      object-fit: cover;
      border-radius: 50%;
    }  

  .mobile-devices-nav {
    margin-bottom: 20px;
  }
}
`

const StyledNotifs = styled.div<{isOpen: boolean}>`
  position: fixed;
  top: 59px;
  right: 60px;
  /* right: ${props => props.isOpen ? '60px' : '-100%'}; */
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  opacity: ${props => props.isOpen ? '1' : '0'};
  background-color: red;
  height: 200px;
  width: 200px;
  z-index: 2;
  -webkit-transition: all .5s ease;
  -moz-transition: all .5s ease;
  -o-transition: all .5s ease;
  transition: all .5s ease;
  // box-shadow: 1px 2px 5px 0px rgba(0,0,0,0.4);

  @media only screen and (max-width: 576px) {
    top: 54px;
    right: 0px;
    background-color: blue;
    height: calc(100% - 54px);
    width: 100%;
    box-shadow: 1px 2px 5px 0px rgba(0,0,0,0.4);
  }

  .close-notifs {
    color: #fff;
    height: 30px;
    width: 30px;
    cursor: pointer;
  }
`

const mapStateToProps = function (state: AppState) {
  return {
    ProfileAvatar: state.user.userData.avatar,
    firstName: state.user.userData.firstName,
    lastName: state.user.userData.lastName,
    ui: state.ui,
    user: state.user
  }
}

const mapDispatchToProps = function (dispatch: Dispatch) {
  return bindActionCreators(
    {
      showModal,
      setSearchBarShow,
      setSearchBarHide,
      setCurrentSearchText
    },
    dispatch
  )
}

// export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HeaderBar))
export default compose(withApollo, connect(mapStateToProps, mapDispatchToProps))(HeaderBar)
