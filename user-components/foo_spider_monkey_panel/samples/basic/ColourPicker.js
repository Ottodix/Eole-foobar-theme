window.DefineScript('ColourPicker', { author: 'marc2003' });
include('docs/Flags.js');
include('docs/Helpers.js');

const font = gdi.Font('Segoe UI', 16, 1);

let colour = RGB(255, 0, 0);

function on_paint(gr) {
    gr.FillSolidRect(0, 0, window.Width, window.Height, colour);
    gr.FillSolidRect(0, 0, window.Width, 24, RGB(0, 0, 0));
    gr.GdiDrawText('Click to open ColorPicker', font, RGB(255, 255, 255), 0, 0, window.Width, 24, DT_CENTER);
}

function on_mouse_lbtn_up() {
    colour = utils.ColourPicker(0, colour);
    window.Repaint();
}
