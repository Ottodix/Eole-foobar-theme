var properties = {
	panelName: 'WSHsmoothplaylist',		
    ParentName:  window.GetProperty("_PROPERTY: Parent Panel", ""),	
    tf_artist: fb.TitleFormat("%artist%"),
    lockOnNowPlaying: window.GetProperty("lock on now playing playlist", true),
    lockOnPlaylistNamed: window.GetProperty("lock on specific playlist name", ""),	
    tf_albumartist: fb.TitleFormat("%album artist%"),
    tf_groupkey: fb.TitleFormat("$if2(%album%[' - Disc '%discnumber%],$if(%length%,'?',%path%)) ^^ $if2(%album artist%,$if(%length%,'Unknown artist(s)',%title%)) ^^ %discnumber% ## $if2(%artist%,$if(%length%,'Unknown artist',%path%)) ^^ %title% ^^ [%genre%] ^^ [%date%]"),
    tf_track: fb.TitleFormat("%tracknumber% ^^ $if(%length%,%length%,ON AIR) ^^ $if2(%rating%,0) ^^ %mood%"),
    tf_path: fb.TitleFormat("$directory_path(%path%)\\"),
    tf_time_remaining: fb.TitleFormat("$if(%length%,-%playback_time_remaining%,'ON AIR')"),
    tf_elapsed_seconds: fb.TitleFormat("$if(%length%,%playback_time_seconds%,'ON AIR')"),	
    tf_total_seconds: fb.TitleFormat("$if2(%length_seconds%,'ON AIR')"),		
    defaultRowHeight: window.GetProperty("_PROPERTY: Row Height", 25),
    doubleRowPixelAdds: 13,
    drawAlternateBG: window.GetProperty("PROPERTY: Alternate row background", false),	
    rowScrollStep: 3,
    scrollSmoothness: 2.5,
	track_gradient_margin: 13,	
	track_gradient_size: 13,
    refreshRate: 35,
    refreshRateCover: 5,
	drag_scroll_speed_ms: 100,
    extraRowsNumber: window.GetProperty("_PROPERTY: Number of Extra Rows per Group", 1),
    minimumRowsNumberPerGroup: window.GetProperty("_PROPERTY: Number minimum of Rows per Group", 0),
    groupHeaderRowsNumber: window.GetProperty("_PROPERTY: Number of Rows for Group Header", 2),
    groupHeaderRowsNumberDouble: window.GetProperty("_PROPERTY: Number of Rows for Group Header, when double line is enabled", 1),	
    albumArtId: 0,
    showHeaderBar: window.GetProperty("_DISPLAY: Show Top Bar", true),
	showToolTip: window.GetProperty("_DISPLAY: display a tooltip", true),
    defaultHeaderBarHeight: 40,
    libraryHeaderBarHeight: 40,	
    headerBarHeight: 40,
    headerBarPaddingTop: 2,	
    expandBySingleClick: window.GetProperty("_PROPERTY: Expand Group By Single Click", true),	
    enableFullScrollEffectOnFocusChange: false,
    enableCustomColors: window.GetProperty("_PROPERTY: Custom Colors", true),
	darklayout: window.GetProperty("_DISPLAY: Dark layout", false),		
    minimode_dark_theme: window.GetProperty("MINIMODE dark theme", false),	
    library_dark_theme: window.GetProperty("LIBRARY dark theme", false),
    screensaver_dark_theme: window.GetProperty("SCREENSAVER dark theme", false),		
    playlists_dark_theme: window.GetProperty("PLAYLISTS dark theme", false),
    bio_dark_theme: window.GetProperty("BIO dark theme", false),	
	bio_stick2darklayout: window.GetProperty("BIO stick to Dark layout",false),
    visualization_dark_theme: window.GetProperty("VISUALIZATION dark theme", false),	
    showwallpaper: window.GetProperty("_DISPLAY: Show Wallpaper", false),	
    wallpaperblurred: window.GetProperty("_DISPLAY: Wallpaper Blurred", true),
    wallpaperblurvalue: window.GetProperty("_DISPLAY: Wallpaper Blur Value", 1.05),
    wallpapermode: window.GetProperty("_SYSTEM: Wallpaper Mode", 0),
    wallpaperdisplay: window.GetProperty("_DISPLAY: Wallpaper 0=Filling 1=Adjust 2=Stretch", 0),		
    defaultPlaylistItemAction: window.GetProperty("_PROPERTY: Default Playlist Action", "Play"), //"Add to playback queue"
    globalFontAdjustement: window.GetProperty("MAINPANEL: Global Font Adjustement", -1),
    showFilterBox: window.GetProperty("_PROPERTY: Enable Playlist Filterbox in Top Bar", true),
    doubleRowText: window.GetProperty("_PROPERTY: Double Row Text Info", false),
    doubleRowShowCover: window.GetProperty("_PROPERTY: Double Row Show Cover", true),	
    showArtistAlways: window.GetProperty("_DISPLAY: Show Artist in Track Row", true),
    showRating: window.GetProperty("_DISPLAY: Show Rating in Track Row", false),
    showRatingSelected: window.GetProperty("_DISPLAY: Show Rating in Selected Track Row", false),	
    showRatingRated: window.GetProperty("_DISPLAY: Show Rating in Rated Track Row", false),			
    drawUpAndDownScrollbar: window.GetProperty("PROPERTY: Draw Up and Down Scrollbar Buttons", false),	
    showMood: window.GetProperty("_DISPLAY: Show Mood in Track Row", false),
    drawProgressBar: window.GetProperty("_DISPLAY Draw a progress bar under song title", true),		
    AlbumArtProgressbar: window.GetProperty("_DISPLAY Album art progress bar", true),			
    enableTouchControl: window.GetProperty("_PROPERTY: Touch control", false),
    DropInplaylist: window.GetProperty("_SYSTEM: Allow to drag items into a playlist", false),
    thumbnailWidthMin: window.GetProperty("COVER Width Minimal", 50),
    thumbnailWidth: window.GetProperty("COVER Width", 75),
	circleMode: window.GetProperty("COVER Circle artwork", false),		
	showSettingsMenu: window.GetProperty("_DISPLAY Show Settings context menu", true),
	enableAutoSwitchPlaylistMode: window.GetProperty("Automatically change displayed playlist", true),
    showGroupHeaders: window.GetProperty("_DISPLAY: Show Group Headers", true),
    autocollapse: window.GetProperty("_PROPERTY: Autocollapse groups", false),
    addedRows_end_default: window.GetProperty("_PROPERTY: empty rows at the end", 1),
    load_covers_at_startup: window.GetProperty("COVER Load all at startup", true),		
    enableDiskCache: window.GetProperty("COVER Disk Cache", true),	
	margin_bottom:0,
	panelFontAdjustement: 0,
	load_image_from_cache_direct:true
};
properties.rowHeight = properties.defaultRowHeight;
properties.groupHeaderRowsNumberSimple = properties.groupHeaderRowsNumber;

var TF = {
	genre: fb.TitleFormat('%genre%'),		
	albumartist: fb.TitleFormat("%album artist%"),	
	album: fb.TitleFormat("%album%"),
	genre: fb.TitleFormat("%genre%"),
	date: fb.TitleFormat("%date%"),
	play_count: fb.TitleFormat("%play_count%"),
	playback_time_seconds: fb.TitleFormat("%playback_time_seconds%"),
	title: fb.TitleFormat("%title%"),
	radio_artist: fb.TitleFormat("$if2(%artist%,%bitrate%'K')"),
}


function set_display_properties(properties_name,value) {
	if(layout_state.isEqual(1)){
        switch(properties_name) {
            case "showGroupHeaders":
				MiniMode_properties.showGroupHeaders = value;
				window.SetProperty("_DISPLAY_MiniMode: Show Group Headers", value)
                break;
            case "autocollapse":
				MiniMode_DisplayProperties.autocollapse = value;
				window.SetProperty("_PROPERTY_MiniMode: Autocollapse groups", value)
                break;
        };
	} else {
        switch(properties_name) {
            case "showGroupHeaders":
				properties.showGroupHeaders = value;
				window.SetProperty("_DISPLAY: Show Group Headers", value)
                break;
            case "autocollapse":
				DisplayProperties.autocollapse = value;
				window.SetProperty("_PROPERTY: Autocollapse groups", value)
                break;
        };		
	}
}

function get_display_properties(properties_name) {
	if(layout_state.isEqual(1)){
        switch(properties_name) {
            case "showGroupHeaders":
				return MiniMode_properties.showGroupHeaders
                break;
            case "autocollapse":
				return MiniMode_DisplayProperties.autocollapse
                break;
        };
	} else {
        switch(properties_name) {
            case "showGroupHeaders":
				return properties.showGroupHeaders
                break;
            case "autocollapse":
				return DisplayProperties.autocollapse
                break;
        };		
	}
}
var gradient_w = 31;
var gradient_m = 15;
var draw_right_line = false;
var g_active_playlist = null;
var Update_Required_function = "";
var playing_track_playcount = 0;
var update_size = true;
var first_on_size = true;
var nowplaying_cachekey = '';
var toPlaylistIdx = -1;
var g_avoid_playlist_displayed_switch = false;
if(!properties.showGroupHeaders) properties.extraRowsNumber=0;
cTouch = {
    down: false,
    y_start: 0,
    y_end: 0,
    y_current: 0,
    y_prev: 0,
    y_move: 0,
    scroll_delta: 0,
    t1: null, 
    timer: false,
    multiplier: 0,
    delta: 0
};

cSettings = {
    visible: false
};

cFilterBox = {
    enabled: window.GetProperty("_PROPERTY: Enable Filter Box", true),
    default_w: 120,
    default_h: 20,
    x: 5,
    y: 2,
    w: 120,
    h: 20
};

cColumns = {
    dateWidth: 0,
    albumArtistWidth: 0,
    titleWidth: 0,
    genreWidth: 0,
	artistWidth: 0,
};

cPlaylistManager = {
    default_width: 230,
    width: 0,
    default_topbarHeight: 44,
    topbarHeight: 44,
    default_botbarHeight: 11,
    botbarHeight: 11,
    default_scrollbarWidth: 10,
    scrollbarWidth: 10,
    default_rowHeight : 33,
    rowHeight: 33,
    blink_timer: false,
    blink_counter: -1,
    blink_id: null,
    blink_row: null,
    blink_totaltracks: 0,
    showTotalItems: window.GetProperty("_PROPERTY.PlaylistManager.ShowTotalItems", true)
};
cNowPlaying = {
    flashEnable: false,
    flashescounter: 0,
    flash: false,
	flashescountermax:40
}

cover = {
    masks: window.GetProperty("_PROPERTY: Cover art masks (used for the cache)","*front*.*;*cover*.*;*folder*.*;*.*"),
    show: window.GetProperty("_DISPLAY: Show Cover Art", true),
	column: false,
    draw_glass_reflect: false,
    glass_reflect: null,
    keepaspectratio: false,
    default_margin: 4,
    margin: 4,
    padding: 12,
	trackMargin:7,
	trackMarginRight:7,
    w: properties.groupHeaderRowsNumber * properties.rowHeight,
	max_w: properties.groupHeaderRowsNumber * properties.rowHeight,
    h: properties.groupHeaderRowsNumber * properties.rowHeight,
	max_h: properties.groupHeaderRowsNumber * properties.rowHeight,
    nocover_img: gdi.Image(theme_img_path+"\\no_cover.png"),	
    stream_img: gdi.Image(theme_img_path+"\\stream_icon.png"),	
	previous_max_size: -1,
	resized: false
};

images = {
    path: theme_img_path + "\\",
    glass_reflect: null,
    loading_angle: 0,
    loading_draw: null,
    noart: null,
    stream: null,
	now_playing_1: gdi.Image(theme_img_path + "\\graphic_browser\\now_playing_track1.png"),
	now_playing_0: gdi.Image(theme_img_path + "\\graphic_browser\\now_playing_track0.png")	
};

cList = {
	search_string: "",
    inc_search_noresult: false,
	clear_incsearch_timer: false,
	incsearch_timer: false
};

timers = {
    coverLoad: false,
    coverDone: false,
    mouseWheel: false,
    saveCover: false,
    mouseDown: false,
    showPlaylistManager: false,
    resize: false,	
    hidePlaylistManager: false,
	showToolTip: false,
	reactive_playlist: false,
	callback_avoid_populate: false,
	ratingUpdate: false,
};

dragndrop = {
    enabled: true,
    contigus_sel: null,
    x: 0,
    y: 0,
    drag_id: -1,
    drop_id: -1,
    timerID: false,
    drag_in: false,
    drag_out: false,
    clicked: false,
    moved: false
};

/* 
===================================================================================================
    Images cache
===================================================================================================
*/
function reset_cover_timers() {
    if(timers.coverDone) {
        timers.coverDone && clearTimeout(timers.coverDone);
        timers.coverDone = false;
    };
};

function on_load_image_done(tid, image){
    var tot = brw.groups.length;

    for(var k = 0; k < tot; k++) {
        if(brw.groups[k].metadb) {
            if(brw.groups[k].tid == tid && brw.groups[k].load_requested == 1) {
                brw.groups[k].load_requested = 2;
                brw.groups[k].cover_img = g_image_cache.getit(brw.groups[k].metadb, k, image);
                //if(!isScrolling && !cScrollBar.timerID) {
                    if(k < brw.groups.length && brw.groups[k].rowId >= g_start_ && brw.groups[k].rowId <= g_end_) {
                        //if(!timers.coverDone) {
                          //  timers.coverDone = setTimeout(function() {
                                g_1x1 = false;
                                brw.cover_repaint();
                              //  timers.coverDone && clearTimeout(timers.coverDone);
                                //timers.coverDone = false;
                           // }, 5);
                        //};
                    } else {
                        g_1x1 = true;
                        window.RepaintRect(0, 0, 1, 1);
                        g_1x1 = false;
                    };
                //};
                break;
            };
        };
    };
};

function on_get_album_art_done(metadb, art_id, image, image_path) {
    var tot = brw.groups.length;	
    if(properties.albumArtId != 0) {
        for(var i = 0; i < tot; i++) {
            if(brw.groups[i].metadb) {
                if(brw.groups[i].metadb.Compare(metadb)) {
					brw.groups[i].load_requested = 2;
                    brw.groups[i].cover_img = g_image_cache.getit(metadb, i, image);
                    //if(!isScrolling && !cScrollBar.timerID) {
                        if(i < brw.groups.length && brw.groups[i].rowId >= g_start_ && brw.groups[i].rowId <= g_end_) {
                            if(!timers.coverDone) {
                                timers.coverDone = setTimeout(function() {
                                    g_1x1 = false;
                                    brw.cover_repaint();
                                    timers.coverDone && clearTimeout(timers.coverDone);
                                    timers.coverDone = false;
                                }, 5);
                            };
                        } else {
                            g_1x1 = true;
                            window.RepaintRect(0, 0, 1, 1);
                            g_1x1 = false;
                        };
                    //};
                    break;
                };
            };
        };
    } else {
        var i = art_id - 5;
        g_last = i;
        if(i < tot) {
            if(brw.groups[i].metadb) {
                brw.groups[i].cover_img = g_image_cache.getit(metadb, i, image);
                //if(!isScrolling && !cScrollBar.timerID) {
                    if(i < brw.groups.length && brw.groups[i].rowId >= g_start_ && brw.groups[i].rowId <= g_end_) {
						brw.groups[i].load_requested = 2;
                        if(!timers.coverDone) {
                            timers.coverDone = setTimeout(function() {
                                g_1x1 = false;
                                brw.cover_repaint();
                                timers.coverDone && clearTimeout(timers.coverDone);
                                timers.coverDone = false;
                            }, 5);
                        };
                    } else {
                        g_1x1 = true;
                        window.RepaintRect(0, 0, 1, 1);
                        g_1x1 = false;
                    };
                //};
            };
        };
    };
};

//=================================================// Cover Tools
oImageCache = function () {
    this._cachelist = Array();
    this.hit = function (metadb, albumIndex) {
        try{var img = this._cachelist[brw.groups[albumIndex].cachekey];}catch(e){}
        if (typeof(img) == "undefined" || img == null) { // if image not in cache, we load it asynchronously	
                brw.groups[albumIndex].crc = check_cache(metadb, albumIndex);
                if(globalProperties.enableDiskCache && brw.groups[albumIndex].crc && brw.groups[albumIndex].crc!='undefined' && brw.groups[albumIndex].load_requested == 0) {
					//Dont save as its already in the cache
					brw.groups[albumIndex].save_requested=true;
					
                    // load img from cache
					if(!isScrolling  && !cScrollBar.timerID){
						var image = load_image_from_cache_direct(metadb, brw.groups[albumIndex].crc);
						img = this.getit(metadb, albumIndex, image);
						brw.groups[albumIndex].cover_img = img;
						brw.groups[albumIndex].load_requested = 2;
						//brw.cover_repaint();	
					} else if(!timers.coverLoad) {
                        timers.coverLoad = setTimeout(function() {
                            try {							
								if(properties.load_image_from_cache_direct) {
									image = load_image_from_cache_direct(metadb, brw.groups[albumIndex].crc);
									brw.groups[albumIndex].cover_img = g_image_cache.getit(metadb, albumIndex, image);
									brw.groups[albumIndex].load_requested = 2;
								} else {
									brw.groups[albumIndex].tid = load_image_from_cache(metadb, brw.groups[albumIndex].crc);
									brw.groups[albumIndex].load_requested = 1;											
								}								
                            } catch(e) {};
                            timers.coverLoad && clearTimeout(timers.coverLoad);
                            timers.coverLoad = false;
                        }, 5);
                    };
                } else if(brw.groups[albumIndex].load_requested == 0) {               
                    // load img default method
                    if(!timers.coverLoad) {
                        timers.coverLoad = setTimeout(function() {
                            this.albumArtId = properties.albumArtId == 0 ? albumIndex + 5 : properties.albumArtId;
							try{
								brw.groups[albumIndex].load_requested = 1;						
								//utils.GetAlbumArtAsync(window.ID, metadb, this.albumArtId, true, false, false);
								get_albumArt_async(metadb,this.albumArtId, true, false, false);
							} catch(e){}
                            timers.coverLoad && clearTimeout(timers.coverLoad);
                            timers.coverLoad = false;
                        }, (!isScrolling  && !cScrollBar.timerID ? 5 : 20));
                    };
                };
        }
        return img;
    };
    this.reset = function(key) {
        this._cachelist[key] = null;
    };
    this.getit = function (metadb, albumId, image) {
        var cw = globalProperties.thumbnailWidthMax;
        var ch = cw;
        var img = null;
        var cover_type = null;

        if(cover.keepaspectratio) {
            if(!image) {
                var pw = cw - cover.margin * 2;
                var ph = ch - cover.margin * 2;
            } else {
                if(image.Height>=image.Width) {
                    var ratio = image.Width / image.Height;
                    var pw = (cw - cover.margin * 2) * ratio;
                    var ph = ch - cover.margin * 2;
                } else {
                    var ratio = image.Height / image.Width;
                    var pw = cw - cover.margin * 2;
                    var ph = (ch - cover.margin * 2) * ratio;
                };
            };
        } else {
            var pw = cw - cover.margin * 2;
            var ph = ch - cover.margin * 2;
        };
        // cover.type : 0 = nocover, 1 = external cover, 2 = embedded cover, 3 = stream
        if(brw.groups[albumId].tracktype != 3) {
            if(metadb) {
                if(image) {
                    img = FormatCover(image, pw, ph, false);
                    cover_type = 1;
                } else {
                    //img = FormatCover(images.noart, pw, ph, false);
                    cover_type = 0;
                };
            };
        } else {
            cover_type = 3;
        };
        if(cover_type == 1) {
			try {
				this._cachelist[brw.groups[albumId].cachekey] = img;
			}
			catch (e) {
				
			}
        };
        // save img to cache
        if(globalProperties.enableDiskCache && cover_type == 1 && !brw.groups[albumId].save_requested && image) {
            if(!timers.saveCover) {
                brw.groups[albumId].save_requested = true;
                save_image_to_cache(image, albumId); 
                timers.saveCover = setTimeout(function() {
                    clearTimeout(timers.saveCover);
                    timers.saveCover = false;
                }, 100);
            };
        };
        
        brw.groups[albumId].cover_type = cover_type;
        
        return img;
    };
};



/* 
===================================================================================================
    Objects
===================================================================================================
*/
oPlaylist = function(idx, rowId) {
    this.idx = idx;
    this.rowId = rowId;
    this.name = plman.GetPlaylistName(idx);
    this.y = -1;
};

