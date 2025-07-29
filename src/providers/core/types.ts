/**
 * THIS FILE CONTAINS ALL TYPE DEFINITIONS FOR POST REQUESTS TO OUR API.
 */

// @TODO - get rid of the any's! GC 160819
export interface Options {
  signal?: any
  method?: string
  credentials?: any
  headers?: any
  body?: string
}

export interface AppResponse {
  response: boolean
  token: string
}
