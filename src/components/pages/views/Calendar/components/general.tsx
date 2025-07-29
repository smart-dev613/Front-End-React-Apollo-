/** Components */
import styled from 'styled-components';

/** Types */
import { UIState } from '../../../../../store/ui/types';

export const Container = styled.div<{ ui: UIState }>`
tbody{
  tr{
    th{
      a{

        /* color: #fff; */
      }
    }
  }
}
  .action-top {
    justify-content: flex-end;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 20px;
    @media only screen and (max-width: 575px) {
      .calendar-today {
        display: none;
      }
    }
  }
  .custom-title {
    font-size: 1.7rem !important;
    @media only screen and (max-width: 1000px) {
      font-size: 1.4rem !important;
    }
    @media only screen and (max-width: 700px) {
      font-size: 1rem !important;
    }
  }
  button {
    width: 150px !important;
    border-radius: 0.2rem;
    font-size: 1.1rem;
    height: 2.5rem;
    @media only screen and (max-width: 500px) {
      width: 110px !important;
    }
    @media only screen and (max-width: 380px) {
      width: 90px !important;
      font-size: 0.8rem;
    }
    @media only screen and (max-width: 320px) {
      width: 80px !important;
      font-size: 0.8rem;
    }
  }
`;

export const ContentWrapper = styled.div`

`;

export const Form = styled.form`

`;

export const FormField = styled.div`

`;
