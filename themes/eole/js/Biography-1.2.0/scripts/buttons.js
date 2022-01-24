class Buttons {
	constructor() {
		this.alpha = 255;
		this.btns = {};
		this.cur = null;
		this.Dn = false;
		this.transition

		this.lookUp = {
			baseSize: 15 * $.scale,
			col: $.toRGB(ui.col.text),
			img: null,
			imgLock: null,
			pos: 1,
			x: 0,
			y: 0,
			w: 12,
			h: 12,
			sz: 12
		}

		this.rating = {
			h1: 0,
			h2: 0,
			images: [],
			scale: 2,
			show: false,
			w1: 30,
			w2: 30
		}

		this.scr = {
			albBtns: ['alb_scrollDn', 'alb_scrollUp'],
			artBtns: ['art_scrollDn', 'art_scrollUp'],
			img: null,
			iconFontName: 'Segoe UI Symbol',
			iconFontStyle: 0,
			init: true,
			pad: $.clamp(ppt.sbarButPad / 100, -0.5, 0.3)
		}

		this.src = {
			amBio: '',
			amlfmBio: '',
			amlfmRev: '',
			amRev: '',
			allmusic: 0,
			bahn: 'Bahnschrift SemiBold SemiConden',
			bahnInstalled: utils.CheckFont('Bahnschrift SemiBold SemiConden'),
			col: {},
			font: gdi.Font('Segoe UI Symbol', 12, 1),
			fontSize: 12,
			h: 19,
			icon: false,
			item_w: {
				amBio: 30,
				amlfmBio: 30,
				amlfmRev: 30,
				amRev: 30,
				lfmBio: 30,
				lfmRev: 30,
				space: 4,
				spaceIconFont: 4,
				splitter: 8
			},
			lfmamBio: '',
			lfmamRev: '',
			lfmBio: '',
			lfmRev: '',
			pxShift: false,
			name: '',
			name_w: 40,
			text: false,
			space: ' ',
			visible: false,
			w: 50,
			x: 0,
			y: 0
		}

		this.tooltip = {
			show: true,
			start: Date.now() - 2000
		}

		this.lookUp.zoomSize = Math.max(Math.round(this.lookUp.baseSize * ppt.zoomLookUpBtn / 100), 7);
		this.lookUp.scale = Math.round(this.lookUp.zoomSize / this.lookUp.baseSize * 100);
		this.lookUp.font = gdi.Font('FontAwesome', 15 * this.lookUp.scale / 100, 0);
		this.lookUp.fontLock = gdi.Font('FontAwesome', 14 * this.lookUp.scale / 100, 0);

		this.scr.btns = this.scr.albBtns.concat(this.scr.artBtns);
		this.src.iconFont = this.src.font;
		if (ui.stars == 1 && ui.show.btnRedLastfm) this.rating.imagesLfm = [];

		ppt.zoomLookUpBtn = this.lookUp.scale;

		this.setSbarIcon();
		this.setTooltipFont();
		this.createImages('all');
	}

	// Methods

	check(refresh) {
		if (!refresh) {
			ppt.sbarShow != 1 || !this.scr.init ? this.setScrollBtnsHide() : this.setScrollBtnsHide(true, 'both');
			this.setSrcBtnHide();
		}
		if (!this.btns.heading || !ppt.heading) return;
		this.src.allmusic = ppt.artistView && txt.bio.allmusic || !ppt.artistView && txt.rev.allmusic ? 1 : 0;
		this.rating.show = ui.stars == 1 && !ppt.artistView && (txt.rev.allmusic && (!txt.rev.both ? txt.rating.am != -1 : txt.rating.avg != -1) || !txt.rev.allmusic && (!txt.rev.both ? txt.rating.lfm != -1 : txt.rating.avg != -1));
		this.src.name = ui.show.btnBg ? ' ' : '';
		switch (this.src.allmusic) {
			case 0:
				switch (true) {
					case !ppt.artistView:
						this.src.name += !txt.rev.both ? this.src.lfmRev : this.src.lfmamRev;
						break;
					case ppt.artistView:
						this.src.name += !txt.bio.both ? this.src.lfmBio : this.src.lfmamBio;
						break;
				}
				break;
			case 1:
				switch (true) {
					case !ppt.artistView:
						this.src.name += !txt.rev.both ? this.src.amRev : this.src.amlfmRev;
						break;
					case ppt.artistView:
						this.src.name += !txt.bio.both ? this.src.amBio : this.src.amlfmBio;
						break;
				}
				break;
		}
		this.src.name += ui.show.btnBg || this.rating.show ? ' ' : '';
		this.src.text = this.src.icon || this.src.name.trim().length ? true : false;
		this.src.visible = ppt.hdBtnShow && (this.rating.show || this.src.text) && ppt.hdPos != 2;
		if (!this.src.visible) this.src.w = 0;
		else {
			this.src.name_w = 0;
			if (this.rating.show) this.src.name_w = txt.rev.allmusic ? (!txt.rev.both ? this.src.item_w.amRev : this.src.item_w.amlfmRev) : (!txt.rev.both ? this.src.item_w.lfmRev : this.src.item_w.amlfmRev);
			this.src.name_w = this.src.name_w + this.src.item_w.space * (ui.show.btnBg ? (this.src.name_w ? 2 : 1) : 0);
			this.src.w = 0;
			switch (true) {
				case this.rating.show:
					this.src.w = this.src.name_w + this.rating.w2 + (this.src.text || ui.show.btnBg ? this.src.item_w.space : 0);
					break;
				case this.src.text:
					switch (true) {
						case !ppt.artistView:
							this.src.w = txt.rev.allmusic ? (!txt.rev.both ? this.src.item_w.amRev : this.src.item_w.amlfmRev) : (!txt.rev.both ? this.src.item_w.lfmRev : this.src.item_w.amlfmRev);
							break;
						case ppt.artistView:
							this.src.w = txt.bio.allmusic ? (!txt.bio.both ? this.src.item_w.amBio : this.src.item_w.amlfmBio) : (!txt.bio.both ? this.src.item_w.lfmBio : this.src.item_w.amlfmBio);
							break
					}
					this.src.w += this.src.item_w.space * (ui.show.btnBg ? 2 : 0);
					break;
			}
			if (!ui.show.btnBg) this.src.name_w += this.src.item_w.space * (this.src.text ? 2 : 0);
		}
	}

	checkScrollBtns(x, y, hover_btn) {
		const arr = alb_scrollbar.timer_but ? this.scr.albBtns : art_scrollbar.timer_but ? this.scr.artBtns : false;
		if (arr) {
			if ((this.btns[arr[0]].down || this.btns[arr[1]].down) && !this.btns[arr[0]].trace(x, y) && !this.btns[arr[1]].trace(x, y)) {
				this.btns[arr[0]].cs('normal');
				this.btns[arr[1]].cs('normal');
				if (alb_scrollbar.timer_but) {
					clearTimeout(alb_scrollbar.timer_but);
					alb_scrollbar.timer_but = null;
					alb_scrollbar.count = -1;
				}
				if (art_scrollbar.timer_but) {
					clearTimeout(art_scrollbar.timer_but);
					art_scrollbar.timer_but = null;
					art_scrollbar.count = -1;
				}
			}
		} else if (hover_btn) this.scr.btns.forEach(v => {
			if (hover_btn.name == v && hover_btn.down) {
				this.btns[v].cs('down');
				hover_btn.l_dn();
			}
		});
	}

	clear() {
		this.Dn = false;
		Object.values(this.btns).forEach(v => v.down = false);
	}

	clearTooltip() {
		if (!tooltip.Text || !this.btns['lookUp'].tt) return;
		this.btns['lookUp'].tt.stop();
	}

	createImages(n) {
		if (n == 'all') {
			const sz = this.scr.arrow == 0 ? Math.max(Math.round(ui.sbar.but_h * 1.666667), 1) : 100;
			const sc = sz / 100;
			const iconFont = gdi.Font(this.scr.iconFontName, sz, this.scr.iconFontStyle);
			this.alpha = !ui.sbar.col ? [75, 192, 228] : [68, 153, 255];
			const hovAlpha = (!ui.sbar.col ? 75 : (!ui.sbar.type ? 68 : 51)) * 0.4;
			this.scr.hover = !ui.sbar.col ? RGBA(ui.col.t, ui.col.t, ui.col.t, hovAlpha) : ui.col.text & RGBA(255, 255, 255, hovAlpha);
			this.scr.img = $.gr(sz, sz, true, g => {
				g.SetTextRenderingHint(3);
				g.SetSmoothingMode(2);
				if (ppt.sbarCol) {
					this.scr.arrow == 0 ? g.FillPolygon(ui.col.text, 1, [50 * sc, 0, 100 * sc, 76 * sc, 0, 76 * sc]) : g.DrawString(this.scr.arrow, iconFont, ui.col.text, 0, sz * this.scr.pad, sz, sz, StringFormat(1, 1));
				} else {
					this.scr.arrow == 0 ? g.FillPolygon(RGBA(ui.col.t, ui.col.t, ui.col.t, 255), 1, [50 * sc, 0, 100 * sc, 76 * sc, 0, 76 * sc]) : g.DrawString(this.scr.arrow, iconFont, RGBA(ui.col.t, ui.col.t, ui.col.t, 255), 0, sz * this.scr.pad, sz, sz, StringFormat(1, 1));
				}
				g.SetSmoothingMode(0);
			});
		}
		if (n == 'all' || n == 'lookUp') {
			this.lookUp.col = $.toRGB(ui.col.text);
			$.gr(1, 1, true, g => {
				this.lookUp.sz = Math.max(g.CalcTextWidth('\uF107', this.lookUp.font), g.CalcTextWidth('\uF023', this.lookUp.fontLock), g.CalcTextHeight('\uF107', this.lookUp.font), g.CalcTextHeight('\uF023', this.lookUp.fontLock));
			});
		}
	}

	createStars() {
		this.src.icon = ui.show.btnLabel == 2 ? 1 : 0;
		const hs = ui.font.heading.Size;
		const fs = ui.stars != 1 ? (this.src.icon ? (this.src.bahnInstalled ? 12 : 11) : 10) * $.scale : 12 * $.scale;
		this.src.fontSize = $.clamp(Math.round(hs * 0.47) + (ppt.zoomHeadBtn - 100) / 10, Math.min(fs, hs), Math.max(fs, hs));
		this.src.font = gdi.Font('Segoe UI', this.src.fontSize, 1);
		$.gr(1, 1, false, g => {
			this.src.h = g.CalcTextHeight('allmusic', this.src.font);
		});
		switch (this.src.icon) {
			case 0:
				this.src.amBio = ppt.amBioBtn;
				this.src.amRev = ppt.amRevBtn;
				this.src.lfmBio = ppt.lfmBioBtn;
				this.src.lfmRev = ppt.lfmRevBtn;
				this.src.amlfmBio = '';
				this.src.amlfmRev = '';
				this.src.lfmamBio = '';
				this.src.lfmamRev = '';
				if (!ui.show.btnLabel) {
					this.src.amBio = '';
					this.src.amRev = '';
					this.src.lfmBio = '';
					this.src.lfmRev = '';
				} else {
					this.src.amlfmBio = this.src.amBio + ' | ' + this.src.lfmBio;
					this.src.amlfmRev = this.src.amRev + ' | ' + this.src.lfmRev;
					this.src.lfmamBio = this.src.lfmBio + ' | ' + this.src.amBio;
					this.src.lfmamRev = this.src.lfmRev + ' | ' + this.src.amRev;
				}
				$.gr(1, 1, false, g => {
					['space', 'amRev', 'lfmRev', 'amBio', 'lfmBio', 'amlfmRev', 'amlfmBio'].forEach(v => this.src.item_w[v] = g.CalcTextWidth(this.src[v], this.src.font))
				});
				break;
			case 1: {
				this.src.amBio = this.src.amRev = 'allmusic';
				this.src.lfmBio = this.src.lfmRev = '\uF202';
				this.src.font = gdi.Font(this.src.bahnInstalled ? this.src.bahn : 'Segoe UI Semibold', this.src.fontSize, 0);
				this.src.iconFont = gdi.Font('FontAwesome', Math.round(this.src.fontSize * (this.src.bahnInstalled ? 1.09 : 1.16)), 0);
				const alt_w = [];
				alt_w[5] = '0';
				alt_w[6] = '0';
				alt_w[7] = ' | ';
				alt_w[8] = ' ';
				const fonts = [this.src.font, this.src.font, this.src.iconFont, this.src.font, this.src.iconFont, this.src.font, this.src.font, this.src.font, this.src.iconFont];
				$.gr(1, 1, false, g => {
					['space', 'amRev', 'lfmRev', 'amBio', 'lfmBio', 'amlfmRev', 'amlfmBio', 'splitter', 'spaceIconFont'].forEach((v, i) => this.src.item_w[v] = g.CalcTextWidth(i < 5 ? this.src[v] : alt_w[i], fonts[i]))
				});
				this.src.item_w.space = Math.max(this.src.item_w.space, this.src.item_w.spaceIconFont);
				this.src.item_w.amlfmRev = this.src.item_w.amRev + this.src.item_w.splitter + this.src.item_w.lfmRev;
				this.src.item_w.amlfmBio = this.src.item_w.amBio + this.src.item_w.splitter + this.src.item_w.lfmBio;
				this.src.y = this.src.fontSize > 11 ? 0 : 1;
				break;
			}
		}
		this.rating.images = [];
		if (ui.stars == 1 && ui.show.btnRedLastfm) this.rating.imagesLfm = [];
		if (ui.stars == 1) this.setRatingImages(Math.round(this.src.h / 1.5) * 5, Math.round(this.src.h / 1.5), ui.col.starOn, ui.col.starOff, ui.col.starBor, false);
		else if (ui.stars == 2) {
			this.setRatingImages(Math.round(ui.font.main_h / 1.75) * 5, Math.round(ui.font.main_h / 1.75), ui.col.starOn, ui.col.starOff, ui.col.starBor, false);
		}
		if (ui.stars == 1 && ui.show.btnRedLastfm) this.setRatingImages(Math.round(this.src.h / 1.5) * 5, Math.round(this.src.h / 1.5), RGBA(225, 225, 245, 255), RGB(225, 225, 245, 60), ui.col.starBor, true);

		this.src.pxShift = /[gjpqy]/.test(this.src.amRev + this.src.lfmRev + this.src.amBio + this.src.lfmBio);
	}

	draw(gr) {
		Object.values(this.btns).forEach(v => {
			if (!v.hide) v.draw(gr);
		});
	}

	drawPolyStar(gr, x, y, out_radius, in_radius, points, line_thickness, line_color, fill_color) {
		const point_arr = [];
		let rr = 0;
		for (let i = 0; i != points; i++) {
			i % 2 ? rr = Math.round((out_radius - line_thickness * 4) / 2) / in_radius : rr = Math.round((out_radius - line_thickness * 4) / 2);
			const x_point = Math.floor(rr * Math.cos(Math.PI * i / points * 2 - Math.PI / 2));
			const y_point = Math.ceil(rr * Math.sin(Math.PI * i / points * 2 - Math.PI / 2));
			point_arr.push(x_point + out_radius / 2);
			point_arr.push(y_point + out_radius / 2);
		}
		const img = $.gr(out_radius, out_radius, true, g => {
			g.SetSmoothingMode(2);
			g.FillPolygon(fill_color, 1, point_arr);
			if (line_thickness > 0) g.DrawPolygon(line_color, line_thickness, point_arr);
		});
		gr.DrawImage(img, x, y, out_radius, out_radius, 0, 0, out_radius, out_radius);
	}

	lbtn_dn(x, y) {
		this.move(x, y);
		if (!this.cur || this.cur.hide) {
			this.Dn = false;
			return false
		} else this.Dn = this.cur.name;
		this.cur.down = true;
		this.cur.cs('down');
		this.cur.lbtn_dn(x, y);
		return true;
	}

	lbtn_up(x, y) {
		if (!this.cur || this.cur.hide || this.Dn != this.cur.name) {
			this.clear();
			return false;
		}
		this.clear();
		if (this.cur.trace(x, y)) this.cur.cs('hover');
		this.cur.lbtn_up(x, y);
		return true;
	}

	leave() {
		if (this.cur) {
			this.cur.cs('normal');
			if (!this.cur.hide) this.transition.start();
		}
		this.cur = null;
	}

	move(x, y) {
		const hover_btn = Object.values(this.btns).find(v => {
			if (!this.Dn || this.Dn == v.name) return v.trace(x, y);
		});
		let hand = false;
		this.scr.init = false;
		this.checkScrollBtns(x, y, hover_btn);
		if (hover_btn) hand = hover_btn.hand;
		if (!resize.down) window.SetCursor(!hand && !seeker.hand && !filmStrip.hand ? 32512 : 32649);
		if (hover_btn && hover_btn.hide) {
			if (this.cur) {
				this.cur.cs('normal');
				this.transition.start();
			}
			this.cur = null;
			return null;
		} // btn hidden, ignore
		if (this.cur === hover_btn) return this.cur;
		if (this.cur) {
			this.cur.cs('normal');
			this.transition.start();
		} // return prev btn to normal state
		if (hover_btn && !(hover_btn.down && hover_btn.type < 6)) {
			hover_btn.cs('hover');
			if (this.tooltip.show && hover_btn.tiptext) hover_btn.tt.show(hover_btn.tiptext());
			this.transition.start();
		}
		this.cur = hover_btn;
		return this.cur;
	}

	on_script_unload() {
		this.tt('');
	}
	
	setLookUpPos() {
		this.lookUp.pos = ppt.hdLine == 2 && ppt.hdPos == 2 ? 0 : ui.sbar.type < panel.sbar.style || !ppt.text_only ? ppt.lookUp : 0;
		this.lookUp.x = [0, 1 * $.scale, (!txt.head || ppt.img_only ? panel.w - 1 * $.scale - this.lookUp.sz - 1 : panel.heading.x + panel.heading.w - this.lookUp.sz) - 9 * $.scale][this.lookUp.pos];
		this.lookUp.y = [0, 0, !txt.head || ppt.img_only ? 0 : panel.text.t - ui.heading.h + (ui.font.heading_h - this.lookUp.sz) / 2][this.lookUp.pos];
		this.lookUp.w = [12, this.lookUp.sz * 1.5, this.lookUp.sz + 9 * $.scale][this.lookUp.pos];
		this.lookUp.h = [12, this.lookUp.sz * 1.5, Math.max(ui.font.heading_h, this.lookUp.sz)][this.lookUp.pos];
		this.lookUp.p1 = [12, this.lookUp.sz + 1, this.lookUp.sz + 1 + 9 * $.scale][this.lookUp.pos];
		this.lookUp.p2 = this.lookUp.sz + 1;
	}

	refresh(upd) {
		if (upd) {
			this.scr.x1 = panel.sbar.x;
			this.scr.yUp1 = Math.round(panel.sbar.y);
			this.scr.yDn1 = Math.round(panel.sbar.y + panel.sbar.h - ui.sbar.but_h);
			if (ui.sbar.type < 2) {
				this.scr.x1 -= 1;
				this.scr.x2 = (ui.sbar.but_h - ui.sbar.but_w) / 2;
				this.scr.yUp2 = -ui.sbar.arrowPad + this.scr.yUp1 + (ui.sbar.but_h - 1 - ui.sbar.but_w) / 2;
				this.scr.yDn2 = ui.sbar.arrowPad + this.scr.yDn1 + (ui.sbar.but_h - 1 - ui.sbar.but_w) / 2;
			}
			this.setLookUpPos();
		}
		if (ppt.heading) {
			this.check();
			this.btns.heading = new Btn(panel.heading.x, panel.text.t - ui.heading.h, panel.heading.w - (this.lookUp.pos == 2 ? this.lookUp.sz + 10 * $.scale : 0), ui.font.heading_h, 6, $.clamp(Math.round(panel.text.t - ui.heading.h + (ui.font.heading_h - this.src.h) / 2 + ppt.hdBtnPad), panel.text.t - ui.heading.h, panel.text.t - ui.heading.h + ui.font.heading_h - this.src.h), '', '', '', !txt.head || ppt.img_only, '', () => {
				txt.toggle(ppt.artistView ? (!ppt.bothBio ? 0 : 6) : (!ppt.bothRev ? 1 : 7));
				this.check(true);
				if (ui.style.isBlur) window.Repaint();
			}, () => this.srcTiptext(), true, 'heading');
			this.src.col = {
				normal: this.src.allmusic || (!ui.show.btnRedLastfm || ui.show.btnRedLastfm && !ui.show.btnBg) ? ui.style.bg || !ui.style.bg && !ui.style.trans || ui.blur.dark || ui.blur.light ? ui.col.btn : RGB(255, 255, 255) : RGB(225, 225, 245),
				hover: this.src.allmusic || (!ui.show.btnRedLastfm || ui.show.btnRedLastfm && !ui.show.btnBg) ? ui.style.bg || !ui.style.bg && !ui.style.trans || ui.blur.dark || ui.blur.light ? ui.col.text_h : RGB(255, 255, 255) : RGB(225, 225, 245)
			};
		} else delete this.btns.heading;
		if (ppt.lookUp) {
			this.btns.lookUp = new Btn(this.lookUp.x, this.lookUp.y, this.lookUp.w, this.lookUp.h, 7, this.lookUp.p1, this.lookUp.p2, '', {
				normal: RGBA(this.lookUp.col[0], this.lookUp.col[1], this.lookUp.col[2], this.lookUp.pos == 2 ? 100 : 50),
				hover: RGBA(this.lookUp.col[0], this.lookUp.col[1], this.lookUp.col[2], this.lookUp.pos == 2 ? 200 : this.alpha[1])
			}, !ppt.lookUp, '', () => men.buttonMenu(this.lookUp.x + this.lookUp.w, this.lookUp.y + this.lookUp.h), () => 'Click: look up...\r\nMiddle click: ' + (!panel.lock ? 'lock: stop track change updates' : 'Unlock') + '...', true, 'lookUp');
		} else delete this.btns.lookUp;
		if (ppt.sbarShow) {
			switch (ui.sbar.type) {
				case 2:
					this.btns.alb_scrollUp = new Btn(this.scr.x1, this.scr.yUp1, ui.sbar.but_h, ui.sbar.but_h, 5, '', '', '', {
						normal: 1,
						hover: 2,
						down: 3
					}, ppt.sbarShow == 1 && alb_scrollbar.narrow.show || !this.scrollAlb(), () => alb_scrollbar.but(1), '', '', false, 'alb_scrollUp');
					this.btns.alb_scrollDn = new Btn(this.scr.x1, this.scr.yDn1, ui.sbar.but_h, ui.sbar.but_h, 5, '', '', '', {
						normal: 5,
						hover: 6,
						down: 7
					}, ppt.sbarShow == 1 && alb_scrollbar.narrow.show || !this.scrollAlb(), () => alb_scrollbar.but(-1), '', '', false, 'alb_scrollDn');
					this.btns.art_scrollUp = new Btn(this.scr.x1, this.scr.yUp1, ui.sbar.but_h, ui.sbar.but_h, 5, '', '', '', {
						normal: 1,
						hover: 2,
						down: 3
					}, ppt.sbarShow == 1 && art_scrollbar.narrow.show || !this.scrollArt(), () => art_scrollbar.but(1), '', '', false, 'art_scrollUp');
					this.btns.art_scrollDn = new Btn(this.scr.x1, this.scr.yDn1, ui.sbar.but_h, ui.sbar.but_h, 5, '', '', '', {
						normal: 5,
						hover: 6,
						down: 7
					}, ppt.sbarShow == 1 && art_scrollbar.narrow.show || !this.scrollArt(), () => art_scrollbar.but(-1), '', '', false, 'art_scrollDn');
					break;
				default:
					this.btns.alb_scrollUp = new Btn(this.scr.x1, this.scr.yUp1 - panel.sbar.top_corr, ui.sbar.but_h, ui.sbar.but_h + panel.sbar.top_corr, 1, this.scr.x2, this.scr.yUp2, ui.sbar.but_w, '', ppt.sbarShow == 1 && alb_scrollbar.narrow.show || !this.scrollAlb(), () => alb_scrollbar.but(1), '', '', false, 'alb_scrollUp');
					this.btns.alb_scrollDn = new Btn(this.scr.x1, this.scr.yDn1, ui.sbar.but_h, ui.sbar.but_h + panel.sbar.top_corr, 2, this.scr.x2, this.scr.yDn2, ui.sbar.but_w, '', ppt.sbarShow == 1 && alb_scrollbar.narrow.show || !this.scrollAlb(), () => alb_scrollbar.but(-1), '', '', false, 'alb_scrollDn');
					this.btns.art_scrollUp = new Btn(this.scr.x1, this.scr.yUp1 - panel.sbar.top_corr, ui.sbar.but_h, ui.sbar.but_h + panel.sbar.top_corr, 3, this.scr.x2, this.scr.yUp2, ui.sbar.but_w, '', ppt.sbarShow == 1 && art_scrollbar.narrow.show || !this.scrollArt(), () => art_scrollbar.but(1), '', '', false, 'art_scrollUp');
					this.btns.art_scrollDn = new Btn(this.scr.x1, this.scr.yDn1, ui.sbar.but_h, ui.sbar.but_h + panel.sbar.top_corr, 4, this.scr.x2, this.scr.yDn2, ui.sbar.but_w, '', ppt.sbarShow == 1 && art_scrollbar.narrow.show || !this.scrollArt(), () => art_scrollbar.but(-1), '', '', false, 'art_scrollDn');
					break;
			}
		}
		this.transition = new Transition(this.btns, v => v.state !== 'normal');
	}

	reset() {
		this.transition.stop();
	}

	resetZoom() {
		ppt.zoomFont = 100;
		ppt.zoomHead = 115;
		this.lookUp.zoomSize = this.lookUp.baseSize;
		this.lookUp.scale = ppt.zoomLookUpBtn = 100;
		this.lookUp.font = gdi.Font('FontAwesome', 15 * this.lookUp.scale / 100, 0);
		this.lookUp.fontLock = gdi.Font('FontAwesome', 14 * this.lookUp.scale / 100, 0);
		ppt.zoomHeadBtn = 100;
		ppt.zoomTooltip = 100;
		ui.getFont();
		this.createStars();
		this.createImages('lookUp');
		this.setTooltipFont();
		this.refresh(true);
		txt.refresh(4);
	}

	scrollAlb() {
		return ppt.sbarShow && !ppt.artistView && !ppt.img_only && txt.rev.text && alb_scrollbar.scrollable_lines > 0 && alb_scrollbar.active && !alb_scrollbar.narrow.show;
	}

	scrollArt() {
		return ppt.sbarShow && ppt.artistView && !ppt.img_only && txt.bio.text && art_scrollbar.scrollable_lines > 0 && art_scrollbar.active && !art_scrollbar.narrow.show;
	}

	setSrcBtnHide() {
		const o = this.btns.heading;
		if (o) o.hide = !txt.head || ppt.img_only;
	}

	setRatingImages(w, h, onCol, offCol, borCol, lfm) {
		if (this.src.icon && ui.stars == 1) onCol = onCol & 0xe0ffffff;
		w = w * this.rating.scale;
		h = h * this.rating.scale;
		const star_indent = 2;
		let img = null;
		let real_rating = -1;
		let star_height = h;
		let star_padding = -1;
		let star_size = h;
		while (star_padding <= 0) {
			star_size = star_height;
			star_padding = Math.round((w - 5 * star_size) / 4);
			star_height--;
		}
		const star_vpadding = star_height < h ? Math.floor((h - star_height) / 2) : 0;
		for (let rating = 0; rating < 11; rating++) {
			real_rating = rating / 2;
			if (Math.round(real_rating) != real_rating) {
				const img_off = $.gr(w, h, true, g => {
					for (let i = 0; i < 5; i++) this.drawPolyStar(g, i * (star_size + star_padding), star_vpadding, star_size, star_indent, 10, 0, borCol, offCol);
				});
				const img_on = $.gr(w, h, true, g => {
					for (let i = 0; i < 5; i++) this.drawPolyStar(g, i * (star_size + star_padding), star_vpadding, star_size, star_indent, 10, 0, borCol, onCol);
				});
				const half_mask_left = $.gr(w, h, true, g => {
					g.FillSolidRect(0, 0, w, h, RGBA(255, 255, 255, 255));
					g.FillSolidRect(0, 0, Math.round(w * rating / 10), h, RGBA(0, 0, 0, 255));
				});
				const half_mask_right = $.gr(w, h, true, g => {
					g.FillSolidRect(0, 0, w, h, RGBA(255, 255, 255, 255));
					g.FillSolidRect(Math.round(w * rating / 10), 0, w - Math.round(w * rating / 10), h, RGBA(0, 0, 0, 255));
				});
				img_on.ApplyMask(half_mask_left);
				img_off.ApplyMask(half_mask_right);
				img = $.gr(w, h, true, g => {
					g.DrawImage(img_off, 0, 0, w, h, 0, 0, w, h);
					g.DrawImage(img_on, 0, 0, w, h, 0, 0, w, h);
				});
			} else img = $.gr(w, h, true, g => {
				for (let i = 0; i < 5; i++) this.drawPolyStar(g, i * (star_size + star_padding), star_vpadding, star_size, star_indent, 10, 0, borCol, i < real_rating ? onCol : offCol);
			});
			!lfm ? this.rating.images[rating] = img : this.rating.imagesLfm[rating] = img;
		}
		if (!lfm) {
			this.rating.w1 = this.rating.images[10].Width;
			this.rating.w2 = this.rating.w1 / this.rating.scale;
			this.rating.h1 = this.rating.images[10].Height;
			this.rating.h2 = this.rating.h1 / this.rating.scale;
		}
	}

	setSbarIcon() {
		switch (ppt.sbarButType) {
			case 0:
				this.scr.iconFontName = 'Segoe UI Symbol';
				this.scr.iconFontStyle = 0;
				if (!ui.sbar.type) {
					this.scr.arrow = ui.sbar.but_w < Math.round(14 * $.scale) ? '\uE018' : '\uE0A0';
					this.scr.pad = ui.sbar.but_w < Math.round(15 * $.scale) ? -0.3 : -0.22;
				} else {
					this.scr.arrow = ui.sbar.but_w < Math.round(14 * $.scale) ? '\uE018' : '\uE0A0';
					this.scr.pad = ui.sbar.but_w < Math.round(14 * $.scale) ? -0.26 : -0.22;
				}
				break;
			case 1:
				this.scr.arrow = 0;
				break;
			case 2:
				this.scr.iconFontName = ppt.butCustIconFont;
				this.scr.iconFontStyle = 0;
				this.scr.arrow = ppt.arrowSymbol.charAt().trim();
				if (!this.scr.arrow.length) this.scr.arrow = 0;
				this.scr.pad = $.clamp(ppt.sbarButPad / 100, -0.5, 0.3);
				break;
		}
	}

	setScrollBtnsHide(set, autoHide) {
		if (autoHide) {
			const arr = autoHide == 'both' ? this.scr.btns : autoHide == 'alb' ? this.scr.albBtns : this.scr.artBtns;
			arr.forEach(v => {
				if (this.btns[v]) this.btns[v].hide = set;
			});
			txt.paint();
		} else {
			if (!ppt.sbarShow && !set) return;
			this.scr.btns.forEach((v, i) => {
				if (this.btns[v]) this.btns[v].hide = i < 2 ? !this.scrollAlb() : !this.scrollArt();
			});
		}
	}

	setSrcFontSize(step) {
		this.src.fontSize += step;
		const fs = ui.stars != 1 ? (this.src.icon ? (this.src.bahnInstalled ? 12 : 11) : 10) * $.scale : 12 * $.scale;
		const hs = ui.font.heading.Size;
		this.src.fontSize = $.clamp(this.src.fontSize, Math.min(fs, hs), Math.max(fs, hs));
		ppt.zoomHeadBtn = (this.src.fontSize - Math.round(ui.font.heading.Size * 0.47)) * 10 + 100;
	}

	setTooltipFont() {
		tooltip.SetFont('Segoe UI', 15 * $.scale * ppt.zoomTooltip / 100, 0);
	}

	srcTiptext() {
		return 'Switch to ' + (ppt.artistView ? (!ppt.allmusic_bio ? (!ppt.lockBio || ppt.bothBio ? 'prefer ' : '') + 'allmusic' + (ppt.bothBio ? ' first' : '') : (!ppt.lockBio || ppt.bothBio ? 'prefer ' : '') + 'last.fm' + (ppt.bothBio ? ' first' : '')) : (!ppt.allmusic_alb ? (!ppt.lockRev || ppt.bothRev ? 'prefer ' : '') + 'allmusic' + (ppt.bothRev ? ' first' : '') : (!ppt.lockRev || ppt.bothRev ? 'prefer ' : '') + 'last.fm' + (ppt.bothRev ? ' first' : '')));
	}

	trace(btn, x, y) {
		const o = this.btns[btn];
		return o && o.trace(x, y);
	}

	trace_src(x, y) {
		if (!ppt.hdBtnShow || ppt.hdPos == 2) return false;
		return x > this.src.x && x < this.src.x + this.src.w && y > panel.text.t - ui.heading.h && y < panel.text.t - ui.heading.h + ui.font.heading_h;
	}

	tt(n, force) {
		if (tooltip.Text !== n || force) {
			tooltip.Text = n;
			tooltip.SetMaxWidth(800);
			tooltip.Activate();
		}
	}

	wheel(step) {
		if (!this.trace('lookUp', panel.m.x, panel.m.y)) return;
		this.lookUp.zoomSize += step;
		this.lookUp.zoomSize = $.clamp(this.lookUp.zoomSize, 7, 100);
		const o = this.btns['lookUp'];
		window.RepaintRect(0, o.y, panel.w, o.h);
		this.lookUp.scale = Math.round(this.lookUp.zoomSize / this.lookUp.baseSize * 100);
		this.lookUp.font = gdi.Font('FontAwesome', 15 * this.lookUp.scale / 100, 0);
		this.lookUp.fontLock = gdi.Font('FontAwesome', 14 * this.lookUp.scale / 100, 0);
		this.createImages('lookUp');
		this.refresh(true);
		ppt.zoomLookUpBtn = this.lookUp.scale;
	}
}

