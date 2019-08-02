var colors = {};
var properties = {
	panelName: 'WSHcoverpanel',		
    enableDiskCache: window.GetProperty("COVER Disk Cache", true),		
	showVisualization: window.GetProperty("Show Visualization", true),
	showTrackInfo: window.GetProperty("Show track info", false),	
    random_function: window.GetProperty("Random function", "default"),	
	darklayout: window.GetProperty("_DISPLAY: Dark layout", true),		
    minimode_dark_theme: window.GetProperty("MINIMODE dark theme", true),
    library_dark_theme: window.GetProperty("LIBRARY dark theme", true),	
    screensaver_dark_theme: window.GetProperty("SCREENSAVER dark theme", true),	
    playlists_dark_theme: window.GetProperty("PLAYLISTS dark theme", true),
    visualization_dark_theme: window.GetProperty("VISUALIZATION dark theme", false),	
    bio_dark_theme: window.GetProperty("BIO dark theme", true),	
    dble_click_action: window.GetProperty("PROPERTY double click action", 0),	
	deleteSpecificImageCache : window.GetProperty("COVER cachekey of covers to delete on next startup", ""),
	forcedarklayout: window.GetProperty("_DISPLAY: force dark layout", false),		
	follow_cursor: window.GetProperty("_DISPLAY: cover follow cursor", false),		
	doubleRowText: window.GetProperty("_DISPLAY: doubleRowText", false),		
	tintOnHover : true,
	rawBitmap: false,
	refreshRate: 50,	
	panelFontAdjustement: 0,	
}

var fbx_set = [-13474766,
-13935317,
-15720176,
-1707291,
-917775,
-10027160,
-12594835,
1682501706,
-15128039,
1.0833333333333332,
false,
1,
0,
'Segoe UI',
13,
0,
true,
true,
false,
true,
0,
true,
'B:\MusicArt\Album',
'B:\MusicArt\Artist',
'B:\MusicArt\Genre',
'cover',
true,
true,
true,
false,
true];
//font
get_font();
var txt_line1 = "";
var txt_line2 = "";
var txt_line3 = "";
var random_color = 0;
var first_populate_done = false;
var foo_spec = utils.CheckComponent("foo_uie_vis_channel_spectrum", true);
var is_mood = window.GetProperty("Display.Mood", false);
var spec_show_bg = window.GetProperty("Spectrum Background: Show bgcolor", true);
var spec_show_grid = window.GetProperty("Spectrum Background: Show grid", true);
var spec_grid_spacing = window.GetProperty("Spectrum Background: Grid spacing", 20);
var ESL_color_delay = window.GetProperty("ESL colorized delayed", 600);
if (spec_grid_spacing <= 0) spec_grid_spacing = 20;
var spec_h = Math.floor(g_fsize * 3 / 12) * 20;
if (spec_h > 300) spec_h = 300;
if (spec_h < 5) spec_h = 5;
var Update_Required_function = "";
spec_grid_spacing = Math.min(spec_grid_spacing, spec_h);
if (spec_h < 6 || !foo_spec) {
	spec_show_bg = false;
	spec_show_grid = false;
}
var g_metadb;
var album_infos = false;
var top_padding = 10,
	left_padding = 15;
var zdpi = fbx_set[9];
var ui_mode = fbx_set[11];
var album_front_disc = fbx_set[21];
var genre_cover_dir = fbx_set[24];
var show_shadow = false;
var col_by_cover = fbx_set[30];
var rating_x, imgw = Math.floor(18*zdpi),
	imgh = imgw, mood_h = Math.floor(20*zdpi);
var is_hover_rating = false;
var rating_hover = false;
var text_bottom = Math.floor(80*zdpi);
var g_avoid_on_focus_change = false;
g_tfo = {
	rating: fb.TitleFormat("%rating%"),
	title: fb.TitleFormat("$if2(%title%,)"),
	artist: fb.TitleFormat("$if2(%artist%,)"),
	album: fb.TitleFormat("$if(%album%,  |  %album%,)"),
	mood: fb.TitleFormat("%mood%"),
	codec: fb.TitleFormat("%codec%"),
	playcount: fb.TitleFormat("$if2(%play_count%,0)"),
	bitrate: fb.TitleFormat("$if(%codec_profile%, | %codec_profile% | %bitrate%,  | %bitrate%)"),
	allinfos: fb.TitleFormat("%rating% ^^ $if2(%title%,) ^^ $if2(%artist%,) ^^ $if(%album%,  |  %album%,) ^^ %mood% ^^ %codec% ^^ $if2(%play_count%,0) ^^ $if(%codec_profile%, | %codec_profile% | %bitrate%,  | %bitrate%)"),
}
var rating, rating_hover, mood = false,
	txt_title, txt_info, txt_profile, show_info = true;
