function RGB(r,g,b){ return (0xff000000|(r<<16)|(g<<8)|(b)); }
function RGBA(r, g, b, a) {
    return ((a << 24) | (r << 16) | (g << 8) | (b))
}
var wh=0;
var ww=0;
var playlist_item_size=25;
var scroll_factor=20;
var diff_scroll_width_hover_normal=5;
var scroll_min_height=40;
var playlist_count=plman.PlaylistItemCount(plman.ActivePlaylist);
var scrollbar_size=(wh/playlist_count)*scroll_factor;
var scrollbar_size=(scrollbar_size<scroll_min_height) ? scroll_min_height : (scrollbar_size>(wh-100)) ? (wh-100) : scrollbar_size;
var scrollbar_zone=wh-scrollbar_size+0;
properties = {
	panelName: 'WSHELplaylistscrollbar',		
	darklayout: window.GetProperty("_DISPLAY: Dark layout", false)  		
};

function get_colors() {
	get_colors_global();	
	if(properties.darklayout){
	} else {	
	}
}
get_colors();

var drag_ajust=0;
var g_drag = 0;

var hooverstate=false;
var focus_item=plman.GetPlaylistFocusItemIndex(plman.ActivePlaylist);

function on_paint(gr) {
	gr.FillSolidRect(0, 0, ww, wh, colors.normal_bg);
	gr.FillSolidRect(ww-1, 0, 1, wh, colors.sidesline);
	if(nowplayingplaylist_state.isActive() && !properties.darklayout) gr.FillSolidRect(ww-1, 0, 1, wh, colors.sidesline);	
	
    if(wh<playlist_item_size*playlist_count) {
		scrollbar_top=Math.floor((focus_item*scrollbar_zone)/(playlist_count-1));
		
		if(!hooverstate){  
			if(g_cursor.getCursor()!=IDC_ARROW) g_cursor.setCursor(IDC_ARROW);			
			gr.FillSolidRect(ww-cScrollBar.normalWidth-1,scrollbar_top+cScrollBar.marginTop, cScrollBar.normalWidth-2,scrollbar_size-cScrollBar.marginTop-cScrollBar.marginBottom,colors.scrollbar_normal_cursor); 
		}
		else {          
			if(g_cursor.getCursor()!=IDC_HAND) g_cursor.setCursor(IDC_HAND, "scrollbar");			
			gr.FillSolidRect(0,scrollbar_top, ww,scrollbar_size,colors.scrollbar_hover_cursor);
		}
	}
}

function on_mouse_lbtn_down(x,y){
    drag_ajust=(y-scrollbar_top-1);
    drag_ajust=(drag_ajust>=scrollbar_size || drag_ajust<1)?0:drag_ajust;
    g_drag = 1;
}

function on_mouse_lbtn_up(x,y){
    on_mouse_move(x,y);
    g_drag = 0;
}

function on_mouse_move(x, y, m){
	if(g_cursor.x==x && g_cursor.y==y) return;
	g_cursor.onMouse("move", x, y, m);	
	
    ypos=y-drag_ajust;
    if(ypos<0) ypos=0;
    if(!hooverstate){
        hooverstate=true;
        window.Repaint();
    }       
    if(g_drag){
        focus_item=Math.floor(((playlist_count-1)/scrollbar_zone)*ypos);
        if(focus_item>=playlist_count) focus_item=playlist_count-1;
        plman.SetPlaylistFocusItem(plman.ActivePlaylist,focus_item); 
		window.Repaint();		
    } 
}

function on_mouse_leave() {
    if(hooverstate){
        hooverstate=false;
        window.Repaint();
    }          
}

function on_mouse_wheel(delta){
    if(delta>0)
    focus_item=(focus_item>9)? focus_item-9 : 0;
    else
    focus_item=(focus_item<playlist_count-10)? focus_item+9 : playlist_count-1;
    window.Repaint();
    plman.SetPlaylistFocusItem(plman.ActivePlaylist,focus_item);    
}

function on_item_focus_change(){
    get_focused_item();
    window.Repaint();
}

function initialize_scrollbar(){
    get_focused_item();
    playlist_count=plman.PlaylistItemCount(plman.ActivePlaylist);
    scrollbar_size=(wh/playlist_count)*scroll_factor;
    scrollbar_size=(scrollbar_size<scroll_min_height) ? scroll_min_height : (scrollbar_size>wh-100) ? wh-100 : scrollbar_size;
    scrollbar_zone=wh-scrollbar_size+0;    
    window.Repaint();    
}
function get_focused_item(){
    focus_item=plman.GetPlaylistFocusItemIndex(plman.ActivePlaylist);
    focus_item=(focus_item<0)?0:focus_item;    
}
function on_playlist_switch(){
    initialize_scrollbar();
    if(plman.ActivePlaylist!=plman.PlayingPlaylist){
       plman.SetPlaylistFocusItem(plman.ActivePlaylist,0);     
       plman.SetPlaylistFocusItem(plman.ActivePlaylist,-1);    
    }
}
function on_size(w, h) {   
	ww = w;
	wh = h;	
    initialize_scrollbar()
}
function on_playlist_items_added(){
    initialize_scrollbar();
}
function on_playlist_items_removed(){
    initialize_scrollbar();
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
		case "main_panel_state":
			main_panel_state.value = info;
		break; 			
		case"playlists_dark_theme":			
			properties.darklayout = info;
			window.SetProperty("_DISPLAY: Dark layout", properties.darklayout);
			get_colors();
			window.Repaint();
		break;				
    };
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
        //_menu = undefined;
        return true;
}
function on_init(){
	g_cursor = new oCursor();		
}
on_init();