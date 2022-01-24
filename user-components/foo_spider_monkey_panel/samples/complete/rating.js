'use strict';

window.DefineScript('Rating', {author:'marc2003', options:{grab_focus:false}});
include(fb.ComponentPath + 'samples\\complete\\js\\lodash.min.js');
include(fb.ComponentPath + 'samples\\complete\\js\\helpers.js');
include(fb.ComponentPath + 'samples\\complete\\js\\panel.js');
include(fb.ComponentPath + 'samples\\complete\\js\\rating.js');

/*
Now supports 3 modes:
1) foo_playcount, limited to 5 stars, access via %rating%
2) file tags, configurable max limit, access via custom tag. Use right click menu to set.
3) Spider Monkey Panel 'Playback stats' database, configurable max limit, access via %smp_rating%. Bound to '%artist% - %title%' so common tracks across different albums will share the rating.
*/

let panel = new _panel(true);
let rating = new _rating(0, 0, 24, _RGB(255, 128, 0)); // x, y, size, colour

panel.item_focus_change();

function on_size() {
	panel.size();
}
function on_paint(gr) {
	panel.paint(gr);
	rating.paint(gr);
}

function on_metadb_changed() {
	rating.metadb_changed();
}

function on_mouse_move(x, y) {
	rating.move(x, y);
}
function on_mouse_leave() {
	rating.leave();
}

function on_mouse_lbtn_up(x, y) {
	rating.lbtn_up(x, y);
}

function on_mouse_rbtn_up(x, y) {
	return panel.rbtn_up(x, y, rating);
}

function on_colours_changed() {
	panel.colours_changed();
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

