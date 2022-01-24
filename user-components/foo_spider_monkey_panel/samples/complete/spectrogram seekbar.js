'use strict';

/*
Limitations:
Since the script passes the filename to ffmpeg for decoding, your input components are irrelevant.
It only works on local files with a known length.
Cue sheets/files with chapters are not supported.

This script requires ffmpeg and sox to decode and generate a spectrogram image which is used
as the background for the seekbar. You'll need to download and extract them manually.
The paths below can be edited.

https://sourceforge.net/projects/sox/files/
https://www.gyan.dev/ffmpeg/builds/
*/

window.DefineScript("Spectrogram Seekbar", {author:"marc2003", options:{grab_focus:false}});
["lodash.min.js", "helpers.js", "seekbar.js"].forEach(function (item) {
	include(fb.ComponentPath + "samples\\complete\\js\\" + item);
});

var sox_exe = fb.ProfilePath + "sox\\sox.exe";
var ffmpeg_exe = fb.ProfilePath + "sox\\ffmpeg.exe";

var working = false;
var spectrogram_cache = folders.data + "spectrogram_cache\\";
_createFolder(folders.data);
_createFolder(spectrogram_cache);

var properties = {
	// don't edit these, use the right click menu options
	params : window.GetProperty("2K3.SOX.PARAMS", "channels 1 spectrogram -Y 130"),
	marker_colour : window.GetProperty("2K3.MARKER.COLOUR", _RGB(240, 240, 240)),
	library_only : window.GetProperty("2K3.LIBRARY.ONLY", true)
}

var img = {
	hourglass : _chrToImg('\uF254', properties.marker_colour),
	spectrogram : null,
	filename : ""
};

var tfo = {
	path : fb.TitleFormat("$crc32($lower($substr(%path%,4,$len(%path%))))"),
	cue : fb.TitleFormat("$if($or($strcmp(%__cue_embedded%,yes),$strcmp($right(%path%,3),cue)),cue,)")
};

var seekbar = new _seekbar(0, 0, 0, 0);
if (fb.IsPlaying) on_playback_new_track();

function on_size() {
	seekbar.w = window.Width;
	seekbar.h = window.Height;
}

function on_paint(gr) {
	gr.FillSolidRect(seekbar.x, seekbar.y, seekbar.w, seekbar.h, _RGB(0, 0, 0));
	if (working) {
		_drawImage(gr, img.hourglass, seekbar.x, seekbar.y, seekbar.w, seekbar.h, image.centre);
	} else if (img.spectrogram) {
		_drawImage(gr, img.spectrogram, seekbar.x, seekbar.y, seekbar.w, seekbar.h, image.stretch);
	}
	if (fb.IsPlaying && fb.PlaybackLength > 0) {
		gr.FillSolidRect(seekbar.x + seekbar.pos() - 2, seekbar.y, 2, seekbar.h, properties.marker_colour);
	}
}

function on_playback_new_track() {
	var metadb = fb.GetNowPlaying();
	if (!metadb) return;
	img.spectrogram = null;
	img.filename = spectrogram_cache + properties.params + "_" + tfo.path.Eval() + ".png";
	switch(true) {
    case !utils.IsFile(sox_exe):
        console.log(N, "Skipping... sox.exe was not found. Check the path set in the script.");
        break;
    case !utils.IsFile(ffmpeg_exe):
        console.log(N, "Skipping... ffmpeg.exe was not found. Check the path set in the script.");
        break;
    case !utils.IsDirectory(spectrogram_cache):
        console.log(N, "Skipping... spectrogram_cache folder was not found. Check the path set in the script.");
        break;
	case utils.IsFile(img.filename):
		img.spectrogram = gdi.Image(img.filename);
		break;
	case metadb.RawPath.indexOf("file") != 0:
		console.log(N, "Skipping... Not a valid file type.");
		break;
	case fb.PlaybackLength == 0:
		console.log(N, "Skipping... Unknown length.");
		break;
	case tfo.cue.Eval() == "cue":
		console.log(N, "Skipping... Cannot support cuesheets.");
		break;
	case metadb.SubSong > 0:
		console.log(N, "Skipping... Cannot support tracks with chapters.");
		break;
	case properties.library_only && !fb.IsMetadbInMediaLibrary(metadb):
		console.log(N, "Skipping... Track not in library.");
		break;
	default:
		working = true;
		window.Repaint();
		var length = utils.FormatDuration(fb.PlaybackLength);
		var cmd = "cmd /c " + _q(_q(ffmpeg_exe) + " -i " + _q(metadb.Path) + " -t " + length + " -f sox - | " + _q(sox_exe) + " -p -n " + properties.params + " -d " + length + " -r -o " + _q(img.filename));
		//console.log(cmd);
		_runCmd(cmd, true);
		working = false;
		img.spectrogram = gdi.Image(img.filename);
		break;
	}
	window.Repaint();
}

