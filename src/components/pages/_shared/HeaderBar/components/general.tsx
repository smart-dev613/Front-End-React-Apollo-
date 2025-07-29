import React from 'react';

/** Components */
import styled from 'styled-components';
import { lighten } from 'polished';

/** Types */
import { UIState } from '../../../../../store/ui/types';

export const StyledNotifs = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 59px;
  right: 60px;
  /* right: ${(props) => (props.isOpen ? '60px' : '-100%')}; */
  visibility: ${(props) => (props.isOpen ? 'visible' : 'hidden')};
  opacity: ${(props) => (props.isOpen ? '1' : '0')};
  background-color: red;
  height: 200px;
  width: 200px;
  z-index: 2; 
  -webkit-transition: all 0.5s ease;
  -moz-transition: all 0.5s ease;
  -o-transition: all 0.5s ease;
  transition: all 0.5s ease;
  box-shadow: 1px 2px 5px 0px rgba(0, 0, 0, 0.4);

  @media only screen and (max-width: 576px) {
    top: 54px;
    right: 0px;
    background-color: blue;
    height: calc(100% - 54px);
    width: 100%;
  }

  .close-notifs {
    color: #fff;
    height: 30px;
    width: 30px;
    cursor: pointer;
  }
`;

export const HeaderContainer = styled.div<{ ui: UIState }>`
  background-color: ${(props) => (props.theme && props.theme.primaryColour ? props.theme.primaryColour : '#092935')};
  padding: 0 20px;
  margin: 0;
  box-shadow: 1px 3px 20px -8px rgba(0, 0, 0, 0.3);
  height: 70px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  z-index :1050;

  @media only screen and (min-width: 350px) and (max-width: 475px){
    box-shadow: none!important;
    padding:0!important;
  }
`;

export const HeaderLeft = styled.div<{ ui: UIState }>`
  display: flex;
  gap: 12px;
  align-items: center;

  @media only screen and (max-width: 350px) {
    gap: 5px !important;
  }

  .logo-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;

    img {
      padding: 0;
      border: none;
      height: 3rem;
      max-width: 5rem;

      /* @media only screen and (max-width: 356px) {
        width: 80px;
      } */
      @media only screen and (max-width: 375px) {
        //display:none!important;
        gap: 0 !important;
      }

      @media only screen and (min-width: 350px) and (max-width: 399px) {
        max-height: 2rem !important;
        max-width: 3rem;
      }

      @media only screen and (max-width: 400px) {
        gap: 0 !important;
      }

      @media only screen and (max-width: 450px) {
        height: 20px;
      }
    }
  }

  .name-wrapper {
    color: #ffffff;
  }

  @media only screen and (max-width: 576px) {
    .name-wrapper {
      /* display: none; */
      color:#555;
    }
  }

  @media only screen and (min-width: 375px) and (max-width: 575px) {
    .name-wrapper {
      /* display: none; */
      color:#555;
    }
  }
`;

export const HeaderRight = styled.div<{ ui: UIState }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-right: 0.5rem;

  @media screen and (min-width: 767px) {
  gap: 1rem;
  }

  .btn {
    position: relative;
  }
  svg {
    font-size: 23px;
    @media only screen and (max-width: 400px) {
      font-size: 21px!important;
    }

    @media only screen and (min-width: 374px) and (max-width: 450px){
      font-size: 21px!important;
    }
  }

  .avatar {
    border-radius: 50%;

    display: flex;
    justify-content: center;
    flex-direction: column;

    // box-shadow: 0 0 5px #8a8a8a;

    img {
      //width: 35px;
      //height: 35px;
      border-radius: 80%!important;
      height:20px!important ;
      object-fit: cover;
    }
  }

  .badge {
    background-color: #ff3d68;
    position: absolute;
    top: -6px;
    left: 3px;
    -webkit-transition: all 0.5s ease;
    -moz-transition: all 0.5s ease;
    -o-transition: all 0.5s ease;
    transition: all 0.5s ease;
    color: white;
  }
`;

export const HeaderTitleMobile = styled.div<{ ui: UIState }>`
  text-align: center;
  height: 70px;
  background-color: ${(props) =>
    props.theme && props.theme.primaryColour ? lighten(0.5, props.theme.primaryColour) : lighten(0.5, '#092935')};
  top: 70px;
  justify-content: center;
  color: #ffffff;

  h1 {
    text-align: center;
  }

  @media only screen and (min-width: 576px) {
    display: none;
  }
`;

export const NameWrapper = styled.div<{ ui: UIState }>`
  display: flex;
  /* border: ${(props) => (props.ui && props.ui.isEdit ? '1px solid white' : 'none')}; */
  position: relative;
  padding: 0;
  min-width: 350px;

  h1 {
    font-size: 2rem;
  }

  .btn-edit {
    position: absolute;
    top: 0px;
    right: 0px;
    font-size: 0.8rem;
    padding: 0.3rem;
    background-color: ${(props) =>
      props.theme && props.theme.primaryColour ? lighten(0.5, props.theme.primaryColour) : lighten(0.5, '#092935')};
  }

  @media only screen and (max-width: 576px) {
    display: none;
  }

  @media only srceen and (max-width: 450px) {
    padding: 0px 0px !important;
  }

  @media only screen and (max-width: 450px) {
    a.btn.depth-shadow.btn-white.dropdown-toggle {
      padding: 0.25rem 0.15rem !important;
    }
  }
`;

export const LogoWrapper = styled.div<{ ui: UIState }>`
  display: flex;
  /* border: ${(props) => (props.ui && props.ui.isEdit ? '1px solid white' : 'none')}; */
  position: relative;
  padding: 0 12px;
  align-items: center;

  .nav-logo-img {
    height: 100%;
    min-height: 2.5rem
    object-fit: contain;
  }

  h1 {
    font-size: 10rem;
  }

  .btn-edit {
    position: absolute;
    top: 0px;
    right: 0px;
    font-size: 0.8rem;
    padding: 0.3rem;
    /* background-color: ${(props) =>
      props.theme && props.theme.primaryColour ? lighten(0.5, props.theme.primaryColour) : lighten(0.5, '#092935')}; */
  }

  @media only screen and (max-width: 576px) {
    /* display: none; */
  }
`;
