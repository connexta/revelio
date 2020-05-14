const escapeRegExp = (string: string) => {
  return string.replace(/[*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}

const getAppropriateString = (str: string, matchcase?: boolean) => {
  str = str.toString()
  return matchcase === true ? str : str.toLowerCase()
}

const getWords = (str: string, matchcase?: boolean) => {
  //Handle camelcase
  str = str.replace(/([A-Z])/g, ' $1')
  str = getAppropriateString(str, matchcase)
  //Handle dashes, dots, and spaces
  return str.split(/[-.\s]+/)
}

const wordStartsWithFilter = (words: string[], filterText: string) => {
  return words.find((word) => word.indexOf(filterText) === 0)
}

const matchesFilter = (options: {
  filterText: string
  str: string
  matchcase?: boolean
}) => {
  let { filterText: filterText, str } = options
  const { matchcase } = options
  filterText = getAppropriateString(filterText, matchcase)

  filterText = escapeRegExp(filterText)
  str = escapeRegExp(str)
  const reg = new RegExp('\\b' + filterText + '.*')
  if (getAppropriateString(str, matchcase).match(reg) !== null) {
    return true
  }
  return (
    wordStartsWithFilter(getWords(str, matchcase), filterText) !== undefined
  )
}
export default matchesFilter
