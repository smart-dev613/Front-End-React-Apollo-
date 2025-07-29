/** Components */
import styled from 'styled-components';

export const ModalBody = styled.div`
  font-family: 'roboto', Helvetica, Arial, sans-serif;

  .row {
    margin: 20px 0;
  }

  .avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;

    display: flex;
    justify-content: center;
    flex-direction: column;

    // box-shadow: 0 0 5px #8a8a8a;
    img {
      width: 120px;
      height: 120px;
      border-radius: 50%;

      object-fit: cover;
    }
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
    // gap: 20px;

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

        // box-shadow: 0 0 5px #8a8a8a;

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
`;
