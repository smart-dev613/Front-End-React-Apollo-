import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { AppState } from '../../store/root';
import { bindActionCreators, Dispatch } from 'redux';
import { setCurrentPage } from '../../store/ui/action';
import { Translation, Trans } from 'react-i18next';

import LanguagePicker from '../LanguagePicker';
import NotesFormat from '../NotesFormat';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NotesModal from '../Modal/NotesModal';
import { ShowModal } from '../../store/modal/types';
import { showModal } from '../../store/modal/action';
import { UIState } from '../../store/ui/types';

interface StateProps {
  page: string;
}

interface DispatchProps {
  setCurrentPage: (page: string) => void;
  showModal: ShowModal;
  ui: UIState;
}

interface NoteItems {
  id: number;
  heading: string;
  time: string;
  date: string;
  content: string;
}

interface NotesProps {
  notesArray: NoteItems[];
}

type Props = DispatchProps & StateProps;

export class Notes extends Component<Props, NotesProps> {
  public constructor(props: Props) {
    super(props);
    (this.state = {
      notesArray: [
        {
          id: 1,
          heading: 'Meeting',
          time: '10 am',
          date: '15th Oct',
          content:
            'Apollo Investment Corporation is a US-domiciled publicly traded private equity closed-end fund and an affiliate',
        },
        {
          id: 2,
          heading: 'Meeting',
          time: '12 am',
          date: '15th Oct',
          content:
            'Astec Industries, Inc., incorporated on August 9, 1972, designs, engineers, manufactures and markets equipment and components',
        },
        {
          id: 3,
          heading: 'Birthday',
          time: '7 pm',
          date: '16th Oct',
          content:
            'Astec Industries, Inc., incorporated on August 9, 1972, designs, engineers, manufactures and markets equipment and components ',
        },
        {
          id: 4,
          heading: 'Hair & SPA',
          time: '6 pm',
          date: '15th Oct',
          content:
            'Apollo Investment Corporation is a US-domiciled publicly traded private equity closed-end fund and an affiliate',
        },
      ],
    }),
      (this.openNotesModal = this.openNotesModal.bind(this));
  }

  public componentDidMount() {
    this.props.setCurrentPage('Notes');
  }

  public delete = () => {
    console.log('delete');
  };

  public openNotesModal() {
    this.props.showModal('NOTES_MODAL', 'lg');
  }

  public render() {
    const filteredData = this.state.notesArray;
    return (
      <Translation>
        {() => (
          <StyledNotes className="main-container container">
            <div className="notes-add">
              <button className="add-icon" onClick={this.openNotesModal}>
                {' '}
                <FontAwesomeIcon icon="plus" className="fa-2x" />
              </button>
            </div>
            <div className="row no-side-margin notes-format">
              {filteredData.map((list: NoteItems) => (
                <NotesFormat key={list.id} ListData={list} action={'notes'} delete={this.delete} />
              ))}
            </div>

            {/* <LanguagePicker /> */}
          </StyledNotes>
        )}
      </Translation>
    );
  }
}

const StyledNotes = styled.div`
  height: calc(100vh - 56px);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

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

  .notes-format {
    margin 15px 15px;
    display: block;
  }

  .notes-add {
    position: relative;
    margin-left: auto;
    margin-top: 55%;
  }

  .add-icon {
    color: #81D1D0;
    outline: 0;
    background-color: transparent;
    border: 0;
  }

  @media only screen and (min-width: 578px) {
    .notes-add {
      margin-top: 0%;
    }
  }
`;

const mapStateToProps = function (state: AppState) {
  return {
    page: state.ui.page,
    ui: state.ui,
  };
};

const mapDispatchToProps = function (dispatch: Dispatch) {
  return bindActionCreators(
    {
      setCurrentPage,
      showModal,
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Notes);
