async function getArtwork () { 
  var selected = figma.currentPage.selection[0]; 
  if (!selected) return; 
  try { 
    return selected.exportAsync({
      format: 'PNG',
      constraint: { type: "SCALE", value: 2 }
    })
    .then(data => { return { selected, data }; })
    .catch(e => { return e; }); }
  catch (err) { return err }
}

figma.showUI(__html__, { visible: false })
getArtwork().then(result => {
  figma.ui.postMessage({ data: result.data, type: 'image' })
})

figma.ui.onmessage = msg => {
  figma.closePlugin(msg)
}