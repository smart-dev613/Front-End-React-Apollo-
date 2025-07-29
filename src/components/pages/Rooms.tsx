import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { AppState } from '../../store/root'
import { bindActionCreators, Dispatch, compose } from 'redux'
import { setCurrentPage } from '../../store/ui/action'
import { showModal } from '../../store/modal/action'
import { ShowModal } from '../../store/modal/types'
import { Translation, Trans } from 'react-i18next'
// import Checkbox from '../components/Form/Checkbox'
import { faPlus, faTrash, faSearchLocation, faMapPin, faMapMarker } from '@fortawesome/free-solid-svg-icons';
import { withApollo } from 'react-apollo'
import { GET_EVENT_INFO } from '../../gql/queries'
import { getEventVenues, deleteVenue } from '../../providers/events'
import { UIState } from "../../store/ui/types"
import Table from './_shared/Table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ApolloClient from 'apollo-client'
import { userIsOrganiser, userIsAuthorised } from '../../util/common'
import { UserState } from '../../store/user/types'

interface StateProps {
  page: string
  user: UserState
  client: ApolloClient<any>
  ui: UIState
}

interface DispatchProps {
  setCurrentPage: (page: string) => void
  showModal: ShowModal
}

type Props = DispatchProps & StateProps

interface RoomsState {
  name: string
  organiser: object
  venues: any
  isEditing: boolean
  eventId: string
  primaryColour: string
  isAuthorised: boolean
}

export class Rooms extends Component<Props, RoomsState> {
  public constructor(props: Props) {
    super(props)

    this.state = {
      name: '',
      organiser: {},
      venues: [],
      isEditing: false,
      eventId: '',
      primaryColour: '',
      isAuthorised: false,
    }

    this.handleAddVenue = this.handleAddVenue.bind(this)
    this.handleEdit = this.handleEdit.bind(this)
    this.getEventVenues = this.getEventVenues.bind(this)
  }