var time_circle = Number(window.GetProperty("Info: Circle time, 3000~60000ms", 12000));
if (time_circle < 3000) time_circle = 3000;
if (time_circle > 60000) time_circle = 60000;
var rbutton = Array();
var esl_bg, esl_txt_normal, esl_txt_hight, fontcolor, fontcolor2, linecolor, icocolor;
var foo_playcount = utils.CheckComponent("foo_playcount", true);
var tracktype;
var img_rating_on, img_rating_off, btn_mood, mood_img;
var col_spec, col_grid;

function on_layout_change(){
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
	get_colors();
	get_images();
}
on_layout_change();
get_colors();

/*var timer_esl_1 = window.SetTimeout(function() {
	set_esl_color();
	timer_esl_1 && window.ClearTimeout(timer_esl_1);
	timer_esl_1 = false;
}, 200); 

var timer_esl_2 = window.SetTimeout(function() {
	set_esl_color();
	timer_esl_2 && window.ClearTimeout(timer_esl_2);
	timer_esl_2 = false;
}, ESL_color_delay);*/


var pointArr = {}
function setPointArr(zdpi){
	pointArr = {
		p1: Array(9*zdpi, 1*zdpi, 6.4*zdpi, 5.6*zdpi, 1*zdpi, 6.6*zdpi, 4.6*zdpi, 10.6*zdpi, 4*zdpi, 16*zdpi, 9*zdpi, 13.6*zdpi, 14*zdpi, 16*zdpi, 13.4*zdpi, 10.6*zdpi, 17*zdpi, 6.6*zdpi, 11.6*zdpi, 5.6*zdpi),
		p2: Array(2*zdpi,1*zdpi,2*zdpi,16*zdpi,8*zdpi,12*zdpi,14*zdpi,16*zdpi,14*zdpi,1*zdpi),
		p3: Array(2*zdpi,1*zdpi+mood_h,2*zdpi,16*zdpi+mood_h,8*zdpi,12*zdpi+mood_h,14*zdpi,16*zdpi+mood_h,14*zdpi,1*zdpi+mood_h)
	}	
}
setPointArr(zdpi);
get_images();

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
var TextBtn_spec = new TextBtn();

obtn_mood = function(){
	this.y = 0;
	this.w = imgw;
	this.h = mood_h;
	this.img = mood_img;
	this.isXYInButton = function(x, y) {
		return (x >= this.x && x <= this.x + this.w && y > this.y && y <= this.y + this.h) ? true : false;
	}
	this.Paint = function(gr) {
		gr.DrawImage(this.img, this.x, this.y, this.w, this.h, 0, mood ? 0 : this.h, this.w, this.h, 0);
	}
	this.resetImg = function(){
		this.img = mood_img;
	}
	this.setx= function(x){
		this.x = x;
	}
	this.OnClick = function() {
		if (!g_metadb) {
			mood = 0;
			return;
		}
		if (tracktype < 2){
			if (!mood) {
				if(g_metadb.UpdateFileInfoSimple("MOOD", getTimestamp()))
				mood = true;
			} else {
				if(g_metadb.UpdateFileInfoSimple("MOOD", ""))
				mood = false;
			}
		}
	}
}
var btn_mood = new obtn_mood();

initbutton();

