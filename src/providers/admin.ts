import { graphQLManual } from "./core/common"

// export const getCompaniesBySearchtermGQL = (searchterm: any) => {
//   return new Promise((resolve, reject) => {
//     const requestPayload = {
//       query: `
//         {
//           getCompanyBySearch(query: "${searchterm}")
//         }
//       `
//     }

//     fetch(process.env.GRAPHQL_ENDPOINT, {
//       method: 'POST',
//       mode: 'cors',
//       credentials: 'include',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(requestPayload)
//     })
//       .then((response) => {
//         resolve(response.json())
//       })
//       .catch((err) => {
//         console.log(err)
//         reject(err)
//       })
//   })
// }

export const getCompaniesBySearchtermGQL = (searchterm: any) => {
  return new Promise((resolve, reject) => {
  
    const query = `
      {
          getCompanyBySearch(query: "${searchterm}")
        }
        `
  
    graphQLManual({
      query
    })
      .then((response: Response) => {
        resolve(response.json())
      })
      .catch((err: any) => reject(err))
  })
}