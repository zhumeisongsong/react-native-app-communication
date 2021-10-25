/**
 * string helper
 */
export const formatDate = (originDate) => {
  let date = new Date(originDate)
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let hour = date.getHours()
  let minutes = date.getMinutes()

  if (month < 10) {
    month = "0" + month
  }
  if (day < 10) {
    day = "0" + day
  }
  if (hour < 10) {
    hour = "0" + hour
  }
  if (minutes < 10) {
    minutes = "0" + minutes
  }

  let formatDate = year + "-" + month + "-" + day + " " + hour + ":" + minutes
  return formatDate
}

export const DBC2SBC = (string) => {
  if (string) {
    let result = ""
    let len = string.length
    for (let i = 0; i < len; i++) {
      let cCode = string.charCodeAt(i)
      cCode = (cCode >= 0xFF01 && cCode <= 0xFF5E) ? (cCode - 65248) : cCode
      cCode = (cCode === 0x03000) ? 0x0020 : cCode
      result += String.fromCharCode(cCode)
    }
    return result
  }
}
