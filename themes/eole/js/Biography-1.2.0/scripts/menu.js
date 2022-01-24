const MF_GRAYED = 0x00000001;
const MF_SEPARATOR = 0x00000800;
const MF_STRING = 0x00000000;

class MenuManager {
	constructor(baseMenu) {
		this.baseMenu = baseMenu || 'baseMenu';
		this.func = {};
		this.idx = 0;
		this.menu = {};
		this.menuItems = [];
		this.menuNames = [];
	}

	// Methods

	addItem(v) {
		if (v.separator && !v.str) {
			const separator = this.get(v.separator);
			if (separator) this.menu[v.menuName].AppendMenuSeparator();
		} else {
			const hide = this.get(v.hide);
			if (hide || !v.str) return;
			this.idx++;
			this.getItems(v, ['checkItem', 'checkRadio', 'flags', 'menuName', 'separator', 'str']);
			const menu = this.menu[this.menuName];
			menu.AppendMenuItem(this.flags, this.idx, this.str);
			menu.CheckMenuItem(this.idx, this.checkItem);
			if (this.checkRadio) menu.CheckMenuRadioItem(this.idx, this.idx, this.idx);
			if (this.separator) menu.AppendMenuSeparator();
			this.func[this.idx] = v.func;
		}
	}

	appendMenu(v) {
		this.getItems(v, ['hide', 'menuName']);
		if (this.menuName == this.baseMenu || this.hide) return;
		this.getItems(v, ['appendTo', 'flags', 'separator', 'str']);
		const menu = this.menu[this.appendTo || this.baseMenu];
		this.menu[this.menuName].AppendTo(menu, this.flags, this.str || this.menuName)
		if (this.separator) menu.AppendMenuSeparator();
	}

	clear() {
		this.menu = {}
		this.func = {}
		this.idx = 0;
	}

	createMenu(menuName = this.baseMenu) {
		menuName = this.get(menuName);
		this.menu[menuName] = window.CreatePopupMenu();
	}

	get(v) {
		if (typeof v == 'function') return v();
		return v;
	}

	getItems(v, items) {
		items.forEach(w => this[w] = this.get(v[w]))
	}

	load(x, y) {
		this.menuNames.forEach(v => this.createMenu(v));
		this.menuItems.forEach(v => !v.appendMenu ? this.addItem(v) : this.appendMenu(v));

		const idx = this.menu[this.baseMenu].TrackPopupMenu(x, y);
		this.run(idx);

		this.clear();
	}

	newItem({str = null, func = null, menuName = this.baseMenu, flags = MF_STRING, checkItem = false, checkRadio = false, separator = false, hide = false}) {
		this.menuItems.push({
			str: str,
			func: func,
			menuName: menuName,
			flags: flags,
			appendMenu: false,
			checkItem: checkItem,
			checkRadio: checkRadio,
			separator: separator,
			hide: hide
		});
	}

	newMenu({menuName = this.baseMenu, str = '', appendTo = this.baseMenu, flags = MF_STRING, separator = false, hide = false}) {
		this.menuNames.push(menuName);
		if (menuName != this.baseMenu) {
			this.menuItems.push({
				menuName: menuName,
				appendMenu: true,
				str: str,
				appendTo: appendTo,
				flags: flags,
				separator: separator,
				hide: hide
			});
		}
	}

	run(idx) {
		const v = this.func[idx];
		if (typeof v != 'function') return;
		v();
	}
}
let menu = new MenuManager;
let bMenu = new MenuManager;

class MenuItems {
	constructor() {
		this.docTxt = '';
		this.handles = new FbMetadbHandleList();
		this.openName = [];
		this.popUpTitle = 'Missing Data:';
		this.right_up = false;
		this.shift = false;
		this.tags = false;
		this.counter = {
			bio: 0,
			rev: 0
		};
		this.display = {
			check: [],
			str: []
		};
		this.img = {
			artist: '',
			artistClean: '',
			blacklist: [],
			blacklistStr: [],
			covType: ['Front', 'Back', 'Disc', 'Icon', 'Artist', 'Cycle Above', 'Cycle From Folder'],
			isLfm: true,
			list: [],
			name: ''
		};
		this.playlist = {
			menu: [],
			origIndex: 0
		};
		this.path = {
			am: [],
			blackList: '',
			img: false,
			lfm: [],
			open: [],
			tracks: []
		};
		this.undo = {
			folder: '',
			path: '',
			text: '#!#'
		}

		this.playlists_changed();
		this.mainMenu();
	}

	// Methods

	buttonMenu(x, y) {
		bMenu = new MenuManager;
		bMenu.newMenu({});
		const artist = panel.art.list.length ? panel.art.list[0].name : name.artist(ppt.focus);
		switch (ppt.artistView) {
			case true:
				panel.art.list.forEach((v, i) => bMenu.newItem({
					str: v.name.replace(/&/g, '&&') + v.field.replace(/&/g, '&&'),
					func: () => this.lookUpArtist(i),
					flags: v.type != 'label' ? MF_STRING : MF_GRAYED,
					checkRadio: i == panel.art.ix,
					separator: !i || v.type == 'similarend' || v.type == 'label' || v.type == 'tagend' || v.type == 'historyend'
				}));

				['Manual cycle: wheel over button', 'Auto cycle items', 'Cycle time...', 'Options...', 'Reload'].forEach((v, i) => bMenu.newItem({
					str: v,
					func: () => this.lookUpArtist(panel.art.list.length + i),
					flags: !i ? MF_GRAYED : MF_STRING,
					checkItem: i == 1 && ppt.cycItem,
					separator: i != 1
				}));

				bMenu.newMenu({
					menuName: 'More...'
				});
				for (let i = 0; i < 8; i++) bMenu.newItem({
					menuName: 'More...',
					str: ['Show similar artists', 'Show more tags' + ' (circle button if present)', 'Show artist history', 'Auto lock', 'Reset artist history...', 'Last.fm: ' + artist + '...', 'Last.fm: ' + artist + ': similar artists...', 'Last.fm: ' + artist + ': top albums...', 'AllMusic: ' + artist + '...'][i],
					func: () => this.lookUpArtistItems(i),
					checkItem: i < 4 && [ppt.showSimilarArtists, ppt.showMoreTags, ppt.showArtistHistory, ppt.autoLock][i],
					separator: i == 2 || i == 3 || i == 4 || i == 5
				});
				break;
			case false:
				panel.alb.list.forEach((v, i) => bMenu.newItem({
					str: !i || v.type.includes('history') ? v.artist.replace(/&/g, '&&') + ' - ' + v.album.replace(/&/g, '&&') : v.album.replace(/&/g, '&&'),
					func: () => this.lookUpAlbum(i),
					flags: v.type != 'label' ? MF_STRING : MF_GRAYED,
					checkRadio: i == panel.alb.ix,
					separator: !i || v.type == 'albumend' || v.type == 'label' || v.type == 'historyend'
				}));

				['Manual cycle: wheel over button', 'Auto cycle items', 'Cycle time...', 'Options...', 'Reload'].forEach((v, i) => bMenu.newItem({
					str: v,
					func: () => this.lookUpAlbum(panel.alb.list.length + i),
					flags: !i ? MF_GRAYED : MF_STRING,
					checkItem: i == 1 && ppt.cycItem,
					separator: i != 1
				}));

				bMenu.newMenu({
					menuName: 'More...'
				});
				for (let i = 0; i < 8; i++) bMenu.newItem({
					menuName: 'More...',
					str: ['Show top albums', 'Show album history', 'Auto lock', 'Reset album history...', 'Last.fm: ' + artist + '...', 'Last.fm: ' + artist + ': similar artists...', 'Last.fm: ' + artist + ': top albums...', 'AllMusic: ' + artist + '...'][i],
					func: () => this.lookUpAlbumItems(i),
					checkItem: i < 3 && [ppt.showTopAlbums, ppt.showAlbumHistory, ppt.autoLock][i],
					separator: i == 1 || i == 2 || i == 3 || i == 4
				});
				break;
		}
		bMenu.load(x, y);
	}

