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
