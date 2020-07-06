var need_repaint = false;

ppt = {
	defaultRowHeight: window.GetProperty("_PROPERTY: Row Height", 35),
	rowHeight: window.GetProperty("_PROPERTY: Row Height", 35),
	rowScrollStep: 3,
	scrollSmoothness: 3.0,
	refreshRate: 40,
	showHeaderBar: window.GetProperty("_DISPLAY: Show Top Bar", true),
	defaultHeaderBarHeight: 25,
	headerBarHeight: 25,
	enableCustomColors: window.GetProperty("_PROPERTY: Custom Colors", false),
	showwallpaper: window.GetProperty("_DISPLAY: Show Wallpaper", false),
	wallpaperalpha: 150,
	wallpaperblurred: window.GetProperty("_DISPLAY: Wallpaper Blurred", true),
	wallpaperblurvalue: 1.05,
	wallpapermode: window.GetProperty("_SYSTEM: Wallpaper Mode", 0),
	wallpaperpath: window.GetProperty("_PROPERTY: Default Wallpaper Path", ".\\user-components\\foo_spider_monkey_panel\\samples\\js-smooth\\images\\default.png"),
	extra_font_size: window.GetProperty("_SYSTEM: Extra font size value", 0),
	showFilterBox: window.GetProperty("_PROPERTY: Enable Playlist Filterbox in Top Bar", true),
	enableTouchControl: window.GetProperty("_PROPERTY: Touch control", true)
};

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
	enabled: window.GetProperty("_PROPERTY: Enable Filter Box", true),
	default_w: 120,
	default_h: 20,
	x: 5,
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

cScrollBar = {
	enabled: window.GetProperty("_DISPLAY: Show Scrollbar", true),
	visible: true,
	themed: false,
	defaultWidth: get_system_scrollbar_width(),
	width: get_system_scrollbar_width(),
	ButtonType: {
		cursor: 0,
		up: 1,
		down: 2
	},
	defaultMinCursorHeight: 20,
	minCursorHeight: 20,
	timerID: false,
	timerCounter: -1
};

images = {
	path: fb.ComponentPath + "samples\\js-smooth\\images\\"
};

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
	addPlaylistDone: false
};

//=================================================// Extra functions for playlist manager panel
function renamePlaylist() {
	if (!brw.inputbox.text || brw.inputbox.text == "" || brw.inputboxID == -1)
		brw.inputbox.text = brw.rows[brw.inputboxID].name;
	if (brw.inputbox.text.length > 1 || (brw.inputbox.text.length == 1 && (brw.inputbox.text >= "a" && brw.inputbox.text <= "z") || (brw.inputbox.text >= "A" && brw.inputbox.text <= "Z") || (brw.inputbox.text >= "0" && brw.inputbox.text <= "9"))) {
		brw.rows[brw.inputboxID].name = brw.inputbox.text;
		plman.RenamePlaylist(brw.rows[brw.inputboxID].idx, brw.inputbox.text);
		brw.repaint();
	};
	brw.inputboxID = -1;
};

/*
===================================================================================================
Objects
===================================================================================================
 */
oPlaylist = function (idx, rowId, name) {
	this.idx = idx;
	this.rowId = rowId;
	this.name = name;
	this.isAutoPlaylist = plman.IsAutoPlaylist(idx);
};

oFilterBox = function () {
	this.images = {
		magnify: null,
		resetIcon_off: null,
		resetIcon_ov: null
	};

	this.getImages = function () {
		var gb;
		var w = Math.round(18 * g_zoom_percent / 100);

		this.images.magnify = gdi.CreateImage(48, 48);
		gb = this.images.magnify.GetGraphics();
		gb.SetSmoothingMode(2);
		gb.DrawLine(33, 33, 42, 42, 6.0, g_color_normal_txt & 0x99ffffff);
		gb.DrawEllipse(4, 4, 32, 32, 5.0, g_color_normal_txt & 0x99ffffff);
		gb.FillEllipse(12, 7, 19, 19, RGBA(250, 250, 250, 20));
		gb.SetSmoothingMode(0);
		this.images.magnify.ReleaseGraphics(gb);

		this.images.resetIcon_off = gdi.CreateImage(w, w);
		gb = this.images.resetIcon_off.GetGraphics();
		gb.SetSmoothingMode(2);
		var xpts1 = Array(6, 5, w - 5, w - 6, w - 6, w - 5, 5, 6);
		var xpts2 = Array(5, w - 6, w - 6, 5, w - 5, 6, 6, w - 5);
		gb.FillPolygon(RGB(170, 170, 170), 0, xpts1);
		gb.FillPolygon(RGB(170, 170, 170), 0, xpts2);
		gb.DrawLine(6, 6, w - 6, w - 6, 2.0, blendColors(g_color_normal_txt, g_color_normal_bg, 0.35));
		gb.DrawLine(6, w - 6, w - 6, 6, 2.0, blendColors(g_color_normal_txt, g_color_normal_bg, 0.35));
		gb.SetSmoothingMode(0);
		this.images.resetIcon_off.ReleaseGraphics(gb);

		this.images.resetIcon_ov = gdi.CreateImage(w, w);
		gb = this.images.resetIcon_ov.GetGraphics();
		gb.SetSmoothingMode(2);
		gb.DrawLine(4, 4, w - 4, w - 4, 3.0, blendColors(g_color_normal_txt, g_color_normal_bg, 0.35));
		gb.DrawLine(4, w - 4, w - 4, 4, 3.0, blendColors(g_color_normal_txt, g_color_normal_bg, 0.35));
		gb.SetSmoothingMode(0);
		this.images.resetIcon_ov.ReleaseGraphics(gb);

		this.images.resetIcon_dn = gdi.CreateImage(w, w);
		gb = this.images.resetIcon_dn.GetGraphics();
		gb.SetSmoothingMode(2);
		gb.DrawLine(4, 4, w - 4, w - 4, 3.0, RGB(255, 50, 50));
		gb.DrawLine(4, w - 4, w - 4, 4, 3.0, RGB(255, 50, 50));
		gb.SetSmoothingMode(0);
		this.images.resetIcon_dn.ReleaseGraphics(gb);

		this.reset_bt = new button(this.images.resetIcon_off, this.images.resetIcon_ov, this.images.resetIcon_dn);
	};
	this.getImages();

	this.on_init = function () {
		this.inputbox = new oInputbox(cFilterBox.w, cFilterBox.h, "", "Filter", g_color_normal_txt, 0, 0, g_color_selected_bg, g_sendResponse, "brw");
		this.inputbox.autovalidation = true;
	};
	this.on_init();

	this.reset_colors = function () {
		this.inputbox.textcolor = g_color_normal_txt;
		this.inputbox.backselectioncolor = g_color_selected_bg;
	};

	this.setSize = function (w, h, font_size) {
		this.inputbox.setSize(w, h, font_size);
		this.getImages();
	};

	this.clearInputbox = function () {
		if (this.inputbox.text.length > 0) {
			this.inputbox.text = "";
			this.inputbox.offset = 0;
			filter_text = "";
		};
	};

	this.draw = function (gr, x, y) {
		var bx = x;
		var by = y;
		var bw = this.inputbox.w + Math.round(44 * g_zoom_percent / 100);

		if (this.inputbox.edit) {
			gr.SetSmoothingMode(2);
			//gr.DrawRect(bx-3, by-1, bw+2, 21, 2.0, RGB(130,140,240));
			gr.SetSmoothingMode(0);
		};

		if (this.inputbox.text.length > 0) {
			this.reset_bt.draw(gr, bx - 1, by + 1, 255);
		} else {
			gr.DrawImage(this.images.magnify.Resize(cFilterBox.h - 1, cFilterBox.h - 1, 2), bx, by + 1, cFilterBox.h - 1, cFilterBox.h - 1, 0, 0, cFilterBox.h - 1, cFilterBox.h - 1, 0, 255);
		};
		for (var i = 0; i < cFilterBox.h - 2; i += 2) {
			gr.FillSolidRect(bx + Math.round(22 * g_zoom_percent / 100) + cFilterBox.w, by + 2 + i, 1, 1, RGB(100, 100, 100));
		};
		this.inputbox.draw(gr, bx + Math.round(22 * g_zoom_percent / 100), by, 0, 0);
	};

	this.on_mouse = function (event, x, y, delta) {
		switch (event) {
		case "lbtn_down":
			this.inputbox.check("down", x, y);
			if (this.inputbox.text.length > 0)
				this.reset_bt.checkstate("down", x, y);
			break;
		case "lbtn_up":
			this.inputbox.check("up", x, y);
			if (this.inputbox.text.length > 0) {
				if (this.reset_bt.checkstate("up", x, y) == ButtonStates.hover) {
					this.inputbox.text = "";
					this.inputbox.offset = 0;
					g_sendResponse();
				};
			};
			break;
		case "lbtn_dblclk":
			this.inputbox.check("dblclk", x, y);
			break;
		case "rbtn_up":
			this.inputbox.check("right", x, y);
			break;
		case "move":
			this.inputbox.check("move", x, y);
			if (this.inputbox.text.length > 0)
				this.reset_bt.checkstate("move", x, y);
			break;
		};
	};

	this.on_key = function (event, vkey) {
		switch (event) {
		case "down":
			this.inputbox.on_key_down(vkey);
			break;
		};
	};

	this.on_char = function (code) {
		this.inputbox.on_char(code);
	};

	this.on_focus = function (is_focused) {
		this.inputbox.on_focus(is_focused);
	};
};

