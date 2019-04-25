IMPORTANT : THIS THEME REQUIRE FOOBAR 1.4 (or superior) !

INSTALLATION  ---------------------------------------

0: Close foobar.

1: Download this github repository and copy everything into your foobar installation directory (so the 4 folders: components, user-components, themes and plugins). 
The archive contain all the files and the required foobar components (columns UI, ui hacks, spider monkey panel, shpeck, elplaylist, panel stack splitter, playcount). 

2: Run foobar, choose ColumnUI as user interface (from the prompt, or from File > Preferences > Display)

3 : From Columns UI in File > Preferences > Display > Columns UI, click on import, and select the following file: [YOUR_FOOBAR_DIRECTORY]\themes\eole\columnsUI_eole.fcl.

4: For the lyrics on the "now playing" tab, you need to configure the sources of the ESlyrics component. Click the Foobar button on top > File > Preferences > Tools > ESlyrics > Search. Click on "Update".

5: Configure the winamp directory in shpeck for the visualisations, it's at the bottom of the preferences window: Click the Foobar button on top > File > Preferences > Visualisations > Shpeck. Click on the browse buttom and select the directory [YOUR_FOOBAR_DIRECTORY]\plugins\winamp. Now on the visualisation tab, you can do a right click and select Milkdrop in the "Autostart Plugin" submenu.

WARNING : shpeck is an unstable component, so if it doesn't work or make foobar crash on your computer, you'll have to figure what's wrong yourself, you can try to find the lastest informations at the end of the discussion topic of shpeck here http://tinyurl.com/hr2ybp2, or remove completely the visualisations (you will need to edit the theme a little bit for that: hold SHIFT and right click the visualisation tab at the top and select Properties. In the properties window, turn the value of "_PROPERTY show visualisation tab" to false). And remove the speck component at the bottom of the panel list in File > Preferences > Display > Columns UI > Layout.

6: Optionaly, only if you want an extra polish, change the systray icon: Click the Foobar button on top > File > Preferences > Display > Columns UI > On the right, notification area tab > Tick Use custom icon > Click Select icon... and select the file [YOUR_FOOBAR_DIRECTORY]\themes\eole\img\systray icons\white\uniEC4F.ico (or any of the alternative icons in this folder)

END: That's it! Enjoy your sound.

USEFUL TO KNOW  ---------------------------------------

For the covers, there is a cache system, so, if you want to update a cover, you must manually refresh it in foobar, do a right click over the cover which need to be refreshed, and you will have a menu item for that.
The library browser panel have an option to load every covers from the image cache at startup which is enabled by default and allow to browse your library without waiting for the covers to load. Foobar memory usage is higher when this option is enabled , because all the covers are loaded into the memory. This option work only if the image cache is already built: the image cache is built little by little: when a cover is displayed, if it isn't stored yet in the cache, it will be added to the cache.

Otherwise, that's all, you'll discover the others options yourself, do a right click over the panels for that, or look for the hamburger icons. And if you want to get your hands dirty and edit a panel, press SHIFT and do a right click, you will then have a configure option, and you will see from the code which file contains the related script.

