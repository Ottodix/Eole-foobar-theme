'use strict';

window.DefineScript('Seekbar', {author:'marc2003', options:{grab_focus:false}});
include(fb.ComponentPath + 'samples\\complete\\js\\lodash.min.js');
include(fb.ComponentPath + 'samples\\complete\\js\\helpers.js');
include(fb.ComponentPath + 'samples\\complete\\js\\seekbar.js');

let seekbar = new _seekbar(0, 0, 0, 0);
seekbar.c1 = _RGB(50, 50, 50);
seekbar.c2 = _RGB(196, 30, 35);

function on_size() {
	seekbar.w = window.Width;
	seekbar.h = window.Height;
}

function on_paint(gr) {
	gr.FillSolidRect(seekbar.x, seekbar.y, seekbar.w, seekbar.h, seekbar.c1);
	if (fb.IsPlaying && fb.PlaybackLength > 0) {
		gr.FillSolidRect(seekbar.x, seekbar.y, seekbar.pos(), seekbar.h, seekbar.c2);
	}
}

function on_playback_seek() {
	seekbar.playback_seek();
}

function on_playback_stop() {
	seekbar.playback_stop();
}

function on_mouse_wheel(s) {
	seekbar.wheel(s);
}

function on_mouse_move(x, y) {
	seekbar.move(x, y);
}

function on_mouse_lbtn_down(x, y) {
	seekbar.lbtn_down(x, y);
}

function on_mouse_lbtn_up(x, y) {
	seekbar.lbtn_up(x, y);
}
