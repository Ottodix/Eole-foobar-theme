window.DefineScript('StackBlur', {author: 'marc2003'});
include('docs/Flags.js');
include('docs/Helpers.js');

const img = gdi.Image(`${fb.ComponentPath}samples/basic/images/post.jpg`);
const font = gdi.Font('Segoe UI', 16, 1);
const text_h = 24
let blur_img = null;
let radius = 20;
let ww = 0;
let wh = 0;

StackBlur(radius);

function StackBlur(radius) {
    blur_img = img.Clone(0, 0, img.Width, img.Height);
    blur_img.StackBlur(radius);
}

function on_paint(gr) {
    if (!ww || !wh) {
        return;
    }

    const min_dim = Math.min(ww,wh - text_h)
    gr.DrawImage(blur_img, 0, text_h, min_dim, min_dim, 0, 0, 600, 600);
    gr.DrawImage(img, 6, text_h + 5, min_dim/3, min_dim/3, 0, 0, 600, 600);
    // RGB function is defined in docs/Helpers.js
    gr.FillSolidRect(0, 0, ww, 24, RGB(0, 0, 0));
    // DT_CENTER is defined in docs/Flags.js
    gr.GdiDrawText('Scroll mouse to change radius: ' + radius, font, RGB(255, 255, 255), 0, 0, ww, text_h, DT_CENTER);
}

function on_size(w,h) {
    ww = w;
    wh = h;
}

function on_mouse_wheel(step) {
    radius += step * 5;
    if (radius < 2) {
        radius = 2;
    }
    if (radius > 254) {
        radius = 254;
    }
    StackBlur(radius);
    window.Repaint();
}
