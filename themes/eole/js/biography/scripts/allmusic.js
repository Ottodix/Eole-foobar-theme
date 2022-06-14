'use strict';

class DldAllmusicBio {
	constructor(state_callback) {
		this.artist = '';
		this.artistLink = '';
		this.fo_bio;
		this.force;
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
				else $.trace('allmusic review / biography: ' + server.album + ' / ' + server.albumArtist + ': not found' + ' Status error: ' + this.xmlhttp.status, true);
			}
	}

	search(p_sw, URL, p_title, p_artist, p_fo_bio, p_pth_bio, p_force) {
		this.sw = p_sw;
		if (!this.sw) {
			this.fo_bio = p_fo_bio;
			this.force = p_force;
			this.pth_bio = p_pth_bio;
			this.title = p_title;
			this.artist = p_artist;
			if (!this.title) this.sw = 1;
		}
		this.func = null;
		this.xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
		this.func = this.analyse;
		if (!this.force && server.urlDone(md5.hashStr(this.artist + this.title + this.pth_bio + cfg.partialMatch + URL))) return;
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
					list = parse.amSearch(div, 'performers', 'song');
					i = server.match(this.artist, this.title, list, 'song');
					if (i != -1) {
						this.artistLink = list[i].artistLink;
						if (this.artistLink) {
							doc.close();
							return this.search(2, this.artistLink + '/biography');
						}
					}
					this.search(1, server.url.am + 'artists/' + encodeURIComponent(this.artist));
				} catch (e) {
					server.updateNotFound('Bio ' + cfg.partialMatch + ' ' + this.artist + ' - ' + this.title);
					if (!$.file(this.pth_bio)) $.trace('allmusic biography: ' + this.artist + ': not found', true);
				}
				doc.close();
				break;
			case 1:
				try {
					div.innerHTML = this.xmlhttp.responseText;
					const artists = [];
					const artist = $.strip(this.artist);
					$.htmlParse(div.getElementsByTagName('div'), 'className', 'name', v => {
						const a = v.getElementsByTagName('a');
						let name = a.length && a[0].innerText ? a[0].innerText : '';
						name = $.strip(name);
						const href = a.length && a[0].href ? a[0].href : '';
						if (name && href) {
							if (artist == name) artists.push(href);
						}
					});
					doc.close();
					if (artists.length == 1) {
						this.sw = 2;
						return this.search(2, artists[0] + '/biography');
					}
					server.updateNotFound('Bio ' + cfg.partialMatch + ' ' + this.artist + ' - ' + this.title);
					if (!$.file(this.pth_bio)) {
						$.trace('allmusic biography: ' + this.artist + (artists.length > 1 ? ': unable to disambiguate multiple artists of same name: discriminators' + (this.title ? ', album name or track title, not matched' : ' N/A for menu look ups') : ': not found'), true);
					}
				} catch (e) {
					server.updateNotFound('Bio ' + cfg.partialMatch + ' ' + this.artist + ' - ' + this.title);
					if (!$.file(this.pth_bio)) $.trace('allmusic biography: ' + this.artist + ': not found', true);
				}
				break;
			case 2:
				parse.amBio(this.xmlhttp.responseText, this.artist, '', this.title, this.fo_bio, this.pth_bio, '');
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
				else $.trace('allmusic review / biography: ' + this.album + ' / ' + this.albumArtist + ': not found' + ' Status error: ' + this.xmlhttp.status, true);
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
		if ((ppt.multiServer || this.sw == 2) && !this.force && server.urlDone(md5.hashStr(this.albumArtist + this.album + this.dn_type + this.pth_rev + cfg.partialMatch + URL))) return;
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
		let list = [];
		switch (this.sw) {
			case 0:
				try {
					div.innerHTML = this.xmlhttp.responseText; 
					const item = {};
					if (this.dn_type.startsWith('review') || this.dn_type == 'biography') {item.art = 'artist'; item.type = 'album';} // this.dn_type choices: 'review+biography'* || 'composition+biography' || 'review' || 'composition' || 'track' || 'biography' // *falls back to trying track / artist based biography if art_upd needed
					else if (this.dn_type == 'track') {item.art = 'performers'; item.type = 'song';}
					else {item.art = 'composer'; item.type = 'composition';}
					list = parse.amSearch(div, item.art, item.type);
					const i = server.match(this.albumArtist, this.album, list, item.type);
					if (i != -1) {
						if (!this.va) this.artistLink = list[i].artistLink;
						if (this.dn_type != 'biography') {
							this.sw = 1;
							doc.close();
							return this.search(this.sw, list[i].titleLink);
						} else if (!this.va) {
							this.sw = 2;
							doc.close();
							return this.search(this.sw, this.artistLink + '/biography');
						}
					}
					server.getBio(this.force, this.art, 1);
					if (this.dn_type.includes('biography')) server.updateNotFound('Bio ' + cfg.partialMatch + ' ' + this.pth_rev);
					server.updateNotFound('Rev ' + cfg.partialMatch + ' ' + this.pth_rev + (this.dn_type != 'track' ? '' : ' ' + this.album + ' ' + this.albumArtist));
					$.trace('allmusic review: ' + this.album + ' / ' + this.albumArtist + ': not found', true);
				} catch (e) {
					server.getBio(this.force, this.art, 1);
					server.updateNotFound('Bio ' + cfg.partialMatch + ' ' + this.pth_rev);
					server.updateNotFound('Rev ' + cfg.partialMatch + ' ' + this.pth_rev + (this.dn_type != 'track' ? '' : ' ' + this.album + ' ' + this.albumArtist));
					$.trace('allmusic review: ' + this.album + ' / ' + this.albumArtist + ': not found', true);
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
					let songReleaseYear = '';
					let tg = '';

					$.htmlParse(dv, 'className', 'text', v => review = server.format(v.innerHTML));

					if (this.dn_type.startsWith('review')) {
						let json = this.xmlhttp.responseText.match(/<script\s+type="application\/ld\+json">[\s\S]*?<\/script>/);
						if (json) json = json[0];
						if (json) json = json.replace(/<script\s+type="application\/ld\+json">/, '').replace('</script>', '').trim();
						reviewAuthor = $.jsonParse(json, '', 'get', 'review.name');
					} else {
						$.htmlParse(div.getElementsByTagName('h3'), 'className', this.dn_type.startsWith('composition') ? 'author headline' : 'headline review-author', v => reviewAuthor = v.innerText.trim());
					}

					if (this.dn_type != 'track') {
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
						reviewGenre = reviewGenre.length ? 'Genre: ' + reviewGenre.join('\u200b, ') : '';
						reviewMood = reviewMood.length ? 'Album Moods: ' + reviewMood.join('\u200b, ') : '';
						reviewTheme = reviewTheme.length ? 'Album Themes: ' + reviewTheme.join('\u200b, ') : '';
						review = txt.add([reviewGenre, reviewMood, reviewTheme, releaseDate, reviewAuthor], review);
						review = review.trim();
						$.htmlParse(div.getElementsByTagName('li'), 'id', 'microdata-rating', v => rating = v.innerText.replace(/\D+/g, '') / 2);
						review = '>> Album rating: ' + rating + ' <<  ' + review;
						if (review.length > 22) {
							$.buildPth(this.fo_rev);
							$.save(this.pth_rev, review, true);
							server.res();
						} else {
							server.updateNotFound('Rev ' + cfg.partialMatch + ' ' + this.pth_rev);
							$.trace('allmusic review: ' + this.album + ' / ' + this.albumArtist + ': not found', true);
						}
					} else {
						let composer = [];
						$.htmlParse(div.getElementsByTagName('p'), 'className', 'song-composer', v => {
							const a = v.getElementsByTagName('a');
							if (a.length && a[0].innerText) composer.push(a[0].innerText);
						});
						const m = this.xmlhttp.responseText.match(/data-releaseyear=\s*"\s*\d+\s*"/i);
						if (m) {
							songReleaseYear = m[0].replace(/\D/g, '').trim();
						}
						$.htmlParse(dv, 'className', 'middle', v => {
							const a = v.getElementsByTagName('a');
							$.htmlParse(a, false, false, w => {
								if (w.href.includes('/genre/') || w.href.includes('/style/')) {
									tg = w.title.trim();
									if (tg) reviewGenre.push(tg);
								}
								if (w.href.includes('/mood/')) {
									tg = w.title.trim();
									if (tg) reviewMood.push(tg);
								}
								if (w.href.includes('/theme/')) {
									tg = w.title.trim();
									if (tg) reviewTheme.push(tg);
								}
							});
						});
						const text = $.jsonParse(this.pth_rev, {}, 'file');
						text[this.album] = {
							author: reviewAuthor,
							composer: composer,
							date: songReleaseYear,
							genres: reviewGenre,
							moods: reviewMood,
							themes: reviewTheme,
							wiki: review,
							update: Date.now()
						};
						$.buildPth(this.fo_rev);
						$.save(this.pth_rev, JSON.stringify($.sortKeys(text), null, 3), true);
							
						if (reviewAuthor || reviewGenre || reviewMood || reviewTheme || review || songReleaseYear || composer)	{
							server.res();
						} else {
							server.updateNotFound('Rev ' + cfg.partialMatch + ' ' + this.pth_rev + ' ' + this.album + ' ' + this.albumArtist);
							$.trace('allmusic review: ' + this.album + ' / ' + this.albumArtist + ': not found', true);
						}
					}
				} catch (e) {
					server.updateNotFound('Rev ' + cfg.partialMatch + ' ' + this.pth_rev + (this.dn_type != 'track' ? '' : ' ' + this.album + ' ' + this.albumArtist));
					$.trace('allmusic review: ' + this.album + ' / ' + this.albumArtist + ': not found', true);
				}
				doc.close();
				if (!this.dn_type.includes('+biography')) break;
				if (this.artistLink) {
					this.sw = 2;
					return this.search(this.sw, this.artistLink + '/biography');
				}
				break;
			case 2:
				doc.close();
				parse.amBio(this.xmlhttp.responseText, this.artist, this.album, '', this.fo_bio, this.pth_bio, this.pth_rev);
				break;
		}
	}
}

