var colors = {};

var properties = {
	panelName: 'WSHtitle_bar',
    Remember_previous_state: window.GetProperty("Resume panel state on startup, except on visualization tab", false),
    background_color: window.GetProperty("Background color", "255-255-255"),
	fullMode_savedwidth: window.GetProperty("Full mode saved width", 1100),
	fullMode_pmanagerheight: window.GetProperty("Full mode pmanager saved height", 820),
	miniMode_savedwidth: window.GetProperty("Mini mode saved width", 290),
	miniMode_playlistheight: window.GetProperty("Mini mode playlist saved height", 380),
	autosearch: window.GetProperty("_DISPLAY: autosearch", true),
	miniMode_defaultwidth:290,
	miniMode_defaultheight:380,
	fullMode_defaultwidth:1100,
	fullMode_defaultheight:820,
	fullMode_minwidth:600,
	fullMode_minheight:500,
	fullcontrolsHeight:72,
	compactNoTrackcontrolsHeight:47,
	compactcontrolsHeight:54,
	minicontrolsHeight:51,
	miniNoTrackcontrolsHeight:43,
	full_titlebar_height:64,
	minimode_titlebar_height:64,
	compact_titlebar_height:36,
    searchHistory_max_items: window.GetProperty("Max items in search history", 6),
    library_dark_theme: window.GetProperty("LIBRARY dark theme", false),
    playlists_dark_theme: window.GetProperty("PLAYLISTS dark theme", false),
    bio_dark_theme: window.GetProperty("BIO dark theme", false),
	bio_stick2darklayout: window.GetProperty("BIO stick to Dark layout",false),
    visualization_dark_theme: window.GetProperty("VISUALIZATION dark theme", false),
    minimode_dark_theme: window.GetProperty("MINIMODE dark theme", false),
    show_visualization: window.GetProperty("_PROPERTY show visualization tab", true),
	showwallpaper: window.GetProperty("_DISPLAY: Show Wallpaper", false),
    wallpapermode: window.GetProperty("_SYSTEM: Wallpaper Mode", 0),
    wallpaperblurred: window.GetProperty("_DISPLAY: Wallpaper Blurred", true),
    wallpaperblurvalue: window.GetProperty("_DISPLAY: Wallpaper Blur Value", 1.05),
    wallpaperdisplay: window.GetProperty("_DISPLAY: Wallpaper 0=Filling 1=Adjust 2=Stretch", 0),
	darklayout: window.GetProperty("_DISPLAY: Dark layout", false),
	tracktitle_ontop: window.GetProperty("_DISPLAY: Track title", true),
	tracktitle_format: window.GetProperty("_DISPLAY: Track title format", "[%artist%  -  ][%album%[  -  %tracknumber%] : ]%title%[  -  %date%]"),
	showRightSidebarBtn: window.GetProperty("_DISPLAY: show right sidebar btn", true),
	showConfigLayoutBtn: window.GetProperty("_DISPLAY: show configure layout btn", true),	
	showLightswitchBtn: window.GetProperty("_DISPLAY: show light switch btn", true),
	showPanelBtnText: window.GetProperty("_DISPLAY: show panels btn text", true),
	showNowPlayingBtn: window.GetProperty("_DISPLAY: show now playing btn", true),
	showFullscreenBtn: window.GetProperty("_DISPLAY: show fullscreen btn", true),
	LightswitchBtnGlobal: window.GetProperty("_DISPLAY: light switch btn global", true),
	savedFilterState: window.GetProperty("_PROPERTY: Saved filter state", -1),
	SuperCompact_titlebar: window.GetProperty("_PROPERTY: Compactify panels buttons", false),
	panelFontAdjustement: 0,
	toUpperCase: window.GetProperty("_DISPLAY: panels btn text to uppercase", false),
	alwaysShowSearch: window.GetProperty("_DISPLAY: always show search box", true),
	mini_mainmenu_button: window.GetProperty("_DISPLAY: mini main menu button", false),
}
if(globalProperties.deleteDiskCache) {
	delete_full_cache();
}

var scheduler = {
    shutdown_after_current: false,
    shutdown_after_playlist: false,
    hibernate_after_current: false,
    hibernate_after_playlist: false
}
var g_searchbox = null;
var g_fsize=12;
var cSearchBox = {};
var g_genre_cache = null;
var main_panel_btns = null;
var previous_darkvalue = properties.darklayout;

var cSearchBoxMainLight = {
	width:270,
	marginRight:128,
	marginLeft:5,
	marginTop:35,
	marginBottom:0,
	paddingLeft:37,
	paddingRight:40,
	paddingTop:5,
	paddingBottom:6
};
var cSearchBoxCompact = {
	width:270,
	marginRight:190,
	marginLeft:5,
	marginTop:1,
	marginBottom:0,
	paddingLeft:37,
	paddingRight:40,
	paddingTop:5,
	paddingBottom:6
};
var cSearchBoxMainDark = {
	width:270,
	marginRight:128,
	marginLeft:5,
	marginTop:35,
	marginBottom:0,
	paddingLeft:37,
	paddingRight:40,
	paddingTop:5,
	paddingBottom:6
};
var cSearchBoxMini = {
	width:300,
	marginRight:34,
	marginLeft:5,
	marginTop:34,
	marginBottom:4,
	paddingLeft:37,
	paddingRight:40,
	paddingTop:6,
	paddingBottom:4
};
var btn = {
	width:85,
	width_small_btns:27,
	width_small_btns_compact:36,
	height:33,
	padding:[0,7,0,0],
	top_m:31,
	top_m_to_uppercase:32,
	top_m_compact:1,
	top_padding:1,
	left_m:23,
	left_m_compact:56,
	left_m_compact_mini:50,
	left_m_hide_search_compact:26,
	left_m_hide_search_compact_mini:20,
	margin:15,
};

var update_wallpaper = false;

var ww = 0, wh = 0;
var caption_title_default = "No sound - Nothing played";
var caption_title = caption_title_default;

var Settings_width = 102;
var btn_initialized = false;

function setScheduler(schedulerState, dontNotify){
	dontNotify = typeof dontNotify !== 'undefined' ? dontNotify : false;
	if(!dontNotify) window.NotifyOthers("schedulerState",schedulerState);
	switch (true) {
		case (schedulerState == 0):
			scheduler.hibernate_after_current = false;
			scheduler.shutdown_after_current = false;
			scheduler.hibernate_after_playlist = false;
			scheduler.shutdown_after_playlist = false;
			fb.StopAfterCurrent=false;
			break;
		case (schedulerState == 1):
			scheduler.hibernate_after_current = false;
			scheduler.shutdown_after_current = false;
			scheduler.hibernate_after_playlist = false;
			scheduler.shutdown_after_playlist = false;
			fb.StopAfterCurrent=true;
			break;
		case (schedulerState == 2):
			scheduler.hibernate_after_current = true;
			scheduler.shutdown_after_current = false;
			scheduler.hibernate_after_playlist = false;
			scheduler.shutdown_after_playlist = false;
			fb.StopAfterCurrent=true;
			break;
		case (schedulerState == 3):
			scheduler.hibernate_after_current = false;
			scheduler.shutdown_after_current = true;
			scheduler.hibernate_after_playlist = false;
			scheduler.shutdown_after_playlist = false;
			fb.StopAfterCurrent=true;
			break;
		case (schedulerState == 4):
			scheduler.hibernate_after_current = false;
			scheduler.shutdown_after_current = false;
			scheduler.hibernate_after_playlist = true;
			scheduler.shutdown_after_playlist = false;
			fb.StopAfterCurrent=false;
			break;
		case (schedulerState == 5):
			scheduler.hibernate_after_current = false;
			scheduler.shutdown_after_current = false;
			scheduler.hibernate_after_playlist = false;
			scheduler.shutdown_after_playlist = true;
			fb.StopAfterCurrent=false;
			break;
	}
}
var images = {}
function build_images(){
	if(properties.darklayout) colors.icons_folder = "white"; else colors.icons_folder = "";

	images.config_layout_img = gdi.Image(theme_img_path + "\\icons\\"+colors.icons_folder+"\\panel_settings.png");

	images.artist_bio_img = gdi.Image(theme_img_path + "\\icons\\"+colors.icons_folder+"\\artist_bio_icon.png");

	images.playlist_img = gdi.Image(theme_img_path + "\\icons\\"+colors.icons_folder+"\\playlist_icon.png");

	images.visualization_img = gdi.Image(theme_img_path + "\\icons\\"+colors.icons_folder+"\\nowplaying_icon.png");
	
	images.trackinfos_on = gdi.Image(theme_img_path + "\\icons\\"+colors.icons_folder+"\\trackinfos_on.png");
	images.trackinfos_off = gdi.Image(theme_img_path + "\\icons\\"+colors.icons_folder+"\\trackinfos_off.png");	
	
	images.fullscreen_img = gdi.Image(theme_img_path + "\\icons\\"+colors.icons_folder+"\\fullscreen_icon.png");

	images.search_toggle_img = gdi.Image(theme_img_path + "\\icons\\"+colors.icons_folder+"\\search_icon.png");

	images.lightswitch_img = gdi.Image(theme_img_path + "\\icons\\"+colors.icons_folder+"\\lightswitch_icon3.png");

	images.minimode_on_img = gdi.Image(theme_img_path + "\\icons\\"+colors.icons_folder+"\\minimode_on_icon.png");
	images.minimode_off_img = gdi.Image(theme_img_path + "\\icons\\"+colors.icons_folder+"\\minimode_off_icon.png");

	images.library_img = gdi.Image(theme_img_path + "\\icons\\"+colors.icons_folder+"\\library_icon.png");
	images.global_settings_img = gdi.Image(theme_img_path + "\\icons\\"+colors.icons_folder+"\\global_settings.png");

	images.nowplaying_off_icon = gdi.Image(theme_img_path + "\\icons\\"+colors.icons_folder+"\\nowplaying_off.png");
	images.nowplaying_off_hover_icon = gdi.Image(theme_img_path + "\\icons\\"+colors.icons_folder+"\\nowplaying_off_hover.png");
	images.nowplaying_on_icon = gdi.Image(theme_img_path + "\\icons\\"+colors.icons_folder+"\\nowplaying_on.png");
	images.nowplaying_on_hover_icon = gdi.Image(theme_img_path + "\\icons\\"+colors.icons_folder+"\\nowplaying_on_hover.png");

	if(layout_state.isEqual(1)) var icon_prefix = "mini";
	else var icon_prefix = "";
	images.nowplaying_on_hover_icon = gdi.Image(theme_img_path + "\\icons\\"+colors.icons_folder+"\\"+icon_prefix+"close_icon.png");
	images.nowplaying_on_hover_icon_hover = gdi.Image(theme_img_path + "\\icons\\white\\"+icon_prefix+"close_icon.png");
	images.max_icon = gdi.Image(theme_img_path + "\\icons\\"+colors.icons_folder+"\\"+icon_prefix+"max_icon.png");
	images.maxon_icon = gdi.Image(theme_img_path + "\\icons\\"+colors.icons_folder+"\\"+icon_prefix+"maxon_icon.png");	
	images.reduce_icon = gdi.Image(theme_img_path + "\\icons\\"+colors.icons_folder+"\\"+icon_prefix+"reduce_icon.png");
	images.mini_icon = gdi.Image(theme_img_path + "\\icons\\"+colors.icons_folder+"\\minimode_icon.png");

	build_buttons();
}
function setDarkLayout(){
	switch(true){
		case (main_panel_state.isEqual(0) && properties.library_dark_theme && layout_state.isEqual(0)):
		case (main_panel_state.isEqual(1) && properties.playlists_dark_theme && layout_state.isEqual(0)):
		case (main_panel_state.isEqual(2) && properties.bio_dark_theme && layout_state.isEqual(0)):
		case (main_panel_state.isEqual(3) && properties.visualization_dark_theme && layout_state.isEqual(0)):
		case (properties.minimode_dark_theme && layout_state.isEqual(1)):
			properties.darklayout = true;
		break;
		default:
			properties.darklayout = false;
		break;
	}
}
function get_colors(){
	setDarkLayout();
	get_colors_global();
	if (properties.darklayout) {
		colors.wallpaper_overlay = GetGrey(0,203);
		colors.wallpaper_overlay_blurred = GetGrey(0,140);
		colors.albumartbg_overlay = GetGrey(0,80);

		colors.btn_inactive_opacity = 110;
		colors.active_tab = GetGrey(255);
		colors.active_tab_line_height = 1;

		colors.inactive_txt = GetGrey(110);
		colors.faded_txt = GetGrey(240);

		colors.search_txt = GetGrey(240);
		colors.search_reset_icon = GetGrey(255);
		colors.bottom_line = GetGrey(255,35);
		colors.icons_folder = "white";

		colors.titlebar_btn_hover_bg = GetGrey(255,50);
		colors.settings_btn_hover_bg = GetGrey(255,30);
		if(compact_titlebar.isActive()) {
			colors.settings_btn_line = GetGrey(255,35);
			colors.search_line = GetGrey(255,35);
		} else {
			colors.settings_btn_line = GetGrey(255,45);
			colors.search_line = GetGrey(255,35);
		}
		cSearchBox.marginBottom = 3;
	}
	else {
		colors.wallpaper_overlay = GetGrey(255,232);
		colors.wallpaper_overlay_blurred = GetGrey(255,232);
		colors.albumartbg_overlay = GetGrey(0,80);

		colors.btn_inactive_opacity = 255;
		colors.inactive_txt = GetGrey(0);
		colors.active_tab = GetGrey(0);
		colors.active_tab_line_height = 2;

		colors.faded_txt = GetGrey(0);

		colors.search_txt = GetGrey(70);

		colors.search_line=GetGrey(0,49);
		colors.search_reset_icon = GetGrey(0);
		colors.bottom_line =  colors.sidesline;
		colors.icons_folder = "";

		colors.titlebar_btn_hover_bg = GetGrey(0,27);
		colors.settings_btn_hover_bg = GetGrey(0,7);
		if(compact_titlebar.isActive()) {
			colors.settings_btn_line = GetGrey(210);
			colors.search_line = GetGrey(210);
		} else {
			colors.settings_btn_line = GetGrey(210);
			colors.search_line = GetGrey(0,49);
		}
	}
	build_images();
}

get_colors();

function Lightswitch(switch_all,new_state){
	switch_all = typeof switch_all !== 'undefined' ? switch_all : false;
	new_state = typeof new_state !== 'undefined' ? new_state : !properties.darklayout;

	if(layout_state.isEqual(1) && !switch_all){
		if(switch_all) properties.minimode_dark_theme=new_state;
		else properties.minimode_dark_theme=!properties.minimode_dark_theme;
        window.NotifyOthers("minimode_dark_theme",properties.minimode_dark_theme);
		window.SetProperty("MINIMODE dark theme", properties.minimode_dark_theme);
		on_notify_data("minimode_dark_theme",properties.minimode_dark_theme);
		get_colors();g_searchbox.adapt_look_to_layout();
        if(!switch_all) window.Repaint();
	}
	if((main_panel_state.isEqual(0) && layout_state.isEqual(0)) || switch_all){
		if(switch_all) properties.library_dark_theme=new_state;
		else properties.library_dark_theme=!properties.library_dark_theme;
        window.NotifyOthers("library_dark_theme",properties.library_dark_theme);
		window.SetProperty("LIBRARY dark theme", properties.library_dark_theme);
		on_notify_data("library_dark_theme",properties.library_dark_theme);
        if(!switch_all) window.Repaint();
	}
	if((main_panel_state.isEqual(1) && layout_state.isEqual(0)) || switch_all){
		if(switch_all) properties.playlists_dark_theme=new_state;
		else properties.playlists_dark_theme=!properties.playlists_dark_theme;
        window.NotifyOthers("playlists_dark_theme",properties.playlists_dark_theme);
		window.SetProperty("PLAYLISTS dark theme", properties.playlists_dark_theme);
		on_notify_data("playlists_dark_theme",properties.playlists_dark_theme);
		fb.RunMainMenuCommand("View/ElPlaylist/Refresh");
        if(!switch_all) window.Repaint();
	}
	if((main_panel_state.isEqual(2) && layout_state.isEqual(0)) || switch_all){
		if(switch_all) properties.bio_dark_theme=new_state;
		else properties.bio_dark_theme=!properties.bio_dark_theme;
        window.NotifyOthers("bio_dark_theme",properties.bio_dark_theme);
		window.SetProperty("BIO dark theme", properties.bio_dark_theme);
		on_notify_data("bio_dark_theme",properties.bio_dark_theme);
        if(!switch_all) window.Repaint();
	}
	if((main_panel_state.isEqual(3) && layout_state.isEqual(0)) || switch_all){
		if(switch_all) properties.visualization_dark_theme=new_state;
		else properties.visualization_dark_theme=!properties.visualization_dark_theme;
        window.NotifyOthers("visualization_dark_theme",properties.visualization_dark_theme);
		window.SetProperty("VISUALIZATION dark theme", properties.visualization_dark_theme);
		on_notify_data("visualization_dark_theme",properties.visualization_dark_theme);
	}
	if(switch_all) window.Repaint();
}
function toggleNowPlayingState(switch_all,new_state, refresh_panel){
	switch_all = typeof switch_all !== 'undefined' ? switch_all : false;
	new_state = typeof new_state !== 'undefined' ? new_state : false;
	refresh_panel = typeof refresh_panel !== 'undefined' ? refresh_panel : true;
	if(switch_all){
		if(new_state===false) {
			nowplayinglib_state.toggleValue(refresh_panel);
			nowplayingplaylist_state.toggleValue(refresh_panel);
			nowplayingbio_state.toggleValue(refresh_panel);
			nowplayingvisu_state.toggleValue(refresh_panel);
		} else {
			nowplayinglib_state.setValue(new_state,refresh_panel);
			nowplayingplaylist_state.setValue(new_state,refresh_panel);
			nowplayingbio_state.setValue(new_state,refresh_panel);
			nowplayingvisu_state.setValue(new_state,refresh_panel);
		}
	} else {
		switch(main_panel_state.value){
			case 0:
				if(new_state!==false) nowplayinglib_state.setValue(new_state,refresh_panel);
				else nowplayinglib_state.toggleValue(refresh_panel);
			break;
			case 1:
				if(new_state!==false) nowplayingplaylist_state.setValue(new_state,refresh_panel);
				else nowplayingplaylist_state.toggleValue(refresh_panel);
			break;
			case 2:
				if(new_state!==false) nowplayingbio_state.setValue(new_state,refresh_panel);
				else nowplayingbio_state.toggleValue(refresh_panel);
			break;
			case 3:
				if(new_state!==false) nowplayingvisu_state.setValue(new_state,refresh_panel);
				else nowplayingvisu_state.toggleValue(refresh_panel);
			break;
		}
	}
	build_buttons();
	window.Repaint();
}
function toggleTrackInfosState(switch_all,new_state, refresh_panel){
	switch_all = typeof switch_all !== 'undefined' ? switch_all : false;
	new_state = typeof new_state !== 'undefined' ? new_state : false;
	refresh_panel = typeof refresh_panel !== 'undefined' ? refresh_panel : true;

	//if(getNowPlayingState()==0) toggleNowPlayingState();

	if(switch_all){
		if(new_state===false) {
			trackinfoslib_state.cycleIncrement(1,refresh_panel);
			trackinfosplaylist_state.cycleIncrement(1,refresh_panel);
			trackinfosbio_state.cycleIncrement(1,refresh_panel);
			trackinfosvisu_state.cycleIncrement(1,refresh_panel);
		} else {
			trackinfoslib_state.setValue(new_state,refresh_panel);
			trackinfosplaylist_state.setValue(new_state,refresh_panel);
			trackinfosbio_state.setValue(new_state,refresh_panel);
			trackinfosvisu_state.setValue(new_state,refresh_panel);
		}
	} else {
		switch(main_panel_state.value){
			case 0:
				if(new_state!==false) trackinfoslib_state.setValue(new_state,refresh_panel);
				else trackinfoslib_state.cycleIncrement(1,refresh_panel);
			break;
			case 1:
				if(new_state!==false) trackinfosplaylist_state.setValue(new_state,refresh_panel);
				else trackinfosplaylist_state.cycleIncrement(1,refresh_panel);
			break;
			case 2:
				if(new_state!==false) trackinfosbio_state.setValue(new_state,refresh_panel);
				else trackinfosbio_state.cycleIncrement(1,refresh_panel);
			break;
			case 3:
				if(new_state!==false) trackinfosvisu_state.setValue(new_state,refresh_panel);
				else trackinfosvisu_state.cycleIncrement(1,refresh_panel);
			break;
		}
	}
	build_buttons();
	window.Repaint();
}
function saveFilterState(){
	properties.savedFilterState = filters_panel_state.value;
	window.SetProperty("_PROPERTY: Saved filter state", properties.savedFilterState);
	window.NotifyOthers("save_filter_state",properties.savedFilterState);
}
function setMaxButton(){
	if(g_uihacks.getMainWindowState()==WindowState.Normal) buttons.Max.H_img = images.max_icon;
	else buttons.Max.H_img = images.maxon_icon;
	buttons.Max.N_img = buttons.Max.H_img;
	buttons.Max.D_img = buttons.Max.H_img;	
}