  tableColumns = [
      {
        name: 'Name',
        accessor: 'name',
        isSearchFilter: true,
        sortFilter: true,
        thClass: 'text-left',
        tdClass: 'text-left',
        length: 20,
        width: '35%',
      //   accessor: (name: any) => (
      //     <div style={{ textAlign: 'left'}}>
      //       {name}
      //     </div>
      // )
      },
      {
        name: 'Type',
        accessor: 'type',
        isSearchFilter: true,
        sortFilter: true,
        thClass: 'text-center',
        width: 200
      },
      {
        name: 'Max Attendees',
        accessor: 'maxAttendees',
        sortFilter: true,
        isSearchFilter: true,
        thClass: 'text-center',
      },
      {
        id: 'link',
        name: 'Link',
        sortFilter: false,
        isSearchFilter: false,
        thClass: 'text-center',
        width: 50,
        accessor: (venue: any) => (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1,}}>
            {(venue.link) && (
               <button
               type="submit"
               // className="btn"
               onClick={() => {
                 let url = venue.link
                 if (!url.startsWith('https://') ) {
                   url = "https://" + url 
                 }
                 if(venue.link !== ""){
 
                   window.open(url, '_blank');
                 }
                 // this.handleEdit(venue)}
               }}
             >
               <FontAwesomeIcon icon={faMapMarker} size='2x' color='#151A7B'/>
             </button>
            )}
           
        </div>
        )
      },
      // {
      //   name: 'Catering',
      //   accessor: 'catering',
      //   thClass: 'text-center ',
      // },
      {
        Header: 'Action',
        name: '',
        // dataIndex: 'action',
        // key: 'action',
        // @ts-ignore
        thClass: 'text-right pr-0',
        tdClass: 'pr-0',
        sortFilter: false,
        accessor: (venue: any) => (
          <div style={{ display: 'flex', justifyContent: 'end', gap: 10 }}>
            <button
              type="submit"
              className="btn btn-purple"
              onClick={() => this.handleEdit(venue)}
            >
              <FontAwesomeIcon icon={"pencil-alt"} size='1x' />
            </button>
            <button
              type="button"
              className="btn btn-red"
              onClick={() => this.handleDelete(venue)}
            >
              <FontAwesomeIcon icon={faTrash} size='1x' />
            </button>
        </div>
        )
      }
  ]
  
  public componentDidMount() {
    
    this.props.setCurrentPage('rooms')

    const { eventId, eventName, organiser, menus, theme: { primaryColour } } = this.props.client.readQuery({ query: GET_EVENT_INFO })

    const currentMenu = menus.find(menu => {
      let currentUrl = window.location.pathname.split("/").slice(-1)[0];
      return menu?.link?.includes(`/${currentUrl}`);;
    })
  
    const isAuthorised = userIsAuthorised(this.props.user, organiser, currentMenu)

    this.setState({
      name: eventName,
      organiser,
      eventId: eventId,
      isAuthorised: isAuthorised
    })
    this.getEventVenues(eventId)
  }

  public getEventVenues(eventId: string) {
    if (!eventId) eventId = this.state.eventId
    getEventVenues(eventId)
      .then((response: any) => {
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

  public generateVenueRows() {
    return this.state.venues.map((venue: any, index: any) => {
      const venueType = venue?.type.charAt(0) + venue.type.slice(1).toLowerCase();

        return {
          id: venue.id,
          key: index,
          name: venue.name,
          type: venueType,
          maxAttendees: venue.maxAttendees,
          // remainingSlots: `4\t`,
          remainingSlots: venue.maxAttendees - venue.bookedSlots.length,
          link: venue.link,
        };
      // <tr key={index}>
      //   <th>{venue.name}</th>
      //   <th>{venue.maxAttendees}
      //     <span className='edit'>
           
      //     </span>
      //   </th>
      // </tr>
    })
  }

  public handleEdit(data: object) {      
    localStorage.setItem('venue_type',JSON.stringify(data['type']))
    
    this.props.showModal('UPDATE_VENUE', 'lg', null, null, {
      venueDetails: data,
      loadVenues: this.getEventVenues
    })

  }
  public handleDelete(data: object) {
    const { eventId } = this.props.client.readQuery({ query: GET_EVENT_INFO })
    // @ts-ignore
    deleteVenue(data.id)
      .then((response: any) => {
        this.getEventVenues(eventId)
      })
  }

  public handleAddVenue() {
    this.props.showModal('NEW_VENUE', 'lg', null, null, {
      loadVenues: this.getEventVenues
    })
  }



  public render() {

    if (Object.keys(this.state.organiser).length === 0) return null

    
    if (!this.state.isAuthorised) return <p>You do not have access to this page as you are not an event organiser.</p>

    return (
      <Translation>
        {
          () =>
            <StyledDashboard className='"container-fluid page-container py-4' ui={this.props.ui}>
              <button className='btn-purple btn float-right' onClick={this.handleAddVenue} >
                  <FontAwesomeIcon icon={faPlus}/>
                </button>
              <h3 className='page-title'>Spaces for &nbsp;{this.state.name}</h3>
              <TableContainer>
                <Table
                  columns={this.tableColumns}
                  data={this.generateVenueRows()}
                  className="table table-design table-hover"
                />
               
                {/* <table className='table table-hover'>
                  <thead className='thead-light'>
                    <tr>
                      <th>Name</th>
                      <th>Max attendees</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.generateVenueRows()}
                  </tbody>
                </table> */}
              </TableContainer>
            </StyledDashboard>
        }
      </Translation>
    )
  }
}

const StyledDashboard = styled.div<{ ui: UIState }>`
.edit {
  display: inline-flex;
  float: right;
}

.maindiv {
  background: #f7f7f7;
  padding: 1em;
  border-radius: 5px;
  margin: 1em 0;
}

.status-text {
  display: inline-block;
  margin-left: 1em;
}

.btn {
  display: inline-block;
  background-color: ${props => (props.theme && props.theme.primaryColour) ? props.theme.primaryColour : '#4fb6c0'};
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
/* 
@media only screen and (min-width: 576px) {
  height: calc(100vh - 56px);
} */
`

const TableContainer = styled.div<any>`
width: 100%;
// border: 1px solid blue;
@media screen and (min-width: 767px) {
 scale: none;
}
`

const mapStateToProps = function (state: AppState) {
  return {
    page: state.ui.page,
    user: state.user,
    ui: state.ui
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

export default compose(withApollo, connect(mapStateToProps, mapDispatchToProps))(Rooms)
