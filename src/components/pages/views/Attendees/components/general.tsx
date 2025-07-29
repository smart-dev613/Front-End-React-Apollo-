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
  .companyIntro {
    margin-top: -0.8rem;
    margin-right: 10rem;
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
  .companyDescriptionBody {
    margin-top: 1rem;
    gap: 0rem !important;
    /* width: 70%; */
    @media only screen and (max-width: 700px) {
      margin-top: 0.5rem;
    }
    @media only screen and (max-width: 1000px) {
      width: 70% !important;
    }
  }
  .companyImage {
    width: 80px !important;
    border-radius: 50%;
    height: 80px !important;
  }
  @media only screen and (max-width: 350px) {
    .companyIntro {
      display: none;
    }
  }
  .keyword {
    color: #bfc1be;
    background: #E1E1E1;
    font-weight: none;
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