var ww = 0, wh = 0, rating_spacing = 0, line2_w;
function on_size() {
	ww = window.Width;
	wh = window.Height;
	if(is_mood) {
		rating_spacing = Math.min(15, ww / 25);
	}else{
		rating_spacing = Math.min(10, (ww-imgw*5) / 5);
		//var rating_spacing = imgw;
	}
	var img_rating_w = imgw * 5 + rating_spacing * 4;
	rating_x = (ww - img_rating_w) / 2;
	if(is_mood) btn_mood.setx(rating_x - btn_mood.w - rating_spacing);
	for(var i = 0; i < rbutton.length; i++){
		index=i-1;
		rbutton[i].setx(rating_x + imgw * index + rating_spacing * index);
	}
	line2_w = ww - 2 * left_padding;
	TextBtn_info.setSize(0, imgh + top_padding, ww, 60*zdpi);
	TextBtn_spec.setSize(0, wh - spec_h, ww, spec_h);
}

var line2_y = top_padding + imgh + 24*zdpi;

function on_paint(gr) {
	if(Update_Required_function!="") {
		eval(Update_Required_function);
		Update_Required_function = "";
	}   	
	gr.FillSolidRect(0, 0, ww, wh, colors.normal_bg);
	if (g_metadb) {
		//if(!album_infos){
			for (var i = 1; i < rbutton.length + 1; i++) {
				rbutton[i - 1].Paint(gr, i);
			}
		//}
		//if (is_mood) btn_mood.Paint(gr);
		
		var double_row = false;
		if(properties.doubleRowText && txt_info !="") var double_row = true;

		gr.GdiDrawText(txt_line1, g_font.italicplus5, colors.normal_txt, left_padding, top_padding + imgh + (properties.doubleRowText?0:1.8)*zdpi, ww - 2 * left_padding, 32*zdpi, DT_CENTER | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX | DT_END_ELLIPSIS);
		var line2 = ((txt_line2 !="" && show_info) || double_row) ? txt_line2 : txt_line3;
		gr.GdiDrawText(line2, g_font.min1, colors.faded_txt, left_padding*2, line2_y-(double_row?4*zdpi:0), line2_w-left_padding, 29*zdpi, DT_CENTER | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX | DT_END_ELLIPSIS);
		if(double_row)
		gr.GdiDrawText(txt_line3, g_font.min2, colors.faded_txt, left_padding*2, line2_y+9*zdpi, line2_w-left_padding, 29*zdpi, DT_CENTER | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX | DT_END_ELLIPSIS);			
	}
	var line_w = Math.round(ww / 2);show_shadow = true
	var line_padding = 10;
	gr.FillGradRect(line_padding, wh - 1, line_w-line_padding, 1, 0, RGBA(0, 0, 0, 0), colors.border, 1.0);
	gr.FillGradRect(line_w, wh - 1, line_w-line_padding, 1, 0, colors.border, RGBA(0, 0, 0, 0), 1.0);
	gr.FillSolidRect(line_w, wh - 1, 1, 1, colors.border);
	
	if (fb.IsPlaying) {
		if(spec_show_bg){
			gr.FillSolidRect(0, wh - spec_h, ww, spec_h, col_spec);
		}
		if(spec_show_grid){
			var l_count = Math.floor(spec_h/spec_grid_spacing);
			for (var i = 1; i < l_count + 1; i++)
			gr.DrawLine(0, wh - spec_grid_spacing*i, ww, wh - spec_grid_spacing*i, 1, col_grid);
		}
	}
	if(g_resizing.showResizeBorder()) gr.FillSolidRect(0, 0, 1, wh, colors.dragdrop_marker_line);
	else gr.FillSolidRect(0, 0, 1, wh, colors.sidesline);
}