	mainMenu() {
		menu.newMenu({});
		menu.newItem({
			str: 'Biography server',
			flags: MF_GRAYED,
			separator: true,
			hide: !panel.server || !this.shift || !vk.k('ctrl')
		});

		menu.newItem({
			str: ppt.artistView ? 'Biography: switch to ' + (!ppt.allmusic_bio ? (!ppt.lockBio || ppt.bothBio ? 'prefer ' : '') + 'allmusic' + (ppt.bothBio ? ' first' : '') : (!ppt.lockBio || ppt.bothBio ? 'prefer ' : '') + 'last.fm' + (ppt.bothBio ? ' first' : '')) : 'Review: switch to ' + (!ppt.allmusic_alb ? (!ppt.lockRev || ppt.bothRev ? 'prefer ' : '') + 'allmusic' + (ppt.bothRev ? ' first' : '') : (!ppt.lockRev || ppt.bothRev ? 'prefer ' : '') + 'last.fm' + (ppt.bothRev ? ' first' : '')),
			func: () => txt.toggle(ppt.artistView ? (!ppt.bothBio ? 0 : 6) : (!ppt.bothRev ? 1 : 7)),
			separator: true
		});

		menu.newMenu({
			menuName: 'Display'
		});

		for (let i = 0; i < 10; i++) menu.newItem({
			menuName: 'Display',
			str: () => this.display.str[i],
			func: () => this.setDisplay(i),
			flags: i == 1 && ppt.autoEnlarge || i == 9 && ppt.lookUp == 2 ? MF_GRAYED : MF_STRING,
			checkItem: (i == 3 || i == 4) && this.display.check[i],
			checkRadio: (i < 3 || i > 4 && i < 7 || i > 6 && i < 9) && this.display.check[i],
			separator: i == 2 || i == 3 || i == 4 || i == 6 || i == 8
		});

		menu.newItem({
			separator: true
		});

		menu.newMenu({
			menuName: 'Sources'
		});

		menu.newMenu({
			menuName: 'Biography',
			str: 'Biography: ' + (ppt.allmusic_bio ? !ppt.bothBio ? (!ppt.lockBio ? 'prefer ' : '') + 'allmusic' : 'prefer both' : !ppt.bothBio ? (!ppt.lockBio ? 'prefer ' : '') + 'last.fm' : 'prefer both'),
			appendTo: 'Sources'
		});

		for (let i = 0; i < 4; i++) menu.newItem({
			menuName: 'Biography',
			str: [(!ppt.lockBio ? 'Prefer allmusic' : 'Allmusic'), (!ppt.lockBio ? 'Prefer last.fm' : 'Last.fm'), 'Prefer both', 'Lock to single source'][i],
			func: () => txt.toggle([0, 0, 4, 2][i]),
			flags: (i < 2 || i == 3) && ppt.bothBio ? MF_GRAYED : MF_STRING,
			checkItem: i > 1 && [ppt.bothBio, ppt.lockBio][i - 2],
			checkRadio: i < 2 && [ppt.allmusic_bio && !ppt.bothBio, !ppt.allmusic_bio && !ppt.bothBio][i],
			separator: i == 1 || i == 2
		});

		menu.newMenu({
			menuName: 'Review',
			str: 'Review: ' + (ppt.allmusic_alb ? !ppt.bothRev ? (!ppt.lockRev ? 'prefer ' : '') + 'allmusic' : 'prefer both' : !ppt.bothRev ? (!ppt.lockRev ? 'prefer ' : '') + 'last.fm' : 'prefer both'),
			appendTo: 'Sources'
		});

		for (let i = 0; i < 4; i++) menu.newItem({
			menuName: 'Review',
			str: [(!ppt.lockRev ? 'Prefer allmusic' : 'Allmusic'), (!ppt.lockRev ? 'Prefer last.fm' : 'Last.fm'), 'Prefer both', 'Lock to single source'][i],
			func: () => txt.toggle([1, 1, 5, 3][i]),
			flags: (i < 2 || i == 3) && ppt.bothRev ? MF_GRAYED : MF_STRING,
			checkItem: i > 1 && [ppt.bothRev, ppt.lockRev][i - 2],
			checkRadio: i < 2 && [ppt.allmusic_alb && !ppt.bothRev, !ppt.allmusic_alb && !ppt.bothRev][i],
			separator: i
		});

		menu.newMenu({
			menuName: 'Last.fm type',
			appendTo: 'Review'
		});

		['Album', 'Album + track', 'Track'].forEach((v, i) => menu.newItem({
			menuName: 'Last.fm type',
			str: v,
			func: () => {
				ppt.inclTrackRev = i;
				panel.style.inclTrackRev = ppt.inclTrackRev;
				if (ppt.inclTrackRev) server.checkTrack({
					force: true,
					artist: panel.art.list.length ? panel.art.list[0].name : name.artist(ppt.focus),
					title: name.title(ppt.focus)
				});
				txt.refresh(1);
			},
			checkRadio: i == ppt.inclTrackRev
		}));

		menu.newItem({
			menuName: 'Sources',
			separator: true
		});

		menu.newMenu({
			menuName: 'Photo',
			appendTo: 'Sources',
			str: 'Photo: ' + (ppt.cycPhoto ? 'cycle' : 'artist')
		});

		['Cycle from folder', 'Artist (single image [fb2k: display])'].forEach((v, i) => menu.newItem({
			menuName: 'Photo',
			str: v,
			func: () => {
				ppt.toggle(['cycPhoto', 'cycPhoto'][i]);
				img.updImages();
			},
			checkRadio: [ppt.cycPhoto, !ppt.cycPhoto][i]
		}));

		menu.newMenu({
			menuName: 'Cover',
			str: 'Cover: ' + (!panel.alb.ix || ppt.artistView ? ppt.loadCovAllFb || ppt.loadCovFolder ? 'cycle' : this.img.covType[ppt.covType] : 'front'),
			appendTo: 'Sources',
			flags: !panel.alb.ix || ppt.artistView ? MF_STRING : MF_GRAYED
		});

		this.img.covType.forEach((v, i) => menu.newItem({
			menuName: 'Cover',
			str: v,
			func: () => this.setCover(i),
			flags: !ppt.loadCovAllFb && i < 5 ? MF_GRAYED : MF_STRING,
			checkItem: (ppt.loadCovAllFb || i > 4) && [img.cov.selection[0] != -1, img.cov.selection[1] != -1, img.cov.selection[2] != -1, img.cov.selection[3] != -1, img.cov.selection[4] != -1, ppt.loadCovAllFb, ppt.loadCovFolder][i],
			checkRadio: !ppt.loadCovAllFb && i == ppt.covType,
			separator: i == 4
		}));

		menu.newItem({
			menuName: 'Sources',
			separator: true
		});

		menu.newMenu({
			menuName: 'Open containing folder',
			appendTo: 'Sources'
		});

		for (let i = 0; i < 4; i++) menu.newItem({
			menuName: 'Open containing folder',
			str:  this.openName[i],
			func: () => $.browser('explorer /select,' + this.path.open[i], false),
			flags: this.path.img || this.path.am[3] || this.path.lfm[3] || this.path.tracks[3] ? MF_STRING : MF_GRAYED,
			separator: !i && this.openName.length > 1 && this.path.img,
			hide: !this.openName[i]
		});

		menu.newItem({
			menuName: 'Sources',
			separator: true
		});

		menu.newMenu({
			menuName: 'Paste text from clipboard',
			appendTo: 'Sources',
			separator: ppt.menuShowPaste == 2 || ppt.menuShowPaste && this.shift,
			hide: !ppt.menuShowPaste || ppt.menuShowPaste == 1 && !this.shift
		});

		for (let i = 0; i < 4; i++) menu.newItem({
			menuName: 'Paste text from clipboard',
			str: [ppt.artistView ? 'Biography [allmusic location]' : 'Review [allmusic location]', ppt.artistView ? 'Biography [last.fm location]' : 'Review [last.fm location]', 'Open last edited', 'Undo'][i],
			func: () => this.setPaste(i),
			flags: !i && !this.path.am[2] || i == 1 && !this.path.lfm[2] || i == 2 && !this.undo.path || i == 3 && this.undo.text == '#!#' ? MF_GRAYED : MF_STRING,
			separator: i == 1 || i == 2
		});

		menu.newItem({
			menuName: 'Sources',
			str: 'Force update',
			func: () => panel.callServer(1, ppt.focus, 'bio_forceUpdate', 0)
		});

		const style_arr = panel.style.name.slice();
		menu.newMenu({
			menuName: 'Layout'
		});

		style_arr.forEach((v, i) => menu.newItem({
			menuName: 'Layout',
			str: v,
			func: () => {
				const prop = ppt.sameStyle ? 'style' : ppt.artistView ? 'bioStyle' : 'revStyle';
				ppt[prop] = i;
				txt.refresh(0);
			},
			checkItem: (ppt.loadCovAllFb || i > 4) && [img.cov.selection[0] != -1, img.cov.selection[1] != -1, img.cov.selection[2] != -1, img.cov.selection[3] != -1, img.cov.selection[4] != -1, ppt.loadCovAllFb, ppt.loadCovFolder][i],
			checkRadio: () => {
				const CheckIndex = ppt.sameStyle ? ppt.style : ppt.artistView ? ppt.bioStyle : ppt.revStyle;
				return CheckIndex <= style_arr.length - 1 && i == CheckIndex;
			},
			separator: i == 4 || style_arr.length > 5 && i == style_arr.length - 1
		}));

		menu.newMenu({
			menuName: 'Create && manage styles',
			appendTo: 'Layout'
		});

		['Create new style...', 'Rename custom style...', 'Delete custom style...', 'Export custom style...', 'Reset style...'].forEach((v, i) => menu.newItem({
			menuName: 'Create && manage styles',
			str: v,
			func: () => this.setStyles(i),
			flags: !i || ppt.style > 4 || i == 4 ? MF_STRING : MF_GRAYED,
			separator: !i
		}));

		menu.newItem({
			menuName: 'Layout',
			separator: true
		});

		menu.newMenu({
			menuName: 'Filmstrip',
			appendTo: 'Layout'
		});

		['Top', 'Right', 'Bottom', 'Left', 'Reset to default size...'].forEach((v, i) => menu.newItem({
			menuName: 'Filmstrip',
			str: v,
			func: () => filmStrip.set(i),
			checkRadio: i < 4 && i == ppt.filmStripPos,
			separator: i == 3
		}));

		menu.newItem({
			menuName: 'Layout',
			separator: true
		});

		['Reset zoom', 'Reload'].forEach((v, i) => menu.newItem({
			menuName: 'Layout',
			str: v,
			func: () => !i ? but.resetZoom() : window.Reload(),
		}));

		menu.newMenu({
			menuName: 'Image'
		});

		menu.newItem({
			menuName: 'Image',
			str: 'Auto cycle',
			func: () => ppt.toggle('cycPic'),
			checkItem: ppt.cycPic,
			separator: true
		});

		menu.newMenu({
			menuName: 'Alignment',
			appendTo: 'Image',
			hide: ppt.style > 3
		});

		for (let i = 0; i < 4; i++) menu.newItem({
			menuName: 'Alignment',
			str: ppt.style == 0 || ppt.style == 2 ? ['Left', 'Centre', 'Right', 'Align with text'][i] : ['Top', 'Centre', 'Bottom', 'Align with text'][i],
			func: () => {
				switch (i) {
					case 3:
						ppt.toggle('textAlign');
						panel.setStyle();
						img.clearCache();
						img.getImages();
						break;
					default:
						if (ppt.style == 0 || ppt.style == 2) ppt.alignH = i;
						else ppt.alignV = i;
						img.clearCache();
						img.getImages();
						break;
				}
			},
			checkItem: i == 3 && ppt.textAlign,
			checkRadio: i == (ppt.style == 0 || ppt.style == 2 ? ppt.alignH : ppt.alignV),
			separator: i == 2
		});

		menu.newMenu({
			menuName: 'Alignment horizontal',
			appendTo: 'Image',
			hide: ppt.style < 4
		});

		['Left', 'Centre', 'Right'].forEach((v, i) => menu.newItem({
			menuName: 'Alignment horizontal',
			str: v,
			func: () => {
				ppt.alignH = i;
				img.clearCache();
				img.getImages()
			},
			checkRadio:  i == ppt.alignH
		}));

		menu.newMenu({
			menuName: 'Alignment vertical',
			appendTo: 'Image',
			hide: ppt.style < 4
		});

		['Top', 'Centre', 'Bottom', 'Auto'].forEach((v, i) => menu.newItem({
			menuName: 'Alignment vertical',
			str: v,
			func: () => {
				switch (i) {
					case 3:
						ppt.alignAuto = true;
						panel.setStyle();
						img.clearCache();
						img.getImages();
						break;
					default:
						ppt.alignV = i;
						ppt.alignAuto = false;
						panel.setStyle();
						img.clearCache();
						img.getImages();
						break;
				}
			},
			checkRadio: [!ppt.alignV && !ppt.alignAuto, ppt.alignV == 1 && !ppt.alignAuto, ppt.alignV == 2 && !ppt.alignAuto, ppt.alignAuto][i],
			separator: i == 2
		}));

		menu.newItem({
			menuName: 'Image',
			separator: true
		});

		menu.newMenu({
			menuName: 'Black list',
			appendTo: 'Image'
		});

		for (let i = 0; i < 3; i++) menu.newItem({
			menuName: 'Black list',
			str: this.img.blacklistStr[i],
			func: () => this.setImageBlacklist(i),
			flags: !i && this.img.isLfm || i == 2 ? MF_STRING : MF_GRAYED,
			hide: i == 2 && img.blackList.undo[0] != this.img.artistClean
		});

		this.img.blacklist.forEach((v, i) => menu.newItem({
			menuName: 'Black list',
			str: (this.img.artist + '_' + v).replace(/&/g, '&&'),
			func: () => this.setImageBlacklist(i + (img.blackList.undo[0] == this.img.artistClean ? 3 : 2)),
		}));

		menu.newItem({
			separator: true
		});

		const pl_no = Math.ceil(this.playlist.menu.length / 30);
		menu.newMenu({
			menuName: 'Playlists',
			separator: ppt.menuShowPlaylists == 2 || ppt.menuShowPlaylists && this.shift,
			hide: !ppt.menuShowPlaylists || ppt.menuShowPlaylists == 1 && !this.shift
		});

		for (let j = 0; j < pl_no; j++) {
			const n = '# ' + (j * 30 + 1 + ' - ' + Math.min(this.playlist.menu.length, 30 + j * 30) + (30 + j * 30 > plman.ActivePlaylist && ((j * 30) - 1) < plman.ActivePlaylist ? '  >>>' : ''));
			menu.newMenu({
				menuName: n,
				appendTo: 'Playlists'
			});

			for (let i = j * 30; i < Math.min(this.playlist.menu.length, 30 + j * 30); i++) {
				menu.newItem({
					menuName: n,
					str: this.playlist.menu[i].name,
					func: () => this.setPlaylist(i),
					checkRadio: i == plman.ActivePlaylist
				});
			}
		}

		menu.newMenu({
			menuName: 'Tagger',
			str: 'Tagger' + (this.handles.Count ? '' : ': N/A no playlist tracks selected'),
			separator: ppt.menuShowTagger == 2 || ppt.menuShowTagger && this.shift,
			hide: !ppt.menuShowTagger || ppt.menuShowTagger == 1 && !this.shift
		});

		for (let i = 0; i < 11 + 4; i++) menu.newItem({
			menuName: 'Tagger',
			str: !i ? 'Write existing file info to tags: ' : i == 11 + 1 ? 'All tagger settings...' : i == 11 + 2 ? 'Tag files...' + (this.tags ? '' : ' N/A no tags enabled') : i == 11 + 3 ? 'Cancel' : i == 11 ? cfg[`tagName${i - 1}`] + (cfg[`tagEnabled${i - 1}`] ? ' (' + cfg[`tagEnabled${i}`] + ')' : '') : cfg[`tagName${i - 1}`],
			func: () => cfg.setTag(i, this.handles),
			flags: !i || i == 11 + 1 && !this.tags ? MF_GRAYED : MF_STRING,
			checkItem: i && i < 11 + 1 && cfg[`tagEnabled${i - 1}`],
			separator: !i || i == 5 || i == 11 || i == 12
		});

		menu.newMenu({
			menuName: 'Missing data',
			separator: ppt.menuShowMissingData == 2 || ppt.menuShowMissingData && this.shift,
			hide: !ppt.menuShowMissingData || ppt.menuShowMissingData == 1 && !this.shift
		});

		['Album review [allmusic]', 'Album review [last.fm]', 'Biography [allmusic]', 'Biography [last.fm]', 'Photos [last.fm]'].forEach((v, i) => menu.newItem({
			menuName: 'Missing data',
			str: v,
			func: () => this.checkMissingData(i),
			separator: i == 1 || i == 3
		}));

		menu.newItem({
			str: ppt.panelActive ? 'Inactivate' : 'Activate biography',
			func: () => panel.inactivate(),
			separator: true,
			hide: !ppt.menuShowInactivate || ppt.menuShowInactivate == 1 && !this.shift
		});

		menu.newItem({
			str: 'Options...',
			func: () => cfg.open('PanelCfg'),
		});
	}

