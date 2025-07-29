import React, { useMemo, useEffect, useState } from 'react';

/** Hooks */
import { useHistory } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { useData } from './hooks/useData';
import { useRouterQuery } from '../../_hooks/useRouterQuery';

/** Components */
import { Container } from './components/general';
import CalendarView from '../../_shared/CalendarView';
import ReactMultiSelectCheckboxes from 'react-multiselect-checkboxes';

/** Utils */
import moment from 'moment';
import { bindActionCreators, Dispatch, compose } from 'redux';
import { withApollo } from 'react-apollo';
import { connect } from 'react-redux';
import { GET_EVENT_INFO } from '../../../../gql/queries';
import { userIsOrganiser } from '../../../../util/common';
import { getPlatformEventMembers } from '../../../../providers/events';

/** Store */
import { showModal } from '../../../../store/modal/action';
import { setCurrentPage, setIsEditPage } from '../../../../store/ui/action';

/** Types */
import { Props } from './types';
import { AppState } from '../../../../store/root';
import CalenderSchedulerView from '../../_shared/CalenderScheduler';

const FILTER_LIST = {
  general: ['employee', 'attendee', 'venue', 'content'],
  content: ['content', 'employee', 'venue'],
  company: ['venue', 'employee'],
  attendee: ['venue', 'attendee'],
};

