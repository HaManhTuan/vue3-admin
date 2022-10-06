import Cookies from 'js-cookie'

const TokenKey = 'Authorization'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token, cookiesName, minutes = 0) {
  if (minutes !== 0) {
    const time = new Date(new Date().getTime() + minutes * 60 * 1000)
    return Cookies.set(cookiesName, token, { expires: time })
  }
  return Cookies.set(cookiesName, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
