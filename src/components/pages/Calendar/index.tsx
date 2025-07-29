import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch, compose } from 'redux';

import { AppState } from '../../../store/root';
import { UIState } from '../../../store/ui/types';
import { UserState, UserData, Executives } from '../../../store/user/types';
import { setCurrentPage } from '../../../store/ui/action';
import { showModal } from '../../../store/modal/action';
import { ShowModal } from '../../../store/modal/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CalendarViewComponent from '../CalendarViewComponent';
import BookingModal from '../BookingModal';
import TimeSlot from '../TimeSlotData';
import moment, { Moment } from 'moment';
import ApolloClient from 'apollo-client';
import { GET_EVENT_INFO } from '../../../gql/queries';
import { withApollo } from 'react-apollo';
import { getEventAttendees, getEmployeeCalendar, getEventCompanies, getEventVenues } from '../../../providers/events';
import CalendarView from './CalendarView';
import { CombSpinner } from 'react-spinners-kit';

interface MyItem {
  day: string;
  date: string;
}

interface AttendeesList {
  eventType: string;
  id: string;
  invitationStatus: string;
  invitee: InviteeDetails;
}

interface InviteeDetails {
  company: CompanyObject;
  email: string;
  id: string;
  role: string;
  user: UserData;
}

interface CompanyObject {
  id: string;
  info: string;
  logoUrl: string;
  name: string;
  profileEn: object;
  profileCn: object;
}

interface DayConfiguration {
  day: string;
  date: string;
}

export interface InvitationResponse {
  data: {
    getEmployeeCalendar: Invitation[];
  };
}

export interface Invitation {
  eventInvitations: EventInvitations[];
}

export interface EventInvitations {
  calendarEvent: null | EventTypeDetails;
  createdAt: string;
  eventType: string;
  id: string;
  invitee: InviteeDetails;
  platformEvent: null | EventTypeDetails;
  platformEventSlot: null | EventTypeDetails;
  invitationStatus: string;
}

interface EventTypeDetails {
  id: string;
  endAt: string;
  startAt: string;
  name: string;
}

interface CalendarState {
  days: MyItem[];
  timeSlots: string[];
  slotDuration: number;
  startTime: {};
  endTime: {};
  sliderValue: number;
  availability: string;
  bookStatus: boolean;
  clickedTimeSlot: string;
  selectedDay: {
    day: string;
    date: string;
  };
  pointX: number;
  pointY: number;
  height: number;
  width: number;
  activeDateIndx: number;
  isOpen: boolean;
  allocatedSpace: number;
  showStatus: boolean;
  venueList: any[];
  venueSelected: any[];
  screenType: string;
  cellCount: number;
  months: Moment;
  referenceDay: Moment;
  currentDayDate: Moment;
  startDate: Moment;
  endDate: Moment;
  isBooking: boolean;
  isCurrentDay: boolean;
  companyName: string;
  companyLogo: string;
  companyMembershipID: string;
  personName: string;
  personID: string;
  eventID: string;
  organiser: {
    id: string;
    __typename: string;
  };
  attendees: AttendeesList[];
  individualCalendarStartAt: string;
  individualCalendarEndAt: string;
  individualCalendarName: string;
  IndividualCalendarList: any[];
  representatives: Executives[];
  showExecutives: boolean;
  bookingSchedule: any[];
  executiveData: Executives;
  timeSlotsInfo: EventInvitations[];
  mobileCurrentDate: DayConfiguration;
  theme: {
    secondaryColour?: string;
    primaryColour?: string;
    logoURL?: string;
  };
  lstTimeslotRef: any;
  selectedOption: any;
  companiesArray: any[];
}

interface CalendarProps {
  ui: UIState;
  user: UserState;
  client: ApolloClient<any>;
}

interface DispatchProps {
  setCurrentPage: any;
  showModal: ShowModal;
}

type Props = CalendarProps & DispatchProps;

