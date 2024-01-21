'use strict';

window.DefineScript('Status Bar + Volume', {author:'marc2003', options:{grab_focus:false}});
include(fb.ComponentPath + 'samples\\complete\\js\\lodash.min.js');
include(fb.ComponentPath + 'samples\\complete\\js\\helpers.js');
include(fb.ComponentPath + 'samples\\complete\\js\\volume.js');

window.MinHeight = window.MaxHeight = 18;

let tfo = fb.TitleFormat('%__bitrate% kbps %codec% [%codec_profile% ][%__tool% ][%__tagtype% ]');

let properties = {
	name : new _p('2K3.STATUS.SHOW.NAME', true),
	count : new _p('2K3.STATUS.SHOW.COUNT', true),
	duration : new _p('2K3.STATUS.SHOW.DURATION', true),
	size : new _p('2K3.STATUS.SHOW.SIZE', true),
	background : new _p('2K3.STATUS.BACKGROUND', _RGB(240, 240, 240)),
	text : new _p('2K3.STATUS.TEXT', _RGB(0, 0, 0))
};

let font = _gdiFont('Segoe UI', 11);
let ww = 0;
let wh = 0;
let right_text = '';
let right_text_width = 0;

let volume = new _volume(0, 3, 100, font.Height - 9);

refresh();

function on_size() {
	ww = window.Width;
	wh = window.Height;
	volume.x = ww - 190;
}

function on_paint(gr) {
	gr.FillSolidRect(0, 0, ww, wh, properties.background.value);
	if (fb.IsPlaying) {
		gr.GdiDrawText(tfo.Eval(), font, properties.text.value, 5, -1, ww - right_text_width - 300, font.Height, LEFT);
	}
	if (plman.ActivePlaylist > -1 && plman.ActivePlaylist < plman.PlaylistCount) {
		gr.GdiDrawText(right_text, font, properties.text.value, 0, -1, ww - 250, font.Height, RIGHT);
	}
	gr.DrawRect(volume.x, volume.y, volume.w, volume.h, 1, properties.text.value);
	gr.FillSolidRect(volume.x, volume.y, volume.pos(), volume.h, properties.text.value);
	gr.GdiDrawText(fb.Volume.toFixed(2) + ' dB', font, properties.text.value, 0, -1, ww - 5, font.Height, RIGHT);
}

function on_playback_new_track() {
	window.Repaint();
}

function on_playback_time() {
	window.Repaint();
}

function on_playback_stop() {
	window.Repaint();
}

function on_volume_change() {
	window.Repaint();
}

function on_mouse_wheel(s) {
	volume.wheel(s);
}

function on_mouse_move(x, y) {
	volume.move(x, y);
}

function on_mouse_lbtn_down(x, y) {
	volume.lbtn_down(x, y);
}

function on_mouse_lbtn_up(x, y) {
	volume.lbtn_up(x, y);
}

function on_mouse_lbtn_dblclk() {
	fb.RunMainMenuCommand('View/Show now playing in playlist');
}

function on_mouse_rbtn_up(x, y) {
	let m = window.CreatePopupMenu();
	let s = window.CreatePopupMenu();
	let c = fb.CreateContextMenuManager();
	let col = window.CreatePopupMenu();
	if (fb.IsPlaying) {
		c.InitNowPlaying();
		c.BuildMenu(s, 1);
		s.AppendTo(m, MF_STRING, 'Now playing');
		m.AppendMenuSeparator();
	}
	m.AppendMenuItem(MF_STRING, 10000, 'Show playlist name');
	m.CheckMenuItem(10000, properties.name.enabled);
	m.AppendMenuItem(MF_STRING, 10001, 'Show playlist item count');
	m.CheckMenuItem(10001, properties.count.enabled);
	m.AppendMenuItem(MF_STRING, 10002, 'Show playlist duration');
	m.CheckMenuItem(10002, properties.duration.enabled);
	m.AppendMenuItem(MF_STRING, 10003, 'Show playlist size');
	m.CheckMenuItem(10003, properties.size.enabled);
	m.AppendMenuSeparator();
	col.AppendMenuItem(MF_STRING, 10004, 'Background...');
	col.AppendMenuItem(MF_STRING, 10005, 'Text...');
	col.AppendTo(m, MF_STRING, 'Colours');
	m.AppendMenuSeparator();
	m.AppendMenuItem(MF_STRING, 10010, 'Configure...');
	const idx = m.TrackPopupMenu(x, y);
	switch (idx) {
	case 0:
		break;
	case 10000:
		properties.name.toggle();
		refresh();
		break;
	case 10001:
		properties.count.toggle();
		refresh();
		break;
	case 10002:
		properties.duration.toggle();
		refresh();
		break;
	case 10003:
		properties.size.toggle();
		refresh();
		break;
	case 10004:
		properties.background.set(utils.ColourPicker(window.ID, properties.background.value));
		window.Repaint();
		break;
	case 10005:
		properties.text.set(utils.ColourPicker(window.ID, properties.text.value));
		window.Repaint();
		break;
	case 10010:
		window.ShowConfigure();
		break;
	default:
		c.ExecuteByID(idx - 1);
		break;
	}
	return true;
}

function on_playlist_items_added(p) {
	if (p == plman.ActivePlaylist) {
		refresh();
	}
}

function on_playlist_items_removed(p) {
	if (p == plman.ActivePlaylist) {
		refresh();
	}
}

function on_playlists_changed() {
	if (properties.name.enabled) {
		refresh();
	}
}

function on_playlist_switch() {
	refresh();
}

function refresh() {
	let items = plman.GetPlaylistItems(plman.ActivePlaylist);
	const count = items.Count;
	let tmp = [];
	if (properties.name.enabled) {
		tmp.push(plman.GetPlaylistName(plman.ActivePlaylist));
	}
	if (properties.count.enabled) {
		tmp.push(count + (count == 1 ? ' track' : ' tracks'));
	}
	if (properties.duration.enabled) {
		tmp.push(utils.FormatDuration(items.CalcTotalDuration()));
	}
	if (properties.size.enabled) {
		tmp.push(utils.FormatFileSize(items.CalcTotalSize()));
	}
	right_text = tmp.join(' :: ');
	right_text_width = _textWidth(right_text, font);
	window.Repaint();
}
