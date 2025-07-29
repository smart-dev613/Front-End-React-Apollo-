/** Components */
import styled from 'styled-components';
import { lighten } from 'polished';

/** Types */
import { State } from '../types';
import { UIState } from '../../../../../store/ui/types';

export const StyledNavigation = styled.div<State>`
  .sidebar_colorPicked {
    position: absolute;
    width: 100%;

    bottom: 5rem;
  }
  /* .navbar-text {
    display:none!important ;
    position: fixed;
    top: 140px;
    z-index: 150;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 3.5rem;
    background: #efefef;
    h3 {
      @media only screen and (max-width: 400px) {
        font-size: 20px;
      }
    }

    @media (min-width: 577px) {
      display: none;
    }
  } */
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

    @media (min-width: 769px) {
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
      props.theme && props.theme.secondaryColour ? props.theme.secondaryColour : '#092935'}; */
    background-color: ${(props) =>
      props.theme && props.theme.secondaryColour ? props.theme.secondaryColour : '#a489ac'};
    -webkit-transition: all 0.5s ease;
    -moz-transition: all 0.5s ease;
    -o-transition: all 0.5s ease;
    transition: all 0.5s ease;
    box-shadow: 1px 2px 5px 0px rgba(0, 0, 0, 0.4);
width: calc(100% - 240px);
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
              props.theme && props.theme.secondaryColour ? props.theme.secondaryColour : 'rgb(45, 195, 202)'};
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

export const SidebarMobileWrapper = styled.div<{ ui: UIState }>`
  height: 70px;
  background-color: ${(props) =>
    props.theme && props.theme.secondaryColour ? props.theme.secondaryColour : '#a489ac'};

  top: 4.4rem;
  justify-content: space-around;
  align-items: center;
  padding: 0;
  .sidebarIcon-plus {
    color: #ffffff;
    font-size: 20px;
    transition: all 0.1s linear;
    &-x {
      transform: rotate(45deg);
    }
  }
  .more-services {
    position: relative;
    &-link {
      position: absolute;
      z-index: 1000;
      right: -1rem;
      background: white;
      list-style: none;
      width: 200px;
      top: 3rem;
      text-align: center;
      font-size: 1.2rem;
      padding: 1rem;
      li{
        a{
          color: #000;
display: contents;
        }
      }
    }
  }
  a {
    color: #ffffff;
    font-size: 20px;
    padding: 20px;
    @media only screen and (max-width: 305px) {
      padding-left: 14px;
    }

    &.active {
      background-color: ${(props) =>
        props.theme && props.theme.secondaryColour
          ? lighten(0.2, props.theme.secondaryColour)
          : lighten(0.2, '#a489ac')};
    }

    &:nth-child(1) {
      display: none;
    }
  }

  @media only screen and (min-width: 576px) {
    display: none;
  }
`;
