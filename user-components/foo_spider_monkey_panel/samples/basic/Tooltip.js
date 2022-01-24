window.DefineScript('Tooltip', { author: 'T.P Wang' });
include('docs/Helpers.js');

const g_font = gdi.Font('Segoe UI', 14, 1);
const g_tooltip = window.Tooltip;

let g_down = false;
let SampleButtons = undefined;

let btn_down = null;
let cur_btn = null;

let ww, wh;

function SampleButton(x, y, w, h, caption, func, tiptext) {
    // 'Constructor' stuff
    this.left = x;
    this.top = y;
    this.w = w;
    this.h = h;
    this.right = x + w;
    this.bottom = y + h;
    this.caption = caption;
    this.func = func;
    this.tiptext = tiptext;

    // Estimate whether the coordinate is in this button
    this.traceMouse = function(x, y) {
        return (this.left < x) && (x < this.right) && (this.top < y) && (y < this.bottom);
    };

    this.draw = function(gr) {
        // Draw border
        // RGB function is defined in docs/Helpers.js
        gr.FillRoundRect(this.left, this.top, this.w, this.h, 3, 3, RGB(19, 30, 38));
        gr.DrawRoundRect(this.left, this.top, this.w, this.h, 3, 3, 1, RGB(151, 180, 202));
        // Draw caption
        gr.DrawString(this.caption, g_font, RGB(0xc0, 0xc0, 0xc0), this.left, this.top, this.w, this.h, 0x11005000);
    };

    this.onClick = function() {
        this.func && this.func(x, y);
    };

    this.onMouseIn = function() {
        // Update tooltip text
        g_tooltip.Text = this.tiptext;
        g_tooltip.Activate();
    };

    this.onMouseOut = function() {
        // Hide tooltip
        g_tooltip.Deactivate();
    }
}

function buttonsDraw(gr) {
    for (let i in SampleButtons) {
        SampleButtons[i].draw(gr);
    }
}

function buttonsTraceMouse(x, y) {
    let btn = null;

    for (let i in SampleButtons) {
        if (SampleButtons[i].traceMouse(x, y) && !btn) btn = SampleButtons[i];
    }

    return btn;
}

function on_mouse_move(x, y) {
    let btn = buttonsTraceMouse(x, y);

    if (btn !== cur_btn) {
        cur_btn && cur_btn.onMouseOut();
        btn && btn.onMouseIn();
    }

    if (btn !== btn_down) {
        btn_down = null;
    }

    cur_btn = btn;
}

function on_mouse_lbtn_down(x, y) {
    g_down = true;
    btn_down = cur_btn;
}

function on_mouse_lbtn_up(x, y) {
    if (cur_btn) {
        if (btn_down === cur_btn) cur_btn.onClick(x, y);
    }

    g_down = false;
}

function on_paint(gr) {
    gr.SetTextRenderingHint(5); // clear type
    gr.SetSmoothingMode(4); // Anti-Alias
    gr.FillSolidRect(0, 0, ww, wh, utils.GetSysColour(15));
    buttonsDraw(gr);
}

function on_size() {
    ww = window.Width;
    wh = window.Height;

    let buttonY = 5;

    SampleButtons = {
        stop: new SampleButton(5, buttonY, 70, 30, 'Stop', function() {
            fb.Stop();
        },
        'Stop'),
        prev: new SampleButton(80, buttonY, 70, 30, 'Previous', function() {
            fb.Prev();
        },
        'Previous'),
        play: new SampleButton(155, buttonY, 70, 30, 'Play', function() {
            fb.Play();
        },
        'Play'),
        pause: new SampleButton(230, buttonY, 70, 30, 'Pause', function() {
            fb.Pause();
        },
        'Pause'),
        next: new SampleButton(305, buttonY, 70, 30, 'Next', function() {
            fb.Next();
        },
        'Next'),
        rand: new SampleButton(380, buttonY, 70, 30, 'Random', function() {
            fb.Random();
        },
        'Random')
    };
}
