import React from 'react'
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import moment, { Moment } from 'moment'

interface TimeFormat {
  day: string;
  date: string;
}

interface TimeSlotData {
  slot: {},
  dayItem: TimeFormat,
  slotText: string | void,
  startDate: any,
  endDate: any,
  individualCalendarStartAt: string,
  individualCalendarEndAt: string,
  individualCalendarName: string,
}

interface mobileCurrentDate {
  mobileCurrentDate: TimeFormat
}

type Props = TimeSlotData & mobileCurrentDate

const TimeSlot = (props: Props) => {
  let dateString = props.dayItem.date;
  let dateParts = dateString.split("/");
  let dateObject = new Date(+dateParts[2], +dateParts[1] - 1, +dateParts[0]);
  let today = new Date(dateObject);
  let eventStart = new Date(props.startDate);
  let eventEnd = new Date(props.endDate);

  // console.log('today', today)
  // console.log('event start', eventStart)
  // console.log('event end', eventEnd)

  // console.log("Data Item",props)
  // console.log(eventStart)
  // console.log(eventEnd)
  return (<div className={`timeslot-main ${(moment(props.dayItem.date, 'DD/MM/YYYY').isBetween(moment(props.startDate, 'DD/MM/YYYY'), moment(props.endDate, 'DD/MM/YYYY')) ? '' : 'disabled-day')}`}>
   <span className='text-center'>
   {(props.slotText!='- -' && props.slotText)?'X':''}
   </span>
    <span className='timeslot-data'>
      
      {/* {props.slotText?props.slotText:(moment(props.dayItem.date, 'DD/MM/YYYY').isBetween(moment(props.startDate, 'DD/MM/YYYY'), moment(props.endDate, 'DD/MM/YYYY')) ? props.dayItem.date : 'Unavailable')} */}
      {props.mobileCurrentDate.date ? props.mobileCurrentDate.date : (moment(props.dayItem.date.replace(/\//g, '-'), 'DD/MM/YYYY').isBetween(moment(props.startDate, 'DD/MM/YYYY'), moment(props.endDate, 'DD/MM/YYYY')) ? <p className='transparent-style'>Available</p> : 'Unavailable')}
    </span>
    {/* <span className='timeslot-img'>
      <img></img>
    </span> */}

    <span className='timeslot-data-dk'>
      {(today > eventStart && today < eventEnd ? <p className='transparent-style'>{props.individualCalendarName}</p> : 'Unavailable')}
      {/* {moment(props.dayItem.date, 'DD/MM/YYYY').format('DD/MM/YYYY')} */}
    </span>

  </div>)
}

export default TimeSlot