const getArtwork = async (node, config) => {
    return await node.exportAsync(config);
};
const main = async () => {
    if (figma.currentPage.selection && figma.currentPage.selection.length > 0) {
        figma.showUI(__html__, { visible: false });
        const selected = figma.currentPage.selection[0];
        const exportSettings = [
            {
                format: 'PNG',
                suffix: '',
                constraint: { type: 'SCALE', value: 1 },
                contentsOnly: true,
            },
            {
                format: 'PNG',
                suffix: '',
                constraint: { type: 'SCALE', value: 1 },
                contentsOnly: true,
            },
            {
                format: 'PNG',
                suffix: '',
                constraint: { type: 'SCALE', value: 1 },
                contentsOnly: true,
            },
        ];
        const exportableBytes = await Promise.all(exportSettings.map(async (setting) => {
            return {
                name: selected.name,
                setting: setting,
                bytes: await selected.exportAsync(setting),
            };
        }));
        figma.ui.postMessage({ exportableBytes });
    }
    else {
        figma.closePlugin('Need to select a layer.');
    }
};
main();
figma.ui.onmessage = msg => {
    figma.closePlugin(msg);
};
