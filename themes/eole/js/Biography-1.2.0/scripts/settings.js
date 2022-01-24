class Setting {
	constructor(key, default_value, type) {
		this.key = key;
		this.default_value = default_value;
		this.type = type;
		this.value = cfg.get(this.key, this.default_value, this.type);
	}

	// Methods

	get() {
		return this.value;
	}
	set(new_value) {
		if (this.value !== new_value) {
			switch (this.type) {
				case 'text':
					if (!new_value && new_value != this.default_value) {
						new_value = this.default_value;
					}
					break;
				case 'boolean':
					if (new_value !== true && new_value !== false) new_value = this.default_value;
					break;
				case 'num':
					new_value = parseInt(new_value);
					if (isNaN(new_value)) {
						new_value = this.default_value;
					}
					break;
			}
			cfg.set(this.key, new_value);
			this.value = new_value;
		}
	}
}

class Settings {
	constructor() {
		// this.key_list = {}; debug

		this.lfmSim = true;
		this.yttm = `${fb.ProfilePath}yttm\\`;
		$.create(this.yttm);

		this.cfgBaseName = 'biography';
		this.bio = `${this.yttm + this.cfgBaseName}.cfg`;

		this.cfg = $.jsonParse(this.bio, {}, 'file')

		this.lang = {
			arr: ['EN', 'DE', 'ES', 'FR', 'IT', 'JA', 'PL', 'PT', 'RU', 'SV', 'TR', 'ZH'],
			ix: 0,
			ok: false
		}

		this.local = $.file('C:\\check_local\\1450343922.txt');
		this.remap = {}
		this.pth = {}
		this.sup = {}
		this.tf = {}

		this.photoRecycler = this.yttm + 'oldPhotosForDeletion\\';

		this.suffix = {
			foLfmRev: ' [Lastfm Review]',
			foLfmBio: ' [Lastfm Biography]',
			foAmRev: ' [Allmusic Review]',
			foAmBio: ' [Allmusic Biography]'
		}
	}

	// Methods

	init(settings) {
		this.checkCfg(settings);
		settings.forEach(v => {
			// this.validate(v); debug
			this.add(v);
		});
		this.parse();
	}

	validate(item) {
		if (!$.isArray(item) || item.length !== 5 || typeof item[4] !== 'string') {
			throw ('invalid settings: requires array: [string, any, string, string, string]: ' + item[4]);
		}

		if (item[4] === 'add') {
			throw ('settings_id: ' + item[4] + '\nThis id is reserved');
		}

		if (this[item[4]] != null || this[item[4] + '_internal'] != null) {
			throw ('settings_id: ' + item[4] + '\nThis id is already occupied');
		}

		if (this.key_list[item[4]] != null) {
			throw ('settings_key: ' + item[4] + '\nThis key is already occupied');
		}
	}

	add(item) {
		//this.key_list[item[4]] = 1; debug
		this[item[4] + '_internal'] = new Setting(item[4], item[1], item[2]);

		Object.defineProperty(this, item[4], {
			get() {
				return this[item[4] + '_internal'].get();
			},
			set(new_value) {
				this[item[4] + '_internal'].set(new_value);
			}
		});
	}

	get(key, default_value, type) { // initialisation
		let saved_value = this.cfg[key];
		switch (type) { // guard check against users directly editing file erroneously
			case 'text':
				if (!saved_value && saved_value != default_value) {
					this.set(key, default_value);
					return default_value;
				}
				break;
			case 'boolean':
				if (saved_value !== true && saved_value !== false) {
					this.set(key, default_value);
					return default_value;
				}
				break;
			case 'num':
				saved_value = parseInt(saved_value);
				if (isNaN(saved_value)) {
					this.set(key, default_value);
					return default_value;
				}
				break;
		}
		return saved_value;
	}

	set(key, new_value) {
		this.cfg[key] = new_value;
		$.save(this.bio, JSON.stringify($.sortKeys(this.cfg), null, 3), true);
	}

	toggle(name) {
		this[name] = !this[name];
	}

	getLangIndex(n) {
		if (n) this.langLfm = n;
		this.lang.arr.some((v, i) => {
			if (v.toLowerCase() == this.langLfm.toLowerCase()) {
				this.lang.ix = i;
				return this.lang.ok = true;
			}
		});
	}

