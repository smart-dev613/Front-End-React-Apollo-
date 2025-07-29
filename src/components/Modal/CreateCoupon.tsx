import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch, compose } from 'redux'
import { closeCurrentModal } from '../../store/modal/action'
import { setLoadingOverlay } from '../../store/ui/action'
import { Translation } from 'react-i18next'
import { withApollo } from 'react-apollo'
import ApolloClient from 'apollo-client'

import CouponItemContent from './components/CouponItemContent';


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
  organiser: any
  bookingSlot: any
}

interface DispatchProps {
  closeCurrentModal: (type: string) => void
  setLoadingOverlay: (loading: boolean) => void
}

type Props = DispatchProps & StateProps

interface NewVenueState {
  isEdit: boolean;
}

class CreateCoupon extends Component<Props, NewVenueState> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isEdit: false
    }
  }

  setIsEdit(val: boolean) {
    this.setState({
      isEdit: val
    })
  }


  public render() {
    const { isEdit } = this.state;
    return (
      <Translation>
        {
          () =>
            <StyledQrCodeModal className='modal-content'>
              <CouponItemContent
                ui={this.props.ui}
                user={this.props.user}
                closeCurrentModal={this.props.closeCurrentModal}
                data={this.props.info.additionalData}
                setIsEdit={(val: boolean) => this.setIsEdit(val)}
              />
            </StyledQrCodeModal>
        }
      </Translation>
    )
  }
}

const StyledQrCodeModal = styled.div`
  padding: 5px 15px;
  height: auto;
  left: 50%;
  top: 50%;
  transform: translateX(-50%);
  width: 800px;
  @media (max-width: 768px) {
    .wrap {
      flex-wrap: wrap-reverse;
    }
  }
  /* Extra small devices (phones, 600px and down) */
  @media only screen and (max-width: 600px) {
      max-width: 350px !important;
    }

    /* Small devices (portrait tablets and large phones, 600px and up) */
    @media only screen and (min-width: 600px) {
      max-width: 350px !important;
    }

    /* Medium devices (landscape tablets, 768px and up) */
    @media only screen and (min-width: 768px) {
      max-width: 350px!important;
    }
    /* Large devices (laptops/desktops, 992px and up) */
  @media only screen and (min-width: 992px) {
    max-width: 800px!important;
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

export default compose(withApollo, connect(mapStateToProps, mapDispatchToProps))(CreateCoupon)