function build_buttons(){
	if(btn_initialized){
		buttons.Library.N_img = images.library_img;
		buttons.Library.H_img = images.library_img;
		buttons.Library.D_img = buttons.Library.H_img;

		buttons.Playlists.N_img = images.playlist_img;
		buttons.Playlists.H_img = images.playlist_img;
		buttons.Playlists.D_img = buttons.Playlists.H_img;

		buttons.Artist_Bio.H_img = images.artist_bio_img;
		buttons.Artist_Bio.N_img = images.artist_bio_img;
		buttons.Artist_Bio.D_img = buttons.Artist_Bio.H_img;

		buttons.Visualization.H_img = images.visualization_img;
		buttons.Visualization.N_img = images.visualization_img;
		buttons.Visualization.D_img = buttons.Visualization.H_img;

		buttons.Lightswitch.H_img = images.lightswitch_img;
		buttons.Lightswitch.N_img = images.lightswitch_img;
		buttons.Lightswitch.D_img = buttons.Lightswitch.H_img;

		if(getNowPlayingState()==1) buttons.NowPlaying.H_img = images.nowplaying_on_icon;
		else buttons.NowPlaying.H_img = images.nowplaying_off_icon;
		buttons.NowPlaying.N_img = buttons.NowPlaying.H_img;
		buttons.NowPlaying.D_img = buttons.NowPlaying.H_img;
		
		buttons.ConfigLayout.H_img = images.config_layout_img;
		buttons.ConfigLayout.N_img = images.config_layout_img;
		buttons.ConfigLayout.D_img = buttons.ConfigLayout.H_img;

		if(getTrackInfosState()>=1) {
			buttons.RightSidebar.H_img = images.trackinfos_off;
			buttons.RightSidebar.N_img = images.trackinfos_off;
		} else {
			buttons.RightSidebar.H_img = images.trackinfos_on;
			buttons.RightSidebar.N_img = images.trackinfos_on;
		}
		buttons.RightSidebar.D_img = buttons.RightSidebar.H_img;

		buttons.ShowSearch.H_img = images.search_toggle_img;
		buttons.ShowSearch.N_img = images.search_toggle_img;
		buttons.ShowSearch.D_img = buttons.ShowSearch.H_img;

		buttons.Fullscreen.H_img = images.fullscreen_img;
		buttons.Fullscreen.N_img = images.fullscreen_img;
		buttons.Fullscreen.D_img = buttons.Fullscreen.H_img;

		buttons.Settings.H_img = images.global_settings_img;
		buttons.Settings.N_img = images.global_settings_img;
		buttons.Settings.D_img = buttons.Settings.H_img;

		buttons.Close.N_img = images.nowplaying_on_hover_icon;
		buttons.Close.H_img = images.nowplaying_on_hover_icon_hover;
		buttons.Close.D_img = buttons.Close.H_img;

		setMaxButton();
		buttons.Max.hover_color = colors.titlebar_btn_hover_bg;

		buttons.Mini.N_img = images.mini_icon;
		buttons.Mini.H_img = images.mini_icon;
		buttons.Mini.D_img = buttons.Mini.H_img;
		buttons.Mini.hover_color = colors.titlebar_btn_hover_bg;

		buttons.Reduce.H_img = images.reduce_icon;
		buttons.Reduce.N_img = images.reduce_icon;
		buttons.Reduce.D_img = buttons.Reduce.H_img;
		buttons.Reduce.hover_color = colors.titlebar_btn_hover_bg;
	} else {
		btn_initialized = true;
		buttons = {
			Library: new JSButton(btn.left_m+btn.margin*0, btn.top_m, btn.width, btn.height, "Library", "Library", "", function () {
				main_panel_state.setValue(0);
				get_colors();g_searchbox.adapt_look_to_layout();
			}, false,false,images.library_img,images.library_img,0, false, false, true),
			Playlists: new JSButton(btn.left_m+btn.width+btn.margin*1, btn.top_m, btn.width, btn.height, "Playlists", "Playlists", "", function () {
				main_panel_state.setValue(1);
				get_colors();g_searchbox.adapt_look_to_layout();
			}, false,false,images.playlist_img,images.playlist_img,1, false, false, true),
			Artist_Bio: new JSButton(btn.left_m+btn.width+btn.width+btn.margin*2, btn.top_m, btn.width, btn.height, "Now playing", "Now playing", "", function () {
				main_panel_state.setValue(2);
				get_colors();g_searchbox.adapt_look_to_layout();
			}, false,false,images.artist_bio_img,images.artist_bio_img,2, false, false, true),
			Visualization: new JSButton(btn.left_m+btn.width+btn.width+btn.width+btn.margin*3, btn.top_m, btn.width, btn.height, "Visualization", "Visualization", "", function () {
				main_panel_state.setValue(3);
				get_colors();g_searchbox.adapt_look_to_layout();
			}, false,false,images.visualization_img,images.visualization_img,3, false, false, true),
			NowPlaying: new JSButton(-38, btn.top_m, btn.width_small_btns, btn.height, "", "nowplaying", "Hide/show right sidebar", function () {
				toggleNowPlayingState();
			}, false, false,images.nowplaying_off_icon,images.nowplaying_off_icon,-1, false, false, true),
			ConfigLayout: new JSButton(-38, btn.top_m, btn.width_small_btns, btn.height, "", "Configlayout", "Configure Layout", function () {
				draw_layout_menu(this.x+this.w,this.y+this.h-1);
			}, false, false,images.config_layout_img,images.config_layout_img,-1, false, false, true),			
			RightSidebar: new JSButton(-38, btn.top_m, btn.width_small_btns, btn.height, "", "rightsidebar", "Hide/show track infos", function () {
				if(getNowPlayingState()==1) {
					toggleTrackInfosState();
				} else {
					if(getTrackInfosState()==0) toggleTrackInfosState(false,1,false);
					toggleNowPlayingState();
					/*trigger_refresh_PSS = setTimeout(function(){
						RefreshPSS();
						clearTimeout(trigger_refresh_PSS);
						trigger_refresh_PSS = false;
					}, 100);*/
				}
			}, false, false,images.nowplaying_off_icon,images.nowplaying_off_icon,-1, false, false, true),
			Lightswitch: new JSButton(-38, btn.top_m, btn.width_small_btns, btn.height, "", "lightswitch", "Dark/light switch"+"\n"+"(double click to switch globally)", false, function () {
				previous_darkvalue = properties.darklayout;				
				Lightswitch();
			}, function () {
				Lightswitch(true,!previous_darkvalue);
			}, images.lightswitch_img,images.lightswitch_img,-1, false, false, true),
			Fullscreen: new JSButton(-112, btn.top_m, btn.width_small_btns, btn.height, "", "fullscreen", "Fullscreen", function () {
				g_uihacks.toggleFullscreen();
			}, false,false,images.fullscreen_img,images.fullscreen_img,-1, false, false, true),
			ShowSearch: new JSButton(-150, btn.top_m, btn.width_small_btns, btn.height, "", "search", "Show search input", function () {
				toggleSearch();
				g_cursor.setCursor(IDC_ARROW,2);
			}, false,false,images.search_toggle_img,images.search_toggle_img,-1, false, false, true),
			Settings: new JSButton(2, -1, Settings_width, btn.height-3, "Foobar", "Foobar", "Main menu", function () {
				g_tooltip.Deactivate();
				draw_main_menu(0, 28);
			}, false,false,images.global_settings_img,images.global_settings_img,-1, false, false, false),
			Close: new JSButton(-45, 0, 45, 29, "", "close", "", false, function () {
				fb.Exit();
			},false,images.nowplaying_on_hover_icon,images.nowplaying_on_hover_icon_hover,-1,false,RGB(232,17,35),true),
			Max: new JSButton(-90, 0, 45, 29, "", "max", "Maximize / Main player", false, function () {
				if(layout_state.isEqual(1)){
					toggleLayoutMode();get_colors();g_searchbox.adapt_look_to_layout();
					this.changeState(ButtonStates.normal);
				} else {
					if(g_uihacks.getMainWindowState()==WindowState.Normal)
						g_uihacks.setMainWindowState(WindowState.Maximized);
					else
						g_uihacks.setMainWindowState(WindowState.Normal);
				}
			},false,images.max_icon,images.max_icon,-1,false,colors.titlebar_btn_hover_bg,true),
			Mini: new JSButton(-135, 0, 45, 29, "", "mini", "Mini player", false, function () {
				toggleLayoutMode();get_colors();g_searchbox.adapt_look_to_layout();
			},false,images.mini_icon,images.mini_icon,-1,false,colors.titlebar_btn_hover_bg,true),
			Reduce: new JSButton(-180, 0, 45, 29, "", "reduce", "", false, function () {
				g_uihacks.setMainWindowState(WindowState.Minimized);
			},false,images.reduce_icon,images.reduce_icon,-1,false,colors.titlebar_btn_hover_bg,true)
		}

		all_btns = new JSButtonGroup("top-left", 0, 0, 'all_btns', false);
		all_btns.addButtons(buttons, [0,0,0,0]);

		topleft_btns = new JSButtonGroup("top-left", 0, 0, 'topleft_btns', true);
		topleft_btns.addButtons([buttons.Settings], [0,0,0,0]);
		topleft_btns.setPadding([0,7,0,2]);

		main_panel_btns = new JSButtonGroup("top-left", btn.left_m, btn.top_m, 'main_panel_btns', true);
		main_panel_btns.addButtons([buttons.Library,buttons.Playlists,buttons.Artist_Bio,buttons.Visualization], [0,btn.margin+2,0,0]);
		main_panel_btns.setPadding(btn.padding);

		window_btns = new JSButtonGroup("top-right", 0, 0, 'window_btns', false);
		window_btns.addButtons([buttons.Close,buttons.Max,buttons.Mini,buttons.Reduce], [0,0,0,0]);

		additional_btns = new JSButtonGroup("top-right", 11, btn.top_m, 'additional_btns', true);
		additional_btns.addButtons([buttons.NowPlaying,buttons.ConfigLayout,buttons.RightSidebar,buttons.Fullscreen,buttons.Lightswitch,buttons.ShowSearch], [0,9,0,0]);

		compact_btns = new JSButtonGroup("top-left", 0, -1, 'compact_btns', true);
		compact_btns.addButtons([buttons.Settings,buttons.NowPlaying,buttons.ConfigLayout,buttons.RightSidebar,buttons.Lightswitch,buttons.Fullscreen,buttons.ShowSearch], [0,0,0,0]);
		compact_btns.addButtons([buttons.Library], [0,0,0,btn.margin+5]);
		compact_btns.addButtons([buttons.Playlists,buttons.Artist_Bio,buttons.Visualization], [0,0,0,btn.margin]);
	}
}
function toggleSearch(new_search_state){
	g_searchbox.toggleVisibility();
	if(!g_searchbox.hide) g_searchbox.inputbox.activate(0,0);
}
function toggleLayoutMode(new_layout_state, main_window_state){
	new_layout_state = typeof new_layout_state !== 'undefined' ? new_layout_state : 1-layout_state.value;
	main_window_state = typeof main_window_state !== 'undefined' ? main_window_state : 0;

	if(new_layout_state == 1) {
		if(!g_uihacks.getFullscreenState() && g_uihacks.getMainWindowState()==0){
			properties.fullMode_savedwidth=window.Width;
			window.SetProperty("Full mode saved width", properties.fullMode_savedwidth);
		} else {
			g_uihacks.setFullscreenState(false);
			g_uihacks.setMainWindowState(main_window_state);
		}
		layout_state.setValue(1);
		g_uihacks.setMinWidth(globalProperties.miniMode_minwidth);
		g_uihacks.setMinHeight(globalProperties.miniMode_minwidth);
		g_uihacks.setMaxWidth(properties.miniMode_savedwidth);

		try{
			g_uihacks.setMaxHeight(properties.miniMode_playlistheight+(showtrackinfo_small.isActive()?properties.minicontrolsHeight:properties.miniNoTrackcontrolsHeight)+properties.minimode_titlebar_height + 1);
		} catch (e) {
			g_uihacks.setMaxHeight(window.Height);
		}
		g_uihacks.enableMaxSize();
		maxsize_disabling = setTimeout(function(){
			clearTimeout(maxsize_disabling);
			maxsize_disabling = false;
			g_uihacks.disableMaxSize();
		}, 100);
		adapt_buttons_to_layout();
	} else {
		if(!g_uihacks.getFullscreenState() && g_uihacks.getMainWindowState()==0){
			properties.miniMode_savedwidth=window.Width;
			window.SetProperty("Mini mode saved width", properties.miniMode_savedwidth);
		} else {
			g_uihacks.setFullscreenState(false);
			g_uihacks.setMainWindowState(main_window_state);
		}
		layout_state.setValue(0);
		g_uihacks.enableMinSize();
		g_uihacks.setMinWidth(Math.max(properties.fullMode_savedwidth,globalProperties.fullMode_minwidth));
		try{
			g_uihacks.setMinHeight(Math.max(properties.fullMode_pmanagerheight+(mini_controlbar.isActive()?(showtrackinfo_big.isActive()?properties.compactcontrolsHeight:properties.compactNoTrackcontrolsHeight):properties.fullcontrolsHeight)+(compact_titlebar.isActive()?properties.compact_titlebar_height:properties.full_titlebar_height),globalProperties.fullMode_minheight) + 1);
		} catch (e) {
			g_uihacks.setMinHeight(window.Height);
		}
		minsize_disabling = setTimeout(function(){
			clearTimeout(minsize_disabling);
			minsize_disabling = false;
			g_uihacks.setMinWidth(650);
			g_uihacks.setMinHeight(300);
		}, 100);
		adapt_buttons_to_layout();
		set_main_btns_visibility();
	}
}
function adapt_buttons_to_layout(){
	if(layout_state.isEqual(1)) {
		main_panel_btns.hide = true;
		buttons.Fullscreen.setVisibility(false);
		buttons.Mini.setVisibility(false);
		buttons.ConfigLayout.setVisibility(false);		
		buttons.NowPlaying.setVisibility(false);
		buttons.RightSidebar.setVisibility(false);
		buttons.Settings.calculate_size = true;

		g_searchbox.toggleVisibility(true);

		if(!properties.showLightswitchBtn)
			buttons.Lightswitch.setVisibility(false);
		else buttons.Lightswitch.setVisibility(true);

		additional_btns.x = 5;

		topleft_btns.setBtnsHeight(btn.height-4);
		topleft_btns.setPadding([0,7,0,2]);
		additional_btns.setBtnsHeight(btn.height-1);
		additional_btns.setBtnsWidth(btn.width_small_btns_compact);
		cSearchBoxMini.marginRight = ((properties.showLightswitchBtn)?32:0);

		buttons.Close.w = 36;
		window_btns.setBtnsHeight(28);
		buttons.Max.w = buttons.Reduce.w = 32;

		if(properties.tracktitle_ontop || properties.mini_mainmenu_button) {
			buttons.Settings.w = buttons.Settings.N_img.Width+3;
			buttons.Settings.displayLabel(false);
		} else {
			buttons.Settings.w = 41+buttons.Settings.N_img.Width+btn.padding/2;
			buttons.Settings.displayLabel(true);
		}
	} else {
		main_panel_btns.hide = false;
		if((!(properties.alwaysShowSearch && !compact_titlebar.isActive())) && g_searchbox.inputbox.text.length == 0) {
			g_searchbox.toggleVisibility(false);
		} else g_searchbox.toggleVisibility(true);

		buttons.Mini.setVisibility(true);

		if(!properties.showFullscreenBtn)
			buttons.Fullscreen.setVisibility(false);
		else buttons.Fullscreen.setVisibility(true);

		buttons.Settings.calculate_size = true;
		
		if(!properties.showConfigLayoutBtn)
			buttons.ConfigLayout.setVisibility(false);
		else buttons.ConfigLayout.setVisibility(true);
		
		if(!properties.showRightSidebarBtn)
			buttons.RightSidebar.setVisibility(false);
		else buttons.RightSidebar.setVisibility(true);		

		if(!properties.showLightswitchBtn)
			buttons.Lightswitch.setVisibility(false);
		else buttons.Lightswitch.setVisibility(true);

		if(!properties.showNowPlayingBtn)
			buttons.NowPlaying.setVisibility(false);
		else buttons.NowPlaying.setVisibility(true);

		additional_btns.x = 14;


		window_btns.setBtnsWidth(45);
		if(properties.mini_mainmenu_button) {
			buttons.Settings.w = buttons.Settings.N_img.Width+5;
			buttons.Settings.displayLabel(false);
		} else {
			buttons.Settings.w = 43+buttons.Settings.N_img.Width+btn.padding/2;
			buttons.Settings.displayLabel(true);
		}
		if(compact_titlebar.isActive()) {
			//properties.showPanelBtnText = false;
			compact_btns.setBtnsHeight(btn.height+4);
			topleft_btns.setPadding([0,8,0,4]);
			window_btns.setBtnsHeight(36);
			additional_btns.setBtnsWidth(btn.width_small_btns_compact);
		} else {
			//properties.showPanelBtnText = true;
			topleft_btns.setBtnsHeight(btn.height-3);
			topleft_btns.setPadding([0,7,0,2]);
			main_panel_btns.x = 17;
			main_panel_btns.setBtnsHeight(btn.height);
			additional_btns.setBtnsHeight(btn.height);
			window_btns.setBtnsHeight(29);
			additional_btns.setBtnsWidth(btn.width_small_btns);
		}
		cSearchBoxMainDark.marginRight = cSearchBoxMainLight.marginRight = 18 + additional_btns.getWidth(true) - (!properties.alwaysShowSearch?buttons.ShowSearch.w+5:0);

		if(!properties.showRightSidebarBtn && !properties.showLightswitchBtn && !properties.showFullscreenBtn && !properties.showNowPlayingBtn && !properties.showConfigLayoutBtn){
			cSearchBoxMainLight.marginRight -= 10;
			cSearchBoxMainDark.marginRight -= 10;
		}
		main_panel_btns.txtYAdjust(1);
		if(properties.toUpperCase) main_panel_btns.toUpperCase(true);
		if(!properties.showPanelBtnText) main_panel_btns.displayLabel(false);
	}
	g_searchbox.adapt_look_to_layout();
	if(!properties.show_visualization) buttons.Visualization.setVisibility(false);
	g_panel.on_size_changed();
}
function SetCaptionTitleSize(){
	if(layout_state.isEqual(1)) {
		caption_title_x = topleft_btns.getWidth()+15;
		caption_title_w = window.Width-window_btns.getWidth()-topleft_btns.getWidth()-20;
	} else {
		caption_title_x = topleft_btns.getWidth()+13;
		caption_title_w = window.Width-window_btns.getWidth()-topleft_btns.getWidth()-20;
	}
}
function oPanel(name, firstPaintCallback){
	this.name = name;
	this.firstPaintCallback = firstPaintCallback;
	this.firstPaint = true;
	this.on_size_changed = function(){
		this.firstPaint = true;
	}
	this.draw = function(){
		if(this.firstPaint){
			this.firstPaintCallback && this.firstPaintCallback();
			this.firstPaint = false;
		}
	};
}
function drawAllButtons(gr) {
	if(compact_titlebar.isActive() && layout_state.isEqual(0)){
		window_btns.draw(gr);
		compact_btns.draw(gr);
	} else {
		topleft_btns.draw(gr);
		main_panel_btns.draw(gr);
		window_btns.draw(gr);
		additional_btns.draw(gr);
	}
}

