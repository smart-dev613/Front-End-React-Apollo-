import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { AppState } from '../../store/root'
import { bindActionCreators, Dispatch, compose } from 'redux'
import { setCurrentPage } from '../../store/ui/action'
import { Translation, Trans } from 'react-i18next'
// import Checkbox from '../components/Form/Checkbox'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { withApollo } from 'react-apollo'
import { GET_EVENT_INFO } from '../../gql/queries'
import { getEventAttendees, resendEventInvite, sendEventInvitation } from '../../providers/events'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import {AiOutlineInfoCircle} from "react-icons/ai"
import ApolloClient from 'apollo-client'
import Form from '../Form/Form'
import FormRow from '../Form/FormRow'
import FormGroup from '../Form/FormGroup'
import Label from '../Form/Label'
import Input from '../Form/Input'
import Button from '../Form/Button'
import { UserState } from '../../store/user/types'
import { userIsOrganiser } from '../../util/common'
import '../../assets/css/style.css'
import { showModal } from '../../store/modal/action'




interface StateProps {
  page: string
  user: UserState
  client: ApolloClient<any>
}

export interface Attendees {
  eventType: string
  id: string
  invitationStatus: string
  invitee: InviteeDetails
}

export interface InviteeDetails {
  company: CompanyObject
  email: string
  id: string
  role: string
  user: UserObject
}

export interface CompanyObject {
  id: string
  info: string
  logoUrl: string
  name: string
  profileEn: string
  profileCn: string
}

export interface UserObject {
  avatar: string
  email: string
  firstName: string
  lastName: string
  id: string
}

interface DispatchProps {
  setCurrentPage: (page: string) => void
  showModal: any
}

type Props = DispatchProps & StateProps

interface AttendeesState {
  attendees: object[]
  attendeeEmail: string
  formFieldErrors: string[]
  updateStatus: string
  formError: boolean
  organiser: object
  eventId: string
}

const Flex = styled.button`
    width: 100%;
    display: flex;
    justify-content: flex-end;
 `
export class Attendees extends Component<Props, AttendeesState> {
  public constructor(props: Props) {
    super(props)

    this.state = {
      attendees: [],
      attendeeEmail: '',
      formFieldErrors: [],
      updateStatus: '',
      organiser: {},
      formError: false,
      eventId: ''
    }

    this.inputChange = this.inputChange.bind(this)
    this.addNewPricing = this.addNewPricing.bind(this)
    this.handleStatus = this.handleStatus.bind(this)
    this.generateAttendeeRows = this.generateAttendeeRows.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.getAttendees = this.getAttendees.bind(this)

    this.handleResendInvite = this.handleResendInvite.bind(this)
  }

  public addNewPricing () {
    this.props.showModal('PRICING', 'lg')
  }

  public componentDidMount() {
    this.props.setCurrentPage('attendees-setup')
    const { eventId, organiser } = this.props.client.readQuery({ query: GET_EVENT_INFO })

    this.setState({
      organiser: organiser,
      eventId: eventId
    })

    this.getAttendees(eventId)
  }

  public getAttendees (eventId: string) {
    getEventAttendees(eventId)
      .then((response: any) => {
        // console.log(response)
        if (response.data && response.data.getEventAttendees) {
          // this.setState({
          //   attendees: response.data.getEventAttendees.attendees
          // })
          let uniqueAttendees: any = []

          response.data.getEventAttendees.attendees.map((attendees: Attendees) => {
            console.log('attendees', attendees)
            if (uniqueAttendees.length === 0) {
              uniqueAttendees.push(attendees)
            } else {
              var isInArray = uniqueAttendees.find((el: Attendees) => { 
                return el.invitee.user.id === attendees.invitee.user.id 
              }) !== undefined;
              if (!isInArray) {
                uniqueAttendees.push(attendees)
              }
            }
          })
          this.setState({
            attendees: uniqueAttendees
          })
        }
      })
      .catch(err => {
        console.error(err)
      })
  }

  public handleStatus(status: string) {
    switch (status) {
      case 'ACCEPTED':
        return <span className="event-status accepted"></span>
      case 'AWAITING':
        return <span className="event-status pending"></span>
      case 'DECLINED':
        return <span className="event-status declined"></span>
    }
  }

  public async handleResendInvite(e: React.MouseEvent<HTMLAnchorElement>) {
    let parentTH = e.currentTarget.parentElement.parentElement
    let invitationId = parentTH.getAttribute('data-id')

    let res = await resendEventInvite(invitationId)
    if (res.data) {
      alert(`Successfully re-sent invite. You will not be able to send another for 24 hours.`)
    } else if (res.errors && res.errors[0].message) {
      alert(res.errors[0].message)
    } else {
      alert(`There was a problem re-sending the invite. Please try again later.`)
    }
  }

  public inputChange(e: any) {
    const target = e.target,
      value = target.value,
      name = target.name

    // @ts-ignore
    this.setState({
      [name]: value
    })
  }

  public generateAttendeeRows (isOrganiser: boolean) {
    return this.state.attendees.map((attendee: any, index: any) => {
      if (!isOrganiser && attendee.invitationStatus !== 'ACCEPTED') return

      return <tr key={index} data-id={attendee.id}>
        <th>{attendee.invitee.user.firstName} {attendee.invitee.user.lastName}</th>
        <th>{attendee.invitee.company.name}</th>
        <th>{this.handleStatus(attendee.invitationStatus)}</th>
        {attendee.invitationStatus === 'AWAITING' && <th>
          <a href='#' onClick={this.handleResendInvite}>Resend Invite</a>
        </th>}
      </tr>
    })
  }

