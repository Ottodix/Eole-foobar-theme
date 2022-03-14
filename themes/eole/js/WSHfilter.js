var images = {
    path: theme_img_path + "\\",
    glass_reflect: null,
    loading_angle: 0,
    loading_draw: null,
    noart: null,
    stream: null
};
var g_genre_cache=false;
var Update_Required_function="";
var browser_refresh_required=false;
var playing_track_playcount = 0;
var cur_btn_down = false;
var g_avoid_on_library_items_added=false;
var g_avoid_on_library_items_removed=false;
var g_avoid_on_metadb_changed=false;
var g_on_mouse_lbtn_dblclk = false;
var update_size = true;
var first_on_size = true;
var properties = {
	panelName: 'WSHfilter',
    ParentName:  window.GetProperty("_PROPERTY: Parent Panel", ""),
    followFocusChange: window.GetProperty("_PROPERTY: Follow focus change", false), // only in source mode = Playlist
    sourceMode: window.GetProperty("_PROPERTY: Source Mode", 0), // 0 = Library, 1 = Playlist, 2 = Playlist named like below, 3 = Filter selection from a lower filter order
    sourcePlaylist: globalProperties.selection_playlist,//window.GetProperty("_PROPERTY: Source Playlist", globalProperties.selection_playlist),
    selectionPlaylist: globalProperties.selection_playlist,//window.GetProperty("_PROPERTY: Selection Playlist", globalProperties.selection_playlist),
    playingPlaylist: globalProperties.playing_playlist,
    filterPlaylist: globalProperties.filter_playlist,	
    filterOrder: window.GetProperty("_PROPERTY: filter Order", 0),
    tagMode: window.GetProperty("_PROPERTY: Tag Mode", 3), // 1 = album, 2 = artist, 3 = genre
    albumArtId: 0, // 0 = front
    tagModedisplay1: window.GetProperty("_PROPERTY: Display Mode for tag mode 1", 2),
    tagModedisplay2: window.GetProperty("_PROPERTY: Display Mode for tag mode 2", 0),
    tagModedisplay3: window.GetProperty("_PROPERTY: Display Mode for tag mode 3", 0),
    circleDisplay1: window.GetProperty("_PROPERTY: Circle Mode for tag mode 1", false),
    circleDisplay2: window.GetProperty("_PROPERTY: Circle Mode for tag mode 2", false),
    circleDisplay3: window.GetProperty("_PROPERTY: Circle Mode for tag mode 3", false),
    displayMode: window.GetProperty("_PROPERTY: Display Mode", 0), // 0 = text, 1 = stamps + text, 2 = lines + text, 3 = grid + text
    displayModeGridNoText: window.GetProperty("_PROPERTY: Display Mode Grid No Text", false), // 3 = grid, without text
    drawItemsCounter: window.GetProperty("_PROPERTY: Show numbers of items in group", false), // Available in display mode 0 = text, 2 = lines + text
    drawItemsCounter1: window.GetProperty("_PROPERTY: Show numbers of items for tag mode 1", true),
    drawItemsCounter2: window.GetProperty("_PROPERTY: Show numbers of items for tag mode 2", true),
    drawItemsCounter3: window.GetProperty("_PROPERTY: Show numbers of items for tag mode 3", true),
    drawAlternateBG: window.GetProperty("_PROPERTY: Alternate row background", true),
    filtred_playlist_idx: window.GetProperty("_PROPERTY: filtred playlist idx", -1),	
    albumsTFsortingdefault: window.GetProperty("Sort Order - ALBUM", "%album artist% | %date% | %album% | %discnumber% | %tracknumber% | %title%"),
    artistsTFsortingdefault: "$meta(artist) | %date% | %album% | %discnumber% | %tracknumber% | %title%",//window.GetProperty("Sort Order - ARTIST", "$meta(artist) | %date% | %album% | %discnumber% | %tracknumber% | %title%"),
    genresTFsortingdefault: window.GetProperty("Sort Order - GENRE", "$meta(genre,0) | %album artist% | %date% | %album% | %discnumber% | %tracknumber% | %title%"),
	deleteSpecificImageCache : window.GetProperty("COVER cachekey of covers to delete on next startup", ""),
    showAllItem: window.GetProperty("_PROPERTY: Show ALL item", true),
    showAllItem1: window.GetProperty("_PROPERTY: Show ALL item for tag mode 1", true),
    showAllItem2: window.GetProperty("_PROPERTY: Show ALL item for tag mode 2", true),
    showAllItem3: window.GetProperty("_PROPERTY: Show ALL item for tag mode 3", true),
	AlbumArtFallback: window.GetProperty("COVER Fallback to album art", false),
	AlbumArtFallback1: window.GetProperty("COVER Fallback to album art for tag mode 1", false),
	AlbumArtFallback2: window.GetProperty("COVER Fallback to album art for tag mode 2", false),
	AlbumArtFallback3: window.GetProperty("COVER Fallback to album art for tag mode 3", false),
	MinNumberOfColumns: window.GetProperty("COVER Minimum number of columns", 1),
    thumbnailWidthMin: window.GetProperty("COVER Width Minimal", 20),
    thumbnailWidth: window.GetProperty("COVER Width", 75),
    thumbnailWidth1: window.GetProperty("COVER Width for tag mode 1", 75),
    thumbnailWidth2: window.GetProperty("COVER Width for tag mode 2", 75),
    thumbnailWidth3: window.GetProperty("COVER Width for tag mode 3", 75),
    drawUpAndDownScrollbar: window.GetProperty("_PROPERTY: Draw Up and Down Scrollbar Buttons", false),
    default_lineHeightMin: window.GetProperty("SYSTEM Minimal Line Height", 34),
    default_lineHeightMin1: window.GetProperty("SYSTEM Minimal Line Height for tag mode 1", 34),
    default_lineHeightMin2: window.GetProperty("SYSTEM Minimal Line Height for tag mode 2", 34),
    default_lineHeightMin3: window.GetProperty("SYSTEM Minimal Line Height for tag mode 3", 34),
	displayToggleBtns: window.GetProperty("_DISPLAY: Toggle buttons", true),
	savedFilterState: window.GetProperty("_PROPERTY: Saved filter state", -1),
    lineHeightMin: 0,
	first_item_top_margin_default: window.GetProperty("_DISPLAY first item top margin", 0),
    load_covers_at_startup: window.GetProperty("COVER Load all at startup", true),
    enableDiskCache: window.GetProperty("COVER Disk Cache", true),
    scrollRowDivider: window.GetProperty("SYSTEM Scroll Row Divider", 1),
    tf_artist: fb.TitleFormat("%artist%"),
    tf_albumartist: fb.TitleFormat("%album artist%"),
    tf_groupkey_genre: window.GetProperty("_PROPERTY Genre TitleFormat", "$if2($meta(genre,0),?)"),
    tf_groupkey_genre_default: "$if2($meta(genre,0),?)",
    tf_groupkey_artist: window.GetProperty("_PROPERTY Artist TitleFormat", "$if2($meta(artist),?)"),
    tf_groupkey_artist_default: "$if2($meta(artist),?)",
    tf_groupkey_album: window.GetProperty("_PROPERTY Album TitleFormat", "%album artist% ^^ %album%"),
    tf_groupkey_album_default: "%album artist% ^^ %album%",
    tf_groupkey_album_addinfos: " ## %title% ## %date%",
    genre_customGroup_label: window.GetProperty("_DISPLAY: genre customGroup name", ""),
    artist_customGroup_label: window.GetProperty("_DISPLAY: artist customGroup name", ""),
    album_customGroup_label: window.GetProperty("_DISPLAY: album customGroup name", ""),
    tf_path: fb.TitleFormat("$directory_path(%path%)\\"),
    tf_path_genre: fb.TitleFormat(images.path+"genres\\$meta(genre,0).jpg"),
    tf_crc_artist: fb.TitleFormat(globalProperties.crc_artist),
    tf_crc_genre: fb.TitleFormat("$crc32('genres'$meta(genre,0))"),
    tf_time_remaining: fb.TitleFormat("$if(%length%,-%playback_time_remaining%,'0:00')"),
    showPanelToggleButtons: window.GetProperty("_PROPERTY: showPanelToggleButtons", false),
    showTagSwitcherBar: window.GetProperty("_PROPERTY: show buttons on top to change the source tag", false),
	showFiltersTogglerBtn: window.GetProperty("_PROPERTY: show filters toggler btn", false),
    showHeaderBar: window.GetProperty("_DISPLAY: Show Top Bar", true),
    showHeaderBar1: window.GetProperty("_PROPERTY: Show Top Bar for tag mode 1", true),
    showHeaderBar2: window.GetProperty("_PROPERTY: Show Top Bar for tag mode 2", true),
    showHeaderBar3: window.GetProperty("_PROPERTY: Show Top Bar for tag mode 3", true),
	removePrefix: window.GetProperty("_PROPERTY: ignore prefix", false),
	removePrefix1: window.GetProperty("_PROPERTY: ignore prefix for tag mode 1", false),
	removePrefix2: window.GetProperty("_PROPERTY: ignore prefix for tag mode 2", false),
	removePrefix3: window.GetProperty("_PROPERTY: ignore prefix for tag mode 3", false),	
	showToolTip: window.GetProperty("_PROPERTY: Show tooltips", true),
	showLibraryTreeSwitch: window.GetProperty("_PROPERTY: Show library tree switch", false),
    rowHeight: 22,
    rowScrollStep: 1,
    scrollSmoothness: 2.5,
    TagSwitcherBarHeight: 40,
    TagSwitcherBarHeight_old: 30,	
    headerBarHeight: 40,
    defaultHeaderBarHeight: 40,
    headerBarPaddingTop: 0,
    enableCustomColors: window.GetProperty("_PROPERTY: Custom Colors", true),
	darklayout: window.GetProperty("_DISPLAY: Dark layout", false),
    showwallpaper: window.GetProperty("_DISPLAY: Show Wallpaper", false),
    wallpaperblurred: window.GetProperty("_DISPLAY: Wallpaper Blurred", true),
    wallpaperblurvalue: window.GetProperty("_DISPLAY: Wallpaper Blur Value", 1.05),
    wallpapermode: window.GetProperty("_SYSTEM: Wallpaper Mode", 0),
    wallpaperdisplay: window.GetProperty("_DISPLAY: Wallpaper 0=Filling 1=Adjust 2=Stretch", 0),
    DropInplaylist: window.GetProperty("_SYSTEM: Allow to drag items into a playlist", true),
    enableTouchControl: window.GetProperty("_PROPERTY: Enable Scroll Touch Control", false),
    default_botStampHeight: 16,
    botStampHeight: 0,
    default_botGridHeight: 42,
    botGridHeight: 0,
    default_botTextRowHeight: 16,
    botTextRowHeight: 0,
    default_textLineHeight: 10,
    textLineHeight: 0,
    DrawRightLine: window.GetProperty("_PROPERTY: Draw a line on the right side", true),
    addedRows_end_default: window.GetProperty("_PROPERTY: empty rows at the end", 1),
	panelFontAdjustement: -1,
	load_image_from_cache_direct: true,
	adapt_to_playlist: window.GetProperty("_PROPERTY: populate from active playlist", false),
};
if(properties.adapt_to_playlist && properties.ParentName=="Library") properties.adapt_to_playlist = false;
	
var TF = {
	genre: fb.TitleFormat('%genre%'),
	albumartist: fb.TitleFormat("%album artist%"),
	album: fb.TitleFormat("%album%"),
	date: fb.TitleFormat("%date%"),
	play_count: fb.TitleFormat("%play_count%"),
	playback_time_seconds: fb.TitleFormat("%playback_time_seconds%"),
}

if(!filter3_state.isActive() && properties.filterOrder==1) properties.showPanelToggleButtons=true
else if(!filter3_state.isActive() && !filter2_state.isActive() && properties.filterOrder==0 && main_panel_state.isEqual(1)) properties.showPanelToggleButtons=true
if(properties.deleteSpecificImageCache!="") {
	crc_array = properties.deleteSpecificImageCache.split("|");
	var tot = crc_array.length;
	for(var i = 0; i < tot; i++) {
		delete_file_cache(null, -1, crc_array[i],true);
	}
	properties.deleteSpecificImageCache = "";
	window.SetProperty("COVER cachekey of covers to delete on next startup", "");
}

var g_wallpaperImg = null;
var update_wallpaper = false;
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

cPlaylistManager = {
    default_width: 230,
    width: 0,
    default_topbarHeight: 39,
    topbarHeight: 39,
    default_botbarHeight: 8,
    botbarHeight: 8,
    default_scrollbarWidth: 10,
    scrollbarWidth: 10,
    default_rowHeight : 30,
    rowHeight: 30,
    blink_timer: false,
    blink_counter: -1,
    blink_id: null,
    blink_row: null,
    blink_totaltracks: 0,
    showTotalItems: window.GetProperty("_PROPERTY.PlaylistManager.ShowTotalItems", true)
};

