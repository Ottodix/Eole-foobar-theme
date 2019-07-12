// *****************************************************************************************************************************************
// SETTINGS functions by Br3tt aka Falstaff (c)2015
// *****************************************************************************************************************************************

// =================================================================== // Objects linked functions
function settings_checkboxes_action(id, status, parentId) {
	var fin;
	switch (parentId) {
	case 0: // page 0 : General
		switch (id) {
		case 0:
			eval(p.settings.pages[parentId].elements[id].linkedVariable + " = " + status);
			window.SetProperty("SYSTEM.TopBar.Visible", status);
			resize_panels();
			full_repaint();
			break;
		case 1:
			eval(p.settings.pages[parentId].elements[id].linkedVariable + " = " + status);
			window.SetProperty("SYSTEM.HeaderBar.Locked", status);
			if (!cHeaderBar.locked) {
				p.headerBar.visible = false;
			}
			resize_panels();
			full_repaint();
			break;
		case 2:
			eval(p.settings.pages[parentId].elements[id].linkedVariable + " = " + status);
			window.SetProperty("SYSTEM.PlaylistManager.Visible", status);
			resize_panels();
			full_repaint();
			break;
		case 3:
			eval(p.settings.pages[parentId].elements[id].linkedVariable + " = " + status);
			window.SetProperty("CUSTOM Show Scrollbar", status);
			resize_panels();
			full_repaint();
			break;
		case 4:
			eval(p.settings.pages[parentId].elements[id].linkedVariable + " = " + status);
			window.SetProperty("SYSTEM.Media Library Playlist", status);
			if (status) {
				checkMediaLibrayPlaylist();
				plman.ActivePlaylist = 0;
			} else {
				if (plman.GetPlaylistName(0) == "Media Library") {
					plman.RemovePlaylistSwitch(0);
				}
			}
			break;
		case 5:
			eval(p.settings.pages[parentId].elements[id].linkedVariable + " = " + status);
			window.SetProperty("CUSTOM Historic Playlist enabled", status);
			if (status) {
				addToHistoricPlaylist(null);
			} else {
				var idx = plman.FindPlaylist("Historic");
				if (idx > -1) {
					plman.RemovePlaylistSwitch(idx);
				}
			}
		case 6:
			eval(p.settings.pages[parentId].elements[id].linkedVariable + " = " + status);
			window.SetProperty("CUSTOM.Enable Statistics (write to file)", status);
			break;
		case 7:
			eval(p.settings.pages[parentId].elements[id].linkedVariable + " = " + status);
			window.SetProperty("CUSTOM Enable Smooth Scrolling", status);
			break;
		case 8:
			eval(p.settings.pages[parentId].elements[id].linkedVariable + " = " + status);
			window.SetProperty("SYSTEM.Enable Touch Scrolling", status);
			break;
		};
		break;
	case 1: // page 1 : Columns
		switch (id) {
		case 0:
			var idx = p.settings.pages[1].elements[0].selectedId;
			// all size changes are in percent / ww
			if (p.headerBar.columns[idx].percent == 0) {
				p.settings.pages[1].elements[8].status = true;
				var newColumnSize = 8000;
				p.headerBar.columns[idx].percent = newColumnSize;
				var totalColsToResizeDown = 0;
				var last_idx = 0;
				fin = p.headerBar.columns.length;
				for (var k = 0; k < fin; k++) {
					if (k != idx && p.headerBar.columns[k].percent > newColumnSize) {
						totalColsToResizeDown++;
						last_idx = k;
					};
				};
				var minus_value = Math.floor(newColumnSize / totalColsToResizeDown);
				var reste = newColumnSize - (minus_value * totalColsToResizeDown);
				fin = p.headerBar.columns.length;
				for (var k = 0; k < fin; k++) {
					if (k != idx && p.headerBar.columns[k].percent > newColumnSize) {
						p.headerBar.columns[k].percent = Math.abs(p.headerBar.columns[k].percent) - minus_value;
						if (reste > 0 && k == last_idx) {
							p.headerBar.columns[k].percent = Math.abs(p.headerBar.columns[k].percent) - reste;
						};
					};
					p.headerBar.columns[k].w = Math.abs(p.headerBar.w * p.headerBar.columns[k].percent / 100000);
				};
				p.headerBar.saveColumns();
			} else {
				// check if it's not the last column visible, otherwise, we coundn't hide it!
				var nbvis = 0;
				fin = p.headerBar.columns.length;
				for (var k = 0; k < fin; k++) {
					if (p.headerBar.columns[k].percent > 0) {
						nbvis++;
					};
				};
				if (nbvis > 1) {
					p.settings.pages[1].elements[8].status = false;
					var RemovedColumnSize = Math.abs(p.headerBar.columns[idx].percent);
					p.headerBar.columns[idx].percent = 0;
					var totalColsToResizeUp = 0;
					var last_idx = 0;
					fin = p.headerBar.columns.length;
					for (var k = 0; k < fin; k++) {
						if (k != idx && p.headerBar.columns[k].percent > 0) {
							totalColsToResizeUp++;
							last_idx = k;
						};
					};
					var add_value = Math.floor(RemovedColumnSize / totalColsToResizeUp);
					var reste = RemovedColumnSize - (add_value * totalColsToResizeUp);
					fin = p.headerBar.columns.length;
					for (var k = 0; k < fin; k++) {
						if (k != idx && p.headerBar.columns[k].percent > 0) {
							p.headerBar.columns[k].percent = Math.abs(p.headerBar.columns[k].percent) + add_value;
							if (reste > 0 && k == last_idx) {
								p.headerBar.columns[k].percent = Math.abs(p.headerBar.columns[k].percent) + reste;
							};
						};
						p.headerBar.columns[k].w = Math.abs(p.headerBar.w * p.headerBar.columns[k].percent / 100000);
					};
					p.headerBar.saveColumns();
				};
			};
			p.headerBar.initColumns();

			// set minimum rows / cover column size
			if (p.headerBar.columns[idx].ref == "Cover") { // cover column added or removed
				if (p.headerBar.columns[idx].w > 0) {
					cover.column = true;
					cGroup.count_minimum = Math.ceil((p.headerBar.columns[idx].w) / cTrack.height);
					if (cGroup.count_minimum < cGroup.default_count_minimum)
						cGroup.count_minimum = cGroup.default_count_minimum;
				} else {
					cover.column = false;
					cGroup.count_minimum = cGroup.default_count_minimum;
				};
				cover.previous_max_size = p.headerBar.columns[idx].w;
				g_image_cache = new image_cache;
				update_playlist(properties.collapseGroupsByDefault);
			} else {
				full_repaint();
			};
			break;
		};
		break;
	case 2: // page 2 : Groups
		switch (id) {
		case 16:
			if (status) {
				p.list.groupby[p.settings.pages[parentId].elements[0].selectedId].showCover = "1";
			} else {
				p.list.groupby[p.settings.pages[parentId].elements[0].selectedId].showCover = "0";
			};
			p.list.saveGroupBy();
			break;
		case 17:
			if (status) {
				p.list.groupby[p.settings.pages[parentId].elements[0].selectedId].autoCollapse = "1";
			} else {
				p.list.groupby[p.settings.pages[parentId].elements[0].selectedId].autoCollapse = "0";
			};
			p.list.saveGroupBy();
			break;
		};
		break;
	case 3: // page 3 : Appearance
		switch (id) {
		case 0:
			eval(p.settings.pages[parentId].elements[id].linkedVariable + " = " + status);
			window.SetProperty("CUSTOM Show Wallpaper", status);
			// refresh wallpaper
			if (fb.IsPlaying) {
				p.wallpaperImg = setWallpaperImg(properties.wallpaperpath, fb.GetNowPlaying());
			} else {
				p.wallpaperImg = null;
			};
			break;
		case 4:
			eval(p.settings.pages[parentId].elements[id].linkedVariable + " = " + status);
			window.SetProperty("CUSTOM Wallpaper Blurred", status);
			// refresh wallpaper
			if (fb.IsPlaying) {
				p.wallpaperImg = setWallpaperImg(properties.wallpaperpath, fb.GetNowPlaying());
			} else {
				p.wallpaperImg = null;
			};
			break;
		case 11:
			eval(p.settings.pages[parentId].elements[id].linkedVariable + " = " + status);
			window.SetProperty("SYSTEM.Enable Custom Colors", status);
			p.settings.refreshColors();
			p.list.setItemColors();
			p.playlistManager.setColors();
			break;
		};
		break;
	};
};

function settings_radioboxes_action(id, status, parentId) {
	var pid = parentId;
	switch (pid) {
	case 0:
		switch (id) {
		case 9:
			p.settings.pages[pid].elements[9].status = true;
			p.settings.pages[pid].elements[10].status = false;
			properties.defaultPlaylistItemAction = "Play";
			window.SetProperty("SYSTEM.Default Playlist Action", properties.defaultPlaylistItemAction);
			break;
		case 10:
			p.settings.pages[pid].elements[9].status = false;
			p.settings.pages[pid].elements[10].status = true;
			properties.defaultPlaylistItemAction = "Add to playback queue";
			window.SetProperty("SYSTEM.Default Playlist Action", properties.defaultPlaylistItemAction);
			break;
		};
		full_repaint();
		break;
	case 1:
		var selectedColumnId = p.settings.pages[1].elements[0].selectedId;
		switch (id) {
		case 5:
			p.settings.pages[pid].elements[5].status = true;
			p.settings.pages[pid].elements[6].status = false;
			p.settings.pages[pid].elements[7].status = false;
			p.headerBar.columns[selectedColumnId].align = 0;
			p.headerBar.saveColumns();
			break;
		case 6:
			p.settings.pages[pid].elements[5].status = false;
			p.settings.pages[pid].elements[6].status = true;
			p.settings.pages[pid].elements[7].status = false;
			p.headerBar.columns[selectedColumnId].align = 1;
			p.headerBar.saveColumns();
			break;
		case 7:
			p.settings.pages[pid].elements[5].status = false;
			p.settings.pages[pid].elements[6].status = false;
			p.settings.pages[pid].elements[7].status = true;
			p.headerBar.columns[selectedColumnId].align = 2;
			p.headerBar.saveColumns();
			break;
		};
		full_repaint();
		break;
	case 2:
		var selectedPatternId = p.settings.pages[2].elements[0].selectedId;
		switch (id) {
			// collapsed height
		case 6:
			p.settings.pages[pid].elements[6].status = true;
			p.settings.pages[pid].elements[7].status = false;
			p.settings.pages[pid].elements[8].status = false;
			p.settings.pages[pid].elements[9].status = false;
			p.settings.pages[pid].elements[10].status = false;
			if (!p.settings.pages[pid].elements[11].status) {
				p.settings.pages[pid].elements[11].status = true;
				p.settings.pages[pid].elements[12].status = false;
				p.settings.pages[pid].elements[13].status = false;
				p.settings.pages[pid].elements[14].status = false;
				p.settings.pages[pid].elements[15].status = false;
				p.list.groupby[selectedPatternId].expandedHeight = 0;
			};
			p.list.groupby[selectedPatternId].collapsedHeight = 0;
			p.list.saveGroupBy();
			break;
		case 7:
			p.settings.pages[pid].elements[6].status = false;
			p.settings.pages[pid].elements[7].status = true;
			p.settings.pages[pid].elements[8].status = false;
			p.settings.pages[pid].elements[9].status = false;
			p.settings.pages[pid].elements[10].status = false;
			if (p.settings.pages[pid].elements[11].status) {
				p.settings.pages[pid].elements[11].status = false;
				p.settings.pages[pid].elements[12].status = true;
				p.settings.pages[pid].elements[13].status = false;
				p.settings.pages[pid].elements[14].status = false;
				p.settings.pages[pid].elements[15].status = false;
				p.list.groupby[selectedPatternId].expandedHeight = 1;
			};
			p.list.groupby[selectedPatternId].collapsedHeight = 1;
			p.list.saveGroupBy();
			break;
		case 8:
			p.settings.pages[pid].elements[6].status = false;
			p.settings.pages[pid].elements[7].status = false;
			p.settings.pages[pid].elements[8].status = true;
			p.settings.pages[pid].elements[9].status = false;
			p.settings.pages[pid].elements[10].status = false;
			if (p.settings.pages[pid].elements[11].status) {
				p.settings.pages[pid].elements[11].status = false;
				p.settings.pages[pid].elements[12].status = false;
				p.settings.pages[pid].elements[13].status = true;
				p.settings.pages[pid].elements[14].status = false;
				p.settings.pages[pid].elements[15].status = false;
				p.list.groupby[selectedPatternId].expandedHeight = 2;
			};
			p.list.groupby[selectedPatternId].collapsedHeight = 2;
			p.list.saveGroupBy();
			break;
		case 9:
			p.settings.pages[pid].elements[6].status = false;
			p.settings.pages[pid].elements[7].status = false;
			p.settings.pages[pid].elements[8].status = false;
			p.settings.pages[pid].elements[9].status = true;
			p.settings.pages[pid].elements[10].status = false;
			if (p.settings.pages[pid].elements[11].status) {
				p.settings.pages[pid].elements[11].status = false;
				p.settings.pages[pid].elements[12].status = false;
				p.settings.pages[pid].elements[13].status = false;
				p.settings.pages[pid].elements[14].status = true;
				p.settings.pages[pid].elements[15].status = false;
				p.list.groupby[selectedPatternId].expandedHeight = 3;
			};
			p.list.groupby[selectedPatternId].collapsedHeight = 3;
			p.list.saveGroupBy();
			break;
		case 10:
			p.settings.pages[pid].elements[6].status = false;
			p.settings.pages[pid].elements[7].status = false;
			p.settings.pages[pid].elements[8].status = false;
			p.settings.pages[pid].elements[9].status = false;
			p.settings.pages[pid].elements[10].status = true;
			if (p.settings.pages[pid].elements[11].status) {
				p.settings.pages[pid].elements[11].status = false;
				p.settings.pages[pid].elements[12].status = false;
				p.settings.pages[pid].elements[13].status = false;
				p.settings.pages[pid].elements[14].status = false;
				p.settings.pages[pid].elements[15].status = true;
				p.list.groupby[selectedPatternId].expandedHeight = 4;
			};
			p.list.groupby[selectedPatternId].collapsedHeight = 4;
			p.list.saveGroupBy();
			break;
			// expanded height
		case 11:
			p.settings.pages[pid].elements[11].status = true;
			p.settings.pages[pid].elements[12].status = false;
			p.settings.pages[pid].elements[13].status = false;
			p.settings.pages[pid].elements[14].status = false;
			p.settings.pages[pid].elements[15].status = false;
			if (!p.settings.pages[pid].elements[6].status) {
				p.settings.pages[pid].elements[6].status = true;
				p.settings.pages[pid].elements[7].status = false;
				p.settings.pages[pid].elements[8].status = false;
				p.settings.pages[pid].elements[9].status = false;
				p.settings.pages[pid].elements[10].status = false;
				p.list.groupby[selectedPatternId].collapsedHeight = 0;
			};
			p.list.groupby[selectedPatternId].expandedHeight = 0;
			p.list.saveGroupBy();
			break;
		case 12:
			p.settings.pages[pid].elements[11].status = false;
			p.settings.pages[pid].elements[12].status = true;
			p.settings.pages[pid].elements[13].status = false;
			p.settings.pages[pid].elements[14].status = false;
			p.settings.pages[pid].elements[15].status = false;
			if (p.settings.pages[pid].elements[6].status) {
				p.settings.pages[pid].elements[6].status = false;
				p.settings.pages[pid].elements[7].status = true;
				p.settings.pages[pid].elements[8].status = false;
				p.settings.pages[pid].elements[9].status = false;
				p.settings.pages[pid].elements[10].status = false;
				p.list.groupby[selectedPatternId].collapsedHeight = 1;
			};
			p.list.groupby[selectedPatternId].expandedHeight = 1;
			p.list.saveGroupBy();
			break;
		case 13:
			p.settings.pages[pid].elements[11].status = false;
			p.settings.pages[pid].elements[12].status = false;
			p.settings.pages[pid].elements[13].status = true;
			p.settings.pages[pid].elements[14].status = false;
			p.settings.pages[pid].elements[15].status = false;
			if (p.settings.pages[pid].elements[6].status) {
				p.settings.pages[pid].elements[6].status = false;
				p.settings.pages[pid].elements[7].status = false;
				p.settings.pages[pid].elements[8].status = true;
				p.settings.pages[pid].elements[9].status = false;
				p.settings.pages[pid].elements[10].status = false;
				p.list.groupby[selectedPatternId].collapsedHeight = 2;
			};
			p.list.groupby[selectedPatternId].expandedHeight = 2;
			p.list.saveGroupBy();
			break;
		case 14:
			p.settings.pages[pid].elements[11].status = false;
			p.settings.pages[pid].elements[12].status = false;
			p.settings.pages[pid].elements[13].status = false;
			p.settings.pages[pid].elements[14].status = true;
			p.settings.pages[pid].elements[15].status = false;
			if (p.settings.pages[pid].elements[6].status) {
				p.settings.pages[pid].elements[6].status = false;
				p.settings.pages[pid].elements[7].status = false;
				p.settings.pages[pid].elements[8].status = false;
				p.settings.pages[pid].elements[9].status = true;
				p.settings.pages[pid].elements[10].status = false;
				p.list.groupby[selectedPatternId].collapsedHeight = 3;
			};
			p.list.groupby[selectedPatternId].expandedHeight = 3;
			p.list.saveGroupBy();
			break;
		case 15:
			p.settings.pages[pid].elements[11].status = false;
			p.settings.pages[pid].elements[12].status = false;
			p.settings.pages[pid].elements[13].status = false;
			p.settings.pages[pid].elements[14].status = false;
			p.settings.pages[pid].elements[15].status = true;
			if (p.settings.pages[pid].elements[6].status) {
				p.settings.pages[pid].elements[6].status = false;
				p.settings.pages[pid].elements[7].status = false;
				p.settings.pages[pid].elements[8].status = false;
				p.settings.pages[pid].elements[9].status = false;
				p.settings.pages[pid].elements[10].status = true;
				p.list.groupby[selectedPatternId].collapsedHeight = 4;
			};
			p.list.groupby[selectedPatternId].expandedHeight = 4;
			p.list.saveGroupBy();
			break;
		case 22:
			p.settings.pages[pid].elements[22].status = true;
			p.settings.pages[pid].elements[23].status = false;
			p.list.groupby[selectedPatternId].collapseGroupsByDefault = "1";
			p.list.saveGroupBy();
			break;
		case 23:
			p.settings.pages[pid].elements[22].status = false;
			p.settings.pages[pid].elements[23].status = true;
			p.list.groupby[selectedPatternId].collapseGroupsByDefault = "0";
			p.list.saveGroupBy();
			break;
		};
		full_repaint();
		break;
	case 3:
		switch (id) {
			// wpp image
		case 1:
			p.settings.pages[pid].elements[1].status = true;
			p.settings.pages[pid].elements[2].status = false;
			p.settings.pages[pid].elements[3].status = false;
			properties.wallpapermode = 0;
			window.SetProperty("CUSTOM Wallpaper Type", properties.wallpapermode);
			break;
		case 2:
			p.settings.pages[pid].elements[1].status = false;
			p.settings.pages[pid].elements[2].status = true;
			p.settings.pages[pid].elements[3].status = false;
			properties.wallpapermode = 4;
			window.SetProperty("CUSTOM Wallpaper Type", properties.wallpapermode);
			break;
		case 3:
			p.settings.pages[pid].elements[1].status = false;
			p.settings.pages[pid].elements[2].status = false;
			p.settings.pages[pid].elements[3].status = true;
			properties.wallpapermode = -1;
			window.SetProperty("CUSTOM Wallpaper Type", properties.wallpapermode);
			break;
			// wpp alpha shading
		case 5:
			p.settings.pages[pid].elements[5].status = true;
			p.settings.pages[pid].elements[6].status = false;
			p.settings.pages[pid].elements[7].status = false;
			p.settings.pages[pid].elements[8].status = false;
			p.settings.pages[pid].elements[9].status = false;
			properties.wallpaperalpha = 125;
			window.SetProperty("CUSTOM Wallpaper Alpha", properties.wallpaperalpha);
			break;
		case 6:
			p.settings.pages[pid].elements[5].status = false;
			p.settings.pages[pid].elements[6].status = true;
			p.settings.pages[pid].elements[7].status = false;
			p.settings.pages[pid].elements[8].status = false;
			p.settings.pages[pid].elements[9].status = false;
			properties.wallpaperalpha = 150;
			window.SetProperty("CUSTOM Wallpaper Alpha", properties.wallpaperalpha);
			break;
		case 7:
			p.settings.pages[pid].elements[5].status = false;
			p.settings.pages[pid].elements[6].status = false;
			p.settings.pages[pid].elements[7].status = true;
			p.settings.pages[pid].elements[8].status = false;
			p.settings.pages[pid].elements[9].status = false;
			properties.wallpaperalpha = 175;
			window.SetProperty("CUSTOM Wallpaper Alpha", properties.wallpaperalpha);
			break;
		case 8:
			p.settings.pages[pid].elements[5].status = false;
			p.settings.pages[pid].elements[6].status = false;
			p.settings.pages[pid].elements[7].status = false;
			p.settings.pages[pid].elements[8].status = true;
			p.settings.pages[pid].elements[9].status = false;
			properties.wallpaperalpha = 200;
			window.SetProperty("CUSTOM Wallpaper Alpha", properties.wallpaperalpha);
			break;
		case 9:
			p.settings.pages[pid].elements[5].status = false;
			p.settings.pages[pid].elements[6].status = false;
			p.settings.pages[pid].elements[7].status = false;
			p.settings.pages[pid].elements[8].status = false;
			p.settings.pages[pid].elements[9].status = true;
			properties.wallpaperalpha = 225;
			window.SetProperty("CUSTOM Wallpaper Alpha", properties.wallpaperalpha);
			break;
		};
		// set wallpaper
		if (fb.IsPlaying) {
			p.wallpaperImg = setWallpaperImg(properties.wallpaperpath, fb.GetNowPlaying());
		} else {
			p.wallpaperImg = null;
		};
		full_repaint();
		break;
	};
};