	checkMissingData(i) {
		switch (i) {
			case 0:
				this.missingRev('foAmRev', 'AllMusic', 'Album Review');
				break;
			case 1:
				this.missingRev('foLfmRev', 'Last.fm', 'Album Review');
				break;
			case 2:
				this.missingBio('foAmBio', 'AllMusic', 'Biography');
				break;
			case 3:
				this.missingBio('foLfmBio', 'Last.fm', 'Biography');
				break;
			case 4:
				this.missingArtImg('foImgArt', 'Last.fm', 'Photo');
				break;
		}
	}

	fresh() {
		if (panel.block() || !ppt.cycItem || panel.zoom()) return;
		if (ppt.artistView) {
			this.counter.bio++;
			if (this.counter.bio < ppt.cycTimeItem) return;
			this.counter.bio = 0;
			if (panel.art.list.length < 2) return;
			this.wheel(1, true, false);
		} else {
			this.counter.rev++;
			if (this.counter.rev < ppt.cycTimeItem) return;
			this.counter.rev = 0;
			if (panel.alb.list.length < 2) return;
			this.wheel(1, true, false);
		}
	}

	getBlacklistImageItems() {
		const imgInfo = img.pth();
		this.img.artist = imgInfo.artist;
		this.path.img = imgInfo.imgPth;
		this.img.isLfm = imgInfo.blk && this.path.img;
		this.img.name = this.img.isLfm ? this.path.img.slice(this.path.img.lastIndexOf('_') + 1) : this.path.img.slice(this.path.img.lastIndexOf('\\') + 1); // needed for init
		this.img.blacklist = [];
		this.path.blackList = `${fb.ProfilePath}yttm\\blacklist_image.json`;

		if (!$.file(this.path.blackList)) $.save(this.path.blackList, JSON.stringify({
			'blacklist': {}
		}), true);

		if ($.file(this.path.blackList)) {
			this.img.artistClean = $.clean(this.img.artist).toLowerCase();
			this.img.list = $.jsonParse(this.path.blackList, false, 'file');
			this.img.blacklist = this.img.list.blacklist[this.img.artistClean] || [];
		}
	
		this.img.blacklistStr = [this.img.isLfm ? '+ Add' + (!panel.style.showFilmStrip ? '' : ' main image') + ' to black list: ' + this.img.artist + '_' + this.img.name : '+ Add to black list: ' + (this.img.name ? 'N/A - requires last.fm photo. Selected image : ' + this.img.name : 'N/A - no' + (!panel.style.showFilmStrip ? '' : '') + ' image file'), this.img.blacklist.length ? ' - Remove from black list (click name): ' : 'No black listed images for current artist', 'Undo'];
	}

