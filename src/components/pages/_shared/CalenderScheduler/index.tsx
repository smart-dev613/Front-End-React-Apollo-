import React, { useState, useContext, useRef, useEffect } from 'react';

import { bindActionCreators, Dispatch, compose } from 'redux';
import { withApollo } from 'react-apollo';
import { connect } from 'react-redux';

import './CalendarScheduler.css';
import Moment from 'react-moment';
import Avatar from 'react-avatar';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import moment from 'moment';

import { showModal } from '../../../../store/modal/action';
import { AppState } from '../../../../store/root';
import { UIState } from '../../../../store/ui/types';
import { UserState } from '../../../../store/user/types';
import { ShowModal } from '../../../../store/modal/types';
import { borderColor, borderStyle, borderWidth } from 'polished';

interface DispatchProps {
  ui: UIState;
  user: UserState;
  userData: UserState['userData'];
  setCurrentPage: any;
  showModal: ShowModal;
}

function TimeBar({ time }) {
  return (
    <div className="main-div-timebar">
      {/* <h4 id="h4-date" name="user">{userName}</h4> */}
      <h2 id="h2-date">{time} Minute Meeting</h2>
      <h4 id="h4-date">🕒 {time} min</h4>
    </div>
  );
}
const eventDuration = (startTime, endTime) => {
  const start = moment(startTime);
  const end = moment(endTime);
  const duration = moment.duration(end.diff(start));

  const hours = duration.hours();
  const minutes = duration.minutes();

  let formattedDuration = '';
  if (hours > 0) {
    formattedDuration += `${hours}hr`;
    if (minutes > 0) {
      formattedDuration += `:${minutes.toString().padStart(2, '0')}min`;
    }
  } else {
    formattedDuration = `${minutes}min`;
  }

  return formattedDuration;
};

const BookedListItem = (Props) => {
  const { event: booking, platformEvent, onEventClick } = Props;

  const { theme } = platformEvent;

  const { start, end, calendarSlotId } = booking;

  const startTime = moment(start).format('h:mm A');
  const color = booking?.platformEvent?.id !== platformEvent?.eventId ? 'green' : theme?.calendarSecondaryColour;

  return (
    <div
      className="setTime"
      onClick={() => onEventClick(booking)}
      style={{
        borderColor: color,
        color: color,
      }}
      key={calendarSlotId}
    >
      {startTime}
    </div>
  );
};

let eventGuid = 0;
let todayStr = new Date().toISOString().replace(/T.*$/, ''); // YYYY-MM-DD of today

function createEventId() {
  return String(eventGuid++);
}

type StateProps = {
  content: any;
  onClickTime: (date: string) => void;
  events: any;
  platformEvent: any;
  onEventClick: (e: any) => void;
};

type Event = {
  start: string,
  end: string,
  availableHours: [string],
  availableDays: [string]
}

type Props = DispatchProps & StateProps;