  public handleSubmit () {
    this.setState({
      formError: false,
      updateStatus: 'Working...'
    })

    const formData = {
      inviteeEmails: [this.state.attendeeEmail]
    }

    let errorArr = [] as any
    Object.keys(formData).map(key => {
      // @ts-ignore
      if (!formData[key]) errorArr.push(key)
    })

    this.setState({ formFieldErrors: errorArr }, () => {
      if (this.state.formFieldErrors.length) {
        console.log(this.state.formFieldErrors)
        // this.setState({
        //   formError: true
        // }, () => this.props.setLoadingOverlay(false))
        this.setState({
          formError: true,
          updateStatus: ''
        })
      } else {
        const { eventId } = this.props.client.readQuery({query: GET_EVENT_INFO})
        sendEventInvitation({
          id: eventId,
          ...formData
        })
          .then((response: any) => {
            if (response.data == null) {
              this.setState({
                updateStatus: 'Failed: Check the USER email again, make sure USER has an Inspired account'
              })
            } else {
               console.log('response', response)
              this.getAttendees(eventId)
            this.setState({
              updateStatus: 'Invited'
            })
          }
          })
          .catch((err: any) => {
            console.log('update settings failed')
          })
      }
    })
  }

  public render() {
    if (Object.keys(this.state.organiser).length === 0) return null
    let isOrganiser = userIsOrganiser(this.props.user, this.state.organiser) 

    return (
      <Translation>
        {
          () =>
            <StyledDashboard>
            
              {/* {isOrganiser &&
                <div id='attendeesInvite'>
              
                  <Form id='inviteAttendee' onSubmit={this.handleSubmit}>
                    <FormRow>
                      <FormGroup>
                        <Input
                          colSize='6'
                          name='attendeeEmail'
                          id='attendeeEmail'
                          type='text'
                          placeholder='Enter email address'
                          value={this.state.attendeeEmail}
                          onChange={this.inputChange}
                          fieldError={this.state.formFieldErrors.includes('inviteeEmails')} />
                        <Button text='Invite' addClassName='btn-primary' onClick={(isOrganiser === true && this.state.attendeeEmail === this.props.user.userData.email) ? null : this.handleSubmit} />
                      </FormGroup>
                      <FormGroup>
                      </FormGroup>
                    </FormRow>
                  </Form>
                  <p className='status-text'>{this.state.updateStatus}</p>
                  {(isOrganiser === true && this.state.attendeeEmail === this.props.user.userData.email) ? 'Cannot invite the organizer' : ''}
                  <hr />
                </div>
               } */}
               
               <div className="body-container">
                <button className='btn-purple btn text-white btn-edit' ><FontAwesomeIcon icon={faPlus} onClick={this.addNewPricing} /></button>
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Name</th>
                        <th className="description">Description</th>
                        <th>Employee</th>
                        <th>Price<AiOutlineInfoCircle /></th>
                      </tr>
                    </thead>
                    <tbody>
                    </tbody>
                  </table>
                </div>
               </div>
            </StyledDashboard>
        }
      </Translation>
    )
  }
}

const StyledDashboard = styled.div`

margin-top: 1em;

.body-container {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;

  .btn-edit {
    padding: 0 .3em;
    margin-right: 1em;
  }

  .table-container {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f7f7f7;
    border-radius: 5px;
    margin: 1em auto;
    width: 100%;
    table {
      margin: 1em .5em;
      width: 100%;
      background: #E8ECEF;
      thead {
        width: 100%;
        tr {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          margin: auto;
          width: 100%;

            th {
              padding: .75em 0; 
              font-weight: 400;
              color: #636363;
              width: 100%;
              text-align: center;
              &:nth-child(3){
                //PRICE
                width: 20 0%;
              }
              &:nth-child(5){
                //PRICE
                display: flex;
                align-items: center;
                justify-content: center;
                gap: .5em;
              }
            }
        }
      }
    }
  }
}

@media(max-width:750px){
  padding: 0;
  font-size: 0.8rem;

  .body-container {
    padding: 0;
    margin: 0;
  }

  .description {
    display: none;
  }
}




.status-text {
  display: inline-block;
  margin-left: 1em;
}

.event-status {
  display: block;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  // position: absolute;
  // right: 18px;
  margin-left: 18px;
}
// .table th {
//   margin-left:
// }
.pending {
  background-color: yellow;
}
.accepted {
  background-color: green;
}
.declined {
  background-color: red;
}

.btn {
  display: inline-block;
}

#selectedLanguage,
#selectedTimezone {
  padding: 0;
}

.content {
  display: block;
}

.content-left {
  float: left;
  display: inline-block;
}

.content-right {
  float: right;
  display: inline-block;
}

.content-div {
  display: block;
  margin: 10px;
}

.content-icon {
  float: left;
  margin: 0px 5px;
}

.col-sm {
    height: 120px;

    .nav-tile {
    height: 100%;
    align-items: center;
    display: flex;
    justify-content: center;
    width: 100%;
    color: #ffffff;
    background: #343a40;
    box-shadow: 1px 2px 5px 0px rgba(0,0,0,0.3);
    border-radius: 5px;
    font-size: 1.25em;

    p {
        margin: auto;
    }
    }
}

@media only screen and (min-width: 576px) {
  height: calc(100vh - 56px);
}
`

const mapStateToProps = function (state: AppState) {
  return {
    page: state.ui.page,
    user: state.user
  }
}

const mapDispatchToProps = function (dispatch: Dispatch) {
  return bindActionCreators(
    {
      setCurrentPage,
      showModal
    },
    dispatch
  )
}

export default compose(withApollo, connect(mapStateToProps, mapDispatchToProps))(Attendees)
