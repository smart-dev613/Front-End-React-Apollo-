import React, { useState, useEffect, useCallback } from 'react';

/** Components */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

/** Utils */
import { loadStripe } from '@stripe/stripe-js';
import styled from 'styled-components';

/** Request */
import { createSessionForCheckout } from '../../../../../providers/pricing';

interface Props {
  companyId: string;
}

const PayButton: React.FC<Props> = ({ companyId }) => {
  const [stripe, setStripe] = useState<any>(null);

  const initiateStripe = async () => {
    const stripePromise = await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY as string)
    setStripe(stripePromise);
  }

  const pay = useCallback(async () => {
    try {
      if (stripe) {
        const { data } = await createSessionForCheckout({
          companyID: companyId
        });

        if (data) {
          const { createSessionForCheckout: {id } } = data;

          const result = await stripe.redirectToCheckout({
            sessionId: id
          });
        }
      }
    } catch (error) {
      console.log(error)
    }
  }, [companyId, stripe])

  useEffect(() => {
    initiateStripe();
  }, [])

  return (
    <StyledButton className={'btn-edit btn-purple btn'} onClick={() => pay()}>
      <FontAwesomeIcon icon={faPlus} /> Testing Pay
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

