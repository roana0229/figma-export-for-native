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

const contentsJson = (name: string, extension: string): string => {
  if (extension === '.pdf') {
    return JSON.stringify(
      {
        images: [
          {
            idiom: 'universal',
            filename: `${name}.pdf`,
            scale: '1x',
          },
          {
            idiom: 'universal',
            scale: '2x',
          },
          {
            idiom: 'universal',
            scale: '3x',
          },
        ],
        info: {
          version: 1,
          author: 'xcode',
        },
        properties: {
          'preserves-vector-representation': true,
        },
      },
      null,
      2,
    )
  } else {
    return JSON.stringify(
      {
        images: [
          {
            idiom: 'universal',
            filename: `${name}${extension}`,
            scale: '1x',
          },
          {
            idiom: 'universal',
            filename: `${name}@2x${extension}`,
            scale: '2x',
          },
          {
            idiom: 'universal',
            filename: `${name}@3x${extension}`,
            scale: '3x',
          },
        ],
        info: {
          version: 1,
          author: 'xcode',
        },
      },
      null,
      2,
    )
  }
}

window.onmessage = async (event: any) => {
  const { command, exportAssets } = event.data.pluginMessage

  await new Promise(resolve => {
    let zip = new JSZip()

    const isAllExports = command.includes('all')
    const isIOS = command.includes('ios')
    const { name } = exportAssets[0]
    const root = `${name}-${command.replace('_', '-')}`

    exportAssets.forEach((data: any) => {
      const { bytes, name, setting } = data
      const cleanBytes = typedArrayToBuffer(bytes)
      const type = exportTypeToBlobType(setting.fileSetting.format)
      const extension = exportTypeToFileExtension(setting.fileSetting.format)
      let blob = new Blob([cleanBytes], { type })
      let dir = setting.dir
      if (!isAllExports) {
        dir = dir.replace(/(png|jpg|pdf|svg)\//, '')
      }
      if (isIOS) {
        dir = `${dir}${name}.imageset/`
        zip.file(`${root}/${dir}Contents.json`, contentsJson(name, extension))
      }
      zip.file(
        `${root}/${dir}${name}${setting.fileSetting.suffix}${extension}`,
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
      link.download = `${root}.zip`
      link.click()
      setTimeout(() => {
        resolve()
      }, 600)
    })
  })
  window.parent.postMessage({ pluginMessage: 'Ready for download.' }, '*')
}
