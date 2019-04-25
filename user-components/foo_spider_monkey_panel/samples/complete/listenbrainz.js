'use strict';

window.DefinePanel('Listenbrainz', {author:'marc2003'});
include(fb.ComponentPath + 'samples\\complete\\js\\lodash.min.js');
include(fb.ComponentPath + 'samples\\complete\\js\\helpers.js');
include(fb.ComponentPath + 'samples\\complete\\js\\panel.js');
include(fb.ComponentPath + 'samples\\complete\\js\\listenbrainz.js');

let panel = new _panel(true);
let buttons = new _buttons();
let listenbrainz = new _listenbrainz(2, 2, 16);

function on_colours_changed() {
	panel.colours_changed();
	window.Repaint();
}

function on_mouse_lbtn_up(x, y, mask) {
	buttons.lbtn_up(x, y, mask);
}

function on_mouse_leave() {
	buttons.leave();
}

function on_mouse_move(x, y) {
	buttons.move(x, y);
}

function on_mouse_rbtn_up(x, y) {
	return panel.rbtn_up(x, y);
}

function on_paint(gr) {
	panel.paint(gr);
	buttons.paint(gr);
}

function on_playback_new_track(metadb) {
	listenbrainz.playback_new_track(metadb);
}

function on_playback_time() {
	listenbrainz.playback_time();
}

function on_size() {
	panel.size();
}
