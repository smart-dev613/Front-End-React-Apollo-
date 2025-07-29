import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Dropdown from '../../components/Form/Dropdown'

interface DayData {
  day: string,
  date: string
}

interface BookingProps {
  clicked: string
  selectedDay: DayData
  confirm: () => void
  cancel: () => void
  dropdownClass: string
  showStatus: boolean
  callbackFunction: (arg0: string) => void
  modalShow: boolean
}

const Rooms: any = {'one':'Room 1', 'two':'Room 2', 'three':'Meeting Room', 'ext':'External'}

const BookingModal = (props: BookingProps) => (
  (props.modalShow)?(
    <div className='booking-modal'>
      <span className='booking-content'><label>{props.selectedDay.day} {props.selectedDay.date} ({props.clicked})</label></span>
      {/* <span className='booking-content'>Status: <span className='availability-status'>Available</span></span> */}
      <Dropdown dataArray={Rooms} dataType='Select Room' width='15' callbackFunctions={props.callbackFunction} />
      {props.showStatus && <span><input className='external-space' type='text' placeholder='Enter Location' /></span> }
      <span className='booking-content'><strong>Send a meeting request</strong></span>
      <span className='booking-content-icons'>
        <span className='booking-icons'><button className='icon-button' onClick={props.confirm}><FontAwesomeIcon icon='check-circle' /></button></span>
        <span className='booking-icons'><button className='icon-button cancel-button' onClick={props.cancel}><FontAwesomeIcon icon='times-circle' /></button></span>
      </span>
    </div>)
    :
    (<div className='booking-modal'>
      <p className='meeting-headline mb-0 ml-2'>Meeting Summary</p>
      <span className='booking-content'><label>{props.selectedDay.day} {props.selectedDay.date} ({props.clicked})</label></span>
      <p className='mb-0 ml-2'>From:</p>
      <p className='mb-0 ml-2'>Event:</p>
      {/* <span className='booking-content'>Status: <span className='availability-status'>Available</span></span> */}
      <span className='booking-content'><strong>Accept meeting request</strong></span>
      <span className='booking-content-icons'>
        <span className='booking-icons'><button className='icon-button' onClick={props.confirm}><FontAwesomeIcon icon='check-circle' /></button></span>
        <span className='booking-icons'><button className='icon-button cancel-button' onClick={props.cancel}><FontAwesomeIcon icon='times-circle' /></button></span>
      </span>
    </div>)

)

export default BookingModal
