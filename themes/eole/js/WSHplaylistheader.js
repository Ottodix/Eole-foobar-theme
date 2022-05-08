var properties = {
	panelName: 'WSHplaylistheader',
	darklayout: window.GetProperty("_DISPLAY: Dark layout", false),
	displayToggleBtns: window.GetProperty("_DISPLAY: Toggle buttons", true),
	savedFilterState: window.GetProperty("_PROPERTY: Saved filter state", -1),
    filtred_playlist_idx: window.GetProperty("_PROPERTY: filtred playlist idx", -1),		
	panelFontAdjustement: -1
}

var b_img;
var ww = 0, wh = 0;
var g_avoid_on_playlist_items_removed = false;
var settings_off,settings_hover;
var showTitleTooltip = false;
var g_pinfo = null;
var margin_left=25;
var rightpadding=6;

var black_images = {
	playlist_increase_icon : gdi.Image(theme_img_path + "\\icons\\playlist_increase.png"),
	playlist_increase_hover_icon : gdi.Image(theme_img_path + "\\icons\\playlist_increase_hover.png"),
	playlist_decrease_icon : gdi.Image(theme_img_path + "\\icons\\playlist_decrease_icon.png"),
	playlist_decrease_hover_icon : gdi.Image(theme_img_path + "\\icons\\playlist_decrease_hover_icon.png"),

	nowplaying_off_icon : gdi.Image(theme_img_path + "\\icons\\nowplaying_off.png"),
	nowplaying_off_hover_icon : gdi.Image(theme_img_path + "\\icons\\nowplaying_off_hover.png"),
	nowplaying_on_icon : gdi.Image(theme_img_path + "\\icons\\nowplaying_on.png"),
	nowplaying_on_hover_icon : gdi.Image(theme_img_path + "\\icons\\nowplaying_on_hover.png")
}
var white_images = {
	playlist_increase_icon : gdi.Image(theme_img_path + "\\icons\\white\\playlist_increase.png"),
	playlist_increase_hover_icon : gdi.Image(theme_img_path + "\\icons\\white\\playlist_increase_hover.png"),
	playlist_decrease_icon : gdi.Image(theme_img_path + "\\icons\\white\\playlist_decrease_icon.png"),
	playlist_decrease_hover_icon : gdi.Image(theme_img_path + "\\icons\\white\\playlist_decrease_hover_icon.png"),

	nowplaying_off_icon : gdi.Image(theme_img_path + "\\icons\\white\\nowplaying_off.png"),
	nowplaying_off_hover_icon : gdi.Image(theme_img_path + "\\icons\\white\\nowplaying_off_hover.png"),
	nowplaying_on_icon : gdi.Image(theme_img_path + "\\icons\\white\\nowplaying_on.png"),
	nowplaying_on_hover_icon : gdi.Image(theme_img_path + "\\icons\\white\\nowplaying_on_hover.png")
}



function setSettingsBtn() {
	settings_off = gdi.CreateImage(23, 23);
	gb = settings_off.GetGraphics();
		gb.SetSmoothingMode(0);
		/*gb.FillSolidRect(7,7,10,1,colors.normal_txt);
		gb.FillSolidRect(7,10,10,1,colors.normal_txt);
		gb.FillSolidRect(7,13,10,1,colors.normal_txt);
		gb.FillSolidRect(7,16,10,1,colors.normal_txt);*/
		gb.FillSolidRect(11,6,2,2,colors.faded_txt);
		gb.FillSolidRect(11,11,2,2,colors.faded_txt);
		gb.FillSolidRect(11,16,2,2,colors.faded_txt);
	settings_off.ReleaseGraphics(gb);

	settings_hover = gdi.CreateImage(23, 23);
	gb = settings_hover.GetGraphics();
		gb.SetSmoothingMode(2);
		gb.FillEllipse(0,0,23,23,colors.settings_hover_bg);
		gb.SetSmoothingMode(0);
		/*gb.FillSolidRect(7,7,10,1,colors.normal_txt);
		gb.FillSolidRect(7,10,10,1,colors.normal_txt);
		gb.FillSolidRect(7,13,10,1,colors.normal_txt);
		gb.FillSolidRect(7,16,10,1,colors.normal_txt);*/
		gb.FillSolidRect(11,6,2,2,colors.normal_txt);
		gb.FillSolidRect(11,11,2,2,colors.normal_txt);
		gb.FillSolidRect(11,16,2,2,colors.normal_txt);
	settings_hover.ReleaseGraphics(gb);
}
function get_colors() {
	get_colors_global();
	if(properties.darklayout){
		//colors.normal_txt = GetGrey(180);			
		colors.settings_hover_bg = GetGrey(255,40);
		colors.headerbar_line = GetGrey(51);
	} else {
		//colors.normal_txt = GetGrey(0);			
		colors.settings_hover_bg = GetGrey(230);
	}
	setSettingsBtn();
} get_colors();
buttons = {
    Settings: new SimpleButton(0, 8, 21, 21, "Settings", "Settings...", function () {
        if(plman.PlaylistItemCount(plman.ActivePlaylist)>0) draw_menu(buttons.Settings.x+25,buttons.Settings.y+25);
    },false,settings_off,settings_hover,ButtonStates.normal),
    filtersToggle: new SimpleButton(18, 8, 50, 21, "filtersToggle", "Extend filters", function () {
		if(filters_panel_state.isMaximumValue()) filters_panel_state.decrement(1);
		else filters_panel_state.increment(1);
		positionButtons();
		window.Repaint();
    },function () {
		filters_panel_state.setValue(filters_panel_state.max_value);
		positionButtons();
		window.Repaint();
    },black_images.playlist_decrease_icon,black_images.playlist_decrease_hover_icon,ButtonStates.normal,224),
    /*NowPlayingToggle: new SimpleButton(18, 8, 35, 21, "NowPlayingToggle", function () {
		nowplayingplaylist_state.toggleValue();
    },false,black_images.nowplaying_on_icon,black_images.nowplaying_on_hover_icon,ButtonStates.normal,224)*/
}

