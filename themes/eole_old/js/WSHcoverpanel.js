<<<<<<< HEAD
var colors = {};
var properties = {
	panelName: 'WSHcoverpanel',		
    enableDiskCache: window.GetProperty("COVER Disk Cache", true),		
	showVisualization: window.GetProperty("Show Visualization", true),
	showTrackInfo: window.GetProperty("Show track info", false),	
    random_function: window.GetProperty("Random function", "default"),	
	maindarklayout: window.GetProperty("_DISPLAY: Main layout:Dark", false),		
	minidarklayout: window.GetProperty("_DISPLAY: Mini layout:Dark", false),	
    minimode_dark_theme: window.GetProperty("MINIMODE dark theme", false),
    library_dark_theme: window.GetProperty("LIBRARY dark theme", false),	
    screensaver_dark_theme: window.GetProperty("SCREENSAVER dark theme", false),	
    playlists_dark_theme: window.GetProperty("PLAYLISTS dark theme", false),
    bio_dark_theme: window.GetProperty("BIO dark theme", false),	
    dble_click_action: window.GetProperty("PROPERTY double click action", 0),	
	deleteSpecificImageCache : window.GetProperty("COVER cachekey of covers to delete on next startup", ""),
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
		/*Rating: new SimpleButton(ww/2-images.rating0_img.Width/2, wh/2-images.rating0_img.Height/2+global_vertical_fix, 32, 32, "rating", function () {
			if(fb.IsPlaying) {
				current_played_track = fb.GetNowPlaying();
				g_rating = Number(g_rating);
				old_g_rating = g_rating;
				if(g_rating<5) {
					g_rating = g_rating+1;
				} else {
					g_rating = 0;
				}
				setRatingBtn(current_played_track, g_rating);
				clearTimeout(timers.SetRating);
				timers.SetRating = setTimeout(function() {
					g_rating = rateSong(g_rating, old_g_rating, current_played_track);
					clearTimeout(timers.SetRating);
					timers.SetRating = false;
				}, 300);
			}
		},function () {
			if(fb.IsPlaying) {
				g_rating = Number(g_rating);
				old_g_rating = g_rating;
				if(g_rating<5) {
					g_rating = g_rating+1;
				} else {
					g_rating = 0;
				}
				setRatingBtn(current_played_track, g_rating);
				clearTimeout(timers.SetRating);
				timers.SetRating = setTimeout(function() {
					g_rating = rateSong(g_rating, old_g_rating, current_played_track);
					clearTimeout(timers.SetRating);
					timers.SetRating = false;
				}, 300);					
			}
		},images.rating0_img,images.rating0_img_hover),	*/
		Random: new SimpleButton( ww/2-images.pause_img.Width/2, wh/2-images.pause_img.Height/2+global_vertical_fix, 74, 74, "Random", function () {
			play_random(true,properties.random_function);
		},null,images.random_img,images.random_img)         
	}  
} 
function setRatingBtn(metadb,new_rating){
	metadb = typeof metadb !== 'undefined' ? metadb : fb.GetNowPlaying();
	if (metadb) {
		if(typeof new_rating == 'undefined') g_rating = fb.TitleFormat("$if2(%rating%,0)").EvalWithMetadb(metadb);
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
	} else {
		buttons.Random.N_img = images.random_img_mini;
		buttons.Random.H_img = images.random_img_mini;	
		buttons.Random.D_img = images.random_img_mini;			
	}
	//if(typeof g_rating !== 'undefined') setRatingBtn();	
}
function positionButtons(){
    for (var i in buttons) {
		buttons[i].x=Math.round(ww/2-buttons[i].w/2);
		buttons[i].y=Math.round(wh/2-buttons[i].N_img.Height/2+global_vertical_fix);	
		//if(buttons[i].text=='rating') buttons[i].y-=2;
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
	if(properties.showVisualization || globalProperties.enable_screensaver){
		animationTimer = setInterval(function() {
			animationCounter++;
			if(fb.IsPlaying && globalProperties.enable_screensaver && !screensaver_state.isActive() && layout_state.isEqual(0)){
				current_ms = (new Date).getTime();
				if(current_ms >= last_mouse_move_notified+globalProperties.mseconds_before_screensaver){
					screensaver_state.setValue(1);
				}
			}
			if(fb.IsPlaying && !fb.IsPaused && !Randomsetfocus && window.IsVisible) {	
				//Restart if the animation is desyncronised
				try{				
					if(Math.abs(animationStartTime+animationCounter*properties.refreshRate-Date.now())>500){
						resetAnimation();
						startAnimation();				
					}	
				}catch(e){}		
				if(properties.showVisualization) {
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
	if(properties.showVisualization) {
		if(properties.showTrackInfo)
			visu_margin_left = 29 + bar_margin;
		else visu_margin_left = ww/2 - 3 - bar_margin;
	}	
	else visu_margin_left = 0;	
}

function on_paint(gr) {
	dont_resize = false;
	if(!fb.IsPlaying){
		if(layout_state.isEqual(0) && mini_controlbar.isActive() && showtrackinfo_big.isActive()) {
			g_cover.setArtwork(images.nothing_played_compact,false);
			nowPlaying_cachekey = null;	
		} else if(layout_state.isEqual(0) && mini_controlbar.isActive()){
			g_cover.setArtwork(images.nothing_played_supercompact,false);
			nowPlaying_cachekey = null;	
		} else if(layout_state.isEqual(0)) {
			g_cover.setArtwork(images.nothing_played,false);
			nowPlaying_cachekey = null;			
		} else {
			g_cover.setArtwork(images.nothing_played_mini,false);
			nowPlaying_cachekey = null;			
		} 
	}
	if(!g_cover.isSetArtwork()) {
		try{
			tracktype = TrackType(fb.GetNowPlaying().RawPath.substring(0, 4));
			if(tracktype == 3) g_cover.setArtwork(images.stream_img,true)
			else g_cover.setArtwork(images.no_cover,true);
		} catch (e){g_cover.setArtwork(images.no_cover,true)}	
	}
	
	g_cover.draw(gr,0,0);
	
	if(fb.IsPlaying){
		gr.FillGradRect(0,-1, ww, wh+1, 270, colors.grad_bottom, colors.grad_top,1); 		
		if(properties.showVisualization && !fb.IsPaused && !Randomsetfocus) {
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
}
function on_size() {
    ww = window.Width;
    wh = window.Height;
	calculate_visu_margin_left();
	text_height=wh-8;	
	if(properties.showVisualization || globalProperties.enable_screensaver) startAnimation();
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
        play_random(true,properties.random_function);
    } else if(!click_on_btn) {
        showNowPlaying(false);      
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
		}
	} 
}

function on_mouse_move(x, y, m) {    
    if(g_cursor.x == x && g_cursor.y == y) return;
	g_cursor.onMouse("move", x, y, m);
	g_cover.onMouse("move", x, y, m);
}

function on_mouse_leave() {
	g_cursor.onMouse("leave", 0, 0);
	g_cover.onMouse("leave", 0, 0);
    g_down = false;    
    if (cur_btn) {
        cur_btn.changeState(ButtonStates.normal);
        window.Repaint();
    }    
}

function on_playback_stop(){
	if(!globalProperties.enable_screensaver) resetAnimation();
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
		if(nowPlaying_cachekey==old_cachekey) return null;	
		try{img = this.cachelist[nowPlaying_cachekey];}catch(e){}

		if (typeof(img) == "undefined" || img == null && globalProperties.enableDiskCache ) {			
			cache_exist = check_cache(metadb, 0, nowPlaying_cachekey);	
			// load img from cache	
			
			if(cache_exist) {	
				img = load_image_from_cache_direct(metadb, cache_exist);
				cover_path = cover_img_cache+"\\"+cache_exist+"."+globalProperties.ImageCacheExt;
			} else {
				get_albumArt_async(metadb,AlbumArtId.front);
				//utils.GetAlbumArtAsync(window.ID, metadb, AlbumArtId.front);
			}
		} 
		return img;
    };	
    this.reset = function(key) {
        this.cachelist[key] = null;
    };
	this.resetAll = function(){
		this.cachelist = Array();
	};	
};

oCover = function() {
	this.w = 0;
	this.h = 0;
	this.x = 0;
	this.y = 0;		
	this.resized = false;
	this.artwork = null;
	this.tintDrawed = false;
	this.repaint = function() {window.Repaint()}  
	this.reset = function() {
		this.artwork = null;
		this.artwork_resized = null;		
		this.resized = false;
	}  	
	this.isSetArtwork = function() {
		return !(typeof(this.artwork) != "object" || !this.artwork || this.artwork==null)
	}
	this.setArtwork = function(image, resize) {
		if(typeof(image) != "object" || !image || image==null) return;		
		this.resized = false;
		this.artwork = image;
		if(resize && this.w>0 && this.h>0) {
			this.resize();
		} 
	}	
	this.getArtwork = function(metadb) {
		var img = g_image_cache.hit(metadb);
		if(typeof(image) == "object" && image!=null && !globalProperties.loaded_covers2memory) g_image_cache.resetAll();		
		this.setArtwork(img,true);	
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
    this.refresh = function (metadb, cachekey) {
		cachekey = typeof cachekey !== 'undefined' ? cachekey : process_cachekey(metadb);
		if(globalProperties.enableDiskCache) delete_file_cache(metadb,0, cachekey);
		this.reset();
		g_image_cache.reset();
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
					g_cursor.setCursor(IDC_ARROW);
					this.isHover = false;
					this.tintDrawed = false;
					window.Repaint();					
				}
			break;
			case 'leave':
				this.x = -1;
				this.y = -1;
				if(this.isHover){
					g_cursor.setCursor(IDC_ARROW);					
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
		save_image_to_cache(image, -1, cachekey);	
		g_cover.setArtwork(image,true);
		g_image_cache.cachelist[cachekey] = image;
		g_image_cache.cachelist[cachekey].Resize(globalProperties.thumbnailWidthMax, globalProperties.thumbnailWidthMax,globalProperties.ResizeQLY);				
	}
	else g_cover.reset();
    window.Repaint();
}
function on_playback_new_track(metadb) {
	if (metadb)	{
		//current_played_track = metadb;
		g_cover.getArtwork(metadb);		
		if(!animationTimer && (properties.showVisualization || globalProperties.enable_screensaver)) startAnimation();
		//setRatingBtn(metadb);		
	}
	window.Repaint();     
} 
function on_playback_time() {
	if(!animationTimer && (properties.showVisualization || globalProperties.enable_screensaver)) {startAnimation();}
}	
function on_layout_change() {
	if(layout_state.isEqual(0)) properties.darklayout = properties.maindarklayout;
	else properties.darklayout = properties.minidarklayout;			
    if(!fb.IsPlaying) {
		g_cover.reset();		
    } 	
	get_colors();
	get_images();
	adaptButtons();
}	
function on_notify_data(name, info) {
    switch(name) {
		case "MemSolicitation":
			globalProperties.mem_solicitation = info;
			window.SetProperty("GLOBAL memory solicitation", globalProperties.mem_solicitation);	
			window.Reload();			
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
		case "enable_screensaver":		
			globalProperties.enable_screensaver = info;
			window.SetProperty("GLOBAL enable screensaver", globalProperties.enable_screensaver);	
		break;			
		case "escape_screensaver":		
			last_mouse_move_notified = (new Date).getTime();	
		break;		
		case "mseconds_before_screensaver":		
			globalProperties.mseconds_before_screensaver = info;
			window.SetProperty("GLOBAL screensaver mseconds before activation", globalProperties.mseconds_before_screensaver);	
		break;			
		case "DiskCacheState":
			globalProperties.enableDiskCache = info;
			window.SetProperty("COVER Disk Cache", globalProperties.enableDiskCache);			
			window.Repaint();
		break;  
	   case "coverpanel_state":
			coverpanel_state.value = info;			
			window.Repaint(); 
		break;			
		case "RefreshImageCover":
			var metadb = new FbMetadbHandleList(info);
			if(fb.IsPlaying && metadb[0].Compare(fb.GetNowPlaying()))
				g_cover.refresh(fb.GetNowPlaying());
		break;  					
		case "cover_cache_finalized": 
			//g_image_cache.cachelist = cloneImgs(info);
			window.Repaint();
		break;		
		case "playRandom":
			if(info >= 1000 && info < 2001) properties.random_function = '1_genre';
			else properties.random_function = info;
			window.SetProperty("Random function", properties.random_function);
			play_random(true,info);        
		break; 
		case "main_panel_state":
			if(main_panel_state!=info) {
				main_panel_state.value = info;
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
		case "minimode_dark_theme":
			properties.minimode_dark_theme=info;
			window.SetProperty("MINIMODE dark theme", properties.minimode_dark_theme);
			window.Repaint();		
		break; 		
		case "library_dark_theme":
			properties.library_dark_theme=info;
			window.SetProperty("LIBRARY dark theme", properties.library_dark_theme);
			window.Repaint();		
		break; 		
		case "playlists_dark_theme":
			properties.playlists_dark_theme=info;
			window.SetProperty("PLAYLISTS dark theme", properties.playlists_dark_theme);
			window.Repaint();		
		break; 	
		case "bio_dark_theme":	
			properties.bio_dark_theme = info;
			window.SetProperty("BIO dark theme", properties.bio_dark_theme);
			window.Repaint();	
		break; 	
		case "screensaver_dark_theme": 
			properties.screensaver_dark_theme=info;
			window.SetProperty("SCREENSAVER dark theme", properties.screensaver_dark_theme);
			window.Repaint();	
		break;			
		case "screensaver_state": 
			screensaver_state.value=info;
		break;			
		case "Randomsetfocus":
			Randomsetfocus = info;
			window.Repaint();
		break; 	
		case "layout_state":
			layout_state.value = info;
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
function on_mouse_rbtn_up(x, y){	
        var main_menu = window.CreatePopupMenu();
        var idx;
		
		main_menu.AppendMenuItem(MF_STRING, 35, "Settings...");	
		main_menu.AppendMenuSeparator();		
		if(fb.IsPlaying){
            var now_playing_track = fb.GetNowPlaying();
			main_menu.AppendMenuItem(MF_STRING, 1, "Open cover");	
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
		}		
		
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
		if(!g_genre_cache.initialized) g_genre_cache.build_from_library();
		createGenrePopupMenu(false, -1, genrePopupMenu);
		genrePopupMenu.AppendTo(main_menu, MF_STRING, "A specific genre");	
		
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
            case (idx == 103):
                properties.showVisualization = !properties.showVisualization;
                window.SetProperty("Show Visualization", properties.showVisualization);
				if(!globalProperties.enable_screensaver) resetAnimation();
				calculate_visu_margin_left();
				window.Repaint();
                break;  				
            case (idx == 1):
				if (globalProperties.enableDiskCache) {	
					cache_exist = check_cache(fb.GetNowPlaying(), 0, nowPlaying_cachekey);	
					// load img from cache				
					if(cache_exist) {	
						cover_path = cover_img_cache+"\\"+cache_exist+"."+globalProperties.ImageCacheExt;
					} else cover_path = "sfsfsf##";
				} else if(fb.GetNowPlaying().path == cover_path) cover_path = cover_path.substring(0, cover_path.lastIndexOf("\\")) + "\\folder.jpg";
				var WshShell = new ActiveXObject("WScript.Shell");		
				try {
					WshShell.Run("\"" + cover_path + "\"", 0);
				} catch(e) {
					HtmlMsg("Error", "Image not found, this cover is probably embedded inside the audio file.","Ok");
				}			
                break;				
            case (idx == 2):
                properties.random_function = '20_albums';
                window.SetProperty("Random function", properties.random_function);
                window.NotifyOthers("SetRandom", properties.random_function);                
				play_random(true,properties.random_function);
                break;
            case (idx == 3):
                properties.random_function = '200_tracks';
                window.SetProperty("Random function", properties.random_function);
                window.NotifyOthers("SetRandom", properties.random_function);                
				play_random(true,properties.random_function);
                break;
            case (idx == 4):
                properties.random_function = '1_genre';
                window.SetProperty("Random function", properties.random_function);
                window.NotifyOthers("SetRandom", properties.random_function);                
				play_random(true,properties.random_function);
                break;	   
            case (idx == 5):
                properties.random_function = '1_artist';
                window.SetProperty("Random function", properties.random_function);
				window.NotifyOthers("playRandom", properties.random_function); 
				play_random(true,properties.random_function);				
                break;						
			case (idx >= 1000 && idx < 2001):
                properties.random_function = '1_genre';
                window.SetProperty("Random function", properties.random_function);
                window.NotifyOthers("SetRandom", properties.random_function);                
				play_random(true,idx);
				break;  				
            case (idx == 7):
                properties.random_function = 'default';
                window.SetProperty("Random function", properties.random_function);
                window.NotifyOthers("SetRandom", properties.random_function);
				play_random(true,properties.random_function);
                break;				
            case (idx == 6):
                fb.RunContextCommandWithMetadb("Open containing folder", now_playing_track, 8);
                break;	
            case (idx == 8):
				g_cover.refresh(now_playing_track);
				window.NotifyOthers("RefreshImageCover",now_playing_track);
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
		_dble_click_menu.CheckMenuRadioItem(3, 4, 3+properties.dble_click_action);		
		_dble_click_menu.AppendTo(_menu, MF_STRING, "Double  click action");     
		_menu.AppendMenuSeparator();
		
		_menu.AppendMenuItem(MF_STRING, 1, "Show an animation when playing");		
		_menu.CheckMenuItem(1,properties.showVisualization);
		_menu.AppendMenuItem(MF_STRING, 2, "Show now playing artwork");
		_menu.CheckMenuItem(2, coverpanel_state.isActive());		

        idx = _menu.TrackPopupMenu(x,y,0x0020);
        switch(true) {
			case (idx == 1):
                properties.showVisualization = !properties.showVisualization;
                window.SetProperty("Show Visualization", properties.showVisualization);
				calculate_visu_margin_left();
				if(!globalProperties.enable_screensaver) resetAnimation();
				window.Repaint();
				break;	
            case (idx == 2):
				coverpanel_state.toggleValue();
                break;			
            case (idx == 3):
				properties.dble_click_action = 0;
				window.SetProperty("PROPERTY double click action", properties.dble_click_action);
                break;		
            case (idx == 4):
				properties.dble_click_action = 1;
				window.SetProperty("PROPERTY double click action", properties.dble_click_action);
                break;					
            default:
				return true;
        }
						
        _menu = undefined;
        return true;	
}
function on_mouse_wheel(step, stepstrait, delta){
	if(typeof(stepstrait) == "undefined" || typeof(delta) == "undefined") intern_step = step;
	else intern_step = stepstrait/delta;		
	fb.Volume=fb.Volume + Math.pow((120+fb.Volume)/100,1/1000)*intern_step*2;
    window.NotifyOthers("AdjustVolume", true);    
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
	} else {
		colors.grad_bottom = GetGrey(0,20);
		colors.grad_top = GetGrey(0,20);
		colors.visu_grad_borders = GetGrey(0,0);
		colors.visu_grad_middle = GetGrey(0,50);
		colors.animation = GetGrey(255);
		colors.btn_grad_borders = GetGrey(0,30);
		colors.btn_grad_middle = GetGrey(0,120);		
	}
	colors.border_light = GetGrey(255,20);
	colors.border_dark = GetGrey(0,50);
	colors.line_bottom = GetGrey(40,200);	
	colors.overlay_on_hover = GetGrey(0,130);		
}
function get_images(){
	if(properties.darklayout) var theme_path = "controls_Dark"; else var theme_path = "controls_Light";	
	
	images.pause_img = gdi.Image(theme_img_path + "\\controls_Dark\\pause_btn.png");
	images.random_img = gdi.Image(theme_img_path + "\\controls_Dark\\play_random.png");
	images.random_img_mini = gdi.Image(theme_img_path + "\\controls_Dark\\play_random_mini.png");	
	images.nothing_played = gdi.Image(theme_img_path + "\\"+theme_path+"\\nothing_played.png");
	images.nothing_played_mini = gdi.Image(theme_img_path + "\\"+theme_path+"\\nothing_played_mini.png");
	images.nothing_played_compact = gdi.Image(theme_img_path + "\\"+theme_path+"\\nothing_played_compact.png");	
	images.nothing_played_supercompact = gdi.Image(theme_img_path + "\\"+theme_path+"\\nothing_played_supercompact.png");	
	images.no_cover = gdi.Image(theme_img_path + "\\no_cover.png");
	images.stream_img = gdi.Image(theme_img_path + "\\stream_icon.png");

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
	get_colors();
	get_images();	
	setButtons();
	on_layout_change();		
	if(fb.IsPlaying) g_cover.getArtwork(fb.GetNowPlaying());
	console.log(window.Width+" "+window.Height)
}
=======
var colors = {};
var properties = {
	panelName: 'WSHcoverpanel',		
    enableDiskCache: window.GetProperty("COVER Disk Cache", true),		
	showVisualization: window.GetProperty("Show Visualization", true),
	showTrackInfo: window.GetProperty("Show track info", false),	
    random_function: window.GetProperty("Random function", "default"),	
	maindarklayout: window.GetProperty("_DISPLAY: Main layout:Dark", false),		
	minidarklayout: window.GetProperty("_DISPLAY: Mini layout:Dark", false),	
    minimode_dark_theme: window.GetProperty("MINIMODE dark theme", false),
    library_dark_theme: window.GetProperty("LIBRARY dark theme", false),	
    screensaver_dark_theme: window.GetProperty("SCREENSAVER dark theme", false),	
    playlists_dark_theme: window.GetProperty("PLAYLISTS dark theme", false),
    bio_dark_theme: window.GetProperty("BIO dark theme", false),	
    dble_click_action: window.GetProperty("PROPERTY double click action", 0),	
	deleteSpecificImageCache : window.GetProperty("COVER cachekey of covers to delete on next startup", ""),
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
		/*Rating: new SimpleButton(ww/2-images.rating0_img.Width/2, wh/2-images.rating0_img.Height/2+global_vertical_fix, 32, 32, "rating", function () {
			if(fb.IsPlaying) {
				current_played_track = fb.GetNowPlaying();
				g_rating = Number(g_rating);
				old_g_rating = g_rating;
				if(g_rating<5) {
					g_rating = g_rating+1;
				} else {
					g_rating = 0;
				}
				setRatingBtn(current_played_track, g_rating);
				clearTimeout(timers.SetRating);
				timers.SetRating = setTimeout(function() {
					g_rating = rateSong(g_rating, old_g_rating, current_played_track);
					clearTimeout(timers.SetRating);
					timers.SetRating = false;
				}, 300);
			}
		},function () {
			if(fb.IsPlaying) {
				g_rating = Number(g_rating);
				old_g_rating = g_rating;
				if(g_rating<5) {
					g_rating = g_rating+1;
				} else {
					g_rating = 0;
				}
				setRatingBtn(current_played_track, g_rating);
				clearTimeout(timers.SetRating);
				timers.SetRating = setTimeout(function() {
					g_rating = rateSong(g_rating, old_g_rating, current_played_track);
					clearTimeout(timers.SetRating);
					timers.SetRating = false;
				}, 300);					
			}
		},images.rating0_img,images.rating0_img_hover),	*/
		Random: new SimpleButton( ww/2-images.pause_img.Width/2, wh/2-images.pause_img.Height/2+global_vertical_fix, 74, 74, "Random", function () {
			play_random(true,properties.random_function);
		},null,images.random_img,images.random_img)         
	}  
} 
function setRatingBtn(metadb,new_rating){
	metadb = typeof metadb !== 'undefined' ? metadb : fb.GetNowPlaying();
	if (metadb) {
		if(typeof new_rating == 'undefined') g_rating = fb.TitleFormat("$if2(%rating%,0)").EvalWithMetadb(metadb);
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
	} else {
		buttons.Random.N_img = images.random_img_mini;
		buttons.Random.H_img = images.random_img_mini;	
		buttons.Random.D_img = images.random_img_mini;			
	}
	//if(typeof g_rating !== 'undefined') setRatingBtn();	
}
function positionButtons(){
    for (var i in buttons) {
		buttons[i].x=Math.round(ww/2-buttons[i].w/2);
		buttons[i].y=Math.round(wh/2-buttons[i].N_img.Height/2+global_vertical_fix);	
		//if(buttons[i].text=='rating') buttons[i].y-=2;
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
	if(properties.showVisualization || globalProperties.enable_screensaver){
		animationTimer = setInterval(function() {
			animationCounter++;
			if(fb.IsPlaying && globalProperties.enable_screensaver && !screensaver_state.isActive() && layout_state.isEqual(0)){
				current_ms = (new Date).getTime();
				if(current_ms >= last_mouse_move_notified+globalProperties.mseconds_before_screensaver){
					screensaver_state.setValue(1);
				}
			}
			if(fb.IsPlaying && !fb.IsPaused && !Randomsetfocus && window.IsVisible) {	
				//Restart if the animation is desyncronised
				try{				
					if(Math.abs(animationStartTime+animationCounter*properties.refreshRate-Date.now())>500){
						resetAnimation();
						startAnimation();				
					}	
				}catch(e){}		
				if(properties.showVisualization) {
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
	if(properties.showVisualization) {
		if(properties.showTrackInfo)
			visu_margin_left = 29 + bar_margin;
		else visu_margin_left = ww/2 - 3 - bar_margin;
	}	
	else visu_margin_left = 0;	
}

function on_paint(gr) {
	dont_resize = false;
	if(!fb.IsPlaying){
		if(layout_state.isEqual(0) && mini_controlbar.isActive() && showtrackinfo_big.isActive()) {
			g_cover.setArtwork(images.nothing_played_compact,false);
			nowPlaying_cachekey = null;	
		} else if(layout_state.isEqual(0) && mini_controlbar.isActive()){
			g_cover.setArtwork(images.nothing_played_supercompact,false);
			nowPlaying_cachekey = null;	
		} else if(layout_state.isEqual(0)) {
			g_cover.setArtwork(images.nothing_played,false);
			nowPlaying_cachekey = null;			
		} else {
			g_cover.setArtwork(images.nothing_played_mini,false);
			nowPlaying_cachekey = null;			
		} 
	}
	if(!g_cover.isSetArtwork()) {
		try{
			tracktype = TrackType(fb.GetNowPlaying().RawPath.substring(0, 4));
			if(tracktype == 3) g_cover.setArtwork(images.stream_img,true)
			else g_cover.setArtwork(images.no_cover,true);
		} catch (e){g_cover.setArtwork(images.no_cover,true)}	
	}
	
	g_cover.draw(gr,0,0);
	
	if(fb.IsPlaying){
		gr.FillGradRect(0,-1, ww, wh+1, 270, colors.grad_bottom, colors.grad_top,1); 		
		if(properties.showVisualization && !fb.IsPaused && !Randomsetfocus) {
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
}
function on_size() {
    ww = window.Width;
    wh = window.Height;
	calculate_visu_margin_left();
	text_height=wh-8;	
	if(properties.showVisualization || globalProperties.enable_screensaver) startAnimation();
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
        play_random(true,properties.random_function);
    } else if(!click_on_btn) {
        showNowPlaying(false);      
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
		}
	} 
}

function on_mouse_move(x, y, m) {    
    if(g_cursor.x == x && g_cursor.y == y) return;
	g_cursor.onMouse("move", x, y, m);
	g_cover.onMouse("move", x, y, m);
}

function on_mouse_leave() {
	g_cursor.onMouse("leave", 0, 0);
	g_cover.onMouse("leave", 0, 0);
    g_down = false;    
    if (cur_btn) {
        cur_btn.changeState(ButtonStates.normal);
        window.Repaint();
    }    
}

function on_playback_stop(){
	if(!globalProperties.enable_screensaver) resetAnimation();
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
		if(nowPlaying_cachekey==old_cachekey) return null;	
		try{img = this.cachelist[nowPlaying_cachekey];}catch(e){}

		if (typeof(img) == "undefined" || img == null && globalProperties.enableDiskCache ) {			
			cache_exist = check_cache(metadb, 0, nowPlaying_cachekey);	
			// load img from cache	
			
			if(cache_exist) {	
				img = load_image_from_cache_direct(metadb, cache_exist);
				cover_path = cover_img_cache+"\\"+cache_exist+"."+globalProperties.ImageCacheExt;
			} else {
				get_albumArt_async(metadb,AlbumArtId.front);
				//utils.GetAlbumArtAsync(window.ID, metadb, AlbumArtId.front);
			}
		} 
		return img;
    };	
    this.reset = function(key) {
        this.cachelist[key] = null;
    };
	this.resetAll = function(){
		this.cachelist = Array();
	};	
};

oCover = function() {
	this.w = 0;
	this.h = 0;
	this.x = 0;
	this.y = 0;		
	this.resized = false;
	this.artwork = null;
	this.tintDrawed = false;
	this.repaint = function() {window.Repaint()}  
	this.reset = function() {
		this.artwork = null;
		this.artwork_resized = null;		
		this.resized = false;
	}  	
	this.isSetArtwork = function() {
		return !(typeof(this.artwork) != "object" || !this.artwork || this.artwork==null)
	}
	this.setArtwork = function(image, resize) {
		if(typeof(image) != "object" || !image || image==null) return;		
		this.resized = false;
		this.artwork = image;
		if(resize && this.w>0 && this.h>0) {
			this.resize();
		} 
	}	
	this.getArtwork = function(metadb) {
		var img = g_image_cache.hit(metadb);
		if(typeof(image) == "object" && image!=null && !globalProperties.loaded_covers2memory) g_image_cache.resetAll();		
		this.setArtwork(img,true);	
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
    this.refresh = function (metadb, cachekey) {
		cachekey = typeof cachekey !== 'undefined' ? cachekey : process_cachekey(metadb);
		if(globalProperties.enableDiskCache) delete_file_cache(metadb,0, cachekey);
		this.reset();
		g_image_cache.reset();
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
					g_cursor.setCursor(IDC_ARROW);
					this.isHover = false;
					this.tintDrawed = false;
					window.Repaint();					
				}
			break;
			case 'leave':
				this.x = -1;
				this.y = -1;
				if(this.isHover){
					g_cursor.setCursor(IDC_ARROW);					
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
		save_image_to_cache(image, -1, cachekey);	
		g_cover.setArtwork(image,true);
		g_image_cache.cachelist[cachekey] = image;
		g_image_cache.cachelist[cachekey].Resize(globalProperties.thumbnailWidthMax, globalProperties.thumbnailWidthMax,globalProperties.ResizeQLY);				
	}
	else g_cover.reset();
    window.Repaint();
}
function on_playback_new_track(metadb) {
	if (metadb)	{
		//current_played_track = metadb;
		g_cover.getArtwork(metadb);		
		if(!animationTimer && (properties.showVisualization || globalProperties.enable_screensaver)) startAnimation();
		//setRatingBtn(metadb);		
	}
	window.Repaint();     
} 
function on_playback_time() {
	if(!animationTimer && (properties.showVisualization || globalProperties.enable_screensaver)) {startAnimation();}
}	
function on_layout_change() {
	if(layout_state.isEqual(0)) properties.darklayout = properties.maindarklayout;
	else properties.darklayout = properties.minidarklayout;			
    if(!fb.IsPlaying) {
		g_cover.reset();		
    } 	
	get_colors();
	get_images();
	adaptButtons();
}	
function on_notify_data(name, info) {
    switch(name) {
		case "MemSolicitation":
			globalProperties.mem_solicitation = info;
			window.SetProperty("GLOBAL memory solicitation", globalProperties.mem_solicitation);	
			window.Reload();			
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
		case "enable_screensaver":		
			globalProperties.enable_screensaver = info;
			window.SetProperty("GLOBAL enable screensaver", globalProperties.enable_screensaver);	
		break;			
		case "escape_screensaver":		
			last_mouse_move_notified = (new Date).getTime();	
		break;		
		case "mseconds_before_screensaver":		
			globalProperties.mseconds_before_screensaver = info;
			window.SetProperty("GLOBAL screensaver mseconds before activation", globalProperties.mseconds_before_screensaver);	
		break;			
		case "DiskCacheState":
			globalProperties.enableDiskCache = info;
			window.SetProperty("COVER Disk Cache", globalProperties.enableDiskCache);			
			window.Repaint();
		break;  
	   case "coverpanel_state":
			coverpanel_state.value = info;			
			window.Repaint(); 
		break;			
		case "RefreshImageCover":
			var metadb = new FbMetadbHandleList(info);
			if(fb.IsPlaying && metadb[0].Compare(fb.GetNowPlaying()))
				g_cover.refresh(fb.GetNowPlaying());
		break;  					
		case "cover_cache_finalized": 
			//g_image_cache.cachelist = cloneImgs(info);
			window.Repaint();
		break;		
		case "playRandom":
			if(info >= 1000 && info < 2001) properties.random_function = '1_genre';
			else properties.random_function = info;
			window.SetProperty("Random function", properties.random_function);
			play_random(true,info);        
		break; 
		case "main_panel_state":
			if(main_panel_state!=info) {
				main_panel_state.value = info;
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
		case "minimode_dark_theme":
			properties.minimode_dark_theme=info;
			window.SetProperty("MINIMODE dark theme", properties.minimode_dark_theme);
			window.Repaint();		
		break; 		
		case "library_dark_theme":
			properties.library_dark_theme=info;
			window.SetProperty("LIBRARY dark theme", properties.library_dark_theme);
			window.Repaint();		
		break; 		
		case "playlists_dark_theme":
			properties.playlists_dark_theme=info;
			window.SetProperty("PLAYLISTS dark theme", properties.playlists_dark_theme);
			window.Repaint();		
		break; 	
		case "bio_dark_theme":	
			properties.bio_dark_theme = info;
			window.SetProperty("BIO dark theme", properties.bio_dark_theme);
			window.Repaint();	
		break; 	
		case "screensaver_dark_theme": 
			properties.screensaver_dark_theme=info;
			window.SetProperty("SCREENSAVER dark theme", properties.screensaver_dark_theme);
			window.Repaint();	
		break;			
		case "screensaver_state": 
			screensaver_state.value=info;
		break;			
		case "Randomsetfocus":
			Randomsetfocus = info;
			window.Repaint();
		break; 	
		case "layout_state":
			layout_state.value = info;
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
function on_mouse_rbtn_up(x, y){	
        var main_menu = window.CreatePopupMenu();
        var idx;
		
		main_menu.AppendMenuItem(MF_STRING, 35, "Settings...");	
		main_menu.AppendMenuSeparator();		
		if(fb.IsPlaying){
            var now_playing_track = fb.GetNowPlaying();
			main_menu.AppendMenuItem(MF_STRING, 1, "Open cover");	
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
		}		
		
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
		if(!g_genre_cache.initialized) g_genre_cache.build_from_library();
		createGenrePopupMenu(false, -1, genrePopupMenu);
		genrePopupMenu.AppendTo(main_menu, MF_STRING, "A specific genre");	
		
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
            case (idx == 103):
                properties.showVisualization = !properties.showVisualization;
                window.SetProperty("Show Visualization", properties.showVisualization);
				if(!globalProperties.enable_screensaver) resetAnimation();
				calculate_visu_margin_left();
				window.Repaint();
                break;  				
            case (idx == 1):
				if (globalProperties.enableDiskCache) {	
					cache_exist = check_cache(fb.GetNowPlaying(), 0, nowPlaying_cachekey);	
					// load img from cache				
					if(cache_exist) {	
						cover_path = cover_img_cache+"\\"+cache_exist+"."+globalProperties.ImageCacheExt;
					} else cover_path = "sfsfsf##";
				} else if(fb.GetNowPlaying().path == cover_path) cover_path = cover_path.substring(0, cover_path.lastIndexOf("\\")) + "\\folder.jpg";
				var WshShell = new ActiveXObject("WScript.Shell");		
				try {
					WshShell.Run("\"" + cover_path + "\"", 0);
				} catch(e) {
					HtmlMsg("Error", "Image not found, this cover is probably embedded inside the audio file.","Ok");
				}			
                break;				
            case (idx == 2):
                properties.random_function = '20_albums';
                window.SetProperty("Random function", properties.random_function);
                window.NotifyOthers("SetRandom", properties.random_function);                
				play_random(true,properties.random_function);
                break;
            case (idx == 3):
                properties.random_function = '200_tracks';
                window.SetProperty("Random function", properties.random_function);
                window.NotifyOthers("SetRandom", properties.random_function);                
				play_random(true,properties.random_function);
                break;
            case (idx == 4):
                properties.random_function = '1_genre';
                window.SetProperty("Random function", properties.random_function);
                window.NotifyOthers("SetRandom", properties.random_function);                
				play_random(true,properties.random_function);
                break;	   
            case (idx == 5):
                properties.random_function = '1_artist';
                window.SetProperty("Random function", properties.random_function);
				window.NotifyOthers("playRandom", properties.random_function); 
				play_random(true,properties.random_function);				
                break;						
			case (idx >= 1000 && idx < 2001):
                properties.random_function = '1_genre';
                window.SetProperty("Random function", properties.random_function);
                window.NotifyOthers("SetRandom", properties.random_function);                
				play_random(true,idx);
				break;  				
            case (idx == 7):
                properties.random_function = 'default';
                window.SetProperty("Random function", properties.random_function);
                window.NotifyOthers("SetRandom", properties.random_function);
				play_random(true,properties.random_function);
                break;				
            case (idx == 6):
                fb.RunContextCommandWithMetadb("Open containing folder", now_playing_track, 8);
                break;	
            case (idx == 8):
				g_cover.refresh(now_playing_track);
				window.NotifyOthers("RefreshImageCover",now_playing_track);
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
		_dble_click_menu.CheckMenuRadioItem(3, 4, 3+properties.dble_click_action);		
		_dble_click_menu.AppendTo(_menu, MF_STRING, "Double  click action");     
		_menu.AppendMenuSeparator();
		
		_menu.AppendMenuItem(MF_STRING, 1, "Show an animation when playing");		
		_menu.CheckMenuItem(1,properties.showVisualization);
		_menu.AppendMenuItem(MF_STRING, 2, "Show now playing artwork");
		_menu.CheckMenuItem(2, coverpanel_state.isActive());		

        idx = _menu.TrackPopupMenu(x,y,0x0020);
        switch(true) {
			case (idx == 1):
                properties.showVisualization = !properties.showVisualization;
                window.SetProperty("Show Visualization", properties.showVisualization);
				calculate_visu_margin_left();
				if(!globalProperties.enable_screensaver) resetAnimation();
				window.Repaint();
				break;	
            case (idx == 2):
				coverpanel_state.toggleValue();
                break;			
            case (idx == 3):
				properties.dble_click_action = 0;
				window.SetProperty("PROPERTY double click action", properties.dble_click_action);
                break;		
            case (idx == 4):
				properties.dble_click_action = 1;
				window.SetProperty("PROPERTY double click action", properties.dble_click_action);
                break;					
            default:
				return true;
        }
						
        _menu = undefined;
        return true;	
}
function on_mouse_wheel(step, stepstrait, delta){
	if(typeof(stepstrait) == "undefined" || typeof(delta) == "undefined") intern_step = step;
	else intern_step = stepstrait/delta;		
	fb.Volume=fb.Volume + Math.pow((120+fb.Volume)/100,1/1000)*intern_step*2;
    window.NotifyOthers("AdjustVolume", true);    
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
	} else {
		colors.grad_bottom = GetGrey(0,20);
		colors.grad_top = GetGrey(0,20);
		colors.visu_grad_borders = GetGrey(0,0);
		colors.visu_grad_middle = GetGrey(0,50);
		colors.animation = GetGrey(255);
		colors.btn_grad_borders = GetGrey(0,30);
		colors.btn_grad_middle = GetGrey(0,120);		
	}
	colors.border_light = GetGrey(255,20);
	colors.border_dark = GetGrey(0,50);
	colors.line_bottom = GetGrey(40,200);	
	colors.overlay_on_hover = GetGrey(0,130);		
}
function get_images(){
	if(properties.darklayout) var theme_path = "controls_Dark"; else var theme_path = "controls_Light";	
	
	images.pause_img = gdi.Image(theme_img_path + "\\controls_Dark\\pause_btn.png");
	images.random_img = gdi.Image(theme_img_path + "\\controls_Dark\\play_random.png");
	images.random_img_mini = gdi.Image(theme_img_path + "\\controls_Dark\\play_random_mini.png");	
	images.nothing_played = gdi.Image(theme_img_path + "\\"+theme_path+"\\nothing_played.png");
	images.nothing_played_mini = gdi.Image(theme_img_path + "\\"+theme_path+"\\nothing_played_mini.png");
	images.nothing_played_compact = gdi.Image(theme_img_path + "\\"+theme_path+"\\nothing_played_compact.png");	
	images.nothing_played_supercompact = gdi.Image(theme_img_path + "\\"+theme_path+"\\nothing_played_supercompact.png");	
	images.no_cover = gdi.Image(theme_img_path + "\\no_cover.png");
	images.stream_img = gdi.Image(theme_img_path + "\\stream_icon.png");

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
	get_colors();
	get_images();	
	setButtons();
	on_layout_change();		
	if(fb.IsPlaying) g_cover.getArtwork(fb.GetNowPlaying());
	console.log(window.Width+" "+window.Height)
}
>>>>>>> 71502ac18754c6ea83346f7f717903f0fa377744
on_init();