	setLangLfm(i) {
		if (i < this.lang.arr.length) {
			this.lang.ix = i;
			this.langLfm = this.lang.arr[this.lang.ix];
		} else this.toggle('langLfmFallback');
		panel.server = true;
		window.NotifyOthers('bio_notServer', 0);
		if (panel.server) {
			server.setLangLfm(this.langLfm);
			panel.callServer(2, ppt.focus, '', 1);
			window.NotifyOthers('bio_refresh', 'bio_refresh');
		}
	}

	updateCfg(new_cfg) {
		for (const key of Object.keys(this.cfg)) {
			cfg[key] = this.cfg[key] = new_cfg[key + '_internal'].value;
		}
		this.parse();
	}

	resetCfg() {
		cfg.move(true);
		window.Reload();
		window.NotifyOthers('bio_refresh', 'bio_refresh');
	}

	open() {
		const ok_callback = (new_ppt, new_cfg, type, new_dialogWindow) => {
			if (new_ppt) ui.updateProp($.jsonParse(new_ppt, {}), 'value');
			if (new_cfg) {
				const lang_ix = this.lang.ix;
				this.updateCfg($.jsonParse(new_cfg, {}));
				window.NotifyOthers('bio_newCfg', new_cfg);
				if (lang_ix != this.lang.ix) this.setLangLfm(this.lang.ix);
			}
			if (new_dialogWindow) ppt.set('Biography Dialog Box', new_dialogWindow);
			if (new_ppt || new_cfg) return;
			switch (type) {
				case 'resetPanelCfg':
					ui.updateProp(ppt, 'default_value');
					break;
				case 'resetServerCfg':
					this.resetCfg();
					break;
				case 'empty': {
					const app = new ActiveXObject('Shell.Application');
					app.NameSpace(10).MoveHere(this.photoRecycler);
					break;
				}
				case 'open':
					$.browser(this.photoRecycler, false);
					break;
			}
		}
		const dialogWindow = ppt.get('Biography Dialog Box', JSON.stringify({
			w: 85,
			h: 60,
			def_w: 85,
			def_h: 60,
			tab: 'PanelCfg',
			panelPage: 'display',
			serverPage: 'download'
		}));

		popUpBox.config(JSON.stringify(ppt), JSON.stringify(cfg), dialogWindow, ok_callback, this.lang.ix, $.folder(cfg.photoRecycler));
	}

	setTag(i, handles) {
		switch (true) {
			case i && i < 12:
				this.toggle(`tagEnabled${i - 1}`);
				break;
			case i == 12: {
				const cur = $.jsonParse(ppt.get('Biography Dialog Box'), {});
				ppt.set('Biography Dialog Box', JSON.stringify({
					w: cur.w,
					h: cur.h,
					def_w: 85,
					def_h: 60,
					tab: 'ServerCfg',
					panelPage: cur.panelPage,
					serverPage: 'tagger'
				}));
				this.open();
				break;
			}
			case i == 13:
				if (this.tagEnabled10 && this.tagEnabled11 < 7) tag.check(handles);
				else tag.write(handles);
				break;

		}
		if (i < 12) window.NotifyOthers('bio_refresh', 'bio_refresh');
	}