	getDisplayStr() {
		const m = ppt.artistView ? ppt.bioMode : ppt.revMode;
		this.display.check = [ppt.sameStyle ? !ppt.img_only && !ppt.text_only : m == 0, ppt.sameStyle ? ppt.img_only : m == 1, ppt.sameStyle ? ppt.text_only : m == 2, ppt.showFilmStrip, ppt.heading, ppt.artistView, !ppt.artistView, !ppt.focus, ppt.focus];
		const n = [!panel.id.imgText ? 'Auto' : 'Image+text', 'Image', 'Text', 'Filmstrip', 'Heading', 'Artist view', 'Album view', 'Prefer nowplaying', 'Follow selected track (playlist)', !panel.id.imgText ? 'Toggle: auto vs image+text' : 'Toggle: image+text vs auto'];
		const click = [!this.display.check[0] ? '\tMiddle click' : '', !this.display.check[1] && !ppt.text_only && txt.text ? '\tMiddle click' : '', !this.display.check[2] && !ppt.img_only ? '\tMiddle click' : '', '\tALT+Middle click', '', !ppt.artistView ? (!ppt.dblClickToggle ? '\tClick' : '\tDouble click') : '', ppt.artistView ? (!ppt.dblClickToggle ? '\tClick' : '\tDouble click') : '', '', '', '', ''];
		this.display.str = n.map((v, i) => v + click[i])
	}

