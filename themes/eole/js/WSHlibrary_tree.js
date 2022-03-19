var properties = {
	panelName: 'WSHlibrary_tree',
    darklayout: window.GetProperty("_DISPLAY: Dark layout", false),
    showwallpaper: window.GetProperty("_DISPLAY: Show Wallpaper", false),
    wallpaperblurred: window.GetProperty("_DISPLAY: Wallpaper Blurred", true),
    wallpaperblurvalue: window.GetProperty("_DISPLAY: Wallpaper Blur Value", 1.05),
    wallpapermode: window.GetProperty("_SYSTEM: Wallpaper Mode", 0),
    wallpaperdisplay: window.GetProperty("_DISPLAY: Wallpaper 0=Filling 1=Adjust 2=Stretch", 0),
    genre_customGroup_label: window.GetProperty("_DISPLAY: genre customGroup name", ""),
    artist_customGroup_label: window.GetProperty("_DISPLAY: artist customGroup name", ""),
    album_customGroup_label: window.GetProperty("_DISPLAY: album customGroup name", ""),
    showInLibrary_RightPlaylistOn: window.GetProperty("MAINPANEL adapt now playing to left menu righ playlist on", true),
    showInLibrary_RightPlaylistOff: window.GetProperty("MAINPANEL adapt now playing to left menu righ playlist off", true),
	headerbar_height:39,
	TagSwitcherBarHeight: 40,
    TagSwitcherBarHeight_old: 30,		
	panelFontAdjustement: -1,
	showLibraryTreeSwitch:true,
	DropInplaylist: true
};

function setShowInLibrary(){
	if(getRightPlaylistState()) properties.showInLibrary = properties.showInLibrary_RightPlaylistOn;
	else properties.showInLibrary = properties.showInLibrary_RightPlaylistOff;
}
setShowInLibrary();

var g_wallpaperImg = null;
var update_wallpaper = false;
var g_on_mouse_lbtn_dblclk = false;
var g_rightClickedIndex = -1;
var playing_track_playcount = 0;
var lib_update_callID = 0;
var update_size = true;
var first_on_size = true;
var ww = wh = 0;
var TF = {
	albumartist: fb.TitleFormat("%album artist%"),
	album: fb.TitleFormat("%album%"),
	genre: fb.TitleFormat("%genre%"),
	date: fb.TitleFormat("%date%"),
	play_count: fb.TitleFormat("%play_count%"),
	playback_time_seconds: fb.TitleFormat("%playback_time_seconds%"),
}

