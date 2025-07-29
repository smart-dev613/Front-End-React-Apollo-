import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch, compose } from 'redux';
import { closeCurrentModal } from '../../store/modal/action';
import { setLoadingOverlay } from '../../store/ui/action';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
// import { getAllCompanies } from '../../store/user/action'
import { newVenue, updateVenue } from '../../providers/events';
// import { validateEmail } from '../../utils/helper'
import Form from '../Form/Form';
import FormGroup from '../Form/FormGroup';
import FormRow from '../Form/FormRow';
import Label from '../Form/Label';
import Input from '../Form/Input';
import Button from '../Form/Button';
import ModalFooter from './ModalFooter';
import { Translation, Trans } from 'react-i18next';
import { withApollo } from 'react-apollo';
import ApolloClient from 'apollo-client';
import { GET_EVENT_INFO } from '../../gql/queries';
import Select from '../Form/Select';
import { UIState } from '../../store/ui/types';
import { AppState } from '../../store/root';

interface StateProps {
  client: ApolloClient<any>;
  info: ObjectStructure;
  
}

interface ObjectStructure {
  additionalData: {
    venueDetails: {
      name: string;
      maxAttendees: number;
      id: string;
      type: object;
      link: string;
    };
    loadVenues: () => void;
  };
}

interface DispatchProps {
  closeCurrentModal: (type: string) => void;
  setLoadingOverlay: (loading: boolean) => void;
}

type Props = DispatchProps & StateProps;

interface UpdateVenueState {
  name: string;
  maxAttendees: any;
  formFieldErrors: string[];
  formErrorMsg: string;
  type: object;
  link: string;
  typeOptions: object[];
  optionIndex: number;
}


