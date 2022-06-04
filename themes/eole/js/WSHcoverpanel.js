var colors = {};
var properties = {
	panelName: 'WSHcoverpanel',
    enableDiskCache: window.GetProperty("COVER Disk Cache", true),
	showVisualization: window.GetProperty("Show Visualization", 1), // 0: Never 1: Only when track info panel isn't showing it // 2: Always
	showTrackInfo: window.GetProperty("Show track info", false),
    random_function: window.GetProperty("Random function", "default"),
	maindarklayout: window.GetProperty("_DISPLAY: Main layout:Dark", true),
	minidarklayout: window.GetProperty("_DISPLAY: Mini layout:Dark", true),
    minimode_dark_theme: window.GetProperty("MINIMODE dark theme", true),
    library_dark_theme: window.GetProperty("LIBRARY dark theme", true),
    playlists_dark_theme: window.GetProperty("PLAYLISTS dark theme", true),
    bio_dark_theme: window.GetProperty("BIO dark theme", true),
    dble_click_action: window.GetProperty("PROPERTY double click action", 0),
	deleteSpecificImageCache : window.GetProperty("COVER cachekey of covers to delete on next startup", ""),
	forcedarklayout: window.GetProperty("_DISPLAY: force dark layout", true),
	tintOnHover : true,
	rawBitmap: false,
	refreshRate: 50,
}
var visu_margin_left = 0;
var g_genre_cache = null;
var cover_path="";
var text_height=wh-8;
var global_vertical_fix=0;
var Visualization_top_m=10;
var nowPlaying_cachekey = "";
var height_bar_1,height_bar_2,height_bar_3;
var coef_bar_1, coef_bar_2, coef_bar_3;
var direction_bar_1,direction_bar_2,direction_bar_3;
var prev_height_bar_1,prev_height_bar_2,prev_height_bar_3;
var bar_margin = 4;
var bar_width=2;
var height_bar_max=20;
var bar_height_min=1;
var b_img;
var g_text_artist="";
var g_text_title="";
var g_text_album="";
var g_text_date="";
var images = {};
var buttons = {};
var animationTimer = false;
var randomBtnTimer = false;
var Randomsetfocus=false;
var border_top=1;
var border_right=1;
var border_bottom=0;
var border_left=0;
var tooltipDoubleClicText = "";
var ww = 0,
    wh = 0;
