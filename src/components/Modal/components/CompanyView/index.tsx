import React, { useCallback, useMemo, useState } from 'react';

/** Hooks */
import { useQuery } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';

/** Components */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ModalBody, ModalHeader } from './components/general';
import { faCalendar, faTimes, faUsers, faImage, faUser } from '@fortawesome/free-solid-svg-icons';

/** Utils */
import { GET_EVENT_INFO } from '../../../../gql/queries';

/** Types */
import { Props } from './types';

/** Styles */
import 'react-slideshow-image/dist/styles.css';

import companyLogo from '../../../../assets/images/icons/company_placeholder.jpg';
import profileLogo from '../../../../assets/images/profile_placeholder.png';
import AvatarContainer from '../../../AvatarContainer';
import styled from 'styled-components';
import { showModal } from '../../../../store/modal/action';
import AttendeeDetails from '../../../pages/views/Invited/components/AttendeeDetails';

const CompanyView: React.FC<Props> = (props: Props) => {
  const [cartModalOpen, setCartModalOpen] = useState(false);
  const [linksModalOpen, setLinksModalOpen] = useState(false);

  const [otherUsers, setOtherUsers] = useState<{ firstName: string; lastName: string; avatar: string }[]>([
    {
      firstName: 'Jackson',
      lastName: 'James',
      avatar:
        'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80',
    },
    {
      firstName: 'Gerald',
      lastName: 'James',
      avatar:
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
    },
  ]);

  if (cartModalOpen) {
    setTimeout(() => {
      setCartModalOpen(false);
    }, 2000);
  }
  const { ui, user, closeCurrentModal, detail } = props;
  

  let history = useHistory();

  const {
    data: { eventId, theme, slug, eventType, organiser, company_preferences },
  }: any = useQuery(GET_EVENT_INFO);

  const pageUrl = window.location.pathname.substring(1).split('/')[1];

  const closeModal = () => {
    closeCurrentModal('DATA_DETAIL_MODAL');
  };

  const goToSchedule = useCallback(async () => {

    try {

      let queryParams = `company_id=${detail.data.companyId}`;
      if (pageUrl === 'attendees') {
        queryParams = `company_id=${detail.data?.companyId}&attendee_id=${detail.data?.userId}`;
      }
      history.push(`/${slug}/calendar/calendar?${queryParams}`);
      closeModal();

    } catch (error) {
      console.log(error);
    }
  }, [detail, history, pageUrl]);

  const descriptionText = useMemo(() => {
    const profilePath = pageUrl === 'attendees' ? detail?.data?.profiles : detail?.data?.profiles;
    let profile = profilePath?.find((profile: any) => profile.locale === ui.language);
    if (!profile) {
      profile = profilePath?.find((profile: any) => profile.locale === 'en');
    }
    return profile?.bio;
  }, [detail, ui.language, pageUrl]);

  const keywordList = useMemo(() => {
    const profilePath = pageUrl === 'attendees' ? detail?.data?.profiles : detail?.data?.profiles;
    let profile = profilePath?.find((profile: any) =>  ui.language.includes(profile.locale));
    if (!profile) {
      profile = profilePath?.find((profile: any) => profile.locale === 'en');
    }
    return profile?.categorisedKeywords || [];
  }, [detail, ui.language, pageUrl]);

  // return <AttendeeDetails ui={ui} user={user} closeCurrentModal={closeCurrentModal} detail={detail} />;


  if (pageUrl === 'attendees') {
    return (
      <StyledModal>
         <ModalHeader className="modal-header align-items-center px-4 py-2 mb-2">

         <div className="left-header">
            <span style={{ fontWeight: 'bold'}}>
              {detail?.data?.name}
            </span>
          </div>
          <div className="left-header">
              <button
                className="btn btn-primary btn-edit mr-2"
                style={{ background: '#00abcd' }}
                onClick={() => goToSchedule()}
              >
                <FontAwesomeIcon icon={faCalendar} />
              </button>
              <button className="btn btn-red" onClick={() => closeModal()}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
          </div>

         </ModalHeader>

 
        <ModalBody className="container">

        <div className="d-flex align-items-center space-between mb-4">
          <div className='companyLogo'>
           
            {!(detail.data.avatar || profileLogo) ? (
              <FontAwesomeIcon icon={faUser} size={"3x"} style={{ color: 'white'  }}  />
              ) : (
                <img  alt="logo" src={detail.data.avatar || profileLogo}  />
              )}
            
            </div>
            <div className="mx-4">
              <h6 className="title d-sm-inline-block companyInfo">{detail?.data?.name}</h6>
              <p className="desc-text">{descriptionText || 'This user has not provided an introduction.'}</p>
            </div>
          </div>

          <div className="row">
            <div className="keywords">
              {keywordList.length > 0 &&
                keywordList.map((keyword: any) => <div className="keyword-item">##{keyword}</div>)
              }
            </div>
          </div>
        </ModalBody>
      </StyledModal>
    );
  }

  return (
    <StyledModal>
      <>
        <ModalHeader className="modal-header">
          <div className="left-header">
          <span style={{ fontWeight: 'bold'}}>
              {detail?.data?.name}
            </span>
          </div>
          <div className="left-header">
            <button
              className="btn btn-primary btn-edit"
              style={{ background: '#00abcd' }}
              onClick={() => goToSchedule()}
            >
              <FontAwesomeIcon icon={faCalendar} />
            </button>
            <button className="btn btn-red" onClick={() => closeModal()}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        </ModalHeader>
        <ModalBody className="container">
        <div className="d-flex align-items-center space-between mb-4">
          <div className="companyLogo">
           
            {!detail.data.logoURL? (
              <FontAwesomeIcon icon={faImage} size={"3x"} style={{ color: 'white'  }}  />
              ) : (
                <img  alt="logo" src={detail.data.logoURL}  />
              )}
            
          </div>
         
          <div className="mx-4">
              <h6 className="title d-sm-inline-block companyInfo">{detail.data.name}</h6>
              <p>{descriptionText}</p>
          </div>
          </div>
          <div className="row">
            
          </div>

          <div className="row">
            <div className="keywords">
              {keywordList.length > 0
                ? keywordList.map((keyword: any) => <div className="keyword-item">#{keyword}</div>)
                : ['']}
            </div>
          </div>
        </ModalBody>
      </>
    </StyledModal>
  );
};

const StyledModal = styled.div`
  .modal-header {
    padding: 1rem 1rem 0 1rem;
    border-bottom: none;
  }

  .green-btn {
    background-color: #138714 !important;
  }

  .grey-btn {
    background-color: #878788 !important;
  }

  .companyLogo {
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink : 0;
    flex-direction: column;
    background:  #e6e6e6;
    box-shadow: 0 0 5px #8a8a8a ;
    width: 65px !important;
    height: 65px !important;
    img {
      border-radius: 100%;
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  .companyInfo {
    font-family: "robotoregular, Helvetica, Arial, sans-serif";
    font-weight: bold;
    p {
      font-size: 12px;
    }
  }

  .modal-body {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    img {
      width: 100%;
    }
  }

  hr {
    margin-top: 1rem;
    margin-bottom: 1rem;
    width: 100%;
    border: 0;
    border-top: 1px solid rgba(33, 33, 33, 0.1);
  }

  .avatar {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    //border-radius: 50%;
    //box-shadow: 0 0 5px #8a8a8a;
    //width: 120px;
    //height: 120px;

    img {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      object-fit: cover;
    }
  }

  h6 {
    margin-top: 5px;
  }

  .keywords {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;

    .keyword-item {
      background: #cacaca;
      padding: 2px 15px;
      border-radius: 5px;
    }
  }

  @media screen and (max-width: 450px) {
    
    .companyLogo {
      width: 44px !important;
      height: 44px !important;
      
    }
    .keywords {
      .keyword-item {
        background: #cacaca;
        padding: 2px 8px;
        border-radius: 5px;
        font-size: 12px;
      }
    
      
      .keywords {
        gap: 6px;
      }

    .desc-text {
      font-size: 12px;
    }

  }

`;
export default CompanyView;