function set_main_btns_visibility(){
	if((compact_titlebar.isActive() && !g_searchbox.hide) || layout_state.isEqual(1)) {
		buttons.Playlists.setVisibility(false);
		buttons.Artist_Bio.setVisibility(false);
		buttons.Library.setVisibility(false);
		buttons.Visualization.setVisibility(false);
		return;
	}

	if(!g_searchbox.hide) var searchbox_width = cSearchBox.width;
	else var searchbox_width = 0;

	if(properties.show_visualization){
		if(ww-cSearchBox.marginRight-searchbox_width<btn.left_m+btn.width*4+btn.padding*3) buttons.Visualization.setVisibility(false);
		else buttons.Visualization.setVisibility(true);
	}
	if(ww-cSearchBox.marginRight-searchbox_width<btn.left_m+btn.width*3+btn.padding*2) buttons.Artist_Bio.setVisibility(false);
	else buttons.Artist_Bio.setVisibility(true);
	if(ww-cSearchBox.marginRight-searchbox_width<btn.left_m+btn.width*2+btn.padding*1) buttons.Playlists.setVisibility(false);
	else buttons.Playlists.setVisibility(true);
	buttons.Library.setVisibility(true);
}
// -------------------------------- WSH Callbacks -------------------------------------------
function on_size(w, h) {
    ww = Math.max(w,globalProperties.miniMode_minwidth);
    wh = h;
	var fullscreen =  g_uihacks.getFullscreenState();
	var mainWindowState =  g_uihacks.getMainWindowState();
	if(layout_state.isEqual(0)){
		if(!fullscreen && mainWindowState==0) properties.fullMode_savedwidth=ww;
		set_main_btns_visibility();
	} else {
		if(mainWindowState==2){
			toggleLayoutMode(0 , 0, false);get_colors();g_searchbox.adapt_look_to_layout();
		}
	}
	setMaxButton();
	g_panel.on_size_changed();
    // set wallpaper
    if(fb.IsPlaying && properties.showwallpaper) {
        //g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
    }
}
function SetPseudoCaption(){
	if(layout_state.isEqual(0)) {
		if(!compact_titlebar.isActive()){
			var topleft_btns_w = topleft_btns.getWidth();
			g_uihacks.SetPseudoCaption(topleft_btns_w, 8, ww-280, 25);
		} else {
			if(g_searchbox.hide) {
				var compact_btns_w = compact_btns.getWidth();
				var window_btns_w = window_btns.getWidth();
				g_uihacks.SetPseudoCaption(compact_btns_w, 8, ww - compact_btns_w - window_btns_w, 25);
			} else {
				g_uihacks.SetPseudoCaption(0, 8, 0, 25);
			}
		}
	} else {
		var window_btns_w = window_btns.getWidth();
		var topleft_btns_w = topleft_btns.getWidth();
		g_uihacks.SetPseudoCaption(topleft_btns_w, 8, ww - window_btns_w - topleft_btns_w, 25);
	}
}
function on_paint(gr) {
	gr.SetTextRenderingHint(globalProperties.TextRendering);

	gr.FillSolidRect(0, 0, ww, wh, colors.normal_bg);
    // BG wallpaper
    if(properties.showwallpaper && (typeof(g_wallpaperImg) == "undefined" || !g_wallpaperImg || update_wallpaper)) {
        g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
    };
	if(properties.showwallpaper && g_wallpaperImg) {
		gr.DrawImage(g_wallpaperImg, 0, 0, ww, wh, 0, 0, g_wallpaperImg.Width, g_wallpaperImg.Height);
		gr.FillSolidRect(0, 0, ww, wh, (properties.wallpaperblurred)?colors.wallpaper_overlay_blurred:colors.wallpaper_overlay);
	}

	switch(true){
		case (main_panel_state.isEqual(0) && ((properties.library_dark_theme && !properties.darklayout) || (!properties.library_dark_theme && properties.darklayout)) && layout_state.isEqual(0)):
		case (main_panel_state.isEqual(1) && ((properties.playlists_dark_theme && !properties.darklayout) || (!properties.playlists_dark_theme && properties.darklayout)) && layout_state.isEqual(0)):
		case (main_panel_state.isEqual(2) && ((properties.bio_dark_theme && !properties.darklayout) || (!properties.bio_dark_theme && (properties.darklayout || (properties.bio_stick2darklayout && !nowplayingbio_state.isActive())))) && layout_state.isEqual(0)):
		case (main_panel_state.isEqual(3) && layout_state.isEqual(0) && !nowplayingvisu_state.isActive()):
		case (((properties.minimode_dark_theme && !properties.darklayout) || (!properties.minimode_dark_theme && properties.darklayout)) && layout_state.isEqual(1)):
		break;
		default:
			gr.FillSolidRect(0, wh-1, ww, 2, colors.bottom_line);
		break;
	}
    drawAllButtons(gr);
	g_panel.draw();

	if(properties.tracktitle_ontop && !(compact_titlebar.isActive() && layout_state.isEqual(0))){
		gr.GdiDrawText(caption_title, g_font.normal, colors.normal_txt, caption_title_x, 0, caption_title_w, 29, DT_LEFT| DT_VCENTER | DT_CALCRECT | DT_NOPREFIX | DT_END_ELLIPSIS);
	}

	if(layout_state.isEqual(0)){
		g_searchbox.draw(gr, ww - g_searchbox.w - cSearchBox.marginRight, cSearchBox.marginTop);
	} else {
		g_searchbox.draw(gr, cSearchBox.marginLeft, cSearchBox.marginTop);
	}

}
function on_playback_new_track(metadb){
	//setPlaybackPlaylist();
	eval_caption_title(metadb);
	if(properties.showwallpaper && properties.wallpapermode == 0) {
		g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, metadb);
	};
	window.Repaint();
}
function eval_caption_title(metadb){
	if(metadb)
		caption_title = fb.TitleFormat(properties.tracktitle_format).EvalWithMetadb(metadb);
}
function on_playback_stop(reason) {
	switch(reason) {
	case 0: // user stop
	case 1: // eof (e.g. end of playlist)
		caption_title = caption_title_default;
		g_wallpaperImg = null;
		break;
	case 2: // starting_another (only called on user action, i.e. click on next button)
		break;
	};
	window.Repaint();
}

function on_mouse_move(x,y,m){
	if(g_cursor.x==x && g_cursor.y==y) return;
	g_cursor.onMouse("move", x, y, m);
    g_searchbox.on_mouse("move", x, y);
	topleft_btns.on_mouse("move",x,y);
	main_panel_btns.on_mouse("move",x,y);
	window_btns.on_mouse("move",x,y);
	compact_btns.on_mouse("move",x,y);
	all_btns.on_mouse("move",x,y);
}

function on_mouse_leave() {
    g_searchbox.on_mouse("leave", 0, 0);
	topleft_btns.on_mouse("leave");
	main_panel_btns.on_mouse("leave");
	window_btns.on_mouse("leave");
	compact_btns.on_mouse("leave");
	all_btns.on_mouse("leave");
}

function on_mouse_lbtn_down(x,y){
	//if(g_cursor.x!=x || g_cursor.y!=y) on_mouse_move(x,y);
	g_searchbox.on_mouse("lbtn_down", x, y);
	all_btns.on_mouse("lbtn_down",x, y);
}

