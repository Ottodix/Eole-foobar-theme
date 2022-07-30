# Eole Foobar theme

This is a skin for the [foobar2000](https://www.foobar2000.org) audio player.
This theme requires Foobar2000 version 1.4 (or newer).
Follow the instructions below to install it properly.

## Installation

0. Close foobar.

1. Download this [github repository](https://github.com/Ottodix/Eole-foobar-theme/zipball/master/) and copy each folder into your foobar profile directory (`user-components`, `themes`, and `plugins`).
   - STANDARD foobar2000 installation: your foobar profile directory is in here: `%AppData%/foobar2000`
   - PORTABLE foobar2000 installation: your foobar profile directory is in a folder named "`profile`" inside your installation directory.

2. Run foobar, choose `ColumnUI` as user interface (from the prompt, or in `File` > `Preferences` > `Display`).

3. From the Columns UI settings in `File` > `Preferences` > `Display` > `Columns UI`, click on `Import`, and select the following file: `[FOOBAR_PROFILE_DIRECTORY]\themes\eole\columnsUI_eole.fcl`.

4. Configure the Winamp directory in Shpeck for the visualisations, it's at the bottom of the preferences window: Click the `Foobar` button in the top left and navigate to `File` > `Preferences` > `Visualisations` > `Shpeck`. Click on the `...` button in the top right to browse and select the directory `[FOOBAR_PROFILE_DIRECTORY]\plugins\winamp`. Validate, close the preferences, and go to the `Visualization` tab of the skin. Right click and select `Milkdrop` in the `Autostart Plugin` submenu.

5. Optionally, if you want some extra polish you can change the systray icon: Click the `Foobar` button in the top left and navigate to `File` > `Preferences` > `Display` > `Columns UI`. Go to the `Notification area` tab and tick `Use custom icon`, then click `Select icon...` and select the file `[FOOBAR_PROFILE_DIRECTORY]\themes\eole\img\systray icons\white\uniEC4F.ico` (or any of the alternative icons in this folder).

That's it! Enjoy your music!

WARNING: The visualization tab is powered by Shpeck, which can be unstable. So if it doesn't work or it makes foobar crash on your computer, you'll have to figure what's wrong yourself. You can try to find the lastest informations at the end of the discussion topic of Shpeck here http://tinyurl.com/hr2ybp2, or completely remove the visualisations (you will need to edit the theme a little bit for that: right click the `Visualization` tab at the top and select `Settings`. Check `Hide visualization panel`. Remove the Shpeck component at the bottom of the panel list in `File` > `Preferences` > `Display` > `Columns UI` > `Layout`).

## Useful to know

- Eole uses a cover cache. The cover cache is built little by little: when a cover is displayed, if it isn't stored yet in the cache, it will be added to it. So on first display of any cover, it will be a little bit slow, but it will be a lot faster on subeequent displays. This cache is based on the `%album artist%` and `%album%` tags. After updating an existing cover, you must manually refresh it in foobar. Just right click on the cover needing to be refreshed and click `Refresh this image`.

- The library browser panel has an option to load every cover from the image cache at startup, which is enabled by default and allows to browse your library without waiting for the covers to load. Foobar memory usage is higher when this option is enabled, because all the covers are loaded into memory. This option has an effect only once the image cache is already built, which is done little by little: when a cover is displayed, if it isn't stored yet in the cache, it will be added to the cache.

- Most panels have a settings menu which can be accessed with a right click. You can also look for the hamburger (3 dots) menu icons. And if you want to get your hands dirty and edit a panel, press `SHIFT` when right clicking and click `Configure` to see which files contain the related scripts.

## Credits
- [TheQwertiest](https://github.com/TheQwertiest): Spider Monkey Panel, which powers most of this theme [foo_spider_monkey_panel](https://github.com/TheQwertiest/foo_spider_monkey_panel)
- [marc2003](https://github.com/marc2k3): original [foo_jscript_panel](https://github.com/marc2k3/foo_jscript_panel)
- [T.P. Wang](https://hydrogenaud.io/index.php?action=profile;u=44175): original [WSH Panel Mod](https://code.google.com/archive/p/foo-wsh-panel-mod).
- [Br3tt aka Falstaff](https://www.deviantart.com/br3tt): original code for most of the panels
- [WilB](https://hydrogenaud.io/index.php?action=profile;u=33113): original code of the library tree panel, and biography panel