function get_colors() {
	switch (ui_mode) {
	case (1):
		esl_bg = RGB(255,255,255);
		esl_txt_hight = GetGrey(0);
		esl_txt_normal = RGB(75, 75, 75);
		fontcolor = RGB(36, 36, 36);
		fontcolor2 = RGB(100, 100, 100);
		icocolor = RGBA(0,0,0,40);
		col_spec = RGBA(0,0,0,10);
		col_grid = RGBA(0,0,0,30);
		break;
	case (2):
		esl_bg = fbx_set[4];
		esl_txt_hight = fbx_set[6];
		esl_txt_normal = RGB(75, 75, 75);
		fontcolor = RGB(36, 36, 36);
		fontcolor2 = RGB(100, 100, 100);
		icocolor = RGBA(0,0,0,40);
		col_spec = RGBA(0,0,0,10);
		col_grid = RGBA(0,0,0,30);
		break;
	case (3):
		esl_bg = fbx_set[1];
		esl_txt_hight = fbx_set[5];
		esl_txt_normal = RGB(200, 200, 200);
		fontcolor = RGB(235, 235, 235);
		fontcolor2 = RGB(200, 200, 200);
		icocolor = RGBA(255,255,255,40);
		col_spec = RGBA(0,0,0,20);
		col_grid = RGBA(0,0,0,40);
		break;
	case (4):
		esl_bg = fbx_set[8];
		esl_txt_hight = fbx_set[5];
		esl_txt_normal = RGB(200, 200, 200);
		fontcolor = RGB(235, 235, 235);
		fontcolor2 = RGB(200, 200, 200);
		icocolor = RGBA(255,255,255,40);
		col_spec = RGBA(0,0,0,40);
		col_grid = RGBA(2,0,0,60);
		break;
	}
	linecolor = blendColors(esl_bg, RGB(0,0,0), 0.255);
	get_colors_global();
}

function set_esl_color() {
	//window.NotifyOthers("_eslyric_set_background_color_", esl_bg);
	//window.NotifyOthers("_eslyric_set_text_color_normal_", esl_txt_normal);
	//window.NotifyOthers("_eslyric_set_text_color_highlight_", esl_txt_hight);
}
var pointArr = {}
function setPointArr(zdpi){
	pointArr = {
		p1: Array(9, 1, 6.4, 6, 1, 6.6, 4.6, 10.6, 4, 16.2, 9, 13.4, 14, 16.2, 13.6, 10.6, 17, 6.6, 11.6, 6),
		p2: Array(2,1,2,16,8,12,14,16,14,1),
		p3: Array(2,1+mood_h,2,16+mood_h,8,12+mood_h,14,16+mood_h,14,1+mood_h)
	}	
}
function get_images() {
	var gb;
	
	setPointArr(1);
	polystar = false;

	img_rating_on = gdi.CreateImage(imgw, imgh);
	gb = img_rating_on.GetGraphics();
		if(!polystar){
			gb.SetSmoothingMode(2);
			gb.FillPolygon(colors.rating_icon_on, 0, pointArr.p1);
			gb.SetSmoothingMode(0);
		} else DrawPolyStar(gb, 0, 0, 16, 2.2, 10, 0, colors.rating_icon_border, colors.rating_icon_on);
	img_rating_on.ReleaseGraphics(gb);

	img_rating_off = gdi.CreateImage(imgw, imgh);
	gb = img_rating_off.GetGraphics();
		if(!polystar){
			gb.SetSmoothingMode(2);
			gb.FillPolygon(colors.rating_icon_off, 0, pointArr.p1);
			gb.SetSmoothingMode(0);
		} else DrawPolyStar(gb, 0, 0, 17, 2.2, 10, 0, colors.rating_icon_border, colors.rating_icon_off);
	img_rating_off.ReleaseGraphics(gb);
	
	img_rating_blank = gdi.CreateImage(imgw, imgh);
	gb = img_rating_blank.GetGraphics();
	img_rating_blank.ReleaseGraphics(gb);
	
	mood_img = gdi.CreateImage(imgw, mood_h*2);
	gb = mood_img.GetGraphics();
	gb.SetSmoothingMode(2);
	gb.DrawPolygon(esl_txt_hight, 2, pointArr.p2);
	gb.DrawPolygon(colors.rating_icon_off, 2, pointArr.p3);
	gb.SetSmoothingMode(0);
	mood_img.ReleaseGraphics(gb);
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
		old_rating_hover = rating_hover;
		is_hover_rating_old = is_hover_rating;
		is_hover_rating = false;	
		for (var i = 1; i < rbutton.length + 1; i++) {
			if(rbutton[i - 1].MouseMove(x, y, i)) is_hover_rating = true;
		}
		if(!is_hover_rating) rating_hover = false;
		if(is_hover_rating_old!=is_hover_rating || old_rating_hover!=rating_hover) window.Repaint();
	}
}
function on_mouse_leave() {
	g_resizing.on_mouse("leave", -1, -1);
	if(rating_hover){
		rating_hover = false;
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
			window.NotifyOthers("show_Now_Playing", 1);
		}
	}
	if (is_mood && btn_mood.isXYInButton(x, y)) btn_mood.OnClick();
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
		cycle_infos(); 
	}	
}
function on_mouse_lbtn_dblclk(x, y) {
	if (g_metadb && TextBtn_info.isXYInButton(x, y)) fb.RunContextCommandWithMetadb("Properties", g_metadb);
}

