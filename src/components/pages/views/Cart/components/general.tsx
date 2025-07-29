import React from 'react';

/** Utils */
import styled from 'styled-components';

export const Avatar = styled.div<{ background: string }>`
  background-image: ${(props: any) => encodeURI(props.background)};
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

export const PriceSummary = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;
export const CartMobile = styled.div`
  @media only screen and (min-width: 1070px) {
    display: none;
  }
  display: flex;
  justify-content: space-between;
  align-items: center;
  .icon-down {
    margin-bottom: -2px;
  }
  div {
    & > * {
      margin-bottom: 5px;
    }
  }
`;
export const ContentWrapper = styled.div`
  th {
    background-color: #e1e8eb;
    overflow: hidden;
  }
  td {
    border-bottom: 1px solid #f0eeee;
    color: #444444;
  }
  .cart-btn-qr {
    font-size: 1.5rem;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .cart-discount {
    border: 1px #000 solid;
    width: 75px;
    padding: 5px;
    display: flex;
    justify-content: center;
    border-radius: 5px;
  }
  th,
  td {
    /* button {
      font-size: 1.5rem;
    } */
    @media only screen and (max-width: 1200px) {
      &:nth-child(1) {
        display: none;
      }
    }
    @media only screen and (max-width: 1135px) {
      &:nth-child(3) {
        display: none;
      }
    }
    @media only screen and (max-width: 1070px) {
      &:nth-child(5),
      &:nth-child(6),
      &:nth-child(10) {
        display: none;
      }
    }

    @media only screen and (max-width: 360px) {
      &:nth-child(6) {
        display: none;
      }
    }
  }
  /* margin-top: 1em; */
`;

export const ContentHeaderWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
`;
