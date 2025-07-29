/** Components */
import styled from 'styled-components';

/** Types */
import { UIState } from '../../../../../store/ui/types';

export const Container = styled.div<{ ui: UIState }>`
  padding: 20px;
  min-height: calc(100vh - 100px);
.price{
  font-weight: bold !important;
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
  .action-button {
    width: 5px;
    height: 5px;
  }
  .table-design {
    th {
      /* background-color: #656b6d; */
      background-color: #ffffff;
      vertical-align: text-top;
      color: #a489ac;
      overflow: hidden;
    }
    td {
      border-bottom: 1px solid #f0eeee;
      color: #444444;
    }
  }
  .table-design {
    td,
    th {
      width: 1000px;
      text-align: center;

      &:not(:first-child) {
        text-align: center;
      }
     
    }
  }

  .table-design {
    td,
    th {
      text-align: center;
      @media only screen and (max-width: 1000px) {
        &:nth-child(4) {
          display: none;
        }
      }
      @media only screen and (max-width: 650px) {
        &:first-child {
          display: none;
        }
      }
      @media only screen and (max-width: 850px) {
        &:nth-child(3) {
          display: none;
        }
      }
      @media only screen and (max-width: 350px) {
        &:nth-child(5) {
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
  h2 {
    @media only screen and (max-width: 1000px) {
      font-size: 22px;
    }
    @media only screen and (max-width: 500px){
      font-size: 18px;
    };
  }
  .extra {
    display: flex;

    & > div {
      display: flex;

      @media only screen and (max-width: 576px) {
        button {
          font-size: 10px;
        }
      }
    }
  }
`;

export const ContentWrapper = styled.div`
  width: 100%;
  margin: 0 auto;
  
`;
