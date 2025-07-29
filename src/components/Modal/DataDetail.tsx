import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { AppState } from '../../store/root';
import { bindActionCreators, Dispatch } from 'redux';
import { closeCurrentModal } from '../../store/modal/action';
import { setLoadingOverlay } from '../../store/ui/action';
import { getCompaniesDetails } from '../../store/user/action';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { Translation } from 'react-i18next';
import ContentItem from '../ContentItem';
import CompanyView from './components/CompanyView';
// import ContentItem from './ContentItem'
// import ListFormat from '../ListFormat'

interface DispatchProps {
  user: any;
  ui: any;
  closeCurrentModal: (type: string) => void;
  setLoadingOverlay: (loading: boolean) => void;
  info: { additionalData: AdditionalData };
}

interface AdditionalData {
  data?: { Name: string; Introduction?: string; Img?: string; type?: string };
  props?: {
    loadEvents?: (arg0: string) => void;
  };
}

type Props = DispatchProps;

interface NotificationState {
  companyName: string;
  companyUrl: string;
  companyEmail: string;
  formFieldErrors: string[];
  formErrorMsg: string;
  value: string;
  headerValue: string;
}

interface NotificationItems {
  id: number;
  name: string;
  event: string;
  person: string;
  location: string;
  time: string;
  date: string;
}

class DataDetail extends Component<Props, NotificationState> {
  public constructor(props: Props) {
    super(props);

    this.state = {
      companyName: null,
      companyUrl: null,
      companyEmail: null,
      formFieldErrors: [],
      formErrorMsg: null,
      value: '',
      headerValue: '',
    };
    this.closeModal = this.closeModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  public closeModal() {
    this.props.closeCurrentModal('DATA_DETAIL_MODAL');
  }

  public handleChange(event: any, type: string) {
    if (type == 'title') {
      this.setState({ headerValue: event.target.value });
    } else if (type == 'content') {
      this.setState({ value: event.target.value });
    }
  }

  public render() {
    const companyData = this.props.info.additionalData as any;
    return (
      <Translation>
        {() => (
          <StyledNotificationCodeModal className="modal-content">
            {this.props.info.additionalData.data?.type === 'content' ? (
              <>
                <span className="flex2">
                  <button type="submit" className="btn" onClick={this.closeModal}>
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </span>
                <div className="modal-body">
                  {/*
                        // @ts-ignore */}
                  <ContentItem detail={companyData} {...this.props} />
                </div>
              </>
            ) : (
              // Note: this component is handling company and attendee details view
              <CompanyView
                ui={this.props.ui}
                user={this.props.user}
                closeCurrentModal={this.props.closeCurrentModal}
                detail={companyData}
              />
            )}
          </StyledNotificationCodeModal>
        )}
      </Translation>
    );
  }
}

const StyledNotificationCodeModal = styled.div`
  padding: 5px 15px;
  height: auto;
  left: 50%;
  top: 50%;
  transform: translateX(-50%);
  width: 600px;
  .modal-content {
    height: 500px;
  }
  .flex2 {
    display: inline-block;
    width: auto;
    position: absolute;
    right: 0;
    z-index: 1000000;
    padding: 12px 10px 0px 0px;

    button {
      background: #c83f3f;
      color: white;
      font-size: 1.8rem;
      line-height: 4px;
      padding: 0 0.2em;
    }
  }
  @media (max-width: 768px) {
    width: 90%;
    .wrap {
      flex-wrap: wrap-reverse;
    }
  }
  .flex2 {
    // display: flex;
    // justify-content: flex-end;
  }
  .close-button {
    // margin-left: auto;
    padding: 1rem;
    z-index: 100;
  }

  .content-text {
    resize: none;
  }

  .modal-header {
    border-bottom: 0;
  }

  input {
    display: flex;
    flex: 1;
  }
`;
const mapStateToProps = (state: AppState) => ({
  user: state.user,
  ui: state.ui,
});

const mapDispatchToProps = function (dispatch: Dispatch) {
  return bindActionCreators(
    {
      closeCurrentModal,
      setLoadingOverlay,
      // getAllCompanies
      getCompaniesDetails,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(DataDetail);