class Calendar extends React.Component<Props, CalendarState> {
  public constructor(props: Props) {
    super(props);
    this.state = {
      days: [],
      timeSlots: [
        '09:00 - 09:30',
        '09:30 - 10:00',
        '10:00 - 10:30',
        '10:30 - 11:00',
        '11:00 - 11:30',
        '11:30 - 12:00',
        '12:00 - 12:30',
        '12:30 - 13:00',
        '13:00 - 13:30',
        '13:30 - 14:00',
        '14:00 - 14:30',
        '14:30 - 15:00',
        '15:00 - 15:30',
        '15:30 - 16:00',
        '16:00 - 16:30',
        '16:30 - 17:00',
        '17:00 - 17:30',
        '17:30 - 18:00',
        '18:00 - 18:30',
        '18:30 - 19:00',
        '19:00 - 19:30',
        '19:30 - 20:00',
        '20:00 - 20:30',
        '20:30 - 21:00',
        '21:00 - 21:30',
        '21:30 - 22:00',
        '22:00 - 22:30',
        '22:30 - 23:00',
        '23:00 - 23:30',
        '23:30 - 00:00',
        '00:00 - 00:30',
        '00:30 - 01:00',
        '01:00 - 01:30',
        '01:30 - 02:00',
        '02:00 - 02:30',
        '01:30 - 03:00',
        '03:00 - 03:30',
        '03:30 - 04:00',
        '04:00 - 04:30',
        '04:30 - 05:00',
        '05:00 - 05:30',
        '05:30 - 06:00',
        '06:00 - 06:30',
        '06:30 - 07:00',
        '07:00 - 07:30',
        '07:30 - 08:00',
        '08:00 - 08:30',
        '08:30 - 09:00',
      ],
      selectedOption: null,
      slotDuration: 30,
      startTime: new Date(),
      endTime: new Date(),
      sliderValue: 0,
      availability: 'available',
      bookStatus: false,
      clickedTimeSlot: '',
      selectedDay: { day: '', date: '' },
      pointX: 0,
      pointY: 0,
      height: 0,
      width: 0,
      activeDateIndx: 2,
      isOpen: false,
      allocatedSpace: 0,
      showStatus: false,
      screenType: '',
      cellCount: 8,
      months: moment(),
      referenceDay: moment(),
      currentDayDate: moment(),
      startDate: moment(),
      endDate: moment().add(1, 'month'),
      isBooking: false,
      isCurrentDay: true,
      companyName: '',
      companyLogo: '',
      companyMembershipID: '',
      personName: '',
      personID: '',
      eventID: '',
      organiser: {
        id: '',
        __typename: '',
      },
      attendees: [],
      representatives: [],
      showExecutives: false,
      bookingSchedule: [],
      venueList: [],
      venueSelected: [],
      individualCalendarStartAt: '',
      individualCalendarEndAt: '',
      individualCalendarName: '',
      IndividualCalendarList: [],
      lstTimeslotRef: {},
      executiveData: {
        id: '',
        firstName: '',
        lastName: '',
        companyID: '',
        companyMembershipID: '',
        companyName: '',
        value: '',
        label: '',
      },
      timeSlotsInfo: [],
      mobileCurrentDate: {
        day: '',
        date: '',
      },
      theme: {
        secondaryColour: '',
        primaryColour: '',
        logoURL: '',
      },
      companiesArray: [],
    };
    this.checkMeetingSlot = this.checkMeetingSlot.bind(this);
    this.calculateTimeSlotValues = this.calculateTimeSlotValues.bind(this);
    this.setSlideHandler = this.setSlideHandler.bind(this);
    this.cancelBookingHandler = this.cancelBookingHandler.bind(this);
    this.confirmBookingHandler = this.confirmBookingHandler.bind(this);
    this.getCurrentMousePosition = this.getCurrentMousePosition.bind(this);
    this.selectDay = this.selectDay.bind(this);
    this.closeBookingPopUp = this.closeBookingPopUp.bind(this);
    this.getDropdownOption = this.getDropdownOption.bind(this);
    this.previous = this.previous.bind(this);
    this.next = this.next.bind(this);
    this.getUrl = this.getUrl.bind(this);
    this.checkDate = this.checkDate.bind(this);
    this.getEventAttendees = this.getEventAttendees.bind(this);
    this.getCalendarSchedule = this.getCalendarSchedule.bind(this);
    this.checkSlotStatus = this.checkSlotStatus.bind(this);
    this.getBookingSchedule = this.getBookingSchedule.bind(this);
    this.initialiseUserData = this.initialiseUserData.bind(this);

    for (var i = 0; i < this.state.timeSlots.length; i++) {
      let myRef = React.createRef();
      this.state.lstTimeslotRef[this.state.timeSlots[i].split(' ')[0]] = myRef;
    }
  }
  public componentDidMount() {
    const {
      startTime,
      endTime,
      eventId,
      organiser,
      theme: { primaryColour, secondaryColour, logoURL },
    } = this.props.client.readQuery({ query: GET_EVENT_INFO });
    this.setState({
      startDate: moment(startTime),
      endDate: moment().add(1, 'year'),
    });
    this.props.setCurrentPage('Calendar');
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
    this.getUrl();
    this.setState(
      {
        companyName: '',
        personName: '',
        eventID: eventId,
        organiser: organiser,
        theme: {
          ...this.state.theme,
          primaryColour,
          secondaryColour,
        },
      },
      () => this.initialiseUserData()
    );
  }

  private initialiseUserData() {
    let personName = this.props.user.userData.firstName + ' ' + this.props.user.userData.lastName;
    this.setState(
      {
        personName: personName,
        personID: this.props.user.userData.id,
        companyName: this.props.user.userData.company.name,
        companyLogo: this.props.user.userData.company.logoURL,
        companyMembershipID: this.props.user.companyData.id,
        executiveData: {
          ...this.state.executiveData,
          id: this.props.user.userData.id,
          firstName: this.props.user.userData.firstName,
          lastName: this.props.user.userData.lastName,
          companyID: this.props.user.userData.company.id,
          companyName: this.props.user.userData.company.name,
          companyMembershipID: this.props.user.companyData.id,
        },
      },
      () => this.getCalendarSchedule(this.state.executiveData)
    );

    const companyId = window.location.pathname.split('/').pop();
    this.getEventAttendees(this.state.eventID, companyId);
    this.getCompanyList(this.state.eventID, companyId);

    this.getVenues().then((value: any) => {
      this.setState({
        venueList: value,
      });
    });
  }

