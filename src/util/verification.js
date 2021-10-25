import {DBC2SBC} from './string'

export const checkNormal = (val, maxLength) => {
  if (val.length > 0) {
    let string = DBC2SBC(val).trim()
    if (string.length > 0 && string.length <= maxLength) {
      return string
    } else {
      return false
    }
  }
  else {
    return false
  }
}
