/** Components */
import styled from 'styled-components';

/** Types */

export const ModalBodyContent = styled.div`
  .flex-container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
   
  }
  .add-top-margin {
    margin-top: 1rem;
  }
  .desc-text {
    font-size: 1rem !important;
    line-height: 1.5rem !important; 
  }
  .title-text {
    font-size: 1.5rem !important;
    line-height: 2rem !important; 
    font-weight: bold;
  }
  .keywords-text {
    font-size: 0.875rem !important; 
    line-height: 1.25rem !important;
  }
  .field-value {
    font-weight: normal;
  }
  @media (min-width: 768px) {
    .flex-container {
      flex-direction: row;
      flex-wrap: wrap;
    }
   }

`;

export const ModalBody = styled.div`
  font-family: 'roboto', Helvetica, Arial, sans-serif;

  .row {
    margin: 20px 0;
  }

  .keywords {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;

    .keyword-item {
      background: #cacaca;
      padding: 2px 15px;
      border-radius: 5px;
    }
  }

  .item {
    width: 100%;
    padding: 0;
    margin: 5px 0;

    .item-label {
      font-weight: bold;
      padding: 0;
    }

    .item-value {
      padding: 0;
    }
  }

  .images-container {
    width: 100%;
    height: 200px;
    display: block;

    div,
    img {
      height: 100%;
    }

    .each-slide > div {
      display: flex;
      align-items: center;
      justify-content: center;
      background-size: cover;
      height: 100%;
      padding: 20px 0 20px 0;
      background-color: #e0e0e0;
    }

    .each-slide span {
      padding: 20px;
      font-size: 20px;
      background: #efefef;
      text-align: center;
    }
  }

  .pricing-container {
    display: flex;
    justify-content: center;
     gap: 0.5rem;

    .employee-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .employee-name {
        margin: 10px 0;
      }

      .employee-price {
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
  }
`;

export const ModalHeader = styled.div`
  .left-header {
    display: flex;
    align-items: center;
    gap: 12px;

    .title {
      margin: 0;
      font-family: 'robotoregular', Helvetica, Arial, sans-serif;
      font-weight: bold;
    }

    .avatar {
      border-radius: 50%;
      width: 120px;
      height: 120px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
   background: #e6e6e6;
      box-shadow: 0 0 5px #8a8a8a;
    }
    
      img {
        width: 120px;
        height: 120px;
        border-radius: 50%;

        object-fit: cover;
      }
    
  }
`;
