import { makePostRequest, makeGetRequest } from './core/common'
import { AppResponse } from './core/types'

/**
 * Complete verification of user accounts
 * @param token - current usage token
 * @returns JSON object
 */
export const appAuthenticateResponse = (publicKey: string, formData: AppResponse) => {
  return new Promise((resolve, reject) => {
    makePostRequest(process.env.API_ENDPOINT + '/completeLWIAuth', formData)
      .then((response: Response) => resolve(response.json()))
      .catch(err => reject(err))
  })
}