function settings_listboxes_action(pageId, id, selectedId) {
	switch (pageId) {
	case 1:
		switch (id) {
		case 0:
			try {
				// if textbox was active (edit = true) before new click on the listbox entry, save the new input before updating the textboxes
				p.settings.pages[1].elements[1].inputbox.check("down", 0, 0);
				p.settings.pages[1].elements[2].inputbox.check("down", 0, 0);
				p.settings.pages[1].elements[3].inputbox.check("down", 0, 0);
				p.settings.pages[1].elements[4].inputbox.check("down", 0, 0);
				// update textboxes values / selected column Id in the listbox
				p.settings.pages[1].elements[0].selectedId = selectedId;
				var txtbox_value = p.headerBar.columns[selectedId].label;
				p.settings.pages[1].elements[1].inputbox.text = txtbox_value;
				p.settings.pages[1].elements[1].inputbox.default_text = txtbox_value;
				txtbox_value = p.headerBar.columns[selectedId].tf;
				p.settings.pages[1].elements[2].inputbox.text = txtbox_value;
				p.settings.pages[1].elements[2].inputbox.default_text = txtbox_value;
				txtbox_value = p.headerBar.columns[selectedId].tf2;
				p.settings.pages[1].elements[3].inputbox.text = txtbox_value;
				p.settings.pages[1].elements[3].inputbox.default_text = txtbox_value;
				txtbox_value = p.headerBar.columns[selectedId].sortOrder;
				p.settings.pages[1].elements[4].inputbox.text = txtbox_value;
				p.settings.pages[1].elements[4].inputbox.default_text = txtbox_value;
				// update radio buttons values / selected column Id in the listbox
				switch (p.headerBar.columns[selectedId].align) {
				case 0: // Left align
					p.settings.pages[1].elements[5].status = true;
					p.settings.pages[1].elements[6].status = false;
					p.settings.pages[1].elements[7].status = false;
					break;
				case 1: // Center align
					p.settings.pages[1].elements[5].status = false;
					p.settings.pages[1].elements[6].status = true;
					p.settings.pages[1].elements[7].status = false;
					break;
				case 2: // Right align
					p.settings.pages[1].elements[5].status = false;
					p.settings.pages[1].elements[6].status = false;
					p.settings.pages[1].elements[7].status = true;
					break;
				};
				// update checkbox status / selected column Id in the listbox
				p.settings.pages[1].elements[0].status = (p.headerBar.columns[selectedId].percent > 0);
			} catch (e) {
				console.log("WSH Error catched: settings_listboxes_action");
			};
			full_repaint();
			break;
		};
		break;
	case 2:
		var txtbox_value = "";
		switch (id) {
		case 0:
			try {
				// if textbox was active (edit = true) before new click on the listbox entry, save the new input before updating the textboxes
				p.settings.pages[2].elements[1].inputbox.check("down", 0, 0);
				p.settings.pages[2].elements[2].inputbox.check("down", 0, 0);
				p.settings.pages[2].elements[3].inputbox.check("down", 0, 0);
				p.settings.pages[2].elements[4].inputbox.check("down", 0, 0);
				p.settings.pages[2].elements[5].inputbox.check("down", 0, 0);
				p.settings.pages[2].elements[18].inputbox.check("down", 0, 0);
				p.settings.pages[2].elements[19].inputbox.check("down", 0, 0);
				p.settings.pages[2].elements[20].inputbox.check("down", 0, 0);
				p.settings.pages[2].elements[21].inputbox.check("down", 0, 0);
				// update textboxes values / selected column Id in the listbox
				p.settings.pages[2].elements[0].selectedId = selectedId;
				//
				txtbox_value = p.list.groupby[selectedId].label;
				p.settings.pages[2].elements[1].inputbox.text = txtbox_value;
				p.settings.pages[2].elements[1].inputbox.default_text = txtbox_value;
				txtbox_value = p.list.groupby[selectedId].tf;
				p.settings.pages[2].elements[2].inputbox.text = txtbox_value;
				p.settings.pages[2].elements[2].inputbox.default_text = txtbox_value;
				txtbox_value = p.list.groupby[selectedId].sortOrder;
				p.settings.pages[2].elements[3].inputbox.text = txtbox_value;
				p.settings.pages[2].elements[3].inputbox.default_text = txtbox_value;

				txtbox_value = p.list.groupby[selectedId].playlistFilter;
				p.settings.pages[2].elements[4].inputbox.text = txtbox_value;
				p.settings.pages[2].elements[4].inputbox.default_text = txtbox_value;
				txtbox_value = p.list.groupby[selectedId].extraRows;
				p.settings.pages[2].elements[5].inputbox.text = txtbox_value;
				p.settings.pages[2].elements[5].inputbox.default_text = txtbox_value;

				txtbox_value = p.list.groupby[selectedId].l1;
				p.settings.pages[2].elements[18].inputbox.text = txtbox_value;
				p.settings.pages[2].elements[18].inputbox.default_text = txtbox_value;
				txtbox_value = p.list.groupby[selectedId].r1;
				p.settings.pages[2].elements[19].inputbox.text = txtbox_value;
				p.settings.pages[2].elements[19].inputbox.default_text = txtbox_value;
				txtbox_value = p.list.groupby[selectedId].l2;
				p.settings.pages[2].elements[20].inputbox.text = txtbox_value;
				p.settings.pages[2].elements[20].inputbox.default_text = txtbox_value;
				txtbox_value = p.list.groupby[selectedId].r2;
				p.settings.pages[2].elements[21].inputbox.text = txtbox_value;
				p.settings.pages[2].elements[21].inputbox.default_text = txtbox_value;

				// update radio buttons values / selected column Id in the listbox
				switch (Math.floor(p.list.groupby[selectedId].collapsedHeight)) {
					// collapsed height
				case 0:
					p.settings.pages[2].elements[6].status = true;
					p.settings.pages[2].elements[7].status = false;
					p.settings.pages[2].elements[8].status = false;
					p.settings.pages[2].elements[9].status = false;
					p.settings.pages[2].elements[10].status = false;
					break;
				case 1:
					p.settings.pages[2].elements[6].status = false;
					p.settings.pages[2].elements[7].status = true;
					p.settings.pages[2].elements[8].status = false;
					p.settings.pages[2].elements[9].status = false;
					p.settings.pages[2].elements[10].status = false;
					break;
				case 2:
					p.settings.pages[2].elements[6].status = false;
					p.settings.pages[2].elements[7].status = false;
					p.settings.pages[2].elements[8].status = true;
					p.settings.pages[2].elements[9].status = false;
					p.settings.pages[2].elements[10].status = false;
					break;
				case 3:
					p.settings.pages[2].elements[6].status = false;
					p.settings.pages[2].elements[7].status = false;
					p.settings.pages[2].elements[8].status = false;
					p.settings.pages[2].elements[9].status = true;
					p.settings.pages[2].elements[10].status = false;
					break;
				case 4:
					p.settings.pages[2].elements[6].status = false;
					p.settings.pages[2].elements[7].status = false;
					p.settings.pages[2].elements[8].status = false;
					p.settings.pages[2].elements[9].status = false;
					p.settings.pages[2].elements[10].status = true;
					break;
				};
				switch (Math.floor(p.list.groupby[selectedId].expandedHeight)) {
					// expanded height
				case 0:
					p.settings.pages[2].elements[11].status = true;
					p.settings.pages[2].elements[12].status = false;
					p.settings.pages[2].elements[13].status = false;
					p.settings.pages[2].elements[14].status = false;
					p.settings.pages[2].elements[15].status = false;
					break;
				case 1:
					p.settings.pages[2].elements[11].status = false;
					p.settings.pages[2].elements[12].status = true;
					p.settings.pages[2].elements[13].status = false;
					p.settings.pages[2].elements[14].status = false;
					p.settings.pages[2].elements[15].status = false;
					break;
				case 2:
					p.settings.pages[2].elements[11].status = false;
					p.settings.pages[2].elements[12].status = false;
					p.settings.pages[2].elements[13].status = true;
					p.settings.pages[2].elements[14].status = false;
					p.settings.pages[2].elements[15].status = false;
					break;
				case 3:
					p.settings.pages[2].elements[11].status = false;
					p.settings.pages[2].elements[12].status = false;
					p.settings.pages[2].elements[13].status = false;
					p.settings.pages[2].elements[14].status = true;
					p.settings.pages[2].elements[15].status = false;
					break;
				case 4:
					p.settings.pages[2].elements[11].status = false;
					p.settings.pages[2].elements[12].status = false;
					p.settings.pages[2].elements[13].status = false;
					p.settings.pages[2].elements[14].status = false;
					p.settings.pages[2].elements[15].status = true;
					break;
				};
				switch (Math.floor(p.list.groupby[selectedId].collapseGroupsByDefault)) {
					// default group status
				case 0:
					p.settings.pages[2].elements[22].status = false;
					p.settings.pages[2].elements[23].status = true;
					break;
				case 1:
					p.settings.pages[2].elements[22].status = true;
					p.settings.pages[2].elements[23].status = false;
					break;
				};

			} catch (e) {
				console.log("WSH Error catched: settings_listboxes_action");
			};
			full_repaint();
			break;
		};
		break;
	};
};

function settings_textboxes_action(pageId, elementId) {
	switch (pageId) {
	case 1: // Columns
		var selectedColumnId = p.settings.pages[pageId].elements[0].selectedId;
		switch (elementId) {
		case 1:
			var label = p.headerBar.columns[selectedColumnId].label;
			var new_label = p.settings.pages[pageId].elements[elementId].inputbox.text;
			if (new_label == "")
				new_label = label;
			if (new_label) {
				p.headerBar.columns[selectedColumnId].label = new_label;
				p.headerBar.saveColumns();
				// update listbox array
				p.settings.pages[pageId].elements[0].arr.splice(0, p.settings.pages[pageId].elements[0].arr.length);
				var fin = p.headerBar.columns.length;
				for (var i = 0; i < fin; i++) {
					p.settings.pages[pageId].elements[0].arr.push(p.headerBar.columns[i].ref);
				};
				full_repaint();
			};
			break;
		case 2:
			var tf = p.headerBar.columns[selectedColumnId].tf;
			var new_tf = p.settings.pages[pageId].elements[elementId].inputbox.text;
			if (new_tf == "")
				new_tf = tf;
			if (new_tf) {
				p.headerBar.columns[selectedColumnId].tf = new_tf;
				p.headerBar.saveColumns();
			};
			break;
		case 3:
			var tf2 = p.headerBar.columns[selectedColumnId].tf2;
			var new_tf2 = p.settings.pages[pageId].elements[elementId].inputbox.text;
			if (new_tf2 == "")
				new_tf2 = tf2;
			if (new_tf2) {
				p.headerBar.columns[selectedColumnId].tf2 = new_tf2;
				p.headerBar.saveColumns();
			};
			break;
		case 4:
			var sortOrder = p.headerBar.columns[selectedColumnId].sortOrder;
			var new_sortOrder = p.settings.pages[pageId].elements[elementId].inputbox.text;
			if (new_sortOrder == "")
				new_sortOrder = sortOrder;
			if (new_sortOrder) {
				p.headerBar.columns[selectedColumnId].sortOrder = new_sortOrder;
				p.headerBar.saveColumns();
			};
			break;
		};
		break;
	case 2: // Groups
		var selectedColumnId = p.settings.pages[pageId].elements[0].selectedId;
		switch (elementId) {
		case 1:
			var label = p.list.groupby[selectedColumnId].label;
			var new_label = p.settings.pages[pageId].elements[elementId].inputbox.text;
			if (new_label == "")
				new_label = label;
			if (new_label) {
				p.list.groupby[selectedColumnId].label = new_label;
				p.list.saveGroupBy();
				// update listbox array
				p.settings.pages[pageId].elements[0].arr.splice(0, p.settings.pages[pageId].elements[0].arr.length);
				var fin = p.list.groupby.length;
				for (var i = 0; i < fin; i++) {
					p.settings.pages[pageId].elements[0].arr.push(p.list.groupby[i].label);
				};
				full_repaint();
			};
			break;
		case 2:
			var tf = p.list.groupby[selectedColumnId].tf;
			var new_tf = p.settings.pages[pageId].elements[elementId].inputbox.text;
			if (new_tf == "")
				new_tf = tf;
			if (new_tf) {
				p.list.groupby[selectedColumnId].tf = new_tf;
				p.list.saveGroupBy();
			};
			break;
		case 3:
			var sortOrder = p.list.groupby[selectedColumnId].sortOrder;
			var new_sortOrder = p.settings.pages[pageId].elements[elementId].inputbox.text;
			if (new_sortOrder == "")
				new_sortOrder = sortOrder;
			if (new_sortOrder) {
				p.list.groupby[selectedColumnId].sortOrder = new_sortOrder;
				p.list.saveGroupBy();
			};
			break;
		case 4:
			var playlistFilter = p.list.groupby[selectedColumnId].playlistFilter;
			var new_playlistFilter = p.settings.pages[pageId].elements[elementId].inputbox.text;
			if (new_playlistFilter == "")
				new_playlistFilter = playlistFilter;
			if (new_playlistFilter) {
				p.list.groupby[selectedColumnId].playlistFilter = new_playlistFilter;
				p.list.saveGroupBy();
			};
			break;
		case 5:
			var extraRows = p.list.groupby[selectedColumnId].extraRows;
			var new_extraRows = p.settings.pages[pageId].elements[elementId].inputbox.text;
			if (new_extraRows == "")
				new_extraRows = extraRows;
			if (new_extraRows) {
				p.list.groupby[selectedColumnId].extraRows = new_extraRows;
				p.list.saveGroupBy();
			};
			break;
		case 18:
			var l1 = p.list.groupby[selectedColumnId].l1;
			var new_l1 = p.settings.pages[pageId].elements[elementId].inputbox.text;
			if (new_l1 == "")
				new_l1 = l1;
			if (new_l1) {
				p.list.groupby[selectedColumnId].l1 = new_l1;
				p.list.saveGroupBy();
			};
			break;
		case 19:
			var r1 = p.list.groupby[selectedColumnId].r1;
			var new_r1 = p.settings.pages[pageId].elements[elementId].inputbox.text;
			if (new_r1 == "")
				new_r1 = r1;
			if (new_r1) {
				p.list.groupby[selectedColumnId].r1 = new_r1;
				p.list.saveGroupBy();
			};
			break;
		case 20:
			var l2 = p.list.groupby[selectedColumnId].l2;
			var new_l2 = p.settings.pages[pageId].elements[elementId].inputbox.text;
			if (new_l2 == "")
				new_l2 = l2;
			if (new_l2) {
				p.list.groupby[selectedColumnId].l2 = new_l2;
				p.list.saveGroupBy();
			};
			break;
		case 21:
			var r2 = p.list.groupby[selectedColumnId].r2;
			var new_r2 = p.settings.pages[pageId].elements[elementId].inputbox.text;
			if (new_r2 == "")
				new_r2 = r2;
			if (new_r2) {
				p.list.groupby[selectedColumnId].r2 = new_r2;
				p.list.saveGroupBy();
			};
			break;
		};
		break;
	case 3: // Appearance
		switch (elementId) {
		case 10:
			var label = properties.wallpaperpath;
			var new_label = p.settings.pages[pageId].elements[elementId].inputbox.text;
			if (new_label == "")
				new_label = label;
			if (new_label) {
				properties.wallpaperpath = new_label;
				window.SetProperty("CUSTOM Default Wallpaper Path", properties.wallpaperpath);
				// refresh wallpaper
				if (fb.IsPlaying) {
					p.wallpaperImg = setWallpaperImg(properties.wallpaperpath, fb.GetNowPlaying());
				} else {
					p.wallpaperImg = null;
				};
			};
			break;
		};
		break;
	};
};