function positionButtons(){
	buttons.filtersToggle.x=ww-38;
	//buttons.NowPlayingToggle.x=ww-84;
	buttons.Settings.x=ww-40;

	if(properties.darklayout){
		/*if(nowplayingplaylist_state.isActive()){
			buttons.NowPlayingToggle.N_img = white_images.nowplaying_on_icon
			buttons.NowPlayingToggle.H_img = white_images.nowplaying_on_hover_icon
		} else {
			buttons.NowPlayingToggle.N_img = white_images.nowplaying_off_icon
			buttons.NowPlayingToggle.H_img = white_images.nowplaying_off_hover_icon
		}	*/

		buttons.filtersToggle.N_img = white_images.playlist_decrease_icon;
		buttons.filtersToggle.H_img = white_images.playlist_decrease_hover_icon;

		buttons.Settings.N_img = settings_off
		buttons.Settings.H_img = settings_hover
	} else {
		/*if(nowplayingplaylist_state.isActive()){
			buttons.NowPlayingToggle.N_img = black_images.nowplaying_on_icon
			buttons.NowPlayingToggle.H_img = black_images.nowplaying_on_hover_icon
		} else {
			buttons.NowPlayingToggle.N_img = black_images.nowplaying_off_icon
			buttons.NowPlayingToggle.H_img = black_images.nowplaying_off_hover_icon
		}	*/

		buttons.filtersToggle.N_img = black_images.playlist_decrease_icon;
		buttons.filtersToggle.H_img = black_images.playlist_decrease_hover_icon;

		buttons.Settings.N_img = settings_off
		buttons.Settings.H_img = settings_hover
	}
	if(!properties.displayToggleBtns){
		buttons.filtersToggle.changeState(ButtonStates.hide);
		//buttons.NowPlayingToggle.changeState(ButtonStates.hide);
		buttons.Settings.changeState(ButtonStates.normal);
	} else {
		buttons.filtersToggle.changeState(ButtonStates.normal);
		//buttons.NowPlayingToggle.changeState(ButtonStates.normal);
		buttons.Settings.changeState(ButtonStates.hide);
	}
}

//=================================================// Titleformat field
var TF = {
	genre: "$if(%length%,%Genre%,'Stream')",
	artist: "$if(%length%,%artist%,'Stream')",
	album: "$if2(%album% ['('%date%')'],$if(%length%,'Single','Web radios'))",
	date: "$if2($year(%date%),)",
}
TF.genre_artist_album_date = TF.genre + ' ^^ ' + TF.artist + ' ^^ ' + TF.album + ' ^^ ' + TF.date;

for (var t in TF)
	if(TF.hasOwnProperty(t))
		TF[t] = fb.TitleFormat(TF[t]);

var timers = {
	callback_avoid_populate:false
}
//Mouse events
var cur_btn = null;
var g_down = false;

