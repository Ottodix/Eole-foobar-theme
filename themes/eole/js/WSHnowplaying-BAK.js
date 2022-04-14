var colors = {};
var properties = {
	panelName: 'WSHcoverpanel',
    enableDiskCache: window.GetProperty("COVER Disk Cache", true),
	showVisualization: window.GetProperty("Show Visualization", true),
	innerCircle: window.GetProperty("Show Inner Cirle", true),
	showTrackInfo: window.GetProperty("Show track info", false),
    random_function: window.GetProperty("Random function", "default"),
	darklayout: window.GetProperty("_DISPLAY: Main layout:Dark", true),
    minimode_dark_theme: window.GetProperty("MINIMODE dark theme", true),
    library_dark_theme: window.GetProperty("LIBRARY dark theme", true),
    visualization_dark_theme: window.GetProperty("VISUALIZATION dark theme", true),
    playlists_dark_theme: window.GetProperty("PLAYLISTS dark theme", false),
    bio_dark_theme: window.GetProperty("BIO dark theme", true),
    single_click_action: window.GetProperty("PROPERTY single_click_action", 0),
    dble_click_action: window.GetProperty("PROPERTY double click action", 0),
	deleteSpecificImageCache : window.GetProperty("COVER cachekey of covers to delete on next startup", ""),
	forcedarklayout: window.GetProperty("_DISPLAY: force dark layout", false),
	follow_cursor: window.GetProperty("_DISPLAY: cover follow cursor", false),
	circleMode: window.GetProperty("_DISPLAY: circle mode", true),
	doubleRowText: window.GetProperty("_DISPLAY: doubleRowText", false),
    showwallpaper: window.GetProperty("_DISPLAY: Show Wallpaper", false),
    wallpaperblurred: window.GetProperty("_DISPLAY: Wallpaper Blurred", true),
    wallpaperblurvalue: window.GetProperty("_DISPLAY: Wallpaper Blur Value", 1.05),
    wallpapermode: window.GetProperty("_SYSTEM: Wallpaper Mode", 0),
    wallpaperdisplay: window.GetProperty("_DISPLAY: Wallpaper 0=Filling 1=Adjust 2=Stretch", 0),
	showRating: window.GetProperty("_DISPLAY: showRating", true),
	tintOnHover : true,
	coverNoPadding : window.GetProperty("_DISPLAY: cover no padding", true),
	rawBitmap: false,
	panelFontAdjustement: 0,
	showInfos:true,
}
if(properties.single_click_action>1) properties.single_click_action=1;

var g_wallpaperImg = null;
var update_wallpaper = false;
var track_infos_height = 85;
var rating_height = 12;
var track_infos_margin_top = 0;
var visu_margin_left = 0;
var g_genre_cache = null;
var cover_path="";
var Visualization_top_m=18;
var height_bar_1,height_bar_2,height_bar_3;
var coef_bar_1, coef_bar_2, coef_bar_3;
var direction_bar_1,direction_bar_2,direction_bar_3;
var bar_margin = 4;
var bar_width=2;
var height_bar_max=20;
var bar_height_min=1;
var b_img;
var images = {};
var buttons = {};
var animationTimer = false;
var randomBtnTimer = false;
var animationStartTime = 0;
var animationCounter = 0;
var Randomsetfocus=false;
var border_top=1;
var border_right=1;
var border_bottom=0;
var border_left=0;
var g_avoid_on_focus_change = false;
var g_avoid_metadb_updated = false;
var focus_on_now_playing = false;
var nowplaying_cachekey = '';
var ww = 0,
    wh = 0;
var cur_btn = null;
var g_down = false;
var g_dble_click = false;

var Update_Required_function = "";
var rating_x, imgw = 19.5,
	imgh = imgw;
var is_hover_rating = false;
var rating_hover_id = false;
var rbutton = Array();
var img_rating_on, img_rating_off;
var rating_spacing = 0;

var g_dragndrop_x = 0;
var g_dragndrop_y = 0;
var g_dragndrop_timer = false;
var g_dragndrop_targetPlaylistId = -1;
timers = {
    waitForRandomization: false,
    SetRating: false,
    hideVolume: false,
};
g_tfo = {
	rating: fb.TitleFormat((globalProperties.use_ratings_file_tags ? "$meta(rating)" : "%rating%")),
	rating_album: fb.TitleFormat("%rating_album%"),
	title: fb.TitleFormat("$if2(%title%,)"),
	artist: fb.TitleFormat("$if2(%artist%,)"),
	album: fb.TitleFormat("$if(%album%,  |  %album%,)"),
	codec: fb.TitleFormat("%codec%"),
	playcount: fb.TitleFormat("$if2(%play_count%,0)"),
	bitrate: fb.TitleFormat("$if(%codec_profile%, | %codec_profile% | %bitrate%,  | %bitrate%)"),
	allinfos: fb.TitleFormat((globalProperties.use_ratings_file_tags ? "$meta(rating)" : "%rating%") + " ^^ $if2(%title%,) ^^ $if2(%artist%,) ^^ $if(%album%,  |  %album%,) ^^ $if2(%date%,?) ^^ %codec% ^^ $if2(%play_count%,0) ^^ $if(%codec_profile%, | %codec_profile%)$if(%bitrate%, | %bitrate%K)"),
}
function setButtons(){
	buttons = {
		Pause: new SimpleButton(ww/2-images.pause_img.Width/2,wh/2-images.pause_img.Height/2, images.pause_img.Width, 74, "Pause", "Resume Playback", function () {
			fb.PlayOrPause();
		},function () {
			fb.Pause();
		},images.pause_img,images.pause_img),
		Play: new SimpleButton(ww/2-images.pause_img.Width/2,wh/2-images.pause_img.Height/2, images.pause_img.Width, 74, "Play", "Play from there", function () {
			if(g_infos.tracklist){ 
				sendandplayPlaybackPlaylist(g_infos.tracklist);
			} else {
				plman.PlayingPlaylist = g_cover.playlistIndex;
				plman.SetPlaylistFocusItemByHandle(g_cover.playlistIndex, g_cover.metadb);
				plman.ActivePlaylist = g_cover.playlistIndex;		
				if(fb.IsPaused) fb.Stop();
				plman.FlushPlaybackQueue();
				fb.RunContextCommandWithMetadb("Add to playback queue", g_cover.metadb);
				fb.Play();
			}
		},function () {},images.play_img,images.play_img),
		NowPlaying: new SimpleButton(ww/2-images.pause_img.Width/2,wh/2-images.pause_img.Height/2, images.pause_img.Width, 74, "NowPlaying", "Show now playing", function () {
			window.NotifyOthers("FocusOnNowPlaying",fb.GetNowPlaying());
			on_notify_data("FocusOnNowPlaying",fb.GetNowPlaying())
		},function () {
			showNowPlaying(true);
		},images.nowplaying_img,images.nowplaying_img),
		Random: new SimpleButton( ww/2-images.pause_img.Width/2, wh/2-images.pause_img.Height/2, 74, 74, "Random", "Play randomly", function () {
			play_random(properties.random_function);
		},null,images.random_img_mini,images.random_img_mini)
	}
}

