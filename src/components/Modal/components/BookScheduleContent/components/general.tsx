/** Components */
import styled from 'styled-components';

/** Types */
import { UIState } from '../../../../../store/ui/types';

export const carosuelContainer = styled.div`
  
`;

export const ModalBody = styled.div`
  .carosuel-container-booking{
  width: 150px;
  margin: 30px auto;
  min-height: 100px;
  position: relative;
  /* Extra small devices (phones, 600px and down) */
  @media only screen and (max-width: 600px) {
    width: 150px !important;
  }

  /* Small devices (portrait tablets and large phones, 600px and up) */
  @media only screen and (min-width: 600px) {
    width: 150px !important;
  }

  /* Medium devices (landscape tablets, 768px and up) */
  @media only screen and (min-width: 768px) {
    width: 150px!important;
  }
  /* Large devices (laptops/desktops, 992px and up) */
  @media only screen and (min-width: 992px) {
    width: 150px!important;
  }
}
.carosuel-container-booking .carosuel-container-booking-inner{
  overflow: hidden;
}
.carosuel-container-booking .track{
  display: inline-flex;
  transition: transform 0.5s;
} 
.carosuel-container-booking .card-container {
  flex-shrink: 0;
  width: 150px;
  height: 150px;
  padding-right: 15px;
  box-sizing: border-box;
  /* Extra small devices (phones, 600px and down) */
  @media only screen and (max-width: 600px) {
    width: 100px!important;
    height: 100px!important;
  }

  /* Small devices (portrait tablets and large phones, 600px and up) */
  @media only screen and (min-width: 600px) {
    width: 100px!important;
    height: 100px!important;
  }

  /* Medium devices (landscape tablets, 768px and up) */
  @media only screen and (min-width: 768px) {
    width: 100px!important;
    height: 100px!important;
  }
  /* Large devices (laptops/desktops, 992px and up) */
  @media only screen and (min-width: 992px) {
    width: 150px!important;
    height: 150px!important;
  }
}
.carosuel-container-booking .card {
  background-color: #e6e6e6;
  width: 100%;
  height: 100%;
  border: 1px solid #ccc;
  box-sizing: border-box;
}
.nav button {
  width: 60px;
  height: 60px;
  top: 50%;
  position: absolute;
  transform: translateY(-50%);
  outline: none;
}
.nav .prev{
  right: 100%
}
.nav .next{
  left: 100%;
}
  .employee-wrapper {
    /* width: 175px;
    padding-right: 15px; */
    flex-direction: column;
    justify-content: center;
    align-items: center;

  }
`;

export const CalendarStyle = styled.div`
.flex-container {
  display : flex;
  align-items: center;
  gap: 0.5rem;
}
.status-text {
  font-weight: 500;
  
}
.accept-event {
  color: green;
}
.reject-event {
  color: red;
}
.action-btn{
  cursor: pointer;
}
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #ddd;
  }
  button{
    margin-left: .2rem;
  }
  hr{
    margin-top: -.3rem;
  }
`;