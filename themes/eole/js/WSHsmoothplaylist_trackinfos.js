var properties_big = {
    ParentName:  window.GetProperty("BIG:ParentName", "MainPanel"),
    lockOnNowPlaying: window.GetProperty("BIG:lockOnNowPlaying", true),
    lockOnPlaylistNamed: window.GetProperty("BIG:lockOnPlaylistNamed", ""),
    FollowNowPlaying: window.GetProperty("BIG:FollowNowPlaying", true),
    defaultRowHeight: window.GetProperty("BIG:defaultRowHeight", 30),
    drawAlternateBG: window.GetProperty("BIG:drawAlternateBG", false),
    extraRowsNumber: window.GetProperty("BIG:extraRowsNumber", 1),
    minimumRowsNumberPerGroup: window.GetProperty("BIG:minimumRowsNumberPerGroup", 0),
    groupHeaderRowsNumber: window.GetProperty("BIG:groupHeaderRowsNumber", 2),
    groupHeaderRowsNumberDouble: window.GetProperty("BIG:groupHeaderRowsNumberDouble", 1),
    showHeaderBar: window.GetProperty("BIG:showHeaderBar", true),
    showHeaderBarTrackInfosOn: window.GetProperty("BIG:showHeaderBarTrackInfosOn", true),
    showHeaderBarTrackInfosOff: window.GetProperty("BIG:showHeaderBarTrackInfosOff", true),
	showToolTip: window.GetProperty("BIG:showToolTip", true),
	darklayout: window.GetProperty("BIG:darklayout", false),
    expandBySingleClick: window.GetProperty("BIG:expandBySingleClick", true),
    minimode_dark_theme: window.GetProperty("BIG:minimode_dark_theme", true),
    library_dark_theme: window.GetProperty("BIG:library_dark_theme", false),
    playlists_dark_theme: window.GetProperty("BIG:playlists_dark_theme", false),
    bio_dark_theme: window.GetProperty("BIG:bio_dark_theme", false),
	bio_stick2darklayout: window.GetProperty("BIG:bio_stick2darklayout",true),
    visualization_dark_theme: window.GetProperty("BIG:visualization_dark_theme", false),
    showwallpaper: window.GetProperty("BIG:showwallpaper", false),
    wallpaperblurred: window.GetProperty("BIG:wallpaperblurred", true),
    wallpaperblurvalue: window.GetProperty("BIG:wallpaperblurvalue", 1.05),
    wallpapermode: window.GetProperty("BIG:wallpapermode", 0),
    wallpaperdisplay: window.GetProperty("BIG:wallpaperdisplay", 0),
    defaultPlaylistItemAction: window.GetProperty("BIG:defaultPlaylistItemAction", "Play"), //"Add to playback queue"
    showFilterBox: window.GetProperty("BIG:showFilterBox", true),
    doubleRowText: window.GetProperty("BIG:doubleRowText", true),
    doubleRowShowCover: window.GetProperty("BIG:doubleRowShowCover", true),
    showArtistAlways: window.GetProperty("BIG:showArtistAlways", true),
    showPlaycount: window.GetProperty("BIG:showPlaycount", false),
    showBitrate: window.GetProperty("BIG:showBitrate", false),
    showCodec: window.GetProperty("BIG:showCodec", false),
    showRating: window.GetProperty("BIG:showRating", true),
    showRatingSelected: window.GetProperty("BIG:showRatingSelected", true),
    showRatingRated: window.GetProperty("BIG:showRatingRated", true),
    drawUpAndDownScrollbar: window.GetProperty("BIG:drawUpAndDownScrollbar", false),
    showMood: window.GetProperty("BIG:showMood", false),
    drawProgressBar: window.GetProperty("BIG:drawProgressBar", true),
    AlbumArtProgressbar: window.GetProperty("BIG:AlbumArtProgressbar", true),
    enableTouchControl: window.GetProperty("BIG:enableTouchControl", false),
    DropInplaylist: window.GetProperty("BIG:DropInplaylist", false),
    thumbnailWidthMin: window.GetProperty("BIG:thumbnailWidthMin", 50),
    thumbnailWidth: window.GetProperty("BIG:thumbnailWidth", 75),
	circleMode: window.GetProperty("BIG:circleMode", false),
	showSettingsMenu: window.GetProperty("BIG:showSettingsMenu", true),
	enableAutoSwitchPlaylistMode: window.GetProperty("BIG:enableAutoSwitchPlaylistMode", true),
	displayActiveOnPlaybackStopped: window.GetProperty("BIG:displayActiveOnPlaybackStopped", false),
    showGroupHeaders: window.GetProperty("BIG:showGroupHeaders", true),
    autocollapse: window.GetProperty("BIG:autocollapse", false),
    addedRows_end_default: window.GetProperty("BIG:addedRows_end_default", 1),
};

var properties_mini = {
    ParentName:  window.GetProperty("MINI:ParentName", "MiniPanel"),
    lockOnNowPlaying: window.GetProperty("MINI:lockOnNowPlaying", false),
    lockOnPlaylistNamed: window.GetProperty("MINI:lockOnPlaylistNamed", ""),
    FollowNowPlaying: window.GetProperty("MINI:FollowNowPlaying", true),
    defaultRowHeight: window.GetProperty("MINI:defaultRowHeight", 26),
    drawAlternateBG: window.GetProperty("MINI:drawAlternateBG", false),
    extraRowsNumber: window.GetProperty("MINI:extraRowsNumber", 1),
    minimumRowsNumberPerGroup: window.GetProperty("MINI:minimumRowsNumberPerGroup", 0),
    groupHeaderRowsNumber: window.GetProperty("MINI:groupHeaderRowsNumber", 2),
    groupHeaderRowsNumberDouble: window.GetProperty("MINI:groupHeaderRowsNumberDouble", 1),
    showHeaderBar: window.GetProperty("MINI:showHeaderBar", false),
    showHeaderBarTrackInfosOn: window.GetProperty("MINI:showHeaderBarTrackInfosOn", true),
    showHeaderBarTrackInfosOff: window.GetProperty("MINI:showHeaderBarTrackInfosOff", true),
	showToolTip: window.GetProperty("MINI:showToolTip", true),
    expandBySingleClick: window.GetProperty("MINI:expandBySingleClick", true),
	darklayout: window.GetProperty("MINI:darklayout", true),
    minimode_dark_theme: window.GetProperty("MINI:minimode_dark_theme", true),
    library_dark_theme: window.GetProperty("MINI:library_dark_theme", false),
    playlists_dark_theme: window.GetProperty("MINI:playlists_dark_theme", false),
    bio_dark_theme: window.GetProperty("MINI:bio_dark_theme", false),
	bio_stick2darklayout: window.GetProperty("MINI:bio_stick2darklayout",false),
    visualization_dark_theme: window.GetProperty("MINI:visualization_dark_theme", false),
    showwallpaper: window.GetProperty("MINI:showwallpaper", false),
    wallpaperblurred: window.GetProperty("MINI:wallpaperblurred", true),
    wallpaperblurvalue: window.GetProperty("MINI:wallpaperblurvalue", 1.05),
    wallpapermode: window.GetProperty("MINI:wallpapermode", 0),
    wallpaperdisplay: window.GetProperty("MINI:wallpaperdisplay", 0),
    defaultPlaylistItemAction: window.GetProperty("MINI:defaultPlaylistItemAction", "Play"), //"Add to playback queue"
    showFilterBox: window.GetProperty("MINI:showFilterBox", true),
    doubleRowText: window.GetProperty("MINI:doubleRowText", true),
    doubleRowShowCover: window.GetProperty("MINI:doubleRowShowCover", true),
    showArtistAlways: window.GetProperty("MINI:showArtistAlways", true),
    showPlaycount: window.GetProperty("BIG:showPlaycount", false),
    showBitrate: window.GetProperty("BIG:showBitrate", false),
    showCodec: window.GetProperty("BIG:showCodec", false),
    showRating: window.GetProperty("MINI:showRating", true),
    showRatingSelected: window.GetProperty("MINI:showRatingSelected", true),
    showRatingRated: window.GetProperty("MINI:showRatingRated", true),
    drawUpAndDownScrollbar: window.GetProperty("MINI:drawUpAndDownScrollbar", false),
    showMood: window.GetProperty("MINI:showMood", false),
    drawProgressBar: window.GetProperty("MINI:drawProgressBar", true),
    AlbumArtProgressbar: window.GetProperty("MINI:AlbumArtProgressbar", true),
    enableTouchControl: window.GetProperty("MINI:enableTouchControl", false),
    DropInplaylist: window.GetProperty("MINI:DropInplaylist", true),
    thumbnailWidthMin: window.GetProperty("MINI:thumbnailWidthMin", 50),
    thumbnailWidth: window.GetProperty("MINI:thumbnailWidth", 75),
	circleMode: window.GetProperty("MINI:circleMode", false),
	showSettingsMenu: window.GetProperty("MINI:showSettingsMenu", true),
	enableAutoSwitchPlaylistMode: window.GetProperty("MINI:enableAutoSwitchPlaylistMode", false),
	displayActiveOnPlaybackStopped: window.GetProperty("MINI:displayActiveOnPlaybackStopped", true),
    showGroupHeaders: window.GetProperty("MINI:showGroupHeaders", false),
    autocollapse: window.GetProperty("MINI:autocollapse", false),
    addedRows_end_default: window.GetProperty("MINI:addedRows_end_default", 2),
};
var properties_common = {
	panelName: 'WSHsmoothplaylist',
    tf_artist: fb.TitleFormat("%artist%"),
    tf_albumartist: fb.TitleFormat("%album artist%"),
    tf_groupkey: fb.TitleFormat("$if2(%album%$ifgreater(%totaldiscs%,1,[' - Disc '%discnumber%],),$if(%length%,'?',%path%)) ^^ $if2(%album artist%,$if(%length%,'Unknown artist(s)',%title%)) ^^ %discnumber% ## $if2(%artist%,$if(%length%,'Unknown artist',%path%)) ^^ %title% ^^ [%genre%] ^^ [%date%]"),
    tf_track: fb.TitleFormat("%tracknumber% ^^ $if(%length%,%length%,ON AIR) ^^ $if2(" + (globalProperties.use_ratings_file_tags ? "$meta(rating)" : "%rating%") + ",0) ^^ %mood% ^^ %play_count% ^^ %bitrate% ^^ %codec%"),
    tf_path: fb.TitleFormat("$directory_path(%path%)\\"),
    tf_time_remaining: fb.TitleFormat("$if(%length%,-%playback_time_remaining%,'ON AIR')"),
    tf_elapsed_seconds: fb.TitleFormat("$if(%length%,%playback_time_seconds%,'ON AIR')"),
    tf_total_seconds: fb.TitleFormat("$if2(%length_seconds%,'ON AIR')"),
    doubleRowPixelAdds: 13,
    rowScrollStep: 3,
    scrollSmoothness: 2.5,
	track_gradient_margin: 13,
	track_gradient_size: 13,
	drag_scroll_speed_ms: 100,
    albumArtId: 0,
    defaultHeaderBarHeight: 40,
    libraryHeaderBarHeight: 40,
    headerBarHeight: 40,
    headerBarPaddingTop: 2,
    enableFullScrollEffectOnFocusChange: false,
	margin_bottom:0,
	panelFontAdjustement: 0,
	extraBottomRows: 1,
	load_image_from_cache_direct:true,
};
var properties = {}
function setShowHeaderBar(){
	if(getTrackInfosState() && window.Name!="BottomPlaylist" && layout_state.isEqual(0)) properties.showHeaderBar = properties.showHeaderBarTrackInfosOn;
	else properties.showHeaderBar = properties.showHeaderBarTrackInfosOff;
}
function setAllProperties(){
	if(layout_state.isEqual(1)) properties = Object.assign({}, properties_common, properties_mini);
	else properties = Object.assign({}, properties_common, properties_big);
	properties.rowHeight = properties.defaultRowHeight;
	properties.groupHeaderRowsNumberSimple = properties.groupHeaderRowsNumber;
	setShowHeaderBar();
}
setAllProperties();

function setOneProperty(properties_name,value,update_both,layout_state_2_update) {
	var update_both = typeof update_both !== 'undefined' ? update_both : false;
	if(typeof layout_state_2_update !== 'undefined'){
		var update_current_layout_state = (layout_state.value==layout_state_2_update);
	} else {
		var update_current_layout_state = true;
		var layout_state_2_update = layout_state.value;
	}
	var layout_state_2_update = typeof layout_state_2_update !== 'undefined' ? layout_state_2_update : layout_state.value;

	if(update_both || layout_state_2_update==1){
        if(update_current_layout_state) properties[properties_name] = value;
        properties_mini[properties_name] = value;
		window.SetProperty("MINI:"+properties_name, value);
	}
	if(update_both || layout_state_2_update==0){
        properties[properties_name] = value;
        properties_big[properties_name] = value;
		window.SetProperty("BIG:"+properties_name, value);
	}
}
function getProperty(properties_name, value) {
	if(layout_state.isEqual(1)){
		return window.GetProperty("MINI:"+properties_name, value);
	} else {
		return window.GetProperty("BIG:"+properties_name, value);
	}
}
var TF = {
	genre: fb.TitleFormat('%genre%'),
	albumartist: fb.TitleFormat("%album artist%"),
	album: fb.TitleFormat("%album%"),
	genre: fb.TitleFormat("%genre%"),
	date: fb.TitleFormat("%date%"),
	play_count: fb.TitleFormat("%play_count%"),
	playback_time_seconds: fb.TitleFormat("%playback_time_seconds%"),
	title: fb.TitleFormat("%title%"),
	radio_artist:fb.TitleFormat("$if2(%artist%,$if(%bitrate%,%bitrate%K',''))"),
	artist:fb.TitleFormat("$if3($meta(artist,0),$meta(album artist,0),$meta(composer,0),$meta(performer,0))"),
}
var focus_changes = {
	scroll: false,
	collapse: false
}
var recalculate_time = false;
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
var g_avoid_on_metadb_changed = false;
var avoidShowNowPlaying = false;
if(!properties.showGroupHeaders) properties.extraRowsNumber=0;
var gTime_covers = null;

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
    showTotalItems: true
};
cNowPlaying = {
    flashEnable: false,
    flashescounter: 0,
    flash: false,
	flashescountermax:40
}

cover = {
    default_margin: 4,
    margin: 4,
    padding: 12,
	trackMargin:7,
    w: properties.groupHeaderRowsNumber * properties.rowHeight,
	max_w: properties.groupHeaderRowsNumber * properties.rowHeight,
    h: properties.groupHeaderRowsNumber * properties.rowHeight,
	max_h: properties.groupHeaderRowsNumber * properties.rowHeight,
};

images = {
    path: theme_img_path + "\\",
    loading_angle: 0,
    loading_cover: null,
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
	avoidShowNowPlaying : false,
	avoidPlaylistSwitch : false,
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
                    g_cursor.setCursor(IDC_ARROW,5);
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
		this.search_bt = new button(this.images.search_icon, this.images.search_icon, this.images.search_icon,"search_bt","Filter tracks");

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

        this.reset_bt = new button(this.images.resetIcon_off, this.images.resetIcon_ov, this.images.resetIcon_dn,"reset-bt","Reset filter");
	};
	this.getImages();

	this.on_init = function() {
		this.inputbox = new oInputbox(cFilterBox.w, cFilterBox.h, "", "Filter", colors.normal_txt, 0, 0, colors.selected_bg, g_sendResponse, "brw", undefined, "g_font.normal");
        this.inputbox.autovalidation = true;
    };
	this.on_init();
    this.onFontChanged = function() {
		this.inputbox.onFontChanged();
	}
	this.set_default_text = function() {
		if(properties.lockOnNowPlaying) this.inputbox.empty_text = "Playing tracks...";
		else this.inputbox.empty_text = "Active playlist...";
	}

    this.reset_colors = function() {
        this.inputbox.textcolor = colors.normal_txt;
        this.inputbox.backselectioncolor = colors.selected_bg;
    };

    this.setSize = function(w, h) {
        this.inputbox.setSize(w, h-properties.headerBarPaddingTop);
        this.getImages();
    };

    this.clearInputbox = function() {
        if(this.inputbox.text.length > 0) {
            this.inputbox.text = "";
            this.inputbox.offset = 0;
            filter_text = "";
			brw.populate(true,29, false);
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
		this.inputbox.draw(gr, bx+30, by, 0, 0);
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
				else this.search_bt.checkstate("move", x, y);
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
                this.buttons[this.buttonType.cursor] = new button(this.cursorImage_normal, this.cursorImage_hover, this.cursorImage_down,"scrollbarcursor");
                break;
            case this.buttonType.up:
                this.buttons[this.buttonType.up] = new button(this.upImage_normal.Resize(this.w,this.w,2), this.upImage_hover.Resize(this.w,this.w,2), this.upImage_down.Resize(this.w,this.w,2),"scrollbarup");
                break;
            case this.buttonType.down:
                this.buttons[this.buttonType.down] = new button(this.downImage_normal.Resize(this.w,this.w,2), this.downImage_hover.Resize(this.w,this.w,2), this.downImage_down.Resize(this.w,this.w,2),"scrollbardown");
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
        this.buttons[this.buttonType.cursor] = new button(this.cursorImage_normal, this.cursorImage_hover, this.cursorImage_down,"scrollbarcursor");
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
    this.is_fallback = false;
    this.cover_img = null;
	this.isPlaying = false;
    this.cover_type = null;
    this.tracktype = TrackType(handle);
    this.tracks = [];
    this.load_requested = 0;
	this.cover_formated = false;
	this.mask_applied = false;
    this.save_requested = false;
    this.collapsed = properties.autocollapse;
    this.TimeString = "";
    this.TotalTime = 0;
	this.track_rating = false;

	this.FormatTime = function(time) {
		time_txt = "";
		if (time > 0) {
			totalS = Math.round(time);
			totalS -= (totalW = Math.floor(totalS / 604800)) * 604800;
			totalS -= (totalD = Math.floor(totalS / 86400)) * 86400;
			totalS -= (totalH = Math.floor(totalS / 3600)) * 3600;
			totalS -= (totalM = Math.floor(totalS / 60)) * 60;

			txt_week = (totalW > 0) ? `${totalW} week${totalW > 1 ? 's' : ''}, ` : '';
			txt_day = (totalD > 0) ? `${totalD} day${totalD > 1 ? 's' : ''}, ` : '';
			txt_hour = (totalH > 0) ? `${totalH} hour${totalH > 1 ? 's' : ''}, ` : '';
            txt_mins = (totalM > 0) ? `${totalM} minute${totalM > 1 ? 's' : ''}, ` : '';

			time_txt = `${txt_week}${txt_day}${txt_hour}${txt_mins}${totalS}sec`;
		}
		return time_txt;
	}
    this.finalize = function(count, tracks) {
        this.tracks = tracks.slice(0);
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
            if(brw.expanded_group<0 && brw.focusedTrackId >= this.start && brw.focusedTrackId < this.start + count) { // focused track is in this group!
				brw.expand_group(index);
            }
        };
    };
};