function adaptButtons(){
	if(layout_state.isEqual(0)) {
		buttons.Random.N_img = images.random_img;
		buttons.Random.H_img = images.random_img;
		buttons.Random.D_img = images.random_img;
		buttons.Pause.N_img = images.pause_img;
		buttons.Pause.H_img = images.pause_img;
		buttons.Pause.D_img = images.pause_img;
	} else {
		buttons.Random.N_img = images.random_img_mini;
		buttons.Random.H_img = images.random_img_mini;
		buttons.Random.D_img = images.random_img_mini;
		buttons.Pause.N_img = images.mini_mini_pause_img;
		buttons.Pause.H_img = images.mini_mini_pause_img;
		buttons.Pause.D_img = images.mini_mini_pause_img;
	}
	buttons.Play.N_img = images.play_img;
	buttons.Play.H_img = images.play_img;
	buttons.Play.D_img = images.play_img;
	buttons.NowPlaying.N_img = images.nowplaying_img;
	buttons.NowPlaying.H_img = images.nowplaying_img;
	buttons.NowPlaying.D_img = images.nowplaying_img;
}
function positionButtons(){
    for (var i in buttons) {
		buttons[i].w = g_cover.w_resized;
		buttons[i].h = g_cover.h_resized;
		buttons[i].x = g_cover.x;
		buttons[i].y = g_cover.y;
    }
}
function SimpleButton(x, y, w, h, text, tooltip_text, fonClick, fonDbleClick, N_img, H_img, state) {
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
	this.tooltip_activated = false;
    this.tooltip_text = tooltip_text;
	
    this.containXY = function (x, y) {
        return (this.x <= x) && (x <= this.x + this.w) && (this.y <= y) && (y <= this.y + this.h);
    }
    this.changeState = function (state) {
        var old = this.state;
        this.state = state;
        return old;
    }
	this.setButtonState = function () {
        if(this.text=='Random'){
            if((!Randomsetfocus) || !fb.IsPlaying){
                this.state = ButtonStates.hide;return;
            } else this.state = ButtonStates.normal;
        } else if(this.text=='Play'){
            if(g_cover.isPlaying() || !g_cover.isHover || Randomsetfocus || g_cover.playlistIndex<0 || !g_cover.metadb || (properties.single_click_action!=0 && fb.IsPlaying)){
                this.state = ButtonStates.hide;return;
            } else this.state = ButtonStates.normal;
        } else if(this.text=='NowPlaying'){
            if((properties.single_click_action!=1) || !g_cover.isHover  || Randomsetfocus || g_cover.playlistIndex<0 || !g_cover.metadb || !fb.IsPlaying){
                this.state = ButtonStates.hide;return;
            } else this.state = ButtonStates.normal;
        } else if(this.text=='Pause'){
			this.tooltip_text = fb.IsPaused?"Resume Playback":"Pause playback";
			var play_pause = (fb.IsPaused || (g_cover.isPlaying() && g_cover.isHover));
            if(!play_pause || Randomsetfocus || !g_cover.isPlaying() || properties.single_click_action!=0){
                this.state = ButtonStates.hide;
            } else {
				if(this.state!=ButtonStates.hover)
					this.state = ButtonStates.normal;
				if(!play_pause){
					opacity=0;
                    this.state = ButtonStates.normal;
				}
			}
        }
	}
    this.draw = function (gr) {
        b_img=this.N_img;
        var opacity=255;

		this.setButtonState();
        switch (this.state)
        {
			case ButtonStates.normal:
				b_img=this.N_img;
				break;
			case ButtonStates.hover:
				b_img=this.H_img;
				break;
			case ButtonStates.down:
				break;
			case ButtonStates.hide:
				return;
        }

        gr.DrawImage(b_img, this.x+Math.round((this.w-b_img.Width)/2), this.y+Math.round((this.h-b_img.Height)/2), b_img.Width, b_img.Height, 0, 0, b_img.Width, b_img.Height,0,opacity);
    }

    this.onClick = function () {
        this.fonClick && this.fonClick();
		if(this.tooltip_activated) g_tooltip.Deactivate();
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
					g_tooltip.ActivateDelay(this.tooltip_text, x+10, y+20, globalProperties.tooltip_button_delay, 1200, false, this.text);
					this.tooltip_activated = true;
				} else if(this.tooltip_activated && this.state!=ButtonStates.hover && g_tooltip.activeZone == this.text){
					this.tooltip_activated = false;
					g_tooltip.Deactivate();
				}
			break;
		}
    }
}
function setButtonStates(gr) {
    for (var i in buttons) {
        buttons[i].setButtonState();
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
function calculate_visu_margin_left(){
	//if(properties.showVisualization && g_cover.isPlaying()) {
		visu_margin_left = ww/2 - 2 - bar_margin;
	//}
	//else visu_margin_left = 0;
}

function on_paint(gr) {

	if(Update_Required_function!="") {
		eval(Update_Required_function);
		Update_Required_function = "";
	}
	if(update_wallpaper && properties.showwallpaper && properties.wallpapermode == 0){
		g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
		update_wallpaper = false;
	}

	// draw background under playlist
	gr.FillSolidRect(0, 0, ww, wh, colors.normal_bg);
	if(fb.IsPlaying && g_wallpaperImg && properties.showwallpaper) {
		gr.DrawImage(g_wallpaperImg, 0, 0, ww, wh, 0, 0, g_wallpaperImg.Width, g_wallpaperImg.Height);
		gr.FillSolidRect(0, 0, ww, wh, (properties.wallpaperblurred)?colors.wallpaper_overlay_blurred:colors.wallpaper_overlay);
	} else if(g_wallpaperImg && properties.showwallpaper) {
		gr.DrawImage(g_wallpaperImg, 0, 0, ww, wh, 0, 0, g_wallpaperImg.Width, g_wallpaperImg.Height);
		gr.FillSolidRect(0, 0, ww, wh, (properties.wallpaperblurred)?colors.wallpaper_overlay_blurred:colors.wallpaper_overlay);
	}

	if(!g_cover.isSetArtwork()) {
		try{
			tracktype = TrackType(fb.GetNowPlaying());
			if(tracktype == 3) g_cover.setArtwork(globalProperties.stream_img,true,true)
			else g_cover.setArtwork(globalProperties.nocover_img,true,true);
		} catch (e){g_cover.setArtwork(globalProperties.nocover_img,true,true)}
	}
	setButtonStates();
	g_cover.draw(gr,0,0);
	
	drawAllButtons(gr);

	if(trackinfostext_state.isActive()) g_infos.draw(gr, 0, wh-track_infos_height-(properties.showRating?rating_height:0));
	if(getTrackInfosState()==1){
		var side_padding = 10;
		gr.FillGradRect(side_padding, wh - 1, ww - side_padding*2, 1, 0, RGBA(0, 0, 0, 0), colors.border, 0.5);
	} else {
		//gr.FillSolidRect(0, 1, ww, 1, colors.sidesline);
		var side_padding = 5;
		gr.FillGradRect(side_padding, 0, ww - side_padding*2, 1, 0, RGBA(0, 0, 0, 0), colors.border, 0.5);		
	}

	if(g_resizing.showResizeBorder()) gr.FillSolidRect(0, 0, 1, wh, colors.dragdrop_marker_line);
	else gr.FillSolidRect(0, 0, 1, wh, colors.sidesline);
}
function on_size(w, h) {
    ww = w;
    wh = h;
	calculate_visu_margin_left();
	g_cover.setSize(ww,wh-(trackinfostext_state.isActive()?track_infos_height+(properties.showRating?rating_height:0):0));

	g_infos.setSize(w,track_infos_height+(properties.showRating?rating_height:0));

	rating_spacing = Math.min(10, (ww-imgw*5) / 5);

	// set wallpaper
	if(properties.showwallpaper){
		g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
	} else update_wallpaper = true;

	var img_rating_w = imgw * 5 + rating_spacing * 4;
	rating_x = (ww - img_rating_w) / 2;
	for(var i = 0; i < rbutton.length; i++){
		index=i-1;
		rbutton[i].setx(rating_x + imgw * index + rating_spacing * index);
	}
	TextBtn_info.setSize(0, wh-track_infos_height-rating_height, ww, track_infos_height+rating_height);
}

function on_mouse_lbtn_up(x, y, m) {
    g_down = false;
	g_resizing.on_mouse("lbtn_up", x, y, m);
    if (cur_btn && cur_btn.state!=ButtonStates.hide && !g_dble_click && g_cover.isHover) {
        cur_btn.onClick();
        window.Repaint();
    }
	for (var i = 1; i < rbutton.length + 1; i++) {
		rbutton[i - 1].MouseUp(x, y, i);
	}
    g_dble_click=false;
}
function on_mouse_lbtn_down(x, y, m) {
	var isResizing = g_resizing.on_mouse("lbtn_down", x, y, m);
	if(!isResizing){
		g_down = true;
		click_on_btn = false;
		cur_btn = chooseButton(x, y);
		if (cur_btn && cur_btn.state!=ButtonStates.hide && g_cover.isHover) {
			cur_btn.changeState(ButtonStates.down);
			click_on_btn=true;
			window.Repaint();
		}
	}
}

function on_mouse_lbtn_dblclk(x, y) {
    g_dble_click=true;
	if(fb.IsPlaying) {
		switch(true){
			case (properties.dble_click_action==0):
				fb.Pause();
				window.NotifyOthers("stopFlashNowPlaying",true);
			break;
			case (properties.dble_click_action==1):
				showNowPlaying(true);
			break;
			case (properties.dble_click_action==2):
				if(!g_cover.isFiller()) openCoverFullscreen(g_cover.metadb);
			break;
			case (properties.dble_click_action==3):
				fb.RunContextCommandWithMetadb("Open containing folder", fb.GetNowPlaying(), 8);
			break;
			case (properties.dble_click_action==4):
				window.NotifyOthers('toggleLayoutMode',true);
			break;
			case (properties.dble_click_action==5):
				if (g_infos.metadb && TextBtn_info.isXYInButton(x, y)) {
					fb.RunContextCommandWithMetadb("Properties", g_infos.metadb);
				}
			break;
		}
	}
}

function on_mouse_move(x, y, m) {
    if(g_cursor.x == x && g_cursor.y == y) return;
	g_cursor.onMouse("move", x, y, m);
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
		g_cover.onMouse("move", x, y, m);
		g_infos.onMouse("move", x, y, m);
		if(properties.showRating){
			old_rating_hover_id = rating_hover_id;
			is_hover_rating_old = is_hover_rating;
			is_hover_rating = false;
			for (var i = 1; i < rbutton.length + 1; i++) {
				if(rbutton[i - 1].MouseMove(x, y, i)) is_hover_rating = true;
			}
			if(!is_hover_rating) rating_hover_id = false;
			if(is_hover_rating_old!=is_hover_rating || old_rating_hover_id!=rating_hover_id) window.Repaint();
		}
	}
}

function on_mouse_leave() {
	g_resizing.on_mouse("leave", -1, -1);
	g_cursor.onMouse("leave", 0, 0);
	g_cover.onMouse("leave", 0, 0);
    g_down = false;
    if (cur_btn) {
        cur_btn.changeState(ButtonStates.normal);
        window.Repaint();
    }
	g_tooltip.Deactivate();
	g_infos.onMouse("leave", -1, -1);
	if(rating_hover_id){
		rating_hover_id = false;
		window.Repaint();
	}
}
function on_playback_new_track(metadb) {
	if (metadb)	{
		g_cover.getArtwork(metadb, true, plman.PlayingPlaylist);
		if(properties.showwallpaper && properties.wallpapermode == 0) {
			old_cachekey = nowplaying_cachekey;
			nowplaying_cachekey = process_cachekey(metadb);
			if(old_cachekey!=nowplaying_cachekey || nowplaying_cachekey=="undefined") {
				g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, metadb);
			}
		};
		g_infos.on_item_focus_change(plman.PlayingPlaylist,-1,-1,metadb);
	}
	window.Repaint();
}
/*function on_playlist_switch() {
	on_item_focus_change(plman.ActivePlaylist);
}*/

function on_playback_stop(reason) {
	switch(reason) {
	case 0: // user stop
	case 1: // eof (e.g. end of playlist)
		g_cover.refreshCurrent(false);
		// update wallpaper
		nowplaying_cachekey = '';
		if(properties.showwallpaper && properties.wallpapermode == 0) {
			g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, null);
		};
		window.Repaint();
		break;
	case 2: // starting_another (only called on user action, i.e. click on next button)
		break;
	};
}
function on_playback_pause(){
	window.Repaint();
}
//=================================================// Drag'n'Drop Callbacks
function on_drag_enter() {
};

function on_drag_leave() {
};

function on_drag_over(action, x, y, mask) {
    if(x == g_dragndrop_x && y == g_dragndrop_y) return true;

	try{
		if(fb.IsPlaying || fb.IsPaused) action.Text = "Play next";
		else action.Text = "Play";
	} catch(e){}

    g_dragndrop_x = x;590

    g_dragndrop_y = y;
};

