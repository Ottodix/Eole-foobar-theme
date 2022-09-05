'use strict';

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
		this.sources = [];
		this.tags = false;
		this.types = [];
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
			covType: ['Front', 'Back', 'Disc', 'Icon', 'Artist', 'Cycle above', 'Cycle from folder'],
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
			tracksAm: [],
			tracksLfm: [],
			tracksWiki: [],
			txt: [],
			wiki: [],
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
		const artist = panel.art.list.length ? panel.art.list[0].name : name.artist(panel.id.focus);
		switch (ppt.artistView) {
			case true:
				panel.art.list.forEach((v, i) => bMenu.newItem({
					str: v.name.replace(/&/g, '&&') + v.field.replace(/&/g, '&&'),
					func: () => this.lookUpArtist(i),
					flags: v.type != 'label' ? MF_STRING : MF_GRAYED,
					checkRadio: i == panel.art.ix,
					separator: !i || v.type == 'similarend' || v.type == 'label' || v.type == 'tagend' || v.type == 'historyend'
				}));
				for (let i = 0; i < 4; i++) bMenu.newItem({
					str: () => ['Manual cycle: wheel over button', 'Auto cycle items', popUpBox.ok ? 'Options...' : 'Options: see console', 'Reload'][i],
					func: () => this.lookUpArtist(panel.art.list.length + i),
					flags: !i ? MF_GRAYED : MF_STRING,
					checkItem: i == 1 && ppt.cycItem,
					separator: true
				});

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

				bMenu.newItem({
					separator: true,
					hide: !txt.bio.reader && panel.id.lyricsSource
				});

				bMenu.newItem({
					str: 'Lyrics are always of current track',
					flags: MF_GRAYED,
					hide: !txt.bio.reader && panel.id.lyricsSource
				});
				break;
			case false:
				panel.alb.list.forEach((v, i) => bMenu.newItem({
					str: ((!i || v.type.includes('history') ? v.artist.replace(/&/g, '&&') + ' - ' + v.album.replace(/&/g, '&&') : v.album.replace(/&/g, '&&')) + (!v.composition ? '' : ' [composition]')).replace(/^\s-\s/, ''),
					func: () => this.lookUpAlbum(i),
					flags: v.type != 'label' && v.album != 'Album History:' ? MF_STRING : MF_GRAYED,
					checkRadio: i == panel.alb.ix,
					separator: !i || v.type == 'albumend' || v.type == 'label' || v.type == 'historyend'
				}));
				for (let i = 0; i < 4; i++) bMenu.newItem({
					str: () => ['Manual cycle: wheel over button', 'Auto cycle items', popUpBox.ok ? 'Options...' : 'Options: see console', 'Reload'][i],
					func: () => this.lookUpAlbum(panel.alb.list.length + i),
					flags: !i ? MF_GRAYED : MF_STRING,
					checkItem: i == 1 && ppt.cycItem,
					separator: true
				});

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
				
				bMenu.newItem({
					separator: true,
					hide: !txt.rev.reader && panel.id.lyricsSource
				});

				bMenu.newItem({
					str: 'Lyrics are always of current track',
					flags: MF_GRAYED,
					hide: !txt.rev.reader && panel.id.lyricsSource
				});
				break;
		}
		bMenu.load(x, y);
	}

	mainMenu() {
		menu.newMenu({});
		menu.newItem({
			str: `${$.titlecase(cfg.cfgBaseName)} server`,
			flags: MF_GRAYED,
			separator: true,
			hide: !$.server || !this.shift || !vk.k('ctrl')
		});

		const b = ppt.artistView ? 'Bio' : 'Rev';
		const loadName = 'Load' + (!ppt.sourceAll ? '' : ' first');
		const n = b.toLowerCase();
		const separator = !ppt.artistView && (ppt.showTrackRevOptions || txt.isCompositionLoaded()) || !panel.stndItem();

		menu.newMenu({
			menuName: loadName,
			str: 'Load',
			hide: ppt.img_only
		});

		this.sources.forEach((v, i) => menu.newItem({
			menuName: loadName,
			str: v,
			func: () => this.toggle(i, b, true),
			flags: () => txt[n][this.types[i]] ? MF_STRING : MF_GRAYED,
			checkRadio: i == txt[n].loaded.ix,
			separator: txt[n].reader ? i == 3 && separator : i == 2 && separator
		}));

		menu.newItem({
			menuName: loadName,
			str: 'Type:',
			flags: MF_GRAYED,
			separator: true,
			hide: !ppt.showTrackRevOptions || ppt.artistView || !panel.stndItem() || txt.isCompositionLoaded()
		});

		['Album', 'Track', 'Prefer both'].forEach((v, i) => menu.newItem({
			menuName: loadName,
			str: v,
			func: () => {
				txt.logScrollPos();
				panel.style.inclTrackRev = ppt.inclTrackRev = [0, 2, 1][i];
				if (ppt.inclTrackRev) server.checkTrack({
					focus: panel.id.focus,
					force: false,
					menu: true,
					artist: panel.art.list.length ? panel.art.list[0].name : name.artist(panel.id.focus),
					title: name.title(panel.id.focus)
				});
				txt.refresh(1);
				txt.getScrollPos();
			},
			flags: !txt[n][this.types[0]] && !txt[n][this.types[1]] && !txt[n][this.types[2]] ? MF_STRING : !txt[n].loaded.txt && [this.albAvail, this.trkAvail, this.albAvail || this.trkAvail][i] ? MF_STRING : MF_GRAYED,
			checkRadio: !i && !ppt.inclTrackRev || i == 1 && ppt.inclTrackRev == 2 || i == 2 && ppt.inclTrackRev == 1,
			hide: !ppt.showTrackRevOptions || ppt.artistView || !panel.stndItem() || txt.isCompositionLoaded()
		}));

		if (!panel.stndItem() || txt.isCompositionLoaded()) {
			menu.newItem({
				menuName: loadName,
				str: 'Mode: ' + (ppt.artistView ? 'artist look-up' : (txt.isCompositionLoaded() ? 'composition loaded' : 'album look-up')),
				flags: MF_GRAYED
			});
		}

		menu.newItem({
			separator: !ppt.img_only ? true : false
		});

		menu.newMenu({
			menuName: 'Display',
			str: 'Display'
		});

		for (let i = 0; i < 10; i++) menu.newItem({
			menuName: 'Display',
			str: () => this.display.str[i],
			func: () => this.setDisplay(i),
			flags: i == 1 && ppt.autoEnlarge || i == 9 && panel.id.lyricsSource ? MF_GRAYED : MF_STRING,
			checkItem: (i > 2 && i < 6) && this.display.check[i],
			checkRadio: (i < 3 || i > 5 && i < 8 || i > 7) && this.display.check[i],
			separator: i == 2 || i == 5 || i == 7
		});

		menu.newItem({
			separator: true
		});

		menu.newMenu({
			menuName: 'Sources',
			str: 'Sources'
		});

		menu.newMenu({
			menuName: 'Text',
			str: 'Text',
			appendTo: 'Sources'
		});

		for (let i = 0; i < 5; i++) menu.newItem({
			menuName: 'Text',
			str: ['Auto-fallback', 'Static', 'Amalgamate', 'Show track review options on load menu', 'Prefer composition reviews (allmusic && wikipedia)'][i],
			func: () => {
				switch (i) {
					case 0:
					case 1: this.toggle(4, b); break;
					case 2: ppt.toggle('sourceAll'); txt.refresh(1); break;
					case 3:
						ppt.toggle('showTrackRevOptions');
						txt.logScrollPos();
						panel.style.inclTrackRev = ppt.inclTrackRev = 0;
						if (ppt.showTrackRevOptions) server.checkTrack({
							focus: panel.id.focus,
							force: false,
							menu: true,
							artist: panel.art.list.length ? panel.art.list[0].name : name.artist(panel.id.focus),
							title: name.title(panel.id.focus)
						});
						txt.refresh(1);
						txt.getScrollPos();
						break;
					case 4: ppt.toggle('classicalMusicMode'); ppt.classicalAlbFallback = ppt.classicalMusicMode; txt.refresh(1); break;
				}
			},
			flags: !i && ppt.sourceAll || i == 1 && ppt.sourceAll ? MF_GRAYED : MF_STRING,
			checkItem: i == 2 && ppt.sourceAll || i == 3 && ppt.showTrackRevOptions || i == 4 && ppt.classicalMusicMode,
			checkRadio: !i && (!ppt[`lock${b}`] || ppt.sourceAll) || i == 1 && ppt[`lock${b}`] && !ppt.sourceAll,
			separator: i == 1 || i == 2 || i == 3 && cfg.classicalModeEnable,
			hide: i == 4 && !cfg.classicalModeEnable
		});

		menu.newItem({
			menuName: 'Sources',
			separator: true
		});

		menu.newMenu({
			menuName: 'Photo',
			appendTo: 'Sources',
			str: 'Photo'
		});

		['Cycle from download folder', 'Cycle from custom folder [fallback to above]', 'Artist (single image [fb2k: display])'].forEach((v, i) => menu.newItem({
			menuName: 'Photo',
			str: v,
			func: () => {
				ppt.cycPhoto = i < 2;
				ppt.cycPhotoLocation = i;
				if (i == 1 && !ppt.get('SYSTEM.Photo Folder Checked', false)) {
					fb.ShowPopupMessage('Enter folder in options: "Server Settings"\\Photo\\Custom photo folder.', 'Biography: custom folder for photo cycling');
					ppt.set('SYSTEM.Photo Folder Checked', true);
				}
				img.updImages();
			},
			checkRadio: ppt.cycPhotoLocation == i,
			separator: i == 1
		}));

		menu.newMenu({		
			menuName: 'Cover',
			str: 'Cover',
			appendTo: 'Sources',
			flags: !panel.alb.ix || ppt.artistView ? MF_STRING : MF_GRAYED
		});

		this.img.covType.forEach((v, i) => menu.newItem({
			menuName: 'Cover',
			str: v,
			func: () => this.setCover(i),
			flags: ppt.loadCovFolder && !ppt.loadCovAllFb && i < 5 ? MF_GRAYED : MF_STRING,
			checkItem: (ppt.loadCovAllFb || i > 4) && [img.cov.selection[0] != -1, img.cov.selection[1] != -1, img.cov.selection[2] != -1, img.cov.selection[3] != -1, img.cov.selection[4] != -1, ppt.loadCovAllFb, ppt.loadCovFolder][i],
			checkRadio: !ppt.loadCovAllFb && i == ppt.covType,
			separator: i == 4
		}));

		menu.newItem({
			menuName: 'Sources',
			separator: true
		});

		menu.newMenu({
			menuName: 'Open file location',
			str: 'Open file location',
			appendTo: 'Sources',
			flags: this.path.img || this.path.am[3] || this.path.lfm[3] || this.path.wiki[3] || this.path.txt[3] || this.path.tracksAm[3] || this.path.tracksLfm[3] || this.path.tracksWiki[3] ? MF_STRING : MF_GRAYED,
		});

		for (let i = 0; i < 8; i++) menu.newItem({
			menuName: 'Open file location',
			str:  this.openName[i],
			func: () => {
				$.browser('explorer /select,' + '"' + this.path.open[i] + '"', false)
			},
			flags: this.path.img || this.path.am[3] || this.path.lfm[3] || this.path.wiki[3] || this.path.txt[3] || this.path.tracksAm[3] || this.path.tracksLfm[3] || this.path.tracksWiki[3] ? MF_STRING : MF_GRAYED,
			separator: !i && this.openName.length > 1 && this.path.img || this.path.txt[3] && i == this.openName.length - 2 && this.openName.length > 2,
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

		for (let i = 0; i < 5; i++) menu.newItem({
			menuName: 'Paste text from clipboard',
			str: [ppt.artistView ? 'Biography [allmusic location]' : 'Review [allmusic location]', ppt.artistView ? 'Biography [last.fm location]' : 'Review [last.fm location]', ppt.artistView ? 'Biography [wikipedia location]' : 'Review [wikipedia location]', 'Open last edited', 'Undo'][i],
			func: () => this.setPaste(i),
			flags: !i && !this.path.am[2] || i == 1 && !this.path.lfm[2]  || i == 2 && !this.path.wiki[2] || i == 3 && !this.undo.path || i == 4 && this.undo.text == '#!#' ? MF_GRAYED : MF_STRING,
			separator: i == 2 || i == 3
		});

		menu.newItem({
			menuName: 'Sources',
			str: 'Force update',
			func: () => panel.callServer(1, panel.id.focus, 'bio_forceUpdate', 0)
		});

		const style_arr = panel.style.name.slice();
		menu.newMenu({
			menuName: 'Layout',
			str: 'Layout'
		});

		style_arr.forEach((v, i) => menu.newItem({
			menuName: 'Layout',
			str: v,
			func: () => {
				const prop = ppt.sameStyle ? 'style' : ppt.artistView ? 'bioStyle' : 'revStyle';
				ppt[prop] = i;
				txt.refresh(0);
				if (ppt.filmStripOverlay) filmStrip.set(ppt.filmStripPos);
			},
			checkRadio: () => {
				const CheckIndex = ppt.sameStyle ? ppt.style : ppt.artistView ? ppt.bioStyle : ppt.revStyle;
				return CheckIndex <= style_arr.length - 1 && i == CheckIndex;
			},
			separator: i == 4 || style_arr.length > 5 && i == style_arr.length - 1
		}));

		menu.newMenu({
			menuName: 'Create && manage styles',
			str: 'Create && manage styles',
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
			str: 'Filmstrip',
			appendTo: 'Layout'
		});

		['Top', 'Right', 'Bottom', 'Left', 'Overlay image area', 'Reset to default size...'].forEach((v, i) => menu.newItem({
			menuName: 'Filmstrip',
			str: v,
			func: () => {
				if (i == 4) ppt.toggle('filmStripOverlay');
				filmStrip.set(i == 4 ? ppt.filmStripPos : i)
			},
			checkItem: i == 4 && ppt.filmStripOverlay,
			checkRadio: i < 4 && i == ppt.filmStripPos,
			separator: i == 3 || i == 4
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
			menuName: 'Image',
			str: 'Image',
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
			str: 'Alignment',
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
			str: 'Alignment horizontal',
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
			str: 'Alignment vertical',
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
			str: 'Black list',
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
			flags: this.handles.Count ? MF_STRING : MF_GRAYED,
			separator: ppt.menuShowTagger == 2 || ppt.menuShowTagger && this.shift,
			hide: !ppt.menuShowTagger || ppt.menuShowTagger == 1 && !this.shift
		});

		for (let i = 0; i < 13 + 4; i++) menu.newItem({
			menuName: 'Tagger',
			str: !i ? 'Write existing file info to tags: ' : i == 13 + 1 ? 'All tagger settings...' : i == 13 + 2 ? (cfg.taggerConfirm ? 'Tag files...' : `Tag ${this.handles.Count} ${this.handles.Count > 1 ? 'tracks' : 'track'}...`) + (this.tags ? '' : ' N/A no tags enabled') : i == 13 + 3 ? 'Cancel' : i == 11 ? cfg[`tagName${i - 1}`] + (cfg[`tagEnabled${i - 1}`] ? ' (' + cfg[`tagEnabled${i + 2}`] + ')' : '') : cfg[`tagName${i - 1}`],
			func: () => cfg.setTag(i, this.handles),
			flags: !i || i == 13 + 1 && !this.tags ? MF_GRAYED : MF_STRING,
			checkItem: i && i < 13 + 1 && cfg[`tagEnabled${i - 1}`],
			separator: !i || i == 5 || i == 11 || i == 13
		});

		menu.newMenu({
			menuName: 'Missing data',
			separator: ppt.menuShowMissingData == 2 || ppt.menuShowMissingData && this.shift,
			hide: !ppt.menuShowMissingData || ppt.menuShowMissingData == 1 && !this.shift
		});

		['Album review [allmusic]', 'Album review [last.fm]', 'Album review [wikipedia]', 'Biography [allmusic]', 'Biography [last.fm]', 'Biography [wikipedia]', 'Photos [last.fm]'].forEach((v, i) => menu.newItem({
			menuName: 'Missing data',
			str: v,
			func: () => this.checkMissingData(i),
			separator: i == 2 || i == 5
		}));

		menu.newItem({
			str: ppt.panelActive ? 'Inactivate' : 'Activate biography',
			func: () => panel.inactivate(),
			separator: true,
			hide: !ppt.menuShowInactivate || ppt.menuShowInactivate == 1 && !this.shift
		});

		for (let i = 0; i < 2; i++) menu.newItem({
			str: () => [popUpBox.ok ? 'Options...' : 'Options: see console', 'Configure...'][i],
			func: () => !i ? cfg.open('PanelCfg') : window.EditScript(),
			separator: !i && this.shift,
			hide: i && !this.shift
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
				this.missingRev('foWikiRev', 'Wikipedia', 'Album Review');
				break;
			case 3:
				this.missingBio('foAmBio', 'AllMusic', 'Biography');
				break;
			case 4:
				this.missingBio('foLfmBio', 'Last.fm', 'Biography');
				break;
			case 5:
				this.missingBio('foWikiBio', 'Wikipedia', 'Biography');
				break;
			case 6:
				this.missingArtImg('foImgArt', 'Last.fm', 'Photo');
				break;
		}
	}

	fresh() {
		if (panel.block() || !ppt.cycItem || panel.zoom() || panel.id.lyricsSource && lyrics.scroll) return;
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
		this.path.blackList = `${cfg.storageFolder}blacklist_image.json`;

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
		this.display.check = [ppt.sameStyle ? !ppt.img_only && !ppt.text_only : m == 0, ppt.sameStyle ? ppt.img_only : m == 1, ppt.sameStyle ? ppt.text_only : m == 2, ppt.showFilmStrip, ppt.heading, ppt.summaryShow, ppt.artistView, !ppt.artistView, !panel.id.focus, panel.id.focus];
		const n = ['Image+text', 'Image', 'Text', 'Filmstrip', 'Heading', 'Summary', 'Artist view', 'Album view', 'Prefer nowplaying', !panel.id.lyricsSource ? 'Follow selected track (playlist)' : 'Follow selected track: N/A lyrics source enabled'];
		const click = [!this.display.check[0] ? '\tMiddle click' : '', !this.display.check[1] && !ppt.text_only && !ppt.img_only ? '\tMiddle click' : '', !this.display.check[2] && !ppt.img_only ? '\tMiddle click' : '', '\tALT+Middle click', '', '', !ppt.artistView ? (!ppt.dblClickToggle ? '\tClick' : '\tDouble click') : '', ppt.artistView ? (!ppt.dblClickToggle ? '\tClick' : '\tDouble click') : '', '', ''];
		this.display.str = n.map((v, i) => v + click[i])
	}

	getOpenName() {
		const fo = [this.path.img, this.path.am[3], this.path.lfm[3], this.path.wiki[3], this.path.tracksAm[3], this.path.tracksLfm[3], this.path.tracksWiki[3], this.path.txt[3]];
		this.openName = ['Image', ppt.artistView ? 'Biography [allmusic]' : 'Review [allmusic]', ppt.artistView ? 'Biography [last.fm]' : 'Review [last.fm]', ppt.artistView ? 'Biography [wikipedia]' : 'Review [wikipedia]', ppt.artistView ? '' : 'Tracks [allmusic]', ppt.artistView ? '' : 'Tracks [last.fm]', ppt.artistView ? '' : 'Tracks [wikipedia]', ppt.artistView ? txt.bio.subhead.txt[0] : txt.rev.subhead.txt[0]];
		let i = this.openName.length;
		while (i--)
			if (!fo[i]) {
				this.openName.splice(i, 1);
				fo.splice(i, 1);
				this.path.open.splice(i, 1);
			}
	}

	getSourceNames() {
		const b = ppt.artistView ? 'Bio' : 'Rev';
		const n = b.toLowerCase();
		this.types = !txt[n].reader ? $.source.amLfmWiki : $.source.amLfmWikiTxt;
		this.sources = ['Allmusic', 'Last.fm', 'Wikipedia'];
		this.sources = this.sources.map(v => v + (ppt.artistView ? ' biography' : ' review'));
		if (txt[n].reader) this.sources.push(txt[n].subhead.txt[0] || '');
		if (!panel.stndItem() && txt.reader.lyrics) this.sources[3] += ' // current track';
	}

	images(v) {
		return name.isLfmImg(fso.GetFileName(v));
	}

	isRevAvail() {
		const type = ['alb', 'trk'];
		type.forEach(w => {
			this[`${w}Avail`] = $.source.amLfmWiki.some(v => {
				return ppt.lockRev ? txt.rev.loaded.ix == txt.avail[`${v}${w}`] : txt.avail[`${v}${w}`] != -1;
			});
		});
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
				if (ppt.inclTrackRev) {
					if (i) panel.style.inclTrackRev = 0;
					txt.albumFlush();
					force = true;
				}
				if (panel.alb.list[panel.alb.ix].composition) {
					ppt.sourcerev = 0;
					txt.rev.source.am = true;
				}
				txt.getItem(false, panel.art.ix, panel.alb.ix, force);
				txt.getScrollPos();
				img.getItem(panel.art.ix, panel.alb.ix);
				panel.callServer(false, panel.id.focus, 'bio_lookUpItem', 0);
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
				cfg.open('PanelCfg');
				break;
			case i == panel.alb.list.length + 3:
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
				panel.getList(!ppt.showTopAlbums ? true : false, true);
				break;
			case 1:
				panel.alb.ix = 0;
				ppt.toggle('showAlbumHistory');
				panel.getList(!ppt.showAlbumHistory ? true : false, true);
				break;
			case 2:
				ppt.toggle('autoLock');
				break;
			case 3:
				panel.resetAlbumHistory();
				break;
			default: {
				const artist = panel.art.list.length ? panel.art.list[0].name : name.artist(panel.id.focus);
				const brArr = ['', '/+similar', '/+albums'];
				if (i < 7) $.browser('https://www.last.fm/' + (cfg.language == 'EN' ? '' : cfg.language.toLowerCase() + '/') + 'music/' + encodeURIComponent(artist) + brArr[i - 4], true);
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
			panel.callServer(false, panel.id.focus, 'bio_lookUpItem', 0);
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
				panel.callServer(false, panel.id.focus, 'bio_lookUpItem', 0);
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
				cfg.open('PanelCfg');
				break;
			case i == panel.art.list.length + 3:
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
				const artist = panel.art.list.length ? panel.art.list[0].name : name.artist(panel.id.focus);
				const brArr = ['', '/+similar', '/+albums'];
				if (i < 8) $.browser('https://www.last.fm/' + (cfg.language == 'EN' ? '' : cfg.language.toLowerCase() + '/') + 'music/' + encodeURIComponent(artist) + brArr[i - 5], true);
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
			panel.callServer(false, panel.id.focus, 'bio_lookUpItem', 0);
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
		const caption = this.popUpTitle;
		const prompt = this.popUpText(n2, n3);
		const wsh = soFeatures.gecko && soFeatures.clipboard ? popUpBox.confirm(caption, prompt, 'OK', 'Cancel', continue_confirmation) : true;
		if (wsh) continue_confirmation('ok', $.wshPopup(prompt, caption));
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
		const caption = this.popUpTitle;
		const prompt = this.popUpText(n2, n3);
		const wsh = soFeatures.gecko && soFeatures.clipboard ? popUpBox.confirm(caption, prompt, 'OK', 'Cancel', continue_confirmation) : true;
		if (wsh) continue_confirmation('ok', $.wshPopup(prompt, caption));
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
						let pth = panel.cleanPth(cfg.pth[n1], h, 'tag') + $.clean(albumArtist) + ' - ' + $.clean(album) + cfg.suffix[n1] + '.txt';
						if (pth.length > 259) {
							album = $.abbreviate(album);
							pth = panel.cleanPth(cfg.pth[n1], h, 'tag') + $.clean(albumArtist) + ' - ' + $.clean(album) + cfg.suffix[n1] + '.txt';
						}
						if (albumArtist && album && !$.file(pth)) {
							found = false;
							m.Insert(m.Count, h);
						} else found = true;
					} else if (!found) m.Insert(m.Count, h);
				});
				this.sendToPlaylist(m, n2, n3);
			}
		}
		const caption = this.popUpTitle;
		const prompt = this.popUpText(n2, n3);
		const wsh = soFeatures.gecko && soFeatures.clipboard ? popUpBox.confirm(caption, prompt, 'OK', 'Cancel', continue_confirmation) : true;
		if (wsh) continue_confirmation('ok', $.wshPopup(prompt, caption));
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
		return `Check media library and create playlist: ${n2} ${n3} Missing\n\nServer settings will be used.\n\nADVISORY: This operation analyses a lot of data. It may trigger an "Unresponsive script" pop-up. If that happens choose "Continue" or "Don't ask me again". Choosing "Stop script" will trigger an error.\n\nContinue?`;
	}

	rbtn_up(x, y) {
		this.right_up = true;
		this.shift = vk.k('shift');
		const imgInfo = img.pth();

		this.docTxt = $.getClipboardData() || '';
		this.getDisplayStr();
		this.getSourceNames();
		this.img.artist = imgInfo.artist;
		this.path.img = imgInfo.imgPth;
		this.img.isLfm = imgInfo.blk && this.path.img;
		this.img.name = this.img.isLfm ? this.path.img.slice(this.path.img.lastIndexOf('_') + 1) : this.path.img.slice(this.path.img.lastIndexOf('\\') + 1);
		this.isRevAvail();
		this.path.am = ppt.artistView ? txt.bioPth('Am') : txt.revPth('Am');
		this.path.lfm = ppt.artistView ? txt.bioPth('Lfm') : txt.revPth('Lfm');
		this.path.txt = ppt.artistView ? txt.txtReaderPth() : txt.txtRevPth();
		this.path.wiki = ppt.artistView ? txt.bioPth('Wiki') : txt.revPth('Wiki');
		this.path.tracksAm = ppt.artistView ? '' : txt.trackPth('Am');
		this.path.tracksLfm = ppt.artistView ? '' : txt.trackPth('Lfm');
		this.path.tracksWiki = ppt.artistView ? '' : txt.trackPth('Wiki');
		this.path.open = [this.path.img, this.path.am[1], this.path.lfm[1], this.path.wiki[1], this.path.tracksAm[1], this.path.tracksLfm[1], this.path.tracksWiki[1], this.path.txt[1]];
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
				ppt.heading = !ppt.heading ? 1 : 0;
				panel.style.fullWidthHeading = ppt.heading && ppt.fullWidthHeading;
				if (panel.style.inclTrackRev == 1) txt.logScrollPos();
				txt.refresh(1);
				break;
			case 5:
				ppt.toggle('summaryShow');
				panel.setSummary();
				txt.refresh(1);
				break;
			case 6:
			case 7:
				panel.click('', '', true);
				break;
			case 8:
			case 9:
				ppt.toggle('focus');
				panel.id.focus = ppt.focus;
				panel.changed();
				txt.on_playback_new_track();
				img.on_playback_new_track();
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
			case 0: case 1: case 2: {
				const n = ppt.artistView ? 'bio' : 'rev';
				const s = $.source.amLfmWiki[i];
				this.undo.folder = this.path[s][0];
				this.undo.path = this.path[s][1];
				this.undo.text = $.open(this.undo.path);
				$.buildPth(this.undo.folder);
				$.save(this.undo.path, this.docTxt + '\r\n\r\nCustom ' + (ppt.artistView ? 'Biography' : 'Review'), true);
				const b = ppt.artistView ? 'Bio' : 'Rev';
				const pth = txt[`${n}Pth`](['Am', 'Lfm', 'Wiki'][i]);
				if (this.path[s][1] == pth[1]) {
					ppt[`source${b}`] = 0;
					txt[n].source[s] = true;
				}
				window.NotifyOthers('bio_getText', 'bio_getText');
				txt.grab();
				if (ppt.text_only) txt.paint();
				break;
			}
			case 3: {
				const open = (c, w) => {
					if (!$.run(c, w)) fb.ShowPopupMessage('Unable to launch your default text editor.', 'Biography');
				};
				open('"' + this.undo.path, 1);
				break;
			}
			case 4:
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
		for (let i = 0; i < 13; i++)
			if (cfg[`tagEnabled${i}`]) {
				this.tags = true;
				break;
			}
	}

	toggle(i, b, fix, direction) {
		txt.logScrollPos();
		const n = b.toLowerCase();
		if (i === ppt[`source${n}`]) return;
		if (i == 4) {
			ppt.toggle('lockBio');
			ppt.lockRev = ppt.lockBio;
		} else {
		if (i === '') i = ppt[`source${n}`];
			if (fix) {
				ppt[`source${n}`] = i;
			} else if (ppt[`lock${b}`] && !ppt.sourceAll) {
				const limit = txt[n].reader ? 3 : 2;
				direction == 1 ? ppt[`source${n}`] = i == limit ? 0 : ++i : ppt[`source${n}`] = i == 0 ? limit : --i;
			} else {
				if (txt[n].reader) {
					switch (txt[n].loaded.ix) {
						case 0: ppt[`source${n}`] = direction == 1 ? (txt[n].lfm ? 1 : txt[n].wiki ? 2 : txt[n].txt ? 3 : 0) : (txt[n].txt ? 3 : txt[n].wiki ? 2 : txt[n].lfm ? 1 : 0); break;
						case 1: ppt[`source${n}`] = direction == 1 ? (txt[n].wiki ? 2 : txt[n].txt ? 3 : txt[n].am ? 0 : 1) : (txt[n].am ? 0 : txt[n].txt ? 3 : txt[n].wiki ? 2 : 1); break;
						case 2: ppt[`source${n}`] = direction == 1 ? (txt[n].txt ? 3 : txt[n].am ? 0 : txt[n].lfm ? 1 : 2) : (txt[n].lfm ? 1 : txt[n].am ? 0 : txt[n].txt ? 3 : 2); break;
						case 3: ppt[`source${n}`] = direction == 1 ? (txt[n].am ? 0 : txt[n].lfm ? 1 : txt[n].wiki ? 2 : 3) : (txt[n].wiki ? 2 : txt[n].lfm ? 1 : txt[n].am ? 0 : 3); break;
						}
				} else {
					switch (txt[n].loaded.ix) {
						case 0: ppt[`source${n}`] = direction == 1 ? (txt[n].lfm ? 1 : txt[n].wiki ? 2 : 0) : (txt[n].wiki ? 2 : txt[n].lfm ? 1 : 0); break;
						case 1: ppt[`source${n}`] = direction == 1 ? (txt[n].wiki ? 2 : txt[n].am ? 0 : 1) : (txt[n].am ? 0 : txt[n].wiki ? 2 : 1); break;
						case 2: ppt[`source${n}`] = direction == 1 ? (txt[n].am ? 0 : txt[n].lfm ? 1 : 2) : (txt[n].lfm ? 1 : txt[n].am ? 0 : 2); break;
					}
				}
			}
		}
		$.source.amLfmWikiTxt.forEach((v, i) => txt[n].source[v] = ppt[`source${n}`] == i);
		$.source.amLfmWiki.forEach(v => {if (txt[n].source[v]) txt.done[`${v}${b}`] = false});
		txt[n].source.ix = ppt[`source${n}`];
		txt.getText(false);
		but.src.y = but.src.fontSize < 12 || txt[n].loaded.ix == 2 ? 1 : 0;
		txt.getScrollPos();
		img.getImages();
	}

	wheel(step, resetCounters) {
		let i = 0;
		but.clearTooltip();
		let force = false;
		switch (true) {
			case ppt.artistView:
				if (!panel.art.uniq.length) break;
				for (i = 0; i < panel.art.uniq.length; i++)
					if (!panel.art.ix && name.artist(panel.id.focus) == panel.art.uniq[i].name || panel.art.ix == panel.art.uniq[i].ix) break;
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
					if (!panel.alb.ix && name.albumArtist(panel.id.focus) + ' - ' + name.album(panel.id.focus) == panel.alb.uniq[i].artist + ' - ' + panel.alb.uniq[i].album || panel.alb.ix == panel.alb.uniq[i].ix) break;
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