/** Components */
import styled from 'styled-components';

/** Types */
import { UIState } from '../../../../../store/ui/types';

export const Container = styled.div<{ ui: UIState }>`
  h3 {
    text-transform: capitalize;
  }
  .action-button-bottom {
    justify-content: flex-end;
    display: flex;
    text-align: right;
    gap: 10px;
    margin-bottom: 20px;
    @media only screen and (max-width: 576px) {
      display: none;
    }
  }
  .action-button-top {
    justify-content: flex-end;
    display: flex;
    text-align: right;
    gap: 10px;
    margin-bottom: 20px;
    @media only screen and (min-width: 576px) {
      display: none;
    }
  }

  @media only screen and (max-width: 1500px) {
    .companyIntro {
      margin-top: 0rem;
    }
  }
  @media only screen and (max-width: 1000px) {
    .companyIntro {
      margin-top: 0.2rem;
    }
  }
  .companyImage {
    border-radius: 50%;
    width: 80px;
    height: 80px;
    background-size: cover !important;
  }
  @media only screen and (max-width: 350px) {
    .companyIntro {
      display: none;
    }
  }
  .keyword {
    color: #bfc1be;
    background: none;
    font-weight: bold;
  }

  .companyList {
    background: #f7f8f5 !important;
    // padding: 1em 1em 0em 1em;
    border-radius: 5px;
    list-style-type: none;
    margin-top: -1px;
    color: black;
  }
  @media only screen and (max-width: 690px) {
    .keywords {
      display: none !important;
    }
  }
`;

export const ContentWrapper = styled.div`

`;

export const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .extra {
    display: flex;

    & > div {
      display: flex;
    }
  }
`;