function on_drag_drop(action, x, y, mask) {
	action.Effect = 1;
	if(fb.IsPlaying || fb.IsPaused) {
		g_dragndrop_targetPlaylistId = plman.PlayingPlaylist;
		let playing_item_location = plman.GetPlayingItemLocation();
		if (playing_item_location.IsValid) {
			var target_index = playing_item_location.PlaylistItemIndex+1;
		} else var target_index = plman.PlaylistItemCount(g_dragndrop_targetPlaylistId);
		action.Playlist = g_dragndrop_targetPlaylistId;
		action.Base = target_index;
		action.ToSelect = false;
	} else {
		g_dragndrop_targetPlaylistId = getPlaybackPlaylist();
		plman.PlayingPlaylist = g_dragndrop_targetPlaylistId;
		plman.ClearPlaylist(g_dragndrop_targetPlaylistId);
		plman.PlayingPlaylist=g_dragndrop_targetPlaylistId;
		var target_index = plman.PlaylistItemCount(g_dragndrop_targetPlaylistId);
		action.Playlist = g_dragndrop_targetPlaylistId;
		action.Base = target_index;
		action.ToSelect = false;
		g_dragndrop_timer = setTimeout(function(){
			plman.ExecutePlaylistDefaultAction(g_dragndrop_targetPlaylistId, 0);
			fb.Stop();fb.Play();
			clearTimeout(g_dragndrop_timer);
			g_dragndrop_timer = false;
        },50);
	}
};
//=================================================// Cover Tools
oImageCache = function () {
    this.cachelist = Array();
    this.hit = function (metadb, is_playing) {
		var img;
		old_cachekey = g_cover.cachekey;
		g_cover.cachekey = process_cachekey(metadb);
		try{img = this.cachelist[g_cover.cachekey];}catch(e){}
		if (typeof(img) == "undefined" || img == null && globalProperties.enableDiskCache ) {
			cache_filename = check_cache(metadb, 0, g_cover.cachekey);
			// load img from cache
			if(cache_filename) {
				img = load_image_from_cache_direct(cache_filename);
				cover_path = cache_filename;
			} else get_albumArt_async(metadb,AlbumArtId.front, g_cover.cachekey, false, false, false, {isplaying:is_playing});
		} else if(nowPlaying_cachekey==old_cachekey) return "unchanged";
		return img;
    };
    this.reset = function(key) {
        this.cachelist[key] = null;
    };
	this.resetAll = function(){
		this.cachelist = Array();
	};
    this.resetCache = function () {
		this.cachelist = Array();
	}	
    this.resetMetadb = function(metadb) {
        this.cachelist[process_cachekey(metadb)] = null;
    };
};

