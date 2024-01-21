window.DefineScript('GetAlbumArtAsyncV2', { author: 'TheQwertiest' });
include('docs/Flags.js');
include('docs/Helpers.js');

// Nothing will show until you start playing a new track

let g_img = null;
let path = '';
let ww = 0, wh = 0;
let cur_metadb = null;

function on_paint(gr) {
    gr.FillSolidRect(0, 0, ww, wh, RGB(255, 255, 255));
    if (!g_img) {
        return;
    }

    // Keep aspect ratio
    let scale_w = ww / g_img.Width;
    let scale_h = wh / g_img.Height;
    let scale = Math.min(scale_w, scale_h);
    let pos_x = 0, pos_y = 0;
    if (scale_w < scale_h) {
        pos_y = (wh - g_img.Height * scale) / 2;
    } else if (scale_w > scale_h) {
        pos_x = (ww - g_img.Width * scale) / 2;
    }
    gr.DrawImage(g_img, pos_x, pos_y, g_img.Width * scale, g_img.Height * scale, 0, 0, g_img.Width, g_img.Height);
}

function on_size() {
    ww = window.Width;
    wh = window.Height;
}

function on_playback_new_track(metadb) {
    if (!metadb) {
        return;
    }
    g_img = null;
    path = null;
    cur_metadb = metadb;

    get_album_art_async(metadb, AlbumArtId.front);
}

function on_mouse_lbtn_dblclk(x, y) {
    //double click panel to show path in popup window
    if (path) {
        fb.ShowPopupMessage(path);
    }
}

const get_album_art_async = async (metadb, art_id) =>
{
    let result = await utils.GetAlbumArtAsyncV2(0, metadb, art_id);
    if (metadb === cur_metadb) {
        path = result.path;
        g_img = result.image;
        window.Repaint();
    }
};
