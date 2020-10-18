var padding_top = 27;
var padding_top_nobio = 17;
var padding_bottom = 5;
var padding_left = 35;
var padding_right = 35;
var header_height = 135;
var ww = 0;
var wh = 0;
var lyricsText_Width = -1;
var esl = new ActiveXObject("ESLyric");
//esl.SetLyricCallback(lyrics_callback);
var Update_Required_function= "";
var btn_initialized = false;
var images = {};
var properties = {
	panelName: 'WSHlyrics_title',
	panelFontAdjustement: window.GetProperty("MAINPANEL: Panel font Adjustement", 0),
    enableDiskCache: window.GetProperty("COVER Disk Cache", true),
    wallpaperdisplay: window.GetProperty("Wallpaper 0=Filling 1=Adjust 2=Stretch", 2),
	showwallpaper: window.GetProperty("_DISPLAY: Show Wallpaper", false),
	darklayout: window.GetProperty("_DISPLAY: Dark layout", false),
	stick2darklayout: window.GetProperty("_DISPLAY: stick to Dark layout", true),
    album_review: window.GetProperty("_SYSTEM: Display album review", false)
}
function build_buttons(){
	if(btn_initialized){
		buttons.LyricsWidth.N_img = images.lyrics_off_icon;
		buttons.LyricsWidth.H_img = images.lyrics_off_hover_icon;
		buttons.LyricsWidth.D_img = buttons.LyricsWidth.H_img;
	} else {
		btn_initialized = true;
		buttons = {
			LyricsWidth: new JSButton(0, 0, 40, images.lyrics_off_icon.Height, "Bio", "Bio", "Show biography", function () {
				lyrics_state.decrement(1);
				positionButtons();
				window.Repaint();
			}, false, false,images.lyrics_off_icon,images.lyrics_off_hover_icon,-1, false, false, true)
		}

		all_btns = new JSButtonGroup("top-left", padding_left, padding_top+10, 'all_btns', true);
		all_btns.addButtons(buttons, [0,0,0,0]);
	}
}
function positionButtons(){
	all_btns.x = padding_left + lyricsText_Width;
	all_btns.y = (lyrics_state.isEqual(5)?padding_top_nobio:padding_top)+10;
	all_btns.setVisibility(lyrics_state.isEqual(5));
}

