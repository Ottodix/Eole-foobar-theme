"use strict";

// include script from the package
include('utils.js')

let font = gdi.Font('Segoe UI', 12)
let ww = 0;
let wh = 0;


function on_paint(gr) {
    gr.DrawRect(0, 0, ww, wh, 4, 0xFF000000);
    
    gr.GdiDrawText(`Click here to show package information`, font, 0xFF000000, 8, 8, ww, wh/3);
    
    gr.DrawLine(0, wh/3, ww, wh/3, 2, 0xFF000000);
    gr.GdiDrawText(`Click here to show asset content`, font, 0xFF000000, 8, wh/3 + 8, ww, wh/3 + 8);
    
    gr.DrawLine(0, 2*wh/3, ww, 2*wh/3, 2, 0xFF000000);
    gr.GdiDrawText('Quick-access all package scripts via `Edit script` submenu of context menu\n' +
                   'View and modify package configuration via `Package` tab - accessible through `Configure` in context menu\n' +
                   '(right click to open it)', font, 0xFF000000, 8, 2*wh/3 + 8, ww, 2*wh/3 + 8);
}

function on_size(width, height) {
    ww = width;
    wh = height;
}

function on_mouse_lbtn_up(x, y) {
    if (y < wh/3) {
        // function from utils.js
	    my_utils.showScriptInfo();
    }
    else if (y >= wh/3 && y < 2*wh/3) {
        // function from utils.js
	    my_utils.loadAndDisplayAsset('text.txt');
    }
}
