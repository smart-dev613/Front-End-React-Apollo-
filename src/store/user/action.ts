import { Dispatch } from 'redux'
import { setLoadingTrue, setLoadingFalse } from '../ui/action'
import { LOGIN, EVENT_ATTENDANCE, SET_LOGIN_ERROR, SET_SESSION_PENDING, SET_USER_DATA, SET_COMPANY_DATA, UserData, SET_GENERAL_ERROR, SET_ALL_COMPANIES, SET_COMPANY_DETAILS, CompanyMembershipObject, SET_IS_ALREADY_REQUESTED, SET_CARTS, SET_IS_USER_SELECTED } from './types'
import { sessionRequest, eventInvitationUpdate } from '../../providers/user'
import { getCompany } from '../../providers/company'
import { getEventAttendees, getRequestToJoinEventList } from '../../providers/events'
import { CompaniesObject } from './types'
import { getEventCartItem } from '../../providers/pricing'

interface Data {
  User: UserData
  Event: any
}

export interface EventDataObject {
  LWIPublicKey: string
  LogoURL: string
  Name: string
  Subdomain: string
}

// ACTIONS (interact with reducer)
export const setLoggedIn = () => {
  return {
    type: LOGIN
  }
}

export const setEventAttendance = (data: object) => {
  return {
    type: EVENT_ATTENDANCE,
    data
  }
}

export const setIsAlreadyRequested = (data: boolean) => {
  return {
    type: SET_IS_ALREADY_REQUESTED,
    data
  }
}

export const setLoginError = (error: string) => {
  return {
    type: SET_LOGIN_ERROR,
    error
  }
}

export const setSessionPending = (pending: boolean) => {
  return {
    type: SET_SESSION_PENDING,
    pending
  }
}

export const setUserData = (userData: object) => {
  return {
    type: SET_USER_DATA,
    userData
  }
}

export const setCompanyData = (companyData: object) => {
  return {
    type: SET_COMPANY_DATA,
    companyData
  }
}

export const setGeneralError = (error: string) => {
  return {
    type: SET_GENERAL_ERROR,
    error
  }
}

export const setAllCompanies = (companies: CompanyMembershipObject[]) => {
  return {
    type: SET_ALL_COMPANIES,
    companies
  }
}

export const setCompanyDetails = (company: CompaniesObject) => {
  return {
    type: SET_COMPANY_DETAILS,
    company
  }
}

export const setCarts = (carts: any[]) => {
  return {
    type: SET_CARTS,
    carts
  }
}

export const setUserIsSelected = (value:boolean) => {
  return {
    type : SET_IS_USER_SELECTED,
    UserSelection : value
  }
}

interface SessionRequest {
  result: string
  action: string
  User?: object
  Company?: object
  Attendance?: [object]
  AllCompanies?: [CompanyMembershipObject]
  error?: string
}

// ACTION CREATORS (call from components)
export const session = (eventID: string): any => (dispatch: Dispatch) => {
  dispatch(setSessionPending(true))

  // console.log('doing session request')
  sessionRequest(eventID)
    .then((result: SessionRequest) => {
      if (result.result !== "success") {
        dispatch(setSessionPending(false))
      } else {
        // @ts-ignore
        dispatch(setUserData(result.User))
        dispatch(setCompanyData(result.Company))


        if (result.Attendance && result.Attendance?.length) {
          dispatch(setEventAttendance(result.Attendance))
        }
        if (result.AllCompanies) {
          dispatch(setAllCompanies(result.AllCompanies))
        }

        // @ts-ignore
        if (result.User !== false) {
          dispatch(setLoggedIn())
        }
        dispatch(setSessionPending(false))
        getRequestToJoinEventList(eventID)
          .then((res: any) => {
            const requestedList = (res.data.getRequestToJoinEventList || []).filter((item: any) => item.status === 'AWAITING')
            // @ts-ignore
            dispatch(setIsAlreadyRequested(!!requestedList.find((item: any) => item.requester.id === result.User.id)))
          })
      }
    })
    .catch((err: any) => {
      //console.error(err.message)
      if (err instanceof DOMException) {
        dispatch(setLoadingFalse())
        dispatch(setSessionPending(false))
        dispatch(setLoginError("Your request timed out. Please try again."))
      } else {
        dispatch(setLoadingFalse())
        dispatch(setSessionPending(false))
        dispatch(
          setLoginError(
            "An error has occured. We have been notified and will investigate. Please try again."
          )
        )
      }
    })
}

export const updateEventInvite = (eventID: string, attendeeID: string, status: string): any => (dispatch: Dispatch) => {
  dispatch(setSessionPending(true))

  eventInvitationUpdate(attendeeID, status)
    .then(() => sessionRequest(eventID))
    .then((result: SessionRequest) => {
      if (result.result !== "success") {
        dispatch(setSessionPending(false))
      } else {
        // @ts-ignore
        dispatch(setUserData(result.User))
        dispatch(setCompanyData(result.Company))
        if (result.Attendance && result.Attendance?.length) {
          dispatch(setEventAttendance(result.Attendance[0]))
        }
        // @ts-ignore
        if (result.User !== false) {
          dispatch(setLoggedIn())
        }
        dispatch(setSessionPending(false))
        window.location.reload();
      }
    })
    .catch((err: any) => {
      console.error(err)
      if (err instanceof DOMException) {
        dispatch(setLoadingFalse())
        dispatch(setSessionPending(false))
        dispatch(setLoginError("Your request timed out. Please try again."))
      } else {
        dispatch(setLoadingFalse())
        dispatch(setSessionPending(false))
        dispatch(
          setLoginError(
            "An error has occured. We have been notified and will investigate. Please try again."
          )
        )
      }
    })
}

export const setLoginErr = (error: string) => (dispatch: Dispatch) => {
  dispatch(setLoginError(error))
}

export const getCompaniesDetails = (companyId: string) => (dispatch: Dispatch) => {
  return new Promise<PromiseConstructor>((resolve) => {
    dispatch(setGeneralError(null))
    dispatch(setLoadingTrue())
    getCompany(companyId)
      .then((result: any) => {
        if (result.result !== 'success') {
          // @TOOD - HANDLE ERRORRR GC 280819
          resolve(result)
        } else {
          // set companies
          dispatch(setCompanyDetails(result.data))
          dispatch(setLoadingFalse())
          resolve(result)
        }
      })
      .catch(err => {
        if (err instanceof DOMException) {
          dispatch(setLoadingFalse())
          dispatch(setGeneralError('Your request timed out. Please try again.'))
          // @TOOD - HANDLE ERRORRR GC 280819
        } else {
          dispatch(setLoadingFalse())
          // @TOOD - HANDLE ERRORRR GC 280819
          console.log(err)
        }
      })
  })
}

export const loginApp = () => (dispatch: Dispatch) => {
  dispatch(setLoggedIn())
}

export const fetchCarts = (eventId: string): any => (dispatch: Dispatch) => {

  getEventCartItem(eventId)
    .then((response: any) => {

      const { data: { getEventCartItem: itemList }} = response

      dispatch(setCarts(itemList.filter((item: any) => item.status === 'PENDING')))

    }).catch((error: any) => {
      console.log(error)

    })

}

export const setSelection = (isSelected: boolean): any => (dispatch: Dispatch) => {
  dispatch(setUserIsSelected(isSelected))
}

export const updateUserData = (userData: object) => (dispatch: Dispatch) => {
  
  dispatch(setUserData(userData))
}