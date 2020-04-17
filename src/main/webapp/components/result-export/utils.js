export const getResultSetCql = results => {
  const ids = results.map(result => result.attributes.id)
  const queries = ids.map(id => `(("id" ILIKE '${id}'))`)
  return `(${queries.join(' OR ')})`
}

export const getSources = results => {
  return Array.from(new Set(results.map(result => result.sourceId)))
}

export const saveFile = async (type, fileName, buffer) => {
  const blob = new Blob([new Uint8Array(buffer.data)], {
    type,
  })
  const url = window.URL.createObjectURL(blob)
  let downloadLink = document.createElement('a')
  downloadLink.href = url
  downloadLink.setAttribute('download', fileName)
  downloadLink.click()
  window.URL.revokeObjectURL(url)
  downloadLink.remove()
}
