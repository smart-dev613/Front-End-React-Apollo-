import React, { useState, useEffect, useCallback } from 'react';

/** Utils */
import { loadStripe } from '@stripe/stripe-js';
import styled from 'styled-components';

/** Request */
import { checkoutEventCartItem } from '../../../../../providers/pricing';

interface Props {
  eventId: string;
}

const PayButton: React.FC<Props> = ({ eventId }) => {
  const [stripe, setStripe] = useState<any>(null);

  const initiateStripe = async () => {
    const stripePromise = await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY as string)
    setStripe(stripePromise);
  }

  const pay = useCallback(async () => {
    try {
      if (stripe) {
        const { data } = await checkoutEventCartItem({
          eventId: eventId
        });

        if (data) {
          const { checkoutEventCartItem: { id } } = data;
          console.log(data)

          // const result = await stripe.redirectToCheckout({
          //   sessionId: id
          // });
        }
      }
    } catch (error) {
      console.log(error)
    }
  }, [eventId, stripe])

  useEffect(() => {
    initiateStripe();
  }, [])

  return (
    <StyledButton className={'btn-edit btn-purple btn'} onClick={() => pay()}>
      Checkout
    </StyledButton>
  )
}

const StyledButton = styled.button`
  color: white;
  height: 40px;
  border: none;
  transition: ease-in-out 200ms;

  &:hover {
    background: #a47ead;
    transition: ease-in-out 200ms;
  }
`

export default PayButton;

