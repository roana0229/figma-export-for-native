// import JSZip from 'jszip'
// import JSZip from './jszip.min.js'
import JSZip from '../node_modules/jszip/dist/jszip.min.js';
const typedArrayToBuffer = (array) => {
    return array.buffer.slice(array.byteOffset, array.byteLength + array.byteOffset);
};
const exportTypeToBlobType = (type) => {
    switch (type) {
        case 'PDF':
            return 'application/pdf';
        case 'SVG':
            return 'image/svg+xml';
        case 'PNG':
            return 'image/png';
        case 'JPG':
            return 'image/jpeg';
        default:
            return 'image/png';
    }
};
const exportTypeToFileExtension = (type) => {
    switch (type) {
        case 'PDF':
            return '.pdf';
        case 'SVG':
            return '.svg';
        case 'PNG':
            return '.png';
        case 'JPG':
            return '.jpg';
        default:
            return '.png';
    }
};
window.onmessage = async (event) => {
    const { exportableBytes } = event.data.pluginMessage;
    return new Promise(resolve => {
        let zip = new JSZip();
        for (let data of exportableBytes) {
            console.dir(data);
            const { bytes, name, setting } = data;
            const cleanBytes = typedArrayToBuffer(bytes);
            const type = exportTypeToBlobType(setting.format);
            const extension = exportTypeToFileExtension(setting.format);
            let blob = new Blob([cleanBytes], { type });
            // zip.file(`${name}${setting.suffix}${extension}`, blob, { base64: true })
        }
        // zip.generateAsync({ type: 'blob' }).then((content: Blob) => {
        //   const blobURL = window.URL.createObjectURL(content)
        //   const link = document.createElement('a')
        //   link.className = 'button button--primary'
        //   link.href = blobURL
        //   link.download = 'export.zip'
        //   link.click()
        //   link.setAttribute('download', name + '.zip')
        //   resolve()
        // })
        resolve();
    }).then(() => {
        window.parent.postMessage({ pluginMessage: 'Ready for download.' }, '*');
    });
};
// const encode = async (canvas: any, ctx: any, imageData: any): Promise<any> => {
//   ctx.putImageData(imageData, 0, 0)
//   return await new Promise((resolve, reject) => {
//     canvas.toBlob((blob: any) => {
//       resolve(blob)
//     })
//   })
// }
// const decode = async (canvas: any, ctx: any, bytes: any): Promise<any> => {
//   const url = URL.createObjectURL(new Blob([bytes]))
//   const image = await new Promise<HTMLImageElement>((resolve, reject) => {
//     const img = new Image()
//     img.onload = () => resolve(img)
//     img.onerror = () => reject()
//     img.src = url
//   })
//   canvas.width = image.width
//   canvas.height = image.height
//   ctx.drawImage(image, 0, 0)
//   const imageData = ctx.getImageData(0, 0, image.width, image.height)
//   return imageData
// }
// window.onmessage = async (event: any) => {
//   return new Promise(async resolve => {
//     const canvas = document.createElement('canvas')
//     const ctx = canvas.getContext('2d')
//     const { exportableBytes } = event.data.pluginMessage
//     const { bytes, name, setting } = exportableBytes[0]
//     const imageData = await decode(canvas, ctx, bytes)
//     const newBytes = await encode(canvas, ctx, imageData)
//     resolve(URL.createObjectURL(newBytes))
//   })
//     .then((url: any) => {
//       const link = document.createElement('a')
//       link.className = 'button button--primary'
//       link.href = url
//       link.download = 'export.zip'
//       link.click()
//       link.setAttribute('download', name + '.jpg')
//     })
//     .then(() => {
//       window.parent.postMessage({ pluginMessage: 'Ready for download.' }, '*')
//     })
// }
