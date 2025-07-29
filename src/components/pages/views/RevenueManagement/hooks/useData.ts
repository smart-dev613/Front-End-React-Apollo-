/** Hooks */
import { useState, useCallback, useEffect } from 'react';

/** Request */
import { getAllEventContentsPricing, getAllEventContents } from '../../../../../providers/events';
import { companyEmployeesAttendingEvent } from '../../../../../providers/pricing';

export const useData = (eventId: any, companyID: any) => {
  const [data, setData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [contents, setContents] = useState([]);
  const [refetch, setRefetch] = useState(false);

  const getData = useCallback(async () => {
    try {
      const { data: { getAllEventContentsPricing: { contents } } } = await getAllEventContentsPricing(eventId);
      setData(
        contents
          .filter((item: any) => item.pricing && item.pricing.length > 0)
          .reduce((acc: any, curr: any) => {
            curr.pricing.forEach((element: any) => {
              Object.entries(element).forEach(([key, value]: any) => {
                curr[`pricing_${key}`] = value
              })
              acc.push({
                ...curr,
                pricing: [element],
              })
            });
            return acc;
          }, [])
      );
    } catch (error) {
      console.log(error)
    } finally {
      setRefetch(false)
    }
  }, [eventId, refetch])

  const getEmployees = useCallback(async () => {
    try {
      const { data }: any = await companyEmployeesAttendingEvent({
        eventId
      });

      if (data) {
        const { companyEmployeesAttendingEvent: { companyMemberships } } = data;
        setEmployees(companyMemberships);
      }
    } catch (error) {
      console.log(error);
    }
  }, [eventId])

  const getContents = useCallback(async () => {
    try {
      const { data } = await getAllEventContents(eventId);

      if (data) {
        const { getAllEventContents: { contents: result } } = data;
        setContents(result);
      }
    } catch (error) {
      console.log(error)
    }
  }, [eventId]);
  
  useEffect(() => {
    getData()
  }, [getData])

  useEffect(() => {
    if (refetch) getData()
  }, [refetch, getData])

  useEffect(() => {
    getEmployees();
  }, [getEmployees])
  useEffect(() => {
    getContents();
  }, [getContents])

  return {
    data,
    setRefetch,
    employees,
    contents,
  }
}
