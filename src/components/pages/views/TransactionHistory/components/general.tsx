/** Components */
import styled from 'styled-components';

/** Types */
import { UIState } from '../../../../../store/ui/types';

export const Container = styled.div<{ ui: UIState }>`
  h2 {
    margin-bottom: 20px;
    @media only screen and (max-width: 900px) {
      font-size: 25px;
    }
    @media only screen and (max-width: 350px) {
      font-size: 20px;
    }
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
  .table-design {
    th {
      /* background-color: #e1e8eb; */
      background-color: #ffffff;
      vertical-align: baseline;
      color: #a489ac;
      overflow: hidden;
    }
    td {
      border-bottom: 1px solid #f0eeee;
      color: #444444;
    }
    tbody {
      tr {
        &:nth-child(odd) {
          background-color: #ecf1f4;
        }
      }
    }
  }
  .table-design {
    th,
    td {
      width: 1000px;
      &:not(:first-child) {
        text-align: center;
      }
      @media only screen and (max-width: 1000px) {
        &:nth-child(3) {
          display: none;
        }
      }
      @media only screen and (max-width: 300px) {
        &:nth-child(1) {
          display: none;
        }
      }
    }
  }
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

export const ContentWrapper = styled.div`

`;
