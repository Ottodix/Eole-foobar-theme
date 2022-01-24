'use strict';

window.DefineScript('Album Art', {author:'marc2003'});
include(fb.ComponentPath + 'samples\\complete\\js\\lodash.min.js');
include(fb.ComponentPath + 'samples\\complete\\js\\helpers.js');
include(fb.ComponentPath + 'samples\\complete\\js\\panel.js');
include(fb.ComponentPath + 'samples\\complete\\js\\albumart.js');

let panel = new _panel(true);
let albumart = new _albumart(0, 0, 0, 0);

panel.item_focus_change();

function on_size() {
	panel.size();
	albumart.w = panel.w;
	albumart.h = panel.h;
}

function on_paint(gr) {
	panel.paint(gr);
	albumart.paint(gr);
}

function on_metadb_changed() {
	albumart.metadb_changed();
}

function on_mouse_wheel(s) {
	albumart.wheel(s);
}

function on_mouse_move(x, y) {
	albumart.move(x, y);
}

function on_mouse_lbtn_dblclk(x, y) {
	albumart.lbtn_dblclk(x, y);
}

function on_mouse_rbtn_up(x, y) {
	return panel.rbtn_up(x, y, albumart);
}

function on_key_down(k) {
	albumart.key_down(k);
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
	panel.item_focus_change();
}

function on_playback_stop(reason) {
	if (reason != 2) {
		panel.item_focus_change();
	}
}

function on_playlist_switch() {
	panel.item_focus_change();
}