var cur_btn = null;
var g_down = false;
var g_dble_click = false;
var animationStartTime = 0;
var animationCounter = 0;
var Pause_width = 34;
var current_played_track = null;
var g_rating = 0;
var g_dragndrop_x = 0;
var g_dragndrop_y = 0;
var g_dragndrop_timer = false;
var g_dragndrop_targetPlaylistId = -1;
timers = {
    waitForRandomization: false,
    SetRating: false,
    hideVolume: false,
};
function setButtons(){
	buttons = {
		Pause: new SimpleButton( ww/2-Pause_width/2,wh/2-images.pause_img.Height/2+global_vertical_fix, Pause_width, 74, "Pause", function () {
			if(fb.IsPaused) fb.Pause();
		},function () {
			fb.Pause();
		},images.pause_img,images.pause_img),
		Random: new SimpleButton( ww/2-images.pause_img.Width/2, wh/2-images.pause_img.Height/2+global_vertical_fix, 74, 74, "Random", function () {
			play_random(properties.random_function);
		},null,images.random_img,images.random_img)
	}
}
function setRatingBtn(metadb,new_rating){
	metadb = typeof metadb !== 'undefined' ? metadb : fb.GetNowPlaying();
	if (metadb) {
		if(typeof new_rating == 'undefined') g_rating = fb.TitleFormat("$if2(" + (globalProperties.use_ratings_file_tags ? "$meta(rating)" : "%rating%") + ",0)").EvalWithMetadb(metadb);
		else g_rating = new_rating;
		buttons.Rating.N_img = eval("images.rating"+g_rating+"_img");
		buttons.Rating.H_img = eval("images.rating"+g_rating+"_img_hover");
		buttons.Rating.D_img = buttons.Rating.H_img;
	} else {
		g_rating = 0;
	}
}
function adaptButtons(){
	if(layout_state.isEqual(0) && !mini_controlbar.isActive()) {
		buttons.Random.N_img = images.random_img;
		buttons.Random.H_img = images.random_img;
		buttons.Random.D_img = images.random_img;
		buttons.Pause.N_img = images.pause_img;
		buttons.Pause.H_img = images.pause_img;
		buttons.Pause.D_img = images.pause_img;
	} else if(layout_state.isEqual(0)) {
		buttons.Random.N_img = images.random_img;
		buttons.Random.H_img = images.random_img;
		buttons.Random.D_img = images.random_img;
		buttons.Pause.N_img = images.mini_pause_img;
		buttons.Pause.H_img = images.mini_pause_img;
		buttons.Pause.D_img = images.mini_pause_img;
	} else {
		buttons.Random.N_img = images.random_img_mini;
		buttons.Random.H_img = images.random_img_mini;
		buttons.Random.D_img = images.random_img_mini;
		buttons.Pause.N_img = images.mini_mini_pause_img;
		buttons.Pause.H_img = images.mini_mini_pause_img;
		buttons.Pause.D_img = images.mini_mini_pause_img;
	}
}
function positionButtons(){
    for (var i in buttons) {
		buttons[i].x=Math.round(ww/2-buttons[i].w/2);
		buttons[i].y=Math.round(wh/2-buttons[i].N_img.Height/2+global_vertical_fix);
    }
}
function resetAnimation(){
	animationTimer && window.ClearInterval(animationTimer);
	animationTimer = false;
    height_bar_1=9;
    height_bar_2=15;
    height_bar_3=13;
    direction_bar_1=1;
    direction_bar_2=1;
    direction_bar_3=1;
	coef_bar_1=1.7;
	coef_bar_2=1.4;
	coef_bar_3=2.2;
}
function startAnimation(){
	resetAnimation();
	try{
		animationStartTime = Date.now();
	}catch(e){}
	animationCounter = 0;
	if(properties.showVisualization>0){
		animationTimer = setInterval(function() {
			animationCounter++;
			if(fb.IsPlaying && !fb.IsPaused && !Randomsetfocus && window.IsVisible) {
				//Restart if the animation is desyncronised
				try{
					if(Math.abs(animationStartTime+animationCounter*properties.refreshRate-Date.now())>500){
						resetAnimation();
						startAnimation();
					}
				}catch(e){}
				if(properties.showVisualization>0 && (!g_cover.sidebar_isplaying || layout_state.isEqual(1) || properties.showVisualization==2 || !getTrackInfosVisibility())) {
					if(height_bar_1>height_bar_max) {direction_bar_1=-1;} else if(height_bar_1<bar_height_min) direction_bar_1=1;
					height_bar_1=height_bar_1+(coef_bar_1*direction_bar_1);

					if(height_bar_2>height_bar_max) {direction_bar_2=-1;} else if(height_bar_2<bar_height_min) direction_bar_2=1;
					height_bar_2=height_bar_2+(coef_bar_2*direction_bar_2);

					if(height_bar_3>height_bar_max) {direction_bar_3=-1;} else if(height_bar_3<bar_height_min) direction_bar_3=1;
					height_bar_3=height_bar_3+(coef_bar_3*direction_bar_3);

					window.RepaintRect(visu_margin_left, wh/2-height_bar_max+global_vertical_fix+Visualization_top_m-3, bar_width * 3 + bar_margin * 2+1, height_bar_max+3);
				}
			}
		}, properties.refreshRate);
	}
}
function setTooltipDoubleClicText(){
	switch(true){
		case (properties.dble_click_action==0):
			tooltipDoubleClicText = "pause playback";
		break;
		case (properties.dble_click_action==1):
			tooltipDoubleClicText = "show on all panels";
		break;
		case (properties.dble_click_action==2):
			tooltipDoubleClicText = "open cover in its full/original size";
		break;
		case (properties.dble_click_action==3):
			tooltipDoubleClicText = "open containing folder";
		break;
		case (properties.dble_click_action==4):
			tooltipDoubleClicText = "activate/quit mini player";
		break;
	}
}
function SimpleButton(x, y, w, h, text, fonClick, fonDbleClick, N_img, H_img, state) {
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

    this.containXY = function (x, y) {
        return (this.x <= x) && (x <= this.x + this.w) && (this.y <= y) && (y <= this.y + this.h);
    }
    this.changeState = function (state) {
        var old = this.state;
        this.state = state;
        return old;
    }
    this.draw = function (gr) {
        b_img=this.N_img;
        var opacity=255;
        if(this.text=='Random'){
            if((!Randomsetfocus) || !fb.IsPlaying){
                this.state = ButtonStates.hide;return;
            } else this.state = ButtonStates.normal;
        } else if(this.text=='Pause'){
            if(!fb.IsPaused || Randomsetfocus){
                this.state = ButtonStates.hide;return;
            } else {
				if(this.state==ButtonStates.hover)
					this.state = ButtonStates.hover;
				else
					this.state = ButtonStates.normal;
				if(!fb.IsPaused){
					opacity=0;
                    this.state = ButtonStates.normal;
				}
			}
        }
        if (this.state == ButtonStates.hide) return;


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


		if (this.state == ButtonStates.normal && opacity!=0) gr.FillGradRect(0,0, ww, wh, 0, colors.btn_grad_borders, colors.btn_grad_middle, 0.5);
        gr.DrawImage(b_img, this.x+Math.round((this.w-b_img.Width)/2), this.y, b_img.Width, b_img.Height, 0, 0, b_img.Width, b_img.Height,0,opacity);
    }

    this.onClick = function () {
        this.fonClick && this.fonClick();
    }
    this.onDbleClick = function () {
        if(this.fonDbleClick) {this.fonDbleClick && this.fonDbleClick();}
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
	if(properties.showVisualization>0) {
		if(properties.showTrackInfo)
			visu_margin_left = 29 + bar_margin;
		else visu_margin_left = ww/2 - 3 - bar_margin;
	}
	else visu_margin_left = 0;
}

function on_paint(gr) {
	dont_resize = false;
	if(ww == 0 || wh == 0) return;
	if(!fb.IsPlaying){
		if(layout_state.isEqual(0) && mini_controlbar.isActive() && showtrackinfo_big.isActive()) {
			g_cover.setArtwork(images.nothing_played_compact,false,true);
			nowPlaying_cachekey = null;
		} else if(layout_state.isEqual(0) && mini_controlbar.isActive()){
			g_cover.setArtwork(images.nothing_played_supercompact,false,true);
			nowPlaying_cachekey = null;
		} else if(layout_state.isEqual(0)) {
			g_cover.setArtwork(images.nothing_played,false,true);
			nowPlaying_cachekey = null;
		} else {
			g_cover.setArtwork(images.nothing_played_mini,false,true);
			nowPlaying_cachekey = null;
		}
	}
	if(!g_cover.isSetArtwork()) {
		try{
			tracktype = TrackType(fb.GetNowPlaying());
			if(tracktype == 3) g_cover.setArtwork(globalProperties.stream_img,true,true)
			else g_cover.setArtwork(globalProperties.nocover_img,true,true);
		} catch (e){g_cover.setArtwork(globalProperties.nocover_img,true,true)}
	}

	g_cover.draw(gr,0,0);

	if(fb.IsPlaying){
		gr.FillGradRect(0,-1, ww, wh+1, 270, colors.grad_bottom, colors.grad_top,1);
		if(properties.showVisualization>0 && !fb.IsPaused && !Randomsetfocus && (!g_cover.sidebar_isplaying || layout_state.isEqual(1) || properties.showVisualization==2 || !getTrackInfosVisibility())) {
			gr.FillGradRect(0,0, ww, wh, 0, colors.visu_grad_borders, colors.visu_grad_middle, 0.5);
			gr.FillSolidRect(visu_margin_left, wh/2-height_bar_1+global_vertical_fix+Visualization_top_m, bar_width, height_bar_1, colors.animation);
			gr.FillSolidRect(visu_margin_left + bar_margin + bar_width, wh/2-height_bar_3+global_vertical_fix+Visualization_top_m, bar_width, height_bar_3, colors.animation);
			gr.FillSolidRect(visu_margin_left + bar_margin*2 + bar_width*2, wh/2-height_bar_2+global_vertical_fix+Visualization_top_m, bar_width, height_bar_2, colors.animation);
		}
	}

	drawAllButtons(gr);
	switch(true){
		case (main_panel_state.isEqual(0) && properties.library_dark_theme && layout_state.isEqual(0)):
		case (main_panel_state.isEqual(1) && properties.playlists_dark_theme && layout_state.isEqual(0)):
		case (main_panel_state.isEqual(2) && properties.bio_dark_theme && layout_state.isEqual(0)):
		case (main_panel_state.isEqual(3) && layout_state.isEqual(0)):
		case (properties.minimode_dark_theme && layout_state.isEqual(1)):
			gr.FillSolidRect(0, 0, ww, border_top, colors.border_light);
		break;
		default:
			gr.FillSolidRect(0, 0, ww, border_top, colors.border_dark);
		break;
	}

	gr.FillSolidRect(0, wh-border_bottom, ww, border_right, colors.border_dark);
	gr.FillGradRect(0, wh-1, ww, 1, 0,colors.line_bottom,colors.line_bottom);
	//if(!properties.darklayout) gr.FillSolidRect(ww-1, 0, 1, wh, colors.border_right);
}
function on_size(w, h) {
    ww = w;
    wh = h;
	calculate_visu_margin_left();
	text_height=wh-8;
	if(properties.showVisualization>0) startAnimation();
    positionButtons();
	g_cover.setSize(ww,wh);
}

function on_mouse_lbtn_up(x, y) {
    g_down = false;

    if (cur_btn && cur_btn.state!=ButtonStates.hide && !g_dble_click) {
        cur_btn.onClick();
        window.Repaint();
    }
    g_dble_click=false;
}
function on_mouse_lbtn_down(x, y) {
    g_down = true;
    click_on_btn = false;
    cur_btn = chooseButton(x, y);
    if (cur_btn && cur_btn.state!=ButtonStates.hide) {
        cur_btn.changeState(ButtonStates.down);
		click_on_btn=true;
        window.Repaint();
    }
    if(!fb.IsPlaying) {
        play_random(properties.random_function);
    } else if(!click_on_btn) {
        showNowPlaying(false);
    }
	g_tooltip.Deactivate();
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
				if(!g_cover.isFiller()) openCoverFullscreen(fb.GetNowPlaying());
			break;
			case (properties.dble_click_action==3):
				fb.RunContextCommandWithMetadb("Open containing folder", fb.GetNowPlaying(), 8);
			break;
			case (properties.dble_click_action==4):
				window.NotifyOthers('toggleLayoutMode',true);
			break;
		}
	}
}

