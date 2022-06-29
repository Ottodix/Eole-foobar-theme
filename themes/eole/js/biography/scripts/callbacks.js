'use strict';

var show_lyrics_btns = window.GetProperty("show lyrics btns", false);
var ww = 0,
	wh = 0;
		
function on_colours_changed() {
	ui.getColours();
	if (panel.id.lyricsSource) lyrics.setCol();
	alb_scrollbar.setCol();
	art_scrollbar.setCol();
	img.createImages();
	filmStrip.logScrollPos();
	filmStrip.clearCache();
	filmStrip.createBorder();
	but.createImages('all');
	but.refresh(true);
	alb_scrollbar.resetAuto();
	art_scrollbar.resetAuto();
	if (ui.font.heading && ui.font.heading.Size) but.createStars();
	img.clearCache();
	img.getImages();
	txt.rev.cur = '';
	txt.bio.cur = '';
	txt.albCalc();
	txt.artCalc();
	txt.paint();
}

function on_font_changed() {
	ui.getFont();
	alb_scrollbar.reset();
	art_scrollbar.reset();
	alb_scrollbar.resetAuto();
	art_scrollbar.resetAuto();
	txt.on_size();
	img.on_size();
	window.Repaint();
}

function on_focus(is_focused) {
	resize.focus = is_focused;
}

function on_get_album_art_done(handle, art_id, image, image_path) {
	img.on_get_album_art_done(handle, art_id, image, image_path);
}

function on_item_focus_change() {
	if (!ppt.panelActive) return;
	if (fb.IsPlaying && !panel.id.focus) return;
	txt.notifyTags();
	if (panel.id.lookUp) panel.getList(true, true);
	else if (!panel.updateNeeded()) return;
	if (panel.block() && !$.server) {
		img.get = true;
		txt.get = panel.id.focus ? 2 : 1;
		img.artistReset();
		txt.albumReset();
		txt.artistReset();
	} else {
		if (panel.block() && $.server) {
			img.get = true;
			txt.get = 1;
			img.artistReset();
			txt.albumReset();
			txt.artistReset();
		} else {
			img.get = false;
			txt.get = 0;
		}
		panel.focusLoad();
		panel.focusServer();
	}
}

function on_key_down(vkey) {
	switch (vkey) {
		case VK_ESCAPE: if(g_uihacks.getFullscreenState()) g_uihacks.toggleFullscreen(); break; 
		case 0x10:
		case 0x11:
		case 0x12:
			window.Repaint();
			break;
		case 0x21:
			if (panel.trace.text) {
				if (!txt.lyricsDisplayed()) txt.scrollbar_type().pageThrottle(1);
			} else if (panel.trace.film) filmStrip.scrollerType().pageThrottle(1);
			break;
		case 0x22:
			if (panel.trace.text) {
				if (!txt.lyricsDisplayed()) txt.scrollbar_type().pageThrottle(-1);
			} else if (panel.trace.film) filmStrip.scrollerType().pageThrottle(-1);
			break;
		case 35:
			if (panel.trace.text) {
				if (!txt.lyricsDisplayed()) txt.scrollbar_type().scrollToEnd();
			} else if (panel.trace.film) filmStrip.scrollerType().scrollToEnd();
			break;
		case 36:
			if (panel.trace.text) {
				if (!txt.lyricsDisplayed()) txt.scrollbar_type().checkScroll(0, 'full');
			} else if (panel.trace.film) filmStrip.scrollerType().checkScroll(0, 'full');
			break;
		case 37:
		case 38:
			if (panel.imgBoxTrace(panel.m.x, panel.m.y)) img.wheel(1);
			else if (panel.trace.film) filmStrip.scrollerType().wheel(1);
			break;
		case 39:
		case 40:
			if (panel.imgBoxTrace(panel.m.x, panel.m.y)) img.wheel(-1);
			else if (panel.trace.film) filmStrip.scrollerType().wheel(-1);
			break;
	}
}

function on_key_up(vkey) {
	if (vkey == 0x10 || vkey == 0x11 || vkey == 0x12) window.Repaint();
}

function on_library_items_added() {
	if (!ppt.panelActive) return;
	if (!lib) return;
	lib.update = true;
}

