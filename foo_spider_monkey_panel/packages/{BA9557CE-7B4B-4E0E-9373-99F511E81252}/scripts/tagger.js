class Tagger {
	constructor() {
		this.arr1 = [];
		this.arr2 = [];
		this.simList = [];
		const replacer = ppt.replace.replace(/>/g, '|').split('|');

		replacer.forEach((v, i) => {
			if (i % 2 == 0) this.arr1.push(v.trim());
			else this.arr2.push(v.trim());
		});
	}

	// Methods

	check(handles) {
		if (!handles) return;
		let artist = '';
		let cur_artist = '####';
		let rec = 0;
		let writeSent = false;
		const tf_artist = FbTitleFormat(`$upper(${cfg.tf.artist})`);
		const artists = tf_artist.EvalWithMetadbs(handles);
		const similarArtists = [];
		const similarArr = [];

		for (let i = 0; i < handles.Count; i++) {
			artist = artists[i];
			if (artist != cur_artist) {
				cur_artist = artist;
				similarArtists[i] = '';
				const lfmBio = panel.cleanPth(cfg.pth.foLfmBio, handles[i], 'tag') + $.clean(artist) + cfg.suffix.foLfmBio + '.txt';
				if ($.file(lfmBio)) {
					const lBio = $.open(lfmBio);
					similarArtists[i] = this.getTag(lBio, panel.similarArtistsKey).tag
					if (similarArtists[i].length > 6) similarArr.push(artist);
				}
			}
		}

		if (similarArr.length) {
			let i = 0;
			timer.clear(timer.sim1);
			timer.sim1.id = setInterval(() => {
				if (i < similarArr.length) {
					const lfm_similar = new LfmSimilarArtists(() => lfm_similar.onStateChange(), lfm_similar_search_done.bind(this));
					lfm_similar.search(similarArr[i], similarArr.length, handles, 6);
					i++;
				} else timer.clear(timer.sim1);
			}, similarArr.length < 100 ? 20 : 300);
		} else this.write(handles);

		const lfm_similar_search_done = (res1, res2, p_done, p_handles) => {
			rec++;
			if (!timer.sim2.id) timer.sim2.id = setTimeout(() => {
				writeSent = true;
				this.write(p_handles);
				timer.sim2.id = null;
			}, 60000);
			this.simList.push({
				name: res1,
				similar: res2
			});
			if (p_done == rec && !writeSent) {
				timer.clear(timer.sim2);
				this.write(p_handles);
			}
		};
	}

	getTag(text, keywords, substringOnly, listeners) {
		let ix = -1;
		let match = null;
		let v = '';
		match = text.match(RegExp(keywords));
		const correction = listeners || 0;

		if (match) {
			match = match.toString();
			ix = text.lastIndexOf(match);
			if (ix != -1) {
				v = text.substring(ix + match.length - correction);
				if (substringOnly) return {
					tag: v,
					matchedItem: match,
					ix: ix
				};
				v = v.split('\n')[0].trim();
				if (listeners) {
					match = v.match(/\u200b\|[\d.,\s]*$/gm);
					v = match ? match[0].replace(/\u200b\|/, '').trim() : '';
				} else {
					v = v.includes('\u200b') ? v.split(/\u200b,\s/) : v.split(/,\s/);
				}
			}
		}
		return {
			tag: v,
			matchedItem: match,
			ix: ix
		};
	}

	lfmTidy(n, artist, album) {
		n = n.split('\n')[0].trim().split(/\u200b,\s|,\s/);
		const match = (v, artist, album) => {
			v = v.toLowerCase();
			if (v == artist.toLowerCase() || v == $.removeDiacritics(artist).toLowerCase() || v == album.toLowerCase()) return true;
		}
		if (ppt.cleanNo) n.forEach((v, i) => {
			n[i] = v.replace(/\b(\d\d\d\d).+\b/g, '$1').replace(/\b(\d\d)'s\b/gi, '$1s').replace(/^\b(thirties|193\d(s|))\b/gi, '30s').replace(/^\b(forties|194\d(s|))\b/gi, '40s').replace(/^\b(fifties|195\d(s|))\b/gi, '50s').replace(/^\b(sixties|196\d(s|))\b/gi, '60s').replace(/^\b(seventies|197\d(s|))\b/gi, '70s').replace(/^\b(eighties|198\d(s|))\b/gi, '80s').replace(/^\b(nineties|199\d(s|))\b/gi, '90s').replace(/^\b(noughties|200\d(s|))\b/gi, '00s').replace(/^\b(tens|201\d(s|))\b/gi, '10s').replace(/^\b(twenties|202\d(s|)|192\d(s|))\b/gi, '20s');
			if (/\b\d\ds\b/.test(n[i])) n[i] = n[i].replace(/\b(\d\ds).+\b/, '$1');
			else n[i] = n[i].replace(/.*\d.*/, '');
		});
		if (ppt.stripNames) n = n.filter(v => !match(v, artist, album));
		if (ppt.runReplace) n.forEach((v, i) => {
			this.arr1.forEach((w, j) => {
				if (v.toLowerCase() == w.toLowerCase()) n[i] = this.arr2[j];
			});
		});
		n = n.filter(v => v);
		n = this.uniq(n);
		return n;
	}

	uniq(n) {
		const out = [];
		const seen = {};
		let j = 0;
		n.forEach(v => {
			const item = v.toLowerCase();
			if (seen[item] !== 1) {
				seen[item] = 1;
				out[j++] = $.titlecase(v).replace(/\bAor\b/g, 'AOR').replace(/\bDj\b/g, 'DJ').replace(/\bFc\b/g, 'FC').replace(/\bIdm\b/g, 'IDM').replace(/\bNwobhm\b/g, 'NWOBHM').replace(/\bR&b\b/g, 'R&B').replace(/\bRnb\b/g, 'RnB').replace(/\bUsa\b/g, 'USA').replace(/\bUs\b/g, 'US').replace(/\bUk\b/g, 'UK');
			}
		});
		return out;
	}

	write(handles, notify) {
		if (!handles) return;
		const kww = 'Founded In: |Born In: |Gegr\\u00fcndet: |Formado en: |Fond\\u00e9 en: |Luogo di fondazione: |\\u51fa\\u8eab\\u5730: |Za\\u0142o\\u017cono w: |Local de funda\\u00e7\\u00e3o: |\\u041c\\u0435\\u0441\\u0442\\u043e \\u043e\\u0441\\u043d\\u043e\\u0432\\u0430\\u043d\\u0438\\u044f: |Grundat \\u00e5r: |Kuruldu\\u011fu tarih: |\\u521b\\u5efa\\u4e8e: |Geboren in: |Lugar de nacimiento: |N\\u00e9\\(e\\) en: |Luogo di nascita: |\\u51fa\\u8eab\\u5730: |Urodzony w: |Local de nascimento: |\\u041c\\u0435\\u0441\\u0442\\u043e \\u0440\\u043e\\u0436\\u0434\\u0435\\u043d\\u0438\\u044f: |F\\u00f6dd: |Do\\u011fum yeri: |\\u751f\\u4e8e: ';
		const lkw = 'Listeners \\d|H\\u00f6rer \\d|Oyentes \\d|Auditeurs \\d|Ascoltatori \\d|\\u30ea\\u30b9\\u30ca\\u30fc \\d|S\\u0142uchaczy \\d|Ouvintes \\d|\\u0421\\u043b\\u0443\\u0448\\u0430\\u0442\\u0435\\u043b\\u0438 \\d|Lyssnare \\d|Dinleyiciler \\d|\\u542c\\u4f17 \\d';
		let artist = '';
		let albumArtist = '';
		let cur_artist = '####';
		let cur_albumArtist = '####';
		let cur_album = '####';
		let album = '';
		const albGenre_am = [];
		const albListeners = [];
		const albTags = [];
		const amMoods = [];
		const amRating = [];
		const amThemes = [];
		const artGenre_am = [];
		const artListeners = [];
		const artTags = [];
		const cue = [];
		const locale = [];
		const radioStream = notify && panel.isRadio(ppt.focus);
		const rem = [];
		const similarArtists = [];
		const tags = [];
		const tf_artist = FbTitleFormat(`$upper(${cfg.tf.artist})`);
		const tf_albumArtist = FbTitleFormat(`$upper(${cfg.tf.albumArtist})`);
		const tf_cue = FbTitleFormat('$ext(%path%)');
		const tf_l = FbTitleFormat(`$upper(${cfg.tf.album})`);
		const artists = !radioStream ? tf_artist.EvalWithMetadbs(handles) : [tf_artist.Eval()];
		const albumArtists = tf_albumArtist.EvalWithMetadbs(handles);
		const cues = tf_cue.EvalWithMetadbs(handles);
		const albums = tf_l.EvalWithMetadbs(handles);

		for (let i = 0; i < handles.Count; i++) {
			artist = artists[i];
			albumArtist = albumArtists[i];
			cue[i] = cues[i].toLowerCase() == 'cue';
			album = albums[i];
			album = !cfg.albStrip ? name.albumTidy(album) : name.albumClean(album);
			if (artist != cur_artist) {
				cur_artist = artist;
				similarArtists[i] = '';
				if (cfg.tagEnabled7 || cfg.tagEnabled8 || cfg.tagEnabled9 || cfg.tagEnabled10 && cfg.tagEnabled11 < 7) {
					artTags[i] = '';
					artListeners[i] = '';
					locale[i] = '';
					const lfmBio = panel.cleanPth(cfg.pth.foLfmBio, !radioStream ? handles[i] : ppt.focus, !radioStream ? 'tag' : 'notifyRadioStream') + $.clean(artist) + cfg.suffix.foLfmBio + '.txt';
					if ($.file(lfmBio)) {
						const lBio = $.open(lfmBio);
						if (cfg.tagEnabled7) {
							artTags[i] = this.getTag(lBio, 'Top Tags: ', true).tag;
							if (artTags[i]) artTags[i] = this.lfmTidy(artTags[i], artist, album);
						}
						if (cfg.tagEnabled8) artListeners[i] = this.getTag(lBio, lkw, false, 1).tag;
						if (cfg.tagEnabled9) locale[i] = this.getTag(lBio, kww).tag;
						if (cfg.tagEnabled10 && cfg.tagEnabled11 < 7) {
							similarArtists[i] = this.getTag(lBio, panel.similarArtistsKey).tag;
							if (similarArtists[i].length > 6) {
								similarArtists[i] = '';
								this.simList.some(v => {
									if (v.name == artist && v.similar.length) {
										similarArtists[i] = v.similar;
										return true;
									}
								});
							}
							if (similarArtists[i]) $.take(similarArtists[i], cfg.tagEnabled11);
						}
					}
				}
				if (!similarArtists[i].length) similarArtists[i] = '';
				if (cfg.tagEnabled4) {
					artGenre_am[i] = '';
					const amBio = panel.cleanPth(cfg.pth.foAmBio, !radioStream ? handles[i] : ppt.focus, !radioStream ? 'tag' : 'notifyRadioStream') + $.clean(artist) + cfg.suffix.foAmBio + '.txt';
					if ($.file(amBio)) {
						const aBio = $.open(amBio);
						artGenre_am[i] = this.getTag(aBio, 'Genre: ').tag;
					}
				}
			} else {
				artGenre_am[i] = artGenre_am[i - 1];
				artListeners[i] = artListeners[i - 1];
				artTags[i] = artTags[i - 1];
				locale[i] = locale[i - 1];
				similarArtists[i] = similarArtists[i - 1];
			}
			if (albumArtist + album != cur_albumArtist + cur_album) {
				cur_albumArtist = albumArtist;
				cur_album = album;
				if (cfg.tagEnabled0 || cfg.tagEnabled1 || cfg.tagEnabled2 || cfg.tagEnabled3) {
					albGenre_am[i] = '';
					amMoods[i] = '';
					amRating[i] = '';
					amThemes[i] = '';
					const amRev = panel.cleanPth(cfg.pth.foAmRev, handles[i], 'tag') + $.clean(albumArtist) + ' - ' + $.clean(album) + cfg.suffix.foAmRev + '.txt';
					if ($.file(amRev)) {
						const aRev = $.open(amRev);
						if (cfg.tagEnabled0) albGenre_am[i] = this.getTag(aRev, 'Genre: ').tag;
						if (cfg.tagEnabled1) amMoods[i] = this.getTag(aRev, 'Album Moods: ').tag;
						if (cfg.tagEnabled2) {
							const b = aRev.indexOf('>> Album rating: ') + 17;
							const f = aRev.indexOf(' <<');
							if (b != -1 && f != -1 && f > b) {
								amRating[i] = aRev.substring(b, f).trim() * 2;
								if (amRating[i] == 0) amRating[i] = '';
							}
						}
						if (cfg.tagEnabled3) amThemes[i] = this.getTag(aRev, 'Album Themes: ').tag;
					}
				}
				if (cfg.tagEnabled5 || cfg.tagEnabled6) {
					albTags[i] = '';
					albListeners[i] = '';
					const lfmRev = panel.cleanPth(cfg.pth.foLfmRev, handles[i], 'tag') + $.clean(albumArtist) + ' - ' + $.clean(album) + cfg.suffix.foLfmRev + '.txt';
					if ($.file(lfmRev)) {
						const lRev = $.open(lfmRev);
						if (cfg.tagEnabled5) {
							albTags[i] = this.getTag(lRev, 'Top Tags: ', true).tag;
							if (albTags[i]) albTags[i] = this.lfmTidy(albTags[i], albumArtist, album);
						}
						if (cfg.tagEnabled6) albListeners[i] = this.getTag(lRev, lkw, false, 1).tag;
					}
				}
			} else {
				albGenre_am[i] = albGenre_am[i - 1];
				albListeners[i] = albListeners[i - 1];
				amMoods[i] = amMoods[i - 1];
				amRating[i] = amRating[i - 1];
				amThemes[i] = amThemes[i - 1];
				albTags[i] = albTags[i - 1];
			}
		}

		for (let j = 0; j < 11; j++) this[`tagName${j}`] = !notify ? cfg[`tagName${j}`] : cfg[`tagName${j}_internal`].default_value;

		for (let i = 0; i < handles.Count; i++) {
			let tg = {};
			let albG_amkey = '';
			let albM_amkey = '';
			let albR_amkey = '';
			let albT_amkey = '';
			let artG_amkey = '';
			let albG_lfkey = '';
			let albL_lfkey = '';
			let artG_lfkey = '';
			let artL_lfkey = '';
			let localekey = '';
			let sikey = '';
			if (!cue[i] && (albGenre_am[i] || amMoods[i] || amRating[i] || amThemes[i] || artGenre_am[i] || albTags[i] || albListeners[i] || artTags[i] || artListeners[i] || locale[i] || similarArtists[i])) {
				tg = {};
				albG_amkey = albGenre_am[i] ? this.tagName0 : '##Null##';
				tg[albG_amkey] = albGenre_am[i];
				albM_amkey = amMoods[i] ? this.tagName1 : '##Null##';
				tg[albM_amkey] = amMoods[i];
				albR_amkey = amRating[i] ? this.tagName2 : '##Null##';
				tg[albR_amkey] = amRating[i];
				albT_amkey = amThemes[i] ? this.tagName3 : '##Null##';
				tg[albT_amkey] = amThemes[i];
				artG_amkey = artGenre_am[i] ? this.tagName4 : '##Null##';
				tg[artG_amkey] = artGenre_am[i];
				albG_lfkey = albTags[i] ? this.tagName5 : '##Null##';
				tg[albG_lfkey] = albTags[i];
				albL_lfkey = albListeners[i] ? this.tagName6 : '##Null##';
				tg[albL_lfkey] = albListeners[i];
				artG_lfkey = artTags[i] ? this.tagName7 : '##Null##';
				tg[artG_lfkey] = artTags[i];
				artL_lfkey = artListeners[i] ? this.tagName8 : '##Null##';
				tg[artL_lfkey] = artListeners[i];
				localekey = locale[i] ? this.tagName9 : '##Null##';
				tg[localekey] = locale[i];
				sikey = similarArtists[i] ? this.tagName10 : '##Null##';
				tg[sikey] = similarArtists[i];
				tags.push(tg);
			} else rem.push(i);
		}
		let i = rem.length;
		while (i--) handles.RemoveById(rem[i]);
		if (handles.Count && tags.length && notify) {
			delete tags[0]['##Null##'];
			window.NotifyOthers('biographyTags', {
				handle: handles[0],
				selectionMode: !ppt.focus ? 'Prefer nowplaying' : 'Follow selected track (playlist)',
				tags: tags[0]
			});
		}
		if (notify) return;
		if (handles.Count) handles.UpdateFileInfoFromJSON(JSON.stringify(tags));
	}
}