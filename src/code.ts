type Art = {
  node: SceneNode
  data: Uint8Array
}

type ExportFileSettings =
  | ExportSettingsImage
  | ExportSettingsPDF
  | ExportSettingsSVG

type Asset = {
  name: string
  setting: ExportSetting
  bytes: Uint8Array
}

type ExportSetting = {
  dir: string
  fileSetting: ExportFileSettings
}

const exportSettings: ExportSetting[] = [
  {
    dir: 'iOS/pdf',
    fileSetting: {
      format: 'PDF',
      suffix: '',
      contentsOnly: true,
    },
  },
  {
    dir: 'iOS/png',
    fileSetting: {
      format: 'PNG',
      suffix: '',
      constraint: { type: 'SCALE', value: 1 },
      contentsOnly: true,
    },
  },
  {
    dir: 'iOS/png',
    fileSetting: {
      format: 'PNG',
      suffix: '@2x',
      constraint: { type: 'SCALE', value: 2 },
      contentsOnly: true,
    },
  },
  {
    dir: 'iOS/png',
    fileSetting: {
      format: 'PNG',
      suffix: '@3x',
      constraint: { type: 'SCALE', value: 3 },
      contentsOnly: true,
    },
  },
  {
    dir: 'iOS/jpg',
    fileSetting: {
      format: 'JPG',
      suffix: '',
      constraint: { type: 'SCALE', value: 1 },
      contentsOnly: true,
    },
  },
  {
    dir: 'iOS/jpg',
    fileSetting: {
      format: 'JPG',
      suffix: '@2x',
      constraint: { type: 'SCALE', value: 2 },
      contentsOnly: true,
    },
  },
  {
    dir: 'iOS/jpg',
    fileSetting: {
      format: 'JPG',
      suffix: '@3x',
      constraint: { type: 'SCALE', value: 3 },
      contentsOnly: true,
    },
  },
  {
    dir: 'Android/svg',
    fileSetting: {
      format: 'SVG',
      suffix: '',
      contentsOnly: true,
    },
  },
  {
    dir: 'Android/png/drawable-mdpi',
    fileSetting: {
      format: 'PNG',
      suffix: '',
      constraint: { type: 'SCALE', value: 1 },
      contentsOnly: true,
    },
  },
  {
    dir: 'Android/png/drawable-hdpi',
    fileSetting: {
      format: 'PNG',
      suffix: '',
      constraint: { type: 'SCALE', value: 1.5 },
      contentsOnly: true,
    },
  },
  {
    dir: 'Android/png/drawable-xdpi',
    fileSetting: {
      format: 'PNG',
      suffix: '',
      constraint: { type: 'SCALE', value: 2 },
      contentsOnly: true,
    },
  },
  {
    dir: 'Android/png/drawable-xxdpi',
    fileSetting: {
      format: 'PNG',
      suffix: '',
      constraint: { type: 'SCALE', value: 3 },
      contentsOnly: true,
    },
  },
  {
    dir: 'Android/png/drawable-xxxdpi',
    fileSetting: {
      format: 'PNG',
      suffix: '',
      constraint: { type: 'SCALE', value: 4 },
      contentsOnly: true,
    },
  },
  {
    dir: 'Android/jpg/drawable-mdpi',
    fileSetting: {
      format: 'JPG',
      suffix: '',
      constraint: { type: 'SCALE', value: 1 },
      contentsOnly: true,
    },
  },
  {
    dir: 'Android/jpg/drawable-hdpi',
    fileSetting: {
      format: 'JPG',
      suffix: '',
      constraint: { type: 'SCALE', value: 1.5 },
      contentsOnly: true,
    },
  },
  {
    dir: 'Android/jpg/drawable-xdpi',
    fileSetting: {
      format: 'JPG',
      suffix: '',
      constraint: { type: 'SCALE', value: 2 },
      contentsOnly: true,
    },
  },
  {
    dir: 'Android/jpg/drawable-xxdpi',
    fileSetting: {
      format: 'JPG',
      suffix: '',
      constraint: { type: 'SCALE', value: 3 },
      contentsOnly: true,
    },
  },
  {
    dir: 'Android/jpg/drawable-xxxdpi',
    fileSetting: {
      format: 'JPG',
      suffix: '',
      constraint: { type: 'SCALE', value: 4 },
      contentsOnly: true,
    },
  },
]

const main = async () => {
  if (figma.currentPage.selection && figma.currentPage.selection.length > 0) {
    figma.showUI(__html__, { visible: false })
    const selected = figma.currentPage.selection[0]
    const exportAssets: Asset[] = await Promise.all(
      exportSettings.map(async setting => {
        return {
          name: selected.name,
          setting: setting,
          bytes: await selected.exportAsync(setting.fileSetting),
        }
      }),
    )

    figma.ui.postMessage({ exportAssets })
  } else {
    figma.closePlugin('Need to select a layer.')
  }
}

main()
figma.ui.onmessage = msg => {
  figma.closePlugin(msg)
}
