import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch, compose } from 'redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { graphql, withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import { AppState } from '../store/root'
import { fetchCarts, session, updateEventInvite,setIsAlreadyRequested } from '../store/user/action'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes } from "@fortawesome/free-solid-svg-icons"
import Loading from './Loading'
import Footer from './Footer'
import LoadingPage from './pages/LoadingPage'
import Login from './pages/Login'
import { UserState } from '../store/user/types'
import { UIState } from '../store/ui/types'
import ApolloClient from 'apollo-client'
import SlugRouting from './SlugRouting'
import styled from 'styled-components'
import Button from './Form/Button'
import { userIsOrganiser } from '../util/common'
import { switchCompany } from '../providers/user'
import { data } from 'jquery'
import { requestToJoinEvent, getEventAttendees, getEventInvitation, getRequestToJoinEventList } from '../providers/events'
import { PAGE_MAPPING, PlatformEventMenuPage } from '../constants/menu';
import { GET_EVENT_INFO } from '../gql/queries';

// const eventID = process.env.TEST_EVENTid || /^\/(\w*)/.exec(window.location.pathname)[1]
// const eventID = /^\/(\w*)/.exec(window.location.pathname)[1]
// const eventID = (window.location.pathname).replace(/^\/|\/$/g, '')
const eventID = window.location.pathname.substring(1).split('/')[0]

interface AppProps { 
  user: UserState,
  ui: UIState,
  data: any // TODO: type this properly
  client: ApolloClient<any>
  notificationsOpen: false,
  notificationArray: [],
  session: (id: string) => void
  fetchCarts: (id: string) => void
  updateEventInvite: (eventId: string, attendeeId: string, status: string) => void
  setIterationCount: (iteration: number) => void
  setIsAlreadyRequested: (status: boolean) => void
}

// interface DispatchProps {
// session: (eventId: string) => void
// }

interface AppState2 {
  sessionDone: boolean
  foundUsersInvitation: any
  isOrganiser: boolean
  requestToJoinApproved: boolean
  checkedRequests: boolean
  reload: boolean
  isAlreadyRequested: boolean
}

type Props = AppProps 

class App extends Component<Props, AppState2> {
  public constructor(props: Props) {

    super(props)

    this.state = {
      sessionDone: false,
      foundUsersInvitation: '',
      requestToJoinApproved: false,
      checkedRequests: false,
      isOrganiser: false,
      reload: false,
      isAlreadyRequested: false,
    }

    this.handleAcceptInvite = this.handleAcceptInvite.bind(this)
    this.handleDeclineInvite = this.handleDeclineInvite.bind(this)
    this.handleEventAttendee = this.handleEventAttendee.bind(this)
    this.handleGetEventInvitation = this.handleGetEventInvitation.bind(this)
    this.handleGetRequestToJoinEvent = this.handleGetRequestToJoinEvent.bind(this)
    this.isOrganiser = this.isOrganiser.bind(this)
  }

  public componentDidMount () {
    
    const { data: {loading, error, getEvent}, client, user } = this.props
    

    window.addEventListener("message", (event) => {
      if (event.data === 'close-iframe') {
        const x = document.getElementsByTagName('iframe')
        for (let idx =0; idx < x.length; idx++) {
          x[idx].remove()
        }
      }
    }, false)

    client.writeData({data: {
      eventId: eventID,
      eventName: '',
      eventType: '',
      description: '',
      organiser: {
        id: '',
        company: {
          id: '',
          currency: '',
          name: '',
          __typename: 'eventOrganiserCompany'
        },
        __typename: "eventOrganiser"
      },
      startTime: '',
      endTime: '',
      status: '',
      slug: '',
      theme: {
        __typename: "eventTheme",
        logoURL: '',
        primaryColour: '',
        secondaryColour: '',
        calendarPrimaryColour: '',
        calendarSecondaryColour: '',
      },
      timezone: '',
      timezoneLocation: '',
      maximumAttendees: 20,
      language: '',
      menus: [],
      menusOrder: [],
      event: {
        __typename: "eventAllTheme",
        id: '',
        _id: '',
        name: '',
        name_check: '',
        slug: '',
        description: '',
        description_check: '',
        startAt: '',
        endAt: '',
        createdAt: '',
        updatedAt: '',
        status: '',
        platformEventType: '',
        theme: {
          __typename: "eventTheme",
          logoURL: '',
          primaryColour: '',
          secondaryColour: '',
          calendarPrimaryColour: '',
          calendarSecondaryColour: '',
        },
        language: '',
        location: '',
        location_check: '',
        timezone: '',
        timezone_check: '',
        timezoneLocation: '',
        maximumAttendees: 20,
        qr_code_url: '',
        qr_code_url_check: '',
        privacy: '',
        privacy_check: '',
        legal: '',
        legal_check: '',
        contact_us: '',
        contact_us_check: '',
        your_data: '',
        your_data_check: '',
        logo_image_check: '',
        header_image: '',
        header_image_check: '',
        left_image: '',
        left_image_check: '',
        right_image: '',
        right_image_check: '',
        attendee_preferences: [],
        company_preferences: [],
        menus: []
      },
    }})

    const queryParams = new URLSearchParams(window.location.search)
    let invitationIDFound = queryParams.get("invitationID")

    if(invitationIDFound){
      this.handleGetEventInvitation()
    } 
  
}

