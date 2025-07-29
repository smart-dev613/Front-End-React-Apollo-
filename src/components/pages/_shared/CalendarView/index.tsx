import React from 'react';

/** Hooks */
import { useRef, useState, useEffect } from 'react';

/** Component */
import FullCalendar from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from "@fullcalendar/interaction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';

/** Utils */
import moment from 'moment';

/** Styles */
import './CalendarView.css'

const CalendarView = (props: any) => {
  const calendarRef = useRef<FullCalendar>(null);
  const [title, setTitle] = useState('');
  const [highlights, setHighlights] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth
    || document.documentElement.clientWidth
    || document.body.clientWidth);
  const { events, onDateClick, onEventClick, user } = props;


  const getCalendarAPI = () => {
    return calendarRef && calendarRef.current?.getApi();
  };

  const goToDate = (date: any): void => {
    const calendarAPI = getCalendarAPI();
    if (calendarAPI) {
      calendarAPI.gotoDate(date);
    }
  }

  const prevDay = (): void => {
    const calendarAPI = getCalendarAPI();
    if (calendarAPI) {
      const currentDate = moment(calendarAPI.getDate());
      const prevDate = currentDate.clone().subtract(1, 'days');
      goToDate(prevDate.format('YYYY-MM-DD'));
      const currWidth = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth
      setTitle(prevDate.format(currWidth < 700 ? 'D MMMM YYYY' : 'MMMM YYYY'));
    }
  }

  const nextDay = (): void => {
    const calendarAPI = getCalendarAPI();
    if (calendarAPI) {
      const currentDate = moment(calendarAPI.getDate());
      const nextDate = currentDate.clone().add(1, 'days');
      goToDate(nextDate.format('YYYY-MM-DD'));
      const currWidth = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth
      setTitle(nextDate.format(currWidth < 700 ? 'D MMMM YYYY' : 'MMMM YYYY'));
    }
  }

  const prevWeek = (): void => {
    const calendarAPI = getCalendarAPI();
    if (calendarAPI) {
      const currentDate = moment(calendarAPI.getDate());
      const prevDate = currentDate.clone().subtract(1, 'weeks').startOf('week');
      goToDate(prevDate.format('YYYY-MM-DD'));
      const currWidth = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth
      setTitle(prevDate.format(currWidth < 700 ? 'D MMMM YYYY' : 'MMMM YYYY'));
    }
  }

  const nextWeek = (): void => {
    const calendarAPI = getCalendarAPI();
    if (calendarAPI) {
      const currentDate = moment(calendarAPI.getDate());
      const nextDate = currentDate.clone().add(1, 'weeks').startOf('week');
      goToDate(nextDate.format('YYYY-MM-DD'));
      const currWidth = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth
      setTitle(nextDate.format(currWidth < 700 ? 'D MMMM YYYY' : 'MMMM YYYY'));
    }
  }

  const prevMonth = (): void => {
    const calendarAPI = getCalendarAPI();
    if (calendarAPI) {
      const currentDate = moment(calendarAPI.getDate());
      const prevDate = currentDate.clone().subtract(1, 'months').startOf('month');
      goToDate(prevDate.format('YYYY-MM-DD'));
      const currWidth = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth
      setTitle(prevDate.format(currWidth < 700 ? 'D MMMM YYYY' : 'MMMM YYYY'));
    }
  }

  const nextMonth = (): void => {
    const calendarAPI = getCalendarAPI();
    if (calendarAPI) {
      const currentDate = moment(calendarAPI.getDate());
      const nextDate = currentDate.clone().add(1, 'months').startOf('month');
      goToDate(nextDate.format('YYYY-MM-DD'));
      const currWidth = window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth
      setTitle(nextDate.format(currWidth < 700 ? 'D MMMM YYYY' : 'MMMM YYYY'));
    }
  }

  const handleDateClick = (data: any): void => {
    console.log(data);
    setHighlights(generatehighlightEvents(data, new Date(), 4));
    onDateClick && onDateClick(data);

  }

  const handleEventClick = (data: any): void => {
    onEventClick && onEventClick(data)
  }

  const handleSlotMouseEnter = (data: any) : void => {
    const calenderApi = getCalendarAPI()
    console.log("calender api", calenderApi)
  }

  const handleSlotMouseLeave = () => {
    console.log("unhovered selectable slot")
  }

  const generatehighlightEvents = (
    weekday: number,
    startDate: Date,
    weeks: number
  ): any[] => {
    const highlights: any[] = [];
    const date = new Date(startDate);

    const offset = (weekday - date.getDay() + 7) % 7;
    date.setDate(date.getDate() + offset);

    Array.from({length:weeks}).forEach((_, i) => {
      const highlightDate = new Date(date);
      highlightDate.setDate(date.getDate() + i * 7);
      highlights.push({
        start: highlightDate.toISOString().split('T')[0],
        display: 'background',
        backgroundColor: "#ffdd54f"
      })
    })
    return highlights;
  }

  useEffect(() => {
    const changeView = () => {
      const calendarAPI = getCalendarAPI();
      if (calendarAPI) {
        let width = window.innerWidth
          || document.documentElement.clientWidth
          || document.body.clientWidth
        if (width < 700) {
          calendarAPI.changeView('timeGridDay')
        } else {
          calendarAPI.changeView('timeGridWeek')
        }
        setWindowWidth(width)
      }
    }
    window.addEventListener('resize', changeView)
    return () => {
      window.removeEventListener('resize', changeView)
    }
  }, [calendarRef])

  return (
    <>
      <div className="custom-title">
        <div>
          <span onClick={prevMonth} style={{ padding:' 0.4em 0.8em' }}>
            <FontAwesomeIcon icon={faAngleDoubleLeft} />
          </span>
          {
            windowWidth < 700 ? (
              <span onClick={prevDay} style={{ padding:' 0.4em 0.8em' }}>
                <FontAwesomeIcon icon="chevron-left" />
              </span>
            ) : (
              <span onClick={prevWeek} style={{ padding:' 0.4em 0.8em' }}>
                <FontAwesomeIcon icon="chevron-left" />
              </span>
            )
          }
        </div>
        <span>{title}</span>
        <div>
          {
            windowWidth < 700 ? (
              <span onClick={nextDay} style={{ padding:' 0.4em 0.8em' }}>
                <FontAwesomeIcon icon="chevron-right" />
              </span>
            ) : (
              <span onClick={nextWeek} style={{ padding:' 0.4em 0.8em' }}>
                <FontAwesomeIcon icon="chevron-right" />
              </span>
            )
          }
          <span onClick={nextMonth} style={{ padding:' 0.4em 0.8em' }}>
            <FontAwesomeIcon icon={faAngleDoubleRight} />
          </span>
        </div>
      </div>
      <FullCalendar
        ref={calendarRef}
        plugins={[ timeGridPlugin, interactionPlugin ]}
        initialView={windowWidth < 700 ? 'timeGridDay' : "timeGridWeek"}
        allDaySlot={false}
        headerToolbar={false}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        selectable={true}
        eventMouseEnter={handleSlotMouseEnter}
        eventMouseLeave={handleSlotMouseLeave} 
        // slotLabelInterval={{
        //   years: 0,
        //   months: 0,
        //   days: 0,
        //   milliseconds: 1800000,
        // }}
        slotLabelFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }}
        dayHeaderContent={({ text }): string =>{
          return text.split('/')[0];
        }}
        titleFormat={(value): string => {
          const { start, end } = value;
          return `${start.day} - ${end ? end.day : ''}`;
        }}
        locale={'en-gb'}
        datesSet={(value: any) => {
          const { start } = value;
          const currentDate = moment(start);
          const currWidth = window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth
          setTitle(currentDate.format(currWidth < 700 ? 'D MMMM YYYY' : 'MMMM YYYY'));
        }}
        events={[...events, ...highlights]}
        eventBackgroundColor="#c3c0c0"
        eventBorderColor="#c3c0c0"
        eventTextColor="#000000"
        eventContent={({ event }: any) => {
          return (
            <div style={{whiteSpace: 'nowrap', overflow: 'hidden'}}>
              {event.extendedProps.type === 'event_cart' ? (
                <b>{`${event.title}${
                  event.extendedProps.invitationStatus === 'AWAITING' ? ' (Pending)' : ''
                }`}</b>
              ) : (
                <b>
                  {event.title}{' '}
                  {event.extendedProps.invitationStatus === 'AWAITING' ? 'Pending' :  ''}
                  {event.extendedProps.type === 'calendar_invitation' ? '(MSL)' : ''}
                </b>
              )}

            </div>
          );
        }}

        slotEventOverlap={false}
        selectOverlap={false}
      />
    </>
  )
}


export default CalendarView;
