import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch, compose } from 'redux'
import { closeCurrentModal } from '../../store/modal/action'
import { setLoadingOverlay } from '../../store/ui/action'
import { Translation } from 'react-i18next'
import { withApollo } from 'react-apollo'
import ApolloClient from 'apollo-client'

import CreateClusterContent from './components/CreateClusterContent';

interface DayData {
  day: string,
  date: string
}

interface StateProps {
  user: any;
  ui: any;
  client: ApolloClient<any>
  clicked: string
  info: any
  selectedDay: DayData
  currentSlotStatus: string
  bookingSlot: any
}

interface DispatchProps {
  closeCurrentModal: (type: string) => void
  setLoadingOverlay: (loading: boolean) => void
}

type Props = DispatchProps & StateProps

interface NewVenueState {
  name: string
  maxAttendees: any
  formFieldErrors: string[]
  formErrorMsg: string
  venues: any
  venueID: string
  eventId: string
  space: number
  id: string
  invitationStatus: string,
  endslots: any[],
  selectedEndSlot: string,
  selectedStartSlot: string
}

class CreateCluster extends Component<Props, NewVenueState> {
  public render() {
    return (
      <Translation>
        {
          () =>
            <StyledQrCodeModal className='modal-content'>
              <CreateClusterContent
                ui={this.props.ui}
                user={this.props.user}
                closeCurrentModal={this.props.closeCurrentModal}
                data={this.props.info.additionalData}
              />
            </StyledQrCodeModal>
        }
      </Translation>
    )
  }
}

const StyledQrCodeModal = styled.div`
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
`

const mapStateToProps = function (state: any) {
  return {
    ui: state.ui,
    user: state.user
  }
}

const mapDispatchToProps = function (dispatch: Dispatch) {
  return bindActionCreators({
    closeCurrentModal,
    setLoadingOverlay
  }, dispatch)
}

export default compose(withApollo, connect(mapStateToProps, mapDispatchToProps))(CreateCluster)
