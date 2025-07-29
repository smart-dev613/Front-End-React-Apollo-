/** Hooks */
import { useCallback } from 'react';

/** Utils */
import moment from 'moment';

/** Request */
import { createPlatformEventContentPricing, updatePlatformEventContentPricing } from '../../../../../providers/pricing';

export const useForm = (eventId: any, data: any) => {
  const {
    user,
    setRefetch,
    item
  } = data;

  const createPricing = useCallback(async (values: any) => {
    try {
      await createPlatformEventContentPricing({
        eventId,
        contentId: values.content.value,
        price: +values.price,
        currency: 'GBP',
        slots: +values.slots,
        employee: [values.employee.value],
        duration: +values.interval.value,
        availability_weeks: values.weeks.map((item: any) => item.value),
        availability_hours: [values.start_time.format('HH:mm a'), values.end_time.format('HH:mm a')]
      })
    } catch (error) {
      throw error;
    }
  }, [setRefetch, eventId])

  const updatePricing = useCallback(async (values: any) => {
    try {
      await updatePlatformEventContentPricing({
        eventId,
        contentId: values.content.value,
        contentPricingId: item.pricing_id,
        price: +values.price,
        currency: 'GBP',
        slots: +values.slots,
        employee: [values.employee.value],
        duration: +values.interval.value,
        availability_weeks: values.weeks.map((item: any) => item.value),
        availability_hours: [values.start_time.format('HH:mm a'), values.end_time.format('HH:mm a')]
      })
    } catch (error) {
      throw error;
    }
  }, [setRefetch, eventId])
 

  return {
    createPricing,
    updatePricing
  }
}
