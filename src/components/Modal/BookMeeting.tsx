import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch, compose } from 'redux'
import { closeCurrentModal } from '../../store/modal/action'
import { setLoadingOverlay } from '../../store/ui/action'
// import { getAllCompanies } from '../../store/user/action'
import { getEventVenues, newPlatformEventSlot } from '../../providers/events'
// import { validateEmail } from '../../utils/helper'
// import Form from '../Form/Form'
// import FormGroup from '../Form/FormGroup'
// import FormRow from '../Form/FormRow'
// import Label from '../Form/Label'
// import Input from '../Form/Input'
import Button from '../Form/Button'
import ModalFooter from './ModalFooter'
import { Translation, Trans } from 'react-i18next'
import { withApollo } from 'react-apollo'
import ApolloClient from 'apollo-client'
import { GET_EVENT_INFO } from '../../gql/queries'
import moment from 'moment'
import { eventInvitationUpdate } from '../../providers/user'
import { any } from 'prop-types'
import { from } from 'apollo-link'

interface DayData {
  day: string,
  date: string
}

interface StateProps {
  client: ApolloClient<any>
  clicked: string
  info: any
  selectedDay: DayData
  currentSlotStatus: string
  bookingSlot: any
}

interface DispatchProps {
  closeCurrentModal: (type: string) => void
  setLoadingOverlay: (loading: boolean) => void
}

type Props = DispatchProps & StateProps

interface NewVenueState {
  name: string
  maxAttendees: any
  formFieldErrors: string[]
  formErrorMsg: string
  venues: any
  venueID: string
  eventId: string
  space: number
  id: string
  invitationStatus: string,
  endslots: any[],
  selectedEndSlot: string,
  selectedStartSlot: string
}

class BookMeeting extends Component<Props, NewVenueState> {
  public constructor(props: Props) {
    super(props)

    this.state = {
      name: null,
      maxAttendees: 1,
      formFieldErrors: [],
      formErrorMsg: '',
      venues: [],
      venueID: '',
      eventId: '',
      space: 0,
      id: '',
      invitationStatus: '',
      endslots: [],
      selectedEndSlot: '',
      selectedStartSlot: '',
    }
    console.log("this.props", this.props);

    this.handleSubmit = this.handleSubmit.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.changeVenue = this.changeVenue.bind(this)
    this.getVenues = this.getVenues.bind(this)
    this.checkSpaces = this.checkSpaces.bind(this)
    this.respondToMeeting = this.respondToMeeting.bind(this)
    this.changeEndSlot = this.changeEndSlot.bind(this)
  }
  public respondToMeeting (response: string) {
    if (response) {
      // let bookingID = this.props.info.additionalData.bookingSlot.platformEventSlot.id
      let bookingID = this.props.info.additionalData.bookingSlot.id
      let status = (response === 'accept') ? `ACCEPTED` : `DECLINED`
      eventInvitationUpdate(bookingID, status)
        .then((response: any) => {
          if (Object.keys(response).length > 0) {
            this.setState({
              invitationStatus: response.data.respondToInvite.invitationStatus
            })
          }
        })
    }
  }

  public changeVenue (e: any) {
    // console.log('e', e.target.value)
    if (e.target.value) {
      this.setState({
        venueID: e.target.value
      }, () => this.checkSpaces(this.state.venueID))
    } else {
      this.setState({
        space: 0
      })
    }
  }

  public changeEndSlot (e:any){
      this.setState({
        selectedEndSlot: e.target.value
      })
    
  }

  public checkSpaces (venueID: string) {
    if (venueID) {
      let selectedSpace = this.state.venues.filter((venue: NewVenueState) => venue.id === venueID ? venue : null)
      // console.log('selectedSpace', selectedSpace)
      if (Object.keys(selectedSpace)) {
        this.setState({
          space: selectedSpace[0].maxAttendees
        })
      }
    }
  }

