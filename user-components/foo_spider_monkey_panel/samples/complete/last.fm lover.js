'use strict';

window.DefineScript('Last.fm Lover', {author:'marc2003', options:{grab_focus:false}});
include(fb.ComponentPath + 'samples\\complete\\js\\lodash.min.js');
include(fb.ComponentPath + 'samples\\complete\\js\\helpers.js');
include(fb.ComponentPath + 'samples\\complete\\js\\panel.js');
include(fb.ComponentPath + 'samples\\complete\\js\\lastfm.js');

/*
This script makes use of the Spider Monkey "Playback Stats" database to import
and store loved tracks from Last.fm. Each loved track will have the value of
%smp_loved% set to 1. You can access this through all other components/search -
it works in the same way as "foo_playcount" - all values are stored in a database
file and no files are tagged. Each record is bound to "%artist% - %title%" so
common tracks across different albums will share the same loved status. Right click
the heart iocn to set your Last.fm username and authorise the script through your
browser. You can then import all your loved tracks and then use the heart icon
to love/unlove tracks.
*/

let loved = _chrToImg(chars.heart_on, _RGB(255, 0, 0));
let unloved = _chrToImg(chars.heart_off, _RGB(255, 0, 0));
let info = _chrToImg(chars.info, _RGB(255, 0, 0));

let panel = new _panel(true);
let buttons = new _buttons();
let lastfm = new _lastfm();

buttons.update = () => {
	let n, h, func, tooltip;
	switch (true) {
	case lastfm.username.length == 0 || lastfm.sk.length != 32:
		n = info;
		h = info;
		func = null;
		tooltip = 'Right click to set your Last.fm username and authorise.';
		break;
	case !panel.metadb:
		n = info;
		h = info;
		func = null;
		tooltip = 'No selection';
		break;
	case _.parseInt(panel.tf('%SMP_LOVED%')) == 1:
		n = loved;
		h = unloved;
		func = () => {
			lastfm.post('track.unlove', null, panel.metadb);
		}
		tooltip = panel.tf('Unlove "%title%" by "%artist%"');
		break;
	default:
		n = unloved;
		h = loved;
		func = () => {
			lastfm.post('track.love', null, panel.metadb);
		}
		tooltip = panel.tf('Love "%title%" by "%artist%"');
		break;
	}
	buttons.buttons.lover = new _button(0, 0, 36, 36, {normal : n, hover : h}, func, tooltip);
}

function on_notify_data(name, data) {
	lastfm.notify_data(name, data);
}

function on_size() {
	panel.size();
	buttons.update();
}

function on_paint(gr) {
	panel.paint(gr);
	buttons.paint(gr);
}

function on_metadb_changed() {
	buttons.update();
	window.Repaint();
}

function on_mouse_move(x, y) {
	buttons.move(x, y);
}

function on_mouse_leave() {
	buttons.leave();
}

function on_mouse_lbtn_up(x, y) {
	buttons.lbtn_up(x, y);
}

function on_mouse_rbtn_up(x, y) {
	if (buttons.buttons.lover.trace(x, y)) {
		const flag = lastfm.username.length ? MF_STRING : MF_GRAYED;
		let m = window.CreatePopupMenu();
		m.AppendMenuItem(MF_STRING, 1, 'Last.fm username...');
		m.AppendMenuItem(flag, 2, 'Authorise');
		m.AppendMenuSeparator();
		m.AppendMenuItem(flag, 3, 'Bulk import Last.fm loved tracks');
		m.AppendMenuSeparator();
		m.AppendMenuItem(MF_STRING, 4, 'Show loved tracks');
		m.AppendMenuSeparator();
		m.AppendMenuItem(MF_STRING, 5, 'Configure...');
		const idx = m.TrackPopupMenu(x, y);
		switch (idx) {
		case 1:
			lastfm.update_username();
			break;
		case 2:
			lastfm.post('auth.getToken');
			break;
		case 3:
			lastfm.get_loved_tracks(1);
			break;
		case 4:
			fb.ShowLibrarySearchUI('%SMP_LOVED% IS 1');
			break;
		case 5:
			window.ShowConfigure();
			break;
		}
	} else {
		panel.rbtn_up(x, y);
	}
	return true;
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

