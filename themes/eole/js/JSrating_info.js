var colors = {};
var properties = {
	panelName: 'WSHcoverpanel',
	darklayout: window.GetProperty("_DISPLAY: Dark layout", true),
    minimode_dark_theme: window.GetProperty("MINIMODE dark theme", true),
    library_dark_theme: window.GetProperty("LIBRARY dark theme", false),
    playlists_dark_theme: window.GetProperty("PLAYLISTS dark theme", false),
    visualization_dark_theme: window.GetProperty("VISUALIZATION dark theme", true),
    bio_dark_theme: window.GetProperty("BIO dark theme", true),
    dble_click_action: window.GetProperty("PROPERTY double click action", 0),
	forcedarklayout: window.GetProperty("_DISPLAY: force dark layout", false),
	follow_cursor: window.GetProperty("_DISPLAY: cover follow cursor", false),
	doubleRowText: window.GetProperty("_DISPLAY: doubleRowText", false),
	panelFontAdjustement: 0,
}

var Update_Required_function = "";
var rating_x, imgw = 19.5,
	imgh = imgw;
var is_hover_rating = false;
var rating_hover_id = false;
var g_avoid_on_focus_change = false;
var g_avoid_metadb_updated = false;

var rbutton = Array();
var img_rating_on, img_rating_off;
var ww = 0, wh = 0, rating_spacing = 0;

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

function on_size(w,h) {
	ww = window.Width;
	wh = window.Height;

	g_infos.setSize(w,h);

	rating_spacing = Math.min(10, (ww-imgw*5) / 5);
	
	var img_rating_w = imgw * 5 + rating_spacing * 4;
	rating_x = (ww - img_rating_w) / 2;
	for(var i = 0; i < rbutton.length; i++){
		index=i-1;
		rbutton[i].setx(rating_x + imgw * index + rating_spacing * index);
	}
	TextBtn_info.setSize(0, rbutton[0].height + 10, ww, wh);
}