function on_mouse_lbtn_up(x,y){
	g_searchbox.on_mouse("lbtn_up", x, y);
	all_btns.on_mouse("lbtn_up",x, y);
}
function on_mouse_lbtn_dblclk(x, y) {
	all_btns.on_mouse("dble_click",x, y);
}
function on_mouse_rbtn_down(x, y, mask) {
	g_searchbox.on_mouse("rbtn_down", x, y);
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
function on_mouse_rbtn_up(x, y){
        var _menu = window.CreatePopupMenu();
        var idx;

		_menu.AppendMenuItem(MF_STRING, 103, "Settings...");
		_menu.AppendMenuSeparator();

		if(layout_state.isEqual(0)) {
			_menu.AppendMenuItem(MF_STRING, 1, "Library");
			_menu.AppendMenuItem(MF_STRING, 2, "Playlists");
			_menu.AppendMenuItem(MF_STRING, 3, "Now playing");
			if(properties.show_visualization) _menu.AppendMenuItem(MF_STRING, 4, "Visualization");
			_menu.CheckMenuRadioItem(1, 4, (parseInt(main_panel_state.value)+1));
			_menu.AppendMenuSeparator();
			_menu.AppendMenuItem(MF_STRING, 6, "Compact player");
			if(g_uihacks.getFullscreenState())
				_menu.AppendMenuItem(MF_STRING, 5, "Quit Fullscreen");
			else
				_menu.AppendMenuItem(MF_STRING, 5, "Fullscreen");
		} else {
			_menu.AppendMenuItem(MF_STRING, 7, "Switch to Main player");
		}

		if(utils.IsKeyPressed(VK_SHIFT)) {
			_menu.AppendMenuSeparator();
			_menu.AppendMenuItem(MF_STRING, 100, "Properties ");
			_menu.AppendMenuItem(MF_STRING, 101, "Configure...");
            _menu.AppendMenuSeparator();
			_menu.AppendMenuItem(MF_STRING, 102, "Reload");
		}
        idx = _menu.TrackPopupMenu(x,y);
        switch(true) {
            case (idx == 1):
				main_panel_state.setValue(0);
				get_colors();g_searchbox.adapt_look_to_layout();
                break;
            case (idx == 2):
				main_panel_state.setValue(1);
				get_colors();g_searchbox.adapt_look_to_layout();
                break;
            case (idx == 3):
				main_panel_state.setValue(2);
				get_colors();g_searchbox.adapt_look_to_layout();
                break;
            case (idx == 4):
				main_panel_state.setValue(3);
				get_colors();g_searchbox.adapt_look_to_layout();
                break;
            case (idx == 5):
				g_uihacks.toggleFullscreen();
                break;
            case (idx == 6):
				toggleLayoutMode(1);get_colors();g_searchbox.adapt_look_to_layout();
                break;
            case (idx == 7):
				toggleLayoutMode(0);get_colors();g_searchbox.adapt_look_to_layout();
                break;
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
				draw_settings_menu(x,y);
                break;
            default:
				return true;
        }
        _menu = undefined;
        return true;
}
function draw_settings_menu(x,y){
        var _menu = window.CreatePopupMenu();
		var _menu3 = window.CreatePopupMenu();
		var _menu3A = window.CreatePopupMenu();
		var _menu_button = window.CreatePopupMenu();
        var idx;

		_menu.AppendMenuItem(MF_STRING, 1811, "Compact title bar");
		_menu.CheckMenuItem(1811, compact_titlebar.isActive())
		_menu.AppendMenuItem((compact_titlebar.isActive() && layout_state.isEqual(0))?MF_GRAYED:MF_STRING, 1800, "Display played track title on top");
		_menu.CheckMenuItem(1800, properties.tracktitle_ontop)
		_menu.AppendMenuItem((compact_titlebar.isActive() && layout_state.isEqual(0))?MF_GRAYED:MF_STRING, 1809, "Played track title format...");
		_menu.AppendMenuItem(MF_STRING, 1805, "Capitalize panel buttons text");
		_menu.CheckMenuItem(1805, properties.toUpperCase)
		_menu.AppendMenuItem(MF_STRING, 1810, "Mini main menu button");
		_menu.CheckMenuItem(1810, properties.mini_mainmenu_button)

		_menu.AppendMenuItem(compact_titlebar.isActive() ? MF_GRAYED : MF_STRING, 1801, "Always show the search box");
		_menu.CheckMenuItem(1801, properties.alwaysShowSearch)

		_menu.AppendMenuItem(MF_STRING, 1900, "Resume panel state on startup");
		_menu.CheckMenuItem(1900, properties.Remember_previous_state)

		_menu.AppendMenuItem(MF_STRING, 1901, "Hide visualization panel");
		_menu.CheckMenuItem(1901, !properties.show_visualization)

		_menu.AppendMenuSeparator();
		_menu_button.AppendMenuItem(MF_STRING, 1806, "Right sidebar visibility");
		_menu_button.CheckMenuItem(1806, properties.showNowPlayingBtn);
		_menu_button.AppendMenuItem(MF_STRING, 1808, "Panel layout");
		_menu_button.CheckMenuItem(1808, properties.showConfigLayoutBtn);		
		_menu_button.AppendMenuItem(MF_STRING, 1807, "Right sidebar function");
		_menu_button.CheckMenuItem(1807, properties.showRightSidebarBtn);
		_menu_button.AppendMenuItem(MF_STRING, 1803, "Light switch");
		_menu_button.CheckMenuItem(1803, properties.showLightswitchBtn);
		_menu_button.AppendMenuItem(MF_STRING, 1804, "Fullscreen");
		_menu_button.CheckMenuItem(1804, properties.showFullscreenBtn);
		_menu_button.AppendTo(_menu,MF_STRING, "Buttons");

		_menu3.AppendMenuItem(MF_STRING, 2000, "Enable");
		_menu3.CheckMenuItem(2000, properties.showwallpaper);
		_menu3.AppendMenuItem(MF_STRING, 2200, "Blur");
		_menu3.CheckMenuItem(2200, properties.wallpaperblurred);

		_menu3A.AppendMenuItem(MF_STRING, 2210, "Filling");
		_menu3A.CheckMenuItem(2210, properties.wallpaperdisplay==0);
		_menu3A.AppendMenuItem(MF_STRING, 2220, "Adjust");
		_menu3A.CheckMenuItem(2220, properties.wallpaperdisplay==1);
		_menu3A.AppendMenuItem(MF_STRING, 2230, "Stretch");
		_menu3A.CheckMenuItem(2230, properties.wallpaperdisplay==2);
		_menu3A.AppendTo(_menu3,MF_STRING, "Wallpaper size");

		_menu3.AppendTo(_menu,MF_STRING, "Background Wallpaper");

        idx = _menu.TrackPopupMenu(x,y);
        switch(true) {
			case (idx == 1800):
				properties.tracktitle_ontop = !properties.tracktitle_ontop;
				window.SetProperty("_DISPLAY: Track title", properties.tracktitle_ontop);
				adapt_buttons_to_layout();
				window.Repaint();
				break;
			case (idx == 1801):
				properties.alwaysShowSearch = !properties.alwaysShowSearch;
				window.SetProperty("_DISPLAY: always show search box", properties.alwaysShowSearch);
				g_searchbox.toggleVisibility(true);
				adapt_buttons_to_layout();
				window.Repaint();
				break;
			case (idx == 1803):
				properties.showLightswitchBtn = !properties.showLightswitchBtn;
				window.SetProperty("_DISPLAY: show light switch btn", properties.showLightswitchBtn);
				adapt_buttons_to_layout();
				window.Repaint();
				break;
			case (idx == 1804):
				properties.showFullscreenBtn = !properties.showFullscreenBtn;
				window.SetProperty("_DISPLAY: show fullscreen btn", properties.showFullscreenBtn);
				adapt_buttons_to_layout();
				window.Repaint();
				break;
			case (idx == 1805):
				properties.toUpperCase = !properties.toUpperCase;
				window.SetProperty("_DISPLAY: panels btn text to uppercase", properties.toUpperCase);
				on_font_changed();
				main_panel_btns.toUpperCase(properties.toUpperCase);
				adapt_buttons_to_layout();
				window.Repaint();
				break;
			case (idx == 1806):
				properties.showNowPlayingBtn = !properties.showNowPlayingBtn;
				window.SetProperty("_DISPLAY: show now playing btn", properties.showNowPlayingBtn);
				adapt_buttons_to_layout();
				window.Repaint();
				break;
			case (idx == 1807):
				properties.showRightSidebarBtn = !properties.showRightSidebarBtn;
				window.SetProperty("_DISPLAY: show right sidebar btn", properties.showRightSidebarBtn);
				adapt_buttons_to_layout();
				window.Repaint();
				break;
			case (idx == 1808):
				properties.showConfigLayoutBtn = !properties.showConfigLayoutBtn;
				window.SetProperty("_DISPLAY: show configure layout btn", properties.showConfigLayoutBtn);
				adapt_buttons_to_layout();
				window.Repaint();
				break;				
			case (idx == 1809):
				try {
					new_caption_format = utils.InputBox(window.ID, "Enter a title formatting script.\nYou can use the full foobar2000 title formatting syntax here.\n\nSee http://tinyurl.com/lwhay6f\nfor informations about foobar title formatting.", "Custom windows title", properties.tracktitle_format, true);
					if (!(new_caption_format == "" || typeof new_caption_format == 'undefined')) {
						properties.tracktitle_format = new_caption_format;
						window.SetProperty("_DISPLAY: Track title format", properties.tracktitle_format);
						eval_caption_title(fb.GetNowPlaying());
					}
				} catch(e) {
				}
				window.Repaint();
				break;
			case (idx == 1810):
				properties.mini_mainmenu_button = !properties.mini_mainmenu_button;
				window.SetProperty("_DISPLAY: mini main menu button", properties.mini_mainmenu_button);
				adapt_buttons_to_layout();
				g_searchbox.on_size();
				window.Repaint();
				break;
			case (idx == 1811):
				compact_titlebar.toggleValue();
				get_colors();
				adapt_buttons_to_layout();
				window.Repaint();
				break;
			case (idx == 1809):
			case (idx == 1900):
				properties.Remember_previous_state = !properties.Remember_previous_state;
				window.SetProperty("Resume panel state on startup, except on visualization tab", properties.Remember_previous_state);
				window.Repaint();
				break;
			case (idx == 1901):
				properties.show_visualization = !properties.show_visualization;
				window.SetProperty("_PROPERTY show visualization tab", properties.show_visualization);
				if(main_panel_state.isEqual(3)) main_panel_state.setValue(0);
				get_colors();
				adapt_buttons_to_layout();
				window.Repaint();
				break;
			case (idx == 2000):
				properties.showwallpaper = !properties.showwallpaper;
				window.SetProperty("_DISPLAY: Show Wallpaper", properties.showwallpaper);
				get_colors();
				if(properties.showwallpaper) {
					g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.IsPlaying ? fb.GetNowPlaying() : null);
				};
				window.Repaint();
				break;
			case (idx == 2100):
				properties.wallpapermode = 99;
				window.SetProperty("_SYSTEM: Wallpaper Mode", properties.wallpapermode);
				if(fb.IsPlaying) g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
				window.Repaint();
				break;
			case (idx == 2110):
				properties.wallpapermode = 0;
				window.SetProperty("_SYSTEM: Wallpaper Mode", properties.wallpapermode);
				if(fb.IsPlaying) g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
				window.Repaint();
				break;
			case (idx == 2200):
				properties.wallpaperblurred = !properties.wallpaperblurred;
				window.SetProperty("_DISPLAY: Wallpaper Blurred", properties.wallpaperblurred);
				g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
				window.Repaint();
				break;
			case (idx == 2210):
				properties.wallpaperdisplay = 0;
				window.SetProperty("_DISPLAY: Wallpaper 0=Filling 1=Adjust 2=Stretch", properties.wallpaperdisplay);
				g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
				window.Repaint();
				break;
			case (idx == 2220):
				properties.wallpaperdisplay = 1;
				window.SetProperty("_DISPLAY: Wallpaper 0=Filling 1=Adjust 2=Stretch", properties.wallpaperdisplay);
				g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
				window.Repaint();
				break;
			case (idx == 2230):
				properties.wallpaperdisplay = 2;
				window.SetProperty("_DISPLAY: Wallpaper 0=Filling 1=Adjust 2=Stretch", properties.wallpaperdisplay);
				g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
				window.Repaint();
				break;
            default:
				return true;
        }

        _menu = undefined;
		_menu3 = undefined;
		_menu3A = undefined;
		_menu_button = undefined;
        return true;
}
function draw_layout_menu(x,y){
    var basemenu = window.CreatePopupMenu();
	library_menu = window.CreatePopupMenu();
	playlists_menu = window.CreatePopupMenu();
	bio_menu = window.CreatePopupMenu();
	visu_menu = window.CreatePopupMenu();
	minimode_menu = window.CreatePopupMenu();
	right_menu_trackdetails = window.CreatePopupMenu();
	
	wallpaper_visibility = window.CreatePopupMenu();
	wallpaper_visibility.AppendMenuItem(MF_STRING, 4005, "Enable");
	wallpaper_visibility.AppendMenuItem(MF_STRING, 4006, "Disable");
	wallpaper_blur = window.CreatePopupMenu();
	wallpaper_blur.AppendMenuItem(MF_STRING, 4007, "Enable");
	wallpaper_blur.AppendMenuItem(MF_STRING, 4008, "Disable");

	nowplaying = window.CreatePopupMenu();
	var now_playing_state = getNowPlayingState();
	if(now_playing_state==1) nowplaying.AppendMenuItem(MF_STRING, 4027, "Hide");
	else nowplaying.AppendMenuItem(MF_STRING, 4027, "Show");
	
	right_menu_trackdetails.AppendMenuItem(MF_STRING, 202, "Show on top");	
	right_menu_trackdetails.AppendMenuItem(MF_STRING, 203, "Show on bottom");			
	right_menu_trackdetails.AppendMenuItem(MF_STRING, 204, "Hide");
	var track_infos_state = getTrackInfosState();
	if(track_infos_state==0) var checked = 204;
	else if(track_infos_state==1) var checked = 202;
	else if(track_infos_state==2) var checked = 203;
	right_menu_trackdetails.CheckMenuRadioItem(202, 204, checked);				
	right_menu_trackdetails.AppendTo(nowplaying,MF_STRING, "Album art / track infos");	
		
	nowplaying.AppendMenuSeparator();
	nowplaying.AppendMenuItem((now_playing_state?MF_STRING:MF_GRAYED), 4030, "Increase width");
	nowplaying.AppendMenuItem((now_playing_state?MF_STRING:MF_GRAYED), 4031, "Decrease width");
	nowplaying.AppendMenuItem((now_playing_state?MF_STRING:MF_GRAYED), 4033, "Custom width...");
	nowplaying.AppendMenuItem((now_playing_state?MF_STRING:MF_GRAYED), 4032, "Reset");

	if(layout_state.isEqual(1)){
		basemenu.AppendMenuItem(MF_GRAYED, 0, "Minimode Layout");
		basemenu.AppendMenuSeparator();		
		basemenu.AppendMenuItem(MF_STRING, 3990, "Dark theme");
		basemenu.CheckMenuItem(3990, properties.minimode_dark_theme);
		wallpaper_visibility.AppendTo(basemenu,MF_STRING, "Wallpapers visibility");
		wallpaper_blur.AppendTo(basemenu,MF_STRING, "Wallpapers blur");
	} else if(main_panel_state.isEqual(0)){
		basemenu.AppendMenuItem(MF_GRAYED, 0, "Library Layout");
		basemenu.AppendMenuSeparator();				
		nowplaying.AppendTo(basemenu,MF_STRING, "Right playlist");
		left_menu = window.CreatePopupMenu();
		left_menu.AppendTo(basemenu,MF_STRING, "Left menu");
		if(libraryfilter_state.isActive()) left_menu.AppendMenuItem(MF_STRING, 4028, "Hide");
		else left_menu.AppendMenuItem(MF_STRING, 4028, "Show");
		left_menu.AppendMenuSeparator();
		left_menu.AppendMenuItem((libraryfilter_state.isActive()?MF_STRING:MF_GRAYED), 4034, "Increase width");
		left_menu.AppendMenuItem((libraryfilter_state.isActive()?MF_STRING:MF_GRAYED), 4035, "Decrease width");
		left_menu.AppendMenuItem((libraryfilter_state.isActive()?MF_STRING:MF_GRAYED), 4037, "Custom width...");
		left_menu.AppendMenuItem((libraryfilter_state.isActive()?MF_STRING:MF_GRAYED), 4036, "Reset");
		basemenu.AppendMenuSeparator();
		basemenu.AppendMenuItem(MF_STRING, 4000, "Dark theme");
		basemenu.CheckMenuItem(4000, properties.library_dark_theme);
		wallpaper_visibility.AppendTo(basemenu,MF_STRING, "Wallpapers visibility");
		wallpaper_blur.AppendTo(basemenu,MF_STRING, "Wallpapers blur");
	} else if(main_panel_state.isEqual(1)){
		basemenu.AppendMenuItem(MF_GRAYED, 0, "Playlists Layout");
		basemenu.AppendMenuSeparator();				
		nowplaying.AppendTo(basemenu,MF_STRING, "Right playlist");
		playlistpanel_menu = window.CreatePopupMenu();
		playlistpanel_menu.AppendTo(basemenu,MF_STRING, "Playlist panel");
		playlistpanel_menu.AppendMenuItem(MF_STRING, 4038, "Increase width");
		playlistpanel_menu.AppendMenuItem(MF_STRING, 4039, "Decrease width");
		playlistpanel_menu.AppendMenuItem(MF_STRING, 4041, "Custom width...");
		playlistpanel_menu.AppendMenuItem(MF_STRING, 4040, "Reset");
		var FiltersMenu = window.CreatePopupMenu();
		if(filters_panel_state.value>0)
			FiltersMenu.AppendMenuItem(MF_STRING, 4990, "Hide");
		else
			FiltersMenu.AppendMenuItem(MF_STRING, 4988, "Show");
		FiltersMenu.AppendMenuItem(MF_STRING, 4992, "Increase height");
		FiltersMenu.AppendMenuItem((filters_panel_state.isActive()? MF_STRING : MF_GRAYED), 4991, "Decrease height");
		FiltersMenu.AppendMenuSeparator();
		FiltersMenu.AppendMenuItem((filters_panel_state.isActive() ? MF_STRING : MF_GRAYED | MF_DISABLED), 4993, "Enable 1st filter");
		FiltersMenu.CheckMenuItem(4993, (filter1_state.isActive()));
		FiltersMenu.AppendMenuItem((filters_panel_state.isActive() ? MF_STRING : MF_GRAYED | MF_DISABLED), 4994, "Enable 2nd filter");
		FiltersMenu.CheckMenuItem(4994, (filter2_state.isActive()));
		FiltersMenu.AppendMenuItem((filters_panel_state.isActive() ? MF_STRING : MF_GRAYED | MF_DISABLED), 4995, "Enable 3rd filter");
		FiltersMenu.CheckMenuItem(4995, (filter3_state.isActive()));
		FiltersMenu.AppendTo(basemenu, MF_STRING, "Filters");
		if(!filters_panel_state.isMaximumValue()) basemenu.AppendMenuItem(MF_STRING, 4996, "Hide bottom playlist");
		else basemenu.AppendMenuItem(MF_STRING, 4997, "Show bottom playlist");
		basemenu.AppendMenuSeparator();
		basemenu.AppendMenuItem(MF_STRING, 4001, "Dark theme");
		basemenu.CheckMenuItem(4001, properties.playlists_dark_theme);
		wallpaper_visibility.AppendTo(basemenu,MF_STRING, "Wallpapers visibility");
		wallpaper_blur.AppendTo(basemenu,MF_STRING, "Wallpapers blur");
	} else if(main_panel_state.isEqual(2)){
		basemenu.AppendMenuItem(MF_GRAYED, 0, "Now playing Layout");
		basemenu.AppendMenuSeparator();				
		nowplaying.AppendTo(basemenu,MF_STRING, "Right playlist");

		if(!lyrics_state.isActive()){
			basemenu.AppendMenuItem(MF_STRING, 4999, "Show lyrics");
		} else {
			var LyricsMenu = window.CreatePopupMenu();
			LyricsMenu.AppendMenuItem(MF_STRING, 5000, "Hide");
			LyricsMenu.AppendMenuSeparator();
			LyricsMenu.AppendMenuItem((!lyrics_state.isMaximumValue())?MF_STRING:MF_GRAYED, 4999, "Increase width");
			LyricsMenu.AppendMenuItem(MF_STRING, 4998, "Decrease width");
			LyricsMenu.AppendTo(basemenu, MF_STRING, "Lyrics panel");
			LyricsMenu.AppendMenuSeparator();
			LyricsMenu.AppendMenuItem(MF_STRING, 6000, "Show toggle buttons");
			LyricsMenu.AppendMenuItem(MF_STRING, 6001, "Hide toggle buttons");			
		}
		basemenu.AppendMenuSeparator();
		basemenu.AppendMenuItem(MF_STRING, 4002, "Dark theme");
		basemenu.CheckMenuItem(4002, properties.bio_dark_theme);
		wallpaper_visibility.AppendTo(basemenu,MF_STRING, "Wallpapers visibility");
		wallpaper_blur.AppendTo(basemenu,MF_STRING, "Wallpapers blur");
	} else if(main_panel_state.isEqual(3)){
		basemenu.AppendMenuItem(MF_GRAYED, 0, "Visualization Layout");
		basemenu.AppendMenuSeparator();				
		nowplaying.AppendTo(basemenu,MF_STRING, "Right playlist");
		basemenu.AppendMenuSeparator();
		basemenu.AppendMenuItem(MF_STRING, 4003, "Dark theme");
		basemenu.CheckMenuItem(4003, properties.visualization_dark_theme);
	}

    idx = basemenu.TrackPopupMenu(x, y, 0x0008);

    switch (true) {
	case (idx == 202):
		if(getNowPlayingState()==1) {
			toggleTrackInfosState(false,1,true);
		} else {
			toggleTrackInfosState(false,1,false);
			toggleNowPlayingState();
		}
		window.Repaint();
		break;
	case (idx == 203):
		if(getNowPlayingState()==1) {
			toggleTrackInfosState(false,2,true);
		} else {
			toggleTrackInfosState(false,2,false);
			toggleNowPlayingState();
		}			
		window.Repaint();
		break;	
	case (idx == 204):
		if(getNowPlayingState()==1) {
			toggleTrackInfosState(false,0,true);
		} else {
			toggleTrackInfosState(false,0,false);
		}				
		window.Repaint();
		break;			
   case (idx == 3990):
		properties.minimode_dark_theme=!properties.minimode_dark_theme;
        window.NotifyOthers("minimode_dark_theme",properties.minimode_dark_theme);
		window.SetProperty("MINIMODE dark theme", properties.minimode_dark_theme);
		get_colors();g_searchbox.adapt_look_to_layout();
        window.Repaint();
        break;
   case (idx == 4000):
		properties.library_dark_theme=!properties.library_dark_theme;
        window.NotifyOthers("library_dark_theme",properties.library_dark_theme);
		window.SetProperty("LIBRARY dark theme", properties.library_dark_theme);
		on_notify_data("library_dark_theme",properties.library_dark_theme);
        window.Repaint();
        break;
   case (idx == 4001):
		properties.playlists_dark_theme=!properties.playlists_dark_theme;
        window.NotifyOthers("playlists_dark_theme",properties.playlists_dark_theme);
		window.SetProperty("PLAYLISTS dark theme", properties.playlists_dark_theme);
		on_notify_data("playlists_dark_theme",properties.playlists_dark_theme);
		fb.RunMainMenuCommand("View/ElPlaylist/Refresh");
        window.Repaint();
        break;
   case (idx == 4002):
		properties.bio_dark_theme=!properties.bio_dark_theme;
        window.NotifyOthers("bio_dark_theme",properties.bio_dark_theme);
		window.SetProperty("BIO dark theme", properties.bio_dark_theme);
		on_notify_data("bio_dark_theme",properties.bio_dark_theme);
        window.Repaint();
        break;
   case (idx == 4003):
		properties.visualization_dark_theme=!properties.visualization_dark_theme;
        window.NotifyOthers("visualization_dark_theme",properties.visualization_dark_theme);
		window.SetProperty("VISUALIZATION dark theme", properties.visualization_dark_theme);
		on_notify_data("visualization_dark_theme",properties.visualization_dark_theme);
        break;
   case (idx == 4005):
        window.NotifyOthers("wallpaperVisibility",true);
		//on_notify_data("wallpaperVisibility",true);
        break;
   case (idx == 4006):
        window.NotifyOthers("wallpaperVisibility",false);
		//on_notify_data("wallpaperVisibility",false);
        break;
   case (idx == 4007):
        window.NotifyOthers("wallpaperBlur",true);
		on_notify_data("wallpaperBlur",true);
        break;
   case (idx == 4008):
        window.NotifyOthers("wallpaperBlur",false);
		on_notify_data("wallpaperBlur",false);
        break;
	case (idx == 4012):
		globalProperties.fontAdjustement++;
		window.SetProperty("GLOBAL Font Adjustement", globalProperties.fontAdjustement);
		window.NotifyOthers('set_font',globalProperties.fontAdjustement);
		on_font_changed();
		break;
	case (idx == 4013):
		globalProperties.fontAdjustement--;
		window.SetProperty("GLOBAL Font Adjustement", globalProperties.fontAdjustement);
		window.NotifyOthers('set_font',globalProperties.fontAdjustement);
		on_font_changed();
		break;
	case (idx == 4014):
		globalProperties.fontAdjustement = 0;
		window.SetProperty("GLOBAL Font Adjustement", globalProperties.fontAdjustement);
		window.NotifyOthers('set_font',globalProperties.fontAdjustement);
		on_font_changed();
		break;
	case (idx == 4021):
		Lightswitch(true,true);
		break;
	case (idx == 4022):
		Lightswitch(true,false);
		break;
	case (idx == 4027):
		toggleNowPlayingState();
		break;
	case (idx == 4028):
		libraryfilter_state.toggleValue();
		build_buttons();
		window.Repaint();
		break;
	case (idx == 4030):
		rightplaylist_width.increment(10);
		break;
	case (idx == 4031):
		rightplaylist_width.decrement(10);
		break;
	case (idx == 4032):
		rightplaylist_width.setDefault();
		break;
	case (idx == 4033):
		rightplaylist_width.userInputValue("Enter the desired width in pixel.\nDefault width is 270px.\nMinimum width: 100px. Maximum width: 900px", "Custom playlist width");
		break;
	case (idx == 4034):
		libraryfilter_width.increment(10);
		break;
	case (idx == 4035):
		libraryfilter_width.decrement(10);
		break;
	case (idx == 4036):
		libraryfilter_width.setDefault();
		break;
	case (idx == 4037):
		libraryfilter_width.userInputValue("Enter the desired width in pixel.\nDefault width is 210px.\nMinimum width: 100px. Maximum width: 900px", "Custom left menu width");
		break;
	case (idx == 4038):
		playlistpanel_width.increment(10);
		break;
	case (idx == 4039):
		playlistpanel_width.decrement(10);
		break;
	case (idx == 4040):
		playlistpanel_width.setDefault();
		break;
	case (idx == 4041):
		playlistpanel_width.userInputValue("Enter the desired width in pixel.\nDefault width is 180px.\nMinimum width: 100px. Maximum width: 900px", "Custom left menu width");
		break;
    case (idx == 4988):
		if(properties.savedFilterState>=0 && !properties.displayToggleBtns) filters_panel_state.setValue(properties.savedFilterState);
		else filters_panel_state.setValue(1);
        break;
    case (idx == 4990):
		saveFilterState();
		filters_panel_state.setValue(0);
        break;
    case (idx == 4991):
		filters_panel_state.decrement(1);
        break;
    case (idx == 4992):
		filters_panel_state.increment(1);
        break;
    case (idx == 4993):
		if(!filter2_state.isActive() && !filter3_state.isActive()) filters_panel_state.setValue(0);
		else filter1_state.toggleValue();
        break;
    case (idx == 4994):
		if(!filter1_state.isActive() && !filter3_state.isActive()) filters_panel_state.setValue(0);
		else filter2_state.toggleValue();
        break;
    case (idx == 4995):
		if(!filter1_state.isActive() && !filter2_state.isActive()) filters_panel_state.setValue(0);
		else filter3_state.toggleValue();
        break;
    case (idx == 4996):
		saveFilterState();
		filters_panel_state.setValue(filters_panel_state.max_value);
        break;
    case (idx == 4997):
		if(properties.savedFilterState>=0) filters_panel_state.setValue(properties.savedFilterState);
		else filters_panel_state.setValue(1);
        break;
    case (idx == 4998):
		lyrics_state.decrement(1);
        break;
    case (idx == 4999):
		lyrics_state.increment(1);
        break;
    case (idx == 6000):
		window.NotifyOthers("show_lyrics_btns",true);
        break;		
    case (idx == 6001):
		window.NotifyOthers("show_lyrics_btns",false);
        break;			
    case (idx == 5000):
		lyrics_state.setValue(0);
        break;
    }

    basemenu = undefined;
    contextman = undefined;
    menuman1 = undefined;
    menuman2 = undefined;
    menuman3 = undefined;
    menuman4 = undefined;
    menuman5 = undefined;
    menuman6 = undefined;
	minimode_menu = undefined;
	font_size = undefined;
	if(FiltersMenu) FiltersMenu = undefined;
	right_menu_trackdetails = undefined;
    library_menu = undefined;
    playlists_menu = undefined;
    bio_menu = undefined;
    wallpaper_visibility = undefined;
    wallpaper_blur = undefined;
	return true;
}
function draw_main_menu(x,y){

    var basemenu = window.CreatePopupMenu();
    var contextman = fb.CreateContextMenuManager();

    contextman.InitNowPlaying();

    var child1 = window.CreatePopupMenu(); //File
    var child2 = window.CreatePopupMenu(); //Edit
    var child3 = window.CreatePopupMenu(); //View
    var child4 = window.CreatePopupMenu(); //Playback
    var child5 = window.CreatePopupMenu(); //Library
    var child6 = window.CreatePopupMenu(); //Help
    var child7 = window.CreatePopupMenu(); //Now playing
	
    var menuman1 = fb.CreateMainMenuManager();
    var menuman2 = fb.CreateMainMenuManager();
    var menuman3 = fb.CreateMainMenuManager();
    var menuman4 = fb.CreateMainMenuManager();
    var menuman5 = fb.CreateMainMenuManager();
    var menuman6 = fb.CreateMainMenuManager();

    child1.AppendTo(basemenu, MF_STRING, "File");
    child2.AppendTo(basemenu, MF_STRING, "Edit");
    child3.AppendTo(basemenu, MF_STRING, "View");
    child4.AppendTo(basemenu, MF_STRING, "Playback");
    child5.AppendTo(basemenu, MF_STRING, "Library");
    child6.AppendTo(basemenu, MF_STRING, "Help");
	if(fb.IsPlaying) child7.AppendTo(basemenu, MF_STRING, "Now Playing");

	skin_settings_menu = window.CreatePopupMenu();
	library_menu = window.CreatePopupMenu();
	playlists_menu = window.CreatePopupMenu();
	bio_menu = window.CreatePopupMenu();
	visu_menu = window.CreatePopupMenu();
	minimode_menu = window.CreatePopupMenu();
	appearance_menu = window.CreatePopupMenu();
	basemenu.AppendMenuSeparator();

	wallpaper_visibility = window.CreatePopupMenu();
	wallpaper_visibility.AppendMenuItem(MF_STRING, 4005, "Enable");
	wallpaper_visibility.AppendMenuItem(MF_STRING, 4006, "Disable");
	wallpaper_blur = window.CreatePopupMenu();
	wallpaper_blur.AppendMenuItem(MF_STRING, 4007, "Enable");
	wallpaper_blur.AppendMenuItem(MF_STRING, 4008, "Disable");

	nowplaying = window.CreatePopupMenu();
	var now_playing_state = getNowPlayingState();
	if(now_playing_state==1) nowplaying.AppendMenuItem(MF_STRING, 4027, "Hide");
	else nowplaying.AppendMenuItem(MF_STRING, 4027, "Show");
	nowplaying.AppendMenuSeparator();
	nowplaying.AppendMenuItem((now_playing_state?MF_STRING:MF_GRAYED), 4030, "Increase width");
	nowplaying.AppendMenuItem((now_playing_state?MF_STRING:MF_GRAYED), 4031, "Decrease width");
	nowplaying.AppendMenuItem((now_playing_state?MF_STRING:MF_GRAYED), 4033, "Custom width...");
	nowplaying.AppendMenuItem((now_playing_state?MF_STRING:MF_GRAYED), 4032, "Reset");

	if(layout_state.isEqual(1)){
		minimode_menu.AppendTo(skin_settings_menu,MF_STRING, "Panel layout");
		minimode_menu.AppendMenuItem(MF_STRING, 3990, "Dark theme");
		minimode_menu.CheckMenuItem(3990, properties.minimode_dark_theme);
		wallpaper_visibility.AppendTo(minimode_menu,MF_STRING, "Wallpapers visibility");
		wallpaper_blur.AppendTo(minimode_menu,MF_STRING, "Wallpapers blur");
	} else if(main_panel_state.isEqual(0)){
		library_menu.AppendTo(skin_settings_menu,MF_STRING, "Panel layout");
		nowplaying.AppendTo(library_menu,MF_STRING, "Right playlist");
		left_menu = window.CreatePopupMenu();
		left_menu.AppendTo(library_menu,MF_STRING, "Left menu");
		if(libraryfilter_state.isActive()) left_menu.AppendMenuItem(MF_STRING, 4028, "Hide");
		else left_menu.AppendMenuItem(MF_STRING, 4028, "Show");
		left_menu.AppendMenuSeparator();
		left_menu.AppendMenuItem((libraryfilter_state.isActive()?MF_STRING:MF_GRAYED), 4034, "Increase width");
		left_menu.AppendMenuItem((libraryfilter_state.isActive()?MF_STRING:MF_GRAYED), 4035, "Decrease width");
		left_menu.AppendMenuItem((libraryfilter_state.isActive()?MF_STRING:MF_GRAYED), 4037, "Custom width...");
		left_menu.AppendMenuItem((libraryfilter_state.isActive()?MF_STRING:MF_GRAYED), 4036, "Reset");
		library_menu.AppendMenuSeparator();
		library_menu.AppendMenuItem(MF_STRING, 4000, "Dark theme");
		library_menu.CheckMenuItem(4000, properties.library_dark_theme);
		wallpaper_visibility.AppendTo(library_menu,MF_STRING, "Wallpapers visibility");
		wallpaper_blur.AppendTo(library_menu,MF_STRING, "Wallpapers blur");
	} else if(main_panel_state.isEqual(1)){
		playlists_menu.AppendTo(skin_settings_menu,MF_STRING, "Panel layout");
		nowplaying.AppendTo(playlists_menu,MF_STRING, "Right playlist");
		playlistpanel_menu = window.CreatePopupMenu();
		playlistpanel_menu.AppendTo(playlists_menu,MF_STRING, "Playlist panel");
		playlistpanel_menu.AppendMenuItem(MF_STRING, 4038, "Increase width");
		playlistpanel_menu.AppendMenuItem(MF_STRING, 4039, "Decrease width");
		playlistpanel_menu.AppendMenuItem(MF_STRING, 4041, "Custom width...");
		playlistpanel_menu.AppendMenuItem(MF_STRING, 4040, "Reset");
		var FiltersMenu = window.CreatePopupMenu();
		if(filters_panel_state.value>0)
			FiltersMenu.AppendMenuItem(MF_STRING, 4990, "Hide");
		else
			FiltersMenu.AppendMenuItem(MF_STRING, 4988, "Show");
		FiltersMenu.AppendMenuItem(MF_STRING, 4992, "Increase height");
		FiltersMenu.AppendMenuItem((filters_panel_state.isActive()? MF_STRING : MF_GRAYED), 4991, "Decrease height");
		FiltersMenu.AppendMenuSeparator();
		FiltersMenu.AppendMenuItem((filters_panel_state.isActive() ? MF_STRING : MF_GRAYED | MF_DISABLED), 4993, "Enable 1st filter");
		FiltersMenu.CheckMenuItem(4993, (filter1_state.isActive()));
		FiltersMenu.AppendMenuItem((filters_panel_state.isActive() ? MF_STRING : MF_GRAYED | MF_DISABLED), 4994, "Enable 2nd filter");
		FiltersMenu.CheckMenuItem(4994, (filter2_state.isActive()));
		FiltersMenu.AppendMenuItem((filters_panel_state.isActive() ? MF_STRING : MF_GRAYED | MF_DISABLED), 4995, "Enable 3rd filter");
		FiltersMenu.CheckMenuItem(4995, (filter3_state.isActive()));
		FiltersMenu.AppendTo(playlists_menu, MF_STRING, "Filters");
		if(!filters_panel_state.isMaximumValue()) playlists_menu.AppendMenuItem(MF_STRING, 4996, "Hide bottom playlist");
		else playlists_menu.AppendMenuItem(MF_STRING, 4997, "Show bottom playlist");
		playlists_menu.AppendMenuSeparator();
		playlists_menu.AppendMenuItem(MF_STRING, 4001, "Dark theme");
		playlists_menu.CheckMenuItem(4001, properties.playlists_dark_theme);
		wallpaper_visibility.AppendTo(playlists_menu,MF_STRING, "Wallpapers visibility");
		wallpaper_blur.AppendTo(playlists_menu,MF_STRING, "Wallpapers blur");
	} else if(main_panel_state.isEqual(2)){
		bio_menu.AppendTo(skin_settings_menu,MF_STRING, "Panel layout");

		nowplaying.AppendTo(bio_menu,MF_STRING, "Right playlist");

		if(!lyrics_state.isActive()){
			bio_menu.AppendMenuItem(MF_STRING, 4999, "Show lyrics");
		} else {
			var LyricsMenu = window.CreatePopupMenu();
			LyricsMenu.AppendMenuItem(MF_STRING, 5000, "Hide");
			LyricsMenu.AppendMenuSeparator();
			LyricsMenu.AppendMenuItem((!lyrics_state.isMaximumValue())?MF_STRING:MF_GRAYED, 4999, "Increase width");
			LyricsMenu.AppendMenuItem(MF_STRING, 4998, "Decrease width");
			LyricsMenu.AppendTo(bio_menu, MF_STRING, "Lyrics panel");
		}

		bio_menu.AppendMenuSeparator();
		bio_menu.AppendMenuItem(MF_STRING, 4002, "Dark theme");
		bio_menu.CheckMenuItem(4002, properties.bio_dark_theme);
		wallpaper_visibility.AppendTo(bio_menu,MF_STRING, "Wallpapers visibility");
		wallpaper_blur.AppendTo(bio_menu,MF_STRING, "Wallpapers blur");
	} else if(main_panel_state.isEqual(3)){
		visu_menu.AppendTo(skin_settings_menu,MF_STRING, "Panel layout");
		nowplaying.AppendTo(visu_menu,MF_STRING, "Right playlist");
		visu_menu.AppendMenuSeparator();
		visu_menu.AppendMenuItem(MF_STRING, 4003, "Dark theme");
		visu_menu.CheckMenuItem(4003, properties.visualization_dark_theme);
	}

	appearance_menu.AppendTo(skin_settings_menu, MF_STRING, "Global layout");
	nowplayinglobal = window.CreatePopupMenu();
	nowplayinglobal.AppendMenuItem(MF_STRING, 4072, "Hide");
	nowplayinglobal.AppendMenuItem(MF_STRING, 4073, "Show");
	nowplayinglobal.AppendMenuSeparator();
	nowplayinglobal.AppendMenuItem(MF_STRING, 4030, "Increase width");
	nowplayinglobal.AppendMenuItem(MF_STRING, 4031, "Decrease width");
	nowplayinglobal.AppendMenuItem(MF_STRING, 4033, "Custom width...");
	nowplayinglobal.AppendMenuItem(MF_STRING, 4032, "Reset");
	nowplayinglobal.AppendTo(appearance_menu,MF_STRING, "Right playlist");
	appearance_menu.AppendMenuItem(MF_STRING, 4046, "Enable resizable borders");
	appearance_menu.CheckMenuItem(4046, globalProperties.enableResizableBorders);

	wallpaper_visibility_global = window.CreatePopupMenu();
	wallpaper_visibility_global.AppendMenuItem(MF_STRING, 40051, "Enable");
	wallpaper_visibility_global.AppendMenuItem(MF_STRING, 40061, "Disable");
	wallpaper_blur_global = window.CreatePopupMenu();
	wallpaper_blur_global.AppendMenuItem(MF_STRING, 40071, "Enable");
	wallpaper_blur_global.AppendMenuItem(MF_STRING, 40081, "Disable");
	appearance_menu.AppendMenuSeparator();
	wallpaper_visibility_global.AppendTo(appearance_menu,MF_STRING, "Wallpapers visibility");
	wallpaper_blur_global.AppendTo(appearance_menu,MF_STRING, "Wallpapers blur");

	font_size = window.CreatePopupMenu();
	font_size.AppendTo(skin_settings_menu,MF_STRING, "Font size");
	font_size.AppendMenuItem(MF_STRING, 4012, "Increase");
	font_size.AppendMenuItem(MF_STRING, 4013, "Decrease");
	font_size.AppendMenuItem(MF_STRING, 4014, "Reset");
	font_size.AppendMenuSeparator();
	font_size.AppendMenuItem(MF_DISABLED, 0, "Tip: Hold CTRL and use your");
	font_size.AppendMenuItem(MF_DISABLED, 0, "mouse wheel over (almost) any panel!");

	colors_menu = window.CreatePopupMenu();
	colors_menu.AppendTo(skin_settings_menu,MF_STRING, "Colors");
	main_panel = window.CreatePopupMenu();
	main_panel.AppendTo(colors_menu,MF_STRING, "Main panel");
	main_panel.AppendMenuItem(MF_STRING, 5001, "Pure white");
	main_panel.AppendMenuItem(MF_STRING, 5002, "White and album art");
	main_panel.AppendMenuItem(MF_STRING, 5003, "White and grey and album art");
	main_panel.AppendMenuSeparator();
	main_panel.AppendMenuItem(MF_STRING, 5011, "Pure Dark");
	main_panel.AppendMenuItem(MF_STRING, 5012, "Dark and album art");
	main_panel.AppendMenuItem(MF_STRING, 5013, "Dark and coal and album art");
	if(layout_state.isEqual(0)) var checked_item = (properties.darklayout?10:0);
	else var checked_item = (properties.library_dark_theme?10:0);
	main_panel.CheckMenuItem(5001+globalProperties.colorsMainPanel+checked_item, true);

	mini_player = window.CreatePopupMenu();
	mini_player.AppendTo(colors_menu,MF_STRING, "Mini player");
	mini_player.AppendMenuItem(MF_STRING, 5201, "Pure white");
	mini_player.AppendMenuItem(MF_STRING, 5202, "White and album art");
	mini_player.AppendMenuSeparator();
	mini_player.AppendMenuItem(MF_STRING, 5203, "Pure Dark");
	mini_player.AppendMenuItem(MF_STRING, 5204, "Dark and album art");
	mini_player.CheckMenuItem(5201+globalProperties.colorsMiniPlayer+(properties.minimode_dark_theme?2:0), true);

	control_bar = window.CreatePopupMenu();
	control_bar.AppendTo(colors_menu,MF_STRING, "Control bar");
	control_bar.AppendMenuItem(MF_STRING, 5101, "Pure white");
	control_bar.AppendMenuItem(MF_STRING, 5102, "White and album art");
	control_bar.AppendMenuSeparator();
	control_bar.AppendMenuItem(MF_STRING, 5103, "Pure Dark");
	control_bar.AppendMenuItem(MF_STRING, 5104, "Dark and album art");
	control_bar.AppendMenuSeparator();
	control_bar.AppendMenuItem(MF_STRING, 5105, "Adapt colors to Main panel");
	control_bar.CheckMenuItem(5101+globalProperties.colorsControls, true);

	/*appearance_menu.AppendMenuItem(MF_STRING, 4025, "Enable disk cover cache");
	appearance_menu.CheckMenuItem(4025, globalProperties.enableDiskCache);
	appearance_menu.AppendMenuItem((globalProperties.enableDiskCache)?MF_STRING:MF_GRAYED, 4023, "Load all covers at startup");
	appearance_menu.CheckMenuItem(4023, globalProperties.load_covers_at_startup);
	appearance_menu.AppendMenuItem((globalProperties.enableDiskCache)?MF_STRING:MF_GRAYED, 4024, "Load all artist thumbnails at startup");
	appearance_menu.CheckMenuItem(4024, globalProperties.load_artist_img_at_startup);	*/

	skin_settings_menu.AppendMenuSeparator();
	/*mem_solicitation = window.CreatePopupMenu();
	mem_solicitation.AppendMenuItem(MF_STRING, 4042, "0 - Minimum");
	mem_solicitation.AppendMenuItem(MF_STRING, 4043, "1 - Keep loaded covers in memory");
	mem_solicitation.AppendMenuItem(MF_STRING, 4044, "2 - Load all covers at startup");
	mem_solicitation.AppendMenuItem(MF_STRING, 4045, "3 - Load all covers && artist thumbnails at startup");
	mem_solicitation.AppendMenuSeparator();
	mem_solicitation.CheckMenuRadioItem(4042, 4045, 4042+globalProperties.mem_solicitation);
	mem_solicitation.AppendMenuItem(MF_STRING, 4026, "Reset images cache");
	mem_solicitation.AppendTo(skin_settings_menu, MF_STRING, "Covers && Memory usage");*/

	skin_settings_menu.AppendMenuItem(MF_STRING, 4029, "Covers && Memory usage");
	skin_settings_menu.AppendMenuItem(MF_STRING, 4026, "Reset images cache");
	skin_settings_menu.AppendMenuSeparator();

	var ratingMenu = window.CreatePopupMenu();
	ratingMenu.AppendMenuItem(MF_STRING, 4047, "Save to/Load from file tags");
	ratingMenu.AppendMenuItem(MF_STRING, 4048, "Save to/Load from playback statistics database");
		checked_item=0;
		if (globalProperties.use_ratings_file_tags)
			checked_item = 4047;
		else
			checked_item = 4048;
	ratingMenu.CheckMenuRadioItem(4047, 4048, checked_item);
	ratingMenu.AppendTo(skin_settings_menu, MF_STRING, "Ratings");

	var schedulerMenu = window.CreatePopupMenu();
	schedulerMenu.AppendMenuItem(MF_STRING, 3018, "Do nothing");
	schedulerMenu.AppendMenuSeparator();
	schedulerMenu.AppendMenuItem(MF_STRING, 3019, "Stop after current");
	schedulerMenu.AppendMenuItem(MF_STRING, 3020, "Hibernate after current");
	schedulerMenu.AppendMenuItem(MF_STRING, 3021, "Shutdown after current");
	schedulerMenu.AppendMenuSeparator();
	schedulerMenu.AppendMenuItem(MF_STRING, 3022, "Hibernate after playlist");
	schedulerMenu.AppendMenuItem(MF_STRING, 3023, "Shutdown after playlist");
		checked_item=0;
		switch (true) {
			case (scheduler.hibernate_after_current):
				checked_item=3020
				break;
			case (scheduler.shutdown_after_current):
				checked_item=3021
				break;
			case (scheduler.hibernate_after_playlist):
				checked_item=3022
				break;
			case (scheduler.shutdown_after_playlist):
				checked_item=3023
				break;
			case (fb.StopAfterCurrent):
				checked_item=3019
				break;
			default:
				checked_item=3018
				break;
		}
	schedulerMenu.CheckMenuRadioItem(3018, 3023, checked_item);
	schedulerMenu.AppendTo(skin_settings_menu, MF_STRING, "Scheduler");

	if(layout_state.isEqual(0)) {
		skin_settings_menu.AppendMenuItem(MF_STRING, 4010, "Compact player");
		if(g_uihacks.getFullscreenState())
			skin_settings_menu.AppendMenuItem(MF_STRING, 4009, "Quit Fullscreen");
		else
			skin_settings_menu.AppendMenuItem(MF_STRING, 4009, "Fullscreen");
	} else {
		skin_settings_menu.AppendMenuItem(MF_STRING, 4011, "Main player");
	}
	skin_settings_menu.AppendMenuSeparator();
	skin_settings_menu.AppendMenuItem(MF_GRAYED, 0, "Eole v"+globalProperties.theme_version);

	skin_settings_menu.AppendTo(basemenu, MF_STRING, "Skin settings");

    menuman1.Init("file");
    menuman2.Init("edit");
    menuman3.Init("View");
    menuman4.Init("playback");
    menuman5.Init("library");
    menuman6.Init("help");

    menuman1.BuildMenu(child1, 1001, 200);
    menuman2.BuildMenu(child2, 1201, 200);
    menuman3.BuildMenu(child3, 1401, 200);
    menuman4.BuildMenu(child4, 1601, 300);
    menuman5.BuildMenu(child5, 1901, 300);
    menuman6.BuildMenu(child6, 2201, 100);

    contextman.InitNowPlaying();
    contextman.BuildMenu(child7, 2301, -1);
    idx = 0;

    idx = basemenu.TrackPopupMenu(x, y);

    switch (true) {
    case(idx >= 1001 && idx < 1201):
        menuman1.ExecuteByID(idx - 1001);
        break;

    case (idx >= 1201 && idx < 1401):
        menuman2.ExecuteByID(idx - 1201);
        break;

    case (idx >= 1401 && idx < 1601):
        menuman3.ExecuteByID(idx - 1401);
        break;

    case (idx >= 1601 && idx < 1901):
        menuman4.ExecuteByID(idx - 1601);
        break;

    case (idx >= 1901 && idx < 2201):
        menuman5.ExecuteByID(idx - 1901);
        break;

    case (idx >= 2201 && idx < 2301):
        menuman6.ExecuteByID(idx - 2201);
        break;

    case (idx >= 2301 && idx < 3000):
        contextman.ExecuteByID(idx - 2301);
        break;
	case (idx == 3018):
		setScheduler(0);
		break;
	case (idx == 3019):
		setScheduler(1);
		break;
	case (idx == 3020):
		setScheduler(2);
		break;
	case (idx == 3021):
		setScheduler(3);
		break;
	case (idx == 3022):
		setScheduler(4);
		break;
	case (idx == 3023):
		setScheduler(5);
		break;
   case (idx == 3990):
		properties.minimode_dark_theme=!properties.minimode_dark_theme;
        window.NotifyOthers("minimode_dark_theme",properties.minimode_dark_theme);
		window.SetProperty("MINIMODE dark theme", properties.minimode_dark_theme);
		get_colors();g_searchbox.adapt_look_to_layout();
        window.Repaint();
        break;
   case (idx == 4000):
		properties.library_dark_theme=!properties.library_dark_theme;
        window.NotifyOthers("library_dark_theme",properties.library_dark_theme);
		window.SetProperty("LIBRARY dark theme", properties.library_dark_theme);
		on_notify_data("library_dark_theme",properties.library_dark_theme);
        window.Repaint();
        break;
   case (idx == 4001):
		properties.playlists_dark_theme=!properties.playlists_dark_theme;
        window.NotifyOthers("playlists_dark_theme",properties.playlists_dark_theme);
		window.SetProperty("PLAYLISTS dark theme", properties.playlists_dark_theme);
		on_notify_data("playlists_dark_theme",properties.playlists_dark_theme);
		fb.RunMainMenuCommand("View/ElPlaylist/Refresh");
        window.Repaint();
        break;
   case (idx == 4002):
		properties.bio_dark_theme=!properties.bio_dark_theme;
        window.NotifyOthers("bio_dark_theme",properties.bio_dark_theme);
		window.SetProperty("BIO dark theme", properties.bio_dark_theme);
		on_notify_data("bio_dark_theme",properties.bio_dark_theme);
        window.Repaint();
        break;
   case (idx == 4003):
		properties.visualization_dark_theme=!properties.visualization_dark_theme;
        window.NotifyOthers("visualization_dark_theme",properties.visualization_dark_theme);
		window.SetProperty("VISUALIZATION dark theme", properties.visualization_dark_theme);
		on_notify_data("visualization_dark_theme",properties.visualization_dark_theme);
        break;
   case (idx == 4005):
        window.NotifyOthers("wallpaperVisibility",true);
		//on_notify_data("wallpaperVisibility",true);
        break;
   case (idx == 4006):
        window.NotifyOthers("wallpaperVisibility",false);
		//on_notify_data("wallpaperVisibility",false);
        break;
   case (idx == 4007):
        window.NotifyOthers("wallpaperBlur",true);
		on_notify_data("wallpaperBlur",true);
        break;
   case (idx == 4008):
        window.NotifyOthers("wallpaperBlur",false);
		on_notify_data("wallpaperBlur",false);
        break;
   case (idx == 40051):
        window.NotifyOthers("wallpaperVisibilityGlobal",true);
		//on_notify_data("wallpaperVisibility",true);
        break;
   case (idx == 40061):
        window.NotifyOthers("wallpaperVisibilityGlobal",false);
		//on_notify_data("wallpaperVisibility",false);
        break;
   case (idx == 40071):
        window.NotifyOthers("wallpaperBlurGlobal",true);
		on_notify_data("wallpaperBlur",true);
        break;
   case (idx == 4072):
        toggleNowPlayingState(true,0);
        break;
   case (idx == 4073):
        toggleNowPlayingState(true,1);
        break;
   case (idx == 40081):
        window.NotifyOthers("wallpaperBlurGlobal",false);
		on_notify_data("wallpaperBlur",false);
        break;
	case (idx == 4009):
		g_uihacks.toggleFullscreen();
		break;
	case (idx == 4010):
		toggleLayoutMode(1);get_colors();g_searchbox.adapt_look_to_layout();
		break;
	case (idx == 4011):
		toggleLayoutMode(0);get_colors();g_searchbox.adapt_look_to_layout();
		break;
	case (idx == 4012):
		globalProperties.fontAdjustement++;
		window.SetProperty("GLOBAL Font Adjustement", globalProperties.fontAdjustement);
		window.NotifyOthers('set_font',globalProperties.fontAdjustement);
		on_font_changed();
		break;
	case (idx == 4013):
		globalProperties.fontAdjustement--;
		window.SetProperty("GLOBAL Font Adjustement", globalProperties.fontAdjustement);
		window.NotifyOthers('set_font',globalProperties.fontAdjustement);
		on_font_changed();
		break;
	case (idx == 4014):
		globalProperties.fontAdjustement = 0;
		window.SetProperty("GLOBAL Font Adjustement", globalProperties.fontAdjustement);
		window.NotifyOthers('set_font',globalProperties.fontAdjustement);
		on_font_changed();
		break;
	case (idx == 4021):
		Lightswitch(true,true);
		break;
	case (idx == 4022):
		Lightswitch(true,false);
		break;
	case (idx == 4023):
		enableCoversAtStartupGlobally();
		break;
	case (idx == 4024):
		enableArtistImgAtStartupGlobally();
		break;
	case (idx == 4025):
		enableDiskCacheGlobally();
		break;
	case (idx == 4026):
		delete_full_cache();
		break;
	case (idx == 4029):
		chooseMemorySettings(" ", "<div class='titleBig'>Covers  &  Memory usage</div><div class='separator'></div><br/>In order to adapt the memory usage to the speed of your computer and size of your music library, please choose one of the covers & memory settings below.\n\nYou can decrease it later if you experience performances issues or out of memory errors. On the contrary, if everything is working fine, then you can increase it.",'<br/>Note: Eole uses a cover cache. The cover cache is built little by little: when a cover is displayed, if it isn\'t stored yet in the cache, it will be added to it, so on first display of any cover, it will be a little bit slow, but it will get a lot faster on the second display.<br/><br/>This cache is based on the %album artist% & %album% tags.<br/><br/>After updating a existing cover, you must manually refresh it in foobar, do a right click over the cover which need to be refreshed, and you will have a menu item for that.<br/><br/>','MemoryDialog','You can also reduce the width of the covers stocked in memory, below. Lower is this number, lower is the memory footprint of this skin. Note: the covers may look blurred if you decrease it too much. <u>Warning: changing this value will reset the cover cache.</u>');
		break;
	case (idx == 4027):
		toggleNowPlayingState();
		break;
	case (idx == 4028):
		libraryfilter_state.toggleValue();
		build_buttons();
		window.Repaint();
		break;
	case (idx == 4030):
		rightplaylist_width.increment(10);
		break;
	case (idx == 4031):
		rightplaylist_width.decrement(10);
		break;
	case (idx == 4032):
		rightplaylist_width.setDefault();
		break;
	case (idx == 4033):
		rightplaylist_width.userInputValue("Enter the desired width in pixel.\nDefault width is 270px.\nMinimum width: 100px. Maximum width: 900px", "Custom playlist width");
		break;
	case (idx == 4034):
		libraryfilter_width.increment(10);
		break;
	case (idx == 4035):
		libraryfilter_width.decrement(10);
		break;
	case (idx == 4036):
		libraryfilter_width.setDefault();
		break;
	case (idx == 4037):
		libraryfilter_width.userInputValue("Enter the desired width in pixel.\nDefault width is 210px.\nMinimum width: 100px. Maximum width: 900px", "Custom left menu width");
		break;
	case (idx == 4038):
		playlistpanel_width.increment(10);
		break;
	case (idx == 4039):
		playlistpanel_width.decrement(10);
		break;
	case (idx == 4040):
		playlistpanel_width.setDefault();
		break;
	case (idx == 4041):
		playlistpanel_width.userInputValue("Enter the desired width in pixel.\nDefault width is 180px.\nMinimum width: 100px. Maximum width: 900px", "Custom left menu width");
		break;
	case (idx == 4042):
		setMemoryUsageGlobally(0);
		break;
	case (idx == 4043):
		setMemoryUsageGlobally(1);
		break;
	case (idx == 4044):
		setMemoryUsageGlobally(2);
		break;
	case (idx == 4045):
		setMemoryUsageGlobally(3);
		break;
	case (idx == 4046):
		globalProperties.enableResizableBorders = !globalProperties.enableResizableBorders;
		window.NotifyOthers("enableResizableBorders",globalProperties.enableResizableBorders);
		on_notify_data("enableResizableBorders",globalProperties.enableResizableBorders);
		break;
	case (idx == 4047):
		globalProperties.use_ratings_file_tags = true;
		window.SetProperty("GLOBAL use ratings in file tags", globalProperties.use_ratings_file_tags);
		window.NotifyOthers("use_ratings_file_tags",globalProperties.use_ratings_file_tags);
		break;
	case (idx == 4048):
		globalProperties.use_ratings_file_tags = false;
		window.SetProperty("GLOBAL use ratings in file tags", globalProperties.use_ratings_file_tags);
		window.NotifyOthers("use_ratings_file_tags",globalProperties.use_ratings_file_tags);
		break;
    case (idx == 4988):
		if(properties.savedFilterState>=0 && !properties.displayToggleBtns) filters_panel_state.setValue(properties.savedFilterState);
		else filters_panel_state.setValue(1);
        break;
    case (idx == 4990):
		saveFilterState();
		filters_panel_state.setValue(0);
        break;
    case (idx == 4991):
		filters_panel_state.decrement(1);
        break;
    case (idx == 4992):
		filters_panel_state.increment(1);
        break;
    case (idx == 4993):
		if(!filter2_state.isActive() && !filter3_state.isActive()) filters_panel_state.setValue(0);
		else filter1_state.toggleValue();
        break;
    case (idx == 4994):
		if(!filter1_state.isActive() && !filter3_state.isActive()) filters_panel_state.setValue(0);
		else filter2_state.toggleValue();
        break;
    case (idx == 4995):
		if(!filter1_state.isActive() && !filter2_state.isActive()) filters_panel_state.setValue(0);
		else filter3_state.toggleValue();
        break;
    case (idx == 4996):
		saveFilterState();
		filters_panel_state.setValue(filters_panel_state.max_value);
        break;
    case (idx == 4997):
		if(properties.savedFilterState>=0) filters_panel_state.setValue(properties.savedFilterState);
		else filters_panel_state.setValue(1);
        break;
    case (idx == 4998):
		lyrics_state.decrement(1);
        break;
    case (idx == 4999):
		lyrics_state.increment(1);
        break;
    case (idx == 5000):
		lyrics_state.setValue(0);
        break;
    case (idx >= 5001 && idx < 5010):
		Lightswitch(true,false);
		globalProperties.colorsMainPanel = idx-5001;
		window.SetProperty("GLOBAL colorsMainPanel",globalProperties.colorsMainPanel);
		window.NotifyOthers("colors",globalProperties.colorsMainPanel);
        break;
    case (idx >= 5011 && idx < 5020):
		Lightswitch(true,true);
		globalProperties.colorsMainPanel = idx-5011;
		window.SetProperty("GLOBAL colorsMainPanel",globalProperties.colorsMainPanel);
		window.NotifyOthers("colors",globalProperties.colorsMainPanel);
        break;
    case (idx >= 5101 && idx <= 5105):
		globalProperties.colorsControls = idx-5101;
		window.SetProperty("GLOBAL colorsControls",globalProperties.colorsControls);
		window.NotifyOthers("colorsControls",globalProperties.colorsControls);
        break;
    case (idx >= 5201 && idx < 5205):
		globalProperties.colorsMiniPlayer = idx-5201;
		properties.minimode_dark_theme = (globalProperties.colorsMiniPlayer>=2);
        window.NotifyOthers("minimode_dark_theme",globalProperties.colorsMiniPlayer);
		globalProperties.colorsMiniPlayer = globalProperties.colorsMiniPlayer-(properties.minimode_dark_theme?2:0);

		window.SetProperty("GLOBAL colorsMiniPlayer",globalProperties.colorsMiniPlayer);
		window.SetProperty("MINIMODE dark theme", properties.minimode_dark_theme);
		get_colors();g_searchbox.adapt_look_to_layout();
		window.Repaint();
        break;
    }

    basemenu = undefined;
    contextman = undefined;
    menuman1 = undefined;
    menuman2 = undefined;
    menuman3 = undefined;
    menuman4 = undefined;
    menuman5 = undefined;
    menuman6 = undefined;
	minimode_menu = undefined;
	font_size = undefined;
	if(FiltersMenu) FiltersMenu = undefined;
	//schedulerMenu = undefined;
    library_menu = undefined;
    playlists_menu = undefined;
    bio_menu = undefined;
    wallpaper_visibility = undefined;
    wallpaper_blur = undefined;
	return true;
}
function on_font_changed() {
	get_font();
	g_searchbox.onFontChanged();
    all_btns.calculateSize(true);
	adapt_buttons_to_layout();
	window.Repaint();
};
function on_metadb_changed(metadbs, fromhook) {
	if(fromhook) return;
	try{
		var nowplaying_rawpath = fb.GetNowPlaying().RawPath;
		for(var i=0; i < metadbs.Count; i++) {
			if(fb.IsPlaying && metadbs[i].RawPath==nowplaying_rawpath) {
				eval_caption_title(fb.GetNowPlaying());
				window.Repaint();
				return;
			}
		}
	} catch(e){}
}
function on_key_up(vkey) {
	g_searchbox.on_key("up", vkey);
}
function on_char(code) {
	g_searchbox.on_char(code);

}
function on_key_down(vkey) {
	g_searchbox.on_key("down", vkey);
	switch (vkey) {
	case VK_ESCAPE:
		if(g_uihacks.getFullscreenState()) g_uihacks.toggleFullscreen();
		break;
	};
}
function on_focus(is_focused) {
	if(!is_focused && g_searchbox.inputbox.text.length > 3){
		g_searchHistory.add(g_searchbox.inputbox.text);
		g_searchHistory.writeSearchHistoryIni();
	}
	g_searchbox.on_focus(is_focused)
}
function on_notify_data(name, info) {
    switch(name) {
		case "use_ratings_file_tags":
			globalProperties.use_ratings_file_tags = info;
			window.SetProperty("GLOBAL use ratings in file tags", globalProperties.use_ratings_file_tags);
			window.Reload();
		break;
		case "toggleLayoutMode":
			toggleLayoutMode();get_colors();g_searchbox.adapt_look_to_layout();
		break;
		case "enableResizableBorders":
			globalProperties.enableResizableBorders = info;
			window.SetProperty("GLOBAL enableResizableBorders", globalProperties.enableResizableBorders);
		break;
		case "MemSolicitation":
			globalProperties.enableDiskCache = info;
			window.SetProperty("GLOBAL memory solicitation", globalProperties.mem_solicitation);
		break;
		case "thumbnailWidthMax":
			globalProperties.thumbnailWidthMax = Number(info);
			window.SetProperty("GLOBAL thumbnail width max", globalProperties.thumbnailWidthMax);
		break;
		case "coverCacheWidthMax":
			globalProperties.coverCacheWidthMax = Number(info);
			window.SetProperty("GLOBAL cover cache width max", globalProperties.coverCacheWidthMax);
		break;
		case "history_previous":
			g_searchbox.clearInputbox(false);
			window.Repaint();
		break;
		case "libraryfilter_width":
			libraryfilter_width.value=info;
		break;
		case "rightplaylist_width":
			rightplaylist_width.value = info;
			break;
		case "playlistpanel_width":
			playlistpanel_width.value = info;
			break;
		case "nowplayinglib_state":
			nowplayinglib_state.value=info;
			build_buttons();
			window.Repaint();
		break;
		case "nowplayingplaylist_state":
			nowplayingplaylist_state.value=info;
			build_buttons();
			window.Repaint();
		break;
		case "nowplayingbio_state":
			nowplayingbio_state.value=info;
			build_buttons();
			window.Repaint();
		break;
		case "nowplayingvisu_state":
			nowplayingvisu_state.value=info;
			build_buttons();
			window.Repaint();
		break;
		case "lyrics_state":
			lyrics_state.value = info;
		break;
		case "wallpaperVisibility":
			toggleWallpaper(info);
		break;
		case "wallpaperBlur":
			toggleBlurWallpaper(info);
		break;
		case "WSH_panels_reload":
			window.Reload();
		break;
		case "mini_controlbar":
			mini_controlbar.value = info;
		break;
		case "set_font":
			globalProperties.fontAdjustement = info;
			window.SetProperty("GLOBAL Font Adjustement", globalProperties.fontAdjustement),
			on_font_changed();
			window.Repaint();
		break;
		case "library_dark_theme":
			properties.library_dark_theme=info;
			window.SetProperty("LIBRARY dark theme", properties.library_dark_theme);
			darklib_state.setValue((properties.library_dark_theme)?1:0);
			get_colors()
			g_searchbox.adapt_look_to_layout();
			window.Repaint();
		break;
		case "bio_stick_to_dark_theme":
			properties.bio_stick2darklayout=info;
			window.SetProperty("BIO stick to Dark layout", properties.bio_stick2darklayout);
			darkbiostick_state.setValue((properties.bio_stick2darklayout)?1:0);
			window.Repaint();
		break;
		case "libraryfilter_state":
			libraryfilter_state.value=info;
		break;
		case "playlists_dark_theme":
			properties.playlists_dark_theme=info;
			window.SetProperty("PLAYLISTS dark theme", properties.playlists_dark_theme);
			darkplaylist_state.setValue((properties.playlists_dark_theme)?1:0);
			get_colors()
			g_searchbox.adapt_look_to_layout();
			window.Repaint();
		break;
		case "bio_dark_theme":
			properties.bio_dark_theme=info;
			window.SetProperty("BIO dark theme", properties.bio_dark_theme);
			darkbio_state.setValue((properties.bio_dark_theme)?1:0);
			get_colors();
			g_searchbox.adapt_look_to_layout();
			window.Repaint();
		break;	
		case "visualization_dark_theme":
			properties.visualization_dark_theme=info;
			window.SetProperty("VISUALIZATION dark theme", properties.visualization_dark_theme);
			darkvisu_state.setValue((properties.visualization_dark_theme)?1:0);
			get_colors();
			g_searchbox.adapt_look_to_layout();
			window.Repaint();
		break;
		case "layout_state":
			layout_state = info;
			g_searchbox.adapt_look_to_layout();
			get_colors()
			window.Repaint();
		break;
		case "filters_panel_state":
			filters_panel_state.value=info;
			window.Repaint();
		break;
		case "save_filter_state":
			properties.savedFilterState = info;
			window.SetProperty("_PROPERTY: Saved filter state", properties.savedFilterState);
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
		case"DiskCacheState":
			globalProperties.enableDiskCache = info;
			window.SetProperty("COVER Disk Cache", globalProperties.enableDiskCache);
		break;
		case"LoadAllCoversState":
			globalProperties.load_covers_at_startup = info;
			window.SetProperty("COVER Load all at startup", globalProperties.load_covers_at_startup);
		break;
		case"LoadAllArtistImgState":
			globalProperties.load_artist_img_at_startup = info;
			window.SetProperty("ARTIST IMG Load all at startup", globalProperties.load_artist_img_at_startup);
		break;
		case "pmanager_height":
			if(!g_uihacks.getFullscreenState() && g_uihacks.getMainWindowState()==0){
				properties.fullMode_pmanagerheight=info;
				window.SetProperty("Full mode pmanager saved height", properties.fullMode_pmanagerheight);
			}
		break;
		case "schedulerState":
			setScheduler(info,true);
		break;
		case "playlist_height":
			if(!g_uihacks.getFullscreenState() && g_uihacks.getMainWindowState()==0){
				properties.miniMode_playlistheight=info;
				window.SetProperty("Mini mode playlist saved height", properties.miniMode_playlistheight);
			}
		break;
		case "minimode_dark_theme":
			if(layout_state.isEqual(1)){
				properties.minimode_dark_theme=info;
				window.SetProperty("MINIMODE dark theme", properties.minimode_dark_theme);
				darkmini_state.setValue((properties.minimode_dark_theme)?1:0);
				get_colors()
				window.Repaint();
			}
		break;
		case "main_panel_state":
			if(main_panel_state!=info) {
				main_panel_state.value = info;
				get_colors()
				window.Repaint();
			}
		break;
		case "giveMeGenreList":
			if(!g_genre_cache.isEmpty()){
				window.NotifyOthers("hereIsGenreList",JSON_stringify(g_genre_cache));
			}
		break;
	}
}

