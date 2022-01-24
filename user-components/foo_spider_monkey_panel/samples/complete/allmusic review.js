'use strict';

window.DefineScript('Allmusic Review', {author:'marc2003'});
include(fb.ComponentPath + 'samples\\complete\\js\\lodash.min.js');
include(fb.ComponentPath + 'samples\\complete\\js\\helpers.js');
include(fb.ComponentPath + 'samples\\complete\\js\\panel.js');
include(fb.ComponentPath + 'samples\\complete\\js\\text.js');

let panel = new _panel();
let text = new _text('allmusic', LM, TM, 0, 0);

panel.item_focus_change();

function on_size() {
	panel.size();
	text.w = panel.w - (LM * 2);
	text.h = panel.h - TM;
	text.size();
}

function on_paint(gr) {
	panel.paint(gr);
	gr.GdiDrawText(text.header_text(), panel.fonts.title, panel.colours.highlight, LM, 0, panel.w - (LM * 2), TM, LEFT);
	gr.DrawLine(text.x, text.y + 1, text.x + text.w, text.y + 1, 1, panel.colours.highlight);
	text.paint(gr);
}

function on_metadb_changed() {
	text.metadb_changed();
}

function on_mouse_wheel(s) {
	text.wheel(s);
}

function on_mouse_move(x, y) {
	text.move(x, y);
}

function on_mouse_lbtn_up(x, y) {
	text.lbtn_up(x, y);
}

function on_key_down(k) {
	text.key_down(k);
}

function on_mouse_rbtn_up(x, y) {
	return panel.rbtn_up(x, y, text);
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