function on_library_items_removed() {
	if (!ppt.panelActive) return;
	if (!lib) return;
	lib.update = true;
}

function on_library_items_changed() {
	if (!ppt.panelActive) return;
	if (!lib) return;
	lib.update = true;
}

function on_load_image_done(task_id, image, image_path) {
	img.on_load_image_done(image, image_path);
	filmStrip.on_load_image_done(image, image_path);
}

function on_metadb_changed() {
	if (!ppt.panelActive) return;
	if (panel.isRadio(panel.id.focus) || panel.block() && !$.server || !panel.updateNeeded() || txt.lyricsDisplayed()) return;
	panel.getList(true, true);
	panel.focusLoad();
	panel.focusServer();
}

function on_mouse_lbtn_dblclk(x, y) {
	if (!ppt.panelActive) return;
	but.lbtn_dn(x, y);
	if (!txt.lyricsDisplayed()) txt.scrollbar_type().lbtn_dblclk(x, y);
	if (!ppt.dblClickToggle) return;
	if (ppt.touchControl) panel.id.last_pressed_coord = {
		x: x,
		y: y
	};
	if (!panel.trace.film) panel.click(x, y);
	else filmStrip.lbtn_dblclk(x, y);
}

function on_mouse_lbtn_down(x, y) {
	if(g_cursor.x!=x || g_cursor.y!=y) on_mouse_move(x,y);		
	var hover_btn = btns_manager.on_mouse("lbtn_down",x, y);
	if(!hover_btn){
		if (!ppt.panelActive) return;
		if (ppt.touchControl) panel.id.last_pressed_coord = {
			x: x,
			y: y
		};
		resize.lbtn_dn(x, y);
		but.lbtn_dn(x, y);
		if (!txt.lyricsDisplayed()) txt.scrollbar_type().lbtn_dn(x, y);
		filmStrip.scrollerType().lbtn_dn(x, y);
		seeker.lbtn_dn(x, y);
		img.lbtn_dn(x);
	}	
}

function on_mouse_lbtn_up(x, y) {
	var down_btn = btns_manager.on_mouse("lbtn_up",x, y);
	if(!down_btn){	
		if (!ppt.panelActive) {panel.inactivate(); return;}
		alb_scrollbar.lbtn_drag_up();
		art_scrollbar.lbtn_drag_up();
		art_scroller.lbtn_drag_up();
		cov_scroller.lbtn_drag_up();
		if (!ppt.dblClickToggle && !but.Dn && !seeker.dn && !panel.trace.film) panel.click(x, y);
		if (!txt.lyricsDisplayed()) txt.scrollbar_type().lbtn_up();
		panel.clicked = false;
		resize.lbtn_up();
		but.lbtn_up(x, y);
		filmStrip.lbtn_up(x, y);
		img.lbtn_up();
		seeker.lbtn_up();
	}	
}

function on_mouse_leave() {
	if (!ppt.panelActive) return;
	panel.leave();
	but.leave();
	alb_scrollbar.leave();
	art_scrollbar.leave();
	art_scroller.leave();
	cov_scroller.leave();
	img.leave();
	filmStrip.leave();
	panel.m.y = -1;
	btns_manager.on_mouse("leave");
	g_cursor.x = 0;
    g_cursor.y = 0;		
}

function on_mouse_mbtn_up(x, y, mask) {
	switch (true) {
		case mask == 0x0004:
			panel.inactivate();
			break;
		case utils.IsKeyPressed(0x12):
			filmStrip.mbtn_up('onOff');
			break;
		case panel.trace.film && !but.trace('lookUp', x, y):
			filmStrip.mbtn_up('showCurrent');
			break;
		case ppt.panelActive:
			panel.mbtn_up(x, y);
			break;
	}
}

function on_mouse_move(x, y, m) {
    if(x == g_cursor.x && y == g_cursor.y) return;
	g_cursor.onMouse("move", x, y, m);	  	
	if (!ppt.panelActive) return;
	if (panel.m.x == x && panel.m.y == y) return;
	panel.move(x, y);
	but.move(x, y);
	if (!txt.lyricsDisplayed()) txt.scrollbar_type().move(x, y);
	filmStrip.scrollerType().move(x, y);
	resize.imgMove(x, y);
	resize.move(x, y);
	resize.filmMove(x, y);
	seeker.move(x, y);
	img.move(x, y);
	filmStrip.move(x, y);
	panel.m.x = x;
	panel.m.y = y;
	btns_manager.on_mouse("move",x, y);	
}

