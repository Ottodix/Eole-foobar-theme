'use strict';

window.DefineScript('Musicbrainz', {author:'marc2003'});
include(fb.ComponentPath + 'samples\\complete\\js\\lodash.min.js');
include(fb.ComponentPath + 'samples\\complete\\js\\helpers.js');
include(fb.ComponentPath + 'samples\\complete\\js\\panel.js');
include(fb.ComponentPath + 'samples\\complete\\js\\list.js');

// This script requires 'musicbrainz_artistid' or 'musicbrainz artist id' tags present in your files.

let panel = new _panel();
let list = new _list('musicbrainz', LM, TM, 0, 0);

panel.item_focus_change();

function on_size() {
	panel.size();
	list.w = panel.w - (LM * 2);
	list.h = panel.h - TM;
	list.size();
}

function on_paint(gr) {
	panel.paint(gr);
	gr.GdiDrawText(list.header_text(), panel.fonts.title, panel.colours.highlight, LM, 0, panel.w - (LM * 2), TM, LEFT);
	gr.DrawLine(list.x, list.y + 1, list.x + list.w, list.y + 1, 1, panel.colours.highlight);
	list.paint(gr);
}

function on_metadb_changed() {
	list.metadb_changed();
}

function on_mouse_wheel(s) {
	list.wheel(s);
}

function on_mouse_move(x, y) {
	list.move(x, y);
}

function on_mouse_lbtn_up(x, y) {
	list.lbtn_up(x, y);
}

function on_mouse_rbtn_up(x, y) {
	return panel.rbtn_up(x, y, list);
}

function on_key_down(k) {
	list.key_down(k);
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