// ----------------------- Search Object ---------------------------
oSearch = function() {
	this.w = 0;
	this.h = 0;
	this.x = 0;
	this.y = 0;
	this.isHover = false;
	this.hide = false;
	this.images = {
        magnify: null,
        resetIcon_off: null,
        resetIcon_ov: null
	};
	this.repaint = function() {window.Repaint()}
    this.getImages = function() {
		var gb;
        var button_size = 18;
		this.images.search_icon = gdi.Image(theme_img_path  + "\\icons\\"+colors.icons_folder+"\\search_icon.png");
		this.search_bt = new button(this.images.search_icon, this.images.search_icon, this.images.search_icon,"search_bt","Search whole library");

		this.images.search_history_icon = gdi.Image(theme_img_path  + "\\icons\\"+colors.icons_folder+"\\search_history.png");
		this.images.search_history_hover_icon = gdi.Image(theme_img_path  + "\\icons\\"+colors.icons_folder+"\\search_history_hover.png");
		this.search_history_bt = new button(this.images.search_history_icon, this.images.search_history_hover_icon, this.images.search_history_hover_icon,"search_history_bt","Search history");

        this.images.resetIcon_off = gdi.CreateImage(button_size, button_size);
        gb = this.images.resetIcon_off.GetGraphics();
            gb.SetSmoothingMode(2);
			var resetIcon_off_size=5;
            gb.DrawLine(resetIcon_off_size, resetIcon_off_size, button_size-resetIcon_off_size, button_size-resetIcon_off_size, 1.0, colors.search_reset_icon);
            gb.DrawLine(resetIcon_off_size, button_size-resetIcon_off_size, button_size-resetIcon_off_size, resetIcon_off_size, 1.0, colors.search_reset_icon);
            gb.SetSmoothingMode(0);
        this.images.resetIcon_off.ReleaseGraphics(gb);

        this.images.resetIcon_ov = gdi.CreateImage(button_size, button_size);
        gb = this.images.resetIcon_ov.GetGraphics();
            gb.SetSmoothingMode(2);
			var resetIcon_ov_size=3;
            gb.DrawLine(resetIcon_ov_size, resetIcon_ov_size, button_size-resetIcon_ov_size, button_size-resetIcon_ov_size, 1.0, colors.search_reset_icon);
            gb.DrawLine(resetIcon_ov_size, button_size-resetIcon_ov_size, button_size-resetIcon_ov_size, resetIcon_ov_size, 1.0, colors.search_reset_icon);
            gb.SetSmoothingMode(0);
        this.images.resetIcon_ov.ReleaseGraphics(gb);

        this.images.resetIcon_dn = gdi.CreateImage(button_size, button_size);
        gb = this.images.resetIcon_dn.GetGraphics();
            gb.SetSmoothingMode(2);
			var resetIcon_dn_size=5;
            gb.DrawLine(resetIcon_dn_size, resetIcon_dn_size, button_size-resetIcon_dn_size, button_size-resetIcon_dn_size, 1.0, RGB(255,50,50));
            gb.DrawLine(resetIcon_dn_size, button_size-resetIcon_dn_size, button_size-resetIcon_dn_size, resetIcon_dn_size, 1.0, RGB(255,50,50));
            gb.SetSmoothingMode(0);
        this.images.resetIcon_dn.ReleaseGraphics(gb);

        this.reset_bt = new button(this.images.resetIcon_off, this.images.resetIcon_ov, this.images.resetIcon_dn,"reset_bt","Reset search");
	};
	this.getImages();
    this.reset_colors = function() {
        this.inputbox.textcolor = colors.normal_txt;
        this.inputbox.backselectioncolor = colors.selected_bg;
		this.getImages();
    };

    this.setSize = function(w, h, font_size) {
		this.w = w;
		this.h = h;
        this.inputbox.setSize(w-this.images.search_history_icon.Width*4.5, h-cSearchBox.paddingTop-cSearchBox.paddingBottom, font_size);
    };
	this.on_size = function() {
		if(layout_state.isEqual(0) && compact_titlebar.isActive()){
			var btns_width = ((properties.showLightswitchBtn)?buttons.Lightswitch.w:0) + ((properties.showConfigLayoutBtn)?buttons.ConfigLayout.w:0) + ((properties.showRightSidebarBtn)?buttons.RightSidebar.w:0) + ((properties.showFullscreenBtn)?buttons.Fullscreen.w:0) + ((properties.showNowPlayingBtn)?buttons.NowPlaying.w:0);
			this.setSize(ww - window_btns.getWidth() - buttons.Settings.w - 10 - btns_width, wh-cSearchBox.marginTop-cSearchBox.marginBottom, g_fsize);
		} else if(layout_state.isEqual(0)){
			this.setSize(cSearchBox.width, wh-cSearchBox.marginTop-cSearchBox.marginBottom, g_fsize);
		} else {
			this.setSize(ww-cSearchBox.marginRight-cSearchBox.marginLeft, wh-cSearchBox.marginTop-cSearchBox.marginBottom, g_fsize);
		}
	}
	this.onFontChanged = function() {
		this.inputbox.onFontChanged();
		this.on_size();
	}
	this.toggleVisibility = function(new_state) {
		if(typeof new_state !== 'undefined') this.hide = !new_state;
		else this.hide = !this.hide;
		if(!this.hide) {
			buttons.ShowSearch.setVisibility(false);
		} else {
			if(this.hide && !properties.alwaysShowSearch) g_cursor.setCursor(IDC_ARROW,1);
			buttons.ShowSearch.setVisibility(true);
			this.clearInputbox(true);
		}
		if(compact_titlebar.isActive())	g_panel.on_size_changed();
		set_main_btns_visibility();
		g_searchbox.repaint();
	}
    this.adapt_look_to_layout = function() {
		this.reset_colors();
		if(layout_state.isEqual(1)){
			for (var c in cSearchBoxMini)
				if(cSearchBoxMini.hasOwnProperty(c))
					cSearchBox[c] = cSearchBoxMini[c]
		} else {
			switch(true){
				case (compact_titlebar.isActive()):
					for (var c in cSearchBoxCompact)
						if(cSearchBoxCompact.hasOwnProperty(c))
							cSearchBox[c] = cSearchBoxCompact[c]
				break;
				case (main_panel_state.isEqual(0) && properties.library_dark_theme):
				case (main_panel_state.isEqual(1) && properties.playlists_dark_theme):
				case (main_panel_state.isEqual(2) && properties.bio_dark_theme):
				case (main_panel_state.isEqual(3) && properties.visualization_dark_theme):
					for (var c in cSearchBoxMainDark)
						if(cSearchBoxMainDark.hasOwnProperty(c))
							cSearchBox[c] = cSearchBoxMainDark[c]
				break;
				default:
					for (var c in cSearchBoxMainLight)
						if(cSearchBoxMainLight.hasOwnProperty(c))
							cSearchBox[c] = cSearchBoxMainLight[c]
				break;
			}
		}
		this.on_size();
	}
    this.clearInputbox = function(reset_filters) {
        if(this.inputbox.text.length > 0) {
			this.inputbox.text = "";
			this.inputbox.offset = 0;
			this.reset_bt.state=ButtonStates.normal;
			if(reset_filters) window.NotifyOthers("reset_filters",0);
        };
    };

	this.draw = function(gr, x, y) {
		this.x = x;
		this.y = y;
		if(this.hide) return;

		/*if(this.isHoverHistory){
			gr.DrawImage(this.images.search_history_hover_icon, this.x+this.w-Math.round(cSearchBox.paddingRight/2 + this.images.search_history_icon.Width/2), this.y+Math.round(this.h/2 - this.images.search_history_icon.Height/2), this.images.search_history_hover_icon.Width, this.images.search_history_hover_icon.Height, 0, 0, this.images.search_history_hover_icon.Width, this.images.search_history_hover_icon.Height,0,255);
		} else {
			gr.DrawImage(this.images.search_history_icon, this.x+this.w-Math.round(cSearchBox.paddingRight/2 + this.images.search_history_icon.Width/2), this.y+Math.round(this.h/2 - this.images.search_history_icon.Height/2), this.images.search_history_icon.Width, this.images.search_history_icon.Height, 0, 0, this.images.search_history_icon.Width, this.images.search_history_hover_icon.Height,0,255);
		}*/
		this.search_history_bt.draw(gr, this.x+this.w-Math.round(cSearchBox.paddingRight/2 + this.images.search_history_icon.Width/2), this.y+Math.round(this.h/2 - this.images.search_history_icon.Height/2)-2, 255);

        if(this.inputbox.text.length > 0 || (!(properties.alwaysShowSearch && !compact_titlebar.isActive()) && layout_state.isEqual(0))) {
            this.reset_bt.draw(gr, this.x+cSearchBox.paddingLeft-this.images.search_icon.Width-1, this.y+Math.floor((this.h-cSearchBox.paddingBottom)/2-this.reset_bt.img[0].Height/2)+2 + (compact_titlebar.isActive()?1:0), 255);
        } else {
			this.search_bt.draw(gr, this.x+cSearchBox.paddingLeft-this.images.search_icon.Width-4, this.y+Math.floor((this.h-cSearchBox.paddingBottom)/2-this.images.search_icon.Height/2)+2, 255);
        };

		this.inputbox.draw(gr, this.x+cSearchBox.paddingLeft, this.y+cSearchBox.paddingTop, 0, 0);
		if(layout_state.isEqual(0)){
			//gr.FillSolidRect(this.x, this.y-2, this.w, 1, colors.search_line); //top line
			//gr.FillSolidRect(this.x, this.y+this.h - 1, this.w, 1, colors.search_line); //bottom line
			//gr.FillSolidRect(this.x, this.y, 1, this.h-1, colors.search_line); //left line
			var grad_width = 10;
			var grad_hadd = 2;
			gr.FillSolidRect(this.x+this.w-1, this.y+1+grad_width-grad_hadd, 1, this.h-2-grad_width+grad_hadd, colors.search_line); //right line
			gr.FillGradRect(this.x+this.w-1, this.y+1-grad_hadd, 1, grad_width, 90, colors.normal_bg, colors.search_line, 1.0); //right line
		}
    };
	this.resetSearch = function() {
		if(fb.IsPlaying && this.inputbox.text.length > 0) showNowPlaying();
		this.clearInputbox(true);
		if(!(properties.alwaysShowSearch && !compact_titlebar.isActive()) && layout_state.isEqual(0)) g_searchbox.toggleVisibility(false);
		g_searchbox.repaint();
	}
    this.on_mouse = function(event, x, y, delta) {
        switch(event) {
            case "lbtn_down":
				if(this.isHover){
					var reset_btn_state = this.reset_bt.checkstate("down", x, y);
					var search_btn_state = this.search_bt.checkstate("down", x, y);
					var search_history_btn_state = this.search_history_bt.checkstate("down", x, y);
					if(reset_btn_state!=ButtonStates.down && !search_history_btn_state) this.inputbox.check("down", x, y);
					if(search_history_btn_state) draw_searchHistory_menu(this.x+this.w,this.h+this.y-1);
				}
				else if(!(properties.alwaysShowSearch && !compact_titlebar.isActive()) && this.inputbox.text.length == 0 && layout_state.isEqual(0) && !this.hide){
					this.toggleVisibility(false);
				} else {
					this.on_focus(false);
				}
                break;
            case "lbtn_up":
                if((this.inputbox.text.length > 0 || (!(properties.alwaysShowSearch && !compact_titlebar.isActive()) && layout_state.isEqual(0))) &&  !this.hide) {
                    if(this.reset_bt.checkstate("up", x, y) == ButtonStates.hover && !this.inputbox.drag) {
						this.resetSearch();
                    };
                } else if((properties.alwaysShowSearch && !compact_titlebar.isActive())) {
					if(this.search_bt.checkstate("up", x, y) == ButtonStates.hover && !this.inputbox.drag) {
						this.inputbox.activate(x,y);
						this.inputbox.repaint();
					};
				}
				this.inputbox.check("up", x, y);
                break;
            case "lbtn_dblclk":
				if(!this.hide)
					this.inputbox.check("dblclk", x, y);
                break;
            case "rbtn_down":
				if(!this.hide)
					this.inputbox.check("right", x, y);
                break;
            case "move":
				this.isHoverHistoryOld = this.isHoverHistory;
				this.checkHover(x,y);
				if(!this.hide) this.inputbox.check("move", x, y);

				this.search_history_bt.checkstate("move", x, y);
                if((this.inputbox.text.length > 0 || (!(properties.alwaysShowSearch && !compact_titlebar.isActive()) && layout_state.isEqual(0))) && !this.hide) this.reset_bt.checkstate("move", x, y);
				else this.search_bt.checkstate("move", x, y);

				/*//if(x > this.x+this.w-cSearchBox.paddingRight && x<this.x+this.w && y>cSearchBox.marginTop && !this.hide) this.isHoverHistory = true;
				var x_start =this.x+this.w-Math.round(cSearchBox.paddingRight/2 + this.images.search_history_icon.Width/2)-5;
				if(x > x_start && x < x_start + this.images.search_history_icon.Width+8) this.isHoverHistory = true;
				else this.isHoverHistory = false;
				if(this.isHoverHistoryOld!=this.isHoverHistory) this.repaint();*/

                break;
            case "leave":
				this.search_history_bt.changeState(ButtonStates.normal);
				/*if(this.isHoverHistory) {
					this.isHoverHistory = false;
					this.repaint();
				}*/
                break;
        };
    };
    this.checkHover = function(x, y) {
		this.isHover = (x < this.x+this.w && x > this.x && y <  this.y+this.h &&  y > this.y && !this.hide);
	}
    this.on_key = function(event, vkey) {
        switch(event) {
            case "down":
				if(!this.hide) {
					switch (vkey) {
							case VK_ESCAPE:
								this.resetSearch();
								break;
							default:
								this.inputbox.on_key_down(vkey);
								break;
							}
				}
                break;
        };
    };

    this.on_char = function(code) {
		if(this.hide) return;
		if(code==13) {
			if(this.inputbox.text.length < 3)
				return;
			g_launchSearch(properties.autosearch);
			g_searchHistory.add(this.inputbox.text);
			g_searchHistory.writeSearchHistoryIni();
		} else if(code!="")	{
			this.inputbox.on_char(code);
			if(this.inputbox.text.length==0) window.NotifyOthers("reset_filters",0);
		}
		if(properties.autosearch || code==13) this.showSearchResults();
    };
    this.showSearchResults = function() {
		if(!main_panel_state.isEqual(0) && !main_panel_state.isEqual(1) && layout_state.isEqual(0)){
			main_panel_state.setValue(0);
			get_colors();g_searchbox.adapt_look_to_layout();
		}
	}
	this.on_focus = function(is_focused) {
		this.inputbox.on_focus(is_focused);
		if(!is_focused && (!properties.alwaysShowSearch || compact_titlebar.isActive()) && this.inputbox.text.length == 0 && layout_state.isEqual(0)){
			this.toggleVisibility(false);
		}
		if(is_focused && this.isHover && this.inputbox.edit && (!main_panel_state.isEqual(0) && !main_panel_state.isEqual(1)) && layout_state.isEqual(0)){
			main_panel_state.setValue(0);
			get_colors();g_searchbox.adapt_look_to_layout();
		}
	};
	this.on_init = function() {
		this.inputbox = new oInputbox(this.w, this.h, "", "Search...", colors.search_txt , 0, 0, colors.selected_bg, g_launchSearch, "g_searchbox", undefined, "g_font.min1");
        this.inputbox.autovalidation = properties.autosearch;
		this.adapt_look_to_layout();
    };
	this.on_init();
};
function g_launchSearch(play_results) {
	var library_list = fb.GetLibraryItems();
	var play_results = typeof play_results !== 'undefined' ? play_results : false;
	if(g_searchbox.inputbox.text.length < 3)
		return;
	var search_results = fb.GetQueryItems(library_list, g_searchbox.inputbox.text.toLowerCase());
	//window.NotifyOthers("search_launched",0);
	apply_playlist(search_results,play_results,true,false);
	search_results = undefined;
	window.NotifyOthers("refresh_filters",0);
	g_searchbox.repaint();
	if (library_list) library_list = undefined;

	return;
};