  public componentDidMount () {
    const { eventId } = this.props.client.readQuery({ query: GET_EVENT_INFO })
    this.getVenues(eventId)
    let to =''
    let from =''
    let EndSlotsList=[]

    let timeSlots= [
      "00:00", "00:30", "01:00", "01:30", "02:00", "02:30", "03:00", "03:30", "04:00", "04:30", "05:00", "05:30", "06:00", "06:30", "07:00",
      "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00",
      "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30"
    ]

    if (this.props.info.additionalData.slot) {
      let time = this.props.info.additionalData.slot.split('-')
      to = time[1].trim()
      from = time[0].trim()
      let IsEndTime=false
      for(var i=0;i<timeSlots.length;i++)
      {
        if(timeSlots[i]==to)
        {
          IsEndTime=true
        }
        if(IsEndTime){
          EndSlotsList.push(timeSlots[i])
        }
      }
      // EndSlotsList.push(to);


    }
    this.setState({
      invitationStatus: this.props.info.additionalData.bookingSlot ? this.props.info.additionalData.bookingSlot.invitationStatus : '',
      selectedEndSlot : to,
      selectedStartSlot : from,
      endslots : EndSlotsList
    })
  }

  public getVenues (eventId: string) {
    if (!eventId) eventId = this.state.eventId
    getEventVenues(eventId)
      .then((response: any) => {
        // console.log(response)
        if (response.data && response.data.getEventVenues) {
          this.setState({
            venues: response.data.getEventVenues
          })
        }
      })
      .catch(err => {
        console.error(err)
      })
  }

  public handleSubmit(e: React.MouseEvent | React.FormEvent) {
    // const { eventId } = this.props.client.readQuery({ query: GET_EVENT_INFO })

    e.preventDefault()
    this.props.setLoadingOverlay(true)
    let inviteesArray = []
    // let from = ''
    // let to = ''
    // if (this.props.info.additionalData.personID) {
    // pass actual company membership id, not user id
      console.log('mounted info', this.props.info);
      inviteesArray.push(...this.props.info.additionalData.companyMembershipID)
    // }
    // if (this.props.info.additionalData.slot) {
    //   let time = this.props.info.additionalData.slot.split('-')
    //   from = time[0].trim()
    //   to = time[1].trim()
    // }
    let startTime = moment(this.props.info.additionalData.selectedDay.date +' '+ this.state.selectedStartSlot, 'DD/MM/YYYY HH:mm').format('DD/MM/YYYY HH:mm')
    let endTime = moment(this.props.info.additionalData.selectedDay.date +' '+ this.state.selectedEndSlot, 'DD/MM/YYYY HH:mm').format('DD/MM/YYYY HH:mm')
    let formData = {
      name: "Meeting",
      startAt: moment(startTime, 'DD/MM/YYYY HH:mm').toISOString(),
      endAt: moment(endTime, 'DD/MM/YYYY HH:mm').toISOString(),
      venueID: this.state.venueID,
      invitees: inviteesArray,
      eventType: `PLATFORM_EVENT_SLOT`
    }

    newPlatformEventSlot(formData)
      .then((res: any) => {
        if (res.errors && res.errors[0].message) {
          alert(res.errors[0].message);
        }
        this.closeModal()
        this.props.setLoadingOverlay(false)
        this.props.info.additionalData.updateSlot()
      })
      .catch((err: any) => {
        if (err instanceof DOMException) {
          this.props.setLoadingOverlay(false)
        } else {
          this.props.setLoadingOverlay(false)
          console.log(err)
        }
      })
  }

  public closeModal() {
    this.props.closeCurrentModal('BOOK_MEETING')
  }

  public generateVenueOptions() {
    // console.log('this.state.venues', this.state.venues)
    // TODO: check if venue is actually available, don't show on list if not
    let venues = this.state.venues
    return venues.map((venue: any, index: any) => {
      return <option key={index} value={venue.id}>{venue.name}</option>
    })
  }

  public generateSlotOptions() {
    
    return this.state.endslots.map((slot: any, index: any) => {
      return <option key={index} value={slot}>{slot}</option>
    })
  }

