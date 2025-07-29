/** Components */
import styled from 'styled-components';
import { lighten } from 'polished';

/** Types */
import { UIState } from '../../../../../store/ui/types';

export const Container = styled.div<{ ui: UIState }>`
  width: 100%;
  height: 100%;
  padding: 20px;

  .action-button {
    display: flex;
    z-index: 99;
    gap: 12px;
    justify-content: flex-end;

    .btn {
      color: white;
      /* background-color: ${(props) =>
        props.theme && props.theme.primaryColour ? props.theme.primaryColour : '#092935'}; */
    }

    @media only screen and (max-width: 576px) {
      display: none;
    }
  }
  .topImage {
    width: 970px;
    height: 250px;
    display: grid;
    place-items: center;
    font-size: 3rem;
    background: #f1f1f1;
    color: lightgrey;
    @media only screen and (max-width: 576px) {
      width: 350px;
      height: 150px;
    }
  }
  .right-leftImage {
    width: 300px;
    height: 600px;
    display: grid;
    place-items: center;
    font-size: 3rem;
    background: #f1f1f1;
    color: lightgrey;
  }
  .top-inner-banner {
    max-height: 250px;
  }
  .top-banner {
    margin: 24px 0;
    align-items: center;
    display: flex;
    justify-content: center;

    .top-inner-banner {
      width: min(600px, 100%);
      height: 150px;
      max-height: 150px;
      display: block;
      @media only screen and (max-width: 576px) {
        height: 15vh;
      }
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      @media only screen and (min-width: 330px) and (max-width: 500px) {
        img {
          width: 300px !important;
        }
      }
    }
  }

  @media (max-width: 400px) {
    .right-leftImage {
      display: none !important;
    }
  }

  .content-wrapper {
    display: flex;
    /* gap: 12px; */
    justify-content: center;
    align-items: center;
    .banner-wrapper {
      max-width: 300px;
      height: 600px;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      @media only screen and (max-width: 576px) {
        display: none;
      }
    }
    .menu-text {
      width: 98%;
      text-align: center;
      margin-bottom: 1rem;
      font-size: 1.1rem;
      color: #9bb3bc;
    }
    @media only screen and (max-width: 374px) {
      .menu-text {
        display: none !important;
      }
    }
    .no-image {
      margin-top: 150px 0 !important;
      @media only screen and (max-width: 600px) {
        margin-top: 10px;
      }

      /* Small devices (portrait tablets and large phones, 600px and up) */
      @media only screen and (min-width: 600px) {
        margin-top: 10px;
      }
    }
    .menu-wrapper {
      /* Extra small devices (phones, 600px and down) */
      @media only screen and (max-width: 600px) {
        // margin-top: 150px;
        margin-top: 0;
        display: grid;
        grid-template-columns: repeat(2, calc(70% / 2));
        grid-template-rows: repeat(2, calc(75% / 2));

        max-width: 500px;
      }

      /* @media only screen and (max-width: 400px) {
        // margin-top: 150px;
        margin-top: 0;
        display: grid;
        grid-template-columns: repeat(3, calc(75% / 2));
        margin-bottom: 5rem!important;
      } */

      @media only screen and (max-width: 450px) {
        // margin-top: 150px;
        margin-top: 0 !important;
        display: flex;
        flex-wrap: wrap;
      }

      /* Small devices (portrait tablets and large phones, 600px and up) */
      @media only screen and (min-width: 600px) {
        margin-top: 150px;
        display: grid;
        grid-template-columns: repeat(2, calc(100% / 2));
      }

      /* Large devices (laptops/desktops, 992px and up) */
      @media only screen and (min-width: 992px) {
        display: grid;
        gap: 1em;
        margin: 0 auto;
        // grid-template-columns: repeat(3,calc(80% / 3));
        // grid-template-rows: repeat(3,calc(80% / 2));
        grid-template-columns: repeat(2, calc(80% / 2));
        // grid-template-rows: repeat(2,calc(80% / 2));
      }
    }
  }
  .menu-item {
    /* Extra small devices (phones, 600px and down) */
    @media only screen and (max-width: 600px) {
      margin-right: 0.5rem;
      margin-left: 0.5rem;
    }

    /* Small devices (portrait tablets and large phones, 600px and up) */
    @media only screen and (min-width: 600px) {
      margin-right: 0.5rem;
      margin-left: 0.5rem;
    }

    @media only screen and (min-width: 400px) {
      margin-right: 0.5rem;
      margin-left: 0.5rem;
      margin-bottom: 5rem !important;
    }
  }
`;
export const EditWrapper = styled.div<any>`
  border: ${(props) => (props.ui && props.ui.isEdit ? '1px solid white' : 'none')};
  position: relative;

  .btn-edit {
    position: absolute;
    top: 0px;
    right: 0px;
    font-size: 0.8rem;
    padding: 0.3rem;
    width: 30px;
    background-color: ${(props) =>
      props.theme && props.theme.primaryColour ? lighten(0.5, props.theme.primaryColour) : lighten(0.5, '#092935')};
  }
`;
