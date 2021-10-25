import _UA from '../consist/UA'

/**
 * functions with native
 */
const formatParams = (actionType, data) => {
  const params = {
    "method": actionType,
    "data": data
  }
  return JSON.stringify(params)
}
const callNative = (actionType, data) => {
  let params = formatParams(actionType, data)
  if (_UA.isAndroid) {
    window.callAndroid[actionType](params)
  } else if (_UA.isIOS) {
    window.webkit.messageHandlers[actionType].postMessage(params)
  }
}

export default callNative

