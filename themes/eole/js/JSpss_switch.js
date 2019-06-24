var settings_file_not_found = false;

/*var SettingsPath = data_global_path+"\\"+theme_name+"-settings\\";
gTime_covers = fb.CreateProfiler();			
gTime_covers.Reset();
console.log("pss_switch 0 time:"+gTime_covers.Time);	

var settings_files = utils.Glob(SettingsPath+"*.*");
var PSS_settings = Array();
for(i=0; i < settings_files.length; i++) {
	filename = settings_files[i];
	
	let arr = utils.FileTest(settings_files[i], "split");
	filename = arr[1];

	last_underscore = filename.lastIndexOf('_');
	setting_value = filename.substring(0,last_underscore + 1);		
	setting_name = filename.substring(last_underscore + 1);
	PSS_settings[setting_name] = setting_value; 
}
console.log("pss_switch 1 time:"+gTime_covers.Time);*/
	
oPanelSetting = function (name, file_prefix, default_value, min_value, max_value) {
	this.name = name;	
	this.file_prefix = file_prefix;
	this.default_value = default_value;
	this.max_value = max_value;
	this.min_value = min_value;	
	this.getFileValue = function () {		
		setting_file = utils.Glob(SettingsPath+""+this.file_prefix+"*");
		if(setting_file.length>=1){
			last_underscore = setting_file[0].lastIndexOf('_');
			this.value = parseInt(setting_file[0].substring(last_underscore + 1));
			if(setting_file.length>1){
				for(i=1;i<setting_file.length;i++) {
					g_files.DeleteFile(setting_file[i]);
				}
			}
		} else {
			this.value = this.default_value;
			g_files.CreateTextFile(SettingsPath+this.file_prefix+this.value, true).Close();
			settings_file_not_found = true;	
		}
		return this.value;
    };
	this.getNumberOfState = function () {
		return (this.max_value-this.min_value);
	}	
	this.setValue = function (new_value) {	
		if(new_value==this.value) return;
		if(new_value>this.max_value) new_value = this.max_value;
		else if(new_value<this.min_value) new_value = this.min_value;		
		if(g_files.FileExists(SettingsPath+this.file_prefix+new_value)) g_files.DeleteFile(SettingsPath+this.file_prefix+new_value);
		if(!g_files.FileExists(SettingsPath+this.file_prefix+this.value)) g_files.CreateTextFile(SettingsPath+this.file_prefix+this.value, true).Close();	
		g_files.MoveFile(SettingsPath + this.file_prefix + this.value,SettingsPath + this.file_prefix + new_value);

		this.value = new_value;
		window.NotifyOthers(this.name,this.value);	
		
		RefreshPSS();
	}
	this.toggleValue = function () {
		if(this.value==0) this.setValue(1);
		else this.setValue(0);
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
const refreshPSS_async = async() =>
{
	if (fb.IsPlaying || fb.IsPaused) {
		fb.PlayOrPause();
		fb.PlayOrPause();
	}
	else {
		fb.Play();fb.Stop();
	}
};
function RefreshPSS() {
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

var darkplaylist_state = new oPanelSetting("darkplaylist_state", "DARKPLAYLIST_", 0, 0, 1);
var showtrackinfo_big = new oPanelSetting("showtrackinfo_big", "SHOWTRACKINFOBIG_", 1, 0, 1);
var showtrackinfo_small = new oPanelSetting("showtrackinfo_small", "SHOWTRACKINFOSMALL_", 0, 0, 1);

var coverpanel_state = new oPanelSetting("coverpanel_state", "COVERPANEL_", 1, 0, 1);
var filters_panel_state = new oPanelSetting("filters_panel_state", "FILTERSPANEL_", 1, 0, 3);
var libraryfilter_state = new oPanelSetting("libraryfilter_state", "LIBRARYFILTER_", 1, 0, 1);
var screensaver_state = new oPanelSetting("screensaver_state", "SCREENSAVER_", 0, 0, 1);
var lyrics_state = new oPanelSetting("lyrics_state", "LYRICS_", 1, 0, 4);
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

//Panels width
var libraryfilter_width = new oPanelSetting("libraryfilter_width", "LIBRARYFILTERWIDTH_", 210, 100, 900);
var playlistpanel_width = new oPanelSetting("playlistpanel_width", "PLAYLISTPANELWIDTH_", 180, 100, 900);
var rightplaylist_width = new oPanelSetting("rightplaylist_width", "RIGHTPLAYLISTWIDTH_", 270, 100, 900);

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

// console.log("pss_switch 2 time:"+gTime_covers.Time);	
// Example of use in a PSS :
// The first line set a panel stack global variable according to the panel current state, the second line switch the visibility of a panel named library, it show the panel when the current state is 3
// $set_ps_global(MAIN_PANEL_SWITCH,$right($findfile(themes/eole/Settings/MAINPANEL_*),1))
// $showpanel_c(library,$ifequal(%MAIN_PANEL_SWITCH%,3,1,0))