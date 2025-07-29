import React, { useState, useMemo, useCallback } from 'react';

/** Hooks */
import { useQuery } from '@apollo/react-hooks';
import { useHistory } from 'react-router-dom';

/** Components */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ModalBody, ModalHeader } from './components/general';
import { faCalendar, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';

/** Utils */
import _ from 'lodash';
import { GET_EVENT_INFO } from '../../../../gql/queries';

/** Types */
import { Props } from './types';

/** Styles */
import 'react-slideshow-image/dist/styles.css';

import companyLogo from '../../../../assets/images/icons/company_placeholder.jpg';
import profileLogo from '../../../../assets/images/profile_placeholder.png';
import AvatarContainer from '../../../AvatarContainer';
import styled from 'styled-components';

const FamilyLinks: React.FC<Props> = (props: Props) => {
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

  const { closeCurrentModal, detail } = props;

  const handleSave = () => {
    closeModal();
  };
  const closeModal = () => {
    closeCurrentModal('FAMILY_LINKS');
  };

  return (
    <StyledModal>
      <div className="modal-header row">
        <div className="col10" />
        <h5 className="font-weight-bold">Family Links</h5>
        <div>
          <button
            className="btn btn-primary btn-edit mr-2"
            style={{ background: '#00abcd' }}
            onClick={() => handleSave()}
          >
            <FontAwesomeIcon icon={faSave} />
          </button>
          <button className="btn btn-red" onClick={() => closeModal()}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      </div>
      <hr />
      <ModalBody className="container">
        <div className="row m-0 p-0 align-items-center col-12">
          <ul className="list-group">
            {otherUsers.map((user, idx) => (
              <li key={`${user.firstName}-${idx}`} className="list-group-flush p-1">
                <input className="form-check-input me-1 p-1" type="checkbox" value="" aria-label="..." />
                {[user.firstName, user.lastName].filter(Boolean).join(' ')}
              </li>
            ))}
          </ul>
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
export default FamilyLinks;