function on_mouse_rbtn_up(x, y) {
	if (TextBtn_info.isXYInButton(x, y)) {
		var rMenu = window.CreatePopupMenu();
		rMenu.AppendMenuItem(MF_STRING, 7, "Cover always follow cursor");		
		rMenu.CheckMenuItem(7,properties.follow_cursor);		
		rMenu.AppendMenuItem(MF_STRING, 3, "Show Mood");
		rMenu.CheckMenuItem(3, is_mood ? 1 : 0);
		rMenu.AppendMenuItem(MF_STRING, 8, "Show infos on 2 rows");
		rMenu.CheckMenuItem(8, properties.doubleRowText);		
		rMenu.AppendMenuSeparator();
		rMenu.AppendMenuItem(MF_STRING, 1, "Activate now playing");
		var fso = new ActiveXObject("Scripting.FileSystemObject");
		if(fso.FileExists(fb.FoobarPath +"assemblies\\Mp3tag\\Mp3tag.exe") && (tracktype < 2) && (properties.follow_cursor || !fb.IsPlaying))
			rMenu.AppendMenuItem(MF_STRING, 4, "Edit with Mp3tag");
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
				fb.RunMainMenuCommand("Activate now playing");
				window.NotifyOthers("show_Now_Playing", 1);
			}
			break;
		case 2:
			if (g_metadb) fb.RunContextCommandWithMetadb("Properties", g_metadb);
			break;
		case 3:
			is_mood = !is_mood;
			window.SetProperty("Display.Mood", is_mood);
			on_size();
			window.RepaintRect(0, top_padding, ww, top_padding + mood_h);
			break;
		case 4:
			var WshShell = new ActiveXObject("WScript.Shell");
			var obj_file = fb.Titleformat("%path%").EvalWithMetadb(g_metadb);
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
			on_item_focus_change_custom(-1,-1,-1,fb.GetFocusItem());
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
	}
	if (TextBtn_spec.isXYInButton(x, y) && foo_spec) {
		var specMenu = window.CreatePopupMenu();
		specMenu.AppendMenuItem(MF_STRING, 11, "Show grids");
		specMenu.CheckMenuItem(11, spec_show_grid ? 1 : 0);
		specMenu.AppendMenuItem(MF_STRING, 12, "Fill background Color");
		specMenu.CheckMenuItem(12, spec_show_bg ? 1 : 0);
		specMenu.AppendMenuSeparator();
		specMenu.AppendMenuItem(MF_STRING, 13, "Panel properties");
		var b = specMenu.TrackPopupMenu(x, y);
		switch (b) {
		case 11:
			spec_show_grid = !spec_show_grid;
			window.SetProperty("Spectrum Background: Show grid", spec_show_grid);
			window.RepaintRect(0, wh - spec_h, ww, spec_h);
			break;
		case 12:
			spec_show_bg = !spec_show_bg;
			window.SetProperty("Spectrum Background: Show bgcolor", spec_show_bg);
			window.RepaintRect(0, wh - spec_h, ww, spec_h);
			break;
		case 13:
			window.ShowProperties();
			break;
		}
		specMenu = undefined;
	}
	return true;
}
function on_item_focus_change_custom(playlistIndex, from, to, metadb) {
	//console.log("on_item_focus_change_custom rating: "+playlistIndex+" from:"+from+" to:"+to)
	if (g_avoid_on_focus_change || (to<0 && !metadb)) {
		g_avoid_on_focus_change = false;
		return;
	}		
	g_metadb_old = g_metadb;
	if (!properties.follow_cursor && (fb.IsPlaying || fb.IsPaused)) g_metadb = fb.GetNowPlaying();
	else {	
		if (to>-1 && playlistIndex>-1){
			g_metadb = plman.GetPlaylistItems(playlistIndex)[to];
		} else {
			g_metadb = metadb;
			if(!g_metadb){
				g_metadb = g_metadb_old;
				window.Repaint();
			}
		}		
	}
	if (g_metadb) {
		setTimerCycle();
		on_metadb_changed(new FbMetadbHandleList(g_metadb));
	}
}
/*function on_item_focus_change(playlistIndex, from, to) {
	if (g_avoid_on_focus_change || to<0) {
		g_avoid_on_focus_change = false;
		return;
	}		
	g_metadb_old = g_metadb;
	if (!properties.follow_cursor && (fb.IsPlaying || fb.IsPaused)) g_metadb = fb.GetNowPlaying();
	else {	
		if (to>-1 && playlistIndex>-1){
			g_metadb = plman.GetPlaylistItems(playlistIndex)[to];
		} else {
			g_metadb = fb.GetFocusItem();
			if(!g_metadb){
				g_metadb = g_metadb_old;
				window.Repaint();
			}
		}		
	}
	if (g_metadb) {
		setTimerCycle();
		on_metadb_changed(new FbMetadbHandleList(g_metadb));
	}
}*/
function on_metadb_changed(metadbs, fromhook) {
	if(window.IsVisible || !first_populate_done) {
		if(!g_metadb) return;
		var current_track = false;
		try{
			for(var i=0; i < metadbs.Count; i++) {
				if(metadbs[i].Compare(g_metadb)) {	
					current_track = true; 
				} 			
			}
		} catch(e){}
		if(!current_track) return;	
		
		album_infos = false;
		
		allinfos = g_tfo.allinfos.EvalWithMetadb(g_metadb);
		allinfos = allinfos.split(" ^^ ");

		rating = allinfos[0];
		if (rating == "?") {
			rating = 0;
		} else rating++;
		txt_title = allinfos[1];
		txt_info = allinfos[2] + allinfos[3];
		var _playcount = allinfos[6];
		if(foo_playcount) txt_profile = allinfos[5] + allinfos[7] + "K | " + _playcount + (_playcount > 1 ? " plays" : " play");
		else txt_profile = allinfos[5] + allinfos[7] + "K";
		var l_mood = g_tfo.mood.EvalWithMetadb(g_metadb);
		if (l_mood != null && l_mood != "?") {
			mood = true;
		} else mood = 0;
		show_info = true;
		
		txt_line1 = txt_title;
		txt_line2 = txt_info;
		txt_line3 = txt_profile;
		window.RepaintRect(0, 0, ww, text_bottom);
		first_populate_done = true;
	} else {
		set_update_function('on_metadb_changed(g_metadb,'+fromhook+')');	    	
	}
}
function set_update_function(string){
	if(string=="") Update_Required_function=string;
	else if( Update_Required_function.indexOf("on_metadb_changed(g_metadb,false")!=-1) return;
	else Update_Required_function=string;
}
function update_infos(row1, row2, row3) {
	txt_line1 = row1;
	txt_line2 = row2;
	txt_line3 = row3;
	album_infos = true;
	window.RepaintRect(0, 0, ww, text_bottom);	
}
function on_playback_new_track(metadb) {
	on_item_focus_change_custom(plman.PlayingPlaylist,-1,-1,metadb);
}