class UpdateVenue extends Component<Props, UpdateVenueState> {
  public constructor(props: Props) {
    super(props);

    this.state = {
      type: null,
      link: '',
      name: '',
      maxAttendees: 1,
      formFieldErrors: [],
      formErrorMsg: '',
      typeOptions: [
        { label: 'Generic', value: 'GENERIC' },
        { label: 'Online', value: 'ONLINE' },
        { label: 'Room', value: 'ROOM' },
        { label: 'Hall', value: 'HALL' },
        { label: 'Seat', value: 'SEAT' },
        { label: 'Table', value: 'TABLE' },
        { label: 'Slot', value: 'SLOT' },
        { label: 'Court', value: 'COURT' },
        { label: 'Berth', value: 'BERTH' },
        { label: 'Theatre', value: 'THEATRE' },
        { label: 'Pitch', value: 'PITCH' },
      ],
      optionIndex:0
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.inputChange = this.inputChange.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  public componentDidMount() {
    if (Object.keys(this.props.info.additionalData)) {
      this.setState({
        name: this.props.info.additionalData.venueDetails.name,
        maxAttendees: this.props.info.additionalData.venueDetails.maxAttendees,
        //@ts-ignore
        // type: this.props.info.additionalData.venueDetails.type.value,
        type: this.state.typeOptions.find(opt => opt.value === this.props.info.additionalData.venueDetails?.type?.toUpperCase()),
        link: this.props.info.additionalData.venueDetails.link,
      });
    }


  }

  public inputChange(e: React.ChangeEvent<HTMLInputElement>): void {
    e.persist();
    let keys = ['name', 'maxAttendees', 'type', 'link'];
    let target = Reflect.get(e, 'target');

    let stateChange = {};

    keys.forEach((thisKey) => {
      if (Reflect.get(target, 'id') === thisKey) {
        Reflect.set(stateChange, thisKey, Reflect.get(target, 'value'));
      }
    });
    this.setState(stateChange);
  }

  public handleSubmit(e: React.MouseEvent | React.FormEvent) {
    const { eventId } = this.props.client.readQuery({ query: GET_EVENT_INFO });

    e.preventDefault();
    this.props.setLoadingOverlay(true);
    let formData = {
      name: this.state.name,
      maxAttendees: parseInt(this.state.maxAttendees),
      //@ts-ignore
      type: this.state.type.value,
      link: this.state.link,
      id: this.props.info.additionalData.venueDetails.id,
    };
    let errorArr = [];

    // form validation
    if (!formData.name) errorArr.push('name');
    if (!formData.maxAttendees) errorArr.push('maxAttendees');

    this.setState({ formFieldErrors: errorArr, formErrorMsg: null }, () => {
      if (this.state.formFieldErrors.length >= 1) {
        this.setState({ formErrorMsg: 'Please complete the missing fields' }, () =>
          this.props.setLoadingOverlay(false)
        );
      } else if (Object.keys(this.props.info.additionalData)) {

        updateVenue(formData)
          .then((result: any) => {
            this.closeModal();
            this.props.info.additionalData.loadVenues();
            this.props.setLoadingOverlay(false);
          })
          .catch((err: any) => {
            if (err instanceof DOMException) {
              this.props.setLoadingOverlay(false);
            } else {
              this.props.setLoadingOverlay(false);
              console.log(err);
            }
          });
      }
    });
  }

  public closeModal() {
    this.props.closeCurrentModal('UPDATE_VENUE');
  }

  public render() {

    const { formFieldErrors, formErrorMsg } = this.state;
   
    return (
      <Translation>
        {() => (
          <StyledQrCodeModal className="modal-content">
            <div className="modal-header">
              <h4>
                <Trans i18nKey="UpdateVenueHeader">trans</Trans>
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
              <Form id="NewCompany" onSubmit={this.handleSubmit}>
                <Label labelFor="name" colSize="2">
                  <Trans i18nKey="NewVenueName">trans</Trans>
                </Label>
                <Input
                  onChange={this.inputChange}
                  id="name"
                  name="name"
                  type="text"
                  colSize="4"
                  inputValue={this.state.name}
                  fieldError={formFieldErrors.includes('name')}
                />
                <Label addClassName="pl-2" labelFor="maxAttendees" colSize="2">
                  <Trans i18nKey="NewVenueAttendees">trans</Trans>
                </Label>
                <Input
                  onChange={this.inputChange}
                  id="maxAttendees"
                  name="maxAttendees"
                  type="number"
                  colSize="4"
                  min={1}
                  inputValue={this.state.maxAttendees}
                  fieldError={formFieldErrors.includes('maxAttendees')}
                />
                <Label labelFor="type" addClassName="pl-2">
                  <Trans i18nKey="Type">Type</Trans>
                </Label>
                {/*//@ts-ignore*/}
                <Select
                  colSize="4"
                  onChange={(value) => {
                    this.setState({ type: value });
                  }}
                  options={this.state.typeOptions}
                  // defaultValue={this.state.type}
                  // defaultValue={JSON.parse(localStorage.getItem('venue_type'))}
                  defaultValue={this.state.type}
                  // defaultValue={}
                  // value={this.state.typeOptions[0]}
                  value={this.state.type}
                />
                <Label addClassName="pl-2" labelFor="link" colSize="2">
                  <Trans i18nKey="MapLink">Link (Teams, Zoom, Map, PDF) </Trans>
                </Label>
                <Input
                  onChange={this.inputChange}
                  id="link"
                  name="link"
                  type="text"
                  colSize="4"
                  inputValue={this.state.link}
                  fieldError={formFieldErrors.includes('link')}
                />
              </Form>
            </div>
            {formErrorMsg && <div className="alert alert-danger text-center mt-3">{formErrorMsg}</div>}
          </StyledQrCodeModal>
        )}
      </Translation>
    );
  }
}

const StyledQrCodeModal = styled.div`
  @media (max-width: 768px) {
    .wrap {
      flex-wrap: wrap-reverse;
    }
  }
`;

const mapStateToProps = function (state: AppState) {
  return {
    ui: state.ui,
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

export default compose(withApollo, connect(null, mapDispatchToProps))(UpdateVenue);
