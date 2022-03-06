class Names {
	constructor() {
		this.cur_artist = '';
		this.lfmUID = '_[a-f0-9]{32}\\.jpg$';
	}

	// Methods

	alb(focus) {
		return $.eval('[$trim(' + cfg.tf.album + ')]', focus);
	}

	albID(focus, n) {
		if (!this.alb(focus)) return $.eval(cfg.tf.artist + cfg.tf.albumArtist + '%path%', focus);
		else switch (n) {
			case 'simple':
				return $.eval(cfg.tf.artist + cfg.tf.albumArtist + cfg.tf.album, focus);
			case 'stnd':
				return $.eval(cfg.tf.albumArtist + cfg.tf.album + '%discnumber%%date%', focus);
			case 'full':
				return $.eval(cfg.tf.artist + cfg.tf.albumArtist + cfg.tf.album + '%discnumber%%date%', focus);
		}
	}

	albm(focus, ignoreLock) {
		return this.albumTidy($.eval('[' + cfg.tf.album + ']', focus, ignoreLock));
	}

	album(focus, ignoreLock) {
		if (!cfg.albStrip) return this.albm(focus);
		return this.albumClean($.eval('[' + cfg.tf.album + ']', focus, ignoreLock));

	}

	albumArtist(focus, ignoreLock) {
		return $.eval('[$trim(' + cfg.tf.albumArtist + ')]', focus, ignoreLock);
	}

	albumClean(n) {
		return n.replace(/CD(\s*\d|\.0\d)|CD\s*(One|Two|Three)|Disc\s*\d|Disc\s*(III|II|I|One|Two|Three)\b|(Bonus\s*Track|Collector's|(Digital\s*|Super\s*|)Deluxe|Digital|Expanded|Limited|Platinum|Reissue|Special)\s*(Edition|Version)|(Bonus\s*(CD|Disc))|\d\d\w\w\s*Anniversary\s*(Expanded\s*|Re(-|)master\s*|)(Edition|Re(-|)master|Version)|((19|20)\d\d(\s*|\s*-\s*)|)(Digital(ly|)\s*|)(Re(-|)master(ed|)|Re(-|)recorded)(\s*Edition|\s*Version|)|\(Deluxe\)|\(Mono\)|\(Reissue\)|\(Revisited\)|\(Stereo\)|\(Web\)|\[Deluxe\]|\[Mono\]|\[Reissue\]|\[Revisited\]|\[Stereo\]|\[Web\]/gi, '').replace(/\(\s*\)|\[\s*\]/g, ' ').replace(/\s\s+/g, ' ').replace(/-\s*$/g, ' ').trim();
	}

	albumTidy(n) {
		return n.replace(/CD(\s*\d|\.0\d)|CD\s*(One|Two|Three)|Disc\s*\d|Disc\s*(III|II|I|One|Two|Three)\b/gi, '').replace(/\(\s*\)|\[\s*\]/g, ' ').replace(/\s\s+/g, ' ').replace(/-\s*$/g, ' ').trim();
	}

	artist(focus, ignoreLock) {
		return $.eval('[$trim(' + cfg.tf.artist + ')]', focus, ignoreLock);
	}

	isLfmImg(fn, artist) {
		if (artist) {
			if (artist != this.cur_artist) {
				artist = $.regexEscape($.clean(artist));
				this.cur_artist = artist;
			}
			return RegExp(`^${artist + this.lfmUID}`, 'i').test(fn);
		} else return RegExp(this.lfmUID, 'i').test(fn);
	}

	title(focus, ignoreLock) {
		let n = $.eval('[$trim(' + cfg.tf.title + ')]', focus, ignoreLock);
		if (cfg.local && panel.isRadio(focus)) {
			const kw = '(-\\s*|\\s+)\\d\\d\\d\\d';
			let ix = -1;
			let yr = n.match(RegExp(kw));
			if (yr) {
				yr = yr[0].toString();
				ix = n.indexOf(yr);
			}
			if (ix != -1) n = n.slice(0, ix).trim();
		}
		return n;
	}

	trackID(focus) {
		return $.eval(cfg.tf.artist + cfg.tf.title, focus);
	}
}