// ==PREPROCESSOR==
// @name "Analog VUMeter automation demo"
// @version "1.0"
// ==/PREPROCESSOR==

// --- VUMeter BEGIN

Layout = {
    BothH: 0,
    BothV: 4,
    Left: 1,
    Right: 2,
    Mono: 3
};

VUMeter = new ActiveXObject("VUMeter");
VUMeter.RegisterWindow(window.ID);
//VUMeter.RegisterRect(window.ID,0,0,200,100);

function ToDB(Level){
    return (20*Math.log(Level)/Math.LN10).toFixed(2);
}

function on_mouse_wheel(step) {
    VUMeter.Offset+=step;
}

var Delta=0;

function on_paint(gr) {
    var L=VUMeter.LeftLevel;
    var R=VUMeter.RightLevel;
    var LM=VUMeter.LeftPeak;
    var RM=VUMeter.RightPeak;
    var D=Delta*0.95+VUMeter.UpdatePeriod*0.05;
    Delta=D;
    var text="Period:"+Math.round(D*1000)+ " ms\nLeft:"+ToDB(L)+"\nRight:"+ToDB(R)+"\nOffset:"+VUMeter.Offset+" dB";

    gr.FillSolidRect(0, 0, ww, wh, g_backcolor);
    gr.FillSolidRect(0,      wh-wh*L,  ww/2, wh*L,  RGB(255,0,0));
    gr.FillSolidRect(ww/2,   wh-wh*R,  ww/2, wh*R,  RGB(255,0,0));
    gr.FillSolidRect(ww/8,   wh-wh*LM, ww/4, wh*LM, RGB(0,255,0));
    gr.FillSolidRect(5*ww/8, wh-wh*RM, ww/4, wh*RM, RGB(0,255,0));
    gr.GdiDrawText(text, g_font, g_textcolor, 5, 5, ww, wh, DT_CALCRECT | DT_NOPREFIX);
}

var X=0,Y=0,DX=1.3,DY=1.6;
var VUWidth=200,VUHeight=100;

VUWindow = VUMeter.CreateWindow(window.ID);
UpdatePos();
window.SetInterval(UpdatePos, 20);
VUWindow.Visible=true;
VUWindow.Enabled=false;

function UpdatePos() {
    X=X+DX;if (X>mw) {X=2*mw-X;DX=-DX}else if (X<0){X=-X;DX=-DX};
    Y=Y+DY;if (Y>mh) {Y=2*mh-Y;DY=-DY}else if (Y<0){Y=-Y;DY=-DY};
    VUWindow.SetBounds(X,Y,VUWidth,VUHeight);
}

function on_size() {
    ww = window.Width;
    wh = window.Height;
    mw = ww-VUWidth;
    mh = wh-VUHeight;
    X = Math.min(X,mh);
    Y = Math.min(Y,mh);
}

function on_mouse_lbtn_down(x, y, mask) {
    VUWindow.LoadNextSkin(VUWindow.GroupName);
    VUWindow.Layout=Layout.Mono;
}

// -- predefined functions

function RGBA(r, g, b, a) {
    r &= 0xff;
    g &= 0xff;
    b &= 0xff;
    a &= 0xff;
    return ((a << 24) | (r << 16) | (g << 8) | (b));
}

function RGB(r, g, b) {
    return RGBA(r, g, b, 0xff);
}

// {{
var DT_TOP = 0x00000000;
var DT_CENTER = 0x00000001;
var DT_VCENTER = 0x00000004;
var DT_WORDBREAK = 0x00000010;
var DT_CALCRECT = 0x00000400;
var DT_NOPREFIX = 0x00000800;
// }}

// {{
// Used in window.GetColorCUI()
ColorTypeCUI = {
    text: 0,
    selection_text: 1,
    inactive_selection_text: 2,
    background: 3,
    selection_background: 4,
    inactive_selection_background: 5,
    active_item_frame: 6
};

// Used in window.GetFontCUI()
FontTypeCUI = {
    items: 0,
    labels: 1
};

// Used in window.GetColorDUI()
ColorTypeDUI = {
    text: 0,
    background: 1,
    highlight: 2,
    selection: 3
};

// Used in window.GetFontDUI()
FontTypeDUI = {
    defaults: 0,
    tabs: 1,
    lists: 2,
    playlists: 3,
    statusbar: 4,
    console: 5
};
//}}

var g_instancetype = window.InstanceType;
var g_font = null;
var ww = 0, wh = 0, mw = 0, mh = 0;
var g_textcolor = 0, g_textcolor_hl = 0;
var g_backcolor = 0;
var g_hot = false;

function get_font() {
    if (g_instancetype == 0) { // CUI
        g_font = window.GetFontCUI(FontTypeCUI.items);
    } else if (g_instancetype == 1) { // DUI
        g_font = window.GetFontDUI(FontTypeDUI.defaults);
    } else {
        // None
    }
}
get_font();

function get_colors() {
    if (g_instancetype == 0) { // CUI
        g_textcolor = window.GetColorCUI(ColorTypeCUI.text);
        g_textcolor_hl = window.GetColorCUI(ColorTypeCUI.text);
        g_backcolor = window.GetColorCUI(ColorTypeCUI.background);
    } else if (g_instancetype == 1) { // DUI
        g_textcolor = window.GetColorDUI(ColorTypeDUI.text);
        g_textcolor_hl = window.GetColorDUI(ColorTypeDUI.highlight);
        g_backcolor = window.GetColorDUI(ColorTypeDUI.background);
    } else {
        // None
    }
}
