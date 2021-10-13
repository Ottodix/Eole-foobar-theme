var properties = {
	panelName: 'WSHsmoothplaylistmanager',
    defaultRowHeight: window.GetProperty("PROPERTY: Row Height", 46),
    enableDiskCache: window.GetProperty("COVER Disk Cache", true),
    rowHeight: window.GetProperty("PROPERTY: Row Height", 42),
    rowScrollStep: 3,
    drawAlternateBG: window.GetProperty("PROPERTY: Alternate row background", true),
    scrollSmoothness: 3.0,
    showHeaderBar: window.GetProperty("DISPLAY: Show Top Bar", false),
    showNewPlaylistButton: window.GetProperty("DISPLAY: Show new playlist button", true),
    defaultHeaderBarHeight: 40,
    headerBarHeight: 40,
    headerBarPaddingTop: 0,
    paddingTopDefault: 45,
    showFilterBox: window.GetProperty("PROPERTY: Enable Playlist Filterbox in Top Bar", true),
    drawUpAndDownScrollbar: window.GetProperty("PROPERTY: Draw Up and Down Scrollbar Buttons", false),
    drawItemsCounter: window.GetProperty("PROPERTY: Show numbers of items", true),
	darklayout: window.GetProperty("_DISPLAY: Dark layout", false),
	showwallpaper: window.GetProperty("_DISPLAY: Show Wallpaper", false),
    wallpaperblurred: window.GetProperty("_DISPLAY: Wallpaper Blurred", true),
    wallpaperblurvalue: window.GetProperty("_DISPLAY: Wallpaper Blur Value", 1.05),
    wallpapermode: window.GetProperty("_SYSTEM: Wallpaper Mode", 0),
    wallpaperdisplay: window.GetProperty("_DISPLAY: Wallpaper 0=Filling 1=Adjust 2=Stretch", 0),
    enableTouchControl: window.GetProperty("PROPERTY: Touch control", false),
    enableCustomColors: window.GetProperty("CUSTOM COLOR: enable", true),
	customColorTextNormal: window.GetProperty("CUSTOM COLOR: text normal", "0-0-0"),
	customColorTextSelected: window.GetProperty("CUSTOM COLOR: text selected", "0-0-0"),
	customColorBgNormal: window.GetProperty("CUSTOM COLOR: background normal", "250-250-250"),
	customColorBgSelected: window.GetProperty("CUSTOM COLOR: background selected", "015-177-255"),
	customColorHightlight: window.GetProperty("CUSTOM COLOR: highlight", "235-235-235"),
    addedRows_end_default: window.GetProperty("_PROPERTY: empty rows at the end", 1),
    showPlaylistIcons: window.GetProperty("_PROPERTY: show an icon before the playlist name", true),
    sortAlphabetically: window.GetProperty("_PROPERTY: sort playlist alphabetically", false),	
    filtred_playlist_idx: window.GetProperty("_PROPERTY: filtred playlist idx", -1),	
	panelFontAdjustement: -1,
	emphasisOnActive: false,
	newly_added : "Newly Added",
	history : "History",
	top_rated : "Top Rated",
	radios : "Radios",
	most_played : "Most Played",
	podcasts : "Podcasts",
	external_files : "External Files",
};
var cover = {
    nocover_img: gdi.Image(theme_img_path+"\\no_cover.png"),
    stream_img: gdi.Image(theme_img_path+"\\stream_icon.png"),
};

var g_wallpaperImg = null;
var update_wallpaper = false;
var update_size = true;
var first_on_size = true;

var g_rightClickedIndex = -1;
var Update_Required_function = "";
var avoidDbleClick = avoidDbleClickTimer = false;
//var isHoverCreatePlaylist = isHoverCreatePlaylistSaved = false;

cPlaylistManager = {
    playlist_switch_pending: false,
    drag_clicked: false,
    drag_droped: false,
    drag_x: -1,
    drag_y: -1,
    drag_source_id: -1,
    drag_target_id: -1,
    inputbox_w: 0,
    inputbox_h: 0
};

cTouch = {
    down: false,
    y_start: 0,
    y_end: 0,
    y_current: 0,
    y_prev: 0,
    y_move: 0,
    scroll_delta: 0,
    t1: null,
    timer: false,
    multiplier: 0,
    delta: 0
};

cSettings = {
    visible: false
};

cFilterBox = {
    enabled: window.GetProperty("PROPERTY: Enable Filter Box", true),
    default_w: 120,
    default_h: 20,
    x: 10,
    y: 2,
    w: 120,
    h: 20
};

cColumns = {
    dateWidth: 0,
    albumArtistWidth: 0,
    titleWidth: 0,
    genreWidth: 0
};

images = {
    path: theme_img_path + "\\"
};
images_inverse = {}

blink = {
    x: 0,
    y: 0,
    totaltracks: 0,
    id: -1,
    counter: -1,
    timer: false
};

timers = {
    mouseWheel: false,
    saveCover: false,
    mouseDown: false,
    movePlaylist: false,
    deletePlaylist: false,
    rightClick: false,
    addPlaylistDone: false,
	sendManagerHeight:false
};

//=================================================// Extra functions for playlist manager panel
function renamePlaylist() {
    if(!brw.inputbox.text || brw.inputbox.text == "" || brw.inputboxID == -1) brw.inputbox.text = brw.rows[brw.inputboxID].name;
    if (brw.inputbox.text.length > 1 || (brw.inputbox.text.length == 1 && (brw.inputbox.text >= "a" && brw.inputbox.text <= "z") || (brw.inputbox.text >= "A" && brw.inputbox.text <= "Z") || (brw.inputbox.text >= "0" && brw.inputbox.text <= "9"))) {
        brw.rows[brw.inputboxID].name = brw.inputbox.text;
        plman.RenamePlaylist(brw.rows[brw.inputboxID].idx, brw.inputbox.text);
        brw.repaint();
    };
    brw.inputboxID = -1;
};
function CreatePlaylist(pl_place, pl_name){
	try {
		result = utils.InputBox(window.ID, "Give your playlist a name.", "Create New Playlist", "New Playlist", true);
		if (result){
			if (result == "") {
				plman.CreatePlaylist(pl_place, "New Playlist");
			} else plman.CreatePlaylist(pl_place, result);
			//on_playlist_switch();
			return true;
		} else return false;
	} catch(e) {
	}
}
function CreateAutoPlaylist(pl_place, pl_name, query){
	try {
		result = utils.InputBox(window.ID, "Give your playlist a name.", "Create New Autoplaylist", "New Autoplaylist", true);
		if (result){
			if (result == "") {
				plman.CreateAutoPlaylist(pl_place, "New Autoplaylist", query);
			} else plman.CreateAutoPlaylist(pl_place, result, query);
			on_playlist_switch();
			plman.ShowAutoPlaylistUI(plman.PlaylistCount-1);
		}
	} catch(e) {
	}
}

function DeletePlaylist(delete_pid){
	this.delete_pid = delete_pid;
    var parent = this;

	function delete_confirmation(status, confirmed) {
		if(confirmed){

			brw.delete_pending = true;
			timers.deletePlaylist = setTimeout(function(){
				timers.deletePlaylist && clearTimeout(timers.deletePlaylist);
				timers.deletePlaylist = false;
			}, 150);
			//
			var updateActivePlaylist = (brw.selectedRow == plman.ActivePlaylist || plman.ActivePlaylist == parent.delete_pid);
			var row = brw.getRowIdFromIdx(parent.delete_pid);
			plman.RemovePlaylistSwitch(parent.delete_pid);
			if(row < brw.rowsCount - 1) {
				brw.selectedRow = parent.delete_pid;
			} else if(row > 0) {
				brw.selectedRow = parent.delete_pid - 1;
			};
			if(updateActivePlaylist) {
				if(row < brw.rowsCount - 1) {
					var new_active_playlist = parent.delete_pid;					 
				} else if(row > 0) {
					var new_active_playlist = parent.delete_pid - 1;
				};
				var direction = -1;
				while(ExcludePlaylist(plman.GetPlaylistName(new_active_playlist))){
					if(new_active_playlist==0) direction=1;
					new_active_playlist = new_active_playlist + direction;
				}			
				if(new_active_playlist>=0 && new_active_playlist<=brw.rowsCount - 1) plman.ActivePlaylist = new_active_playlist;
			};
		}
	}
	parsed_tabname = plman.GetPlaylistName(delete_pid);
	HtmlDialog("Delete this playlist", "Delete the playlist '"+parsed_tabname+"' ?", 'Yes', 'No', delete_confirmation);
}
/*
===================================================================================================
    Objects
===================================================================================================
*/
oPlaylist = function(idx, rowId, name) {
    this.idx = idx;
    this.rowId = rowId;
    this.name = name;
	this.update_count_flag = false;
	try {
		if(idx>=0)
			this.isAutoPlaylist = plman.IsAutoPlaylist(idx);
		else this.isAutoPlaylist = false;
	} catch(e){
		this.isAutoPlaylist = false;
	}
	try {
		if(idx>=0)
			this.isLockedPlaylist = plman.IsPlaylistLocked(idx);
		else this.isLockedPlaylist = false;
	} catch(e){
		this.isLockedPlaylist = false;
	}
	try {
		if(idx>=0)
			this.item_count = plman.PlaylistItemCount(idx);
		else this.item_count = 0;
	} catch(e){
		this.item_count = 0;
	}
	this.getCount = function() {
		if(this.update_count_flag) {
			this.update_count_flag = false;			
			this.update_count();
		} 
		return this.item_count;
	}
	this.update_count = function() {
		if(!window.IsVisible) this.update_count_flag = true;
		else this.item_count = plman.PlaylistItemCount(idx);
	}
	this.setIcon = function() {
		this.icon = playlistName2icon(this.name, this.isAutoPlaylist, images);
		this.icon_inverse = playlistName2icon(this.name, this.isAutoPlaylist, images_inverse);
	}
	this.setIcon();
};

oFilterBox = function() {
	this.empty_txt_width = -1;
	this.images = {
        resetIcon_off: null,
        resetIcon_ov: null
	};

    this.getImages = function() {
		var gb;
        var w = Math.round(18 * g_zoom_percent / 100);

		if(properties.darklayout){
			this.images.search_icon = gdi.Image(theme_img_path + "\\icons\\white\\search_icon.png");
		} else {
			this.images.search_icon = gdi.Image(theme_img_path + "\\icons\\search_icon.png");
		}
		this.search_bt = new button(this.images.search_icon, this.images.search_icon, this.images.search_icon,"search_bt", "Filter playlists");

        this.images.resetIcon_off = gdi.CreateImage(w, w);
        gb = this.images.resetIcon_off.GetGraphics();
            gb.SetSmoothingMode(2);
            gb.DrawLine(5, 5, w-5, w-5, 1.0, colors.normal_txt);
            gb.DrawLine(5, w-5, w-5, 5, 1.0, colors.normal_txt);
            gb.SetSmoothingMode(0);
        this.images.resetIcon_off.ReleaseGraphics(gb);

        this.images.resetIcon_ov = gdi.CreateImage(w, w);
        gb = this.images.resetIcon_ov.GetGraphics();
            gb.SetSmoothingMode(2);
            gb.DrawLine(4, 4, w-4, w-4, 1.0, colors.normal_txt);
            gb.DrawLine(4, w-4, w-4, 4, 1.0, colors.normal_txt);
            gb.SetSmoothingMode(0);
        this.images.resetIcon_ov.ReleaseGraphics(gb);

        this.images.resetIcon_dn = gdi.CreateImage(w, w);
        gb = this.images.resetIcon_dn.GetGraphics();
            gb.SetSmoothingMode(2);
            gb.DrawLine(4, 4, w-4, w-4, 1.0, colors.reseticon_down);
            gb.DrawLine(4, w-4, w-4, 4, 1.0, colors.reseticon_down);
            gb.SetSmoothingMode(0);
        this.images.resetIcon_dn.ReleaseGraphics(gb);

        this.reset_bt = new button(this.images.resetIcon_off, this.images.resetIcon_ov, this.images.resetIcon_dn,"reset_bt","Reset filter");
	};
	this.getImages();
	this.on_init = function() {
		this.inputbox = new oInputbox(cFilterBox.w, cFilterBox.h, "", "Playlists...", colors.normal_txt, 0, 0, colors.selected_bg, g_sendResponse, "brw", undefined, "g_font.plus1");
        this.inputbox.autovalidation = true;
    };
	this.on_init();
    this.onFontChanged = function() {
		this.inputbox.onFontChanged();
	}
    this.reset_colors = function() {
        this.inputbox.textcolor = colors.normal_txt;
        this.inputbox.backselectioncolor = colors.selected_bg;
    };
    this.setSize = function(w, h, font_size) {
        this.inputbox.setSize(w, h, font_size);
        this.getImages();
    };
    this.clearInputbox = function() {
        if(this.inputbox.text.length > 0) {
            this.inputbox.text = "";
            this.inputbox.offset = 0;
            filter_text = "";
        };
    };
	this.resetSearch = function() {
		if(this.inputbox.text.length > 0) {
			this.inputbox.text = "";
			this.inputbox.offset = 0;
			g_sendResponse();
		}
	}
	this.draw = function(gr, x, y) {
        var bx = x;
		var by = y + properties.headerBarPaddingTop;
        var bw = this.inputbox.w + Math.round(44 * g_zoom_percent / 100);
        if(this.inputbox.text.length > 0) {
            this.reset_bt.draw(gr, bx+2, by+1, 255);
        } else {
			this.search_bt.draw(gr, bx, by-2, 255);
			//gr.DrawImage(this.images.search_icon, bx, by+Math.round(this.inputbox.h/2-this.images.search_icon.Height/2), this.images.search_icon.Width, this.images.search_icon.Height, 0, 0, this.images.search_icon.Width, this.images.search_icon.Height, 0, 255);
        };
		this.inputbox.draw(gr, bx+Math.round(22 * g_zoom_percent / 100)+7, by, 0, 0);
    };

    this.on_mouse = function(event, x, y, delta) {
        switch(event) {
            case "lbtn_down":
				this.inputbox.check("down", x, y);
                if(this.inputbox.text.length > 0) this.reset_bt.checkstate("down", x, y);
				else this.search_bt.checkstate("down", x, y);
                break;
            case "lbtn_up":
                if(this.inputbox.text.length > 0) {
                    if(this.reset_bt.checkstate("up", x, y) == ButtonStates.hover && !this.inputbox.drag) {
                        this.inputbox.text = "";
                        this.inputbox.offset = 0;
                        g_sendResponse();
                    };
                } else {
					if(this.search_bt.checkstate("up", x, y) == ButtonStates.hover && !this.inputbox.drag) {
						this.inputbox.activate(x,y);
						this.inputbox.repaint();
					};
				}
				this.inputbox.check("up", x, y);
                break;
            case "lbtn_dblclk":
				this.inputbox.check("dblclk", x, y);
                break;
            case "rbtn_down":
				this.inputbox.check("right", x, y);
                break;
            case "move":
				this.inputbox.check("move", x, y);
                if(this.inputbox.text.length > 0) this.reset_bt.checkstate("move", x, y);
				else this.search_bt.checkstate("move", x, y);
                break;
        };
    };

    this.on_key = function(event, vkey) {
        switch(event) {
            case "down":
				this.inputbox.on_key_down(vkey);
                break;
        };
    };

    this.on_char = function(code) {
        this.inputbox.on_char(code);
    };

	this.on_focus = function(is_focused) {
		this.inputbox.on_focus(is_focused);
	};
};

