import React, { useState, useCallback, useEffect } from 'react'

/** Utils */
import styled from 'styled-components'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch, compose } from 'redux'
import { useQuery } from '@apollo/react-hooks'
import { withApollo } from 'react-apollo'
import ApolloClient from 'apollo-client'
import moment from 'moment'
import { faCalendarCheck, faCalendarTimes, faCheckDouble, faCheck, faTimes, faEllipsisV, faClipboardCheck } from '@fortawesome/free-solid-svg-icons';

/** Store */
import { closeCurrentModal } from '../../store/modal/action'
import { setLoadingOverlay, setNotificationActivityLoading } from '../../store/ui/action'
import { updateUserData } from '../../store/user/action'
import { AppState } from '../../store/root'
import { GET_EVENT_INFO } from '../../gql/queries'
import { getEventNotificationList } from '../../providers/events'
import { eventInvitationUpdate , updateBulkNotifications, updateNotification, eventInviteBulkResponse} from '../../providers/user'

/** Components */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { notification } from 'antd'

interface DispatchProps {
  closeCurrentModal: (type: string) => void
  setLoadingOverlay: (loading: boolean) => void
  setNotificationActivityLoading: (loading: boolean) => void
  updateUserData: (type: object) => void
  // getAllCompanies: () => void
  client: ApolloClient<any>
  getEmployeeCalendar: any
  data: any
  user: any
  ui: any
}

type Props = DispatchProps

export interface NotificationItem {
  id: string;
  name: string;
  description: string;
  start_at: string;
  end_at: string;
  type: string;
  invitationStatus: string;
  notificationStatus: string;
  sender: string;
  created_at: string;
  read: boolean; 
}

