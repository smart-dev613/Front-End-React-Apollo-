import { useEffect, useState, useCallback } from 'react';

/** Requst */
import { getEventCartItem, updateCartItemQuantity, deleteEventCartItem } from '../../../../providers/pricing';

/** Types */
import { PricingItem } from '../types';

export const useDataController = (eventId: string) => {
  const [dataPending, setDataPending] = useState<PricingItem[]>([]);
  const [dataHistory, setDataHistory] = useState<PricingItem[]>([]);

  const fetchCartData = useCallback(async () => {
    try {
      const { data: { getEventCartItem: itemList } } = await getEventCartItem(eventId);
      setDataPending(itemList.filter((item: any) => item.status === 'PENDING'));
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
        setDataPending(
          dataPending
            .map((item: any) => ({
              ...item,
              quantity: item.id === cartId ? item.quantity + quantity : item.quantity
            }))
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