oScrollbar = function(themed) {
    this.themed = themed;
    this.showButtons = true;
    this.buttons = Array(null, null, null);
    this.buttonType = {cursor: 0, up: 1, down: 2};
    this.buttonClick = false;
    this.cursorHover = false;
    this.cursorDrag = false;
    this.color_bg = colors.lightgrey_bg;
    this.color_txt = colors.normal_txt;

    if(this.themed) {
        this.theme = window.CreateThemeManager("scrollbar");
    } else {
        this.theme = false;
    };

    this.setNewColors = function() {
        this.color_bg = colors.lightgrey_bg;
        this.color_txt = colors.normal_txt;
        this.setButtons();
        this.setCursorButton();
    };

    this.setButtons = function() {
        // normal scroll_up Image
        // Draw Themed Scrollbar (lg/col)
        if(this.themed) {
            this.upImage_normal = gdi.CreateImage(this.w, this.w);
            var gb = this.upImage_normal.GetGraphics();
            try {
                this.theme.SetPartAndStateId(1, 1);
                this.theme.DrawThemeBackground(gb, 0, 0, this.w, this.w);
            } catch(e) {
                DrawPolyStar(gb, 4, 4, this.w-8, 1, 3, 0, colors.normal_txt, blendColors(this.color_txt, this.color_bg, 0.5), 0, 255);
            };
        } else {
            this.upImage_normal = gdi.CreateImage(70, 70);
            var gb = this.upImage_normal.GetGraphics();
            DrawPolyStar(gb, 11, 16, 44, 1, 3, 0, colors.normal_txt, blendColors(this.color_txt, this.color_bg, 0.5), 0, 255);
        };
        this.upImage_normal.ReleaseGraphics(gb);

        // hover scroll_up Image
        // Draw Themed Scrollbar (lg/col)
        if(this.themed) {
            this.upImage_hover = gdi.CreateImage(this.w, this.w);
            gb = this.upImage_hover.GetGraphics();
            try {
                this.theme.SetPartAndStateId(1, 2);
                this.theme.DrawThemeBackground(gb, 0, 0, this.w, this.w);
            } catch(e) {
                DrawPolyStar(gb, 4, 4, this.w-8, 1, 3, 0, blendColors(this.color_txt, this.color_bg, 0.3), blendColors(this.color_txt, this.color_bg, 0.3), 0, 255);
            };
        } else {
            this.upImage_hover = gdi.CreateImage(70, 70);
            var gb = this.upImage_hover.GetGraphics();
            DrawPolyStar(gb, 11, 16, 44, 1, 3, 0, blendColors(this.color_txt, this.color_bg, 0.3), blendColors(this.color_txt, this.color_bg, 0.3), 0, 255);
        };
        this.upImage_hover.ReleaseGraphics(gb);

        // down scroll_up Image
        // Draw Themed Scrollbar (lg/col)
        if(this.themed) {
            this.upImage_down = gdi.CreateImage(this.w, this.w);
            gb = this.upImage_down.GetGraphics();
            try {
                this.theme.SetPartAndStateId(1, 3);
                this.theme.DrawThemeBackground(gb, 0, 0, this.w, this.w);
            } catch(e) {
                DrawPolyStar(gb, 4, 4, this.w-8, 1, 3, 0, colors.normal_txt, blendColors(this.color_txt, this.color_bg, 0.05), 0, 255);
            };
        } else {
            this.upImage_down = gdi.CreateImage(70, 70);
            gb = this.upImage_down.GetGraphics();
            DrawPolyStar(gb, 11, 13, 44, 1, 3, 0, colors.normal_txt, blendColors(this.color_txt, this.color_bg, 0.05), 0, 255);
        };
        this.upImage_down.ReleaseGraphics(gb);

        // normal scroll_down Image
        // Draw Themed Scrollbar (lg/col)
        if(this.themed) {
            this.downImage_normal = gdi.CreateImage(this.w, this.w);
            gb = this.downImage_normal.GetGraphics();
            try {
                this.theme.SetPartAndStateId(1, 5);
                this.theme.DrawThemeBackground(gb, 0, 0, this.w, this.w);
            } catch(e) {
                DrawPolyStar(gb, 4, 4, this.w-8, 1, 3, 0, colors.normal_txt, blendColors(this.color_txt, this.color_bg, 0.5), 180, 255);
            };
        } else {
            this.downImage_normal = gdi.CreateImage(70, 70);
            gb = this.downImage_normal.GetGraphics();
            DrawPolyStar(gb, 11, 10, 44, 1, 3, 0, colors.normal_txt, blendColors(this.color_txt, this.color_bg, 0.5), 180, 255);
        };
        this.downImage_normal.ReleaseGraphics(gb);

        // hover scroll_down Image
        // Draw Themed Scrollbar (lg/col)
        if(this.themed) {
            this.downImage_hover = gdi.CreateImage(this.w, this.w);
            gb = this.downImage_hover.GetGraphics();
            try {
                this.theme.SetPartAndStateId(1, 6);
                this.theme.DrawThemeBackground(gb, 0, 0, this.w, this.w);
            } catch(e) {
                DrawPolyStar(gb, 4, 4, this.w-8, 1, 3, 1, blendColors(this.color_txt, this.color_bg, 0.3), blendColors(this.color_txt, this.color_bg, 0.3), 180, 255);
            };
        } else {
            this.downImage_hover = gdi.CreateImage(70, 70);
            gb = this.downImage_hover.GetGraphics();
            DrawPolyStar(gb, 11, 10, 44, 1, 3, 1, blendColors(this.color_txt, this.color_bg, 0.3), blendColors(this.color_txt, this.color_bg, 0.3), 180, 255);
        };
        this.downImage_hover.ReleaseGraphics(gb);

        // down scroll_down Image
        // Draw Themed Scrollbar (lg/col)
        if(this.themed) {
            this.downImage_down = gdi.CreateImage(this.w, this.w);
            gb = this.downImage_down.GetGraphics();
            try {
                this.theme.SetPartAndStateId(1, 7);
                this.theme.DrawThemeBackground(gb, 0, 0, this.w, this.w);
            } catch(e) {
                DrawPolyStar(gb, 4, 4, this.w-8, 1, 3, 0, colors.normal_txt, blendColors(this.color_txt, this.color_bg, 0.05), 180, 255);
            };
        } else {
            this.downImage_down = gdi.CreateImage(70, 70);
            gb = this.downImage_down.GetGraphics();
            DrawPolyStar(gb, 11, 13, 44, 1, 3, 0, colors.normal_txt, blendColors(this.color_txt, this.color_bg, 0.05), 180, 255);
        };
        this.downImage_down.ReleaseGraphics(gb);

        for(i = 1; i < this.buttons.length; i++) {
            switch(i) {
            case this.buttonType.cursor:
                this.buttons[this.buttonType.cursor] = new button(this.cursorImage_normal, this.cursorImage_hover, this.cursorImage_down,"scrollbarcursor");
                break;
            case this.buttonType.up:
                this.buttons[this.buttonType.up] = new button(this.upImage_normal.Resize(this.w,this.w,2), this.upImage_hover.Resize(this.w,this.w,2), this.upImage_down.Resize(this.w,this.w,2),"scrollbarup");
                break;
            case this.buttonType.down:
                this.buttons[this.buttonType.down] = new button(this.downImage_normal.Resize(this.w,this.w,2), this.downImage_hover.Resize(this.w,this.w,2), this.downImage_down.Resize(this.w,this.w,2),"scrollbardown");
                break;
            };
        };
    };

    this.setCursorButton = function() {
        // normal cursor Image
        this.cursorImage_normal = gdi.CreateImage(this.cursorw, this.cursorh);
        var gb = this.cursorImage_normal.GetGraphics();
		//gb.FillSolidRect(1, 0, this.cursorw-2, this.cursorh, blendColors(this.color_txt, this.color_bg, 0.5) & 0x88ffffff);
		//gb.DrawRect(1, 0, this.cursorw-2 - 1, this.cursorh - 1, 1.0, this.color_txt & 0x44ffffff);
		gb.FillSolidRect(this.cursorw-cScrollBar.normalWidth-1, cScrollBar.marginTop, cScrollBar.normalWidth-2, this.cursorh-cScrollBar.marginTop-cScrollBar.marginBottom, colors.scrollbar_normal_cursor);
        this.cursorImage_normal.ReleaseGraphics(gb);

        // hover cursor Image
        this.cursorImage_hover = gdi.CreateImage(this.cursorw, this.cursorh);
        gb = this.cursorImage_hover.GetGraphics();
        // Draw Themed Scrollbar (lg/col)
        if(this.themed) {
            try {
                this.theme.SetPartAndStateId(3, 2);
                this.theme.DrawThemeBackground(gb, 0, 0, this.cursorw, this.cursorh);
                if(this.cursorh >= 30) {
                    this.theme.SetPartAndStateId(9, 2);
                    this.theme.DrawThemeBackground(gb, 0, 0, this.cursorw, this.cursorh);
                };
            } catch(e) {
                gb.FillSolidRect(1, 0, this.cursorw-2, this.cursorh, blendColors(this.color_txt, this.color_bg, 0.3));
            };
        } else {
            //gb.FillSolidRect(1, 0, this.cursorw-2, this.cursorh, blendColors(this.color_txt, this.color_bg, 0.3) & 0x88ffffff);
            //gb.DrawRect(1, 0, this.cursorw-2 - 1, this.cursorh - 1, 1.0, this.color_txt & 0x44ffffff);
			gb.FillSolidRect(this.cursorw-cScrollBar.hoverWidth, 0, cScrollBar.hoverWidth, this.cursorh,colors.scrollbar_hover_cursor);
        };
        this.cursorImage_hover.ReleaseGraphics(gb);

        // down cursor Image
        this.cursorImage_down = gdi.CreateImage(this.cursorw, this.cursorh);
        gb = this.cursorImage_down.GetGraphics();
        // Draw Themed Scrollbar (lg/col)
        if(this.themed) {
            try {
                this.theme.SetPartAndStateId(3, 3);
                this.theme.DrawThemeBackground(gb, 0, 0, this.cursorw, this.cursorh);
                if(this.cursorh >= 30) {
                    this.theme.SetPartAndStateId(9, 3);
                    this.theme.DrawThemeBackground(gb, 0, 0, this.cursorw, this.cursorh);
                };
            } catch(e) {
                gb.FillSolidRect(1, 0, this.cursorw-2, this.cursorh, blendColors(this.color_txt, this.color_bg, 0.05));
            };
        } else {
            //gb.FillSolidRect(1, 0, this.cursorw-2, this.cursorh, blendColors(this.color_txt, this.color_bg, 0.05) & 0x88ffffff);
            //gb.DrawRect(1, 0, this.cursorw-2 - 1, this.cursorh - 1, 1.0, this.color_txt & 0x44ffffff);
			gb.FillSolidRect(this.cursorw-cScrollBar.downWidth, 0, cScrollBar.downWidth, this.cursorh,colors.scrollbar_down_cursor);
        };
        this.cursorImage_down.ReleaseGraphics(gb);

        // create/refresh cursor Button in buttons array
        this.buttons[this.buttonType.cursor] = new button(this.cursorImage_normal, this.cursorImage_hover, this.cursorImage_down,"scrollbarcursor");
        this.buttons[this.buttonType.cursor].x = this.x;
        this.buttons[this.buttonType.cursor].y = this.cursory;
    };

    this.draw = function(gr) {
        // scrollbar background
        if(this.themed) {
            try {
                this.theme.SetPartAndStateId(6, 1);
                this.theme.DrawThemeBackground(gr, this.x, this.y, this.w, this.h);
            } catch(e) {
                //gr.FillSolidRect(this.x, this.y, this.w, this.h, this.color_bg & 0x25ffffff);
                //gr.FillSolidRect(this.x, this.y, 1, this.h, this.color_txt & 0x05ffffff);
            };
        } else {
           // gr.FillSolidRect(this.x, this.y, this.w, this.h, this.color_bg & 0x25ffffff);
            //gr.FillSolidRect(this.x, this.y, 1, this.h, this.color_txt & 0x05ffffff);
        };
        // scrollbar buttons
        if(cScrollBar.visible) this.buttons[this.buttonType.cursor].draw(gr, this.x, this.cursory, 255);
        if(this.showButtons && properties.drawUpAndDownScrollbar) {
            this.buttons[this.buttonType.up].draw(gr, this.x, this.y, 255);
            this.buttons[this.buttonType.down].draw(gr, this.x, this.areay + this.areah, 255);
        };
    };

    this.updateScrollbar = function() {
        var prev_cursorh = this.cursorh;
        this.total = (brw.rowsCount+properties.addedRows_end);
        this.rowh = properties.rowHeight;
        this.totalh = this.total * this.rowh;
        // set scrollbar visibility
        cScrollBar.visible = (this.totalh > brw.h+5);
        // set cursor width/height
        this.cursorw = cScrollBar.activeWidth;
        if(this.total > 0) {
            this.cursorh = Math.round((brw.h / this.totalh) * this.areah);
            if(this.cursorh < cScrollBar.minCursorHeight) this.cursorh = cScrollBar.minCursorHeight;
			if(this.cursorh > cScrollBar.maxCursorHeight) this.cursorh = cScrollBar.maxCursorHeight;
        } else {
            this.cursorh = cScrollBar.minCursorHeight;
        };
        // set cursor y pos
        this.setCursorY();
        if(this.cursorh != prev_cursorh) this.setCursorButton();
    };

    this.setCursorY = function() {
        // set cursor y pos
        var ratio = scroll / (this.totalh - brw.h);
        this.cursory = this.areay + Math.round((this.areah - this.cursorh) * ratio);
    };

    this.setSize = function() {
        if(properties.drawUpAndDownScrollbar) this.buttonh = cScrollBar.width;
		else this.buttonh = 0;
        this.x = brw.x + brw.w-cScrollBar.activeWidth;
        this.y = brw.y - properties.headerBarHeight*0;
        this.w = cScrollBar.activeWidth;
        this.h = brw.h + properties.headerBarHeight*0;
        if(this.showButtons) {
            this.areay = this.y + this.buttonh;
            this.areah = this.h - (this.buttonh * 2);
        } else {
            this.areay = this.y;
            this.areah = this.h;
        };
        this.setButtons();
    };

    this.setScrollFromCursorPos = function() {
        // calc ratio of the scroll cursor to calc the equivalent item for the full list (with gh)
        var ratio = (this.cursory - this.areay) / (this.areah - this.cursorh);
        // calc idx of the item (of the full list with gh) to display at top of the panel list (visible)
        scroll = Math.round((this.totalh - brw.h) * ratio);
    };

    this.cursorCheck = function(event, x, y) {
		if(!this.buttons[this.buttonType.cursor]) return;
        switch(event) {
        case "down":
            var tmp = this.buttons[this.buttonType.cursor].checkstate(event, x, y);
			if(tmp == ButtonStates.down) {
                this.cursorClickX = x;
                this.cursorClickY = y;
                this.cursorDrag = true;
                this.cursorDragDelta = y - this.cursory;
            };
            break;
        case "up":
			this.buttons[this.buttonType.cursor].checkstate(event, x, y);
            if(this.cursorDrag) {
                this.setScrollFromCursorPos();
                brw.repaint();
            };
            this.cursorClickX = 0;
            this.cursorClickY = 0;
            this.cursorDrag = false;
            break;
        case "move":
			var state = this.buttons[this.buttonType.cursor].checkstate(event, x, y);
			if(state == ButtonStates.hover && !this.cursorHover) {
				this.cursorHover = true;
				brw.repaint();
			} else if(this.cursorHover && state != ButtonStates.hover){
				this.cursorHover = false;
				brw.repaint();
			}
            if(this.cursorDrag) {
                this.cursory = y - this.cursorDragDelta;
                if(this.cursory + this.cursorh > this.areay + this.areah) {
                    this.cursory = (this.areay + this.areah) - this.cursorh;
                };
                if(this.cursory < this.areay) {
                    this.cursory = this.areay;
                };
                this.setScrollFromCursorPos();
                brw.repaint();
            };
            break;
		case "leave":
			this.buttons[this.buttonType.cursor].checkstate(event, 0, 0);
			break;
        };
    };

    this._isHover = function(x, y) {
        return (x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h);
    };

    this._isHoverArea = function(x, y) {
        return (x >= this.x && x <= this.x + this.w && y >= this.areay && y <= this.areay + this.areah);
    };

    this._isHoverCursor = function(x, y) {
        return (x >= this.x && x <= this.x + this.w && y >= this.cursory && y <= this.cursory + this.cursorh);
    };

    this.on_mouse = function(event, x, y, delta) {
        this.isHover = this._isHover(x, y);
        this.isHoverArea = this._isHoverArea(x, y);
        this.isHoverCursor = this._isHoverCursor(x, y);
        this.isHoverButtons = this.isHover && !this.isHoverCursor && !this.isHoverArea;
        this.isHoverEmptyArea = this.isHoverArea && !this.isHoverCursor;

        var scroll_step = properties.rowHeight;
        var scroll_step_page = brw.h;

        switch(event) {
            case "down":
            case "dblclk":
                if((this.isHoverCursor || this.cursorDrag) && !this.buttonClick && !this.isHoverEmptyArea) {
                    this.cursorCheck(event, x, y);
                } else {
                    // buttons events
                    var bt_state = ButtonStates.normal;
                    for(var i = 1; i < 3; i++) {
                        switch(i) {
                            case 1: // up button
                                bt_state = this.buttons[i].checkstate(event, x, y);
                                if((event == "down" && bt_state == ButtonStates.down) || (event == "dblclk" && bt_state == ButtonStates.hover)) {
                                    this.buttonClick = true;
                                    scroll = scroll - scroll_step;
                                    scroll = check_scroll(scroll);
                                    if(!cScrollBar.timerID) {
                                        cScrollBar.timerID = setInterval(function() {
                                            if(cScrollBar.timerCounter > 6) {
                                                scroll = scroll - scroll_step;
                                                scroll = check_scroll(scroll);
                                            } else {
                                                cScrollBar.timerCounter++;
                                            };
                                        }, 80);
                                    };
                                };
                                break;
                            case 2: // down button
                                bt_state = this.buttons[i].checkstate(event, x, y);
                                if((event == "down" && bt_state == ButtonStates.down) || (event == "dblclk" && bt_state == ButtonStates.hover)) {
                                    this.buttonClick = true;
                                    scroll = scroll + scroll_step;
                                    scroll = check_scroll(scroll);
                                    if(!cScrollBar.timerID) {
                                        cScrollBar.timerID = setInterval(function() {
                                            if(cScrollBar.timerCounter > 6) {
                                                scroll = scroll + scroll_step;
                                                scroll = check_scroll(scroll);
                                            } else {
                                                cScrollBar.timerCounter++;
                                            };
                                        }, 80);
                                    };
                                };
                                break;
                        };
                    };
                    if(!this.buttonClick && this.isHoverEmptyArea) {
                        // check click on empty area scrollbar
                        if(y < this.cursory) {
                            // up
                            this.buttonClick = true;
                            scroll = scroll - scroll_step_page;
                            scroll = check_scroll(scroll);
                            if(!cScrollBar.timerID) {
                                cScrollBar.timerID = setInterval(function() {
                                    if(cScrollBar.timerCounter > 6 && g_cursor.y < brw.scrollbar.cursory) {
                                        scroll = scroll - scroll_step_page;
                                        scroll = check_scroll(scroll);
                                    } else {
                                        cScrollBar.timerCounter++;
                                    };
                                }, 80);
                            };
                        } else {
                            // down
                            this.buttonClick = true;
                            scroll = scroll + scroll_step_page;
                            scroll = check_scroll(scroll);
                            if(!cScrollBar.timerID) {
                                cScrollBar.timerID = setInterval(function() {
                                    if(cScrollBar.timerCounter > 6 && g_cursor.y > brw.scrollbar.cursory + brw.scrollbar.cursorh) {
                                        scroll = scroll + scroll_step_page;
                                        scroll = check_scroll(scroll);
                                    } else {
                                        cScrollBar.timerCounter++;
                                    };
                                }, 80);
                            };
                        };
                    };
                };
                break;
            case "right":
            case "up":
                if(cScrollBar.timerID) {
                    window.ClearInterval(cScrollBar.timerID);
                    cScrollBar.timerID = false;
                };
                cScrollBar.timerCounter = -1;

                this.cursorCheck(event, x, y);
                for(var i = 1; i < 3; i++) {
                    this.buttons[i].checkstate(event, x, y);
                };
                this.buttonClick = false;
                break;
            case "move":
                this.cursorCheck(event, x, y);
                for(var i = 1; i < 3; i++) {
                    this.buttons[i].checkstate(event, x, y);
                };
                break;
            case "wheel":
                if(!this.buttonClick) {
                    this.updateScrollbar();
                };
                break;
            case "leave":
                this.cursorCheck(event, 0, 0);
                for(var i = 1; i < 3; i++) {
                    this.buttons[i].checkstate(event, 0, 0);
                };
                break;
        };
    };
};

