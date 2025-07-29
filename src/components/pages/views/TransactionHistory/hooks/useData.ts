/** Hooks */
import { useState, useCallback, useEffect, useMemo } from 'react';

/** Request */
import { getAllEventContents } from '../../../../../providers/events';
import { companyEmployeesAttendingEvent, getAllEventTransactionHistory } from '../../../../../providers/pricing';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo } from '@fortawesome/free-solid-svg-icons';
/** Utils */
import moment from 'moment';

export const useData = (eventId: any, companyID: any) => {
  const [data, setData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [contents, setContents] = useState([]);
  const [refetch, setRefetch] = useState(false);

  const totalAmount = useMemo(() => {
    return data.reduce((acc: any, curr: any) => {
      return acc + (+curr.amount * (curr.status === 'INCOME' ? 1 : -1))
    }, 0)
  }, [data])

  const getData = useCallback(async () => {
    try {
      const { data: { getAllEventTransactionHistory: histories } }: any = await getAllEventTransactionHistory(eventId);
      setData(
        (histories || []).map((item: any, idx: number) => {
          return {
            ...item,
            order: idx + 1,
            invoiceid: item?.carts?.[0]?.xeroId,
            pricing_label: `${item.status === 'INCOME' ? '+' : '-'} ${item.currency} ${item.amount/100}`.toUpperCase(),
            user_fullname: [item.user.firstName, item.user.lastName].filter(Boolean).join(' '),
            create_date: moment(item.createdAt).format('LL'),
            create_time: moment(item.createdAt).format('HH:mm a')
          }
        })
      )
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
    totalAmount,
  }
}
