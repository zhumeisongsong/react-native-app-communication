/**
 * array helper
 */
export const removeByValue = (arr, val) => {
  for (let i of arr) {
    if (i === val) {
      arr.splice(i, 1);
      break;
    }
  }
  return arr
}

export const toString = (arr, divider) => {
  return arr.join(divider)
}