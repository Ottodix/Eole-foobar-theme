// ================================================== // Biography changes for Eole
// update SMPbiography.js with biography/main.js, with the following changes:
// in const files = [ add 'eole.js', and add this file inside biography/scripts

// Replace biography/utils.js code with the following
/*
let my_utils = {}

biography_root = theme_scripts_path+"\\biography";
biography_assets = biography_root+"\\assets\\";
biography_scripts = biography_root+"\\scripts\\";

my_utils.packagePath = biography_root;
my_utils.getAsset = assetFile => utils.ReadTextFile(biography_assets+`${assetFile}`);
my_utils.getImageAsset = assetFile => gdi.Image(biography_assets+`/images/${assetFile}`);
my_utils.getScriptPath = biography_scripts;

//my_utils.scriptInfo = window.ScriptInfo;
//my_utils.packageInfo = utils.GetPackageInfo(my_utils.scriptInfo.PackageId);
//my_utils.packagePath = `${my_utils.packageInfo.Directories.Root}/`;

//my_utils.getAsset = assetFile => utils.ReadTextFile(`${my_utils.packageInfo.Directories.Assets}/${assetFile}`);
//my_utils.getImageAsset = assetFile => gdi.Image(`${my_utils.packageInfo.Directories.Assets}/images/${assetFile}`);
//my_utils.getScriptPath = `${my_utils.packageInfo.Directories.Scripts}/`;
*/

// In callbacks.js
// at the very beggining add : 
/*
	var show_lyrics_btns = window.GetProperty("show lyrics btns", false);
	var ww = 0,
		wh = 0;
*/
// Update on_mouse_lbtn_down, on_mouse_lbtn_up, on_mouse_leave, on_mouse_move {
/*
function on_mouse_lbtn_down(x, y) {
	if(g_cursor.x!=x || g_cursor.y!=y) on_mouse_move(x,y);		
	var hover_btn = btns_manager.on_mouse("lbtn_down",x, y);
	if(!hover_btn){
		// previous code
	}
}
function on_mouse_lbtn_up(x, y) {
	var down_btn = btns_manager.on_mouse("lbtn_up",x, y);
	if(!down_btn){	
		// previous code
	}
}
function on_mouse_leave() {
	// previous code
	btns_manager.on_mouse("leave");
	g_cursor.x = 0;
    g_cursor.y = 0;	
}

function on_mouse_move(x, y, m) {
    if(x == g_cursor.x && y == g_cursor.y) return;
	g_cursor.onMouse("move", x, y, m);	  	
	// previous code
	btns_manager.on_mouse("move",x, y);
}
*/
// Add to on_notify_data
/*
		case 'show_lyrics_btns':
			show_lyrics_btns = info;
			window.SetProperty("show lyrics btns", show_lyrics_btns);
			window.Repaint();
			break;	
		case "lyrics_state": lyrics_state.value = info; positionButtons(); break;
*/
// Modify on_size
/*
function on_size() {
	ww = window.Width;
	wh = window.Height;
	// previous code
}
*/

// Modify on_paint
/*
function on_paint() {
	// previous code
	if(show_lyrics_btns) btns_manager.draw(gr);		
}
	
*/

// Add to function on_key_down(vkey) {switch(vkey) {
// case VK_ESCAPE: if(g_uihacks.getFullscreenState()) g_uihacks.toggleFullscreen(); break; 

// Comment window.NotifyOthers("bio_imgChange", 0) in scripts/timers.js

// In move(x, y) { function of buttons.js 
// replace if (!resize.down) window.SetCursor(!hand && !seeker.hand && !filmStrip.hand ? 32512 : 32649);
// with code below :
/*
	if (!resize.down) {
		if(!hand && !seeker.hand && !filmStrip.hand && !(btns_manager.cur_btn && btns_manager.cur_btn.state == ButtonStates.hover)) {
			window.SetCursor(32512);
			this.hand = false;
		} else if(hover_btn){
			window.SetCursor(32649);
			this.hand = true;
		}
	}
*/