class Parse {
	amBio(responseText, artist, album, title, fo_bio, pth_bio, pth_rev) {
		doc.open();
		const div = doc.createElement('div');
		try {
			div.innerHTML = responseText;
			const dv = div.getElementsByTagName('div');
			let active = '';
			let biography = '';
			let biographyAuthor = '';
			let biographyGenre = [];
			let biographyLabel = '';
			let groupMembers = [];
			let end = '';
			let start = '';
			let tg = '';

			$.htmlParse(dv, 'className', 'text', v => biography = server.format(v.innerHTML));
			$.htmlParse(dv, 'className', 'birth', v => start = server.format(v.innerHTML).replace(/Born/i, 'Born:').replace(/Formed/i, 'Formed:'));
			$.htmlParse(dv, 'className', 'death', v => end = server.format(v.innerHTML).replace(/Died/i, 'Died:').replace(/Disbanded/i, 'Disbanded:'));
			$.htmlParse(dv, 'className', 'active-dates', v => active = v.innerText.replace(/Active/i, 'Active: ').trim());

			$.htmlParse(div.getElementsByTagName('a'), false, false, v => {
				if (v.href.includes('www.allmusic.com/genre') || v.href.includes('www.allmusic.com/style')) {
					tg = v.innerText.trim();
					if (tg) biographyGenre.push(tg);
				}
			});

			$.htmlParse(dv, 'className', 'group-members', v => {
				const a = v.getElementsByTagName('a');
				for (let i = 0; i < a.length; i++) {
					groupMembers.push(a[i].innerText.trim());
				}
			});

			biographyGenre = biographyGenre.length ?  'Genre: ' + biographyGenre.join('\u200b, ') : '';
			groupMembers = groupMembers.length ? 'Group Members: ' + groupMembers.join('\u200b, ') : '';
			$.htmlParse(div.getElementsByTagName('h2'), 'className', 'bio-heading', v => biographyLabel = server.format(v.innerHTML));
			$.htmlParse(div.getElementsByTagName('span'), 'className', 'bio-text', v => biographyAuthor = server.format(v.innerHTML));
			biographyAuthor = biographyLabel + ' ' + biographyAuthor;

			biography = txt.add([active, start, end, biographyGenre, groupMembers, biographyAuthor], biography);
			biography = biography.trim();

			if (biography.length > 19) {
				$.buildPth(fo_bio);
				$.save(pth_bio, biography, true);
				server.res();
			} else {
				album ? server.updateNotFound('Bio ' + cfg.partialMatch + ' ' + pth_rev) : server.updateNotFound('Bio ' + cfg.partialMatch + ' ' + artist + ' - ' + title);
				if (!$.file(pth_bio)) $.trace('allmusic biography: ' + artist + ': not found', true);
			}
		} catch (e) {
			album ? server.updateNotFound('Bio ' + cfg.partialMatch + ' ' + pth_rev) : server.updateNotFound('Bio ' + cfg.partialMatch + ' ' + artist + ' - ' + title);
			if (!$.file(pth_bio)) $.trace('allmusic biography: ' + artist + ': not found', true);
		}
		doc.close();
	}

	amSearch(div, artist, item) {
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
}

const parse = new Parse;