const CalenderSchedulerView: React.FC<Props> = (props: Props) => {
  const { content, onClickTime, platformEvent, events, user } = props;
  const { theme } = platformEvent;

  const [selectedDate, setSelectedDate] = useState(null);
  const [weekdayHighlights, setWeekdayHighlights] = useState<any[]>([]);
  const [event, setEvent] = useState<Event>({
    start: '',
    end: '',
    availableHours: [''],
    availableDays: ['']
  });
  console.log("events", events);
  const calendarRef = useRef(null);
  const sessionLength = content?.pricingMaster?.duration;
  const availableHrs = content?.pricingMaster?.availability_hours ?? ['08:00 am', '17:00 pm'];
  const venue = content?.selectedVenue ? JSON.parse(content?.selectedVenue) : '';

  const heroStyle = {
    backgroundImage: `url(${content?.images[0]})`,
    backgroundColor: `${theme?.calendarSecondaryColour}`,
  };

  const highlightAllWeekdays = (weekdayIndex: number) => {
    const calendarApi = calendarRef.current?.getApi();
    if (!calendarApi) return;

    const currentStart = calendarApi.view.currentStart;
    const currentEnd = calendarApi.view.currentEnd;

    const highlights: any[] = [];
    const date = new Date(currentStart);

    while (date <= currentEnd) {
      if (date.getDay() === weekdayIndex) {
        highlights.push({
          start: new Date(date).toISOString().split('T')[0],
          display: 'background',
          backgroundColor: '#b3d4fc',
          className: 'weekday-highlight',
        });
      }
      date.setDate(date.getDate() + 1);
    }

    setWeekdayHighlights(highlights);
  };

  function convertDaysToNumbers(daysArray) {
    const dayMap = {
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
      sunday: 7,
    };

    return daysArray.map((day) => {
      const lowercaseDay = day.toLowerCase();
      return dayMap[lowercaseDay] || null;
    });
  }

  const availability_weeks = content?.pricingMaster?.availability_weeks;

  //Roman

  const dayNumbers = convertDaysToNumbers(content?.pricingMaster?.availability_days || []);

  
  useEffect(() => {
    const item = {
      start: content?.startDate,
      end: content?.endDate,
      availableHours: content?.pricingMaster?.availability_hours,
      availableDays:
        availability_weeks > 0 ? availability_weeks : ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    };

    setEvent(item);
  }, [content]);

  const dayWeek = event?.availableDays ? convertDaysToNumbers(event.availableDays) : [];
  let highlightEvents: any[] = [];

  if (dayNumbers.length && content?.startDate && availability_weeks > 0) {
    highlightEvents = dayNumbers.flatMap((day) =>
      highlightSelectedWeekday(day, new Date(content.startDate), availability_weeks)
    );
  }

  const businessHours = {
    daysOfWeek: dayWeek,
    startTime: event?.start,
    endTime: event?.end,
  };

  const renderEventContent = (eventInfo) => {
    const startDate = new Date(eventInfo.event.start);
    const endDate = new Date(eventInfo.event.end);
    const currentDate = new Date(eventInfo.event.start);

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      const isAvailableDay = event.availableDays?.includes(
        ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][dayOfWeek]
      );

      // if (!isAvailableDay) {
      //   return <div className="unavailable-slot">Unavailable</div>;
      // }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return <div>{eventInfo.event.title}</div>;
  };

  const dayCellClassNames = (arg) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);

    const classes = [];

    if (arg.date < today || arg.date < eventStart || arg.date > eventEnd) {
      classes.push('unavailable-day');
    }

    if (selectedDate && arg.date.toDateString() === selectedDate.toDateString()) {
      classes.push('selected-day');
    }

    return classes;
  };

  const handleDateSelect = (arg) => {
    if (!content) {
      const currentSelectedDate = new Date(arg.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dayOfWeek = currentSelectedDate.getDay();
      const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][
        dayOfWeek
      ].toLowerCase();

      // if (!event.availableDays.includes(dayName)) return;

      const item = events.map((val : any) => {
        if (
          new Date(currentSelectedDate).toISOString().split('T')[0] == new Date(val.start).toISOString().split('T')[0]
        ) {
          return {
            start: val?.start,
            end: val?.end,
            // availableHours: ((event?.end.getTime() - event?.start.getTime()) / 1000) * 60,
            availableHours: [],
            availableDays: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
          };
        }
      });
      setEvent(item);
      setSelectedDate(currentSelectedDate);
      if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();
        calendarApi.unselect(); // Clear the selection
      }
    } else{
      const currentSelectedDate = new Date(arg.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const dayOfWeek = currentSelectedDate.getDay();
      const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][
        dayOfWeek
      ].toLowerCase();

      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);

      if (!event.availableDays.includes(dayName)) return;

      if (currentSelectedDate >= today && currentSelectedDate >= eventStart && currentSelectedDate <= eventEnd) {
        setSelectedDate(currentSelectedDate);
        if (calendarRef.current) {
          const calendarApi = calendarRef.current.getApi();
          calendarApi.unselect(); // Clear the selection
        }
      }
    }
    
  };

  function generateTimeSlots() {
    const now = moment();
    const startTime = moment(selectedDate).set({
      hour: moment(availableHrs[0], 'hh:mm a').get('hour'),
      minute: moment(availableHrs[0], 'hh:mm a').get('minute'),
    });

    const endTime = moment(selectedDate).set({
      hour: moment(availableHrs[1], 'hh:mm a').get('hour'),
      minute: moment(availableHrs[1], 'hh:mm a').get('minute'),
    });
    const slots = [];

    while (startTime.isBefore(endTime)) {
      if (startTime.isAfter(now) || !moment(selectedDate).isSame(now, 'day')) {
        const slotStart = startTime.format('h:mm A');
        const slotEnd = startTime.clone().add(sessionLength, 'minutes').format('h:mm A');

        slots.push({
          label: slotStart,
          value: [slotStart, slotEnd],
        });
      }

      startTime.add(sessionLength, 'minutes');
    }

    return slots;
  }

  function removeBookedSlots(availableSlots, bookedEvents) {
    const bookedDateTimes = new Set(
      bookedEvents.map((event) => {
        return moment(event.start).format('YYYY-MM-DD HH:mm');
      })
    );

    return availableSlots.filter((slot) => {
      const parsedDate = moment(selectedDate);

      // Set the time
      parsedDate.set({
        hour: moment(slot.label, 'h:mm A').get('hour'),
        minute: moment(slot.label, 'h:mm A').get('minute'),
        second: 0,
        millisecond: 0,
      });

      const formattedDateTime = parsedDate.format('YYYY-MM-DD HH:mm');

      return !bookedDateTimes.has(formattedDateTime);
    });
  }

  // const transformEvents = (eventsData) => {
  //   return eventsData.map((event) => ({
  //     key: event.id,
  //     id: event.id,
  //     title: event.title,
  //     start: event.start,
  //     end: event.end,
  //     extendedProps: {
  //       status: event.platformEventPricingSlot.status,
  //       contentName: event.content.name,
  //       invitationStatus: event.invitationStatus,
  //     },
  //   }));
  // };

  const transformEvents = (eventsData: any[] = []) => {
    if (!Array.isArray(eventsData)) return [];

    return eventsData
      .map((event) => {
        if (!event || !event.start || !event.end) return null;

        return {
          key: event.id,
          id: event.id,
          // title: event.title || '',
          start: event.start,
          end: event.end,
          extendedProps: {
            status: event?.platformEventPricingSlot?.status ?? '',
            contentName: event?.content?.name ?? '',
            invitationStatus: event?.invitationStatus ?? '',
          },
        };
      })
      .filter(Boolean); // remove any nulls
  };


  const allSlots = content ? generateTimeSlots(): [];
  const availableSlots = content ? removeBookedSlots(allSlots, events) : [];

  const setTimeSlot = (time) => {
    const parsedDate = moment(selectedDate);

    // Set the time
    parsedDate.set({
      hour: moment(time, 'h:mm A').get('hour'),
      minute: moment(time, 'h:mm A').get('minute'),
      second: 0,
      millisecond: 0,
    });

    // Format the result
    const formattedDateTime = parsedDate.format('YYYY-MM-DD HH:mm:ss');
    onClickTime(formattedDateTime);
  };

  const highlightSelectedWeekday = (weekday: number, startDate: Date, weeks: number): any[] => {
    const highlights: any[] = [];
    const current = new Date(startDate);
    const offset = (weekday - current.getDay() + 7) % 7;
    current.setDate(current.getDate() + offset);

    for (let i = 0; i < weeks; i++) {
      const d = new Date(current);
      d.setDate(current.getDate() + i * 7);
      highlights.push({
        start: d.toISOString().split('T')[0],
        display: 'background',
        backgroundColor: '#ffd54f',
      });
    }

    return highlights;
  };

  // let highlightEvents: any[] = [];

  // try {
  //   const safeStartDate = content?.startDate ? new Date(content.startDate) : null;

  //   if (
  //     Array.isArray(dayNumbers) &&
  //     dayNumbers.length > 0 &&
  //     safeStartDate instanceof Date &&
  //     !isNaN(safeStartDate.getTime()) &&
  //     typeof availability_weeks === 'number' &&
  //     availability_weeks > 0
  //   ) {
  //     highlightEvents = dayNumbers.flatMap((day) => highlightSelectedWeekday(day, safeStartDate, availability_weeks));
  //   }
  // } catch (error) {
  //   console.error('Error generating highlight events:', error);
  // }

  return (
    <div>
      <div className="hero-background" style={heroStyle}>
        {content ? (
          <>
            {/* <Avatar
            name={content?.name}
            src={content?.imageURL}
            size="50"
            className="content-avatar"
          /> */}
            <p className="content-title">{content?.name}</p>
            <p className="select-header">Select a date and time</p>
          </>
        ) : (
          <p className="select-header">Select a Venue, Product or Service</p>
        )}
      </div>

      <div className="outerdiv-selectedDate">
        {content && (
          <div className="description-info">
            <h4 className="text-lg">{content?.name}</h4>
            <div className="flex-gap">
              <p id="text-base"> 🕒 {content?.pricingMaster?.duration} min</p>
              {content?.pricingMaster?.price > 0 && (
                <p id="text-base">
                  🏷️ {content?.pricingMaster?.currency} {content?.pricingMaster?.price}{' '}
                </p>
              )}
              <p id="text-base"> 📍 {venue?.label}</p>
            </div>
            <p className="text-base">{content?.body}</p>
          </div>
        )}

        <div className="bottom-calender-booking">
          <div className="calender-container">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              editable={true}
              selectable={true}
              timeZone="UTC"
              eventContent={renderEventContent}
              slotMinTime="00:00:00"
              slotMaxTime="24:00:00"
              allDaySlot={false}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={true}
              showNonCurrentDates={false}
              businessHours={businessHours}
              events={[
                ...transformEvents(events || []),
                ...(Array.isArray(weekdayHighlights) ? weekdayHighlights : []),
              ]}
              dayCellClassNames={dayCellClassNames}
              dateClick={handleDateSelect}
              // datesSet={() => {
              //   setTimeout(() => {
              //     const headerCells = document.querySelectorAll('.fc-col-header-cell');
              //     headerCells.forEach((cell, index) => {
              //       const htmlCell = cell as HTMLElement;
              //       htmlCell.style.cursor = 'pointer';
              //       htmlCell.onclick = () => highlightAllWeekdays(index);
              //     });
              //   }, 0);
              // }}
            />
          </div>
          {/* {content && selectedDate && ( */}
          { selectedDate && (
            <div className="book-info" style={{ padding: '0.5rem 1rem', marginBottom: '1rem' }}>
              <p>
                {' '}
                <Moment format="dddd, MMMM D YYYY" date={selectedDate} />
              </p>
              <div className="availability-container">
                {availableSlots?.map((slot) => (
                  <div
                    className="setTime"
                    style={{
                      borderColor: theme?.calendarSecondaryColour,
                      color: theme?.calendarSecondaryColour,
                    }}
                    onClick={() => setTimeSlot(slot.label)}
                    key={slot.label}
                  >
                    {slot?.label}
                  </div>
                ))}
              </div>

              <div className="booked-container">
                <p>My Bookings</p>
                <div className="availability-container">
                  { events
                    .filter(
                      (booking) =>
                        booking?.platformEvent?.id === platformEvent?.eventId &&
                        booking?.platformEvent.id &&
                        moment(booking.start).startOf('day').isSame(moment(selectedDate).startOf('day'))
                    )
                    .map((event) => {
                      console.log('events', event);

                      event.length === 0 ? <p> "No Bookings"</p>  : 
                      <BookedListItem key={event.id} event={event} {...props} />;
                    })}

                    { events
                    .filter(
                      (booking) =>
                        booking?.platformEvent?.id !== platformEvent?.eventId &&
                        booking?.invitee?.user?.id === user?.userData?.id &&
                        moment(booking.start).startOf('day').isSame(moment(selectedDate).startOf('day'))
                    )
                    .map((event) => {
                      return event.length === 0 ? <p> "No Bookings"</p>  : 
                      <BookedListItem key={event.id} event={event} {...props} />;
                    })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

//export default CalenderSchedulerView;

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
    },
    dispatch
  );
};

// Create the connected component with proper typing
const ConnectedCalendarScheduler = compose(
  withApollo,
  connect(mapStateToProps, mapDispatchToProps)
)(CalenderSchedulerView);

// Create a wrapper component to handle prop types correctly
const CalendarSchedulerWrapper: React.FC<StateProps> = (props) => {
  return <ConnectedCalendarScheduler {...props} />;
};

export default CalendarSchedulerWrapper;
