window.DefinePanel("JS Smooth Browser", { author : "Br3tt aka Falstaff" });
include(fb.ComponentPath + "samples\\js-smooth\\js\\JScommon.js");
include(fb.ComponentPath + "samples\\js-smooth\\js\\JSinputbox.js");
include(fb.ComponentPath + "samples\\js-smooth\\js\\jssb.js");

/*
[Features]
 * 2 sources possible: library or active playlist (initialy designed as a library browser)
 * 3 columns modes available: albums, artists, genres
 * 4 display modes avaliable: column, art+bottom label, art+right label, grid art view
 * True Smooth Scrolling
 * Screen Touch support
 * Header bar at Top (can be hidden with CTRL+T)
 * Vertical Scrollbar (can be hidden with CTRL+B)
 * Filter box
 * Custom or Cover art Wallpaper as background supported (including a blur effect)
 * Windows scaling compliant (you can adjust zoom size in real time with CTRL+mousewheel)
 * Custom Panel Colors (in Properties window)
 * ... and more!

[Tips]
 * for the ARTIST column mode, to make the disk cache working, artist images path have to be set in window Properties (SHIFT + right click > Properties)
 * Hold SHIFT key + right click to display Configure script and panel Properties entries
 * Change colors and fonts in foobar2000 Preferences > DefaultUI or ColumsUI
 * Some minor settings can be changed in window Properties (SHIFT + right click > Properties), use it carefully
 * Use Keyboard for "jumping" to an artist/genre in the library view (incremental search feature like in ELPlaylist)
 * Right Click on items for contextual menu for the selection
 * CTRL+T to toggle the columns toolbar
 * CTRL+B to toggle the scrollbar
 * Hold CTRL + Mouse Wheel to scale elements (useful for 'retina' screens)
 * Hold SHIFT + Mouse Wheel to scale group header and so the cover art size
 * F3 key to show now playing track (if present in library and not filtered)
 * F5 key to refresh covers
 * ... etc
*/
