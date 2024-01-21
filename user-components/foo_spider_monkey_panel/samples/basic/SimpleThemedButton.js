window.DefineScript('SimpleThemedButton', {author: 'T.P Wang'});
include('docs/Flags.js');
include('docs/Helpers.js');

const g_theme = window.CreateThemeManager('Button');
const g_font = gdi.Font('Segoe UI', 12);
const ButtonStates = {
    normal: 0,
    hover: 1,
    down: 2,
    hide: 3
};

const buttons = {
    Console: new SimpleButton(5, 5, 80, 26, 'Console', function () {
        fb.ShowConsole();
    }),
    Configure: new SimpleButton(5, 40, 80, 26, 'Configure', function () {
        window.ShowConfigure();
    })
};

let g_down = false;
let cur_btn = null;

function SimpleButton(x, y, w, h, text, fonClick, state) {
    this.state = state ? state : ButtonStates.normal;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.text = text;
    this.fonClick = fonClick;

    this.containXY = function (x, y) {
        return (this.x <= x) && (x <= this.x + this.w) && (this.y <= y) && (y <= this.y + this.h);
    };

    this.changeState = function (state) {
        let old = this.state;
        this.state = state;
        return old;
    };

    this.draw = function (gr) {
        if (this.state === ButtonStates.hide) {
            return;
        }

        switch (this.state) {
            case ButtonStates.normal:
                g_theme.SetPartAndStateID(1, 1);
                break;

            case ButtonStates.hover:
                g_theme.SetPartAndStateID(1, 2);
                break;

            case ButtonStates.down:
                g_theme.SetPartAndStateID(1, 3);
                break;

            case ButtonStates.hide:
                return;
        }

        g_theme.DrawThemeBackground(gr, this.x, this.y, this.w, this.h);
        gr.GdiDrawText(this.text, g_font, RGB(0, 0, 0), this.x, this.y, this.w, this.h, DT_CENTER | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX);
    };

    this.onClick = function () {
        this.fonClick && this.fonClick();
    };
}

function drawAllButtons(gr) {
    for (let i in buttons) {
        buttons[i].draw(gr);
    }
}

function chooseButton(x, y) {
    for (let i in buttons) {
        if (buttons[i].containXY(x, y) && buttons[i].state !== ButtonStates.hide) {
            return buttons[i];
        }
    }

    return null;
}

function on_paint(gr) {
    gr.FillSolidRect(0, 0, window.Width, window.Height, utils.GetSysColour(15));
    drawAllButtons(gr);
}

function on_mouse_move(x, y) {
    let old = cur_btn;
    cur_btn = chooseButton(x, y);

    if (old === cur_btn) {
        if (g_down) {
            return;
        }
    }
    else if (g_down && cur_btn && cur_btn.state !== ButtonStates.down) {
        cur_btn.changeState(ButtonStates.down);
        window.Repaint();
        return;
    }

    old && old.changeState(ButtonStates.normal);
    cur_btn && cur_btn.changeState(ButtonStates.hover);
    window.Repaint();
}

function on_mouse_leave() {
    g_down = false;

    if (cur_btn) {
        cur_btn.changeState(ButtonStates.normal);
        window.Repaint();
    }
}

function on_mouse_lbtn_down(x, y) {
    g_down = true;

    if (cur_btn) {
        cur_btn.changeState(ButtonStates.down);
        window.Repaint();
    }
}

function on_mouse_lbtn_up(x, y) {
    g_down = false;

    if (cur_btn) {
        cur_btn.onClick();
        cur_btn.changeState(ButtonStates.hover);
        window.Repaint();
    }
}

