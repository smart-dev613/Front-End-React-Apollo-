import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { AppState } from '../../store/root';
import { bindActionCreators, Dispatch, compose } from 'redux';
import { setCurrentPage } from '../../store/ui/action';
import { Translation, Trans } from 'react-i18next';
// import Checkbox from '../components/Form/Checkbox'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withApollo } from 'react-apollo';
import { GET_EVENT_INFO } from '../../gql/queries';
import { getEmployeeDetails, getEventAttendees, sendEventInvitation } from '../../providers/events';

import ApolloClient from 'apollo-client';
import Form from '../Form/Form';
import FormRow from '../Form/FormRow';
import FormGroup from '../Form/FormGroup';
import Label from '../Form/Label';
import Input from '../Form/Input';
import Button from '../Form/Button';
import { UserState } from '../../store/user/types';
import { userIsOrganiser } from '../../util/common';
import Calendar from './Calendar';
import userImg from '../../assets/images/profile_placeholder.png';
import SearchComponent from './SearchComponent';
import ListFormatAttendees from './ListFormatAttendees';
import user1 from '../../assets/images/user1.png';
import user2 from '../../assets/images/user2.png';
import { any } from 'prop-types';
import { UserData } from '../../store/user/types';

interface StateProps {
  page: string;
  user: UserState;
  client: ApolloClient<any>;
  showSearch: boolean;
}

interface AttendeesList {
  eventType: string;
  id: string;
  invitationStatus: string;
  invitee: InviteeDetails;
}

interface InviteeDetails {
  company: CompanyObject;
  email: string;
  id: string;
  role: string;
  user: UserData;
  profiles: any[];
}

interface CompanyObject {
  id: string;
  info: string;
  logoUrl: string;
  name: string;
  profileEn: object;
  profileCn: object;
}

interface DispatchProps {
  setCurrentPage: (page: string) => void;
}

type Props = DispatchProps & StateProps;

interface AttendeesState {
  attendees: object[];
  attendeeEmail: string;
  formFieldErrors: string[];
  updateStatus: string;
  formError: boolean;
  organiser: object;
  filter: string;
  requiredItem: number;
}