function SimpleButton(x, y, w, h, text, tooltip_text, fonClick, fonDbleClick, N_img, H_img, state,opacity) {
    this.state = state ? state : ButtonStates.normal;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.text = text;
    this.tooltip_text = tooltip_text;
    this.fonClick = fonClick;
    this.fonDbleClick = fonDbleClick;
    this.N_img = N_img;
    this.H_img = H_img;
	this.opacity = opacity;
	if (typeof opacity == "undefined") this.opacity = 255;
	else this.opacity = opacity;
	this.tooltip_activated = false;
    this.containXY = function (x, y) {
        return (this.x <= x) && (x <= this.x + this.w) && (this.y <= y) && (y <= this.y + this.h);
    }
    this.changeState = function (state) {
        var old_state = this.state;
        this.state = state;
		if(old_state!=ButtonStates.hover && this.state==ButtonStates.hover) g_cursor.setCursor(IDC_HAND, this.text);
		else g_cursor.setCursor(IDC_ARROW,39);
        return old_state;
    }
    this.draw = function (gr) {
        if (this.state == ButtonStates.hide) return;
        b_img=this.N_img;
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
        switch (this.state)
        {
        case ButtonStates.hover:
        default:
			gr.DrawImage(b_img, this.x, this.y, b_img.Width, b_img.Height, 0, 0, b_img.Width, b_img.Height,0,this.opacity);
            break;
        }

    }

    this.onClick = function () {
        this.fonClick && this.fonClick();
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
					var tooltip_text = this.tooltip_text;
					g_tooltip.ActivateDelay(tooltip_text, x+10, y+20, globalProperties.tooltip_button_delay, 1200, false, this.text);
					this.tooltip_activated = true;
				} else if(this.tooltip_activated && this.state!=ButtonStates.hover && g_tooltip.activeZone == this.text){
					this.tooltip_activated = false;
					g_tooltip.Deactivate();
				}
			break;
		}
    }
}
function draw_settings_menu(x, y) {
    var basemenu = window.CreatePopupMenu();
	if (typeof x == "undefined") x=20;
	if (typeof y == "undefined") y=29;

    if(!nowplayingplaylist_state.isActive()) basemenu.AppendMenuItem(MF_STRING, 4999, "Show right playlist");
	else basemenu.AppendMenuItem(MF_STRING, 4999, "Hide right playlist");
    if(!filters_panel_state.isMaximumValue()) basemenu.AppendMenuItem(MF_STRING, 4996, "Hide bottom playlist");
	else {basemenu.AppendMenuItem(MF_STRING, 4996, "Show bottom playlist");}

	var FiltersMenu = window.CreatePopupMenu();
	FiltersMenu.AppendTo(basemenu, MF_STRING, "Filters");

	if(filters_panel_state.isActive())
		FiltersMenu.AppendMenuItem(MF_STRING, 4990, "Hide");
	else
		FiltersMenu.AppendMenuItem(MF_STRING, 4988, "Show");

	FiltersMenu.AppendMenuItem((filters_panel_state.isActive())? MF_STRING : MF_GRAYED, 4991, "Decrease height");
	FiltersMenu.AppendMenuItem(MF_STRING, 4992, "Increase height");

	FiltersMenu.AppendMenuSeparator();
	FiltersMenu.AppendMenuItem((filters_panel_state.isActive() ? MF_STRING : MF_GRAYED | MF_DISABLED), 4993, "Enable 1st filter");
	FiltersMenu.CheckMenuItem(4993, (filter1_state.isActive()));
	FiltersMenu.AppendMenuItem((filters_panel_state.isActive() ? MF_STRING : MF_GRAYED | MF_DISABLED), 4994, "Enable 2nd filter");
	FiltersMenu.CheckMenuItem(4994, (filter2_state.isActive()));
	FiltersMenu.AppendMenuItem((filters_panel_state.isActive() ? MF_STRING : MF_GRAYED | MF_DISABLED), 4995, "Enable 3rd filter");
	FiltersMenu.CheckMenuItem(4995, (filter3_state.isActive()));

	basemenu.AppendMenuSeparator();
	basemenu.AppendMenuItem(MF_STRING, 4989, "Show toggle buttons");
	basemenu.CheckMenuItem(4989, properties.displayToggleBtns);

    idx = 0;
    idx = basemenu.TrackPopupMenu(x, y, 0x0008);

    switch (true) {
    case (idx == 4989):
		properties.displayToggleBtns=!properties.displayToggleBtns;
        window.NotifyOthers("display_toggle_buttons",properties.displayToggleBtns);
		window.SetProperty("_DISPLAY: Toggle buttons", properties.displayToggleBtns);
		positionButtons();
        window.Repaint();
        break;
    case (idx == 4988):
		if(properties.savedFilterState>=0 && !properties.displayToggleBtns) filters_panel_state.setValue(properties.savedFilterState);
		else filters_panel_state.setValue(1);
		positionButtons();
		window.Repaint();
        break;
    case (idx == 4990):
		saveFilterState();
		filters_panel_state.setValue(0);
		positionButtons();
		window.Repaint();
        break;
    case (idx == 4991):
		filters_panel_state.decrement(1);
		positionButtons();
		window.Repaint();
        break;
    case (idx == 4992):
		filters_panel_state.increment(1);
		positionButtons();
		window.Repaint();
        break;
    case (idx == 4993):
		if(!filter2_state.isActive() && !filter3_state.isActive()) filters_panel_state.setValue(0);
		else filter1_state.toggleValue();
		positionButtons();
		window.Repaint();
        break;
    case (idx == 4994):
		if(!filter1_state.isActive() && !filter3_state.isActive()) filters_panel_state.setValue(0);
		else filter2_state.toggleValue();
		positionButtons();
		window.Repaint();
        break;
    case (idx == 4995):
		if(!filter1_state.isActive() && !filter2_state.isActive()) filters_panel_state.setValue(0);
		else filter3_state.toggleValue();
		positionButtons();
		window.Repaint();
        break;
    case (idx == 4996):
		saveFilterState();
		filters_panel_state.setValue(filters_panel_state.max_value);
		positionButtons();
		window.Repaint();
        break;
    case (idx == 4999):
		nowplayingplaylist_state.toggleValue();
		positionButtons();
		window.Repaint();
        break;
    }
    basemenu = undefined;
    if(typeof genrePopupMenu != "undefined") genrePopupMenu = undefined;
    if (typeof SortMenu != "undefined") SortMenu = undefined;
	FiltersMenu = undefined;
}
function draw_menu(x, y) {
    var basemenu = window.CreatePopupMenu();
	if (typeof x == "undefined") x=20;
	if (typeof y == "undefined") y=29;
	var panelsMenu = window.CreatePopupMenu();

    if(!nowplayingplaylist_state.isActive()) panelsMenu.AppendMenuItem(MF_STRING, 4999, "Show right playlist");
	else panelsMenu.AppendMenuItem(MF_STRING, 4999, "Hide right playlist");
    if(!filters_panel_state.isMaximumValue()) panelsMenu.AppendMenuItem(MF_STRING, 4996, "Hide bottom playlist");
	else panelsMenu.AppendMenuItem(MF_STRING, 4996, "Show bottom playlist");

	var FiltersMenu = window.CreatePopupMenu();
	if(filters_panel_state.isActive())
		FiltersMenu.AppendMenuItem(MF_STRING, 4990, "Hide");
	else
		FiltersMenu.AppendMenuItem(MF_STRING, 4988, "Show");

	FiltersMenu.AppendMenuItem((filters_panel_state.isActive())? MF_STRING : MF_GRAYED, 4991, "Decrease height");
	FiltersMenu.AppendMenuItem(MF_STRING, 4992, "Increase height");

	FiltersMenu.AppendMenuSeparator();
	FiltersMenu.AppendMenuItem((filters_panel_state.isActive() ? MF_STRING : MF_GRAYED | MF_DISABLED), 4993, "Enable 1st filter");
	FiltersMenu.CheckMenuItem(4993, (filter1_state.isActive()));
	FiltersMenu.AppendMenuItem((filters_panel_state.isActive() ? MF_STRING : MF_GRAYED | MF_DISABLED), 4994, "Enable 2nd filter");
	FiltersMenu.CheckMenuItem(4994, (filter2_state.isActive()));
	FiltersMenu.AppendMenuItem((filters_panel_state.isActive() ? MF_STRING : MF_GRAYED | MF_DISABLED), 4995, "Enable 3rd filter");
	FiltersMenu.CheckMenuItem(4995, (filter3_state.isActive()));
	FiltersMenu.AppendTo(panelsMenu, MF_STRING, "Filters");

	panelsMenu.AppendMenuSeparator();
	panelsMenu.AppendMenuItem(MF_STRING, 4989, "Show toggle buttons");
	panelsMenu.CheckMenuItem(4989, properties.displayToggleBtns);
	panelsMenu.AppendTo(basemenu, MF_STRING, "Panels position");

	if(!plman.IsAutoPlaylist(plman.ActivePlaylist)){
		basemenu.AppendMenuSeparator();
		var SortMenu = window.CreatePopupMenu(); //Custom Entries
		SortMenu.AppendTo(basemenu, MF_STRING, "Sort By");

		SortMenu.AppendMenuItem(MF_STRING, 3001, "Artist / Album / Tracknumber");
		SortMenu.AppendMenuItem(MF_STRING, 3003, "Title");
		SortMenu.AppendMenuItem(MF_STRING, 3004, "Tracknumber");
		SortMenu.AppendMenuSeparator();
		SortMenu.AppendMenuItem(MF_STRING, 3002, "Randomize");
	}
    basemenu.AppendMenuSeparator();
    basemenu.AppendMenuItem(MF_STRING, 3000, "Select all");
    basemenu.AppendMenuItem(MF_STRING, 2998, "Remove all");
	metadblist_selection = plman.GetPlaylistSelectedItems(plman.ActivePlaylist);
	if(metadblist_selection.Count > 0) {
		var Context = fb.CreateContextMenuManager();
		var Context_root = window.CreatePopupMenu();
		Context_root.AppendTo(basemenu, MF_STRING, "Selection ("+metadblist_selection.Count+" item"+((metadblist_selection.Count>1)?"s":"")+")");
		Context.InitContext(metadblist_selection);
		Context.BuildMenu(Context_root, 2, -1);
		Context_root.AppendMenuItem(MF_STRING, 2997, "Remove");
	}
	basemenu.AppendMenuItem(MF_STRING, 2000, "Tracks properties");


	if(utils.IsKeyPressed(VK_SHIFT)) {
		basemenu.AppendMenuSeparator();
		basemenu.AppendMenuItem(MF_STRING, 5100, "Properties ");
		basemenu.AppendMenuItem(MF_STRING, 5101, "Configure...");
		basemenu.AppendMenuSeparator();
		basemenu.AppendMenuItem(MF_STRING, 5102, "Reload");
	}

    idx = 0;
    idx = basemenu.TrackPopupMenu(x, y, 0x0008);

    switch (true) {
	case(idx > 1 && idx < 800) :
		Context.ExecuteByID(idx - 2);
		 break;
	case (idx == 1999):
		draw_settings_menu(x,y);
		break;
	case (idx == 2000):
		fb.RunContextCommandWithMetadb("Properties", plman.GetPlaylistItems(plman.ActivePlaylist), 0);
		break;
    case (idx == 2997):
		removeItems(metadblist_selection,plman.ActivePlaylist);
		//plman.RemovePlaylistSelection(plman.ActivePlaylist)
        break;
    case (idx == 2998):
		//plman.ClearPlaylist(plman.ActivePlaylist)
        removeItems(false,plman.ActivePlaylist);
        break;
    /*case (idx >= 1 && idx < 999):
        SetGenre(idx-1,plman.GetPlaylistItems(plman.ActivePlaylist));
        break;
    case (idx >= 1000 && idx < 2001):
        SetGenre(idx-1000,plman.GetPlaylistItems(plman.ActivePlaylist));
        break;*/
    case (idx == 2989):
		properties.displayToggleBtns=!properties.displayToggleBtns;
        window.NotifyOthers("display_toggle_buttons",properties.displayToggleBtns);
		window.SetProperty("_DISPLAY: Toggle buttons", properties.displayToggleBtns);
		positionButtons();
        window.Repaint();
        break;
    case (idx == 2988):
		filters_panel_state.setValue(1);
		positionButtons();
		window.Repaint();
        break;
    case (idx == 2990):
		filters_panel_state.setValue(0);
		positionButtons();
		window.Repaint();
        break;
    case (idx == 2991):
		filters_panel_state.decrement(1);
		positionButtons();
		window.Repaint();
        break;
    case (idx == 2992):
		filters_panel_state.increment(1);
		positionButtons();
		window.Repaint();
        break;
    case (idx == 2993):
		if(!filter2_state.isActive() && !filter3_state.isActive()) filters_panel_state.setValue(1);
		else filter1_state.toggleValue();
		positionButtons();
		window.Repaint();
        break;
    case (idx == 2994):
		if(!filter1_state.isActive() && !filter3_state.isActive()) filters_panel_state.setValue(0);
		else filter2_state.toggleValue();
		positionButtons();
		window.Repaint();
        break;
    case (idx == 2995):
		if(!filter1_state.isActive() && !filter2_state.isActive()) filters_panel_state.setValue(0);
		else filter3_state.toggleValue();
		positionButtons();
		window.Repaint();
        break;
    case (idx == 2999):
		nowplayingplaylist_state.toggleValue();
		positionButtons();
		window.Repaint();
        break;
    case (idx == 3000):
        fb.RunMainMenuCommand("Edit/Select all");
        break;
    case (idx == 3001):
        plman.SortByFormat(plman.ActivePlaylist,sort_by_album_artist);
        break;
    case (idx == 3002):
        plman.SortByFormat(plman.ActivePlaylist,"");
        break;
    case (idx == 3003):
        plman.SortByFormat(plman.ActivePlaylist,sort_by_title);
        break;
    case (idx == 3004):
        plman.SortByFormat(plman.ActivePlaylist,sort_by_tracknumber);
        break;
    case (idx == 4989):
		properties.displayToggleBtns=!properties.displayToggleBtns;
        window.NotifyOthers("display_toggle_buttons", properties.displayToggleBtns);
		window.SetProperty("_DISPLAY: Toggle buttons", properties.displayToggleBtns);
		positionButtons();
        window.Repaint();
        break;
    case (idx == 4988):
		if(properties.savedFilterState>=0 && !properties.displayToggleBtns) filters_panel_state.setValue(properties.savedFilterState);
		else filters_panel_state.setValue(1);
		positionButtons();
		window.Repaint();
        break;
    case (idx == 4990):
		saveFilterState();
		filters_panel_state.setValue(0);
		positionButtons();
		window.Repaint();
        break;
    case (idx == 4991):
		filters_panel_state.decrement(1);
		positionButtons();
		window.Repaint();
        break;
    case (idx == 4992):
		filters_panel_state.increment(1);
		positionButtons();
		window.Repaint();
        break;
    case (idx == 4993):
		if(!filter2_state.isActive() && !filter3_state.isActive()) filters_panel_state.setValue(0);
		else filter1_state.toggleValue();
		positionButtons();
		window.Repaint();
        break;
    case (idx == 4994):
		if(!filter1_state.isActive() && !filter3_state.isActive()) filters_panel_state.setValue(0);
		else filter2_state.toggleValue();
		positionButtons();
		window.Repaint();
        break;
    case (idx == 4995):
		if(!filter1_state.isActive() && !filter2_state.isActive()) filters_panel_state.setValue(0);
		else filter3_state.toggleValue();
		positionButtons();
		window.Repaint();
        break;
    case (idx == 4996):
		saveFilterState();
		filters_panel_state.setValue(filters_panel_state.max_value);
		positionButtons();
		window.Repaint();
        break;
    case (idx == 4999):
		nowplayingplaylist_state.toggleValue();
		positionButtons();
		window.Repaint();
        break;
    case (idx == 5100):
        window.ShowProperties();
        break;
    case (idx == 5101):
        window.ShowConfigure();
        break;
    case (idx == 5102):
        window.Reload();
        break;
    }
    basemenu = undefined;
    if(typeof genrePopupMenu != "undefined") genrePopupMenu = undefined;
    if (typeof SortMenu != "undefined") SortMenu = undefined;
	if (typeof FiltersMenu != "undefined") FiltersMenu = undefined;
}
function on_mouse_rbtn_up(x, y){
		draw_menu(x,y);
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
function saveFilterState(){
	properties.savedFilterState = filters_panel_state.value;
	window.SetProperty("_PROPERTY: Saved filter state", properties.savedFilterState);
	window.NotifyOthers("save_filter_state",properties.savedFilterState);
}

// START

playlistInfo = function(){
	this.selected_count = 0;
	this.refresh_needed = 0;
	this.populate = function() {
		this.playlist_name=plman.GetPlaylistName(plman.ActivePlaylist);
		this.plist_items = plman.GetPlaylistItems(plman.ActivePlaylist);
		this.items_count=this.plist_items.Count;
		if(this.items_count==0) {this.time_txt=""; this.setTexts(); return;}
		if(this.playlist_name!=globalProperties.playing_playlist && this.playlist_name!=globalProperties.selection_playlist && this.playlist_name!=globalProperties.filter_playlist) {
			i=0;this.totalTime=0;
			while(i < this.items_count) {this.totalTime+=this.plist_items[i].Length; i++;}
			this.setTexts(); return;
		}

		multiples_genres=false;
		multiples_artist=false;
		multiples_albums=false;
		multiples_dates=false;

		this.genres="";
		this.artists="";
		this.albums="";
		this.dates="";
		this.totalTime=this.plist_items[0].Length;

		all_metas = TF.genre_artist_album_date.EvalWithMetadb(this.plist_items[0]).split(" ^^ ");

		this.genres = all_metas[0];
		this.artists = all_metas[1];
		this.albums = all_metas[2];
		this.dates = all_metas[3];

		i=1;
		while(i < this.items_count){

			if(!multiples_genres){
				genre_name=TF.genre.EvalWithMetadb(this.plist_items[i]);
				if(this.genres!=genre_name) multiples_genres=true;
			}
			if(!multiples_artist){
				artist_name=TF.artist.EvalWithMetadb(this.plist_items[i]);
				if(this.artists.toLowerCase()!=artist_name.toLowerCase()) multiples_artist=true;
			}
			if(!multiples_albums){
				album_name=TF.album.EvalWithMetadb(this.plist_items[i]);
				if(this.albums.toLowerCase()!=album_name.toLowerCase()) multiples_albums=true;
			}
			if(!multiples_dates){
				album_date=TF.date.EvalWithMetadb(this.plist_items[i]);
				if(this.dates!=album_date) multiples_dates=true;
			}

			this.totalTime+=this.plist_items[i].Length;
			i++;
		}

		if(multiples_genres) {
			this.genres="";
		}
		if(multiples_artist) {
			this.artists="";
		}
		if(multiples_albums) {
			this.albums="";
		}
		if(multiples_dates) {
			this.dates="";
		}
		this.setTexts();
		this.plist_items = undefined;
	}
	this.setTexts = function() {
		this.time_txt="";

		if(this.selected_count>1) {
			var timetodraw = this.selected_time;
			var displayed_count = this.selected_count;
		} else {
			var timetodraw = this.totalTime;
			var displayed_count = this.items_count;
		}
		if(displayed_count>0) {
			
			totalMth=Math.floor(timetodraw/2592000); r_timetodraw=timetodraw-totalMth*2592000;
			totalW=Math.floor(r_timetodraw/604800); r_timetodraw=r_timetodraw-totalW*604800;
			totalD=Math.floor(r_timetodraw/86400); r_timetodraw=r_timetodraw-totalD*86400;
			totalH=Math.floor(r_timetodraw/3600); r_timetodraw=r_timetodraw-totalH*3600;
			totalM=Math.floor(r_timetodraw/60); r_timetodraw=r_timetodraw-totalM*60;
			totalS=Math.round(r_timetodraw);
			totalS=(totalS>9) ? totalS:'0'+totalS;

			txt_month=(totalMth>1)?totalMth+'months, ':totalMth+'month, ';
			txt_week=(totalW>1)?totalW+'weeks, ':totalW+'week, ';if(totalW==0) txt_week='';
			txt_day=(totalD>1)?totalD+'days, ':totalD+'day, '; if(totalD==0) txt_day='';
			txt_hour=(totalH>1)?totalH+'hours, ':totalH+'hour, '; if(totalH==0) txt_hour='';
			if(totalMth>0) this.time_txt=txt_month+txt_week+txt_day+txt_hour+totalM+'min ';
			else if (totalW>0) this.time_txt=txt_week+txt_day+txt_hour+totalM+'min ';
			else if (totalD>0) this.time_txt=txt_day+txt_hour+totalM+'min ';
			else if (totalH>0) this.time_txt=txt_hour+totalM+'min, '+totalS+'sec';
			else this.time_txt=totalM+'min, '+totalS+'sec';
			this.items_txt=displayed_count+' items';

			// Main Text, Left justified
			var filtered_playlist = "";
			if(this.playlist_name==globalProperties.filter_playlist && properties.filtred_playlist_idx>-1){
				var filtered_playlist = plman.GetPlaylistName(properties.filtred_playlist_idx);
			}
			if(filtered_playlist!="" && filtered_playlist!=globalProperties.selection_playlist){				
				this.main_txt='Playlist : '+plman.GetPlaylistName(properties.filtred_playlist_idx)+' (Filtered)';	
			} else if(this.playlist_name!=globalProperties.playing_playlist && this.playlist_name!=globalProperties.selection_playlist && this.playlist_name!=globalProperties.filter_playlist){
				this.main_txt='Playlist : '+this.playlist_name;
			} else if(this.albums!=""){
				if(this.artists!="") this.main_txt=this.albums+' - '+this.artists
				else this.main_txt='Various Artists - '+this.albums;
			} else if(this.artists!="") {
				this.main_txt=this.artists+' - Several Albums';
			} else if(this.genres!="") {
				this.main_txt=this.genres;
			} else if(this.dates!="") {
				this.main_txt="Date : "+this.dates;
			} else if(this.playlist_name==globalProperties.playing_playlist || this.playlist_name==globalProperties.selection_playlist){
				this.main_txt='Mixed selection';
			} else {
				this.main_txt='Playlist : '+this.playlist_name;
			}

		} else {
			this.main_txt='Playlist : '+this.playlist_name;
			this.items_txt='Empty Playlist';
		}
		this.items_width = -1;
		this.main_txt_width = -1;
	}
	this.refresh = function(populate_list,call_id) {
		console.log("--> refresh MainPlaylist Header populate_list:"+populate_list+" call_id:"+call_id)
		if(populate_list) {
			this.populate();
		} else {
			if(this.selected_count>1){
				for(i=0;i<this.selected_count;i++){
					this.selected_time+=selected_items[i].Length;
				}
			}
			this.setTexts();
			selected_items = undefined;
			window.Repaint();
		}
	}
	this.selectionChanged = function() {
		var old_selected_count = this.selected_count;
		selected_items = plman.GetPlaylistSelectedItems(plman.ActivePlaylist);
		this.selected_time = 0;
		this.selected_count = selected_items.Count;
		if(this.selected_count>1 || old_selected_count>1 ) g_pinfo.refresh(false,3);
		selected_items = undefined;
	}
}

function on_size(w, h) {
    ww = w;
    wh = h;
	positionButtons();
}

function on_paint(gr) {
	if(g_pinfo.refresh_needed>0) {
		g_pinfo.refresh(true,10+g_pinfo.refresh_needed);
		g_pinfo.refresh_needed = 0;
	}
    gr.FillSolidRect(0,0,ww,wh,colors.normal_bg);

	gr.FillSolidRect(0, wh-1, ww, 1, colors.headerbar_line);

	if(g_pinfo.items_width<0)
		g_pinfo.items_width = gr.CalcTextWidth(g_pinfo.time_txt+' '+g_pinfo.items_txt,g_font.italic);
	if(g_pinfo.main_txt_width<0)
		g_pinfo.main_txt_width = gr.CalcTextWidth(g_pinfo.main_txt,g_font.italicplus2);


	if(properties.displayToggleBtns)
		main_txt_space = ww-70-margin_left-rightpadding-buttons.filtersToggle.w-g_pinfo.items_width;//-buttons.NowPlayingToggle.w
	else
		main_txt_space = ww-70-margin_left-rightpadding-buttons.Settings.w-g_pinfo.items_width;

	if(!properties.displayToggleBtns) time_txt_right_margin = 115;
	else time_txt_right_margin = rightpadding+buttons.filtersToggle.w+59;//+buttons.NowPlayingToggle.w

    gr.GdiDrawText(g_pinfo.main_txt, g_font.italicplus2, colors.normal_txt, margin_left, 1, main_txt_space, wh-2, DT_VCENTER | DT_END_ELLIPSIS | DT_CALCRECT | DT_NOPREFIX);
    gr.GdiDrawText(g_pinfo.time_txt+((g_pinfo.time_txt!="")?",  ":"")+g_pinfo.items_txt, g_font.italic, colors.faded_txt, 53, 0, ww-time_txt_right_margin, wh, DT_VCENTER | DT_END_ELLIPSIS | DT_RIGHT | DT_CALCRECT | DT_NOPREFIX);

	showTitleTooltip = (g_pinfo.main_txt_width >  main_txt_space);

	drawAllButtons(gr);

	//if(nowplayingplaylist_state.isActive()) gr.FillSolidRect(ww-1, 0, 1, wh, colors.sidesline);

	if(filters_panel_state.isActive()) gr.FillSolidRect(0,0,ww,1,colors.headerbar_line);
}
var callback_avoid_populate=false;
function on_playlist_items_added(playlist){
	if(!callback_avoid_populate){
		g_avoid_on_playlist_items_removed=true;
		if(playlist == plman.ActivePlaylist){
			if(window.IsVisible) {
				callback_avoid_populate=true;
				g_pinfo.refresh(true,0);
				window.Repaint();
				g_pinfo.refresh_needed = 0;
				timers.callback_avoid_populate = setTimeout(function() {
					callback_avoid_populate=false;
					clearTimeout(timers.callback_avoid_populate);
				}, 30);
			} else g_pinfo.refresh_needed = 1;
		}
	}
}

function on_playlist_items_removed(playlist){
	if(playlist == plman.ActivePlaylist && !callback_avoid_populate){
		if(window.IsVisible) {
			callback_avoid_populate=true;
			g_pinfo.refresh(true,2);
			window.Repaint();
			g_pinfo.refresh_needed = 0;
			timers.callback_avoid_populate = setTimeout(function() {
				callback_avoid_populate=false;
				clearTimeout(timers.callback_avoid_populate);
			}, 30);
		} else g_pinfo.refresh_needed = 2;
	}
}

function on_playlist_switch(){
	if(window.IsVisible) {
		if(!callback_avoid_populate){
			callback_avoid_populate=true;
			g_pinfo.refresh(true,1);
			window.Repaint();
			g_pinfo.refresh_needed = 0;
			timers.callback_avoid_populate = setTimeout(function() {
				callback_avoid_populate=false;
				clearTimeout(timers.callback_avoid_populate);
			}, 30);
		}
	} else g_pinfo.refresh_needed = 3;
}
function on_playlist_items_selection_change() {
	if(window.IsVisible){
		g_pinfo.selectionChanged();
	} else g_pinfo.refresh_needed = 4;
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
function on_mouse_move(x, y, m) {
	if(g_cursor.x==x && g_cursor.y==y) return;
	g_cursor.onMouse("move", x, y, m);

    var old = cur_btn;
    cur_btn = chooseButton(x, y);

	if(showTitleTooltip){
		if(is_hover_title(x,y))	g_tooltip.ActivateDelay(g_pinfo.main_txt, x+10, y+20, globalProperties.tooltip_delay);
		else g_tooltip.Deactivate();
	}

    if (old == cur_btn) {
		cur_btn && cur_btn.onMouse("move", x, y);
        if (g_down) return;
    } else if (g_down && cur_btn && cur_btn.state != ButtonStates.down) {
		cur_btn.onMouse("move", x, y);
        cur_btn.changeState(ButtonStates.down);
        return;
    } else if(plman.PlaylistItemCount(plman.ActivePlaylist)>0) {
		var repaint = false;
        if(old){
			old.changeState(ButtonStates.normal);
			old.onMouse("move", x, y);
			repaint = true;
		}
        if(cur_btn){
			cur_btn.changeState(ButtonStates.hover);
			cur_btn.onMouse("move", x, y);
			repaint = true;
		}
		else g_tooltip.Deactivate();
        if(repaint) window.Repaint();
    }
}
function is_hover_title(x,y){
	return (x > margin_left && x < margin_left + main_txt_space)
}
function on_mouse_leave() {
	g_cursor.onMouse("leave", -1, -1);
    g_down = false;
	g_tooltip.Deactivate();
    if (cur_btn) {
        cur_btn.changeState(ButtonStates.normal);
		cur_btn.onMouse("leave", -1, -1);
        window.Repaint();
        cur_btn=null;
    }
}
function on_mouse_lbtn_down(x, y) {
    cur_btn_down = chooseButton(x, y);
    if (cur_btn_down && plman.PlaylistItemCount(plman.ActivePlaylist)>0) {
		g_down = true;
        cur_btn_down.changeState(ButtonStates.down);
        window.Repaint();
    }
}
function on_mouse_lbtn_up(x, y) {
    g_down = false;
    cur_btn = chooseButton(x, y);
    if (typeof cur_btn_down === 'object' && cur_btn_down != null) {
        cur_btn_down.onClick();
    }
	if (typeof cur_btn === 'object' && cur_btn != null && plman.PlaylistItemCount(plman.ActivePlaylist)>0) {
        cur_btn.changeState(ButtonStates.hover);
         window.Repaint();
    }
}
function on_mouse_mbtn_down(x, y, mask) {
    fb.RunContextCommandWithMetadb("Properties",plman.GetPlaylistItems(plman.ActivePlaylist));
}
function on_mouse_lbtn_dblclk(x,y){
    plman.ExecutePlaylistDefaultAction(plman.ActivePlaylist,0);
}
var returnGenre_Timer=false;
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
		case "set_font":
			globalProperties.fontAdjustement = info;
			window.SetProperty("GLOBAL Font Adjustement", globalProperties.fontAdjustement),
			get_font();
			window.Repaint();
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
		case "filters_panel_state":
			filters_panel_state.value=info;
			positionButtons();
			window.Repaint();
			timer_repaint = setTimeout(function(){
				window.Repaint();
				clearTimeout(timer_repaint);
				timer_repaint = false;
			},150);			
		break;
		case "save_filter_state":
			properties.savedFilterState = info;
			window.SetProperty("_PROPERTY: Saved filter state", properties.savedFilterState);
			positionButtons();
		break;
		case "filter1_state":
			filter1_state.value=info;
		break;
		case "filter2_state":
			filter2_state.value=info;
		break;
		case "filter3_state":
			filter3_state.value=info;
		break;
		case "main_panel_state":
			main_panel_state.value = info;
		break;
		case"playlists_dark_theme":
			properties.darklayout = info;
			window.SetProperty("_DISPLAY: Dark layout", properties.darklayout);
			get_colors();
			positionButtons();
			window.Repaint();
		break;
		case "refresh_filters":
			if(typeof info[1] !== 'undefined') {
				properties.filtred_playlist_idx = info[1];
				window.SetProperty("_PROPERTY: filtred playlist idx", properties.filtred_playlist_idx);
			} else if(properties.filtred_playlist_idx>-1 && plman.GetPlaylistName(plman.ActivePlaylist)!=globalProperties.filter_playlist) {
				properties.filtred_playlist_idx = -1;
				window.SetProperty("_PROPERTY: filtred playlist idx", properties.filtred_playlist_idx)
			}
		break;			
    };
};
function on_init(){
    get_font();
	g_cursor = new oCursor();
	g_tooltip = new oTooltip();
	g_pinfo = new playlistInfo();
	g_pinfo.refresh_needed = 4;
	positionButtons();
}
on_init();