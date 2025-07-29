import React, { useState, useMemo, useEffect, useCallback } from 'react'

/** Hooks */
import { useQuery } from '@apollo/react-hooks'

/** Components */
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'
import {
  StyledNotifs,
  HeaderContainer,
  HeaderLeft,
  HeaderRight,
  HeaderTitleMobile,
  NameWrapper,
  LogoWrapper,
} from './components/general'
import ModalContainer from '../../../Modal/ModalContainer'
import LanguagePicker from '../../../LanguagePicker';
// import CompanySwitcher from '../../../CompanySwitcher';

/** Utils */
import moment from 'moment'
import { bindActionCreators, Dispatch, compose } from 'redux'
import { withApollo } from 'react-apollo'
import { connect } from 'react-redux'
import { GET_EVENT_INFO, GET_EVENT } from '../../../../gql/queries'
import CompanySwitcher from '../../../CompanySwitcher'
import {isStaging} from '../../../../util/helper'
/** Request */
import {
  getEmployeeCalendar,
  updateEventOneField,
  updateEventThemeField,
} from '../../../../providers/events'
import { getAvatarUploadToken } from '../../../../providers/user'
import { uploadPresignedS3 } from '../../../../providers/core/common'

/** Store */
import { showModal } from '../../../../store/modal/action'
import {
  setSearchBarShow,
  setSearchBarHide,
  setCurrentSearchText,
  setLoadingOverlay, 
  setNotificationFetchingLoading
} from '../../../../store/ui/action'
import { fetchCarts, updateUserData} from '../../../../store/user/action'

/** Types */
import { Props } from './types'
import { AppState } from '../../../../store/root'
import { InvitationResponse } from '../../Calendar'
import './headerbarstyle.css'
/** Assets */
import logo from '../../../../assets/images/inspired_logo.png'
import profilePlaceholder from '../../../../assets/images/profile_placeholder.png'