// In draw(gr) function of images.js, in if (ppt.imgSeeker && ppt.imgSeekerDots == 0) {
// comment some line as below and make the seeker minimal width 2 px using this code : Math.max(prog,2)
/*
		if (ppt.imgSeeker && ppt.imgSeekerDots == 0) { // bar
			prog = this.dn ? $.clamp(panel.m.x - this.bar.x1, 0, this.bar.w1) : (ppt.artistView ? img.art.ix + 0.5 : img.cov.ix + 0.5) * this.bar.w1 / this.imgNo;
			//gr.DrawRect(this.bar.x1, this.bar.y2, this.bar.w1, this.bar.h, ui.style.l_w, RGB(128, 128, 128));
			gr.FillSolidRect(this.bar.x2, this.bar.y3, this.bar.w1 - ui.style.l_w, this.bar.h - ui.style.l_w, RGBA(0, 0, 0, 75));
			gr.FillSolidRect(this.bar.x2, this.bar.y3, Math.max(prog,2) - ui.style.l_w, this.bar.h - ui.style.l_w, RGB(255, 255, 255));
			//gr.SetSmoothingMode(2);
			//gr.FillEllipse(this.bar.x2 + prog - Math.round((this.bar.grip_h) / 2), this.bar.y3 - this.bar.gripOffset, this.bar.grip_h, this.bar.grip_h, RGB(245, 245, 245));
			//gr.DrawEllipse(this.bar.x2 + prog - Math.round((this.bar.grip_h) / 2), this.bar.y3 - this.bar.gripOffset, this.bar.grip_h, this.bar.grip_h, ui.style.l_w, RGB(128, 128, 128));
			//gr.SetSmoothingMode(0);
		}
*/

//In menu.js, delete MF_STRING and MF_GRAYED at the beggining

/* ------------------------------------------------------------------------------------------------------------------------------- */
/* ---------------------- BELOW ARE CHANGES MADE TO PREVIOUS VERSION, NOT USED ANYMORE.... WAITING FOR WILB UPDATE ----------------*/
/* ------------------------------------------------------------------------------------------------------------------------------- */

// For the image seekbar vertical position, create a new function 
/*
	const imgbar_metrics = (top_padding) => {
		this.bar.y2 = Math.round(this.bar.y1 + top_padding - this.bar.h / 2) - this.bar.overlapCorr;
		this.bar.y3 = this.bar.y2 + Math.ceil(ui.l_h / 2);
		this.bar.y4 = top_padding - this.bar.overlapCorr;
		this.bar.y5 = top_padding - this.bar.overlapCorr;	
	} 
*/
// Call it instead of the this.bar.yXXX definitions in const bar_metrics = (horizontal, vertical) => { with imgbar_metrics(nhh * 0.9);


// Call it in this.draw = gr => { of the Images object
// if (!ppt.text_only && cur_img) imgbar_metrics(ya+cur_img.Height-15);

// Comment some drawing in switch (ppt.imgBarDots) {} in this.draw = gr => { of the Images object 

// Update this.click function of panel object:
/*function Panel() {
	this.click = (x, y) => {
	if (!ppt.autoEnlarge && !this.text_trace && img.trace(x, y) && !ppt.text_only && !ppt.img_only) {
		this.mode(1);
	} else if(!ppt.autoEnlarge && ppt.img_only) {
		this.mode(0); 
		this.move(x,y,false);
	} else {
		// Previous this.click code
	}
}*/

// Remove in this.trace function of Images object if (!ppt.autoEnlarge) return true;
/* function Images() {
	this.trace = (x, y) => {
		// if (!ppt.autoEnlarge) return true;
		// previous code
	}
*/