// =================================================================== // Objects

oCheckBox = function (id, x, y, label, linkedVariable, func, parentPageId) {
	this.objType = "CB";
	this.id = id;
	this.x = x;
	this.y = y;
	this.parentPageId = parentPageId;
	this.ly = this.y - (p.settings.pages[this.parentPageId].offset * cSettings.rowHeight);
	this.label = label;
	this.linkedVariable = linkedVariable;
	this.status = eval(linkedVariable);
	this.prevStatus = this.status;
	var gfunc = func;

	this.setButtons = function () {
		// normal unchecked box
		this.checkbox_normal_off = gdi.CreateImage(zoom(16, 300), zoom(16, 300));
		var gb = this.checkbox_normal_off.GetGraphics();
		gb.SetSmoothingMode(2);
		gb.DrawEllipse(zoom(2, 300), zoom(2, 300), zoom(12, 300), zoom(12, 300), zoom(2.0, 300), p.settings.color1);
		this.checkbox_normal_off.ReleaseGraphics(gb);
		// hover unchecked box
		this.checkbox_hover_off = gdi.CreateImage(zoom(16, 300), zoom(16, 300));
		gb = this.checkbox_hover_off.GetGraphics();
		gb.SetSmoothingMode(2);
		gb.DrawEllipse(zoom(2, 300), zoom(2, 300), zoom(12, 300), zoom(12, 300), zoom(2.0, 300), p.settings.color2);
		this.checkbox_hover_off.ReleaseGraphics(gb);
		// normal checked box
		this.checkbox_normal_on = gdi.CreateImage(zoom(16, 300), zoom(16, 300));
		var gb = this.checkbox_normal_on.GetGraphics();
		gb.SetSmoothingMode(2);
		gb.DrawEllipse(zoom(2, 300), zoom(2, 300), zoom(12, 300), zoom(12, 300), zoom(2.0, 300), p.settings.color1);
		gb.FillEllipse(zoom(4, 300), zoom(4, 300), zoom(8, 300), zoom(8, 300), p.settings.color1);
		this.checkbox_normal_on.ReleaseGraphics(gb);
		// hover checked box
		this.checkbox_hover_on = gdi.CreateImage(zoom(16, 300), zoom(16, 300));
		gb = this.checkbox_hover_on.GetGraphics();
		gb.SetSmoothingMode(2);
		gb.DrawEllipse(zoom(2, 300), zoom(2, 300), zoom(12, 300), zoom(12, 300), zoom(2.0, 300), p.settings.color2);
		gb.FillEllipse(zoom(4, 300), zoom(4, 300), zoom(8, 300), zoom(8, 300), p.settings.color2);
		this.checkbox_hover_on.ReleaseGraphics(gb);

		var button_zoomSize = g_z16;
		// button
		if (this.status) {
			this.button = new button(this.checkbox_normal_on.Resize(button_zoomSize, button_zoomSize, 7), this.checkbox_hover_on.Resize(button_zoomSize, button_zoomSize, 7), this.checkbox_hover_on.Resize(button_zoomSize, button_zoomSize, 7));
		} else {
			this.button = new button(this.checkbox_normal_off.Resize(button_zoomSize, button_zoomSize, 7), this.checkbox_hover_off.Resize(button_zoomSize, button_zoomSize, 7), this.checkbox_hover_off.Resize(button_zoomSize, button_zoomSize, 7));
		};
	};
	this.setButtons();

	this.draw = function (gr) {
		this.status = eval(this.linkedVariable);
		if (this.status != this.prevStatus) {
			var button_zoomSize = g_z16;
			if (this.status) {
				this.button.update(this.checkbox_normal_on.Resize(button_zoomSize, button_zoomSize, 7), this.checkbox_hover_on.Resize(button_zoomSize, button_zoomSize, 7), this.checkbox_hover_on.Resize(button_zoomSize, button_zoomSize, 7));
			} else {
				this.button.update(this.checkbox_normal_off.Resize(button_zoomSize, button_zoomSize, 7), this.checkbox_hover_off.Resize(button_zoomSize, button_zoomSize, 7), this.checkbox_hover_off.Resize(button_zoomSize, button_zoomSize, 7));
			};
			this.prevStatus = this.status;
		};
		this.ly = this.y - (p.settings.pages[this.parentPageId].offset * cSettings.rowHeight);
		if (this.ly > cSettings.topBarHeight) {
			var button_y = this.ly - 1 + Math.ceil((p.settings.txtHeight + 10 - this.button.h) / 2);
			this.button.draw(gr, this.x, button_y, 255);
			var label_x = this.x + this.button.w + zoom(5, g_dpi);
			gr.GdiDrawText(this.label, gdi_font(p.settings.fontname, p.settings.txtHeight, 1), (this.status ? p.settings.color2 : p.settings.color1), label_x, this.ly, p.settings.w, p.settings.txtHeight + 10, g_LDT);
		};
	};

	this.on_mouse = function (event, x, y, delta) {
		if (this.ly <= cSettings.topBarHeight) {
			return;
		};
		var state = this.button.checkstate(event, x, y);
		switch (event) {
		case "up":
			if (state == ButtonStates.hover) {
				this.status = !this.status;
				eval(gfunc + "(" + this.id + "," + this.status + "," + this.parentPageId + ")");
			};
			break;
		};
		return state;
	};

	this.on_key = function (event, vkey) {};

	this.on_char = function (code) {};

	this.on_focus = function (is_focused) {};
};

oRadioButton = function (id, x, y, label, linkedVariable, func, parentPageId) {
	this.objType = "RB";
	this.id = id;
	this.x = x;
	this.y = y;
	this.parentPageId = parentPageId;
	this.ly = this.y - (p.settings.pages[this.parentPageId].offset * cSettings.rowHeight);
	this.label = label;
	this.status = eval(linkedVariable);
	this.prevStatus = this.status;
	var gfunc = func;

	this.setButtons = function () {
		// normal unchecked box
		this.radiobt_normal_off = gdi.CreateImage(zoom(16, 300), zoom(16, 300));
		var gb = this.radiobt_normal_off.GetGraphics();
		gb.SetSmoothingMode(2);
		gb.DrawEllipse(zoom(2, 300), zoom(2, 300), zoom(12, 300), zoom(12, 300), zoom(2.0, 300), p.settings.color1);
		this.radiobt_normal_off.ReleaseGraphics(gb);
		// hover unchecked box
		this.radiobt_hover_off = gdi.CreateImage(zoom(16, 300), zoom(16, 300));
		gb = this.radiobt_hover_off.GetGraphics();
		gb.SetSmoothingMode(2);
		gb.DrawEllipse(zoom(2, 300), zoom(2, 300), zoom(12, 300), zoom(12, 300), zoom(2.0, 300), p.settings.color2);
		this.radiobt_hover_off.ReleaseGraphics(gb);
		// normal checked box
		this.radiobt_normal_on = gdi.CreateImage(zoom(16, 300), zoom(16, 300));
		var gb = this.radiobt_normal_on.GetGraphics();
		gb.SetSmoothingMode(2);
		gb.DrawEllipse(zoom(2, 300), zoom(2, 300), zoom(12, 300), zoom(12, 300), zoom(2.0, 300), p.settings.color1);
		gb.FillEllipse(zoom(4, 300), zoom(4, 300), zoom(8, 300), zoom(8, 300), p.settings.color1);
		this.radiobt_normal_on.ReleaseGraphics(gb);
		// hover checked box
		this.radiobt_hover_on = gdi.CreateImage(zoom(16, 300), zoom(16, 300));
		gb = this.radiobt_hover_on.GetGraphics();
		gb.SetSmoothingMode(2);
		gb.DrawEllipse(zoom(2, 300), zoom(2, 300), zoom(12, 300), zoom(12, 300), zoom(2.0, 300), p.settings.color2);
		gb.FillEllipse(zoom(4, 300), zoom(4, 300), zoom(8, 300), zoom(8, 300), p.settings.color2);
		this.radiobt_hover_on.ReleaseGraphics(gb);

		var button_zoomSize = g_z16;
		// button
		if (this.status) {
			this.button = new button(this.radiobt_normal_on.Resize(button_zoomSize, button_zoomSize, 7), this.radiobt_hover_on.Resize(button_zoomSize, button_zoomSize, 7), this.radiobt_hover_on.Resize(button_zoomSize, button_zoomSize, 7));
		} else {
			this.button = new button(this.radiobt_normal_off.Resize(button_zoomSize, button_zoomSize, 7), this.radiobt_hover_off.Resize(button_zoomSize, button_zoomSize, 7), this.radiobt_hover_off.Resize(button_zoomSize, button_zoomSize, 7));
		};
	};
	this.setButtons();

	this.draw = function (gr) {
		var button_zoomSize = g_z16;
		if (this.status) {
			this.button.update(this.radiobt_normal_on.Resize(button_zoomSize, button_zoomSize, 7), this.radiobt_hover_on.Resize(button_zoomSize, button_zoomSize, 7), this.radiobt_hover_on.Resize(button_zoomSize, button_zoomSize, 7));
		} else {
			this.button.update(this.radiobt_normal_off.Resize(button_zoomSize, button_zoomSize, 7), this.radiobt_hover_off.Resize(button_zoomSize, button_zoomSize, 7), this.radiobt_hover_off.Resize(button_zoomSize, button_zoomSize, 7));
		};
		this.ly = this.y - (p.settings.pages[this.parentPageId].offset * cSettings.rowHeight);
		if (this.ly > cSettings.topBarHeight) {
			var button_y = this.ly - 1 + Math.ceil((p.settings.txtHeight + 10 - this.button.h) / 2);
			this.button.draw(gr, this.x, button_y, 255);
			var label_x = this.x + this.button.w + zoom(5, g_dpi);
			gr.GdiDrawText(this.label, gdi_font(p.settings.fontname, p.settings.txtHeight, 1), (this.status ? p.settings.color2 : p.settings.color1), label_x, this.ly, p.settings.w, p.settings.txtHeight + 10, g_LDT);
		};
	};

	this.on_mouse = function (event, x, y, delta) {
		if (this.ly <= cSettings.topBarHeight) {
			return;
		};
		var state = this.button.checkstate(event, x, y);
		switch (event) {
		case "up":
			if (state == ButtonStates.hover) {
				eval(gfunc + "(" + this.id + "," + this.status + "," + this.parentPageId + ")");
			};
			break;
		};
		return state;
	};

	this.on_key = function (event, vkey) {};

	this.on_char = function (code) {};

	this.on_focus = function (is_focused) {};
};

oTextBox = function (id, x, y, w, h, label, value, func, parentPageId) {
	this.objType = "TB";
	this.id = id;
	this.x = x;
	this.y = y;
	this.parentPageId = parentPageId;
	this.ly = this.y - (p.settings.pages[this.parentPageId].offset * cSettings.rowHeight);
	this.w = w;
	this.h = h;
	this.label = label;
	this.value = value;
	var gfunc = func;

	this.inputbox = new oInputbox(this.w, this.h, this.value, "", RGB(0, 0, 0), RGB(240, 240, 240), RGB(180, 180, 180), RGBA(150, 150, 150, 200), gfunc + "(" + this.parentPageId + ", " + this.id + ")", "p.settings.pages[" + this.parentPageId + "].elements[" + this.id + "]", this.id, p.settings.txtHeight, 255);
	this.inputbox.autovalidation = false;

	this.repaint = function () {
		window.RepaintRect(this.x, this.ly, this.w, this.h * 2);
	};

	this.draw = function (gr) {
		this.ly = this.y - (p.settings.pages[this.parentPageId].offset * cSettings.rowHeight);
		if (this.ly + this.h > cSettings.topBarHeight) {
			gr.GdiDrawText(this.label, gdi_font(p.settings.fontname, p.settings.txtHeight, 5), p.settings.color1, this.x, this.ly, p.list.w - p.settings.pages[this.parentPageId].scrollbarWidth - 10, this.h, g_LDT);
			this.inputbox.draw(gr, this.x, this.ly + this.h);
		};
	};

	this.on_mouse = function (event, x, y, delta) {
		if (this.ly + this.h <= cSettings.topBarHeight) {
			return;
		};
		if (!p.settings.pages[1].elements[0].ishover) {
			if (this.ly > cSettings.topBarHeight + zoom(5, g_dpi)) {
				this.inputbox.check(event, x, y, delta);
			};
		};
	};

	this.on_key = function (event, vkey) {
		switch (event) {
		case "down":
			this.inputbox.on_key_down(vkey);
			break;
		};

		var kmask = GetKeyboardMask();
		// specific action on RETURN for the textbox Object
		if (kmask == KMask.none && vkey == VK_RETURN) {
			if (this.inputbox.edit) {
				this.inputbox.edit = false;
				this.inputbox.text_selected = "";
				this.inputbox.select = false;
				this.inputbox.default_text = this.inputbox.text; // set default text to new value validated
				this.inputbox.repaint();
			};
		};
		// specific action on TAB for the textbox Object
		if (this.inputbox.edit && !g_textbox_tabbed) {
			if (vkey == VK_TAB && (kmask == KMask.none || kmask == KMask.shift)) {
				// cancel textbox edit on current
				this.inputbox.edit = false;
				this.inputbox.text_selected = "";
				this.inputbox.select = false;
				this.inputbox.default_text = this.inputbox.text; // set default text to new value validated
				this.inputbox.SelBegin = 0;
				this.inputbox.SelEnd = 0;
				this.inputbox.repaint();

				if (kmask == KMask.none) {
					// scan elements to find objectType = "TB" / TextBox
					var first_textbox_id = -1;
					var next_textbox_id = -1;
					var fin = p.settings.pages[this.parentPageId].elements.length;
					for (var i = 0; i < fin; i++) {
						if (p.settings.pages[this.parentPageId].elements[i].objType == "TB") {
							if (first_textbox_id < 0) {
								first_textbox_id = i;
							};
							if (next_textbox_id < 0 && i > this.id) {
								next_textbox_id = i;
								break;
							};
						};
					};
					if (next_textbox_id < 0) {
						next_textbox_id = first_textbox_id;
					};
				} else {
					// scan elements to find objectType = "TB" / TextBox
					var first_textbox_id = -1;
					var next_textbox_id = -1;
					var debut = p.settings.pages[this.parentPageId].elements.length - 1;
					for (var i = debut; i >= 0; i--) {
						if (p.settings.pages[this.parentPageId].elements[i].objType == "TB") {
							if (first_textbox_id < 0) {
								first_textbox_id = i;
							};
							if (next_textbox_id < 0 && i < this.id) {
								next_textbox_id = i;
								break;
							};
						};
					};
					if (next_textbox_id < 0) {
						next_textbox_id = first_textbox_id;
					};
				};

				// set focus and edit mode to the next textbox found
				p.settings.pages[this.parentPageId].elements[next_textbox_id].inputbox.on_focus(true);
				p.settings.pages[this.parentPageId].elements[next_textbox_id].inputbox.edit = true;
				p.settings.pages[this.parentPageId].elements[next_textbox_id].inputbox.Cpos = p.settings.pages[this.parentPageId].elements[next_textbox_id].inputbox.text.length; // this.GetCPos(x);
				p.settings.pages[this.parentPageId].elements[next_textbox_id].inputbox.anchor = p.settings.pages[this.parentPageId].elements[next_textbox_id].inputbox.Cpos;
				p.settings.pages[this.parentPageId].elements[next_textbox_id].inputbox.SelBegin = p.settings.pages[this.parentPageId].elements[next_textbox_id].inputbox.Cpos;
				p.settings.pages[this.parentPageId].elements[next_textbox_id].inputbox.SelEnd = p.settings.pages[this.parentPageId].elements[next_textbox_id].inputbox.Cpos;
				p.settings.pages[this.parentPageId].elements[next_textbox_id].inputbox.repaint();
				p.settings.pages[this.parentPageId].elements[next_textbox_id].inputbox.resetCursorTimer();
				g_textbox_tabbed = true;
				// then check if scroll required (update page offset to show the new activated textbox)
				var next_ly = p.settings.pages[this.parentPageId].elements[next_textbox_id].ly;
				if (next_ly < p.settings.pages[this.parentPageId].y + cSettings.rowHeight * 2) {
					var d = Math.ceil((p.settings.pages[this.parentPageId].y + cSettings.rowHeight * 2 - next_ly) / cSettings.rowHeight);
					p.settings.pages[this.parentPageId].offset -= d;
					if (p.settings.pages[this.parentPageId].offset < 0)
						p.settings.pages[this.parentPageId].offset = 0;
					p.settings.pages[this.parentPageId].scrollbar.reSet(p.settings.pages[this.parentPageId].total_rows, cSettings.rowHeight, p.settings.pages[this.parentPageId].offset);
					full_repaint();
				} else if (next_ly > p.settings.pages[this.parentPageId].y + p.settings.pages[this.parentPageId].h - cSettings.rowHeight * 3) {
					var maxOffset = p.settings.pages[this.parentPageId].total_rows - p.settings.pages[this.parentPageId].totalRowsVis;
					var d = Math.ceil((next_ly - (p.settings.pages[this.parentPageId].y + p.settings.pages[this.parentPageId].h) + cSettings.rowHeight * 3) / cSettings.rowHeight);
					p.settings.pages[this.parentPageId].offset += d;
					if (p.settings.pages[this.parentPageId].offset >= maxOffset)
						p.settings.pages[this.parentPageId].offset = maxOffset;
					p.settings.pages[this.parentPageId].scrollbar.reSet(p.settings.pages[this.parentPageId].total_rows, cSettings.rowHeight, p.settings.pages[this.parentPageId].offset);
					full_repaint();
				};
			};
		};
	};

	this.on_char = function (code) {
		this.inputbox.on_char(code);
	};

	this.on_focus = function (is_focused) {
		this.inputbox.on_focus(is_focused);
	};
};

