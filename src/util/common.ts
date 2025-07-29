import { UserState } from "../store/user/types"

/**
 * Checks if the current user is an organiser of the event
 * @param userState - the Redux UserState (usually this.props.user if passed from a component)
 * @param organiser - the organiser object, returned by the getEvent GraphQL call
 */
export function userIsOrganiser(userState: UserState, organiser: any) {

  return (userState?.companyData?.id === organiser?.company?.id) 
}

export function userIsAuthorised(userState: UserState, organiser: any, menu?: any) {

  return ((userState?.companyData?.id === organiser?.company?.id) || (menu?.show && (menu?.userVisible || []).map((uv: any) => uv.id).includes(userState.userData.id)))
}