oCover = function() {
	this.w = 0;
	this.h = 0;
	this.x = 0;
	this.y = 0;
	this.w_resized = 0;
	this.h_resized = 0;
	this.resized = false;
	this.mask_applied = false;
	this.keep_proportion = true;
	this.artwork = null;
	this.tintDrawed = false;
	this.filler = false;
	this.buttons_positioned = false;
	this.padding_default = Array(20,20,0,20);
	this.padding_norating = Array(20,7,0,7);	
	this.padding_noinfos = Array(24,24,24,24);
	this.nopadding = Array(0,0,0,0);	
	this.repaint = function() {window.Repaint()}
	this.borders = true;
	this.is_playing = false;
	this.metadb = false;
	this.playlistIndex = -1;
	this.itemIndex = -1;
	this.playing_metadb = false;
	this.playing_cachekey = "";
	this.cachekey = "";
	this.coverMask = false;
	this.coverMaskInnerCircle = false;
	this.circle_inner_padding = 0;
	this.visuY = Visualization_top_m;
	this.resize_ratio = 0;
	this.btn_shadow = false;
	this.isHoverBtn = false;
	this.isSetArtwork = function() {
		return isImage(this.artwork);
	}
	this.isPlaying = function() {
		return this.is_playing;
	}
	this.isFiller = function() {
		return this.filler;
	}
	this.isValid = function() {
		return (this.metadb!=null && this.metadb!==false);
	}
	this.setPlaying = function(state, metadb) {
		//if(state==this.is_playing) return;
		if(state===false){
			this.is_playing = false;
		} else {
			this.is_playing = true;
			this.playing_metadb = metadb;
			this.playing_cachekey = this.cachekey;
		}
		window.NotifyOthers("sidebar_isplaying",properties.showVisualization && this.is_playing);
	}
	this.on_item_focus_change = function(playlistIndex, from, to, metadb) {
		var itemIndex = to;
		if ((!properties.follow_cursor && (fb.IsPlaying || fb.IsPaused)) || (g_avoid_on_focus_change && !focus_on_now_playing) || to<0) {
			g_avoid_on_focus_change = false;
			return;
		} else if(!metadb){
			if (to>-1 && playlistIndex>-1){
				metadb = plman.GetPlaylistItems(playlistIndex)[to];
			} else {
				metadb = fb.GetFocusItem();
				itemIndex = plman.GetPlaylistFocusItemIndex(plman.ActivePlaylist);
				if(!playlistIndex) playlistIndex = plman.ActivePlaylist;
				if(!metadb){
					metadb = null;
					window.Repaint();
				}
			}
		}
		if (isValidHandle(metadb)) {
			this.getArtwork(metadb, undefined, playlistIndex, itemIndex);
			window.Repaint();
		}
	}
	this.setArtwork = function(image, resize, filler, is_playing, metadb, cachekey, playlistIndex) {
		this.filler = typeof filler !== 'undefined' ? filler : false;
		if(typeof cachekey !== 'undefined') this.cachekey = cachekey;
		if(typeof playlistIndex !== 'undefined') this.playlistIndex = playlistIndex;
		this.resized = false;
		this.artwork = image;
		this.setPlaying(is_playing===true, metadb);
		this.metadb = metadb;
		if(!isImage(image)) return;
		if(resize && this.w>0 && this.h>0) {
			this.resize();
		}
	}
	this.setVisualisationY = function(){
		this.visuY = this.h/2 + Visualization_top_m+Math.round((this.h_resized-this.h)/2)+12;
		positionButtons();
	}
	this.getArtwork = function(metadb, is_playing, playlistIndex, itemIndex) {
		var is_playing_old = this.is_playing;
		this.playlistIndex = playlistIndex;
		this.itemIndex = itemIndex;
		if(typeof is_playing == "undefined"){
			var is_playing_new = false;
			if(isValidHandle(this.playing_metadb) && isValidHandle(metadb) && metadb.Compare(this.playing_metadb) && fb.IsPlaying) {
				 var is_playing_new = true;
			}
			else if(this.playing_cachekey!=""){
				//this.cachekey = process_cachekey(metadb);
				//if(this.playing_cachekey == this.cachekey)
				//	var is_playing_new = true;
			}
		} else var is_playing_new = is_playing;
		this.setPlaying(is_playing_new, metadb);
		if(this.is_playing!=is_playing_old) this.ResetMask();
		if(this.metadb && this.metadb.Compare(metadb)) {
			if(this.is_playing && properties.showVisualization) this.setVisualisationY();
			return;
		}
		this.metadb = metadb;
		var img = g_image_cache.hit(metadb,this.is_playing);
		if(img=="unchanged") {
			//if(this.playing_cachekey!="" && this.playing_cachekey == this.cachekey) {
				//this.setPlaying(true, this.metadb);
			//}
			if(this.is_playing && properties.showVisualization) this.setVisualisationY();
			return;
		}
		
		if(isImage(img) && !globalProperties.loaded_covers2memory) g_image_cache.resetAll();
		this.setArtwork(img,true,false,this.is_playing, metadb);
	}
	this.reset = function(reset_artwork) {
		if(reset_artwork) {
			this.artwork = null;
			this.metadb = null;		
		}
		this.artwork_resized = null;
		this.resized = false;
		this.artwork_mask = null;
		this.mask_applied = false;
	}
    this.refresh = function (metadb, call_delete_file_cache, cachekey, reset_artwork, is_playing) {
		cachekey = typeof cachekey !== 'undefined' ? cachekey : process_cachekey(metadb);
		reset_artwork = typeof reset_artwork !== 'undefined' ? reset_artwork : true;
		call_delete_file_cache = typeof call_delete_file_cache !== 'undefined' ? call_delete_file_cache : false;
		if(globalProperties.enableDiskCache && call_delete_file_cache) {
			delete_file_cache(metadb,0, cachekey);
			g_image_cache.resetMetadb(metadb);
		}
		this.reset(reset_artwork);
		this.cachekey = "";
		this.getArtwork(metadb, is_playing);
		if(isImage(this.artwork)) this.resize();
		window.Repaint();
	}
	this.refreshCurrent = function (is_playing, reset_artwork) {
		reset_artwork = typeof reset_artwork !== 'undefined' ? reset_artwork : false;		
		this.refresh(this.metadb, false, this.playing_cachekey, reset_artwork, is_playing);
	}
	this.resize = function(w,h) {
		var w = typeof w !== 'undefined' ? w : this.w;
		var h = typeof h !== 'undefined' ? h : this.h;

		//w = w - this.padding[1] - this.padding[3];
		//h = h - this.padding[0] - this.padding[2];

		if(globalProperties.keepProportion) {
			if(this.artwork.Height>=this.artwork.Width) {
				
				this.resize_ratio = this.artwork.Width / this.artwork.Height;
				//this.h = Math.min(h,w);
			//	this.w = this.h * this.resize_ratio;
				this.w_resized = this.h * this.resize_ratio;
				this.h_resized = this.h;
			} else {
				this.resize_ratio = this.artwork.Height / this.artwork.Width;
				//this.w = w;
				//this.h = w * this.resize_ratio;
				this.h_resized = h * this.resize_ratio;
				this.w_resized = h;
			}
		} else {
			this.w = h;
			this.h = h;
			this.w_resized = h;
			this.h_resized = h;
		}
		this.artwork_resized = FormatCover(this.artwork,this.w_resized+2,this.h_resized+2,properties.rawBitmap);
		this.resized = true;
		this.mask_applied = false;
		if(this.is_playing && properties.showVisualization) this.setVisualisationY();
		this.buttons_positioned = false;
	}
    this.setSize = function(w, h) {
		if(properties.showRating && trackinfostext_state.isActive()){
			this.padding = this.padding_default;
		} else if(trackinfostext_state.isActive()){
			this.padding = this.padding_norating;
		} else {
			if(!properties.coverNoPadding) this.padding = this.padding_noinfos;
			else this.padding = this.nopadding;
		}
		this.w = w - this.padding[1] - this.padding[3];
		this.h = h - this.padding[0] - this.padding[2];		
		if(this.isSetArtwork()) {
			this.resize();
		}
		this.setVisualisationY();
    };
    this.ResetMask = function(){
		this.coverMask = false;
		this.coverMaskInnerCircle = false;
		this.mask_applied = false;
	}
    this.DefineCircleMask = function(size, height){
		var Mimg = gdi.CreateImage(size, size);
		gb = Mimg.GetGraphics();
		gb.SetSmoothingMode(2);
		gb.FillSolidRect(0, 0, size, size, GetGrey(255));
		gb.FillEllipse(1, 1, size-2, size-2, GetGrey(0));
		Mimg.ReleaseGraphics(gb);
		this.coverMask = Mimg;
	}
	this.createCoverShadow = function(cover_width, cover_height, color, radius, circleMode){
		var shadow = gdi.CreateImage(cover_width, cover_height);
		var gb = shadow.GetGraphics();
		var radius = Math.floor(Math.min(cover_width/2,cover_height/2,radius));

		if(circleMode) gb.FillEllipse(radius, radius, cover_width-radius*2, cover_height-radius*2, color);
		else gb.FillSolidRect(radius, radius, cover_width-radius*2, cover_height-radius*2, color);

		shadow.ReleaseGraphics(gb);
		shadow.StackBlur(radius+30);
		return shadow;
	};
	this.draw = function(gr, x, y) {
		this.x = Math.round(ww/2-this.w_resized/2);
		if(trackinfostext_state.isActive())
			this.y = y + this.padding[0] -1;
		else
			this.y = Math.round(wh/2-this.h_resized/2);
		
		if(!this.buttons_positioned){
			positionButtons();
			this.buttons_positioned = true;
		}

		if(this.resized) var cover_to_draw = this.artwork_resized;
		else var cover_to_draw = this.artwork;

		if(properties.circleMode){
			if(!this.mask_applied){
				width = cover_to_draw.Width;
				height = cover_to_draw.Height;
				if(!this.coverMask) this.DefineCircleMask(width,height);
				var mask_to_apply = this.coverMask;
				this.artwork_mask = cover_to_draw.Clone(0, 0, width, height);
				if(width!=mask_to_apply.Width || height!=mask_to_apply.Height) mask_to_apply = mask_to_apply.Resize(width, height, 7);
				this.artwork_mask.ApplyMask(mask_to_apply);
				cover_to_draw = this.artwork_mask;
				this.mask_applied = true;
			} else cover_to_draw = this.artwork_mask;
		}

		if(this.resized) {
			this.drawn_h = this.h_resized;
			this.drawn_w = this.w_resized;
			gr.DrawImage(cover_to_draw, this.x, this.y,this.w_resized, this.h_resized, 1, 1, cover_to_draw.Width-2, cover_to_draw.Height-2);
		} else {
			this.drawn_h = this.h;
			this.drawn_w = this.w;
			gr.DrawImage(cover_to_draw, this.x, this.y, this.w, this.h, 0, 0, cover_to_draw.Width, cover_to_draw.Height);
		}
		if(this.borders && !properties.coverNoPadding){
			if(properties.circleMode) gr.DrawEllipse(this.x, this.y, this.drawn_w, this.drawn_h, 1.0, colors.border_covers);
			else gr.DrawRect(this.x, this.y, this.drawn_w-1, this.drawn_h-1, 1, colors.border_covers);
		}
		if(properties.tintOnHover && (this.isHover || buttons.Pause.state != ButtonStates.hide || buttons.Random.state != ButtonStates.hide)){
			if(properties.circleMode) {
				gr.SetSmoothingMode(2);
				gr.FillEllipse(this.x, this.y, this.drawn_w, this.drawn_h, colors.overlay_on_hover);
				gr.SetSmoothingMode(0);
			} else gr.FillSolidRect(this.x, this.y, this.drawn_w, this.drawn_h, colors.overlay_on_hover);
			this.tintDrawed = true;
		}
		if(((g_cover.isPlaying() || (Randomsetfocus && fb.IsPlaying)) && !(fb.IsPlaying && !fb.IsPaused && !Randomsetfocus && !properties.showVisualization)) || this.isHover) {
			if(!this.btn_shadow) this.btn_shadow = this.createBtnShadow(this.drawn_w, this.inner_circle_size, colors.btn_shadow, 50);
			gr.DrawImage(this.btn_shadow, this.x, this.y, this.drawn_w, this.drawn_w, 0, 0, this.btn_shadow.Width, this.btn_shadow.Height);
		}
    };
	this.createBtnShadow = function (sizeCover, sizeInner, color, radius){
		var shadow = gdi.CreateImage(sizeCover, sizeCover);
		var gb = shadow.GetGraphics();
			gb.FillEllipse(Math.round(sizeCover/2-sizeInner/2), Math.round(sizeCover/2-sizeInner/2), sizeInner, sizeInner, color);
		shadow.ReleaseGraphics(gb);
		shadow.StackBlur(radius);
		return shadow;
	};
    this.onMouse = function (state, x, y, m) {
		switch(state){
			case 'lbtn_down':
				this.down_x = x;
				this.down_y = y;
			break;
			case 'lbtn_up':
				this.up_x = x;
				this.up_y = y;
			break;
			case 'dble_click':
				this.down_x = x;
				this.down_y = y;
			break;
			case 'move':
				if(x>this.x && x<this.x+this.w_resized && y>this.y && y<this.y+this.h_resized && g_cover.isValid()){
					g_cursor.setCursor(IDC_HAND,"coverpanel");
					var repaint = false;
					if(!this.isHover){
						this.isHover = true;
						if(properties.tintOnHover && !this.tintDrawed){
							repaint = true;
						}
					}

					for (var i in buttons) {
						if (buttons[i].containXY(x, y) && buttons[i].state != ButtonStates.hide && !buttons[i].hide) {
							buttons[i].changeState(ButtonStates.hover);
							buttons[i].onMouse('move',x,y);
							if(!this.isHoverBtn) repaint = true;
							this.isHoverBtn = buttons[i];
						} else {
							buttons[i].changeState(ButtonStates.normal);
							buttons[i].onMouse('leave',-1,-1);
							if(this.isHoverBtn) repaint = true;
						}
					}
				} else if(g_cursor.getActiveZone()=="coverpanel") {
					g_cursor.setCursor(IDC_ARROW,17);
					this.isHover = false;
					this.tintDrawed = false;
					if(this.isHoverBtn) this.isHoverBtn.onMouse('leave',-1,-1);
					this.isHoverBtn = false;
					repaint = true;
				}
				if(repaint) window.Repaint();
			break;
			case 'leave':
				if(this.isHover){
					g_cursor.setCursor(IDC_ARROW,18);
					this.isHover = false;
					this.tintDrawed = false;
					if(this.isHoverBtn) this.isHoverBtn.onMouse('leave',-1,-1);
					this.isHoverBtn = false;
					window.Repaint();
				}
			break;
		}
    }
};
function on_get_album_art_done(metadb, art_id, image, image_path) {
    cover_path = image_path;
	if(image){
		cachekey = process_cachekey(metadb);
		save_image_to_cache(image, -1, cachekey, metadb);
		g_cover.setArtwork(image,true,false);
		g_image_cache.addToCache(image,cachekey,globalProperties.thumbnailWidthMax);
	}
	else g_cover.reset();
    window.Repaint();
}
function setDarkLayout(){
	if(properties.forcedarklayout) properties.darklayout = true;
	else if(layout_state.isEqual(0)) {
		switch(main_panel_state.value){
			case 0:
				properties.darklayout = properties.library_dark_theme;
			break;
			case 1:
				properties.darklayout = properties.playlists_dark_theme;
			break;
			case 2:
				properties.darklayout = properties.bio_dark_theme;
			break;
			case 3:
				properties.darklayout = properties.visualization_dark_theme;
			break;
		}
	} else properties.darklayout = properties.minimode_dark_theme;
}
function initbutton() {
	for(var i = 0; i < 6; i++){
		rbutton[i] = new ButtonUI_R();
	}
}
function on_layout_change() {
	setDarkLayout();

    if(!fb.IsPlaying) {
		//g_cover.reset();
    }
	get_colors();
	get_images();
	adaptButtons();
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
		case "g_avoid_on_focus_change":
			g_avoid_on_focus_change = info;
			timers.on_focus_change = setTimeout(function() {
				g_avoid_on_focus_change = false;
				timers.on_focus_change && clearTimeout(timers.on_focus_change);
				timers.on_focus_change = false;
			}, 150);
			break;
		case "resizingleft_rightsidebar":
			g_resizing.show_resize_border = info;
			window.Repaint();
			break;
		case "rigthsidebar_shownowplaying":
			focus_on_now_playing = true;
			if(fb.IsPlaying) on_playback_new_track(fb.GetNowPlaying());
			focus_on_now_playing = false;
			break;
		case "trigger_on_focus_change_album":
			metadb = new FbMetadbHandleList(info.metadb);
			if(info.tracklist) var tracklist = new FbMetadbHandleList(info.tracklist);
			else var tracklist = null;
			if(info.cover_img==null) {
				g_cover.on_item_focus_change(info.playlist, -1, info.trackIndex, metadb[0]);
				if (properties.follow_cursor) {
					g_infos.updateInfos(info.firstRow, info.secondRow+" | "+info.length+' | '+info.totalTracks, info.genre, metadb, true, undefined, tracklist)
				} else {
					g_infos.on_item_focus_change(info[0], -1, info[1], metadb[0], tracklist);
				}
			} else {
				cover_img = new GdiBitmap(info.cover_img);
				g_cover.setArtwork(cover_img, true, false, false, metadb[0], info.cachekey, info.playlist);
				if (properties.follow_cursor) {
					g_infos.updateInfos(info.firstRow, info.secondRow+" | "+info.length+' | '+info.totalTracks, info.genre, metadb, true, undefined, tracklist)
				} else {
					g_infos.on_item_focus_change(info[0], -1, info[1], metadb[0], tracklist);
				}
			}
			window.Repaint();
			g_avoid_on_focus_change = true;
			timers.on_focus_change = setTimeout(function() {
				g_avoid_on_focus_change = false;
				timers.on_focus_change && clearTimeout(timers.on_focus_change);
				timers.on_focus_change = false;
			}, 150);
			break;
		case "trigger_on_focus_change":
			try{
				metadb = new FbMetadbHandleList(info[2]);
				g_infos.on_item_focus_change(info[0], -1, info[1], metadb[0]);
				g_cover.on_item_focus_change(info[0], -1, info[1], metadb[0]);
			} catch(e){
				g_infos.on_item_focus_change(info[0], -1, info[1]);
				g_cover.on_item_focus_change(info[0], -1, info[1]);
			}
			g_avoid_on_focus_change = true;
			timers.on_focus_change = setTimeout(function() {
				g_avoid_on_focus_change = false;
				timers.on_focus_change && clearTimeout(timers.on_focus_change);
				timers.on_focus_change = false;
			}, 150);
			break;
		case "Right_panel_follow_cursor":
			properties.follow_cursor = info;
			window.SetProperty("_DISPLAY: cover follow cursor", properties.follow_cursor);
			if(properties.follow_cursor) g_infos.on_item_focus_change(-1,-1,-1,fb.GetFocusItem());
			if(properties.follow_cursor) g_cover.on_item_focus_change(-1,-1,-1,fb.GetFocusItem());
			else if(fb.IsPlaying) on_playback_new_track(fb.GetNowPlaying());
			break;
	    case "FocusOnNowPlayingForce":
        case "FocusOnNowPlaying":
			focus_on_now_playing = true;
			var track = new FbMetadbHandleList(info);
			if(fb.IsPlaying && track.Count>0) on_playback_new_track(track[0]);
			else if(fb.IsPlaying) on_playback_new_track(fb.GetNowPlaying());
			focus_on_now_playing = false;
        break;
		case "colors":
			globalProperties.colorsMainPanel = info;
			window.SetProperty("GLOBAL colorsMainPanel", globalProperties.colorsMainPanel);
			on_layout_change();
			window.Repaint();
		break;
		case "colorsControls":
			globalProperties.colorsControls = info;
			window.SetProperty("GLOBAL colorsControls", globalProperties.colorsMainPanel);
			on_layout_change();
			window.Repaint();
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
			window.Repaint();
		break;
		case "mouse_move":
			last_mouse_move_notified = info;
		break;
		case "showtrackinfo_big":
			showtrackinfo_big.value = info;
			on_layout_change()
		break;
		case "showtrackinfo_small":
			showtrackinfo_small.value = info;
			on_layout_change()
		break;
		case "mini_controlbar":
			mini_controlbar.value = info;
			on_layout_change()
		break;
		case "DiskCacheState":
			globalProperties.enableDiskCache = info;
			window.SetProperty("COVER Disk Cache", globalProperties.enableDiskCache);
			window.Repaint();
		break;
		case "RefreshImageCover":
			var metadb = new FbMetadbHandleList(info);
			//if(fb.IsPlaying && metadb[0].Compare(fb.GetNowPlaying()))
			var cachekey = process_cachekey(metadb);
			g_image_cache.reset(cachekey);
			if(cachekey==g_cover.cachekey)
				g_cover.refresh(metadb[0], true); //g_cover.refresh, false, undefined, true, g_cover.isPlaying());
		break;
		case "cover_cache_finalized":
			//g_image_cache.cachelist = cloneImgs(info);
			window.Repaint();
		break;
		case "playRandom":
			properties.random_function = info;
			window.SetProperty("Random function", properties.random_function);
			play_random(info);
		break;
		case "SetRandom":
			properties.random_function = info;
			window.SetProperty("Random function", properties.random_function);
		break;
		case "main_panel_state_force":
		case "main_panel_state":
			if(main_panel_state.value!=info || name=="main_panel_state_force") {
				main_panel_state.value = info;
				on_layout_change();
				window.Repaint();
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
		case "minimode_dark_theme":
			properties.minimode_dark_theme=info;
			window.SetProperty("MINIMODE dark theme", properties.minimode_dark_theme);
			on_layout_change();
			window.Repaint();
		break;
		case "bio_stick_to_dark_theme":
			properties.bio_stick_to_dark_theme = info;
			window.SetProperty("BIO stick to dark theme", properties.bio_stick_to_dark_theme);
			on_layout_change();
			window.Repaint();
		break;
		case "visualization_dark_theme":
			properties.visualization_dark_theme = info;
			window.SetProperty("VISUALIZATION dark theme", properties.visualization_dark_theme);
			on_layout_change();
			window.Repaint();
		break;
		case "library_dark_theme":
			properties.library_dark_theme=info;
			window.SetProperty("LIBRARY dark theme", properties.library_dark_theme);
			on_layout_change();
			window.Repaint();
		break;
		case "playlists_dark_theme":
			properties.playlists_dark_theme=info;
			window.SetProperty("PLAYLISTS dark theme", properties.playlists_dark_theme);
			on_layout_change();
			window.Repaint();
		break;
		case "bio_dark_theme":
			properties.bio_dark_theme = info;
			window.SetProperty("BIO dark theme", properties.bio_dark_theme);
			on_layout_change();
			window.Repaint();
		break;
		case "Randomsetfocus":
			Randomsetfocus = info;
			if (!Randomsetfocus && properties.random_function >= 1000 && properties.random_function < 2001){
                properties.random_function = '1_genre';
                window.SetProperty("Random function", properties.random_function);
			}
			window.Repaint();
		break;
		case "layout_state":
			layout_state.value = info;
			on_layout_change();
			window.Repaint();
		break;
		case "controls_force_dark_layout":
			properties.forcedarklayout = info;
			window.SetProperty("_DISPLAY: force dark layout", properties.forcedarklayout);
			on_layout_change();
			window.Repaint();
		break;
		case "controls_main_dark_layout":
			properties.maindarklayout = info;
			window.SetProperty("_DISPLAY: Main layout:Dark", properties.maindarklayout);
			on_layout_change();
			window.Repaint();
		break;
		case "controls_mini_dark_layout":
			properties.minidarklayout = info;
			window.SetProperty("_DISPLAY: Mini layout:Dark", properties.minidarklayout);
			on_layout_change();
			window.Repaint();
		break;
		case "WSH_panels_reload":
			window.Reload();
		break;
		case "hereIsGenreList":
			g_genre_cache=JSON_parse(info);
		break;
		case "MainPanelState":
			panelstate.MainPanel=info;
		break;
		case "FilterPanelState":
			panelstate.FilterPanel=info;
		break;
		case "NowplayingPanelState":
			panelstate.NowplayingPanel=info;
		break;
		case "giveMeGenreList":
			if(!g_genre_cache.isEmpty()){
				window.NotifyOthers("hereIsGenreList",JSON_stringify(g_genre_cache));
			}
		break;
		case "wallpaperVisibilityGlobal":
		case "wallpaperVisibility":
			if(window.IsVisible || name=="wallpaperVisibilityGlobal" || getNowPlayingState()==1) toggleWallpaper(info);
		break;
		case "wallpaperBlurGlobal":
		case "wallpaperBlur":
			if(window.IsVisible || name=="wallpaperBlurGlobal" || getNowPlayingState()==1) toggleBlurWallpaper(info);
		break;
	}
}
function showNowPlayingCover(){
	if (globalProperties.enableDiskCache) {
		cache_filename = check_cache(fb.GetNowPlaying(), 0, g_cover.cachekey);
		// load img from cache
		if(cache_filename) {
			cover_path = cache_filename;
		} else cover_path = "sfsfsf##";
	} else if(fb.GetNowPlaying().path == cover_path) cover_path = cover_path.substring(0, cover_path.lastIndexOf("\\")) + "\\folder.jpg";
	var WshShell = new ActiveXObject("WScript.Shell");
	try {
		WshShell.Run("\"" + cover_path + "\"", 0);
	} catch(e) {
		HtmlMsg("Error", "Image not found, this cover is probably embedded inside the audio file.","Ok");
	}
}

