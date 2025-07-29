import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Carousel } from 'react-responsive-carousel';
import {  getUserQRCodeScan } from '../../providers/events';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

import { connect } from 'react-redux';
import { bindActionCreators, Dispatch, compose } from 'redux';
import { closeCurrentModal } from '../../store/modal/action';
import { setLoadingOverlay } from '../../store/ui/action';
import { withApollo } from 'react-apollo';
import userImg from '../../assets/images/profile_placeholder.png'

const MemberProfile = (props) => {

  const history = useHistory();

  const [profileImages, setProfileImages] = useState<string[]>([]);
  const [qrCodeRecords, setQRCodeRecords] = useState(undefined)

  const [profile, setProfile] = useState(undefined);

  const date = new Date();

  // Format the date using moment.js
  const formattedDate = moment(date).format('h:mma ddd Do MMM, YYYY');

  useEffect(() => {

    setProfile(props.info.additionalData)

    setProfileImages([
      props.info.additionalData?.user?.avatar
    ])
    

  }, [])

  useEffect(() => {
    
    if(profile){
      
      getUserQRCodeScan(profile?.user?.user?.id,  props.info.additionalData.eventId).then((response: any) => {

        setQRCodeRecords(response?.data?.getUserQRCodeScan)

      }).catch(error => {
      })

    } 

  }, [profile])


 

  const closeModal = () => {
    history.replace(`${location.pathname}`)
    props.closeCurrentModal('MEMBER_PROFILE');
    
  };


  return (
    <StyledQrCodeModal className="modal-content">
      <div className="modal-header">
        <div className="col-7">
          <h4>Attendee Scan</h4>
        </div>
        <div className="row m-0 p-0">
          {/* <button type="submit" onClick={closeModal} className="btn btn-purple btn-edit mr-2" style={{ color: '#fff' }}>
            <FontAwesomeIcon icon={faCheck} />
          </button> */}
          <button type="button" className="btn btn-red" data-dismiss="modal" aria-label="Close" onClick={closeModal}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div> 
      </div>
      <hr />
      <div className="modal-body">
        <Carousel
          showThumbs={false}
          showIndicators={false}
          showStatus={false}
          dynamicHeight={true}
          showArrows={true}
          renderArrowPrev={(clickHandler, hasPrev) => (
            <div
              style={{
                position: 'absolute',
                left: 135,
                top: 0,
                bottom: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                zIndex: 2,
              }}
              onClick={clickHandler}
            >
              {hasPrev ? <FontAwesomeIcon icon={faAngleLeft} style={{ fontSize: 30 }} /> : null}
            </div>
          )}
          renderArrowNext={(clickHandler, hasNext) => (
            <div
              style={{
                position: 'absolute',
                right: 135,
                top: 0,
                bottom: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                zIndex: 2,
              }}
              onClick={clickHandler}
            >
              {hasNext ? <FontAwesomeIcon icon={faAngleRight} style={{ fontSize: 30 }} /> : null}
            </div>
          )}
        >
          {profileImages.map((item: string) => (
            <div>
              <img
                key={item}
                src={item? item : userImg}
                style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover' }}
                alt="my profile picture"
              />
            </div>
          ))}
        </Carousel>
          <div className="row m-0 p-0 col-12 mt-3">
          <div className="row m-0 p-0 col-12 p-0">
            <h6 className="col-6 p-0 font-weight-bold">Name:</h6>
            <h6 className="col-6 p-0">{profile?.user?.firstName} {profile?.user?.lastName}</h6>
          </div>
          <div className="row m-0 p-0 col-12">
            <h6 className="col-6 p-0 font-weight-bold">First Scan:</h6>
            <h6 className="col-6 p-0">{qrCodeRecords?.firstScan ? moment(qrCodeRecords?.firstScan).format("ddd, MMM DD, YYYY h:mm A") : ""}</h6>
          </div>
          <div className="row m-0 p-0 col-12">
            <h6 className="col-6 p-0 font-weight-bold">Last Scan</h6>
            <h6 className="col-6 p-0">{qrCodeRecords?.lastScan ? moment(qrCodeRecords?.lastScan).format("ddd, MMM DD, YYYY h:mm A") : ""}</h6>
          </div>
          <div className="row m-0 p-0 col-12">
            <h6 className="col-6 p-0 font-weight-bold">Booked:</h6>
            <h6 className="col-6 p-0">0</h6>
          </div>
        </div>
        {/* <hr />
        <div className="row m-0 p-0 col-12 mt-3 text-secondary">
          <h5>Next Slot</h5>
          <div className="row m-0 p-0 col-12">
            <h6 className="col-6 p-0">Time:</h6>
            <h6 className="col-6 p-0">5:30pm 24/12/21</h6>
          </div>
          <div className="row m-0 p-0 col-12 p-0">
            <h6 className="col-6 p-0">Location:</h6>
            <h6 className="col-6 p-0">London</h6>
          </div>
          <div className="row m-0 p-0 col-12 p-0">
            <h6 className="col-6 p-0">Venue:</h6>
            <h6 className="col-6 p-0">Jackpot, Room 3</h6>
          </div>
        </div>
      </div>
      <hr />
      <div className="row m-0 p-0 mb-4" style={{ justifyContent: 'center' }}>
        <button
          type="submit"
          onClick={closeModal}
          className="btn btn-purple btn-edit mr-2 green-btn"
          style={{ color: '#fff' }}
        >
          <FontAwesomeIcon icon={faCheck} />
        </button>
        <button
          type="button"
          className="btn btn-red grey-btn"
          data-dismiss="modal"
          aria-label="Close"
          onClick={closeModal}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div> */}
      </div>
    </StyledQrCodeModal>
  );
};

const StyledQrCodeModal = styled.div`
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
`;


const mapStateToProps = function (state: any) {
  return {
    ui: state.ui,
    user: state.user,
  };
};

const mapDispatchToProps = function (dispatch: Dispatch) {
  return bindActionCreators(
    {
      closeCurrentModal,
      setLoadingOverlay,
    },
    dispatch
  );
};

export default compose(withApollo, connect(mapStateToProps, mapDispatchToProps))(MemberProfile);

