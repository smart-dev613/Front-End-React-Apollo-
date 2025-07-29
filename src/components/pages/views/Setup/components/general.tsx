/** Components */
import styled from 'styled-components';

/** Types */
import { UIState } from '../../../../../store/ui/types';




export const Container = styled.div<{ ui: UIState }>`
  @media only screen and (max-width: 365px) {
  }
  
  .color-column {
    padding: 0;
    flex-direction: column;
    @media only screen and (max-width: 1000px) {
      flex-direction: row;
    }
  }
  input,
  textarea,
  select {
    background-color: #ecf0f0;
  }
  .select-input {
    background-color: #ecf0f0 !important;
  }
  h1 {
    @media only screen and (max-width: 567px) {
      font-size: 30px;
    }
  }
  .btn-content {
    text-align: right;
    padding-right: 15px !important;
  }
  .form-design {
    &-container {
    }
    &-row {
      display: flex;

      @media only screen and (max-width: 1000px) {
        flex-direction: column;
        .input-design {
        }
      }
    }
  }

  .form-content {
    &-row {
      margin-left: 15px;
      @media only screen and (max-width: 1000px) {
        margin-left: 0px;
      }
    }
  }
  .action-button-bottom {
    justify-content: space-between;
    display: flex;

    /* text-align: right; */
    gap: 10px;
    margin-bottom: 20px;
    display: none;
    @media only screen and (max-width: 576px) {
      display: none;
    }
  }
  .action-button-top {
    justify-content: space-between;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    div {
      button {
        margin-right: 10px;
      }
    }
  }
  .setup {
    &_status {
      display: block;
      width: 15px !important;
      height: 15px;
      border-radius: 50%;

      margin-right: 10px;
      &-yellow {
        background-color: yellow;
      }
      &-green {
        background-color: green;
      }
    }
    &_edit {
      display: flex;
      align-items: center;
    }
  }
  .btn-green-light {
    background-color: #00a009 !important;
  }
  .disabled_color {
    color: #b1b5b5;
  }
  .form-design-color {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    @media only screen and (max-width: 366px) {
    grid-template-columns: 1fr;
    }
  }
`;

export const ContentWrapper = styled.div`

`;

export const Form = styled.form`
 
`;

export const FormField = styled.div`
  
`;

export const FormRow = styled.div`

`;