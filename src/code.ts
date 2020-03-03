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
    dir: 'pdf/',
    command: ['ios_pdf', 'ios_all'],
    fileSetting: {
      format: 'PDF',
      suffix: '',
      contentsOnly: true,
    },
  },
  {
    dir: 'png/',
    command: ['ios_png', 'ios_all'],
    fileSetting: {
      format: 'PNG',
      suffix: '',
      constraint: { type: 'SCALE', value: 1 },
      contentsOnly: true,
    },
  },
  {
    dir: 'png/',
    command: ['ios_png', 'ios_all'],
    fileSetting: {
      format: 'PNG',
      suffix: '@2x',
      constraint: { type: 'SCALE', value: 2 },
      contentsOnly: true,
    },
  },
  {
    dir: 'png/',
    command: ['ios_png', 'ios_all'],
    fileSetting: {
      format: 'PNG',
      suffix: '@3x',
      constraint: { type: 'SCALE', value: 3 },
      contentsOnly: true,
    },
  },
  {
    dir: 'jpg/',
    command: ['ios_jpg', 'ios_all'],
    fileSetting: {
      format: 'JPG',
      suffix: '',
      constraint: { type: 'SCALE', value: 1 },
      contentsOnly: true,
    },
  },
  {
    dir: 'jpg/',
    command: ['ios_jpg', 'ios_all'],
    fileSetting: {
      format: 'JPG',
      suffix: '@2x',
      constraint: { type: 'SCALE', value: 2 },
      contentsOnly: true,
    },
  },
  {
    dir: 'jpg/',
    command: ['ios_jpg', 'ios_all'],
    fileSetting: {
      format: 'JPG',
      suffix: '@3x',
      constraint: { type: 'SCALE', value: 3 },
      contentsOnly: true,
    },
  },
  {
    dir: 'svg/',
    command: ['android_svg', 'android_all'],
    fileSetting: {
      format: 'SVG',
      suffix: '',
      contentsOnly: true,
    },
  },
  {
    dir: 'png/drawable-mdpi/',
    command: ['android_png', 'android_all'],
    fileSetting: {
      format: 'PNG',
      suffix: '',
      constraint: { type: 'SCALE', value: 1 },
      contentsOnly: true,
    },
  },
  {
    dir: 'png/drawable-hdpi/',
    command: ['android_png', 'android_all'],
    fileSetting: {
      format: 'PNG',
      suffix: '',
      constraint: { type: 'SCALE', value: 1.5 },
      contentsOnly: true,
    },
  },
  {
    dir: 'png/drawable-xhdpi/',
    command: ['android_png', 'android_all'],
    fileSetting: {
      format: 'PNG',
      suffix: '',
      constraint: { type: 'SCALE', value: 2 },
      contentsOnly: true,
    },
  },
  {
    dir: 'png/drawable-xxhdpi/',
    command: ['android_png', 'android_all'],
    fileSetting: {
      format: 'PNG',
      suffix: '',
      constraint: { type: 'SCALE', value: 3 },
      contentsOnly: true,
    },
  },
  {
    dir: 'png/drawable-xxxhdpi/',
    command: ['android_png', 'android_all'],
    fileSetting: {
      format: 'PNG',
      suffix: '',
      constraint: { type: 'SCALE', value: 4 },
      contentsOnly: true,
    },
  },
  {
    dir: 'jpg/drawable-mdpi/',
    command: ['android_jpg', 'android_all'],
    fileSetting: {
      format: 'JPG',
      suffix: '',
      constraint: { type: 'SCALE', value: 1 },
      contentsOnly: true,
    },
  },
  {
    dir: 'jpg/drawable-hdpi/',
    command: ['android_jpg', 'android_all'],
    fileSetting: {
      format: 'JPG',
      suffix: '',
      constraint: { type: 'SCALE', value: 1.5 },
      contentsOnly: true,
    },
  },
  {
    dir: 'jpg/drawable-xhdpi/',
    command: ['android_jpg', 'android_all'],
    fileSetting: {
      format: 'JPG',
      suffix: '',
      constraint: { type: 'SCALE', value: 2 },
      contentsOnly: true,
    },
  },
  {
    dir: 'jpg/drawable-xxhdpi/',
    command: ['android_jpg', 'android_all'],
    fileSetting: {
      format: 'JPG',
      suffix: '',
      constraint: { type: 'SCALE', value: 3 },
      contentsOnly: true,
    },
  },
  {
    dir: 'jpg/drawable-xxxhdpi/',
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

    figma.ui.postMessage({ command, exportAssets })
  } else {
    figma.closePlugin('Need to select a layer.')
  }
}

main(figma.command)
figma.ui.onmessage = msg => {
  figma.closePlugin(msg)
}
