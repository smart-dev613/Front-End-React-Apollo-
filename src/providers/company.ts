import { graphQLManual } from "./core/common"

/**
 * Gets single company\
 * @param companyId - company ID
 * @returns JSON object
 */

export const getCompany = (id: string) => {
  return new Promise((resolve, reject) => {
    const query = `
      {
        getCompanyById(data: {
          companyID: "${id}"
        })
      }
    `

    graphQLManual({
      query
    })
      .then((response: Response) => {
        resolve(response.json())
      })
      .catch(err => reject(err))
  })
}