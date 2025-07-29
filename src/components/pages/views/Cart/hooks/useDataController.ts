import { useEffect, useState, useCallback } from 'react';

/** Requst */
import { getEventCartItem, updateCartItemQuantity, deleteEventCartItem } from '../../../../../providers/pricing';

/** Types */
import { PricingItem } from '../types';

export const useDataController = (eventId: string, fetchCarts: any) => {
  const [dataPending, setDataPending] = useState<PricingItem[]>([]);
  const [dataHistory, setDataHistory] = useState<PricingItem[]>([]);

  const fetchCartData = useCallback(async () => {
    try {
      fetchCarts(eventId);
      const { data: { getEventCartItem: itemList } } = await getEventCartItem(eventId);
        console.log('dataPending', itemList);
      let dataPendingV = itemList.map((item:any)=>{
        if(item.status === 'PENDING' || item.status === 'PAYMENT_FAILED'){
          return {
            id: item.id,
            name: item.item_detail.name,
            duration: item.pricing.duration,
            quantity: item.quantity,
            currency: item.pricing.currency,
            price: item.pricing.price,
            totalPrice: `${ item.pricing.currency?.toUpperCase() } ${ item.quantity * item.pricing.price }`,
            imageURL: item.item_detail.imageURL,
            tax: item.pricing.tax
          }
        } else {
          return null
        }
      })
      setDataPending(dataPendingV.filter((item:any)=> item!==null));
      setDataHistory(itemList.filter((item: any) => item.status !== 'PENDING'));
    } catch (error) {
      console.log(error);
    }
  }, [eventId]);

  const updateCartItem = async (cartId: string, quantity: number) => {
    try {
      let result = await updateCartItemQuantity({
        cartId,
        quantity
      })
      if (result.data) {
        console.log(dataPending)
        setDataPending(
          dataPending
            .map((item: any) => ( 
              {
              ...item,
              quantity: item.id === cartId ? item.quantity + quantity : item.quantity,
              totalPrice: item.id === cartId ? `${ item.currency.toUpperCase() } ${ (item.quantity + quantity) * item.price }`: item.totalPrice
            }
            ))
            .filter(item => item.quantity > 0)
        )
      }
    } catch (error) {
      console.log(error)
    }
  }

  const deleteCartItem = async (cartId: string) => {
    try {
      await deleteEventCartItem({ cartId })
      fetchCartData()
    } catch (error) {
      console.log(error)
    }
  }

  const checkout = useCallback(async () => {
    try {
      
    } catch (error) {
      
    }
  }, [eventId])

  useEffect(() => {
    fetchCartData();
  }, [fetchCartData]);

  return {
    dataPending,
    dataHistory,
    updateCartItem,
    deleteCartItem,
    checkout
  }
}
