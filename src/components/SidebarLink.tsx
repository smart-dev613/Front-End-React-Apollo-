import React, { Component } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { AppState } from '../store/root'
import { connect } from 'react-redux'
import { Translation, Trans } from 'react-i18next'

interface SidebarLinkState {
  currentUrl: string
  currentPage: string
  clickedPage: string
}
interface SidebarLinkProps {
  name: string
  icon: IconProp
  pageKey: string
  currentPage: string
  target: string
}


type Props = SidebarLinkProps

export class SidebarLink extends Component<Props, SidebarLinkState> {
  
  
  public constructor (props: Props){
    super(props);
    this.state = {
      currentUrl: "",
      currentPage: '',
      clickedPage: '',
    }
  }

  // public componentDidMount() {
  //   console.log("current url: ",window.location.pathname.substring(1).split('/')[1])
  //   this.setState({currentUrl:window.location.pathname.substring(1).split('/')[1]})
  // }
  // public componentDidUpdate() {
  //   console.log("current url: ",window.location.pathname.substring(1).split('/')[1])
  //   this.setState({currentUrl:window.location.pathname.substring(1).split('/')[1]})
  // }

  public render() {
    return (
      <Translation>
        {() => (
          <StyledSidebarLink>
            <Link
              to={this.props.target}
              onClick={() => {
                this.setState({ currentPage: location.pathname.slice(16), clickedPage: this.props.name });
              }}
              className={`/${this.props?.name?.toLowerCase()}` === (location.pathname.slice(15).toLowerCase() === '/' ? '/home' : location.pathname.slice(15).toLowerCase() ) ? 'active' : ''}
            >
              <span className="sidebar-icon">
                <FontAwesomeIcon icon={this.props.icon} />
              </span>
              <span className="sidebar-title">
                <Trans i18nKey={`${this.props.name}Link`}>{this.props.name}</Trans>
              </span>
            </Link>
          </StyledSidebarLink>
        )}
      </Translation>
    );
  }
}

const StyledSidebarLink = styled.li`
text-transform: capitalize;
  .active {
    background: #ffffff44 !important;
    border: 2px solid #ffffff44;
  }
`;

const mapStateToProps = function (state: AppState) {
  return {
    currentPage: state.ui.page
  }
}

export default connect(mapStateToProps)(SidebarLink)