class Btn {
	constructor(x, y, w, h, type, p1, p2, p3, item, hide, l_dn, l_up, tiptext, hand, name) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.type = type;
		this.p1 = p1;
		this.p2 = p2;
		this.p3 = p3;
		this.item = item;
		this.hide = hide;
		this.l_dn = l_dn;
		this.l_up = l_up;
		this.tt = new Tooltip;
		this.tiptext = tiptext;
		this.hand = hand;
		this.name = name;
		this.transition_factor = 0;
		this.state = 'normal';
	}

	// Methods

	cs(state) {
		this.state = state;
		if (state === 'down' || state === 'normal') this.tt.clear();
		this.repaint();
	}

	draw(gr) {
		switch (this.type) {
			case 5:
				ui.theme.SetPartAndStateID(1, this.item[this.state]);
				ui.theme.DrawThemeBackground(gr, this.x, this.y, this.w, this.h);
				break;
			case 6:
				this.drawHeading(gr);
				break;
			case 7:
				this.drawLookUp(gr);
				break;
			default:
				this.drawScrollBtn(gr);
				break;
		}
	}

	drawHeading(gr) {
		let dh, dx1, dx2;
		let dw = this.w + (but.lookUp.pos == 2 ? but.lookUp.sz + 10 * $.scale : 0);
		if (ppt.hdPos != 2) {
			if (!ppt.hdBtnShow || ppt.hdPos == 1) {
				dh = ppt.hdPos == 1 ? (but.rating.show || but.src.text ? (ppt.hdPos != 1 && ui.show.btnBg ? '' : (ppt.hdLine != 2 ? '  ' : ' ')) : '') + txt.heading + txt.na : txt.heading + txt.na;
				dx1 = this.x + but.src.w;
				dx2 = but.src.x = this.x;
			} else {
				dh = txt.heading + txt.na;
				dx1 = this.x;
				dx2 = but.src.x = this.x + this.w - but.src.w;
			}
		} else dh = txt.heading + txt.na;
		dh = dh.trim();

		switch (true) {
			case ppt.hdLine == 1:
				gr.DrawLine(this.x, this.y + ui.heading.line_y, this.x + dw, this.y + ui.heading.line_y, ui.style.l_w, ui.col.bottomLine);
				break;
			case ppt.hdLine == 2:
				if (ppt.hdPos != 2) {
					const src_w = but.src.w + (but.lookUp.pos == 2 ? but.lookUp.sz + (ppt.hdBtnShow || ppt.hdPos == 1 ? 10 * $.scale : 0) : 0);
					let dh_w = gr.CalcTextWidth(dh, ui.font.heading) + but.src.item_w.space * (ppt.hdPos != 1 || dh ? 2 : 0) + (ppt.hdPos == 1 && but.lookUp.pos == 2 ? but.lookUp.sz + 10 * $.scale : 0);
					if (!ppt.hdPos && dh_w < dw - src_w - but.src.item_w.space * (ppt.hdPos != 2 || !but.src.visible ? 3 : 1)) {
						gr.DrawLine(this.x + dh_w, Math.round(this.y + this.h / 2), this.x + dw - src_w - but.src.item_w.space * 3, Math.round(this.y + this.h / 2), ui.style.l_w, ui.col.centerLine);
					}
					else if ((!ppt.hdBtnShow || ppt.hdPos != 0) && src_w + but.src.item_w.space * 2 + dh_w < dw) {
						gr.DrawLine(dx1 + (but.src.visible ? but.src.item_w.space * (!ui.show.btnBg ? 2 : 3) : ppt.hdPos == 1 ? 0 : dh_w), Math.ceil(this.y + this.h / 2), this.x + dw - (ppt.hdBtnShow ? dh_w : ppt.hdPos == 1 ? dh_w : 0), Math.ceil(this.y + this.h / 2), ui.style.l_w, ui.col.centerLine);
					} else if (but.src.visible) {
						const spacer = but.src.item_w.space * (!ui.show.btnBg ? 2 : 3);
						dx1 += spacer;
						this.w -= spacer;
					}
				} else {
					let dh_w = gr.CalcTextWidth(dh, ui.font.heading) + but.src.item_w.space * 4;
					let ln_l = (dw - dh_w) / 2;
					if (ln_l > 1) {
						gr.DrawLine(this.x, Math.ceil(this.y + this.h / 2), this.x + ln_l, Math.ceil(this.y + this.h / 2), ui.style.l_w, ui.col.centerLine);
						gr.DrawLine(this.x + ln_l + dh_w, Math.ceil(this.y + this.h / 2), this.x + dw, Math.ceil(this.y + this.h / 2), ui.style.l_w, ui.col.centerLine);
					}
				}
				break;
		}
		gr.GdiDrawText(dh, ui.font.heading, ui.col.head, ppt.hdPos != 2 ? dx1 : this.x, this.y, ppt.hdPos != 2 ? this.w - but.src.w - (!ppt.hdPos ? 10 : 0) : this.w, this.h, ppt.hdPos != 2 ? txt.c[ppt.hdPos] : txt.cc);
		if (!but.src.visible) return;
		let col;
		if (ui.show.btnBg) {
			gr.SetSmoothingMode(2);
			if (but.src.allmusic || !ui.show.btnRedLastfm) {
				if (this.state !== 'down') gr.FillRoundRect(dx2, this.p1 - (but.src.pxShift ? 1 : 0), but.src.w, but.src.h + (but.src.pxShift ? 2 : 0), 2, 2, RGBA(ui.col.blend4[0], ui.col.blend4[1], ui.col.blend4[2], ui.col.blend4[3] * (1 - this.transition_factor)));
				col = this.state !== 'down' ? ui.getBlend(ui.col.blend2, ui.col.blend1, this.transition_factor) : ui.col.blend2;
				gr.FillRoundRect(dx2, this.p1 - (but.src.pxShift ? 1 : 0), but.src.w, but.src.h + (but.src.pxShift ? 2 : 0), 2, 2, col);
				gr.DrawRoundRect(dx2, this.p1 - (but.src.pxShift ? 1 : 0), but.src.w, but.src.h + (but.src.pxShift ? 2 : 0), 2, 2, ui.style.l_w, ui.col.blend3);
			} else {
				gr.FillRoundRect(dx2, this.p1 - (but.src.pxShift ? 1 : 0), but.src.w, but.src.h + (but.src.pxShift ? 2 : 0), 2, 2, RGBA(210, 19, 9, 114));
				col = this.state !== 'down' ? ui.getBlend(RGBA(244, 31, 19, 255), RGBA(210, 19, 9, 228), this.transition_factor) : RGBA(244, 31, 19, 255);
				gr.FillRoundRect(dx2, this.p1 - (but.src.pxShift ? 1 : 0), but.src.w, but.src.h + (but.src.pxShift ? 2 : 0), 2, 2, col);
			}
		}
		col = this.state !== 'down' ? ui.getBlend(but.src.col.hover, but.src.col.normal, this.transition_factor) : but.src.col.hover;
		switch (but.src.icon) {
			case 0:
				gr.GdiDrawText(but.src.name, but.src.font, col, dx2, this.p1, but.src.w, but.src.h, !but.rating.show ? txt.cc : txt.c[0]);
				break;
			case 1:
				if (!ppt.artistView && !txt.rev.both || ppt.artistView && !txt.bio.both) gr.GdiDrawText(but.src.name, but.src.allmusic ? but.src.font : but.src.iconFont, col, dx2, this.p1 + (but.src.allmusic ? 0 : but.src.y), but.src.w, but.src.h, !but.rating.show ? txt.cc : txt.c[0]);
				else {
					if (ui.show.btnBg) dx2 += but.src.item_w.space;
					if (!ppt.artistView && txt.rev.both) {
						switch (but.src.allmusic) {
							case 0:
								gr.GdiDrawText(but.src.lfmRev, but.src.iconFont, col, dx2, this.p1 + but.src.y, but.src.item_w.lfmRev, but.src.h, txt.c[0]);
								gr.GdiDrawText(' | ' + but.src.amRev, but.src.font, col, dx2 + but.src.item_w.lfmRev, this.p1, but.src.item_w.amRev + but.src.item_w.splitter, but.src.h, txt.c[0]);
								break;
							case 1:
								gr.GdiDrawText(but.src.amRev + ' | ', but.src.font, col, dx2, this.p1, but.src.item_w.amRev + but.src.item_w.splitter, but.src.h, txt.c[0]);
								gr.GdiDrawText(but.src.lfmRev, but.src.iconFont, col, dx2 + but.src.item_w.amRev + but.src.item_w.splitter, this.p1 + but.src.y, but.src.item_w.lfmRev, but.src.h, txt.c[0]);
								break;
						}
					}
					if (ppt.artistView && txt.bio.both) {
						switch (but.src.allmusic) {
							case 0:
								gr.GdiDrawText(but.src.lfmBio, but.src.iconFont, col, dx2, this.p1 + but.src.y, but.src.item_w.lfmBio, but.src.h, txt.c[0]);
								gr.GdiDrawText(' | ' + but.src.amBio, but.src.font, col, dx2 + but.src.item_w.lfmBio, this.p1, but.src.item_w.amBio + but.src.item_w.splitter, but.src.h, txt.c[0]);
								break;
							case 1:
								gr.GdiDrawText(but.src.amBio + ' | ', but.src.font, col, dx2, this.p1, but.src.item_w.amBio + but.src.item_w.splitter, but.src.h, txt.c[0]);
								gr.GdiDrawText(but.src.lfmBio, but.src.iconFont, col, dx2 + but.src.item_w.amBio + but.src.item_w.splitter, this.p1 + but.src.y, but.src.item_w.lfmBio, but.src.h, txt.c[0]);
								break;
						}
					}
				}
				break;
		}
		if (but.rating.show) {
			const ratingImg = txt.rev.allmusic ? but.rating.images[!txt.rev.both ? txt.rating.am : txt.rating.avg] : ui.show.btnBg && ui.show.btnRedLastfm ? but.rating.imagesLfm[!txt.rev.both ? txt.rating.lfm : txt.rating.avg] : but.rating.images[!txt.rev.both ? txt.rating.lfm : txt.rating.avg];
			if (ratingImg) gr.DrawImage(ratingImg, !ppt.hdPos ? this.x + this.w - but.rating.w2 - (ui.show.btnBg ? but.src.item_w.space : 0) : dx2 + but.src.name_w, this.p1 + (Math.round(but.src.h - but.rating.h2) / 2), but.rating.w2, but.rating.h2, 0, 0, but.rating.w1, but.rating.h1, 0, 255);
		}
	}

	drawLookUp(gr) {
		const col = this.state !== 'down' ? ui.getBlend(this.item.hover, this.item.normal, this.transition_factor) : this.item.hover;
		gr.SetTextRenderingHint(5);
		if (!panel.lock) {
			gr.DrawString(!panel.style.moreTags || !ppt.artistView ? '\uF107' : '\uF13A', but.lookUp.font, col, this.x, this.y, this.p1, this.p2, StringFormat(2, 0));
			if (this.state == 'hover') gr.DrawString(!panel.style.moreTags || !ppt.artistView ? '\uF107' : '\uF13A', but.lookUp.font, col, this.x, this.y + 1, this.p1, this.p2, StringFormat(2, 0));
		} else {
			gr.DrawString('\uF023', but.lookUp.fontLock, col, this.x, this.y + 2 * $.scale, this.p1, this.p2, StringFormat(2, 0));
		}
	}

	drawScrollBtn(gr) {
		const a = this.state !== 'down' ? Math.min(but.alpha[0] + (but.alpha[1] - but.alpha[0]) * this.transition_factor, but.alpha[1]) : but.alpha[2];
		if (this.state !== 'normal' && ui.sbar.type == 1) gr.FillSolidRect(panel.sbar.x, this.y, ui.sbar.w, this.h, but.scr.hover);
		if (but.scr.img) gr.DrawImage(but.scr.img, this.x + this.p1, this.p2, this.p3, this.p3, 0, 0, but.scr.img.Width, but.scr.img.Height, this.type == 1 || this.type == 3 ? 0 : 180, a);
	}

	lbtn_dn(x, y) {
		if (!but.Dn) return;
		this.l_dn && this.l_dn(x, y);
	}

	lbtn_up(x, y) {
		if (panel.isTouchEvent(x, y)) return;
		if (this.l_up) this.l_up();
	}

	repaint() {
		const expXY = 2;
		const expWH = 4;
		window.RepaintRect(this.x - expXY, this.y - expXY, this.w + expWH, this.h + expWH);
	}

	trace(x, y) {
		return !this.hide && x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h;
	}
}

