/** Hooks */
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useRouterQuery } from '../../../_hooks/useRouterQuery';

/** Utils */
import moment from 'moment';

/** Request */
import {
  getEventAttendees,
  getEmployeeCalendar,
  getEventCompanies,
  getEventVenues,
  getAllEventContents,
  getCalendarInvitationList,
  getPlatformEventMembers,
} from '../../../../../providers/events';
import { companyEmployeesAttendingEvent, employeesInCompany } from '../../../../../providers/pricing';
import { event } from 'jquery';

export const useData = (
  eventId: any,
  companyID: any,
  calendarType: string,
  currentUserId: string,
  selectedCompanyMembership: string,
  isCompanyId: string
) => {
  const [queries] = useRouterQuery();

  const [eventsRaw, setEventsRaw] = useState({});
  const [attendees, setAttendees] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [calendarInvitationList, setCalendarInvitationList] = useState([]);
  const [venues, setVenues] = useState([]);
  const [contents, setContents] = useState([]);
  const [refetchCalendar, setRefetchCalendar] = useState(false);
  const [refetchCalendarInvitation, setRefetchCalendarInvitation] = useState(false);

  const [selectedAttendee, setSelectedAttendee] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState([]);
  const [selectedContent, setSelectedContent] = useState([]);
  const [selectedVenue, setSelectedVenue] = useState([]);
  let idE: string;

  // const events = useMemo(() => {

  //   const employeeIds = selectedEmployee.map((item: any) => item.value);
  //   const attendeeIds = selectedAttendee.map((item: any) => item.value);

  //   const att = attendees.find((a) => a.name == selectedEmployee[selectedEmployee.length - 1]?.label);

  //   idE = att?.invitee?.id;

  //   const userEmployeeIds = employees
  //     .filter((item: any) => employeeIds.includes(item.id))
  //     .map((item: any) => item.user.id);

  //   const userAttendeeIds = attendees
  //     .filter((item: any) => attendeeIds.includes(item.invitee.id))
  //     .map((item: any) => item.invitee.user.id);

  //   const newEvents = Object.entries(eventsRaw).reduce((acc: any, [id, value]: any) => {
  //     if (
  //       attendeeIds.includes(id) ||
  //       employeeIds.includes(id) ||
  //       id == currentUserId ||
  //       id == selectedCompanyMembership ||
  //       id == idE ||
  //       (attendeeIds.length === 0 && employeeIds.length === 0)
  //     ) {
  //       acc = acc
  //         .concat(
  //           value.map((val: any) => {
  //             if (val.type === 'event_cart') {
  //               if(val?.invitee?.user?.id === currentUserId && val.eventId === eventId){
  //                 console.log("event: ", val)
  //                 let content = contents.find((cnt: any) => cnt.id === val.platformEventPricingSlot.item);
  //                 val.content = content;
  //                 if (content) val.title = content.name;

  //               }
  //             }
  //             return val;
  //           })
  //         )
  //         .sort((a: any, b: any): any => {
  //           return moment(a.start, 'DD/MM/YY HH:mm') > moment(b.end, 'DD/MM/YY HH:mm');
  //         });

  //       return acc;
  //     }
  //     return acc;
  //   }, []);

  //   const newAttendees = calendarInvitationList.filter((item: any) => {
  //     if (employeeIds.length) {
  //       return (
  //         employeeIds.includes(item.invitee.id) ||
  //         item.invitee.id == currentUserId ||
  //         item.invitee.id == idE ||
  //         item.invitee.user.id == idE ||
  //         item.invitee.user.id == currentUserId
  //       );
  //     }
  //     if (attendeeIds.length) {
  //       return (
  //         attendeeIds.includes(item.invitee.id) ||
  //         item.invitee.id == currentUserId ||
  //         item.invitee.user.id == currentUserId
  //       );
  //     }
  //     if (item.invitee.user.id == currentUserId) {
  //       return true;
  //     }
  //     return false;
  //     //return employeeIds.includes(item.invitee.id) || attendeeIds.includes(item.invitee.id)
  //     //return userEmployeeIds.includes(item.invitee.user.id) || userAttendeeIds.includes(item.invitee.user.id);
  //   });

  //   let result = newEvents ? newEvents.concat(newAttendees) : newAttendees;
  //   if (employeeIds?.length === 0 && attendeeIds?.length === 0) {
  //     result = <[]>result.filter((r) => r.invitee.user.id == currentUserId || r.invitee.id == currentUserId);
  //   }
  //   // if (attendeeIds.length) {
  //   //   result = <[]>result.filter((r) => attendeeIds.includes(r.invitee.id));
  //   // }
  //   return result;

  // }, [eventsRaw, selectedEmployee, selectedAttendee, contents, calendarInvitationList, employees, attendees, idE]);

  const getEmployees = useCallback(async () => {
    try {
      const { data }: any = await companyEmployeesAttendingEvent({
        eventId,
      });

      const { data: employeesResponse }: any = await employeesInCompany({
        companyID: isCompanyId ?? companyID,
      });
      const employeesList = employeesResponse?.employeesInCompany?.companyMemberships;

      if (employeesList) {
        const { companyEmployeesAttendingEvent } = data;
        const uniqueEmployee = Object.values(
          companyEmployeesAttendingEvent.reduce((acc: any, curr: any) => {
            if (!acc[curr.id]) {
              acc[curr.id] = curr;
            }
            return acc;
          }, {})
        );
        setEmployees(employeesList);
      }
    } catch (error) {
      console.log(error);
    }
  }, [eventId]);

  const _events = useMemo(() => {
    const employeeIds = selectedEmployee.map((item) => item.value);
    const attendeeIds = selectedAttendee.map((item) => item.value);
    const att = attendees.find((a) => a.name === selectedEmployee[selectedEmployee.length - 1]?.label);
    const idE = att?.invitee?.id;

    // const userEmployeeIds = employees
    //     .filter(item => employeeIds.includes(item.id))
    //     .map(item => item.user.id);

    // const userAttendeeIds = attendees
    //     .filter(item => attendeeIds.includes(item.invitee.id))
    //     .map(item => item.invitee.user.id);

    const eventOrganiserInvitations = [];
    console.log("eventsRaw", eventsRaw, calendarInvitationList);
    const filteredEvents = Object.entries(eventsRaw).reduce((acc: any, [id, value]: [string, any]) => {
      if (
        attendeeIds.includes(id) ||
        employeeIds.includes(id) ||
        id === currentUserId ||
        id === selectedCompanyMembership ||
        id === idE ||
        (attendeeIds.length === 0 && employeeIds.length === 0)
      ) {
        const invitations = value.filter((val: any) => {
          if (val.type === 'event_cart') {
            //Note: attaching content details to event invitation for the event organiser
            if (val?.invitee?.user?.id === currentUserId && val?.platformEvent?.id === eventId) {
              const content = contents.find((cnt) => cnt.id === val.platformEventPricingSlot.item);
              if (content) {
                val.content = content;
                val.title = content.name;
              }
              eventOrganiserInvitations.push(val);
              return val;
            }

            return false;
          }

          return val;
        });

        const invitesNoDuplicate = invitations.filter((invite: any) => {
          //Note: removing the event organiser's invitation from the calendar to avoid showing duplicate,
          // since the above logic is already showing the inviation of type event_cart
          if (eventOrganiserInvitations.find((x) => x.id === invite?.id && x.type !== invite.type)) {
            return false;
          }
          return invite;
        });

        acc.push(...invitesNoDuplicate);
      }

      return acc;
    }, []);

    // Now, after pushing all values, sort the array
    //@ts-ignore
    filteredEvents.sort((a: any, b: any) => moment(a.start, 'DD/MM/YY HH:mm') - moment(b.start, 'DD/MM/YY HH:mm'));

    // const filteredEvents = Object.entries(eventsRaw).reduce((acc: any, [id, value]) => {
    //   console.log("acc: ", acc)
    //   console.log("id: ", id)
    //   console.log("value: ", value)
    //     if (
    //         attendeeIds.includes(id) ||
    //         employeeIds.includes(id) ||
    //         id === currentUserId ||
    //         id === selectedCompanyMembership ||
    //         id === idE ||
    //         (attendeeIds.length === 0 && employeeIds.length === 0)
    //     ) {

    //       console.log("contents: ", contents)
    //         //@ts-ignore
    //         acc.push(...value.map((val: any) => {
    //             if (val.type === 'event_cart') {
    //                 const content = contents.find(cnt => cnt.id === val.platformEventPricingSlot.item);

    //                 if (content) {

    //                 console.log(val)
    //                 console.log("content: ", content)
    //                     val.content = content;
    //                     val.title = content.name;
    //                 }

    //             }

    //             return val;
    //         //@ts-ignore
    //         }))?.sort((a, b) => moment(a.start, 'DD/MM/YY HH:mm') - moment(b.start, 'DD/MM/YY HH:mm'));
    //     }
    //     return acc;
    // }, []);

    const filteredAttendees = calendarInvitationList.filter((item) => {
      if (employeeIds.length) {
        return (
          employeeIds.includes(item.invitee.id) ||
          item.invitee.id === currentUserId ||
          item.invitee.id === idE ||
          item.invitee.user.id === idE ||
          item.invitee.user.id === currentUserId
        );
      }
      if (attendeeIds.length) {
        return (
          attendeeIds.includes(item.invitee.id) ||
          item.invitee.id === currentUserId ||
          item.invitee.user.id === currentUserId
        );
      }
      return item.invitee.user.id === currentUserId;
    });

    let result = filteredEvents.concat(filteredAttendees);
    if (employeeIds.length === 0 && attendeeIds.length === 0) {
      result = result.filter((r) => r.invitee.user.id === currentUserId || r.invitee.id === currentUserId);
    }
    return result;
  }, [
    eventsRaw,
    selectedEmployee,
    selectedAttendee,
    contents,
    calendarInvitationList,
    employees,
    attendees,
    currentUserId,
  ]);

  const _getCalendars = useCallback(async () => {
    try {
      // Combine employee IDs and other relevant IDs
      const allIds = [
        ...employees,
        ...selectedAttendee,
        ...attendees.map((a) => a?.profile),
        { label: 'selectedCompanyMembership', value: selectedCompanyMembership },
      ]
        .map((item) => item?.id ?? item?.value)
        .filter((id) => {
          let isAttendee = attendees.find((attendee) => attendee.profile?.id === id);
          return id !== null && id !== undefined && isAttendee;
        });

      // Fetch calendar data for the combined IDs
      //@ts-ignore
      const { data } = await getEmployeeCalendar([...new Set(allIds)]);

      if (data) {
        // Initialize event and cart invitation objects
        let eventInvitations = {};
        let cartInvitations = {};

        // Process fetched data
        data.getEmployeeCalendar.forEach(({ id, eventInvitations: employeeEventInvitations }) => {
          eventInvitations[id] = [];
          cartInvitations[id] = [];

          employeeEventInvitations
            .filter((item) => item?.id)
            .map((invitation) => {
              if (invitation?.platformEventSlot !== null && invitation?.invitationStatus !== 'DECLINED') {
                eventInvitations[id].push({
                  ...invitation,
                  eventId: invitation.id,
                  type: 'event_slot',
                  title: invitation.platformEventSlot.name,
                  start: invitation.platformEventSlot.startAt,
                  end: invitation.platformEventSlot.endAt,
                });
              }

              if (invitation.platformEventPricingSlot !== null && invitation.invitationStatus !== 'DECLINED') {
                const seContent = contents?.find((co) => co.id === invitation.platformEventPricingSlot.item);

                cartInvitations[id].push({
                  ...invitation,
                  eventId: invitation.id,
                  type: 'event_cart',
                  title: invitation.platformEventPricingSlot && seContent?.name,
                  start: invitation.platformEventPricingSlot && invitation.platformEventPricingSlot.startAt,
                  end: invitation.platformEventPricingSlot && invitation.platformEventPricingSlot.endAt,
                });
              }
            });
        });

        // Merge event and cart invitations
        const mergedInvitations = Object.keys(eventInvitations).reduce((acc, key) => {
          acc[key] = [...eventInvitations[key], ...cartInvitations[key]];
          return acc;
        }, {});

        // Update state with merged invitations
        setEventsRaw(mergedInvitations);
      }
    } catch (error) {
      console.error(error);
    } finally {
      // Reset calendar refetch flag
      setRefetchCalendar(false);
    }
  }, [
    employees,
    selectedAttendee,
    attendees,
    selectedCompanyMembership,
    getEmployeeCalendar,
    setEventsRaw,
    setRefetchCalendar,
  ]);

  const getAttendees = useCallback(async () => {
    try {
      const { data }: any = await getPlatformEventMembers(eventId);

      if (data) {
        const { getPlatformEventMembers } = data;
        const newAttendees = getPlatformEventMembers.map((attendee: any) => {
          const profile = attendee?.profile ? attendee?.profile : attendee.user;

          return {
            ...attendee,
            companyId: profile.company?.id,
            userId: attendee.user.id,
            avatar: profile.avatar,
            name: [attendee.user.firstName, attendee.user.lastName].filter((item: any) => item).join(' '),
            company: profile.company?.name,
            email: profile.email,
            status: attendee.status,
            profiles: profile.profiles,
          };
        });
        setAttendees(newAttendees);
      }
    } catch (error) {
      console.log(error);
    }
  }, [eventId]);

  // const getCalendars = useCallback(async () => {

  //   try {

  //     const ids = [
  //       ...employees,
  //       ...selectedAttendee,
  //       ...attendees.map(a => a.invitee),
  //       { label: 'selectedCompanyMembership', value: selectedCompanyMembership },
  //      // idE &&{ label: 'idE', value: idE, id: undefined},
  //     ].map((item: any) => item.id ?? item.value)

  //     const { data }: any = await getEmployeeCalendar([...new Set(ids)]);

  //     if (data) {
  //       let [eventInvitations, cartInvitation] = data.getEmployeeCalendar.reduce(
  //         (acc: any, curr: any) => {
  //           const { id, eventInvitations } = curr;
  //           if (id in acc[0]) {
  //             acc[0][id] = acc[0][id].concat(
  //               eventInvitations.filter(
  //                 (item: any) => item.platformEventSlot !== null && item.invitationStatus !== 'DECLINED'
  //               )
  //             );
  //             acc[1][id] = acc[1][id].concat(
  //               eventInvitations.filter(
  //                 (item: any) => item.platformEventPricingSlot !== null && item.invitationStatus !== 'DECLINED'
  //               )
  //             );
  //           } else {
  //             acc[0][id] = eventInvitations.filter(
  //               (item: any) => item.platformEventSlot !== null && item.invitationStatus !== 'DECLINED'
  //             );
  //             acc[1][id] = eventInvitations.filter(
  //               (item: any) => item.platformEventPricingSlot !== null && item.invitationStatus !== 'DECLINED'
  //             );
  //           }
  //           acc[0][id] = Object.values(
  //             acc[0][id].reduce((accCurr: any, curr: any) => {
  //               if (!(curr.id in accCurr)) {
  //                 accCurr[curr.id] = curr;
  //               }
  //               return accCurr;
  //             }, {})
  //           ).map((item: any) => ({
  //             ...item,
  //             eventId: item.id,
  //             type: 'event_slot',
  //             title: item.platformEventSlot && item.platformEventSlot.name,
  //             start: item.platformEventSlot && item.platformEventSlot.startAt,
  //             end: item.platformEventSlot && item.platformEventSlot.endAt,
  //           }));
  //           acc[1][id] = Object.values(
  //             acc[1][id].reduce((accCurr: any, curr: any) => {
  //               if (!(curr.id in accCurr)) {
  //                 accCurr[curr.id] = curr;
  //               }
  //               return accCurr;
  //             }, {})
  //           ).map((item: any) => {
  //             const seContent = item.platformEventPricingSlot?.event?.contents?.find(
  //               (co: any) => item.platformEventPricingSlot.item === co.id
  //             );
  //             return {
  //               ...item,
  //               eventId: item.id,
  //               type: 'event_cart',
  //               title: item.platformEventPricingSlot && seContent?.name,
  //               start: item.platformEventPricingSlot && item.platformEventPricingSlot.startAt,
  //               end: item.platformEventPricingSlot && item.platformEventPricingSlot.endAt,
  //             };
  //           });
  //           return acc;
  //         },
  //         [{}, {}]
  //       );

  //       const mergedInvitation = Object.keys(eventInvitations).reduce((acc: any, key: any) => {
  //         acc[key] = [].concat(eventInvitations[key], cartInvitation[key]);
  //         return acc;
  //       }, {});

  //       setEventsRaw(mergedInvitation);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setRefetchCalendar(false);
  //   }
  // }, [employees.length, attendees.length, selectedAttendee.length, selectedEmployee.length]);

  const getCalendarInvitation = useCallback(async () => {
    try {
      const { data }: any = await getCalendarInvitationList(
        Array.from(
          new Set(
            []
              .concat(
                employees?.map((item: any) => item.id),
                attendees?.map((item: any) => item?.profile?.id)
              )
              .filter((id) => {
                return id !== null && id !== undefined;
              })
          )
        )
      );
      if (data) {
        setCalendarInvitationList(
          data.getCalendarInvitationList.map((item: any) => ({
            ...item,
            eventId: item.id,
            type: 'calendar_invitation',
            title: item.calendarEvent && item.calendarEvent.name,
            // title: `Unavailable`,
            start: item.calendarEvent && item.calendarEvent.startAt,
            end: item.calendarEvent && item.calendarEvent.endAt,
          }))
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setRefetchCalendarInvitation(false);
    }
  }, [employees, attendees]);

  const getVenues = useCallback(async () => {
    try {
      const { data }: any = await getEventVenues(eventId);

      if (data) {
        const { getEventVenues: result } = data;
        setVenues(result);
      }
    } catch (error) {
      console.log(error);
    }
  }, [eventId]);

  const getContents = useCallback(async () => {
    try {
      const { data } = await getAllEventContents(eventId);

      if (data) {
        const {
          getAllEventContents: { contents: result },
        } = data;
        setContents(result.filter((item: any) => item.isScheduleAvailable));
      }
    } catch (error) {
      console.log(error);
    }
  }, [eventId]);

  useEffect(() => {
    getEmployees();
  }, [getEmployees]);

  useEffect(() => {
    getAttendees();
  }, [getAttendees]);

  useEffect(() => {
    _getCalendars();
  }, [_getCalendars]);

  useEffect(() => {
    if (refetchCalendar) _getCalendars();
  }, [_getCalendars, refetchCalendar]);

  useEffect(() => {
    getVenues();
  }, [getVenues]);

  useEffect(() => {
    getContents();
  }, [getContents]);

  useEffect(() => {
    getCalendarInvitation();
  }, [getCalendarInvitation]);

  useEffect(() => {
    if (refetchCalendarInvitation) getCalendarInvitation();
  }, [getCalendarInvitation, refetchCalendarInvitation]);

  useEffect(() => {
    if (queries.content_id && contents) {
      const content = contents.find((item: any) => item.id === queries.content_id);
      if (content) {
        setSelectedContent([{ value: content.id, label: content.name }]);
      }
    }
  }, [contents, queries.content_id, queries.booking]);

  // useEffect(() => {
  //   if (['company', 'attendee'].includes(calendarType)) {
  //     setSelectedContent([
  //       {
  //         value: 'meeting',
  //         label: 'Meeting',
  //       },
  //     ]);
  //   }
  //   if (calendarType === 'attendee') {
  //     setSelectedAttendee(
  //       attendees
  //         .filter((item) => item.invitee.id === queries.attendee_id)
  //         .map((val: any) => ({
  //           value: val.invitee.id,
  //           label: [val.invitee.user.firstName, val.invitee.user.lastName].filter((item: any) => item).join(' '),
  //         }))
  //     );
  //   }
  // }, [calendarType, attendees, queries.attendee_id]);

  // useEffect(() => {
  //   // console.log("match", queries.attendee_id, selectedAttendee, calendarType);
  //   if (calendarType === 'attendee' && selectedAttendee.length === 0 && queries.attendee_id) {
  //     console.log("match")
  //     const matching = attendees
  //       .filter((item) => item.invitee.id === queries.attendee_id)
  //       .map((val: any) => ({
  //         value: val.invitee.id,
  //         label: [val.invitee.user.firstName, val.invitee.user.lastName].filter(Boolean).join(' '),
  //       }));

  //     if (matching.length > 0) {
  //       setSelectedAttendee(matching);
  //     }
  //   }
  // }, [calendarType, attendees, queries.attendee_id, selectedAttendee.length]);

  return {
    //events,
    _events,
    eventsRaw,
    setRefetchCalendar,
    employees,
    attendees,
    setAttendees,
    venues,
    contents,
    selectedAttendee,
    setSelectedAttendee,
    selectedEmployee,
    setSelectedEmployee,
    selectedContent,
    setSelectedContent,
    selectedVenue,
    setSelectedVenue,
  };
};
