type Art = {
  node: SceneNode
  data: Uint8Array
}

type ExportSetting = ExportSettingsImage | ExportSettingsPDF | ExportSettingsSVG

type ExportableBytes = {
  name: string
  setting: ExportSetting
  bytes: Uint8Array
}

const getArtwork = async (
  node: SceneNode,
  config: ExportSetting,
): Promise<Uint8Array> => {
  return await node.exportAsync(config)
}

const main = async () => {
  if (figma.currentPage.selection && figma.currentPage.selection.length > 0) {
    figma.showUI(__html__, { visible: false })
    const selected = figma.currentPage.selection[0]
    const exportSettings: ExportSetting[] = [
      {
        format: 'PNG',
        suffix: '@1x',
        constraint: { type: 'SCALE', value: 1 },
        contentsOnly: true,
      },
      {
        format: 'PNG',
        suffix: '@2x',
        constraint: { type: 'SCALE', value: 2 },
        contentsOnly: true,
      },
      {
        format: 'PNG',
        suffix: '@3x',
        constraint: { type: 'SCALE', value: 3 },
        contentsOnly: true,
      },
    ]

    const exportableBytes: ExportableBytes[] = await Promise.all(
      exportSettings.map(async setting => {
        return {
          name: selected.name,
          setting: setting,
          bytes: await selected.exportAsync(setting),
        }
      }),
    )

    figma.ui.postMessage({ exportableBytes })
  } else {
    figma.closePlugin('Need to select a layer.')
  }
}

main()
figma.ui.onmessage = msg => {
  figma.closePlugin(msg)
}