/* ======================= RATING AND TRACK INFO ========================== */
TextBtn = function() {
	this.setSize = function (x, y , w, h){
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
	}
	this.isXYInButton = function(x, y) {
		return (x >= this.x && x <= (this.x + this.w) && y > this.y && y <= (this.y + this.h)) ? true : false;
	}
}
var TextBtn_info = new TextBtn();
/* ======================= RATING AND TRACK INFO END ========================== */
/****************************************
 * DEFINE CLASS ButtonUI  for RATING
 *****************************************/
function ButtonUI_R() {
	this.y = 10;
	this.width = imgw;
	this.height = imgh;

	this.setx = function(x){
		this.x = x;
	}

	this.Paint = function(gr, button_n, y) {
		this.y = y;
		var rating_to_draw = (rating_hover_id!==false?rating_hover_id:g_infos.rating);
		this.img = ((rating_to_draw - button_n) >= 0) ? img_rating_on : img_rating_off;
		if(button_n!=1)
		gr.DrawImage(this.img, this.x, this.y, this.width, this.height, 0, 0, this.width, this.height, 0);
	}

	this.MouseMove = function(x, y, i) {
		if (g_infos.metadb) {
			var half_rating_space = Math.ceil(rating_spacing/2)+1;
			if (x > this.x - half_rating_space && x < this.x + this.width + half_rating_space && y > this.y && y < this.y + this.height) {
				rating_hover_id = i;
				if(g_cursor.getActiveZone()!="rating"+i) {
					g_cursor.setCursor(IDC_HAND,"rating"+i);
				}
				return true;
			} else if(g_cursor.getActiveZone()=="rating"+i) {
					g_cursor.setCursor(IDC_ARROW,4);
			}
		}
		return false;
	}
	this.MouseUp = function(x, y, i) {
		if (g_infos.metadb) {
			var half_rating_space = Math.ceil(rating_spacing/2)+1;
			if (x > this.x - half_rating_space && x < this.x + this.width + half_rating_space && y > this.y && y < this.y + this.height) {
				var derating_flag = (i == g_infos.rating ? true : false);
				g_avoid_metadb_updated = true;
				if (derating_flag) {
					if(g_infos.album_infos) {
						g_infos.rating = rateAlbum(0,g_infos.rating-1, new FbMetadbHandleList(g_infos.metadb))+1;
					} else {
						g_infos.rating = rateSong(0,g_infos.rating-1, g_infos.metadb)+1;
					}
				} else {
					if(g_infos.album_infos) {
						g_infos.rating = rateAlbum(i-1,g_infos.rating-1, new FbMetadbHandleList(g_infos.metadb))+1;
					} else {
						g_infos.rating = rateSong(i-1,g_infos.rating-1, g_infos.metadb)+1;
					}
				}
			}
		}
	}
}
function oInfos() {
	this.w = 0;
	this.h = 0;
	this.x = 0;
	this.y = 0;
	this.txt_line1 = this.txt_line2 = this.txt_line3 = "";
	this.line1_width = this.line2_width = this.line3_width = -1;
	this.tooltip_line1 = this.tooltip_line2 = this.tooltip_line3 = false;
	this.filler = false;
	this.padding = Array(10,15,0,15);
	this.repaint = function() {window.Repaint()}
	this.is_playing = false;
	this.metadb = false;
	this.playlistIndex = -1;
	this.itemIndex = -1;
	this.playing_metadb = false;
	this.album_infos = false;
	this.timer_cycle = false;
	this.time_circle = Number(window.GetProperty("Info: Circle time, 3000~60000ms", 12000));
	if (this.time_circle < 3000) this.time_circle = 3000;
	if (this.time_circle > 60000) this.time_circle = 60000;
	this.tooltip_activated = false;
	this.isHover = false;
	this.first_populate_done = false;
	this.show_info = false;
	this.isPlaying = function() {
		return this.is_playing;
	}
	this.isFiller = function() {
		return this.filler;
	}
	this.setPlaying = function(state, metadb) {
		if(state==this.is_playing) return;
		if(state===false){
			this.is_playing = false;
		} else {
			this.is_playing = true;
			this.playing_metadb = metadb;
		}
	}
	this.on_item_focus_change = function(playlistIndex, from, to, metadb, tracklist) {
		if (g_avoid_on_focus_change || (to<0 && !metadb)) {
			g_avoid_on_focus_change = false;
			return;
		}
		g_metadb_old = this.metadb;
		if (!properties.follow_cursor && (fb.IsPlaying || fb.IsPaused)) this.metadb = fb.GetNowPlaying();
		else {
			if(metadb){
				this.metadb = metadb;
			} else if (to>-1 && playlistIndex>-1){
				this.metadb = plman.GetPlaylistItems(playlistIndex)[to];
			}
			if(!this.metadb){
				this.metadb = g_metadb_old;
				window.Repaint();
			}
		}
		this.tracklist = tracklist;
		if (this.metadb) {
			this.setTimerCycle();
			this.on_metadb_changed(new FbMetadbHandleList(this.metadb));
		}
	}
	this.on_metadb_changed = function(metadbs, fromhook) {
		if(window.IsVisible || !this.first_populate_done) {
			if(!properties.showInfos) return;
			if(!this.metadb || g_avoid_metadb_updated) {
				g_avoid_metadb_updated = false;
				return;
			}
			var current_track = false;
			try{
				for(var i=0; i < metadbs.Count; i++) {
					if(metadbs[i].Compare(this.metadb)) {
						current_track = true;
					}
				}
			} catch(e){}
			if(!current_track) return;
			this.getTrackInfos();

			this.first_populate_done = true;
		} else {
			set_update_function('g_infos.on_metadb_changed(new FbMetadbHandleList(g_infos.metadb),'+fromhook+')');
		}
	}
	this.getTrackInfos = function(){
		var allinfos = g_tfo.allinfos.EvalWithMetadb(this.metadb);
		allinfos = allinfos.split(" ^^ ");

		this.rating = allinfos[0];

		var txt_title = allinfos[1];
		var txt_info = allinfos[2] + allinfos[3] + (allinfos[4]!='?'?" ("+allinfos[4]+")":"");
		var _playcount = allinfos[6];
		if(foo_playcount) var txt_profile = allinfos[5] + allinfos[7] + " | " + _playcount + (_playcount > 1 ? " plays" : " play");
		else var txt_profile = allinfos[5] + allinfos[7];
		this.show_info = true;
		this.updateInfos(txt_title, txt_info, txt_profile, this.metadb, false, this.rating);
	}
	this.updateInfos = function(row1, row2, row3, metadb, album_infos, rating, tracklist){
		this.txt_line1 = row1;
		this.txt_line2 = row2;
		this.txt_line3 = row3;
		this.line1_width = this.line2_width = this.line3_width = -1;
		this.tooltip_line1 = this.tooltip_line2 = this.tooltip_line3 = false;
		this.album_infos = album_infos;
		this.tracklist = tracklist;
		if(this.album_infos) {
			this.metadb = metadb[0];
			if(typeof rating == "undefined") this.rating = g_tfo.rating_album.EvalWithMetadb(this.metadb);
		} else {
			this.metadb = metadb;
			if(typeof rating == "undefined")this.rating = g_tfo.rating.EvalWithMetadb(this.metadb);
		}
		if(typeof rating != "undefined") this.rating = rating;

		if (this.rating == "?") {
			this.rating = 0;
		} else this.rating++;
		window.Repaint();
	};
	this.cycle_infos = function() {
		this.show_info = !this.show_info;
		window.RepaintRect(this.x, rbutton[0].height +10, ww-this.padding[1]-this.padding[3], this.h);
	};
    this.setTimerCycle = function() {
		if (this.timer_cycle) clearInterval(this.timer_cycle)
		this.timer_cycle = window.SetInterval(function() {
			if(window.IsVisible && !properties.doubleRowText) g_infos.cycle_infos();
		}, this.time_circle);
    };
	this.setTimerCycle();
    this.setSize = function(w, h) {
		this.w = w;
		this.h = h;
		this.x = this.padding[3];
		this.y = this.padding[0];
		this.txt_width = this.w-this.padding[1]-this.padding[3];
		this.tooltipVisibility();
    };
	this.tooltipVisibility = function(){
		this.tooltip_line1 = (this.line1_width>0 && this.line1_width<this.txt_width);
		this.tooltip_line2 = (this.line2_width>0 && this.line2_width<this.txt_width);
		this.tooltip_line3 = (this.line3_width>0 && properties.doubleRowText && this.txt_line3 !="" && this.line3_width<this.txt_width);
	}
	this.draw = function(gr, x, y) {
		if(!this.metadb) return
		this.y = y+track_infos_margin_top;

		if (properties.showRating) {
			for (var i = 1; i < rbutton.length + 1; i++) {
				rbutton[i - 1].Paint(gr, i, y+9);
			}
			var text_y_adj = 18;
		} else var text_y_adj = 2;

		var double_row = (properties.doubleRowText && this.txt_line3 !="" && this.txt_line2 !="");

		if(this.line1_width<0) {
			this.line1_width = gr.CalcTextWidth(this.txt_line1, g_font.italicplus5);
			this.tooltip_line1 = (this.line1_width>this.txt_width);
		}
		gr.GdiDrawText(this.txt_line1, g_font.italicplus5, colors.normal_txt, this.x, this.y + (properties.showRating ? rbutton[0].height-10 : 5) + text_y_adj + (double_row?0:2), this.txt_width, 34, DT_CENTER | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX | DT_END_ELLIPSIS);

		var line2 = ((this.txt_line2 !="" && this.show_info) || double_row) ? this.txt_line2 : this.txt_line3;
		if(this.line2_width<0) {
			this.line2_width = gr.CalcTextWidth(line2, g_font.min1);
			this.tooltip_line2 = (this.line2_width>this.txt_width);
		}
		gr.GdiDrawText(line2, g_font.min1, colors.faded_txt, this.x, this.y+(double_row?29:37)+text_y_adj, this.txt_width, 30, DT_CENTER | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX | DT_END_ELLIPSIS);

		if(double_row) {
			if(this.line3_width<0) {
				this.line3_width = gr.CalcTextWidth(this.txt_line3, g_font.min2);
				this.tooltip_line3 = (this.line3_width>this.txt_width);
			}
			gr.GdiDrawText(this.txt_line3, g_font.min2, colors.faded_txt, this.x, this.y+43+text_y_adj, this.txt_width, 30, DT_CENTER | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX | DT_END_ELLIPSIS);
		}
    };
    this.onMouse = function (state, x, y, m) {
		switch(state){
			case 'lbtn_down':
				this.down_x = x;
				this.down_y = y;
			break;
			case 'lbtn_up':
				this.up_x = x;
				this.up_y = y;
			break;
			case 'dble_click':
				this.down_x = x;
				this.down_y = y;
			break;
			case 'move':
				if(x>this.x && x<this.x+this.w && y>this.y + rbutton[0].height + (properties.doubleRowText?0:2) && y<this.y+this.h){
					this.isHover = true;
					if(this.tooltip_line1 || this.tooltip_line2 || this.tooltip_line3){
						this.tooltip_activated = true;
						g_tooltip.ActivateDelay(this.txt_line1+"\n"+this.txt_line2+"\n"+this.txt_line3, x+10, y+20, globalProperties.tooltip_button_delay, 1200, false, "trackinfos");
					} else if(this.tooltip_activated){
						this.tooltip_activated = false;
						g_tooltip.Deactivate();
					}
				} else if(this.tooltip_activated){
					this.tooltip_activated = false;
					g_tooltip.Deactivate();
				}
			break;
			case 'leave':
				if(this.isHover){
					this.isHover = false;
				}
				if(this.tooltip_activated){
					this.tooltip_activated = false;
					g_tooltip.Deactivate();
				}
			break;
		}
    }
}
function on_script_unload() {
	g_infos.time_circle && window.ClearInterval(g_infos.time_circle);
	g_infos.time_circle = false;
}
function on_key_down(vkey) {
    var mask = GetKeyboardMask();
	if (mask == KMask.none) {
		switch (vkey) {
			case VK_ESCAPE:
				if(g_uihacks.getFullscreenState()) g_uihacks.toggleFullscreen();
				break;
		};
	}
};
function on_metadb_changed(metadbs, fromhook) {
	g_infos.on_metadb_changed(metadbs, fromhook);
}
function set_update_function(string){
	if(string=="") Update_Required_function=string;
	else if( Update_Required_function.indexOf("g_infos.on_metadb_changed(g_infos.metadb,false")!=-1) return;
	else Update_Required_function=string;
}
function on_mouse_rbtn_up(x, y){
	var main_menu = window.CreatePopupMenu();
	var idx;

	main_menu.AppendMenuItem(MF_STRING, 35, "Settings...");
	main_menu.AppendMenuSeparator();
	if(g_cover.isValid()){
		var now_playing_track = fb.GetNowPlaying();
		main_menu.AppendMenuItem(MF_STRING, 1, "Open cover in its full/original size");
		main_menu.AppendMenuItem(MF_STRING, 6, "Open containing folder");
		main_menu.AppendMenuItem(MF_STRING, 8, "Refresh this image");
		var quickSearchMenu = window.CreatePopupMenu();
		quickSearchMenu.AppendMenuItem(MF_STRING, 34,"Same title");
		quickSearchMenu.AppendMenuItem(MF_STRING, 30,"Same artist");
		quickSearchMenu.AppendMenuItem(MF_STRING, 31,"Same album");
		quickSearchMenu.AppendMenuItem(MF_STRING, 32,"Same genre");
		quickSearchMenu.AppendMenuItem(MF_STRING, 33,"Same date");
		quickSearchMenu.AppendTo(main_menu, MF_STRING, "Quick search for...");
	}
	
	main_menu.AppendMenuSeparator();
	main_menu.AppendMenuItem(MF_STRING, 9, "Show now playing");
	main_menu.AppendMenuSeparator();
	main_menu.AppendMenuItem(MF_STRING, 2, "Properties");
	if(utils.IsKeyPressed(VK_SHIFT)) {
		main_menu.AppendMenuSeparator();
		main_menu.AppendMenuItem(MF_STRING, 100, "Properties ");
		main_menu.AppendMenuItem(MF_STRING, 101, "Configure...");
		main_menu.AppendMenuSeparator();
		main_menu.AppendMenuItem(MF_STRING, 102, "Reload");
	}
	idx = main_menu.TrackPopupMenu(x,y);
	switch(true) {
		case (idx == 2):
			fb.RunContextCommandWithMetadb("Properties", fb.GetNowPlaying());
		break;
		case (idx == 11):
			properties.circleMode = !properties.circleMode;
			window.SetProperty("_DISPLAY: circle mode", properties.circleMode);
			get_images();
			g_cover.refreshCurrent();
			adaptButtons();
			positionButtons();
			window.Repaint();
			break;
		case (idx == 12):
			setGlobalParameter("keepProportion",!globalProperties.keepProportion, true);
			get_images();
			adaptButtons();
			g_cover.refreshCurrent(undefined,true);
			window.Repaint();
			break;
		case (idx == 100):
			window.ShowProperties();
			break;
		case (idx == 101):
			window.ShowConfigure();
			break;
		case (idx == 102):
			window.Reload();
			break;
		case (idx == 1):
			if(!g_cover.isFiller()) openCoverFullscreen(g_cover.metadb);
			break;
		case (idx == 2):
			properties.random_function = '20_albums';
			window.SetProperty("Random function", properties.random_function);
			window.NotifyOthers("SetRandom", properties.random_function);
			play_random(properties.random_function);
			break;
		case (idx == 3):
			properties.random_function = '200_tracks';
			window.SetProperty("Random function", properties.random_function);
			window.NotifyOthers("SetRandom", properties.random_function);
			play_random(properties.random_function);
			break;
		case (idx == 4):
			properties.random_function = '1_genre';
			window.SetProperty("Random function", properties.random_function);
			window.NotifyOthers("SetRandom", properties.random_function);
			play_random(properties.random_function);
			break;
		case (idx == 5):
			properties.random_function = '1_artist';
			window.SetProperty("Random function", properties.random_function);
			window.NotifyOthers("SetRandom", properties.random_function);
			play_random(properties.random_function);
			break;
		case (idx >= 1000 && idx < 2001):
			properties.random_function = idx;
			window.SetProperty("Random function", properties.random_function);
			window.NotifyOthers("SetRandom", properties.random_function);
			play_random(idx);
			break;
		case (idx == 7):
			properties.random_function = 'default';
			window.SetProperty("Random function", properties.random_function);
			window.NotifyOthers("SetRandom", properties.random_function);
			play_random(properties.random_function);
			break;
		case (idx == 6):
			fb.RunContextCommandWithMetadb("Open containing folder", now_playing_track, 8);
			break;
		case (idx == 8):
			window.NotifyOthers("RefreshImageCover",g_cover.metadb);
			g_cover.refresh(g_cover.metadb, true);
			break;
		case (idx == 9):
			showNowPlaying(true);
			break;
		case (idx == 30):
			quickSearch(g_cover.metadb,"artist");
			break;
		case (idx == 31):
			quickSearch(g_cover.metadb,"album");
			break;
		case (idx == 32):
			quickSearch(g_cover.metadb,"genre");
			break;
		case (idx == 33):
			quickSearch(g_cover.metadb,"date");
			break;
		case (idx == 34):
			quickSearch(g_cover.metadb,"title");
			break;
		case (idx == 35):
			draw_settings_menu(x,y);
			break;
		case (idx == 10000):
			g_genre_cache.build_from_library();
			break;
		default:
			return true;
	}
	main_menu = undefined;

	genrePopupMenu = undefined;
	return true;
}
function draw_settings_menu(x,y){
        var _menu = window.CreatePopupMenu();
		var wallpapper_menu = window.CreatePopupMenu();
		var wallpapper_menub = window.CreatePopupMenu();
        var idx;

		_menu.AppendMenuItem(MF_STRING, 10, "Cover always follow cursor");
		_menu.CheckMenuItem(10,properties.follow_cursor);
		_menu.AppendMenuItem(MF_STRING, 11, "Circle artwork");
		_menu.CheckMenuItem(11,properties.circleMode);
		_menu.AppendMenuItem(MF_STRING, 12, "Keep proportion")
		_menu.CheckMenuItem(12,globalProperties.keepProportion);
		_menu.AppendMenuItem(MF_STRING, 13, "Fill the whole space");
		_menu.CheckMenuItem(13,!trackinfostext_state.isActive() && properties.coverNoPadding);				
		_menu.AppendMenuSeparator();
		_menu.AppendMenuItem(MF_STRING, 18, "Show track details");
		_menu.CheckMenuItem(18, trackinfostext_state.isActive());		
		_menu.AppendMenuItem(trackinfostext_state.isActive()?MF_STRING:MF_GRAYED, 17, "Show details on 2 rows");
		_menu.CheckMenuItem(17, properties.doubleRowText);
		_menu.AppendMenuItem(trackinfostext_state.isActive()?MF_STRING:MF_GRAYED, 16, "Show rating");
		_menu.CheckMenuItem(16,properties.showRating);		
		_menu.AppendMenuSeparator();

		var _single_click_menu = window.CreatePopupMenu();
		_single_click_menu.AppendMenuItem(MF_STRING, 14, "Play / pause");
		_single_click_menu.AppendMenuItem(MF_STRING, 15, "Show now playing");
		_single_click_menu.CheckMenuRadioItem(14, 15, 14+properties.single_click_action);
		_single_click_menu.AppendTo(_menu, MF_STRING, "Cover button");

		var _dble_click_menu = window.CreatePopupMenu();
		_dble_click_menu.AppendMenuItem(MF_STRING, 3, "Pause playback");
		_dble_click_menu.AppendMenuItem(MF_STRING, 4, "Show now playing on all panels");
		_dble_click_menu.AppendMenuItem(MF_STRING, 5, "Open cover in its full/original size");
		_dble_click_menu.AppendMenuItem(MF_STRING, 6, "Open containing folder");
		_dble_click_menu.AppendMenuItem(MF_STRING, 7, "Activate/quit mini player");
		_dble_click_menu.AppendMenuItem(MF_STRING, 8, "Edit track properties");		
		_dble_click_menu.CheckMenuRadioItem(3, 8, 3+properties.dble_click_action);
		_dble_click_menu.AppendTo(_menu, MF_STRING, "Double click action");

		wallpapper_menu.AppendMenuItem(MF_STRING, 200, "Enable");
		wallpapper_menu.CheckMenuItem(200, properties.showwallpaper);
		wallpapper_menu.AppendMenuItem(MF_STRING, 220, "Blur");
		wallpapper_menu.CheckMenuItem(220, properties.wallpaperblurred);
		wallpapper_menub.AppendMenuItem(MF_STRING, 221, "Filling");
		wallpapper_menub.CheckMenuItem(221, properties.wallpaperdisplay==0);
		wallpapper_menub.AppendMenuItem(MF_STRING, 222, "Adjust");
		wallpapper_menub.CheckMenuItem(222, properties.wallpaperdisplay==1);
		wallpapper_menub.AppendMenuItem(MF_STRING, 223, "Stretch");
		wallpapper_menub.CheckMenuItem(223, properties.wallpaperdisplay==2);
		wallpapper_menub.AppendTo(wallpapper_menu,MF_STRING, "Wallpaper size");
		wallpapper_menu.AppendTo(_menu,MF_STRING, "Background Wallpaper");

        idx = _menu.TrackPopupMenu(x,y);
        switch(true) {
            case (idx == 2):
				coverpanel_state_big.toggleValue();
                break;
            case (idx == 3):
				properties.dble_click_action = 0;
				window.SetProperty("PROPERTY double click action", properties.dble_click_action);
                break;
            case (idx == 4):
				properties.dble_click_action = 1;
				window.SetProperty("PROPERTY double click action", properties.dble_click_action);
                break;
            case (idx == 5):
				properties.dble_click_action = 2;
				window.SetProperty("PROPERTY double click action", properties.dble_click_action);
                break;
            case (idx == 6):
				properties.dble_click_action = 3;
				window.SetProperty("PROPERTY double click action", properties.dble_click_action);
                break;
            case (idx == 7):
				properties.dble_click_action = 4;
				window.SetProperty("PROPERTY double click action", properties.dble_click_action);
                break;
            case (idx == 8):
				properties.dble_click_action = 5;
				window.SetProperty("PROPERTY double click action", properties.dble_click_action);
                break;				
			case (idx == 10):
				properties.follow_cursor = !properties.follow_cursor;
				window.SetProperty("_DISPLAY: cover follow cursor", properties.follow_cursor);
				if(properties.follow_cursor) g_cover.on_item_focus_change(-1,-1,-1,fb.GetFocusItem());
				else if(fb.IsPlaying) on_playback_new_track(fb.GetNowPlaying());
				window.NotifyOthers("Right_panel_follow_cursor",properties.follow_cursor);
				window.Repaint();
				break;
			case (idx == 11):
				properties.circleMode = !properties.circleMode;
				window.SetProperty("_DISPLAY: circle mode", properties.circleMode);
				get_images();
				adaptButtons();
				g_cover.refreshCurrent();
				window.Repaint();
				break;
			case (idx == 12):
				setGlobalParameter("keepProportion",!globalProperties.keepProportion, true);
				get_images();
				adaptButtons();
				g_cover.refreshCurrent(undefined,true);
				window.Repaint();
				break;
			case (idx == 13):
				if(!trackinfostext_state.isActive() && properties.coverNoPadding) {
					properties.coverNoPadding = false;					
				} else {
					properties.coverNoPadding = true;
					trackinfostext_state.setValue(0);
				}
				get_images();
				adaptButtons();
				g_cover.refreshCurrent();
				on_size(window.Width,window.Height);
				window.SetProperty("_DISPLAY: cover no padding", properties.coverNoPadding)
				window.Repaint();
				break;				
            case (idx >= 14 && idx<=15):
				properties.single_click_action = idx-14;
				window.SetProperty("PROPERTY single_click_action", properties.single_click_action);
                break;
			case (idx == 16):
				properties.showRating = !properties.showRating;
				window.SetProperty("_DISPLAY: showRating", properties.showRating);
				get_images();
				g_cover.refreshCurrent();
				on_size(window.Width,window.Height);			
				adaptButtons();
				window.Repaint();
				break;	
			case (idx == 17):
				properties.doubleRowText = !properties.doubleRowText;
				window.SetProperty("_DISPLAY: doubleRowText", properties.doubleRowText);
				window.Repaint();
				break;				
			case (idx == 18):
				trackinfostext_state.toggleValue();
				get_images();
				g_cover.refreshCurrent();
				on_size(window.Width,window.Height);			
				adaptButtons();				
				window.Repaint();
				break;					
			case (idx == 200):
				toggleWallpaper();
				break;
			case (idx == 210):
				properties.wallpapermode = 99;
				window.SetProperty("_SYSTEM: Wallpaper Mode", properties.wallpapermode);
				toggleWallpaper(properties.showwallpaper);
				break;
			case (idx == 211):
				properties.wallpapermode = 0;
				window.SetProperty("_SYSTEM: Wallpaper Mode", properties.wallpapermode);
				toggleWallpaper(properties.showwallpaper);
				break;
			case (idx == 221):
				properties.wallpaperdisplay = 0;
				window.SetProperty("_DISPLAY: Wallpaper 0=Filling 1=Adjust 2=Stretch", properties.wallpaperdisplay);
				toggleWallpaper(properties.showwallpaper);
				break;
			case (idx == 222):
				properties.wallpaperdisplay = 1;
				window.SetProperty("_DISPLAY: Wallpaper 0=Filling 1=Adjust 2=Stretch", properties.wallpaperdisplay);
				toggleWallpaper(properties.showwallpaper);
				break;
			case (idx == 223):
				properties.wallpaperdisplay = 2;
				window.SetProperty("_DISPLAY: Wallpaper 0=Filling 1=Adjust 2=Stretch", properties.wallpaperdisplay);
				toggleWallpaper(properties.showwallpaper);
				break;
			case (idx == 220):
				toggleBlurWallpaper();
				break;
            default:
				return true;
        }
		wallpapper_menu = undefined;
		wallpapper_menub = undefined;
        _menu = undefined;
        return true;
}
function on_mouse_wheel(step, stepstrait, delta){
	if(typeof(stepstrait) == "undefined" || typeof(delta) == "undefined") intern_step = step;
	else intern_step = stepstrait/delta;
	if(utils.IsKeyPressed(VK_CONTROL)) { // zoom all elements
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
		fb.Volume=fb.Volume + Math.pow((120+fb.Volume)/100,1/1000)*intern_step*2;
		window.NotifyOthers("AdjustVolume", true);
		g_infos.cycle_infos();
	}
}
var colors = {};
function get_colors(){
	get_colors_global();
	if(properties.darklayout) {
		colors.grad_bottom = GetGrey(0,125);
		colors.grad_top = GetGrey(0,30);
		colors.visu_grad_borders = GetGrey(0,0);
		colors.visu_grad_middle = GetGrey(0,50);
		colors.animation = GetGrey(255);
		colors.btn_grad_borders = GetGrey(0,50);
		colors.btn_grad_middle = GetGrey(0,180);
		colors.border_right = GetGrey(0,100);
		colors.border_covers = GetGrey(255,50);
		colors.btn_bg_inverse = GetGrey(255,220);
		colors.btn_bg = GetGrey(0,220);
	} else {
		colors.grad_bottom = GetGrey(0,20);
		colors.grad_top = GetGrey(0,20);
		colors.visu_grad_borders = GetGrey(0,0);
		colors.visu_grad_middle = GetGrey(0,50);
		colors.animation = GetGrey(255);
		colors.btn_grad_borders = GetGrey(0,30);
		colors.btn_grad_middle = GetGrey(0,120);
		colors.border_right = GetGrey(0,10);
		colors.border_covers = GetGrey(0,50);
		colors.btn_bg = GetGrey(255,220);
		colors.btn_bg_inverse = GetGrey(0,220);
	}
	colors.border_light = GetGrey(255,20);
	colors.border_dark = GetGrey(0,50);
	colors.line_bottom = GetGrey(40,200);
	colors.btn_shadow = GetGrey(0,100);
	colors.overlay_on_hover = GetGrey(0,130);
	colors.btns = GetGrey(255);
}
function on_font_changed(){
	get_font();
}
function get_images(){
	if(properties.darklayout) {
		var theme_path = "controls_Dark";
		var theme_inverse_path = "controls_Light";
	} else {
		var theme_path = "controls_Light";
		var theme_inverse_path = "controls_Dark";
	}
	var theme_btns = "controls_Dark";
	images.mini_pause_img = gdi.Image(theme_img_path + "\\"+theme_btns+"\\pause_btn_mini.png");
	images.mini_mini_pause_img = gdi.Image(theme_img_path + "\\"+theme_btns+"\\pause_btn_mini_mini.png");
	images.pause_img = gdi.Image(theme_img_path + "\\"+theme_btns+"\\pause_btn.png");
	images.random_img = gdi.Image(theme_img_path + "\\"+theme_btns+"\\play_random.png");
	images.random_img_mini = gdi.Image(theme_img_path + "\\"+theme_btns+"\\play_random_mini.png");
	images.nothing_played = gdi.Image(theme_img_path + "\\"+theme_path+"\\nothing_played.png");
	images.nothing_played_mini = gdi.Image(theme_img_path + "\\"+theme_path+"\\nothing_played_mini.png");
	images.nothing_played_compact = gdi.Image(theme_img_path + "\\"+theme_path+"\\nothing_played_compact.png");
	images.nothing_played_supercompact = gdi.Image(theme_img_path + "\\"+theme_path+"\\nothing_played_supercompact.png");

	images.rating0_img_hover = gdi.Image(theme_img_path + "\\" + theme_path + "\\rating_0_hover.png");
	images.rating0_img = gdi.Image(theme_img_path + "\\" + theme_path + "\\rating_0.png");
	images.rating1_img_hover = gdi.Image(theme_img_path + "\\" + theme_path + "\\rating_1_hover.png");
	images.rating1_img = gdi.Image(theme_img_path + "\\" + theme_path + "\\rating_1.png");
	images.rating2_img_hover = gdi.Image(theme_img_path + "\\" + theme_path + "\\rating_2_hover.png");
	images.rating2_img = gdi.Image(theme_img_path + "\\" + theme_path + "\\rating_2.png");
	images.rating3_img_hover = gdi.Image(theme_img_path + "\\" + theme_path + "\\rating_3_hover.png");
	images.rating3_img = gdi.Image(theme_img_path + "\\" + theme_path + "\\rating_3.png");
	images.rating4_img_hover = gdi.Image(theme_img_path + "\\" + theme_path + "\\rating_4_hover.png");
	images.rating4_img = gdi.Image(theme_img_path + "\\" + theme_path + "\\rating_4.png");
	images.rating5_img_hover = gdi.Image(theme_img_path + "\\" + theme_path + "\\rating_5_hover.png");
	images.rating5_img = gdi.Image(theme_img_path + "\\" + theme_path + "\\rating_5.png");
	
	var img_width = 70;
	var img_height = 70;
	var pause_img = gdi.CreateImage(img_width, img_height);
	gb = pause_img.GetGraphics();
		var bar_space = 20;	
		var pause_height = 32;		
		var xpos = img_width/2-(bar_space+bar_width*2)/2;
		var ypos = img_height/2-pause_height/2;		
		var colors_anim = colors.btns;
		gb.FillSolidRect(xpos, ypos, bar_width, pause_height, colors_anim);
		gb.FillSolidRect(xpos + bar_space, ypos, bar_width, pause_height, colors_anim);
	pause_img.ReleaseGraphics(gb);
	images.pause_img = pause_img;

	var play_img = gdi.CreateImage(70, 70);
	gb = play_img.GetGraphics();
		var xpos = 25;
		var ypos = 22;
		var width = 22;
		var height = 25;
		gb.SetSmoothingMode(2);
		gb.FillPolygon(colors.btns, 0, Array(xpos, ypos, xpos+width, ypos+height/2, xpos, ypos+height));
		gb.SetSmoothingMode(0);
	play_img.ReleaseGraphics(gb);
	images.play_img = play_img;

	var nowplaying_img = gdi.CreateImage(68, 68);
	gb = nowplaying_img.GetGraphics();
		var xpos = 25;
		var ypos = 40;
		var img_h_add = 4;
		var img_height_bar_1 = 8 + img_h_add;
		var img_height_bar_2 = 18 + img_h_add;
		var img_height_bar_3 = 12 + img_h_add;
		var img_height_bar_4 = 7 + img_h_add;
		gb.FillSolidRect(xpos, ypos-img_height_bar_1, bar_width, img_height_bar_1, colors.btns);
		gb.FillSolidRect(xpos + bar_margin + bar_width, ypos-img_height_bar_2, bar_width, img_height_bar_2, colors.btns);
		gb.FillSolidRect(xpos + bar_margin*2 + bar_width*2, ypos-img_height_bar_3, bar_width, img_height_bar_3, colors.btns);
		gb.FillSolidRect(xpos + bar_margin*3 + bar_width*3, ypos-img_height_bar_4, bar_width, img_height_bar_4, colors.btns);
	nowplaying_img.ReleaseGraphics(gb);
	images.nowplaying_img = nowplaying_img;

	var gb;
	pointArr = {
		p1: Array(9, 1, 6.4, 6, 1, 6.6, 4.6, 10.6, 4, 16.2, 9, 13.4, 14, 16.2, 13.6, 10.6, 17, 6.6, 11.6, 6),
		p2: Array(2,1,2,16,8,12,14,16,14,1)
	}

	img_rating_on = gdi.CreateImage(imgw, imgh);
	gb = img_rating_on.GetGraphics();
		gb.SetSmoothingMode(2);
		gb.FillPolygon(colors.rating_icon_on, 0, pointArr.p1);
		gb.SetSmoothingMode(0);
	img_rating_on.ReleaseGraphics(gb);

	img_rating_off = gdi.CreateImage(imgw, imgh);
	gb = img_rating_off.GetGraphics();
		gb.SetSmoothingMode(2);
		gb.FillPolygon(colors.rating_icon_off, 0, pointArr.p1);
		gb.SetSmoothingMode(0);
	img_rating_off.ReleaseGraphics(gb);
}
function toggleWallpaper(wallpaper_state){
	wallpaper_state = typeof wallpaper_state !== 'undefined' ? wallpaper_state : !properties.showwallpaper;
	properties.showwallpaper = wallpaper_state;
	window.SetProperty("_DISPLAY: Show Wallpaper", properties.showwallpaper);
	g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
	on_colours_changed();
}
function toggleBlurWallpaper(wallpaper_blur_state){
	wallpaper_blur_state = typeof wallpaper_blur_state !== 'undefined' ? wallpaper_blur_state : !properties.wallpaperblurred;
	properties.wallpaperblurred = wallpaper_blur_state;
	window.SetProperty("_DISPLAY: Wallpaper Blurred", properties.wallpaperblurred);
	g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
	on_colours_changed();
}
function on_colours_changed(){
	window.Repaint();
}
function on_init(){
	g_image_cache = new oImageCache;
	g_genre_cache = new oGenreCache();
	g_cover = new oCover();
	g_resizing = new Resizing("rightsidebar",true,false);
	g_cursor = new oCursor();
	g_tooltip = new oTooltip();
	setDarkLayout();
	get_colors();
	get_images();
	setButtons();
	get_font();
	g_infos = new oInfos();
	on_layout_change();
	initbutton();
	if(fb.IsPlaying) on_playback_new_track(fb.GetNowPlaying());
	else g_infos.on_item_focus_change(-1,-1,-1,fb.GetFocusItem()); //g_cover.getArtwork(fb.GetFocusItem(), false);
	if(fb.IsPlaying) g_cover.getArtwork(fb.GetNowPlaying(), true, plman.PlayingPlaylist);
	else g_cover.getArtwork(fb.GetFocusItem(), false, plman.ActivePlaylist);
}
on_init();