const Notification: React.FC<Props> = (props: Props) => {
  const { data: { eventId } }: any = useQuery(GET_EVENT_INFO)

  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [showMenu, setShowMenu] = useState(false);

  const [openDropdownId, setOpenDropdownId] = useState(null); // Track open menu by ID

  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id); // Toggle dropdown based on ID
  };

  
  const fetchNotification = useCallback(async () => {
    try {
      
      setLoading(true)
      // const { data, errors }: any = await getUserNotificationList()
      // if (errors) {
      //   console.log(errors)
      //   return errors
      // }
      if(props.user.userData.notifications){
        const allNotifications: NotificationItem[] = props.user.userData.notifications

        setNotifications(allNotifications)
      } 
      setLoading(false)
  

    } catch (error) {
      console.log(error)
      setNotifications([])
      setLoading(false)


    } finally {
      setLoading(false)
    }
  }, [props.user.userData.notifications])

  const getNotificationText = (notificationType: string) => {
    if (notificationType === 'PLATFORM_EVENT') return 'Event Invitation'
    if (notificationType === 'PLATFORM_EVENT_SLOT') return 'Meeting Invitation'
    if (notificationType === 'PLATFORM_EVENT_PRICING_SLOT') return 'Service'
    return '-'
  }


  const respondToMeeting = (response: string, bookingID: string) => {
    if (response) {
      let status = (bookingID === 'accept') ? `ACCEPTED` : `DECLINED`
      eventInvitationUpdate(response, status)
        .then((response: any) => {
          if (Object.keys(response).length > 0) {
            fetchNotification()
          }
        })
    }
  }
  const updateNotificationStatus = (notificationID: string, type: string, notificationStatus: string) => {

    setNotificationActivityLoading(true)

    updateNotification(notificationID, type, notificationStatus).then((response: any) => {
      if (Object.keys(response).length > 0) {

        const updatedNotifications = [...notifications]; // Create a copy of the notifications array
        const index = updatedNotifications.findIndex(notification => notification.id === notificationID);

        if (index !== -1) {

          if(notificationStatus === "ARCHIVED"){

            updatedNotifications.splice(index, 1);

          } else {
            updatedNotifications[index] = {
              ...updatedNotifications[index],
              notificationStatus: notificationStatus
            };
          }
          
        }
    
        props.updateUserData({...props.user.userData, ...{notifications: updatedNotifications} })
        setNotificationActivityLoading(false)
      }
    }).catch((err: any) => {
      console.log('error', err)
      setNotificationActivityLoading(false)
    })
  }
  const updateNotifications = (notifications: any, notificationStatus: string) => {

   
    
    const updatedNotifications = notifications.map((notification: NotificationItem) => {
      notification.notificationStatus = notificationStatus;
      return notification
    })
    
    

    props.updateUserData({...props.user.userData, ...{notifications: updatedNotifications} })
  }

  const updateBulkNotificationStatus = (notifications: any, notificationStatus: string) => {
    
    setNotificationActivityLoading(true)

    updateBulkNotifications(notifications, notificationStatus).then((response: any) => {
      
      const updatedNotifications = notifications.map((notification: NotificationItem) => {
        notification.notificationStatus = notificationStatus;
        return notification
      })
        
      props.updateUserData({...props.user.userData, ...{notifications: updatedNotifications} })
      setNotificationActivityLoading(false)
    }).catch((err: any) => {
      console.log('error', err)
      setNotificationActivityLoading(false)
    })

  }

  const eventInvitationBulkResponse = (notifications: any, invitationStatus: string) => {
   setNotificationActivityLoading(true)
    let notificationsInvites: any[] = []

    const updatedNotifications = notifications.map((notification: NotificationItem) => {
      if (notification?.invitationStatus == "AWAITING"){
        notification.notificationStatus = "READ";
        notification.invitationStatus = invitationStatus;
        notificationsInvites.push(notification)
      }
      return notification
    })
      
    

    eventInviteBulkResponse(notificationsInvites, invitationStatus).then((response: any) => {
      props.updateUserData({...props.user.userData, ...{notifications: updatedNotifications } })
      setNotificationActivityLoading(false)
    }).catch((err: any) => {
      console.log('error', err)
      setNotificationActivityLoading(false)
    })
  }

  const closeModal = () => {
    props.closeCurrentModal('NOTIFICATION_MODAL')
  }

  useEffect(() => {
    fetchNotification()
  }, [fetchNotification])

  return (
    <StyledNotificationCodeModal className='modal-content'>
      <div className='modal-header'>
        <h4>Notification</h4>
        <button type='button' className='close' onClick={() => closeModal()} aria-label='Close'>
          <span aria-hidden='true'>&times;</span>
        </button>
      </div>
      <div className='modal-body notification-container'>
      {
              (notifications.length > 2) && (
                <div
                    className='row d-flex  py-2 justify-content-around align-items-center '
                  >
                    <button className='btn btn-link' onClick={() => updateBulkNotificationStatus(notifications, "ARCHIVED")}>
                      Clear all notifications</button>

                      <button className='btn btn-link' onClick={() => eventInvitationBulkResponse(notifications, "ACCEPTED")}>
                      Accept all </button>

                    <button className='btn btn-link' onClick={() => updateBulkNotificationStatus(notifications, "READ")}>
                    
                    <FontAwesomeIcon icon={faClipboardCheck} style={{fontSize: "1em"}} />
                    </button>
                </div>
              )
            }
        {
          (loading || (notifications.length === 0 && props.ui.notificationFetching)) ? (
            <div className='d-flex justify-content-center align-items-center' style={{ width: '100%', height: '100%' }}>
              <div className="spinner-border m-5" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : notifications.length === 0 ? (
            <div
              className='d-flex justify-content-center align-items-center'
              style={{ width: '100%', height: '100%' }}
            >
              <p>You have no notifications</p>
              
            </div>
          ) :
          
          notifications.map((item: NotificationItem) => {
            console.log("notifications", item);
            return (

              <div
                key={item.id}
                className='py-2 notification-item'
              >
                <div className="d-flex align-items-center pb-2">
                  <div className='col-10 notification-info align-items-center'>
                    { item.type === 'PLATFORM_EVENT_SLOT' ? 
                    <> 
                     <span className='font-weight-bold'>{item.sender}</span>  has invited you to a <span className='font-weight-bold'>{item.name}</span>, scheduled for <span className='font-weight-bold'>{moment(item.created_at).format('MMM DD, YYYY')} at {moment(item.created_at).format('HH:mm A')}</span>
                    </>
                     : item.type === 'PLATFORM_EVENT' ?
                     <>
                     <span className='font-weight-bold'>{item.sender}</span> invites you to join event  <span className='font-weight-bold'>{item.name}</span> on  <span className='font-weight-bold'>{moment(item.created_at).format('DD MMM YYYY, HH:mm A')}</span>
                     </> :
                    //  <> {item.sender} invites you to {item.name} on {moment(item.created_at).format('DD MMM YYYY, HH:mm A')}</>
                     <> {item.sender} invites you to {item.name} on {moment(item.start_at).format('DD MMM YYYY, HH:mm A')}</>
                  }
                    {/* <div className='row'>
                      <div className='col-12 d-flex' style={{ gap: 5 }}>
                        <div className='notification-time'>
                          {moment(item.created_at).format('DD MMM YYYY, HH:mm A')}
                        </div>
                        <div className='notification-type'>
                          ({getNotificationText(item.type)})
                        </div>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-7 d-flex flex-column'>
                        <div className='notification-name'>{item.name}</div>
                        <div className='notification-description'>{item.description}</div>
                      </div>
                      <div></div>
                      <div className='col-5  d-flex flex-column'>
                        {item.sender && (
                          <>
                            <div className='notification-form-label'>
                              From
                            </div>
                            <div className='notification-form-value'>{item.sender}</div>
                          </>
                        )}
                      </div>
                    </div> */}
                  </div>
                  <div className='col-1 text-center'>
                    {['PLATFORM_EVENT_SLOT', 'PLATFORM_EVENT', 'PLATFORM_EVENT_PRICING_SLOT', 'CALENDAR_EVENT'].includes(item.type) && (
                      <>
                        {item.invitationStatus === 'DECLINED' && (
                          item.type === 'PLATFORM_EVENT' ? (
                            <div className='status-declined text-danger'>
                              <FontAwesomeIcon icon={faTimes} style={{fontSize: "1em"}} />
                            </div>
                          ) : (

                            <div className='status-declined text-danger'>
                              <FontAwesomeIcon icon={faCalendarTimes} style={{fontSize: "1em"}} />
                            </div>
                            
                          )
                          
                          
                        )}
                         {item.invitationStatus === 'ACCEPTED' && (
                            item.type === 'PLATFORM_EVENT' ? (

                              <div className='status-accepted text-success'>
                                <FontAwesomeIcon icon={faCheckDouble} style={{fontSize: "1em"}} />
                              </div>

                            ) :
                            (
                              <div className='status-accepted text-success'>
                                <FontAwesomeIcon icon={faCalendarCheck} style={{fontSize: "1em"}} />
                              </div>
                            )    
                           
                          )}
                        {(item.invitationStatus === 'AWAITING' || item.invitationStatus === 'PENDING') && (
                          <div className="d-flex flex-column justify-content-between">
                            <div>
                              <button className='icon-button text-success' onClick={() => respondToMeeting(item.id, 'accept')}>
                                <FontAwesomeIcon icon='check-circle' style={{fontSize: "1em"}} />
                              </button>
                            </div>
                            <div>
                              <button className='icon-button cancel-button text-danger' onClick={() => respondToMeeting(item.id, 'reject')}>
                                <FontAwesomeIcon icon='times-circle' style={{fontSize: "1em"}}/>
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  <div className="col-1 text-right">
                      <button
                          className="icon-button"
                          onClick={() => toggleDropdown(item.id)}
                          aria-label="..."
                      >
                      <FontAwesomeIcon icon={faEllipsisV} /> {/* Replace with your three-dot icon */}
                    </button>
                    {openDropdownId === item.id && (
                      <div className="dropdown-menu">
                        {item.notificationStatus === "UNREAD" && (
                          <button
                            className="btn btn-link px-2"
                            onClick={() => {
                              updateNotificationStatus(item.id, item.type, 'READ');
                              setOpenDropdownId(null);
                            }}
                          >
                            Mark as read
                          </button>
                        )}
                        <button
                          className="btn btn-link px-2"
                          onClick={() => {
                            updateNotificationStatus(item.id, item.type, 'ARCHIVED');
                            setOpenDropdownId(null);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                    
                  </div>
                </div>

               
              </div>
            )
            // return (
            //   <div key={item.id} className='row d-flex align-items-start py-2 notification-item'>
            //     <div className='col-6 notification-action'>
            //       <div className='row'>
            //         <div className='col-12 d-flex' style={{ gap: 5 }}>
            //           <div className='notification-time'>{moment(item.created_at).format('DD MMM YYYY, HH:mm A')}</div>
            //           <div className='notification-type'>
            //             ({getNotificationText(item.type)})
            //           </div>
            //         </div>
            //       </div>
            //       <div className='d-flex flex-column'>
            //         <div className='notification-name'>{item.name}</div>
            //         <div className='notification-description'>{item.description}</div>
            //       </div>
            //     </div>
            //     <div className='col-3 notification-action'>
            //       {
            //         item.sender && (
            //           <>
            //             <div className='notification-form-label'>From</div>
            //             <div className='notification-form-value'>{item.sender}</div>
            //           </>
            //         )
            //       }
            //     </div>
            //     <div className='col-3 notification-action'>
            //       <div className='d-flex align-items-center justify-content-center'>
            //         {
            //          // (item.type === 'PLATFORM_EVENT_SLOT' || item.type === 'PLATFORM_EVENT') && 
            //            item.status === 'AWAITING' && (
            //             <>
            //               <span>
            //                 <button className='' onClick={() => respondToMeeting(item.id, 'accept')}>
            //                   <FontAwesomeIcon icon='check-circle' size={'2x'} color={"#81D1D0"} />
            //                 </button>
            //               </span>
            //               <span>
            //                 {console.log("item", item.id)}
            //                 <button className='' onClick={() => respondToMeeting(item.id, 'reject')}>
            //                   <FontAwesomeIcon icon='times-circle' size={'2x'} color="red" />
            //                 </button>
            //               </span>
            //             </>
            //           )
            //         }
            //         {
            //           item.type === 'PLATFORM_EVENT_SLOT' && item.status === 'DECLINED' && (
            //             <span className='status-declined'>Declined</span>
            //           )
            //         }
            //         {
            //           (item.type === 'PLATFORM_EVENT_SLOT' || item.type === 'PLATFORM_EVENT') && item.status === 'ACCEPTED' && (
            //             <span className='status-accepted'>Accepted</span>
            //           )
            //         }
            //       </div>
            //     </div>
            //   </div>
            // )
          })
        }
      </div>
    </StyledNotificationCodeModal>
  )
}

const StyledNotificationCodeModal = styled.div`
   @media (max-width: 768px) {
    .wrap {
      flex-wrap: wrap-reverse;
    }
  }

  .notification-container {
    height: 500px;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .notification-item {
    border-bottom: 1px solid #dfdfdf;

    .notification-time {
      font-size: 9px;
      color: grey;
    }
    .notification-type {
      font-size: 9px;
      color: grey;
    }
    .notification-name {
      font-weight: bold;
      font-size: 14px;
    }
    .notification-description {
      font-size: 10px;
      color: grey;
    }
    .notification-form-label {
      font-size: 8px;
      color: grey;
    }
    .notification-form-value {
      font-size: 10px;
    }

    .btn {
      display: inline-block;
      font-weight: 400;
      text-align: center;
      white-space: nowrap;
      vertical-align: middle;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      border: 1px solid transparent;
      padding: .174rem .35rem;
      font-size: .8rem;
      line-height: 1.5;
      border-radius: .25rem;
      transition: color .15s
    }

    .icon-button {
      border: 0;
      background-color: transparent;
      color: #81d1d0;
      font-size: 14px;
      outline: none;
    }

    .cancel-button {
      color: red;
    }

    .button-success {
      color: #fff;
      background-color: #28a745;
      border-color: #28a745;
    }

    .text-success {
      color: #28a745;
    }

    .button-success:hover {
      color: #fff;
      background-color: #218838;
      border-color: #1e7e34;
    }

    .text-danger {
      color: #c82333;
    }

    .button-danger {

      color: #fff;
      background-color: #c82333;
      border-color: #bd2130;
    }

    .invitationStatus-accepted {
      color: green;
      font-size: 10px;
    }
    .invitationStatus-declined {
      color: red;
      font-size: 10px;
    }
    /* Styles for three-dot menu */
  .icon-button {
    background: none;
    border: none;
    color: #333;
    cursor: pointer;
  }


      .dropdown-menu {
      position: absolute;
      left: -55px; /* Aligns the menu to the right */
      background: #fff;
      border: 1px solid #dfdfdf;
      border-radius: 4px;
      box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
      padding: 5px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 100px;
      z-index: 10;
    }

    .dropdown-menu button {
      width: 100%;
      background: none;
      text-align: left;
      color: #333;
      padding: 8px;
      border: none;
      cursor: pointer;
    }

    .dropdown-menu button:hover {
      background-color: #f1f1f1;
    }
    .notification-info {
      width: 100%;
      padding-left: 0;
      padding-right: 0;
      font-size: 0.9rem;
    }

  }
`

const mapStateToProps = function (state: AppState) {
  return {
    userData: state.user.userData,
    ui: state.ui,
    user: state.user
  }
}

const mapDispatchToProps = function (dispatch: Dispatch) {
  return bindActionCreators({
    closeCurrentModal,
    setLoadingOverlay,
    // getAllCompanies
    setNotificationActivityLoading,
    updateUserData,
  }, dispatch)
}
// @TODO change ID here to the actual user's ID
export default compose(withApollo, connect(mapStateToProps, mapDispatchToProps))(Notification)
