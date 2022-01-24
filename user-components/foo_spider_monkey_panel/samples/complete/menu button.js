'use strict';

window.DefineScript('Menu Button', {author:'marc2003', options:{grab_focus:false}});
include(fb.ComponentPath + 'samples\\complete\\js\\lodash.min.js');
include(fb.ComponentPath + 'samples\\complete\\js\\helpers.js');
include(fb.ComponentPath + 'samples\\complete\\js\\panel.js');

let panel = new _panel(true);
let buttons = new _buttons();
buttons.buttons.menu = new _button(0, 0, 36, 36, {normal : 'misc\\foobar2000.png'}, (x, y, mask) => { _menu(0, 36); }, 'Menu');

function on_focus(is_focused) {
	if (is_focused) {
		plman.SetActivePlaylistContext();
	}
}

function on_size() {
	panel.size();
}

function on_paint(gr) {
	panel.paint(gr);
	buttons.paint(gr);
}

function on_mouse_move(x, y) {
	buttons.move(x, y);
}

function on_mouse_leave() {
	buttons.leave();
}

function on_mouse_lbtn_up(x, y, mask) {
	buttons.lbtn_up(x, y, mask);
}

function on_mouse_rbtn_up(x, y) {
	if (buttons.buttons.menu.trace(x, y)) {
		_help(0, 36);
		return true;
	} else {
		return panel.rbtn_up(x, y);
	}
}

function on_colours_changed() {
	panel.colours_changed();
	window.Repaint();
}