function on_mouse_move(x, y, m) {
    if(g_cursor.x == x && g_cursor.y == y) return;
	g_cursor.onMouse("move", x, y, m);
	g_cover.onMouse("move", x, y, m);
    if(!fb.IsPlaying) {
        tooltip_text = "Play randomly"
    } else if(!fb.IsPaused) {
        tooltip_text = "Show now playing\nDouble-click : "+tooltipDoubleClicText;
    } else {
		tooltip_text = "Resume playback"
	}
	g_tooltip.ActivateDelay(tooltip_text, x+10, y+20, globalProperties.tooltip_delay, 1200, false, 'track_title');
}

function on_mouse_leave() {
	g_cursor.onMouse("leave", 0, 0);
	g_cover.onMouse("leave", 0, 0);
	g_tooltip.Deactivate();
    g_down = false;
    if (cur_btn) {
        cur_btn.changeState(ButtonStates.normal);
        window.Repaint();
    }
}

function on_playback_stop(){
	resetAnimation();
	window.Repaint();
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

    g_dragndrop_x = x;
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
    this.hit = function (metadb) {
		var img;
		old_cachekey = nowPlaying_cachekey;
		nowPlaying_cachekey = process_cachekey(metadb);		
		try{img = this.cachelist[nowPlaying_cachekey];}catch(e){}
		if (typeof(img) == "undefined" || img == null && globalProperties.enableDiskCache ) {
			cache_filename = check_cache(metadb, 0, nowPlaying_cachekey);
			if(cache_filename) {
				img = load_image_from_cache_direct(cache_filename);
				cover_path = cache_filename;
			} else {
				get_albumArt_async(metadb,AlbumArtId.front, nowPlaying_cachekey, {isplaying:true});
			}
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
	this.resized = false;
	this.sidebar_isplaying = false;
	this.artwork = null;
	this.artwork_resized = null;
	this.tintDrawed = false;
	this.filler = false;
	this.repaint = function() {window.Repaint()}
	this.reset = function() {
		this.artwork = null;
		this.artwork_resized = null;
		this.resized = false;
	}
	this.isSetArtwork = function() {
		return isImage(this.artwork);
	}
	this.isFiller = function() {
		return this.filler;
	}
	this.setArtwork = function(image, resize, filler) {
		this.filler = typeof filler !== 'undefined' ? filler : false;
		this.resized = false;
		this.artwork = image;
		if(!isImage(image)) return;
		if(resize && this.w>0 && this.h>0) {
			this.resize();
		}
	}
	this.getArtwork = function(metadb) {
		var img = g_image_cache.hit(metadb);
		if(img=="unchanged") return;
		if(isImage(img) && !globalProperties.loaded_covers2memory) g_image_cache.resetAll();
		this.setArtwork(img,true,false);
	}
	this.resize = function(w,h) {
		var w = typeof w !== 'undefined' ? w : this.w;
		var h = typeof h !== 'undefined' ? h : this.h;
		this.artwork_resized = FormatCover(this.artwork,this.w+1,this.h+1,properties.rawBitmap);
		this.resized = true;
	}
    this.setSize = function(w, h) {
		this.w = w;
		this.h = h;
		if(this.isSetArtwork()) this.resize();
    };
	this.draw = function(gr, x, y) {
		this.x = x;
		this.y = y;
		if(this.resized)
			gr.DrawImage(this.artwork_resized, this.x-1, this.y-1, this.w+1, this.h+1, 0, 0, this.artwork_resized.Width, this.artwork_resized.Height);
		else
			gr.DrawImage(this.artwork, this.x, this.y, this.w, this.h, 0, 0, this.artwork.Width, this.artwork.Height);
		if(properties.tintOnHover && this.isHover){
			gr.FillSolidRect(0, 0, ww, wh, colors.overlay_on_hover);
			this.tintDrawed = true;
		}
    };
    this.refresh = function (metadb, call_delete_file_cache, cachekey) {
		cachekey = typeof cachekey !== 'undefined' ? cachekey : process_cachekey(metadb);
		call_delete_file_cache = typeof call_delete_file_cache !== 'undefined' ? call_delete_file_cache : false;
		if(globalProperties.enableDiskCache && call_delete_file_cache) delete_file_cache(metadb,0, cachekey);
		this.reset();
		g_image_cache.resetMetadb(metadb);
		nowPlaying_cachekey = "";
		this.getArtwork(metadb);
		window.Repaint();
	}
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
				if(x>this.x && x<this.x+this.w && y>this.y && y<this.y+this.h){
					g_cursor.setCursor(IDC_HAND,"coverpanel");
					if(!this.isHover){
						this.isHover = true;
						if(properties.tintOnHover && !this.tintDrawed){
							window.Repaint();
						}
					}
				} else {
					g_cursor.setCursor(IDC_ARROW,17);
					this.isHover = false;
					this.tintDrawed = false;
					window.Repaint();
				}
			break;
			case 'leave':
				this.x = -1;
				this.y = -1;
				if(this.isHover){
					g_cursor.setCursor(IDC_ARROW,18);
					this.isHover = false;
					this.tintDrawed = false;
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
function on_playback_new_track(metadb) {
	if (metadb)	{
		//current_played_track = metadb;
		g_cover.getArtwork(metadb);
		if(!animationTimer && properties.showVisualization>0) startAnimation();
		//setRatingBtn(metadb);
	}
	window.Repaint();
}
function on_playback_time() {
	if(!animationTimer && properties.showVisualization>0) {startAnimation();}
}
function on_layout_change() {
	if(layout_state.isEqual(0)) properties.darklayout = properties.maindarklayout;
	else properties.darklayout = properties.minidarklayout;

	if(properties.forcedarklayout) properties.darklayout = true;
	else if(layout_state.isEqual(0)) {
		switch(main_panel_state.value){
			case 0:
				properties.darklayout = properties.library_dark_theme || (globalProperties.colorsMainPanel!=0);
			break;
			case 1:
				properties.darklayout = properties.playlists_dark_theme || (globalProperties.colorsMainPanel!=0);
			break;
			case 2:
				properties.darklayout = properties.bio_dark_theme || (globalProperties.colorsMainPanel!=0);
			break;
			case 3:
				properties.darklayout = properties.visualization_dark_theme || (globalProperties.colorsMainPanel!=0);
			break;
		}
	} else properties.darklayout = properties.minimode_dark_theme || (globalProperties.colorsMainPanel!=0);

    if(!fb.IsPlaying) {
		g_cover.reset();
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
	   case "coverpanel_state_big":
			coverpanel_state_big.value = info;
		break;
	   case "coverpanel_state_mini":
			coverpanel_state_mini.value = info;
		break;
		case "RefreshImageCover":
			var metadb = new FbMetadbHandleList(info);
			if(fb.IsPlaying && metadb[0].Compare(fb.GetNowPlaying()))
				g_cover.refresh(fb.GetNowPlaying(),true);
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
		case "main_panel_state":
			if(main_panel_state!=info) {
				main_panel_state.value = info;
				on_layout_change();
				window.Repaint();
			}
		break;
		case "nowplayinglib_state":
			nowplayinglib_state.value=info;
			if(properties.showVisualization==1) window.Repaint();
		break;
		case "nowplayingplaylist_state":
			nowplayingplaylist_state.value=info;
			if(properties.showVisualization==1) window.Repaint();
		break;
		case "nowplayingbio_state":
			nowplayingbio_state.value=info;
			if(properties.showVisualization==1) window.Repaint();
		break;
		case "nowplayingvisu_state":
			nowplayingvisu_state.value=info;
			if(properties.showVisualization==1) window.Repaint();
		break;
		case "trackinfoslib_state":
			trackinfoslib_state.value=info;
			if(properties.showVisualization==1) window.Repaint();
		break;
		case "trackinfosplaylist_state":
			trackinfosplaylist_state.value=info;
			if(properties.showVisualization==1) window.Repaint();
		break;
		case "trackinfosbio_state":
			trackinfosbio_state.value=info;
			if(properties.showVisualization==1) window.Repaint();
		break;
		case "trackinfosvisu_state":
			trackinfosvisu_state.value=info;
			if(properties.showVisualization==1) window.Repaint();
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
		case "sidebar_isplaying":
			g_cover.sidebar_isplaying = info;
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
		/*case "rating_updated":
			if(current_played_track && info.Compare(current_played_track)){
				setRatingBtn(info);
				window.Repaint();
			}
		break;*/
	}
}
function showNowPlayingCover(){
	if (globalProperties.enableDiskCache) {
		cache_filename = check_cache(fb.GetNowPlaying(), 0, nowPlaying_cachekey);
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
function on_mouse_rbtn_up(x, y){
	var main_menu = window.CreatePopupMenu();
	var Context = fb.CreateContextMenuManager();
	var context_menu = window.CreatePopupMenu();	
	var idx;

	main_menu.AppendMenuItem(MF_STRING, 35, "Settings...");
	main_menu.AppendMenuSeparator();
	if(fb.IsPlaying){
		var now_playing_track = fb.GetNowPlaying();
		main_menu.AppendMenuItem(MF_STRING, 1, "Open cover in its full/original size");
		main_menu.AppendMenuItem(MF_STRING, 9, "Show now playing on all panels");
		main_menu.AppendMenuItem(MF_STRING, 6, "Open containing folder");
		main_menu.AppendMenuItem(MF_STRING, 8, "Refresh this image");
		var quickSearchMenu = window.CreatePopupMenu();
		quickSearchMenu.AppendMenuItem(MF_STRING, 34,"Same title");
		quickSearchMenu.AppendMenuItem(MF_STRING, 30,"Same artist");
		quickSearchMenu.AppendMenuItem(MF_STRING, 31,"Same album");
		quickSearchMenu.AppendMenuItem(MF_STRING, 32,"Same genre");
		quickSearchMenu.AppendMenuItem(MF_STRING, 33,"Same date");
		quickSearchMenu.AppendTo(main_menu, MF_STRING, "Quick search for...");
		main_menu.AppendMenuSeparator();
	} else {
		var checked_item_menu=3;
		main_menu.AppendMenuItem(MF_DISABLED, 0, "Play randomly :");
		main_menu.AppendMenuSeparator();
		main_menu.AppendMenuItem(MF_STRING, 3, "Tracks");
			if(properties.random_function=='200_tracks') checked_item_menu=3;
		main_menu.AppendMenuItem(MF_STRING, 2, "Albums");
			if(properties.random_function=='20_albums') checked_item_menu=2;
		main_menu.AppendMenuItem(MF_STRING, 5, "Artist");
			if(properties.random_function=='1_artist') checked_item_menu=5;

		var genreValue=parseInt(properties.random_function);
			main_menu.AppendMenuItem(MF_STRING, 4, "Genre");
		if((genreValue >= 1000 && genreValue < 2001) || properties.random_function=='1_genre')	checked_item_menu=4;

		main_menu.CheckMenuRadioItem(2, 5, checked_item_menu);

		var genrePopupMenu = window.CreatePopupMenu();
		createGenrePopupMenu(false, -1, genrePopupMenu);
		genrePopupMenu.AppendTo(main_menu, MF_STRING, "A specific genre");
	}
	
	if(fb.IsPlaying){
		//Context.InitContext(new FbMetadbHandleList(fb.GetNowPlaying()));
		//Context.BuildMenu(context_menu, 100, -1);
		//context_menu.AppendTo(main_menu, MF_STRING, "Track properties");
		main_menu.AppendMenuItem(MF_STRING, 200, "Properties");
	}
	if(utils.IsKeyPressed(VK_SHIFT)) {
		main_menu.AppendMenuSeparator();
		main_menu.AppendMenuItem(MF_STRING, 100, "Properties ");
		main_menu.AppendMenuItem(MF_STRING, 101, "Configure...");
		main_menu.AppendMenuSeparator();
		main_menu.AppendMenuItem(MF_STRING, 102, "Reload");
	}
	idx = main_menu.TrackPopupMenu(x,y,0x0020);
	switch(true) {
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
			openCoverFullscreen(fb.GetNowPlaying());
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
			g_cover.refresh(now_playing_track, true);
			window.NotifyOthers("RefreshImageCover",now_playing_track);
			break;
		case (idx == 9):
			showNowPlaying(true);
			break;
		case (idx == 30):
			if(!main_panel_state.isEqual(0) && !main_panel_state.isEqual(1)) {
				main_panel_state.setValue(0)
			}
			quickSearch(fb.GetNowPlaying(),"artist");
			break;
		case (idx == 31):
			if(!main_panel_state.isEqual(0) && !main_panel_state.isEqual(1)) {
				main_panel_state.setValue(0)
			}
			quickSearch(fb.GetNowPlaying(),"album");
			break;
		case (idx == 32):
			if(!main_panel_state.isEqual(0) && !main_panel_state.isEqual(1)) {
				main_panel_state.setValue(0)
			}
			quickSearch(fb.GetNowPlaying(),"genre");
			break;
		case (idx == 33):
			if(!main_panel_state.isEqual(0) && !main_panel_state.isEqual(1)) {
				main_panel_state.setValue(0)
			}
			quickSearch(fb.GetNowPlaying(),"date");
			break;
		case (idx == 34):
			if(!main_panel_state.isEqual(0) && !main_panel_state.isEqual(1)) {
				main_panel_state.setValue(0)
			}
			quickSearch(fb.GetNowPlaying(),"title");
			break;
		case (idx == 35):
			draw_settings_menu(x,y);
			break;
		case (idx == 200):
			fb.RunContextCommandWithMetadb("Properties", fb.GetNowPlaying());
		break;			
		case (idx >= 100 && idx < 800):
			Context.ExecuteByID(idx - 100);
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
        var idx;

		var _dble_click_menu = window.CreatePopupMenu();
		_dble_click_menu.AppendMenuItem(MF_STRING, 3, "Pause playback");
		_dble_click_menu.AppendMenuItem(MF_STRING, 4, "Show now playing on all panels");
		_dble_click_menu.AppendMenuItem(MF_STRING, 5, "Open cover in its full/original size");
		_dble_click_menu.AppendMenuItem(MF_STRING, 6, "Open containing folder");
		_dble_click_menu.AppendMenuItem(MF_STRING, 7, "Activate/quit mini player");
		_dble_click_menu.CheckMenuRadioItem(3, 7, 3+properties.dble_click_action);
		_dble_click_menu.AppendTo(_menu, MF_STRING, "Double click action");
		_menu.AppendMenuSeparator();

		var _visu_menu = window.CreatePopupMenu();
		_visu_menu.AppendMenuItem(MF_STRING, 8, "Always show");
		_visu_menu.CheckMenuItem(8,properties.showVisualization==2);
		_visu_menu.AppendMenuItem(MF_STRING, 10, "Never");
		_visu_menu.CheckMenuItem(10,properties.showVisualization==0);
		
		_menu.AppendMenuItem(MF_STRING, 8, "Animation on playback");
		_menu.CheckMenuItem(8,properties.showVisualization==2);

		_menu.AppendMenuItem(MF_STRING, 2, "Show now playing artwork");
		_menu.CheckMenuItem(2, (layout_state.isEqual(0)?coverpanel_state_big.isActive():coverpanel_state_mini.isActive()));


        idx = _menu.TrackPopupMenu(x,y,0x0020);
        switch(true) {
            case (idx == 2):
				if(layout_state.isEqual(0)) coverpanel_state_big.toggleValue();
				else coverpanel_state_mini.toggleValue();
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
				if(properties.showVisualization==0) properties.showVisualization = 2;
				else properties.showVisualization = 0;
				window.SetProperty("Show Visualization", properties.showVisualization);
				resetAnimation();
				calculate_visu_margin_left();
				window.Repaint();
				break;
            default:
				return true;
        }
		setTooltipDoubleClicText();
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
	}
}
var colors = {};
function get_colors(){
	if(properties.darklayout) {
		colors.grad_bottom = GetGrey(0,125);
		colors.grad_top = GetGrey(0,30);
		colors.visu_grad_borders = GetGrey(0,0);
		colors.visu_grad_middle = GetGrey(0,50);
		colors.animation = GetGrey(255);
		colors.btn_grad_borders = GetGrey(0,50);
		colors.btn_grad_middle = GetGrey(0,180);
		colors.border_right = GetGrey(0,100);
	} else {
		colors.grad_bottom = GetGrey(0,20);
		colors.grad_top = GetGrey(0,20);
		colors.visu_grad_borders = GetGrey(0,0);
		colors.visu_grad_middle = GetGrey(0,50);
		colors.animation = GetGrey(255);
		colors.btn_grad_borders = GetGrey(0,30);
		colors.btn_grad_middle = GetGrey(0,120);
		colors.border_right = GetGrey(0,10);
	}
	colors.border_light = GetGrey(255,20);
	colors.border_dark = GetGrey(0,50);
	colors.line_bottom = GetGrey(40,200);

	colors.overlay_on_hover = GetGrey(0,130);
}
function get_images(){
	if(properties.darklayout) var theme_path = "controls_Dark"; else var theme_path = "controls_Light";
	images.mini_pause_img = gdi.Image(theme_img_path + "\\controls_Dark\\pause_btn_mini.png");
	images.mini_mini_pause_img = gdi.Image(theme_img_path + "\\controls_Dark\\pause_btn_mini_mini.png");
	images.pause_img = gdi.Image(theme_img_path + "\\controls_Dark\\pause_btn.png");
	images.random_img = gdi.Image(theme_img_path + "\\controls_Dark\\play_random.png");
	images.random_img_mini = gdi.Image(theme_img_path + "\\controls_Dark\\play_random_mini.png");
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
}
function on_init(){
	g_image_cache = new oImageCache;
	g_genre_cache = new oGenreCache();
	g_cover = new oCover();
	g_cursor = new oCursor();
	g_tooltip = new oTooltip();
	setTooltipDoubleClicText();
	get_colors();
	get_images();
	setButtons();
	on_layout_change();
	if(fb.IsPlaying) g_cover.getArtwork(fb.GetNowPlaying());
}
on_init();
