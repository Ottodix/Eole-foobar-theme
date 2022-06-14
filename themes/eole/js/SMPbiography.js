'use strict';

if (typeof my_utils === 'undefined') include('biography\\scripts\\utils.js');

const loadAsync = window.GetProperty('Load Biography Asynchronously', true);

async function readFiles(files) {
		for (const file of files) {
		if (window.ID) { // fix pss issue
			await include(my_utils.getScriptPath + file);
		}
	}
}

const files = [
	'so.js',
	'helpers.js',
	'properties.js',
	'settings.js',
	'interface.js',
	'panel.js',
	'server.js',
	'allmusic.js',
	'lastfm.js',
	'wikipedia.js',
	'names.js',
	'scrollbar.js',
	'buttons.js',
	'menu.js',
	'text.js',
	'lyrics.js',
	'tagger.js',
	'resize.js',
	'library.js',
	'images.js',
	'filmstrip.js',
	'timers.js',
	'popupbox.js',
	'initialise.js',
	'callbacks.js',
	'eole.js'		
];

if (loadAsync) {
	readFiles(files).then(() => {
		if (!window.ID) return; // fix pss issue
		on_size();
		window.Repaint();
	});
} else {
	files.forEach(v => include(my_utils.getScriptPath + v));
}