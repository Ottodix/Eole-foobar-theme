function JSButton(x, y, w, h, label, name, tooltip_text, fonDown, fonUp, fonDbleClick, N_img, H_img, btn_index, state, hover_color, hover_bar_bottom) {
    this.state = state ? state : ButtonStates.normal;
    this.x = x;
    this.y = y;
    this.w = w; 
    this.h = h;
    this.visible = true;	
    this.label = label;
    this.name = name;	
	this.text = name;
    this.fonDown = fonDown;
    this.fonUp = fonUp;	
    this.fonDbleClick = fonDbleClick;
    this.N_img = N_img;
    this.H_img = H_img;   
    this.D_img = H_img; 
    this.btn_index = btn_index; 
	this.calculate_size = true;	
    this.hover_color = hover_color ? hover_color : false;
    this.tooltip_text = tooltip_text ? tooltip_text : false;	
	this.label_uppercase = '';
    this.hover_bar_bottom = hover_bar_bottom ? hover_bar_bottom : false;
    this.display_label = true;
    this.opacity = 255;	
	this.toUpperCase = false;
	this.dbleClickActivated = false;
	this.img_x_adjustement = 0;		
	this.img_y_adjustement = 0;		
	this.txt_x_adjustement = 0;	
	this.txt_y_adjustement = 0;
	this.padding = [0,0,0,0];	
    this.containXY = function (x, y) {
		if(this.x<0) return (window.Width+this.x <= x) && (x <= window.Width + this.x + this.w) && (this.y <= y) && (y <= this.y + this.h);
        else return (this.x <= x) && (x <= this.x + this.w) && (this.y <= y) && (y <= this.y + this.h);
    }    
    this.changeState = function (state) {
		if(this.state==ButtonStates.active) return;
        var old = this.state;
        this.state = state;
        return old;
    }    
    this.ToggleVisibility = function () {
		this.visible = !this.visible;	
    } 
    this.setVisibility = function (visible) {
		this.visible = visible;	
    } 	
    this.isVisible = function () {	
		return this.visible;
	}
	this.displayLabel = function (new_state){
		this.display_label = new_state;
	}
	this.toUpperCase = function (new_state){
		this.upperCase = new_state;
	}	
	this.imgXAdjust = function (value){
		this.img_x_adjustement = value;	
	}		
	this.imgYAdjust = function (value){
		this.img_y_adjustement = value;		
	}	
	this.txtXAdjust = function (value){
		this.txt_x_adjustement = value;	
	}	
	this.txtYAdjust = function (value){
		this.txt_y_adjustement = value;	
	}
	this.setPadding = function (value){
		this.padding = value;
	}
	this.calculateSize = function (gr) {
		if(this.label_uppercase=='' && this.upperCase) this.label_uppercase = this.label.toUpperCase();
		
		if(this.name == "Foobar"){
			if(this.display_label) {
				this.w = Math.round(gr.CalcTextWidth(this.label, g_font.normal)+this.N_img.Width+this.padding[1]+this.padding[3])+4;			
			}				
		} else {
			if(!this.display_label){
				var text2_draw = '';
				var width_adjustement = -4;
			} else if(this.upperCase) {
				var text2_draw = this.label_uppercase;
				var width_adjustement = 3
			} else {
				var text2_draw = this.label;			
				var width_adjustement = 3;				
			}
			var text_size = this.display_label ? gr.CalcTextWidth(text2_draw, g_font.normal) : 0; 
			this.w = Math.round(text_size+this.padding[1]+this.padding[3]) + width_adjustement + this.N_img.Width;
		}
	}
    this.draw = function (gr, x, y) {
		if(typeof x !== 'undefined') this.x = x;
		if(typeof y !== 'undefined') this.y = y;
		
		var padding_x = this.x + this.padding[3];
		
		if(this.calculate_size && this.label!="") {
			this.calculateSize(gr);
		}
		this.calculate_size=false;
		
        if (!this.isVisible()) return;
				
        switch (this.state)
        {
			case ButtonStates.normal:
				b_img=this.N_img;
				break;
			case ButtonStates.active:				
			case ButtonStates.hover:
				b_img=this.H_img;
				break;
			case ButtonStates.down:
				b_img=this.D_img;       
				break;
			default:
				b_img=this.N_img;
				break			
        }
		
		if(this.hover_color && (this.state==ButtonStates.hover || this.state==ButtonStates.down))
			gr.FillSolidRect(this.x, this.y, this.w, this.h, this.hover_color);

		if((this.name == "search" || this.name == "fullscreen" || this.name == "lightswitch" || this.name == "nowplaying" || this.name == "rightsidebar") && compact_titlebar.isActive() && layout_state.isEqual(0)) {
			if(this.state==ButtonStates.hover || this.state==ButtonStates.down){
				//gr.FillSolidRect(this.x, -1, this.w, this.h, colors.settings_btn_hover_bg);
				//gr.DrawRect(this.x-1, -1, this.w, this.h+1, 1.0, colors.settings_btn_line);
				gr.FillSolidRect(this.x+this.w-1, 10, 1, this.h-20, colors.settings_btn_line);
			} else {
				gr.FillSolidRect(this.x+this.w-1, 10, 1, this.h-20, colors.settings_btn_line);
			}				
		}
		
		if(this.name == "Foobar"){
			if(compact_titlebar.isActive() && layout_state.isEqual(0)) gr.FillSolidRect(this.x+this.w-1, 0, 1, this.h, colors.settings_btn_line);
			else {
				gr.FillSolidRect(this.x+this.w-1, 0, 1, this.h, colors.settings_btn_line);
				gr.FillSolidRect(0, this.h-1, this.x+this.w-1, 1, colors.settings_btn_line);
			}
			if(this.state==ButtonStates.hover || this.state==ButtonStates.down){
				gr.FillSolidRect(this.x, -1, this.w-1, this.h, colors.settings_btn_hover_bg);
			}	
		}
		
		//if(main_panel_state.isEqual(this.btn_index) && this.state!=ButtonStates.active) this.changeState(ButtonStates.active);
		//if(this.state==ButtonStates.active) this.changeState(ButtonStates.normal);
		
		if(this.hover_bar_bottom && !this.hover_color && (main_panel_state.isEqual(this.btn_index) || this.state==ButtonStates.hover || this.state==ButtonStates.down))
			gr.FillSolidRect(this.x, wh-colors.active_tab_line_height, this.w, colors.active_tab_line_height, colors.active_tab);
		
		if(this.label=="" && !this.hover_color && (this.state==ButtonStates.hover || this.state==ButtonStates.down) && !((this.name == "search" || this.name == "fullscreen" || this.name == "lightswitch" || this.name == "nowplaying" || this.name == "rightsidebar") && compact_titlebar.isActive() && layout_state.isEqual(0))) {
			btn_opacity = 255;
			text_color = colors.normal_txt;
		} else if((main_panel_state.isEqual(this.btn_index) || this.state==ButtonStates.hover || this.state==ButtonStates.down) && !this.hover_color && !((this.name == "search" || this.name == "fullscreen" || this.name == "lightswitch" || this.name == "nowplaying" || this.name == "rightsidebar") && compact_titlebar.isActive() && layout_state.isEqual(0))) {
			btn_opacity = 255;
			text_color = colors.normal_txt;
		} else if(this.label=="") {
			btn_opacity = 255;
		} else {
			btn_opacity = (this.name == "Foobar")?255:colors.btn_inactive_opacity;
			text_color = (this.name == "Foobar")?colors.normal_txt:colors.inactive_txt;			
		}
		
		if(!this.display_label || this.label=="") 
			var btn_x = this.x+Math.floor((this.w-b_img.Width)/2)+this.img_x_adjustement;
		else var btn_x = padding_x+this.img_x_adjustement;
        switch (this.state)
        {    
        case ButtonStates.normal:            
            gr.DrawImage(b_img, btn_x, this.y+Math.floor((this.h-b_img.Height)/2)+this.img_y_adjustement, b_img.Width, b_img.Height, 0, 0, b_img.Width, b_img.Height,0,btn_opacity);
            break;
        default:            
            gr.DrawImage(b_img, btn_x, this.y+Math.floor((this.h-b_img.Height)/2)+this.img_y_adjustement, b_img.Width, b_img.Height, 0, 0, b_img.Width, b_img.Height,0,btn_opacity);
            break;            
        }   

		if(this.display_label && this.label!="") {
			var text2_draw = (this.upperCase) ? this.label_uppercase : this.label;
			gr.GdiDrawText(text2_draw, g_font.normal, text_color, padding_x+b_img.Width+this.txt_x_adjustement, this.y+this.txt_y_adjustement, this.w, this.h, DT_LEFT| DT_VCENTER | DT_CALCRECT | DT_NOPREFIX);	
		}
    }
    this.onMouse = function (state,x,y) {    
		switch(state){
			case 'lbtn_down':
				this.fonDown && this.fonDown();
				break;				
			case 'lbtn_up':
				if (this.containXY(x, y) && this.isVisible()) {
					this.changeState(ButtonStates.hover);
				} else this.changeState(ButtonStates.normal);
				if(this.dbleClickActivated){
					this.dbleClickActivated = false;
					return;
				}
				this.fonUp && this.fonUp();				
			break;
			case 'dble_click':
				if(this.fonDbleClick) {
					this.fonDbleClick();
					this.dbleClickActivated = true;
				} else {
					this.onMouse("lbtn_down",x,y);					
				}			
			break;
			case 'rbtn_down':
			break;		
			case 'leave':
			break;			
			case 'move':
			break;				
		}
    }  
}
function JSButtonGroup(alignment, x, y, name, adaptCursor){
	this.alignment = alignment;		
	this.x = x;
	this.y = y;
	this.hide = false;
	this.buttons = {};
	this.cur_btn = null;
	this.cur_btn_down = null;
	this.name = name;	
	this.g_down = false;
	this.w = -1;
	this.adaptCursor = adaptCursor;
	this.tooltip_activated = false;
	this.addButton = function(btn_object, btn_margins){
		this.buttons[button_object.name] = {
			obj : btn_object,
			margins : btn_margins
		};
	};
	this.addButtons = function(btns_array, btns_margins){
		for (var i in btns_array) {
			this.buttons[btns_array[i].name] = {
				obj : btns_array[i],
				margins : btns_margins
			};
		}
	};	
	this.chooseButton = function(x, y){
		for (var i in this.buttons) {
			if (this.buttons[i].obj.containXY(x, y) && this.buttons[i].obj.isVisible()) {
				this.cur_btn = this.buttons[i].obj;
				return this.cur_btn;
			}
		}
		this.cur_btn = null;
		return this.cur_btn;		
	};
	this.setBtnsSize = function(w,h){
		for (var i in this.buttons) {
			if(w>0) this.buttons[i].obj.w = w;
			if(h>0) this.buttons[i].obj.h = h;			
		}	
	};	
	this.setBtnsHeight = function(h){
		this.setBtnsSize(-1,h)		
	};	
	this.setBtnsWidth = function(w){
		this.setBtnsSize(w,-1)		
	};
	this.setVisibility = function(new_state){
		this.hide = !new_state;
	};
	this.toUpperCase = function (new_state){
		for (var i in this.buttons) {
			this.buttons[i].obj.toUpperCase(new_state);
		}		
	}	
	this.imgXAdjust = function (value){
		for (var i in this.buttons) {
			this.buttons[i].obj.imgXAdjust(value);
		}		
	}		
	this.imgYAdjust = function (value){
		for (var i in this.buttons) {
			this.buttons[i].obj.imgYAdjust(value);
		}		
	}	
	this.txtXAdjust = function (value){
		for (var i in this.buttons) {
			this.buttons[i].obj.txtXAdjust(value);
		}		
	}	
	this.txtYAdjust = function (value){
		for (var i in this.buttons) {
			this.buttons[i].obj.txtYAdjust(value);
		}		
	}		
	this.displayLabel = function (new_state){
		for (var i in this.buttons) {
			this.buttons[i].obj.displayLabel(new_state);
		}		
	}		
	this.setPadding = function (new_value){
		for (var i in this.buttons) {
			this.buttons[i].obj.setPadding(new_value);
		}		
	}	
	this.getWidth = function(force_calculation){
		if(this.w>=0 && !force_calculation) return this.w;
		this.w = 0;
		for (var i in this.buttons) {
			if(this.buttons[i].obj.isVisible()){
				this.w += this.buttons[i].margins[3] + this.buttons[i].obj.w + this.buttons[i].margins[1];
			}
		}	
		return this.w;
	};	
	this.calculateSize = function (value){
		for (var i in this.buttons) {
			this.buttons[i].obj.calculate_size = value;
		}		
	}		
	this.draw = function(gr, x, y){
		if(this.hide) return;
		var x_shift = 0;
		var button_size = Array();
		for (var i in this.buttons) {
			if(this.buttons[i].obj.isVisible()){
				x_shift += this.buttons[i].margins[3];
				switch(alignment){
					case "top-left":
						this.buttons[i].obj.draw(gr,this.x + x_shift,this.y);	
						//gr.FillSolidRect(this.x + x_shift + this.buttons[i].obj.w, 10, 1, this.buttons[i].obj.h-20, colors.settings_btn_line);
					break;	
					case "top-right":
						this.buttons[i].obj.draw(gr,window.Width - this.x - this.buttons[i].obj.w - x_shift,this.y);	
					break;				
				};
				x_shift += this.buttons[i].obj.w + this.buttons[i].margins[1];
			}
		}	
		this.w = x_shift;		
	}

	this.on_mouse = function(event, x, y) {
        switch(event) {
            case "move":
				var old = this.cur_btn;
				this.cur_btn = this.chooseButton(x, y);
				if (old == this.cur_btn) {
					if(this.cur_btn && this.cur_btn.state!=ButtonStates.active && this.adaptCursor) g_cursor.setCursor(IDC_HAND, this.name);
					if (this.g_down) return;
				} else if (this.g_down && this.cur_btn && this.cur_btn.state != ButtonStates.down) {
					old && old.changeState(ButtonStates.normal);
					this.cur_btn.changeState(ButtonStates.down);
					window.Repaint();
				} else {
					if(old){
						old.changeState(ButtonStates.normal);
						if(g_cursor.getCursor()==IDC_HAND) g_cursor.setCursor(IDC_ARROW,1);			
					}
					if(this.cur_btn){
						this.cur_btn.changeState(ButtonStates.hover);		
						if(this.cur_btn && this.cur_btn.state!=ButtonStates.active && this.adaptCursor) g_cursor.setCursor(IDC_HAND, this.name);
					}						
					window.Repaint();
				}
				if(this.cur_btn && this.cur_btn.tooltip_text && g_tooltip.activeZone != this.cur_btn.name){
					if(g_tooltip.activated) g_tooltip.Deactivate();
					g_tooltip.ActivateDelay(this.cur_btn.tooltip_text, x+10, y+20, globalProperties.tooltip_button_delay, 1200, false, this.cur_btn.name);
					this.tooltip_activated = true;
				} else if(this.tooltip_activated && (!this.cur_btn || g_tooltip.activeZone != this.cur_btn.name)){
					this.tooltip_activated = false;
					g_tooltip.Deactivate();
				}
			break;
            case "leave":
				this.g_down = false;  
				if (this.cur_btn) {
					this.cur_btn.changeState(ButtonStates.normal);  
					this.cur_btn.onMouse("leave",x,y);		
					this.cur_btn=null; 					
					g_cursor.setCursor(IDC_ARROW,2);
					window.Repaint();					
				}			
				g_tooltip.Deactivate();
			break;
            case "lbtn_up":
				this.g_down = false;
				var old = this.cur_btn;				
				this.cur_btn = this.chooseButton(x, y);
				if (this.cur_btn == old && this.cur_btn != null && typeof this.cur_btn === 'object') {
					this.cur_btn.onMouse('lbtn_up',x,y);
				}
				else {
					old && old.changeState(ButtonStates.normal);
				}
				return (this.cur_btn != null && typeof this.cur_btn === 'object');				
			break;
            case "lbtn_down":
				this.cur_btn = this.chooseButton(x, y);		
				if (this.cur_btn) {
					this.g_down = true;	
					this.cur_btn.onMouse('lbtn_down');
					g_tooltip.Deactivate();
					window.Repaint();
				}	
				return (this.cur_btn != null && typeof this.cur_btn === 'object');
			break;
			case 'rbtn_down':
			break;				
            case "dble_click":
				this.cur_btn = this.chooseButton(x, y);		
				if (this.cur_btn) {
					this.cur_btn.onMouse('dble_click');
					window.Repaint();
				}	
				return (this.cur_btn != null && typeof this.cur_btn === 'object');
			break;				
		}
	}	
}