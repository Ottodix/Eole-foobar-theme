var settings_file_not_found = false;
	
oPanelSetting = function (name, file_prefix, default_value, min_value, max_value, int_value, update_settings_file_not_found) {
	this.name = name;	
	this.file_prefix = file_prefix;
	this.default_value = default_value;
	this.max_value = max_value;
	this.min_value = min_value;	
	this.int_value = typeof int_value !== 'undefined' ? int_value : true;	
	this.update_settings_file_not_found = typeof update_settings_file_not_found !== 'undefined' ? update_settings_file_not_found : true;	
	this.getFileValue = function () {		
		setting_file = utils.Glob(SettingsPath+""+this.file_prefix+"*");
		if(setting_file.length>=1){
			last_underscore = setting_file[0].lastIndexOf('_');
			this.value = setting_file[0].substring(last_underscore + 1);
			if(this.int_value) this.value = parseInt(this.value);
			if(setting_file.length>1){
				for(i=1;i<setting_file.length;i++) {
					g_files.DeleteFile(setting_file[i]);
				}
			}
		} else {
			this.value = this.default_value;
			g_files.CreateTextFile(SettingsPath+this.file_prefix+this.value, true).Close();
			if(this.update_settings_file_not_found) {
				settings_file_not_found = true;	
			}
		}
		return this.value;
    };
	this.getValue = function () {		
		return this.value;
	}	
	this.getNumberOfState = function () {
		return (this.max_value-this.min_value);
	}	
	this.setValue = function (new_value, refresh_panel) {	
		refresh_panel = typeof refresh_panel !== 'undefined' ? refresh_panel : true;	
		if(new_value==this.value) return;
		if(new_value>this.max_value) new_value = this.max_value;
		else if(new_value<this.min_value) new_value = this.min_value;		
		if(g_files.FileExists(SettingsPath+this.file_prefix+new_value)) g_files.DeleteFile(SettingsPath+this.file_prefix+new_value);
		if(!g_files.FileExists(SettingsPath+this.file_prefix+this.value)) g_files.CreateTextFile(SettingsPath+this.file_prefix+this.value, true).Close();	
		g_files.MoveFile(SettingsPath + this.file_prefix + this.value,SettingsPath + this.file_prefix + new_value);
		g_avoid_on_metadb_changed = true;
		this.value = new_value;
		window.NotifyOthers("g_avoid_on_metadb_changed",true);			
		window.NotifyOthers(this.name,this.value);	
		if(refresh_panel!==false) RefreshPSS();
	}
	this.setDefault = function () {
		this.setValue(this.default_value);
	}	
	this.toggleValue = function (refresh_panel) {
		if(this.value==0) this.setValue(1, refresh_panel);
		else this.setValue(0, refresh_panel);
	}
	this.isEqual = function (test_value) {
		return (this.value==test_value);
	}		
	this.isActive = function () {
		return (this.value>0);
	}	
	this.isMaximumValue = function () {
		return (this.value==this.max_value);
	}
	this.isMinimumValue = function () {
		return (this.value==this.min_value);
	}	
	this.decrement = function (decrement_value) {
		this.setValue(parseInt(this.value)-decrement_value);		
	}	
	this.increment = function (increment_value) {
		this.setValue(parseInt(this.value)+increment_value);		
	}	
	this.cycleIncrement = function (increment_value, refresh_panel) {
		var new_value = parseInt(this.value)+increment_value;
		if(new_value>this.max_value) new_value = this.min_value;
		this.setValue(new_value, refresh_panel);		
	}	
	this.cycleDecrement = function (decrement_value, refresh_panel) {
		var new_value = parseInt(this.value)-decrement_value;
		if(new_value<this.min_value) new_value = this.max_value;
		this.setValue(new_value, refresh_panel);		
	}	
	this.userInputValue = function (msg,title) {
		try {
			new_value = utils.InputBox(window.ID, msg, title, this.value, true);
			if (!(new_value == "" || typeof new_value == 'undefined')) {
				this.setValue(new_value);
			}			   
		} catch(e) {
		}				
	}		
	this.getFileValue();
}
function RefreshPSS() {
	if (fb.IsPlaying || fb.IsPaused) {
		try{
			let handle = fb.GetNowPlaying();
			handle.RefreshStats();
		} catch(e){
			fb.Play();fb.Stop();
		}
	}	
	else {
		fb.Play();fb.Stop();
	}	
}	
function RefreshPSS_old() {
	if (fb.IsPaused) {
		fb.Play();
		fb.Pause();
	}
	else if (fb.IsPlaying) {
		fb.Pause();
		fb.Play();
	}	
	else {
		fb.Play();fb.Stop();
	}
}
function RefreshPSS_old2() {
	if (fb.IsPlaying || fb.IsPaused) {
		fb.PlayOrPause();
		fb.PlayOrPause();
	}
	else {
		fb.Play();fb.Stop();
	}
}

var main_panel_state = new oPanelSetting("main_panel_state", "MAINPANEL_", 0, 0, 3);
var layout_state = new oPanelSetting("layout_state", "LAYOUT_", 0, 0, 1);

var darklib_state = new oPanelSetting("darklib_state", "DARKLIB_", 0, 0, 1);
var darkplaylist_state = new oPanelSetting("darkplaylist_state", "DARKPLAYLIST_", 0, 0, 1);
var darkbio_state = new oPanelSetting("darkbio_state", "DARKBIO_", 0, 0, 1);
var darkbiostick_state = new oPanelSetting("darkbiostick_state", "DARKBIOSTICK_", 0, 0, 1);
var darkvisu_state = new oPanelSetting("darkvisu_state", "DARKVISU_", 0, 0, 1);
var darkmini_state = new oPanelSetting("darkmini_state", "DARKMINI_", 0, 0, 1);