	getOpenName() {
		const fo = [this.path.img, this.path.am[3], this.path.lfm[3], this.path.tracks[3]];
		this.openName = ['Image', ppt.artistView ? 'Biography [allmusic]' : 'Review [allmusic]', ppt.artistView ? 'Biography [last.fm]' : 'Review [last.fm]', ppt.artistView ? '' : 'Tracks [last.fm]'];
		let i = this.openName.length;
		while (i--)
			if (!fo[i]) {
				this.openName.splice(i, 1);
				fo.splice(i, 1);
				this.path.open.splice(i, 1);
			}
	}

	images(v) {
		return name.isLfmImg(fso.GetFileName(v));
	}

	lookUpAlbum(i) {
		const origArr = JSON.stringify(panel.alb.list);
		switch (true) {
			case i < panel.alb.list.length: {
				if (origArr != JSON.stringify(panel.alb.list) || !i && !panel.alb.ix || panel.alb.ix == i) break;
				txt.logScrollPos();
				filmStrip.logScrollPos();
				panel.alb.ix = i;
				img.get = false;
				txt.get = 0;
				let force = false;
				panel.style.inclTrackRev = ppt.inclTrackRev;
				if (ppt.showAlbumHistory && ppt.inclTrackRev) {
					if (panel.alb.list[panel.alb.ix].type.includes('history')) panel.style.inclTrackRev = 0;
					txt.albumFlush();
					force = true;
				}
				txt.getItem(false, panel.art.ix, panel.alb.ix, force);
				txt.getScrollPos();
				img.getItem(panel.art.ix, panel.alb.ix);
				panel.callServer(false, ppt.focus, 'bio_lookUpItem', 0);
				filmStrip.check();
				if (ppt.autoLock) panel.mbtn_up(1, 1, true);
				if (panel.alb.list[panel.alb.ix].type.includes('history')) break;
				panel.logAlbumHistory(panel.alb.list[panel.alb.ix].artist, panel.alb.list[panel.alb.ix].album);
				panel.getList();
				break;
			}
			case i == panel.alb.list.length + 1:
				ppt.toggle('cycItem');
				break;
			case i == panel.alb.list.length + 2:
				panel.setCycItem();
				break;
			case i == panel.alb.list.length + 3:
				cfg.open('PanelCfg');
				break;
			case i == panel.alb.list.length + 4:
				window.Reload();
				break;
		}
		this.counter.rev = 0;
	}

