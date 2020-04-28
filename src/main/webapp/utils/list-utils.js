export const reorderList = (list, startIndex, endIndex) => {
  const newOne = list.filter((_, index) => index !== startIndex)

  newOne.splice(endIndex, 0, list[startIndex])

  return newOne
}
