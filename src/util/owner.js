import _UA from '../consist/UA'

export const getToken = () => {
  let token
  if (_UA.isAndroid) {
    token = window.callAndroid['fetchToken']()
  } else if (_UA.isIOS) {
    token = localStorage.getItem('token')
  }
  return token
}

export const isLogin = () => {
  let token = getToken() || ''
  return token !== ''
}