function on_paint(gr) {
	if(Update_Required_function!="") {
		eval(Update_Required_function);
		Update_Required_function = "";
	}
	gr.FillSolidRect(0, 0, ww, wh, colors.normal_bg);

	g_infos.draw(gr, 0, 0);

	var side_padding = 10;
	gr.FillGradRect(side_padding, wh - 1, ww - side_padding*2, 1, 0, RGBA(0, 0, 0, 0), colors.border, 0.5);

	if(g_resizing.showResizeBorder()) gr.FillSolidRect(0, 0, 1, wh, colors.dragdrop_marker_line);
	else gr.FillSolidRect(0, 0, 1, wh, colors.sidesline);
}
function get_colors() {
	get_colors_global();
}
function get_images() {
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
function on_layout_change(){
	if(properties.forcedarklayout) properties.darklayout = true;
	else {
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
	} 
	get_colors();
	get_images();
}

function initbutton() {
	for(var i = 0; i < 6; i++){
		rbutton[i] = new ButtonUI_R();
	}
}
function on_mouse_move(x, y, m){
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
		g_infos.onMouse("move", x, y, m);

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
function on_mouse_leave() {
	g_resizing.on_mouse("leave", -1, -1);
	g_infos.onMouse("leave", -1, -1);
	if(rating_hover_id){
		rating_hover_id = false;
		window.Repaint();
	}
}
function on_mouse_lbtn_down(x, y, m) {
	var isResizing = g_resizing.on_mouse("lbtn_down", x, y, m);
	if(!isResizing){
	}
};

function on_mouse_lbtn_up(x, y, m) {
	g_resizing.on_mouse("lbtn_up", x, y, m);
	for (var i = 1; i < rbutton.length + 1; i++) {
		rbutton[i - 1].MouseUp(x, y, i);
	}
	if (TextBtn_info.isXYInButton(x, y)) {
		if (fb.IsPlaying) {
			window.NotifyOthers("FocusOnNowPlaying", fb.GetNowPlaying());
			on_notify_data("FocusOnNowPlaying", fb.GetNowPlaying())
		}
	}
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
		g_infos.cycle_infos();
	}
}
function on_mouse_lbtn_dblclk(x, y) {
	if (g_infos.metadb && TextBtn_info.isXYInButton(x, y)) fb.RunContextCommandWithMetadb("Properties", g_infos.metadb);
}

function on_mouse_rbtn_up(x, y) {
	var rMenu = window.CreatePopupMenu();
	rMenu.AppendMenuItem(MF_STRING, 7, "Cover always follow cursor");
	rMenu.CheckMenuItem(7,properties.follow_cursor);
	rMenu.AppendMenuItem(MF_STRING, 8, "Show infos on 2 rows");
	rMenu.CheckMenuItem(8, properties.doubleRowText);
	rMenu.AppendMenuSeparator();
	rMenu.AppendMenuItem(MF_STRING, 1, "Show now playing");
	rMenu.AppendMenuSeparator();
	rMenu.AppendMenuItem(MF_STRING, 2, "Properties");
	if(utils.IsKeyPressed(VK_SHIFT)){
		rMenu.AppendMenuSeparator();
		rMenu.AppendMenuItem(MF_STRING, 5, "Properties");
		rMenu.AppendMenuItem(MF_STRING, 9, "Configure");
		rMenu.AppendMenuSeparator();
		rMenu.AppendMenuItem(MF_STRING, 6, "Reload");
	}
	var a = rMenu.TrackPopupMenu(x, y);
	switch (a) {
	case 1:
		if (fb.IsPlaying) {
			window.NotifyOthers("FocusOnNowPlaying", fb.GetNowPlaying());
			on_notify_data("FocusOnNowPlaying", fb.GetNowPlaying());
		}
		break;
	case 2:
		if (g_infos.metadb) fb.RunContextCommandWithMetadb("Properties", g_infos.metadb);
		break;
	case 4:
		var WshShell = new ActiveXObject("WScript.Shell");
		var obj_file = fb.Titleformat("%path%").EvalWithMetadb(g_infos.metadb);
		WshShell.Run("\"" + fb.FoobarPath + "assemblies\\Mp3tag\\Mp3tag.exe" + "\" " + "\"" + obj_file + "\"", false);
		break;
	case 5:
		window.ShowProperties();
		break;
	case 6:
		window.Reload();
		break;
	case 9:
		window.ShowConfigure();
		break;
	case 7:
		properties.follow_cursor = !properties.follow_cursor;
		window.SetProperty("_DISPLAY: cover follow cursor", properties.follow_cursor);
		g_infos.on_item_focus_change(-1,-1,-1,fb.GetFocusItem());
		window.NotifyOthers("Right_panel_follow_cursor",properties.follow_cursor);
		window.Repaint();
		break;
	case 8:
		properties.doubleRowText = !properties.doubleRowText;
		window.SetProperty("_DISPLAY: doubleRowText", properties.doubleRowText);
		window.Repaint();
		break;
	}
	rMenu = undefined;
	return true;
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

function on_playback_new_track(metadb) {
	g_infos.on_item_focus_change(plman.PlayingPlaylist,-1,-1,metadb);
}

function on_notify_data(name, info) {
	switch (name) {
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
	case "trigger_on_focus_change_album":
		if(properties.follow_cursor || !fb.IsPlaying){
			metadb = new FbMetadbHandleList(info.metadb);
			g_infos.updateInfos(info.firstRow, info.secondRow+" | "+info.length+' | '+info.totalTracks, info.genre, metadb, true)
			g_avoid_on_focus_change = true;
			timers.on_focus_change = setTimeout(function() {
				g_avoid_on_focus_change = false;
				timers.on_focus_change && clearTimeout(timers.on_focus_change);
				timers.on_focus_change = false;
			}, 150);
		}
		break;
	case "trigger_on_focus_change":
		try{
			metadb = new FbMetadbHandleList(info[2]);
			g_infos.on_item_focus_change(info[0], -1, info[1], metadb[0]);
		} catch(e){
			g_infos.on_item_focus_change(info[0], -1, info[1]);
		}
		g_avoid_on_focus_change = true;
		timers.on_focus_change = setTimeout(function() {
			g_avoid_on_focus_change = false;
			timers.on_focus_change && clearTimeout(timers.on_focus_change);
			timers.on_focus_change = false;
		}, 150);
		break;
	case "FocusOnNowPlayingForce":
	case "FocusOnNowPlaying":
		focus_on_now_playing = true;
		var track = new FbMetadbHandleList(info);
		if(fb.IsPlaying && track.Count>0) on_playback_new_track(track[0]);
		focus_on_now_playing = false;
	break;
	case "set_font":
		globalProperties.fontAdjustement = info;
		window.SetProperty("GLOBAL Font Adjustement", globalProperties.fontAdjustement),
		on_font_changed();
		window.Repaint();
	break;
	case "Right_panel_follow_cursor":
		properties.follow_cursor = info;
		window.SetProperty("_DISPLAY: cover follow cursor", properties.follow_cursor);
		if(properties.follow_cursor) g_infos.on_item_focus_change(-1,-1,-1,fb.GetFocusItem());
		else if(fb.IsPlaying) on_playback_new_track(fb.GetNowPlaying());
	break;
	case "minimode_dark_theme":
		properties.minimode_dark_theme=info;
		window.SetProperty("MINIMODE dark theme", properties.minimode_dark_theme);
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
	case "main_panel_state":
		main_panel_state.value = info;
		on_layout_change();
		window.Repaint();
	break;
	}
}

function on_font_changed(){
	get_font();
}
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

	this.Paint = function(gr, button_n) {
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
	this.padding = Array(10,15,0,15);	this.padding
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
	this.on_item_focus_change = function(playlistIndex, from, to, metadb) {
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
		if (this.metadb) {
			this.setTimerCycle();
			this.on_metadb_changed(new FbMetadbHandleList(this.metadb));
		}
	}
	this.on_metadb_changed = function(metadbs, fromhook) {
		if(window.IsVisible || !this.first_populate_done) {

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
	this.updateInfos = function(row1, row2, row3, metadb, album_infos, rating){
		this.txt_line1 = row1;
		this.txt_line2 = row2;
		this.txt_line3 = row3;
		this.line1_width = this.line2_width = this.line3_width = -1;
		this.tooltip_line1 = this.tooltip_line2 = this.tooltip_line3 = false;
		this.album_infos = album_infos;

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
		for (var i = 1; i < rbutton.length + 1; i++) {
			rbutton[i - 1].Paint(gr, i);
		}

		var double_row = (properties.doubleRowText && this.txt_line3 !="" && this.txt_line2 !="");

		if(this.line1_width<0) {
			this.line1_width = gr.CalcTextWidth(this.txt_line1, g_font.italicplus5);
			this.tooltip_line1 = (this.line1_width>this.txt_width);
		}
		gr.GdiDrawText(this.txt_line1, g_font.italicplus5, colors.normal_txt, this.x, this.y + rbutton[0].height + (double_row?0:2), this.txt_width, 34, DT_CENTER | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX | DT_END_ELLIPSIS);

		var line2 = ((this.txt_line2 !="" && this.show_info) || double_row) ? this.txt_line2 : this.txt_line3;
		if(this.line2_width<0) {
			this.line2_width = gr.CalcTextWidth(line2, g_font.min1);
			this.tooltip_line2 = (this.line2_width>this.txt_width);
		}
		gr.GdiDrawText(line2, g_font.min1, colors.faded_txt, this.x, rbutton[0].height+(double_row?32:38), this.txt_width, 30, DT_CENTER | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX | DT_END_ELLIPSIS);

		if(double_row) {
			if(this.line3_width<0) {
				this.line3_width = gr.CalcTextWidth(this.txt_line3, g_font.min2);
				this.tooltip_line3 = (this.line3_width>this.txt_width);
			}
			gr.GdiDrawText(this.txt_line3, g_font.min2, colors.faded_txt, this.x, rbutton[0].height+45, this.txt_width, 30, DT_CENTER | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX | DT_END_ELLIPSIS);
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
function on_init(){
	g_cursor = new oCursor();
	g_resizing = new Resizing("rightsidebar",true,false);
	g_tooltip = new oTooltip();
	get_font();
	g_infos = new oInfos();
	on_layout_change();
	initbutton();
	if(fb.IsPlaying) on_playback_new_track(fb.GetNowPlaying());
	else g_infos.on_item_focus_change(-1,-1,-1,fb.GetFocusItem()); //g_cover.getArtwork(fb.GetFocusItem(), false);
}
on_init();