var need_repaint = false;

images = {
	path: fb.ComponentPath + "samples\\js-smooth\\images\\",
	glass_reflect: null,
	loading_angle: 0,
	loading_draw: null,
	noart: null,
	stream: null
};

ppt = {
	autoFill : window.GetProperty("_DISPLAY: Auto-fill", true),
	followFocusChange: window.GetProperty("_PROPERTY: Follow focus change", true), // only in source mode = Playlist
	sourceMode: window.GetProperty("_PROPERTY: Source Mode", 0), // 0 = Library, 1 = Playlist
	tagMode: window.GetProperty("_PROPERTY: Tag Mode", 1), // 1 = album, 2 = artist, 3 = genre
	panelMode: window.GetProperty("_PROPERTY: Display Mode", 1), // 0 = text, 1 = stamps + text, 2 = lines + text, 3 = stamps no text
	albumsTFsorting: window.GetProperty("Sort Order - ALBUM", "%album artist% | %date% | %album% | %discnumber% | %tracknumber% | %title%"),
	artistsTFsorting: window.GetProperty("Sort Order - ARTIST", "$meta(artist,0) | %date% | %album% | %discnumber% | %tracknumber% | %title%"),
	genresTFsorting: window.GetProperty("Sort Order - GENRE", "$meta(genre,0) | %album artist% | %date% | %album% | %discnumber% | %tracknumber% | %title%"),
	showAllItem: window.GetProperty("_PROPERTY: Show ALL item", true),
	default_thumbnailWidthMin: window.GetProperty("SYSTEM thumbnails Minimal Width", 130),
	thumbnailWidthMin: 0,
	default_lineHeightMin: window.GetProperty("SYSTEM Minimal Line Height", 90),
	lineHeightMin: 0,
	enableDiskCache: window.GetProperty("SYSTEM Disk Cache", true),
	scrollRowDivider: window.GetProperty("SYSTEM Scroll Row Divider", 1),
	tf_artist: fb.TitleFormat("%artist%"),
	tf_albumartist: fb.TitleFormat("%album artist%"),
	tf_groupkey_genre: fb.TitleFormat("$if2($meta(genre,0),Other)"),
	tf_groupkey_artist: fb.TitleFormat("$if2($meta(artist,0),Unknow Artist)"),
	tf_groupkey_album: fb.TitleFormat("%album artist% ^^ %album% ## %title%"),
	tf_path: fb.TitleFormat("$directory_path(%path%)\\"),
	tf_path_artist: fb.TitleFormat(window.GetProperty("_PROPERTY: Artist Images Folder (for disk cache)", "X:\\XPS2720\\MP3\\artists\\$meta(artist,0).jpg")),
	tf_path_genre: fb.TitleFormat(images.path + "genres\\$meta(genre,0).jpg"),
	tf_crc: fb.TitleFormat("$crc32(%path%)"),
	tf_crc_artist: fb.TitleFormat("$crc32('artists'$meta(artist,0))"),
	tf_crc_genre: fb.TitleFormat("$crc32('genres'$meta(genre,0))"),
	tf_time_remaining: fb.TitleFormat("$if(%length%,-%playback_time_remaining%,'0:00')"),
	rowHeight: 22,
	rowScrollStep: 1,
	scrollSmoothness: 2.5,
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
	enableTouchControl: window.GetProperty("_PROPERTY: Enable Scroll Touch Control", true),
	default_botStampHeight: 48,
	botStampHeight: 0,
	default_botGridHeight: 42,
	botGridHeight: 0,
	default_botTextRowHeight: 17,
	botTextRowHeight: 0,
	default_textLineHeight: 10,
	textLineHeight: 0
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

cPlaylistManager = {
	default_width: 230,
	width: 0,
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
	masks: window.GetProperty("_PROPERTY: Cover art masks (for disk cache)", "*front*.*;*cover*.*;*folder*.*;*.*"),
	draw_glass_reflect: false,
	max_w: 1
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
	addItems: false,
	showMenu: false,
	showPlaylistManager: false,
	hidePlaylistManager: false,
	avoidPlaylistSwitch: false
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
				if (k < brw.groups.length && k >= g_start_ && k <= g_end_) {
					if (!timers.coverDone) {
						timers.coverDone = window.SetTimeout(function () {
							brw.repaint();
							timers.coverDone && window.ClearTimeout(timers.coverDone);
							timers.coverDone = false;
						}, 5);
					};
				} else {
					if (!timers.coverDone) {
						timers.coverDone = window.SetTimeout(function () {
							timers.coverDone && window.ClearTimeout(timers.coverDone);
							timers.coverDone = false;
						}, 5);
					};
				};
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
			if (ppt.enableDiskCache) {
				brw.groups[albumIndex].crc = check_cache(metadb, albumIndex);
				if (brw.groups[albumIndex].crc && brw.groups[albumIndex].load_requested == 0) {
					// load img from cache
					if (!timers.coverLoad) {
						if (!isScrolling && !cScrollBar.timerID) {
							timers.coverLoad = window.SetTimeout(function () {
									try {
										brw.groups[albumIndex].tid = load_image_from_cache(metadb, brw.groups[albumIndex].crc);
										brw.groups[albumIndex].load_requested = 1;
									} catch (e) {};
									timers.coverLoad && window.ClearTimeout(timers.coverLoad);
									timers.coverLoad = false;
								}, 5);
						} else {
							timers.coverLoad = window.SetTimeout(function () {
									try {
										brw.groups[albumIndex].tid = load_image_from_cache(metadb, brw.groups[albumIndex].crc);
										brw.groups[albumIndex].load_requested = 1;
									} catch (e) {};
									timers.coverLoad && window.ClearTimeout(timers.coverLoad);
									timers.coverLoad = false;
								}, 20);
						};
					};
				};
			};
			if (!ppt.enableDiskCache || !(ppt.enableDiskCache && brw.groups[albumIndex].crc && brw.groups[albumIndex].load_requested == 0)) {
				if (brw.groups[albumIndex].load_requested == 0) {
					// load img default method
					if (!timers.coverLoad) {
						timers.coverLoad = window.SetTimeout(function () {
							if (ppt.tagMode == 3) { // genre
								var arr = brw.groups[albumIndex].groupkey.split(" ^^ ");
								try {
									var genre_img = gdi.Image(images.path + "genres\\" + arr[0] + ".jpg");
								} catch (e) {
									var genre_img = gdi.Image(images.path + "genres\\" + "default.jpg");
								};
								brw.groups[albumIndex].cover_img = g_image_cache.getit(metadb, albumIndex, genre_img);
								brw.repaint();
							} else {
								var art_id = ppt.tagMode == 1 ? 0 : 4;
								utils.GetAlbumArtAsync(window.ID, metadb, art_id, true, false, false);
							};
							timers.coverLoad && window.ClearTimeout(timers.coverLoad);
							timers.coverLoad = false;
						}, (!isScrolling && !cScrollBar.timerID ? 5 : 20));
					};
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

		if (!image) {
			if (brw.groups[albumId].tracktype != 3) {
				cover_type = 0;
			} else {
				cover_type = 3;
			};
		} else {
			if (image.Height >= image.Width) {
				var ratio = image.Width / image.Height;
				var pw = cw * ratio;
				var ph = ch;
			} else {
				var ratio = image.Height / image.Width;
				var pw = cw;
				var ph = ch * ratio;
			};

			// cover.type : 0 = nocover, 1 = external cover, 2 = embedded cover, 3 = stream
			if (brw.groups[albumId].tracktype != 3) {
				if (metadb) {
					img = FormatCover(image, pw, ph);
					cover_type = 1;
				};
			} else {
				cover_type = 3;
			};
			this._cachelist[brw.groups[albumId].cachekey] = img;

			// save img to cache
			if (ppt.enableDiskCache) {
				if (cover_type == 1 && !brw.groups[albumId].save_requested) {
					if (!timers.saveCover) {
						brw.groups[albumId].save_requested = true;
						save_image_to_cache(metadb, albumId);
						timers.saveCover = window.SetTimeout(function () {
							window.ClearTimeout(timers.saveCover);
							timers.saveCover = false;
						}, 10);
					};
				};
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
					tw = gr.CalcTextWidth(t + "  ", g_font);
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
					brw.metadblist_selection = brw.groups[brw.activeIndex].pl.Clone();
					if (this.activeRow == 0) {
						// send to a new playlist
						this.drop_done = true;
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
										this.drop_done = false;
										// close pman
										if (!timers.hidePlaylistManager) {
											timers.hidePlaylistManager = window.SetInterval(pman.hidePanel, 30);
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
						timers.hidePlaylistManager = window.SetInterval(this.hidePanel, 30);
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
					timers.hidePlaylistManager = window.SetInterval(this.hidePanel, 30);
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
					timers.hidePlaylistManager = window.SetInterval(this.hidePanel, 30);
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
		if (this.cursorh != prev_cursorh)
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
	if (handle) {
		switch (ppt.tagMode) {
		case 1:
			this.cachekey = process_cachekey(ppt.tf_crc.EvalWithMetadb(handle));
			break;
		case 2:
			this.cachekey = process_cachekey(ppt.tf_crc_artist.EvalWithMetadb(handle));
			break;
		case 3:
			this.cachekey = process_cachekey(ppt.tf_crc_genre.EvalWithMetadb(handle));
			break;
		}
		this.tracktype = TrackType(handle.RawPath.substring(0, 4));
	} else {
		this.cachekey = null;
		this.tracktype = 0;
	};
	//
	this.cover_img = null;
	this.cover_type = null;
	this.load_requested = 0;
	this.save_requested = false;

	this.finalize = function (count, tracks, handles) {
		this.tra = tracks.slice(0);
		this.pl = handles.Clone();
		this.count = count;
	};

	//this.totalPreviousRows = 0
};

oBrowser = function (name) {
	this.name = name;
	this.groups = [];
	this.rows = [];
	this.SHIFT_start_id = null;
	this.SHIFT_count = 0;
	this.scrollbar = new oScrollbar(cScrollBar.themed);
	this.keypressed = false;
	this.selectedIndex = -1;

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

	this.update = function () {
		switch (ppt.panelMode) {
		case 1:
		case 3:
			// *** STAMP MODES ***
			this.stampDrawMode = (ppt.panelMode == 1 ? true : false);
			this.thumb_w = ppt.thumbnailWidthMin;
			this.marginLR = 0;
			// set margins betweens album stamps
			if (ppt.panelMode == 1) {
				this.marginTop = 2;
				this.marginBot = 2;
				this.marginSide = 2;
				this.marginCover = 16;
			} else {
				this.marginTop = 0;
				this.marginBot = 0;
				this.marginSide = 0;
				this.marginCover = 1;
			};
			// Adjust Column
			this.totalColumns = Math.floor((this.w - this.marginLR * 2) / this.thumb_w);
			if (this.totalColumns < 1)
				this.totalColumns = 1;
			// count total of rows for the whole library
			this.rowsCount = Math.ceil(this.groups.length / this.totalColumns);
			var gapeWidth = (this.w - this.marginLR * 2) - (this.totalColumns * this.thumb_w);
			var deltaToAdd = Math.floor(gapeWidth / this.totalColumns);
			this.thumbnailWidth = this.thumb_w + deltaToAdd;
			// calc size of the cover art
			cover.max_w = (this.thumbnailWidth - (this.marginSide * 2) - (this.marginCover * 2));
			// Adjust Row & showList bloc Height
			if (ppt.panelMode == 1) {
				this.rowHeight = 10 + cover.max_w + ppt.botStampHeight;
			} else {
				this.rowHeight = cover.max_w + 1;
			};
			break;
		case 0:
		case 2:
			// *** LINE MODES ***
			this.stampDrawMode = true;
			this.thumb_w = this.w;
			this.marginLR = 0;
			// set margins betweens album stamps
			this.marginTop = (ppt.panelMode > 0 ? 1 : 0);
			this.marginBot = (ppt.panelMode > 0 ? 2 : 0);
			this.marginSide = (ppt.panelMode > 0 ? 1 : 0);
			this.marginCover = (ppt.panelMode > 0 ? 7 : 5);
			// Adjust Column
			this.totalColumns = 1;
			// count total of rows for the whole library
			this.rowsCount = this.groups.length;
			this.thumbnailWidth = this.thumb_w;
			// Adjust Row & showList bloc Height
			switch (ppt.tagMode) {
			case 1: // album
				this.rowHeight = (ppt.panelMode == 0 ? Math.ceil(g_fsize * 4.5) : ppt.lineHeightMin);
				break;
			case 2: // artist
				this.rowHeight = (ppt.panelMode == 0 ? Math.ceil(g_fsize * 2.5) : ppt.lineHeightMin);
				break;
			case 3: // genre
				this.rowHeight = (ppt.panelMode == 0 ? Math.ceil(g_fsize * 2.5) : ppt.lineHeightMin);
				break;
			}
			// calc size of the cover art
			cover.max_w = (this.rowHeight - (this.marginCover * 2));
			break;
		};

		this.totalRows = Math.ceil(this.h / this.rowHeight);
		this.totalRowsVis = Math.floor(this.h / this.rowHeight);
		ppt.rowHeight = this.rowHeight;

		//
		scroll = Math.round(scroll / this.rowHeight) * this.rowHeight;
		scroll = check_scroll(scroll);
		//scroll_ = scroll + (this.rowHeight / ppt.scrollRowDivider);
		scroll_ = scroll;

		// scrollbar update
		this.scrollbar.updateScrollbar();

		// update images (scaled ones)
		get_images();

		this.repaint();
	};

	this.setSize = function (x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;

		g_filterbox.setSize(cFilterBox.w, cFilterBox.h + 2, g_fsize + 2);

		this.scrollbar.setSize();

		scroll = Math.round(scroll / ppt.rowHeight) * ppt.rowHeight;
		scroll = check_scroll(scroll);
		scroll_ = scroll;

		// scrollbar update
		this.scrollbar.updateScrollbar();

		this.update();

		pman.setSize(ww, y + 50, (cPlaylistManager.width < ww ? cPlaylistManager.width : ww), h - 100);
	};

	this.setList = function () {
		var end = this.groups.length;
		for (var i = 0; i < end; i++) {
			this.groups[i].load_requested = 0;
		};
	};

	this.showItemFromItemHandle = function (metadb) {
		var total = this.groups.length;
		var total_tracks = 0;
		var found = false;
		for (var a = (ppt.showAllItem ? 1 : 0); a < total; a++) {
			total_tracks = this.groups[a].pl.Count;
			for (var t = 0; t < total_tracks; t++) {
				found = this.groups[a].pl[t].Compare(metadb);
				if (found) {
					break;
				};
			};
			if (found)
				break;
		};
		if (found) { // scroll to album and open showlist
			if (ppt.showAllItem && a == 0)
				a += 1;
			switch (ppt.panelMode) {
			case 1:
			case 3:
				var row = Math.floor(a / this.totalColumns);
				if (this.h / 2 > this.rowHeight) {
					var delta = Math.floor(this.h / 2);
				} else {
					var delta = 0
				};
				scroll = row * this.rowHeight - delta;
				scroll = check_scroll(scroll);
				break;
			case 0:
			case 2:
				if (this.h / 2 > this.rowHeight) {
					var delta = Math.floor(this.h / 2);
				} else {
					var delta = 0
				};
				scroll = a * this.rowHeight - delta;
				scroll = check_scroll(scroll);
				break;
			};
			this.activateItem(a);
		};
	};

	this.showNowPlaying = function () {
		if (fb.IsPlaying) {
			try {
				if (ppt.sourceMode == 1) {
					if (plman.PlayingPlaylist != plman.ActivePlaylist) {
						g_active_playlist = plman.ActivePlaylist = plman.PlayingPlaylist;
					};
					this.nowplaying = plman.GetPlayingItemLocation();
					var gid = this.getItemIndexFromTrackIndex(this.nowplaying.PlaylistItemIndex);
					if (gid > -1) {
						this.showItemFromItemIndex(gid);
					};
				} else {
					var handle = fb.GetNowPlaying();
					if (fb.IsMetadbInMediaLibrary(handle)) {
						this.showItemFromItemHandle(handle);
					};
				};
			} catch (e) {};
		};
	};

	this.showItemFromItemIndex = function (index) {
		if (ppt.showAllItem && index == 0)
			index += 1;
		switch (ppt.panelMode) {
		case 1:
		case 3:
			var row = Math.floor(index / this.totalColumns);
			if (this.h / 2 > this.rowHeight) {
				var delta = Math.floor(this.h / 2);
			} else {
				var delta = 0
			};
			scroll = row * this.rowHeight - delta;
			scroll = check_scroll(scroll);
			break;
		case 0:
		case 2:
			if (this.h / 2 > this.rowHeight) {
				var delta = Math.floor(this.h / 2);
			} else {
				var delta = 0
			};
			scroll = index * this.rowHeight - delta;
			scroll = check_scroll(scroll);
			break;
		};
		this.activateItem(index);
	};

	this.getItemIndexFromTrackIndex = function (tid) {
		var mediane = 0;
		var deb = 0;
		var fin = this.groups.length - 1;
		while (deb <= fin) {
			mediane = Math.floor((fin + deb) / 2);
			if (tid >= this.groups[mediane].start && tid < this.groups[mediane].start + this.groups[mediane].count) {
				return mediane;
			} else if (tid < this.groups[mediane].start) {
				fin = mediane - 1;
			} else {
				deb = mediane + 1;
			};
		};
		return -1;
	};

	this.selectAtoB = function (start_id, end_id) {
		var affectedItems = Array();

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
	};

	this.init_groups = function () {
		var handle = null;
		var current = "";
		var previous = "";
		var g = 0,
		t = 0;
		var arr = [];
		var tr = [];
		var pl = fb.CreateHandleList();
		var total = this.list.Count;
		var t_all = 0;
		var tr_all = [];
		var pl_all = fb.CreateHandleList();
		var e = [];

		var d1 = new Date();
		var t1 = d1.getSeconds() * 1000 + d1.getMilliseconds();

		this.groups.splice(0, this.groups.length);

		switch (ppt.tagMode) {
		case 1: // album
			var tf = ppt.tf_groupkey_album;
			break;
		case 2: // artist
			var tf = ppt.tf_groupkey_artist;
			break;
		case 3: // genre
			var tf = ppt.tf_groupkey_genre;
			break;
		};
		var str_filter = process_string(filter_text);

		for (var i = 0; i < total; i++) {
			handle = this.list[i];
			arr = tf.EvalWithMetadb(handle).split(" ## ");
			current = arr[0].toLowerCase();
			if (str_filter.length > 0) {
				var comp_str = (arr.length > 1 ? arr[0] + " " + arr[1] : arr[0]);
				var toAdd = match(comp_str, str_filter);
			} else {
				var toAdd = true;
			};
			if (toAdd) {
				if (current != previous && !e[current]) {
					if (ppt.sourceMode == 1)
						e[current] = true;
					if (g > 0) {
						// update current group
						this.groups[g - 1].finalize(t, tr, pl);
						tr.splice(0, t);
						pl.RemoveAll();
						t = 0;
					};
					if (i < total) {
						// add new group
						tr.push(arr[1]);
						pl.Add(handle);
						if (ppt.showAllItem) {
							tr_all.push(arr[1]);
							pl_all.Add(handle);
						};
						t_all++;
						t++;
						this.groups.push(new oGroup(g + 1, i, handle, arr[0]));
						g++;
						previous = current;
					};
				} else {
					// add track to current group
					tr.push(arr[1]);
					pl.Add(handle);
					if (ppt.showAllItem) {
						tr_all.push(arr[1]);
						pl_all.Add(handle);
					};
					t_all++;
					t++;
				};
			};
		};

		if (g > 0) {
			// update last group properties
			this.groups[g - 1].finalize(t, tr, pl);

			// add 1st group ("ALL" item)
			if (ppt.showAllItem && g > 1) {
				this.groups.unshift(new oGroup(0, 0, null, null));
				this.groups[0].finalize(t_all, tr_all, pl_all);
			};
		};

		// free memory
		tr.splice(0, tr.length);
		tr_all.splice(0, tr_all.length);
		e.splice(0, e.length);
		pl.RemoveAll();
		pl_all.RemoveAll();

		var d2 = new Date();
		var t2 = d2.getSeconds() * 1000 + d2.getMilliseconds();
	};

	this.populate = function (is_first_populate) {

		// define sort order
		switch (ppt.tagMode) {
		case 1: // album
			var TFsorting = ppt.albumsTFsorting;
			break;
		case 2: // artist
			var TFsorting = ppt.artistsTFsorting;
			break;
		case 3: // genre
			var TFsorting = ppt.genresTFsorting;
			break;
		};

		if (ppt.sourceMode == 0) {
			// populate library
			this.list = fb.GetLibraryItems();

			// sort the list
			if (TFsorting.length > 0) {
				this.list.OrderByFormat(fb.TitleFormat(TFsorting), 1);
			};
		} else {
			// populate current playlist
			this.list_unsorted = this.list = plman.GetPlaylistItems(g_active_playlist);

			// sort the list
			/*
			if(TFsorting.length > 0) {
			this.list.OrderByFormat(fb.TitleFormat(TFsorting), 1);
			};
			*/
		};

		this.init_groups();
		get_metrics();
		this.setList();
		this.update();
		this.scrollbar.updateScrollbar();
		this.repaint();
		g_first_populate_done = true;
	};

	this.activateItem = function (index) {
		if (this.groups.length == 0)
			return;
		this.selectedIndex = index;
	};

	this.focusItemToPlaylist = function (metadb) {
		if (this.groups.length == 0)
			return;

		var affectedItems = [];
		var total = this.list_unsorted.Count;
		for (var a = 0; a < total; a++) {
			if (this.list_unsorted[a].Compare(metadb)) {
				affectedItems.push(a);
			};
		};
		if (affectedItems.length > 0) {
			//plman.ClearPlaylistSelection(g_active_playlist);
			//plman.SetPlaylistSelection(g_active_playlist, affectedItems, true);
			g_avoid_on_item_focus_change = true;
			plman.SetPlaylistFocusItemByHandle(g_active_playlist, metadb);
		};
	};

	this.sendItemToPlaylist = function (index) {
		if (this.groups.length == 0)
			return;

		// notify JSSmoothPlaylist panel to avoid "on_playlist_items_removed" until "on_playlist_items_added" was called (to avoid x2 call of populate function!)
		window.NotifyOthers("JSSmoothBrowser->JSSmoothPlaylist:avoid_on_playlist_items_removed_callbacks_on_sendItemToPlaylist", true);

		// parse stored tags
		if (ppt.showAllItem && index == 0 && this.groups.length > 1) {
			var arr = null;
		} else {
			var arr = this.groups[index].groupkey.split(" ^^ ");
		};
		// ======================================
		// Send item tracks to JSBrowser playlist
		// ======================================
		// check if JSBrowser playlists are present
		var affectedItems = [];
		var pfound = false;
		var pfound_playing = false;
		var total = plman.PlaylistCount;
		var pidx = -1;
		var pidx_playing = -1;
		for (var i = 0; i < total; i++) {
			if (!pfound && plman.GetPlaylistName(i) == "Library selection") {
				pidx = i;
				pfound = true;
			};
			if (!pfound_playing && plman.GetPlaylistName(i) == "Library selection (playing)") {
				pidx_playing = i;
				pfound_playing = true;
			};
			if (pfound && pfound_playing)
				break;
		};

		if (utils.IsKeyPressed(VK_CONTROL)) {
			// initialize "Library selection" playlist
			if (pfound) {
				var from = plman.PlaylistItemCount(pidx);
			} else {
				pidx = plman.PlaylistCount;
				plman.CreatePlaylist(pidx, "Library selection");
				var from = 0;
			};
			// *** insert tracks into pidx playlist
			plman.InsertPlaylistItems(pidx, from, brw.groups[index].pl, false);
		} else {
			if (fb.IsPlaying) {
				if (plman.PlayingPlaylist == pidx) { // playing playlist is "Library selection"
					plman.RenamePlaylist(pidx, "Library selection (playing)");
					if (pfound_playing) {
						plman.RenamePlaylist(pidx_playing, "Library selection");
						// 1. initialize old "Library selection (playing)" playlist
						var tot = plman.PlaylistItemCount(pidx_playing);
						affectedItems.splice(0, affectedItems.length);
						for (var i = 0; i < tot; i++) {
							affectedItems.push(i);
						};
						plman.SetPlaylistSelection(pidx_playing, affectedItems, true);
						plman.RemovePlaylistSelection(pidx_playing, false);
					} else {
						pidx_playing = plman.PlaylistCount;
						plman.CreatePlaylist(pidx_playing, "Library selection");
					};
					// *** insert tracks into pidx_playing playlist
					plman.InsertPlaylistItems(pidx_playing, 0, brw.groups[index].pl, false);
					plman.MovePlaylist(pidx_playing, pidx);
					plman.MovePlaylist(pidx + 1, pidx_playing);
				} else {
					// initialize true "Library selection" playlist
					if (pfound) {
						// clear "Library selection" playlist content
						var tot = plman.PlaylistItemCount(pidx);
						for (var i = 0; i < tot; i++) {
							affectedItems.push(i);
						};
						plman.SetPlaylistSelection(pidx, affectedItems, true);
						plman.RemovePlaylistSelection(pidx, false);
					} else {
						// create "Library selection" playlist
						pidx = plman.PlaylistCount;
						plman.CreatePlaylist(pidx, "Library selection");
					};
					// *** insert tracks into pidx playlist
					plman.InsertPlaylistItems(pidx, 0, brw.groups[index].pl, false);
				};
			} else {
				// initialize "Library selection" playlist
				if (pfound) {
					// clear "Library selection" playlist content
					var tot = plman.PlaylistItemCount(pidx);
					for (var i = 0; i < tot; i++) {
						affectedItems.push(i);
					};
					plman.SetPlaylistSelection(pidx, affectedItems, true);
					plman.RemovePlaylistSelection(pidx, false);
				} else {
					// create "Library selection" playlist
					pidx = plman.PlaylistCount;
					plman.CreatePlaylist(pidx, "Library selection");
				};
				// *** insert tracks into pidx playlist
				plman.InsertPlaylistItems(pidx, 0, brw.groups[index].pl, false);
			};

			plman.ActivePlaylist = pidx;
		};
	};

	this.getlimits = function () {

		// get visible stamps limits (start & end indexes)
		if (this.groups.length <= this.totalRowsVis * this.totalColumns) {
			var start_ = 0;
			var end_ = this.groups.length;
		} else {
			var start_ = Math.round(scroll_ / this.rowHeight) * this.totalColumns;
			var end_ = Math.round((scroll_ + wh + this.rowHeight) / this.rowHeight) * this.totalColumns;
			// check values / limits
			end_ = (this.groups.length < end_) ? this.groups.length : end_;
			start_ = start_ > 0 ? start_ - this.totalColumns : (start_ < 0 ? 0 : start_);
		};

		// save limits calculated into globals var
		g_start_ = start_;
		g_end_ = end_;
	};

	this.draw = function (gr) {
		var tmp,
		offset;
		var cx = 0;
		var ax,
		ay,
		by,
		rowStart,
		row,
		coverTop;
		var aw = this.thumbnailWidth - (this.marginSide * 2);
		var ah = this.rowHeight - this.marginTop - this.marginBot;
		if (ppt.panelMode > 0) {
			var coverWidth = cover.max_w;
		} else {
			var coverWidth = 0;
		};
		var txt_color1,
		txt_color2,
		selbg_color;
		var total = this.groups.length;
		var all_x = -1,
		all_y = -1,
		all_w = 0,
		all_h = 0;
		var coverImg = null;

		this.getlimits();

			// draw visible stamps (loop)
			for (var i = g_start_; i < g_end_; i++) {
				row = Math.floor(i / this.totalColumns);
				ax = this.x + (cx * this.thumbnailWidth) + this.marginSide + this.marginLR;
				ay = Math.floor(this.y + (row * this.rowHeight) + this.marginTop - scroll_);
				this.groups[i].x = ax;
				this.groups[i].y = ay;

				if (ay >= (0 - this.rowHeight) && ay < this.y + this.h) { // if stamp visible, we have to draw it

					// parse stored tags
					if (!(ppt.showAllItem && i == 0 && total > 1)) {
						if (this.groups[i].groupkey.length > 0) {
							var arr = this.groups[i].groupkey.split(" ^^ ");
						};
					};

					if (ppt.panelMode > 0) {
						// get cover
						if (ppt.showAllItem && i == 0 && total > 1) {
							this.groups[i].cover_img = images.all;
						} else {
							if (this.groups[i].cover_type == null) {
								if (this.groups[i].load_requested == 0) {
									this.groups[i].cover_img = g_image_cache.hit(this.groups[i].metadb, i);
								};
							} else if (this.groups[i].cover_type == 0) {
								this.groups[i].cover_img = images.noart;
							} else if (this.groups[i].cover_type == 3) {
								this.groups[i].cover_img = images.stream;
							};
						};
					};

					if (this.stampDrawMode) {
						// BG under cover
						if (ppt.panelMode == 0 || ppt.panelMode == 2) {
							if (Math.floor(i / 2) != Math.ceil(i / 2)) {
								gr.FillSolidRect(ax, ay, aw, ah, g_color_normal_txt & 0x05ffffff);
							};
						} else {
							//gr.FillSolidRect(ax, ay, aw, ah, g_color_normal_txt & 0x06ffffff);
							//gr.DrawRect(ax, ay, aw-1, ah-1, 1.0, g_color_normal_txt & 0x07ffffff);
						};
						// background selection
						if (i == this.selectedIndex) {
							txt_color1 = (ppt.enableCustomColors ? g_color_selected_txt : g_color_normal_bg);
							txt_color2 = blendColors(txt_color1, g_color_selected_bg, 0.25);
							selbg_color = g_color_selected_bg & 0xb0ffffff;
							gr.FillSolidRect(ax, ay, aw, ah, selbg_color);
						} else {
							txt_color1 = g_color_normal_txt;
							txt_color2 = blendColors(g_color_normal_txt, g_color_normal_bg, 0.25);
						};
					} else { // panelMode = 3 (Grid)
						// background selection
						if (i == this.selectedIndex) {
							txt_color1 = (ppt.enableCustomColors ? g_color_selected_txt : g_color_normal_bg);
							txt_color2 = blendColors(txt_color1, g_color_selected_bg, 0.25);
							selbg_color = g_color_selected_bg & 0xb0ffffff;
						} else {
							txt_color1 = RGBA(240, 240, 240);
							txt_color2 = RGBA(220, 220, 220);
							selbg_color = RGBA(0, 0, 0, 190);
						};
					};

					switch (ppt.panelMode) {
					case 1:
					case 3:
						coverTop = ppt.panelMode == 1 ? ay + 10 : ay;
						// draw cover
						if (this.groups[i].cover_img) {
							// save coords ALL cover image:
							if (ppt.showAllItem && i == 0 && total > 1) {
								all_x = ax + Math.round((aw - coverWidth) / 2);
								all_y = coverTop + coverWidth - coverWidth;
								all_w = coverWidth;
								all_h = coverWidth;
								drawImage(gr, this.groups[i].cover_img, ax + Math.round((aw - coverWidth) / 2), coverTop, coverWidth, coverWidth, ppt.autoFill, null, 190)
							} else {
								drawImage(gr, this.groups[i].cover_img, ax + Math.round((aw - coverWidth) / 2), coverTop, coverWidth, coverWidth, ppt.autoFill, g_color_normal_txt & 0x25ffffff)
								// grid text background rect
								if (ppt.panelMode == 3) {
									if (i == this.selectedIndex) {
										gr.FillSolidRect(ax + 2, coverTop + coverWidth - ppt.botGridHeight, aw - 4, ppt.botGridHeight, RGBA(150, 150, 150, 150));
									};
									gr.FillSolidRect(ax + 2, coverTop + coverWidth - ppt.botGridHeight, aw - 4, ppt.botGridHeight, selbg_color);
								};
							};
						} else {
							gr.DrawImage(images.loading_draw, ax + Math.round((aw - images.loading_draw.Width) / 2), ay + Math.round((aw - images.loading_draw.Height) / 2), images.loading_draw.Width, images.loading_draw.Height, 0, 0, images.loading_draw.Width, images.loading_draw.Height, images.loading_angle, 160);
						};

						if (!ppt.showAllItem || (ppt.showAllItem && i > 0) || (ppt.panelMode != 3)) {
							if (g_rightClickedIndex > -1) {
								if (g_rightClickedIndex == i) {
									if (this.stampDrawMode) {
										gr.DrawRect(ax + 1, ay + 1, aw - 2, ah - 2, 2.0, g_color_selected_bg & 0xd0ffffff);
									} else {
										gr.DrawRect(ax + Math.round((aw - coverWidth) / 2) + 1, coverTop + 1, coverWidth - 3, coverWidth - 3, 3.0, g_color_selected_bg & 0xddffffff);
									};
								};
							} else {
								if (i == this.activeIndex) {
									if (this.stampDrawMode) {
										gr.DrawRect(ax + 1, ay + 1, aw - 2, ah - 2, 2.0, g_color_selected_bg & 0xd0ffffff);
									} else {
										gr.DrawRect(ax + Math.round((aw - coverWidth) / 2) + 1, coverTop + 1, coverWidth - 3, coverWidth - 3, 3.0, g_color_selected_bg & 0xddffffff);
									};
								};
							};
						};

						if (ppt.panelMode == 1) { // panelMode = 1 (Art + bottom labels)
							// draw text
							if (ppt.showAllItem && i == 0 && total > 1) { // aggregate item ( [ALL] )
								try {
									if (ppt.tagMode == 1) {
										gr.GdiDrawText("All items", g_font_bold, txt_color1, ax + Math.round((aw - coverWidth) / 2), (coverTop + 5 + coverWidth), coverWidth, ppt.botTextRowHeight + ppt.extra_font_size, DT_LEFT | DT_TOP | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
										gr.GdiDrawText("(" + (total - 1) + " items)", g_font, txt_color2, ax + Math.round((aw - coverWidth) / 2), (coverTop + 5 + coverWidth + ppt.botTextRowHeight), coverWidth, ppt.botTextRowHeight + ppt.extra_font_size, DT_LEFT | DT_TOP | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
									} else {
										gr.GdiDrawText("All items", i == this.selectedIndex ? g_font_bold : g_font, txt_color2, ax + Math.round((aw - coverWidth) / 2), (coverTop + 5 + coverWidth), coverWidth, ppt.botTextRowHeight + ppt.extra_font_size, DT_LEFT | DT_TOP | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
									};
								} catch (e) {}
							} else {
								if (arr[1] == "?") {
									if (this.groups[i].count > 1) {
										var album_name = (this.groups[i].tracktype != 3 ? "(Singles)" : "(Web Radios)");
									} else {
										var arr_t = this.groups[i].tra[0].split(" ^^ ");
										var album_name = (this.groups[i].tracktype != 3 ? "(Single) " : "") + arr_t[0];
									};
								} else {
									var album_name = arr[1];
								};
								try {
									if (ppt.tagMode == 1) {
										gr.GdiDrawText(album_name, g_font_bold, txt_color1, ax + Math.round((aw - coverWidth) / 2), (coverTop + 5 + coverWidth), coverWidth, ppt.botTextRowHeight + ppt.extra_font_size, DT_LEFT | DT_TOP | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
										if (this.groups[i].tracktype != 3)
											gr.GdiDrawText(arr[0], g_font, txt_color2, ax + Math.round((aw - coverWidth) / 2), (coverTop + 5 + coverWidth + ppt.botTextRowHeight), coverWidth, ppt.botTextRowHeight + ppt.extra_font_size, DT_LEFT | DT_TOP | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
									} else {
										gr.GdiDrawText(arr[0], i == this.selectedIndex ? g_font_bold : g_font, txt_color2, ax + Math.round((aw - coverWidth) / 2), (coverTop + 5 + coverWidth), coverWidth, ppt.botTextRowHeight + ppt.extra_font_size, DT_LEFT | DT_TOP | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
									};
								} catch (e) {}
							};
						} else if (this.groups[i].cover_img) { // panelMode = 3 (Grid)
							// draw text
							if (ppt.showAllItem && i == 0 && total > 1) { // aggregate item ( [ALL] )
								// nothing
							} else {
								if (arr[1] == "?") {
									if (this.groups[i].count > 1) {
										var album_name = (this.groups[i].tracktype != 3 ? "(Singles)" : "(Web Radios)");
									} else {
										var arr_t = this.groups[i].tra[0].split(" ^^ ");
										var album_name = (this.groups[i].tracktype != 3 ? "(Single) " : "") + arr_t[0];
									};
								} else {
									var album_name = arr[1];
								};
								try {
									if (ppt.tagMode == 1) {
										gr.GdiDrawText(album_name, g_font_bold, txt_color1, ax + 10, (coverTop + 5 + coverWidth) - ppt.botGridHeight, aw - 20, ppt.botTextRowHeight + ppt.extra_font_size, DT_LEFT | DT_TOP | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
										if (this.groups[i].tracktype != 3)
											gr.GdiDrawText(arr[0], g_font, txt_color2, ax + 10, (coverTop + 5 + coverWidth + ppt.botTextRowHeight) - ppt.botGridHeight, aw - 20, ppt.botTextRowHeight + ppt.extra_font_size, DT_LEFT | DT_TOP | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
									} else {
										gr.GdiDrawText(arr[0], i == this.selectedIndex ? g_font_bold : g_font, txt_color2, ax + 10, (coverTop + 5 + coverWidth + 8) - ppt.botGridHeight, aw - 20, ppt.botTextRowHeight + ppt.extra_font_size, DT_LEFT | DT_TOP | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
									};
								} catch (e) {}
							};
						};
						break;
					case 0:
					case 2:
						coverTop = ay;
						if (ppt.panelMode == 2) {
							// draw cover
							this.coverMarginLeft = this.marginCover;
							if (this.groups[i].cover_img) {
								// save coords ALL cover image:
								if (ppt.showAllItem && i == 0 && total > 1) {
									all_x = ax + this.coverMarginLeft;
									all_y = coverTop;
									all_w = coverWidth;
									all_h = coverWidth;
									drawImage(gr, this.groups[i].cover_img, ax + this.coverMarginLeft, coverTop, coverWidth, coverWidth, ppt.autoFill, null, 190);
								} else {
									drawImage(gr, this.groups[i].cover_img, ax + this.coverMarginLeft, coverTop, coverWidth, coverWidth, ppt.autoFill, g_color_normal_txt & 0x25ffffff);
								};
							} else {
								gr.DrawImage(images.loading_draw, ax + this.coverMarginLeft, coverTop, coverWidth, coverWidth, 0, 0, images.loading_draw.Width, images.loading_draw.Height, images.loading_angle, 160);
							};
						};

						if (g_rightClickedIndex > -1) {
							if (g_rightClickedIndex == i) {
								gr.DrawRect(ax + 1, ay + 1, aw - 2, ah - 2, 2.0, g_color_selected_bg & 0xd0ffffff);
							};
						} else {
							if (i == this.activeIndex) {
								gr.DrawRect(ax + 1, ay + 1, aw - 2, ah - 2, 2.0, g_color_selected_bg & 0xd0ffffff);
							};
						};

						// draw text
						if (ppt.showAllItem && i == 0 && total > 1) { // [ALL] item
							switch (ppt.tagMode) {
							case 1: // album
								try {
									gr.GdiDrawText("All items", g_font_bold, txt_color1, ax + coverWidth + this.marginCover * 2, ay - ppt.textLineHeight, aw - coverWidth - this.marginCover * 3, ah, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
									gr.GdiDrawText("(" + (total - 1) + " albums)", g_font, txt_color2, ax + coverWidth + this.marginCover * 2, ay + ppt.textLineHeight, aw - coverWidth - this.marginCover * 3, ah, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
								} catch (e) {}
								break;
							case 2: // artist
								try {
									gr.GdiDrawText("All items (" + (total - 1) + " artists)", i == this.selectedIndex ? g_font_bold : g_font, txt_color1, ax + coverWidth + this.marginCover * 2, ay, aw - coverWidth - this.marginCover * 3, ah, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
								} catch (e) {}
								break;
							case 3: // genre
								try {
									gr.GdiDrawText("All items (" + (total - 1) + " genres)", i == this.selectedIndex ? g_font_bold : g_font, txt_color1, ax + coverWidth + this.marginCover * 2, ay, aw - coverWidth - this.marginCover * 3, ah, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
								} catch (e) {}
								break;
							};
						} else {
							switch (ppt.tagMode) {
							case 1: // album
								if (arr[1] == "?") {
									if (this.groups[i].count > 1) {
										var album_name = (this.groups[i].tracktype != 3 ? "(Singles)" : "(Web Radios)");
									} else {
										var arr_t = this.groups[i].tra[0].split(" ^^ ");
										var album_name = (this.groups[i].tracktype != 3 ? "(Single) " : "") + arr_t[2];
									};
								} else {
									var album_name = arr[1];
								};
								try {
									gr.GdiDrawText(album_name, g_font_bold, txt_color1, ax + coverWidth + this.marginCover * 2, ay - ppt.textLineHeight, aw - coverWidth - this.marginCover * 3, ah, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
									if (this.groups[i].tracktype != 3)
										gr.GdiDrawText(arr[0], g_font, txt_color2, ax + coverWidth + this.marginCover * 2, ay + ppt.textLineHeight, aw - coverWidth - this.marginCover * 3, ah, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
								} catch (e) {}
								break;
							case 2: // artist
								try {
									gr.GdiDrawText(arr[0], i == this.selectedIndex ? g_font_bold : g_font, txt_color1, ax + coverWidth + this.marginCover * 2, ay, aw - coverWidth - this.marginCover * 3, ah, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
								} catch (e) {}
								break;
							case 3: // genre
								try {
									gr.GdiDrawText(arr[0], i == this.selectedIndex ? g_font_bold : g_font, txt_color1, ax + coverWidth + this.marginCover * 2, ay, aw - coverWidth - this.marginCover * 3, ah, DT_LEFT | DT_VCENTER | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
								} catch (e) {}
								break;
							};
						};
						break;
					};

				};

				// set next column index
				if (cx == this.totalColumns - 1) {
					cx = 0;
				} else {
					cx++;
				};
			};

			// draw scrollbar
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

			// fill ALL cover image with the 1st four cover art found
			if (ppt.panelMode > 0) {
				// get cover
				if (all_x > -1 && ppt.showAllItem && g_start_ == 0 && total > 1) {
					var ii_w = Math.floor(all_w / 2);
					var ii_h = Math.floor(all_h / 2);
					var ii_x1 = all_x;
					var ii_x2 = ii_x1 + ii_w;
					var ii_y1 = all_y;
					var ii_y2 = ii_y1 + ii_h;
					var lim = this.groups.length;
					if (lim > 5)
						lim = 5;
					for (var ii = 1; ii < lim; ii++) {
						if (this.groups[ii].cover_img) {
							switch (ii) {
							case 1:
								gr.DrawImage(this.groups[ii].cover_img, ii_x1, ii_y1, ii_w, ii_h, 1, 1, this.groups[ii].cover_img.Width - 2, this.groups[ii].cover_img.Height - 2);
								break;
							case 2:
								gr.DrawImage(this.groups[ii].cover_img, ii_x2, ii_y1, ii_w, ii_h, 1, 1, this.groups[ii].cover_img.Width - 2, this.groups[ii].cover_img.Height - 2);
								break;
							case 3:
								gr.DrawImage(this.groups[ii].cover_img, ii_x1, ii_y2, ii_w, ii_h, 1, 1, this.groups[ii].cover_img.Width - 2, this.groups[ii].cover_img.Height - 2);
								break;
							case 4:
								gr.DrawImage(this.groups[ii].cover_img, ii_x2, ii_y2, ii_w, ii_h, 1, 1, this.groups[ii].cover_img.Width - 2, this.groups[ii].cover_img.Height - 2);
								break;
							};
						};
					};
					gr.DrawRect(ii_x1, ii_y1, all_w - 1, all_h - 1, 1.0, blendColors(g_color_normal_txt, g_color_normal_bg, 0.8));
					gr.DrawRect(ii_x1, ii_y1, all_w - 1, Math.round(all_h / 2) - 1, 1.0, blendColors(g_color_normal_txt, g_color_normal_bg, 0.8));
					gr.DrawRect(ii_x1, ii_y1, Math.round(all_w / 2) - 1, all_h - 1, 1.0, blendColors(g_color_normal_txt, g_color_normal_bg, 0.8));

					// redraw hover frame selection on ALL item for Grid view
					if (ppt.panelMode == 3) { // grid
						if (g_rightClickedIndex == 0 || this.activeIndex == 0) {
							gr.DrawRect(all_x + 1, all_y + 1, all_w - 3, all_h - 3, 3.0, g_color_selected_bg & 0xddffffff);
						};
					};
				};
			};

			// draw top header bar
			if (ppt.showHeaderBar) {
				var item_txt = new Array("", "album", "artist", "genre");
				var nb_groups = (ppt.showAllItem && total > 1 ? total - 1 : total);
				var boxText = nb_groups + " " + item_txt[ppt.tagMode] + (nb_groups > 1 ? "s  " : "  ");
				//gr.FillGradRect(this.x, 0, this.w + (cScrollBar.enabled ? cScrollBar.width : 0), ppt.headerBarHeight-1, 0, RGBA(20,20,20,255), RGBA(0,0,0,160), 1.0);
				//gr.FillSolidRect(this.x, ppt.headerBarHeight-2, this.w + (cScrollBar.enabled ? cScrollBar.width : 0), 1, RGBA(0,0,0,130));

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

	this._isHover = function (x, y) {
		return (x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h);
	};

	this.on_mouse = function (event, x, y, delta) {
		this.ishover = this._isHover(x, y);

		// get active item index at x,y coords...
		this.activeIndex = -1;
		if (this.ishover) {
			this.activeRow = Math.ceil((y + scroll_ - this.y) / this.rowHeight) - 1;
			if (y > this.y && x > this.x && x < this.x + this.w) {
				this.activeColumn = Math.ceil((x - this.x - this.marginLR) / this.thumbnailWidth) - 1;
				this.activeIndex = (this.activeRow * this.totalColumns) + this.activeColumn;
				this.activeIndex = this.activeIndex > this.groups.length - 1 ? -1 : this.activeIndex;
			};
		};
		if (brw.activeIndex != brw.activeIndexSaved) {
			brw.activeIndexSaved = brw.activeIndex;
			this.repaint();
		};

		switch (event) {
		case "down":
			if (this.ishover) {
				if (this.activeIndex > -1) {
					if (this.activeIndex == this.selectedIndex) {
						this.drag_clicked = true;
						this.drag_clicked_x = x;
						if (ppt.sourceMode == 0) {
							g_avoid_on_playlist_items_removed = true;
							this.sendItemToPlaylist(this.activeIndex);
						} else {
							//this.focusItemToPlaylist(this.groups[this.activeIndex].metadb);
						};
					} else {
						this.activateItem(this.activeIndex);
						if (ppt.sourceMode == 0) {
							g_avoid_on_playlist_items_removed = true;
							this.sendItemToPlaylist(this.activeIndex);
						} else {
							//g_dnd_status = true;
							//g_dnd_handles = this.groups[this.activeIndex].pl;
							///*
							plman.ClearPlaylistSelection(g_active_playlist);
							//plman.SetPlaylistSelectionSingle(g_active_playlist, this.groups[this.activeIndex].start, true);
							this.selectAtoB(this.groups[this.activeIndex].start, this.groups[this.activeIndex].start + this.groups[this.activeIndex].count - 1);
							g_avoid_on_item_focus_change = true;
							plman.SetPlaylistFocusItem(g_active_playlist, this.groups[this.activeIndex].start);
							//*/
							//this.focusItemToPlaylist(this.groups[this.activeIndex].metadb);
						};
					};
				};
				this.repaint(); // avirer
			} else {
				if (cScrollBar.enabled && cScrollBar.visible) {
					this.scrollbar && this.scrollbar.on_mouse(event, x, y);
				};
			};
			break;
		case "up":
			//if(g_dnd_status && g_dnd_handles != null) {
			//    window.NotifyOthers("JSBrowser::dragndrop", g_dnd_handles);
			//    g_dnd_status = false;
			//};
			this.drag_clicked = false;
			if (cScrollBar.enabled && cScrollBar.visible) {
				this.scrollbar && this.scrollbar.on_mouse(event, x, y);
			};
			break;
		case "dblclk":
			if (this.ishover) {
				if (brw.activeIndex > -1) {
					if (ppt.sourceMode == 0) {
						// play first track of the selection
						plman.ExecutePlaylistDefaultAction(g_active_playlist, 0);
					} else {
						plman.ExecutePlaylistDefaultAction(g_active_playlist, this.groups[this.activeIndex].start);
					};
				};
			} else {
				if (cScrollBar.enabled && cScrollBar.visible) {
					this.scrollbar && this.scrollbar.on_mouse(event, x, y);
				};
			};
			break;
		case "right":
			g_rightClickedIndex = this.activeIndex;
			if (this.ishover && this.activeIndex > -1) {
				this.activateItem(this.activeIndex);
				if (ppt.sourceMode == 0) {
					g_avoid_on_playlist_items_removed = true;
					this.sendItemToPlaylist(this.activeIndex);
				} else {
					g_dnd_status = true;
					//g_dnd_handles = this.groups[this.activeIndex].pl;
				};
				this.item_context_menu(x, y, this.activeIndex);
			} else {
				if (!g_filterbox.inputbox.hover) {
					this.settings_context_menu(x, y);
				};
			};
			g_rightClickedIndex = -1;
			if (!this.ishover) {
				if (cScrollBar.enabled && cScrollBar.visible) {
					this.scrollbar && this.scrollbar.on_mouse(event, x, y);
				};
			};
			break;
		case "move":
			if (this.drag_clicked && !this.drag_moving) {
				if (x - this.drag_clicked_x > 30 && this.h > cPlaylistManager.rowHeight * 6) {
					this.drag_moving = true;
					window.SetCursor(IDC_HELP);
					pman.state = 1;
					if (timers.hidePlaylistManager) {
						window.ClearInterval(timers.hidePlaylistManager);
						timers.hidePlaylistManager = false;
					};
					if (!timers.showPlaylistManager) {
						timers.showPlaylistManager = window.SetInterval(pman.showPanel, 30);
					};
				};
			};
			if (this.drag_moving && !timers.hidePlaylistManager && !timers.showPlaylistManager) {
				pman.on_mouse("move", x, y);
			};
			if (cScrollBar.enabled && cScrollBar.visible) {
				this.scrollbar && this.scrollbar.on_mouse(event, x, y);
			};
			break;
		case "wheel":
			if (cScrollBar.enabled && cScrollBar.visible) {
				this.scrollbar.updateScrollbar();
			};
			break;
		case "leave":
			if (cScrollBar.enabled && cScrollBar.visible) {
				this.scrollbar && this.scrollbar.on_mouse(event, x, y);
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
			if (isNaN(scroll) || isNaN(scroll_)) {
				scroll = scroll_ = 0;
			};
			g_first_populate_launched = true;
			brw.launch_populate();
		};

		scroll = check_scroll(scroll);
		if (Math.abs(scroll - scroll_) >= 1) {
			scroll_ += (scroll - scroll_) / ppt.scrollSmoothness;
			isScrolling = true;
			need_repaint = true;
			if (scroll_prev != scroll)
				brw.scrollbar.updateScrollbar();
		} else {
			if (scroll_ != scroll) {
				scroll_ = scroll; // force to scroll_ value to fixe the 5.5 stop value for expanding album action
				need_repaint = true;
			};
			if (isScrolling) {
				if (scroll_ < 1)
					scroll_ = 0;
				isScrolling = false;
				need_repaint = true;
			};
		};

		if (need_repaint) {
			need_repaint = false;
			images.loading_angle = (images.loading_angle + 30) % 360;
			window.Repaint();
		};

		scroll_prev = scroll;

	}, ppt.refreshRate);

	this.item_context_menu = function (x, y, albumIndex) {
		var _menu = window.CreatePopupMenu();
		var Context = fb.CreateContextMenuManager();
		var _child01 = window.CreatePopupMenu();
		var _child02 = window.CreatePopupMenu();

		var crc = this.groups[albumIndex].cachekey;

		this.metadblist_selection = this.groups[albumIndex].pl.Clone();
		Context.InitContext(this.metadblist_selection);

		_menu.AppendMenuItem(MF_STRING, 1, "Settings...");
		_menu.AppendMenuSeparator();
		Context.BuildMenu(_menu, 2);

		_child01.AppendTo(_menu, MF_STRING, "Selection...");

		_child01.AppendMenuItem(MF_STRING, 1010, "Reset Image Cache");
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
		var _menu0 = window.CreatePopupMenu();
		var _menu1 = window.CreatePopupMenu();
		var _menu2 = window.CreatePopupMenu();
		var _menu3 = window.CreatePopupMenu();
		var idx;

		_menu0.AppendMenuItem(MF_STRING, 50, "Library");
		_menu0.AppendMenuItem(MF_STRING, 51, "Playlist");
		_menu0.CheckMenuRadioItem(50, 51, 50 + ppt.sourceMode);
		_menu0.AppendTo(_menu, MF_STRING, "Source");
		_menu.AppendMenuSeparator();

		_menu.AppendMenuItem((ppt.sourceMode == 1 ? MF_STRING : MF_GRAYED | MF_DISABLED), 60, "Cursor follows Focus");
		_menu.CheckMenuItem(60, ppt.followFocusChange);
		_menu.AppendMenuSeparator();

		_menu1.AppendMenuItem(MF_STRING, 111, "Album");
		_menu1.AppendMenuItem(MF_STRING, 112, "Artist");
		_menu1.AppendMenuItem(MF_STRING, 113, "Genre");
		_menu1.CheckMenuRadioItem(111, 113, 110 + ppt.tagMode);
		_menu1.AppendTo(_menu, MF_STRING, "Columns");

		_menu2.AppendMenuItem(MF_STRING, 900, "Column");
		_menu2.AppendMenuItem(MF_STRING, 901, "Album Art (bottom labels)");
		_menu2.AppendMenuItem(MF_STRING, 902, "Album Art (right labels)");
		_menu2.AppendMenuItem(MF_STRING, 903, "Album Art Grid");
		_menu2.CheckMenuRadioItem(900, 903, 900 + ppt.panelMode);
		_menu2.AppendMenuSeparator();
		_menu2.AppendMenuItem(MF_STRING, 904, "Auto-fill");
		_menu2.CheckMenuItem(904, ppt.autoFill);
		_menu2.AppendMenuSeparator();
		_menu2.AppendMenuItem(MF_STRING, 910, "Header Bar");
		_menu2.CheckMenuItem(910, ppt.showHeaderBar);
		_menu2.AppendMenuItem(MF_STRING, 911, "Aggregate Item");
		_menu2.CheckMenuItem(911, ppt.showAllItem);
		_menu2.AppendMenuSeparator();
		_menu2.AppendMenuItem(MF_STRING, 912, "Enable Disk Image Cache");
		_menu2.CheckMenuItem(912, ppt.enableDiskCache);
		_menu2.AppendTo(_menu, MF_STRING, "Display");

		_menu3.AppendMenuItem(MF_STRING, 200, "Enable");
		_menu3.CheckMenuItem(200, ppt.showwallpaper);
		_menu3.AppendMenuItem(MF_STRING, 220, "Blur");
		_menu3.CheckMenuItem(220, ppt.wallpaperblurred);
		_menu3.AppendMenuSeparator();
		_menu3.AppendMenuItem(MF_STRING, 210, "Playing Album Cover");
		_menu3.AppendMenuItem(MF_STRING, 211, "Default");
		_menu3.CheckMenuRadioItem(210, 211, ppt.wallpapermode + 210);

		_menu3.AppendTo(_menu, MF_STRING, "Background Wallpaper");

		//_menu.AppendMenuSeparator();
		//_menu.AppendMenuItem(MF_STRING, 990, "Reload Library");
		_menu.AppendMenuSeparator();
		_menu.AppendMenuItem(MF_STRING, 991, "Panel Properties");
		_menu.AppendMenuItem(MF_STRING, 992, "Configure...");

		idx = _menu.TrackPopupMenu(x, y);

		switch (true) {
		case (idx >= 50 && idx <= 51):
			ppt.sourceMode = idx - 50;
			window.SetProperty("_PROPERTY: Source Mode", ppt.sourceMode);
			window.Reload();
			break;
		case (idx == 60):
			ppt.followFocusChange = !ppt.followFocusChange;
			window.SetProperty("_PROPERTY: Follow focus change", ppt.followFocusChange);
			break;
		case (idx >= 111 && idx <= 113):
			ppt.tagMode = idx - 110;
			window.SetProperty("_PROPERTY: Tag Mode", ppt.tagMode);
			g_image_cache = new image_cache;
			brw.populate(true);
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
		case (idx >= 900 && idx <= 903):
			ppt.panelMode = idx - 900;
			window.SetProperty("_PROPERTY: Display Mode", ppt.panelMode);
			g_image_cache = new image_cache;
			get_metrics();
			brw.setList();
			brw.update();
			break;
		case (idx == 904):
			ppt.autoFill = !ppt.autoFill;
			window.SetProperty("_DISPLAY: Auto-fill", ppt.autoFill);
			window.Reload();
			break;
		case (idx == 910):
			ppt.showHeaderBar = !ppt.showHeaderBar;
			window.SetProperty("_DISPLAY: Show Top Bar", ppt.showHeaderBar);
			get_metrics();
			break;
		case (idx == 911):
			ppt.showAllItem = !ppt.showAllItem;
			window.SetProperty("_PROPERTY: Show ALL item", ppt.showAllItem);
			brw.populate(false);
			break;
		case (idx == 912):
			ppt.enableDiskCache = !ppt.enableDiskCache;
			window.SetProperty("SYSTEM Disk Cache", ppt.enableDiskCache);
			window.Reload();
			break;
		case (idx == 990):
			brw.populate(true);
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
		var groupkey;
		var chr;
		var gstart;
		var pid = -1;

		// exit if no search string in cache
		if (cList.search_string.length <= 0)
			return true;

		var total = this.groups.length;

		// 1st char of the search string
		var first_chr = cList.search_string.substring(0, 1);
		var len = cList.search_string.length;

		// which start point for the search
		if (total > 1000) {
			groupkey = this.groups[Math.floor(total / 2)].groupkey;
			chr = groupkey.substring(0, 1);
			if (first_chr.charCodeAt(first_chr) > chr.charCodeAt(chr)) {
				gstart = Math.floor(total / 2);
			} else {
				gstart = (ppt.showAllItem ? 1 : 0);
			};
		} else {
			gstart = (ppt.showAllItem ? 1 : 0);
		};

		var format_str = "";
		for (var i = gstart; i < total; i++) {
			groupkey = this.groups[i].groupkey;
			if (len <= groupkey.length) {
				format_str = groupkey.substring(0, len).toUpperCase();
			} else {
				format_str = groupkey;
			};
			if (format_str == cList.search_string) {
				pid = i;
				break;
			};
		};

		if (pid >= 0) { // found
			g_focus_id = pid;
			plman.ClearPlaylistSelection(g_active_playlist);
			plman.SetPlaylistSelectionSingle(g_active_playlist, g_focus_id, true);
			plman.SetPlaylistFocusItem(g_active_playlist, g_focus_id);
			this.showItemFromItemIndex(g_focus_id);
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

var gtt = fb.CreateProfiler();
var g_dnd_handles = null;
var g_dnd_status = false;

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

//
var ww = 0, wh = 0;
var g_metadb = null;
clipboard = {
	selection: null
};

var m_x = 0, m_y = 0;
var g_active_playlist = null;
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
var g_avoid_on_playlist_switch_callbacks_on_sendItemToPlaylist = false;
var g_avoid_on_playlist_items_reordered = false;
//
var g_total_duration_text = "";
var g_first_populate_done = false;
var g_first_populate_launched = false;

var scroll_ = 0, scroll = 0, scroll_prev = 0;
var g_start_ = 0, g_end_ = 0;
var g_wallpaperImg = null;

var g_rightClickedIndex = -1;

function on_init() {
	window.DlgCode = DLGC_WANTALLKEYS;

	get_font();
	get_colors();
	get_metrics();

	g_active_playlist = plman.ActivePlaylist;

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

	// set Size of browser
	if (cScrollBar.enabled) {
		brw.setSize(0, (ppt.showHeaderBar ? ppt.headerBarHeight : 0), ww - cScrollBar.width, wh - (ppt.showHeaderBar ? ppt.headerBarHeight : 0));
	} else {
		brw.setSize(0, (ppt.showHeaderBar ? ppt.headerBarHeight : 0), ww, wh - (ppt.showHeaderBar ? ppt.headerBarHeight : 0));
	};

	//get_images();
};

function on_paint(gr) {
	if (ww < 10 || wh < 10)
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
		if (cFilterBox.enabled && g_filterbox) {
			if (g_filterbox.inputbox.visible) {
				g_filterbox.draw(gr, 5, 2);
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
	if (ppt.showHeaderBar && cFilterBox.enabled && g_filterbox.inputbox.visible) {
		g_filterbox.on_mouse("lbtn_down", x, y);
	};
};

function on_mouse_lbtn_up(x, y) {

	// inputBox
	if (ppt.showHeaderBar && cFilterBox.enabled && g_filterbox.inputbox.visible) {
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
		if (Math.abs(cTouch.scroll_delta) > 015) {
			cTouch.multiplier = ((1000 - cTouch.t1.Time) / 20);
			cTouch.delta = Math.round((cTouch.scroll_delta) / 015);
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
		brw.showNowPlaying();
	} else {
		brw.on_mouse("dblclk", x, y);
	};
};

function on_mouse_rbtn_up(x, y) {
	if (ppt.showHeaderBar && cFilterBox.enabled && g_filterbox.inputbox.visible) {
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
	if (ppt.showHeaderBar && cFilterBox.enabled && g_filterbox.inputbox.visible) {
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
		switch (ppt.panelMode) {
		case 1:
		case 3:
			var zoomStep = Math.round(ppt.thumbnailWidthMin / 3);
			var previous = ppt.default_thumbnailWidthMin;
			if (!timers.mouseWheel) {
				ppt.default_thumbnailWidthMin += step * zoomStep;
				if (ppt.default_thumbnailWidthMin < 130)
					ppt.default_thumbnailWidthMin = 130;
				if (ppt.default_thumbnailWidthMin > 250)
					ppt.default_thumbnailWidthMin = 250;
				if (previous != ppt.default_thumbnailWidthMin) {
					timers.mouseWheel = window.SetTimeout(function () {
							window.SetProperty("SYSTEM thumbnails Minimal Width", ppt.default_thumbnailWidthMin);
							g_image_cache = new image_cache;
							get_metrics();
							brw.setList();
							brw.update();
							timers.mouseWheel && window.ClearTimeout(timers.mouseWheel);
							timers.mouseWheel = false;
						}, 100);
				};
			};
			break;
		case 0:
		case 2:
			var zoomStep = Math.round(ppt.lineHeightMin / 3);
			var previous = ppt.default_lineHeightMin;
			if (!timers.mouseWheel) {
				ppt.default_lineHeightMin += step * zoomStep;
				if (ppt.panelMode == 0) {
					if (ppt.default_lineHeightMin < g_fsize * 3)
						ppt.default_lineHeightMin = g_fsize * 3;
					if (ppt.default_lineHeightMin > g_fsize * 10)
						ppt.default_lineHeightMin = g_fsize * 10;
				} else {
					if (ppt.default_lineHeightMin < g_fsize * 5)
						ppt.default_lineHeightMin = g_fsize * 5;
					if (ppt.default_lineHeightMin > g_fsize * 20)
						ppt.default_lineHeightMin = g_fsize * 20;
				};
				if (previous != ppt.default_lineHeightMin) {
					timers.mouseWheel = window.SetTimeout(function () {
							window.SetProperty("SYSTEM Minimal Line Height", ppt.default_lineHeightMin);
							g_image_cache = new image_cache;
							get_metrics();
							brw.setList();
							brw.update();
							timers.mouseWheel && window.ClearTimeout(timers.mouseWheel);
							timers.mouseWheel = false;
						}, 100);
				};
			};
			break;
		};
	} else {
		if (utils.IsKeyPressed(VK_CONTROL)) { // zoom all elements)
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
			if (pman.state == 1) {
				if (pman.scr_w > 0)
					pman.on_mouse("wheel", m_x, m_y, step);
			} else {
				scroll -= step * (brw.rowHeight / ppt.scrollRowDivider * ppt.rowScrollStep);
				scroll = check_scroll(scroll)
					brw.on_mouse("wheel", m_x, m_y, step);
			};
		};
	};
};

function on_mouse_leave() {
	// inputBox
	if (ppt.showHeaderBar && cFilterBox.enabled && g_filterbox.inputbox.visible) {
		g_filterbox.on_mouse("leave", 0, 0);
	};
	brw.on_mouse("leave", 0, 0);

	if (pman.state == 1) {
		pman.on_mouse("leave", 0, 0);
	};
};

//=================================================// Metrics & Fonts & Colors & Images
function get_metrics() {

	// scroll step
	switch (ppt.panelMode) {
	case 0:
	case 2:
		ppt.rowScrollStep = 3;
		break;
	case 1:
	case 3:
		ppt.rowScrollStep = 1;
		break;
	};

	cPlaylistManager.width = Math.floor(cPlaylistManager.default_width * g_zoom_percent / 100);
	cPlaylistManager.topbarHeight = Math.floor(cPlaylistManager.default_topbarHeight * g_zoom_percent / 100);
	cPlaylistManager.botbarHeight = Math.floor(cPlaylistManager.default_botbarHeight * g_zoom_percent / 100);
	cPlaylistManager.rowHeight = Math.floor(cPlaylistManager.default_rowHeight * g_zoom_percent / 100);
	cPlaylistManager.scrollbarWidth = Math.floor(cPlaylistManager.default_scrollbarWidth * g_zoom_percent / 100);

	ppt.thumbnailWidthMin = Math.floor(ppt.default_thumbnailWidthMin * g_zoom_percent / 100);
	ppt.lineHeightMin = Math.floor(ppt.default_lineHeightMin * g_zoom_percent / 100);
	ppt.botStampHeight = Math.floor(ppt.default_botStampHeight * g_zoom_percent / 100);
	ppt.botGridHeight = Math.floor(ppt.default_botGridHeight * g_zoom_percent / 100);
	ppt.botTextRowHeight = Math.floor(ppt.default_botTextRowHeight * g_zoom_percent / 100); // panelMode 1 || 3
	ppt.textLineHeight = Math.floor(ppt.default_textLineHeight * g_zoom_percent / 100); // panelMode 0 || 2


	if (ppt.showHeaderBar) {
		ppt.headerBarHeight = Math.round(ppt.defaultHeaderBarHeight * g_zoom_percent / 100);
		ppt.headerBarHeight = Math.floor(ppt.headerBarHeight / 2) != ppt.headerBarHeight / 2 ? ppt.headerBarHeight : ppt.headerBarHeight - 1;
	} else {
		ppt.headerBarHeight = 0;
	};
	cScrollBar.width = Math.floor(cScrollBar.defaultWidth * g_zoom_percent / 100);
	cScrollBar.minCursorHeight = Math.round(cScrollBar.defaultMinCursorHeight * g_zoom_percent / 100);

	cFilterBox.w = Math.floor(cFilterBox.default_w * g_zoom_percent / 100);
	cFilterBox.h = Math.round(cFilterBox.default_h * g_zoom_percent / 100);

	if (brw) {
		brw.setSize(0, ppt.headerBarHeight, ww - cScrollBar.width, wh - ppt.headerBarHeight);
	};

	if (brw) {
		if (cScrollBar.enabled) {
			brw.setSize(0, (ppt.showHeaderBar ? ppt.headerBarHeight : 0), ww - cScrollBar.width, wh - (ppt.showHeaderBar ? ppt.headerBarHeight : 0));
		} else {
			brw.setSize(0, (ppt.showHeaderBar ? ppt.headerBarHeight : 0), ww, wh - (ppt.showHeaderBar ? ppt.headerBarHeight : 0));
		};
	};
};

function get_images() {
	var gb;
	var txt = "";

	// PLAY icon
	images.play_on = gdi.CreateImage(70, 70);
	gb = images.play_on.GetGraphics();
	DrawPolyStar(gb, 12 - 2, 12, 46, 1, 3, 2, g_color_normal_bg, g_color_normal_txt, 90, 255);
	images.play_on.ReleaseGraphics(gb);

	images.play_off = gdi.CreateImage(70, 70);
	gb = images.play_off.GetGraphics();
	DrawPolyStar(gb, 16 - 2, 16, 38, 1, 3, 2, g_color_normal_bg, g_color_normal_txt, 90, 255);
	images.play_off.ReleaseGraphics(gb);

	images.all = gdi.CreateImage(150, 150);
	gb = images.all.GetGraphics();
	gb.FillSolidRect(0, 0, 150, 150, g_color_normal_txt & 0x10ffffff);
	images.all.ReleaseGraphics(gb);

	var img_loading = gdi.Image(images.path + "load.png");
	var iw = Math.round(ppt.rowHeight / 2);
	images.loading_draw = img_loading.Resize(iw, iw, 7);

	var nw = 250,
	nh = 250;
	txt = (ppt.tagMode == 1 ? "NO\nCOVER" : "NO ART");
	images.noart = gdi.CreateImage(nw, nh);
	gb = images.noart.GetGraphics();
	// draw no cover art image
	gb.FillSolidRect(0, 0, nw, nh, g_color_normal_txt & 0x10ffffff);
	gb.SetTextRenderingHint(4);
	gb.DrawString(txt, gdi.Font(g_fname, Math.round(nh / 12 * 2), 1), blendColors(g_color_normal_txt, g_color_normal_bg, 0.2), 1, 1, nw, nh, cc_stringformat);
	images.noart.ReleaseGraphics(gb);

	var sw = 250,
	sh = 250;
	txt = "STREAM";
	images.stream = gdi.CreateImage(sw, sh);
	gb = images.stream.GetGraphics();
	// draw stream art image
	gb.FillSolidRect(0, 0, sw, sh, g_color_normal_txt & 0x10ffffff);
	gb.SetTextRenderingHint(4);
	gb.DrawString(txt, gdi.Font(g_fname, Math.round(sh / 12 * 2), 1), blendColors(g_color_normal_txt, g_color_normal_bg, 0.2), 1, 1, sw, sh, cc_stringformat);
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

	if (g_font_guifx_found) {
		g_font_rating = gdi.Font("guifx v2 transports", (g_fsize * 140 / 100), 0);
		g_font_mood = gdi.Font("guifx v2 transports", (g_fsize * 130 / 100), 0);
	} else if (g_font_wingdings2_found) {
		g_font_rating = gdi.Font("wingdings 2", (g_fsize * 140 / 100), 0);
		g_font_mood = gdi.Font("wingdings 2", (g_fsize * 200 / 100), 0);
	} else {
		g_font_rating = gdi.Font("arial", (g_fsize * 140 / 100), 0);
		g_font_mood = gdi.Font("arial", (g_fsize * 140 / 100), 0);
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
		if (ppt.showHeaderBar && cFilterBox.enabled && g_filterbox.inputbox.visible) {
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
		//if(dragndrop.drag_in) return true;

		// inputBox
		if (ppt.showHeaderBar && cFilterBox.enabled && g_filterbox.inputbox.visible) {
			g_filterbox.on_key("down", vkey);
		};

		var act_pls = g_active_playlist;

		if (mask == KMask.none) {
			switch (vkey) {
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
				};
				break;
			case VK_DOWN:
				if (brw.rowsCount > 0 && !brw.keypressed && !cScrollBar.timerID) {
					brw.keypressed = true;
					reset_cover_timers();
				};
				break;
			case VK_PGUP:
				if (brw.rowsCount > 0 && !brw.keypressed && !cScrollBar.timerID) {
					brw.keypressed = true;
					reset_cover_timers();
				};
				break;
			case VK_PGDN:
				if (brw.rowsCount > 0 && !brw.keypressed && !cScrollBar.timerID) {
					brw.keypressed = true;
					reset_cover_timers();
				};
				break;
			case VK_END:
				if (brw.rowsCount > 0) {};
				break;
			case VK_HOME:
				if (brw.rowsCount > 0) {};
				break;
			case VK_DELETE:
				if (!plman.IsAutoPlaylist(act_pls)) {};
				break;
			};
		} else {
			switch (mask) {
			case KMask.shift:
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
	if (ppt.showHeaderBar && cFilterBox.enabled && g_filterbox.inputbox.visible) {
		g_filterbox.on_char(code);
	};

	if (!cSettings.visible) {
		if (ppt.sourceMode == 1) return; // doesn't work on playlist mode
		if (brw.list.Count > 0) {
			brw.tt_x = ((brw.w) / 2) - (((cList.search_string.length * 13) + (10 * 2)) / 2);
			brw.tt_y = brw.y + Math.floor((brw.h / 2) - 30);
			brw.tt_w = ((cList.search_string.length * 13) + (10 * 2));
			brw.tt_h = 60;
			if (code == 32 && cList.search_string.length == 0)
				return; // SPACE Char not allowed on 1st char
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
};

function on_playback_new_track(metadb) {
	g_metadb = metadb;
	g_wallpaperImg = setWallpaperImg();
	brw.repaint();
};

function on_playback_starting(cmd, is_paused) {};

function on_playback_time(time) {
	g_seconds = time;
	g_time_remaining = ppt.tf_time_remaining.Eval(true);
};

//=================================================// Library Callbacks
function on_library_items_added() {
	brw.populate(false);
};

function on_library_items_removed() {
	brw.populate(false);
};

function on_library_items_changed() {
	brw.populate(false);
};

//=================================================// Playlist Callbacks
function on_playlists_changed() {

	//g_avoid_on_playlist_switch = true;
	if (g_active_playlist != plman.ActivePlaylist) {
		g_active_playlist = plman.ActivePlaylist;
	};

	// refresh playlists list
	pman.populate(false, false);
};

function on_playlist_switch() {

	if (g_avoid_on_playlist_switch_callbacks_on_sendItemToPlaylist) {
		if (timers.avoidPlaylistSwitch)
			window.ClearTimeout(timers.avoidPlaylistSwitch);
		timers.avoidPlaylistSwitch = window.SetTimeout(function () {
				g_avoid_on_playlist_switch_callbacks_on_sendItemToPlaylist = false; // when avoid set in playlists_changed afeter a send to a new playlist action in JSSP
				window.ClearTimeout(timers.avoidPlaylistSwitch);
				timers.avoidPlaylistSwitch = false;
			}, 500);
		return;
	};

	g_active_playlist = plman.ActivePlaylist;
	if (ppt.sourceMode == 1) {
		scroll = scroll_ = 0;
		brw.populate(true);
	};

	// refresh playlists list
	pman.populate(false, false);
};

function on_playlist_items_added(playlist_idx) {

	if (g_avoid_on_playlist_switch_callbacks_on_sendItemToPlaylist)
		return;

	g_avoid_on_playlist_items_removed = false;

	if (ppt.sourceMode == 1) {
		if (playlist_idx == g_active_playlist) {
			brw.populate(false);
		};
	};
};

function on_playlist_items_removed(playlist_idx, new_count) {

	if (g_avoid_on_playlist_items_removed)
		return;

	if (playlist_idx == g_active_playlist && new_count == 0)
		scroll = scroll_ = 0;

	if (ppt.sourceMode == 1) {
		if (playlist_idx == g_active_playlist) {
			brw.populate(true);
		};
	};
};

function on_playlist_items_reordered(playlist_idx) {
	if (ppt.sourceMode == 1) {
		if (playlist_idx == g_active_playlist) {
			brw.populate(true);
		};
	};
};

function on_item_focus_change(playlist_idx, from, to) {

	if (g_avoid_on_item_focus_change) {
		g_avoid_on_item_focus_change = false;
		return;
	};

	if (brw.list && ppt.sourceMode == 1) {
		if (playlist_idx == g_active_playlist) {
			if (ppt.followFocusChange) {
				if (to > -1 && to < brw.list.Count) {
					var gid = brw.getItemIndexFromTrackIndex(to);
					if (gid > -1) {
						brw.showItemFromItemIndex(gid);
					};
				};
			};
		};
	};

};

function on_metadb_changed() {
	// rebuild list
	if (ppt.sourceMode == 1) {
		if (filter_text.length > 0) {
			brw.populate(true);
		} else {
			brw.populate(false);
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
	if (!is_focused) {
		brw.repaint();
	};
};

function check_scroll(scroll___) {
	if (scroll___ < 0)
		scroll___ = 0;
	var g1 = brw.h - (brw.totalRowsVis * ppt.rowHeight);
	//var scroll_step = Math.ceil(ppt.rowHeight / ppt.scrollRowDivider);
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
};

function on_notify_data(name, info) {
	switch (name) {
	case "JSSmoothPlaylist->JSSmoothBrowser:avoid_on_playlist_switch_callbacks_on_sendItemToPlaylist":
		g_avoid_on_playlist_switch_callbacks_on_sendItemToPlaylist = true;
		break;
	case "JSSmoothPlaylist->JSSmoothBrowser:show_item":
		brw.showItemFromItemHandle(info);
		break;
	};
};

function save_image_to_cache(metadb, albumIndex) {
	var crc = brw.groups[albumIndex].cachekey;
	if (fso.FileExists(CACHE_FOLDER + crc))
		return;

	switch (ppt.tagMode) {
	case 1:
		var path = ppt.tf_path.EvalWithMetadb(metadb);
		var path_ = getpath_(path);
		break;
	case 2:
		var path_ = ppt.tf_path_artist.EvalWithMetadb(metadb);
		break;
	case 3:
		var path_ = ppt.tf_path_genre.EvalWithMetadb(metadb);
		break;
	};

	if (path_) {
		resize(path_, crc);
	}
};

on_load();
