import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch, compose } from 'redux';
import { closeCurrentModal } from '../../store/modal/action';
import { setLoadingOverlay } from '../../store/ui/action';
import { fetchCarts } from '../../store/user/action';
import { getPlatformEventMembers } from '../../providers/events';
import { Translation } from 'react-i18next';
import { withApollo } from 'react-apollo';
import ApolloClient from 'apollo-client';

import ContentItemContent from './components/ContentItemContent';
import ContentItemView from './components/ContentItemView';

interface DayData {
  day: string;
  date: string;
}

interface StateProps {
  user: any;
  ui: any;
  client: ApolloClient<any>;
  clicked: string;
  info: any;
  selectedDay: DayData;
  currentSlotStatus: string;
  bookingSlot: any;
  fetchCarts: any;
  getPlatformEventMembers: any;
}

interface DispatchProps {
  closeCurrentModal: (type: string) => void;
  setLoadingOverlay: (loading: boolean) => void;
}

type Props = DispatchProps & StateProps;

interface NewVenueState {
  isEdit: boolean;
}

class BookSchedule extends Component<Props, NewVenueState> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isEdit: false,
    };
  }


  setIsEdit(val: boolean) {
    this.setState({
      isEdit: val,
    });
  }

  public render() {
    const { isEdit } = this.state;
    return (
      <Translation>
        {() => (
          <StyledWrapper className="modal-content" isEdit={isEdit}>
            {isEdit ? (
              <ContentItemContent
                ui={this.props.ui}
                user={this.props.user}
                closeCurrentModal={this.props.closeCurrentModal}
                data={this.props.info.additionalData}
                setIsEdit={(val: boolean) => this.setIsEdit(val)}
              />
            ) : (
              <ContentItemView
                ui={this.props.ui}
                user={this.props.user}
                closeCurrentModal={this.props.closeCurrentModal}
                data={this.props.info.additionalData}
                setIsEdit={(val: boolean) => this.setIsEdit(val)}
                fetchCarts={this.props.fetchCarts}

              />
            )}
          </StyledWrapper>
        )}
      </Translation>
    );
  }
}

const StyledWrapper = styled.div<any>`
  padding: 5px 0;
  height: auto;
  left: 50%;
  top: 50%;
  transform: translateX(-50%);
  max-width: ${(props) => (props.isEdit && props.isEdit ? '800px' : '600px')};
  width: 100%;
  @media (max-width: 768px) {
    .wrap {
      flex-wrap: wrap-reverse;
    }
  }

  .modal-header {
    border-bottom: none;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  #venueOptions {
    margin-top: 1em;
    width: 50%;
  }

  .display {
    display: inline;
  }

  .space {
    border: 1px solid #ced4da;
    padding: 1% 3%;
  }

  .display {
    display: inline;
    margin: 0 5px;
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
      fetchCarts,
      getPlatformEventMembers,
    },
    dispatch
  );
};

export default compose(withApollo, connect(mapStateToProps, mapDispatchToProps))(BookSchedule);