oSlider = function (id, w, h, range, color_mode, value, parentPageId, parentWidgetId) {
	this.id = id;
	this.parentPageId = parentPageId;
	this.parentWidgetId = parentWidgetId;
	this.w = w;
	this.h = h;
	this.range = range;
	this.value = value;
	this.colorMode = color_mode;
	this.cw = 7;
	this.ch = this.h + 4;
	//
	this.ratio = 1;
	this.Zx = 0;
	this.Zy = 0;
	this.Zw = 0;
	this.Zh = 0;
	this.Zcx = 0;
	this.Zcy = 0;
	this.Zcw = 0;
	this.Zch = 0;
	//
	this.drag = false;
	this.dragX = 0;

	this.setValue = function (x) {
		this.ratioValue = (x - this.Zx) / this.Zw;
		var v = Math.floor(this.range * this.ratioValue);
		return v;
	};

	this.setCursorPos = function (v) {
		this.ratioPos = v / this.range;
		var Zcx = Math.floor(((this.Zw - this.Zcw) * this.ratioPos) - (this.Zcw / 2) * 0);
		return Zcx;
	};

	this.adjustSize = function () {
		this.Zw = zoom(this.w, g_dpi);
		this.Zh = zoom(this.h, g_dpi);
		this.Zcw = zoom(this.cw, g_dpi);
		this.Zch = zoom(this.ch, g_dpi);
		this.Zcx = this.setCursorPos(this.value);
	};
	this.adjustSize();

	this.draw = function (gr, x, y) {
		// bar x, y
		this.Zx = x;
		this.Zy = y;
		// cursor Y
		this.Zcy = this.Zy - Math.floor((this.Zch - this.Zh) / 2);
		// draw slider bar
		var widget_x = p.settings.pages[this.parentPageId].elements[this.parentWidgetId].x;
		this.left_padding = widget_x + g_z10;
		left_padding = 0;
		switch (this.colorMode) {
		case "R":
			gr.FillSolidRect(left_padding + this.Zx, this.Zy, this.Zw, this.Zh, RGB(255, 0, 0));
			break;
		case "G":
			gr.FillSolidRect(left_padding + this.Zx, this.Zy, this.Zw, this.Zh, RGB(0, 255, 0));
			break;
		case "B":
			gr.FillSolidRect(left_padding + this.Zx, this.Zy, this.Zw, this.Zh, RGB(0, 0, 255));
			break;
		};
		gr.FillGradRect(left_padding + this.Zx - 1, this.Zy, this.Zw, this.Zh, 0, RGB(0, 0, 0), 0, 1.0);

		// draw cursor
		if (p.settings.pages[this.parentPageId].elements[this.parentWidgetId].colorEnabled) {
			var cursor_color = (p.settings.colorWidgetFocusedId == this.parentWidgetId ? (p.settings.colorSliderFocusedId == this.id ? RGB(255, 255, 255) : RGB(180, 180, 180)) : RGB(180, 180, 180));
			gr.FillSolidRect(this.Zx + this.Zcx, this.Zcy, this.Zcw, this.Zch, cursor_color);
			gr.DrawRect(this.Zx + this.Zcx, this.Zcy, this.Zcw - 1, this.Zch - 1, 1.0, RGB(30, 30, 30));
		} else {
			var cursor_color = RGB(180, 180, 180);
			gr.FillSolidRect(this.Zx + 0, this.Zcy, this.Zcw, this.Zch, cursor_color);
			gr.DrawRect(this.Zx + 0, this.Zcy, this.Zcw - 1, this.Zch - 1, 1.0, RGB(30, 30, 30));
		};

	};

	this.isHoverCursor = function (x, y) {
		var widget_x = p.settings.pages[this.parentPageId].elements[this.parentWidgetId].x;
		this.left_padding = widget_x + g_z10;
		var tmp = (x >= this.left_padding + this.Zcx - 1 && x <= this.left_padding + this.Zcx + this.Zcw + 1 && y >= this.Zcy && y <= this.Zcy + this.Zch);
		return tmp;
	};

	this.isHoverBar = function (x, y) {
		return (x >= this.Zx && x <= this.Zx + this.Zw && y >= this.Zy && y <= this.Zy + this.Zh);
	};

	this.on_mouse = function (event, x, y, delta) {
		if (p.settings.pages[this.parentPageId].elements[this.parentWidgetId].colorEnabled) {
			switch (event) {
			case "down":
				if (this.isHoverBar(x, y) && !this.isHoverCursor(x, y)) {
					this.drag = true;
					this.dragX = x;
					this.value = this.setValue(x);
					this.Zcx = this.setCursorPos(this.value);
					p.settings.pages[this.parentPageId].elements[this.parentWidgetId].repaint();
				} else if (this.isHoverCursor(x, y)) {
					this.drag = true;
					this.dragX = x;
				};
				break;
			case "up":
				if (this.drag) {
					p.settings.color_updated = true;
					p.settings.colorWidgetFocusedId = this.parentWidgetId;
					p.settings.colorSliderFocusedId = this.id;
					//
					this.drag = false;
					this.dragX = 0;
					//
					p.settings.pages[this.parentPageId].elements[this.parentWidgetId].repaint();
				};
				break;
			case "move":
				if (this.drag) {
					if (x >= this.Zx && x <= this.Zx + this.Zw) {
						this.value = this.setValue(x);
						this.Zcx = this.setCursorPos(this.value);
						p.settings.pages[this.parentPageId].elements[this.parentWidgetId].repaint();
					};
				};
				break;
			};
		};
	};

	this.on_key = function (event, vkey) {
		if (!p.timer_onKey) {
			switch (vkey) {
			case VK_LEFT:
				var prev_value = this.value;
				this.value = this.value > 0 ? this.value - 1 : 0;
				if (prev_value != this.value)
					p.settings.color_updated = true;
				this.Zcx = this.setCursorPos(this.value);
				p.settings.pages[this.parentPageId].elements[this.parentWidgetId].repaint();
				break;
			case VK_RIGHT:
				var prev_value = this.value;
				this.value = this.value < this.range ? this.value + 1 : this.range;
				if (prev_value != this.value)
					p.settings.color_updated = true;
				this.Zcx = this.setCursorPos(this.value);
				p.settings.pages[this.parentPageId].elements[this.parentWidgetId].repaint();
				break;
			};
			p.timer_onKey = window.SetTimeout(function () {
					p.timer_onKey && window.ClearTimeout(p.timer_onKey);
					p.timer_onKey = false;
				}, 150);
		};
	};
};

oWidget = function (id, x, y, w, h, label, color_id, func, parentPageId) {
	this.objType = "WG";
	this.id = id;
	this.label = label;
	this.color_id = color_id;
	this.parentPageId = parentPageId;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	var gfunc = func;
	this.sliders = [];
	this.slider_y = 0;

	var slider_w = zoom(190, g_dpi);
	var slider_h = g_z6;
	var slider_range = 255.0;
	switch (this.parentPageId) {
	case 3:
		switch (this.color_id) {
		case 0:
			var arr = window.GetProperty("SYSTEM.COLOR TEXT NORMAL", "180-180-180").split("-");
			break;
		case 1:
			var arr = window.GetProperty("SYSTEM.COLOR TEXT SELECTED", "200-210-255").split("-");
			break;
		case 2:
			var arr = window.GetProperty("SYSTEM.COLOR BACKGROUND NORMAL", "25-25-35").split("-");
			break;
		case 3:
			var arr = window.GetProperty("SYSTEM.COLOR BACKGROUND SELECTED", "130-150-255").split("-");
			break;
		case 4:
			var arr = window.GetProperty("SYSTEM.COLOR HIGHLIGHT", "255-175-50").split("-");
			break;
		};
		break;
	};
	this.sliders.push(new oSlider(0, slider_w, slider_h, slider_range, "R", arr[0], this.parentPageId, this.id));
	this.sliders.push(new oSlider(1, slider_w, slider_h, slider_range, "G", arr[1], this.parentPageId, this.id));
	this.sliders.push(new oSlider(2, slider_w, slider_h, slider_range, "B", arr[2], this.parentPageId, this.id));

	this.repaint = function () {
		this.ly = Math.floor(this.y - (p.settings.pages[this.parentPageId].offset * cSettings.rowHeight));
		window.RepaintRect(this.x, this.ly, this.w, this.h + this.slider_y);
	};

	this.refresh = function () {
		switch (this.parentPageId) {
		case 3:
			switch (this.color_id) {
			case 0:
				var arr = window.GetProperty("SYSTEM.COLOR TEXT NORMAL", "180-180-180").split("-");
				break;
			case 1:
				var arr = window.GetProperty("SYSTEM.COLOR TEXT SELECTED", "200-210-255").split("-");
				break;
			case 2:
				var arr = window.GetProperty("SYSTEM.COLOR BACKGROUND NORMAL", "25-25-35").split("-");
				break;
			case 3:
				var arr = window.GetProperty("SYSTEM.COLOR BACKGROUND SELECTED", "130-150-255").split("-");
				break;
			case 4:
				var arr = window.GetProperty("SYSTEM.COLOR HIGHLIGHT", "255-175-50").split("-");
				break;
			};
			break;
		};
		for (var v = 0; v < 3; v++) {
			this.sliders[v].value = arr[v];
			this.sliders[v].Zcx = this.sliders[v].setCursorPos(arr[v]);
		};
	};

	this.draw = function (gr) {
		gr.SetSmoothingMode(0);

		this.ly = Math.floor(this.y - (p.settings.pages[this.parentPageId].offset * cSettings.rowHeight));

		// check if color is enabled in current settings page
		switch (this.parentPageId) {
		case 3:
			this.colorEnabled = properties.enableCustomColors;
			break;
		default:
			this.colorEnabled = true;
		};

		// draw widget label
		var label_y = g_z10;
		gr.GdiDrawText(this.label, gdi_font(p.settings.fontname, p.settings.txtHeight, 5), p.settings.color1, this.x, this.ly - label_y, p.settings.w, cSettings.rowHeight, g_LDT);

		// draw sliders
		this.slider_y = label_y + zoom(20, g_dpi);
		var mode_w = Math.ceil(gr.CalcTextWidth("GG", gdi_font(g_fname, g_fsize - 1, 0)));
		var cube_left_padding = Math.ceil(gr.CalcTextWidth(" 255 ", gdi_font(g_fname, g_fsize - 1, 0)));
		var slider_left_padding = zoom(5, g_dpi) + mode_w;
		var sliders_spacing = zoom(20, g_dpi);

		var fin = this.sliders.length;
		for (var i = 0; i < fin; i++) {
			switch (i) {
			case 0:
				this.sliders[i].draw(gr, this.x + slider_left_padding, Math.floor(this.ly + this.slider_y + sliders_spacing * 0));
				gr.GdiDrawText("R", gdi_font(g_fname, g_fsize - 2, 0), g_color_normal_txt, this.x + g_z10, this.ly + this.slider_y + sliders_spacing * 0 + zoom(1, g_dpi), mode_w, slider_h, g_LDT);
				gr.GdiDrawText((this.colorEnabled ? this.sliders[i].value : "0"), gdi_font(g_fname, g_fsize - 2, 0), g_color_normal_txt, this.x + label_y + this.sliders[0].Zw + label_y + zoom(5, g_dpi), this.ly + this.slider_y + sliders_spacing * 0 + zoom(1, g_dpi), cube_left_padding, slider_h, g_LDT);
				break;
			case 1:
				this.sliders[i].draw(gr, this.x + slider_left_padding, Math.floor(this.ly + this.slider_y + sliders_spacing * 1));
				gr.GdiDrawText("G", gdi_font(g_fname, g_fsize - 2, 0), g_color_normal_txt, this.x + g_z10, this.ly + this.slider_y + sliders_spacing * 1 + zoom(1, g_dpi), mode_w, slider_h, g_LDT);
				gr.GdiDrawText((this.colorEnabled ? this.sliders[i].value : "0"), gdi_font(g_fname, g_fsize - 2, 0), g_color_normal_txt, this.x + label_y + this.sliders[0].Zw + label_y + zoom(5, g_dpi), this.ly + this.slider_y + sliders_spacing * 1 + zoom(1, g_dpi), cube_left_padding, slider_h, g_LDT);
				break;
			case 2:
				this.sliders[i].draw(gr, this.x + slider_left_padding, Math.floor(this.ly + this.slider_y + sliders_spacing * 2));
				gr.GdiDrawText("B", gdi_font(g_fname, g_fsize - 2, 0), g_color_normal_txt, this.x + g_z10, this.ly + this.slider_y + sliders_spacing * 2 + zoom(1, g_dpi), mode_w, slider_h, g_LDT);
				gr.GdiDrawText((this.colorEnabled ? this.sliders[i].value : "0"), gdi_font(g_fname, g_fsize - 2, 0), g_color_normal_txt, this.x + label_y + this.sliders[0].Zw + label_y + zoom(5, g_dpi), this.ly + this.slider_y + sliders_spacing * 2 + zoom(1, g_dpi), cube_left_padding, slider_h, g_LDT);
				break;
			};
		};

		// draw color cube
		var cubx = this.x + label_y + this.sliders[0].Zw + label_y + cube_left_padding + g_z2;
		var cuby = this.ly + this.slider_y;
		var cubw = (sliders_spacing * 2 + this.sliders[0].Zh);
		var cubh = cubw;

		if (this.colorEnabled) {
			gr.FillSolidRect(cubx, cuby, cubw, cubh, RGB(this.sliders[0].value, this.sliders[1].value, this.sliders[2].value));
			gr.FillGradRect(cubx, cuby, cubw, cubh, 45, RGBA(0, 0, 0, 20), RGBA(255, 255, 255, 20), 1.0);
			gr.DrawRect(cubx, cuby, cubw - 1, cubh - 1, 1.0, p.settings.color1);
		} else {
			gr.FillSolidRect(cubx, cuby, cubw, cubh, RGB(250, 250, 250));
			gr.DrawRect(cubx, cuby, cubw - 1, cubh - 1, 1.0, RGB(255, 50, 50));
			gr.SetSmoothingMode(2);
			gr.DrawLine(cubx, cuby, cubx + cubw - 1, cuby + cubh - 1, 1.0, RGB(255, 50, 50));
			gr.SetSmoothingMode(0);
		};
		// widget frame
		this.w = slider_left_padding + this.sliders[0].Zw + cube_left_padding + cubw + g_z10;
		this.h = sliders_spacing * 2 + this.sliders[0].Zh * 1 + label_y * 2;
		gr.DrawRect(this.x, this.ly + this.slider_y - label_y, this.w, this.h, 1.0, p.settings.color1);
	};

	this.isHoverCursor = function (x, y) {
		return (x >= this.Zcx && x <= this.Zcx + this.Zcw && y >= this.Zcy && y <= this.Zcy + this.Zch);
	};

	this.isHoverBar = function (x, y) {
		return (x >= this.Zx && x <= this.Zx + this.Zw && y >= this.Zy && y <= this.Zy + this.Zh);
	};

	this.updateColor = function () {
		switch (this.parentPageId) {
		case 3:
			switch (this.color_id) {
			case 0:
				if (properties.enableCustomColors) {
					g_color_normal_txt = RGB(this.sliders[0].value, this.sliders[1].value, this.sliders[2].value);
				};
				var rgb_str = this.sliders[0].value + "-" + this.sliders[1].value + "-" + this.sliders[2].value;
				window.SetProperty("SYSTEM.COLOR TEXT NORMAL", rgb_str);
				break;
			case 1:
				if (properties.enableCustomColors) {
					g_color_selected_txt = RGB(this.sliders[0].value, this.sliders[1].value, this.sliders[2].value);
				};
				var rgb_str = this.sliders[0].value + "-" + this.sliders[1].value + "-" + this.sliders[2].value;
				window.SetProperty("SYSTEM.COLOR TEXT SELECTED", rgb_str);
				break;
			case 2:
				if (properties.enableCustomColors) {
					g_color_normal_bg = RGB(this.sliders[0].value, this.sliders[1].value, this.sliders[2].value);
				};
				var rgb_str = this.sliders[0].value + "-" + this.sliders[1].value + "-" + this.sliders[2].value;
				window.SetProperty("SYSTEM.COLOR BACKGROUND NORMAL", rgb_str);
				break;
			case 3:
				if (properties.enableCustomColors) {
					g_color_selected_bg = RGB(this.sliders[0].value, this.sliders[1].value, this.sliders[2].value);
				};
				var rgb_str = this.sliders[0].value + "-" + this.sliders[1].value + "-" + this.sliders[2].value;
				window.SetProperty("SYSTEM.COLOR BACKGROUND SELECTED", rgb_str);
				break;
			case 4:
				if (properties.enableCustomColors) {
					g_color_highlight = RGB(this.sliders[0].value, this.sliders[1].value, this.sliders[2].value);
				};
				var rgb_str = this.sliders[0].value + "-" + this.sliders[1].value + "-" + this.sliders[2].value;
				window.SetProperty("SYSTEM.COLOR HIGHLIGHT", rgb_str);
				break;
			};
			p.settings.refreshColors();
			p.list.setItemColors();
			p.playlistManager.setColors();
			break;
		};
	};

	this.on_mouse = function (event, x, y, delta) {
		// check sliders
		var fin = this.sliders.length;
		for (var i = 0; i < fin; i++) {
			this.sliders[i].on_mouse(event, x, y);
		};
		if (p.settings.color_updated) { // if a slider has been moved, color is to update
			this.updateColor();
		} else {
			// if click and not slider moved or clicked, slider focus to RESET
			if (event == "up") {
				// reset slider focus
				p.settings.colorWidgetFocusedId = -1;
				p.settings.colorSliderFocusedId = -1;
				full_repaint();
			};
		};
	};

	this.on_key = function (event, vkey) {
		// if this widget has the focus, check on_key on the slider (to move it left or right)
		if (p.settings.colorWidgetFocusedId == this.id) {
			if (p.settings.colorSliderFocusedId > -1) {
				this.sliders[p.settings.colorSliderFocusedId].on_key(event, vkey);
				if (p.settings.color_updated) { // if a slider has been moved, color is to update
					this.updateColor();
				};
			};
		};
	};

	this.on_char = function (code) {};

	this.on_focus = function (is_focused) {};
};

