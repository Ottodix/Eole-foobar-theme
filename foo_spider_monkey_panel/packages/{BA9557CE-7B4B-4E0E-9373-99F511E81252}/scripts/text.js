class Text {
	constructor() {
		const DT_CENTER = 0x00000001;
		const DT_RIGHT = 0x00000002;
		const DT_VCENTER = 0x00000004;
		const DT_WORDBREAK = 0x00000010;
		const DT_SINGLELINE = 0x00000020;
		const DT_CALCRECT = 0x00000400;
		const DT_NOCLIP = 0x00000100;
		const DT_NOPREFIX = 0x00000800;
		const DT_WORD_ELLIPSIS = 0x00040000;
	
		this.album = '';
		this.albumartist = '';
		this.artist = '';
		this.cur_artist = '';
		this.calc = true;
		this.cc = DT_CENTER | DT_VCENTER | DT_SINGLELINE | DT_NOPREFIX | DT_WORD_ELLIPSIS;
		this.get = 1;
		this.head = ppt.heading;
		this.heading = '';
		this.init = true;
		this.initialise = true;
		this.l = DT_NOPREFIX;
		this.lc = DT_VCENTER | DT_SINGLELINE | DT_NOPREFIX | DT_WORD_ELLIPSIS;
		this.c = [this.lc, DT_RIGHT | this.lc];
		this.ncc = DT_CENTER | DT_VCENTER | DT_NOCLIP | DT_WORDBREAK | DT_CALCRECT | DT_NOPREFIX | DT_WORD_ELLIPSIS;
		this.na = '';
		this.newText = false;
		this.repaint = true;
		this.text = '';
		this.textUpdate = 0;
		this.track = '';
		this.trackartist = '';

		this.topTags = ['Tags', 'Tags', 'Tags', 'Tags', 'Tag', '\u30bf\u30b0', 'Tagi', 'Tags', '\u0422\u0435\u0433\u0438', 'Taggar', 'Etiketler', '\u6807\u7b7e'];

		ppt.sourceHeading = $.clamp(ppt.sourceHeading, 0, 2);
		ppt.trackHeading = $.clamp(ppt.trackHeading, 0, 2);

		this.bio = {
			allmusic: false,
			am: '',
			amSubHead: ppt.amBioSubHead.split('|'),
			arr: [],
			both: 0,
			cur: '',
			fallbackText: ppt.bioFallbackText.split('|'),
			lfm: '',
			lfmSubHead: ppt.lfmBioSubHead.split('|'),
			lookUp: false,
			scrollPos: {},
			subHead: 0,
			text: ''
		}

		this.d = {
			ax1: 0,
			ax2: 0,
			aB1: false,
			aB2: false,
			aR1: false,
			aR2: false,
			bothB_ix: -1,
			bothR_ix: -1,
			lB1: false,
			lB2: false,
			lR1: false,
			lR2: false,
			lx1: 0,
			lx2: 0,
			w: []
		}

		this.done = {
			amBio: false,
			amRev: false,
			lfmBio: false,
			lfmRev: false
		}

		this.id = {
			alb: '',
			curAlb: '',
			album: '',
			curAlbum: '',
			tr: '',
			curTr: ''
		}

		this.mod = {
			amBio: '',
			curAmBio: '',
			amRev: '',
			curAmRev: '',
			lfmBio: '',
			curLfmBio: '',
			lfmRev: '',
			curLfmRev: ''
		}

		this.rev = {
			allmusic: true,
			am: '',
			amSubHead: ppt.amRevSubHead.split('|'),
			arr: [],
			both: 0,
			checkedTrackSubHead: true,
			cur: '',
			fallbackText: ppt.revFallbackText.split('|'),
			lfm: '',
			lfmAlb: '',
			lfmSubHead: ppt.lfmRevSubHead.split('|'),
			lookUp: false,
			scrollPos: {},
			subHead: 0,
			trackHeading: true,
			text: '',
			y: Math.round(Math.max(1, ui.font.main_h * 0.05))
		}

		this.rating = {
			am: -1,
			avg: -1,
			lfm: -1
		}

		this.currentTrackTags = $.debounce(() => {
			const handle = $.handle(ppt.focus);
			if (handle) tag.write(new FbMetadbHandleList([handle]), true);
		}, 2000, {
			'leading': true,
			'trailing': true
		});
	}

	// Methods

	albCalc() {
		if (!this.rev.text || ppt.img_only) return;
		this.rev.arr = [];
		this.d.bothR_ix = -1;
		let l = [];
		$.gr(1, 1, false, g => {
			if (panel.style.inclTrackRev) {
				let ti = this.rev.text.match(/#!!#.+?$/m);
				if (ti) {
					ti = ti.toString();
					if (g.CalcTextWidth(ti, ui.font.main) > panel.text.w) {
						const new_ti = g.EstimateLineWrap(ti, ui.font.subHeadTrack, panel.text.w - g.CalcTextWidth('... ', ui.font.subHeadTrack))[0] + '...';
						this.rev.text = this.rev.text.replace(RegExp($.regexEscape(ti)), new_ti);
					}
				}
			}
			l = g.EstimateLineWrap(this.rev.text, ui.font.main, panel.text.w);
		});
		for (let i = 0; i < l.length; i += 2) this.rev.arr.push(l[i].trim())
		if (ppt.summaryFirst) {
			const hdMarkers = [];
			this.rev.arr.forEach((v, i) => {
				if (v == '¦|¦') hdMarkers.push(i);
			});
			if (hdMarkers.length > 1)
				for (let i = hdMarkers[0]; i < hdMarkers[1] + 1; i++) this.rev.arr[i] = this.rev.arr[i].replace(/^\u2219 |^\| {2}/, '').replace(/\|$/, '');
			if (hdMarkers.length == 4)
				for (let i = hdMarkers[2]; i < hdMarkers[3] + 1; i++) this.rev.arr[i] = this.rev.arr[i].replace(/^\u2219 |^\| {2}/, '').replace(/\|$/, '');
			let i = this.rev.arr.length;
			while (i--) {
				if (this.rev.arr[i] == '¦|¦') this.rev.arr.splice(i, 1);
			}
		}
		if (this.rev.subHead) this.rev.arr.some((v, i, arr) => {
			if (v.includes('#!#')) {
				this.d.bothR_ix = i;
				arr[i] = arr[i].replace('#!#', '');
				return true;
			}
		});
		but.refresh(true);
		alb_scrollbar.reset();
		alb_scrollbar.metrics(panel.sbar.x, panel.sbar.y, ui.sbar.w, panel.sbar.h, panel.lines_drawn, ui.font.main_h, false);
		alb_scrollbar.setRows(this.rev.arr.length);
		this.d.r = !ppt.summaryFirst && (ui.stars == 2 || ui.stars == 1 && !ppt.hdBtnShow) && (ppt.ratingTextPos == 2 || this.rev.subHead && !ppt.ratingTextPos) && !ppt.artistView && this.rev.arr.length > 1 && (!this.rev.subHead ? (this.rev.allmusic && this.rating.am != -1 || !this.rev.allmusic && this.rating.lfm != -1) : true);
		this.d.aw1 = this.d.w[ppt.heading ? 3 : 7];
		this.d.aw2 = this.d.w[ppt.heading ? 3 : 7];
		this.d.lw1 = this.d.w[ppt.heading ? 4 : 8];
		this.d.lw2 = this.d.w[ppt.heading ? 4 : 8];
		if (this.d.r) {
			if (this.rating.am >= 0) {
				if (this.d.aR1) this.d.aw1 += this.d.w[0] + but.rating.w2;
				if (this.d.aR2) this.d.aw2 += this.d.w[0] + but.rating.w2;
				if (this.d.aR1 || this.d.aR2) this.d.ax = panel.text.l + this.d.w[ppt.heading ? 3 : 7];
			}
			if (this.rating.lfm >= 0) {
				if (this.d.lR1) this.d.lw1 += this.d.w[0] + but.rating.w2;
				if (this.d.lR2) this.d.lw2 += this.d.w[0] + but.rating.w2;
				if (this.d.lR1 || this.d.lR2) this.d.lx = panel.text.l + this.d.w[ppt.heading ? 4 : 8];
			}
			this.d.ry = Math.round((ui.font.main_h - but.rating.h1 / 2) / 1.8);
		}
		if (!ppt.heading && this.rev.subHead) {
			this.d.xa1 = panel.text.l + this.d.aw1;
			this.d.xl1 = panel.text.l + this.d.lw1;
			this.d.x1a = panel.text.l + this.d.aw2;
			this.d.x1l = panel.text.l + this.d.lw2;
			const lw = panel.text.l + panel.text.w;
			this.d.xa2 = Math.max(this.d.xa1, lw);
			this.d.xl2 = Math.max(this.d.xl1, lw);
			this.d.x2a = Math.max(this.d.x1a, lw);
			this.d.x2l = Math.max(this.d.x1l, lw);
		}
		if (panel.style.inclTrackRev == 1) this.getScrollPos();
	}

	albumFlush() {
		this.text = false;
		this.mod.amRev = this.rev.am = this.rev.lfm = this.mod.lfmRev = '';
		this.mod.curAmRev = this.mod.curLfmRev = '1';
		this.rev.checkedTrackSubHead = this.done.amRev = this.done.lfmRev = false;
		this.rev.text = '';
		this.head = false;
		but.setScrollBtnsHide();
		but.setSrcBtnHide();
	}

	amBio(a) {
		const aBio = panel.getPth('bio', ppt.focus, this.artist, '', '', cfg.supCache, a, '', '', 'foAmBio', true).pth;
		if (!$.file(aBio)) return;
		this.mod.amBio = $.lastModified(aBio);
		if (this.mod.amBio == this.mod.curAmBio) return;
		this.bio.am = $.open(aBio).trim();
		if (ppt.expandLists) this.bio.am = this.expandLists('amBio', this.bio.am);
		if (ppt.summaryFirst) this.bio.am = this.summaryFirstText('Genre: ', 'Active: ', this.bio.am).replace(/(?:\s*\r\n){3,}/g, '\r\n\r\n');
		this.newText = true;
		this.mod.curAmBio = this.mod.amBio;
	}

	amBioPth() {
		if (ppt.img_only) return ['', '', false, false];
		return panel.getPth('bio', ppt.focus, this.artist, '', '', cfg.supCache, $.clean(this.artist), '', '', 'foAmBio', false);
	}

	amRev(a, aa, l) {
		const aRev = panel.getPth('rev', ppt.focus, this.artist, this.album, '', cfg.supCache, a, aa, l, 'foAmRev', true).pth;
		let rat = '';
		if (!$.file(aRev)) {
			this.rating.am = -1;
			but.check();
			return;
		}
		this.mod.amRev = $.lastModified(aRev);
		if (this.mod.amRev == this.mod.curAmRev) return;
		this.rev.am = $.open(aRev).trim();
		this.newText = true;
		this.mod.curAmRev = this.mod.amRev;
		this.rating.am = -1;
		let b = this.rev.am.indexOf('>> Album rating: ') + 17;
		const f = this.rev.am.indexOf(' <<');
		const subHeadOn = ppt.bothRev && ppt.sourceHeading || ppt.sourceHeading == 2;
		if (ppt.amRating) {
			if (b != -1 && f != -1 && f > b) this.rating.am = this.rev.am.substring(b, f);
			if (!isNaN(this.rating.am) && this.rating.am != 0 && this.rating.am != -1) this.rating.am *= 2;
			else this.rating.am = -1;
		}
		if ((ui.stars == 1 && ppt.hdBtnShow || !ppt.amRating) && f != -1) this.rev.am = this.rev.am.substring(f + 5);
		else if (!ppt.summaryFirst && (ui.stars == 2 || ui.stars == 1 && !ppt.hdBtnShow) && (ppt.ratingTextPos == 2 || subHeadOn && !ppt.ratingTextPos) && this.rating.am != -1) {
			this.rev.am = (!subHeadOn ? ppt.allmusic_name + ':\r\n\r\n' : '') + this.rev.am.substring(f + 5);
		} else {
			if (!ui.stars || this.rating.am == -1 || ppt.summaryFirst) {
				b = this.rev.am.indexOf(' <<');
				if (b != -1) this.rev.am = this.rev.am.slice(b + 3);
				if (ppt.summaryFirst) rat = this.rating.am != -1 ? ppt.allmusic_name + ': ' + this.rating.am / 2 : '';
			} else if (ppt.allmusic_name != 'Album rating') this.rev.am = this.rev.am.replace('Album rating', ppt.allmusic_name);
		}
		if (ppt.expandLists) this.rev.am = this.expandLists('amRev', this.rev.am);
		if (ppt.summaryFirst) this.rev.am = this.summaryFirstText('Genre: ', 'Release Date: ', this.rev.am, '', rat).replace(/(?:\s*\r\n){3,}/g, '\r\n\r\n');
		if (!this.rev.am) but.check();
	}

	amRevPth() {
		if (ppt.img_only) return ['', '', false, false];
		return panel.getPth('rev', ppt.focus, this.artist, this.album, '', cfg.supCache, $.clean(this.artist), $.clean(this.albumartist), $.clean(this.album), 'foAmRev', false);
	}

	artCalc() {
		if (!this.bio.text || ppt.img_only) return;
		this.bio.arr = [];
		this.d.bothB_ix = -1;
		let l = [];
		$.gr(1, 1, false, g => l = g.EstimateLineWrap(this.bio.text, ui.font.main, panel.text.w));
		for (let i = 0; i < l.length; i += 2) this.bio.arr.push(l[i].trim());
		if (ppt.summaryFirst) {
			const hdMarkers = [];
			this.bio.arr.forEach((v, i) => {
				if (v == '¦|¦') hdMarkers.push(i);
			});
			if (hdMarkers.length > 1)
				for (let i = hdMarkers[0]; i < hdMarkers[1] + 1; i++) this.bio.arr[i] = this.bio.arr[i].replace(/^\u2219 |^\| {2}/, '').replace(/\|$/, '');
			if (hdMarkers.length == 4)
				for (let i = hdMarkers[2]; i < hdMarkers[3] + 1; i++) this.bio.arr[i] = this.bio.arr[i].replace(/^\u2219 |^\| {2}/, '').replace(/\|$/, '');
			let i = this.bio.arr.length;
			while (i--) {
				if (this.bio.arr[i] == '¦|¦') this.bio.arr.splice(i, 1);
			}
		}
		if (this.bio.subHead) this.bio.arr.some((v, i, arr) => {
			if (v.includes('#!#')) {
				this.d.bothB_ix = i;
				arr[i] = arr[i].replace('#!#', '');
				return true;
			}
		});
		but.refresh(true);
		art_scrollbar.reset();
		art_scrollbar.metrics(panel.sbar.x, panel.sbar.y, ui.sbar.w, panel.sbar.h, panel.lines_drawn, ui.font.main_h, false);
		art_scrollbar.setRows(this.bio.arr.length);
		if (!ppt.heading && this.bio.subHead) {
			this.d.ax1 = panel.text.l + this.d.w[5];
			this.d.ax2 = Math.max(this.d.ax1, panel.text.l + panel.text.w);
			this.d.lx1 = panel.text.l + this.d.w[6];
			this.d.lx2 = Math.max(this.d.lx1, panel.text.l + panel.text.w);
		}
	}

	artistFlush() {
		this.text = false;
		this.done.amBio = this.done.lfmBio = false;
		this.mod.amBio = this.bio.am = this.mod.lfmBio = this.bio.lfm = '';
		this.mod.curAmBio = this.mod.curLfmBio = '1';
		this.bio.text = '';
		this.head = false;
		but.setScrollBtnsHide();
		but.setSrcBtnHide();
	}

	albumReset(upd) {
		if (panel.lock) return;
		this.id.curAlbum = this.id.album;
		this.id.album = name.albID(ppt.focus, 'simple');
		const new_album = this.id.album != this.id.curAlbum;
		if (new_album) this.id.alb = '';
		if (new_album || upd) {
			this.album = name.album(ppt.focus);
			this.albumartist = name.albumArtist(ppt.focus);
			this.albumFlush();
			this.rev.lookUp = false;
		}
		if (panel.style.inclTrackRev) {
			this.id.curTr = this.id.tr;
			this.id.tr = name.trackID(ppt.focus);
			const new_track = this.id.tr != this.id.curTr;
			if (new_track) {
				this.rev.checkedTrackSubHead = this.done.amRev = this.done.lfmRev = false;
				if (panel.style.inclTrackRev == 1) this.logScrollPos('rev');
			}
		}
	}

	artistReset(upd) {
		if (panel.artistsSame() || panel.lock) return;
		this.cur_artist = this.artist;
		this.artist = name.artist(ppt.focus);
		const new_artist = this.artist != this.cur_artist;
		if (new_artist || upd) {
			this.bio.lookUp = false;
			this.artistFlush();
		}
	}

	draw(gr) {
		if (!ppt.img_only || ppt.text_only) {
			this.getTxtFallback();
			if (ppt.typeOverlay && ppt.style > 3 && this.text && !ppt.text_only) {
				gr.SetSmoothingMode(2);
				let o = 0;
				switch (ppt.typeOverlay) {
					case 1:
						gr.FillSolidRect(panel.tbox.l, panel.tbox.t, panel.tbox.w, panel.tbox.h, ui.col.rectOv);
						break;
					case 2:
						o = Math.round(ui.overlay.borderWidth / 2);
						gr.FillSolidRect(panel.tbox.l + o, panel.tbox.t + o, panel.tbox.w - o * 2, panel.tbox.h - o * 2, ui.col.rectOv);
						gr.DrawRect(panel.tbox.l + o, panel.tbox.t + o, panel.tbox.w - ui.overlay.borderWidth - 1, panel.tbox.h - ui.overlay.borderWidth - 1, ui.overlay.borderWidth, ui.col.rectOvBor);
						break;
					case 3:
						gr.FillRoundRect(panel.tbox.l, panel.tbox.t, panel.tbox.w, panel.tbox.h, panel.arc, panel.arc, ui.col.rectOv);
						break;
					case 4:
						o = Math.round(ui.overlay.borderWidth / 2);
						gr.FillRoundRect(panel.tbox.l + o, panel.tbox.t + o, panel.tbox.w - o * 2, panel.tbox.h - o * 2, panel.arc, panel.arc, ui.col.rectOv);
						gr.DrawRoundRect(panel.tbox.l + o, panel.tbox.t + o, panel.tbox.w - ui.overlay.borderWidth - 1, panel.tbox.h - ui.overlay.borderWidth - 1, panel.arc, panel.arc, ui.overlay.borderWidth, ui.col.rectOvBor);
						break;
				}
			}
			if (ppt.artistView && this.bio.text) {
				const b = Math.max(Math.round(art_scrollbar.delta / ui.font.main_h + 0.4), 0);
				const f = Math.min(b + panel.lines_drawn, this.bio.arr.length);
				for (let i = b; i < f; i++) {
					const item_y = ui.font.main_h * i + panel.text.t - art_scrollbar.delta;
					if (item_y < panel.style.max_y) {
						if (!ppt.heading && this.bio.subHead) {
							const iy = Math.round(item_y + ui.font.main_h / 2);
							if (!i && this.d.aB1) gr.DrawLine(this.d.ax1, iy, this.d.ax2, iy, ui.style.l_w, ui.col.centerLine);
							if (!i && this.d.lB1) gr.DrawLine(this.d.lx1, iy, this.d.lx2, iy, ui.style.l_w, ui.col.centerLine);
							if (i == this.d.bothB_ix && this.d.aB2) gr.DrawLine(this.d.ax1, iy, this.d.ax2, iy, ui.style.l_w, ui.col.centerLine);
							if (i == this.d.bothB_ix && this.d.lB2) gr.DrawLine(this.d.lx1, iy, this.d.lx2, iy, ui.style.l_w, ui.col.centerLine);
						}
						if (this.bio.subHead && (!i || i == this.d.bothB_ix)) gr.GdiDrawText(this.bio.arr[i], ui.font.subHeadSource, ui.col.source, panel.text.l, item_y, panel.text.w, ui.font.main_h, this.l);
						else gr.GdiDrawText(this.bio.arr[i], ui.font.main, ui.col.text, panel.text.l, item_y, panel.text.w, ui.font.main_h, this.l);
					}
				}
				if (ppt.sbarShow) art_scrollbar.draw(gr);
			}
			if (!ppt.artistView && this.rev.text) {
				const b = Math.max(Math.round(alb_scrollbar.delta / ui.font.main_h + 0.4), 0);
				const f = Math.min(b + panel.lines_drawn, this.rev.arr.length);
				const r = !ppt.summaryFirst && (ui.stars == 2 || ui.stars == 1 && !ppt.hdBtnShow) && (ppt.ratingTextPos == 2 || this.rev.subHead && !ppt.ratingTextPos) && !ppt.artistView && this.rev.arr.length > 1 && (!this.rev.subHead ? (this.rev.allmusic && this.rating.am != -1 || !this.rev.allmusic && this.rating.lfm != -1) : true);
				let song = -1;
				for (let i = b; i < f; i++) {
					let item_y = ui.font.main_h * i + panel.text.t - alb_scrollbar.delta;
					if (item_y < panel.style.max_y) {
						if (this.rev.arr[i].startsWith('#!!#')) song = i;
						if (i > song && song != -1 && !this.rev.subHead) item_y += this.rev.y;
						if (r) switch (this.rev.subHead) {
							case 0: {
								const rating = this.rev.allmusic ? this.rating.am : this.rating.lfm;
								if (i == 0 && rating >= 0)
									gr.DrawImage(but.rating.images[rating], panel.text.l + gr.CalcTextWidth((this.rev.allmusic ? ppt.allmusic_name : ppt.lastfm_name) + ':  ', ui.font.main), item_y + this.d.ry, but.rating.w1 / 2, but.rating.h1 / 2, 0, 0, but.rating.w1, but.rating.h1, 0, 255);
								break;
							}
							case 1:
								if (!i) {
									if (this.d.aR1 && this.rating.am >= 0) {
										gr.DrawImage(but.rating.images[this.rating.am], this.d.ax, item_y + this.d.ry, but.rating.w1 / 2, but.rating.h1 / 2, 0, 0, but.rating.w1, but.rating.h1, 0, 255);
									}
									if (this.d.lR1 && this.rating.lfm >= 0) {
										gr.DrawImage(but.rating.images[this.rating.lfm], this.d.lx, item_y + this.d.ry, but.rating.w1 / 2, but.rating.h1 / 2, 0, 0, but.rating.w1, but.rating.h1, 0, 255);
									}
								}
								if (i == this.d.bothR_ix) {
									if (this.d.aR2 && this.rating.am >= 0) {
										gr.DrawImage(but.rating.images[this.rating.am], this.d.ax, item_y + this.d.ry, but.rating.w1 / 2, but.rating.h1 / 2, 0, 0, but.rating.w1, but.rating.h1, 0, 255);
									}
									if (this.d.lR2 && this.rating.lfm >= 0) {
										gr.DrawImage(but.rating.images[this.rating.lfm], this.d.lx, item_y + this.d.ry, but.rating.w1 / 2, but.rating.h1 / 2, 0, 0, but.rating.w1, but.rating.h1, 0, 255);
									}
								}
								break;
						}
						if (!ppt.heading && this.rev.subHead) {
							const iy = Math.round(item_y + ui.font.main_h / 2);
							if (!i) {
								if (this.d.aR1) gr.DrawLine(this.d.xa1, iy, this.d.xa2, iy, ui.style.l_w, ui.col.centerLine);
								if (this.d.lR1) gr.DrawLine(this.d.xl1, iy, this.d.xl2, iy, ui.style.l_w, ui.col.centerLine);
							}
							if (i == this.d.bothR_ix) {
								if (this.d.aR2) gr.DrawLine(this.d.x1a, iy, this.d.x2a, iy, ui.style.l_w, ui.col.centerLine);
								if (this.d.lR2) gr.DrawLine(this.d.x1l, iy, this.d.x2l, iy, ui.style.l_w, ui.col.centerLine);
							}
						}
						if (this.rev.subHead && (!i || i == this.d.bothR_ix)) gr.GdiDrawText(this.rev.arr[i], ui.font.subHeadSource, ui.col.source, panel.text.l, item_y, panel.text.w, ui.font.main_h, this.l);
						else if (song == i) {
							const trlabel = this.rev.arr[i].replace('#!!#', '');
							if (!ppt.heading && !i) {
								const iy = Math.round(item_y + ui.font.main_h / 2);
								const x1 = panel.text.l + gr.CalcTextWidth(trlabel + ' ', ui.font.subHeadTrack);
								gr.DrawLine(x1, iy, Math.max(x1, panel.text.l + panel.text.w), iy, ui.style.l_w, ui.col.centerLine);
							}
							gr.GdiDrawText(trlabel, ui.font.subHeadTrack, ui.col.track, panel.text.l, item_y, panel.text.w, ui.font.main_h, this.l);
						} else gr.GdiDrawText(this.rev.arr[i], ui.font.main, ui.col.text, panel.text.l, item_y, panel.text.w, ui.font.main_h, this.l);
					}
				}
				if (ppt.sbarShow) alb_scrollbar.draw(gr);
			}
		}
	}

	drawMessage(gr) {
		if (ppt.heading || !this.na) return;
		const j_x = Math.round(panel.text.w / 2) + panel.text.l;
		const j_h = Math.round(ui.font.main_h * 1.5);
		const j_y = panel.text.t + (panel.lines_drawn * ui.font.main_h - j_h) / 3;
		const rs1 = Math.min(5, j_h / 2);
		const rs2 = Math.min(4, (j_h - 2) / 2);
		gr.SetSmoothingMode(4);
		const j_w = gr.CalcTextWidth(this.na, ui.font.message) + 25;
		gr.FillRoundRect(j_x - j_w / 2, j_y, j_w, j_h, rs1, rs1, 0xDB000000);
		gr.DrawRoundRect(j_x - j_w / 2, j_y, j_w, j_h, rs1, rs1, 1, 0x64000000);
		gr.DrawRoundRect(j_x - j_w / 2 + 1, j_y + 1, j_w - 2, j_h - 2, rs2, rs2, 1, 0x28ffffff);
		gr.GdiDrawText(this.na, ui.font.message, RGB(0, 0, 0), j_x - j_w / 2 + 1, j_y + 1, j_w, j_h, this.cc);
		gr.GdiDrawText(this.na, ui.font.message, 0xffff4646, j_x - j_w / 2, j_y, j_w, j_h, this.cc);
	}

	expandLists(type, n) {
		let items = [];
		switch (type) {
			case 'amBio':
				if (!ppt.summaryFirst) items = ['Genre: '];
				break;
			case 'lfmBio': {
				const members = 'Members: |Mitglieder: |Miembros: |Membres: |Componenti: |\\u30e1\\u30f3\\u30d0\\u30fc: |Cz\\u0142onkowie: |Membros: |\\u0423\\u0447\\u0430\\u0441\\u0442\\u043d\\u0438\\u043a\\u0438: |Medlemmar: |\\u00dcyeler: |\\u6210\\u5458: ';
				const topTags = 'Top Tags: ';
				const topTracks = 'Top Tracks: |Top-Titel: |Temas m\\u00e1s escuchados: |Top titres: |Brani pi\\u00f9 ascoltati: |\\u4eba\\u6c17\\u30c8\\u30e9\\u30c3\\u30af: |Najpopularniejsze utwory: |Faixas principais: |\\u041b\\u0443\\u0447\\u0448\\u0438\\u0435 \\u043a\\u043e\\u043c\\u043f\\u043e\\u0437\\u0438\\u0446\\u0438\\u0438: |Toppl\\u00e5tar: |Pop\\u00fcler Par\\u00e7alar: |\\u6700\\u4f73\\u5355\\u66f2: ';
				items = [members, panel.similarArtistsKey, panel.topAlbumsKey, topTracks];
				if (!ppt.summaryFirst) items.unshift(topTags);
				break;
			}
			case 'amRev':
				items = ['Album Moods: ', 'Album Themes: '];
				if (!ppt.summaryFirst) items.unshift('Genre: ');
				break;
			case 'lfmRev':
				if (!ppt.summaryFirst) items = ['Top Tags: '];
				break;
		}

		items.forEach(v => {
			let w = tag.getTag(n, v);
			let li = w.tag;
			if (li) {
				let list = w.matchedItem + '\r\n';
				li.forEach((v, i, arr) => {
					let nm = (i + 1) + '. ' + v;
					$.gr(1, 1, false, g => {
						if (g.CalcTextWidth(nm, ui.font.main) > panel.text.w) {
							nm = g.EstimateLineWrap(nm, ui.font.main, panel.text.w - g.CalcTextWidth('... ', ui.font.main))[0] + '...';
						}
					});
					list += nm;
					if (i < arr.length - 1) list += '\r\n'
				});
				let toBeReplaced = n.substring(w.ix);
				toBeReplaced = toBeReplaced.split('\n')[0];
				n = n.replace(RegExp($.regexEscape(toBeReplaced)), list);
			}
		});
		return n;
	}

	getItem(p_calc, art_ix, alb_ix, force) {
		if (ppt.img_only) return;
		switch (true) {
			case ppt.artistView: {
				this.cur_artist = this.artist;
				this.artist = art_ix < panel.art.list.length ? panel.art.list[art_ix].name : name.artist(ppt.focus);
				const new_artist = this.artist != this.cur_artist;
				if (new_artist) {
					this.artistFlush();
					this.bio.lookUp = true;
				}
				this.getText(p_calc);
				this.get = 0;
				break;
			}
			case !ppt.artistView: {
				this.id.curAlb = this.id.alb;
				this.artist = alb_ix < panel.alb.list.length ? panel.alb.list[alb_ix].artist : name.albumArtist(ppt.focus);
				const alb = alb_ix < panel.alb.list.length ? panel.alb.list[alb_ix].album : name.album(ppt.focus);
				this.id.alb = this.artist + alb;
				const new_album = this.id.alb != this.id.curAlb;
				if (new_album || force) {
					this.album = alb;
					this.albumartist = this.artist;
					this.albumFlush();
					this.rev.lookUp = true;
				}
				this.getText(p_calc);
				this.get = 0;
				break;
			}
		}
	}

	getTxtFallback() {
		if (this.scrollbar_type().draw_timer) return;
		if (!panel.updateNeeded()) return;
		if (!this.get && !this.textUpdate) return;
		this.na = '';
		if (this.textUpdate) this.updText();
		if (this.get) {
			this.albumReset();
			this.artistReset();
			if (this.calc) this.calc = ppt.artistView ? 1 : 2;
			this.getText(this.calc);
			if (this.get == 2) panel.focusServer();
			this.calc = false;
			this.get = 0;
		}
	}

	getScrollPos() {
		let v;
		switch (ppt.artistView) {
			case true:
				v = this.artist + '-' + this.bio.allmusic + '-' + ppt.lockBio + '-' + ppt.bothBio;
				if (!this.bio.scrollPos[v]) return art_scrollbar.setScroll(0);
				if (this.bio.scrollPos[v].text === this.bio.arr.length + '-' + this.bio.text) art_scrollbar.setScroll(this.bio.scrollPos[v].scroll || 0);
				else if (ppt.showFilmStrip && ppt.autoFilm) break;
				else {
					this.bio.scrollPos[v].scroll = 0;
					this.bio.scrollPos[v].text = '';
				}
				break;
			case false: {
				v = (this.rev.allmusic || panel.style.inclTrackRev != 2 || ppt.bothRev ? this.albumartist + this.album + '-' : '') + this.rev.allmusic + '-' + ppt.lockRev + '-' + ppt.bothRev + '-' + ppt.inclTrackRev;
				if (!this.rev.scrollPos[v]) return alb_scrollbar.setScroll(0);
				let match = false;
				if (panel.style.inclTrackRev != 1) {
					if (this.rev.scrollPos[v].text === ui.font.main.Size + '-' + panel.text.w + '-' + this.rev.text) match = true;
				} else {
					const tx1 = (ui.font.main.Size + '-' + panel.text.w).toString();
					const tx2 = $.strip(this.rev.lfmAlb || this.rev.lfm);
					const tx3 = $.strip(this.rev.am);
					if (this.rev.scrollPos[v].text.startsWith(tx1) && (tx2 && this.rev.scrollPos[v].text.includes(tx2) || tx3 && this.rev.scrollPos[v].text.includes(tx3))) match = true;
				}
				if (match) {
					const set_scroll = panel.style.inclTrackRev != 1 ? this.rev.scrollPos[v].scroll : Math.min(this.rev.scrollPos[v].scroll, alb_scrollbar.max_scroll);
					alb_scrollbar.setScroll(set_scroll || 0);
				} else if (ppt.showFilmStrip && ppt.autoFilm) break;
				else {
					this.rev.scrollPos[v].scroll = 0;
					this.rev.scrollPos[v].text = '';
				}
				break;
			}
		}
	}

	getText(p_calc, update) {
		if (ppt.img_only) return;
		const a = $.clean(this.artist);
		this.newText = false;
		if (!panel.lock) {
			this.trackartist = name.artist(ppt.focus);
			this.track = name.title(ppt.focus);
		}
		switch (true) {
			case ppt.artistView:
				if (!a) break;
				if (ppt.bothBio) {
					if (!this.done.amBio || update) {
						this.done.amBio = true;
						this.amBio(a);
						if (!this.done.lfmBio || update) {
							this.done.lfmBio = true;
							this.lfmBio(a);
						}
					}
					break;
				}
				if (!ppt.allmusic_bio && (!this.done.lfmBio || update)) {
					this.done.lfmBio = true;
					this.lfmBio(a);
					if (!this.bio.lfm && !ppt.lockBio && (!this.done.amBio || update)) {
						this.done.amBio = true;
						this.amBio(a);
					}
				}
				if (ppt.allmusic_bio && (!this.done.amBio || update)) {
					this.done.amBio = true;
					this.amBio(a);
					if (!this.bio.am && !ppt.lockBio && (!this.done.lfmBio || update)) {
						this.done.lfmBio = true;
						this.lfmBio(a);
					}
				}
				break;
			case !ppt.artistView: {
				const aa = $.clean(this.albumartist);
				const l = $.clean(this.album);
				if (!aa || !l && !panel.style.inclTrackRev) {
					this.rating.am = -1;
					this.rating.lfm = -1;
					this.rating.avg = -1;
					but.check();
					break;
				}
				if (panel.isRadio(ppt.focus) && !panel.style.inclTrackRev && !panel.alb.ix) break;
				if (ppt.bothRev) {
					if (!this.done.amRev || update) {
						this.done.amRev = true;
						this.amRev(a, aa, l);
						if (!this.done.lfmRev || update) {
							this.done.lfmRev = true;
							this.lfmRev(a, aa, l);
						}
					}
					break;
				}
				if (ppt.allmusic_alb && (!this.done.amRev || update)) {
					this.done.amRev = true;
					this.amRev(a, aa, l);
					if (!this.rev.am && !ppt.lockRev && (!this.done.lfmRev || update)) {
						this.done.lfmRev = true;
						this.lfmRev(a, aa, l);
					}
				}
				if (!ppt.allmusic_alb && (!this.done.lfmRev || update)) {
					this.done.lfmRev = true;
					this.lfmRev(a, aa, l);
					if (!this.rev.lfm && !ppt.lockRev && (!this.done.amRev || update)) {
						this.done.amRev = true;
						this.amRev(a, aa, l);
					}
				}
				break;
			}
		}
		if (!update || this.newText) {
			this.rev.text = '';
			this.d.aB1 = false;
			this.d.aB2 = false;
			this.d.aR1 = false;
			this.d.aR2 = false;
			this.bio.text = '';
			this.head = ppt.heading;
			but.setSrcBtnHide();
			this.d.lB1 = false;
			this.d.lB2 = false;
			this.d.lR1 = false;
			this.d.lR2 = false;
			switch (true) {
				case !ppt.bothBio:
					if (ppt.allmusic_bio) {
						if (ppt.sourceHeading == 2 && !this.rev.am && this.rev.lfm) this.rev.lfm = this.rev.lfm.replace(/Last.fm: /g, '');
						this.bio.text = !ppt.lockBio ? this.bio.am ? (ppt.sourceHeading == 2 ? this.bio.amSubHead[ppt.heading ? 0 : 1] + '\r\n' : '') + this.bio.am : (ppt.sourceHeading == 2 && this.bio.lfm ? this.bio.lfmSubHead[ppt.heading ? 0 : 1] + '\r\n' : '') + this.bio.lfm : (ppt.sourceHeading == 2 && (this.bio.am || panel.id.imgText || ppt.text_only) ? this.bio.amSubHead[ppt.heading ? 0 : 1] + '\r\n' + (this.bio.am ? '' : 'Nothing Found') : '') + this.bio.am;
						if (this.bio.am || ppt.lockBio) this.d.aB1 = true;
						else if (this.bio.lfm) this.d.lB1 = true;
						if (this.bio.am || ppt.lockBio) this.bio.allmusic = true;
						else if (this.bio.lfm) this.bio.allmusic = false;
						else this.bio.allmusic = true;
					} else {
						if (ppt.sourceHeading == 2 && this.bio.lfm) this.bio.lfm = this.bio.lfm.replace(/Last.fm: /g, '');
						this.bio.text = !ppt.lockBio ? this.bio.lfm ? (ppt.sourceHeading == 2 ? this.bio.lfmSubHead[ppt.heading ? 0 : 1] + '\r\n' : '') + this.bio.lfm : (ppt.sourceHeading == 2 && this.bio.am ? this.bio.amSubHead[ppt.heading ? 0 : 1] + '\r\n' : '') + this.bio.am : (ppt.sourceHeading == 2 && (this.bio.lfm || panel.id.imgText || ppt.text_only) ? this.bio.lfmSubHead[ppt.heading ? 0 : 1] + '\r\n' + (this.bio.lfm ? '' : 'Nothing Found') : '') + this.bio.lfm;
						if (this.bio.lfm || ppt.lockBio) this.d.lB1 = true;
						else if (this.bio.am) this.d.aB1 = true;
						if (this.bio.lfm || ppt.lockBio) this.bio.allmusic = false;
						else if (this.bio.am) this.bio.allmusic = true;
						else this.bio.allmusic = false;
					}
					this.bio.both = false;
					break;
				case ppt.bothBio:
					if (ppt.allmusic_bio) {
						if (this.bio.am) {
							this.bio.text = (ppt.sourceHeading ? this.bio.amSubHead[ppt.heading ? 0 : 1] + '\r\n' : '') + this.bio.am;
							this.d.aB1 = true;
						}
						if (this.bio.lfm) {
							this.bio.lfm = this.bio.lfm.replace(/Last.fm: /g, '');
							this.bio.text = this.bio.text + (this.bio.am ? '\r\n\r\n' : '') + (ppt.sourceHeading ? '#!#' + this.bio.lfmSubHead[ppt.heading ? 0 : 1] + '\r\n' : '') + this.bio.lfm;
							this.d.lB2 = true;
						}
						if (this.bio.am) this.bio.allmusic = true;
						else if (this.bio.lfm) this.bio.allmusic = false;
						else this.bio.allmusic = true;
					} else {
						if (this.bio.lfm) {
							this.bio.lfm = this.bio.lfm.replace(/Last.fm: /g, '');
							this.bio.text = (ppt.sourceHeading ? this.bio.lfmSubHead[ppt.heading ? 0 : 1] + '\r\n' : '') + this.bio.lfm;
							this.d.lB1 = true;
						}
						if (this.bio.am) {
							this.bio.text = this.bio.text + (this.bio.lfm ? '\r\n\r\n' : '') + (ppt.sourceHeading ? '#!#' + this.bio.amSubHead[ppt.heading ? 0 : 1] + '\r\n' : '') + this.bio.am;
							this.d.aB2 = true;
						}
						if (this.bio.lfm) this.bio.allmusic = false;
						else if (this.bio.am) this.bio.allmusic = true;
						else this.bio.allmusic = false;
					}
					this.bio.both = this.bio.am && this.bio.lfm || !this.bio.am && !this.bio.lfm ? true : false;
					break;
			}
			switch (true) {
				case !ppt.bothRev:
					if (ppt.allmusic_alb) {
						if (ppt.sourceHeading == 2 && !this.rev.am && this.rev.lfm) this.rev.lfm = this.rev.lfm.replace(/Last.fm: /g, '');
						this.rev.text = !ppt.lockRev ? this.rev.am ? (ppt.sourceHeading == 2 ? this.rev.amSubHead[ppt.heading ? 0 : 1] + '\r\n' : '') + this.rev.am : (ppt.sourceHeading == 2 && this.rev.lfm ? this.rev.lfmSubHead[ppt.heading ? 0 : 1] + '\r\n' : '') + this.rev.lfm : (ppt.sourceHeading == 2 && (this.rev.am || panel.id.imgText || ppt.text_only) ? this.rev.amSubHead[ppt.heading ? 0 : 1] + '\r\n' + (this.rev.am ? '' : 'Nothing Found') : '') + this.rev.am;
						if (this.rev.am || ppt.lockRev) this.d.aR1 = true;
						else if (this.rev.lfm) this.d.lR1 = true;
						if (this.rev.am || ppt.lockRev) this.rev.allmusic = true;
						else if (this.rev.lfm) this.rev.allmusic = false;
						else this.rev.allmusic = true;
					} else {
						if (ppt.sourceHeading == 2 && this.rev.lfm) this.rev.lfm = this.rev.lfm.replace(/Last.fm: /g, '');
						this.rev.text = !ppt.lockRev ? this.rev.lfm ? (ppt.sourceHeading == 2 ? this.rev.lfmSubHead[ppt.heading ? 0 : 1] + '\r\n' : '') + this.rev.lfm : (ppt.sourceHeading == 2 && this.rev.am ? this.rev.amSubHead[ppt.heading ? 0 : 1] + '\r\n' : '') + this.rev.am : (ppt.sourceHeading == 2 && (this.rev.lfm || panel.id.imgText || ppt.text_only) ? this.rev.lfmSubHead[ppt.heading ? 0 : 1] + '\r\n' + (this.rev.lfm ? '' : 'Nothing Found') : '') + this.rev.lfm;
						if (this.rev.lfm || ppt.lockRev) this.d.lR1 = true;
						else if (this.rev.am) this.d.aR1 = true;
						if (this.rev.lfm || ppt.lockRev) this.rev.allmusic = false;
						else if (this.rev.am) this.rev.allmusic = true;
						else this.rev.allmusic = false;
					}
					this.rev.both = false;
					break;
				case ppt.bothRev:
					if (ppt.allmusic_alb) {
						if (this.rev.am) {
							this.rev.text = (ppt.sourceHeading ? this.rev.amSubHead[ppt.heading ? 0 : 1] + '\r\n' : '') + this.rev.am;
							this.d.aR1 = true;
						}
						if (this.rev.lfm) {
							this.rev.lfm = this.rev.lfm.replace(/Last.fm: /g, '');
							this.rev.text = this.rev.text + (this.rev.am ? '\r\n\r\n' : '') + (ppt.sourceHeading ? '#!#' + this.rev.lfmSubHead[ppt.heading ? 0 : 1] + '\r\n' : '') + this.rev.lfm;
							this.d.lR2 = true;
						}
						if (this.rev.am) this.rev.allmusic = true;
						else if (this.rev.lfm) this.rev.allmusic = false;
						else this.rev.allmusic = true;
					} else {
						if (this.rev.lfm) {
							this.rev.lfm = this.rev.lfm.replace(/Last.fm: /g, '');
							this.rev.text = (ppt.sourceHeading ? this.rev.lfmSubHead[ppt.heading ? 0 : 1] + '\r\n' : '') + this.rev.lfm;
							this.d.lR1 = true;
						}
						if (this.rev.am) {
							this.rev.text = this.rev.text + (this.rev.lfm ? '\r\n\r\n' : '') + (ppt.sourceHeading ? '#!#' + this.rev.amSubHead[ppt.heading ? 0 : 1] + '\r\n' : '') + this.rev.am;
							this.d.aR2 = true;
						}
						if (this.rev.lfm) this.rev.allmusic = false;
						else if (this.rev.am) this.rev.allmusic = true;
						else this.rev.allmusic = false;
					}
					this.rev.both = this.rev.am && this.rev.lfm || !this.rev.am && !this.rev.lfm ? true : false;
					break;
			}
			this.bio.subHead = !ppt.sourceHeading || !this.bio.text || !ppt.bothBio && ppt.sourceHeading != 2 ? 0 : 1;
			this.rev.subHead = !ppt.sourceHeading || !this.rev.text || !ppt.bothRev && ppt.sourceHeading != 2 ? 0 : 1;
			if (ui.stars == 1 && ppt.hdBtnShow && this.rev.both) {
				let c = 0;
				this.rating.avg = -1;
				if (this.rating.am != -1 || this.rating.lfm != -1) {
					this.rating.avg = 0;
					if (this.rating.am != -1) {
						this.rating.avg += this.rating.am;
						c++;
					}
					if (this.rating.lfm != -1) {
						this.rating.avg += this.rating.lfm;
						c++;
					}
					this.rating.avg /= c;
					this.rating.avg = Math.round(this.rating.avg);
				}
			}
			if (!panel.id.imgText) this.text = ppt.artistView ? this.bio.text ? true : false : this.rev.text ? true : false;
			else this.text = true;
			img.setCrop(true);
			if (!this.bio.text && (ppt.text_only || panel.id.imgText)) this.bio.text = !ppt.heading ? this.bio.fallbackText[1] : this.bio.fallbackText[0];
			if (!this.rev.text && (ppt.text_only || panel.id.imgText)) this.rev.text = !ppt.heading ? this.rev.fallbackText[1] : this.rev.fallbackText[0];
			if ((ppt.artistView && !this.bio.text || !ppt.artistView && !this.rev.text) && !ppt.text_only) {
				this.head = false;
				but.setSrcBtnHide();
			}
			if (this.bio.text != this.bio.cur || p_calc && p_calc !== 2) {
				this.bio.cur = this.bio.text;
				this.artCalc();
			}
			if (this.rev.text != this.rev.cur || p_calc && p_calc !== 1) {
				this.rev.cur = this.rev.text;
				this.albCalc();
			}
			if (ppt.text_only && !ui.style.isBlur || panel.alb.ix && panel.style.inclTrackRev) this.paint();
		}
		if (!ppt.heading) {
			this.newText = false;
			return;
		}
		if (this.updTrackSubHead()) return this.getText(false);
		if (panel.lock && !this.newText) {
			if (this.curHeadingID == this.headingID()) {
				this.newText = false;
				return;
			} else this.curHeadingID = this.headingID();
		}
		this.newText = false;
		if (ppt.artistView) this.heading = ui.show.headingText ? this.tf(this.bio.allmusic ? ppt.amBioHeading : ppt.lfmBioHeading, ppt.artistView) : '';
		else this.heading = ui.show.headingText ? (panel.style.inclTrackRev && !this.rev.allmusic && this.rev.trackHeading ? this.tf(ppt.lfmTrackHeading, ppt.artistView, true) : this.tf(this.rev.allmusic ? ppt.amRevHeading : ppt.lfmRevHeading, ppt.artistView)) : '';
		if (panel.lock) this.curHeadingID = this.headingID();
	}

	getWidths() {
		$.gr(1, 1, false, g => this.d.w = [' ', this.bio.amSubHead[0] + ' ', this.bio.lfmSubHead[0] + ' ', this.rev.amSubHead[0] + ' ', this.rev.lfmSubHead[0] + ' ', this.bio.amSubHead[1] + ' ', this.bio.lfmSubHead[1] + ' ', this.rev.amSubHead[1] + ' ', this.rev.lfmSubHead[1] + ' '].map(v => Math.max(g.CalcTextWidth(v, ui.font.subHeadSource), 1)));
	}

	grab() {
		this.textUpdate = 1;
		this.notifyTags();
		if (panel.block()) return;
		this.updText();
	}

	headingID() {
		return ppt.artistView + '-' + panel.art.ix + '-' + panel.alb.ix + '-' + ppt.allmusic_bio + '-' + ppt.allmusic_alb + '-' + panel.style.inclTrackRev;
	}

	lfmBio(a) {
		const lBio = panel.getPth('bio', ppt.focus, this.artist, '', '', cfg.supCache, a, '', '', 'foLfmBio', true).pth;
		if (!$.file(lBio)) return;
		this.mod.lfmBio = $.lastModified(lBio);
		if (this.mod.lfmBio == this.mod.curLfmBio) return;
		this.bio.lfm = $.open(lBio).trim();
		if (!ppt.stats) {
			const f = this.bio.lfm.indexOf('Last.fm: ');
			if (f != -1) this.bio.lfm = this.bio.lfm.slice(0, f).trim();
		}
		this.bio.lfm = this.bio.lfm.replace(/\s\u200b\|[\d.,\s]*?;/g, ';').replace(/\u200b\|[\d.,\s]*?$/gm, '');
		if (ppt.expandLists) this.bio.lfm = this.expandLists('lfmBio', this.bio.lfm);
		if (ppt.summaryFirst) {
			const popNow = 'Popular Now: |Beliebt Jetzt: |Popular Ahora: |Populaire Maintenant: |Popolare Ora: |\\u4eca\\u4eba\\u6c17: |Popularne Teraz: |Popular Agora: |\\u041f\\u043e\\u043f\\u0443\\u043b\\u044f\\u0440\\u043d\\u044b\\u0435 \\u0441\\u0435\\u0439\\u0447\\u0430\\u0441: |Popul\\u00e4r Nu: |\\u015eImdi Pop\\u00fcler: |\\u70ed\\u95e8 \\u73b0\\u5728';
			const yrsActive = "Years Active: |Jahre aktiv: |A\\u00f1os de actividad: |Ann\\u00e9es d'activit\\u00e9: |Anni di attivit\\u00e0: |\\u6d3b\\u52d5\\u671f\\u9593: |Lata aktywno\\u015bci: |Anos de atividade: |\\u0410\\u043a\\u0442\\u0438\\u0432\\u043d\\u043e\\u0441\\u0442\\u044c \\(\\u043b\\u0435\\u0442\\): |\\u00c5r aktiv: |Aktif y\\u0131llar: |\\u6d3b\\u8dc3\\u5e74\\u4efd: |Born: |Geburtstag: |Fecha de nacimiento: |N\\u00e9\\(e\\) le: |Data di nascita: |\\u751f\\u5e74\\u6708\\u65e5: |Urodzony: |Data de nascimento: |\\u0413\\u043e\\u0434 \\u0440\\u043e\\u0436\\u0434\\u0435\\u043d\\u0438\\u044f: |F\\u00f6dd: |Do\\u011fum tarihi: |\\u51fa\\u751f";
			this.bio.lfm = this.summaryFirstText('Top Tags: ', yrsActive, this.bio.lfm, popNow).replace(/(?:\s*\r\n){3,}/g, '\r\n\r\n');
		} else if (cfg.lang.ix > 3) this.bio.lfm = this.bio.lfm.replace('Top Tags: ', this.topTags[cfg.lang.ix] + ': ');
		this.newText = true;
		this.mod.curLfmBio = this.mod.lfmBio;
	}

	lfmBioPth() {
		if (ppt.img_only) return ['', '', false, false];
		return panel.getPth('bio', ppt.focus, this.artist, '', '', cfg.supCache, $.clean(this.artist), '', '', 'foLfmBio', false);
	}

	lfmRev(a, aa, l) {
		let lfm_tr_mod = '';
		let rat = '';
		let trackRev = '';
		let trk = '';
		const lRev = panel.getPth('rev', ppt.focus, this.artist, this.album, '', cfg.supCache, a, aa, l, 'foLfmRev', true).pth;
		if (!$.file(lRev)) {
			this.rating.lfm = -1;
			but.check();
			if (!panel.style.inclTrackRev) {
				this.rev.lfmAlb = '';
				return;
			}
		}
		if (panel.style.inclTrackRev) {
			trk = this.track.toLowerCase();
			trackRev = $.jsonParse(panel.getPth('track', ppt.focus, this.trackartist, 'Track Reviews', '', '', $.clean(this.trackartist), '', 'Track Reviews', 'foLfmRev', true).pth, false, 'file');
			if (trackRev[trk] && trackRev[trk].update) lfm_tr_mod = trackRev[trk].update;
		}
		this.mod.lfmRev = $.file(lRev) && panel.style.inclTrackRev != 2 ? $.lastModified(lRev) + lfm_tr_mod : lfm_tr_mod;
		if (this.mod.lfmRev == this.mod.curLfmRev) return;
		this.rev.lfmAlb = '';
		if (panel.style.inclTrackRev != 2) this.rev.lfmAlb = $.open(lRev).trim();
		this.rev.lfmAlb = this.rev.lfmAlb.replace(/\s\u200b\|[\d.,\s]*?;/g, ';').replace(/\u200b\|[\d.,\s]*?$/gm, '');
		this.newText = true;
		this.mod.curLfmRev = this.mod.lfmRev;
		this.rating.lfm = -1;
		if (panel.style.inclTrackRev != 2) {
			if (ppt.lfmRating) {
				const b = this.rev.lfmAlb.indexOf('Rating: ');
				if (b != -1) {
					this.rating.lfm = this.rev.lfmAlb.substring(b).replace(/\D/g, '');
					this.rating.lfm = Math.min(((Math.floor(0.1111 * this.rating.lfm + 0.3333) / 2)), 5);
					if (ui.stars == 1 && ppt.hdBtnShow) this.rating.lfm *= 2;
					if ((ui.stars == 2 || ui.stars == 1 && !ppt.hdBtnShow) && this.rating.lfm != -1) {
						const subHeadOn = ppt.bothRev && ppt.sourceHeading || ppt.sourceHeading == 2;
						if (ppt.ratingTextPos == 2 || subHeadOn && !ppt.ratingTextPos) {
							this.rating.lfm *= 2;
							if (!ppt.summaryFirst) this.rev.lfmAlb = (!subHeadOn ? ppt.lastfm_name + ':\r\n\r\n' : '') + this.rev.lfmAlb;
							else rat = ppt.lastfm_name + ': ' + this.rating.lfm;
						} else {
							if (!ppt.summaryFirst) this.rev.lfmAlb = '>> ' + ppt.lastfm_name + ': ' + this.rating.lfm + ' <<  ' + (/^Top Tags: /.test(this.rev.lfmAlb) ? '\r\n\r\n' : '') + this.rev.lfmAlb;
							else rat = ppt.lastfm_name + ': ' + this.rating.lfm;
						}
					}
				}
			}
			this.rev.lfmAlb = ppt.score ? this.rev.lfmAlb.replace('Rating: ', '') : this.rev.lfmAlb.replace(/^Rating: .*$/m, '').trim();
			if (ppt.summaryFirst) {
				const releaseDate = 'Release Date: |Veröffentlichungsdatum: |Fecha De Lanzamiento: |Date De Sortie: |Data Di Pubblicazione: |リリース日: |Data Wydania: |Data De Lançamento: |Дата релиза: |Utgivningsdatum: |Yayınlanma Tarihi: |发布日期: ';
				this.rev.lfmAlb = this.summaryFirstText('Top Tags: ', releaseDate, this.rev.lfmAlb, '', rat);
			} else if (cfg.lang.ix > 3) this.rev.lfmAlb = this.rev.lfmAlb.replace('Top Tags: ', this.topTags[cfg.lang.ix] + ': ');
		}
		if (!ppt.stats) {
			this.rev.lfmAlb = this.rev.lfmAlb.replace(/^Last.fm: .*$(\n)?/gm, '').trim();
		}
		this.rev.lfm = this.rev.lfmAlb;
		if (panel.style.inclTrackRev) {
			if (trackRev && trackRev[trk]) {
				let wiki = '';
				if (trackRev[trk].releases) wiki = trackRev[trk].releases;
				if (trackRev[trk].wiki) wiki += wiki ? '\r\n\r\n' + trackRev[trk].wiki : trackRev[trk].wiki;
				if (trackRev[trk].stats) wiki += wiki ? '\r\n\r\n' + trackRev[trk].stats : trackRev[trk].stats;
				if (wiki) {
					if (ppt.trackHeading == 1 && (this.rev.lfmAlb || !ppt.heading || ppt.bothRev && panel.style.inclTrackRev == 2 && (this.rev.lfmAlb || this.rev.am)) || ppt.trackHeading == 2) {
						this.rev.trackHeading = false;
						trackRev = '#!!#' + this.tf(ppt.lfmTrackSubHeading, ppt.artistView, true) + '\r\n' + wiki;
					} else {
						this.rev.trackHeading = true;
						trackRev = wiki;
					}
					this.rev.lfm = this.rev.lfmAlb + (this.rev.lfmAlb ? '\r\n\r\n' : '') + trackRev;
				} else this.rev.trackHeading = false;
				if ((this.rev.lfmAlb || this.rev.am) && ppt.heading && !ppt.trackHeading) this.rev.trackHeading = false;
			} else this.rev.trackHeading = false;
		}
		if (!ppt.stats) {
			this.rev.lfm = this.rev.lfm.replace(/^Last.fm: .*$(\n)?/gm, '').trim();
		}
		if (ppt.expandLists) this.rev.lfm = this.expandLists('lfmRev', this.rev.lfm);
		if (ppt.summaryFirst || !ppt.stats) this.rev.lfm = this.rev.lfm.replace(/(?:\s*\r\n){3,}/g, '\r\n\r\n');
		if (!this.rev.lfm) but.check();
	}

	lfmRevPth() {
		if (ppt.img_only) return ['', '', false, false];
		return panel.getPth('rev', ppt.focus, this.artist, this.album, '', cfg.supCache, $.clean(this.artist), $.clean(this.albumartist), $.clean(this.album), 'foLfmRev', false);
	}

	lfmTrackPth() {
		if (ppt.img_only || ppt.artistView) return ['', '', false, false];
		return panel.getPth('track', ppt.focus, this.artist, 'Track Reviews', '', '', $.clean(this.artist), '', 'Track Reviews', 'foLfmRev', false);
	}

	logScrollPos(n) {
		let keys = [];
		let v;
		n = n == 'rev' ? false : ppt.artistView;
		switch (n) {
			case true:
				keys = Object.keys(this.bio.scrollPos);
				if (keys.length > 70) delete this.bio.scrollPos[keys[0]];
				v = this.artist + '-' + this.bio.allmusic + '-' + ppt.lockBio + '-' + ppt.bothBio;
				this.bio.scrollPos[v] = {};
				this.bio.scrollPos[v].scroll = art_scrollbar.scroll;
				this.bio.scrollPos[v].text = this.bio.arr.length + '-' + this.bio.text;
				break;
			case false:
				keys = Object.keys(this.rev.scrollPos);
				if (keys.length > 70) delete this.rev.scrollPos[keys[0]];
				v = (this.rev.allmusic || panel.style.inclTrackRev != 2 || ppt.bothRev ? this.albumartist + this.album + '-' : '') + this.rev.allmusic + '-' + ppt.lockRev + '-' + ppt.bothRev + '-' + ppt.inclTrackRev;
				this.rev.scrollPos[v] = {};
				this.rev.scrollPos[v].scroll = alb_scrollbar.scroll;
				this.rev.scrollPos[v].text = ui.font.main.Size + '-' + panel.text.w + '-' + (panel.style.inclTrackRev != 1 ? this.rev.text : $.strip((this.rev.lfmAlb || this.rev.lfm) + this.rev.am));
				break;
		}
	}

	notifyTags() {
		if (!cfg.notifyTags) return;
		this.currentTrackTags();
	}

	on_playback_new_track(force) {
		if (panel.lock) panel.getList();
		this.notifyTags();
		if (!panel.updateNeeded() && !force) return;
		if (panel.block()) {
			this.get = 1;
			if (!panel.lock) panel.getList(true);
			this.logScrollPos();
			this.albumReset();
			this.artistReset();
		} else {
			if (!panel.lock) panel.getList(true);
			this.logScrollPos();
			this.albumReset();
			this.artistReset();
			this.na = '';
			this.getText(false);
			this.get = 0;
		}
	}

	on_size() {
		if (this.initialise) {
			this.albumReset();
			this.artistReset();
			this.initialise = false;
		}
		this.bio.scrollPos = {};
		this.rev.scrollPos = {};
		this.getText(false);
		panel.getList(true);
		but.refresh();
		this.notifyTags();
	}

	paint() {
		if (!this.repaint) return;
		if (!panel.style.showFilmStrip) window.Repaint();
		else window.RepaintRect(panel.filmStripSize.l, panel.filmStripSize.t, panel.w - panel.filmStripSize.l - panel.filmStripSize.r, panel.h - panel.filmStripSize.t - panel.filmStripSize.b);
	}

	scrollbar_type() {
		return ppt.artistView ? art_scrollbar : alb_scrollbar;
	}

	summaryFirstText(s1, s2, text, s3, rating) {
		if (!text) return text;
		let ix = -1;
		let m = text.match(RegExp(s2, 'gi'));
		let sub1 = '';
		let sub2 = '';
		ix = text.lastIndexOf(s1);
		if (ix != -1) {
			sub1 = text.substring(ix);
			sub1 = sub1.split('\n')[0].trim();
			text = text.replace(RegExp(sub1), '');
			sub1 = sub1.replace(RegExp(s1), '').replace(/, /g, ' \u2219 ');
			let sub1_w = 0;
			$.gr(1, 1, false, g => sub1_w = g.CalcTextWidth(sub1, ui.font.main));
			if (sub1) sub1 += sub1_w < panel.text.w || this.init ? '\r\n' : '  |  ';
		}
		this.init = false;
		if (m) {
			ix = -1;
			m = m[m.length - 1].toString();
			ix = text.lastIndexOf(m);
		}
		if (ix != -1) {
			sub2 = text.substring(ix);
			sub2 = sub2.split('\n')[0].trim();
			text = text.replace(RegExp($.regexEscape(sub2)), '');
			sub2 = sub2.replace(' | ', '  |  ');
			if (sub2 && rating && !s3) sub2 += ('  |  ' + rating);
			if (sub2 && !s3) sub2 += '\r\n';
		}
		if (!s3) {
			text = sub1 + $.titlecase(sub2) + (sub1 || sub2 ? '\r\n' : '') + text;
			return '¦|¦\r\n' + text.trim() + '\r\n¦|¦';
		}
		let sub3 = '';
		let sub4 = '';
		ix = -1;
		m = text.match(RegExp(s3, 'i'));
		if (m) {
			m = m.toString();
			ix = text.lastIndexOf(m);
			if (ix != -1) {
				sub3 = text.substring(ix).replace('\r\n\r\n', ';');
				sub3 = sub3.split(';')[0].trim();
				text = text.replace(RegExp($.regexEscape(sub3) + '; '), '');
				text = text.replace(RegExp($.regexEscape(sub3) + '\r\n\r\n'), '');
			}
		}
		if (sub2 && sub3) sub4 += sub2 + '  |  ' + sub3;
		else sub4 += sub2 + sub3;
		if (sub4) sub4 += '\r\n';
		text = sub1 + $.titlecase(sub4) + (sub1 || sub4 ? '\r\n' : '') + text;
		return '¦|¦\r\n' + text.trim() + '\r\n¦|¦';
	}

	refresh(n) {
		switch (n) {
			case 0:
				filmStrip.logScrollPos();
				panel.setStyle();
				img.clearCache();
				this.albumFlush();
				this.artistFlush();
				this.rev.cur = '';
				this.bio.cur = '';
				this.getText(true);
				img.getImages();
				if (ppt.showFilmStrip && ppt.autoFilm) this.getScrollPos();
				but.setLookUpPos();
				break;
			case 1:
				if (panel.style.inclTrackRev == 1) this.logScrollPos();
				ui.getFont();
				ui.calcText();
				panel.setStyle();
				ui.getColours();
				but.createStars();
				this.albumFlush();
				this.artistFlush();
				if (!ppt.img_only) img.clearCache();
				this.rev.cur = '';
				this.bio.cur = '';
				this.getText(true);
				but.refresh(true);
				img.getImages();
				break;
			case 2:
				if (panel.style.inclTrackRev == 1) this.logScrollPos();
				ui.calcText();
				panel.setStyle();
				if (!ppt.img_only) img.clearCache();
				this.rev.cur = '';
				this.bio.cur = '';
				this.albCalc();
				this.artCalc();
				img.getImages();
				if (ppt.text_only && !ui.style.isBlur) this.paint();
				break;
			case 3:
				if (panel.style.inclTrackRev == 1) ui.getColours();
				ui.getFont();
				panel.setStyle();
				if (!ppt.img_only) img.clearCache();
				this.albumFlush();
				this.getText(false);
				img.getImages();
				break;
			case 4:
				if (panel.style.inclTrackRev == 1) this.logScrollPos();
				ui.getColours();
				ui.getFont();
				panel.setStyle();
				if (!ppt.img_only) img.clearCache();
				this.rev.cur = '';
				this.bio.cur = '';
				this.albCalc();
				this.artCalc();
				img.getImages();
				if (ppt.text_only && !ui.style.isBlur) this.paint();
				break;
			case 5:
				filmStrip.logScrollPos();
				panel.setStyle();
				this.albumFlush();
				this.artistFlush();
				img.clearCache();
				if (panel.stndItem()) {
					this.getText(false);
					img.getImages();
				} else {
					this.getItem(false, panel.art.ix, panel.alb.ix);
					img.getItem(panel.art.ix, panel.alb.ix);
				}
				if (ppt.artistView) {
					this.rev.cur = '';
					this.artCalc();
				} else {
					this.bio.cur = '';
					this.albCalc();
				}
				break;
		}
	}

	toggle(n) {
		const text_state = this.text;
		switch (n) {
			case 0:
				this.logScrollPos();
				ppt.toggle('allmusic_bio');
				if (ppt.allmusic_bio) this.done.amBio = false;
				else this.done.lfmBio = false;
				this.getText(false);
				if (ppt.allmusic_bio != this.bio.allmusic) {
					if (ppt.heading) this.na = ppt.allmusic_bio ? '  [AllMusic N/A]' : '  [Last.fm N/A]';
					else {
						this.na = ppt.allmusic_bio ? 'AllMusic N/A' : 'Last.fm N/A';
						this.paint();
					}
					timer.clear(timer.source);
					timer.source.id = setTimeout(() => {
						this.na = '';
						this.paint();
						timer.source.id = null;
					}, 5000);
				} else this.na = '';
				this.getScrollPos();
				if (!ppt.img_only && !ppt.text_only && this.text != text_state) img.clearCache();
				img.getImages();
				break;
			case 1:
				this.logScrollPos();
				ppt.toggle('allmusic_alb');
				if (ppt.allmusic_alb) this.done.amRev = false;
				else this.done.lfmRev = false;
				this.getText(false);
				if (ppt.allmusic_alb != this.rev.allmusic) {
					if (ppt.heading) this.na = ppt.allmusic_alb ? '  [AllMusic N/A]' : '  [Last.fm N/A]';
					else {
						this.na = ppt.allmusic_alb ? 'AllMusic N/A' : 'Last.fm N/A';
						this.paint();
					}
					timer.clear(timer.source);
					timer.source.id = setTimeout(() => {
						this.na = '';
						this.paint();
						timer.source.id = null;
					}, 5000);
				} else this.na = '';
				this.getScrollPos();
				if (!ppt.img_only && !ppt.text_only && this.text != text_state) img.clearCache();
				img.getImages();
				break;
			case 2:
				ppt.toggle('lockBio');
				if (ppt.allmusic_bio) this.done.amBio = false;
				else this.done.lfmBio = false;
				this.getText(false);
				img.clearCache();
				img.getImages();
				but.check();
				break;
			case 3:
				ppt.toggle('lockRev');
				if (ppt.allmusic_alb) this.done.amRev = false;
				else this.done.lfmRev = false;
				this.getText(false);
				img.clearCache();
				img.getImages();
				but.check();
				break;
			case 4:
				ppt.toggle('bothBio');
				this.done.amBio = false;
				this.done.lfmBio = false;
				this.getText(true);
				img.clearCache();
				img.getImages();
				but.check();
				break;
			case 5:
				ppt.toggle('bothRev');
				this.albumFlush();
				this.getText(true);
				img.clearCache();
				img.getImages();
				but.check();
				break;
			case 6:
				this.logScrollPos();
				ppt.toggle('allmusic_bio');
				this.done.amBio = false;
				this.done.lfmBio = false;
				this.getText(1);
				if (ppt.allmusic_bio != this.bio.allmusic) {
					if (ppt.heading) this.na = ppt.allmusic_bio ? '  [AllMusic N/A]' : '  [Last.fm N/A]';
					else {
						this.na = ppt.allmusic_bio ? 'AllMusic N/A' : 'Last.fm N/A';
						this.paint();
					}
					timer.clear(timer.source);
					timer.source.id = setTimeout(() => {
						this.na = '';
						this.paint();
						timer.source.id = null;
					}, 5000);
				} else this.na = '';
				this.getScrollPos();
				if (!ppt.img_only && !ppt.text_only && this.text != text_state) img.clearCache();
				img.getImages();
				break;
			case 7:
				this.logScrollPos();
				ppt.toggle('allmusic_alb');
				this.done.amRev = false;
				this.done.lfmRev = false;
				this.getText(2);
				if (ppt.allmusic_alb != this.rev.allmusic) {
					if (ppt.heading) this.na = ppt.allmusic_alb ? '  [AllMusic N/A]' : '  [Last.fm N/A]';
					else {
						this.na = ppt.allmusic_alb ? 'AllMusic N/A' : 'Last.fm N/A';
						this.paint();
					}
					timer.clear(timer.source);
					timer.source.id = setTimeout(() => {
						this.na = '';
						this.paint();
						timer.source.id = null;
					}, 5000);
				} else this.na = '';
				this.getScrollPos();
				if (!ppt.img_only && !ppt.text_only && this.text != text_state) img.clearCache();
				img.getImages();
				break;
		}
	}

	tf(n, artistView, trackreview) {
		if (!n) return '';
		if (panel.lock) n = n.replace(/%artist%|\$meta\(artist,0\)/g, '#¦#¦#%artist%#¦#¦#').replace(/%title%|\$meta\(title,0\)/g, '#!#!#%title%#!#!#');
		let a = $.tfEscape(artistView ? this.artist : (!trackreview ? (panel.alb.ix ? this.albumartist : this.artist) : this.trackartist));
		let aa = $.tfEscape(artistView ? (panel.art.ix ? this.artist : this.albumartist) : (!trackreview ? this.albumartist : this.trackartist));
		let l = $.tfEscape(this.album.replace('Album Unknown', ''));
		let tr = $.tfEscape(this.track);
		n = n.replace(/%lookup_item%/gi, panel.simTagTopLookUp() ? '$&#@!%path%#@!' : '$&');
		n = n.replace(/((\$if|\$and|\$or|\$not|\$xor)(|\d)\(|\[)[^$%]*%bio_artist%/gi, a ? '$&#@!%path%#@!' : '$&').replace(/%bio_artist%/gi, a).replace(/((\$if|\$and|\$or|\$not|\$xor)(|\d)\(|\[)[^$%]*%bio_albumartist%/gi, aa ? '$&#@!%path%#@!' : '$&').replace(/%bio_albumartist%/gi, aa).replace(/((\$if|\$and|\$or|\$not|\$xor)(|\d)\(|\[)[^$%]*%bio_album%/gi, l ? '$&#@!%path%#@!' : '$&').replace(/%bio_album%/gi, l).replace(/((\$if|\$and|\$or|\$not|\$xor)(|\d)\(|\[)[^$%]*%bio_title%/gi, tr ? '$&#@!%path%#@!' : '$&').replace(/%bio_title%/gi, tr);
		n = $.eval(n, ppt.focus);
		if (panel.lock) n = n.replace(/#¦#¦#.*?#¦#¦#/g, this.trackartist).replace(/#!#!#.*?#!#!#/g, this.track);
		n = n.replace(/#@!.*?#@!/g, '') || 'No Selection';
		return n;
	}

	updText() {
		this.getText(false, true);
		img.getArtImg();
		img.getFbImg();
		this.textUpdate = 0;
		this.done.amBio = this.done.lfmBio = this.done.amRev = this.done.lfmRev = false;
	}
	updTrackSubHead() {
		if (ppt.artistView || panel.style.inclTrackRev != 2 || this.rev.checkedTrackSubHead || !this.rev.trackHeading || !ppt.bothRev || !this.rev.am) return false;
		this.mod.amRev = this.rev.am = this.rev.lfm = this.mod.lfmRev = '';
		this.mod.curAmRev = this.mod.curLfmRev = '1';
		this.done.amRev = this.done.lfmRev = false;
		this.rev.checkedTrackSubHead = true;
		return true;
	}
}