/** Hooks */
import { useState, useCallback, useEffect, useMemo } from 'react';

/** Utils */
import moment from 'moment';

/** Request */
import { getEventAttendees, getEmployeeCalendar, getEventCompanies, getEventVenues, getAllEventContents } from '../../../../../providers/events';
import { companyEmployeesAttendingEvent } from '../../../../../providers/pricing';

export const useData = (eventId: any, companyID: any) => {
  const [eventsRaw, setEventsRaw] = useState({});
  const [attendees, setAttendees] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [venues, setVenues] = useState([]);
  const [contents, setContents] = useState([]);
  const [refetchCalendar, setRefetchCalendar] = useState(false);

  const [selectedEmployee, setSelectedEmployee] = useState([]);
  const [selectedContent, setSelectedContent] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState('');

  const events = useMemo(() => {
    const employeeIds = selectedEmployee.map((item: any) => item.value)
    return Object.entries(eventsRaw)
      .reduce((acc: any, [id, value]: any) => {
        if (employeeIds.length === 0 || employeeIds.includes(id)) {
          acc = acc
            .concat(
              value.map((val: any) => {
                if (val.type === 'content' || val.type === 'event_cart') {
                  let content = contents.find((cnt: any) => cnt.id === val.platformEventPricingSlot.item);
                  val.content = content;
                  if (content) val.title = content.name;
                }
                return val
              })
            )
            .sort((a: any, b: any): any => {
              return (
                moment(a.start, 'DD/MM/YY HH:mm') >
                moment(b.end, 'DD/MM/YY HH:mm')
              );
            })
        }
        return acc;
      }, [])
      .sort((a: any, b: any) => {
        return (
          moment(a.createdAt) > moment(b.createdAt)
        ) ? -1 : 1
      })
      .map((item: any, idx: number) => ({
        ...item,
        table_idx: idx + 1,
        table_name: item.content ? item.content.name : '-',
        table_start: item.start,
        table_end: item.end,
        table_status: item.invitationStatus,
        table_employee: item.platformEventPricingSlot.pricing.employee
          .map((emp: any) => [emp.user.firstName, emp.user.lastName].join(' '))
          .join(', '),
        table_user: [item.platformEventPricingSlot.user.firstName, item.platformEventPricingSlot.user.lastName].join(' '),
        table_quantity: item.platformEventPricingSlot.quantity
      }))
  }, [eventsRaw, selectedEmployee, contents])

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

  const getAttendees = useCallback(async () => {
    try {
      const { data }: any = await getEventAttendees(eventId);
      if (data) {
        const { getEventAttendees:  eventAttendees  } = data;
        setAttendees(eventAttendees)
      }
    } catch (error) {
      console.log(error);
    }
  }, [eventId])

  const getCalendars = useCallback(async () => {
    try {
      const { data }: any = await getEmployeeCalendar(employees?.map((item: any) => item.id).filter(id => id !== null));

      if (data) {
        let [eventInvitations, cartInvitation] = data.getEmployeeCalendar.reduce((acc: any, curr: any) => {
          const { id, eventInvitations } = curr;
          if (id in acc[0]) {
            acc[0][id] = acc[0][id].concat(eventInvitations.filter((item: any) => item.platformEventSlot !== null && item.invitationStatus !== 'DECLINED'))
            acc[1][id] = acc[1][id].concat(eventInvitations.filter((item: any) => item.platformEventPricingSlot !== null && item.invitationStatus !== 'DECLINED'))
          } else {
            acc[0][id] = eventInvitations.filter((item: any) => item.platformEventSlot !== null && item.invitationStatus !== 'DECLINED')
            acc[1][id] = eventInvitations.filter((item: any) => item.platformEventPricingSlot !== null && item.invitationStatus !== 'DECLINED')
          }
          acc[0][id] = Object.values(
            acc[0][id].reduce((accCurr: any, curr: any) => {
              if (!(curr.id in accCurr)) {
                accCurr[curr.id] = curr;
              }
              return accCurr;
            }, {})
          ).map((item: any) => ({
            ...item,
            eventId: item.id,
            type: 'event_slot',
            title: item.platformEventSlot && item.platformEventSlot.name,
            start: item.platformEventSlot && item.platformEventSlot.startAt,
            end: item.platformEventSlot && item.platformEventSlot.endAt,
          }))
          acc[1][id] = Object.values(
            acc[1][id].reduce((accCurr: any, curr: any) => {
              if (!(curr.id in accCurr)) {
                accCurr[curr.id] = curr;
              }
              return accCurr;
            }, {})
          ).map((item: any) => ({
            ...item,
            eventId: item.id,
            type: 'event_cart',
            title: item.platformEventPricingSlot && item.platformEventPricingSlot.name,
            start: item.platformEventPricingSlot && item.platformEventPricingSlot.startAt,
            end: item.platformEventPricingSlot && item.platformEventPricingSlot.endAt,
          }))
          return acc
        }, [{}, {}])

        setEventsRaw(cartInvitation);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setRefetchCalendar(false);
    }
  }, [employees]);

  const getVenues = useCallback(async () => {
    try {
      const { data }: any = await getEventVenues(eventId);

      if (data) {
        const { getEventVenues: result } = data;
        setVenues(result);
      }
    } catch (error) {
      console.log(error)
    }
  }, [eventId]);

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
    getEmployees();
  }, [getEmployees])

  useEffect(() => {
    getAttendees();
  }, [getAttendees])

  useEffect(() => {
    getCalendars();
  }, [getCalendars])

  useEffect(() => {
    if (refetchCalendar) getCalendars();
  }, [getCalendars, refetchCalendar])

  useEffect(() => {
    getVenues();
  }, [getVenues])

  useEffect(() => {
    getContents();
  }, [getContents])

  return {
    events,
    eventsRaw,
    setRefetchCalendar,
    employees,
    attendees,
    venues,
    contents,
    selectedEmployee,
    setSelectedEmployee,
    selectedContent,
    setSelectedContent,
    selectedVenue,
    setSelectedVenue,
  }
}