oListBox = function (id, object_name, x, y, w, h, row_height, label, arr, selectedId, func, parentObject, parentPageId, offset) {
	this.objType = "LB";
	this.rowHeight = row_height;
	this.id = id;
	this.objectName = object_name;
	this.parentObject = parentObject;
	this.x = x;
	this.y = y;
	this.parentPageId = parentPageId;
	this.ly = this.y - (p.settings.pages[this.parentPageId].offset * cSettings.rowHeight);
	this.w = w;
	this.h = 3 * this.rowHeight;
	this.totalRows = Math.floor(this.h / this.rowHeight);
	this.label = label;
	this.offset = offset;
	this.arr = arr;
	this.total = this.arr.length;
	this.selectedId = selectedId;
	var gfunc = func;
	// scrollbar instance
	this.scrollbar = new oScrollBar(this.id, this.objectName + ".scrollbar", this.x + this.w - cScrollBar.width, this.ly, cScrollBar.width, this.h, this.arr.length, this.rowHeight, this.offset, this.objectName, true, 3, false);
	this.scrollbar.setCustomColors(RGB(240, 240, 240), RGB(0, 0, 0));
	this.scrollbarWidth = 0;

	this.repaint = function () {
		window.RepaintRect(this.x, this.ly, this.w, this.h);
	};

	this.showSelected = function (rowId) {
		this.selectedId = rowId;
		if (this.scrollbar.visible) {
			var max_offset = this.total - this.totalRows;
			this.offset = rowId > max_offset ? max_offset : rowId;
			this.scrollbar.updateCursorPos(this.offset);
		} else {
			this.offset = 0;
		};
		eval(gfunc + "(" + this.parentPageId + ", " + this.id + ", " + this.selectedId + ")");
	};

	this.reSet = function (list_array) {
		this.arr = list_array;
		this.total = this.arr.length;
		this.max = (this.total > this.totalRows ? this.totalRows : this.total);
		// scrollbar reset
		this.scrollbar.reSet(this.total, this.rowHeight, this.offset);
		if (this.scrollbar.visible) {
			this.scrollbarWidth = this.scrollbar.w;
		} else {
			this.scrollbarWidth = 0;
		};
	};
	this.reSet(this.arr);

	this.resize = function (x, y, w, h, arr) {
		this.x = x;
		this.y = y;
		this.ly = this.y - (p.settings.pages[this.parentPageId].offset * cSettings.rowHeight);
		this.w = w;
		this.h = 3 * this.rowHeight;

		this.arr = arr;
		this.total = this.arr.length;
		this.max = (this.total > this.totalRows ? this.totalRows : this.total);
		this.offset = 0;

		// scrollbar resize
		this.scrollbar.reSize(this.x + this.w - cScrollBar.width, this.ly, cScrollBar.width, this.h, this.arr.length, this.rowHeight, this.offset);
		if (this.scrollbar.visible) {
			this.scrollbarWidth = this.scrollbar.w;
		} else {
			this.scrollbarWidth = 0;
		};
	};

	this.draw = function (gr) {
		var row = 0;
		this.ly = this.y - (p.settings.pages[this.parentPageId].offset * cSettings.rowHeight);

		this.scrollbar.y = this.ly;
		// scrollbar reset
		this.scrollbar.reSet(this.total, this.rowHeight, this.offset);
		if (this.scrollbar.visible) {
			this.scrollbarWidth = this.scrollbar.w;
		} else {
			this.scrollbarWidth = 0;
		};

		var text_padding = 5;

		// listbox bg
		if (this.label.length > 0) {
			gr.GdiDrawText(this.label, gdi_font(p.settings.fontname, p.settings.txtHeight, 5), p.settings.color1, this.x, this.ly - this.rowHeight - g_z2, this.w, this.rowHeight, g_LDT);
		};
		gr.FillSolidRect(this.x, this.ly, this.w, this.h + 1, RGB(240, 240, 240));
		gr.DrawRect(this.x - 1, this.ly - 1, this.w + 1, this.h + 2, 1.0, RGB(180, 180, 180));

		// scrollbar
		if (this.scrollbar.visible)
			this.scrollbar.draw(gr);

		// items
		var isCustom = false;
		var fin = this.max + this.offset;
		for (var i = this.offset; i < fin; i++) {
			gr.SetSmoothingMode(0);
			switch (this.parentPageId) {
			case 1:
				isCustom = (p.headerBar.columns[i].ref.substr(0, 6) == "Custom");
				break;
			case 2:
				isCustom = (p.list.groupby[i].ref.substr(0, 6) == "Custom");
				break;
			};
			if (i == this.selectedId)
				gr.FillSolidRect(this.x + 1, this.ly + row * this.rowHeight + 1, this.w - this.scrollbarWidth - 2, this.rowHeight - 1, RGBA(150, 150, 150, 200));
			gr.GdiDrawText((isCustom ? "[" : "") + this.arr[i] + (isCustom ? "]" : ""), gdi_font(p.settings.fontname, p.settings.txtHeight, (i == this.selectedId ? 1 : 0)), (i == this.selectedId ? RGB(0, 0, 0) : RGB(0, 0, 0)), this.x + text_padding, this.ly + row * this.rowHeight, this.w - this.scrollbarWidth - text_padding * 2, this.rowHeight, g_LDT);
			row++;
		};
	};

	this.isHoverObject = function (x, y) {
		var test = (x >= this.x && x <= this.x + this.w && y >= this.ly && y <= this.ly + this.h);
		return test;
	};

	this.on_mouse = function (event, x, y, delta) {
		this.ishover = this.isHoverObject(x, y);
		var maxHeight = this.max * this.rowHeight;
		this.ishoverRow = (x >= this.x && x <= this.x + this.w - this.scrollbarWidth && y >= this.ly && y <= this.ly + maxHeight);

		switch (event) {
		case "down":
			if (this.scrollbar.visible)
				this.scrollbar.check(event, x, y, delta);
			// get row number clicked
			if (y > cSettings.topBarHeight + cSettings.rowHeight) {
				if (this.ishoverRow) {
					var new_selectedId = Math.floor((y - this.ly) / this.rowHeight) + this.offset;
					eval(gfunc + "(" + this.parentPageId + ", " + this.id + ", " + new_selectedId + ")");
				};
			};
			break;
		case "dblclk":
			this.on_mouse("down", x, y);
			break;
		case "up":
			if (this.scrollbar.visible)
				this.scrollbar.check(event, x, y, delta);
			break;
		case "right":
			// get row number right-clicked
			if (y > cSettings.topBarHeight + cSettings.rowHeight) {
				if (this.ishoverRow) {
					var new_selectedId = Math.floor((y - this.ly) / this.rowHeight) + this.offset;
					eval(gfunc + "(" + this.parentPageId + ", " + this.id + ", " + new_selectedId + ")");
					this.contextMenu(x, y, new_selectedId);
				};
			};
			break;
		case "move":
			if (this.scrollbar.visible)
				this.scrollbar.check(event, x, y, delta);
			break;
		case "wheel":
			if (this.ishover) {
				if (this.scrollbar.visible && this.ishover)
					this.scrollbar.check(event, x, y, delta);
			};
			break;
		};
	};

	this.on_key = function (event, vkey) {
		switch (event) {
		case "down":
			switch (vkey) {
			case VK_UP:
				var new_selectedId = (this.selectedId > 0 ? this.selectedId - 1 : 0);
				eval(gfunc + "(" + this.parentPageId + ", " + this.id + ", " + new_selectedId + ")");
				var row_idx = this.selectedId - this.offset;
				if (row_idx <= 0) {
					this.showSelected(new_selectedId);
				};
				break;
			case VK_DOWN:
				var new_selectedId = (this.selectedId < this.arr.length - 1 ? this.selectedId + 1 : this.arr.length - 1);
				eval(gfunc + "(" + this.parentPageId + ", " + this.id + ", " + new_selectedId + ")");
				var row_idx = this.selectedId - this.offset;
				if (row_idx > 2) { // 2 = max index row of the listbox, because listbox height is 3 rows
					this.showSelected(new_selectedId);
				};
				break;
			};
			break;
		};
	};

	this.on_char = function (code) {};

	this.on_focus = function (is_focused) {};

	this.contextMenu = function (x, y, id) {
		var fin;
		var idx;
		var _menu = window.CreatePopupMenu();

		switch (this.parentPageId) {
		case 1:
			if (p.headerBar.totalColumns < properties.max_columns) {
				var source_ref = p.headerBar.columns[id].ref;
				if (source_ref != "Cover" && source_ref != "State" && source_ref != "Mood" && source_ref != "Rating") {
					_menu.AppendMenuItem(MF_STRING, 10, "Duplicate this Column");
				};
			};
			break;
		case 2:
			if (p.list.totalGroupBy < properties.max_patterns) {
				_menu.AppendMenuItem(MF_STRING, 20, "Duplicate this Pattern");
			};
			break;
		};

		idx = _menu.TrackPopupMenu(x, y);
		switch (true) {
		case (idx == 10):
			// action
			var no_user = 1;
			var tmp_array = [];
			// copy columns array to a tmp array in order to sort it
			fin = p.headerBar.columns.length;
			for (var i = 0; i < fin; i++) {
				tmp_array.push(p.headerBar.columns[i].ref);
			};
			tmp_array.sort();
			// get free number to affect to the new User column to create
			fin = tmp_array.length;
			for (var i = 0; i < fin; i++) {
				if (tmp_array[i].substr(0, 6) == "Custom") {
					if (tmp_array[i].substr(tmp_array[i].length - 2, 2) == num(no_user, 2)) {
						no_user++;
					};
				};
			};

			var c0 = p.headerBar.columns[id].label;
			var c1 = p.headerBar.columns[id].tf;
			var c2 = p.headerBar.columns[id].tf2;
			var c3 = p.headerBar.columns[id].align;
			var c4 = p.headerBar.columns[id].sortOrder;
			var c5 = p.headerBar.columns[id].enableCustomColor;
			var c6 = p.headerBar.columns[id].customColor;

			p.headerBar.columns.push(new oColumn("copy of " + c0, c1, c2, 0, "Custom " + num(no_user, 2), c3, c4, c5, c6));
			p.headerBar.totalColumns++;
			window.SetProperty("SYSTEM.HeaderBar.TotalColumns", p.headerBar.totalColumns);
			var arr = [];
			fin = p.headerBar.columns.length;
			for (var i = 0; i < fin; i++) {
				arr.push(p.headerBar.columns[i].ref);
			};
			p.settings.pages[1].elements[0].reSet(arr);
			p.headerBar.saveColumns();
			p.settings.pages[1].elements[0].showSelected(p.headerBar.columns.length - 1);
			full_repaint();
			break;
		case (idx == 20):
			// action
			var c0 = p.list.groupby[id].label;
			var c1 = p.list.groupby[id].tf;
			var c2 = p.list.groupby[id].sortOrder;
			var c3 = p.list.groupby[id].playlistFilter;
			var c4 = p.list.groupby[id].extraRows;
			var c5 = p.list.groupby[id].collapsedHeight;
			var c6 = p.list.groupby[id].expandedHeight;
			var c7 = p.list.groupby[id].showCover;
			var c8 = p.list.groupby[id].autoCollapse;
			var c9 = p.list.groupby[id].l1;
			var c10 = p.list.groupby[id].r1;
			var c11 = p.list.groupby[id].l2;
			var c12 = p.list.groupby[id].r2;

			p.list.groupby.push(new oGroupBy("copy of " + c0, c1, c2, "Custom", c3, c4, c5, c6, c7, c8, c9, c10, c11, c12));
			p.list.totalGroupBy++;
			window.SetProperty("SYSTEM.Groups.TotalGroupBy", p.list.totalGroupBy);
			var arr = [];
			fin = p.list.groupby.length;
			for (var i = 0; i < fin; i++) {
				arr.push(p.list.groupby[i].label);
			};
			p.settings.pages[2].elements[0].reSet(arr);
			p.list.saveGroupBy();
			p.settings.pages[2].elements[0].showSelected(p.list.groupby.length - 1);
			full_repaint();
			break;
		};
		return true;
	};
};