function on_playback_stop(reason) {
	switch(reason) {
	case 0: // user stop
	case 1: // eof (e.g. end of playlist)
		//on_item_focus_change_custom(plman.ActivePlaylist);
		break;
	case 2: // starting_another (only called on user action, i.e. click on next button)
		break;
	};	
}

/*function on_playlist_switch() {
	on_item_focus_change(plman.ActivePlaylist);
}*/

function on_notify_data(name, info) {
	switch (name) {
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
			update_infos(info.firstRow, info.secondRow+" | "+info.length+' | '+info.totalTracks, info.genre)
			g_avoid_on_focus_change = true;			
			timers.on_focus_change = setTimeout(function() {
				g_avoid_on_focus_change = false;				
				timers.on_focus_change && clearTimeout(timers.on_focus_change);
				timers.on_focus_change = false;
			}, 150);
		}
		break;		
	case "trigger_on_focus_change":
		on_item_focus_change_custom(info[0],-1,info[1]);
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
		if(properties.follow_cursor) on_item_focus_change_custom(-1,-1,-1,fb.GetFocusItem());
		else if(fb.IsPlaying) on_playback_new_track(fb.GetNowPlaying());
		break;
	case "set_ui_mode":
		ui_mode = info;
		get_colors();
		set_esl_color();
		get_images();
		btn_mood.resetImg();
		window.Repaint();
		break;
	case "set_random_color":
		fbx_set[0] = info[0];
		fbx_set[1] = info[1];
		fbx_set[2] = info[2];
		fbx_set[3] = info[3];
		fbx_set[4] = info[4];
		fbx_set[5] = info[5];
		fbx_set[6] = info[6];
		fbx_set[7] = info[7];
		fbx_set[8] = info[8];
		get_colors();
		set_esl_color();
		get_images();
		btn_mood.resetImg();
		window.Repaint();
		break;
	case "random_color_mode":
		random_color = info;
		break;
	case "panel_show_shadow":
		show_shadow = info;
		window.RepaintRect(0,wh-5,ww,5);
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
		get_colors();
		window.Repaint();	
	break;		
	}
}