cover = {
    masks: window.GetProperty("_PROPERTY: Cover art masks (for disk cache)","*front*.*;*cover*.*;*folder*.*;*.*"),
    keepaspectratio: false,
	max_w: 1,
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
    addItems: false,
    showMenu: false,
	showToolTip : false,
	populate : false,
    showPlaylistManager: false,
    hidePlaylistManager: false,
    avoidPlaylistSwitch: false,
	avoid_on_library_items_added: false,
	avoid_on_library_items_removed: false,
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

                if(!isScrolling && !cScrollBar.timerID) {
                    if(k < brw.groups.length && k >= g_start_ && k <= g_end_) {
                        if(!timers.coverDone) {
                            timers.coverDone = setTimeout(function() {
                                g_1x1 = false;
                                brw.repaint();
                                timers.coverDone && clearTimeout(timers.coverDone);
                                timers.coverDone = false;
                            }, 5);
                        };
                    } else {
                        if(!timers.coverDone) {
                            timers.coverDone = setTimeout(function() {
                                g_1x1 = true;
                                window.RepaintRect(0, 0, 1, 1);
                                g_1x1 = false;
                                timers.coverDone && clearTimeout(timers.coverDone);
                                timers.coverDone = false;
                            }, 5);
                        };
                    };
                };
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
                    brw.groups[i].cover_img = g_image_cache.getit(metadb, i, image);

                    //if(!isScrolling && !cScrollBar.timerID) {
                        if(i < brw.groups.length && i >= g_start_ && i <= g_end_) {
                            if(!timers.coverDone) {
                                timers.coverDone = setTimeout(function() {
                                    g_1x1 = false;
                                    brw.repaint();
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
        if(i < tot && i>-1) {
            if(brw.groups[i].metadb) {
                brw.groups[i].cover_img = g_image_cache.getit(metadb, i, image);
                //if(!isScrolling && !cScrollBar.timerID) {
                    if(i < brw.groups.length && i >= g_start_ && i <= g_end_) {
                        if(!timers.coverDone) {
                            timers.coverDone = setTimeout(function() {
                                g_1x1 = false;
                                brw.repaint();
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
				pman.clearShowPlaylistManagerTimer();
				brw.repaint();
			};
		}
    };
	this.clearShowPlaylistManagerTimer = function(){
		window.ClearInterval(timers.showPlaylistManager);
		timers.showPlaylistManager = false;
	}
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
		reset_scroll = typeof reset_scroll !== 'undefined' ? reset_scroll : true;
        this.playlists.splice(0, this.playlists.length);
        this.total_playlists = plman.PlaylistCount;
        var rowId = 0;
        var isAutoPl = false;
        var isReserved = false;
        var plname = null;

        for(var idx = 0; idx < this.total_playlists; idx++) {
            plname = plman.GetPlaylistName(idx);
            isAutoPl = plman.IsAutoPlaylist(idx);
            isReserved = (plname == "Queue Content" || plname == "Historic");

            if(!isAutoPl && !isReserved) {
                if(idx == plman.ActivePlaylist && properties.selectionPlaylist!=plname && properties.filterPlaylist!=plname) {
                    if(!exclude_active) {
                        this.playlists.push(new oPlaylist(idx, rowId));
                        rowId++;
                    };
                } else if(properties.selectionPlaylist!=plname && properties.filterPlaylist!=plname){
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
			height_top_fix = (properties.showHeaderBar ? (properties.showTagSwitcherBar ? g_tagswitcherbar.default_height+properties.headerBarHeight : properties.headerBarHeight) : 0)
            gr.FillSolidRect(0, height_top_fix+1, ww, wh-height_top_fix-1, colors.pm_overlay);

			//Shadows
			gr.FillGradRect(cx,this.y-gradient_size,ww-(brw.draw_right_line?1:0),gradient_size,90,colors.pm_shadow_on,colors.pm_shadow_off,0)
			gr.FillGradRect(cx,this.y + this.h + cPlaylistManager.botbarHeight,ww-(brw.draw_right_line?1:0),gradient_size,90,colors.pm_shadow_on,colors.pm_shadow_off,1.0)
			//Main BG
			gr.FillSolidRect(cx, this.y, this.w, this.h + cPlaylistManager.botbarHeight + 1, colors.pm_bg);
			gr.FillSolidRect(cx, this.y, ww-(brw.draw_right_line?1:0), 1, colors.pm_border);
			gr.FillSolidRect(cx, this.y + this.h + cPlaylistManager.botbarHeight, ww-(brw.draw_right_line?1:0), 1, colors.pm_border);

            // ** items **
            var rowIdx = 0;
            var totalp = this.playlists.length;
            var start_ = this.scroll;
            var end_ = this.scroll + this.totalRows;
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
                    gr.GdiDrawText(t, g_font.min1, colors.faded_txt, cx + bg_margin_left + txt_margin, cy, cw - bg_margin_left*2 - txt_margin*2 - this.scr_w, ch, DT_RIGHT | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
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
                    gr.GdiDrawText("+ " + this.playlists[i].name , g_font.boldplus1, txt_color, cx + playlistname_padding_left + bg_margin_left + txt_margin, cy, cw - bg_margin_left*2 - txt_margin*2 - tw - this.scr_w, ch, DT_LEFT | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
                } else {
                    gr.GdiDrawText(this.playlists[i].name , g_font.normal, txt_color, cx + playlistname_padding_left + bg_margin_left + txt_margin, cy, cw - bg_margin_left*2 - txt_margin*2 - tw - this.scr_w, ch, DT_LEFT | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
                };


                // draw flashing item on lbtn_up after a drag'n drop
                if(cPlaylistManager.blink_counter > -1) {
                    if(cPlaylistManager.blink_row != 0) {
                        if(i == cPlaylistManager.blink_id - 1) {
                            if(cPlaylistManager.blink_counter <= 6 && Math.floor(cPlaylistManager.blink_counter / 2) == Math.ceil(cPlaylistManager.blink_counter / 2)) {
                                gr.FillSolidRect(cx + bg_margin_left, cy +(cPlaylistManager.topbarHeight-39), cw - bg_margin_left*2 - this.scr_w, ch, colors.pm_blink);
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
					gr.GdiDrawText("+ Sent to a new Playlist" , g_font.boldplus1, txt_color, cx + bg_margin_left + txt_margin, this.y + cPlaylistManager.topbarHeight - 30, cw - bg_margin_left*2 - txt_margin*2 - tw - this.scr_w, ch, DT_LEFT | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
                    if(cPlaylistManager.blink_counter <= 6 && Math.floor(cPlaylistManager.blink_counter / 2) == Math.ceil(cPlaylistManager.blink_counter / 2)) {
						gr.FillSolidRect(cx + bg_margin_left, this.y +(cPlaylistManager.topbarHeight-31), cw - bg_margin_left*2 - this.scr_w, ch+1, colors.pm_blink);
						gr.DrawRect(cx + bg_margin_left, this.y +(cPlaylistManager.topbarHeight-31), cw - bg_margin_left*2 - this.scr_w - 1, ch, 1.0, colors.pm_blink_rectline);
                    };
                } else {
                    gr.GdiDrawText("Send to ..." , g_font.italicplus1, txt_color, cx + bg_margin_left + txt_margin, this.y + cPlaylistManager.topbarHeight - 30, cw - bg_margin_left*2 - txt_margin*2 - tw - this.scr_w, ch, DT_LEFT | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
                };
            } else {
                if(this.activeRow == 0) {
                    gr.GdiDrawText("+ Send to a new Playlist" , g_font.boldplus1, txt_color, cx + bg_margin_left + txt_margin, this.y + cPlaylistManager.topbarHeight - 30, cw - bg_margin_left*2 - txt_margin*2 - tw - this.scr_w, ch, DT_LEFT | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);

					gr.FillSolidRect(cx + bg_margin_left, this.y +(cPlaylistManager.topbarHeight-31), cw - bg_margin_left*2 - this.scr_w, ch+1, colors.pm_blink);
					gr.DrawRect(cx + bg_margin_left, this.y +(cPlaylistManager.topbarHeight-31), cw - bg_margin_left*2 - this.scr_w - 1, ch, 1.0, colors.pm_blink_rectline);

                } else {
                    gr.GdiDrawText("Send to ..." , g_font.italicplus1, txt_color, cx + bg_margin_left + txt_margin, this.y + cPlaylistManager.topbarHeight - 30, cw - bg_margin_left*2 - txt_margin*2 - tw - this.scr_w, ch, DT_LEFT | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
                };
            };

            // draw activeIndex hover frame
            if(cPlaylistManager.blink_counter > -1 && cPlaylistManager.blink_row > 0) {
                cy_ = this.y + cPlaylistManager.blink_row * ch;
                gr.DrawRect(cx + bg_margin_left, cy_ + bg_margin_top +(cPlaylistManager.topbarHeight-33), cw - bg_margin_left*2 - this.scr_w - 1, ch, 1.0, colors.pm_blink_rectline);
            } else {
                if(this.activeRow > 0 && this.activeIndex > 0) {
                    if(cPlaylistManager.blink_counter < 0){
                        cy_ = this.y + this.activeRow * ch;
						gr.FillSolidRect(cx + bg_margin_left, cy_ + bg_margin_top +(cPlaylistManager.topbarHeight-33), cw - bg_margin_left*2 - this.scr_w, ch+1, colors.pm_blink);
                        gr.DrawRect(cx + bg_margin_left, cy_ + bg_margin_top +(cPlaylistManager.topbarHeight-33), cw - bg_margin_left*2 - this.scr_w - 1, ch, 1.0, colors.pm_blink_rectline);
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
                    this.activeRow = Math.ceil((y-cPlaylistManager.topbarHeight - this.y +30) / cPlaylistManager.rowHeight) - 1;
                    this.activeIndex = Math.ceil((y-cPlaylistManager.topbarHeight - this.y+30) / cPlaylistManager.rowHeight) + this.scroll - 1;
					if(this.activeIndex>this.playlists.length) this.activeIndex = -1
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
                    this.drop_done = false;
                    if(this.activeIndex > -1 && brw.selectedIndex > -1) {
                        brw.metadblist_selection = brw.getSelectedItems();
                        if(this.activeRow == 0) {
                            // send to a new playlist
                            this.drop_done = true;
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
                                        this.drop_done = false;
                                        // close pman
                                        if(!timers.hidePlaylistManager) {
                                            timers.hidePlaylistManager = setInterval(pman.hidePanel, 30);
                                        };
                                        brw.drag_moving = false;
                                    };
                                    brw.repaint();
                                }, 150);
                            };
                        };
                    } else {
                        if(timers.showPlaylistManager) {
							pman.clearShowPlaylistManagerTimer();
                        };
                        if(!timers.hidePlaylistManager) {
                            timers.hidePlaylistManager = setInterval(this.hidePanel, 30);
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
                        pman.clearShowPlaylistManagerTimer();
                    };
                    if(!timers.hidePlaylistManager) {
                        timers.hidePlaylistManager = setInterval(this.hidePanel, 30);
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
                        pman.clearShowPlaylistManagerTimer();
                    };
                    if(!timers.hidePlaylistManager) {
                        timers.hidePlaylistManager = setInterval(this.hidePanel, 30);
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

		if(properties.darklayout) icon_theme_subfolder = "\\white";
		else icon_theme_subfolder = "";

		this.images.search_icon = gdi.Image(theme_img_path + "\\icons"+icon_theme_subfolder+"\\search_icon.png");


		/*this.images.search_icon = gdi.CreateImage(w, w);
		gb = this.images.search_icon.GetGraphics();
			gb.SetSmoothingMode(2);
			gb.DrawLine(7, w-5, w-7, 9, 1.0, colors.full_txt);
			gb.DrawLine(7, w-5, w-7, 9, 1.0, colors.full_txt);
			gb.DrawEllipse(w-8, 2.8, 7, 7.2, 1, colors.full_txt);
			gb.SetSmoothingMode(0);
		this.images.search_icon.ReleaseGraphics(gb);*/
		this.search_bt = new button(this.images.search_icon, this.images.search_icon, this.images.search_icon,"search_bt", "Filter items");

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

        this.reset_bt = new button(this.images.resetIcon_off, this.images.resetIcon_ov, this.images.resetIcon_dn,"reset_bt", "Reset filter");
	};
	//this.getImages();

	this.on_init = function() {
		this.inputbox = new oInputbox(cFilterBox.w, cFilterBox.h, "", "", colors.normal_txt, 0, 0, colors.selected_bg, g_sendResponse, "brw", undefined, "g_font.plus1");
        this.inputbox.autovalidation = true;
    };
	this.on_init();
    this.onFontChanged = function() {
		this.inputbox.onFontChanged();
	};
    this.reset_layout = function() {
        this.inputbox.textcolor = colors.normal_txt;
        this.inputbox.backselectioncolor = colors.selected_bg;

		var item_txt = new Array("", "Albums...", "Artists...", "Genres...");
		if(!properties.showTagSwitcherBar) var boxText = item_txt[properties.tagMode];
		else var boxText = "Filter...";
		this.inputbox.empty_text = boxText;
    };
    this.setSize = function(w, h, font_size) {
        this.inputbox.setSize(w, h, font_size);
        this.getImages();
    };
    this.clearInputbox = function() {
        if(this.inputbox.text.length > 0) {
            this.inputbox.text = "";
            this.inputbox.offset = 0;
            filter_text = "";
        };
    };
	this.resetSearch = function() {
		if(this.inputbox.text.length > 0) {
			this.inputbox.text = "";
			this.inputbox.offset = 0;
			g_sendResponse();
		}
	};
	this.draw = function(gr, x, y) {
        var bx = x;
		var by = y + properties.headerBarPaddingTop;
        var bw = this.inputbox.w + Math.round(44 * g_zoom_percent / 100);

        if(this.inputbox.text.length > 0) {
            this.reset_bt.draw(gr, bx+1, by+1, 255);
        } else {
			this.search_bt.draw(gr, bx-1, by-2, 255);
        };
		this.inputbox.draw(gr, bx+Math.round(22 * g_zoom_percent / 100)+5, by, 0, 0);
    };
    this.on_mouse = function(event, x, y, delta) {
        switch(event) {
            case "lbtn_down":
				//this.inputbox.activate(x,y);
				this.inputbox.check("down", x, y);
                if(this.inputbox.text.length > 0) this.reset_bt.checkstate("down", x, y);
				else this.search_bt.checkstate("down", x, y);
                break;
            case "lbtn_up":
				if(this.reset_bt.checkstate("up", x, y) == ButtonStates.hover && !this.inputbox.drag) {
					this.resetSearch();
                } else if(this.inputbox.text.length == 0 && this.search_bt.checkstate("up", x, y) == ButtonStates.hover && !this.inputbox.drag) {
					this.inputbox.activate(x,y);
					this.inputbox.repaint();
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
oTagSwitcherBar = function() {
    this.setItems_infos = function(){
		this.items_functions = new Array(
			function() {
				librarytree.toggleValue();
				window.NotifyOthers("left_filter_state","library_tree");
			}
		,
			function() {
				g_tagswitcherbar.activeItem = 1;
				properties.tagMode = 1;
				window.SetProperty("_PROPERTY: Tag Mode", properties.tagMode);
				window.NotifyOthers("left_filter_state","album");
				switch(properties.tagMode) {
					case 1:
						properties.albumArtId = 0;
						break;
					case 2:
						properties.albumArtId = 4;
						break;
					case 3:
						properties.albumArtId = 5;
						break;
				};
				get_metrics();
				brw.populate(true,1);
			}
		,
			function() {
				g_tagswitcherbar.activeItem = 2;
				properties.tagMode = 2;
				window.SetProperty("_PROPERTY: Tag Mode", properties.tagMode);
				window.NotifyOthers("left_filter_state","artist");
				switch(properties.tagMode) {
					case 1:
						properties.albumArtId = 0;
						break;
					case 2:
						properties.albumArtId = 4;
						break;
					case 3:
						properties.albumArtId = 5;
						break;
				};
				get_metrics();
				brw.populate(true,1);
			}
		,
			function() {
				g_tagswitcherbar.activeItem = 3;
				properties.tagMode = 3;
				window.SetProperty("_PROPERTY: Tag Mode", properties.tagMode);
				window.NotifyOthers("left_filter_state","genre");
				switch(properties.tagMode) {
					case 1:
						properties.albumArtId = 0;
						break;
					case 2:
						properties.albumArtId = 4;
						break;
					case 3:
						properties.albumArtId = 5;
						break;
				};
				get_metrics();
				brw.populate(true,1);
			}
		);
		this.items_width = new Array(0, 0, 0, 0);
		this.items_x = new Array(0, 0, 0, 0);
		this.items_txt = new Array("Library Tree","Albums", "Artists", "Genres");
		this.items_tooltips = new Array("Library tree","Album filter", "Artist filter", "Genre filter");
		properties.album_label = this.items_txt[1];
		properties.artist_label = this.items_txt[2];
		properties.genre_label = this.items_txt[3];		
		if(properties.album_customGroup_label != this.items_txt[1] && properties.album_customGroup_label!=""){
			properties.album_label = properties.album_customGroup_label;			
			this.items_txt[1] = properties.album_customGroup_label;
			this.items_tooltips[1] = properties.album_customGroup_label+" filter";
		}
		if(properties.artist_customGroup_label != this.items_txt[2] && properties.artist_customGroup_label!=""){
			properties.artist_label = properties.artist_customGroup_label;			
			this.items_txt[2] = properties.artist_customGroup_label;
			this.items_tooltips[2] = properties.artist_customGroup_label+" filter";
		}
		if(properties.genre_customGroup_label != this.items_txt[3] && properties.genre_customGroup_label!=""){
			properties.genre_label = properties.genre_customGroup_label;			
			this.items_txt[3] = properties.genre_customGroup_label;
			this.items_tooltips[3] = properties.genre_customGroup_label+" filter";
		}
		if(!properties.showLibraryTreeSwitch){
			this.items_txt.shift();
			this.items_width.shift();
			this.items_x.shift();
			this.items_functions.shift();
		}
	}

	this.setItems_infos();
	this.hoverItem = -1;
	this.txt_top_margin = 0;
	this.margin_right = 2;
	this.margin_left = 6;
	this.images = {};
	this.hide_bt = false;
	this.default_height = properties.TagSwitcherBarHeight;
	
    this.setHideButton = function(){
		this.hscr_btn_w = 18
		var xpts_mtop = Math.ceil((this.h-9)/2);
		var xpts_mright_prev = Math.floor((this.hscr_btn_w-5)/2);
		this.hide_bt_off = gdi.CreateImage(this.hscr_btn_w, this.h);
		gb = this.hide_bt_off.GetGraphics();
			gb.FillSolidRect(0, 0, 1, this.h-1, colors.sidesline);
			var xpts3 = Array(4+xpts_mright_prev,xpts_mtop, xpts_mright_prev,4+xpts_mtop, 4+xpts_mright_prev,8+xpts_mtop, 5+xpts_mright_prev,7+xpts_mtop, 2+xpts_mright_prev,4+xpts_mtop, 5+xpts_mright_prev,1+xpts_mtop);
			var xpts4 = Array(4+xpts_mright_prev,1+xpts_mtop, 1+xpts_mright_prev,4+xpts_mtop, 4+xpts_mright_prev,7+xpts_mtop, 1+xpts_mright_prev,4+xpts_mtop);
			gb.FillPolygon(colors.btn_inactive_txt, 0, xpts3);
			gb.FillPolygon(colors.btn_inactive_txt, 0, xpts4);
		this.hide_bt_off.ReleaseGraphics(gb);
		this.hide_bt_ov = gdi.CreateImage(this.hscr_btn_w, this.h);
		gb = this.hide_bt_ov.GetGraphics();
			gb.FillSolidRect(0, 0, 1, this.h-1, colors.sidesline);
			var xpts3 = Array(4+xpts_mright_prev,xpts_mtop, xpts_mright_prev,4+xpts_mtop, 4+xpts_mright_prev,8+xpts_mtop, 5+xpts_mright_prev,7+xpts_mtop, 2+xpts_mright_prev,4+xpts_mtop, 5+xpts_mright_prev,1+xpts_mtop);
			var xpts4 = Array(4+xpts_mright_prev,1+xpts_mtop, 1+xpts_mright_prev,4+xpts_mtop, 4+xpts_mright_prev,7+xpts_mtop, 1+xpts_mright_prev,4+xpts_mtop);
			gb.FillPolygon(colors.normal_txt, 0, xpts3);
			gb.FillPolygon(colors.normal_txt, 0, xpts4);
		this.hide_bt_ov.ReleaseGraphics(gb);
		this.hide_bt = new button(this.hide_bt_off, this.hide_bt_ov, this.hide_bt_ov,"hide_filters", "Hide this menu");
	}
    this.getImages = function() {
		if(properties.darklayout) icon_theme_subfolder = "\\white";
		else icon_theme_subfolder = "";
		this.images.library_tree = gdi.Image(theme_img_path + "\\icons"+icon_theme_subfolder+"\\icon_tree.png");
		if(this.hide_bt) this.setHideButton();
		this.images.search_history_icon = gdi.Image(theme_img_path  + "\\icons"+icon_theme_subfolder+"\\search_history.png");
		this.images.search_history_hover_icon = gdi.Image(theme_img_path  + "\\icons"+icon_theme_subfolder+"\\search_history_hover.png");
		this.search_history_bt = new button(this.images.search_history_icon, this.images.search_history_hover_icon, this.images.search_history_hover_icon,"search_history_bt","Change grouping");		
	};
	this.getImages();
	this.on_init = function() {
		this.setItems_infos();
		this.activeItem = properties.tagMode+((properties.showLibraryTreeSwitch)?0:1);
    };
	this.on_init();

    this.setSize = function(w, h, font_size) {
        this.w = w;
		this.h = h;
		this.font_size = font_size;
		if(!this.hide_bt) this.setHideButton();
    };
	this.draw = function(gr, x, y) {
		this.x = x;
		this.y = y;
		var prev_text_width=0;

		// draw background part above playlist (headerbar)
		gr.FillSolidRect(this.x, this.y, this.w, this.h-1, colors.headerbar_bg);
		gr.FillSolidRect(this.x, this.y+this.h-1, this.w - this.x -((brw.draw_right_line)?1:0), 1, colors.headerbar_line);

		//Calculate text size
		total_txt_size = 0
		for(i = this.items_txt.length-1; i >= 0; i--) {
			this.items_width[i] = gr.CalcTextWidth(this.items_txt[i],g_font.min1);
			total_txt_size += this.items_width[i];
		}
		var tx = this.x + this.margin_left;

		//Draw texts	
		brw.margin_left = 5;
		var text_x = brw.x + brw.marginSide + brw.marginLR + brw.margin_left + brw.marginCover*2;
		gr.GdiDrawText(this.items_txt[this.activeItem], g_font.normal, colors.full_txt, text_x, this.txt_top_margin, this.w, this.h, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX | DT_END_ELLIPSIS);
		var switcher_x = gr.CalcTextWidth(this.items_txt[this.activeItem],g_font.normal)+text_x;
		this.search_history_bt.draw(gr, switcher_x, this.y+Math.round(this.h/2 - this.images.search_history_icon.Height/2), 255);
		
		if(properties.showFiltersTogglerBtn) this.hide_bt.draw(gr, this.x+this.w-(this.hide_bt.w), this.y, 255);
    };
    this.setHoverStates = function(x, y){
		var prev_hover_item = this.hoverItem;
		this.hoverItem = -1;
		for(i = 0; i < this.items_txt.length; i++) {
			if (x > this.items_x[i] && x < this.items_x[i]+this.items_width[i] && y > this.y && y < this.y + this.h) this.hoverItem = i;
		}
		if(prev_hover_item!=this.hoverItem){
			if(this.hoverItem==-1) g_cursor.setCursor(IDC_ARROW,20);
			else g_cursor.setCursor(IDC_HAND,this.items_txt[this.hoverItem]);
		}
		return (prev_hover_item!=this.hoverItem);
	}
	this.drawSwitchMenu = function(x, y) {
		var basemenu = window.CreatePopupMenu();
		if (typeof x == "undefined") x=ww;
		if (typeof y == "undefined") y=30;
		
		this.search_history_bt.changeState(ButtonStates.normal);
		
		basemenu.AppendMenuItem(MF_GRAYED, 0, "Group by:");
		basemenu.AppendMenuSeparator();
		
		for(i = this.items_txt.length-1; i >= 0; i--) {
			basemenu.AppendMenuItem(MF_STRING, i+1, this.items_txt[i]);
		}
		//basemenu.AppendMenuSeparator();
		//basemenu.AppendMenuItem(MF_STRING, 0, "Custom grouping");
		
		idx = 0;
		idx = basemenu.TrackPopupMenu(x, y, 0x0008);

		switch (true) {
			case (idx > 0 && idx <= this.items_txt.length):
				if((idx-1)!=this.activeItem) {
					this.items_functions[idx-1]();
					if(g_filterbox.inputbox.text.length > 0) {
						g_filterbox.inputbox.text = "";
						g_filterbox.inputbox.offset = 0;
						filter_text = "";
						g_sendResponse();
					}
				}			
			break;
			case (idx == properties.searchHistory_max_items+10):
				g_searchHistory.reset();
			break;
		}
		basemenu = undefined;
	}	
    this.on_mouse = function(event, x, y, delta) {
        switch(event) {
            case "lbtn_down":	
				if(this.search_history_bt.state == ButtonStates.hover) this.drawSwitchMenu(this.x+this.w,this.h+this.y-1);
				
				if(this.hoverItem != properties.tagMode-((properties.showLibraryTreeSwitch)?0:1) && this.hoverItem>-1) {
					this.items_functions[this.hoverItem]();
					if(g_filterbox.inputbox.text.length > 0) {
						g_filterbox.inputbox.text = "";
						g_filterbox.inputbox.offset = 0;
						filter_text = "";
						g_sendResponse();
					}
				}
				if(properties.showFiltersTogglerBtn && this.hide_bt.checkstate("hover", x, y)){
					this.hide_bt.checkstate("up", -1, -1);
					this.hide_bt.checkstate("leave", -1, -1);
					libraryfilter_state.toggleValue();
				}
				g_tooltip.Deactivate();
				break;
            case "lbtn_up":
                break;
            case "lbtn_dblclk":
                break;
            case "rbtn_down":
                break;
            case "move":
				if(properties.showFiltersTogglerBtn) this.hide_bt.checkstate("move", x, y);
				if(x<this.search_history_bt.x) x = this.search_history_bt.x+10;
				this.search_history_bt.checkstate("move", x, y);				
                break;
            case "leave":
				this.search_history_bt.changeState(ButtonStates.normal);
				if(properties.showFiltersTogglerBtn) this.hide_bt.checkstate("leave", x, y);
                break;
        };
    };
};
oTagSwitcherBar_old = function() {
    this.setItems_infos = function(){
		this.items_functions = new Array(
			function() {
				librarytree.toggleValue();
				window.NotifyOthers("left_filter_state","library_tree");
			}
		,
			function() {
				g_tagswitcherbar.activeItem = g_tagswitcherbar.hoverItem;
				properties.tagMode = 1;
				window.SetProperty("_PROPERTY: Tag Mode", properties.tagMode);
				window.NotifyOthers("left_filter_state","album");
				switch(properties.tagMode) {
					case 1:
						properties.albumArtId = 0;
						break;
					case 2:
						properties.albumArtId = 4;
						break;
					case 3:
						properties.albumArtId = 5;
						break;
				};
				get_metrics();
				brw.populate(true,1);
			}
		,
			function() {
				g_tagswitcherbar.activeItem = g_tagswitcherbar.hoverItem;
				properties.tagMode = 2;
				window.SetProperty("_PROPERTY: Tag Mode", properties.tagMode);
				window.NotifyOthers("left_filter_state","artist");
				switch(properties.tagMode) {
					case 1:
						properties.albumArtId = 0;
						break;
					case 2:
						properties.albumArtId = 4;
						break;
					case 3:
						properties.albumArtId = 5;
						break;
				};
				get_metrics();
				brw.populate(true,1);
			}
		,
			function() {
				g_tagswitcherbar.activeItem = g_tagswitcherbar.hoverItem;
				properties.tagMode = 3;
				window.SetProperty("_PROPERTY: Tag Mode", properties.tagMode);
				window.NotifyOthers("left_filter_state","genre");
				switch(properties.tagMode) {
					case 1:
						properties.albumArtId = 0;
						break;
					case 2:
						properties.albumArtId = 4;
						break;
					case 3:
						properties.albumArtId = 5;
						break;
				};
				get_metrics();
				brw.populate(true,1);
			}
		);
		this.items_width = new Array(0, 0, 0, 0);
		this.items_x = new Array(0, 0, 0, 0);
		this.items_txt = new Array("T","ALBUM", "ARTIST", "GENRE");
		this.items_tooltips = new Array("Library tree","Album filter", "Artist filter", "Genre filter");
		properties.album_label = this.items_txt[1];
		properties.artist_label = this.items_txt[2];
		properties.genre_label = this.items_txt[3];		
		if(properties.album_customGroup_label != this.items_txt[1] && properties.album_customGroup_label!=""){
			properties.album_label = properties.album_customGroup_label;			
			this.items_txt[1] = properties.album_customGroup_label.toUpperCase();
			this.items_tooltips[1] = properties.album_customGroup_label+" filter";
		}
		if(properties.artist_customGroup_label != this.items_txt[2] && properties.artist_customGroup_label!=""){
			properties.artist_label = properties.artist_customGroup_label;			
			this.items_txt[2] = properties.artist_customGroup_label.toUpperCase();
			this.items_tooltips[2] = properties.artist_customGroup_label+" filter";
		}
		if(properties.genre_customGroup_label != this.items_txt[3] && properties.genre_customGroup_label!=""){
			properties.genre_label = properties.genre_customGroup_label;			
			this.items_txt[3] = properties.genre_customGroup_label.toUpperCase();
			this.items_tooltips[3] = properties.genre_customGroup_label+" filter";
		}



		if(!properties.showLibraryTreeSwitch){
			this.items_txt.shift();
			this.items_width.shift();
			this.items_x.shift();
			this.items_functions.shift();
		}
	}

	this.setItems_infos();
	this.hoverItem = -1;
	this.txt_top_margin = 0;
	this.margin_right = 2;
	this.margin_left = 6;
	this.images = {};
	this.hide_bt = false;
	this.default_height = properties.TagSwitcherBarHeight_old;
	
    this.setHideButton = function(){
		this.hscr_btn_w = 18
		var xpts_mtop = Math.ceil((this.h-9)/2);
		var xpts_mright_prev = Math.floor((this.hscr_btn_w-5)/2);
		this.hide_bt_off = gdi.CreateImage(this.hscr_btn_w, this.h);
		gb = this.hide_bt_off.GetGraphics();
			gb.FillSolidRect(0, 0, 1, this.h-1, colors.sidesline);
			var xpts3 = Array(4+xpts_mright_prev,xpts_mtop, xpts_mright_prev,4+xpts_mtop, 4+xpts_mright_prev,8+xpts_mtop, 5+xpts_mright_prev,7+xpts_mtop, 2+xpts_mright_prev,4+xpts_mtop, 5+xpts_mright_prev,1+xpts_mtop);
			var xpts4 = Array(4+xpts_mright_prev,1+xpts_mtop, 1+xpts_mright_prev,4+xpts_mtop, 4+xpts_mright_prev,7+xpts_mtop, 1+xpts_mright_prev,4+xpts_mtop);
			gb.FillPolygon(colors.btn_inactive_txt, 0, xpts3);
			gb.FillPolygon(colors.btn_inactive_txt, 0, xpts4);
		this.hide_bt_off.ReleaseGraphics(gb);
		this.hide_bt_ov = gdi.CreateImage(this.hscr_btn_w, this.h);
		gb = this.hide_bt_ov.GetGraphics();
			gb.FillSolidRect(0, 0, 1, this.h-1, colors.sidesline);
			var xpts3 = Array(4+xpts_mright_prev,xpts_mtop, xpts_mright_prev,4+xpts_mtop, 4+xpts_mright_prev,8+xpts_mtop, 5+xpts_mright_prev,7+xpts_mtop, 2+xpts_mright_prev,4+xpts_mtop, 5+xpts_mright_prev,1+xpts_mtop);
			var xpts4 = Array(4+xpts_mright_prev,1+xpts_mtop, 1+xpts_mright_prev,4+xpts_mtop, 4+xpts_mright_prev,7+xpts_mtop, 1+xpts_mright_prev,4+xpts_mtop);
			gb.FillPolygon(colors.normal_txt, 0, xpts3);
			gb.FillPolygon(colors.normal_txt, 0, xpts4);
		this.hide_bt_ov.ReleaseGraphics(gb);
		this.hide_bt = new button(this.hide_bt_off, this.hide_bt_ov, this.hide_bt_ov,"hide_filters", "Hide this menu");
	}
    this.getImages = function() {
		if(properties.darklayout) icon_theme_subfolder = "\\white";
		else icon_theme_subfolder = "";
		this.images.library_tree = gdi.Image(theme_img_path + "\\icons"+icon_theme_subfolder+"\\icon_tree.png");
		if(this.hide_bt) this.setHideButton();
	};
	this.getImages();
	this.on_init = function() {
		this.setItems_infos();
		this.activeItem = properties.tagMode+((properties.showLibraryTreeSwitch)?0:1);
    };
	this.on_init();

    this.setSize = function(w, h, font_size) {
        this.w = w;
		this.h = h;
		this.font_size = font_size;
		if(!this.hide_bt) this.setHideButton();
    };
	this.draw = function(gr, x, y) {
		this.x = x;
		this.y = y;
		var prev_text_width=0;

		// draw background part above playlist (headerbar)
		gr.FillSolidRect(this.x, this.y, this.w, this.h-1, colors.headerbar_bg);
		gr.FillSolidRect(this.x, this.y+this.h-1, this.w - this.x -((brw.draw_right_line)?1:0), 1, colors.headerbar_line);

		//Calculate text size
		total_txt_size = 0
		for(i = this.items_txt.length-1; i >= 0; i--) {
			this.items_width[i] = gr.CalcTextWidth(this.items_txt[i],g_font.min1);
			total_txt_size += this.items_width[i];
		}
		var txt_padding_sides = Math.round(((this.w-(this.margin_left)*2-this.margin_right-((brw.draw_right_line)?1:0)-((properties.showFiltersTogglerBtn)?this.hide_bt.w:0))-total_txt_size)/(this.items_txt.length));
		var tx = this.x + this.margin_left;

		//Draw texts
		for(i = this.items_txt.length-1; i >= 0; i--) {
			this.items_width[i] += txt_padding_sides;
			if(i<this.items_txt.length-1) tx = tx + this.items_width[i+1];
			this.items_x[i] = tx;

			brw.margin_left = 5;
			if(this.items_txt[i].length==1){
				gr.DrawImage(this.images.library_tree, this.items_x[i]+Math.round(txt_padding_sides/2)-4, this.txt_top_margin+Math.floor((this.h-this.images.library_tree.Height)/2)-1, this.images.library_tree.Width, this.images.library_tree.Height, 0, 0, this.images.library_tree.Width, this.images.library_tree.Height, 0, (i==this.activeItem || i==this.hoverItem)?255:colors.btn_inactive_opacity);
			} else {
				gr.GdiDrawText(this.items_txt[i], g_font.min1, (i==this.activeItem || i==this.hoverItem)?colors.full_txt:colors.btn_inactive_txt, this.items_x[i], this.txt_top_margin, this.items_width[i], this.h, DT_CENTER | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX | DT_END_ELLIPSIS);
			}
			if(i==this.activeItem || i==this.hoverItem) gr.FillSolidRect(this.items_x[i]+Math.round(txt_padding_sides/2)-9, this.y+this.h-1,  this.items_width[i]-Math.round(txt_padding_sides/2)*2+16, 1, colors.full_txt);
		}
		if(properties.showFiltersTogglerBtn) this.hide_bt.draw(gr, this.x+this.w-(this.hide_bt.w), this.y, 255);
    };
    this.setHoverStates = function(x, y){
		var prev_hover_item = this.hoverItem;
		this.hoverItem = -1;
		for(i = 0; i < this.items_txt.length; i++) {
			if (x > this.items_x[i] && x < this.items_x[i]+this.items_width[i] && y > this.y && y < this.y + this.h) this.hoverItem = i;
		}
		if(prev_hover_item!=this.hoverItem){
			if(this.hoverItem==-1) g_cursor.setCursor(IDC_ARROW,20);
			else g_cursor.setCursor(IDC_HAND,this.items_txt[this.hoverItem]);
		}
		return (prev_hover_item!=this.hoverItem);
	}
    this.on_mouse = function(event, x, y, delta) {
        switch(event) {
            case "lbtn_down":
				if(this.hoverItem != properties.tagMode-((properties.showLibraryTreeSwitch)?0:1) && this.hoverItem>-1) {
					this.items_functions[this.hoverItem]();
					if(g_filterbox.inputbox.text.length > 0) {
						g_filterbox.inputbox.text = "";
						g_filterbox.inputbox.offset = 0;
						filter_text = "";
						g_sendResponse();
					}
				}
				if(properties.showFiltersTogglerBtn && this.hide_bt.checkstate("hover", x, y)){
					this.hide_bt.checkstate("up", -1, -1);
					this.hide_bt.checkstate("leave", -1, -1);
					libraryfilter_state.toggleValue();
				}
				g_tooltip.Deactivate();
				break;
            case "lbtn_up":
                break;
            case "lbtn_dblclk":
                break;
            case "rbtn_down":
                break;
            case "move":
				changed_state = this.setHoverStates(x,y);
				if(changed_state) {
					if(this.hoverItem>-1){
						g_tooltip.Deactivate();
						g_tooltip.ActivateDelay( this.items_tooltips[this.hoverItem], x+10, y+20, globalProperties.tooltip_button_delay, 1200, false, this.items_tooltips[this.hoverItem]);
					} else
						g_tooltip.Deactivate();
					brw.repaint();
				}
				if(properties.showFiltersTogglerBtn) this.hide_bt.checkstate("move", x, y);
                break;
            case "leave":
				changed_state = this.setHoverStates(-1,-1);
				if(changed_state) {
					brw.repaint();
				}
				if(properties.showFiltersTogglerBtn) this.hide_bt.checkstate("leave", x, y);
                break;
        };
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
    this.color_bg = colors.lightgrey_bg;
    this.color_txt = colors.normal_txt;

    if(this.themed) {
        this.theme = window.CreateThemeManager("scrollbar");
    } else {
        this.theme = false;
    };

    this.setNewColors = function() {
        this.color_bg = colors.lightgrey_bg;
        this.color_txt = colors.normal_txt;
        this.setButtons();
        this.setCursorButton();
    };

    this.setButtons = function() {
        // normal scroll_up Image
		this.upImage_normal = gdi.CreateImage(70, 70);
		var gb = this.upImage_normal.GetGraphics();
		DrawPolyStar(gb, 11, 16, 44, 1, 3, 0, colors.normal_txt, colors.faded_txt, 0, 255);
        this.upImage_normal.ReleaseGraphics(gb);

        // hover scroll_up Image
		this.upImage_hover = gdi.CreateImage(70, 70);
		var gb = this.upImage_hover.GetGraphics();
		DrawPolyStar(gb, 11, 16, 44, 1, 3, 0, colors.faded_txt, colors.faded_txt, 0, 255);
        this.upImage_hover.ReleaseGraphics(gb);

        // down scroll_up Image
		this.upImage_down = gdi.CreateImage(70, 70);
		gb = this.upImage_down.GetGraphics();
		DrawPolyStar(gb, 11, 13, 44, 1, 3, 0, colors.normal_txt, colors.faded_txt, 0, 255);
        this.upImage_down.ReleaseGraphics(gb);

        // normal scroll_down Image
		this.downImage_normal = gdi.CreateImage(70, 70);
		gb = this.downImage_normal.GetGraphics();
		DrawPolyStar(gb, 11, 10, 44, 1, 3, 0, colors.normal_txt, colors.faded_txt, 180, 255);
        this.downImage_normal.ReleaseGraphics(gb);

        // hover scroll_down Image
		this.downImage_hover = gdi.CreateImage(70, 70);
		gb = this.downImage_hover.GetGraphics();
		DrawPolyStar(gb, 11, 10, 44, 1, 3, 1, colors.faded_txt, colors.faded_txt, 180, 255);
        this.downImage_hover.ReleaseGraphics(gb);

        // down scroll_down Image
		this.downImage_down = gdi.CreateImage(70, 70);
		gb = this.downImage_down.GetGraphics();
		DrawPolyStar(gb, 11, 13, 44, 1, 3, 0, colors.normal_txt, colors.faded_txt, 180, 255);
        this.downImage_down.ReleaseGraphics(gb);
        var tot = this.buttons.length
        for(i = 1; i < tot; i++) {
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
		gb.FillSolidRect(this.cursorw-cScrollBar.normalWidth-1, cScrollBar.marginTop, cScrollBar.normalWidth-2, this.cursorh-cScrollBar.marginTop-cScrollBar.marginBottom, colors.scrollbar_normal_cursor);

        this.cursorImage_normal.ReleaseGraphics(gb);

        // hover cursor Image
        this.cursorImage_hover = gdi.CreateImage(this.cursorw, this.cursorh);
        gb = this.cursorImage_hover.GetGraphics();
        // Draw Themed Scrollbar (lg/col)
		gb.FillSolidRect(this.cursorw-cScrollBar.hoverWidth, 0, cScrollBar.hoverWidth, this.cursorh,colors.scrollbar_hover_cursor);
        this.cursorImage_hover.ReleaseGraphics(gb);

        // down cursor Image
        this.cursorImage_down = gdi.CreateImage(this.cursorw, this.cursorh);
        gb = this.cursorImage_down.GetGraphics();
		gb.FillSolidRect(this.cursorw-cScrollBar.downWidth, 0, cScrollBar.downWidth, this.cursorh,colors.scrollbar_down_cursor);

        this.cursorImage_down.ReleaseGraphics(gb);

        // create/refresh cursor Button in buttons array
        this.buttons[this.buttonType.cursor] = new button(this.cursorImage_normal, this.cursorImage_hover, this.cursorImage_down,"scrollbarcursor");
        this.buttons[this.buttonType.cursor].x = this.x;
        this.buttons[this.buttonType.cursor].y = this.cursory;
    };

    this.draw = function(gr) {

	   // gr.FillSolidRect(this.x, this.y, this.w, this.h, this.color_bg & 0x25ffffff);
		//gr.FillSolidRect(this.x, this.y, 1, this.h, this.color_txt & 0x05ffffff);

        // scrollbar buttons
        if(cScrollBar.visible) this.buttons[this.buttonType.cursor].draw(gr, this.x, this.cursory, 255);
        if(this.showButtons && properties.drawUpAndDownScrollbar) {
            this.buttons[this.buttonType.up].draw(gr, this.x, this.y, 255);
            this.buttons[this.buttonType.down].draw(gr, this.x, this.areay + this.areah, 255);
        };
    };

    this.updateScrollbar = function() {
        var prev_cursorh = this.cursorh;
        this.total = (brw.rowsCount+properties.addedRows_end);
        this.rowh = properties.rowHeight;
        this.totalh = this.total * this.rowh;
        // set scrollbar visibility
        cScrollBar.visible = (this.totalh > brw.h);
        // set cursor width/height
        this.cursorw = cScrollBar.activeWidth;
        if(this.total > 0) {
            this.cursorh = Math.round((brw.h / this.totalh) * this.areah);
            if(this.cursorh < cScrollBar.minCursorHeight) this.cursorh = cScrollBar.minCursorHeight;
			if(this.cursorh > cScrollBar.maxCursorHeight) this.cursorh = cScrollBar.maxCursorHeight;
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
        this.x = brw.x + brw.w-cScrollBar.activeWidth+(brw.draw_right_line?0:1);
        this.y = brw.y - properties.headerBarHeight*0;
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
			this.cursorHover = false;
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
				//Cursor hover state on whole scrollbar zone
				/*if(this.isHoverArea) {
					this.buttons[this.buttonType.cursor].state = ButtonStates.hover;
				} else {
					this.buttons[this.buttonType.cursor].state = ButtonStates.normal;
				}*/
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
		return this.isHover;
    };
};

oGroup = function(index, start, handle, groupkey, sortkey) {
	this.index = index;
	this.start = start;
	this.count = 1;
    this.metadb = handle;
    this.groupkey = groupkey;
    this.cover_img_mask = null;
	this.sortkey = sortkey.toLowerCase();
	this.sortkeyNoPrefix = "";
    if(handle) {
        switch(properties.tagMode) {
            case 1:
                this.cachekey = process_cachekey(handle);
                break;
            case 2:
                this.cachekey = process_cachekey(handle,properties.tf_crc_artist);
                this.cachekey_album = process_cachekey(handle);
                break;
            case 3:
                this.cachekey = process_cachekey(handle,properties.tf_crc_genre);
                this.cachekey_album = process_cachekey(handle);
                break;
        }
        this.tracktype = TrackType(handle);
    } else {
        this.cachekey = null;
        this.tracktype = 0;
    };
    //
    this.cover_img = null;
    this.cover_type = null;
    this.load_requested = 0;
    this.save_requested = false;
	this.cover_formated = false;
    this.finalize = function(count, tracks, handles) {
        this.tra = tracks.slice(0);
        this.pl = handles.Clone();
        this.count = count;
		if(properties.removePrefix) this.removePrefix();
    };
	this.removePrefix = function() {
		var substr = /^(the|les|los) /;
		this.sortkeyNoPrefix = this.sortkey.replace(substr, '');
	};
};

oBrowser = function(name) {
    this.name = name;
    this.groups = [];
    this.rows = [];
    this.SHIFT_start_id = null;
    this.SHIFT_count = 0;
    this.scrollbar = new oScrollbar(themed = cScrollBar.themed);
    this.keypressed = false;
    this.selectedIndex = -1;
    this.margin_left = 5;
    this.margin_right = 3;
	this.textMarginRight = 10;
    this.metadblist_selection = plman.GetPlaylistSelectedItems(g_active_playlist);
	this.sourceIdx = -1;
	this.playingIdx = -1;
	this.selectionIdx = -1;
	this.coverMask = false;
	this.cover_img_all_finished = false;
	this.group_unrequested_loading = false;
	this.FirstInitialisationDone = false;
	this.clearSelectedItemsOnNextClick = false;
	this.drag_clicked = false;
	this.drag_clicked_x = 0;
	this.drag_clicked_y = 0;
	this.saved_send_index = -1;
	this.saved_send_index_to = -1;
	this.timer_populate_id = 0;
	this.timer_populate_is_first = false;
	this.drag_moving = false;
	this.tempSelectedItem = -1;
	this.firstRowHeight = false;
	this.secondRowHeight = false;
	this.draw_right_line = false;
	this.customGroups = false;
	this.tooltip_activated = false;
    this.launch_populate = function() {
		brw.populate(is_first_populate = true,0);
		pman.populate(exclude_active = false, reset_scroll = true);
		this.searchPlaylists();
    };
    this.timer_populate = function(is_first, id) {
		this.timer_populate_is_first = is_first;
		this.timer_populate_id = id;
        if (timers.populate) clearTimeout(timers.populate);
        timers.populate = false;
        timers.populate = setTimeout(function() {
            brw.populate(brw.timer_populate_is_first,brw.timer_populate_id);
			clearTimeout(timers.populate);
			timers.populate = false;
        }, 500);
    };
    this.repaint = function() {
        repaint_main1 = repaint_main2;
    };

	this.get_metrics = function() {
        switch(properties.displayMode) {
            case 1:
            case 3:
                // *** STAMP MODES ***
                this.stampDrawMode = (properties.displayMode == 1 ? true : false);
                this.thumb_w = properties.thumbnailWidth;
                this.marginLR = 0;
                // set margins betweens album stamps
                if(properties.displayMode == 1) {
                    this.marginTop = 0;
                    this.marginBot = 0;
                    this.marginSide = 0;
                    this.marginCover = 10;
					this.marginLR = 0;
                } else if(properties.displayMode == 3 && properties.displayModeGridNoText){
                    this.marginTop = 0;
                    this.marginBot = 0;
                    this.marginSide = 0;
                    this.marginCover = 0;
					this.marginLR = 0;
                } else {
                    this.marginTop = 0;
                    this.marginBot = 0;
                    this.marginSide = 0;
                    this.marginCover = 0;
					this.marginLR = 2;
                };
                // Adjust Column
                this.totalColumns = Math.floor((this.w - this.marginLR * 2) / this.thumb_w);
                if(this.totalColumns < properties.MinNumberOfColumns) this.totalColumns = properties.MinNumberOfColumns;
                // count total of rows for the whole library
                this.rowsCount = Math.ceil(this.groups.length / this.totalColumns);
                var gapeWidth = (this.w - this.marginLR * 2) - (this.totalColumns * this.thumb_w);
				if(properties.displayMode == 3 && properties.displayModeGridNoText)
					var deltaToAdd = Math.ceil(gapeWidth / this.totalColumns);
				else
					var deltaToAdd = Math.floor(gapeWidth / this.totalColumns);
                this.thumbnailWidth = this.thumb_w + deltaToAdd;
                // calc size of the cover art
                cover.max_w = (this.thumbnailWidth - (this.marginSide * 2) - (this.marginCover * 2));
				try {
					images.loading_draw = images.loading.Resize(cover.max_w, cover.max_w, 7);
				} catch (e) {
				}
                // Adjust Row & showList bloc Height
                if(properties.displayMode == 1) {
                    this.rowHeight = 5 + cover.max_w + this.firstRowHeight + this.secondRowHeight + properties.botStampHeight; //properties.botStampHeight;
                } else {
                    this.rowHeight = cover.max_w;
                };
                break;
            case 0:
            case 2:
                // *** LINE MODES ***
                this.stampDrawMode = true;
                this.thumb_w = this.w;
                this.marginLR = 0;
                // set margins betweens album stamps
                this.marginTop = (properties.displayMode > 0 ? 0 : 0);
                this.marginBot = (properties.displayMode > 0 ? 0 : 0);
                this.marginSide = 0;
                this.marginCover = (properties.displayMode > 0 ? 7 : 5);
                // Adjust Column
                this.totalColumns = 1;
                // count total of rows for the whole library
                this.rowsCount = this.groups.length;
                this.thumbnailWidth = this.thumb_w;

                // Adjust Row & showList bloc Height
                switch(properties.tagMode) {
                    case 1: // album
                        this.rowHeight = (properties.displayMode == 0 ? Math.ceil(properties.lineHeightMin * 1.7): Math.ceil(properties.lineHeightMin * 1.7));
                        break;
                    case 2: // artist
						if(properties.displayMode == 0) this.rowHeight =  properties.lineHeightMin;
						else this.rowHeight =  Math.ceil(properties.lineHeightMin * 1.5);
                        break;
                    case 3: // genre
						if(properties.displayMode == 0) this.rowHeight =  properties.lineHeightMin;
						else this.rowHeight =  Math.ceil(properties.lineHeightMin * 1.5);
                        break;
                }
                // calc size of the cover art
                cover.max_w = (this.rowHeight - (this.marginCover * 2));
                break;
        };
	}
    this.update = function() {

		this.get_metrics();

		this.cover_img_all_finished = false;
		this.cover_img_all_mask = false;
		this.cover_img_all = false;
        this.totalRows = Math.ceil(this.h / this.rowHeight);
        this.totalRowsVis = Math.floor(this.h / this.rowHeight);
        properties.rowHeight = this.rowHeight;

        //
        scroll = Math.round(scroll / this.rowHeight) * this.rowHeight;
        scroll = check_scroll(scroll);
        //scroll_ = scroll + (this.rowHeight / properties.scrollRowDivider);
        scroll_ = scroll;

        // scrollbar update
        this.scrollbar.updateScrollbar();

        this.repaint();
    };

    this.setSize = function(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        if(properties.showTagSwitcherBar) g_tagswitcherbar.setSize(ww, g_tagswitcherbar.default_height, g_fsize-1);
        if(properties.showHeaderBar) g_filterbox.setSize(ww, cFilterBox.h+2, g_fsize+1);

        this.scrollbar.setSize();

        scroll = Math.round(scroll / properties.rowHeight) * properties.rowHeight;
        scroll = check_scroll(scroll);
        scroll_ = scroll;

        // scrollbar update
        this.scrollbar.updateScrollbar();

        this.update();

        if(properties.DropInplaylist) pman.setSize(ww, y + 45, ww, h - 90);
    };
    this.setList = function() {
        var end = this.groups.length;
        for(var i = 0; i < end; i++) {
            this.groups[i].load_requested = 0;
			this.groups[i].cover_formated = false;
        };
    };

    this.showItemFromItemHandle = function(metadb, showItemTemporary) {
        var total = this.groups.length;
        var total_tracks = 0;
        var found = false;
        for(var a = ((properties.showAllItem && this.groups.length>1) ? 1 : 0); a < total; a++) {
            total_tracks = this.groups[a].pl.Count;
            for(var t = 0; t < total_tracks; t++) {
                found = this.groups[a].pl[t].Compare(metadb);
                if(found) {
                    break;
                };
            };
            if(found) break;
        };

        if(found) { // scroll to item

            if(properties.showAllItem && this.groups.length>1 && a == 0) a += 1;
            switch(properties.displayMode) {
                case 1:
                case 3:
                    var row = Math.floor(a / this.totalColumns);
                    if(this.h / 2 > this.rowHeight) {
                        var delta = Math.floor(this.h / 2);
                    } else {
                        var delta = 0
                    };
                    scroll = row * this.rowHeight - delta;
                    scroll = check_scroll(scroll);
                    break;
                case 0:
                case 2:
                    if(this.h / 2 > this.rowHeight) {
                        var delta = Math.floor(this.h / 2);
                    } else {
                        var delta = 0
                    };
                    scroll = a * this.rowHeight - delta;
                    scroll = check_scroll(scroll);
                    break;
            };
            this.activateItem(a,showItemTemporary);
        };
    };

    this.showNowPlaying = function() {
        if(fb.IsPlaying) {
            try{
				this.tempSelectedItem = -1;
                if(this.current_sourceMode == 1 || this.current_sourceMode == 3) {
                    if(plman.PlayingPlaylist != plman.ActivePlaylist) {
                        g_active_playlist = plman.ActivePlaylist = plman.PlayingPlaylist;
                    };
					if(plman.PlayingPlaylist==this.pidx_filter && properties.filtred_playlist_idx>-1) {
						brw.populate(true, "showNowPlaying", false, properties.filtred_playlist_idx);
					} else if(brw.sourcePlaylistIdx != plman.PlayingPlaylist) brw.populate(true, "showNowPlaying", false, plman.PlayingPlaylist);
					var handle = fb.GetNowPlaying();
					this.showItemFromItemHandle(handle, true);
                    /*this.nowplaying = plman.GetPlayingItemLocation();
                    var gid = this.getItemIndexFromTrackIndex(this.nowplaying.PlaylistItemIndex);
                    if(gid > -1) {
                        this.showItemFromItemIndex(gid);
                    };*/
                } else {
                    var handle = fb.GetNowPlaying();
                    if(fb.IsMetadbInMediaLibrary(handle)) {
                        this.showItemFromItemHandle(handle, true);
                    };
                };
				this.repaint();
            } catch(e) {console.log(e)};
        };
    };

    this.showItemFromItemIndex = function(index) {
        if(properties.showAllItem && index == 0) index += 1;
        switch(properties.displayMode) {
            case 1:
            case 3:
                var row = Math.floor(index / this.totalColumns);
                if(this.h / 2 > this.rowHeight) {
                    var delta = Math.floor(this.h / 2);
                } else {
                    var delta = 0
                };
                scroll = row * this.rowHeight - delta;
                scroll = check_scroll(scroll);
                break;
            case 0:
            case 2:
                if(this.h / 2 > this.rowHeight) {
                    var delta = Math.floor(this.h / 2);
                } else {
                    var delta = 0
                };
                scroll = index * this.rowHeight - delta;
                scroll = check_scroll(scroll);
                break;
        };
        this.activateItem(index);
    };

    this.getItemIndexFromTrackIndex = function(tid) {
        var mediane = 0; var deb = 0; var fin = this.groups.length - 1;
        while(deb <= fin){
            mediane = Math.floor((fin + deb)/2);
            if(tid >= this.groups[mediane].start && tid < this.groups[mediane].start + this.groups[mediane].count) {
                return mediane;
            } else if(tid < this.groups[mediane].start) {
                fin = mediane - 1;
            } else {
                deb = mediane + 1;
            };
        };
        return -1;
    };

    this.selectAtoB = function(start_id, end_id) {
        var affectedItems = Array();

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
    };
    this.init_groups = function() {
		var handle = null;
		var current = "";
		var previous = "";
        var g = 0, t = 0;
        var arr = [];
        var tr = [];
        var pl = new FbMetadbHandleList();
        var total = this.list.Count;
        var t_all = 0;
        var tr_all = [];
        var pl_all = new FbMetadbHandleList();
        var flag = [];
		var default_grouping = false;
		this.groups.splice(0, this.groups.length);

        switch(properties.tagMode) {
            case 1: // album
				if(properties.tf_groupkey_album==properties.tf_groupkey_album_default){
					default_grouping = true;
					var tf = fb.TitleFormat(properties.tf_groupkey_album+properties.tf_groupkey_album_addinfos);
				} else
					var tf = fb.TitleFormat(properties.tf_groupkey_album+properties.tf_groupkey_album_addinfos+" ## "+properties.tf_groupkey_album_default);
                break;
            case 2: // artist
                var tf = fb.TitleFormat(properties.tf_groupkey_artist);
                break;
            case 3: // genre
                var tf = fb.TitleFormat(properties.tf_groupkey_genre);
                break;
        };
        var str_filter = process_string(filter_text);
		var previous_item_genre = "123456789";
		for(var i = 0; i < total; i++) {

			handle = this.list[i];
            arr = tf.EvalWithMetadb(handle).split(" ## ");
			current = arr[0].toLowerCase();

            if(str_filter.length > 0) {
                var comp_str = (arr.length > 1 ? arr[0]+" "+arr[1] : arr[0]);
                var toAdd = match(comp_str, str_filter);
            } else {
                var toAdd = true;
            };
            if(toAdd) {
                if(current != previous && !flag["#"+current]) {
                    if(this.current_sourceMode == 1 || this.current_sourceMode == 3) {
						flag["#"+current] = true;
					}
                    if(g > 0) {
                        // update current group
                        this.groups[g-1].finalize(t, tr, pl);
                        tr.splice(0, t);
                        pl.RemoveAll();
                        t = 0;
                    };
                    if(i < total) {
                        // add new group
                        tr.push(arr[1]);
                        pl.Add(handle);
                        if(properties.showAllItem) {
                            tr_all.push(arr[1]);
                            pl_all.Add(handle);
                        };
                        t_all++;
                        t++;
                        this.groups.push(new oGroup(g+1, i, handle, arr[0], arr[0]));
                        g++;
						this.groups[g-1].date = arr[2];
						if(properties.tagMode==1){
							if(default_grouping){
								var artist_album = arr[0].split(" ^^ ");
							} else {
								var artist_album = arr[3].split(" ^^ ");
							}
							this.groups[g-1].artist_name = artist_album[0];
							this.groups[g-1].album = artist_album[1];
						}
                        previous = current;
                    };
                } else {
                    // add track to current group
                    tr.push(arr[1]);
                    pl.Add(handle);
                    if(properties.showAllItem) {
                        tr_all.push(arr[1]);
                        pl_all.Add(handle);
                    };
                    t_all++;
                    t++;
                };
            };
		};
        if(g > 0) {
            // update last group properties
            this.groups[g-1].finalize(t, tr, pl);
			//this.groups[g-1].date = arr[2];

			/*if(properties.tagMode==1){
				if(default_grouping){
					var artist_album = arr[0].split(" ^^ ");
				} else {
					var artist_album = arr[3].split(" ^^ ");
				}
				this.groups[g-1].artist_name = artist_album[0];
				this.groups[g-1].album = artist_album[1];
			}*/

			//this.groups[g-1].artist_name = arr[4];
            // add 1st group ("ALL" item)
            if(properties.showAllItem && g > 1) {
                this.groups.unshift(new oGroup(0, 0, null, null,""));
                this.groups[0].finalize(t_all, tr_all, pl_all);
            };
        };
		if(properties.removePrefix) this.sort();
        // free memory
        tr.splice(0, tr.length);
        tr_all.splice(0, tr_all.length);
        flag.splice(0, flag.length);
        pl.RemoveAll();
        pl_all.RemoveAll();
    };
	this.sort = function() {
		function noPrefixSorting(a,b) {
			return a.sortkeyNoPrefix.localeCompare(b.sortkeyNoPrefix, 'gb', { sensitivity: 'base' });
			if(a.sortkeyNoPrefix < b.sortkeyNoPrefix) return -1;
			if(a.sortkeyNoPrefix > b.sortkeyNoPrefix) return 1;
			return 0;
		}
		function standardSorting(a,b) {
			return a.sortkey.localeCompare(b.sortkey, 'gb', { sensitivity: 'base' });
			if(a.sortkey < b.sortkey) return -1;
			if(a.sortkey > b.sortkey) return 1;
			return 0;
		}		
		if(properties.removePrefix) this.groups.sort(noPrefixSorting);
		else this.groups.sort(standardSorting);
	}
    this.populate = function(is_first_populate, call_id, force_sourceMode, force_playlist) {
		
		this.current_sourceMode = properties.sourceMode;
		if((!filter1_state.isActive() && properties.filterOrder==1) || (!filter1_state.isActive() && !filter2_state.isActive() && properties.filterOrder==2))
			this.current_sourceMode = 0;

		if(properties.adapt_to_playlist) this.current_sourceMode = 1;
		if(force_sourceMode) this.populate_sourceMode = force_sourceMode;
		else this.populate_sourceMode = this.current_sourceMode;

        console.log("--> populate Filter order:"+properties.filterOrder+" parent panel:"+properties.ParentName+" call_id:"+call_id);
		//gTime_pop = fb.CreateProfiler();
		//gTime_pop.Reset();
		//console.log("Filter populate started time:"+gTime_pop.Time);
		this.sourcePlaylistIdx = -1;
        if(this.list) this.list = undefined;
        if(this.list_unsorted) this.list_unsorted = undefined;
		if(!globalProperties.loaded_covers2memory) g_image_cache.resetAll();
		scroll = scroll_ = 0;

        // define sort order
        switch(properties.tagMode) {
            case 1: // album
				if(properties.tf_groupkey_album == properties.tf_groupkey_album_default){
					var TFsorting = properties.albumsTFsortingdefault;
					this.customGroups = false;
				} else {
					var TFsorting = properties.tf_groupkey_album + " | %date% | %album% | %discnumber% | %tracknumber% | %title%";
					this.customGroups = true;
                }
				break;
            case 2: // artist
				if(properties.tf_groupkey_artist == properties.tf_groupkey_artist_default) {
					var TFsorting = properties.artistsTFsortingdefault;
					this.customGroups = false;
				} else {
					var TFsorting = properties.tf_groupkey_artist + " | %date% | %album% | %discnumber% | %tracknumber% | %title%";
					this.customGroups = true;
				}
                break;
            case 3: // genre
				if(properties.tf_groupkey_genre == properties.tf_groupkey_genre_default) {
					var TFsorting = properties.genresTFsortingdefault;
					this.customGroups = false;
				} else {
					var TFsorting = properties.tf_groupkey_genre + " | %album artist% | %date% | %album% | %discnumber% | %tracknumber% | %title%";
					this.customGroups = true;
                }
				break;
        };

		if(typeof force_playlist !== 'undefined'){
			this.list = plman.GetPlaylistItems(force_playlist);
			this.sourcePlaylistIdx = force_playlist;
		} else if(this.populate_sourceMode == 0) {
            // populate library
            this.list = fb.GetLibraryItems();
        } else if(this.populate_sourceMode == 2) {
			// Find the source playlist
			var total = plman.PlaylistCount;

			var pfound = false;
			for(var i = 0; i < total; i++) {
				if(!pfound && plman.GetPlaylistName(i) == properties.sourcePlaylist) {
					this.sourceIdx = i;
					pfound = true;
				};
				if(pfound) break;
			};

            // populate library
            if(this.sourceIdx>-1) {
				this.sourcePlaylistIdx = this.sourceIdx;
				this.list = plman.GetPlaylistItems(this.sourceIdx);
			} else {
				this.list = fb.GetLibraryItems();
			}
        } else if(this.populate_sourceMode == 3) {
            // populate current playlist
			if(!browser_refresh_required && !is_first_populate) return;
			if(!g_first_populate_done) {
				this.list = fb.GetLibraryItems();
            } else {
				//this.list_unsorted =
				this.list = plman.GetPlaylistItems(plman.ActivePlaylist);
				this.sourcePlaylistIdx = plman.ActivePlaylist;
			}
            browser_refresh_required=false;
        } else {
			this.list = plman.GetPlaylistItems(plman.ActivePlaylist);
			this.sourcePlaylistIdx = plman.ActivePlaylist;
        };
		// sort the list
		if(TFsorting.length > 0) {
			this.list.OrderByFormat(fb.TitleFormat(TFsorting), 1);
		};
		this.selectedIndex=-1;
		this.tempSelectedItem = -1;
		this.MultipleSelectedIndex = [];
        this.init_groups();
        get_metrics();
        this.setList();
        this.update();
        this.scrollbar.updateScrollbar();
        this.repaint();
        g_first_populate_done = true;
		//console.log("Filter populate finished time:"+gTime_pop.Time);
    };

    this.clearSelectedItem = function() {
		this.selectedIndex = -1;
		this.MultipleSelectedIndex = [];
	}
    this.clearMultipleSelectedItem = function() {
		this.MultipleSelectedIndex = [];
	}
    this.activateItem = function(index, showItemTemporary) {
        if(this.groups.length == 0) return;
		if(utils.IsKeyPressed(VK_CONTROL) && this.selectedIndex>-1) {
			if(!arrayContains(this.MultipleSelectedIndex,this.selectedIndex)){
				this.MultipleSelectedIndex.push(this.selectedIndex);
			}
		} else this.MultipleSelectedIndex = [];
        if(!showItemTemporary) {
			this.selectedIndex = index;
			this.tempSelectedItem = -1;
		} else {
			this.tempSelectedItem = index;
			this.selectedIndex = -1;
		}
    }
    this.focusItemToPlaylist = function(metadb) {
        if(this.groups.length == 0) return;

        var affectedItems = [];
        var total = this.list_unsorted.Count;
        for(var a = 0; a < total; a++) {
            if(this.list_unsorted[a].Compare(metadb)) {
                affectedItems.push(a);
            };
        };
        if(affectedItems.length > 0) {
            //plman.ClearPlaylistSelection(g_active_playlist);
            //plman.SetPlaylistSelection(g_active_playlist, affectedItems, true);
            g_avoid_on_item_focus_change = true;
            plman.SetPlaylistFocusItemByHandle(g_active_playlist, metadb);
        };
    };
	this.save_sendItemToPlaylist = function(index,index_to) {
		index_to = typeof index_to !== 'undefined' ? index_to : -1;
		this.saved_send_index = index;
		this.saved_send_index_to = index_to;
	}
	this.sendSelectedItemsToPlaylist = function() {
		if(this.saved_send_index>-1) {
			this.sendItemToPlaylist(this.saved_send_index,this.saved_send_index_to);
		}
	}
	this.clearSaved_sendItemToPlaylist = function() {
		this.saved_send_index = -1;
		this.saved_send_index_to = -1;
	}
	this.searchPlaylists = function(){
        this.pfound_selectionPlaylist = false;
        this.pfound_playingPlaylist = false;
        this.pfound_filterPlaylist = false;		
        this.pidx_selection = -1;
        this.pidx_playing = -1;
        this.pidx_filter = -1;
        var total = plman.PlaylistCount;
        for(var i = 0; i < total; i++) {
            if(!this.pfound_selectionPlaylist && plman.GetPlaylistName(i) == properties.selectionPlaylist) {
                this.pidx_selection = i;
                this.pfound_selectionPlaylist = true;
            };
            if(!this.pfound_filterPlaylist && plman.GetPlaylistName(i) == properties.filterPlaylist) {
                this.pidx_filter = i;
                this.pfound_filterPlaylist = true;
            };			
            if(!this.pfound_playingPlaylist && plman.GetPlaylistName(i) == properties.playingPlaylist) {
                this.pidx_playing = i;
                this.pfound_playingPlaylist = true;
            };
            if(this.pfound_selectionPlaylist && this.pfound_playingPlaylist && this.pfound_filterPlaylist) break;
        };
		if(!this.pfound_selectionPlaylist) {
			this.pidx_selection = plman.PlaylistCount;
			plman.CreatePlaylist(this.pidx_selection, properties.selectionPlaylist);
		};
		if(!this.pfound_playingPlaylist) {
			this.pidx_playing = plman.PlaylistCount;
			plman.CreatePlaylist(this.pidx_playing, properties.playingPlaylist);
		};		
		if(!this.pfound_filterPlaylist) {
			this.pidx_filter = plman.PlaylistCount;
			plman.CreatePlaylist(this.pidx_filter, properties.filterPlaylist);
		};
		this.setReceiverPlaylist();		
	}
	this.setReceiverPlaylist = function() {
		if(properties.adapt_to_playlist){
			if(!this.pfound_filterPlaylist) this.searchPlaylists();
			this.pidx_to_send = this.pidx_filter;
			this.name_to_send = properties.filterPlaylist;
		} else {
			if(!this.pfound_selectionPlaylist) this.searchPlaylists();
			this.pidx_to_send = this.pidx_selection;
			this.name_to_send = properties.selectionPlaylist;			
		}
	}
	this.getSelectedItems = function() {
		var selectedItems = new FbMetadbHandleList();

		if(this.selectedIndex>-1)
			selectedItems.InsertRange(0,this.groups[this.selectedIndex].pl);
		var total = this.MultipleSelectedIndex.length
		for(var i = 0; i < total; i++){
			if(this.MultipleSelectedIndex[i]!=this.selectedIndex)
				selectedItems.InsertRange(selectedItems.Count,this.groups[this.MultipleSelectedIndex[i]].pl);
		}
		return selectedItems;
	}
	this.setFiltredPlaylist = function(filtred_playlist_idx) {
		if(properties.filtred_playlist_idx>-1 || filtred_playlist_idx>-1){
			properties.filtred_playlist_idx = filtred_playlist_idx;
			window.SetProperty("_PROPERTY: filtred playlist idx", properties.filtred_playlist_idx);
		}		
	}
    this.sendItemToPlaylist = function(index,index_to) {
		index_to = typeof index_to !== 'undefined' ? index_to : -1;

		this.saved_send_index = -1;
		this.saved_send_index_to = -1;

        if(this.groups.length == 0) return;

        // check if playlists are present
        var items2remove = [];
		var inserted = false;
		var clearPlaylist = false;
		this.clearSelectedItemsOnNextClick = false;

		var toInsert = new FbMetadbHandleList();
		var playlistToInsert = -1;
		var positionToInsert = -1;
		this.setReceiverPlaylist();
		
        if(index_to>-1 && index_to>index){
            // *** insert tracks into this.pidx_to_send playlist
			for(var i = index; i <= index_to; i++) {
				if(!arrayContains(this.MultipleSelectedIndex,i) && i!=this.selectedIndex) {
					this.MultipleSelectedIndex.push(i);
					toInsert.InsertRange(toInsert.Count,this.groups[i].pl);
					inserted = true;
				}
			}
			playlistToInsert = this.pidx_to_send;
			positionToInsert = plman.PlaylistItemCount(this.pidx_to_send);
			//plman.InsertPlaylistItems(this.pidx_to_send, from, toInsert, false);
		}
        else if(utils.IsKeyPressed(VK_CONTROL) && this.MultipleSelectedIndex.length>0) {
			 var from = plman.PlaylistItemCount(this.pidx_to_send);
            // *** insert tracks into this.pidx_to_send playlist
            if(!arrayContains(this.MultipleSelectedIndex,index)) {
				toInsert.InsertRange(toInsert.Count,this.groups[index].pl);
				playlistToInsert = this.pidx_to_send;
				positionToInsert = from;
				inserted = true;
			}
        } else {
            if(fb.IsPlaying) {
                if(plman.PlayingPlaylist == this.pidx_to_send) { // playing playlist is this.name_to_send
					window.NotifyOthers("avoid_on_playlists_changed",true);
                    plman.RenamePlaylist(this.pidx_to_send, properties.playingPlaylist);
                    if(this.pfound_playingPlaylist) {
                        plman.RenamePlaylist(this.pidx_playing, this.name_to_send);
                        clearPlaylist = true;
                    } else {
                        this.pidx_playing = plman.PlaylistCount;
                        plman.CreatePlaylist(this.pidx_playing, this.name_to_send);
                    };
                    // *** insert tracks into this.pidx_playing playlist
					playlistToInsert = this.pidx_playing;
					positionToInsert = 0;
					toInsert.InsertRange(toInsert.Count,this.groups[index].pl);
					inserted = true;
					var previous_pidx=this.pidx_to_send;
					if(properties.adapt_to_playlist) this.pidx_selection = this.pidx_playing;
					else this.pidx_filter = this.pidx_playing;
					this.pidx_to_send = this.pidx_playing;
					this.pidx_playing = previous_pidx;
					window.NotifyOthers("UpdatePlaylists",true);
					setPlaybackPlaylist_timer = setTimeout(function() {
						window.NotifyOthers("avoid_on_playlists_changed",false);
						setPlaybackPlaylist_timer && clearTimeout(setPlaybackPlaylist_timer);
						setPlaybackPlaylist_timer = false;
					}, 125);					
                } else {
                    // *** insert tracks into this.pidx_to_send playlist
					clearPlaylist = true;
					playlistToInsert = this.pidx_to_send;
					positionToInsert = 0;
					toInsert.InsertRange(toInsert.Count,this.groups[index].pl);
					inserted = true;
                };
            } else {
                // *** insert tracks into this.pidx_to_send playlist
				clearPlaylist = true;
				playlistToInsert = this.pidx_to_send;
				positionToInsert = 0;
				toInsert.InsertRange(toInsert.Count,this.groups[index].pl);
				inserted = true;
            };
            plman.ActivePlaylist = this.pidx_to_send;
        };
		if(inserted) {
			plman.UndoBackup(playlistToInsert);
			if(clearPlaylist){
				plman.ClearPlaylist(playlistToInsert);
				
			} else if(items2remove.length>0){
				plman.SetPlaylistSelection(playlistToInsert, items2remove, true);
				plman.RemovePlaylistSelection(playlistToInsert, false);
			}
			plman.InsertPlaylistItems(playlistToInsert, positionToInsert, toInsert, false);
			toInsert = undefined;
			if(brw.sourcePlaylistIdx != brw.pidx_filter && properties.adapt_to_playlist && brw.sourcePlaylistIdx>-1) {
				window.NotifyOthers("refresh_filters",[properties.filterOrder,brw.sourcePlaylistIdx]);
				this.setFiltredPlaylist(brw.sourcePlaylistIdx);
			} else window.NotifyOthers("refresh_filters",[properties.filterOrder]);
			this.repaint();
		}
    };

    this.getlimits = function() {

        // get visible stamps limits (start & end indexes)
        if(this.groups.length <= this.totalRowsVis * this.totalColumns) {
            var start_ = 0;
            var end_ = this.groups.length;
        } else {
            var start_ = Math.round(scroll_/this.rowHeight) * this.totalColumns;
            var end_ = Math.round((scroll_ + wh + this.rowHeight) / this.rowHeight) * this.totalColumns;
            // check values / limits
			if(properties.showAllItem && end_ < 5) end_ = 5;
            end_ = (this.groups.length < end_) ? this.groups.length : end_;
            start_ = start_ > 0 ? start_ - this.totalColumns : (start_ < 0 ? 0 : start_);
        };

        // save limits calculated into globals var
        g_start_ = start_;
        g_end_ = end_;
    };
    this.DefineCircleMask = function(size){
		var Mimg = gdi.CreateImage(size, size);
		gb = Mimg.GetGraphics();
		gb.SetSmoothingMode(2);
		gb.FillSolidRect(0, 0, size, size, GetGrey(255));
		gb.FillEllipse(1, 1, size-2, size-2, GetGrey(0));
		Mimg.ReleaseGraphics(gb);
		this.coverMask = Mimg;
	}
	this.onFontChanged = function(){
		this.firstRowHeight = false;
		this.secondRowHeight = false;
		this.refresh_all_covers();
	}
    this.draw = function(gr) {
        var tmp, offset;
        var cx = 0;
        var ax, ay, by, rowStart, row, coverTop;
		this.group_unrequested_loading = false;
        if(properties.displayMode > 0) {
            var coverWidth = cover.max_w;
        } else {
            var coverWidth = 0;
        };
        var txt_color1, txt_color2, selbg_color;
        var total = this.groups.length;
        var all_x = -1, all_y = -1, all_w = 0, all_h = 0;
        var coverImg = null;
		if((properties.displayMode == 1 || properties.displayMode == 3) && (!this.firstRowHeight || !this.secondRowHeight)) {
			if(!this.firstRowHeight) {
				this.firstRowHeight = gr.CalcTextHeight("WcLrego9", g_font.normal);
			}
			if(!this.secondRowHeight) {
				this.secondRowHeight = gr.CalcTextHeight("WcLrego9", g_font.italicmin1);
			}
			this.get_metrics();
		}
        var aw = this.thumbnailWidth - (this.marginSide * 2);
        var ah = this.rowHeight - this.marginTop - this.marginBot;
		if(properties.displayMode == 3) var padding_covers = (!properties.displayModeGridNoText?6:0);
		else var padding_covers = 0
		var im_w = coverWidth;
		var im_h = coverWidth;

        this.getlimits();

        if(repaint_main || !repaintforced){
			if(this.groups.length>0){
				repaint_main = false;
				repaintforced = false;
				gr.SetTextRenderingHint(globalProperties.TextRendering);
				// draw visible stamps (loop)
				for(var i = g_start_; i < g_end_; i++) {

					//if(i==0) ah=ah+properties.first_item_top_margin;
					row = Math.floor(i / this.totalColumns);
					ax = this.x + (cx * this.thumbnailWidth) + this.marginSide + this.marginLR;
					ay = Math.floor(this.y + (row * this.rowHeight) + this.marginTop - scroll_)+properties.first_item_top_margin;

					this.groups[i].x = ax;
					this.groups[i].y = ay;

					//Request Image
					if(properties.displayMode > 0) {
						// get cover
						if(properties.showAllItem && i == 0 && total > 1) {
							this.groups[i].cover_img = images.all;
						} else {
							if(this.groups[i].cover_type == null) {
								if(this.groups[i].load_requested == 0) {
									debugger_hint("hit1 "+i)
									img = g_image_cache.hit(this.groups[i].metadb, i, false, undefined, properties.albumArtId==4?this.groups[i].groupkey:'');				
									if(img!="loading") this.groups[i].cover_img = img;
									if (isImage(this.groups[i].cover_img)) {
										this.groups[i].cover_type = 1;
										this.groups[i].cover_img = g_image_cache.getit(this.groups[i].metadb, i, this.groups[i].cover_img, im_w);
										debugger_hint("getit "+i)
									} else if(properties.AlbumArtFallback && img!='loading'){
										this.groups[i].save_requested = true;
										debugger_hint("hit2 "+i)
										this.groups[i].cover_img = g_image_cache.hit(this.groups[i].metadb, i, false, this.groups[i].cachekey_album);
										if (typeof this.groups[i].cover_img !== "undefined" && this.groups[i].cover_img!==null) {
											this.groups[i].cover_type = 1;
											this.groups[i].cover_img = g_image_cache.getit(this.groups[i].metadb, i, this.groups[i].cover_img, cover.max_w);
										}
									} else if(properties.albumArtId == 4 && img!='loading'){
										this.groups[i].cover_type = (this.groups[i].cover_img=='loading'?null:1);
										this.groups[i].cover_img = g_image_cache.getit(this.groups[i].metadb, i, images.noartist, cover.max_w);
									} else if(img=='loading') {
										this.groups[i].cover_img = null;
									}
								}
							} else if(this.groups[i].cover_type == 0 && !this.groups[i].cover_img) {
								var image = FormatCover(globalProperties.noart, globalProperties.thumbnailWidthMax, globalProperties.thumbnailWidthMax, false);
								this.groups[i].cover_img = image;
							} else if(this.groups[i].cover_type == 3 && !this.groups[i].cover_img) {
								var image = FormatCover(globalProperties.stream_img, globalProperties.thumbnailWidthMax, globalProperties.thumbnailWidthMax, false);
								this.groups[i].cover_img = image;								
							}
							if(properties.AlbumArtFallback && properties.albumArtId == 4 && this.groups[i].is_fallback){
								this.groups[i].is_fallback = false;
								this.groups[i].cover_type = (this.groups[i].cover_img=='loading'?null:1);
								this.groups[i].cover_img = g_image_cache.getit(this.groups[i].metadb, i, images.noartist, cover.max_w);								
							}
							if(!this.groups[i].cover_formated && isImage(this.groups[i].cover_img)){
								this.groups[i].cover_img = FormatCover(this.groups[i].cover_img, im_w, im_h, false);
								this.groups[i].cover_formated = true;
								debugger_hint("this.groups["+i+"].cover_img.Width"+this.groups[i].cover_img.Width)
							}
						};
					};

					if(ay >= (0 - this.rowHeight) && ay < this.y + this.h) { // if stamp visible, we have to draw it

						// parse stored tags
						/*if(!(properties.showAllItem && i == 0 && total > 1)) {
							if(this.groups[i].groupkey.length > 0) {
								var arr = this.groups[i].groupkey.split(" ^^ ");
							};
						};*/



						if(this.stampDrawMode) {
							// BG under cover
							if((properties.displayMode == 0 || properties.displayMode == 2) && properties.drawAlternateBG) {
								if(i % 2 == 0 && !(i == this.selectedIndex || arrayContains(this.MultipleSelectedIndex,i))) {
									if(i==0) gr.FillSolidRect(ax, ay-properties.first_item_top_margin, aw, ah+properties.first_item_top_margin, colors.alternate_row);
									else gr.FillSolidRect(ax, ay, aw, ah, colors.alternate_row);
								};
							}
							// background selection
							if(((i == this.selectedIndex || arrayContains(this.MultipleSelectedIndex,i)) && (plman.GetPlaylistName(plman.ActivePlaylist)==this.name_to_send)) || i == g_rightClickedIndex || i == this.tempSelectedItem) {

								this.groups[i].selected = true;

								txt_color1 = colors.normal_txt;
								txt_color2 = colors.faded_txt;

								hover_x = ax;
								hover_y = ay;
								hover_w = aw-1;
								hover_h = ah-1;
								if(ay<this.rowHeight) { //first row
									hover_y = ay-1;
									hover_h = ah;
								} else if(ay>wh-this.rowHeight-10) { //first row
									hover_h = ah;
								}
								if(ax<aw/2){ //first column
									hover_x = ax-1;
									hover_w = aw;
								} else if(ax>aw*(this.totalColumns-2)+aw/2){ //last column
									hover_w = aw+2;
								}

								if((properties.displayMode == 0 || properties.displayMode == 2)){
									if(i==0)
										gr.FillSolidRect(ax, ay-properties.first_item_top_margin-1, aw, ah+properties.first_item_top_margin+1, colors.selected_item_bg);
									else
										gr.FillSolidRect(ax, ay, aw, ah, colors.selected_item_bg);
									//top
									if(i!=0 && this.groups[i-1].selected != true){
										gr.FillSolidRect(ax, ay, aw-colors.track_gradient_size-colors.padding_gradient, 1, colors.selected_item_line);
										if(colors.track_gradient_size) gr.FillGradRect(ax+aw-colors.track_gradient_size-colors.padding_gradient, ay, colors.track_gradient_size, 1, 0, colors.selected_item_line, colors.selected_item_line_off, 1.0);
									}
									//bottom

									gr.FillSolidRect(ax, ay+ah-1, aw-colors.track_gradient_size-colors.padding_gradient, 1, colors.selected_item_line);
									if(colors.track_gradient_size) gr.FillGradRect(ax+aw-colors.track_gradient_size-colors.padding_gradient, ay+ah-1, colors.track_gradient_size, 1, 0, colors.selected_item_line, colors.selected_item_line_off, 1.0);
								} else if(properties.displayMode == 1)	{
									gr.FillSolidRect(hover_x, hover_y, hover_w+1, hover_h+1, colors.selected_item_bg);
									gr.DrawRect(hover_x, hover_y, hover_w, hover_h, 1.0, colors.selected_item_line);
								}


							} else {
								this.groups[i].selected = false;
								txt_color1 = colors.normal_txt;
								txt_color2 = colors.faded_txt;
							};
						} else { // panelMode = 3 (Grid)
							// background selection
							if(i == this.selectedIndex) {
								txt_color1 = colors.full_txt;
								txt_color2 = colors.full_txt;
								selbg_color = colors.selected_bg;
							} else {
								txt_color1 = colors.grid_txt;
								txt_color2 = colors.grid_txt;
								selbg_color = colors.grid_bg;
							};
						};

						switch(properties.displayMode) {
							case 1:
							case 3:
								if(!properties.showAllItem || (properties.showAllItem && i > 0) || (properties.displayMode != 3)) {
									if(g_rightClickedIndex > -1 && properties.displayMode != 1 && properties.displayMode != 3) {
										if(g_rightClickedIndex == i && !(this.scrollbar.cursorDrag || this.scrollbar.cursorHover)) {
											if(this.stampDrawMode) {
												gr.FillSolidRect(ax, ay, colors.width_marker_hover_item, ah, colors.marker_hover_item);
											} else {
												gr.FillSolidRect(ax, ay, colors.width_marker_hover_item, ah, colors.marker_hover_item);
											};
										};
									} else {
										if((i == this.activeIndex || (g_rightClickedIndex > -1 && g_rightClickedIndex == i)) && !(this.scrollbar.cursorDrag || this.scrollbar.cursorHover)) {
											if(properties.displayMode == 3) {

											} else if(this.stampDrawMode) {

												hover_x = ax;
												hover_y = ay;
												hover_w = aw-1;
												hover_h = ah-1;
												if(ay<this.rowHeight) { //first row
													hover_y = ay-1;
													hover_h = ah;
												} else if(ay>wh-this.rowHeight-10) { //first row
													hover_h = ah;
												}
												if(ax<aw/2){ //first column
													hover_x = ax-1;
													hover_w = aw;
												} else if(ax>aw*(this.totalColumns-2)+aw/2){ //last column
													hover_w = aw+2;
												}
												gr.FillSolidRect(hover_x, hover_y, hover_w+1, hover_h+1, colors.selected_item_bg);
												gr.DrawRect(hover_x, hover_y, hover_w, hover_h, 1.0,  colors.selected_item_line);

											} else {
												gr.FillSolidRect(ax, ay, colors.width_marker_hover_item, ah, colors.marker_hover_item);
											};
										};
									};
								};
								coverTop = properties.displayMode == 1 ? ay + 10 : ay;

								// draw cover
								if(typeof this.groups[i].cover_img == "string"){
									this.groups[i].cover_img = globalProperties.nocover_img;
								}
								if(this.groups[i].cover_img) {

									if(!this.groups[i].cover_img_mask && properties.circleMode && (properties.displayMode == 1 || properties.displayMode == 2)){
										if(!this.coverMask) this.DefineCircleMask(this.groups[i].cover_img.Width);
										width = this.groups[i].cover_img.Width;
										height = this.groups[i].cover_img.Height;
										coverMask = this.coverMask.Resize(width, height, 7);
										this.groups[i].cover_img_mask = this.groups[i].cover_img.Clone(0, 0, width, height);
										this.groups[i].cover_img_mask.ApplyMask(coverMask);
										image_to_draw = this.groups[i].cover_img_mask;
									} else if(properties.circleMode && (properties.displayMode == 1 || properties.displayMode == 2)) {
										image_to_draw = this.groups[i].cover_img_mask;
									} else image_to_draw = this.groups[i].cover_img;
									if(cover.keepaspectratio) {
										var max = image_to_draw.Width > image_to_draw.Height ? image_to_draw.Width: image_to_draw.Height;
										var rw = image_to_draw.Width / max;
										var rh = image_to_draw.Height / max;
										var im_w = (rw * coverWidth);
										var im_h = (rh * coverWidth);
									};

									// save coords ALL cover image:
									if(properties.showAllItem && i == 0 && total > 1) {
										all_x = ax + Math.round((aw - im_w) / 2);
										all_y = coverTop + coverWidth - im_h;
										all_w = im_w;
										all_h = im_h;
										if(this.cover_img_all_finished){
											if(properties.circleMode && (properties.displayMode == 1 || properties.displayMode == 2)) {
												image_to_draw = this.cover_img_all_mask;
											} else image_to_draw = this.cover_img_all;
										}
										gr.DrawImage(image_to_draw, ax + Math.round((aw - im_w) / 2), coverTop + coverWidth - im_h, im_w, im_h, 0, 0, image_to_draw.Width, image_to_draw.Height, 0, 255);
									} else {
										try{

											gr.DrawImage(image_to_draw, ax + Math.round((aw - im_w) / 2), coverTop + coverWidth - im_h, im_w, im_h, 0, 0, image_to_draw.Width, image_to_draw.Height);
										} catch (e) {
											console.log("DrawImage: invalid image ");
										}
										if(!properties.circleMode || properties.displayMode != 1) gr.DrawRect(ax + Math.round((aw - im_w) / 2), coverTop + coverWidth - im_h, im_w - 1, im_h - 1, 1.0, colors.normal_txt & 0x25ffffff);
									};
									// grid text background rect
									if(properties.displayMode == 3) {
										if(i == this.selectedIndex || i == this.tempSelectedItem || i == this.activeIndex || g_rightClickedIndex == i) {
											if(properties.displayModeGridNoText)
												gr.DrawRect(ax + Math.round((aw - im_w) / 2)+2, coverTop+2, im_w-4, coverWidth-4, 4, colors.gridselected_rect);
											else
												gr.FillSolidRect(ax + Math.round((aw - im_w) / 2), coverTop + coverWidth - properties.botGridHeight, im_w, properties.botGridHeight,colors.gridselected_bg);
										} else if(!properties.displayModeGridNoText) gr.FillSolidRect(ax + Math.round((aw - im_w) / 2), coverTop + coverWidth - properties.botGridHeight, im_w, properties.botGridHeight, selbg_color);
									};
								} else {
									var im_w = coverWidth;
									var im_h = coverWidth;
									//if(!properties.circleMode)
										gr.DrawRect(ax + Math.round((aw - im_w) / 2), coverTop + coverWidth - im_h, im_w - 1, im_h - 1, 1.0, colors.normal_txt & 0x25ffffff);
									//else {
										//gr.SetSmoothingMode(2);
										//gr.DrawEllipse(ax + Math.round((aw - im_w) / 2), coverTop + coverWidth - im_h, im_w - 1, im_h - 1, 1.0, colors.normal_txt & 0x25ffffff);
										//gr.SetSmoothingMode(0);
									//}
									//var im_w = coverWidth;
									//var im_h = coverWidth;
									//if(!properties.circleMode || properties.displayMode != 1) gr.DrawRect(ax + Math.round((aw - im_w) / 2), coverTop + coverWidth - im_h, im_w - 1, im_h - 1, 1.0, colors.normal_txt & 0x25ffffff);
									//gr.DrawImage(images.loading_draw, ax + Math.round((aw - images.loading_draw.Width) / 2), ay + Math.round((aw - images.loading_draw.Height) / 2), images.loading_draw.Width, images.loading_draw.Height, 0, 0, images.loading_draw.Width, images.loading_draw.Height, images.loading_angle, 160);
								};

								// in Grid mode (panelMode = 3), if cover is in portrait mode, adjust width to the stamp width
								if(properties.displayMode == 3 && im_h > im_w) {
									var frame_w = coverWidth;
									var frame_h = im_h;
								} else {
									var frame_w = im_w;
									var frame_h = im_h;
								};

								if(properties.displayMode == 1) { // panelMode = 1 (Art + bottom labels)
									// draw text
									if(properties.showAllItem && i == 0 && total > 1) { // aggregate item ( [ALL] )
										try{
											gr.GdiDrawText("All items", g_font.normal, txt_color1, ax + Math.round((aw - coverWidth) / 2), (coverTop + 5 + coverWidth), coverWidth, this.firstRowHeight, DT_CENTER | DT_TOP | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
											gr.GdiDrawText(""+(total-1)+" items", g_font.italicmin1, txt_color2, ax + Math.round((aw - coverWidth) / 2), (coverTop + 5 + coverWidth + this.firstRowHeight), coverWidth, this.secondRowHeight, DT_CENTER | DT_TOP | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
										} catch(e) {console.log(e)}
									} else {
										if(!this.customGroups){
											if(this.groups[i].album == "?") {
												if(this.groups[i].count > 1) {
													var album_name = (this.groups[i].tracktype != 3 ? "(Singles)" : "(Web Radios)");
												} else {
													var arr_t = this.groups[i].tra[0].split(" ^^ ");
													var album_name = (this.groups[i].tracktype != 3 ? "(Single) " : "") + arr_t[0];
												};
											} else {
												var album_name = this.groups[i].album;
											};
											this.groups[i].firstRow = album_name;
											this.groups[i].secondRow = this.groups[i].artist_name;
										} else {
											this.groups[i].firstRow = this.groups[i].groupkey;
											this.groups[i].secondRow = this.groups[i].count+" item"+(this.groups[i].count>1?'s':'');
										}

										try{
											if(properties.tagMode == 1) {
												this.groups[i].tooltipText = this.groups[i].firstRow+'\n'+this.groups[i].secondRow;
												font1 = g_font.normal;
												font2 = g_font.italicmin1;
												if(typeof this.groups[i].text1Length == 'undefined') this.groups[i].text1Length = gr.CalcTextWidth(this.groups[i].firstRow, font1);
												if(typeof this.groups[i].text2Length == 'undefined') this.groups[i].text2Length = gr.CalcTextWidth(this.groups[i].secondRow, font2);
												this.groups[i].showToolTip = (this.groups[i].text1Length > coverWidth || this.groups[i].text2Length > coverWidth);
												gr.GdiDrawText(this.groups[i].firstRow, font1, colors.normal_txt, ax + Math.round((aw - coverWidth) / 2), (coverTop + 5 + coverWidth), coverWidth, properties.botTextRowHeight + globalProperties.fontAdjustement, DT_CENTER | DT_TOP | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
												if(this.groups[i].tracktype != 3) gr.GdiDrawText(this.groups[i].secondRow, font2, txt_color2, ax + Math.round((aw - coverWidth) / 2), (coverTop + 5 + coverWidth +  + this.firstRowHeight), coverWidth, this.firstRowHeight, DT_CENTER | DT_TOP | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
											} else {
											  this.groups[i].tooltipText = this.groups[i].groupkey;
											  font1 = g_font.normal;
											  font2 = g_font.italicmin1;
											  font = g_font.normal;
											  if(typeof this.groups[i].textLength == 'undefined') this.groups[i].textLength = gr.CalcTextWidth(this.groups[i].tooltipText, font);
											  this.groups[i].showToolTip = (this.groups[i].textLength > coverWidth);
											  gr.GdiDrawText(this.groups[i].groupkey, font1, colors.normal_txt, ax + Math.round((aw - coverWidth) / 2), (coverTop + 5 + coverWidth), coverWidth, properties.botTextRowHeight + globalProperties.fontAdjustement, DT_CENTER | DT_TOP | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
											  gr.GdiDrawText(''+this.groups[i].count+' tracks', font2, txt_color2, ax + Math.round((aw - coverWidth) / 2), (coverTop + 5 + coverWidth +  + this.firstRowHeight), coverWidth, this.secondRowHeight, DT_CENTER | DT_TOP | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
											};
										} catch(e) {}
									};
								} else if(this.groups[i].cover_img) { // panelMode = 3 (Grid)
									// draw text
									if(properties.showAllItem && i == 0 && total > 1) { // aggregate item ( [ALL] )
										this.groups[i].firstRow = "All "+(this.customGroups?"items":'albums');
										this.groups[i].secondRow = this.groups[i].count+" item"+(this.groups[i].count>1?'s':'');
									} else {
										if(!this.customGroups && properties.tagMode == 1){
											if(this.groups[i].album == "?") {
												if(this.groups[i].count > 1) {
													var album_name = (this.groups[i].tracktype != 3 ? "(Singles)" : "(Web Radios)");
												} else {
													var arr_t = this.groups[i].tra[0].split(" ^^ ");
													var album_name = (this.groups[i].tracktype != 3 ? "(Single) " : "") + arr_t[0];
												};
											} else {
												var album_name = this.groups[i].album;
											};
											this.groups[i].firstRow = album_name;
											this.groups[i].secondRow = this.groups[i].artist_name;
										} else {
											this.groups[i].firstRow = this.groups[i].groupkey;
											this.groups[i].secondRow = this.groups[i].count+" item"+(this.groups[i].count>1?'s':'');
										}
									};
									try{
										//if(properties.tagMode == 1) {
											this.groups[i].tooltipText = this.groups[i].firstRow+'\n'+this.groups[i].secondRow;
											font1 = g_font.bold;
											font2 = g_font.min1;
											if(typeof this.groups[i].text1Length == 'undefined') this.groups[i].text1Length = gr.CalcTextWidth(this.groups[i].firstRow, font1);
											if(typeof this.groups[i].text2Length == 'undefined') this.groups[i].text2Length = gr.CalcTextWidth(this.groups[i].secondRow, font2);
											this.groups[i].showToolTip = (this.groups[i].text1Length > aw-20 || this.groups[i].text2Length > aw-20);

											if(!properties.displayModeGridNoText)gr.GdiDrawText(this.groups[i].firstRow, font1, txt_color1, ax+10, (coverTop + 5 + coverWidth) - properties.botGridHeight, aw-20, properties.botTextRowHeight + globalProperties.fontAdjustement, DT_LEFT | DT_TOP | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
											if(this.groups[i].tracktype != 3 && !properties.displayModeGridNoText) gr.GdiDrawText(this.groups[i].secondRow, font2, txt_color2, ax+10, (coverTop + 5 + coverWidth + properties.botTextRowHeight) - properties.botGridHeight, aw-20, properties.botTextRowHeight + globalProperties.fontAdjustement, DT_LEFT | DT_TOP | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
										/*} else {
										  this.groups[i].tooltipText = this.groups[i].secondRow;
										  font = (i == this.selectedIndex ? g_font.bold : g_font.normal);
										  if(typeof this.groups[i].textLength == 'undefined') this.groups[i].textLength = gr.CalcTextWidth(this.groups[i].tooltipText, font);
										  this.groups[i].showToolTip = (this.groups[i].textLength > aw-20);

										  gr.GdiDrawText(this.groups[i].groupkey, font, txt_color2, ax+10, (coverTop + 5 + coverWidth + 8) - properties.botGridHeight, aw-20, properties.botTextRowHeight + globalProperties.fontAdjustement, DT_LEFT | DT_TOP | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
										};*/
									} catch(e) {}
								};
								break;
							case 0:
							case 2:
								coverTop = ay;
								if(properties.displayMode == 2) {
									// draw cover
									this.coverMarginLeft = this.marginCover;
									if(typeof this.groups[i].cover_img == "string"){
										this.groups[i].cover_img = globalProperties.nocover_img;
									}
									if(this.groups[i].cover_img) {

										if(!this.groups[i].cover_img_mask && properties.circleMode){
											if(!this.coverMask) this.DefineCircleMask(this.groups[i].cover_img.Width);
											width = this.groups[i].cover_img.Width;
											height = this.groups[i].cover_img.Height;
											coverMask = this.coverMask.Resize(width, height, 7);
											this.groups[i].cover_img_mask = this.groups[i].cover_img.Clone(0, 0, width, height);
											this.groups[i].cover_img_mask.ApplyMask(coverMask);
											image_to_draw = this.groups[i].cover_img_mask;
										} else if(properties.circleMode) {
											image_to_draw = this.groups[i].cover_img_mask;
										} else image_to_draw = this.groups[i].cover_img;

										if(cover.keepaspectratio) {
											var max = image_to_draw.Width > image_to_draw.Height ? image_to_draw.Width: image_to_draw.Height;
											var rw = image_to_draw.Width / max;
											var rh = image_to_draw.Height / max;
											var im_w = (rw * coverWidth)-2;
											var im_h = (rh * coverWidth)-2;
										} else {
											var im_w = coverWidth;
											var im_h = coverWidth;
										};

										var deltaY = Math.floor((ah - im_h)/2);
										var deltaX = Math.floor((coverWidth - im_w)/2);
										// save coords ALL cover image:
										if(properties.showAllItem && i == 0 && total > 1) {
											all_x = Math.round(this.margin_left/2) + ax + this.coverMarginLeft+deltaX;
											all_y = coverTop + deltaY;
											all_w = im_w;
											all_h = im_h;
											if(this.cover_img_all_finished){
												if(properties.circleMode && (properties.displayMode == 1 || properties.displayMode == 2)) {
													image_to_draw = this.cover_img_all_mask;
												} else image_to_draw = this.cover_img_all;
											}
											gr.DrawImage(image_to_draw, Math.round(this.margin_left/2) + ax+this.coverMarginLeft+deltaX, coverTop + deltaY, im_w, im_h, 0, 0, image_to_draw.Width, image_to_draw.Height, 0, 255);
										} else {
											gr.DrawImage(image_to_draw, Math.round(this.margin_left/2) + ax+this.coverMarginLeft+deltaX, coverTop + deltaY, im_w, im_h, 0, 0, image_to_draw.Width, image_to_draw.Height);
											if(!properties.circleMode) gr.DrawRect(Math.round(this.margin_left/2) + ax+this.coverMarginLeft+deltaX, coverTop + deltaY, im_w - 1, im_h - 1, 1.0, colors.normal_txt & 0x25ffffff);
										};
									} else {
										var im_w = coverWidth;
										var im_h = coverWidth;
										var deltaY = Math.floor((ah - im_h)/2);
										var deltaX = Math.floor((coverWidth - im_w)/2);
										if(!properties.circleMode)
											gr.DrawRect(Math.round(this.margin_left/2) + ax+this.coverMarginLeft+deltaX, coverTop + deltaY, im_w - 1, im_h - 1, 1.0, colors.normal_txt & 0x25ffffff);
										else {
											gr.SetSmoothingMode(2);
											gr.DrawEllipse(Math.round(this.margin_left/2) + ax+this.coverMarginLeft+deltaX, coverTop + deltaY, im_w - 1, im_h - 1, 1.0, colors.normal_txt & 0x25ffffff);
											gr.SetSmoothingMode(0);
										}
										//gr.DrawImage(images.loading_draw, ax+this.coverMarginLeft+deltaX, coverTop + deltaY, coverWidth, coverWidth, 0, 0, images.loading_draw.Width, images.loading_draw.Height, images.loading_angle, 160);
									};
								};

								// Hover effect
								if(((g_rightClickedIndex > -1 && g_rightClickedIndex == i) || i == this.activeIndex) && !(this.scrollbar.cursorDrag || this.scrollbar.cursorHover)) {
									if(i==0)
										gr.FillSolidRect(ax, ay-properties.first_item_top_margin, colors.width_marker_hover_item, ah+properties.first_item_top_margin, colors.marker_hover_item);
									else
										gr.FillSolidRect(ax, ay, colors.width_marker_hover_item, ah, colors.marker_hover_item);

								};

								if(properties.drawItemsCounter) {
									items_counter_txt = this.groups[i].count;
									items_counter_width = gr.CalcTextWidth(items_counter_txt,g_font.min1)+10;
								} else items_counter_width=0;

								// draw text
								if(properties.showAllItem && i==0 && total > 1) { // [ALL] item
									switch(properties.tagMode) {
										case 1: // album
											try{
												gr.GdiDrawText("All items", g_font.normal, txt_color1, this.margin_left + ax + coverWidth + this.marginCover*2, ay - properties.textLineHeight, aw - coverWidth - this.marginCover*3-this.textMarginRight - items_counter_width, ah, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
												if(properties.drawItemsCounter) gr.GdiDrawText(items_counter_txt, g_font.min2, txt_color2, this.margin_left + ax + coverWidth + this.marginCover*2, ay - properties.textLineHeight, aw - coverWidth - this.marginCover*3-this.textMarginRight - this.margin_right, ah, DT_RIGHT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
												gr.GdiDrawText("("+(total-1)+(!(properties.tf_groupkey_album == properties.tf_groupkey_album_default && properties.album_customGroup_label == "")?' groups)':" albums)"), g_font.min1, txt_color2, this.margin_left + ax + coverWidth + this.marginCover*2, ay + properties.textLineHeight, aw - coverWidth - this.marginCover*3-this.textMarginRight, ah, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
											} catch(e) {}
											break;
										case 2: // artist
											try{
												gr.GdiDrawText("All ("+(total-1)+(!(properties.tf_groupkey_artist == properties.tf_groupkey_artist_default && properties.artist_customGroup_label == "")?' groups)':" artists)"), g_font.normal, txt_color1, this.margin_left + ax + coverWidth + this.marginCover*2, ay, aw - coverWidth - this.marginCover*3-this.textMarginRight - items_counter_width, ah, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
												if(properties.drawItemsCounter) gr.GdiDrawText(items_counter_txt, g_font.min2, txt_color2, this.margin_left + ax + coverWidth + this.marginCover*2, ay, aw - coverWidth - this.marginCover*3-this.textMarginRight - this.margin_right, ah, DT_RIGHT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
											} catch(e) {}
											break;
										case 3: // genre
											try{
												gr.GdiDrawText("All ("+(total-1)+(!(properties.tf_groupkey_genre == properties.tf_groupkey_genre_default && properties.genre_customGroup_label == "")?' groups)':" genres)"), g_font.normal, ((i == this.selectedIndex && plman.GetPlaylistName(plman.ActivePlaylist)==this.name_to_send) ? colors.selected_txt : txt_color1), this.margin_left + ax + coverWidth + this.marginCover*2, ay, aw - coverWidth - this.marginCover*3-this.textMarginRight - items_counter_width, ah, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
												if(properties.drawItemsCounter) gr.GdiDrawText(items_counter_txt, g_font.min2, txt_color2, this.margin_left + ax + coverWidth + this.marginCover*2, ay, aw - coverWidth - this.marginCover*3-this.textMarginRight - this.margin_right, ah, DT_RIGHT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
											} catch(e) {}
											break;
									};
								} else {

									if(properties.drawItemsCounter) {
										items_counter_txt = this.groups[i].count;
										if(typeof this.groups[i].items_counter_width == 'undefined') this.groups[i].items_counter_width = gr.CalcTextWidth(items_counter_txt,g_font.min1)+10;
									} else this.groups[i].items_counter_width = 0;

									switch(properties.tagMode) {
										case 1: // album
											if(!this.customGroups){
												if(this.groups[i].album == "?") {
													if(this.groups[i].count > 1) {
														var album_name = (this.groups[i].tracktype != 3 ? "(Singles)" : "(Web Radios)");
													} else {
														var arr_t = this.groups[i].tra[0].split(" ^^ ");
														var album_name = (this.groups[i].tracktype != 3 ? "(Single) " : "") + arr_t[0];
													};
												} else {
													var album_name = this.groups[i].album;
												};
												var date = this.groups[i].date;
												if(date=="?") date = "";
												else date = " ("+date+")";
												this.groups[i].firstRow = album_name+date;
												this.groups[i].secondRow = this.groups[i].artist_name;
											} else {
												this.groups[i].firstRow = this.groups[i].groupkey;
												this.groups[i].secondRow = this.groups[i].count+" item"+(this.groups[i].count>1?'s':'');
											}
											try{
												this.groups[i].tooltipText = this.groups[i].firstRow+'\n'+this.groups[i].secondRow;

												font1 = g_font.normal;
												font2 = g_font.min1;
												if(properties.drawItemsCounter) available_width1 = aw - coverWidth - this.marginCover*3-this.textMarginRight - (this.w - (this.margin_left + ax + coverWidth + this.marginCover*2 +(aw - coverWidth - this.marginCover*3-this.textMarginRight - this.margin_right)));
												else available_width1 = aw - coverWidth - this.marginCover*3-this.textMarginRight - this.groups[i].items_counter_width;
												available_width2 = aw - coverWidth - this.marginCover*3-this.textMarginRight;

												if(typeof this.groups[i].text1Length == 'undefined') this.groups[i].text1Length = gr.CalcTextWidth(this.groups[i].firstRow, font1);
												if(typeof this.groups[i].text2Length == 'undefined') this.groups[i].text2Length = gr.CalcTextWidth(this.groups[i].secondRow, font2);

												this.groups[i].showToolTip = (this.groups[i].text1Length > available_width1 || this.groups[i].text2Length > available_width2);

												gr.GdiDrawText(this.groups[i].firstRow, font1, txt_color1, this.margin_left + ax + coverWidth + this.marginCover*2, ay - properties.textLineHeight, available_width1, ah, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
												 if(properties.drawItemsCounter) gr.GdiDrawText(items_counter_txt, g_font.min1, txt_color2, this.margin_left + ax + coverWidth + this.marginCover*2, ay - properties.textLineHeight, aw - coverWidth - this.marginCover*3-this.textMarginRight - this.margin_right, ah, DT_RIGHT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
												if(this.groups[i].tracktype != 3) gr.GdiDrawText(this.groups[i].secondRow, font2, txt_color2, this.margin_left + ax + coverWidth + this.marginCover*2, ay + properties.textLineHeight, available_width2, ah, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
											} catch(e) {}
											break;
										case 2: // artist
											try{
												this.groups[i].tooltipText = this.groups[i].groupkey;

												font = g_font.normal;
												available_width = aw - coverWidth - this.marginCover*3-this.textMarginRight - items_counter_width;
												if(typeof this.groups[i].textLength == 'undefined') this.groups[i].textLength = gr.CalcTextWidth(this.groups[i].tooltipText, font);
												this.groups[i].showToolTip = (this.groups[i].textLength > available_width);

												gr.GdiDrawText(this.groups[i].groupkey, font, txt_color1, this.margin_left + ax + coverWidth + this.marginCover*2, ay, available_width, ah, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
												 if(properties.drawItemsCounter) gr.GdiDrawText(items_counter_txt, g_font.min1, txt_color2, this.margin_left + ax + coverWidth + this.marginCover*2, ay, aw - coverWidth - this.marginCover*3-this.textMarginRight - this.margin_right, ah, DT_RIGHT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
											} catch(e) {}
											break;
										case 3: // genre
											try{
												this.groups[i].tooltipText = this.groups[i].groupkey;

												font = g_font.normal;
												available_width = aw - coverWidth - this.marginCover*3-this.textMarginRight - items_counter_width;
												if(typeof this.groups[i].textLength == 'undefined') this.groups[i].textLength = gr.CalcTextWidth(this.groups[i].tooltipText, font);
												this.groups[i].showToolTip = (this.groups[i].textLength > available_width);

												gr.GdiDrawText(this.groups[i].groupkey, font, ((i == this.selectedIndex && plman.GetPlaylistName(plman.ActivePlaylist)==this.name_to_send) ? colors.selected_txt : txt_color1), this.margin_left + ax + coverWidth + this.marginCover*2, ay, available_width, ah, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
												if(properties.drawItemsCounter) gr.GdiDrawText(items_counter_txt, g_font.min1, txt_color2, this.margin_left + ax + coverWidth + this.marginCover*2, ay, aw - coverWidth - this.marginCover*3-this.textMarginRight - this.margin_right, ah, DT_RIGHT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
											} catch(e) {}
											break;
									};
								};
								break;
						};

					};

					// set next column index
					if(cx == this.totalColumns - 1) {
						cx = 0;
					} else {
						cx++;
					};
				};

				//if(properties.darklayout) Draw bottom gradient
				if(main_panel_state.isEqual(0))
					gr.FillGradRect(0, wh-colors.fading_bottom_height, ww, colors.fading_bottom_height, 90, colors.grad_bottom_color2,  colors.grad_bottom_color_library_panel,1);
				else
					gr.FillGradRect(0, wh-colors.fading_bottom_height, ww, colors.fading_bottom_height, 90, colors.grad_bottom_color2,  colors.grad_bottom_color1,1);
				// Incremental Search Display
				if(cList.search_string.length > 0) {
					brw.tt_x = Math.floor(((brw.w) / 2) - (((cList.search_string.length*13)+(10*2)) / 2));
					brw.tt_y = brw.y + Math.floor((brw.h / 2) - 30);
					brw.tt_w = Math.round((cList.search_string.length*13)+(10*2));
					brw.tt_h = 40;
					gr.FillSolidRect(brw.tt_x, brw.tt_y, brw.tt_w, brw.tt_h, colors.keyboard_search_bg);
					try {
						gr.GdiDrawText(cList.search_string, g_font.plus7, cList.inc_search_noresult?colors.keyboard_search_txtred:colors.keyboard_search_txt, brw.tt_x, brw.tt_y , brw.tt_w , brw.tt_h, DT_CENTER | DT_NOPREFIX | DT_CALCRECT | DT_VCENTER);
					} catch(e) {};
				};

				// fill ALL cover image with the 1st four cover art found
				if(properties.displayMode > 0) {
					// get cover
					if(all_x > -1 && properties.showAllItem && g_start_ == 0 && total > 1) {
						var ii_w = Math.floor(all_w / 2)+(properties.displayMode==3 && properties.displayModeGridNoText?1:0);
						var ii_h = Math.floor(all_h / 2)+(properties.displayMode==3 && properties.displayModeGridNoText?1:0);
						var ii_x1 = 0;
						var ii_x2 = ii_x1 + ii_w;
						var ii_y1 = 0;
						var ii_y2 = ii_y1 + ii_h;
						var lim = this.groups.length;
						if(lim > 5) lim = 5;
						if(!this.cover_img_all_finished){
							var All_img = gdi.CreateImage(all_w, all_h);
							gb = All_img.GetGraphics();
							var nb_of_drawn_cover = 0;
							for(var ii=1; ii < lim; ii++) {
								if(this.groups[ii].cover_img) {
									switch(ii) {
										case 1:
											try{
												gb.DrawImage(this.groups[ii].cover_img, ii_x1, ii_y1, ii_w, ii_h, 0, 0, this.groups[ii].cover_img.Width, this.groups[ii].cover_img.Height);
											} catch (e) {
												console.log("DrawImage: invalid image ");
											}
											nb_of_drawn_cover++;
											break;
										case 2:
											try{
												gb.DrawImage(this.groups[ii].cover_img, ii_x2, ii_y1, ii_w, ii_h, 0, 0, this.groups[ii].cover_img.Width, this.groups[ii].cover_img.Height);
											} catch (e) {
												console.log("DrawImage: invalid image ");
											}
											nb_of_drawn_cover++;
											break;
										case 3:
											try{
												gb.DrawImage(this.groups[ii].cover_img, ii_x1, ii_y2, ii_w, ii_h, 0, 0, this.groups[ii].cover_img.Width, this.groups[ii].cover_img.Height);
											} catch (e) {
												console.log("DrawImage: invalid image ");
											}
											nb_of_drawn_cover++;
											break;
										case 4:
											try{
												gb.DrawImage(this.groups[ii].cover_img, ii_x2, ii_y2, ii_w, ii_h, 0, 0, this.groups[ii].cover_img.Width, this.groups[ii].cover_img.Height);
											} catch (e) {
												console.log("DrawImage: invalid image ");
											}
											nb_of_drawn_cover++;
											break;
									};
								};
							};
							All_img.ReleaseGraphics(gb);
							this.cover_img_all = All_img;
							if(properties.circleMode && (properties.displayMode == 1 || properties.displayMode == 2)){
								if(!this.coverMask) this.DefineCircleMask(this.cover_img_all.Width);
								width = this.cover_img_all.Width;
								height = this.cover_img_all.Height;
								coverMask = this.coverMask.Resize(width, height, 7);
								this.cover_img_all_mask = this.cover_img_all.Clone(0, 0, width, height);
								this.cover_img_all_mask.ApplyMask(coverMask);
								image_to_draw = this.cover_img_all_mask;
							} else image_to_draw = this.cover_img_all;

							if(nb_of_drawn_cover==lim-1) {
								this.cover_img_all_finished = true;
								brw.repaint();
							}
						} else {
							if(properties.circleMode && (properties.displayMode == 1 || properties.displayMode == 2)) {
								image_to_draw = this.cover_img_all_mask;
							} else image_to_draw = this.cover_img_all;
						}

						//gr.DrawImage(image_to_draw, all_x, all_y, all_w, all_h, 0, 0, all_w, all_h);
					};
				};
			} else if(g_first_populate_done){ // no items, filter is empty
					var px = 0;
					var line_width = Math.min(130,Math.round(this.w-40));
					var py = this.y + Math.round(this.h  / 2)-1;
					if(g_filterbox.inputbox.text!='') {
						var text1 = "No items";
						var text2 = "matching";
					} else {
						var text1 = "";
						var text2 = "No items";
					}
					if(text1!='') {
						gr.GdiDrawText(text1, g_font.plus5, colors.normal_txt, this.x, py - 40, this.w, 36, DT_CENTER | DT_BOTTOM | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
						gr.FillSolidRect(this.x+Math.round(this.w/2-line_width/2),py, line_width, 1, colors.border);
						gr.GdiDrawText(text2, g_font.italicplus1, colors.faded_txt, this.x, py + 5, this.w, 100, DT_CENTER | DT_TOP | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
					} else {
						gr.GdiDrawText(text2, g_font.italicplus1, colors.faded_txt, this.x, py - 50, this.w, 100, DT_CENTER | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
					}
			} else { // no track, playlist is empty
					var px = 0;
					var line_width = Math.min(130,Math.round(this.w-40));
					var py = this.y + Math.round(this.h  / 2)-1;
					gr.GdiDrawText("Loading...", g_font.plus4, colors.normal_txt, this.x, py - 40, this.w, 36, DT_CENTER | DT_BOTTOM | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
					gr.FillSolidRect(this.x+Math.round(this.w/2-line_width/2),py, line_width, 1, colors.border);
					gr.GdiDrawText("Filter", g_font.italicplus1, colors.faded_txt, this.x, py + 6, this.w, 20, DT_CENTER | DT_TOP | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
			};

			this.draw_right_line = (properties.DrawRightLine && (!(properties.filterOrder==2) && !(!filter3_state.isActive() && properties.filterOrder==1) && !(!filter3_state.isActive() && !filter2_state.isActive() && properties.filterOrder==0) || main_panel_state.isEqual(0)));
            // draw top header bar
            if(properties.showHeaderBar) {
                var item_txt = new Array("group", "album", "artist", "genre");
                var nb_groups = (properties.showAllItem && total > 1 ? total - 1 : total);
				var txt_id = this.customGroups?0:properties.tagMode;
                var boxText = nb_groups+" "+item_txt[txt_id]+(nb_groups > 1 ? "s  " : "  ");

                // draw background part above playlist (headerbar)
				//gr.FillSolidRect(0, 0, ww, brw.y-1, colors.lightgrey_bg);
				height_top_fix1 = (properties.showTagSwitcherBar) ? g_tagswitcherbar.default_height-1 : 0;
				height_top_fix2 = (properties.showTagSwitcherBar) ? g_tagswitcherbar.default_height : 0;
                gr.FillSolidRect(this.x, height_top_fix1, this.w + (cScrollBar.enabled ? cScrollBar.width : 0), properties.headerBarHeight+(properties.showTagSwitcherBar ? 1 : 0), colors.headerbar_bg);
                gr.FillSolidRect(this.x, height_top_fix2+properties.headerBarHeight, this.w - this.x -((this.draw_right_line)?1:0), 1, colors.headerbar_line);

				if(g_filterbox.inputbox.text.length==0) {
					var text_width = gr.CalcTextWidth(boxText,g_font.min1)
					var tx = cFilterBox.x + cFilterBox.w + Math.round(22 * g_zoom_percent / 100) + 5 - text_width;

					var tw = this.w - tx - 7;
					//this.x + (cx * this.thumbnailWidth) + this.marginSide + this.marginLR;
					gr.GdiDrawText(boxText, g_font.min1,colors.faded_txt, tx, height_top_fix2, tw, properties.headerBarHeight, DT_RIGHT | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX | DT_END_ELLIPSIS);
				}
            };

            // draw tag switcher bar
            if(properties.showTagSwitcherBar) {
				g_tagswitcherbar.draw(gr,0,0);
			}

			if(pman.offset > 0) {
				pman.draw(gr);
			};

			if(g_resizing.isResizing()) gr.FillSolidRect(ww-1, 0, 1, wh, colors.dragdrop_marker_line);
			else if(this.draw_right_line) gr.FillSolidRect(ww-1, 0, 1, wh, colors.sidesline);

            // draw scrollbar
            if(cScrollBar.enabled && pman.state !=1) {
                this.scrollbar && this.scrollbar.draw(gr);
            };
		};
    };

    this._isHover = function(x, y) {
        return (x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h);
    };
    this.setRowHeight = function(step){
		step = step*-1;
        switch(properties.displayMode) {
            case 1:
            case 3:
                var zoomStep = Math.round(properties.thumbnailWidth / 10);
                var previous = properties.thumbnailWidth;
				var previous_totalColumns = this.totalColumns;
                if(!timers.mouseWheel) {
					if(step<0 && this.totalColumns <= properties.MinNumberOfColumns) return

					while(this.totalColumns==previous_totalColumns){
						properties.thumbnailWidth -= step * zoomStep;
						if(properties.thumbnailWidth < properties.thumbnailWidthMin) {
							properties.thumbnailWidth = properties.thumbnailWidthMin;
							if(step>0) break;
						}
						if(properties.thumbnailWidth > globalProperties.thumbnailWidthMax) {
							properties.thumbnailWidth = globalProperties.thumbnailWidthMax;
							if(step<0) break;
						}
						this.get_metrics();
					}
                    if(previous != properties.thumbnailWidth) {
                        timers.mouseWheel = setTimeout(function() {
                            window.SetProperty("COVER Width", properties.thumbnailWidth);
							eval("properties.thumbnailWidth"+properties.tagMode+" = "+properties.thumbnailWidth);
							window.SetProperty("COVER Width for tag mode "+properties.tagMode, properties.thumbnailWidth);
                            get_metrics();
                            brw.setList();
							brw.refresh_all_covers();
                            brw.update();
                            timers.mouseWheel && clearTimeout(timers.mouseWheel);
                            timers.mouseWheel = false;
                        }, 100);
                    };
                };
                break;
            case 0:
            case 2:
                var zoomStep = 1;
                var previous = properties.default_lineHeightMin;

                if(!timers.mouseWheel) {
                    properties.default_lineHeightMin -= step * zoomStep;
                    if(properties.displayMode == 0) {
                        if(properties.default_lineHeightMin < Math.round(g_fsize*1.2)) properties.default_lineHeightMin = Math.round(g_fsize*1.2);
                        if(properties.default_lineHeightMin > g_fsize * 10) properties.default_lineHeightMin = g_fsize * 10;
                    } else {
                        if(properties.default_lineHeightMin < Math.round(g_fsize * 1.5)) properties.default_lineHeightMin = Math.round(g_fsize * 1.7);
                        if(properties.default_lineHeightMin > g_fsize * 20) properties.default_lineHeightMin = g_fsize * 20;
                    };
                    if(previous != properties.default_lineHeightMin) {
                        timers.mouseWheel = setTimeout(function() {
                            window.SetProperty("SYSTEM Minimal Line Height", properties.default_lineHeightMin);
							eval("properties.default_lineHeightMin"+properties.tagMode+" = "+properties.default_lineHeightMin);
							window.SetProperty("SYSTEM Minimal Line Height for tag mode "+properties.tagMode, properties.default_lineHeightMin);
                            get_metrics();
                            brw.setList();
							brw.refresh_all_covers();
                            brw.update();
                            timers.mouseWheel && clearTimeout(timers.mouseWheel);
                            timers.mouseWheel = false;
                        }, 100);
                    };
                };
                break;
        };
	}
    this.lclick_action = function(x, y) {
		if(utils.IsKeyPressed(VK_SHIFT) && this.selectedIndex>-1) {
			if(this.activeIndex == this.selectedIndex) return;
			if(this.current_sourceMode == 0 || this.current_sourceMode == 2 || this.current_sourceMode == 1 || this.current_sourceMode == 3) {
				g_avoid_on_playlist_items_removed = true;
				if(this.activeIndex > this.selectedIndex) {
					this.save_sendItemToPlaylist(this.selectedIndex,this.activeIndex);
				} else {
					this.save_sendItemToPlaylist(this.activeIndex,this.selectedIndex);
				}
			};
		} else if(this.activeIndex == this.selectedIndex) {
			this.activateItem(this.activeIndex);
			if(this.current_sourceMode == 0 || this.current_sourceMode == 2 || this.current_sourceMode == 1 || this.current_sourceMode == 3) {
				g_avoid_on_playlist_items_removed = true;
				this.save_sendItemToPlaylist(this.activeIndex);
			} else {
				//this.focusItemToPlaylist(this.groups[this.activeIndex].metadb);
			};
		} else {
			this.activateItem(this.activeIndex);
			if(this.current_sourceMode == 0 || this.current_sourceMode == 2 || this.current_sourceMode == 1 || this.current_sourceMode == 3) {
				g_avoid_on_playlist_items_removed = true;
				this.save_sendItemToPlaylist(this.activeIndex);
				//if(getNowPlayingState()==1 && getTrackInfosState()==1) plman.SetPlaylistFocusItem(g_active_playlist, 0);
			} else {
				plman.ClearPlaylistSelection(g_active_playlist);
				//plman.SetPlaylistSelectionSingle(g_active_playlist, this.groups[this.activeIndex].start, true);
				this.selectAtoB(this.groups[this.activeIndex].start, this.groups[this.activeIndex].start )//+ this.groups[this.activeIndex].count - 1);
				g_avoid_on_item_focus_change = true;
				//if(getTrackInfosState()==1 && getNowPlayingState()==1) plman.SetPlaylistFocusItem(g_active_playlist, this.groups[this.activeIndex].start);
				//*/
				//this.focusItemToPlaylist(this.groups[this.activeIndex].metadb);
			};
		};
	}
    this.on_mouse = function(event, x, y, delta) {
        this.ishover = this._isHover(x, y);

        // get active item index at x,y coords...
        this.activeIndex = -1;
		this.is_hover_scrollbar = this.scrollbar._isHover(x, y);
        if(this.ishover && !this.is_hover_scrollbar) {
            this.activeRow = Math.ceil((y + scroll_ - this.y) / this.rowHeight) - 1;
            if(y > this.y && x > this.x && x < this.x + this.w) {
                this.activeColumn = Math.ceil((x - this.x - this.marginLR) / this.thumbnailWidth) - 1;
                this.activeIndex = (this.activeRow * this.totalColumns) + this.activeColumn;
                this.activeIndex = this.activeIndex > this.groups.length - 1 ? -1 : this.activeIndex;
            };
        }
        if(brw.activeIndex != brw.activeIndexSaved) {
            brw.activeIndexSaved = brw.activeIndex;
            this.repaint();
        };

        switch(event) {
            case "down":
				this.items_sent = false;
				this.drag_clicked_x = x;
				this.drag_clicked_y = y;
				if(this.clearSelectedItemsOnNextClick) this.clearSelectedItem();
				if(cScrollBar.enabled && cScrollBar.visible && this.scrollbar._isHover(x, y)) {
					this.scrollbar && this.scrollbar.on_mouse(event, x, y);
				}
                else if(this.ishover) {
                    if(this.activeIndex > -1) {
						this.drag_clicked = true;
						if(!(this.activeIndex == this.selectedIndex || arrayContains(this.MultipleSelectedIndex,this.activeIndex))) {
							this.lclick_action(x,y);
							this.sendSelectedItemsToPlaylist();
							this.items_sent = true;
						}
                    };
                    this.repaint(); // avirer
                };
                break;
            case "up":
				if(!(this.scrollbar.cursorDrag || this.scrollbar.cursorHover)){
					this.drag_clicked = false;
					if(!this.items_sent && !this.drag_moving) {
						this.lclick_action(x,y);
						this.sendSelectedItemsToPlaylist();
						this.items_sent = true;
					}
				}
                if(cScrollBar.enabled && cScrollBar.visible) {
                    this.scrollbar && this.scrollbar.on_mouse(event, x, y);
                };
                break;
            case "dblclk":
                if(this.ishover) {
                    if(brw.activeIndex > -1) {
                        if(this.current_sourceMode == 0 || this.current_sourceMode == 2 || this.current_sourceMode == 1 || this.current_sourceMode == 3) {
                            // play first track of the selection
							//if(main_panel_state.isEqual(0)) sendandplayPlaybackPlaylist(plman.GetPlaylistItems(g_active_playlist))
                            //else
							g_active_playlist = plman.ActivePlaylist;
							plman.ExecutePlaylistDefaultAction(g_active_playlist, 0);
                        } else {
                            plman.ExecutePlaylistDefaultAction(g_active_playlist, this.groups[this.activeIndex].start);
                            //plman.SetPlaylistFocusItemByHandle(plman.ActivePlaylist, brw.groups[brw.activeIndex].pl[0]);
                            //fb.Play();
                        };
                    };
                } else {
                    if(cScrollBar.enabled && cScrollBar.visible) {
                        this.scrollbar && this.scrollbar.on_mouse(event, x, y);
                    };
                };
                break;
            case "right":
                g_rightClickedIndex = this.activeIndex;
				this.clearMultipleSelectedItem();
				//this.selectedIndex = g_rightClickedIndex;
                if(this.ishover && this.activeIndex > -1) {
                    this.item_context_menu(x, y, this.activeIndex);
                } else {
                    if(!g_filterbox.inputbox.hover) {
                        this.settings_context_menu(x, y);
                    };
                };
				if(g_rightClickedIndex>-1){
					g_rightClickedIndex = -1;
					this.repaint();
				}
                if(!this.ishover) {
                    if(cScrollBar.enabled && cScrollBar.visible) {
                        this.scrollbar && this.scrollbar.on_mouse(event, x, y);
                    };
                };
                break;
            case "move":
                if(cScrollBar.enabled && cScrollBar.visible) {
                    this.scrollbar && this.scrollbar.on_mouse(event, x, y);
                };
				if(!(this.scrollbar.cursorDrag || this.scrollbar.cursorHover) && !this.is_hover_scrollbar){
					if(this.drag_clicked && !this.drag_moving) {
						if((Math.abs(x - this.drag_clicked_x) > 10 || Math.abs(y - this.drag_clicked_y) > 10) && this.h > cPlaylistManager.rowHeight * 6) {

							this.drag_moving = true;
							g_tooltip.Deactivate();

							if(properties.DropInplaylist) {
								pman.state = 1;
								if(timers.hidePlaylistManager) {
									window.ClearInterval(timers.hidePlaylistManager);
									timers.hidePlaylistManager = false;
								};
								if(!timers.showPlaylistManager) {
									timers.showPlaylistManager = setInterval(pman.showPanel, 30);
								};
							}
							var items = brw.getSelectedItems();
							if (typeof this.groups[this.selectedIndex].cover_img !== "undefined" && this.groups[this.selectedIndex].cover_img!==null) {
								if(properties.showAllItem && this.selectedIndex == 0 && this.groups.length>1) var dragImage = this.cover_img_all;
								else var dragImage = this.groups[this.selectedIndex].cover_img;
								var options = {
									show_text : false,
									use_album_art : false,
									use_theming : false,
									custom_image : createDragImg(dragImage, 80, this.groups[this.selectedIndex].count),
								}
							} else {
								var options = {
									show_text : false,
									use_album_art : false,
									use_theming : false,
									custom_image : createDragText(this.groups[this.selectedIndex].tooltipText, this.groups[this.selectedIndex].count+" tracks", 220),
								}
							}
							var effect = fb.DoDragDrop(window.ID, items, g_drop_effect.copy | g_drop_effect.move | g_drop_effect.link, options);
							// nothing happens here until the mouse button is released
							pman.on_mouse("leave", 0, 0);
							items = undefined;
						};
					} else if(timers.showPlaylistManager && !this.drag_clicked && properties.DropInplaylist) {
						pman.clearShowPlaylistManagerTimer();
					}
					if(properties.showToolTip && this.activeIndex > -1 && g_tooltip.activeZone!=this.activeIndex && !this.drag_moving) {
						if(this.groups[this.activeIndex].showToolTip){
							new_tooltip_text=this.groups[this.activeIndex].tooltipText;
							if(g_tooltip.activeZone!='') g_tooltip.Deactivate();
							this.tooltip_activated = true;
							g_tooltip.ActivateDelay(new_tooltip_text, x+10, y+20, globalProperties.tooltip_button_delay, 1200, false, this.activeIndex);
						}
						if(g_tooltip.activeZone!=this.activeIndex && g_tooltip.activeZone>-1){
							g_tooltip.Deactivate();
							this.tooltip_activated = false;
						}
					} else if(g_tooltip.activeZone!=this.activeIndex && !isNaN(g_tooltip.getActiveZone())){
							g_tooltip.Deactivate();
							this.tooltip_activated = false;
					}
				} else if(g_tooltip.activeZone>-1){
					g_tooltip.Deactivate();
					this.tooltip_activated = false;
				}
                if(this.drag_moving && !timers.hidePlaylistManager && !timers.showPlaylistManager) {
                    pman.on_mouse("move", x, y);
                };
                break;
            case "wheel":
                if(cScrollBar.enabled && cScrollBar.visible) {
                    this.scrollbar.updateScrollbar();
                };
				g_tooltip.Deactivate();
                break;
            case "leave":
				//this.drag_clicked = false;
                if(cScrollBar.enabled && cScrollBar.visible) {
                    this.scrollbar && this.scrollbar.on_mouse(event, x, y);
                };
				if(properties.showToolTip && this.tooltip_activated) {
					g_tooltip.Deactivate();
					this.tooltip_activated = false;
				}
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
				if(Math.abs(brw.timerStartTime+brw.timerCounter*globalProperties.refreshRate-Date.now())>500){
					brw.startTimer();
				}
			}catch(e){}
			brw.timerScript();
		}, globalProperties.refreshRate);
	}
    this.timerScript = function() {
        if(!g_first_populate_launched) {
            if(isNaN(scroll) || isNaN(scroll_)) {
                scroll = scroll_ = 0;
            };
            g_first_populate_launched = true;
            brw.launch_populate();
        }
        if(!window.IsVisible) {
            window_visible = false;
            return;
        }
		if(Update_Required_function!="") {
			eval(Update_Required_function);
			Update_Required_function = "";
		}

        var repaint_1 = false;

        if(!window_visible){
            window_visible = true;
        };

        if(repaint_main1 == repaint_main2){
            repaint_main2 = !repaint_main1;
            repaint_1 = true;
        };

        scroll = check_scroll(scroll);
        if(Math.abs(scroll - scroll_) >= 5){
            scroll_ += (scroll - scroll_) / properties.scrollSmoothness;
            isScrolling = true;
            repaint_1 = true;
            if(scroll_prev != scroll) brw.scrollbar.updateScrollbar();
        } else {
            if(scroll_ != scroll) {
                scroll_ = scroll; // force to scroll_ value to fixe the 5.5 stop value for expanding album action
                repaint_1 = true;
            };
            if(isScrolling) {
                if(scroll_< 1) scroll_ = 0;
                isScrolling = false;
                repaint_1 = true;
            };
        };

        if(brw.group_unrequested_loading) {
			brw.group_unrequested_loading=false;
			repaint_1 = true;
		}
        if(repaint_1){
            repaintforced = true;
            repaint_main = true;
            images.loading_angle = (images.loading_angle+30) % 360;
            window.Repaint();
        };

        scroll_prev = scroll;
    }

	this.item_context_menu = function(x, y, albumIndex) {
		var _menu = window.CreatePopupMenu();
		var Context = fb.CreateContextMenuManager();
		var _child01 = window.CreatePopupMenu();
		var _child02 = window.CreatePopupMenu();

        var crc = this.groups[albumIndex].cachekey;

		this.metadblist_selection = this.groups[albumIndex].pl.Clone();

		_menu.AppendMenuItem(MF_STRING, 1, "Settings...");
		_menu.AppendMenuSeparator();
		if(fb.IsPlaying && this.current_sourceMode==0){
			_menu.AppendMenuItem(MF_STRING, 1011, "Locate now playing group");
			_menu.AppendMenuSeparator();
		}
		if(properties.displayMode==1 || properties.displayMode==2 || properties.displayMode==3){
			_menu.AppendMenuItem(MF_STRING, 1010, "Refresh this image");
		}

		_child02.AppendTo(_menu, MF_STRING, "Send to...");
		_child02.AppendMenuItem(MF_STRING, 2000, "A new playlist...");
        var pl_count = plman.PlaylistCount;
		if(pl_count > 1) {
			_child02.AppendMenuItem(MF_SEPARATOR, 0, "");
		};
		for(var i=0; i < pl_count; i++) {
			if(i != this.playlist && !plman.IsAutoPlaylist(i)) {
				playlist_name = plman.GetPlaylistName(i);
				if(playlist_name!=properties.selectionPlaylist && playlist_name!=properties.filterPlaylist) _child02.AppendMenuItem(MF_STRING, 2001 + i, plman.GetPlaylistName(i));
			};
		};

		Context.InitContext(this.metadblist_selection);

		Context.BuildMenu(_menu, 2, -1);


		if(utils.IsKeyPressed(VK_SHIFT)) {
			_menu.AppendMenuSeparator();
			_menu.AppendMenuItem(MF_STRING, 1001, "Properties ");
			_menu.AppendMenuItem(MF_STRING, 1002, "Configure...");
			_menu.AppendMenuSeparator();
			_menu.AppendMenuItem(MF_STRING, 1003, "Reload");
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
				delete_file_cache(this.groups[albumIndex].metadb, albumIndex);
                this.groups[albumIndex].tid = -1;
                this.groups[albumIndex].load_requested = 0;
				this.groups[albumIndex].cover_formated = false;
                this.groups[albumIndex].save_requested = false;
				this.groups[albumIndex].cover_img_mask = null;
                g_image_cache.reset(this.groups[albumIndex].cachekey);
                this.groups[albumIndex].cover_img = null;
                this.groups[albumIndex].cover_type = null;
                this.repaint();
				window.NotifyOthers("RefreshImageCover",this.groups[albumIndex].metadb)
				break;
			case 1011:
				this.showNowPlaying();
				break;
			case 2000:
				fb.RunMainMenuCommand("File/New playlist");
				plman.InsertPlaylistItems(plman.PlaylistCount-1, 0, this.metadblist_selection, false);
				break;
			case 1001:
				window.ShowProperties();
				break;
			case 1002:
				 window.ShowConfigure();
				break;
			case 1003:
				window.Reload();
				break;
			default:
				var insert_index = plman.PlaylistItemCount(ret-2001);
				plman.InsertPlaylistItems((ret-2001), insert_index, this.metadblist_selection, false);
			};
		};
		_child01 = undefined;
		_child02 = undefined;
		_menu = undefined;
        g_rbtn_click = false;
		return true;
	};

    this.settings_context_menu = function(x, y) {
            var _menu = window.CreatePopupMenu();
            var _menu0 = window.CreatePopupMenu();
            var _menu1 = window.CreatePopupMenu();
            var _menu11 = window.CreatePopupMenu();
            var _menu12 = window.CreatePopupMenu();
            var _menu13 = window.CreatePopupMenu();
            var _menu2 = window.CreatePopupMenu();
            var _menu3 = window.CreatePopupMenu();
			var _menu3A = window.CreatePopupMenu();
			var _rowHeight = window.CreatePopupMenu();
            var idx;
			
			if(properties.ParentName!="Library"){
				_menu0.AppendMenuItem(MF_STRING, 50, "Library");
				_menu0.AppendMenuItem(MF_STRING, 51, "Playlist");
				_menu0.CheckMenuRadioItem(50, 51, 50 + (properties.adapt_to_playlist?1:0));
				_menu0.AppendTo(_menu,MF_STRING, "Source");
				_menu.AppendMenuSeparator();
			}
            //_menu.AppendMenuItem((this.current_sourceMode == 1 ? MF_STRING : MF_GRAYED | MF_DISABLED), 60, "Cursor follows Focus");
            //_menu.CheckMenuItem(60, properties.followFocusChange);
            //_menu.AppendMenuSeparator();


            _menu13.AppendMenuItem(MF_STRING, 113, "Default (%genre%)");
            _menu13.CheckMenuItem(113, properties.tf_groupkey_genre == properties.tf_groupkey_genre_default && properties.genre_customGroup_label == "");
            _menu13.AppendMenuItem(MF_STRING, 116, "Custom titleformat...");
            _menu13.CheckMenuItem(116, !(properties.tf_groupkey_genre == properties.tf_groupkey_genre_default && properties.genre_customGroup_label == ""));

            _menu12.AppendMenuItem(MF_STRING, 112, "Default (%artist%)");
            _menu12.CheckMenuItem(112, properties.tf_groupkey_artist == properties.tf_groupkey_artist_default && properties.artist_customGroup_label == "");
            _menu12.AppendMenuItem(MF_STRING, 115, "Custom titleformat...");
            _menu12.CheckMenuItem(115, !(properties.tf_groupkey_artist == properties.tf_groupkey_artist_default && properties.artist_customGroup_label == ""));

            _menu11.AppendMenuItem(MF_STRING, 111, "Default (%album%)");
            _menu11.CheckMenuItem(111, properties.tf_groupkey_album == properties.tf_groupkey_album_default && properties.album_customGroup_label == "");
            _menu11.AppendMenuItem(MF_STRING, 114, "Custom titleformat...");
            _menu11.CheckMenuItem(114, !(properties.tf_groupkey_album == properties.tf_groupkey_album_default && properties.album_customGroup_label == ""));

			if(properties.showLibraryTreeSwitch) {
				_menu.AppendMenuItem(MF_STRING, 990, "Switch to library tree");
				_menu.AppendMenuSeparator();
			}
            _menu13.AppendTo(_menu1,(properties.tagMode==3)?MF_CHECKED:MF_STRING, "Preset 1 ("+properties.genre_label.toUpperCase()+")");
            _menu12.AppendTo(_menu1,(properties.tagMode==2)?MF_CHECKED:MF_STRING, "Preset 2 ("+properties.artist_label.toUpperCase()+")");
            _menu11.AppendTo(_menu1,(properties.tagMode==1)?MF_CHECKED:MF_STRING, "Preset 3 ("+properties.album_label.toUpperCase()+")");

            _menu1.AppendTo(_menu,MF_STRING, "Group by");

            _menu2.AppendMenuItem(MF_STRING, 913, "Tag switcher bar");
            _menu2.CheckMenuItem(913, properties.showTagSwitcherBar);
			if(main_panel_state.isEqual(0)){
				_menu2.AppendMenuItem(MF_STRING, 914, "Hide menu button");
				_menu2.CheckMenuItem(914, properties.showFiltersTogglerBtn);
			}
            _menu2.AppendMenuItem(MF_STRING, 910, "Search bar");
            _menu2.CheckMenuItem(910, properties.showHeaderBar);
            _menu2.AppendMenuSeparator();

            _menu2.AppendMenuItem(MF_STRING, 900, "Text only");
            _menu2.AppendMenuItem(MF_STRING, 902, "Text (Album Art on right)");
            _menu2.AppendMenuItem(MF_STRING, 901, "Album Art (Text on bottom)");
            _menu2.AppendMenuItem(MF_STRING, 903, "Album Art Grid");
			_menu2.AppendMenuItem(MF_STRING, 1806, "Album Art Grid (without Text)");
			if (properties.displayModeGridNoText) _menu2.CheckMenuItem(1806, properties.showTagSwitcherBar);
			else _menu2.CheckMenuRadioItem(900, 903, 900 + properties.displayMode);
            _menu2.AppendMenuSeparator();
			if(properties.tagMode!=1){
				_menu2.AppendMenuItem(MF_STRING, 918, "Album art Fallback");
				_menu2.CheckMenuItem(918, properties.AlbumArtFallback);
			}
			_menu2.AppendMenuItem(MF_STRING, 904, "Circle artwork");
            _menu2.CheckMenuItem(904, properties.circleMode);
            _menu2.AppendMenuItem(MF_STRING, 911, "Aggregate Item");
            _menu2.CheckMenuItem(911, properties.showAllItem);
            _menu2.AppendMenuItem(MF_STRING, 912, "Items count (on Text displays)");
            _menu2.CheckMenuItem(912, properties.drawItemsCounter);
            _menu2.AppendMenuItem(MF_STRING, 916, "Show Tooltips");
            _menu2.CheckMenuItem(916, properties.showToolTip);

            _menu2.AppendTo(_menu,MF_STRING, "Display");

			_rowHeight.AppendMenuItem(MF_STRING, 1001, "Increase");
			_rowHeight.AppendMenuItem(MF_STRING, 1000, "Decrease");
			_rowHeight.AppendMenuSeparator();
			_rowHeight.AppendMenuItem(MF_DISABLED, 0, "Tip: Hold SHIFT and use your");
			_rowHeight.AppendMenuItem(MF_DISABLED, 0, "mouse wheel over the panel!");
			if(properties.displayMode==0 || properties.displayMode==2){
				_rowHeight.AppendTo(_menu,MF_STRING, "Row height");
			} else {
				_rowHeight.AppendTo(_menu,MF_STRING, "Columns Width");
			}

			if(properties.ParentName=='Library'){
				var _panelWidth = window.CreatePopupMenu();
				_panelWidth.AppendMenuItem(MF_STRING, 1030, "Increase width");
				_panelWidth.AppendMenuItem(MF_STRING, 1031, "Decrease width");
				_panelWidth.AppendMenuItem(MF_STRING, 1033, "Custom width...");
				_panelWidth.AppendMenuItem(MF_STRING, 1032, "Reset");
				_panelWidth.AppendTo(_menu,MF_STRING, "Panel width");
			}

            _menu3.AppendMenuItem(MF_STRING, 200, "Enable");
            _menu3.CheckMenuItem(200, properties.showwallpaper);
            _menu3.AppendMenuItem(MF_STRING, 220, "Blur");
            _menu3.CheckMenuItem(220, properties.wallpaperblurred);

            _menu3A.AppendMenuItem(MF_STRING, 221, "Filling");
            _menu3A.CheckMenuItem(221, properties.wallpaperdisplay==0);
            _menu3A.AppendMenuItem(MF_STRING, 222, "Adjust");
            _menu3A.CheckMenuItem(222, properties.wallpaperdisplay==1);
            _menu3A.AppendMenuItem(MF_STRING, 223, "Stretch");
            _menu3A.CheckMenuItem(223, properties.wallpaperdisplay==2);
			_menu3A.AppendTo(_menu3,MF_STRING, "Wallpaper size");

            _menu3.AppendTo(_menu,MF_STRING, "Background Wallpaper");

            //_menu.AppendMenuSeparator();
            //_menu.AppendMenuItem(MF_STRING, 990, "Reload Library");
            //_menu.AppendMenuSeparator();
            //_menu.AppendMenuItem(MF_STRING, 991, "Panel Properties");
            //_menu.AppendMenuItem(MF_STRING, 992, "Configure...");

			//var FiltersMenu = window.CreatePopupMenu();
			//FiltersMenu.AppendTo(_menu, MF_STRING, "Filters");

            /*_menu.AppendMenuSeparator();
            _menu.AppendMenuItem(MF_STRING, 914, "Enable Disk Image Cache");
            _menu.CheckMenuItem(914, globalProperties.enableDiskCache);
            _menu.AppendMenuItem((globalProperties.enableDiskCache)?MF_STRING:MF_GRAYED, 915, "Load all covers at startup");
            _menu.CheckMenuItem(915, globalProperties.load_covers_at_startup);
            _menu.AppendMenuItem((globalProperties.enableDiskCache)?MF_STRING:MF_GRAYED, 917, "Load all artist thumbnails at startup");
            _menu.CheckMenuItem(917, globalProperties.load_artist_img_at_startup);*/

			_menu.AppendMenuItem(MF_STRING, 2997, "Show playlist panel on drag and drop");
			_menu.CheckMenuItem(2997, properties.DropInplaylist);
			
			_menu.AppendMenuItem(MF_STRING, 2998, "Sort ignoring the/les/los");
			_menu.CheckMenuItem(2998, properties.removePrefix);			

			if(main_panel_state.isEqual(1)) {
				_menu.AppendMenuSeparator();
				_menu.AppendMenuItem((filters_panel_state.isActive() ? MF_STRING : MF_GRAYED | MF_DISABLED), 2993, "Enable 1st filter");
				_menu.CheckMenuItem(2993, (filter1_state.isActive()));
				_menu.AppendMenuItem((filters_panel_state.isActive() ? MF_STRING : MF_GRAYED | MF_DISABLED), 2994, "Enable 2nd filter");
				_menu.CheckMenuItem(2994, (filter2_state.isActive()));
				_menu.AppendMenuItem((filters_panel_state.isActive() ? MF_STRING : MF_GRAYED | MF_DISABLED), 2995, "Enable 3rd filter");
				_menu.CheckMenuItem(2995, (filter3_state.isActive()));
				_menu.AppendMenuSeparator();
				if(!filters_panel_state.isMaximumValue())
					_menu.AppendMenuItem(MF_STRING, 2992, "Hide filters");
				else
					_menu.AppendMenuItem(MF_STRING, 2996, "Show bottom playlist");
			}



			if(utils.IsKeyPressed(VK_SHIFT)) {
				_menu.AppendMenuSeparator();
				_menu.AppendMenuItem(MF_STRING, 991, "Properties ");
				_menu.AppendMenuItem(MF_STRING, 992, "Configure...");
				_menu.AppendMenuSeparator();
				_menu.AppendMenuItem(MF_STRING, 993, "Reload");
			}

            idx = _menu.TrackPopupMenu(x,y);

            switch(true) {
                case (idx == 50):
                    properties.adapt_to_playlist = false;
                    window.SetProperty("_PROPERTY: populate from active playlist", properties.adapt_to_playlist);
					window.NotifyOthers("adapt_to_playlist",properties.adapt_to_playlist);
                    window.Reload();
                    break;
                case (idx == 51):
                    properties.adapt_to_playlist = true;
                    window.SetProperty("_PROPERTY: populate from active playlist", properties.adapt_to_playlist);
					window.NotifyOthers("adapt_to_playlist",properties.adapt_to_playlist);
                    window.Reload();
                    break;					
                case (idx == 60):
                    properties.followFocusChange = !properties.followFocusChange;
                    window.SetProperty("_PROPERTY: Follow focus change", properties.followFocusChange);
                    break;
                case (idx >= 111 && idx <= 113):
                    properties.tagMode = idx - 110;
                    window.SetProperty("_PROPERTY: Tag Mode", properties.tagMode);
                    switch(properties.tagMode) {
                        case 1:
                            properties.albumArtId = 0;
							properties.tf_groupkey_album = properties.tf_groupkey_album_default;
							window.SetProperty("_PROPERTY Album TitleFormat", properties.tf_groupkey_album);
							properties.album_customGroup_label = "";
							window.SetProperty("_DISPLAY: album customGroup name", properties.album_customGroup_label);
							window.NotifyOthers("album_customGroup_label",properties.album_customGroup_label);
                            break;
                        case 2:
							properties.tf_groupkey_artist = properties.tf_groupkey_artist_default;
							window.SetProperty("_PROPERTY Artist TitleFormat", properties.tf_groupkey_artist);
                            properties.albumArtId = 4;
							properties.artist_customGroup_label = "";
							window.SetProperty("_DISPLAY: artist customGroup name", properties.artist_customGroup_label);
							window.NotifyOthers("artist_customGroup_label",properties.artist_customGroup_label);
                            break;
                        case 3:
							properties.tf_groupkey_genre = properties.tf_groupkey_genre_default;
							window.SetProperty("_PROPERTY Genre TitleFormat", properties.tf_groupkey_genre);
                            properties.albumArtId = 5;
							properties.genre_customGroup_label = "";
							window.SetProperty("_DISPLAY: genre customGroup name", properties.genre_customGroup_label);
							window.NotifyOthers("genre_customGroup_label",properties.genre_customGroup_label);
                            break;
                    };
                    g_tagswitcherbar.on_init();
					g_filterbox.reset_layout();
                    brw.populate(true,1);
                    break;
                case (idx >= 114 && idx <= 116):
                    properties.tagMode = idx - 113;
                    window.SetProperty("_PROPERTY: Tag Mode", properties.tagMode);
                    switch(properties.tagMode) {
                        case 1:
							try {
								customFilterGrouping(properties.tagMode
													,"<div class='titleBig'>Custom Filter</div><div class='separator'></div><br/>Enter a title formatting script.\nYou can use the full foobar2000 title formatting syntax here.<br/><a href=\"http://tinyurl.com/lwhay6f\" target=\"_blank\">Click here</a> for informations about foobar title formatting. (http://tinyurl.com/lwhay6f)<br/>"
													,''
													,'Label (10 chars max):##Grouping pattern:'
													,properties.album_label+'##'+properties.tf_groupkey_album);
								/*new_TFgrouping = utils.InputBox(window.ID, "Enter a title formatting script.\nYou can use the full foobar2000 title formatting syntax here.\n\nSee http://tinyurl.com/lwhay6f\nfor informations about foobar title formatting.", "Album grouping", properties.tf_groupkey_album, true);
								if (!(new_TFgrouping == "" || typeof new_TFgrouping == 'undefined' || properties.tf_groupkey_album==new_TFgrouping)) {
									properties.tf_groupkey_album = new_TFgrouping;
									window.SetProperty("_PROPERTY Album TitleFormat", properties.tf_groupkey_album);
								}
								properties.albumArtId = 0;
								g_tagswitcherbar.on_init();
								g_filterbox.reset_layout();
								brw.populate(true,1);		*/
							} catch(e) {
							}
                            break;
                        case 2:
							try {
								customFilterGrouping(properties.tagMode
													,"<div class='titleBig'>Custom Filter</div><div class='separator'></div><br/>Enter a title formatting script.\nYou can use the full foobar2000 title formatting syntax here.<br/><a href=\"http://tinyurl.com/lwhay6f\" target=\"_blank\">Click here</a> for informations about foobar title formatting. (http://tinyurl.com/lwhay6f)<br/>"
													,''
													,'Label (10 chars max):##Grouping pattern:'
													,properties.artist_label+'##'+properties.tf_groupkey_artist);
								/*new_TFgrouping = utils.InputBox(window.ID, "Enter a title formatting script.\nYou can use the full foobar2000 title formatting syntax here.\n\nSee http://tinyurl.com/lwhay6f\nfor informations about foobar title formatting.", "Artist grouping", properties.tf_groupkey_artist, true);
								if (!(new_TFgrouping == "" || typeof new_TFgrouping == 'undefined')) {
									properties.tf_groupkey_artist = new_TFgrouping;
									window.SetProperty("_PROPERTY Artist TitleFormat", properties.tf_groupkey_artist);
								}
								properties.albumArtId = 4;
								g_tagswitcherbar.on_init();
								g_filterbox.reset_layout();
								brw.populate(true,1);*/
							} catch(e) {
							}
                            break;
                        case 3:
							try {
								customFilterGrouping(properties.tagMode
													,"<div class='titleBig'>Custom Filter</div><div class='separator'></div><br/>Enter a title formatting script.\nYou can use the full foobar2000 title formatting syntax here.<br/><a href=\"http://tinyurl.com/lwhay6f\" target=\"_blank\">Click here</a> for informations about foobar title formatting. (http://tinyurl.com/lwhay6f)<br/>"
													,''
													,'Label (10 chars max):##Grouping pattern:'
													,properties.genre_label+'##'+properties.tf_groupkey_genre);
								/*new_TFgrouping = utils.InputBox(window.ID, "Enter a title formatting script.\nYou can use the full foobar2000 title formatting syntax here.\n\nSee http://tinyurl.com/lwhay6f\nfor informations about foobar title formatting.", "Genre grouping", properties.tf_groupkey_genre, true);
								if (!(new_TFgrouping == "" || typeof new_TFgrouping == 'undefined')) {
									properties.tf_groupkey_genre = new_TFgrouping;
									window.SetProperty("_PROPERTY Genre TitleFormat", properties.tf_groupkey_genre);
								}
								properties.albumArtId = 5;
								g_tagswitcherbar.on_init();
								g_filterbox.reset_layout();
								brw.populate(true,1);*/
							} catch(e) {
							}
                            break;
                    };

                    break;
                case (idx == 200):
                    toggleWallpaper();
                    break;
                case (idx == 210):
                    properties.wallpapermode = 99;
                    window.SetProperty("_SYSTEM: Wallpaper Mode", properties.wallpapermode);
					on_colours_changed();
                    break;
                case (idx == 211):
                    properties.wallpapermode = 0;
                    window.SetProperty("_SYSTEM: Wallpaper Mode", properties.wallpapermode);
					on_colours_changed();
                    break;
                case (idx == 220):
                    properties.wallpaperblurred = !properties.wallpaperblurred;
                    window.SetProperty("_DISPLAY: Wallpaper Blurred", properties.wallpaperblurred);
					on_colours_changed();
                    break;
                case (idx == 221):
                    properties.wallpaperdisplay = 0;
                    window.SetProperty("_DISPLAY: Wallpaper 0=Filling 1=Adjust 2=Stretch", properties.wallpaperdisplay);
                    on_colours_changed();
                    break;
                case (idx == 222):
                    properties.wallpaperdisplay = 1;
                    window.SetProperty("_DISPLAY: Wallpaper 0=Filling 1=Adjust 2=Stretch", properties.wallpaperdisplay);
                    on_colours_changed();
                    break;
                case (idx == 223):
                    properties.wallpaperdisplay = 2;
                    window.SetProperty("_DISPLAY: Wallpaper 0=Filling 1=Adjust 2=Stretch", properties.wallpaperdisplay);
                    on_colours_changed();
                    break;
                case (idx >= 900 && idx <= 903):
                    properties.displayModeGridNoText = false;
                    window.SetProperty("_PROPERTY: Display Mode Grid No Text", properties.displayModeGridNoText);
                    properties.displayMode = idx - 900;
                    window.SetProperty("_PROPERTY: Display Mode", properties.displayMode);
					eval("properties.tagModedisplay"+properties.tagMode+" = "+idx+" - 900;");
					window.SetProperty("_PROPERTY: Display Mode for tag mode "+properties.tagMode, properties.displayMode);
                    get_metrics();
					brw.refresh_all_covers();
                    brw.setList();
                    brw.update();
                    break;
                case (idx == 1806):
                    properties.displayModeGridNoText = true;
                    window.SetProperty("_PROPERTY: Display Mode Grid No Text", properties.displayModeGridNoText);
                    properties.displayMode = 3;
                    window.SetProperty("_PROPERTY: Display Mode", properties.displayMode);
					eval("properties.tagModedisplay"+properties.tagMode+" = "+903+" - 900;");
					window.SetProperty("_PROPERTY: Display Mode for tag mode "+properties.tagMode, properties.displayMode);
                    get_metrics();
					brw.refresh_all_covers();
                    brw.setList();
                    brw.update();
                    break;
                case (idx == 904):
                    properties.circleMode = !properties.circleMode;
                    window.SetProperty("_PROPERTY: Circle Mode", properties.circleMode);
					eval("properties.circleDisplay"+properties.tagMode+" = "+properties.circleMode);
					window.SetProperty("_PROPERTY: Circle Mode for tag mode "+properties.tagMode, properties.circleMode);
                    get_metrics();
					brw.refresh_all_covers();
                    brw.setList();
                    brw.update();
                    break;
                case (idx == 910):
                    properties.showHeaderBar = !properties.showHeaderBar;
                    window.SetProperty("_DISPLAY: Show Top Bar", properties.showHeaderBar);
					eval("properties.showHeaderBar"+properties.tagMode+" = "+properties.showHeaderBar);
					window.SetProperty("_PROPERTY: Show Top Bar for tag mode "+properties.tagMode, properties.showHeaderBar);
                    get_metrics();
                    break;
                case (idx == 911):
                    properties.showAllItem = !properties.showAllItem;
                    window.SetProperty("_PROPERTY: Show ALL item", properties.showAllItem);
					eval("properties.showAllItem"+properties.tagMode+" = "+properties.showAllItem);
					window.SetProperty("_PROPERTY: Show ALL item for tag mode "+properties.tagMode, properties.showAllItem);
                    brw.populate(false,2);
                    break;
                case (idx == 912):
                    properties.drawItemsCounter = !properties.drawItemsCounter;
                    window.SetProperty("_PROPERTY: Show numbers of items in group", properties.drawItemsCounter);
					eval("properties.drawItemsCounter"+properties.tagMode+" = "+properties.drawItemsCounter);
					window.SetProperty("_PROPERTY: Show numbers of items for tag mode "+properties.tagMode, properties.drawItemsCounter);
                    break;
                case (idx == 913):
                    properties.showTagSwitcherBar = !properties.showTagSwitcherBar;
                    window.SetProperty("_PROPERTY: show buttons on top to change the source tag", properties.showTagSwitcherBar);
					g_filterbox.reset_layout();
                    get_metrics();
                    break;
                case (idx == 914):
                    properties.showFiltersTogglerBtn = !properties.showFiltersTogglerBtn;
                    window.SetProperty("_PROPERTY: show filters toggler btn", properties.showFiltersTogglerBtn);
					window.NotifyOthers("showFiltersTogglerBtn",properties.showFiltersTogglerBtn);
					brw.repaint();
                    break;
                /*case (idx == 914):
					enableDiskCacheGlobally();
					brw.repaint();
                    break;	*/
                case (idx == 915):
					enableCoversAtStartupGlobally();
					break;
                case (idx == 917):
					enableArtistImgAtStartupGlobally();
					break;
                case (idx == 918):
                    properties.AlbumArtFallback = !properties.AlbumArtFallback;
                    window.SetProperty("COVER Fallback to album art", properties.AlbumArtFallback);
					eval("properties.AlbumArtFallback"+properties.tagMode+" = "+properties.AlbumArtFallback);
					window.SetProperty("COVER Fallback to album art for tag mode "+properties.tagMode, properties.AlbumArtFallback);
                    get_metrics();
					var total = this.groups.length;
					for(var i = 0; i < total; i++) {
						g_image_cache.reset(this.groups[i].cachekey);
					};
					brw.refresh_all_covers();
                    brw.setList();
                    brw.update();
					break;
                case (idx == 916):
                    properties.showToolTip = !properties.showToolTip;
                    window.SetProperty("_PROPERTY: Show tooltips", properties.showToolTip);
					break;
                case (idx == 990):
                    librarytree.toggleValue();
                    break;
                case (idx == 991):
                    window.ShowProperties();
                    break;
                case (idx == 992):
                    window.ShowConfigure();
                    break;
                case (idx == 993):
                    window.Reload();
                    break;
                case (idx == 1000):
                    this.setRowHeight(-2);
                    break;
                case (idx == 1001):
                    this.setRowHeight(2);
                    break;
				case (idx == 1030):
					libraryfilter_width.increment(10);
					break;
				case (idx == 1031):
					libraryfilter_width.decrement(10);
					break;
				case (idx == 1032):
					libraryfilter_width.setDefault();
					break;
				case (idx == 1033):
					libraryfilter_width.userInputValue("Enter the desired width in pixel.\nDefault width is 210px.\nMinimum width: 100px. Maximum width: 900px", "Custom left menu width");
					break;
				case (idx == 2992):
					if(filters_panel_state.isActive()) toggleFilterState(0,true);
					else toggleFilterState(1);
					break;
				case (idx == 2993):
					if(!filter2_state.isActive() && !filter3_state.isActive()) toggleFilterState(0);
					else {
						filter1_state.toggleValue();
						updateIndividualFilterState();
					}
					break;
				case (idx == 2994):
					if(!filter1_state.isActive() && !filter3_state.isActive()) toggleFilterState(0);
					else {
						filter2_state.toggleValue();
						updateIndividualFilterState();
					}
					break;
				case (idx == 2995):
					if(!filter1_state.isActive() && !filter2_state.isActive()) toggleFilterState(0);
					else {
						filter3_state.toggleValue();
						updateIndividualFilterState();
					}
					break;
				case (idx == 2996):
					if(properties.savedFilterState>0 && properties.savedFilterState < filters_panel_state.getNumberOfState()-1 && !properties.displayToggleBtns) toggleFilterState(properties.savedFilterState);
					else toggleFilterState(1);
					break;
				case (idx == 2997):
					properties.DropInplaylist = !properties.DropInplaylist;
					window.SetProperty("_SYSTEM: Allow to drag items into a playlist", properties.DropInplaylist);
					break;
				case (idx == 2998):
					properties.removePrefix = !properties.removePrefix;
					window.SetProperty("_PROPERTY: ignore prefix", properties.removePrefix);
					eval("properties.removePrefix"+properties.tagMode+" = "+properties.removePrefix);
					window.SetProperty("_PROPERTY: ignore prefix for tag mode "+properties.tagMode, properties.removePrefix);
					brw.populate(true,"NoPrefix");				
					break;					
            };
            _menu3 = undefined;
            _menu2 = undefined;
            _menu1 = undefined;
            _menu0 = undefined;
			_menu3A = undefined;
            _menu = undefined;
			_rowHeight = undefined;
            return true;
    };

    this.incrementalSearch = function() {
        var count = 0;
        var groupkey;
        var chr;
        var gstart;
        var pid = -1;

        // exit if no search string in cache
        if(cList.search_string.length <= 0) return true;

        var total = this.groups.length;

        // 1st char of the search string
        var first_chr = cList.search_string.substring(0,1);
        var len = cList.search_string.length;

        // which start point for the search
        if(total > 1000) {
            groupkey = this.groups[Math.floor(total / 2)].groupkey;
            chr = groupkey.substring(0,1);
            if(first_chr.charCodeAt(first_chr) > chr.charCodeAt(chr)) {
                gstart = Math.floor(total / 2);
            } else {
                gstart = (properties.showAllItem ? 1 : 0);
            };
        } else {
            gstart = (properties.showAllItem ? 1 : 0);
        };

        var format_str = "";
        for(var i = gstart; i < total; i++) {
            groupkey = this.groups[i].groupkey;
            if(len <= groupkey.length) {
                format_str = groupkey.substring(0,len).toUpperCase();
            } else {
                format_str = groupkey;
            };
            if(format_str == cList.search_string) {
                pid = i;
                break;
            };
        };

        if(pid >= 0) { // found
            g_focus_id = pid;
            plman.ClearPlaylistSelection(g_active_playlist);
            plman.SetPlaylistSelectionSingle(g_active_playlist, g_focus_id, true);
            plman.SetPlaylistFocusItem(g_active_playlist, g_focus_id);
            this.showItemFromItemIndex(g_focus_id);
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
	this.freeMemory = function () {
		this.refresh_all_covers();
	}	
	this.refresh_all_covers = function(){
		var total = this.groups.length;
		for(var i = 0; i < total; i++) {
			this.groups[i].tid = -1;
			this.groups[i].load_requested = 0;
			this.groups[i].cover_formated = false;
			this.groups[i].cover_img_mask = null;
			this.groups[i].save_requested = false;
			this.groups[i].cover_img = null;
			this.groups[i].cover_type = null;
		};
		this.repaint();
	}
};

/*
===================================================================================================
    Main
===================================================================================================
*/
var brw = null;
var g_1x1 = false;
var g_last = 0;
var isScrolling = false;
var g_zoom_percent = 100;

var g_filterbox = null;
var filter_text = "";

var g_counter_repaint = 0;

var ww = 0, wh = 0;
var g_metadb = null;
var g_focus = false;
clipboard = {
    selection: null
};

var g_active_playlist = null;
var g_populate_opt = 1;

// boolean to avoid callbacks
var g_avoid_on_playlists_changed = false;
var g_avoid_on_playlist_switch = false;
var g_avoid_on_item_focus_change = false;
var g_avoid_on_playlist_items_added = false;
var g_avoid_on_playlist_items_removed = false;
var g_avoid_on_playlist_switch_callbacks = false;
var g_avoid_on_playlist_items_reordered = false;
// mouse actions
var g_lbtn_click = false;
var g_rbtn_click = false;
//
var g_total_duration_text = "";
var g_first_populate_done = false;
var g_first_populate_launched = false;

var repaintforced = false;
var launch_time = fb.CreateProfiler("launch_time");
var form_text = "";
var repaint_main = true, repaint_main1 = true, repaint_main2 = true;
var window_visible = false;
var scroll_ = 0, scroll = 0, scroll_prev = 0;
var time222;
var g_start_ = 0, g_end_ = 0;
var g_last = 0;
var g_image_cache = false;
var g_rightClickedIndex = -1;

var PanelToggleButtons_height=0;
// START
function on_size(w, h) {
    window.DlgCode = 0x0004;

    ww = Math.max(w,50);

	if(properties.showPanelToggleButtons && filters_panel_state.isActive())
		wh = h-PanelToggleButtons_height;
    else wh = h;
    if(!ww || !wh) {
        ww = 1;
        wh = 1;
    };
	if(window.IsVisible || first_on_size){
		positionButtons();

		window.MinWidth = 1;
		window.MinHeight = 1;

		// set wallpaper
		if(properties.showwallpaper){
			g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
		} else update_wallpaper = true;

		// set Size of browser
		height_top_fix = (properties.showHeaderBar ? properties.headerBarHeight : 0) + (properties.showTagSwitcherBar ? g_tagswitcherbar.default_height : 0);
		brw.setSize(0, height_top_fix, ww, wh - height_top_fix);
		update_size = false;
		first_on_size = false;
	} else update_size = true;
};

function set_update_function(string){
	if( Update_Required_function.indexOf("brw.populate(true")!=-1) return;
	else if(Update_Required_function.indexOf("brw.populate(false")!=-1) {
		if(string.indexOf("brw.populate(true")!=-1) Update_Required_function=string;
	}
	else Update_Required_function=string;
}

function on_paint(gr) {
    if(!ww || !wh || ww < 10 || wh < 10) return;
	if(update_size) on_size(window.Width, window.Height);
	if(update_wallpaper && properties.showwallpaper && properties.wallpapermode == 0){
		g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
		update_wallpaper = false;		
	}

    if(!g_1x1) {
        // draw background under playlist
		gr.FillSolidRect(0, 0, ww, wh+PanelToggleButtons_height, colors.lightgrey_bg);
        if(fb.IsPlaying && g_wallpaperImg && properties.showwallpaper) {
            gr.DrawImage(g_wallpaperImg, 0, 0, ww, wh+PanelToggleButtons_height, 0, 0, g_wallpaperImg.Width, g_wallpaperImg.Height);
            gr.FillSolidRect(0, 0, ww, wh+PanelToggleButtons_height, (properties.wallpaperblurred)?colors.wallpaper_overlay_blurred:colors.wallpaper_overlay);
        } else if(g_wallpaperImg && properties.showwallpaper) {
			gr.DrawImage(g_wallpaperImg, 0, 0, ww, wh+PanelToggleButtons_height, 0, 0, g_wallpaperImg.Width, g_wallpaperImg.Height);
			gr.FillSolidRect(0, 0, ww, wh+PanelToggleButtons_height, (properties.wallpaperblurred)?colors.wallpaper_overlay_blurred:colors.wallpaper_overlay);
        }

        brw && brw.draw(gr);

		if(properties.showPanelToggleButtons && filters_panel_state.isActive()){
			drawAllButtons(gr);
		}

        if(properties.showHeaderBar) {
            // inputBox
            if(cFilterBox.enabled && g_filterbox) {
                if(g_filterbox.inputbox.visible) {
					height_top_fix = (properties.showTagSwitcherBar) ? g_tagswitcherbar.default_height : 0;
                    g_filterbox.draw(gr, 8, Math.round(properties.headerBarHeight/2-cFilterBox.h/2)-2+height_top_fix);
                };
            };
        };
    };
};

function on_mouse_lbtn_down(x, y, m) {
    g_lbtn_click = true;
    g_rbtn_click = false;

	var isResizing = g_resizing.on_mouse("lbtn_down", x, y, m, !brw.scrollbar.cursorHover && main_panel_state.isEqual(0));
	if(!isResizing){
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

		if(properties.showPanelToggleButtons && filters_panel_state.isActive()){
			cur_btn_down = chooseButton(x, y);
			if (cur_btn_down) {
				g_down = true;
				cur_btn_down.changeState(ButtonStates.down);
				 window.Repaint();
			}
		}
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
			} else if(!cur_btn_down) {
				brw.on_mouse("down", x, y);
			};
		} else if(!cur_btn_down) {
			brw.on_mouse("down", x, y);
		};

		// inputBox
		if(properties.showHeaderBar && cFilterBox.enabled && g_filterbox.inputbox.visible) {
			g_filterbox.on_mouse("lbtn_down", x, y);
		};
		if(properties.showTagSwitcherBar) {
			g_tagswitcherbar.on_mouse("lbtn_down", x, y);
		}
	};
};

function on_mouse_lbtn_up(x, y, m) {
	var isResizing = g_resizing.on_mouse("lbtn_up", x, y, m);
	if(!isResizing){
		g_lbtn_click = false;
		if(properties.showPanelToggleButtons && filters_panel_state.isActive()){
			g_down = false;
			if (cur_btn_down != null && typeof cur_btn_down === 'object') {
				cur_btn_down.onClick();
				return;
			}
		}		
		// inputBox
		if(properties.showHeaderBar && cFilterBox.enabled && g_filterbox.inputbox.visible) {
			g_filterbox.on_mouse("lbtn_up", x, y);
		};
		if(properties.showTagSwitcherBar) {
			g_tagswitcherbar.on_mouse("lbtn_up", x, y);
		}

		if(!g_on_mouse_lbtn_dblclk) {
			if(pman.state == 1) {
				pman.on_mouse("up", x, y);
				brw.clearSaved_sendItemToPlaylist();
			} else {
				brw.on_mouse("up", x, y);
			};
		} else g_on_mouse_lbtn_dblclk = false;

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
			if(Math.abs(cTouch.scroll_delta) > 015 ) {
				cTouch.multiplier = ((1000 - cTouch.t1.Time) / 20);
				cTouch.delta = Math.round((cTouch.scroll_delta) / 015);
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
	};
};

function on_mouse_lbtn_dblclk(x, y, mask) {
	g_on_mouse_lbtn_dblclk = true;
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

    //if(!utils.IsKeyPressed(VK_SHIFT)) {
        // inputBox
        if(properties.showHeaderBar && cFilterBox.enabled && g_filterbox.inputbox.visible) {
            g_filterbox.on_mouse("rbtn_down", x, y);
        };
		if(properties.showTagSwitcherBar) {
			g_tagswitcherbar.on_mouse("rbtn_down", x, y);
		};
        if(pman.state == 1) {
            pman.on_mouse("right", x, y);
        };

        brw.on_mouse("right", x, y);
    //};
};

function on_mouse_rbtn_up(x, y){
    g_rbtn_click = false;

    if(!utils.IsKeyPressed(VK_SHIFT)) {
        return true;
    };
};

function on_mouse_move(x, y, m) {
    if(g_cursor.x == x && g_cursor.y == y) return;
	g_cursor.onMouse("move", x, y, m);
	var isResizing = g_resizing.on_mouse("move", x, y, m, main_panel_state.isEqual(0) && !brw.scrollbar.cursorHover && !brw.scrollbar.cursorDrag);
	if(isResizing){
		if(g_resizing.resizing_x>x+5){
			g_resizing.resizing_x = x;
			libraryfilter_width.decrement(5);
		} else if(g_resizing.resizing_x<x-5){
			g_resizing.resizing_x = x;
			libraryfilter_width.increment(5);
		}
	} else {
		if(properties.showPanelToggleButtons && filters_panel_state.isActive()){
			var old = cur_btn;
			cur_btn = chooseButton(x, y);

			if (old == cur_btn) {
				cur_btn && cur_btn.onMouse('move',x,y);
				if (g_down) return;
			} else if (g_down && cur_btn && cur_btn.state != ButtonStates.down) {
				cur_btn.changeState(ButtonStates.down);
				cur_btn.onMouse('move',x,y);
				return;
			} else {
				if(old){
					old.changeState(ButtonStates.normal);
					old.onMouse('move',x,y);
					brw.repaint();
				}
				if(cur_btn){
					cur_btn.changeState(ButtonStates.hover);
					cur_btn.onMouse('move',x,y);
					brw.repaint();
				} else g_tooltip.Deactivate();
			}
		}

		if(cur_btn!=null && properties.showPanelToggleButtons && filters_panel_state.isActive()){
			brw.on_mouse("leave", -1, -1);
			return;
		}
		// inputBox
		if(properties.showHeaderBar && cFilterBox.enabled && g_filterbox.inputbox.visible && !brw.drag_moving) {
			g_filterbox.on_mouse("move", x, y);
		};
		if(properties.showTagSwitcherBar) {
			g_tagswitcherbar.on_mouse("move", x, y);
		};
		if(pman.state == 1) {
			pman.on_mouse("move", x, y);
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

	if(typeof(stepstrait) == "undefined" || typeof(delta) == "undefined") intern_step = step;
	else intern_step = stepstrait/delta;

    if(cTouch.timer) {
        window.ClearInterval(cTouch.timer);
        cTouch.timer = false;
    };

    if(utils.IsKeyPressed(VK_SHIFT)) { // zoom cover size only
		brw.setRowHeight(intern_step);
    } else {
        if(utils.IsKeyPressed(VK_CONTROL)) { // zoom all elements)
            var zoomStep = 1;
            var previous = globalProperties.fontAdjustement;
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
            if(pman.state == 1) {
                if(pman.scr_w > 0) pman.on_mouse("wheel", g_cursor.x, g_cursor.y, intern_step);
            } else {
                scroll -= intern_step * (brw.rowHeight / properties.scrollRowDivider * properties.rowScrollStep);
                scroll = check_scroll(scroll)
                brw.on_mouse("wheel", g_cursor.x, g_cursor.y, intern_step);
            };
        };
    };
};

function on_mouse_leave() {
	g_cursor.onMouse("leave", -1, -1);
	g_resizing.on_mouse("leave", -1, -1);
    // inputBox
    if(properties.showHeaderBar && cFilterBox.enabled && g_filterbox.inputbox.visible) {
        g_filterbox.on_mouse("leave", 0, 0);
    };
	if(properties.showTagSwitcherBar) {
		g_tagswitcherbar.on_mouse("leave", 0, 0);
	};
    brw.on_mouse("leave", 0, 0);

    /*if(pman.state == 1) {
        pman.on_mouse("leave", 0, 0);
    };*/
	if(properties.showPanelToggleButtons && filters_panel_state.isActive()){
		g_down = false;
		if (cur_btn) {
			cur_btn.changeState(ButtonStates.normal);
			cur_btn.onMouse("leave", -1, -1);
			window.Repaint();
			cur_btn=null;
		}
	}
	g_tooltip.Deactivate();
};
function on_drag_enter(action, x, y, mask) {
	if(brw.drag_moving) {
		try{
			action.Text = "Insert";
		} catch(e){}
	}
}
function on_drag_leave() {
    /*if(pman.state == 1) {
        pman.on_mouse("leave", 0, 0);
    };*/
	g_resizing.on_drag("leave", 0, 0, null);
	pman.on_mouse("move", 0, 0);
	g_cursor.x = g_cursor.y = -1;
}

function on_drag_drop(action, x, y, mask) {
	action.Effect = 0;
	if(pman.state == 1) {
		pman.on_mouse("up", x, y);
		brw.clearSaved_sendItemToPlaylist();
	} else {
		brw.on_mouse("up", x, y);
	};
}

function on_drag_over(action, x, y, mask) {
    if(x == g_cursor.x && y == g_cursor.y) return true;
	if(!brw.drag_moving){
		action.Effect = 0;
		return;
	}
	if(brw.drag_moving && !timers.hidePlaylistManager && !timers.showPlaylistManager) {
		pman.on_mouse("move", x, y);
		try{
			action.Text = "Insert";
		} catch(e){}
	}

    g_cursor.x = x;
    g_cursor.y = y;
}
//=================================================// Metrics & Fonts & Colors & Images
function get_metrics() {
    properties.displayMode = eval("properties.tagModedisplay"+properties.tagMode);
    properties.circleMode = eval("properties.circleDisplay"+properties.tagMode);
    properties.showAllItem = eval("properties.showAllItem"+properties.tagMode);
    properties.drawItemsCounter = eval("properties.drawItemsCounter"+properties.tagMode);
    properties.showHeaderBar = eval("properties.showHeaderBar"+properties.tagMode);
    properties.removePrefix = eval("properties.removePrefix"+properties.tagMode);	
	properties.thumbnailWidth = eval("properties.thumbnailWidth"+properties.tagMode);
	properties.default_lineHeightMin = eval("properties.default_lineHeightMin"+properties.tagMode);
	properties.AlbumArtFallback = eval("properties.AlbumArtFallback"+properties.tagMode);
    // scroll step
    switch(properties.displayMode) {
        case 0:
        case 2:
            properties.rowScrollStep = 3;
            break;
        case 1:
        case 3:
            properties.rowScrollStep = 1;
            break;
    };

    cPlaylistManager.width = Math.floor(cPlaylistManager.default_width * g_zoom_percent / 100);
    cPlaylistManager.topbarHeight = Math.floor(cPlaylistManager.default_topbarHeight * g_zoom_percent / 100);
    cPlaylistManager.botbarHeight = Math.floor(cPlaylistManager.default_botbarHeight * g_zoom_percent / 100);
    cPlaylistManager.rowHeight = Math.floor(cPlaylistManager.default_rowHeight * g_zoom_percent / 100);
    cPlaylistManager.scrollbarWidth = Math.floor(cPlaylistManager.default_scrollbarWidth * g_zoom_percent / 100);

    properties.thumbnailWidth = Math.floor(properties.thumbnailWidth * (g_zoom_percent / 100));
    properties.lineHeightMin = Math.floor(properties.default_lineHeightMin * g_zoom_percent / 100) + g_fsize - 11;

    properties.botStampHeight = Math.floor(properties.default_botStampHeight * g_zoom_percent / 100);
    properties.botGridHeight = Math.floor(properties.default_botGridHeight * g_zoom_percent / 100);
    properties.botTextRowHeight = Math.floor(properties.default_botTextRowHeight * g_zoom_percent / 100); // panelMode 1 || 3
    properties.textLineHeight = Math.floor(properties.lineHeightMin*0.28 * g_zoom_percent / 100); // panelMode 0 || 2
    if(properties.MinNumberOfColumns<1) properties.MinNumberOfColumns=1;

    if(properties.showHeaderBar) {
        properties.headerBarHeight = Math.round(properties.defaultHeaderBarHeight * g_zoom_percent / 100);
        properties.headerBarHeight = Math.floor(properties.headerBarHeight / 2) != properties.headerBarHeight / 2 ? properties.headerBarHeight : properties.headerBarHeight - 1;
    } else {
        properties.headerBarHeight = 0;
    };
	if(properties.displayMode==1 || properties.displayMode==3) properties.first_item_top_margin = 0;
	else properties.first_item_top_margin = properties.first_item_top_margin_default;
    cScrollBar.width = Math.floor(cScrollBar.defaultWidth * g_zoom_percent / 100);
    cScrollBar.minCursorHeight = Math.round(cScrollBar.defaultMinCursorHeight * g_zoom_percent / 100);

    cFilterBox.w = Math.floor(cFilterBox.default_w * g_zoom_percent / 100);
    cFilterBox.h = Math.round(cFilterBox.default_h * g_zoom_percent / 100);

	if(properties.displayMode!=3 && properties.displayMode!=1) properties.addedRows_end = properties.addedRows_end_default;
	else properties.addedRows_end=0

	height_top_fix = (properties.showHeaderBar ? properties.headerBarHeight : 0);
	height_top_fix += (properties.showTagSwitcherBar ? g_tagswitcherbar.default_height : 0);

    if(brw) {
        if(cScrollBar.enabled)  {
            brw.setSize(0, height_top_fix, ww, wh - height_top_fix);
        } else {
            brw.setSize(0, height_top_fix, ww, wh - height_top_fix);
        };
    };
};

function get_images() {
    var gb;
    var txt = "";

	if(properties.darklayout) {
		var theme_path = "white\\";
		images.playing_playlist = gdi.Image(theme_img_path + "\\graphic_browser\\now_playing_progress1.png");
	} else {
		images.playing_playlist = gdi.Image(theme_img_path + "\\graphic_browser\\now_playing_track1.png");
		var theme_path = "";
	}

    if(properties.showHeaderBar) g_filterbox.getImages();
	if(properties.showTagSwitcherBar) g_tagswitcherbar.getImages();

    images.all = gdi.CreateImage(150, 150);
    gb = images.all.GetGraphics();
    gb.FillSolidRect(0, 0, 150, 150, colors.normal_txt & 0x10ffffff);
    images.all.ReleaseGraphics(gb);

    /*var img_loading = gdi.Image(images.path+"load.png");
    var iw = Math.round(properties.rowHeight-30);
    //images.loading_draw = img_loading.Resize(iw, iw, 7);
    images.loading_draw = img_loading;*/

	images.loading = gdi.Image(images.path+"load.png");
	images.loading_draw = images.loading;
    images.noartist = gdi.Image(theme_img_path+"\\no_artist.png");

	images.filters_increase_icon = gdi.Image(theme_img_path + "\\icons\\"+theme_path+"filters_increase.png");
	images.filters_increase_hover_icon = gdi.Image(theme_img_path + "\\icons\\"+theme_path+"filters_increase_hover.png");
	images.filters_decrease_icon = gdi.Image(theme_img_path + "\\icons\\"+theme_path+"filters_decrease.png");
	images.filters_decrease_hover_icon = gdi.Image(theme_img_path + "\\icons\\"+theme_path+"filters_decrease_hover.png");
};


function get_colors() {
	get_colors_global();
	if(properties.darklayout){
		colors.normal_txt = GetGrey(180);
		colors.grid_txt = GetGrey(255)
		colors.grid_bg = GetGrey(0,190)
		colors.gridselected_txt = GetGrey(0)
		colors.gridselected_bg = GetGrey(255,155)
		colors.gridselected_rect = GetGrey(255,245)

		colors.btn_inactive_opacity = 130;
		colors.btn_inactive_txt = GetGrey(140);

		colors.grad_bottom_color1 = GetGrey(0,70);
		colors.grad_bottom_color_library_panel = GetGrey(0,70);
		colors.grad_bottom_color2 = GetGrey(0,0);
		colors.fading_bottom_height = 50;
	} else {
		colors.grid_txt = GetGrey(255)
		colors.grid_bg = GetGrey(0,190)
		colors.gridselected_txt = GetGrey(0)
		colors.gridselected_bg = GetGrey(255,155)
		colors.gridselected_rect = GetGrey(255,245)

		colors.btn_inactive_opacity = 110;
		colors.btn_inactive_txt = colors.faded_txt;

		colors.grad_bottom_color1 = GetGrey(0,10);
		colors.grad_bottom_color_library_panel = GetGrey(0,10);
		colors.grad_bottom_color2 = GetGrey(0,0);
		colors.fading_bottom_height = 30;

		colors.headerbar_bg = GetGrey(255,240);
		if(properties.showwallpaper) {
			colors.headerbar_line = GetGrey(0,40);
		}
	}
	colors.selected_txt = colors.normal_txt;
	get_images();
};

function on_font_changed() {
    get_font();
	if(properties.showHeaderBar) {
		g_filterbox.setSize(ww, cFilterBox.h+2, g_fsize+1);
		g_filterbox.onFontChanged();
	}
	brw.onFontChanged();
    get_metrics();
    brw.repaint();
};

function on_colours_changed() {
    get_colors();
	setButtons();
	positionButtons();
    if(brw) brw.scrollbar.setNewColors();

	g_filterbox.getImages();
	g_filterbox.reset_layout();

	if(properties.showwallpaper || properties.darklayout) {
		g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.IsPlaying ? fb.GetNowPlaying() : null);
	};
    brw.repaint();
};

function on_script_unload() {
    //brw.resetTimer();
};

//=================================================// Keyboard Callbacks
function on_key_up(vkey) {
    if(cSettings.visible) {

    } else {
        // inputBox
        if(properties.showHeaderBar && cFilterBox.enabled && g_filterbox.inputbox.visible) {
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


function on_key_down(vkey) {
    var mask = GetKeyboardMask();
	var active_filterbox = false;
    if(cSettings.visible) {

    } else {
        // inputBox
        if(properties.showHeaderBar && cFilterBox.enabled && g_filterbox.inputbox.visible) {
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
                var total = brw.groups.length;
                for(var i = 0; i < total; i++) {
                    brw.groups[i].tid = -1;
                    brw.groups[i].load_requested = 0;
					brw.groups[i].cover_formated = false;
                    brw.groups[i].save_requested = false;
                    brw.groups[i].cover_img = null;
                    brw.groups[i].cover_type = null;
                };
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
				if(active_filterbox) g_filterbox.resetSearch();
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
                if(brw.rowsCount > 0 && !cScrollBar.timerID) {
					on_mouse_wheel(1);
                    brw.keypressed = true;
                    reset_cover_timers();
                };
                break;
            case VK_DOWN:
                if(brw.rowsCount > 0 && !cScrollBar.timerID) {
					on_mouse_wheel(-1);
                    brw.keypressed = true;
                    reset_cover_timers();
                };
                break;
            case VK_PGUP:
                if(brw.rowsCount > 0 && !brw.keypressed && !cScrollBar.timerID) {
					scroll -= brw.h-properties.rowHeight;
					scroll = check_scroll(scroll)
                };
                break;
            case VK_PGDN:
                if(brw.rowsCount > 0 && !brw.keypressed && !cScrollBar.timerID) {
					scroll += brw.h-properties.rowHeight;
					scroll = check_scroll(scroll)
                };
                break;
            case VK_RETURN:
                // play/enqueue focused item
                break;
            case VK_END:
                if(brw.rowsCount > 0) {
					scroll = ((brw.rowsCount+properties.addedRows_end) * properties.rowHeight) - (brw.totalRowsVis * properties.rowHeight) + properties.first_item_top_margin;
                };
                break;
            case VK_HOME:
                if(brw.rowsCount > 0) {
					scroll = 0;
                };
                break;
            case VK_DELETE:
                if(!plman.IsAutoPlaylist(act_pls)) {

                };
                break;
            };
        } else {
            switch(mask) {
                case KMask.shift:
                    switch(vkey) {
                        case VK_SHIFT: // SHIFT key alone

                            break;
                        case VK_UP: // SHIFT + KEY UP

                            break;
                        case VK_DOWN: // SHIFT + KEY DOWN

                            break;
                    };
                    break;
                case KMask.ctrl:
                    if(vkey==65) { // CTRL+A

                    };
                    if(vkey==66) { // CTRL+B
                        cScrollBar.enabled = !cScrollBar.enabled;
                        window.SetProperty("_DISPLAY: Show Scrollbar", cScrollBar.enabled);
                        get_metrics();
                        brw.repaint();
                    };
                    if(vkey==88) { // CTRL+X
                        if(!plman.IsAutoPlaylist(act_pls)) {

                        };
                    };
                    if(vkey==67) { // CTRL+C

                    };
                    if(vkey==86) { // CTRL+V

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
    if(properties.showHeaderBar && cFilterBox.enabled && g_filterbox.inputbox.visible) {
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
function on_playback_new_track(metadb){
    g_metadb = metadb;
	if(window.IsVisible) {
		if(properties.showwallpaper && properties.wallpapermode == 0) {
			g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, metadb);
		};
		brw.repaint();
	} else if(properties.wallpapermode == 0) update_wallpaper = true;
	try{
		playing_track_playcount = TF.play_count.Eval();
	} catch(e){}
}
function on_playback_stop(reason) {
    g_metadb = null;
    switch(reason) {
    case 0: // user stop
    case 1: // eof (e.g. end of playlist)
        // update wallpaper
        if(properties.showwallpaper && properties.wallpapermode == 0) {
            g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, null);
			brw.repaint();
        };
        break;
    case 2: // starting_another (only called on user action, i.e. click on next button)
        break;
    };
};
//=================================================// Library Callbacks
function on_library_items_added() {
	if(g_avoid_on_library_items_added) {
		g_avoid_on_library_items_added=false;
		return;
	}
	g_avoid_on_library_items_removed=true;
    if(window.IsVisible && brw.current_sourceMode==0) brw.timer_populate(is_first_populate = true,4);
	else if(brw.current_sourceMode==0) set_update_function("brw.populate(true,4)");

	if(timers.avoid_on_library_items_removed) clearTimeout(timers.avoid_on_library_items_removed);
	timers.avoid_on_library_items_removed = setTimeout(function() {
		g_avoid_on_library_items_removed = false;
		clearTimeout(timers.avoid_on_library_items_removed);
		timers.avoid_on_library_items_removed = false;
	}, 200);
};

function on_library_items_removed() {
	if(g_avoid_on_library_items_removed) {
		g_avoid_on_library_items_removed=false;
		return;
	}
	g_avoid_on_library_items_added=true;
    if(window.IsVisible && brw.current_sourceMode==0) brw.timer_populate(is_first_populate = true,5);
	else if(brw.current_sourceMode==0) set_update_function("brw.populate(true,5)");

	if(timers.avoid_on_library_items_added) clearTimeout(timers.avoid_on_library_items_added);
	timers.avoid_on_library_items_added = setTimeout(function() {
		g_avoid_on_library_items_added = false;
		clearTimeout(timers.avoid_on_library_items_added);
		timers.avoid_on_library_items_added = false;
	}, 200);
};
/*
function on_library_items_changed() {
	playing_track_new_count = parseInt(playing_track_playcount,10)+1

    if(window.IsVisible && brw.current_sourceMode==0) brw.populate(is_first_populate = false,6);
	else if(brw.current_sourceMode==0) set_update_function("brw.populate(false,6)");
};
*/
//=================================================// Playlist Callbacks
function on_playlists_changed() {
	if(!g_avoid_on_playlists_changed){
		brw.searchPlaylists();
		if(window.IsVisible) {
			//g_avoid_on_playlist_switch = true;

			if(plman.ActivePlaylist < 0 || plman.ActivePlaylist > plman.PlaylistCount - 1) {
				plman.ActivePlaylist = 0;
			};
			if(g_active_playlist != plman.ActivePlaylist) {
				g_active_playlist = plman.ActivePlaylist;
			};

			// refresh playlists list
			pman.populate(exclude_active = false, reset_scroll = false);

			//Update_Required_function="";
		} else {
			set_update_function('on_playlists_changed();');
			if(properties.DropInplaylist) pman.refresh_required = true;
		}
	}
};

function on_playlist_switch() {
	if(!g_avoid_on_playlist_switch_callbacks) brw.tempSelectedItem = -1;
    if(window.IsVisible) {
		if(g_avoid_on_playlist_switch_callbacks) {
			if(timers.avoidPlaylistSwitch) clearTimeout(timers.avoidPlaylistSwitch);
			timers.avoidPlaylistSwitch = setTimeout(function() {
				g_avoid_on_playlist_switch_callbacks = false; // when avoid set in playlists_changed afeter a send to a new playlist action in JSSP
				clearTimeout(timers.avoidPlaylistSwitch);
				timers.avoidPlaylistSwitch = false;
			}, 500);
			return;
		};

		g_active_playlist = plman.ActivePlaylist;
		if(brw.pidx_to_send != g_active_playlist){
			brw.clearSelectedItem();
		}

		if(brw.current_sourceMode == 1 && brw.pidx_to_send != plman.ActivePlaylist) {
			scroll = scroll_ = 0;
			brw.populate(false,7);
		};

		// refresh playlists list
		pman.populate(exclude_active = false, reset_scroll = false);
		brw.repaint();
		//Update_Required_function="";
	} else {
		if(brw.current_sourceMode == 1 && brw.pidx_to_send != g_active_playlist) set_update_function('g_active_playlist = plman.ActivePlaylist; brw.populate(false,7)');
		else set_update_function('on_playlist_switch()');
	}
};

function on_playlist_items_added(playlist_idx) {
	if(brw.sourcePlaylistIdx == playlist_idx) brw.sourcePlaylistIdx = -1;
    if(window.IsVisible) {
		if(g_avoid_on_playlist_items_added) {
			g_avoid_on_playlist_items_added=false;
			return;
		}
		g_avoid_on_playlist_items_removed=true;
		//if(playlist_idx==brw.selectionIdx) brw.tempSelectedItem = -1;
		if(brw.current_sourceMode == 1 || brw.current_sourceMode == 2) {
			if((brw.current_sourceMode == 1 && playlist_idx == g_active_playlist && playlist_idx!=brw.pidx_to_send) || (brw.current_sourceMode == 2 && playlist_idx==brw.sourceIdx)) {
				brw.populate(is_first_populate = false,8);
			};
		};
		//Update_Required_function="";
	} else set_update_function('on_playlist_items_added('+playlist_idx+')');
};

function on_playlist_items_removed(playlist_idx, new_count) {
	if(brw.sourcePlaylistIdx == playlist_idx) brw.sourcePlaylistIdx = -1;
    if(window.IsVisible) {
		if(g_avoid_on_playlist_items_removed)  {
			g_avoid_on_playlist_items_removed=false;
			return;
		}
		g_avoid_on_playlist_items_added = true;
		//if(playlist_idx==brw.selectionIdx) brw.tempSelectedItem = -1;
		if(playlist_idx == g_active_playlist && new_count == 0) scroll = scroll_ = 0;

		if(brw.current_sourceMode == 1 || brw.current_sourceMode == 2) {
			if((brw.current_sourceMode == 1 && playlist_idx == g_active_playlist && playlist_idx!=brw.pidx_to_send) || (brw.current_sourceMode == 2 && playlist_idx==brw.sourceIdx)) {
				brw.populate(is_first_populate = false,9);
			};
		};
		//Update_Required_function="";
	} else set_update_function('on_playlist_items_removed('+playlist_idx+','+new_count+')');
};

function on_playlist_items_reordered(playlist_idx) {
    /*if(window.IsVisible) {
		if(brw.current_sourceMode == 1) {
			if(playlist_idx == g_active_playlist) {
				brw.populate(is_first_populate = true,10);
			};
		};
		//Update_Required_function="";
	} else Update_Required_function = 'on_playlist_items_reordered('+playlist_idx+')';	*/
};

/*
function on_item_focus_change(playlist_idx, from, to) {
    if(window.IsVisible) {
		if(g_avoid_on_item_focus_change) {
			g_avoid_on_item_focus_change = false;
			return;
		};

		if(brw.list && brw.current_sourceMode == 1) {
			if(playlist_idx == g_active_playlist) {
				if(properties.followFocusChange) {
					if(to > -1 && to < brw.list.Count) {
						var gid = brw.getItemIndexFromTrackIndex(to);
						if(gid > -1) {
							brw.showItemFromItemIndex(gid);
						};
					};
				};
			};
		};
	}
}; */


function on_metadb_changed(metadbs, fromhook) {
	playing_track_new_count = parseInt(playing_track_playcount,10)+1
	try{
		if(fb.IsPlaying && metadbs.Count==1 && metadbs[0].RawPath==fb.GetNowPlaying().RawPath && TF.play_count.Eval()==(playing_track_new_count)) {
			playing_track_playcount = playing_track_new_count;
			return;
		}
	} catch(e){}
	if(g_avoid_on_metadb_changed || fromhook) {
		g_avoid_on_metadb_changed = false;
		return;
	}
	// rebuild list
	var inLibrary = false;
	for(i=0; i < metadbs.Count; i++){
		inLibrary = fb.IsMetadbInMediaLibrary(metadbs[i]);
		if(inLibrary) break;
	}
	if(brw.current_sourceMode == 0 && inLibrary) {
		if(filter_text.length > 0) {
			if(!window.IsVisible) set_update_function('brw.populate(true,11)');
			else brw.populate(is_first_populate = true,11);
		} else {
			if(!window.IsVisible) set_update_function('brw.populate(false,12)');
			else brw.populate(is_first_populate = false,12);
		};
	};
};

function on_item_selection_change() {
    /*if(window.IsVisible)
		brw.repaint();
	else Update_Required_function = 'on_item_selection_change()';	*/
};

function on_playlist_items_selection_change() {
    /*if(window.IsVisible)
		brw.repaint();
	else Update_Required_function = 'on_playlist_items_selection_change()';	*/
};

function on_focus(is_focused) {
    g_focus = is_focused;
    if(!is_focused && g_filterbox.inputbox.edit) {
		g_filterbox.inputbox.on_focus(is_focused)
        brw.repaint();
    };
	if(!is_focused){
		brw.clearSelectedItemsOnNextClick = true;
	}
};

//=================================================// Custom functions
function check_scroll(scroll___){
    if(scroll___ < 0)
        scroll___ = 0;
    var g1 = brw.h - (brw.totalRowsVis * properties.rowHeight);
    //var scroll_step = Math.ceil(properties.rowHeight / properties.scrollRowDivider);
    //var g2 = Math.floor(g1 / scroll_step) * scroll_step;

    var end_limit = ((brw.rowsCount+properties.addedRows_end) * properties.rowHeight) - (brw.totalRowsVis * properties.rowHeight) - g1 + properties.first_item_top_margin;
    if(scroll___ != 0 && scroll___ > end_limit) {
        scroll___ = end_limit;
    };
    return scroll___;
};

function g_sendResponse() {
	if(g_filterbox.inputbox.text.length == 0) {
        filter_text = "";
    } else {
	    filter_text = g_filterbox.inputbox.text;
    };

    // filter in current panel
    brw.populate(true,13);
};

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
		case "adapt_to_playlist":
			if(properties.ParentName!="Library"){
				properties.adapt_to_playlist = info;
				window.SetProperty("_PROPERTY: populate from active playlist", properties.adapt_to_playlist);
				window.Reload();
			}
		break;		
		case "colors":
			globalProperties.colorsMainPanel = info;
			window.SetProperty("GLOBAL colorsMainPanel", globalProperties.colorsMainPanel);
			on_colours_changed();
		break;
		case "enableResizableBorders":
			globalProperties.enableResizableBorders = info;
			window.SetProperty("GLOBAL enableResizableBorders", globalProperties.enableResizableBorders);
		break;
		case "libraryfilter_width":
			libraryfilter_width.value=info;
		break;
		case "libraryfilter_state":
			libraryfilter_state.value=info;
		break;
		case "showFiltersTogglerBtn":
			if(main_panel_state.isEqual(0) && properties.ParentName=="Library"){
				properties.showFiltersTogglerBtn=info;
				window.SetProperty("_PROPERTY: show filters toggler btn", properties.showFiltersTogglerBtn);
				window.Repaint();
			}
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
        case "FocusOnNowPlayingForce":
			g_avoid_on_playlist_switch_callbacks = true;
			if(window.IsVisible) brw.showNowPlaying();
			if(timers.avoidPlaylistSwitch) clearTimeout(timers.avoidPlaylistSwitch);
			timers.avoidPlaylistSwitch = setTimeout(function() {
				g_avoid_on_playlist_switch_callbacks = false;
				clearTimeout(timers.avoidPlaylistSwitch);
				timers.avoidPlaylistSwitch = false;
			}, 500);
        break;
        case "JSSmoothPlaylist->JSSmoothBrowser:avoid_on_playlist_switch_callbacks_on_sendItemToPlaylist":
            g_avoid_on_playlist_switch_callbacks = true;
            break;
		case "set_font":
			globalProperties.fontAdjustement = info;
			window.SetProperty("GLOBAL Font Adjustement", globalProperties.fontAdjustement);
			on_font_changed();
		break;
		case "display_toggle_buttons":
			properties.displayToggleBtns = info;
			window.SetProperty("_DISPLAY: Toggle buttons", properties.displayToggleBtns);
			positionButtons();
			brw.repaint();
		break;
        case "JSSmoothPlaylist->JSSmoothBrowser:show_item":
            brw.showItemFromItemHandle(info);
            break;
		case "libraryFilter_tagMode":
			if(properties.ParentName=="Library" && properties.tagMode != info){
				g_tagswitcherbar.activeItem = info;
				properties.tagMode = info;
				window.SetProperty("_PROPERTY: Tag Mode", properties.tagMode);
				switch(properties.tagMode) {
					case 1:
						properties.albumArtId = 0;
						break;
					case 2:
						properties.albumArtId = 4;
						break;
					case 3:
						properties.albumArtId = 5;
						break;
				};
				get_metrics();
				brw.populate(true,1);
			}
			break;
        case "refresh_filters":
			if(info[0]<=properties.filterOrder && window.IsVisible){
				if(brw.current_sourceMode != 0){
					browser_refresh_required=true;
					brw.populate(is_first_populate = false,15);
				} else {
					browser_refresh_required=true;
					brw.populate(is_first_populate = false,16,1);
				}				
			} else if(!window.IsVisible) brw.clearSelectedItem();
			if(typeof info[1] !== 'undefined') brw.setFiltredPlaylist(info[1]);
            break;
        case "reset_filters":
			if(info<=properties.filterOrder){
				if(brw.current_sourceMode == 0 && brw.populate_sourceMode != 0){
					browser_refresh_required=true;
					if(window.IsVisible) brw.populate(is_first_populate = false,14);
					else set_update_function("brw.populate(false,14)");
				}
			}
            break;
		case"RefreshImageCover":
		if(properties.displayMode>=1) {
			var total = brw.groups.length;
			for(var i = 0; i < total; i++) {
				brw.groups[i].tid = -1;
				brw.groups[i].load_requested = 0;
				brw.groups[i].cover_formated = false;
				brw.groups[i].save_requested = false;
				brw.groups[i].cover_img = null;
				brw.groups[i].cover_type = null;
			};
			var metadb = new FbMetadbHandleList(info);
			g_image_cache.resetMetadb(metadb[0])
			brw.repaint();
		}
		break;
		case"DiskCacheState":
			globalProperties.enableDiskCache = info;
			window.SetProperty("COVER Disk Cache", globalProperties.enableDiskCache);
			brw.repaint();
		break;
		case"UpdatePlaylists":
			brw.searchPlaylists();
		break;
		case"LoadAllCoversState":
			globalProperties.load_covers_at_startup = info;
			window.SetProperty("COVER Load all at startup", globalProperties.load_covers_at_startup);
		break;
		case"LoadAllArtistImgState":
			globalProperties.load_artist_img_at_startup = info;
			window.SetProperty("ARTIST IMG Load all at startup", globalProperties.load_artist_img_at_startup);
		break;
		case"playlists_dark_theme":
			if(properties.ParentName=="Playlists"){
				properties.darklayout = info;
				window.SetProperty("_DISPLAY: Dark layout", properties.darklayout);
				on_colours_changed();
			}
		break;
		case"library_dark_theme":
			if(properties.ParentName=="Library"){
				properties.darklayout = info;
				window.SetProperty("_DISPLAY: Dark layout", properties.darklayout);
				on_colours_changed();
			}
		break;
		case "wallpaperVisibilityGlobal":
		case "wallpaperVisibility":
			if(window.IsVisible || name=="wallpaperVisibilityGlobal") toggleWallpaper(info);
		break;
		case "wallpaperBlurGlobal":
		case "wallpaperBlur":
			if(window.IsVisible || name=="wallpaperBlurGlobal") toggleBlurWallpaper(info);
		break;
        case "WSH_panels_reload":
			window.Reload();
            break;
		case "avoid_on_playlists_changed":
			g_avoid_on_playlists_changed=info;
			if(!info) brw.clearSelectedItem();
			break;
		case "cover_cache_finalized":
			//g_image_cache.cachelist = info.map( (arg)=>{ return (arg ? cloneImg(arg) : null); } );
			//g_image_cache.cachelist = cloneImgs(info);
			/*
			for (var i in info) {
				g_image_cache.cachelist = new GdiBitmap(info[i]);
			}
			window.Repaint();*/
		break;
		case "layout_state":
			layout_state.value=info;
		break;
		case "set_filter_text":
			g_filterbox.inputbox.text=info;
			g_sendResponse();
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
		break;
		case "trackinfosplaylist_state":
			trackinfosplaylist_state.value=info;
		break;
		case "trackinfosbio_state":
			trackinfosbio_state.value=info;
		break;
		case "trackinfosvisu_state":
			trackinfosvisu_state.value=info;
		break;
		case "main_panel_state":
			main_panel_state.value = info;
		break;
		case "filters_panel_state":
			filters_panel_state.value=info;
			positionButtons();
		break;
		case "save_filter_state":
			properties.savedFilterState = info;
			window.SetProperty("_PROPERTY: Saved filter state", properties.savedFilterState);
			positionButtons();
		break;
		case "librarytree":
			librarytree.value=info;
		break;
		case "rating_updated":
		case "rating_album_updated":
			g_avoid_on_metadb_changed=true;
		break;
		case "filter1_state":
			filter1_state.value=info;
			updateIndividualFilterState();
		break;
		case "filter2_state":
			filter2_state.value=info;
			updateIndividualFilterState();
		break;
		case "filter3_state":
			filter3_state.value=info;
			updateIndividualFilterState();
		break;
    };
};

function updateIndividualFilterState(){
	if(!filter3_state.isActive() && properties.filterOrder==1) properties.showPanelToggleButtons=true;
	else if(!filter3_state.isActive() && !filter2_state.isActive() && properties.filterOrder==0 && main_panel_state.isEqual(1)) properties.showPanelToggleButtons=true;
	else if (properties.filterOrder!=2) properties.showPanelToggleButtons=false;
	else properties.showPanelToggleButtons=true;
	if((!filter1_state.isActive() && properties.filterOrder==1) || (!filter1_state.isActive() && !filter2_state.isActive() && properties.filterOrder==2)) {
		browser_refresh_required=true;
		brw.populate(is_first_populate = true,17);
	}
}

// TOggle buttons -------------------------------------
//Mouse events
var cur_btn = null;
var g_down = false;

function SimpleButton(x, y, w, h, text, tooltip_text, fonClick, fonDbleClick, N_img, H_img, state,opacity) {
    this.state = state ? state : ButtonStates.normal;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.text = text;
    this.fonClick = fonClick;
    this.fonDbleClick = fonDbleClick;
    this.N_img = N_img;
    this.H_img = H_img;
	this.opacity = opacity;
	if (typeof opacity == "undefined") this.opacity = 255;
	else this.opacity = opacity;
	this.tooltip_activated = false;
    this.tooltip_text = tooltip_text;
    this.containXY = function (x, y) {
        return (this.x <= x) && (x <= this.x + this.w) && (this.y <= y) && (y <= this.y + this.h);
    }
    this.changeState = function (state) {
        var old_state = this.state;
        this.state = state;
		if(old_state!=ButtonStates.hover && this.state==ButtonStates.hover) g_cursor.setCursor(IDC_HAND, this.text);
		else g_cursor.setCursor(IDC_ARROW,21);
        return old_state;
    }
    this.draw = function (gr) {
        if (this.state == ButtonStates.hide) return;
        b_img=this.N_img;
        switch (this.state)
        {
        case ButtonStates.normal:
            b_img=this.N_img;
            break;
        case ButtonStates.hover:
			b_img=this.H_img;
            g_cursor.setCursor(IDC_HAND, this.text);
            break;
        case ButtonStates.down:
            break;

        case ButtonStates.hide:
            return;
        }
        switch (this.state)
        {
        case ButtonStates.hover:
        default:
			gr.DrawImage(b_img, this.x, this.y, b_img.Width, b_img.Height, 0, 0, b_img.Width, b_img.Height,0,this.opacity);
            break;
        }

    }

    this.onClick = function () {
        this.fonClick && this.fonClick();
    }
    this.onDbleClick = function () {
        if(this.fonDbleClick) {this.fonDbleClick && this.fonDbleClick();}
    }
    this.onMouse = function (state,x,y) {
		switch(state){
			case 'lbtn_down':
				this.fonDown && this.fonDown();
			break;
			case 'lbtn_up':
				this.fonUp && this.fonUp();
				if (this.containXY(x, y) && this.state != ButtonStates.hide && !this.hide){
					this.changeState(ButtonStates.hover);
				}
			break;
			case 'dble_click':
				if(this.fonDbleClick) {this.fonDbleClick && this.fonDbleClick();}
				else this.onMouse('lbtn_up',x,y);
			break;
			case 'leave':
				if(this.tooltip_activated){
					this.tooltip_activated = false;
					g_tooltip.Deactivate();
				}
			break;
			case 'move':

				if(this.tooltip_text!='' && g_tooltip.activeZone != this.text){
					var tooltip_text = this.tooltip_text;
					g_tooltip.ActivateDelay(tooltip_text, x+10, y+20, globalProperties.tooltip_button_delay, 1200, false, this.text);
					this.tooltip_activated = true;
				} else if(this.tooltip_activated && this.state!=ButtonStates.hover && g_tooltip.activeZone == this.text){
					this.tooltip_activated = false;
					g_tooltip.Deactivate();
				}
			break;
		}
    }
}
function drawAllButtons(gr) {
    for (var i in buttons) {
        buttons[i].draw(gr);
    }
}

function chooseButton(x, y) {
    for (var i in buttons) {
        if (buttons[i].containXY(x, y) && buttons[i].state != ButtonStates.hide) return buttons[i];
    }
    return null;
}

function toggleFilterState(new_filters_state, save_previous_state){
	if(save_previous_state===true) {
		properties.savedFilterState = filters_panel_state.value;
		window.SetProperty("_PROPERTY: Saved filter state", properties.savedFilterState);
		window.NotifyOthers("save_filter_state",properties.savedFilterState);
	}
	filters_panel_state.setValue(new_filters_state);
	positionButtons();
	window.Repaint();
}
function setButtons(){
	buttons = {
		filtersToggle: new SimpleButton(18, 7, 35, 40, "filtersToggle", "Reduce Filters", function () {
			if(properties.savedFilterState>0 && properties.savedFilterState < filters_panel_state.max_value && !properties.displayToggleBtns) toggleFilterState(properties.savedFilterState);
			else toggleFilterState((!filters_panel_state.isActive())?1:filters_panel_state.value-1);
		},false,images.filters_decrease_icon,images.filters_decrease_hover_icon,ButtonStates.normal,255),
	}
}
function positionButtons(){
	buttons.filtersToggle.x=ww-45;
	buttons.filtersToggle.y=wh+PanelToggleButtons_height-30;
	if(properties.displayToggleBtns || filters_panel_state.isMaximumValue()){
		buttons.filtersToggle.changeState(ButtonStates.normal);
	} else {
		buttons.filtersToggle.changeState(ButtonStates.hide);
	}
}
function toggleWallpaper(wallpaper_state){
	wallpaper_state = typeof wallpaper_state !== 'undefined' ? wallpaper_state : !properties.showwallpaper;
	properties.showwallpaper = wallpaper_state;
	window.SetProperty("_DISPLAY: Show Wallpaper", properties.showwallpaper);
	on_colours_changed();
}
function toggleBlurWallpaper(wallpaper_blur_state){
	wallpaper_blur_state = typeof wallpaper_blur_state !== 'undefined' ? wallpaper_blur_state : !properties.wallpaperblurred;
	properties.wallpaperblurred = wallpaper_blur_state;
	window.SetProperty("_DISPLAY: Wallpaper Blurred", properties.wallpaperblurred);
	on_colours_changed();
}
function on_init() {
    window.DlgCode = 0x0004;

    get_font();
	g_filterbox = new oFilterBox();
	g_cursor = new oCursor();
	g_tooltip = new oTooltip('brw');
	g_tagswitcherbar = new oTagSwitcherBar();
    get_colors();
    get_metrics();
	setButtons();
	g_image_cache = new oImageCache();
	g_filterbox.reset_layout();
    g_active_playlist = plman.ActivePlaylist;
	g_resizing = new Resizing("libraryfilter",false,true,g_tagswitcherbar.default_height);
    switch(properties.tagMode) {
        case 1:
            properties.albumArtId = 0;
            break;
        case 2:
            properties.albumArtId = 4;
            break;
        case 3:
            properties.albumArtId = 5;
            break;
    };

    brw = new oBrowser("brw");
	brw.startTimer();
    pman = new oPlaylistManager("pman");

    g_filterbox.inputbox.visible = true;
    if(fb.IsPlaying) playing_track_playcount = TF.play_count.Eval();

};
on_init();
