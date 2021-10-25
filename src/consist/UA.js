const ua = navigator.userAgent
const isIOS = /iphone|ipod|ipad/i.test(ua)
const isAndroid = /android/i.test(ua)
const iOSAgent = /shihou.ios/
const androidAgent = /shihou.android/
const isWebview = iOSAgent.test(ua) || androidAgent.test(ua)

const iOSVersion = isIOS ? function () {
  let matchData = ua.match(/OS ([0-9]+)/)
  if (matchData) {
    return parseInt(matchData[1])
  } else {
    return null
  }
}() : null

const androidVersion = isAndroid ? function () {
  let matchData = ua.toLowerCase().match(/android\s([0-9\.]*)/)
  if (matchData) {
    return parseInt(matchData[1])
  } else {
    return null
  }
}() : null

export default{
  isIOS: isIOS,
  isAndroid: isAndroid,
  isSP: isIOS || isAndroid,
  iOSVersion: iOSVersion,
  androidVersion: androidVersion,
  isWebview: isWebview
}
