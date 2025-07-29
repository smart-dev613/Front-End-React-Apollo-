import { UIState } from "../../../store/ui/types"
import { UserState, UserData, Executives } from "../../../store/user/types"
import { ShowModal } from '../../../store/modal/types'
import { Moment } from 'moment'
import ApolloClient from 'apollo-client'

export interface MyItem {
  day: string;
  date: string;
}

export interface AttendeesList {
  eventType: string
  id: string
  invitationStatus: string
  invitee: InviteeDetails
}

export interface InviteeDetails {
  company: CompanyObject
  email: string
  id: string
  role: string
  user: UserData
}

export interface CompanyObject {
  id: string
  info: string
  logoUrl: string
  name: string
  profileEn: object
  profileCn: object
}

export interface DayConfiguration {
  day: string
  date: string
}

export interface InvitationResponse {
  data: {
    getEmployeeCalendar: Invitation
  }
}

export interface Invitation {
  eventInvitations: EventInvitations[]
}

export interface EventInvitations {
  calendarEvent: null | EventTypeDetails
  createdAt: string
  eventType: string
  id: string
  invitee: InviteeDetails
  platformEvent: null | EventTypeDetails
  platformEventSlot: null | EventTypeDetails
  invitationStatus: string
}

export interface EventTypeDetails {
  id: string
  endAt: string
  startAt: string
  name: string
}

export interface CalendarState {
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
  companyMembershipID: string;
  personName: string;
  personID: string;
  eventID: string;
  organiser: {
    id: string
    __typename: string
  }
  attendees: AttendeesList[],
  individualCalendarStartAt: string,
  individualCalendarEndAt: string,
  individualCalendarName: string,
  IndividualCalendarList: any[],
  representatives: Executives[],
  showExecutives: boolean,
  bookingSchedule: any[]
  executiveData: Executives
  timeSlotsInfo: EventInvitations[]
  mobileCurrentDate: DayConfiguration
  theme: {
    secondaryColour?: string
    primaryColour?: string
    logoURL?: string
  },
  lstTimeslotRef: any,
  selectedOption: any
}

export interface CalendarProps {
  ui: UIState;
  user: UserState;
  client: ApolloClient<any>
}

export interface DispatchProps {
  setCurrentPage: any;
  showModal: ShowModal;
}

export type Props = CalendarProps & DispatchProps