oScrollbar = function (themed) {
	this.themed = themed;
	this.showButtons = true;
	this.buttons = Array(null, null, null);
	this.buttonType = {
		cursor: 0,
		up: 1,
		down: 2
	};
	this.buttonClick = false;

	this.color_bg = g_color_normal_bg;
	this.color_txt = g_color_normal_txt;

	if (this.themed) {
		this.theme = window.CreateThemeManager("scrollbar");
	} else {
		this.theme = false;
	};

	this.setNewColors = function () {
		this.color_bg = g_color_normal_bg;
		this.color_txt = g_color_normal_txt;
		this.setButtons();
		this.setCursorButton();
	};

	this.setButtons = function () {
		// normal scroll_up Image
		// Draw Themed Scrollbar (lg/col)
		if (this.themed) {
			this.upImage_normal = gdi.CreateImage(this.w, this.w);
			var gb = this.upImage_normal.GetGraphics();
			try {
				this.theme.SetPartAndStateId(1, 1);
				this.theme.DrawThemeBackground(gb, 0, 0, this.w, this.w);
			} catch (e) {
				DrawPolyStar(gb, 4, 4, this.w - 8, 1, 3, 0, RGB(0, 0, 0), blendColors(this.color_txt, this.color_bg, 0.5), 0, 255);
			};
		} else {
			this.upImage_normal = gdi.CreateImage(70, 70);
			var gb = this.upImage_normal.GetGraphics();
			DrawPolyStar(gb, 11, 16, 44, 1, 3, 0, RGB(0, 0, 0), blendColors(this.color_txt, this.color_bg, 0.5), 0, 255);
		};
		this.upImage_normal.ReleaseGraphics(gb);

		// hover scroll_up Image
		// Draw Themed Scrollbar (lg/col)
		if (this.themed) {
			this.upImage_hover = gdi.CreateImage(this.w, this.w);
			gb = this.upImage_hover.GetGraphics();
			try {
				this.theme.SetPartAndStateId(1, 2);
				this.theme.DrawThemeBackground(gb, 0, 0, this.w, this.w);
			} catch (e) {
				DrawPolyStar(gb, 4, 4, this.w - 8, 1, 3, 0, blendColors(this.color_txt, this.color_bg, 0.3), blendColors(this.color_txt, this.color_bg, 0.3), 0, 255);
			};
		} else {
			this.upImage_hover = gdi.CreateImage(70, 70);
			var gb = this.upImage_hover.GetGraphics();
			DrawPolyStar(gb, 11, 16, 44, 1, 3, 0, blendColors(this.color_txt, this.color_bg, 0.3), blendColors(this.color_txt, this.color_bg, 0.3), 0, 255);
		};
		this.upImage_hover.ReleaseGraphics(gb);

		// down scroll_up Image
		// Draw Themed Scrollbar (lg/col)
		if (this.themed) {
			this.upImage_down = gdi.CreateImage(this.w, this.w);
			gb = this.upImage_down.GetGraphics();
			try {
				this.theme.SetPartAndStateId(1, 3);
				this.theme.DrawThemeBackground(gb, 0, 0, this.w, this.w);
			} catch (e) {
				DrawPolyStar(gb, 4, 4, this.w - 8, 1, 3, 0, RGB(0, 0, 0), blendColors(this.color_txt, this.color_bg, 0.05), 0, 255);
			};
		} else {
			this.upImage_down = gdi.CreateImage(70, 70);
			gb = this.upImage_down.GetGraphics();
			DrawPolyStar(gb, 11, 13, 44, 1, 3, 0, RGB(0, 0, 0), blendColors(this.color_txt, this.color_bg, 0.05), 0, 255);
		};
		this.upImage_down.ReleaseGraphics(gb);

		// normal scroll_down Image
		// Draw Themed Scrollbar (lg/col)
		if (this.themed) {
			this.downImage_normal = gdi.CreateImage(this.w, this.w);
			gb = this.downImage_normal.GetGraphics();
			try {
				this.theme.SetPartAndStateId(1, 5);
				this.theme.DrawThemeBackground(gb, 0, 0, this.w, this.w);
			} catch (e) {
				DrawPolyStar(gb, 4, 4, this.w - 8, 1, 3, 0, RGB(0, 0, 0), blendColors(this.color_txt, this.color_bg, 0.5), 180, 255);
			};
		} else {
			this.downImage_normal = gdi.CreateImage(70, 70);
			gb = this.downImage_normal.GetGraphics();
			DrawPolyStar(gb, 11, 10, 44, 1, 3, 0, RGB(0, 0, 0), blendColors(this.color_txt, this.color_bg, 0.5), 180, 255);
		};
		this.downImage_normal.ReleaseGraphics(gb);

		// hover scroll_down Image
		// Draw Themed Scrollbar (lg/col)
		if (this.themed) {
			this.downImage_hover = gdi.CreateImage(this.w, this.w);
			gb = this.downImage_hover.GetGraphics();
			try {
				this.theme.SetPartAndStateId(1, 6);
				this.theme.DrawThemeBackground(gb, 0, 0, this.w, this.w);
			} catch (e) {
				DrawPolyStar(gb, 4, 4, this.w - 8, 1, 3, 1, blendColors(this.color_txt, this.color_bg, 0.3), blendColors(this.color_txt, this.color_bg, 0.3), 180, 255);
			};
		} else {
			this.downImage_hover = gdi.CreateImage(70, 70);
			gb = this.downImage_hover.GetGraphics();
			DrawPolyStar(gb, 11, 10, 44, 1, 3, 1, blendColors(this.color_txt, this.color_bg, 0.3), blendColors(this.color_txt, this.color_bg, 0.3), 180, 255);
		};
		this.downImage_hover.ReleaseGraphics(gb);

		// down scroll_down Image
		// Draw Themed Scrollbar (lg/col)
		if (this.themed) {
			this.downImage_down = gdi.CreateImage(this.w, this.w);
			gb = this.downImage_down.GetGraphics();
			try {
				this.theme.SetPartAndStateId(1, 7);
				this.theme.DrawThemeBackground(gb, 0, 0, this.w, this.w);
			} catch (e) {
				DrawPolyStar(gb, 4, 4, this.w - 8, 1, 3, 0, RGB(0, 0, 0), blendColors(this.color_txt, this.color_bg, 0.05), 180, 255);
			};
		} else {
			this.downImage_down = gdi.CreateImage(70, 70);
			gb = this.downImage_down.GetGraphics();
			DrawPolyStar(gb, 11, 13, 44, 1, 3, 0, RGB(0, 0, 0), blendColors(this.color_txt, this.color_bg, 0.05), 180, 255);
		};
		this.downImage_down.ReleaseGraphics(gb);

		for (i = 1; i < this.buttons.length; i++) {
			switch (i) {
			case this.buttonType.cursor:
				this.buttons[this.buttonType.cursor] = new button(this.cursorImage_normal, this.cursorImage_hover, this.cursorImage_down);
				break;
			case this.buttonType.up:
				this.buttons[this.buttonType.up] = new button(this.upImage_normal.Resize(this.w, this.w, 2), this.upImage_hover.Resize(this.w, this.w, 2), this.upImage_down.Resize(this.w, this.w, 2));
				break;
			case this.buttonType.down:
				this.buttons[this.buttonType.down] = new button(this.downImage_normal.Resize(this.w, this.w, 2), this.downImage_hover.Resize(this.w, this.w, 2), this.downImage_down.Resize(this.w, this.w, 2));
				break;
			};
		};
	};

	this.setCursorButton = function () {
		// normal cursor Image
		this.cursorImage_normal = gdi.CreateImage(this.cursorw, this.cursorh);
		var gb = this.cursorImage_normal.GetGraphics();
		// Draw Themed Scrollbar (lg/col)
		if (this.themed) {
			try {
				this.theme.SetPartAndStateId(3, 1);
				this.theme.DrawThemeBackground(gb, 0, 0, this.cursorw, this.cursorh);
				if (this.cursorh >= 30) {
					this.theme.SetPartAndStateId(9, 1);
					this.theme.DrawThemeBackground(gb, 0, 0, this.cursorw, this.cursorh);
				};
			} catch (e) {
				gb.FillSolidRect(1, 0, this.cursorw - 2, this.cursorh, blendColors(this.color_txt, this.color_bg, 0.5));
			};
		} else {
			gb.FillSolidRect(1, 0, this.cursorw - 2, this.cursorh, blendColors(this.color_txt, this.color_bg, 0.5) & 0x88ffffff);
			gb.DrawRect(1, 0, this.cursorw - 2 - 1, this.cursorh - 1, 1.0, this.color_txt & 0x44ffffff);
		};
		this.cursorImage_normal.ReleaseGraphics(gb);

		// hover cursor Image
		this.cursorImage_hover = gdi.CreateImage(this.cursorw, this.cursorh);
		gb = this.cursorImage_hover.GetGraphics();
		// Draw Themed Scrollbar (lg/col)
		if (this.themed) {
			try {
				this.theme.SetPartAndStateId(3, 2);
				this.theme.DrawThemeBackground(gb, 0, 0, this.cursorw, this.cursorh);
				if (this.cursorh >= 30) {
					this.theme.SetPartAndStateId(9, 2);
					this.theme.DrawThemeBackground(gb, 0, 0, this.cursorw, this.cursorh);
				};
			} catch (e) {
				gb.FillSolidRect(1, 0, this.cursorw - 2, this.cursorh, blendColors(this.color_txt, this.color_bg, 0.3));
			};
		} else {
			gb.FillSolidRect(1, 0, this.cursorw - 2, this.cursorh, blendColors(this.color_txt, this.color_bg, 0.3) & 0x88ffffff);
			gb.DrawRect(1, 0, this.cursorw - 2 - 1, this.cursorh - 1, 1.0, this.color_txt & 0x44ffffff);
		};
		this.cursorImage_hover.ReleaseGraphics(gb);

		// down cursor Image
		this.cursorImage_down = gdi.CreateImage(this.cursorw, this.cursorh);
		gb = this.cursorImage_down.GetGraphics();
		// Draw Themed Scrollbar (lg/col)
		if (this.themed) {
			try {
				this.theme.SetPartAndStateId(3, 3);
				this.theme.DrawThemeBackground(gb, 0, 0, this.cursorw, this.cursorh);
				if (this.cursorh >= 30) {
					this.theme.SetPartAndStateId(9, 3);
					this.theme.DrawThemeBackground(gb, 0, 0, this.cursorw, this.cursorh);
				};
			} catch (e) {
				gb.FillSolidRect(1, 0, this.cursorw - 2, this.cursorh, blendColors(this.color_txt, this.color_bg, 0.05));
			};
		} else {
			gb.FillSolidRect(1, 0, this.cursorw - 2, this.cursorh, blendColors(this.color_txt, this.color_bg, 0.05) & 0x88ffffff);
			gb.DrawRect(1, 0, this.cursorw - 2 - 1, this.cursorh - 1, 1.0, this.color_txt & 0x44ffffff);
		};
		this.cursorImage_down.ReleaseGraphics(gb);

		// create/refresh cursor Button in buttons array
		this.buttons[this.buttonType.cursor] = new button(this.cursorImage_normal, this.cursorImage_hover, this.cursorImage_down);
		this.buttons[this.buttonType.cursor].x = this.x;
		this.buttons[this.buttonType.cursor].y = this.cursory;
	};

	this.draw = function (gr) {
		// scrollbar background
		if (this.themed) {
			try {
				this.theme.SetPartAndStateId(6, 1);
				this.theme.DrawThemeBackground(gr, this.x, this.y, this.w, this.h);
			} catch (e) {
				gr.FillSolidRect(this.x, this.y, this.w, this.h, this.color_bg & 0x25ffffff);
				gr.FillSolidRect(this.x, this.y, 1, this.h, this.color_txt & 0x05ffffff);
			};
		} else {
			gr.FillSolidRect(this.x, this.y, this.w, this.h, this.color_bg & 0x25ffffff);
			gr.FillSolidRect(this.x, this.y, 1, this.h, this.color_txt & 0x05ffffff);
		};
		// scrollbar buttons
		if (cScrollBar.visible)
			this.buttons[this.buttonType.cursor].draw(gr, this.x, this.cursory, 200);
		if (this.showButtons) {
			this.buttons[this.buttonType.up].draw(gr, this.x, this.y, 200);
			this.buttons[this.buttonType.down].draw(gr, this.x, this.areay + this.areah, 200);
		};
	};

	this.updateScrollbar = function () {
		var prev_cursorh = this.cursorh;
		this.total = brw.rowsCount;
		this.rowh = ppt.rowHeight;
		this.totalh = this.total * this.rowh;
		// set scrollbar visibility
		cScrollBar.visible = (this.totalh > brw.h);
		// set cursor width/height
		this.cursorw = cScrollBar.width;
		if (this.total > 0) {
			this.cursorh = Math.round((brw.h / this.totalh) * this.areah);
			if (this.cursorh < cScrollBar.minCursorHeight)
				this.cursorh = cScrollBar.minCursorHeight;
		} else {
			this.cursorh = cScrollBar.minCursorHeight;
		};
		// set cursor y pos
		this.setCursorY();

		if (this.cursorw && this.cursorh && this.cursorh != prev_cursorh)
			this.setCursorButton();
	};

	this.setCursorY = function () {
		// set cursor y pos
		var ratio = scroll / (this.totalh - brw.h);
		this.cursory = this.areay + Math.round((this.areah - this.cursorh) * ratio);
	};

	this.setSize = function () {
		this.buttonh = cScrollBar.width;
		this.x = brw.x + brw.w;
		this.y = brw.y - ppt.headerBarHeight * 0;
		this.w = cScrollBar.width;
		this.h = brw.h + ppt.headerBarHeight * 0;
		if (this.showButtons) {
			this.areay = this.y + this.buttonh;
			this.areah = this.h - (this.buttonh * 2);
		} else {
			this.areay = this.y;
			this.areah = this.h;
		};
		this.setButtons();
	};

	this.setScrollFromCursorPos = function () {
		// calc ratio of the scroll cursor to calc the equivalent item for the full list (with gh)
		var ratio = (this.cursory - this.areay) / (this.areah - this.cursorh);
		// calc idx of the item (of the full list with gh) to display at top of the panel list (visible)
		scroll = Math.round((this.totalh - brw.h) * ratio);
	};

	this.cursorCheck = function (event, x, y) {
		if (!this.buttons[this.buttonType.cursor])
			return;
		switch (event) {
		case "down":
			var tmp = this.buttons[this.buttonType.cursor].checkstate(event, x, y);
			if (tmp == ButtonStates.down) {
				this.cursorClickX = x;
				this.cursorClickY = y;
				this.cursorDrag = true;
				this.cursorDragDelta = y - this.cursory;
			};
			break;
		case "up":
			this.buttons[this.buttonType.cursor].checkstate(event, x, y);
			if (this.cursorDrag) {
				this.setScrollFromCursorPos();
				brw.repaint();
			};
			this.cursorClickX = 0;
			this.cursorClickY = 0;
			this.cursorDrag = false;
			break;
		case "move":
			this.buttons[this.buttonType.cursor].checkstate(event, x, y);
			if (this.cursorDrag) {
				this.cursory = y - this.cursorDragDelta;
				if (this.cursory + this.cursorh > this.areay + this.areah) {
					this.cursory = (this.areay + this.areah) - this.cursorh;
				};
				if (this.cursory < this.areay) {
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

	this._isHover = function (x, y) {
		return (x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h);
	};

	this._isHoverArea = function (x, y) {
		return (x >= this.x && x <= this.x + this.w && y >= this.areay && y <= this.areay + this.areah);
	};

	this._isHoverCursor = function (x, y) {
		return (x >= this.x && x <= this.x + this.w && y >= this.cursory && y <= this.cursory + this.cursorh);
	};

	this.on_mouse = function (event, x, y, delta) {
		this.isHover = this._isHover(x, y);
		this.isHoverArea = this._isHoverArea(x, y);
		this.isHoverCursor = this._isHoverCursor(x, y);
		this.isHoverButtons = this.isHover && !this.isHoverCursor && !this.isHoverArea;
		this.isHoverEmptyArea = this.isHoverArea && !this.isHoverCursor;

		var scroll_step = ppt.rowHeight;
		var scroll_step_page = brw.h;

		switch (event) {
		case "down":
		case "dblclk":
			if ((this.isHoverCursor || this.cursorDrag) && !this.buttonClick && !this.isHoverEmptyArea) {
				this.cursorCheck(event, x, y);
			} else {
				// buttons events
				var bt_state = ButtonStates.normal;
				for (var i = 1; i < 3; i++) {
					switch (i) {
					case 1: // up button
						bt_state = this.buttons[i].checkstate(event, x, y);
						if ((event == "down" && bt_state == ButtonStates.down) || (event == "dblclk" && bt_state == ButtonStates.hover)) {
							this.buttonClick = true;
							scroll = scroll - scroll_step;
							scroll = check_scroll(scroll);
							if (!cScrollBar.timerID) {
								cScrollBar.timerID = window.SetInterval(function () {
										if (cScrollBar.timerCounter > 6) {
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
						if ((event == "down" && bt_state == ButtonStates.down) || (event == "dblclk" && bt_state == ButtonStates.hover)) {
							this.buttonClick = true;
							scroll = scroll + scroll_step;
							scroll = check_scroll(scroll);
							if (!cScrollBar.timerID) {
								cScrollBar.timerID = window.SetInterval(function () {
										if (cScrollBar.timerCounter > 6) {
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
				if (!this.buttonClick && this.isHoverEmptyArea) {
					// check click on empty area scrollbar
					if (y < this.cursory) {
						// up
						this.buttonClick = true;
						scroll = scroll - scroll_step_page;
						scroll = check_scroll(scroll);
						if (!cScrollBar.timerID) {
							cScrollBar.timerID = window.SetInterval(function () {
									if (cScrollBar.timerCounter > 6 && m_y < brw.scrollbar.cursory) {
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
						if (!cScrollBar.timerID) {
							cScrollBar.timerID = window.SetInterval(function () {
									if (cScrollBar.timerCounter > 6 && m_y > brw.scrollbar.cursory + brw.scrollbar.cursorh) {
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
			if (cScrollBar.timerID) {
				window.ClearInterval(cScrollBar.timerID);
				cScrollBar.timerID = false;
			};
			cScrollBar.timerCounter = -1;

			this.cursorCheck(event, x, y);
			for (var i = 1; i < 3; i++) {
				this.buttons[i].checkstate(event, x, y);
			};
			this.buttonClick = false;
			break;
		case "move":
			this.cursorCheck(event, x, y);
			for (var i = 1; i < 3; i++) {
				this.buttons[i].checkstate(event, x, y);
			};
			break;
		case "wheel":
			if (!this.buttonClick) {
				this.updateScrollbar();
			};
			break;
		case "leave":
			this.cursorCheck(event, 0, 0);
			for (var i = 1; i < 3; i++) {
				this.buttons[i].checkstate(event, 0, 0);
			};
			break;
		};
	};
};

oBrowser = function (name) {
	this.name = name;
	this.rows = [];
	this.SHIFT_start_id = null;
	this.SHIFT_count = 0;
	this.scrollbar = new oScrollbar(cScrollBar.themed);
	this.keypressed = false;
	this.inputbox = null;
	this.inputboxID = -1;
	this.selectedRow = plman.ActivePlaylist;

	this.launch_populate = function () {
		var launch_timer = window.SetTimeout(function () {
				brw.populate(true, true);
				launch_timer && window.ClearTimeout(launch_timer);
				launch_timer = false;
			}, 5);
	};

	this.repaint = function () {
		need_repaint = true;
	};

	this.setSize = function (x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.marginLR = 0;
		this.totalRows = Math.ceil(this.h / ppt.rowHeight);
		this.totalRowsVis = Math.floor(this.h / ppt.rowHeight);

		this.getlimits();

		g_filterbox.setSize(cFilterBox.w, cFilterBox.h + 2, g_fsize + 2);

		if (this.inputboxID > -1) {
			var rh = ppt.rowHeight - 10;
			var tw = this.w - rh - 10;
			this.inputbox && this.inputbox.setSize(tw, rh, g_fsize);
		};

		this.scrollbar.setSize();

		scroll = Math.round(scroll / ppt.rowHeight) * ppt.rowHeight;
		scroll = check_scroll(scroll);
		scroll_ = scroll;

		// scrollbar update
		this.scrollbar.updateScrollbar();
	};

	this.init_groups = function () {
		var rowId = 0;
		var name = "";
		var total = plman.PlaylistCount;
		this.previous_playlistCount = total;

		this.rows.splice(0, this.rows.length);
		var str_filter = process_string(filter_text);

		for (var i = 0; i < total; i++) {
			name = plman.GetPlaylistName(i);
			if (str_filter.length > 0) {
				var toAdd = match(name, str_filter);
			} else {
				var toAdd = true;
			};
			if (toAdd) {
				this.rows.push(new oPlaylist(i, rowId, name));
				rowId++;
			};
		};
		this.rowsCount = rowId;
		this.getlimits();
	};

	this.getlimits = function () {
		if (this.rowsCount <= this.totalRowsVis) {
			var start_ = 0;
			var end_ = this.rowsCount - 1;
		} else {
			if (scroll_ < 0)
				scroll_ = scroll;
			var start_ = Math.round(scroll_ / ppt.rowHeight + 0.4);
			var end_ = start_ + this.totalRows;
			// check boundaries
			start_ = start_ > 0 ? start_ - 1 : start_;
			if (start_ < 0)
				start_ = 0;
			if (end_ >= this.rows.length)
				end_ = this.rows.length - 1;
		};
		g_start_ = start_;
		g_end_ = end_;
	};

	this.populate = function (is_first_populate, reset_scroll) {
		this.init_groups();
		if (reset_scroll)
			scroll = scroll_ = 0;
		this.scrollbar.updateScrollbar();
		this.repaint();
		g_first_populate_done = true;
	};

	this.getRowIdFromIdx = function (idx) {
		var total = this.rows.length;
		var rowId = -1;
		if (plman.PlaylistCount > 0) {
			for (var i = 0; i < total; i++) {
				if (this.rows[i].idx == idx) {
					rowId = i;
					break;
				};
			};
		};
		return rowId;
	};

	this.isVisiblePlaylist = function (idx) {
		var rowId = this.getRowIdFromIdx(idx);
		var offset_active_pl = ppt.rowHeight * rowId;
		if (offset_active_pl < scroll || offset_active_pl + ppt.rowHeight > scroll + this.h) {
			return false;
		} else {
			return true;
		};
	};

	this.showSelectedPlaylist = function () {
		var rowId = this.getRowIdFromIdx(brw.selectedRow);

		if (!this.isVisiblePlaylist(brw.selectedRow)) {
			scroll = (rowId - Math.floor(this.totalRowsVis / 2)) * ppt.rowHeight;
			scroll = check_scroll(scroll);
			this.scrollbar.updateScrollbar();
		};
	};

	this.showActivePlaylist = function () {
		var rowId = this.getRowIdFromIdx(plman.ActivePlaylist);

		if (!this.isVisiblePlaylist(plman.ActivePlaylist)) {
			scroll = (rowId - Math.floor(this.totalRowsVis / 2)) * ppt.rowHeight;
			scroll = check_scroll(scroll);
			this.scrollbar.updateScrollbar();
		};
	};

	this.draw = function (gr) {

		if (cPlaylistManager.playlist_switch_pending) {
			window.SetCursor(IDC_ARROW);
			cPlaylistManager.playlist_switch_pending = false;
		};

			if (this.rows.length > 0) {

				var ax = this.marginLR;
				var ay = 0;
				var aw = this.w;
				var ah = ppt.rowHeight;
				var g = 0;

				for (var i = g_start_; i <= g_end_; i++) {

					ay = Math.floor(this.y + (i * ah) - scroll_);
					this.rows[i].x = ax;
					this.rows[i].y = ay;

					if (ay > this.y - ppt.headerBarHeight - ah && ay < this.y + this.h) {
						// =========
						// row bg
						// =========
						var track_color_txt = g_color_normal_txt;

						// active playlist row bg
						if (this.rows[i].idx == plman.ActivePlaylist) {
							track_color_txt = (ppt.enableCustomColors ? g_color_selected_txt : g_color_normal_bg);
							gr.FillSolidRect(ax, ay, aw, ah, g_color_selected_bg & 0xb0ffffff);
							// default bg (odd/even)
							if (i % 2 == 0) {
								gr.FillSolidRect(ax, ay, aw, ah, RGBA(255, 255, 255, 5));
							} else {
								gr.FillSolidRect(ax, ay, aw, ah, RGBA(0, 0, 0, 5));
							};
						} else {
							if (fb.IsPlaying) {
								var row_playing = this.getRowIdFromIdx(plman.PlayingPlaylist);
								if (i == row_playing) {
									track_color_txt = g_color_selected_bg;
								};
							};
							// default bg (odd/even)
							if (i % 2 != 0) {
								gr.FillSolidRect(ax, ay, aw, ah, g_color_normal_txt & 0x05ffffff);
							};
						};

						// hover item
						if (i == this.selectedRow) {
							gr.DrawRect(ax + 1, ay + 1, aw - 2, ah - 2, 2.0, g_color_selected_bg & 0xd0ffffff);
						};

						// target location mark
						if (cPlaylistManager.drag_target_id == i) {
							if (cPlaylistManager.drag_target_id > cPlaylistManager.drag_source_id) {
								gr.DrawRect(ax, ay + ppt.rowHeight - 2, aw - 1, 1, 2.0, g_color_selected_bg);
							} else if (cPlaylistManager.drag_target_id < cPlaylistManager.drag_source_id) {
								gr.DrawRect(ax, ay + 1, aw - 1, 1, 2.0, g_color_selected_bg);
							};
						};

						if (g_dragndrop_status && i == g_dragndrop_targetPlaylistId && !this.rows[i].isAutoPlaylist) {
							gr.DrawRect(ax + 1, ay + 1, aw - 2, ah - 2, 2.0, g_color_normal_txt & 0xa0ffffff);
						};

						// draw blink rectangle after an external drag'n drop files
						if (blink.counter > -1) {
							if (i == blink.id && !this.rows[i].isAutoPlaylist) {
								if (blink.counter <= 5 && Math.floor(blink.counter / 2) == Math.ceil(blink.counter / 2)) {
									gr.DrawRect(ax + 1, ay + 1, aw - 2, ah - 2, 2.0, g_color_selected_bg & 0xd0ffffff);
								};
							};
						};

						// =====
						// text
						// =====
						if (ay >= (0 - ah) && ay < this.y + this.h) {

							// playlist icon
							var rh = ppt.rowHeight - 10;
							if (fb.IsPlaying && this.rows[i].idx == plman.PlayingPlaylist) {
								if (this.rows[i].idx == plman.ActivePlaylist) {
									if (plman.IsAutoPlaylist(this.rows[i].idx)) {
										gr.DrawImage(images.icon_auto_pl_playing_sel.Resize(rh, rh, 2), ax, ay + 5, rh, rh, 0, 0, rh, rh, 0, 255);
									} else {
										gr.DrawImage(images.icon_normal_pl_playing_sel.Resize(rh, rh, 2), ax, ay + 5, rh, rh, 0, 0, rh, rh, 0, 255);
									};
								} else {
									if (plman.IsAutoPlaylist(this.rows[i].idx)) {
										gr.DrawImage(images.icon_auto_pl_playing.Resize(rh, rh, 2), ax, ay + 5, rh, rh, 0, 0, rh, rh, 0, 255);
									} else {
										gr.DrawImage(images.icon_normal_pl_playing.Resize(rh, rh, 2), ax, ay + 5, rh, rh, 0, 0, rh, rh, 0, 255);
									};
								};
							} else {
								if (this.rows[i].idx == plman.ActivePlaylist) {
									if (plman.IsAutoPlaylist(this.rows[i].idx)) {
										gr.DrawImage(images.icon_auto_pl_sel.Resize(rh, rh, 2), ax, ay + 5, rh, rh, 0, 0, rh, rh, 0, 255);
									} else {
										gr.DrawImage(images.icon_normal_pl_sel.Resize(rh, rh, 2), ax, ay + 5, rh, rh, 0, 0, rh, rh, 0, 255);
									};
								} else {
									if (plman.IsAutoPlaylist(this.rows[i].idx)) {
										gr.DrawImage(images.icon_auto_pl.Resize(rh, rh, 2), ax, ay + 5, rh, rh, 0, 0, rh, rh, 0, 255);
									} else {
										gr.DrawImage(images.icon_normal_pl.Resize(rh, rh, 2), ax, ay + 5, rh, rh, 0, 0, rh, rh, 0, 255);
									};
								};
							};

							if (fb.IsPlaying && i == plman.PlayingPlaylist) {
								var font = g_font_bold;
							} else {
								var font = g_font;
							};

							// fields
							var track_name_part = this.rows[i].name;
							var track_total_part = plman.PlaylistItemCount(this.rows[i].idx);

							cColumns.track_name_part = gr.CalcTextWidth(track_name_part, font) + 15;
							cColumns.track_total_part = gr.CalcTextWidth(track_total_part, font) + 15;

							var tx = ax + rh;
							var tw = aw - rh;

							if (this.inputboxID == i) {
								this.inputbox.draw(gr, tx + 2, ay + 5);
							} else {
								gr.GdiDrawText(track_name_part, font, track_color_txt, tx, ay, tw - cColumns.track_total_part - 5, ah, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
								gr.GdiDrawText(track_total_part, font, track_color_txt, tx + tw - cColumns.track_total_part - 5, ay, cColumns.track_total_part, ah, DT_RIGHT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
							};
						};
					};
				};
				// draw scrollbar
				if (cScrollBar.enabled) {
					brw.scrollbar && brw.scrollbar.draw(gr);
				};

			} else { // no playlist, manager panel is empty

				// draw scrollbar
				if (cScrollBar.enabled) {
					brw.scrollbar && brw.scrollbar.draw(gr);
				};
			};

			// draw header
			if (ppt.showHeaderBar) {
				var boxText = this.rows.length + " playlist" + (this.rows.length > 1 ? "s  " : "  ");

				// draw background part above playlist (headerbar)
				if (fb.IsPlaying && g_wallpaperImg && ppt.showwallpaper) {
					gr.GdiDrawBitmap(g_wallpaperImg, 0, 0, ww, brw.y - 1, 0, 0, g_wallpaperImg.Width, brw.y - 1);
					gr.FillSolidRect(0, 0, ww, brw.y - 1, g_color_normal_bg & RGBA(255, 255, 255, ppt.wallpaperalpha));
				} else {
					if (g_wallpaperImg && ppt.showwallpaper) {
						gr.GdiDrawBitmap(g_wallpaperImg, 0, 0, ww, brw.y - 1, 0, 0, g_wallpaperImg.Width, brw.y - 1);
						gr.FillSolidRect(0, 0, ww, brw.y - 1, g_color_normal_bg & RGBA(255, 255, 255, ppt.wallpaperalpha));
					} else {
						gr.FillSolidRect(0, 0, ww, brw.y - 1, g_color_normal_bg);
					};
				};
				gr.FillSolidRect(this.x, 0, this.w + (cScrollBar.enabled ? cScrollBar.width : 0), ppt.headerBarHeight - 1, g_color_normal_bg & 0x20ffffff);
				gr.FillSolidRect(this.x, ppt.headerBarHeight - 2, this.w + (cScrollBar.enabled ? cScrollBar.width : 0), 1, g_color_normal_txt & 0x22ffffff);

				var tx = cFilterBox.x + cFilterBox.w + Math.round(22 * g_zoom_percent / 100) + 5;
				var tw = this.w - tx + (cScrollBar.enabled ? cScrollBar.width : 0);
				try {
					gr.GdiDrawText(boxText, g_font_box, blendColors(g_color_normal_txt, g_color_normal_bg, 0.3), tx, 0, tw, ppt.headerBarHeight - 1, DT_RIGHT | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX | DT_END_ELLIPSIS);
				} catch (e) {
					console.log(">> debug: cScrollBar.width=" + cScrollBar.width + " /boxText=" + boxText + " /ppt.headerBarHeight=" + ppt.headerBarHeight + " /g_fsize=" + g_fsize);
				};
			};
	};

	this._isHover = function (x, y) {
		return (x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h);
	};

	this.on_mouse = function (event, x, y) {
		this.ishover = this._isHover(x, y);

		// get hover row index (mouse cursor hover)
		if (y > this.y && y < this.y + this.h) {
			this.activeRow = Math.ceil((y + scroll_ - this.y) / ppt.rowHeight - 1);
			if (this.activeRow >= this.rows.length)
				this.activeRow = -1;
		} else {
			this.activeRow = -1;
		};

		switch (event) {
		case "down":
			this.down = true;
			if (!cTouch.down && !timers.mouseDown && this.ishover && this.activeRow > -1 && Math.abs(scroll - scroll_) < 2) {
				this.selectedRow = this.activeRow;
				if (this.activeRow == this.inputboxID) {
					this.inputbox.check("down", x, y);
				} else {
					if (this.inputboxID > -1)
						this.inputboxID = -1;
					//if(this.selectedRow == this.rows[this.activeRow].idx) {
					if (!this.up) {
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
				if (this.inputboxID > -1)
					this.inputboxID = -1;
				// scrollbar
				if (cScrollBar.enabled && cScrollBar.visible) {
					this.scrollbar && this.scrollbar.on_mouse(event, x, y);
				};
			};
			this.up = false;
			break;
		case "up":
			this.up = true;
			if (this.down) {
				// scrollbar
				if (cScrollBar.enabled && cScrollBar.visible) {
					brw.scrollbar && brw.scrollbar.on_mouse(event, x, y);
				};

				if (this.inputboxID >= 0) {
					this.inputbox.check("up", x, y);
				} else {
					// drop playlist switch
					if (cPlaylistManager.drag_target_id > -1) {
						if (cPlaylistManager.drag_target_id != cPlaylistManager.drag_source_id) {
							cPlaylistManager.drag_droped = true
								if (cPlaylistManager.drag_target_id < cPlaylistManager.drag_source_id) {
									plman.MovePlaylist(this.rows[cPlaylistManager.drag_source_id].idx, this.rows[cPlaylistManager.drag_target_id].idx);
								} else if (cPlaylistManager.drag_target_id > cPlaylistManager.drag_source_id) {
								plman.MovePlaylist(this.rows[cPlaylistManager.drag_source_id].idx, this.rows[cPlaylistManager.drag_target_id].idx);
							};
						};
						this.selectedRow = cPlaylistManager.drag_target_id;
					};
				};

				if (timers.movePlaylist) {
					timers.movePlaylist && window.ClearInterval(timers.movePlaylist);
					timers.movePlaylist = false;
				};
			};

			this.down = false;

			if (cPlaylistManager.drag_moved)
				window.SetCursor(IDC_ARROW);

			cPlaylistManager.drag_clicked = false;
			cPlaylistManager.drag_moved = false;
			cPlaylistManager.drag_source_id = -1;
			cPlaylistManager.drag_target_id = -1;
			cPlaylistManager.drag_x = -1;
			cPlaylistManager.drag_y = -1;
			break;
		case "dblclk":
			if (this.ishover && this.activeRow > -1 && Math.abs(scroll - scroll_) < 2) {
				if (plman.ActivePlaylist != this.rows[this.activeRow].idx) {
					if (this.inputboxID > -1)
						this.inputboxID = -1;
					this.repaint();
					plman.ActivePlaylist = this.rows[this.activeRow].idx;
					cPlaylistManager.playlist_switch_pending = true;
					window.SetCursor(IDC_WAIT);
				};
			} else {
				// scrollbar
				if (cScrollBar.enabled && cScrollBar.visible) {
					brw.scrollbar && brw.scrollbar.on_mouse(event, x, y);
				};
			};
			break;
		case "move":
			this.up = false;
			if (this.inputboxID >= 0) {
				this.inputbox.check("move", x, y);
			} else {
				if (cPlaylistManager.drag_clicked) {
					cPlaylistManager.drag_moved = true;
				};
				if (cPlaylistManager.drag_moved) {
					if (this.activeRow > -1) {
						if (timers.movePlaylist) {
							timers.movePlaylist && window.ClearInterval(timers.movePlaylist);
							timers.movePlaylist = false;
						};
						if (this.activeRow != cPlaylistManager.drag_source_id) {
							if (this.activeRow != cPlaylistManager.drag_source_id) {
								cPlaylistManager.drag_target_id = this.activeRow;
							};
						} else if (y > this.rows[this.rowsCount - 1].y + ppt.rowHeight && y < this.rows[this.rowsCount - 1].y + ppt.rowHeight * 2) {
							cPlaylistManager.drag_target_id = this.rowsCount;
						} else {
							cPlaylistManager.drag_target_id = -1;
						};
					} else {
						if (y < this.y) {
							if (!timers.movePlaylist) {
								timers.movePlaylist = window.SetInterval(function () {
										scroll -= ppt.rowHeight;
										scroll = check_scroll(scroll);
										cPlaylistManager.drag_target_id = cPlaylistManager.drag_target_id > 0 ? cPlaylistManager.drag_target_id - 1 : 0;
									}, 100);
							}
						} else if (y > this.y + this.h) {
							if (!timers.movePlaylist) {
								timers.movePlaylist = window.SetInterval(function () {
										scroll += ppt.rowHeight;
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
			if (cScrollBar.enabled && cScrollBar.visible) {
				brw.scrollbar && brw.scrollbar.on_mouse(event, x, y);
			};
			break;
		case "right":
			if (this.inputboxID >= 0) {
				this.inputbox.check("bidon", x, y);
				if (!this.inputbox.hover) {
					this.inputboxID = -1;
					this.on_mouse("right", x, y);
				} else {
					this.inputbox.check("right", x, y);
				};
			} else {
				if (this.ishover) {
					if (this.activeRow > -1 && Math.abs(scroll - scroll_) < 2) {
						if (!utils.IsKeyPressed(VK_SHIFT)) {
							this.repaint();
							this.selectedRow = this.activeRow;
							//plman.ActivePlaylist = this.rows[this.activeRow].idx;
							if (!timers.rightClick) {
								timers.rightClick = window.SetTimeout(function () {
										brw.context_menu(m_x, m_y, brw.selectedRow);
										timers.rightClick && window.ClearTimeout(timers.rightClick);
										timers.rightClick = false;
									}, 50);
							};
						};
						this.repaint();
					} else {
						this.context_menu(x, y, this.activeRow);
					};
				} else {
					// scrollbar
					if (cScrollBar.enabled && cScrollBar.visible) {
						brw.scrollbar && brw.scrollbar.on_mouse(event, x, y);
					};
					// settings menu
					if (!g_filterbox.inputbox.hover) {
						this.settings_context_menu(x, y);
					};
				};
			};
			break;
		case "wheel":

			break;
		case "leave":
			// scrollbar
			if (cScrollBar.enabled && cScrollBar.visible) {
				this.scrollbar && this.scrollbar.on_mouse(event, 0, 0);
			};
			break;
		case "drag_over":
			if (this.rows.length > 0 && this.activeRow > -1) {
				g_dragndrop_targetPlaylistId = this.activeRow;
			}
			break;
		};
	};

	this.g_time = window.SetInterval(function () {
			if (!window.IsVisible) {
				need_repaint = true;
				return;
			};

			if (!g_first_populate_launched) {
				g_first_populate_launched = true;
				brw.launch_populate();
			};

			// get hover row index (mouse cursor hover)
			if (m_y > brw.y && m_y < brw.y + brw.h) {
				brw.activeRow = Math.ceil((m_y + scroll_ - brw.y) / ppt.rowHeight - 1);
				if (brw.activeRow >= brw.rows.length)
					brw.activeRow = -1;
			} else {
				brw.activeRow = -1;
			};

			scroll = check_scroll(scroll);
			if (Math.abs(scroll - scroll_) >= 1) {
				scroll_ += (scroll - scroll_) / ppt.scrollSmoothness;
				need_repaint  = true;
				isScrolling = true;
				//
				if (scroll_prev != scroll)
					brw.scrollbar.updateScrollbar();
			} else {
				if (isScrolling) {
					if (scroll_ < 1)
						scroll_ = 0;
					isScrolling = false;
					need_repaint  = true;
				};
			};

			if (need_repaint) {
				if (brw.rows.length > 0)
					brw.getlimits();
				need_repaint = false;
				window.Repaint();
			};

			scroll_prev = scroll;

		}, ppt.refreshRate);

	this.context_menu = function (x, y, id) {
		var MF_SEPARATOR = 0x00000800;
		var MF_STRING = 0x00000000;
		var _menu = window.CreatePopupMenu();
		var _newplaylist = window.CreatePopupMenu();
		var _autoplaylist = window.CreatePopupMenu();
		var idx;
		var total_area,
		visible_area;
		var bout,
		z;
		var add_mode = (id == null || id < 0);
		var total = plman.PlaylistCount;

		if (!add_mode) {
			var pl_idx = this.rows[id].idx;
			_newplaylist.AppendTo(_menu, (g_filterbox.inputbox.text.length > 0 ? MF_GRAYED | MF_DISABLED : MF_STRING), "Insert ...");
		} else {
			id = this.rowsCount;
			var pl_idx = total;
			_newplaylist.AppendTo(_menu, (g_filterbox.inputbox.text.length > 0 ? MF_GRAYED | MF_DISABLED : MF_STRING), "Add ...");
		};
		_newplaylist.AppendMenuItem(MF_STRING, 100, "New Playlist");
		_newplaylist.AppendMenuItem(MF_STRING, 101, "New Autoplaylist");
		_autoplaylist.AppendTo(_newplaylist, MF_STRING, "Preset AutoPlaylists");
		_autoplaylist.AppendMenuItem(MF_STRING, 200, "Media Library (full)");
		_autoplaylist.AppendMenuItem(MF_STRING, 205, "Tracks never played");
		_autoplaylist.AppendMenuItem(MF_STRING, 206, "Tracks played in the last 5 days");
		_autoplaylist.AppendMenuItem(MF_SEPARATOR, 0, "");
		_autoplaylist.AppendMenuItem(MF_STRING, 210, "Tracks unrated");
		_autoplaylist.AppendMenuItem(MF_STRING, 211, "Tracks rated 1");
		_autoplaylist.AppendMenuItem(MF_STRING, 212, "Tracks rated 2");
		_autoplaylist.AppendMenuItem(MF_STRING, 213, "Tracks rated 3");
		_autoplaylist.AppendMenuItem(MF_STRING, 214, "Tracks rated 4");
		_autoplaylist.AppendMenuItem(MF_STRING, 215, "Tracks rated 5");
		_autoplaylist.AppendMenuItem(MF_SEPARATOR, 0, "");
		_autoplaylist.AppendMenuItem(MF_STRING, 250, "Loved Tracks");
		_menu.AppendMenuItem(MF_SEPARATOR, 0, "");
		_menu.AppendMenuItem(MF_STRING, 2, "Load a Playlist");
		if (!add_mode) {
			_menu.AppendMenuItem(MF_STRING, 5, "Duplicate this playlist");

			_menu.AppendMenuItem(MF_STRING, 3, "Rename this playlist");
			_menu.AppendMenuItem(MF_STRING, 8, "Remove this playlist");

			if (plman.IsAutoPlaylist(id)) {
				_menu.AppendMenuItem(MF_SEPARATOR, 0, "");
				_menu.AppendMenuItem(MF_STRING, 6, "Autoplaylist properties...");
				_menu.AppendMenuItem(MF_STRING, 7, "Convert to a normal playlist");
			};

		};

		idx = _menu.TrackPopupMenu(x, y);

		switch (true) {
		case (idx == 100):
			plman.CreatePlaylist(total, "");
			plman.MovePlaylist(total, pl_idx);
			plman.ActivePlaylist = pl_idx;
			// set rename it
			var rh = ppt.rowHeight - 10;
			var tw = this.w - rh - 10;
			this.inputbox = new oInputbox(tw, rh, plman.GetPlaylistName(pl_idx), "", g_color_normal_txt, g_color_normal_bg, RGB(0, 0, 0), g_color_selected_bg & 0xd0ffffff, "renamePlaylist()", "brw");
			this.inputbox.setSize(tw, rh, g_fsize); // set font_size
			this.inputboxID = id;
			// activate inputbox for edit
			this.inputbox.on_focus(true);
			this.inputbox.edit = true;
			this.inputbox.Cpos = this.inputbox.text.length;
			this.inputbox.anchor = this.inputbox.Cpos;
			this.inputbox.SelBegin = this.inputbox.Cpos;
			this.inputbox.SelEnd = this.inputbox.Cpos;
			if (!cInputbox.timer_cursor) {
				this.inputbox.resetCursorTimer();
			};
			this.inputbox.dblclk = true;
			this.inputbox.SelBegin = 0;
			this.inputbox.SelEnd = this.inputbox.text.length;
			this.inputbox.text_selected = this.inputbox.text;
			this.inputbox.select = true;
			this.repaint();
			break;
		case (idx == 101):
			var total = plman.PlaylistCount;
			plman.CreateAutoPlaylist(total, "", "enter your query here", "", 0);
			plman.MovePlaylist(total, pl_idx);
			plman.ActivePlaylist = pl_idx;
			plman.ShowAutoPlaylistUI(pl_idx);
			// set rename it
			var rh = ppt.rowHeight - 10;
			var tw = this.w - rh - 10;
			this.inputbox = new oInputbox(tw, rh, plman.GetPlaylistName(pl_idx), "", g_color_normal_txt, g_color_normal_bg, RGB(0, 0, 0), g_color_selected_bg & 0xd0ffffff, "renamePlaylist()", "brw");
			this.inputbox.setSize(tw, rh, g_fsize); // set font_size
			this.inputboxID = id;
			// activate inputbox for edit
			this.inputbox.on_focus(true);
			this.inputbox.edit = true;
			this.inputbox.Cpos = this.inputbox.text.length;
			this.inputbox.anchor = this.inputbox.Cpos;
			this.inputbox.SelBegin = this.inputbox.Cpos;
			this.inputbox.SelEnd = this.inputbox.Cpos;
			if (!cInputbox.timer_cursor) {
				this.inputbox.resetCursorTimer();
			};
			this.inputbox.dblclk = true;
			this.inputbox.SelBegin = 0;
			this.inputbox.SelEnd = this.inputbox.text.length;
			this.inputbox.text_selected = this.inputbox.text;
			this.inputbox.select = true;
			this.repaint();
			break;
		case (idx == 2):
			fb.LoadPlaylist();
			break;
		case (idx == 3):
			// set rename it
			var rh = ppt.rowHeight - 10;
			var tw = this.w - rh - 10;
			this.inputbox = new oInputbox(tw, rh, plman.GetPlaylistName(pl_idx), "", g_color_normal_txt, g_color_normal_bg, RGB(0, 0, 0), g_color_selected_bg & 0xd0ffffff, "renamePlaylist()", "brw");
			this.inputbox.setSize(tw, rh, g_fsize); // set font_size
			this.inputboxID = id;
			// activate inputbox for edit
			this.inputbox.on_focus(true);
			this.inputbox.edit = true;
			this.inputbox.Cpos = this.inputbox.text.length;
			this.inputbox.anchor = this.inputbox.Cpos;
			this.inputbox.SelBegin = this.inputbox.Cpos;
			this.inputbox.SelEnd = this.inputbox.Cpos;
			if (!cInputbox.timer_cursor) {
				this.inputbox.resetCursorTimer();
			};
			this.inputbox.dblclk = true;
			this.inputbox.SelBegin = 0;
			this.inputbox.SelEnd = this.inputbox.text.length;
			this.inputbox.text_selected = this.inputbox.text;
			this.inputbox.select = true;
			this.repaint();
			break;
		case (idx == 5):
			plman.DuplicatePlaylist(pl_idx, "Copy of " + plman.GetPlaylistName(pl_idx));
			plman.ActivePlaylist = pl_idx + 1;
			break;
		case (idx == 6):
			plman.ShowAutoPlaylistUI(pl_idx);
			break;
		case (idx == 7):
			plman.DuplicatePlaylist(pl_idx, plman.GetPlaylistName(pl_idx));
			plman.RemovePlaylist(pl_idx);
			plman.ActivePlaylist = pl_idx;
			break;
		case (idx == 8):
			plman.RemovePlaylistSwitch(pl_idx);
			break;
		case (idx == 200):
			var total = plman.PlaylistCount;
			//p.playlistManager.inputboxID = -1;
			plman.CreateAutoPlaylist(total, "Media Library", "ALL", "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
			plman.MovePlaylist(total, pl_idx);
			plman.ActivePlaylist = pl_idx;
			break;
		case (idx == 205):
			var total = plman.PlaylistCount;
			//p.playlistManager.inputboxID = -1;
			plman.CreateAutoPlaylist(total, "Tracks never played", "%play_counter% MISSING", "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
			plman.MovePlaylist(total, pl_idx);
			plman.ActivePlaylist = pl_idx;
			break;
		case (idx == 206):
			var total = plman.PlaylistCount;
			//p.playlistManager.inputboxID = -1;
			plman.CreateAutoPlaylist(total, "Tracks played in the last 5 days", "%last_played% DURING LAST 5 DAYS", "%last_played%", 0);
			plman.MovePlaylist(total, pl_idx);
			plman.ActivePlaylist = pl_idx;
			break;
		case (idx == 210):
			var total = plman.PlaylistCount;
			//p.playlistManager.inputboxID = -1;
			plman.CreateAutoPlaylist(total, "Tracks unrated", "%rating% MISSING", "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
			plman.MovePlaylist(total, pl_idx);
			plman.ActivePlaylist = pl_idx;
			break;
		case (idx == 211):
			var total = plman.PlaylistCount;
			//brw.inputboxID = -1;
			plman.CreateAutoPlaylist(total, "Tracks rated 1", "%rating% IS 1", "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
			plman.MovePlaylist(total, pl_idx);
			plman.ActivePlaylist = pl_idx;
			break;
		case (idx == 212):
			var total = plman.PlaylistCount;
			//p.playlistManager.inputboxID = -1;
			plman.CreateAutoPlaylist(total, "Tracks rated 2", "%rating% IS 2", "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
			plman.MovePlaylist(total, pl_idx);
			plman.ActivePlaylist = pl_idx;
			break;
		case (idx == 213):
			var total = plman.PlaylistCount;
			//p.playlistManager.inputboxID = -1;
			plman.CreateAutoPlaylist(total, "Tracks rated 3", "%rating% IS 3", "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
			plman.MovePlaylist(total, pl_idx);
			plman.ActivePlaylist = pl_idx;
			break;
		case (idx == 214):
			var total = plman.PlaylistCount;
			//p.playlistManager.inputboxID = -1;
			plman.CreateAutoPlaylist(total, "Tracks rated 4", "%rating% IS 4", "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
			plman.MovePlaylist(total, pl_idx);
			plman.ActivePlaylist = pl_idx;
			break;
		case (idx == 215):
			var total = plman.PlaylistCount;
			//p.playlistManager.inputboxID = -1;
			plman.CreateAutoPlaylist(total, "Tracks rated 5", "%rating% IS 5", "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
			plman.MovePlaylist(total, pl_idx);
			plman.ActivePlaylist = pl_idx;
			break;
		case (idx == 250):
			var total = plman.PlaylistCount;
			//p.playlistManager.inputboxID = -1;
			plman.CreateAutoPlaylist(total, "Loved Tracks", "%mood% GREATER 0", "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
			plman.MovePlaylist(total, pl_idx);
			plman.ActivePlaylist = pl_idx;
			break;
		};
		brw.repaint();
		return true;
	};

	this.settings_context_menu = function (x, y) {
		var _menu = window.CreatePopupMenu();
		var _menu1 = window.CreatePopupMenu();
		var _menu2 = window.CreatePopupMenu();
		var _menu3 = window.CreatePopupMenu();
		var idx;

		_menu.AppendMenuItem(MF_STRING, 910, "Header Bar");
		_menu.CheckMenuItem(910, ppt.showHeaderBar);

		_menu2.AppendMenuItem(MF_STRING, 200, "Enable");
		_menu2.CheckMenuItem(200, ppt.showwallpaper);
		_menu2.AppendMenuItem(MF_STRING, 220, "Blur");
		_menu2.CheckMenuItem(220, ppt.wallpaperblurred);
		_menu2.AppendMenuSeparator();
		_menu2.AppendMenuItem(MF_STRING, 210, "Playing Album Cover");
		_menu2.AppendMenuItem(MF_STRING, 211, "Default");
		_menu2.CheckMenuRadioItem(210, 211, ppt.wallpapermode + 210);

		_menu2.AppendTo(_menu, MF_STRING, "Background Wallpaper");

		_menu.AppendMenuSeparator();
		_menu.AppendMenuItem(MF_STRING, 991, "Panel Properties");
		_menu.AppendMenuItem(MF_STRING, 992, "Configure...");

		idx = _menu.TrackPopupMenu(x, y);

		switch (true) {
		case (idx == 200):
			ppt.showwallpaper = !ppt.showwallpaper;
			window.SetProperty("_DISPLAY: Show Wallpaper", ppt.showwallpaper);
			g_wallpaperImg = setWallpaperImg();
			brw.repaint();
			break;
		case (idx == 210):
		case (idx == 211):
			ppt.wallpapermode = idx - 210;
			window.SetProperty("_SYSTEM: Wallpaper Mode", ppt.wallpapermode);
			g_wallpaperImg = setWallpaperImg();
			brw.repaint();
			break;
		case (idx == 220):
			ppt.wallpaperblurred = !ppt.wallpaperblurred;
			window.SetProperty("_DISPLAY: Wallpaper Blurred", ppt.wallpaperblurred);
			g_wallpaperImg = setWallpaperImg();
			brw.repaint();
			break;
		case (idx == 910):
			ppt.showHeaderBar = !ppt.showHeaderBar;
			window.SetProperty("_DISPLAY: Show Top Bar", ppt.showHeaderBar);
			get_metrics();
			brw.repaint();
			break;
		case (idx == 991):
			window.ShowProperties();
			break;
		case (idx == 992):
			window.ShowConfigure();
			break;
		};
		return true;
	};
};

/*
===================================================================================================
Main
===================================================================================================
 */

var brw = null;
var isScrolling = false;
var g_zoom_percent = 100;

var g_filterbox = null;
var filter_text = "";

var g_instancetype = window.InstanceType;

// fonts
var g_font = null;
var g_font_headers = null;
var g_font_group1 = null;
var g_font_group2 = null;
var g_font_rating = null;
var g_font_mood = null;
var g_font_guifx_found = utils.CheckFont("guifx v2 transports");
var g_font_wingdings2_found = utils.CheckFont("wingdings 2");

// drag'n drop from windows system
var g_dragndrop_status = false;
var g_dragndrop_targetPlaylistId = -1;
//
var ww = 0, wh = 0;
var g_metadb = null;
clipboard = {
	selection: null
};

var m_x = 0, m_y = 0;
var g_active_playlist = null;
var g_focus_id = -1;
var g_focus_id_prev = -1;
var g_focus_row = 0;
var g_focus_album_id = -1;
var g_populate_opt = 1;
// color vars
var g_color_normal_bg = 0;
var g_color_selected_bg = 0;
var g_color_normal_txt = 0;
var g_color_selected_txt = 0;
var g_color_highlight = 0;
var g_syscolor_window_bg = 0;
var g_syscolor_highlight = 0;
var g_syscolor_button_bg = 0;
var g_syscolor_button_txt = 0;
// boolean to avoid callbacks
var g_avoid_on_playlists_changed = false;
var g_avoid_on_item_focus_change = false;
var g_avoid_on_playlist_items_added = false;
var g_avoid_on_playlist_items_removed = false;
var g_avoid_on_playlist_items_removed_callbacks_on_sendItemToPlaylist = false;
var g_avoid_on_playlist_items_reordered = false;
//
var g_first_populate_done = false;
var g_first_populate_launched = false;
//
var scroll_ = 0, scroll = 0, scroll_prev = 0;
var g_start_ = 0, g_end_ = 0;
var g_wallpaperImg = null;

function on_init() {
	window.DlgCode = DLGC_WANTALLKEYS;

	get_font();
	get_colors();
	get_metrics();

	g_active_playlist = plman.ActivePlaylist;

	brw = new oBrowser("brw");

	g_filterbox = new oFilterBox();
	g_filterbox.inputbox.visible = true;
};
on_init();

// START
function on_size() {
	window.DlgCode = DLGC_WANTALLKEYS;

	ww = window.Width;
	wh = window.Height;
	if (!ww || !wh) return;

	g_wallpaperImg = setWallpaperImg();

	get_images();

	// set Size of browser
	if (cScrollBar.enabled) {
		brw.setSize(0, (ppt.showHeaderBar ? ppt.headerBarHeight : 0), ww - cScrollBar.width, wh - (ppt.showHeaderBar ? ppt.headerBarHeight : 0));
	} else {
		brw.setSize(0, (ppt.showHeaderBar ? ppt.headerBarHeight : 0), ww, wh - (ppt.showHeaderBar ? ppt.headerBarHeight : 0));
	};
};

function on_paint(gr) {
	if (!ww)
		return;

	//gr.FillSolidRect(0, 0, ww, wh, RGBA(210,210,215,255));
	// draw background under playlist
	if (fb.IsPlaying && g_wallpaperImg && ppt.showwallpaper) {
		gr.GdiDrawBitmap(g_wallpaperImg, 0, 0, ww, wh, 0, 0, g_wallpaperImg.Width, g_wallpaperImg.Height);
		gr.FillSolidRect(0, 0, ww, wh, g_color_normal_bg & RGBA(255, 255, 255, ppt.wallpaperalpha));
	} else {
		//gr.FillSolidRect(0, 0, ww, wh, g_color_normal_bg);
		if (g_wallpaperImg && ppt.showwallpaper) {
			gr.GdiDrawBitmap(g_wallpaperImg, 0, 0, ww, wh, 0, 0, g_wallpaperImg.Width, g_wallpaperImg.Height);
			gr.FillSolidRect(0, 0, ww, wh, g_color_normal_bg & RGBA(255, 255, 255, ppt.wallpaperalpha));
		} else {
			gr.FillSolidRect(0, 0, ww, wh, g_color_normal_bg);
		};
	};

	brw && brw.draw(gr);

	if (ppt.showHeaderBar) {
		// inputBox
		if (ppt.showFilterBox && g_filterbox) {
			if (g_filterbox.inputbox.visible) {
				g_filterbox.draw(gr, cFilterBox.x, cFilterBox.y);
			};
		};
	};
};

function on_mouse_lbtn_down(x, y) {
	// stop inertia
	if (cTouch.timer) {
		window.ClearInterval(cTouch.timer);
		cTouch.timer = false;
		// stop scrolling but not abrupt, add a little offset for the stop
		if (Math.abs(scroll - scroll_) > ppt.rowHeight) {
			scroll = (scroll > scroll_ ? scroll_ + ppt.rowHeight : scroll_ - ppt.rowHeight);
			scroll = check_scroll(scroll);
		};
	};

	var is_scroll_enabled = brw.rowsCount > brw.totalRowsVis;
	if (ppt.enableTouchControl && is_scroll_enabled) {
		if (brw._isHover(x, y) && !brw.scrollbar._isHover(x, y)) {
			if (!timers.mouseDown) {
				cTouch.y_prev = y;
				cTouch.y_start = y;
				if (cTouch.t1) {
					cTouch.t1.Reset();
				} else {
					cTouch.t1 = fb.CreateProfiler("t1");
				};
				timers.mouseDown = window.SetTimeout(function () {
						window.ClearTimeout(timers.mouseDown);
						timers.mouseDown = false;
						if (Math.abs(cTouch.y_start - m_y) > 015) {
							cTouch.down = true;
						} else {
							brw.on_mouse("down", x, y);
						};
					}, 50);
			};
		} else {
			brw.on_mouse("down", x, y);
		};
	} else {
		brw.on_mouse("down", x, y);
	};

	// inputBox
	if (ppt.showHeaderBar && ppt.showFilterBox && g_filterbox.inputbox.visible) {
		g_filterbox.on_mouse("lbtn_down", x, y);
	};
};

function on_mouse_lbtn_up(x, y) {

	// inputBox
	if (ppt.showHeaderBar && ppt.showFilterBox && g_filterbox.inputbox.visible) {
		g_filterbox.on_mouse("lbtn_up", x, y);
	};

	brw.on_mouse("up", x, y);

	if (timers.mouseDown) {
		window.ClearTimeout(timers.mouseDown);
		timers.mouseDown = false;
		if (Math.abs(cTouch.y_start - m_y) <= 030) {
			brw.on_mouse("down", x, y);
		};
	};

	// create scroll inertia on mouse lbtn up
	if (cTouch.down) {
		cTouch.down = false;
		cTouch.y_end = y;
		cTouch.scroll_delta = scroll - scroll_;
		//cTouch.y_delta = cTouch.y_start - cTouch.y_end;
		if (Math.abs(cTouch.scroll_delta) > 030) {
			cTouch.multiplier = ((1000 - cTouch.t1.Time) / 20);
			cTouch.delta = Math.round((cTouch.scroll_delta) / 030);
			if (cTouch.multiplier < 1)
				cTouch.multiplier = 1;
			if (cTouch.timer)
				window.ClearInterval(cTouch.timer);
			cTouch.timer = window.SetInterval(function () {
					scroll += cTouch.delta * cTouch.multiplier;
					scroll = check_scroll(scroll);
					cTouch.multiplier = cTouch.multiplier - 1;
					cTouch.delta = cTouch.delta - (cTouch.delta / 10);
					if (cTouch.multiplier < 1) {
						window.ClearInterval(cTouch.timer);
						cTouch.timer = false;
					};
				}, 75);
		};
	};
};

function on_mouse_lbtn_dblclk(x, y, mask) {
	if (y >= brw.y) {
		brw.on_mouse("dblclk", x, y);
	} else if (x > brw.x && x < brw.x + brw.w) {
		brw.showActivePlaylist();
	} else {
		brw.on_mouse("dblclk", x, y);
	};
};

function on_mouse_rbtn_up(x, y) {
	// inputBox
	if (ppt.showHeaderBar && ppt.showFilterBox && g_filterbox.inputbox.visible) {
		g_filterbox.on_mouse("rbtn_up", x, y);
	};

	brw.on_mouse("right", x, y);
	return true;
};

function on_mouse_move(x, y) {

	if (m_x == x && m_y == y)
		return;

	// inputBox
	if (!cPlaylistManager.drag_moved) {
		if (ppt.showHeaderBar && ppt.showFilterBox && g_filterbox.inputbox.visible) {
			g_filterbox.on_mouse("move", x, y);
		};
	};

	if (cTouch.down) {
		cTouch.y_current = y;
		cTouch.y_move = (cTouch.y_current - cTouch.y_prev);
		if (x < brw.w) {
			scroll -= cTouch.y_move;
			cTouch.scroll_delta = scroll - scroll_;
			if (Math.abs(cTouch.scroll_delta) < 030)
				cTouch.y_start = cTouch.y_current;
			cTouch.y_prev = cTouch.y_current;
		};
	} else {
		brw.on_mouse("move", x, y);
	};

	m_x = x;
	m_y = y;
};

function on_mouse_wheel(step) {

	if (cTouch.timer) {
		window.ClearInterval(cTouch.timer);
		cTouch.timer = false;
	};

	if (utils.IsKeyPressed(VK_CONTROL)) {
		var zoomStep = 1;
		var previous = ppt.extra_font_size;
		if (!timers.mouseWheel) {
			if (step > 0) {
				ppt.extra_font_size += zoomStep;
				if (ppt.extra_font_size > 10)
					ppt.extra_font_size = 10;
			} else {
				ppt.extra_font_size -= zoomStep;
				if (ppt.extra_font_size < 0)
					ppt.extra_font_size = 0;
			};
			if (previous != ppt.extra_font_size) {
				timers.mouseWheel = window.SetTimeout(function () {
						window.SetProperty("_SYSTEM: Extra font size value", ppt.extra_font_size);
						get_font();
						get_metrics();
						get_images();
						brw.repaint();
						timers.mouseWheel && window.ClearTimeout(timers.mouseWheel);
						timers.mouseWheel = false;
					}, 100);
			};
		};
	} else {
		var rowStep = ppt.rowScrollStep;
		scroll -= step * ppt.rowHeight * rowStep;
		scroll = check_scroll(scroll);
		brw.on_mouse("wheel", m_x, m_y, step);
	};

};

function on_mouse_leave() {
	// inputBox
	if (ppt.showHeaderBar && ppt.showFilterBox && g_filterbox.inputbox.visible) {
		g_filterbox.on_mouse("leave", 0, 0);
	};
	brw.on_mouse("leave", 0, 0);
};

//=================================================// Metrics & Fonts & Colors & Images
function get_metrics() {
	if (ppt.showHeaderBar) {
		ppt.headerBarHeight = Math.round(ppt.defaultHeaderBarHeight * g_zoom_percent / 100);
		ppt.headerBarHeight = Math.floor(ppt.headerBarHeight / 2) != ppt.headerBarHeight / 2 ? ppt.headerBarHeight : ppt.headerBarHeight - 1;
	} else {
		ppt.headerBarHeight = 0;
	};
	var _defaultRowHeight = ppt.defaultRowHeight;
	ppt.rowHeight = Math.round(_defaultRowHeight * g_zoom_percent / 100);
	cScrollBar.width = Math.floor(cScrollBar.defaultWidth * g_zoom_percent / 100);
	cScrollBar.minCursorHeight = Math.round(cScrollBar.defaultMinCursorHeight * g_zoom_percent / 100);

	cFilterBox.w = Math.floor(cFilterBox.default_w * g_zoom_percent / 100);
	cFilterBox.h = Math.round(cFilterBox.default_h * g_zoom_percent / 100);

	if (brw) {
		if (cScrollBar.enabled) {
			brw.setSize(0, (ppt.showHeaderBar ? ppt.headerBarHeight : 0), ww - cScrollBar.width, wh - (ppt.showHeaderBar ? ppt.headerBarHeight : 0));
		} else {
			brw.setSize(0, (ppt.showHeaderBar ? ppt.headerBarHeight : 0), ww, wh - (ppt.showHeaderBar ? ppt.headerBarHeight : 0));
		};
		if (brw.rowsCount > 0)
			brw.getlimits();
	};
};

function get_images() {
	var gb;

	// normal playlist icon
	images.icon_normal_pl = gdi.CreateImage(48, 48);
	gb = images.icon_normal_pl.GetGraphics();
	gb.FillSolidRect(10, 10, 28, 4, g_color_normal_txt);
	gb.FillSolidRect(10, 18, 28, 4, g_color_normal_txt);
	gb.FillSolidRect(10, 26, 28, 4, g_color_normal_txt);
	gb.FillSolidRect(10, 34, 28, 4, g_color_normal_txt);
	images.icon_normal_pl.ReleaseGraphics(gb);

	images.icon_normal_pl_sel = gdi.CreateImage(48, 48);
	gb = images.icon_normal_pl_sel.GetGraphics();
	gb.FillSolidRect(10, 10, 28, 4, (ppt.enableCustomColors ? g_color_selected_txt : g_color_normal_bg));
	gb.FillSolidRect(10, 18, 28, 4, (ppt.enableCustomColors ? g_color_selected_txt : g_color_normal_bg));
	gb.FillSolidRect(10, 26, 28, 4, (ppt.enableCustomColors ? g_color_selected_txt : g_color_normal_bg));
	gb.FillSolidRect(10, 34, 28, 4, (ppt.enableCustomColors ? g_color_selected_txt : g_color_normal_bg));
	images.icon_normal_pl_sel.ReleaseGraphics(gb);

	images.icon_normal_pl_playing = gdi.CreateImage(48, 48);
	gb = images.icon_normal_pl_playing.GetGraphics();
	gb.FillSolidRect(10, 10, 28, 4, g_color_normal_txt);
	gb.FillSolidRect(10, 18, 28, 4, g_color_normal_txt);
	gb.FillSolidRect(26, 26, 12, 4, g_color_normal_txt);
	gb.FillSolidRect(26, 34, 12, 4, g_color_normal_txt);
	var points = new Array(10, 24, 24, 31, 10, 38);
	gb.FillPolygon(g_color_normal_txt, 0, points);
	images.icon_normal_pl_playing.ReleaseGraphics(gb);

	images.icon_normal_pl_playing_sel = gdi.CreateImage(48, 48);
	gb = images.icon_normal_pl_playing_sel.GetGraphics();
	gb.FillSolidRect(10, 10, 28, 4, (ppt.enableCustomColors ? g_color_selected_txt : g_color_normal_bg));
	gb.FillSolidRect(10, 18, 28, 4, (ppt.enableCustomColors ? g_color_selected_txt : g_color_normal_bg));
	gb.FillSolidRect(26, 26, 12, 4, (ppt.enableCustomColors ? g_color_selected_txt : g_color_normal_bg));
	gb.FillSolidRect(26, 34, 12, 4, (ppt.enableCustomColors ? g_color_selected_txt : g_color_normal_bg));
	var points = new Array(10, 24, 24, 31, 10, 38);
	gb.FillPolygon((ppt.enableCustomColors ? g_color_selected_txt : g_color_normal_bg), 0, points);
	images.icon_normal_pl_playing_sel.ReleaseGraphics(gb);

	// autoplaylist icon
	images.icon_auto_pl = gdi.CreateImage(48, 48);
	gb = images.icon_auto_pl.GetGraphics();
	gb.FillSolidRect(10, 10, 7, 4, g_color_normal_txt);
	gb.FillSolidRect(10, 18, 14, 4, g_color_normal_txt);
	gb.FillSolidRect(10, 26, 21, 4, g_color_normal_txt);
	gb.FillSolidRect(10, 34, 28, 4, g_color_normal_txt);
	images.icon_auto_pl.ReleaseGraphics(gb);

	images.icon_auto_pl_sel = gdi.CreateImage(48, 48);
	gb = images.icon_auto_pl_sel.GetGraphics();
	gb.FillSolidRect(10, 10, 7, 4, (ppt.enableCustomColors ? g_color_selected_txt : g_color_normal_bg));
	gb.FillSolidRect(10, 18, 14, 4, (ppt.enableCustomColors ? g_color_selected_txt : g_color_normal_bg));
	gb.FillSolidRect(10, 26, 21, 4, (ppt.enableCustomColors ? g_color_selected_txt : g_color_normal_bg));
	gb.FillSolidRect(10, 34, 28, 4, (ppt.enableCustomColors ? g_color_selected_txt : g_color_normal_bg));
	images.icon_auto_pl_sel.ReleaseGraphics(gb);

	images.icon_auto_pl_playing = gdi.CreateImage(48, 48);
	gb = images.icon_auto_pl_playing.GetGraphics();
	gb.FillSolidRect(10, 10, 7, 4, g_color_normal_txt);
	gb.FillSolidRect(10, 18, 14, 4, g_color_normal_txt);
	gb.FillSolidRect(26, 26, 5, 4, g_color_normal_txt);
	gb.FillSolidRect(26, 34, 12, 4, g_color_normal_txt);
	var points = new Array(10, 24, 24, 31, 10, 38);
	gb.FillPolygon(g_color_normal_txt, 0, points);
	images.icon_auto_pl_playing.ReleaseGraphics(gb);

	images.icon_auto_pl_playing_sel = gdi.CreateImage(48, 48);
	gb = images.icon_auto_pl_playing_sel.GetGraphics();
	gb.FillSolidRect(10, 10, 7, 4, (ppt.enableCustomColors ? g_color_selected_txt : g_color_normal_bg));
	gb.FillSolidRect(10, 18, 14, 4, (ppt.enableCustomColors ? g_color_selected_txt : g_color_normal_bg));
	gb.FillSolidRect(26, 26, 5, 4, (ppt.enableCustomColors ? g_color_selected_txt : g_color_normal_bg));
	gb.FillSolidRect(26, 34, 12, 4, (ppt.enableCustomColors ? g_color_selected_txt : g_color_normal_bg));
	var points = new Array(10, 24, 24, 31, 10, 38);
	gb.FillPolygon((ppt.enableCustomColors ? g_color_selected_txt : g_color_normal_bg), 0, points);
	images.icon_auto_pl_playing_sel.ReleaseGraphics(gb);
};

function get_font() {
	var font_error = false;
	var default_font = null;

	if (g_instancetype == 0) {
		default_font = window.GetFontCUI(FontTypeCUI.items);
		g_font_headers = window.GetFontCUI(FontTypeCUI.labels);
	} else if (g_instancetype == 1) {
		default_font = window.GetFontDUI(FontTypeDUI.playlists);
		g_font_headers = window.GetFontDUI(FontTypeDUI.tabs);
	};

	try {
		g_fname = default_font.Name;
		g_fsize = default_font.Size;
		g_fstyle = default_font.Style;
	} catch (e) {
		console.log("Spider Monkey Panel Error: Unable to use the default font. Using Arial font instead.");
		g_fname = "arial";
		g_fsize = 12;
		g_fstyle = 0;
		font_error = true;
	};

	// adjust font size if extra zoom activated
	g_fsize += ppt.extra_font_size;
	g_font = gdi.Font(g_fname, g_fsize, 0);
	g_font_bold = gdi.Font(g_fname, g_fsize, 1);
	g_font_box = gdi.Font(g_fname, g_fsize - 2, 1);

	g_zoom_percent = Math.floor(g_fsize / 12 * 100);

	g_font_group1 = gdi.Font(g_fname, (g_fsize * 160 / 100), 1);
	g_font_group2 = gdi.Font(g_fname, (g_fsize * 140 / 100), 0);

	g_font_guifx_found = false;
	//g_font_wingdings2_found = false;

	if (g_font_guifx_found) {
		g_font_rating = gdi.Font("guifx v2 transports", Math.round(g_fsize * 140 / 100), 0);
		g_font_mood = gdi.Font("guifx v2 transports", Math.round(g_fsize * 130 / 100), 0);
	} else if (g_font_wingdings2_found) {
		g_font_rating = gdi.Font("wingdings 2", Math.round(g_fsize * 140 / 100), 0);
		g_font_mood = gdi.Font("wingdings 2", Math.round(g_fsize * 200 / 100), 0);
	} else {
		g_font_rating = gdi.Font("arial", Math.round(g_fsize * 200 / 100), 0);
		g_font_mood = gdi.Font("arial", Math.round(g_fsize * 140 / 100), 0);
	};
};

function get_colors() {
	var arr;
	// get some system colors
	g_syscolor_window_bg = utils.GetSysColour(COLOR_WINDOW);
	g_syscolor_highlight = utils.GetSysColour(COLOR_HIGHLIGHT);
	g_syscolor_button_bg = utils.GetSysColour(COLOR_BTNFACE);
	g_syscolor_button_txt = utils.GetSysColour(COLOR_BTNTEXT);

	arr = window.GetProperty("CUSTOM COLOR TEXT NORMAL", "180-180-180").split("-");
	g_color_normal_txt = RGB(arr[0], arr[1], arr[2]);
	arr = window.GetProperty("CUSTOM COLOR TEXT SELECTED", "000-000-000").split("-");
	g_color_selected_txt = RGB(arr[0], arr[1], arr[2]);
	arr = window.GetProperty("CUSTOM COLOR BACKGROUND NORMAL", "025-025-035").split("-");
	g_color_normal_bg = RGB(arr[0], arr[1], arr[2]);
	arr = window.GetProperty("CUSTOM COLOR BACKGROUND SELECTED", "015-177-255").split("-");
	g_color_selected_bg = RGB(arr[0], arr[1], arr[2]);
	arr = window.GetProperty("CUSTOM COLOR HIGHLIGHT", "255-175-050").split("-");
	g_color_highlight = RGB(arr[0], arr[1], arr[2]);

	// get custom colors from window ppt first
	if (!ppt.enableCustomColors) {
		// get UI colors set in UI Preferences if no custom color set
		if (g_instancetype == 0) {
			g_color_normal_txt = window.GetColourCUI(ColorTypeCUI.text);
			g_color_selected_txt = window.GetColourCUI(ColorTypeCUI.selection_text);
			g_color_normal_bg = window.GetColourCUI(ColorTypeCUI.background);
			g_color_selected_bg = window.GetColourCUI(ColorTypeCUI.selection_background);
			g_color_highlight = window.GetColourCUI(ColorTypeCUI.active_item_frame);
		} else if (g_instancetype == 1) {
			g_color_normal_txt = window.GetColourDUI(ColorTypeDUI.text);
			g_color_selected_txt = window.GetColourDUI(ColorTypeDUI.selection);
			g_color_normal_bg = window.GetColourDUI(ColorTypeDUI.background);
			g_color_selected_bg = g_color_selected_txt;
			g_color_highlight = window.GetColourDUI(ColorTypeDUI.highlight);
		};
	};
};

function on_font_changed() {
	get_font();
	get_metrics();
	brw.repaint();
};

function on_colours_changed() {
	get_colors();
	get_images();
	if (brw)
		brw.scrollbar.setNewColors();
	g_filterbox.getImages();
	g_filterbox.reset_colors();
	brw.repaint();
};

function on_script_unload() {
	brw.g_time && window.ClearInterval(brw.g_time);
	brw.g_time = false;
};

//=================================================// Keyboard Callbacks
function on_key_up(vkey) {
	if (cSettings.visible) {} else {
		// inputBox
		if (ppt.showFilterBox && g_filterbox.inputbox.visible) {
			g_filterbox.on_key("up", vkey);
		};

		// scroll keys up and down RESET (step and timers)
		brw.keypressed = false;
		cScrollBar.timerCounter = -1;
		cScrollBar.timerID && window.ClearTimeout(cScrollBar.timerID);
		cScrollBar.timerID = false;
		if (vkey == VK_SHIFT) {
			brw.SHIFT_start_id = null;
			brw.SHIFT_count = 0;
		};
	};
	brw.repaint();
};

function on_key_down(vkey) {
	var mask = GetKeyboardMask();

	if (cSettings.visible) {} else {
		if (brw.inputboxID >= 0) {
			if (mask == KMask.none) {
				switch (vkey) {
				case VK_ESCAPE:
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
			if (ppt.showFilterBox && g_filterbox.inputbox.visible && g_filterbox.inputbox.edit) {
				g_filterbox.on_key("down", vkey);
			};

			var act_pls = g_active_playlist;

			if (mask == KMask.none) {
				switch (vkey) {
				case VK_F2:
					// set rename it
					var rowId = brw.selectedRow;
					if (rowId > -1) {
						var rh = ppt.rowHeight - 10;
						var tw = brw.w - rh - 10;
						brw.inputbox = new oInputbox(tw, rh, plman.GetPlaylistName(brw.rows[rowId].idx), "", g_color_normal_txt, g_color_normal_bg, RGB(0, 0, 0), g_color_selected_bg & 0xd0ffffff, "renamePlaylist()", "brw");
						brw.inputbox.setSize(tw, rh, g_fsize); // set font_size
						brw.inputboxID = rowId;
						// activate inputbox for edit
						brw.inputbox.on_focus(true);
						brw.inputbox.edit = true;
						brw.inputbox.Cpos = brw.inputbox.text.length;
						brw.inputbox.anchor = brw.inputbox.Cpos;
						brw.inputbox.SelBegin = brw.inputbox.Cpos;
						brw.inputbox.SelEnd = brw.inputbox.Cpos;
						if (!cInputbox.timer_cursor) {
							brw.inputbox.resetCursorTimer();
						};
						brw.inputbox.dblclk = true;
						brw.inputbox.SelBegin = 0;
						brw.inputbox.SelEnd = brw.inputbox.text.length;
						brw.inputbox.text_selected = brw.inputbox.text;
						brw.inputbox.select = true;
						brw.repaint();
					};
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
				case 222:
					brw.inputboxID = -1;
					break;
				case VK_UP:
					if (brw.rowsCount > 0) {
						if (g_filterbox.inputbox && g_filterbox.inputbox.edit)
							return;
						var rowId = brw.selectedRow;
						if (rowId > 0) {
							if (brw.inputboxID > -1)
								brw.inputboxID = -1;
							brw.repaint();
							brw.selectedRow--;
							if (brw.selectedRow < 0)
								brw.selectedRow = 0;
							brw.showSelectedPlaylist();
							brw.repaint();
						};
					};
					break;
				case VK_DOWN:
					if (brw.rowsCount > 0) {
						if (g_filterbox.inputbox && g_filterbox.inputbox.edit)
							return;
						var rowId = brw.selectedRow;
						if (rowId < brw.rowsCount - 1) {
							if (brw.inputboxID > -1)
								brw.inputboxID = -1;
							brw.repaint();
							brw.selectedRow++;
							if (brw.selectedRow > brw.rowsCount - 1)
								brw.selectedRow = brw.rowsCount - 1;
							brw.showSelectedPlaylist();
							brw.repaint();
						};
					};
					break;
				case VK_PGUP:
					break;
				case VK_PGDN:
					break;
				case VK_RETURN:
					if (brw.rowsCount > 0) {
						if (g_filterbox.inputbox && g_filterbox.inputbox.edit)
							return;
						brw.repaint();
						plman.ActivePlaylist = brw.selectedRow;
						cPlaylistManager.playlist_switch_pending = true;
						window.SetCursor(IDC_WAIT);
					};
					break;
				case VK_END:
					if (brw.rowsCount > 0) {
						if (g_filterbox.inputbox && g_filterbox.inputbox.edit)
							return;
						if (brw.inputboxID > -1)
							brw.inputboxID = -1;
						brw.repaint();
						brw.selectedRow = brw.rowsCount - 1;
						brw.showSelectedPlaylist();
					};
					break;
				case VK_HOME:
					if (brw.rowsCount > 0) {
						if (g_filterbox.inputbox && g_filterbox.inputbox.edit)
							return;
						if (brw.inputboxID > -1)
							brw.inputboxID = -1;
						brw.repaint();
						brw.selectedRow = 0;
						brw.showSelectedPlaylist();
					};
					break;
				case VK_DELETE:
					plman.RemovePlaylistSwitch(brw.selectedRow);
					break;
				};
			} else {
				switch (mask) {
				case KMask.shift:
					switch (vkey) {
					case VK_SHIFT: // SHIFT key alone
						break;
					case VK_UP: // SHIFT + KEY UP
						break;
					case VK_DOWN: // SHIFT + KEY DOWN
						break;
					};
					break;
				case KMask.ctrl:
					if (vkey == 66) { // CTRL+B
						cScrollBar.enabled = !cScrollBar.enabled;
						window.SetProperty("_DISPLAY: Show Scrollbar", cScrollBar.enabled);
						get_metrics();
						brw.repaint();
					};
					if (vkey == 84) { // CTRL+T
						ppt.showHeaderBar = !ppt.showHeaderBar;
						window.SetProperty("_DISPLAY: Show Top Bar", ppt.showHeaderBar);
						get_metrics();
						brw.repaint();
					};
					if (vkey == 48 || vkey == 96) { // CTRL + 0
						var previous = ppt.extra_font_size;
						if (!timers.mouseWheel) {
							ppt.extra_font_size = 0;
							if (previous != ppt.extra_font_size) {
								timers.mouseWheel = window.SetTimeout(function () {
										window.SetProperty("_SYSTEM: Extra font size value", ppt.extra_font_size);
										get_font();
										get_metrics();
										get_images();
										brw.repaint();
										timers.mouseWheel && window.ClearTimeout(timers.mouseWheel);
										timers.mouseWheel = false;
									}, 100);
							};
						};
					};
					break;
				case KMask.alt:
					break;
				};
			};
		};

	};
};

function on_char(code) {
	// rename inputbox
	if (brw.inputboxID >= 0) {
		brw.inputbox.on_char(code);
	} else {
		// filter inputBox
		if (ppt.showFilterBox && g_filterbox.inputbox.visible) {
			g_filterbox.on_char(code);
		};
	};
};

//=================================================// Playback Callbacks
function on_playback_stop(reason) {
	switch (reason) {
	case 0: // user stop
	case 1: // eof (e.g. end of playlist)
		// update wallpaper
		g_wallpaperImg = setWallpaperImg();
		brw.repaint();
		break;
	case 2: // starting_another (only called on user action, i.e. click on next button)
		break;
	};
};

function on_playback_new_track(metadb) {
	g_metadb = metadb;
	g_wallpaperImg = setWallpaperImg();
	brw.repaint();
};

function on_playback_starting(cmd, is_paused) {};

function on_playback_time(time) {};

//=================================================// Playlist Callbacks
function on_playlists_changed() {

	if (cPlaylistManager.drag_droped) {
		window.SetCursor(IDC_ARROW);
	} else {
		if (brw.previous_playlistCount != plman.PlaylistCount)
			g_filterbox.clearInputbox();
	};

	brw.populate(false, false);

	if (brw.selectedRow > brw.rowsCount)
		brw.selectedRow = plman.ActivePlaylist;

	brw.repaint();
	brw.delete_pending = false;
};

function on_playlist_switch() {
	g_active_playlist = plman.ActivePlaylist;
	brw.showActivePlaylist();
	if (brw.selectedRow > brw.rowsCount)
		brw.selectedRow = plman.ActivePlaylist;
	brw.repaint();
};

function on_playlist_items_added() {
	brw.repaint();
};

function on_playlist_items_removed() {
	brw.repaint();
};

function on_focus(is_focused) {
	if (brw.inputboxID >= 0) {
		brw.inputbox.on_focus(is_focused);
	};
	if (!is_focused) {
		brw.inputboxID = -1;
		brw.repaint();
	};
};

function check_scroll(scroll___) {
	if (scroll___ < 0)
		scroll___ = 0;
	var g1 = brw.h - (brw.totalRowsVis * ppt.rowHeight);
	//var scroll_step = Math.ceil(ppt.rowHeight / ppt.scroll_divider);
	//var g2 = Math.floor(g1 / scroll_step) * scroll_step;

	var end_limit = (brw.rowsCount * ppt.rowHeight) - (brw.totalRowsVis * ppt.rowHeight) - g1;
	if (scroll___ != 0 && scroll___ > end_limit) {
		scroll___ = end_limit;
	};
	return scroll___;
};

function g_sendResponse() {

	if (g_filterbox.inputbox.text.length == 0) {
		filter_text = "";
	} else {
		filter_text = g_filterbox.inputbox.text;
	};

	// filter in current panel
	brw.populate(true);
	if (brw.selectedRow < 0 || brw.selectedRow > brw.rowsCount - 1)
		brw.selectedRow = 0;
}

//=================================================// Drag'n'Drop Callbacks
function on_drag_enter() {
	g_dragndrop_status = true;
}

function on_drag_leave() {
	g_dragndrop_status = false;
	g_dragndrop_targetPlaylistId = -1;
	brw.buttonclicked = false;
	cScrollBar.timerID && window.ClearInterval(cScrollBar.timerID);
	cScrollBar.timerID = false;
	brw.repaint();
}

function on_drag_over(action, x, y, mask) {
	if (y < brw.y) {
		action.Effect = 0;
	} else {
		g_dragndrop_targetPlaylistId = -1;
		brw.on_mouse("drag_over", x, y);
		if (g_dragndrop_targetPlaylistId == -1) {
			// blank area, drop to new playlist
			action.Effect = 1;
		} else {
			action.Effect = plman.IsPlaylistLocked(g_dragndrop_targetPlaylistId) ? 0 : 1;
		}
	}
	brw.repaint();
}

function on_drag_drop(action, x, y, mask) {
	if (y < brw.y) {
		action.Effect = 0;
	} else {
		var drop_done = false;
		if (g_dragndrop_targetPlaylistId == -1) {
			// blank area, drop to new playlist
			drop_done = true;
			var total_pl = plman.PlaylistCount;
			plman.CreatePlaylist(total_pl, "Dropped Items");
			action.Playlist = total_pl;
			action.Base = plman.PlaylistItemCount(total_pl);
			action.ToSelect = plman.PlaylistCount == 1; // switch to and set focus if only playlist
			action.Effect = 1;
		} else if (plman.IsPlaylistLocked(g_dragndrop_targetPlaylistId)) {
			// mouse over an existing playlist but can't drop there
			action.Effect = 0;
		} else {
			// drop to an existing playlist
			drop_done = true;
			action.Playlist = g_dragndrop_targetPlaylistId;
			action.Base = plman.PlaylistItemCount(g_dragndrop_targetPlaylistId);
			action.ToSelect = false;
			action.Effect = 1;
		}
		if (drop_done) {
			if (!blink.timer) {
				blink.x = x;
				blink.y = y;
				blink.totaltracks = 1;
				blink.id = brw.activeRow;
				blink.counter = 0;
				blink.timer = window.SetInterval(function () {
					blink.counter++;
					if (blink.counter > 5) {
						blink.timer && window.ClearInterval(blink.timer);
						blink.timer = false;
						blink.counter = -1;
						blink.id = null;
					};
					brw.repaint();
				}, 125);
			}
		}
	}
	g_dragndrop_status = false;
	brw.repaint();
}