  public componentDidUpdate (prevProps: any) {

    const { data: {loading, error, getEvent}, client, user } = this.props
    // we're doing this in componentDidUpdate because otherwise
    // we don't have a clue what the event ID is until ApolloClient
    // does its thing

    
    if (prevProps.data && prevProps.data.getEvent !== getEvent && getEvent) {

      getEvent.organiser.company.__typename = 'eventOrganiserCompany'
      getEvent._id = getEvent?.id

      getEvent.theme = {
        ...getEvent.theme,
        calendarPrimaryColour: "",
        calendarSecondaryColour: "",
      }


      const mediaQuery = window.matchMedia('(max-width: 576px)')

      if (mediaQuery.matches) {
        if (getEvent.name_check) {
          document.body.style.paddingTop = `${140}px`
        }
      }

      const eventData = {
        eventId: getEvent.id,
        eventName: getEvent.name,
        eventType: getEvent.platformEventType,
        description: getEvent.description,
        organiser: {__typename: "eventOrganiser", ...getEvent.organiser},
        startTime: getEvent.startAt,
        endTime: getEvent.endAt,
        status: getEvent.status,
        slug: getEvent.slug,
        theme: {__typename: "eventTheme", ...getEvent.theme},
        timezone: getEvent.timezone,
        timezoneLocation: getEvent.timezoneLocation,
        maximumAttendees: getEvent.maximumAttendees,
        language: getEvent.language,
        menus: getEvent.menus.map((item: any) => ({
          __typename: item.label,
          ...item,
          link: item?.link,
          userVisible: ((item.type !== PlatformEventMenuPage.HOME) ? (item.userVisible || []).map((uv: any) => {
           return {
            __typename: `user-all-${uv.id}`,
            ...uv
          }}): []),
        userAdmin: ((item.type !== PlatformEventMenuPage.HOME) ? (item.userAdmin || []).map((uv: any) => {
        return {
        __typename: `user-admin-${uv.id}`,
        ...uv
        }}): [])
        })),
        menusOrder: getEvent.menusOrder,
        attendee_preferences: getEvent.attendee_preferences,
        company_preferences: getEvent.company_preferences,
        event: {
          __typename: "eventAll",
          ...getEvent,
          logo_image_check: "",
          theme: {
            __typename: "eventAllTheme",
            ...getEvent.theme
          },
          menus: getEvent.menus.map((item: any) => ({
            __typename: item.label,
            ...item,
            link: item?.link,
            userVisible: ((item.type !== PlatformEventMenuPage.HOME) ? (item.userVisible || []).map((uv: any) => {
             return {
              __typename: `user-all-${uv.id}`,
              ...uv
            }}): []),
            userAdmin: ((item.type !== PlatformEventMenuPage.HOME) ? (item.userAdmin || []).map((uv: any) => {
              return {
              __typename: `user-admin-${uv.id}`,
              ...uv
            }}): [])
          }))
        },
      }

    if (prevProps.data && prevProps.data.getEvent !== getEvent && getEvent) {
      // Transform the event data
      const transformedEvent = {
        eventId: getEvent.id,
        eventName: getEvent.name,
        eventType: getEvent.platformEventType,
        description: getEvent.description,
        startTime: getEvent.startAt,
        endTime: getEvent.endAt,
        status: getEvent.status,
        slug: getEvent.slug,
        menus: getEvent.menus.map((item: any) => ({
          __typename: item.label,
          ...item,
          userVisible:
            item.type !== PlatformEventMenuPage.HOME
              ? (item.userVisible || []).map((uv: any) => ({
                  __typename: `user-all-${uv.id}`,
                  ...uv,
                }))
              : [],
          userAdmin:
            item.type !== PlatformEventMenuPage.HOME
              ? (item.userAdmin || []).map((uv: any) => ({
                  __typename: `user-admin-${uv.id}`,
                  ...uv,
                }))
              : [],
        })),
        menusOrder: getEvent.menusOrder,
        organiser: {
          __typename: "eventOrganiser",
          ...getEvent.organiser,
          company: {
            __typename: "eventOrganiserCompany",
            ...getEvent.organiser.company,
          },
        },
        theme: {
          __typename: "eventTheme",
          ...getEvent.theme,
          calendarPrimaryColour: "",
          calendarSecondaryColour: "",
        },
        timezone: getEvent.timezone,
        timezoneLocation: getEvent.timezoneLocation,
        maximumAttendees: getEvent.maximumAttendees,
        language: getEvent.language,
        event: {
          __typename: "Event",
          ...getEvent,
          logo_image_check: "",
          theme: {
            __typename: "eventTheme",
            ...getEvent.theme,
          },
          menus: getEvent.menus.map((item: any) => ({
            __typename: item.label,
            ...item,
            userVisible:
              item.type !== PlatformEventMenuPage.HOME
                ? (item.userVisible || []).map((uv: any) => ({
                    __typename: `user-all-${uv.id}`,
                    ...uv,
                  }))
                : [],
            userAdmin:
              item.type !== PlatformEventMenuPage.HOME
                ? (item.userAdmin || []).map((uv: any) => ({
                    __typename: `user-admin-${uv.id}`,
                    ...uv,
                  }))
                : [],
          })),
        },
      };
    


      try {
        
        // Write the transformed data to the cache
        client.writeQuery({
          query: GET_EVENT_INFO,
          data: {
            eventId: getEvent.id, // Populate client-only field
            eventName: getEvent.name, // Populate client-only field
            ...transformedEvent,
          },
        });
        
      } catch (error) {
        console.error("Caching event data failed: ", error.message);
      }
    }


      //client.clearStore()
      // Write event info to cache
      // try {
      //   client.writeData({data: eventData})
      // } catch (error) {
      //   console.log("caching event data failed: ", error.message)
      // }
      
    }

    if (getEvent && !this.state.sessionDone) {

      if (Object.keys(user.companyData).length > 0) {

        let isOrganiser = userIsOrganiser(user, getEvent.organiser)

        this.setState({
          isOrganiser: isOrganiser
        })

      }

      this.setState({
        sessionDone: true,
      })
     
      this.props.session(getEvent.id)
      this.props.fetchCarts(getEvent.id)
    }
  }