	lookUpAlbumItems(i) {
		switch (i) {
			case 0:
				panel.alb.ix = 0;
				ppt.toggle('showTopAlbums');
				panel.getList(!ppt.showTopAlbums ? true : false);
				break;
			case 1:
				panel.alb.ix = 0;
				ppt.toggle('showAlbumHistory');
				panel.getList(!ppt.showAlbumHistory ? true : false);
				break;
			case 2:
				ppt.toggle('autoLock');
				break;
			case 3:
				panel.resetAlbumHistory();
				break;
			default: {
				const artist = panel.art.list.length ? panel.art.list[0].name : name.artist(ppt.focus);
				const brArr = ['', '/+similar', '/+albums'];
				if (i < 7) $.browser('https://www.last.fm/' + (cfg.langLfm == 'EN' ? '' : cfg.langLfm.toLowerCase() + '/') + 'music/' + encodeURIComponent(artist) + brArr[i - 4], true);
				else $.browser('https://www.allmusic.com/search/artists/' + encodeURIComponent(artist), true);
				break;
			}
		}
		if (i < 4) {
			txt.logScrollPos();
			filmStrip.logScrollPos();
			img.get = false;
			txt.get = 0;
			panel.style.inclTrackRev = ppt.inclTrackRev;
			if (ppt.inclTrackRev) {
				if (panel.alb.list[panel.alb.ix].type.includes('history')) panel.style.inclTrackRev = 0;
				txt.albumFlush();
			}
			txt.getItem(false, panel.art.ix, panel.alb.ix, true);
			txt.getScrollPos();
			img.getItem(panel.art.ix, panel.alb.ix);
			panel.callServer(false, ppt.focus, 'bio_lookUpItem', 0);
			filmStrip.check();
		}
	}

	lookUpArtist(i) {
		const origArr = JSON.stringify(panel.art.list);
		switch (true) {
			case i < panel.art.list.length:
				if (origArr != JSON.stringify(panel.art.list) || !i && !panel.art.ix || panel.art.ix == i) break;
				txt.logScrollPos();
				filmStrip.logScrollPos();
				panel.art.ix = i;
				img.get = false;
				txt.get = 0;
				txt.getItem(false, panel.art.ix, panel.alb.ix);
				txt.getScrollPos();
				img.getItem(panel.art.ix, panel.alb.ix);
				panel.callServer(false, ppt.focus, 'bio_lookUpItem', 0);
				filmStrip.check();
				if (ppt.autoLock) panel.mbtn_up(1, 1, true);
				if (panel.art.list[panel.art.ix].type.includes('history')) break;
				panel.logArtistHistory(panel.art.list[panel.art.ix].name);
				panel.getList();
				break;
			case i == panel.art.list.length + 1:
				ppt.toggle('cycItem');
				break;
			case i == panel.art.list.length + 2:
				panel.setCycItem();
				break;
			case i == panel.art.list.length + 3:
				cfg.open('PanelCfg');
				break;
			case i == panel.art.list.length + 4:
				window.Reload();
				break;
		}
		this.counter.bio = 0;
	}

	lookUpArtistItems(i) {
		switch (i) {
			case 0:
				panel.art.ix = 0;
				ppt.toggle('showSimilarArtists');
				panel.getList(!ppt.showSimilarArtists ? true : false);
				break;
			case 1:
				panel.art.ix = 0;
				ppt.toggle('showMoreTags');
				panel.getList(!ppt.showMoreTags ? true : false);
				break;
			case 2:
				panel.art.ix = 0;
				ppt.toggle('showArtistHistory');
				panel.getList(!ppt.showArtistHistory ? true : false);
				break;
			case 3:
				ppt.toggle('autoLock');
				break;
			case 4:
				panel.resetArtistHistory();
				break;
			default: {
				const artist = panel.art.list.length ? panel.art.list[0].name : name.artist(ppt.focus);
				const brArr = ['', '/+similar', '/+albums'];
				if (i < 8) $.browser('https://www.last.fm/' + (cfg.langLfm == 'EN' ? '' : cfg.langLfm.toLowerCase() + '/') + 'music/' + encodeURIComponent(artist) + brArr[i - 5], true);
				else $.browser('https://www.allmusic.com/search/artists/' + encodeURIComponent(artist), true);
				break;
			}
		}
		if (i < 5) {
			txt.logScrollPos();
			filmStrip.logScrollPos();
			img.get = false;
			txt.get = 0;
			txt.getItem(false, panel.art.ix, panel.alb.ix);
			txt.getScrollPos();
			img.getItem(panel.art.ix, panel.alb.ix);
			panel.callServer(false, ppt.focus, 'bio_lookUpItem', 0);
			filmStrip.check();
		}
	}

	missingArtImg(n1, n2, n3) {
		const continue_confirmation = (status, confirmed) => {
			if (confirmed) {
				const handleList = fb.GetLibraryItems();
				if (!handleList) return;
				const tf_a = FbTitleFormat(cfg.tf.artist);
				const sort = FbTitleFormat(cfg.tf.artist + ' | ' + cfg.tf.album + ' | [[%discnumber%.]%tracknumber%. ][%track artist% - ]' + cfg.tf.title);
				let a = '';
				let cur_a = '####';
				let found = false;
				let m = new FbMetadbHandleList();
				handleList.OrderByFormat(sort, 1);
				const artists = tf_a.EvalWithMetadbs(handleList);
				handleList.Convert().forEach((h, i) => {
					a = artists[i].toLowerCase();
					if (a != cur_a) {
						cur_a = a;
						const pth = panel.cleanPth(cfg.pth[n1], h, 'tag');
						let files = utils.Glob(pth + '*');
						files = files.some(this.images);
						if (a && !files) {
							found = false;
							m.Insert(m.Count, h);
						} else found = true;
					} else if (!found) m.Insert(m.Count, h);
				});
				this.sendToPlaylist(m, n2, n3);
			}
		}
		popUpBox.confirm(this.popUpTitle, this.popUpText(n2, n3), 'OK', 'Cancel', continue_confirmation);
	}

	missingBio(n1, n2, n3) {
		const continue_confirmation = (status, confirmed) => {
			if (confirmed) {
				const handleList = fb.GetLibraryItems();
				if (!handleList) return;
				const tf_a = FbTitleFormat(cfg.tf.artist);
				const sort = FbTitleFormat(cfg.tf.artist + ' | ' + cfg.tf.album + ' | [[%discnumber%.]%tracknumber%. ][%track artist% - ]' + cfg.tf.title);
				let a = '';
				let cur_a = '####';
				let found = false;
				let m = new FbMetadbHandleList();
				handleList.OrderByFormat(sort, 1);
				const artists = tf_a.EvalWithMetadbs(handleList);
				handleList.Convert().forEach((h, i) => {
					a = artists[i].toLowerCase();
					if (a != cur_a) {
						cur_a = a;
						const pth = panel.cleanPth(cfg.pth[n1], h, 'tag') + $.clean(a) + cfg.suffix[n1] + '.txt';
						if (a && !$.file(pth)) {
							found = false;
							m.Insert(m.Count, h);
						} else found = true;
					} else if (!found) m.Insert(m.Count, h);
				});
				this.sendToPlaylist(m, n2, n3);
			}
		}
		popUpBox.confirm(this.popUpTitle, this.popUpText(n2, n3), 'OK', 'Cancel', continue_confirmation);
	}

