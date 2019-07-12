// *****************************************************************************************************************************************
// Playlist object by Br3tt aka Falstaff (c)2015
// *****************************************************************************************************************************************

oGroup = function (index, start, count, total_time_length, focusedTrackId, iscollapsed) {
	this.index = index;
	this.start = start;
	this.count = count;
	this.total_time_length = total_time_length;
	this.total_group_duration_txt = utils.FormatDuration(total_time_length);

	if (count < cGroup.count_minimum) {
		this.rowsToAdd = cGroup.count_minimum - count;
	} else {
		this.rowsToAdd = 0;
	};
	// Add extra rows to the total rows of the group
	this.rowsToAdd += cGroup.extra_rows;

	if (properties.autocollapse) {
		if (focusedTrackId >= this.start && focusedTrackId < this.start + this.count) { // focused track is in this group!
			this.collapsed = false;
			// save in globals the current group id of the focused track (used for autocollapse option)
			g_group_id_focused = this.index;
		} else {
			this.collapsed = true;
		};
	} else if (iscollapsed) {
		this.collapsed = true;
	} else {
		this.collapsed = false;
	};

	this.totalPreviousRows = 0;

	this.collapse = function () {
		this.collapse = true;
	};

	this.expand = function () {
		this.collapse = false;
	};
};

