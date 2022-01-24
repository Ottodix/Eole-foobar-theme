'use strict';

if (typeof my_utils === 'undefined') include('scripts\\utils.js');

const loadAsync = window.GetProperty('Load Biography Asynchronously', true);

async function readFiles(files) {
		for (const file of files) {
		if (window.ID) { // fix pss issue
			await include(my_utils.getScriptPath + file);
		}
	}
}

const files = [
	'helpers.js',
	'properties.js',
	'settings.js',
	'interface.js',
	'panel.js',
	'web.js',
	'names.js',
	'scrollbar.js',
	'buttons.js',
	'menu.js',
	'text.js',
	'tagger.js',
	'resize.js',
	'library.js',
	'images.js',
	'filmstrip.js',
	'timers.js',
	'popupbox.js',
	'initialise.js',
	'callbacks.js'
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