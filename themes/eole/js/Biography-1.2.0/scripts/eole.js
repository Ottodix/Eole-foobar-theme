var on_size_2Call = false;
var lyrics_off_icon = gdi.Image(theme_img_path + "\\icons\\nowplaying_off.png");   
var lyrics_off_hover_icon = gdi.Image(theme_img_path + "\\icons\\nowplaying_off_hover.png");  
var lyrics_on_icon = gdi.Image(theme_img_path + "\\icons\\nowplaying_on.png"); 
var lyrics_on_hover_icon = gdi.Image(theme_img_path + "\\icons\\nowplaying_on_hover.png"); 	
var lyrics_off_icon_white = gdi.Image(theme_img_path + "\\icons\\white\\nowplaying_off.png");   
var lyrics_off_hover_icon_white = gdi.Image(theme_img_path + "\\icons\\white\\nowplaying_off_hover.png");  
var lyrics_on_icon_white = gdi.Image(theme_img_path + "\\icons\\white\\nowplaying_on.png"); 
var lyrics_on_hover_icon_white = gdi.Image(theme_img_path + "\\icons\\white\\nowplaying_on_hover.png"); 	
var lyrics_off_icon_white = gdi.Image(theme_img_path + "\\icons\\white\\nowplaying_off.png");  
var g_cursor = new oCursor();
var g_tooltip = new oTooltip();
var btns_manager = new SimpleButtonManager();
btns_manager.addButton("lyricsReduce",-20, 8, 15, lyrics_off_icon.Height, "Reduce Lyrics", "Reduce Lyrics width", function () {
		lyrics_state.decrement(1);
		positionButtons();
		g_tooltip.Deactivate();
		window.Repaint();		
    },false,lyrics_off_icon,lyrics_off_hover_icon,ButtonStates.normal,255);
btns_manager.addButton("lyricsIncrease",-45, 8, 15, lyrics_off_icon.Height, "Extend Lyrics", "Extend Lyrics width", function () {
		lyrics_state.increment(1);
		positionButtons();
		g_tooltip.Deactivate();
		window.Repaint();		
    },false,lyrics_on_icon,lyrics_on_hover_icon,ButtonStates.normal,255);	
	
function positionButtons(){
	btns_manager.buttons.lyricsReduce.first_draw = true;
	if(ppt.blurDark){
		btns_manager.buttons.lyricsReduce.N_img = lyrics_on_icon_white;
		btns_manager.buttons.lyricsReduce.H_img = lyrics_on_hover_icon_white;
		btns_manager.buttons.lyricsReduce.text = "";
		
		btns_manager.buttons.lyricsIncrease.N_img = lyrics_off_icon_white;
		btns_manager.buttons.lyricsIncrease.H_img = lyrics_off_hover_icon_white;
		btns_manager.buttons.lyricsIncrease.text = "";			
	} else {
		btns_manager.buttons.lyricsReduce.N_img = lyrics_on_icon;
		btns_manager.buttons.lyricsReduce.H_img = lyrics_on_hover_icon;
		btns_manager.buttons.lyricsReduce.text = "";
		
		btns_manager.buttons.lyricsIncrease.N_img = lyrics_off_icon;
		btns_manager.buttons.lyricsIncrease.H_img = lyrics_off_hover_icon;
		btns_manager.buttons.lyricsIncrease.text = "";				
	}
	if(lyrics_state.isMaximumValue()) {	
		btns_manager.buttons.lyricsIncrease.hide = true;	
		btns_manager.buttons.lyricsReduce.hide = false;			
	} else if(lyrics_state.isMinimumValue()) {
		btns_manager.buttons.lyricsIncrease.text = "Lyrics";
		btns_manager.buttons.lyricsIncrease.first_draw=true;
		btns_manager.buttons.lyricsIncrease.x = -20;		
		btns_manager.buttons.lyricsReduce.hide = true;
		btns_manager.buttons.lyricsIncrease.hide = false;		
	} else {
		btns_manager.buttons.lyricsReduce.hide = false;		
		btns_manager.buttons.lyricsIncrease.hide = false;	
		btns_manager.buttons.lyricsIncrease.w = 15;
		btns_manager.buttons.lyricsIncrease.x = -45;		
	}
}

var colors = {};
function get_colors() {
	if(ppt.blurDark){	
		colors.bg = GetGrey(40);			
		colors.faded_txt = GetGrey(245);
		colors.normal_txt = GetGrey(245);	
	} else {	
		colors.bg = GetGrey(40);				
		colors.faded_txt = GetGrey(100);
		colors.normal_txt = GetGrey(245);		
	}	
};
properties = {
	panelName: 'WSHartist_bio',
    globalFontAdjustement: window.GetProperty("MAINPANEL: Global Font Adjustement", 0),
	panelFontAdjustement: window.GetProperty("MAINPANEL: Panel font Adjustement", 0),		
}
positionButtons();
get_colors();
get_font();
console.log("eole.js")