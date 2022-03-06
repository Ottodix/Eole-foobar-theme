class Server {
	constructor() {
		if (!panel.server) return;

		this.albm = '';
		this.album = '';
		this.albumArtist = '';
		this.artist = '';
		this.auto_corr = 1;
		this.bioCache = fb.ProfilePath + 'yttm\\' + 'cache_bio.json';
		this.exp = Math.max(panel.d * cfg.exp / 28, panel.d);
		if (!this.exp || isNaN(this.exp)) this.exp = panel.d;
		this.imgToRecycle = [];
		if ($.file(this.bioCache)) this.imgToRecycle = $.jsonParse(this.bioCache, false, 'file');
		this.lastGetTrack = Date.now();
		this.notFound = fb.ProfilePath + 'yttm\\' + 'update_bio.json';
		this.similar = ['Similar Artists: ', '\u00c4hnliche K\u00fcnstler: ', 'Artistas Similares: ', 'Artistes Similaires: ', 'Artisti Simili: ', '\u4f3c\u3066\u3044\u308b\u30a2\u30fc\u30c6\u30a3\u30b9\u30c8: ', 'Podobni Wykonawcy: ', 'Artistas Parecidos: ', '\u041f\u043e\u0445\u043e\u0436\u0438\u0435 \u0438\u0441\u043f\u043e\u043b\u043d\u0438\u0442\u0435\u043b\u0438: ', 'Liknande Artister: ', 'Benzer Sanat\u00e7\u0131lar: ', '\u76f8\u4f3c\u827a\u672f\u5bb6: '];

		this.id = {
			album: '',
			title: '',
			track_1: '',
			track_2: ''
		};
		this.lfm = {
			server: cfg.langLfm.toLowerCase()
		};
		this.url = {
			lfm: 'https://ws.audioscrobbler.com/2.0/?format=json' + panel.lfm,
			lfm_sf: 'https://www.songfacts.com/'
		}

		this.lfm.def_EN = this.lfm.server == 'www.last.fm';
		this.lfm.fallback = cfg.langLfmFallback && !this.lfm.def_EN;

		this.on_playback_new_track = $.debounce(() => {
			this.download(false, {
				ix: 0,
				focus: false,
				arr: []
			},
			{
				ix: 0,
				focus: false,
				arr: []
			});
		}, 2000, {
			'leading': true,
			'trailing': true
		});

		this.createImgDlFile();
		this.checkNotFound();
		this.setImgRecycler();
		this.setLangLfm();
	}

	// Methods

	checkNotFound() {
		if (!$.file(this.notFound)) $.save(this.notFound, JSON.stringify([{
			'name': 'update',
			'time': Date.now()
		}], null, 3), true);
		let m = $.jsonParse(this.notFound, false, 'file');
		if (!$.isArray(m)) {
			m = [{
				'name': 'update',
				'time': Date.now()
			}];
			$.save(this.notFound, JSON.stringify(m, null, 3), true);
		}
		if (m[0].name != 'update') {
			m.unshift({
				'name': 'update',
				'time': Date.now()
			});
			$.save(this.notFound, JSON.stringify(m, null, 3), true);
		}
	}

	checkTrack(tr) {
		let track_done = false;
		if (tr.artist + tr.title == this.id.track_1 && !tr.force || tr.artist == '' || tr.title == '') track_done = true;
		else this.id.track_1 = tr.artist + tr.title;
		if (cfg.dlLfmRev && !track_done) {
			if (ppt.inclTrackRev) this.getTrack(tr);
			else window.NotifyOthers('bio_chkTrackRev', tr);
		}
	}

	createImgDlFile() {
		const n = fb.ProfilePath + 'yttm\\foo_lastfm_img.vbs';
		if (!$.file(n) || fso.GetFile(n).Size == '696') {
			const dl_im = 'If (WScript.Arguments.Count <> 2) Then\r\nWScript.Quit\r\nEnd If\r\n\r\nurl = WScript.Arguments(0)\r\nfile = WScript.Arguments(1)\r\n\r\nSet objFSO = Createobject("Scripting.FileSystemObject")\r\nIf objFSO.Fileexists(file) Then\r\nSet objFSO = Nothing\r\nWScript.Quit\r\nEnd If\r\n\r\nSet objXMLHTTP = CreateObject("MSXML2.XMLHTTP")\r\nobjXMLHTTP.open "GET", url, false\r\nobjXMLHTTP.send()\r\n\r\nIf objXMLHTTP.Status = 200 Then\r\nSet objADOStream = CreateObject("ADODB.Stream")\r\nobjADOStream.Open\r\nobjADOStream.Type = 1\r\nobjADOStream.Write objXMLHTTP.ResponseBody\r\nobjADOStream.Position = 0\r\nobjADOStream.SaveToFile file\r\nobjADOStream.Close\r\nSet objADOStream = Nothing\r\nEnd If\r\n\r\nSet objFSO = Nothing\r\nSet objXMLHTTP = Nothing';
			$.save(n, dl_im, false);
		}
	}

	done(f, exp) {
		if (!$.file(this.notFound)) return false;
		const m = $.jsonParse(this.notFound, false, 'file');
		const n = Date.now();
		const r = n - exp;
		const u = n - panel.d / 28;
		let k = m.length;
		if (m.length && m[0].time < u) {
			while (k--)
				if (m[k].time < r && k) m.splice(k, 1);
			m[0].time = n;
			$.save(this.notFound, JSON.stringify(m, null, 3), true);
		}
		for (k = 0; k < m.length; k++)
			if (m[k].name == f) return true;
		return false;
	}

	expired(f, exp, f_done, langCheck, type) {
		if (langCheck) {
			const listeners = ['Listeners', 'H\u00f6rer', 'Oyentes', 'Auditeurs', 'Ascoltatori', '\u30ea\u30b9\u30ca\u30fc', 'S\u0142uchaczy', 'Ouvintes', '\u0421\u043b\u0443\u0448\u0430\u0442\u0435\u043b\u0438', 'Lyssnare', 'Dinleyiciler', '\u542c\u4f17']
			const releaseDate = ['Release Date: ', 'Ver\u00f6ffentlichungsdatum: ', 'Fecha De Lanzamiento: ', 'Date De Sortie: ', 'Data Di Pubblicazione: ', '\u30ea\u30ea\u30fc\u30b9\u65e5: ', 'Data Wydania: ', 'Data De Lan\u00e7amento: ', '\u0414\u0430\u0442\u0430 \u0440\u0435\u043b\u0438\u0437\u0430: ', 'Utgivningsdatum: ', 'Yay\u0131nlanma Tarihi: ', '\u53d1\u5e03\u65e5\u671f: '];
			let i = 0;
			switch (type) {
				case 0:
					for (i = 0; i < this.similar.length; i++)
						if (langCheck.includes(this.similar[i]) && i != cfg.lang.ix) return true;
					for (i = 0; i < listeners.length; i++)
						if (langCheck.includes(listeners[i]) && i != cfg.lang.ix) return true;
					break;
				case 1:
					for (i = 0; i < releaseDate.length; i++)
						if (langCheck.includes(releaseDate[i]) && i != cfg.lang.ix) return true;
					for (i = 0; i < listeners.length; i++)
						if (langCheck.includes(listeners[i]) && i != cfg.lang.ix) return true;
					break;
			}
		}
		if (f_done && this.done(f_done, exp)) return false;
		if (!$.file(f)) return true;
		return Date.now() - $.lastModified(f) > exp;
	}

	download(force, art, alb) {
		this.getBio(force, art, 0);
		this.getRev(force, art, alb, force == 2 ? true : false);
	}

	downloadDynamic() {
		this.getBio(false, {
			ix: 0,
			focus: false,
			arr: []
		}, 0);
		this.getBio(false, {
			ix: 0,
			focus: false,
			arr: []
		}, 1);
	}

	format(n) {
		return n.replace(/<P><\/P>/gi, '').replace(/<p[^>]*>/gi, '').replace(/\r/g, '').replace(/\n/g, '').replace(/<\/p>/gi, '\r\n\r\n').replace(/<br>/gi, '\r\n').replace(/(<([^>]+)>)/ig, '').replace(/&amp(;|)/g, '&').replace(/&quot(;|)/g, '"').replace(/&#39(;|)/g, "'").replace(/&gt(;|)/g, '>').replace(/&nbsp(;|)/g, '').replace(/^ +/gm, '').replace(/^\s+|\s+$/g, '');
	}

	getBio(force, art, type) {
		switch (type) {
			case 0: {
				const stndBio = !art.ix || art.ix + 1 > art.arr.length;
				let artist_done = false;
				let new_artist = stndBio ? name.artist(art.focus, true) : art.arr[art.ix].name;
				let supCache = false;
				if (new_artist == this.artist && !force || new_artist == '') artist_done = true;
				else this.artist = new_artist;
				if (!stndBio) supCache = cfg.supCache && !lib.inLibrary(0, this.artist);
				if (cfg.dlLfmBio && !artist_done) {
					const lfm_bio = panel.getPth('bio', art.focus, this.artist, '', stndBio, supCache, $.clean(this.artist), '', '', 'foLfmBio', true, true);
					const text = $.open(lfm_bio.pth);
					const custBio = text.includes('Custom Biography');
					if (this.expired(lfm_bio.pth, this.exp, '', text, 0) && !custBio || force == 2 && !custBio || force == 1) {
						const dl_lfm_bio = new DldLastfmBio(() => dl_lfm_bio.onStateChange());
						dl_lfm_bio.search(this.artist, lfm_bio.fo, lfm_bio.pth, force);
					}
				}
				this.checkTrack({
					force: force,
					artist: stndBio ? this.artist : name.artist(art.focus, true),
					title: name.title(art.focus, true)
				});
				if (!artist_done) {
					if (cfg.dlArtImg) {
						const dl_art = new DldArtImages;
						dl_art.run(this.artist, force, art, stndBio, supCache);
					} else timer.decelerating();
					if (cfg.lfmSim && stndBio) {
						const fo_sim = panel.cleanPth(cfg.pth.foLfmSim, ppt.focus, 'server');
						const pth_sim = fo_sim + $.clean(this.artist) + ' And Similar Artists.json';
						let len = 0;
						let valid = false;
						if ($.file(pth_sim)) {
							const list = $.jsonParse(pth_sim, false, 'file');
							if (list) {
								valid = $.objHasOwnProperty(list[0], 'name');
								len = list.length;
							}
						}
						if (this.expired(pth_sim, this.exp) || !valid || force) {
							const dl_lfm_sim = new LfmSimilarArtists(() => dl_lfm_sim.onStateChange());
							dl_lfm_sim.search(this.artist, '', '', len > 115 ? 249 : 100, fo_sim, pth_sim);
						}
					}
					if (stndBio && cfg.photoLimit && !panel.lock) { // purge imgToRecycle
						let j = this.imgToRecycle.length;
						while (j--) {
							if (this.imgToRecycle[j].a != name.artist(true) && this.imgToRecycle[j].a != name.artist(false)) {
								try {
									if ($.file(this.imgToRecycle[j].p)) {
										$.create(cfg.photoRecycler);
										const fn = fso.GetBaseName(this.imgToRecycle[j].p) + '.jpg'
										if (!$.file(cfg.photoRecycler + fn)) fso.MoveFile(this.imgToRecycle[j].p, cfg.photoRecycler);
										else
											for (let i = 0; i < 100; i++) {
												const new_fn = fn.replace('.jpg', '_' + i + '.jpg');
												if (!$.file(cfg.photoRecycler + new_fn)) {
													fso.MoveFile(this.imgToRecycle[j].p, cfg.photoRecycler + new_fn);
													break;
												}
											}
									}
								} catch (e) {}
								if (!$.file(this.imgToRecycle[j].p)) this.imgToRecycle.splice(j, 1)
							}
						}
						this.setImgRecycler(true);
					}
				}
				break;
			}
			case 1: {
				const stndBio = !art.ix || art.ix + 1 > art.arr.length;
				if (!stndBio || !cfg.dlAmBio) return;
				const title = name.title(art.focus, true);
				if (!this.artist || !title) return;
				const am_bio = panel.getPth('bio', art.focus, this.artist, '', stndBio, false, $.clean(this.artist), '', '', 'foAmBio', true, true);
				if (force || this.expired(am_bio.pth, this.exp, 'Bio ' + cfg.partialMatch + ' ' + this.artist + ' - ' + title, false) && !$.open(am_bio.pth).includes('Custom Biography')) {
					const dl_am_bio = new DldAllmusicBio(() => dl_am_bio.onStateChange());
					dl_am_bio.search(0, 'https://www.allmusic.com/search/songs/' + encodeURIComponent(title + ' ' + this.artist), title, this.artist, am_bio.fo, am_bio.pth, force);
				}
				break;
			}
		}
	}

	getCover(force, alb) { // stndAlb
		const handle = $.handle(alb.focus, true);
		if (!handle) return;
		const g_img = utils.GetAlbumArtV2(handle, 0, false);
		if (g_img) return;
		const covCanBeSaved = !handle.RawPath.startsWith('fy+') && !handle.RawPath.startsWith('3dydfy:') && !handle.RawPath.startsWith('http');
		const sw = cfg.dlLfmCov && covCanBeSaved ? 1 : cfg.dlRevImg ? 0 : 2;
		let lfm_cov;
		switch (sw) {
			case 1: { // cover
				const cov = panel.getPth('cov', alb.focus, 'server');
				if (this.done(this.albumArtist + ' - ' + this.album + ' ' + this.auto_corr + ' ' + cov.pth, this.exp) && !force) return;
				if (img.chkPths([cov.pth], '', 2)) return;
				if (cfg.cusCov && img.chkPths(cfg.cusCovPaths, '', 2, true)) return;
				lfm_cov = new LfmAlbum(() => lfm_cov.onStateChange());
				lfm_cov.search(this.albumArtist, this.album, false, cov.fo, cov.pth, this.albm, force, false);
				break;
			}
			case 0: { // rev_img
				const rev_img = panel.getPth('img', alb.focus, this.albumArtist, this.album);
				if (this.done(this.albumArtist + ' - ' + this.album + ' ' + this.auto_corr + ' ' + rev_img.pth, this.exp) && !force) return;
				if (img.chkPths([rev_img.pth, panel.getPth('cov', alb.focus).pth], '', 2)) return;
				if (cfg.cusCov && img.chkPths(cfg.cusCovPaths, '', 2, true)) return;
				lfm_cov = new LfmAlbum(() => lfm_cov.onStateChange());
				lfm_cov.search(this.albumArtist, this.album, false, rev_img.fo, rev_img.pth, this.albm, force, true);
				break;
			}
		}
	}

	getRev(force, art, alb, onlyForceLfm) {
		const stndAlb = !alb.ix || alb.ix + 1 > alb.arr.length;
		const new_album_id = stndAlb ? $.eval(cfg.tf.albumArtist + cfg.tf.album, alb.focus, true) : alb.arr[alb.ix].artist + alb.arr[alb.ix].album;
		const new_title_id = name.title(art.focus, true);
		let supCache = false;
		let title_done = false;
		if (new_title_id == this.id.title) title_done = true;
		else this.id.title = new_title_id;
		if (new_album_id == this.id.album && !force) {
			if (!title_done) this.getBio(force, art, 1);
			return;
		}
		this.id.album = new_album_id;
		this.album = stndAlb ? name.album(alb.focus, true) : alb.arr[alb.ix].album;
		this.albm = stndAlb ? name.albm(alb.focus, true) : alb.arr[alb.ix].album;
		this.albumArtist = stndAlb ? name.albumArtist(alb.focus, true) : alb.arr[alb.ix].artist;
		if (!this.album || !this.albumArtist) return this.getBio(force, art, 1);
		if (!stndAlb) supCache = cfg.supCache && !lib.inLibrary(1, this.albumArtist, this.album);
		if (stndAlb) {
			if (this.albm) this.getCover(force, alb);
		} else if (force && cfg.dlRevImg) this.getRevImg(this.albumArtist, this.album, '', '', force);

		if (cfg.dlAmRev && !onlyForceLfm) {
			const am_rev = panel.getPth('rev', alb.focus, this.albumArtist, this.album, stndAlb, supCache, $.clean(this.albumArtist), $.clean(this.albumArtist), $.clean(this.album), 'foAmRev', true, true);
			const artiste = stndAlb ? name.artist(alb.focus, true) : this.albumArtist;
			const am_bio = panel.getPth('bio', alb.focus, artiste, '', stndAlb, cfg.supCache && !lib.inLibrary(0, artiste), $.clean(artiste), '', '', 'foAmBio', true, true);
			const art_upd = this.expired(am_bio.pth, this.exp, 'Bio ' + cfg.partialMatch + ' ' + am_rev.pth, false) && !$.open(am_bio.pth).includes('Custom Biography');
			let rev_upd = !this.done('Rev ' + cfg.partialMatch + ' ' + am_rev.pth, this.exp);
			if (rev_upd) {
				let amRev = $.open(am_rev.pth);
				rev_upd = !amRev || (!amRev.includes('Genre: ') || !amRev.includes('Review by ') && Date.now() - $.lastModified($.file(am_rev.pth)) < this.exp) && !amRev.includes('Custom Review');
			}
			let dn_type = '';
			if (rev_upd || art_upd || force) {
				if ((cfg.dlAmRev && rev_upd) && (cfg.dlAmBio && art_upd) || force) dn_type = 'both';
				else if (cfg.dlAmRev && rev_upd || force) dn_type = 'review';
				else if (cfg.dlAmBio && art_upd || force) dn_type = 'bio';
				const dl_am_rev = new DldAllmusicRev(() => dl_am_rev.onStateChange());
				const va = this.albumArtist.toLowerCase() == cfg.va.toLowerCase() || this.albumArtist.toLowerCase() != artiste.toLowerCase();
				dl_am_rev.search(0, 'https://www.allmusic.com/search/albums/' + encodeURIComponent(this.album + (!va ? ' ' + this.albumArtist : '')), this.album, this.albumArtist, artiste, va, dn_type, am_rev.fo, am_rev.pth, am_bio.fo, am_bio.pth, art, force);
			} else this.getBio(force, art, 1);
		}

		if (!cfg.dlLfmRev) return;

		const lfm_rev = panel.getPth('rev', alb.focus, this.albumArtist, this.album, stndAlb, supCache, $.clean(this.albumArtist), $.clean(this.albumArtist), $.clean(this.album), 'foLfmRev', true, true);
		const lfmRev = $.open(lfm_rev.pth);
		const custRev = lfmRev.includes('Custom Review');
		if ((!this.expired(lfm_rev.pth, this.exp, '', lfmRev, 1) || custRev) && !force || custRev && force == 2) return;
		const lfm_alb = new LfmAlbum(() => lfm_alb.onStateChange());
		lfm_alb.search(this.albumArtist, this.album, true, lfm_rev.fo, lfm_rev.pth, '', force, false);
	}

	getRevImg(a, l, pe, fe, force) { // !stndAlb
		if (!force) {
			if (this.done(a + ' - ' + l + ' ' + this.auto_corr + ' ' + fe, this.exp)) return;
			const lfm_cov = new LfmAlbum(() => lfm_cov.onStateChange());
			lfm_cov.search(a, l, false, pe, fe, l, false, true);
		} else {
			const metadb = lib.inLibrary(2, a, l);
			if (metadb) {
				const g_img = utils.GetAlbumArtV2(metadb, 0, false);
				if (g_img) return;
			} else {
				const pth = panel.getPth('img', ppt.focus, a, l, '', cfg.supCache);
				if (img.chkPths(pth.pe, pth.fe, 2)) return;
				const lfm_cov = new LfmAlbum(() => lfm_cov.onStateChange());
				lfm_cov.search(a, l, false, pth.pe[cfg.supCache], pth.pe[cfg.supCache] + pth.fe, l, true, true);
			}
		}
	}

	getTrack(tr) {
		if (Date.now() - this.lastGetTrack < 500) tr.force = false;
		else this.lastGetTrack = Date.now();
		if (this.id.track_2 == tr.artist + tr.title && !tr.force) return;
		this.id.track_2 = tr.artist + tr.title;
		const lfm_tracks = panel.getPth('track', ppt.focus, tr.artist, 'Track Reviews', '', '', $.clean(tr.artist), '', 'Track Reviews', 'foLfmRev', true, true);
		const text = $.jsonParse(lfm_tracks.pth, false, 'file');
		const trk = tr.title.toLowerCase();
		if (!text || !text[trk] || text[trk].update < Date.now() - this.exp || text[trk].lang != cfg.langLfm || tr.force) {
			const dl_lfm_track = new LfmTrack(() => dl_lfm_track.onStateChange());
			dl_lfm_track.search(tr.artist, trk, lfm_tracks.fo, lfm_tracks.pth, tr.force);
		}
	}

	match(p_a, p_release, list, type) {
		const rel_m = [];
		const art_m = [];
		let a = $.removeDiacritics(this.tidy(p_a, true));
		let i = 0;
		let rel = $.removeDiacritics(this.tidy(p_release, true));
		for (i = 0; i < list.length; i++) {
			rel_m[i] = $.removeDiacritics(this.tidy(list[i].title || 'N/A', true));
			art_m[i] =  $.removeDiacritics(this.tidy(list[i].artist || 'N/A', true));
			if (rel == rel_m[i] && art_m[i] == a) return i;
		}
		if (!cfg.partialMatch) return -1;
		const fuzzy_match = (n, l) => {
			const levenshtein = (a, b) => {
				if (a.length === 0) return b.length;
				if (b.length === 0) return a.length;
				let i, j, prev, row, tmp, val;
				if (a.length > b.length) {
					tmp = a;
					a = b;
					b = tmp;
				}
				row = Array(a.length + 1);
				for (i = 0; i <= a.length; i++) row[i] = i;
				for (i = 1; i <= b.length; i++) {
					prev = i;
					for (j = 1; j <= a.length; j++) {
						if (b[i - 1] === a[j - 1]) val = row[j - 1];
						else val = Math.min(row[j - 1] + 1, Math.min(prev + 1, row[j] + 1));
						row[j - 1] = prev;
						prev = val;
					}
					row[a.length] = prev;
				}
				return row[a.length];
			}
			return 1 - levenshtein(n, l) / (n.length > l.length ? n.length : l.length) > 0.8; // 0.8 sets fuzzy match level
		}
		switch (true) {
			case type == 'rev': {
				for (i = 0; i < list.length; i++)
					if (rel_m[i].includes(rel) && art_m[i].includes(a)) return i;
				const stripAmp = n => n.replace(/&/g, '') || n;
				a = stripAmp(a);
				rel = stripAmp(rel);
				for (i = 0; i < list.length; i++)
					if (fuzzy_match(rel, stripAmp(rel_m[i])) && stripAmp(art_m[i]).includes(a.replace(/&/g, ''))) return i;
				break;
			}
			case type == 'title':
				for (i = 0; i < list.length; i++)
					if (rel_m[i].includes(rel) && art_m[i] == a) return i;
				for (i = 0; i < list.length; i++)
					if (fuzzy_match(rel, rel_m[i]) && art_m[i] == a) return i;
				break;
		}
		return -1;
	}
	parseAmSearch(div, artist, item) {
		let j = 0, list = [];
		let items = div.getElementsByTagName('li');
		for (let i = 0; i < items.length; i++) {
			if (items[i]['className'] == item) {
				list[j] = {}
				$.htmlParse(items[i].getElementsByTagName('div'), 'className', 'title', v => {
					const a = v.getElementsByTagName('a');
					list[j].title = a.length && a[0].innerText ? a[0].innerText : 'N/A';
					list[j].titleLink = a.length && a[0].href ? a[0].href : '';
				});
				$.htmlParse(items[i].getElementsByTagName('div'), 'className', artist, v => {
					const a = v.getElementsByTagName('a');
					list[j].artist = a.length && a[0].innerText ? a[0].innerText : v.innerText;
					list[j].artistLink = a.length && a[0].href ? a[0].href : '';
				});
				j++;
			}
		}
		return list;
	}

	processAmBio(responseText, artist, album, title, fo_bio, pth_bio, pth_rev) {
		doc.open();
		const div = doc.createElement('div');
		try {
			div.innerHTML = responseText;
			const dv = div.getElementsByTagName('div');
			let active = '';
			let biography = '';
			let biographyAuthor = '';
			let biographyGenre = [];
			let tg = '';
			$.htmlParse(dv, 'className', 'text', v => biography = server.format(v.innerHTML));
			$.htmlParse(dv, 'className', 'active-dates', v => active = v.innerText.replace(/Active/i, 'Active: ').trim());
			$.htmlParse(div.getElementsByTagName('a'), false, false, v => {
				if (v.href.includes('www.allmusic.com/genre') || v.href.includes('www.allmusic.com/style')) {
					tg = v.innerText.trim();
					if (tg) biographyGenre.push(tg);
				}
			});
			if (active.length) active = '\r\n\r\n' + active;
			if (biographyGenre.length) biographyGenre = '\r\n\r\n' + 'Genre: ' + biographyGenre.join('\u200b, ');
			$.htmlParse(div.getElementsByTagName('h3'), 'className', 'headline', v => biographyAuthor = server.format(v.innerHTML));
			if (biographyAuthor) biographyAuthor = '\r\n\r\n' + biographyAuthor;
			biography = biography + biographyGenre + active + biographyAuthor;
			biography = biography.trim();
			if (biography.length > 19) {
				$.buildPth(fo_bio);
				$.save(pth_bio, biography, true);
				this.res();
			} else {
				album ? this.updateNotFound('Bio ' + cfg.partialMatch + ' ' + pth_rev) : this.updateNotFound('Bio ' + cfg.partialMatch + ' ' + artist + ' - ' + title);
				if (!$.file(pth_bio)) $.trace('allmusic biography: ' + artist + ': not found', true);
			}
		} catch (e) {
			album ? this.updateNotFound('Bio ' + cfg.partialMatch + ' ' + pth_rev) : this.updateNotFound('Bio ' + cfg.partialMatch + ' ' + artist + ' - ' + title);
			if (!$.file(pth_bio)) $.trace('allmusic biography: ' + artist + ': not found', true);
		}
		doc.close();
	}

	res() {
		window.NotifyOthers('bio_getText', 'bio_getText');
		txt.grab();
	}

	setImgRecycler(n) {
		if (!$.isArray(this.imgToRecycle)) {
			this.imgToRecycle = [];
			n = true;
		}
		if (n) $.save(this.bioCache, JSON.stringify(this.imgToRecycle, null, 3), true);
	}

	setLangLfm(lang) {
		if (lang) this.lfm.server = lang.toLowerCase();
		this.lfm.server = this.lfm.server == 'en' ? 'www.last.fm' : 'www.last.fm/' + this.lfm.server;
		this.lfm.def_EN = this.lfm.server == 'www.last.fm';
		this.lfm.fallback = cfg.langLfmFallback && !this.lfm.def_EN;
	}

	tidy(n, cutLeadThe) {
		const nn = cutLeadThe ? n.replace(/^The /i, '') : n;
		return nn.replace(/&amp(;|)/g, '&').replace(/&quot(;|)/g, '"').replace(/&#39(;|)/g, "'").replace(/&gt(;|)/g, '>').replace(/&nbsp(;|)/g, '').replace(/\band\b|\//gi, '&').replace(/[.,!?:;'\u2019"\-_()[\]\u2010\s+]/g, '').replace(/\$/g, 's').toLowerCase() || n.trim();
	}

	updateNotFound(f) {
		if (!$.file(this.notFound)) return;
		const m = $.jsonParse(this.notFound, false, 'file');
		const n = Date.now();
		let k = m.length;
		for (k = 0; k < m.length; k++)
			if (m[k].name == f) return;
		m.push({
			'name': f,
			'time': n
		});
		$.save(this.notFound, JSON.stringify(m, null, 3), true);
	}
}

class DldAllmusicBio {
	constructor(state_callback) {
		this.artist = '';
		this.artistLink = '';
		this.fo_bio;
		this.func = null;
		this.pth_bio;
		this.ready_callback = state_callback;
		this.sw = 0;
		this.title = '';
		this.timer = null;
		this.xmlhttp = null;
	}

	onStateChange() {
		if (this.xmlhttp != null && this.func != null)
			if (this.xmlhttp.readyState == 4) {
				clearTimeout(this.timer);
				this.timer = null;
				if (this.xmlhttp.status == 200) this.func();
				else $.trace('allmusic album review / biography: ' + server.album + ' / ' + server.albumArtist + ': not found' + ' Status error: ' + this.xmlhttp.status, true);
			}
	}

	search(p_sw, URL, p_title, p_artist, p_fo_bio, p_pth_bio, force) {
		this.sw = p_sw;
		if (!this.sw) {
			this.fo_bio = p_fo_bio;
			this.pth_bio = p_pth_bio;
			this.title = p_title;
			this.artist = p_artist;
		}
		this.func = null;
		this.xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
		this.func = this.analyse;
		this.xmlhttp.open('GET', URL);
		this.xmlhttp.onreadystatechange = this.ready_callback;
		if (force) this.xmlhttp.setRequestHeader('If-Modified-Since', 'Thu, 01 Jan 1970 00:00:00 GMT');
		if (!this.timer) {
			const a = this.xmlhttp;
			this.timer = setTimeout(() => {
				a.abort();
				this.timer = null;
			}, 30000);
		}
		this.xmlhttp.send();
	}

	analyse() {
		doc.open();
		const div = doc.createElement('div');
		let i = 0;
		let list = [];
		switch (this.sw) {
			case 0:
				try {
					div.innerHTML = this.xmlhttp.responseText;
					list = server.parseAmSearch(div, 'performers', 'song');
					i = server.match(this.artist, this.title, list, 'title');
					if (i != -1) {
						this.artistLink = list[i].artistLink;
						if (this.artistLink) {
							this.sw = 1;
							doc.close();
							return this.search(this.sw, this.artistLink + '/biography');
						}
						server.updateNotFound('Bio ' + cfg.partialMatch + ' ' + this.artist + ' - ' + this.title);
						if (!$.file(this.pth_bio)) $.trace('allmusic biography: ' + this.artist + ': not found', true);
					}
					server.updateNotFound('Bio ' + cfg.partialMatch + ' ' + this.artist + ' - ' + this.title);
					if (!$.file(this.pth_bio)) $.trace('allmusic biography: ' + this.artist + ': not found', true);
				} catch (e) {
					server.updateNotFound('Bio ' + cfg.partialMatch + ' ' + this.artist + ' - ' + this.title);
					if (!$.file(this.pth_bio)) $.trace('allmusic biography: ' + this.artist + ': not found', true);
				}
				doc.close();
				break;
			case 1:
				server.processAmBio(this.xmlhttp.responseText, this.artist, '', this.title, this.fo_bio, this.pth_bio, '');
				break;
		}
	}
}

class DldAllmusicRev {
	constructor(state_callback) {
		this.albumArtist;
		this.album;
		this.art;
		this.artist = '';
		this.artistLink = '';
		this.dn_type = '';
		this.fo_bio;
		this.fo_rev;
		this.force;
		this.func = null;
		this.pth_bio;
		this.pth_rev;
		this.ready_callback = state_callback;
		this.sw = 0;
		this.va = false;
		this.timer = null;
		this.xmlhttp = null;
	}

	onStateChange() {
		if (this.xmlhttp != null && this.func != null)
			if (this.xmlhttp.readyState == 4) {
				clearTimeout(this.timer);
				this.timer = null;
				if (this.xmlhttp.status == 200) this.func();
				else $.trace('allmusic album review / biography: ' + this.album + ' / ' + this.albumArtist + ': not found' + ' Status error: ' + this.xmlhttp.status, true);
			}
	}

	search(p_sw, URL, p_album, p_alb_artist, p_artist, p_va, p_dn_type, p_fo_rev, p_pth_rev, p_fo_bio, p_pth_bio, p_art, p_force) {
		this.sw = p_sw;
		if (!this.sw) {
			this.dn_type = p_dn_type;
			this.fo_rev = p_fo_rev;
			this.pth_rev = p_pth_rev;
			this.fo_bio = p_fo_bio;
			this.pth_bio = p_pth_bio;
			this.album = p_album;
			this.albumArtist = p_alb_artist;
			this.artist = p_artist;
			this.va = p_va;
			this.art = p_art;
			this.force = p_force;
		}
		this.func = null;
		this.xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
		this.func = this.analyse;
		this.xmlhttp.open('GET', URL);
		this.xmlhttp.onreadystatechange = this.ready_callback;
		if (this.force) this.xmlhttp.setRequestHeader('If-Modified-Since', 'Thu, 01 Jan 1970 00:00:00 GMT');
		if (!this.timer) {
			const a = this.xmlhttp;
			this.timer = setTimeout(() => {
				a.abort();
				this.timer = null;
			}, 30000);
		}
		this.xmlhttp.send();
	}

	analyse() {
		doc.open();
		const div = doc.createElement('div');
		let i = 0;
		let list = [];
		switch (this.sw) {
			case 0:
				try {
					div.innerHTML = this.xmlhttp.responseText;
					list = server.parseAmSearch(div, 'artist', 'album');
					i = server.match(this.albumArtist, this.album, list, 'rev');
					if (i != -1) {
						if (!this.va) this.artistLink = list[i].artistLink;
						if (this.dn_type == 'both' || this.dn_type == 'review') {
							this.sw = 1;
							doc.close();
							return this.search(this.sw, list[i].titleLink);
						} else if (this.dn_type == 'bio' && !this.va) {
							this.sw = 2;
							doc.close();
							return this.search(this.sw, this.artistLink + '/biography');
						}
					}
					server.getBio(this.force, this.art, 1);
					server.updateNotFound('Bio ' + cfg.partialMatch + ' ' + this.pth_rev);
					server.updateNotFound('Rev ' + cfg.partialMatch + ' ' + this.pth_rev);
					$.trace('allmusic album review: ' + this.album + ' / ' + this.albumArtist + ': not found', true);
				} catch (e) {
					server.getBio(this.force, this.art, 1);
					server.updateNotFound('Bio ' + cfg.partialMatch + ' ' + this.pth_rev);
					server.updateNotFound('Rev ' + cfg.partialMatch + ' ' + this.pth_rev);
					$.trace('allmusic album review: ' + this.album + ' / ' + this.albumArtist + ': not found', true);
				}
				doc.close();
				break;
			case 1:
				try {
					div.innerHTML = this.xmlhttp.responseText;
					const a = div.getElementsByTagName('a');
					const dv = div.getElementsByTagName('div');
					let rating = 'x';
					let releaseDate = '';
					let review = '';
					let reviewAuthor = '';
					let reviewGenre = [];
					let reviewMood = [];
					let reviewTheme = [];
					let tg = '';
					$.htmlParse(dv, 'className', 'text', v => review = server.format(v.innerHTML));
					$.htmlParse(dv, 'className', 'release-date', v => releaseDate = v.innerText.replace(/Release Date/i, 'Release Date: ').trim());
					$.htmlParse(a, false, false, v => {
						if (v.href.includes('www.allmusic.com/genre') || v.href.includes('www.allmusic.com/style')) {
							tg = v.innerText.trim();
							if (tg) reviewGenre.push(tg);
						}
					});
					$.htmlParse(a, false, false, v => {
						if (v.href.includes('www.allmusic.com/mood')) {
							const tm = v.innerText.trim();
							if (tm) reviewMood.push(tm);
						}
						if (v.href.includes('www.allmusic.com/theme')) {
							const tth = v.innerText.trim();
							if (tth) reviewTheme.push(tth);
						}
					});
					if (releaseDate.length) releaseDate = '\r\n\r\n' + releaseDate;
					if (reviewGenre.length) reviewGenre = '\r\n\r\n' + 'Genre: ' + reviewGenre.join('\u200b, ');
					if (reviewMood.length) reviewMood = '\r\n\r\n' + 'Album Moods: ' + reviewMood.join('\u200b, ');
					if (reviewTheme.length) reviewTheme = '\r\n\r\n' + 'Album Themes: ' + reviewTheme.join('\u200b, ');
					$.htmlParse(div.getElementsByTagName('h3'), 'className', 'review-author headline', v => reviewAuthor = server.format(v.innerHTML));
					if (reviewAuthor) reviewAuthor = '\r\n\r\n' + reviewAuthor;
					review = review + reviewGenre + reviewMood + reviewTheme + releaseDate + reviewAuthor;
					review = review.trim();
					$.htmlParse(div.getElementsByTagName('li'), 'id', 'microdata-rating', v => rating = v.innerText.replace(/\D+/g, '') / 2);
					review = '>> Album rating: ' + rating + ' <<  ' + review;
					if (review.length > 22) {
						$.buildPth(this.fo_rev);
						$.save(this.pth_rev, review, true);
						server.res();
					} else {
						server.updateNotFound('Rev ' + cfg.partialMatch + ' ' + this.pth_rev);
						$.trace('allmusic album review: ' + this.album + ' / ' + this.albumArtist + ': not found', true);
					}
				} catch (e) {
					server.updateNotFound('Rev ' + cfg.partialMatch + ' ' + this.pth_rev);
					$.trace('allmusic album review: ' + this.album + ' / ' + this.albumArtist + ': not found', true);
				}
				doc.close();
				if (this.dn_type != 'both') return;
				if (this.artistLink) {
					this.sw = 2;
					return this.search(this.sw, this.artistLink + '/biography');
				}
				server.getBio(this.force, this.art, 1);
				break;
			case 2:
				doc.close();
				server.processAmBio(this.xmlhttp.responseText, this.artist, this.album, '', this.fo_bio, this.pth_bio, this.pth_rev);
				break;
		}
	}
}

class DldLastfmBio {
	constructor(state_callback) {
		this.artist;
		this.con = '';
		this.counts = ['', ''];
		this.fo_bio;
		this.func = null;
		this.itemDate = '';
		this.itemValue = ['', '', ''];
		this.pop = '';
		this.pth_bio;
		this.ready_callback = state_callback;
		this.retry = false;
		this.scrobbles = ['', ''];
		this.searchBio = 0;
		this.simArtists = [];
		this.tags = [];
		this.timer = null;
		this.topAlbums = [];
		this.topTracks = [];
		this.xmlhttp = null;
	}

	onStateChange() {
		if (this.xmlhttp != null && this.func != null)
			if (this.xmlhttp.readyState == 4) {
				clearTimeout(this.timer);
				this.timer = null;
				if (this.xmlhttp.status == 200) this.func();
				else {
					if (this.searchBio < 2 || this.searchBio == 2 && this.itemValue[0]) {
						this.searchBio++;
						this.search(this.artist, this.fo_bio, this.pth_bio);
					}
					if (this.searchBio == 3) this.func(true);
				}
			}
	}

	search(p_artist, p_fo_bio, p_pth_bio, force) {
		this.artist = p_artist;
		this.fo_bio = p_fo_bio;
		this.pth_bio = p_pth_bio;
		this.func = null;
		this.xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
		const URL = this.searchBio == 3 ? 'https://' + server.lfm.server + '/music/' + encodeURIComponent(this.artist) + '/' + encodeURIComponent(this.itemValue[0]) : this.searchBio == 2 ? 'https://www.last.fm/music/' + encodeURIComponent(this.artist) + '/+albums' : 'https://' + (!this.retry ? server.lfm.server : 'www.last.fm') + '/music/' + encodeURIComponent(this.artist) + (this.searchBio ? '/+wiki' : '');
		this.func = this.analyse;
		this.xmlhttp.open('GET', URL);
		this.xmlhttp.onreadystatechange = this.ready_callback;
		if (force) this.xmlhttp.setRequestHeader('If-Modified-Since', 'Thu, 01 Jan 1970 00:00:00 GMT');
		if (!this.timer) {
			const a = this.xmlhttp;
			this.timer = setTimeout(() => {
				a.abort();
				this.timer = null;
			}, 30000);
		}
		this.xmlhttp.send();
	}

	analyse(saveOnly) {
		const noWiki = n => /wiki|vikimiz|\u0412\u0438\u043A\u0438|\u7EF4\u57FA/i.test(n);
		if (!saveOnly) {
			doc.open();
			const div = doc.createElement('div');
			div.innerHTML = this.xmlhttp.responseText;
			const r1 = ['Popular this week', 'Beliebt diese Woche', 'Popular esta semana', 'Populaire cette semaine', 'Popolare questa settimana', '\u4eca\u9031\u306e\u4eba\u6c17\u97f3\u697d', 'Popularne w tym tygodniu', 'Mais ouvida na semana', '\u041f\u043e\u043f\u0443\u043b\u044f\u0440\u043d\u043e \u043d\u0430 \u044d\u0442\u043e\u0439 \u043d\u0435\u0434\u0435\u043b\u0435', 'Popul\u00e4rt denna vecka', 'Bu hafta pop\u00fcler olanlar', '\u672c\u5468\u70ed\u95e8'];
			const r2 = ['Popular Now', 'Beliebt Jetzt', 'Popular Ahora', 'Populaire Maintenant', 'Popolare Ora', '\u4eca\u4eba\u6c17', 'Popularne Teraz', 'Popular Agora', '\u041f\u043e\u043f\u0443\u043b\u044f\u0440\u043d\u044b\u0435 \u0441\u0435\u0439\u0447\u0430\u0441', 'Popul\u00e4r Nu', '\u015eimdi Pop\u00fcler', '\u70ed\u95e8 \u73b0\u5728'];
			const topAlb = ['Top Albums: ', 'Top-Alben: ', '\u00c1lbumes M\u00e1s Escuchados: ', 'Top Albums: ', 'Album Pi\u00f9 Ascoltati: ', '\u4eba\u6c17\u30a2\u30eb\u30d0\u30e0: ', 'Najpopularniejsze Albumy: ', '\u00c1lbuns Principais: ', '\u041f\u043e\u043f\u0443\u043b\u044f\u0440\u043d\u044b\u0435 \u0430\u043b\u044c\u0431\u043e\u043c\u044b: ', 'Toppalbum: ', 'En Sevilen Alb\u00fcmler: ', '\u6700\u4f73\u4e13\u8f91: '];
			const topTracks = ['Top Tracks: ', 'Top-Titel: ', 'Temas m\u00e1s escuchados: ', 'Top titres: ', 'Brani pi\u00f9 ascoltati: ', '\u4eba\u6c17\u30c8\u30e9\u30c3\u30af: ', 'Najpopularniejsze utwory: ', 'Faixas principais: ', '\u041b\u0443\u0447\u0448\u0438\u0435 \u043a\u043e\u043c\u043f\u043e\u0437\u0438\u0446\u0438\u0438: ', 'Toppl\u00e5tar: ', 'Pop\u00fcler Par\u00e7alar: ', '\u6700\u4f73\u5355\u66f2: ']
			let i = 0;
			switch (this.searchBio) {
				case 0: {
					const h3 = div.getElementsByTagName('h3');
					const h4 = div.getElementsByTagName('h4');
					const itemName = ['', ''];
					let j = 0;
					$.htmlParse(div.getElementsByTagName('li'), 'className', 'tag', v => this.tags.push($.titlecase(v.innerText.trim()).replace(/\bAor\b/g, 'AOR').replace(/\bDj\b/g, 'DJ').replace(/\bFc\b/g, 'FC').replace(/\bIdm\b/g, 'IDM').replace(/\bNwobhm\b/g, 'NWOBHM').replace(/\bR&b\b/g, 'R&B').replace(/\bRnb\b/g, 'RnB').replace(/\bUsa\b/g, 'USA').replace(/\bUs\b/g, 'US').replace(/\bUk\b/g, 'UK')));
					$.htmlParse(h4, 'className', 'artist-header-featured-items-item-header', v => {
						itemName[j] = v.innerText.trim();
						j++;
					});
					j = 0;
					$.htmlParse(h3, 'className', 'artist-header-featured-items-item-name', v => {
						this.itemValue[j] = v.innerText.trim();
						j++;
					});
					j = 0;
					$.htmlParse(div.getElementsByTagName('p'), 'className', 'artist-header-featured-items-item-aux-text artist-header-featured-items-item-date', v => {
						this.itemDate = v.innerText.trim();
						return true;
					});
					$.htmlParse(h3, 'className', 'catalogue-overview-similar-artists-full-width-item-name', v => {
						this.simArtists.push($.titlecase(v.innerText.trim()))
					});
					$.htmlParse(h4, 'className', 'header-metadata-tnew-title', v => {
						this.scrobbles[j] = $.titlecase(v.innerText.trim());
						j++;
					});
					j = 0;
					$.htmlParse(div.getElementsByTagName('abbr'), 'className', 'intabbr js-abbreviated-counter', v => {
						this.counts[j] = $.titlecase(v.innerText.trim()) + ' \u200b| ' + v.title.trim();
						j++;
					});
					i = 0;
					$.htmlParse(div.getElementsByTagName('td'), 'className', 'chartlist-name', v => {
						this.topTracks.push($.titlecase(v.innerText.trim()));
						i++;
					});
					if (this.topTracks.length) this.topTracks = '\r\n\r\n' + topTracks[cfg.lang.ix] + this.topTracks.join('\u200b, ');
					else this.topTracks = '';
					if (this.tags.length) this.tags = '\r\n\r\n' + 'Top Tags: ' + this.tags.join('\u200b, ');
					else this.tags = '';
					if (this.itemValue[1].length) {
						r1.forEach((v, i) => itemName[1] = itemName[1].replace(RegExp(v, 'i'), r2[i]));
						this.pop = '\r\n\r\n' + itemName[1] + ': ' + this.itemValue[1];
					}
					if (this.itemValue[0].length) {
						if (!this.itemValue[1].length) {
							r1.forEach((v, i) => itemName[0] = itemName[0].replace(RegExp(v, 'i'), r2[i]));
						}
						this.pop += (this.itemValue[1].length ? '; ' : '\r\n\r\n') + $.titlecase(itemName[0]) + ': ' + this.itemValue[0];
					}
					if (this.simArtists.length) this.simArtists = '\r\n\r\n' + server.similar[cfg.lang.ix] + this.simArtists.join('\u200b, ');
					else this.simArtists = '';
					doc.close();
					this.searchBio = 1;
					return this.search(this.artist, this.fo_bio, this.pth_bio);
				}
				case 1: {
					let factbox = '';
					this.con = '';
					$.htmlParse(div.getElementsByTagName('div'), 'className', 'wiki-content', v => {
						this.con = server.format(v.innerHTML);
						return true;
					});
					$.htmlParse(div.getElementsByTagName('li'), 'className', 'factbox-item', v => {
						factbox = '';
						factbox = server.format(v.innerHTML.replace(/<\/H4>/gi, ': ').replace(/\s*<\/LI>\s*/gi, ', ').replace(/\s*Show all members\u2026\s*/gi, '')).replace(/\s+/g, ' ').replace(/,$/, '');
						if (factbox) this.con += ('\r\n\r\n' + factbox);
					});
					doc.close();
					if (!this.retry) {
						this.searchBio = 2;
						return this.search(this.artist, this.fo_bio, this.pth_bio);
					}
					break;
				}
				case 2: {
					const popAlbums = [];
					i = 0;
					$.htmlParse(div.getElementsByTagName('h3'), 'className', 'resource-list--release-list-item-name', v => {
						i < 4 ? popAlbums.push($.titlecase(v.innerText.trim())) : this.topAlbums.push($.titlecase(v.innerText.trim()));
						i++;
						if (i == 10) return true;
					});
					doc.close();
					if (popAlbums.length) {
						const mapAlbums = this.topAlbums.map(v => $.cut(v));
						const match = mapAlbums.includes($.cut(popAlbums[0]));
						if (this.topAlbums.length > 5 && !match) this.topAlbums.splice(5, 0, popAlbums[0]);
						else this.topAlbums = this.topAlbums.concat(popAlbums);
					}
					this.topAlbums = [...new Set(this.topAlbums)];
					this.topAlbums.length = Math.min(6, this.topAlbums.length);
					if (this.topAlbums.length) this.topAlbums = '\r\n\r\n' + topAlb[cfg.lang.ix] + this.topAlbums.join('\u200b, ');
					else this.topAlbums = '';
					if (this.itemValue[0]) {
						this.searchBio = 3;
						return this.search(this.artist, this.fo_bio, this.pth_bio);
					}
					break;
				}
				case 3:
					$.htmlParse(div.getElementsByTagName('dd'), 'className', 'catalogue-metadata-description', v => {
						this.itemValue[2] = v.innerText.trim().split(',')[0];
						return true
					});
					doc.close();
					if (this.itemValue[0].length) {
						const item = this.itemDate.length && this.itemValue[2].length && this.itemDate.length != this.itemValue[2].length ? ' (' + this.itemDate + ' - ' + this.itemValue[2] + ')' : this.itemValue[2].length ? ' (' + this.itemValue[2] + ')' : this.itemDate.length ? ' (' + this.itemDate + ')' : '';
						if (item) this.pop += item;
					}
					break;
			}
		}
		if ((!this.con.length || this.con.length < 45 && noWiki(this.con)) && server.lfm.fallback && !this.retry) {
			this.retry = true;
			this.searchBio = 1;
			return this.search(this.artist, this.fo_bio, this.pth_bio);
		}
		if (this.con.length < 45 && noWiki(this.con)) this.con = '';
		this.con += this.tags;
		this.con += this.topAlbums;
		this.con += this.topTracks;
		this.con += this.pop;
		this.con += this.simArtists;
		if (this.scrobbles[1].length && this.counts[1].length || this.scrobbles[0].length && this.counts[0].length) this.con += ('\r\n\r\nLast.fm: ' + (this.counts[1].length ? this.scrobbles[1] + ' ' + this.counts[1] + '; ' : '') + (this.counts[0].length ? this.scrobbles[0] + ' ' + this.counts[0] : ''));
		this.con = this.con.trim();
		if (!this.con.length) {
			$.trace('last.fm biography: ' + this.artist + ': not found', true);
			return;
		}
		$.buildPth(this.fo_bio);
		$.save(this.pth_bio, this.con, true);
		server.res();
		panel.getList();
		window.NotifyOthers('bio_getLookUpList', 'bio_getLookUpList');
	}
}

class DldArtImages {
	img_exp(p_dl_ar, imgFolder, ex) {
		const f = imgFolder + 'update.txt';
		const imgExisting = [];
		let allFiles = [];
		if (!$.file(f)) return [cfg.photoNum, 0, allFiles];
		const getNew = Date.now() - $.lastModified(f) > ex;
		if (!getNew) return [0, cfg.photoAutoAdd, allFiles];
		allFiles = utils.Glob(imgFolder + '*');
		let imNo = 0;
		allFiles.forEach(v => {
			if (name.isLfmImg(fso.GetFileName(v), p_dl_ar)) {
				imNo++;
				if (cfg.photoLimit) imgExisting.push({
					p: v,
					m: $.lastModified(v)
				});
			}
		});

		if (cfg.photoLimit) imgExisting.sort((a, b) => a.m - b.m);
		const newImgNo = cfg.photoNum - imNo
		if (newImgNo > 0) return [newImgNo, 0, allFiles];
		else if (!cfg.photoAutoAdd) {
			if (cfg.photoLimit) {
				const remove = imgExisting.length - cfg.photoLimit;
				if (remove > 0) {
					for (let j = 0; j < remove; j++) server.imgToRecycle.push({
						a: p_dl_ar,
						p: imgExisting[j].p
					});
					server.setImgRecycler(true);
				}
			}
			return [0, cfg.photoAutoAdd, allFiles];
		} else return [5, cfg.photoAutoAdd, allFiles, imgExisting];
	}

	run(dl_ar, force, art, p_stndBio, p_supCache) {
		if (!$.file(fb.ProfilePath + 'yttm\\foo_lastfm_img.vbs')) return;
		let img_folder = p_stndBio ? panel.cleanPth(cfg.pth.foImgArt, art.focus, 'server') : panel.cleanPth(cfg.remap.foImgArt, art.focus, 'remap', dl_ar, '', 1);
		if (p_supCache && !$.folder(img_folder)) img_folder = panel.cleanPth(cfg.sup.foImgArt, art.focus, 'remap', dl_ar, '', 1);
		const getNo = this.img_exp(dl_ar, img_folder, !force ? server.exp : 0);
		if (!getNo[0]) return;
		const lfm_art = new LfmArtImg(() => lfm_art.onStateChange());
		lfm_art.search(dl_ar, img_folder, getNo[0], getNo[1], getNo[2], getNo[3], force);
	}
}

class LfmArtImg {
	constructor(state_callback) {
		this.allFiles;
		this.autoAdd;
		this.dl_ar;
		this.func = null;
		this.getNo;
		this.imgExisting;
		this.img_folder;
		this.ready_callback = state_callback;
		this.retry = false;
		this.timer = null;
		this.xmlhttp = null;
	}

	onStateChange() {
		if (this.xmlhttp != null && this.func != null)
			if (this.xmlhttp.readyState == 4) {
				clearTimeout(this.timer);
				this.timer = null;
				if (this.xmlhttp.status == 200) this.func();
				else $.trace('last.fm artist photos: ' + this.dl_ar + ': none found' + ' Status error: ' + this.xmlhttp.status, true);
			}
	}

	search(p_dl_ar, p_img_folder, p_getNo, p_autoAdd, p_allFiles, p_imgExisting, force) {
		this.dl_ar = p_dl_ar;
		this.img_folder = p_img_folder;
		this.getNo = p_getNo;
		this.autoAdd = p_autoAdd;
		this.allFiles = p_allFiles;
		this.imgExisting = p_imgExisting;
		this.func = null;
		this.xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
		const URL = 'https://' + (!this.retry ? server.lfm.server : 'www.last.fm') + '/music/' + encodeURIComponent(this.dl_ar) + '/+images';
		this.func = this.analyse;
		this.xmlhttp.open('GET', URL);
		this.xmlhttp.onreadystatechange = this.ready_callback;
		if (force) this.xmlhttp.setRequestHeader('If-Modified-Since', 'Thu, 01 Jan 1970 00:00:00 GMT');
		if (!this.timer) {
			const a = this.xmlhttp;
			this.timer = setTimeout(() => {
				a.abort();
				this.timer = null;
			}, 30000);
		}
		this.xmlhttp.send();
	}

	analyse() {
		const a = $.clean(this.dl_ar);
		doc.open();
		const div = doc.createElement('div');
		div.innerHTML = this.xmlhttp.responseText;
		const list = div.getElementsByTagName('img');
		let links = [];
		if (!list) {
			if (server.lfm.fallback && !this.retry) {
				this.retry = true;
				doc.close();
				return this.search(this.dl_ar, this.img_folder);
			}
			doc.close();
			return $.trace('last.fm artist photos: ' + this.dl_ar + ': none found', true);
		}
		$.htmlParse(list, false, false, v => {
			const attr = v.src || '';
			if (attr.includes('avatar170s/')) links.push(attr.replace('avatar170s/', ''));
		});
		doc.close();
		const blacklist = img.blacklist(a.toLowerCase());
		links = links.filter(v => !blacklist.includes(v.substring(v.lastIndexOf('/') + 1) + '.jpg'));
		if (links.length) {
			$.buildPth(this.img_folder);
			if ($.folder(this.img_folder)) {
				if (this.autoAdd && cfg.photoLimit) {
					let k = 0;
					let noNewLinks = 0;
					for (k = 0; k < Math.min(links.length, 5); k++) {
						const iPth = this.img_folder + a + '_' + links[k].substring(links[k].lastIndexOf('/') + 1) + '.jpg';
						if (this.imgExisting.every(v => v.p !== iPth)) noNewLinks++;
						if (noNewLinks == 5) break;
					}
					let remove = this.imgExisting.length + noNewLinks - cfg.photoLimit;
					remove = Math.min(remove, this.imgExisting.length);
					if (remove > 0) {
						for (k = 0; k < remove; k++) server.imgToRecycle.push({
							a: a,
							p: this.imgExisting[k].p
						});
						server.setImgRecycler(true);
					}
				}
				$.save(this.img_folder + 'update.txt', '', true);
				timer.decelerating();
				if (this.autoAdd) {
					$.take(links, this.getNo).forEach(v => $.run('cscript //nologo "' + fb.ProfilePath + 'yttm\\foo_lastfm_img.vbs" "' + v + '" "' + this.img_folder + a + '_' + v.substring(v.lastIndexOf('/') + 1) + '.jpg' + '"', 0));
				} else {
					let c = 0;
					$.take(links, cfg.photoNum).some(v => {
						const imPth = this.img_folder + a + '_' + v.substring(v.lastIndexOf('/') + 1) + '.jpg';
						if (!this.allFiles.includes(imPth)) {
							$.run('cscript //nologo "' + fb.ProfilePath + 'yttm\\foo_lastfm_img.vbs" "' + v + '" "' + imPth + '"', 0);
							c++;
							return c == this.getNo;
						}
					});
				}
			}
		}
	}
}

class LfmAlbum {
	constructor(state_callback) {
		this.albumArtist;
		this.albm;
		this.album;
		this.fo;
		this.func = null;
		this.getStats = true;
		this.pth;
		this.ready_callback = state_callback;
		this.retry = false;
		this.rev;
		this.rev_img;
		this.stats = '';
		this.tags = [];
		this.timer = null;
		this.xmlhttp = null;
	}

	onStateChange() {
		if (this.xmlhttp != null && this.func != null)
			if (this.xmlhttp.readyState == 4) {
				clearTimeout(this.timer);
				this.timer = null;
				if (this.xmlhttp.status == 200) this.func();
				else {
					if (this.getStats && this.rev) {
						this.getStats = false;
						return this.search(this.albumArtist, this.album, this.rev, this.fo, this.pth);
					}
					$.trace('last.fm album ' + (this.rev ? 'review: ' : 'cover: ') + this.album + ' / ' + this.albumArtist + ': not found' + ' Status error: ' + this.xmlhttp.status, true);
				}
			}
	}

	search(p_alb_artist, p_album, p_rev, p_fo, p_pth, p_albm, force, p_rev_img) {
		let URL = '';
		this.albumArtist = p_alb_artist;
		this.album = p_album;
		this.rev = p_rev;
		this.fo = p_fo;
		this.pth = p_pth;
		this.albm = p_albm;
		this.rev_img = p_rev_img;
		if (!this.getStats && this.rev || !this.rev) {
			URL = server.url.lfm;
			if (this.rev && !server.lfm.def_EN && !this.retry) URL += '&lang=' + cfg.langLfm.toLowerCase();
			URL += '&method=album.getInfo&artist=' + encodeURIComponent(this.albumArtist) + '&album=' + encodeURIComponent(this.rev || this.retry ? this.album : this.albm) + '&autocorrect=' + server.auto_corr;
		} else URL = 'https://' + server.lfm.server + '/music/' + encodeURIComponent(this.albumArtist) + '/' + encodeURIComponent(this.album.replace(/\+/g, '%2B'));
		this.func = null;
		this.xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
		this.func = this.analyse;
		this.xmlhttp.open('GET', URL);
		this.xmlhttp.onreadystatechange = this.ready_callback;
		if (!this.getStats && this.rev || !this.rev) this.xmlhttp.setRequestHeader('User-Agent', 'foobar2000_script');
		if (force) this.xmlhttp.setRequestHeader('If-Modified-Since', 'Thu, 01 Jan 1970 00:00:00 GMT');
		if (!this.timer) {
			const a = this.xmlhttp;
			this.timer = setTimeout(() => {
				a.abort();
				this.timer = null;
			}, 30000);
		}
		this.xmlhttp.send();
	}

	analyse() {
		if (!this.getStats && this.rev) {
			let wiki = $.jsonParse(this.xmlhttp.responseText, '', 'get', 'album.wiki.content');
			if (!wiki) {
				if (server.lfm.fallback && !this.retry) {
					this.retry = true;
					return this.search(this.albumArtist, this.album, this.rev, this.fo, this.pth);
				}
				if (!this.stats.length) return $.trace('last.fm album review: ' + this.album + ' / ' + this.albumArtist + ': not found', true);
			} else {
				wiki = wiki.replace(/<[^>]+>/ig, '');
				const f = wiki.indexOf(' Read more on Last.fm');
				if (f != -1) wiki = wiki.slice(0, f);
				wiki = wiki.replace(/\n/g, '\r\n').replace(/(\r\n)(\r\n)+/g, '\r\n\r\n').trim();
			}
			wiki = wiki ? wiki + this.tags + this.stats : this.tags + this.stats;
			wiki = wiki.trim();
			$.buildPth(this.fo);
			$.save(this.pth, wiki, true);
			server.res();
		} else if (this.rev) {
			doc.open();
			const counts = ['', '', ''];
			const div = doc.createElement('div');
			const scrobbles = ['', '', ''];
			div.innerHTML = this.xmlhttp.responseText;
			let j = 0;
			let rd = '';
			let rd_n = '';
			let tr = '';
			$.htmlParse(div.getElementsByTagName('li'), 'className', 'tag', v => this.tags.push($.titlecase(v.innerText.trim()).replace(/\bAor\b/g, 'AOR').replace(/\bDj\b/g, 'DJ').replace(/\bFc\b/g, 'FC').replace(/\bIdm\b/g, 'IDM').replace(/\bNwobhm\b/g, 'NWOBHM').replace(/\bR&b\b/g, 'R&B').replace(/\bRnb\b/g, 'RnB').replace(/\bUsa\b/g, 'USA').replace(/\bUs\b/g, 'US').replace(/\bUk\b/g, 'UK')));
			$.htmlParse(div.getElementsByTagName('dt'), 'className', 'catalogue-metadata-heading', v => {
				if (j) {
					rd_n = $.titlecase(v.innerText.trim());
					return true;
				}
				j++;
			});
			j = 0;
			$.htmlParse(div.getElementsByTagName('dd'), 'className', 'catalogue-metadata-description', v => {
				if (!j) tr = v.innerText.trim().replace(/\b1 tracks/, '1 track').split(',')[0];
				else {
					rd = v.innerText.trim();
					return true;
				}
				j++;
			});
			j = 0;
			$.htmlParse(div.getElementsByTagName('h4'), 'className', 'header-metadata-tnew-title', v => {
				scrobbles[j] = $.titlecase(v.innerText.trim());
				j++
			});
			j = 0;
			$.htmlParse(div.getElementsByTagName('abbr'), 'className', 'intabbr js-abbreviated-counter', v => {
				counts[j] = j != 2 ? $.titlecase(v.innerText.trim()) + ' \u200b| ' + v.title.trim() : $.titlecase(v.innerText.trim());
				j++
			});
			doc.close();
			if (this.tags.length) {
				this.tags = [...new Set(this.tags)];
				this.tags.length = Math.min(5, this.tags.length);
				this.tags = '\r\n\r\n' + 'Top Tags: ' + this.tags.join('\u200b, ');
			} else this.tags = '';
			if (rd_n && rd && /\d\d\d\d/.test(rd)) this.stats += ('\r\n\r\n' + rd_n + ': ' + rd + (tr ? ' | ' + tr : ''));
			if (scrobbles[1].length && counts[1].length || scrobbles[0].length && counts[0].length) this.stats += ('\r\n\r\nLast.fm: ' + (counts[1].length ? scrobbles[1] + ' ' + counts[1] + '; ' : '') + (counts[1].length ? scrobbles[0] + ' ' + counts[0] : ''));
			if (scrobbles[2] && counts[2] && scrobbles[2] != scrobbles[0] && scrobbles[1] != scrobbles[0]) this.stats += ('\r\n\r\n' + 'Rating: ' + scrobbles[2] + ': ' + counts[2]);

			this.getStats = false;
			return this.search(this.albumArtist, this.album, this.rev, this.fo, this.pth);
		} else {
			if (!$.file(fb.ProfilePath + 'yttm\\foo_lastfm_img.vbs')) return;
			const data = $.jsonParse(this.xmlhttp.responseText, [], 'get', 'album.image');
			if (data.length < 5) {
				server.updateNotFound(this.albumArtist + ' - ' + (this.retry ? this.album : this.albm) + ' ' + server.auto_corr + ' ' + this.pth);
				if (!this.retry && cfg.albStrip && this.album != this.albm) {
					this.retry = true;
					return this.search(this.albumArtist, this.album, this.rev, this.fo, this.pth, this.albm);
				}
				return $.trace('last.fm album cover: ' + this.album + ' / ' + this.albumArtist + ': not found', true);
			}
			let link = data[cfg.imgRevHQ || !this.rev_img ? 4 : 3]['#text'];
			if (link && (cfg.imgRevHQ || !this.rev_img)) {
				const linkSplit = link.split('/');
				linkSplit.splice(linkSplit.length - 2, 1);
				link = linkSplit.join('/');
			}
			if (!link) {
				server.updateNotFound(this.albumArtist + ' - ' + (this.retry ? this.album : this.albm) + ' ' + server.auto_corr + ' ' + this.pth);
				if (!this.retry && cfg.albStrip && this.album != this.albm) {
					this.retry = true;
					return this.search(this.albumArtist, this.album, this.rev, this.fo, this.pth, this.albm);
				}
				return $.trace('last.fm album cover: ' + this.album + ' / ' + this.albumArtist + ': not found', true);
			}
			timer.decelerating(true);
			$.buildPth(this.fo);
			$.run('cscript //nologo "' + fb.ProfilePath + 'yttm\\foo_lastfm_img.vbs" "' + link + '" "' + this.pth + link.slice(-4) + '"', 0);
		}
	}
}

class LfmTrack {
	constructor(state_callback) {
		this.album = '';
		this.artist;
		this.fo;
		this.force = false;
		this.func = null;
		this.getIDs = true;
		this.getStats = true;
		this.lfm_done = false;
		this.pth;
		this.ready_callback = state_callback;
		this.releases = '';
		this.retry = false;
		this.src = 0;
		this.stats = '';
		this.text = {
			ids: {}
		};
		this.timer = null;
		this.track;
		this.wiki = '';
		this.xmlhttp = null;
	}

	onStateChange() {
		if (this.xmlhttp != null && this.func != null)
			if (this.xmlhttp.readyState == 4) {
				clearTimeout(this.timer);
				this.timer = null;
				if (this.xmlhttp.status == 200) this.func();
				else {
					if (this.getStats) {
						this.getStats = false;
						return this.search(this.artist, this.track, this.fo, this.pth, this.force);
					}
					if (this.lfm_done) this.revSave(this.releases || this.stats.length ? false : true);
				}
			}
	}

	search(p_artist, p_track, p_fo, p_pth, p_force) {
		let URL = '';
		this.artist = p_artist;
		this.track = p_track;
		this.fo = p_fo;
		this.pth = p_pth;
		this.force = p_force;
		if (!this.lfm_done) {
			if (!this.getStats) {
				URL = server.url.lfm;
				if (!server.lfm.def_EN && !this.retry) URL += '&lang=' + cfg.langLfm.toLowerCase();
				URL += '&method=track.getInfo&artist=' + encodeURIComponent(this.artist) + '&track=' + encodeURIComponent(this.track) + '&autocorrect=' + server.auto_corr;
			} else {
				this.text = $.jsonParse(this.pth, false, 'file');
				if (!this.text) this.text = {
					ids: {}
				}
				URL = 'https://' + server.lfm.server + '/music/' + encodeURIComponent(this.artist) + '/_/' + encodeURIComponent(this.track);
			}
		} else {
			if (this.text[this.track] && this.text[this.track].wiki && !this.force) {
				this.wiki = this.text[this.track].wiki;
				if (this.text[this.track].s) this.src = this.text[this.track].s;
				return this.revSave();
			}
			const formatName = n => n.replace(/[\s/]/g, '-').replace(/[.,!?:;'\u2019"_\u2010+()[\]&]/g, '').replace(/\$/g, 's').replace(/-+/g, '-').toLowerCase();
			if (this.getIDs && (!this.text.ids['ids_update'] || this.text.ids['ids_update'] < Date.now() - server.exp * 3 || this.force)) URL = server.url.lfm_sf + 'songs/' + formatName(this.artist);
			else if (this.text.ids[server.tidy(this.track)]) {
				this.getIDs = false;
				URL = server.url.lfm_sf + this.text.ids[server.tidy(this.track)];
			} else return this.revSave();
		}
		this.func = null;
		this.xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
		this.func = this.analyse;
		this.xmlhttp.open('GET', URL);
		this.xmlhttp.onreadystatechange = this.ready_callback;
		if (!this.getStats && !this.lfm_done) this.xmlhttp.setRequestHeader('User-Agent', 'foobar2000_script');
		if (this.force) this.xmlhttp.setRequestHeader('If-Modified-Since', 'Thu, 01 Jan 1970 00:00:00 GMT');
		if (!this.timer) {
			const a = this.xmlhttp;
			this.timer = setTimeout(() => {
				a.abort();
				this.timer = null;
			}, 30000);
		}
		this.xmlhttp.send();
	}

	analyse() {
		if (!this.lfm_done) {
			if (!this.getStats) {
				this.wiki = $.jsonParse(this.xmlhttp.responseText, '', 'get', 'track.wiki.content');
				if (this.wiki) {
					this.wiki = this.wiki.replace(/<[^>]+>/ig, '');
					const f = this.wiki.indexOf(' Read more on Last.fm');
					if (f != -1) this.wiki = this.wiki.slice(0, f);
					this.wiki = this.wiki.replace(/\n/g, '\r\n').replace(/(\r\n)(\r\n)+/g, '\r\n\r\n').replace(/\[edit\]\s*$/i, '').trim();
				}
				if (!this.wiki) {
					if (server.lfm.fallback && !this.retry) {
						this.retry = true;
						return this.search(this.artist, this.track, this.fo, this.pth, this.force);
					}
					if (!this.lfm_done && (cfg.langLfm == 'EN' || server.lfm.fallback)) {
						this.lfm_done = true;
						return this.search(this.artist, this.track, this.fo, this.pth, this.force);
					}
					if (!this.releases && !this.stats.length) return this.revSave(true);
				} else this.src = 1;
				this.revSave();
			} else {
				doc.open();
				const counts = ['', ''];
				const div = doc.createElement('div');
				const scrobbles = ['', ''];
				div.innerHTML = this.xmlhttp.responseText;
				let from = '';
				let j = 0;
				let feat = '';
				$.htmlParse(div.getElementsByTagName('h3'), 'className', 'text-18', v => {
					if (v.parentNode && v.parentNode.className && v.parentNode.className == 'visible-xs') {
						from = v.innerText.trim();
						return true;
					}
				});
				$.htmlParse(div.getElementsByTagName('h4'), 'className', 'source-album-name', v => {
					this.album = v.innerText.trim();
					return true;
				});
				if (!cfg.lang.ix) $.htmlParse(div.getElementsByTagName('p'), 'className', 'more-link-fullwidth', v => {
					feat = v.innerText.trim();
					return true;
				});
				$.htmlParse(div.getElementsByTagName('h4'), 'className', 'header-metadata-tnew-title', v => {
					scrobbles[j] = $.titlecase(v.innerText.trim());
					j++
				});
				j = 0;
				$.htmlParse(div.getElementsByTagName('abbr'), 'className', 'intabbr js-abbreviated-counter', v => {
					counts[j] = $.titlecase(v.innerText.trim());
					j++
				});
				doc.close();
				if (from && this.album) this.releases += from + ': ' + this.album + '.';
				if (feat) {
					const featNo = feat.replace(/\D/g, '');
					const rel = featNo != '1' ? 'releases' : 'release';
					feat = ` Also featured on ${featNo} other ${rel}.`;
					this.releases += feat;
				}
				if (scrobbles[1].length && counts[1].length || scrobbles[0].length && counts[0].length) this.stats += ('Last.fm: ' + (counts[1].length ? scrobbles[1] + ' ' + counts[1] + '; ' : '') + (counts[0].length ? scrobbles[0] + ' ' + counts[0] : ''));
				this.getStats = false;
				return this.search(this.artist, this.track, this.fo, this.pth, this.force);
			}
		} else {
			doc.open();
			const div = doc.createElement('div');
			div.innerHTML = this.xmlhttp.responseText;
			if (!this.getIDs) {
				let j = 0;
				div.innerHTML = this.xmlhttp.responseText;
				$.htmlParse(div.getElementsByTagName('div'), 'className', 'inner', v => {
					let tx = v.innerText;
					if (tx && tx.includes(' >>')) tx = tx.split(' >>')[0];
					if (tx) {
						if (!j) this.wiki = tx;
						else this.wiki += '\r\n\r\n' + tx;
						j++;
					}
				});
				this.wiki = this.wiki.trim();
				doc.close();
				if (!this.wiki) {
					if (!this.releases && !this.stats.length) return this.revSave(true);
				} else this.src = 2;
				this.revSave();
			} else {
				this.text.ids = {}
				$.htmlParse(div.getElementsByTagName('a'), false, false, v => {
					if (v.parentNode && v.parentNode.nodeName == 'LI' && v.href.includes('/facts/')) this.text.ids[server.tidy(v.innerText)] = v.href.replace('about:/', '');
				});
				this.text.ids['ids_update'] = Date.now();
				doc.close();
				this.getIDs = false;
				this.search(this.artist, this.track, this.fo, this.pth, this.force);
			}
		}
	}

	revSave(ret) {
		if (this.text[this.track] && this.text[this.track].lang == cfg.langLfm) {
			if (!this.releases) this.releases = this.text[this.track].releases;
			if (!this.wiki && !this.force) {
				this.wiki = this.text[this.track].wiki;
				if (this.wiki) this.src = this.text[this.track].s;
			}
			if (!this.stats) this.stats = this.text[this.track].stats;
		}
		this.text[this.track] = {
			releases: this.releases,
			wiki: this.wiki || '',
			stats: this.stats,
			s: this.src,
			lang: cfg.langLfm,
			update: Date.now()
		};
		$.buildPth(this.fo);
		$.save(this.pth, JSON.stringify(this.text, null, 3), true);
		if (ret) return $.trace('last.fm track review: ' + $.titlecase(this.track) + ' / ' + this.artist + ': not found', true);
		server.res();
	}
}

class LfmSimilarArtists {
	constructor(state_callback, on_search_done_callback) {
		this.artist;
		this.done;
		this.fn_sim;
		this.func = null;
		this.handles;
		this.lmt;
		this.on_search_done_callback = on_search_done_callback;
		this.pth_sim;
		this.ready_callback = state_callback;
		this.retry = false;
		this.xmlhttp = null;
	}

	onStateChange() {
		if (this.xmlhttp != null && this.func != null)
			if (this.xmlhttp.readyState == 4) {
				if (this.xmlhttp.status == 200) this.func();
				else if (this.on_search_done_callback) this.on_search_done_callback(this.artist, [], this.done, this.handles);
			}
	}

	search(p_artist, p_done, p_handles, p_lmt, p_pth_sim, p_fn_sim) {
		this.artist = p_artist;
		this.done = p_done;
		this.handles = p_handles;
		this.lmt = p_lmt;
		this.pth_sim = p_pth_sim;
		this.fn_sim = p_fn_sim;
		if (this.retry) this.lmt = this.lmt == 249 ? 235 + Math.floor(Math.random() * 14) : this.lmt + 10;
		this.func = null;
		this.xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
		const URL = 'http://ws.audioscrobbler.com/2.0/?format=json' + panel.lfm + '&method=artist.getSimilar&artist=' + encodeURIComponent(this.artist) + '&limit=' + this.lmt + '&autocorrect=1';
		this.func = this.analyse;
		this.xmlhttp.open('GET', URL);
		this.xmlhttp.onreadystatechange = this.ready_callback;
		this.xmlhttp.setRequestHeader('User-Agent', 'foobar2000_script');
		if (this.retry) this.xmlhttp.setRequestHeader('If-Modified-Since', 'Thu, 01 Jan 1970 00:00:00 GMT');
		this.xmlhttp.send();
	}

	analyse() {
		const data = $.jsonParse(this.xmlhttp.responseText, [], 'get', 'similarartists.artist');
		let list = [];
		if ((data.length < this.lmt) && !this.retry) {
			this.retry = true;
			return this.search(this.artist, this.done, this.handles, this.lmt, this.pth_sim, this.fn_sim);
		}
		switch (true) {
			case this.lmt < 17:
				$.take(data, 6);
				list = data.map(v => v.name);
				if (data.length || this.retry) this.on_search_done_callback(this.artist, list, this.done, this.handles);
				break;
			case this.lmt > 99:
				if (data.length) {
					list = data.map(v => ({
						name: v.name,
						score: Math.round(v.match * 100)
					}));
					list.unshift({
						name: this.artist,
						score: 100
					});
					$.buildPth(this.pth_sim);
					$.save(this.fn_sim, JSON.stringify(list), true);
					if (cfg.lfmSim) {
						panel.getList();
						window.NotifyOthers('bio_getLookUpList', 'bio_getLookUpList');
					}
				}
				break;
		}
	}
}

class LfmTopAlbums {
	constructor(state_callback, on_search_done_callback) {
		this.artist;
		this.func = null;
		this.on_search_done_callback = on_search_done_callback;
		this.ready_callback = state_callback;
		this.xmlhttp = null;
	}

	onStateChange() {
		if (this.xmlhttp != null && this.func != null)
			if (this.xmlhttp.readyState == 4) {
				if (this.xmlhttp.status == 200) this.func();
				else this.on_search_done_callback(this.artist, []);
			}
	}

	search(p_artist) {
		this.artist = p_artist;
		this.func = null;
		this.xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
		const URL = 'https://www.last.fm/music/' + encodeURIComponent(this.artist) + '/+albums';
		this.func = this.analyse;
		this.xmlhttp.open('GET', URL);
		this.xmlhttp.onreadystatechange = this.ready_callback;
		this.xmlhttp.send();
	}

	analyse() {
		doc.open();
		const div = doc.createElement('div');
		const popAlbums = [];
		let i = 0;
		let topAlbums = [];
		div.innerHTML = this.xmlhttp.responseText;
		$.htmlParse(div.getElementsByTagName('h3'), 'className', 'resource-list--release-list-item-name', v => {
			i < 4 ? popAlbums.push($.titlecase(v.innerText.trim())) : topAlbums.push($.titlecase(v.innerText.trim()));
			i++;
			if (i == 10) return true;
		});
		doc.close();
		if (popAlbums.length) {
			const mapAlbums = topAlbums.map(v => $.cut(v));
			const match = mapAlbums.includes($.cut(popAlbums[0]));
			if (topAlbums.length > 5 && !match) topAlbums.splice(5, 0, popAlbums[0]);
			else topAlbums = topAlbums.concat(popAlbums);
		}
		topAlbums = [...new Set(topAlbums)];
		topAlbums.length = Math.min(6, topAlbums.length);
		this.on_search_done_callback(this.artist, topAlbums);
	}
}