oPage = function (id, objectName, label, nbrows) {
	this.id = id;
	this.objectName = objectName;
	this.label = label;
	this.elements = [];
	this.offset = 0;
	this.rows = [];
	this.total_rows = nbrows;
	this.x = p.settings.x;
	this.y = p.settings.y + cSettings.topBarHeight;
	this.w = p.settings.w;
	this.h = p.settings.h - cSettings.topBarHeight;
	this.totalRowsVis = Math.floor((this.h - cHeaderBar.height) / cSettings.rowHeight);
	// scrollbar instance
	this.scrollbar = new oScrollBar(this.id, this.objectName + ".scrollbar", p.settings.x + p.settings.w - cScrollBar.width, p.settings.y + cSettings.topBarHeight + cHeaderBar.height, cScrollBar.width, p.settings.h - cSettings.topBarHeight - cHeaderBar.height, this.total_rows, cSettings.rowHeight, this.offset, this.objectName, true, 3, false);
	this.scrollbar.setCustomColors(g_color_normal_bg, g_color_normal_txt);
	this.scrollbarWidth = 0;

	this.repaint = function () {
		full_repaint();
	};

	this.init = function () {
		var txtbox_x = 20;
		switch (this.id) {
		case 0: // General
			var rh = cSettings.rowHeight;
			// Layout options
			this.elements.push(new oCheckBox(0, 20, cSettings.topBarHeight + rh * 2.25, "Show Information Panel (toggle = CTRL+I)", "cTopBar.visible", "settings_checkboxes_action", this.id));
			this.elements.push(new oCheckBox(1, 20, cSettings.topBarHeight + rh * 3.25, "Show Header Toolbar (toggle = CTRL+T)", "cHeaderBar.locked", "settings_checkboxes_action", this.id));
			this.elements.push(new oCheckBox(2, 20, cSettings.topBarHeight + rh * 4.25, "Show Playlist Manager (toggle = TAB key)", "cPlaylistManager.visible", "settings_checkboxes_action", this.id));
			this.elements.push(new oCheckBox(3, 20, cSettings.topBarHeight + rh * 5.25, "Show Playlist Scrollbar", "properties.showscrollbar", "settings_checkboxes_action", this.id));
			// Playlists options
			this.elements.push(new oCheckBox(4, 20, cSettings.topBarHeight + rh * 7.25, "Show Media Library (always on top)", "cPlaylistManager.mediaLibraryPlaylist", "settings_checkboxes_action", this.id));
			this.elements.push(new oCheckBox(5, 20, cSettings.topBarHeight + rh * 8.25, "Show Plays Historic", "cPlaylistManager.enableHistoricPlaylist", "settings_checkboxes_action", this.id));
			// Tagging options
			this.elements.push(new oCheckBox(6, 20, cSettings.topBarHeight + rh * 10.25, "Enable Playback Statistics (write to file)", "opt_stats", "settings_checkboxes_action", this.id));
			// Behaviour options
			this.elements.push(new oCheckBox(7, 20, cSettings.topBarHeight + rh * 12.25, "Smooth Scrolling", "properties.smoothscrolling", "settings_checkboxes_action", this.id));
			this.elements.push(new oCheckBox(8, 20, cSettings.topBarHeight + rh * 13.25, "Touch Scrolling Control (disable drag'n drop)", "properties.enableTouchControl", "settings_checkboxes_action", this.id));

			// Create radio buttons
			var spaceBetween_w = zoom(70, g_dpi);
			this.elements.push(new oRadioButton(9, txtbox_x, cSettings.topBarHeight + rh * 15.25, "Play", (properties.defaultPlaylistItemAction == "Play"), "settings_radioboxes_action", this.id));
			this.elements.push(new oRadioButton(10, txtbox_x + spaceBetween_w, cSettings.topBarHeight + rh * 15.25, "Enqueue", (properties.defaultPlaylistItemAction == "Add to playback queue"), "settings_radioboxes_action", this.id));

			break;
		case 1: // Columns
			// Create Columns ListBox object
			var arr = [];
			var rh = cSettings.rowHeight;
			var fin = p.headerBar.columns.length;
			for (var i = 0; i < fin; i++) {
				arr.push(p.headerBar.columns[i].label);
			};
			var listBoxRowHeight = zoom(21, g_dpi);
			var listBoxHeight = Math.floor(wh - (cSettings.topBarHeight + rh * 1.75 + p.settings.txtHeight) - 25);
			var listBoxWidth = zoom(100, g_dpi);
			var listBoxCurrentId = 0;
			this.elements.push(new oListBox(0, "p.settings.pages[" + this.id.toString() + "].elements[0]", 20, Math.floor(cSettings.topBarHeight + rh * 1.75 + p.settings.txtHeight), listBoxWidth + cScrollBar.width, listBoxHeight, listBoxRowHeight, "Columns", arr, listBoxCurrentId, "settings_listboxes_action", "p.settings.pages[" + this.id.toString() + "]", this.id, 0));

			// Create TextBoxes
			var txtbox_value = p.headerBar.columns[listBoxCurrentId].label;
			this.elements.push(new oTextBox(1, txtbox_x, Math.ceil(cSettings.topBarHeight + rh * 6.25), ww - txtbox_x - 20 - this.scrollbarWidth, cHeaderBar.height, "Label", txtbox_value, "settings_textboxes_action", this.id));
			txtbox_value = p.headerBar.columns[listBoxCurrentId].tf;
			this.elements.push(new oTextBox(2, txtbox_x, Math.ceil(cSettings.topBarHeight + rh * 8.25), ww - txtbox_x - 20 - this.scrollbarWidth, cHeaderBar.height, "Title Format (enter 'null' for nothing)", txtbox_value, "settings_textboxes_action", this.id));
			txtbox_value = p.headerBar.columns[listBoxCurrentId].tf2;
			this.elements.push(new oTextBox(3, txtbox_x, Math.ceil(cSettings.topBarHeight + rh * 10.25), ww - txtbox_x - 20 - this.scrollbarWidth, cHeaderBar.height, "Extra Line Title Format (enter 'null' for nothing)", txtbox_value, "settings_textboxes_action", this.id));
			txtbox_value = p.headerBar.columns[listBoxCurrentId].sortOrder;
			this.elements.push(new oTextBox(4, txtbox_x, Math.ceil(cSettings.topBarHeight + rh * 12.25), ww - txtbox_x - 20 - this.scrollbarWidth, cHeaderBar.height, "Sort Order (enter 'null' for nothing)", txtbox_value, "settings_textboxes_action", this.id));

			// Create radio buttons
			var spaceBetween_w = zoom(80, g_dpi);
			this.elements.push(new oRadioButton(5, txtbox_x, cSettings.topBarHeight + rh * 15.25, "Left", (p.headerBar.columns[listBoxCurrentId].align == 0), "settings_radioboxes_action", this.id));
			this.elements.push(new oRadioButton(6, txtbox_x + spaceBetween_w, cSettings.topBarHeight + rh * 15.25, "Center", (p.headerBar.columns[listBoxCurrentId].align == 1), "settings_radioboxes_action", this.id));
			this.elements.push(new oRadioButton(7, txtbox_x + spaceBetween_w * 2, cSettings.topBarHeight + rh * 15.25, "Right", (p.headerBar.columns[listBoxCurrentId].align == 2), "settings_radioboxes_action", this.id));

			// checkbox : activate columns Y/N
			this.elements.push(new oCheckBox(0, txtbox_x, cSettings.topBarHeight + rh * 5.25, "Visible", "p.headerBar.columns[p.settings.pages[1].elements[0].selectedId].percent == 0 ? false : true", "settings_checkboxes_action", this.id));

			break;
		case 2: // Groups
			// Create Groups Pattern ListBox object
			var arr = [];
			var rh = cSettings.rowHeight;
			var fin = p.list.groupby.length;
			for (var i = 0; i < fin; i++) {
				arr.push(p.list.groupby[i].label);
			};
			var listBoxRowHeight = zoom(21, g_dpi);
			var listBoxHeight = Math.floor(wh - (cSettings.topBarHeight + rh * 1.75 + p.settings.txtHeight) - 25);
			var listBoxWidth = zoom(170, g_dpi);
			var listBoxCurrentId = cGroup.pattern_idx;
			this.elements.push(new oListBox(0, "p.settings.pages[" + this.id.toString() + "].elements[0]", 20, Math.floor(cSettings.topBarHeight + rh * 1.75 + p.settings.txtHeight), listBoxWidth + cScrollBar.width, listBoxHeight, listBoxRowHeight, "Group by", arr, listBoxCurrentId, "settings_listboxes_action", "p.settings.pages[" + this.id.toString() + "]", this.id, 0));

			// Create TextBoxes
			var txtbox_value = p.list.groupby[listBoxCurrentId].label;
			this.elements.push(new oTextBox(1, txtbox_x, Math.ceil(cSettings.topBarHeight + rh * 4.5), ww - txtbox_x - 20 - this.scrollbarWidth, cHeaderBar.height, "Label", txtbox_value, "settings_textboxes_action", this.id));
			txtbox_value = p.list.groupby[listBoxCurrentId].tf;
			this.elements.push(new oTextBox(2, txtbox_x, Math.ceil(cSettings.topBarHeight + rh * 6.5), ww - txtbox_x - 20 - this.scrollbarWidth, cHeaderBar.height, "Title Format (enter 'null' for nothing)", txtbox_value, "settings_textboxes_action", this.id));
			txtbox_value = p.list.groupby[listBoxCurrentId].sortOrder;
			this.elements.push(new oTextBox(3, txtbox_x, Math.ceil(cSettings.topBarHeight + rh * 8.5), ww - txtbox_x - 20 - this.scrollbarWidth, cHeaderBar.height, "Sort Order (enter 'null' for nothing)", txtbox_value, "settings_textboxes_action", this.id));

			txtbox_value = p.list.groupby[listBoxCurrentId].playlistFilter;
			this.elements.push(new oTextBox(4, txtbox_x, Math.ceil(cSettings.topBarHeight + rh * 11.0), ww - txtbox_x - 20 - this.scrollbarWidth, cHeaderBar.height, "Playlist Filter ('*' = default pattern, 'null' = nothing)", txtbox_value, "settings_textboxes_action", this.id));
			txtbox_value = p.list.groupby[listBoxCurrentId].extraRows;
			this.elements.push(new oTextBox(5, txtbox_x, Math.ceil(cSettings.topBarHeight + rh * 13.0), 30, cHeaderBar.height, "Extra Rows To Add", txtbox_value, "settings_textboxes_action", this.id));
			// Create radio buttons / group header COLLAPSED height
			var spaceBetween_w = zoom(50, g_dpi);
			// force value if set to an unauthirized one [0;4]
			if (p.list.groupby[listBoxCurrentId].collapsedHeight < 0 || p.list.groupby[listBoxCurrentId].collapsedHeight > 4) {
				p.list.groupby[listBoxCurrentId].collapsedHeight = (p.list.groupby[listBoxCurrentId].collapsedHeight < 0 ? 0 : 4);
				p.list.saveGroupBy();
			};
			var v = p.list.groupby[listBoxCurrentId].collapsedHeight;
			this.elements.push(new oRadioButton(6, txtbox_x, cSettings.topBarHeight + rh * 16.0, "0", (v == 0), "settings_radioboxes_action", this.id));
			this.elements.push(new oRadioButton(7, txtbox_x + spaceBetween_w, cSettings.topBarHeight + rh * 16.0, "1", (v == 1), "settings_radioboxes_action", this.id));
			this.elements.push(new oRadioButton(8, txtbox_x + spaceBetween_w * 2, cSettings.topBarHeight + rh * 16.0, "2", (v == 2), "settings_radioboxes_action", this.id));
			this.elements.push(new oRadioButton(9, txtbox_x + spaceBetween_w * 3, cSettings.topBarHeight + rh * 16.0, "3", (v == 3), "settings_radioboxes_action", this.id));
			this.elements.push(new oRadioButton(10, txtbox_x + spaceBetween_w * 4, cSettings.topBarHeight + rh * 16.0, "4", (v == 4), "settings_radioboxes_action", this.id));
			// Create radio buttons / group header EXPANDED height
			var spaceBetween_w = zoom(50, g_dpi);
			// force value if set to an unauthirized one [0;4]
			if (p.list.groupby[listBoxCurrentId].expandedHeight < 0 || p.list.groupby[listBoxCurrentId].expandedHeight > 4) {
				p.list.groupby[listBoxCurrentId].expandedHeight = (p.list.groupby[listBoxCurrentId].expandedHeight < 0 ? 0 : 4);
				p.list.saveGroupBy();
			};
			var v = p.list.groupby[listBoxCurrentId].expandedHeight;
			this.elements.push(new oRadioButton(11, txtbox_x, cSettings.topBarHeight + rh * 17.5, "0", (v == 0), "settings_radioboxes_action", this.id));
			this.elements.push(new oRadioButton(12, txtbox_x + spaceBetween_w, cSettings.topBarHeight + rh * 17.5, "1", (v == 1), "settings_radioboxes_action", this.id));
			this.elements.push(new oRadioButton(13, txtbox_x + spaceBetween_w * 2, cSettings.topBarHeight + rh * 17.5, "2", (v == 2), "settings_radioboxes_action", this.id));
			this.elements.push(new oRadioButton(14, txtbox_x + spaceBetween_w * 3, cSettings.topBarHeight + rh * 17.5, "3", (v == 3), "settings_radioboxes_action", this.id));
			this.elements.push(new oRadioButton(15, txtbox_x + spaceBetween_w * 4, cSettings.topBarHeight + rh * 17.5, "4", (v == 4), "settings_radioboxes_action", this.id));
			// Create checkbox Cover Art in Group Header ON/OFF
			this.elements.push(new oCheckBox(16, txtbox_x, cSettings.topBarHeight + rh * 19.5, "Enable Cover", "p.list.groupby[p.settings.pages[2].elements[0].selectedId].showCover == 0 ? false : true", "settings_checkboxes_action", this.id));
			// Create checkbox Auto-Collpase ON/OFF
			this.elements.push(new oCheckBox(17, txtbox_x, cSettings.topBarHeight + rh * 21.25, "Enable Auto-Collapse", "p.list.groupby[p.settings.pages[2].elements[0].selectedId].autoCollapse == 0 ? false : true", "settings_checkboxes_action", this.id));

			var GHF_delta = 13.0;
			var txtbox_value = p.list.groupby[listBoxCurrentId].l1;
			this.elements.push(new oTextBox(18, txtbox_x, Math.ceil(cSettings.topBarHeight + rh * (12.0 + GHF_delta)), ww - txtbox_x - 20 - this.scrollbarWidth, cHeaderBar.height, "Header line 1, left field", txtbox_value, "settings_textboxes_action", this.id));
			txtbox_value = p.list.groupby[listBoxCurrentId].r1;
			this.elements.push(new oTextBox(19, txtbox_x, Math.ceil(cSettings.topBarHeight + rh * (14.0 + GHF_delta)), ww - txtbox_x - 20 - this.scrollbarWidth, cHeaderBar.height, "Header line 1, right field", txtbox_value, "settings_textboxes_action", this.id));
			txtbox_value = p.list.groupby[listBoxCurrentId].l2;
			this.elements.push(new oTextBox(20, txtbox_x, Math.ceil(cSettings.topBarHeight + rh * (16.0 + GHF_delta)), ww - txtbox_x - 20 - this.scrollbarWidth, cHeaderBar.height, "Header line 2, left field", txtbox_value, "settings_textboxes_action", this.id));
			txtbox_value = p.list.groupby[listBoxCurrentId].r2;
			this.elements.push(new oTextBox(21, txtbox_x, Math.ceil(cSettings.topBarHeight + rh * (18.0 + GHF_delta)), ww - txtbox_x - 20 - this.scrollbarWidth, cHeaderBar.height, "Header line 2, right field", txtbox_value, "settings_textboxes_action", this.id));

			// Create radio buttons for Defaul Group Status (Collapsed OR Expanded)
			var spaceBetween_w = zoom(90, g_dpi);
			this.elements.push(new oRadioButton(22, txtbox_x, cSettings.topBarHeight + rh * 23.0, "Collapsed", (p.list.groupby[p.settings.pages[2].elements[0].selectedId].collapseGroupsByDefault == "1"), "settings_radioboxes_action", this.id));
			this.elements.push(new oRadioButton(23, txtbox_x + spaceBetween_w, cSettings.topBarHeight + rh * 23.0, "Expanded", (p.list.groupby[p.settings.pages[2].elements[0].selectedId].collapseGroupsByDefault == "0"), "settings_radioboxes_action", this.id));

			break;
		case 3: // Appearance
			var rh = cSettings.rowHeight;
			// Create checkbox enable wpp
			this.elements.push(new oCheckBox(0, 20, cSettings.topBarHeight + rh * 2.25, "Enabled", "properties.showwallpaper", "settings_checkboxes_action", this.id));

			// Create radio buttons / Wpp Image
			var spaceBetween_w = zoom(80, g_dpi);
			// force value if set to an unauthirized one (default = 0 <=> front album cover)
			if (properties.wallpapermode != 0 && properties.wallpapermode != 4 && properties.wallpapermode != -1) {
				properties.wallpapermode = 0;
				window.SetProperty("CUSTOM Wallpaper Type", properties.wallpapermode);
			};
			this.elements.push(new oRadioButton(1, txtbox_x, cSettings.topBarHeight + rh * 4.0, "Album", (properties.wallpapermode == 0), "settings_radioboxes_action", this.id));
			this.elements.push(new oRadioButton(2, txtbox_x + spaceBetween_w, cSettings.topBarHeight + rh * 4.0, "Artist", (properties.wallpapermode == 4), "settings_radioboxes_action", this.id));
			this.elements.push(new oRadioButton(3, txtbox_x + spaceBetween_w * 2, cSettings.topBarHeight + rh * 4.0, "Default", (properties.wallpapermode == -1), "settings_radioboxes_action", this.id));

			// Create checkbox blur effect
			this.elements.push(new oCheckBox(4, 20, cSettings.topBarHeight + rh * 5.75, "Blurred", "properties.wallpaperblurred", "settings_checkboxes_action", this.id));

			// Create radio buttons / Wpp alpha shading
			var spaceBetween_w = zoom(65, g_dpi);
			// force alpha value to an authorized value (default = 175 <=> 70%)
			if (properties.wallpaperalpha != 125 && properties.wallpaperalpha != 150 && properties.wallpaperalpha != 172 && properties.wallpaperalpha != 200 && properties.wallpaperalpha != 225) {
				properties.wallpaperalpha = 175;
				window.SetProperty("CUSTOM Wallpaper Alpha", properties.wallpaperalpha);
			};
			this.elements.push(new oRadioButton(5, txtbox_x, cSettings.topBarHeight + rh * 7.5, "50%", (properties.wallpaperalpha == 125), "settings_radioboxes_action", this.id));
			this.elements.push(new oRadioButton(6, txtbox_x + spaceBetween_w, cSettings.topBarHeight + rh * 7.5, "60%", (properties.wallpaperalpha == 150), "settings_radioboxes_action", this.id));
			this.elements.push(new oRadioButton(7, txtbox_x + spaceBetween_w * 2, cSettings.topBarHeight + rh * 7.5, "70%", (properties.wallpaperalpha == 175), "settings_radioboxes_action", this.id));
			this.elements.push(new oRadioButton(8, txtbox_x + spaceBetween_w * 3, cSettings.topBarHeight + rh * 7.5, "80%", (properties.wallpaperalpha == 200), "settings_radioboxes_action", this.id));
			this.elements.push(new oRadioButton(9, txtbox_x + spaceBetween_w * 4, cSettings.topBarHeight + rh * 7.5, "90%", (properties.wallpaperalpha == 225), "settings_radioboxes_action", this.id));

			// Create TextBox Wpp path of default image
			var txtbox_value = properties.wallpaperpath;
			this.elements.push(new oTextBox(10, txtbox_x, Math.ceil(cSettings.topBarHeight + rh * 8.25), ww - txtbox_x - 20 - this.scrollbarWidth, cHeaderBar.height, "Default Wallpaper Path", txtbox_value, "settings_textboxes_action", this.id));

			// Create checkbox Use custom colors
			this.elements.push(new oCheckBox(11, 20, cSettings.topBarHeight + rh * 11.0, "Enable Custom Colors", "properties.enableCustomColors", "settings_checkboxes_action", this.id));

			// Color Widgets for Custom Colors
			var wgt_w = zoom(300, g_dpi);
			var wgt_h = zoom(65, g_dpi)
				var left_padding = zoom(20, g_dpi);
			this.elements.push(new oWidget(12, txtbox_x + left_padding, Math.floor(cSettings.topBarHeight + rh * 12.00), wgt_w, wgt_h, "Custom Color - Normal Text", 0, "settings_HSLwidgets_action", this.id));
			this.elements.push(new oWidget(13, txtbox_x + left_padding, Math.floor(cSettings.topBarHeight + rh * 15.25), wgt_w, wgt_h, "Custom Color - Selected Text", 1, "settings_HSLwidgets_action", this.id));
			this.elements.push(new oWidget(14, txtbox_x + left_padding, Math.floor(cSettings.topBarHeight + rh * 18.50), wgt_w, wgt_h, "Custom Color - Normal Background", 2, "settings_HSLwidgets_action", this.id));
			this.elements.push(new oWidget(15, txtbox_x + left_padding, Math.floor(cSettings.topBarHeight + rh * 21.75), wgt_w, wgt_h, "Custom Color - Selected Background", 3, "settings_HSLwidgets_action", this.id));
			this.elements.push(new oWidget(16, txtbox_x + left_padding, Math.floor(cSettings.topBarHeight + rh * 25.00), wgt_w, wgt_h, "Custom Color - Highlight", 4, "settings_HSLwidgets_action", this.id));
			break;
		};
	};

	this.reSet = function () {
		this.elements.splice(0, this.elements.length);
		// scrollbar reset
		this.offset = 0;
		this.scrollbar.reSet(this.total_rows, cSettings.rowHeight, this.offset);
		if (this.scrollbar.visible) {
			this.scrollbarWidth = this.scrollbar.w;
		} else {
			this.scrollbarWidth = 0;
		};
		this.init();
	};

	this.setSize = function () {
		this.x = p.settings.x;
		this.y = p.settings.y + cSettings.topBarHeight;
		this.w = p.settings.w;
		this.h = p.settings.h - cSettings.topBarHeight;

		this.elements.splice(0, this.elements.length);

		// scrollbar resize
		this.offset = 0;
		this.scrollbar.reSize(p.settings.x + p.settings.w - cScrollBar.width, p.settings.y + cSettings.topBarHeight + cHeaderBar.height, cScrollBar.width, p.settings.h - cSettings.topBarHeight - cHeaderBar.height, this.total_rows, cSettings.rowHeight, this.offset);
		if (this.scrollbar.visible) {
			this.scrollbarWidth = this.scrollbar.w;
		} else {
			this.scrollbarWidth = 0;
		};
		this.init();
	};

	this.draw = function (gr) {

		var fin = this.elements.length;
		for (var i = 0; i < fin; i++) {
			this.elements[i].draw(gr);
		};

		// draw extra elements
		var rh = cSettings.rowHeight;
		var txtbox_x = 20;

		switch (this.id) {
		case 0:
			gr.GdiDrawText("Layout", gdi_font(p.settings.fontname, p.settings.txtHeight, 5), p.settings.color1, txtbox_x, cSettings.topBarHeight + rh * 1.5 - (this.offset * cSettings.rowHeight), p.settings.w - 10, p.settings.txtHeight + 10, g_LDT);
			gr.GdiDrawText("Playlist Manager", gdi_font(p.settings.fontname, p.settings.txtHeight, 5), p.settings.color1, txtbox_x, cSettings.topBarHeight + rh * 6.5 - (this.offset * cSettings.rowHeight), p.settings.w - 10, p.settings.txtHeight + 10, g_LDT);
			gr.GdiDrawText("Tagging", gdi_font(p.settings.fontname, p.settings.txtHeight, 5), p.settings.color1, txtbox_x, cSettings.topBarHeight + rh * 9.5 - (this.offset * cSettings.rowHeight), p.settings.w - 10, p.settings.txtHeight + 10, g_LDT);
			gr.GdiDrawText("Behaviour", gdi_font(p.settings.fontname, p.settings.txtHeight, 5), p.settings.color1, txtbox_x, cSettings.topBarHeight + rh * 11.5 - (this.offset * cSettings.rowHeight), p.settings.w - 10, p.settings.txtHeight + 10, g_LDT);
			gr.GdiDrawText("Default Playlist Action", gdi_font(p.settings.fontname, p.settings.txtHeight, 5), p.settings.color1, txtbox_x, cSettings.topBarHeight + rh * 14.5 - (this.offset * cSettings.rowHeight), p.settings.w - 10, p.settings.txtHeight + 10, g_LDT);
			break;
		case 1:
			var listBoxWidth = zoom(100, g_dpi);
			gr.GdiDrawText("Status", gdi_font(p.settings.fontname, p.settings.txtHeight, 5), p.settings.color1, txtbox_x, cSettings.topBarHeight + rh * 4.5 - (this.offset * cSettings.rowHeight), p.settings.w - 10, p.settings.txtHeight + 10, g_LDT);
			gr.GdiDrawText("Text Alignment", gdi_font(p.settings.fontname, p.settings.txtHeight, 5), p.settings.color1, txtbox_x, cSettings.topBarHeight + rh * 14.5 - (this.offset * cSettings.rowHeight), p.settings.w - 10, p.settings.txtHeight + 10, g_LDT);

			// new column button
			var nx = 20 + listBoxWidth + zoom(30, g_dpi);
			var ny = Math.floor(cSettings.topBarHeight + rh * 2.1) - (this.offset * cSettings.rowHeight);
			if (p.headerBar.columns.length < properties.max_columns) {
				p.settings.newbutton.draw(gr, nx, ny, 255);
			} else {
				gr.DrawImage(p.settings.newColumn_no, nx, ny, p.settings.newColumn_no.Width, p.settings.newColumn_no.Height, 0, 0, p.settings.newColumn_no.Width, p.settings.newColumn_no.Height, 0, 255);
			};
			// delete user column button
			var spaceBetween_w = g_z10;
			var dx = 20 + listBoxWidth + zoom(30, g_dpi);
			var dy = Math.floor(cSettings.topBarHeight + rh * 2.1 + zoom(5, g_dpi) + p.settings.newColumn_no.Height) - (this.offset * cSettings.rowHeight);
			var idx = p.settings.pages[1].elements[0].selectedId;
			var ref = p.headerBar.columns[idx].ref;
			if (ref.substr(0, 6) == "Custom") {
				p.settings.delbutton.draw(gr, dx, dy, 255);
			} else {
				gr.DrawImage(p.settings.delColumn_no, dx, dy, p.settings.delColumn_no.Width, p.settings.delColumn_no.Height, 0, 0, p.settings.delColumn_no.Width, p.settings.delColumn_no.Height, 0, 255);
			};
			break;
		case 2:
			var listBoxWidth = zoom(170, g_dpi);
			// new pattern button
			var nx = 20 + listBoxWidth + zoom(30, g_dpi);
			var ny = Math.floor(cSettings.topBarHeight + rh * 2.1) - (this.offset * cSettings.rowHeight);
			if (p.headerBar.columns.length < properties.max_columns) {
				p.settings.newbuttonPattern.draw(gr, nx, ny, 255);
			} else {
				gr.DrawImage(p.settings.newPattern_no, nx, ny, p.settings.newPattern_no.Width, p.settings.newPattern_no.Height, 0, 0, p.settings.newPattern_no.Width, p.settings.newPattern_no.Height, 0, 255);
			};
			// delete pattern button
			var spaceBetween_w = g_z10;
			var dx = 20 + listBoxWidth + zoom(30, g_dpi);
			var dy = Math.floor(cSettings.topBarHeight + rh * 2.1 + zoom(5, g_dpi) + p.settings.newPattern_no.Height) - (this.offset * cSettings.rowHeight);
			var idx = p.settings.pages[2].elements[0].selectedId;
			var ref = p.list.groupby[idx].ref;
			if (ref.substr(0, 6) == "Custom") {
				p.settings.delbuttonPattern.draw(gr, dx, dy, 255);
			} else {
				gr.DrawImage(p.settings.delPattern_no, dx, dy, p.settings.delPattern_no.Width, p.settings.delPattern_no.Height, 0, 0, p.settings.delPattern_no.Width, p.settings.delPattern_no.Height, 0, 255);
			};

			gr.FillSolidRect(txtbox_x, cSettings.topBarHeight + rh * 10.75 - (this.offset * cSettings.rowHeight), p.settings.w - 20 * 2 - cScrollBar.width, cHeaderBar.borderWidth, p.settings.color1);

			gr.GdiDrawText("Collapsed Row Height", gdi_font(p.settings.fontname, p.settings.txtHeight, 5), p.settings.color1, txtbox_x, cSettings.topBarHeight + rh * 15.25 - (this.offset * cSettings.rowHeight), p.settings.w - 10, p.settings.txtHeight + 10, g_LDT);
			gr.GdiDrawText("Expanded Row Height", gdi_font(p.settings.fontname, p.settings.txtHeight, 5), p.settings.color1, txtbox_x, cSettings.topBarHeight + rh * 16.75 - (this.offset * cSettings.rowHeight), p.settings.w - 10, p.settings.txtHeight + 10, g_LDT);
			gr.GdiDrawText("Cover Art Status", gdi_font(p.settings.fontname, p.settings.txtHeight, 5), p.settings.color1, txtbox_x, cSettings.topBarHeight + rh * 18.75 - (this.offset * cSettings.rowHeight), p.settings.w - 10, p.settings.txtHeight + 10, g_LDT);
			gr.GdiDrawText("Auto-Collapse Status", gdi_font(p.settings.fontname, p.settings.txtHeight, 5), p.settings.color1, txtbox_x, cSettings.topBarHeight + rh * 20.5 - (this.offset * cSettings.rowHeight), p.settings.w - 10, p.settings.txtHeight + 10, g_LDT);
			gr.GdiDrawText("Default Group Status", gdi_font(p.settings.fontname, p.settings.txtHeight, 5), p.settings.color1, txtbox_x, cSettings.topBarHeight + rh * 22.25 - (this.offset * cSettings.rowHeight), p.settings.w - 10, p.settings.txtHeight + 10, g_LDT);

			var GHF_delta = 13.0;
			gr.GdiDrawText("Group Header Fields", gdi_font(p.settings.fontname, p.settings.txtHeight * 1.5, 5), p.settings.color2, txtbox_x, cSettings.topBarHeight + rh * (11.0 + GHF_delta) - (this.offset * cSettings.rowHeight), p.settings.w - 10, p.settings.txtHeight + 10, g_LDT);

			break;
		case 3:
			gr.GdiDrawText("Wallpaper Status", gdi_font(p.settings.fontname, p.settings.txtHeight, 5), p.settings.color1, txtbox_x, cSettings.topBarHeight + rh * 1.5 - (this.offset * cSettings.rowHeight), p.settings.w - 10, p.settings.txtHeight + 10, g_LDT);
			gr.GdiDrawText("Wallpaper Image", gdi_font(p.settings.fontname, p.settings.txtHeight, 5), p.settings.color1, txtbox_x, cSettings.topBarHeight + rh * 3.25 - (this.offset * cSettings.rowHeight), p.settings.w - 10, p.settings.txtHeight + 10, g_LDT);
			gr.GdiDrawText("Wallpaper Effects", gdi_font(p.settings.fontname, p.settings.txtHeight, 5), p.settings.color1, txtbox_x, cSettings.topBarHeight + rh * 5.0 - (this.offset * cSettings.rowHeight), p.settings.w - 10, p.settings.txtHeight + 10, g_LDT);
			gr.GdiDrawText("Wallpaper Alpha Shading", gdi_font(p.settings.fontname, p.settings.txtHeight, 5), p.settings.color1, txtbox_x, cSettings.topBarHeight + rh * 6.75 - (this.offset * cSettings.rowHeight), p.settings.w - 10, p.settings.txtHeight + 10, g_LDT);
			gr.GdiDrawText("Customize Panel Colors", gdi_font(p.settings.fontname, p.settings.txtHeight, 5), p.settings.color1, txtbox_x, cSettings.topBarHeight + rh * 10.25 - (this.offset * cSettings.rowHeight), p.settings.w - 10, p.settings.txtHeight + 10, g_LDT);
			break;
		};

		// draw scrollbar
		if (this.scrollbarWidth > 0) {
			this.scrollbar.drawXY(gr, p.settings.x + p.settings.w - cScrollBar.width, p.settings.y + cSettings.topBarHeight + cHeaderBar.height);
		};
	};

	this.newButtonCheck = function (event, x, y) {
		var fin;

		if (p.headerBar.columns.length >= properties.max_columns)
			return;

		var state = p.settings.newbutton.checkstate(event, x, y);
		switch (event) {
		case "up":
			if (state == ButtonStates.hover) {
				// action
				var no_user = 1;
				var tmp_array = [];
				// copy columns array to a tmp array in order to sort it
				fin = p.headerBar.columns.length;
				for (var i = 0; i < fin; i++) {
					tmp_array.push(p.headerBar.columns[i].ref);
				};
				tmp_array.sort();
				// get free number to affect to the new User column to create
				fin = tmp_array.length;
				for (var i = 0; i < fin; i++) {
					if (tmp_array[i].substr(0, 6) == "Custom") {
						if (tmp_array[i].substr(tmp_array[i].length - 2, 2) == num(no_user, 2)) {
							no_user++;
						};
					};
				};

				p.headerBar.columns.push(new oColumn("Custom " + num(no_user, 2), "null", "null", 0, "Custom " + num(no_user, 2), 0, "null"));
				p.headerBar.totalColumns++;
				window.SetProperty("SYSTEM.HeaderBar.TotalColumns", p.headerBar.totalColumns);
				var arr = [];
				fin = p.headerBar.columns.length;
				for (var i = 0; i < fin; i++) {
					arr.push(p.headerBar.columns[i].ref);
				};
				p.settings.pages[1].elements[0].reSet(arr);
				p.headerBar.saveColumns();
				p.settings.pages[1].elements[0].showSelected(p.headerBar.columns.length - 1);
				full_repaint();
			};
			break;
		};
		return state;
	};

	this.delButtonCheck = function (event, x, y) {
		var fin;

		if (p.headerBar.columns.length <= 14)
			return;

		var state = p.settings.delbutton.checkstate(event, x, y);
		switch (event) {
		case "up":
			if (state == ButtonStates.hover) {
				// action
				var idx = p.settings.pages[1].elements[0].selectedId;
				var ref = p.headerBar.columns[idx].ref;
				if (ref.substr(0, 6) == "Custom") {
					// if the column is visible, percent are to be adjusted on other visible columns before deletinf it
					if (p.headerBar.columns[idx].percent > 0) {
						// check if it's not the last column visible, otherwise, we coundn't hide it!
						var nbvis = 0;
						fin = p.headerBar.columns.length;
						for (var k = 0; k < fin; k++) {
							if (p.headerBar.columns[k].percent > 0) {
								nbvis++;
							};
						};
						if (nbvis > 1) {
							var RemovedColumnSize = Math.abs(p.headerBar.columns[idx].percent);
							p.headerBar.columns[idx].percent = 0;
							var totalColsToResizeUp = 0;
							var last_idx = 0;
							fin = p.headerBar.columns.length;
							for (var k = 0; k < fin; k++) {
								if (k != idx && p.headerBar.columns[k].percent > 0) {
									totalColsToResizeUp++;
									last_idx = k;
								};
							};
							var add_value = Math.floor(RemovedColumnSize / totalColsToResizeUp);
							var reste = RemovedColumnSize - (add_value * totalColsToResizeUp);
							fin = p.headerBar.columns.length;
							for (var k = 0; k < fin; k++) {
								if (k != idx && p.headerBar.columns[k].percent > 0) {
									p.headerBar.columns[k].percent = Math.abs(p.headerBar.columns[k].percent) + add_value;
									if (reste > 0 && k == last_idx) {
										p.headerBar.columns[k].percent = Math.abs(p.headerBar.columns[k].percent) + reste;
									};
								};
								p.headerBar.columns[k].w = Math.abs(p.headerBar.w * p.headerBar.columns[k].percent / 100000);
							};
						} else {
							// it's the last column visible, delete not possile for now !!!
							return false;
						};
					};
					// ok, NOW we can delete this column, let's do it!
					var tmp_array = p.headerBar.columns.slice(0, p.headerBar.columns.length);
					p.headerBar.columns.splice(0, p.headerBar.columns.length);
					fin = tmp_array.length;
					for (var i = 0; i < fin; i++) {
						if (i != idx) {
							p.headerBar.columns.push(tmp_array[i]);
						};
					};
					//
					p.headerBar.totalColumns--;
					window.SetProperty("SYSTEM.HeaderBar.TotalColumns", p.headerBar.totalColumns);
					var arr = [];
					fin = p.headerBar.columns.length;
					for (var i = 0; i < fin; i++) {
						arr.push(p.headerBar.columns[i].ref);
					};
					p.settings.pages[1].elements[0].reSet(arr);
					p.headerBar.saveColumns();
					var new_idx = (idx == 0 ? 0 : idx - 1);
					p.settings.pages[1].elements[0].showSelected(new_idx);
					full_repaint();
				} else {
					// we could not delete a native column!
					return false;
				};
			};
			break;
		};
		return state;
	};

	this.newButtonPatternCheck = function (event, x, y) {
		var fin;

		if (p.list.groupby.length >= properties.max_patterns)
			return;

		var state = p.settings.newbuttonPattern.checkstate(event, x, y);
		switch (event) {
		case "up":
			if (state == ButtonStates.hover) {
				// action
				p.list.groupby.push(new oGroupBy("Pattern to customize", "null", "null", "Custom", "null", "0", "2", "3", "1", "0", "-", "-", "-", "-", "0"));
				p.list.totalGroupBy++;
				window.SetProperty("SYSTEM.Groups.TotalGroupBy", p.list.totalGroupBy);
				var arr = [];
				fin = p.list.groupby.length;
				for (var i = 0; i < fin; i++) {
					arr.push(p.list.groupby[i].label);
				};
				p.settings.pages[2].elements[0].reSet(arr);
				p.list.saveGroupBy();
				p.settings.pages[2].elements[0].showSelected(p.list.groupby.length - 1);
				full_repaint();
			};
			break;
		};
		return state;
	};

	this.delButtonPatternCheck = function (event, x, y) {
		var fin;

		if (p.headerBar.columns.length <= 2)
			return;

		var state = p.settings.delbuttonPattern.checkstate(event, x, y);
		switch (event) {
		case "up":
			if (state == ButtonStates.hover) {
				// action
				var idx = p.settings.pages[2].elements[0].selectedId;
				var ref = p.list.groupby[idx].ref;
				if (ref.substr(0, 6) == "Custom") {
					var tmp_array = p.list.groupby.slice(0, p.list.groupby.length);
					p.list.groupby.splice(0, p.list.groupby.length);
					fin = tmp_array.length;
					for (var i = 0; i < fin; i++) {
						if (i != idx) {
							p.list.groupby.push(tmp_array[i]);
						};
					};
					p.list.totalGroupBy--;
					window.SetProperty("SYSTEM.Groups.TotalGroupBy", p.list.totalGroupBy);
					var arr = [];
					fin = p.list.groupby.length;
					for (var i = 0; i < fin; i++) {
						arr.push(p.list.groupby[i].label);
					};
					p.settings.pages[2].elements[0].reSet(arr);
					p.list.saveGroupBy();
					var new_idx = (idx == 0 ? 0 : idx - 1);
					p.settings.pages[2].elements[0].showSelected(new_idx);

					// reset pattern index after removing the selected one
					if (idx == cGroup.pattern_idx) {
						cGroup.pattern_idx = 0;
						window.SetProperty("SYSTEM.Groups.Pattern Index", cGroup.pattern_idx);
						plman.SortByFormatV2(plman.ActivePlaylist, p.list.groupby[cGroup.pattern_idx].sortOrder, 1);
						p.list.updateHandleList(plman.ActivePlaylist, false);
						p.list.setItems(true);
						p.scrollbar.setCursor(p.list.totalRowVisible, p.list.totalRows, p.list.offset);
					};
					full_repaint();
				} else {
					// we could not delete a native "Group By" pattern!
					return false;
				};
			};
			break;
		};
		return state;
	};

	this.on_mouse = function (event, x, y, delta) {
		this.ishover = (x >= this.x && x <= this.x + this.w && y >= this.y && y <= this.y + this.h);
		switch (this.id) {
		case 1:
			var isHoverListBox = this.elements[0].isHoverObject(x, y);
			break;
		case 2:
			var isHoverListBox = this.elements[0].isHoverObject(x, y);
			break;
		default:
			var isHoverListBox = false;
		};

		switch (event) {
		case "dblclk":
			this.on_mouse("down", x, y);
			break;
		case "down":
		case "up":
		case "move":
		case "wheel":
			if (this.ishover) {
				if (!isHoverListBox) {
					if (this.scrollbar.visible) {
						this.scrollbar.check(event, x, y, delta);
					};
				};
			};
			break;
		};

		switch (this.id) {
		case 1:
			if (this.delButtonCheck(event, x, y) != ButtonStates.hover) {
				if (this.newButtonCheck(event, x, y) != ButtonStates.hover) {
					var fin = this.elements.length;
					for (var i = 0; i < fin; i++) {
						this.elements[i].on_mouse(event, x, y, delta);
					};
				};
			};
			break;
		case 2:
			if (this.delButtonPatternCheck(event, x, y) != ButtonStates.hover) {
				if (this.newButtonPatternCheck(event, x, y) != ButtonStates.hover) {
					var fin = this.elements.length;
					for (var i = 0; i < fin; i++) {
						this.elements[i].on_mouse(event, x, y, delta);
					};
				};
			};
			break;
		default:
			var fin = this.elements.length;
			for (var i = 0; i < fin; i++) {
				this.elements[i].on_mouse(event, x, y, delta);
			};
		};
	};
};

