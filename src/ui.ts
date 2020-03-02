const encode = async (canvas: any, ctx: any, imageData: any): Promise<any> => {
  ctx.putImageData(imageData, 0, 0)
  return await new Promise((resolve, reject) => {
    canvas.toBlob((blob: any) => {
      resolve(blob)
    })
  })
}

const decode = async (canvas: any, ctx: any, bytes: any): Promise<any> => {
  const url = URL.createObjectURL(new Blob([bytes]))
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject()
    img.src = url
  })
  canvas.width = image.width
  canvas.height = image.height
  ctx.drawImage(image, 0, 0)
  const imageData = ctx.getImageData(0, 0, image.width, image.height)
  return imageData
}

window.onmessage = async (event: any) => {
  return new Promise(async resolve => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const resultArt = event.data.pluginMessage.data
    const imageData = await decode(canvas, ctx, resultArt)
    const newBytes = await encode(canvas, ctx, imageData)
    resolve(URL.createObjectURL(newBytes))
  })
    .then((url: any) => {
      const link = document.createElement('a')
      link.className = 'button button--primary'
      link.href = url
      link.download = 'export.zip'
      link.click()
      link.setAttribute('download', name + '.zip')
    })
    .then(() => {
      window.parent.postMessage({ pluginMessage: 'Completed' }, '*')
    })
}
