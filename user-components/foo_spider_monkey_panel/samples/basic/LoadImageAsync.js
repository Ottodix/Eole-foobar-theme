window.DefineScript('LoadImageAsync', { author: 'T.P Wang' });

// Get a list of jpg files from a folder
const g_image_list = utils.Glob(`${fb.ComponentPath}samples/basic/images/*.jpg`);
let ww = 0, wh = 0;
let g_img = null;
let g_valid_tid = 0;

// Trigger every 5 seconds.
let g_timer = setInterval(function () {
    load_random_image_async();
}, 5000);

load_random_image_async();

function load_random_image_async() {
    // Load a random image from the list
    let path = g_image_list[Math.floor(Math.random() * g_image_list.length)];
    // on_load_image_done will be triggered when the image has been loaded
    g_valid_tid = gdi.LoadImageAsync(0, path);
}

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

// After loading image is done in the background, this callback will be invoked
function on_load_image_done(tid, image, image_path) {
    if (g_valid_tid === tid) {
        g_img = image;
        window.Repaint();
    }
}