  public handleAcceptInvite () {
    
    const { data: {getEvent} } = this.props
    const { isEventAttendee } = this.props.user
    if (this.state.foundUsersInvitation.invitationStatus){

      this.props.updateEventInvite(getEvent.id, this.state.foundUsersInvitation.id, "ACCEPTED")
    } else {

      this.props.updateEventInvite(getEvent.id, isEventAttendee[0].id, "ACCEPTED")
    }
  }

  public handleDeclineInvite () {
    
    const { data: {getEvent} } = this.props
    const { isEventAttendee } = this.props.user
    if (this.state.foundUsersInvitation.invitationStatus){
      this.props.updateEventInvite(getEvent.id, this.state.foundUsersInvitation.id, "DECLINED")
    } else {

      this.props.updateEventInvite(getEvent.id, isEventAttendee[0].id, "DECLINED")
    }
  }

  public handleGetEventInvitation () {

    const queryParams = new URLSearchParams(window.location.search)
    let invitationIDFound = queryParams.get("invitationID")
    let invitationID = invitationIDFound

     getEventInvitation(invitationID)
      .then(async (response : any) => {
        if (response.data) {
          let foundUsersInvitation = response.data.getEventInvitation
          
           this.setState({
            foundUsersInvitation: foundUsersInvitation
          })

        } else {
        }
      })
      .catch((err) => {
      })
  
  }
    