oItem = function (playlist, row_index, type, handle, track_index, group_index, track_index_in_group, heightInRow, groupRowDelta, obj, empty_row_index) {
	// type 1 = group
	// type 0 = track
	this.type = type;
	this.playlist = playlist;
	this.row_index = row_index;
	this.metadb = handle;
	this.track_index = track_index;
	this.track_index_in_group = track_index_in_group;
	this.group_index = group_index;
	this.heightInRow = heightInRow;
	this.groupRowDelta = groupRowDelta;
	this.obj = obj;
	this.empty_row_index = empty_row_index;
	this.tracktype = TrackType(this.metadb.RawPath.substring(0, 4));
	this.l_rating = 0;
	this.l_mood = 0;

	this.setGroupMeta = function () {
		if (this.type == 1) {
			if (this.metadb) {
				this.l1 = fb.TitleFormat(p.list.groupby[cGroup.pattern_idx].l1).EvalWithMetadb(this.metadb);
				this.r1 = fb.TitleFormat(p.list.groupby[cGroup.pattern_idx].r1).EvalWithMetadb(this.metadb);
				this.l2 = fb.TitleFormat(p.list.groupby[cGroup.pattern_idx].l2).EvalWithMetadb(this.metadb);
				this.r2 = fb.TitleFormat(p.list.groupby[cGroup.pattern_idx].r2).EvalWithMetadb(this.metadb);
			};
		};
	};
	this.setGroupMeta();

	this.parseTF = function (tf, default_color) {
		var result = Array(tf, default_color);
		var txt = "",
		i = 1,
		tmp = "";
		var pos = tf.indexOf(String.fromCharCode(3));
		if (pos > -1) {
			var tab = tf.split(String.fromCharCode(3));
			var fin = tab.length;
			// if first part is text (not a color)
			if (pos > 0)
				txt = tab[0];
			// get color and other text part
			tmp = tab[1];
			result[1] = eval("0xFF" + tmp.substr(4, 2) + tmp.substr(2, 2) + tmp.substr(0, 2));
			while (i < fin) {
				txt = txt + tab[i + 1];
				i += 2;
			};
			result[0] = txt;
		};
		return result;
	};

	this.drawRowContents = function (gr) {
		// Draw columns content
		var cx,
		cw,
		tf1,
		tf2;
		if (cList.enableExtraLine) {
			var tf1_y = this.y - g_z2;
			var tf1_h = Math.floor(this.h / 4 * 3) + cTrack.parity;
			var tf2_y = this.y + Math.ceil(this.h / 2) + cTrack.parity - g_z2;
			var tf2_h = Math.ceil(this.h / 2) + cTrack.parity;
		} else {
			var tf1_y = this.y;
			var tf1_h = this.h + cTrack.parity;
			var tf2_y = 0;
			var tf2_h = 0;
		}

		var fin = p.headerBar.columns.length;
		for (var j = 0; j < fin; j++) {
			tf1 = tf2 = null;
			if (p.headerBar.columns[j].w > 0) {
				cx = p.headerBar.columns[j].x + g_z5;
				cw = (Math.abs(p.headerBar.w * p.headerBar.columns[j].percent / 100000)) - g_z10;
				switch (p.headerBar.columns[j].ref) {
				case "State":
					if (p.headerBar.columns[j].tf == "null") {
						var columnColor = this.text_colour;
					} else {
						if (typeof(this.state_color) == "undefined" && p.headerBar.columns[j].tf != "null") {
							this.state_tf = fb.TitleFormat(p.headerBar.columns[j].tf).EvalWithMetadb(this.metadb);
							var stateArray = this.parseTF(this.state_tf, this.text_colour);
							this.state_tf = stateArray[0];
							this.state_color = stateArray[1];
						};
						var columnColor = this.state_color;
					};
					var queue_w = p.list.state_queue_w;
					var icon_w = p.list.state_icon_w;
					switch (p.headerBar.columns[j].align) {
					case 0:
						var icon_x = cx + g_z2;
						break;
					case 1:
						var icon_x = cx + Math.round((cw / 2) - (queue_w / 2)) - g_z5;
						break;
					case 2:
						var icon_x = Math.floor(cx + cw - queue_w - g_z10);
						break;
					};
					if (fb.IsPlaying) {
						if (plman.PlayingPlaylist == this.playlist) {
							if (this.track_index == p.list.nowplaying.PlaylistItemIndex) {
								if (fb.isPaused) {
									gr.DrawString(String.fromCharCode(127).repeat(2), g_font_pauseicon, columnColor, icon_x, this.y, icon_w, cTrack.height + cTrack.parity, cc_stringformat);
								} else {
									gr.SetTextRenderingHint(4);
									if (g_seconds / 2 == Math.floor(g_seconds / 2)) {
										gr.DrawString(String.fromCharCode(117), g_font_playicon, columnColor, icon_x, this.y, icon_w, cTrack.height + cTrack.parity, cc_stringformat);
									} else {
										gr.DrawString(String.fromCharCode(119), g_font_playicon, columnColor, icon_x, this.y, icon_w, cTrack.height + cTrack.parity, cc_stringformat);
									};
								};
							} else {
								gr.SetTextRenderingHint(5);
								if (plman.IsPlaylistItemSelected(p.list.playlist, this.track_index)) { // if selected
									if (this.queue_idx > 0) {
										gr.DrawRect(icon_x - 1, this.y + g_z8 - 1, queue_w + g_z6 + 1, cTrack.height - g_z16 + 1, 1.0, columnColor & 0x77ffffff);
										gr.DrawString(num(this.queue_idx, 2), g_font_queue_idx, columnColor, icon_x + g_z3, this.y, queue_w, cTrack.height + cTrack.parity, lc_stringformat);
									} else {
										gr.DrawString(String.fromCharCode(80), g_font_checkbox, columnColor, icon_x + g_z3, this.y + g_z3, queue_w + g_z2, cTrack.height + cTrack.parity, lc_stringformat);
									};
								} else { // if not selected
									gr.FillSolidRect(icon_x - 1, this.y + g_z8 - 1, queue_w + g_z6 + 2, cTrack.height - g_z16 + 2, g_color_normal_txt & 0x08ffffff);
									if (this.queue_idx > 0) {
										gr.DrawString(num(this.queue_idx, 2), g_font_queue_idx, columnColor & 0xbbffffff, icon_x + g_z3, this.y, queue_w, cTrack.height + cTrack.parity, lc_stringformat);
									};
								};
							};
						} else {
							gr.SetTextRenderingHint(5);
							if (plman.IsPlaylistItemSelected(p.list.playlist, this.track_index)) { // if selected
								if (this.queue_idx > 0) {
									gr.DrawRect(icon_x - 1, this.y + g_z8 - 1, queue_w + g_z6 + 1, cTrack.height - g_z16 + 1, 1.0, columnColor & 0x77ffffff);
									gr.DrawString(num(this.queue_idx, 2), g_font_queue_idx, columnColor, icon_x + g_z3, this.y, queue_w, cTrack.height + cTrack.parity, lc_stringformat);
								} else {
									gr.DrawString(String.fromCharCode(80), g_font_checkbox, columnColor, icon_x + g_z3, this.y + g_z3, queue_w + g_z2, cTrack.height + cTrack.parity, lc_stringformat);
								};
							} else { // if not selected
								gr.FillSolidRect(icon_x - 1, this.y + g_z8 - 1, queue_w + g_z6 + 2, cTrack.height - g_z16 + 2, g_color_normal_txt & 0x08ffffff);
								if (this.queue_idx > 0) {
									gr.DrawString(num(this.queue_idx, 2), g_font_queue_idx, g_color_highlight & 0xbbffffff, icon_x + g_z3, this.y, queue_w, cTrack.height + cTrack.parity, lc_stringformat);
								};
							};
						};
					} else {
						gr.SetTextRenderingHint(5);
						if (plman.IsPlaylistItemSelected(p.list.playlist, this.track_index)) { // if selected
							if (this.queue_idx > 0) {
								gr.DrawRect(icon_x - 1, this.y + g_z8 - 1, queue_w + g_z6 + 1, cTrack.height - g_z16 + 1, 1.0, columnColor & 0x77ffffff);
								gr.DrawString(num(this.queue_idx, 2), g_font_queue_idx, columnColor, icon_x + g_z3, this.y, queue_w, cTrack.height + cTrack.parity, lc_stringformat);
							} else {
								gr.DrawString(String.fromCharCode(80), g_font_checkbox, columnColor, icon_x + g_z3, this.y + g_z3, queue_w + g_z2, cTrack.height + cTrack.parity, lc_stringformat);
							};
						} else { // if not selected
							gr.FillSolidRect(icon_x - 1, this.y + g_z8 - 1, queue_w + g_z6 + 2, cTrack.height - g_z16 + 2, g_color_normal_txt & 0x08ffffff);
							if (this.queue_idx > 0) {
								gr.DrawString(num(this.queue_idx, 2), g_font_queue_idx, g_color_highlight & 0xbbffffff, icon_x + g_z3, this.y, queue_w, cTrack.height + cTrack.parity, lc_stringformat);
							};
						};
					};
					break;
				case "Mood":
					if (typeof(this.mood) == "undefined") {
						this.mood = fb.TitleFormat(p.headerBar.columns[j].tf).EvalWithMetadb(this.metadb);
						var moodArray = this.parseTF(this.mood, this.text_colour);
						this.mood = moodArray[0];
						this.mood_color = moodArray[1];
					};
					columns.mood = true;
					// column width
					if (g_font_guifx_found) {
						columns.mood_w = gr.CalcTextWidth("v", g_font_mood) + 3;
					} else {
						columns.mood_w = gr.CalcTextWidth(String.fromCharCode(252), g_font_mood) + 3;
					};
					// for minimum width for this column
					p.headerBar.columns[j].minWidth = zoom(36, g_dpi);
					// column x
					switch (p.headerBar.columns[j].align) {
					case 0:
						columns.mood_x = cx - 2;
						break;
					case 1:
						columns.mood_x = cx + Math.floor((cw - columns.mood_w) / 2);
						break;
					case 2:
						columns.mood_x = cx + cw - columns.mood_w + 6;
						break;
					};
					if (this.tracktype < 2) {
						var m_color = (this.mood != 0 ? this.mood_color : this.text_colour_default & 0x16ffffff);
					} else {
						var m_color = this.text_colour_default & 0x16ffffff;
					};
					if (g_font_guifx_found) {
						gr.SetTextRenderingHint(4);
						gr.DrawString("v", g_font_mood, m_color, columns.mood_x, this.y + 1, columns.mood_w, cTrack.height + cTrack.parity - 1, lc_stringformat);
					} else {
						gr.SetTextRenderingHint(4);
						gr.DrawString(String.fromCharCode(60), g_font_mood, m_color, columns.mood_x, this.y + 3, columns.mood_w, cTrack.height + cTrack.parity - 1, lc_stringformat);
					};
					break;
				case "Rating":
					cw = p.headerBar.columns[j].w - g_z6;
					if (typeof(this.rating) == "undefined") {
						this.rating = fb.TitleFormat(p.headerBar.columns[j].tf).EvalWithMetadb(this.metadb);
						var ratingArray = this.parseTF(this.rating, this.text_colour);
						this.rating = ratingArray[0];
						this.rating_color = ratingArray[1];
					};
					columns.rating = true;
					// column width
					if (g_font_guifx_found) {
						columns.rating_w = gr.CalcTextWidth("bbbbb", g_font_rating);
					} else {
						columns.rating_w = gr.CalcTextWidth(String.fromCharCode(234).repeat(5), g_font_rating);
					};
					// for minimum width for this column
					p.headerBar.columns[j].minWidth = columns.rating_w + zoom(7.5, g_dpi);
					//
					var one_star_w = Math.round(columns.rating_w / 5);
					var total_stars_drawable = Math.floor((cw - 2) / one_star_w);
					if (total_stars_drawable > 5)
						total_stars_drawable = 5;
					// column x
					switch (p.headerBar.columns[j].align) {
					case 0:
						columns.rating_x = cx - 2 + 3;
						break;
					case 1:
						columns.rating_x = cx + 3 + Math.round((cw - 6 - one_star_w * total_stars_drawable) / 2) - 1;
						break;
					case 2:
						columns.rating_x = cx + 3 + cw - 6 - one_star_w * total_stars_drawable;
						break;
					};
					if (g_font_guifx_found) {
						gr.SetTextRenderingHint(3);
						//gr.DrawString(". ".repeat(total_stars_drawable), gdi_font("lucida console", zoom(12, g_dpi), 2), this.text_colour_default & 0x20ffffff, columns.rating_x - 3 + 03, this.y - 1 - 02, cw + 1, cTrack.height + cTrack.parity, lc_stringformat);
						gr.DrawString("b".repeat(total_stars_drawable), g_font_rating, this.text_colour_default & 0x20ffffff, columns.rating_x - 2, this.y, cw + 1, cTrack.height + cTrack.parity, lc_stringformat);
						gr.DrawString("b".repeat(Math.round(this.rating > total_stars_drawable ? total_stars_drawable : this.rating)), g_font_rating, RGBA(0, 0, 0, 40), columns.rating_x - 2, this.y, cw + 1, cTrack.height + cTrack.parity, lc_stringformat);
						gr.DrawString("b".repeat(Math.round(this.rating > total_stars_drawable ? total_stars_drawable : this.rating)), g_font_rating, this.rating_color, columns.rating_x - 3, this.y - 1, cw + 1, cTrack.height + cTrack.parity, lc_stringformat);
						if (total_stars_drawable < 5) {
							var drawn_star_w = gr.CalcTextWidth("b".repeat(total_stars_drawable), g_font_rating) - 1;
							gr.GdiDrawText("...", g_font, this.text_colour_default, columns.rating_x - 6 + drawn_star_w, this.y - 1, columns.rating_w + 1, cTrack.height + cTrack.parity, g_LDT);
						};
					} else {
						gr.SetTextRenderingHint(3);
						gr.DrawString(String.fromCharCode(234).repeat(total_stars_drawable), g_font_rating, this.text_colour_default & 0x20ffffff, columns.rating_x - 3, this.y + 3, cw + 1, cTrack.height + cTrack.parity, lc_stringformat);
						gr.DrawString(String.fromCharCode(234).repeat(Math.round(this.rating > total_stars_drawable ? total_stars_drawable : this.rating)), g_font_rating, RGBA(0, 0, 0, 40), columns.rating_x - 3, this.y + 3, cw + 1, cTrack.height + cTrack.parity, lc_stringformat);
						gr.DrawString(String.fromCharCode(234).repeat(Math.round(this.rating > total_stars_drawable ? total_stars_drawable : this.rating)), g_font_rating, this.rating_color, columns.rating_x - 4, this.y + 2, cw + 1, cTrack.height + cTrack.parity, lc_stringformat);
						if (total_stars_drawable < 5) {
							var drawn_star_w = gr.CalcTextWidth(String.fromCharCode(234).repeat(total_stars_drawable), g_font_rating);
							gr.GdiDrawText("...", g_font, this.text_colour_default, columns.rating_x - 6 + drawn_star_w, this.y, cw + 1, cTrack.height + cTrack.parity, g_LDT);
						};
					};
					break;
				default:
					// Common TF parsing
					var eval_play = false;
					var tf_prep = p.headerBar.columns[j].tf;
					// PARSING special TF fields in 1st TF line
					if (tf_prep != "null") {
						// %list_index%
						tf_prep = replaceAll(tf_prep, "%list_index%", (this.track_index + 1).toString());
						// %list_total%
						tf_prep = replaceAll(tf_prep, "%list_total%", p.list.count.toString());
						// %isplaying%
						if (fb.IsPlaying && plman.PlayingPlaylist == this.playlist && this.track_index == p.list.nowplaying.PlaylistItemIndex) {
							tf_prep = replaceAll(tf_prep, "%isplaying%", "$greater(1,0)");
							eval_play = true;
						} else {
							tf_prep = replaceAll(tf_prep, "%isplaying%", "$greater(0,1)");
						};
						// Evaluate TF field after parsing
						if (eval_play) {
							tf1 = fb.TitleFormat(tf_prep).Eval(true);
						} else {
							tf1 = fb.TitleFormat(tf_prep).EvalWithMetadb(this.metadb);
						};
					};
				};
				// draw the general field parsed above
				// ===================================
				if (j > 0 && tf1 && tf1 != "null") {
					//try {
					DrawColoredText(gr, tf1, g_font, blendColors(this.text_colour, RGB(255, 255, 255), (cList.enableExtraLine ? 0.10 : 0.00)), cx, tf1_y, cw, tf1_h, p.headerBar.columns[j].DT_align, !this.normalTextColor);
					//gr.GdiDrawText(tf1, g_font, blendColors(this.text_colour, RGB(255,255,255), (cList.enableExtraLine ? 0.10 : 0.00)), cx, tf1_y, cw, tf1_h, p.headerBar.columns[j].DT_align | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
					if (cList.enableExtraLine) {
						tf_prep = p.headerBar.columns[j].tf2;
						// PARSING special TF fields in extra TF line
						if (tf_prep != "null") {
							// %list_index%
							tf_prep = replaceAll(tf_prep, "%list_index%", (this.track_index + 1).toString());
							// %list_total%
							tf_prep = replaceAll(tf_prep, "%list_total%", p.list.count.toString());
							// %isplaying%
							if (fb.IsPlaying && plman.PlayingPlaylist == this.playlist && this.track_index == p.list.nowplaying.PlaylistItemIndex) {
								tf_prep = replaceAll(tf_prep, "%isplaying%", "$greater(1,0)");
								eval_play = true;
							} else {
								tf_prep = replaceAll(tf_prep, "%isplaying%", "$greater(0,1)");
							};
							// Evaluate TF field after parsing
							if (eval_play) {
								tf2 = fb.TitleFormat(tf_prep).Eval(true);
							} else {
								tf2 = fb.TitleFormat(tf_prep).EvalWithMetadb(this.metadb);
							};
						} else {
							tf2 = "";
						};
						DrawColoredText(gr, tf2, gdi_font(g_fname, g_fsize - 1, g_fstyle), blendColors(this.text_colour, RGB(0, 0, 0), 0.25), cx, tf2_y, cw, tf2_h, p.headerBar.columns[j].DT_align, !this.normalTextColor);
						//gr.GdiDrawText(tf2, gdi_font(g_fname, g_fsize - 1, g_fstyle), blendColors(this.text_colour, RGB(0,0,0), 0.25), cx, tf2_y, cw, tf2_h, p.headerBar.columns[j].DT_align | DT_CALCRECT | DT_TOP | DT_END_ELLIPSIS | DT_NOPREFIX);
					};
					//} catch (e) {};
				};
			} else {
				switch (p.headerBar.columns[j].ref) {
				case "Mood":
					columns.mood = false;
					break;
				case "Rating":
					columns.rating = false;
					break;
				};
			};
		};
	};

	this.draw = function (gr, x, y, w, h) {
		this.x = x + 1;
		this.y = y;
		this.w = w - 2;
		this.h = h;
		switch (this.type) {
		case 0:
			// ===============
			// draw track item
			// ===============
			if (cover.column) {
				cover.w = p.headerBar.columns[0].w;
				cover.h = cover.w;
			} else {
				cover.w = 0;
				cover.h = 0;
			};
			if (this.empty_row_index == 0) {
				this.queue_idx = plman.FindPlaybackQueueItemIndex(this.metadb, this.playlist, this.track_index) + 1;
				this.normalTextColor = false;
				if (fb.IsPlaying && plman.PlayingPlaylist == this.playlist && this.track_index == p.list.nowplaying.PlaylistItemIndex) {
					// playing track bg
					if (plman.IsPlaylistItemSelected(p.list.playlist, this.track_index)) {
						if (p.list.focusedTrackId == this.track_index) {
							//**
							gr.FillSolidRect(this.x + cover.w + 2, this.y + 3, this.w - cover.w - 4, this.h - 6, g_color_selected_bg & RGBA(255, 255, 255, properties.selection_rect_alpha));
							// frame on focused item
							gr.DrawRect(this.x + cover.w + 1, this.y + 2, this.w - cover.w - 2, this.h - 4, 2.0, g_color_selected_bg & RGBA(255, 255, 255, properties.focus_rect_alpha));
						} else {
							//**
							gr.FillSolidRect(this.x + cover.w, this.y + 1, this.w - cover.w, this.h - 2, g_color_selected_bg & RGBA(255, 255, 255, properties.selection_rect_alpha));
						};
					} else {
						// if row is focused, draw focused colors & style ELSE draw with normal colors
						if (p.list.focusedTrackId == this.track_index) {
							this.text_colour = blendColors(g_color_highlight, g_color_normal_bg, 0.1);
							// frame on focused item
							gr.DrawRect(this.x + cover.w + 1, this.y + 2, this.w - cover.w - 2, this.h - 4, 2.0, g_color_normal_txt & RGBA(255, 255, 255, properties.focus_rect_alpha));
						} else {
							// draw stripes of the normal row background
							if (properties.oddevenrowshighlight) {
								if (properties.showgroupheaders) {
									var parity = ((this.track_index_in_group / 2) == Math.floor(this.track_index_in_group / 2) ? 1 : 0);
								} else {
									var parity = ((this.track_index / 2) == Math.floor(this.track_index / 2) ? 1 : 0);
								};
								if (parity == 0) {
									gr.FillSolidRect(this.x + cover.w, this.y, this.w - cover.w, this.h, g_color_normal_txt & 0x05ffffff);
								};
							};
						};
					};
					this.text_colour = p.list.text_colour_playing;
				} else {
					// no playing track bg
					if (plman.IsPlaylistItemSelected(p.list.playlist, this.track_index)) {
						if (p.list.focusedTrackId == this.track_index) {
							//**
							gr.FillSolidRect(this.x + cover.w + 2, this.y + 3, this.w - cover.w - 4, this.h - 6, g_color_selected_bg & RGBA(255, 255, 255, properties.selection_rect_alpha));
							// frame on focused item
							gr.DrawRect(this.x + cover.w + 1, this.y + 2, this.w - cover.w - 2, this.h - 4, 2.0, g_color_selected_bg & RGBA(255, 255, 255, properties.focus_rect_alpha));
						} else {
							//**
							gr.FillSolidRect(this.x + cover.w, this.y + 1, this.w - cover.w, this.h - 2, g_color_selected_bg & RGBA(255, 255, 255, properties.selection_rect_alpha));
						};
						this.text_colour = p.list.text_colour_selected;
					} else {
						// if row is focused, draw focused colors & style ELSE draw with normal colors
						if (p.list.focusedTrackId == this.track_index) {
							// frame on focused item
							gr.DrawRect(this.x + cover.w + 1, this.y + 2, this.w - cover.w - 2, this.h - 4, 2.0, g_color_normal_txt & RGBA(255, 255, 255, properties.focus_rect_alpha));
						} else {
							// draw stripes of the normal row background
							if (properties.oddevenrowshighlight) {
								if (properties.showgroupheaders) {
									var parity = ((this.track_index_in_group / 2) == Math.floor(this.track_index_in_group / 2) ? 1 : 0);
								} else {
									var parity = ((this.track_index / 2) == Math.floor(this.track_index / 2) ? 1 : 0);
								};
								if (parity == 0) {
									gr.FillSolidRect(this.x + cover.w, this.y, this.w - cover.w, this.h, g_color_normal_txt & 0x05ffffff);
								};
							};
						};
						this.normalTextColor = true;
						this.text_colour = g_color_normal_txt;
					};
				};
			} else {
				/*
				// draw stripes for the empty rows
				var parity = ((this.track_index_in_group / 2) == Math.floor(this.track_index_in_group / 2)? 1 : 0);
				if(parity == 0) {
				gr.FillSolidRect(this.x + cover.w, this.y, this.w - cover.w, this.h, RGBA(000,000,000,5));
				} else {
				gr.FillSolidRect(this.x + cover.w, this.y, this.w - cover.w, this.h, RGBA(255,255,255,5));
				};
				*/
				// if last empty track of the group, draw group length info
				/*
				if (cGroup.extra_rows > 0 && this.track_index_in_group == p.list.groups[this.group_index].count) {
				gr.GdiDrawText("Total Group Length = " + TimeFromSeconds(Math.round(p.list.groups[this.group_index].total_time_length)), gdi_font("Arial", 10, 0), g_color_normal_txt, this.x, this.y, this.w - 010, this.h, DT_RIGHT | DT_TOP | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX | DT_SINGLELINE | DT_END_ELLIPSIS);
				};
				*/
			};

			// now playing track
			if (this.empty_row_index == 0) {
				if (fb.IsPlaying) {
					if (plman.PlayingPlaylist == this.playlist) {
						if (this.track_index == p.list.nowplaying.PlaylistItemIndex) {
							p.list.nowplaying_y = this.y;
						};
					};
				};
			};

			// if no group header draw a thin line on the top of the 1st track of the group
			if (cover.column && !properties.showgroupheaders && this.track_index_in_group == 0) {
				gr.FillGradRect(this.x, this.y, this.w, 1, 0, 0, g_color_normal_txt & 0x10ffffff, 0.9);
			};

			// Draw Track content
			// ==================
			if (this.empty_row_index == 0) {
				this.text_colour_default = this.text_colour;
				this.drawRowContents(gr);
			};

			// Draw cover art
			// ==============
			if (cover.column) {
				if (this.row_index == 0 && this.track_index_in_group > 0 && this.track_index_in_group <= Math.ceil(cover.h / cTrack.height)) {
					var cover_draw_delta = this.track_index_in_group * cTrack.height;
				} else {
					var cover_draw_delta = 0;
				};
				if ((this.track_index_in_group == 0 || (this.row_index == 0 && cover_draw_delta > 0))) {
					// cover bg
					if (properties.showgroupsheader) {
						var cMargin = cover.margin;
					} else {
						var cMargin = 4;
					};
					var cv_x = Math.floor(this.x + cMargin);
					var cv_y = Math.floor((this.y - cover_draw_delta) + cMargin);
					var cv_w = Math.floor(cover.w - cMargin * 2);
					var cv_h = Math.floor(cover.h - cMargin * 2);

					var groupmetadb = p.list.handleList[p.list.groups[this.group_index].start];
					this.cover_img = g_image_cache.hit(groupmetadb);
					//
					if (typeof this.cover_img != "undefined") {
						if (this.cover_img == null) {
							this.cover_img = images.nocover;
						};
						if (this.cover_img) {
							if (cover.keepaspectratio) {
								// *** check aspect ratio *** //
								if (this.cover_img.Height >= this.cover_img.Width) {
									var ratio = this.cover_img.Width / this.cover_img.Height;
									var pw = cv_w * ratio;
									var ph = cv_h;
									this.left = Math.floor((ph - pw) / 2);
									this.top = 0;
									cv_x += this.left;
									cv_y += this.top;
									cv_w = cv_w - this.left * 2 - 1;
									cv_h = cv_h - this.top * 2 - 1;
								} else {
									var ratio = this.cover_img.Height / this.cover_img.Width;
									var pw = cv_w;
									var ph = cv_h * ratio;
									this.top = Math.floor((pw - ph) / 2);
									this.left = 0;
									cv_x += this.left;
									cv_y += this.top;
									cv_w = cv_w - this.left * 2 - 1;
									cv_h = cv_h - this.top * 2 - 1;
								};
								// *** check aspect ratio *** //
							};

							gr.SetSmoothingMode(2);
							gr.DrawRect(cv_x + 1, cv_y + 1, cv_w - 2.0, cv_h - 2.0, 6.0, RGBA(0, 0, 10, 60));
							gr.SetSmoothingMode(0);
							if (p.headerBar.columns[0].w < cover.max_w) {
								gr.DrawImage(this.cover_img.Resize(cv_w, cv_h, 2), cv_x, cv_y, cv_w, cv_h, 0, 0, cv_w, cv_h);
							} else {
								gr.DrawImage(this.cover_img, cv_x, cv_y, cv_w, cv_h, 0, 0, this.cover_img.Width, this.cover_img.Height);
							};
							gr.DrawRect(cv_x, cv_y, cv_w, cv_h, 2.0, RGB(255, 255, 255));
						};
					} else {
						gr.DrawImage(images.loading, cv_x - 2, cv_y - 2, cv_w, cv_h, 0, 0, images.loading.Width, images.loading.Height, images.loading_angle, 225);
					};
				};
			};

			// if dragging items, draw line at top of the hover items to show where dragged items will be inserted on mouse button up
			if (!properties.enableTouchControl) {
				if (!cPlaylistManager.hscroll_timer && mouse_x < (p.playlistManager.x - p.playlistManager.woffset) - 30) {
					if (this.empty_row_index == 0) {
						if (dragndrop.drag_in && this.ishover && p.list.ishover) {
							if (p.playlistManager.woffset == 0 || cPlaylistManager.visible) {
								if (!plman.IsPlaylistItemSelected(p.list.playlist, this.track_index)) {
									if (this.track_index > dragndrop.drag_id) {
										gr.FillSolidRect(this.x + cover.w, this.y + this.h - Math.floor(cList.borderWidth / 2), this.w - cover.w, cList.borderWidth, g_color_selected_bg);
										gr.FillSolidRect(this.x + cover.w, this.y + this.h - Math.floor(cList.borderWidth / 2) - 3 * cList.borderWidth, cList.borderWidth, 7 * cList.borderWidth, g_color_selected_bg);
										gr.FillSolidRect(this.x + this.w - cList.borderWidth, this.y + this.h - Math.floor(cList.borderWidth / 2) - 3 * cList.borderWidth, cList.borderWidth, 7 * cList.borderWidth, g_color_selected_bg);
										dragndrop.drop_id = this.track_index;
									} else if (this.track_index < dragndrop.drag_id) {
										gr.FillSolidRect(this.x + cover.w, this.y - Math.floor(cList.borderWidth / 2), this.w - cover.w, cList.borderWidth, g_color_selected_bg);
										gr.FillSolidRect(this.x + cover.w, this.y - Math.floor(cList.borderWidth / 2) - 3 * cList.borderWidth, cList.borderWidth, 7 * cList.borderWidth, g_color_selected_bg);
										gr.FillSolidRect(this.x + this.w - cList.borderWidth, this.y - Math.floor(cList.borderWidth / 2) - 3 * cList.borderWidth, cList.borderWidth, 7 * cList.borderWidth, g_color_selected_bg);
										dragndrop.drop_id = this.track_index;
									};
								} else {
									dragndrop.drop_id = -1;
								};
							};
						};
					};
				};
			};

			if (this.ishover && g_dragndrop_status && g_dragndrop_rowId > -1) {
				if (this.row_index == g_dragndrop_rowId) {
					gr.FillSolidRect(this.x + cover.w, this.y - Math.floor(cList.borderWidth / 2), this.w - cover.w, cList.borderWidth, g_color_selected_bg);
					gr.FillSolidRect(this.x + cover.w, this.y - Math.floor(cList.borderWidth / 2) - 3 * cList.borderWidth, cList.borderWidth, 7 * cList.borderWidth, g_color_selected_bg);
					gr.FillSolidRect(this.x + this.w - cList.borderWidth, this.y - Math.floor(cList.borderWidth / 2) - 3 * cList.borderWidth, cList.borderWidth, 7 * cList.borderWidth, g_color_selected_bg);
				};
			};

			break;
		case 1:
			// ===============
			// draw group item
			// ===============
			if (this.obj) {
				if (!cover.column || (cover.column && this.obj.collapsed)) {
					if (this.heightInRow > 1 && cover.show) {
						cover.h = this.heightInRow * cTrack.height;
						cover.w = cover.h;
					} else {
						cover.h = g_z5;
						cover.w = cover.h;
					};
				} else {
					cover.h = g_z4;
					cover.w = cover.h;
				};
			} else {
				cover.h = g_z4;
				cover.w = cover.h;
			};
			var groupDelta = this.groupRowDelta * cTrack.height;

			// group header bg
			gr.FillSolidRect(this.x, (this.y - groupDelta), this.w, 1, g_color_normal_txt & 0x10ffffff);
			gr.FillSolidRect(this.x, (this.y - groupDelta) + 1, this.w, this.h - 2, g_color_normal_txt & 0x04ffffff);

			// draw group text infos
			var text_left_padding = g_z2;
			var scrollbar_gape = (p.scrollbar.visible && (p.list.totalRows > p.list.totalRowVisible)) ? 0 : cScrollBar.width;

			var color_txt = g_color_selected_txt;
			if (fb.IsPlaying && this.obj) {
				if (plman.PlayingPlaylist == this.playlist) {
					if (p.list.nowplaying.PlaylistItemIndex >= this.obj.start && p.list.nowplaying.PlaylistItemIndex < this.obj.start + this.obj.count) {
						color_txt = g_color_highlight;
					};
				};
			};

			this.l1_color = blendColors(g_color_normal_txt, blendColors(g_color_normal_txt, color_txt, 0.70), 0.70);
			this.l2_color = blendColors(g_color_normal_txt, blendColors(g_color_normal_bg, color_txt, 0.70), 0.70);
			var line_color = p.list.line_color;

			// Draw Header content
			// ===================
			switch (this.heightInRow) {
			case 1:
				var lg1_right_field_w = gr.CalcTextWidth(this.r1, g_font_group1) + cList.borderWidth * 2;
				gr.GdiDrawText(this.l1 + " / " + this.l2, g_font_group1, this.l1_color, this.x + cover.w + text_left_padding, (this.y - groupDelta) - 1, this.w - cover.w - text_left_padding * 4 - lg1_right_field_w - scrollbar_gape, this.h, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX | DT_SINGLELINE | DT_END_ELLIPSIS);
				gr.GdiDrawText(this.r1, g_font_group1, this.l1_color, this.x + cover.w + text_left_padding, (this.y - groupDelta) - 1, this.w - cover.w - text_left_padding * 5 + 2 - scrollbar_gape, this.h, DT_RIGHT | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX | DT_SINGLELINE | DT_END_ELLIPSIS | DT_NOPREFIX);
				gr.FillSolidRect(this.x + cover.w + text_left_padding, Math.round(this.y + cTrack.height * 1 - groupDelta - 5), this.w - cover.w - text_left_padding * 5 + 2 - scrollbar_gape, 1.0, line_color);
				break;
			case 2:
				var lg1_right_field_w = gr.CalcTextWidth(this.r1, g_font_group1) + cList.borderWidth * 2;
				var lg2_right_field_w = gr.CalcTextWidth(this.r2, g_font_group2) + cList.borderWidth * 2;
				gr.GdiDrawText(this.l1, g_font_group1, this.l1_color, this.x + cover.w + text_left_padding, (this.y - groupDelta) + 3, this.w - cover.w - text_left_padding * 4 - lg1_right_field_w - scrollbar_gape, cTrack.height, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX | DT_SINGLELINE | DT_END_ELLIPSIS);
				gr.GdiDrawText(this.l2, g_font_group2, this.l2_color, this.x + cover.w + text_left_padding, (this.y + cTrack.height - groupDelta) - 6, this.w - cover.w - text_left_padding * 4 - lg2_right_field_w - scrollbar_gape, cTrack.height, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX | DT_SINGLELINE | DT_END_ELLIPSIS);
				gr.GdiDrawText(this.r1, g_font_group1, this.l1_color, this.x + cover.w + text_left_padding, (this.y - groupDelta) + 3, this.w - cover.w - text_left_padding * 5 + 2 - scrollbar_gape, cTrack.height, DT_RIGHT | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX | DT_SINGLELINE | DT_END_ELLIPSIS);
				gr.GdiDrawText(this.r2, g_font_group2, this.l2_color, this.x + cover.w + text_left_padding, (this.y + cTrack.height - groupDelta) - 6, this.w - cover.w - text_left_padding * 5 + 1 - scrollbar_gape, cTrack.height, DT_RIGHT | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX | DT_SINGLELINE | DT_END_ELLIPSIS);
				gr.FillSolidRect(this.x + cover.w + text_left_padding, (this.y + cTrack.height * 2 - groupDelta) - 8, this.w - cover.w - text_left_padding * 5 + 2 - scrollbar_gape, 1.0, line_color);
				break;
			default:
				var lg1_right_field_w = gr.CalcTextWidth(this.r1, g_font_group1) + cList.borderWidth * 2;
				var lg2_right_field_w = gr.CalcTextWidth(this.r2, g_font_group2) + cList.borderWidth * 2;
				gr.GdiDrawText(this.l1, g_font_group1, this.l1_color, this.x + cover.w + text_left_padding, (this.y - groupDelta) + 3, this.w - cover.w - text_left_padding * 4 - lg1_right_field_w - scrollbar_gape, cTrack.height, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX | DT_SINGLELINE | DT_END_ELLIPSIS);
				gr.GdiDrawText(this.l2, g_font_group2, this.l2_color, this.x + cover.w + text_left_padding, (this.y + cTrack.height - groupDelta) - 4, this.w - cover.w - text_left_padding * 4 - lg2_right_field_w - scrollbar_gape, cTrack.height, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX | DT_SINGLELINE | DT_END_ELLIPSIS);
				gr.GdiDrawText(this.r1, g_font_group1, this.l1_color, this.x + cover.w + text_left_padding, (this.y - groupDelta) + 3, this.w - cover.w - text_left_padding * 5 + 2 - scrollbar_gape, cTrack.height, DT_RIGHT | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX | DT_SINGLELINE | DT_END_ELLIPSIS);
				gr.GdiDrawText(this.r2, g_font_group2, this.l2_color, this.x + cover.w + text_left_padding, (this.y + cTrack.height - groupDelta) - 4, this.w - cover.w - text_left_padding * 5 + 1 - scrollbar_gape, cTrack.height, DT_RIGHT | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX | DT_SINGLELINE | DT_END_ELLIPSIS);
				// lg 3 (not customizable)
				gr.FillSolidRect(this.x + cover.w + text_left_padding, (this.y + cTrack.height * 2 - groupDelta) - 1, this.w - cover.w - text_left_padding * 5 + 2 - scrollbar_gape, 1.0, line_color);
				if (this.obj) {
					var lg3_left_field = this.obj.count + (this.obj.count > 1 ? " tracks. " : " track. ") + this.obj.total_group_duration_txt;
				} else {
					var lg3_left_field = "";
				}
				var lg3_right_field = (this.group_index + 1) + " / " + p.list.groups.length;
				var lg3_right_field_w = gr.CalcTextWidth(lg3_right_field, g_font) + cList.borderWidth * 2;
				gr.GdiDrawText(lg3_left_field, g_font, blendColors(g_color_normal_txt, g_color_normal_bg, 0.35), this.x + cover.w + text_left_padding, (this.y + cTrack.height * 2 - groupDelta) - 2, this.w - cover.w - text_left_padding * 4 - lg3_right_field_w - scrollbar_gape, cTrack.height, DT_LEFT | DT_TOP | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX | DT_SINGLELINE | DT_END_ELLIPSIS);
				gr.GdiDrawText(lg3_right_field, g_font, blendColors(g_color_normal_txt, g_color_normal_bg, 0.35), this.x + cover.w + text_left_padding, (this.y + cTrack.height * 2 - groupDelta) - 2, this.w - cover.w - text_left_padding * 5 + 01 - scrollbar_gape, cTrack.height, DT_RIGHT | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX | DT_SINGLELINE | DT_END_ELLIPSIS);
			};

			// highlight group that contains a selected track
			var now_playing_found = false;
			if (this.obj) {
				for (var k = 0; k < this.obj.count; k++) {
					if (plman.IsPlaylistItemSelected(p.list.playlist, this.obj.start + k) && this.obj.collapsed) {
						gr.FillSolidRect(this.x, (this.y - groupDelta) + 1, this.w, this.h - 2, g_color_selected_bg & 0x20ffffff);
						break;
					} else {
						// highlight the now playing group header
						if (fb.IsPlaying) {
							if (plman.PlayingPlaylist == this.playlist) {
								if (!now_playing_found && p.list.nowplaying.PlaylistItemIndex >= this.obj.start && p.list.nowplaying.PlaylistItemIndex < this.obj.start + this.obj.count && this.obj.collapsed) {
									gr.FillSolidRect(this.x, (this.y - groupDelta) + 1, this.w, this.h - 2, g_color_highlight & 0x16ffffff);
									now_playing_found = true;
								};
							};
						};
					};
				};
			};

			// Draw cover art
			// ==============
			if (this.obj) {
				if (!cover.column || (cover.column && this.obj.collapsed)) {
					if (this.heightInRow > 1 && cover.show) {
						// cover bg
						var cv_x = Math.floor(this.x + cover.margin + 1);
						var cv_y = Math.floor((this.y - groupDelta) + cover.margin);
						var cv_w = Math.floor(cover.w - cover.margin * 2);
						var cv_h = Math.floor(cover.h - cover.margin * 2);
						//
						this.cover_img = g_image_cache.hit(this.metadb);
						//
						if (typeof this.cover_img != "undefined") {
							if (this.cover_img == null) {
								this.cover_img = images.nocover;
							};
							if (this.cover_img) {
								if (cover.keepaspectratio) {
									// *** check aspect ratio *** //
									if (this.cover_img.Height >= this.cover_img.Width) {
										var ratio = this.cover_img.Width / this.cover_img.Height;
										var pw = cv_w * ratio;
										var ph = cv_h;
										this.left = Math.floor((ph - pw) / 2);
										this.top = 0;
										cv_x += this.left;
										cv_y += this.top;
										cv_w = cv_w - this.left * 2 - 1;
										cv_h = cv_h - this.top * 2 - 1;
									} else {
										var ratio = this.cover_img.Height / this.cover_img.Width;
										var pw = cv_w;
										var ph = cv_h * ratio;
										this.top = Math.floor((pw - ph) / 2);
										this.left = 0;
										cv_x += this.left;
										cv_y += this.top;
										cv_w = cv_w - this.left * 2 - 1;
										cv_h = cv_h - this.top * 2 - 1;
									};
									// *** check aspect ratio *** //
								};

								gr.SetSmoothingMode(2);
								gr.DrawRect(cv_x + 1, cv_y + 1, cv_w - 2.0, cv_h - 2.0, 6.0, RGBA(0, 0, 10, 60));
								gr.SetSmoothingMode(0);
								if (this.obj.collapsed) {
									gr.DrawImage(this.cover_img.Resize(cv_w, cv_h, 2), cv_x, cv_y, cv_w, cv_h, 0, 0, cv_w, cv_h);
								} else {
									gr.DrawImage(this.cover_img, cv_x, cv_y, cv_w, cv_h, 0, 0, this.cover_img.Width, this.cover_img.Height);
								};
								gr.DrawRect(cv_x, cv_y, cv_w, cv_h, 2.0, RGB(255, 255, 255));
							};
						} else {
							gr.DrawImage(images.loading, cv_x - 2, cv_y - 2, cv_w, cv_h, 0, 0, images.loading.Width, images.loading.Height, images.loading_angle, 225);
						};
					};
				};
			};

			// if dragging items, draw line at top of the hover items to show where dragged items will be inserted on mouse button up
			if (this.obj) {
				if (!properties.enableTouchControl) {
					if (!cPlaylistManager.hscroll_timer && mouse_x < (p.playlistManager.x - p.playlistManager.woffset) - 30) {
						if (dragndrop.drag_in && this.ishover && p.list.ishover) {
							if (p.playlistManager.woffset == 0 || cPlaylistManager.visible) {
								if (!plman.IsPlaylistItemSelected(plman.ActivePlaylist, this.track_index)) {
									var cover_w = (p.headerBar.columns[0].percent > 0 ? p.headerBar.columns[0].w : 0);
									if (this.track_index <= dragndrop.drag_id) {
										if (this.groupRowDelta == 0) {
											gr.FillSolidRect(this.x + cover_w, this.y - Math.floor(cList.borderWidth / 2), this.w - cover_w, cList.borderWidth, g_color_selected_bg);
											gr.FillSolidRect(this.x + cover_w, this.y - Math.floor(cList.borderWidth / 2) - 3 * cList.borderWidth, cList.borderWidth, 7 * cList.borderWidth, g_color_selected_bg);
											gr.FillSolidRect(this.x + this.w - cList.borderWidth, this.y - Math.floor(cList.borderWidth / 2) - 3 * cList.borderWidth, cList.borderWidth, 7 * cList.borderWidth, g_color_selected_bg);
										}
										if (this.obj.collapsed) {
											dragndrop.drop_id = this.track_index;
										} else {
											dragndrop.drop_id = this.track_index;
										};
									} else {
										if (this.obj.collapsed) {
											gr.FillSolidRect(this.x + cover_w, this.y + this.h - Math.floor(cList.borderWidth / 2), this.w - cover_w, cList.borderWidth, g_color_selected_bg);
											gr.FillSolidRect(this.x + cover_w, this.y + this.h - Math.floor(cList.borderWidth / 2) - 3 * cList.borderWidth, cList.borderWidth, 7 * cList.borderWidth, g_color_selected_bg);
											gr.FillSolidRect(this.x + this.w - cList.borderWidth, this.y + this.h - Math.floor(cList.borderWidth / 2) - 3 * cList.borderWidth, cList.borderWidth, 7 * cList.borderWidth, g_color_selected_bg);
											dragndrop.drop_id = this.track_index + this.obj.count - 1;
										} else {
											gr.FillSolidRect(this.x + cover_w, this.y + this.h - Math.floor(cList.borderWidth / 2), this.w - cover_w, cList.borderWidth, g_color_selected_bg);
											gr.FillSolidRect(this.x + cover_w, this.y + this.h - Math.floor(cList.borderWidth / 2) - 3 * cList.borderWidth, cList.borderWidth, 7 * cList.borderWidth, g_color_selected_bg);
											gr.FillSolidRect(this.x + this.w - cList.borderWidth, this.y + this.h - Math.floor(cList.borderWidth / 2) - 3 * cList.borderWidth, cList.borderWidth, 7 * cList.borderWidth, g_color_selected_bg);
											dragndrop.drop_id = this.track_index - 1;
										};
									};
								} else {
									dragndrop.drop_id = -1;
								};
							};
						};
					};
				};
			};

			if (this.ishover && g_dragndrop_status && g_dragndrop_rowId > -1) {
				if (this.row_index == g_dragndrop_rowId) {
					gr.FillSolidRect(this.x + cover.w * 0, this.y - Math.floor(cList.borderWidth / 2), this.w - cover.w * 0, cList.borderWidth, g_color_selected_bg);
					gr.FillSolidRect(this.x + cover.w * 0, this.y - Math.floor(cList.borderWidth / 2) - 3 * cList.borderWidth, cList.borderWidth, 7 * cList.borderWidth, g_color_selected_bg);
					gr.FillSolidRect(this.x + this.w - cList.borderWidth, this.y - Math.floor(cList.borderWidth / 2) - 3 * cList.borderWidth, cList.borderWidth, 7 * cList.borderWidth, g_color_selected_bg);
				};
			};
			break;
		};
	};

	this.dragndrop_check = function (x, y, id) {
		var groupDelta = this.groupRowDelta * cTrack.height;
		var col_cover_w = (p.headerBar.columns[0].percent > 0 ? p.headerBar.columns[0].w : 0);
		this.ishover = (x >= this.x + col_cover_w && x < this.x + this.w && y >= this.y && y < this.y + this.h - groupDelta);
		if (this.ishover) { // p.list.count is mandatory > 0 (if not with couldn't be in Item section)
			var trackId = p.list.getTrackId(this.row_index);
			g_dragndrop_trackId = this.track_index;
			g_dragndrop_rowId = this.row_index;
		};
	};

	this.check = function (event, x, y) {
		var groupDelta = this.groupRowDelta * cTrack.height;
		var col_cover_w = (p.headerBar.columns[0].percent > 0 ? p.headerBar.columns[0].w : 0);
		this.ishover = (x >= this.x + col_cover_w && x < this.x + this.w && y >= this.y && y < this.y + this.h - groupDelta);

		var prev_rating_hover = this.rating_hover;
		var prev_l_rating = this.l_rating;
		var prev_mood_hover = this.mood_hover;
		var prev_l_mood = this.l_mood;
		this.rating_hover = (this.type == 0 && this.empty_row_index == 0 && x >= columns.rating_x && x <= columns.rating_x + columns.rating_w && y > this.y + 2 && y < this.y + this.h - 2);
		this.mood_hover = (this.type == 0 && this.empty_row_index == 0 && x >= columns.mood_x && x <= columns.mood_x + columns.mood_w - 3 && y > this.y + 2 && y < this.y + this.h - 2);

		switch (event) {
		case "down":
			if (this.ishover) {
				if (cTouch.down) {
					cTouch.down_id = this.track_index;
				};
				if (!cTouch.down || (cTouch.down && cTouch.down_id == cTouch.up_id)) {
					p.list.item_clicked = true;
					if (this.type == 1) { // group header
						if (utils.IsKeyPressed(VK_SHIFT)) {
							if (this.obj && p.list.focusedTrackId != this.track_index) {
								if (p.list.SHIFT_start_id != null) {
									p.list.selectAtoB(p.list.SHIFT_start_id, this.track_index + this.obj.count - 1);
								} else {
									p.list.selectAtoB(p.list.focusedTrackId, this.track_index + this.obj.count - 1);
								};
							};
						} else if (utils.IsKeyPressed(VK_CONTROL)) {
							plman.SetPlaylistFocusItem(p.list.playlist, this.track_index);
							p.list.selectGroupTracks(this.group_index, true);
							p.list.SHIFT_start_id = null;
						} else {
							plman.SetPlaylistFocusItem(p.list.playlist, this.track_index);
							plman.ClearPlaylistSelection(p.list.playlist);
							if (this.obj) {
								if ((properties.autocollapse && !this.obj.collapsed) || !properties.autocollapse) {
									p.list.selectGroupTracks(this.group_index, true);
								};
							};
							p.list.SHIFT_start_id = null;
							if (p.list.metadblist_selection.Count >= 1) {
								dragndrop.clicked = true;
								dragndrop.moved = false;
								dragndrop.x = x;
								dragndrop.y = y;
								dragndrop.drag_id = this.track_index;
								dragndrop.timerID = window.SetTimeout(function () {
									dragndrop.drag_in = true;
									dragndrop.timerID && window.ClearTimeout(dragndrop.timerID);
									dragndrop.timerID = false;
								}, 250);
							};
						};
						if (this.obj && properties.autocollapse) {
							if (this.obj.collapsed) {
								p.list.updateGroupStatus(this.group_index);
								//**
								//p.scrollbar.setCursor(p.list.totalRowVisible, p.list.totalRows, p.list.offset);
								full_repaint();
							};
						};
						p.list.metadblist_selection = plman.GetPlaylistSelectedItems(p.list.playlist);
					} else { // track
						if (this.rating_hover) {
							columns.rating_drag = true;
						} else if (this.mood_hover) {
							columns.mood_drag = true;
						} else {
							if (plman.IsPlaylistItemSelected(p.list.playlist, this.track_index)) {
								if (p.list.metadblist_selection.Count >= 1) {
									dragndrop.clicked = true;
									dragndrop.moved = false;
									dragndrop.x = x;
									dragndrop.y = y;
									if (p.list.metadblist_selection.Count > 1) {
										// test if selection is contigus, if not, drag'n drop disable
										var first_item_selected_id = p.list.handleList.Find(p.list.metadblist_selection[0]);
										var last_item_selected_id = p.list.handleList.Find(p.list.metadblist_selection[p.list.metadblist_selection.Count - 1]);
										var contigus_count = (last_item_selected_id - first_item_selected_id) + 1;
									} else {
										var contigus_count = 0;
									};
									if (p.list.metadblist_selection.Count == 1 || (p.list.metadblist_selection.Count > 1 && p.list.metadblist_selection.Count == contigus_count)) {
										dragndrop.contigus_sel = true;
										dragndrop.drag_id = this.track_index;
										dragndrop.timerID = window.SetTimeout(function () {
											dragndrop.drag_in = true;
											dragndrop.timerID && window.ClearTimeout(dragndrop.timerID);
											dragndrop.timerID = false;
										}, 250);
									} else if (p.list.metadblist_selection.Count > 1) {
										dragndrop.contigus_sel = false;
										dragndrop.drag_id = this.track_index;
										dragndrop.timerID = window.SetTimeout(function () {
											dragndrop.drag_in = true;
											dragndrop.timerID && window.ClearTimeout(dragndrop.timerID);
											dragndrop.timerID = false;
										}, 250);
									};
								};
								if (utils.IsKeyPressed(VK_SHIFT)) {
									if (p.list.focusedTrackId != this.track_index) {
										if (p.list.SHIFT_start_id != null) {
											p.list.selectAtoB(p.list.SHIFT_start_id, this.track_index);
										} else {
											p.list.selectAtoB(p.list.focusedTrackId, this.track_index);
										};
									};
								} else if (utils.IsKeyPressed(VK_CONTROL)) {
									plman.SetPlaylistSelectionSingle(p.list.playlist, this.track_index, false);
									//};
								} else if (p.list.metadblist_selection.Count == 1) {
									plman.SetPlaylistFocusItem(p.list.playlist, this.track_index);
									plman.ClearPlaylistSelection(p.list.playlist);
									plman.SetPlaylistSelectionSingle(p.list.playlist, this.track_index, true);
								};
							} else { // click on a not selected track
								if (utils.IsKeyPressed(VK_SHIFT)) {
									if (p.list.focusedTrackId != this.track_index) {
										if (p.list.SHIFT_start_id != null) {
											p.list.selectAtoB(p.list.SHIFT_start_id, this.track_index);
										} else {
											p.list.selectAtoB(p.list.focusedTrackId, this.track_index);
										};
									};
								} else {
									if (!properties.enableTouchControl) {
										p.list.selX = x;
										p.list.selY = y;
										p.list.drawRectSel_click = true;
										p.list.selStartId = this.track_index;
										p.list.selStartOffset = p.list.offset;
										p.list.selEndOffset = p.list.offset;
										p.list.selDeltaRows = 0;
										p.list.selAffected.splice(0, p.list.selAffected.length);
									};
									plman.SetPlaylistFocusItem(p.list.playlist, this.track_index);
									if (!utils.IsKeyPressed(VK_CONTROL)) {
										plman.ClearPlaylistSelection(p.list.playlist);
									};
									plman.SetPlaylistSelectionSingle(p.list.playlist, this.track_index, true);
									p.list.SHIFT_start_id = null;
								};
							};
							p.list.metadblist_selection = plman.GetPlaylistSelectedItems(p.list.playlist);
						};
					};
				};
			};
			break;
		case "dblclk":
			if (this.ishover) {
				if (this.type == 1) { // group header
					if (properties.autocollapse) {
						/*
						if(this.obj) {
						if(this.obj.collapsed) {
						p.list.updateGroupStatus(this.group_index);
						} else {
						p.list.updateGroupsOnCollapse(this.group_index);
						};
						};
						*/
					} else {
						if (this.obj) {
							if (this.obj.collapsed) {
								p.list.updateGroupsOnExpand(this.group_index);
							} else {
								p.list.updateGroupsOnCollapse(this.group_index);
							};
						};
					};
					p.list.setItems(false);
					//**p.scrollbar.setCursor(p.list.totalRowVisible, p.list.totalRows, p.list.offset);
					full_repaint();
				} else { // track
					var cmd = properties.defaultPlaylistItemAction;
					if (cmd == "Play") {
						plman.ExecutePlaylistDefaultAction(p.list.playlist, this.track_index);
					} else {
						fb.RunContextCommandWithMetadb(cmd, this.metadb, 0);
					};
				};
			};
			break;
		case "up":
			if (this.ishover) {
				if (cTouch.down) {
					cTouch.up_id = this.track_index;
					if (cTouch.down_id == cTouch.up_id) {
						this.check("down", x, y);
					};
				};
				if (!cTouch.down || (cTouch.down && cTouch.down_id == cTouch.up_id)) {
					if (this.rating_hover) {
						// Rating
						if (this.tracktype < 2) {
							if (foo_playcount) {
								// Rate to database statistics brought by foo_playcount.dll
								if (this.l_rating != this.rating) {
									if (this.metadb) {
										fb.RunContextCommandWithMetadb("Playback Statistics/Rating/" + ((this.l_rating == 0) ? "<not set>" : this.l_rating), this.metadb);
										this.rating = this.l_rating;
									};
								} else {
									fb.RunContextCommandWithMetadb("Playback Statistics/Rating/<not set>", this.metadb);
									this.rating = 0;
								};
							} else {
								var handles = new FbMetadbHandleList(this.metadb);
								if (this.l_rating != this.rating) {
									handles.UpdateFileInfoFromJSON(JSON.stringify({"RATING" : this.l_rating}));
									this.rating = this.l_rating;
								} else {
									handles.UpdateFileInfoFromJSON(JSON.stringify({"RATING" : ""}));
									this.rating = 0;
								};
							};
						};
					} else if (this.mood_hover) {
						// Mood
						if (this.tracktype < 2) {
							var handles = new FbMetadbHandleList(this.metadb);
							if (this.l_mood != this.mood) {
								handles.UpdateFileInfoFromJSON(JSON.stringify({"MOOD" : getTimestamp()}));
								this.mood = this.l_mood;
							} else {
								handles.UpdateFileInfoFromJSON(JSON.stringify({"MOOD" : ""}));
								this.mood = 0;
							};
						};
					} else if (!cTouch.down) {
						if (!p.list.drawRectSel && plman.IsPlaylistItemSelected(p.list.playlist, this.track_index)) {
							if (!utils.IsKeyPressed(VK_SHIFT) && !utils.IsKeyPressed(VK_CONTROL)) {
								if (!dragndrop.drag_in) {
									if (this.type == 0) { // track
										plman.SetPlaylistFocusItem(p.list.playlist, this.track_index);
										plman.ClearPlaylistSelection(p.list.playlist);
										plman.SetPlaylistSelectionSingle(p.list.playlist, this.track_index, true);
									};
								};
							};
						};
					};
				};
			};
			this.drawRectSel_click = false;
			this.drawRectSel = false;
			dragndrop.clicked = false;
			dragndrop.moved = false;
			columns.rating_drag = false;
			columns.mood_drag = false;
			break;
		case "right":
			if (this.ishover) {
				if (this.type == 1) { // group header
					if (!plman.IsPlaylistItemSelected(p.list.playlist, this.track_index)) {
						plman.ClearPlaylistSelection(p.list.playlist);
						plman.SetPlaylistFocusItem(p.list.playlist, this.track_index);
						p.list.selectGroupTracks(this.group_index, true);
						p.list.SHIFT_start_id = null;
					};
					p.list.contextMenu(x, y, this.track_index, this.row_index);
				} else { // track
					if (this.rating_hover) {}
					else if (this.mood_hover) {}
					else {
						if (plman.IsPlaylistItemSelected(p.list.playlist, this.track_index)) {}
						else {
							plman.SetPlaylistFocusItem(p.list.playlist, this.track_index);
							plman.ClearPlaylistSelection(p.list.playlist);
							plman.SetPlaylistSelectionSingle(p.list.playlist, this.track_index, true);
						};
						p.list.contextMenu(x, y, this.track_index, this.row_index);
					};
				};
			};
			break;
		case "move":
			if (columns.rating && !columns.rating_drag) {
				if (this.rating_hover) {
					var one_star_w = Math.round(columns.rating_w / 5);
					this.l_rating = Math.floor((x - columns.rating_x) / one_star_w) + 1;
					if (this.l_rating > 5)
						this.l_rating = 5;
				} else {
					this.l_rating = 0;
				};
			};
			if (columns.mood && !columns.mood_drag) {
				if (this.mood_hover) {
					this.l_mood = 1;
				} else {
					this.l_mood = 0;
				};
			};
			// update tooltip text
			if (this.tooltip && this.ishover) {
				g_tooltip_txt = this.title;
			};

			// update on mouse move to draw rect selection zone
			if (!this.drawRectSel) {
				this.drawRectSel = this.drawRectSel_click;
			};
			if (p.list.drawRectSel) {
				if (this.ishover) {
					if (this.type == 0) { // track
						p.list.selEndId = this.track_index;
					} else { // group header
						if (this.track_index > 0) {
							if (y > p.list.selY) {
								if (p.list.selStartId <= p.list.selEndId) {
									if (this.track_index == this.track_index + 1) {
										p.list.selEndId = this.track_index - 0;
									} else {
										p.list.selEndId = this.track_index - 1;
									};
								} else {
									if (this.track_index == this.track_index + 1) {
										p.list.selEndId = this.track_index - 1;
									} else {
										p.list.selEndId = this.track_index - 0;
									};
								};
							} else {
								if (p.list.selStartId < p.list.selEndId) {
									if (this.track_index == this.track_index + 1) {
										p.list.selEndId = this.track_index - 0;
									} else {
										p.list.selEndId = this.track_index - 1;
									};
								} else {
									if (this.track_index == this.track_index + 1) {
										p.list.selEndId = this.track_index - 1;
									} else {
										p.list.selEndId = this.track_index - 0;
									};
								};
							};
						};
					};

					if (!cList.repaint_timer) {
						window.SetCursor(IDC_HAND);
						cList.repaint_timer = window.SetInterval(function () {
								if (mouse_y < p.list.y + cTrack.height * 0) {
									p.list.selEndId = p.list.selEndId > 0 ? p.list.items[0].track_index : 0;
									if (p.scrollbar.visible)
										on_mouse_wheel(1);
								} else if (mouse_y > p.list.y + p.list.h - cTrack.height * 0) {
									p.list.selEndId = p.list.selEndId < p.list.count - 1 ? p.list.items[p.list.items.length - 1].track_index : p.list.count - 1;
									if (p.scrollbar.visible)
										on_mouse_wheel(-1);
								};
								// set selection on items in the rect area drawn
								plman.SetPlaylistSelection(p.list.playlist, p.list.selAffected, false);
								p.list.selAffected.splice(0, p.list.selAffected.length);
								var deb = p.list.selStartId <= p.list.selEndId ? p.list.selStartId : p.list.selEndId;
								var fin = p.list.selStartId <= p.list.selEndId ? p.list.selEndId : p.list.selStartId;
								for (var i = deb; i <= fin; i++) {
									p.list.selAffected.push(i);
								};
								plman.SetPlaylistSelection(p.list.playlist, p.list.selAffected, true);
								p.list.metadblist_selection = plman.GetPlaylistSelectedItems(p.list.playlist);
								plman.SetPlaylistFocusItem(p.list.playlist, p.list.selEndId);
								//
								p.list.selEndOffset = p.list.offset;
							}, 100);
					} else {
						window.SetCursor(IDC_ARROW);
					};
				};
			};
			if (dragndrop.clicked) {
				dragndrop.moved = true;
			};
			break;
		};
	};
};

