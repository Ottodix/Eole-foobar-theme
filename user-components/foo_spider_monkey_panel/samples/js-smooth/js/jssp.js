var need_repaint = false;

ppt = {
	tf_artist: fb.TitleFormat("%artist%"),
	tf_albumartist: fb.TitleFormat("%album artist%"),
	tf_groupkey: fb.TitleFormat(window.GetProperty("_PROPERTY: tf_groupkey", "$if2(%album artist%,$if(%length%,'?',%title%)) ^^ $if2(%album%,$if(%length%,'?',%path%)) ^^ %discnumber% ## [%artist%] ^^ %title% ^^ [%genre%] ^^ [%date%]")),
	tf_track: fb.TitleFormat("%tracknumber% ^^ [%length%] ^^ $if2(%rating%,0) ^^ %mood%"),
	tf_path: fb.TitleFormat("$directory_path(%path%)\\"),
	tf_crc: fb.TitleFormat("$crc32(%path%)"),
	tf_time_remaining: fb.TitleFormat("$if(%length%,-%playback_time_remaining%,'ON AIR')"),
	defaultRowHeight: window.GetProperty("_PROPERTY: Row Height", 35),
	doubleRowPixelAdds: 3,
	rowHeight: window.GetProperty("_PROPERTY: Row Height", 35),
	rowScrollStep: 3,
	scrollSmoothness: 2.5,
	refreshRate: 40,
	extraRowsNumber: window.GetProperty("_PROPERTY: Number of Extra Rows per Group", 0),
	minimumRowsNumberPerGroup: window.GetProperty("_PROPERTY: Number minimum of Rows per Group", 0),
	groupHeaderRowsNumber: window.GetProperty("_PROPERTY: Number of Rows for Group Header", 2),
	showHeaderBar: window.GetProperty("_DISPLAY: Show Top Bar", true),
	defaultHeaderBarHeight: 25,
	headerBarHeight: 25,
	autocollapse: window.GetProperty("_PROPERTY: Autocollapse groups", false),
	enableFullScrollEffectOnFocusChange: false,
	enableCustomColors: window.GetProperty("_PROPERTY: Custom Colors", false),
	showgroupheaders: window.GetProperty("_DISPLAY: Show Group Headers", true),
	showwallpaper: window.GetProperty("_DISPLAY: Show Wallpaper", false),
	wallpaperalpha: 150,
	wallpaperblurred: window.GetProperty("_DISPLAY: Wallpaper Blurred", true),
	wallpaperblurvalue: 1.05,
	wallpapermode: window.GetProperty("_SYSTEM: Wallpaper Mode", 0),
	wallpaperpath: window.GetProperty("_PROPERTY: Default Wallpaper Path", ".\\user-components\\foo_spider_monkey_panel\\samples\\js-smooth\\images\\default.png"),
	extra_font_size: window.GetProperty("_SYSTEM: Extra font size value", 0),
	showFilterBox: window.GetProperty("_PROPERTY: Enable Playlist Filterbox in Top Bar", true),
	doubleRowText: window.GetProperty("_PROPERTY: Double Row Text Info", true),
	showArtistAlways: window.GetProperty("_DISPLAY: Show Artist in Track Row", true),
	showRating: window.GetProperty("_DISPLAY: Show Rating in Track Row", true),
	showMood: window.GetProperty("_DISPLAY: Show Mood in Track Row", true),
	enableTouchControl: window.GetProperty("_PROPERTY: Touch control", true)
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

cPlaylistManager = {
	width: 230,
	default_topbarHeight: 30,
	topbarHeight: 30,
	default_botbarHeight: 4,
	botbarHeight: 4,
	default_scrollbarWidth: 10,
	scrollbarWidth: 10,
	default_rowHeight: 30,
	rowHeight: 30,
	blink_timer: false,
	blink_counter: -1,
	blink_id: null,
	blink_row: null,
	blink_totaltracks: 0,
	showTotalItems: window.GetProperty("_PROPERTY.PlaylistManager.ShowTotalItems", true)
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

cover = {
	masks: window.GetProperty("_PROPERTY: Cover art masks (used for the cache)", "*front*.*;*cover*.*;*folder*.*;*.*"),
	show: window.GetProperty("_DISPLAY: Show Cover Art", true),
	column: false,
	draw_glass_reflect: false,
	glass_reflect: null,
	keepaspectratio: true,
	default_margin: 4,
	margin: 4,
	w: ppt.groupHeaderRowsNumber * ppt.rowHeight,
	max_w: ppt.groupHeaderRowsNumber * ppt.rowHeight,
	h: ppt.groupHeaderRowsNumber * ppt.rowHeight,
	max_h: ppt.groupHeaderRowsNumber * ppt.rowHeight,
	previous_max_size: -1,
	resized: false
};

images = {
	path: fb.ComponentPath + "samples\\js-smooth\\images\\",
	glass_reflect: null,
	loading_angle: 0,
	loading_draw: null,
	noart: null,
	stream: null
};

cList = {
	search_string: "",
	incsearch_font: gdi.Font("lucida console", 9, 0),
	incsearch_font_big: gdi.Font("lucida console", 20, 1),
	inc_search_noresult: false,
	clear_incsearch_timer: false,
	incsearch_timer: false
};

timers = {
	coverLoad: false,
	coverDone: false,
	mouseWheel: false,
	saveCover: false,
	mouseDown: false,
	showPlaylistManager: false,
	hidePlaylistManager: false
};

dragndrop = {
	enabled: true,
	contigus_sel: null,
	x: 0,
	y: 0,
	drag_id: -1,
	drop_id: -1,
	timerID: false,
	drag_in: false,
	drag_out: false,
	clicked: false,
	moved: false
};

/*
===================================================================================================
Images cache
===================================================================================================
 */
function reset_cover_timers() {
	if (timers.coverDone) {
		timers.coverDone && window.ClearTimeout(timers.coverDone);
		timers.coverDone = false;
	};
};

function on_load_image_done(tid, image) {
	var tot = brw.groups.length;
	for (var k = 0; k < tot; k++) {
		if (brw.groups[k].metadb) {
			if (brw.groups[k].tid == tid && brw.groups[k].load_requested == 1) {
				brw.groups[k].load_requested = 2;
				brw.groups[k].cover_img = g_image_cache.getit(brw.groups[k].metadb, k, image);
				if (k < brw.groups.length && brw.groups[k].rowId >= g_start_ && brw.groups[k].rowId <= g_end_) {
					if (!timers.coverDone) {
						timers.coverDone = window.SetTimeout(function () {
							brw.repaint();
							timers.coverDone && window.ClearTimeout(timers.coverDone);
							timers.coverDone = false;
						}, 5);
					};
				}
				break;
			};
		};
	};
};

function on_get_album_art_done(metadb, art_id, image, image_path) {
	var tot = brw.groups.length;
	for (var i = 0; i < tot; i++) {
		if (brw.groups[i].metadb && brw.groups[i].metadb.Compare(metadb)) {
			brw.groups[i].cover_img = g_image_cache.getit(metadb, i, image);
			if (i < brw.groups.length && i >= g_start_ && i <= g_end_) {
				if (!timers.coverDone) {
					timers.coverDone = window.SetTimeout(function () {
							brw.repaint();
							timers.coverDone && window.ClearTimeout(timers.coverDone);
							timers.coverDone = false;
						}, 5);
				};
			}
			break;
		};
	};
};

//=================================================// Cover Tools
image_cache = function () {
	this._cachelist = {};
	this.hit = function (metadb, albumIndex) {
		var img = this._cachelist[brw.groups[albumIndex].cachekey];
		if (typeof(img) == "undefined" || img == null) { // if image not in cache, we load it asynchronously
			//if(!isScrolling  && !cScrollBar.timerID) { // and when no scrolling
			brw.groups[albumIndex].crc = check_cache(metadb, albumIndex);
			if (brw.groups[albumIndex].crc && brw.groups[albumIndex].load_requested == 0) {
				// load img from cache
				if (!timers.coverLoad) {
					timers.coverLoad = window.SetTimeout(function () {
							try {
								brw.groups[albumIndex].tid = load_image_from_cache(metadb, brw.groups[albumIndex].crc);
								brw.groups[albumIndex].load_requested = 1;
							} catch (e) {};
							timers.coverLoad && window.ClearTimeout(timers.coverLoad);
							timers.coverLoad = false;
						}, (!isScrolling && !cScrollBar.timerID ? 5 : 25));
				};
			} else if (brw.groups[albumIndex].load_requested == 0) {
				// load img default method
				if (!timers.coverLoad) {
					timers.coverLoad = window.SetTimeout(function () {
						brw.groups[albumIndex].load_requested = 1;
						utils.GetAlbumArtAsync(window.ID, metadb, 0, true, false, false);
						timers.coverLoad && window.ClearTimeout(timers.coverLoad);
						timers.coverLoad = false;
					}, (!isScrolling && !cScrollBar.timerID ? 5 : 25));
				};
			};
			//};
		};
		return img;
	};
	this.reset = function (key) {
		this._cachelist[key] = null;
	};
	this.getit = function (metadb, albumId, image) {
		var cw = cover.max_w;
		var ch = cw;
		var img = null;
		var cover_type = null;

		if (cover.keepaspectratio) {
			if (!image) {
				var pw = cw - cover.margin * 2;
				var ph = ch - cover.margin * 2;
			} else {
				if (image.Height >= image.Width) {
					var ratio = image.Width / image.Height;
					var pw = (cw - cover.margin * 2) * ratio;
					var ph = ch - cover.margin * 2;
				} else {
					var ratio = image.Height / image.Width;
					var pw = cw - cover.margin * 2;
					var ph = (ch - cover.margin * 2) * ratio;
				};
			};
		} else {
			var pw = cw - cover.margin * 2;
			var ph = ch - cover.margin * 2;
		};
		// cover.type : 0 = nocover, 1 = external cover, 2 = embedded cover, 3 = stream
		if (brw.groups[albumId].tracktype != 3) {
			if (metadb) {
				if (image) {
					img = FormatCover(image, pw, ph);
					cover_type = 1;
				} else {
					//img = FormatCover(images.noart, pw, ph, false);
					cover_type = 0;
				};
			};
		} else {
			//img = FormatNoCover(albumId, pw, ph, false, mode = 2);
			cover_type = 3;

		};
		if (cover_type == 1) {
			this._cachelist[brw.groups[albumId].cachekey] = img;
		};
		// save img to cache
		if (cover_type == 1 && !brw.groups[albumId].save_requested) {
			if (!timers.saveCover) {
				brw.groups[albumId].save_requested = true;
				save_image_to_cache(metadb, albumId);
				timers.saveCover = window.SetTimeout(function () {
					window.ClearTimeout(timers.saveCover);
					timers.saveCover = false;
				}, 50);
			};
		};

		brw.groups[albumId].cover_type = cover_type;

		return img;
	};
};
var g_image_cache = new image_cache;

function FormatCover(image, w, h) {
	if (!image || w <= 0 || h <= 0) return image;
	return image.Resize(w, h, 2);
};

/*
===================================================================================================
Objects
===================================================================================================
 */
oPlaylist = function (idx, rowId) {
	this.idx = idx;
	this.rowId = rowId;
	this.name = plman.GetPlaylistName(idx);
	this.y = -1;
};

oPlaylistManager = function (name) {
	this.name = name;
	this.playlists = [];
	this.state = 0; // 0 = hidden, 1 = visible
	// metrics
	this.scroll = 0;
	this.offset = 0;
	this.w = 250;
	this.h = brw.h - 100;
	this.x = ww;
	this.y = brw.y + 50;
	this.total_playlists = null;
	this.rowTotal = -1;
	this.drop_done = false;

	this.adjustPanelHeight = function () {
		// adjust panel height to avoid blank area under last visible item in the displayed list
		var target_total_rows = Math.floor((this.default_h - cPlaylistManager.topbarHeight) / cPlaylistManager.rowHeight);
		if (this.rowTotal != -1 && this.rowTotal < target_total_rows)
			target_total_rows = this.rowTotal;
		this.h = cPlaylistManager.topbarHeight + (target_total_rows * cPlaylistManager.rowHeight);
		this.y = this.default_y + Math.floor((this.default_h - this.h) / 2);

		this.totalRows = Math.floor((this.h - cPlaylistManager.topbarHeight) / cPlaylistManager.rowHeight);
		this.max = (this.rowTotal > this.totalRows ? this.totalRows : this.rowTotal);
	};

	this.setSize = function (x, y, w, h) {
		this.default_x = x;
		this.default_y = y;
		this.default_w = w;
		this.default_h = h;
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.totalRows = Math.floor((this.h - cPlaylistManager.topbarHeight) / cPlaylistManager.rowHeight);

		// adjust panel height / rowHeight + rowTotal (! refresh must have been executed once to have a valide rowTotal)
		this.adjustPanelHeight();
	};

	this.showPanel = function () {
		if (pman.offset < pman.w) {
			var delta = Math.ceil((pman.w - pman.offset) / 2);
			pman.offset += delta;
			brw.repaint();
		};
		if (pman.offset >= pman.w) {
			pman.offset = pman.w;
			window.ClearInterval(timers.showPlaylistManager);
			timers.showPlaylistManager = false;
			brw.repaint();
		};
	};

	this.hidePanel = function () {
		if (pman.offset > 0) {
			var delta = Math.ceil((pman.w - (pman.w - pman.offset)) / 2);
			pman.offset -= delta;
			brw.repaint();
		};
		if (pman.offset < 1) {
			pman.offset = 0;
			pman.state = 0;
			window.ClearInterval(timers.hidePlaylistManager);
			timers.hidePlaylistManager = false;
			brw.repaint();
		};
	};

	this.populate = function (exclude_active, reset_scroll) {
		this.playlists.splice(0, this.playlists.length);
		this.total_playlists = plman.PlaylistCount;
		var rowId = 0;
		for (var idx = 0; idx < this.total_playlists; idx++) {
			if (!plman.IsAutoPlaylist(idx)) {
				if (idx == plman.ActivePlaylist) {
					if (!exclude_active) {
						this.playlists.push(new oPlaylist(idx, rowId));
						rowId++;
					};
				} else {
					this.playlists.push(new oPlaylist(idx, rowId));
					rowId++;
				};
			};
		};
		this.rowTotal = rowId;

		// adjust panel height / rowHeight + rowTotal
		this.adjustPanelHeight();

		if (reset_scroll || this.rowTotal <= this.totalRows) {
			this.scroll = 0;
		} else {
			//check it total playlist is coherent with scroll value
			if (this.scroll > this.rowTotal - this.totalRows) {
				this.scroll = this.rowTotal - this.totalRows;
			};
		};
	};

	this.draw = function (gr) {
		if (this.offset > 0) {
			// metrics
			var cx = this.x - this.offset;
			var ch = cPlaylistManager.rowHeight;
			var cw = this.w;
			var bg_margin_top = 2;
			var bg_margin_left = 6;
			var txt_margin = 10;
			var bg_color = RGB(0, 0, 0);
			var txt_color = RGB(255, 255, 255);

			// scrollbar metrics
			if (this.rowTotal > this.totalRows) {
				this.scr_y = this.y + cPlaylistManager.topbarHeight;
				this.scr_w = cPlaylistManager.scrollbarWidth;
				this.scr_h = this.h - cPlaylistManager.topbarHeight;
			} else {
				this.scr_y = 0;
				this.scr_w = 0;
				this.scr_h = 0;
			};

			// ** panel bg **
			gr.SetSmoothingMode(2);
			gr.FillRoundRect(cx, this.y, this.w + 12, this.h + cPlaylistManager.botbarHeight + 1, 10, 10, RGBA(0, 0, 0, 120));
			gr.FillRoundRect(cx, this.y, this.w + 12, this.h + cPlaylistManager.botbarHeight, 10, 10, RGBA(0, 0, 0, 150));
			gr.DrawRoundRect(cx, this.y, this.w + 12, this.h + cPlaylistManager.botbarHeight - 1, 9, 9, 1.0, RGBA(255, 255, 255, 200));
			gr.SetSmoothingMode(0);

			gr.FillSolidRect(cx + bg_margin_left, this.y + cPlaylistManager.topbarHeight - 2, this.w - bg_margin_left * 2, 1, RGBA(255, 255, 255, 40));

			// ** items **
			var rowIdx = 0;
			var totalp = this.playlists.length;
			var start_ = this.scroll;
			var end_ = this.scroll + this.totalRows;
			if (end_ > totalp)
				end_ = totalp;
			for (var i = start_; i < end_; i++) {
				cy = this.y + cPlaylistManager.topbarHeight + rowIdx * ch;
				this.playlists[i].y = cy;

				// ** item bg **
				gr.FillSolidRect(cx + bg_margin_left, cy + bg_margin_top, cw - bg_margin_left * 2 - this.scr_w, ch - bg_margin_top * 2, RGBA(0, 0, 0, 130));
				gr.DrawRect(cx + bg_margin_left, cy + bg_margin_top, cw - bg_margin_left * 2 - this.scr_w - 1, ch - bg_margin_top * 2 - 1, 1.0, RGBA(255, 255, 255, 20));

				// ** item text **
				// playlist total items
				if (cPlaylistManager.showTotalItems) {
					t = plman.PlaylistItemCount(this.playlists[i].idx);
					tw = gr.CalcTextWidth(t, g_font);
					gr.GdiDrawText(t, g_font, blendColors(txt_color, bg_color, 0.2), cx + bg_margin_left + txt_margin, cy, cw - bg_margin_left * 2 - txt_margin * 2 - this.scr_w, ch, DT_RIGHT | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
				} else {
					tw = 0;
				};
				// draw playlist name
				if ((this.activeIndex == i + 1 && cPlaylistManager.blink_counter < 0) || (cPlaylistManager.blink_id == i + 1 && cPlaylistManager.blink_row != 0)) {
					gr.GdiDrawText("+ " + this.playlists[i].name, g_font_bold, txt_color, cx + bg_margin_left + txt_margin, cy, cw - bg_margin_left * 2 - txt_margin * 2 - tw - this.scr_w, ch, DT_LEFT | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
				} else {
					gr.GdiDrawText(this.playlists[i].name, g_font, blendColors(txt_color, bg_color, 0.2), cx + bg_margin_left + txt_margin, cy, cw - bg_margin_left * 2 - txt_margin * 2 - tw - this.scr_w, ch, DT_LEFT | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
				};

				// draw flashing item on lbtn_up after a drag'n drop
				if (cPlaylistManager.blink_counter > -1) {
					if (cPlaylistManager.blink_row != 0) {
						if (i == cPlaylistManager.blink_id - 1) {
							if (cPlaylistManager.blink_counter <= 6 && Math.floor(cPlaylistManager.blink_counter / 2) == Math.ceil(cPlaylistManager.blink_counter / 2)) {
								gr.FillSolidRect(cx + bg_margin_left, cy + bg_margin_top, cw - bg_margin_left * 2 - this.scr_w, ch - bg_margin_top * 2, RGBA(255, 255, 255, 75));
							};
						};
					};
				};

				rowIdx++;
			};

			// top bar
			// draw flashing top bar item on lbtn_up after a drag'n drop
			if (cPlaylistManager.blink_counter > -1) {
				if (cPlaylistManager.blink_row == 0) {
					if (cPlaylistManager.blink_counter <= 6 && Math.floor(cPlaylistManager.blink_counter / 2) == Math.ceil(cPlaylistManager.blink_counter / 2)) {
						gr.GdiDrawText("+ Sent to a New Playlist", g_font_bold, txt_color, cx + bg_margin_left + txt_margin, this.y, cw - bg_margin_left * 2 - txt_margin * 2 - tw - this.scr_w, ch, DT_LEFT | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
					};
				} else {
					gr.GdiDrawText("Send to ...", g_font, txt_color, cx + bg_margin_left + txt_margin, this.y, cw - bg_margin_left * 2 - txt_margin * 2 - tw - this.scr_w, ch, DT_LEFT | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
				};
			} else {
				if (this.activeRow == 0) {
					gr.GdiDrawText("+ Send to a New Playlist", g_font_bold, txt_color, cx + bg_margin_left + txt_margin, this.y, cw - bg_margin_left * 2 - txt_margin * 2 - tw - this.scr_w, ch, DT_LEFT | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
				} else {
					gr.GdiDrawText("Send to ...", g_font, txt_color, cx + bg_margin_left + txt_margin, this.y, cw - bg_margin_left * 2 - txt_margin * 2 - tw - this.scr_w, ch, DT_LEFT | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
				};
			};

			// draw activeIndex hover frame
			if (cPlaylistManager.blink_counter > -1 && cPlaylistManager.blink_row > 0) {
				cy_ = this.y + cPlaylistManager.blink_row * ch;
				gr.DrawRect(cx + bg_margin_left + 1, cy_ + bg_margin_top + 1, cw - bg_margin_left * 2 - this.scr_w - 2, ch - bg_margin_top * 2 - 2, 2.0, RGBA(255, 255, 255, 240));
			} else {
				if (this.activeRow > 0 && this.activeIndex > 0) {
					if (cPlaylistManager.blink_counter < 0) {
						cy_ = this.y + this.activeRow * ch;
						gr.DrawRect(cx + bg_margin_left + 1, cy_ + bg_margin_top + 1, cw - bg_margin_left * 2 - this.scr_w - 2, ch - bg_margin_top * 2 - 2, 2.0, RGBA(255, 255, 255, 240));
					};
				};
			};

			// scrollbar
			if (this.scr_w > 0) {
				this.scr_cursor_h = (this.scr_h / (ch * this.rowTotal)) * this.scr_h;
				if (this.scr_cursor_h < 20)
					this.scr_cursor_h = 20;
				// set cursor y pos
				var ratio = (this.scroll * ch) / (this.rowTotal * ch - this.scr_h);
				this.scr_cursor_y = this.scr_y + Math.round((this.scr_h - this.scr_cursor_h) * ratio);

				gr.FillSolidRect(cx + cw - this.scr_w, this.scr_cursor_y, this.scr_w - 4, this.scr_cursor_h, RGBA(255, 255, 255, 100));
			};

		};
	};

	this._isHover = function (x, y) {
		return (x >= this.x - this.offset && x <= this.x - this.offset + this.w && y >= this.y && y <= this.y + this.h - 1);
	};

	this.on_mouse = function (event, x, y, delta) {
		this.ishover = this._isHover(x, y);

		switch (event) {
		case "move":
			// get active item index at x,y coords...
			this.activeIndex = -1;
			if (this.ishover) {
				this.activeRow = Math.ceil((y - this.y) / cPlaylistManager.rowHeight) - 1;
				this.activeIndex = Math.ceil((y - this.y) / cPlaylistManager.rowHeight) + this.scroll - 1;
			};
			if (this.activeIndex != this.activeIndexSaved) {
				this.activeIndexSaved = this.activeIndex;
				brw.repaint();
			};
			if (this.scr_w > 0 && x > this.x - this.offset && x <= this.x - this.offset + this.w) {
				if (y < this.y && pman.scroll > 0) {
					if (!timers.scrollPman && cPlaylistManager.blink_counter < 0) {
						timers.scrollPman = window.SetInterval(function () {
								pman.scroll--;
								if (pman.scroll < 0) {
									pman.scroll = 0;
									window.ClearInterval(timers.scrollPman);
									timers.scrollPman = false;
								} else {
									brw.repaint();
								};
							}, 100);
					};
				} else if (y > this.scr_y + this.scr_h && pman.scroll < this.rowTotal - this.totalRows) {
					if (!timers.scrollPman && cPlaylistManager.blink_counter < 0) {
						timers.scrollPman = window.SetInterval(function () {
								pman.scroll++;
								if (pman.scroll > pman.rowTotal - pman.totalRows) {
									pman.scroll = pman.rowTotal - pman.totalRows;
									window.ClearInterval(timers.scrollPman);
									timers.scrollPman = false;
								} else {
									brw.repaint();
								};
							}, 100);
					};
				} else {
					if (timers.scrollPman) {
						window.ClearInterval(timers.scrollPman);
						timers.scrollPman = false;
					};
				};
			};
			break;
		case "up":
			brw.drag_clicked = false;
			if (brw.drag_moving) {
				window.SetCursor(IDC_ARROW);
				this.drop_done = false;
				if (this.activeIndex > -1) {
					brw.metadblist_selection = plman.GetPlaylistSelectedItems(g_active_playlist);
					if (this.activeRow == 0) {
						// send to a new playlist
						this.drop_done = true;
						window.NotifyOthers("JSSmoothPlaylist->JSSmoothBrowser:avoid_on_playlist_switch_callbacks_on_sendItemToPlaylist", true);
						plman.CreatePlaylist(plman.PlaylistCount, "");
						plman.ActivePlaylist = plman.PlaylistCount - 1;
						plman.InsertPlaylistItems(plman.PlaylistCount - 1, 0, brw.metadblist_selection, false);
					} else {
						// send to selected (hover) playlist
						this.drop_done = true;
						var row_idx = this.activeIndex - 1;
						var playlist_idx = this.playlists[row_idx].idx;
						var insert_index = plman.PlaylistItemCount(playlist_idx);
						plman.InsertPlaylistItems(playlist_idx, insert_index, brw.metadblist_selection, false);
					};
					// timer to blink the playlist item where tracks have been droped!
					if (this.drop_done) {
						if (!cPlaylistManager.blink_timer) {
							cPlaylistManager.blink_x = x;
							cPlaylistManager.blink_y = y;
							cPlaylistManager.blink_totaltracks = brw.metadblist_selection.Count;
							cPlaylistManager.blink_id = this.activeIndex;
							cPlaylistManager.blink_row = this.activeRow;
							cPlaylistManager.blink_counter = 0;
							cPlaylistManager.blink_timer = window.SetInterval(function () {
									cPlaylistManager.blink_counter++;
									if (cPlaylistManager.blink_counter > 6) {
										window.ClearInterval(cPlaylistManager.blink_timer);
										cPlaylistManager.blink_timer = false;
										cPlaylistManager.blink_counter = -1;
										cPlaylistManager.blink_id = null;
										pman.drop_done = false;
										// close pman
										if (!timers.hidePlaylistManager) {
											timers.hidePlaylistManager = window.SetInterval(pman.hidePanel, 25);
										};
										brw.drag_moving = false;
									};
									brw.repaint();
								}, 150);
						};
					};
				} else {
					if (timers.showPlaylistManager) {
						window.ClearInterval(timers.showPlaylistManager);
						timers.showPlaylistManager = false;
					};
					if (!timers.hidePlaylistManager) {
						timers.hidePlaylistManager = window.SetInterval(this.hidePanel, 25);
					};
					brw.drag_moving = false;
				};
				brw.drag_moving = false;
			};
			break;
		case "right":
			brw.drag_clicked = false;
			if (brw.drag_moving) {
				if (timers.showPlaylistManager) {
					window.ClearInterval(timers.showPlaylistManager);
					timers.showPlaylistManager = false;
				};
				if (!timers.hidePlaylistManager) {
					timers.hidePlaylistManager = window.SetInterval(this.hidePanel, 25);
				};
				brw.drag_moving = false;
			};
			break;
		case "wheel":
			var scroll_prev = this.scroll;
			this.scroll -= delta;
			if (this.scroll < 0)
				this.scroll = 0;
			if (this.scroll > (this.rowTotal - this.totalRows))
				this.scroll = (this.rowTotal - this.totalRows);
			if (this.scroll != scroll_prev) {
				this.on_mouse("move", m_x, m_y);
			};
			break;
		case "leave":
			brw.drag_clicked = false;
			if (brw.drag_moving) {
				if (timers.showPlaylistManager) {
					window.ClearInterval(timers.showPlaylistManager);
					timers.showPlaylistManager = false;
				};
				if (!timers.hidePlaylistManager) {
					timers.hidePlaylistManager = window.SetInterval(this.hidePanel, 25);
				};
				brw.drag_moving = false;
			};
			break;
		};
	};
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

oGroup = function (index, start, handle, groupkey) {
	this.index = index;
	this.start = start;
	this.count = 1;
	this.metadb = handle;
	this.groupkey = groupkey;
	this.cachekey = process_cachekey(ppt.tf_crc.EvalWithMetadb(handle));
	//
	this.cover_img = null;
	this.cover_type = null;
	this.tracktype = TrackType(handle.RawPath.substring(0, 4));
	this.tra = [];
	this.load_requested = 0;
	this.save_requested = false;
	this.collapsed = ppt.autocollapse;

	this.finalize = function (count, tracks) {
		this.tra = tracks.slice(0);
		this.count = count;
		if (count < ppt.minimumRowsNumberPerGroup) {
			this.rowsToAdd = ppt.minimumRowsNumberPerGroup - count;
		} else {
			this.rowsToAdd = 0;
		};
		this.rowsToAdd += ppt.extraRowsNumber;

		if (this.collapsed) {
			if (brw.focusedTrackId >= this.start && brw.focusedTrackId < this.start + count) { // focused track is in this group!
				this.collapsed = false;
				g_group_id_focused = this.index;
			};
		};
	};

	//this.totalPreviousRows = 0
};

oBrowser = function (name) {
	this.name = name;
	this.groups = [];
	this.rows = [];
	this.SHIFT_start_id = null;
	this.SHIFT_count = 0;
	this.scrollbar = new oScrollbar(themed = cScrollBar.themed);
	this.keypressed = false;

	this.metadblist_selection = plman.GetPlaylistSelectedItems(g_active_playlist);

	this.launch_populate = function () {
		var launch_timer = window.SetTimeout(function () {
				// populate browser with items
				brw.populate(true);
				// populate playlist popup panel list
				pman.populate(false, true);
				// kill Timeout
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
		this.groupHeaderRowHeight = ppt.groupHeaderRowsNumber;
		this.totalRows = Math.ceil(this.h / ppt.rowHeight);
		this.totalRowsVis = Math.floor(this.h / ppt.rowHeight);

		if (g_first_populate_done)
			this.gettags();

		g_filterbox.setSize(cFilterBox.w, cFilterBox.h + 2, g_fsize + 2);

		this.scrollbar.setSize();

		scroll = Math.round(scroll / ppt.rowHeight) * ppt.rowHeight;
		scroll = check_scroll(scroll);
		scroll_ = scroll;

		// scrollbar update
		this.scrollbar.updateScrollbar();

		pman.setSize(ww, y + 50, (cPlaylistManager.width < ww ? cPlaylistManager.width : ww), h - 100);
	};

	this.collapseAll = function (bool) { // bool = true to collapse all groups otherwise expand them all
		var end = this.groups.length;
		for (i = 0; i < end; i++) {
			this.groups[i].collapsed = bool;
		};
		this.setList(true);
		g_focus_row = this.getOffsetFocusItem(g_focus_id);
		// if focused track not totally visible, we scroll to show it centered in the panel
		if (g_focus_row < scroll / ppt.rowHeight || g_focus_row > scroll / ppt.rowHeight + brw.totalRowsVis - 1) {
			scroll = (g_focus_row - Math.floor(brw.totalRowsVis / 2)) * ppt.rowHeight;
			scroll = check_scroll(scroll);
			scroll_ = scroll;
		};
		if (this.rowsCount > 0)
			brw.gettags(true);
		this.scrollbar.updateScrollbar();
		this.repaint();
	};

	this.setList = function () {
		this.rows.splice(0, this.rows.length);
		var r = 0,
		i = 0,
		j = 0,
		m = 0,
		n = 0,
		s = 0,
		p = 0;
		var grptags = "";
		var headerTotalRows = ppt.groupHeaderRowsNumber;

		/*
		var d1 = new Date();
		var t1 = d1.getSeconds()*1000 + d1.getMilliseconds();
		*/

		var end = this.groups.length;
		for (i = 0; i < end; i++) {

			this.groups[i].load_requested = 0;

			// update total rows present before this group
			//this.groups[i].totalPreviousRows = r;

			grptags = this.groups[i].groupkey;

			s = this.groups[i].start;

			if (this.groups[i].collapsed) {
				if (ppt.showgroupheaders) {
					this.groups[i].rowId = r;
					for (k = 0; k < headerTotalRows; k++) {
						this.rows[r] = new Object();
						this.rows[r].type = k + 1; // 1st line of group header
						this.rows[r].metadb = this.groups[i].metadb;
						this.rows[r].albumId = i;
						this.rows[r].albumTrackId = 0;
						this.rows[r].playlistTrackId = s;
						this.rows[r].groupkey = grptags;
						r++;
					};
				};
			} else {
				if (ppt.showgroupheaders) {
					this.groups[i].rowId = r;
					for (k = 0; k < headerTotalRows; k++) {
						this.rows[r] = new Object();
						this.rows[r].type = k + 1; // 1st line of group header
						this.rows[r].metadb = this.groups[i].metadb;
						this.rows[r].albumId = i;
						this.rows[r].albumTrackId = 0;
						this.rows[r].playlistTrackId = s;
						this.rows[r].groupkey = grptags;
						r++;
					};
				};
				// tracks
				m = this.groups[i].count;
				for (j = 0; j < m; j++) {
					this.rows[r] = new Object();
					this.rows[r].type = 0; // track
					this.rows[r].metadb = this.list[s + j];
					this.rows[r].albumId = i;
					this.rows[r].albumTrackId = j;
					this.rows[r].playlistTrackId = s + j;
					this.rows[r].groupkey = grptags;
					this.rows[r].tracktype = TrackType(this.rows[r].metadb.RawPath.substring(0, 4));
					this.rows[r].rating = -1;
					r++;
				};
				// empty extra rows
				p = this.groups[i].rowsToAdd;
				for (n = 0; n < p; n++) {
					this.rows[r] = new Object();
					this.rows[r].type = 99; // extra row at bottom of the album/group
					r++;
				};
			};
		};

		this.rowsCount = r;
	};

	this.showNowPlaying = function () {
		if (fb.IsPlaying) {
			try {
				this.nowplaying = plman.GetPlayingItemLocation();
				if (this.nowplaying.IsValid) {
					if (plman.PlayingPlaylist != g_active_playlist) {
						g_active_playlist = plman.ActivePlaylist = plman.PlayingPlaylist;
					};

					// set focus on the now playing item
					g_focus_id_prev = g_focus_id;
					g_focus_id = this.nowplaying.PlaylistItemIndex;

					g_focus_row = this.getOffsetFocusItem(g_focus_id);
					//g = this.rows[g_focus_row].albumId;
					plman.ClearPlaylistSelection(g_active_playlist);
					//if(this.groups[g].collapsed) {
					//    this.selectGroupTracks(g);
					//} else {
					plman.SetPlaylistSelectionSingle(g_active_playlist, g_focus_id, true);
					//};
					plman.SetPlaylistFocusItem(g_active_playlist, g_focus_id);
					this.showFocusedItem();
				};
			} catch (e) {};
		};
	};

	this.showFocusedItem = function () {
		g_focus_row = this.getOffsetFocusItem(g_focus_id);
		//if(g_focus_row < scroll / ppt.rowHeight || g_focus_row > scroll / ppt.rowHeight + this.totalRowsVis) {
		scroll = (g_focus_row - Math.floor(this.totalRowsVis / 2)) * ppt.rowHeight;
		scroll = check_scroll(scroll);
		/*
		if(!ppt.enableFullScrollEffectOnFocusChange) {
		scroll_ = scroll + ppt.rowHeight * 5 * (g_focus_id_prev <= g_focus_id ? -1 : 1);
		scroll_ = check_scroll(scroll_);
		};
		*/
		this.scrollbar.updateScrollbar();
		//};
	};

	this.selectAtoB = function (start_id, end_id) {
		var affectedItems = Array();

		if (this.SHIFT_start_id == null) {
			this.SHIFT_start_id = start_id;
		};

		plman.ClearPlaylistSelection(g_active_playlist);

		var previous_focus_id = g_focus_id;

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
		plman.SetPlaylistSelection(g_active_playlist, affectedItems, true);

		plman.SetPlaylistFocusItem(g_active_playlist, end_id);

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

	this.getAlbumIdfromTrackId = function (valeur) { // fixed!
		if (valeur < 0) {
			return -1;
		} else {
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
	};

	this.getOffsetFocusItem = function (fid) { // fixed!
		var row_idx = 0;
		if (fid > -1) {
			if (ppt.showgroupheaders) {
				// fid = no item dans la playlist (focus id)
				// this.rows[] => albumId
				// 1 . rech album id contenant le focus_id
				g_focus_album_id = this.getAlbumIdfromTrackId(fid);
				// 2. rech row id
				for (i = 0; i < this.rows.length; i++) {
					if (this.rows[i].type != 0 && this.rows[i].type != 99 && this.rows[i].albumId == g_focus_album_id) {
						if (this.groups[g_focus_album_id].collapsed) {
							row_idx = i;
						} else {
							var albumTrackId = g_focus_id - this.groups[g_focus_album_id].start;
							row_idx = i + this.groupHeaderRowHeight + albumTrackId;
						};
						break;
					};
				};
			} else {
				// 1 . rech album id contenant le focus_id
				g_focus_album_id = this.getAlbumIdfromTrackId(fid);
				// 2. rech row id
				for (i = 0; i < this.rows.length; i++) {
					if (this.rows[i].type == 0 && this.rows[i].albumId == g_focus_album_id) {
						var albumTrackId = g_focus_id - this.groups[g_focus_album_id].start;
						row_idx = i + albumTrackId;
						break;
					};
				};
			};
		};
		return row_idx;
	};

	this.init_groups = function () {
		var handle = null;
		var current = "";
		var previous = "";
		var g = 0,
		t = 0;
		var arr = [];
		var tr = [];
		var total = this.list.Count;

		if (plman.PlaylistItemCount(g_active_playlist) > 0) {
			this.focusedTrackId = plman.GetPlaylistFocusItemIndex(g_active_playlist);
		} else {
			this.focusedTrackId = -1;
		};

		var d1 = new Date();
		var t1 = d1.getSeconds() * 1000 + d1.getMilliseconds();

		this.groups.splice(0, this.groups.length);
		var tf = ppt.tf_groupkey;
		var str_filter = process_string(filter_text);

		for (var i = 0; i < total; i++) {
			handle = this.list[i];
			arr = tf.EvalWithMetadb(handle).split(" ## ");
			current = arr[0].toLowerCase();
			if (str_filter.length > 0) {
				var toAdd = match(arr[0] + " " + arr[1], str_filter);
			} else {
				var toAdd = true;
			};
			if (toAdd) {
				if (current != previous) {
					if (g > 0) {
						// update current group
						this.groups[g - 1].finalize(t, tr);
						tr.splice(0, t);
						t = 0;
					};
					if (i < total) {
						// add new group
						tr.push(arr[1]);
						t++;
						this.groups.push(new oGroup(g, i, handle, arr[0]));
						g++;
						previous = current;
					};
				} else {
					// add track to current group
					tr.push(arr[1]);
					t++;
				};
			};
		};

		// update last group properties
		if (g > 0)
			this.groups[g - 1].finalize(t, tr);

		var d2 = new Date();
		var t2 = d2.getSeconds() * 1000 + d2.getMilliseconds();
	};

	this.populate = function (is_first_populate) {
		this.list = plman.GetPlaylistItems(g_active_playlist);
		this.init_groups();
		this.setList();
		g_focus_row = brw.getOffsetFocusItem(g_focus_id);
		if (g_focus_id < 0) { // focused item not set
			if (is_first_populate) {
				scroll = scroll_ = 0;
			};
		} else {
			if (is_first_populate) {
				// if focused track not totally visible, we scroll to show it centered in the panel
				if (g_focus_row < scroll / ppt.rowHeight || g_focus_row > scroll / ppt.rowHeight + brw.totalRowsVis - 1) {
					scroll = (g_focus_row - Math.floor(brw.totalRowsVis / 2)) * ppt.rowHeight;
					scroll = check_scroll(scroll);
					scroll_ = scroll;
				};
			};
		};

		if (brw.rowsCount > 0)
			brw.gettags(true);
		this.scrollbar.updateScrollbar();
		this.repaint();
		g_first_populate_done = true;
	};

	this.getlimits = function () {
		if (this.rows.length <= this.totalRowsVis) {
			var start_ = 0;
			var end_ = this.rows.length - 1;
		} else {
			if (scroll_ < 0)
				scroll_ = scroll;
			var start_ = Math.round(scroll_ / ppt.rowHeight + 0.4);
			var end_ = start_ + this.totalRows + (ppt.groupHeaderRowsNumber - 1);
			// check boundaries
			start_ = start_ > 0 ? start_ - 1 : start_;
			if (start_ < 0)
				start_ = 0;
			if (end_ >= this.rows.length)
				end_ = this.rows.length - 1;
			//end_ = end_ < this.rows.length - 1  ? end_ + 1 : this.rows.length - 1;
		};
		g_start_ = start_;
		g_end_ = end_;
	};

	this.gettags = function (all) {
		var start_prev = g_start_;
		var end_prev = g_end_;

		this.getlimits();

		// force full list refresh especially when library is populating (call from 'on_item_focus_change')
		if (Math.abs(g_start_ - start_prev) > 1 || Math.abs(g_end_ - end_prev) > 1)
			all = true;

		var tf_grp = ppt.tf_groupkey;
		var tf_trk = ppt.tf_track;

		if (all) {
			for (var i = g_start_; i <= g_end_; i++) {
				switch (this.rows[i].type) {
				case this.groupHeaderRowHeight: // last group header row
					// group tags
					this.rows[i].groupkey = tf_grp.EvalWithMetadb(this.rows[i].metadb);
					// track tags
					this.rows[i].tracktags = tf_trk.EvalWithMetadb(this.rows[i].metadb);
					break;
				case 0: // track row
					// group tags
					this.rows[i].groupkey = tf_grp.EvalWithMetadb(this.rows[i].metadb);
					// track tags
					this.rows[i].tracktags = tf_trk.EvalWithMetadb(this.rows[i].metadb);
					break;
				};
			};
		} else {
			if (g_start_ < start_prev) {
				switch (this.rows[g_start_].type) {
				case this.groupHeaderRowHeight: // last group header row
					// track tags
					this.rows[g_start_].tracktags = tf_trk.EvalWithMetadb(this.rows[g_start_].metadb);
					break;
				case 0: // track row
					// track tags
					this.rows[g_start_].tracktags = tf_trk.EvalWithMetadb(this.rows[g_start_].metadb);
					break;
				};
			} else if (g_start_ > start_prev || g_end_ > end_prev) {
				switch (this.rows[g_end_].type) {
				case this.groupHeaderRowHeight: // last group header row
					// track tags
					this.rows[g_end_].tracktags = tf_trk.EvalWithMetadb(this.rows[g_end_].metadb);
					break;
				case 0: // track row
					// track tags
					this.rows[g_end_].tracktags = tf_trk.EvalWithMetadb(this.rows[g_end_].metadb);
					break;
				};
			};
		};
	};

	this.draw = function (gr) {
		var coverWidth,
		coverTop;
		var arr_g = [];
		var arr_t = [];
		var arr_e = [];

			if (this.rows.length > 0) {

				var ax = this.marginLR;
				var ay = 0;
				var aw = this.w;
				var ah = ppt.rowHeight;
				var ghrh = this.groupHeaderRowHeight;
				var g = 0;
				var coverWidth = cover.max_w;

				// get Now Playing track
				if (fb.IsPlaying && plman.PlayingPlaylist == g_active_playlist) {
					this.nowplaying = plman.GetPlayingItemLocation();
				} else {
					this.nowplaying = null;
				};

				for (var i = g_start_; i <= g_end_; i++) {
					ay = Math.floor(this.y + (i * ah) - scroll_);
					this.rows[i].x = ax;
					this.rows[i].y = ay;

					switch (this.rows[i].type) {
					case ghrh: // last group header row
						if (ay > 0 - (ghrh * ah) && ay < this.h + (ghrh * ah)) {
							try {
								arr_g = this.rows[i].groupkey.split(" ^^ ");
								arr_e = this.groups[this.rows[i].albumId].tra[0].split(" ^^ ");
							} catch (e) {};

							// Now Playing Group ?
							if (this.nowplaying && this.nowplaying.PlaylistItemIndex >= this.groups[this.rows[i].albumId].start && this.nowplaying.PlaylistItemIndex < this.groups[this.rows[i].albumId].start + this.groups[this.rows[i].albumId].count) {
								var nowplaying_group = true;
							} else {
								var nowplaying_group = false;
							};

							// group id
							g = this.rows[i].albumId;

							// ================
							// group header bg
							// ================
							// if group collapsed, check if 1st track of the group is selected to highlight the group as a selected track]
							var g_selected = false;
							if (this.groups[g].collapsed) {
								var deb = this.groups[g].start;
								var fin = this.groups[g].start + this.groups[g].count;
								for (var p = deb; p < fin; p++) {
									if (plman.IsPlaylistItemSelected(g_active_playlist, p)) {
										var g_selected = true;
										break;
									};
								};
							};
							if (g_selected) {
								var group_color_txt_normal = (ppt.enableCustomColors ? g_color_selected_txt : g_color_normal_bg);
								var group_color_txt_fader = blendColors(group_color_txt_normal, g_color_selected_bg, 0.25);
								gr.FillSolidRect(ax, ay - ((ghrh - 1) * ah), aw, ah * ghrh - 1, g_color_selected_bg & 0xb0ffffff);
							} else {
								var group_color_txt_normal = g_color_normal_txt;
								var group_color_txt_fader = blendColors(g_color_normal_txt, g_color_normal_bg, 0.25);
								//gr.FillGradRect(ax, ay - ((ghrh - 1) * ah), aw, ah * ghrh - 1, 90, 0, g_color_normal_txt & 0x06ffffff, 1.0);
								gr.FillSolidRect(ax, ay - ((ghrh - 1) * ah), aw, ah * ghrh - 1, g_color_normal_txt & 0x05ffffff);
								gr.FillSolidRect(ax, ay - ((ghrh - 1) * ah), aw, 1, g_color_normal_txt & 0x08ffffff);
							};
							// ==========
							// cover art
							// ==========
							if (ghrh > 1 && cover.show) {
								if (this.groups[g].cover_type == null) {
									if (this.groups[g].load_requested == 0) {
										this.groups[g].cover_img = g_image_cache.hit(this.rows[i].metadb, g);
									};
								} else if (this.groups[g].cover_type == 0) {
									this.groups[g].cover_img = FormatCover(images.noart, coverWidth - cover.margin * 2, coverWidth - cover.margin * 2);
								} else if (this.groups[g].cover_type == 3) {
									this.groups[g].cover_img = FormatCover(images.stream, coverWidth - cover.margin * 2, coverWidth - cover.margin * 2);
								};
								this.coverMarginLeft = cover.margin + 1;
								if (this.groups[g].cover_img != null) {
									var cv_w = this.groups[g].cover_img.Width;
									var cv_h = this.groups[g].cover_img.Height;
									var dx = (cover.max_w - cv_w) / 2;
									var dy = (cover.max_h - cv_h) / 2;
									var cv_x = Math.floor(ax + dx + 1);
									var cv_y = Math.floor(ay + dy - ((ghrh - 1) * ah));
									gr.DrawImage(this.groups[g].cover_img, cv_x, cv_y, cv_w, cv_h, 1, 1, cv_w, cv_h, 0, 255);
									gr.DrawRect(cv_x, cv_y, cv_w - 1, cv_h - 1, 1.0, g_color_normal_txt & 0x25ffffff);
								} else {
									var cv_x = Math.floor(ax + cover.margin + 1);
									var cv_y = Math.floor(ay - ((ghrh - 1) * ah) + cover.margin);
									gr.DrawImage(images.loading_draw, cv_x - cover.margin, cv_y - cover.margin, images.loading_draw.Width, images.loading_draw.Height, 0, 0, images.loading_draw.Width, images.loading_draw.Height, images.loading_angle, 230);
								};
								var text_left_margin = cover.max_w;
							} else {
								var text_left_margin = 0;
							};
							// =====
							// text
							// =====
							// right area
							cColumns.dateWidth = gr.CalcTextWidth(arr_e[3], g_font_group1) + 10;
							gr.GdiDrawText(arr_e[3], g_font_group1, group_color_txt_normal, ax + aw - cColumns.dateWidth - 5, ay - ((ghrh - 1) * ah) + Math.round(ah * 1 / 3) - 2, cColumns.dateWidth, Math.round(ah * 2 / 3), DT_RIGHT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
							cColumns.genreWidth = gr.CalcTextWidth(arr_e[2], g_font_group2) + 10;
							gr.GdiDrawText(arr_e[2], g_font_group2, group_color_txt_fader, ax + aw - cColumns.genreWidth - 5, ay - ((ghrh - 2) * ah), cColumns.genreWidth, Math.round(ah * 2 / 3), DT_RIGHT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
							// left area
							if (arr_g[1] == "?") {
								if (this.groups[g].count > 1) {
									var album_name = "(Singles)"
								} else {
									var arr_tmp = this.groups[g].tra[0].split(" ^^ ");
									var album_name = "(Single) " + arr_tmp[1];
								};
							} else {
								var album_name = arr_g[1];
							};
							gr.GdiDrawText(arr_g[0].toUpperCase(), g_font_group1, group_color_txt_fader, ax + text_left_margin + 5, ay - ((ghrh - 1) * ah) + Math.round(ah * 1 / 3) - 2, aw - text_left_margin - cColumns.dateWidth - 10, Math.round(ah * 2 / 3), DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
							gr.GdiDrawText(album_name, g_font_group2, group_color_txt_normal, ax + text_left_margin + 25, ay - ((ghrh - 2) * ah), aw - text_left_margin - cColumns.genreWidth - 30, Math.round(ah * 2 / 3), DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
							if (nowplaying_group) {
								gr.GdiDrawText(">", g_font_group2, group_color_txt_normal, ax + text_left_margin + 5, ay - ((ghrh - 2) * ah), 20, Math.round(ah * 2 / 3), DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
							};
						};
						break;
					case 0: // track row
						if (ay > this.y - ppt.headerBarHeight - ah && ay < this.y + this.h) {
							try {
								arr_t = this.rows[i].tracktags.split(" ^^ ");
								arr_g = this.rows[i].groupkey.split(" ^^ ");
								arr_e = this.groups[this.rows[i].albumId].tra[this.rows[i].albumTrackId].split(" ^^ ");

							} catch (e) {};

							// =========
							// track bg
							// =========
							var track_color_txt = g_color_normal_txt;
							var track_artist_color_text = blendColors(track_color_txt, g_color_normal_bg, 0.25);
							var track_color_rating = blendColors(track_color_txt, g_color_normal_bg, 0.2);

							// selected track bg
							var t_selected = (plman.IsPlaylistItemSelected(g_active_playlist, this.rows[i].playlistTrackId));
							if (t_selected) {
								track_color_txt = (ppt.enableCustomColors ? g_color_selected_txt : g_color_normal_bg);
								track_artist_color_text = blendColors(track_color_txt, g_color_selected_bg, 0.25);
								track_color_rating = blendColors(track_color_txt, g_color_selected_bg, 0.2);
								gr.FillSolidRect(ax, ay, aw, ah, g_color_selected_bg & 0xb0ffffff);
								// default track bg (odd/even)
								if (ppt.showgroupheaders) {
									if (this.rows[i].albumTrackId % 2 == 0) {
										gr.FillSolidRect(ax, ay, aw, ah, RGBA(255, 255, 255, 5));
									} else {
										gr.FillSolidRect(ax, ay, aw, ah, RGBA(0, 0, 0, 5));
									};
								} else {
									if (this.rows[i].playlistTrackId % 2 == 0) {
										gr.FillSolidRect(ax, ay, aw, ah, RGBA(255, 255, 255, 5));
									} else {
										gr.FillSolidRect(ax, ay, aw, ah, RGBA(0, 0, 0, 5));
									};
								};
							} else {
								// default track bg (odd/even)
								if (ppt.showgroupheaders) {
									if (this.rows[i].albumTrackId % 2 != 0) {
										gr.FillSolidRect(ax, ay, aw, ah, g_color_normal_txt & 0x05ffffff);
									};
								} else {
									if (this.rows[i].playlistTrackId % 2 != 0) {
										gr.FillSolidRect(ax, ay, aw, ah, g_color_normal_txt & 0x05ffffff);
									};
								};
							};
							// focused track bg
							if (this.rows[i].playlistTrackId == g_focus_id) {
								gr.DrawRect(ax + 1, ay + 1, aw - 2, ah - 2, 2.0, g_color_selected_bg & 0xd0ffffff);
							};

							// =====
							// text
							// =====
							if (ay >= (0 - ah) && ay < this.y + this.h) {

								var track_type = this.groups[this.rows[i].albumId].tracktype;

								var nbc = this.groups[this.rows[i].albumId].count.toString().length;
								if (nbc == 1)
									nbc++;

								// fields
								var track_num = arr_t[0] == "?" ? this.rows[i].albumTrackId + 1 : arr_t[0];
								var track_num_part = num(track_num, nbc) + "    ";
								if (ppt.showArtistAlways || !ppt.showgroupheaders || arr_e[0].toLowerCase() != arr_g[0].toLowerCase() || ppt.doubleRowText) {
									var track_artist_part = arr_e[0];
								} else {
									var track_artist_part = "";
								};
								var track_title_part = arr_e[1];
								var track_time_part = arr_t[1];
								// rating tag fixing & formatting
								if (this.rows[i].rating == -1) {
									if (isNaN(arr_t[2])) {
										var track_rating_part = 0;
									} else if (Math.abs(arr_t[2]) > 0 && Math.abs(arr_t[2]) < 6) {
										var track_rating_part = Math.abs(arr_t[2]);
									} else {
										var track_rating_part = 0;
									};
									this.rows[i].rating = track_rating_part;
								} else {
									track_rating_part = this.rows[i].rating;
								};

								if (ppt.showRating && track_type != 3) {
									if (g_font_guifx_found) {
										cColumns.track_rating_part = gr.CalcTextWidth("bbbbb", g_font_rating);
									} else if (g_font_wingdings2_found) {
										cColumns.track_rating_part = gr.CalcTextWidth(String.fromCharCode(234).repeat(5), g_font_rating);
									} else {
										cColumns.track_rating_part = gr.CalcTextWidth(String.fromCharCode(0x25CF).repeat(5), g_font_rating);
									};
								} else {
									cColumns.track_rating_part = 0;
								};

								gr.SetTextRenderingHint(4);

								//
								if (ppt.doubleRowText) {
									var ay_1 = ay + 2;
									var ah_1 = Math.floor(ah / 2);
									var ay_2 = ay + ah_1 - 2;
									var ah_2 = ah - Math.floor(ah / 2);
									if (this.nowplaying && this.rows[i].playlistTrackId == this.nowplaying.PlaylistItemIndex) { // now playing track
										this.nowplaying_y = ay;
										if (!g_time_remaining) {
											g_time_remaining = ppt.tf_time_remaining.Eval(true);
										};
										track_time_part = g_time_remaining;
										//
										cColumns.track_num_part = gr.CalcTextWidth(track_num_part, g_font) + 10;
										cColumns.track_artist_part = track_artist_part.length > 0 ? gr.CalcTextWidth(track_artist_part, g_font) + 0 : 0;
										cColumns.track_title_part = gr.CalcTextWidth(track_title_part, g_font) + 10;
										cColumns.track_time_part = gr.CalcTextWidth("00:00:00", g_font) + 10;
										var tx = ax + cColumns.track_num_part;
										var tw = aw - cColumns.track_num_part;
										if (track_time_part == "ON AIR") {
											gr.GdiDrawText(g_radio_title, g_font, track_color_txt, tx + 10, ay_1, tw - cColumns.track_time_part - 15 - (cColumns.track_rating_part + 10), ah_1, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
											gr.GdiDrawText(g_radio_artist, g_font, track_artist_color_text, tx + 10, ay_2, tw - cColumns.track_time_part - 15, ah_2, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
										} else {
											gr.GdiDrawText(track_title_part, g_font, track_color_txt, tx + 10, ay_1, tw - cColumns.track_time_part - 15 - (cColumns.track_rating_part + 10), ah_1, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
											gr.GdiDrawText(track_artist_part, g_font, track_artist_color_text, tx + 10, ay_2, tw - cColumns.track_time_part - 15, ah_2, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
										};
										gr.GdiDrawText(track_time_part, g_font, track_color_txt, tx + tw - cColumns.track_time_part - 5, ay_1, cColumns.track_time_part, ah_1, DT_RIGHT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
										if (g_seconds == 0 || g_seconds / 2 == Math.floor(g_seconds / 2)) {
											gr.DrawImage(images.play_on.Resize(ppt.rowHeight, ppt.rowHeight, 2), ax + 2, ay, ppt.rowHeight, ppt.rowHeight, 0, 0, ppt.rowHeight, ppt.rowHeight, 0, 255);
										} else {
											gr.DrawImage(images.play_off.Resize(ppt.rowHeight, ppt.rowHeight, 2), ax + 2, ay, ppt.rowHeight, ppt.rowHeight, 0, 0, ppt.rowHeight, ppt.rowHeight, 0, 255);
										};
										// rating Stars
										if (ppt.showRating && track_type != 3) {
											if (g_font_guifx_found) {
												gr.DrawString("b".repeat(5), g_font_rating, track_color_txt & 0x15ffffff, tx + tw - cColumns.track_time_part - (cColumns.track_rating_part + 10), ay_1, cColumns.track_rating_part + 10, ah_1, lc_stringformat);
												gr.DrawString("b".repeat(track_rating_part), g_font_rating, track_color_rating, tx + tw - cColumns.track_time_part - (cColumns.track_rating_part + 10), ay_1, cColumns.track_rating_part + 10, ah_1, lc_stringformat);
											} else if (g_font_wingdings2_found) {
												gr.DrawString(String.fromCharCode(234).repeat(5), g_font_rating, track_color_txt & 0x15ffffff, tx + tw - cColumns.track_time_part - (cColumns.track_rating_part + 10), ay_1, cColumns.track_rating_part + 10, ah_1, lc_stringformat);
												gr.DrawString(String.fromCharCode(234).repeat(track_rating_part), g_font_rating, track_color_rating, tx + tw - cColumns.track_time_part - (cColumns.track_rating_part + 10), ay_1, cColumns.track_rating_part + 10, ah_1, lc_stringformat);
											} else {
												gr.DrawString(String.fromCharCode(0x25CF).repeat(5), g_font_rating, track_color_txt & 0x15ffffff, tx + tw - cColumns.track_time_part - (cColumns.track_rating_part + 10), ay_1, cColumns.track_rating_part + 10, ah_1, lc_stringformat);
												gr.DrawString(String.fromCharCode(0x25CF).repeat(track_rating_part), g_font_rating, track_color_rating, tx + tw - cColumns.track_time_part - (cColumns.track_rating_part + 10), ay_1, cColumns.track_rating_part + 10, ah_1, lc_stringformat);
											};
										};
									} else {
										cColumns.track_num_part = gr.CalcTextWidth(track_num_part, g_font) + 10;
										cColumns.track_artist_part = track_artist_part.length > 0 ? gr.CalcTextWidth(track_artist_part, g_font) : 0;
										cColumns.track_title_part = gr.CalcTextWidth(track_title_part, g_font) + 10;
										cColumns.track_time_part = gr.CalcTextWidth("00:00:00", g_font) + 10;
										var tx = ax + cColumns.track_num_part;
										var tw = aw - cColumns.track_num_part;
										gr.GdiDrawText(track_num_part, g_font, track_color_txt, ax + 10, ay_1, cColumns.track_num_part, ah_1, DT_RIGHT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
										gr.GdiDrawText(track_artist_part, g_font, track_artist_color_text, tx + 10, ay_2, tw - cColumns.track_time_part - 15, ah_2, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
										gr.GdiDrawText(track_title_part, g_font, track_color_txt, tx + 10, ay_1, tw - cColumns.track_time_part - 15 - (cColumns.track_rating_part + 10), ah_1, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
										gr.GdiDrawText(track_time_part, g_font, track_color_txt, tx + tw - cColumns.track_time_part - 5, ay_1, cColumns.track_time_part, ah_1, DT_RIGHT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
										// rating Stars
										if (ppt.showRating && track_type != 3) {
											if (g_font_guifx_found) {
												gr.DrawString("b".repeat(5), g_font_rating, track_color_txt & 0x15ffffff, tx + tw - cColumns.track_time_part - (cColumns.track_rating_part + 10), ay_1, cColumns.track_rating_part + 10, ah_1, lc_stringformat);
												gr.DrawString("b".repeat(track_rating_part), g_font_rating, track_color_rating, tx + tw - cColumns.track_time_part - (cColumns.track_rating_part + 10), ay_1, cColumns.track_rating_part + 10, ah_1, lc_stringformat);
											} else if (g_font_wingdings2_found) {
												gr.DrawString(String.fromCharCode(234).repeat(5), g_font_rating, track_color_txt & 0x15ffffff, tx + tw - cColumns.track_time_part - (cColumns.track_rating_part + 10), ay_1, cColumns.track_rating_part + 10, ah_1, lc_stringformat);
												gr.DrawString(String.fromCharCode(234).repeat(track_rating_part), g_font_rating, track_color_rating, tx + tw - cColumns.track_time_part - (cColumns.track_rating_part + 10), ay_1, cColumns.track_rating_part + 10, ah_1, lc_stringformat);
											} else {
												gr.DrawString(String.fromCharCode(0x25CF).repeat(5), g_font_rating, track_color_txt & 0x15ffffff, tx + tw - cColumns.track_time_part - (cColumns.track_rating_part + 10), ay_1, cColumns.track_rating_part + 10, ah_1, lc_stringformat);
												gr.DrawString(String.fromCharCode(0x25CF).repeat(track_rating_part), g_font_rating, track_color_rating, tx + tw - cColumns.track_time_part - (cColumns.track_rating_part + 10), ay_1, cColumns.track_rating_part + 10, ah_1, lc_stringformat);
											};
										};
									};
								} else {
									if (track_artist_part.length > 0) {
										track_artist_part = track_artist_part + " - ";
									};
									// calc text part width + dtaw text
									if (this.nowplaying && this.rows[i].playlistTrackId == this.nowplaying.PlaylistItemIndex) { // now playing track
										this.nowplaying_y = ay;
										if (!g_time_remaining) {
											g_time_remaining = ppt.tf_time_remaining.Eval(true);
										};
										track_time_part = g_time_remaining;
										//
										if (track_time_part == "ON AIR") {
											if (g_radio_artist.length > 0) {
												g_radio_artist = g_radio_artist + " - ";
											};
										};
										//
										cColumns.track_num_part = gr.CalcTextWidth(track_num_part, g_font) + 10;
										cColumns.track_title_part = gr.CalcTextWidth(track_title_part, g_font) + 10;
										cColumns.track_time_part = gr.CalcTextWidth("00:00:00", g_font) + 10;
										if (track_time_part == "ON AIR") {
											cColumns.track_artist_part = g_radio_artist.length > 0 ? gr.CalcTextWidth(g_radio_artist, g_font) : 0;
										} else {
											cColumns.track_artist_part = track_artist_part.length > 0 ? gr.CalcTextWidth(track_artist_part, g_font) : 0;
										};
										var tx = ax + cColumns.track_num_part;
										var tw = aw - cColumns.track_num_part;
										if (cColumns.track_artist_part > 0) {
											if (track_time_part == "ON AIR") {
												gr.GdiDrawText(g_radio_artist, g_font, track_artist_color_text, tx + 10, ay, tw - cColumns.track_time_part - 15 - (cColumns.track_rating_part + 10), ah, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
											} else {
												gr.GdiDrawText(track_artist_part, g_font, track_artist_color_text, tx + 10, ay, tw - cColumns.track_time_part - 15 - (cColumns.track_rating_part + 10), ah, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
											};
										};
										if (track_time_part == "ON AIR") {
											gr.GdiDrawText(g_radio_title, g_font, track_color_txt, tx + cColumns.track_artist_part + 10, ay, tw - cColumns.track_artist_part - cColumns.track_time_part - 15 - (cColumns.track_rating_part + 10), ah, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
										} else {
											gr.GdiDrawText(track_title_part, g_font, track_color_txt, tx + cColumns.track_artist_part + 10, ay, tw - cColumns.track_artist_part - cColumns.track_time_part - 15 - (cColumns.track_rating_part + 10), ah, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
										};
										gr.GdiDrawText(track_time_part, g_font, track_color_txt, tx + tw - cColumns.track_time_part - 5, ay, cColumns.track_time_part, ah, DT_RIGHT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
										if (g_seconds == 0 || g_seconds / 2 == Math.floor(g_seconds / 2)) {
											gr.DrawImage(images.play_on.Resize(ppt.rowHeight, ppt.rowHeight, 2), ax + 5, ay, ppt.rowHeight, ppt.rowHeight, 0, 0, ppt.rowHeight, ppt.rowHeight, 0, 255);
										} else {
											gr.DrawImage(images.play_off.Resize(ppt.rowHeight, ppt.rowHeight, 2), ax + 5, ay, ppt.rowHeight, ppt.rowHeight, 0, 0, ppt.rowHeight, ppt.rowHeight, 0, 255);
										};
										// rating Stars
										if (ppt.showRating && track_type != 3) {
											if (g_font_guifx_found) {
												gr.DrawString("b".repeat(5), g_font_rating, track_color_txt & 0x15ffffff, tx + tw - cColumns.track_time_part - (cColumns.track_rating_part + 10), ay, cColumns.track_rating_part + 10, ah, lc_stringformat);
												gr.DrawString("b".repeat(track_rating_part), g_font_rating, track_color_rating, tx + tw - cColumns.track_time_part - (cColumns.track_rating_part + 10), ay, cColumns.track_rating_part + 10, ah, lc_stringformat);
											} else if (g_font_wingdings2_found) {
												gr.DrawString(String.fromCharCode(234).repeat(5), g_font_rating, track_color_txt & 0x15ffffff, tx + tw - cColumns.track_time_part - (cColumns.track_rating_part + 10), ay, cColumns.track_rating_part + 10, ah, lc_stringformat);
												gr.DrawString(String.fromCharCode(234).repeat(track_rating_part), g_font_rating, track_color_rating, tx + tw - cColumns.track_time_part - (cColumns.track_rating_part + 10), ay, cColumns.track_rating_part + 10, ah, lc_stringformat);
											} else {
												gr.DrawString(String.fromCharCode(0x25CF).repeat(5), g_font_rating, track_color_txt & 0x15ffffff, tx + tw - cColumns.track_time_part - (cColumns.track_rating_part + 10), ay, cColumns.track_rating_part + 10, ah, lc_stringformat);
												gr.DrawString(String.fromCharCode(0x25CF).repeat(track_rating_part), g_font_rating, track_color_rating, tx + tw - cColumns.track_time_part - (cColumns.track_rating_part + 10), ay, cColumns.track_rating_part + 10, ah, lc_stringformat);
											};
										};
									} else { // default track
										cColumns.track_num_part = gr.CalcTextWidth(track_num_part, g_font) + 10;
										cColumns.track_artist_part = track_artist_part.length > 0 ? gr.CalcTextWidth(track_artist_part, g_font) + 0 : 0;
										cColumns.track_title_part = gr.CalcTextWidth(track_title_part, g_font) + 10;
										cColumns.track_time_part = gr.CalcTextWidth("00:00:00", g_font) + 10;
										var tx = ax + cColumns.track_num_part;
										var tw = aw - cColumns.track_num_part;
										gr.GdiDrawText(track_num_part, g_font, track_color_txt, ax + 10, ay, cColumns.track_num_part, ah, DT_RIGHT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
										if (cColumns.track_artist_part > 0) {
											gr.GdiDrawText(track_artist_part, g_font, track_artist_color_text, tx + 10, ay, tw - cColumns.track_time_part - 15 - (cColumns.track_rating_part + 10), ah, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
										};
										gr.GdiDrawText(track_title_part, g_font, track_color_txt, tx + cColumns.track_artist_part + 10, ay, tw - cColumns.track_artist_part - cColumns.track_time_part - 15 - (cColumns.track_rating_part + 10), ah, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
										gr.GdiDrawText(track_time_part, g_font, track_color_txt, tx + tw - cColumns.track_time_part - 5, ay, cColumns.track_time_part, ah, DT_RIGHT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
										// rating Stars
										if (ppt.showRating && track_type != 3) {
											if (g_font_guifx_found) {
												gr.DrawString("b".repeat(5), g_font_rating, track_color_txt & 0x15ffffff, tx + tw - cColumns.track_time_part - (cColumns.track_rating_part + 10), ay, cColumns.track_rating_part + 10, ah, lc_stringformat);
												gr.DrawString("b".repeat(track_rating_part), g_font_rating, track_color_rating, tx + tw - cColumns.track_time_part - (cColumns.track_rating_part + 10), ay, cColumns.track_rating_part + 10, ah, lc_stringformat);
											} else if (g_font_wingdings2_found) {
												gr.DrawString(String.fromCharCode(234).repeat(5), g_font_rating, track_color_txt & 0x15ffffff, tx + tw - cColumns.track_time_part - (cColumns.track_rating_part + 10), ay, cColumns.track_rating_part + 10, ah, lc_stringformat);
												gr.DrawString(String.fromCharCode(234).repeat(track_rating_part), g_font_rating, track_color_rating, tx + tw - cColumns.track_time_part - (cColumns.track_rating_part + 10), ay, cColumns.track_rating_part + 10, ah, lc_stringformat);
											} else {
												gr.DrawString(String.fromCharCode(0x25CF).repeat(5), g_font_rating, track_color_txt & 0x15ffffff, tx + tw - cColumns.track_time_part - (cColumns.track_rating_part + 10), ay, cColumns.track_rating_part + 10, ah, lc_stringformat);
												gr.DrawString(String.fromCharCode(0x25CF).repeat(track_rating_part), g_font_rating, track_color_rating, tx + tw - cColumns.track_time_part - (cColumns.track_rating_part + 10), ay, cColumns.track_rating_part + 10, ah, lc_stringformat);
											};
										};
									};
								};
							};
						};
						break;
					case 99: // extra bottom row
						if (ay > -1 && ay < this.h) {
							if (this.rows[i].albumTrackId % 2 == 0) {
								gr.FillSolidRect(ax, ay, aw, ah, RGBA(255, 255, 255, 3));
							} else {
								gr.FillSolidRect(ax, ay, aw, ah, RGBA(0, 0, 0, 3));
							};
						};
						break;
					};

				};
				// draw scrollbar
				//if(cScrollBar.enabled || (m_x > ww - cScrollBar.width && m_x < ww && m_y > ppt.headerBarHeight && m_y < wh))  {
				if (cScrollBar.enabled) {
					brw.scrollbar && brw.scrollbar.draw(gr);
				};

				// Incremental Search Display
				if (cList.search_string.length > 0) {
					gr.SetSmoothingMode(2);
					brw.tt_x = Math.floor(((brw.w) / 2) - (((cList.search_string.length * 13) + (10 * 2)) / 2));
					brw.tt_y = brw.y + Math.floor((brw.h / 2) - 30);
					brw.tt_w = Math.round((cList.search_string.length * 13) + (10 * 2));
					brw.tt_h = 60;
					gr.FillRoundRect(brw.tt_x, brw.tt_y, brw.tt_w, brw.tt_h, 5, 5, RGBA(0, 0, 0, 150));
					gr.DrawRoundRect(brw.tt_x, brw.tt_y, brw.tt_w, brw.tt_h, 5, 5, 1.0, RGBA(0, 0, 0, 100));
					gr.DrawRoundRect(brw.tt_x + 1, brw.tt_y + 1, brw.tt_w - 2, brw.tt_h - 2, 4, 4, 1.0, RGBA(255, 255, 255, 050));
					try {
						gr.GdiDrawText(cList.search_string, cList.incsearch_font_big, RGB(0, 0, 0), brw.tt_x + 1, brw.tt_y + 1, brw.tt_w, brw.tt_h, DT_CENTER | DT_NOPREFIX | DT_CALCRECT | DT_VCENTER);
						gr.GdiDrawText(cList.search_string, cList.incsearch_font_big, cList.inc_search_noresult ? RGB(255, 70, 70) : RGB(250, 250, 250), brw.tt_x, brw.tt_y, brw.tt_w, brw.tt_h, DT_CENTER | DT_NOPREFIX | DT_CALCRECT | DT_VCENTER);
					} catch (e) {};
				};

			} else { // no track, playlist is empty

				// draw scrollbar
				if (cScrollBar.enabled) {
					brw.scrollbar && brw.scrollbar.draw(gr);
				};
			};

			// draw header
			if (ppt.showHeaderBar) {
				//var boxText = "  "+this.groups.length+" album"+(this.groups.length>1?"s  ":"  ");
				var boxText = (plman.PlaylistCount > 0 ? plman.GetPlaylistName(plman.ActivePlaylist) + "  " : "no playlist  ");
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
					gr.GdiDrawText(boxText, g_font_box, blendColors(g_color_normal_txt, g_color_normal_bg, 0.4), tx, 0, tw, ppt.headerBarHeight - 1, DT_RIGHT | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX | DT_END_ELLIPSIS);
				} catch (e) {
					console.log(">> debug: cScrollBar.width=" + cScrollBar.width + " /boxText=" + boxText + " /ppt.headerBarHeight=" + ppt.headerBarHeight + " /g_fsize=" + g_fsize);
				};
			};
	};

	this.selectGroupTracks = function (aId) { // fixed!
		var affectedItems = [];
		var end = this.groups[aId].start + this.groups[aId].count;
		for (var i = this.groups[aId].start; i < end; i++) {
			affectedItems.push(i);
		};
		plman.SetPlaylistSelection(g_active_playlist, affectedItems, true);
	};

	this._isHover = function (x, y) {
		return (x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h);
	};

	this.dragndrop_check = function (x, y, rowId) {
		if (this.activeRow > -1 && rowId == this.activeRow) {
			g_dragndrop_trackId = this.rows[rowId].playlistTrackId;
		};
	};

	this.on_mouse = function (event, x, y) {
		this.ishover = (x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h);

		// get hover row index (mouse cursor hover)
		if (y > this.y && y < this.y + this.h) {
			this.activeRow = Math.ceil((y + scroll_ - this.y) / ppt.rowHeight - 1);
			if (this.activeRow >= this.rows.length)
				this.activeRow = -1;
		} else {
			this.activeRow = -1;
		};

		// rating check
		this.ishover_rating_prev = this.ishover_rating;
		if (this.activeRow > -1) {
			var rating_x = this.x + this.w - cColumns.track_time_part - (cColumns.track_rating_part + 10);
			var rating_y = Math.floor(this.y + (this.activeRow * ppt.rowHeight) - scroll_);
			if (ppt.showRating) {
				this.ishover_rating = (this.rows[this.activeRow].type == 0 && x >= rating_x && x <= rating_x + cColumns.track_rating_part && y >= rating_y && y <= rating_y + ppt.rowHeight);
			} else {
				this.ishover_rating = false;
			};
		} else {
			this.ishover_rating = false;
		};

		switch (event) {
		case "down":
			this.metadblist_selection = plman.GetPlaylistSelectedItems(g_active_playlist);
			if (!cTouch.down && !timers.mouseDown && this.ishover && this.activeRow > -1 && Math.abs(scroll - scroll_) < 2) {
				var rowType = this.rows[this.activeRow].type;
				//
				this.drag_clicked = true;
				this.drag_clicked_x = x;
				//
				switch (true) {
				case (rowType > 0 && rowType < 99): // ----------------> group header row
					var playlistTrackId = this.rows[this.activeRow].playlistTrackId;
					if (utils.IsKeyPressed(VK_SHIFT)) {
						if (g_focus_id != playlistTrackId) {
							if (this.SHIFT_start_id != null) {
								this.selectAtoB(this.SHIFT_start_id, playlistTrackId);
							} else {
								this.selectAtoB(g_focus_id, playlistTrackId);
							};
						};
					} else if (utils.IsKeyPressed(VK_CONTROL)) {
						this.selectGroupTracks(this.rows[this.activeRow].albumId);
						this.SHIFT_start_id = null;
					} else {
						plman.ClearPlaylistSelection(g_active_playlist);
						if (!(ppt.autocollapse && this.groups[this.rows[this.activeRow].albumId].collapsed)) {
							this.selectGroupTracks(this.rows[this.activeRow].albumId);
						};
						this.SHIFT_start_id = null;
					};
					plman.SetPlaylistFocusItem(g_active_playlist, playlistTrackId);
					break;
				case (rowType == 0): // ----------------> track row
					var playlistTrackId = this.rows[this.activeRow].playlistTrackId;
					if (utils.IsKeyPressed(VK_SHIFT)) {
						if (g_focus_id != playlistTrackId) {
							if (this.SHIFT_start_id != null) {
								this.selectAtoB(this.SHIFT_start_id, playlistTrackId);
							} else {
								this.selectAtoB(g_focus_id, playlistTrackId);
							};
						};
					} else if (utils.IsKeyPressed(VK_CONTROL)) {
						if (plman.IsPlaylistItemSelected(g_active_playlist, playlistTrackId)) {
							plman.SetPlaylistSelectionSingle(g_active_playlist, playlistTrackId, false);
						} else {
							plman.SetPlaylistSelectionSingle(g_active_playlist, playlistTrackId, true);
							plman.SetPlaylistFocusItem(g_active_playlist, playlistTrackId);
						};
						this.SHIFT_start_id = null;
					} else {
						// check if rating to update ?
						if (this.ishover_rating) {
							// calc new rating
							var l_rating = Math.ceil((x - rating_x) / (cColumns.track_rating_part / 5) + 0.1);
							if (l_rating > 5)
								l_rating = 5;
							// update if new rating <> current track rating
							if (this.rows[this.activeRow].tracktype < 2) {
								g_rating_updated = true;
								g_rating_rowId = this.activeRow;
								if (foo_playcount) {
									// Rate to database statistics brought by foo_playcount.dll
									if (l_rating != this.rows[this.activeRow].rating) {
										if (this.rows[this.activeRow].metadb) {
											this.rows[this.activeRow].rating = l_rating;
											window.Repaint();
											fb.RunContextCommandWithMetadb("Playback Statistics/Rating/" + ((l_rating == 0) ? "<not set>" : l_rating), this.rows[this.activeRow].metadb);
										};
									} else {
										this.rows[this.activeRow].rating = 0;
										window.Repaint();
										fb.RunContextCommandWithMetadb("Playback Statistics/Rating/<not set>", this.rows[this.activeRow].metadb);
									};
								} else {
									var handles = new FbMetadbHandleList(this.rows[this.activeRow].metadb);
									// Rate to file
									if (l_rating != this.rows[this.activeRow].rating) {
										this.rows[this.activeRow].rating = l_rating;
										window.Repaint();
										handles.UpdateFileInfoFromJSON(JSON.stringify({"RATING" : l_rating}));
									} else {
										this.rows[this.activeRow].rating = 0;
										window.Repaint();
										handles.UpdateFileInfoFromJSON(JSON.stringify({"RATING" : ""}));
									};
								};
							};
						} else {
							if (plman.IsPlaylistItemSelected(g_active_playlist, playlistTrackId)) {
								if (this.metadblist_selection.Count > 1) {
									//plman.ClearPlaylistSelection(g_active_playlist);
									//plman.SetPlaylistSelectionSingle(g_active_playlist, playlistTrackId, true);
									//plman.SetPlaylistFocusItem(g_active_playlist, playlistTrackId);
								} else {
									// nothing, single track already selected
								};
							} else {
								plman.ClearPlaylistSelection(g_active_playlist);
								plman.SetPlaylistSelectionSingle(g_active_playlist, playlistTrackId, true);
								plman.SetPlaylistFocusItem(g_active_playlist, playlistTrackId);
							};
							this.SHIFT_start_id = null;
						};
					};
					break;
				case (rowType == 99): // ----------------> extra empty row

					break;
				};
				this.repaint();
			} else {
				// scrollbar
				if (cScrollBar.enabled && cScrollBar.visible) {
					brw.scrollbar && brw.scrollbar.on_mouse(event, x, y);
				};
			};
			break;
		case "up":
			this.metadblist_selection = plman.GetPlaylistSelectedItems(g_active_playlist);
			if (this.drag_clicked && this.activeRow > -1) {
				var rowType = this.rows[this.activeRow].type;
				//
				switch (true) {
				case (rowType > 0 && rowType < 99): // ----------------> group header row
					//var playlistTrackId = this.rows[this.activeRow].playlistTrackId;
					break;
				case (rowType == 0): // ----------------> track row
					var playlistTrackId = this.rows[this.activeRow].playlistTrackId;
					if (!utils.IsKeyPressed(VK_SHIFT) && !utils.IsKeyPressed(VK_CONTROL)) {
						if (plman.IsPlaylistItemSelected(g_active_playlist, playlistTrackId)) {
							if (this.metadblist_selection.Count > 1) {
								plman.ClearPlaylistSelection(g_active_playlist);
								plman.SetPlaylistSelectionSingle(g_active_playlist, playlistTrackId, true);
								plman.SetPlaylistFocusItem(g_active_playlist, playlistTrackId);
							};
						};
					};
					break;
				case (rowType == 99): // ----------------> extra empty row

					break;
				};
				this.repaint();
			};

			this.drag_clicked = false;
			// scrollbar
			if (cScrollBar.enabled && cScrollBar.visible) {
				brw.scrollbar && brw.scrollbar.on_mouse(event, x, y);
			};
			break;
		case "dblclk":
			if (this.ishover && this.activeRow > -1 && Math.abs(scroll - scroll_) < 2) {
				var rowType = this.rows[this.activeRow].type;
				switch (true) {
				case (rowType > 0 && rowType < 99): // group header
					this.groups[this.rows[this.activeRow].albumId].collapsed = !this.groups[this.rows[this.activeRow].albumId].collapsed;
					this.setList(true);
					///*
					g_focus_row = this.getOffsetFocusItem(g_focus_id);
					// if focused track not totally visible, we scroll to show it centered in the panel
					if (g_focus_row < scroll / ppt.rowHeight || g_focus_row > scroll / ppt.rowHeight + brw.totalRowsVis - 1) {
						scroll = (g_focus_row - Math.floor(brw.totalRowsVis / 2)) * ppt.rowHeight;
						scroll = check_scroll(scroll);
						scroll_ = scroll;
					};
					//*/
					if (this.rowsCount > 0)
						brw.gettags(true);
					this.scrollbar.updateScrollbar();
					brw.repaint();
					break;
				case (rowType == 0): // track
					plman.ExecutePlaylistDefaultAction(g_active_playlist, this.rows[this.activeRow].playlistTrackId);
					break;
				case (rowType == 99): // extra empty row

					break;
				};
				this.repaint();
			} else {
				// scrollbar
				if (cScrollBar.enabled && cScrollBar.visible) {
					brw.scrollbar && brw.scrollbar.on_mouse(event, x, y);
				};
			};
			break;
		case "move":
			if (g_lbtn_click && this.drag_clicked && !this.drag_moving) {
				if (x - this.drag_clicked_x > 30 && this.h > cPlaylistManager.rowHeight * 6) {
					this.drag_moving = true;
					window.SetCursor(IDC_HELP);
					pman.state = 1;
					if (timers.hidePlaylistManager) {
						window.ClearInterval(timers.hidePlaylistManager);
						timers.hidePlaylistManager = false;
					};
					if (!timers.showPlaylistManager) {
						timers.showPlaylistManager = window.SetInterval(pman.showPanel, 25);
					};
				};
			};
			if (this.drag_moving && !timers.hidePlaylistManager && !timers.showPlaylistManager) {
				pman.on_mouse("move", x, y);
			};
			// scrollbar
			if (this.ishover_rating) {
				if (!this.ishover_rating_prev)
					window.SetCursor(IDC_HAND);
			} else {
				if (this.ishover_rating_prev)
					window.SetCursor(IDC_ARROW);
				if (cScrollBar.enabled && cScrollBar.visible) {
					brw.scrollbar && brw.scrollbar.on_mouse(event, x, y);
				};
			};
			break;
		case "right":
			this.metadblist_selection = plman.GetPlaylistSelectedItems(g_active_playlist);
			if (this.ishover && this.activeRow > -1 && Math.abs(scroll - scroll_) < 2) {
				var rowType = this.rows[this.activeRow].type;
				switch (true) {
				case (rowType > 0 && rowType < 99): // ----------------> group header row
					var playlistTrackId = this.rows[this.activeRow].playlistTrackId;
					if (!plman.IsPlaylistItemSelected(g_active_playlist, playlistTrackId)) {
						plman.ClearPlaylistSelection(g_active_playlist);
						this.selectGroupTracks(this.rows[this.activeRow].albumId);
						plman.SetPlaylistFocusItem(g_active_playlist, playlistTrackId);
						this.SHIFT_start_id = null;
					};
					this.context_menu(x, y, this.track_index, this.row_index);
					break;
				case (rowType == 0): // ----------------> track row
					var playlistTrackId = this.rows[this.activeRow].playlistTrackId;
					if (!plman.IsPlaylistItemSelected(g_active_playlist, playlistTrackId)) {
						plman.ClearPlaylistSelection(g_active_playlist);
						plman.SetPlaylistSelectionSingle(g_active_playlist, playlistTrackId, true);
						plman.SetPlaylistFocusItem(g_active_playlist, playlistTrackId);
					};
					this.context_menu(x, y, playlistTrackId, this.activeRow);
					break;
				case (rowType == 99): // ----------------> extra empty row

					break;
				};
				this.repaint();
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
			break;
		case "wheel":
			//this.scrollbar.updateScrollbar(); // update scrollbar done in g_time at each scroll update
			break;
		case "leave":
			// scrollbar
			if (cScrollBar.enabled && cScrollBar.visible) {
				this.scrollbar && this.scrollbar.on_mouse(event, 0, 0);
			};
			break;
		case "drag_over":
			g_dragndrop_bottom = false;
			if (this.groups.length > 0) {
				var fin = this.rows.length;
				for (var i = 0; i < fin; i++) {
					this.dragndrop_check(x, y, i);
				};
				var rowId = fin - 1;
				var item_height_row = (this.rows[rowId].type == 0 ? 1 : ppt.groupHeaderRowsNumber);
				var limit = this.rows[rowId].y + (item_height_row * ppt.rowHeight);
				if (y > limit) {
					g_dragndrop_bottom = true;
					g_dragndrop_trackId = this.rows[rowId].playlistTrackId;
				};
			} else {
				g_dragndrop_bottom = true;
				g_dragndrop_trackId = 0;
			};
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
				need_repaint = true;
				isScrolling = true;
				//
				if (scroll_prev != scroll)
					brw.scrollbar.updateScrollbar();
			} else {
				if (isScrolling) {
					if (scroll_ < 1)
						scroll_ = 0;
					isScrolling = false;
					need_repaint = true;
				};
			};
			if (need_repaint) {
				if (isScrolling && brw.rows.length > 0)
					brw.gettags(false);
				need_repaint = false;
				images.loading_angle = (images.loading_angle + 30) % 360;
				window.Repaint();
			};

			scroll_prev = scroll;

		}, ppt.refreshRate);

	this.context_menu = function (x, y, id, row_id) {
		var _menu = window.CreatePopupMenu();
		var Context = fb.CreateContextMenuManager();
		var _child01 = window.CreatePopupMenu();
		var _child02 = window.CreatePopupMenu();

		if (brw.activeRow > -1) {
			var albumIndex = this.rows[this.activeRow].albumId;
			var crc = brw.groups[albumIndex].cachekey;
		};

		this.metadblist_selection = plman.GetPlaylistSelectedItems(g_active_playlist);
		Context.InitContextPlaylist();

		// check if selection is single and is in the Media Library to provide if ok a link to Album View panel
		var showInAlbumView = false;
		if (this.metadblist_selection.Count == 1) {
			if (fb.IsMetadbInMediaLibrary(this.metadblist_selection[0])) {
				showInAlbumView = true;
			};
		};

		_menu.AppendMenuItem(MF_STRING, 1, "Settings...");
		_menu.AppendMenuSeparator();
		Context.BuildMenu(_menu, 2);

		_child01.AppendTo(_menu, MF_STRING, "Selection...");
		if (brw.activeRow > -1) {
			if (this.metadblist_selection.Count == 1) {
				_child01.AppendMenuItem(MF_STRING, 1010, "Reset Image Cache");
			};
		};
		_child01.AppendMenuItem((showInAlbumView ? MF_STRING : MF_GRAYED | MF_DISABLED), 1011, "Highlight in JS Smooth Browser");
		_child01.AppendMenuItem(plman.IsAutoPlaylist(g_active_playlist) ? MF_DISABLED | MF_GRAYED : MF_STRING, 1020, "Remove");
		_child02.AppendTo(_child01, MF_STRING, "Send to...");
		_child02.AppendMenuItem(MF_STRING, 2000, "a New playlist...");

		var pl_count = plman.PlaylistCount;
		if (pl_count > 1) {
			_child02.AppendMenuItem(MF_SEPARATOR, 0, "");
		};
		for (var i = 0; i < pl_count; i++) {
			if (i != this.playlist && !plman.IsAutoPlaylist(i)) {
				_child02.AppendMenuItem(MF_STRING, 2001 + i, plman.GetPlaylistName(i));
			};
		};

		var ret = _menu.TrackPopupMenu(x, y);
		if (ret > 1 && ret < 800) {
			Context.ExecuteByID(ret - 2);
		} else if (ret < 2) {
			switch (ret) {
			case 1:
				//window.ShowProperties();
				this.settings_context_menu(x, y);
				break;
			};
		} else {
			switch (ret) {
			case 1010:
				if (fso.FileExists(CACHE_FOLDER + crc)) {
					try {
						fso.DeleteFile(CACHE_FOLDER + crc);
					} catch (e) {
						console.log("Spider Monkey Panel Error: Image cache [" + crc + "] can't be deleted on disk, file in use, try later or reload panel.");
					};
				};
				this.groups[albumIndex].tid = -1;
				this.groups[albumIndex].load_requested = 0;
				this.groups[albumIndex].save_requested = false;
				g_image_cache.reset(crc);
				this.groups[albumIndex].cover_img = null;
				this.groups[albumIndex].cover_type = null;
				this.repaint();
				break;
			case 1011:
				window.NotifyOthers("JSSmoothPlaylist->JSSmoothBrowser:show_item", this.metadblist_selection[0]);
				break;
			case 1020:
				plman.RemovePlaylistSelection(g_active_playlist, false);
				break;
			case 2000:
				plman.CreatePlaylist(plman.PlaylistCount, "");
				plman.ActivePlaylist = plman.PlaylistCount - 1;
				plman.InsertPlaylistItems(plman.PlaylistCount - 1, 0, this.metadblist_selection, false);
				break;
			default:
				var insert_index = plman.PlaylistItemCount(ret - 2001);
				plman.InsertPlaylistItems((ret - 2001), insert_index, this.metadblist_selection, false);
			};
		};
		return true;
	};

	this.settings_context_menu = function (x, y) {
		var _menu = window.CreatePopupMenu();
		var _menu1 = window.CreatePopupMenu();
		var _menu2 = window.CreatePopupMenu();
		var _menu3 = window.CreatePopupMenu();
		var idx;

		_menu.AppendMenuItem((fb.IsPlaying ? MF_STRING : MF_GRAYED | MF_DISABLED), 900, "Show Now Playing");
		_menu.AppendMenuSeparator();
		_menu.AppendMenuItem(MF_STRING, 910, "Header Bar");
		_menu.CheckMenuItem(910, ppt.showHeaderBar);
		_menu.AppendMenuItem(MF_STRING, 912, "Double Track Line");
		_menu.CheckMenuItem(912, ppt.doubleRowText);

		_menu.AppendMenuSeparator();
		_menu1.AppendMenuItem((!ppt.doubleRowText ? (!ppt.showgroupheaders ? MF_GRAYED | MF_DISABLED : MF_STRING) : MF_GRAYED | MF_DISABLED), 111, "Artist");
		_menu1.CheckMenuItem(111, ppt.showArtistAlways);
		//_menu1.AppendMenuItem(MF_STRING, 112, "Mood");
		//_menu1.CheckMenuItem(112, ppt.showMood);
		_menu1.AppendMenuItem(MF_STRING, 113, "Rating");
		_menu1.CheckMenuItem(113, ppt.showRating);
		_menu1.AppendTo(_menu, MF_STRING, "Extra Track Infos");

		_menu2.AppendMenuItem(MF_STRING, 200, "Enable");
		_menu2.CheckMenuItem(200, ppt.showwallpaper);
		_menu2.AppendMenuItem(MF_STRING, 220, "Blur");
		_menu2.CheckMenuItem(220, ppt.wallpaperblurred);
		_menu2.AppendMenuSeparator();
		_menu2.AppendMenuItem(MF_STRING, 210, "Playing Album Cover");
		_menu2.AppendMenuItem(MF_STRING, 211, "Default");
		_menu2.CheckMenuRadioItem(210, 211, ppt.wallpapermode + 210);

		_menu2.AppendTo(_menu, MF_STRING, "Background Wallpaper");

		_menu3.AppendMenuItem((!ppt.autocollapse ? MF_STRING : MF_GRAYED | MF_DISABLED), 300, "Enable");
		_menu3.CheckMenuItem(300, ppt.showgroupheaders);
		_menu3.AppendMenuItem((ppt.showgroupheaders ? MF_STRING : MF_GRAYED | MF_DISABLED), 310, "Autocollapse");
		_menu3.CheckMenuItem(310, ppt.autocollapse);
		_menu3.AppendMenuSeparator();
		_menu3.AppendMenuItem((ppt.showgroupheaders && !ppt.autocollapse ? MF_STRING : MF_GRAYED | MF_DISABLED), 320, "Collapse All");
		_menu3.AppendMenuItem((ppt.showgroupheaders && !ppt.autocollapse ? MF_STRING : MF_GRAYED | MF_DISABLED), 330, "Expand All");

		_menu3.AppendTo(_menu, MF_STRING, "Group Headers");

		_menu.AppendMenuSeparator();
		_menu.AppendMenuItem(MF_STRING, 991, "Panel Properties");
		_menu.AppendMenuItem(MF_STRING, 992, "Configure...");

		idx = _menu.TrackPopupMenu(x, y);

		switch (true) {
		case (idx == 111):
			ppt.showArtistAlways = !ppt.showArtistAlways;
			window.SetProperty("_DISPLAY: Show Artist in Track Row", ppt.showArtistAlways);
			get_metrics();
			brw.repaint();
			break;
		case (idx == 112):
			ppt.showMood = !ppt.showMood;
			window.SetProperty("_DISPLAY: Show Mood in Track Row", ppt.showMood);
			get_metrics();
			brw.repaint();
			break;
		case (idx == 113):
			ppt.showRating = !ppt.showRating;
			window.SetProperty("_DISPLAY: Show Rating in Track Row", ppt.showRating);
			get_metrics();
			brw.repaint();
			break;
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
		case (idx == 300):
			ppt.showgroupheaders = !ppt.showgroupheaders;
			window.SetProperty("_DISPLAY: Show Group Headers", ppt.showgroupheaders);
			if (!ppt.showgroupheaders)
				brw.collapseAll(false);
			get_metrics();
			brw.repaint();
			break;
		case (idx == 310):
			ppt.autocollapse = !ppt.autocollapse;
			window.SetProperty("_PROPERTY: Autocollapse groups", ppt.autocollapse);
			brw.populate(false);
			brw.showFocusedItem();
			break;
		case (idx == 320):
			brw.collapseAll(true);
			brw.showFocusedItem();
			break;
		case (idx == 330):
			brw.collapseAll(false);
			brw.showFocusedItem();
			break;
		case (idx == 900):
			brw.showNowPlaying();
			break;
		case (idx == 910):
			ppt.showHeaderBar = !ppt.showHeaderBar;
			window.SetProperty("_DISPLAY: Show Top Bar", ppt.showHeaderBar);
			get_metrics();
			brw.repaint();
			break;
		case (idx == 912):
			ppt.doubleRowText = !ppt.doubleRowText;
			window.SetProperty("_PROPERTY: Double Row Text Info", ppt.doubleRowText);
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
		if (this.list.count > 1000) {
			albumartist = ppt.tf_albumartist.EvalWithMetadb(this.list[Math.floor(this.list.Count / 2)]);
			chr = albumartist.substring(0, 1);
			if (first_chr.charCodeAt(first_chr) > chr.charCodeAt(chr)) {
				gstart = Math.floor(this.list.Count / 2);
			} else {
				gstart = 0;
			};
		} else {
			gstart = 0;
		};

		if (!ppt.showgroupheaders) {

			// 1st search on "album artist" TAG
			var format_str = "";
			for (var i = gstart; i < this.list.Count; i++) {
				albumartist = ppt.tf_albumartist.EvalWithMetadb(this.list[i]);
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
					albumartist = ppt.tf_albumartist.EvalWithMetadb(this.list[i]);
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
				for (var i = 0; i < this.list.Count; i++) {
					artist = ppt.tf_artist.EvalWithMetadb(this.list[i]);
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
			for (var i = gstart; i < this.list.Count; i++) {
				groupkey = ppt.tf_groupkey.EvalWithMetadb(this.list[i]);
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
					groupkey = ppt.tf_groupkey.EvalWithMetadb(this.list[i]);
					format_str = groupkey.substring(0, len).toUpperCase();
					if (format_str == cList.search_string) {
						pid = i;
						break;
					};
				};
			};

		};

		if (pid >= 0) { // found
			g_focus_id = pid;
			plman.ClearPlaylistSelection(g_active_playlist);
			plman.SetPlaylistSelectionSingle(g_active_playlist, g_focus_id, true);
			plman.SetPlaylistFocusItem(g_active_playlist, g_focus_id);
			this.showFocusedItem();
		} else { // not found on "album artist" TAG, new search on "artist" TAG
			cList.inc_search_noresult = true;
			brw.repaint();
		};

		cList.clear_incsearch_timer && window.ClearTimeout(cList.clear_incsearch_timer);
		cList.clear_incsearch_timer = window.SetTimeout(function () {
				// reset incremental search string after 1 seconds without any key pressed
				cList.search_string = "";
				cList.inc_search_noresult = false;
				brw.repaint();
				window.ClearInterval(cList.clear_incsearch_timer);
				cList.clear_incsearch_timer = false;
			}, 1000);
	};
};

/*
===================================================================================================
Main
===================================================================================================
 */
var g_seconds = 0;
var g_time_remaining = null;
var g_radio_title = "loading live tag ...";
var g_radio_artist = "";

var list_img = [];
var g_valid_tid = 0;

var cover_path = new RegExp("(artwork)|(cover)|(scan)|(image)");
var cover_img = cover.masks.split(";");
var stub_image, cell_null;

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
var g_dragndrop_x = -1;
var g_dragndrop_y = -1;
var g_dragndrop_bottom = false;
var g_dragndrop_timer = false;
var g_dragndrop_trackId = -1;
var g_dragndrop_targetPlaylistId = -1;

//
var ww = 0, wh = 0;
var g_metadb = null;
var g_selHolder = fb.AcquireUiSelectionHolder();
g_selHolder.SetPlaylistSelectionTracking();
var foo_playcount = utils.CheckComponent("foo_playcount", true);

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
var g_avoid_on_playlist_switch = false;
var g_avoid_on_item_focus_change = false;
var g_avoid_on_playlist_items_added = false;
var g_avoid_on_playlist_items_removed = false;
var g_avoid_on_playlist_items_removed_callbacks_on_sendItemToPlaylist = false;
var g_avoid_on_playlist_items_reordered = false;
// mouse actions
var g_lbtn_click = false;
//
var g_total_duration_text = "";
var g_first_populate_done = false;
var g_first_populate_launched = false;
//
var scroll_ = 0, scroll = 0, scroll_prev = 0;
var g_start_ = 0, g_end_ = 0;
var g_wallpaperImg = null;

var g_rating_updated = false;
var g_rating_rowId = -1;

function on_init() {
	plman.SetActivePlaylistContext();
	window.DlgCode = DLGC_WANTALLKEYS;

	get_font();
	get_colors();
	get_metrics();

	g_active_playlist = plman.ActivePlaylist;
	g_focus_id = getFocusId(g_active_playlist);

	brw = new oBrowser("brw");
	pman = new oPlaylistManager("pman");

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

	if (pman.offset > 0) {
		pman.draw(gr);
	};

	if (ppt.showHeaderBar) {
		// inputBox
		if (ppt.showFilterBox && g_filterbox) {
			if (g_filterbox.inputbox.visible) {
				g_filterbox.draw(gr, 5, 2);
			};
		};
	};
};

function on_mouse_lbtn_down(x, y) {
	g_lbtn_click = true;

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

	if (pman.state == 1) {
		pman.on_mouse("up", x, y);
	} else {
		brw.on_mouse("up", x, y);
	};

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

	g_lbtn_click = false;
};

function on_mouse_lbtn_dblclk(x, y, mask) {
	if (y >= brw.y) {
		brw.on_mouse("dblclk", x, y);
	} else if (x > brw.x && x < brw.x + brw.w) {
		brw.showNowPlaying();
	} else {
		brw.on_mouse("dblclk", x, y);
	};
};

function on_mouse_rbtn_up(x, y) {
	// inputBox
	if (ppt.showHeaderBar && ppt.showFilterBox && g_filterbox.inputbox.visible) {
		g_filterbox.on_mouse("rbtn_up", x, y);
	};

	if (pman.state == 1) {
		pman.on_mouse("right", x, y);
	};

	brw.on_mouse("right", x, y);
	return true;
};

function on_mouse_move(x, y) {

	if (m_x == x && m_y == y)
		return;

	// inputBox
	if (ppt.showHeaderBar && ppt.showFilterBox && g_filterbox.inputbox.visible) {
		g_filterbox.on_mouse("move", x, y);
	};

	if (pman.state == 1) {
		pman.on_mouse("move", x, y);
	} else {
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
	};

	m_x = x;
	m_y = y;
};

function on_mouse_wheel(step) {

	if (cTouch.timer) {
		window.ClearInterval(cTouch.timer);
		cTouch.timer = false;
	};

	if (utils.IsKeyPressed(VK_SHIFT)) { // zoom cover size only
		var zoomStep = 1;
		var previous = ppt.groupHeaderRowsNumber;
		if (!timers.mouseWheel) {
			if (step > 0) {
				ppt.groupHeaderRowsNumber += zoomStep;
				if (ppt.groupHeaderRowsNumber > 5)
					ppt.groupHeaderRowsNumber = 5;
			} else {
				ppt.groupHeaderRowsNumber -= zoomStep;
				if (ppt.groupHeaderRowsNumber < 2)
					ppt.groupHeaderRowsNumber = 2;
			};
			if (previous != ppt.groupHeaderRowsNumber) {
				timers.mouseWheel = window.SetTimeout(function () {
						window.SetProperty("_PROPERTY: Number of Rows for Group Header", ppt.groupHeaderRowsNumber);
						get_font();
						get_metrics();
						get_images();

						// refresh covers
						g_image_cache = new image_cache;
						var total = brw.groups.length;
						for (var i = 0; i < total; i++) {
							brw.groups[i].tid = -1;
							brw.groups[i].load_requested = 0;
							brw.groups[i].save_requested = false;
							brw.groups[i].cover_img = null;
							brw.groups[i].cover_type = null;
						};

						brw.repaint();
						timers.mouseWheel && window.ClearTimeout(timers.mouseWheel);
						timers.mouseWheel = false;
					}, 100);
			};
		};
	} else if (utils.IsKeyPressed(VK_CONTROL)) {
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

						// refresh covers
						g_image_cache = new image_cache;
						var total = brw.groups.length;
						for (var i = 0; i < total; i++) {
							brw.groups[i].tid = -1;
							brw.groups[i].load_requested = 0;
							brw.groups[i].save_requested = false;
							brw.groups[i].cover_img = null;
							brw.groups[i].cover_type = null;
						};

						brw.repaint();
						timers.mouseWheel && window.ClearTimeout(timers.mouseWheel);
						timers.mouseWheel = false;
					}, 100);
			};
		};
	} else {
		if (pman.state == 1) {
			if (pman.scr_w > 0)
				pman.on_mouse("wheel", m_x, m_y, step);
		} else {
			var rowStep = ppt.rowScrollStep;
			scroll -= step * ppt.rowHeight * rowStep;
			scroll = check_scroll(scroll);
			brw.on_mouse("wheel", m_x, m_y, step);
		};
	};

};

function on_mouse_leave() {
	// inputBox
	if (ppt.showHeaderBar && ppt.showFilterBox && g_filterbox.inputbox.visible) {
		g_filterbox.on_mouse("leave", 0, 0);
	};
	brw.on_mouse("leave", 0, 0);

	if (pman.state == 1) {
		pman.on_mouse("leave", 0, 0);
	};
};

//=================================================// Metrics & Fonts & Colors & Images
function get_metrics() {

	cPlaylistManager.topbarHeight = Math.floor(cPlaylistManager.default_topbarHeight * g_zoom_percent / 100);
	cPlaylistManager.botbarHeight = Math.floor(cPlaylistManager.default_botbarHeight * g_zoom_percent / 100);
	cPlaylistManager.rowHeight = Math.floor(cPlaylistManager.default_rowHeight * g_zoom_percent / 100);
	cPlaylistManager.scrollbarWidth = Math.floor(cPlaylistManager.default_scrollbarWidth * g_zoom_percent / 100);

	if (ppt.showHeaderBar) {
		ppt.headerBarHeight = Math.round(ppt.defaultHeaderBarHeight * g_zoom_percent / 100);
		ppt.headerBarHeight = Math.floor(ppt.headerBarHeight / 2) != ppt.headerBarHeight / 2 ? ppt.headerBarHeight : ppt.headerBarHeight - 1;
	} else {
		ppt.headerBarHeight = 0;
	};
	if (ppt.doubleRowText) {
		var _defaultRowHeight = ppt.defaultRowHeight + ppt.doubleRowPixelAdds;
	} else {
		var _defaultRowHeight = ppt.defaultRowHeight;
	};
	ppt.rowHeight = Math.round(_defaultRowHeight * g_zoom_percent / 100);
	cScrollBar.width = Math.floor(cScrollBar.defaultWidth * g_zoom_percent / 100);
	cScrollBar.minCursorHeight = Math.round(cScrollBar.defaultMinCursorHeight * g_zoom_percent / 100);
	//
	cover.margin = Math.floor(cover.default_margin * g_zoom_percent / 100);
	cover.w = ppt.groupHeaderRowsNumber * ppt.rowHeight;
	cover.max_w = ppt.groupHeaderRowsNumber * ppt.rowHeight;
	cover.h = ppt.groupHeaderRowsNumber * ppt.rowHeight;
	cover.max_h = ppt.groupHeaderRowsNumber * ppt.rowHeight;
	//
	g_image_cache = new image_cache;

	cFilterBox.w = Math.floor(cFilterBox.default_w * g_zoom_percent / 100);
	cFilterBox.h = Math.round(cFilterBox.default_h * g_zoom_percent / 100);

	if (brw) {
		if (cScrollBar.enabled) {
			brw.setSize(0, (ppt.showHeaderBar ? ppt.headerBarHeight : 0), ww - cScrollBar.width, wh - (ppt.showHeaderBar ? ppt.headerBarHeight : 0));
		} else {
			brw.setSize(0, (ppt.showHeaderBar ? ppt.headerBarHeight : 0), ww, wh - (ppt.showHeaderBar ? ppt.headerBarHeight : 0));
		};
		brw.setList();
		//
		g_focus_row = brw.getOffsetFocusItem(g_focus_id);
		// if focused track not totally visible, we scroll to show it centered in the panel
		if (g_focus_row < scroll / ppt.rowHeight || g_focus_row > scroll / ppt.rowHeight + brw.totalRowsVis - 1) {
			scroll = (g_focus_row - Math.floor(brw.totalRowsVis / 2)) * ppt.rowHeight;
			scroll = check_scroll(scroll);
			scroll_ = scroll;
		};
		if (brw.rowsCount > 0)
			brw.gettags(true);
	};
};

function get_images() {
	var gb;
	var txt = "";

	cover.glass_reflect = draw_glass_reflect(200, 200);

	// PLAY icon
	images.play_on = gdi.CreateImage(70, 70);
	gb = images.play_on.GetGraphics();
	DrawPolyStar(gb, 12 - 2, 12, 46, 1, 3, 2, g_color_normal_bg, g_color_normal_txt, 90, 255);
	images.play_on.ReleaseGraphics(gb);

	images.play_off = gdi.CreateImage(70, 70);
	gb = images.play_off.GetGraphics();
	DrawPolyStar(gb, 16 - 2, 16, 38, 1, 3, 2, g_color_normal_bg, g_color_normal_txt, 90, 255);
	images.play_off.ReleaseGraphics(gb);

	var img_loading = gdi.Image(images.path + "load.png");
	var iw = ppt.groupHeaderRowsNumber * ppt.rowHeight;
	images.loading_draw = img_loading.Resize(iw, iw, 7);

	var nw = 250,
	nh = 250;
	txt = "NO\nCOVER";
	images.noart = gdi.CreateImage(nw, nh);
	gb = images.noart.GetGraphics();
	// draw no cover art image
	gb.FillSolidRect(0, 0, nw, nh, g_color_normal_txt & 0x10ffffff);
	gb.SetTextRenderingHint(4);
	gb.DrawString(txt, gdi.Font(g_fname, Math.round(nh / 12 * 2), 1), blendColors(g_color_normal_txt, g_color_normal_bg, 0.30), 1, 1, nw, nh, cc_stringformat);
	images.noart.ReleaseGraphics(gb);

	var sw = 250,
	sh = 250;
	txt = "STREAM";
	images.stream = gdi.CreateImage(sw, sh);
	gb = images.stream.GetGraphics();
	// draw stream art image
	gb.FillSolidRect(0, 0, sw, sh, g_color_normal_txt & 0x10ffffff);
	gb.SetTextRenderingHint(4);
	gb.DrawString(txt, gdi.Font(g_fname, Math.round(sh / 12 * 2), 1), blendColors(g_color_normal_txt, g_color_normal_bg, 0.30), 1, 1, sw, sh, cc_stringformat);
	images.stream.ReleaseGraphics(gb);
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

	//g_font_guifx_found = false;
	//g_font_wingdings2_found = false;

	if (g_font_guifx_found) {
		g_font_rating = gdi.Font("guifx v2 transports", Math.round(g_fsize * 130 / 100), 0);
		g_font_mood = gdi.Font("guifx v2 transports", Math.round(g_fsize * 130 / 100), 0);
	} else if (g_font_wingdings2_found) {
		g_font_rating = gdi.Font("wingdings 2", Math.round(g_fsize * 130 / 100), 0);
		g_font_mood = gdi.Font("wingdings 2", Math.round(g_fsize * 200 / 100), 0);
	} else {
		g_font_rating = gdi.Font("arial", Math.round(g_fsize * 170 / 100), 0);
		g_font_mood = gdi.Font("arial", Math.round(g_fsize * 120 / 100), 0);
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
		if (ppt.showHeaderBar && ppt.showFilterBox && g_filterbox.inputbox.visible) {
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

function vk_up() {
	var scrollstep = 1;
	var new_focus_id = 0,
	new_row = 0;

	new_row = g_focus_row - scrollstep;
	if (new_row < 0) {
		if (brw.groups[0].collapsed) {
			new_row = 0;
		} else {
			if (ppt.showgroupheaders) {
				new_row = 0 + ppt.groupHeaderRowsNumber;
			} else {
				new_row = 0;
			};
		};
		// kill timer
		cScrollBar.timerCounter = -1;
		cScrollBar.timerID && window.ClearTimeout(cScrollBar.timerID);
		cScrollBar.timerID = false;
	} else {
		switch (brw.rows[new_row].type) {
		case 0: // track row
			// RAS
			break;
		case 99: // blank line (extra line)
			while (brw.rows[new_row].type == 99) {
				if (new_row > 0)
					new_row -= 1;
			};
			break;
		default: // group row
			if (brw.groups[brw.rows[new_row].albumId].collapsed) {
				new_row -= (ppt.groupHeaderRowsNumber - 1);
			} else {
				new_row -= ppt.groupHeaderRowsNumber;
			};
		};
	};
	if (new_row >= 0) {
		while (brw.rows[new_row].type == 99) {
			if (new_row > 0)
				new_row -= 1;
		};
		new_focus_id = brw.rows[new_row].playlistTrackId;
		plman.ClearPlaylistSelection(g_active_playlist);
		plman.SetPlaylistSelectionSingle(g_active_playlist, new_focus_id, true);
		plman.SetPlaylistFocusItem(g_active_playlist, new_focus_id);
	} else {
		// kill timer
		cScrollBar.timerCounter = -1;
		cScrollBar.timerID && window.ClearTimeout(cScrollBar.timerID);
		cScrollBar.timerID = false;
	};
};

function vk_down() {
	var scrollstep = 1;
	var new_focus_id = 0,
	new_row = 0;

	new_row = g_focus_row + scrollstep;
	if (new_row > brw.rowsCount - 1) {
		new_row = brw.rowsCount - 1;
		if (brw.groups[brw.rows[new_row].albumId].collapsed) {
			new_row -= (ppt.groupHeaderRowsNumber - 1);
		};
		// kill timer
		cScrollBar.timerCounter = -1;
		cScrollBar.timerID && window.ClearTimeout(cScrollBar.timerID);
		cScrollBar.timerID = false;
	} else {
		switch (brw.rows[new_row].type) {
		case 0: // track row
			// RAS
			break;
		case 99: // blank line (extra line)
			while (brw.rows[new_row].type == 99) {
				if (new_row < brw.rowsCount - 1)
					new_row += 1;
			};
			break;
		default: // group row
			if (brw.groups[brw.rows[new_row].albumId].collapsed) {
				if (brw.rows[new_row].type > 1) { // if not 1st row of the group header
					new_row += (ppt.groupHeaderRowsNumber - brw.rows[new_row].type + 1);
					if (new_row > brw.rowsCount - 1) {
						new_row = brw.rowsCount - 1;
						if (brw.groups[brw.rows[new_row].albumId].collapsed) {
							new_row -= (ppt.groupHeaderRowsNumber - 1);
						};
					} else {
						if (!brw.groups[brw.rows[new_row].albumId].collapsed) {
							new_row += ppt.groupHeaderRowsNumber;
						};
					};
				} else {
					// RAS
				};
			} else {
				if (brw.rows[new_row].type > 1) { // if not 1st row of the group header
					// RAS, can't happend
				} else {
					new_row += ppt.groupHeaderRowsNumber;
				};
			};
		};
	};
	if (new_row < brw.rowsCount) {
		while (brw.rows[new_row].type == 99) {
			if (new_row < brw.rowsCount - 1)
				new_row += 1;
		};
		new_focus_id = brw.rows[new_row].playlistTrackId;
		plman.ClearPlaylistSelection(g_active_playlist);
		plman.SetPlaylistSelectionSingle(g_active_playlist, new_focus_id, true);
		plman.SetPlaylistFocusItem(g_active_playlist, new_focus_id);
	} else {
		// kill timer
		cScrollBar.timerCounter = -1;
		cScrollBar.timerID && window.ClearTimeout(cScrollBar.timerID);
		cScrollBar.timerID = false;
	};
};

function vk_pgup() {
	var scrollstep = brw.totalRowsVis;
	var new_focus_id = 0,
	new_row = 0;

	new_row = g_focus_row - scrollstep;
	if (new_row < 0) {
		if (brw.groups[0].collapsed) {
			new_row = 0;
		} else {
			new_row = 0 + ppt.groupHeaderRowsNumber;
		};
		// kill timer
		cScrollBar.timerCounter = -1;
		cScrollBar.timerID && window.ClearTimeout(cScrollBar.timerID);
		cScrollBar.timerID = false;
	} else {
		switch (brw.rows[new_row].type) {
		case 0: // track row
			// RAS
			break;
		case 99: // blank line (extra line)
			while (brw.rows[new_row].type == 99) {
				if (new_row > 0)
					new_row -= 1;
			};
			break;
		default: // group row
			if (brw.groups[brw.rows[new_row].albumId].collapsed) {
				if (brw.rows[new_row].type > 1) { // if not 1st row of the group header
					new_row -= (brw.rows[new_row].type - 1);
				} else {
					// RAS
				};
			} else {
				new_row += (ppt.groupHeaderRowsNumber - brw.rows[new_row].type + 1);
			};
		};
	};
	if (new_row >= 0) {
		while (brw.rows[new_row].type == 99) {
			if (new_row > 0)
				new_row -= 1;
		};
		new_focus_id = brw.rows[new_row].playlistTrackId;
		plman.ClearPlaylistSelection(g_active_playlist);
		plman.SetPlaylistSelectionSingle(g_active_playlist, new_focus_id, true);
		plman.SetPlaylistFocusItem(g_active_playlist, new_focus_id);
	} else {
		// kill timer
		cScrollBar.timerCounter = -1;
		cScrollBar.timerID && window.ClearTimeout(cScrollBar.timerID);
		cScrollBar.timerID = false;
	};
};

function vk_pgdn() {
	var scrollstep = brw.totalRowsVis;
	var new_focus_id = 0,
	new_row = 0;

	new_row = g_focus_row + scrollstep;
	if (new_row > brw.rowsCount - 1) {
		new_row = brw.rowsCount - 1;
		if (brw.groups[brw.rows[new_row].albumId].collapsed) {
			new_row -= (ppt.groupHeaderRowsNumber - 1);
		};
	} else {
		switch (brw.rows[new_row].type) {
		case 0: // track row
			// RAS
			break;
		case 99: // blank line (extra line)
			while (brw.rows[new_row].type == 99) {
				if (new_row < brw.rowsCount - 1)
					new_row += 1;
			};
			break;
		default: // group row
			if (brw.groups[brw.rows[new_row].albumId].collapsed) {
				if (brw.rows[new_row].type > 1) { // if not 1st row of the group header
					new_row -= (brw.rows[new_row].type - 1);
				} else {
					// RAS
				};
			} else {
				new_row += (ppt.groupHeaderRowsNumber - brw.rows[new_row].type + 1);
			};
		};
	};
	if (new_row < brw.rowsCount) {
		while (brw.rows[new_row].type == 99) {
			if (new_row < brw.rowsCount - 1)
				new_row += 1;
		};
		new_focus_id = brw.rows[new_row].playlistTrackId;
		plman.ClearPlaylistSelection(g_active_playlist);
		plman.SetPlaylistSelectionSingle(g_active_playlist, new_focus_id, true);
		plman.SetPlaylistFocusItem(g_active_playlist, new_focus_id);
	} else {
		// kill timer
		cScrollBar.timerCounter = -1;
		cScrollBar.timerID && window.ClearTimeout(cScrollBar.timerID);
		cScrollBar.timerID = false;
	};
};

function on_key_down(vkey) {
	var mask = GetKeyboardMask();

	if (cSettings.visible) {} else {
		//if(dragndrop.drag_in) return true;

		// inputBox
		if (ppt.showHeaderBar && ppt.showFilterBox && g_filterbox.inputbox.visible) {
			g_filterbox.on_key("down", vkey);
		};

		if (mask == KMask.none) {
			switch (vkey) {
			case VK_F2:

				break;
			case VK_F3:
				brw.showNowPlaying();
				break;
			case VK_F5:
				// refresh covers
				g_image_cache = new image_cache;
				var total = brw.groups.length;
				for (var i = 0; i < total; i++) {
					brw.groups[i].tid = -1;
					brw.groups[i].load_requested = 0;
					brw.groups[i].save_requested = false;
					brw.groups[i].cover_img = null;
					brw.groups[i].cover_type = null;
				};
				brw.repaint();
				break;
			case VK_F6:

				break;
			case VK_TAB:
				break;
			case VK_BACK:
				if (cList.search_string.length > 0) {
					cList.inc_search_noresult = false;
					brw.tt_x = ((brw.w) / 2) - (((cList.search_string.length * 13) + (10 * 2)) / 2);
					brw.tt_y = brw.y + Math.floor((brw.h / 2) - 30);
					brw.tt_w = ((cList.search_string.length * 13) + (10 * 2));
					brw.tt_h = 60;
					cList.search_string = cList.search_string.substring(0, cList.search_string.length - 1);
					brw.repaint();
					cList.clear_incsearch_timer && window.ClearTimeout(cList.clear_incsearch_timer);
					cList.clear_incsearch_timer = false;
					cList.incsearch_timer && window.ClearTimeout(cList.incsearch_timer);
					cList.incsearch_timer = window.SetTimeout(function () {
							brw.incrementalSearch();
							window.ClearTimeout(cList.incsearch_timer);
							cList.incsearch_timer = false;
							cList.inc_search_noresult = false;
						}, 400);
				};
				break;
			case VK_ESCAPE:
			case 222:
				brw.tt_x = ((brw.w) / 2) - (((cList.search_string.length * 13) + (10 * 2)) / 2);
				brw.tt_y = brw.y + Math.floor((brw.h / 2) - 30);
				brw.tt_w = ((cList.search_string.length * 13) + (10 * 2));
				brw.tt_h = 60;
				cList.search_string = "";
				window.RepaintRect(0, brw.tt_y - 2, brw.w, brw.tt_h + 4);
				break;
			case VK_UP:
				if (brw.rowsCount > 0 && !brw.keypressed && !cScrollBar.timerID) {
					brw.keypressed = true;
					reset_cover_timers();

					vk_up();
					if (!cScrollBar.timerID) {
						cScrollBar.timerID = window.SetTimeout(function () {
								window.ClearTimeout(cScrollBar.timerID);
								cScrollBar.timerID = window.SetInterval(vk_up, 100);
							}, 400);
					};
				};
				break;
			case VK_DOWN:
				if (brw.rowsCount > 0 && !brw.keypressed && !cScrollBar.timerID) {
					brw.keypressed = true;
					reset_cover_timers();

					vk_down();
					if (!cScrollBar.timerID) {
						cScrollBar.timerID = window.SetTimeout(function () {
								window.ClearTimeout(cScrollBar.timerID);
								cScrollBar.timerID = window.SetInterval(vk_down, 100);
							}, 400);
					};
				};
				break;
			case VK_PGUP:
				if (brw.rowsCount > 0 && !brw.keypressed && !cScrollBar.timerID) {
					brw.keypressed = true;
					reset_cover_timers();

					vk_pgup();
					if (!cScrollBar.timerID) {
						cScrollBar.timerID = window.SetTimeout(function () {
								window.ClearTimeout(cScrollBar.timerID);
								cScrollBar.timerID = window.SetInterval(vk_pgup, 100);
							}, 400);
					};
				};
				break;
			case VK_PGDN:
				if (brw.rowsCount > 0 && !brw.keypressed && !cScrollBar.timerID) {
					brw.keypressed = true;
					reset_cover_timers();

					vk_pgdn();
					if (!cScrollBar.timerID) {
						cScrollBar.timerID = window.SetTimeout(function () {
								window.ClearTimeout(cScrollBar.timerID);
								cScrollBar.timerID = window.SetInterval(vk_pgdn, 100);
							}, 400);
					};
				};
				break;
			case VK_RETURN:
				plman.ExecutePlaylistDefaultAction(g_active_playlist, g_focus_id);
				break;
			case VK_END:
				if (brw.rowsCount > 0) {
					//var last_1st_group_row = brw.rowsCount - ppt.groupHeaderRowsNumber;
					//var new_focus_id = brw.rows[last_1st_group_row].playlistTrackId;

					var new_focus_id = brw.rows[brw.rows.length - 1].playlistTrackId;
					plman.SetPlaylistFocusItem(g_active_playlist, new_focus_id);
					plman.ClearPlaylistSelection(g_active_playlist);
					plman.SetPlaylistSelectionSingle(g_active_playlist, new_focus_id, true);
				};
				break;
			case VK_HOME:
				if (brw.rowsCount > 0) {
					var new_focus_id = brw.rows[0].playlistTrackId;
					plman.ClearPlaylistSelection(g_active_playlist);
					plman.SetPlaylistSelectionSingle(g_active_playlist, new_focus_id, true);
					plman.SetPlaylistFocusItem(g_active_playlist, new_focus_id);
				};
				break;
			case VK_DELETE:
				if (!plman.IsAutoPlaylist(g_active_playlist)) {
					plman.RemovePlaylistSelection(g_active_playlist, false);
					plman.RemovePlaylistSelection(g_active_playlist, false);
					plman.SetPlaylistSelectionSingle(g_active_playlist, plman.GetPlaylistFocusItemIndex(g_active_playlist), true);
				};
				break;
			};
		} else {
			switch (mask) {
			case KMask.shift:
				switch (vkey) {
				case VK_SHIFT: // SHIFT key alone
					brw.SHIFT_count = 0;
					break;
				case VK_UP: // SHIFT + KEY UP
					if (brw.SHIFT_count == 0) {
						if (brw.SHIFT_start_id == null) {
							brw.SHIFT_start_id = g_focus_id;
						};
						plman.ClearPlaylistSelection(g_active_playlist);
						plman.SetPlaylistSelectionSingle(g_active_playlist, g_focus_id, true);
						if (g_focus_id > 0) {
							brw.SHIFT_count--;
							g_focus_id--;
							plman.SetPlaylistSelectionSingle(g_active_playlist, g_focus_id, true);
							plman.SetPlaylistFocusItem(g_active_playlist, g_focus_id);
						};
					} else if (brw.SHIFT_count < 0) {
						if (g_focus_id > 0) {
							brw.SHIFT_count--;
							g_focus_id--;
							plman.SetPlaylistSelectionSingle(g_active_playlist, g_focus_id, true);
							plman.SetPlaylistFocusItem(g_active_playlist, g_focus_id);
						};
					} else {
						plman.SetPlaylistSelectionSingle(g_active_playlist, g_focus_id, false);
						brw.SHIFT_count--;
						g_focus_id--;
						plman.SetPlaylistFocusItem(g_active_playlist, g_focus_id);
					};
					break;
				case VK_DOWN: // SHIFT + KEY DOWN
					if (brw.SHIFT_count == 0) {
						if (brw.SHIFT_start_id == null) {
							brw.SHIFT_start_id = g_focus_id;
						};
						plman.ClearPlaylistSelection(g_active_playlist);
						plman.SetPlaylistSelectionSingle(g_active_playlist, g_focus_id, true);
						if (g_focus_id < brw.list.Count - 1) {
							brw.SHIFT_count++;
							g_focus_id++;
							plman.SetPlaylistSelectionSingle(g_active_playlist, g_focus_id, true);
							plman.SetPlaylistFocusItem(g_active_playlist, g_focus_id);
						};
					} else if (brw.SHIFT_count > 0) {
						if (g_focus_id < brw.list.Count - 1) {
							brw.SHIFT_count++;
							g_focus_id++;
							plman.SetPlaylistSelectionSingle(g_active_playlist, g_focus_id, true);
							plman.SetPlaylistFocusItem(g_active_playlist, g_focus_id);
						};
					} else {
						plman.SetPlaylistSelectionSingle(g_active_playlist, g_focus_id, false);
						brw.SHIFT_count++;
						g_focus_id++;
						plman.SetPlaylistFocusItem(g_active_playlist, g_focus_id);
					};
					break;
				};
				break;
			case KMask.ctrl:
				if (vkey == 65) { // CTRL+A
					fb.RunMainMenuCommand("Edit/Select all");
					brw.metadblist_selection = plman.GetPlaylistSelectedItems(g_active_playlist);
					brw.repaint();
				};
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
					brw.scrollbar.updateScrollbar();
					brw.repaint();
				};
				if (vkey == 48 || vkey == 96) { // CTRL+0
					var previous = ppt.extra_font_size;
					if (!timers.mouseWheel) {
						ppt.extra_font_size = 0;
						if (previous != ppt.extra_font_size) {
							timers.mouseWheel = window.SetTimeout(function () {
									window.SetProperty("_SYSTEM: Extra font size value", ppt.extra_font_size);
									get_font();
									get_metrics();
									get_images();

									// refresh covers
									g_image_cache = new image_cache;
									var total = brw.groups.length;
									for (var i = 0; i < total; i++) {
										brw.groups[i].tid = -1;
										brw.groups[i].load_requested = 0;
										brw.groups[i].save_requested = false;
										brw.groups[i].cover_img = null;
										brw.groups[i].cover_type = null;
									};

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

function on_char(code) {
	// inputBox
	if (ppt.showHeaderBar && ppt.showFilterBox && g_filterbox.inputbox.visible) {
		g_filterbox.on_char(code);
	};

	if (cSettings.visible) {} else {
		if (g_filterbox.inputbox.edit) {
			//g_filterbox.on_char(code);
		} else {
			if (brw.list.Count > 0) {
				brw.tt_x = ((brw.w) / 2) - (((cList.search_string.length * 13) + (10 * 2)) / 2);
				brw.tt_y = brw.y + Math.floor((brw.h / 2) - 30);
				brw.tt_w = ((cList.search_string.length * 13) + (10 * 2));
				brw.tt_h = 60;
				if (code == 32 && cList.search_string.length == 0)
					return true; // SPACE Char not allowed on 1st char
				if (cList.search_string.length <= 20 && brw.tt_w <= brw.w - 20) {
					if (code > 31) {
						cList.search_string = cList.search_string + String.fromCharCode(code).toUpperCase();
						brw.repaint();
						cList.clear_incsearch_timer && window.ClearTimeout(cList.clear_incsearch_timer);
						cList.clear_incsearch_timer = false;
						cList.incsearch_timer && window.ClearTimeout(cList.incsearch_timer);
						cList.incsearch_timer = window.SetTimeout(function () {
								brw.incrementalSearch();
								window.ClearTimeout(cList.incsearch_timer);
								cList.incsearch_timer = false;
							}, 400);
					};
				};
			};
		};
	};
};

//=================================================// Playback Callbacks
function on_playback_stop(reason) {
	g_seconds = 0;
	g_time_remaining = null;
	g_metadb = null;

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

	g_radio_title = "loading live tag ...";
	g_radio_artist = "";
};

function on_playback_new_track(metadb) {
	g_metadb = metadb;
	g_radio_title = "loading live tag ...";
	g_radio_artist = "";

	g_wallpaperImg = setWallpaperImg();
	brw.repaint();
};

function on_playback_starting(cmd, is_paused) {};

function on_playback_time(time) {
	g_seconds = time;
	g_time_remaining = ppt.tf_time_remaining.Eval(true);

	// radio Tags (live)
	if (g_metadb && g_metadb.Length < 0) {
		g_radio_title = fb.TitleFormat("%title%").Eval(true);
		g_radio_artist = fb.TitleFormat("$if2(%artist%,%bitrate%'K')").Eval(true);
	} else if (!g_metadb)
		g_metadb = fb.GetNowPlaying();

	if (!cSettings.visible) {
		if (brw.nowplaying_y + ppt.rowHeight > brw.y && brw.nowplaying_y < brw.y + brw.h) {
			brw.repaint();
		};
	};
};

//=================================================// Playlist Callbacks
function on_playlists_changed() {

	if (g_avoid_on_playlists_changed)
		return;

	if (pman.drop_done) {
		plman.ActivePlaylist = g_active_playlist;
	} else {
		if (g_active_playlist != plman.ActivePlaylist) {
			g_active_playlist = plman.ActivePlaylist;
		};
	};

	// refresh playlists list
	pman.populate(false, false);
};

function on_playlist_switch() {

	if (pman.drop_done)
		return;

	g_active_playlist = plman.ActivePlaylist;
	g_focus_id = getFocusId(g_active_playlist);
	g_filterbox.clearInputbox();
	brw.populate(true);
	brw.metadblist_selection = plman.GetPlaylistSelectedItems(g_active_playlist);

	// refresh playlists list
	pman.populate(false, false);
};

function on_playlist_items_added(playlist_idx) {

	g_avoid_on_playlist_items_removed_callbacks_on_sendItemToPlaylist = false;

	if (playlist_idx == g_active_playlist && !pman.drop_done) {
		g_focus_id = getFocusId(g_active_playlist);
		brw.populate(false);
	};
};

function on_playlist_items_removed(playlist_idx, new_count) {

	if (playlist_idx == g_active_playlist && new_count == 0)
		scroll = scroll_ = 0;
	if (g_avoid_on_playlist_items_removed_callbacks_on_sendItemToPlaylist)
		return;

	if (playlist_idx == g_active_playlist) {
		g_focus_id = getFocusId(g_active_playlist);
		brw.populate(true);
	};
};

function on_playlist_items_reordered(playlist_idx) {
	if (playlist_idx == g_active_playlist) {
		g_focus_id = getFocusId(g_active_playlist);
		brw.populate(true);
	};
};

function on_item_focus_change(playlist, from, to) {
	if (!brw.list || !brw || !brw.list)
		return;

	var save_focus_id = g_focus_id;
	g_focus_id = to;

	if (!g_avoid_on_item_focus_change) {
		if (playlist == g_active_playlist) {
			// Autocollapse handle
			if (ppt.autocollapse) { // && !center_focus_item
				if (from > -1 && from < brw.list.Count) {
					var old_focused_group_id = brw.getAlbumIdfromTrackId(from);
				} else {
					var old_focused_group_id = -1;
				};
				if (to > -1 && to < brw.list.Count) {
					var new_focused_group_id = brw.getAlbumIdfromTrackId(to);
				} else {
					var old_focused_group_id = -1;
				};
				if (new_focused_group_id != old_focused_group_id) {
					if (old_focused_group_id > -1) {
						brw.groups[old_focused_group_id].collapsed = true;
					};
					if (new_focused_group_id > -1) {
						brw.groups[new_focused_group_id].collapsed = false;
					};
					brw.setList();
					brw.scrollbar.updateScrollbar();
					if (brw.rowsCount > 0)
						brw.gettags(true);
				};
			};

			// if new focused track not totally visible, we scroll to show it centered in the panel
			g_focus_row = brw.getOffsetFocusItem(g_focus_id);
			if (g_focus_row < scroll / ppt.rowHeight || g_focus_row > scroll / ppt.rowHeight + brw.totalRowsVis - 0.1) {
				var old = scroll;
				scroll = (g_focus_row - Math.floor(brw.totalRowsVis / 2)) * ppt.rowHeight;
				scroll = check_scroll(scroll);
				if (!ppt.enableFullScrollEffectOnFocusChange) {
					if (Math.abs(scroll - scroll_) > ppt.rowHeight * 5) {
						if (scroll_ > scroll) {
							scroll_ = scroll + ppt.rowHeight * 5;
						} else {
							scroll_ = scroll - ppt.rowHeight * 5;
						};
					};
				};
				/*
				if(!ppt.enableFullScrollEffectOnFocusChange && !ppt.autocollapse) {
				scroll_ = scroll + ppt.rowHeight * 5 * (from <= to ? -1 : 1);
				scroll_ = check_scroll(scroll_);
				};
				*/
				brw.scrollbar.updateScrollbar();
			};

			brw.metadblist_selection = plman.GetPlaylistSelectedItems(g_active_playlist);
			if (!isScrolling)
				brw.repaint();
		};
	};
};

function on_metadb_changed(handles) {
	if (!brw.list)
		return;

	// rebuild list
	if (g_rating_updated) { // no repopulate if tag update is from rating click action in playlist
		g_rating_updated = false;
		// update track tags info to avoid a full populate
		if (g_rating_rowId > -1) {
			brw.rows[g_rating_rowId].tracktags = ppt.tf_track.EvalWithMetadb(brw.rows[g_rating_rowId].metadb);
			g_rating_rowId = -1;
		};
		window.Repaint();
	} else {
		if (!(handles.Count == 1 && handles[0].Length < 0)) {
			if (filter_text.length > 0) {
				g_focus_id = 0;
				brw.populate(true);
				if (brw.rowsCount > 0) {
					var new_focus_id = brw.rows[0].playlistTrackId;
					plman.ClearPlaylistSelection(g_active_playlist);
					plman.SetPlaylistSelectionSingle(g_active_playlist, new_focus_id, true);
					plman.SetPlaylistFocusItem(g_active_playlist, new_focus_id);
				};
			} else {
				brw.populate(false);
			};
		};
	};
};

function on_item_selection_change() {
	brw.repaint();
};

function on_playlist_items_selection_change() {
	brw.repaint();
};

function on_focus(is_focused) {
	if (is_focused) {
		plman.SetActivePlaylistContext();
		g_selHolder.SetPlaylistSelectionTracking();
	} else {
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

function getFocusId(playlistIndex) {
	return plman.GetPlaylistFocusItemIndex(playlistIndex);
};

function g_sendResponse() {

	if (g_filterbox.inputbox.text.length == 0) {
		filter_text = "";
	} else {
		filter_text = g_filterbox.inputbox.text;
	};

	// filter in current panel
	g_focus_id = 0;
	brw.populate(true);
	if (brw.rowsCount > 0) {
		var new_focus_id = brw.rows[0].playlistTrackId;
		plman.ClearPlaylistSelection(g_active_playlist);
		plman.SetPlaylistSelectionSingle(g_active_playlist, new_focus_id, true);
		plman.SetPlaylistFocusItem(g_active_playlist, new_focus_id);
	};
};

function on_notify_data(name, info) {
	switch (name) {
	case "JSSmoothBrowser->JSSmoothPlaylist:avoid_on_playlist_items_removed_callbacks_on_sendItemToPlaylist":
		g_avoid_on_playlist_items_removed_callbacks_on_sendItemToPlaylist = true;
		break;
	};
};

function save_image_to_cache(metadb, albumIndex) {
	var crc = brw.groups[albumIndex].cachekey;
	if (fso.FileExists(CACHE_FOLDER + crc))
		return;
	
	var path = ppt.tf_path.EvalWithMetadb(metadb);
	var path_ = getpath_(path);
	if (path_) {
		resize(path_, crc);
	}
};

on_load();

//=================================================// Drag'n'Drop Callbacks
function on_drag_enter() {

}

function on_drag_leave() {

}

function on_drag_over(action, x, y, mask) {
	if (y < brw.y || (plman.ActivePlaylist > -1 && plman.IsPlaylistLocked(plman.Activeplaylist))) {
		action.Effect = 0;
	} else {
		action.Effect = 1;
	}
};

function on_drag_drop(action, x, y, mask) {
	if (y < brw.y || (plman.ActivePlaylist > -1 && plman.IsPlaylistLocked(plman.Activeplaylist))) {
		action.Effect = 0;
	} else {
		var count = plman.PlaylistCount;
		if (count == 0 || plman.ActivePlaylist == -1) {
			plman.CreatePlaylist(count, "Dropped Items");
			action.Playlist = count;
			action.Base = 0;
		} else {
			plman.ClearPlaylistSelection(plman.ActivePlaylist);
			action.Playlist = plman.ActivePlaylist;
			action.Base = plman.PlaylistItemCount(plman.ActivePlaylist);
		}
		action.ToSelect = true;
		action.Effect = 1;
	}
};
