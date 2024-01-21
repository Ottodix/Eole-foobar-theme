window.DefineScript('Watch Metadb Change', { author: 'T.P Wang' });

// Callback
function on_metadb_changed(handle_list) {
    let count = handle_list.Count;
    // show how many files have been changed
    fb.ShowPopupMessage(count + (count === 1 ? ' file has' : ' files have') + ' been changed.');
}