const HeaderBar: React.FC<Props> = (props: Props) => {
  const {
    data,
    data: eventData
  }: any = useQuery(GET_EVENT_INFO)


  const cachedData = props.client.readQuery({
    query: GET_EVENT_INFO,
  });



  const {
    eventName,
    theme,
    slug,
    organiser,
    event: { id, name_check, logo_image_check },
  } = eventData;



  const [notificationsOpen, setNotificationOpen] = useState(false)
  const [searchShow, setSearchShow] = useState(false)
  const [notificationArray, setNotificationArray] = useState([])

  const [isEditName, setIsEditName] = useState(false)
  const [eventNameForm, setEventNameForm] = useState(eventName)

  const [isEditPhoto, setIsEditPhoto] = useState(false)
  const [eventPhotoForm, setEventPhotoForm] = useState(theme.logoURL)
  const [eventPhotoFileForm, setEventPhotoFileForm] = useState(null)

  const eventID = useMemo(
    () => window.location.pathname.substring(1).split('/')[0],
    [window.location.pathname]
  )

  const {
    user,
    userData,
    ui,
    setSearchBarShow,
    showModal,
    notifications,
    carts,
    client,
  } = props

  useEffect(() => {
    fetchNotification()
  }, [])

  const getCalendarSchedule = async (companyMembershipID: string) => {

    try {

    let bookingSchedule = []

    if(!companyMembershipID) return;
      // @ts-ignore
      const res: InvitationResponse = await getEmployeeCalendar([
        companyMembershipID,
      ])

      if (res.data && res.data.getEmployeeCalendar.length > 0) {

        let finalBookingArray: any = [];

        res.data.getEmployeeCalendar.forEach((resData: any) => {
          if (resData.eventInvitations.length > 0) {
            bookingSchedule = [...resData.eventInvitations]
              .map((item: any) => ({
                ...item,
                type: item.platformEventSlot ? 'PLATFORM_EVENT_SLOT' : item.platformEventPricingSlot && 'PLATFORM_EVENT_PRICING_SLOT',
                startAt: item.platformEventSlot ? item.platformEventSlot.startAt : item.platformEventPricingSlot && item.platformEventPricingSlot.startAt,
                endAt: item.platformEventSlot ? item.platformEventSlot.endAt : item.platformEventPricingSlot && item.platformEventPricingSlot.endAt,
              }))
              .filter(item => ((item.platformEventSlot !== null || item.platformEventPricingSlot !== null) && item.invitationStatus === 'AWAITING'))
              .sort((a: any, b: any): any => {
                return moment(a.startAt, 'DD/MM/YY HH:mm') > moment(b.startAt, 'DD/MM/YY HH:mm')
              })
        
              finalBookingArray = bookingSchedule
              setNotificationArray(finalBookingArray)
           
          }
        })
      }

      // if (res.data && res.data.getEmployeeCalendar.length > 0) {

      //   res.data.getEmployeeCalendar.forEach((resData: any) => {
      //     if (resData.eventInvitations.length > 0) {
      //       bookingSchedule = [...resData.eventInvitations]
      //         .map((item: any) => ({
      //           ...item,
      //           type: item.platformEventSlot
      //             ? 'PLATFORM_EVENT_SLOT'
      //             : item.platformEventPricingSlot &&
      //             'PLATFORM_EVENT_PRICING_SLOT',
      //           startAt: item.platformEventSlot
      //             ? item.platformEventSlot.startAt
      //             : item.platformEventPricingSlot &&
      //             item.platformEventPricingSlot.startAt,
      //           endAt: item.platformEventSlot
      //             ? item.platformEventSlot.endAt
      //             : item.platformEventPricingSlot &&
      //             item.platformEventPricingSlot.endAt,
      //         }))
      //         .filter(
      //           (item) =>
      //             (item.platformEventSlot !== null ||
      //               item.platformEventPricingSlot !== null) &&
      //             item.invitationStatus === 'AWAITING'
      //         )
      //         .sort((a: any, b: any): any => {
      //           return (
      //             moment(a.startAt, 'DD/MM/YY HH:mm') >
      //             moment(b.startAt, 'DD/MM/YY HH:mm')
      //           )
      //         })
      //       const finalBookingArray = bookingSchedule
      //       setNotificationArray(finalBookingArray)
      //     }
      //   })
      // }

    } catch (error) {
      console.log(error)
    }
  }

  const toggleSearch = () => {
    if (ui.showSearch) {
      setSearchBarShow(false)
    } else {
      setSearchBarShow(true)
    }
  }

  const toggleNotifs = (e: MouseEvent) => {
    e.preventDefault()
    showModal('NOTIFICATION_MODAL', 'lg')
    if (notifications) setNotificationOpen(!notificationsOpen)
  }

  const fetchNotification = () => {

    
  if(typeof(Worker) !== 'undefined'){
    console.log("worker is undefined")
  }
  console.log("Fetching Notifications....")
  const worker = new Worker('/notification.js', {
    name: "notification",
    type: "module",
  });

  // Pass the current URL to the web worker
  worker.postMessage({ type: 'SET_CURRENT_URL', currentUrl: window.origin }); 

  if(typeof(Worker)){
    console.log("worker is defined")
  }

  worker.postMessage({ type: 'FETCH_NOTIFICATIONS', currentUrl: process.env.GRAPHQL_ENDPOINT });
  worker.addEventListener('message', (event) => {

    if(event.data.type === "FETCHING"){
      props.setNotificationFetchingLoading(event.data.fetching)

    }
    
    if(event.data.type === "UPDATE"){

      props.setNotificationFetchingLoading(false)
      if(event.data?.data?.getUserNotificationList){
        const notifications = event.data.data.getUserNotificationList
        if(!props.ui.notificationActivity){
          
          setNotificationArray(notifications)

          props.updateUserData({...props.userData, ...{notifications: notifications} })
        }
      
      }
    }
  
  // Handle the fetched notifications here
});

}

  const updateEventName = useCallback(async () => {
    try {
      await updateEventOneField(id, 'name', eventNameForm)
      client.writeData({
        data: {
          ...data,
          eventName: eventNameForm,
          event: {
            ...data.event,
            name: eventNameForm,
          },
        },
      })
    } catch (error) {
      console.log(error)
    }
  }, [eventNameForm, id, data])

  const updateEventPhoto = useCallback(async (file) => {
    try {
      // const file = eventPhotoFileForm
      const key = file.name
      const result: any = await getAvatarUploadToken(id, key)
      if (result.data.getS3POSTUploadToken) {
        const data = result.data.getS3POSTUploadToken

        // construct the FormData manually for sending to S3
        const formData = new FormData()
        // formData.append('Content-Type', file.type)
        formData.append('Content-Type', file.type)

        // add all the required presigned fields
        Object.entries(data.fields).forEach(([k, v]) => {
          formData.append(k, v as any)
        })

        // add the object key in the bucket (lbi-avatars/USER_ID/image.png)
        // @ts-ignore
        formData.append('key', `event-logo/${id}/${file.name}`)

        // ACL must be public read
        formData.append('acl', 'public-read')

        // and finally add the file itself (this should be last)
        formData.append('file', file)

        const res: any = await uploadPresignedS3(data.url, formData)
        if (res.status !== 204) {
          // TODO: show nice error to user
          console.error('File could not be uploaded to S3')
        } else {
          let previewUrl = `https://user-assets.synkd.life/event-logo/${id}/${file.name}`
          if (previewUrl) {
            setEventPhotoForm(previewUrl)
            const res: any = await updateEventThemeField(id, {
              ...theme,
              logoURL: previewUrl,
            })
            if (res.data.updateEvent.error) {
              return alert(res.data.updateEvent.error)
            }
            client.writeData({
              data: {
                ...data,
                theme: {
                  ...theme,
                  logoURL: previewUrl,
                },
                event: {
                  ...data.event,
                  theme: {
                    ...theme,
                    logoURL: previewUrl,
                  },
                },
              },
            })
          }
        }
      } else {
        alert('Error getting upload token for avatar upload')
      }
    } catch (error) {
      console.log(error)
    }
  }, [eventPhotoFileForm, id, data, event])

  const changePhoto = (e: any) => {
    e.preventDefault()

    let reader = new FileReader()
    let file = e.target.files[0]
    updateEventPhoto(file)
    reader.onloadend = () => {
      setEventPhotoFileForm(file)
      setEventPhotoForm(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const userProfileImage = ():String => {
    if(window.sessionStorage.getItem(`isPersonelProfile-${user.userData.id}`) === 'yes'){
      return user.userData?.avatar
    }
    else{;
      return user.userData.selectedCompanyMembership?.avatar;
    }
  }

  useEffect(() => {
    let companyMembershipID = user.userData.selectedCompanyMembership?.id
    if (organiser) {
      getCalendarSchedule(companyMembershipID)
    }
  }, [organiser])

  useEffect(() => {
    setIsEditName(false)
    setIsEditPhoto(false)
  }, [ui.isEdit])

  useEffect(() => {
    if (isEditName) {
      setEventNameForm(eventName)
    }
  }, [eventName, isEditName])

  return (
    <div>
      <div className="position-relative overflow-hidden">
        <HeaderContainer
          className="navbar navbar-expand-sm navbar-light fixed-top navbar-style borders-style"
          ui={ui}
          theme={theme}
        >
          <HeaderLeft ui={ui} theme={theme}>
            <LogoWrapper ui={ui} theme={theme}>
              {!ui.isViewMode && ui.isEdit && (
                <button
                  // className="btn btn-edit"
                  onClick={() => {
                    // if (isEditPhoto) {ß
                    //   updateEventPhoto()
                    // }
                    // setIsEditPhoto(!isEditPhoto)
                    setEventPhotoForm(null);
                  }}
                >
                  <FontAwesomeIcon
                    icon={isEditPhoto ? 'check' : 'times-circle'}
                    style={{
                      color: 'red',
                      position: 'relative',
                      top: '-15px',
                      left: '120px',
                      backgroundColor: 'white',
                      borderRadius: 25,
                    }}
                  />
                </button>
              )}

              <div className="logo-wrapper">
                {logo_image_check && (
                  <img
                    className="nav-logo-img"
                    alt="Inspired logo"
                    src={eventPhotoForm && eventPhotoForm !== 'undefined' ? eventPhotoForm : logo}
                  />
                )}
                {/* <img
                  className="nav_logo_sml"
                  alt="Inspired logo"
                  src={eventPhotoForm && eventPhotoForm !== 'undefined' ? eventPhotoForm : logo}
                /> */}
              </div>
              {!ui.isViewMode && ui.isEdit && (
                <input id={'logoFileInput'} type="file" style={{ display: 'none' }} onChange={changePhoto} />
              )}
            </LogoWrapper>
            {name_check && (
              <NameWrapper ui={ui} theme={theme}>
                {!ui.isViewMode && ui.isEdit && (
                  <button
                    className="btn btn-edit"
                    onClick={() => {
                      if (isEditName) {
                        updateEventName();
                      }
                      setIsEditName(!isEditName);
                    }}
                  >
                    <FontAwesomeIcon icon={isEditName ? 'check' : 'pencil-alt'} />
                  </button>
                )}
                {isEditName ? (
                  <input
                    type="text"
                    className={'edit-name-input'}
                    value={eventNameForm}
                    onChange={(e) => setEventNameForm(e.target.value)}
                  />
                ) : (
                  <h1 className={'name-wrapper'}>{eventNameForm}</h1>
                )}
              </NameWrapper>
            )}
          </HeaderLeft>

          <HeaderRight className="profile-wrapper" ui={ui} theme={theme}>
            {/* <CompanySwitcher /> */}
            <div>
            <Link className="logo-wrapper" to={`/${eventID}`}>
              <button type="button" className="btn p-1">
                <FontAwesomeIcon icon="home" color="white" />
              </button>
            </Link>
            </div>
    
          <div>  
            {['Companies', 'Contents', 'Attendees'].includes(ui.page) && (
              <button type="button" className="btn p-1" onClick={() => toggleSearch()}>
                <FontAwesomeIcon icon="search" color="white" />
              </button>
            )}
          </div>

          <div>
            <button type="button" className="btn bell p-1" onClick={(e) => toggleNotifs(e as any)}>
              <FontAwesomeIcon icon="bell" color="white" />
              <div className="badge">
              {notificationArray.length > 0 ? 
                notificationArray?.filter((notification => notification.notificationStatus === "UNREAD")).length
               : '0'}
               </div>
            </button>
          </div>

          <div>

            <Link to={`/${slug}/cart`}>
              <button type="button" className="btns p-1" style={{ position: 'relative' }}>
                <FontAwesomeIcon icon={faShoppingCart} color="white" />
                {carts.length > 0 ? (
                  <div className="badge" style={{ left: '1px' }}>
                    {carts.length}
                  </div>
                ) : (
                  ''
                )}
              </button>
            </Link>
                 
          </div>
            
              <img
                src={userProfileImage() || profilePlaceholder}
                style={{
                  height: "2.5rem",
                  width: "2.5rem",
                  borderRadius: "9999px",
                  objectFit: "cover",
                  cursor: "pointer",
                  display: "inline-block"
                }}

              />
      

            <CompanySwitcher event={data.event}/>
            <LanguagePicker />
          </HeaderRight>
          
        </HeaderContainer>
        <StyledNotifs isOpen={notificationsOpen}>
          <span className="close-notifs" onClick={(e) => toggleNotifs(e as any)}>
            <FontAwesomeIcon icon="times" />
          </span>
        </StyledNotifs>

        {/* <HeaderTitleMobile
          className="navbar navbar-expand-sm navbar-light fixed-top navbar-style borders-style"
          ui={ui}
          theme={theme}
        >
          {name_check && <h1>{eventName}</h1>}
        </HeaderTitleMobile> */}
      </div>
      <ModalContainer />
    </div>
  );
}
/**
 * 
 by moving language to the right of switcher (same for desktop)home, search, notifications, cart, avatar, switcher, language



 * 
 */



const mapStateToProps = function (state: AppState) {
  return {
    userData: state.user.userData,
    ui: state.ui,
    user: state.user,
    carts: state.user.carts,
    notifications: state.user.userData.Notifications,
  }
}

const mapDispatchToProps = function (dispatch: Dispatch) {
  return bindActionCreators(
    {
      showModal,
      setSearchBarShow,
      setSearchBarHide,
      setCurrentSearchText,
      fetchCarts,
      setLoadingOverlay,
      updateUserData,
      setNotificationFetchingLoading
    },
    dispatch
  )
}

// export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HeaderBar))
export default compose(
  withApollo,
  connect(mapStateToProps, mapDispatchToProps)
)(HeaderBar)