oPlaylistManager = function(name) {
    this.name = name;
    this.playlists = [];
    this.state = 0;  // 0 = hidden, 1 = visible
    // metrics
    this.scroll = 0;
    this.offset = 0;
    this.w = 250;
    this.h = brw.h - 100;
    this.x = ww;
    this.y = brw.y + 50;
    this.total_playlists = null;
    this.rowTotal = -1;
    this.drop_done = false;
    this.firstPopulateDone = false;
	this.refresh_required = false;	
    this.adjustPanelHeight = function() {
        // adjust panel height to avoid blank area under last visible item in the displayed list
        var target_total_rows = Math.floor((this.default_h - cPlaylistManager.topbarHeight) / cPlaylistManager.rowHeight);
        if(this.rowTotal != -1 && this.rowTotal < target_total_rows) target_total_rows = this.rowTotal;
        this.h = cPlaylistManager.topbarHeight + (target_total_rows * cPlaylistManager.rowHeight);
        this.y = this.default_y + Math.floor((this.default_h - this.h) / 2);       
       
        this.totalRows = Math.floor((this.h - cPlaylistManager.topbarHeight) / cPlaylistManager.rowHeight);
        this.max = (this.rowTotal > this.totalRows ? this.totalRows : this.rowTotal);
    };

    this.setSize = function(x, y, w, h) {
        this.default_x = x;
        this.default_y = y;
        this.default_w = w;
        this.default_h = h;  
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.totalRows = Math.floor((this.h - cPlaylistManager.topbarHeight) / cPlaylistManager.rowHeight);
        
        // adjust panel height / rowHeight + rowTotal (! refresh must have been executed once to have a valide rowTotal)
        this.adjustPanelHeight();
    };
    
    this.showPanel = function() {
		if(brw.drag_clicked){
			if(pman.offset < pman.w) {
				var delta = Math.ceil((pman.w - pman.offset) / 2);
				pman.offset += delta;
				brw.repaint();
			};
			if(pman.offset >= pman.w) {
				pman.offset = pman.w;
				window.ClearInterval(timers.showPlaylistManager);
				timers.showPlaylistManager = false;
				brw.repaint();
			};
		}
    };
  
    this.hidePanel = function() {
        if(pman.offset > 0) {
            var delta = Math.ceil((pman.w - (pman.w - pman.offset)) / 2);
            pman.offset -= delta;
            brw.repaint();
        };
        if(pman.offset < 1) {
            pman.offset = 0;
            pman.state = 0;
			pman.scroll	= 0;			
            window.ClearInterval(timers.hidePlaylistManager);
            timers.hidePlaylistManager = false;
            brw.repaint();
        };
    };
    
    this.populate = function(exclude_active, reset_scroll) {
        this.playlists.splice(0, this.playlists.length);
        this.total_playlists = plman.PlaylistCount;
        var rowId = 0;
        var isAutoPl = false;
        var isReserved = false;
        var plname = null;
		this.firstPopulateDone = true;
        for(var idx = 0; idx < this.total_playlists; idx++) {
            plname = plman.GetPlaylistName(idx);
            isAutoPl = plman.IsAutoPlaylist(idx);
            isReserved = (plname == "Queue Content" || plname == "Historic");

            if(!isAutoPl && !isReserved) {
                if(idx == plman.ActivePlaylist && properties.selectionPlaylist!=plname) {
                    if(!exclude_active) {
                        this.playlists.push(new oPlaylist(idx, rowId));
                        rowId++;
                    };
                } else if(properties.selectionPlaylist!=plname){
                    this.playlists.push(new oPlaylist(idx, rowId));
                    rowId++;
                };
            };
        };
        this.rowTotal = rowId;
        
        // adjust panel height / rowHeight + rowTotal
        this.adjustPanelHeight();
        
        if(reset_scroll || this.rowTotal <= this.totalRows) {
            this.scroll = 0;
        } else {
            //check it total playlist is coherent with scroll value
            if(this.scroll > this.rowTotal - this.totalRows) {
                  this.scroll = this.rowTotal - this.totalRows;
            };
        };
    };
    
        
    this.draw = function(gr) {
		if(!this.firstPopulateDone){
			this.populate(exclude_active = false, reset_scroll = true);
		}		
        if(this.offset > 0) {
			if(this.refresh_required) this.populate(exclude_active = false, reset_scroll = false);			
            // metrics
            var cx = this.x - this.offset;
            var ch = cPlaylistManager.rowHeight;
            var cw = this.w;
            var bg_margin_top = 2;
            var bg_margin_left = 10;
            var txt_margin = 10;
            var bg_color = colors.pm_bg;
            var txt_color = colors.pm_txt;
			var gradient_size = 30;
            // scrollbar metrics
            if(this.rowTotal > this.totalRows) {
                this.scr_y = this.y + cPlaylistManager.topbarHeight;
                this.scr_w = cPlaylistManager.scrollbarWidth;
                this.scr_h = this.h - cPlaylistManager.topbarHeight;
            } else {
                this.scr_y = 0;
                this.scr_w = 0;
                this.scr_h = 0;
            };

			//Overlay
			height_top_fix = (properties.showHeaderBar ? properties.headerBarHeight : 0)		
            gr.FillSolidRect(0, height_top_fix+1, ww, wh-height_top_fix-1, colors.pm_overlay);
			
			//Shadows
			gr.FillGradRect(cx,this.y-gradient_size,ww-(draw_right_line?1:0),gradient_size,90,colors.pm_shadow_on,colors.pm_shadow_off,0)
			gr.FillGradRect(cx,this.y + this.h + cPlaylistManager.botbarHeight,ww-(draw_right_line?1:0),gradient_size,90,colors.pm_shadow_on,colors.pm_shadow_off,1.0)
			//Main BG
			gr.FillSolidRect(cx, this.y, this.w, this.h + cPlaylistManager.botbarHeight + 1, colors.pm_bg);
			gr.FillSolidRect(cx, this.y, ww-(draw_right_line?1:0), 1, colors.pm_border);
			gr.FillSolidRect(cx, this.y + this.h + cPlaylistManager.botbarHeight, ww-(draw_right_line?1:0), 1, colors.pm_border);			
           // gr.FillSolidRect(cx + bg_margin_left, this.y + cPlaylistManager.topbarHeight - 2, this.w - bg_margin_left*2, 1, colors.pm_bg4);
            
            // ** items **
            var rowIdx = 0;
            var totalp = this.playlists.length;
            var start_ = this.scroll;
            var end_ = this.scroll + this.totalRows;
			var tw = 0;
            if(end_ > totalp) end_ = totalp;
            for(var i = start_; i < end_; i++) {
                cy = this.y + cPlaylistManager.topbarHeight + rowIdx*ch;
                this.playlists[i].y = cy;
                
                // ** item bg **
                gr.FillSolidRect(cx + bg_margin_left+5, cy + bg_margin_top-3, cw - bg_margin_left*2-10 - this.scr_w, 1, colors.pm_item_separator_line);
                
                // ** item text **
                // playlist total items
                if(cPlaylistManager.showTotalItems) {
                    t = plman.PlaylistItemCount(this.playlists[i].idx);
                    tw = gr.CalcTextWidth(t+"  ", g_font.min1);
                    gr.GdiDrawText(t, g_font.min1, blendColors(txt_color, bg_color, 0.2), cx + bg_margin_left + txt_margin, cy, cw - bg_margin_left*2 - txt_margin*2 - this.scr_w, ch, DT_RIGHT | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
                } else {
                    tw = 0;
                };
				
				//draw playing playlist icon
				if(fb.IsPlaying && this.playlists[i].idx == plman.PlayingPlaylist){
					gr.DrawImage(images.playing_playlist, cx + bg_margin_left + txt_margin - 9, cy+6, images.playing_playlist.Width, images.playing_playlist.Height, 0, 0, images.playing_playlist.Width, images.playing_playlist.Height,0,255);
					playlistname_padding_left = images.playing_playlist.Width - 6;
				} else playlistname_padding_left = 0;
				
                // draw playlist name
                if((this.activeIndex == i + 1 && cPlaylistManager.blink_counter < 0) || (cPlaylistManager.blink_id == i + 1 && cPlaylistManager.blink_row != 0)) {
                    gr.GdiDrawText("+ " + this.playlists[i].name , g_font.boldplus1, txt_color, cx + playlistname_padding_left + bg_margin_left + txt_margin, cy-1, cw - bg_margin_left*2 - txt_margin*2 - tw - this.scr_w, ch, DT_LEFT | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
                } else {
                    gr.GdiDrawText(this.playlists[i].name , g_font.normal, blendColors(txt_color, bg_color, 0.2), cx + playlistname_padding_left + bg_margin_left + txt_margin, cy-1, cw - bg_margin_left*2 - txt_margin*2 - tw - this.scr_w, ch, DT_LEFT | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
                };
                
				
                // draw flashing item on lbtn_up after a drag'n drop
                if(cPlaylistManager.blink_counter > -1) {
                    if(cPlaylistManager.blink_row != 0) {
                        if(i == cPlaylistManager.blink_id - 1) {
                            if(cPlaylistManager.blink_counter <= 6 && Math.floor(cPlaylistManager.blink_counter / 2) == Math.ceil(cPlaylistManager.blink_counter / 2)) {
                                gr.FillSolidRect(cx + bg_margin_left, cy +(cPlaylistManager.topbarHeight-40), cw - bg_margin_left*2 - this.scr_w, ch, colors.pm_blink);
                            };
                        };
                    };
                };
                
                rowIdx++;
            };
            			
            // top bar
            // draw flashing top bar item on lbtn_up after a drag'n drop
            if(cPlaylistManager.blink_counter > -1) {
                if(cPlaylistManager.blink_row == 0) {
					gr.GdiDrawText("+ Sent to a new Playlist" , g_font.boldplus1, txt_color, cx + bg_margin_left + txt_margin, this.y + cPlaylistManager.topbarHeight - 34, cw - bg_margin_left*2 - txt_margin*2 - tw - this.scr_w, ch, DT_LEFT | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
                    if(cPlaylistManager.blink_counter <= 6 && Math.floor(cPlaylistManager.blink_counter / 2) == Math.ceil(cPlaylistManager.blink_counter / 2)) {               
						cy_ = this.y + cPlaylistManager.topbarHeight + (this.activeRow-1)*ch;
						gr.FillSolidRect(cx + bg_margin_left, cy_ + bg_margin_top-3, cw - bg_margin_left*2 - this.scr_w, ch+1, colors.pm_blink);
						gr.DrawRect(cx + bg_margin_left, cy_ + bg_margin_top-3, cw - bg_margin_left*2 - this.scr_w - 1, ch, 1.0, colors.pm_blink_rectline);							
                    };
                } else {
                    gr.GdiDrawText("Send to ..." , g_font.italicplus1, txt_color, cx + bg_margin_left + txt_margin, this.y + cPlaylistManager.topbarHeight - 34, cw - bg_margin_left*2 - txt_margin*2 - tw - this.scr_w, ch, DT_LEFT | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
                };
            } else {
                if(this.activeRow == 0) {
                    gr.GdiDrawText("+ Send to a new Playlist" , g_font.boldplus1, txt_color, cx + bg_margin_left + txt_margin, this.y + cPlaylistManager.topbarHeight - 34, cw - bg_margin_left*2 - txt_margin*2 - tw - this.scr_w, ch, DT_LEFT | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
					
					cy_ = this.y + cPlaylistManager.topbarHeight + (this.activeRow-1)*ch;
					gr.FillSolidRect(cx + bg_margin_left, cy_ + bg_margin_top-3, cw - bg_margin_left*2 - this.scr_w, ch+1, colors.pm_blink);
					gr.DrawRect(cx + bg_margin_left, cy_ + bg_margin_top-3, cw - bg_margin_left*2 - this.scr_w - 1, ch, 1.0, colors.pm_blink_rectline);	
					
                } else {
                    gr.GdiDrawText("Send to ..." , g_font.italicplus1, txt_color, cx + bg_margin_left + txt_margin, this.y + cPlaylistManager.topbarHeight - 34, cw - bg_margin_left*2 - txt_margin*2 - tw - this.scr_w, ch, DT_LEFT | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
                };
            };
            
            // draw activeIndex hover frame
            if(cPlaylistManager.blink_counter > -1 && cPlaylistManager.blink_row > 0) {
                cy_ = this.y + cPlaylistManager.blink_row * ch;
                gr.DrawRect(cx + bg_margin_left, cy_ + bg_margin_top +(cPlaylistManager.topbarHeight-36), cw - bg_margin_left*2 - this.scr_w - 1, ch, 1.0, colors.pm_blink_rectline);
            } else {
                if(this.activeRow > 0 && this.activeIndex > 0) {
                    if(cPlaylistManager.blink_counter < 0){
                        cy_ = this.y + cPlaylistManager.topbarHeight + (this.activeRow-1)*ch;
						gr.FillSolidRect(cx + bg_margin_left, cy_ + bg_margin_top-3, cw - bg_margin_left*2 - this.scr_w, ch+1, colors.pm_blink);
                        gr.DrawRect(cx + bg_margin_left, cy_ + bg_margin_top-3, cw - bg_margin_left*2 - this.scr_w - 1, ch, 1.0, colors.pm_blink_rectline);
                    };
                };
            };
            
            // scrollbar
            if(this.scr_w > 0) {
                this.scr_cursor_h = (this.scr_h / (ch * this.rowTotal)) * this.scr_h;
                if(this.scr_cursor_h < 20) this.scr_cursor_h = 20;
                // set cursor y pos
                var ratio = (this.scroll * ch) / (this.rowTotal * ch - this.scr_h);
                this.scr_cursor_y = this.scr_y + Math.round((this.scr_h - this.scr_cursor_h) * ratio);
                
                gr.FillSolidRect(cx + cw - this.scr_w , this.scr_cursor_y, this.scr_w - 8, this.scr_cursor_h, colors.pm_scrollbar);
            };
        };
    };
    
    this._isHover = function(x, y) {
        return (x >= this.x - this.offset && x <= this.x - this.offset + this.w && y >= this.y && y <= this.y + this.h - 1);
    };
    
    
    this.on_mouse = function(event, x, y, delta) {
        this.ishover = this._isHover(x, y);
        
        switch(event) {
            case "move":
                // get active item index at x,y coords...
                this.activeIndex = -1;
                if(this.ishover) {
                    this.activeRow = Math.ceil((y - this.y - 10) / cPlaylistManager.rowHeight) - 1;
                    this.activeIndex = Math.ceil((y - this.y - 10) / cPlaylistManager.rowHeight) + this.scroll - 1;
					if(this.activeIndex>this.playlists.length) {
						this.activeIndex = this.activeRow = -1
					}//this.playlists[i].y
                } else this.activeRow = -1
                if(this.activeIndex != this.activeIndexSaved) {
                    this.activeIndexSaved = this.activeIndex;
                    brw.repaint();
                };
                if(this.scr_w > 0 && x > this.x - this.offset && x <= this.x - this.offset + this.w) {
                    if(y < this.y && pman.scroll > 0) {
                        if(!timers.scrollPman && cPlaylistManager.blink_counter < 0) {
                            timers.scrollPman = setInterval(function() {
                                pman.scroll--;
                                if(pman.scroll < 0) {
                                    pman.scroll = 0;
                                    window.ClearInterval(timers.scrollPman);
                                    timers.scrollPman = false;
                                } else {
                                    brw.repaint();
                                };
                            }, 100);
                        };
                    } else if(y > this.scr_y + this.scr_h && pman.scroll < this.rowTotal - this.totalRows) {
                        if(!timers.scrollPman && cPlaylistManager.blink_counter < 0) {
                            timers.scrollPman = setInterval(function() {
                                pman.scroll++;
                                if(pman.scroll > pman.rowTotal - pman.totalRows) {
                                    pman.scroll = pman.rowTotal - pman.totalRows;
                                    window.ClearInterval(timers.scrollPman);
                                    timers.scrollPman = false;
                                } else {
                                    brw.repaint();
                                };
                            }, 100);
                        };
                    } else {
                        if(timers.scrollPman) {
                            window.ClearInterval(timers.scrollPman);
                            timers.scrollPman = false;
                        };
                    };
                };
                break;
            case "up":
                brw.drag_clicked = false;
                if(brw.drag_moving) {
                    window.SetCursor(IDC_ARROW);
                    this.drop_done = false;
                    if(this.activeIndex > -1) {
                        brw.metadblist_selection = plman.GetPlaylistSelectedItems(g_active_playlist);
                        if(this.activeRow == 0) {
                            // send to a new playlist
                            this.drop_done = true;
                            window.NotifyOthers("JSSmoothPlaylist->JSSmoothBrowser:avoid_on_playlist_switch_callbacks_on_sendItemToPlaylist", true);
                            fb.RunMainMenuCommand("File/New playlist");
                            plman.InsertPlaylistItems(plman.PlaylistCount-1, 0, brw.metadblist_selection, false);  
                        } else {
                            // send to selected (hover) playlist
                            this.drop_done = true;
                            var row_idx = this.activeIndex - 1;
                            var playlist_idx = this.playlists[row_idx].idx;
                            var insert_index = plman.PlaylistItemCount(playlist_idx);
                            plman.InsertPlaylistItems(playlist_idx, insert_index, brw.metadblist_selection, false);
                        };
                        // timer to blink the playlist item where tracks have been droped!
                        if(this.drop_done) {
                            if(!cPlaylistManager.blink_timer) {
                                cPlaylistManager.blink_x = x;
                                cPlaylistManager.blink_y = y;
                                cPlaylistManager.blink_totaltracks = brw.metadblist_selection.Count;
                                cPlaylistManager.blink_id = this.activeIndex;
                                cPlaylistManager.blink_row = this.activeRow;
                                cPlaylistManager.blink_counter = 0;
                                cPlaylistManager.blink_timer = setInterval(function() {
                                    cPlaylistManager.blink_counter++;
                                    if(cPlaylistManager.blink_counter > 6) {
                                        window.ClearInterval(cPlaylistManager.blink_timer);
                                        cPlaylistManager.blink_timer = false;
                                        cPlaylistManager.blink_counter = -1;
                                        cPlaylistManager.blink_id = null;
                                        pman.drop_done = false;
                                        // close pman
                                        if(!timers.hidePlaylistManager) {
                                            timers.hidePlaylistManager = setInterval(pman.hidePanel, 25);
                                        };
                                        brw.drag_moving = false;
                                    };
                                    brw.repaint();
                                }, 150);
                            };
                        };
                    } else {
                        if(timers.showPlaylistManager) {
                            window.ClearInterval(timers.showPlaylistManager);
                            timers.showPlaylistManager = false;
                        };
                        if(!timers.hidePlaylistManager) {
                            timers.hidePlaylistManager = setInterval(this.hidePanel, 25);
                        };
                        brw.drag_moving = false;
                    };
                    brw.drag_moving = false;
                }; 
                break;
            case "right":
                brw.drag_clicked = false;
                if(brw.drag_moving) {
                    if(timers.showPlaylistManager) {
                        window.ClearInterval(timers.showPlaylistManager);
                        timers.showPlaylistManager = false;
                    };
                    if(!timers.hidePlaylistManager) {
                        timers.hidePlaylistManager = setInterval(this.hidePanel, 25);
                    };
                    brw.drag_moving = false;
                };
                break;
            case "wheel":
                var scroll_prev = this.scroll;
                this.scroll -= delta;
                if(this.scroll < 0) this.scroll = 0;
                if(this.scroll > (this.rowTotal - this.totalRows)) this.scroll = (this.rowTotal - this.totalRows);
                if(this.scroll != scroll_prev) {
                    this.on_mouse("move", g_cursor.x, g_cursor.y);
                };
                break;
            case "leave":
                brw.drag_clicked = false;
                if(brw.drag_moving) {
                    if(timers.showPlaylistManager) {
                        window.ClearInterval(timers.showPlaylistManager);
                        timers.showPlaylistManager = false;
                    };
                    if(!timers.hidePlaylistManager) {
                        timers.hidePlaylistManager = setInterval(this.hidePanel, 25);
                    };
                    brw.drag_moving = false;
                };
                break;
        };
    };
};

oFilterBox = function() {
	this.images = {
        resetIcon_off: null,
        resetIcon_ov: null
	};

    this.getImages = function() {
		var gb;
        var w = Math.round(18 * g_zoom_percent / 100);
        
		if(properties.darklayout){
			this.images.search_icon = gdi.Image(theme_img_path + "\\icons\\white\\search_icon.png");	
		} else {
			this.images.search_icon = gdi.Image(theme_img_path + "\\icons\\search_icon.png");			
		}
		this.search_bt = new button(this.images.search_icon, this.images.search_icon, this.images.search_icon);
		
        this.images.resetIcon_off = gdi.CreateImage(w, w);
        gb = this.images.resetIcon_off.GetGraphics();
            gb.SetSmoothingMode(2);
            gb.DrawLine(5, 5, w-5, w-5, 1.0, colors.normal_txt);
            gb.DrawLine(5, w-5, w-5, 5, 1.0, colors.normal_txt);
            gb.SetSmoothingMode(0);
        this.images.resetIcon_off.ReleaseGraphics(gb);

        this.images.resetIcon_ov = gdi.CreateImage(w, w);
        gb = this.images.resetIcon_ov.GetGraphics();
            gb.SetSmoothingMode(2);
            gb.DrawLine(4, 4, w-4, w-4, 1.0, colors.normal_txt);
            gb.DrawLine(4, w-4, w-4, 4, 1.0, colors.normal_txt);
            gb.SetSmoothingMode(0);
        this.images.resetIcon_ov.ReleaseGraphics(gb);

        this.images.resetIcon_dn = gdi.CreateImage(w, w);
        gb = this.images.resetIcon_dn.GetGraphics();
            gb.SetSmoothingMode(2);
            gb.DrawLine(4, 4, w-4, w-4, 1.0, colors.reseticon_down);
            gb.DrawLine(4, w-4, w-4, 4, 1.0, colors.reseticon_down);
            gb.SetSmoothingMode(0);
        this.images.resetIcon_dn.ReleaseGraphics(gb);

        this.reset_bt = new button(this.images.resetIcon_off, this.images.resetIcon_ov, this.images.resetIcon_dn);
	};
	this.getImages();
    
	this.on_init = function() {
		this.inputbox = new oInputbox(cFilterBox.w, cFilterBox.h, "", "Filter", colors.normal_txt, 0, 0, colors.selected_bg, g_sendResponse, "brw");
        this.inputbox.autovalidation = true;
    };
	this.on_init();
    
	this.set_default_text = function() {
		if(properties.lockOnNowPlaying) this.inputbox.empty_text = "Playing tracks...";
		else this.inputbox.empty_text = "Active playlist...";		
	}
	
    this.reset_colors = function() {
        this.inputbox.textcolor = colors.normal_txt;
        this.inputbox.backselectioncolor = colors.selected_bg;
    };

    this.setSize = function(w, h, font_size) {
        this.inputbox.setSize(w, h-properties.headerBarPaddingTop, font_size);
        this.getImages();
    };

    this.clearInputbox = function() {
        if(this.inputbox.text.length > 0) {
            this.inputbox.text = "";
            this.inputbox.offset = 0;
            filter_text = "";
			brw.populate(true,29);
        };
    };
    
	this.draw = function(gr, x, y) {
        var bx = x;
		var by = y + properties.headerBarPaddingTop;
        var bw = this.inputbox.w + Math.round(44 * g_zoom_percent / 100);
        
        if(this.inputbox.text.length > 0) {
            this.reset_bt.draw(gr, bx+3, by, 255);
        } else {
			this.search_bt.draw(gr, bx, by-2, 255);			
			//gr.DrawImage(this.images.search_icon, bx, by+Math.round(this.inputbox.h/2-this.images.search_icon.Height/2), this.images.search_icon.Width, this.images.search_icon.Height, 0, 0, this.images.search_icon.Width, this.images.search_icon.Height, 0, 255);
        };
		this.inputbox.draw(gr, bx+Math.round(22 * g_zoom_percent / 100)+8, by, 0, 0);
    };
        
    this.on_mouse = function(event, x, y, delta) {
        switch(event) {
            case "lbtn_down":
				this.inputbox.check("down", x, y);
                if(this.inputbox.text.length > 0) this.reset_bt.checkstate("down", x, y);
				else this.search_bt.checkstate("down", x, y);				
                break;
            case "lbtn_up":
                if(this.inputbox.text.length > 0) {
                    if(this.reset_bt.checkstate("up", x, y) == ButtonStates.hover && !this.inputbox.drag) {
                        this.clearInputbox();
                    };
                } else {
					if(this.search_bt.checkstate("up", x, y) == ButtonStates.hover && !this.inputbox.drag) {
						this.inputbox.activate(x,y);
						this.inputbox.repaint();
					};					
				}
				this.inputbox.check("up", x, y);				
                break;
            case "lbtn_dblclk":
				this.inputbox.check("dblclk", x, y);
                break;
            case "rbtn_down":
				this.inputbox.check("right", x, y);
                break;
            case "move":
				this.inputbox.check("move", x, y);
                if(this.inputbox.text.length > 0) this.reset_bt.checkstate("move", x, y);
                break;
        };
    };
    
    this.on_key = function(event, vkey) {
        switch(event) {
            case "down":
				this.inputbox.on_key_down(vkey);
                break;
        };
    };
    
    this.on_char = function(code) {
        this.inputbox.on_char(code);
    };
    
	this.on_focus = function(is_focused) {
		this.inputbox.on_focus(is_focused);
	};
};

oScrollbar = function(themed) {
    this.themed = themed;
    this.showButtons = true;
    this.buttons = Array(null, null, null);
    this.buttonType = {cursor: 0, up: 1, down: 2};
    this.buttonClick = false;
    this.cursorHover = false;
    this.cursorDrag = false;
    this.color_bg = colors.normal_bg;
    this.color_txt = colors.normal_txt;
    
    if(this.themed) {
        this.theme = window.CreateThemeManager("scrollbar");
    } else {
        this.theme = false;
    };
    
    this.setNewColors = function() {
        this.color_bg = colors.normal_bg;
        this.color_txt = colors.normal_txt;  
        this.setButtons();
        this.setCursorButton();
    };

    this.setButtons = function() {
        // normal scroll_up Image
        // Draw Themed Scrollbar (lg/col)
        if(this.themed) {
            this.upImage_normal = gdi.CreateImage(this.w, this.w);
            var gb = this.upImage_normal.GetGraphics();
            try {
                this.theme.SetPartAndStateId(1, 1);
                this.theme.DrawThemeBackground(gb, 0, 0, this.w, this.w);
            } catch(e) {
                DrawPolyStar(gb, 4, 4, this.w-8, 1, 3, 0, colors.normal_txt, blendColors(this.color_txt, this.color_bg, 0.5), 0, 255);
            };
        } else {
            this.upImage_normal = gdi.CreateImage(70, 70);
            var gb = this.upImage_normal.GetGraphics();
            DrawPolyStar(gb, 11, 16, 44, 1, 3, 0, colors.normal_txt, blendColors(this.color_txt, this.color_bg, 0.5), 0, 255);
        };
        this.upImage_normal.ReleaseGraphics(gb);

        // hover scroll_up Image
        // Draw Themed Scrollbar (lg/col)
        if(this.themed) {
            this.upImage_hover = gdi.CreateImage(this.w, this.w);
            gb = this.upImage_hover.GetGraphics();
            try {
                this.theme.SetPartAndStateId(1, 2);
                this.theme.DrawThemeBackground(gb, 0, 0, this.w, this.w);
            } catch(e) {
                DrawPolyStar(gb, 4, 4, this.w-8, 1, 3, 0, blendColors(this.color_txt, this.color_bg, 0.3), blendColors(this.color_txt, this.color_bg, 0.3), 0, 255);
            };
        } else {
            this.upImage_hover = gdi.CreateImage(70, 70);
            var gb = this.upImage_hover.GetGraphics();
            DrawPolyStar(gb, 11, 16, 44, 1, 3, 0, blendColors(this.color_txt, this.color_bg, 0.3), blendColors(this.color_txt, this.color_bg, 0.3), 0, 255);
        };
        this.upImage_hover.ReleaseGraphics(gb);

        // down scroll_up Image
        // Draw Themed Scrollbar (lg/col)
        if(this.themed) {
            this.upImage_down = gdi.CreateImage(this.w, this.w);
            gb = this.upImage_down.GetGraphics();
            try {
                this.theme.SetPartAndStateId(1, 3);
                this.theme.DrawThemeBackground(gb, 0, 0, this.w, this.w);
            } catch(e) {
                DrawPolyStar(gb, 4, 4, this.w-8, 1, 3, 0, colors.normal_txt, blendColors(this.color_txt, this.color_bg, 0.05), 0, 255);
            };
        } else {
            this.upImage_down = gdi.CreateImage(70, 70);
            gb = this.upImage_down.GetGraphics();
            DrawPolyStar(gb, 11, 13, 44, 1, 3, 0, colors.normal_txt, blendColors(this.color_txt, this.color_bg, 0.05), 0, 255);
        };
        this.upImage_down.ReleaseGraphics(gb);

        // normal scroll_down Image
        // Draw Themed Scrollbar (lg/col)
        if(this.themed) {
            this.downImage_normal = gdi.CreateImage(this.w, this.w);
            gb = this.downImage_normal.GetGraphics();
            try {
                this.theme.SetPartAndStateId(1, 5);
                this.theme.DrawThemeBackground(gb, 0, 0, this.w, this.w);
            } catch(e) {
                DrawPolyStar(gb, 4, 4, this.w-8, 1, 3, 0, colors.normal_txt, blendColors(this.color_txt, this.color_bg, 0.5), 180, 255);
            };
        } else {
            this.downImage_normal = gdi.CreateImage(70, 70);
            gb = this.downImage_normal.GetGraphics();
            DrawPolyStar(gb, 11, 10, 44, 1, 3, 0, colors.normal_txt, blendColors(this.color_txt, this.color_bg, 0.5), 180, 255);
        };
        this.downImage_normal.ReleaseGraphics(gb);

        // hover scroll_down Image
        // Draw Themed Scrollbar (lg/col)
        if(this.themed) {
            this.downImage_hover = gdi.CreateImage(this.w, this.w);
            gb = this.downImage_hover.GetGraphics();
            try {
                this.theme.SetPartAndStateId(1, 6);
                this.theme.DrawThemeBackground(gb, 0, 0, this.w, this.w);
            } catch(e) {
                DrawPolyStar(gb, 4, 4, this.w-8, 1, 3, 1, blendColors(this.color_txt, this.color_bg, 0.3), blendColors(this.color_txt, this.color_bg, 0.3), 180, 255);
            };
        } else {
            this.downImage_hover = gdi.CreateImage(70, 70);
            gb = this.downImage_hover.GetGraphics();
            DrawPolyStar(gb, 11, 10, 44, 1, 3, 1, blendColors(this.color_txt, this.color_bg, 0.3), blendColors(this.color_txt, this.color_bg, 0.3), 180, 255);
        };
        this.downImage_hover.ReleaseGraphics(gb);

        // down scroll_down Image
        // Draw Themed Scrollbar (lg/col)
        if(this.themed) {
            this.downImage_down = gdi.CreateImage(this.w, this.w);
            gb = this.downImage_down.GetGraphics();
            try {
                this.theme.SetPartAndStateId(1, 7);
                this.theme.DrawThemeBackground(gb, 0, 0, this.w, this.w);
            } catch(e) {
                DrawPolyStar(gb, 4, 4, this.w-8, 1, 3, 0, colors.normal_txt, blendColors(this.color_txt, this.color_bg, 0.05), 180, 255);
            };
        } else {
            this.downImage_down = gdi.CreateImage(70, 70);
            gb = this.downImage_down.GetGraphics();
            DrawPolyStar(gb, 11, 13, 44, 1, 3, 0, colors.normal_txt, blendColors(this.color_txt, this.color_bg, 0.05), 180, 255);
        };
        this.downImage_down.ReleaseGraphics(gb);
        
        for(i = 1; i < this.buttons.length; i++) {
            switch(i) {
            case this.buttonType.cursor:
                this.buttons[this.buttonType.cursor] = new button(this.cursorImage_normal, this.cursorImage_hover, this.cursorImage_down);
                break;
            case this.buttonType.up:
                this.buttons[this.buttonType.up] = new button(this.upImage_normal.Resize(this.w,this.w,2), this.upImage_hover.Resize(this.w,this.w,2), this.upImage_down.Resize(this.w,this.w,2));
                break;
            case this.buttonType.down:
                this.buttons[this.buttonType.down] = new button(this.downImage_normal.Resize(this.w,this.w,2), this.downImage_hover.Resize(this.w,this.w,2), this.downImage_down.Resize(this.w,this.w,2));
                break;
            };
        };
    };

    this.setCursorButton = function() {
        // normal cursor Image
        this.cursorImage_normal = gdi.CreateImage(this.cursorw, this.cursorh);
        var gb = this.cursorImage_normal.GetGraphics();
		//gb.FillSolidRect(1, 0, this.cursorw-2, this.cursorh, blendColors(this.color_txt, this.color_bg, 0.5) & 0x88ffffff);
		//gb.DrawRect(1, 0, this.cursorw-2 - 1, this.cursorh - 1, 1.0, this.color_txt & 0x44ffffff);		
		gb.FillSolidRect(this.cursorw-cScrollBar.normalWidth, cScrollBar.marginTop, cScrollBar.normalWidth-2, this.cursorh-cScrollBar.marginTop-cScrollBar.marginBottom, colors.scrollbar_normal_cursor);		
        this.cursorImage_normal.ReleaseGraphics(gb);
        
        // hover cursor Image
        this.cursorImage_hover = gdi.CreateImage(this.cursorw, this.cursorh);
        gb = this.cursorImage_hover.GetGraphics();
        // Draw Themed Scrollbar (lg/col)
        if(this.themed) {
            try {
                this.theme.SetPartAndStateId(3, 2);
                this.theme.DrawThemeBackground(gb, 0, 0, this.cursorw, this.cursorh);
                if(this.cursorh >= 30) {
                    this.theme.SetPartAndStateId(9, 2);
                    this.theme.DrawThemeBackground(gb, 0, 0, this.cursorw, this.cursorh);
                };
            } catch(e) {
                gb.FillSolidRect(1, 0, this.cursorw-2, this.cursorh, blendColors(this.color_txt, this.color_bg, 0.3));
            };
        } else {
            //gb.FillSolidRect(1, 0, this.cursorw-2, this.cursorh, blendColors(this.color_txt, this.color_bg, 0.3) & 0x88ffffff);
            //gb.DrawRect(1, 0, this.cursorw-2 - 1, this.cursorh - 1, 1.0, this.color_txt & 0x44ffffff);
			gb.FillSolidRect(this.cursorw-cScrollBar.hoverWidth, 0, cScrollBar.hoverWidth, this.cursorh,colors.scrollbar_hover_cursor);
        };
        this.cursorImage_hover.ReleaseGraphics(gb);
		
        // down cursor Image
        this.cursorImage_down = gdi.CreateImage(this.cursorw, this.cursorh);
        gb = this.cursorImage_down.GetGraphics();
        // Draw Themed Scrollbar (lg/col)
        if(this.themed) {
            try {
                this.theme.SetPartAndStateId(3, 3);
                this.theme.DrawThemeBackground(gb, 0, 0, this.cursorw, this.cursorh);
                if(this.cursorh >= 30) {
                    this.theme.SetPartAndStateId(9, 3);
                    this.theme.DrawThemeBackground(gb, 0, 0, this.cursorw, this.cursorh);
                };
            } catch(e) {
                gb.FillSolidRect(1, 0, this.cursorw-2, this.cursorh, blendColors(this.color_txt, this.color_bg, 0.05));
            };
        } else {
            //gb.FillSolidRect(1, 0, this.cursorw-2, this.cursorh, blendColors(this.color_txt, this.color_bg, 0.05) & 0x88ffffff);
            //gb.DrawRect(1, 0, this.cursorw-2 - 1, this.cursorh - 1, 1.0, this.color_txt & 0x44ffffff);
			gb.FillSolidRect(this.cursorw-cScrollBar.downWidth, 0, cScrollBar.downWidth, this.cursorh,colors.scrollbar_down_cursor);
        };
        this.cursorImage_down.ReleaseGraphics(gb);
		
        // create/refresh cursor Button in buttons array
        this.buttons[this.buttonType.cursor] = new button(this.cursorImage_normal, this.cursorImage_hover, this.cursorImage_down);
        this.buttons[this.buttonType.cursor].x = this.x;
        this.buttons[this.buttonType.cursor].y = this.cursory;
    };
    
    this.draw = function(gr) {
        // scrollbar buttons
        if(cScrollBar.visible) this.buttons[this.buttonType.cursor].draw(gr, this.x, this.cursory, 255);
        if(this.showButtons && properties.drawUpAndDownScrollbar) {
            this.buttons[this.buttonType.up].draw(gr, this.x, this.y, 255);
            this.buttons[this.buttonType.down].draw(gr, this.x, this.areay + this.areah, 255);
        };
    };
       
    this.updateScrollbar = function() {
        var prev_cursorh = this.cursorh;
        this.total = brw.rowsCount+properties.addedRows_end;
        this.rowh = properties.rowHeight;
        this.totalh = this.total * this.rowh+brw.PaddingTop*2+properties.margin_bottom;
        // set scrollbar visibility
        cScrollBar.visible = (this.totalh > brw.h +5 );

        // set cursor width/height
        this.cursorw = cScrollBar.activeWidth;

        if(this.total > 0) {
            this.cursorh = Math.round((brw.h / this.totalh) * this.areah);
            if(this.cursorh < cScrollBar.minCursorHeight) this.cursorh = cScrollBar.minCursorHeight;
        } else {
            this.cursorh = cScrollBar.minCursorHeight;
        };
        // set cursor y pos
        this.setCursorY();
        if(this.cursorh != prev_cursorh) this.setCursorButton();
    };
    
    this.setCursorY = function() {
        // set cursor y pos
        var ratio = scroll / (this.totalh - brw.h);
        this.cursory = this.areay + Math.round((this.areah - this.cursorh) * ratio);
    };
    
    this.setSize = function() {
        if(properties.drawUpAndDownScrollbar) this.buttonh = cScrollBar.width;
		else this.buttonh = 0;		
        this.x = brw.x + brw.w-cScrollBar.activeWidth;
        this.y = brw.y - properties.headerBarHeight*0-brw.PaddingTop;
        this.w = cScrollBar.activeWidth;
        this.h = brw.h + properties.headerBarHeight*0;
        if(this.showButtons) {
            this.areay = this.y + this.buttonh;
            this.areah = this.h - (this.buttonh * 2);
        } else {
            this.areay = this.y;
            this.areah = this.h;
        };
        this.setButtons();
    };
    
    this.setScrollFromCursorPos = function() {
        // calc ratio of the scroll cursor to calc the equivalent item for the full list (with gh)
        var ratio = (this.cursory - this.areay) / (this.areah - this.cursorh);
        // calc idx of the item (of the full list with gh) to display at top of the panel list (visible)
        scroll = Math.round((this.totalh - brw.h) * ratio);
    };

    this.cursorCheck = function(event, x, y) {
		if(!this.buttons[this.buttonType.cursor]) return;
        switch(event) {
        case "down":
            var tmp = this.buttons[this.buttonType.cursor].checkstate(event, x, y);
			if(tmp == ButtonStates.down) {
                this.cursorClickX = x;
                this.cursorClickY = y;
                this.cursorDrag = true;
                this.cursorDragDelta = y - this.cursory;
            };
            break;
        case "up":
			this.buttons[this.buttonType.cursor].checkstate(event, x, y);
            if(this.cursorDrag) {
                this.setScrollFromCursorPos();
                brw.repaint();
            };
            this.cursorClickX = 0;
            this.cursorClickY = 0;
            this.cursorDrag = false;
            break;
        case "move":
			var state = this.buttons[this.buttonType.cursor].checkstate(event, x, y);
			if(state == ButtonStates.hover && !this.cursorHover) {
				this.cursorHover = true;
				brw.repaint();
			} else if(this.cursorHover && state != ButtonStates.hover){
				this.cursorHover = false;
				brw.repaint();
			}
            if(this.cursorDrag) {
                this.cursory = y - this.cursorDragDelta;
                if(this.cursory + this.cursorh > this.areay + this.areah) {
                    this.cursory = (this.areay + this.areah) - this.cursorh;
                };
                if(this.cursory < this.areay) {
                    this.cursory = this.areay;
                };
                this.setScrollFromCursorPos();
                brw.repaint();
            };
            break;
		case "leave":
			this.buttons[this.buttonType.cursor].checkstate(event, 0, 0);
			break;
        };
    };
    
    this._isHover = function(x, y) {
        return (x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h);
    };

    this._isHoverArea = function(x, y) {
        return (x >= this.x && x <= this.x + this.w && y >= this.areay && y <= this.areay + this.areah);
    };

    this._isHoverCursor = function(x, y) {
        return (x >= this.x && x <= this.x + this.w && y >= this.cursory && y <= this.cursory + this.cursorh);
    };

    this.on_mouse = function(event, x, y, delta) {
        this.isHover = this._isHover(x, y);
        this.isHoverArea = this._isHoverArea(x, y);
        this.isHoverCursor = this._isHoverCursor(x, y);
        this.isHoverButtons = this.isHover && !this.isHoverCursor && !this.isHoverArea;
        this.isHoverEmptyArea = this.isHoverArea && !this.isHoverCursor;
        
        var scroll_step = properties.rowHeight;
        var scroll_step_page = brw.h;

        switch(event) {
            case "down":
            case "dblclk":
                if((this.isHoverCursor || this.cursorDrag) && !this.buttonClick && !this.isHoverEmptyArea) {
                    this.cursorCheck(event, x, y);
                } else {
                    // buttons events
                    var bt_state = ButtonStates.normal;
                    for(var i = 1; i < 3; i++) {
                        switch(i) {
                            case 1: // up button
                                bt_state = this.buttons[i].checkstate(event, x, y);
                                if((event == "down" && bt_state == ButtonStates.down) || (event == "dblclk" && bt_state == ButtonStates.hover)) {
                                    this.buttonClick = true;
                                    scroll = scroll - scroll_step;
                                    scroll = check_scroll(scroll);
                                    if(!cScrollBar.timerID) {
                                        cScrollBar.timerID = setInterval(function() {
                                            if(cScrollBar.timerCounter > 6) {
                                                scroll = scroll - scroll_step;
                                                scroll = check_scroll(scroll);
                                            } else {
                                                cScrollBar.timerCounter++;
                                            };
                                        }, 80);
                                    };
                                };
                                break;
                            case 2: // down button
                                bt_state = this.buttons[i].checkstate(event, x, y);
                                if((event == "down" && bt_state == ButtonStates.down) || (event == "dblclk" && bt_state == ButtonStates.hover)) {
                                    this.buttonClick = true;
                                    scroll = scroll + scroll_step;
                                    scroll = check_scroll(scroll);
                                    if(!cScrollBar.timerID) {
                                        cScrollBar.timerID = setInterval(function() {
                                            if(cScrollBar.timerCounter > 6) {
                                                scroll = scroll + scroll_step;
                                                scroll = check_scroll(scroll);
                                            } else {
                                                cScrollBar.timerCounter++;
                                            };
                                        }, 80);
                                    };
                                };
                                break;
                        };
                    };
                    if(!this.buttonClick && this.isHoverEmptyArea) {
                        // check click on empty area scrollbar
                        if(y < this.cursory) {
                            // up
                            this.buttonClick = true;
                            scroll = scroll - scroll_step_page;
                            scroll = check_scroll(scroll);
                            if(!cScrollBar.timerID) {
                                cScrollBar.timerID = setInterval(function() {
                                    if(cScrollBar.timerCounter > 6 && g_cursor.y < brw.scrollbar.cursory) {
                                        scroll = scroll - scroll_step_page;
                                        scroll = check_scroll(scroll);
                                    } else {
                                        cScrollBar.timerCounter++;
                                    };
                                }, 80);
                            };
                        } else {
                            // down
                            this.buttonClick = true;
                            scroll = scroll + scroll_step_page;
                            scroll = check_scroll(scroll);
                            if(!cScrollBar.timerID) {
                                cScrollBar.timerID = setInterval(function() {
                                    if(cScrollBar.timerCounter > 6 && g_cursor.y > brw.scrollbar.cursory + brw.scrollbar.cursorh) {
                                        scroll = scroll + scroll_step_page;
                                        scroll = check_scroll(scroll);
                                    } else {
                                        cScrollBar.timerCounter++;
                                    };
                                }, 80);
                            };
                        };
                    };
                };
                break;
            case "right":
            case "up":
                if(cScrollBar.timerID) {
                    window.ClearInterval(cScrollBar.timerID);
                    cScrollBar.timerID = false;
                };
                cScrollBar.timerCounter = -1;
                
                this.cursorCheck(event, x, y);
                for(var i = 1; i < 3; i++) {
                    this.buttons[i].checkstate(event, x, y);
                };
                this.buttonClick = false;
                break;
            case "move":
                this.cursorCheck(event, x, y);
                for(var i = 1; i < 3; i++) {
                    this.buttons[i].checkstate(event, x, y);
                };
                break;
            case "wheel":
                if(!this.buttonClick) {
                    this.updateScrollbar();
                };
                break;
            case "leave":
                this.cursorCheck(event, 0, 0);
                for(var i = 1; i < 3; i++) {
                    this.buttons[i].checkstate(event, 0, 0);
                };
                break;
        };
    };
};

oGroup = function(index, start, handle, groupkey) {
	this.index = index;
	this.start = start;
	this.count = 1;
    this.metadb = handle;
    this.marginTop = 10;	
    this.marginBottom = 10;		
    this.groupkey = groupkey;
	this.groupkeysplit = groupkey.split(" ^^ ");
    this.cachekey = process_cachekey(handle);
    //
    this.cover_img = null;
    this.cover_type = null;
    this.tracktype = TrackType(handle.RawPath.substring(0, 4));
    this.tra = [];
    this.load_requested = 0;
	this.cover_formated = false;
	this.mask_applied = false;		
    this.save_requested = false;
    this.collapsed = properties.autocollapse;
    this.TimeString = "";
    this.TotalTime = 0;
	this.track_rated = false;
	
	this.FormatTime = function(time){
		if(time>0){
		time_txt="";
		timetodraw=time;
		
		totalMth=Math.floor((timetodraw)/2592000); r_timetodraw=timetodraw-totalMth*2592000; 
		totalW=Math.floor(r_timetodraw/604800);      
		totalD=Math.floor((r_timetodraw%604800)/86400);    
		totalH=Math.floor((r_timetodraw%86400)/3600);
		totalM=Math.floor((r_timetodraw%3600)/60);
		totalS=Math.round((r_timetodraw%60));
		totalS=(totalS>9) ? totalS:'0'+totalS;
		
		txt_month=(totalMth>1)?totalMth+' months, ':totalMth+' month, ';
		txt_week=(totalW>1)?totalW+' weeks, ':totalW+' week, ';if(totalW==0) txt_week='';   
		txt_day=(totalD>1)?totalD+' days, ':totalD+' day, '; if(totalD==0) txt_day='';
		txt_hour=(totalH>1)?totalH+' h':totalH+' h'; if(totalH==0) txt_hour='';      
		if(totalMth>0) time_txt=txt_month+txt_week+txt_day+txt_hour+totalM+' min ';
		else if (totalW>0) time_txt=txt_week+txt_day+txt_hour+totalM+' min ';
		else if (totalD>0) time_txt=txt_day+txt_hour+", "+totalM+' min ';
		else if (totalH>0) time_txt=txt_hour+((totalM>0)?", "+totalM+' min':'');
		else time_txt=totalM+' min';
		} else time_txt="";	
		return time_txt;
	}

    this.finalize = function(count, tracks) {
        this.tra = tracks.slice(0);
        this.tooltip = Array();		
        this.count = count;
        if(count < properties.minimumRowsNumberPerGroup) {
            this.rowsToAdd = properties.minimumRowsNumberPerGroup - count;
        } else {
            this.rowsToAdd = 0;
        };
        this.rowsToAdd += properties.extraRowsNumber;
		
		this.TimeString = this.FormatTime(this.TotalTime);	
        if(this.collapsed) {
            if(brw.focusedTrackId >= this.start && brw.focusedTrackId < this.start + count) { // focused track is in this group!
                this.collapsed = false;
                g_group_id_focused = this.index;
            }
        };
    };
    
    //this.totalPreviousRows = 0
};

oBrowser = function(name) {
    this.name = name;
    this.groups = [];
    this.rows = [];
	this.hoverRatingRow = -1
    this.SHIFT_start_id = null;
    this.SHIFT_count = 0;
    this.scrollbar = new oScrollbar(themed = cScrollBar.themed);
    this.keypressed = false;
    this.showNowPlaying_trigger = false;
    this.metadblist_selection = plman.GetPlaylistSelectedItems(g_active_playlist);
	this.FirstInitialisationDone = false;
	this.dontFlashNowPlaying = false;
	this.totaltracks = 0;
	this.drag_tracks = false;
	this.dragSource_track = -1;
	this.cursorHand = false;
	this.ratingImages = false;
	this.coverMask = false;	
    this.cover_img_mask = null;		
	this.drawLeftLine = false;
    this.launch_populate = function() {
        var launch_timer = setTimeout(function(){
            // populate browser with items
            brw.populate(is_first_populate = true,0);
            // populate playlist popup panel list
            if(properties.DropInplaylist) pman.populate(exclude_active = false, reset_scroll = true);
            // kill Timeout
            launch_timer && clearTimeout(launch_timer);
            launch_timer = false;
        }, 5);
    };

    this.repaint = function() {
        if(!window.IsVisible) return;
        repaint_main1 = repaint_main2;
    };
    
    this.cover_repaint = function() {
        if(!window.IsVisible) return;
        repaint_cover1 = repaint_cover2;
    };
    
    this.setSize = function(x, y, w, h) {
        this.x = x;
		
		if(properties.doubleRowText && properties.showGroupHeaders)
			this.PaddingTop = 23;
		else if(properties.showGroupHeaders)
			this.PaddingTop = 10;			
		else this.PaddingTop = 7;
		
        this.y = y+this.PaddingTop;
        this.w = w;
        this.h = h;
        this.marginLR = 0;
        this.paddingLeft = 1;		
        this.paddingRight = 11;		
	
        this.groupHeaderRowHeight = properties.groupHeaderRowsNumber;
        this.totalRows = Math.ceil(this.h / properties.rowHeight);
        this.totalRowsVis = Math.floor(this.h / properties.rowHeight);
        
        if(g_first_populate_done) 
			this.gettags();
        
        g_filterbox.setSize(this.w, cFilterBox.h+2, g_fsize);

        this.scrollbar.setSize();
       
        scroll = Math.round(scroll / properties.rowHeight) * properties.rowHeight;
        scroll = check_scroll(scroll);
        scroll_ = scroll;
        
        // scrollbar update       
        this.scrollbar.updateScrollbar();
        
        if(properties.DropInplaylist) pman.setSize(ww, y + 45, ww, h - 90);
    };

    this.collapseAll = function(bool) { // bool = true to collapse all groups otherwise expand them all
        var end = this.groups.length;
        for(i = 0; i < end; i++) {
            this.groups[i].collapsed = bool;
        };
        this.setList(true);
        g_focus_row = this.getOffsetFocusItem(g_focus_id);
        // if focused track not totally visible, we scroll to show it centered in the panel
        if(g_focus_row < scroll / properties.rowHeight || g_focus_row > scroll / properties.rowHeight + brw.totalRowsVis - 1) {
            scroll = (g_focus_row - Math.floor(brw.totalRowsVis / 2)) * properties.rowHeight;
            scroll = check_scroll(scroll);
            scroll_ = scroll;
        };
        if(this.rowsCount > 0) brw.gettags(true);
        this.scrollbar.updateScrollbar();
        this.repaint();
    };
           
    this.setList = function() {
        this.rows.splice(0, this.rows.length);
        var r = 0, i = 0, j = 0, m = 0, n = 0, s = 0, p = 0;
        var grptags = "";
        var headerTotalRows = properties.groupHeaderRowsNumber;	
        
        /*
		var d1 = new Date();
		var t1 = d1.getSeconds()*1000 + d1.getMilliseconds();
        */
        
        var end = this.groups.length;
        for(i = 0; i < end; i++) {
            
            this.groups[i].load_requested = 0;
            this.groups[i].cover_formated = false;	
			this.groups[i].mask_applied = false;

            // update total rows present before this group
            //this.groups[i].totalPreviousRows = r;

            grptags = this.groups[i].groupkey;
            
            s = this.groups[i].start;

            if(this.groups[i].collapsed) {
                this.groups[i].rowId = r;				
                if(properties.showGroupHeaders) {
                    for(k=0; k < headerTotalRows; k++) {
                        this.rows[r] = new Object();
                        this.rows[r].type = k + 1; // 1st line of group header
                        this.rows[r].metadb = this.groups[i].metadb;
                        this.rows[r].albumId = i;
                        this.rows[r].albumTrackId = 0;
                        this.rows[r].playlistTrackId = s;
                        this.rows[r].groupkey = grptags;
						this.rows[r].selected = plman.IsPlaylistItemSelected(g_active_playlist, this.rows[r].playlistTrackId);
						this.rows[r].groupkeysplit = this.rows[r].groupkey.split(" ^^ ");
                        r++;
                    };
                };
                // empty extra rows when collapsed
                p = this.groups[i].rowsToAdd;
                for(n = 0; n < p; n++) {
                    this.rows[r] = new Object();
					this.rows[r].selected = false;
                    this.rows[r].type = 99; // extra row at bottom of the album/group
                    r++;
                };				
            } else {
                this.groups[i].rowId = r;				
                if(properties.showGroupHeaders) {
                    for(k=0; k < headerTotalRows; k++) {
                        this.rows[r] = new Object();
                        this.rows[r].type = k + 1; // 1st line of group header
                        this.rows[r].metadb = this.groups[i].metadb;
                        this.rows[r].albumId = i;
                        this.rows[r].albumTrackId = 0;
                        this.rows[r].playlistTrackId = s;
                        this.rows[r].groupkey = grptags;
						this.rows[r].groupkeysplit = this.rows[r].groupkey.split(" ^^ ");
						this.rows[r].selected = plman.IsPlaylistItemSelected(g_active_playlist, this.rows[r].playlistTrackId);
                        r++;
                    };
                };
                // tracks
                m = this.groups[i].count;
                for(j = 0; j < m; j++) {
                    this.rows[r] = new Object();
                    this.rows[r].type = 0; // track
                    this.rows[r].metadb = this.list[s + j];
                    this.rows[r].albumId = i;
                    this.rows[r].albumTrackId = j;
                    this.rows[r].playlistTrackId = s + j;
                    this.rows[r].groupkey = grptags;
					this.rows[r].groupkeysplit = this.rows[r].groupkey.split(" ^^ ");					
                    this.rows[r].tracktype = TrackType(this.rows[r].metadb.RawPath.substring(0, 4));
					this.rows[r].selected = plman.IsPlaylistItemSelected(g_active_playlist, this.rows[r].playlistTrackId);
					if(this.rows[r].selected)
						this.groups[i].selected = true;
                    this.rows[r].rating = -1;
                    r++;
                };
                // empty extra rows
                p = this.groups[i].rowsToAdd;
                for(n = 0; n < p; n++) {
                    this.rows[r] = new Object();
					this.rows[r].selected = false;
                    this.rows[r].type = 99; // extra row at bottom of the album/group
                    r++;
                };
            };
        };
        this.rowsCount = r;

    };
    this.set_selected_items = function() {
		var tot = this.rows.length;
		for(r = 0; r < tot; r++) {
			if(this.rows[r].type != 99)
				this.rows[r].selected = plman.IsPlaylistItemSelected(g_active_playlist, this.rows[r].playlistTrackId);
				if(this.rows[r].selected)
					this.groups[this.rows[r].albumId].selected = true;
		}
	}
    this.showNowPlaying = function(flash_nowplaying) {
		var flash_nowplaying = typeof flash_nowplaying !== 'undefined' ? flash_nowplaying : true;		
        if(fb.IsPlaying && (properties.lockOnPlaylistNamed=="" || plman.PlayingPlaylist==g_active_playlist)) {
			g_filterbox.clearInputbox();			
            try {
                this.nowplaying = plman.GetPlayingItemLocation();
                if(this.nowplaying.IsValid) {
                    if(plman.PlayingPlaylist != g_active_playlist && properties.lockOnPlaylistNamed=="") {
                        g_active_playlist = plman.ActivePlaylist = plman.PlayingPlaylist;						
						this.showNowPlaying_trigger = true;
						this.populate(is_first_populate = true,21);
                    } else {
						// set focus on the now playing item
						g_focus_id_prev = g_focus_id;
						g_focus_id = this.nowplaying.PlaylistItemIndex;
						g_focus_row = this.getOffsetFocusItem(g_focus_id);
						
						g = this.rows[g_focus_row].albumId;
						//plman.ClearPlaylistSelection(g_active_playlist);
						if(this.groups[g].collapsed && properties.showGroupHeaders) {
							this.groups[g].collapsed = false;								
							this.setList();
							this.scrollbar.updateScrollbar();
							//if(this.rowsCount > 0) this.gettags(true);								 
							//this.selectGroupTracks(g);
						} else {
							//plman.SetPlaylistSelectionSingle(g_active_playlist, g_focus_id, true);
						};
						
						plman.SetPlaylistFocusItem(g_active_playlist, g_focus_id);
						this.showFocusedItem();
						if(this.rowsCount > 0) this.gettags(true);
						if(!cNowPlaying.flashEnable && !this.dontFlashNowPlaying && flash_nowplaying) {
							cNowPlaying.flashEnable = true;
							cNowPlaying.flashescounter = -2;
							cNowPlaying.flash = false;
						} else this.dontFlashNowPlaying=false;					
					}
                };
            } catch(e) {};
        };
    };
    
    this.showFocusedItem = function() {
        g_focus_row = this.getOffsetFocusItem(g_focus_id);
       // if(g_focus_row < scroll / properties.rowHeight || g_focus_row > scroll / properties.rowHeight + this.totalRowsVis) {
		   if(properties.showGroupHeaders) {
				scroll_to_track = (g_focus_row - Math.floor(this.totalRowsVis / 2)) * properties.rowHeight;
				scroll_to_header = this.groups[this.rows[g_focus_row].albumId].rowId * properties.rowHeight - properties.rowHeight*(properties.extraRowsNumber+1)
				if(g_focus_row*properties.rowHeight-scroll_to_header+properties.rowHeight>wh-properties.rowHeight) scroll=scroll_to_track
				else scroll=scroll_to_header				
		   } else 
				scroll = (g_focus_row - Math.floor(this.totalRowsVis / 4)) * properties.rowHeight;
				scroll = check_scroll(scroll);
            //if(!properties.enableFullScrollEffectOnFocusChange) {
             //   scroll_ = scroll + properties.rowHeight * 5 * (g_focus_id_prev <= g_focus_id ? -1 : 1);
           //     scroll_ = check_scroll(scroll_);
          //  };
           
            this.scrollbar.updateScrollbar();
       // };
    };
    
    this.selectAtoB = function(start_id, end_id) {
        var affectedItems = Array();
        
        if(this.SHIFT_start_id == null) {
            this.SHIFT_start_id = start_id;
        };
        
        //plman.ClearPlaylistSelection(g_active_playlist);
        
        var previous_focus_id = g_focus_id;
        
        if(start_id < end_id) {
            var deb = start_id;
            var fin = end_id;
        } else {
            var deb = end_id;
            var fin = start_id;        
        };

        for(var i = deb; i <= fin ;i++) {
            affectedItems.push(i);
        };
        plman.SetPlaylistSelection(g_active_playlist, affectedItems, true);
        
        plman.SetPlaylistFocusItem(g_active_playlist, end_id);
        
        if(affectedItems.length > 1) {
            if(end_id > previous_focus_id) {
                var delta = end_id - previous_focus_id;
                this.SHIFT_count += delta;
            } else {
                var delta = previous_focus_id - end_id;
                this.SHIFT_count -= delta;
            };
        };
    };
        
    this.getAlbumIdfromTrackId = function(valeur) { // fixed!
        if(valeur < 0) {
            return -1;
        } else {
            var mediane = 0; var deb = 0; var fin = this.groups.length - 1;
            while(deb <= fin){
                mediane = Math.floor((fin + deb)/2);
                if(valeur >= this.groups[mediane].start && valeur < this.groups[mediane].start + this.groups[mediane].count) {
                    return mediane;
                } else if(valeur < this.groups[mediane].start) {
                    fin = mediane - 1;
                } else {
                    deb = mediane + 1;
                };
            };
            return -1;
        };
    };
    
    this.getOffsetFocusItem = function(fid) { // fixed!
        var row_idx = 0;
        if(fid > -1) {
            if(properties.showGroupHeaders) {
                // fid = no item dans la playlist (focus id)
                // this.rows[] => albumId
                // 1 . rech album id contenant le focus_id
                g_focus_album_id = this.getAlbumIdfromTrackId(fid);
				//g_focus_album_id = this.rows[fid].albumId;
                // 2. rech row id
				var tot = this.rows.length;
                for(i = 0; i < tot; i++) {
                    if(this.rows[i].type != 0 && this.rows[i].type != 99 && this.rows[i].albumId == g_focus_album_id) {
                        if(this.groups[g_focus_album_id].collapsed) {
                            row_idx = i;  
                        } else {
                            var albumTrackId = g_focus_id - this.groups[g_focus_album_id].start;
                            row_idx = i + this.groupHeaderRowHeight + albumTrackId;
                        };
                        break;
                    };
                };
            } else {
                // 1 . rech album id contenant le focus_id
                g_focus_album_id = this.getAlbumIdfromTrackId(fid);
                // 2. rech row id
				var tot = this.rows.length;
                for(i = 0; i < tot; i++) {
                    if(this.rows[i].type == 0 && this.rows[i].albumId == g_focus_album_id) {
                        var albumTrackId = g_focus_id - this.groups[g_focus_album_id].start;
                        row_idx = i + albumTrackId;
                        break;
                    };
                };
            };
        };
        return row_idx;
    };
    
    this.init_groups = function() {
		var handle = null;
		var current = "";
		var previous = "";
        var g = 0, t = 0;
        var arr = [];
        var tr = [];
		
        var total = this.list.Count;
        this.totaltracks = 0;
		if(plman.PlaylistItemCount(g_active_playlist) > 0) {
			this.focusedTrackId = plman.GetPlaylistFocusItemIndex(g_active_playlist);
		} else {
			this.focusedTrackId = -1;
		};

		this.groups.splice(0, this.groups.length);

        var tf = properties.tf_groupkey;
        var str_filter = process_string(filter_text);
        
		for(var i = 0; i < total; i++) {
			handle = this.list[i];
            arr = tf.EvalWithMetadb(handle).split(" ## ");
            current = arr[0].toLowerCase();
            if(str_filter.length > 0) {
                var toAdd = match(arr[0]+" "+arr[1], str_filter);
            } else {
                var toAdd = true;  
            };
            if(toAdd) {
				this.totaltracks++;
                if(current != previous) {
                    if(g > 0) {
                        // finalize current group
                        this.groups[g-1].finalize(t, tr);
                        tr.splice(0, t);
                        t = 0;
                    }; 
                    if(i < total) {
                        // add new group
                        tr.push(arr[1].split(" ^^ "));
                        t++;
                        this.groups.push(new oGroup(g, i, handle, arr[0]));
						this.groups[g].TotalTime+=handle.Length;						
                        g++;
                        previous = current;
                    };
                } else {
                    // add track to current group
                    tr.push(arr[1].split(" ^^ "));
					this.groups[g-1].TotalTime+=handle.Length;
                    t++;
                };
            };
		};
        
        // update last group properties
        if(g > 0) this.groups[g-1].finalize(t, tr); 
		
		//Open group if there is only one group
		if(brw.groups.length==1) this.groups[0].collapsed = false;
    };
      
    this.populate = function(is_first_populate,call_id, set_active_playlist) {
		var set_active_playlist = typeof set_active_playlist !== 'undefined' ? set_active_playlist : true;
        if(this.list) this.list = undefined;
		if(set_active_playlist && !g_avoid_playlist_displayed_switch) setActivePlaylist();
		else g_avoid_playlist_displayed_switch = false;
		if(properties.lockOnNowPlaying) {
			this.FirstInitialisationDone = true;
			console.log("--> populate Smoothplaylist with PlayingPlaylist call_id:"+call_id+' Parent panel:'+properties.ParentName);
		} else {
			console.log("--> populate Smoothplaylist with ActivePlaylist call_id:"+call_id+' Parent panel:'+properties.ParentName);
		}
		if(properties.showHeaderBar) g_filterbox.set_default_text();
        this.list = plman.GetPlaylistItems(g_active_playlist);
        this.init_groups();
        this.setList();
        g_focus_row = brw.getOffsetFocusItem(g_focus_id);
        if(g_focus_id < 0) { // focused item not set
            if(is_first_populate) {
                scroll = scroll_ = 0;
            };
        } else {
            if(is_first_populate) {
                // if focused track not totally visible, we scroll to show it centered in the panel
                if(g_focus_row < scroll/properties.rowHeight || g_focus_row > scroll/properties.rowHeight + brw.totalRowsVis - 1) {
                    scroll = (g_focus_row - Math.floor(brw.totalRowsVis / 2)) * properties.rowHeight;
                    scroll = check_scroll(scroll);
                    scroll_ = scroll;
                };
            };
        };
		if((this.showNowPlaying_trigger || (!g_first_populate_done && properties.lockOnNowPlaying))) {
			if(!g_first_populate_done) {
				this.dontFlashNowPlaying = true;			
				this.showNowPlaying_trigger = true;
			}
			if(window.IsVisible){
				brw.showNowPlaying();
				this.showNowPlaying_trigger = false;
			}
		}
        if(brw.rowsCount > 0) brw.gettags(true);
        this.scrollbar.updateScrollbar();
        this.repaint();
        g_first_populate_done = true;
		if(Update_Required_function.indexOf("brw.populate(false")!=-1) Update_Required_function="";
    };
    
    this.getlimits = function() {
        if(this.rows.length <= this.totalRowsVis) {
            var start_ = 0;
            var end_ = this.rows.length - 1;
        } else {
            if(scroll_ < 0) scroll_ = scroll;
            var start_ = Math.round(scroll_ / properties.rowHeight + 0.4);
            var end_ = start_ + this.totalRows + (properties.groupHeaderRowsNumber - 1);
            // check boundaries
            start_ = start_ > 0 ? start_ - 1 : start_;
            if(start_ < 0) start_ = 0;
            if(end_ >= this.rows.length) end_ = this.rows.length - 1;
            //end_ = end_ < this.rows.length - 1  ? end_ + 1 : this.rows.length - 1;
        };
        g_start_ = start_;
        g_end_ = end_;
    };
       
    this.gettags = function(all) {
        var start_prev = g_start_;
        var end_prev = g_end_;
        
        this.getlimits();
        
        // force full list refresh especially when library is populating (call from 'on_item_focus_change')
        if( Math.abs(g_start_ - start_prev) > 1 || Math.abs(g_end_ - end_prev) > 1) all = true;
        
        var tf_grp = properties.tf_groupkey;
        var tf_trk = properties.tf_track;
        
        if(all) {
            for(var i = g_start_;i <= g_end_;i++){     
                switch(this.rows[i].type) {
                case this.groupHeaderRowHeight: // last group header row
                    // group tags
                    this.rows[i].groupkey = tf_grp.EvalWithMetadb(this.rows[i].metadb);
					this.rows[i].groupkeysplit = this.rows[i].groupkey.split(" ^^ ");					
                    // track tags
                    this.rows[i].infosraw = tf_trk.EvalWithMetadb(this.rows[i].metadb);
					this.rows[i].infos = this.rows[i].infosraw.split(" ^^ ");
                    break;
                case 0: // track row
                    // group tags
                    this.rows[i].groupkey = tf_grp.EvalWithMetadb(this.rows[i].metadb);
					this.rows[i].groupkeysplit = this.rows[i].groupkey.split(" ^^ ");
                    // track tags
                    this.rows[i].infosraw = tf_trk.EvalWithMetadb(this.rows[i].metadb);
					this.rows[i].infos = this.rows[i].infosraw.split(" ^^ ");					
                    break;
                };
            };
        } else {           
            if(g_start_ < start_prev) {
                switch(this.rows[g_start_].type) {
                case this.groupHeaderRowHeight: // last group header row
                    // track tags
                    this.rows[g_start_].infosraw = tf_trk.EvalWithMetadb(this.rows[g_start_].metadb);
					this.rows[g_start_].infos = this.rows[g_start_].infosraw.split(" ^^ ");					
                    break;
                case 0: // track row
                    // track tags
                    this.rows[g_start_].infosraw = tf_trk.EvalWithMetadb(this.rows[g_start_].metadb);
					this.rows[g_start_].infos = this.rows[g_start_].infosraw.split(" ^^ ");					
                    break;
                };
            } else if(g_start_ > start_prev || g_end_ > end_prev) {
                switch(this.rows[g_end_].type) {
                case this.groupHeaderRowHeight: // last group header row
                    // track tags
                    this.rows[g_end_].infosraw = tf_trk.EvalWithMetadb(this.rows[g_end_].metadb);
					this.rows[g_end_].infos = this.rows[g_end_].infosraw.split(" ^^ ");
                    break;
                case 0: // track row
                    // track tags
                    this.rows[g_end_].infosraw = tf_trk.EvalWithMetadb(this.rows[g_end_].metadb);
					this.rows[g_end_].infos = this.rows[g_end_].infosraw.split(" ^^ ");
                    break;
                };
            };
        };
    };
	this.SetRatingImages = function(width, height, on_color, off_color, border_color){
		if(typeof(on_color) == "undefined" || typeof(off_color) == "undefined"|| typeof(border_color) == "undefined") return false;
		var star_padding =-1;
		var star_indent = 2;
		var star_size = height;	
	    var star_height = height;
		while(star_padding<=0) {
			star_size = star_height;
			star_padding = Math.round((width-5*star_size)/4);
			star_height--;
		}
		if(star_height < height) var star_vpadding = Math.floor((height - star_height)/2);

		ratingImages = Array();
		for (var rating = 0; rating <= 5; rating++) {
			var img = gdi.CreateImage(width, height);
			var gb = img.GetGraphics();
			for (var i = 0; i < 5; i++) {
				DrawPolyStar(gb, i*(star_size+star_padding), star_vpadding, star_size, star_indent, 10, 0, colors.border, ((i<rating) ? on_color : off_color));
			}
			img.ReleaseGraphics(gb);
			ratingImages[rating] = img;
		}
		return ratingImages;
	}
    this.DefineCircleMask = function(size){
		var Mimg = gdi.CreateImage(size, size);
		gb = Mimg.GetGraphics();
		gb.SetSmoothingMode(2);
		gb.FillSolidRect(0, 0, size, size, GetGrey(255));
		gb.FillEllipse(1, 1, size-2, size-2, GetGrey(0));		
		Mimg.ReleaseGraphics(gb);
		this.coverMask = Mimg;	
	}		
    this.draw = function(gr) {
        var coverWidth, coverTop;
        var arr_groupinfo = [];
        var arr_t = [];
        var arr_e = [];
		this.group_unrequested_loading = false;
		
        if(repaint_main || !repaintforced){
            repaint_main = false;
            repaintforced = false;
            if(this.rows.length > 0) {
            
                var ax = this.marginLR + this.paddingLeft;				
                var aw = this.w-this.paddingRight - this.paddingLeft;
				
                var ah = properties.rowHeight;
                var ghrh = this.groupHeaderRowHeight;
                var g = 0;
                var coverWidth = cover.max_w;
				var album_name = "";
				var album_artist_name = "";
				
				if(properties.showGroupHeaders){
					if(properties.doubleRowText){
						var TrackCover_w = coverWidth-2;
						var TrackCover_h = coverWidth-2;										
					} else {
						var TrackCover_w = coverWidth - cover.margin * 2-cover.padding;
						var TrackCover_h = coverWidth - cover.margin * 2-cover.padding;											
					}				
				} else {
					var TrackCover_w = ah-cover.trackMargin*2+2;
					var TrackCover_h = ah-cover.trackMargin*2;
				}
				var TrackCover_x = ax+cover.trackMargin;		
				
                gr.SetTextRenderingHint(globalProperties.TextRendering);
				
                // get Now Playing track
                if(fb.IsPlaying && plman.PlayingPlaylist == g_active_playlist) {
                    this.nowplaying = plman.GetPlayingItemLocation();
                } else {
                    this.nowplaying = null;
                };
				
				//this.getlimits();
				
                for(var i = g_start_;i <= g_end_;i++){
                    ay = Math.floor(this.y + (i * ah) - scroll_);
                    this.rows[i].x = ax;
                    this.rows[i].y = ay;
                   
                    switch(this.rows[i].type) {
                    case ghrh: // group header row
                        if(ay > 0 - (ghrh * ah) && ay < this.h + (ghrh * ah)) {
							var t_selected = false;
                            try {
                                arr_groupinfo = this.rows[i].groupkeysplit;
								album_artist_name = arr_groupinfo[1];
								album_name = arr_groupinfo[0];
                                arr_e = this.groups[this.rows[i].albumId].tra[0];
                            } catch(e) {};
                            if(album_name == "?") {
                                if(this.groups[g].count > 1) {
                                    var album_name = "(Singles)"
                                } else {
                                    var arr_tmp = this.groups[g].tra[0];
                                    var album_name = "(Single) " + arr_tmp[1];
                                };
                            } else {
                                var album_name = album_name;
                            };	
							group_header_row_1 = album_name;
							group_header_row_2 = album_artist_name;
                            // Now Playing Group ?
                            if(this.nowplaying && this.nowplaying.PlaylistItemIndex >= this.groups[this.rows[i].albumId].start && this.nowplaying.PlaylistItemIndex < this.groups[this.rows[i].albumId].start + this.groups[this.rows[i].albumId].count) {
                                var nowplaying_group = true;
                            } else {
                                var nowplaying_group = false;
                            };
                            
                            // group id
                            g = this.rows[i].albumId;
                        
                            // ================
                            // group header bg
                            // ================
                            // if group collapsed, check if 1st track of the group is selected to highlight the group as a selected track]
							var group_height_fix = -2;
							
							if(properties.doubleRowText) {
								if(this.groups[g].collapsed){
									line_vertical_fix = 24;
									group_height_fix=-2;
								} else {
									line_vertical_fix = 24;
									group_height_fix=-10;									
								}
							}
							else {
								if(this.groups[g].collapsed){
									line_vertical_fix = 12;
									group_height_fix=2;

								} else {
									line_vertical_fix = 12;
									group_height_fix=-2;
								
								}								
							}						
                            if(this.groups[g].selected) {								
								if(g>0) {
									gr.FillGradRect(ax+gradient_m, ay - ((ghrh - 1) * ah)-line_vertical_fix, gradient_w-gradient_m, 1, 0, colors.grad_line_bg, colors.grad_line, 1.0);
									gr.FillGradRect(ax+gradient_w, ay - ((ghrh - 1) * ah)-line_vertical_fix, aw+this.paddingRight, 1, 0, colors.grad_line, colors.grad_line, 1.0);		
									gr.FillSolidRect(ax+gradient_m-1, ay - ((ghrh - 1) * ah)-line_vertical_fix, 2, 1, colors.grad_line_bg);									
								}
                            } else {

								if(g>0) {
									gr.FillGradRect(ax+gradient_m, ay - ((ghrh - 1) * ah)-line_vertical_fix, gradient_w-gradient_m, 1, 0, colors.grad_line_bg, colors.grad_line, 1.0);
									gr.FillGradRect(ax+gradient_w, ay - ((ghrh - 1) * ah)-line_vertical_fix, aw+this.paddingRight, 1, 0, colors.grad_line, colors.grad_line, 1.0);			
									gr.FillSolidRect(ax+gradient_m-1, ay - ((ghrh - 1) * ah)-line_vertical_fix, 2, 1, colors.grad_line_bg);												
								}
                                //gr.FillGradRect(ax, ay - ((ghrh - 1) * ah), aw+this.paddingRight, ah * ghrh - 1, 90, 0, colors.normal_txt & 0x06ffffff, 1.0);
                                //gr.FillSolidRect(ax, ay - ((ghrh - 1) * ah), aw+this.paddingRight, ah * ghrh - 1, colors.normal_txt & 0x05ffffff);
                                //gr.FillSolidRect(ax, ay - ((ghrh - 1) * ah), aw+this.paddingRight, 1, colors.normal_txt & 0x08ffffff);
                            };
							
							if(g_dragndrop_rowId>-1 && this.rows[g_dragndrop_rowId].albumId==g && this.rows[g_dragndrop_rowId].type!=0){
								if(g==0) {
									gr.FillSolidRect(ax, ay - ((ghrh - 1) * ah)-line_vertical_fix+5, aw+this.paddingRight, 2, colors.dragdrop_marker_line);
								}
								else if(!g_dragndrop_bottom) gr.FillSolidRect(ax, ay - ((ghrh - 1) * ah)-line_vertical_fix, aw+this.paddingRight, 2, colors.dragdrop_marker_line);
								else gr.FillSolidRect(ax, ay - ((ghrh - 1) * ah)-line_vertical_fix, aw+this.paddingRight, 2, colors.dragdrop_marker_line);
							}							
							if(g_dragndrop_bottom && i==this.rows.length-1-((properties.showGroupHeaders) ? properties.extraRowsNumber: 0))  gr.FillSolidRect(ax, ay + ah + Math.round(ah/2), aw+this.paddingRight, 2, colors.dragdrop_marker_line);
                            // ==========
                            // cover art
                            // ==========
                            if((ghrh > 1 || properties.doubleRowText) && cover.show) {
								cover.padding = (properties.doubleRowText)?16:10;
                                if(this.groups[g].cover_type == null) {
                                    if(this.groups[g].load_requested == 0) {
										//this.group_unrequested_loading=true;								
                                        this.groups[g].cover_img = g_image_cache.hit(this.rows[i].metadb, g);
										if (typeof this.groups[g].cover_img !== "undefined" && this.groups[g].cover_img!==null) {									
											this.groups[g].cover_type = 1;
										}
                                    }
                                } else if(this.groups[g].cover_type == 0) {
                                    this.groups[g].cover_img = images.noart;
									g_image_cache._cachelist[this.groups[g].cachekey] = FormatCover(images.noart, globalProperties.thumbnailWidthMax, globalProperties.thumbnailWidthMax, false);
                                } else if(this.groups[g].cover_type == 3) {
									this.groups[g].cover_img = images.stream;
									g_image_cache._cachelist[this.groups[g].cachekey] = FormatCover(images.stream, globalProperties.thumbnailWidthMax, globalProperties.thumbnailWidthMax, false);
                                };															
                                if(this.groups[g].cover_img != null && typeof this.groups[g].cover_img != "string") {
									if(!this.groups[g].cover_formated){
										this.groups[g].cover_img = FormatCover(this.groups[g].cover_img, TrackCover_w, TrackCover_h, false);
										this.groups[g].cover_formated = true;
									}									
									if(properties.circleMode && !this.groups[g].mask_applied){
										if(!this.coverMask) this.DefineCircleMask(TrackCover_w);
										width = this.groups[g].cover_img.Width;
										height = this.groups[g].cover_img.Height;
										coverMask = this.coverMask.Resize(width, height, 7);
										this.groups[g].cover_img.ApplyMask(coverMask);
										this.groups[g].mask_applied = true;
									}									
									if(properties.doubleRowText){
										var cv_w = coverWidth-2;
										var cv_h = coverWidth-2;	
										var dx = (cover.max_w - cv_w) / 2;
										var dy = (cover.max_h - cv_h) / 2;
										var cv_x = Math.floor(ax + dx + 1)+6;
										var cv_y = Math.floor(ay + dy - ((ghrh - 1) * ah))+group_height_fix-1;										
									}else {
										var cv_w = coverWidth - cover.margin * 2-cover.padding;
										var cv_h = coverWidth - cover.margin * 2-cover.padding;		
										var dx = (cover.max_w - cv_w) / 2;
										var dy = (cover.max_h - cv_h) / 2;
										var cv_x = Math.floor(ax + dx + 1)-2;
										var cv_y = Math.floor(ay + dy - ((ghrh - 1) * ah))+group_height_fix-2;										
									}
									try{
										gr.DrawImage(this.groups[g].cover_img, cv_x+8, cv_y, cv_w, cv_h, 0, 0, this.groups[g].cover_img.Width, this.groups[g].cover_img.Height,0,255);
									} catch (e) {
										console.log("DrawImage: invalid image ");
									}									
									if(!properties.circleMode)
										gr.DrawRect(cv_x+8, cv_y, cv_w-1, cv_h-1, 1.0, colors.cover_rectline);
									else {
										gr.SetSmoothingMode(2);
										gr.DrawEllipse(cv_x+9, cv_y+1, cv_w-2, cv_h-2, 1.0, colors.cover_rectline);		
										gr.SetSmoothingMode(0);
									}									
								} else if (this.groups[g].cover_img=="no_cover") {
                                    var cv_w = coverWidth - cover.margin * 2-cover.padding;
                                    var cv_h = coverWidth - cover.margin * 2-cover.padding;
                                    var dx = (cover.max_w - cv_w) / 2;
                                    var dy = (cover.max_h - cv_h) / 2;
                                    var cv_x = Math.floor(ax + dx + 1)-2;
                                    var cv_y = Math.floor(ay + dy - ((ghrh - 1) * ah))+group_height_fix-2;									
									gr.DrawImage(cover.nocover_img, cv_x+8, cv_y, cv_w, cv_h, 0, 0, cover.nocover_img.Width, cover.nocover_img.Height, 0, 245);
									gr.DrawRect(cv_x+8, cv_y, cv_w-1, cv_h-1, 1.0, colors.cover_rectline);									
                                } else {
                                    var cv_x = Math.floor(ax + cover.margin + 1);
                                    var cv_y = Math.floor(ay - ((ghrh - 1) * ah) + cover.margin)+group_height_fix;
                                    gr.DrawImage(images.loading_draw, cv_x-cover.margin, cv_y-cover.margin, images.loading_draw.Width, images.loading_draw.Height, 0, 0, images.loading_draw.Width, images.loading_draw.Height, images.loading_angle, 230);
                                };
                                var text_left_margin = cover.max_w+cv_x+((properties.doubleRowText)?16:0);
                            } else {
                                var text_left_margin = 0;
                            };
                            // =====
                            // text
                            // =====


							arr_e[2]=arr_e[2].replace(/\s+/g, " ");
							if(!isDefined(this.groups[g].row1_Width)) this.groups[g].row1_Width = gr.CalcTextWidth(group_header_row_1, g_font.italicplus3);
							if(!isDefined(this.groups[g].row2_Width)) this.groups[g].row2_Width = gr.CalcTextWidth(group_header_row_2, g_font.normal);	
                            if(!isDefined(this.groups[g].timeWidth)) this.groups[g].timeWidth = gr.CalcTextWidth(this.groups[g].TimeString, ((properties.doubleRowText)?g_font.normal:g_font.min1)) + 10;
							if(!isDefined(this.groups[g].dateWidth)) this.groups[g].dateWidth = gr.CalcTextWidth(arr_e[3], g_font.min1);		
							header_text_x = ax;
							header_text_w = aw;
                            // right area				
                            gr.GdiDrawText(this.groups[g].TimeString, ((properties.doubleRowText)?g_font.normal:g_font.min1),  colors.faded_txt, header_text_x + header_text_w - this.groups[g].timeWidth - 5, ay - ((ghrh - 1) * ah) + Math.round(ah*1/3)*(ghrh - 1) - 2+group_height_fix, this.groups[g].timeWidth, Math.round(ah*2/3), DT_RIGHT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
                            gr.GdiDrawText(arr_e[3], g_font.min1,  colors.faded_txt, header_text_x, ay - ((ghrh - 2) * ah)+group_height_fix-((properties.doubleRowText)?10:0), header_text_x + header_text_w -6-this.paddingLeft, Math.round(ah*2/3)*(ghrh - 1), DT_RIGHT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
                            // left area
                            gr.GdiDrawText(group_header_row_1, g_font.italicplus3, colors.normal_txt, header_text_x + text_left_margin, ay - ((ghrh - 1) * ah) + Math.round(ah*1/3)*(ghrh - 1) - 2+group_height_fix, header_text_w - text_left_margin - this.groups[g].timeWidth - 10, Math.round(ah*2/3), DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
                            gr.GdiDrawText(group_header_row_2, g_font.normal, colors.faded_txt, header_text_x + text_left_margin, ay - ((ghrh - 2) * ah)+group_height_fix-((properties.doubleRowText)?10:0), header_text_w - text_left_margin - this.groups[g].dateWidth, Math.round(ah*2/3)*(ghrh - 1), DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
														
							if(properties.showToolTip) {
								if((header_text_w - text_left_margin - this.groups[g].dateWidth)<this.groups[g].row2_Width || (header_text_w - text_left_margin - this.groups[g].timeWidth - 10)<this.groups[g].row1_Width){
									for(var p = 0; p < ghrh; p++) {this.rows[i-p].tooltip = true}

								} else {
									for(var p = 0; p < ghrh; p++) {this.rows[i-p].tooltip = false}
								}
							}
							
                        };
                        break;
                    case 0: // track row
							if(ay > this.y - properties.headerBarHeight - ah && ay < this.y + this.h) {
                            try {
                                arr_t = this.rows[i].infos;
                                arr_groupinfo = this.rows[i].groupkeysplit;
                                arr_e = this.groups[this.rows[i].albumId].tra[this.rows[i].albumTrackId];
                            } catch(e) {};
                            
                            // =========
                            // track bg
                            // =========

                            // selected track bg
							var t_selected_old = t_selected;
							var t_selected = this.rows[i].selected;
							
							if(this.nowplaying && this.rows[i].playlistTrackId == this.nowplaying.PlaylistItemIndex) {
								var color_selected = colors.grad_line_selected;
								var color_selected_off = colors.grad_line_bg_selected;								
							} else {
								var color_selected = colors.grad_line;
								var color_selected_off = colors.grad_line_bg;									
							}
                            if(t_selected) {
								//top
								if(!t_selected_old){
									gr.FillGradRect(ax+properties.track_gradient_margin, ay, properties.track_gradient_size, 1, 0, color_selected_off,  color_selected, 1.0);
									gr.FillGradRect(ax+aw-properties.track_gradient_size, ay, properties.track_gradient_size, 1, 0, color_selected, color_selected_off, 1.0);	
									gr.FillSolidRect(ax+properties.track_gradient_margin+properties.track_gradient_size, ay, aw-(properties.track_gradient_size*2)-properties.track_gradient_margin, 1, color_selected);
								}								
								//bottom
								//if(!(this.rows[i+1] && this.rows[i+1].selected)){						
									gr.FillGradRect(ax+properties.track_gradient_margin, ay+ah-1, properties.track_gradient_size, 1, 0, color_selected_off,  color_selected, 1.0);
									gr.FillGradRect(ax+aw-properties.track_gradient_size, ay+ah-1, properties.track_gradient_size, 1, 0, color_selected, color_selected_off, 1.0);	
									gr.FillSolidRect(ax+properties.track_gradient_margin+properties.track_gradient_size, ay+ah-1, aw-(properties.track_gradient_size*2)-properties.track_gradient_margin, 1, color_selected);	
								//}								
								
                            }
                            // focused track bg
                            if(this.rows[i].playlistTrackId == g_focus_id ) {
                                //gr.DrawRect(ax+1, ay+1, aw+this.paddingRight-2, ah-2, 2.0, colors.selected_bg & 0xd0ffffff);
                            };
							
							//Drag_marker
							if(g_dragndrop_rowId==i){
								if(!g_dragndrop_bottom) gr.FillSolidRect(ax, ay-1, aw+this.paddingRight, 2, colors.dragdrop_marker_line);
								else gr.FillSolidRect(ax, ay+ah-1, aw+this.paddingRight, 2, colors.dragdrop_marker_line);
							}
							if(g_dragndrop_bottom && i==this.rows.length-1-((properties.showGroupHeaders) ? properties.extraRowsNumber: 0))  gr.FillSolidRect(ax, ay+ah-1, aw+this.paddingRight, 2, colors.dragdrop_marker_line);
                            

                            // =====
                            // text
                            // =====
                            if(ay >= (0 - ah) && ay < this.y + this.h) {
                                
                                var track_type =  this.groups[this.rows[i].albumId].tracktype;
                                
                                var nbc = this.groups[this.rows[i].albumId].count.toString().length;
                                if(nbc == 1) nbc++;
                                
                                // fields
                                var track_num = arr_t[0] == "?" ? this.rows[i].albumTrackId+1 : arr_t[0];
                                var track_num_part = parseInt(track_num,10)+"    ";
                                if(properties.showArtistAlways || !properties.showGroupHeaders || arr_e[0].toLowerCase() != arr_groupinfo[0].toLowerCase() || properties.doubleRowText) {
                                    var track_artist_part = arr_e[0];
                                } else {
                                    var track_artist_part = "";
                                };
                                var track_title_part = arr_e[1];
                                var track_time_part = arr_t[1];
                                // rating tag fixing & formatting
                                if(this.rows[i].rating == -1) {
                                    if(isNaN(arr_t[2])) {
                                        var track_rating_part = 0;
                                    } else if(Math.abs(arr_t[2]) > 0 && Math.abs(arr_t[2]) < 6) {
                                        var track_rating_part = Math.abs(arr_t[2]);
                                    } else {
                                        var track_rating_part = 0;
                                    };
                                    this.rows[i].rating = track_rating_part;
                                } else {
                                    track_rating_part = this.rows[i].rating;
                                };
                                
                                if(properties.showRating && track_type != 3 && (!properties.showRatingSelected || t_selected || (properties.showRatingRated && track_rating_part>0))) {
									if(!g_var_cache.isdefined("rating_length")) g_var_cache.set("rating_length",gr.CalcTextWidth("HHHHH", g_font.plus6));
									this.rows[i].rating_length = g_var_cache.get("rating_length");
                                } else {
                                    this.rows[i].rating_length = 0;
                                };
																
                                if(properties.doubleRowText) {
                                    var ay_1 = ay + 2;
                                    var ah_1 = Math.floor(ah /2);
                                    var ay_2 = ay + ah_1 - 2;
                                    var ah_2 = ah - Math.floor(ah /2);

                                    if(this.nowplaying && this.rows[i].playlistTrackId == this.nowplaying.PlaylistItemIndex) { // now playing track
										if(cNowPlaying.flashEnable && cNowPlaying.flash){
											gr.FillSolidRect(-1, ay+1, ww+2, ah-2, colors.flash_bg);
										}		
										if(cNowPlaying.flashEnable && !properties.darklayout && properties.drawProgressBar && properties.AlbumArtProgressbar && (!properties.doubleRowShowCover || properties.showGroupHeaders)){
											image_to_draw = images.now_playing_black;
											gr.DrawImage(image_to_draw, ax+11+((properties.doubleRowShowCover && !properties.showGroupHeaders)?3:0),  ay+Math.round(ah/2-image_to_draw.Height/2)-1, image_to_draw.Width, image_to_draw.Height, 0, 0, image_to_draw.Width, image_to_draw.Height, 0, 255);
										}
                                        this.nowplaying_y = ay;
                                        if(!g_time_remaining) {
                                            g_time_remaining = properties.tf_time_remaining.Eval(true);
                                        };
                                        if(!g_elapsed_seconds) {
                                            g_elapsed_seconds = properties.tf_elapsed_seconds.Eval(true);
                                        };			
                                        if(!g_total_seconds) {
                                            g_total_seconds = properties.tf_total_seconds.Eval(true);
                                        };			
                                        track_time_part = g_time_remaining;
										
										if(cNowPlaying.flashEnable && cNowPlaying.flash){
											gr.DrawRect(-1, ay, ww+2, ah-1, 1.0, colors.flash_rectline);
										}				
																			
										if(properties.doubleRowShowCover && !properties.showGroupHeaders) {
											if(arr_t[0]!="?") track_title_part = track_num+". "+track_title_part;										
											else track_title_part = track_title_part;		
										}

										if(!g_var_cache.isdefined("track_num_part")) g_var_cache.set("track_num_part",gr.CalcTextWidth("000", g_font.normal));
                                        cColumns.track_num_part = g_var_cache.get("track_num_part") + 14;										
                                        if(!isDefined(this.rows[i].artist_part_w)) this.rows[i].artist_part_w = track_artist_part.length > 0 ? gr.CalcTextWidth(track_artist_part, g_font.italicmin1) + 0 : 0;
                                        if(!isDefined(this.rows[i].title_part_w)) this.rows[i].title_part_w = gr.CalcTextWidth(track_title_part, g_font.normal) + 10;
										if(!g_var_cache.isdefined("track_time_part")) g_var_cache.set("track_time_part",gr.CalcTextWidth("00:00:00", g_font.normal));
                                        cColumns.track_time_part = g_var_cache.get("track_time_part");		
										
										if(properties.doubleRowShowCover && !properties.showGroupHeaders)
											var left_margin = cover.trackMargin + TrackCover_w ;
										else
											var left_margin = cColumns.track_num_part;
										
                                        var tx = ax + left_margin + ((properties.doubleRowShowCover && !properties.showGroupHeaders)?cover.trackMarginRight:0);
                                        var tw = aw - left_margin - ((properties.doubleRowShowCover && !properties.showGroupHeaders)?cover.trackMarginRight:0);
										
										if(properties.showToolTip) {
											if((tw-cColumns.track_time_part-15-(this.rows[i].rating_length+5))<(this.rows[i].title_part_w-10)){
												this.rows[i].tooltip = true;
											} else this.rows[i].tooltip = false;
										}

                                        if(track_time_part == "ON AIR") {
                                            gr.GdiDrawText(g_radio_title, g_font.normal, colors.normal_txt, tx+10, ay_1, tw-cColumns.track_time_part-15-(this.rows[i].rating_length+10), ah_1, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
                                            gr.GdiDrawText(g_radio_artist,g_font.min1, colors.fadedsmall_txt, tx+10, ay_2, tw-cColumns.track_time_part-15, ah_2, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
                                        } else {
                                            gr.GdiDrawText(track_title_part, g_font.normal, colors.normal_txt, tx+10, ay_1, tw-cColumns.track_time_part-15-(this.rows[i].rating_length+10), ah_1, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
                                            gr.GdiDrawText(track_artist_part, g_font.italicmin1, colors.fadedsmall_txt, tx+10, ay_2, tw-cColumns.track_time_part-15, ah_2, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
                                        };
                                        gr.GdiDrawText(track_time_part, g_font.normal, colors.normal_txt, tx+tw-cColumns.track_time_part-8, ay_1, cColumns.track_time_part, ah_1, DT_RIGHT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
																													
										if(properties.drawProgressBar && (cNowPlaying.flashescounter<5 || !cNowPlaying.flashEnable)){
											if(track_num_part>9) var select_start=4;
											else var select_start=0;										
											var total_size=aw-3+select_start-12-properties.track_gradient_size;
											var elapsed_seconds = g_elapsed_seconds;
											var total_seconds =  g_total_seconds;
											if(total_seconds==0) total_seconds = 2
											var ratio = elapsed_seconds/total_seconds;
											if(track_time_part == "ON AIR" || elapsed_seconds == "ON AIR") var current_size = properties.track_gradient_size+total_size-1;	
											else var current_size =  properties.track_gradient_size+Math.round(total_size*ratio);
											if(properties.doubleRowShowCover && !properties.showGroupHeaders) var text_limit = current_size-34;
											else var text_limit = current_size-23;
											if(isNaN(current_size) || current_size<0) current_size = properties.track_gradient_size+total_size-1;
											
											if(properties.AlbumArtProgressbar) {												
												var playingText = gdi.CreateImage(total_size+15, ah);
												pt = playingText.GetGraphics();
													pt.SetTextRenderingHint(globalProperties.TextRendering);
													
													if(typeof(this.groups[this.rows[i].albumId].g_wallpaperImg) == "undefined" || !this.groups[this.rows[i].albumId].g_wallpaperImg) {		
														this.groups[this.rows[i].albumId].g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying(), true, ww, ah*16);
													};						
													pt.DrawImage(this.groups[this.rows[i].albumId].g_wallpaperImg, 0, 0, total_size+15,  ah, 0, 0, this.groups[this.rows[i].albumId].g_wallpaperImg.Width, ah);
													pt.FillSolidRect(0, 0, total_size+15, ah,colors.albumartprogressbar_overlay)	
															
													pt.DrawString(track_time_part, g_font.normal, colors.albumartprogressbar_txt, 0, 1, total_size+6, ah_1, 554696704);
												playingText.ReleaseGraphics(pt);
												
												var progress_x = ax+22-properties.track_gradient_size
												var progress_w = ax+current_size+7;			
												
												gr.DrawImage(playingText, progress_x, ay, progress_w, ah, 0, 0, current_size+3, ah, 0, 255);
												gr.DrawRect(ax+22-properties.track_gradient_size, ay, ax+current_size+6, ah-1,1,colors.albumartprogressbar_rectline)
												if(track_time_part == "ON AIR") {
													gr.GdiDrawText(g_radio_title, g_font.normal, colors.albumartprogressbar_txt, tx+11, ay_1, Math.min(text_limit,tw-cColumns.track_time_part-15-this.rows[i].rating_length), ah_1, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX);			
													gr.GdiDrawText(g_radio_artist, g_font.italicmin1, colors.albumartprogressbar_txt, tx+11, ay_2, Math.min(text_limit,tw-cColumns.track_time_part-15), ah_2, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX);	
												} else {
													var margin_left = tx+10 - progress_x;
													gr.GdiDrawText(track_title_part, g_font.normal, colors.albumartprogressbar_txt, progress_x + margin_left, ay_1, Math.min(progress_w-margin_left,tw-cColumns.track_time_part-15-this.rows[i].rating_length), ah_1, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX);			
													gr.GdiDrawText(track_artist_part, g_font.italicmin1, colors.albumartprogressbar_txt, progress_x + margin_left, ay_2, Math.min(progress_w-margin_left,tw-cColumns.track_time_part-15), ah_2, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX);	
												};												

											} else {
												gr.FillGradRect(ax+25-properties.track_gradient_size, ay, (properties.track_gradient_size>current_size+6)?current_size+6:properties.track_gradient_size, 1, 0, progressbar_color_bg_off, colors.progressbar, 1.0); //grad top
												gr.FillSolidRect(ax+25-properties.track_gradient_size, ay,1,1,progressbar_color_bg_off)  // 1px bug fix
												gr.FillSolidRect(ax+25, ay, current_size+12-19, 1, colors.progressbar); //line top
												
												gr.FillGradRect(ax+25-properties.track_gradient_size, ay+1, (properties.track_gradient_size>current_size+6)?current_size+6:properties.track_gradient_size, ah-2, 0, progressbar_color_bg_off, progressbar_color_bg_on, 1.0); //grad main bg											
												gr.FillSolidRect(ax+25, ay+1, current_size+11-19, ah-2, progressbar_color_bg_on); //main bg												
												
												gr.FillGradRect(ax+25-properties.track_gradient_size, ay-1+ah, (properties.track_gradient_size>current_size+6)?current_size+6:properties.track_gradient_size, 1, 0, progressbar_color_bg_off, colors.progressbar, 1.0); //grad bottom
												gr.FillSolidRect(ax+25-properties.track_gradient_size, ay-1+ah,1,1,progressbar_color_bg_off)  // 1px bug fix
												gr.FillSolidRect(ax+25, ay-1+ah, current_size+12-19, 1, colors.progressbar); //line bottom	
												if(t_selected) gr.FillSolidRect(ax+current_size+17, ay+1, 1, ah-2, colors.grad_line); //vertical line when selected											
												gr.FillSolidRect(ax+current_size+17, ay+1, 1, ah-2, colors.progressbar);	//vertical line	
												gr.FillSolidRect(ax+current_size+18, ay+1, 2, ah+1, progressbar_color_shadow);	//vertical shadow			
												gr.FillSolidRect(ax+25-properties.track_gradient_size, ay+ah, current_size-5+properties.track_gradient_size, 2, progressbar_color_shadow);	//horizontal shadow	
											}
										}				
                                        // rating Stars
										try {								
											if(properties.showRating && track_type != 3 && (!properties.showRatingSelected || t_selected || (properties.showRatingRated && track_rating_part>0))) {
												if(!this.ratingImages && properties.showRating) {
													this.ratingImages = this.SetRatingImages(this.rows[i].rating_length, ah_1, colors.rating_icon_on, colors.rating_icon_off, colors.rating_icon_border);
												}				
												if(this.ratingImages && this.ratingImages.length==6) {
													if(this.hoverRatingRow!=i) var rating = track_rating_part;
													else var rating = this.rows[i].hover_rating;	
													gr.DrawImage(this.ratingImages[rating], tx+tw-cColumns.track_time_part-(this.rows[i].rating_length-5), ay_1, this.ratingImages[rating].Width, this.ratingImages[rating].Height, 0, 0, this.ratingImages[rating].Width, this.ratingImages[rating].Height, 0, 255);	
												}		
											};		
										} catch(e){}										
										if(properties.doubleRowShowCover && !properties.showGroupHeaders){
											g = this.rows[i].albumId;
											if(this.groups[g].cover_type == null) {
												if(this.groups[g].load_requested == 0 && this.groups[g].start==this.rows[i].playlistTrackId) {							
													this.groups[g].cover_img = g_image_cache.hit(this.rows[i].metadb, g);
													if (typeof this.groups[g].cover_img !== "undefined" && this.groups[g].cover_img!==null) {												
														this.groups[g].cover_type = 1;														
													}
												}
											} else if(this.groups[g].cover_type == 0) {
												this.groups[g].cover_img = images.noart;
												g_image_cache._cachelist[this.groups[g].cachekey] = FormatCover(images.noart, globalProperties.thumbnailWidthMax, globalProperties.thumbnailWidthMax, false);
											} else if(this.groups[g].cover_type == 3) {
												this.groups[g].cover_img = images.stream;
												g_image_cache._cachelist[this.groups[g].cachekey] = FormatCover(images.stream, globalProperties.thumbnailWidthMax, globalProperties.thumbnailWidthMax, false);
											};									
											if(this.groups[g].cover_img != null && typeof this.groups[g].cover_img != "string") {
												if(!this.groups[g].cover_formated){
													this.groups[g].cover_img = FormatCover(this.groups[g].cover_img, TrackCover_w, TrackCover_h, false);
													this.groups[g].cover_formated = true;
												}									
												if(!this.groups[g].mask_applied && properties.circleMode){
													if(!this.coverMask) this.DefineCircleMask(TrackCover_w);
													width = this.groups[g].cover_img.Width;
													height = this.groups[g].cover_img.Height;
													coverMask = this.coverMask.Resize(width, height, 7);
													this.groups[g].cover_img.ApplyMask(coverMask);
													this.groups[g].mask_applied = true;
												}													
												gr.DrawImage(this.groups[g].cover_img, TrackCover_x+8, ay+cover.trackMargin, TrackCover_w, TrackCover_h, 0, 0, this.groups[g].cover_img.Width, this.groups[g].cover_img.Height,0,255);											
												if(!properties.circleMode)
													gr.FillSolidRect(TrackCover_x+8, ay+cover.trackMargin, TrackCover_w, TrackCover_h, colors.playing_cover_overlay);
												else {
													gr.SetSmoothingMode(2);
													gr.FillEllipse(TrackCover_x+9, ay+cover.trackMargin+1, TrackCover_w-2, TrackCover_h-2, colors.playing_cover_overlay);				
													gr.SetSmoothingMode(0);
												}	
											} else if (this.groups[g].cover_img=="no_cover") {					
												gr.DrawImage(cover.nocover_img, TrackCover_x+8, ay+cover.trackMargin, TrackCover_w, TrackCover_h, 0, 0, cover.nocover_img.Width, cover.nocover_img.Height, 0, 245);
												gr.FillSolidRect(TrackCover_x+8, ay+cover.trackMargin, TrackCover_w, TrackCover_h, colors.playing_cover_overlay);					
											}
											if(!properties.circleMode)
												gr.DrawRect(TrackCover_x+8, ay+cover.trackMargin, TrackCover_w-1, TrackCover_h-1, 1.0, (properties.drawProgressBar && properties.AlbumArtProgressbar) ? colors.cover_rectline_AlbumArtProgressbar : colors.cover_rectline);
											else {
												gr.SetSmoothingMode(2);
												gr.DrawEllipse(TrackCover_x+9, ay+cover.trackMargin+1, TrackCover_w-2, TrackCover_h-2, 1.0, (properties.drawProgressBar && properties.AlbumArtProgressbar) ? colors.cover_rectline_AlbumArtProgressbar : colors.cover_rectline);				
												gr.SetSmoothingMode(0);
											}	
											
											
											var text_left_margin = cover.max_w+TrackCover_x;
											if(properties.circleMode) var y_adjust = 1;
											else var y_adjust = 0;
											if(g_elapsed_seconds == 0 || g_elapsed_seconds / 2 == Math.floor(g_elapsed_seconds / 2)) {
												gr.DrawImage(images.now_playing_0, ax+13+((properties.doubleRowShowCover && !properties.showGroupHeaders)?3:0), ay+y_adjust+Math.round(ah/2-images.now_playing_0.Height/2)-1, images.now_playing_0.Width, images.now_playing_0.Height, 0, 0, images.now_playing_0.Width, images.now_playing_0.Height, 0, 255);
											} else {
												gr.DrawImage(images.now_playing_1, ax+13+((properties.doubleRowShowCover && !properties.showGroupHeaders)?3:0),  ay+y_adjust+Math.round(ah/2-images.now_playing_0.Height/2)-1, images.now_playing_1.Width, images.now_playing_1.Height, 0, 0, images.now_playing_1.Width, images.now_playing_1.Height, 0, 255);
											};		
																						
										} else {
											if(properties.circleMode) var y_adjust = 1;
											else var y_adjust = 0;											
											if (cNowPlaying.flashescounter<5 || !(cNowPlaying.flashEnable && !properties.darklayout && properties.drawProgressBar && properties.AlbumArtProgressbar)){
												if(g_elapsed_seconds == 0 || g_elapsed_seconds / 2 == Math.floor(g_elapsed_seconds / 2)) {
													gr.DrawImage(images.now_playing_0, ax+13+((properties.doubleRowShowCover && !properties.showGroupHeaders)?3:0), ay+y_adjust+Math.round(ah/2-images.now_playing_0.Height/2)-1, images.now_playing_0.Width, images.now_playing_0.Height, 0, 0, images.now_playing_0.Width, images.now_playing_0.Height, 0, 255);
												} else {
													gr.DrawImage(images.now_playing_1, ax+13+((properties.doubleRowShowCover && !properties.showGroupHeaders)?3:0),  ay+y_adjust+Math.round(ah/2-images.now_playing_0.Height/2)-1, images.now_playing_1.Width, images.now_playing_1.Height, 0, 0, images.now_playing_1.Width, images.now_playing_1.Height, 0, 255);
												};
											}
										}											
                                    } else { //default track
										if(properties.doubleRowShowCover && !properties.showGroupHeaders){
											g = this.rows[i].albumId
											if(this.groups[g].cover_type == null) {
												if(this.groups[g].load_requested == 0) {							
													this.groups[g].cover_img = g_image_cache.hit(this.rows[i].metadb, g);
													if (typeof this.groups[g].cover_img !== "undefined" && this.groups[g].cover_img!==null) {
														this.groups[g].cover_type = 1;
													}
												}
											} else if(this.groups[g].cover_type == 0) {
												this.groups[g].cover_img = images.noart;
												g_image_cache._cachelist[this.groups[g].cachekey] = FormatCover(images.noart, globalProperties.thumbnailWidthMax, globalProperties.thumbnailWidthMax, false);
											} else if(this.groups[g].cover_type == 3) {
												this.groups[g].cover_img = images.stream;
												g_image_cache._cachelist[this.groups[g].cachekey] = FormatCover(images.stream, globalProperties.thumbnailWidthMax, globalProperties.thumbnailWidthMax, false);
											};										
											if(this.groups[g].cover_img != null && typeof this.groups[g].cover_img != "string") {
												if(!this.groups[g].cover_formated){
													this.groups[g].cover_img = FormatCover(this.groups[g].cover_img, TrackCover_w, TrackCover_h, false);
													this.groups[g].cover_formated = true;
												}									
												if(!this.groups[g].mask_applied && properties.circleMode){
													if(!this.coverMask) this.DefineCircleMask(TrackCover_w);
													width = this.groups[g].cover_img.Width;
													height = this.groups[g].cover_img.Height;
													coverMask = this.coverMask.Resize(width, height, 7);
													this.groups[g].cover_img.ApplyMask(coverMask);
													this.groups[g].mask_applied = true;
												}													
												gr.DrawImage(this.groups[g].cover_img, TrackCover_x+8, ay+cover.trackMargin, TrackCover_w, TrackCover_h, 0, 0, this.groups[g].cover_img.Width, this.groups[g].cover_img.Height,0,255);
												if(!properties.circleMode)
													gr.DrawRect(TrackCover_x+8, ay+cover.trackMargin, TrackCover_w-1, TrackCover_h-1, 1.0, colors.cover_rectline);
												else {
													gr.SetSmoothingMode(2);
													gr.DrawEllipse(TrackCover_x+9, ay+cover.trackMargin+1, TrackCover_w-2, TrackCover_h-2, 1.0, colors.cover_rectline);		
													gr.SetSmoothingMode(0);
												}
											} else if (this.groups[g].cover_img=="no_cover") {					
												gr.DrawImage(cover.nocover_img, TrackCover_x+8, ay+cover.trackMargin, TrackCover_w, TrackCover_h, 0, 0, cover.nocover_img.Width, cover.nocover_img.Height, 0, 245);
												gr.DrawRect(TrackCover_x+8, ay+cover.trackMargin, TrackCover_w-1, TrackCover_h-1, 1.0, colors.cover_rectline);									
											} else {
												gr.DrawRect(TrackCover_x+8, ay+cover.trackMargin, TrackCover_w-1, TrackCover_h-1, 1.0, colors.cover_rectline);
											};
											var text_left_margin = cover.max_w+TrackCover_x;
										}									
										if(properties.doubleRowShowCover && !properties.showGroupHeaders) {
											if(arr_t[0]!="?") track_title_part = track_num+". "+track_title_part;											
										}
										if(!g_var_cache.isdefined("track_num_part")) g_var_cache.set("track_num_part",gr.CalcTextWidth("000", g_font.normal));
                                        cColumns.track_num_part = g_var_cache.get("track_num_part") + 14;	
                                        if(!isDefined(this.rows[i].artist_part_w)) this.rows[i].artist_part_w = track_artist_part.length > 0 ? gr.CalcTextWidth(track_artist_part, g_font.normal) : 0;
                                        if(!isDefined(this.rows[i].title_part_w)) this.rows[i].title_part_w = gr.CalcTextWidth(track_title_part, g_font.normal) + 10;
										if(!g_var_cache.isdefined("track_time_part")) g_var_cache.set("track_time_part",gr.CalcTextWidth("00:00:00", g_font.normal));
                                        cColumns.track_time_part = g_var_cache.get("track_time_part");		
										
										if(properties.doubleRowShowCover && !properties.showGroupHeaders)
											var left_margin = cover.trackMargin + TrackCover_w ;
										else
											var left_margin = cColumns.track_num_part;
										
                                        var tx = ax + left_margin + ((properties.doubleRowShowCover && !properties.showGroupHeaders)?cover.trackMarginRight:0);
                                        var tw = aw - left_margin - ((properties.doubleRowShowCover && !properties.showGroupHeaders)?cover.trackMarginRight:0);
										
										if(properties.showToolTip) {
											if((tw-cColumns.track_time_part-15-(this.rows[i].rating_length+5))<(this.rows[i].title_part_w-10)){
												this.rows[i].tooltip = true;
											} else {
												this.rows[i].tooltip = false;
											}
										}
										
                                        if(!properties.doubleRowShowCover || properties.showGroupHeaders) gr.GdiDrawText(track_num_part, g_font_light, colors.tracknumber_txt, ax+8, ay_1, cColumns.track_num_part, ah_1, DT_RIGHT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
                                        gr.GdiDrawText(track_artist_part, g_font.italicmin1, colors.fadedsmall_txt, tx+10, ay_2, tw-cColumns.track_time_part-15, ah_2, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
                                        gr.GdiDrawText(track_title_part, g_font.normal, colors.normal_txt, tx+10, ay_1, tw-cColumns.track_time_part-15-(this.rows[i].rating_length+5), ah_1, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
                                        gr.GdiDrawText(track_time_part, g_font.normal, colors.normal_txt, tx+tw-cColumns.track_time_part-8, ay_1, cColumns.track_time_part, ah_1, DT_RIGHT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
                                        // rating Stars
										try {
											if(properties.showRating && track_type != 3 && (!properties.showRatingSelected || t_selected || (properties.showRatingRated && track_rating_part>0))) {
												if(!this.ratingImages && properties.showRating) {
													this.ratingImages = this.SetRatingImages(this.rows[i].rating_length, ah_1, colors.rating_icon_on, colors.rating_icon_off, colors.rating_icon_border);
												}				
												if(this.ratingImages && this.ratingImages.length==6) {
													if(this.hoverRatingRow!=i) var rating = track_rating_part;
													else var rating = this.rows[i].hover_rating;												
													gr.DrawImage(this.ratingImages[rating], tx+tw-cColumns.track_time_part-(this.rows[i].rating_length-5), ay_1, this.ratingImages[rating].Width, this.ratingImages[rating].Height, 0, 0, this.ratingImages[rating].Width, this.ratingImages[rating].Height, 0, 255);	
												}												
											};
										} catch(e){}
                                    };
                                } else {

                                    // calc text part width + dtaw text
                                    if(this.nowplaying && this.rows[i].playlistTrackId == this.nowplaying.PlaylistItemIndex) { // now playing track
										if(cNowPlaying.flashEnable && cNowPlaying.flash){
											gr.FillSolidRect(-1, ay+1, ww+2, ah-2, colors.flash_bg);
										}	
										if(cNowPlaying.flashEnable && !properties.darklayout && properties.drawProgressBar && properties.AlbumArtProgressbar){
											image_to_draw = images.now_playing_black;
											gr.DrawImage(image_to_draw, ax+11, ay+Math.round(ah/2-image_to_draw.Height/2)-1, image_to_draw.Width, image_to_draw.Height, 0, 0, image_to_draw.Width, image_to_draw.Height, 0, 255);
										}
                                        this.nowplaying_y = ay;
                                        if(!g_time_remaining) {
                                            g_time_remaining = properties.tf_time_remaining.Eval(true);
                                        };
                                        if(!g_elapsed_seconds) {
                                            g_elapsed_seconds = properties.tf_elapsed_seconds.Eval(true);
                                        };			
                                        if(!g_total_seconds) {
                                            g_total_seconds = properties.tf_total_seconds.Eval(true);
                                        };												
                                        track_time_part = g_time_remaining;
										

										if(cNowPlaying.flashEnable && cNowPlaying.flash){
											gr.DrawRect(-1, ay, ww+2, ah-1, 1.0, colors.flash_rectline);
										}												
                                        //
                                        if(track_time_part == "ON AIR") {
                                            if(g_radio_artist.length > 0) {
                                                g_radio_artist_final = " - " + g_radio_artist;
                                            } else g_radio_artist_final = ""
                                        };
                                        //
										if(!g_var_cache.isdefined("track_num_part")) g_var_cache.set("track_num_part",gr.CalcTextWidth("000", g_font.normal));
                                        cColumns.track_num_part = g_var_cache.get("track_num_part") + 11;	
                                        if(!isDefined(this.rows[i].title_part_w)) this.rows[i].title_part_w = gr.CalcTextWidth(track_title_part, g_font.normal) + 10;
										if(!g_var_cache.isdefined("track_time_part")) g_var_cache.set("track_time_part",gr.CalcTextWidth("00:00:00", g_font.normal));
                                        cColumns.track_time_part = g_var_cache.get("track_time_part") + 7;		
										
                                        var tx = ax + cColumns.track_num_part;
                                        var tw = aw - cColumns.track_num_part;
										
                                        if(track_time_part == "ON AIR") {
                                            if(!isDefined(this.rows[i].artist_part_w)) this.rows[i].artist_part_w = g_radio_title.length > 0 ? gr.CalcTextWidth(g_radio_title, g_font.normal) +3: 0;
                                        } else {
											if(properties.showGroupHeaders){
												 track_part1 = track_title_part;
												 if(!isDefined(this.rows[i].track_part1)) this.rows[i].track_part1 = track_part1.length > 0 ? gr.CalcTextWidth(track_part1 + " - ", g_font.normal) + 5 : 5;
												 track_part1 = track_title_part
												 track_part2 = track_artist_part;
												 track_part1_color = colors.normal_txt
												 if(!isDefined(this.rows[i].track_part2)) this.rows[i].track_part2 = track_part2.length > 0 ? gr.CalcTextWidth(track_part2, g_font.normal) : 0;												 
												 if(properties.showToolTip) {												 
													 if((tw-cColumns.track_time_part-5-(this.rows[i].rating_length+5))<(this.rows[i].track_part1+this.rows[i].track_part2)){
														this.rows[i].tooltip = true;
													 } else this.rows[i].tooltip = false;
												 }
											} else{
												if(!isDefined(this.rows[i].track_part1)) this.rows[i].track_part1 = track_artist_part.length > 0 ? gr.CalcTextWidth(track_artist_part + " - ", g_font.normal) + 5 : 5;	
												track_part1 = track_artist_part;
												track_part2 = track_title_part;
												track_part1_color = colors.normal_txt;
												if(!isDefined(this.rows[i].track_part2)) this.rows[i].track_part2 = track_part2.length > 0 ? gr.CalcTextWidth(track_part2, g_font.normal) : 0;		 												
											}												
                                            if(!isDefined(this.rows[i].artist_part_w)) this.rows[i].artist_part_w = track_artist_part.length > 0 ? gr.CalcTextWidth(track_artist_part + " - ", g_font.normal) +3: 0;
											if(properties.showToolTip) {
												if((tw-this.rows[i].track_part1-cColumns.track_time_part-5-(this.rows[i].rating_length+5))<(this.rows[i].track_part2)){
													this.rows[i].tooltip = true;
												} else this.rows[i].tooltip = false;											
											}
                                        };		
										
										show_track_part2 = (tw-this.rows[i].track_part1-cColumns.track_time_part-5-(this.rows[i].rating_length+5)>13);
										if(show_track_part2 && track_part2!="" && track_part1!="") track_part1 = track_part1 + " - ";										
                                        if(this.rows[i].track_part1 > 0) {
                                            if(track_time_part == "ON AIR") {
                                                gr.GdiDrawText(g_radio_title, g_font.normal, colors.normal_txt, tx+10, ay, tw-cColumns.track_time_part-15-(this.rows[i].rating_length+5), ah, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
                                            } else {
                                                gr.GdiDrawText(track_part1, g_font.normal, track_part1_color, tx+13, ay, tw-cColumns.track_time_part-15-(this.rows[i].rating_length+5), ah, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
                                            };
                                        };

										
                                        if(track_time_part == "ON AIR") {
                                            gr.GdiDrawText(g_radio_artist_final, g_font.normal, colors.fadedsmall_txt, tx+this.rows[i].artist_part_w+10, ay, tw-this.rows[i].artist_part_w-cColumns.track_time_part-5-(this.rows[i].rating_length+5), ah, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
                                        } else if(show_track_part2) {
                                            gr.GdiDrawText(track_part2, g_font_light, colors.fadedsmall_txt, tx+this.rows[i].track_part1+8, ay, tw-this.rows[i].track_part1-cColumns.track_time_part-5-(this.rows[i].rating_length+5), ah, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
                                        };
                                        gr.GdiDrawText(track_time_part, g_font.normal, colors.normal_txt, tx+tw-cColumns.track_time_part-8, ay, cColumns.track_time_part, ah, DT_RIGHT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
																																											

										
										if(properties.drawProgressBar && (cNowPlaying.flashescounter<5 || !cNowPlaying.flashEnable)){	
											if(track_num_part>9) var select_start=4;
											else var select_start=0;	
											var progress_start = 10;											
											var total_size=aw-3+select_start-12-progress_start;
											var elapsed_seconds = g_elapsed_seconds;
											var total_seconds =  g_total_seconds;
											var ratio = elapsed_seconds/total_seconds;
											if(track_time_part == "ON AIR" || elapsed_seconds == "ON AIR") var current_size =  progress_start + total_size;	
											else var current_size =  progress_start + Math.round(total_size*ratio);		
											if(isNaN(current_size) || current_size<0) current_size = progress_start + total_size;	
											
											if(properties.AlbumArtProgressbar) {
												var playingText = gdi.CreateImage(total_size+15, ah);
												pt = playingText.GetGraphics();
													pt.SetTextRenderingHint(globalProperties.TextRendering);
													
													if(typeof(this.groups[this.rows[i].albumId].g_wallpaperImg) == "undefined" || !this.groups[this.rows[i].albumId].g_wallpaperImg) {		
														this.groups[this.rows[i].albumId].g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying(), true);
													};						
													pt.DrawImage(this.groups[this.rows[i].albumId].g_wallpaperImg, 0, 0, total_size+15,  ah, 0, 0, this.groups[this.rows[i].albumId].g_wallpaperImg.Width, ah);
													pt.FillSolidRect(0, 0, total_size+15, ah,colors.albumartprogressbar_overlay)	

													pt.DrawString(track_time_part, g_font.normal, colors.albumartprogressbar_txt, 0, 0, total_size+6, ah, 554696704);													
												playingText.ReleaseGraphics(pt);
												var progress_x = ax+22-properties.track_gradient_size
												var progress_w = ax+current_size+5;
												gr.DrawImage(playingText, progress_x, ay, progress_w, ah, 0, 0, current_size+3, ah, 0, 255);
												gr.DrawRect(ax+22-properties.track_gradient_size, ay, ax+current_size+4, ah-1,1,colors.albumartprogressbar_rectline)
												
												if(track_time_part == "ON AIR") {
														gr.GdiDrawText(g_radio_title, g_font.normal, colors.albumartprogressbar_txt, tx+13, ay, Math.min(current_size-35,tw-cColumns.track_time_part-15-this.rows[i].rating_length), ah, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX);					
														gr.GdiDrawText(g_radio_artist, g_font_light, colors.albumartprogressbar_txt, tx+this.rows[i].artist_part_w+18, ay, Math.min(current_size-this.rows[i].artist_part_w-22,tw-this.rows[i].artist_part_w-cColumns.track_time_part-5-this.rows[i].rating_length), ah, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX);	
												} else {
														 
														var margin_left = tx+13 - progress_x;

														gr.GdiDrawText(track_part1, g_font.normal, colors.albumartprogressbar_txt, tx+13, ay, Math.min(progress_w-margin_left,tw-cColumns.track_time_part-15-this.rows[i].rating_length), ah, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX);					
														gr.GdiDrawText(track_part2, g_font_light, colors.albumartprogressbar_txt, tx+this.rows[i].track_part1+8, ay, Math.min(progress_w-margin_left-this.rows[i].track_part1+5,tw-this.rows[i].track_part1-cColumns.track_time_part-10-this.rows[i].rating_length), ah, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX);	
														
												};												
											} else {												
												gr.FillGradRect(ax+25-properties.track_gradient_size, ay, (properties.track_gradient_size>current_size+6)?current_size+6:properties.track_gradient_size, 1, 0, progressbar_color_bg_off, colors.progressbar, 1.0); //grad top
												gr.FillSolidRect(ax+25-properties.track_gradient_size, ay,1,1,progressbar_color_bg_off)  // 1px bug fix
												gr.FillSolidRect(ax+25, ay, current_size+12-19, 1, colors.progressbar); //line top
												
												gr.FillGradRect(ax+25-properties.track_gradient_size, ay+1, (properties.track_gradient_size>current_size+6)?current_size+6:properties.track_gradient_size, ah-2, 0, progressbar_color_bg_off, progressbar_color_bg_on, 1.0); //grad main bg											
												gr.FillSolidRect(ax+25, ay+1, current_size+11-19, ah-2, progressbar_color_bg_on); //main bg											
												
												gr.FillGradRect(ax+25-properties.track_gradient_size, ay-1+ah, (properties.track_gradient_size>current_size+6)?current_size+6:properties.track_gradient_size, 1, 0, progressbar_color_bg_off, colors.progressbar, 1.0); //grad bottom
												gr.FillSolidRect(ax+25-properties.track_gradient_size, ay-1+ah,1,1,progressbar_color_bg_off) // 1px bug fix
												gr.FillSolidRect(ax+25, ay-1+ah, current_size+12-19, 1, colors.progressbar); //line bottom		
												gr.FillSolidRect(ax+current_size+17, ay+1, 1, ah-2, colors.progressbar);	//vertical line	
												if(t_selected) gr.FillSolidRect(ax+current_size+17, ay+1, 1, ah-2, colors.grad_line); //vertical line when selected
												gr.FillSolidRect(ax+current_size+18, ay+1, 2, ah+1, progressbar_color_shadow);	//vertical shadow		
												gr.FillSolidRect(ax+25-properties.track_gradient_size, ay+ah, current_size-5+properties.track_gradient_size, 2, progressbar_color_shadow);	//horizontal shadow	
											}
										}		
                                        // rating Stars
										try {
											if(properties.showRating && track_type != 3 && (!properties.showRatingSelected || t_selected || (properties.showRatingRated && track_rating_part>0))) {
												if(!this.ratingImages && properties.showRating) {
													this.ratingImages = this.SetRatingImages(this.rows[i].rating_length, ah, colors.rating_icon_on, colors.rating_icon_off, colors.rating_icon_border);
												}				
												if(this.ratingImages && this.ratingImages.length==6) {
													if(this.hoverRatingRow!=i) var rating = track_rating_part;
													else var rating = this.rows[i].hover_rating;												
													gr.DrawImage(this.ratingImages[rating], tx+tw-cColumns.track_time_part-(this.rows[i].rating_length)+7, ay, this.ratingImages[rating].Width, this.ratingImages[rating].Height, 0, 0, this.ratingImages[rating].Width, this.ratingImages[rating].Height, 0, 255);	
												}												
											};	
										} catch(e){}										
										if (cNowPlaying.flashescounter<5 || !(cNowPlaying.flashEnable && !properties.darklayout && properties.drawProgressBar && properties.AlbumArtProgressbar)){
											if(g_elapsed_seconds == 0 || g_elapsed_seconds / 2 == Math.floor(g_elapsed_seconds / 2)) {
												gr.DrawImage(images.now_playing_0, ax+11, ay+Math.round(ah/2-images.now_playing_0.Height/2)-1, images.now_playing_0.Width, images.now_playing_0.Height, 0, 0, images.now_playing_0.Width, images.now_playing_0.Height, 0, 255);
											} else {
												gr.DrawImage(images.now_playing_1, ax+11,  ay+Math.round(ah/2-images.now_playing_0.Height/2)-1, images.now_playing_1.Width, images.now_playing_1.Height, 0, 0, images.now_playing_1.Width, images.now_playing_1.Height, 0, 255);
											};
										}										
                                    } else { // default track
			

										if(!g_var_cache.isdefined("track_num_part")) g_var_cache.set("track_num_part",gr.CalcTextWidth("000", g_font.normal));
                                        cColumns.track_num_part = g_var_cache.get("track_num_part") + 11;	
                                        if(!isDefined(this.rows[i].artist_part_w)) this.rows[i].artist_part_w = track_artist_part.length > 0 ? gr.CalcTextWidth(track_artist_part + " - ", g_font.normal) + 5 : 5;
                                        if(!isDefined(this.rows[i].title_part_w)) this.rows[i].title_part_w = gr.CalcTextWidth(track_title_part, g_font.normal) + 10;
										if(!g_var_cache.isdefined("track_time_part")) g_var_cache.set("track_time_part",gr.CalcTextWidth("00:00:00", g_font.normal));
                                        cColumns.track_time_part = g_var_cache.get("track_time_part") + 7;
										
                                        var tx = ax + cColumns.track_num_part;
                                        var tw = aw - cColumns.track_num_part;
                                        gr.GdiDrawText(track_num_part, g_font_light, colors.tracknumber_txt, ax+10, ay, cColumns.track_num_part, ah, DT_RIGHT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
										if(track_time_part == "ON AIR"){
											 track_part1 = track_artist_part;
											 if(!isDefined(this.rows[i].track_part1)) this.rows[i].track_part1 = track_part1.length > 0 ? gr.CalcTextWidth(track_part1 + " - ", g_font.normal) + 5 : 5;
											 track_part1 = track_artist_part;
											 track_part2 = "";
											 track_part2_color = colors.fadedsmall_txt											
										} else if(properties.showGroupHeaders){
											 track_part1 = track_title_part;
											 if(!isDefined(this.rows[i].track_part1)) this.rows[i].track_part1 = track_part1.length > 0 ? gr.CalcTextWidth(track_part1 + " - ", g_font.normal) + 5 : 5;
											 track_part1 = track_title_part;
											 track_part2 = track_artist_part;
											 track_part2_color = colors.fadedsmall_txt;
											 if(!isDefined(this.rows[i].track_part2)) this.rows[i].track_part2 = track_part2.length > 0 ? gr.CalcTextWidth(track_part2, g_font.normal) : 0;											 
											 if(properties.showToolTip) {
												if((tw-cColumns.track_time_part-5-(this.rows[i].rating_length+5))<(this.rows[i].track_part1+this.rows[i].track_part2)){
													this.rows[i].tooltip = true;
												} else this.rows[i].tooltip = false;
											}											
										} else{
											if(!isDefined(this.rows[i].track_part1)) this.rows[i].track_part1 = track_artist_part.length > 0 ? gr.CalcTextWidth(track_artist_part + " - ", g_font.normal) + 5 : 5;
											track_part1 = track_artist_part;
											track_part2 = track_title_part;
											if(!isDefined(this.rows[i].track_part2)) this.rows[i].track_part2 = track_part2.length > 0 ? gr.CalcTextWidth(track_part2, g_font.normal) : 0;
											if(track_part1.length>0) track_part2_color = colors.fadedsmall_txt
											else  track_part2_color = colors.normal_txt
											if(properties.showToolTip) {
												if((tw-this.rows[i].track_part1-cColumns.track_time_part-5-(this.rows[i].rating_length+5))<(this.rows[i].track_part2)){
													this.rows[i].tooltip = true;
												} else this.rows[i].tooltip = false;
											}											
										}
										
										show_track_part2 = (tw-this.rows[i].track_part1-cColumns.track_time_part-5-(this.rows[i].rating_length+5)>13);
										if(show_track_part2 && track_part2!="" && track_part1!="") track_part1 = track_part1 + " - ";
                                        if(this.rows[i].track_part1 > 0) {
                                            gr.GdiDrawText(track_part1, g_font.normal, colors.normal_txt, tx+13, ay, tw-cColumns.track_time_part-20-this.rows[i].rating_length, ah, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
                                        };
                                        if(show_track_part2)
										gr.GdiDrawText(track_part2, g_font_light, track_part2_color, tx+this.rows[i].track_part1+8, ay, tw-this.rows[i].track_part1-cColumns.track_time_part-10-this.rows[i].rating_length, ah, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
                                        gr.GdiDrawText(track_time_part, g_font.normal, colors.normal_txt, tx+tw-cColumns.track_time_part-8, ay, cColumns.track_time_part, ah, DT_RIGHT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
                                        // rating Stars
										try {
											if(properties.showRating && track_type != 3 && (!properties.showRatingSelected || t_selected || (properties.showRatingRated && track_rating_part>0))) {
												if(!this.ratingImages && properties.showRating) {
													this.ratingImages = this.SetRatingImages(this.rows[i].rating_length, ah, colors.rating_icon_on, colors.rating_icon_off, colors.rating_icon_border);
												}				
												if(this.ratingImages && this.ratingImages.length==6) {	
													if(this.hoverRatingRow!=i) var rating = track_rating_part;
													else var rating = this.rows[i].hover_rating;
													gr.DrawImage(this.ratingImages[rating], tx+tw-cColumns.track_time_part-(this.rows[i].rating_length)+7, ay, this.ratingImages[rating].Width, this.ratingImages[rating].Height, 0, 0, this.ratingImages[rating].Width, this.ratingImages[rating].Height, 0, 255);	
												}												
											};
										} catch(e){}
                                    };
                                };
                            };
                        };
                        break;
                    case 99: // extra bottom row
						var t_selected = false;
                        break;
                    };

                };
				//if(properties.darklayout) Draw bottom gradient
				gr.FillGradRect(0, wh-colors.fading_bottom_height, ww, colors.fading_bottom_height, 90, colors.grad_bottom_2,  colors.grad_bottom_1,1);		

                // Incremental Search Display
                if(cList.search_string.length > 0) {
                    brw.tt_x = Math.floor(((brw.w) / 2) - (((cList.search_string.length*13)+(10*2)) / 2));
                    brw.tt_y = brw.y + Math.floor((brw.h / 2) - 30);
                    brw.tt_w = Math.round((cList.search_string.length*13)+(10*2));
                    brw.tt_h = 40;
                    gr.FillSolidRect(brw.tt_x, brw.tt_y, brw.tt_w, brw.tt_h,colors.keyboard_search_bg);
                    try {
                        gr.GdiDrawText(cList.search_string, g_font.plus7, cList.inc_search_noresult?colors.keyboard_search_txtred:colors.keyboard_search_txt, brw.tt_x, brw.tt_y , brw.tt_w , brw.tt_h, DT_CENTER | DT_NOPREFIX | DT_CALCRECT | DT_VCENTER);
                    } catch(e) {};
                };

            } else if(g_first_populate_done){ // no track, playlist is empty
					var px = 0;
					var py = this.y + Math.round(this.h  / 2)-1 - wh * 0.05;
					if(g_filterbox.inputbox.text!='') {
						var text1 = "0 matches";
						if(properties.lockOnNowPlaying) var text2 = "in the played tracks";	
						else var text2 = "in the current playlist";							
					} else if(properties.lockOnNowPlaying){
						var text1 = "No sound...";
						var text2 = "Nothing played";						
					} else {
						var playlistname = plman.GetPlaylistName(g_active_playlist);
						if(playlistname==globalProperties.selection_playlist || playlistname==globalProperties.playing_playlist) {
							var text1 = playlistname;
							var text2 = "No music found.";					
						} else {
							var text1 = playlistname;
							var text2 = "This playlist is empty.";											
						}
					}
					gr.GdiDrawText(text1, g_font.plus5, colors.normal_txt, this.x, py - 40, this.w, 36, DT_CENTER | DT_BOTTOM | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
					gr.FillSolidRect(this.x+this.w/2-75,py, 150, 1, colors.border);
					gr.GdiDrawText(text2, g_font.italicplus1, colors.faded_txt, this.x, py + 6, this.w, 20, DT_CENTER | DT_TOP | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
            } else { // no track, playlist is empty
					var px = 0;
					var py = this.y + Math.round(this.h  / 2)-1;
					gr.GdiDrawText("Loading...", g_font.plus5, colors.normal_txt, this.x, py - 40, this.w, 35, DT_CENTER | DT_BOTTOM | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
					gr.FillSolidRect(this.x+this.w/2-75,py, 150, 1, colors.border);						
					gr.GdiDrawText("Playlist viewer", g_font.italicplus1, colors.faded_txt, this.x, py + 6, this.w, 20, DT_CENTER | DT_TOP | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
            };
			
			this.drawLeftLine = (main_panel_state.isEqual(2) || main_panel_state.isEqual(3))

            // draw header
            if(properties.showHeaderBar) {
                //var boxText = "  "+this.groups.length+" album"+(this.groups.length>1?"s  ":"  ");
                var boxText = (this.totaltracks > 1 ? this.totaltracks+" items" : this.totaltracks+" item");
                // draw background part above playlist (headerbar)
				gr.FillSolidRect(0, 0, ww, properties.headerBarHeight, colors.headerbar_bg);

				gr.FillGradRect(this.x+(this.drawLeftLine?1:0), properties.headerBarHeight, ww, 1, 0, colors.headerbar_line, colors.headerbar_line, 1.0);	
				                
				if(g_filterbox.inputbox.text.length>0) {
					var text_width = gr.CalcTextWidth(boxText,g_font.min1)
					var inputbox_width = gr.CalcTextWidth(g_filterbox.inputbox.text,g_font.min1)
				} else{
					var text_width = 0;
					var inputbox_width = 0;
				}
				
				var tx = cFilterBox.x + cFilterBox.w + Math.round(22 * g_zoom_percent / 100) + 5 - text_width;
				var tw = this.w - tx - 18;
				if(inputbox_width<tw-10){
					//this.x + (cx * this.thumbnailWidth) + this.marginSide + this.marginLR;
					try {
						gr.GdiDrawText(boxText, g_font.min2,colors.faded_txt, tx, properties.headerBarPaddingTop, tw, properties.headerBarHeight-properties.headerBarPaddingTop-1, DT_RIGHT | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX | DT_END_ELLIPSIS);
					} catch(e) {console.log(e)};
				}
            };
			
			if(this.drawLeftLine) gr.FillSolidRect(0, 0, 1, wh, colors.sidesline);

			//if(cScrollBar.enabled || (g_cursor.x > ww - cScrollBar.width && g_cursor.x < ww && g_cursor.y > properties.headerBarHeight && g_cursor.y < wh))  {
			if(cScrollBar.enabled && pman.state !=1)  {
				brw.scrollbar && brw.scrollbar.draw(gr);
			};	
        };
    };
    
    this.selectGroupTracks = function(aId) {
        var affectedItems = [];
        var end = this.groups[aId].start + this.groups[aId].count;
        for(var i = this.groups[aId].start; i < end; i++) {
            affectedItems.push(i);
        };
        plman.SetPlaylistSelection(g_active_playlist, affectedItems, true);
    };
    this.getGroupTracks = function(aId) {
        var tracks = new FbMetadbHandleList();
        var end = this.groups[aId].rowId + this.groups[aId].count;
        for(var i = this.groups[aId].rowId; i < end; i++) {
            tracks.Add(this.rows[i].metadb);
        };
       return tracks;
    };
    this._isHover = function(x, y) {
        return (x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h);
    };
    
    this.dragndrop_check = function(x, y, rowId) {
        if(this.activeRow > -1 && rowId == this.activeRow) {
			while(typeof(this.rows[rowId]) !== "undefined" && this.rows[rowId].type == 99) {
				rowId=rowId+1;
				if(typeof(this.rows[rowId]) == "undefined") {rowId=this.rows.length-1;g_dragndrop_bottom=true;break}
			};			
            g_dragndrop_trackId = this.rows[rowId].playlistTrackId;
            g_dragndrop_rowId = rowId;
        };
    };
    this.on_mouse = function(event, x, y) {
        this.ishover = (x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h);
        
        // get hover row index (mouse cursor hover)
        if(y > this.y && y < this.y + this.h) {
            this.activeRow = Math.ceil((y + scroll_ - this.y) / properties.rowHeight - 1);
            if(this.activeRow >= this.rows.length) {
				this.activeRow = -1;
				
			}
        } else {
            this.activeRow = -1;
			
        };
		
        // rating check
        if(this.activeRow > -1) {
            var rating_x = this.x + this.w - cColumns.track_time_part - this.rows[this.activeRow].rating_length -5;
            var rating_y = Math.floor(this.y + (this.activeRow * properties.rowHeight) - scroll_);
            if(properties.showRating && (!properties.showRatingSelected || this.rows[this.activeRow].selected || (properties.showRatingRated && this.rows[this.activeRow].rating>0))) {
                this.ishover_rating = (this.rows[this.activeRow].type == 0 && x >= rating_x-this.rows[this.activeRow].rating_length/5  && x <= rating_x + this.rows[this.activeRow].rating_length && y >= rating_y && y <= rating_y + properties.rowHeight);
            } else {
                this.ishover_rating = false;
            };
        } else {
            this.ishover_rating = false;
        };
        
        switch(event) {
            case "down":
			
				if( this.activeRow == -1) plman.ClearPlaylistSelection(g_active_playlist)
                this.metadblist_selection = plman.GetPlaylistSelectedItems(g_active_playlist);
                if(!cTouch.down && !timers.mouseDown && this.ishover && this.activeRow > -1 && Math.abs(scroll - scroll_) < 2) {
                    var rowType = this.rows[this.activeRow].type;

                    this.drag_clicked = true;
                    this.drag_clicked_x = x;
                    this.drag_clicked_y = y;
					this.dragSource_track = this.rows[this.activeRow];
					
                    switch(true) {
                        case (rowType > 0 && rowType < 99):     // ----------------> group header row
                            var playlistTrackId = this.rows[this.activeRow].playlistTrackId;
                            if(utils.IsKeyPressed(VK_SHIFT)) {
                                if (g_focus_id != playlistTrackId) {
                                    if (this.SHIFT_start_id != null) {
                                        this.selectAtoB(this.SHIFT_start_id, playlistTrackId);
                                    } else {
                                        this.selectAtoB(g_focus_id, playlistTrackId);
                                    };
                                };
                            } else if(utils.IsKeyPressed(VK_CONTROL)) {
                                this.selectGroupTracks(this.rows[this.activeRow].albumId);
                                this.SHIFT_start_id = null;
                            } else {
								plman.ClearPlaylistSelection(g_active_playlist);
                                if(!((properties.autocollapse || properties.expandBySingleClick) && this.groups[this.rows[this.activeRow].albumId].collapsed)) {
                                    this.selectGroupTracks(this.rows[this.activeRow].albumId);
                                };
                                this.SHIFT_start_id = null;
                            };
                            plman.SetPlaylistFocusItem(g_active_playlist, playlistTrackId);														
							if(this.groups[this.rows[this.activeRow].albumId].collapsed && properties.expandBySingleClick) {
								this.groups[this.rows[this.activeRow].albumId].collapsed = false
								this.setList();
								this.scrollbar.updateScrollbar();
								if(this.rowsCount > 0) this.gettags(true);					
							}								
                            break;
                        case (rowType == 0):                    // ----------------> track row
                            var playlistTrackId = this.rows[this.activeRow].playlistTrackId;
                            if(utils.IsKeyPressed(VK_SHIFT)) {
                                if(g_focus_id != playlistTrackId) {
                                    if (this.SHIFT_start_id != null) {
                                        this.selectAtoB(this.SHIFT_start_id, playlistTrackId);
                                    } else {
                                        this.selectAtoB(g_focus_id, playlistTrackId);
                                    };
                                };
                            } else if(utils.IsKeyPressed(VK_CONTROL)) {
                                if(plman.IsPlaylistItemSelected(g_active_playlist, playlistTrackId)) {
                                    plman.SetPlaylistSelectionSingle(g_active_playlist, playlistTrackId, false);
                                } else {
                                    plman.SetPlaylistSelectionSingle(g_active_playlist, playlistTrackId, true);
                                    plman.SetPlaylistFocusItem(g_active_playlist, playlistTrackId);
                                };
                                this.SHIFT_start_id = null;
                            } else {
								
                                // check if rating to update ?
                                if(this.ishover_rating) {
                                    // calc new rating
                                    var l_rating = Math.ceil((x - rating_x) / (this.rows[this.activeRow].rating_length / 5) + 0.1);
                                    if(l_rating > 5) l_rating = 5;
									else if(l_rating < 0) l_rating = 0;
                                    // update if new rating <> current track rating
                                    if (this.rows[this.activeRow].tracktype < 2) {
                                        g_rating_updated = true;
                                        g_rating_rowId = this.activeRow;
										if(l_rating!=this.rows[this.activeRow].rating) this.rows[this.activeRow].rating = rateSong(l_rating,this.rows[this.activeRow].rating, this.rows[this.activeRow].metadb);
										this.track_rated = true;
                                    };
                                } else {
                                    if(plman.IsPlaylistItemSelected(g_active_playlist, playlistTrackId)) {
                                        if(this.metadblist_selection.Count > 1) {
                                            //plman.ClearPlaylistSelection(g_active_playlist);
                                            //plman.SetPlaylistSelectionSingle(g_active_playlist, playlistTrackId, true);
                                            //plman.SetPlaylistFocusItem(g_active_playlist, playlistTrackId);
                                        } else {
                                            // nothing, single track already selected
                                        };
                                    } else {
                                        plman.ClearPlaylistSelection(g_active_playlist);
                                        plman.SetPlaylistSelectionSingle(g_active_playlist, playlistTrackId, true);
                                        plman.SetPlaylistFocusItem(g_active_playlist, playlistTrackId);
                                    };
                                    this.SHIFT_start_id = null;
                                };
                            };
                            break;
                        case (rowType == 99):                   // ----------------> extra empty row
							plman.ClearPlaylistSelection(g_active_playlist);
                            break;
                    };
                    this.repaint();
                } else {
                    // scrollbar
                    if(cScrollBar.enabled && cScrollBar.visible) {
                        brw.scrollbar && brw.scrollbar.on_mouse(event, x, y);
                    };
                };
                break;
            case "up":
                this.metadblist_selection = plman.GetPlaylistSelectedItems(g_active_playlist);
                if(this.drag_clicked && this.activeRow > -1) {
                    var rowType = this.rows[this.activeRow].type;
                    //
                    switch(true) {
                        case (rowType > 0 && rowType < 99):     // ----------------> group header row
                            //var playlistTrackId = this.rows[this.activeRow].playlistTrackId;
                            break;
                        case (rowType == 0):                    // ----------------> track row
                            var playlistTrackId = this.rows[this.activeRow].playlistTrackId;
                            if(!utils.IsKeyPressed(VK_SHIFT) && !utils.IsKeyPressed(VK_CONTROL)) {
                                if(plman.IsPlaylistItemSelected(g_active_playlist, playlistTrackId)) {
                                    if(this.metadblist_selection.Count > 1 && !this.track_rated) {
                                        plman.ClearPlaylistSelection(g_active_playlist);
                                        plman.SetPlaylistSelectionSingle(g_active_playlist, playlistTrackId, true);
                                        plman.SetPlaylistFocusItem(g_active_playlist, playlistTrackId);
                                    };
                                };
                            };
                            break;
                        case (rowType == 99):                   // ----------------> extra empty row

                            break;
                    };
                    this.repaint();
                };
				this.drag_tracks = false;
                this.drag_clicked = false;
				this.track_rated = false;
                // scrollbar
                if(cScrollBar.enabled && cScrollBar.visible) {
                    brw.scrollbar && brw.scrollbar.on_mouse(event, x, y);
                };
                break;
            case "dblclk":
                if(this.ishover && this.activeRow > -1 && Math.abs(scroll - scroll_) < 2) {
                    var rowType = this.rows[this.activeRow].type;
                    switch(true) {
                        case (rowType > 0 && rowType < 99): // group header
                            if(!properties.expandBySingleClick || !this.groups[this.rows[this.activeRow].albumId].collapsed) {
								this.groups[this.rows[this.activeRow].albumId].collapsed = !this.groups[this.rows[this.activeRow].albumId].collapsed;
								this.setList(true);

								///*
								g_focus_row = this.getOffsetFocusItem(g_focus_id);
								// if focused track not totally visible, we scroll to show it centered in the panel
								if(g_focus_row < scroll / properties.rowHeight || g_focus_row > scroll / properties.rowHeight + brw.totalRowsVis - 1) {
									scroll = (g_focus_row - Math.floor(brw.totalRowsVis / 2)) * properties.rowHeight;
									scroll = check_scroll(scroll);
									scroll_ = scroll;
								};
								//*/
								if(this.rowsCount > 0) brw.gettags(true);
								this.scrollbar.updateScrollbar();
								brw.repaint();
							}
                            break;
                        case (rowType == 0): // track
							plman.FlushPlaybackQueue();	
		
							plman.PlayingPlaylist = g_active_playlist;								
							plman.SetPlaylistFocusItem(g_active_playlist,this.rows[this.activeRow].playlistTrackId);	
							plman.AddPlaylistItemToPlaybackQueue(g_active_playlist, this.rows[this.activeRow].playlistTrackId);
							if(fb.IsPaused || fb.IsPlaying) fb.Next();	
							else fb.Play();							
							//previous_active_playlist = plman.ActivePlaylist;
							//window.NotifyOthers("nowPlayingTrack",true);
							//plman.ActivePlaylist = g_active_playlist;

							
							//if(fb.IsPaused || fb.IsPlaying) fb.Stop();
							

							//plman.SetPlaylistFocusItemByHandle(g_active_playlist, this.rows[this.activeRow].metadb);
							//plman.ExecutePlaylistDefaultAction(g_active_playlist, this.rows[this.activeRow].playlistTrackId);

							//fb.RunContextCommandWithMetadb("Play", this.rows[this.activeRow].metadb);
													
							//fb.RunContextCommandWithMetadb(cmd, this.metadb, 0);
                            break;
                        case (rowType == 99): // extra empty row

                            break;
                    };
                    this.repaint();
                } else {
                    // scrollbar
                    if(cScrollBar.enabled && cScrollBar.visible) {
                        brw.scrollbar && brw.scrollbar.on_mouse(event, x, y);
                    };
                };
                break;
            case "move":
                if(g_lbtn_click && this.drag_clicked && !this.drag_moving) {
                    if(!properties.DropInplaylist || this.h > cPlaylistManager.rowHeight * 6) {
						if(properties.DropInplaylist && !this.drag_tracks && (Math.abs(y - this.drag_clicked_y) < 15 && Math.abs(x - this.drag_clicked_x) > 15) && plman.GetPlaylistSelectedItems(g_active_playlist).Count>0) {
							this.drag_moving = true;				
							pman.state = 1;
							window.SetCursor(IDC_HELP);
							g_tooltip.Deactivate();
							if(timers.hidePlaylistManager) {
								window.ClearInterval(timers.hidePlaylistManager);
								timers.hidePlaylistManager = false;
							};
							if(!timers.showPlaylistManager) {
								timers.showPlaylistManager = setInterval(pman.showPanel, 25);
							};
							var items = plman.GetPlaylistSelectedItems(g_active_playlist);
							if(this.rows[this.activeRow].type==2 || this.rows[this.activeRow].type==1){
								album_info=this.rows[this.activeRow].groupkeysplit;
								if(items.Count>1) {
									var line1 = "Dragging";	
									var line2 = items.Count+" tracks";	
								} else {
									var line1 = album_info[0];
									var line2 = album_info[1];
								}																			
							} else if(this.rows[this.activeRow].type==0){
								track_info=this.groups[this.rows[this.activeRow].albumId].tra[this.rows[this.activeRow].albumTrackId];
								if(items.Count>1) {
									var line1 = "Dragging";	
									var line2 = items.Count+" tracks";	
								} else {
									var line1 = track_info[1];
									var line2 = track_info[0];
								}
							}									
							var options = {
								show_text : false,	
								use_album_art : false,
								use_theming : false,
								custom_image : createDragText(line1, line2, 220),
							}								
							var effect = fb.DoDragDrop(window.ID, items, g_drop_effect.copy | g_drop_effect.move | g_drop_effect.link, options); 
							// nothing happens here until the mouse button is released	
							items = undefined;		
							pman.on_mouse("leave", 0, 0);							
						} else if((!properties.DropInplaylist && (Math.abs(x - this.drag_clicked_x) > 5 || Math.abs(y - this.drag_clicked_y) > 5)) || (Math.abs(y - this.drag_clicked_y) > 15 && !this.drag_moving)){
							if(!this.drag_tracks && this.dragSource_track.type!=99 && plman.GetPlaylistSelectedItems(g_active_playlist).Count>0) {
								this.drag_tracks = true;
								g_tooltip.Deactivate();
								on_drag_over(null, x, y, null);		
								var items = plman.GetPlaylistSelectedItems(g_active_playlist);
								if(this.rows[this.activeRow].type==2 || this.rows[this.activeRow].type==1){
									album_info=this.rows[this.activeRow].groupkeysplit;
									if(items.Count>1) {
										var line1 = "Dragging";	
										var line2 = items.Count+" tracks";	
									} else {
										var line1 = album_info[0];
										var line2 = album_info[1];
									}																			
								} else if(this.rows[this.activeRow].type==0){
									track_info=this.groups[this.rows[this.activeRow].albumId].tra[this.rows[this.activeRow].albumTrackId];
									if(items.Count>1) {
										var line1 = "Dragging";	
										var line2 = items.Count+" tracks";	
									} else {
										var line1 = track_info[1];
										var line2 = track_info[0];
									}
								}									
								var options = {
									show_text : false,	
									use_album_art : false,
									use_theming : false,
									custom_image : createDragText(line1, line2, 220),
								}								
								var effect = fb.DoDragDrop(window.ID, items, g_drop_effect.copy | g_drop_effect.move | g_drop_effect.link, options); 
								// nothing happens here until the mouse button is released	
								items = undefined;
								this.drag_tracks = false;
								this.drag_clicked = false;
								this.drag_clicked_x = -1;
								this.drag_clicked_y = -1;
								on_drag_leave();
								return;
							}						
						}
                    };
                };
                if(this.drag_moving && !timers.hidePlaylistManager && !timers.showPlaylistManager && properties.DropInplaylist) {
                    pman.on_mouse("move", x, y);
                };
                // scrollbar
                if(this.ishover_rating && !this.drag_tracks) {
                    if(!this.cursorHand) {
						window.SetCursor(IDC_HAND);
						this.cursorHand = true;
					}					
					var hover_rating_old = this.rows[this.activeRow].hover_rating;
					this.hoverRatingRow = this.activeRow;
					this.rows[this.activeRow].hover_rating =  Math.ceil((x - rating_x) / (this.rows[this.activeRow].rating_length / 5) + 0.1);
					if(this.rows[this.activeRow].hover_rating > 5) this.rows[this.activeRow].hover_rating = 5;
					else if(this.rows[this.activeRow].hover_rating < 0) this.rows[this.activeRow].hover_rating = 0;
					if(hover_rating_old != this.rows[this.activeRow].hover_rating) this.repaint();	
					
                } else if(!this.drag_tracks){
                    if(this.cursorHand) {
						window.SetCursor(IDC_ARROW);
						this.cursorHand = false;
						try{
							if(this.hoverRatingRow>-1){
								this.rows[this.hoverRatingRow].hover_rating = -1;
								this.hoverRatingRow = -1;					
								this.repaint();			
							}		
						} catch(e){}						
					}
                    if(cScrollBar.enabled && cScrollBar.visible) {
                        this.scrollbar && this.scrollbar.on_mouse(event, x, y);
                    };
                };
				ToolTip_mouse_x = x;
				ToolTip_mouse_y = y;				
				
				if(this.ishover && this.activeRow > -1 && Math.abs(scroll - scroll_) < 2 && (this.rows[this.activeRow].type==2 || this.rows[this.activeRow].type==1 || this.rows[this.activeRow].type==0) && properties.showToolTip && !this.drag_moving) {
					
					if (!timers.showToolTip && !this.ishover_rating && g_tooltip.activeZone!=this.activeRow) {
						if(g_tooltip.activeZone!='') g_tooltip.Deactivate();
						if(this.rows[this.activeRow].tooltip && !(this.scrollbar.cursorDrag || this.scrollbar.cursorHover)){
							if(this.rows[this.activeRow].type==2 || this.rows[this.activeRow].type==1){
								album_info=this.rows[this.activeRow].groupkeysplit;
								new_tooltip_text=album_info[0]+"\n"+album_info[1];									
							} else if(this.rows[this.activeRow].type==0){
								track_info=this.groups[this.rows[this.activeRow].albumId].tra[this.rows[this.activeRow].albumTrackId];
								if(properties.doubleRowText) new_tooltip_text=track_info[1]+"\n"+track_info[0];	
								else  new_tooltip_text=track_info[1]+" - "+track_info[0];	
							}
							g_tooltip.ActivateDelay(new_tooltip_text, x+10, y+20, globalProperties.tooltip_delay, 1200, false, this.activeRow);
						} else if((g_tooltip.activeZone!=this.activeRow) || this.ishover_rating || this.scrollbar.cursorDrag || this.scrollbar.cursorHover){
							g_tooltip.Deactivate();					
						}
					} else if((g_tooltip.activeZone!=this.activeRow) || this.ishover_rating || this.scrollbar.cursorDrag || this.scrollbar.cursorHover){
						g_tooltip.Deactivate();				
					}
				} else if((g_tooltip.activeZone!=this.activeRow && g_tooltip.activeZone!='') || this.ishover_rating || this.scrollbar.cursorDrag || this.scrollbar.cursorHover){
						g_tooltip.Deactivate();						
				}
                break;
            case "right":
                this.metadblist_selection = plman.GetPlaylistSelectedItems(g_active_playlist);
                if(this.ishover && this.activeRow > -1 && Math.abs(scroll - scroll_) < 2) {
                    var rowType = this.rows[this.activeRow].type;
                    switch(true) {
                        case (rowType > 0 && rowType < 99):     // ----------------> group header row
                            var playlistTrackId = this.rows[this.activeRow].playlistTrackId;
                            //if(!plman.IsPlaylistItemSelected(g_active_playlist, playlistTrackId)) {
                                plman.ClearPlaylistSelection(g_active_playlist);
                                this.selectGroupTracks(this.rows[this.activeRow].albumId);
                                plman.SetPlaylistFocusItem(g_active_playlist, playlistTrackId);
                                this.SHIFT_start_id = null;
                            //};
                            if(!utils.IsKeyPressed(VK_SHIFT)) {
                                this.context_menu(x, y, this.track_index, this.row_index);
                            };
                            break;
                        case (rowType == 0):                    // ----------------> track row
                            var playlistTrackId = this.rows[this.activeRow].playlistTrackId;
                            if(!plman.IsPlaylistItemSelected(g_active_playlist, playlistTrackId)) {
                                plman.ClearPlaylistSelection(g_active_playlist);
                                plman.SetPlaylistSelectionSingle(g_active_playlist, playlistTrackId, true);
                                plman.SetPlaylistFocusItem(g_active_playlist, playlistTrackId);
                            };
                            if(!utils.IsKeyPressed(VK_SHIFT)) {
                                this.context_menu(x, y, playlistTrackId, this.activeRow);
                            };
                            break;
                        case (rowType == 99):                   // ----------------> extra empty row
							this.context_menu(x, y,false,false);
                            break;
                    };
                    this.repaint();
                } else {
                    // scrollbar
                    if(cScrollBar.enabled && cScrollBar.visible) {
                        brw.scrollbar && brw.scrollbar.on_mouse(event, x, y);
                    };
                    // settings menu
                    if(!g_filterbox.inputbox.hover) {
                        this.context_menu(x, y,false,false);
                    };
                };
                break;
            case "wheel":
                //this.scrollbar.updateScrollbar(); // update scrollbar done in g_time at each scroll update
				g_tooltip.Deactivate();
                break;
            case "leave":
                // scrollbar
                if(cScrollBar.enabled && cScrollBar.visible) {
                    this.scrollbar && this.scrollbar.on_mouse(event, 0, 0);
                };
				if(properties.showToolTip) g_tooltip.Deactivate();
                break;
            case "drag_over":
                g_dragndrop_bottom = false;
                if(this.groups.length > 0) {
                    var fin = this.rows.length;
                    for(var i = 0; i < fin; i++) {
                        this.dragndrop_check(x, y, i);
                    };
                    var rowId = fin - 1;
                    var item_height_row = (this.rows[rowId].type == 0 ? 1 : properties.groupHeaderRowsNumber);
                    var limit = this.rows[rowId].y + (item_height_row * properties.rowHeight);
					if(y<this.y+this.PaddingTop) {
						rowId=0
                        g_dragndrop_trackId = this.rows[rowId].playlistTrackId;
                        g_dragndrop_rowId = rowId;						
					}					
                    else if(y > limit || g_dragndrop_trackId==-1) {
                        g_dragndrop_bottom = true;
                        g_dragndrop_trackId = this.rows[rowId].playlistTrackId;
                        g_dragndrop_rowId = rowId;
                    }  
                } else {
                    g_dragndrop_bottom = true;
                    g_dragndrop_trackId = 0;
                    g_dragndrop_rowId = 0;
                };
                break;
        };
    };
        
	this.resetTimer = function(){
		if(this.g_time) {
			window.ClearInterval(this.g_time);
			this.g_time = false;
		};
	}
	this.startTimer = function(){
		this.resetTimer();
		try{
			this.timerStartTime = Date.now();
		}catch(e){}
		brw.timerCounter = 0;
		this.g_time = setInterval(function() {
			brw.timerCounter++;
			//Restart if the animation is desyncronised
			try{				
				if(Math.abs(brw.timerStartTime+brw.timerCounter*properties.refreshRate-Date.now())>500){
					brw.startTimer();
				}	
			}catch(e){}							
			brw.timerScript();
		}, properties.refreshRate);	
	}
    this.timerScript = function() {
        if(!g_first_populate_done) {
            brw.populate(true,2);
			if(properties.DropInplaylist) pman.populate(exclude_active = false, reset_scroll = true);
        }		
        if(!window.IsVisible) {
            window_visible = false;
            return;
        };
				
        var repaint_1 = false;

        if(!window_visible){
            window_visible = true;
        };
        
        if(cNowPlaying.flashEnable) {
            cNowPlaying.flashescounter++;
            if(cNowPlaying.flashescounter%5 == 0 && cNowPlaying.flashescounter <= cNowPlaying.flashescountermax && cNowPlaying.flashescounter>0) {
                cNowPlaying.flash = !cNowPlaying.flash;
            }
            if(cNowPlaying.flashescounter > cNowPlaying.flashescountermax) {
                cNowPlaying.flashEnable = false;
            }
            repaint_1 = true;
        }			
		
        if(update_size) {
			on_size();
			repaint_1 = true;
		}
		
		if(brw.showNowPlaying_trigger && g_first_populate_done) {
			brw.dontFlashNowPlaying = true;			
			brw.showNowPlaying();
			brw.showNowPlaying_trigger = false;
		}		
        // get hover row index (mouse cursor hover)
        if(g_cursor.y > brw.y && g_cursor.y < brw.y + brw.h) {
            brw.activeRow = Math.ceil((g_cursor.y + scroll_ - brw.y ) / properties.rowHeight - 1);
            if(brw.activeRow >= brw.rows.length) brw.activeRow = -1;
        } else {
            brw.activeRow = -1;
        };

        if(repaint_main1 == repaint_main2){
            repaint_main2 = !repaint_main1;
            repaint_1 = true;
        };

		if(cScrollBar.visible) {
			scroll = check_scroll(scroll);
			if(Math.abs(scroll - scroll_) >= 2){
				scroll_ += (scroll - scroll_) / properties.scrollSmoothness;
				repaint_1 = true;
				isScrolling = true;
				//
				if(scroll_prev != scroll) brw.scrollbar.updateScrollbar();
			} else {
				if(isScrolling) {
					if(scroll_< 1) scroll_ = 0;
					isScrolling = false;
					repaint_1 = true;
				};
			};
		} else scroll = scroll_ = 0;
		if(brw.group_unrequested_loading) {
			brw.group_unrequested_loading=false;
			repaint_1 = true;
		}	
		
		if(repaint_cover1 == repaint_cover2){
			repaint_cover2 = !repaint_cover1;
			repaint_1 = true;
		};
		
		if(repaint_1){
			if(isScrolling && brw.rows.length > 0) brw.gettags(false);
			repaintforced = true;
			repaint_main = true;
			images.loading_angle = (images.loading_angle+30) % 360;
			window.Repaint();
		};        	

		scroll_prev = scroll;
        
    }
	this.setGroupHeaderRowsNumber = function(step){
        var zoomStep = 1;
        var previous = properties.groupHeaderRowsNumber;
        if(!timers.mouseWheel) {			
            if(step > 0) {
                properties.groupHeaderRowsNumber += zoomStep;
                if(properties.groupHeaderRowsNumber > 5) properties.groupHeaderRowsNumber = 5;
            } else {
                properties.groupHeaderRowsNumber -= zoomStep;
                if(properties.groupHeaderRowsNumber < 2) properties.groupHeaderRowsNumber = 2;
            };
            if(previous != properties.groupHeaderRowsNumber) {
                timers.mouseWheel = setTimeout(function() {
					
					if(properties.doubleRowText) {
						properties.groupHeaderRowsNumberDouble = properties.groupHeaderRowsNumber;
						window.SetProperty("_PROPERTY: Number of Rows for Group Header, when double line is enabled", properties.groupHeaderRowsNumberDouble)
					} else {
						properties.groupHeaderRowsNumberSimple = properties.groupHeaderRowsNumber;		
					}
					
                    window.SetProperty("_PROPERTY: Number of Rows for Group Header", properties.groupHeaderRowsNumber);
                    get_font();
					g_var_cache.resetAll();
                    get_metrics();
                    get_images();
                    
                    // refresh covers
                    brw.refreshThumbnails();
                    
                    brw.repaint();
                    timers.mouseWheel && clearTimeout(timers.mouseWheel);
                    timers.mouseWheel = false;
                }, 100);
            };
        };		
	}
	this.setRowHeight = function(step){
        var zoomStep = 1;
        var previous = properties.defaultRowHeight;
		step = step*-1;
        if(!timers.mouseWheel) {			
            if(step <= 0) {
                properties.defaultRowHeight += zoomStep;
                if(properties.defaultRowHeight > 70) properties.defaultRowHeight = 70;
            } else {
                properties.defaultRowHeight -= zoomStep;
                if(properties.defaultRowHeight < 10) properties.defaultRowHeight = 10;
            };
            if(previous != properties.defaultRowHeight) {
                timers.mouseWheel = setTimeout(function() {
					
					window.SetProperty("_PROPERTY: Row Height", properties.defaultRowHeight)
                    get_font();
					g_var_cache.resetAll();
                    get_metrics();
                    get_images();
                    
                    // refresh covers
                    brw.refreshThumbnails();
                    brw.repaint();
                    timers.mouseWheel && clearTimeout(timers.mouseWheel);
                    timers.mouseWheel = false;
                }, 100);
            };
        };		
	}
	this.refreshThumbnails = function(){
		var total = this.groups.length;
		for(var i = 0; i < total; i++) {
			this.groups[i].tid = -1;
			this.groups[i].load_requested = 0;
			this.groups[i].cover_formated = false;
			this.groups[i].mask_applied = false;						
			this.groups[i].save_requested = false;
			this.groups[i].cover_img = null;
			this.groups[i].cover_type = null;
		};		
	}
	this.context_menu = function(x, y, id, row_id, context_items) {
		this.metadblist_selection = plman.GetPlaylistSelectedItems(g_active_playlist);		
		var context_items = typeof context_items !== 'undefined' ? context_items : this.metadblist_selection;			
		var _menu = window.CreatePopupMenu();
		var Context = fb.CreateContextMenuManager();
		var _child01 = window.CreatePopupMenu();
		var _child02 = window.CreatePopupMenu();
		
		if(properties.showSettingsMenu) {
			_menu.AppendMenuItem(MF_STRING, 1, "Settings...");
		}		
		_menu.AppendMenuSeparator();
		
		if(!plman.IsAutoPlaylist(plman.ActivePlaylist)){
			var SortMenu = window.CreatePopupMenu(); //Custom Entries
			SortMenu.AppendTo(_menu, MF_STRING, "Sort By");

			SortMenu.AppendMenuItem(MF_STRING, 1036, "Artist / Album / Tracknumber");  
			SortMenu.AppendMenuItem(MF_STRING, 1037, "Title");
			SortMenu.AppendMenuItem(MF_STRING, 1038, "Tracknumber");	
			SortMenu.AppendMenuSeparator();	
			SortMenu.AppendMenuItem(MF_STRING, 1039, "Randomize");		
		}
		
		var quickSearchMenu = window.CreatePopupMenu();	
		quickSearchMenu.AppendMenuItem(MF_STRING, 1029,"Same title");			
		quickSearchMenu.AppendMenuItem(MF_STRING, 1030,"Same artist");
		quickSearchMenu.AppendMenuItem(MF_STRING, 1031,"Same album");	
		quickSearchMenu.AppendMenuItem(MF_STRING, 1032,"Same genre");		
		quickSearchMenu.AppendMenuItem(MF_STRING, 1033,"Same date");		
		quickSearchMenu.AppendTo(_menu, MF_STRING, "Quick search for...");	

		_menu.AppendMenuSeparator();
		_menu.AppendMenuItem(MF_STRING, 1034, "Select all");
		if(this.metadblist_selection.Count > 0) _menu.AppendMenuItem(plman.IsAutoPlaylist(g_active_playlist)?MF_DISABLED|MF_GRAYED:MF_STRING, 1020, "Remove selected");
		
		//_menu.AppendMenuSeparator();	
		

	
		if(brw.activeRow > -1 && !properties.showGroupHeaders && properties.doubleRowShowCover && properties.doubleRowText) {
			_menu.AppendMenuSeparator();	
			//if(this.metadblist_selection.Count == 1) {
				_menu.AppendMenuItem(MF_STRING, 1010, "Refresh this image");
			//};
		} else if(brw.activeRow > -1 && this.rows[this.activeRow].type > 0 && this.rows[this.activeRow].type < 99){
			_menu.AppendMenuSeparator();	
			//if(this.metadblist_selection.Count == 1) {
			_menu.AppendMenuItem(MF_STRING, 1010, "Refresh this image");
			//};			
		}	

		if(id!==false){        
			_menu.AppendMenuSeparator();	

			_child01.AppendTo(_menu, MF_STRING, "Send to...");
			//_child01.AppendMenuItem((showInAlbumView ? MF_STRING : MF_GRAYED | MF_DISABLED), 1011, "Highlight in JS Smooth Browser");
			_child01.AppendMenuItem(MF_STRING, 2000, "A new playlist...");
			var pl_count = plman.PlaylistCount;
			if(pl_count > 1) {
				_child01.AppendMenuItem(MF_SEPARATOR, 0, "");
			};
			for(var i=0; i < pl_count; i++) {
				if(i != this.playlist && !plman.IsAutoPlaylist(i)) {
					_child01.AppendMenuItem(MF_STRING, 2001 + i, plman.GetPlaylistName(i));
				};
			};				
			
			if(brw.activeRow > -1) {
				var albumIndex = this.rows[this.activeRow].albumId;
				var crc = brw.groups[albumIndex].cachekey;
			};

			Context.InitContext(context_items);

			// check if selection is single and is in the Media Library to provide if ok a link to Album View panel
			var showInAlbumView = false;
			/*if(this.metadblist_selection.Count == 1) {
				if(fb.IsMetadbInMediaLibrary(this.metadblist_selection[0])) {
					showInAlbumView = true;
				};
			};*/

			Context.BuildMenu(_menu, 2, -1);			
		}

		var ret = _menu.TrackPopupMenu(x, y);
		if(ret > 1 && ret < 800) {
			Context.ExecuteByID(ret - 2);
		} else if(ret<2) {
			switch (ret) {
			case 1:
				//window.ShowProperties();
                this.settings_context_menu(x, y);
				break;
			};
		} else {
			switch (ret) {
			case 1010:
                if(g_files.FileExists(cover_img_cache + "\\" + crc)) {
                    try {
                        g_files.DeleteFile(cover_img_cache + "\\" + crc);
                    } catch(e) {
                        console.log("WSH Panel Error: Image cache ["+crc+"] can't be deleted on disk, file in use, try later or reload panel.");
                    };
                };
                this.groups[albumIndex].tid = -1;
                this.groups[albumIndex].load_requested = 0;
                this.groups[albumIndex].cover_formated = false;
				this.groups[albumIndex].mask_applied = false;
                this.groups[albumIndex].save_requested = false;
                g_image_cache.reset(crc);
                this.groups[albumIndex].cover_img = null;
                this.groups[albumIndex].cover_type = null;
                this.repaint();
				window.NotifyOthers("RefreshImageCover",this.groups[albumIndex].metadb)
				break;
            case 1011:
                window.NotifyOthers("JSSmoothPlaylist->JSSmoothBrowser:show_item", this.metadblist_selection[0]);
                break;
			case 1020:
				//if(this.metadblist_selection.Count == 1)
					//removeItems(this.metadblist_selection,g_active_playlist,false);
				//else
					removeItems(this.metadblist_selection,g_active_playlist);
				//plman.RemovePlaylistSelection(g_active_playlist, false);
				break;
            case 1029:
				quickSearch(this.metadblist_selection[0],"title");
                break;					
            case 1030:
				quickSearch(this.metadblist_selection[0],"artist");
                break;	
            case 1031:
				quickSearch(this.metadblist_selection[0],"album");		
                break;			
            case 1032:
				quickSearch(this.metadblist_selection[0],"genre");		
                break;		
            case 1033:
				quickSearch(this.metadblist_selection[0],"date");		
                break;	
			case 1034:
				selected_array=Array();
				for(var i = 0; i <= plman.PlaylistItemCount(g_active_playlist);i++) {
					selected_array.push(i);
				};		
				plman.SetPlaylistSelection(g_active_playlist,selected_array,true)
				break;				
			case 1035:
				removeItems(false,g_active_playlist);			
				break;	
			case 1036:
				plman.SortByFormat(g_active_playlist,sort_by_album_artist); 
				break;	
			case 1037:
				plman.SortByFormat(g_active_playlist,sort_by_title);
				break;		
			case 1038:
				plman.SortByFormat(g_active_playlist,sort_by_tracknumber); 
				break;	
			case 1039:				
				plman.SortByFormat(g_active_playlist,""); 
				break;					
			case 2000:
				fb.RunMainMenuCommand("File/New playlist");
				plman.InsertPlaylistItems(plman.PlaylistCount-1, 0, this.metadblist_selection, false);
				break;
			default:
				var insert_index = plman.PlaylistItemCount(ret-2001);
				plman.InsertPlaylistItems((ret-2001), insert_index, this.metadblist_selection, false);
			};
		};
		_child01 = undefined;
		_child02 = undefined;
		_menu = undefined;
		if (typeof SortMenu != "undefined") SortMenu = undefined;
		if (typeof quickSearchMenu != "undefined") quickSearchMenu = undefined;
        g_rbtn_click = false;
		return true;
	};
    
    this.settings_context_menu = function(x, y) {
            var _menu = window.CreatePopupMenu();
            var _menu1 = window.CreatePopupMenu();
            var _menu2 = window.CreatePopupMenu();
            var _menu3 = window.CreatePopupMenu();
			var _menu2A = window.CreatePopupMenu();
			var _menuRating = window.CreatePopupMenu();	
			var _rowHeight = window.CreatePopupMenu();				
			var _rowStyle = window.CreatePopupMenu();	
			
            var idx;

			var lockOnMenu = window.CreatePopupMenu();
			lockOnMenu.AppendTo(_menu, MF_STRING, "Displayed Playlist");
			lockOnMenu.AppendMenuItem(MF_STRING, 3300, "Playing Playlist");		
			lockOnMenu.AppendMenuItem(MF_STRING, 3299, "Active Playlist");		
				
			var pl_count = plman.PlaylistCount;
			if(pl_count > 1) {
				lockOnMenu.AppendMenuItem(MF_SEPARATOR, 0, "");
			};
			for(var i=0; i < pl_count; i++) {
				if(i != this.playlist) {
					playlist_name = plman.GetPlaylistName(i);
					lockOnMenu.AppendMenuItem(MF_STRING, 3301 + i, plman.GetPlaylistName(i));
				};
			};	
			if(properties.lockOnPlaylistNamed!="") playlist_idx = check_playlist(properties.lockOnPlaylistNamed);
			else playlist_idx = -1;
			if(playlist_idx>-1) {
				lockOnMenu.CheckMenuItem(3301 + playlist_idx, true);
			} else {
				lockOnMenu.CheckMenuItem(3299, !properties.lockOnNowPlaying);
				lockOnMenu.CheckMenuItem(3300, properties.lockOnNowPlaying);
			}
			lockOnMenu.AppendMenuSeparator();
			lockOnMenu.AppendMenuItem(MF_STRING, 3298, "Switch to Playing or Active depending on the filters state");	
			lockOnMenu.CheckMenuItem(3298, properties.enableAutoSwitchPlaylistMode);				
			
            _menu.AppendMenuItem((fb.IsPlaying ? MF_STRING : MF_GRAYED | MF_DISABLED), 900, "Show Now Playing");
            _menu.AppendMenuItem(MF_STRING, 901, "Enable Drag'n'Drop to a playlist");		
			_menu.CheckMenuItem(901, properties.DropInplaylist);
			
			/*_menu.AppendMenuSeparator();	
            _menu.AppendMenuItem(MF_STRING, 902, "Enable Disk Image Cache");
            _menu.CheckMenuItem(902, globalProperties.enableDiskCache);					
            _menu.AppendMenuItem((globalProperties.enableDiskCache)?MF_STRING:MF_GRAYED, 903, "Load all covers at startup");
            _menu.CheckMenuItem(903, globalProperties.load_covers_at_startup);	*/		

			
            _menu.AppendMenuSeparator();			
            _menu.AppendMenuItem(MF_STRING, 117, "Circle Artwork");
            _menu.CheckMenuItem(117, properties.circleMode);
			_rowHeight.AppendMenuItem(MF_STRING, 1001, "Increase");
			_rowHeight.AppendMenuItem(MF_STRING, 1000, "Decrease");	
			_rowHeight.AppendMenuSeparator();
			_rowHeight.AppendMenuItem(MF_DISABLED, 0, "Tip: Hold SHIFT and use your");
			_rowHeight.AppendMenuItem(MF_DISABLED, 0, "mouse wheel over the panel!");			
			_rowHeight.AppendTo(_menu,MF_STRING, "Row height");				
			
			_rowStyle.AppendMenuItem(MF_STRING, 911, "Single Line");				
			_rowStyle.AppendMenuItem(MF_STRING, 912, "Double Line");			
			_rowStyle.AppendMenuItem(properties.showGroupHeaders?MF_GRAYED:MF_STRING, 913, "Double Line with covers");
			_rowStyle.CheckMenuRadioItem(911, 913, (!properties.doubleRowText) ? 911 : (!properties.doubleRowShowCover || properties.showGroupHeaders) ? 912 : 913);	
			_rowStyle.AppendTo(_menu,MF_STRING, "Row style");		
			
            _menu3.AppendMenuItem(MF_STRING, 300, "Enable");
            _menu3.CheckMenuItem(300, properties.showGroupHeaders);
            _menu3.AppendMenuItem((properties.showGroupHeaders ? MF_STRING : MF_GRAYED | MF_DISABLED), 310, "Autocollapse");
            _menu3.CheckMenuItem(310, properties.autocollapse);
            _menu3.AppendMenuSeparator();
            _menu3.AppendMenuItem((properties.showGroupHeaders && !properties.autocollapse ? MF_STRING : MF_GRAYED | MF_DISABLED), 320, "Collapse All");
            _menu3.AppendMenuItem((properties.showGroupHeaders && !properties.autocollapse ? MF_STRING : MF_GRAYED | MF_DISABLED), 330, "Expand All");

            _menu3.AppendTo(_menu,MF_STRING, "Group Headers");	
			
            _menu.AppendMenuItem(MF_STRING, 910, "Search bar");
            _menu.CheckMenuItem(910, properties.showHeaderBar);				
			
            _menu.AppendMenuSeparator();
			
            _menu.AppendMenuItem(MF_STRING, 905, "Show a tooltip for long track titles");		
			_menu.CheckMenuItem(905, properties.showToolTip);
            _menu.AppendMenuItem((!properties.doubleRowText ? (!properties.showGroupHeaders ? MF_GRAYED | MF_DISABLED : MF_STRING) : MF_GRAYED | MF_DISABLED), 111, "Append Artist to title");
            _menu.CheckMenuItem(111, properties.showArtistAlways);	
			
			_menu1.AppendMenuItem(MF_STRING, 914, "No progress bar");
			_menu1.AppendMenuItem(MF_STRING, 916, "White Progress bar");			
			_menu1.AppendMenuItem(MF_STRING, 915, "Progress bar according to the album art");
			_menu1.CheckMenuRadioItem(914, 916, (!properties.drawProgressBar) ? 914 : (properties.AlbumArtProgressbar) ? 915 : 916);	
            _menu1.AppendTo(_menu,MF_STRING, "Progress bar under playing title");
						
            //_menu.AppendMenuItem(MF_STRING, 112, "Show Mood Icon");
            //_menu.CheckMenuItem(112, properties.showMood);
			
			_menuRating.AppendMenuItem(MF_STRING, 113, "Show rating for each track");	
			_menuRating.AppendMenuItem(MF_STRING, 114, "Show rating for selected track");
			_menuRating.AppendMenuItem(MF_STRING, 115, "Show rating for selected and rated tracks");					
			_menuRating.AppendMenuItem(MF_STRING, 116, "Don't show rating");	
			_menuRating.CheckMenuRadioItem(113, 116, (properties.showRating && !properties.showRatingSelected) ? 113 : (properties.showRating && properties.showRatingSelected && !properties.showRatingRated) ? 114 : (properties.showRating && properties.showRatingRated) ? 115 : 116);	
			_menuRating.AppendTo(_menu,MF_STRING, "Rating display");		
			
            _menu2.AppendMenuItem(MF_STRING, 200, "Enable");
            _menu2.CheckMenuItem(200, properties.showwallpaper);
            _menu2.AppendMenuItem(MF_STRING, 220, "Blur");
            _menu2.CheckMenuItem(220, properties.wallpaperblurred);
			
            _menu2A.AppendMenuItem(MF_STRING, 221, "Filling");
            _menu2A.CheckMenuItem(221, properties.wallpaperdisplay==0);	
            _menu2A.AppendMenuItem(MF_STRING, 222, "Adjust");
            _menu2A.CheckMenuItem(222, properties.wallpaperdisplay==1);
            _menu2A.AppendMenuItem(MF_STRING, 223, "Stretch");
            _menu2A.CheckMenuItem(223, properties.wallpaperdisplay==2);
			_menu2A.AppendTo(_menu2,MF_STRING, "Wallpaper size");
			
            //_menu2.AppendMenuSeparator();
            //_menu2.AppendMenuItem((!properties.showwallpaper ? MF_GRAYED | MF_DISABLED : MF_STRING), 210, "Default");
            //_menu2.AppendMenuItem((!properties.showwallpaper ? MF_GRAYED | MF_DISABLED : MF_STRING), 211, "Playing Album Cover");
            //_menu2.CheckMenuRadioItem(210, 211, properties.wallpapermode == 0 ? 211 : 210);

            _menu2.AppendTo(_menu, MF_STRING, "Background Wallpaper");

			if(layout_state.isEqual(0) && main_panel_state.isEqual(1)){
				_menu.AppendMenuSeparator();
				_menu.AppendMenuItem(MF_STRING, 993, "Hide this playlist");
			}
            //_menu.AppendMenuSeparator();
            //_menu.AppendMenuItem(MF_STRING, 991, "Panel Properties");
            //_menu.AppendMenuItem(MF_STRING, 992, "Configure...");
            
            idx = _menu.TrackPopupMenu(x,y);
            
            switch(true) {
                case (idx == 111):
                    properties.showArtistAlways = !properties.showArtistAlways;
                    window.SetProperty("_DISPLAY: Show Artist in Track Row", properties.showArtistAlways);
                    get_metrics();
                    brw.repaint();
                    break;
                case (idx == 112):
                    properties.showMood = !properties.showMood;
                    window.SetProperty("_DISPLAY: Show Mood in Track Row", properties.showMood);
                    get_metrics();
                    brw.repaint();
                    break;
                case (idx == 113):
                    properties.showRating = true;
                    properties.showRatingSelected = false;		
                    properties.showRatingRated = false;						
                    window.SetProperty("_DISPLAY: Show Rating in Track Row", properties.showRating);
                    window.SetProperty("_DISPLAY: Show Rating in Selected Track Row", properties.showRatingSelected);
                    window.SetProperty("_DISPLAY: Show Rating in Rated Track Row", properties.showRatingRated);						
                    get_metrics();
                    brw.repaint();
                    break;
                case (idx == 114):
                    properties.showRating = true;
                    properties.showRatingSelected = true;				
                    properties.showRatingRated = false;						
                    window.SetProperty("_DISPLAY: Show Rating in Track Row", properties.showRating);
                    window.SetProperty("_DISPLAY: Show Rating in Selected Track Row", properties.showRatingSelected);					
                    window.SetProperty("_DISPLAY: Show Rating in Rated Track Row", properties.showRatingRated);						
                    get_metrics();
                    brw.repaint();
                    break;
                case (idx == 115):
                    properties.showRating = true;
                    properties.showRatingSelected = true;				
                    properties.showRatingRated = true;						
                    window.SetProperty("_DISPLAY: Show Rating in Track Row", properties.showRating);
                    window.SetProperty("_DISPLAY: Show Rating in Selected Track Row", properties.showRatingSelected);					
                    window.SetProperty("_DISPLAY: Show Rating in Rated Track Row", properties.showRatingRated);						
                    get_metrics();
                    brw.repaint();
                    break;					
                case (idx == 116):
                    properties.showRating = false;
                    properties.showRatingSelected = false;	
                    properties.showRatingRated = false;						
                    window.SetProperty("_DISPLAY: Show Rating in Track Row", properties.showRating);
                    window.SetProperty("_DISPLAY: Show Rating in Selected Track Row", properties.showRatingSelected);	
                    window.SetProperty("_DISPLAY: Show Rating in Rated Track Row", properties.showRatingRated);						
                    get_metrics();
                    brw.repaint();
                    break;	
				case (idx == 117):		
					properties.circleMode = !properties.circleMode;
					window.SetProperty("COVER Circle artwork", properties.circleMode);
					brw.refreshThumbnails();
					brw.repaint();
					break;						
                case (idx == 200):
                    toggleWallpaper();
                    break;
                case (idx == 210):
                    properties.wallpapermode = 99;on_colours_changed();		
                    window.SetProperty("_SYSTEM: Wallpaper Mode", properties.wallpapermode);
                    if(fb.IsPlaying) g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
                    brw.repaint();
                    break;
                case (idx == 211):
                    properties.wallpapermode = 0;on_colours_changed();		
                    window.SetProperty("_SYSTEM: Wallpaper Mode", properties.wallpapermode);
                    if(fb.IsPlaying) g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
                    brw.repaint();
                    break;
                case (idx == 220):
                    properties.wallpaperblurred = !properties.wallpaperblurred;on_colours_changed();		
                    window.SetProperty("_DISPLAY: Wallpaper Blurred", properties.wallpaperblurred);
                    g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
                    brw.repaint();
                    break;
                case (idx == 221):
                    properties.wallpaperdisplay = 0;
                    window.SetProperty("_DISPLAY: Wallpaper 0=Filling 1=Adjust 2=Stretch", properties.wallpaperdisplay);
                    g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
                    brw.repaint();
                    break;	
                case (idx == 222):
                    properties.wallpaperdisplay = 1;
                    window.SetProperty("_DISPLAY: Wallpaper 0=Filling 1=Adjust 2=Stretch", properties.wallpaperdisplay);
                    g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
                    brw.repaint();
                    break;		
                case (idx == 223):
                    properties.wallpaperdisplay = 2;
                    window.SetProperty("_DISPLAY: Wallpaper 0=Filling 1=Adjust 2=Stretch", properties.wallpaperdisplay);
                    g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
                    brw.repaint();
                    break;						
                case (idx == 300):
                    properties.showGroupHeaders = !properties.showGroupHeaders;
                    window.SetProperty("_DISPLAY: Show Group Headers", properties.showGroupHeaders);
					get_metrics();
					on_colours_changed();
                    if(properties.autocollapse) {
						properties.autocollapse = false;
						window.SetProperty("_PROPERTY: Autocollapse groups", properties.autocollapse);
					}						
                    if(!properties.showGroupHeaders) brw.collapseAll(false);
					brw.populate(is_first_populate = false,3);
                    brw.repaint();
                    break;
                case (idx == 310):
                    properties.autocollapse = !properties.autocollapse;
                    window.SetProperty("_PROPERTY: Autocollapse groups", properties.autocollapse);
                    brw.populate(false,4);
                    brw.showFocusedItem();
                    break;
                case (idx == 320):
                    brw.collapseAll(true);
                    brw.showFocusedItem();
                    break;
                case (idx == 330):
                    brw.collapseAll(false);
                    brw.showFocusedItem();
                    break;
                case (idx == 900):
                    brw.showNowPlaying();
                    break;
                case (idx == 901):
                    properties.DropInplaylist = !properties.DropInplaylist
                    window.SetProperty("_SYSTEM: Allow to drag items into a playlist", properties.DropInplaylist);
					pman.populate(exclude_active = false, reset_scroll = true);
                    get_metrics();
                    brw.repaint();					
                    break;		
                case (idx == 902):
					enableDiskCacheGlobaly()				
					brw.repaint();				
                    break;
                case (idx == 903):
					enableCoversAtStartupGlobaly()
					break;		
                case (idx == 905):
                    properties.showToolTip = !properties.showToolTip;
                    window.SetProperty("_DISPLAY: display a tooltip", properties.showToolTip);
                    brw.repaint();
                    break;									
                case (idx == 910):
                    properties.showHeaderBar = !properties.showHeaderBar;
                    window.SetProperty("_DISPLAY: Show Top Bar", properties.showHeaderBar);
                    get_metrics();
                    brw.repaint();
                    break;
                case (idx == 911):
					if(properties.doubleRowText) {
						properties.doubleRowText = false;
						window.SetProperty("_PROPERTY: Double Row Text Info", properties.doubleRowText);
						get_metrics();
						get_images();
						brw.ratingImages = false;
						brw.repaint();
					}
                    break;					
                case (idx == 912):
					if(!properties.doubleRowText || (properties.doubleRowText && properties.doubleRowShowCover)) {
						properties.doubleRowText = true;
						window.SetProperty("_PROPERTY: Double Row Text Info", properties.doubleRowText);
						properties.doubleRowShowCover = false;
						window.SetProperty("_PROPERTY: Double Row Show Cover", properties.doubleRowShowCover);						
						get_metrics();
						get_images();
						brw.ratingImages = false;
						brw.repaint();
					}
                    break;
                case (idx == 913):
					if(!properties.doubleRowText || !properties.doubleRowShowCover) {
						properties.doubleRowText = true;
						window.SetProperty("_PROPERTY: Double Row Text Info", properties.doubleRowText);				
						properties.doubleRowShowCover = true;
						window.SetProperty("_PROPERTY: Double Row Show Cover", properties.doubleRowShowCover);
						on_colours_changed();
						get_metrics();
						get_images();
						brw.ratingImages = false;
						brw.repaint();						
					}
                    break;	
				case (idx == 914):
					properties.drawProgressBar = false;
					properties.AlbumArtProgressbar = false;
					window.SetProperty("_DISPLAY Draw a progress bar under song title", properties.drawProgressBar);						
					window.SetProperty("_DISPLAY Album art progress bar", properties.AlbumArtProgressbar);	
					get_images();					
					brw.repaint();
					break;			
				case (idx == 915):
					properties.AlbumArtProgressbar = true;		
					properties.drawProgressBar = true;								
					window.SetProperty("_DISPLAY Draw a progress bar under song title", properties.drawProgressBar);						
					window.SetProperty("_DISPLAY Album art progress bar", properties.AlbumArtProgressbar);	
					get_images();					
					brw.repaint();
					break;				
				case (idx == 916):
					properties.AlbumArtProgressbar = false;		
					properties.drawProgressBar = true;				
					window.SetProperty("_DISPLAY Draw a progress bar under song title", properties.drawProgressBar);						
					window.SetProperty("_DISPLAY Album art progress bar", properties.AlbumArtProgressbar);	
					get_images();
					brw.repaint();
					break;						
                case (idx == 991):
                    window.ShowProperties();
                    break;
                case (idx == 992):
                    window.ShowConfigure();
                    break;
                case (idx == 993):
                    set_nowplaying_state(0);
                    break;			
                case (idx == 1000):
                    this.setRowHeight(-2);
                    break;	
                case (idx == 1001):
                    this.setRowHeight(2);
                    break;						
				case (idx == 3298):	
					properties.enableAutoSwitchPlaylistMode=!properties.enableAutoSwitchPlaylistMode;
					window.SetProperty("Automatically change displayed playlist", properties.enableAutoSwitchPlaylistMode);	
					if(filters_panel_state.isMaximumValue()) properties.lockOnNowPlaying=false;
					else properties.lockOnNowPlaying=true;
					window.SetProperty("lock on now playing playlist", properties.lockOnNowPlaying);	
					properties.lockOnPlaylistNamed="";
					window.SetProperty("lock on specific playlist name", "");				
					brw.populate(true,4);	
					break;		
				case (idx == 3299):	
					properties.lockOnNowPlaying=false;
					window.SetProperty("lock on now playing playlist", properties.lockOnNowPlaying);	
					properties.lockOnPlaylistNamed="";
					window.SetProperty("lock on specific playlist name", "");
					brw.populate(true,4);
					break;
				case (idx == 3300):	
					properties.lockOnNowPlaying=true;
					window.SetProperty("lock on now playing playlist", properties.lockOnNowPlaying);	
					properties.lockOnPlaylistNamed="";
					window.SetProperty("lock on specific playlist name", "");
					brw.populate(true,4);
					break;		
				case (idx > 3300):	
					properties.lockOnPlaylistNamed=plman.GetPlaylistName(idx-3301);
					properties.lockOnNowPlaying=false;
					window.SetProperty("lock on now playing playlist", properties.lockOnNowPlaying);			
					window.SetProperty("lock on specific playlist name", properties.lockOnPlaylistNamed);	
					brw.populate(true,4);
					break;						
            };
            _menu2 = undefined;
			_menu2A = undefined;
            _menu1 = undefined;
            _menu = undefined;
			_menuRating = undefined;
			_rowHeight = undefined;
			_rowStyle = undefined;
            g_rbtn_click = false;
            return true;
    };

    this.incrementalSearch = function() {
        var count = 0;
        var albumartist, artist, groupkey;
        var chr;
        var gstart;
        var pid = -1;
        
        // exit if no search string in cache
        if(cList.search_string.length <= 0) return true;
        
        // 1st char of the search string
        var first_chr = cList.search_string.substring(0,1);  
        var len = cList.search_string.length;
        
        // which start point for the search
        if(this.list.count > 1000) {
            albumartist = properties.tf_albumartist.EvalWithMetadb(this.list.Item(Math.floor(this.list.Count / 2)));
            chr = albumartist.substring(0,1);
            if(first_chr.charCodeAt(first_chr) > chr.charCodeAt(chr)) {
                gstart = Math.floor(this.list.Count / 2);
            } else {
                gstart = 0;
            };
        } else {
            gstart = 0;
        };

        if(!properties.showGroupHeaders) {

            // 1st search on "album artist" TAG
            var format_str = "";
			var tot = this.list.Count;
            for(var i = gstart; i < tot; i++) {
                albumartist = properties.tf_albumartist.EvalWithMetadb(this.list[i]);
                format_str = albumartist.substring(0,len).toUpperCase();
                if(format_str == cList.search_string) {
                    pid = i;
                    break;
                };
            };
            
            // if not found, search in the first part (from 0 to gstart)
            if(pid < 0) {
                var format_str = "";
                for(var i = 0; i < gstart; i++) {
                    albumartist = properties.tf_albumartist.EvalWithMetadb(this.list[i]);
                    format_str = albumartist.substring(0,len).toUpperCase();
                    if(format_str == cList.search_string) {
                        pid = i;
                        break;
                    };
                };
            };
            
            if(pid < 0) {
                // 2nd search on "artist" TAG
                var format_str = "";
				var tot = this.list.Count;
                for(var i = 0; i < tot; i++) {
                    artist = properties.tf_artist.EvalWithMetadb(this.list[i]);
                    format_str = artist.substring(0,len).toUpperCase();
                    if(format_str == cList.search_string) {
                        pid = i;
                        break;
                    };
                };
            };

        } else {

            // 1st search on tf_group_key of current group by pattern
            var format_str = "";
			var tot = this.list.Count;			
            for(var i = gstart; i < tot; i++) {
                groupkey = properties.tf_groupkey.EvalWithMetadb(this.list[i]);
                format_str = groupkey.substring(0,len).toUpperCase();
                if(format_str == cList.search_string) {
                    pid = i;
                    break;
                };
            };
            
            // if not found, search in the first part (from 0 to gstart)
            if(pid < 0) {
                var format_str = "";
                for(var i = 0; i < gstart; i++) {
                    groupkey = properties.tf_groupkey.EvalWithMetadb(this.list[i]);
                    format_str = groupkey.substring(0,len).toUpperCase();
                    if(format_str == cList.search_string) {
                        pid = i;
                        break;
                    };
                };
            };

        };
        
        if(pid >= 0) { // found
            g_focus_id = pid;
            plman.ClearPlaylistSelection(g_active_playlist);
            plman.SetPlaylistSelectionSingle(g_active_playlist, g_focus_id, true);
            plman.SetPlaylistFocusItem(g_active_playlist, g_focus_id);
            this.showFocusedItem();
        } else { // not found on "album artist" TAG, new search on "artist" TAG
            cList.inc_search_noresult = true;
            brw.repaint();
        };
        
        cList.clear_incsearch_timer && clearTimeout(cList.clear_incsearch_timer);
        cList.clear_incsearch_timer = setTimeout(function () {
            // reset incremental search string after 1 seconds without any key pressed
            cList.search_string = "";
            cList.inc_search_noresult = false;
            brw.repaint();
            window.ClearInterval(cList.clear_incsearch_timer);
            cList.clear_incsearch_timer = false;
        }, 1000);
    };
};

/* 
===================================================================================================
    Main
===================================================================================================
*/
var g_elapsed_seconds = null;
var g_time_remaining = null;
var g_total_seconds = null;
var g_radio_title = "loading live tag ...";
var g_radio_artist = "";

var list_img = [];
var g_valid_tid = 0;

var cover_path = new RegExp("(artwork)|(cover)|(scan)|(image)");
var cover_img = cover.masks.split(";");
var stub_image,cell_null;

var brw = null;
var g_1x1 = false;
var g_last = 0;
var isScrolling = false;
var g_zoom_percent = 100;

var g_filterbox = null;
var filter_text = "";

var g_instancetype = window.InstanceType;
var g_counter_repaint = 0;

// drag'n drop from windows system
var g_dragndrop_status = false;
var g_dragndrop_x = -1;
var g_dragndrop_y = -1;
var g_dragndrop_bottom = false;
var g_dragndrop_timer = false;
var g_dragndrop_trackId = -1;
var g_dragndrop_rowId = -1;
var g_dragndrop_targetPlaylistId = -1;
var g_dragndrop_total_before = 0;
var g_dragndrop_drop_forbidden = false;

//
var ww = 0, wh = 0;
var g_metadb = null;
var g_focus = false;
clipboard = {
    selection: null
};

var update_wallpaper = false;
var repopulate = false;
var g_focus_id = -1;
var g_focus_id_prev = -1;
var g_focus_row = 0;
var g_focus_album_id = -1;
var g_populate_opt = 1;
// boolean to avoid callbacks
var g_avoid_on_playlists_changed = false;
var g_avoid_on_playlist_switch = false;
var g_avoid_on_item_focus_change = false;
var g_avoid_on_playlist_items_added = false;
var g_avoid_on_playlist_items_removed = false;
var g_avoid_on_playlist_items_reordered = false;
// mouse actions
var g_lbtn_click = false;
var g_rbtn_click = false;
//
var g_total_duration_text = "";
var g_first_populate_done = false;
var g_first_populate_launched = false;
//
var repaintforced = false;
var launch_time = fb.CreateProfiler("launch_time");
var form_text = "";
var repaint_cover = true, repaint_cover1 = true, repaint_cover2 = true;
var repaint_main = true, repaint_main1 = true, repaint_main2 = true;
var window_visible = false;
var scroll_ = 0, scroll = 0, scroll_prev = 0;
var time222;
var g_start_ = 0, g_end_ = 0;
var g_last = 0;
var g_wallpaperImg = null;

var g_rating_updated = false;
var g_rating_rowId = -1;
var g_image_cache = false;
function setActivePlaylist(){
	var g_active_playlist_new=-1
	if(properties.lockOnPlaylistNamed!="") {
		g_active_playlist_new = check_playlist(properties.lockOnPlaylistNamed);
		if(g_active_playlist_new==-1) {
			window.SetProperty("lock on specific playlist name", "");
			properties.lockOnPlaylistNamed="";
			g_active_playlist_new = plman.ActivePlaylist;
		}
	}
	else if(fb.IsPlaying && properties.lockOnNowPlaying) g_active_playlist_new = plman.PlayingPlaylist;
	else if(properties.lockOnNowPlaying) g_active_playlist_new = -1
    else g_active_playlist_new = plman.ActivePlaylist;
	
	if(g_active_playlist!=g_active_playlist_new) changed = true;
	else changed = false;
	g_active_playlist = g_active_playlist_new;
	return changed;
}

// START
function on_size() {
    window.DlgCode = 0x0004;
    
    ww = Math.max(window.Width,globalProperties.miniMode_minwidth);
    wh = Math.max(window.Height,globalProperties.minMode_minheight); 
    wh_real = window.Height;
    if(!ww || !wh) {
        ww = 1;
        wh = 1;
		return;
    };
	//if(window.IsVisible || first_on_size || !g_first_populate_done){
		window.MinWidth = 1;
		window.MinHeight = 1;
		
		// set wallpaper
		if(properties.showwallpaper && window.IsVisible){
			//g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
		} else update_wallpaper = true;
		
		brw.setSize(0, (properties.showHeaderBar ? properties.headerBarHeight : 0), ww, wh - (properties.showHeaderBar ? properties.headerBarHeight : 0));
		update_size = false;	
		first_on_size = false;		
	//} else update_size = true;	
};
function set_update_function(string){
	if( Update_Required_function.indexOf("on_playback_new_track(")!=-1) {
		if( string.indexOf("brw.populate")!=-1) repopulate = true;
		return;	
	} else if( Update_Required_function.indexOf("brw.populate(true")!=-1) return;
	else if(Update_Required_function.indexOf("brw.populate(false")!=-1) {
		if(string.indexOf("brw.populate(true")!=-1) Update_Required_function=string;
	}
	else Update_Required_function=string;
}

function on_paint(gr) {
	if(Update_Required_function!="") {
		eval(Update_Required_function);
		Update_Required_function = "";
	}    
	if((typeof(g_wallpaperImg) == "undefined" || !g_wallpaperImg || update_wallpaper) && properties.showwallpaper){
		g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
	}		
    if(!ww) return;
    
    if(!g_1x1) {
        // draw background under playlist
        if(fb.IsPlaying && g_wallpaperImg && properties.showwallpaper) {
            gr.DrawImage(g_wallpaperImg, 0, 0, ww, wh, 0, 0, g_wallpaperImg.Width, g_wallpaperImg.Height);
            gr.FillSolidRect(0, 0, ww, wh, (properties.wallpaperblurred)?colors.wallpaper_overlay_blurred:colors.wallpaper_overlay);
        } else {
            if(g_wallpaperImg && properties.showwallpaper) {
                gr.DrawImage(g_wallpaperImg, 0, 0, ww, wh, 0, 0, g_wallpaperImg.Width, g_wallpaperImg.Height);
                gr.FillSolidRect(0, 0, ww, wh, (properties.wallpaperblurred)?colors.wallpaper_overlay_blurred:colors.wallpaper_overlay);
            } else {
                gr.FillSolidRect(0, 0, ww, wh, colors.normal_bg);
            }
        }
        
        brw && brw.draw(gr);        
		
        if(properties.DropInplaylist && pman.offset > 0) {
            pman.draw(gr);
        };
        
		if(g_dragndrop_drop_forbidden){
			gr.FillSolidRect(0, 0, ww, wh, RGBA(255,0,0,30));
		}
		
        if(properties.showHeaderBar) {
            // inputBox
            if(properties.showFilterBox && g_filterbox) {
                if(g_filterbox.inputbox.visible) {
                    g_filterbox.draw(gr, 12, Math.round(properties.headerBarHeight/2-cFilterBox.h/2)-2);
                };
            };
        };
    };
};

function on_mouse_lbtn_down(x, y, m) {
    g_lbtn_click = true;
    g_rbtn_click = false;
    
    // stop inertia
    if(cTouch.timer) {
        window.ClearInterval(cTouch.timer);
        cTouch.timer = false;
        // stop scrolling but not abrupt, add a little offset for the stop
        if(Math.abs(scroll - scroll_) > properties.rowHeight) {
            scroll = (scroll > scroll_ ? scroll_ + properties.rowHeight : scroll_ - properties.rowHeight);
            scroll = check_scroll(scroll);
        };
    };
	
	g_resizing.on_mouse("lbtn_down", x, y, m);
	
    var is_scroll_enabled = brw.rowsCount > brw.totalRowsVis;
    if(properties.enableTouchControl && is_scroll_enabled) {
        if(brw._isHover(x, y) && !brw.scrollbar._isHover(x, y)) {
            if(!timers.mouseDown) {
                cTouch.y_prev = y;
                cTouch.y_start = y;
                if(cTouch.t1) {
                    cTouch.t1.Reset();
                } else {
                    cTouch.t1 = fb.CreateProfiler("t1");
                };
                timers.mouseDown = setTimeout(function() {
                    clearTimeout(timers.mouseDown);
                    timers.mouseDown = false;
                    if(Math.abs(cTouch.y_start - g_cursor.y) > 015) {
                        cTouch.down = true;
                    } else {
                        brw.on_mouse("down", x, y);
                    };
                },50);
            };
        } else {		
			// scrollbar
			if(cScrollBar.enabled && cScrollBar.visible) {
				brw.scrollbar && brw.scrollbar.on_mouse("down", x, y);
			} else brw.on_mouse("down", x, y);
        }
    } else {
		// scrollbar
		if(brw.scrollbar._isHover(x, y) && cScrollBar.enabled && cScrollBar.visible) {
			brw.scrollbar && brw.scrollbar.on_mouse("down", x, y);
		} else brw.on_mouse("down", x, y);
    }
    
    // inputBox
    if(properties.showHeaderBar && properties.showFilterBox && g_filterbox.inputbox.visible) {
        g_filterbox.on_mouse("lbtn_down", x, y);
    }
};

function on_mouse_lbtn_up(x, y, m) {

    // inputBox
    if(properties.showHeaderBar && properties.showFilterBox && g_filterbox.inputbox.visible) {
        g_filterbox.on_mouse("lbtn_up", x, y);
    };
	
	g_resizing.on_mouse("lbtn_up", x, y, m);

	if(brw.drag_tracks){
        if(g_dragndrop_bottom) {	
            plman.MovePlaylistSelection(g_active_playlist, plman.PlaylistItemCount(g_active_playlist));
        } else if(g_dragndrop_rowId>-1 && brw.rows[g_dragndrop_rowId].type!=99){
			
			var selected_items = plman.GetPlaylistSelectedItems(g_active_playlist);
			var	nb_selected_items = selected_items.Count;
			if(nb_selected_items > 0)	{	
				var save_focus_handle = selected_items[0];
				var drop_handle = brw.rows[g_dragndrop_rowId].metadb;
				g_avoid_on_item_focus_change = true;
				g_avoid_on_playlist_items_reordered = true;
				drop_on_selected_row = (plman.IsPlaylistItemSelected(g_active_playlist, brw.rows[g_dragndrop_rowId].playlistTrackId));
				//if(drop_on_selected_row){
					//plman.SetPlaylistSelectionSingle(g_active_playlist, brw.rows[g_dragndrop_rowId].playlistTrackId, false);
				//}
				if(nb_selected_items > 1 && !drop_on_selected_row)	{
					// 1st: move selected item at the full end of the playlist to make then contigus
					
					plman.MovePlaylistSelection(g_active_playlist, plman.PlaylistItemCount(g_active_playlist));
					// 2nd: move bottom selection to new drop_id place (to redefine first...)
					plman.SetPlaylistFocusItemByHandle(g_active_playlist, drop_handle);
					var drop_id_new = plman.GetPlaylistFocusItemIndex(g_active_playlist);
				
					var delta = (plman.PlaylistItemCount(g_active_playlist)-nb_selected_items-drop_id_new) * -1;
					if(delta>0) delta=delta-1;							
					plman.MovePlaylistSelection(g_active_playlist, delta);
					if(drop_on_selected_row){
						plman.SetPlaylistSelectionSingle(g_active_playlist, plman.GetPlaylistFocusItemIndex(g_active_playlist), true);
					}					
					plman.SetPlaylistFocusItemByHandle(g_active_playlist, save_focus_handle);	

				}
				else if(g_dragndrop_rowId>-1 && brw.rows[g_dragndrop_rowId].type!=99 && !drop_on_selected_row){
					g_dragndrop_list_total = brw.list.Count;
					var delta = (brw.dragSource_track.playlistTrackId - g_dragndrop_trackId) * -1;
					if(delta>0) delta=delta-1
					plman.MovePlaylistSelection(g_active_playlist, delta);
				}
				g_avoid_on_playlist_items_reordered = false;
				g_avoid_on_item_focus_change = false;				
			}
        }		
		on_drag_leave();
		brw.drag_tracks = false;
		window.SetCursor(IDC_ARROW);
		brw.repaint();
	}	
	else if(properties.DropInplaylist && pman.state == 1) {
		pman.on_mouse("up", x, y);
	} else {
		brw.on_mouse("up", x, y);
	};

    if(timers.mouseDown) {
        clearTimeout(timers.mouseDown);
        timers.mouseDown = false;
        if(Math.abs(cTouch.y_start - g_cursor.y) <= 030) {
            brw.on_mouse("down", x, y);
        };
    };
	
    // create scroll inertia on mouse lbtn up
    if(cTouch.down) {
        cTouch.down = false;
        cTouch.y_end = y;
        cTouch.scroll_delta = scroll - scroll_;
        //cTouch.y_delta = cTouch.y_start - cTouch.y_end;
        if(Math.abs(cTouch.scroll_delta) > 030 ) {
            cTouch.multiplier = ((1000 - cTouch.t1.Time) / 20);
            cTouch.delta = Math.round((cTouch.scroll_delta) / 030);
            if(cTouch.multiplier < 1) cTouch.multiplier = 1;
            if(cTouch.timer) window.ClearInterval(cTouch.timer);
            cTouch.timer = setInterval(function() {
                scroll += cTouch.delta * cTouch.multiplier;
                scroll = check_scroll(scroll);
                cTouch.multiplier = cTouch.multiplier - 1;
                cTouch.delta = cTouch.delta - (cTouch.delta / 10);
                if(cTouch.multiplier < 1) {
                    window.ClearInterval(cTouch.timer);
                    cTouch.timer = false;
                };
            }, 75);
        };
    };
    	
    g_lbtn_click = false;
};

function on_mouse_lbtn_dblclk(x, y, mask) {
    if(y >= brw.y) {    
        brw.on_mouse("dblclk", x, y);
    } else if(x > brw.x && x < brw.x + brw.w) {
        brw.showNowPlaying();
    } else {
        brw.on_mouse("dblclk", x, y);
    };
	
};

function on_mouse_rbtn_down(x, y, mask) {
    g_rbtn_click = true;
	if(brw.drag_tracks){
		brw.drag_clicked = false;		
		on_drag_leave();
		brw.drag_tracks = false;
		window.SetCursor(IDC_ARROW);
		brw.repaint();
	}	    
    if(!utils.IsKeyPressed(VK_SHIFT)) {
        // inputBox
        if(properties.showHeaderBar && properties.showFilterBox && g_filterbox.inputbox.visible) {
            g_filterbox.on_mouse("rbtn_down", x, y);
        };
        
        if(pman.state == 1 && properties.DropInplaylist) {
            pman.on_mouse("right", x, y);
        };
        
        brw.on_mouse("right", x, y);
    };
};
function on_mouse_mbtn_down(x, y, mask) {
	if(brw.drag_tracks){
		brw.drag_clicked = false;
		on_drag_leave();
		brw.drag_tracks = false;
		window.SetCursor(IDC_ARROW);
		brw.repaint();
	}		
}
function on_mouse_rbtn_up(x, y){
    g_rbtn_click = false;
    
    if(!utils.IsKeyPressed(VK_SHIFT)) {
        return;
    };	
};

function on_mouse_move(x, y, m) {
	if(g_cursor.x==x && g_cursor.y==y) return;
	g_cursor.onMouse("move", x, y, m);	
	
    // inputBox
    if(properties.showHeaderBar && properties.showFilterBox && g_filterbox.inputbox.visible && !brw.drag_tracks) {
        g_filterbox.on_mouse("move", x, y);
    };
    
	g_resizing.on_mouse("move", x, y, m);
	
    if(properties.DropInplaylist && pman.state == 1) {
        pman.on_mouse("move", x, y);
	} else if(brw.drag_tracks){
		on_drag_over(null, x, y, null);
		//brw.on_mouse("drag_over", x, y);
    } else {
        if(cTouch.down) {
            cTouch.y_current = y;
            cTouch.y_move = (cTouch.y_current - cTouch.y_prev);
            if(x < brw.w) {
                    scroll -= cTouch.y_move;
                    cTouch.scroll_delta = scroll - scroll_;
                    if(Math.abs(cTouch.scroll_delta) < 030) cTouch.y_start = cTouch.y_current;
                    cTouch.y_prev = cTouch.y_current;
            };
        } else {
            brw.on_mouse("move", x, y);
        };
    };
};

function on_mouse_wheel(step, stepstrait, delta){
	
	if(typeof(stepstrait) == "undefined" || typeof(delta) == "undefined") intern_step = step;
	else intern_step = stepstrait/delta;
	
    if(cTouch.timer) {
        window.ClearInterval(cTouch.timer);
        cTouch.timer = false;
    };
    
    if(utils.IsKeyPressed(VK_SHIFT)) { //&& properties.showGroupHeaders) { // zoom cover size only
		//brw.setGroupHeaderRowsNumber(intern_step);
		brw.setRowHeight(intern_step);
    } else if(utils.IsKeyPressed(VK_CONTROL)) {
        var zoomStep = 1;
        var previous = properties.globalFontAdjustement;
        if(!timers.mouseWheel) {
            if(intern_step > 0) {
                properties.globalFontAdjustement += zoomStep;
                if(properties.globalFontAdjustement > 10) properties.globalFontAdjustement = 10;
            } else {
                properties.globalFontAdjustement -= zoomStep;
                if(properties.globalFontAdjustement < -10) properties.globalFontAdjustement = 0;
            };
            if(previous != properties.globalFontAdjustement) {
                timers.mouseWheel = setTimeout(function() {
                    window.SetProperty("MAINPANEL: Global Font Adjustement", properties.globalFontAdjustement)
                    get_font();
					g_var_cache.resetAll();
                    get_metrics();
                    get_images();
                    
                    // refresh covers
                    brw.refreshThumbnails();
                    
                    brw.repaint();
                    timers.mouseWheel && clearTimeout(timers.mouseWheel);
                    timers.mouseWheel = false;
                }, 100);
            };
        };
    } else {
        if(properties.DropInplaylist && pman.state == 1) {
            if(pman.scr_w > 0) pman.on_mouse("wheel", g_cursor.x, g_cursor.y, intern_step);
        } else if(cScrollBar.visible) {
            var rowStep = properties.rowScrollStep;
            scroll -= intern_step * properties.rowHeight * rowStep;
            scroll = check_scroll(scroll);
            brw.on_mouse("wheel", g_cursor.x, g_cursor.y, intern_step);
        };
    };
    
};

function on_mouse_leave() {
    // inputBox
    if(properties.showHeaderBar && properties.showFilterBox && g_filterbox.inputbox.visible) {
        g_filterbox.on_mouse("leave", 0, 0);
    };
    brw.on_mouse("leave", 0, 0);
    
    /*if(properties.DropInplaylist && pman.state == 1) {
        pman.on_mouse("leave", 0, 0);
    };*/
};

//=================================================// Metrics & Fonts & Colors & Images
function get_metrics() {
	g_zoom_percent = Math.floor(g_fsize / 12 * 100);
	
	if(properties.doubleRowText) properties.groupHeaderRowsNumber = properties.groupHeaderRowsNumberDouble;
	else properties.groupHeaderRowsNumber = properties.groupHeaderRowsNumberSimple;
    if(!properties.showGroupHeaders) properties.extraRowsNumber=0;
	else properties.extraRowsNumber = window.GetProperty("_PROPERTY: Number of Extra Rows per Group", 0);
	
	
    cPlaylistManager.width = Math.floor(cPlaylistManager.default_width * g_zoom_percent / 100);
    cPlaylistManager.topbarHeight = Math.floor(cPlaylistManager.default_topbarHeight * g_zoom_percent / 100);
    cPlaylistManager.botbarHeight = Math.floor(cPlaylistManager.default_botbarHeight * g_zoom_percent / 100);
    cPlaylistManager.rowHeight = Math.floor(cPlaylistManager.default_rowHeight * g_zoom_percent / 100);
    cPlaylistManager.scrollbarWidth = Math.floor(cPlaylistManager.default_scrollbarWidth * g_zoom_percent / 100);
    
    if(properties.showHeaderBar) {
        //properties.headerBarHeight = Math.round(properties.defaultHeaderBarHeight * g_zoom_percent / 100);
        //properties.headerBarHeight = Math.floor(properties.headerBarHeight / 2) != properties.headerBarHeight / 2 ? properties.headerBarHeight : properties.headerBarHeight - 1;
		if(main_panel_state.isEqual(0) && properties.ParentName=="MainPanel") properties.headerBarHeight = properties.libraryHeaderBarHeight-1; 
		else properties.headerBarHeight = properties.defaultHeaderBarHeight-1;
    } else {
        properties.headerBarHeight = 0;
    };
    if(properties.doubleRowText) {
        var _defaultRowHeight = properties.defaultRowHeight + properties.doubleRowPixelAdds;
    } else {
        var _defaultRowHeight = properties.defaultRowHeight;
    };
    properties.rowHeight = Math.round(_defaultRowHeight * g_zoom_percent / 100);
    cScrollBar.width = Math.floor(cScrollBar.defaultWidth * g_zoom_percent / 100);
    cScrollBar.minCursorHeight = Math.round(cScrollBar.defaultMinCursorHeight * g_zoom_percent / 100);
    //
    cover.margin = Math.floor(cover.default_margin * g_zoom_percent / 100);
    cover.w = properties.groupHeaderRowsNumber * properties.rowHeight;
	cover.max_w = properties.groupHeaderRowsNumber * properties.rowHeight;
    cover.h = properties.groupHeaderRowsNumber * properties.rowHeight;
	cover.max_h = properties.groupHeaderRowsNumber * properties.rowHeight;
    
    cFilterBox.w = Math.floor(cFilterBox.default_w * g_zoom_percent / 100);
    cFilterBox.h = Math.round(cFilterBox.default_h * g_zoom_percent / 100);
    
	if(properties.doubleRowText)
		properties.addedRows_end = Math.round(properties.addedRows_end_default/2)-((properties.showGroupHeaders)?properties.extraRowsNumber:0);
	else 
		properties.addedRows_end = properties.addedRows_end_default-((properties.showGroupHeaders)?properties.extraRowsNumber:0);
	if(properties.addedRows_end<0) properties.addedRows_end = 0;
	
    if(brw) {
        if(cScrollBar.enabled)  {
            //brw.setSize(0, (properties.showHeaderBar ? properties.headerBarHeight : 0), ww - cScrollBar.width, wh - (properties.showHeaderBar ? properties.headerBarHeight : 0));
			brw.setSize(0, (properties.showHeaderBar ? properties.headerBarHeight : 0), ww, wh - (properties.showHeaderBar ? properties.headerBarHeight : 0));
        } else {
            brw.setSize(0, (properties.showHeaderBar ? properties.headerBarHeight : 0), ww, wh - (properties.showHeaderBar ? properties.headerBarHeight : 0));
        };
        brw.setList();
        //
        g_focus_row = brw.getOffsetFocusItem(g_focus_id);
        // if focused track not totally visible, we scroll to show it centered in the panel
        if(g_focus_row < scroll/properties.rowHeight || g_focus_row > scroll/properties.rowHeight + brw.totalRowsVis - 1) {
            scroll = (g_focus_row - Math.floor(brw.totalRowsVis / 2)) * properties.rowHeight;
            scroll = check_scroll(scroll);
            scroll_ = scroll;
        };
        if(brw.rowsCount > 0) brw.gettags(true);
    };
};

function get_images() {
    var gb;
    var txt = "";
	
	if(properties.AlbumArtProgressbar || properties.darklayout || (properties.doubleRowText && properties.doubleRowShowCover && !properties.showGroupHeaders)){
		images.now_playing_1 = gdi.Image(theme_img_path + "\\graphic_browser\\now_playing_progress1.png");
		images.now_playing_0 = gdi.Image(theme_img_path + "\\graphic_browser\\now_playing_progress0.png");			
	} else {
		images.now_playing_1 = gdi.Image(theme_img_path + "\\graphic_browser\\now_playing_track1.png");
		images.now_playing_0 = gdi.Image(theme_img_path + "\\graphic_browser\\now_playing_track0.png");		
	}
	images.now_playing_black = gdi.Image(theme_img_path + "\\graphic_browser\\now_playing_track0.png");
	images.now_playing_white = gdi.Image(theme_img_path + "\\graphic_browser\\now_playing_progress0.png");	
	if(properties.darklayout) {
		images.playing_playlist = gdi.Image(theme_img_path + "\\graphic_browser\\now_playing_progress1.png");
	} else {
		images.playing_playlist = gdi.Image(theme_img_path + "\\graphic_browser\\now_playing_track1.png");
	}
		
	g_filterbox.getImages();
    // PLAY icon  
    images.play_on = gdi.CreateImage(70, 70);
    gb = images.play_on.GetGraphics();
    DrawPolyStar(gb, 12-2, 12, 46, 1, 3, 2, colors.normal_bg, colors.normal_txt, 90, 255);
    images.play_on.ReleaseGraphics(gb);

    images.play_off = gdi.CreateImage(70, 70);
    gb = images.play_off.GetGraphics();
    DrawPolyStar(gb, 16-2, 16, 38, 1, 3, 2, colors.normal_bg, colors.normal_txt, 90, 255);
    images.play_off.ReleaseGraphics(gb);
    
    var img_loading = gdi.Image(images.path+"load.png");
    var iw = properties.groupHeaderRowsNumber * properties.rowHeight;
    images.loading_draw = img_loading.Resize(iw, iw, 7);

    images.noart = cover.nocover_img;
	
	
    var sw = 250, sh= 250;
    txt = "STREAM";
	images.stream = cover.stream_img;
};



function get_colors() {
	get_colors_global();	
	if(properties.darklayout){
		colors.fadedsmall_txt = GetGrey(200);			
		colors.tracknumber_txt = GetGrey(230);	
		colors.flash_bg = GetGrey(255,30),
		colors.flash_rectline = GetGrey(255,61),
		
		colors.rating_icon_on = GetGrey(255);
		colors.rating_icon_off = GetGrey(255,60);
		colors.rating_icon_border = GetGrey(255,0);	
		
		colors.cover_rectline = GetGrey(255,40);
		colors.cover_rectline_AlbumArtProgressbar = GetGrey(255,90);
		
		colors.playing_cover_overlay = GetGrey(0,180);			
		
		colors.grad_line = GetGrey(255,35);
		colors.grad_line_bg = GetGrey(0,0);
		colors.grad_line_selected = GetGrey(255,35);
		colors.grad_line_bg_selected = GetGrey(0,0);
		
		colors.grad_bottom_1 = GetGrey(0,70);
		colors.grad_bottom_2 = GetGrey(0,0);	
		colors.fading_bottom_height = 39;
			
		colors.headerbar_bg = GetGrey(15,200);	
		colors.headerbar_line = GetGrey(255,38);	
		
		colors.progressbar = GetGrey(255,45);
		colors.progressbar_bg_off = GetGrey(0,0);
		colors.progressbar_bg_on = GetGrey(255,20);		
		colors.progressbar_shadow = GetGrey(0,15)		
		colors.albumartprogressbar_txt = GetGrey(255);	
		colors.albumartprogressbar_overlay = GetGrey(0,80);	
		colors.albumartprogressbar_rectline = GetGrey(255,40);	
	} else {	
		colors.tracknumber_txt = GetGrey(130);
		
		colors.rating_icon_on = GetGrey(0);	
		colors.rating_icon_off = GetGrey(0,30);	
		colors.rating_icon_border = GetGrey(0,0);
		
		colors.cover_rectline = GetGrey(0,30);	
		colors.cover_rectline_AlbumArtProgressbar = GetGrey(255,90);
		
		colors.playing_cover_overlay = GetGrey(0,150);			
		
		colors.flash_bg = GetGrey(0,10);		
		colors.flash_rectline = GetGrey(0,41);		
		
		colors.headerbar_bg = GetGrey(255,240);		
		colors.headerbar_line = GetGrey(215);
		if(properties.showwallpaper) {
			colors.fadedsmall_txt = GetGrey(125);			
		} else {	
			colors.fadedsmall_txt = GetGrey(125);			
		}
		
		colors.grad_line = GetGrey(0,36);
		colors.grad_line_bg = GetGrey(255,0);	
		colors.grad_line_selected = GetGrey(0,16);
		colors.grad_line_bg_selected = GetGrey(255,0);
		
		colors.grad_bottom_1 = GetGrey(0,10);
		colors.grad_bottom_2 = GetGrey(0,0);
		colors.fading_bottom_height = 39;		
			
		colors.progressbar = GetGrey(0,70);	
		colors.progressbar_bg_off = GetGrey(255,0);
		colors.progressbar_bg_on = GetGrey(255,60);		
		colors.progressbar_shadow = GetGrey(0,5);
		colors.albumartprogressbar_txt = GetGrey(255);	
		colors.albumartprogressbar_overlay = GetGrey(0,80);	
		colors.albumartprogressbar_rectline = GetGrey(0,40);		
	}
};

function on_font_changed() {
	g_var_cache.resetAll();
    get_font();
	brw.ratingImages = false;	
	g_filterbox.setSize(this.w, cFilterBox.h+2, g_fsize);
    get_metrics();
    brw.repaint();
};
function setDarkLayout(){
	var new_darklayout_state = false;
	if(properties.ParentName=="MiniPanel") new_darklayout_state = properties.minimode_dark_theme;
	else if(main_panel_state.isEqual(0)) new_darklayout_state = properties.library_dark_theme;
	else if(main_panel_state.isEqual(1)) new_darklayout_state = properties.playlists_dark_theme;	
	else if(main_panel_state.isEqual(2)) {
		new_darklayout_state = properties.bio_dark_theme;
		//if(properties.bio_stick2darklayout)	new_darklayout_state = true;
	} else if(main_panel_state.isEqual(3)) {
		new_darklayout_state = properties.visualization_dark_theme;		
	}
	return new_darklayout_state;
}
function on_colours_changed() {
	new_darklayout_state = setDarkLayout();
	if(properties.darklayout!=new_darklayout_state){
		properties.darklayout = new_darklayout_state;
		window.SetProperty("_DISPLAY: Dark layout", properties.darklayout);		
		get_colors();
		get_images();
		get_font();
		g_var_cache.resetAll();
		brw.ratingImages = false;
		if(brw) brw.scrollbar.setNewColors();
		g_filterbox.getImages();
		g_filterbox.reset_colors();
		brw.repaint();
	}
};

function on_script_unload() {
    //brw.resetTimer();
};

//=================================================// Keyboard Callbacks
function on_key_up(vkey) {
    if(cSettings.visible) {

    } else {
        // inputBox
        if(properties.showHeaderBar && properties.showFilterBox && g_filterbox.inputbox.visible) {
            g_filterbox.on_key("up", vkey);
        };
        
        // scroll keys up and down RESET (step and timers)
        brw.keypressed = false;
        cScrollBar.timerCounter = -1;
        cScrollBar.timerID && clearTimeout(cScrollBar.timerID);
        cScrollBar.timerID = false;
        if(vkey == VK_SHIFT) {
            brw.SHIFT_start_id = null;
            brw.SHIFT_count = 0;
        };
    };
    brw.repaint();
};

function vk_up() {
    var scrollstep = 1;
    var new_focus_id = 0, new_row = 0;
    
    new_row = g_focus_row - scrollstep;
    if(new_row < 0) {
        if(brw.groups[0].collapsed) {
            new_row = 0;
        } else {
            if(properties.showGroupHeaders) {
                new_row = 0 + properties.groupHeaderRowsNumber;
            } else {
                new_row = 0;
            };
        };
        // kill timer
        cScrollBar.timerCounter = -1;
        cScrollBar.timerID && clearTimeout(cScrollBar.timerID);
        cScrollBar.timerID = false;
    } else {
        switch(brw.rows[new_row].type) {
            case 0: // track row
                // RAS
                break;
            case 99: // blank line (extra line)
                while(brw.rows[new_row].type == 99) {
                    if(new_row > 0) new_row -= 1;
                };
                break;
            default: // group row
                if(brw.groups[brw.rows[new_row].albumId].collapsed) {
                    new_row -= (properties.groupHeaderRowsNumber - 1);
                } else {
                    new_row -= properties.groupHeaderRowsNumber;
                };
        };
    };
    if(new_row >= 0) {
        while(brw.rows[new_row].type == 99) {
            if(new_row > 0) new_row -= 1;
        };
        new_focus_id = brw.rows[new_row].playlistTrackId;
        plman.ClearPlaylistSelection(g_active_playlist);
        plman.SetPlaylistSelectionSingle(g_active_playlist, new_focus_id, true);
        plman.SetPlaylistFocusItem(g_active_playlist, new_focus_id);
    } else {
        // kill timer
        cScrollBar.timerCounter = -1;
        cScrollBar.timerID && clearTimeout(cScrollBar.timerID);
        cScrollBar.timerID = false;
    };
};

function vk_down() {
    var scrollstep = 1;
    var new_focus_id = 0, new_row = 0;
    
    new_row = g_focus_row + scrollstep;
    if(new_row > brw.rowsCount - 1) {
        new_row = brw.rowsCount - 1;
        if(brw.groups[brw.rows[new_row].albumId].collapsed) {
            new_row -= (properties.groupHeaderRowsNumber - 1);
        };
        // kill timer
        cScrollBar.timerCounter = -1;
        cScrollBar.timerID && clearTimeout(cScrollBar.timerID);
        cScrollBar.timerID = false;
    } else {
        switch(brw.rows[new_row].type) {
            case 0: // track row
                // RAS
                break;
            case 99: // blank line (extra line)
                while(brw.rows[new_row].type == 99) {
                    if(new_row < brw.rowsCount - 1) new_row += 1;
                };
                break;
            default: // group row
                if(brw.groups[brw.rows[new_row].albumId].collapsed) {
                    if(brw.rows[new_row].type > 1) { // if not 1st row of the group header
                        new_row += (properties.groupHeaderRowsNumber - brw.rows[new_row].type + 1);
                        if(new_row > brw.rowsCount - 1) {
                            new_row = brw.rowsCount - 1;
                            if(brw.groups[brw.rows[new_row].albumId].collapsed) {
                                new_row -= (properties.groupHeaderRowsNumber - 1);
                            };
                        } else {
                            if(!brw.groups[brw.rows[new_row].albumId].collapsed) {
                                new_row += properties.groupHeaderRowsNumber;
                            };
                        };
                    } else {
                        // RAS
                    };
                } else {
                    if(brw.rows[new_row].type > 1) { // if not 1st row of the group header
                        // RAS, can't happend
                    } else {
                        new_row += properties.groupHeaderRowsNumber;
                    };
                };
        };
    };
    if(new_row < brw.rowsCount) {
        while(brw.rows[new_row].type == 99) {
            if(new_row < brw.rowsCount - 1) new_row += 1;
        };
        new_focus_id = brw.rows[new_row].playlistTrackId;
        plman.ClearPlaylistSelection(g_active_playlist);
        plman.SetPlaylistSelectionSingle(g_active_playlist, new_focus_id, true);
        plman.SetPlaylistFocusItem(g_active_playlist, new_focus_id);
    } else {
        // kill timer
        cScrollBar.timerCounter = -1;
        cScrollBar.timerID && clearTimeout(cScrollBar.timerID);
        cScrollBar.timerID = false;
    };
};

function vk_pgup() {
    var scrollstep = brw.totalRowsVis;
    var new_focus_id = 0, new_row = 0;
    
    new_row = g_focus_row - scrollstep;
    if(new_row < 0) {
        if(brw.groups[0].collapsed || !properties.showGroupHeaders) {
            new_row = 0;
        } else {
            new_row = 0 + properties.groupHeaderRowsNumber;
        };
        // kill timer
        cScrollBar.timerCounter = -1;
        cScrollBar.timerID && clearTimeout(cScrollBar.timerID);
        cScrollBar.timerID = false;
    } else {
        switch(brw.rows[new_row].type) {
            case 0: // track row
                // RAS
                break;
            case 99: // blank line (extra line)
                while(brw.rows[new_row].type == 99) {
                    if(new_row > 0) new_row -= 1;
                };
                break;
            default: // group row
                if(brw.groups[brw.rows[new_row].albumId].collapsed) {
                    if(brw.rows[new_row].type > 1) { // if not 1st row of the group header
                        new_row -= (brw.rows[new_row].type - 1);
                    } else {
                        // RAS
                    };
                } else {
                    new_row += (properties.groupHeaderRowsNumber - brw.rows[new_row].type + 1);
                };
        };
    };
    if(new_row >= 0) {
        while(brw.rows[new_row].type == 99) {
            if(new_row > 0) new_row -= 1;
        };
        new_focus_id = brw.rows[new_row].playlistTrackId;
        plman.ClearPlaylistSelection(g_active_playlist);
        plman.SetPlaylistSelectionSingle(g_active_playlist, new_focus_id, true);
        plman.SetPlaylistFocusItem(g_active_playlist, new_focus_id);
    } else {
        // kill timer
        cScrollBar.timerCounter = -1;
        cScrollBar.timerID && clearTimeout(cScrollBar.timerID);
        cScrollBar.timerID = false;
    };
};

function vk_pgdn() {
    var scrollstep = brw.totalRowsVis;
    var new_focus_id = 0, new_row = 0;
    
    new_row = g_focus_row + scrollstep;
    if(new_row > brw.rowsCount - 1) {
        new_row = brw.rowsCount - 1;
		while(brw.rows[new_row].type == 99 && new_row>0) {
			new_row -= 1;
		};		
        //if(brw.groups[brw.rows[new_row].albumId].collapsed) {
          //  new_row -= (properties.groupHeaderRowsNumber - 1);
        //};
    } else {
        switch(brw.rows[new_row].type) {
            case 0: // track row
                // RAS
                break;
            case 99: // blank line (extra line)
                while(brw.rows[new_row].type == 99) {
                    if(new_row < brw.rowsCount - 1) new_row += 1;
                };
                break;
            default: // group row
                if(brw.groups[brw.rows[new_row].albumId].collapsed) {
                    if(brw.rows[new_row].type > 1) { // if not 1st row of the group header
                        new_row -= (brw.rows[new_row].type - 1);
                    } else {
                        // RAS
                    };
                } else {
                    new_row += (properties.groupHeaderRowsNumber - brw.rows[new_row].type + 1);
                };
        };
    };
    if(new_row < brw.rowsCount) {
        while(brw.rows[new_row].type == 99) {
            if(new_row < brw.rowsCount - 1) new_row += 1;
        };
        new_focus_id = brw.rows[new_row].playlistTrackId;
        plman.ClearPlaylistSelection(g_active_playlist);
        plman.SetPlaylistSelectionSingle(g_active_playlist, new_focus_id, true);
        plman.SetPlaylistFocusItem(g_active_playlist, new_focus_id);
    } else {
        // kill timer
        cScrollBar.timerCounter = -1;
        cScrollBar.timerID && clearTimeout(cScrollBar.timerID);
        cScrollBar.timerID = false;
    };
};

function on_key_down(vkey) {
    var mask = GetKeyboardMask();
    
    if(cSettings.visible) {

    } else {
        //if(dragndrop.drag_in) return true;

        // inputBox
        if(properties.showHeaderBar && properties.showFilterBox && g_filterbox.inputbox.visible) {
            g_filterbox.on_key("down", vkey);
        };

        var act_pls = g_active_playlist;
        
        if (mask == KMask.none) {
            switch (vkey) {
            case VK_F2:
                break;
            case VK_F3:
                brw.showNowPlaying();
                break;
            case VK_F5:
                brw.refreshThumbnails();
                brw.repaint();
                break;
            case VK_F6:
                break;
            case VK_TAB:
                break;
            case VK_BACK:
                if(cList.search_string.length>0) {
                    cList.inc_search_noresult = false;
                    brw.tt_x = ((brw.w) / 2) - (((cList.search_string.length*13)+(10*2)) / 2);
                    brw.tt_y = brw.y + Math.floor((brw.h / 2) - 30);
                    brw.tt_w = ((cList.search_string.length*13)+(10*2));
                    brw.tt_h = 60;
                    cList.search_string = cList.search_string.substring(0, cList.search_string.length - 1);
                    brw.repaint();
                    cList.clear_incsearch_timer && clearTimeout(cList.clear_incsearch_timer);
                    cList.clear_incsearch_timer = false;
                    cList.incsearch_timer && clearTimeout(cList.incsearch_timer);
                    cList.incsearch_timer = setTimeout(function () {
                        brw.incrementalSearch();
                        clearTimeout(cList.incsearch_timer);
                        cList.incsearch_timer = false;
                        cList.inc_search_noresult = false;
                    }, 400);
                };
                break;
            case VK_ESCAPE:
				if(g_uihacks.getFullscreenState()) g_uihacks.toggleFullscreen();
				break;				
            case 222:
                brw.tt_x = ((brw.w) / 2) - (((cList.search_string.length*13)+(10*2)) / 2);
                brw.tt_y = brw.y + Math.floor((brw.h / 2) - 30);
                brw.tt_w = ((cList.search_string.length*13)+(10*2));
                brw.tt_h = 60;
                cList.search_string = "";
                window.RepaintRect(0, brw.tt_y - 2, brw.w, brw.tt_h + 4);
                break;
            case VK_UP:               
                if(brw.rowsCount > 0 && !brw.keypressed && !cScrollBar.timerID) {
                    brw.keypressed = true;
                    reset_cover_timers();

                    vk_up();
                    if(!cScrollBar.timerID) {
                        cScrollBar.timerID = setTimeout(function() {
                            clearTimeout(cScrollBar.timerID);
                            cScrollBar.timerID = setInterval(vk_up, 100);
                        }, 400);
                    };
                };
                break;
            case VK_DOWN:
                if(brw.rowsCount > 0 && !brw.keypressed && !cScrollBar.timerID) {
                    brw.keypressed = true;
                    reset_cover_timers();
                    
                    vk_down();
                    if(!cScrollBar.timerID) {
                        cScrollBar.timerID = setTimeout(function() {
                            clearTimeout(cScrollBar.timerID);
                            cScrollBar.timerID = setInterval(vk_down, 100);
                        }, 400);
                    };
                };
                break;
            case VK_PGUP:
                if(brw.rowsCount > 0 && !brw.keypressed && !cScrollBar.timerID) {
                    brw.keypressed = true;
                    reset_cover_timers();
                    
                   vk_pgup();
                    if(!cScrollBar.timerID) {
                        cScrollBar.timerID = setTimeout(function() {
                            clearTimeout(cScrollBar.timerID);
                            cScrollBar.timerID = setInterval(vk_pgup, 100);
                        }, 400);
                    };
                };
                break;
            case VK_PGDN:
                if(brw.rowsCount > 0 && !brw.keypressed && !cScrollBar.timerID) {
                    brw.keypressed = true;
                    reset_cover_timers();
                    
                    vk_pgdn();
                    if(!cScrollBar.timerID) {
                        cScrollBar.timerID = setTimeout(function() {
                            clearTimeout(cScrollBar.timerID);
                            cScrollBar.timerID = setInterval(vk_pgdn, 100);
                        }, 400);
                    };
                };
                break;
            case VK_RETURN:
                // play/enqueue focused item
                //if(!isQueuePlaylistActive()) {
                    var cmd = properties.defaultPlaylistItemAction;
                    if(cmd == "Play") {
                        plman.ExecutePlaylistDefaultAction(act_pls, g_focus_id);
						//fb.Stop();fb.Play();
                    } else {
                        fb.RunContextCommandWithMetadb(cmd, brw.list[g_focus_id], 0);
                    };
                //};
                break;
            case VK_END:
                if(brw.rowsCount > 0) {
					i=brw.rows.length-1;
					while(i>0 && brw.rows[i].type==99) i--;
                    var new_focus_id = brw.rows[i].playlistTrackId;
                    plman.SetPlaylistFocusItem(act_pls, new_focus_id);
                    plman.ClearPlaylistSelection(act_pls);
                    plman.SetPlaylistSelectionSingle(act_pls, new_focus_id, true);
                };
                break;
            case VK_HOME:
                if(brw.rowsCount > 0) {
                    var new_focus_id = brw.rows[0].playlistTrackId;
                    plman.ClearPlaylistSelection(act_pls);
                    plman.SetPlaylistSelectionSingle(act_pls, new_focus_id, true);
                    plman.SetPlaylistFocusItem(act_pls, new_focus_id);
                };
                break;
            case VK_DELETE:
                if(!plman.IsAutoPlaylist(act_pls)) {
                    plman.RemovePlaylistSelection(act_pls, false);
                    plman.SetPlaylistSelectionSingle(act_pls, plman.GetPlaylistFocusItemIndex(act_pls), true);
                };
                break;
            };
        } else {
            switch(mask) {
                case KMask.shift:
                    switch(vkey) {
                        case VK_SHIFT: // SHIFT key alone
                            brw.SHIFT_count = 0;
                            break;
                        case VK_UP: // SHIFT + KEY UP
                            if(brw.SHIFT_count==0) {
                                if(brw.SHIFT_start_id==null) {
                                    brw.SHIFT_start_id = g_focus_id;
                                };
                                plman.ClearPlaylistSelection(act_pls);
                                plman.SetPlaylistSelectionSingle(act_pls, g_focus_id, true);
                                if(g_focus_id > 0) {
                                    brw.SHIFT_count--;
                                    g_focus_id--;
                                    plman.SetPlaylistSelectionSingle(act_pls, g_focus_id, true);
                                    plman.SetPlaylistFocusItem(act_pls, g_focus_id);
                                };
                            } else if(brw.SHIFT_count < 0) {
                                if(g_focus_id > 0) {
                                    brw.SHIFT_count--;
                                    g_focus_id--;
                                    plman.SetPlaylistSelectionSingle(act_pls, g_focus_id, true);
                                    plman.SetPlaylistFocusItem(act_pls, g_focus_id);
                                };
                            } else {
                                plman.SetPlaylistSelectionSingle(act_pls, g_focus_id, false);
                                brw.SHIFT_count--;
                                g_focus_id--;
                                plman.SetPlaylistFocusItem(act_pls, g_focus_id);
                            };
                            break;
                        case VK_DOWN: // SHIFT + KEY DOWN
                            if(brw.SHIFT_count==0) {
                                if(brw.SHIFT_start_id == null) {
                                    brw.SHIFT_start_id = g_focus_id;
                                };
                                plman.ClearPlaylistSelection(act_pls);
                                plman.SetPlaylistSelectionSingle(act_pls, g_focus_id, true);
                                if(g_focus_id < brw.list.Count - 1) {
                                    brw.SHIFT_count++;
                                    g_focus_id++;
                                    plman.SetPlaylistSelectionSingle(act_pls, g_focus_id, true);
                                    plman.SetPlaylistFocusItem(act_pls, g_focus_id);
                                };
                            } else if(brw.SHIFT_count>0) {
                                if(g_focus_id < brw.list.Count - 1) {
                                    brw.SHIFT_count++;
                                    g_focus_id++;
                                    plman.SetPlaylistSelectionSingle(act_pls, g_focus_id, true);
                                    plman.SetPlaylistFocusItem(act_pls, g_focus_id);
                                };
                            } else {
                                plman.SetPlaylistSelectionSingle(act_pls, g_focus_id, false);
                                brw.SHIFT_count++;
                                g_focus_id++;
                                plman.SetPlaylistFocusItem(act_pls, g_focus_id);
                            };
                            break;
                    };
                    break;
                case KMask.ctrl:
                    if(vkey==65) { // CTRL+A
						selected_array=Array();
						for(var i = 0; i <= plman.PlaylistItemCount(g_active_playlist);i++) {
							selected_array.push(i);
						};		
						plman.SetPlaylistSelection(g_active_playlist,selected_array,true)
                        brw.metadblist_selection = plman.GetPlaylistSelectedItems(g_active_playlist);
                        brw.repaint();
                    };
                    if(vkey==66) { // CTRL+B
                        cScrollBar.enabled = !cScrollBar.enabled;
                        window.SetProperty("_DISPLAY: Show Scrollbar", cScrollBar.enabled);
                        get_metrics();
                        brw.repaint();
                    };
                    if(vkey==88) { // CTRL+X
                        if(!plman.IsAutoPlaylist(act_pls)) {
                            clipboard.selection = plman.GetPlaylistSelectedItems(plman.ActivePlaylist);
                            plman.RemovePlaylistSelection(act_pls, false);
                            plman.RemovePlaylistSelection(act_pls, false);
                            plman.SetPlaylistSelectionSingle(act_pls, plman.GetPlaylistFocusItemIndex(act_pls), true);
                        };
                    };
                    if(vkey==67) { // CTRL+C
                        clipboard.selection = plman.GetPlaylistSelectedItems(g_active_playlist);
                    };
                    if(vkey==86) { // CTRL+V
                        // insert the clipboard selection (handles) after the current position in the active playlist
                        if(clipboard.selection) {
                            if(clipboard.selection.Count > 0) {
                                try {
                                    if(brw.list.Count > 0) {
                                        plman.InsertPlaylistItems(g_active_playlist, g_focus_id + 1, clipboard.selection);
                                    } else {
                                        plman.InsertPlaylistItems(g_active_playlist, 0, clipboard.selection);
                                    };
                                } catch(e) {
                                    console.log("WSH Panel Error: Clipboard can't be pasted, invalid clipboard content.");
                                };
                            };
                        };
                    };
                    if(vkey==70) { // CTRL+F
                        fb.RunMainMenuCommand("Edit/Search");
                    };
                    if(vkey==73) { // CTRL+I

                    };
                    if(vkey==78) { // CTRL+N
                        fb.RunMainMenuCommand("File/New playlist");
                    };
                    if(vkey==79) { // CTRL+O
                        fb.RunMainMenuCommand("File/Open...");
                    };
                    if(vkey==80) { // CTRL+P
                        fb.RunMainMenuCommand("File/Preferences");
                    };
                    if(vkey==83) { // CTRL+S
                        fb.RunMainMenuCommand("File/Save playlist...");
                    };
                    if(vkey==84) { // CTRL+T
                        properties.showHeaderBar = !properties.showHeaderBar;
                        window.SetProperty("_DISPLAY: Show Top Bar", properties.showHeaderBar);
                        get_metrics();
                        brw.scrollbar.updateScrollbar();
                        brw.repaint();
                    };
                    if(vkey == 48 || vkey == 96) { // CTRL+0
                        var previous = properties.globalFontAdjustement;
                        if(!timers.mouseWheel) {
                            properties.globalFontAdjustement = 0;
                            if(previous != properties.globalFontAdjustement) {
                                timers.mouseWheel = setTimeout(function() {
                                    window.SetProperty("MAINPANEL: Global Font Adjustement", properties.globalFontAdjustement);
                                    get_font();
									g_var_cache.resetAll();
                                    get_metrics();
                                    get_images();
                                    
                                    // refresh covers
                                    brw.refreshThumbnails();
                                    
                                    brw.repaint();
                                    timers.mouseWheel && clearTimeout(timers.mouseWheel);
                                    timers.mouseWheel = false;
                                }, 100);
                            };
                        };
                    };
                    break;
                case KMask.alt:
                    switch(vkey) {
                    case 65: // ALT+A
                        fb.RunMainMenuCommand("View/Always on Top");
                        break;
                    case VK_ALT: // ALT key alone
                        break;
                    };
                    break;
            };
         };

    };
};

function on_char(code) {
    // inputBox
    if(properties.showHeaderBar && properties.showFilterBox && g_filterbox.inputbox.visible) {
        g_filterbox.on_char(code);
    };
    
    if(cSettings.visible) {

    } else {
        if(g_filterbox.inputbox.edit) {
            //g_filterbox.on_char(code);
        } else { 
            if(brw.list.Count > 0) {
                brw.tt_x = ((brw.w) / 2) - (((cList.search_string.length*13)+(10*2)) / 2);
                brw.tt_y = brw.y + Math.floor((brw.h / 2) - 30);
                brw.tt_w = ((cList.search_string.length*13)+(10*2));
                brw.tt_h = 60;
                if(code==32 && cList.search_string.length==0) return true; // SPACE Char not allowed on 1st char
                if(cList.search_string.length <= 20 && brw.tt_w <= brw.w - 20) {
                    if (code > 31) {
                        cList.search_string = cList.search_string + String.fromCharCode(code).toUpperCase();
                        brw.repaint();
                        cList.clear_incsearch_timer && clearTimeout(cList.clear_incsearch_timer);
                        cList.clear_incsearch_timer = false;
                        cList.incsearch_timer && clearTimeout(cList.incsearch_timer);
                        cList.incsearch_timer = setTimeout(function () {
                            brw.incrementalSearch();
                            clearTimeout(cList.incsearch_timer);
                            cList.incsearch_timer = false;
                        }, 400);
                    };
                };
            };
        }; 
    };
};

//=================================================// Playback Callbacks
function on_playback_stop(reason) {
	if(window.IsVisible) {
		g_elapsed_seconds = null;
		g_time_remaining = null;
		g_total_seconds = null;
		g_metadb = null;
		
		switch(reason) {
		case 0: // user stop
		case 1: // eof (e.g. end of playlist)
			// update wallpaper
			if(properties.showwallpaper && properties.wallpapermode == 0) {
				g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, null);
			};
			brw.repaint();
			break;
		case 2: // starting_another (only called on user action, i.e. click on next button)
			break;
		};
		
		g_radio_title = "loading live tag ...";
		g_radio_artist = "";
	}	    
};

function on_playback_new_track(metadb) {
	try{
		playing_track_playcount = TF.play_count.Eval();
	} catch(e){}
	if(window.IsVisible){	
		g_metadb = metadb;
		g_radio_title = "loading live tag ...";
		g_radio_artist = "";
		if((properties.lockOnNowPlaying && plman.PlayingPlaylist!=g_active_playlist) || repopulate) {
			brw.populate(is_first_populate = true,6);
			repopulate = false;
		}
		if(properties.showwallpaper && properties.wallpapermode == 0) {
			old_cachekey = nowplaying_cachekey;
			nowplaying_cachekey = process_cachekey(metadb);
			if(old_cachekey!=nowplaying_cachekey) {
				g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, metadb);
			}		
		};		
		if(fb.CursorFollowPlayback && !(g_filterbox.inputbox.edit || g_filterbox.inputbox.length > 0)) {	
			brw.dontFlashNowPlaying=true;
			brw.showNowPlaying();
		}		
		g_total_seconds =  properties.tf_total_seconds.Eval(true); 
		g_time_remaining = "-"+g_total_seconds.toHHMMSS();
		g_elapsed_seconds = 0;
		brw.repaint();
	} else {
		set_update_function("on_playback_new_track(fb.GetNowPlaying())");
		g_total_seconds = null; 
		g_time_remaining = null;
		g_elapsed_seconds = 0;	
		if(properties.wallpapermode == 0) update_wallpaper = true;
	}
};

function on_playback_time(time) {
	if(window.IsVisible && plman.PlayingPlaylist==g_active_playlist){
		g_elapsed_seconds = time;
		if(g_total_seconds>0 && g_total_seconds!="ON AIR"){
			g_time_remaining = g_total_seconds - time; 
			g_time_remaining = "-"+g_time_remaining.toHHMMSS();						
		} else {
			g_time_remaining = properties.tf_time_remaining.Eval(true);
		}
		// radio Tags (live)
		if(g_metadb && g_metadb.Length < 0) {
			g_radio_title = TF.title.Eval(true);
			g_radio_artist = TF.radio_artist.Eval(true);
		} else if(!g_metadb) g_metadb = fb.GetNowPlaying();

		if(!cSettings.visible) {
			if(brw.nowplaying_y + properties.rowHeight > brw.y && brw.nowplaying_y < brw.y + brw.h) {
				brw.repaint();
			};
		};
	}
};
function on_playback_seek(time) {
	if(window.IsVisible){
		g_elapsed_seconds = time;
		if(g_total_seconds>0){
			g_time_remaining = g_total_seconds - time; 
			g_time_remaining = "-"+g_time_remaining.toHHMMSS();						
		} else {
			g_time_remaining = properties.tf_time_remaining.Eval(true);
		}
		brw.repaint();	
	}
}
//=================================================// Playlist Callbacks
function on_playlists_changed() {		
	if(!g_avoid_on_playlists_changed){	
		if(!(properties.lockOnNowPlaying || properties.lockOnPlaylistNamed!="") && window.IsVisible) {    
			if(plman.ActivePlaylist < 0 || plman.ActivePlaylist > plman.PlaylistCount - 1) {
				plman.ActivePlaylist = 0;
			};
			if(properties.DropInplaylist && pman.drop_done) {
				plman.ActivePlaylist = g_active_playlist;
			} else {
				if(g_active_playlist != plman.ActivePlaylist) {
					changed = setActivePlaylist();
					if(changed) brw.populate(is_first_populate = true,7);
				};
			};
		} else {
			set_update_function('on_playlists_changed();');		
			if(properties.DropInplaylist) pman.refresh_required = true;
		}	
	}
};

function on_playlist_switch() {  
	if(!callback_avoid_populate){
		if(!(properties.lockOnNowPlaying || properties.lockOnPlaylistNamed!="") && window.IsVisible) {    
			if(pman.drop_done) return;
			changed = setActivePlaylist();
			g_focus_id = getFocusId(g_active_playlist);
			g_filterbox.clearInputbox();
			if(changed) {
				callback_avoid_populate=true;
				brw.populate(is_first_populate = true,8);
			}
			brw.metadblist_selection = plman.GetPlaylistSelectedItems(g_active_playlist);
			
			// refresh playlists list
			if(properties.DropInplaylist) pman.populate(exclude_active = false, reset_scroll = false);
			if(properties.DropInplaylist) pman.populate(exclude_active = false);
			timers.callback_avoid_populate = setTimeout(function() {
				callback_avoid_populate=false;	
				clearTimeout(timers.callback_avoid_populate);		 
			}, 30);				
		} else set_update_function("on_playlist_switch()");	
	}
};
var callback_items_added=false;
var callback_items_removed=false;
var callback_avoid_populate=false
function on_playlist_items_added(playlist_idx) {
	if(!callback_avoid_populate){	
		if(playlist_idx == g_active_playlist && !pman.drop_done) {
			g_focus_id = getFocusId(g_active_playlist);
			callback_avoid_populate=true;
			if(window.IsVisible) brw.populate(is_first_populate = false,9);
			else set_update_function("brw.populate(false,9)");
			timers.callback_avoid_populate = setTimeout(function() {
				callback_avoid_populate=false;	
				clearTimeout(timers.callback_avoid_populate);		 
			}, 30);					
		};
	}
};

function on_playlist_items_removed(playlist_idx, new_count) {
	if(!callback_avoid_populate){			
		if(playlist_idx == g_active_playlist && new_count == 0) scroll = scroll_ = 0;
		if(playlist_idx == g_active_playlist) {
			g_focus_id = getFocusId(g_active_playlist);
			callback_avoid_populate=true;
			if(window.IsVisible) brw.populate(true,10, false);
			else set_update_function("brw.populate(true,10, false)");				
			timers.callback_avoid_populate = setTimeout(function() {
				callback_avoid_populate=false;	
				clearTimeout(timers.callback_avoid_populate);		 
			}, 30);						
		};
	}	
};

function on_playlist_items_reordered(playlist_idx) {  
	if(!callback_avoid_populate){	
		if(playlist_idx == g_active_playlist) {
			g_focus_id = getFocusId(g_active_playlist);
			callback_avoid_populate=true;
			if(window.IsVisible) brw.populate(true,11, false);
			else set_update_function("brw.populate(true,11, false)");	
			timers.callback_avoid_populate = setTimeout(function() {
				callback_avoid_populate=false;	
				clearTimeout(timers.callback_avoid_populate);		 
			}, 30);					
		};
	}
};


function on_item_focus_change(playlist, from, to) {
	if(window.IsVisible){
    if(!brw.list || !brw || !brw.list) return;
    
    var save_focus_id = g_focus_id;
    g_focus_id = to;
    
    if(!g_avoid_on_item_focus_change) {
        
        plman.SetActivePlaylistContext();
    
        if(playlist == g_active_playlist) {
            //
            plman.SetActivePlaylistContext();
            
            // Autocollapse handle
            if(properties.autocollapse) { // && !center_focus_item
                if(from > -1 && from < brw.list.Count) {
                    var old_focused_group_id = brw.getAlbumIdfromTrackId(from);
                } else {
                    var old_focused_group_id = -1;
                };
                if(to > -1 && to < brw.list.Count) {
                    var new_focused_group_id = brw.getAlbumIdfromTrackId(to);
                } else {
                    var old_focused_group_id = -1;
                };
                if(new_focused_group_id != old_focused_group_id) {
                    if(old_focused_group_id > -1) {
                        brw.groups[old_focused_group_id].collapsed = true;
                    };
                    if(new_focused_group_id > -1 && (!properties.expandBySingleClick)) {
                        brw.groups[new_focused_group_id].collapsed = false;
                    };
                    brw.setList();
                    brw.scrollbar.updateScrollbar();
                    if(brw.rowsCount > 0) brw.gettags(true);
                };
            }; 
            
            if(!g_rbtn_click) { // if new focused track not totally visible, we scroll to show it centered in the panel
                g_focus_row = brw.getOffsetFocusItem(g_focus_id);
                if(g_focus_row < scroll/properties.rowHeight || g_focus_row > scroll/properties.rowHeight + brw.totalRowsVis - 0.1) {
                    var old = scroll;
                    scroll = (g_focus_row - Math.floor(brw.totalRowsVis / 2)) * properties.rowHeight;
                    scroll = check_scroll(scroll);
                    if(!properties.enableFullScrollEffectOnFocusChange) {
                        if(Math.abs(scroll - scroll_) > properties.rowHeight * 5) {
                            if(scroll_ > scroll) {
                                scroll_ = scroll + properties.rowHeight * 5;
                            } else {
                                scroll_ = scroll - properties.rowHeight * 5;
                            };
                        };
                    };
                    /*
                    if(!properties.enableFullScrollEffectOnFocusChange && !properties.autocollapse) {
                        scroll_ = scroll + properties.rowHeight * 5 * (from <= to ? -1 : 1);
                        scroll_ = check_scroll(scroll_);
                    };
                    */
                    brw.scrollbar.updateScrollbar();
                };
            };

            brw.metadblist_selection = plman.GetPlaylistSelectedItems(g_active_playlist);
            if(!isScrolling) brw.repaint();
        };
    };
	}
};

function on_metadb_changed(metadbs, fromhook) {
    if(!brw.list) return;
	playing_track_new_count = parseInt(playing_track_playcount,10)+1
	try {
		if(fb.IsPlaying && metadbs.Count==1 && metadbs[0].RawPath==fb.GetNowPlaying().RawPath && TF.play_count.Eval()==(playing_track_new_count)) {	
			playing_track_playcount = playing_track_new_count;		
			return;
		} 
	} catch(e){
		console.log("ERROR:on_metadb_changed, WSHsmoothplaylist try/catch");
	}

    if(window.IsVisible){	
		// rebuild list
		if(g_rating_updated) { // no repopulate if tag update is from rating click action in playlist
			g_rating_updated = false;
			// update track tags info to avoid a full populate
			if(g_rating_rowId > -1) {
				brw.rows[g_rating_rowId].infosraw = properties.tf_track.EvalWithMetadb(brw.rows[g_rating_rowId].metadb);
				brw.rows[g_rating_rowId].infos = brw.rows[g_rating_rowId].infosraw.split(" ^^ ");
				g_rating_rowId = -1;
				window.Repaint();
			};			
		} else {
			if(!(metadbs.Count == 1 && metadbs[0].Length < 0)) {
				if(filter_text.length > 0) {
					g_focus_id = 0;
					brw.populate(is_first_populate = true,13, false);
					if(brw.rowsCount > 0) {
						var new_focus_id = brw.rows[0].playlistTrackId;
						plman.ClearPlaylistSelection(g_active_playlist);
						plman.SetPlaylistSelectionSingle(g_active_playlist, new_focus_id, true);
						plman.SetPlaylistFocusItem(g_active_playlist, new_focus_id);
					};
				} else {
					brw.populate(is_first_populate = false,14, false);
				};
			};
		};
	} else {
		if(g_rating_updated) { // no repopulate if tag update is from rating click action in playlist
			g_rating_updated = false;
			// update track tags info to avoid a full populate
			if(g_rating_rowId > -1) {
				brw.rows[g_rating_rowId].infosraw = properties.tf_track.EvalWithMetadb(brw.rows[g_rating_rowId].metadb);
				brw.rows[g_rating_rowId].infos = brw.rows[g_rating_rowId].infosraw.split(" ^^ ");
				g_rating_rowId = -1;
				window.Repaint();
			};			
		} else {		
			set_update_function("brw.populate(false,14, false);");
		}
	}
};

function on_playlist_items_selection_change() {
    if(window.IsVisible) {
		brw.set_selected_items();
		window.Repaint();
	}
};

function on_focus(is_focused) {   
    g_focus = is_focused;
    if(!is_focused && g_filterbox.inputbox.edit) {
		g_filterbox.inputbox.on_focus(is_focused)
        window.Repaint();
    };
};

//=================================================// Custom functions
function checkMediaLibrayPlaylist() {
    g_avoid_on_playlists_changed = true;
    
    // check if library playlist is present
    var isMediaLibraryFound = false;
    var total = plman.PlaylistCount;
    for (var i = 0; i < total; i++) {
        if(plman.GetPlaylistName(i) == "Media Library") {
            var mediaLibraryIndex = i;
            isMediaLibraryFound = true;
            break;
        };
    };
    if(!isMediaLibraryFound) {
        // create Media Library playlist (sort forced)
        // > sort: sort string expression.
        // > flags: 1 - always sort.
        // > boolean CreateAutoPlaylist(idx, name, query, sort = "", flags = 0);
        plman.CreateAutoPlaylist(total, "Media Library", "%path% PRESENT", "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 1);
        //plman.CreateAutoPlaylist(total, "Media Library", "%album% PRESENT", "%album artist% | %date% | %album% | %discnumber% | %tracknumber% | %title%", 1);
        // Move it to the top
        plman.MovePlaylist(total, 0);
    } else if(mediaLibraryIndex > 0) {
        // Always move it to the top
        plman.MovePlaylist(mediaLibraryIndex, 0);
    };
    
    g_avoid_on_playlists_changed = false;
};

function check_scroll(scroll___){
    if(scroll___ < 0)
        scroll___ = 0;
    var g1 = brw.h - (brw.totalRowsVis * properties.rowHeight);
    //var scroll_step = Math.ceil(properties.rowHeight / properties.scroll_divider);
    //var g2 = Math.floor(g1 / scroll_step) * scroll_step;
	
    var end_limit = ((brw.rowsCount+properties.addedRows_end) * properties.rowHeight) - (brw.totalRowsVis * properties.rowHeight) - g1+brw.PaddingTop*2+properties.margin_bottom;
    if(scroll___ != 0 && scroll___ > end_limit) {
        scroll___ = end_limit;
    };
    return scroll___;
};

function getFocusId(playlistIndex) {
    return plman.GetPlaylistFocusItemIndex(playlistIndex);
};



function g_sendResponse() {

	if(g_filterbox.inputbox.text.length == 0) {
        filter_text = "";
    } else {
	    filter_text = g_filterbox.inputbox.text;
    };
       
    // filter in current panel
    g_focus_id = 0;
    brw.populate(true,15);
    if(brw.rowsCount > 0) {
        var new_focus_id = brw.rows[0].playlistTrackId;
        plman.ClearPlaylistSelection(g_active_playlist);
        plman.SetPlaylistSelectionSingle(g_active_playlist, new_focus_id, true);
        plman.SetPlaylistFocusItem(g_active_playlist, new_focus_id);
    };
};
function stopFlashNowPlaying() {
	cNowPlaying.flashEnable = false;
	cNowPlaying.flashescounter = 0;
	cNowPlaying.flash = false;	
}
function on_notify_data(name, info) {
    switch(name) {
		case "set_font":
			properties.globalFontAdjustement = info;
			window.SetProperty("MAINPANEL: Global Font Adjustement", properties.globalFontAdjustement),
			on_font_changed();
		break; 	
		case "enable_screensaver":		
			globalProperties.enable_screensaver = info;
			window.SetProperty("GLOBAL enable screensaver", globalProperties.enable_screensaver);	
		break;		
        case "FocusOnNowPlayingForce":		
        case "FocusOnNowPlaying":
			if(window.IsVisible) {
				brw.showNowPlaying();
			}
            break;
		case"stopFlashNowPlaying":
			stopFlashNowPlaying();
			brw.repaint();
		break;  
		case "rating_updated": 		
			g_rating_updated=true;
			if(properties.showRating){
				if(window.IsVisible && !timers.ratingUpdate){
					timers.ratingUpdate = setTimeout(function(){
						brw.setList();
						brw.gettags(true);
						brw.repaint();
						clearTimeout(timers.ratingUpdate);
						timers.ratingUpdate=false;
					}, 300); 
				} else set_update_function("brw.setList();brw.gettags(true);brw.repaint();");
			}
		break;		
		case"DiskCacheState":
			globalProperties.enableDiskCache = info;
			window.SetProperty("COVER Disk Cache", globalProperties.enableDiskCache);
			brw.repaint();
		break;  	
		case"RefreshImageCover":
			brw.refreshThumbnails();
			brw.repaint();
		break; 			
		case"LoadAllCoversState":
			globalProperties.load_covers_at_startup = info;
			window.SetProperty("COVER Load all at startup", globalProperties.load_covers_at_startup);	
		break; 
		case"LoadAllArtistImgState":
			globalProperties.load_artist_img_at_startup = info;
			window.SetProperty("ARTIST IMG Load all at startup", globalProperties.load_artist_img_at_startup);	
		break; 		
		case "avoid_on_playlists_changed":  
			g_avoid_on_playlists_changed=info;
		break;			
		case "rePopulate": 
			if(window.IsVisible){
				brw.populate(true,16);
			} else {set_update_function("brw.populate(true,16)");}
		break;		
		case "playlists_dark_theme":
			if(properties.ParentName=="MainPanel"){
				properties.playlists_dark_theme=info;
				window.SetProperty("PLAYLISTS dark theme", properties.playlists_dark_theme);
				on_colours_changed();				
				//if(properties.darklayout) g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.IsPlaying ? fb.GetNowPlaying() : null);
				window.Repaint();
			}	
		break; 			
		case "minimode_dark_theme":
			if(properties.ParentName=="MiniPanel") {
				properties.minimode_dark_theme = info;
				window.SetProperty("MINIMODE dark theme", properties.minimode_dark_theme);
				on_colours_changed();				
				//if(properties.darklayout) g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.IsPlaying ? fb.GetNowPlaying() : null);
				window.Repaint();
			}
		break; 
		case "bio_dark_theme":
			if(properties.ParentName=="MainPanel") {
				properties.bio_dark_theme=info;
				window.SetProperty("BIO dark theme", properties.bio_dark_theme);
				on_colours_changed();
				window.Repaint();	
			}			
		break;	    
		case "visualization_dark_theme":
			if(properties.ParentName=="MainPanel") {		
				properties.visualization_dark_theme=info;
				window.SetProperty("VISUALIZATION dark theme", properties.visualization_dark_theme);
				on_colours_changed();
				window.Repaint();		
			}
		break;	
		case "library_dark_theme":
			if(properties.ParentName=="MainPanel") {		
				properties.library_dark_theme=info;
				window.SetProperty("LIBRARY dark theme", properties.library_dark_theme);
				on_colours_changed();
				window.Repaint();
			}	
		break;	
		case "bio_stick_to_dark_theme":
			properties.bio_stick2darklayout=info;
			window.SetProperty("BIO stick to Dark layout", properties.bio_stick2darklayout);
			on_colours_changed();
			window.Repaint();		
		break;			
		case "wallpaperVisibility":
			if(window.IsVisible) toggleWallpaper(info);
		break; 	
		case "wallpaperBlur":
			if(window.IsVisible) toggleBlurWallpaper(info);
		break; 		
		case "wallpaperVisibility2":
			if(window.IsVisible) {
				properties.showwallpaper = info;
				window.SetProperty("_DISPLAY: Show Wallpaper", properties.showwallpaper);
				on_colours_changed();					
				if(properties.showwallpaper) {
					g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.IsPlaying ? fb.GetNowPlaying() : null);
					if(properties.darklayout) window.NotifyOthers("minimode_dark_theme", true);
				} else window.NotifyOthers("minimode_dark_theme", false);
				window.Repaint();			
			}
		break; 		
		case "wallpaperBlur2":
			if(window.IsVisible) {	
				properties.wallpaperblurred = info;
				on_colours_changed();		
				window.SetProperty("_DISPLAY: Wallpaper Blurred", properties.wallpaperblurred);
				if(fb.IsPlaying) g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
				window.Repaint();			
			}
		break; 		
		case "layout_state":  
			layout_state.value=info;
			if(layout_state.isEqual(0) && window.IsVisible) window.NotifyOthers("playlist_height",window.Height);		
			if(layout_state.isEqual(1) && g_active_playlist==plman.PlayingPlaylist){
				if(g_active_playlist==plman.PlayingPlaylist) brw.showNowPlaying_trigger = true;
				brw.showNowPlaying(false);
			}
		break;
		case "main_panel_state":  
			main_panel_state.value = info;
			if(properties.enableAutoSwitchPlaylistMode){
				var old_properties_lockOnNowPlaying = properties.lockOnNowPlaying;
				if(main_panel_state.isEqual(1)){
					if(filters_panel_state.isMaximumValue()) properties.lockOnNowPlaying=false;
					else properties.lockOnNowPlaying=true;	
					properties.lockOnPlaylistNamed="";				
				} else if(properties.lockOnNowPlaying!=true){
					properties.lockOnNowPlaying=true;	
					properties.lockOnPlaylistNamed="";									
				}		
				if(old_properties_lockOnNowPlaying != properties.lockOnNowPlaying){
					window.SetProperty("lock on specific playlist name", "");
					window.SetProperty("lock on now playing playlist", properties.lockOnNowPlaying);
					brw.populate(true,17);					
				}					
			}			
			if(properties.ParentName=="MainPanel") {
				on_colours_changed();
			}
		break;		
		case "nowplayinglib_state":
			nowplayinglib_state.value=info;
		break; 
		case "nowplayingplaylist_state":
			nowplayingplaylist_state.value=info;
		break; 
		case "nowplayingbio_state":
			nowplayingbio_state.value=info;
		break; 
		case "nowplayingvisu_state":
			nowplayingvisu_state.value=info;
		break; 				
		case "filters_panel_state":   
			filters_panel_state.value=info;
			if(properties.enableAutoSwitchPlaylistMode){
				var old_properties_lockOnNowPlaying = properties.lockOnNowPlaying;
				if(filters_panel_state.isMaximumValue()) properties.lockOnNowPlaying=false;
				else properties.lockOnNowPlaying=true;	
				properties.lockOnPlaylistNamed="";	
				if(old_properties_lockOnNowPlaying != properties.lockOnNowPlaying){
					window.SetProperty("lock on specific playlist name", "");
					window.SetProperty("lock on now playing playlist", properties.lockOnNowPlaying);
					brw.populate(true,17);
				}				
			}		
		break;			
		case "lockOnNowPlaying":  
			properties.lockOnNowPlaying=info;
			window.SetProperty("lock on now playing playlist", properties.lockOnNowPlaying);	
			properties.lockOnPlaylistNamed="";
			window.SetProperty("lock on specific playlist name", "");				
			brw.populate(true,17);
		break;	
		case "lockOnSpecificPlaylist":  
			properties.lockOnPlaylistNamed=info;
			window.SetProperty("lock on specific playlist name", properties.lockOnPlaylistNamed);	
			brw.populate(true,17);
		break;			
		case "showGroupHeaders":
			properties.showGroupHeaders = !properties.showGroupHeaders;
			window.SetProperty("_DISPLAY: Show Group Headers", properties.showGroupHeaders);
			get_metrics();
			if(properties.autocollapse) {
				properties.autocollapse = false;
				window.SetProperty("_PROPERTY: Autocollapse groups", properties.autocollapse);
			}				
			if(!properties.showGroupHeaders) brw.collapseAll(false);
			brw.populate(is_first_populate = false,18);
			window.Repaint();
			break;
		case "doubletrackline":
			properties.doubleRowText = !properties.doubleRowText;
			window.SetProperty("_PROPERTY: Double Row Text Info", properties.doubleRowText);
			get_metrics();
			window.Repaint();
			break;					
		case "autocollapse":
			if(properties.showGroupHeaders) {
				properties.autocollapse = !properties.autocollapse;
				window.SetProperty("_PROPERTY: Autocollapse groups", properties.autocollapse);
				brw.populate(false,19);
				brw.showFocusedItem();
			}
			break;									
		case "collapseAll":
			brw.collapseAll(info);
			brw.showFocusedItem();
			break;	
		case "cover_cache_finalized": 
			g_image_cache._cachelist = cloneImgs(info);
			//console.log("smoothplaylist image_cache size: "+info.length);
			window.Repaint();
		break;	
		case "WSH_panels_reload":
			window.Reload();
		break; 			
    };
};

//=================================================// Drag'n'Drop Callbacks
function on_drag_enter() {
    g_dragndrop_status = true;
    g_dragndrop_drop_forbidden = false;
};

function on_drag_leave() {
	g_resizing.on_mouse("lbtn_up", 0, 0, null);	
    g_dragndrop_status = false;
    g_dragndrop_trackId = -1;
    g_dragndrop_rowId = -1;
	g_dragndrop_bottom = false;
    brw.buttonclicked = false;
    cScrollBar.timerID && window.ClearInterval(cScrollBar.timerID);
    cScrollBar.timerID = false;
	cScrollBar.timerID1 && window.ClearInterval(cScrollBar.timerID1);
	cScrollBar.timerID1 = false;		
    if(g_dragndrop_drop_forbidden) {
		fb.ShowPopupMessage("The current playlist is an autoplaylist: you can't reorder tracks in an autoplaylist.", "Error");
        g_dragndrop_drop_forbidden = false;
        window.Repaint();
    };
};

function on_drag_over(action, x, y, mask) {
    
    if(x == g_dragndrop_x && y == g_dragndrop_y) return true;

    if(g_active_playlist >=0 && plman.IsAutoPlaylist(g_active_playlist)) {
        g_dragndrop_drop_forbidden = true;
        window.Repaint();
        return true;
    };
	if(properties.DropInplaylist && pman.state == 1) {
		pman.on_mouse("move", x, y);
		try{
			action.Text = "Insert";
		} catch(e){}	
		return;
	}
    g_dragndrop_trackId = -1;
    g_dragndrop_rowId = -1;
    g_dragndrop_targetPlaylistId = -1;
    g_dragndrop_bottom = false;
    brw.on_mouse("drag_over", x, y);
	try{
		if(brw.drag_tracks) action.Text = "Move";
		else action.Text = "Insert";
	} catch(e){}
	if(scroll > 0 && y < brw.y + ((properties.doubleRowText)?properties.rowHeight:properties.rowHeight*2)) {
		if(!brw.buttonclicked) {
			brw.buttonclicked = true;
			if(!cScrollBar.timerID1) {
				cScrollBar.timerID1 = setInterval(function () {
					on_mouse_wheel(1);
					if(scroll <= 0) {
						window.ClearInterval(cScrollBar.timerID1);
						cScrollBar.timerID1 = false;
						brw.buttonclicked = false;
						if(!dragndrop.timerID) {
							dragndrop.timerID = setTimeout(function() {
								brw.on_mouse("drag_over", g_dragndrop_x, g_dragndrop_y);
								window.Repaint();
								dragndrop.timerID && clearTimeout(dragndrop.timerID);
								dragndrop.timerID = false;
							}, 75);
						};
					};
				}, properties.drag_scroll_speed_ms);
			}
		} else {
			window.Repaint();
		} 
	} else if(y > brw.y + brw.h - ((properties.doubleRowText)?properties.rowHeight:properties.rowHeight*2)) {
		if(!brw.buttonclicked) {
			brw.buttonclicked = true;
			//
			//
			if(!cScrollBar.timerID) {
				cScrollBar.timerID = setInterval(function () {
					on_mouse_wheel(-1);
					if(scroll >= ((brw.totalRows - brw.totalRowVisible) * properties.rowHeight)) {
						window.ClearInterval(cScrollBar.timerID);
						cScrollBar.timerID = false;
						brw.buttonclicked = false;
						if(!dragndrop.timerID) {
							dragndrop.timerID = setTimeout(function() {
								brw.on_mouse("drag_over", g_dragndrop_x, g_dragndrop_y);
								//window.Repaint();
								window.Repaint();
								dragndrop.timerID && clearTimeout(dragndrop.timerID);
								dragndrop.timerID = false;
							}, 75);
						};
					};
				}, properties.drag_scroll_speed_ms);
			};
		} else {
			window.Repaint();
		};
	} else {
		cScrollBar.timerID1 && window.ClearInterval(cScrollBar.timerID1);
		cScrollBar.timerID1 = false;			
		cScrollBar.timerID && window.ClearInterval(cScrollBar.timerID);
		cScrollBar.timerID = false;
		brw.buttonclicked = false;
		if(!dragndrop.timerID) {
			dragndrop.timerID = setTimeout(function() {
				window.Repaint();
				dragndrop.timerID && clearTimeout(dragndrop.timerID);
				dragndrop.timerID = false;
			}, 75);
		};
	};
    
	window.Repaint();
    
    g_dragndrop_x = x;
    g_dragndrop_y = y;
};

function on_drag_drop(action, x, y, mask) {
    if(brw.drag_tracks) {
		action.Effect = 0;
		on_mouse_lbtn_up(x, y);	
		return;
	}
	if(pman.state == 1) {
		action.Effect = 0;
		pman.on_mouse("up", x, y);
		return;
	} 
    if(g_active_playlist >=0 && plman.IsAutoPlaylist(g_active_playlist)) {
		if(g_dragndrop_drop_forbidden) fb.ShowPopupMessage("The current playlist is an autoplaylist: you can't manually add a track to an autoplaylist.", "Error");		
        g_dragndrop_drop_forbidden = false;
		action.Effect = 0;
        g_dragndrop_hover_playlistManager = false;
        window.Repaint();
        return true;
    };

	if(g_dragndrop_rowId<0 || g_dragndrop_trackId<0) return true;
	
    g_dragndrop_total_before = brw.list.Count;
    brw.buttonclicked = false;
    cScrollBar.timerID && window.ClearInterval(cScrollBar.timerID);
    cScrollBar.timerID = false;
    g_dragndrop_status = false;
    
    // We are going to process the dropped items to a playlist
    var total_pl = plman.PlaylistCount;
	
	//Si on est en mode focus now playing
	if(g_active_playlist<0) {
		if(properties.lockOnNowPlaying){
			toPlaylistIdx = getPlaybackPlaylist();
			if(toPlaylistIdx<0){
				plman.CreatePlaylist(0, globalProperties.playing_playlist);
				toPlaylistIdx=0;
			} else plman.ClearPlaylist(toPlaylistIdx);
		} else {
			toPlaylistIdx = findSelectionPlaylist();
			if(toPlaylistIdx<0){
				plman.CreatePlaylist(0, globalProperties.selection_playlist);
				toPlaylistIdx=0;
			} else plman.ClearPlaylist(toPlaylistIdx);			
		}
		if(properties.lockOnNowPlaying) {
			window.NotifyOthers("nowPlayingTrack",true);
			plman.PlayingPlaylist = toPlaylistIdx;
			//fb.Stop();fb.Play();
			//plman.ActivePlaylist = toPlaylistIdx;
		} else plman.ActivePlaylist = toPlaylistIdx;
        action.Effect = 1;
        action.Playlist = toPlaylistIdx;
		action.ToSelect = false;		
		g_dragndrop_timer = setTimeout(function(){
			if(properties.lockOnNowPlaying) {
				plman.ExecutePlaylistDefaultAction(toPlaylistIdx, 0);
				fb.Stop();fb.Play();
			}
			g_dragndrop_trackId = -1;
			g_dragndrop_rowId = -1;
			clearTimeout(g_dragndrop_timer);
			g_dragndrop_timer = false;
			window.Repaint();
        },50);		
	} else if(total_pl < 1) {
        plman.CreatePlaylist(0, "Dropped Items");
        plman.ActivePlaylist = 0;
        action.Effect = 1;
        action.Playlist = plman.ActivePlaylist;
        action.ToSelect = false;
		g_dragndrop_trackId = -1;
		g_dragndrop_rowId = -1;		
    } else {
        if(g_dragndrop_bottom) {
            plman.ClearPlaylistSelection(g_active_playlist);
            action.Effect = 1;
			action.Playlist = g_active_playlist;
            action.ToSelect = false;
			g_avoid_playlist_displayed_switch = true;
			action.Base = g_dragndrop_total_before;
            g_dragndrop_timer && clearTimeout(g_dragndrop_timer);
            g_dragndrop_timer = setTimeout(function(){
                plman.SetPlaylistFocusItem(g_active_playlist, g_dragndrop_total_before);
                //brw.showFocusedItem();
                //full_repaint();
                g_dragndrop_trackId = -1;
                g_dragndrop_rowId = -1;
                clearTimeout(g_dragndrop_timer);
                g_dragndrop_timer = false;
				window.Repaint();
            },75);
        } else {
			if(brw.rows[g_dragndrop_rowId].type!=99){
				g_avoid_on_playlist_items_added = true;
				g_avoid_on_playlist_items_reordered = true;
			
				plman.ClearPlaylistSelection(g_active_playlist);
				action.Effect = 1;
				action.Playlist = g_active_playlist;
				action.ToSelect = false;
				g_avoid_playlist_displayed_switch = true;				
				action.Base = g_dragndrop_trackId;
				g_dragndrop_timer && clearTimeout(g_dragndrop_timer);
				g_dragndrop_timer = setTimeout(function(){
					var delta = (g_dragndrop_total_before - g_dragndrop_trackId) * -1;
					//plman.MovePlaylistSelection(g_active_playlist, delta);
					//plman.SetPlaylistFocusItem(g_active_playlist, g_dragndrop_trackId);
					//brw.showFocusedItem();
					g_dragndrop_trackId = -1;
					g_dragndrop_rowId = -1;
					g_avoid_on_playlist_items_added = false;
					g_avoid_on_playlist_items_reordered = false;
					clearTimeout(g_dragndrop_timer);
					g_dragndrop_timer = false;
					window.Repaint();
				},75);
			}
        };
    };
    g_dragndrop_bottom = false;
    g_dragndrop_drop_forbidden = false;
    g_dragndrop_hover_playlistManager = false;
	brw.drag_tracks = false;	
    window.Repaint();
};

function toggleWallpaper(wallpaper_state){
	wallpaper_state = typeof wallpaper_state !== 'undefined' ? wallpaper_state : !properties.showwallpaper;	
	properties.showwallpaper = wallpaper_state;
	window.SetProperty("_DISPLAY: Show Wallpaper", properties.showwallpaper);
	on_colours_changed();					
	if(properties.showwallpaper) {
		g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.IsPlaying ? fb.GetNowPlaying() : null);
		//if(properties.darklayout) window.NotifyOthers("minimode_dark_theme", true);
	} //else window.NotifyOthers("minimode_dark_theme", false);
	window.Repaint();
}
function toggleBlurWallpaper(wallpaper_blur_state){
	wallpaper_blur_state = typeof wallpaper_blur_state !== 'undefined' ? wallpaper_blur_state : !properties.wallpaperblurred;	
	properties.wallpaperblurred = wallpaper_blur_state; on_colours_changed();		
	window.SetProperty("_DISPLAY: Wallpaper Blurred", properties.wallpaperblurred);
	if(fb.IsPlaying) g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
	window.Repaint();
}
function on_init() {
    window.DlgCode = 0x0004;
	
    properties.darklayout = setDarkLayout();
    get_font();
    get_colors();
    get_metrics();
	
    g_filterbox = new oFilterBox();
    g_filterbox.inputbox.visible = true;	
	
	get_images();
	
	g_image_cache = new oImageCache();
	g_var_cache = new var_cache;
	
	g_resizing = new Resizing();
	g_cursor = new oCursor();	
	g_tooltip = new oTooltip();
	setActivePlaylist()
    g_focus_id = getFocusId(g_active_playlist);

    brw = new oBrowser("brw");
	brw.startTimer();	
    pman = new oPlaylistManager("pman");
	
    if(fb.IsPlaying) playing_track_playcount = TF.play_count.Eval();		
};
on_init();