function on_playback_seek() {
	seekbar.playback_seek();
}

function on_playback_stop() {
	seekbar.playback_stop();
}

function on_mouse_wheel(s) {
	seekbar.wheel(s);
}

function on_mouse_move(x, y) {
	seekbar.move(x, y);
}

function on_mouse_lbtn_down(x, y) {
	seekbar.lbtn_down(x, y);
}

function on_mouse_lbtn_up(x, y) {
	seekbar.lbtn_up(x, y);
}

function on_mouse_rbtn_up(x, y) {
	var menu = window.CreatePopupMenu();
	var sub = window.CreatePopupMenu()
	
	menu.AppendMenuItem(MF_STRING, 1, "SoX options...");
	menu.AppendMenuSeparator();
	menu.AppendMenuItem(MF_STRING, 2, "Marker colour...");
	menu.AppendMenuSeparator();
	menu.AppendMenuItem(MF_STRING, 3, "Only analyse tracks in library");
	menu.CheckMenuItem(3, properties.library_only);
	menu.AppendMenuSeparator();
	sub.AppendMenuItem(MF_STRING, 10, "Clear all");
	sub.AppendMenuItem(MF_STRING, 11, "Clear older than 1 day");
	sub.AppendMenuItem(MF_STRING, 12, "Clear older than 1 week");
	sub.AppendMenuSeparator();
	sub.AppendMenuItem(MF_GRAYED, 20, "In use: " + utils.FormatFileSize(fso.GetFolder(spectrogram_cache).Size));
	sub.AppendTo(menu, MF_STRING, "Cached images");
	menu.AppendMenuSeparator();
	menu.AppendMenuItem(MF_STRING, 30, "Configure...");
	
	var idx = menu.TrackPopupMenu(x, y);
	
	switch (idx) {
	case 0:
		break;
	case 1:
		var tmp = utils.InputBox(window.ID, "All SoX spectrogram options should work here.\n\n-r, -d and -o are already configured so do not use those. Check sox.pdf for everything else.", window.ScriptInfo.Name, properties.params);
		if (tmp != properties.params) {
			properties.params = tmp;
			window.SetProperty("2K3.SOX.PARAMS", properties.params);
			if (fb.IsPlaying) on_playback_new_track();
		}
		break;
	case 2:
		var tmp = utils.ColourPicker(window.ID, properties.marker_colour);
		if (tmp != properties.marker_colour) {
			properties.marker_colour = tmp;
			window.SetProperty("2K3.MARKER.COLOUR", properties.marker_colour);
			img.hourglass = _chrToImg('\uF254', properties.marker_colour);
			window.Repaint();
		}
		break;
	case 3:
		properties.library_only = !properties.library_only;
		window.SetProperty("2K3.LIBRARY.ONLY", properties.library_only);
		break;
	case 10:
	case 11:
	case 12:
		var files = utils.Glob(spectrogram_cache + "/*.*");
		files.forEach(function (item) {
			if (idx == 10 || (idx == 11 && _fileExpired(item, ONE_DAY)) || (idx == 12 && _fileExpired(item, ONE_DAY * 7))) _deleteFile(item);
		});
		break;
	case 30:
		window.ShowConfigure();
		break;
	}
	return true;
}