function on_mouse_rbtn_up(x, y) {
	men.rbtn_up(x, y);
	return true;
}

function on_mouse_wheel(step) {
	if (!ppt.panelActive) return;
	switch (panel.zoom()) {
		case false:
			switch (true) {
				case but.trace('lookUp', panel.m.x, panel.m.y):
					men.wheel(step, true);
					break;
				case panel.trace.film:
					filmStrip.scrollerType().wheel(step, false);
					break;
				case panel.trace.text:
					if (!txt.lyricsDisplayed()) txt.scrollbar_type().wheel(step, false);
					else if (panel.id.lyricsSource) lyrics.on_mouse_wheel(step);
					break;
				default:
					img.wheel(step);
					break;
			}
			break;
		case true:
			ui.wheel(step);
			if (vk.k('ctrl')) but.wheel(step);
			if (vk.k('shift')) {
				img.wheel(step);
				if (but.trace('lookUp', panel.m.x, panel.m.y)) men.wheel(step, true);
			}
			break;
	}
}

function on_notify_data(name, info) {
	let clone;
	if (ui.id.local) {
		clone = typeof info === 'string' ? String(info) : info;
		on_cui_notify(name, clone);
	}
	switch (name) {
		case 'show_lyrics_btns':
			show_lyrics_btns = info;
			window.SetProperty("show lyrics btns", show_lyrics_btns);
			window.Repaint();
			break;	
		case "lyrics_state": lyrics_state.value = info; positionButtons(); break;		
		case 'bio_chkTrackRev':
			if (!$.server && ppt.showTrackRevOptions) {
				clone = JSON.parse(JSON.stringify(info));
				clone.inclTrackRev = true;
				window.NotifyOthers('bio_isTrackRev', clone);
			}
			break;
		case 'bio_isTrackRev':
			if ($.server && info.inclTrackRev == true) {
				clone = JSON.parse(JSON.stringify(info));
				server.getTrack(clone);
			}
			break;
		case 'bio_imgChange':
			img.fresh();
			men.fresh();
			break;
		case 'bio_checkImgArr':
			clone = JSON.parse(JSON.stringify(info));
			img.checkArr(clone);
			break;
		case 'bio_checkNumServers':
			window.NotifyOthers('bio_serverName', ppt.serverName);
			break;
		case 'bio_serverName':
			if (info != ppt.serverName) ppt.multiServer = true;
			break;
		case 'bio_customStyle':
			clone = String(info);
			panel.on_notify(clone);
			break;
		case 'bio_forceUpdate':
			if ($.server) {
				clone = JSON.parse(JSON.stringify(info));
				server.download(1, clone[0], clone[1]);
			}
			break;
		case 'bio_getLookUpList':
			panel.getList('', true);
			break;
		case 'bio_getRevImg':
			if ($.server) {
				clone = JSON.parse(JSON.stringify(info));
				server.getRevImg(clone[0], clone[1], clone[2], clone[3], false);
			}
			break;
		case 'bio_getImg':
			img.grab(info ? true : false);
			break;
		case 'bio_getText':
			txt.grab();
			break;
		case 'bio_lookUpItem':
			if ($.server) {
				clone = JSON.parse(JSON.stringify(info));
				server.download(false, clone[0], clone[1], name);
			}
			break;
		case `bio_newCfg${ppt.serverName}`:
			cfg.updateCfg($.jsonParse(info, {}));
			break;
		case `bio_notServer${ppt.serverName}`: {
			const recTimestamp = info;
			if (recTimestamp >= panel.notifyTimestamp) {
				$.server = false;
				timer.clear(timer.img);
				timer.clear(timer.zSearch);
			}
			break;
		}
		case 'bio_blacklist':
			img.blackList.artist = '';
			img.check();
			break;
		case `bio_scriptUnload${ppt.serverName}`:
			$.server = true;
			panel.notifyTimestamp = Date.now();
			window.NotifyOthers(`bio_notServer${ppt.serverName}`, panel.notifyTimestamp);
			break;
		case 'bio_checkTimerSync':
			timer.image()
			break;
		case 'bio_refresh':
			window.Reload();
			break;
		case 'bio_reload':
			if (panel.stndItem()) window.Reload();
			else {
				txt.artistFlush();
				txt.albumFlush();
				txt.grab();
				if (ppt.text_only) txt.paint();
			}
			break;
		case 'bio_followSelectedTrack':
			if (!panel.id.lyricsSource) { // if there is a lyricsSource enabled, panel has to be in prefer nowplaying mode
				if (panel.id.focus !== info) {
					panel.id.focus = ppt.focus = info;
					panel.changed();
					txt.on_playback_new_track();
					img.on_playback_new_track();
				}
			}
			break;
		case 'bio_status':
			ppt.panelActive = info;
			window.Reload();
			break;
		case 'bio_webRequest':
			clone = String(info);
			server.urlRequested[info] = Date.now(); // if multiServer enabled, limit URL requests for same item to one
			break;
	}
}

