import JSZip from '../node_modules/jszip/dist/jszip.min.js'

const typedArrayToBuffer = (array: Uint8Array) => {
  return array.buffer.slice(
    array.byteOffset,
    array.byteLength + array.byteOffset,
  )
}

const exportTypeToBlobType = (type: string) => {
  switch (type) {
    case 'PDF':
      return 'application/pdf'
    case 'SVG':
      return 'image/svg+xml'
    case 'PNG':
      return 'image/png'
    case 'JPG':
      return 'image/jpeg'
    default:
      return 'image/png'
  }
}

const exportTypeToFileExtension = (type: string) => {
  switch (type) {
    case 'PDF':
      return '.pdf'
    case 'SVG':
      return '.svg'
    case 'PNG':
      return '.png'
    case 'JPG':
      return '.jpg'
    default:
      return '.png'
  }
}

window.onmessage = async (event: any) => {
  const { exportAssets } = event.data.pluginMessage

  await new Promise(resolve => {
    let zip = new JSZip()

    exportAssets.forEach((data: any) => {
      const { bytes, name, setting } = data
      const cleanBytes = typedArrayToBuffer(bytes)
      const type = exportTypeToBlobType(setting.fileSetting.format)
      const extension = exportTypeToFileExtension(setting.fileSetting.format)
      let blob = new Blob([cleanBytes], { type })
      zip.file(
        `${setting.dir}${name}${setting.fileSetting.suffix}${extension}`,
        blob,
        {
          base64: true,
        },
      )
    })

    zip.generateAsync({ type: 'blob' }).then((content: Blob) => {
      const blobURL = window.URL.createObjectURL(content)
      const link = document.createElement('a')
      link.href = blobURL
      const { name } = exportAssets[0]
      link.download = `${name}.zip`
      link.click()
      setTimeout(() => {
        resolve()
      }, 600)
    })
  })
  window.parent.postMessage({ pluginMessage: 'Ready for download.' }, '*')
}
