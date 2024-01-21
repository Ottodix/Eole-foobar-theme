window.DefineScript('StackBlur (text)', {author: 'T.P Wang / marc2003'});
include('docs/Flags.js');
include('docs/Helpers.js');

const g_font = gdi.Font('Segoe UI', 32, FontStyle.Bold);
const text = '\'Stack Blur\' Sample';

let ww = 0, wh = 0;
let img_to_blur;

function on_paint(gr) {
    img_to_blur && gr.DrawImage(img_to_blur, 0, 0, ww, wh, 0, 0, ww, wh);
    gr.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);
    gr.DrawString(text, g_font, RGB(0, 0, 255), 0, 0, ww, wh, StringFormat(StringAlignment.Center, StringAlignment.Center));
}

function on_size() {
    ww = window.Width;
    wh = window.Height;
    if (ww <= 0 || wh <= 0) {
        return;
    }
    img_to_blur = gdi.CreateImage(ww, wh);
    let g = img_to_blur.GetGraphics();
    g.SetTextRenderingHint(TextRenderingHint.AntiAlias);
    g.DrawString(text, g_font, RGB(0, 0, 255), 0, 0, ww, wh, StringFormat(StringAlignment.Center, StringAlignment.Center));
    img_to_blur.ReleaseGraphics(g);
    // Make Stack Blur, radius value can be between 2 and 254
    img_to_blur.StackBlur(30);
}
