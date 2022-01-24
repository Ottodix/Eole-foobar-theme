'use strict';

window.DefineScript('Volume Slider', {author:'marc2003', options:{grab_focus:false}});
include(fb.ComponentPath + 'samples\\complete\\js\\lodash.min.js');
include(fb.ComponentPath + 'samples\\complete\\js\\helpers.js');
include(fb.ComponentPath + 'samples\\complete\\js\\volume.js');

let volume = new _volume(0, 0, 0, 0);
volume.c1 = _RGB(50, 50, 50);
volume.c2 = _RGB(196, 30, 35);

function on_mouse_lbtn_down(x, y) {
	volume.lbtn_down(x, y);
}

function on_mouse_lbtn_up(x, y) {
	volume.lbtn_up(x, y);
}

function on_mouse_move(x, y) {
	volume.move(x, y);
}

function on_mouse_wheel(s) {
	volume.wheel(s);
}

function on_paint(gr) {
	gr.FillSolidRect(volume.x, volume.y, volume.w, volume.h, volume.c1);
	gr.SetSmoothingMode(2);
	let points = [volume.x, volume.y + volume.h, volume.x + volume.pos(), volume.y + volume.h, volume.x + volume.pos(), volume.y + volume.h - volume.pos('h')];
	gr.FillPolygon(volume.c2, 1, points);
}

function on_size() {
	volume.w = window.Width;
	volume.h = window.Height;
}

function on_volume_change() {
	volume.volume_change();
}
