This is a skin for the [foobar2000](https://www.foobar2000.org) audio player.

THIS THEME REQUIRE FOOBAR 1.4 (or superior) !

## Installation

0. Close foobar.

1. Copy everything into your foobar profile directory (so the 3 folders: user-components, themes and plugins).
STANDARD installation: your foobar profile directory is there: %AppData%/foobar2000
PORTABLE installation: your foobar profile directory is the same than you installation directory.

2. Run foobar, choose ColumnUI as user interface (from the prompt, or from File > Preferences > Display)

3. From Columns UI in File > Preferences > Display > Columns UI, click on import, and select the following file: [FOOBAR_PROFILE_DIRECTORY]\themes\eole\columnsUI_eole.fcl.

4. Configure the winamp directory in shpeck for the visualisations, it's at the bottom of the preferences window: Click the Foobar button on top > File > Preferences > Visualisations > Shpeck. Click on the browse buttom and select the directory [FOOBAR_PROFILE_DIRECTORY]\plugins\winamp. Now on the visualisation tab, you can do a right click and select Milkdrop in the "Autostart Plugin" submenu.

5. Optionally, only if you want an extra polish, change the systray icon: Click the Foobar button on top > File > Preferences > Display > Columns UI > On the right, notification area tab > Tick Use custom icon > Click Select icon... and select the file [FOOBAR_PROFILE_DIRECTORY]\themes\eole\img\systray icons\white\uniEC4F.ico (or any of the alternative icons in this folder)

That's it! Enjoy your sound.

WARNING : The visualization tab is powered by shpeck, which can be unstable. So if it doesn't work or make foobar crash on your computer, you'll have to figure what's wrong yourself, you can try to find the lastest informations at the end of the discussion topic of shpeck here http://tinyurl.com/hr2ybp2, or remove completely the visualisations (you will need to edit the theme a little bit for that: hold SHIFT and right click the visualisation tab at the top and select Properties. In the properties window, turn the value of "_PROPERTY show visualisation tab" to false. And remove the speck component at the bottom of the panel list in File > Preferences > Display > Columns UI > Layout).

## Credits
- [TheQwertiest](https://github.com/TheQwertiest): Spider Monkey Panel, which powers most of this theme [foo_spider_monkey_panel](https://github.com/TheQwertiest/foo_spider_monkey_panel)
- [marc2003](https://github.com/marc2k3): original [foo_jscript_panel](https://github.com/marc2k3/foo_jscript_panel)
- [T.P. Wang](https://hydrogenaud.io/index.php?action=profile;u=44175): original [WSH Panel Mod](https://code.google.com/archive/p/foo-wsh-panel-mod).
- [Br3tt aka Falstaff](https://www.deviantart.com/br3tt): original code for most of the panels
- [WilB](https://hydrogenaud.io/index.php?action=profile;u=33113): original code of the library tree panel, and biography panel
