import React, { Component } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch, compose } from 'redux'
import { closeCurrentModal } from '../../store/modal/action'
import { setLoadingOverlay } from '../../store/ui/action'
import ModalFooter from './ModalFooter'
import { Translation, Trans } from 'react-i18next'
import NotesListFormat from '../pages/NotesListFormat'
import { graphql, withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import ApolloClient from 'apollo-client'
import { getEmployeeCalendar, getAllEventContents } from '../../providers/events'
import { InvitationResponse, Invitation, EventInvitations } from '../pages/Calendar'
import moment from 'moment'
import { GET_EVENT_INFO } from '../../gql/queries'
import { eventInvitationUpdate } from '../../providers/user'
import store from './../../store/createStore'
import { AppState } from '../../store/root';

interface DispatchProps {
  closeCurrentModal: (type: string) => void
  setLoadingOverlay: (loading: boolean) => void
  // getAllCompanies: () => void
  client: ApolloClient<any>
  getEmployeeCalendar: any
  data: any
  user: any
}

type Props = DispatchProps

interface NotificationState {
  companyName: string
  companyUrl: string
  companyEmail: string
  formFieldErrors: string[]
  formErrorMsg: string
  notificationArray: EventInvitations[],
  contentArray: any[],
  companyMembershipID: string
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

class Notification extends Component<Props, NotificationState> {
  public constructor (props: Props) {
    super(props)

    this.state = {
      companyName: null,
      companyUrl: null,
      companyEmail: null,
      formFieldErrors: [],
      formErrorMsg: null,
      // notificationArray: [
      //   {id: 1, name: 'IBM', event: 'Meeting', person: 'John Stark', location: 'MVC', time: '10 am', date: '15th Oct'},
      //   {id: 2, name: 'Google', event: 'Meeting', person: 'Jimmy Stone', location: 'Booth', time: '12 am', date: '15th Oct'},
      //   {id: 3, name: 'James', event: 'Birthday', person: 'James Richard', location: 'Cafe', time: '7 pm', date: '16th Oct'},
      //   {id: 4, name: 'Salon', event: 'Hair & SPA', person: 'Jimmy', location: 'Boutique', time: '6 pm', date: '15th Oct'}
      // ]
      notificationArray:[],
      contentArray: [],
      companyMembershipID: ''
    }

    this.closeModal = this.closeModal.bind(this)
    this.getCalendarSchedule = this.getCalendarSchedule.bind(this)
    this.respondToMeeting = this.respondToMeeting.bind(this)
  }

  componentDidMount () {
    const { eventId, organiser } = this.props.client.readQuery({query: GET_EVENT_INFO})
    const state = store.getState();
    let memId = state.user.userData.selectedCompanyMembership?.id;
    if (organiser) {
      this.setState({
        companyMembershipID: memId
      }, () => {
        this.getCalendarSchedule(this.state.companyMembershipID)
        this.getArticles(eventId)
      })
    }

  }

  public getCalendarSchedule (companyMembershipID: string) {
    let bookingSchedule = []
    
    getEmployeeCalendar([companyMembershipID]).then((res: InvitationResponse) => {
      if (res.data && res.data.getEmployeeCalendar.length > 0) {
        res.data.getEmployeeCalendar.forEach((resData) => {
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
            const finalBookingArray = bookingSchedule
            
            // if (finalBookingArray.length > 0) {
              this.setState({
                notificationArray: finalBookingArray,
                // companyName: this.state.executiveData.companyName,
                // companyMembershipID: this.state.executiveData.companyMembershipID,
                // personName: (this.state.executiveData.firstName + ' ' + this.state.executiveData.lastName),
                // personID: this.state.executiveData.id
              })
            // } 
            // else {
            //   this.setState({
            //     companyName: this.state.executiveData.companyName,
            //     companyMembershipID: this.state.executiveData.companyMembershipID,
            //     personName: (this.state.executiveData.firstName + ' ' + this.state.executiveData.lastName),
            //     personID: this.state.executiveData.id
            //   }, () => this.getBookingSchedule())
            // }
          }
        })
      }
    })
  }


  public getArticles(eventId: string) {
    getAllEventContents(eventId)
      .then((response: any) => {
        let contents = [];
        if (response.data && response.data.getAllEventContents) {
          contents = response.data.getAllEventContents.contents.map(
            (content: any) => {
              return {
                ...content,
                id: content.id,
                logoUrl: content.imageURL,
                bio: content.body,
                linkURL: content.linkURL,
                keywords: content.keywords ? content.keywords : [],
                name: content.name,
                type: "content",
              };
            }
          );
        }
        contents.reverse();
        this.setState({
          contentArray: contents,
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  public closeModal () {
    this.props.closeCurrentModal('NOTIFICATION_MODAL')
  }

  // public acceptInvite = () => {
  //   console.log('accept invite')
  // }

  // public rejectInvite = () => {
  //   console.log('reject invite')
  // }

  public respondToMeeting (response: string, bookingID: string) {
    if (response) {
      // let bookingID = this.props.info.additionalData.bookingSlot.platformEventSlot.id
      let status = (response === 'accept') ? `ACCEPTED` : `DECLINED`
      eventInvitationUpdate(bookingID, status)
        .then((response: any) => {
          if (Object.keys(response).length > 0) {
            this.getCalendarSchedule(this.state.companyMembershipID)
            // this.setState({
            //   invitationStatus: response.data.respondToInvite.invitationStatus
            // })
          }
        })
    }
  }

  public render() {
    const { formFieldErrors, formErrorMsg } = this.state
    // const { data: {loading, error}, getEmployeeCalendar, client } = this.props
    let status = ''
    // console.log('filteredData', getEmployeeCalendar)
    const filteredData: any = []
    if (this.state.notificationArray.length > 0) {
      status = 'loading ...'
      this.state.notificationArray.forEach((ele: any) => { // @TODO fix this to use real data
        if (ele.type === 'PLATFORM_EVENT_SLOT') {
          filteredData.push({
            id: ele.id,
            name: ele.platformEventSlot.name,
            event: ele.platformEventSlot.venue.platformEvent.name,
            person: ele.platformEventSlot.organiser.user.firstName,
            location: ele.platformEventSlot.venue.name,
            time: moment(ele.startAt).format('HH:mm a'),
            date: moment(ele.startAt).format('DD MMM'),
            datetime: +moment(ele.startAt).format('x'),
            type: 'invitation'
          })
        } else {
          let selectedContent = ele.platformEventPricingSlot.event.contents.find((item: any) => item.id === ele.platformEventPricingSlot.item)
          filteredData.push({
            id: ele.id,
            name: selectedContent && selectedContent.name,
            event: selectedContent && selectedContent.name,
            person: ele.platformEventPricingSlot.user.firstName,
            location: '',
            time: moment(ele.startAt).format('HH:mm a'),
            date: moment(ele.startAt).format('DD MMM'),
            datetime: +moment(ele.startAt).format('x'),
            type: this.props.user.userData.id === ele.platformEventPricingSlot.user.id ? 'content' :  'invitation'
          })
        }
      })
    }

    filteredData.push(...this.state.contentArray.map((content: any) => {
      return {
        id: content.id,
        name: content.name,
        event: content.name,
        person: '',
        location: '',
        time: moment(content.updatedAt).format('HH:mm a'),
        date: moment(content.updatedAt).format('DD MMM'),
        datetime: +moment(content.updatedAt).format('x'),
        type: 'content'
      }
    }))

    filteredData.sort((a: any, b: any) => b.datetime - a.datetime)

    return (
      <Translation>
        {
          () =>
            <StyledNotificationCodeModal className='modal-content'>
              <div className='modal-header'>
                <h4>
                  <Trans i18nKey='Notification'>trans</Trans>
                </h4>
                <button type='button' className='close' onClick={this.closeModal} aria-label='Close'>
                  <span aria-hidden='true'>&times;</span>
                </button>
              </div>
              <div className='modal-body'>
                {/* {loading ? 'Loading...' : (error ? 'There was a problem loading your notifications.' : (filteredData.length > 0 ? filteredData.map((list: any) => ( */}
                {(filteredData.length > 0 ? filteredData.map((list: any) => (
                  <NotesListFormat key= {list.id} ListData={list}  action={'notification'} accept={this.respondToMeeting} reject={this.respondToMeeting}/>
                )) : '')}

              </div>
              <ModalFooter addClassName='wrap' >
                {
                  formErrorMsg && <div className='alert alert-danger text-center mt-3'>{formErrorMsg}</div>
                }
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
  }, dispatch)
}
// @TODO change ID here to the actual user's ID
export default compose(withApollo, connect(mapStateToProps, mapDispatchToProps))(Notification)