  public handleGetRequestToJoinEvent () { 

    const { data: {getEvent} } = this.props

    try { 
      getRequestToJoinEventList(getEvent.id)
      .then((res: any) => {
        let userIsRequester = res.data.getRequestToJoinEventList.find((item: any) => item.requester.id === this.props.user.userData.id)
      let userRequestStatus = userIsRequester.status
      if (userRequestStatus === "ACCEPTED"){

      this.setState({
        requestToJoinApproved: true
      })
      
    } else {
    }
  })
     }
     catch(err){
    }
  }

  public handleEventAttendee () {

    const { data: {getEvent} } = this.props

  

    const { isEventAttendee, companyData, isAlreadyRequested} = this.props.user

    

    const hasAttendees = isEventAttendee.length > 0
   
    const foundAttendee = hasAttendees  && isEventAttendee //.find((att: any) => att.invitee.company.id === companyData.id) 

            
    if (foundAttendee && !this.state.foundUsersInvitation.invitationStatus) {
      // User has invitations for this event
      var Awaiting = foundAttendee[0].invitationStatus === 'AWAITING'
      var Declined = foundAttendee[0].invitationStatus === 'DECLINED'
      var Accepted = foundAttendee[0].invitationStatus === 'ACCEPTED'
      var Archived = foundAttendee[0].invitationStatus === 'ARCHIVED'
      
      
      // company as the user is switched to
      const eventOrganiserCompany = getEvent.organiser?.company?.name || '-'
      const eventOrganiser = getEvent.organiser?.user?.firstName || getEvent.organiser?.user?.lastName 
        // User is currently switched to the same company as the invitation
        if (Awaiting) {
          // user has been invited and hasn't actioned it yet
          return <LoadingPage>
            <StyledInviteScreen>
              <p>You have been invited to <strong>{getEvent.name}</strong> by <strong>{eventOrganiser}</strong> from <strong>{eventOrganiserCompany}</strong>.<br />
                Would you like to accept?</p>           
              <div className="button-container">
                <button
                  type="submit" 
                  className="btn-primary btn-tick btn-purple btn"
                  onClick={this.handleAcceptInvite}
                >
                  <FontAwesomeIcon icon="check" />
                </button>
                <button
                  type="submit"
                  className="btn btn-danger btn-close"
                  onClick={this.handleDeclineInvite}  >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
  
            </StyledInviteScreen>
          </LoadingPage>
        } else if (Declined) {
          // user declined their last invite
          return <LoadingPage text="You declined an invitation to join this event. You should ask the organiser for another invitation." />
        } else if (Archived) {
          return <LoadingPage text="You do not have access to this event." />
        } 
        
        if (Accepted){
          return <Route path='/' component={SlugRouting} />
        } else if (!Accepted && !Declined && !Awaiting && !Archived) {
          return <LoadingPage text="An Error has Occured, Please check the link and try again" />
        }

    } else if(this.state.foundUsersInvitation.invitationStatus){
   
        var Declined = this.state.foundUsersInvitation.invitationStatus === 'DECLINED'
        var Awaiting = this.state.foundUsersInvitation.invitationStatus === 'AWAITING'
        var Accepted = this.state.foundUsersInvitation.invitationStatus === 'ACCEPTED'
        var Archived = this.state.foundUsersInvitation.invitationStatus === 'ARCHIVED'
        
        // company as the user is switched to
        const eventOrganiserCompany = getEvent.organiser?.company?.name || '-'
        const eventOrganiser = getEvent.organiser?.user?.firstName || getEvent.organiser?.user?.lastName 
          // User is currently switched to the same company as the invitation
          if (Awaiting) {
            // user has been invited and hasn't actioned it yet
            return <LoadingPage>
              <StyledInviteScreen>
                <p>You have been invited to <strong>{getEvent.name}</strong> by <strong>{eventOrganiser}</strong> from <strong>{eventOrganiserCompany}</strong>.<br />
                  Would you like to accept?</p>           
                <div className="button-container">
                  <button
                    type="submit" 
                    className="btn-primary btn-tick btn-purple btn"
                    onClick={this.handleAcceptInvite}
                  >
                    <FontAwesomeIcon icon="check" />
                  </button>
                  <button
                    type="submit"
                    className="btn btn-danger btn-close"
                    onClick={this.handleDeclineInvite}  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
    
              </StyledInviteScreen>
            </LoadingPage>
          } else if (Declined) {
            // user declined their last invite
            return <LoadingPage text="You declined an invitation to join this event. You should ask the organiser for another invitation." />
          } else if (Archived) {
            return <LoadingPage text="You do not have access to this event." />
          } 
          
          if (Accepted){
            return <Route path='/' component={SlugRouting} />
          } else if (!Accepted && !Declined && !Awaiting && !Archived) {
            return <LoadingPage text="An Error has Occured, Please check the link and try again" />
          }
        
    }
    else {
      if (!this.state.requestToJoinApproved && !this.state.checkedRequests) {
    this.handleGetRequestToJoinEvent()
    this.setState({
      checkedRequests : true
      })
  }
     if (this.state.requestToJoinApproved) {
      return <Route path='/' component={SlugRouting} />
     } else {
      
      // User does not have invitations or an accepted request for this event
      return <LoadingPage text="You do not have access to this event." extra={(
        <div style={{
          display: 'flex',
          gap: '20px'
        }}>
          {
            hasAttendees ? <button
              className="btn-primary btn-tick btn"
              style={{
                backgroundColor: '#fff',
                color: '#A588AC',
                border: '1px solid #A588AC'
              }}
              type="button"
              onClick={() => {

                switchCompany(isEventAttendee[0].invitee.company.id, isEventAttendee[0].invitee.company.id, getEvent.id)
                  .then((res: any) => {
                    
                  // After switching companies, set the state to reload the component
                    window.location.reload()
                  })
              }}
            >
            Switch
            </button> : ''
          }
          <button
            className="btn-primary btn-tick btn-purple btn"
            type="button"
            disabled={isAlreadyRequested}
            onClick={async () => {

              const res: any = await requestToJoinEvent({
                eventId: getEvent.id,
                user: this.props.user.userData.id,
                companyMembership: this.props.user.userData.selectedCompanyMembership?.id
              })

              if (res.data) {

                this.props.setIsAlreadyRequested(true)
                alert('Request To Join Sent')

              }
            }}
          >
            {isAlreadyRequested ? 'Already Requested' : 'Request to Join'}
          </button>
        </div>
      )} />
    }
    }
  }