	parse() {
		const bioRevItems = ['foLfmRev', 'foLfmBio', 'foImgArt', 'foImgRev', 'foAmRev', 'foAmBio'];
		const items = ['foLfmRev', 'foLfmBio', 'foImgArt', 'foLfmSim', 'foAmRev', 'foAmBio', 'foImgCov', 'fnImgCov'];
		const tfIni = ['tfAlbumArtist', 'tfArtist', 'tfAlbum', 'tfTitle'];
		const tfItems = ['albumArtist', 'artist', 'album', 'title'];
		const tfNames = ['%BIO_ALBUMARTIST%', '%BIO_ARTIST%', '%BIO_ALBUM%', '%BIO_TITLE%'];

		tfNames.forEach((v, i) => { // remove self
			this.tf[tfItems[i]] = this[tfIni[i]].replace(RegExp(v, 'gi'), '');
		});

		this.substituteTf = n => {
			tfNames.forEach((v, i) => {
				n = n.replace(RegExp(v, 'gi'), this.tf[tfItems[i]]);
			})
			return n;
		}

		tfItems.forEach(v => this.tf[v] = this.substituteTf(this.tf[v]));

		items.forEach(v => {
			this.pth[v] = this[v];
			this.pth[v] = this.substituteTf(this.pth[v]);
		});

		this.suffix = {
			foLfmRev: ' [Lastfm Review]',
			foLfmBio: ' [Lastfm Biography]',
			foAmRev: ' [Allmusic Review]',
			foAmBio: ' [Allmusic Biography]'
		}
		if (this.pth.foLfmRev != this.pth.foAmRev) {
			this.suffix.foLfmRev = this.suffix.foAmRev = '';
		}
		if (this.pth.foLfmBio != this.pth.foAmBio) {
			this.suffix.foLfmBio = this.suffix.foAmBio = '';
		}

		this.albCovFolder = this.substituteTf(this.foCycCov);
		this.exp = Math.max(this.exp, 28);
		this.getLangIndex();
		if (!this.lang.ok) this.langLfm = 'EN';
		this.menuSimilarNum = $.clamp(this.menuSimilarNum, 0, 10);
		this.lfmSim = this.dlLfmSim;
		if (this.lfmSim && this.menuSimilarNum < 7 && (!this.tagEnabled10 || this.tagEnabled11 < 7)) this.lfmSim = false;
		if (this.local) {
			this.lfmSim = false;
			this.imgRevHQ = true;
			this.supCache = true;
		}
		this.photoNum = $.clamp(this.photoNum, 1, 40);
		this.photoLimit = this.photoLimit ? Math.max(this.photoLimit, this.photoNum, this.photoAutoAdd * 5) : 0;
		this.tagEnabled11 = $.clamp(this.tagEnabled11, 1, 6);

		bioRevItems.forEach(v => {
			this.remap[v] = this[v];
			if (v.endsWith('Rev')) this.remap[v] = this.remap[v].replace(/%BIO_ALBUMARTIST%|%BIO_ARTIST%/gi, '%BIO_ALBUMARTIST%'); // simplify later substitutions + convert case
			else this.remap[v] = this.remap[v].replace(/%BIO_ARTIST%|%BIO_ALBUMARTIST%/gi, '%BIO_ARTIST%'); // simplify later substitutions + convert case
		});

		if (this.supCache) { // supplemental
			let replace = this.supFind.split('|');
			const arr1 = replace.map(v => v.trim() || 'yttm');
			replace = this.supReplace.split('|');
			const arr2 = replace.map(v => v.trim() || 'yttm\\bio_supplemental');
			bioRevItems.forEach(v => {
				this.sup[v] = this[v];
				if (arr1.length == arr2.length) arr1.forEach((w, j) => {
					this.sup[v] = this.sup[v].replace(RegExp(w, 'gi'), arr2[j]);
				});
				if (v.endsWith('Rev')) this.sup[v] = this.sup[v].replace(/%BIO_ALBUMARTIST%|%BIO_ARTIST%/gi, '%BIO_ALBUMARTIST%');
				else this.sup[v] = this.sup[v].replace(/%BIO_ARTIST%|%BIO_ALBUMARTIST%/gi, '%BIO_ARTIST%');
			});
		}

		const fields = n => n.replace(/\$.*?\(/gi, '').replace(/(,(|\s+)\d+)/gi, '').replace(/[,()[\]%]/gi, '|').split('|');
		this.albartFields = fields(this.tf.albumArtist).filter(v => v.trim());
		this.artFields = fields(this.tf.artist).filter(v => v.trim());
		this.albFields = fields(this.tf.album).filter(v => v.trim());

		if (this.cusCov) { // custom covers
			this.cusCovPaths = [];
			for (let i = 0; i < 3; i++) {
				let nm = this[`cusCov${i}`];
				if (nm.length) {
					nm = nm.replace(/%profile%\\/i, fb.ProfilePath);
					nm = this.substituteTf(nm);
					this.cusCovPaths.push(nm);
				}
			}
		}
	}

	preview(n, tfAll, excludeStream, sFind, sReplace, artistView, trackReview) {
		if (!tfAll) return txt.tf(n, artistView, trackReview); // heading
		if (excludeStream) {
			const handle = $.handle(ppt.focus, true);
			if (!handle) return;
			const covCanBeSaved = !handle.RawPath.startsWith('fy+') && !handle.RawPath.startsWith('3dydfy:') && !handle.RawPath.startsWith('http');
			if (!covCanBeSaved) return 'Stream: Covers Not Saved';
		}
		n = n.replace(/%profile%\\/i, fb.ProfilePath);
		const tf = tfAll ? tfAll.split('~#~') : [this.tf.albumArtist, this.tf.artist, this.tf.album, this.tf.title];
		const tfNames = ['%BIO_ALBUMARTIST%', '%BIO_ARTIST%', '%BIO_ALBUM%', '%BIO_TITLE%'];

		if (sFind || sReplace) { // supplemental
			let replace = sFind.split('|');
			const arr1 = replace.map(v => v.trim() || 'yttm');
			replace = sReplace.split('|');
			const arr2 = replace.map(v => v.trim() || 'yttm\\bio_supplemental');
			if (arr1.length == arr2.length) {
				n = this.foLfmBio
				arr1.forEach((v, i) => n = n.replace(RegExp(v, 'gi'), arr2[i]));
			} else n = 'Invalid find and replace'
			n = n.replace(/%BIO_ARTIST%|%BIO_ALBUMARTIST%/gi, '%BIO_ARTIST%');
		}
		tfNames.forEach((v, i) => n = n.replace(RegExp(v, 'gi'), tf[i]))
		return panel.cleanPth(n, false);
	}

	checkCfg() {
		if ($.file(this.bio)) return;
		const orig_ini = `${this.yttm}biography.ini`;
		const updated_from_orig_ini = `${this.yttm}updated_from_orig_ini.txt`;
		if ($.file(updated_from_orig_ini) || !$.file(orig_ini)) { // check if already updated from orig_ini
			this.createCfg(settings);
			return;
		}
		// create new style cfg from orig_ini: should handle any previous: unmatched items set to default
		const value = (section, key, def) => utils.ReadINI(orig_ini, section, key) || def;
		settings.forEach(v => {
			let val = value(v[3], v[0], v[1]);
			if (v[2] == 'boolean') {
				if (val === '1' || val === '0') val = val.replace('1', true).replace('0', false);
				else val = v[1];
			}
			v[1] = val;
		});
		this.createCfg(settings);
		$.save(updated_from_orig_ini, 'true');
		const dblClick = utils.ReadINI(orig_ini, 'MISCELLANEOUS', 'Mouse Left Button Click: Map To Double-Click');
		ppt.dblClickToggle = dblClick === '0' ? false : dblClick === '1' ? true : false;
	}

	createCfg(settings) {
		settings.forEach(v => {
			this.cfg[v[4]] = v[1];
		});
		if (this.cfg.supFo && this.cfg.supFo.includes('>')) {
			const split = this.cfg.supFo.split('>');
			if (split[0].length && split[1].length) {
				this.cfg.supFind = split[0];
				this.cfg.supReplace = split[1];
			}

		}
		$.save(this.bio, JSON.stringify($.sortKeys(this.cfg), null, 3), true);
	}

	move(n) {
		const d = new Date;
		const timestamp = [d.getFullYear(), $.padNumber((d.getMonth() + 1), 2), $.padNumber(d.getDate(), 2)].join('-') + '_' + [$.padNumber(d.getHours(), 2), $.padNumber(d.getMinutes(), 2), $.padNumber(d.getSeconds(), 2)].join('-');
		try {
			const fn = `${this.yttm + this.cfgBaseName}_old_${timestamp}.cfg`;
			if (!$.file(fn)) fso.MoveFile(this.bio, fn);
		} catch (e) {
			if (n) fb.ShowPopupMessage(`Unable to reset server settings.\n\n${this.cfgBaseName}.cfg is being used by another program.`, 'Biography');
		}
	}
}

let h = '';
let settings = [
		['Album Review [Allmusic] Auto-Fetch', true, 'boolean', h = 'AUTO-FETCH', 'dlAmRev'], // setting[0] & settings[3] are only needed to update from orig_ini
		['Biography [Allmusic] Auto-Fetch', true, 'boolean', h, 'dlAmBio'],
		['Album Review [Lastfm] Auto-Fetch', true, 'boolean', h, 'dlLfmRev'],
		['Biography [Lastfm] Auto-Fetch', true, 'boolean', h, 'dlLfmBio'],
		['Image [Artist] Auto-Fetch', true, 'boolean', h, 'dlArtImg'],
		['Image [Review] Auto-Fetch', true, 'boolean', h, 'dlRevImg'],
		['Save List 0-Never 1-Auto', true, 'boolean', h = 'ADVANCED: SIMILAR ARTISTS', 'dlLfmSim'],

		['%BIO_ALBUMARTIST%', '$if3($meta(album artist,0),$meta(artist,0),$meta(composer,0),$meta(performer,0))', 'text', h = 'NAMES', 'tfAlbumArtist'],
		['%BIO_ARTIST%', '$if3($meta(artist,0),$meta(album artist,0),$meta(composer,0),$meta(performer,0))', 'text', h, 'tfArtist'],
		['%BIO_ALBUM%', '$meta(album,0)', 'text', h, 'tfAlbum'],
		['%BIO_TITLE%', '$meta(title,0)', 'text', h, 'tfTitle'],

		['Lastfm Language', 'EN', 'text', h = 'LASTFM LANGUAGE', 'langLfm'],
		['Lastfm Language Fallback To English', false, 'boolean', h, 'langLfmFallback'],

		['Album Review [Allmusic] Folder', '%profile%\\yttm\\review\\allmusic\\$lower($cut(%BIO_ALBUMARTIST%,1))', 'text', h = 'SAVE', 'foAmRev'],
		['Biography [Allmusic] Folder', '%profile%\\yttm\\biography\\allmusic\\$lower($cut(%BIO_ARTIST%,1))', 'text', h, 'foAmBio'],
		['Album Review [Lastfm] Folder', '%profile%\\yttm\\review\\lastfm\\$lower($cut(%BIO_ALBUMARTIST%,1))', 'text', h, 'foLfmRev'],
		['Biography [Lastfm] Folder', '%profile%\\yttm\\biography\\lastfm\\$lower($cut(%BIO_ARTIST%,1))', 'text', h, 'foLfmBio'],
		['Image [Artist] Folder', '%profile%\\yttm\\art_img\\$lower($cut(%BIO_ARTIST%,1))\\%BIO_ARTIST%', 'text', h, 'foImgArt'],
		['Image [Review] Folder', '%profile%\\yttm\\rev_img\\$lower($cut(%BIO_ALBUMARTIST%,1))\\%BIO_ALBUMARTIST%', 'text', h, 'foImgRev'],
		['Save Folder', '%profile%\\yttm\\lastfm\\$lower($cut(%BIO_ARTIST%,1))', 'text', h = 'ADVANCED: SIMILAR ARTISTS', 'foLfmSim'],

		['Image [Artist] Initial Fetch Number (1-20)', 5, 'num', h = 'MISCELLANEOUS', 'photoNum'],
		['Image [Artist] Auto-Add New', true, 'boolean', h, 'photoAutoAdd'],
		['Image [Artist] Cache Limit', false, 'num', h, 'photoLimit'],

		['Auto-Save', false, 'boolean', h = 'COVERS: MUSIC FILES', 'dlLfmCov'],
		['Auto-Save Folder', '$directory_path(%path%)', 'text', h, 'foImgCov'],
		['Auto-Save File Name', 'cover', 'text', h, 'fnImgCov'],

		['Folder', '%profile%\\yttm\\art_img\\$lower($cut(%BIO_ARTIST%,1))\\%BIO_ARTIST%', 'text', h = 'COVERS: CYCLE FOLDER', 'foCycCov'],
		['Album Name Auto-Clean', false, 'boolean', h = 'MISCELLANEOUS', 'albStrip'],
		['Cache Expiry (days: minimum 28)', 28, 'num', h, 'exp'],

		['Review Image Quality 0-Medium 1-High', false, 'boolean', h = 'ADVANCED: MORE MENU ITEMS', 'imgRevHQ'],
		['Search: Include Partial Matches', true, 'boolean', h = 'MISCELLANEOUS', 'partialMatch'],
		['Similar Artists: Number to Display(0-10)', 6, 'num', h = 'ADVANCED: MORE MENU ITEMS', 'menuSimilarNum'],
		['Various Artists', 'Various Artists', 'text', h = 'MISCELLANEOUS', 'va'],

		['Write Tag: Album Genre AllMusic', true, 'boolean', h = 'ADVANCED: TAG WRITER', 'tagEnabled0'],
		['Write Tag: Album Mood AllMusic', true, 'boolean', h, 'tagEnabled1'],
		['Write Tag: Album Rating AllMusic', true, 'boolean', h, 'tagEnabled2'],
		['Write Tag: Album Theme AllMusic', true, 'boolean', h, 'tagEnabled3'],
		['Write Tag: Artist Genre AllMusic', true, 'boolean', h, 'tagEnabled4'],
		['Write Tag: Album Genre Last.fm', true, 'boolean', h, 'tagEnabled5'],
		['Album Listeners Last.fm', false, 'boolean', h, 'tagEnabled6'],
		['Write Tag: Artist Genre Last.fm', true, 'boolean', h, 'tagEnabled7'],
		['Artist Listeners Last.fm', false, 'boolean', h, 'tagEnabled8'],
		['Write Tag: Locale Last.fm', true, 'boolean', h, 'tagEnabled9'],
		['Similar Artists Last.fm', true, 'boolean', h, 'tagEnabled10'],
		['Write Tag: Similar Artists Last.fm: Number to Write (0-100)', 5, 'num', h, 'tagEnabled11'],
		['Notify Tags: Current Track', false, 'boolean', h, 'notifyTags'],

		['Tag Name: Album Genre AllMusic=Album Genre AllMusic', 'Album Genre AllMusic', 'text', h, 'tagName0'],
		['Tag Name: Album Mood AllMusic=Album Mood AllMusic', 'Album Mood AllMusic', 'text', h, 'tagName1'],
		['Tag Name: Album Rating AllMusic=Album Rating AllMusic', 'Album Rating AllMusic', 'text', h, 'tagName2'],
		['Tag Name: Album Theme AllMusic=Album Theme AllMusic', 'Album Theme AllMusic', 'text', h, 'tagName3'],
		['Tag Name: Artist Genre AllMusic=Artist Genre AllMusic', 'Artist Genre AllMusic', 'text', h, 'tagName4'],
		['Tag Name: Album Genre Last.fm=Album Genre Last.fm', 'Album Genre Last.fm', 'text', h, 'tagName5'],
		['Album Listeners Last.fm', 'Album Listeners Last.fm', 'text', h, 'tagName6'],
		['Tag Name: Artist Genre Last.fm=Artist Listeners Last.fm', 'Artist Genre Last.fm', 'text', h, 'tagName7'],
		['Artist Listeners Last.fm', 'Artist Listeners Last.fm', 'text', h, 'tagName8'],
		['Tag Name: Locale Last.fm', 'Locale Last.fm', 'text', h, 'tagName9'],
		['Tag Name: Similar Artists Last.fm', 'Similar Artists Last.fm', 'text', h, 'tagName10'],

		['Image [Cover] Check Custom Paths', false, 'boolean', h = 'ADVANCED: CUSTOM COVER PATHS', 'cusCov'],
		['Image [Cover] Custom Path 1 [Full Path Minus Extension]', '', 'text', h, 'cusCov0'],
		['Image [Cover] Custom Path 2 [Full Path Minus Extension]', '', 'text', h, 'cusCov1'],
		['Image [Cover] Custom Path 3 [Full Path Minus Extension]', '', 'text', h, 'cusCov2'],

		['Use Supplemental Cache', false, 'boolean', h = 'ADVANCED: MORE MENU ITEMS', 'supCache'],
		['Supplemental Cache [Use Find>Replace on SAVE paths]', 'yttm>yttm\\bio_supplemental', 'text', h, 'supFo'],
		['Supplemental Cache Find', 'yttm', 'text', h, 'supFind'],
		['Supplemental Cache Replace', 'yttm\\bio_supplemental', 'text', h, 'supReplace'],

		['Configuration Width', 67, 'num', h, 'configWidth'],
		['Configuration Height', 85, 'num', h, 'configHeight'],
		['Show console messages', true, 'boolean', h, 'showConsoleMessages']
		
	];

const cfg = new Settings;
cfg.init(settings);
settings = undefined;