class Tooltip {
	constructor() {
		this.id = Math.ceil(Math.random().toFixed(8) * 1000);
		this.tt_timer = new TooltipTimer();
	}

	// Methods

	clear() {
		this.tt_timer.stop(this.id);
	}

	show(text) {
		if (Date.now() - but.tooltip.start > 2000) this.showDelayed(text);
		else this.showImmediate(text);
		but.tooltip.start = Date.now();
	}

	showDelayed(text) {
		this.tt_timer.start(this.id, text);
	}

	showImmediate(text) {
		this.tt_timer.set_id(this.id);
		this.tt_timer.stop(this.id);
		but.tt(text);
	}

	stop() {
		this.tt_timer.forceStop();
	}
}

class TooltipTimer {
	constructor() {
		this.delay_timer;
		this.tt_caller = undefined;
	}

	// Methods

	forceStop() {
		but.tt('');
		if (this.delay_timer) {
			clearTimeout(this.delay_timer);
			this.delay_timer = null;
		}
	}

	set_id(id) {
		this.tt_caller = id;
	}

	start(id, text) {
		const old_caller = this.tt_caller;
		this.tt_caller = id;
		if (!this.delay_timer && tooltip.Text) but.tt(text, old_caller !== this.tt_caller);
		else {
			this.forceStop();
			if (!this.delay_timer) {
				this.delay_timer = setTimeout(() => {
					but.tt(text);
					this.delay_timer = null;
				}, 500);
			}
		}
	}

	stop(id) {
		if (this.tt_caller === id) this.forceStop();
	}
}

class Transition {
	constructor(items, hover) {
		this.hover = hover;
		this.items = items;
		this.transition_timer = null;
	}

	// Methods

	start() {
		const hover_in_step = 0.2;
		const hover_out_step = 0.06;
		if (!this.transition_timer) {
			this.transition_timer = setInterval(() => {
				Object.values(this.items).forEach(v => {
					const saved = v.transition_factor;
					if (this.hover(v)) v.transition_factor = Math.min(1, v.transition_factor += hover_in_step);
					else v.transition_factor = Math.max(0, v.transition_factor -= hover_out_step);
					if (saved !== v.transition_factor) v.repaint();
				});
				const running = Object.values(this.items).some(v => v.transition_factor > 0 && v.transition_factor < 1);
				if (!running) this.stop();
			}, 25);
		}
	}

	stop() {
		if (this.transition_timer) {
			clearInterval(this.transition_timer);
			this.transition_timer = null;
		}
	}
}