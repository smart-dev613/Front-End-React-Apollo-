/** Hooks */
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouteQuery } from './useRoutequery';

/** Utils */
import { getEventPricingDetail, getEmployeeCalendar } from '../../../../providers/events';

/** Constants */
import { GET_EVENT_INFO } from '../../../../gql/queries';

export const useData = (client: any) => {
  const [queries] = useRouteQuery();

  const [pricingDetail, setPricingDetail] = useState<any>(null);
  const [contentPricingEmployee, setContentPricingEmployee] = useState<any>(null);
  const [bookedScheduled, setBookedScheduled] = useState<any>(null);
  
  const eventId = useMemo(() => {
    const result = client.readQuery({ query: GET_EVENT_INFO })
    return result.eventId;
  }, [client])
  
  const fetchContentPricingDetail = useCallback(async () => {
    try {
      const { data: { getEventContentPricing } } = await getEventPricingDetail({
        eventId,
        contentId: queries.contentId,
        contentPricingId: queries.pricingId,
      });
      if (getEventContentPricing) {
        setPricingDetail(getEventContentPricing);
        const { content, content: { pricing } } = getEventContentPricing;

        if (pricing) {
          const { employee } = pricing;
          setContentPricingEmployee(employee);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [eventId, queries.contentId, queries.pricingId])

  // const fetchBookedCalendar = useCallback(async () => {
  //   try {
  //     const calendar = await getEventCartItemScheduledByEmployee()
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }, [eventId, contentPricingEmployee])

  // const fetchEventCalendar = async () => {
  //   try {
  //     const calendar = await getEmployeeCalendar()
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  useEffect(() => {
    fetchContentPricingDetail();
  }, [fetchContentPricingDetail])

  return {
    pricingDetail,
    bookedScheduled
  }
}
