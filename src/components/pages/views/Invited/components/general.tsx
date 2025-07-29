/** Components */
import styled from 'styled-components';

/** Types */
import { UIState } from '../../../../../store/ui/types';

export const Container = styled.div<{ ui: UIState }>`
  padding: 20px;
  min-height: calc(100vh - 100px);
  @media only screen and (max-width: 576px) {
    min-height: calc(100vh - 240px);
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
  }
  .table-design {
    td,
    th {
      width: 1000px;
      &:not(:first-child) {
        text-align: center;
      }
      &:nth-child(5){
        text-align: center;
      }
    }
  }
  @media only screen and (max-width: 1000px) {
    .table-design {
      td,
      th {
        font-size: 18px;

        &:nth-child(4) {
          display: none;
        }
      }
    }
  }

  @media only screen and (max-width: 900px) {
    .table-design {
      td,
      th {
        font-size: 18px;

        &:nth-child(3) {
          display: none;
        }
      }
    }
  }
  @media only screen and (max-width: 700px) {
    .table-design {
      td,
      th {
        font-size: 16px;
      }
    }
  }
  @media only screen and (max-width: 600px) {
    .table-design {
      td,
      th {
        font-size: 15px;
      }
    }
  }
  @media only screen and (max-width: 350px) {
    .table-design {
      td,
      th {
        font-size: 13px;
      }
    }
  }
  @media only screen and (max-width: 350px) {
    .table-design {
      td,
      th {
        &:last-child {
          display: none;
        }
      }
    }
  }
  .event-status {
    display: block;
    width: 15px !important;
    height: 15px;
    border-radius: 50%;
    margin: 0 auto;
    /* margin-left: 18px; */
    @media only screen and (max-width: 576px) {
      width: 10px !important;
      height: 10px;
    }
  }
  .sending {
    color: #a588ac;
  }
  .accepted {
    background-color: green;
  }
  .limited {
    background-color: grey;
  }
  .declined {
    background-color: #00add3;
  }
  .action-remove {
    color: red;
    margin-left: 5px;
  }
  .action-disabled {
    color: grey;
    margin-left: 5px;
  }
  .action-tick {
    color: green;
  }
`;

export const HeaderWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  @media only screen and (min-width:330px) and (max-width: 549px){
    display:none!important;
  }

  @media only screen and (max-width: 650px) {
    align-items: flex-start;
  }

  h2 {
    @media only screen and (max-width: 700px) {
      font-size: 25px;
    }
    @media only screen and (max-width: 576px) {
      font-size: 20px;
    }
  }
  .extra {
    display: flex;
    @media only screen and (max-width: 650px) {
      flex-direction: column;
      margin-left: 30px;
      font-size: 10px;
    }
    & > div {
      display: flex;
      margin-bottom: 10px;
      @media only screen and (max-width: 650px) {
        display: flex;
        justify-content: flex-end;
      }
      button {
        color: #fff;
       width: 44px;
      }

      input,
      button {
        @media only screen and (max-width: 700px) {
          font-size: 15px;
        }
        @media only screen and (max-width: 576px) {
          font-size: 14px;
        }
      }
    }
    .cluster {
      margin-left: 1rem;
      @media only screen and (max-width: 650px) {
        display: flex;
        justify-content: flex-end;
      }
      button {
      }
    }
  }
`;

export const ContentWrapper = styled.div`
width: 100%;
margin: 0 auto;

`;