var timer_cycle = false;
function cycle_infos(){
	show_info = !show_info;
	window.RepaintRect(left_padding, line2_y, line2_w, 28*zdpi);	
}
function setTimerCycle(){
	if (timer_cycle) clearInterval(timer_cycle)
	timer_cycle = window.SetInterval(function() {
		cycle_infos();
	}, time_circle);
}
setTimerCycle();
function on_font_changed(){
	get_font();
}
/****************************************
 * DEFINE CLASS ButtonUI  for RATING
 *****************************************/
function ButtonUI_R() {
	this.y = top_padding;
	this.width = imgw;
	this.height = imgh;
	
	this.setx = function(x){
		this.x = x;
	}

	this.Paint = function(gr, button_n) {
		var rating_to_draw = (rating_hover!==false?rating_hover:rating);
		this.img = ((rating_to_draw - button_n) >= 0) ? img_rating_on : img_rating_off;
		if(button_n!=1)
		gr.DrawImage(this.img, this.x, this.y, this.width, this.height, 0, 0, this.width, this.height, 0);
	}

	this.MouseMove = function(x, y, i) {
		if (g_metadb) {
			var half_rating_space = Math.ceil(rating_spacing/2)+1;
			if (x > this.x - half_rating_space && x < this.x + this.width + half_rating_space && y > this.y && y < this.y + this.height) {
				rating_hover = i; 
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
		if (g_metadb) {
			var half_rating_space = Math.ceil(rating_spacing/2)+1;
			if (x > this.x - half_rating_space && x < this.x + this.width + half_rating_space && y > this.y && y < this.y + this.height) {
				var derating_flag = (i == rating ? true : false);
				if (derating_flag) {
					//if (foo_playcount) {
						//if (rating_to_tag && tracktype < 2) g_metadb.UpdateFileInfoSimple("RATING", "");
						//fb.RunContextCommandWithMetadb("Rating" + "/" + "<not set>", g_metadb);
						rateSong(0,rating-1, g_metadb);
					//} else if (tracktype < 2) g_metadb.UpdateFileInfoSimple("RATING", "");
				} else {
				//	if (foo_playcount) {
						//if (rating_to_tag && tracktype < 2) g_metadb.UpdateFileInfoSimple("RATING", i);
						//fb.RunContextCommandWithMetadb("Rating" + "/" + i, g_metadb);
						rateSong(i-1,rating-1, g_metadb);
					//} else if (tracktype < 2) g_metadb.UpdateFileInfoSimple("RATING", i);
				}
			}
		}
	}
}

function on_script_unload() {
	time_circle && window.ClearInterval(time_circle);
	time_circle = false;
}
function on_init(){
	g_cursor = new oCursor();	
	g_resizing = new Resizing("rightsidebar",true,false);	
	get_colors();
	on_layout_change();
	if(fb.IsPlaying) on_playback_new_track(fb.GetNowPlaying());
	else on_item_focus_change_custom(-1,-1,-1,fb.GetFocusItem()); //g_cover.getArtwork(fb.GetFocusItem(), false);	
}
on_init();