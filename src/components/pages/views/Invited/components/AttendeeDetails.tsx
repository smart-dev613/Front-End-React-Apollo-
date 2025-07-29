import React, { useState } from 'react';

/** Hooks */

/** Components */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import 'react-slideshow-image/dist/styles.css';
import profileLogo from '../../../../../assets/images/profile_placeholder.png';
import styled from 'styled-components';
import { ModalBody } from './modalStyled';
import AvatarContainer from '../../../../AvatarContainer';

const AttendeeDetails: React.FC<any> = (props) => {
  const [descriptionText, setDescriptionText] = useState(null);
  const [keywordList, setKeywordList] = useState(['product', 'cart']);

  const { ui, user, closeCurrentModal, detail } = props;

  const closeModal = () => {
    closeCurrentModal('DATA_DETAIL_MODAL');
  };

  return (
    <StyledModal>
      <div className="modal-header row mb-4 px-4">
        <div className="col10">
          <AvatarContainer className="mb-2">
            <img alt="logo" src={detail.data.invitee.avatar || profileLogo} />
          </AvatarContainer>
        </div>
        <div>
          <button className="btn btn-red" onClick={() => closeModal()}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      </div>
      <ModalBody className="container">
        <div className="justify-content-center align-items-center">
          <h5 className="title d-none d-sm-inline-block font-weight-bold ">
            {[detail.data.invitee.user.firstName, detail.data.invitee.user.lastName].filter(Boolean).join(' ')}
          </h5>
          <p>{descriptionText || 'This user has not provided an introduction.'}</p>
          <div className="keywords">
            {keywordList.length > 0 && keywordList.map((keyword) => <div className="keyword-item">#{keyword}</div>)}
          </div>
        </div>
        <hr />
        <div className={'col-12 p-0 m-0'}>
          <div className={'row col-12 p-0 m-0 mb-2'}>
            <h6 className={'col-4 m-0 p-0 font-weight-bold'}>Last Purchase:</h6>
            <p className={'col-8 m-0 p-0'}>Haircut</p>
          </div>
          <div className={'row col-12 p-0 m-0 mb-2'}>
            <h6 className={'col-4 m-0 p-0 font-weight-bold'}>Total Purchases:</h6>
            <p className={'col-8 m-0 p-0'}>20</p>
          </div>
          <div className={'row col-12 p-0 m-0 mb-2'}>
            <h6 className={'col-4 m-0 p-0 font-weight-bold'}>Last Visit:</h6>
            <p className={'col-8 m-0 p-0'}>24/12/21</p>
          </div>
        </div>
        <hr />
        <div className={'row col-12 p-0 m-0 mb-2'}>
          <div className={'col-6 p-0 m-0'}>
            <h5 className={'font-weight-bold'}>Scans</h5>
            <div className={'row col-12 p-0 m-0 mb-2'}>
              <h6 className={'col-4 m-0 p-0 font-weight-bold'}>Name</h6>
              <p className={'col-8 m-0 p-0'}>Gerald James</p>
            </div>
            <div className={'row col-12 p-0 m-0 mb-2'}>
              <h6 className={'col-4 m-0 p-0 font-weight-bold'}>Booked</h6>
              <p className={'col-8 m-0 p-0'}>2</p>
            </div>
          </div>
          <div className={'col-6 p-0 m-0'}>
            <h5 className={'font-weight-bold'}>Next Slot</h5>
            <div className={'row col-12 p-0 m-0 mb-2'}>
              <h6 className={'col-4 m-0 p-0 font-weight-bold'}>Time</h6>
              <p className={'col-8 m-0 p-0'}>5:30 pm, 24/12/21</p>
            </div>
            <div className={'row col-12 p-0 m-0 mb-2'}>
              <h6 className={'col-4 m-0 p-0 font-weight-bold'}>Location</h6>
              <p className={'col-8 m-0 p-0'}>London</p>
            </div>
            <div className={'row col-12 p-0 m-0 mb-2'}>
              <h6 className={'col-4 m-0 p-0 font-weight-bold'}>Venue</h6>
              <p className={'col-8 m-0 p-0'}>Jackpot, Room 3</p>
            </div>
          </div>
        </div>
      </ModalBody>
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
`;
export default AttendeeDetails;
