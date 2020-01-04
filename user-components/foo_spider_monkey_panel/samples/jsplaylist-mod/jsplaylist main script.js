window.DefinePanel('JSPlaylist', {author: 'Br3tt', version: 'SMP-Mod', features: {drag_n_drop: true}});

['WSHcommon.js',
'WSHinputbox.js',
'WSHtopbar.js',
'WSHscrollbar.js',
'WSHheaderbar.js',
'WSHplaylist.js',
'WSHplaylistmanager.js',
'WSHsettings.js',
'main.js'].forEach(function (item) {
	include(fb.ComponentPath + 'samples\\jsplaylist-mod\\js\\' + item);
});

/*
[Features]
 * Groups (collpase or expand, add extra lines, ...)
 * Custom Group By patterns with Playlist Filter feature like in ELPlaylist
 * Custom Panel Colors
 * Smooth Scrolling
 * Arrange columns as you want, create custom columns with titleformatting and specific color
 * Playlist Header at Top (can be disabled)
 * Wallpaper as background supported (including a new blur effect)
 * Playlist Manager collapsable panel
 * Built in Settings Panel (still some minor parameter to edit in Properties of the panel)
 * Sort by clicking column header
 * Windows scaling compliant (dpi)
 * Playback statistics Engine (update file tags, now asynchronously on tracks ending)
 * ... and more!

[Tips]
 * Hold SHIFT key + right click on a toolbar to display Configure script and panel Properties entries
 * Change colors and fonts in foobar2000 Preferences > DefaultUI or ColumsUI
 * Some minor settings can be changed in window Properties (right click on a playlist item > Settings...), use it carefully! main settings are now built in the panel with a graphic interface
 * Left click on a column header to sort the playlist on this field
 * Right click on the columns toolbar to edit Columns and Groups layout and features
 * Use Keyboard for searching artist in the playlist (incremental search feature like in ELPlaylist) or to navigate in playlist
 * Right Click on items for contextual menu for the selection
 * TAB key or Middle Click to toggle the Playlist Manager
 * CTRL+T to toggle the columns toolbar
 * CTRL+I to toggle the top Info panel
 * CTRL+C, CTRL+X, CTRL+V to copy/cut/paste using the Windows Clipboard. Clipboard contents can now be pasted in Windows Explorer.
 * Hold CTRL + Mouse Wheel to scale elements (useful for 'retina' screens)
 * F2 key to rename active playlist in playlist manager panel
 * F5 key to refresh covers
 * Special fields handled in columns TF: %list_index%, %list_total%, %isplaying%
 * Special TF function to set specific color for the text that follows it: $rgb(r,g,b) with r,g,b as decimal values [0;255]
   do not use $rgb(,r,g,b) in a test condition compare but always for the result part (then or else):
   ==> avoid this: $if($rgb(0,0,0)%title%,%title%,,)
   ==> but do this: $if(%title%,$rgb(0,0,0)%title%,,)
 * Playlist Filter Groups pattenrs: Set a group by pattern to a playlist thru Groups settings tab or by rigth clicking playlist manager item
 * ... etc
*/
