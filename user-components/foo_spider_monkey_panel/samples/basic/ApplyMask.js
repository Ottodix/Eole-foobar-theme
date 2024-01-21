window.DefineScript('ApplyMask', { author: 'T.P Wang / marc2003' });
include('docs/Flags.js');
include('docs/Helpers.js');

const g_img = gdi.Image(`${fb.ComponentPath}samples/basic/images/post.jpg`);
const g_mask = gdi.Image(`${fb.ComponentPath}samples/basic/images/mask.png`);
const font = gdi.Font('Segoe UI', 16, 1);

let ww = 0, wh = 0;
let applied = false;

function on_size() {
    ww = window.Width;
    wh = window.Height;
}

function on_paint(gr) {
    if (g_img) {
        // Keep aspect ratio
        let scale_w = ww / g_img.Width;
        let scale_h = wh / g_img.Height;
        let scale = Math.min(scale_w, scale_h);
        let pos_x = 0, pos_y = 0;
        if (scale_w < scale_h)
            pos_y = (wh - g_img.Height * scale) / 2;
        else if (scale_w > scale_h)
            pos_x = (ww - g_img.Width * scale) / 2;
        gr.DrawImage(g_img, pos_x, pos_y, g_img.Width * scale, g_img.Height * scale, 0, 0, g_img.Width, g_img.Height);
    }
    if (!applied) {
        gr.FillSolidRect(0, 0, ww, 24, RGB(0, 0, 0));
        gr.GdiDrawText('Double click panel to apply mask', font, RGB(255, 255, 255), 0, 0, ww, 24, DT_CENTER);
    }
}

function on_mouse_lbtn_dblclk() {
    if (!applied) {
        apply();
    }
}

function apply() {
    let g_img_mask = g_mask;
    // mask *MUST* be the same size as g_img
    let mask = g_img_mask.Resize(g_img.Width, g_img.Height);
    // Apply mask image to g_img
    g_img.ApplyMask(mask);
    applied = true;
    window.Repaint();
}
