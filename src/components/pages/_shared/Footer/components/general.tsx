/** Components */
import styled from 'styled-components';

export const FooterWrapper = styled.div`
  display: flex;
  position: fixed;
  bottom: 0;
  width: calc(100vw - 220px);
  z-index: 999;
  background-color: #fff;
  right: 0;
  justify-content: space-between;
  align-items: center;
  box-shadow: -2px 0px 5px 2px rgba(0, 0, 0, 0.61);
  -webkit-box-shadow: -2px 0px 5px 2px rgba(0, 0, 0, 0.61);
  -moz-box-shadow: -2px 0px 5px 2px rgba(0, 0, 0, 0.61);
  margin: 0 -20px;
  margin-right: 0px;
  padding: 3px 10px;
  font-size: 0.8rem;

  .footer-info {
    display: flex;
    list-style: none;
    gap: 12px;
    margin: 0;
  }

  @media only screen and (max-width: 1000px) {
    margin: 0;
    /* width: 100%; */
    flex-direction: row;
    text-align: center;
    font-size: 0.8rem;
  }
  @media only screen and (max-width: 576px){
width: 100%;
  }
`;