	missingRev(n1, n2, n3) {
		const continue_confirmation = (status, confirmed) => {
			if (confirmed) {
				const handleList = fb.GetLibraryItems();
				if (!handleList) return;
				const tf_albumArtist = FbTitleFormat(cfg.tf.albumArtist);
				const tf_album = FbTitleFormat(cfg.tf.album);
				const sort = FbTitleFormat(cfg.tf.albumArtist + ' | ' + cfg.tf.album + ' | [[%discnumber%.]%tracknumber%. ][%track artist% - ]' + cfg.tf.title);
				let albumArtist = '';
				let cur_albumArtist = '####';
				let cur_album = '####';
				let album = '';
				let found = false;
				let m = new FbMetadbHandleList();
				handleList.OrderByFormat(sort, 1);
				const albumartists = tf_albumArtist.EvalWithMetadbs(handleList);
				const albums = tf_album.EvalWithMetadbs(handleList);
				handleList.Convert().forEach((h, i) => {
					albumArtist = albumartists[i].toLowerCase();
					album = albums[i].toLowerCase();
					album = !cfg.albStrip ? name.albumTidy(album) : name.albumClean(album);
					if (albumArtist + album != cur_albumArtist + cur_album) {
						cur_albumArtist = albumArtist;
						cur_album = album;
						const pth = panel.cleanPth(cfg.pth[n1], h, 'tag') + $.clean(albumArtist) + ' - ' + $.clean(album) + cfg.suffix[n1] + '.txt';
						if (albumArtist && album && !$.file(pth)) {
							found = false;
							m.Insert(m.Count, h);
						} else found = true;
					} else if (!found) m.Insert(m.Count, h);
				});
				this.sendToPlaylist(m, n2, n3);
			}
		}
		popUpBox.confirm(this.popUpTitle, this.popUpText(n2, n3), 'OK', 'Cancel', continue_confirmation);
	}

	playlists_changed() {
		if (!ppt.menuShowPlaylists) return;
		this.playlist.menu = [];
		for (let i = 0; i < plman.PlaylistCount; i++) this.playlist.menu.push({
			name: plman.GetPlaylistName(i).replace(/&/g, '&&'),
			ix: i
		});
	}

	popUpText(n2, n3) {
		return `Check media library and create playlist: ${n2} ${n3} Missing\n\nServer settings will be used.\n\nWARNING: This operation analyses a lot of data. It may trigger an "Unresponsive script" pop-up. If that happens choose "Continue" or "Don't ask me again". Choosing "Stop script" will trigger an error.\n\nContinue?`;
	}

	rbtn_up(x, y) {
		this.right_up = true;
		this.shift = vk.k('shift');
		const imgInfo = img.pth();

		this.docTxt = doc.parentWindow.clipboardData.getData('text');
		this.getDisplayStr();
		this.img.artist = imgInfo.artist;
		this.path.img = imgInfo.imgPth;
		this.img.isLfm = imgInfo.blk && this.path.img;
		this.img.name = this.img.isLfm ? this.path.img.slice(this.path.img.lastIndexOf('_') + 1) : this.path.img.slice(this.path.img.lastIndexOf('\\') + 1);
		this.path.am = ppt.artistView ? txt.amBioPth() : txt.amRevPth();
		this.path.lfm = ppt.artistView ? txt.lfmBioPth() : txt.lfmRevPth();
		this.path.tracks = txt.lfmTrackPth();
		this.path.open = [this.path.img, this.path.am[1], this.path.lfm[1], this.path.tracks[1]];
		this.getOpenName();
		this.getBlacklistImageItems();
		if (ppt.menuShowTagger == 2 || ppt.menuShowTagger && this.shift) this.handles = plman.GetPlaylistSelectedItems(plman.ActivePlaylist);
		this.tagsEnabled();

		this.refreshMainMenu();
		menu.load(x, y);
		this.right_up = false;
	}

	refreshMainMenu() {
		menu = new MenuManager;
		this.mainMenu();
	}

	sendToPlaylist(m, n2, n3) {
		if (m.Count) {
			const pln = plman.FindOrCreatePlaylist(`${n2} ${n3} Missing`, false);
			plman.ActivePlaylist = pln;
			plman.ClearPlaylist(pln);
			plman.InsertPlaylistItems(pln, 0, m);
		} else fb.ShowPopupMessage(`${n2} ${n3}: None missing`, 'Biography');
	}

	setCover(i) {
		switch (true) {
			case i < 5:
				!ppt.loadCovAllFb ? ppt.covType = i : img.cov.selection[i] = img.cov.selection[i] == -1 ? i : -1;
				img.cov.selFiltered = img.cov.selection.filter(v => v != -1);
				if (!img.cov.selFiltered.length) {
					img.cov.selection = [0, -1, -1, -1, -1];
					img.cov.selFiltered = [0];
				}
				ppt.loadCovSelFb = JSON.stringify(img.cov.selection);
				!ppt.loadCovAllFb ? img.getImages() : img.check();
				break;
			case i == 5:
				img.toggle('loadCovAllFb');
				break;
			case i == 6:
				img.toggle('loadCovFolder');
				break;
		}
	}

	setDisplay(i) {
		switch (i) {
			case 0:
			case 1:
			case 2:
				if (ppt.sameStyle) panel.mode(i);
				else {
					ppt.artistView ? ppt.bioMode = i : ppt.revMode = i;
					txt.refresh(0);
				}
				break;
			case 3:
				filmStrip.mbtn_up('onOff');
				break;
			case 4:
				ppt.heading = !ppt.heading ? 2 : 0;
				panel.style.fullWidthHeading = ppt.heading && ppt.fullWidthHeading;
				txt.refresh(1);
				break;
			case 5:
			case 6:
				panel.click('', '', true);
				break;
			case 7:
			case 8:
				ppt.toggle('focus');
				panel.changed();
				txt.on_playback_new_track();
				img.on_playback_new_track();
				break;
			case 9:
				ppt.toggle('imgText');
				txt.refresh(0);
				break;
		}
	}

