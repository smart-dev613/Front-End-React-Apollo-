export interface UserData {
  avatar: string
  firstName: string
  lastName: string
  id: string
  Keywords: string[]
  Introduction?: string
  company?: CompanyInformation
  email?: string
  selectedCompanyMembership: any,
  profiles: [],
  'Notifications': [],
}

export interface CompanyInformation {
  name: string
  id: string
  logoURL: any
  currency: string
}

export interface Executives {
  value: string
  label: string
  id: string;
  firstName: string;
  lastName: string;
  companyID?: string;
  companyMembershipID?: string;
  invitationStatus?: string,
  companyName?: string;
}

export interface CompanyData {
  name: any
  id: string
  role: string
  phone: string
  email: string
  currency: string
}

export interface UserState {
  isLoggedIn: boolean
  isSessionPending: boolean
  isEventAttendee: any
  isAlreadyRequested: boolean
  userData: UserData
  companyData: CompanyData
  allCompanies: [CompanyMembershipObject],
  carts: any[],
  isUserSelected: boolean
}

export interface CompaniesObject {
  _id: string
  Name: string
  Status: string
  TagLine: string
  URL: string
  Email: string
}

export interface CompanyMembershipCompanySubobject {
  name: string
  email: string
  _id: number | string
  id: string
  address: any
  currency: any
}

export interface CompanyMembershipObject {
  role: string
  company: CompanyMembershipCompanySubobject
  id: string
}

export interface ListData {
  logoUrl: string
  name: string
  profileEn?: {
    bio: string,
    keywords: string[]
  }
  type?: string
  keywords?: string[]
  id?: number
}

// Action Types
export const LOGOUT = 'LOGOUT'
export const LOGIN = 'LOGIN'
export const EVENT_ATTENDANCE = 'EVENT_ATTENDANCE'
export const SET_LOGIN_ERROR = 'SET_LOGIN_ERROR'
export const SET_SESSION_PENDING = 'SET_SESSION_PENDING'
export const SET_USER_DATA = 'SET_USER_DATA'
export const SET_COMPANY_DATA = 'SET_COMPANY_DATA'
export const SET_GENERAL_ERROR = 'SET_GENERAL_ERROR'
export const SET_ALL_COMPANIES = 'SET_ALL_COMPANIES'
export const SET_IS_ALREADY_REQUESTED = 'SET_IS_ALREADY_REQUESTED'
export const SET_COMPANY_DETAILS = 'SET_COMPANY_DETAILS'
export const SET_CARTS = 'SET_CARTS'
export const SET_IS_USER_SELECTED = 'SET_IS_USER_SELECTED'

interface LoginAction {
  type: typeof LOGIN
}
interface LogoutAction {
  type: typeof LOGOUT
}

interface EventAttendanceAction {
  type: typeof EVENT_ATTENDANCE
  data: object
}

interface LoginErrorAction {
  type: typeof SET_LOGIN_ERROR
  error: string
}

interface SessionPendingAction {
  type: typeof SET_SESSION_PENDING
  pending: boolean
}

interface SetUserDataAction {
  type: typeof SET_USER_DATA
  userData: UserData
}

interface SetCompanyDataAction {
  type: typeof SET_COMPANY_DATA
  companyData: CompanyData
}

interface SetAllCompaniesAction {
  type: typeof SET_ALL_COMPANIES
  companies: [CompanyMembershipObject]
}

interface SetCartAction {
  type: typeof SET_CARTS
  carts: any[]
}
interface SetIsAlreadyRequested {
  type: typeof SET_IS_ALREADY_REQUESTED
  data: boolean
}

interface SetUserSelected {
  type: typeof SET_IS_USER_SELECTED,
  UserSelection: boolean
}
export type UserActionTypes = LoginAction | LogoutAction | EventAttendanceAction | LoginErrorAction | SessionPendingAction | SetUserDataAction | SetCompanyDataAction | SetAllCompaniesAction | SetIsAlreadyRequested | SetCartAction | SetUserSelected
