// This sample demonstrates a basic drag-n-drop implementation.
// Don't forget to open some playlist viewer to see all the performed actions.
//
// CTRL, SHIFT, ALT and their combination will modify the action
// that will be performed on item (you can try that by moving file in Windows Explorer).
//
// Warning: drag-n-drop is an advanced technique, so beware!
//

window.DefineScript('Drag n drop', { author: 'TheQwertiest', features: { drag_n_drop: true } });

include('docs/Flags.js');

const fso = new ActiveXObject('Scripting.FileSystemObject');
const font = gdi.Font('Segoe Ui', 12);
const g_drop_effect = {
    none:   0,
    copy:   1,
    move:   2,
    link:   4,
    scroll: 0x80000000
};

let ww, wh;

let mouse_in = false;
let mouse_down = false;
let mouse_on_item = false;

let last_pressed_coord = {};

let is_dragging = false;
let is_internal_drag_n_drop_active = false;

let status_text = 'Start dragging to or from the panel';
let status_text_2 = '';


////////////////////////////
// Callbacks
////////////////////////////

function on_paint(gr) {
    gr.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);
    
    gr.FillSolidRect(0, 60, ww/2, wh - 60, 0xFF83FFFF);
    gr.FillSolidRect(ww/2, 60, ww/2, wh - 60, 0xFFFF83FF);
    
    gr.DrawString(status_text, font, 0xFF000000, 0, 0, ww, 30, 0x11000000);
    gr.DrawString(status_text_2, font, 0xFF000000, 0, 30, ww, 30, 0x11000000);
    
    gr.DrawString('Drag from here or from outside', font, 0xFF000000, 0, 60, ww/2, wh - 60, 0x11000000);
    gr.DrawString('Drop here or outside', font, 0xFF000000, ww/2, 60, ww/2, wh - 60, 0x11000000);
}

function on_size(w,h) {
    ww = w;
    wh = h;
}

function on_mouse_move(x,y,m){
    if (!mouse_down) {
        return true;
    }

    if (!is_dragging && mouse_on_item) {
        let drag_diff = Math.sqrt((Math.pow(last_pressed_coord.x - x, 2) + Math.pow(last_pressed_coord.y - y, 2)));
        if (drag_diff >= 7) {
            last_pressed_coord = {
                x: undefined,
                y: undefined
            };

            perform_internal_drag_n_drop();
        }
    }

    return true;
}

function on_mouse_lbtn_down(x, y, m) {
    mouse_down = true;
    
    last_pressed_coord.x = x;
    last_pressed_coord.y = y;

    mouse_on_item = trace_start_zone(x,y);

    return true;
}

function on_mouse_lbtn_up(x, y, m) {   
    mouse_down = false;
    
    last_pressed_coord = {
        x: undefined,
        y: undefined
    };

    mouse_on_item = false;

    return true;
}

function on_drag_enter(action, x, y, mask) {
    mouse_in = true;
    mouse_down = true;

    if (!is_dragging) {
        is_dragging = true;
    }

    if (trace_end_zone(x, y)) {
        action.Effect = (action.Effect & g_drop_effect.move)
                || (action.Effect & g_drop_effect.copy)
                || (action.Effect & g_drop_effect.link);
        action.Text = get_text_from_effect(action.Effect, action.IsInternal);
    }
    else {        
        action.Effect = g_drop_effect.none;
    }
}

function on_drag_leave() {
    if (is_dragging) {
        is_dragging = false;
    }

    mouse_in = false;
    mouse_down = false;

    status_text_2 = 'Item was dragged outside or dropped on no-drop zone';
    window.Repaint(); 
}

function on_drag_over(action, x, y, mask) {
    if (trace_end_zone(x, y)) {
        action.Effect = filter_effect_by_modifiers(action.Effect);
        action.Text = get_text_from_effect(action.Effect, action.IsInternal);
    }
    else {
        action.Effect = g_drop_effect.none;
    }
    
    if (status_text_2 !== 'Item is being dragged') {
        status_text_2 = 'Item is being dragged';
        window.Repaint(); 
    }
}

function on_drag_drop(action, x, y, m) {
    this.mouse_down = false; ///< because on_drag_drop suppresses on_mouse_lbtn_up call

    if (!is_dragging || !trace_end_zone(x, y)) {
        is_dragging = false;
        action.Effect = g_drop_effect.none;
        
        return;
    }

    let ctrl_pressed = utils.IsKeyPressed(VK_CONTROL);

    if (action.IsInternal) {        
        let copy_drop = ctrl_pressed && ((action.Effect & 1) || (action.Effect & 4));
        drop(copy_drop);

        // Suppress native drop, since we've handled it ourselves
        action.Effect = g_drop_effect.none;
                
        status_text_2 = 'Item from playlist was dropped and ';
        status_text_2 += copy_drop ? 'copied' : 'moved';            
        window.Repaint();        
    }
    else {
        action.Effect = filter_effect_by_modifiers(action.Effect);
        if (g_drop_effect.none !== action.Effect) {
            external_drop(action);
            status_text_2 = 'Item from outside was dropped and ';
            status_text_2 += g_drop_effect.move & action.Effect ? 'moved' : 'copied';
            window.Repaint();    
        }
        else {
            is_dragging = false;
            
            status_text_2 = 'Item from outside was dropped but the action was forbidden';            
            window.Repaint(); 
        }
    }
}

////////////////////////////
// Methods
////////////////////////////

