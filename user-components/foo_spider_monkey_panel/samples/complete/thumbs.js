'use strict';

window.DefineScript('Thumbs', {author:'marc2003'});
include(fb.ComponentPath + 'samples\\complete\\js\\lodash.min.js');
include(fb.ComponentPath + 'samples\\complete\\js\\helpers.js');
include(fb.ComponentPath + 'samples\\complete\\js\\panel.js');
include(fb.ComponentPath + 'samples\\complete\\js\\thumbs.js');

let panel = new _panel(true);
let thumbs = new _thumbs();

panel.item_focus_change();

function on_size() {
	panel.size();
	thumbs.size();
}

function on_paint(gr) {
	panel.paint(gr);
	thumbs.paint(gr);
}

function on_metadb_changed() {
	thumbs.metadb_changed();
}

function on_mouse_wheel(s) {
	thumbs.wheel(s);
}

function on_mouse_move(x, y) {
	thumbs.move(x, y);
}

function on_mouse_lbtn_up(x, y) {
	thumbs.lbtn_up(x, y);
}

function on_mouse_lbtn_dblclk(x, y) {
	thumbs.lbtn_dblclk(x, y);
}

function on_mouse_rbtn_up(x, y) {
	return panel.rbtn_up(x, y, thumbs);
}

function on_key_down(k) {
	thumbs.key_down(k);
}

function on_colours_changed() {
	panel.colours_changed();
	window.Repaint();
}

function on_font_changed() {
	panel.font_changed();
	window.Repaint();
}

function on_item_focus_change() {
	panel.item_focus_change();
}

function on_playback_dynamic_info_track() {
	panel.item_focus_change();
}

function on_playback_new_track() {
	thumbs.playback_new_track();
}

function on_playback_stop(reason) {
	if (reason != 2) {
		panel.item_focus_change();
	}
}

function on_playback_time(time) {
	thumbs.playback_time();
}

function on_playlist_switch() {
	panel.item_focus_change();
}

