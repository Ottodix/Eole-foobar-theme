'use strict';

window.DefineScript('Track Info + Seekbar + Buttons', {author:'marc2003', options:{grab_focus:false}});
include(fb.ComponentPath + 'samples\\complete\\js\\lodash.min.js');
include(fb.ComponentPath + 'samples\\complete\\js\\helpers.js');
include(fb.ComponentPath + 'samples\\complete\\js\\panel.js');
include(fb.ComponentPath + 'samples\\complete\\js\\seekbar.js');

let colours = {
	buttons : _RGB(255, 255, 255),
	background : _RGB(30, 30, 30),
	title : _RGB(255, 255, 255),
	artist : _RGB(240, 240, 240),
	time : _RGB(240, 240, 240),
	seekbar_background : _RGB(160, 160, 160),
	seekbar_progress : _RGB(255, 255, 255),
	seekbar_knob : _RGB(196, 30, 35)
};

let tfo = {
	artist : fb.TitleFormat('%artist%'),
	title : fb.TitleFormat('%title%'),
	playback_time : fb.TitleFormat('%playback_time%  '),
	length : fb.TitleFormat('  %length%')
};

//////////////////////////////////////////////////////////////

let panel = new _panel();
let seekbar = new _seekbar(0, 0, 0, 0);
let buttons = new _buttons();
let img = null;
const bs = _scale(24);
on_playback_new_track(fb.GetNowPlaying());

buttons.update = () => {
	const y = Math.round((panel.h - bs) / 2);
	buttons.buttons.stop = new _button(panel.w - LM - (bs * 8), y, bs, bs, {normal : _chrToImg(chars.stop, colours.buttons)}, () => { fb.Stop(); }, 'Stop');
	buttons.buttons.previous = new _button(panel.w - LM - (bs * 7), y, bs, bs, {normal : _chrToImg(chars.prev, colours.buttons)}, () => { fb.Prev(); }, 'Previous');
	buttons.buttons.play = new _button(panel.w - LM - (bs * 6), y, bs, bs, {normal : !fb.IsPlaying || fb.IsPaused ? _chrToImg(chars.play, colours.buttons) : _chrToImg(chars.pause, colours.buttons)}, () => { fb.PlayOrPause(); }, !fb.IsPlaying || fb.IsPaused ? 'Play' : 'Pause');
	buttons.buttons.next = new _button(panel.w - LM - (bs * 5), y, bs, bs, {normal : _chrToImg(chars.next, colours.buttons)}, () => { fb.Next(); }, 'Next');
	buttons.buttons.console = new _button(panel.w - LM - (bs * 3), y, bs, bs, {normal : _chrToImg(chars.console, colours.buttons)}, () => { fb.ShowConsole(); }, 'Console');
	buttons.buttons.search = new _button(panel.w - LM - (bs * 2), y, bs, bs, {normal : _chrToImg(chars.search, colours.buttons)}, () => { fb.RunMainMenuCommand('Library/Search'); }, 'Library Search');
	buttons.buttons.preferences = new _button(panel.w - LM - bs, y, bs, bs, {normal : _chrToImg(chars.preferences, colours.buttons)}, () => { fb.ShowPreferences(); }, 'Preferences');
}

function on_size() {
	panel.size();
	seekbar.x = Math.round(panel.w * 0.22);
	seekbar.w = panel.w - seekbar.x - _scale(280);
	seekbar.h = _scale(12);
	seekbar.y = (panel.h - seekbar.h) / 2;
	buttons.update();
}

function on_paint(gr) {
	gr.FillSolidRect(0, 0, panel.w, panel.h, colours.background);
	buttons.paint(gr);
	gr.FillSolidRect(seekbar.x, seekbar.y, seekbar.w + _scale(6), seekbar.h, colours.seekbar_background);
	if (fb.IsPlaying) {
		if (img) {
			_drawImage(gr, img, 0, 0, panel.h, panel.h, image.crop_top);
		}
		gr.GdiDrawText(tfo.title.Eval(), panel.fonts.title, colours.title, panel.h + 10, 0, seekbar.x - panel.h - _scale(60), panel.h * 0.6, LEFT);
		gr.GdiDrawText(tfo.artist.Eval(), panel.fonts.normal, colours.artist, panel.h + 10, panel.h * 0.3, seekbar.x - panel.h - _scale(60), panel.h * 0.7, LEFT);
		gr.SetSmoothingMode(2);
		if (fb.PlaybackLength > 0) {
			const pos = seekbar.pos();
			gr.FillSolidRect(seekbar.x, seekbar.y, pos, seekbar.h, colours.seekbar_progress);
			gr.FillSolidRect(seekbar.x + pos, seekbar.y, _scale(6), seekbar.h, colours.seekbar_knob);
			gr.GdiDrawText(tfo.playback_time.Eval(), panel.fonts.normal, colours.time, seekbar.x - _scale(45), 0, _scale(45), panel.h, RIGHT);
			gr.GdiDrawText(tfo.length.Eval(), panel.fonts.normal, colours.time, seekbar.x + seekbar.w + _scale(6), 0, _scale(45), panel.h, LEFT);
		}
	}
	gr.DrawRect(seekbar.x, seekbar.y, seekbar.w + _scale(6), seekbar.h, 1, colours.seekbar_progress);
}

function on_playback_new_track(metadb) {
	if (!metadb) {
		return;
	}
	img = utils.GetAlbumArtV2(metadb, 0);
	if (img && img.Width > 200) {
		var r = 200 / img.Width;
		img = img.Resize(200, img.Height * r, 2);
	}
	window.Repaint();
}

function on_playback_edited() {
	window.Repaint();
}

function on_playback_seek() {
	seekbar.playback_seek();
}

function on_playback_stop() {
	buttons.update();
	window.Repaint();
}

function on_playback_pause() {
	buttons.update();
	window.Repaint();
}

function on_playback_starting() {
	buttons.update();
	window.Repaint();
}

function on_mouse_wheel(s) {
	if (seekbar.wheel(s)) {
		return;
	}
	if (s == 1) {
		fb.VolumeUp();
	} else {
		fb.VolumeDown();
	}
}

function on_mouse_move(x, y) {
	if (buttons.move(x, y)) {
		return;
	}
	seekbar.move(x, y);
}

function on_mouse_leave() {
	buttons.leave();
}

function on_mouse_lbtn_down(x, y) {
	seekbar.lbtn_down(x, y);
}

function on_mouse_lbtn_up(x, y) {
	if (buttons.lbtn_up(x, y)) {
		return;
	}
	if (seekbar.lbtn_up(x, y)) {
		return;
	}
	fb.RunMainMenuCommand('View/Show now playing in playlist');
}

function on_mouse_rbtn_up(x, y) {
	return panel.rbtn_up(x, y);
}