  public isOrganiser () {
    return <Route path='/' component={SlugRouting} />
  }

  public render () {
    const { data: {loading, error, getEvent}, client } = this.props
    const { isSessionPending, isLoggedIn, isEventAttendee } = this.props.user
    const { isOrganiser } = this.state

    // Check result from initial API call
    if (loading) return <LoadingPage text="Loading event data..." />
    if (eventID === '') return <LoadingPage text="To access an event, you should use the exact link given to you by the event organiser. If you are the event organiser, check the marketing platform to find your event's link." />
    if (error) return <LoadingPage text="There was an error loading the data for this event. Check the URL and try again." />

    // Set page title to event name
    document.title = getEvent.name

    return (
      <Router>
        {
          isSessionPending ? <Loading isParentloading /> : // Show loading while we check their cookies
            (
              isLoggedIn ? (
                isOrganiser ? this.isOrganiser() : ( // If logged in, first check organiser status, then event attendee if not an organiser
                  isEventAttendee ? this.handleEventAttendee() : <div>
                    <Route path='/' render={() => {
                      return <LoadingPage text="This event is invite-only. Please ask the organiser to send you an invitation." />
                    }} />
                  </div>
                ) // Show "This event is invite-only" page if not organiser or attendee
              ) : <div>
                <Route path='/' component={Login} />
                <Footer />
              </div>
            ) // If not logged in, show login screen
        }
      </Router>
    )
  }
}

const mapStateToProps = (state: AppState) => ({
  user: state.user,
  ui: state.ui
})

const mapDispatchToProps = function(dispatch: Dispatch) {
  return bindActionCreators(
    {
      session,
      updateEventInvite,
      fetchCarts,
      setIsAlreadyRequested
    },
    dispatch
  )
}

const StyledInviteScreen = styled.div`
  button {
    display: inline-block !important;
  }
  .button-container {
    display: flex;
    justify-content: center;
    gap: 0.5em;
    .btn-tick {
      padding: 0.5em 0.55em;
      border: none;
    }
  }
  .declinebtn {
    margin-left: 1em;
  }

  .invite-warning {
    margin-top: 1rem;
    font-size: .75em;
  }
`

export default compose(withApollo, graphql(gql`
  {
    getEvent(data: {
      slug: "${eventID}",
      eventType: PLATFORM_EVENT
    })
  }
`), connect(mapStateToProps, mapDispatchToProps))(App)