export class Attendees extends Component<Props, AttendeesState> {
  public constructor(props: Props) {
    super(props);

    this.state = {
      attendees: [],
      attendeeEmail: '',
      formFieldErrors: [],
      updateStatus: '',
      organiser: {},
      formError: false,
      filter: '',
      requiredItem: 0,
    };

    this.inputChange = this.inputChange.bind(this);

    this.handleStatus = this.handleStatus.bind(this);
    // this.generateAttendeeRows = this.generateAttendeeRows.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  public componentDidMount() {
    this.props.setCurrentPage('Attendees');
    const { eventId, organiser } = this.props.client.readQuery({ query: GET_EVENT_INFO });

    this.setState({
      organiser: organiser,
    });
    let uniqueAttendees: any = [];

    getEventAttendees(eventId)
      .then((response: any) => {
        if (response.data && response.data.getEventAttendees) {
          response.data.getEventAttendees.attendees.map((attendee: any) => {
            if (attendee.invitationStatus === 'ACCEPTED') {
              if (uniqueAttendees.length === 0) {
                uniqueAttendees.push(attendee);
              } else if (uniqueAttendees.length > 0) {
                let index = uniqueAttendees.findIndex((x: any) => x.id === attendee.id);
                if (index === -1) {
                  uniqueAttendees.push(attendee);
                }
              }
            }
          });
          // uniqueAttendees.forEach((employee: any, index: number) => {
          //   console.log(employee.invitee.user.id)
          //   employee.invitee.user.Introduction = "Testing Intro";
          //   employee.invitee.user.Keywords = ["Test Keywords"];
          //   getEmployeeDetails("5fae97b1e1d42d000735c9f2")
          //   .then((response : any) => {
          //     // console.log("employee", response)
          //     this.updateEmployeeDetails(index, response.data)
          //   })
          // })
          // console.log('uniqueAttendees', uniqueAttendees)
          this.setState({
            attendees: uniqueAttendees,
          });

          return;
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  private updateEmployeeDetails = (index: number, data: any) => {
    let attendees = this.state.attendees;
    let targetAttendees: any = attendees[index];
    targetAttendees.invitee.user.Introduction = data.getEmployeeDetails.profiles[0].bio;
    targetAttendees.invitee.user.Keywords = data.getEmployeeDetails.profiles[0].keywords;
    this.setState({
      attendees: [...attendees],
    });
  };

  public handleStatus(status: string) {
    switch (status) {
      case 'ACCEPTED':
        return <span className="badge badge-success">Accepted</span>;
      case 'AWAITING':
        return <span className="badge badge-warning">Pending</span>;
      case 'DECLINED':
        return <span className="badge badge-danger">Declined</span>;
    }
  }

  public inputChange(e: any) {
    const target = e.target,
      value = target.value,
      name = target.name;

    // @ts-ignore
    this.setState({
      [name]: value,
    });
  }

  // public generateAttendeeRows () {
  // return this.state.attendees.map((attendee: any, index: any) => {
  //   if (!isOrganiser && attendee.invitationStatus !== 'ACCEPTED') return

  // return <tr key={index}>
  //   <th>{attendee.invitee.user.firstName} {attendee.invitee.user.lastName}</th>
  //   <th>{attendee.invitee.company.name}</th>
  //   <th>{this.handleStatus(attendee.invitationStatus)}</th>
  // </tr>
  // return (
  //   <div key={index} className='row no-side-margin widthStyle'>
  //     {attendees.map(attendee => (
  //       <li key={attendee.id}>
  //         {/* <span onClick={() => this.openUserDataModal(attendee.id)}>{attendee.name}</span>
  //         <span className='action-icons'><Toggle  isChecked={true} /></span> */}
  //         <span>
  //           <span>
  //             <img src={attendee.img} />
  //           </span>

  //           <span>
  //             <h5>{attendee.name}</h5>
  //             <p>{attendee.description}</p>
  //           </span>

  //           <span>
  //             <FontAwesomeIcon icon='calendar' size='1x' />
  //           </span>

  //         </span>
  //       </li>
  //     ))}

  //   </div>
  // )
  // })

  // <div key={} className='row no-side-margin widthStyle'>
  // let attendeesList = []

  // attendeesList = attendeesData.map(attendee => (
  //   <li key={attendee.id} className='userList'>
  //     {/* <span onClick={() => this.openUserDataModal(attendee.id)}>{attendee.name}</span>
  //     <span className='action-icons'><Toggle  isChecked={true} /></span> */}
  //     <span className='col-sm-12'>
  //       <span>
  //         <span className='col-sm-4'>
  //           <img className='userImg' src={attendee.Img} />
  //         </span>

  //         <span className='pt-3 col-sm-4'>
  //           <h5>{attendee.Name}</h5>
  //           <p>{attendee.description}</p>
  //         </span>

  //         <span className='col-sm-4'>
  //           <FontAwesomeIcon icon='calendar-check' size='2x' />
  //         </span>

  //       </span>
  //     </span>
  //   </li>
  // ))

  // console.log('attendeesList', attendeesList)
  // return attendeesList

  // </div>

  // }

  public handleSubmit() {
    this.setState({
      formError: false,
      updateStatus: 'Working...',
    });

    const formData = {
      inviteeEmails: [this.state.attendeeEmail],
    };

    let errorArr = [] as any;
    Object.keys(formData).map((key) => {
      // @ts-ignore
      if (!formData[key]) errorArr.push(key);
    });

    this.setState({ formFieldErrors: errorArr }, () => {
      if (this.state.formFieldErrors.length) {
        // this.setState({
        //   formError: true
        // }, () => this.props.setLoadingOverlay(false))
        this.setState({
          formError: true,
          updateStatus: '',
        });
      } else {
        const { eventId } = this.props.client.readQuery({ query: GET_EVENT_INFO });
        sendEventInvitation({
          id: eventId,
          ...formData,
        })
          .then((response: any) => {
            this.setState({
              updateStatus: 'Invited',
            });
          })
          .catch((err: any) => {
            console.log('update settings failed');
          });
      }
    });
  }

  // public render() {
  //   let isOrganiser = userIsOrganiser(this.props.user, this.state.organiser)

  //   return (
  //     <Translation>
  //       {
  //         () =>
  //           <StyledDashboard className='main-container'>
  //             <h3 className='page-title'>Attendees</h3>
  //             {/* {isOrganiser &&
  //               <div id='attendeesInvite'>
  //                 <p>You can invite an attendee to your event here by entering their email address.</p>
  //                 <Form id='inviteAttendee' onSubmit={this.handleSubmit}>
  //                   <FormRow>
  //                     <FormGroup>
  //                       <Input
  //                         colSize='6'
  //                         name='attendeeEmail'
  //                         id='attendeeEmail'
  //                         type='text'
  //                         placeholder='Enter email address'
  //                         value={this.state.attendeeEmail}
  //                         onChange={this.inputChange}
  //                         fieldError={this.state.formFieldErrors.includes('inviteeEmails')} />
  //                       <Button text='Invite' addClassName='btn-primary' onClick={this.handleSubmit} />
  //                     </FormGroup>
  //                     <FormGroup>
  //                     </FormGroup>
  //                   </FormRow>
  //                 </Form>
  //                 <p className='status-text'>{this.state.updateStatus}</p>
  //                 <hr />
  //               </div>
  //             } */}
  //             <p>This is a list of the attendees for the event.</p>
  //             <div className='row no-side-margin widthStyle'>
  //               {this.generateAttendeeRows()}
  //             </div>
  //             {/* <div className="maindiv">
  //               <table className='table table-hover'>
  //                 <thead className='thead-light'>
  //                   <tr>
  //                     <th>Name</th>
  //                     <th>Company</th>
  //                     <th>Status</th>
  //                   </tr>
  //                 </thead>
  //                 <tbody>
  //                   {this.generateAttendeeRows(isOrganiser)}
  //                 </tbody>
  //               </table>
  //             </div> */}
  //           </StyledDashboard>
  //       }
  //     </Translation>
  //   )
  // }

  private handleChange = (event: any) => {
    this.setState({ filter: event.target.value });
  };

  private truncateText = (str: string) => {
    if (str.length > 140) return str.substring(0, 140) + ' ...';
    else return str;
  };

  public render() {
    const filter = this.state.filter;
    const data = this.state.attendees;
    const requiredItem = this.state.requiredItem;
    const modalData = data[requiredItem];
    const lowercasedFilter = filter.toLowerCase();
    const filteredData = data.filter((item: AttendeesList) => {
      if (
        item.invitee.user.firstName.toLowerCase().includes(lowercasedFilter) ||
        (item.invitee.user.Keywords
          ? item.invitee.user.Keywords.map((v: any) => v.toLowerCase())
              .toString()
              .includes(lowercasedFilter)
          : '') ||
        item.invitee.user.lastName.toLowerCase().includes(lowercasedFilter)
      ) {
        return item;
      }
    });

    console.log(filteredData);

    return (
      <Translation>
        {() => (
          <StyledList className="main-container  container-fluid page-container py-4">
            {this.props.showSearch ? (
              <SearchComponent filter={filter} click={this.handleChange} placeholder="User name, keyword..." />
            ) : null}
            {/* <h3 className='page-title'>Attendees</h3> */}

            {filteredData.map((list: AttendeesList, index) => (
              // <Link to={'/company/'+ list.id} key={list.id} style={{ textDecoration: 'none' }} >
              // @ts-ignore
              <ListFormatAttendees key={list.id + Date.now()} ListData={list} truncateText={this.truncateText} />
              // </Link>
            ))}
            {/* {
        // <OrganizationDetails
        //   title={modalData.Name}
        //   intro={modalData.Introduction}
        //   Img={modalData.Img}
        //    saveModalDetails={this.saveModalDetails}
        //   />
        // }
        //   // onClick={this.openCompanyDetails.bind(this, index)}  */}
          </StyledList>
        )}
      </Translation>
    );
  }
}

const StyledList = styled.div`
  .inner {
    height: 380px;
    max-height: 400px;
    padding-bottom: 5px;
    overflow: hidden;
  }

  .desc {
    overflow: hidden;
  }
  @media screen and (max-width: 576px) {
    .page-title {
      font-size: large;
    }
  }
`;
const mapStateToProps = function (state: AppState) {
  return {
    page: state.ui.page,
    user: state.user,
  };
};

const mapDispatchToProps = function (dispatch: Dispatch) {
  return bindActionCreators(
    {
      setCurrentPage,
    },
    dispatch
  );
};

export default compose(withApollo, connect(mapStateToProps, mapDispatchToProps))(Attendees);
