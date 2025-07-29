import styled from "styled-components";


export const AlertBody = styled.div`
  .cart-alert {
    display: grid;
    place-items: center;
    grid-template-columns: 80% 20%;
    width: 100%;
    border-radius: 0.2rem;
    background-color: #fff;
    height: 6rem;
    position: absolute;
    top: -7rem;
    margin: 0;
    margin-left: -1rem;
    transition: all .2s linear;
  }

  .in {
    opacity: 1;
    transform: translateY(0);
    z-index: 0;
  }

  .out {
    opacity: 0;
    transform: translateY(5rem);
    z-index: -111;
  }

  @keyframes in {
    from {
      transform: translateY(-10rem);
    }

    to {
      transform: translateX(0rem);
    }
  }
`;