  public getCompanyList = (eventId: any, companyId: any) => {
    let companies: any[] = [];

    getEventCompanies(eventId)
      .then((response: any) => {
        if (response.data && response.data.getEventCompanies) {
          if (response.data.getEventCompanies.length > 0) {
            companies = [...response.data.getEventCompanies];
          }

          let companySelected = companies.find((item: any) => item.id === companyId);
          this.setState({
            companiesArray: companies,
            companyName: companySelected ? companySelected.name : '',
            companyLogo: companySelected ? companySelected.logoURL : '',
          });
          return;
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  public checkSlotStatus = (day: DayConfiguration, slot: string) => {
    const executiveSelected = this.state.personName;
    if (executiveSelected) {
      let slotTime = slot.split('-')[0].trim();
      let currentSlot = moment(day.date + ' ' + slotTime, 'DD/MM/YYYY HH:mm').toISOString();

      let bookingSchedule = this.state.bookingSchedule;
      const totalObjects = bookingSchedule.length;
      let match = false;
      let invitationStatus = '';

      if (totalObjects > 0) {
        bookingSchedule.map((booking) => {
          if (
            moment(currentSlot).isSame(moment(booking.platformEventSlot.startAt)) ||
            moment(currentSlot).isSame(moment(booking.platformEventSlot.endAt)) ||
            moment(currentSlot).isBetween(
              moment(booking.platformEventSlot.startAt),
              moment(booking.platformEventSlot.endAt)
            )
          ) {
            match = true;
            switch (booking.invitationStatus) {
              case 'ACCEPTED':
                invitationStatus = 'Accepted';
                break;
              case 'AWAITING':
                invitationStatus = 'Pending';
                break;
              default:
                invitationStatus = booking.invitationStatus;
                break;
            }
          }
        });

        if (match) {
          match = !match;
          return invitationStatus;
        }
      }

      const { venueSelected, venueList } = this.state;
      venueList.forEach((venue: any) => {
        if (venueSelected.includes(venue._id)) {
          venue.bookedSlots.forEach((slot: any) => {
            if (
              moment(currentSlot).isSame(moment(slot.startAt)) ||
              moment(currentSlot).isSame(moment(slot.endAt)) ||
              moment(currentSlot).isBetween(moment(slot.startAt), moment(slot.endAt))
            ) {
              invitationStatus = 'Room Booked';
            }
          });
        }
      });

      if (invitationStatus) {
        return invitationStatus;
      }
    }
  };

  public getEventAttendees = (eventId: string, companyId?: string) => {
    getEventAttendees(eventId)
      .then((response: any) => {
        if (response.data && response.data.getEventAttendees) {
          this.setState(
            {
              attendees: response.data.getEventAttendees.attendees,
            },
            () => {
              if (this.state.attendees.length > 0) {
                let currentCompanyID = window.location.pathname.split('/').pop();
                let representatives: Executives[] = [];
                this.state.attendees.map((attendee) => {
                  if (representatives.length > 0) {
                    if (representatives.find((x) => x.id === attendee.invitee.user.id) === undefined) {
                      representatives.push({
                        firstName: attendee.invitee.user.firstName,
                        lastName: attendee.invitee.user.lastName,
                        id: attendee.invitee.user.id,
                        companyMembershipID: attendee.invitee.id,
                        companyName: attendee.invitee.company.name,
                        companyID: attendee.invitee.company.id,
                        invitationStatus: attendee.invitationStatus,
                        value: '',
                        label: '',
                      });
                    }
                  } else {
                    representatives.push({
                      firstName: attendee.invitee.user.firstName,
                      lastName: attendee.invitee.user.lastName,
                      id: attendee.invitee.user.id,
                      companyMembershipID: attendee.invitee.id,
                      companyName: attendee.invitee.company.name,
                      companyID: attendee.invitee.company.id,
                      invitationStatus: attendee.invitationStatus,
                      value: '',
                      label: '',
                    });
                  }
                });

                if (currentCompanyID !== 'calendar') {
                  representatives = representatives.filter((item: any) => item.companyID === currentCompanyID);
                }
                representatives = representatives.filter((item: any) => item.invitationStatus === 'ACCEPTED');

                this.setState({ representatives, showExecutives: true });
              }
            }
          );
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  public getUrl = () => {
    let url = window.location.href.split('/').pop();
    if (url !== 'calendar') {
      this.setState({ isBooking: true });
    } else {
      this.setState({ isBooking: false });
    }
  };

  public handleResize = () => {
    let windowSize = window.innerWidth;
    if (windowSize < 578) {
      this.changeCalendarWidth(windowSize, 'smaller');
    } else if (windowSize > 578 && windowSize < 1024) {
      this.changeCalendarWidth(windowSize, 'smaller');
    } else if (windowSize > 1024) {
      this.changeCalendarWidth(windowSize, 'larger');
    }
  };

  public changeCalendarWidth = (width: number, widthSize?: string) => {
    let allocatedSpace = 0;
    let dayCount = this.state.days.length;
    if (width) {
      if (dayCount > 0 && widthSize !== 'smaller') {
        allocatedSpace = width / (dayCount - 1);
        this.setState({ allocatedSpace: allocatedSpace, cellCount: 8 });
      } else if (dayCount > 0 && widthSize === 'smaller') {
        allocatedSpace = width / 2;
        this.setState({ allocatedSpace: allocatedSpace, cellCount: 2 });
      }
    }
  };

  public componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  public checkMeetingSlot = (event: any, slot: string, time: { day: string; date: string; id?: string }) => {
    let bookingSlot = [];
    let currentSlotStatus = event.target.textContent;
    let isUserCalendar = window.location.pathname.split('/').pop() === 'calendar';
    if (
      slot &&
      time &&
      moment(time.date, 'DD/MM/YYYY').isBetween(
        moment(this.state.startDate, 'DD/MM/YYYY'),
        moment(this.state.endDate, 'DD/MM/YYYY')
      )
    ) {
      let slotStart = slot.split('-')[0];
      let currentSlot = moment(time.date + ' ' + slotStart, 'DD/MM/YYYY HH:mm').toISOString();

      if (isUserCalendar === false && currentSlotStatus === 'Available') {
        this.getCurrentMousePosition(this);
        this.setState({
          clickedTimeSlot: slot,
          selectedDay: time,
          pointX: screenX,
          pointY: screenY,
        });
        console.log("BOOK_MEETING");
        this.props.showModal('BOOK_MEETING', 'lg', null, null, {
          slot: slot,
          selectedDay: time,
          companyName: this.state.companyName,
          companyMembershipID: Array.isArray(this.state.executiveData)
            ? this.state.executiveData.map((item: any) => item.companyMembershipID)
            : [this.state.executiveData.companyMembershipID],
          personName: this.state.personName,
          personID: this.state.personID,
          isBooking: this.state.isBooking,
          updateSlot: this.getCalendarSchedule,
          isUserCalendar: isUserCalendar,
        });
        // } else if (isUserCalendar === true) {
      } else {
        if (
          this.state.bookingSchedule.length > 0 &&
          (currentSlotStatus === 'ACCEPTED' || currentSlotStatus === 'DECLINED' || currentSlotStatus === 'AWAITING')
        ) {
          bookingSlot = this.state.bookingSchedule.filter((slotInfo) => {
            if (time.id === slotInfo.id) {
              return slotInfo;
            }
          });
        }

        console.log("BOOK MEETING");
        this.props.showModal('BOOK_MEETING', 'lg', null, null, {
          slot: slot,
          selectedDay: time,
          companyName: this.state.companyName,
          companyMembershipID: Array.isArray(this.state.executiveData)
            ? this.state.executiveData.map((item: any) => item.companyMembershipID)
            : [this.state.executiveData.companyMembershipID],
          personName: this.state.personName,
          personID: this.state.personID,
          isBooking: false,
          updateSlot: this.getCalendarSchedule,
          isUserCalendar: isUserCalendar,
          currentSlotStatus: currentSlotStatus,
          bookingSlot: bookingSlot[0],
        });
      }
    }
  };

  private getCurrentMousePosition = (e: {}) => {
    // const position = this.refs.elem.getDOMNode().getBoundingClientRect()
    // console.log("e", e)
  };

  private calculateTimeSlotValues = () => {
    let timeInterval = 30;
    let timeSlotArray = [];
    let startTime = 0;

    for (var i = 0; startTime < 24 * 60; i++) {
      let hours = Math.floor(startTime / 60);
      let minutes = startTime % 60;
      timeSlotArray[i] = ('0' + (hours % 12)).slice(-2) + ':' + ('0' + minutes).slice(-2);
      startTime = startTime + timeInterval;
    }
  };

  private setSlideHandler = (value: number) => {
    const reference = this.state.referenceDay.clone();
    let finalRef;
    if (value === -1) {
      finalRef = reference.subtract(1, 'week');
      this.setState({ referenceDay: finalRef, months: moment(finalRef) });
    } else {
      finalRef = reference.add(1, 'week');
      this.setState({ months: moment(finalRef), referenceDay: finalRef });
    }
    const sliderCurrentValue = this.state.sliderValue;
    const updatedValue = sliderCurrentValue + value;
    this.setState({ days: [] });
    this.getBookingSchedule(value);
    // }
  };

  private toggleOpen = () =>
    this.setState({
      isOpen: !this.state.isOpen,
    });

  private confirmBookingHandler = () => {
    this.closeBookingPopUp();
  };

  private cancelBookingHandler = () => {
    this.closeBookingPopUp();
  };

  private closeBookingPopUp = () => {
    const currentStatusValue = this.state.bookStatus;
    this.setState({ bookStatus: !currentStatusValue });
  };

  private selectDay = (Indx: number) => {
    this.setState((prevState) => ({
      mobileCurrentDate: {
        ...prevState.mobileCurrentDate,
        day: this.state.days[Indx].day,
        date: this.state.days[Indx].date,
      },
      currentDayDate: moment(this.state.days[Indx].date, 'DD/MM/YYYY'),
    }));
  };

  public previous() {
    const { months, referenceDay } = this.state;
    this.setState({
      months: months.subtract(1, 'month'),
      referenceDay: months.startOf('months'),
      days: [],
    });
  }

  public next() {
    const { months, referenceDay } = this.state;
    this.setState({
      months: months.add(1, 'month'),
      referenceDay: months.startOf('months'),
      days: [],
    });
  }

  public checkDate() {
    let todaysDate = moment().clone();
    this.setState({
      referenceDay: todaysDate,
      months: moment(),
      days: [],
      currentDayDate: moment().clone(),
    });
  }

  public getCalendarSchedule(executiveData?: Executives) {
    let executiveInfo = executiveData;

    if (executiveData && Object.keys(executiveData).length > 0) {
      this.setState({
        executiveData,
        personName: executiveData.firstName + ' ' + executiveData.lastName,
      });
    } else {
      executiveInfo = this.state.executiveData;
    }
    let bookingSchedule = [];
    let finalList: any[] = [];
    let sortedDates = [];
    this.setState({
      personName: (Array.isArray(executiveInfo) ? executiveInfo : [executiveInfo])
        // @ts-ignore
        .map((item: any) => `${item.firstName || ''} ${item.lastName || ''}`)
        .join(','),
    });

    // @ts-ignore
    const employMembership = (Array.isArray(executiveInfo) ? executiveInfo : [executiveInfo])
      .map((item : any) => item?.companyMembershipID)
      .filter((id: any) => id !== null);
    getEmployeeCalendar([this.state.companyMembershipID, ...employMembership].filter((id) => id !== null)).then(
      (res: InvitationResponse) => {
        if (res.data && res.data.getEmployeeCalendar.length > 0) {
          res.data.getEmployeeCalendar.forEach((resData: any) => {
            if (resData.eventInvitations.length > 0) {
              bookingSchedule = resData.eventInvitations;
              bookingSchedule.sort((a: any, b: any): any => {
                if (a.platformEventSlot && b.platformEventSlot) {
                  return (
                    moment(a.platformEventSlot.startAt, 'DD/MM/YY HH:mm') >
                    moment(b.platformEventSlot.startAt, 'DD/MM/YY HH:mm')
                  );
                }
              });
              const finalBookingArray = bookingSchedule.filter(
                (item: any) => item.platformEventSlot !== null && item.invitationStatus !== 'DECLINED'
              );
              finalList.push(...finalBookingArray);
              finalList = Object.values(
                finalList.reduce((acc: any, curr: any) => {
                  if (!(curr.id in acc)) {
                    acc[curr.id] = curr;
                  }
                  return acc;
                }, {})
              );

              if (finalBookingArray.length > 0) {
                this.setState(
                  {
                    bookingSchedule: finalBookingArray,
                  },
                  () => this.getBookingSchedule()
                );
              } else {
                this.getBookingSchedule();
              }
              this.setState({
                bookingSchedule: finalList,
              });
            }
          });
        } else {
          this.setState({
            bookingSchedule: [],
          });
        }
      }
    );
  }

  public getVenues(eventId?: string) {
    if (!eventId) eventId = this.state.eventID;
    return new Promise((resolve) => {
      getEventVenues(eventId)
        .then((response: any) => {
          if (response.data && response.data.getEventVenues) {
            resolve(response.data.getEventVenues);
          }
        })
        .catch((err: any) => {
          console.error(err);
        });
    });
  }

  private getBookingSchedule(direction?: number) {
    let iteration = 0;
    if (this.state.bookingSchedule.length === 0 && iteration === 0) {
      iteration += 1;
    }
    if (this.state.bookingSchedule.length > 0) {
      let referenceDay = this.state.referenceDay.clone();
      let timeSlots: any = [];
      if (direction === 1) {
        let newReferenceDay = referenceDay.add('7', 'days');
        let lastDay = newReferenceDay.clone();
        let weeksLastDate = lastDay.add('6', 'days').format('DD/MM/YYYY');
        let bookingSchedule = this.state.bookingSchedule;
        bookingSchedule.map((booking) => {
          if (
            moment(this.state.bookingSchedule[0].platformEventSlot.startAt).isSameOrAfter(newReferenceDay) &&
            moment(this.state.bookingSchedule[0].platformEventSlot.endAt).isSameOrBefore(weeksLastDate)
          ) {
            timeSlots.push(booking);
          }
        });
      } else if (direction === -1) {
        const reference = this.state.referenceDay.clone();
        let weeksLastDate = reference.add('6', 'days').format('DD/MM/YYYY');
        let bookingSchedule = this.state.bookingSchedule;
        if (this.state.bookingSchedule.length > 0) {
          bookingSchedule.map((booking) => {
            if (
              moment(this.state.bookingSchedule[0].platformEventSlot.startAt).isSameOrAfter(reference) &&
              moment(this.state.bookingSchedule[0].platformEventSlot.endAt).isSameOrBefore(weeksLastDate)
            ) {
              timeSlots.push(booking);
            }
          });
        }
      } else {
        const currentLastDate = this.state.referenceDay.add('6', 'days');
        let currentBookingSchedule = this.state.bookingSchedule;
        currentBookingSchedule.map((booking, index) => {
          if (
            moment(this.state.bookingSchedule[index].platformEventSlot.startAt).isSameOrAfter(referenceDay) &&
            moment(this.state.bookingSchedule[0].platformEventSlot.endAt).isSameOrBefore(currentLastDate)
          ) {
            timeSlots.push(booking);
          }
        });
      }
      if (timeSlots.length > 0) {
        this.setState({
          timeSlotsInfo: timeSlots,
        });
      }
    }
  }

  private shuffleArray = (array: string[]) => {
    let i = array.length - 1;
    for (i = 0; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  };

  public getDropdownOption = (option: string) => {
    if (option) {
      if (option === 'ext') {
        this.setState({ showStatus: true });
      } else {
        this.setState({ showStatus: false });
      }
    }
  };

  public render() {
    const start = moment();
    const remainder = 30 + (start.minute() % 30);

    const dateTime = moment(start).subtract(remainder, 'minutes').format('HH:mm');
    const selectedPerson = this.state.personName;
    const menuClass = `dropdown-menu slider${this.state.isOpen ? ' show' : ''}`;
    const dayData = this.state.days;
    const currentD = this.state.currentDayDate;
    const mobileCurrentDate = this.state.mobileCurrentDate;
    const referenceTemp = this.state.referenceDay;
    const showCalendar = referenceTemp.clone();
    if (dayData.length === 0) {
      for (let i = 0; i < 7; i++) {
        dayData.push({
          day: moment(showCalendar).add(i, 'days').format('ddd'),
          date: moment(showCalendar).add(i, 'days').format('DD/MM/YYYY'),
        });
      }
    }
    const sliderCurrentValue = this.state.sliderValue;
    const currentTimeSlot = this.state.clickedTimeSlot;
    const allBookedSchedule = this.state.bookingSchedule.map((item: any) => ({
      ...item,
      eventId: item.id,
      title: item.platformEventSlot && item.platformEventSlot.name,
      start: item.platformEventSlot && item.platformEventSlot.startAt,
      end: item.platformEventSlot && item.platformEventSlot.endAt,
    }));

    const slots = this.state.timeSlots.sort();
    const timeSlot = [];
    for (let i = 0; i < slots.length; i++) {
      let cell = [];
      for (let j = 0; j < this.state.cellCount; j++) {
        let cellID = `cell${i}-${j}`;
        if (j === 0) {
          cell.push(
            <td
              key={cellID}
              style={{ width: this.state.allocatedSpace - 35 }}
              className={`td-time-slots`}
              ref={this.state.lstTimeslotRef[slots[i].split(' ')[0]]}
            >
              <span style={{ width: this.state.allocatedSpace }} className="time-slot">
                {slots[i].split(' ')[0]}
              </span>
            </td>
          );
        } else {
          cell.push(
            <td
              key={cellID}
              style={{ width: this.state.allocatedSpace }}
              className={`${
                selectedPerson
                  ? this.checkSlotStatus(dayData[j - 1 + sliderCurrentValue], slots[i + sliderCurrentValue])
                    ? 'test-gray'
                    : ''
                  : ''
              } ${
                dayData[j - 1 + sliderCurrentValue].date !== referenceTemp.format('DD/MM/YYYY')
                  ? moment(dayData[j - 1 + sliderCurrentValue].date, 'DD/MM/YYYY').isBetween(
                      moment(this.state.startDate, 'DD/MM/YYYY'),
                      moment(this.state.endDate, 'DD/MM/YYYY')
                    )
                    ? 'week-day'
                    : 'unavailable'
                  : moment(dayData[j - 1 + sliderCurrentValue].date, 'DD/MM/YYYY').isBetween(
                      moment(this.state.startDate, 'DD/MM/YYYY'),
                      moment(this.state.endDate, 'DD/MM/YYYY')
                    )
                  ? 'current-day-dk'
                  : 'unavailable'
              }`}
              onClick={(e) => {
                if (this.state.personName) {
                  this.checkMeetingSlot(e, slots[i + sliderCurrentValue], dayData[j - 1 + sliderCurrentValue]);
                }
              }}
            >
              <span className={`title slider`} style={{ width: this.state.allocatedSpace }}>
                <TimeSlot
                  slot={slots[i + sliderCurrentValue]}
                  dayItem={dayData[j - 1 + sliderCurrentValue]}
                  startDate={this.state.startDate}
                  endDate={this.state.endDate}
                  individualCalendarEndAt={this.state.individualCalendarEndAt}
                  individualCalendarStartAt={this.state.individualCalendarStartAt}
                  individualCalendarName={this.state.individualCalendarName}
                  slotText={
                    selectedPerson
                      ? this.checkSlotStatus(dayData[j - 1 + sliderCurrentValue], slots[i + sliderCurrentValue])
                      : '- -'
                  }
                  mobileCurrentDate={mobileCurrentDate}
                />
              </span>
            </td>
          );
        }
      }
      timeSlot.push(
        <tr className={`borderStyle ${i % 2 ? 'hourGap' : ''}`} key={i}>
          {cell}
        </tr>
      );
    }

    if (this.state.lstTimeslotRef[dateTime] && this.state.lstTimeslotRef[dateTime].current) {
      this.state.lstTimeslotRef[dateTime].current.scrollIntoView();
    }
    const currentDate = this.state.activeDateIndx;
    const day = dayData.slice(sliderCurrentValue, 7 + sliderCurrentValue).map((dayData, i) => (
      <div
        key={dayData.date}
        style={{ width: this.state.allocatedSpace }}
        className={dayData.date == currentD.format('DD/MM/YYYY') ? ' selected-day  btn-pad' : ' btn-pad'}
        onClick={this.selectDay.bind(this, i)}
      >
        <span className="block title ">{dayData.day}</span>
        <span className="block title date-attr ">{dayData.date.split('/')[0]}</span>
      </div>
    ));

    if (day.length > 6) {
      day.splice(
        0,
        0,

        <div className="btn-pad" style={{ width: this.state.allocatedSpace }}>
          <span className="block slider left-icon" onClick={this.setSlideHandler.bind(this, -1)}>
            <FontAwesomeIcon icon="chevron-left" />
          </span>
        </div>
      );
      day.push(
        <div className="btn-pad">
          <span className="block slider right-icon" onClick={this.setSlideHandler.bind(this, 1)}>
            <FontAwesomeIcon icon="chevron-right" />
          </span>
        </div>
      );
    }
    return (
      <>
        <StyledList className="main-container container" ui={this.props.ui} theme={this.state.theme}>
          <div>
            <div>
              <CalendarViewComponent
                // @ts-ignore
                dayData={day}
                timeSlotData={timeSlot}
                click={this.toggleOpen}
                months={this.state.months}
                dropdownClass={menuClass}
                previousMonth={this.previous}
                nextMonth={this.next}
                today={this.state.isCurrentDay}
                currentDay={this.checkDate}
                executivesList={this.state.representatives}
                venueList={this.state.venueList}
                checkSchedule={(arg1: Executives) => this.getCalendarSchedule(arg1)}
                setVenueSelected={(value: any[]) => this.setState({ venueSelected: value })}
                showButton={this.state.showExecutives}
                mobileCurrentDate={mobileCurrentDate}
                companyName={this.state.companyName}
                companyLogo={this.state.companyLogo}
                allBookedSchedule={allBookedSchedule}
              />
              {this.state.bookStatus && (
                <BookingModal
                  selectedDay={this.state.selectedDay}
                  clicked={currentTimeSlot}
                  confirm={this.confirmBookingHandler}
                  cancel={this.cancelBookingHandler}
                  dropdownClass={menuClass} // you are passing this but not using it? - GC 01/10/19
                  showStatus={this.state.showStatus}
                  callbackFunction={(option) => this.getDropdownOption(option)}
                  modalShow={this.state.isBooking}
                />
              )}
            </div>
          </div>
        </StyledList>

        <div>
          <CalendarView
            events={allBookedSchedule}
            onDateClick={(datevalue: any) => {
              const { date } = datevalue;
              const startSlot = moment(date).format('HH:mm');
              const endSlot = moment(date).add(30, 'minutes').format('HH:mm');
              this.checkMeetingSlot({ target: { textContent: 'Available' } }, `${startSlot}-${endSlot}`, {
                day: moment(date).format('dddd'),
                date: moment(date).format('DD/MM/YYYY'),
              });
            }}
            onEventClick={(value: any) => {
              const startSlot = moment(value.event.extendedProps.platformEventSlot.startAt).format('HH:mm');
              const endSlot = moment(value.event.extendedProps.platformEventSlot.endAt).format('HH:mm');
              this.checkMeetingSlot(
                { target: { textContent: value.event.extendedProps.invitationStatus } },
                `${startSlot}-${endSlot}`,
                {
                  day: moment(value.event.extendedProps.platformEventSlot.startAt).format('dddd'),
                  date: moment(value.event.extendedProps.platformEventSlot.startAt).format('DD/MM/YYYY'),
                  id: value.event.extendedProps.eventId,
                }
              );
            }}
          />
        </div>
      </>
    );
  }
}

const StyledList = styled.div<{ ui: UIState }>`
  .custom-calander-header {
    width: 100%;
    display: table;
  }
  .companyLogo {
    display: table-cell;
  }
  .box-align-employee {
    display: table-cell;
    width: 250px;
  }
  .box-align-employee button {
    background-color: ${(props) =>
      props.theme && props.theme.primaryColour ? props.theme.primaryColour : '#4fb6c0'} !important;
    color: #fff;
    margin-right: 1rem;
    padding: 8px 8px 5px 8px;
  }

  .custom-calendar-table {
    height: 45vh;
    overflow-y: scroll;
  }

  .test-gray {
    background-color: #c3c0c0 !important;
  }
  .btn {
    background-color: ${(props) => (props.theme && props.theme.primaryColour ? props.theme.primaryColour : '#4fb6c0')};
  }
  @media (min-width: 576px) {
    .col-sm {
      flex-basis: auto;
      /* flex-grow: 1; 
    max-width: 100%; */
    }
  }

  .transparent-style {
    color: transparent;
  }

  .disabled-day {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .page-title {
    display: inline-block;
    border-bottom: 4px solid black;
    margin-bottom: 0.5em;
  }
  .calendarComponent {
    flex-direction: column;
  }

  .timeslot-main {
    white-space: nowrap;
    text-align: center;
  }

  .td-time-slots {
    /* border-left: 1px solid #092935;
      border-bottom: 1px solid #092935; */
    background-color: rgb(130, 154, 164);
    border: 1px solid #ffffff;
    color: white;
  }
  .cal-margin {
  }

  @media (min-width: 992px) {
    .title {
      text-align: left;
      font-weight: bold;
    }
    .col-sm {
      width: auto;
      padding: 0;
    }

    .block {
      display: flex;
      padding: 5px;
      justify-content: center;
      color: white;
    }

    .select-executive {
      float: right;
    }

    .back-color {
      margin: 2px;
      background-color: #f0f0f0;
    }

    table {
      display: flex;

      tr {
        text-align: center;
      }

      td .slider {
        padding: 20px 0px;

        width: 100%;
        height: 100%;
      }
    }

    .justify-cal-content {
      display: flex;
      justify-content: flex-end;
    }

    .week-day {
      //background-color: #f6f6f6;
      background-color: #ebebeb;
      border: 1px solid #ffffff;
      padding: 20px 0;
    }

    .unavailable {
      background-color: rgb(216, 216, 216);
      border-bottom: 1px solid #ffffff;
      padding: 20px 0;
      cursor: not-allowed;
    }

    .calenderCell {
      border-left: 3px solid #fff;
    }

    .slider {
      cursor: pointer;
    }

    .left-icon {
      justify-content: flex-start;
      align-items: center;
      height: 100%;
    }

    .right-icon {
      justify-content: flex-end;
      align-items: center;
      height: 100%;
    }

    .time-slot {
      font-weight: bold;
      background-color: transparent;
    }

    .booking-content {
      display: block;
      text-align: center;
    }

    .booking-content-icons {
      display: block;
      text-align: center;
    }

    .booking-modal {
      position: fixed;
      top: 50%;
      left: 50%;
      width: auto;
      height: auto;
      background-color: #f8f8f8;
      border-radius: 15px;
      padding: 2px 15px;
    }

    .external-space {
      border-radius: 3px;
      padding: 6px 12px;
      margin-bottom: 10px;
    }

    .booking-icons {
      padding: 2px 10px;
    }

    .icon-button {
      border: 0;
      outline: none;
      background-color: transparent;
      color: #81d1d0;
      font-size: 20px;
    }

    .cancel-button {
      color: #092935;
    }

    .month-label {
      background-color: rgb(218, 204, 222);
      color: #fff;
      padding: 10px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      padding-bottom: 40px;
    }

    .select-executive {
      background-color: #2cbbbf;
      color: white;
      border-radius: 0.25rem;
      margin-bottom: 5px;
      padding: 10px;
      cursor: pointer;
    }

    .day-label {
      background-color: rgb(130, 154, 164);
      justify-content: space-around;
      display: inherit;
    }

    img {
      height: 100%;
      width: 100%;
      max-width: 200px;
      max-height: 180px;
    }

    .timeslot-data {
      display: none;
    }

    .current-day-dk {
      background-color: #f6f6f6;
      padding: 20px 0;
      //border: 1px solid #ffffff;
      border: 2px solid #ebebeb;
    }

    .meeting-headline {
      text-align: center;
      font-weight: bold;
    }
  }
  @media (min-width: 992px) {
    .imageContainer {
      display: flex;
      justify-content: flex-end;
      padding: 0;
    }

    .bckgd {
      background: #fff;
    }

    .selected-day {
      color: #ffffff;
    }

    .company-desc {
      font-size: small;
    }
    .company-info {
      padding: 0;
      max-width: 100%;
    }

    .company-name {
      display: flex;
      align-items: center;
      flex: 1;
    }
  }

  .selected-day {
    background-color: #a489ac;
    color: #ffffff;
  }

  .hourGap {
    border-bottom: 3px solid white;
  }

  .navPrevWeek {
    position: absolute;
    left: 0.5em;
    height: 100%;
  }

  .navNextWeek {
    position: absolute;
    right: 0.5em;
    height: 100%;
  }
  @media (max-width: 992px) {
    .box-align {
      display: inline;
      margin: 0 5px;
    }
    .borderStyle {
      border-bottom: 1px solid black;
    }
    table {
      display: flex;

      tr {
        text-align: center;
      }

      td .slider {
        padding: 20px 0px;

        width: 100%;
        height: 100%;
      }
    }
    .page-title {
      display: inline-block;
      border-bottom: 4px solid black;
      margin-bottom: 0.5em;
    }

    .current-day-dk {
      padding: 0px;
      margin: 10px 0px;
    }

    td.current-day-dk {
      margin: 10px 0px;
      border-collapse: separate;
      border-bottom: 1px solid #092935;
      border-spacing: 100px;
    }

    .td-time-slots {
      padding: 0;
      width: 100% !important;
      border-bottom: 1px solid #092935;
      border-left: none;
    }

    span.title.slider {
      padding: 0px;
    }

    span {
      padding: 0px;
    }

    .week-day {
      display: block;
    }

    img {
      height: 100%;
      width: 100%;
      max-width: 150px;
      max-height: 150px;
    }

    .title {
      text-align: center;
      font-weight: bold;
    }

    .left-icon,
    .right-icon {
      // display: none;
      width: 0px;
    }

    .month-label {
      background-color: rgb(218, 204, 222) c;
      color: #fff;
      padding: 10px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      padding-bottom: 30px;
      margin: 0;
    }

    .day-label {
      background-color: rgb(130, 154, 164);
      justify-content: space-between;
      display: inherit;
    }

    .time-slot {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      padding: 0px 10px 0px 0px;
      white-space: nowrap;
    }

    table {
      display: flex;
      text-align: center;

      td span {
        padding: 0px;
        display: inline-block;
        background-color: transparent;
        width: 100%;
        height: 70px;
        padding: 3px 0px 5px 5px;
      }

      p {
        padding: 0px;
        margin: 0px;
      }
    }

    .select-executive {
      float: none;
      background-color: #2cbbbf;
    }

    .timeslot-data-dk {
      display: none;
    }

    .timeslot-data {
      display: block;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .slider {
      /* border-bottom: 1px solid #D3D3D3; */
    }

    .booking-modal {
      left: 15%;
      border: 1px solid;
    }

    .booking-content {
    }

    .dropdown-btn {
      margin-bottom: 5px;
    }

    .date-attr {
      display: block;
      color: white;
    }

    .btn-pad {
      padding: 1px;
      margin: auto;
    }

    .imageContainer {
      display: flex;
      justify-content: flex-end;
      padding: 0;
    }

    .company-desc {
      font-size: small;
    }
    .company-info {
      padding: 0;
      max-width: 100%;
    }

    .company-name {
      display: flex;
      align-items: center;
      flex: 1;
    }
  }

  @media (min-width: 1023px) and (max-width: 1024px) {
    table {
      display: flex;
      text-align: center;

      td span {
        display: inline-block;
        background-color: transparent;
        width: 100%;
        height: 100px;
      }

      td .slider {
        padding: 0px;
      }

      .current-day-dk {
        padding: 0px;
      }

      .week-day {
        padding-left: 0px;
        padding-right: 0px;
      }

      .td-time-slots {
        padding: 0;
        border-left: 2px solid grey;
        border-bottom: 2px solid grey;
      }

      .time-slot {
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        background-color: transparent;
      }

      .timeslot-data-dk {
        justify-content: center;
        align-items: center;
        display: flex;
        border: 1px solid #ffffff;
      }
    }
  }
`;

const mapStateToProps = (state: AppState) => ({
  user: state.user,
  ui: state.ui,
});

const mapDispatchToProps = (dispatch: Dispatch) => {
  return bindActionCreators(
    {
      setCurrentPage,
      showModal,
    },
    dispatch
  );
};

export default compose(withApollo, connect(mapStateToProps, mapDispatchToProps))(Calendar);