var showtrackinfo_big = new oPanelSetting("showtrackinfo_big", "SHOWTRACKINFOBIG_", 1, 0, 1);
var showtrackinfo_small = new oPanelSetting("showtrackinfo_small", "SHOWTRACKINFOSMALL_", 0, 0, 1);

var coverpanel_state_mini = new oPanelSetting("coverpanel_state_mini", "COVERPANELMINI_", 1, 0, 1);
var coverpanel_state_big = new oPanelSetting("coverpanel_state_big", "COVERPANELBIG_", 1, 0, 1);
var filters_panel_state = new oPanelSetting("filters_panel_state", "FILTERSPANEL_", 1, 0, 5);
var libraryfilter_state = new oPanelSetting("libraryfilter_state", "LIBRARYFILTER_", 1, 0, 1);
var lyrics_state = new oPanelSetting("lyrics_state", "LYRICS_", 1, 0, 11);
var librarytree = new oPanelSetting("librarytree", "LIBRARYTREE_", 0, 0, 1);
var mini_controlbar = new oPanelSetting("mini_controlbar", "MINICONTROLBAR_", 1, 0, 1);
var compact_titlebar = new oPanelSetting("compacttitlebar", "COMPACTTITLEBAR_", 0, 0, 1);

//Individual Filter state
var filter1_state = new oPanelSetting("filter1_state", "FILTER1_", 1, 0, 1);
var filter2_state = new oPanelSetting("filter2_state", "FILTER2_", 1, 0, 1);
var filter3_state = new oPanelSetting("filter3_state", "FILTER3_", 1, 0, 1);

//Now playing switch for each main panels
var nowplayinglib_state = new oPanelSetting("nowplayinglib_state", "NOWPLAYINGLIB_", 1, 0, 1);
var nowplayingplaylist_state = new oPanelSetting("nowplayingplaylist_state", "NOWPLAYINGPLAYLIST_", 1, 0, 1);
var nowplayingbio_state = new oPanelSetting("nowplayingbio_state", "NOWPLAYINGBIO_", 1, 0, 1);
var nowplayingvisu_state = new oPanelSetting("nowplayingvisu_state", "NOWPLAYINGVISU_", 1, 0, 1);

//Track infos switch for each main panels
var trackinfoslib_state = new oPanelSetting("trackinfoslib_state", "TRACKINFOSLIB_", 0, 0, 2);
var trackinfosplaylist_state = new oPanelSetting("trackinfosplaylist_state", "TRACKINFOSPLAYLIST_", 0, 0, 2);
var trackinfosbio_state = new oPanelSetting("trackinfosbio_state", "TRACKINFOSBIO_", 1, 0, 2);
var trackinfosvisu_state = new oPanelSetting("trackinfosvisu_state", "TRACKINFOSVISU_", 1, 0, 2);
var trackinfostext_state = new oPanelSetting("trackinfostext_state", "TRACKINFOSTEXT_", 1, 0, 1);

//Panels width
var libraryfilter_width = new oPanelSetting("libraryfilter_width", "LIBRARYFILTERWIDTH_", 210, 100, 900);
var playlistpanel_width = new oPanelSetting("playlistpanel_width", "PLAYLISTPANELWIDTH_", 180, 100, 900);
var rightplaylist_width = new oPanelSetting("rightplaylist_width", "RIGHTPLAYLISTWIDTH_", 210, 100, 900);

//Theme version
var theme_version = new oPanelSetting("theme_version", "THEMEVERSION_", "0", 0, 0, false, false);

//Get Now playing state according to main panel
function getNowPlayingState(){
	switch(main_panel_state.value){
		case 0:
			return nowplayinglib_state.value;
		break;
		case 1:
			return nowplayingplaylist_state.value;
		break;
		case 2:
			return nowplayingbio_state.value;
		break;
		case 3:
			return nowplayingvisu_state.value;
		break;		
	}	
}
//Get Track Infos state according to main panel
function getTrackInfosState(){
	switch(main_panel_state.value){
		case 0:
			return trackinfoslib_state.value;
		break;
		case 1:
			return trackinfosplaylist_state.value;
		break;
		case 2:
			return trackinfosbio_state.value;
		break;
		case 3:
			return trackinfosvisu_state.value;
		break;		
	}	
}
function getTrackInfosVisibility(){
	switch(main_panel_state.value){
		case 0:
			return (trackinfoslib_state.value>=1 && nowplayinglib_state.value==1);
		break;
		case 1:
			return (trackinfosplaylist_state.value>=1 && nowplayingbio_state.value==1);
		break;
		case 2:
			return (trackinfosbio_state.value>=1 && nowplayinglib_state.value==1);
		break;
		case 3:
			return (trackinfosvisu_state.value>=1 && nowplayingvisu_state.value==1);
		break;		
	}	
}
function getRightPlaylistState(){
	return (nowplayinglib_state.isActive());
	//return (!trackinfoslib_state.isActive() && nowplayinglib_state.isActive());
}

// Example of use in a PSS :
// The first line set a panel stack global variable according to the panel current state, the second line switch the visibility of a panel named library, it show the panel when the current state is 3
// $set_ps_global(MAIN_PANEL_SWITCH,$right($findfile(themes/eole/Settings/MAINPANEL_*),1))
// $showpanel_c(library,$ifequal(%MAIN_PANEL_SWITCH%,3,1,0))