function trace_start_zone(x,y) {
    return x >= 0 && x < ww/2 && y >= 60 && y < wh;
}

function trace_end_zone(x,y) {
    return x >= ww/2 && x < ww && y >= 60 && y < wh;
}

function perform_internal_drag_n_drop() {
    let cur_selected_index = 0;
    let cur_playlist_idx = plman.ActivePlaylist;
    
    is_dragging = true;
    
    plman.ClearPlaylistSelection(cur_playlist_idx);
    plman.SetPlaylistSelectionSingle(cur_playlist_idx, cur_selected_index, true);
    plman.SetPlaylistFocusItem(cur_playlist_idx, cur_selected_index);
    
    let cur_playlist_size = plman.PlaylistItemCount(cur_playlist_idx);
    let cur_playlist_selection = plman.GetPlaylistSelectedItems(cur_playlist_idx);
    
    let effect = fb.DoDragDrop(0, cur_playlist_selection, g_drop_effect.copy | g_drop_effect.move | g_drop_effect.link);

    if (is_dragging) {
        // If drag operation was not cancelled, then it means that nor on_drag_drop, nor on_drag_leave event handlers
        // were triggered, which means that the items were most likely dropped inside the panel
        // (and relevant methods were not called because of async event processing)        
        return;
    }

    function can_handle_move_drop() {
        // We can handle the 'move drop' properly only when playlist is still in the same state
        return cur_playlist_size === plman.PlaylistItemCount(cur_playlist_idx)
            && plman.IsPlaylistItemSelected(cur_playlist_idx, cur_selected_index);
    }

    if (g_drop_effect.none === effect && can_handle_move_drop()) {
        // DROPEFFECT_NONE needs special handling, because on NT it
        // is returned for some move operations, instead of DROPEFFECT_MOVE.
        // See Q182219 for the details.

        let items_to_remove = [];
        let playlist_items = plman.GetPlaylistItems(cur_playlist_idx);
        [cur_selected_index].forEach(function (idx) {
            let cur_item = playlist_items[idx];
            if (cur_item.RawPath.startsWith('file://') && !fso.FileExists(cur_item.Path)) {
                items_to_remove.push(idx);
            }
        });

        if (items_to_remove.length) {
            plman.ClearPlaylistSelection(cur_playlist_idx);
            plman.SetPlaylistSelection(cur_playlist_idx, items_to_remove, true);
            plman.RemovePlaylistSelection(cur_playlist_idx);
        }
    }
    else if (g_drop_effect.move === effect && can_handle_move_drop()) {
        plman.RemovePlaylistSelection(cur_playlist_idx);
    }
}

function drop(copy_selection) {
    let cur_playlist_idx = plman.ActivePlaylist;
    
    if (!is_dragging) {
        return;
    }

    is_dragging = false;

    let drop_idx = plman.PlaylistItemCount(cur_playlist_idx);
    if (!copy_selection) {
        plman.MovePlaylistSelection(cur_playlist_idx, drop_idx);
        plman.SetPlaylistFocusItem(cur_playlist_idx, drop_idx + 1);
    }
    else {
        plman.UndoBackup(cur_playlist_idx);

        let cur_selection = plman.GetPlaylistSelectedItems(cur_playlist_idx);        
        plman.ClearPlaylistSelection(cur_playlist_idx);
        plman.InsertPlaylistItems(cur_playlist_idx, drop_idx, cur_selection, true);
        plman.SetPlaylistFocusItem(cur_playlist_idx, drop_idx);
    }
}

function external_drop(action) {
    let cur_playlist_idx = plman.ActivePlaylist;
    
    plman.ClearPlaylistSelection(cur_playlist_idx);

    let playlist_idx;
    if (!plman.PlaylistCount) {
        playlist_idx = plman.CreatePlaylist(0, 'Default');
        plman.ActivePlaylist = playlist_idx;
    }
    else {
        playlist_idx = cur_playlist_idx;
        plman.UndoBackup(cur_playlist_idx);
    }

    action.Playlist = playlist_idx;
    action.ToSelect = true;
    action.Base = plman.PlaylistItemCount(cur_playlist_idx);

    is_dragging = false;
}

function filter_effect_by_modifiers(effect) {
    let ctrl_pressed = utils.IsKeyPressed(VK_CONTROL);
    let shift_pressed = utils.IsKeyPressed(VK_SHIFT);
    let alt_pressed = utils.IsKeyPressed(VK_ALT);

    if (ctrl_pressed && shift_pressed && !alt_pressed
        || alt_pressed && !ctrl_pressed && !shift_pressed) {
        // Link only
        return (effect & g_drop_effect.link);
    }

    if (ctrl_pressed && !shift_pressed && !alt_pressed) {
        // Copy (also via link)        
        return (effect & g_drop_effect.copy) || (effect & g_drop_effect.link);
    }

    if (shift_pressed) {
        // Move only
        return (effect & g_drop_effect.move);
    }

    // Move > Copy > Link    
    return (effect & g_drop_effect.move) || (effect & g_drop_effect.copy) || (effect & g_drop_effect.link);
}

function get_text_from_effect(effect, is_internal) {
    switch (effect) {
        case g_drop_effect.move:
        {
            if (is_internal) {
                return 'Moving from inside';
            }
            return 'Moving from outside';
        }
        case g_drop_effect.copy:
        {
            if (is_internal) {
                return 'Copying from inside';
            }
            return 'Copying from outside';
        }
        case g_drop_effect.link:
        {
            return 'Linking from outside';
        }
        default:
            return '';
    }
}