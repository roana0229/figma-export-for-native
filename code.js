var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function getArtwork() {
    return __awaiter(this, void 0, void 0, function* () {
        var selected = figma.currentPage.selection[0];
        if (!selected)
            return;
        try {
            return selected.exportAsync({
                format: 'PNG',
                constraint: { type: "SCALE", value: 2 }
            })
                .then(data => { return { selected, data }; })
                .catch(e => { return e; });
        }
        catch (err) {
            return err;
        }
    });
}
figma.showUI(__html__, { visible: false });
getArtwork().then(result => {
    figma.ui.postMessage({ data: result.data, type: 'image' });
});
figma.ui.onmessage = msg => {
    figma.closePlugin(msg);
};
