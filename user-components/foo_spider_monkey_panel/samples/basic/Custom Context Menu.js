window.DefineScript('Custom context menu', { author: 'T.P Wang / marc2003' });
include('docs/Flags.js');

function on_mouse_lbtn_down(x, y) {
    let _context = fb.CreateContextMenuManager();
    let _basemenu = window.CreatePopupMenu();
    let _child = window.CreatePopupMenu();

    // start index at 1, NOT 0
    _basemenu.AppendMenuItem(MF_STRING, 1, 'item1');
    _basemenu.AppendMenuItem(MF_STRING, 2, 'item2');
    if (fb.GetNowPlaying()) {
        _child.AppendTo(_basemenu, MF_STRING, 'Now Playing');
    }
    
    _context.InitNowPlaying();
    _context.BuildMenu(_child, 3);

    const idx = _basemenu.TrackPopupMenu(x, y);
    
    switch (idx) {
        case 0: //user dismissed menu by clicking elsewhere. that's why you can't use 0 when building menu items
            break;
        case 1:
            fb.ShowPopupMessage('You have chosen item1.');
            break;
        case 2:
            fb.ShowPopupMessage('OK, item2 is clicked.');
            break;
        default:
            _context.ExecuteByID(idx - 3);
            break;
    }
}