oBrowser = function(name) {
    this.name = name;
    this.groups = [];
    this.rows = [];
	this.hoverRatingRow = -1;
	this.source_idx = -1;
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
	this.followNowPlaying = false;
	this.playlist_on_next_populate = -1;
	this.rating_rowId = -1;
	this.dont_scroll_to_focus = false;
	this.expanded_group = -1;
	this.playlistId2row = Array();
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
        if (!window.IsVisible) {
            return;
        }
        repaint_main1 = repaint_main2;
    };

    this.cover_repaint = function() {
        if (!window.IsVisible) {
            return;
        }
        repaint_cover1 = repaint_cover2;
    };

    this.setSize = function(x, y, w, h) {
        this.x = x;

		if(properties.doubleRowText && properties.showGroupHeaders)
			this.PaddingTop = 23;
		else if(properties.showGroupHeaders)
			this.PaddingTop = 10;
		else this.PaddingTop = 7;

        this.y = y + this.PaddingTop;
        this.w = w;
        this.h = h;
        this.marginLR = 0;
        this.paddingLeft = 1;
        this.paddingRight = 11;

        this.groupHeaderRowHeight = properties.groupHeaderRowsNumber;
        this.totalRows = Math.ceil(this.h / properties.rowHeight);
        this.totalRowsVis = Math.floor(this.h / properties.rowHeight);

        g_filterbox.setSize(this.w, cFilterBox.h+2, g_fsize);

        this.scrollbar.setSize();

        scroll = Math.round(scroll / properties.rowHeight) * properties.rowHeight;
        scroll = check_scroll(scroll);
        scroll_ = scroll;

        // scrollbar update
        this.scrollbar.updateScrollbar();

        g_first_populate_done && this.gettags();

        properties.DropInplaylist && pman.setSize(ww, y + 45, ww, h - 90);
    };

    this.collapseAll = function(bool) { // bool = true to collapse all groups otherwise expand them all
        var end = this.groups.length;
        for(i = 0; i < end; i++) {
			if(this.groups[i].isPlaying) {
				this.groups[i].collapsed = false;
				this.expanded_group = i;
			} else this.groups[i].collapsed = bool;
        };
        this.setList();
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
	this.expand_group = function(new_id) {
		(this.expanded_group > -1 && this.expanded_group < this.groups.length) && (this.groups[this.expanded_group].collapsed = true);
        this.expanded_group = new_id;
		this.groups[new_id].collapsed = false;
    };
    this.set_selected_items = function() {
		var tot = this.rows.length;
		for(r = 0; r < tot; r++) {
			if(this.rows[r].type !== 99)
				this.rows[r].selected = plman.IsPlaylistItemSelected(g_active_playlist, this.rows[r].playlistTrackId_original);
				if(this.rows[r].selected)
					this.groups[this.rows[r].albumId].selected = true;
		}
	};

    this.showNowPlaying = function(flash_nowplaying) {
		var flash_nowplaying = typeof flash_nowplaying !== 'undefined' ? flash_nowplaying : true;

        if(fb.IsPlaying) {
			g_filterbox.clearInputbox();
            try {
                this.nowplaying = plman.GetPlayingItemLocation();
                if(this.nowplaying.IsValid) {
                    if(plman.PlayingPlaylist != g_active_playlist) {
						if(!properties.lockOnPlaylistNamed=="") {
							if(properties.enableAutoSwitchPlaylistMode) {
								brw.setDisplayedPlaylistProperties(false);
							}
							return;
						}
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
							this.expand_group(g);
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

    this.showFocusedItem = function(g_focus_row) {
		g_focus_row = typeof g_focus_row !== 'undefined' ? g_focus_row : this.getOffsetFocusItem(g_focus_id);
       // if(g_focus_row < scroll / properties.rowHeight || g_focus_row > scroll / properties.rowHeight + this.totalRowsVis) {
		   if(properties.showGroupHeaders) {
				scroll_to_track = (g_focus_row - Math.floor(this.totalRowsVis/4)) * properties.rowHeight;
				scroll_to_header = this.groups[this.rows[g_focus_row].albumId].rowId * properties.rowHeight //- properties.rowHeight*(properties.extraRowsNumber+1)
				if(g_focus_row*properties.rowHeight-scroll_to_header+properties.rowHeight>wh-properties.rowHeight*5) scroll=scroll_to_track
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
		focus_changes.collapse = true;
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
    this.getRowIdfromPlaylistTrackId = function(valeur) { // fixed!
        if(valeur < 0) {
            return -1;
        } else {
            var diff = 0;
			var albumId = this.getAlbumIdfromTrackId(valeur);
			var return_row = this.groups[albumId].rowId;
			var fin = this.rows.length-1;//rowId + this.groups[albumId].count - 1;
            while(return_row <= fin){
				while(this.rows[return_row].type != 0) {
					return_row = return_row+1;
				};				
				if(valeur == this.rows[return_row].playlistTrackId_original) {
					return return_row;
				} else return_row = return_row+1;
            };
            return -1;
        };
    };
    this.getOffsetFocusItem = function(fid) { // fixed!
        var row_idx = 0;

        if(fid > -1) {
			if(!(properties.autocollapse && properties.showGroupHeaders)) return this.playlistId2row[fid];
			
			//return this.getRowIdfromPlaylistTrackId(fid);
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
	this.setActivePlaylist = function(call){
		var g_active_playlist_new=-1;
		if(g_active_playlist<0 || g_active_playlist==null) g_active_playlist = 0;
		if(this.playlist_on_next_populate>-1){
			g_active_playlist_new = this.playlist_on_next_populate;
		} else if(properties.lockOnPlaylistNamed!="") {
			g_active_playlist_new = check_playlist(properties.lockOnPlaylistNamed);
			if(g_active_playlist_new==-1) {
				setOneProperty("lockOnPlaylistNamed",'');
				g_active_playlist_new = plman.ActivePlaylist;
			}
		}
		else if(fb.IsPlaying && properties.lockOnNowPlaying) g_active_playlist_new = plman.PlayingPlaylist;
		else if(properties.lockOnNowPlaying && !properties.displayActiveOnPlaybackStopped) g_active_playlist_new = g_active_playlist;
		else g_active_playlist_new = plman.ActivePlaylist;

		if(g_active_playlist!=g_active_playlist_new) changed = true;
		else changed = false;

		g_active_playlist = g_active_playlist_new;
		return changed;
	};
	this.setDisplayedPlaylistProperties = function(call_setAllProperties){
		if(properties.enableAutoSwitchPlaylistMode){
			var old_properties_lockOnNowPlaying = new_properties_lockOnNowPlaying = properties.lockOnNowPlaying;
			var old_properties_lockOnPlaylistNamed = new_properties_lockOnPlaylistNamed = properties.lockOnPlaylistNamed;
			if(layout_state.isEqual(1)){
				new_properties_lockOnNowPlaying=false;
				new_properties_lockOnPlaylistNamed="";
			} else if(main_panel_state.isEqual(1)){
				if(filters_panel_state.isMaximumValue()) new_properties_lockOnNowPlaying=false;
				else new_properties_lockOnNowPlaying=true;
				new_properties_lockOnPlaylistNamed="";
			} else if(properties.lockOnNowPlaying!=true){
				new_properties_lockOnNowPlaying=true;
				new_properties_lockOnPlaylistNamed="";
			}
			if(call_setAllProperties) setAllProperties();
			if(old_properties_lockOnNowPlaying != properties.lockOnNowPlaying || old_properties_lockOnPlaylistNamed != properties.lockOnPlaylistNamed || new_properties_lockOnNowPlaying != properties.lockOnNowPlaying || new_properties_lockOnPlaylistNamed != properties.lockOnPlaylistNamed){
				setOneProperty("lockOnPlaylistNamed","");
				setOneProperty("lockOnNowPlaying",new_properties_lockOnNowPlaying);
				if(!(this.source_idx == plman.PlayingPlaylist && properties.lockOnNowPlaying) && !(this.source_idx == plman.ActivePlaylist && !properties.lockOnNowPlaying)) brw.populate(true,17);
			}
		} else {
			if(call_setAllProperties) setAllProperties();
			changed = brw.setActivePlaylist(2);
			if(changed) brw.populate(true,71, false);
		}
	};
    this.init_groups = function() {
		var handle = null;
		var current = "";
		var previous = "";
        var g = 0, t = 0, r = 0, j = 0;
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
		this.rows.splice(0, this.rows.length);
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
						p = this.groups[g-1].rowsToAdd;

						if(!properties.autocollapse){
							for(n = 0; n < p; n++) {
								this.rows[r] = new Object();
								this.rows[r].selected = false;
								this.rows[r].type = 99; // extra row at bottom of the album/group
								this.rows[r].albumId = g;
								r++;
							};
						}
                        tr.splice(0, t);
                        t = 0;
                    };
                    if(i < total) {
                        // add new group
                        tr.push(arr[1].split(" ^^ "));
                        t++;
                        this.groups.push(new oGroup(g, i, handle, arr[0]));
						this.groups[g].TotalTime+=handle.Length;
						this.groups[g].load_requested = 0;
						this.groups[g].cover_formated = false;
						this.groups[g].mask_applied = false;
						this.groups[g].rowId = r;
						if(properties.showGroupHeaders && !properties.autocollapse) {
							for(k=0; k < properties.groupHeaderRowsNumber; k++) {
								this.rows[r] = new Object();
								this.rows[r].type = k + 1; // 1st line of group header
								this.rows[r].metadb = this.groups[g].metadb;
								this.rows[r].albumId = g;
								this.rows[r].albumTrackId = 0;
								this.rows[r].playlistTrackId = this.groups[g].start;
								this.rows[r].playlistTrackId_original = i;								
								this.rows[r].groupkey = this.groups[g].groupkey;;
								this.rows[r].groupkeysplit = this.groups[g].groupkeysplit;
								this.rows[r].selected = plman.IsPlaylistItemSelected(g_active_playlist, this.rows[r].playlistTrackId_original);
								r++;
							};
							this.groups[g].headerTotalRows = properties.groupHeaderRowsNumber;
						} else this.groups[g].headerTotalRows = properties.groupHeaderRowsNumber;
						if(!(properties.autocollapse && properties.showGroupHeaders)) {
							this.rows[r] = new Object();
							this.rows[r].type = 0; // track
							this.rows[r].metadb = this.list[this.groups[g].start];
							this.playlistId2row[i] = r;
							this.rows[r].albumId = g;
							this.rows[r].albumTrackId = 0;
							this.rows[r].playlistTrackId = this.groups[g].start;
							this.rows[r].playlistTrackId_original = i;							
							this.rows[r].groupkey = this.groups[g].groupkey;
							this.rows[r].groupkeysplit = this.groups[g].groupkeysplit;
							this.rows[r].tracktype = TrackType(this.rows[r].metadb);
							this.rows[r].selected = plman.IsPlaylistItemSelected(g_active_playlist, this.rows[r].playlistTrackId_original);
							//if(this.rows[r].selected)
								//this.groups[g-1].selected = true;
							this.rows[r].rating = -1;
							r++;
						}
                        g++;
						j = 1;
                        previous = current;
                    };
                } else {
                    // add track to current group
                    tr.push(arr[1].split(" ^^ "));
					this.groups[g-1].TotalTime+=handle.Length;
					// add track to rows list
					if(!(properties.autocollapse && properties.showGroupHeaders)) {
						this.rows[r] = new Object();
						this.rows[r].type = 0; // track
						this.rows[r].metadb = this.list[i];
						this.playlistId2row[i] = r;
						this.rows[r].albumId = g-1;
						this.rows[r].albumTrackId = j;
						this.rows[r].playlistTrackId = this.groups[g-1].start + j;
						this.rows[r].playlistTrackId_original = i;						
						this.rows[r].groupkey = this.groups[g-1].groupkey;
						this.rows[r].groupkeysplit = this.groups[g-1].groupkeysplit;
						this.rows[r].tracktype = TrackType(this.rows[r].metadb);
						this.rows[r].selected = plman.IsPlaylistItemSelected(g_active_playlist, this.rows[r].playlistTrackId_original);
						//if(this.rows[r].selected)
							//this.groups[g-1].selected = true;
						this.rows[r].rating = -1;
						j++;
						r++;
					}
                    t++;
                };
            }
		};

        this.rowsCount = r;

        // update last group properties
        if(g > 0) this.groups[g-1].finalize(t, tr);
		//Open group if there is only one group
		if(brw.groups.length==1) {
			this.expand_group(0);
		}
    };
    this.setList = function(finalize_groups) {
		var finalize_groups = typeof finalize_groups !== 'undefined' ? finalize_groups : false;
        this.rows.splice(0, this.rows.length);
        var r = 0, i = 0, j = 0, m = 0, n = 0, p = 0;
        var headerTotalRows = properties.groupHeaderRowsNumber;

        var end = this.groups.length;
		this.isPlayingIdx = -1;
        for(i = 0; i < end; i++) {

			if(finalize_groups) this.groups[i].finalize(this.groups[i].count, this.groups[i].tracks);

			this.groups[i].rowId = r;
			if(properties.showGroupHeaders) {
				for(k=0; k < headerTotalRows; k++) {
					this.rows[r] = new Object();
					this.rows[r].type = k + 1; // 1st line of group header
					this.rows[r].metadb = this.groups[i].metadb;
					this.rows[r].albumId = i;
					this.rows[r].albumTrackId = 0;
					this.rows[r].playlistTrackId = this.groups[i].start;
					this.rows[r].playlistTrackId_original = this.groups[i].start;						
					this.rows[r].groupkey = this.groups[i].groupkey;
					this.rows[r].groupkeysplit = this.groups[i].groupkeysplit;
					this.rows[r].selected = plman.IsPlaylistItemSelected(g_active_playlist, this.rows[r].playlistTrackId_original);
					r++;
				};
			};

            if(!(this.groups[i].collapsed && properties.showGroupHeaders)) {
                // tracks
                m = this.groups[i].count;
                for(j = 0; j < m; j++) {
                    this.rows[r] = new Object();
                    this.rows[r].type = 0; // track
                    this.rows[r].metadb = this.list[this.groups[i].start + j];
					this.playlistId2row[this.groups[i].start + j] = r;
                    this.rows[r].albumId = i;
                    this.rows[r].albumTrackId = j;
                    this.rows[r].playlistTrackId = this.groups[i].start + j;
					this.rows[r].playlistTrackId_original = this.groups[i].start + j;					
                    this.rows[r].groupkey = this.groups[i].groupkey;
					this.rows[r].groupkeysplit = this.groups[i].groupkeysplit;
                    this.rows[r].tracktype = TrackType(this.rows[r].metadb);
					this.rows[r].selected = plman.IsPlaylistItemSelected(g_active_playlist, this.rows[r].playlistTrackId_original);
					if(this.rows[r].selected)
						this.groups[i].selected = true;
                    this.rows[r].rating = -1;
                    r++;
                };
            };
			p = this.groups[i].rowsToAdd;

			for(n = 0; n < p; n++) {
				this.rows[r] = new Object();
				this.rows[r].selected = false;
				this.rows[r].type = 99; // extra row at bottom of the album/group
				this.rows[r].albumId = i;
				r++;
			};
        };
        this.rowsCount = r;
    };

    this.populate = function(is_first_populate,call_id, set_active_playlist) {
		var set_active_playlist = typeof set_active_playlist !== 'undefined' ? set_active_playlist : true;
        this.list && (this.list = undefined);
        this.playlistId2row.splice(0, this.playlistId2row.length);		

		if (this.playlist_on_next_populate > -1){
			g_active_playlist = this.playlist_on_next_populate;
			this.playlist_on_next_populate = -1;
		} else if (set_active_playlist && !g_avoid_playlist_displayed_switch) {
            brw.setActivePlaylist(1);
        } else {
            g_avoid_playlist_displayed_switch = false;
        }

		is_first_populate && (this.expanded_group = -1);

		properties.lockOnNowPlaying && (this.FirstInitialisationDone = true);

		!globalProperties.loaded_covers2memory && g_image_cache.resetAll();
		properties.showHeaderBar && g_filterbox.set_default_text();
        this.list = plman.GetPlaylistItems(g_active_playlist);
		this.source_idx = g_active_playlist;
        this.init_groups();

        if (properties.autocollapse) {
			this.expanded_group > -1 && this.expand_group(this.expanded_group);
			this.setList();
		}	
        if (!this.dont_scroll_to_focus) {
            g_focus_row = brw.getOffsetFocusItem(g_focus_id);
        }
        else {
			g_focus_row = 0;
			this.dont_scroll_to_focus = false;
		}
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
		if(first_on_size) on_size();
        if(brw.rowsCount > 0) brw.gettags(true);
        this.scrollbar.updateScrollbar();
        this.repaint();
        g_first_populate_done = true;
		this.rating_rowId = -1;
		Update_Required_function.indexOf("brw.populate(false") !== -1 && (Update_Required_function = "");
    };

    this.getlimits = () => {
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

    this.gettags = (all) => {
        var start_prev = g_start_;
        var end_prev = g_end_;

        this.getlimits();

        // force full list refresh especially when library is populating (call from 'on_item_focus_change')
        if( Math.abs(g_start_ - start_prev) > 1 || Math.abs(g_end_ - end_prev) > 1) all = true;

        var tf_grp = properties.tf_groupkey;
        var tf_trk = properties.tf_track;

        if(all) {
            for(var i = g_start_;i <= g_end_;i++){
				if(!this.rows[i].infosraw){
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
            };
        } else {
            if(g_start_ < start_prev) {
				if(!this.rows[g_start_].infosraw){
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
				};
            } else if(g_start_ > start_prev || g_end_ > end_prev) {
				if(!this.rows[g_end_].infosraw){
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
    };

	this.SetRatingImages = (width, height, on_color, off_color, border_color) => {
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
	};

    this.DefineCircleMask = (size) => {
		var Mimg = gdi.CreateImage(size, size);
		gb = Mimg.GetGraphics();
		gb.SetSmoothingMode(2);
		gb.FillSolidRect(0, 0, size, size, GetGrey(255));
		gb.FillEllipse(1, 1, size-2, size-2, GetGrey(0));
		Mimg.ReleaseGraphics(gb);
		this.coverMask = Mimg;
	}

	this.getAdditionalFields = (arr_t) => {
		var add_infos = "";
		if(properties.showPlaycount){
			add_infos+=arr_t[4];
		}
		if(properties.showCodec){
			add_infos+=(add_infos!=""?" - ":"")+arr_t[6]+"";
		}
		if(properties.showBitrate){
			add_infos+=(add_infos!=""?" - ":"")+arr_t[5]+"k";
		}
		if(add_infos!="") add_infos = "  ("+add_infos+")";
		return add_infos
	}

    this.draw = (gr) => {
        var coverWidth;
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
						var GroupCover_w = coverWidth-2;
						var GroupCover_h = coverWidth-2;
						var GroupCover_x = ax+cover.trackMargin;
						var GroupCover_y = 0;
						if(properties.doubleRowShowCover){
							var TrackCover_w = coverWidth-20;
							var TrackCover_h = coverWidth-20;
							var TrackCover_x = ax+cover.trackMargin+5;
							var TrackCover_y = GroupCover_y+2;
							var TrackText_x = coverWidth+5;
						} else {
							var TrackCover_w = GroupCover_w;
							var TrackCover_h = GroupCover_h;
							var TrackCover_x = GroupCover_x;
							var TrackCover_y = GroupCover_y;
							var TrackText_x = cover.max_w+TrackCover_x;
						}
					} else {
						var TrackCover_w = coverWidth - cover.margin * 2-cover.padding;
						var TrackCover_h = coverWidth - cover.margin * 2-cover.padding;
						var TrackCover_x = ax+cover.trackMargin;
						var TrackCover_y = 0;
						var TrackText_x = cover.max_w+TrackCover_x;
						var GroupCover_w = TrackCover_w;
						var GroupCover_h = TrackCover_h;
						var GroupCover_x = TrackCover_x;
						var GroupCover_y = 0;
					}
				} else {
					var TrackCover_w = ah-cover.trackMargin*2+2;
					var TrackCover_h = ah-cover.trackMargin*2;
					var TrackCover_x = ax+cover.trackMargin;
					var TrackCover_y = 0;
					var TrackText_x = cover.max_w+TrackCover_x;
					var GroupCover_w = TrackCover_w;
					var GroupCover_h = TrackCover_h;
					var GroupCover_x = ax+cover.trackMargin;
					var GroupCover_y = 0;
				}

                gr.SetTextRenderingHint(globalProperties.TextRendering);

                // get Now Playing track
                if(fb.IsPlaying && plman.PlayingPlaylist == g_active_playlist) {
                    this.nowplaying = plman.GetPlayingItemLocation();
                } else {
                    this.nowplaying = null;
                };

                for(var i = g_start_;i <= g_end_;i++){
                    ay = Math.floor(this.y + (i * ah) - scroll_);
                    this.rows[i].x = ax;
                    this.rows[i].y = ay;

                    switch(this.rows[i].type) {
                    case ghrh: // group header row
                        if(ay > 0 - (ghrh * ah) && ay < this.h + (ghrh * ah)) {
                            // group id
                            g = this.rows[i].albumId;

							var t_selected = false;
                            try {
                                arr_groupinfo = this.rows[i].groupkeysplit;
								album_artist_name = arr_groupinfo[1];
								album_name = arr_groupinfo[0];
                                arr_e = this.groups[g].tracks[0];
                            } catch(e) {};
                            if(album_name == "?") {
                                if(this.groups[g].count > 1) {
                                    var album_name = "(Singles)"
                                } else {
                                    var arr_tmp = this.groups[g].tracks[0];
                                    var album_name = "(Single) " + arr_tmp[1];
                                };
                            } else {
                                var album_name = album_name;
                            };
							this.groups[g].group_header_row_1 = album_name;
							this.groups[g].group_header_row_2 = album_artist_name;
							this.groups[g].date = arr_e[3];
							this.groups[g].genre = arr_e[2];
                            // ================
                            // group header bg
                            // ================
							this.groups[g].group_height_fix = -2;

							if(properties.doubleRowText) {
								if(this.groups[g].collapsed){
									line_vertical_fix = 24;
									this.groups[g].group_height_fix=-4;
								} else {
									line_vertical_fix = 28;
									this.groups[g].group_height_fix=-10;
								}
							}
							else {
								if(this.groups[g].collapsed){
									line_vertical_fix = 12;
									this.groups[g].group_height_fix=2;

								} else {
									line_vertical_fix = 12;
									this.groups[g].group_height_fix=-2;

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
                            };
							if(g_dragndrop_rowId>-1 && this.rows[g_dragndrop_rowId].albumId==g && this.rows[g_dragndrop_rowId].type!=0){
								if(g==0) {
									gr.FillSolidRect(ax, ay - ((ghrh - 1) * ah)-line_vertical_fix+8, aw+this.paddingRight, 2, colors.dragdrop_marker_line);
								}
								else if(!g_dragndrop_bottom) gr.FillSolidRect(ax, ay - ((ghrh - 1) * ah)-line_vertical_fix, aw+this.paddingRight, 2, colors.dragdrop_marker_line);
								else gr.FillSolidRect(ax, ay - ((ghrh - 1) * ah)-line_vertical_fix, aw+this.paddingRight, 2, colors.dragdrop_marker_line);
							}
                            // ==========
                            // cover art
                            // ==========
                            if(ghrh > 1 || properties.doubleRowText) {
								cover.padding = (properties.doubleRowText)?16:10;
                                if(this.groups[g].cover_type == null) {
                                    if(this.groups[g].load_requested == 0) {
										img = g_image_cache.hit(this.rows[i].metadb, g, false);
										if(img!="loading") this.groups[g].cover_img = img;
										if (typeof this.groups[g].cover_img !== "undefined" && this.groups[g].cover_img!==null) {
											this.groups[g].cover_img = g_image_cache.getit(this.rows[i].metadb, g, this.groups[g].cover_img);
											this.groups[g].cover_type = 1;
										}
                                    }
                                } else if(this.groups[g].cover_type == 0) {
                                    this.groups[g].cover_img = globalProperties.nocover_img;
									this.groups[g].mask_applied = false;
									var image = FormatCover(globalProperties.nocover_img, globalProperties.thumbnailWidthMax, globalProperties.thumbnailWidthMax, false);
									g_image_cache.addToCache(image,this.groups[g].cachekey);
                                } else if(this.groups[g].cover_type == 3) {
									this.groups[g].cover_img = globalProperties.stream_img;
									this.groups[g].mask_applied = false;
									var image = FormatCover(globalProperties.stream_img, globalProperties.thumbnailWidthMax, globalProperties.thumbnailWidthMax, false);
									g_image_cache.addToCache(image,this.groups[g].cachekey);
                                };
                                if(isImage(this.groups[g].cover_img) && properties.circleMode && !this.groups[g].mask_applied) {
									if(!this.coverMask) this.DefineCircleMask(GroupCover_w);
									width = this.groups[g].cover_img.Width;
									height = this.groups[g].cover_img.Height;
									coverMask = this.coverMask.Resize(width, height, 7);
									if(this.groups[g].is_fallback || properties.AlbumArtProgressbar) this.groups[g].cover_img = this.groups[g].cover_img.Clone(0, 0, width, height);
									this.groups[g].cover_img.ApplyMask(coverMask);
									this.groups[g].mask_applied = true;
								};
								if(properties.doubleRowText){
									var cv_w = coverWidth-2;
									var cv_h = coverWidth-2;
									var dx = (cover.max_w - cv_w) / 2;
									var dy = (cover.max_h - cv_h) / 2;
									var cv_x = Math.floor(ax + dx + 1)+6;
									var cv_y = Math.floor(ay + dy - ((ghrh - 1) * ah))+this.groups[g].group_height_fix-1;
								} else {
									var cv_w = coverWidth - cover.margin * 2-cover.padding;
									var cv_h = coverWidth - cover.margin * 2-cover.padding;
									var dx = (cover.max_w - cv_w) / 2;
									var dy = (cover.max_h - cv_h) / 2;
									var cv_x = Math.floor(ax + dx + 1)-2;
									var cv_y = Math.floor(ay + dy - ((ghrh - 1) * ah))+this.groups[g].group_height_fix-2;
								}
								if(isImage(this.groups[g].cover_img)) {
									if(!this.groups[g].cover_formated){
										this.groups[g].cover_img = FormatCover(this.groups[g].cover_img, cv_w, cv_h, false);
										this.groups[g].cover_formated = true;
									}
									try{
										gr.DrawImage(this.groups[g].cover_img, cv_x+8, cv_y, cv_w, cv_h, 0, 0, this.groups[g].cover_img.Width, this.groups[g].cover_img.Height,0,255);
									} catch (e) {
										console.log("DrawImage: invalid image ");
									}
								}
								if(!properties.circleMode)
									gr.DrawRect(cv_x+8, cv_y, cv_w-1, cv_h-1, 1.0, colors.cover_rectline);
								else {
									gr.SetSmoothingMode(2);
									gr.DrawEllipse(cv_x+9, cv_y+1, cv_w-2, cv_h-2, 1.0, colors.cover_rectline);
									gr.SetSmoothingMode(0);
								}
                                var text_left_margin = cover.max_w+cv_x+((properties.doubleRowText)?16:0);
                            } else {
                                var text_left_margin = 0;
                            };
                            // =====
                            // text
                            // =====


							arr_e[2]=arr_e[2].replace(/\s+/g, " ");
							if(!isDefined(this.groups[g].row1_Width)) this.groups[g].row1_Width = gr.CalcTextWidth(this.groups[g].group_header_row_1, g_font.italicplus3);
							if(!isDefined(this.groups[g].row2_Width)) this.groups[g].row2_Width = gr.CalcTextWidth(this.groups[g].group_header_row_2, g_font.normal);
                            if(!isDefined(this.groups[g].timeWidth)) this.groups[g].timeWidth = gr.CalcTextWidth(this.groups[g].TimeString, ((properties.doubleRowText)?g_font.normal:g_font.min1)) + 10;
							if(!isDefined(this.groups[g].dateWidth)) this.groups[g].dateWidth = gr.CalcTextWidth(this.groups[g].date, g_font.min1);
							header_text_x = ax;
							header_text_w = aw;
                            // right area
                            gr.GdiDrawText(this.groups[g].TimeString, ((properties.doubleRowText)?g_font.normal:g_font.min1),  colors.faded_txt, header_text_x + header_text_w - this.groups[g].timeWidth - 5, ay - ((ghrh - 1) * ah) + Math.round(ah*1/3)*(ghrh - 1) - 2+this.groups[g].group_height_fix, this.groups[g].timeWidth, Math.round(ah*2/3), DT_RIGHT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
                            gr.GdiDrawText(this.groups[g].date, g_font.min1,  colors.faded_txt, header_text_x, ay - ((ghrh - 2) * ah)+this.groups[g].group_height_fix-((properties.doubleRowText)?10:0), header_text_x + header_text_w -6-this.paddingLeft, Math.round(ah*2/3)*(ghrh - 1), DT_RIGHT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
                            // left area
                            gr.GdiDrawText(this.groups[g].group_header_row_1, g_font.italicplus3, colors.normal_txt, header_text_x + text_left_margin, ay - ((ghrh - 1) * ah) + Math.round(ah*1/3)*(ghrh - 1) - 2+this.groups[g].group_height_fix, header_text_w - text_left_margin - this.groups[g].timeWidth - 10, Math.round(ah*2/3), DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
                            gr.GdiDrawText(this.groups[g].group_header_row_2, g_font.normal, colors.faded_txt, header_text_x + text_left_margin, ay - ((ghrh - 2) * ah)+this.groups[g].group_height_fix-((properties.doubleRowText)?10:0), header_text_w - text_left_margin - this.groups[g].dateWidth-10, Math.round(ah*2/3)*(ghrh - 1), DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);

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
                                arr_e = this.groups[this.rows[i].albumId].tracks[this.rows[i].albumTrackId];
                            } catch(e) {};

                            // =========
                            // track bg
                            // =========

                            // selected track bg
							var t_selected_old = t_selected;
							var t_selected = this.rows[i].selected;
							var color_selected = colors.grad_line;
							var color_selected_off = colors.grad_line_bg;
                            if(t_selected) {
								//top
								if(!t_selected_old){
									gr.FillGradRect(ax+properties.track_gradient_margin, ay, properties.track_gradient_size, 1, 0, color_selected_off,  color_selected, 1.0);
									gr.FillGradRect(ax+aw-properties.track_gradient_size, ay, properties.track_gradient_size, 1, 0, color_selected, color_selected_off, 1.0);
									gr.FillSolidRect(ax+properties.track_gradient_margin+properties.track_gradient_size, ay, aw-(properties.track_gradient_size*2)-properties.track_gradient_margin, 1, color_selected);
								}
								//bottom
								if(!(this.rows[i+1] && this.rows[i+1].selected)){
									gr.FillGradRect(ax+properties.track_gradient_margin, ay+ah-1, properties.track_gradient_size, 1, 0, color_selected_off,  color_selected, 1.0);
									gr.FillGradRect(ax+aw-properties.track_gradient_size, ay+ah-1, properties.track_gradient_size, 1, 0, color_selected, color_selected_off, 1.0);
									gr.FillSolidRect(ax+properties.track_gradient_margin+properties.track_gradient_size, ay+ah-1, aw-(properties.track_gradient_size*2)-properties.track_gradient_margin, 1, color_selected);
								}

                            }

							//Drag_marker
							if(g_dragndrop_rowId==i){
								if(!g_dragndrop_bottom) gr.FillSolidRect(ax, ay-1, aw+this.paddingRight, 2, colors.dragdrop_marker_line);
								else gr.FillSolidRect(ax, ay+ah-1, aw+this.paddingRight, 2, colors.dragdrop_marker_line);
							}

                            // =====
                            // text
                            // =====
                            if(ay >= (0 - ah) && ay < this.y + this.h) {
                                var track_type = this.groups[this.rows[i].albumId].tracktype;
                                var nbc = this.groups[this.rows[i].albumId].count.toString().length;
                                if(nbc == 1) nbc++;

                                // fields
                                //var track_num = arr_t[0] == "?" ? this.rows[i].albumTrackId+1 : arr_t[0];
								var track_num = arr_t[0] == "?" ? "" : arr_t[0];
                                var track_num_part = arr_t[0] == "?" ? "-    " : parseInt(track_num,10)+"    ";
								var add_infos = this.getAdditionalFields(arr_t);

                                var track_title_part = arr_e[1];
                                var track_time_part = arr_t[1];
                                if(properties.showArtistAlways || !properties.showGroupHeaders || arr_e[0].toLowerCase() != arr_groupinfo[1].toLowerCase() || properties.doubleRowText) {
                                    var track_artist_part = ((properties.doubleRowText || track_time_part == "ON AIR")?"":" - ")+arr_e[0]+add_infos;
                                } else {
                                    var track_artist_part = " "+add_infos;
                                };

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

                                if(properties.showRating && track_type != 3 && ((properties.showRatingSelected && t_selected) || (properties.showRatingRated && track_rating_part>0) || (!properties.showRatingRated && !properties.showRatingSelected))) {
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

                                    if(this.nowplaying && this.rows[i].playlistTrackId_original == this.nowplaying.PlaylistItemIndex){ // now playing track

										this.groups[this.rows[i].albumId].isPlaying = true;
										this.isPlayingIdx = this.rows[i].albumId;
										if(cNowPlaying.flashEnable && cNowPlaying.flash){
											gr.FillSolidRect(-1, ay+1, ww+2, ah-2, colors.flash_bg);
										}
										if(cNowPlaying.flashEnable && !properties.darklayout && properties.drawProgressBar && properties.AlbumArtProgressbar && !properties.doubleRowShowCover){
											image_to_draw = images.now_playing_black;
											gr.DrawImage(image_to_draw, ax+11,  ay+Math.round(ah/2-image_to_draw.Height/2)-1, image_to_draw.Width, image_to_draw.Height, 0, 0, image_to_draw.Width, image_to_draw.Height, 0, 255);
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
										if(recalculate_time){
											if(g_total_seconds>0){
												g_time_remaining = g_total_seconds - g_elapsed_seconds;
												g_time_remaining = "-"+g_time_remaining.toHHMMSS();
											} else {
												g_time_remaining = properties.tf_time_remaining.Eval(true);
											}
											recalculate_time = false;
										}
                                        track_time_part = g_time_remaining;

										if(cNowPlaying.flashEnable && cNowPlaying.flash){
											gr.DrawRect(-1, ay, ww+2, ah-1, 1.0, colors.flash_rectline);
										}

										if(properties.doubleRowShowCover) {
											if(arr_t[0]!="?") track_title_part = track_num+". "+track_title_part;
											else track_title_part = track_title_part;
										}

										if(!g_var_cache.isdefined("track_num_part")) g_var_cache.set("track_num_part",gr.CalcTextWidth("000", g_font.normal));
                                        cColumns.track_num_part = g_var_cache.get("track_num_part") + 14;
                                        if(!isDefined(this.rows[i].artist_part_w)) this.rows[i].artist_part_w = track_artist_part.length > 0 ? gr.CalcTextWidth(track_artist_part, g_font.italicmin1) + 0 : 0;
                                        if(!isDefined(this.rows[i].title_part_w)) this.rows[i].title_part_w = gr.CalcTextWidth(track_title_part, g_font.normal) + 10;
										if(!g_var_cache.isdefined("track_time_part")) g_var_cache.set("track_time_part",gr.CalcTextWidth("00:00:00", g_font.normal));
                                        cColumns.track_time_part = track_time_part.length*g_var_cache.get("track_time_part")/8+20;
										

										if(properties.doubleRowShowCover)
											var left_margin = TrackText_x;
										else
											var left_margin = cColumns.track_num_part;

                                        var tx = ax + left_margin;
                                        var tw = aw - left_margin;

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
											if(properties.doubleRowShowCover) var text_limit = current_size-34;
											else var text_limit = current_size-23;
											if(isNaN(current_size) || current_size<0) current_size = properties.track_gradient_size+total_size-1;

											if(properties.AlbumArtProgressbar) {
												var playingText = gdi.CreateImage(total_size+15, ah);
												pt = playingText.GetGraphics();
													pt.FillSolidRect(0, 0, total_size+15, ah,colors.normal_bg)
													pt.SetTextRenderingHint(5);
													if(typeof(this.groups[this.rows[i].albumId].g_wallpaperImg) == "undefined" || !this.groups[this.rows[i].albumId].g_wallpaperImg){
														this.groups[this.rows[i].albumId].g_wallpaperImg = setWallpaperImgV2(undefined, this.groups[this.rows[i].albumId].metadb, true, ww, ah*16);
													};
													pt.DrawImage(this.groups[this.rows[i].albumId].g_wallpaperImg, 0, 0, total_size+15,  ah, 0, 0, this.groups[this.rows[i].albumId].g_wallpaperImg.Width, ah);
													pt.FillSolidRect(0, 0, total_size+15, ah,colors.albumartprogressbar_overlay)
													pt.SetTextRenderingHint(5);
													pt.DrawString(track_time_part, g_font.normal, colors.albumartprogressbar_txt, 0, 1, total_size+6, ah_1, 554696704);
												playingText.ReleaseGraphics(pt);

												var progress_x = ax+22-properties.track_gradient_size
												var progress_w = ax+current_size+7;

												gr.DrawImage(playingText, progress_x, ay, progress_w, ah, 0, 0, current_size+3, ah, 0, 255);
												gr.DrawRect(ax+22-properties.track_gradient_size, ay, ax+current_size+6, ah-1,1,colors.albumartprogressbar_rectline)
												if(track_time_part == "ON AIR") {
													gr.GdiDrawText(g_radio_title, g_font.normal, colors.albumartprogressbar_txt, tx+11, ay_1, Math.min(text_limit,tw-cColumns.track_time_part-15-this.rows[i].rating_length), ah_1, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX);
													gr.GdiDrawText((g_radio_artist!=""?g_radio_artist:track_artist_part), g_font.italicmin1, colors.albumartprogressbar_txt, tx+11, ay_2, Math.min(text_limit,tw-cColumns.track_time_part-15), ah_2, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX);
												} else {
													var margin_left = tx+10 - progress_x;
													gr.GdiDrawText(track_title_part, g_font.normal, colors.albumartprogressbar_txt, progress_x + margin_left, ay_1, Math.min(progress_w-margin_left,tw-cColumns.track_time_part-15-this.rows[i].rating_length), ah_1, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX);
													gr.GdiDrawText(track_artist_part, g_font.italicmin1, colors.albumartprogressbar_txt, progress_x + margin_left, ay_2, Math.min(progress_w-margin_left,tw-cColumns.track_time_part-15), ah_2, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX);
												};

											} else {
												gr.FillGradRect(ax+25-properties.track_gradient_size, ay, (properties.track_gradient_size>current_size+6)?current_size+6:properties.track_gradient_size, 1, 0, colors.progressbar_bg_off, colors.progressbar, 1.0); //grad top
												gr.FillSolidRect(ax+25-properties.track_gradient_size, ay,1,1,colors.progressbar_bg_off)  // 1px bug fix
												gr.FillSolidRect(ax+25, ay, current_size+12-19, 1, colors.progressbar); //line top

												gr.FillGradRect(ax+25-properties.track_gradient_size, ay+1, (properties.track_gradient_size>current_size+6)?current_size+6:properties.track_gradient_size, ah-2, 0, colors.progressbar_bg_off, colors.progressbar_bg_on, 1.0); //grad main bg
												gr.FillSolidRect(ax+25, ay+1, current_size+11-19, ah-2, colors.progressbar_bg_on); //main bg

												gr.FillGradRect(ax+25-properties.track_gradient_size, ay-1+ah, (properties.track_gradient_size>current_size+6)?current_size+6:properties.track_gradient_size, 1, 0, colors.progressbar_bg_off, colors.progressbar, 1.0); //grad bottom
												gr.FillSolidRect(ax+25-properties.track_gradient_size, ay-1+ah,1,1,colors.progressbar_bg_off)  // 1px bug fix
												gr.FillSolidRect(ax+25, ay-1+ah, current_size+12-19, 1, colors.progressbar); //line bottom
												if(t_selected) gr.FillSolidRect(ax+current_size+17, ay+1, 1, ah-2, colors.grad_line); //vertical line when selected
												gr.FillSolidRect(ax+current_size+17, ay+1, 1, ah-2, colors.progressbar);	//vertical line
												gr.FillSolidRect(ax+current_size+18, ay+1, 2, ah+1, colors.progressbar_shadow);	//vertical shadow
												gr.FillSolidRect(ax+25-properties.track_gradient_size, ay+ah, current_size-5+properties.track_gradient_size, 2, colors.progressbar_shadow);	//horizontal shadow
											}
										}
                                        // rating Stars
										try {
											if(!this.drag_tracks && properties.showRating && track_type != 3 && ((properties.showRatingSelected && t_selected) || (properties.showRatingRated && track_rating_part>0) || (!properties.showRatingRated && !properties.showRatingSelected))) {
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
										if(properties.doubleRowShowCover){
											g = this.rows[i].albumId;
											if(this.groups[g].cover_type == null) {
												if(this.groups[g].load_requested == 0 && this.groups[g].start==this.rows[i].playlistTrackId) {
													img = g_image_cache.hit(this.rows[i].metadb, g, false);
													if(img!="loading") this.groups[g].cover_img = img;
													if (typeof this.groups[g].cover_img !== "undefined" && this.groups[g].cover_img!==null) {
														this.groups[g].cover_img = g_image_cache.getit(this.rows[i].metadb, g, this.groups[g].cover_img);
														this.groups[g].cover_type = 1;
													}
												}
											} else if(this.groups[g].cover_type == 0) {
												this.groups[g].cover_img = globalProperties.nocover_img;
												var image = FormatCover(globalProperties.nocover_img, globalProperties.thumbnailWidthMax, globalProperties.thumbnailWidthMax, false);
												g_image_cache.addToCache(image,this.groups[g].cachekey);
												//g_image_cache.cachelist[this.groups[g].cachekey] = FormatCover(globalProperties.nocover_img, globalProperties.thumbnailWidthMax, globalProperties.thumbnailWidthMax, false);
											} else if(this.groups[g].cover_type == 3) {
												this.groups[g].cover_img = globalProperties.stream_img;
												var image = FormatCover(globalProperties.stream_img, globalProperties.thumbnailWidthMax, globalProperties.thumbnailWidthMax, false);
												g_image_cache.addToCache(image,this.groups[g].cachekey);
												//g_image_cache.cachelist[this.groups[g].cachekey] = FormatCover(globalProperties.stream_img, globalProperties.thumbnailWidthMax, globalProperties.thumbnailWidthMax, false);
											};
											if(this.groups[g].cover_img != null && typeof this.groups[g].cover_img != "string") {
												if(!this.groups[g].cover_formated && !properties.showGroupHeaders){
													this.groups[g].cover_img = FormatCover(this.groups[g].cover_img, TrackCover_w, TrackCover_h, false);
													this.groups[g].cover_formated = true;
												}
												if(!this.groups[g].mask_applied && properties.circleMode){
													if(!this.coverMask) this.DefineCircleMask(GroupCover_w);
													width = this.groups[g].cover_img.Width;
													height = this.groups[g].cover_img.Height;
													coverMask = this.coverMask.Resize(width, height, 7);
													if(this.groups[g].is_fallback || properties.AlbumArtProgressbar) this.groups[g].cover_img = this.groups[g].cover_img.Clone(0, 0, width, height);
													this.groups[g].cover_img.ApplyMask(coverMask);
													this.groups[g].mask_applied = true;
												}
												gr.DrawImage(this.groups[g].cover_img, TrackCover_x+8, ay+cover.trackMargin+TrackCover_y, TrackCover_w, TrackCover_h, 0, 0, this.groups[g].cover_img.Width, this.groups[g].cover_img.Height,0,255);
												if(!properties.circleMode)
													gr.FillSolidRect(TrackCover_x+8, ay+cover.trackMargin+TrackCover_y, TrackCover_w, TrackCover_h, colors.playing_cover_overlay);
												else {
													gr.SetSmoothingMode(2);
													gr.FillEllipse(TrackCover_x+8, ay+cover.trackMargin+TrackCover_y, TrackCover_w, TrackCover_h, colors.playing_cover_overlay);
													gr.SetSmoothingMode(0);
												}
											}
											if(!properties.circleMode)
												gr.DrawRect(TrackCover_x+8, ay+cover.trackMargin+TrackCover_y, TrackCover_w-1, TrackCover_h-1, 1.0, (properties.drawProgressBar && properties.AlbumArtProgressbar) ? colors.cover_rectline_AlbumArtProgressbar : colors.cover_rectline);
											else {
												gr.SetSmoothingMode(2);
												gr.DrawEllipse(TrackCover_x+9, ay+cover.trackMargin+1+TrackCover_y, TrackCover_w-2, TrackCover_h-2, 1.0, (properties.drawProgressBar && properties.AlbumArtProgressbar) ? colors.cover_rectline_AlbumArtProgressbar : colors.cover_rectline);
												gr.SetSmoothingMode(0);
											}
											var text_left_margin = TrackText_x;
											if(properties.circleMode) var y_adjust = 1;
											else var y_adjust = 0;
											if(g_elapsed_seconds == 0 || g_elapsed_seconds / 2 == Math.floor(g_elapsed_seconds / 2)) {
												gr.DrawImage(images.now_playing_0, TrackCover_x+8+Math.round(TrackCover_w/2-images.now_playing_0.Width/2), ay+cover.trackMargin+TrackCover_y+Math.round(TrackCover_h/2-images.now_playing_0.Height/2)-1, images.now_playing_0.Width, images.now_playing_0.Height, 0, 0, images.now_playing_0.Width, images.now_playing_0.Height, 0, 255);
											} else {
												gr.DrawImage(images.now_playing_1, TrackCover_x+8+Math.round(TrackCover_w/2-images.now_playing_0.Width/2),  ay+cover.trackMargin+TrackCover_y+Math.round(TrackCover_h/2-images.now_playing_0.Height/2)-1, images.now_playing_1.Width, images.now_playing_1.Height, 0, 0, images.now_playing_1.Width, images.now_playing_1.Height, 0, 255);
											};
										} else {
											if(properties.circleMode) var y_adjust = 1;
											else var y_adjust = 0;
											if (cNowPlaying.flashescounter<5 || !(cNowPlaying.flashEnable && !properties.darklayout && properties.drawProgressBar && properties.AlbumArtProgressbar)){
												if(g_elapsed_seconds == 0 || g_elapsed_seconds / 2 == Math.floor(g_elapsed_seconds / 2)) {
													gr.DrawImage(images.now_playing_0, ax+13+((properties.doubleRowShowCover)?3:0), ay+y_adjust+Math.round(ah/2-images.now_playing_0.Height/2)-1, images.now_playing_0.Width, images.now_playing_0.Height, 0, 0, images.now_playing_0.Width, images.now_playing_0.Height, 0, 255);
												} else {
													gr.DrawImage(images.now_playing_1, ax+13+((properties.doubleRowShowCover)?3:0),  ay+y_adjust+Math.round(ah/2-images.now_playing_0.Height/2)-1, images.now_playing_1.Width, images.now_playing_1.Height, 0, 0, images.now_playing_1.Width, images.now_playing_1.Height, 0, 255);
												};
											}
										}
                                    } else { //default track
										if(properties.doubleRowShowCover){
											g = this.rows[i].albumId;
											if(this.groups[g].cover_type == null) {
												if(this.groups[g].load_requested == 0) {
													img = g_image_cache.hit(this.rows[i].metadb, g, false);
													if(img!="loading") this.groups[g].cover_img = img;
													if (typeof this.groups[g].cover_img !== "undefined" && this.groups[g].cover_img!==null) {
														this.groups[g].cover_img = g_image_cache.getit(this.rows[i].metadb, g, this.groups[g].cover_img);
														this.groups[g].cover_type = 1;
													}
												}
											} else if(this.groups[g].cover_type == 0) {
												this.groups[g].cover_img = globalProperties.nocover_img;
												var image = FormatCover(globalProperties.nocover_img, globalProperties.thumbnailWidthMax, globalProperties.thumbnailWidthMax, false);
												g_image_cache.addToCache(image,this.groups[g].cachekey);
												//g_image_cache.cachelist[this.groups[g].cachekey] = FormatCover(globalProperties.nocover_img, globalProperties.thumbnailWidthMax, globalProperties.thumbnailWidthMax, false);
											} else if(this.groups[g].cover_type == 3) {
												this.groups[g].cover_img = globalProperties.stream_img;
												var image = FormatCover(globalProperties.stream_img, globalProperties.thumbnailWidthMax, globalProperties.thumbnailWidthMax, false);
												g_image_cache.addToCache(image,this.groups[g].cachekey);
												//g_image_cache.cachelist[this.groups[g].cachekey] = FormatCover(globalProperties.stream_img, globalProperties.thumbnailWidthMax, globalProperties.thumbnailWidthMax, false);
											};
											if(this.groups[g].cover_img != null && typeof this.groups[g].cover_img != "string") {
												if(!this.groups[g].cover_formated && !properties.showGroupHeaders){
													this.groups[g].cover_img = FormatCover(this.groups[g].cover_img, TrackCover_w, TrackCover_h, false);
													this.groups[g].cover_formated = true;
												}
												if(!this.groups[g].mask_applied && properties.circleMode){
													if(!this.coverMask) this.DefineCircleMask(GroupCover_w);
													width = this.groups[g].cover_img.Width;
													height = this.groups[g].cover_img.Height;
													coverMask = this.coverMask.Resize(width, height, 7);
													if(this.groups[g].is_fallback || properties.AlbumArtProgressbar) this.groups[g].cover_img = this.groups[g].cover_img.Clone(0, 0, width, height);
													this.groups[g].cover_img.ApplyMask(coverMask);
													this.groups[g].mask_applied = true;
												}
												gr.DrawImage(this.groups[g].cover_img, TrackCover_x+8, ay+cover.trackMargin+TrackCover_y, TrackCover_w, TrackCover_h, 0, 0, this.groups[g].cover_img.Width, this.groups[g].cover_img.Height,0,255);
												if(!properties.circleMode)
													gr.DrawRect(TrackCover_x+8, ay+cover.trackMargin+TrackCover_y, TrackCover_w-1, TrackCover_h-1, 1.0, colors.cover_rectline);
												else {
													gr.SetSmoothingMode(2);
													gr.DrawEllipse(TrackCover_x+9, ay+cover.trackMargin+1+TrackCover_y, TrackCover_w-2, TrackCover_h-2, 1.0, colors.cover_rectline);
													gr.SetSmoothingMode(0);
												}
											} else {
												if(!properties.circleMode)
													gr.DrawRect(TrackCover_x+8, ay+cover.trackMargin+TrackCover_y, TrackCover_w-1, TrackCover_h-1, 1.0, colors.cover_rectline);
												else {
													gr.SetSmoothingMode(2);
													gr.DrawEllipse(TrackCover_x+9, ay+cover.trackMargin+1+TrackCover_y, TrackCover_w-2, TrackCover_h-2, 1.0, colors.cover_rectline);
													gr.SetSmoothingMode(0);
												}
												//gr.DrawRect(TrackCover_x+8, ay+cover.trackMargin+TrackCover_y, TrackCover_w-1, TrackCover_h-1, 1.0, colors.cover_rectline);
											};
											var text_left_margin = TrackText_x;
										}
										if(properties.doubleRowShowCover) {
											if(arr_t[0]!="?") track_title_part = track_num+". "+track_title_part;
										}
										if(!g_var_cache.isdefined("track_num_part")) g_var_cache.set("track_num_part",gr.CalcTextWidth("000", g_font.normal));
                                        cColumns.track_num_part = g_var_cache.get("track_num_part") + 14;
                                        if(!isDefined(this.rows[i].artist_part_w)) this.rows[i].artist_part_w = track_artist_part.length > 0 ? gr.CalcTextWidth(track_artist_part, g_font.normal) : 0;
                                        if(!isDefined(this.rows[i].title_part_w)) this.rows[i].title_part_w = gr.CalcTextWidth(track_title_part, g_font.normal) + 10;
										if(!g_var_cache.isdefined("track_time_part")) g_var_cache.set("track_time_part",gr.CalcTextWidth("00:00:00", g_font.normal));
                                        cColumns.track_time_part = track_time_part.length*g_var_cache.get("track_time_part")/8+20;

										if(properties.doubleRowShowCover)
											var left_margin = TrackText_x;
										else
											var left_margin = cColumns.track_num_part;

                                        var tx = ax + left_margin;
                                        var tw = aw - left_margin;

										if(properties.showToolTip) {
											if((tw-cColumns.track_time_part-15-(this.rows[i].rating_length+5))<(this.rows[i].title_part_w-10)){
												this.rows[i].tooltip = true;
											} else {
												this.rows[i].tooltip = false;
											}
										}

                                        if(!properties.doubleRowShowCover) gr.GdiDrawText(track_num_part, g_font_light, colors.tracknumber_txt, ax+8, ay_1, cColumns.track_num_part, ah_1, DT_RIGHT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
                                        gr.GdiDrawText(track_artist_part, g_font.italicmin1, colors.fadedsmall_txt, tx+10, ay_2, tw-cColumns.track_time_part-15, ah_2, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
                                        gr.GdiDrawText(track_title_part, g_font.normal, colors.normal_txt, tx+10, ay_1, tw-cColumns.track_time_part-15-(this.rows[i].rating_length+5), ah_1, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
                                        gr.GdiDrawText(track_time_part, g_font.normal, colors.normal_txt, tx+tw-cColumns.track_time_part-8, ay_1, cColumns.track_time_part, ah_1, DT_RIGHT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
                                        // rating Stars
										try {
											if(!this.drag_tracks && properties.showRating && track_type != 3 && ((properties.showRatingSelected && t_selected) || (properties.showRatingRated && track_rating_part>0) || (!properties.showRatingRated && !properties.showRatingSelected))) {
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
                                    if(this.nowplaying && this.rows[i].playlistTrackId_original == this.nowplaying.PlaylistItemIndex) { // now playing track
										this.groups[this.rows[i].albumId].isPlaying = true;
										this.isPlayingIdx = this.rows[i].albumId;
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
										if(recalculate_time){
											if(g_total_seconds>0){
												g_time_remaining = g_total_seconds - g_elapsed_seconds;
												g_time_remaining = "-"+g_time_remaining.toHHMMSS();
											} else {
												g_time_remaining = properties.tf_time_remaining.Eval(true);
											}
											recalculate_time = false;
										}
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
                                        cColumns.track_time_part = track_time_part.length*g_var_cache.get("track_time_part")/8+27;

                                        var tx = ax + cColumns.track_num_part;
                                        var tw = aw - cColumns.track_num_part;

                                        if(track_time_part == "ON AIR") {
											if(g_radio_title==""){
												track_part1 = track_artist_part;
											} else {
												track_part1 = g_radio_title;
											}
                                            if(!isDefined(this.rows[i].artist_part_w)) this.rows[i].artist_part_w = g_radio_title.length > 0 ? gr.CalcTextWidth(g_radio_title, g_font.normal) +3: 0;
											if(!isDefined(this.rows[i].track_part1)) this.rows[i].track_part1 = track_part1.length > 0 ? gr.CalcTextWidth(track_part1, g_font.normal) + 5 : 5;
                                        } else {
											if(properties.showGroupHeaders){
												 track_part1 = track_title_part;
												 if(!isDefined(this.rows[i].track_part1)) this.rows[i].track_part1 = track_part1.length > 0 ? gr.CalcTextWidth(track_part1, g_font.normal) + 5 : 5;
												 track_part1 = track_title_part
												 track_part2 = track_artist_part
												 track_part1_color = colors.normal_txt
												 if(!isDefined(this.rows[i].track_part2)) this.rows[i].track_part2 = track_part2.length > 0 ? gr.CalcTextWidth(track_part2, g_font.normal) : 0;
												 if(properties.showToolTip) {
													 if((tw-cColumns.track_time_part-5-(this.rows[i].rating_length+5))<(this.rows[i].track_part1+this.rows[i].track_part2)){
														this.rows[i].tooltip = true;
													 } else this.rows[i].tooltip = false;
												 }
											} else {
												track_part1 = track_title_part;
												track_part2 = track_artist_part;
												track_part1_color = colors.normal_txt;
												if(!isDefined(this.rows[i].track_part1)) this.rows[i].track_part1 = track_part1.length > 0 ? gr.CalcTextWidth(track_part1 + " - ", g_font.normal) + 5 : 5;
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
                                        if(this.rows[i].track_part1 > 0) {
                                            if(track_time_part == "ON AIR") {
                                                gr.GdiDrawText(track_part1, g_font.normal, colors.normal_txt, tx+10, ay, tw-cColumns.track_time_part-15-(this.rows[i].rating_length+5), ah, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
                                            } else {
                                                gr.GdiDrawText(track_part1, g_font.normal, track_part1_color, tx+13, ay, tw-cColumns.track_time_part-15-(this.rows[i].rating_length+5), ah, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
                                            };
                                        };

                                        if(track_time_part == "ON AIR") {
                                            gr.GdiDrawText(g_radio_artist_final, g_font.normal, colors.fadedsmall_txt, tx+this.rows[i].artist_part_w+10, ay, tw-this.rows[i].artist_part_w-cColumns.track_time_part-5-(this.rows[i].rating_length+5), ah, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
                                        } else if(show_track_part2) {
                                            gr.GdiDrawText(track_part2, g_font_lightmin1, colors.fadedsmall_txt, tx+this.rows[i].track_part1+8, ay, tw-this.rows[i].track_part1-cColumns.track_time_part-5-(this.rows[i].rating_length+5), ah, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
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
														this.groups[this.rows[i].albumId].g_wallpaperImg = setWallpaperImgV2(undefined, this.groups[this.rows[i].albumId].metadb, true, ww, ah*16);
													};
													pt.DrawImage(this.groups[this.rows[i].albumId].g_wallpaperImg, 0, 0, total_size+15,  ah, 0, 0, this.groups[this.rows[i].albumId].g_wallpaperImg.Width, ah);
													pt.FillSolidRect(0, 0, total_size+15, ah,colors.albumartprogressbar_overlay)
													pt.SetTextRenderingHint(5);
													pt.DrawString(track_time_part, g_font.normal, colors.albumartprogressbar_txt, 0, 0, total_size+6, ah, 554696704);
												playingText.ReleaseGraphics(pt);
												var progress_x = ax+22-properties.track_gradient_size
												var progress_w = ax+current_size+5;
												gr.DrawImage(playingText, progress_x, ay, progress_w, ah, 0, 0, current_size+3, ah, 0, 255);
												gr.DrawRect(ax+22-properties.track_gradient_size, ay, ax+current_size+4, ah-1,1,colors.albumartprogressbar_rectline)

												if(track_time_part == "ON AIR") {
														gr.GdiDrawText(g_radio_title, g_font.normal, colors.albumartprogressbar_txt, tx+13, ay, Math.min(current_size-35,tw-cColumns.track_time_part-15-this.rows[i].rating_length), ah, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX);
														//gr.GdiDrawText(g_radio_artist, g_font_light, colors.albumartprogressbar_txt, tx+this.rows[i].artist_part_w+18, ay, Math.min(current_size-this.rows[i].artist_part_w-22,tw-this.rows[i].artist_part_w-cColumns.track_time_part-5-this.rows[i].rating_length), ah, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX);
												} else {
														var margin_left = tx+13 - progress_x;

														gr.GdiDrawText(track_part1, g_font.normal, colors.albumartprogressbar_txt, tx+13, ay, Math.min(progress_w-margin_left,tw-cColumns.track_time_part-15-this.rows[i].rating_length), ah, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX);
														gr.GdiDrawText(track_part2, g_font_lightmin1, colors.albumartprogressbar_txt, tx+this.rows[i].track_part1+8, ay, Math.min(progress_w-margin_left-this.rows[i].track_part1+5,tw-this.rows[i].track_part1-cColumns.track_time_part-10-this.rows[i].rating_length), ah, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX);

												};
											} else {
												gr.FillGradRect(ax+25-properties.track_gradient_size, ay, (properties.track_gradient_size>current_size+6)?current_size+6:properties.track_gradient_size, 1, 0, colors.progressbar_bg_off, colors.progressbar, 1.0); //grad top
												gr.FillSolidRect(ax+25-properties.track_gradient_size, ay,1,1,colors.progressbar_bg_off)  // 1px bug fix
												gr.FillSolidRect(ax+25, ay, current_size+12-19, 1, colors.progressbar); //line top

												gr.FillGradRect(ax+25-properties.track_gradient_size, ay+1, (properties.track_gradient_size>current_size+6)?current_size+6:properties.track_gradient_size, ah-2, 0, colors.progressbar_bg_off, colors.progressbar_bg_on, 1.0); //grad main bg
												gr.FillSolidRect(ax+25, ay+1, current_size+11-19, ah-2, colors.progressbar_bg_on); //main bg

												gr.FillGradRect(ax+25-properties.track_gradient_size, ay-1+ah, (properties.track_gradient_size>current_size+6)?current_size+6:properties.track_gradient_size, 1, 0, colors.progressbar_bg_off, colors.progressbar, 1.0); //grad bottom
												gr.FillSolidRect(ax+25-properties.track_gradient_size, ay-1+ah,1,1,colors.progressbar_bg_off) // 1px bug fix
												gr.FillSolidRect(ax+25, ay-1+ah, current_size+12-19, 1, colors.progressbar); //line bottom
												gr.FillSolidRect(ax+current_size+17, ay+1, 1, ah-2, colors.progressbar);	//vertical line
												if(t_selected) gr.FillSolidRect(ax+current_size+17, ay+1, 1, ah-2, colors.grad_line); //vertical line when selected
												gr.FillSolidRect(ax+current_size+18, ay+1, 2, ah+1, colors.progressbar_shadow);	//vertical shadow
												gr.FillSolidRect(ax+25-properties.track_gradient_size, ay+ah, current_size-5+properties.track_gradient_size, 2, colors.progressbar_shadow);	//horizontal shadow
											}
										}
                                        // rating Stars
										try {
											if(!this.drag_tracks && properties.showRating && track_type != 3 && ((properties.showRatingSelected && t_selected) || (properties.showRatingRated && track_rating_part>0) || (!properties.showRatingRated && !properties.showRatingSelected))) {
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
                                        cColumns.track_time_part = track_time_part.length*g_var_cache.get("track_time_part")/8+27;

                                        var tx = ax + cColumns.track_num_part;
                                        var tw = aw - cColumns.track_num_part;
                                        gr.GdiDrawText(track_num_part, g_font_light, colors.tracknumber_txt, ax+10, ay, cColumns.track_num_part, ah, DT_RIGHT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
										if(track_time_part == "ON AIR"){
											 track_part1 = track_artist_part;
											 if(!isDefined(this.rows[i].track_part1)) this.rows[i].track_part1 = track_part1.length > 0 ? gr.CalcTextWidth(track_part1 + " - ", g_font.normal) + 5 : 5;
											 track_part2 = "";
											 track_part2_color = colors.fadedsmall_txt
										} else if(properties.showGroupHeaders){
											 track_part1 = track_title_part;
											 if(!isDefined(this.rows[i].track_part1)) this.rows[i].track_part1 = track_part1.length > 0 ? gr.CalcTextWidth(track_part1, g_font.normal) + 5 : 5;
											 track_part2 = track_artist_part;
											 track_part2_color = colors.fadedsmall_txt;
											 if(!isDefined(this.rows[i].track_part2)) this.rows[i].track_part2 = track_part2.length > 0 ? gr.CalcTextWidth(track_part2, g_font.normal) : 0;
											 if(properties.showToolTip) {
												if((tw-cColumns.track_time_part-5-(this.rows[i].rating_length+5))<(this.rows[i].track_part1+this.rows[i].track_part2)){
													this.rows[i].tooltip = true;
												} else this.rows[i].tooltip = false;
											}
										} else{
											track_part1 = track_title_part;
											track_part2 = track_artist_part;
											if(!isDefined(this.rows[i].track_part1)) this.rows[i].track_part1 = track_part1.length > 0 ? gr.CalcTextWidth(track_part1, g_font.normal) + 5 : 5;
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
                                        if(this.rows[i].track_part1 > 0) {
                                            gr.GdiDrawText(track_part1, g_font.normal, colors.normal_txt, tx+13, ay, tw-cColumns.track_time_part-20-this.rows[i].rating_length, ah, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
                                        };
                                        if(show_track_part2)
										gr.GdiDrawText(track_part2, g_font_lightmin1, track_part2_color, tx+this.rows[i].track_part1+8, ay, tw-this.rows[i].track_part1-cColumns.track_time_part-10-this.rows[i].rating_length, ah, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
                                        gr.GdiDrawText(track_time_part, g_font.normal, colors.normal_txt, tx+tw-cColumns.track_time_part-8, ay, cColumns.track_time_part, ah, DT_RIGHT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
                                        // rating Stars
										try {
											if(!this.drag_tracks && properties.showRating && track_type != 3 && ((properties.showRatingSelected && t_selected) || (properties.showRatingRated && track_rating_part>0) || (!properties.showRatingRated && !properties.showRatingSelected))) {
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
				if(!(getTrackInfosState()==2 && window.Name!='BottomPlaylist'))
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

			this.drawLeftLine = layout_state.isEqual(0) && !(main_panel_state.isEqual(1) && window.Name=='BottomPlaylist');

            // draw header
            if(properties.showHeaderBar) {
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
					try {
						gr.GdiDrawText(boxText, g_font.min2,colors.faded_txt, tx, properties.headerBarPaddingTop, tw, properties.headerBarHeight-properties.headerBarPaddingTop-1, DT_RIGHT | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX | DT_END_ELLIPSIS);
					} catch(e) {console.log(e)};
				}
            };
			if(g_resizing.showResizeBorder()) gr.FillSolidRect(0, 0, 1, wh, colors.dragdrop_marker_line);
			else if(this.drawLeftLine) gr.FillSolidRect(0, 0, 1, wh, colors.sidesline);

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
			while(typeof(this.rows[rowId]) === "undefined" || this.rows[rowId].type == 99) {
				rowId=rowId-1;
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
			this.activeRowTooltip = this.activeRow;
            if(this.activeRow >= this.rows.length) {
				this.activeRow = this.rows.length-1;
				this.activeRowTooltip = -1;
			}
			try{
				if (this.activeRow > -1 && this.rows[this.activeRow].type == 99 && this.activeRow < this.rows.length) {
					this.activeRow = Math.ceil((y - this.groups[this.rows[this.activeRow+1].albumId].group_height_fix + scroll_ - this.y) / properties.rowHeight - 1);
					this.activeRowTooltip = this.activeRow;
				}
			} catch(e){}
            if(this.activeRow >= this.rows.length) {
				this.activeRow = this.rows.length-1;
				this.activeRowTooltip = -1;
			}
        } else {
            this.activeRow = -1;
			this.activeRowTooltip = -1;
        };
		//this.groups[this.rows[this.activeRow].albumId].group_height_fix

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
				this.track_rating = false;
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
							var groupId = this.rows[this.activeRow].albumId;
                            if(utils.IsKeyPressed(VK_SHIFT)) {
                                if (g_focus_id != playlistTrackId) {
                                    if (this.SHIFT_start_id != null) {
                                        this.selectAtoB(this.SHIFT_start_id, playlistTrackId);
                                    } else {
                                        this.selectAtoB(g_focus_id, playlistTrackId);
                                    };
                                };
                            } else if(utils.IsKeyPressed(VK_CONTROL)) {
                                this.selectGroupTracks(groupId);
                                this.SHIFT_start_id = null;
                            } else {
								plman.ClearPlaylistSelection(g_active_playlist);
                                if(!((properties.autocollapse || properties.expandBySingleClick) && this.groups[groupId].collapsed)) {
                                    this.selectGroupTracks(groupId);
                                };
                                this.SHIFT_start_id = null;
                            };
							var notify_array = false;
							if(g_focus_id!=playlistTrackId || this.sentAlbumId!=groupId) {
								this.sentAlbumId = groupId;
								this.sentTrackId = -1;
								//window.NotifyOthers("trigger_on_focus_change",Array(g_active_playlist,playlistTrackId));
								notify_array = {
									playlist:g_active_playlist,
									trackIndex:playlistTrackId,
									cover_img:null,
									totalTracks:this.groups[groupId].count+(this.groups[groupId].count > 1 ? " tracks" : " track"),
									genre:this.groups[groupId].genre,
									metadb:this.groups[groupId].metadb,
									date:this.groups[groupId].date,
									length:this.groups[groupId].TimeString,
									firstRow: this.groups[groupId].group_header_row_1,
									secondRow: this.groups[groupId].group_header_row_2};
								plman.SetPlaylistFocusItem(g_active_playlist, playlistTrackId);
								focus_changes.collapse = true;
							}
							if(this.groups[groupId].collapsed && properties.expandBySingleClick) {
								this.expand_group(groupId);
								focus_changes.collapse = false;
								focus_changes.scroll = true;
								this.setList();
								this.scrollbar.updateScrollbar();
								if(this.rowsCount > 0) this.gettags(true);
							}
							if(notify_array){
								var playlistname = plman.GetPlaylistName(g_active_playlist);
								if(playlistname==globalProperties.selection_playlist || playlistname==globalProperties.playing_playlist ||  playlistname==globalProperties.filter_playlist) {
									notify_array.tracklist = this.getGroupTracks(groupId);
									notify_array.trackIndex = 0;
								}
								window.NotifyOthers("trigger_on_focus_change_album",notify_array);	
							}							
                            break;
                        case (rowType == 0):                    // ----------------> track row
                            var playlistTrackId = this.rows[this.activeRow].playlistTrackId_original;
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
									focus_changes.collapse = true;
                                };
                                this.SHIFT_start_id = null;
                            } else {
                                // check if rating to update ?
                                if(this.ishover_rating) {
									this.track_rating = true;
                                } else {
                                    if(plman.IsPlaylistItemSelected(g_active_playlist, playlistTrackId)) {
                                        if(this.metadblist_selection.Count > 1) {
                                            //plman.ClearPlaylistSelection(g_active_playlist);
                                            //plman.SetPlaylistSelectionSingle(g_active_playlist, playlistTrackId, true);
                                            //plman.SetPlaylistFocusItem(g_active_playlist, playlistTrackId);
											//focus_changes.collapse = true;
                                        } else {
                                            // nothing, single track already selected
                                        };
										if(g_focus_id!=playlistTrackId || this.sentTrackId != playlistTrackId) {
											this.sentTrackId = playlistTrackId;
											this.sentAlbumId = -1;
											window.NotifyOthers("trigger_on_focus_change",Array(g_active_playlist,playlistTrackId, this.rows[this.activeRow].metadb));
											plman.SetPlaylistFocusItem(g_active_playlist, playlistTrackId);
											focus_changes.collapse = true;
										}
                                    } else {
                                        plman.ClearPlaylistSelection(g_active_playlist);
                                        plman.SetPlaylistSelectionSingle(g_active_playlist, playlistTrackId, true);
                                        plman.SetPlaylistFocusItem(g_active_playlist, playlistTrackId);
										focus_changes.collapse = true;
										this.sentTrackId = playlistTrackId;
										this.sentAlbumId = -1;
										window.NotifyOthers("trigger_on_focus_change",Array(g_active_playlist,playlistTrackId, this.rows[this.activeRow].metadb));
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
                    if (this.rows[this.activeRow].type === 0) {
                        var playlistTrackId = this.rows[this.activeRow].playlistTrackId_original;
                        if(!utils.IsKeyPressed(VK_SHIFT) && !utils.IsKeyPressed(VK_CONTROL)) {
                            if(plman.IsPlaylistItemSelected(g_active_playlist, playlistTrackId)) {
                                if(this.metadblist_selection.Count > 1 && !this.track_rating) {
                                    plman.ClearPlaylistSelection(g_active_playlist);
                                    plman.SetPlaylistSelectionSingle(g_active_playlist, playlistTrackId, true);
                                    plman.SetPlaylistFocusItem(g_active_playlist, playlistTrackId);
                                    focus_changes.collapse = true;
                                    this.repaint();
                                };
                            };
                        };
                    }
                }
				if(this.track_rating && this.ishover_rating){
					var l_rating = Math.ceil((x - rating_x) / (this.rows[this.activeRow].rating_length / 5) + 0.1);
					if(l_rating > 5) l_rating = 5;
					else if(l_rating < 0) l_rating = 0;
					// update if new rating <> current track rating
					if (this.rows[this.activeRow].tracktype < 2) {
						g_rating_updated = true;
						this.rating_rowId = this.activeRow;
						if(l_rating!=this.rows[this.activeRow].rating) this.rows[this.activeRow].rating = rateSong(l_rating,this.rows[this.activeRow].rating, this.rows[this.activeRow].metadb);
					};
				}
				this.drag_tracks = false;
                this.drag_clicked = false;
				this.track_rating = false;
                // scrollbar
                if(cScrollBar.enabled && cScrollBar.visible) {
                    brw.scrollbar && brw.scrollbar.on_mouse(event, x, y);
                };
                break;
            case "dblclk":
                if(this.ishover && this.activeRow > -1 && Math.abs(scroll - scroll_) < 2) {
                    var rowType = this.rows[this.activeRow].type;
                    if (rowType > 0 && rowType < 99) {
                        // group header
                        if(!properties.expandBySingleClick || !this.groups[this.rows[this.activeRow].albumId].collapsed) {
                            this.groups[this.rows[this.activeRow].albumId].collapsed = !this.groups[this.rows[this.activeRow].albumId].collapsed;
                            this.setList();

                            g_focus_row = this.getOffsetFocusItem(g_focus_id);
                            // if focused track not totally visible, we scroll to show it centered in the panel
                            if(g_focus_row < scroll / properties.rowHeight || g_focus_row > scroll / properties.rowHeight + brw.totalRowsVis - 1) {
                                scroll = (g_focus_row - Math.floor(brw.totalRowsVis / 2)) * properties.rowHeight;
                                scroll = check_scroll(scroll);
                                scroll_ = scroll;
                            };

                            focus_changes.collapse = false;
                            focus_changes.scroll = false;
                            if(this.rowsCount > 0) brw.gettags(true);
                            this.scrollbar.updateScrollbar();
                            brw.repaint();
                        }
                    } else if (rowType === 0) {
                        // track
                        plman.FlushPlaybackQueue();
                        plman.PlayingPlaylist = g_active_playlist;
                        plman.SetPlaylistFocusItem(g_active_playlist,this.rows[this.activeRow].playlistTrackId_original);
                        focus_changes.collapse = true;
                        plman.AddPlaylistItemToPlaybackQueue(g_active_playlist, this.rows[this.activeRow].playlistTrackId_original);
                        fb.IsPaused || fb.IsPlaying
                            ? fb.Next()
                            : fb.Play();
                    }
                    this.repaint();
                } else {
                    // scrollbar
                    (cScrollBar.enabled && cScrollBar.visible) && brw.scrollbar && brw.scrollbar.on_mouse(event, x, y);
                }
                break;
            case "move":
                if(g_lbtn_click && this.drag_clicked && !this.drag_moving) {
                    if(!properties.DropInplaylist || this.h > cPlaylistManager.rowHeight * 6) {
						if(properties.DropInplaylist && !this.drag_tracks && (Math.abs(y - this.drag_clicked_y) < 15 && Math.abs(x - this.drag_clicked_x) > 15) && plman.GetPlaylistSelectedItems(g_active_playlist).Count>0) {
							this.drag_moving = true;
							pman.state = 1;
							g_cursor.setCursor(IDC_HELP,'dragtrack');
							g_tooltip.Deactivate();
							if(timers.hidePlaylistManager) {
								window.ClearInterval(timers.hidePlaylistManager);
								timers.hidePlaylistManager = false;
							};
							if(!timers.showPlaylistManager) {
								timers.showPlaylistManager = setInterval(pman.showPanel, 25);
							};
							var items = plman.GetPlaylistSelectedItems(g_active_playlist);
							if(this.activeRow>-1 && (this.rows[this.activeRow].type==2 || this.rows[this.activeRow].type==1)){
								album_info=this.rows[this.activeRow].groupkeysplit;
								if(items.Count>1) {
									var line1 = "Dragging";
									var line2 = items.Count+" tracks";
								} else {
									var line1 = album_info[0];
									var line2 = album_info[1];
								}
							} else if(this.activeRow>-1 && this.rows[this.activeRow].type==0){
								track_info=this.groups[this.rows[this.activeRow].albumId].tracks[this.rows[this.activeRow].albumTrackId];
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

								if(this.activeRow>-1 && (this.rows[this.activeRow].type==2 || this.rows[this.activeRow].type==1)){
									album_info=this.rows[this.activeRow].groupkeysplit;
									if(items.Count>1) {
										var line1 = "Dragging";
										var line2 = items.Count+" tracks";
									} else {
										var line1 = album_info[0];
										var line2 = album_info[1];
									}
								} else if(this.activeRow>-1 && this.rows[this.activeRow].type==0){
									track_info=this.groups[this.rows[this.activeRow].albumId].tracks[this.rows[this.activeRow].albumTrackId];
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
								on_mouse_lbtn_up(x, y);
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
						g_cursor.setCursor(IDC_HAND,'rating');
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
						g_cursor.setCursor(IDC_ARROW,1);
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

				if(this.ishover && this.activeRowTooltip > -1 && Math.abs(scroll - scroll_) < 2 && (this.rows[this.activeRowTooltip].type==2 || this.rows[this.activeRowTooltip].type==1 || this.rows[this.activeRowTooltip].type==0) && properties.showToolTip && !this.drag_moving) {
					if (!timers.showToolTip && !this.ishover_rating && g_tooltip.activeZone!=this.activeRowTooltip) {
						if(g_tooltip.activeZone!='') g_tooltip.Deactivate();
						if(this.rows[this.activeRowTooltip].tooltip && !(this.scrollbar.cursorDrag || this.scrollbar.cursorHover)){
							if(this.rows[this.activeRowTooltip].type==2 || this.rows[this.activeRowTooltip].type==1){
								album_info=this.rows[this.activeRowTooltip].groupkeysplit;
								new_tooltip_text=album_info[0]+"\n"+album_info[1];
							} else if(this.rows[this.activeRowTooltip].type==0){
								track_info=this.groups[this.rows[this.activeRowTooltip].albumId].tracks[this.rows[this.activeRowTooltip].albumTrackId];
								var add_fields = this.getAdditionalFields(this.rows[this.activeRowTooltip].infos);
								if(properties.doubleRowText) new_tooltip_text=track_info[1]+"\n"+track_info[0]+add_fields;
								else  new_tooltip_text=track_info[1]+" - "+track_info[0]+add_fields;
							}
							g_tooltip.ActivateDelay(new_tooltip_text, x+10, y+20, globalProperties.tooltip_button_delay, 1200, false, this.activeRowTooltip);
						} else if((g_tooltip.activeZone!=this.activeRowTooltip) || this.ishover_rating || this.scrollbar.cursorDrag || this.scrollbar.cursorHover){
							g_tooltip.Deactivate();
						}
					} else if((g_tooltip.activeZone!=this.activeRowTooltip) || this.ishover_rating || this.scrollbar.cursorDrag || this.scrollbar.cursorHover){
						g_tooltip.Deactivate();
					}
				} else if((g_tooltip.activeZone!=this.activeRowTooltip && g_tooltip.activeZone!='' && !isNaN(g_tooltip.activeZone)) || this.ishover_rating || this.scrollbar.cursorDrag || this.scrollbar.cursorHover){
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
								focus_changes.collapse = true;
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
								focus_changes.collapse = true;
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
                    (cScrollBar.enabled && cScrollBar.visible) && brw.scrollbar && brw.scrollbar.on_mouse(event, x, y);
                    // settings menu
                    !g_filterbox.inputbox.hover && this.context_menu(x, y,false,false);
                }
                break;
            case "wheel":
				g_tooltip.Deactivate();
                break;
            case "leave":
                // scrollbar
                (cScrollBar.enabled && cScrollBar.visible) && this.scrollbar && this.scrollbar.on_mouse(event, 0, 0);
				properties.showToolTip && g_tooltip.Deactivate();
				this.on_mouse("move", -1, -1);
                break;
            case "drag_over":
                g_dragndrop_bottom = false;
                if(this.groups.length > 0) {
                    var fin = this.rows.length;
                    for(var i = 0; i < fin; i++) {
                        this.dragndrop_check(x, y, i);
                    };
                    var rowId = fin - 1;
                    var item_height_row = (this.rows[rowId].type == 0 ? 1 : properties.groupHeaderRowsNumber+1);
                    var limit = this.rows[rowId].y + (item_height_row * properties.rowHeight);
					if(y<this.y+this.PaddingTop) {
						rowId=0
                        g_dragndrop_trackId = this.rows[rowId].playlistTrackId;
                        g_dragndrop_rowId = rowId;
					}
                    else if(y > limit || g_dragndrop_trackId==-1) {
                        g_dragndrop_bottom = true;
                        g_dragndrop_trackId = this.rows[rowId].playlistTrackId;
                        //g_dragndrop_rowId = rowId;
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
		this.setDisplayedPlaylistProperties(false);
		try{
			this.timerStartTime = Date.now();
		}catch(e){}
		brw.timerCounter = 0;
		this.g_time = setInterval(function() {
			brw.timerCounter++;
			//Restart if the animation is desyncronised
			try{
				if(Math.abs(brw.timerStartTime+brw.timerCounter*globalProperties.refreshRate-Date.now())>500){
					brw.startTimer();
				}
			}catch(e){}
			brw.timerScript();
		}, globalProperties.refreshRate);
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
			//images.loading_angle = (images.loading_angle+30) % 360;
			window.Repaint();
		};

		scroll_prev = scroll;
    }

	this.setGroupHeaderRowsNumber = (step) => {
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
                timers.mouseWheel = setTimeout(() => {
					properties.doubleRowText
                        ? setOneProperty("groupHeaderRowsNumberDouble", properties.groupHeaderRowsNumber)
					    : setOneProperty("groupHeaderRowsNumberSimple", properties.groupHeaderRowsNumber);
					setOneProperty("groupHeaderRowsNumber", properties.groupHeaderRowsNumber);

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

	this.setRowHeight = (step) => {
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
            }
            if(previous != properties.defaultRowHeight) {
                timers.mouseWheel = setTimeout(function() {
					setOneProperty("defaultRowHeight",properties.defaultRowHeight);
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
            }
        }
	};

	this.refreshThumbnails = () => {
        this.groups.forEach((group) => {
            group.tid = -1;
            group.load_requested = 0;
            group.cover_formated = false;
            group.mask_applied = false;
            group.save_requested = false;
            group.cover_img = null;
            group.cover_type = null;
        });
	};

	this.freeMemory = () => {
		this.refreshThumbnails();
	}	
	
	this.context_menu = function(x, y, id, row_id, context_items) {
		this.metadblist_selection = plman.GetPlaylistSelectedItems(g_active_playlist);
		var context_items = typeof context_items !== 'undefined' ? context_items : this.metadblist_selection;
		var _menu = window.CreatePopupMenu();
		var Context = fb.CreateContextMenuManager();
		var _child01 = window.CreatePopupMenu();

		if(properties.showSettingsMenu) {
			_menu.AppendMenuItem(MF_STRING, 1, "Settings...");
		}
		_menu.AppendMenuSeparator();

		if(!plman.IsAutoPlaylist(plman.ActivePlaylist)){
			var SortMenu = window.CreatePopupMenu(); //Custom Entries
			SortMenu.AppendTo(_menu, MF_STRING, "Sort by");

			SortMenu.AppendMenuItem(MF_STRING, 1036, "Artist / Album / Tracknumber");
			SortMenu.AppendMenuItem(MF_STRING, 1037, "Album / Tracknumber");
			SortMenu.AppendMenuItem(MF_STRING, 1043, "Tracknumber");
			SortMenu.AppendMenuItem(MF_STRING, 1044, "File path");
			SortMenu.AppendMenuItem(MF_STRING, 1045, "Title");
			SortMenu.AppendMenuItem(MF_STRING, 1040, "Date");
			SortMenu.AppendMenuItem(MF_STRING, 1041, "Shortest to longest");
			SortMenu.AppendMenuItem(MF_STRING, 1042, "Longest to shortest");
			SortMenu.AppendMenuItem(MF_STRING, 1046, "Rating");			
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

		if(brw.activeRow > -1 && !properties.showGroupHeaders && properties.doubleRowShowCover && properties.doubleRowText) {
			_menu.AppendMenuSeparator();
			_menu.AppendMenuItem(MF_STRING, 1010, "Refresh this image");
		} else if(brw.activeRow > -1 && this.rows[this.activeRow].type > 0 && this.rows[this.activeRow].type < 99){
			_menu.AppendMenuSeparator();
			_menu.AppendMenuItem(MF_STRING, 1010, "Refresh this image");
		}

		if(id !== false){
			_menu.AppendMenuSeparator();

			_child01.AppendTo(_menu, MF_STRING, "Send to...");
			_child01.AppendMenuItem(MF_STRING, 2000, "A new playlist...");
			let pl_count = plman.PlaylistCount;
			if (pl_count > 1) {
				_child01.AppendMenuItem(MF_SEPARATOR, 0, "");
			}

			for (var i=0; i < pl_count; i++) {
				if(i != this.playlist && !plman.IsAutoPlaylist(i)) {
					_child01.AppendMenuItem(MF_STRING, 2001 + i, plman.GetPlaylistName(i));
				};
			}

            let albumIndex = 0;
			brw.activeRow > -1 && (albumIndex = this.rows[this.activeRow].albumId);

			Context.InitContext(context_items);
			Context.BuildMenu(_menu, 2, -1);
		}

		var ret = _menu.TrackPopupMenu(x, y);
		if(ret > 1 && ret < 800) {
			Context.ExecuteByID(ret - 2);
		} else {
			switch (ret) {
                case 1:
                    this.settings_context_menu(x, y);
                    break;
                case 1010:
                    delete_file_cache(this.groups[albumIndex].metadb, albumIndex);
                    this.groups[albumIndex].tid = -1;
                    this.groups[albumIndex].load_requested = 0;
                    this.groups[albumIndex].cover_formated = false;
                    this.groups[albumIndex].mask_applied = false;
                    this.groups[albumIndex].save_requested = false;
                    g_image_cache.resetMetadb(this.groups[albumIndex].metadb);
                    this.groups[albumIndex].cover_img = null;
                    this.groups[albumIndex].cover_type = null;
                    this.repaint();
                    window.NotifyOthers("RefreshImageCover",this.groups[albumIndex].metadb)
                    break;
                case 1011:
                    window.NotifyOthers("JSSmoothPlaylist->JSSmoothBrowser:show_item", this.metadblist_selection[0]);
                    break;
                case 1020:
                    removeItems(this.metadblist_selection,g_active_playlist);
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
                    this.dont_scroll_to_focus = true;
                    plman.SortByFormatV2(g_active_playlist,sort_by_album_artist);
                    this.scroll = this.offset = 0;
                    break;
                case 1037:
                    this.dont_scroll_to_focus = true;
                    plman.SortByFormatV2(g_active_playlist,sort_by_album);
                    this.scroll = this.offset = 0;
                    break;
                case 1038:
                    this.dont_scroll_to_focus = true;
                    plman.SortByFormatV2(g_active_playlist,sort_by_tracknumber);
                    this.scroll = this.offset = 0;
                    break;
                case 1039:
                    this.dont_scroll_to_focus = true;
                    plman.SortByFormat(g_active_playlist,"");
                    this.scroll = this.offset = 0;
                    break;
                case 1040:
                    this.dont_scroll_to_focus = true;
                    plman.SortByFormatV2(g_active_playlist,sort_by_date);
                    this.scroll = this.offset = 0;
                    break;
                case 1041:
                    this.dont_scroll_to_focus = true;
                    plman.SortByFormatV2(g_active_playlist,sort_by_time,1);
                    this.scroll = this.offset = 0;
                    break;
                case 1042:
                    this.dont_scroll_to_focus = true;
                    plman.SortByFormatV2(g_active_playlist,sort_by_time,-1);
                    this.scroll = this.offset = 0;
                    break;
                case 1043:
                    this.dont_scroll_to_focus = true;
                    plman.SortByFormatV2(g_active_playlist,sort_by_tracknumber,1);
                    this.scroll = this.offset = 0;
                    break;
                case 1044:
                    this.dont_scroll_to_focus = true;
                    plman.SortByFormatV2(g_active_playlist,sort_by_path,1);
                    this.scroll = this.offset = 0;
                    break;
                case 1045:
                    this.dont_scroll_to_focus = true;
                    plman.SortByFormatV2(g_active_playlist,sort_by_title,1);
                    this.scroll = this.offset = 0;
                    break;
                case 1046:
                    this.dont_scroll_to_focus = true;
                    plman.SortByFormatV2(g_active_playlist,sort_by_rating,1);
                    this.scroll = this.offset = 0;
                    break;				
                case 2000:
                    fb.RunMainMenuCommand("File/New playlist");
                    plman.InsertPlaylistItems(plman.PlaylistCount-1, 0, this.metadblist_selection, false);
                    break;
                default:
                    let insert_index = plman.PlaylistItemCount(ret - 2001);
                    plman.InsertPlaylistItems((ret-2001), insert_index, this.metadblist_selection, false);
                    break;
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
			lockOnMenu.AppendMenuSeparator();
			lockOnMenu.AppendMenuItem(MF_STRING, 3298, "Automatically switch back to Playing or Active playlist");
			lockOnMenu.CheckMenuItem(3298, properties.enableAutoSwitchPlaylistMode);
			lockOnMenu.AppendMenuItem(MF_STRING, 3297, "Playing playlist: display Active playlist when nothing is played");
			lockOnMenu.CheckMenuItem(3297, properties.displayActiveOnPlaybackStopped);

			var pl_count = plman.PlaylistCount;

			if (pl_count > 1) {
				lockOnMenu.AppendMenuItem(MF_SEPARATOR, 0, "");
			}

			for (var i=0; i < pl_count; i++) {
				if(i != this.playlist) {
					playlist_name = plman.GetPlaylistName(i);
					lockOnMenu.AppendMenuItem(MF_STRING, 3301 + i, plman.GetPlaylistName(i));
				};
			}

            playlist_idx = properties.lockOnPlaylistNamed !== ''
                ? check_playlist(properties.lockOnPlaylistNamed)
                : -1;

			if (playlist_idx > -1) {
				lockOnMenu.CheckMenuItem(3301 + playlist_idx, true);
			} else {
				lockOnMenu.CheckMenuItem(3299, !properties.lockOnNowPlaying);
				lockOnMenu.CheckMenuItem(3300, properties.lockOnNowPlaying);
			}


            _menu.AppendMenuItem(MF_STRING, 899, "Follow now playing");
			_menu.CheckMenuItem(899, properties.FollowNowPlaying);
            _menu.AppendMenuItem(((fb.IsPlaying && !(!properties.enableAutoSwitchPlaylistMode && properties.lockOnPlaylistNamed!="")) ? MF_STRING : MF_GRAYED | MF_DISABLED), 900, "Show now playing");
            _menu.AppendMenuItem(MF_STRING, 901, "Enable drag'n'drop to a playlist");
			_menu.CheckMenuItem(901, properties.DropInplaylist);

            _menu.AppendMenuSeparator();
            _menu.AppendMenuItem(MF_STRING, 112, "Circle Artwork");
            _menu.CheckMenuItem(112, properties.circleMode);
			_rowHeight.AppendMenuItem(MF_STRING, 1001, "Increase");
			_rowHeight.AppendMenuItem(MF_STRING, 1000, "Decrease");
			_rowHeight.AppendMenuSeparator();
			_rowHeight.AppendMenuItem(MF_DISABLED, 0, "Tip: Hold SHIFT and use your");
			_rowHeight.AppendMenuItem(MF_DISABLED, 0, "mouse wheel over the panel!");
			_rowHeight.AppendTo(_menu,MF_STRING, "Row height");

			_rowStyle.AppendMenuItem(MF_STRING, 911, "Single Line");
			_rowStyle.AppendMenuItem(MF_STRING, 912, "Double Line");
			_rowStyle.AppendMenuItem(MF_STRING, 913, "Double Line with covers");
			_rowStyle.CheckMenuRadioItem(911, 913, (!properties.doubleRowText) ? 911 : (!properties.doubleRowShowCover) ? 912 : 913);
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

			var _menu_title = window.CreatePopupMenu();
            _menu_title.AppendMenuItem(MF_STRING, 905, "Show a tooltip for long track titles");
			_menu_title.CheckMenuItem(905, properties.showToolTip);
            _menu_title.AppendMenuItem(MF_STRING, 906, "Show playcount");
			_menu_title.CheckMenuItem(906, properties.showPlaycount);
            _menu_title.AppendMenuItem(MF_STRING, 908, "Show codec");
			_menu_title.CheckMenuItem(908, properties.showCodec);
            _menu_title.AppendMenuItem(MF_STRING, 907, "Show bitrate");
			_menu_title.CheckMenuItem(907, properties.showBitrate);
            _menu_title.AppendMenuItem((!properties.doubleRowText ? (!properties.showGroupHeaders ? MF_GRAYED | MF_DISABLED : MF_STRING) : MF_GRAYED | MF_DISABLED), 111, "Always append artist to title");
            _menu_title.CheckMenuItem(111, properties.showArtistAlways);
			_menu_title.AppendTo(_menu,MF_STRING, "Track infos");

			_menu1.AppendMenuItem(MF_STRING, 914, "No progress bar");
			_menu1.AppendMenuItem(MF_STRING, 916, "White Progress bar");
			_menu1.AppendMenuItem(MF_STRING, 915, "Progress bar according to the album art");
			_menu1.CheckMenuRadioItem(914, 916, (!properties.drawProgressBar) ? 914 : (properties.AlbumArtProgressbar) ? 915 : 916);
            _menu1.AppendTo(_menu,MF_STRING, "Progress bar under playing title");

			_menuRating.AppendMenuItem(MF_STRING, 113, "Show rating for each track");
			_menuRating.AppendMenuItem(MF_STRING, 114, "Show rating for selected track");
			_menuRating.AppendMenuItem(MF_STRING, 117, "Show rating for rated tracks");
			_menuRating.AppendMenuItem(MF_STRING, 115, "Show rating for selected and rated tracks");
			_menuRating.AppendMenuItem(MF_STRING, 116, "Don't show rating");
			_menuRating.CheckMenuRadioItem(113, 117, (properties.showRating && !properties.showRatingSelected && !properties.showRatingRated) ? 113 : (properties.showRating && properties.showRatingSelected && !properties.showRatingRated) ? 114 : (properties.showRating && properties.showRatingRated && properties.showRatingSelected) ? 115 : (properties.showRating && properties.showRatingRated) ? 117 : 116);
			_menuRating.AppendTo(_menu,MF_STRING, "Rating display");

			if (layout_state === 0){
				var _panelWidth = window.CreatePopupMenu();
				_panelWidth.AppendMenuItem(MF_STRING, 2030, "Increase width");
				_panelWidth.AppendMenuItem(MF_STRING, 2031, "Decrease width");
				_panelWidth.AppendMenuItem(MF_STRING, 2033, "Custom width...");
				_panelWidth.AppendMenuItem(MF_STRING, 2032, "Reset");
				_panelWidth.AppendTo(_menu,MF_STRING, "Panel width");
			}

            _menu2.AppendMenuItem(MF_STRING, 200, "Enable");
            _menu2.CheckMenuItem(200, properties.showwallpaper);
            _menu2.AppendMenuItem(MF_STRING, 220, "Blur");
            _menu2.CheckMenuItem(220, properties.wallpaperblurred);

            _menu2A.AppendMenuItem(MF_STRING, 221, "Filling");
            _menu2A.CheckMenuItem(221, properties.wallpaperdisplay === 0);
            _menu2A.AppendMenuItem(MF_STRING, 222, "Adjust");
            _menu2A.CheckMenuItem(222, properties.wallpaperdisplay === 1);
            _menu2A.AppendMenuItem(MF_STRING, 223, "Stretch");
            _menu2A.CheckMenuItem(223, properties.wallpaperdisplay === 2);
			_menu2A.AppendTo(_menu2,MF_STRING, "Wallpaper size");

            _menu2.AppendTo(_menu, MF_STRING, "Background Wallpaper");

			if (layout_state === 0 && main_panel_state === 1) {
				_menu.AppendMenuSeparator();
				_menu.AppendMenuItem(MF_STRING, 993, "Hide this playlist");
			}

            idx = _menu.TrackPopupMenu(x,y);

            if (idx > 3300) {
                setOneProperty("lockOnNowPlaying",false);
                setOneProperty("lockOnPlaylistNamed",plman.GetPlaylistName(idx-3301));
                brw.populate(true,4);
            } else {
                switch(idx) {
                    case 111:
                        setOneProperty("showArtistAlways",!properties.showArtistAlways);
                        get_metrics();
                        brw.repaint();
                        break;
                    case 112:
                        setOneProperty("circleMode",!properties.circleMode);
                        brw.refreshThumbnails();
                        brw.repaint();
                        break;
                    case 113:
                        setOneProperty("showRating",true);
                        setOneProperty("showRatingSelected",false);
                        setOneProperty("showRatingRated",false);
                        get_metrics();
                        brw.repaint();
                        break;
                    case 114:
                        setOneProperty("showRating",true);
                        setOneProperty("showRatingSelected",true);
                        setOneProperty("showRatingRated",false);
                        get_metrics();
                        brw.repaint();
                        break;
                    case 115:
                        setOneProperty("showRating",true);
                        setOneProperty("showRatingSelected",true);
                        setOneProperty("showRatingRated",true);
                        get_metrics();
                        brw.repaint();
                        break;
                    case 116:
                        setOneProperty("showRating",false);
                        setOneProperty("showRatingSelected",false);
                        setOneProperty("showRatingRated",false);
                        get_metrics();
                        brw.repaint();
                        break;
                    case 117:
                        setOneProperty("showRating",true);
                        setOneProperty("showRatingSelected",false);
                        setOneProperty("showRatingRated",true);
                        get_metrics();
                        brw.repaint();
                        break;
                    case 118:
                        setOneProperty("showMood",!properties.showMood);
                        get_metrics();
                        brw.repaint();
                        break;
                    case 200:
                        toggleWallpaper();
                        break;
                    case 210:
                        setOneProperty("wallpapermode",99);
                        on_colours_changed();
                        if(fb.IsPlaying) g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
                        brw.repaint();
                        break;
                    case 211:
                        setOneProperty("wallpapermode",0);
                        on_colours_changed();
                        if(fb.IsPlaying) g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
                        brw.repaint();
                        break;
                    case 220:
                        setOneProperty("wallpaperblurred",!properties.wallpaperblurred);
                        on_colours_changed();
                        g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
                        brw.repaint();
                        break;
                    case 221:
                        setOneProperty("wallpaperdisplay",0);
                        g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
                        brw.repaint();
                        break;
                    case 222:
                        setOneProperty("wallpaperdisplay",1);
                        g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
                        brw.repaint();
                        break;
                    case 223:
                        setOneProperty("wallpaperdisplay",2);
                        g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
                        brw.repaint();
                        break;
                    case 300:
                        setOneProperty("showGroupHeaders",!properties.showGroupHeaders);
                        get_metrics();
                        on_colours_changed();
                        if(properties.autocollapse) {
                            setOneProperty("autocollapse",false);
                        }
                        if(!properties.showGroupHeaders) brw.collapseAll(false);
                        brw.populate(is_first_populate = false,3, false);
                        brw.repaint();
                        break;
                    case 301:
                        if(properties.groupHeaderRowsNumberSimple!=2 || properties.groupHeaderRowsNumberDouble!=1) {
                            setOneProperty("groupHeaderRowsNumber",2);
                            setOneProperty("groupHeaderRowsNumberSimple",properties.groupHeaderRowsNumber);
                            setOneProperty("groupHeaderRowsNumberDouble",1);
                            get_metrics();
                            get_images();
                            brw.ratingImages = false;
                            brw.repaint();
                        }
                        break;
                    case 302:
                        if(properties.groupHeaderRowsNumberSimple!=3 || properties.groupHeaderRowsNumberDouble!=2) {
                            setOneProperty("groupHeaderRowsNumber",3);
                            setOneProperty("groupHeaderRowsNumberSimple",properties.groupHeaderRowsNumber);
                            setOneProperty("groupHeaderRowsNumberDouble",2);
                            get_metrics();
                            get_images();
                            brw.ratingImages = false;
                            brw.repaint();
                        }
                        break;
                    case 303:
                        if(properties.groupHeaderRowsNumberSimple!=4 || properties.groupHeaderRowsNumberDouble!=2) {
                            setOneProperty("groupHeaderRowsNumber",4);
                            setOneProperty("groupHeaderRowsNumberSimple",properties.groupHeaderRowsNumber);
                            setOneProperty("groupHeaderRowsNumberDouble",2);
                            get_metrics();
                            get_images();
                            brw.ratingImages = false;
                            brw.repaint();
                        }
                        break;
                    case 310:
                        setOneProperty("autocollapse",!properties.autocollapse);
                        brw.populate(false,4, false);
                        brw.showFocusedItem();
                        break;
                    case 320:
                        brw.collapseAll(true);
                        brw.showFocusedItem();
                        break;
                    case 330:
                        brw.collapseAll(false);
                        brw.showFocusedItem();
                        break;
                    case 899:
                        setOneProperty("FollowNowPlaying",!properties.FollowNowPlaying);
                        if(properties.FollowNowPlaying) brw.showNowPlaying();
                        break;
                    case 900:
                        brw.showNowPlaying();
                        break;
                    case 901:
                        setOneProperty("DropInplaylist",!properties.DropInplaylist);
                        pman.populate(exclude_active = false, reset_scroll = true);
                        get_metrics();
                        brw.repaint();
                        break;
                    case 902:
                        enableDiskCacheGlobally()
                        brw.repaint();
                        break;
                    case 903:
                        enableCoversAtStartupGlobally()
                        break;
                    case 905:
                        setOneProperty("showToolTip",!properties.showToolTip);
                        brw.repaint();
                        break;
                    case 906:
                        setOneProperty("showPlaycount",!properties.showPlaycount);
                        g_var_cache.resetAll();
                        brw.repaint();
                        break;
                    case 907:
                        setOneProperty("showBitrate",!properties.showBitrate);
                        g_var_cache.resetAll();
                        brw.repaint();
                        break;
                    case 908:
                        setOneProperty("showCodec",!properties.showCodec);
                        g_var_cache.resetAll();
                        brw.repaint();
                        break;
                    case 910:
                        if(getTrackInfosState() && window.Name!="BottomPlaylist" && layout_state.isEqual(0)) setOneProperty("showHeaderBarTrackInfosOn",!properties.showHeaderBarTrackInfosOn);
                        else setOneProperty("showHeaderBarTrackInfosOff",!properties.showHeaderBarTrackInfosOff);
                        setShowHeaderBar();
                        get_metrics();
                        brw.repaint();
                        break;
                    case 911:
                        if(properties.doubleRowText) {
                            setOneProperty("doubleRowText",false);
                            get_metrics();
                            get_images();
                            brw.ratingImages = false;
                            brw.repaint();
                        }
                        break;
                    case 912:
                        if(!properties.doubleRowText || (properties.doubleRowText && properties.doubleRowShowCover)) {
                            setOneProperty("doubleRowText",true);
                            setOneProperty("doubleRowShowCover",false);
                            get_metrics();
                            get_images();
                            brw.ratingImages = false;
                            brw.repaint();
                        }
                        break;
                    case 913:
                        if(!properties.doubleRowText || !properties.doubleRowShowCover) {
                            setOneProperty("doubleRowText",true);
                            setOneProperty("doubleRowShowCover",true);
                            on_colours_changed();
                            get_metrics();
                            get_images();
                            brw.ratingImages = false;
                            brw.repaint();
                        }
                        break;
                    case 914:
                        setOneProperty("drawProgressBar",false);
                        setOneProperty("AlbumArtProgressbar",false);
                        get_images();
                        brw.repaint();
                        break;
                    case 915:
                        setOneProperty("drawProgressBar",true);
                        setOneProperty("AlbumArtProgressbar",true);
                        get_images();
                        brw.repaint();
                        break;
                    case 916:
                        setOneProperty("drawProgressBar",true);
                        setOneProperty("AlbumArtProgressbar",false);
                        get_images();
                        brw.repaint();
                        break;
                    case 991:
                        window.ShowProperties();
                        break;
                    case 992:
                        window.ShowConfigure();
                        break;
                    case 993:
                        set_nowplaying_state(0);
                        break;
                    case 1000:
                        this.setRowHeight(-2);
                        break;
                    case 1001:
                        this.setRowHeight(2);
                        break;
                    case 2030:
                        rightplaylist_width.increment(10);
                        break;
                    case 2031:
                        rightplaylist_width.decrement(10);
                        break;
                    case 2032:
                        rightplaylist_width.setDefault();
                        break;
                    case 2033:
                        rightplaylist_width.userInputValue("Enter the desired width in pixel.\nDefault width is 270px.\nMinimum width: 100px. Maximum width: 900px", "Custom left menu width");
                        break;
                    case 3297:
                        setOneProperty("displayActiveOnPlaybackStopped",!properties.displayActiveOnPlaybackStopped, true);
                        if(properties.displayActiveOnPlaybackStopped && !fb.IsPlaying){
                            brw.populate(true,4);
                        }
                        break;
                    case 3298:
                        setOneProperty("enableAutoSwitchPlaylistMode",!properties.enableAutoSwitchPlaylistMode, true);
                        if(properties.enableAutoSwitchPlaylistMode){
                            if(filters_panel_state.isMaximumValue()) setOneProperty("lockOnNowPlaying",false);
                            else setOneProperty("lockOnNowPlaying",true);
                            setOneProperty("lockOnPlaylistNamed","");
                            brw.populate(true,4);
                        }
                        break;
                    case 3299:
                        setOneProperty("lockOnNowPlaying",false);
                        setOneProperty("lockOnPlaylistNamed","");
                        brw.populate(true,4);
                        break;
                    case 3300:
                        setOneProperty("lockOnNowPlaying",true);
                        setOneProperty("lockOnPlaylistNamed","");
                        brw.populate(true,4);
                        break;
                };
            }

            _menu2 = undefined;
			_menu2A = undefined;
            _menu1 = undefined;
            _menu = undefined;
			_menuRating = undefined;
			_rowHeight = undefined;
			_rowStyle = undefined;
            g_rbtn_click = false;
            return true;
    }

    this.incrementalSearch = function() {
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
    }
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
var g_image_cache = false;

// START
function on_size() {
    window.DlgCode = 0x0004;

    ww = Math.max(window.Width,globalProperties.miniMode_minwidth);
    wh = Math.max(window.Height,globalProperties.minMode_minheight);
    wh_real = window.Height;

    if (!ww || !wh) {
        ww = 1;
        wh = 1;
		return;
    }

	if (window.IsVisible || first_on_size || !g_first_populate_done || update_size){
		window.MinWidth = 1;
		window.MinHeight = 1;

		// set wallpaper
		update_wallpaper = !(properties.showwallpaper && window.IsVisible);

		brw.setSize(0, (properties.showHeaderBar ? properties.headerBarHeight : 0), ww, wh - (properties.showHeaderBar ? properties.headerBarHeight : 0));
		update_size = false;
		first_on_size = false;
	} else {
        update_size = true;
    }
};
function set_update_function(string){
	if (Update_Required_function.indexOf("on_playback_new_track(") !== -1) {
		repopulate = string.indexOf("brw.populate") !== -1;
		return;
	} else if (Update_Required_function.indexOf("brw.populate(true") !== -1) {
        return;
    }
	else if(Update_Required_function.indexOf("brw.populate(false") !== -1) {
		if (string.indexOf("brw.populate(true") !== -1) {
            Update_Required_function = string;
        }
	}
	else {
        Update_Required_function = string;
    }
}

function on_paint(gr) {
	if(Update_Required_function!="") {
		eval(Update_Required_function);
		Update_Required_function = "";
	}

	if((typeof(g_wallpaperImg) == "undefined" || !g_wallpaperImg || update_wallpaper) && properties.showwallpaper){
		updateWallpaper(fb.GetNowPlaying());
		update_wallpaper = false;		
	}

    if (!ww) {
        return;
    }

    if(!g_1x1) {
        // draw background under playlist
		gr.FillSolidRect(0, 0, ww, wh, colors.normal_bg);
        if(fb.IsPlaying && g_wallpaperImg && properties.showwallpaper) {
            gr.DrawImage(g_wallpaperImg, 0, 0, ww, wh, 0, 0, g_wallpaperImg.Width, g_wallpaperImg.Height);
            gr.FillSolidRect(0, 0, ww, wh, (properties.wallpaperblurred)?colors.wallpaper_overlay_blurred:colors.wallpaper_overlay);
        } else if(g_wallpaperImg && properties.showwallpaper) {
			gr.DrawImage(g_wallpaperImg, 0, 0, ww, wh, 0, 0, g_wallpaperImg.Width, g_wallpaperImg.Height);
			gr.FillSolidRect(0, 0, ww, wh, (properties.wallpaperblurred)?colors.wallpaper_overlay_blurred:colors.wallpaper_overlay);
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
                }
            }
        }
    }
};

function on_mouse_lbtn_down(x, y, m) {
    g_lbtn_click = true;
    g_rbtn_click = false;
	focus_changes.collapse = true;
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

	var isResizing = g_resizing.on_mouse("lbtn_down", x, y, m);
	if(!isResizing){
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
				} else {
                    brw.on_mouse("down", x, y);
                }
			}
		} else {
			// scrollbar
			if(brw.scrollbar._isHover(x, y) && cScrollBar.enabled && cScrollBar.visible) {
				brw.scrollbar && brw.scrollbar.on_mouse("down", x, y);
			} else {
                brw.on_mouse("down", x, y);
            }
		}

		// inputBox
		properties.showHeaderBar && properties.showFilterBox && g_filterbox.inputbox.visible && g_filterbox.on_mouse("lbtn_down", x, y);
	}
}

function on_mouse_lbtn_up(x, y, m) {
    // inputBox
    properties.showHeaderBar && properties.showFilterBox && g_filterbox.inputbox.visible && g_filterbox.on_mouse("lbtn_up", x, y);

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
		g_cursor.setCursor(IDC_ARROW,2);
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
        }
    }

    g_lbtn_click = false;
}

function on_mouse_lbtn_dblclk(x, y, mask) {
    if(y >= brw.y) {
        brw.on_mouse("dblclk", x, y);
    } else if(x > brw.x && x < brw.x + brw.w) {
        brw.showNowPlaying();
    } else {
        brw.on_mouse("dblclk", x, y);
    };

}

function on_mouse_rbtn_down(x, y, mask) {
    g_rbtn_click = true;
	if(brw.drag_tracks){
		brw.drag_clicked = false;
		on_drag_leave();
		brw.drag_tracks = false;
		g_cursor.setCursor(IDC_ARROW,3);
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
}

function on_mouse_mbtn_down(x, y, mask) {
	if(brw.drag_tracks){
		brw.drag_clicked = false;
		on_drag_leave();
		brw.drag_tracks = false;
		g_cursor.setCursor(IDC_ARROW,4);
		brw.repaint();
	}
}

function on_mouse_mbtn_up(x, y, mask) {
    // emulate a selection click
	brw.on_mouse("down", x, y);
    brw.on_mouse("up", x, y);

    // add playlist selection to queue
    let selection = plman.GetPlaylistSelectedItems(g_active_playlist);
    for (let i = 0; i < selection.Count; ++i) {
        let item = selection[i];
        plman.AddItemToPlaybackQueue(item);
    }
}

function on_mouse_rbtn_up(x, y){
    g_rbtn_click = false;

    if(!utils.IsKeyPressed(VK_SHIFT)) {
        return;
    };
}

function on_mouse_move(x, y, m) {
	if(g_cursor.x==x && g_cursor.y==y) return;
	g_cursor.onMouse("move", x, y, m);

    // inputBox
    if(properties.showHeaderBar && properties.showFilterBox && g_filterbox.inputbox.visible && !brw.drag_tracks) {
        g_filterbox.on_mouse("move", x, y);
    };

	var isResizing = g_resizing.on_mouse("move", x, y, m, layout_state.isEqual(0));
	if(isResizing){
		if(g_resizing.resizing_x>x+5){
			g_resizing.resizing_x = x;
			rightplaylist_width.increment(5);
		} else if(g_resizing.resizing_x<x-5){
			g_resizing.resizing_x = x;
			rightplaylist_width.decrement(5);
		}
	} else {
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
};

function on_mouse_wheel(step, stepstrait, delta){
    intern_step = (typeof(stepstrait) === 'undefined' || typeof(delta) === 'undefined')
        ? step
        : stepstrait / delta;

    if (cTouch.timer) {
        window.ClearInterval(cTouch.timer);
        cTouch.timer = false;
    }

    if (utils.IsKeyPressed(VK_SHIFT)) {
		brw.setRowHeight(intern_step);
    } else if(utils.IsKeyPressed(VK_CONTROL)) {
        let zoomStep = 1;
        let previous = globalProperties.fontAdjustement;
        if(!timers.mouseWheel) {
			if(intern_step > 0) {
				globalProperties.fontAdjustement += zoomStep;
				if(globalProperties.fontAdjustement > globalProperties.fontAdjustement_max) globalProperties.fontAdjustement = globalProperties.fontAdjustement_max;
			} else {
				globalProperties.fontAdjustement -= zoomStep;
				if(globalProperties.fontAdjustement < globalProperties.fontAdjustement_min) globalProperties.fontAdjustement = globalProperties.fontAdjustement_min;
			};
            if(previous != globalProperties.fontAdjustement) {
                timers.mouseWheel = setTimeout(function() {
					on_notify_data('set_font',globalProperties.fontAdjustement);
					window.NotifyOthers('set_font',globalProperties.fontAdjustement);
                    timers.mouseWheel && clearTimeout(timers.mouseWheel);
                    timers.mouseWheel = false;
                }, 100);
            };
        };
    } else {
        if(properties.DropInplaylist && pman.state == 1) {
            pman.scr_w > 0 && pman.on_mouse("wheel", g_cursor.x, g_cursor.y, intern_step);
        } else if(cScrollBar.visible) {
            let rowStep = properties.rowScrollStep;
            scroll -= intern_step * properties.rowHeight * rowStep;
            scroll = check_scroll(scroll);
            brw.on_mouse("wheel", g_cursor.x, g_cursor.y, intern_step);
        }
    }

};

function on_mouse_leave() {
	g_resizing.on_mouse("leave", -1, -1);
    // inputBox
    if(properties.showHeaderBar && properties.showFilterBox && g_filterbox.inputbox.visible) {
        g_filterbox.on_mouse("leave", 0, 0);
    };
    brw.on_mouse("leave", 0, 0);
};

//=================================================// Metrics & Fonts & Colors & Images
function get_metrics(finalize_groups) {
	var finalize_groups = typeof finalize_groups !== 'undefined' ? finalize_groups : false;

	g_zoom_percent = Math.floor(g_fsize / 12 * 100);

	if(properties.doubleRowText) properties.groupHeaderRowsNumber = properties.groupHeaderRowsNumberDouble;
	else properties.groupHeaderRowsNumber = properties.groupHeaderRowsNumberSimple;
    if(!properties.showGroupHeaders) properties.extraRowsNumber=0;
	else properties.extraRowsNumber = getProperty("extraRowsNumber", 0);

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
    cFilterBox.h = Math.round(cFilterBox.default_h * 100 / 100);

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
        brw.setList(finalize_groups);
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

	if(properties.AlbumArtProgressbar || properties.darklayout || (properties.doubleRowText && properties.doubleRowShowCover)){
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
    images.loading_cover = img_loading;
    images.loading_cover_group = img_loading;
    images.loading_cover_resized = false;
    images.loading_cover_group_resized = false;
};



function get_colors() {
	get_colors_global();
	if(properties.darklayout){
		if(window.Name!="BottomPlaylist") colors.normal_txt = GetGrey(180);		
		colors.fadedsmall_txt = GetGrey(200);
		colors.tracknumber_txt = GetGrey(230);
		colors.flash_bg = GetGrey(255,30),
		colors.flash_rectline = GetGrey(255,61),

		colors.cover_rectline = GetGrey(255,40);
		colors.cover_rectline_AlbumArtProgressbar = GetGrey(255,90);

		colors.playing_cover_overlay = GetGrey(0,150);

		colors.grad_line = GetGrey(255,35);
		colors.grad_line_bg = GetGrey(0,0);
		colors.grad_line_selected = GetGrey(255,35);
		colors.grad_line_bg_selected = GetGrey(0,0);

		colors.grad_bottom_1 = GetGrey(0,70);
		colors.grad_bottom_2 = GetGrey(0,0);
		colors.fading_bottom_height = 39;

		colors.progressbar = GetGrey(255,45);
		colors.progressbar_bg_off = GetGrey(0,0);
		colors.progressbar_bg_on = GetGrey(255,20);
		colors.progressbar_shadow = GetGrey(0,15)
		colors.albumartprogressbar_txt = GetGrey(255);
		colors.albumartprogressbar_overlay = GetGrey(0,20);
		colors.albumartprogressbar_rectline = GetGrey(255,40);
	} else {
		colors.tracknumber_txt = GetGrey(130);

		colors.cover_rectline = GetGrey(0,30);
		colors.cover_rectline_AlbumArtProgressbar = GetGrey(255,90);

		colors.playing_cover_overlay = GetGrey(0,100);

		colors.flash_bg = GetGrey(0,10);
		colors.flash_rectline = GetGrey(0,41);

		if(properties.showwallpaper) {
			colors.fadedsmall_txt = GetGrey(125);
		} else {
			colors.fadedsmall_txt = GetGrey(125);
		}

		colors.grad_line = GetGrey(0,37);
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
	colors.line_top_dark = GetGrey(200);
};

function on_font_changed() {
	g_var_cache.resetAll();
    get_font();
	brw.ratingImages = false;
	g_filterbox.onFontChanged();
	g_filterbox.setSize(this.w, cFilterBox.h+2);
    get_metrics();
    brw.repaint();
};

function setDarkLayout(){
	var new_darklayout_state = false;
	if(window.Name=="BottomPlaylist") new_darklayout_state = properties.playlists_dark_theme;
	else if(layout_state.isEqual(1)) new_darklayout_state = properties.minimode_dark_theme;
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

function on_colours_changed(force) {
	new_darklayout_state = setDarkLayout();
	if(properties.darklayout!=new_darklayout_state || force){
		setOneProperty("darklayout",new_darklayout_state);
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
	//console.log("g_focus_row"+g_focus_row+"  getRowIdfromPlaylistTrackId"+brw.getRowIdfromPlaylistTrackId(g_focus_id)); 
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

    //new_row = g_focus_row - scrollstep;
	new_row = brw.getOffsetFocusItem(g_focus_id) - scrollstep; //brw.getRowIdfromPlaylistTrackId(g_focus_id) - scrollstep;
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
        new_focus_id = brw.rows[new_row].playlistTrackId_original;
        plman.ClearPlaylistSelection(g_active_playlist);
        plman.SetPlaylistSelectionSingle(g_active_playlist, new_focus_id, true);
        plman.SetPlaylistFocusItem(g_active_playlist, new_focus_id);
		focus_changes.collapse = true;
    } else {
        // kill timer
        cScrollBar.timerCounter = -1;
        cScrollBar.timerID && clearTimeout(cScrollBar.timerID);
        cScrollBar.timerID = false;
    };
};

function vk_down() {
    var new_focus_id = 0, new_row = 0;	
    //new_row = g_focus_row + scrollstep;
	new_row = brw.getOffsetFocusItem(g_focus_id) + 1; //new_row = brw.getRowIdfromPlaylistTrackId(g_focus_id) + 1;
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
		//console.log("new_row"+new_row+" g_focus_id"+g_focus_id+" brw.row lenght"+brw.rows.length+" brw.rows[new_row].albumId"+brw.rows[new_row].albumId+" brw.rows[new_row].type"+brw.rows[new_row].type+"brw.groups[brw.rows[new_row]"+brw.groups[brw.rows[new_row]]+"brw.groups length"+brw.groups.length+" brw.groups[new_row]"+brw.groups[new_row].collapsed)		
		if(typeof brw.rows[new_row] == 'undefined') return;
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
        new_focus_id = brw.rows[new_row].playlistTrackId_original;
        plman.ClearPlaylistSelection(g_active_playlist);
        plman.SetPlaylistSelectionSingle(g_active_playlist, new_focus_id, true);
        plman.SetPlaylistFocusItem(g_active_playlist, new_focus_id);
		focus_changes.collapse = true;
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
		focus_changes.collapse = true;
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
		focus_changes.collapse = true;
    } else {
        // kill timer
        cScrollBar.timerCounter = -1;
        cScrollBar.timerID && clearTimeout(cScrollBar.timerID);
        cScrollBar.timerID = false;
    };
};

function on_key_down(vkey) {
    var mask = GetKeyboardMask();
	var active_filterbox = false;

    if(cSettings.visible) {

    } else {
        //if(dragndrop.drag_in) return true;

        // inputBox
        if(properties.showHeaderBar && properties.showFilterBox && g_filterbox.inputbox.visible) {
			active_filterbox = g_filterbox.inputbox.isActive();
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
				if(active_filterbox) g_filterbox.clearInputbox();
				else if(g_uihacks.getFullscreenState()) g_uihacks.toggleFullscreen();
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
					focus_changes.collapse = true;
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
					focus_changes.collapse = true;
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
									focus_changes.collapse = true;
                                };
                            } else if(brw.SHIFT_count < 0) {
                                if(g_focus_id > 0) {
                                    brw.SHIFT_count--;
                                    g_focus_id--;
                                    plman.SetPlaylistSelectionSingle(act_pls, g_focus_id, true);
                                    plman.SetPlaylistFocusItem(act_pls, g_focus_id);
									focus_changes.collapse = true;
                                };
                            } else {
                                plman.SetPlaylistSelectionSingle(act_pls, g_focus_id, false);
                                brw.SHIFT_count--;
                                g_focus_id--;
                                plman.SetPlaylistFocusItem(act_pls, g_focus_id);
								focus_changes.collapse = true;
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
									focus_changes.collapse = true;
                                };
                            } else if(brw.SHIFT_count>0) {
                                if(g_focus_id < brw.list.Count - 1) {
                                    brw.SHIFT_count++;
                                    g_focus_id++;
                                    plman.SetPlaylistSelectionSingle(act_pls, g_focus_id, true);
                                    plman.SetPlaylistFocusItem(act_pls, g_focus_id);
									focus_changes.collapse = true;
                                };
                            } else {
                                plman.SetPlaylistSelectionSingle(act_pls, g_focus_id, false);
                                brw.SHIFT_count++;
                                g_focus_id++;
                                plman.SetPlaylistFocusItem(act_pls, g_focus_id);
								focus_changes.collapse = true;
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
						setOneProperty("showHeaderBar",!properties.showHeaderBar);
                        get_metrics();
                        brw.scrollbar.updateScrollbar();
                        brw.repaint();
                    };
                    if(vkey == 48 || vkey == 96) { // CTRL+0
                        var previous = globalProperties.fontAdjustement;
                        if(!timers.mouseWheel) {
                            globalProperties.fontAdjustement = 0;
                            if(previous != globalProperties.fontAdjustement) {
								timers.mouseWheel = setTimeout(function() {
									on_notify_data('set_font',globalProperties.fontAdjustement);
									window.NotifyOthers('set_font',globalProperties.fontAdjustement);
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
	g_elapsed_seconds = null;
	g_time_remaining = null;
	g_total_seconds = null;
	g_metadb = null;

	switch(reason) {
	case 0: // user stop
	case 1: // eof (e.g. end of playlist)
		// update wallpaper
		nowplaying_cachekey = '';
		if(properties.showwallpaper && properties.wallpapermode == 0) {
			if(window.IsVisible) g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, null);
			else update_wallpaper = true;
		};
		brw.repaint();
		break;
	case 2: // starting_another (only called on user action, i.e. click on next button)
		break;
	};

	g_radio_title = "loading live tag ...";
	g_radio_artist = "";
};
function on_playback_dynamic_info_track() {
	g_radio_title = TF.title.Eval(true);
	g_radio_artist = TF.artist.Eval(true);
	if(g_time_remaining=="ON AIR" || g_total_seconds=="ON AIR") {
		g_radio_title = g_radio_title + ((g_radio_artist.length>0)?' - '+g_radio_artist:'');
		g_radio_artist = "";
	}
}
function updateWallpaper(metadb){
	old_cachekey = nowplaying_cachekey;
	nowplaying_cachekey = process_cachekey(metadb);
	if(old_cachekey!=nowplaying_cachekey || nowplaying_cachekey=="undefined") {
		g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, metadb);
	}	
}
function on_playback_new_track(metadb) {
	if(brw.isPlayingIdx>=0) try{brw.groups[brw.isPlayingIdx].isPlaying = false;} catch(e){}
	try{
		playing_track_playcount = TF.play_count.Eval();
	} catch(e){}
	if(window.IsVisible){
		g_metadb = metadb;
		g_radio_title = "loading live tag ...";
		g_radio_artist = "";
		
		//Move expanded group
		/*if(properties.autocollapse && brw.isPlayingIdx>=0 && brw.isPlayingIdx<brw.groups.length && !brw.groups[brw.isPlayingIdx].collapsed){
			focus_changes.collapse = true;
		}*/
			
		if((properties.lockOnNowPlaying && plman.PlayingPlaylist!=g_active_playlist) || repopulate) {
			brw.populate(is_first_populate = true,6);
			repopulate = false;
		}
		if(properties.showwallpaper && properties.wallpapermode == 0) {
			updateWallpaper(metadb);
		} else update_wallpaper = true;
		
		if((((fb.CursorFollowPlayback || properties.FollowNowPlaying) && (!(window.Name=="BottomPlaylist" && g_active_playlist!=plman.PlayingPlaylist) || properties.lockOnNowPlaying)) && !(g_filterbox.inputbox.edit || g_filterbox.inputbox.length > 0)) || (brw.expanded_group<0 && properties.autocollapse && plman.PlayingPlaylist == g_active_playlist)) {		
			brw.dontFlashNowPlaying=true;
			brw.showNowPlaying();
		}
		g_total_seconds =  properties.tf_total_seconds.Eval(true);
		if(g_total_seconds!="ON AIR") g_time_remaining = "-"+g_total_seconds.toHHMMSS();
		else {
			g_time_remaining = "ON AIR";
			on_playback_dynamic_info_track();
		}
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
	g_elapsed_seconds = time;
	if(window.IsVisible && plman.PlayingPlaylist==g_active_playlist){
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
	} else if(plman.PlayingPlaylist==g_active_playlist) recalculate_time = true;
};

function on_playback_seek(time) {
	g_elapsed_seconds = time;
	if(window.IsVisible){
		if(g_total_seconds>0){
			g_time_remaining = g_total_seconds - time;
			g_time_remaining = "-"+g_time_remaining.toHHMMSS();
		} else {
			g_time_remaining = properties.tf_time_remaining.Eval(true);
		}
		brw.repaint();
	} else recalculate_time = true;
};
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
					changed = brw.setActivePlaylist(2);
					if(changed) brw.populate(is_first_populate = true,7, false);
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
			changed = brw.setActivePlaylist(3);
			g_focus_id = getFocusId(g_active_playlist);
			g_filterbox.clearInputbox();
			if(changed) {
				callback_avoid_populate=true;
				brw.populate(is_first_populate = true,8, false);
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

var callback_items_added = false;
var callback_items_removed = false;
var callback_avoid_populate = false;

function on_playlist_items_added(playlist_idx) {
	if(!callback_avoid_populate){
	//	if(window.IsVisible) brw.setActivePlaylist(4);
		if(playlist_idx == g_active_playlist) {// && !pman.drop_done) {
			g_focus_id = getFocusId(g_active_playlist);
			callback_avoid_populate=true;
			if(window.IsVisible) brw.populate(is_first_populate = false,9, false);
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
	//	if(window.IsVisible) brw.setActivePlaylist(5);
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
			if(window.IsVisible) brw.populate(false,11, false);
			else set_update_function("brw.populate(true,11, false)");
			timers.callback_avoid_populate = setTimeout(function() {
				callback_avoid_populate=false;
				clearTimeout(timers.callback_avoid_populate);
			}, 30);
		};
	}
};

function on_item_focus_change(playlist, from, to) {
    var save_focus_id = g_focus_id;
	var update_list = false;
	var update_scrollbar = false;	
	var get_tags = false;		
    g_focus_id = to;

	if(window.IsVisible){
		if(!brw.list || !brw || !brw.list) return;

		if(!g_avoid_on_item_focus_change) {

			plman.SetActivePlaylistContext();

			if(playlist == g_active_playlist) {

				plman.SetActivePlaylistContext();

				// Autocollapse handle
				if(properties.autocollapse && focus_changes.collapse) {
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
						if(new_focused_group_id > -1) {
							brw.expand_group(new_focused_group_id);
						};
						brw.setList();
						update_scrollbar = true;   
						if(brw.rowsCount > 0) brw.gettags(true);
					};				
				};
				
				if(focus_changes.collapse || focus_changes.scroll) { // if new focused track not totally visible, we scroll to show it centered in the panel
					g_focus_row = brw.getOffsetFocusItem(g_focus_id);
					if(g_focus_row < scroll/properties.rowHeight || g_focus_row > scroll/properties.rowHeight + brw.totalRowsVis - 0.1) {
						brw.showFocusedItem(g_focus_row);
						update_scrollbar = false;
					};
				};
				update_scrollbar && brw.scrollbar.updateScrollbar();
				brw.metadblist_selection = plman.GetPlaylistSelectedItems(g_active_playlist);
				if(!isScrolling) brw.repaint();
			};
		};
		focus_changes.collapse = false;
		focus_changes.scroll = false;
	}
};

function on_metadb_changed(metadbs, fromhook) {
    if(!brw.list || g_avoid_on_metadb_changed) {
		g_avoid_on_metadb_changed = false;
		return;
	}
	playing_track_new_count = parseInt(playing_track_playcount,10)+1
	try {
		if(fb.IsPlaying && metadbs.Count==1 && metadbs[0].RawPath==fb.GetNowPlaying().RawPath && TF.play_count.Eval()==(playing_track_new_count)) {
			playing_track_playcount = playing_track_new_count;
			return;
		}
	} catch(e){
		console.log("ERROR:on_metadb_changed, WSHsmoothplaylist try/catch");
		if(metadbs.Count==1) return;		
	}

    if(window.IsVisible){
		// rebuild list
		if(g_rating_updated) { // no repopulate if tag update is from rating click action in playlist
			g_rating_updated = false;
			// update track tags info to avoid a full populate
			if(brw.rating_rowId > -1) {
				try{
					brw.rows[brw.rating_rowId].infosraw = properties.tf_track.EvalWithMetadb(brw.rows[brw.rating_rowId].metadb);
					brw.rows[brw.rating_rowId].infos = brw.rows[brw.rating_rowId].infosraw.split(" ^^ ");
					brw.rating_rowId = -1;
					brw.repaint();
				} catch(e){brw.rating_rowId = -1;}
			};
		} else {
			if(!(metadbs.Count == 1 && metadbs[0].Length < 0)) {
				if(filter_text.length > 0) {
					g_focus_id = 0;
					brw.populate(true,13, false);
					if(brw.rowsCount > 0) {
						var new_focus_id = brw.rows[0].playlistTrackId;
						plman.ClearPlaylistSelection(g_active_playlist);
						plman.SetPlaylistSelectionSingle(g_active_playlist, new_focus_id, true);
						plman.SetPlaylistFocusItem(g_active_playlist, new_focus_id);
						focus_changes.collapse = true;
					};
				} else {
					brw.populate(false,14, false);
				};
			};
		};
	} else {
		if(g_rating_updated) { // no repopulate if tag update is from rating click action in playlist
			g_rating_updated = false;
			// update track tags info to avoid a full populate
			if(brw.rating_rowId > -1) {
				brw.rows[brw.rating_rowId].infosraw = properties.tf_track.EvalWithMetadb(brw.rows[brw.rating_rowId].metadb);
				brw.rows[brw.rating_rowId].infos = brw.rows[brw.rating_rowId].infosraw.split(" ^^ ");
				brw.rating_rowId = -1;
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
        if(plman.GetPlaylistName(i) == globalProperties.media_library) {
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
        plman.CreateAutoPlaylist(total, globalProperties.media_library, "%path% PRESENT", "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 1);
        //plman.CreateAutoPlaylist(total, globalProperties.media_library, "%album% PRESENT", "%album artist% | %date% | %album% | %discnumber% | %tracknumber% | %title%", 1);
        // Move it to the top
        plman.MovePlaylist(total, 0);
    } else if(mediaLibraryIndex > 0) {
        // Always move it to the top
        plman.MovePlaylist(mediaLibraryIndex, 0);
    };

    g_avoid_on_playlists_changed = false;
};

function check_scroll(scroll___){
    scroll___ < 0 && (scroll___ = 0);
    let g1 = brw.h - (brw.totalRowsVis * properties.rowHeight);
    let end_limit = ((brw.rowsCount+properties.addedRows_end) * properties.rowHeight) - (brw.totalRowsVis * properties.rowHeight) - g1+brw.PaddingTop*2+properties.margin_bottom;
    scroll___ != 0 && scroll___ > end_limit && (scroll___ = end_limit);
    return scroll___;
}

function getFocusId(playlistIndex) {
    return plman.GetPlaylistFocusItemIndex(playlistIndex);
}

function g_sendResponse() {
    filter_text = g_filterbox.inputbox.text.length === 0
        ? ''
        : g_filterbox.inputbox.text;

    // filter in current panel
    g_focus_id = 0;
    brw.populate(true,15, false);
    if(brw.rowsCount > 0) {
        var new_focus_id = brw.rows[0].playlistTrackId;
        plman.ClearPlaylistSelection(g_active_playlist);
        plman.SetPlaylistSelectionSingle(g_active_playlist, new_focus_id, true);
        plman.SetPlaylistFocusItem(g_active_playlist, new_focus_id);
		focus_changes.collapse = true;
    };
};
function stopFlashNowPlaying() {
	cNowPlaying.flashEnable = false;
	cNowPlaying.flashescounter = 0;
	cNowPlaying.flash = false;
}
function on_notify_data(name, info) {
    switch(name) {
		case "setGlobalParameter":
			setGlobalParameter(info[0],info[1]);
		break;			
        case "use_ratings_file_tags":
            globalProperties.use_ratings_file_tags = info;
            window.SetProperty("GLOBAL use ratings in file tags", globalProperties.use_ratings_file_tags);
            window.Reload();
		break;
		case "resetCache":
			g_image_cache.resetCache();
		break;		
		case "colors":
			globalProperties.colorsMainPanel = info;
			window.SetProperty("GLOBAL colorsMainPanel", globalProperties.colorsMainPanel);
			setOneProperty("AlbumArtProgressbar",(globalProperties.colorsMainPanel!=0));
			get_images();
			brw.repaint();
		break;
		case "resizingleft_rightsidebar":
			if(window.Name!="BottomPlaylist") g_resizing.show_resize_border = info;
			window.Repaint();
			break;
		case "enableResizableBorders":
			globalProperties.enableResizableBorders = info;
			window.SetProperty("GLOBAL enableResizableBorders", globalProperties.enableResizableBorders);
		break;
		case "MemSolicitation":
			globalProperties.mem_solicitation = info;
			window.SetProperty("GLOBAL memory solicitation", globalProperties.mem_solicitation);
			window.Reload();
		break;
		case "thumbnailWidthMax":
			globalProperties.thumbnailWidthMax = Number(info);
			window.SetProperty("GLOBAL thumbnail width max", globalProperties.thumbnailWidthMax);
		break;
		case "coverCacheWidthMax":
			globalProperties.coverCacheWidthMax = Number(info);
			window.SetProperty("GLOBAL cover cache width max", globalProperties.coverCacheWidthMax);
		break;
		case "set_font":
			globalProperties.fontAdjustement = info;
			window.SetProperty("GLOBAL Font Adjustement", globalProperties.fontAdjustement);
			on_font_changed();
		break;
		case "g_avoid_on_metadb_changed":
			g_avoid_on_metadb_changed = true;
			break;
		case "libraryfilter_width":
			libraryfilter_width.value = info;
			break;
		case "rightplaylist_width":
			rightplaylist_width.value = info;
			break;
		case "set_font":
			globalProperties.fontAdjustement = info;
			window.SetProperty("GLOBAL Font Adjustement", globalProperties.fontAdjustement);
			on_font_changed();
		break;
        case "FocusOnNowPlayingForce":
        case "FocusOnNowPlaying":
			if (!window.IsVisible && avoidShowNowPlaying) {
                avoidShowNowPlaying = false;
                break;
            } else if (!window.IsVisible){
				return;
			}
            let current_playing_loc = plman.GetPlayingItemLocation();
            if ((name!="FocusOnNowPlayingForce" && !current_playing_loc.IsValid) || (name!="FocusOnNowPlayingForce" && window.Name=="BottomPlaylist" && nowplayingplaylist_state.isActive()))
                break;

            if (current_playing_loc.PlaylistIndex > 0 && current_playing_loc.PlaylistIndex < plman.PlaylistCount && name=="FocusOnNowPlayingForce")
                plman.ActivePlaylist = current_playing_loc.PlaylistIndex;

            brw.setDisplayedPlaylistProperties(false);
            brw.showNowPlaying();
            avoidShowNowPlaying = true;
            if(timers.avoidShowNowPlaying) clearTimeout(timers.avoidShowNowPlaying);
            timers.avoidShowNowPlaying = setTimeout(function() {
                avoidShowNowPlaying = false;
                clearTimeout(timers.avoidShowNowPlaying);
                timers.avoidShowNowPlaying = false;
            }, 500);

            break;
		case"stopFlashNowPlaying":
			stopFlashNowPlaying();
			brw.repaint();
		break;
		case "rating_album_updated":
			g_rating_updated=true;
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
		case "DiskCacheState":
			globalProperties.enableDiskCache = info;
			window.SetProperty("COVER Disk Cache", globalProperties.enableDiskCache);
			brw.repaint();
		break;
		case "RefreshImageCover":
			g_image_cache.resetMetadb(info);
			brw.refreshThumbnails();
			brw.repaint();
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
			setOneProperty("playlists_dark_theme",info, true);
			on_colours_changed();
			window.Repaint();
		break;
		case "minimode_dark_theme":
			if(window.Name!="BottomPlaylist"){
				if(info===true || info===false) {
					setOneProperty("minimode_dark_theme",info, true);
					on_colours_changed();
				} else {
					setOneProperty("minimode_dark_theme",(info==2 || info==3), true);
					globalProperties.colorsMiniPlayer = info;
					window.SetProperty("GLOBAL colorsMiniPlayer", globalProperties.colorsMiniPlayer);
					setOneProperty("AlbumArtProgressbar",(globalProperties.colorsMiniPlayer==1 || globalProperties.colorsMiniPlayer==3),false,1);
					toggleWallpaper((globalProperties.colorsMiniPlayer==1 || globalProperties.colorsMiniPlayer==3),1);
					get_images();on_colours_changed();
				}
				brw.repaint();
			}
		break;
		case "bio_dark_theme":
			setOneProperty("bio_dark_theme",info, true);
			on_colours_changed();
			window.Repaint();
		break;
		case "visualization_dark_theme":
			setOneProperty("visualization_dark_theme",info, true);
			on_colours_changed();
			window.Repaint();
		break;
		case "library_dark_theme":
			setOneProperty("library_dark_theme",info, true);
			on_colours_changed();
			window.Repaint();
		break;
		case "bio_stick_to_dark_theme":
			setOneProperty("bio_stick2darklayout",info, true);
			on_colours_changed();
			window.Repaint();
		break;
		case "wallpaperVisibilityGlobal":
		case "wallpaperVisibility":
			if(window.IsVisible || name=="wallpaperVisibilityGlobal") toggleWallpaper(info);
		break;
		case "wallpaperBlurGlobal":
		case "wallpaperBlur":
			if(window.IsVisible || name=="wallpaperBlurGlobal") toggleBlurWallpaper(info);
		break;
		case "wallpaperVisibility2":
			if(window.IsVisible) {
				setOneProperty("showwallpaper",info);
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
				setOneProperty("wallpaperblurred",info);
				on_colours_changed();
				if(fb.IsPlaying) g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
				window.Repaint();
			}
		break;
		case "layout_state":
			if(window.Name!="BottomPlaylist"){
				layout_state.value=info;
				brw.setDisplayedPlaylistProperties(true);
				get_metrics(true);
				if(properties.autocollapse && properties.showGroupHeaders) {
					brw.collapseAll(true);
				}
				on_colours_changed(true);
				brw.refreshThumbnails();
				if(layout_state.isEqual(0) && window.IsVisible) window.NotifyOthers("playlist_height",window.Height);
				if(layout_state.isEqual(1) && g_active_playlist==plman.PlayingPlaylist){
					brw.showNowPlaying(false);
				}
			}
		break;
		case "main_panel_state":
			main_panel_state.value = info;
			if(window.Name!="BottomPlaylist"){
				setShowHeaderBar();
				get_metrics();
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
						setOneProperty("lockOnPlaylistNamed","");
						setOneProperty("lockOnNowPlaying",properties.lockOnNowPlaying);
						brw.populate(true,22);
					}
				}
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
		case "trackinfoslib_state":
			trackinfoslib_state.value=info;
			setShowHeaderBar();
			get_metrics();
		break;
		case "trackinfosplaylist_state":
			trackinfosplaylist_state.value=info;
			setShowHeaderBar();
			get_metrics();
		break;
		case "trackinfosbio_state":
			trackinfosbio_state.value=info;
			setShowHeaderBar();
			get_metrics();
		break;
		case "trackinfosvisu_state":
			trackinfosvisu_state.value=info;
			setShowHeaderBar();
			get_metrics();
		break;
		case "filters_panel_state":
			filters_panel_state.value=info;
			if(properties.enableAutoSwitchPlaylistMode){
				var old_properties_lockOnNowPlaying = properties.lockOnNowPlaying;
				if(filters_panel_state.isMaximumValue()) properties.lockOnNowPlaying=false;
				else properties.lockOnNowPlaying=true;
				properties.lockOnPlaylistNamed="";
				if(old_properties_lockOnNowPlaying != properties.lockOnNowPlaying){
					setOneProperty("lockOnPlaylistNamed","");
					setOneProperty("lockOnNowPlaying",properties.lockOnNowPlaying);
					brw.populate(true,19);
				}
			}
		break;
		case "lockOnNowPlaying":
			setOneProperty("lockOnNowPlaying",info);
			setOneProperty("lockOnPlaylistNamed","");
			brw.populate(true,18);
		break;
		case "lockOnSpecificPlaylist":
			setOneProperty("lockOnPlaylistNamed",info);
			brw.populate(true,20);
		break;
		case "showGroupHeaders":
			setOneProperty("showGroupHeaders",!properties.showGroupHeaders)
			get_metrics();
			if(properties.autocollapse) {
				setOneProperty("autocollapse",false);
			}
			if(!properties.showGroupHeaders) brw.collapseAll(false);
			brw.populate(is_first_populate = false,22);
			window.Repaint();
			break;
		case "doubletrackline":
			setOneProperty("doubleRowText",!properties.doubleRowText);
			get_metrics();
			window.Repaint();
			break;
		case "autocollapse":
			if(properties.showGroupHeaders) {
				setOneProperty("autocollapse",!properties.autocollapse);
				brw.populate(false,19);
				brw.showFocusedItem();
			}
			break;
		case "collapseAll":
			brw.collapseAll(info);
			brw.showFocusedItem();
			break;
		case "cover_cache_finalized":
			//g_image_cache.cachelist = cloneImgs(info);
			//window.Repaint();
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
		//fb.ShowPopupMessage("The current playlist is an autoplaylist: you can't reorder tracks in an autoplaylist.", "Error");
        g_dragndrop_drop_forbidden = false;
        window.Repaint();
    };
};

function on_drag_over(action, x, y, mask) {

    if(x == g_dragndrop_x && y == g_dragndrop_y) return true;

    if(g_active_playlist >=0 && plman.IsAutoPlaylist(g_active_playlist) && (pman.state == 0 || !pman._isHover(x, y))) {
        g_dragndrop_drop_forbidden = true;
        pman.on_mouse("move", x, y);
        window.Repaint();
        return true;
    } else
        g_dragndrop_drop_forbidden = false;

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
		//if(brw.drag_tracks) action.Text = "Move";
		//else action.Text = "Insert";
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
	if(action.IsInternal) {
		action.Effect = 0;		
		return;
	}
    if(brw.drag_tracks) {
		action.Effect = 0;
		on_mouse_lbtn_up(x, y);
		return;
	}
	if(pman.state == 1) {
		action.Effect = 0;
        pman.on_mouse("up", x, y);
        g_dragndrop_drop_forbidden = false;
        window.Repaint();
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
		} else plman.ActivePlaylist = toPlaylistIdx;
        action.Effect = 1;
		plman.UndoBackup(toPlaylistIdx);
        action.Playlist = toPlaylistIdx;
		action.ToSelect = false;
		g_dragndrop_trackId = -1;
		g_dragndrop_rowId = -1;		
		g_dragndrop_timer = setTimeout(function(){
			if(properties.lockOnNowPlaying) {
				plman.ExecutePlaylistDefaultAction(toPlaylistIdx, 0);
				fb.Stop();fb.Play();
			}
			clearTimeout(g_dragndrop_timer);
			g_dragndrop_timer = false;
			window.Repaint();
        },50);
	} else if(total_pl < 1) {
        plman.CreatePlaylist(0, "Dropped Items");
        plman.ActivePlaylist = 0;
        action.Effect = 1;
		plman.UndoBackup(plman.ActivePlaylist);
        action.Playlist = plman.ActivePlaylist;
        action.ToSelect = false;
		g_dragndrop_trackId = -1;
		g_dragndrop_rowId = -1;
    } else {
        if(g_dragndrop_bottom) {
            plman.ClearPlaylistSelection(g_active_playlist);
            action.Effect = 1;
			plman.UndoBackup(g_active_playlist);
			action.Playlist = g_active_playlist;
			brw.playlist_on_next_populate = g_active_playlist;
            action.ToSelect = false;
			g_avoid_playlist_displayed_switch = true;
			action.Base = g_dragndrop_total_before;
			g_dragndrop_trackId = -1;
			g_dragndrop_rowId = -1;			
            g_dragndrop_timer && clearTimeout(g_dragndrop_timer);
            g_dragndrop_timer = setTimeout(function(){
                plman.SetPlaylistFocusItem(g_active_playlist, g_dragndrop_total_before);
				focus_changes.collapse = true;
                //brw.showFocusedItem();
                //full_repaint();
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
				plman.UndoBackup(g_active_playlist);
				action.Playlist = g_active_playlist;
				brw.playlist_on_next_populate = g_active_playlist;
				action.ToSelect = false;
				g_avoid_playlist_displayed_switch = true;
				action.Base = g_dragndrop_trackId;
				g_dragndrop_trackId = -1;
				g_dragndrop_rowId = -1;				
				g_dragndrop_timer && clearTimeout(g_dragndrop_timer);
				g_dragndrop_timer = setTimeout(function(){
					var delta = (g_dragndrop_total_before - g_dragndrop_trackId) * -1;
					//plman.MovePlaylistSelection(g_active_playlist, delta);
					//plman.SetPlaylistFocusItem(g_active_playlist, g_dragndrop_trackId);
					//brw.showFocusedItem();
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

function toggleWallpaper(wallpaper_state, layout_state_2_update){
	var wallpaper_state = typeof wallpaper_state !== 'undefined' ? wallpaper_state : !properties.showwallpaper;
	var layout_state_2_update = typeof layout_state_2_update !== 'undefined' ? layout_state_2_update : undefined;

	setOneProperty("showwallpaper",wallpaper_state, false, layout_state_2_update);
	on_colours_changed();
	if(properties.showwallpaper) {
		g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.IsPlaying ? fb.GetNowPlaying() : null);
	}
	window.Repaint();
}
function toggleBlurWallpaper(wallpaper_blur_state){
	wallpaper_blur_state = typeof wallpaper_blur_state !== 'undefined' ? wallpaper_blur_state : !properties.wallpaperblurred;
	setOneProperty("wallpaperblurred",wallpaper_blur_state);
	on_colours_changed();
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

	g_resizing = new Resizing("rightsidebar",(window.Name!="BottomPlaylist"),false);
	g_cursor = new oCursor();
	g_tooltip = new oTooltip();

    g_focus_id = getFocusId(g_active_playlist);

    brw = new oBrowser("brw");
	brw.setActivePlaylist();
	brw.startTimer();
    pman = new oPlaylistManager("pman");

    if(fb.IsPlaying) playing_track_playcount = TF.play_count.Eval();
	g_total_seconds =  properties.tf_total_seconds.Eval(true);
	on_playback_dynamic_info_track();
};

on_init();
