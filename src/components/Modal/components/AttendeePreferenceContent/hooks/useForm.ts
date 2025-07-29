/** Hooks */
import { useCallback } from 'react';

/** Utils */
import moment from 'moment';

/** Request */
import { updateEventArrayOneField } from '../../../../../providers/events';

export const useForm = (eventId: any, client: any, data: any) => {
  const update = useCallback(async (values: any) => {
    try {
      let data1 = await updateEventArrayOneField(eventId, 'attendee_preferences', values.attendee_preferences);
      client.writeData({
        data: {
          ...data,
          event: {
            ...data.event,
            attendee_preferences: values.attendee_preferences
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
