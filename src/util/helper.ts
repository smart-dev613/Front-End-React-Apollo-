/**
 * Returns true if we're in a staging environment
 */
export const isStaging = () => {
  console.log('env is', process.env.REACT_APP_INS_ENV)
  return process.env.REACT_APP_INS_ENV === 'staging'
}