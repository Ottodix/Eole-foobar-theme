window.DefineScript('Volbar with GdiDrawText', {author: 'T.P Wang'});
include('docs/Flags.js');
include('docs/Helpers.js');

const g_font = gdi.Font('Segoe UI', 12, 0);
let g_drag = false;
let ww = 0, wh = 0;

function on_size() {
    ww = window.Width;
    wh = window.Height;
}

function on_paint(gr) {
    let volume = fb.Volume;
    let pos = ww * vol2pos(volume);
    let txt = volume.toFixed(2) + 'dB';
    if (pos) {
        gr.FillGradRect(0, 0, pos, wh, 90, RGB(240, 240, 240), RGB(100, 230, 100));
    }
    if (ww > pos) {
        gr.FillGradRect(pos, 0, ww - pos, wh, 90, RGB(240, 240, 240), RGB(190, 190, 190));
    }
    gr.GdiDrawText(txt, g_font, RGB(64, 64, 128), 0, 0, ww, wh, DT_CENTER | DT_VCENTER | DT_SINGLELINE);
    gr.DrawRect(0, 0, ww - 1, wh - 1, 1.0, RGB(150, 150, 150));
}

function on_mouse_lbtn_down(x, y) {
    g_drag = true;
}

function on_mouse_lbtn_up(x, y) {
    on_mouse_move(x, y);
    g_drag = false;
}

function on_mouse_move(x, y) {
    if (g_drag) {
        let pos = (x < 0 ? 0 : (x > ww ? 1 : x / ww));
        fb.Volume = pos2vol(pos);
    }
}

function on_mouse_wheel(delta) {
    if (delta > 0) {
        fb.VolumeUp();
    }
    else {
        fb.VolumeDown();
    }
}

function on_volume_change(val) {
    window.Repaint();
}