	setImageBlacklist(i) {
		if (!i) {
			if (!this.img.list.blacklist[this.img.artistClean]) this.img.list.blacklist[this.img.artistClean] = [];
			this.img.list.blacklist[this.img.artistClean].push(this.img.name);
		} else if (img.blackList.undo[0] == this.img.artistClean && i == 2) {
			if (!this.img.list.blacklist[img.blackList.undo[0]]) this.img.list.blacklist[this.img.artistClean] = [];
			if (img.blackList.undo[1].length) this.img.list.blacklist[img.blackList.undo[0]].push(img.blackList.undo[1]);
			img.blackList.undo = [];
		} else {
			const bl_ind = i - (img.blackList.undo[0] == this.img.artistClean ? 3 : 2);
			img.blackList.undo = [this.img.artistClean, this.img.list.blacklist[this.img.artistClean][bl_ind]];
			this.img.list.blacklist[this.img.artistClean].splice(bl_ind, 1);
			$.removeNulls(this.img.list);
		}
		let bl = this.img.list.blacklist[this.img.artistClean];
		if (bl) this.img.list.blacklist[this.img.artistClean] = this.sort([...new Set(bl)]);
		img.blackList.artist = '';
		$.save(this.path.blackList, JSON.stringify({
			'blacklist': $.sortKeys(this.img.list.blacklist)
		}, null, 3), true);
		img.check();
		window.NotifyOthers('bio_blacklist', 'bio_blacklist');
	}

	setPaste(i) {
		switch (i) {
			case 0: {
				this.undo.folder = this.path.am[0];
				this.undo.path = this.path.am[1];
				this.undo.text = $.open(this.undo.path);
				$.buildPth(this.undo.folder);
				$.save(this.undo.path, this.docTxt + '\r\n\r\nCustom ' + (ppt.artistView ? 'Biography' : 'Review'), true);
				const amPth_n = ppt.artistView ? txt.amBioPth() : txt.amRevPth();
				if (this.path.am[1] == amPth_n[1]) {
					ppt.artistView ? ppt.allmusic_bio = true : ppt.allmusic_alb = true;
				}
				window.NotifyOthers('bio_getText', 'bio_getText');
				txt.grab();
				if (ppt.text_only) txt.paint();
				break;
			}
			case 1: {
				this.undo.folder = this.path.lfm[0];
				this.undo.path = this.path.lfm[1];
				this.undo.text = $.open(this.undo.path);
				$.buildPth(this.undo.folder);
				$.save(this.undo.path, this.docTxt + '\r\n\r\nCustom ' + (ppt.artistView ? 'Biography' : 'Review'), true);
				const lfmPth_n = ppt.artistView ? txt.lfmBioPth() : txt.lfmRevPth();
				if (this.path.lfm[1] == lfmPth_n[1]) {
					ppt.artistView ? ppt.allmusic_bio = false : ppt.allmusic_alb = false;
				}
				window.NotifyOthers('bio_getText', 'bio_getText');
				txt.grab();
				if (ppt.text_only) txt.paint();
				break;
			}
			case 2: {
				const open = (c, w) => {
					if (!$.run(c, w)) fb.ShowPopupMessage('Unable to launch your default text editor.', 'Biography');
				};
				open('"' + this.undo.path, 1);
				break;
			}
			case 3:
				if (!this.undo.text.length && $.file(this.undo.path)) {
					fso.DeleteFile(this.undo.path);
					window.NotifyOthers('bio_reload', 'bio_reload');
					if (panel.stndItem()) window.Reload();
					else {
						txt.artistFlush();
						txt.albumFlush();
						txt.grab();
						if (ppt.text_only) txt.paint();
					}
					break;
				}
				$.buildPth(this.undo.folder);
				$.save(this.undo.path, this.undo.text, true);
				this.undo.text = '#!#';
				window.NotifyOthers('bio_getText', 'bio_getText');
				txt.grab();
				if (ppt.text_only) txt.paint();
				break;
		}

	}

	setPlaylist(i) {
		plman.ActivePlaylist = this.playlist.menu[i].ix;
	}

	setStyles(i) {
		switch (i) {
			case 0:
				panel.createStyle();
				break;
			case 1:
				panel.renameStyle(ppt.style);
				break;
			case 2:
				panel.deleteStyle(ppt.style);
				break;
			case 3:
				panel.exportStyle(ppt.style);
				break;
			case 4:
				panel.resetStyle(ppt.style);
				break;
		}
	}

	sort(data) {
		return data.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
	}

	tagsEnabled() {
		this.tags = false;
		for (let i = 0; i < 11; i++)
			if (cfg[`tagEnabled${i}`]) {
				this.tags = true;
				break;
			}
	}

	wheel(step, resetCounters) {
		let i = 0;
		but.clearTooltip();
		let force = false;
		switch (true) {
			case ppt.artistView:
				if (!panel.art.uniq.length) break;
				for (i = 0; i < panel.art.uniq.length; i++)
					if (!panel.art.ix && name.artist(ppt.focus) == panel.art.uniq[i].name || panel.art.ix == panel.art.uniq[i].ix) break;
				i += step;
				if (i < 0) i = panel.art.uniq.length - 1;
				else if (i >= panel.art.uniq.length) i = 0;
				txt.logScrollPos();
				filmStrip.logScrollPos();
				panel.art.ix = panel.art.uniq[i].ix;
				if (panel.art.list[panel.art.ix].type.includes('history')) break;
				panel.logArtistHistory(panel.art.list[panel.art.ix].name);
				panel.getList();
				break;
			case !ppt.artistView:
				if (!panel.alb.uniq.length) break;
				for (i = 0; i < panel.alb.uniq.length; i++)
					if (!panel.alb.ix && name.albumArtist(ppt.focus) + ' - ' + name.album(ppt.focus) == panel.alb.uniq[i].artist + ' - ' + panel.alb.uniq[i].album || panel.alb.ix == panel.alb.uniq[i].ix) break;
				i += step;
				if (i < 0) i = panel.alb.uniq.length - 1;
				else if (i >= panel.alb.uniq.length) i = 0;
				txt.logScrollPos();
				filmStrip.logScrollPos();
				panel.alb.ix = panel.alb.uniq[i].ix;
				if (panel.alb.ix) seeker.show = false;
				if (ppt.showAlbumHistory && ppt.inclTrackRev) {
					panel.style.inclTrackRev = ppt.inclTrackRev;
					if (panel.alb.list[panel.alb.ix].type.includes('history')) panel.style.inclTrackRev = 0;
					txt.albumFlush();
					force = true;
				}
				if (panel.alb.list[panel.alb.ix].type.includes('history')) break;
				panel.logAlbumHistory(panel.alb.list[panel.alb.ix].artist, panel.alb.list[panel.alb.ix].album);
				panel.getList();
				break;
		}
		img.get = false;
		txt.getItem(false, panel.art.ix, panel.alb.ix, force);
		txt.getScrollPos();
		img.getItem(panel.art.ix, panel.alb.ix);
		panel.lookUpServer();
		if (resetCounters) ppt.artistView ? this.counter.bio = 0 : this.counter.rev = 0;
		filmStrip.check();
	}
}