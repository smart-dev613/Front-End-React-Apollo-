import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components'
import moment from 'moment';

/** Hooks */
import { useQuery } from '@apollo/react-hooks';
import { useData } from './hooks/useData';
import { setLoadingOverlay } from "../../../../store/ui/action";
import { useRouterQuery } from '../../_hooks/useRouterQuery';

/** Components */
// import Table from 'rc-table';
import Table from '../../_shared/Table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheck,
  faEnvelope,
  faInfoCircle,
  faPaperPlane,
  faTimes,
  faCircle,
  faUserPlus,
} from '@fortawesome/free-solid-svg-icons';
  
import logo from '../../../../assets/images/synkd-icon.png'
import { Container, ContentWrapper, HeaderWrapper } from './components/general';
import Input from '../../../Form/Input';
import Button from '../../../Form/Button';


/** Utils */
import { bindActionCreators, compose, Dispatch } from 'redux';
import { withApollo } from 'react-apollo';
import { connect } from 'react-redux';
import { GET_EVENT_INFO } from '../../../../gql/queries';
import { userIsOrganiser, userIsAuthorised } from '../../../../util/common';

/** Store */
import { setCurrentPage } from '../../../../store/ui/action';
import { getPlatformEventMembers, getUserQRCodeScan } from '../../../../providers/events';
import { showModal } from '../../../../store/modal/action';

/** Constatns */
import { columns } from './columns';

/** Types */
// import { Props } from './types';
import { AppState } from '../../../../store/root';
import Modal from '../../../../Modal';
import './style.scss';
import { UIState } from '../../../../store/ui/types';
import { UserState } from '../../../../store/user/types';

interface StateProps {
  ui: UIState,
  user: UserState,
}

interface DispatchProps {
  setCurrentPage: (page: string) => void
  showModal: any,
  setLoadingOverlay: (loading: boolean) => void;
}

type Props = DispatchProps & StateProps