function on_paint(gr) {
	if (ui.pss.checkOnSize) on_size();
	ui.draw(gr);
	if (!ppt.panelActive) {
		panel.draw(gr);
		return;
	}
	img.draw(gr);
	seeker.draw(gr);
	txt.draw(gr);
	if (panel.id.lyricsSource) lyrics.draw(gr);
	filmStrip.draw(gr);
	but.draw(gr);
	resize.drawEd(gr);
	ui.lines(gr);
	if(show_lyrics_btns) btns_manager.draw(gr);			
}

function on_playback_dynamic_info_track() {
	if (!ppt.panelActive) return;
	txt.rev.amFallback = true;
	txt.rev.wikiFallback = true;
	if ($.server) server.downloadDynamic();
	txt.reader.lyrics3Saved = false;
	txt.reader.openLyricsSaved = false;
	txt.reader.trackStartTime = fb.PlaybackTime;
	txt.on_playback_new_track();
	img.on_playback_new_track();
}

function on_playback_new_track() {
	if (!ppt.panelActive) return;
	if ($.server) server.on_playback_new_track();
	if (panel.id.focus) return;
	txt.rev.amFallback = true;
	txt.rev.wikiFallback = true;
	txt.reader.lyrics3Saved = false;
	txt.reader.openLyricsSaved = false;
	txt.reader.trackStartTime = 0;
	txt.on_playback_new_track();
	img.on_playback_new_track();
}

function on_playback_pause(state) {
	if (panel.id.lyricsSource) lyrics.on_playback_pause(state);
}

function on_playback_seek() {
	if (panel.id.lyricsSource) lyrics.seek();
}

function on_playback_stop(reason) {
	if (!ppt.panelActive) return;
	const n = ppt.artistView ? 'bio' : 'rev';
    if (reason != 2 && txt[n].loaded.txt && txt.reader.lyrics) txt.getText();
	if (panel.id.lyricsSource) lyrics.clear();
	if (reason == 2) return;
	on_item_focus_change();
}

function on_playlist_items_added() {
	if (!ppt.panelActive) return;
	on_item_focus_change();
}

function on_playlist_items_removed() {
	if (!ppt.panelActive) return;
	on_item_focus_change();
}

function on_playlist_switch() {
	if (!ppt.panelActive) return;
	on_item_focus_change();
}

function on_playlists_changed() {
	if (!ppt.panelActive) return;
	men.playlists_changed();
}

function on_script_unload() {
	if ($.server) {
		window.NotifyOthers(`bio_scriptUnload${ppt.serverName}`, 0);
		timer.clear(timer.img);
	}
	but.on_script_unload();
}

function on_size() {
	ww = window.Width;
	wh = window.Height;
	txt.repaint = false;
	panel.w = window.Width;
	panel.h = window.Height;
	if (!window.IsVisible && ui.pss.installed) {
		ui.pss.checkOnSize = true;
		return;
	}
	ui.pss.checkOnSize = false;
	if (!panel.w || !panel.h) return;
	ui.getFont();
	panel.getLogo();
	if (!ppt.panelActive) return;
	panel.calcText = true;
	txt.on_size();
	img.on_size();
	filmStrip.on_size();
	txt.repaint = true;
	img.art.displayedOtherPanel = null;
}