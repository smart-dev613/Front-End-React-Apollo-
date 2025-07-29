import React, { Component } from "react";
import { useState } from 'react';
import styled from "styled-components";
import { AppState } from "../store/root";
import { UIState } from "../store/ui/types";
import { connect } from "react-redux";
import { compose } from "redux";
import { withApollo } from "react-apollo";
import ApolloClient from "apollo-client";

import { GET_EVENT_INFO } from "../gql/queries";
import { PAGE_MAPPING } from "../constants/menu";
import SidebarLink from "./SidebarLink";
import { IconProp } from "@fortawesome/fontawesome-svg-core";

export enum PlatformEventMenuPage {
  HOME = 'HOME',
  CALENDAR = 'CALENDAR',
  CONTENT = 'CONTENT',
  COMPANIES = 'COMPANIES',
  ATTENDEES = 'ATTENDEES',
  CONTENT_PRICING = 'CONTENT_PRICING',
  TICKET = 'TICKET',
  // CLUSTER = 'CLUSTER'
}

const DEFAULT_MENUS_ORDER = [
  PlatformEventMenuPage.HOME,
  PlatformEventMenuPage.TICKET,
  PlatformEventMenuPage.CALENDAR,
  PlatformEventMenuPage.COMPANIES,
  PlatformEventMenuPage.CONTENT,
  PlatformEventMenuPage.ATTENDEES,
  PlatformEventMenuPage.CONTENT_PRICING,
  // PlatformEventMenuPage.CLUSTER,
]

const MENUS_DATA = {
  [PlatformEventMenuPage.HOME]: { icon: 'home', link: '/' },
  [PlatformEventMenuPage.CALENDAR]: { icon: 'calendar', link: '/calendar' },
  [PlatformEventMenuPage.TICKET]: { icon: 'ticket', link: '/ticket' },
  [PlatformEventMenuPage.CONTENT]: { icon: 'users', link: '/content' },
  [PlatformEventMenuPage.COMPANIES]: { icon: 'search', link: '/companies' },
  [PlatformEventMenuPage.ATTENDEES]: { icon: 'search', link: '/attendees' },
  [PlatformEventMenuPage.CONTENT_PRICING]: { icon: 'search', link: '/revenue-management' },
  // [PlatformEventMenuPage.CLUSTER]: { icon: 'search', link: '/cluster-management' },
}

interface SidebarState {
  theme: {
    primaryColour?: string;
    secondaryColour?: string;
  };
  slug: string;
  menus?: any[];
  menusOrder?: PlatformEventMenuPage[];
}

interface StateProps {
  isLoggedIn?: boolean;
  ui: UIState;
  client: ApolloClient<any>;
}

type Props = StateProps;
export class Sidebar extends Component<Props, SidebarState> {
  public constructor(props: Props) {
    super(props);
    this.state = {
      theme: {},
      slug: "",
      menus: [],
      menusOrder: []
    };
  }

  public componentDidMount() {

    const { theme, slug, menus, menusOrder, eventType } = this.props.client.readQuery({
      query: GET_EVENT_INFO,
    });

    this.setState({ theme, slug, menus: menus || PAGE_MAPPING[eventType], menusOrder: menusOrder || DEFAULT_MENUS_ORDER });
    // this.state.menus.push('Ticket')

  }

  public handleClick (title:string) {
    const currentUrl = window.location.pathname.substring(1).split('/')[1]
    if(currentUrl===title){
      return true
    }
  }

  public render() {

    const menusDict = this.state.menus.reduce((acc: any, curr: any) => {
      acc[curr.type] = curr;
      return acc;
    }, {});

    


    return (
      <StyledNavigation
        className="sb"
        theme={this.state.theme}
        slug={this.state.slug}
        // nameCheckBox={this.state.nameCheckBox}
      >
        <div id="wrapper">
          <div id="sidebar-wrapper"> 
            <aside id="sidebar">
              <ul id="sidemenu" className="sidebar-nav">
                {
                  this.state.menusOrder.map((item: PlatformEventMenuPage) => {
                    // return menusDict[item].adminOnly && (
                     
                      
                    return (
                      <>
                      <SidebarLink
                        name={menusDict[item].label}
                        icon={MENUS_DATA[item].icon as IconProp}
                        pageKey={menusDict[item].type}
                        target={`/${this.state.slug}${MENUS_DATA[item].link}`}
                      /> 
                      </>
                    )
                  })
                }
              </ul>
            </aside>
          </div>
        </div>
      </StyledNavigation>
    );
  }
}

const StyledNavigation = styled.div<SidebarState>`
  #wrapper {
    padding-left: 0;
    -webkit-transition: all 0.5s ease;
    -moz-transition: all 0.5s ease;
    -o-transition: all 0.5s ease;
    transition: all 0.5s ease;

    @media (min-width: 577px) {
      & {
        padding-left: 185px;

        #sidebar-wrapper {
          width: 160px;
        }
      }
    }

    @media (min-width: 768px) {
      & {
        padding-left: 225px;

        #sidebar-wrapper {
          width: 220px;
        }
      }
    }

    @media (max-width: 576px) {
      #sidebar-wrapper {
        width: 0px;
        border-right: none;

        #sidebar #sidemenu li ul {
          position: fixed;
          left: 45px;
          margin-top: -45px;
          z-index: 1000;
          width: 200px;
          height: 0;
        }
      }
    }
  }

  #sidebar-wrapper {
    z-index: 1000;
    position: fixed;
    left: 225px;
    width: 0;
    height: 100%;
    margin-left: -225px;
    overflow-y: auto;
    /* background: ${(props) =>
      props.theme && props.theme.secondaryColour
        ? props.theme.secondaryColour
        : "#092935"}; */
    background-color: ${props => (props.theme && props.theme.secondaryColour) ? props.theme.secondaryColour :"#a489ac"}; //use the selected secondary color for the sidebar's background color
    -webkit-transition: all 0.5s ease;
    -moz-transition: all 0.5s ease;
    -o-transition: all 0.5s ease;
    transition: all 0.5s ease;
    box-shadow: 1px 2px 5px 0px rgba(0, 0, 0, 0.4);

    .sidebar-nav {
      position: absolute;
      top: 0;
      width: 225px;
      font-size: 14px;
      margin: 0;
      padding: 0;
      list-style: none;

      .sidebar-title {
        color: #e2e2e2;
        margin-left: 1.5em;
        font-weight: 900;
        letter-spacing: 0.25px;
      }

      li {
        text-indent: 0;
        line-height: 45px;

        a {
          display: block;
          text-decoration: none;

          &.active {
            background-color: ${(props) =>
              props.theme && props.theme.secondaryColour
                ? props.theme.secondaryColour
                : "rgb(45, 195, 202)"};
          }

          .sidebar-icon {
            display: none;
            width: 45px;
            height: 1px;
            font-size: 14px;
            padding: 0 2px;
            float: left;
            color: rgba(0, 0, 0, 0.5);
            margin-left: 0.7em;
            color: #ffffff;
            text-align: center;
          }
        }

        ul.panel-collapse {
          list-style: none;
          padding: 0;

          li {
            text-indent: 15px;
          }
        }
      }
    }
  }
`;

const mapStateToProps = (state: AppState) => ({
  ui: state.ui,
});

export default compose(withApollo, connect(mapStateToProps))(Sidebar);
