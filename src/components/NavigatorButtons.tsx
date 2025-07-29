import React, { Component } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { AppState } from '../store/root'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { bindActionCreators, Dispatch } from 'redux'
import logo from '../assets/images/inspired_logo.png'
import { UIState } from '../store/ui/types'
import { UserState } from '../store/user/types'
// import { getBrandingColour, getBrandingLogo } from '../store/ui/action'
import profilePlaceholder from '../assets/images/profile_placeholder.png'

interface AppProps {
  ui: UIState,
  user: UserState
}

interface NavigatorButtonsState{
  width: number
}

type Props = AppProps
export class NavigatorButtons extends Component<Props, NavigatorButtonsState> {

  public constructor(props: Props) {
    super(props)
    this.state = {
      width: 0
    }
  }

  public componentDidMount() {
    this.setState({
      width: window.innerWidth
    })
  }

  public render() {
    let width = this.state.width
    if (width > 992) {
      return null
    }
    return (
      <StyledHeader>
        <div className='col-sm-10 mobile-devices '>
          <span className='navigator-btn-left'>
            <FontAwesomeIcon icon='chevron-left' />
          </span>
          <span className='navigator-btn-right'>
            <FontAwesomeIcon icon='chevron-right' />
          </span>
        </div>
      </StyledHeader>
    )
  }
}

const StyledHeader = styled.div`

  background-color: #81D1D0;

  .navigator-btn-left {
      float: left;
      color: white;
  }

  .navigator-btn-right {
    float: right;
    color: white;
  }            
  .mobile-devices{
    display: block;
  }
    
  @media screen and (min-width:576px) {
    .mobile-devices{
      display: none;
    }
  }
`

const mapStateToProps = function (state: AppState) {
  return {
    user: state.user,
    ui: state.ui
  }
}

// const mapDispatchToProps = (dispatch: Dispatch) => {
//   return bindActionCreators({
//     getBrandingColour,
//     getBrandingLogo
//   },
//   dispatch)
// }

export default connect(mapStateToProps, null)(NavigatorButtons)
