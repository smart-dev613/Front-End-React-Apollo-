/** Components */
import styled from 'styled-components';

/** Types */
import { UIState } from '../../../../../store/ui/types';

export const ModalBody = styled.div`
.title-input{
  margin-left: 0.5rem;
  @media (min-width: 768px) { 
margin-left: 1.8rem;
  }
}
.avatar-container {
  position: relative;
  width:max-content;
}
.rmv-avatar-btn{
position: absolute;
top:0;
right: 0;
background: #fff;
border-radius: 50%;
padding: 0.5rem;
}
.rmv-avatar-icon{
 color: red;
}
  .content-plus-div {
    @media only screen and (max-width: 991px) {
      padding: 0;
    }
  }
  .content-checkbox {
    position: absolute;
    right: 32px;
    @media only screen and (max-width: 991px) {
      right: 26px;
    }
  }
  .employee-wrapper {
    display: flex;
    padding: 0 20px;
    align-items: center;
    margin: 10px 0;
    justify-content: center;
    // gap: 20px;
  }
  .btn-checkbox {
    top: 2.8rem;
  }
  .content-link-btn {
    margin-right: -2px;
    @media only screen and (max-width: 991px) {
      margin-right: -8px;
    }
    @media only screen and (max-width: 575px) {
      margin-right: 4px;
    }
    @media only screen and (max-width: 500px) {
      margin-right: 2px;
    }
    @media only screen and (max-width: 400px) {
      margin-right: -10px;
    }
  }
  .image {
    // width: 75px;
    // height: 75px;
    border-radius: 75px;
  }

  .image-square {
    position: relative;
    .image {
      width: 100px;
      height: 100px;
    }
    .close {
      position: absolute;
      top: 0;
      right: 0;
    }
  }

  .keywords {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .Collapsible {
    /* background-color: $base; */
    position: relative;
  }

  //The content within the collaspable area
  .Collapsible__contentInner {
    padding: 10px 0;
    /* border: 1px solid $lightGrey; */
    border-top: 0;

    p {
      margin-bottom: 10px;
      font-size: 14px;
      line-height: 20px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .Collapsible__contentOuter {
    /* transition: height 400ms linear 0s; */
    transition: opacity 400ms linear 0s !important;
  }

  //The link which when clicked opens the collapsable area
  .Collapsible__trigger {
    display: block;
    font-weight: 400;
    text-decoration: none;
    position: relative;
    border-bottom: 1px solid #d6d6d6;
    padding: 10px 0;
    color: black;

    &:after {
      font-family: 'Font Awesome 5 Free';
      /* content: '\f107'; */
      content: '^';
      position: absolute;
      right: 10px;
      top: 10px;
      z-index: 1000;
      display: block;
      transition: transform 300ms;
    }

    &.is-open {
      &:after {
        transform: rotateZ(180deg);
      }

      & + .Collapsible__contentOuter {
        overflow: unset !important;
        visibility: visible;
        opacity: 1;
      }
    }

    &.is-closed {
      & + .Collapsible__contentOuter {
        overflow: hidden !important;
        visibility: hidden;
        opacity: 0;
      }
    }

    &.is-disabled {
      opacity: 0.5;
      background-color: grey;
    }
  }

  .CustomTriggerCSS {
    background-color: lightcoral;
    transition: background-color 200ms ease;
  }

  .CustomTriggerCSS--open {
    background-color: darkslateblue;
  }

  .Collapsible__custom-sibling {
    padding: 5px;
    font-size: 12px;
    background-color: #cbb700;
    color: black;
  }

  .col-12:last-of-type {
    .Collapsible__trigger {
      border-bottom: none;
    }
    .Collapsible__contentInner {
      border-top: 1px solid #d6d6d6;
    }
  }
`;

export const ModalHeader = styled.div`
  @media only screen and (max-width: 991px) {
    flex-direction: column-reverse;
    padding: 0;
  }
  .left-content {
    input {
      @media only screen and (max-width: 991px) {
        margin-left: -1.5rem;
      }
    }
  }
  .left-header {
    display: flex;
    align-items: center;
    gap: 12px;
    @media only screen and (max-width: 991px) {
      width: 100%;
      justify-content: flex-start;
    }

    .btn-checkbox {
      top: 2.8rem;
    }
    .title {
      margin: 0;
      font-family: 'robotoregular', Helvetica, Arial, sans-serif;
      font-weight: bold;
    }

    .avatar {
      border-radius: 50%;

      display: flex;
      justify-content: center;
      flex-direction: column;

      box-shadow: 0 0 5px #8a8a8a;

      img {
        width: 120px;
        height: 120px;
        border-radius: 50%;

        object-fit: cover;
      }
    }
  }
  .right-header {
    margin-top: 1rem;
    @media only screen and (max-width: 991px) {
      width: 100%;
      justify-content: flex-end;
      margin-bottom: 2rem;
    }
  }
`;