row_padding = {
    tiny: 8,
    small: 10,
    large: 14,
    extralarge: 20,
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
timers = {
    showPlaylistManager: false,
    hidePlaylistManager: false,
    avoidPlaylistSwitch: false,
	delayForDoubleClick: false,
};

var Update_Required_function = "";
var draw_right_line = true;
String.prototype.trim = function() {
    return this.replace(/^\s+|[\n\s]+$/g, "");
}

oTagSwitcherBar_old = function() {
    this.setItems_infos = function(){
		this.items_functions = new Array(
			function() {}
		,
			function() {
				window.NotifyOthers("libraryFilter_tagMode",1);
				librarytree.setValue(0);
				window.NotifyOthers("left_filter_state","album");
			}
		,
			function() {
				window.NotifyOthers("libraryFilter_tagMode",2);
				librarytree.setValue(0);
				window.NotifyOthers("left_filter_state","artist");
			}
		,
			function() {
				window.NotifyOthers("libraryFilter_tagMode",3);
				librarytree.setValue(0);
				window.NotifyOthers("left_filter_state","genre");
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
			gb.FillPolygon(colors.inactive_txt, 0, xpts3);
			gb.FillPolygon(colors.inactive_txt, 0, xpts4);
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
		this.activeItem = 0;
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
		gr.FillSolidRect(this.x, this.y+this.h-1, this.w - this.x -((draw_right_line)?1:0), 1, colors.headerbar_line);

		//Calculate text size
		total_txt_size = 0
		for(i = this.items_txt.length-1; i >= 0; i--) {
			this.items_width[i] = gr.CalcTextWidth(this.items_txt[i],g_font.min1);
			total_txt_size += this.items_width[i];
		}
		var txt_padding_sides = Math.round(((this.w-(this.margin_left)*2-this.margin_right-((draw_right_line)?1:0)-((p.showFiltersTogglerBtn)?this.hide_bt.w:0))-total_txt_size)/(this.items_txt.length));
		var tx = this.x + this.margin_left;

		//Draw texts
		for(i = this.items_txt.length-1; i >= 0; i--) {
			this.items_width[i] += txt_padding_sides;
			if(i<this.items_txt.length-1) tx = tx + this.items_width[i+1];
			this.items_x[i] = tx;

			if(this.items_txt[i].length==1){
				gr.DrawImage(this.images.library_tree, this.items_x[i]+Math.round(txt_padding_sides/2)-4, this.txt_top_margin+Math.floor((this.h-this.images.library_tree.Height)/2)-1, this.images.library_tree.Width, this.images.library_tree.Height, 0, 0, this.images.library_tree.Width, this.images.library_tree.Height, 0, (i==this.activeItem || i==this.hoverItem)?255:colors.btn_inactive_opacity);
			} else {
				gr.GdiDrawText(this.items_txt[i], g_font.min1, (i==this.activeItem || i==this.hoverItem)?colors.full_txt:colors.inactive_txt, this.items_x[i], this.txt_top_margin, this.items_width[i], this.h, DT_CENTER | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX | DT_END_ELLIPSIS);
			}
			if(i==this.activeItem || i==this.hoverItem) gr.FillSolidRect(this.items_x[i]+Math.round(txt_padding_sides/2)-9, this.y+this.h-1,  this.items_width[i]-Math.round(txt_padding_sides/2)*2+16, 1, colors.normal_txt);
		}
		if(p.showFiltersTogglerBtn) this.hide_bt.draw(gr, this.x+this.w-(this.hide_bt.w), this.y, 255);
    };
    this.setHoverStates = function(x, y){
		var prev_hover_item = this.hoverItem;
		this.hoverItem = -1;
		for(i = 0; i < this.items_txt.length; i++) {
			if (x > this.items_x[i] && x < this.items_x[i]+this.items_width[i] && y > this.y && y < this.y + this.h) this.hoverItem = i;
		}
		if(prev_hover_item!=this.hoverItem){
			if(this.hoverItem==-1) g_cursor.setCursor(IDC_ARROW);
			else g_cursor.setCursor(IDC_HAND,this.items_txt[this.hoverItem]);
		}
		return (prev_hover_item!=this.hoverItem);
	}
    this.on_mouse = function(event, x, y, delta) {
        switch(event) {
            case "lbtn_down":
				if(this.hoverItem != properties.tagMode-((properties.showLibraryTreeSwitch)?0:1) && this.hoverItem>-1) {
					this.items_functions[this.hoverItem]();
					if(p.s_txt.length>0) sL.clear();
				}
				if(p.showFiltersTogglerBtn && this.hide_bt.checkstate("hover", x, y)){
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
					window.Repaint();
				}
				if(p.showFiltersTogglerBtn) this.hide_bt.checkstate("move", x, y);
                break;
            case "leave":
				changed_state = this.setHoverStates(-1,-1);
				if(changed_state) window.Repaint();
				if(p.showFiltersTogglerBtn) this.hide_bt.checkstate("leave", x, y);
                break;
        };
    };
};
oTagSwitcherBar = function() {
    this.setItems_infos = function(){
		this.items_functions = new Array(
			function() {}
		,
			function() {
				window.NotifyOthers("libraryFilter_tagMode",1);
				librarytree.setValue(0);
				window.NotifyOthers("left_filter_state","album");
			}
		,
			function() {
				window.NotifyOthers("libraryFilter_tagMode",2);
				librarytree.setValue(0);
				window.NotifyOthers("left_filter_state","artist");
			}
		,
			function() {
				window.NotifyOthers("libraryFilter_tagMode",3);
				librarytree.setValue(0);
				window.NotifyOthers("left_filter_state","genre");
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
			gb.FillPolygon(colors.inactive_txt, 0, xpts3);
			gb.FillPolygon(colors.inactive_txt, 0, xpts4);
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
		gr.FillSolidRect(this.x, this.y+this.h-1, this.w - this.x, 1, colors.headerbar_line);

		//Calculate text size
		total_txt_size = 0
		for(i = this.items_txt.length-1; i >= 0; i--) {
			this.items_width[i] = gr.CalcTextWidth(this.items_txt[i],g_font.min1);
			total_txt_size += this.items_width[i];
		}
		var tx = this.x + this.margin_left;

		//Draw texts	
		var text_x = 16;
		gr.GdiDrawText(this.items_txt[0], g_font.normal, colors.full_txt, text_x, this.txt_top_margin, this.w, this.h, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX | DT_END_ELLIPSIS);
		var switcher_x = gr.CalcTextWidth(this.items_txt[0],g_font.normal)+text_x;
		this.search_history_bt.draw(gr, switcher_x, this.y+Math.round(this.h/2 - this.images.search_history_icon.Height/2), 255);
		
		if(p.showFiltersTogglerBtn) this.hide_bt.draw(gr, this.x+this.w-(this.hide_bt.w), this.y, 255);
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
					if(p.s_txt.length>0) sL.clear();
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
				if(p.showFiltersTogglerBtn && this.hide_bt.checkstate("hover", x, y)){
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
				if(p.showFiltersTogglerBtn) this.hide_bt.checkstate("move", x, y);
				if(x<this.search_history_bt.x) x = this.search_history_bt.x+10;
				this.search_history_bt.checkstate("move", x, y);				
                break;
            case "leave":
				this.search_history_bt.changeState(ButtonStates.normal);
				if(p.showFiltersTogglerBtn) this.hide_bt.checkstate("leave", x, y);
                break;
        };
    };
};
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
    this.h = ui.h - 100;
    this.x = ui.w;
    this.y = ui.y + 50;
    this.total_playlists = null;
    this.rowTotal = -1;
    this.drop_done = false;
    this.tw = 0;
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
		if(ui.drag_clicked){
			if(pman.offset < pman.w) {
				var delta = Math.ceil((pman.w - pman.offset) / 2);
				pman.offset += delta;
				window.Repaint();
			};
			if(pman.offset >= pman.w) {
				pman.offset = pman.w;
				window.ClearInterval(timers.showPlaylistManager);
				timers.showPlaylistManager = false;
				window.Repaint();
			};
		}
    };

    this.hidePanel = function() {
        if(pman.offset > 0) {
            var delta = Math.ceil((pman.w - (pman.w - pman.offset)) / 2);
            pman.offset -= delta;
            window.Repaint();
        };
        if(pman.offset < 1) {
            pman.offset = 0;
            pman.state = 0;
			pman.scroll	= 0;
            window.ClearInterval(timers.hidePlaylistManager);
            timers.hidePlaylistManager = false;
            window.Repaint();
        };
    };

    this.populate = function(exclude_active, reset_scroll) {
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
                if(idx == plman.ActivePlaylist && properties.selectionPlaylist!=plname) {
                    if(!exclude_active) {
                        this.playlists.push(new oPlaylist(idx, rowId));
                        rowId++;
                    };
                } else if(properties.selectionPlaylist!=plname){
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
			//height_top_fix = (properties.showHeaderBar ? (properties.showTagSwitcherBar ? g_tagswitcherbar.default_height+properties.headerBarHeight : properties.headerBarHeight) : 0)
			height_top_fix = 0;
            gr.FillSolidRect(0, height_top_fix+1, ui.w, ui.h-height_top_fix-1, colors.pm_overlay);

			//Shadows
			gr.FillGradRect(cx,this.y-gradient_size,ui.w-(draw_right_line?1:0),gradient_size,90,colors.pm_shadow_on,colors.pm_shadow_off,0)
			gr.FillGradRect(cx,this.y + this.h + cPlaylistManager.botbarHeight,ui.w-(draw_right_line?1:0),gradient_size,90,colors.pm_shadow_on,colors.pm_shadow_off,1.0)
			//Main BG
			gr.FillSolidRect(cx, this.y, this.w, this.h + cPlaylistManager.botbarHeight + 1, colors.pm_bg);
			gr.FillSolidRect(cx, this.y, ui.w-(draw_right_line?1:0), 1, colors.pm_border);
			gr.FillSolidRect(cx, this.y + this.h + cPlaylistManager.botbarHeight, ui.w-(draw_right_line?1:0), 1, colors.pm_border);
           // gr.FillSolidRect(cx + bg_margin_left, this.y + cPlaylistManager.topbarHeight - 2, this.w - bg_margin_left*2, 1, colors.pm_bg4);

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
                    this.tw = gr.CalcTextWidth(t+"  ", g_font.min1);
                    gr.GdiDrawText(t, g_font.min1, blendColors(txt_color, bg_color, 0.2), cx + bg_margin_left + txt_margin, cy, cw - bg_margin_left*2 - txt_margin*2 - this.scr_w, ch, DT_RIGHT | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
                } else {
                    this.tw = 0;
                };

				//draw playing playlist icon
				if(fb.IsPlaying && this.playlists[i].idx == plman.PlayingPlaylist){
					gr.DrawImage(images.playing_playlist, cx + bg_margin_left + txt_margin - 9, cy+6, images.playing_playlist.Width, images.playing_playlist.Height, 0, 0, images.playing_playlist.Width, images.playing_playlist.Height,0,255);
					playlistname_padding_left = images.playing_playlist.Width - 6;
				} else playlistname_padding_left = 0;

                // draw playlist name
                if((this.activeIndex == i + 1 && cPlaylistManager.blink_counter < 0) || (cPlaylistManager.blink_id == i + 1 && cPlaylistManager.blink_row != 0)) {
                    gr.GdiDrawText("+ " + this.playlists[i].name , g_font.boldplus1, txt_color, cx + playlistname_padding_left + bg_margin_left + txt_margin, cy, cw - bg_margin_left*2 - txt_margin*2 - this.tw - this.scr_w, ch, DT_LEFT | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
                } else {
                    gr.GdiDrawText(this.playlists[i].name , g_font.normal, blendColors(txt_color, bg_color, 0.2), cx + playlistname_padding_left + bg_margin_left + txt_margin, cy, cw - bg_margin_left*2 - txt_margin*2 - this.tw - this.scr_w, ch, DT_LEFT | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
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
					gr.GdiDrawText("+ Sent to a new Playlist" , g_font.boldplus1, txt_color, cx + bg_margin_left + txt_margin, this.y + cPlaylistManager.topbarHeight - 30, cw - bg_margin_left*2 - txt_margin*2 - this.tw - this.scr_w, ch, DT_LEFT | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
                    if(cPlaylistManager.blink_counter <= 6 && Math.floor(cPlaylistManager.blink_counter / 2) == Math.ceil(cPlaylistManager.blink_counter / 2)) {
						gr.FillSolidRect(cx + bg_margin_left, this.y +(cPlaylistManager.topbarHeight-31), cw - bg_margin_left*2 - this.scr_w, ch+1, colors.pm_blink);
						gr.DrawRect(cx + bg_margin_left, this.y +(cPlaylistManager.topbarHeight-31), cw - bg_margin_left*2 - this.scr_w - 1, ch, 1.0, colors.pm_blink_rectline);
                    };
                } else {
                    gr.GdiDrawText("Send to ..." , g_font.normal, txt_color, cx + bg_margin_left + txt_margin, this.y + cPlaylistManager.topbarHeight - 30, cw - bg_margin_left*2 - txt_margin*2 - this.tw - this.scr_w, ch, DT_LEFT | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
                };
            } else {
                if(this.activeRow == 0) {
                    gr.GdiDrawText("+ Send to a new Playlist" , g_font.boldplus1, txt_color, cx + bg_margin_left + txt_margin, this.y + cPlaylistManager.topbarHeight - 30, cw - bg_margin_left*2 - txt_margin*2 - this.tw - this.scr_w, ch, DT_LEFT | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);

					gr.FillSolidRect(cx + bg_margin_left, this.y +(cPlaylistManager.topbarHeight-31), cw - bg_margin_left*2 - this.scr_w, ch+1, colors.pm_blink);
					gr.DrawRect(cx + bg_margin_left, this.y +(cPlaylistManager.topbarHeight-31), cw - bg_margin_left*2 - this.scr_w - 1, ch, 1.0, colors.pm_blink_rectline);

                } else {
                    gr.GdiDrawText("Send to ..." , g_font.normal, txt_color, cx + bg_margin_left + txt_margin, this.y + cPlaylistManager.topbarHeight - 30, cw - bg_margin_left*2 - txt_margin*2 - this.tw - this.scr_w, ch, DT_LEFT | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
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
                    window.Repaint();
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
                                    window.Repaint();
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
                                    window.Repaint();
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
                ui.drag_clicked = false;
                if(ui.drag_moving) {
					g_cursor.setCursor(IDC_ARROW,33);
                    this.drop_done = false;
                    if(this.activeIndex > -1) {
						var list = pop.sel_items;
						var items = p.items();
						for (var i = 0; i < list.length; i++) items.Add(p.list[list[i]]);
                        this.metadblist_selection = items;
                        if(this.activeRow == 0) {
                            // send to a new playlist
                            this.drop_done = true;
                            fb.RunMainMenuCommand("File/New playlist");
                            plman.InsertPlaylistItems(plman.PlaylistCount-1, 0, this.metadblist_selection, false);
                        } else {
                            // send to selected (hover) playlist
                            this.drop_done = true;
                            var row_idx = this.activeIndex - 1;
                            var playlist_idx = this.playlists[row_idx].idx;
                            var insert_index = plman.PlaylistItemCount(playlist_idx);
                            plman.InsertPlaylistItems(playlist_idx, insert_index, this.metadblist_selection, false);
                        };
                        // timer to blink the playlist item where tracks have been droped!
                        if(this.drop_done) {
                            if(!cPlaylistManager.blink_timer) {
                                cPlaylistManager.blink_x = x;
                                cPlaylistManager.blink_y = y;
                                cPlaylistManager.blink_totaltracks = this.metadblist_selection.Count;
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
                                        ui.drag_moving = false;
                                    };
                                    window.Repaint();
                                }, 150);
                            };
                        };
                    } else {
                        if(timers.showPlaylistManager) {
                            window.ClearInterval(timers.showPlaylistManager);
                            timers.showPlaylistManager = false;
                        };
                        if(!timers.hidePlaylistManager) {
                            timers.hidePlaylistManager = setInterval(this.hidePanel, 30);
                        };
                        ui.drag_moving = false;
                    };
                    ui.drag_moving = false;
                };
                break;
            case "right":
                ui.drag_clicked = false;
                if(ui.drag_moving) {
                    if(timers.showPlaylistManager) {
                        window.ClearInterval(timers.showPlaylistManager);
                        timers.showPlaylistManager = false;
                    };
                    if(!timers.hidePlaylistManager) {
                        timers.hidePlaylistManager = setInterval(this.hidePanel, 30);
                    };
                    ui.drag_moving = false;
                };
                break;
            case "wheel":
                var scroll_prev = this.scroll;
                this.scroll -= delta;
                if(this.scroll < 0) this.scroll = 0;
                if(this.scroll > (this.rowTotal - this.totalRows)) this.scroll = (this.rowTotal - this.totalRows);
                if(this.scroll != scroll_prev) {
                    this.on_mouse("move", p.m_x, p.m_y);
                };
                break;
            case "leave":
                ui.drag_clicked = false;
                if(ui.drag_moving) {
                    if(timers.showPlaylistManager) {
                        window.ClearInterval(timers.showPlaylistManager);
                        timers.showPlaylistManager = false;
                    };
                    if(!timers.hidePlaylistManager) {
                        timers.hidePlaylistManager = setInterval(this.hidePanel, 30);
                    };
                    ui.drag_moving = false;
                };
                break;
        };
    };
};

function userinterface() {
    var blend = "",
        custom_col = window.GetProperty("_CUSTOM COLOURS: USE", false),
        mix = 0,
        orig_font_sz = 16,
        s_col = window.GetProperty("Search Style: Fade-0 Blend-1 Norm-2 Highlight-3", 0),
        s_linecol = window.GetProperty("Search: Line Colour: Grey-0 Blend-1 Text-2", 0),
        sp = 6,
        sp1 = 6,
        sp2 = 6,
        sum = 0,
        sy = window.GetProperty("Node: Custom Symbols: Collapse|Expand", "- |> ").split("|");
	this.linestyle = window.GetProperty("Node: Lines: Hide-0 Grey-1 Blend-2 Text-3", 1);
    this.b1 = 0x04ffffff;
    this.b2 = 0x04000000;
    this.backcol = "";
	this.drag_clicked = false;
	this.show_collapse_rclick = false;
	this.drag_moving = false;
    this.backcolsel = "";
    this.backcoltrans = "";
    this.bg = false;
    this.collapse = sy[0];
    this.dui = window.InstanceType;
    this.expand = sy[1];
    this.fill = 0;
    this.font;
    this.h = 0;
    this.linecol = "";
    this.pen_c = 0x55888888;
    this.row_h = 20;
	this.row_p_min = 10;
    this.s_font;
    this.s_linecol = "";
    this.sel = 3;
    this.symbol_w = 17;
    this.textcol = "";
    this.textcol_h = "";
    this.textselcol = "";
    this.textsymbcol = "";
    this.txt_box = "";
    this.w = 0;
    this.alternate = window.GetProperty("Row Stripes", true);
    this.margin = window.GetProperty("Margin", 8);
    this.node_style = window.GetProperty("Node: Custom Symbols-0 Soft-1 Bold-2", 1);
    this.node_themed = window.GetProperty("Node: Themed nodes", true);
    this.node_sz = window.GetProperty("Node: Size", 9);
    this.node_sz = Math.max(this.node_sz, 6);
    this.node_sz_begin = this.node_sz;
    this.pad = window.GetProperty("Tree Indent", 19);
    this.scrollbar_show = window.GetProperty("Scrollbar Show", true);
    this.scr_w = this.scrollbar_show ? window.GetProperty("Scrollbar Width", 12) : 0;
	this.force_SelectedDraw = false;
    window.SetProperty("_CUSTOM COLOURS: EMPTY = DEFAULT", "R-G-B (any) or R-G-B-A (not Text...), e.g. 255-0-0");
    var R = function(c) {
        return c >> 16 & 0xff;
    };
    var G = function(c) {
        return c >> 8 & 0xff;
    };
    var B = function(c) {
        return c & 0xff;
    }
    var get_blend = function(c1, c2, f) {
        var nf = 1 - f,
            r = (R(c1) * f + R(c2) * nf),
            g = (G(c1) * f + G(c2) * nf),
            b = (B(c1) * f + B(c2) * nf);
        return RGB(r, g, b);
    }
    var set_custom_col = function(c, t) {
        if (!custom_col) return "";
        try {
            var cc = "",
                col = [];
            col = c.split("-");
            if (col.length != 3 && col.length != 4) return "";
            switch (t) {
                case 0:
                    cc = RGB(col[0], col[1], col[2]);
                    break;
                case 1:
                    switch (col.length) {
                        case 3:
                            cc = RGB(col[0], col[1], col[2]);
                            break;
                        case 4:
                            cc = RGBA(col[0], col[1], col[2], col[3]);
                            break;
                    }
                    break;
            }
            return cc;
        } catch (e) {
            return ""
        };
    }
	this.setRowPadding = function(new_padding){
		if(typeof new_padding !== 'undefined'){
			if(new_padding<ui.row_p_min) new_padding=ui.row_p_min;
			this.row_p = new_padding;
			window.SetProperty("Row Vertical Item Padding", this.row_p);
			on_size(window.Width, window.Height);
			window.Repaint();
		} else {
			this.row_p = window.GetProperty("Row Vertical Item Padding", 18) + g_fsize - 11;
		}
	}
	this.setRowPadding();
    this.get_textselcol = function(c) {
        var cc = [R(c), G(c), B(c)];
        var ccc = [];
        for (var i = 0; i < cc.length; i++) {
            ccc[i] = cc[i] / 255;
            ccc[i] = ccc[i] <= 0.03928 ? ccc[i] / 12.92 : Math.pow(((ccc[i] + 0.055) / 1.055), 2.4);
        }
        var L = 0.2126 * ccc[0] + 0.7152 * ccc[1] + 0.0722 * ccc[2];
        if (L > 0.31) return RGB(0, 0, 0);
        else return RGB(255, 255, 255);
    }
    this.outline = function(c, but) {
        if (but) {
            if (window.IsTransparent || R(c) + G(c) + B(c) > 30) return RGBA(0, 0, 0, 36);
            else return RGBA(255, 255, 255, 36);
        } else if (R(c) + G(c) + B(c) > 255 * 1.5) return RGB(30, 30, 10);
        else return RGB(225, 225, 245);
    }
    this.reset_colors = function() {
        this.backcol = "";
        this.backcolsel = "";
        this.backcoltrans = "";
        this.linecol = "";
        this.s_linecol = "";
        this.textcol = "";
        this.textcol_h = "";
        this.textselcol = "";
        this.textsymbcol = "";
        this.txt_box = "";
    }

    this.get_colors = function() {
        this.backcol = colors.lightgrey_bg;
        this.backcolsel = colors.selected_bg;
        this.linecol = set_custom_col(window.GetProperty("_Custom.Colour Node Lines", ""), 1);
        this.txt_box = set_custom_col(window.GetProperty("_Custom.Colour Search Name", ""), 0);
        this.s_linecol = colors.headerbar_line;
        this.textcol = colors.normal_txt;
        this.textcol_h = colors.normal_txt;
        this.textselcol = colors.normal_txt;
        this.textsymbcol = colors.faded_txt;
        this.backcoltrans = set_custom_col(window.GetProperty("_Custom.Colour Transparent Fill", ""), 1);

        if (this.dui) { // custom colour mapping: DUI colours can be remapped by changing the numbers (0-3)
            if (this.textcol === "") this.textcol = window.GetColourDUI(0);
            if (this.backcol === "") this.backcol = window.GetColourDUI(1);
            if (this.textcol_h === "") this.textcol_h = window.GetColourDUI(2);
            if (this.backcolsel === "") this.backcolsel = window.GetColourDUI(3);
        } else { // custom colour mapping: CUI colours can be remapped by changing the numbers (0-6)
            if (this.textcol === "") this.textcol = window.GetColourCUI(0);
            if (this.backcol === "") this.backcol = window.GetColourCUI(3);
            if (this.textcol_h === "") this.textcol_h = window.GetColourCUI(2);
            if (this.backcolsel === "") this.backcolsel = window.GetColourCUI(4);
            if (this.textselcol === "") this.textselcol = window.GetColourCUI(1);
        }
        if (s_linecol == 1 && window.IsTransparent && !this.dui) s_linecol = 0;
        var blend = get_blend(this.backcol == 0 ? 0xff000000 : this.backcol, this.textcol, 0.75);
        var ln_col = [0, RGBA(136, 136, 136, 85), blend, this.textcol];
        if (this.linecol === "") this.linecol = ln_col[this.linestyle];
        if (this.textselcol === "") this.textselcol = this.get_textselcol(this.backcolsel);
        blend = get_blend(this.backcol == 0 ? 0xff000000 : this.backcol, !s_col || s_col == 2 ? this.textcol : this.textcol_h, 0.75);
        if (this.txt_box === "") this.txt_box = s_col < 2 ? get_blend(!s_col ? this.textcol : this.textcol_h, this.backcol == 0 ? 0xff000000 : this.backcol, !s_col ? 0.65 : 0.7) : s_col == 2 ? this.textcol : this.textcol_h;
        if (this.node_style==0 && this.textsymbcol === "") this.textsymbcol = this.textcol;
        if (this.s_linecol === "") this.s_linecol = s_linecol == 0 ? RGBA(136, 136, 136, 85) : s_linecol == 1 ? blend : this.txt_box;
        if (window.IsTransparent && this.backcoltrans) {
            this.bg = true;
            this.backcol = this.backcoltrans
        }
        if (!window.IsTransparent || this.dui) {
            this.bg = true;
            if ((R(this.backcol) + G(this.backcol) + B(this.backcol)) > 759) this.b2 = 0x06000000;
        }
    }
	this.get_colors();

    this.get_font = function() {
        orig_font_sz = window.GetProperty("SYSTEM.Font Size", 16);

		this.font = g_font.normal;
		this.s_font = g_font.normal;
		this.font_small = g_font.min2;
        this.calc_text();
    }

    this.calc_text = function() {
        var i = gdi.CreateImage(1, 1),
            g = i.GetGraphics();
        this.row_h = this.row_p;
        this.node_sz = Math.min(this.node_sz_begin, this.row_h - 2);
        sp = Math.round(g.CalcTextWidth(" ", this.font));
        sp1 = Math.max(Math.round(sp * 1.5), 6);
        sp2 = Math.round(g.CalcTextWidth(this.expand, this.font));
        this.symbol_w = this.node_style>=0 ? this.node_sz + sp1 : sp + sp2;
        this.sel = (this.node_style>=0 ? sp1 : sp) / 2;
        this.tt = this.node_style>=0 ? -Math.ceil(sp1 / 2 - 3) + sp1 : sp;
        i.ReleaseGraphics(g);
        i = undefined;
    }

    this.wheel = function(step) {
        if (p.m_y > p.s_h) {
            this.get_font();
            this.calc_text();
            p.on_size();
            jS.on_size();
            if (p.s_show || this.scrollbar_show) but.refresh(true);
            sbar.reset();
            window.Repaint();
        } else {
            p.calc_text();
            but.refresh(true);
            p.search_paint();
        }
    }
}


function on_colours_changed() {
	get_colors();
	get_images();
    ui.reset_colors();
    ui.get_colors();
	g_tagswitcherbar.getImages();
    if (p.s_show) {
        but.create_images();
        but.refresh();
    }
    window.Repaint();
}

function on_font_changed() {
	get_font();
    ui.get_font();
	ui.setRowPadding();
    sbar.reset();
    on_size(window.Width, window.Height);
    if (p.s_show || ui.scrollbar_show) but.refresh(true);
}

function scrollbar() {
    var smoothness = 1 - window.GetProperty("Scroll: Smooth Scroll Level 0-1", 0.6561);
    smoothness = Math.max(Math.min(smoothness, 0.99), 0.01);
    this.count = -1;
    this.draw_timer = false;
    this.hover = false;
    this.s1 = 0;
    this.s2 = 0;
    this.scroll_step = window.GetProperty("Scroll - Mouse Wheel: Page Scroll", false);
    this.smooth = window.GetProperty("Scroll: Smooth Scroll", true);
    this.timer_but = false;
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;
    this.bar_ht = 0;
    this.but_h = 0;
    this.bar_y = 0;
    this.row_count = 0;
    this.scroll = 0;
    this.delta = 0;
    this.ratio = 1;
    this.rows_drawn = 0;
    this.row_h;
    this.scrollbar_height = 0;
    this.scrollable_lines = 0;
    this.scrollbar_travel = 0;
    this.b_is_dragging = false;
    this.drag_distance_per_row;
    this.initial_drag_y = 0; // dragging
    this.draw = function(gr) {
        if (this.scrollable_lines > 0) {
            try {
				if(this.hover || this.b_is_dragging) {
					width = cScrollBar.hoverWidth;
					color = colors.scrollbar_hover_cursor;
					x_pos = this.x+(this.w-width);
					y_pos = this.y + this.bar_y + cScrollBar.marginTop;
					height = this.bar_ht-cScrollBar.marginTop-cScrollBar.marginBottom;
				} else {
					width = cScrollBar.normalWidth-2;
					color = colors.scrollbar_normal_cursor;
					x_pos = this.x+(this.w-width)-3;
					y_pos = this.y + this.bar_y + cScrollBar.marginTop;
					height = this.bar_ht;
				}
                gr.FillSolidRect(x_pos, this.y + this.bar_y + cScrollBar.marginTop, width, this.bar_ht-cScrollBar.marginTop-cScrollBar.marginBottom, color);
            } catch (e) {}
        }
    }
    this.leave = function() {
        if (this.b_is_dragging) return;
        this.hover = false;
        this.hover_o = false;
        window.RepaintRect(Math.round(this.x), Math.round(this.y), this.w, this.h);
    }
    this.nearest = function(y) {
        y = (y - this.but_h) / this.scrollbar_height * this.scrollable_lines * this.row_h;
        y = y / this.row_h;
        y = Math.round(y) * this.row_h;
        return y;
    }
    this.reset = function() {
        this.delta = this.scroll = this.s1 = this.s2 = 0;
        this.metrics(this.x, this.y, this.w, this.h, this.rows_drawn, this.row_h);
    }
    this.scroll_timer = function() {
        var that = this;
        this.draw_timer = setInterval(function() {
            if (ui.w < 1 || !window.IsVisible) return;
            that.smooth_scroll();
        }, 16);
    }
    this.set_rows = function(row_count) {
        this.row_count = row_count;
        this.metrics(this.x, this.y, this.w, this.h, this.rows_drawn, this.row_h);
    }
    this.wheel = function(step) {
		if (g_tooltip.activated) pop.deactivate_tooltip();
        this.check_scroll(this.scroll + step * -(this.scroll_step ? this.rows_drawn : 3) * this.row_h);
    }

    this.metrics = function(x, y, w, h, rows_drawn, row_h) {
        this.x = x;
        this.y = Math.round(y);
        this.w = w;
        this.h = h;
        this.rows_drawn = rows_drawn;
        if (!p.autofit) this.rows_drawn = Math.floor(this.rows_drawn);
        this.row_h = row_h;
        this.but_h = 0;
		this.height_ratio = 1;
        // draw info
        this.scrollbar_height = this.h*this.height_ratio - this.but_h * 2;
        this.bar_ht = Math.max(Math.round(this.scrollbar_height * this.rows_drawn / this.row_count), 40);
        this.scrollbar_travel = this.scrollbar_height/this.height_ratio - this.bar_ht;
        // scrolling info
        this.scrollable_lines = this.row_count - this.rows_drawn;
        this.ratio = this.row_count / this.scrollable_lines;
        this.bar_y = this.but_h + this.scrollbar_travel * (this.delta * this.ratio) / (this.row_count * this.row_h);
        this.drag_distance_per_row = this.scrollbar_travel / this.scrollable_lines;
    }

    this.lbtn_up = function(p_x, p_y) {
        var x = p_x - this.x;
        var y = p_y - this.y;
        if (this.b_is_dragging) {
			this.b_is_dragging = false;
			p.tree_paint();
		}
        this.initial_drag_y = 0;
        if (this.timer_but) {
            window.ClearInterval(this.timer_but);
            this.timer_but = false;
        };
        this.count = -1;
		if(this.cursorSet && !this.hover) {
			g_cursor.setCursor(IDC_ARROW,34);
			this.cursorSet = false;
		}
    }

    this.lbtn_dn = function(p_x, p_y) {
        var x = p_x - this.x;
        var y = p_y - this.y;
        if (x < 0 || x > this.w || y < 0 || y > this.h || this.row_count <= this.rows_drawn) return;
        if (y < this.but_h || y > this.h - this.but_h) return;
        if (y < this.bar_y) return; // above bar
        else if (y > this.bar_y + this.bar_ht) return; // below bar
        //if (y < this.bar_y) var dir = 1; // above bar
        //else if (y > this.bar_y + this.bar_ht) var dir = -1; // below bar
        if (y < this.bar_y || y > this.bar_y + this.bar_ht)
            this.check_scroll(this.nearest(y));
        else { // on bar
            this.b_is_dragging = true;
            this.initial_drag_y = y - this.bar_y;
        }
    }

    this.move = function(p_x, p_y) {
        var x = p_x - this.x;
        var y = p_y - this.y;
        if (x < 0 || x > this.w || y > this.bar_y + this.bar_ht || y < this.bar_y) this.hover = false;
        else this.hover = true;
        if (this.hover != this.hover_o) {
			if(!this.hover){
				g_cursor.setCursor(IDC_ARROW,35);
				this.cursorSet = false;
				pop.cursor = IDC_ARROW;
			}
			if (g_tooltip.activated && this.hover) pop.deactivate_tooltip();
			p.tree_paint();
		}
		if((this.b_is_dragging || this.hover) && pop.cursor!=IDC_HAND){
			g_cursor.setCursor(IDC_HAND, "scrollbar");
			this.cursorSet = true;
			pop.cursor = IDC_HAND;
		}
        this.hover_o = this.hover;
        if (!this.b_is_dragging || this.row_count <= this.rows_drawn) return;
        this.check_scroll(Math.round((y - this.initial_drag_y - this.but_h) / this.drag_distance_per_row) * this.row_h);
    }
	this.middle_scroll = function(new_scroll) {
		var middle = p.sp/2.5;
		var middle_scroll = new_scroll - Math.floor(middle - middle%this.row_h);
		this.check_scroll(middle_scroll);
	}
    this.check_scroll = function(new_scroll) {
        var s = Math.max(0, Math.min(new_scroll, this.scrollable_lines * this.row_h));
        if (s == this.scroll) return;
        this.scroll = s;
        if (this.smooth) {
            if (!this.draw_timer) this.scroll_timer();
        }
        if (!this.smooth || this.draw_timer === 0) {
            this.delta = this.scroll;
            this.bar_y = this.but_h + this.scrollbar_travel * (this.delta * this.ratio) / (this.row_count * this.row_h);
            p.tree_paint();
        }
    }

    this.smooth_scroll = function() {
        if (Math.abs(this.scroll - this.delta) > 0.5) {
            this.s1 += (this.scroll - this.s1) * smoothness;
            this.s2 += (this.s1 - this.s2) * smoothness;
            this.delta += (this.s2 - this.delta) * smoothness;
            this.bar_y = this.but_h + this.scrollbar_travel * (this.delta * this.ratio) / (this.row_count * this.row_h);
            p.tree_paint();
        } else if (this.draw_timer) {
            clearTimeout(this.draw_timer);
            this.draw_timer = false;
        }
    }

    this.but = function(dir) {
        this.check_scroll(this.scroll + (dir * -this.row_h));
        if (!this.timer_but) {
            var that = this;
            this.timer_but = setInterval(function() {
                if (that.count > 6) {
                    that.check_scroll(that.scroll + (dir * -that.row_h));
                } else that.count++;
            }, 40);
        }
    }
}

function panel_operations() {
    var def_ppt = window.GetProperty("View by Folder Structure: Name // Pattern", "View by Folder Structure // Pattern Not Configurable");
    var DT_LEFT = 0x00000000,
        DT_CENTER = 0x00000001,
        DT_RIGHT = 0x00000002,
        DT_VCENTER = 0x00000004,
        DT_SINGLELINE = 0x00000020,
        DT_CALCRECT = 0x00000400,
        DT_NOPREFIX = 0x00000800,
        DT_END_ELLIPSIS = 0x00008000,
        grps = [],
        i = 0,
        sort = "";
    var view_ppt = [
        window.GetProperty("View 01: Name // Pattern", "View by Artist // %artist%|%album%|[[%discnumber%.]%tracknumber%. ][%track artist% - ]%title%"),
        window.GetProperty("View 02: Name // Pattern", "View by Album Artist // %album artist%|%album%|[[%discnumber%.]%tracknumber%. ][%track artist% - ]%title%"),
        window.GetProperty("View 03: Name // Pattern", "View by Album Artist - Album // [%album artist% - ]['['%date%']' ]%album%|[[%discnumber%.]%tracknumber%. ][%track artist% - ]%title%"),
        window.GetProperty("View 04: Name // Pattern", "View by Album // %album%[ '['%album artist%']']|[[%discnumber%.]%tracknumber%. ][%track artist% - ]%title%"),
        window.GetProperty("View 05: Name // Pattern", "View by Genre // %genre%|[%album artist% - ][(%date%) ]%album%|[[%discnumber%.]%tracknumber%. ][%track artist% - ]%title%"),
        window.GetProperty("View 06: Name // Pattern", "View by Year // %date%|[%album artist% - ]%album%|[[%discnumber%.]%tracknumber%. ][%track artist% - ]%title%")
    ];
    var nm = "",
        ppt_l = view_ppt.length + 1;
    for (i = ppt_l; i < ppt_l + 93; i++) {
        nm = window.GetProperty("View " + (i < 10 ? "0" + i : i) + ": Name // Pattern");
        if (nm && nm != " // ") view_ppt.push(window.GetProperty("View " + (i < 10 ? "0" + i : i) + ": Name // Pattern"));
    }

    var filter_ppt = [
        window.GetProperty("View Filter 01: Name // Query", "No // Query Not Configurable"),
        window.GetProperty("View Filter 02: Name // Query", "Lossless // \"$info(encoding)\" IS lossless"),
        window.GetProperty("View Filter 03: Name // Query", "Lossy // \"$info(encoding)\" IS lossy"),
        window.GetProperty("View Filter 04: Name // Query", "Missing Replaygain // %replaygain_track_gain% MISSING"),
        window.GetProperty("View Filter 05: Name // Query", "Never Played // %play_count% MISSING"),
        window.GetProperty("View Filter 06: Name // Query", "Played Often // %play_count% GREATER 9"),
        window.GetProperty("View Filter 07: Name // Query", "Recently Added // %added% DURING LAST 2 WEEKS"),
        window.GetProperty("View Filter 08: Name // Query", "Recently Played // %last_played% DURING LAST 2 WEEKS"),
        window.GetProperty("View Filter 09: Name // Query", "Top Rated // " + (globalProperties.use_ratings_file_tags ? "$meta(rating)" : "%rating%") + " GREATER 3")
    ];
    var filt_l = filter_ppt.length + 1;
    for (i = filt_l; i < filt_l + 90; i++) {
        nm = window.GetProperty("View Filter " + (i < 10 ? "0" + i : i) + ": Name // Query");
        if (nm && nm != " // ") filter_ppt.push(window.GetProperty("View Filter " + (i < 10 ? "0" + i : i) + ": Name // Query"));
    }

    this.cc = DT_CENTER | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX;
    this.l = DT_LEFT | DT_VCENTER | DT_SINGLELINE | DT_CALCRECT | DT_NOPREFIX;
    this.lc = DT_VCENTER | DT_CALCRECT | DT_NOPREFIX | DT_END_ELLIPSIS;
    this.rc = DT_RIGHT | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX;
    this.f_w = [];
    this.f_h = 0;
    this.f_x1 = 0;
    this.filt = [];
    this.folder_view = 10;
    this.grp = [];
    this.grp_sort = "";
    this.grp_split = [];
    this.grp_split_clone = [];
    this.grp_split_orig = [];
    this.f_menu = [];
    this.menu = [];
    this.multi_value = [];
    this.m_x = 0;
    this.m_y = 0;
    this.pos = -1;
    this.s_cursor = false;
    this.s_search = false;
    this.s_txt = "";
    this.s_x = 0;
    this.s_h = 0;
    this.s_w1 = 0;
    this.s_w2 = 0;
    this.single_br = false;
    this.statistics = false;
    this.tf = "";
    this.view = "";
    this.autofit = window.GetProperty("Auto Fit", true);
    this.syncType = window.GetProperty("Library Sync: Auto-0, Initialisation Only-1", 0);
    this.base = window.GetProperty("Node: Show All Music", false);
    this.s_show = window.GetProperty("Search: Hide-0, SearchOnly-1, Search+Filter-2", 2);
	this.tag_switcherbar = window.GetProperty("Tag switcher bar", false);
	this.showFiltersTogglerBtn = window.GetProperty("_PROPERTY: show filters toggler btn", false);
    if (!this.s_show) this.autofit = true;
    this.filter_by = window.GetProperty("SYSTEM.Filter By", 0);
    this.items = function() {
        return new FbMetadbHandleList();
    };
    this.list = this.items();
    this.reset = window.GetProperty("SYSTEM.Reset Tree", false);
    this.search_paint = function() {
        window.RepaintRect(ui.margin, sL.y, ui.w - ui.margin, this.s_h);
    }
    this.set_statistics_mode = function() {
        this.statistics = false;
        var chk = this.grp[this.view_by].name + this.grp[this.view_by].type + this.filt[this.filter_by].name + this.filt[this.filter_by].type;
        chk = chk.toUpperCase();
        if (chk.indexOf("ADD") != -1 || chk.indexOf("PLAY") != -1 || chk.indexOf("RATING") != -1) this.statistics = true;
    }
    this.show_tracks = window.GetProperty("Node: Show Tracks", true);
    this.sort = function(li) {
        switch (this.view_by) {
            case this.folder_view:
                li.OrderByPath();
                //li.OrderByRelativePath();
                break;
            default:
                var tfs = fb.TitleFormat(this.grp_sort);
                li.OrderByFormat(fb.TitleFormat(this.grp_sort), 1);
                break;
        }
    }
    this.tooltip = window.GetProperty("Tooltips", true);
    this.tree_paint = function() {
        window.Repaint();
    }
    this.view_by = window.GetProperty("SYSTEM.View By", 1);
    this.calc_text = function() {
        this.f_w = [];
        var im = gdi.CreateImage(1, 1),
            g = im.GetGraphics();
        for (i = 0; i < this.filt.length; i++) {
            this.f_w[i] = g.CalcTextWidth(this.filt[i].name, g_font.normal);
            if (!i) this.f_h = g.CalcTextHeight("String", g_font.normal);
        }
        this.f_sw = g.CalcTextWidth("?", g_font.normal);
        this.f_x1 = ui.w - ui.margin - this.f_w[this.filter_by] - this.f_sw;
        this.s_w2 = this.s_show > 1 ? this.f_x1 - this.s_x - 11 : this.s_w1 - Math.round(ui.row_h * 0.75) - this.s_x + 1;
        im.ReleaseGraphics(g);
        im = undefined;
    }

    this.fields = function(view, filter) {
        this.filt = [];
        this.folder_view = 10;
        this.grp = [];
        this.grp_sort = "";
        this.multi_process = false;
        this.filter_by = filter;
        this.view_by = view;
        for (i = 0; i < view_ppt.length; i++) {
            if (view_ppt[i].indexOf("//") != -1) {
                grps = view_ppt[i].split("//");
                this.grp[i] = {
                    name: grps[0].trim(),
                    type: grps[1].replace(/\|\]/g, " - ]").replace(/\[\|/g, "[ - ").trim()
                }
            }
        }
        grps = [];
        for (i = 0; i < filter_ppt.length; i++) {
            if (filter_ppt[i].indexOf("//") != -1) {
                grps = filter_ppt[i].split("//");
                this.filt[i] = {
                    name: grps[0].trim(),
                    type: grps[1].trim()
                }
            }
        }
        i = this.grp.length;
        while (i--)
            if (!this.grp[i] || this.grp[i].name == "" || this.grp[i].type == "") this.grp.splice(i, 1);
        i = this.filt.length;
        while (i--)
            if (!this.filt[i] || this.filt[i].name == "" || this.filt[i].type == "") this.filt.splice(i, 1);
        this.grp[this.grp.length] = {
            name: def_ppt.split("//")[0].trim(),
            type: ""
        }
        this.folder_view = this.grp.length - 1;
        this.filter_by = Math.min(this.filter_by, this.filt.length - 1);
        this.view_by = Math.min(this.view_by, this.grp.length - 1);
        if (this.view_by != this.folder_view) {
            this.grp_split = this.grp[this.view_by].type.split("|");
            this.single_br = !this.base && (this.grp_split.length == 1 || this.grp_split.length == 2 && !this.show_tracks);
            this.tf = this.grp_split.length > 1 ? this.grp_split.pop() : this.grp_split[0];
            for (i = 0; i < this.grp_split.length; i++) {
                this.grp_split[i] = this.grp_split[i].trim();
                this.multi_value[i] = this.grp_split[i].indexOf("%<") != -1 ? true : false;
                if (this.grp_split[i].indexOf("%<") != -1) this.multi_process = true;
                if (this.multi_value[i]) {
                    this.grp_split_orig[i] = this.grp_split[i].slice();
                    this.grp_split[i] = this.grp_split[i].replace(/%<album artist>%/i, "$if3(%<album artist>%,%<artist>%,%<composer>%,%<performer>%)").replace(/%<album>%/i, "$if2(%<album>%,%<venue>%)").replace(/%<artist>%/i, "$if3(%<artist>%,%<album artist>%,%<composer>%,%<performer>%)");
                    this.grp_split_clone[i] = this.grp_split[i].slice();
                    this.grp_split[i] = this.grp_split_orig[i].replace(/[<>]/g, "");
                }
                this.grp_sort += (this.grp_split[i] + "|");
                if (this.multi_value[i]) this.grp_split[i] = this.grp_split_clone[i].replace(/%</g, "#!#$meta_sep(").replace(/>%/g, "," + "|)#!#");
            }
            this.grp_sort = this.grp_sort + this.tf;
            this.view = this.grp_split[0];
        }
        this.set_statistics_mode();
        window.SetProperty("SYSTEM.Filter By", filter);
        window.SetProperty("SYSTEM.View By", view);
        this.f_menu = [];
        this.menu = [];
        for (i = 0; i < this.grp.length; i++) this.menu.push(this.grp[i].name);
        for (i = 0; i < this.filt.length; i++) {
            this.f_menu.push(this.filt[i].name);
        }
		this.menu.splice(this.menu.length, 0, "Panel Properties");
        if (this.syncType) this.menu.splice(this.menu.length, 0, "Refresh");
        this.menu.splice(this.menu.length, 0, "Configure...");
        this.calc_text();
    }
    this.fields(this.view_by, this.filter_by);

    var k = 1;
    for (i = 0; i < 100; i++) {
        nm = window.GetProperty("View " + (i < 10 ? "0" + i : i) + ": Name // Pattern");
        if (nm && nm != " // ") {
            window.SetProperty("View " + (k < 10 ? "0" + k : k) + ": Name // Pattern", nm);
            k += 1
        } else window.SetProperty("View " + (i < 10 ? "0" + i : i) + ": Name // Pattern", null);
    }
    for (i = k; i < k + 5; i++) window.SetProperty("View " + (i < 10 ? "0" + i : i) + ": Name // Pattern", " // ");
    k = 1;
    for (i = 0; i < 100; i++) {
        nm = window.GetProperty("View Filter " + (i < 10 ? "0" + i : i) + ": Name // Query");
        if (nm && nm != " // ") {
            window.SetProperty("View Filter " + (k < 10 ? "0" + k : k) + ": Name // Query", nm);
            k += 1
        } else window.SetProperty("View Filter " + (i < 10 ? "0" + i : i) + ": Name // Query", null);
    }
    for (i = k; i < k + 5; i++) window.SetProperty("View Filter " + (i < 10 ? "0" + i : i) + ": Name // Query", " // ");

    this.on_size = function() {
        this.f_x1 = ui.w - ui.margin - this.f_w[this.filter_by] - this.f_sw;
        this.s_x = Math.round(ui.margin + properties.headerbar_height*4/5)-4;
        this.s_w1 = ui.w - ui.margin;
        this.s_w2 = this.s_show > 1 ? this.f_x1 - this.s_x - 11 : this.s_w1 - Math.round(ui.row_h * 0.75) - this.s_x + 1;
        this.ln_sp = this.s_show ? ui.row_h * 0.1 : 0;
        //this.s_h = this.s_show ? ui.row_h + this.ln_sp : ui.margin;
		this.s_h = properties.headerbar_height + ((p.tag_switcherbar)?g_tagswitcherbar.default_height:0);
		if (!p.s_show) this.s_h = ((p.tag_switcherbar)?g_tagswitcherbar.default_height-1:0);
        this.s_sp = this.s_h - ((p.tag_switcherbar)?g_tagswitcherbar.default_height:0);
        this.sp = ui.h - this.s_h - (this.s_show ? 0 : ui.margin);
        this.rows = this.sp / ui.row_h;
        if (this.autofit) {
            this.rows = Math.floor(this.rows);
            this.sp = ui.row_h * this.rows;
        }
        this.node_y = Math.round((ui.row_h - ui.node_sz) / 2);
		ui.scr_w = cScrollBar.activeWidth;
        var scr_w = ui.scr_w;
        if (this.scrollbar_show) scr_w += 5;
        this.r_mg = Math.max(ui.margin, scr_w);
        sbar.metrics(ui.w - ui.scr_w, this.s_h, Math.max(ui.scr_w, 0), ui.h -  this.s_h, this.rows, ui.row_h);

		sL.setSize(0,0,ui.w,this.s_sp);

    }
}

window.DlgCode = 0x004;

function v_keys() {
    this.selAll = 1;
    this.copy = 3;
    this.back = 8;
    this.enter = 13;
    this.shift = 16;
    this.paste = 22;
    this.cut = 24;
    this.redo = 25;
    this.undo = 26;
    this.pgUp = 33;
    this.pgDn = 34;
    this.end = 35;
    this.home = 36;
    this.left = 37;
    this.up = 38;
    this.right = 39;
    this.dn = 40;
    this.del = 46;
    this.k = function(n) {
        switch (n) {
            case 0:
                return utils.IsKeyPressed(0x10);
                break;
            case 1:
                return utils.IsKeyPressed(0x11);
                break;
            case 2:
                return utils.IsKeyPressed(0x12);
                break;
        }
    }
}


function library_manager() {
    var exp = [],
        expanded_items = [],
        lib_update = false,
        name_idx = [],
        name_ix = [],
        node = [],
        node_s = [],
        process = false,
        scr = [],
        sel = [];
    this.allmusic = [];
    this.list;
    this.none = "";
    this.node = [];
    this.root = [];
    this.populate_from_active_playlist = false;
    this.time = fb.CreateProfiler();
    this.upd = false, this.upd_search = false;
    var tr_sort = function(data) {
        data.sort(function(a, b) {
            return parseFloat(a.tr) - parseFloat(b.tr)
        });
        return data;
    }
    this.update = function(callID) {
        if (ui.w < 1 || !window.IsVisible) this.upd = true;
        else {
            this.refresh(false,callID);
            this.upd = false;
        }
    }

    this.refresh = function(b,callID) {
        if (this.upd) {
            p.search_paint();
            p.tree_paint();
        }
        var ix = -1,
            tr = 0;
        process = false;
        if (pop.tree.length && (!b || b && !p.reset)) {
            tr = 0;
            expanded_items = [];
            process = true;
            scr = [];
            sel = [];
            for (var i = 0; i < pop.tree.length; i++) {
                tr = !p.base ? pop.tree[i].tr : pop.tree[i].tr - 1;
                expanded_items.push({
                    tr: tr,
                    a: tr < 1 ? pop.tree[i].name : pop.tree[pop.tree[i].par].name,
                    b: tr < 1 ? "" : pop.tree[i].name
                });
                tr = pop.tree[i].tr;
                if (pop.tree[i].sel == true) sel.push({
                    tr: tr,
                    a: pop.tree[i].name,
                    b: tr != 0 ? pop.tree[pop.tree[i].par].name : "",
                    c: tr > 1 ? pop.tree[pop.tree[pop.tree[i].par].par].name : ""
                });
            }
            var l = Math.min(Math.floor(p.rows), pop.tree.length);
            ix = pop.get_ix(0, p.s_h + ui.row_h / 2, true, false);
            tr = 0;
            for (var i = ix; i < ix + l; i++) {
				try{
					tr = pop.tree[i].tr;
					scr.push({
						tr: tr,
						a: pop.tree[i].name,
						b: tr != 0 ? pop.tree[pop.tree[i].par].name : "",
						c: tr > 1 ? pop.tree[pop.tree[pop.tree[i].par].par].name : ""
					})
				} catch(e){}
            }
            //exp = JSON_parse(JSON_stringify(tr_sort(expanded_items)));
        }
        lib_update = true;
        this.get_library();
        this.rootNodes(callID);
    }

    this.get_library = function() {
        if (this.list) this.list = undefined;
        if (p.list) p.list = undefined;
        this.time.Reset();
        this.none = "";
		if(this.populate_from_active_playlist){
			this.list = plman.GetPlaylistItems(plman.ActivePlaylist);
			this.populate_from_active_playlist = false;
		}	else {
			this.list = fb.GetLibraryItems();
		}
        if (!this.list.Count) {
            pop.tree = [];
            pop.line_l = 0;
            sbar.set_rows(0);
            this.none = ""; //"Nothing to show\n\nConfigure Media Library first\n\nFile>Preferences>Media library";
            p.tree_paint();
            return;
        }
        if (p.filter_by > 0 && p.s_show > 1) try {
            this.list = fb.GetQueryItems(this.list, p.filt[p.filter_by].type)
        } catch (e) {};
        if (!this.list.Count) {
            pop.tree = [];
            pop.line_l = 0;
            sbar.set_rows(0);
            this.none = "Nothing found";
            p.tree_paint();
            return;
        }
        this.rootNames("", 0);
    }

    this.rootNames = function(li, search) {
        var i = 0,
            name = "",
            search_name = "",
            tf = fb.TitleFormat(p.view),
            total;
        switch (search) {
            case 0:
                p.sort(this.list);
                li = p.list = this.list;
                name_idx = [];
                break;
            case 1:
                name_ix = [];
                break;
        }

        total = li.Count;
        var tree_type = !search ? p.view_by != p.folder_view ? !p.base ? 0 : 1 : !p.base ? 2 : 3 : p.view_by != p.folder_view ? !p.base ? 4 : 7 : !p.base ? 5 : 6;
        switch (tree_type) {
            case 0:
                for (i = 0; i < total; i++) {
                    name = tf.EvalWithMetadb(li[i]);
                    name_idx[i] = !name.length || name == "#!##!#" ? "?" : name;
                };
                break;
            case 1:
                for (i = 0; i < total; i++) {
                    this.allmusic[i] = tf.EvalWithMetadb(li[i]);
                };
                break;
            case 2:
                for (i = 0; i < total; i++) {
                    node[i] = fb.GetLibraryRelativePath(li[i]).split("\\");
                    name_idx[i] = node[i][0];
                };
                break;
            case 3:
                for (i = 0; i < total; i++) {
                    node[i] = fb.GetLibraryRelativePath(li[i]).split("\\");
                };
                break;
            case 4:
                for (i = 0; i < total; i++) {
                    name = tf.EvalWithMetadb(li[i]);
                    name_ix[i] = !name.length || name == "#!##!#" ? "?" : name;
                };
                break
            case 5:
                for (i = 0; i < total; i++) {
                    node_s[i] = fb.GetLibraryRelativePath(li[i]).split("\\");
                    name_ix[i] = node_s[i][0];
                };
                break;
            case 6:
                for (i = 0; i < total; i++) {
                    node_s[i] = fb.GetLibraryRelativePath(li[i]).split("\\");
                };
                break;
        }
    }
	this.expand_search_items = function() {
		if(p.s_txt){
			tree_l = pop.tree.length;
			for (j = 0; j < tree_l; j++){
				var regex = new RegExp("" + p.s_txt + "", "i");
				var input = pop.tree[j].name;
				var output = input.match(regex);
				if (output) {
					pop.branch(pop.tree[j]);
					break;
				}
				if(pop.tree[j].child.length>0) {
					this.expand_search_items(pop.tree[j].child)
				}
			}
		}
	}
    this.rootNodes = function(callID) {
        this.root = [];
        var i = 0,
            j = 1,
            h = 0,
            l = 0,
            n = "";
        if (p.s_txt && (this.upd_search || lib_update)) {
            if (!this.list.Count) return;
            this.none = "";
            try {
                p.list = fb.GetQueryItems(this.list, p.s_txt.toLowerCase())
            } catch (e) {};
            if (!p.list.Count) {
                pop.tree = [];
                pop.line_l = 0;
                sbar.set_rows(0);
                this.none = "Nothing found";
                p.tree_paint();
                return;
            }
            this.rootNames(p.list, 1);
            this.node = node_s.slice();
            this.upd_search = false;
        } else if (!p.s_txt) {
            p.list = this.list;
            this.node = node.slice()
        };
        var arr = !p.s_txt ? name_idx : name_ix,
            n_o = "#get_node#",
            nU = "",
            total = p.list.Count;
        if (!p.base) {
            for (l = 0; l < total; l++) {
                n = arr[l];
                nU = n.toUpperCase();
                if (nU != n_o) {
                    n_o = nU;
                    this.root[i] = {
                        name: n,
                        sel: false,
                        child: [],
                        item: []
                    };
                    this.root[i].item.push(l);
                    i++;
                } else this.root[i - 1].item.push(l);
            }
			if(pop.show_aggregate_item && this.root.length>1){
				all_elems = {
					name: "All ("+this.root.length+" elements)",
					sel: false,
					totop: true,
					child: [],
					item: []
				}
				for (l = 0; l < total; l++) all_elems.item.push(l);
				this.root.unshift(all_elems);
			}
        } else {
            this.root[0] = {
                name: "All Music",
                sel: false,
                child: [],
                item: []
            };
            for (l = 0; l < total; l++) this.root[0].item.push(l);
        }
        if (!lib_update) sbar.reset();
        /* Draw tree -> */
        if (!p.base || p.s_txt) pop.buildTree(this.root, 0);
        if (p.base) pop.branch(this.root[0],p.base,true);

        console.log("--> populate Library Tree in: " + this.time.Time / 1000 + " seconds call_id:"+callID);
        var gp = p.grp_split.length,
            tot = this.list.Count;
        if (gp > 1 && !p.s_txt && p.view_by != p.folder_view) {
            this.node = [];
            for (h = 0; h < gp; h++) this.node[h] = [];
            var tf_gr = [];
            for (j = 1; j < gp; j++) tf_gr[j] = fb.TitleFormat(p.grp_split[j])
            for (i = 0; i < tot; i++)
                for (j = 1; j < gp; j++)
					this.node[j][i] = tf_gr[j].EvalWithMetadb(this.list[i]);
        }
        if (lib_update && process) {
            try {
                var exp_l = exp.length,
                    scr_l = scr.length,
                    sel_l = sel.length,
                    tree_l = pop.tree.length;
                for (h = 0; h < exp_l; h++) {
                    if (exp[h].tr == 0) {
                        for (j = 0; j < tree_l; j++)
                            if (pop.tree[j].name.toUpperCase() == exp[h].a.toUpperCase()) {
                                pop.branch(pop.tree[j]);
                                break;
                            }
                    } else if (exp[h].tr > 0) {
                        for (j = 0; j < tree_l; j++)
                            if (pop.tree[j].name.toUpperCase() == exp[h].b.toUpperCase() && pop.tree[pop.tree[j].par].name.toUpperCase() == exp[h].a.toUpperCase()) {
                                pop.branch(pop.tree[j]);
                                break;
                            }
                    }
                }
                for (h = 0; h < sel_l; h++) {
                    if (sel[h].tr == 0) {
                        for (j = 0; j < tree_l; j++)
                            if (pop.tree[j].name.toUpperCase() == sel[h].a.toUpperCase()) {
                                pop.tree[j].sel = true;
                                break;
                            }
                    } else if (sel[h].tr == 1) {
                        for (j = 0; j < tree_l; j++)
                            if (pop.tree[j].name.toUpperCase() == sel[h].a.toUpperCase() && pop.tree[pop.tree[j].par].name.toUpperCase() == sel[h].b.toUpperCase()) {
                                pop.tree[j].sel = true;
                                break;
                            }
                    } else if (sel[h].tr > 1) {
                        for (j = 0; j < tree_l; j++)
                            if (pop.tree[j].name.toUpperCase() == sel[h].a.toUpperCase() && pop.tree[pop.tree[j].par].name.toUpperCase() == sel[h].b.toUpperCase() && pop.tree[pop.tree[pop.tree[j].par].par].name.toUpperCase() == sel[h].c.toUpperCase()) {
                                pop.tree[j].sel = true;
                                break;
                            }
                    }
                }
                var scr_pos = false;
                h = 0;
                while (h < scr_l && !scr_pos) {
                    if (scr[h].tr == 0) {
                        for (j = 0; j < tree_l; j++)
                            if (pop.tree[j].name.toUpperCase() == scr[h].a.toUpperCase()) {
                                sbar.check_scroll(!h ? j * ui.row_h : (j - 3) * ui.row_h);
                                scr_pos = true;
                                break;
                            }
                    } else if (scr[h].tr == 1 && !scr_pos) {
                        for (j = 0; j < tree_l; j++)
                            if (pop.tree[j].name.toUpperCase() == scr[h].a.toUpperCase() && pop.tree[pop.tree[j].par].name.toUpperCase() == scr[h].b.toUpperCase()) {
                                sbar.check_scroll(!h ? j * ui.row_h : (j - 3) * ui.row_h);
                                scr_pos = true;
                                break;
                            }
                    } else if (scr[h].tr > 1 && !scr_pos) {
                        for (j = 0; j < tree_l; j++)
                            if (pop.tree[j].name.toUpperCase() == scr[h].a.toUpperCase() && pop.tree[pop.tree[j].par].name.toUpperCase() == scr[h].b.toUpperCase() && pop.tree[pop.tree[pop.tree[j].par].par].name.toUpperCase() == scr[h].c.toUpperCase()) {
                                sbar.check_scroll(!h ? j * ui.row_h : (j - 3) * ui.row_h);
                                scr_pos = true;
                                break;
                            }
                    }
                    h++;
                }
                if (!scr_pos) {
                    sbar.reset();
                    p.tree_paint();
                }
            } catch (e) {};
        }

		if (this.root.length==1) pop.branch(this.root[0],p.base,true);

        if (lib_update && !process) {
            sbar.reset();
            p.tree_paint();
        }
        lib_update = false;
    }
}


function populate() {
    var get_pos = -1,
        ix_o = 0,
		old_hover_node = false,
		hover_node = false,
        last_sel = -1,
		send_x = -1,
        m_i = -1,
        tt = "",
        tooltip = false,
        tt_id = -1;
    this.auto = window.GetProperty("Node: Auto Collapse", false);
	this.populated = false;
	this.lclick_action_done = false;
    var autoplay = window.GetProperty("Playlist: Play On Send From Menu", false);
    var btn_pl = window.GetProperty("Playlist Use: 0 or 1", "General,1,Alt+LeftBtn,1,MiddleBtn,1").replace(/\s+/g, "").split(",");
    if (btn_pl[0] == "LeftBtn") window.SetProperty("Playlist Use: 0 or 1", "General," + btn_pl[1] + ",Alt+LeftBtn," + btn_pl[3] + ",MiddleBtn," + btn_pl[5]);
    var custom_sort = window.GetProperty("Playlist: Custom Sort", "");
    var dbl_action = window.GetProperty("Double-Click Action: ExplorerStyle-0 Play-1", 1);
    var alt_lbtn_pl = btn_pl[3] == 1 ? true : false,
        mbtn_pl = btn_pl[5] == 1 ? true : false;
	var lib_playlist = globalProperties.selection_playlist;
    this.show_counts = window.GetProperty("Node: Show Item Counts", false);
	this.autoExpandSingleChild = window.GetProperty("Node: Auto Expand Single Childs", false);
    this.show_aggregate_item = window.GetProperty("Node: Show Aggregate Item", false);
    var symb = window.CreateThemeManager("TREEVIEW");
    var im = gdi.CreateImage(ui.node_sz, ui.node_sz),
        g = im.GetGraphics(),
        symb_style = 0;
    if (ui.node_style>0) try {
        symb.SetPartAndStateId(2, 1);
        symb.SetPartAndStateId(2, 2);
        symb.DrawThemeBackground(g, 0, 0, ui.node_sz, ui.node_sz);
    } catch (e) {
        symb_style = 1;
    }
    im.ReleaseGraphics(g);
    im = undefined;
    var symb_style = 0;
    this.line_l = 0;
    this.sel_items = [];
    this.tree = [];
    this.setCursor = IDC_ARROW;
    if (!window.GetProperty("SYSTEM.Playlist Checked", false)) fb.ShowPopupMessage("Library Tree uses the following playlist by default:\n\nLibrary Selection\n\nIf you wish to use a different playlist, change the one used by Library Tree in panel properties.", "Library Tree");
    window.SetProperty("SYSTEM.Playlist Checked", true);
    var arr_index = function(arr, item) {
        var n = -1;
        for (var i = 0; i < arr.length; i++)
            if (arr[i] == item) {
                n = i;
                break;
            }
        return n;
    }
    var check_node = function(gr) {
        if (sbar.draw_timer || ui.node_style==0) return;
        symb_style = 0;
        try {
            symb.SetPartAndStateId(2, 1);
            symb.SetPartAndStateId(2, 2);
            symb.DrawThemeBackground(gr, -ui.node_sz, -ui.node_sz, ui.node_sz, ui.node_sz);
        } catch (e) {
            symb_style = 1;
        }
    }
    var draw_node = function(gr, parent, x, y, hover, index) {
		symb_style = (ui.node_themed)? ui.node_style : 0;
		y = Math.round(y);
		if(hover) {
			if(g_cursor.getCursor()!=IDC_HAND) {
				g_cursor.setCursor(IDC_HAND, "node");
				pop.cursor = IDC_HAND;
				pop.setCursor = IDC_HAND;
			}
		} else {
			if(g_cursor.getCursor()!=IDC_ARROW && pop.cursor != IDC_HAND) {
				if(pop.setCursor==IDC_HAND) {
					g_cursor.setCursor(IDC_ARROW,36);
					pop.setCursor = IDC_ARROW;
				}
			}
		}
        switch (symb_style) {
            case 0:
                if (parent) {
					if(hover) {
						gr.FillSolidRect(x + 1, y + Math.floor(ui.node_sz / 2), ui.node_sz - 2, 1, colors.node_icon_soft);
						gr.FillSolidRect(x + Math.floor(ui.node_sz / 2), y + 1, 1, ui.node_sz - 2, colors.node_icon_soft);
					} else {
						gr.FillSolidRect(x + 2, y + Math.floor(ui.node_sz / 2), ui.node_sz - 4, 1, colors.node_icon_soft);
						gr.FillSolidRect(x + Math.floor(ui.node_sz / 2), y + 2, 1, ui.node_sz - 4, colors.node_icon_soft);
					}
				} else {
					if(hover) {
						gr.FillSolidRect(x + 1, y + Math.floor(ui.node_sz / 2), ui.node_sz - 2, 1, colors.node_icon_soft);
					} else {
						gr.FillSolidRect(x + 2, y + Math.floor(ui.node_sz / 2), ui.node_sz - 4, 1, colors.node_icon_soft);
					}
				}
                break;
            case 1:
                if (parent) {
					if(hover) {
						gr.FillSolidRect(x, y, ui.node_sz, ui.node_sz, colors.node_bg_bold);
						gr.DrawRect(x, y, ui.node_sz - 1, ui.node_sz - 1, 1, colors.node_outline_bold);
						gr.FillSolidRect(x + 2, y + Math.floor(ui.node_sz / 2), ui.node_sz - 4, 1, colors.node_icon_bold);
						gr.FillSolidRect(x + Math.floor(ui.node_sz / 2), y + 2, 1, ui.node_sz - 4, colors.node_icon_bold);
					} else {
						gr.FillSolidRect(x, y, ui.node_sz, ui.node_sz, colors.node_bg);
						gr.DrawRect(x, y, ui.node_sz - 1, ui.node_sz - 1, 1, colors.node_outline);
						gr.FillSolidRect(x + 2, y + Math.floor(ui.node_sz / 2), ui.node_sz - 4, 1, colors.node_icon);
						gr.FillSolidRect(x + Math.floor(ui.node_sz / 2), y + 2, 1, ui.node_sz - 4, colors.node_icon);
					}
				} else {
					gr.FillSolidRect(x, y, ui.node_sz, ui.node_sz, colors.node_bg_bold);
					gr.DrawRect(x, y, ui.node_sz - 1, ui.node_sz - 1, 1, colors.node_outline_bold);
					gr.FillSolidRect(x + 2, y + Math.floor(ui.node_sz / 2), ui.node_sz - 4, 1, colors.node_icon_bold);
				}
                break;
            case 2:
				if (parent) {
					if(hover) {
						gr.FillPolygon(colors.node_bg_bold, 1, [x+2,y,x+6,y+5,x+2,y+9]);
					} else {
						gr.DrawLine(x+2,y+1,x+5,y+4,1,colors.node_bg_bold);
						gr.DrawLine(x+5,y+4,x+2,y+7,1,colors.node_bg_bold);
					}
				}
				else gr.FillPolygon(colors.node_bg_bold, 1, [x+7,y,x+7,y+7,x,y+7]);
                break;
        }
    }
    var num_sort = function(a, b) {
        return a - b;
    }
    var plID = function(Playlist_Name) {
        for (var i = 0; i < plman.PlaylistCount; i++)
            if (plman.GetPlaylistName(i) == Playlist_Name) return i;
        plman.CreatePlaylist(plman.PlaylistCount, Playlist_Name);
        return i;
    }
    var searchBranches = function(item, tr) {
        var nn = "",
            tf_l = fb.TitleFormat("[" + p.grp_split[tr] + "]");
        if (tr < p.grp_split.length) {
            nn = tf_l.EvalWithMetadb(p.list[item]);
            if (!nn || nn == "#!##!#") nn = "?";
            return nn;
        } else return "#get_track#";
    }
    var sort = function(c, d) {
		if(c.totop) return -1;
		if(d.totop) return 1;
        a = c.name.toUpperCase().replace(/^\?/, "");
        b = d.name.toUpperCase().replace(/^\?/, "");
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
    }
    var uniq = function(a) {
        var j = 0,
            len = a.length,
            out = [],
            seen = {};
        for (var i = 0; i < len; i++) {
            var item = a[i];
            if (seen[item] !== 1) {
                seen[item] = 1;
                out[j++] = item;
            }
        }
        return out.sort(num_sort);
    }
    this.add = function(x, y, pl) {
        if (y < p.s_h) return;
        var ix = this.get_ix(x, y, true, false);
        p.pos = ix;
        if (ix < this.tree.length && ix >= 0)
            if (this.check_ix(this.tree[ix], x, y, true)) {
                this.load(this.tree[ix].item, true, true, false, pl, false);
                this.tree[ix].sel = true;
                this.get_sel_items();
            }
    }
    this.branch_chg = function(br) {
        var new_br = 0;
        if (br.tr == 0) {
            for (var i = 0; i < lib.root.length; i++) {
                new_br += lib.root[i].child.length;
                lib.root[i].child = [];
            }
        } else {
            var par = this.tree[br.par];
            for (var i = 0; i < par.child.length; i++) {
                new_br += par.child[i].child.length;
                par.child[i].child = [];
            }
        }
        return new_br;
    }
    this.clear = function() {
        for (var i = 0; i < this.tree.length; i++) this.tree[i].sel = false;
    }
    this.clear_child = function(br) {
        br.child = [];
        this.buildTree(lib.root, 0, true, true);
    }
    this.deactivate_tooltip = function() {
		g_tooltip.Deactivate();
    }
    this.gen_pl = btn_pl[1] == 1 ? true : false,
	this.get_sel_items = function() {
		this.sel_items = [];
		this.sel_group_count = 0;
		for (var i = 0; i < this.tree.length; i++) {
			if (this.tree[i].sel) {
				this.sel_items.push.apply(this.sel_items, this.tree[i].item);
				this.sel_group_count++;
			}
		}
		this.sel_items = uniq(this.sel_items);
	}
    this.mbtn_dn = function(x, y) {
        this.add(x, y, mbtn_pl);
    }

    this.activate_tooltip = function(ix, row, x, y) {
        if (g_tooltip.activeZone == ix) {
            return;
        }
		new_tooltip_text = this.tree[ix].name //+ (((this.tree[ix].track && p.show_tracks) || !pop.show_counts) ? ("") : (" (" + this.tree[ix].item.length + ")"));
		g_tooltip.ActivateDelay(new_tooltip_text, x+10, y+20, globalProperties.tooltip_button_delay, 0, false, ix);
		return;
    }

    this.branch = function(br, base, node) {
        if (!br) return;
        var br_l = br.item.length,
            branch = false,
            folderView = p.view_by == p.folder_view ? true : false,
            i = 0,
            k = 0,
            isTrack = false,
            l = base ? 0 : p.base ? br.tr : br.tr + 1,
            n = "",
            n_o = "#get_branch#",
            nU = "",
            tf = fb.TitleFormat(p.tf),
            treatAsTrack = !folderView && l < p.grp_split.length - 1 ? true : false;
        if (folderView) base = false;
        if (base) node = false;
        if (!folderView && l < p.grp_split.length) branch = true;
        if (!folderView && !branch && !p.show_tracks) return;
        for (k = 0; k < br_l; k++) {
            var get_track = true,
                pos = br.item[k];
            if (folderView && l == lib.node[pos].length - 1 && !p.show_tracks) get_track = false;
            if (get_track) try {
                if (base) {
                    n = lib.allmusic[pos];
                    if (!n || n == "#!##!#") n = "?";
                }
                if (!p.s_txt && !base) {
                    if (branch || folderView && l < lib.node[pos].length - 1) {
                        n = (!folderView ? lib.node[l][pos] : lib.node[pos][l]);
                        if (!n || n == "#!##!#") n = "?";
                    } else n = "#get_track#";
                } else if (p.s_txt) {
                    if (folderView && l < lib.node[pos].length - 1) {
                        n = lib.node[pos][l];
                        if (!n || n == "#!##!#") n = "?";
                    } else n = searchBranches(pos, l);
                }
                if (br.track) continue;
                isTrack = p.show_tracks ? false : treatAsTrack || folderView && l < lib.node[pos].length - 2 ? false : true;
                if (n == "#get_track#") {
                    n = !folderView ? tf.EvalWithMetadb(p.list[pos]) : lib.node[pos][l];
                    isTrack = true;
                }
                nU = n.toUpperCase();
                if (n_o != nU) {
                    n_o = nU;
                    br.child[i] = {
                        name: n,
                        sel: false,
                        child: [],
                        track: isTrack,
                        item: []
                    };
                    br.child[i].item.push(pos);
                    i++;
                } else br.child[i - 1].item.push(pos);
            } catch (e) {}
        }
        this.buildTree(lib.root, 0, node, true);
		if(br.child.length==1 && pop.autoExpandSingleChild) pop.branch(br.child[0], false , true);
    }

    var getAllCombinations = function(n) {
        var combinations = [],
            divisors = [],
            nn = [],
            arraysToCombine = [];
        nn = n.split("#!#");
        for (var i = 0; i < nn.length; i++) {
            nn[i] = nn[i].split("|");
            if (nn[i] != "") arraysToCombine.push(nn[i]);
        }
        for (var i = arraysToCombine.length - 1; i >= 0; i--) divisors[i] = divisors[i + 1] ? divisors[i + 1] * arraysToCombine[i + 1].length : 1;

        function getPermutation(n, arraysToCombine) {
            var result = [],
                curArray;
            for (var i = 0; i < arraysToCombine.length; i++) {
                curArray = arraysToCombine[i];
                result.push(curArray[Math.floor(n / divisors[i]) % curArray.length]);
            }
            return result;
        }
        var numPerms = arraysToCombine[0].length;
        for (var i = 1; i < arraysToCombine.length; i++) numPerms *= arraysToCombine[i].length;
        for (var i = 0; i < numPerms; i++) combinations.push(getPermutation(i, arraysToCombine));
        return combinations;
    }

    this.buildTree = function(br, tr, node, full) {
        var br_l = br.length,
            i = 0,
            j = 0,
            l = !p.base ? tr : tr - 1;
        if (p.multi_process) {
            var simple = l == p.grp_split.length ? true : false;
            var h = -1,
                multi = [],
                multi_cond = [],
                multi_obj = [],
                multi_rem = [],
                n = "",
                n_o = "#condense#",
                nm_arr = [],
                nU = "";
            if (!simple) {
                for (i = 0; i < br_l; i++) {
                    if (br[i].name.indexOf("|") != -1) {
                        multi = getAllCombinations(br[i].name);
                        multi_rem.push(i);
                        for (var m = 0; m < multi.length; m++) multi_obj.push({
                            name: multi[m].join(""),
                            item: br[i].item.slice()
                        });
                    }
                }
                i = multi_rem.length;
                while (i--) br.splice(multi_rem[i], 1);
                br_l = br.length;
                multi_obj.sort(sort);
                i = 0;
                while (i < multi_obj.length) {
                    n = multi_obj[i].name;
                    nU = n.toUpperCase();
                    if (n_o != nU) {
                        n_o = nU;
                        multi_cond[j] = {
                            name: n,
                            item: multi_obj[i].item.slice()
                        };
                        j++
                    } else multi_cond[j - 1].item.push.apply(multi_cond[j - 1].item, multi_obj[i].item.slice());
                    i++
                }
                for (i = 0; i < br_l; i++) {
                    br[i].name = br[i].name.replace(/#!#/g, "");
                    nm_arr.push(br[i].name);
                }
                for (i = 0; i < multi_cond.length; i++) {
                    h = arr_index(nm_arr, multi_cond[i].name);
                    if (h != -1) {
                        br[h].item.push.apply(br[h].item, multi_cond[i].item.slice());
                        multi_cond.splice(i, 1);
                    }
                }
                for (i = 0; i < multi_cond.length; i++) br.splice(i + 1, 0, {
                    name: multi_cond[i].name,
                    sel: false,
                    track: false,
                    child: [],
                    item: multi_cond[i].item.slice()
                });
            }
            if (!node || node && !full)
				br.sort(sort);

            i = br.length;
            while (i--) {
                if (i != 0 && br[i].name.toUpperCase() == br[i - 1].name.toUpperCase()) {
                    br[i - 1].item.push.apply(br[i - 1].item, br[i].item.slice());
                    br.splice(i, 1);
                }
            }
        }
        var par = this.tree.length - 1;
        if (tr == 0) {
			this.tree = [];
			ui.show_collapse_rclick = false;
		}
        br_l = br.length;
        for (i = 0; i < br_l; i++) {
			if(tr==0 && br[i].child && br[i].child.length>0){
				ui.show_collapse_rclick = true;
			}
            j = this.tree.length;
            this.tree[j] = br[i];
            this.tree[j].top = !i ? true : false;
            this.tree[j].bot = i == br_l - 1 ? true : false;
            if (tr == (p.base ? 1 : 0) && i == br_l - 1) this.line_l = j;
            this.tree[j].tr = tr;
            this.tree[j].par = par;
            this.tree[j].ix = j;
            if (p.single_br) this.tree[j].track = true;
            if (!p.base && p.view_by == p.folder_view) {
                var n_id = this.tree[j].item[0];
                if (lib.node[n_id].length == 1 || lib.node[n_id].length == 2 && !p.show_tracks) this.tree[j].track = true;
            }
            if (br[i].child.length > 0) this.buildTree(br[i].child, tr + 1, node, p.base && tr == 0 ? true : false);
        }

        if (p.base && this.tree.length == 1) this.line_l = 0;

        sbar.set_rows(this.tree.length);
        p.tree_paint();
		this.populated = true;
    }
	this.clearSelectedItem = function(){
		for (var k = 0; k < this.tree.length; k++) this.tree[k].sel = false;
	}
	this.showNowPlaying = function(load){
		var now_playing = fb.GetNowPlaying();
		var np_item = np_node = -1;
		var dont_scroll = false;
		var first_node_loaded = false
        if (fb.IsPlaying && now_playing){
			var items = p.items();
			for (var i = 0; i < lib.list.Count; i++) items.Add(lib.list[i]);
            for (i = 0; i < items.Count; i++) {
                if (now_playing.Compare(items[i])) {
                    np_item = i;
                    break;
                }
			}
			if(np_item>=0){
				var start = (this.show_aggregate_item)?1:0;
				for (var i = start; i < this.tree.length; i++){
					var v = this.tree[i];
					if (v.item.includes(np_item)) {
						np_node = i;
						if(!this.show_aggregate_item || np_node>0) {
							if(!first_node_loaded && properties.showInLibrary) {
								pop.load(v.item, true, false, false, pop.gen_pl, false);first_node_loaded=true;
								//window.NotifyOthers("seek_nowplaying_in_current",now_playing);
							}
							//if(this.tree[np_node].child.length < 1) {
								//this.branch(pop.tree[np_node]);
							//}
							if(this.tree[np_node].child.length==0) break;
						}

					}
				};
				if(np_node>=0) {
					this.clearSelectedItem();
					this.tree[np_node].sel = true;
					ui.force_SelectedDraw = true;
					sbar.middle_scroll(np_node * ui.row_h);
				}
			}
		}
		p.tree_paint();
	}
    this.load = function(list, type, add, send, def_pl, insert) {
		/*if(fb.IsPlaying) {
			var playing_item = plman.GetPlayingItemLocation();
			if(playing_item.IsValid){
				window.NotifyOthers("trigger_on_focus_change",Array(playing_item.PlaylistIndex,playing_item.PlaylistItemIndex));
			}
		} */
        var i = 0,
            np_item = -1,
            pid = -1;
        this.pln = plID(lib_playlist);
        if (!def_pl) this.pln = plman.ActivePlaylist;
        else plman.ActivePlaylist = this.pln;
        if (type) {
            var items = p.items();
            for (var i = 0; i < list.length; i++) items.Add(p.list[list[i]]);
        } else var items = list.Clone();
        if (custom_sort.length) items.OrderByFormat(fb.TitleFormat(custom_sort), 1);

        /*if (fb.IsPlaying && !add && fb.GetNowPlaying()) {
            for (i = 0; i < items.Count; i++)
                if (fb.GetNowPlaying().Compare(items[i])) {
                    np_item = i;
                    break;
                }
            if (np_item != -1) {
                var np = plman.GetPlayingItemLocation();
                if (np.IsValid && np.PlaylistIndex == this.pln) pid = np.PlaylistItemIndex;
            }
            if (np_item != -1 && pid == -1 && items.Count < 5000) {
                if (ui.dui) plman.SetActivePlaylistContext();
                for (i = 0; i < 20; i++) {
                    fb.RunMainMenuCommand("Edit/Undo");
                    var np = plman.GetPlayingItemLocation();
                    if (np.IsValid && lib_playlist == plman.GetPlaylistName(np.PlaylistIndex)) {
                        pid = np.PlaylistItemIndex;
                        if (pid != -1) break;
                    }
                }
            }
            if (np_item != -1 && pid != -1) {
                plman.ClearPlaylistSelection(this.pln);
                plman.SetPlaylistSelectionSingle(this.pln, pid, true);
                plman.RemovePlaylistSelection(this.pln, true);
                var it = items.Clone();
                items.RemoveRange(np_item, items.Count);
                it.RemoveRange(0, np_item + 1);
                plman.UndoBackup(this.pln);
                plman.InsertPlaylistItems(this.pln, 0, items);
                plman.InsertPlaylistItems(this.pln, plman.PlaylistItemCount(this.pln), it);
            } else {
                plman.UndoBackup(this.pln);
                plman.ClearPlaylist(this.pln);
                plman.InsertPlaylistItems(this.pln, 0, items);
            }
        } else */
		if(plman.PlayingPlaylist == this.pln) { // playing playlist is this.name_to_send
			var new_playlist = renamePlaybackPlaylist();
			if(new_playlist!==false) {
				this.pln = new_playlist;
				plman.ActivePlaylist = this.pln;
			}
		}		
		if (!add) {
            plman.UndoBackup(this.pln);
            plman.ClearPlaylist(this.pln);
            plman.InsertPlaylistItems(this.pln, 0, items);
			//if(!fb.IsPlaying){
			//	window.NotifyOthers("trigger_on_focus_change",Array(this.pln,0));
			//}
        } else {
            plman.UndoBackup(this.pln);
            plman.InsertPlaylistItems(this.pln, !insert ? plman.PlaylistItemCount(this.pln) : plman.GetPlaylistFocusItemIndex(this.pln)+1, items, true);
            plman.EnsurePlaylistItemVisible(this.pln, !insert ? plman.PlaylistItemCount(this.pln) - items.Count : plman.GetPlaylistFocusItemIndex(this.pln) - items.Count);
        }
        if (autoplay && send) {
            var c = (plman.PlaybackOrder == 3 || plman.PlaybackOrder == 4) ? Math.ceil(plman.PlaylistItemCount(this.pln) * Math.random() - 1) : 0;
            plman.ExecutePlaylistDefaultAction(this.pln, c);
        }
    }

    this.draw = function(gr) {

        if (!pop.tree.length) { // no track, tree is empty
			if(p.s_txt.length>0){
				var px = 0;
				var line_width = Math.min(130,Math.round(ui.w-40));
				var py = p.s_h + Math.round((ui.h-p.s_h)  / 2)-1;
				var text1 = "No items";
				var text2 = "matching";
				gr.GdiDrawText(text1, g_font.plus5, colors.normal_txt, px, py - 40, ui.w, 36, DT_CENTER | DT_BOTTOM | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
				gr.FillSolidRect(px+Math.round(ui.w/2-line_width/2),py, line_width, 1, colors.border);
				gr.GdiDrawText(text2, g_font.italicplus1, colors.faded_txt, px, py + 6, ui.w, 20, DT_CENTER | DT_TOP | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
				return;
				//return gr.GdiDrawText(lib.none, ui.font, ui.textcol, ui.margin, p.s_h, ui.w - p.r_mg, ui.row_h * (lib.none.length > 14 ? 5 : 1), 0x00000004 | 0x00000400);
			} else {
				var px = 0;
				var line_width = Math.min(130,Math.round(ui.w-40));
				var py = p.s_h + Math.round((ui.h-p.s_h)  / 2)-1;
				gr.GdiDrawText("Loading...", g_font.plus3, colors.normal_txt, px, py - 40, ui.w, 36, DT_CENTER | DT_BOTTOM | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
				gr.FillSolidRect(px+Math.round(ui.w/2-line_width/2),py, line_width, 1, colors.border);
				gr.GdiDrawText("library tree", g_font.italicplus1, colors.faded_txt, px, py + 6, ui.w, 20, DT_CENTER | DT_TOP | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
				return;
				//return gr.GdiDrawText(lib.none, ui.font, ui.textcol, ui.margin, p.s_h, ui.w - p.r_mg, ui.row_h * (lib.none.length > 14 ? 5 : 1), 0x00000004 | 0x00000400);
			}
		}
        var item_x = 0,
            item_y = 0,
            item_w = 0,
            ln_x = ui.margin + Math.floor(ui.node_sz / 2) + (p.base ? ui.pad : 0),
            nm = "",
            s = Math.round(sbar.delta / ui.row_h + 0.4)-1,
            e = s + p.rows + 2;
        e = this.tree.length < e ? this.tree.length : e, sel_x = 0, sel_w = 0, y1 = p.s_h - sbar.delta + p.node_y;
		if(s<0) s = 0;
        check_node(gr);
        for (var i = s; i < e; i++) {
            item_y = ui.row_h * i + p.s_h - sbar.delta;
            if (ui.alternate) {
                if (i % 2 == 0) gr.FillSolidRect(0, item_y + 1, ui.w, ui.row_h - 2, colors.alternate_row);
                //else gr.FillSolidRect(0, item_y, ui.w, ui.row_h, ui.b2);
            }
            if (ui.node_style>=0) {
                var end_br = [],
                    j = this.tree[i].tr,
                    l_x = 0,
                    l_y = item_y + ui.row_h / 2;
                if (p.base) j -= 1;
                var h1 = this.tree[i].top ? ui.row_h / 4 : ui.row_h;
                if (this.tree[i].tr != 0) {
                    var par = this.tree[i].par,
                        pr_pr = [];
                    for (var m = 1; m < j + 1; m++) {
                        if (m == 1) pr_pr[m] = par;
                        else pr_pr[m] = this.tree[pr_pr[m - 1]].par
                        if (this.tree[pr_pr[m]].bot) end_br[m] = true;
                        else end_br[m] = false;
                    }
                }
                for (var k = 0; k < j + 1; k++) {
                    if (this.tree[i].top && !k && !this.tree[i].track) h1 = ui.row_h / 2;
                    else h1 = ui.row_h;
                    if (!k && !j && this.tree[i].top && !this.tree[i].track) h1 = -ui.row_h / 4;
                    if (this.tree[i].track && !k && this.tree[i].top) h1 = ui.row_h / 2
                    if (!end_br[k] && k == 1) h1 = ui.row_h;
                    if (end_br[k]) h1 = 0;
                    var h3 = l_y - h1;
                    if (h3 < p.s_h) h1 = p.s_h - h3;
                    l_x = (Math.round(ui.pad * this.tree[i].tr + ui.margin) + Math.floor(ui.node_sz / 2)) - ui.pad * k;
                    var h2 = ((!this.tree[i].bot && !k && this.tree[i].track && i == Math.ceil(e - 1)) ||
                        (!this.tree[i].bot && !end_br[k] && !this.tree[i].track && i == Math.ceil(e - 1)) ||
                        (k && !end_br[k] && i == e - 1)) ? ui.row_h : 0;
                    if (k != j && ((this.tree[i].track && !k) || ui.linestyle<2)) gr.FillSolidRect(l_x, l_y - h1, 1, h1 + h2, ui.linecol);
					else if(k==j && this.tree[i].track && this.tree[i].tr==0 && (ui.linestyle==2 || ui.linestyle==0)) gr.FillSolidRect(Math.round(ui.pad * this.tree[i].tr + ui.margin)+1, l_y, 5, 1, colors.first_level_track);
                }
            }
        }
        if (ui.node_style>=0 && ui.linecol) {
            var top = p.base ? p.s_h + ui.row_h * 3 / 4 : p.s_h;
            var ln_y = sbar.scroll == 0 ? top + p.node_y : p.s_h;
            var ln_h = Math.min(this.line_l * ui.row_h - sbar.delta + (sbar.scroll == 0 ? (p.base ? -ui.row_h * 3 / 4 : 0) : p.node_y), ui.row_h * Math.ceil(p.rows) - (sbar.scroll == 0 ? (p.node_y + (p.base ? ui.row_h * 3 / 4 : 0)) : 0)+ui.row_h);
            if (e == this.tree.length) ln_h += ui.row_h / 4;
            if (this.line_l && ui.linestyle<2) gr.FillSolidRect(ln_x, ln_y, 1, ln_h, ui.linecol);
        }
        for (i = s; i < e; i++) {
            if ((this.tree[i].sel && ui.backcolsel != 0) || g_rightClickedIndex == i) {
                item_y = ui.row_h * i + p.s_h - sbar.delta;
                item_x = Math.round(ui.pad * this.tree[i].tr + ui.margin);
                if (ui.node_style>=0 || !this.tree[i].track) item_x = item_x + ui.symbol_w;
                sel_x = item_x - ui.sel;
				gr.FillSolidRect(0, item_y, ui.w, ui.row_h, colors.selected_item_bg);
				gr.FillSolidRect(0, item_y, ui.w-colors.track_gradient_size-colors.padding_gradient, 1, colors.selected_item_line);
				gr.FillSolidRect(0, item_y+ui.row_h-1, ui.w-colors.track_gradient_size-colors.padding_gradient, 1, colors.selected_item_line);
				if(colors.track_gradient_size){
					gr.FillGradRect(ui.w-colors.track_gradient_size-colors.padding_gradient, item_y, colors.track_gradient_size, 1, 0, colors.selected_item_line, colors.selected_item_line_off, 1.0);
					gr.FillGradRect(ui.w-colors.track_gradient_size-colors.padding_gradient, item_y+ui.row_h-1, colors.track_gradient_size, 1, 0, colors.selected_item_line, colors.selected_item_line_off, 1.0);
				}
            }
        }
		this.cursor = IDC_ARROW;
        for (i = s; i < e; i++) {
            item_y = ui.row_h * i + p.s_h - sbar.delta;
            nm = this.tree[i].name;
			count_text = (this.show_counts && (!this.tree[i].track || !p.show_tracks) ? " " + this.tree[i].item.length + "" : "");
			text_w = gr.CalcTextWidth(nm, ui.font);
			count_w = gr.CalcTextWidth(count_text, ui.font);
            item_w = text_w + count_w + ui.row_h * 0.2;
            this.tree[i].w = item_w;
            item_x = Math.round(ui.pad * this.tree[i].tr + ui.margin);
            if (m_i == i && !(sbar.hover || sbar.b_is_dragging)) {
                sel_x = item_x - ui.sel;
                sel_w = Math.min(item_w, ui.w - sel_x - 1 - p.r_mg);
                gr.FillSolidRect(0, item_y, colors.width_marker_hover_item, ui.row_h, colors.marker_hover_item);
            }
            //if (ui.node_style>0) {
                var y2 = ui.row_h * i + y1 + 5;
                var y2 = ui.row_h * i + y1 + Math.floor(ui.node_sz / 2);
                if (!this.tree[i].track) {
                    if (ui.linecol && ui.linestyle<2) gr.FillSolidRect(item_x + ui.node_sz, y2, 4 * ui.node_sz / 11, 1, ui.linecol);
                    draw_node(gr, this.tree[i].child.length < 1, item_x, item_y + p.node_y, m_i == i && hover_node, i);
                } else if (ui.linecol && (this.tree[i].tr>0 || ui.linestyle<2)) gr.FillSolidRect(item_x + Math.ceil(ui.node_sz / 2), y2, 7 * ui.node_sz / 11, 1, ui.linecol);
            //} else if (!this.tree[i].track) gr.GdiDrawText(this.tree[i].child.length < 1 ? ui.expand : ui.collapse, ui.font, ui.textsymbcol, item_x, item_y, ui.w - item_x - p.r_mg, ui.row_h, p.lc);
            if (ui.node_style>=0 || !this.tree[i].track) item_x = item_x + ui.symbol_w;
            var txt_c = this.tree[i].sel ? ui.textselcol : m_i == i ? ui.textcol_h : ui.textcol;
            gr.GdiDrawText(nm, ui.font, txt_c, item_x, item_y, ui.w - item_x - p.r_mg-count_w-5, ui.row_h, p.lc);
			gr.GdiDrawText(count_text, ui.font_small, colors.faded_txt, item_x, item_y, ui.w-item_x-ui.margin-5, ui.row_h, p.rc);
        }
		gr.FillGradRect(0, ui.h-colors.fading_bottom_height, ui.w, colors.fading_bottom_height, 90, colors.grad_bottom_2,  colors.grad_bottom_1,1);
    }
	this.lclick_action = function(x, y) {
        if (y < p.s_h) return;
        var ix = this.get_ix(x, y, true, false);
        p.pos = ix;
		//if (ix == send_x) return;
		if(sbar.hover) return;
		if (p.tooltip) this.deactivate_tooltip();
        if (ix < this.tree.length && ix >= 0 && !ui.drag_moving && !sbar.b_is_dragging) {
            var item = this.tree[ix],
                mode = x < Math.round(ui.pad * item.tr) + ui.symbol_w + ui.margin ? 0 : this.check_ix(item, x, y, false) ? 1 : 2,
                xp = item.child.length > 0 ? 0 : 1;
            switch (mode) {
                case 0:
                    switch (xp) {
                        case 0:
                            this.clear_child(item);
                            break;
                        case 1:
                            if (this.auto) this.branch_chg(item, false, true);
                            var row = Math.round((y - p.s_h - ui.row_h * 0.5) / ui.row_h);
                            this.branch(item, !p.base || ix ? false : true, true);
                            if (this.auto) ix = item.ix
                            if (row + 1 + item.child.length > sbar.rows_drawn) {
                                if (item.child.length > (sbar.rows_drawn - 2)) sbar.check_scroll(ix * ui.row_h);
                                else sbar.check_scroll(Math.min(ix * ui.row_h, (ix + 1 - sbar.rows_drawn + item.child.length) * ui.row_h));
                            }
                            break;
                    }
                    if (sbar.scroll > ix * ui.row_h) sbar.check_scroll(ix * ui.row_h);
                    break;
                case 1:
                    if (v.k(2)) return this.add(x, y, alt_lbtn_pl);
                    if (!v.k(1)) this.clear();
                    if (!item.sel) this.get_selection(ix, item.sel);
                    else if (v.k(1)) this.get_selection(ix, item.sel);
                    p.tree_paint();
                    break;
            }
            if (this.check_ix(item, x, y, false)) {
                if (v.k(1)) this.load(this.sel_items, true, false, false, this.gen_pl, false);
                else if (v.k(0)) this.load(this.sel_items, true, false, false, this.gen_pl, false);
                else this.load(item.item, true, false, false, this.gen_pl, false);
				send_x = ix;
            }
        } else if(!ui.drag_moving) this.get_selection(-1);
	}
    this.lbtn_up = function(x, y) {
		ui.drag_clicked = false;
		if(!this.lclick_action_done){
			this.lclick_action(x, y);
			this.lclick_action_done = true;
		}
	}
    this.lbtn_dn = function(x, y) {
		this.lclick_action_done = false;
		ui.drag_clicked = true;
		ui.drag_clicked_x = x;
		ui.drag_clicked_y = y;

		var ix = this.get_ix(x, y, true, false);
		if (ix < this.tree.length && ix >= 0){
			if (!this.tree[ix].sel){
				this.lclick_action(x, y);
				this.lclick_action_done = true;
			}
		} else {
			this.clear();
			this.sel_items = [];
			p.tree_paint();
		}
		g_tooltip.Deactivate();
    }

    this.lbtn_dblclk = function(x, y) {
        if (y < p.s_h) return;
        var ix = this.get_ix(x, y, true, false);
        if (ix >= this.tree.length || ix < 0) return;
        var item = this.tree[ix];
        if (!this.check_ix(item, x, y, false)) return;
        var mp = 1;
        if (!dbl_action) {
            if (item.child.length) mp = 0;
            switch (mp) {
                case 0:
                    this.clear_child(item);
                    break;
                case 1:
                    if (this.auto) this.branch_chg(item, false, true);
                    var row = Math.round((y - p.s_h - ui.row_h * 0.5) / ui.row_h);
                    this.branch(item, !p.base || ix ? false : true, true);
                    if (this.auto) ix = item.ix
                    if (row + 1 + item.child.length > sbar.rows_drawn) {
                        if (item.child.length > (sbar.rows_drawn - 2)) sbar.check_scroll(ix * ui.row_h);
                        else sbar.check_scroll(Math.min(ix * ui.row_h, (ix + 1 - sbar.rows_drawn + item.child.length) * ui.row_h));
                    }
                    break;
            }
            if (sbar.scroll > ix * ui.row_h) sbar.check_scroll(ix * ui.row_h);
        }
        if (dbl_action || !dbl_action && mp == 1 && !item.child.length) {
            this.pln = plID(lib_playlist);
            plman.ActivePlaylist = this.pln;
            var c = (plman.PlaybackOrder == 3 || plman.PlaybackOrder == 4) ? Math.ceil(plman.PlaylistItemCount(this.pln) * Math.random() - 1) : 0;
            plman.ExecutePlaylistDefaultAction(this.pln, c);
        }
    }

    this.get_selection = function(idx, state, add, bypass) {
		this.sel_group_count = 0;
        var sel_type = idx == -1 && !add ? 0 : v.k(0) && last_sel > -1 && !bypass ? 1 : v.k(1) && !bypass ? 2 : !state ? 3 : 0;
        switch (sel_type) {
            case 0:
                this.clear();
                this.sel_items = [];
                break;
            case 1:
                this.sel_items = [];
                var direction = (idx > last_sel) ? 1 : -1;
                if (!v.k(1)) this.clear();
                for (var i = last_sel;; i += direction) {
                    this.tree[i].sel = true;
                    this.sel_items.push.apply(this.sel_items, this.tree[i].item);
					this.sel_group_count++;
                    if (i == idx) break;
                }
                this.sel_items = uniq(this.sel_items);
                p.tree_paint();
                break;
            case 2:
                this.tree[idx].sel = !this.tree[idx].sel;
                this.get_sel_items();
                last_sel = idx;
                break;
            case 3:
                this.sel_items = [];
                if (!add) this.clear();
                if (!add) this.tree[idx].sel = true;
                this.sel_items.push.apply(this.sel_items, this.tree[idx].item);
                this.sel_items = uniq(this.sel_items);
                last_sel = idx;
				this.sel_group_count = 1;
                break;
        }
    }

    this.move = function(x, y) {

		if(ui.drag_clicked && !ui.drag_moving && properties.DropInplaylist && !(sbar.hover || sbar.b_is_dragging) && !p.s_search && m_i>=0) {
			if((Math.abs(x - ui.drag_clicked_x) > 10 || Math.abs(y - ui.drag_clicked_y) > 10) && ui.h > cPlaylistManager.rowHeight * 6 && pop.sel_items.length>0) {
				ui.drag_moving = true;
				g_cursor.setCursor(IDC_HELP,"pman");
				pop.deactivate_tooltip();
				pman.state = 1;
				if(timers.hidePlaylistManager) {
					window.ClearInterval(timers.hidePlaylistManager);
					timers.hidePlaylistManager = false;
				};
				if(!timers.showPlaylistManager) {
					timers.showPlaylistManager = setInterval(pman.showPanel, 30);
				};
				var list = pop.sel_items;
				var items = p.items();
				for (var i = 0; i < list.length; i++) items.Add(p.list[list[i]]);

				if(pop.sel_group_count>1) var drag_text = pop.sel_group_count+" selected nodes";
				else {
					var drag_text = pop.tree[last_sel].name;
				}

				var options = {
					show_text : false,
					use_album_art : false,
					use_theming : false,
					custom_image : createDragText(drag_text, items.Count+" tracks", 220),
				}
				var effect = fb.DoDragDrop(window.ID, items, g_drop_effect.copy | g_drop_effect.move | g_drop_effect.link, options); // effects can be combined
				// nothing happens here until the mouse button is released
				pman.on_mouse("leave", 0, 0);
				items = undefined;
				list = undefined;
			};
		} else if(timers.showPlaylistManager && !ui.drag_clicked) window.ClearInterval(timers.showPlaylistManager);

        var ix = -1;
        m_i = -1;
		hover_node = false;
        get_pos = -1;
        ix = this.get_ix(x, y, true, false);
        if (ix != -1) {
            m_i = ix;
			try{
				hover_node = x < Math.round(ui.pad * this.tree[ix].tr) + ui.symbol_w + ui.margin;
			} catch(e){hover_node = false;}
            get_pos = ix;
            if (p.tooltip && typeof this.tree[ix] !== "undefined"  && tt_id != ix && Math.round(ui.pad * this.tree[ix].tr + ui.margin) + (ui.node_style==0 && this.tree[ix].track ? 0 : ui.symbol_w) + this.tree[ix].w > ui.w - p.r_mg && !(sbar.hover || sbar.b_is_dragging) && !hover_node) {
                var row = Math.round((y - p.s_h - ui.row_h * 0.5) / ui.row_h);
                this.activate_tooltip(ix, row, x, y);
            } else if(hover_node){
				if(g_tooltip.getActiveZone()!='Toggle node'+ix){
					g_tooltip.Deactivate();
					g_tooltip.ActivateDelay((this.tree[ix].child.length < 1?"Open node":"Close node"), x+10, y+20, globalProperties.tooltip_button_delay, 1200, false, "Toggle node"+ix);
				}
			}
        } else get_pos = this.get_ix(x, y, true, false);
        if (ix == ix_o && old_hover_node==hover_node) return;
        tt_id = -1;
        if (p.tooltip) this.deactivate_tooltip();
        if (!sbar.draw_timer) p.tree_paint();
        ix_o = ix;
		old_hover_node = hover_node;
    }
	this.leave = function() {
        m_i = -1;
		ix_o = -1;
		this.deactivate_tooltip();
		window.Repaint();
	}
    this.get_ix = function(x, y, simple, type) {
        var ix;
        if (y > p.s_h) ix = Math.round((y + (simple ? sbar.scroll : sbar.delta) - p.s_h - ui.row_h * 0.5) / ui.row_h);
        else ix = -1;
        if (simple) return ix;
        if (this.tree.length > ix && ix >= 0 && x < ui.w - 10 && y > p.s_h && this.check_ix(this.tree[ix], x, y, type)) return ix;
        else return -1;
    }

    this.check_ix = function(br, x, y, type) {
        if (!br) return false;
        return type ? (x > Math.round(ui.pad * br.tr + ui.margin) && x < Math.round(ui.pad * br.tr + ui.margin) + br.w + ui.symbol_w) :
            (x > Math.round(ui.pad * br.tr + ui.margin) + (ui.node_style==0 && br.track ? 0 : ui.symbol_w));// && x < Math.min(Math.round(ui.pad * br.tr + ui.margin) + (ui.node_style==0 && br.track ? 0 : ui.symbol_w) + br.w, ui.w - Math.max(ui.scr_w, ui.margin));
    }

    this.on_key_down = function(vkey) {
        if (p.s_search) return;
        switch (vkey) {
			case VK_ESCAPE:
				if(g_uihacks.getFullscreenState()) g_uihacks.toggleFullscreen();
				break;
            case v.left:
                if (!(p.pos >= 0) && get_pos != -1) p.pos = get_pos
                else p.pos = p.pos + this.tree.length % this.tree.length;
                p.pos = Math.max(Math.min(p.pos, this.tree.length - 1), 0);
                get_pos = -1;
                m_i = -1;
                if (this.tree[p.pos].child.length > 0) {
                    var item = this.tree[p.pos];
                    this.clear_child(item);
                    this.get_selection(item.ix);
                    m_i = p.pos = item.ix;
                } else {
                    try {
                        var item = this.tree[this.tree[p.pos].par];
                        this.clear_child(item);
                        this.get_selection(item.ix);
                        m_i = p.pos = item.ix;
                    } catch (e) {
                        return;
                    };
                }
                p.tree_paint();
                this.load(this.sel_items, true, false, false, this.gen_pl, false);
                sbar.set_rows(this.tree.length);
                if (sbar.scroll > p.pos * ui.row_h) sbar.check_scroll(p.pos * ui.row_h);
                break;
            case v.right:
                if (!(p.pos >= 0) && get_pos != -1) p.pos = get_pos
                else p.pos = p.pos + this.tree.length % this.tree.length;
                p.pos = Math.max(Math.min(p.pos, this.tree.length - 1), 0);
                get_pos = -1;
                m_i = -1;
                var item = this.tree[p.pos];
                if (this.auto) this.branch_chg(item, false, true);
                this.branch(item, p.base && p.pos == 0 ? true : false, true);
                this.get_selection(item.ix);
                p.tree_paint();
                m_i = p.pos = item.ix;
                this.load(this.sel_items, true, false, false, this.gen_pl, false);
                sbar.set_rows(this.tree.length);
                var row = (p.pos * ui.row_h - sbar.scroll) / ui.row_h;
                if (row + item.child.length > sbar.rows_drawn) {
                    if (item.child.length > (sbar.rows_drawn - 2)) sbar.check_scroll(p.pos * ui.row_h);
                    else sbar.check_scroll(Math.min(p.pos * ui.row_h, (p.pos + 1 - sbar.rows_drawn + item.child.length) * ui.row_h));
                }
                break;
            case v.pgUp:
                if (this.tree.length == 0) break;
                p.pos = Math.round(sbar.scroll / ui.row_h + 0.4) - Math.floor(p.rows);
                p.pos = Math.max(!p.base ? 0 : 1, p.pos);
                sbar.wheel(1);
                this.get_selection(this.tree[p.pos].ix);
                p.tree_paint();
                this.load(this.sel_items, true, false, false, this.gen_pl, false);
                break;
            case v.pgDn:
                if (this.tree.length == 0) break;
                p.pos = Math.round(sbar.scroll / ui.row_h + 0.4);
                p.pos = p.pos + Math.floor(p.rows) * 2 - 1;
                p.pos = this.tree.length < p.pos ? this.tree.length - 1 : p.pos;
                sbar.wheel(-1);
                this.get_selection(this.tree[p.pos].ix);
                p.tree_paint();
                this.load(this.sel_items, true, false, false, this.gen_pl, false);
                break;
            case v.home:
                if (this.tree.length == 0) break;
                p.pos = !p.base ? 0 : 1;
                sbar.check_scroll(0);
                this.get_selection(this.tree[p.pos].ix);
                p.tree_paint();
                this.load(this.sel_items, true, false, false, this.gen_pl, false);
                break;
            case v.end:
                if (this.tree.length == 0) break;
                p.pos = this.tree.length - 1;
                sbar.check_scroll((this.tree.length) * ui.row_h);
                this.get_selection(this.tree[p.pos].ix);
                p.tree_paint();
                this.load(this.sel_items, true, false, false, this.gen_pl, false);
                break;
            case v.enter:
                if (!this.sel_items.length) return;
                this.load(this.sel_items, true, false, false, this.gen_pl, false);
                break;
            case v.dn:
            case v.up:
                if (this.tree.length == 0) break;
                if ((p.pos == 0 && get_pos == -1 && vkey == v.up) || (p.pos == this.tree.length - 1 && vkey == v.dn)) {
                    this.get_selection(-1);
                    break;
                }
                if (get_pos != -1) p.pos = get_pos;
                else p.pos = p.pos + this.tree.length % this.tree.length;
                get_pos = -1;
                m_i = -1;
                if (vkey == v.dn) p.pos++;
                if (vkey == v.up) p.pos--;
                p.pos = Math.max(Math.min(p.pos, this.tree.length - 1), 0);
                var row = (p.pos * ui.row_h - sbar.scroll) / ui.row_h;
                if (sbar.rows_drawn - row < 3) sbar.check_scroll((p.pos + 3) * ui.row_h - sbar.rows_drawn * ui.row_h);
                else if (row < 2 && vkey == v.up) sbar.check_scroll((p.pos - 1) * ui.row_h);
                m_i = p.pos;
                this.get_selection(p.pos);
                p.tree_paint();
                this.load(this.sel_items, true, false, false, this.gen_pl, false);
                break;
        }
    }
}


function on_size(w, h) {
	ui.w = w;
	ui.h = h;
	ww = ui.w;
	wh = ui.h;
	if (!ui.w || !ui.h) return;
	if(window.IsVisible || first_on_size){
		ui.get_font();
		p.on_size();
		if (p.s_show || ui.scrollbar_show) but.refresh(true);
		jS.on_size();
		if(properties.DropInplaylist) pman.setSize(ui.w, 0, ui.w, ui.h);

		g_tagswitcherbar.setSize(ui.w, g_tagswitcherbar.default_height, g_fsize-1);

		// set wallpaper
		if(properties.showwallpaper){
			g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
		} else update_wallpaper = true;
		update_size = false;
		first_on_size = false;
	} else update_size = true;
}

function searchLibrary() {
    var cx = 0,
        doc = new ActiveXObject('htmlfile'),
        e = 0,
        i = 0,
        lg = [],
        log = [],
        offset = 0,
        s = 0,
        shift = false,
        shift_x = 0,
        txt_w = 0;
	this.cursorSet = false;
	this.lbtn_down = false;
	this.y = 0;

    var calc_text = function() {
        var im = gdi.CreateImage(1, 1),
            g = im.GetGraphics();
        txt_w = g.CalcTextWidth(p.s_txt.substr(offset), ui.font);
        im.ReleaseGraphics(g);
        im = undefined;
    }
    this.drawcursor = function(gr) {
        if (p.s_search && p.s_cursor && s == e && cx >= offset) {
            var x1 = p.s_x + get_cursor_x(cx),
                x2 = x1;
            gr.DrawLine(x1, p.s_sp * 0.2+this.y, x2, p.s_sp * 0.75+this.y, 1, ui.textcol);
        }
    }
	this.drawsel = function(gr) {
        if (s == e) return;
        var clamp = p.s_x + p.s_w2;
		var selection_bg_x = Math.min(p.s_x + get_cursor_x(s), clamp);
		var selection_bg_y = p.s_sp * 0.5+this.y-1;
		var selection_bg_w = Math.min(p.s_x + get_cursor_x(e), clamp) - selection_bg_x;
		var selection_bg_h = p.s_sp +this.y - selection_bg_y;
		//gr.FillSolidRect(selection_bg_x, selection_bg_y, selection_bg_w, selection_bg_h, colors.selected_bg);
        gr.DrawLine(Math.min(p.s_x + get_cursor_x(s), clamp), selection_bg_y, Math.min(p.s_x + get_cursor_x(e), clamp), selection_bg_y, selection_bg_h, colors.selected_bg);
    }
    var get_cursor_pos = function(x) {
        var im = gdi.CreateImage(1, 1),
            g = im.GetGraphics(),
            nx = x - p.s_x,
            pos = 0;
        for (i = offset; i < p.s_txt.length; i++) {
            pos += g.CalcTextWidth(p.s_txt.substr(i, 1), ui.font);
            if (pos >= nx + 3) break;
        }
        im.ReleaseGraphics(g);
        im = undefined;
        return i;
    }
    var get_cursor_x = function(pos) {
        var im = gdi.CreateImage(1, 1),
            g = im.GetGraphics(),
            x = 0;
        if (pos >= offset) x = g.CalcTextWidth(p.s_txt.substr(offset, pos - offset), ui.font);
        im.ReleaseGraphics(g);
        im = undefined;
        return x;
    }
    var get_offset = function(gr) {
        var t = gr.CalcTextWidth(p.s_txt.substr(offset, cx - offset), ui.font);
        while (t >= p.s_w2) {
            offset++;
            t = gr.CalcTextWidth(p.s_txt.substr(offset, cx - offset), ui.font);
        }
    }
    var record = function() {
        lg.push(p.s_txt);
        log = [];
        if (lg.length > 30) lg.shift();
    }
    this.clear = function() {
        lib.time.Reset();
        offset = s = e = cx = 0;
        p.s_cursor = false;
        p.s_search = false;
        p.s_txt = "";
        p.search_paint();
        timer.reset(timer.search_cursor, 4);
        lib.rootNodes();
    }
    this.on_key_up = function(vkey) {
        if (!p.s_search) return;
        if (vkey == v.shift) {
            shift = false;
            shift_x = cx;
        }
    }
    this.lbtn_up = function(x, y) {
        if (s != e) timer.reset(timer.search_cursor, 4);
        this.lbtn_down = false;
    }
	this.on_focus = function(focus_state){
		if(!focus_state) {
			p.s_cursor = false;
			p.s_search = false;
			window.Repaint();
		}
	}
    this.leave = function() {
		if(this.cursorSet) {
			if(g_cursor.getCursor()==IDC_IBEAM) g_cursor.setCursor(IDC_ARROW,36);
			this.cursorSet = false;
		}
    }
    this.move = function(x, y) {
		this.hover = (y < p.s_h && y > this.y && x > ui.margin + ui.row_h * 0.6 && x < p.s_x + p.s_w2);
		if(this.hover && !ui.drag_moving) {
			g_cursor.setCursor(IDC_IBEAM, "searchbox");
			this.cursorSet = true;
		}
        if (!this.hover || !this.lbtn_down) {
			if(!this.hover && this.cursorSet) {
				if(g_cursor.getCursor()==IDC_IBEAM) g_cursor.setCursor(IDC_ARROW,37);
				this.cursorSet = false;
			}
			return;
		}
        var t = get_cursor_pos(x),
            t_x = get_cursor_x(t);
        calc_text();
        if (t < s) {
            if (t < e) {
                if (t_x < p.s_x)
                    if (offset > 0) offset--;
            } else if (t > e) {
                if (t_x + p.s_x > p.s_x + p.s_w2) {
                    var l = (txt_w > p.s_w2) ? txt_w - p.s_w2 : 0;
                    if (l > 0) offset++;
                }
            }
            e = t;
        } else if (t > s) {
            if (t_x + p.s_x > p.s_x + p.s_w2) {
                var l = (txt_w > p.s_w2) ? txt_w - p.s_w2 : 0;
                if (l > 0) offset++;
            }
            e = t;
        }

        cx = t;
        p.search_paint();
    }
    this.rbtn_down = function(x, y) {
        men.search_menu(x, y, s, e, doc.parentWindow.clipboardData.getData('text') ? true : false)
    }
    this.rbtn_up = function(x, y) {
    }

    this.lbtn_dn = function(x, y) {
		
        p.search_paint();
        this.lbtn_down = (y < p.s_h && y > this.y && x > ui.margin + ui.row_h * 0.6 && x < p.s_x + p.s_w2);
        if (!this.lbtn_down) {
			p.s_search = false;
            offset = s = e = cx = 0;
            timer.reset(timer.search_cursor, 4);
			p.search_paint();
            return;
        } else {
            this.activate(x,y);
        }
    }
	this.activate = function(x, y) {
		if (shift) {
			s = cx;
			e = cx = get_cursor_pos(x);
		} else {
			cx = get_cursor_pos(x);
			s = e = cx;
		}
		timer.reset(timer.search_cursor, 4);
		p.s_cursor = true;
		p.s_search =  true;
		timer.search_cursor = setInterval(function() {
			p.s_cursor = !p.s_cursor;
			p.search_paint();
		}, 530);
        p.search_paint();
	}
    this.on_char = function(code, force) {
        var text = String.fromCharCode(code);
        if (force) p.s_search = true;
        if (!p.s_search) return;
        p.s_cursor = false;
        p.pos = -1;
        switch (code) {
            case v.enter:
                if (p.s_txt.length < 3) break;
                var items = fb.GetQueryItems(lib.list, p.s_txt.toLowerCase());
                pop.load(items, false, false, false, pop.gen_pl, false);
                items = undefined;
                break;
            case v.redo:
                lg.push(p.s_txt);
                if (lg.length > 30) lg.shift();
                if (log.length > 0) {
                    p.s_txt = log.pop() + "";
                    cx++
                }
                break;
            case v.undo:
                log.push(p.s_txt);
                if (log.length > 30) lg.shift();
                if (lg.length > 0) p.s_txt = lg.pop() + "";
                break;
            case v.selAll:
                s = 0;
                e = p.s_txt.length;
                break;
            case v.copy:
                if (s != e) doc.parentWindow.clipboardData.setData('text', p.s_txt.substring(s, e));
                break;
            case v.cut:
                if (s != e) doc.parentWindow.clipboardData.setData('text', p.s_txt.substring(s, e));
            case v.back:
                record();
                if (s == e) {
                    if (cx > 0) {
                        p.s_txt = p.s_txt.substr(0, cx - 1) + p.s_txt.substr(cx, p.s_txt.length - cx);
                        if (offset > 0) offset--;
                        cx--;
                    }
                } else {
                    if (e - s == p.s_txt.length) {
                        p.s_txt = "";
                        cx = 0;
                    } else {
                        if (s > 0) {
                            var st = s,
                                en = e;
                            s = Math.min(st, en);
                            e = Math.max(st, en);
                            p.s_txt = p.s_txt.substring(0, s) + p.s_txt.substring(e, p.s_txt.length);
                            cx = s;
                        } else {
                            p.s_txt = p.s_txt.substring(e, p.s_txt.length);
                            cx = s;
                        }
                    }
                }
                calc_text();
                offset = offset >= e - s ? offset - e + s : 0;
                s = cx;
                e = s;
                break;
            case "delete":
                record();
                if (s == e) {
                    if (cx < p.s_txt.length) {
                        p.s_txt = p.s_txt.substr(0, cx) + p.s_txt.substr(cx + 1, p.s_txt.length - cx - 1);
                    }
                } else {
                    if (e - s == p.s_txt.length) {
                        p.s_txt = "";
                        cx = 0;
                    } else {
                        if (s > 0) {
                            var st = s,
                                en = e;
                            s = Math.min(st, en);
                            e = Math.max(st, en);
                            p.s_txt = p.s_txt.substring(0, s) + p.s_txt.substring(e, p.s_txt.length);
                            cx = s;
                        } else {
                            p.s_txt = p.s_txt.substring(e, p.s_txt.length);
                            cx = s;
                        }
                    }
                }
                calc_text();
                offset = offset >= e - s ? offset - e + s : 0;
                s = cx;
                e = s;
                break;
            case v.paste:
                text = doc.parentWindow.clipboardData.getData('text');
            default:
                record();
                if (s == e) {
                    p.s_txt = p.s_txt.substring(0, cx) + text + p.s_txt.substring(cx);
                    cx += text.length;
                    e = s = cx;
                } else if (e > s) {
                    p.s_txt = p.s_txt.substring(0, s) + text + p.s_txt.substring(e);
                    calc_text();
                    offset = offset >= e - s ? offset - e + s : 0;
                    cx = s + text.length;
                    s = cx;
                    e = s;
                } else {
                    p.s_txt = p.s_txt.substring(s) + text + p.s_txt.substring(0, e);
                    calc_text();
                    offset = offset < e - s ? offset - e + s : 0;
                    cx = e + text.length;
                    s = cx;
                    e = s;
                }
                break;
        }
        if (!timer.search_cursor) timer.search_cursor = setInterval(function() {
            p.s_cursor = !p.s_cursor;
            p.search_paint();
        }, 530);
        p.search_paint();
        lib.upd_search = true;
        timer.reset(timer.search, 3);
        timer.search = setTimeout(function() {
            lib.time.Reset();
            lib.rootNodes();
            timer.reset(timer.search, 3);
        }, 160);
    }

    this.on_key_down = function(vkey) {
        if (!p.s_search) return;
        switch (vkey) {
			case VK_ESCAPE:
				this.clear();
			break;
            case v.left:
            case v.right:
                if (vkey == v.left) {
                    if (offset > 0) {
                        if (cx <= offset) {
                            offset--;
                            cx--;
                        } else cx--;
                    } else if (cx > 0) cx--;
                    s = e = cx
                }
                if (vkey == v.right && cx < p.s_txt.length) cx++;
                s = e = cx;
                if (shift) {
                    s = Math.min(cx, shift_x);
                    e = Math.max(cx, shift_x);
                }
                p.s_cursor = true;
                timer.reset(timer.search_cursor, 4);
                timer.search_cursor = setInterval(function() {
                    p.s_cursor = !p.s_cursor;
                    p.search_paint();
                }, 530);
                break;
            case v.home:
            case v.end:
                if (vkey == v.home) offset = s = e = cx = 0;
                else s = e = cx = p.s_txt.length;
                p.s_cursor = true;
                timer.reset(timer.search_cursor, 4);
                timer.search_cursor = setInterval(function() {
                    p.s_cursor = !p.s_cursor;
                    p.search_paint();
                }, 530);
                break;
            case v.shift:
                shift = true;
                shift_x = cx;
                break;
            case v.del:
                this.on_char("delete");
                break;
        }
        p.search_paint();
    }
	this.setSize = function(w,h,x,y){
		this.x = x;
		this.y = ((p.tag_switcherbar)?g_tagswitcherbar.default_height:0);
		this.w = w;
		this.h = h;
	}
    this.draw = function(gr) {
        s = Math.min(Math.max(s, 0), p.s_txt.length);
        e = Math.min(Math.max(e, 0), p.s_txt.length);
        cx = Math.min(Math.max(cx, 0), p.s_txt.length);
        gr.FillSolidRect(0, this.y-1, ui.w, p.s_sp+1, colors.headerbar_bg);
       // gr.DrawLine(0, this.y+p.s_sp, ww -((draw_right_line)?2:1), this.y+p.s_sp, 1,colors.headerbar_line);
		gr.FillSolidRect(0, this.y+p.s_sp, ww -((draw_right_line)?1:0), 1,colors.headerbar_line);

        if (p.s_txt) {
            e = (e < p.s_txt.length) ? e : p.s_txt.length;
            this.drawsel(gr);
            get_offset(gr);
            gr.GdiDrawText(p.s_txt.substr(offset), ui.font, colors.normal_txt, p.s_x, this.y, p.s_w2, p.s_sp, p.l);
        } else if(!(p.s_search)) gr.GdiDrawText("Filter...", g_font.plus1, colors.normal_txt, p.s_x, this.y, p.s_w2-5, p.s_sp-1, p.l | DT_END_ELLIPSIS);
        sL.drawcursor(gr);

        if (p.s_show > 1) {
			if(p.filter_by==0){
				var l_x = p.f_x1 - 9,
					l_h = Math.round(p.s_sp / 2);
				var grad_padding = 6
				gr.DrawImage(but.btns.filter.img, p.f_x1-4, but.btns.filter.y+Math.round((but.btns.filter.h-but.btns.filter.img.Height)/2), but.btns.filter.img.Width, but.btns.filter.img.Height, 0, 0, but.btns.filter.img.Width, but.btns.filter.img.Height);
				//gr.GdiDrawText(p.filt[p.filter_by].name, ui.font, ui.txt_box, p.f_x1+3, this.y, p.f_w[p.filter_by], p.s_sp, p.cc);
			} else {
				var l_x = p.f_x1 - 9,
					l_h = Math.round(p.s_sp / 2);
				var grad_padding = 6
				gr.GdiDrawText(p.filt[p.filter_by].name, ui.font, ui.txt_box, p.f_x1+3, this.y, p.f_w[p.filter_by], p.s_sp, p.cc);
				gr.FillGradRect(l_x, this.y+grad_padding, 1, l_h-grad_padding, 90, RGBA(0, 0, 0, 0), ui.s_linecol);
				gr.FillGradRect(l_x, this.y+l_h, 1, l_h-grad_padding, 90, ui.s_linecol, RGBA(0, 0, 0, 0));
			}
        }
    }
}


var j_Search = function() {
    var j_x = 5,
        j_h = 30,
        j_y = 5,
        jSearch = "",
        jump_search = true,
        rs1 = 5,
        rs2 = 4;
    this.on_size = function() {
        j_x = Math.round(ui.w / 2), j_h = Math.round(ui.row_h * 1.5), j_y = Math.round((ui.h - j_h) / 2);
        rs1 = Math.min(5, j_h / 2);
        rs2 = Math.min(4, (j_h - 2) / 2);
    }

    this.on_char = function(code) {
        var text = String.fromCharCode(code);
        if (!p.s_search) {
            var found = false,
                i = 0,
                pos = -1;
            switch (code) {
                case VK_ESCAPE:
					break;
                case v.back:
                    jSearch = jSearch.substr(0, jSearch.length - 1);
                    break;
                case v.enter:
                    jSearch = "";
                    return;
                default:
                    jSearch += text;
                    break;
            }
            var l = pop.tree.length;
            for (i = 0; i < l; i++) pop.tree[i].sel = false;
            if (!jSearch) return;
            pop.sel_items = [];
            jump_search = true;
            window.RepaintRect(0, j_y, ui.w, j_h + 1);
            timer.reset(timer.jsearch, 2);
            timer.jsearch = setTimeout(function() {
                for (i = 0; i < l; i++) {
                    if (pop.tree[i].name.substring(0, jSearch.length).toLowerCase() == jSearch.toLowerCase()) {
                        found = true;
                        pos = i;
                        pop.tree[i].sel = true;
                        pop.sel_items.push.apply(pop.sel_items, pop.tree[i].item);
                        break;
                    }
                }
                if (!found) jump_search = false;
                p.tree_paint();
                sbar.check_scroll((pos - 5) * ui.row_h);
                timer.reset(timer.jsearch, 2);
            }, 500);

            timer.reset(timer.clear_jsearch, 0);
            timer.clear_jsearch = setTimeout(function() {
                if (found) pop.load(pop.sel_items, true, false, false, pop.gen_pl, false);
                jSearch = "";
                window.RepaintRect(0, j_y, ui.w, j_h + 1);
                timer.reset(timer.clear_jsearch, 0);
            }, 1200);
        }
    }

    this.draw = function(gr) {
        if (jSearch) {
            var j_w = gr.CalcTextWidth(jSearch, g_font.plus7) + 25;
            gr.FillSolidRect(j_x - j_w / 2-5, j_y, j_w+10, j_h, colors.keyboard_search_bg);
            gr.GdiDrawText(jSearch.toUpperCase(), g_font.plus6, jump_search ? 0xfffafafa : 0xffff4646, j_x - j_w / 2, j_y, j_w, j_h, p.cc);
        }
    }
}

function set_update_function(string){
	if( Update_Required_function.indexOf("lib.update(")!=-1) return;
	else if( Update_Required_function.indexOf("timer.lib_update(")!=-1) {
		if(string.indexOf("lib.lib_update(")!=-1) Update_Required_function=string;
		return;
	}
	else Update_Required_function=string;
}

function on_paint(gr) {
	if(update_size) on_size(window.Width, window.Height);
	if(Update_Required_function!="") {
		eval(Update_Required_function);
		Update_Required_function = "";
	}
	gr.SetTextRenderingHint(globalProperties.TextRendering);
    if (ui.bg) gr.FillSolidRect(0, 0, ui.w, ui.h, ui.backcol);

	if((update_wallpaper || !g_wallpaperImg) && properties.showwallpaper && properties.wallpapermode == 0){
		g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
		update_wallpaper = false;		
	}
	if(g_wallpaperImg && properties.showwallpaper) {
		gr.DrawImage(g_wallpaperImg, 0, 0, ui.w, ui.h, 0, 0, g_wallpaperImg.Width, g_wallpaperImg.Height);
		gr.FillSolidRect(0, 0, ui.w, ui.h, (properties.wallpaperblurred)?colors.wallpaper_overlay_blurred:colors.wallpaper_overlay);
	}
    if (lib.upd) {
        lib.refresh();
        lib.upd = false;
        return;
    }
    pop.draw(gr);
    if (p.s_show) sL.draw(gr);
    if (p.s_show || ui.scrollbar_show) but.draw(gr);
    jS.draw(gr);

	if(p.tag_switcherbar) {
		g_tagswitcherbar.draw(gr,0,0);
	}

	if(pman.offset > 0) {
		pman.draw(gr);
	};
	if(g_resizing.isResizing()) gr.FillSolidRect(ui.w-1, 0, 1, wh, colors.dragdrop_marker_line);
	else gr.FillSolidRect(ui.w-1, 0, 1, wh, colors.sidesline);

    if (ui.scrollbar_show && pman.state !=1) sbar.draw(gr);
}

function button_manager() {
    var b_x, b_h,
        bx, by, bh, byDn, byUp, fw, i, qx, qy, qh, s_img = [],
        scr = [];
    this.btns = [];
    this.b = null;
	this.cursor = IDC_ARROW;
    var browser = function(c) {
        if (!run(c)) fb.ShowPopupMessage("Unable to launch your default browser.", "Library Tree");
    }
    var run = function(c) {
        try {
            var WshShell = new ActiveXObject("WScript.Shell");
            WshShell.Run(c);
            return true;
        } catch (e) {
            return false;
        }
    }
    this.lbtn_dn = function(x, y) {
        if (!this.b) return false;
        this.btns[this.b].lbtn_dn(x, y);
        return true;
    }
    this.lbtn_up = function(x, y) {
        if (!this.b) return false;
        this.btns[this.b].lbtn_up(x, y);
        return true;
    }
    this.leave = function() {
        if (this.b) this.btns[this.b].changestate("normal",-1,-1);
        this.b = null;
    }

    this.create_images = function() {
        var c, g;
        for (var j = 0; j < 2; j++) {
            c = j ? 0xe4ffffff : 0x99ffffff;
            s_img[j] = gdi.CreateImage(100, 100);
            g = s_img[j].GetGraphics();
            g.SetSmoothingMode(2);

			g.DrawLine(69, 71, 88, 90, 12, ui.txt_box & c);
			g.DrawEllipse(8, 11, 67, 67, 10, ui.txt_box & c);

            g.FillEllipse(15, 17, 55, 55, 0x0AFAFAFA);
            g.SetSmoothingMode(0);
            s_img[j].ReleaseGraphics(g);
        }
        for (var j = 0; j < 2; j++) {
            scr[j] = gdi.CreateImage(100, 100);
            g = scr[j].GetGraphics();
            g.SetSmoothingMode(2);
            g.FillPolygon(RGBA(200, 200, 200, j ? 192 : 75), 1, [50, 0, 93, 76, 6, 76]);
            g.SetSmoothingMode(0);
            scr[j].ReleaseGraphics(g);
        }
    };
    this.create_images();

    this.draw = function(gr) {
        for (i in this.btns) {
            if ((!p.s_txt) && i == "s_img") this.btns[i].draw(gr);
            //if (p.s_show == 1 && i == "cross1") this.btns[i].draw(gr);
            if (p.s_txt && i == "cross2") this.btns[i].draw(gr);
            if (p.s_show > 1 && i == "filter") this.btns[i].draw(gr);
            if (i == "scrollUp" || i == "scrollDn") this.btns[i].draw(gr);
        }
    }

    this.move = function(x, y) {
        var b = null,
            hand = false;
        for (i in this.btns) {
            if ((p.s_show == 1 || p.s_show > 1 && !p.s_txt) && i == "s_img" && this.btns[i].trace(x, y)) {
                b = i;
                hand = true;
            }
            if (p.s_show == 1 && i == "cross1" && this.btns[i].trace(x, y)) {
                b = i;
                hand = true;
            }
            if (p.s_txt && i == "cross2" && this.btns[i].trace(x, y)) {
                b = i;
                hand = true;
            }
            if (p.s_show > 1 && i == "filter" && this.btns[i].trace(x, y)) {
                b = i;
                hand = true;
            }
            if ((i == "scrollUp" || i == "scrollDn") && this.btns[i].trace(x, y)) b = i;
        }
        if (this.b == b) return this.b;
        if (b) this.btns[b].changestate("hover",x,y);
        if (this.b) this.btns[this.b].changestate("normal",x,y);
        this.b = b;

        return this.b;
    }

    var btn = function(x, y, w, h, type, ft, txt, stat, img_src, l_dn, l_up, tooltext) {
        this.draw = function(gr) {
            switch (type) {
                case 3:
                    if (this.img) gr.DrawImage(this.img, this.x, this.y+Math.round((this.h-this.img.Height)/2), this.img.Width, this.img.Height, 0, 0, this.img.Width, this.img.Height);
                    break;
                case 4:
                    gr.DrawLine(Math.round(this.x + bh * 0.67), Math.round(this.y + bh * 0.67), Math.round(this.x + bh * 0.27), Math.round(this.y + bh * 0.27), Math.round(bh / 10), RGBA(136, 136, 136, this.img));
                    gr.DrawLine(Math.round(this.x + bh * 0.67), Math.round(this.y + bh * 0.27), Math.round(this.x + bh * 0.27), Math.round(this.y + bh * 0.67), Math.round(bh / 10), RGBA(136, 136, 136, this.img));
                    break;
                case 5:
					gr.GdiDrawText(txt, ft, this.img, this.x, this.y - 1, this.w, this.h, DT_VCENTER | DT_LEFT | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
                    break;
                default:
                    if (this.img && sbar.scrollable_lines > 0) gr.DrawImage(this.img, this.x, this.y, this.w, this.h, 0, 0, this.img.Width, this.img.Height, type == 1 ? 0 : 180);
                    break;
            }
        }
        this.trace = function(x, y) {
            return x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h;
        }
        this.lbtn_dn = function() {
            this.l_dn && this.l_dn(x, y);
        }
        this.lbtn_up = function() {
            this.l_up && this.l_up(x, y);
        }

        this.changestate = function(state, x, y) {
            if (state == "hover") {
                this.img = this.img_hover;
				if(g_cursor.getCursor()!=IDC_HAND) {
					g_cursor.setCursor(IDC_HAND, this.tooltext);
					this.cursor = IDC_HAND;
				}
				if(!g_tooltip.activated) g_tooltip.ActivateDelay(this.tooltext, x+10, y+20, globalProperties.tooltip_button_delay, 1200, false, this.tooltext);
            } else {
                this.img = this.img_normal;
				if(this.cursor!=IDC_ARROW){
					g_cursor.setCursor(IDC_ARROW,38);
					this.cursor = IDC_ARROW;
				}
				if(g_tooltip.activated) g_tooltip.Deactivate();
            }
            window.RepaintRect(this.x, this.y, this.w, this.h);
        }
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.l_dn = l_dn;
        this.l_up = l_up;
        this.tooltext = tooltext;
        this.img_normal = img_src.normal;
        this.img_hover = img_src.hover || this.img_normal;
        this.img = this.img_normal;
    }

    this.refresh = function(upd) {
        if (upd) {
            bx = p.s_w1 - Math.round(ui.row_h * 0.75);
            bh = ui.row_h;
            by = Math.round((p.s_sp - bh * 0.4) / 2 - bh * 0.27);
            b_x = ui.w - ui.scr_w - 1;
            byUp = p.s_h;
            byDn = sbar.y + sbar.h - ui.scr_w;
            fw = p.f_w[p.filter_by] + p.f_sw + 12;
            qx = ui.margin-1;
            qy = sL.y;
            qh = p.s_sp;
        }
        if (ui.scrollbar_show) {
            //this.btns.scrollUp = new btn(b_x, byUp, ui.scr_w, ui.scr_w, 1, "", "", "", {normal: scr[0], hover: scr[1]}, function() {sbar.but(1);}, "", "");
            //this.btns.scrollDn = new btn(b_x, byDn, ui.scr_w, ui.scr_w, 2, "", "", "", {normal: scr[0], hover: scr[1]}, function() {sbar.but(-1);}, "", "");
        }
		this.btns = [];
        if (p.s_show) {
            this.btns.s_img = new btn(qx, qy-1, images.search_icon.Width, qh, 3, "", "", "", {
                normal: images.search_icon,
                hover: images.search_icon
            }, function() {
				sL.activate(0,0);
            }, "", "Filter tree");
            this.btns.cross1 = new btn(qx, qy-2, qh, qh, 3, "", "", "", {
                normal: images.resetIcon_off,
                hover: images.resetIcon_ov
            }, "", function() {
                if(!sL.lbtn_down) sL.clear();
            }, "Reset filter");
            this.btns.cross2 = new btn(qx+2, qy-2, qh, qh, 3, "", "", "", {
                normal: images.resetIcon_off,
                hover: images.resetIcon_ov
            }, "", function() {
                if(!sL.lbtn_down) sL.clear();
            }, "Reset filter");
            this.btns.filter = new btn(p.f_x1 - 12, sL.y, fw, p.s_sp, 5, ui.font, "", "", {
                normal: images.settings_off,
                hover: images.settings_hover
            }, "", function() {
                if(!sL.lbtn_down) men.button(p.f_x1, p.s_h);
                but.refresh(true)
            }, "Settings...");
        }

    }
}


function menu_object() {
    var i = 0,

        MF_GRAYED = 0x00000001,
        MF_POPUP = 0x00000010,
        MF_SEPARATOR = 0x00000800,
        MF_STRING = 0x00000000;
	this.MenuMap = [];
    this.NewMenuItem = function(index, type, value) {
        this.MenuMap[index] = [{
            type: ""
        }, {
            value: 0
        }];
        this.MenuMap[index].type = type;
        this.MenuMap[index].value = value;
    }
    this.PlaylistTypeMenu = function(Menu, StartIndex) {
        var Index = StartIndex,
            n = ["Send to Current Playlist", "Insert in Current Playlist", "Add to Current Playlist"];
        for (i = 0; i < 3; i++) {
            this.NewMenuItem(Index, "Playlist", i + 1);
            Menu.AppendMenuItem(MF_STRING, Index, n[i]);
            Index++;
        }
        return Index;
    }
    this.OptionsTypeMenu = function(Menu, StartIndex,reduced) {
        var Index = StartIndex,
            mt = p.syncType ? 1 : 0;
		if(!reduced){
			Menu.AppendMenuItem(MF_STRING, 7000, "Switch to filters");
			Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);

			var menuDisplay = window.CreatePopupMenu();

			menuDisplay.AppendMenuItem(MF_STRING, 7017, "Tag switcher bar");
			menuDisplay.CheckMenuItem(7017,p.tag_switcherbar)
			menuDisplay.AppendMenuItem(MF_STRING, 7018, "Hide menu button");
			menuDisplay.CheckMenuItem(7018,p.showFiltersTogglerBtn)
			var searchbar = window.CreatePopupMenu();
			searchbar.AppendMenuItem(MF_STRING, 7005, "Hide");
			searchbar.AppendMenuItem(MF_STRING, 7006, "Search bar only");
			searchbar.AppendMenuItem(MF_STRING, 7007, "Search bar + settings button");
			searchbar.CheckMenuRadioItem(7005, 7007, (p.s_show==0) ? 7005 : (p.s_show==1) ? 7006 : 7007);
			searchbar.AppendTo(menuDisplay, MF_STRING, "Search bar");

			menuDisplay.AppendMenuItem(MF_SEPARATOR, 0, 0);

			var nodeStyle = window.CreatePopupMenu();
			nodeStyle.AppendMenuItem(MF_STRING, 7010, "+/- nodes");
			nodeStyle.AppendMenuItem(MF_STRING, 7011, "Squares nodes");
			nodeStyle.AppendMenuItem(MF_STRING, 7012, "Triangles nodes");
			nodeStyle.CheckMenuRadioItem(7010, 7012, (ui.node_style==0) ? 7010 : (ui.node_style==1) ? 7011 : 7012);
			nodeStyle.AppendTo(menuDisplay, MF_STRING, "Node style");

			var lineStyle = window.CreatePopupMenu();
			lineStyle.AppendMenuItem(MF_STRING, 7030, "No lines");
			lineStyle.AppendMenuItem(MF_STRING, 7031, "lines on tracks");
			lineStyle.AppendMenuItem(MF_STRING, 7032, "lines everywhere");
			lineStyle.CheckMenuRadioItem(7030, 7032, (ui.linestyle==0) ? 7030 : (ui.linestyle==1) ? 7032 : 7031);
			lineStyle.AppendTo(menuDisplay, MF_STRING, "Lines style");

			menuDisplay.AppendMenuItem(MF_STRING, 7009, "Aggregate item");
			menuDisplay.CheckMenuItem(7009,pop.show_aggregate_item)
			menuDisplay.AppendMenuItem(MF_STRING, 7008, "Show items count");
			menuDisplay.CheckMenuItem(7008,pop.show_counts)
			menuDisplay.AppendMenuItem(MF_STRING, 7016, "Show Tooltips");
			menuDisplay.CheckMenuItem(7016,p.tooltip)

			menuDisplay.AppendTo(Menu,MF_STRING, "Display");

			var rowPadding = window.CreatePopupMenu();
			rowPadding.AppendMenuItem(MF_STRING, 7020, "Increase");
			rowPadding.AppendMenuItem(MF_STRING, 7021, "Decrease");
			rowPadding.AppendMenuItem(MF_SEPARATOR, 0, 0);
			rowPadding.AppendMenuItem(MF_DISABLED, 0, "Tip: Hold SHIFT and use your");
			rowPadding.AppendMenuItem(MF_DISABLED, 0, "mouse wheel over the panel!");
			rowPadding.AppendTo(Menu, MF_STRING, "Row height");

			var _panelWidth = window.CreatePopupMenu();
			_panelWidth.AppendMenuItem(MF_STRING, 1030, "Increase width");
			_panelWidth.AppendMenuItem(MF_STRING, 1031, "Decrease width");
			_panelWidth.AppendMenuItem(MF_STRING, 1033, "Custom width...");
			_panelWidth.AppendMenuItem(MF_STRING, 1032, "Reset");

			_panelWidth.AppendTo(Menu,MF_STRING, "Panel width");

			var wallpaper = window.CreatePopupMenu();
			wallpaper.AppendMenuItem(MF_STRING, 9000, "Enable");
			wallpaper.CheckMenuItem(9000, properties.showwallpaper);
			wallpaper.AppendMenuItem(MF_STRING, 9020, "Blur");
			wallpaper.CheckMenuItem(9020, properties.wallpaperblurred);
			var wallpaper2 = window.CreatePopupMenu();
			wallpaper2.AppendMenuItem(MF_STRING, 9021, "Filling");
			wallpaper2.CheckMenuItem(9021, properties.wallpaperdisplay==0);
			wallpaper2.AppendMenuItem(MF_STRING, 9022, "Adjust");
			wallpaper2.CheckMenuItem(9022, properties.wallpaperdisplay==1);
			wallpaper2.AppendMenuItem(MF_STRING, 9023, "Stretch");
			wallpaper2.CheckMenuItem(9023, properties.wallpaperdisplay==2);
			wallpaper2.AppendTo(wallpaper,MF_STRING, "Wallpaper size");
			wallpaper.AppendTo(Menu,MF_STRING, "Background Wallpaper");

			Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);

			Menu.AppendMenuItem(MF_STRING, 7015, "Auto collapse");
			Menu.CheckMenuItem(7015,pop.auto);
			Menu.AppendMenuItem(MF_STRING, 7023, "Auto expand only children");
			Menu.CheckMenuItem(7023,pop.autoExpandSingleChild);
		} else {
			Menu.AppendMenuItem(MF_STRING, 7024, "Settings...");
		}
		Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);
        for (i = 0; i < p.menu.length; i++) {
			if(p.menu[i]!="Panel Properties" && p.menu[i]!="Configure..."){
				this.NewMenuItem(Index, "Options", i + 1);
				if (i < p.menu.length - 1 || i == p.menu.length - 1 && v.k(0)) Menu.AppendMenuItem(MF_STRING, Index, p.menu[i]);
				if (i < p.menu.length - 2 - mt) Menu.CheckMenuItem(Index++, p.view_by == i);
				else Index++;
				if (i == p.menu.length - 4 - mt) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);
			}
        }
		searchbar = undefined;
		nodeStyle = undefined;
		lineStyle = undefined;
		rowPadding = undefined;
		wallpaper = undefined;
		wallpaper2 = undefined;
		menuDisplay = undefined;
        return Index;
    }

    this.FilterMenu = function(Menu, StartIndex) {
        var Index = StartIndex;
        for (i = 0; i < p.f_menu.length; i++) {
            this.NewMenuItem(Index, "Filter", i + 1);
            Menu.AppendMenuItem(MF_STRING, Index, i != p.f_menu.length ? (!i ? "No Filter" : ""+ p.f_menu[i]) : "Reset Scroll");
			if(i==0) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);
            Menu.CheckMenuItem(Index++, i < p.f_menu.length ? i == p.filter_by : p.reset);
            //if (i == p.f_menu.length - 1) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);
        }
        return Index;
    }

    this.button = function(x, y) {
        showOptionsMenu(x,y,true);
    }

    this.search = function(Menu, StartIndex, s, e, paste) {
        var Index = StartIndex,
            n = ["Copy", "Cut", "Paste"];
        for (i = 0; i < 3; i++) {
            this.NewMenuItem(Index, "Search", i + 1);
            Menu.AppendMenuItem(s == e && i < 2 || i == 2 && !paste ? MF_GRAYED : MF_STRING, Index, n[i]);
            Index++;
            if (i == 1) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);
        }
        return Index;
    }

    this.search_menu = function(x, y, s, e, paste) {
        var menu = window.CreatePopupMenu(),
            idx, Index = 1;
        Index = this.search(menu, Index, s, e, paste);
        idx = menu.TrackPopupMenu(x, y);
        if (idx >= 1 && idx <= Index) {
            i = this.MenuMap[idx].value;
            switch (i) {
                case 1:
                    sL.on_char(v.copy);
                    break;
                case 2:
                    sL.on_char(v.cut);
                    break;
                case 3:
                    sL.on_char(v.paste, true);
                    break;
            }
        }
        menu = undefined;
    }
	this.rbtn_down = function(x, y) {
        var Context = fb.CreateContextMenuManager(),
            FilterMenu = window.CreatePopupMenu(),
            idx, Index = 1,
            menu = window.CreatePopupMenu(),
            sendTo = window.CreatePopupMenu(),
            new_sel = false,
            OptionsMenu = window.CreatePopupMenu(),
            PlaylistMenu = window.CreatePopupMenu(),
            show_context = false,
			show_open_folder = false;
            ix = Math.round((y + sbar.delta - p.s_h - ui.row_h * 0.5) / ui.row_h);
        if (y > p.s_h && pop.tree.length > ix && ix >= 0 && pop.check_ix(pop.tree[ix], x, y, false)) {
            menu.AppendMenuItem(MF_STRING, 7004, "Settings...");
            menu.AppendMenuSeparator();
            menu.AppendMenuItem(MF_STRING, 7006, "Locate now playing group");
            menu.AppendMenuSeparator();

			var show_collapse = false
			for(var i=0; i < pop.tree.length; i++) {
				if(pop.tree[i].child && pop.tree[i].child.length>0) {
					show_collapse = true; break;
				}
			}

			if(ui.show_collapse_rclick && !pop.auto){
				menu.AppendMenuItem(MF_STRING, 7005, "Collapse all");
				menu.AppendMenuSeparator();
			}
            if (!pop.tree[ix].sel) {
                new_sel = true;
                pop.get_selection(ix, "", true, true);
            }
			if(new_sel)
				pop.clearSelectedItem();
			pop.tree[ix].sel = true;
			g_rightClickedIndex = ix;
			pop.get_sel_items();

			if(pop.sel_items.length>0) {

				var list = pop.sel_items;
				if(!pop.tree[ix].track){
					var first_item = p.list[list[0]];
					show_open_folder = true;
				}
				var items = p.items();
				for (var i = 0; i < list.length; i++) items.Add(p.list[list[i]]);
				this.metadblist_selection = items;
				sendTo.AppendTo(menu, MF_STRING, "Send to...");
				sendTo.AppendMenuItem(MF_STRING, 10000, "A new playlist...");
				var pl_count = plman.PlaylistCount;
				if(pl_count > 1) {
					sendTo.AppendMenuItem(MF_SEPARATOR, 0, "");
				};
				for(var i=0; i < pl_count; i++) {
					if(i != this.playlist && !plman.IsAutoPlaylist(i)) {
						playlist_name = plman.GetPlaylistName(i);
						if(playlist_name!=properties.selectionPlaylist) sendTo.AppendMenuItem(MF_STRING, 10001 + i, plman.GetPlaylistName(i));
					};
				};
			}

            Index = this.PlaylistTypeMenu(menu, Index);
            menu.AppendMenuSeparator();
            show_context = true;
        }
        if (show_context) {
            var items = p.items();
            for (var l in pop.sel_items) items.Add(p.list[pop.sel_items[l]]);
            Context.InitContext(items);
            Context.BuildMenu(menu, 5000, -1);
			if(show_open_folder && p.view_by == p.folder_view) {
				menu.AppendMenuSeparator();
				menu.AppendMenuItem(MF_STRING, 9999, "Open Folder");
			}
        } else showOptionsMenu(x,y,false);

		if(utils.IsKeyPressed(VK_SHIFT)) {
			menu.AppendMenuSeparator();
			menu.AppendMenuItem(MF_STRING, 7001, "Properties");
			menu.AppendMenuItem(MF_STRING, 7002, "Configure...");
			menu.AppendMenuSeparator();
			menu.AppendMenuItem(MF_STRING, 7003, "Reload");
		}

        idx = menu.TrackPopupMenu(x, y);
		if(idx==7001){
			window.ShowProperties();
		} else if(idx==7002){
			window.ShowConfigure();
		} else if(idx==7003){
			window.Reload();
		} else if(idx==7004){
			showOptionsMenu(x,y,false);
		} else if(idx==7005){
			pop.branch_chg(pop.tree[0]);
			pop.buildTree(lib.root, 0, true, true);
		} else if(idx==7006){
			pop.showNowPlaying(true);
		} else if(idx==9999){
			if(pop.show_aggregate_item && ix==0) openFolder(first_item,-1);
			else openFolder(first_item,pop.tree[ix].tr);
        } else if (idx == 10000) {
			fb.RunMainMenuCommand("File/New playlist");
			plman.InsertPlaylistItems(plman.PlaylistCount-1, 0, this.metadblist_selection, false);
        } else if (idx >= 10000) {
			var insert_index = plman.PlaylistItemCount(idx-10001);
			plman.InsertPlaylistItems((idx-10001), insert_index, this.metadblist_selection, false);
        } else if (idx >= 1 && idx <= Index) {
            i = this.MenuMap[idx].value;
            switch (this.MenuMap[idx].type) {
                case "Playlist":
                    switch (i) {
                        case 1:
                            if (new_sel)
                                pop.clearSelectedItem();
                            pop.tree[ix].sel = true;
                            pop.load(pop.sel_items, true, false, true, false, false);
                            p.tree_paint();
                            break;
                        default:
                            pop.tree[ix].sel = true;
                            pop.load(pop.sel_items, true, true, false, false, i == 2 ? true : false);
                            pop.get_sel_items();
                            break;
                    }
                    break;
                case "Options":
                    var mtt = i == p.menu.length - 2 && p.syncType ? 1 : i == p.menu.length - 1 ? 2 : i == p.menu.length ? 3 : 4;
                    switch (mtt) {
                        case 1:
                            window.ShowProperties();
                            break;
                        case 2:
                            p.syncType ? lib.update() : window.ShowProperties();
                            break;
                        case 3:
                            window.ShowConfigure();
                            break;
                        case 4:
                            lib.time.Reset();
                            if (p.s_txt) lib.upd_search = true;
                            p.fields(i < p.grp.length + 1 ? i - 1 : p.view_by, i - 1 < p.grp.length ? p.filter_by : i - 1 - p.grp.length);
                            lib.get_library();
                            lib.rootNodes();
                            break;
                    }
                    break;
            }
        }
        if (idx >= 5000 && idx <= 5800) {
            show_context && Context.ExecuteByID(idx - 5000);
        }

		g_rightClickedIndex = -1;
        Context = undefined;
        FilterMenu = undefined;
        menu = undefined;
        OptionsMenu = undefined;
		sendTo = undefined;
        PlaylistMenu = undefined;
	}
    this.rbtn_up = function(x, y) {
    }
}

function openFolder(item,level){
	var WshShell = new ActiveXObject("WScript.Shell");

	if(level==-1) var final_path = item.Path.replace(fb.GetLibraryRelativePath(item), "");
	else {
		var lib_path = item.Path.replace(fb.GetLibraryRelativePath(item), "");
		var folder_path = fb.GetLibraryRelativePath(item).split('\\').slice(0,level+1).join('\\');
		var final_path = lib_path+folder_path;
	}

	try {
		WshShell.Run("\"" + final_path + "\"", 1);
	} catch(e) {
		fb.ShowPopupMessage("Folder not found.","Error");
	}
}
function showSettingsMenu(x,y){
	var menu = window.CreatePopupMenu();

	menu.AppendMenuItem(MF_STRING, 7000, "Switch to filters");
	menu.AppendMenuItem(MF_SEPARATOR, 0, 0);

	var menuDisplay = window.CreatePopupMenu();

	menuDisplay.AppendMenuItem(MF_STRING, 7017, "Tag switcher bar");
	menuDisplay.CheckMenuItem(7017,p.tag_switcherbar)
	menuDisplay.AppendMenuItem(MF_STRING, 7018, "Hide menu button");
	menuDisplay.CheckMenuItem(7018,p.showFiltersTogglerBtn)
	var searchbar = window.CreatePopupMenu();
	searchbar.AppendMenuItem(MF_STRING, 7005, "Hide");
	searchbar.AppendMenuItem(MF_STRING, 7006, "Search bar only");
	searchbar.AppendMenuItem(MF_STRING, 7007, "Search bar + settings button");
	searchbar.CheckMenuRadioItem(7005, 7007, (p.s_show==0) ? 7005 : (p.s_show==1) ? 7006 : 7007);
	searchbar.AppendTo(menuDisplay, MF_STRING, "Search bar");

	menuDisplay.AppendMenuItem(MF_SEPARATOR, 0, 0);

	var nodeStyle = window.CreatePopupMenu();
	nodeStyle.AppendMenuItem(MF_STRING, 7010, "+/- nodes");
	nodeStyle.AppendMenuItem(MF_STRING, 7011, "Squares nodes");
	nodeStyle.AppendMenuItem(MF_STRING, 7012, "Triangles nodes");
	nodeStyle.CheckMenuRadioItem(7010, 7012, (ui.node_style==0) ? 7010 : (ui.node_style==1) ? 7011 : 7012);
	nodeStyle.AppendTo(menuDisplay, MF_STRING, "Node style");

	var lineStyle = window.CreatePopupMenu();
	lineStyle.AppendMenuItem(MF_STRING, 7030, "No lines");
	lineStyle.AppendMenuItem(MF_STRING, 7031, "lines on tracks");
	lineStyle.AppendMenuItem(MF_STRING, 7032, "lines everywhere");
	lineStyle.CheckMenuRadioItem(7030, 7032, (ui.linestyle==0) ? 7030 : (ui.linestyle==1) ? 7032 : 7031);
	lineStyle.AppendTo(menuDisplay, MF_STRING, "Lines style");

	menuDisplay.AppendMenuItem(MF_STRING, 7009, "Aggregate item");
	menuDisplay.CheckMenuItem(7009,pop.show_aggregate_item)
	menuDisplay.AppendMenuItem(MF_STRING, 7008, "Show items count");
	menuDisplay.CheckMenuItem(7008,pop.show_counts)
	menuDisplay.AppendMenuItem(MF_STRING, 7016, "Show Tooltips");
	menuDisplay.CheckMenuItem(7016,p.tooltip)

	menuDisplay.AppendMenuItem(MF_SEPARATOR, 0, 0);

	menuDisplay.AppendTo(menu,MF_STRING, "Display");

	var rowPadding = window.CreatePopupMenu();
	rowPadding.AppendMenuItem(MF_STRING, 7020, "Increase");
	rowPadding.AppendMenuItem(MF_STRING, 7021, "Decrease");
	rowPadding.AppendMenuItem(MF_SEPARATOR, 0, 0);
	rowPadding.AppendMenuItem(MF_DISABLED, 0, "Tip: Hold SHIFT and use your");
	rowPadding.AppendMenuItem(MF_DISABLED, 0, "mouse wheel over the panel!");
	rowPadding.AppendTo(menu, MF_STRING, "Row height");

	var _panelWidth = window.CreatePopupMenu();
	_panelWidth.AppendMenuItem(MF_STRING, 1030, "Increase width");
	_panelWidth.AppendMenuItem(MF_STRING, 1031, "Decrease width");
	_panelWidth.AppendMenuItem(MF_STRING, 1033, "Custom width...");
	_panelWidth.AppendMenuItem(MF_STRING, 1032, "Reset");
	_panelWidth.AppendTo(menu,MF_STRING, "Panel width");

	var wallpaper = window.CreatePopupMenu();
	wallpaper.AppendMenuItem(MF_STRING, 9000, "Enable");
	wallpaper.CheckMenuItem(9000, properties.showwallpaper);
	wallpaper.AppendMenuItem(MF_STRING, 9020, "Blur");
	wallpaper.CheckMenuItem(9020, properties.wallpaperblurred);

	var wallpaper2 = window.CreatePopupMenu();
	wallpaper2.AppendMenuItem(MF_STRING, 9021, "Filling");
	wallpaper2.CheckMenuItem(9021, properties.wallpaperdisplay==0);
	wallpaper2.AppendMenuItem(MF_STRING, 9022, "Adjust");
	wallpaper2.CheckMenuItem(9022, properties.wallpaperdisplay==1);
	wallpaper2.AppendMenuItem(MF_STRING, 9023, "Stretch");
	wallpaper2.CheckMenuItem(9023, properties.wallpaperdisplay==2);
	wallpaper2.AppendTo(wallpaper,MF_STRING, "Wallpaper size");
	wallpaper.AppendTo(menu,MF_STRING, "Background Wallpaper");

	menu.AppendMenuItem(MF_SEPARATOR, 0, 0);

	menu.AppendMenuItem(MF_STRING, 7015, "Auto collapse");
	menu.CheckMenuItem(7015,pop.auto);
	menu.AppendMenuItem(MF_STRING, 7023, "Auto expand only children");
	menu.CheckMenuItem(7023,pop.autoExpandSingleChild);

	idx = menu.TrackPopupMenu(x, y);
	if(idx==7000){
		librarytree.toggleValue();
	} else if(idx==7005){
		p.s_show = 0;
		window.SetProperty("Search: Hide-0, SearchOnly-1, Search+Filter-2", p.s_show);
		p.on_size();
		but.refresh(true);
	} else if(idx==7006){
		p.s_show = 1;
		window.SetProperty("Search: Hide-0, SearchOnly-1, Search+Filter-2", p.s_show);
		p.on_size();
		but.refresh(true);
	} else if(idx==7007){
		p.s_show = 2;
		window.SetProperty("Search: Hide-0, SearchOnly-1, Search+Filter-2", p.s_show);
		p.on_size();
		but.refresh(true);
	} else if(idx==7008){
		pop.show_counts = !pop.show_counts;
		window.SetProperty("Node: Show Item Counts", pop.show_counts);
		window.Repaint();
	} else if(idx==7009){
		pop.show_aggregate_item = !pop.show_aggregate_item;
		window.SetProperty("Node: Show Aggregate Item", pop.show_aggregate_item);
		lib.time.Reset();
		lib.get_library();
		lib.rootNodes();
	} else if(idx==7010){
		ui.node_style = 0;
		window.SetProperty("Node: Custom Symbols-0 Soft-1 Bold-2", ui.node_style);
		ui.get_colors();
		window.Repaint();
	} else if(idx==7011){
		ui.node_style = 1;
		window.SetProperty("Node: Custom Symbols-0 Soft-1 Bold-2", ui.node_style);
		ui.get_colors();
		window.Repaint();
	} else if(idx==7012){
		ui.node_style = 2;
		window.SetProperty("Node: Custom Symbols-0 Soft-1 Bold-2", ui.node_style);
		ui.get_colors();
		window.Repaint();
	} else if(idx==7030){
		ui.linestyle = 0;
		window.SetProperty("Node: Lines: Hide-0 Grey-1 Blend-2 Text-3", ui.linestyle);
		ui.get_colors();
		window.Repaint();
	} else if(idx==7031){
		ui.linestyle = 2;
		window.SetProperty("Node: Lines: Hide-0 Grey-1 Blend-2 Text-3", ui.linestyle);
		ui.get_colors();
		window.Repaint();
	} else if(idx==7032){
		ui.linestyle = 1;
		window.SetProperty("Node: Lines: Hide-0 Grey-1 Blend-2 Text-3", ui.linestyle);
		ui.get_colors();
		window.Repaint();
	} else if(idx==7015){
		pop.auto = !pop.auto;
		window.SetProperty("Node: Auto Collapse", pop.auto);
		if(pop.auto) {
			pop.branch_chg(pop.tree[0]);
			pop.buildTree(lib.root, 0, true, true);
		}
		window.Repaint();
	} else if(idx==7023){
		pop.autoExpandSingleChild = !pop.autoExpandSingleChild;
		window.SetProperty("Node: Auto Expand Single Childs", pop.autoExpandSingleChild);
		window.Repaint();
	} else if(idx==7016){
		p.tooltip = !p.tooltip;
		window.SetProperty("Tooltips", p.tooltip);
		window.Repaint();
	} else if(idx==7017){
		p.tag_switcherbar = !p.tag_switcherbar;
		window.SetProperty("Tag switcher bar", p.tag_switcherbar);
		p.on_size();but.refresh(true);
		window.Repaint();
	} else if(idx==7018){
		p.showFiltersTogglerBtn = !p.showFiltersTogglerBtn;
		window.SetProperty("_PROPERTY: show filters toggler btn", p.showFiltersTogglerBtn);
		window.NotifyOthers("showFiltersTogglerBtn",p.showFiltersTogglerBtn);
		window.Repaint();
	} else if(idx==7020){
		ui.setRowPadding(ui.row_p+2);
	} else if(idx==7021){
		ui.setRowPadding(ui.row_p-2);
	} else if(idx==1030){
		libraryfilter_width.increment(10);
	} else if(idx==1031){
		libraryfilter_width.decrement(10);
	} else if(idx==1032){
		libraryfilter_width.setDefault();
	} else if(idx==1033){
		libraryfilter_width.userInputValue("Enter the desired width in pixel.\nDefault width is 210px.\nMinimum width: 100px. Maximum width: 900px", "Custom left menu width");
	} else if(idx==9000){
		toggleWallpaper();
	} else if(idx==9020){
		properties.wallpaperblurred = !properties.wallpaperblurred;
		on_colours_changed();
		window.SetProperty("_DISPLAY: Wallpaper Blurred", properties.wallpaperblurred);
		g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
		window.Repaint();
	} else if(idx==9021){
		properties.wallpaperdisplay = 0;
		window.SetProperty("_DISPLAY: Wallpaper 0=Filling 1=Adjust 2=Stretch", properties.wallpaperdisplay);
		g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
		window.Repaint();
	} else if(idx==9022){
		properties.wallpaperdisplay = 1;
		window.SetProperty("_DISPLAY: Wallpaper 0=Filling 1=Adjust 2=Stretch", properties.wallpaperdisplay);
		g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
		window.Repaint();
	} else if(idx==9023){
		properties.wallpaperdisplay = 2;
		window.SetProperty("_DISPLAY: Wallpaper 0=Filling 1=Adjust 2=Stretch", properties.wallpaperdisplay);
		g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
		window.Repaint();
	}
	menu = undefined;
	searchbar = undefined;
	nodeStyle = undefined;
	lineStyle = undefined;
	rowPadding = undefined;
	wallpaper = undefined;
	wallpaper2 = undefined;
	menuDisplay = undefined;
}
function showOptionsMenu(x,y,reduced){
	menu = window.CreatePopupMenu();
	menuFilter = window.CreatePopupMenu();
	Index = 1, FilterStartIndex = 10000;

	Index = men.OptionsTypeMenu(menu, Index,reduced);


	menu.AppendMenuSeparator();
	FilterEndIndex = men.FilterMenu(menuFilter, FilterStartIndex);
	menuFilter.AppendTo(menu, (p.filter_by==0)?MF_STRING:MF_CHECKED, "Filter by");

	if(utils.IsKeyPressed(VK_SHIFT)) {
		menu.AppendMenuSeparator();
		menu.AppendMenuItem(MF_STRING, 7001, "Properties");
		menu.AppendMenuItem(MF_STRING, 7002, "Configure...");
		menu.AppendMenuSeparator();
		menu.AppendMenuItem(MF_STRING, 7003, "Reload");
	}

	idx = menu.TrackPopupMenu(x, y);
	if (idx >= FilterStartIndex && idx <= FilterEndIndex) {
		i = men.MenuMap[idx].value;
		switch (i) {
			case p.f_menu.length + 1:
				p.reset = !p.reset;
				if (p.reset) {
					p.search_paint();
					lib.refresh(true);
				}
				window.SetProperty("SYSTEM.Reset Tree", p.bypass);
				break;
			default:
				p.filter_by = i - 1;
				p.set_statistics_mode();
				p.calc_text();
				p.search_paint();
				lib.refresh(true);
				window.SetProperty("SYSTEM.Filter By", p.filter_by);
				break;
		}
	}
	else if(idx==7000){
		librarytree.toggleValue();
	} else if(idx==7001){
		window.ShowProperties();
	} else if(idx==7002){
		window.ShowConfigure();
	} else if(idx==7003){
		window.Reload();
	} else if(idx==7005){
		p.s_show = 0;
		window.SetProperty("Search: Hide-0, SearchOnly-1, Search+Filter-2", p.s_show);
		p.on_size();
		but.refresh(true);
	} else if(idx==7006){
		p.s_show = 1;
		window.SetProperty("Search: Hide-0, SearchOnly-1, Search+Filter-2", p.s_show);
		p.on_size();
		but.refresh(true);
	} else if(idx==7007){
		p.s_show = 2;
		window.SetProperty("Search: Hide-0, SearchOnly-1, Search+Filter-2", p.s_show);
		p.on_size();
		but.refresh(true);
	} else if(idx==7008){
		pop.show_counts = !pop.show_counts;
		window.SetProperty("Node: Show Item Counts", pop.show_counts);
		window.Repaint();
	} else if(idx==7009){
		pop.show_aggregate_item = !pop.show_aggregate_item;
		window.SetProperty("Node: Show Aggregate Item", pop.show_aggregate_item);
		lib.time.Reset();
		lib.get_library();
		lib.rootNodes();
	} else if(idx==7010){
		ui.node_style = 0;
		window.SetProperty("Node: Custom Symbols-0 Soft-1 Bold-2", ui.node_style);
		ui.get_colors();
		window.Repaint();
	} else if(idx==7011){
		ui.node_style = 1;
		window.SetProperty("Node: Custom Symbols-0 Soft-1 Bold-2", ui.node_style);
		ui.get_colors();
		window.Repaint();
	} else if(idx==7012){
		ui.node_style = 2;
		window.SetProperty("Node: Custom Symbols-0 Soft-1 Bold-2", ui.node_style);
		ui.get_colors();
		window.Repaint();
	} else if(idx==7030){
		ui.linestyle = 0;
		window.SetProperty("Node: Lines: Hide-0 Grey-1 Blend-2 Text-3", ui.linestyle);
		ui.get_colors();
		window.Repaint();
	} else if(idx==7031){
		ui.linestyle = 2;
		window.SetProperty("Node: Lines: Hide-0 Grey-1 Blend-2 Text-3", ui.linestyle);
		ui.get_colors();
		window.Repaint();
	} else if(idx==7032){
		ui.linestyle = 1;
		window.SetProperty("Node: Lines: Hide-0 Grey-1 Blend-2 Text-3", ui.linestyle);
		ui.get_colors();
		window.Repaint();
	} else if(idx==7015){
		pop.auto = !pop.auto;
		window.SetProperty("Node: Auto Collapse", pop.auto);
		if(pop.auto) {
			pop.branch_chg(pop.tree[0]);
			pop.buildTree(lib.root, 0, true, true);
		}
		window.Repaint();
	} else if(idx==7023){
		pop.autoExpandSingleChild = !pop.autoExpandSingleChild;
		window.SetProperty("Node: Auto Expand Single Childs", pop.autoExpandSingleChild);
		window.Repaint();
	} else if(idx==7024){
		showSettingsMenu(x,y);
	} else if(idx==7016){
		p.tooltip = !p.tooltip;
		window.SetProperty("Tooltips", p.tooltip);
		window.Repaint();
	} else if(idx==7017){
		p.tag_switcherbar = !p.tag_switcherbar;
		window.SetProperty("Tag switcher bar", p.tag_switcherbar);
		p.on_size();but.refresh(true);
		window.Repaint();
	} else if(idx==7018){
		p.showFiltersTogglerBtn = !p.showFiltersTogglerBtn;
		window.SetProperty("_PROPERTY: show filters toggler btn", p.showFiltersTogglerBtn);
		window.NotifyOthers("showFiltersTogglerBtn",p.showFiltersTogglerBtn);
		window.Repaint();
	} else if(idx==7020){
		ui.setRowPadding(ui.row_p+2);
	} else if(idx==7021){
		ui.setRowPadding(ui.row_p-2);
	} else if(idx==1030){
		libraryfilter_width.increment(10);
	} else if(idx==1031){
		libraryfilter_width.decrement(10);
	} else if(idx==1032){
		libraryfilter_width.setDefault();
	} else if(idx==1033){
		libraryfilter_width.userInputValue("Enter the desired width in pixel.\nDefault width is 210px.\nMinimum width: 100px. Maximum width: 900px", "Custom left menu width");
	} else if(idx==9000){
		toggleWallpaper();
	} else if(idx==9020){
		properties.wallpaperblurred = !properties.wallpaperblurred;
		on_colours_changed();
		window.SetProperty("_DISPLAY: Wallpaper Blurred", properties.wallpaperblurred);
		g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
		window.Repaint();
	} else if(idx==9021){
		properties.wallpaperdisplay = 0;
		window.SetProperty("_DISPLAY: Wallpaper 0=Filling 1=Adjust 2=Stretch", properties.wallpaperdisplay);
		g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
		window.Repaint();
	} else if(idx==9022){
		properties.wallpaperdisplay = 1;
		window.SetProperty("_DISPLAY: Wallpaper 0=Filling 1=Adjust 2=Stretch", properties.wallpaperdisplay);
		g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
		window.Repaint();
	} else if(idx==9023){
		properties.wallpaperdisplay = 2;
		window.SetProperty("_DISPLAY: Wallpaper 0=Filling 1=Adjust 2=Stretch", properties.wallpaperdisplay);
		g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
		window.Repaint();
	} else if (idx >= 1 && idx <= Index) {
		i = men.MenuMap[idx].value;
		switch (men.MenuMap[idx].type) {
			case "Playlist":
				switch (i) {
					case 1:
						if (new_sel)
							pop.clearSelectedItem();
						pop.tree[ix].sel = true;
						pop.load(pop.sel_items, true, false, true, false, false);
						p.tree_paint();
						break;
					default:
						pop.tree[ix].sel = true;
						pop.load(pop.sel_items, true, true, false, false, i == 2 ? true : false);
						pop.get_sel_items();
						break;
				}
				break;
			case "Options":
				var mtt = i == p.menu.length - 2 && p.syncType ? 1 : i == p.menu.length - 1 ? 2 : i == p.menu.length ? 3 : 4;
				switch (mtt) {
					case 1:
						window.ShowProperties();
						break;
					case 2:
						p.syncType ? lib.update() : window.ShowProperties();
						break;
					case 3:
						window.ShowConfigure();
						break;
					case 4:
						lib.time.Reset();
						if (p.s_txt) lib.upd_search = true;
						p.fields(i < p.grp.length + 1 ? i - 1 : p.view_by, i - 1 < p.grp.length ? p.filter_by : i - 1 - p.grp.length);
						lib.get_library();
						lib.rootNodes();
						break;
				}
				break;
		}
	}
	menu = undefined;
	menuFilter = undefined;
	return true;
}

function oTimers() {
    var timer_arr = ["clear_jsearch", "init", "jsearch", "search", "search_cursor", "tt", "update"];
    for (var i = 0; i < timer_arr.length; i++) this[timer_arr[i]] = false;
    this.reset = function(timer, n) {
        if (timer) clearTimeout(timer);
        this[timer_arr[n]] = false;
    }
    this.lib = function(callID) {
		lib_update_callID = callID;
        this.init = setTimeout(function() {
            lib.get_library();
            lib.rootNodes(lib_update_callID);
            timer.reset(timer.init, 1);
        }, 5);
    }
    this.tooltip = function() {
        this.reset(this.tt, 6);
        this.tt = setTimeout(function() {
            pop.deactivate_tooltip();
            timer.reset(timer.tt, 5);
        }, 5000);
    }
    this.lib_update = function(callID) {
		lib_update_callID = callID;
        this.reset(this.update, 6);
        this.update = setTimeout(function() {
            lib.update(lib_update_callID);
            timer.reset(timer.update, 6);
        }, 500);
    }
}



function on_char(code) {
    if (!p.s_show) return;
    sL.on_char(code);
    jS.on_char(code)
}

function on_key_down(vkey) {
    pop.on_key_down(vkey);
    if (!p.s_show) return;
    sL.on_key_down(vkey);
}

function on_key_up(vkey) {
    if (!p.s_show) return;
    sL.on_key_up(vkey)
}
function on_playlists_changed() {
	if(window.IsVisible) {
		pman.populate(exclude_active = false, reset_scroll = false);
	} else {
		set_update_function('on_playlists_changed();');
		pman.refresh_required = true;
	}
};
function on_playlist_switch() {
    if(window.IsVisible) {
		pman.populate(exclude_active = false, reset_scroll = false);
		if(pop.pln != plman.ActivePlaylist && !ui.force_SelectedDraw){
			pop.clearSelectedItem();
		}
		window.Repaint();
	} else set_update_function('on_playlist_switch()');
	ui.force_SelectedDraw = false;	
};
//=================================================// Playback Callbacks
function on_playback_new_track(metadb){
	try{
		playing_track_playcount = TF.play_count.Eval();
	} catch(e){}
	if(window.IsVisible) {
		if(properties.showwallpaper && properties.wallpapermode == 0) {
			g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, metadb);
		};
		window.Repaint();
	} else if(properties.wallpapermode == 0) update_wallpaper = true;
}
function on_playback_stop(reason) {
    switch(reason) {
    case 0: // user stop
    case 1: // eof (e.g. end of playlist)
        // update wallpaper
        if(properties.showwallpaper && properties.wallpapermode == 0) {
            g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, null);
			window.Repaint();
        };
        break;
    case 2: // starting_another (only called on user action, i.e. click on next button)
        break;
    };
};
function on_metadb_changed(metadbs, fromhook) {
	playing_track_new_count = parseInt(playing_track_playcount,10)+1
	try {
		if(fb.IsPlaying && metadbs.Count==1 && metadbs[0].RawPath==fb.GetNowPlaying().RawPath && TF.play_count.Eval()==(playing_track_new_count)) {
			playing_track_playcount = playing_track_new_count;
			return;
		}
	} catch(e){}
	if(window.IsVisible){
		if(!fromhook) timer.lib_update('on_metadb_changed');
	} else if(!fromhook) set_update_function("lib.update('on_metadb_changed')");
}
function on_library_items_added() {
	if(window.IsVisible){
		if (p.syncType) return;
		timer.lib_update('on_library_items_added');
	} else set_update_function("lib.update('on_library_items_added')");
}

function on_library_items_removed() {
	if(window.IsVisible){
		if (p.syncType) return;
		timer.lib_update('on_library_items_removed');
	} else set_update_function("lib.update('on_library_items_removed')");
}

/*function on_library_items_changed() {
    if (p.syncType || !p.statistics && fb.PlaybackTime > 59 && fb.PlaybackTime < 65) return;
    timer.lib_update('on_library_items_changed');
}*/

function on_mouse_lbtn_dblclk(x, y) {
	g_on_mouse_lbtn_dblclk = true;
	/*if(timers.delayForDoubleClick) {
		clearTimeout(timers.delayForDoubleClick);
		timers.delayForDoubleClick = false;
	}*/
    but.lbtn_dn(x, y);
    pop.lbtn_dblclk(x, y);
}

function on_mouse_lbtn_down(x, y, m) {
	var isResizing = g_resizing.on_mouse("lbtn_down", x, y, m, !sbar.hover);
	if(!isResizing){
		if (p.s_show) sL.lbtn_dn(x, y);
		if (p.s_show || ui.scrollbar_show) but.lbtn_dn(x, y);
		pop.lbtn_dn(x, y);
		sbar.lbtn_dn(x, y);
		if(p.tag_switcherbar) {
			g_tagswitcherbar.on_mouse("lbtn_down", x, y);
		}
	};
}
function on_mouse_rbtn_down(x, y, mask) {
	if(pman.state == 1) {
		pman.on_mouse("right", x, y);
	};
    if (y < p.s_h && x > p.s_x && x < p.s_x + p.s_w2) {
        if (p.s_show) sL.rbtn_down(x, y);
        return true;
    } else {
        men.rbtn_down(x, y);
        return true;
    }
	if(p.tag_switcherbar) {
		g_tagswitcherbar.on_mouse("rbtn_down", x, y);
	};
};
function on_mouse_rbtn_up(x, y) {

}

function on_mouse_lbtn_up(x, y, m) {
	var isResizing = g_resizing.on_mouse("lbtn_up", x, y, m);
	if(!isResizing){
		p.m_x = x;
		p.m_y = y;
		if (p.s_show) {
			but.lbtn_up(x, y);
			sL.lbtn_up();
		}
		if(!g_on_mouse_lbtn_dblclk) {
			pop.lbtn_up(x, y);
		} else g_on_mouse_lbtn_dblclk = false;
		/*timers.delayForDoubleClick = setTimeout(function() {
			clearTimeout(timers.delayForDoubleClick);
			timers.delayForDoubleClick = false;
			on_mouse_lbtn_up_delayed(m_x, m_y);
		},20);*/
		if(pman.state == 1) {
			pman.on_mouse("up", x, y);
		}
		sbar.lbtn_up(x, y);
		if(p.tag_switcherbar) {
			g_tagswitcherbar.on_mouse("lbtn_up", x, y);
		}
	};
}

function on_mouse_leave() {
	g_resizing.on_mouse("leave", -1, -1);
    if (p.s_show || ui.scrollbar_show) but.leave();
    sbar.leave();
	pop.leave();
	if (p.s_show) sL.leave();
    /*if(pman.state == 1) {
        pman.on_mouse("leave", 0, 0);
    };	*/
	if(p.tag_switcherbar) {
		g_tagswitcherbar.on_mouse("leave", 0, 0);
	};
}
function on_drag_enter(action, x, y, mask) {
	action.Effect = 0;
}

function on_drag_leave() {
	g_resizing.on_mouse("lbtn_up", 0, 0, null);
    /*if(pman.state == 1) {
        pman.on_mouse("leave", 0, 0);
    };*/
	p.m_x = p.m_y = -1;
}

function on_drag_drop(action, x, y, mask) {
	action.Effect = 0;
	if(pman.state == 1) {
		pman.on_mouse("up", x, y);
	}
}
function on_drag_over(action, x, y, mask) {
    if(x == p.m_x && y == p.m_y) return true;
	if(!ui.drag_moving){
		action.Effect = 0;
		return;
	}
	if(ui.drag_moving && !timers.hidePlaylistManager && !timers.showPlaylistManager) {
		pman.on_mouse("move", x, y);
	};
	try{
		//action.Text = "Insert";
	} catch(e){}
    p.m_x = x;
    p.m_y = y;
}
function on_mouse_mbtn_down(x, y) {
    pop.mbtn_dn(x, y);
}

function on_mouse_move(x, y, m) {
    if (p.m_x == x && p.m_y == y) return;
	g_cursor.onMouse("move", x, y, m);

	var isResizing = g_resizing.on_mouse("move", x, y, m, !sbar.hover && !sbar.b_is_dragging);
	if(isResizing){
		if(g_resizing.resizing_x>x+5){
			g_resizing.resizing_x = x;
			libraryfilter_width.decrement(5);
		} else if(g_resizing.resizing_x<x-5){
			g_resizing.resizing_x = x;
			libraryfilter_width.increment(5);
		}
	} else {
		if (p.s_show) sL.move(x, y);
		if (p.s_show || ui.scrollbar_show) but.move(x, y);

		pop.move(x, y);
		sbar.move(x, y);
		if(pman.state == 1) {
			pman.on_mouse("move", x, y);
		}
		p.m_x = x;
		p.m_y = y;
		if(p.tag_switcherbar) {
			g_tagswitcherbar.on_mouse("move", x, y);
		};
	};
}

function on_mouse_wheel(step, stepstrait, delta) {
	if(typeof(stepstrait) == "undefined" || typeof(delta) == "undefined") intern_step = step;
	else intern_step = stepstrait/delta;

	if(utils.IsKeyPressed(VK_SHIFT)) {
		ui.setRowPadding(ui.row_p+intern_step);
	} else if(utils.IsKeyPressed(VK_CONTROL)) { // zoom all elements
		var zoomStep = 1;
		var previous = globalProperties.fontAdjustement;
		if(!timers.mouseWheel) {
			if(intern_step > 0) {
				globalProperties.fontAdjustement += zoomStep;
				if(globalProperties.fontAdjustement > globalProperties.fontAdjustement_max) globalProperties.fontAdjustement = globalProperties.fontAdjustement_max;
			} else {
				globalProperties.fontAdjustement -= zoomStep;
				if(globalProperties.fontAdjustement < globalProperties.fontAdjustement_min) properties.globalFontAdjustement = globalProperties.fontAdjustement_min;
			};
			if(previous != properties.globalFontAdjustement) {
				timers.mouseWheel = setTimeout(function() {
					on_notify_data('set_font',globalProperties.fontAdjustement);
					window.NotifyOthers('set_font',globalProperties.fontAdjustement);
					timers.mouseWheel && clearTimeout(timers.mouseWheel);
					timers.mouseWheel = false;
				}, 100);
			};
		};
	} else if(pman.state == 1) {
		if(pman.scr_w > 0) pman.on_mouse("wheel", p.m_x, p.m_y, intern_step);
    } else if (!v.k(1)) {
		sbar.wheel(intern_step);
	} else {
		ui.wheel(intern_step);
	}
}

function on_focus(is_focused) {
    g_focus = is_focused;
    if(!is_focused && p.s_search) {
		sL.on_focus(is_focused)
        window.Repaint();
    };
};

function get_colors() {
	get_colors_global();
    if (properties.darklayout) {
		colors.normal_txt = GetGrey(180);				
		colors.btn_inactive_opacity = 140;
		colors.inactive_txt = GetGrey(140);

        colors.node_bg = GetGrey(0);
		colors.node_outline = GetGrey(255, 100);
		colors.node_icon = GetGrey(200);
		colors.node_icon_soft = GetGrey(180);

        colors.node_bg_bold = GetGrey(255,230);
		colors.first_level_track = GetGrey(255,150);
		colors.node_outline_bold = GetGrey(255, 0);
		colors.node_icon_bold = GetGrey(0);


        colors.grad_bottom_1 = GetGrey(0, 150);
        colors.grad_bottom_2 = GetGrey(0, 0);
        colors.fading_bottom_height = 50;

		colors.settings_hover_bg = GetGrey(255,40);
    } else {
		colors.normal_txt = GetGrey(0);		
		colors.btn_inactive_opacity = 110;
		colors.inactive_txt = colors.faded_txt;

        colors.node_bg = GetGrey(255,180);
		colors.node_outline = GetGrey(50, 80);
		colors.node_icon = GetGrey(40);
		colors.node_icon_soft = GetGrey(90);

        colors.node_bg_bold = GetGrey(0,180);
		colors.first_level_track = GetGrey(0,90);
		colors.node_outline_bold = GetGrey(50, 0);
		colors.node_icon_bold = GetGrey(255);

        colors.grad_bottom_1 = GetGrey(0, 10);
        colors.grad_bottom_2 = GetGrey(0, 0);
        colors.fading_bottom_height = 30;

        if (properties.showwallpaper) {
            colors.headerbar_line = GetGrey(0, 40);
        }

		colors.settings_hover_bg = GetGrey(230);
    }
};
var images = Array();
function get_images() {
	var gb;
	var w = 18;

	if(properties.darklayout) icon_theme_subfolder = "\\white";
	else icon_theme_subfolder = "";

	if(properties.darklayout) {
		images.playing_playlist = gdi.Image(theme_img_path + "\\graphic_browser\\now_playing_progress1.png");
	} else {
		images.playing_playlist = gdi.Image(theme_img_path + "\\graphic_browser\\now_playing_track1.png");
	}

	images.search_icon = gdi.Image(theme_img_path + "\\icons"+icon_theme_subfolder+"\\search_icon.png");

	images.settings_off = gdi.CreateImage(23, 23);
	gb = images.settings_off.GetGraphics();
		gb.SetSmoothingMode(0);
		/*gb.FillSolidRect(7,7,9,1,colors.normal_txt);
		gb.FillSolidRect(7,10,9,1,colors.normal_txt);
		gb.FillSolidRect(7,13,9,1,colors.normal_txt);	*/
		gb.FillSolidRect(6,11,2,2,colors.faded_txt);
		gb.FillSolidRect(11,11,2,2,colors.faded_txt);
		gb.FillSolidRect(16,11,2,2,colors.faded_txt);
	images.settings_off.ReleaseGraphics(gb);

	images.settings_hover = gdi.CreateImage(23, 23);
	gb = images.settings_hover.GetGraphics();
		gb.SetSmoothingMode(2);
		gb.FillEllipse(0,0,23,23,colors.settings_hover_bg);
		gb.SetSmoothingMode(0);
		/*gb.FillSolidRect(7,7,9,1,colors.normal_txt);
		gb.FillSolidRect(7,10,9,1,colors.normal_txt);
		gb.FillSolidRect(7,13,9,1,colors.normal_txt);*/
		gb.FillSolidRect(6,11,2,2,colors.normal_txt);
		gb.FillSolidRect(11,11,2,2,colors.normal_txt);
		gb.FillSolidRect(16,11,2,2,colors.normal_txt);
	images.settings_hover.ReleaseGraphics(gb);

	images.resetIcon_off = gdi.CreateImage(w, w);
	gb = images.resetIcon_off.GetGraphics();
		gb.SetSmoothingMode(2);
		gb.DrawLine(5, 5, w-5, w-5, 1.0, colors.normal_txt);
		gb.DrawLine(5, w-5, w-5, 5, 1.0, colors.normal_txt);
		gb.SetSmoothingMode(0);
	images.resetIcon_off.ReleaseGraphics(gb);

	images.resetIcon_ov = gdi.CreateImage(w, w);
	gb = images.resetIcon_ov.GetGraphics();
		gb.SetSmoothingMode(2);
		gb.DrawLine(4, 4, w-4, w-4, 1.0, colors.normal_txt);
		gb.DrawLine(4, w-4, w-4, 4, 1.0, colors.normal_txt);
		gb.SetSmoothingMode(0);
	images.resetIcon_ov.ReleaseGraphics(gb);

	images.resetIcon_dn = gdi.CreateImage(w, w);
	gb = images.resetIcon_dn.GetGraphics();
		gb.SetSmoothingMode(2);
		gb.DrawLine(4, 4, w-4, w-4, 1.0, colors.reseticon_down);
		gb.DrawLine(4, w-4, w-4, 4, 1.0, colors.reseticon_down);
		gb.SetSmoothingMode(0);
	images.resetIcon_dn.ReleaseGraphics(gb);

	reset_bt = new button(images.resetIcon_off, images.resetIcon_ov, images.resetIcon_dn,"reset_bt", "Reset filter");
};
function on_notify_data(name, info) {
    switch(name) {
        case "use_ratings_file_tags":
            globalProperties.use_ratings_file_tags = info;
            window.SetProperty("GLOBAL use ratings in file tags", globalProperties.use_ratings_file_tags);
            window.Reload();
		break;
		case "showInLibrary_RightPlaylistOn":
			properties.showInLibrary_RightPlaylistOn = info;
			window.SetProperty("MAINPANEL adapt now playing to left menu righ playlist on", properties.showInLibrary_RightPlaylistOn);
			setShowInLibrary();
		break;
		case "showInLibrary_RightPlaylistOff":
			properties.showInLibrary_RightPlaylistOff = info;
			window.SetProperty("MAINPANEL adapt now playing to left menu righ playlist off", properties.showInLibrary_RightPlaylistOff);
			setShowInLibrary();
		break;
		case "album_customGroup_label":
			properties.album_customGroup_label = info;
			window.SetProperty("_DISPLAY: album customGroup name", properties.album_customGroup_label);
			g_tagswitcherbar.on_init();
		break;
		case "genre_customGroup_label":
			properties.genre_customGroup_label = info;
			window.SetProperty("_DISPLAY: genre customGroup name", properties.genre_customGroup_label);
			g_tagswitcherbar.on_init();
		break;
		case "artist_customGroup_label":
			properties.artist_customGroup_label = info;
			window.SetProperty("_DISPLAY: artist customGroup name", properties.artist_customGroup_label);
			g_tagswitcherbar.on_init();
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
			p.showFiltersTogglerBtn=info;
			window.SetProperty("_PROPERTY: show filters toggler btn", p.showFiltersTogglerBtn);
			window.Repaint();
		break;
        case "FocusOnNowPlayingForce":
			if(window.IsVisible) pop.showNowPlaying(false);
        break;
		case "set_font":
			globalProperties.fontAdjustement = info;
			window.SetProperty("GLOBAL Font Adjustement", globalProperties.fontAdjustement);
			on_font_changed();
			window.Repaint();
		break;
		case"library_dark_theme":
			properties.darklayout = info;
			window.SetProperty("_DISPLAY: Dark layout", properties.darklayout);
			on_colours_changed();
			window.Repaint();
		break;
        case "WSH_panels_reload":
			window.Reload();
            break;
        case "refresh_filters":
			if(window.IsVisible){
				lib.populate_from_active_playlist = true;
				lib.update('on_notify_refresh_filters');
			}
            break;
        case "reset_filters":
			if(window.IsVisible) lib.update('on_notify_reset_filters');
			else set_update_function("lib.update('on_notify_reset_filters')");
            break;
		case "layout_state":
			layout_state.value=info;
		break;
		case "nowplayinglib_state":
			nowplayinglib_state.value=info;
			setShowInLibrary();
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
		break;
		case "rating_updated":
			g_avoid_on_metadb_changed=true;
		break;
		case "librarytree":
			librarytree.value=info;
		break;
		case "wallpaperVisibilityGlobal":
		case "wallpaperVisibility":
			if(window.IsVisible || name=="wallpaperVisibilityGlobal") toggleWallpaper(info);
		break;
		case "wallpaperBlurGlobal":
		case "wallpaperBlur":
			if(window.IsVisible || name=="wallpaperBlurGlobal") toggleBlurWallpaper(info);
		break;
    };
};
//=================================================// Cover Tools
function toggleWallpaper(wallpaper_state){
	wallpaper_state = typeof wallpaper_state !== 'undefined' ? wallpaper_state : !properties.showwallpaper;
	properties.showwallpaper = wallpaper_state;
	window.SetProperty("_DISPLAY: Show Wallpaper", properties.showwallpaper);
	on_colours_changed();
	if(properties.showwallpaper || properties.darklayout) {
		g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.IsPlaying ? fb.GetNowPlaying() : null);
	};
	window.Repaint();
}
function toggleBlurWallpaper(wallpaper_blur_state){
	wallpaper_blur_state = typeof wallpaper_blur_state !== 'undefined' ? wallpaper_blur_state : !properties.wallpaperblurred;
	properties.wallpaperblurred = wallpaper_blur_state;
	on_colours_changed();
	window.SetProperty("_DISPLAY: Wallpaper Blurred", properties.wallpaperblurred);
	if(fb.IsPlaying) g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
	window.Repaint();
}
function on_init() {
	get_font();
    get_colors();
	get_images();
	g_tooltip = new oTooltip('ui');
	g_cursor = new oCursor();
	g_tagswitcherbar = new oTagSwitcherBar();	
	g_resizing = new Resizing("libraryfilter",false,true,g_tagswitcherbar.default_height);
	ui = new userinterface();
	sbar = new scrollbar();
	p = new panel_operations();
	v = new v_keys();
	lib = new library_manager();
	pop = new populate();
	sL = new searchLibrary();
	jS = new j_Search();
	but = new button_manager();
	men = new menu_object();
	pman = new oPlaylistManager("pman");
	pman.populate(exclude_active = false, reset_scroll = true);
	timer = new oTimers();
	timer.lib('on_init');



	if (timer.init === 0) {
		lib.get_library();
		lib.rootNodes();
	}
    if(fb.IsPlaying) playing_track_playcount = TF.play_count.Eval();
};
on_init();