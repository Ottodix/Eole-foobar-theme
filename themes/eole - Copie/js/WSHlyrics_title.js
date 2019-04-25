var colors = {};
var padding_top = 27;
var padding_bottom = 5;
var padding_left = 35;
var padding_right = 35;
var header_height = 35;
var ww = 0;
var wh = 0;	
var esl = new ActiveXObject("ESLyric");
var properties = {
	panelName: 'WSHlyrics_title',		
    globalFontAdjustement: window.GetProperty("MAINPANEL: Global Font Adjustement", -1),
	panelFontAdjustement: window.GetProperty("MAINPANEL: Panel font Adjustement", 0),		
    enableDiskCache: window.GetProperty("COVER Disk Cache", true),		
    wallpaperdisplay: window.GetProperty("Wallpaper 0=Filling 1=Adjust 2=Stretch", 2),	
	showwallpaper: window.GetProperty("_DISPLAY: Show Wallpaper", false),
	darklayout: window.GetProperty("_DISPLAY: Dark layout", false),		
	stick2darklayout: window.GetProperty("_DISPLAY: stick to Dark layout", false),		
    album_review: window.GetProperty("_SYSTEM: Display album review", false)
}
function on_mouse_move(x,y,m){
	if(g_cursor.x==x && g_cursor.y==y) return;
	g_cursor.onMouse("move", x, y, m);	
}
function on_size() {
    ww = window.Width;
    wh = window.Height;	
}
function on_paint(gr) {
	gr.SetTextRenderingHint(globalProperties.TextRendering);	
	gr.FillSolidRect(0, 0, ww, wh, colors.g_color_normal_bg);
	gr.GdiDrawText("Lyrics", font_title, colors.normal_txt, padding_left, padding_top, ww - padding_left-padding_right, header_height, DT_TOP | DT_LEFT | DT_END_ELLIPSIS | DT_CALCRECT | DT_NOPREFIX);
}
function get_colors() {
	if(properties.darklayout || properties.stick2darklayout){
		wallpaper_overlay = GetGrey(0,180);
		wallpaper_overlay_blurred = GetGrey(0,130);		
		      
		colors.g_color_normal_bg = GetGrey(20);        
		colors.normal_txt = GetGrey(255,200);
		colors.faded_txt = GetGrey(245);	
		g_color_highlight_txt = RGB(255,193,0);	

	} else {	
		colors.g_color_normal_bg = GetGrey(255);           
		wallpaper_overlay = GetGrey(255,235);
		wallpaper_overlay_blurred = GetGrey(255,225);				
		colors.normal_txt = GetGrey(0);
		colors.faded_txt = GetGrey(245);	
		g_color_highlight_txt = RGB(215,155,0);		
	}	
	esl.SetPanelTextNormalColor(colors.normal_txt);
	esl.SetPanelTextHighlightColor(g_color_highlight_txt);	
	esl.SetPanelTextBackgroundColor(colors.g_color_normal_bg);	
	esl.ShowDesktopLyric = false;	
	esl.DesktopLyricAlwaysOnTop = false;	
};
// ===================================================== // Wallpaper

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
			properties.globalFontAdjustement = info;
			window.SetProperty("MAINPANEL: Global Font Adjustement", properties.globalFontAdjustement),
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