const Invited: React.FC<Props> = (props: Props) => {
  
  const { ui, user, setCurrentPage, showModal } = props;
  
  const {
    data: { theme, eventId, organiser, menus, maximumAttendees },
  }: any = useQuery(GET_EVENT_INFO);

  const isOrganiser = userIsOrganiser(user, organiser);

  const [attendeeEmail, setAttendeeEmail] = useState('');

  const [platformEventMembers, setPlatformEventMembers] = useState([])
  const [attendeesProfiles, setAttendeesProfiles] = useState([])

  const { attendees, requesters, sendInvitation, resendInvitation, archiveInvitation, responseToRequest, QRCodeScan } = useData(
    eventId,
    isOrganiser,
    maximumAttendees
  );
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [queries] = useRouterQuery();

  const verification = useMemo(() => queries.verify, [queries]);
  const channel = useMemo(() => queries?.ch, [queries]);

  useEffect(() => {
    setCurrentPage('invited');
  
    // getting event members
    getPlatformEventMembers(eventId).then((response: any) => {
      setPlatformEventMembers(response?.data?.getPlatformEventMembers)
    })
 

  }, [eventId]);

  const currentMenu = menus.find(menu => {
    let currentUrl = window.location.pathname.split("/").slice(-1)[0];
    return menu?.link?.includes(`/${currentUrl}`);;
  })

  const isAuthorised = userIsAuthorised(user, organiser, currentMenu);

  if (!isAuthorised) {
    return (
      <Container ui={ui} theme={theme} className="container-fluid page-container py-4">
        <p>You do not have access to this page as you are not an event organiser.</p>
      </Container>
    );
  }

  useEffect(() => {

    if(verification){

      let user = getProfile(verification)

      if(user?.user?.id){
       
        showModal('MEMBER_PROFILE', null, null, 'lg', {user, eventId});

        if(channel){
          QRCodeScan(user?.user?.id, eventId, user?.id)
        }

      }

    }
 

  }, [platformEventMembers]);


  /*Note: The getProfile function is matching the user id with the users/members from platformEventMembers 
  and returning the profile attribute holding the current user profile or default profile if undefine
  */
  const getProfile = (id) => {
   
    const profile = platformEventMembers.find(member => member.user.id === id)
    if(profile?.profile){
      profile.profile.firstName = profile.user.firstName
      profile.profile.lastName = profile.user.lastName
    }

    return  profile?.profile ? profile?.profile : profile?.user
  }

  const configAttendees = useMemo(() => {

    const newProfiles = [];

    attendees.map(attendee => {

      if(attendee.invitationStatus === "ACCEPTED" || attendee.status === "ACCEPTED"){
        const profile = getProfile(attendee?.invitee?.user?.id)

        //checking if attendee profile is companyMembership or default user profile
        if(profile?.user) {
          // replacing these details with the ones from the current profile the user is switch to.
          attendee.email = profile?.email,
          attendee.company = profile?.company?.name

          newProfiles.push(attendee)

        } else {

          attendee.email = attendee?.invitee?.user?.email
          attendee.company = ""
          newProfiles.push(attendee)

        }
      } else {
        //setting email to user's default email 
        attendee.email = attendee?.invitationEmail
        attendee.company = ""
        newProfiles.push(attendee)
      }

     
    })

    setAttendeesProfiles(newProfiles)


    return attendees;

  }, [platformEventMembers, attendees]);


const Loading = () => {
    return (
        <Loader>
            <img src={logo} width='50px' className="logo rotate" alt="logo" />
        </Loader>
    )
}
//Sweet-Alert for archive confirmation
const handleClickArchive =(record)=> {

  showModal('ARCHIVE_INVITATION', 'lg', null, archiveInvitation, { data: {...record, archiveInvitation} });

  // swal({
  //   title: "Are you sure?",
  //   text: "Confirm to delete this invitation",
  //   "icon": "warning",
  //   // @ts-ignore
  //   buttons: true,
  //   dangerMode: true,
  // })
  // .then((isConfirmed) => {
  //   if (isConfirmed) {
  //     archiveInvitation(record.id)
  //     .then((next)=>{
  //       swal({
  //         text: "Invitation Archived Successfully!",
  //         icon: "success",
  //       });
  //     })
  //   } else {
  //     swal({
  //       text: "Action Cancelled!",
  //       buttons: [true],
  //       timer: 1000
  //     });
  //   }
  // });
}

const configColumns = useMemo(() => {
    const newColumns = JSON.parse(JSON.stringify([...columns]));

    

    // @ts-ignore
    // newColumns[0].accessor = (record: any) => {
    //   return "record.Name";
    // };

    // @ts-ignore
    newColumns[newColumns.length - 2].accessor = (record: any) => {
      switch (record.invitationStatus) {
        case 'ACCEPTED':
          if (record.limited) return <span className="event-status limited"></span>;
          return <span className="event-status accepted"></span>;
        case 'AWAITING':
          return (
            <FontAwesomeIcon
              style={{ cursor: 'pointer' }}
              onClick={() => resendInvitation(record)}
              icon={faPaperPlane}
              className="event-status sending"
            />
          );
        case 'ARCHIVED':
          return (
            <FontAwesomeIcon
              style={{ cursor: 'pointer' }}
              onClick={() => resendInvitation(record)}
              icon={faPaperPlane}
              className="event-status sending"
            />
          );
        case 'DECLINED':
          return <span onClick={() => resendInvitation(record)} className="event-status declined"></span>;
      }
      if (Object.keys(record).includes('requester')) {
        let accepted = record.status === "ACCEPTED"
        
        if (accepted) {
        return (
          <span className="event-status accepted"></span>
          )
        }  else {
          return (
            <FontAwesomeIcon
              style={{ cursor: 'pointer', backgroundColor: 'transperent', color: 'green' }}
              size={'lg'}
              icon={faUserPlus}
              onClick={async () => {
                await handleRequest(record.id, 'ACCEPTED');
              }}
            />
          );
        }
        }
        return status;
      };
    // @ts-ignore
    newColumns[newColumns.length - 1].accessor = (record: any) => {
      const actionButtons = [];
      
      if(record?.invitee?.id !== organiser?.id){
        if (record.invitationStatus === 'ARCHIVED') {
          actionButtons.push(
            <a href="#">
              <FontAwesomeIcon icon={faTimes} size={'lg'} className="action-disabled" />
            </a>
          );
        } else if (record.status === 'ARCHIVED') {
          actionButtons.push(
            <a href="#">
              <FontAwesomeIcon icon={faTimes} size={'lg'} className="action-disabled" />
            </a>
          );
        } 
        else {
          actionButtons.push(
            <a href="#" onClick={() => handleClickArchive(record)}>
              <FontAwesomeIcon icon={faTimes} size={'lg'} className="action-remove" />
            </a>
          );

        }
       
      }
     
      if (record.invitationStatus === 'DECLINED') {
        actionButtons.push(
          <a href="#">
            <FontAwesomeIcon icon={faCheck} size={'lg'} className="action-tick" />
          </a>
        );
      }

      
       
      if (!isOrganiser) {
        return null;
      }

      return actionButtons;

    };

    // @ts-ignore
    newColumns[3].accessor = (record: any) => {

      return moment(record.updatedAt).format('HH:mm D/M/YY');
    };

    columns[3] = newColumns[3];

    columns[newColumns.length - 2] = newColumns[newColumns.length - 2];
    columns[newColumns.length - 1] = newColumns[newColumns.length - 1];
    // columns[0].Cell = ({ row }: any) =>{
    //   return <span onClick={()=> setIsOpenModal(true)}>{row.original.name}</span>
    // }
   
    return columns;
  }, [resendInvitation]);

  const openIFrame = () => {
    let iframe = document.createElement('iframe');
    iframe.src = `${process.env.BILLING_FRONTEND}/${eventId}/event-attendees?callback=${window.location.href}`;
    iframe.frameBorder = '0';
    iframe.id = 'iframe';
    iframe.style.position = 'absolute';
    iframe.style.zIndex = '99999';
    iframe.style.height = '100%';
    iframe.style.width = '100%';
    iframe.style.top = '0';
    iframe.style.border = 'none';
    document.body.prepend(iframe);
    document.body.style.overflow = 'hidden';
  };

  const closeIFrame = () => {
    window.addEventListener('message', function (event) {
      let frameToRemove = document.getElementById('iframe');
      if (frameToRemove) {
        frameToRemove.parentNode.removeChild(frameToRemove);
        document.body.style.overflow = 'inherit';
      }
    });
  };

  const sendEmailInvitation = async (email) => {
    setIsLoading(true)
    props.setLoadingOverlay(true)
    
    const response = await sendInvitation(email.toLowerCase());
    if(response){
      props.setLoadingOverlay(false)
      setAttendeeEmail('')
      setIsLoading(false)
    }
    
    
  }

  const handleRequest = async (requestId, status) => {
    setIsLoading(true)
    props.setLoadingOverlay(true)
    
    const response: any = await responseToRequest(requestId, status);
    if(response){
      props.setLoadingOverlay(false)
      setIsLoading(false)
    }
    
    
  }

  const handleDelete = async (requestId, status) => {
    setIsLoading(true)
    props.setLoadingOverlay(true)
    
    const response: any = await responseToRequest(requestId, status);
    if(response){
      props.setLoadingOverlay(false)
      setIsLoading(false)
    }
    
    
  }


  const attendeesPricing = [
    { title: 'Up 20', max: 20, price: 'Free' },
    { title: '21 to 50', max: 50, price: '£100' },
    { title: '51 to 500', max: 500, price: '£500' },
    { title: 'Over 500', max: 5000, price: '£1,000' },
  ];

  const currentUrl = window.location.origin;
  const marketingURL = currentUrl.includes('dev') ? 'https://marketing-dev.synkd.life' : 'https://marketing.synkd.life';

  
  return (
    <Container ui={ui} theme={theme}>
      {isLoading && <Loading/>}
      {isOpenModal ? <Modal isOpeModal={isOpenModal} onClick={() => setIsOpenModal((prevCheck) => !prevCheck)} /> : ''}
      <HeaderWrapper>
        <h2>Invited</h2>
        {/* <div className={'row'} style={{ position: 'relative' }}>
          <span className={'my-auto mr-2'}>
            Attendees: {attendees.length + requesters.length} / {maximumAttendees || 20}
          </span>
          <div id="to-hover" className="pl-2 pr-4 py-1 my-auto bg-success rounded">
            <span className={'text-white font-weight-bold'}>Free</span>
            
          </div>
        </div> */}
        <div className="extra">
          <div>
            <Input
              colSize="8 mr-2"
              name="attendeeEmail"
              id="attendeeEmail"
              type="text"
              placeholder="Enter email address"
              value={attendeeEmail}
              onChange={(e) => setAttendeeEmail(e.target.value)}
              // fieldError={this.state.formFieldErrors.includes('inviteeEmails')}
            />
          </div>
          
          <div className="cluster">
            <Button
              fontIcon={faEnvelope}
              addClassName="btn-purple"
              onClick={() => {
                if(attendeeEmail){
                  sendEmailInvitation(attendeeEmail);
                }
                
                //setAttendeeEmail('');
              }}
            />
          </div>
          <div className="cluster">
            <Button
              fontIcon={faUserPlus}
              addClassName="btn-purple"
              onClick={() => {
                window.open(`${marketingURL}/mailing`);
              }}
            />
          </div>
        </div>
      </HeaderWrapper>

      <HeaderWrapper2>
        <h2>Invited</h2>
        <div className={'row'} style={{ position: 'relative', paddingLeft:"20px", paddingBottom:"6px" }}>
          <span className={'my-auto mr-2'}>
            Attendees: {attendees.length} / {maximumAttendees || 20}
          </span>
          <div id="to-hover" className="pl-2 pr-4 py-1 my-auto bg-success rounded">
            <span className={'text-white font-weight-bold'}>Free</span>
            <FontAwesomeIcon
              style={{ position: 'absolute', right: 5, top: 5 }}
              icon={faInfoCircle}
              size={'xs'}
              className="text-white"
            />
            {/* <div
              id="to-show"
              style={{
                position: 'absolute',
                right: '-100%',
                top: '100%',
                backgroundColor: rgba(100, 100, 100, 0.75),
              }}
              className={'text-white p-4 rounded'}
            >
              <p>Your first 20 attendees are free to sign up. Here are the rates after your first 20:</p>
              <h6>£100: 21-50 Attendees</h6>
              <h6>£500: 51-500 Attendees</h6>
              <h6>£1000: 500 or more Attendees</h6>
            </div> */}
          </div>
        </div>
        <div className="extra" style={{display:"flex"}}>
          <div style={{width:"280px",marginRight:"5px"}}>
            <Input
              colSize="4 mr-2"
              name="attendeeEmail"
              id="attendeeEmail"
              type="text"
              placeholder="Enter email address"
              inputValue={attendeeEmail}
              onChange={(e) => setAttendeeEmail(e.target.value)}
              // fieldError={this.state.formFieldErrors.includes('inviteeEmails')}
            />
          </div>
          <div style={{display:"flex"}}>
          <div className="cluster" style={{marginRight:"5px"}}>
            <Button
              fontIcon={faEnvelope}
              addClassName="btn-purple"
              onClick={() => {
                if(attendeeEmail){
                  sendEmailInvitation(attendeeEmail);
                }
              }}
            />
          </div>
          <div className="cluster">
            <Button
              fontIcon={faUserPlus}
              addClassName="btn-purple"
              onClick={() => {
                window.open(`${marketingURL}/mailing`);
              }}
            />
          </div>
          </div>
        </div>
      </HeaderWrapper2>

      <ContentWrapper>
        <div style={{ display: 'flex', width: '100%', background: '#A588AC', marginBottom: 20 }}>
          {attendeesPricing.map((item: any) => {
            return (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  color: (maximumAttendees || 20) === item.max ? 'red' : 'white',
                }}
                key={item.title}
              >
                {/* <div style={{ border: '1px solid white', padding: '10px', textAlign: 'center' }}>{item.title}</div> */}
                {/* <div style={{ border: '1px solid white', padding: '10px', textAlign: 'center' }}>
                  {item.price}
                  {(maximumAttendees || 20) === item.max &&
                    (attendees.length > maximumAttendees ? (
                      <a href="#" onClick={() => openIFrame()}>
                        <FontAwesomeIcon icon={faCheck} size={'lg'} className="action-tick" />
                      </a>
                    ) : (
                      ` (paid)`
                    ))}
                </div> */}
              </div>
            );
          })}
        </div>
        <h2>Attendees ({attendees.length + requesters.length})</h2>
        <Table
          columns={configColumns}
          data={[...attendeesProfiles, ...requesters]}
          className="table table-design table-hover"
        />
      </ContentWrapper>
    </Container>
  );
};

const Loader = styled.div`

  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* semi-transparent black background */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999; /* Ensure the loader is on top of other elements */

  .logo {
    width: 50px; /* Adjust the width as needed */
    animation: rotation 2s infinite linear;
  }

  @keyframes rotation {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(359deg);
    }
  }
}

`

const HeaderWrapper2 = styled.div`
@media only screen and (min-width:550px){
  display: none!important;
}

.main-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color:#fff;
}

.rotate {
  animation: rotation 2s infinite linear;
}

@keyframes rotation {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}

display:flex;
flex-direction: column;

`
const AlertModal = styled.div`
@media (max-width: 768px) {
  .wrap {
    flex-wrap: wrap-reverse;
  }
}
`

const mapStateToProps = function (state: AppState) {
  return {
    ui: state.ui,
    user: state.user,
  };
};

const mapDispatchToProps = function (dispatch: Dispatch) {
  return bindActionCreators(
    {
      setCurrentPage,
      showModal,
      setLoadingOverlay,
    },
    dispatch
  );
};

export default compose(withApollo, connect(mapStateToProps, mapDispatchToProps))(Invited);
