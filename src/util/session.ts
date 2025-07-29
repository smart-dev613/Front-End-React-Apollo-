import Cookies from 'js-cookie'

function parseJwt(token: string | undefined) {
  if (!token) {
    return
  }
  const base64Url = token.split(".")[1]
  const base64 = base64Url.replace("-", "+").replace("_", "/")
  return JSON.parse(window.atob(base64))
}

export async function parseFenixToken() {
  try {
    const token = Cookies.get("FenixToken")
    // console.log('token', token)
    if (!token) {
      console.log('Missing FenixToken')
      return false
    }

    const parsedToken = parseJwt(token)
    if (!parsedToken || !parsedToken.token) {
      console.log('Failed to parse FenixToken or missing token inside')
      return false
    }

    // console.log('parsed token', parsedToken)

    return parsedToken
  } catch (err) {
    console.error(err)
    return false
  }
}

export async function parseCurrentCompany() {
  try {
    const token = Cookies.get("CurrentCompany")
    // console.log('company token', token)
    if (!token) {
      return false
    }

    const parsedToken = parseJwt(token)
    if (!parsedToken) {
      return false
    }

    // console.log('parsed company', parsedToken)

    return parsedToken
  } catch (err) {
    console.error(err)
    return false
  }
}