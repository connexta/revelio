import DateFnsUtils from '@date-io/date-fns'
const dateUtil = new DateFnsUtils()

// copied from Common.js in DDF
export const getFileSize = item => {
  if (item == undefined || item == null) {
    return ''
  }
  const givenProductSize = item.replace(/[,]+/g, '').trim()
  //remove any commas and trailing whitespace
  const bytes = parseInt(givenProductSize, 10)
  const noUnitsGiven = /[0-9]$/
  //number without a word following
  const reformattedProductSize = givenProductSize.replace(/\s\s+/g, ' ')
  //remove extra whitespaces
  const finalFormatProductSize = reformattedProductSize.replace(
    /([0-9])([a-zA-Z])/g,
    '$1 $2'
  )
  //make sure there is exactly one space between number and unit
  const sizeArray = finalFormatProductSize.split(' ')
  //splits size into number and unit
  if (isNaN(bytes)) {
    return 'Unknown Size'
  }
  if (noUnitsGiven.test(givenProductSize)) {
    //need to parse number given and add units, number is assumed to be bytes
    let size,
      index,
      type = ['bytes', 'KB', 'MB', 'GB', 'TB']
    if (bytes === 0) {
      return '0 bytes'
    } else {
      index = Math.floor(Math.log(bytes) / Math.log(1024))
      if (index > 4) {
        index = 4
      }
      size = (bytes / Math.pow(1024, index)).toFixed(index < 2 ? 0 : 1)
    }
    return size + ' ' + type[index]
  } else {
    //units were included with size
    switch (sizeArray[1].toLowerCase()) {
      case 'bytes':
        return sizeArray[0] + ' bytes'
      case 'b':
        return sizeArray[0] + ' bytes'
      case 'kb':
        return sizeArray[0] + ' KB'
      case 'kilobytes':
        return sizeArray[0] + ' KB'
      case 'kbytes':
        return sizeArray[0] + ' KB'
      case 'mb':
        return sizeArray[0] + ' MB'
      case 'megabytes':
        return sizeArray[0] + ' MB'
      case 'mbytes':
        return sizeArray[0] + ' MB'
      case 'gb':
        return sizeArray[0] + ' GB'
      case 'gigabytes':
        return sizeArray[0] + ' GB'
      case 'gbytes':
        return sizeArray[0] + ' GB'
      case 'tb':
        return sizeArray[0] + ' TB'
      case 'terabytes':
        return sizeArray[0] + ' TB'
      case 'tbytes':
        return sizeArray[0] + ' TB'
      default:
        return 'Unknown Size'
    }
  }
}

export const isDate = value => {
  return dateUtil.isValid(value)
}

export const formatDateString = (dateString, format) => {
  if (isDate(dateString)) {
    const date = dateUtil.date(dateString)
    return dateUtil.format(date, format)
  }
  return 'Invalid Date'
}
