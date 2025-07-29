import React, { useState, useEffect, useCallback } from 'react';

/** Utils */
import { loadStripe } from '@stripe/stripe-js';
import styled from 'styled-components';

/** Request */
import { checkoutEventCartItem } from '../../../../../../providers/pricing';

interface Props {
  eventId: string;
  addClassName: string;
}

const PayButton: React.FC<Props> = ({ eventId, addClassName }) => {
  const [stripe, setStripe] = useState<any>(null);

  // const initiateStripe = async () => {
  //   const stripePromise = await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY as string)
  //   setStripe(stripePromise);
  // }

  // const pay = useCallback(async () => {
  //   try {
  //     if (stripe) {
  //       const { data, errors }: any = await checkoutEventCartItem({
  //         eventId: eventId
  //       });

  //       if (errors) throw new Error(errors[0].message)

  //       if (data) {
  //         const { checkoutEventCartItem: { id } } = data;

  //         const result = await stripe.redirectToCheckout({
  //           sessionId: id
  //         });
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error)
  //     alert(error.message)
  //   }
  // }, [eventId, stripe])

  // useEffect(() => {
  //   initiateStripe();
  // }, [])


  const openIFrame = () => {
    let iframe = document.createElement('iframe')
    iframe.src = `${process.env.BILLING_FRONTEND}/${eventId}/event-cart?callback=${window.location.href}`
    iframe.frameBorder = '0'
    iframe.id = 'iframe'
    iframe.style.position = 'absolute'
    iframe.style.zIndex = '99999'
    iframe.style.height = '100%'
    iframe.style.width = '100%'
    iframe.style.top = '0'
    iframe.style.border = 'none'
    document.body.prepend(iframe)
    document.body.style.overflow = 'hidden'
  };

  const closeIFrame = () => {
    window.addEventListener('message', function (event) {
      let frameToRemove = document.getElementById('iframe')
      if (frameToRemove) {
        frameToRemove.parentNode.removeChild(frameToRemove)
        document.body.style.overflow = 'inherit'
      }
    })
  }

  return (
    <>
    {/* // <StyledButton className={'btn-edit btn-purple btn'} onClick={() => pay()}> */}
      <StyledButton type="button" className={'btn btn-purple btn-block ' + addClassName} onClick={(e) => {
        e.preventDefault()
        openIFrame()
      }}>
        Checkout
      </StyledButton>

        <StyledButton onClick={() => {
          // @ts-ignore
          window.openIFrame = openIFrame
          }}>
        Test
        </StyledButton>
    </>
  )
}

const StyledButton = styled.button`
  transition: ease-in-out 200ms;
  &:hover {
    background: #a47ead;
    transition: ease-in-out 200ms;
  }
`

export default PayButton;

