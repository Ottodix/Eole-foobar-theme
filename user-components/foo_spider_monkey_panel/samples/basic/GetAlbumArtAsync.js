window.DefineScript('GetAlbumArtAsync', { author: 'T.P Wang' });
include('docs/Flags.js');
include('docs/Helpers.js');

// Nothing will show until you start playing a new track

let g_img = null;
let path = '';
let ww = 0, wh = 0;

function on_paint(gr) {
    gr.FillSolidRect(0, 0, ww, wh, RGB(255, 255, 255));
    if (g_img) {
        // Keep aspect ratio
        let scale_w = ww / g_img.Width;
        let scale_h = wh / g_img.Height;
        let scale = Math.min(scale_w, scale_h);
        let pos_x = 0, pos_y = 0;
        if (scale_w < scale_h) {
            pos_y = (wh - g_img.Height * scale) / 2;
        }
        else if (scale_w > scale_h) {
            pos_x = (ww - g_img.Width * scale) / 2;
        }
        gr.DrawImage(g_img, pos_x, pos_y, g_img.Width * scale, g_img.Height * scale, 0, 0, g_img.Width, g_img.Height);
    }
}

function on_size() {
    ww = window.Width;
    wh = window.Height;
}

function on_playback_new_track(metadb) {
    if (!metadb) {
        return;
    }
    utils.GetAlbumArtAsync(0, metadb, AlbumArtId.front);
    g_img = null;
    path = null;
}

function on_get_album_art_done(metadb, art_id, image, image_path) {
    path = image_path;
    g_img = image;
    window.Repaint();
}

function on_mouse_lbtn_dblclk(x, y) {
    //double click panel to show path in popup window
    if (path) {
        fb.ShowPopupMessage(path);
    }
}