oBrowser = function(name) {
    this.name = name;
    this.rows = [];
    this.SHIFT_start_id = null;
    this.SHIFT_count = 0;
    this.scrollbar = new oScrollbar(themed = cScrollBar.themed);
    this.keypressed = false;
    this.inputbox = null;
    this.inputboxID = -1;
    this.selectedRow = plman.ActivePlaylist;
	this.playing_icon_x = 0;
	this.playing_icon_y = 0;
	this.playing_icon_w = 0;
	this.playing_icon_h = 0;
	this.filter_results = -1;
    this.launch_populate = function() {
        var launch_timer = setTimeout(function(){
            brw.populate(is_first_populate = true, 2, reset_scroll = true);
            launch_timer && clearTimeout(launch_timer);
            launch_timer = false;
        }, 50);
    };

    this.repaint = function() {
        if(!window.IsVisible) return;
        repaint_main1 = repaint_main2;
    };

    this.setSize = function(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.marginLR = 0;
        this.paddingLeft = 8;
        this.paddingRight = 12;
        this.totalRows = Math.ceil(this.h / properties.rowHeight);
        this.totalRowsVis = Math.floor(this.h / properties.rowHeight);

        this.getlimits();

        g_filterbox.setSize(ww, cFilterBox.h+2, g_fsize+1);

        if(this.inputboxID > -1) {
            var rh = properties.rowHeight - 10;
            var tw = this.w - rh - 10;
            this.inputbox && this.inputbox.setSize(tw, rh, g_fsize+1);
        };

        this.scrollbar.setSize();

        scroll = Math.round(scroll / properties.rowHeight) * properties.rowHeight;
        scroll = check_scroll(scroll);
        scroll_ = scroll;

        // scrollbar update
        this.scrollbar.updateScrollbar();
    };
	this.sort = function(){
        var total = this.rows.length;
		function sortPlaylistAlphabetically(a,b) {
			if(a.name < b.name) return -1;
			if(a.name > b.name) return 1;
			return 0;
		}		
		g_avoid_on_playlists_changed = true;
		if(properties.showNewPlaylistButton) this.rows.shift();
		this.rows.sort(sortPlaylistAlphabetically);
		var order = [];
		for(var i = this.rows.length-1; i > 0; i--) {
			order[this.rows[i].idx] = i;
			g_avoid_on_playlists_changed = true;
			//console.log(this.rows[i].name+" - from:"+this.rows[i].idx+" to:"+i);
			//plman.MovePlaylist(this.rows[i].idx, i);
		}
		order.forEach((v, i) => {
			plman.MovePlaylist(v, i);
			console.log(this.rows[i].name+" - from:"+v+" to:"+i);
		});
		this.populate(true,14);
	}
    this.init_groups = function() {
        var rowId = 0;
        var name = "";
        var total = plman.PlaylistCount;
        this.previous_playlistCount = total;
		this.rows.splice(0, this.rows.length);
        var str_filter = process_string(filter_text);

		// draw Create playlist Button
		 if(properties.showNewPlaylistButton) {
			this.rows.push(new oPlaylist(-1, rowId, globalProperties.create_playlist));
			rowId++;
		 }
	
		function sortPlaylistAlphabetically(a,b) {
			if(a.name < b.name) return -1;
			if(a.name > b.name) return 1;
			return 0;
		}
		
		for(var i = 0; i < total; i++) {
			name = plman.GetPlaylistName(i);
			if(name==globalProperties.filter_playlist) this.filter_results = i;
			if(ExcludePlaylist(name)){
				var toAdd = false;
			} else if(str_filter.length > 0) {
				var toAdd = match(name, str_filter);
			} else {
				var toAdd = true;
			};
			if(toAdd) {
				this.rows.push(new oPlaylist(i, rowId, name));
				rowId++;
			};
		};

        this.rowsCount = rowId;
        this.getlimits();
    };

    this.getlimits = function() {
        if(this.rowsCount <= this.totalRowsVis) {
            var start_ = 0;
            var end_ = this.rowsCount - 1;
        } else {
            if(scroll_ < 0) scroll_ = scroll;
            var start_ = Math.round(scroll_ / properties.rowHeight + 0.4);
            var end_ = start_ + this.totalRows;
            // check boundaries
            start_ = start_ > 0 ? start_ - 1 : start_;
            if(start_ < 0) start_ = 0;
            if(end_ >= this.rows.length) end_ = this.rows.length - 1;
        };
        g_start_ = start_;
        g_end_ = end_;
    };

    this.populate = function(is_first_populate, call_id, reset_scroll) {
		console.log("--> populate smoothPlaylistManager call_id:"+call_id)
        this.init_groups();
		if(this.selectedRow > this.rowsCount) this.selectedRow = plman.ActivePlaylist;		
        if(reset_scroll) scroll = scroll_ = 0;
        this.scrollbar.updateScrollbar();
        this.repaint();
        g_first_populate_done = true;
		Update_Required_function = "";
    };
	
    this.getRowIdFromIdx = function(idx) {
        var total = this.rows.length;
        var rowId = -1;
        if(plman.PlaylistCount > 0) {
            for(var i=0; i < total; i++) {
                if(this.rows[i].idx == idx) {
                    rowId = i;
                    break;
                };
            };
        };
        return rowId;
    };
    this.setIcons = function(idx) {
        var total = this.rows.length;
		for(var i=0; i < total; i++) {
			this.rows[i].setIcon();
		};
    };
    this.isVisiblePlaylist = function(idx) {
        var rowId = this.getRowIdFromIdx(idx);
        var offset_active_pl = properties.rowHeight * rowId;
        if(offset_active_pl < scroll || offset_active_pl + properties.rowHeight > scroll + this.h) {
            return false;
        } else {
            return true;
        };
    };

    this.showSelectedPlaylist = function() {
        var rowId = this.getRowIdFromIdx(brw.selectedRow);

        if(!this.isVisiblePlaylist(brw.selectedRow)) {
            scroll = (rowId - Math.floor(this.totalRowsVis / 2)) * properties.rowHeight;
            scroll = check_scroll(scroll);
            this.scrollbar.updateScrollbar();
        };
    };

    this.showActivePlaylist = function() {
        var rowId = this.getRowIdFromIdx(plman.ActivePlaylist);

        if(!this.isVisiblePlaylist(plman.ActivePlaylist)) {
            scroll = (rowId - Math.floor(this.totalRowsVis / 2)) * properties.rowHeight;
            scroll = check_scroll(scroll);
            this.scrollbar.updateScrollbar();
        };
    };
	this.FindPlayingPlaylist = function() {
		if(!fb.IsPlaying) this.PlayingPlaylist = -1;
		this.PlayingPlaylist = this.getRowIdFromIdx(plman.PlayingPlaylist);
	}
    this.draw = function(gr) {

        if(cPlaylistManager.playlist_switch_pending) {
            g_cursor.setCursor(IDC_ARROW,39);
            cPlaylistManager.playlist_switch_pending = false;
        };

        if(repaint_main || !repaintforced){
            repaint_main = false;
            repaintforced = false;

			var ax = this.marginLR;
			var ay = 0;
			var aw = this.w;
			var ah = properties.rowHeight;
			var g = 0;
			gr.SetTextRenderingHint(globalProperties.TextRendering);

            if(this.rows.length > 0) {
				headerBarFix = (properties.showHeaderBar)?1:0;
                for(var i = g_start_;i <= g_end_;i++){
                    var is_active = false;
                    ay = Math.floor(this.y + (i * ah) - scroll_);
                    this.rows[i].x = ax;
                    this.rows[i].y = ay;
					if(ay > this.y - properties.headerBarHeight - ah && ay < this.y + this.h) {
                        // =========
                        // row bg
                        // =========
						if(i % 2 == 0 && properties.drawAlternateBG && !(this.rows[i].idx == plman.ActivePlaylist)) {
							gr.FillSolidRect(ax, ay, aw, ah, colors.alternate_row);
						};

                        // active playlist row bg
                        if(this.rows[i].idx == plman.ActivePlaylist || (i==g_rightClickedIndex && g_rightClickedIndex > -1) || (this.rows[i].idx == properties.filtred_playlist_idx && properties.filtred_playlist_idx>-1 && plman.ActivePlaylist==this.filter_results)) {
                            gr.FillSolidRect(ax, ay, aw, ah, colors.selected_item_bg);
							//top
							if(i>0 ){
							gr.FillSolidRect(ax, ay, aw-1-colors.track_gradient_size-colors.padding_gradient, 1, colors.selected_item_line);
							if(colors.track_gradient_size) gr.FillGradRect(ax+aw-colors.track_gradient_size-colors.padding_gradient-1, ay, colors.track_gradient_size, 1, 0, colors.selected_item_line, colors.selected_item_line_off, 1.0);
							}
							//bottom
							gr.FillSolidRect(ax, ay+ah-1, aw-1-colors.track_gradient_size-colors.padding_gradient, 1, colors.selected_item_line);
							if(colors.track_gradient_size) gr.FillGradRect(ax+aw-colors.track_gradient_size-colors.padding_gradient-1, ay+ah-1, colors.track_gradient_size, 1, 0, colors.selected_item_line, colors.selected_item_line_off, 1.0);

							is_active = true;
                        };

                        // hover item
                        if((((g_rightClickedIndex > -1 && g_rightClickedIndex == i) || i == this.activeRow) && !(this.scrollbar.cursorDrag || this.scrollbar.cursorHover) && !g_dragndrop_status && !(cPlaylistManager.drag_clicked && cPlaylistManager.drag_source_id!=i)) ||  (cPlaylistManager.drag_clicked && cPlaylistManager.drag_source_id==i && !g_dragndrop_status)) {
							gr.FillSolidRect(ax, ay, colors.width_marker_hover_item, ah, colors.marker_hover_item);
                        };

                        // target location mark
                        if(cPlaylistManager.drag_target_id == i) {
                            if(cPlaylistManager.drag_target_id > cPlaylistManager.drag_source_id) {
                                gr.FillSolidRect(ax, ay + properties.rowHeight - 2, aw-1, 2, colors.dragdrop_marker_line);
                            } else if(cPlaylistManager.drag_target_id < cPlaylistManager.drag_source_id) {
                                gr.FillSolidRect(ax, ay + 1, aw-1, 2, colors.dragdrop_marker_line);
                            };
                        };

                        if(g_dragndrop_status && i == g_dragndrop_targetPlaylistId) {
							if(!this.rows[i].isAutoPlaylist){
								gr.FillSolidRect(ax, ay, aw, ah, colors.dragdrop_bg_selected_item);
								//top
								gr.FillSolidRect(ax, ay, aw, 1, colors.dragdrop_line_selected_item);
								//bottom
								gr.FillSolidRect(ax, ay+ah-1, aw, 1, colors.dragdrop_line_selected_item);
							} else {
								gr.FillSolidRect(ax, ay, aw, ah, colors.dragdrop_disabled_item);
							}
                        }

                        // draw blink rectangle after an external drag'n drop files
                        if(blink.counter > -1) {
                            if(i == blink.id && !this.rows[i].isAutoPlaylist) {
                                if(blink.counter <= 7 && blink.counter % 2 == 0) {
									gr.FillSolidRect(ax, ay, aw, ah, colors.dragdrop_bg_selected_item);
									gr.FillSolidRect(ax, ay, aw, 1, colors.dragdrop_line_selected_item);
									gr.FillSolidRect(ax, ay+ah-1, aw, 1, colors.dragdrop_line_selected_item);
                                };
                            };
                        };

                        // =====
                        // text
                        // =====
                        if(ay >= (0 - ah) && ay < this.y + this.h) {

							if(fb.IsPlaying && (this.rows[i].idx == plman.PlayingPlaylist || (this.rows[i].idx == properties.filtred_playlist_idx && properties.filtred_playlist_idx>-1 && plman.PlayingPlaylist==this.filter_results)) && this.rows[i].idx>=0) {
                                var font = g_font.boldplus1;
								if(is_active && properties.emphasisOnActive)
									var playlist_icon = (g_seconds%2==0)?images_inverse.now_playing_0:images_inverse.now_playing_1;
								else
									var playlist_icon = (g_seconds%2==0)?images.now_playing_0:images.now_playing_1;
								icon_x = ax+this.paddingLeft+1;
								icon_y = ay+Math.round(ah/2-playlist_icon.Height/2)-2;
								icon_w = playlist_icon.Width;
								icon_h = playlist_icon.Height;
								this.playing_icon_x = icon_x;
								this.playing_icon_y = icon_y;
								this.playing_icon_w = icon_w;
								this.playing_icon_h = icon_h;
                            } else {
                                var font = g_font.plus1;
								if(is_active && properties.emphasisOnActive)
									var playlist_icon = this.rows[i].icon_inverse;
								else
									var playlist_icon = this.rows[i].icon;
								icon_x = ax+this.paddingLeft;
								icon_y = ay+Math.round(ah/2-playlist_icon.Height/2)-1;
								icon_w = playlist_icon.Width;
								icon_h = playlist_icon.Height;
                            };

                            // playlist icon
							if(properties.showPlaylistIcons){
								if(is_active && properties.emphasisOnActive) {
									gr.FillSolidRect(icon_x, icon_y, icon_w, icon_h, colors.marker_hover_item);
								}
								var rh = this.rows[i].icon.Width;
								gr.DrawImage(playlist_icon, icon_x, icon_y, icon_w, icon_h, 0, 0, icon_w, icon_h, 0, is_active?255: colors.icon_opacity);
							} else var rh = 0;

                            // fields
                            var track_name_part = this.rows[i].name;
                            var track_total_part = this.rows[i].getCount();

                            cColumns.track_name_part = gr.CalcTextWidth(track_name_part, font) + 15;
							if(properties.drawItemsCounter && this.rows[i].idx !=-1)
								cColumns.track_total_part = gr.CalcTextWidth(track_total_part, font);
							else cColumns.track_total_part = 0;

							if(is_active && properties.emphasisOnActive)
								var tx = ax + rh + this.paddingLeft + 10;
                            else
								var tx = ax + rh + this.paddingLeft + 4;
							var tw = aw;

                            if(this.inputboxID == i) {
                                this.inputbox.draw(gr, tx+2, ay+5);
                            } else {
                                gr.GdiDrawText(track_name_part, font, is_active?colors.full_txt:colors.normal_txt, tx, ay, aw - tx - cColumns.track_total_part - this.paddingRight - 5, ah, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
								if(properties.drawItemsCounter)
                                gr.GdiDrawText(track_total_part, g_font.min2, colors.faded_txt, ax + aw - cColumns.track_total_part - this.paddingRight, ay, cColumns.track_total_part, ah, DT_RIGHT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
                            };
                        };
                    };
                };
			}
			if((properties.showNewPlaylistButton && this.rows.length <= 1) || (!properties.showNewPlaylistButton && this.rows.length == 0)) {
				if(g_first_populate_done){ // no playlist, manager panel is empty
						var px = 0;
						var line_width = Math.min(150,Math.round(this.w-40));
						var py = this.y + properties.rowHeight + Math.round(this.h  / 2)-1 - wh * 0.1;
						if(g_filterbox.inputbox.text!='') {
							var text1 = "No items";
							var text2 = "matching";
						} else {
							var text1 = "";
							var text2 = "Nothing seleted";
						}
						if(text1!='') {
							gr.GdiDrawText(text1, g_font.plus5, colors.normal_txt, this.x, py - 40, this.w, 36, DT_CENTER | DT_BOTTOM | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
							gr.FillSolidRect(this.x+Math.round(this.w/2-line_width/2),py, line_width, 1, colors.border);
							gr.GdiDrawText(text2, g_font.italicplus1, colors.faded_txt, this.x, py + 6, this.w, 20, DT_CENTER | DT_TOP | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
						} else {
							gr.GdiDrawText(text2, g_font.italicplus1, colors.faded_txt, this.x, py - 10, this.w, 20, DT_CENTER | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
						}
				} else { // no track, playlist is empty
						var px = 0;
						var line_width = Math.min(150,Math.round(this.w-40));
						var py = this.y + Math.round(this.h  / 2)-1;
						gr.GdiDrawText("Loading...", g_font.plus5, colors.normal_txt, this.x, py - 40, this.w, 36, DT_CENTER | DT_BOTTOM | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
						gr.FillSolidRect(this.x+Math.round(this.w/2-line_width/2),py, line_width, 1, colors.border);
						gr.GdiDrawText("Playlists manager", g_font.italicplus1, colors.faded_txt, this.x, py + 6, this.w, 20, DT_CENTER | DT_TOP | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
				}
			}
			// draw bottom gradient
			gr.FillGradRect(0, wh-colors.fading_bottom_height+2, ww, colors.fading_bottom_height, 90, colors.grad_bottom_2,  colors.grad_bottom_1,1);

            // draw header
            if(properties.showHeaderBar) {
                if(globalProperties.fontAdjustement>=globalProperties.fontAdjustement_max-2) var boxText = this.rows.length;
				else var boxText = this.rows.length+" playlist"+(this.rows.length>1?"s":"");

                gr.FillSolidRect(this.x, 0, this.w - this.x -1, properties.headerBarHeight, colors.headerbar_bg);
                gr.FillSolidRect(this.x, properties.headerBarHeight, this.w - this.x -1, 1, colors.headerbar_line);

				if(g_filterbox.inputbox.text.length==0) {
					if(g_filterbox.empty_txt_width < 0) g_filterbox.empty_txt_width = gr.CalcTextWidth(g_filterbox.inputbox.empty_text, g_filterbox.inputbox.font_empty);
					var text_width = gr.CalcTextWidth(boxText,g_font.plus1)
					var tx = cFilterBox.x + g_filterbox.empty_txt_width;

					var tw = this.w - tx - 12;
					try {
						gr.GdiDrawText(boxText, g_font.min1, colors.faded_txt, tx, properties.headerBarPaddingTop, tw, properties.headerBarHeight-properties.headerBarPaddingTop, DT_RIGHT | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX | DT_END_ELLIPSIS);
					} catch(e) {console.log(e)};
				}
				if(properties.showFilterBox && g_filterbox) {
					if(g_filterbox.inputbox.visible) {
						g_filterbox.draw(gr, cFilterBox.x, Math.round(properties.headerBarHeight/2-cFilterBox.h/2)-2);
					};
				};
            };


			// draw scrollbar
			if(cScrollBar.enabled)  {
				brw.scrollbar && brw.scrollbar.draw(gr);
			};
			if(g_resizing.isResizing()) gr.FillSolidRect(ww-1, 0, 1, wh, colors.dragdrop_marker_line);
			else gr.FillSolidRect(ww-1, 0, 1, wh, colors.sidesline);

        };
    };

    this._isHover = function(x, y) {
        return (x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h);
    };

    this.activateItem = function(index) {
        if(this.groups.length == 0) return;
        this.selectedIndex = index;
    };

    this.on_mouse = function(event, x, y) {
        this.ishover = this._isHover(x, y);
		this.is_hover_scrollbar = this.scrollbar._isHover(x, y);
        // get hover row index (mouse cursor hover)
        this.activeRow = -1;
		//isHoverCreatePlaylist = (y>properties.headerBarHeight && y<properties.headerBarHeight+properties.rowHeight && properties.showNewPlaylistButton);
		if(this.ishover && !this.is_hover_scrollbar) {
			if(y > this.y && y < this.y + this.h) {
				this.activeRow = Math.ceil((y + scroll_ - this.y) / properties.rowHeight - 1);
				if(this.activeRow >= this.rows.length) this.activeRow = -1;
			}
		}
        if(brw.activeRow != brw.activeRowSaved){ //|| isHoverCreatePlaylistSaved != isHoverCreatePlaylist) {
            brw.activeRowSaved = brw.activeRow;
			//isHoverCreatePlaylistSaved = isHoverCreatePlaylist;
            this.repaint();
        };

        switch(event) {
            case "down":
				this.down = true;
				if(cScrollBar.enabled && cScrollBar.visible && this.scrollbar._isHover(x, y)) {
					this.scrollbar && this.scrollbar.on_mouse(event, x, y);
				} else {
					if(!cTouch.down && !timers.mouseDown && this.ishover && this.activeRow > -1 && Math.abs(scroll - scroll_) < 2) {
						window.NotifyOthers("g_avoid_on_focus_change",true);
						this.selectedRow = this.activeRow;
						if(properties.showNewPlaylistButton && this.rows[this.activeRow].idx ==-1 && !avoidDbleClick){
							avoidDbleClick = true;
							var total = plman.PlaylistCount;
							if(CreatePlaylist(total, "")){
								plman.MovePlaylist(total, total);
								plman.ActivePlaylist = total;
								brw.selectedRow = total;
							}
							g_cursor.setCursor(IDC_ARROW,40);
							avoidDbleClickTimer = setTimeout(function() {
								clearTimeout(avoidDbleClickTimer);
								avoidDbleClick = false;
							}, 200);
						}
						else if(plman.ActivePlaylist != this.rows[this.activeRow].idx) {
							if(this.inputboxID > -1) this.inputboxID = -1;
							this.repaint();
							plman.ActivePlaylist = this.rows[this.activeRow].idx;
							cPlaylistManager.playlist_switch_pending = true;
						} else if(this.activeRow == this.inputboxID) {
							this.inputbox.check("down", x, y);
						} else {
							if(this.inputboxID > -1) this.inputboxID = -1;
							if(!this.up) {
								// set dragged item to reorder list
								cPlaylistManager.drag_clicked = true;
								cPlaylistManager.drag_x = x;
								cPlaylistManager.drag_y = y;
								cPlaylistManager.drag_source_id = this.selectedRow;
							};
							//};
						};
						this.repaint();
					} else {
						/*if(isHoverCreatePlaylist && !avoidDbleClick){
							avoidDbleClick = true;
							var total = plman.PlaylistCount;
							if(CreatePlaylist(total, "")){
								plman.MovePlaylist(total, total);
								plman.ActivePlaylist = total;
							}
							g_cursor.setCursor(IDC_ARROW,41);
							avoidDbleClickTimer = setTimeout(function() {
								clearTimeout(avoidDbleClickTimer);
								avoidDbleClick = false;
							}, 200);
						}	*/
						if(this.inputboxID > -1) this.inputboxID = -1;
						// scrollbar
						if(cScrollBar.enabled && cScrollBar.visible) {
							this.scrollbar && this.scrollbar.on_mouse(event, x, y);
						};
					};
				}
				this.up = false;
                break;
            case "up":
                this.up = true;
                if(this.down) {
                    // scrollbar
                    if(cScrollBar.enabled && cScrollBar.visible) {
                        brw.scrollbar && brw.scrollbar.on_mouse(event, x, y);
                    };

                    if(this.inputboxID >= 0) {
                        this.inputbox.check("up", x, y);
                    } else {
                        // drop playlist switch
                        if(cPlaylistManager.drag_target_id > -1) {
                            if(cPlaylistManager.drag_target_id != cPlaylistManager.drag_source_id) {
                                cPlaylistManager.drag_droped = true
                                if(cPlaylistManager.drag_target_id < cPlaylistManager.drag_source_id) {
                                    plman.MovePlaylist(this.rows[cPlaylistManager.drag_source_id].idx, this.rows[cPlaylistManager.drag_target_id].idx);
                                } else if(cPlaylistManager.drag_target_id > cPlaylistManager.drag_source_id) {
                                    plman.MovePlaylist(this.rows[cPlaylistManager.drag_source_id].idx, this.rows[cPlaylistManager.drag_target_id].idx);
                                };
                            };
                            this.selectedRow = cPlaylistManager.drag_target_id;
                        };
                    };

                    if(timers.movePlaylist) {
                        timers.movePlaylist && window.ClearInterval(timers.movePlaylist);
                        timers.movePlaylist = false;
                    };
                };

                this.down = false;

                if(cPlaylistManager.drag_moved) g_cursor.setCursor(IDC_ARROW,42);

                cPlaylistManager.drag_clicked = false;
                cPlaylistManager.drag_moved = false;
                cPlaylistManager.drag_source_id = -1;
                cPlaylistManager.drag_target_id = -1;
                cPlaylistManager.drag_x = -1;
                cPlaylistManager.drag_y = -1;
                break;
            case "dblclk":  //browser dblclk

                if(this.ishover && this.activeRow > -1 && Math.abs(scroll - scroll_) < 2) {
					plman.ExecutePlaylistDefaultAction(this.rows[this.activeRow].idx,0);
                } else {
                    // scrollbar
                    if(cScrollBar.enabled && cScrollBar.visible && brw.scrollbar._isHover) {
                        brw.scrollbar && brw.scrollbar.on_mouse(event, x, y);
                    } else {
						var total = plman.PlaylistCount;
						if(CreatePlaylist(total, "")){
							plman.ActivePlaylist = total;
							brw.selectedRow = total;
						}
						g_cursor.setCursor(IDC_ARROW,43);
					}
                };
                break;
            case "move":
                this.up = false;
                if(this.inputboxID >= 0) {
                    this.inputbox.check("move", x, y);
                } else {
                    if(cPlaylistManager.drag_clicked && (Math.abs(cPlaylistManager.drag_x-x)>10 || Math.abs(cPlaylistManager.drag_y-y)>10)) {
                        cPlaylistManager.drag_moved = true;
						g_cursor.setCursor(IDC_HELP,'drag');
                    };
                    if(cPlaylistManager.drag_moved) {
                        if(this.activeRow > -1) {
							if(properties.showNewPlaylistButton && this.rows[this.activeRow].idx ==-1) this.activeRow=this.activeRow+1
                            if(timers.movePlaylist) {
                                timers.movePlaylist && window.ClearInterval(timers.movePlaylist);
                                timers.movePlaylist = false;
                            };
                            if(this.activeRow != cPlaylistManager.drag_source_id) {
                                if(this.activeRow != cPlaylistManager.drag_source_id) {
                                    cPlaylistManager.drag_target_id = this.activeRow;
                                };
                            } else if(y > this.rows[this.rowsCount - 1].y + properties.rowHeight && y < this.rows[this.rowsCount - 1].y + properties.rowHeight*2) {
                                cPlaylistManager.drag_target_id = this.rowsCount;
                            } else {
                                cPlaylistManager.drag_target_id = -1;
                            };
                        } else {
                            if(y < this.y) {
                                if(!timers.movePlaylist) {
                                    timers.movePlaylist = setInterval(function() {
                                        scroll -= properties.rowHeight;
                                        scroll = check_scroll(scroll);
										if(properties.showNewPlaylistButton)
											cPlaylistManager.drag_target_id = cPlaylistManager.drag_target_id > 1 ? cPlaylistManager.drag_target_id - 1 : 1;
										else
											cPlaylistManager.drag_target_id = cPlaylistManager.drag_target_id > 0 ? cPlaylistManager.drag_target_id - 1 : 0;
                                    }, 100);
                                }
                            } else if (y > this.y + this.h) {
                                if(!timers.movePlaylist) {
                                    timers.movePlaylist = setInterval(function() {
                                        scroll += properties.rowHeight;
                                        scroll = check_scroll(scroll);
                                        cPlaylistManager.drag_target_id = cPlaylistManager.drag_target_id < this.rowsCount - 1 ? cPlaylistManager.drag_target_id + 1 : this.rowsCount - 1;
                                    }, 100);
                                }
                            };
                        };
                        brw.repaint();
                    };
                };

                // scrollbar
                if(cScrollBar.enabled && cScrollBar.visible) {
                    brw.scrollbar && brw.scrollbar.on_mouse(event, x, y);
                };
                break;
            case "right":
				g_rightClickedIndex = this.activeRow;
                if(this.inputboxID >= 0) {
                    this.inputbox.check("bidon", x, y);
                    if(!this.inputbox.hover) {
                        this.inputboxID = -1;
                        this.on_mouse("right", x, y);
                    } else {
                        this.inputbox.check("right", x, y);
                    };
                } else {

                    if(this.ishover) {
                        if(this.activeRow > -1 && Math.abs(scroll - scroll_) < 2) {
                            if(!utils.IsKeyPressed(VK_SHIFT)) {
                                this.repaint();
                                this.selectedRow = this.activeRow;
                                //plman.ActivePlaylist = this.rows[this.activeRow].idx;
                               // if(!timers.rightClick) {
                                   // timers.rightClick = setTimeout(function() {
                                        this.context_menu(x, y, this.selectedRow);
                                   //     timers.rightClick && clearTimeout(timers.rightClick);
                                   //     timers.rightClick = false;
                                  //  },50);
                               // };
                            };
                            this.repaint();
                        } else {
                            this.context_menu(x, y, this.activeRow);
                        };
                    } else {
                        // scrollbar
                        if(cScrollBar.enabled && cScrollBar.visible) {
                            this.scrollbar && this.scrollbar.on_mouse(event, x, y);
                        };
                        // settings menu
                        if(!g_filterbox.inputbox.hover) {
                            this.context_menu(x, y);
                        };
                    };
					g_rightClickedIndex = -1;
                };
                break;
            case "wheel":
				//browser mouse event
                break;
            case "leave":
                // scrollbar
                if(cScrollBar.enabled && cScrollBar.visible) {
                    this.scrollbar && this.scrollbar.on_mouse(event, 0, 0);
                };
				g_tooltip.Deactivate();
                break;
            case "drag_over":
				if(timers.movePlaylist) {
					timers.movePlaylist && window.ClearInterval(timers.movePlaylist);
					timers.movePlaylist = false;
				}
                if(this.rows.length > 0) {
                    if(y > brw.y) {
                        if(this.activeRow > -1) {
                            if(this.rows[this.activeRow].isAutoPlaylist) {
                                g_dragndrop_targetPlaylistId = this.activeRow
                            } else {
                                g_dragndrop_targetPlaylistId = this.activeRow;
                            };
                        } else {
                            g_dragndrop_targetPlaylistId = -1;
                        };
                    };
					if(cScrollBar.visible){
						drag_scroll_zone_height = properties.rowHeight/3
						if(y < this.y+drag_scroll_zone_height) {
							if(!timers.movePlaylist) {
								timers.movePlaylist = setInterval(function() {
									scroll -= properties.rowHeight;
									scroll = check_scroll(scroll);
								}, 100);
							}
						} else if (y > this.y + this.h-drag_scroll_zone_height) {
							if(!timers.movePlaylist) {
								timers.movePlaylist = setInterval(function() {
									scroll += properties.rowHeight;
									scroll = check_scroll(scroll);
								}, 100);
							}
						};
					}
                } else {
                    g_dragndrop_bottom = true;
                    g_dragndrop_trackId = 0;
                    g_dragndrop_rowId = 0;
                };
                break;
        }
    }
    this.setRowHeight = function(step){
		var zoomStep = 1;
		var previous = properties.defaultRowHeight;
		step = step*-1;
		if(!timers.mouseWheel) {
			properties.defaultRowHeight -= step * zoomStep;
			if(properties.defaultRowHeight < 20) properties.defaultRowHeight = 20;
			if(properties.defaultRowHeight > 450) properties.defaultRowHeight = 450;
			if(previous != properties.defaultRowHeight) {
				timers.mouseWheel = setTimeout(function() {
					window.SetProperty("PROPERTY: Row Height", properties.defaultRowHeight);
					get_metrics();
					brw.repaint();
					timers.mouseWheel && clearTimeout(timers.mouseWheel);
					timers.mouseWheel = false;
				}, 100)
			}
		}
    }
	this.resetTimer = function(){
		if(this.g_time) {
			window.ClearInterval(this.g_time);
			this.g_time = false;
		};
	}
	this.startTimer = function(){
		this.resetTimer();
		try{
			this.timerStartTime = Date.now();
		}catch(e){}
		brw.timerCounter = 0;
		this.g_time = setInterval(function() {
			brw.timerCounter++;
			//Restart if the animation is desyncronised
			try{
				if(Math.abs(brw.timerStartTime+brw.timerCounter*globalProperties.refreshRate-Date.now())>500){
					brw.startTimer();
				}
			}catch(e){}
			brw.timerScript();
		}, globalProperties.refreshRate);
	}
    this.timerScript = function() {

        if(!window.IsVisible) {
            window_visible = false;
            return;
        };
        var repaint_1 = false;


        if(!window_visible){
            window_visible = true;
        };

        if(!g_first_populate_launched) {
            g_first_populate_launched = true;
            brw.launch_populate();
        };


        // get hover row index (mouse cursor hover)
        /* if(g_cursor.y > brw.y && g_cursor.y < brw.y + brw.h) {
            brw.activeRow = Math.ceil((g_cursor.y + scroll_ - brw.y ) / properties.rowHeight - 1);
            if(brw.activeRow >= brw.rows.length) brw.activeRow = -1;
        } else {
            brw.activeRow = -1;
        }; */

        if(repaint_main1 == repaint_main2){
            repaint_main2 = !repaint_main1;
            repaint_1 = true;
        };

        scroll = check_scroll(scroll);
        if(Math.abs(scroll - scroll_) >= 1){
            scroll_ += (scroll - scroll_) / properties.scrollSmoothness;
            repaint_1 = true;
            isScrolling = true;
            //
            if(scroll_prev != scroll) brw.scrollbar.updateScrollbar();
        } else {
            if(isScrolling) {
                if(scroll_< 1) scroll_ = 0;
                isScrolling = false;
                repaint_1 = true;
            };
        };

        if(repaint_1){
            if(brw.rows.length > 0) brw.getlimits();
            repaintforced = true;
            repaint_main = true;
            window.Repaint();
        };

        scroll_prev = scroll;
    }

	this.context_menu = function(x, y, id) {
        var MF_SEPARATOR = 0x00000800;
        var MF_STRING = 0x00000000;
        var _menu = window.CreatePopupMenu();
        var _newplaylist = window.CreatePopupMenu();
        var _autoplaylist = window.CreatePopupMenu();
        var idx;
        var total_area, visible_area;
        var bout, z;
        var add_mode = (id == null || id < 0 || (this.rows[id] && this.rows[id].idx<0));
        var total = plman.PlaylistCount;

		_menu.AppendMenuItem(MF_STRING, 1, "Settings...");
		_menu.AppendMenuSeparator();

        if(!add_mode) {
            var pl_idx = this.rows[id].idx;
            _newplaylist.AppendTo(_menu, (g_filterbox.inputbox.text.length > 0 ? MF_GRAYED | MF_DISABLED : MF_STRING), "Insert ...");
        } else {
            id = this.rowsCount;
            var pl_idx = total;
            _newplaylist.AppendTo(_menu, (g_filterbox.inputbox.text.length > 0 ? MF_GRAYED | MF_DISABLED : MF_STRING), "Add ...");
        };
        _newplaylist.AppendMenuItem(MF_STRING, 100, "New Playlist");
        _newplaylist.AppendMenuItem(MF_STRING, 101, "New Autoplaylist");
        _autoplaylist.AppendTo(_newplaylist, MF_STRING, "Preset Playlists");
        //_autoplaylist.AppendMenuItem(MF_STRING, 200, "Media Library (full)");
        _autoplaylist.AppendMenuItem(MF_STRING, 205, "History (tracks played in the last weeks)");
        _autoplaylist.AppendMenuItem(MF_STRING, 206, "Most Played tracks");
        _autoplaylist.AppendMenuItem(MF_STRING, 207, "Top Rated tracks");
        _autoplaylist.AppendMenuItem(MF_STRING, 210, "Newly added tracks");
		_autoplaylist.AppendMenuItem(MF_SEPARATOR, 0, "");
        _autoplaylist.AppendMenuItem(MF_STRING, 211, properties.radios);
        _autoplaylist.AppendMenuItem(MF_STRING, 212, properties.external_files);
        _autoplaylist.AppendMenuItem(MF_STRING, 213, properties.podcasts);
        //_autoplaylist.AppendMenuItem(MF_SEPARATOR, 0, "");
        //_autoplaylist.AppendMenuItem(MF_STRING, 250, "Loved Tracks");
        _menu.AppendMenuItem(MF_SEPARATOR, 0, "");
        _menu.AppendMenuItem(MF_STRING, 2, "Load a Playlist");
        if(!add_mode) {
            _menu.AppendMenuItem(MF_STRING, 4, "Save this Playlist");
            _menu.AppendMenuItem(MF_SEPARATOR, 0, "");
            _menu.AppendMenuItem(MF_STRING, 5, "Duplicate this playlist");

            _menu.AppendMenuItem(MF_STRING, 3, "Rename this playlist");
            _menu.AppendMenuItem(MF_STRING, 8, "Delete this playlist");


            if(plman.IsAutoPlaylist(this.rows[id].idx)) {
                _menu.AppendMenuItem(MF_SEPARATOR, 0, "");
                _menu.AppendMenuItem(MF_STRING, 6, "Autoplaylist properties...");
                _menu.AppendMenuItem(MF_STRING, 7, "Convert to a normal playlist");
            };

        };

        idx = _menu.TrackPopupMenu(x, y);

        switch (true) {
		case (idx==1):
			//window.ShowProperties();
			this.settings_context_menu(x, y);
			break;
        case (idx==100):
			if(CreatePlaylist(total, "")){
				plman.MovePlaylist(total, pl_idx);
				plman.ActivePlaylist = pl_idx;
				brw.selectedRow = total;
			}
			g_cursor.setCursor(IDC_ARROW,44);
            this.repaint();
            break;
        case (idx==101):
            var total = plman.PlaylistCount;
            g_avoid_on_playlists_changed = true;
			plman.CreatePlaylist(total, "");
			var new_label = plman.GetPlaylistName(total);
			plman.RemovePlaylist(total);
            g_avoid_on_playlists_changed = false;

			if(CreateAutoPlaylist(total, new_label, "enter your query here")){
				plman.MovePlaylist(total, pl_idx);
				plman.ActivePlaylist = pl_idx;
			}
			g_cursor.setCursor(IDC_ARROW,45);
            this.repaint();
            break;
        case (idx==2):
            fb.RunMainMenuCommand("File/Load Playlist...");
            break;
        case (idx==3):
			try {
				playlistname = utils.InputBox(window.ID, "Rename the playlist: "+plman.GetPlaylistName(pl_idx), "Rename a playlist", plman.GetPlaylistName(pl_idx), true);
				if(!playlistname || playlistname == "") playlistname = plman.GetPlaylistName(pl_idx);
				if (playlistname.length > 1 || (playlistname.length == 1 && (playlistname >= "a" && playlistname <= "z") || (playlistname >= "A" && playlistname <= "Z") || (playlistname >= "0" && playlistname <= "9"))) {
					plman.RenamePlaylist(pl_idx, playlistname);
					window.Repaint();
				}
			} catch(e) {
			}
            this.repaint();
            break;
        case (idx==4):
            fb.RunMainMenuCommand("File/Save Playlist...");
            break;
        case (idx==5):
            plman.DuplicatePlaylist(pl_idx, "Copy of " + plman.GetPlaylistName(pl_idx));
            plman.ActivePlaylist = pl_idx + 1;
            break;
        case (idx==6):
            plman.ShowAutoPlaylistUI(pl_idx);
            break;
        case (idx==7):
            plman.DuplicatePlaylist(pl_idx, plman.GetPlaylistName(pl_idx));
            plman.RemovePlaylistSwitch(pl_idx);
            //plman.ActivePlaylist = pl_idx;
            break;
        case (idx==8):
            if(brw.rowsCount > 0) {
				DeletePlaylist(pl_idx);
                /*if(!this.delete_pending && !timers.deletePlaylist) {
                    this.delete_pending = true;
                    timers.deletePlaylist = setTimeout(function(){
                        timers.deletePlaylist && clearTimeout(timers.deletePlaylist);
                        timers.deletePlaylist = false;
                    }, 150);
                    //
                    var updateActivePlaylist = (this.selectedRow == plman.ActivePlaylist);
                    var id = this.selectedRow;
                    var row = this.getRowIdFromIdx(id);
                    plman.RemovePlaylistSwitch(id);
                        if(row < this.rowsCount - 1) {
                            this.selectedRow = id;
                        } else if(row > 0) {
                            this.selectedRow = id - 1;
                        };
                    if(updateActivePlaylist) {
                        if(row < this.rowsCount - 1) {
                            plman.ActivePlaylist = id;
                        } else if(row > 0) {
                            plman.ActivePlaylist = id - 1;
                        };
                    };
                };*/
            };
            break;
        case (idx==200):
            var total = plman.PlaylistCount;
            //p.playlistManager.inputboxID = -1;
            plman.CreateAutoPlaylist(total, globalProperties.media_library, "ALL", "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
            plman.MovePlaylist(total, pl_idx);
            plman.ActivePlaylist = pl_idx;
            break;
        case (idx==205):
            var total = plman.PlaylistCount;
            //p.playlistManager.inputboxID = -1;
            plman.CreateAutoPlaylist(total, properties.history, "%last_played% DURING LAST 1 WEEK SORT DESCENDING BY %last_played%", "",1);
            plman.MovePlaylist(total, pl_idx);
            plman.ActivePlaylist = pl_idx;
            break;
        case (idx==206):
            var total = plman.PlaylistCount;
            //p.playlistManager.inputboxID = -1;
            plman.CreateAutoPlaylist(total, properties.most_played, "%play_count% GREATER 2 SORT DESCENDING BY %play_count%", "", 1);
            plman.MovePlaylist(total, pl_idx);
            plman.ActivePlaylist = pl_idx;
            break;
        case (idx==207):
            var total = plman.PlaylistCount;
            //p.playlistManager.inputboxID = -1;
            plman.CreateAutoPlaylist(total, properties.top_rated, (globalProperties.use_ratings_file_tags ? "$meta(rating)" : "%rating%") + " GREATER 1 SORT DESCENDING BY " + (globalProperties.use_ratings_file_tags ? "$meta(rating)" : "%rating%"), "", 1);
            plman.MovePlaylist(total, pl_idx);
            plman.ActivePlaylist = pl_idx;
            break;
        case (idx==210):
            var total = plman.PlaylistCount;
            //p.playlistManager.inputboxID = -1;
            plman.CreateAutoPlaylist(total, properties.newly_added, "%added% DURING LAST 12 WEEKS SORT DESCENDING BY %added%", "",1);
            plman.MovePlaylist(total, pl_idx);
            plman.ActivePlaylist = pl_idx;
            break;
        case (idx==211):
            var total = plman.PlaylistCount;
            //brw.inputboxID = -1;
            plman.CreatePlaylist(total, properties.radios);
            plman.MovePlaylist(total, pl_idx);
            plman.ActivePlaylist = pl_idx;
            break;
        case (idx==212):
            var total = plman.PlaylistCount;
            //p.playlistManager.inputboxID = -1;
            plman.CreatePlaylist(total, properties.external_files);
            plman.MovePlaylist(total, pl_idx);
            plman.ActivePlaylist = pl_idx;
            break;
        case (idx==213):
            var total = plman.PlaylistCount;
            //p.playlistManager.inputboxID = -1;
            plman.CreatePlaylist(total, properties.podcasts);
            plman.MovePlaylist(total, pl_idx);
            plman.ActivePlaylist = pl_idx;
            break;
        case (idx==250):
            var total = plman.PlaylistCount;
            //p.playlistManager.inputboxID = -1;
            plman.CreateAutoPlaylist(total, "Loved Tracks", "%mood% GREATER 0", "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
            plman.MovePlaylist(total, pl_idx);
            plman.ActivePlaylist = pl_idx;
            break;
        };
        _autoplaylist = undefined;
        _newplaylist = undefined;
		_menu = undefined;
        g_rbtn_click = false;
        brw.repaint();
		return true;
	};

    this.settings_context_menu = function(x, y) {
        var _menu = window.CreatePopupMenu();
        var _menu1 = window.CreatePopupMenu();
        var _menu2 = window.CreatePopupMenu();
		var _menu2A = window.CreatePopupMenu();
        var _menu3 = window.CreatePopupMenu();
        var _rowHeight = window.CreatePopupMenu();

        var idx;

        _menu.AppendMenuItem(MF_GRAYED, 0, "Display :");
        _menu.AppendMenuSeparator();

        _menu.AppendMenuItem(MF_STRING, 910, "Search bar");
        _menu.CheckMenuItem(910, properties.showHeaderBar);
        _menu.AppendMenuItem(MF_STRING, 911, "Create Playlist Button");
        _menu.CheckMenuItem(911, properties.showNewPlaylistButton);

		_menu.AppendMenuItem(MF_STRING, 912, "Items count");
		_menu.CheckMenuItem(912, properties.drawItemsCounter);

		_menu.AppendMenuItem(MF_STRING, 913, "Playlists Icons");
		_menu.CheckMenuItem(913, properties.showPlaylistIcons);
		
		//_menu.AppendMenuItem(MF_STRING, 914, "Sort playlists alphabetically");
		//_menu.CheckMenuItem(914, properties.sortAlphabetically);	
		
		_menu.AppendMenuSeparator();

		_rowHeight.AppendMenuItem(MF_STRING, 1000, "Increase");
		_rowHeight.AppendMenuItem(MF_STRING, 1001, "Decrease");
		_rowHeight.AppendMenuSeparator();
		_rowHeight.AppendMenuItem(MF_DISABLED, 0, "Tip: Hold SHIFT and use your");
		_rowHeight.AppendMenuItem(MF_DISABLED, 0, "mouse wheel over the panel!");
		_rowHeight.AppendTo(_menu,MF_STRING, "Row height");

		var _panelWidth = window.CreatePopupMenu();
		_panelWidth.AppendMenuItem(MF_STRING, 1030, "Increase width");
		_panelWidth.AppendMenuItem(MF_STRING, 1031, "Decrease width");
		_panelWidth.AppendMenuItem(MF_STRING, 1033, "Custom width...");
		_panelWidth.AppendMenuItem(MF_STRING, 1032, "Reset");
		_panelWidth.AppendTo(_menu,MF_STRING, "Panel width");

		_menu2.AppendMenuItem(MF_STRING, 200, "Enable");
		_menu2.CheckMenuItem(200, properties.showwallpaper);
		_menu2.AppendMenuItem(MF_STRING, 220, "Blur");
		_menu2.CheckMenuItem(220, properties.wallpaperblurred);

		_menu2A.AppendMenuItem(MF_STRING, 221, "Filling");
		_menu2A.CheckMenuItem(221, properties.wallpaperdisplay==0);
		_menu2A.AppendMenuItem(MF_STRING, 222, "Adjust");
		_menu2A.CheckMenuItem(222, properties.wallpaperdisplay==1);
		_menu2A.AppendMenuItem(MF_STRING, 223, "Stretch");
		_menu2A.CheckMenuItem(223, properties.wallpaperdisplay==2);
		_menu2A.AppendTo(_menu2,MF_STRING, "Wallpaper size");
		//_menu2.AppendMenuSeparator();
		//_menu2.AppendMenuItem((!properties.showwallpaper ? MF_GRAYED | MF_DISABLED : MF_STRING), 210, "Default");
		//_menu2.AppendMenuItem((!properties.showwallpaper ? MF_GRAYED | MF_DISABLED : MF_STRING), 211, "Playing Album Cover");
		//_menu2.CheckMenuRadioItem(210, 211, properties.wallpapermode == 0 ? 211 : 210);

		_menu2.AppendTo(_menu,MF_STRING, "Background Wallpaper");

        //_menu.AppendMenuSeparator();
        //_menu.AppendMenuItem(MF_STRING, 991, "Panel Properties");
        //_menu.AppendMenuItem(MF_STRING, 992, "Configure...");

        idx = _menu.TrackPopupMenu(x,y);

        switch(true) {
			case (idx == 200):
				toggleWallpaper();
				break;
			case (idx == 210):
				properties.wallpapermode = 99;on_colours_changed();
				window.SetProperty("_SYSTEM: Wallpaper Mode", properties.wallpapermode);
				if(fb.IsPlaying) g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
				brw.repaint();
				break;
			case (idx == 211):
				properties.wallpapermode = 0;on_colours_changed();
				window.SetProperty("_SYSTEM: Wallpaper Mode", properties.wallpapermode);
				if(fb.IsPlaying) g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
				brw.repaint();
				break;
			case (idx == 220):
				properties.wallpaperblurred = !properties.wallpaperblurred;on_colours_changed();
				window.SetProperty("_DISPLAY: Wallpaper Blurred", properties.wallpaperblurred);
				g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
				brw.repaint();
				break;
			case (idx == 221):
				properties.wallpaperdisplay = 0;
				window.SetProperty("_DISPLAY: Wallpaper 0=Filling 1=Adjust 2=Stretch", properties.wallpaperdisplay);
				g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
				brw.repaint();
				break;
			case (idx == 222):
				properties.wallpaperdisplay = 1;
				window.SetProperty("_DISPLAY: Wallpaper 0=Filling 1=Adjust 2=Stretch", properties.wallpaperdisplay);
				g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
				brw.repaint();
				break;
			case (idx == 223):
				properties.wallpaperdisplay = 2;
				window.SetProperty("_DISPLAY: Wallpaper 0=Filling 1=Adjust 2=Stretch", properties.wallpaperdisplay);
				g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
				brw.repaint();
				break;
            case (idx == 910):
                properties.showHeaderBar = !properties.showHeaderBar;
                window.SetProperty("DISPLAY: Show Top Bar", properties.showHeaderBar);
                get_metrics();
                brw.repaint();
                break;
            case (idx == 911):
                properties.showNewPlaylistButton = !properties.showNewPlaylistButton;
                window.SetProperty("DISPLAY: Show new playlist button", properties.showNewPlaylistButton);
				brw.populate(true, 3);
                get_metrics();
                brw.repaint();
                break;
            case (idx == 912):
                properties.drawItemsCounter = !properties.drawItemsCounter;
                window.SetProperty("PROPERTY: Show numbers of items", properties.drawItemsCounter);
                get_metrics();
                brw.repaint();properties.showPlaylistIcons
                break;
            case (idx == 913):
                properties.showPlaylistIcons = !properties.showPlaylistIcons;
                window.SetProperty("_PROPERTY: show an icon before the playlist name", properties.showPlaylistIcons);
                get_metrics();
                brw.repaint();
                break;
            case (idx == 914):
				brw.sort();
                /*properties.sortAlphabetically = !properties.sortAlphabetically;
                window.SetProperty("_PROPERTY: sort playlist alphabetically", properties.sortAlphabetically);
				brw.populate(true, 3);
                get_metrics();*/
                brw.repaint();
                break;				
            case (idx == 991):
                window.ShowProperties();
                break;
            case (idx == 992):
                window.ShowConfigure();
                break;
			case (idx == 1000):
				this.setRowHeight(2);
				break;
			case (idx == 1001):
				this.setRowHeight(-2);
				break;
			case (idx == 1030):
				playlistpanel_width.increment(10);
				break;
			case (idx == 1031):
				playlistpanel_width.decrement(10);
				break;
			case (idx == 1032):
				playlistpanel_width.setDefault();
				break;
			case (idx == 1033):
				playlistpanel_width.userInputValue("Enter the desired width in pixel.\nDefault width is 180px.\nMinimum width: 100px. Maximum width: 900px", "Custom left menu width");
				break;
        };
        _menu2 = undefined;
		_menu2A = undefined;
        _menu1 = undefined;
        _menu = undefined;
		_rowHeight = undefined;
		_panelWidth = undefined;
        g_rbtn_click = false;
        return true;
    };
};

/*
===================================================================================================
    Main
===================================================================================================
*/
var brw = null;
var g_1x1 = false;
var g_last = 0;
var isScrolling = false;
var g_zoom_percent = 100;

var g_filterbox = null;
var filter_text = "";

// drag'n drop from windows system
var g_dragndrop_status = false;
var g_dragndrop_x = -1;
var g_dragndrop_y = -1;
var g_dragndrop_trackId = -1;
var g_dragndrop_rowId = -1;
var g_dragndrop_targetPlaylistId = -1;
//
var ww = 0, wh = 0;
var g_metadb = null;
var g_focus = false;
clipboard = {
    selection: null
};

var g_active_playlist = null;
var g_focus_id = -1;
var g_focus_id_prev = -1;
var g_focus_row = 0;
var g_focus_album_id = -1;
var g_populate_opt = 1;
// boolean to avoid callbacks
var g_avoid_on_playlists_changed = false;
var g_avoid_on_item_focus_change = false;
var g_avoid_on_playlist_items_added = false;
var g_avoid_on_playlist_items_removed = false;
var g_avoid_on_playlist_items_removed_callbacks_on_sendItemToPlaylist = false;
var g_avoid_on_playlist_items_reordered = false;
// mouse actions
var g_lbtn_click = false;
var g_rbtn_click = false;
//
var g_first_populate_done = false;
var g_first_populate_launched = false;
//
var repaintforced = false;
var launch_time = fb.CreateProfiler("launch_time");
var form_text = "";
var repaint_main = true, repaint_main1 = true, repaint_main2 = true;
var window_visible = false;
var scroll_ = 0, scroll = 0, scroll_prev = 0;
var time222;
var g_start_ = 0, g_end_ = 0;
var g_last = 0;
var g_seconds = 0;
// START
function on_size(w, h) {
    window.DlgCode = 0x0004;

    ww = w;
    wh = h;

    if(!ww || !wh) {
        ww = 1;
        wh = 1;
    };
	if(window.IsVisible || first_on_size){
		window.MinWidth = 1;
		window.MinHeight = 1;

		// set wallpaper
		if(properties.showwallpaper){
			g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
		} else update_wallpaper = true;

		// set Size of browser
		brw.setSize(0, (properties.showHeaderBar ? properties.headerBarHeight + properties.paddingTop: properties.paddingTop), ww, wh - (properties.showHeaderBar ? properties.headerBarHeight + properties.paddingTop: properties.paddingTop));
		update_size = false;
		first_on_size = false;
	} else update_size = true;
};
function set_update_function(string){
	if( Update_Required_function.indexOf("brw.populate(true")!=-1) return;
	else if(Update_Required_function.indexOf("brw.populate(false")!=-1) {
		if(string.indexOf("brw.populate(true")!=-1) Update_Required_function=string;
	}
	else if(Update_Required_function.indexOf("playlists_changed")!=-1) {
		if(string.indexOf("brw.populate")!=-1) Update_Required_function=string;
	}
	else Update_Required_function=string;
}
function get_update_function(){
	var to_return = Update_Required_function;
	Update_Required_function="";
	return to_return;
}
function on_paint(gr) {
	if(update_size) on_size(window.Width, window.Height);
	if(Update_Required_function!="") {
		eval(get_update_function());
	}
    if(!ww) return;

	if(update_wallpaper && properties.showwallpaper && properties.wallpapermode == 0){
		g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
		update_wallpaper = false;		
	}

    if(!g_1x1) {
        // draw background under playlist
		gr.FillSolidRect(0, 0, ww, wh, colors.lightgrey_bg)
        if(fb.IsPlaying && g_wallpaperImg && properties.showwallpaper) {
            gr.DrawImage(g_wallpaperImg, 0, 0, ww, wh, 0, 0, g_wallpaperImg.Width, g_wallpaperImg.Height);
            gr.FillSolidRect(0, 0, ww, wh, (properties.wallpaperblurred)?colors.wallpaper_overlay_blurred:colors.wallpaper_overlay);
        } else {
            //gr.FillSolidRect(0, 0, ww, wh, colors.lightgrey_bg);
            if(g_wallpaperImg && properties.showwallpaper) {
                gr.DrawImage(g_wallpaperImg, 0, 0, ww, wh, 0, 0, g_wallpaperImg.Width, g_wallpaperImg.Height);
                gr.FillSolidRect(0, 0, ww, wh, (properties.wallpaperblurred)?colors.wallpaper_overlay_blurred:colors.wallpaper_overlay);
            } else {
                gr.FillSolidRect(0, 0, ww, wh, colors.lightgrey_bg);
            }
        }

        brw && brw.draw(gr);
    };

};

function on_mouse_lbtn_down(x, y, m) {
    g_lbtn_click = true;
    g_rbtn_click = false;

	var isResizing = g_resizing.on_mouse("lbtn_down", x, y, m, !brw.scrollbar.cursorHover);
	if(!isResizing){
		// stop inertia
		if(cTouch.timer) {
			window.ClearInterval(cTouch.timer);
			cTouch.timer = false;
			// stop scrolling but not abrupt, add a little offset for the stop
			if(Math.abs(scroll - scroll_) > properties.rowHeight) {
				scroll = (scroll > scroll_ ? scroll_ + properties.rowHeight : scroll_ - properties.rowHeight);
				scroll = check_scroll(scroll);
			};
		};

		var is_scroll_enabled = brw.rowsCount > brw.totalRowsVis;
		if(properties.enableTouchControl && is_scroll_enabled) {
			if(brw._isHover(x, y) && !brw.scrollbar._isHover(x, y)) {
				if(!timers.mouseDown) {
					cTouch.y_prev = y;
					cTouch.y_start = y;
					if(cTouch.t1) {
						cTouch.t1.Reset();
					} else {
						cTouch.t1 = fb.CreateProfiler("t1");
					};
					timers.mouseDown = setTimeout(function() {
						clearTimeout(timers.mouseDown);
						timers.mouseDown = false;
						if(Math.abs(cTouch.y_start - g_cursor.y) > 015) {
							cTouch.down = true;
						} else {
							brw.on_mouse("down", x, y);
						};
					},50);
				};
			} else {
				brw.on_mouse("down", x, y);
			};
		} else {
			brw.on_mouse("down", x, y);
		};

		// inputBox
		if(properties.showHeaderBar && properties.showFilterBox && g_filterbox.inputbox.visible) {
			g_filterbox.on_mouse("lbtn_down", x, y);
		};
	};
};

function on_mouse_lbtn_up(x, y, m) {
	var isResizing = g_resizing.on_mouse("lbtn_up", x, y, m);
	if(!isResizing){
		// inputBox
		if(properties.showHeaderBar && properties.showFilterBox && g_filterbox.inputbox.visible) {
			g_filterbox.on_mouse("lbtn_up", x, y);
		};

		brw.on_mouse("up", x, y);

		if(timers.mouseDown) {
			clearTimeout(timers.mouseDown);
			timers.mouseDown = false;
			if(Math.abs(cTouch.y_start - g_cursor.y) <= 030) {
				brw.on_mouse("down", x, y);
			};
		};

		// create scroll inertia on mouse lbtn up
		if(cTouch.down) {
			cTouch.down = false;
			cTouch.y_end = y;
			cTouch.scroll_delta = scroll - scroll_;
			//cTouch.y_delta = cTouch.y_start - cTouch.y_end;
			if(Math.abs(cTouch.scroll_delta) > 030 ) {
				cTouch.multiplier = ((1000 - cTouch.t1.Time) / 20);
				cTouch.delta = Math.round((cTouch.scroll_delta) / 030);
				if(cTouch.multiplier < 1) cTouch.multiplier = 1;
				if(cTouch.timer) window.ClearInterval(cTouch.timer);
				cTouch.timer = setInterval(function() {
					scroll += cTouch.delta * cTouch.multiplier;
					scroll = check_scroll(scroll);
					cTouch.multiplier = cTouch.multiplier - 1;
					cTouch.delta = cTouch.delta - (cTouch.delta / 10);
					if(cTouch.multiplier < 1) {
						window.ClearInterval(cTouch.timer);
						cTouch.timer = false;
					};
				}, 75);
			};
		};

		g_lbtn_click = false;
	};
};

function on_mouse_lbtn_dblclk(x, y, mask) {
    if(y >= brw.y) {
        brw.on_mouse("dblclk", x, y);
    } else if(x > brw.x && x < brw.x + brw.w) {
        brw.showActivePlaylist();
    }
};

function on_mouse_rbtn_down(x, y, mask) {
    g_rbtn_click = true;

    if(!utils.IsKeyPressed(VK_SHIFT)) {
        // inputBox
        if(properties.showHeaderBar && properties.showFilterBox && g_filterbox.inputbox.visible) {
            g_filterbox.on_mouse("rbtn_down", x, y);
        };

        brw.on_mouse("right", x, y);
    };
};

function on_mouse_rbtn_up(x, y){
    g_rbtn_click = false;

    if(!utils.IsKeyPressed(VK_SHIFT)) {
        return;
    };
};

function on_mouse_move(x, y, m) {
	if(g_cursor.x==x && g_cursor.y==y) return;
	g_cursor.onMouse("move", x, y, m);
	var isResizing = g_resizing.on_mouse("move", x, y, m, !brw.scrollbar.cursorHover && !brw.scrollbar.cursorDrag);
	if(isResizing){
		if(g_resizing.resizing_x>x+5){
			g_resizing.resizing_x = x;
			playlistpanel_width.decrement(5);
		} else if(g_resizing.resizing_x<x-5){
			g_resizing.resizing_x = x;
			playlistpanel_width.increment(5);
		}
	} else {
		// inputBox
		if(!cPlaylistManager.drag_moved) {
			if(properties.showHeaderBar && properties.showFilterBox && g_filterbox.inputbox.visible) {
				g_filterbox.on_mouse("move", x, y);
			};
		};

		g_resizing.on_mouse("move", x, y, m);

		if(g_dragndrop_status){
			if(y < brw.y) {
				if(!timers.movePlaylist) {
					timers.movePlaylist = setInterval(function() {
						scroll -= properties.rowHeight;
						scroll = check_scroll(scroll);
					}, 100);
				}
			} else if (y > brw.y + brw.h) {
				if(!timers.movePlaylist) {
					timers.movePlaylist = setInterval(function() {
						scroll += properties.rowHeight;
						scroll = check_scroll(scroll);
					}, 100);
				}
			};
		}

		if(cTouch.down) {
			cTouch.y_current = y;
			cTouch.y_move = (cTouch.y_current - cTouch.y_prev);
			if(x < brw.w) {
					scroll -= cTouch.y_move;
					cTouch.scroll_delta = scroll - scroll_;
					if(Math.abs(cTouch.scroll_delta) < 030) cTouch.y_start = cTouch.y_current;
					cTouch.y_prev = cTouch.y_current;
			};
		} else {
			brw.on_mouse("move", x, y);
		};
	};
};

function on_mouse_wheel(step){

	if(typeof(stepstrait) == "undefined" || typeof(delta) == "undefined") intern_step = step;
	else intern_step = stepstrait/delta;

    if(cTouch.timer) {
        window.ClearInterval(cTouch.timer);
        cTouch.timer = false;
    };

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
		}
    } else if(utils.IsKeyPressed(VK_SHIFT)) { // increase/decrease row height
		brw.setRowHeight(intern_step);
    } else if(cScrollBar.visible) {
        var rowStep = properties.rowScrollStep;
        scroll -= intern_step * properties.rowHeight * rowStep;
        scroll = check_scroll(scroll);
        brw.on_mouse("wheel", g_cursor.x, g_cursor.y, intern_step);
    };

};

function on_mouse_leave() {
	g_resizing.on_mouse("leave", -1, -1);
    // inputBox
    if(properties.showHeaderBar && properties.showFilterBox && g_filterbox.inputbox.visible) {
        g_filterbox.on_mouse("leave", 0, 0);
    };
    brw.on_mouse("leave", 0, 0);
};

//=================================================// Metrics & Fonts & Colors & Images
function get_metrics() {
    if(properties.showHeaderBar) {
        properties.headerBarHeight = Math.round(properties.defaultHeaderBarHeight * g_zoom_percent / 100);
        properties.headerBarHeight = Math.floor(properties.headerBarHeight / 2) != properties.headerBarHeight / 2 ? properties.headerBarHeight : properties.headerBarHeight - 1;
    } else {
        properties.headerBarHeight = 0;
    };

    var _defaultRowHeight = properties.defaultRowHeight;
    properties.rowHeight = Math.round(_defaultRowHeight * g_zoom_percent / 100) + g_fsize - 11;
    cScrollBar.width = Math.floor(cScrollBar.defaultWidth * g_zoom_percent / 100);
    cScrollBar.minCursorHeight = Math.round(cScrollBar.defaultMinCursorHeight * g_zoom_percent / 100);

    cFilterBox.w = Math.floor(cFilterBox.default_w * g_zoom_percent / 100);
    cFilterBox.h = Math.round(cFilterBox.default_h * g_zoom_percent / 100);

    properties.addedRows_end = properties.addedRows_end_default;

	/*if(properties.showNewPlaylistButton) {
		properties.paddingTop = properties.rowHeight;
	} else */
	properties.paddingTop = 0;
    if(brw) {
        if(cScrollBar.enabled)  {
            //brw.setSize(0, (properties.showHeaderBar ? properties.headerBarHeight : 0), ww - cScrollBar.width, wh - (properties.showHeaderBar ? properties.headerBarHeight : 0));
			brw.setSize(0, (properties.showHeaderBar ? properties.headerBarHeight + properties.paddingTop: properties.paddingTop), ww, wh - (properties.showHeaderBar ? properties.headerBarHeight + properties.paddingTop: properties.paddingTop));
        } else {
            brw.setSize(0, (properties.showHeaderBar ? properties.headerBarHeight + properties.paddingTop: properties.paddingTop), ww, wh - (properties.showHeaderBar ? properties.headerBarHeight + properties.paddingTop: properties.paddingTop));
        };
        if(brw.rowsCount > 0) brw.getlimits();
    };
};

function playlistName2icon(name, auto_playlist, images_array){
	var inverse = '';
	if(name==globalProperties.selection_playlist) return images_array.library_icon;
	if(name==globalProperties.playing_playlist) return images_array.library_playback_icon;
	if(name==globalProperties.whole_library) return images_array.whole_library_icon;
	if(name==properties.newly_added) return images_array.newly_added_icon;
	if(name==globalProperties.create_playlist) return images_array.create_playlist;
	if(name==properties.history) return images_array.history_icon;
	if(name==properties.top_rated) return images_array.top_rated;
	if(name==properties.radios) return images_array.radios_icon;
	if(name==properties.most_played) return images_array.most_played_icon;
	if(name==properties.podcasts) return images_array.podcasts_icon;
	if(name==properties.external_files) return images_array.external_files_icon;
	if(name==globalProperties.filter_playlist) return images_array.search_icon;
	if(auto_playlist) {
		return images_array.icon_auto_pl;
	} else {
		return images_array.icon_normal_pl;
	};
}

function get_images() {
    function get_images_from_colors_theme(images_array,adapted_color_theme){
		images_array.icon_normal_pl = gdi.Image(theme_img_path + "\\icons\\"+adapted_color_theme+"playlist_icon2.png");
		images_array.icon_normal_pl_sel = gdi.Image(theme_img_path + "\\icons\\"+adapted_color_theme+"playlist_icon2.png");
		images_array.icon_normal_pl_playing = gdi.Image(theme_img_path + "\\icons\\"+adapted_color_theme+"auto_playlist_icon.png");
		images_array.icon_normal_pl_playing_sel = gdi.Image(theme_img_path + "\\icons\\"+adapted_color_theme+"auto_playlist_icon.png");
		images_array.icon_auto_pl = gdi.Image(theme_img_path + "\\icons\\"+adapted_color_theme+"playlist_icon.png");
		images_array.icon_auto_pl_sel = gdi.Image(theme_img_path + "\\icons\\"+adapted_color_theme+"playlist_icon.png");
		images_array.icon_auto_pl_playing = gdi.Image(theme_img_path + "\\icons\\"+adapted_color_theme+"auto_playlist_icon.png");
		images_array.icon_auto_pl_playing_sel = gdi.Image(theme_img_path + "\\icons\\"+adapted_color_theme+"auto_playlist_icon.png");

		images_array.create_playlist = gdi.Image(theme_img_path + "\\icons\\"+adapted_color_theme+"create_playlist.png");
		images_array.newly_added_icon = gdi.Image(theme_img_path + "\\icons\\"+adapted_color_theme+"newly_added_icon.png");
		images_array.top_rated = gdi.Image(theme_img_path + "\\icons\\"+adapted_color_theme+"fav_icon.png");
		images_array.history_icon = gdi.Image(theme_img_path + "\\icons\\"+adapted_color_theme+"history_icon.png");
		images_array.whole_library_icon = gdi.Image(theme_img_path + "\\icons\\"+adapted_color_theme+"whole_library_icon.png");
		images_array.library_icon = gdi.Image(theme_img_path + "\\icons\\"+adapted_color_theme+"library_icon.png");
		images_array.library_playback_icon = gdi.Image(theme_img_path + "\\icons\\"+adapted_color_theme+"library_playback_icon.png");
		images_array.radios_icon = gdi.Image(theme_img_path + "\\icons\\"+adapted_color_theme+"radios_icon.png");
		images_array.most_played_icon = gdi.Image(theme_img_path + "\\icons\\"+adapted_color_theme+"most_played_icon.png");
		images_array.podcasts_icon = gdi.Image(theme_img_path + "\\icons\\"+adapted_color_theme+"podcasts_icon.png");
		images_array.external_files_icon = gdi.Image(theme_img_path + "\\icons\\"+adapted_color_theme+"external_files_icon.png");
		images_array.search_icon = gdi.Image(theme_img_path + "\\icons\\"+adapted_color_theme+"search_icon.png");

		if(!properties.emphasisOnActive){
			if(!properties.darklayout){
				images_array.now_playing_1 = gdi.Image(theme_img_path + "\\graphic_browser\\now_playing_track1.png");
				images_array.now_playing_0 = gdi.Image(theme_img_path + "\\graphic_browser\\now_playing_track0.png");
			} else {
				images_array.now_playing_1 = gdi.Image(theme_img_path + "\\graphic_browser\\now_playing_progress1.png");
				images_array.now_playing_0 = gdi.Image(theme_img_path + "\\graphic_browser\\now_playing_progress0.png");
			}
		} else {
			images_array.now_playing_1 = gdi.Image(theme_img_path + "\\icons\\"+adapted_color_theme+"now_playing_off.png");
			images_array.now_playing_0 = gdi.Image(theme_img_path + "\\icons\\"+adapted_color_theme+"now_playing_on.png");
		}
		return images_array;
	};

	if(properties.darklayout) {
		color_theme="white\\";
		color_theme_inverse="";
	} else {
		color_theme="";
		color_theme_inverse="white\\";
	}

	images = get_images_from_colors_theme(images,color_theme);
	images_inverse = get_images_from_colors_theme(images_inverse,color_theme_inverse);
};


function get_colors() {
	get_colors_global();
	if(properties.darklayout){
		colors.icon_opacity = 200;
		colors.normal_txt = GetGrey(180);	
		colors.full_txt = GetGrey(255);		
		colors.dragdrop_bg_selected_item = GetGrey(0,190);
		colors.dragdrop_line_selected_item = GetGrey(255,45);
		colors.dragdrop_disabled_item = RGBA(255,0,0,60)

		colors.grad_bottom_1 = GetGrey(0,70);
		colors.grad_bottom_2 = GetGrey(0,0);
		colors.fading_bottom_height = 50;
	} else {
		colors.icon_opacity = 255;		
		colors.full_txt = GetGrey(0);				
		colors.dragdrop_bg_selected_item = GetGrey(220);
		colors.dragdrop_line_selected_item = GetGrey(205);
		colors.dragdrop_disabled_item = RGBA(255,0,0,60);

		colors.grad_bottom_1 = GetGrey(0,10);
		colors.grad_bottom_2 = GetGrey(0,0);
		colors.fading_bottom_height = 39;

		if(properties.showwallpaper) {
			colors.headerbar_line = GetGrey(0,40);
		}
	}
};

function on_font_changed() {
    get_font();
	g_filterbox.setSize(ww, cFilterBox.h+2, g_fsize+2);
	g_filterbox.onFontChanged();
    get_metrics();
    brw.repaint();
};

function on_colours_changed() {
    get_colors();
    get_images();
	brw.setIcons();
    if(brw) brw.scrollbar.setNewColors();
    g_filterbox.getImages();
    g_filterbox.reset_colors();
    brw.repaint();
};

function on_script_unload() {
    //brw.resetTimer();
};

//=================================================// Keyboard Callbacks
function on_key_up(vkey) {
    if(cSettings.visible) {

    } else {
        // inputBox
        if(properties.showFilterBox && g_filterbox.inputbox.visible) {
            g_filterbox.on_key("up", vkey);
        };

        // scroll keys up and down RESET (step and timers)
        brw.keypressed = false;
        cScrollBar.timerCounter = -1;
        cScrollBar.timerID && clearTimeout(cScrollBar.timerID);
        cScrollBar.timerID = false;
        if(vkey == VK_SHIFT) {
            brw.SHIFT_start_id = null;
            brw.SHIFT_count = 0;
        };
    };
    brw.repaint();
};

function on_key_down(vkey) {
    var mask = GetKeyboardMask();
	var active_filterbox = false;
    if(cSettings.visible) {

    } else {
        if(brw.inputboxID >= 0) {
            if (mask == KMask.none) {
                switch (vkey) {
                case VK_ESCAPE:
					if(g_uihacks.getFullscreenState()) g_uihacks.toggleFullscreen();
					break;
                case 222:
                    brw.inputboxID = -1;
                    brw.repaint();
                    break;
                default:
                    brw.inputbox.on_key_down(vkey);
                };
            };

        } else {

            // inputBox
            if(properties.showFilterBox && g_filterbox.inputbox.visible && g_filterbox.inputbox.edit) {
				active_filterbox = g_filterbox.inputbox.isActive();
                g_filterbox.on_key("down", vkey);
				
            };

            var act_pls = g_active_playlist;

            if (mask == KMask.none) {
                switch (vkey) {
                case VK_F2:
                    // set rename it
                    var rowId = brw.selectedRow;
					
					try {
						playlistname = utils.InputBox(window.ID, "Rename the playlist: "+plman.GetPlaylistName(brw.rows[rowId].idx), "Rename a playlist", plman.GetPlaylistName(brw.rows[rowId].idx), true);
						if(!playlistname || playlistname == "") playlistname = plman.GetPlaylistName(brw.rows[rowId].idx);
						if (playlistname.length > 1 || (playlistname.length == 1 && (playlistname >= "a" && playlistname <= "z") || (playlistname >= "A" && playlistname <= "Z") || (playlistname >= "0" && playlistname <= "9"))) {
							plman.RenamePlaylist(brw.rows[rowId].idx, playlistname);
							window.Repaint();
						}
					} catch(e) {
					}					
                    break;
                case VK_F3:
                    brw.showActivePlaylist();
                    break;
                case VK_F5:
                    brw.repaint();
                    break;
                case VK_F6:

                    break;
                case VK_TAB:
                    break;
                case VK_BACK:
                    break;
                case VK_ESCAPE:
					if(active_filterbox) g_filterbox.resetSearch();
					else if(g_uihacks.getFullscreenState()) g_uihacks.toggleFullscreen();
					break;
                case 222:
                    brw.inputboxID = -1;
                    break;
                case VK_UP:
                    if(brw.rowsCount > 0) {
                        if(g_filterbox.inputbox && g_filterbox.inputbox.edit) return;
                        var rowId = brw.selectedRow;
                        if(rowId > 0) {
                            if(brw.inputboxID > -1) brw.inputboxID = -1;
                            brw.repaint();
                            brw.selectedRow--;
                            if(brw.selectedRow < 0) brw.selectedRow = 0;
                            brw.showSelectedPlaylist();
                            brw.repaint();
                        };
                    };
                    break;
                case VK_DOWN:
                    if(brw.rowsCount > 0) {
                        if(g_filterbox.inputbox && g_filterbox.inputbox.edit) return;
                        var rowId = brw.selectedRow;
                        if(rowId < brw.rowsCount - 1) {
                            if(brw.inputboxID > -1) brw.inputboxID = -1;
                            brw.repaint();
                            brw.selectedRow++;
                            if(brw.selectedRow > brw.rowsCount - 1) brw.selectedRow = brw.rowsCount - 1;
                            brw.showSelectedPlaylist();
                            brw.repaint();
                        };
                    };
                    break;
				case VK_PGUP:
					if(brw.rowsCount > 0 && !brw.keypressed && !cScrollBar.timerID) {
						scroll -= brw.h-properties.rowHeight;
						scroll = check_scroll(scroll)
					};
					break;
				case VK_PGDN:
					if(brw.rowsCount > 0 && !brw.keypressed && !cScrollBar.timerID) {
						scroll += brw.h-properties.rowHeight;
						scroll = check_scroll(scroll)
					};
					break;
                case VK_RETURN:
                    if(brw.rowsCount > 0) {
                        if(g_filterbox.inputbox && g_filterbox.inputbox.edit) return;
                        brw.repaint();
						try{
							plman.ActivePlaylist = brw.selectedRow;
						} catch(e){plman.ActivePlaylist = brw.rowsCount - 1;console.log("active error")}
                        cPlaylistManager.playlist_switch_pending = true;
                    };
                    break;
				case VK_END:
					if(brw.rowsCount > 0) {
						scroll = ((brw.rowsCount+properties.addedRows_end) * properties.rowHeight) - (brw.totalRowsVis * properties.rowHeight);
						scroll = check_scroll(scroll)
					};
					break;
                case VK_HOME:
                    if(brw.rowsCount > 0) {
                        if(g_filterbox.inputbox && g_filterbox.inputbox.edit) return;
                        if(brw.inputboxID > -1) brw.inputboxID = -1;
                        brw.repaint();
                        brw.selectedRow = 0;
                        brw.showSelectedPlaylist();
                    };
                    break;
                case VK_DELETE:
                    if(!brw.delete_pending && !timers.deletePlaylist) {
                        if(g_filterbox.inputbox && g_filterbox.inputbox.edit) return;
                        if(brw.selectedRow > -1 && brw.selectedRow < brw.rowsCount && brw.rowsCount > 0) {
							var id = brw.selectedRow;
                            DeletePlaylist(brw.rows[id].idx);
                            //brw.delete_pending = true;
							/*
                            timers.deletePlaylist = setTimeout(function(){
                                timers.deletePlaylist && clearTimeout(timers.deletePlaylist);
                                timers.deletePlaylist = false;
                            }, 150);
                            //
                            var updateActivePlaylist = (brw.selectedRow == plman.ActivePlaylist);
                            var row = brw.getRowIdFromIdx(id);
                            plman.RemovePlaylistSwitch(id);
                                if(row < brw.rowsCount - 1) {
                                    brw.selectedRow = id;
                                } else if(row > 0) {
                                    brw.selectedRow = id - 1;
                                };
                            if(updateActivePlaylist) {
                                if(row < brw.rowsCount - 1) {
                                    plman.ActivePlaylist = id;
                                } else if(row > 0) {
                                    plman.ActivePlaylist = id - 1;
                                };
                            };*/
                        };
                    };
                    break;
                };
            } else {
                switch(mask) {
                    case KMask.shift:
                        switch(vkey) {
                            case VK_SHIFT: // SHIFT key alone
                                break;
                            case VK_UP: // SHIFT + KEY UP
                                break;
                            case VK_DOWN: // SHIFT + KEY DOWN
                                break;
                        };
                        break;
                    case KMask.ctrl:
                        if(vkey==65) { // CTRL+A

                        };
                        if(vkey==66) { // CTRL+B
                            cScrollBar.enabled = !cScrollBar.enabled;
                            window.SetProperty("DISPLAY: Show Scrollbar", cScrollBar.enabled);
                            get_metrics();
                            brw.repaint();
                        };
                        if(vkey==88) { // CTRL+X

                        };
                        if(vkey==67) { // CTRL+C

                        };
                        if(vkey==86) { // CTRL+V

                        };
                        if(vkey==70) { // CTRL+F
                            fb.RunMainMenuCommand("Edit/Search");
                        };
                        if(vkey==73) { // CTRL+I

                        };
                        if(vkey==78) { // CTRL+N
                            fb.RunMainMenuCommand("File/New playlist");
                        };
                        if(vkey==79) { // CTRL+O
                            fb.RunMainMenuCommand("File/Open...");
                        };
                        if(vkey==80) { // CTRL+P
                            fb.RunMainMenuCommand("File/Preferences");
                        };
                        if(vkey==83) { // CTRL+S
                            fb.RunMainMenuCommand("File/Save playlist...");
                        };
                        if(vkey==84) { // CTRL+T
                            properties.showHeaderBar = !properties.showHeaderBar;
                            window.SetProperty("DISPLAY: Show Top Bar", properties.showHeaderBar);
                            get_metrics();
                            brw.repaint();
                        };
                        if(vkey == 48 || vkey == 96) { // CTRL + 0
                            var previous = globalProperties.fontAdjustement;
                            if(!timers.mouseWheel) {
                                globalProperties.fontAdjustement = 0;
                                if(previous != globalProperties.fontAdjustement) {
									timers.mouseWheel = setTimeout(function() {
										on_notify_data('set_font',globalProperties.fontAdjustement);
										window.NotifyOthers('set_font',globalProperties.fontAdjustement);
										timers.mouseWheel && clearTimeout(timers.mouseWheel);
										timers.mouseWheel = false;
									}, 100);
                                };
                            };
                        };
                        break;
                    case KMask.alt:
                        switch(vkey) {
                        case 65: // ALT+A
                            fb.RunMainMenuCommand("View/Always on Top");
                            break;
                        case VK_ALT: // ALT key alone
                            break;
                        };
                        break;
                };
            };
        };

    };
};

function on_char(code) {
    // rename inputbox
    if(brw.inputboxID >= 0) {
        brw.inputbox.on_char(code);
    } else {
        // filter inputBox
        if(properties.showFilterBox && g_filterbox.inputbox.visible) {
            g_filterbox.on_char(code);
        };
    };
};

//=================================================// Playback Callbacks
function on_playback_stop(reason) {
	g_seconds = 0;
  	if(window.IsVisible) {
		switch(reason) {
		case 0: // user stop
		case 1: // eof (e.g. end of playlist)
			brw.PlayingPlaylist = -1;
			// update wallpaper
			if(properties.showwallpaper && properties.wallpapermode == 0) {
				g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, null);
			};
			brw.repaint();
			break;
		case 2: // starting_another (only called on user action, i.e. click on next button)
			break;
		};
	} else set_update_function('on_playback_stop('+reason+')');
};

function on_playback_new_track(metadb) {
	g_seconds = 0;
	brw.FindPlayingPlaylist();
	if(window.IsVisible) {
		g_metadb = metadb;
		if(properties.showwallpaper && properties.wallpapermode == 0) {
			g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, g_metadb);
		};
		brw.repaint();
	} else if(properties.wallpapermode == 0) update_wallpaper = true;
};
function on_playback_time(time) {
	g_seconds = time;
	if(window.IsVisible) window.RepaintRect(brw.playing_icon_x,brw.playing_icon_y,brw.playing_icon_w,brw.playing_icon_h);
}
//=================================================// Playlist Callbacks
function on_playlists_changed() {
	if(!g_avoid_on_playlists_changed && g_first_populate_done && window.IsVisible){
		if(cPlaylistManager.drag_droped) {
			g_cursor.setCursor(IDC_ARROW,46);
		} else {
			if(brw.previous_playlistCount != plman.PlaylistCount) g_filterbox.clearInputbox();
		};
		brw.populate(is_first_populate = false, 4, reset_scroll = false);

		brw.repaint();
		brw.delete_pending = false;
	} else if(!g_avoid_on_playlists_changed) set_update_function('brw.populate(false, 4, false)');
};

function on_playlist_switch() {	
	if(window.IsVisible) {
		g_active_playlist = plman.ActivePlaylist;
		brw.showActivePlaylist();
		if(brw.selectedRow > brw.rowsCount) brw.selectedRow = plman.ActivePlaylist;
		brw.repaint();
	} else set_update_function('on_playlist_switch()');
};

function on_playlist_items_added(playlist_idx) {
	try{
		brw.rows[brw.getRowIdFromIdx(playlist_idx)].update_count();
		if(window.IsVisible) brw.repaint();
	} catch(e){
		console.log('on_playlist_items_added failed');
	}
};

function on_playlist_items_removed(playlist_idx, new_count) {
	try{
		brw.rows[brw.getRowIdFromIdx(playlist_idx)].item_count = new_count;
		if(window.IsVisible) brw.repaint();
	} catch(e){
		console.log('on_playlist_items_removed failed');
	}
};


function on_focus(is_focused) {
    g_focus = is_focused;
    if(!is_focused && g_filterbox.inputbox.edit) {
		g_filterbox.inputbox.on_focus(is_focused)
        brw.repaint();
    };
};

//=================================================// Custom functions
function checkMediaLibrayPlaylist() {
    g_avoid_on_playlists_changed = true;

    // check if library playlist is present
    var isMediaLibraryFound = false;
    var total = plman.PlaylistCount;
    for (var i = 0; i < total; i++) {
        if(plman.GetPlaylistName(i) == globalProperties.media_library) {
            var mediaLibraryIndex = i;
            isMediaLibraryFound = true;
            break;
        };
    };
    if(!isMediaLibraryFound) {
        // create Media Library playlist (sort forced)
        // > sort: sort string expression.
        // > flags: 1 - always sort.
        // > boolean CreateAutoPlaylist(idx, name, query, sort = "", flags = 0);
        plman.CreateAutoPlaylist(total, globalProperties.media_library, "%path% PRESENT", "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 1);
        //plman.CreateAutoPlaylist(total, globalProperties.media_library, "%album% PRESENT", "%album artist% | %date% | %album% | %discnumber% | %tracknumber% | %title%", 1);
        // Move it to the top
        plman.MovePlaylist(total, 0);
    } else if(mediaLibraryIndex > 0) {
        // Always move it to the top
        plman.MovePlaylist(mediaLibraryIndex, 0);
    };

    g_avoid_on_playlists_changed = false;
};

function check_scroll(scroll___){
    if(scroll___ < 0)
        scroll___ = 0;
    var g1 = brw.h - (brw.totalRowsVis * properties.rowHeight);
    //var scroll_step = Math.ceil(properties.rowHeight / properties.scroll_divider);
    //var g2 = Math.floor(g1 / scroll_step) * scroll_step;

    var end_limit = ((brw.rowsCount+properties.addedRows_end) * properties.rowHeight) - (brw.totalRowsVis * properties.rowHeight) - g1;
    if(scroll___ != 0 && scroll___ > end_limit) {
        scroll___ = end_limit;
    };
    return scroll___;
};

function g_sendResponse() {

	if(g_filterbox.inputbox.text.length == 0) {
        filter_text = "";
    } else {
	    filter_text = g_filterbox.inputbox.text;
    };

    // filter in current panel
    brw.populate(true, 1);
    if(brw.selectedRow < 0 || brw.selectedRow > brw.rowsCount - 1) brw.selectedRow = 0;
};

function on_notify_data(name, info) {
    switch(name) {
        case "use_ratings_file_tags":
            globalProperties.use_ratings_file_tags = info;
            window.SetProperty("GLOBAL use ratings in file tags", globalProperties.use_ratings_file_tags);
            window.Reload();
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
		case "avoid_on_playlists_changed":
			g_avoid_on_playlists_changed=info;
			//if(!g_avoid_on_playlists_changed) on_playlists_changed();
			break;
		case "UpdatePlaylistsManager":			
		case "UpdatePlaylists":
			g_avoid_on_playlists_changed=false;
			on_playlists_changed();
		break;
		case "enable_screensaver":
			globalProperties.enable_screensaver = info;
			window.SetProperty("GLOBAL enable screensaver", globalProperties.enable_screensaver);
		break;
		case "set_font":
			globalProperties.fontAdjustement = info;
			window.SetProperty("GLOBAL Font Adjustement", globalProperties.fontAdjustement),
			on_font_changed();
		break;
		case "rePopulate":
			if(window.IsVisible){
				brw.populate(true, 16, true);
			} else {set_update_function("brw.populate(true, 16, true)");}
			break;
		case "playlistpanel_width":
			playlistpanel_width.value = info;
			break;
		case "layout_state":
			layout_state.value = info;
			if(layout_state.isEqual(1)) window.NotifyOthers("pmanager_height",window.Height);
			break;
		case "wallpaperVisibilityGlobal":
		case "wallpaperVisibility":
			if(window.IsVisible || name=="wallpaperVisibilityGlobal") toggleWallpaper(info);
		break;
		case "wallpaperBlurGlobal":
		case "wallpaperBlur":
			if(window.IsVisible || name=="wallpaperBlurGlobal") toggleBlurWallpaper(info);
		break;
		case"playlists_dark_theme":
			properties.darklayout = info;
			window.SetProperty("_DISPLAY: Dark layout", properties.darklayout);
			on_colours_changed();
			if(properties.darklayout) g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.IsPlaying ? fb.GetNowPlaying() : null);
			brw.repaint();
		break;
		case "WSH_panels_reload":
			window.Reload();
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

//=================================================// Drag'n'Drop Callbacks
function on_drag_enter() {
    g_dragndrop_status = true;
};

function on_drag_leave() {
	g_resizing.on_drag("leave", 0, 0, null);
    g_dragndrop_status = false;
    g_dragndrop_trackId = -1;
    g_dragndrop_rowId = -1;
    g_dragndrop_targetPlaylistId = -1;
    brw.buttonclicked = false;
    cScrollBar.timerID && window.ClearInterval(cScrollBar.timerID);
    cScrollBar.timerID = false;
	brw.on_mouse("leave", 0, 0);
    brw.repaint();
};

function on_drag_over(action, x, y, mask) {

    if(x == g_dragndrop_x && y == g_dragndrop_y) return true;

    g_dragndrop_trackId = -1;
    g_dragndrop_rowId = -1;
    g_dragndrop_targetPlaylistId = -1;
    g_dragndrop_bottom = false;

    brw.on_mouse("drag_over", x, y);
    brw.repaint();

	try{
		if(g_dragndrop_targetPlaylistId > -1 && brw.rows[g_dragndrop_targetPlaylistId].isAutoPlaylist) {
			//action.Effect = 0;
			return;
		} else if(g_dragndrop_targetPlaylistId > -1 && brw.rows[g_dragndrop_targetPlaylistId].idx>-1) {
			action.Text = "Insert";
		} else {
			action.Text = "New playlist";
		}
	} catch(e){}

    g_dragndrop_x = x;
    g_dragndrop_y = y;
};

function on_drag_drop(action, x, y, mask) {
    if(y > brw.y) {
        var drop_done = false;
		var rename_playlist = false;
        if(brw.activeRow > -1) {
            drop_done = true;
			if(g_dragndrop_targetPlaylistId > -1 && brw.rows[g_dragndrop_targetPlaylistId].isAutoPlaylist) {
				action.Effect = 0;
				HtmlMsg("Error", "'"+plman.GetPlaylistName(g_dragndrop_targetPlaylistId)+"' is an playlist generated automatically (autoplaylist).\nYou can't manually add tracks into an autoplaylist", "Ok");
            } else if(g_dragndrop_targetPlaylistId > -1 && brw.rows[g_dragndrop_targetPlaylistId].idx>-1) {
                action.Effect = 1;
                action.Playlist = brw.rows[g_dragndrop_targetPlaylistId].idx;
				action.Base = plman.PlaylistItemCount(brw.rows[g_dragndrop_targetPlaylistId].idx);
                action.ToSelect = false;
            } else {
				drop_done = true;
				var total_pl = plman.PlaylistCount;
				plman.CreatePlaylist(total_pl, "Dropped Items");
				action.Effect = 1;
				action.Playlist = total_pl;
				action.ToSelect = false;
				rename_playlist = true;
			}
        } else {
            drop_done = true;
            var total_pl = plman.PlaylistCount;
            plman.CreatePlaylist(total_pl, "Dropped Items");
            action.Effect = 1;
            action.Playlist = total_pl;
            action.ToSelect = false;
			rename_playlist = true;
        };
		if(rename_playlist){
			try {
				playlistname = utils.InputBox(window.ID, "Give your playlist a name ?", "Rename a playlist", plman.GetPlaylistName(total_pl), true);
				if(!playlistname || playlistname == "") playlistname = plman.GetPlaylistName(total_pl);
				if (playlistname.length > 1 || (playlistname.length == 1 && (playlistname >= "a" && playlistname <= "z") || (playlistname >= "A" && playlistname <= "Z") || (playlistname >= "0" && playlistname <= "9"))) {
					plman.RenamePlaylist(total_pl, playlistname);
					window.Repaint();
				}
			} catch(e) {
			}
		}
        if(drop_done) {
            // create a timer to blink the playlist item where tracks have been droped!
            if(!blink.timer) {
                blink.x = x;
                blink.y = y;
                blink.totaltracks = 1;
                blink.id = brw.activeRow;
                blink.counter = 0;
                blink.timer = setInterval(function() {
                    blink.counter++;
                    if(blink.counter > 7) {
                        blink.timer && window.ClearInterval(blink.timer);
                        blink.timer = false;
                        blink.counter = -1;
                        blink.id = null;
                    };
                    brw.repaint();
                }, 125);
            };
        };
    }
    g_dragndrop_status = false;
    brw.repaint();
};

function toggleWallpaper(wallpaper_state){
	wallpaper_state = typeof wallpaper_state !== 'undefined' ? wallpaper_state : !properties.showwallpaper;
	properties.showwallpaper = wallpaper_state;
	window.SetProperty("_DISPLAY: Show Wallpaper", properties.showwallpaper);
	on_colours_changed();
	if(properties.showwallpaper) {
		g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.IsPlaying ? fb.GetNowPlaying() : null);
	}
	brw.repaint();
}
function toggleBlurWallpaper(wallpaper_blur_state){
	wallpaper_blur_state = typeof wallpaper_blur_state !== 'undefined' ? wallpaper_blur_state : !properties.wallpaperblurred;
	properties.wallpaperblurred = wallpaper_blur_state; on_colours_changed();
	window.SetProperty("_DISPLAY: Wallpaper Blurred", properties.wallpaperblurred);
	if(fb.IsPlaying) g_wallpaperImg = setWallpaperImg(globalProperties.default_wallpaper, fb.GetNowPlaying());
	brw.repaint();
}

function on_init() {
	if(plman.GetPlaylistName(plman.ActivePlaylist)==globalProperties.filter_playlist && properties.filtred_playlist_idx>-1)
		plman.ActivePlaylist = properties.filtred_playlist_idx;
	
    window.DlgCode = 0x0004;

    get_font();
    get_colors();
    get_metrics();
	get_images();

	g_cursor = new oCursor();
    g_active_playlist = plman.ActivePlaylist;
	g_resizing = new Resizing("playlistmanager",false,true);
	g_tooltip = new oTooltip();

    brw = new oBrowser("brw");
	brw.startTimer();

    g_filterbox = new oFilterBox();
    g_filterbox.inputbox.visible = true;
};
on_init();