oSettings = function () {
	// inputbox variables
	var temp_bmp = gdi.CreateImage(1, 1);
	var temp_gr = temp_bmp.GetGraphics();
	var g_timer_cursor = false;
	var g_cursor_state = true;

	this.pages = [];
	this.currentPageId = 0;
	this.tabButtons = [];

	// font
	this.fontname = "segoe ui";
	// var for custom color settings (widgets/sliders)
	this.color_updated = false;
	this.colorWidgetFocusedId = -1;
	this.colorSliderFocusedId = -1;

	this.setColors = function () {
		// colors
		this.color0 = blendColors(g_color_normal_bg, g_color_normal_txt, 0.15);
		this.color1 = blendColors(g_color_normal_bg, g_color_normal_txt, 0.5);
		this.color2 = g_color_normal_txt;
		this.color3 = g_color_normal_bg;
	};
	this.setColors();

	this.repaint = function () {
		full_repaint();
	};

	this.setButtons = function () {

		var pic = gdi.CreateImage(500, 200);
		gpic = pic.GetGraphics();
		var button_zoomSize = 0,
		button_zoomSizeW = 0,
		button_zoomSizeH = 0,
		rect_w = 0;
		var lineWidth = zoom(1.5, g_dpi);
		this.font = gdi_font("segoe ui", zoom(12, g_dpi), 1);

		// Add a Custom Column
		rect_w = gpic.CalcTextWidth("Delete Column", this.font) + zoom(30, g_dpi);
		this.newColumn_off = gdi.CreateImage(rect_w, zoom(32, g_dpi));
		gb = this.newColumn_off.GetGraphics();
		gb.SetSmoothingMode(2);
		gb.FillRoundRect(1, 1, rect_w - lineWidth * 2, zoom(28, g_dpi), zoom(5, g_dpi), zoom(5, g_dpi), this.color1);
		gb.SetTextRenderingHint(5);
		gb.DrawString("New Column", this.font, this.color2, 1, 1, rect_w - lineWidth * 2, zoom(28, g_dpi), cc_stringformat);
		this.newColumn_off.ReleaseGraphics(gb);

		rect_w = gpic.CalcTextWidth("Delete Column", this.font) + zoom(30, g_dpi);
		this.newColumn_ov = gdi.CreateImage(rect_w, zoom(32, g_dpi));
		gb = this.newColumn_ov.GetGraphics();
		gb.SetSmoothingMode(2);
		gb.DrawRoundRect(1, 1, rect_w - lineWidth * 2, zoom(28, g_dpi), zoom(5, g_dpi), zoom(5, g_dpi), lineWidth, this.color1);
		gb.SetTextRenderingHint(3);
		gb.DrawString("New Column", this.font, this.color2, 1, 1, rect_w - lineWidth * 2, zoom(28, g_dpi), cc_stringformat);
		this.newColumn_ov.ReleaseGraphics(gb);

		rect_w = gpic.CalcTextWidth("Delete Column", this.font) + zoom(30, g_dpi);
		this.newColumn_no = gdi.CreateImage(rect_w, zoom(32, g_dpi));
		gb = this.newColumn_no.GetGraphics();
		gb.SetSmoothingMode(2);
		gb.FillRoundRect(1, 1, rect_w - lineWidth * 2, zoom(28, g_dpi), zoom(5, g_dpi), zoom(5, g_dpi), this.color0);
		gb.SetTextRenderingHint(5);
		gb.DrawString("New Column", this.font, this.color3, 1, 1, rect_w - lineWidth * 2, zoom(28, g_dpi), cc_stringformat);
		this.newColumn_no.ReleaseGraphics(gb);

		this.newbutton = new button(this.newColumn_off, this.newColumn_ov, this.newColumn_ov);

		// Delete a Custom Column
		rect_w = gpic.CalcTextWidth("Delete Column", this.font) + zoom(30, g_dpi);
		this.delColumn_off = gdi.CreateImage(rect_w, zoom(32, g_dpi));
		gb = this.delColumn_off.GetGraphics();
		gb.SetSmoothingMode(2);
		gb.FillRoundRect(1, 1, rect_w - lineWidth * 2, zoom(28, g_dpi), zoom(5, g_dpi), zoom(5, g_dpi), this.color1);
		gb.SetTextRenderingHint(5);
		gb.DrawString("Delete Column", this.font, this.color2, 1, 1, rect_w - lineWidth * 2, zoom(28, g_dpi), cc_stringformat);
		this.delColumn_off.ReleaseGraphics(gb);

		rect_w = gpic.CalcTextWidth("Delete Column", this.font) + zoom(30, g_dpi);
		this.delColumn_ov = gdi.CreateImage(rect_w, zoom(32, g_dpi));
		gb = this.delColumn_ov.GetGraphics();
		gb.SetSmoothingMode(2);
		gb.DrawRoundRect(1, 1, rect_w - lineWidth * 2, zoom(28, g_dpi), zoom(5, g_dpi), zoom(5, g_dpi), lineWidth, this.color1);
		gb.SetTextRenderingHint(3);
		gb.DrawString("Delete Column", this.font, this.color2, 1, 1, rect_w - lineWidth * 2, zoom(28, g_dpi), cc_stringformat);
		this.delColumn_ov.ReleaseGraphics(gb);

		rect_w = gpic.CalcTextWidth("Delete Column", this.font) + zoom(30, g_dpi);
		this.delColumn_no = gdi.CreateImage(rect_w, zoom(32, g_dpi));
		gb = this.delColumn_no.GetGraphics();
		gb.SetSmoothingMode(2);
		gb.FillRoundRect(1, 1, rect_w - lineWidth * 2, zoom(28, g_dpi), zoom(5, g_dpi), zoom(5, g_dpi), this.color0);
		gb.SetTextRenderingHint(5);
		gb.DrawString("Delete Column", this.font, this.color3, 1, 1, rect_w - lineWidth * 2, zoom(28, g_dpi), cc_stringformat);
		this.delColumn_no.ReleaseGraphics(gb);

		this.delbutton = new button(this.delColumn_off, this.delColumn_ov, this.delColumn_ov);

		// Add a Custom "Group By" Pattern
		rect_w = gpic.CalcTextWidth("Delete Pattern", this.font) + zoom(30, g_dpi);
		this.newPattern_off = gdi.CreateImage(rect_w, zoom(32, g_dpi));
		gb = this.newPattern_off.GetGraphics();
		gb.SetSmoothingMode(2);
		gb.FillRoundRect(1, 1, rect_w - lineWidth * 2, zoom(28, g_dpi), zoom(5, g_dpi), zoom(5, g_dpi), this.color1);
		gb.SetTextRenderingHint(5);
		gb.DrawString("New Pattern", this.font, this.color2, 1, 1, rect_w - lineWidth * 2, zoom(28, g_dpi), cc_stringformat);
		this.newPattern_off.ReleaseGraphics(gb);

		rect_w = gpic.CalcTextWidth("Delete Pattern", this.font) + zoom(30, g_dpi);
		this.newPattern_ov = gdi.CreateImage(rect_w, zoom(32, g_dpi));
		gb = this.newPattern_ov.GetGraphics();
		gb.SetSmoothingMode(2);
		gb.DrawRoundRect(1, 1, rect_w - lineWidth * 2, zoom(28, g_dpi), zoom(5, g_dpi), zoom(5, g_dpi), lineWidth, this.color1);
		gb.SetTextRenderingHint(3);
		gb.DrawString("New Pattern", this.font, this.color2, 1, 1, rect_w - lineWidth * 2, zoom(28, g_dpi), cc_stringformat);
		this.newPattern_ov.ReleaseGraphics(gb);

		rect_w = gpic.CalcTextWidth("Delete Pattern", this.font) + zoom(30, g_dpi);
		this.newPattern_no = gdi.CreateImage(rect_w, zoom(32, g_dpi));
		gb = this.newPattern_no.GetGraphics();
		gb.SetSmoothingMode(2);
		gb.FillRoundRect(1, 1, rect_w - lineWidth * 2, zoom(28, g_dpi), zoom(5, g_dpi), zoom(5, g_dpi), this.color0);
		gb.SetTextRenderingHint(5);
		gb.DrawString("New Pattern", this.font, this.color3, 1, 1, rect_w - lineWidth * 2, zoom(28, g_dpi), cc_stringformat);
		this.newPattern_no.ReleaseGraphics(gb);

		this.newbuttonPattern = new button(this.newPattern_off, this.newPattern_ov, this.newPattern_ov);

		// Delete a Custom "Group By" Pattern
		rect_w = gpic.CalcTextWidth("Delete Pattern", this.font) + zoom(30, g_dpi);
		this.delPattern_off = gdi.CreateImage(rect_w, zoom(32, g_dpi));
		gb = this.delPattern_off.GetGraphics();
		gb.SetSmoothingMode(2);
		gb.FillRoundRect(1, 1, rect_w - lineWidth * 2, zoom(28, g_dpi), zoom(5, g_dpi), zoom(5, g_dpi), this.color1);
		gb.SetTextRenderingHint(5);
		gb.DrawString("Delete Pattern", this.font, this.color2, 1, 1, rect_w - lineWidth * 2, zoom(28, g_dpi), cc_stringformat);
		this.delPattern_off.ReleaseGraphics(gb);

		rect_w = gpic.CalcTextWidth("Delete Pattern", this.font) + zoom(30, g_dpi);
		this.delPattern_ov = gdi.CreateImage(rect_w, zoom(32, g_dpi));
		gb = this.delPattern_ov.GetGraphics();
		gb.SetSmoothingMode(2);
		gb.DrawRoundRect(1, 1, rect_w - lineWidth * 2, zoom(28, g_dpi), zoom(5, g_dpi), zoom(5, g_dpi), lineWidth, this.color1);
		gb.SetTextRenderingHint(3);
		gb.DrawString("Delete Pattern", this.font, this.color2, 1, 1, rect_w - lineWidth * 2, zoom(28, g_dpi), cc_stringformat);
		this.delPattern_ov.ReleaseGraphics(gb);

		rect_w = gpic.CalcTextWidth("Delete Pattern", this.font) + zoom(30, g_dpi);
		this.delPattern_no = gdi.CreateImage(rect_w, zoom(32, g_dpi));
		gb = this.delPattern_no.GetGraphics();
		gb.SetSmoothingMode(2);
		gb.FillRoundRect(1, 1, rect_w - lineWidth * 2, zoom(28, g_dpi), zoom(5, g_dpi), zoom(5, g_dpi), this.color0);
		gb.SetTextRenderingHint(5);
		gb.DrawString("Delete Pattern", this.font, this.color3, 1, 1, rect_w - lineWidth * 2, zoom(28, g_dpi), cc_stringformat);
		this.delPattern_no.ReleaseGraphics(gb);

		this.delbuttonPattern = new button(this.delPattern_off, this.delPattern_ov, this.delPattern_ov);

		// Close Settings Button (BACK)
		this.close_off = gdi.CreateImage(zoom(25, 300), zoom(25, 300));
		gb = this.close_off.GetGraphics();
		gb.SetSmoothingMode(2);
		gb.DrawEllipse(zoom(1, 300), zoom(1, 300), zoom(22, 300), zoom(22, 300), zoom(2.0, 300), this.color2);
		gb.DrawEllipse(0, 0, zoom(24, 300), zoom(24, 300), 1.0, RGBA(0, 0, 0, 100));
		gb.DrawEllipse(zoom(2, 300), zoom(2, 300), zoom(20, 300), zoom(20, 300), zoom(1.0, 300), RGBA(0, 0, 0, 50));
		gb.SetSmoothingMode(0);
		gb.FillSolidRect(zoom(6, 300), zoom(12, 300), zoom(13, 300), zoom(2.0, 300), this.color2);
		gb.DrawLine(zoom(6, 300), zoom(12, 300), zoom(11, 300), zoom(7, 300), zoom(1.0, 300), this.color2);
		gb.DrawLine(zoom(7, 300), zoom(12, 300), zoom(12, 300), zoom(7, 300), zoom(1.0, 300), this.color2);
		gb.DrawLine(zoom(6, 300), zoom(13, 300), zoom(11, 300), zoom(18, 300), zoom(1.0, 300), this.color2);
		gb.DrawLine(zoom(7, 300), zoom(13, 300), zoom(12, 300), zoom(18, 300), zoom(1.0, 300), this.color2);
		this.close_off.ReleaseGraphics(gb);

		this.close_ov = gdi.CreateImage(zoom(25, 300), zoom(25, 300));
		gb = this.close_ov.GetGraphics();
		gb.SetSmoothingMode(2);
		gb.DrawEllipse(zoom(1, 300), zoom(1, 300), zoom(22, 300), zoom(22, 300), zoom(2.0, 300), this.color1);
		gb.DrawEllipse(0, 0, zoom(24, 300), zoom(24, 300), 1.0, RGBA(0, 0, 0, 50));
		gb.DrawEllipse(zoom(2, 300), zoom(2, 300), zoom(20, 300), zoom(20, 300), zoom(1.0, 300), RGBA(0, 0, 0, 25));
		gb.SetSmoothingMode(0);
		gb.FillSolidRect(zoom(6, 300), zoom(12, 300), zoom(13, 300), zoom(2.0, 300), this.color1);
		gb.DrawLine(zoom(6, 300), zoom(12, 300), zoom(11, 300), zoom(7, 300), zoom(1.0, 300), this.color1);
		gb.DrawLine(zoom(7, 300), zoom(12, 300), zoom(12, 300), zoom(7, 300), zoom(1.0, 300), this.color1);
		gb.DrawLine(zoom(6, 300), zoom(13, 300), zoom(11, 300), zoom(18, 300), zoom(1.0, 300), this.color1);
		gb.DrawLine(zoom(7, 300), zoom(13, 300), zoom(12, 300), zoom(18, 300), zoom(1.0, 300), this.color1);
		this.close_ov.ReleaseGraphics(gb);

		button_zoomSize = Math.ceil(25 * g_dpi / 100);
		this.closebutton = new button(this.close_off.Resize(button_zoomSize, button_zoomSize, 7), this.close_ov.Resize(button_zoomSize, button_zoomSize, 7), this.close_ov.Resize(button_zoomSize, button_zoomSize, 7));

		pic.ReleaseGraphics(gpic);
	};

	this.refreshColors = function () {
		get_colors();
		this.setColors();
		this.setButtons();

		for (var p = 0; p < this.pages.length; p++) {
			this.pages[p].scrollbar.setCustomColors(g_color_normal_bg, g_color_normal_txt);
			for (var e = 0; e < this.pages[p].elements.length; e++) {
				switch (this.pages[p].elements[e].objType) {
				case "CB":
				case "RB":
					this.pages[p].elements[e].setButtons();
					break;
				};
			};
		};
		full_repaint();
	};

	this.setSize = function (x, y, w, h) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.txtHeight = zoom(12, g_dpi);

		this.setButtons();

		if (this.pages.length <= 0) {
			this.pages.push(new oPage(0, "p.settings.pages[0]", "General", 16));
			this.pages.push(new oPage(1, "p.settings.pages[1]", "Columns", 16));
			this.pages.push(new oPage(2, "p.settings.pages[2]", "Groups", 33));
			this.pages.push(new oPage(3, "p.settings.pages[3]", "Appearance", 28));
		};
		var fin = this.pages.length;
		for (var i = 0; i < fin; i++) {
			this.pages[i].setSize();
		};
	};

	this.draw = function (gr) {
		var padding = 10;
		var titleTxtHeight = zoom(21, g_dpi);
		var tx = 20,
		ty = cSettings.topBarHeight - zoom(1, g_dpi),
		tw = 0,
		th = this.txtHeight + zoom(10, g_dpi) + cHeaderBar.borderWidth,
		tpad = 10 + cSettings.tabPaddingWidth,
		cx = 0,
		cw = 0;
		var tabFont = gdi_font(this.fontname, this.txtHeight, 3);

		// draw main background
		gr.FillSolidRect(this.x, this.y, this.w, this.h, g_color_normal_bg);
		gr.SetSmoothingMode(2);

		// draw current page content
		this.pages[this.currentPageId].draw(gr);

		gr.FillSolidRect(this.x, this.y + (ty + th), this.w - cScrollBar.width, zoom(4, g_dpi), g_color_normal_bg);
		gr.FillGradRect(this.x, this.y + (ty + th) + zoom(4, g_dpi), this.w - cScrollBar.width, g_z10, 87, g_color_normal_bg, 0, 1.0);

		// draw top background
		gr.FillSolidRect(this.x, this.y, this.w, (ty + th), blendColors(g_color_normal_bg, g_color_normal_txt, 0.05));
		gr.FillGradRect(this.x, this.y + (ty + th) - zoom(4, g_dpi), this.w, zoom(4, g_dpi), 87, 0, RGBA(0, 0, 0, 20), 1.0);

		// draw close button
		this.closebutton.draw(gr, this.x + 13, this.y + 10, 255);
		// draw Panel Title
		var title_x = this.x + this.closebutton.w + 20;
		gr.SetTextRenderingHint(3);
		gr.DrawString("Panel Settings", gdi_font(this.fontname, titleTxtHeight, 3), this.color2, title_x, this.y + 6, this.w - 50, cSettings.topBarHeight + 10, lt_stringformat);
		// draw panel version
		var version_x = this.x;
		gr.DrawString("v" + g_script_version, gdi_font(g_fname, g_fsize - 1, 0), this.color1, version_x, this.y, this.w - 4, ty + th - 4, rb_stringformat);
		gr.SetSmoothingMode(0);

		// draw page switcher (tabs!)
		this.tabButtons.splice(0, this.tabButtons.length);
		var gt = null;
		var fin = this.pages.length;
		for (var i = 0; i < fin; i++) {
			tw = gr.CalcTextWidth(this.pages[i].label, tabFont);
			if (i == this.currentPageId) {
				cx = tx;
				cw = tw + tpad * 2;
			};

			// image off
			tmp_tab_img_off = gdi.CreateImage(tw + tpad * 2, th + 4);
			gt = tmp_tab_img_off.GetGraphics();
			gt.SetTextRenderingHint(3);
			gt.DrawString(this.pages[i].label, tabFont, this.color1, tpad, 1, tw + tpad, th, lc_stringformat);
			tmp_tab_img_off.ReleaseGraphics(gt);
			// image on
			tmp_tab_img_on = gdi.CreateImage(tw + tpad * 2, th + 4);
			gt = tmp_tab_img_on.GetGraphics();
			gt.SetTextRenderingHint(3);
			tmp_tab_img_on.ReleaseGraphics(gt);
			// create tab button object
			this.tabButtons.push(new button(tmp_tab_img_off, tmp_tab_img_on, tmp_tab_img_on));

			this.tabButtons[i].draw(gr, tx, ty - 3, 255);
			tx += tw + tpad * 2;
		};

		// active tab bg
		gr.FillSolidRect(cx + zoom(1, g_dpi), ty - g_z2, cw - zoom(1, g_dpi), th + zoom(4.0, g_dpi), g_color_normal_bg);

		// draw tab lineart
		var lineStrength = zoom(1.0, g_dpi);
		gr.FillSolidRect(0, ty + th, cx + lineStrength, lineStrength, this.color1);
		gr.FillSolidRect(cx, ty - zoom(3.0, g_dpi), lineStrength, th + zoom(4.0, g_dpi), this.color1);
		gr.FillSolidRect(cx, ty - zoom(3.0, g_dpi), cw, lineStrength, this.color1);
		gr.FillSolidRect(cx + cw, ty - zoom(3.0, g_dpi), lineStrength, th + zoom(4.0, g_dpi), this.color1);
		gr.FillSolidRect(cx + cw, ty + th, ww - cw - cx, lineStrength, this.color1);
		// active tab text
		gr.SetTextRenderingHint(3);
		gr.DrawString(this.pages[this.currentPageId].label, tabFont, this.color2, cx + tpad, ty - 2, cw + tpad, th, lc_stringformat);

		var tmp_tab_img = null;

		gr.SetSmoothingMode(0);
	};

	this.closeButtonCheck = function (event, x, y) {
		var state = this.closebutton.checkstate(event, x, y);
		switch (event) {
		case "up":
			if (state == ButtonStates.hover) {
				// action
				p.settings.colorWidgetFocusedId = -1;
				p.settings.colorSliderFocusedId = -1;
				cSettings.visible = false;
				this.closebutton.state = ButtonStates.normal;
				resize_panels();
				properties.collapseGroupsByDefault = (p.list.groupby[cGroup.pattern_idx].collapseGroupsByDefault == 0 ? false : true);
				update_playlist(properties.collapseGroupsByDefault);
				p.playlistManager.refresh("", false, false, false);
				full_repaint();
			};
			break;
		};
		return state;
	};

	this.on_mouse = function (event, x, y, delta) {
		var state = null,
		found = false,
		fin = "";
		if (this.closeButtonCheck(event, x, y) != ButtonStates.hover) {
			fin = this.tabButtons.length;
			for (var i = 0; i < fin; i++) {
				state = this.tabButtons[i].checkstate(event, x, y);
				switch (event) {
				case "up":
					if (state == ButtonStates.hover) {
						// action
						found = true;
						this.currentPageId = i;
						this.tabButtons[i].state = ButtonStates.normal;
						full_repaint();
					};
					break;
				};
			};
			if (!found) {
				this.color_updated = false;
				this.pages[this.currentPageId].on_mouse(event, x, y, delta);
			};
		};
	};

	this.on_focus = function (is_focused) {};
};