oGroupBy = function (label, tf, sortOrder, ref, playlistFilter, extraRows, collapsedHeight, expandedHeight, showCover, autoCollapse, l1, r1, l2, r2, collapseGroupsByDefault) {
	this.label = label;
	this.tf = tf;
	this.sortOrder = sortOrder;
	this.ref = ref;
	this.l1 = l1;
	this.r1 = r1;
	this.l2 = l2;
	this.r2 = r2;
	this.playlistFilter = playlistFilter;
	this.collapsedHeight = collapsedHeight;
	this.expandedHeight = expandedHeight;
	this.extraRows = extraRows;
	this.showCover = showCover;
	this.autoCollapse = autoCollapse;
	this.collapseGroupsByDefault = collapseGroupsByDefault;
};

oList = function (object_name, playlist) {
	this.objectName = object_name;
	this.playlist = playlist;
	this.focusedTrackId = plman.GetPlaylistFocusItemIndex(this.playlist);
	this.handleList = plman.GetPlaylistItems(this.playlist);
	this.count = this.handleList.Count;
	this.groups = [];
	this.items = [];
	this.groupby = [];
	this.totalGroupBy = window.GetProperty("SYSTEM.Groups.TotalGroupBy", 0);
	this.metadblist_selection = plman.GetPlaylistSelectedItems(this.playlist);
	this.SHIFT_start_id = null;
	this.SHIFT_count = 0;
	this.ishover = false;
	this.buttonclicked = false;
	this.selAffected = [];
	this.drawRectSel_click = false;
	this.drawRectSel = false;
	this.beam = 0;
	this.item_clicked = false;

	// items variables used in Item object (optimization)
	this.setItemColors = function () {
		this.text_colour_playing = blendColors(g_color_highlight, g_color_normal_bg, 0.1);
		this.text_colour_selected = blendColors(g_color_selected_txt, g_color_normal_bg, 0.1);
		this.line_color = blendColors(g_color_normal_txt, g_color_normal_bg, 0.45);
	};
	this.setItemColors();

	this.saveGroupBy = function () {
		var tmp;
		var fin = this.groupby.length;
		for (var j = 0; j < 15; j++) {
			tmp = "";
			for (var i = 0; i < fin; i++) {
				switch (j) {
				case 0:
					tmp = tmp + this.groupby[i].label;
					break;
				case 1:
					tmp = tmp + this.groupby[i].tf;
					break;
				case 2:
					tmp = tmp + this.groupby[i].sortOrder;
					break;
				case 3:
					tmp = tmp + this.groupby[i].ref;
					break;
				case 4:
					tmp = tmp + this.groupby[i].playlistFilter;
					break;
				case 5:
					tmp = tmp + this.groupby[i].extraRows;
					break;
				case 6:
					tmp = tmp + this.groupby[i].collapsedHeight;
					break;
				case 7:
					tmp = tmp + this.groupby[i].expandedHeight;
					break;
				case 8:
					tmp = tmp + this.groupby[i].showCover;
					break;
				case 9:
					tmp = tmp + this.groupby[i].autoCollapse;
					break;
				case 10:
					tmp = tmp + this.groupby[i].l1;
					break;
				case 11:
					tmp = tmp + this.groupby[i].r1;
					break;
				case 12:
					tmp = tmp + this.groupby[i].l2;
					break;
				case 13:
					tmp = tmp + this.groupby[i].r2;
					break;
				case 14:
					tmp = tmp + this.groupby[i].collapseGroupsByDefault;
					break;
				};
				// add separator
				if (i < this.groupby.length - 1) {
					tmp = tmp + "^^";
				};
			};
			switch (j) {
			case 0:
				window.SetProperty("SYSTEM.GroupBy.label", tmp);
				break;
			case 1:
				window.SetProperty("SYSTEM.GroupBy.tf", tmp);
				break;
			case 2:
				window.SetProperty("SYSTEM.GroupBy.sortOrder", tmp);
				break;
			case 3:
				window.SetProperty("SYSTEM.GroupBy.ref", tmp);
				break;
			case 4:
				window.SetProperty("SYSTEM.GroupBy.playlistFilter", tmp);
				break;
			case 5:
				window.SetProperty("SYSTEM.GroupBy.extraRows", tmp);
				break;
			case 6:
				window.SetProperty("SYSTEM.GroupBy.collapsedHeight", tmp);
				break;
			case 7:
				window.SetProperty("SYSTEM.GroupBy.expandedHeight", tmp);
				break;
			case 8:
				window.SetProperty("SYSTEM.GroupBy.showCover", tmp);
				break;
			case 9:
				window.SetProperty("SYSTEM.GroupBy.autoCollapse", tmp);
				break;
			case 10:
				window.SetProperty("SYSTEM.GroupBy.l1", tmp);
				break;
			case 11:
				window.SetProperty("SYSTEM.GroupBy.r1", tmp);
				break;
			case 12:
				window.SetProperty("SYSTEM.GroupBy.l2", tmp);
				break;
			case 13:
				window.SetProperty("SYSTEM.GroupBy.r2", tmp);
				break;
			case 14:
				window.SetProperty("SYSTEM.GroupBy.collapseGroupsByDefault", tmp);
				break;
			};
		};
		this.initGroupBy();
	};

	this.initGroupBy = function () {
		this.groupby.splice(0, this.groupby.length);
		if (this.totalGroupBy == 0) {
			// INITIALIZE GroupBy patterns
			var fields = [],
			tmp,
			fin;

			for (var i = 0; i < 15; i++) {
				switch (i) {
				case 0:
					fields.push(new Array("Album Artist | Album | Disc", "Folder Structure"));
					break;
				case 1:
					fields.push(new Array("%album artist%%album%%discnumber%", "$replace(%path%,%filename_ext%,)"));
					break;
				case 2:
					fields.push(new Array("%album artist% | $if(%album%,%date%,'9999') | %album% | %discnumber% | %tracknumber% | %title%", "%path%"));
					break;
				case 3:
					fields.push(new Array("Album", "Custom"));
					break;
				case 4: // playlist filter
					fields.push(new Array("null", "null"));
					break;
				case 5: // extra rows
					fields.push(new Array("0", "0"));
					break;
				case 6: // collapsed height
					fields.push(new Array("2", "2"));
					break;
				case 7: // expanded height
					fields.push(new Array("3", "3"));
					break;
				case 8: // show cover
					fields.push(new Array("1", "1"));
					break;
				case 9: // auto collapse
					fields.push(new Array("0", "0"));
					break;
				case 10: // l1
					fields.push(new Array("$if(%album%,%album% ['('Disc %discnumber%[ of %totaldiscs%]')'],$if(%length%,'Single(s)','Streams'))", "$directory(%path%,1)"));
					break;
				case 11: // r1
					fields.push(new Array("$if(%date%,$year($replace(%date%,/,-,.,-)),'-')", "$if(%date%,$year($replace(%date%,/,-,.,-)),'-')"));
					break;
				case 12: // l2
					fields.push(new Array("$if(%length%,%album artist%)", "$directory(%path%,2)"));
					break;
				case 13: // r2
					fields.push(new Array("$if2(%genre%,'Other')", "$if2(%genre%,'Other')"));
					break;
				case 14: // collapseGroupsByDefault
					fields.push(new Array("0", "0"));
					break;
				};
				// convert array to csv string
				tmp = "";
				fin = fields[i].length;
				for (var j = 0; j < fin; j++) {
					tmp = tmp + fields[i][j];
					if (j < fields[i].length - 1) {
						tmp = tmp + "^^";
					};
				};
				// save CSV string into window Properties
				switch (i) {
				case 0:
					window.SetProperty("SYSTEM.GroupBy.label", tmp);
					break;
				case 1:
					window.SetProperty("SYSTEM.GroupBy.tf", tmp);
					break;
				case 2:
					window.SetProperty("SYSTEM.GroupBy.sortOrder", tmp);
					break;
				case 3:
					window.SetProperty("SYSTEM.GroupBy.ref", tmp);
					break;
				case 4:
					window.SetProperty("SYSTEM.GroupBy.playlistFilter", tmp);
					break;
				case 5:
					window.SetProperty("SYSTEM.GroupBy.extraRows", tmp);
					break;
				case 6:
					window.SetProperty("SYSTEM.GroupBy.collapsedHeight", tmp);
					break;
				case 7:
					window.SetProperty("SYSTEM.GroupBy.expandedHeight", tmp);
					break;
				case 8:
					window.SetProperty("SYSTEM.GroupBy.showCover", tmp);
					break;
				case 9:
					window.SetProperty("SYSTEM.GroupBy.autoCollapse", tmp);
					break;
				case 10:
					window.SetProperty("SYSTEM.GroupBy.l1", tmp);
					break;
				case 11:
					window.SetProperty("SYSTEM.GroupBy.r1", tmp);
					break;
				case 12:
					window.SetProperty("SYSTEM.GroupBy.l2", tmp);
					break;
				case 13:
					window.SetProperty("SYSTEM.GroupBy.r2", tmp);
					break;
				case 14:
					window.SetProperty("SYSTEM.GroupBy.collapseGroupsByDefault", tmp);
					break;
				};
			};
			// create GroupBy Objects
			this.totalGroupBy = fields[0].length;
			window.SetProperty("SYSTEM.Groups.TotalGroupBy", this.totalGroupBy);
			for (var k = 0; k < this.totalGroupBy; k++) {
				this.groupby.push(new oGroupBy(fields[0][k], fields[1][k], fields[2][k], fields[3][k], fields[4][k], fields[5][k], fields[6][k], fields[7][k], fields[8][k], fields[9][k], fields[10][k], fields[11][k], fields[12][k], fields[13][k], fields[14][k]));
			};

		} else {
			var fields = [];
			var tmp;
			// LOAD GroupBy patterns from Properties
			for (var i = 0; i < 15; i++) {
				switch (i) {
				case 0:
					tmp = window.GetProperty("SYSTEM.GroupBy.label", "?;?");
					break;
				case 1:
					tmp = window.GetProperty("SYSTEM.GroupBy.tf", "?;?");
					break;
				case 2:
					tmp = window.GetProperty("SYSTEM.GroupBy.sortOrder", "?;?");
					break;
				case 3:
					tmp = window.GetProperty("SYSTEM.GroupBy.ref", "?;?");
					break;
				case 4:
					tmp = window.GetProperty("SYSTEM.GroupBy.playlistFilter", "?;?");
					break;
				case 5:
					tmp = window.GetProperty("SYSTEM.GroupBy.extraRows", "?;?");
					break;
				case 6:
					tmp = window.GetProperty("SYSTEM.GroupBy.collapsedHeight", "?;?");
					break;
				case 7:
					tmp = window.GetProperty("SYSTEM.GroupBy.expandedHeight", "?;?");
					break;
				case 8:
					tmp = window.GetProperty("SYSTEM.GroupBy.showCover", "?;?");
					break;
				case 9:
					tmp = window.GetProperty("SYSTEM.GroupBy.autoCollapse", "?;?");
					break;
				case 10:
					tmp = window.GetProperty("SYSTEM.GroupBy.l1", "?;?");
					break;
				case 11:
					tmp = window.GetProperty("SYSTEM.GroupBy.r1", "?;?");
					break;
				case 12:
					tmp = window.GetProperty("SYSTEM.GroupBy.l2", "?;?");
					break;
				case 13:
					tmp = window.GetProperty("SYSTEM.GroupBy.r2", "?;?");
					break;
				case 14:
					tmp = window.GetProperty("SYSTEM.GroupBy.collapseGroupsByDefault", "?;?");
					break;
				};
				fields.push(tmp.split("^^"));
			};
			for (var k = 0; k < this.totalGroupBy; k++) {
				this.groupby.push(new oGroupBy(fields[0][k], fields[1][k], fields[2][k], fields[3][k], fields[4][k], fields[5][k], fields[6][k], fields[7][k], fields[8][k], fields[9][k], fields[10][k], fields[11][k], fields[12][k], fields[13][k], fields[14][k]));
			};
		};
	};
	this.initGroupBy();

	this.getTotalRows = function () {
		var ct = 0;
		var cv = 0;
		var fin = this.groups.length;
		for (var i = 0; i < fin; i++) {
			this.groups[i].totalPreviousRows += ct;
			this.groups[i].totalPreviousTracks += cv;
			if (this.groups[i].collapsed) {
				ct += cGroup.collapsed_height;
			} else {
				ct += this.groups[i].count + cGroup.expanded_height;
				ct += this.groups[i].rowsToAdd;
			};
			cv += this.groups[i].count;
			cv += this.groups[i].rowsToAdd;
		};
		return ct;
	};

	this.updateGroupsOnCollapse = function (group_id) {
		if (!this.groups[group_id].collapsed) {
			var delta = (this.groups[group_id].count + this.groups[group_id].rowsToAdd) + (cGroup.expanded_height - cGroup.collapsed_height);
			var fin = this.groups.length;
			for (var i = group_id + 1; i < fin; i++) {
				this.groups[i].totalPreviousRows -= delta;
			};
			this.totalRows -= delta;
			if (this.totalRows <= this.totalRowVisible) {
				this.offset = 0;
			} else {
				if (this.totalRows - this.offset < this.totalRowVisible) {
					this.offset = this.totalRows - this.totalRowVisible;
					if (this.offset < 0)
						this.offset = 0;
				};
			};
			this.groups[group_id].collapsed = true;
		};
	};

	this.updateGroupsOnExpand = function (group_id) {
		if (this.groups[group_id].collapsed) {
			var delta = (this.groups[group_id].count + this.groups[group_id].rowsToAdd) + (cGroup.expanded_height - cGroup.collapsed_height);
			var fin = this.groups.length;
			for (var i = group_id + 1; i < fin; i++) {
				this.groups[i].totalPreviousRows += delta;
			};
			this.totalRows += delta;
			if (this.totalRows <= this.totalRowVisible) {
				this.offset = 0;
			} else {
				if (this.totalRows - this.offset < this.totalRowVisible) {
					this.offset = this.totalRows - this.totalRowVisible;
					if (this.offset < 0)
						this.offset = 0;
				};
			};
			this.groups[group_id].collapsed = false;
		};
	};

	this.updateGroupStatus = function (group_id) {
		// collapse previous group of focused track
		if (properties.autocollapse) {
			this.updateGroupsOnCollapse(g_group_id_focused);
		};
		// expand new group of the current focused track (new one)
		this.updateGroupsOnExpand(group_id);
		// update current group id of focused track
		g_group_id_focused = group_id;
	};

	this.updateGroupByPattern = function (pattern_idx) {
		var m = pattern_idx;
		tf_group_key = fb.TitleFormat(this.groupby[m].tf);
		cover.show = (this.groupby[m].showCover == "1" ? true : false);
		properties.autocollapse = (this.groupby[m].autoCollapse == "1" ? true : false);
		cGroup.extra_rows = Math.floor(this.groupby[m].extraRows);
		cGroup.default_collapsed_height = Math.floor(this.groupby[m].collapsedHeight);
		cGroup.collapsed_height = cGroup.default_collapsed_height;
		cGroup.default_expanded_height = Math.floor(this.groupby[m].expandedHeight);
		cGroup.expanded_height = cGroup.default_expanded_height;
		properties.collapseGroupsByDefault = (this.groupby[m].collapseGroupsByDefault == "1" ? true : false);
		// update max_w et max_h for cover loading and repaint in cache image handle functions
		cover.max_w = cGroup.default_collapsed_height > cGroup.default_expanded_height ? cGroup.default_collapsed_height * cTrack.height : cGroup.default_expanded_height * cTrack.height;
		cover.max_h = cGroup.default_collapsed_height > cGroup.default_expanded_height ? cGroup.default_collapsed_height * cTrack.height : cGroup.default_expanded_height * cTrack.height;
		// refresh playlist
		g_image_cache = new image_cache;
	};

	this.init_groups = function (iscollapsed) {
		var handle;
		var length;
		var current;
		var previous;
		var count = 0;
		var start = 0;
		var total_time_length = 0;
		var global_time = 0;
		var arr_pl,
		fin,
		fin2;

		// update group key TF pattern
		if (properties.showgroupheaders) {
			if (properties.enablePlaylistFilter) {
				var pl_name = plman.GetPlaylistName(this.playlist);
				var found = false;
				var default_pattern_index = -1;
				fin = this.groupby.length;
				for (var m = 0; m < fin; m++) {
					if (default_pattern_index > -1 && found) {
						break;
					} else if (this.groupby[m].playlistFilter.length > 0) {
						arr_pl = this.groupby[m].playlistFilter.split(";");
						fin2 = arr_pl.length;
						for (var n = 0; n < fin2; n++) {
							if (default_pattern_index < 0 && arr_pl[n] == "*") {
								default_pattern_index = m;
							};
							if (arr_pl[n] == pl_name) {
								found = true;
								this.updateGroupByPattern(m);
							};
						};
					};
				};
				if (default_pattern_index < 0) {
					// if no default pattern set ('*' in the playlist filter field of a group by pattern), we use the current pattern
					default_pattern_index = cGroup.pattern_idx;
				};
				if (!found) {
					// apply default pattern if playlist not found in patterns playlist-filter
					m = default_pattern_index;
					this.updateGroupByPattern(m);
				};
			} else {
				this.updateGroupByPattern(cGroup.pattern_idx);
			};
		} else {
			tf_group_key = fb.TitleFormat("%path%");
			cGroup.extra_rows = 0;
		};
		// if status just updated in settings, iscollapsed parameter to force
		//iscollapsed = properties.collapseGroupsByDefault;

		this.groups.splice(0, this.groups.length);
		for (var i = 0; i < this.count; i++) {
			handle = this.handleList[i];
			length = fb2k_length(handle);
 			current = properties.showgroupheaders ? tf_group_key.EvalWithMetadb(handle) : handle.Path;
			
			if (previous != current) {
				if (i > 0) {
					this.groups.push(new oGroup(this.groups.length, start, count, total_time_length, this.focusedTrackId, iscollapsed))
				}
				previous = current;
				start = i;
				count = 1;
				total_time_length = length;
			} else {
				count++;
				total_time_length += length;
			}
			
			if (i == this.count - 1) {
				this.groups.push(new oGroup(this.groups.length, start, count, total_time_length, this.focusedTrackId, iscollapsed));
			}
			
			global_time += length;
		};
		// calc total rows for this total handles + groups
		this.totalRows = this.getTotalRows();

		// total seconds playlist for playlist header panel
		g_total_duration_text = utils.FormatDuration(global_time);
	};

	this.updateHandleList = function (playlist, iscollapsed) {
		this.playlist = playlist;
		if (plman.PlaylistItemCount(this.playlist) > 0) {
			this.focusedTrackId = plman.GetPlaylistFocusItemIndex(this.playlist);
		} else {
			this.focusedTrackId = -1;
		};
		this.handleList = plman.GetPlaylistItems(this.playlist);
		this.count = this.handleList.Count;
		this.init_groups(iscollapsed);
		this.getStartOffsetFromFocusId();
	};

	this.setSize = function (x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.totalRowVisible = Math.floor(this.h / cTrack.height);
		this.totalRowToLoad = this.totalRowVisible + 1;
	};

	this.selectAtoB = function (start_id, end_id) {

		var affectedItems = Array();

		if (this.SHIFT_start_id == null) {
			this.SHIFT_start_id = start_id;
		};

		plman.ClearPlaylistSelection(this.playlist);

		var previous_focus_id = this.focusedTrackId;

		if (start_id < end_id) {
			var deb = start_id;
			var fin = end_id;
		} else {
			var deb = end_id;
			var fin = start_id;
		};

		for (var i = deb; i <= fin; i++) {
			affectedItems.push(i);
		};
		plman.SetPlaylistSelection(this.playlist, affectedItems, true);

		plman.SetPlaylistFocusItem(this.playlist, end_id);

		if (affectedItems.length > 1) {
			if (end_id > previous_focus_id) {
				var delta = end_id - previous_focus_id;
				this.SHIFT_count += delta;
			} else {
				var delta = previous_focus_id - end_id;
				this.SHIFT_count -= delta;
			};
		};
	};

	this.selectGroupTracks = function (gp_id, state) {
		var affectedItems = Array();
		var first_trk = this.groups[gp_id].start;
		var total_trks = this.groups[gp_id].count;
		for (var i = first_trk; i < first_trk + total_trks; i++) {
			affectedItems.push(i);
		};
		plman.SetPlaylistSelection(this.playlist, affectedItems, state);
	};

	this.showNowPlaying = function () {
		if (fb.IsPlaying) {
			if (plman.PlayingPlaylist != this.playlist) {
				plman.ActivePlaylist = plman.PlayingPlaylist;
				this.playlist = plman.ActivePlaylist;
				this.nowplaying = plman.GetPlayingItemLocation();
				// set focus on the now playing item
				plman.SetPlaylistFocusItem(this.playlist, this.nowplaying.PlaylistItemIndex);
			} else {
				this.nowplaying = plman.GetPlayingItemLocation();
				// set focus on the now playing item
				plman.SetPlaylistFocusItem(this.playlist, this.nowplaying.PlaylistItemIndex);
				this.setItems(!p.list.isFocusedItemVisible());
				full_repaint();
			};
		};
	};

	this.showFocusedItem = function () {
		this.setItems(true);
		full_repaint();
	};

	this.getStartOffsetFromFocusId = function () {
		var mid = Math.floor(this.totalRowToLoad / 2) - 1;
		if (plman.PlaylistItemCount(this.playlist) > 0) {
			this.focusedTrackId = plman.GetPlaylistFocusItemIndex(this.playlist);
		} else {
			this.focusedTrackId = -1;
		};
		if (this.focusedTrackId < 0) {
			this.offset = 0;
			return this.offset;
		};

		if (this.focusedTrackId < 0 || this.focusedTrackId > this.count)
			this.focusedTrackId = 0;
		this.focusedRowId = this.getRowId(this.focusedTrackId);

		if (this.totalRows > this.totalRowVisible) {
			if (this.focusedRowId <= mid) {
				this.offset = 0;
			} else {
				var d = this.totalRows - (this.focusedRowId + 1);
				if (d >= Math.floor(this.totalRowToLoad / 2)) {
					this.offset = this.focusedRowId - mid;
				} else {
					this.offset = this.totalRows - this.totalRowVisible;
				};
			};
			if (this.offset < 0)
				this.offset = 0;
		} else {
			this.offset = 0;
		};
		return this.offset;
	};

	this.getGroupIdfromTrackId = function (valeur) {
		var mediane = 0;
		var deb = 0;
		var fin = this.groups.length - 1;
		while (deb <= fin) {
			mediane = Math.floor((fin + deb) / 2);
			if (valeur >= this.groups[mediane].start && valeur < this.groups[mediane].start + this.groups[mediane].count) {
				return mediane;
			} else if (valeur < this.groups[mediane].start) {
				fin = mediane - 1;
			} else {
				deb = mediane + 1;
			};
		};
		return -1;
	};

	this.getGroupIdFromRowId = function (valeur) {
		var mediane = 0;
		var deb = 0;
		var fin = this.groups.length - 1;
		while (deb <= fin) {
			mediane = Math.floor((fin + deb) / 2);
			grp_height = this.groups[mediane].collapsed ? cGroup.collapsed_height : cGroup.expanded_height;
			grp_size = this.groups[mediane].collapsed ? grp_height : grp_height + this.groups[mediane].count + this.groups[mediane].rowsToAdd;
			if (valeur >= this.groups[mediane].totalPreviousRows && valeur < this.groups[mediane].totalPreviousRows + grp_size) {
				return mediane;
			} else if (valeur < this.groups[mediane].totalPreviousRows) {
				fin = mediane - 1;
			} else {
				deb = mediane + 1;
			};
		};
		return -1;
	};

	this.getRowId = function (trackId) {
		var grp_id = this.getGroupIdfromTrackId(trackId);
		if (grp_id == -1)
			return -1;
		if (this.groups[grp_id].collapsed) { // track hidden in the collapsed group so return = -1 or we return the row id of the group it belongs to ?
			//var row_index = -1;
			var row_index = this.groups[grp_id].totalPreviousRows + 1;
		} else { // group expanded so we can return a valid row_id for the track searched
			var row_index = this.groups[grp_id].totalPreviousRows + cGroup.expanded_height + (trackId - this.groups[grp_id].start);
		};
		return row_index;
	};

	this.getTrackId = function (rowId) {
		this.s_group_id = this.getGroupIdFromRowId(rowId);
		if (this.s_group_id >= 0) {
			this.s_group_height = this.groups[this.s_group_id].collapsed ? cGroup.collapsed_height : cGroup.expanded_height;
			if (this.groups[this.s_group_id].collapsed) {
				var a = rowId - this.groups[this.s_group_id].totalPreviousRows;
				this.s_groupheader_line_id = a;
				this.s_track_id = this.groups[this.s_group_id].start;
			} else {
				var a = rowId - this.groups[this.s_group_id].totalPreviousRows;
				if (a < this.s_group_height) { // row is in the group header
					this.s_groupheader_line_id = a;
					this.s_track_id = this.groups[this.s_group_id].start;
				} else { // row is a track
					this.s_groupheader_line_id = -1;
					this.s_track_id = (a - this.s_group_height) + this.groups[this.s_group_id].start;
					var track_index_in_group = this.s_track_id - this.groups[this.s_group_id].start;
					if (track_index_in_group >= this.groups[this.s_group_id].count) { // track is a copy of the last track of the group to fill the group with minimum track count in group feature!
						this.s_delta = (track_index_in_group - this.groups[this.s_group_id].count) + 1;
						this.s_track_id -= this.s_delta;
					} else {
						this.s_delta = 0;
					};
				};
			};
			return this.s_track_id;
		} else {
			return 0;
		};
	};

	this.scrollItems = function (delta, scrollstep) {
		cList.scroll_direction = (delta < 0 ? -1 : 1);
		if (delta > 0) { // scroll up
			this.offset -= scrollstep;
			if (this.offset < 0)
				this.offset = 0;
		} else { // scroll down
			this.offset += scrollstep;
			if (this.offset > this.totalRows - this.totalRowVisible) {
				this.offset = this.totalRows - this.totalRowVisible;
			};
			if (this.offset < 0)
				this.offset = 0;
		};
		this.setItems(false);
		p.scrollbar.setCursor(p.list.totalRowVisible, p.list.totalRows, p.list.offset);

		if (properties.smoothscrolling)
			set_scroll_delta();

		if (!p.list.drawRectSel)
			full_repaint();
	};

	this.setItems = function (forceFocus) {
		var track_index_in_group = 0;
		var row_index = 0;
		var m,
		n;
		if (forceFocus) { // from focus item centered in panel
			if (this.totalRows > this.totalRowVisible) {
				var i = this.getStartOffsetFromFocusId();
				if (this.totalRows - this.offset <= this.totalRowVisible) {
					var total_rows_to_draw = this.totalRows < this.totalRowVisible ? this.totalRows : this.totalRowVisible;
				} else {
					var total_rows_to_draw = this.totalRows < this.totalRowToLoad ? this.totalRows : this.totalRowToLoad;
				};

				this.items.splice(0, this.items.length);
				while (i < this.offset + total_rows_to_draw) {
					this.getTrackId(i);
					if (this.s_groupheader_line_id >= 0) { // group header
						this.items.push(new oItem(this.playlist, row_index, 1, this.handleList[this.s_track_id], this.s_track_id, this.s_group_id, 0, this.s_group_height, this.s_groupheader_line_id, this.groups[this.s_group_id], 0));
						i += this.s_group_height - this.s_groupheader_line_id;
						row_index += this.s_group_height - this.s_groupheader_line_id;
					} else { // track row
						track_index_in_group = this.s_track_id - this.groups[this.s_group_id].start + this.s_delta;
						this.items.push(new oItem(this.playlist, row_index, 0, this.handleList[this.s_track_id], this.s_track_id, this.s_group_id, track_index_in_group, 1, 0, null, this.s_delta));
						i++;
						row_index++;
					};
				};
			} else {
				this.offset = 0;
				var i = 0; // offset = 0

				this.items.splice(0, this.items.length);
				while (i < this.totalRows) {
					this.getTrackId(i);
					if (this.s_groupheader_line_id >= 0) { // group header
						this.items.push(new oItem(this.playlist, row_index, 1, this.handleList[this.s_track_id], this.s_track_id, this.s_group_id, 0, this.s_group_height, this.s_groupheader_line_id, this.groups[this.s_group_id], 0));
						i += this.s_group_height - this.s_groupheader_line_id;
						row_index += this.s_group_height - this.s_groupheader_line_id;
					} else { // track row
						track_index_in_group = this.s_track_id - this.groups[this.s_group_id].start + this.s_delta;
						this.items.push(new oItem(this.playlist, row_index, 0, this.handleList[this.s_track_id], this.s_track_id, this.s_group_id, track_index_in_group, 1, 0, null, this.s_delta));
						i++;
						row_index++;
					};
				};
			};
		} else { // fill items from current offset
			if (this.totalRows > this.totalRowVisible) {
				if (typeof(this.offset) == "undefined") {
					this.getStartOffsetFromFocusId();
					console.log("... undefined");
				};

				var i = this.offset;
				if (this.totalRows - this.offset <= this.totalRowVisible) {
					var total_rows_to_draw = this.totalRows < this.totalRowVisible ? this.totalRows : this.totalRowVisible;
				} else {
					var total_rows_to_draw = this.totalRows < this.totalRowToLoad ? this.totalRows : this.totalRowToLoad;
				};

				this.items.splice(0, this.items.length);
				while (i < this.offset + total_rows_to_draw) {
					this.getTrackId(i);
					if (this.s_groupheader_line_id >= 0) { // group header
						this.items.push(new oItem(this.playlist, row_index, 1, this.handleList[this.s_track_id], this.s_track_id, this.s_group_id, 0, this.s_group_height, this.s_groupheader_line_id, this.groups[this.s_group_id], 0));
						i += this.s_group_height - this.s_groupheader_line_id;
						row_index += this.s_group_height - this.s_groupheader_line_id;
					} else { // track row
						track_index_in_group = this.s_track_id - this.groups[this.s_group_id].start + this.s_delta;
						this.items.push(new oItem(this.playlist, row_index, 0, this.handleList[this.s_track_id], this.s_track_id, this.s_group_id, track_index_in_group, 1, 0, null, this.s_delta));
						i++;
						row_index++;
					};
				};
			} else {
				var i = 0; // offset = 0
				this.items.splice(0, this.items.length);
				while (i < this.totalRows) {
					this.getTrackId(i);
					if (this.s_groupheader_line_id >= 0) { // group header
						this.items.push(new oItem(this.playlist, row_index, 1, this.handleList[this.s_track_id], this.s_track_id, this.s_group_id, 0, this.s_group_height, this.s_groupheader_line_id, this.groups[this.s_group_id], 0));
						i += this.s_group_height - this.s_groupheader_line_id;
						row_index += this.s_group_height - this.s_groupheader_line_id;
					} else { // track row
						track_index_in_group = this.s_track_id - this.groups[this.s_group_id].start + this.s_delta;
						this.items.push(new oItem(this.playlist, row_index, 0, this.handleList[this.s_track_id], this.s_track_id, this.s_group_id, track_index_in_group, 1, 0, null, this.s_delta));
						i++;
						row_index++;
					};
				};
			};
		};
	};

	this.getOffsetFromCursorPos = function () {
		var r = (this.cursorPos / this.h);
		this.offset = Math.round(r * this.totalRows);
		if (this.offset < 0)
			this.offset = 0;
	};

	this.isFocusedItemVisible = function () {
		if (this.totalRows <= this.totalRowVisible) {
			return true;
		} else {
			var fin = this.items.length;
			for (var i = 0; i < fin; i++) {
				if (this.items[i].group_index >= 0) {
					if ((this.items[i].type == 0 && this.items[i].empty_row_index == 0) || this.groups[this.items[i].group_index].collapsed) {
						if (this.groups[this.items[i].group_index].collapsed) {
							if (this.focusedTrackId >= this.groups[this.items[i].group_index].start && this.focusedTrackId < this.groups[this.items[i].group_index].start + this.groups[this.items[i].group_index].count) {
								return true;
							};
						} else if (this.focusedTrackId == this.items[i].track_index && this.items[i].row_index < this.totalRowVisible) {
							return true;
						};
					};
				};
			};
		};
		return false;
	};

	this.draw = function (gr) {
		var item_h = 0;

		if (cList.scroll_timer) {
			var row_top_y = this.y - (cList.scroll_delta * cList.scroll_direction);
		} else {
			var row_top_y = this.y;
		};
		var width = 0;

		if (fb.IsPlaying && plman.PlayingPlaylist == this.playlist) {
			this.nowplaying = plman.GetPlayingItemLocation();
		};

		// set variables used in Items object (optimization)
		this.state_queue_w = Math.round(gr.CalcTextWidth("00", g_font_queue_idx) + 1);
		this.state_icon_w = this.state_queue_w + g_z6;

		// Draw items (tracks and group headers)
		var fin = this.items.length;
		for (var i = 0; i < fin; i++) {
			item_h = this.items[i].heightInRow * cTrack.height;
			// test if scrollbar displayed or not for the items width to draw
			if (this.totalRows <= this.totalRowVisible || !properties.showscrollbar) {
				width = this.w;
			} else {
				width = this.w - cScrollBar.width;
			};
			this.items[i].draw(gr, this.x, row_top_y, width, item_h);
			row_top_y += item_h - (this.items[i].groupRowDelta * cTrack.height);
		};

		if (g_dragndrop_status && g_dragndrop_bottom) {
			var rowId = fin - 1;
			var item_height_row = (this.items[rowId].type == 0 ? 1 : this.items[rowId].heightInRow);
			var item_height = item_height_row * cTrack.height;
			var limit = this.items[rowId].y + item_height;
			var rx = this.items[rowId].x;
			var ry = this.items[rowId].y;
			var rw = this.items[rowId].w;

			gr.FillSolidRect(rx + cover.w * 0, ry + item_height - Math.floor(cList.borderWidth / 2), rw - cover.w, cList.borderWidth, g_color_selected_bg);
			gr.FillSolidRect(rx + cover.w * 0, ry + item_height - Math.floor(cList.borderWidth / 2) - 4 * cList.borderWidth, cList.borderWidth, 9 * cList.borderWidth, g_color_selected_bg);
			gr.FillSolidRect(rx + rw - cList.borderWidth, ry + item_height - Math.floor(cList.borderWidth / 2) - 4 * cList.borderWidth, cList.borderWidth, 9 * cList.borderWidth, g_color_selected_bg);
		};

		// Draw rect selection
		if (this.drawRectSel) {
			var rectSelColor = g_color_selected_bg;
			this.selDeltaRows = this.selEndOffset - this.selStartOffset;
			if (this.selX <= mouse_x) {
				if (this.selY - this.selDeltaRows * cTrack.height <= mouse_y) {
					gr.FillSolidRect(this.selX, (this.selY - this.selDeltaRows * cTrack.height), mouse_x - this.selX, mouse_y - (this.selY - this.selDeltaRows * cTrack.height), rectSelColor & 0x33ffffff);
					gr.DrawRect(this.selX, (this.selY - this.selDeltaRows * cTrack.height), mouse_x - this.selX - 1, mouse_y - (this.selY - this.selDeltaRows * cTrack.height) - 1, 1.0, rectSelColor & 0x66ffffff);
				} else {
					gr.FillSolidRect(this.selX, mouse_y, mouse_x - this.selX, this.selY - mouse_y - this.selDeltaRows * cTrack.height, rectSelColor & 0x33ffffff);
					gr.DrawRect(this.selX, mouse_y, mouse_x - this.selX - 1, this.selY - mouse_y - this.selDeltaRows * cTrack.height - 1, 1.0, rectSelColor & 0x66ffffff);
				};
			} else {
				if (this.selY - this.selDeltaRows * cTrack.height <= mouse_y) {
					gr.FillSolidRect(mouse_x, (this.selY - this.selDeltaRows * cTrack.height), this.selX - mouse_x, mouse_y - (this.selY - this.selDeltaRows * cTrack.height), rectSelColor & 0x33ffffff);
					gr.DrawRect(mouse_x, (this.selY - this.selDeltaRows * cTrack.height), this.selX - mouse_x - 1, mouse_y - (this.selY - this.selDeltaRows * cTrack.height) - 1, 1.0, rectSelColor & 0x66ffffff);
				} else {
					gr.FillSolidRect(mouse_x, mouse_y, this.selX - mouse_x, this.selY - mouse_y - this.selDeltaRows * cTrack.height, rectSelColor & 0x33ffffff);
					gr.DrawRect(mouse_x, mouse_y, this.selX - mouse_x - 1, this.selY - mouse_y - this.selDeltaRows * cTrack.height - 1, 1.0, rectSelColor & 0x66ffffff);
				};
			};
		};
	};

	this.repaint = function () {
		window.RepaintRect(this.x, this.y, this.w, this.h);
	};

	this.isHoverObject = function (x, y) {
		return (x > this.x && x < this.x + this.w - p.playlistManager.woffset && y > this.y && y < this.y + this.h);
	};

	this.check = function (event, x, y, delta) {
		this.ishover = this.isHoverObject(x, y);
		switch (event) {
		case "down":
			this.mclicked = this.ishover;
			if (this.ishover) {
				this.item_clicked = false;
				var fin = this.items.length;
				for (var i = 0; i < fin; i++) {
					this.items[i].check(event, x, y);
				};
				if (!cTouch.down) {
					if (!p.scrollbar.isHoverObject(x, y) && x < p.scrollbar.x) { // if not hover the scrollbar
						if (this.items.length > 0 && !this.item_clicked) { // and if click on an empty area of the playlist (after the last item)
							if (!properties.enableTouchControl) {
								this.selX = x;
								this.selY = y;
								this.drawRectSel_click = true;
								this.selStartId = this.items[this.items.length - 1].track_index;
								this.selStartOffset = p.list.offset;
								this.selEndOffset = p.list.offset;
								this.selDeltaRows = 0;
								this.selAffected.splice(0, this.selAffected.length);
							};
							if (!utils.IsKeyPressed(VK_CONTROL)) {
								plman.ClearPlaylistSelection(this.playlist);
							};
							this.SHIFT_start_id = null;
							full_repaint();
						};
					};
				};
			};
			break;
		case "up":
			if (this.ishover) {
				var fin = this.items.length;
				for (var i = 0; i < fin; i++) {
					this.items[i].check(event, x, y);
				};
			};
			p.list.drawRectSel_click = false;
			p.list.drawRectSel = false;
			// kill timer on rect area refresh for "drawRectSel"
			cList.repaint_timer && window.ClearInterval(cList.repaint_timer);
			cList.repaint_timer = false;
			// kill drag move playlist item timers (vscroll)
			cPlaylistManager.vscroll_timer_loop && window.ClearTimeout(cPlaylistManager.vscroll_timer_loop);
			cPlaylistManager.vscroll_timer_loop = false;
			cPlaylistManager.vscroll_timer && window.ClearTimeout(cPlaylistManager.vscroll_timer);
			cPlaylistManager.vscroll_timer = false;
			if (this.mclicked)
				window.SetCursor(IDC_ARROW);
			this.mclicked = false;
			break;
		case "drag_over":
			g_dragndrop_bottom = false;
			if (this.count > 0) {
				var fin = this.items.length;
				for (var i = 0; i < fin; i++) {
					this.items[i].dragndrop_check(x, y, i);
				};
				if (p.playlistManager.woffset == 0 || (cPlaylistManager.visible && x < p.playlistManager.x - p.playlistManager.woffset)) {
					var rowId = fin - 1;
					var item_height_row = (this.items[rowId].type == 0 ? 1 : this.items[rowId].heightInRow);
					var limit = this.items[rowId].y + item_height_row * cTrack.height;
					if (y > limit) {
						g_dragndrop_bottom = true;
						var trackId = p.list.getTrackId(rowId);
						g_dragndrop_trackId = this.items[rowId].track_index;
						g_dragndrop_rowId = trackId;
					};
				};
			} else {
				g_dragndrop_bottom = true;
				g_dragndrop_trackId = 0;
				g_dragndrop_rowId = 0;
			};
			break;
		case "move":
			var fin = this.items.length;
			for (var i = 0; i < fin; i++) {
				this.items[i].check(event, x, y);
			};
			if (!this.drawRectSel) {
				this.drawRectSel = this.drawRectSel_click;
			};
			if (!this.drawRectSel) {
				// hscroll playlist manager panel when dragging tracks if not visible by default
				if (dragndrop.moved || cPlaylistManager.drag_moved) {
					if (!cPlaylistManager.hscroll_timer) {
						if (!cPlaylistManager.visible) {
							if ((p.playlistManager.woffset == 0 && mouse_x > p.list.w / 1.5) || (p.playlistManager.woffset >= cPlaylistManager.width && (mouse_x <= p.list.w / 1.5))) {
								p.playlistManager.refresh("", true, true, false);
								cPlaylistManager.hscroll_timer = window.SetInterval(function () {
										if (mouse_x > p.list.w / 1.5) {
											p.playlistManager.woffset += cPlaylistManager.step;
											if (p.playlistManager.woffset >= cPlaylistManager.width) {
												p.playlistManager.woffset = cPlaylistManager.width;
												cPlaylistManager.hscroll_timer && window.ClearTimeout(cPlaylistManager.hscroll_timer);
												cPlaylistManager.hscroll_timer = false;
											};
											full_repaint();
										} else {
											full_repaint();
											p.playlistManager.woffset -= cPlaylistManager.step;
											if (p.playlistManager.woffset <= 0) {
												p.playlistManager.woffset = 0;
												cPlaylistManager.hscroll_timer && window.ClearTimeout(cPlaylistManager.hscroll_timer);
												cPlaylistManager.hscroll_timer = false;
												full_repaint();
											};
										};
									}, 16);
							};
						};
						if (p.playlistManager.woffset >= cPlaylistManager.width) { // if playlist manager panel opened
							// vscroll playlist manager on dragging
							// ************************************
							var inner_padding = 0;
							//var area_h = Math.floor((p.playlistManager.h - (cPlaylistManager.showStatusBar ? cPlaylistManager.statusBarHeight*0 : 0) ) / cPlaylistManager.rowHeight) * cPlaylistManager.rowHeight;
							var area_h = p.playlistManager.h - (cPlaylistManager.showStatusBar ? cPlaylistManager.statusBarHeight : 0);
							if (x > p.playlistManager.x - p.playlistManager.woffset && x < p.playlistManager.x - p.playlistManager.woffset + p.playlistManager.w) {
								if (p.playlistManager.offset > 0 && y < p.playlistManager.y + cPlaylistManager.rowHeight + inner_padding) {
									if (p.playlistManager.scrollbarWidth > 0 && !cPlaylistManager.vscroll_timer_loop) {
										cPlaylistManager.vscroll_timer_loop = window.SetInterval(function () {
												//
												var s = Math.abs(mouse_y - (p.playlistManager.y + cPlaylistManager.rowHeight));
												var h = Math.ceil(cPlaylistManager.rowHeight / 2);
												if (s > h)
													s = h;
												var t = h - s + 1;
												var r = Math.round(500 / h);
												var scroll_speed_ms = ((t * r) < 10 ? 10 : (t * r));
												//
												if (!cPlaylistManager.vscroll_timer) {
													cPlaylistManager.vscroll_timer = window.SetTimeout(function () {
															p.playlistManager.offset = p.playlistManager.offset > 0 ? p.playlistManager.offset - 1 : 0;
															p.playlistManager.scrollbar.reSet(p.playlistManager.rowTotal, cPlaylistManager.rowHeight, p.playlistManager.offset);
															full_repaint();
															if (p.playlistManager.offset == 0 || p.playlistManager.woffset < cPlaylistManager.width) { // kill interval timer!
																window.ClearTimeout(cPlaylistManager.vscroll_timer_loop);
																cPlaylistManager.vscroll_timer_loop = false;
															};
															window.ClearTimeout(cPlaylistManager.vscroll_timer);
															cPlaylistManager.vscroll_timer = false;
														}, scroll_speed_ms);
												};
											}, 5);
									};
								} else if (p.playlistManager.offset < p.playlistManager.rowTotal - p.playlistManager.totalRows && y > p.playlistManager.y + area_h - inner_padding) {
									if (p.playlistManager.scrollbarWidth > 0 && !cPlaylistManager.vscroll_timer_loop) {
										cPlaylistManager.vscroll_timer_loop = window.SetInterval(function () {
												//
												var s = Math.abs(mouse_y - (p.playlistManager.y + area_h));
												var h = Math.ceil(cPlaylistManager.rowHeight / 2);
												if (s > h)
													s = h;
												var t = h - s + 1;
												var r = Math.round(500 / h);
												var scroll_speed_ms = ((t * r) < 10 ? 10 : (t * r));
												//
												if (!cPlaylistManager.vscroll_timer) {
													cPlaylistManager.vscroll_timer = window.SetTimeout(function () {
															p.playlistManager.offset = p.playlistManager.offset < p.playlistManager.rowTotal - p.playlistManager.totalRows ? p.playlistManager.offset + 1 : p.playlistManager.rowTotal - p.playlistManager.totalRows;
															p.playlistManager.scrollbar.reSet(p.playlistManager.rowTotal, cPlaylistManager.rowHeight, p.playlistManager.offset);
															on_mouse_move(mouse_x + 1, mouse_y); // call mouse_move to set mouse cursor to right image (IDC_NO if not on a playlist item)
															full_repaint();
															if (p.playlistManager.offset == p.playlistManager.rowTotal - p.playlistManager.totalRows || p.playlistManager.woffset < cPlaylistManager.width) { // kill interval timer!
																window.ClearTimeout(cPlaylistManager.vscroll_timer_loop);
																cPlaylistManager.vscroll_timer_loop = false;
															};
															window.ClearTimeout(cPlaylistManager.vscroll_timer);
															cPlaylistManager.vscroll_timer = false;
														}, scroll_speed_ms);
												};
											}, 5);
									};
								} else {
									if (cPlaylistManager.vscroll_timer) {
										window.ClearInterval(cPlaylistManager.vscroll_timer_loop);
										cPlaylistManager.vscroll_timer_loop = false;
									};
									if (!cPlaylistManager.drag_move_timer) {
										cPlaylistManager.drag_move_timer = window.SetTimeout(function () {
												if (p.playlistManager.hoverId != p.playlistManager.hoverId_previous) {
													full_repaint();
													p.playlistManager.hoverId_previous = p.playlistManager.hoverId;
												};
												window.ClearInterval(cPlaylistManager.drag_move_timer);
												cPlaylistManager.drag_move_timer = false;
											}, 50);
									};
								};
							} else {
								if (cPlaylistManager.vscroll_timer_loop) {
									window.ClearInterval(cPlaylistManager.vscroll_timer_loop);
									cPlaylistManager.vscroll_timer_loop = false;
								};
							};
						};
					};
				} else {
					// kill timers
					if (cPlaylistManager.vscroll_timer_loop) {
						window.ClearInterval(cPlaylistManager.vscroll_timer_loop);
						cPlaylistManager.vscroll_timer_loop = false;
					};
				};
			} else if (!this.item_clicked) {
				// if draw Selection Rect from an empty area, repaint on mouse move to show the rect
				full_repaint();
			};
			break;
		default:
			if (this.ishover) {
				for (var i = 0; i < this.items.length; i++) {
					this.items[i].check(event, x, y);
				};
			};
		};
	};

	this.incrementalSearch = function () {
		var count = 0;
		var albumartist,
		artist,
		groupkey;
		var chr;
		var gstart;
		var pid = -1;

		// exit if no search string in cache
		if (cList.search_string.length <= 0)
			return true;

		// 1st char of the search string
		var first_chr = cList.search_string.substring(0, 1);
		var len = cList.search_string.length;

		// which start point for the search
		if (this.count > 1000) {
			albumartist = tf_albumartist.EvalWithMetadb(this.handleList[Math.floor(this.count / 2)]);
			chr = albumartist.substring(0, 1);
			if (first_chr.charCodeAt(first_chr) > chr.charCodeAt(chr)) {
				gstart = Math.floor(this.count / 2);
			} else {
				gstart = 0;
			};
		} else {
			gstart = 0;
		};

		if (!properties.showgroupheaders) {

			// 1st search on "album artist" TAG
			var format_str = "";
			for (var i = gstart; i < this.count; i++) {
				albumartist = tf_albumartist.EvalWithMetadb(this.handleList[i]);
				format_str = albumartist.substring(0, len).toUpperCase();
				if (format_str == cList.search_string) {
					pid = i;
					break;
				};
			};

			// if not found, search in the first part (from 0 to gstart)
			if (pid < 0) {
				var format_str = "";
				for (var i = 0; i < gstart; i++) {
					albumartist = tf_albumartist.EvalWithMetadb(this.handleList[i]);
					format_str = albumartist.substring(0, len).toUpperCase();
					if (format_str == cList.search_string) {
						pid = i;
						break;
					};
				};
			};

			if (pid < 0) {
				// 2nd search on "artist" TAG
				var format_str = "";
				for (var i = 0; i < this.count; i++) {
					artist = tf_artist.EvalWithMetadb(this.handleList[i]);
					format_str = artist.substring(0, len).toUpperCase();
					if (format_str == cList.search_string) {
						pid = i;
						break;
					};
				};
			};

		} else {

			// 1st search on tf_group_key of current group by pattern
			var format_str = "";
			for (var i = gstart; i < this.count; i++) {
				groupkey = tf_group_key.EvalWithMetadb(this.handleList[i]);
				format_str = groupkey.substring(0, len).toUpperCase();
				if (format_str == cList.search_string) {
					pid = i;
					break;
				};
			};

			// if not found, search in the first part (from 0 to gstart)
			if (pid < 0) {
				var format_str = "";
				for (var i = 0; i < gstart; i++) {
					groupkey = tf_group_key.EvalWithMetadb(this.handleList[i]);
					format_str = groupkey.substring(0, len).toUpperCase();
					if (format_str == cList.search_string) {
						pid = i;
						break;
					};
				};
			};

		};

		if (pid >= 0) { // found
			this.focusedTrackId = pid;
			plman.ClearPlaylistSelection(this.playlist);
			plman.SetPlaylistSelectionSingle(this.playlist, this.focusedTrackId, true);
			plman.SetPlaylistFocusItem(this.playlist, this.focusedTrackId);
			this.showFocusedItem();
		} else { // not found on "album artist" TAG, new search on "artist" TAG
			cList.inc_search_noresult = true;
			full_repaint();
		};

		cList.clear_incsearch_timer && window.ClearTimeout(cList.clear_incsearch_timer);
		cList.clear_incsearch_timer = window.SetTimeout(function () {
				// reset incremental search string after 1 seconds without any key pressed
				cList.search_string = "";
				cList.inc_search_noresult = false;
				full_repaint();
				window.ClearInterval(cList.clear_incsearch_timer);
				cList.clear_incsearch_timer = false;
			}, 1000);
	};

	this.contextMenu = function (x, y, id, row_id) {
		var items = plman.GetPlaylistSelectedItems(this.playlist);
		var flag = plman.IsPlaylistLocked(this.playlist) ? MF_GRAYED : MF_STRING;
		
		var _menu = window.CreatePopupMenu();
		var _context = fb.CreateContextMenuManager();
		
		_context.InitContextPlaylist();
		_menu.AppendMenuItem(MF_STRING, 1000, "Panel Settings...");
		_menu.AppendMenuSeparator();
		_menu.AppendMenuItem(flag, 1001, "Crop");
		_menu.AppendMenuItem(flag, 1002, "Remove");
		_menu.AppendMenuSeparator();
		_menu.AppendMenuItem(flag, 1003, "Cut");
		_menu.AppendMenuItem(MF_STRING, 1004, "Copy");
		_menu.AppendMenuItem(!plman.IsPlaylistLocked(this.playlist) && fb.CheckClipboardContents(window.ID) ? MF_STRING : MF_GRAYED, 1005, "Paste");
		_menu.AppendMenuSeparator();
		_context.BuildMenu(_menu, 1);
		var idx = _menu.TrackPopupMenu(x, y);
		switch (idx) {
		case 0:
			break;
		case 1000:
			for (var i = 0; i < p.settings.pages.length; i++) {
				p.settings.pages[i].reSet();
			};
			p.settings.currentPageId = 0;
			cSettings.visible = true;
			full_repaint();
			break;
		case 1001:
			plman.UndoBackup(this.playlist);
			plman.RemovePlaylistSelection(this.playlist, true);
			break;
		case 1002:
			plman.UndoBackup(this.playlist);
			plman.RemovePlaylistSelection(this.playlist);
			break;
		case 1003:
			fb.CopyHandleListToClipboard(items);
			plman.UndoBackup(this.playlist);
			plman.RemovePlaylistSelection(this.playlist);
			break;
		case 1004:
			fb.CopyHandleListToClipboard(items);
			break;
		case 1005:
			var base = plman.GetPlaylistFocusItemIndex(this.playlist);
			if (base == -1) {
				base = plman.PlaylistItemCount(this.playlist);
			} else {
				base++;
			}
			plman.UndoBackup(this.playlist);
			plman.InsertPlaylistItems(this.playlist, base, fb.GetClipboardContents(window.ID));
			break;
		default:
			_context.ExecuteByID(idx - 1);
			break;
		}
		return true;
	};
};
