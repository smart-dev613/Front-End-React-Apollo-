/** Hooks */
import { useCallback } from 'react';

/** Utils */
import moment from 'moment';

/** Request */
import { updateEventArrayOneField } from '../../../../../providers/events';

export const useForm = (eventId: any, client: any, data: any) => {
  const update = useCallback(async (values: any) => {
    try {
      await updateEventArrayOneField(eventId, 'company_preferences', values.company_preferences);
      client.writeData({
        data: {
          ...data,
          event: {
            ...data.event,
            company_preferences: values.company_preferences
          }
        }
      })
    } catch (error) {
      throw error;
    }
  }, [eventId])

  return {
    update
  }
}