const Calendar: React.FC<Props> = (props: Props) => {
  const [platformEventMembers, setPlatformEventMembers] = useState([]);

  const history = useHistory();

  const { ui, user, setCurrentPage, showModal } = props;
  const {
    data: {
      eventId,
      startTime,
      endTime,
      organiser: {
        company: { id: companyId },
      },
      theme,
      slug,
      eventType,
      organiser,
    },
    data: platformEvent,
  }: any = useQuery(GET_EVENT_INFO);

  const { calendarPrimaryColour, calendarSecondaryColour } = theme;

  const [queries] = useRouterQuery();

  const isContentId = useMemo(() => queries.content_id, [queries]);
  const isCompanyId = useMemo(() => queries.company_id, [queries]);
  const isAttendeeId = useMemo(() => queries.attendee_id, [queries]);

  const calendarType = useMemo(() => {
    if (isContentId) return 'content';
    if (isAttendeeId) return 'attendee';
    if (isCompanyId) return 'company';

    return 'general';
  }, [isCompanyId, isContentId, isAttendeeId]);

  let {
    //events,
    _events,
    setRefetchCalendar,
    eventsRaw,
    employees,
    attendees,
    setAttendees,
    venues,
    contents,
    selectedAttendee,
    selectedEmployee,
    selectedContent,
    selectedVenue,
    setSelectedAttendee,
    setSelectedContent,
    setSelectedEmployee,
    setSelectedVenue,
  } = useData(
    eventId,
    companyId,
    calendarType,
    user.userData.id,
    user.userData.selectedCompanyMembership?.id,
    isCompanyId
  );
  const openModal = (params = {}) => {
    showModal('BOOK_SCHEDULE', null, null, 'lg', params);
  };
  console.log("_events", _events)
  const [content, setContent] = useState(null);
  const [contentOptions, setContentOptions] = useState([]);
  const [hasUserTouchedAttendees, setHasUserTouchedAttendees] = useState(false);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 576);
  // const [contentEmployee, setContentEmployee] = useState(null);

  const c = selectedContent[0]?.id;

  useEffect(() => {
    if (contents.length && selectedContent.length) {
      const currentContent = contents.find((c) => c.id === selectedContent[0].value);

      if (currentContent) {
        setContent(currentContent);
      }
    }
  }, c);

  const attendeeOptions = useMemo(() => {
    return attendees
      .map((val: any) => {
        const id = val?.profile?.id || val?.invitee?.id || val?.user?.id; // fallback fallback fallback

        // If no ID, skip this entry
        if (!id) return null;

        const name =
          val.name ??
          [val?.invitee?.user?.firstName, val?.invitee?.user?.lastName].filter(Boolean).join(' ') ??
          [val?.user?.firstName, val?.user?.lastName].filter(Boolean).join(' ');

        return {
          value: id,
          label: name || 'Unnamed',
        };
      })
      .filter(Boolean); // Remove any `null`s
  }, [attendees]);

  useEffect(() => {
    setContentOptions([
      ...contents
        .filter((content) => content.contentStatus === 'ACTIVE')
        .map((val: any) => {
          return {
            value: val.id,
            label: val.name,
          };
        }),
    ]);
  }, [contents]);

  useEffect(() => {
    getPlatformEventMembers(eventId).then((response: any) => {
      setPlatformEventMembers(response?.data?.getPlatformEventMembers);
    });
  }, []);

  useEffect(() => {
    // Add a resize event listener to update isMobile state
    const handleResize = () => {
      setIsMobile(window.innerWidth < 576);
    };

    window.addEventListener('resize', handleResize);

    // Remove the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (!attendeeOptions.length || selectedAttendee.length > 0 || hasUserTouchedAttendees) return;
    const loggedInOption = attendeeOptions.find((opt) => opt.value === user?.userData?.id);

    if (loggedInOption) {
      setSelectedAttendee([loggedInOption]);
    }
  }, [attendeeOptions, selectedAttendee.length, hasUserTouchedAttendees, attendees, user?.userData?.id]);

  useEffect(() => {
    employees?.map((val: any) => {
      if (val.user.id === user?.userData?.id) {
        const list = {
          value: val.id,
          label: [val.user.firstName, val.user.lastName].filter((item: any) => item).join(' '),
        };
        setSelectedEmployee([list]);
      }
    });

    const cEmployee = employees.filter((e) => content?.pricing.map((p) => p?.employee[0].id).includes(e.id));

    if (content?.pricing?.length && employees?.length) {
      const contentEmployeeIds = content.pricing.map((p) => p.employee[0].id);

      const cEmployee = employees.filter((e) => contentEmployeeIds.includes(e.id));

      const contentEmployee: { label: string; value: string }[] = cEmployee.map((cE) => ({
        value: cE.id,
        label: cE?.user.firstName + ' ' + cE?.user.lastName,
      }));

      if (contentEmployee.length) {
        setSelectedEmployee(contentEmployee);
      }
    }
  }, [content?.id, employees?.length, content]);

  useEffect(() => {
    setCurrentPage('Calendar');
  }, []);

  useEffect(() => {
    if (queries.booking) {
      let event = _events.find((event) => event.calendarSlotId === queries.booking);

      let venue = venues[0];
      let attendees = event?.platformEventSlot?.attendees;

      setSelectedAttendee([...attendees.map((attendee) => ({ value: attendee.invitee.id, label: '' }))]);
      setSelectedContent([{ value: 'meeting', label: 'Meeting' }]);
      setSelectedVenue([{ value: venue?.id, label: venue?.name }]);
    }
  }, [venues]);

  const isOrganiser = userIsOrganiser(user, organiser);
  return (
    <Container ui={ui} theme={theme} className="container-fluid page-container py-4">
      <div className="d-flex action-top">
        <button
          className="calendar-today"
          style={{
            background: theme.calendarPrimaryColour || 'rgb(159, 136, 169)',
            color: '#ffffff',
            width: '100%',
            maxWidth: 150,
          }}
        >
          Today
        </button>
        {FILTER_LIST[calendarType].map((item: string) => {
          // if (isOrganiser && item === 'employee' && employees.length && (content?.pricing?.length || !isContentId))
          //   return (
          //     <>

          //       <ReactMultiSelectCheckboxes
          //         placeholder="Employee"
          //         placeholderButtonLabel={isMobile ? 'EM' : 'Employee'}
          //         rightAligned={false}
          //         options={employees?.map((val: any) => ({
          //           value: val.id,
          //           label: [val.user.firstName, val.user.lastName].filter((item: any) => item).join(' '),
          //         }))}
          //         value={selectedEmployee}
          //         onChange={(selected: any) => setSelectedEmployee(selected)}
          //         styles={{
          //           dropdownButton: () => ({
          //             background: 'rgb(159, 136, 169)',
          //             color: '#ffffff',
          //             width: '100%',
          //             display: 'flex',
          //             justifyContent: 'space-between',
          //             maxWidth: 150,
          //           }),
          //         }}
          //       />
          //     </>
          //   );

          if (item === 'attendee' && attendees.length && !isContentId)
            return (
              <ReactMultiSelectCheckboxes
                placeholder="Attendees"
                placeholderButtonLabel={isMobile ? 'ATT' : 'Attendees'}
                rightAligned={true}
                options={attendeeOptions}
                value={selectedAttendee}
                onChange={(selected: any) => {
                  setHasUserTouchedAttendees(true);

                  const updated = Array.isArray(selected) ? selected : [selected];

                  const selectedFromOptions = attendeeOptions.filter((opt) =>
                    updated.some((sel) => sel?.value === opt.value)
                  );

                  // const lastSelected = selectedFromOptions.slice(-1);

                  setSelectedAttendee(selectedFromOptions);
                }}
                styles={{
                  dropdownButton: () => ({
                    background: theme.calendarPrimaryColour || 'rgb(159, 136, 169)',
                    color: '#ffffff',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    maxWidth: 150,
                  }),
                }}
                // getDropdownButtonLabel={({ value, placeholderButtonLabel }) => {
                //   if (value && value.length === 1) {
                //     return value[0].label;
                //   } else {
                //     // return `${value.lengh} selected`
                //   }
                //   return placeholderButtonLabel;
                // }}
              />
            );
          // if (item === 'attendee' && attendees.length && !isContentId) {
          //   const attendeeOptions = attendees.map((val: any) => ({
          //     value: val?.profile?.id,
          //     label: val.name,
          //   }));

          //   return (
          //     <ReactMultiSelectCheckboxes
          //       placeholder="Attendees"
          //       placeholderButtonLabel={isMobile ? 'ATT' : 'Attendees'}
          //       rightAligned={true}
          //       options={attendeeOptions}
          //       value={selectedAttendee}
          //       onChange={(selected: any) => {
          //         const updated = Array.isArray(selected) ? selected : [selected];
          //         // setAttendees(null);
          //         setSelectedAttendee(updated);
          //         // setSelectedAttendee(prev => [...prev, updated]);
          //       }}
          //       styles={{
          //         dropdownButton: () => ({
          //           background: theme.calendarPrimaryColour || 'rgb(159, 136, 169)',
          //           color: '#ffffff',
          //           width: '100%',
          //           display: 'flex',
          //           justifyContent: 'space-between',
          //           maxWidth: 150,
          //         }),
          //       }}
          //     />
          //   );
          // }

          if (item === 'content')
            return (
              <>
                {content?.pricing?.length > 0 && (
                  <>
                    {/* <ReactMultiSelectCheckboxes
                      placeholder="Employee"
                      rightAligned={true}
                      options={employees?.map((val: any) => ({
                        value: val.id,
                        label: [val.user.firstName, val.user.lastName].filter((item: any) => item).join(' '),
                      }))}
                      value={selectedEmployee}
                      defaultValue={selectedEmployee}
                      onChange={(selected: any) => setSelectedEmployee(selected)}
                      styles={{
                        dropdownButton: () => ({
                          background: 'rgb(159, 136, 169)',
                          color: '#ffffff',
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'space-between',
                          maxWidth: 150,
                        }),
                      }}
                    /> */}

                    {/* <ReactMultiSelectCheckboxes
                      placeholder="Attendees"
                      rightAligned={true}
                      options={attendees
                        .filter((val) => {
                          if (calendarType === 'company') {
                            return employees.find((emp: any) => emp.id === val.invitee.id);
                          }
                          return true;
                        })
                        .map((val: any) => ({
                          value: val.invitee.id,
                          label: [val.invitee.user.firstName, val.invitee.user.lastName]
                            .filter((item: any) => item)
                            .join(' '),
                        }))}
                      value={selectedAttendee}
                      onChange={(selected: any) => setSelectedAttendee(selected)}
                      styles={{
                        dropdownButton: () => ({
                          background: 'rgb(159, 136, 169)',
                          color: '#ffffff',
                          width: '100%',
                          display: 'flex',
                          justifyContent: 'space-between',
                          maxWidth: 150,
                        }),
                      }}
                    /> */}
                  </>
                )}
                {/* {content?.selectedVenue && (
                  <ReactMultiSelectCheckboxes
                    placeholder="Venues"
                    placeholderButtonLabel="Venues"
                    rightAligned={true}
                    options={venues.map((val: any) => ({
                      value: val.id,
                      label: val.name,
                    }))}
                    value={content?.selectedVenue ?JSON.parse(content?.selectedVenue) : selectedVenue}
                    onChange={(selected: any) => setSelectedVenue(selected)}
                    styles={{
                      dropdownButton: () => ({
                        background: 'rgb(159, 136, 169)',
                        color: '#ffffff',
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'space-between',
                        maxWidth: 150,
                      }),
                    }}
                  />
                )} */}
                <ReactMultiSelectCheckboxes
                  placeholder="Product and Services"
                  placeholderButtonLabel={isMobile ? 'P & S' : 'Product and Services'}
                  rightAligned={true}
                  value={selectedContent}
                  isDisabled={isContentId}
                  options={contentOptions}
                  onChange={(selected: any[]) => {
                    setSelectedAttendee([]);
                    setSelectedEmployee([]);
                    setSelectedVenue([] as any);
                    setContent(null);
                    setSelectedContent([selected[selected.length - 1]].filter((item: any) => item));
                  }}
                  styles={{
                    dropdownButton: () => ({
                      background: theme.calendarPrimaryColour || 'rgb(159, 136, 169)',
                      color: '#ffffff',
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      maxWidth: 150,
                    }),
                  }}
                />
              </>
            );
          if (item === 'venue' && (venues.length > 0 || content?.selectedVenue))
            return (
              <ReactMultiSelectCheckboxes
                placeholder="Venues"
                placeholderButtonLabel={isMobile ? 'VE' : 'Venues'}
                rightAligned={true}
                // defaultValue={content?.selectedVenue ? JSON.parse(content.selectedVenue) : selectedVenue}
                value={content?.selectedVenue ? JSON.parse(content.selectedVenue) : selectedVenue}
                //isDisabled={content?.selectedVenue?.value}
                isMulti={false}
                options={venues.map((val: any) => ({
                  value: val.id,
                  label: val.name,
                }))}
                //disabled={true}
                onChange={(selected: any, e: any) => {
                  let ncontents = contents
                    .filter((content) => {
                      let contentVenue = JSON.parse(content?.selectedVenue);
                      return content.contentStatus === 'ACTIVE' && contentVenue.value === selected.value;
                    })
                    .map((val: any) => {
                      return {
                        value: val.id,
                        label: val.name,
                      };
                    });

                  if (ncontents?.length) {
                    // if(selected.value !== selectedVenue?.value){
                    //   setContent(null);
                    //   setSelectedContent([])
                    // }

                    if (selected.value === selectedVenue[0]?.value) {
                      setSelectedVenue([]);
                      setContent(null);
                      setSelectedContent([]);

                      setContentOptions([
                        ...contents
                          .filter((content) => content.contentStatus === 'ACTIVE')
                          .map((val: any) => {
                            return {
                              value: val.id,
                              label: val.name,
                            };
                          }),
                      ]);
                    } else {
                      setContent(null);
                      setSelectedContent([]);
                      setSelectedVenue([selected]);

                      if (ncontents?.length === 1) {
                        setSelectedContent(ncontents);
                      }

                      setContentOptions(ncontents);
                    }
                  }
                }}
                styles={{
                  dropdownButton: () => ({
                    background: theme.calendarPrimaryColour || 'rgb(159, 136, 169)',
                    color: '#ffffff',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    maxWidth: 150,
                  }),
                }}
              />
            );
        })}
      </div>
      <CalenderSchedulerView
        content={content}
        events={_events}
        platformEvent={platformEvent}
        onClickTime={(date) => {
          openModal({
            date,
            eventsRaw,
            isMeeting: true,
            setRefetchCalendar,
            platformEventMembers,
            employees,
            contents,
            venues,
            attendees,
            selectedAttendee,
            selectedEmployee,
            selectedContent,
            selectedVenue,
          });
        }}
        onEventClick={(event: any) => {
          //get all invitation for a calendar slot booking with calendarSlotId
          const allBookedSlots: any = Object.values(eventsRaw)
            .flat()
            .filter((booking: any) => {
              //if(booking?.platformEvent?.id === platformEvent?.eventId){
              if (booking.calendarSlotId) {
                return booking?.calendarSlotId === event?.calendarSlotId;
              }
              return false;
            });

          const clickContent = contents.find((c) => c.id === event?.eventId);

          if (event.type === 'calendar_invitation') {
            const start = new Date(event.start);
            const end = new Date(event.end);

            // Difference in milliseconds
            const diffMs = end.getTime() - start.getTime();

            // Convert to hours and minutes
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

            console.log('event is clicked.', event,event.start, employees);
            // return;
            openModal({
              isView: true,
              date: event.start,
              isMeeting: true,
              extendedProps: event,
              // allBookedSlots,
              // attendees,
              // platformEventMembers,
              //selectedContent: extendedProps?.content,
              employees,
              // selectedVenue,
              // selectedAttendee: selectedAttendee[0],
              // attendeeAvatar: employees?.find((e) => e.id == selectedAttendee[0]?.value)?.avatar,
            });
          }
          if (event.type === 'event_slot') {
            openModal({
              isView: true,
              date: event.start,
              isMeeting: true,
              extendedProps: event,
              allBookedSlots,
              attendees,
              platformEventMembers,
              //selectedContent: extendedProps?.content,
              employees,
              // selectedVenue,
              // selectedAttendee: selectedAttendee[0],
              attendeeAvatar: employees?.find((e) => e.id == selectedAttendee[0]?.value)?.avatar,
            });
          } else {
            openModal({
              isView: true,
              platformEventMembers,
              allBookedSlots,
              attendees,
              date: event.start,
              // selectedContent: extendedProps?.content,
              id: event.eventId,
              isMeeting: false,
              extendedProps: event,
            });
          }
        }}
      />
      {/* {
        content  ? (   
        <CalenderSchedulerView 
        content={content} 
        onClickTime={(date) => {
               openModal({
                  date,
                  eventsRaw,
                  isMeeting: true,
                  setRefetchCalendar,
                  platformEventMembers,
                  employees,
                  contents,
                  venues,
                  attendees,
                  selectedAttendee,
                  selectedEmployee,
                  selectedContent,
                  selectedVenue,
                });
        }}
        />
      ) : (  
         <CalendarView
            events={_events}
            onDateClick={(datevalue: any) => {
              
              
          const { date } = datevalue;
          if(queries.booking && !queries.content_id){
           
            
              let event = _events.find(event => event.calendarSlotId === queries.booking)

        
            

              if(event){

                let venue = event?.platformEventSlot?.venue
                let eventAttendees = event?.platformEventSlot?.attendees
                let eventPackage = event?.platformEventSlot?.name
                let timeInterval = moment.duration(
                  moment(event?.platformEventSlot.endAt).diff(moment(event?.platformEventSlot.startAt))
                ).asMinutes()

          
                openModal({
                  date,
                  oldDate: {startAt:event?.platformEventSlot?.start, endAt: event?.platformEventSlot?.end},
                  timeInterval,
                  eventsRaw,
                  isMeeting: true,
                  setRefetchCalendar,
                  platformEventMembers,
                  employees,
                  contents,
                  venues,
                  attendees,
                  selectedAttendee:[...eventAttendees.map(attendee => {
                    return {value: attendee?.invitee?.id, label: attendee?.invitee?.id} })],
                  selectedEmployee,
                  selectedContent: [{value: eventPackage, label: eventPackage}],
                  selectedVenue: [{value: venue?.id, label: venue?.name}],
                });

              }
        

          }
          if (!selectedContent.length) return;

          const contentx = contents.find((c) => c.id === selectedContent[0].value);
          if (selectedVenue.length && !contentx) {
            
            const parsedVenue = venues.find((v) => v.id == (selectedVenue as any)[0]?.value);

            const bookingDates = parsedVenue?.bookedSlots?.map((s) => new Date(s.startAt)?.getDate()) ?? [];

            const dx = moment(date).format('YYYY-MM-DD');

            const currentDate = new Date(dx).getDate();
            const seletedDateTotalBookings = bookingDates.filter((b) => b == currentDate);

            let totalSelectedAttendee = [...new Set([...selectedAttendee, ...selectedEmployee])]

            if (
              seletedDateTotalBookings.length >= parsedVenue.maxAttendees ||
              selectedAttendee.length > parsedVenue.maxAttendees ||
              selectedEmployee.length > parsedVenue.maxAttendees ||
              totalSelectedAttendee.length > parsedVenue.maxAttendees
            ) {
              alert(
                `only ${parsedVenue.maxAttendees - seletedDateTotalBookings?.length} slots remaining for date: ${dx}`
              );
              return;
            }
          }
   
          if (content?.isVenueChecked) {
            const v = JSON.parse(content.selectedVenue);
            const cv = venues.find((vx) => vx.id == v.value);
            const bookingDates = cv?.bookedSlots?.map((s) => new Date(s.startAt)?.getDate()) ?? [];
            const d = moment(date).format('YYYY-MM-DD');
            const currentDate = new Date(d).getDate();
            const seletedDateTotalBookings = bookingDates.filter((b) => b == currentDate);

            const timeSlot = `${moment(date).format('HH:mm')} - ${moment(date).add(30, 'minutes').format('HH:mm')}`;
            const timeToken = timeSlot.split(' - ');

            const startAtValue = moment(`${d} ${timeToken[0]}`, 'YYYY-MM-DD HH:mm');
            const endAtValue = moment(`${d} ${timeToken[1]}`, 'YYYY-MM-DD HH:mm');

            const mainEventStartTime =  moment(startTime, 'YYYY-MM-DD HH:mm')
            const mainEventEndTime = moment(endTime, 'YYYY-MM-DD HH:mm')


            if (
                startAtValue.isBefore(mainEventStartTime) ||
                endAtValue.isAfter(mainEventEndTime)
            ) {
              alert(
                `Slot not available. Booking available on between ${new Date(startTime).toLocaleDateString()} ${new Date(
                  startTime
                ).toLocaleTimeString()} to ${new Date(endTime).toLocaleDateString()} ${new Date(
                  endTime
                ).toLocaleTimeString()}`
              );
              return; 
            } 

            let totalSelectedAttendee = [...new Set([...selectedAttendee, ...selectedEmployee])]

            if (
              seletedDateTotalBookings.length >= v.max ||
              selectedAttendee.length > v.max ||
              selectedEmployee.length > v.max ||
              totalSelectedAttendee.length > v.max
            ) {
              alert(`only ${v.max - seletedDateTotalBookings?.length} slots remaining for date: ${d}`);
              return;
            }
           

            if (content?.startDate && content?.endDate && content?.isConstraintAvailable) {

              const contentStart = moment(new Date(content.startDate), 'YYYY-MM-DD HH:mm');
              const contentStartToday = moment(new Date(startAtValue.toDate()), 'YYYY-MM-DD HH:mm')

                .startOf('day')
                .add(moment.duration(moment(content.startDate).format('HH:mm')));
              const contentEnd = moment(new Date(startAtValue.toDate()))
                .startOf('day')
                .add(moment.duration(moment(content.endDate).format('HH:mm')));
              const day = moment(startAtValue).format('dddd').toLowerCase();

              if (
                !(
                  moment(startAtValue.format('YYYY-MM-DD HH:mm')) >= contentStart &&
                  startAtValue >= contentStartToday &&
                  endAtValue <= contentEnd &&
                  content.pricingMaster?.availability_weeks?.includes(day)
                )
              ) {
                alert(
                  `Slot not available. Booking available on ${
                    content.pricingMaster?.availability_weeks
                  } between ${new Date(content.startDate).toLocaleDateString()} ${new Date(
                    content.startDate
                  ).toLocaleTimeString()} to ${new Date(content.endDate).toLocaleDateString()} ${new Date(
                    content.endDate
                  ).toLocaleTimeString()}`
                );

              } else {
                
                openModal({
                  date,
                  eventsRaw,
                  isMeeting: true,
                  setRefetchCalendar,
                  platformEventMembers,
                  employees,
                  contents,
                  venues,
                  attendees,
                  selectedAttendee,
                  selectedEmployee,
                  selectedContent,
                  selectedVenue,
                });
              }
            } else {
              openModal({
                date,
                eventsRaw,
                isMeeting: true,
                setRefetchCalendar,
                platformEventMembers,
                attendees,
                employees,
                contents,
                venues,
                selectedEmployee,
                selectedContent,
                selectedVenue,
              });
            }
          } else {
            openModal({
              date,
              eventsRaw,
              isMeeting: true,
              setRefetchCalendar,
              platformEventMembers,
              employees,
              attendees,
              contents,
              venues,
              selectedAttendee,
              selectedEmployee,
              selectedContent,
              selectedVenue,
              isAttendee: true,
            });
          }
        }}
        onEventClick={(value: any) => {
          const { event, event: { extendedProps } } = value;
          //get all invitation for a calendar slot booking with calendarSlotId
          const allAttendees: any = Object.values(eventsRaw).flat().filter((event: any)=> {
            if(event?.calendarSlotId){
              return event?.calendarSlotId === extendedProps.calendarSlotId
            }
            return false
            
          })
          
          const clickContent = contents.find((c) => c.id === extendedProps?.eventId);
           

          if (extendedProps.type === 'calendar_invitation') return;
          if (extendedProps.type === 'event_slot') {
            
            openModal({
              isView: true,
              date: event.start,
              isMeeting: true,
              extendedProps,
              allAttendees,
              attendees,
              platformEventMembers,
              selectedContent: extendedProps?.content,
              employees,
              selectedVenue,
              selectedAttendee: selectedAttendee[0],
              attendeeAvatar: employees?.find((e) => e.id == selectedAttendee[0]?.value)?.avatar,
            });
          } else {
            openModal({
              isView: true,
              platformEventMembers,
              allAttendees,
              attendees,
              date: event.start,
              selectedContent: extendedProps?.content,
              id: value.event.extendedProps.eventId,
              isMeeting: false,
              extendedProps,
            });
          }
        }}
      /> )
      }  */}
    </Container>
  );
};

const mapStateToProps = function (state: AppState) {
  return {
    ui: state.ui,
    user: state.user,
  };
};

const mapDispatchToProps = function (dispatch: Dispatch) {
  return bindActionCreators(
    {
      showModal,
      setCurrentPage,
      setIsEditPage,
    },
    dispatch
  );
};

export default compose(withApollo, connect(mapStateToProps, mapDispatchToProps))(Calendar);