  public render() {
    const { formErrorMsg } = this.state
    return (
      <Translation>
        {
          () =>
            <StyledQrCodeModal className='modal-content'>
              <div className='modal-header'>
                <h4>
                  {
                    this.props.info.additionalData.isBooking === true
                    ? <Trans i18nKey='BookMeetingHeader'>trans</Trans>
                    : <Trans i18nKey='MeetingSummaryHeader'>trans</Trans>
                  }
                </h4>
                <button type='button' className='close' aria-label='Close' onClick={this.closeModal}>
                  <span aria-hidden='true'>&times;</span>
                </button>
              </div>
                { this.props.info.additionalData.isBooking === true
                ?
                <div className='modal-body'>
                  <p>You are requesting a meeting with <strong>{this.props.info.additionalData.personName}</strong> from <strong>{this.props.info.additionalData.companyName}</strong>.</p>
                  <ul>
                    <li><strong>Date:</strong> {this.props.info.additionalData.selectedDay.day} {this.props.info.additionalData.selectedDay.date} </li>  
                    {/* ({this.props.info.additionalData.slot}) */}
                    <strong> Time:</strong> {this.state.selectedStartSlot} - <select className="form-control display" style={{marginRight: '5%'}} id="venueOptions" value={this.state.selectedEndSlot} onChange={(e) => this.changeEndSlot(e)} >
                    { this.state.endslots.length==0?<option key={this.state.endslots.length + 1} value=''>Select End At</option>:''}
                      {this.generateSlotOptions()}
                    </select>
                    <select className="form-control display" style={{marginRight: '5%'}} id="venueOptions" value={this.state.venues[this.state.venueID]} onChange={(e) => this.changeVenue(e)} >
                    <option key={this.state.venues.length + 1} value=''>Select Venue</option>
                      {this.generateVenueOptions()}
                    </select>
                    <span className='display space'>
                      <p className='display'>Total Space: {this.state.space > 0 ? this.state.space : '-'}</p>
                    </span>
                  </ul>
                  <p>The request will be sent to <strong>{this.props.info.additionalData.personName}</strong> for approval.</p>
              </div>
                : 
                ((this.props.info.additionalData.currentSlotStatus === 'ACCEPTED') || (this.props.info.additionalData.currentSlotStatus === 'AWAITING') || (this.props.info.additionalData.currentSlotStatus === 'DECLINED')) ?
                  <div className='modal-body'>
                    <p>You have received a meeting request with <strong>{this.props.info.additionalData.bookingSlot.platformEventSlot.organiser.user.firstName + ' ' + this.props.info.additionalData.bookingSlot.platformEventSlot.organiser.user.lastName}</strong> from <strong>{this.props.info.additionalData.bookingSlot.platformEventSlot.organiser.company.name}</strong>.</p>
                    <p><strong>Date:</strong> {this.props.info.additionalData.selectedDay.day} {this.props.info.additionalData.selectedDay.date} ({this.props.info.additionalData.slot})</p>
                    <p><strong>Venue:</strong>{' ' + this.props.info.additionalData.bookingSlot.platformEventSlot.venue.name}</p>
                    {this.state.invitationStatus === 'ACCEPTED' ? <strong>Meeting Accepted</strong>: ''}
                    {this.state.invitationStatus === 'DECLINED' ? <strong>Meeting Cancelled</strong>: ''}
                    {this.state.invitationStatus === 'AWAITING' ?
                    <div className='wrap'>
                      <Button text='Cancel' addClassName='btn-danger display' onClick={() => this.respondToMeeting('deny')} />
                      <Button text='Confirm' addClassName='btn-primary display' onClick={() => this.respondToMeeting('accept')} />
                    </div> : '' }
                    {/* <p>The request will be sent to <strong>{this.props.info.additionalData.personName}</strong> for approval.</p> */}
                  </div>
                  :
                  <div className='modal-body'>
                    <p>You have no activity registered for this time.</p>
                  </div> 
                }
              {this.props.info.additionalData.isBooking === true
              ?
              <ModalFooter addClassName='wrap' >
                {
                  formErrorMsg && <div className='alert alert-danger text-center mt-3'>{formErrorMsg}</div>
                }
                {/* <Button text='Cancel' addClassName='btn-danger' onClick={this.closeModal} /> */}
                <Button text='Confirm' addClassName='btn-primary' onClick={this.handleSubmit} />
              </ModalFooter>
              : ''
              // <ModalFooter addClassName='wrap' >
              //   <Button text='Close' addClassName='btn-danger' onClick={this.closeModal} />
              // </ModalFooter>
              }
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

  .modal-header {
    border-bottom: none;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  #venueOptions {
    margin-top: 1em;
    width: 50%;
  }

  .display {
    display: inline;
  }

  .space {
    border: 1px solid #ced4da;
    padding: 1% 3%;
  }

  .display {
    display: inline;
    margin: 0 5px;
  }
`

const mapDispatchToProps = function (dispatch: Dispatch) {
  return bindActionCreators({
    closeCurrentModal,
    setLoadingOverlay
  }, dispatch)
}

export default compose(withApollo, connect(null, mapDispatchToProps))(BookMeeting)
