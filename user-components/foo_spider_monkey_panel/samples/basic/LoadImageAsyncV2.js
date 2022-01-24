window.DefineScript('LoadImageAsyncV2', { author: 'TheQwertiest' });

// Get a list of jpg files from a folder
const g_image_list = utils.Glob(`${fb.ComponentPath}samples/basic/images/*.jpg`);
let ww = 0, wh = 0;
let g_img = null;

// Trigger every 5 seconds.
let g_timer = window.SetInterval(function () {
    load_random_image_async();
}, 5000);

const load_random_image_async = async (metadb, art_id) =>
{
    // Load a random image from the list
    let path = g_image_list[Math.floor(Math.random() * g_image_list.length)];
    g_img = await gdi.LoadImageAsyncV2(0, path);
    window.Repaint();
};

load_random_image_async();

function on_size() {
    ww = window.Width;
    wh = window.Height;
}

function on_paint(gr) {
    if (!g_img) {
        return;
    }

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
