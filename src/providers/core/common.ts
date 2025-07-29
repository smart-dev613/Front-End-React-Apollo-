import { Options } from './types'

/**
 * Main API call wrapper
 * In most cases, should not be called directly
 * @param endpoint - API endpoint to hit
 * @param options - Options to use
 * @param timeout - Request timeout
 */
export default function apiCallWrapper (endpoint: string, options: Options = {}, timeout: number) {

  return new Promise((resolve, reject) => {

      let AC = new AbortController()

      options['signal'] = AC.signal

      let timeoutTimer = setTimeout(() => {
        AC.abort()
      }, timeout)

      fetch(endpoint, options)
      .then(result => {

        clearTimeout(timeoutTimer)
        
        return result
      })
      .then(result => resolve(result))
      .catch(err => reject(err))
  })
}

/**
 * Make a simple POST request
 * @param endpoint - API endpoint to hit
 * @param body - Request body, which will be JSON.stringify'd
 * @param options - Any additional options to use
 * @param timeout - Request timeout
 * @returns {Response}
 */
export function makePostRequest (endpoint: string, body: any, options = {}, timeout: any = process.env.REQUEST_TIMEOUT) {
  return new Promise((resolve, reject) => {
    return apiCallWrapper(endpoint, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(body),
      ...options
    }, timeout)
      .then((response: Response) => {

        return resolve(response)

      })
      .catch(err => reject(err))
  })
}

/**
 * Make a simple GET request
 * @param endpoint - API endpoint to hit
 * @param options - Any additional options to use
 * @param timeout - Request timeout
 * @returns {Response}
 */
export function makeGetRequest (endpoint: string, options = {}, timeout: any = process.env.REQUEST_TIMEOUT) {
  return new Promise((resolve, reject) => {
    return apiCallWrapper(endpoint, {
      method: 'GET',
      credentials: 'include',
      ...options
    }, timeout)
      .then((response: Response) => resolve(response))
      .catch(err => reject(err))
  })
}

export function graphQLManual (body: any, timeout: any = process.env.REQUEST_TIMEOUT) {
  return new Promise((resolve, reject) => {
    // console.log("endpoint", process.env.GRAPHQL_ENDPOINT)
    
    return apiCallWrapper(process.env.GRAPHQL_ENDPOINT, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(body)
    }, timeout)
      .then((response) => {
        console.log("graphQLManual->response: ", JSON.stringify(response))
        return resolve(response)
      })
      .catch(err => {
        console.log("graphQLManual->err: ", err)
        return reject(err)
  })
  })
} 

export function uploadPresignedS3 (url: string, file: any,  timeout: any = 10000) {
  return new Promise((resolve, reject) => {
    // @ts-ignore
    return apiCallWrapper(url, {
      method: 'PUT',
      // @ts-ignore
      headers: {'Content-Type': file.type},
      // @ts-ignore
      body: file
    }, timeout)
    // @ts-ignore
      .then((response: Response) => resolve(response))
      // @ts-ignore
      .catch(err => reject(err))
  })
}