// ---------- Search history ------------------
searchHistory = function () {
    this.historyList = Array();
    this.searchExist = function (search_item) {
		for (var i = 0; i < this.historyList.length; i++) {
			if(this.historyList[i][0]==search_item) return true;
		}
		return false;
    };
    this.add = function (search_item, datetime) {
		if(!this.searchExist(search_item)) {
			var currentdate = new Date();
			datetime = typeof datetime !== 'undefined' ? datetime : currentdate.getDate() + "/"	+ (currentdate.getMonth()+1)  + "/"	+ currentdate.getFullYear() + " @ "
							+ currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
			this.historyList[this.historyList.length] = Array(search_item,datetime);
			if(this.historyList.length>properties.searchHistory_max_items) this.historyList.shift();
			return true;
		}
		return false;
    };
	this.onFinish = function (genre) {
		this.sort();
	}
	this.sort = function () {
		//this.historyList.sort();
	}
	this.reset = function () {
		this.historyList = Array();
		try {
			if(g_files.FileExists(SettingsPath + "SearchHistory.ini")) g_files.DeleteFile(SettingsPath + "SearchHistory.ini");
		} catch(e) {}
	}
    this.trace = function (genre) {
		for (var i = 0; i < this.historyList.length; i++) {
			console.log(this.historyList[i][0])
		}
    };
    this.readSearchHistoryIni = function () {
		if(g_files.FileExists(SettingsPath + "SearchHistory.ini")) {
			historyFile = g_files.OpenTextFile(SettingsPath + "SearchHistory.ini", 1);
			// Read from the file and add the results.
			while (!historyFile.AtEndOfStream){
				read_history = historyFile.ReadLine();
				var args = read_history.split(" ## ");
				this.add(args[0],args[1]);
			}
			this.onFinish();
			historyFile.Close();
		}
	}
    this.writeSearchHistoryIni = function () {
		if(this.historyList.length>0){
			try {
				//if(g_files.FileExists(SettingsPath + "SearchHistory.ini")) g_files.DeleteFile(SettingsPath + "SearchHistory.ini");
				var MyFile = g_files.CreateTextFile(SettingsPath+"SearchHistory.ini", true);
				for (var i = 0; i <this.historyList.length; i++) {
					MyFile.WriteLine(this.historyList[i][0]+" ## "+this.historyList[i][1]);
					if(i==properties.searchHistory_max_items) break;
				}
				MyFile.Close();
			} catch(e) {}
		}
	}
}

