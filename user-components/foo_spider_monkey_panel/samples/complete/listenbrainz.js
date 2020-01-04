/*
https://listenbrainz.org/

The button logo will remain grey and do nothing until your add
your user token. Click the button to do this. When it changes
to colour, "listens" are submitted after half the track has played
or 4 minutes has passed (the same rules as Last.fm). Clicking the
button will also reveal a few other options.

If ListenBrainz is down or there are other connectivity issues,
the script will cache any failed listens and try again the next time
a listen is succesful. This happens automatically and cannot be triggered
manually. Look out for all activity in the foobar2000 console via the View menu.

Note that any listens that trigger a code 400 error from the listenbrainz server
are malformed and cannot be retried.

Please note that your token will be stored inside a plain text .ini file inside
%appdata%\foobar2000\js_data\listenbrainz.ini (or inside the program folder itself if in portable mode)
*/

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
