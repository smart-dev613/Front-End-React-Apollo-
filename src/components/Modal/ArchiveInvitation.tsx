import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch, compose } from 'redux';
import { closeCurrentModal } from '../../store/modal/action';
import { setLoadingOverlay } from '../../store/ui/action';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

import Button from '../Form/Button';
import ModalFooter from './ModalFooter';
import { Translation, Trans } from 'react-i18next';
import { withApollo } from 'react-apollo';
import ApolloClient from 'apollo-client';



interface StateProps {
  client: ApolloClient<any>;
  data: any;
  info: any
}


interface DispatchProps {
  closeCurrentModal: (type: string) => void;
  setLoadingOverlay: (loading: boolean) => void;
}

type Props = DispatchProps & StateProps;



class ArchiveInvitation extends Component<Props> {
  public constructor(props: Props) {
    super(props);
    this.closeModal = this.closeModal.bind(this);
  }

  
  handleSubmit  = () => {
    
    this.props.closeCurrentModal('ARCHIVE_INVITATION');
    const { info: { additionalData:{ data: { archiveInvitation, id} }}} = this.props
    archiveInvitation(id)
      .then((next)=>{
        this.props.closeCurrentModal('ARCHIVE_INVITATION');
      })

  }

//   archiveInvitation = useCallback(async (invitationID) => {
//     try {
//       const response: any = await archiveInvitationReq(invitationID, 'ARCHIVED');
//       if (response.data == null) {
//         alert('Failed to archive the invitation');
//       } else {
//         getAttendees();
//       }
//     } catch (error) {
//       console.log(error)
//       alert(error.message);
//     }
//   }, [])


  public closeModal() {
    this.props.closeCurrentModal('ARCHIVE_INVITATION');
  }
  componentDidMount(): void {
  }

  public render() {

   const { info: { additionalData:{ data: { name, email, id} }}} = this.props

    return (
      <Translation>
        {() => (
          <StyledModal className="modal-content">
            <div className="modal-header">
              <h4>
                Confirm Delete
              </h4>
              <div className="float-right">
                <button
                  type="submit"
                  onClick={this.handleSubmit}
                  className="btn btn-purple btn-edit mr-2"
                  style={{ color: '#fff' }}
                >
                  <FontAwesomeIcon icon={faCheck} />
                </button>
                <button type="button" onClick={this.closeModal} className="btn btn-red">
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
            </div>
            <div className="modal-body">
               <h5> Are you sure you want to delete: <strong>{name}</strong>?</h5>
            </div>

          </StyledModal>
        )}
      </Translation>
    );
  }
}

const StyledModal = styled.div`
  @media (max-width: 400px) {
    .wrap {
      flex-wrap: wrap-reverse;
    }
  }
`;

const mapDispatchToProps = function (dispatch: Dispatch) {
  return bindActionCreators(
    {
      closeCurrentModal,
      setLoadingOverlay,
    },
    dispatch
  );
};

export default compose(withApollo, connect(null, mapDispatchToProps))(ArchiveInvitation);