function draw_searchHistory_menu(x, y) {
    var basemenu = window.CreatePopupMenu();
	if (typeof x == "undefined") x=ww;
	if (typeof y == "undefined") y=30;

    basemenu.AppendMenuItem(MF_GRAYED, 0, "Search history :");
	basemenu.AppendMenuSeparator();

	for (var i = g_searchHistory.historyList.length-1; i >=0; i--) {
		basemenu.AppendMenuItem(MF_STRING, i+1, g_searchHistory.historyList[i][0].replace("&","&&"));
	}
	if(g_searchHistory.historyList.length==0) {
		basemenu.AppendMenuItem(MF_GRAYED, 0, "The search history is empty");
	} else {
		basemenu.AppendMenuSeparator();
		basemenu.AppendMenuItem(MF_STRING, properties.searchHistory_max_items+10, "Clear history");
	}
	basemenu.AppendMenuItem(MF_STRING, 1000, "Search as you type");
	basemenu.CheckMenuItem(1000, properties.autosearch);
	
    idx = 0;
    idx = basemenu.TrackPopupMenu(x, y, 0x0008);

    switch (true) {
		case (idx==1000):
			properties.autosearch = !properties.autosearch;
			window.SetProperty("_DISPLAY: autosearch", properties.autosearch);
			g_searchbox.on_init();
		break;
		case (idx > 0 && idx <= properties.searchHistory_max_items+1):
			g_searchbox.inputbox.text = g_searchHistory.historyList[idx-1][0];
			g_searchbox.inputbox.Cpos = g_searchbox.inputbox.text.length;
			g_launchSearch(false);
			g_searchbox.showSearchResults();
			window.Repaint();
		break;
		case (idx == properties.searchHistory_max_items+10):
			g_searchHistory.reset();
		break;
    }
    basemenu = undefined;
}
function toggleWallpaper(wallpaper_state){
	wallpaper_state = typeof wallpaper_state !== 'undefined' ? wallpaper_state : !properties.showwallpaper;
	properties.showwallpaper = wallpaper_state;
	window.SetProperty("_DISPLAY: Show Wallpaper", properties.showwallpaper);
	if(properties.showwallpaper) {
		g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.IsPlaying ? fb.GetNowPlaying() : null);
	};
	get_colors();
	window.Repaint();
}
function toggleBlurWallpaper(wallpaper_blur_state){
	wallpaper_blur_state = typeof wallpaper_blur_state !== 'undefined' ? wallpaper_blur_state : !properties.wallpaperblurred;
	properties.wallpaperblurred = !properties.wallpaperblurred;
	window.SetProperty("_DISPLAY: Wallpaper Blurred", properties.wallpaperblurred);
	g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
	window.Repaint();
}
function on_init(){
	if(properties.Remember_previous_state && main_panel_state.isEqual(3)) {
		main_panel_state.setValue(0);
	} else if(!properties.Remember_previous_state){
		main_panel_state.setValue(0);
	}
	get_font();
	get_colors();
	g_panel = new oPanel(properties.panelName,function(){
		SetPseudoCaption();
		SetCaptionTitleSize();
		g_searchbox.on_size();
	});
	g_cursor = new oCursor();
	g_tooltip = new oTooltip();
    g_searchbox = new oSearch();
	g_searchHistory = new searchHistory;
	g_searchHistory.readSearchHistoryIni();
	adapt_buttons_to_layout();
	g_genre_cache = new oGenreCache();
	g_genre_cache.build_from_library();
	g_uihacks.setFrameStyle(3);
	g_uihacks.setAeroEffect(2);
	g_uihacks.setAero(0,0,1,0);

	if(fb.IsPlaying) caption_title = fb.TitleFormat("[%artist%  -  ][%album%[  -  %tracknumber%] : ]%title%[  -  %date%]").Eval();
	if(settings_file_not_found){
		var welcome_msg_timer = setTimeout(function(){
			chooseMemorySettings(" ", "<div class='titleBig'>Looks like you just installed this theme?</div><div class='separator'></div><br/>Please read this popup fully, especially the text at the bottom, in order to understand how Eole image cache works.\n\nThe settings below influence the performances, the resolution of covers, and the memory footprint of this skin.\n\nYou can decrease it later by going to Foobar > Skin settings > Cover & memory usage\nif you experience performances issues or out of memory errors. On the contrary, if everything is working fine, then you can increase it. If you don't understand all this, keep the default settings.",'<br/>Useful tip: most panels have a settings menu available with a right-click.<br/><br/>Note: Eole uses a cover cache. The cover cache is built little by little: when a cover is displayed, if it isn\'t stored yet in the cache, it will be added to it, so on first display of any cover, it will be a little bit slow, but it will get a lot faster on the second display.<br/><br/>This cache is based on the %album artist% & %album% tags.<br/><br/>If you update a existing cover, you need to trigger a cache refresh. Do a right click over the cover which need to be refreshed, and you will have a menu item for that.<br/><br/>','MemoryDialog','You can reduce the width of the covers stocked in memory, below. Lower is this number, lower is the memory footprint of this skin. Note: the covers will looks blurred if you decrease it too much.');
			theme_version.setValue(globalProperties.theme_version);
			clearTimeout(welcome_msg_timer);
			welcome_msg_timer=false;
		}, 200);
		RefreshPSS();
	} else if(versionCompare(theme_version.getValue(),globalProperties.lastest_breaking_version)<0) {
		var welcome_msg_timer = setTimeout(function(){
			NoticeBox(" ","<div class='titleBig'>Import fcl file, Eole v"+(globalProperties.lastest_breaking_version)+" and after</div><div class='separator'></div><br/>Looks like your column UI configuration file is out of date, you need to import the new configuration file. You may loose some of the customizations you did to this theme, but you'll be able to set them back quickly.<br/><br/>On the preferences page (Foobar > File > Preferences), go to<br/>Display > column UI > Main tab > Import configuration...<br/><br/>And then import this file: [YOUR_FOOBAR_DIRECTORY]/themes/eole/columnsUI_eole.fcl", "Got it, open the preferences","Not now",'fb.RunMainMenuCommand("File/Preferences")');
			clearTimeout(welcome_msg_timer);
			welcome_msg_timer=false;
		}, 200);
	}
}
on_init();