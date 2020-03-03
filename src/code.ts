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
  command: string[]
  fileSetting: ExportFileSettings
}

const exportSettings: ExportSetting[] = [
  {
    dir: 'iOS/pdf/',
    command: ['ios_pdf', 'ios_all'],
    fileSetting: {
      format: 'PDF',
      suffix: '',
      contentsOnly: true,
    },
  },
  {
    dir: 'iOS/png/',
    command: ['ios_png', 'ios_all'],
    fileSetting: {
      format: 'PNG',
      suffix: '',
      constraint: { type: 'SCALE', value: 1 },
      contentsOnly: true,
    },
  },
  {
    dir: 'iOS/png/',
    command: ['ios_png', 'ios_all'],
    fileSetting: {
      format: 'PNG',
      suffix: '@2x',
      constraint: { type: 'SCALE', value: 2 },
      contentsOnly: true,
    },
  },
  {
    dir: 'iOS/png/',
    command: ['ios_png', 'ios_all'],
    fileSetting: {
      format: 'PNG',
      suffix: '@3x',
      constraint: { type: 'SCALE', value: 3 },
      contentsOnly: true,
    },
  },
  {
    dir: 'iOS/jpg/',
    command: ['ios_jpg', 'ios_all'],
    fileSetting: {
      format: 'JPG',
      suffix: '',
      constraint: { type: 'SCALE', value: 1 },
      contentsOnly: true,
    },
  },
  {
    dir: 'iOS/jpg/',
    command: ['ios_jpg', 'ios_all'],
    fileSetting: {
      format: 'JPG',
      suffix: '@2x',
      constraint: { type: 'SCALE', value: 2 },
      contentsOnly: true,
    },
  },
  {
    dir: 'iOS/jpg/',
    command: ['ios_jpg', 'ios_all'],
    fileSetting: {
      format: 'JPG',
      suffix: '@3x',
      constraint: { type: 'SCALE', value: 3 },
      contentsOnly: true,
    },
  },
  {
    dir: 'Android/svg/',
    command: ['android_svg', 'android_all'],
    fileSetting: {
      format: 'SVG',
      suffix: '',
      contentsOnly: true,
    },
  },
  {
    dir: 'Android/png/drawable-mdpi/',
    command: ['android_png', 'android_all'],
    fileSetting: {
      format: 'PNG',
      suffix: '',
      constraint: { type: 'SCALE', value: 1 },
      contentsOnly: true,
    },
  },
  {
    dir: 'Android/png/drawable-hdpi/',
    command: ['android_png', 'android_all'],
    fileSetting: {
      format: 'PNG',
      suffix: '',
      constraint: { type: 'SCALE', value: 1.5 },
      contentsOnly: true,
    },
  },
  {
    dir: 'Android/png/drawable-xdpi/',
    command: ['android_png', 'android_all'],
    fileSetting: {
      format: 'PNG',
      suffix: '',
      constraint: { type: 'SCALE', value: 2 },
      contentsOnly: true,
    },
  },
  {
    dir: 'Android/png/drawable-xxdpi/',
    command: ['android_png', 'android_all'],
    fileSetting: {
      format: 'PNG',
      suffix: '',
      constraint: { type: 'SCALE', value: 3 },
      contentsOnly: true,
    },
  },
  {
    dir: 'Android/png/drawable-xxxdpi/',
    command: ['android_png', 'android_all'],
    fileSetting: {
      format: 'PNG',
      suffix: '',
      constraint: { type: 'SCALE', value: 4 },
      contentsOnly: true,
    },
  },
  {
    dir: 'Android/jpg/drawable-mdpi/',
    command: ['android_jpg', 'android_all'],
    fileSetting: {
      format: 'JPG',
      suffix: '',
      constraint: { type: 'SCALE', value: 1 },
      contentsOnly: true,
    },
  },
  {
    dir: 'Android/jpg/drawable-hdpi/',
    command: ['android_jpg', 'android_all'],
    fileSetting: {
      format: 'JPG',
      suffix: '',
      constraint: { type: 'SCALE', value: 1.5 },
      contentsOnly: true,
    },
  },
  {
    dir: 'Android/jpg/drawable-xdpi/',
    command: ['android_jpg', 'android_all'],
    fileSetting: {
      format: 'JPG',
      suffix: '',
      constraint: { type: 'SCALE', value: 2 },
      contentsOnly: true,
    },
  },
  {
    dir: 'Android/jpg/drawable-xxdpi/',
    command: ['android_jpg', 'android_all'],
    fileSetting: {
      format: 'JPG',
      suffix: '',
      constraint: { type: 'SCALE', value: 3 },
      contentsOnly: true,
    },
  },
  {
    dir: 'Android/jpg/drawable-xxxdpi/',
    command: ['android_jpg', 'android_all'],
    fileSetting: {
      format: 'JPG',
      suffix: '',
      constraint: { type: 'SCALE', value: 4 },
      contentsOnly: true,
    },
  },
]

const main = async (command: string) => {
  if (figma.currentPage.selection && figma.currentPage.selection.length > 0) {
    figma.showUI(__html__, { visible: false })
    const selected = figma.currentPage.selection[0]
    const exportAssets: Asset[] = await Promise.all(
      exportSettings
        .filter(setting => setting.command.includes(command))
        .map(async setting => {
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

main(figma.command)
figma.ui.onmessage = msg => {
  figma.closePlugin(msg)
}