function drawAllButtons(gr) {
	all_btns.draw(gr);
}
function on_mouse_move(x,y,m){
	if(g_cursor.x==x && g_cursor.y==y) return;
	g_cursor.onMouse("move", x, y, m);
	all_btns.on_mouse("move",x,y);
}
function on_mouse_leave() {
	all_btns.on_mouse("leave");
}
function on_mouse_lbtn_down(x,y){
	all_btns.on_mouse("lbtn_down",x, y);
}
function on_mouse_lbtn_up(x,y){
	all_btns.on_mouse("lbtn_up",x, y);
}
function on_mouse_lbtn_dblclk(x, y) {
	all_btns.on_mouse("dble_click",x, y);
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
function on_size(w, h) {
    ww = w;
    wh = h;
}
function on_paint(gr) {
	if(Update_Required_function!="") {
		eval(Update_Required_function);
		Update_Required_function = "";
	}
	gr.SetTextRenderingHint(globalProperties.TextRendering);
	gr.FillSolidRect(0, 0, ww, wh, colors.normal_bg);
	if(lyricsText_Width<0) {
		lyricsText_Width = gr.CalcTextWidth("Lyrics", font_title)+10;
		positionButtons();
	}
	gr.GdiDrawText("Lyrics", font_title, colors.normal_txt, padding_left, (lyrics_state.isEqual(5)?padding_top_nobio:padding_top), ww - padding_left-padding_right, header_height, DT_TOP | DT_LEFT | DT_END_ELLIPSIS | DT_NOPREFIX);
	drawAllButtons(gr);
}
function on_font_changed() {
	lyricsText_Width = -1;
    all_btns.calculateSize(true);
	window.Repaint();
};

function get_colors() {
	get_colors_global();
	if(properties.darklayout || properties.stick2darklayout){
		colors.highlight_txt = RGB(255,193,0);
		colors.icons_folder = "white";
		colors.btn_inactive_opacity = 255;
		colors.inactive_txt = colors.normal_txt;
	} else {
		colors.highlight_txt = RGB(215,155,0);
		colors.icons_folder = "";
		colors.btn_inactive_opacity = 255;
		colors.inactive_txt = colors.normal_txt;
	}
	images.lyrics_off_icon = gdi.Image(theme_img_path + "\\icons\\"+colors.icons_folder+"\\nowplaying_on.png");
	images.lyrics_off_hover_icon = gdi.Image(theme_img_path + "\\icons\\"+colors.icons_folder+"\\nowplaying_on_hover.png");
	esl.SetPanelTextNormalColor(colors.normal_txt);
	esl.SetPanelTextHighlightColor(colors.highlight_txt);
	esl.SetPanelTextBackgroundColor(colors.normal_bg);
	esl.ShowDesktopLyric = false;
	esl.DesktopLyricAlwaysOnTop = false;
};
function on_mouse_rbtn_up(x, y){
        var _menu = window.CreatePopupMenu();
        var idx;

		_menu.AppendMenuItem(MF_STRING, 99, "Stick to dark layout");
		_menu.CheckMenuItem(99,properties.stick2darklayout);

		if(utils.IsKeyPressed(VK_SHIFT)) {
			_menu.AppendMenuSeparator();
			_menu.AppendMenuItem(MF_STRING, 100, "Properties ");
			_menu.AppendMenuItem(MF_STRING, 101, "Configure...");
            _menu.AppendMenuSeparator();
			_menu.AppendMenuItem(MF_STRING, 102, "Reload");
		}
        idx = _menu.TrackPopupMenu(x,y);
        switch(true) {
            case (idx == 99):
				properties.stick2darklayout=!properties.stick2darklayout;
				window.SetProperty("_DISPLAY: stick to Dark layout", properties.stick2darklayout);
				get_colors();
				window.Repaint();
                break
            case (idx == 100):
                window.ShowProperties();
                break;
            case (idx == 101):
                window.ShowConfigure();
                break;
            case (idx == 102):
                window.Reload();
                break;
            default:
				return true;
        }
        _menu = undefined;
        return true;
}
var searching_img = gdi.CreateImage(50, 50);
gb = searching_img.GetGraphics();
	gb.SetSmoothingMode(2);
	gb.DrawLine(5, 5, 50-5, 50-5, 1.0, colors.normal_txt);
	gb.DrawLine(5, 50-5, 50-5, 5, 1.0, colors.normal_txt);
	gb.SetSmoothingMode(0);
searching_img.ReleaseGraphics(gb);

function on_playback_new_track(){
	if(window.IsVisible) {
		//esl.SetPanelTextNormalColor(colors.normal_bg);
		//esl.SetPanelBackgroundType(1);
		//esl.SetPanelBackgroundSource(1);
		//esl.SetPanelBackgroundPos(3);
		//esl.SetPanelBackgroundImagePath(globalProperties.default_wallpaper);
		esl.RunPanelContextMenu("Reload Lyric");
	} else set_update_function("on_playback_new_track()");
}
function lyrics_callback(){
	//esl.SetPanelBackgroundType(0);
	//esl.SetPanelTextNormalColor(colors.normal_txt);
}
function set_update_function(string){
	if(string=="") Update_Required_function=string;
	else if( Update_Required_function.indexOf("on_playback_new_track")!=-1) return;
	else Update_Required_function=string;
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
	}
}
function on_notify_data(name, info) {
    switch(name) {
		case "use_ratings_file_tags":
			globalProperties.use_ratings_file_tags = info;
			window.SetProperty("GLOBAL use ratings in file tags", globalProperties.use_ratings_file_tags);
			window.Reload();
		break;
		case "WSH_panels_reload":
			window.Reload();
            break;
		case "enable_screensaver":
			globalProperties.enable_screensaver = info;
			window.SetProperty("GLOBAL enable screensaver", globalProperties.enable_screensaver);
		break;
		case "DiskCacheState":
			globalProperties.enableDiskCache = info;
			window.SetProperty("COVER Disk Cache", globalProperties.enableDiskCache);
			window.Repaint();
		break;
		case "set_font":
			globalProperties.fontAdjustement = info;
			window.SetProperty("GLOBAL Font Adjustement", globalProperties.fontAdjustement),
			on_init();
			window.Repaint();
		break;
		case "cover_cache_finalized":
			window.Repaint();
		break;
		case "lyrics_state":
			lyrics_state.value = info;
			positionButtons();
		break;
		case "bio_dark_theme":
			properties.darklayout = info;
			window.SetProperty("_DISPLAY: Dark layout", properties.darklayout);
			get_colors();
			window.Repaint();
            break;
		case "bio_stick_to_dark_theme":
			properties.stick2darklayout = info
			window.SetProperty("_DISPLAY: stick to Dark layout", properties.stick2darklayout);
			get_colors();
			window.Repaint();
            break;
    }
}
function on_init(){
	get_font();
	get_colors();
	build_buttons();
	positionButtons();
	g_cursor = new oCursor();
	g_tooltip = new oTooltip();
	font_title = g_font.nowplaying_title;
}
on_init();