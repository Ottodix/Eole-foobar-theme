var padding_top = 27;
var padding_bottom = 5;
var padding_left = 35;
var padding_right = 35;
var header_height = 35;
var ww = 0;
var wh = 0;	
var esl = new ActiveXObject("ESLyric");
esl.SetLyricCallback(lyrics_callback);
var Update_Required_function= "";
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
function on_mouse_move(x,y,m){
	if(g_cursor.x==x && g_cursor.y==y) return;
	g_cursor.onMouse("move", x, y, m);	
}
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
	gr.GdiDrawText("Lyrics", font_title, colors.normal_txt, padding_left, padding_top, ww - padding_left-padding_right, header_height, DT_TOP | DT_LEFT | DT_END_ELLIPSIS | DT_CALCRECT | DT_NOPREFIX);
}
function get_colors() {
	get_colors_global();
	if(properties.darklayout || properties.stick2darklayout){
		colors.highlight_txt = RGB(255,193,0);	
	} else {	         
		colors.highlight_txt = RGB(215,155,0);		
	}	
	esl.SetPanelTextNormalColor(colors.normal_txt);
	esl.SetPanelTextHighlightColor(colors.highlight_txt);	
	esl.SetPanelTextBackgroundColor(colors.normal_bg);	
	esl.ShowDesktopLyric = false;	
	esl.DesktopLyricAlwaysOnTop = false;
};

function on_mouse_rbtn_up(x, y){
        var _menu = window.CreatePopupMenu();	
        var idx;
				
		if(utils.IsKeyPressed(VK_SHIFT)) {	
			_menu.AppendMenuItem(MF_STRING, 100, "Properties ");
			_menu.AppendMenuItem(MF_STRING, 101, "Configure...");	
            _menu.AppendMenuSeparator();                  
			_menu.AppendMenuItem(MF_STRING, 102, "Reload");            
		}
        idx = _menu.TrackPopupMenu(x,y);
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
	g_cursor = new oCursor();		
	font_title = g_font.nowplaying_title;
}
on_init();