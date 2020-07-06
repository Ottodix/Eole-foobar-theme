// *****************************************************************************************************************************************
// Playlist Manager object by Br3tt aka Falstaff (c)2015
// *****************************************************************************************************************************************

oPlaylist = function (idx, rowId, isAutoPl, parent, filter_type, filter_idx) {
	this.idx = idx;
	this.rowId = rowId;
	this.filter_type = filter_type;
	this.filter_idx = filter_idx;
	this.name = plman.GetPlaylistName(idx);
	this.isAutoPlaylist = isAutoPl;
	this.isReservedPlaylist = false;
	this.bt_remove = new button(parent.bt_remove_normal, parent.bt_remove_hover, parent.bt_remove_down);
	// set a forced "autoplaylist" status to the playlist if it's a special/reserved playlist for the panel
	if (!isAutoPl) {
		if (this.name == "Historic") {
			this.isReservedPlaylist = true;
		};
	};
	this.y = -1;
};

oPlaylistManager = function (obj_name) {
	this.objectName = obj_name;
	this.h = p.list.h;
	this.woffset = 0;
	this.border = 2.0;
	this.playlists = [];
	this.offset = 0;
	this.totalRows = Math.floor(this.area_h / cPlaylistManager.rowHeight);
	this.scrollbar = new oScrollBar(0, this.objectName + ".scrollbar", 0, 0, cScrollBar.width, 0, 0, cPlaylistManager.rowHeight, this.offset, this.objectName, true, 3, false);
	this.scrollbarWidth = 0;
	this.inputbox = null;
	this.inputboxID = -1;

	this.setButtons = function () {
		var color_txt = g_color_normal_txt;
		var color_bg = g_color_normal_bg;
		var bt_w = g_z16;
		var bt_h = g_z16;

		// Az & zA vars
		var Az_h = cPlaylistManager.statusBarHeight;
		var Az_w = Math.floor(Az_h * 1.9);
		var left_padding = g_z2;
		var right_padding = zoom(4, g_dpi);

		// normal sort Az playlist Image
		this.bt_sortAz_normal = gdi.CreateImage(Az_w, Az_h);
		var gb = this.bt_sortAz_normal.GetGraphics();
		gb.SetTextRenderingHint(3);
		gb.FillSolidRect(0, 0, 1, Az_h, blendColors(color_bg, color_txt, 0.35));
		gb.DrawString(String.fromCharCode(159), gdi_font(g_font_wd3.Name, g_fsize, 1), blendColors(color_bg, color_txt, 0.5), left_padding, 1, Az_w, Az_h, lc_stringformat);
		gb.DrawString("Az", g_font, blendColors(color_bg, color_txt, 0.5), 0, 0, Az_w - right_padding, Az_h, rc_stringformat);
		gb.FillSolidRect(Az_w - 1, 0, 1, Az_h, blendColors(color_bg, color_txt, 0.35));
		this.bt_sortAz_normal.ReleaseGraphics(gb);

		// hover sort Az playlist Image
		this.bt_sortAz_hover = gdi.CreateImage(Az_w, Az_h);
		var gb = this.bt_sortAz_hover.GetGraphics();
		gb.SetTextRenderingHint(3);
		gb.FillSolidRect(0, 0, 1, Az_h, blendColors(color_bg, color_txt, 0.35));
		gb.DrawString(String.fromCharCode(159), gdi_font(g_font_wd3.Name, g_fsize, 1), color_txt, left_padding, 1, Az_w, Az_h, lc_stringformat);
		gb.DrawString("Az", g_font, color_txt, 0, 0, Az_w - right_padding, Az_h, rc_stringformat);
		gb.FillSolidRect(Az_w - 1, 0, 1, Az_h, blendColors(color_bg, color_txt, 0.35));
		this.bt_sortAz_hover.ReleaseGraphics(gb);

		this.sortAz_button = new button(this.bt_sortAz_normal, this.bt_sortAz_hover, this.bt_sortAz_hover);

		// normal sort Za playlist Image
		this.bt_sortZa_normal = gdi.CreateImage(Az_w, Az_h);
		var gb = this.bt_sortZa_normal.GetGraphics();
		gb.SetTextRenderingHint(3);
		gb.DrawString(String.fromCharCode(160), gdi_font(g_font_wd3.Name, g_fsize, 1), blendColors(color_bg, color_txt, 0.5), left_padding, 1, Az_w, Az_h, lc_stringformat);
		gb.DrawString("Za  ", g_font, blendColors(color_bg, color_txt, 0.5), 0, 0, Az_w - right_padding, Az_h, rc_stringformat);
		gb.FillSolidRect(Az_w - 1, 0, 1, Az_h, blendColors(color_bg, color_txt, 0.35));
		this.bt_sortZa_normal.ReleaseGraphics(gb);

		// hover sort Za playlist Image
		this.bt_sortZa_hover = gdi.CreateImage(Az_w, Az_h);
		var gb = this.bt_sortZa_hover.GetGraphics();
		gb.SetTextRenderingHint(3);
		gb.DrawString(String.fromCharCode(160), gdi_font(g_font_wd3.Name, g_fsize, 1), color_txt, left_padding, 1, Az_w, Az_h, lc_stringformat);
		gb.DrawString("Za  ", g_font, color_txt, 0, 0, Az_w - right_padding, Az_h, rc_stringformat);
		gb.FillSolidRect(Az_w - 1, 0, 1, Az_h, blendColors(color_bg, color_txt, 0.35));
		this.bt_sortZa_hover.ReleaseGraphics(gb);

		this.sortZa_button = new button(this.bt_sortZa_normal, this.bt_sortZa_hover, this.bt_sortZa_hover);

		// normal remove playlist Image
		this.bt_remove_normal = gdi.CreateImage(bt_w, bt_h);
		var gb = this.bt_remove_normal.GetGraphics();
		gb.SetTextRenderingHint(4);
		gb.DrawString(String.fromCharCode(209), gdi_font(g_font_wd2.Name, g_font_wd2.Size - g_z8, 0), blendColors(color_bg, color_txt, 0.5), 0, 0, bt_w, bt_h, cc_stringformat);
		this.bt_remove_normal.ReleaseGraphics(gb);

		// hover remove playlist Image
		this.bt_remove_hover = gdi.CreateImage(bt_w, bt_h);
		gb = this.bt_remove_hover.GetGraphics();
		gb.SetTextRenderingHint(4);
		gb.DrawString(String.fromCharCode(209), gdi_font(g_font_wd2.Name, g_font_wd2.Size - g_z2, 0), RGB(255, 0, 0), 0, 0, bt_w, bt_h, cc_stringformat);
		this.bt_remove_hover.ReleaseGraphics(gb);

		// down remove playlist Image
		this.bt_remove_down = gdi.CreateImage(bt_w, bt_h);
		gb = this.bt_remove_down.GetGraphics();
		gb.SetTextRenderingHint(4);
		gb.DrawString(String.fromCharCode(209), gdi_font(g_font_wd2.Name, g_font_wd2.Size - g_z2, 0), color_txt, 0, 0, bt_w, bt_h, cc_stringformat);
		this.bt_remove_down.ReleaseGraphics(gb);
	};

	this.setColors = function () {
		this.color_txt = g_color_normal_txt;
		this.color_bg = g_color_normal_bg;
		this.color_sel = g_color_selected_bg;
		this.color_high = g_color_highlight;
		this.scrollbar.setDefaultColors();
		this.setButtons();
	};
	this.setColors();

	this.repaint = function () {
		window.RepaintRect(this.x - this.woffset, this.y, this.w, this.h);
	};

	this.setSize = function (x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;

		if (cPlaylistManager.visible) {
			this.woffset = this.w;
		} else {
			this.woffset = 0;
		};

		this.totalRows = Math.floor((h - cPlaylistManager.rowHeight - (cPlaylistManager.showStatusBar ? cPlaylistManager.statusBarHeight : 0)) / cPlaylistManager.rowHeight);
		this.offset = 0;

		// scrollbar resize
		this.scrollbar.reSize(this.x - this.woffset + this.w - cScrollBar.width, this.y + cPlaylistManager.rowHeight, cScrollBar.width, this.h - cPlaylistManager.rowHeight - (cPlaylistManager.showStatusBar ? cPlaylistManager.statusBarHeight : 0), 0, cPlaylistManager.rowHeight, this.offset);
		if (this.scrollbar.visible) {
			this.scrollbarWidth = this.scrollbar.w;
		} else {
			this.scrollbarWidth = 0;
		};
	};

	this.refresh = function (filter, exclude_autoplaylists, exclude_active, reset_offset) {
		this.playlists.splice(0, this.playlists.length);
		this.total = plman.PlaylistCount;
		var rowId = 0;
		var isAutoPl = false;
		var isReserved = false;
		var plname = null;
		for (var idx = 0; idx < this.total; idx++) {
			plname = plman.GetPlaylistName(idx);
			isAutoPl = plman.IsAutoPlaylist(idx);
			isReserved = plname == "Historic";

			// is playlist Filtered for groupBy Patterns
			var found = false;
			var default_pattern_index = -1;
			var playlist_pattern_index = -1;
			if (properties.showgroupheaders && properties.enablePlaylistFilter) {
				// get Filtered groupBy pattern
				for (var m = 0; m < p.list.groupby.length; m++) {
					if (default_pattern_index > -1 && found) {
						break;
					} else if (p.list.groupby[m].playlistFilter.length > 0) {
						var arr_pl = p.list.groupby[m].playlistFilter.split(";");
						for (var n = 0; n < arr_pl.length; n++) {
							if (default_pattern_index < 0 && arr_pl[n] == "*") {
								default_pattern_index = m;
								playlist_pattern_index = (playlist_pattern_index < 0 ? m : playlist_pattern_index);
							};
							if (arr_pl[n] == plname) {
								found = true;
								playlist_pattern_index = m;
							};
						};
					};
				};
			};
			if (found) {
				var filter_type = 1;
			} else if (default_pattern_index > -1) {
				var filter_type = 2;
			} else {
				var filter_type = 0;
			};

			if (!exclude_autoplaylists || (!isAutoPl && !isReserved)) {
				if (idx == plman.ActivePlaylist) {
					if (!exclude_active) {
						this.playlists.push(new oPlaylist(idx, rowId, isAutoPl, this, filter_type, playlist_pattern_index));
						rowId++;
					};
				} else {
					this.playlists.push(new oPlaylist(idx, rowId, isAutoPl, this, filter_type, playlist_pattern_index));
					rowId++;
				};
			};
		};
		this.rowTotal = rowId;
		// scrollbar settings
		this.max = (this.rowTotal > this.totalRows ? this.totalRows : this.rowTotal);
		// scrollbar reset
		if (reset_offset)
			this.offset = 0;

		this.scrollbar.reSet(this.rowTotal, cPlaylistManager.rowHeight, this.offset);
		if (this.scrollbar.visible) {
			this.scrollbarWidth = this.scrollbar.w;
		} else {
			this.scrollbarWidth = 0;
		};
	};

	this.draw = function (gr) {

		if (cPlaylistManager.playlist_switch_pending) {
			window.SetCursor(IDC_ARROW);
			cPlaylistManager.playlist_switch_pending = false;
		};

		var cx,
		cy,
		cw,
		ch,
		iconw = 0,
		row_idx = 0,
		t = 0,
		tw = 0;
		var txt_color,
		icon_char,
		xoffset;
		var bt_w = this.bt_remove_normal.Width;

		if (this.woffset > 0) {
			// panel bg
			gr.FillSolidRect(this.x - this.woffset, this.y + this.border, 1.0, this.h - this.border, RGBA(0, 0, 0, 10));
			gr.FillSolidRect(this.x - this.woffset + 1, this.y + this.border, 1.0, this.h - this.border, RGBA(0, 0, 0, 30));
			gr.FillSolidRect(this.x - this.woffset + this.border, this.y, this.w - this.border, this.h, blendColors(this.color_bg, this.color_txt, 0.01) & 0xf0ffffff);
			gr.DrawRect(this.x - this.woffset + this.border, this.y, this.w - this.border, this.h, 1.0, this.color_txt & 0x50ffffff);

			// dims
			cx = this.x - this.woffset + this.border + 5.0;
			cw = this.w - this.border - this.scrollbarWidth - 10.0;
			ch = cPlaylistManager.rowHeight;
			cy = this.y;

			// panel header
			if (this.ishoverHeader) {
				if (dragndrop.moved || g_dragndrop_hover_playlistManager) {
					gr.FillSolidRect(this.x - this.woffset + this.border, cy, this.w - this.border, ch - 1, this.color_sel & 0x25ffffff);
					gr.DrawRect(this.x - this.woffset + this.border + 1, cy + 1, this.w - this.border - 2, ch - 1 - 2, 2.0, this.color_sel);
					// text
					iconw = gr.CalcTextWidth(String.fromCharCode(201), g_font_wd2);
					gr.GdiDrawText(String.fromCharCode(201), g_font_wd2, blendColors(this.color_txt, this.color_bg, 0.25), cx, cy, iconw, ch, DT_LEFT | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
					gr.GdiDrawText("TO A NEW PLAYLIST", g_font, blendColors(this.color_txt, this.color_bg, 0.25), cx + iconw + 5, cy, cw - iconw - 10, ch, DT_LEFT | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
				} else {
					gr.FillGradRect(this.x - this.woffset + this.border, cy, this.w - this.border, ch - 1, 90, this.color_txt & 0x15ffffff, 0, 0.96);
					// text
					gr.GdiDrawText("PLAYLISTS", g_font, blendColors(this.color_txt, this.color_bg, 0.25), cx, cy, cw - 5, ch, DT_LEFT | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
				};
			} else {
				if (dragndrop.moved || g_dragndrop_hover_playlistManager) {
					gr.FillGradRect(this.x - this.woffset + this.border, cy, this.w - this.border, ch - 1, 90, this.color_txt & 0x15ffffff, 0, 0.96);
					// text
					iconw = gr.CalcTextWidth(String.fromCharCode(201), g_font_wd2);
					gr.GdiDrawText(String.fromCharCode(201), g_font_wd2, blendColors(this.color_txt, this.color_bg, 0.25), cx, cy, iconw, ch, DT_LEFT | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
					gr.GdiDrawText("TO A NEW PLAYLIST", g_font, blendColors(this.color_txt, this.color_bg, 0.25), cx + iconw + 5, cy, cw - iconw - 10, ch, DT_LEFT | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
				} else {
					gr.FillGradRect(this.x - this.woffset + this.border, cy, this.w - this.border, ch - 1, 90, this.color_txt & 0x15ffffff, 0, 0.96);
					// text
					gr.GdiDrawText("PLAYLISTS", g_font, blendColors(this.color_txt, this.color_bg, 0.25), cx, cy, cw - 5, ch, DT_LEFT | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
				};
			};
			gr.FillSolidRect(this.x - this.woffset + this.border, cy + ch - 2, this.w - this.border, 1, g_color_normal_txt & 0x30ffffff);
			// draw flashing header on lbtn_up after a drag'n drop
			if (cPlaylistManager.blink_counter > -1) {
				if (cPlaylistManager.blink_id == -1) {
					if (cPlaylistManager.blink_counter <= 5 && Math.floor(cPlaylistManager.blink_counter / 2) == Math.ceil(cPlaylistManager.blink_counter / 2)) {
						gr.DrawRect(this.x - this.woffset + this.border + 1, cy + 1, this.w - this.border - 2, ch - 3, 2.0, this.color_sel);
					};
				};
			};

			cx = this.x - this.woffset + this.border;
			for (var i = this.offset; i < this.playlists.length; i++) {
				cy = this.y + cPlaylistManager.rowHeight + row_idx * ch;
				this.playlists[i].y = cy;
				if (cPlaylistManager.visible) {
					if (this.playlists[i].idx == plman.ActivePlaylist) {
						if (g_dragndrop_hover_playlistManager) {
							if (i == this.hoverId && !this.playlists[i].isAutoPlaylist && !this.playlists[i].isReservedPlaylist) { // drop possible
								gr.FillSolidRect(cx + 1, cy + 1 - 0001, this.w - this.border - this.scrollbarWidth - 2 + 0001, ch - 2 + 0001, this.color_sel & RGBA(255, 255, 255, properties.selection_rect_alpha));
								gr.DrawRect(cx + 1, cy + 000, this.w - this.border - this.scrollbarWidth - 002, ch - 002, 2.0, this.color_sel);
							} else { // drop not possible (autoplaylist or reserved playlists)
								if (this.playlists[i].isAutoPlaylist || this.playlists[i].isReservedPlaylist || i == plman.ActivePlaylist) {
									// drop not possible (autoplaylist or reserved playlists)
									//gr.FillSolidRect(cx+1, cy, this.w-this.border-this.scrollbarWidth-2, ch-1, blendColors(this.color_txt, this.color_bg, 0.85));
								};
							};
						} else {
							if (!dragndrop.moved) {
								// active playlist bg (no drag)
								gr.FillSolidRect(cx + 1, cy - 0001, this.w - this.border - this.scrollbarWidth - 2 + 0001, ch - 1 + 0001, this.color_sel & RGBA(255, 255, 255, properties.selection_rect_alpha));
							} else {
								// active playlist bg (when dragging)
								gr.FillSolidRect(cx + 1, cy, this.w - this.border - this.scrollbarWidth - 2, ch - 1, blendColors(this.color_txt, this.color_bg, 0.85));
							};
						};
					} else if (dragndrop.moved || g_dragndrop_hover_playlistManager) { // other playlist when dragging
						if (i == this.hoverId && !this.playlists[i].isAutoPlaylist && !this.playlists[i].isReservedPlaylist) { // drop possible
							gr.FillSolidRect(cx + 1, cy + 1 - 0001, this.w - this.border - this.scrollbarWidth - 2 + 0001, ch - 2 + 0001, this.color_sel & RGBA(255, 255, 255, properties.selection_rect_alpha));
							gr.DrawRect(cx + 1, cy + 000, this.w - this.border - this.scrollbarWidth - 002, ch - 002, 2.0, this.color_sel);
						} else { // drop not possible (autoplaylist or reserved playlists)
							if (this.playlists[i].isAutoPlaylist || this.playlists[i].isReservedPlaylist || i == plman.ActivePlaylist) {
								// drop not possible (autoplaylist or reserved playlists)
								gr.FillSolidRect(cx + 1, cy, this.w - this.border - this.scrollbarWidth - 2, ch - 1, blendColors(this.color_txt, this.color_bg, 0.85));
							};
						};
					};
				} else {
					if (i == this.hoverId) {
						if (dragndrop.moved) {
							gr.FillSolidRect(this.x - this.woffset + this.border, cy + 1.0 - 0001, this.w - this.border - this.scrollbarWidth - 1 + 0001, ch - 2.0 + 0001, this.color_sel & RGBA(255, 255, 255, properties.selection_rect_alpha));
							gr.DrawRect(cx + 1, cy + 000, this.w - this.border - this.scrollbarWidth - 002, ch - 002, 2.0, this.color_sel);
						};
					} else {
						gr.FillSolidRect(cx + 1, cy + 1, this.w - this.border - this.scrollbarWidth - 2, ch - 2, this.color_bg & 0x15ffffff);
					};
				};

				// ** item bg **
				if (!(dragndrop.moved && (this.playlists[i].isAutoPlaylist || this.playlists[i].isReservedPlaylist || (i == plman.ActivePlaylist && cPlaylistManager.visible)))) {
					gr.FillSolidRect(cx + 1, cy, this.w - this.border - this.scrollbarWidth - 2, ch - 1, this.color_txt & 0x10ffffff);
					gr.FillSolidRect(this.x - this.woffset + this.border, cy + ch - 2, this.w - this.border - this.scrollbarWidth, 1.0, g_color_normal_txt & 0x20ffffff);
				};

				// right clicked item
				if (cPlaylistManager.rightClickedId == i) {
					gr.DrawRect(cx + 1, cy + 000, this.w - this.border - this.scrollbarWidth - 002, ch - 002, 2.0, this.color_sel);
				};

				// draw flashing item on lbtn_up after a drag'n drop
				if (cPlaylistManager.blink_counter > -1) {
					if (i == cPlaylistManager.blink_id) {
						if (cPlaylistManager.blink_counter <= 5 && Math.floor(cPlaylistManager.blink_counter / 2) == Math.ceil(cPlaylistManager.blink_counter / 2)) {
							gr.DrawRect(cx + 1, cy + 1, this.w - this.border - this.scrollbarWidth - 3, ch - 3, 2.0, this.color_sel);
						};
					};
				};
				// if autoplaylist or active playlist > item not available for droping
				if (dragndrop.moved && (this.playlists[i].isAutoPlaylist || this.playlists[i].isReservedPlaylist || (i == plman.ActivePlaylist && cPlaylistManager.visible))) {
					txt_color = blendColors(this.color_txt, this.color_bg, 0.45);
				} else {
					txt_color = this.color_txt;
				};

				// icon
				var icon_color = null;
				if (this.playlists[i].idx == plman.ActivePlaylist) {
					if (this.playlists[i].idx == plman.PlayingPlaylist) {
						icon_color = blendColors(this.color_high, this.color_bg, 0.1);
					} else {
						icon_color = blendColors(this.color_sel, this.color_txt, 0.1);
					};
				} else {
					if (this.playlists[i].idx == plman.PlayingPlaylist && fb.IsPlaying) {
						icon_color = blendColors(this.color_high, this.color_bg, 0.1);
					} else {
						icon_color = this.color_txt;
					};
				};
				if (cPlaylistManager.mediaLibraryPlaylist && i == 0 && cPlaylistManager.visible) {
					iconw = gr.CalcTextWidth(String.fromCharCode(46), g_font_wd2);
					icon_char = String.fromCharCode(46);
					gr.SetTextRenderingHint(5);
					gr.DrawString(icon_char, g_font_wd2, blendColors(icon_color, this.color_bg, 0.35), cx + 5, cy - 3, iconw, ch, lc_stringformat);
				} else {
					iconw = gr.CalcTextWidth(String.fromCharCode(46), g_font_wd2);
					icon_char = (this.playlists[i].isReservedPlaylist ? String.fromCharCode(45) : (this.playlists[i].isAutoPlaylist ? String.fromCharCode(44) : String.fromCharCode(41)));
					gr.SetTextRenderingHint(5);
					gr.DrawString(icon_char, g_font_wd2, blendColors(icon_color, this.color_bg, 0.35), cx + 5, cy - 1, iconw, ch, lc_stringformat);
				};

				// draw INPUTBOX if rename requested
				if (this.inputboxID == i) {
					this.inputbox.draw(gr, this.x - this.woffset + this.border + 10.0 + iconw, cy + 5);
				} else {
					// set text color et font
					if (this.playlists[i].idx == plman.ActivePlaylist) {
						if (this.playlists[i].idx == plman.PlayingPlaylist) {
							txt_color = blendColors(this.color_high, this.color_bg, 0.1);
						} else {
							txt_color = blendColors(this.color_sel, this.color_txt, 0.1);
						};
					} else {
						if (this.playlists[i].idx == plman.PlayingPlaylist && fb.IsPlaying) {
							txt_color = blendColors(this.color_high, this.color_bg, 0.1);
						} else {
							txt_color = this.color_txt;
						};
					};

					// playlist total items
					if (cPlaylistManager.showTotalItems) {
						t = plman.PlaylistItemCount(this.playlists[i].idx);
						tw = gr.CalcTextWidth(t, gdi_font(g_fname, g_fsize - 1, 0)) + 5;
						gr.GdiDrawText(t, gdi_font(g_fname, g_fsize - 1, 0), blendColors(txt_color, this.color_bg, 0.35), cx + 5 + iconw + 5, cy, cw - iconw - 5 - bt_w, ch, DT_RIGHT | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
					} else {
						tw = 0;
					};

					// draw playlist name
					gr.GdiDrawText(this.playlists[i].name, g_font, txt_color, cx + 5 + iconw + 4, cy, cw - iconw - 4 - tw - bt_w, ch, DT_LEFT | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
					// add mark when a Playlist Filter is set for this playlist
					if (this.playlists[i].filter_type > 0) {
						gr.GdiDrawText(String.fromCharCode(this.playlists[i].filter_type == 1 ? 162 : 163), gdi_font(g_font_wd2.Name, g_font_wd2.Size - zoom(14, g_dpi), 0), txt_color, cx + 5 + iconw + 5, cy - zoom(4, g_dpi), cw - iconw - zoom(6.0, g_dpi), ch, DT_RIGHT | DT_CALCRECT | DT_BOTTOM | DT_END_ELLIPSIS | DT_NOPREFIX);
					};

					// draw remove button
					if (!(cPlaylistManager.mediaLibraryPlaylist && i == 0)) {
						this.playlists[i].bt_remove.draw(gr, cx + cw - bt_w + 9, cy + 2, 255);
					};
				};

				// draw "drag destination bar" on dragging playlist item
				if (this.ishoverItem && !cPlaylistManager.vscroll_timer) {
					if (cPlaylistManager.drag_target_id == this.rowTotal) {
						//gr.DrawRect(cx+1, this.playlists[this.rowTotal-1].y + cPlaylistManager.rowHeight, this.w-this.border-this.scrollbarWidth-3, 1, 2.0, this.color_sel);
					} else if (cPlaylistManager.drag_target_id == i) {
						if (cPlaylistManager.drag_target_id > cPlaylistManager.drag_source_id) {
							gr.DrawRect(cx + 1, cy + cPlaylistManager.rowHeight, this.w - this.border - this.scrollbarWidth - 2, 1, 2.0, this.color_sel);
						} else if (cPlaylistManager.drag_target_id < cPlaylistManager.drag_source_id) {
							gr.DrawRect(cx + 1, cy, this.w - this.border - this.scrollbarWidth - 2, 1, 2.0, this.color_sel);
						};
					};
				} else {
					cPlaylistManager.drag_target_id = -1;
				};

				row_idx++;
			};

			// panel footer
			if (cPlaylistManager.showStatusBar) {
				var fx = this.x - this.woffset + this.border;
				var fy = this.y + this.h - cPlaylistManager.statusBarHeight;
				var fw = this.w - this.border;
				var fh = cPlaylistManager.statusBarHeight;
				gr.FillSolidRect(fx, fy, fw, fh, blendColors(this.color_bg, this.color_txt, 0.01) & 0xf0ffffff);
				gr.FillGradRect(fx, fy, fw, fh, 90, this.color_txt & 0x15ffffff, 0, 0.96);
				gr.FillSolidRect(fx, fy, fw, 1.0, this.color_txt & 0x50ffffff);
				var status_txt = this.playlists.length + (this.playlists.length > 1 ? " PLAYLISTS" : " PLAYLIST");
				gr.GdiDrawText(status_txt, gdi_font(g_fname, g_fsize - 2, 0), blendColors(this.color_txt, this.color_bg, 0.25), fx + 5, fy, fw - 10, fh, DT_RIGHT | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
				// draw sort buttons
				this.sortAz_button.draw(gr, fx, fy, 255);
				this.sortZa_button.draw(gr, fx + this.sortAz_button.img[0].Width, fy, 255);
			};

			// draw scrollbar
			if (this.scrollbarWidth > 0) {
				this.scrollbar.drawXY(gr, this.x - this.woffset + this.w - this.scrollbarWidth, this.y + cPlaylistManager.rowHeight);
			};
		};
	};

	this.isHoverObject = function (x, y) {
		return (x > this.x - this.woffset && x < this.x - this.woffset + this.w - this.scrollbarWidth && y > this.y && y < this.y + this.h);
	};

	this.check = function (event, x, y, delta) {
		this.ishover = this.isHoverObject(x, y);
		this.ishoverHeader = (x > this.x - this.woffset && x < this.x - this.woffset + this.w + this.scrollbarWidth && y > this.y && y <= this.y + cPlaylistManager.rowHeight); //this.ishover && !this.ishoverItem;

		this.ishoverItem = (x > this.x - this.woffset && x < this.x - this.woffset + this.w - this.scrollbarWidth && y > this.y + cPlaylistManager.rowHeight && y < this.y + this.h);
		if (this.ishoverItem) {
			this.hoverId = Math.floor((y - ((this.y + cPlaylistManager.rowHeight) - this.offset * cPlaylistManager.rowHeight)) / cPlaylistManager.rowHeight); // hoverId = row Id in the list
			if (this.hoverId >= this.playlists.length)
				this.hoverId = -1;
		} else {
			this.hoverId = -1;
		};

		if (this.hoverId > -1) {
			if (this.hoverId == this.inputboxID) {
				this.inputbox_ishover = (x > this.inputbox.x - 3 && x < this.inputbox.x + this.inputbox.w + 6 && y > this.inputbox.y && y < this.inputbox.y + this.inputbox.h);
				this.ishover = this.ishover ? (this.inputbox_ishover ? false : true) : false;
			} else {
				this.inputbox_ishover = false;
			};
		};

		switch (event) {
		case "down":
			if (!dragndrop.moved) {

				this.sortAz_button.checkstate(event, x, y);
				this.sortZa_button.checkstate(event, x, y);

				if (this.inputboxID >= 0) {
					this.inputbox.check("down", x, y);
				};
				if (this.hoverId > -1 && this.inputboxID == -1) {

					// check remove button
					if (!(cPlaylistManager.mediaLibraryPlaylist && this.hoverId == 0) && this.playlists[this.hoverId].bt_remove.checkstate(event, x, y) == ButtonStates.down) {
						//
					} else {
						if (plman.ActivePlaylist != this.hoverId) {
							plman.ActivePlaylist = this.hoverId;
							cPlaylistManager.playlist_switch_pending = true;
							window.SetCursor(IDC_WAIT);
						};
						if (cPlaylistManager.visible) {
							// prepare drag item to reorder list
							cPlaylistManager.drag_clicked = true;
							cPlaylistManager.drag_x = x;
							cPlaylistManager.drag_y = y;
							cPlaylistManager.drag_source_id = this.hoverId;
						};
					};

				} else if (this.scrollbar.visible) {
					this.scrollbar.check(event, x, y, delta);
				};
			};
			break;
		case "dblclk":
			this.check("down", x, y);
			break;
		case "right":
			if (this.inputboxID >= 0) {
				this.inputbox.check("right", x, y);
			} else {
				if (this.hoverId > -1 && this.inputboxID == -1) {
					cPlaylistManager.rightClickedId = this.hoverId;
					full_repaint();
					if (!utils.IsKeyPressed(VK_SHIFT)) {
						this.contextMenu(x, y, this.playlists[this.hoverId].idx);
					};
				} else if (this.ishover && this.inputboxID == -1) {
					if (!utils.IsKeyPressed(VK_SHIFT)) {
						this.contextMenu(x, y, null);
					};
				};
			};
			break;
		case "up":
			if (this.inputboxID >= 0) {
				this.inputbox.check("up", x, y);
			} else {
				if (this.scrollbar.visible && !dragndrop.moved)
					this.scrollbar.check(event, x, y, delta);
				if (dragndrop.moved) {
					var drop_done = false;
					// drop possible only if not an autoplaylist and not the active playlist as target
					if (this.hoverId > -1 && this.hoverId < this.playlists.length && !this.playlists[this.hoverId].isAutoPlaylist && !this.playlists[this.hoverId].isReservedPlaylist && this.playlists[this.hoverId].idx != plman.ActivePlaylist) {
						drop_done = true;
						plman.UndoBackup(this.playlists[this.hoverId].idx);
						plman.InsertPlaylistItems(this.playlists[this.hoverId].idx, plman.PlaylistItemCount(this.playlists[this.hoverId].idx), p.list.metadblist_selection, false);
					} else if (this.ishoverHeader) {
						drop_done = true;
						var new_playlist_idx = plman.PlaylistCount;
						plman.CreatePlaylist(new_playlist_idx, "");
						plman.InsertPlaylistItems(new_playlist_idx, 0, p.list.metadblist_selection, false);
					};
					if (drop_done) {
						if (!cPlaylistManager.blink_timer) { // create a timer to blink the playlist item where tracks have been droped!
							cPlaylistManager.blink_x = x;
							cPlaylistManager.blink_y = y;
							cPlaylistManager.blink_totaltracks = p.list.metadblist_selection.Count;
							cPlaylistManager.blink_id = this.hoverId;
							cPlaylistManager.blink_counter = 0;
							cPlaylistManager.blink_timer = window.SetInterval(function () {
									cPlaylistManager.blink_counter++;
									if (cPlaylistManager.blink_counter > (cPlaylistManager.visible ? 5 : 10)) {
										window.ClearInterval(cPlaylistManager.blink_timer);
										cPlaylistManager.blink_timer = false;
										cPlaylistManager.blink_counter = -1;
										cPlaylistManager.blink_id = null;
									};
									full_repaint();
								}, 125);
						};
					};
				} else {
					if (this.sortAz_button.checkstate(event, x, y) == ButtonStates.hover) {
						plman.SortPlaylistsByName(1);
						this.refresh("", false, false, false);
						full_repaint();
					};
					if (this.sortZa_button.checkstate(event, x, y) == ButtonStates.hover) {
						plman.SortPlaylistsByName(-1);
						this.refresh("", false, false, false);
						full_repaint();
					} else {
						// check remove button
						var deb = (cPlaylistManager.mediaLibraryPlaylist ? 1 : 0);
						for (var pl = deb; pl < this.playlists.length; pl++) {
							if (this.playlists[pl].bt_remove.checkstate(event, x, y) == ButtonStates.hover) {
								plman.RemovePlaylistSwitch(pl);
								if (this.offset > 0 && this.offset >= this.playlists.length - Math.floor((this.h - (cPlaylistManager.showStatusBar ? cPlaylistManager.statusBarHeight : 0)) / cPlaylistManager.rowHeight)) {
									this.offset--;
									this.refresh("", false, false, false);
								};
							};
						};
					};
				};

				// hide playlist manager panel if not visible by default
				if (!cPlaylistManager.visible) {
					if (cPlaylistManager.hscroll_timer) {
						window.ClearTimeout(cPlaylistManager.hscroll_timer);
						cPlaylistManager.hscroll_timer = false;
					};
					if (p.playlistManager.woffset > 0) { // if panel opened
						cPlaylistManager.hscroll_timer = window.SetInterval(function () {
								full_repaint();
								if (!cPlaylistManager.blink_timer) { // we wait the end of the blink timer before colapsing to the right the playlist manager panel
									p.playlistManager.woffset -= cPlaylistManager.step;
								};
								if (p.playlistManager.woffset <= 0) {
									p.playlistManager.woffset = 0;
									cPlaylistManager.hscroll_timer && window.ClearTimeout(cPlaylistManager.hscroll_timer);
									cPlaylistManager.hscroll_timer = false;
									full_repaint();
								};
							}, 16);
					};
				};

				// drop item playlist
				if (cPlaylistManager.drag_target_id > -1) {
					if (cPlaylistManager.drag_target_id == this.rowTotal) {
						plman.MovePlaylist(this.playlists[cPlaylistManager.drag_source_id].idx, this.playlists[this.rowTotal - 1].idx);
					} else {
						cPlaylistManager.drag_droped = (cPlaylistManager.drag_source_id != cPlaylistManager.drag_target_id);
						if (cPlaylistManager.drag_target_id < cPlaylistManager.drag_source_id) {
							plman.MovePlaylist(this.playlists[cPlaylistManager.drag_source_id].idx, this.playlists[cPlaylistManager.drag_target_id].idx);
						} else if (cPlaylistManager.drag_target_id > cPlaylistManager.drag_source_id) {
							plman.MovePlaylist(this.playlists[cPlaylistManager.drag_source_id].idx, this.playlists[cPlaylistManager.drag_target_id].idx);
						};
					};
				};

			};

			if (cPlaylistManager.drag_moved)
				window.SetCursor(IDC_ARROW);

			cPlaylistManager.drag_clicked = false;
			cPlaylistManager.drag_moved = false;
			cPlaylistManager.drag_source_id = -1;
			cPlaylistManager.drag_target_id = -1;
			cPlaylistManager.drag_x = -1;
			cPlaylistManager.drag_y = -1;
			break;
		case "drag_over":
			g_dragndrop_targetPlaylistId = this.hoverId;
			break;
		case "move":
			if (!dragndrop.moved && !cPlaylistManager.drag_clicked) {
				this.sortAz_button.checkstate(event, x, y);
				this.sortZa_button.checkstate(event, x, y);
			};

			if (this.inputboxID >= 0) {
				this.inputbox.check("move", x, y);
			} else {
				if (this.scrollbar.visible && !dragndrop.moved)
					this.scrollbar.check(event, x, y, delta);
				if (cPlaylistManager.drag_moved) {
					if (!this.ishoverHeader) {
						if (this.hoverId > -1 && this.hoverId != cPlaylistManager.drag_source_id) {
							cPlaylistManager.drag_target_id = this.hoverId;
						} else if (y > this.playlists[this.rowTotal - 1].y + cPlaylistManager.rowHeight && y < this.playlists[this.rowTotal - 1].y + cPlaylistManager.rowHeight * 2) {
							cPlaylistManager.drag_target_id = this.rowTotal;
						} else {
							cPlaylistManager.drag_target_id = -1;
						};
					};
				} else {

					// check remove button
					if (!dragndrop.moved) {
						var deb = (cPlaylistManager.mediaLibraryPlaylist ? 1 : 0);
						for (var pl = deb; pl < this.playlists.length; pl++) {
							this.playlists[pl].bt_remove.checkstate(event, x, y);
						};
					};

					if (cPlaylistManager.drag_clicked) {
						cPlaylistManager.drag_moved = true;
					} else {
						if (dragndrop.moved) {
							if (!cPlaylistManager.drag_move_timer) {
								full_repaint();
								cPlaylistManager.drag_move_timer = window.SetTimeout(function () {
										full_repaint();
										window.ClearInterval(cPlaylistManager.drag_move_timer);
										cPlaylistManager.drag_move_timer = false;
									}, 50);
							};
						} else {
							if (cPlaylistManager.drag_move_timer) {
								window.ClearInterval(cPlaylistManager.drag_move_timer);
								cPlaylistManager.drag_move_timer = false;
							};
						};
					};
				};
			};
			break;
		case "wheel":
			if (this.scrollbar.visible && !dragndrop.moved)
				this.scrollbar.check(event, x, y, delta);
			break;
		case "leave":
			var fin = this.playlists.length;
			for (var i = 0; i < fin; i++) {
				this.playlists[i].bt_remove.checkstate(event, 0, 0);
			};
			this.sortAz_button.checkstate(event, 0, 0);
			this.sortZa_button.checkstate(event, 0, 0);
			full_repaint();
			break;
		};
	};

	this.contextMenu = function (x, y, id) {
		var MF_SEPARATOR = 0x00000800;
		var MF_STRING = 0x00000000;
		var _menu = window.CreatePopupMenu();
		var _newplaylist = window.CreatePopupMenu();
		var _autoplaylist = window.CreatePopupMenu();
		var _filters = window.CreatePopupMenu();
		var idx;
		var total_area,
		visible_area;
		var bout,
		z;
		var add_mode = (id == null);

		if (!add_mode) {
			_newplaylist.AppendTo(_menu, MF_STRING, "Insert ...");
		} else {
			id = plman.PlaylistCount;
			_newplaylist.AppendTo(_menu, MF_STRING, "Add ...");
		};
		_newplaylist.AppendMenuItem(MF_STRING, 100, "New Playlist");
		_newplaylist.AppendMenuItem(MF_STRING, 101, "New Autoplaylist");
		_autoplaylist.AppendTo(_newplaylist, MF_STRING, "Pre-defined AutoPlaylist");
		_autoplaylist.AppendMenuItem(MF_STRING, 200, "Tracks never played");
		_autoplaylist.AppendMenuItem(MF_STRING, 201, "Tracks played in the last 5 days");
		_autoplaylist.AppendMenuItem(MF_SEPARATOR, 0, "");
		_autoplaylist.AppendMenuItem(MF_STRING, 210, "Tracks unrated");
		_autoplaylist.AppendMenuItem(MF_STRING, 211, "Tracks rated 3 to 5");
		_autoplaylist.AppendMenuItem(MF_STRING, 212, "Tracks rated 4");
		_autoplaylist.AppendMenuItem(MF_STRING, 213, "Tracks rated 5");
		_autoplaylist.AppendMenuItem(MF_STRING, 214, "Loved Tracks");
		_menu.AppendMenuItem(MF_SEPARATOR, 0, "");
		_menu.AppendMenuItem(MF_STRING, 2, "Load a Playlist");
		if (!add_mode) {
			_menu.AppendMenuItem(MF_STRING, 5, "Duplicate this playlist");
			if (id > 0 || !cPlaylistManager.mediaLibraryPlaylist) {
				_menu.AppendMenuItem(MF_STRING, 3, "Rename this playlist");
				_menu.AppendMenuItem(MF_STRING, 8, "Remove this playlist");
			};
			if (id > 0 || !cPlaylistManager.mediaLibraryPlaylist) {
				if (plman.IsAutoPlaylist(id)) {
					_menu.AppendMenuItem(MF_SEPARATOR, 0, "");
					_menu.AppendMenuItem(MF_STRING, 6, "Autoplaylist properties...");
					_menu.AppendMenuItem(MF_STRING, 7, "Convert to a normal playlist");
				};
			};
		};
		if (!add_mode) {
			if (properties.enablePlaylistFilter) {
				_menu.AppendMenuItem(MF_SEPARATOR, 0, "");
				if (this.playlists[id].filter_type == 1) {
					_filters.AppendTo(_menu, MF_STRING, "Change Group Playlist Filter");
					_filters.AppendMenuItem(MF_STRING, 799, "Remove Playlist Filter");
					_filters.AppendMenuItem(MF_SEPARATOR, 0, "");
				} else {
					_filters.AppendTo(_menu, MF_STRING, "Set Group Playlist Filter");
				};
				var groupByMenuIdx = 800;
				var totalGroupBy = p.list.groupby.length;
				for (var i = 0; i < totalGroupBy; i++) {
					_filters.AppendMenuItem(MF_STRING, groupByMenuIdx + i, p.list.groupby[i].label);
				};
				if (this.playlists[id].filter_type == 1) {
					_filters.CheckMenuRadioItem(groupByMenuIdx, groupByMenuIdx + totalGroupBy - 1, this.playlists[id].filter_idx + groupByMenuIdx);
				};
			};
		};

		idx = _menu.TrackPopupMenu(x, y);

		switch (true) {
		case (idx == 100):
			var total = plman.PlaylistCount;
			plman.CreatePlaylist(total, "");
			if (id == 0 && cPlaylistManager.mediaLibraryPlaylist) {
				plman.MovePlaylist(total, id + 1);
				plman.ActivePlaylist = id + 1;
				id++;
			} else {
				plman.MovePlaylist(total, id);
				plman.ActivePlaylist = id;
			};
			// set rename it
			this.inputbox = new oInputbox(this.w - this.border - this.scrollbarWidth - 40, cPlaylistManager.rowHeight - 10, plman.GetPlaylistName(id), "", g_color_normal_txt, g_color_normal_bg, RGB(0, 0, 0), g_color_selected_bg & 0xccffffff, "renamePlaylist()", "p.playlistManager", 0, g_fsize, 225);
			this.inputboxID = id;
			// activate box content + selection activated
			if (cPlaylistManager.inputbox_timer) {
				window.ClearTimeout(cPlaylistManager.inputbox_timer);
				cPlaylistManager.inputbox_timer = false;
			};
			cPlaylistManager.inputbox_timer = window.SetTimeout(inputboxPlaylistManager_activate, 20);
			break;
		case (idx == 101):
			var total = plman.PlaylistCount;
			plman.CreateAutoPlaylist(total, "", "", "", 0);
			if (id == 0 && cPlaylistManager.mediaLibraryPlaylist) {
				plman.MovePlaylist(total, id + 1);
				plman.ActivePlaylist = id + 1;
				plman.ShowAutoPlaylistUI(id + 1);
				id++;
			} else {
				plman.MovePlaylist(total, id);
				plman.ActivePlaylist = id;
				plman.ShowAutoPlaylistUI(id);
			};
			// set rename it
			this.inputbox = new oInputbox(this.w - this.border - this.scrollbarWidth - 40, cPlaylistManager.rowHeight - 10, plman.GetPlaylistName(id), "", g_color_normal_txt, g_color_normal_bg, RGB(0, 0, 0), g_color_selected_bg & 0xccffffff, "renamePlaylist()", "p.playlistManager", 0, g_fsize, 225);
			this.inputboxID = id;
			// activate box content + selection activated
			if (cPlaylistManager.inputbox_timer) {
				window.ClearTimeout(cPlaylistManager.inputbox_timer);
				cPlaylistManager.inputbox_timer = false;
			};
			cPlaylistManager.inputbox_timer = window.SetTimeout(inputboxPlaylistManager_activate, 20);
			break;
		case (idx == 2):
			fb.LoadPlaylist();
			break;
		case (idx == 3):
			// set rename it
			this.inputbox = new oInputbox(this.w - this.border - this.scrollbarWidth - 40, cPlaylistManager.rowHeight - 10, plman.GetPlaylistName(id), "", g_color_normal_txt, g_color_normal_bg, RGB(0, 0, 0), g_color_selected_bg & 0xccffffff, "renamePlaylist()", "p.playlistManager", 0, g_fsize, 225);
			this.inputboxID = id;
			// activate box content + selection activated
			if (cPlaylistManager.inputbox_timer) {
				window.ClearTimeout(cPlaylistManager.inputbox_timer);
				cPlaylistManager.inputbox_timer = false;
			};
			cPlaylistManager.inputbox_timer = window.SetTimeout(inputboxPlaylistManager_activate, 20);
			break;
		case (idx == 5):
			plman.DuplicatePlaylist(id, "Copy of " + plman.GetPlaylistName(id));
			plman.ActivePlaylist = id + 1;
			break;
		case (idx == 6):
			plman.ShowAutoPlaylistUI(id);
			break;
		case (idx == 7):
			plman.DuplicatePlaylist(id, plman.GetPlaylistName(id));
			plman.RemovePlaylist(id);
			plman.ActivePlaylist = id;
			break;
		case (idx == 8):
			plman.RemovePlaylistSwitch(id);
			if (this.offset > 0 && this.offset >= this.playlists.length - Math.floor((this.h - (cPlaylistManager.showStatusBar ? cPlaylistManager.statusBarHeight : 0)) / cPlaylistManager.rowHeight)) {
				this.offset--;
				this.refresh("", false, false, false);
			};
			break;
		case (idx == 200):
			var total = plman.PlaylistCount;
			p.playlistManager.inputboxID = -1;
			plman.CreateAutoPlaylist(total, "Tracks never played", "%play_counter% MISSING", "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
			if (id == 0 && cPlaylistManager.mediaLibraryPlaylist) {
				plman.MovePlaylist(total, id + 1);
				plman.ActivePlaylist = id + 1;
			} else {
				plman.MovePlaylist(total, id);
				plman.ActivePlaylist = id;
			};
			break;
		case (idx == 201):
			var total = plman.PlaylistCount;
			p.playlistManager.inputboxID = -1;
			plman.CreateAutoPlaylist(total, "Tracks played in the last 5 days", "%last_played% DURING LAST 5 DAYS", "%last_played%", 0);
			if (id == 0 && cPlaylistManager.mediaLibraryPlaylist) {
				plman.MovePlaylist(total, id + 1);
				plman.ActivePlaylist = id + 1;
			} else {
				plman.MovePlaylist(total, id);
				plman.ActivePlaylist = id;
			};
			break;
		case (idx == 210):
			var total = plman.PlaylistCount;
			p.playlistManager.inputboxID = -1;
			plman.CreateAutoPlaylist(total, "Tracks unrated", "%rating% MISSING", "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
			if (id == 0 && cPlaylistManager.mediaLibraryPlaylist) {
				plman.MovePlaylist(total, id + 1);
				plman.ActivePlaylist = id + 1;
			} else {
				plman.MovePlaylist(total, id);
				plman.ActivePlaylist = id;
			};
			break;
		case (idx == 211):
			var total = plman.PlaylistCount;
			p.playlistManager.inputboxID = -1;
			plman.CreateAutoPlaylist(total, "Tracks rated 3 to 5", "%rating% GREATER 2", "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
			if (id == 0 && cPlaylistManager.mediaLibraryPlaylist) {
				plman.MovePlaylist(total, id + 1);
				plman.ActivePlaylist = id + 1;
			} else {
				plman.MovePlaylist(total, id);
				plman.ActivePlaylist = id;
			};
			break;
		case (idx == 212):
			var total = plman.PlaylistCount;
			p.playlistManager.inputboxID = -1;
			plman.CreateAutoPlaylist(total, "Tracks rated 4", "%rating% IS 4", "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
			if (id == 0 && cPlaylistManager.mediaLibraryPlaylist) {
				plman.MovePlaylist(total, id + 1);
				plman.ActivePlaylist = id + 1;
			} else {
				plman.MovePlaylist(total, id);
				plman.ActivePlaylist = id;
			};
			break;
		case (idx == 213):
			var total = plman.PlaylistCount;
			p.playlistManager.inputboxID = -1;
			plman.CreateAutoPlaylist(total, "Tracks rated 5", "%rating% IS 5", "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
			if (id == 0 && cPlaylistManager.mediaLibraryPlaylist) {
				plman.MovePlaylist(total, id + 1);
				plman.ActivePlaylist = id + 1;
			} else {
				plman.MovePlaylist(total, id);
				plman.ActivePlaylist = id;
			};
			break;
		case (idx == 214):
			var total = plman.PlaylistCount;
			p.playlistManager.inputboxID = -1;
			plman.CreateAutoPlaylist(total, "Loved Tracks", "%mood% GREATER 0", "%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", 0);
			if (id == 0 && cPlaylistManager.mediaLibraryPlaylist) {
				plman.MovePlaylist(total, id + 1);
				plman.ActivePlaylist = id + 1;
			} else {
				plman.MovePlaylist(total, id);
				plman.ActivePlaylist = id;
			};
			break;
		case (idx == 799):
			var pl_name = plman.GetPlaylistName(id);

			// Changing the affected pattern
			var old_pl_filter = p.list.groupby[this.playlists[id].filter_idx].playlistFilter;
			var arr = old_pl_filter.split(";");
			if (arr.length == 1) {
				var new_pl_filter = "null";
			} else {
				var new_pl_filter = "";
				// remove the playlist from its actual Playlist Filter
				for (var f = 0; f < arr.length; f++) {
					if (arr[f] != pl_name) {
						// not the playlsit to remove from the Playlist Filter, we keep it
						if (new_pl_filter.length == 0) {
							new_pl_filter = arr[f];
						} else {
							new_pl_filter = new_pl_filter + ";" + arr[f];
						};
					};
				};
			};
			p.list.groupby[this.playlists[id].filter_idx].playlistFilter = new_pl_filter;

			p.list.saveGroupBy();

			// refresh playlist
			p.list.updateHandleList(plman.ActivePlaylist, false);
			p.list.setItems(true);
			p.scrollbar.setCursor(p.list.totalRowVisible, p.list.totalRows, p.list.offset);
			p.playlistManager.refresh("", false, false, false);
			break;
		case (idx >= 800 && idx < 830):
			var pl_name = plman.GetPlaylistName(id);
			var pl_filter = p.list.groupby[idx - groupByMenuIdx].playlistFilter;

			if (this.playlists[id].filter_idx != idx - groupByMenuIdx) {
				if (this.playlists[id].filter_type == 1) {
					// Changing the affected pattern
					var old_pl_filter = p.list.groupby[this.playlists[id].filter_idx].playlistFilter;
					var arr = old_pl_filter.split(";");
					if (arr.length == 1) {
						var new_pl_filter = "null";
					} else {
						var new_pl_filter = "";
						// remove the playlist from its actual Playlist Filter
						for (var f = 0; f < arr.length; f++) {
							if (arr[f] != pl_name) {
								// not the playlsit to remove from the Playlist Filter, we keep it
								if (new_pl_filter.length == 0) {
									new_pl_filter = arr[f];
								} else {
									new_pl_filter = new_pl_filter + ";" + arr[f];
								};
							};
						};
					};
					p.list.groupby[this.playlists[id].filter_idx].playlistFilter = new_pl_filter;
				};

				// setting a pattern
				if (pl_filter.toLowerCase() == "null") {
					p.list.groupby[idx - groupByMenuIdx].playlistFilter = pl_name;
				} else {
					p.list.groupby[idx - groupByMenuIdx].playlistFilter = pl_filter + ";" + pl_name;
				};
			};

			p.list.saveGroupBy();

			// refresh playlist
			p.list.updateHandleList(plman.ActivePlaylist, false);
			p.list.setItems(true);
			p.scrollbar.setCursor(p.list.totalRowVisible, p.list.totalRows, p.list.offset);
			p.playlistManager.refresh("", false, false, false);
			break;
		};
		cPlaylistManager.rightClickedId = null;
		full_repaint();
		return true;
	};
};