function SimpleButtonManager(){
	this.buttons = {};
	this.cur_btn = null;
	this.cur_btn_down = null;	
	this.g_down = false;	
	this.addButton = function(name, x, y, w, h, text, tooltip_text, fonClick, fonDbleClick, N_img, H_img, state,opacity){
		this.buttons[name] = new SimpleButton(name, x, y, w, h, text, tooltip_text, fonClick, fonDbleClick, N_img, H_img, state,opacity);
	};
	this.chooseButton = function(x, y){
		for (var i in this.buttons) {
			if (this.buttons[i].containXY(x, y) && this.buttons[i].state != ButtonStates.hide) {
				this.cur_btn = this.buttons[i];
				return this.cur_btn;
			}
		}
		this.cur_btn = null;
		return this.cur_btn;		
	};
	this.draw = function(gr){
		for (var i in this.buttons) {
			this.buttons[i].draw(gr);
		}		
	}
	this.on_mouse = function(event, x, y) {
        switch(event) {
            case "move":
				var old = this.cur_btn;
				this.cur_btn = this.chooseButton(x, y);
				if (old == this.cur_btn) {
					this.cur_btn && this.cur_btn.onMouse("move", x, y);		
					if (this.g_down) return;
				} else if (this.g_down && this.cur_btn && this.cur_btn.state != ButtonStates.down) {
					this.cur_btn.onMouse("move", x, y);
					this.cur_btn.changeState(ButtonStates.down);
					return;
				} else {
					var repaint = false;
					if(old){
						old.changeState(ButtonStates.normal);
						old.onMouse("move", x, y);
						repaint = true;
					}
					if(this.cur_btn){
						this.cur_btn.changeState(ButtonStates.hover);
						this.cur_btn.onMouse("move", x, y);
						repaint = true;
					}	
					else g_tooltip.Deactivate();
					if(repaint) window.Repaint();
				}				
			break;
            case "leave":
				this.g_down = false;    
				if (this.cur_btn) {
					this.cur_btn.changeState(ButtonStates.normal);
					window.Repaint();
					this.cur_btn=null;        
				}
				g_tooltip.Deactivate();
			break;
            case "lbtn_up":
				this.g_down = false;      
				if (this.cur_btn_down != null && typeof this.cur_btn_down === 'object') {
					this.cur_btn_down.onClick();
					this.cur_btn_down.onMouse("leave", x, y);
				}
				return (this.cur_btn_down != null && typeof this.cur_btn_down === 'object');				
			break;
            case "lbtn_down":
				this.cur_btn_down = this.chooseButton(x, y);		
				if (this.cur_btn_down) {
					this.g_down = true;	
					this.cur_btn_down.changeState(ButtonStates.down);
					window.Repaint();
				}	
				return (this.cur_btn_down != null && typeof this.cur_btn_down === 'object');
			break;			
		}
	}	
}
function SimpleButton(name, x, y, w, h, text, tooltip_text, fonClick, fonDbleClick, N_img, H_img, state,opacity) {
    this.state = state ? state : ButtonStates.normal;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.name = name;	
    this.text = text;
    this.tooltip_text = tooltip_text;		
    this.fonClick = fonClick;
    this.fonDbleClick = fonDbleClick;
    this.N_img = N_img;
    this.H_img = H_img;   
	this.opacity = opacity;
	this.first_draw=true;	
	this.tooltip_activated = false;
	if (typeof opacity == "undefined") this.opacity = 255;
	else this.opacity = opacity;
	
    this.containXY = function (x, y) {
		if(this.x<0) return (window.Width+this.x-this.w <= x) && (x <= window.Width + this.x + this.w) && (this.y <= y) && (y <= this.y + this.h);
        else return (this.x <= x) && (x <= this.x + this.w) && (this.y <= y) && (y <= this.y + this.h);
    }
    this.changeState = function (state) {
        var old_state = this.state;
        this.state = state;
		if(this.state==ButtonStates.hover && this.cursor != IDC_HAND) {
			g_cursor.setCursor(IDC_HAND,this.text);
			this.cursor = IDC_HAND;
		} else if(this.cursor != IDC_ARROW && this.state!=ButtonStates.hover && this.state!=ButtonStates.down){
			g_cursor.setCursor(IDC_ARROW,11);	
			this.cursor = IDC_ARROW;
		}			
        return old_state;
    }    
    this.draw = function (gr) {
				
		if(this.first_draw && this.text!="") {
			this.w = gr.CalcTextWidth(this.text, g_font.normal)+this.N_img.Width;
		}
		this.first_draw=false;		
		
		if(this.x<0) var real_x_position = window.Width+this.x-this.w;
		else var real_x_position = this.x;		
		
        if (this.state == ButtonStates.hide || this.hide) return;
        var b_img=this.N_img;        
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
			gr.DrawImage(b_img, real_x_position, this.y, b_img.Width, b_img.Height, 0, 0, b_img.Width, b_img.Height,0,this.opacity);
            break;            
        }  

		if(this.text!="") {
			
			gr.GdiDrawText(this.text, g_font.normal, colors.normal_txt, real_x_position+b_img.Width, this.y, this.w, this.h, DT_LEFT| DT_VCENTER | DT_CALCRECT | DT_NOPREFIX);			
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
				if(this.text=='' && this.tooltip_text!='' && g_tooltip.activeZone != this.name){
					var tooltip_text = this.tooltip_text;
					g_tooltip.ActivateDelay(tooltip_text, x+10, y+20, globalProperties.tooltip_button_delay, 1200, false, this.name);
					this.tooltip_activated = true;
				} else if(this.tooltip_activated && this.state!=ButtonStates.hover && g_tooltip.activeZone == this.name){
					this.tooltip_activated = false;
					g_tooltip.Deactivate();
				}
			break;					
		}
    }  	
}
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
	if(ui.blur.dark){
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
	if(ui.blur.dark){	
		colors.bg = GetGrey(40);			
		colors.faded_txt = GetGrey(245);
		colors.normal_txt = GetGrey(245);
		colors.imgseekbar = GetGrey(255);
	} else {	
		colors.bg = GetGrey(40);				
		colors.faded_txt = GetGrey(100);
		colors.normal_txt = GetGrey(245);		
		colors.imgseekbar = GetGrey(50);
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