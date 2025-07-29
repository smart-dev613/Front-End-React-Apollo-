import { graphQLManual, makePostRequest } from "./core/common"

export const createPlatformEventContentPricing = (formData: any) : Promise<any> => {
  return new Promise((resolve, reject) => {
    const query = `
      mutation createPlatformEventContentPricing(
        $eventId: String!,
        $contentId: String!,
        $price: Float!,
        $currency: String!,
        $employee: [String!]!,
        $duration: Float!,
        $slots: Float!,
        $availability_weeks: [String!]!,
        $availability_hours: [String!]!,
      ) {
        createPlatformEventContentPricing(data: {
          eventId: $eventId,
          contentId: $contentId,
          price: $price,
          currency: $currency,
          employee: $employee,
          duration: $duration,
          slots: $slots,
          availability_weeks: $availability_weeks,
          availability_hours: $availability_hours,
        })
      }
    `

    graphQLManual({
      query,
      variables: formData
    })
      .then((response: Response) => {
        resolve(response.json())
      })
      .catch(err => reject(err))
  })
}

export const updatePlatformEventContentPricing = (formData: any) : Promise<any> => {
  return new Promise((resolve, reject) => {
    const query = `
      mutation updatePlatformEventContentPricing(
        $eventId: String!,
        $contentId: String!,
        $contentPricingId: String!,
        $price: Float!,
        $currency: String!,
        $employee: [String!]!,
        $duration: Float!,
        $slots: Float!,
        $availability_weeks: [String!]!,
        $availability_hours: [String!]!,
      ) {
        updatePlatformEventContentPricing(data: {
          eventId: $eventId,
          contentId: $contentId,
          contentPricingId: $contentPricingId,
          price: $price,
          currency: $currency,
          employee: $employee,
          duration: $duration,
          slots: $slots,
          availability_weeks: $availability_weeks,
          availability_hours: $availability_hours,
        })
      }
    `

    graphQLManual({
      query,
      variables: formData
    })
      .then((response: Response) => {
        resolve(response.json())
      })
      .catch(err => reject(err))
  })
}

export const createSessionForCheckout = (formData: any) : Promise<any> => {
  return new Promise((resolve, reject) => {
    const query = `
      mutation createSessionForCheckout($companyID: String!) {
        createSessionForCheckout(data: {
          companyID: $companyID,
        })
      }
    `

    graphQLManual({
      query,
      variables: formData
    })
      .then((response: Response) => {
        resolve(response.json())
      })
      .catch(err => reject(err))
  })
}

export const employeesInCompany = (formData: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    const query = `
      query employeesInCompany($companyID: String!) {
        employeesInCompany(data: {
          companyID: $companyID,
        })
      }
    `

    graphQLManual({
      query,
      variables: formData
    })
      .then((response: Response) => {
        // alert(JSON.stringify(response))
        resolve(response.json())
      })
      .catch(err => { alert(JSON.stringify(err)); reject(err)})
  })
}

export const companyEmployeesAttendingEvent = (formData: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    const query = `
      query companyEmployeesAttendingEvent($eventId: String!) {
        companyEmployeesAttendingEvent(data: {
          eventID: $eventId,
        })
      }
    `

    graphQLManual({
      query,
      variables: formData
    })
      .then((response: Response) => {
        resolve(response.json())
      })
      .catch(err => reject(err))
  })
}

export const getEventCartItem = (eventId: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const query = `
      query getEventCartItem($eventId: String!) {
        getEventCartItem(data: {
          eventId: $eventId,
        })
      }
    `

    graphQLManual({
      query,
      variables: {
        eventId
      }
    })
      .then((response: Response) => {
        resolve(response.json())
      })
      .catch(err => reject(err))
  })
}

export const refundTransaction = (txnId: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const query = `
      query refundTransaction($txnId: String!) {
        refundTransaction(txnId: $txnId)
      }
    `
    graphQLManual({
      query,
      variables: {
        txnId
      }
    })
      .then((response: Response) => {
        resolve(response.json())
      })
      .catch(err => reject(err))
  })
}

export const getAllEventTransactionHistory = (eventId: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const query = `
      query getAllEventTransactionHistory($eventId: String!) {
        getAllEventTransactionHistory(data: {
          eventId: $eventId,
        })
      }
    `

    graphQLManual({
      query,
      variables: {
        eventId
      }
    })
      .then((response: Response) => {
        resolve(response.json())
      })
      .catch(err => reject(err))
  })
}

export const addContentToCart = (formData: any): Promise<any> => {
  console.log("prisma", formData);
  return new Promise((resolve, reject) => {
    const query = `
      mutation addContentToCart(
        $eventId: String!,
        $itemId: String!,
        $priceId: String!,
      ) {
        addContentToCart(data: {
          eventId: $eventId,
          itemId: $itemId,
          priceId: $priceId,
          type: "content"
        })
      }
    `

    graphQLManual({
      query,
      variables: formData
    })
      .then((response: Response) => {
        resolve(response.json())
      })
      .catch(err => reject(err))
  })
}

export const updateCartItemQuantity = (formData: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    const query = `
      mutation updateCartItemQuantity(
        $cartId: String!,
        $quantity: Float!
      ) {
        updateCartItemQuantity(data: {
          cartId: $cartId,
          quantity: $quantity
        })
      }
    `

    graphQLManual({
      query,
      variables: formData
    })
      .then((response: Response) => {
        resolve(response.json())
      })
      .catch(err => reject(err))
  })
}

export const deleteEventCartItem = (formData: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    const query = `
      mutation deleteEventCartItem(
        $cartId: String!
      ) {
        deleteEventCartItem(data: {
          cartId: $cartId
        })
      }
    `

    graphQLManual({
      query,
      variables: formData
    })
      .then((response: Response) => {
        resolve(response.json())
      })
      .catch(err => reject(err))
  })
}

export const checkoutEventCartItem = (formData: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    const query = `
      mutation checkoutEventCartItem(
        $eventId: String!
      ) {
        checkoutEventCartItem(data: {
          eventId: $eventId
        })
      }
    `

    graphQLManual({
      query,
      variables: formData
    })
      .then((response: Response) => {
        resolve(response.json())
      })
      .catch(err => reject(err))
  })
}

export const newCoupon = (formData: any) => {
  console.log('newCoupon FormData', formData);
  return new Promise((resolve, reject) => {
    const query = `
    mutation createBillingCoupon(
      $companyID: [String],
      $name: String!,
      $promoCode: String!,
      $oneUsePerCompany: Boolean!,
      $oneUsePerUser: Boolean!,
      $startDate: Float!,
      $endDate: Float,
      $value: Float!,
      $unit: PromoValueUnit!
    ){
      createBillingCoupon(data: {
        companyID: $companyID,
        name: $name,
        promoCode: $promoCode,
        oneUsePerCompany: $oneUsePerCompany,
        oneUsePerUser: $oneUsePerUser,
        startDate: $startDate,
        endDate: $endDate,
        value: $value,
        unit: $unit
      })
    }
    `;
    graphQLManual({
      query,
      variables: formData,
    })
      .then((response: Response) => {
        resolve(response.json());
      })
      .catch((err) => reject(err));
  });
};
