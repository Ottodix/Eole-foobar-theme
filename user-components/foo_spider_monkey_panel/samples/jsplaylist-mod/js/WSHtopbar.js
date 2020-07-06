// *****************************************************************************************************************************************
// TopBar object by Br3tt aka Falstaff (c)2015
// *****************************************************************************************************************************************

oTopBar = function () {
	this.totalDurationText = "";

	this.setSize = function (x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.visible = (h > 0);
		this.setButtons();
		this.txt1Height = cTopBar.txtHeight;
		this.txt2Height = Math.ceil(cTopBar.txtHeight * 70 / 100);
	};

	this.calc_playlist_duration = function () {
		var s = 0;
		if (p.list) {
			for (var i = 0; i < p.list.count; i++) {
				s += p.list.handleList[i].Length;
			};
		};
		return s;
	};

	this.setDatas = function () {
		this.playlist_name = plman.GetPlaylistName(plman.ActivePlaylist);

		// is playlist Filtered for groupBy Patterns
		var found = false;
		var default_pattern_index = -1;
		this.pattern_idx = -1;
		if (properties.enablePlaylistFilter) {
			// get Filtered groupBy pattern
			for (var m = 0; m < p.list.groupby.length; m++) {
				if (default_pattern_index > -1 && found) {
					break;
				} else if (p.list.groupby[m].playlistFilter.length > 0) {
					var arr_pl = p.list.groupby[m].playlistFilter.split(";");
					for (var n = 0; n < arr_pl.length; n++) {
						if (default_pattern_index < 0 && arr_pl[n] == "*") {
							default_pattern_index = m;
							this.pattern_idx = (this.pattern_idx < 0 ? m : this.pattern_idx);
						};
						if (arr_pl[n] == this.playlist_name) {
							found = true;
							this.pattern_idx = m;
						};
					};
				};
			};
		};
		if (found) {
			this.filter_type = 1;
		} else if (default_pattern_index > -1) {
			this.filter_type = 2;
		} else {
			this.filter_type = 0;
		};

		this.playlist_count = plman.PlaylistItemCount(plman.ActivePlaylist);
		if (this.playlist_count > 0) {
			this.playlist_total_seconds = this.calc_playlist_duration();
			if (this.playlist_total_seconds > 0) {
				this.totalDurationText = utils.FormatDuration(this.playlist_total_seconds);
			} else {
				this.totalDurationText = "";
			};
		} else {
			this.playlist_total_seconds = 0;
			this.totalDurationText = "";
		};
	};
	this.setDatas();

	this.setButtons = function () {

		var color_txt = g_color_normal_txt;
		var color_bg = g_color_normal_bg;
		var bt_w = zoom(18, g_dpi);
		var bt_h = zoom(18, g_dpi);

		// normal close Image
		this.close_off = gdi.CreateImage(bt_w, bt_h);
		var gb = this.close_off.GetGraphics();
		gb.SetSmoothingMode(2);
		gb.SetTextRenderingHint(4);
		gb.DrawString(String.fromCharCode(209), gdi_font(g_font_wd2.Name, g_font_wd2.Size - g_z6, 0), blendColors(color_bg, color_txt, 0.75), 0, 0, bt_w, bt_h, cc_stringformat);
		gb.SetSmoothingMode(0);
		this.close_off.ReleaseGraphics(gb);

		// hover close Image
		this.close_ov = gdi.CreateImage(bt_w, bt_h);
		var gb = this.close_ov.GetGraphics();
		gb.SetSmoothingMode(2);
		gb.SetTextRenderingHint(4);
		gb.DrawString(String.fromCharCode(209), gdi_font(g_font_wd2.Name, g_font_wd2.Size - g_z2, 0), color_txt, 0, 0, bt_w, bt_h, cc_stringformat);
		gb.SetSmoothingMode(0);
		this.close_ov.ReleaseGraphics(gb);

		this.button = new button(this.close_off, this.close_ov, this.close_ov);
	};

	this.draw = function (gr) {
		if (this.visible) {
			// bg
			var borderHeight = cHeaderBar.borderWidth;
			var logoW = this.h - ((borderHeight * 4) * 2);
			var logoImg = images.logo.Resize(logoW, logoW, 7);
			// background
			gr.FillSolidRect(this.x, this.y, this.w, this.h - borderHeight, g_color_normal_txt & 0x03ffffff);
			// foobar2000 logo
			gr.SetSmoothingMode(2);
			gr.DrawImage(logoImg, this.x + borderHeight, this.y + (borderHeight * 4), logoW, logoW, 0, 0, logoImg.Width, logoImg.Height, 0, 255);
			gr.SetSmoothingMode(0);
			// playlist name
			gr.SetTextRenderingHint(3);
			var playlist_name_width = gr.CalcTextWidth(this.playlist_name + " ", gdi_font("segoe ui", this.txt1Height, 1));
			gr.DrawString(this.playlist_name, gdi_font("segoe ui", this.txt1Height, 1), g_color_normal_txt, this.x + logoW + borderHeight, this.y + 1 + borderHeight, this.w - logoW - 34, this.txt1Height + 15, lt_stringformat);
			if (this.filter_type > 0) {
				//gr.DrawString("["+p.list.groupby[this.pattern_idx].label+"]", gdi_font("segoe ui", this.txt1Height - g_z6, 0), blendColors(g_color_normal_txt, g_color_normal_bg, 0.5), this.x + logoW + borderHeight + playlist_name_width, this.y + 1 + borderHeight + g_z6, this.w - logoW - 34 - playlist_name_width, this.txt1Height + 15, lt_stringformat);
			}
			// playlist infos
			gr.SetTextRenderingHint(5);
			if (this.totalDurationText.length > 0) {
				gr.DrawString(this.playlist_count > 0 ? (this.playlist_count + (this.playlist_count > 1 ? " tracks. " : " track. ") + this.totalDurationText) : "empty playlist", gdi_font("segoe ui", this.txt2Height, 0), g_color_normal_txt & 0x88ffffff, this.x + logoW + borderHeight, Math.ceil(cTopBar.height / 2) + 1 + borderHeight, this.w - logoW - 15, 32, lt_stringformat);
			} else {
				gr.DrawString(this.playlist_count > 0 ? (this.playlist_count + (this.playlist_count > 1 ? " streams " : " stream ")) : "empty playlist", gdi_font("segoe ui", this.txt2Height, 0), g_color_normal_txt & 0x88ffffff, this.x + logoW + cHeaderBar.borderWidth, Math.ceil(cTopBar.height / 2) + 1 + borderHeight, this.w - logoW - 15, 32, lt_stringformat);
			};
			// draw close button
			this.button.draw(gr, this.x + this.w - zoom(20, g_dpi), this.y + zoom(4, g_dpi), 255);
		};
	};

	this.buttonCheck = function (event, x, y) {
		var state = this.button.checkstate(event, x, y);
		switch (event) {
		case "down":
			if (state == ButtonStates.down) {
				this.buttonClicked = true;
			};
			break;
		case "up":
			if (this.buttonClicked && state == ButtonStates.hover) {
				// action
				cTopBar.visible = false;
				window.SetProperty("SYSTEM.TopBar.Visible", cTopBar.visible);
				resize_panels();
				full_repaint();
			};
			break;
		};
		return state;
	};

	this.check = function (event, x, y) {
		if (!p.scrollbar.clicked) {
			this.is_hover = (x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h);
			// check close button or topbar if button not hover
			if (this.buttonCheck(event, x, y) != ButtonStates.hover) {
				switch (event) {
				case "up":
					break;
				case "right":
					if (this.is_hover) {
						if (!utils.IsKeyPressed(VK_SHIFT)) {
							this.contextMenu(x, y);
						};
					};
					break;
				};
			};
		};
	};

	this.repaint = function () {
		window.RepaintRect(this.x, this.y, this.w, this.h);
	};

	this.contextMenu = function (x, y) {
		var idx;
		var _menu = window.CreatePopupMenu();

		_menu.AppendMenuItem(MF_STRING, 10, "Panel Settings...");

		idx = _menu.TrackPopupMenu(x, y);
		switch (true) {
		case (idx == 10):
			p.settings.currentPageId = 0;
			var arr = [];
			for (var i = 0; i < p.headerBar.columns.length; i++) {
				arr.push(p.headerBar.columns[i].ref);
			};
			for (i = 0; i < p.settings.pages.length; i++) {
				p.settings.pages[i].reSet();
			};
			p.settings.pages[1].elements[0].reSet(arr);
			cSettings.visible = true;
			full_repaint();
			break;
		};
		return true;
	};
};
