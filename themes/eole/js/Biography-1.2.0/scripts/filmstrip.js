class FilmStrip {
	constructor() {
		this.accessed = 0;
		this.blockSize = 80;
		this.cache = {};
		this.cur_id = false;
		this.h = 0;
		this.hand = false;
		this.im_w = 80;
		this.images = [];
		this.init = true;
		this.items = [];
		this.loadTimer = null;
		this.m_i = -1;
		this.text_y = 0;
		this.x = 0;
		this.y = 0;
		this.w = 0;

		ppt.thumbNailGap = Math.max(ppt.thumbNailGap, 0);
		ppt.filmStripSize = $.clamp(ppt.filmStripSize, 0.02, 0.98);

		this.blocks = {
			bor: [null, null, null],
			drawn: 6,
			end: 1,
			length: 0,
			start: 0
		}

		this.cachesize = {
			max: 200,
			min: 20
		}

		this.noimg = {
			xy: 0,
			wh: 80
		}

		this.repaint = {
			x: 0,
			y: 0,
			w: panel.w,
			h: panel.h
		}

		this.scroll = {
			pos: {
				art: {},
				cov: {}
			}
		}

		this.style = {
			auto: false,
			fit: true,
			gap: 0,
			horizontal: false,
			image: 2
		}

		this.imageDebounce = $.debounce(() => {
			this.getImages();
		}, 100, {
			'leading': true,
			'trailing': true
		});

		this.sizeDebounce = $.debounce(() => {
			if (!ppt.showFilmStrip) return;
			this.logScrollPos();
			this.clearCache();
			this.setSize();
			this.check();
			txt.refresh(0)
		}, 100);
	}

	// Methods

	cacheIt(image, key) {
		try {
			if (image) {
				if (img.filter.size && ppt.artistView && (!ppt.imgFilterBothPx ? image.Width < img.filter.minPx && image.Height < img.filter.minPx : image.Width < img.filter.minPx || image.Height < img.filter.minPx) && img.art.images.length > img.filter.minNo) {
					const image_path = key.replace(/^\d+/, '');
					const rem_ix = img.art.images.findIndex(v => v == image_path);
					if (rem_ix != -1) img.art.images.splice(rem_ix, 1);
					this.trimCache(image_path);
					seeker.upd();
					this.logScrollPos();
					this.check('imgUpd');
					!ppt.imgSeeker ? this.paint() : txt.paint();
					return;
				}
				if (img.filter.size && !ppt.artistView && img.artFolder && (!ppt.imgFilterBothPx ? image.Width < img.filter.minPx && image.Height < img.filter.minPx : image.Width < img.filter.minPx || image.Height < img.filter.minPx) && img.cov.images.length > img.filter.minNo + 1) {
					const image_path = key.replace(/^\d+/, '');
					const rem_ix = img.cov.images.findIndex(v => v == image_path);
					if (rem_ix != -1) {
						img.cov.list.splice(rem_ix, 1);
						img.cov.images.splice(rem_ix, 1);
					}
					this.trimCache(image_path);
					seeker.upd();
					this.logScrollPos();
					this.check('imgUpd');
					!ppt.imgSeeker ? this.paint() : txt.paint();
					return;
				}
			} else if (!image) image = img.stub.default[!key.includes('noitem') ? ppt.artistView ? 1 : 0 : 2];
			if (image) {
				image = img.format(image, 1, ['default', 'crop', 'circular'][this.style.image], this.im_w, this.im_w, 'filmStrip');
				this.checkCache();
				this.cache[key] = {
					img: image,
					accessed: ++this.accessed
				}
			}
		} catch (e) {
			const image_path = key.replace(/^\d+/, '');
			if (ppt.artistView) {
				const rem_ix = img.art.images.findIndex(v => v == image_path);
				if (rem_ix != -1) img.art.images.splice(rem_ix, 1);
				this.trimCache(image_path);
			} else {
				const rem_ix = img.cov.images.findIndex(v => v == image_path);
				if (rem_ix != -1) {
					img.cov.list.splice(rem_ix, 1);
					img.cov.images.splice(rem_ix, 1);
				}
				this.trimCache(image_path);
			}
			seeker.upd();
			this.check();
			if (ppt.imgSeeker) txt.paint();
			$.trace('unable to load thumbnail image: ' + key);
		}
		this.paint();
	}

	check(n) {
		const cur_style = this.style.image;
		this.style.image = ppt.artistView ? ppt.filmPhotoStyle : ppt.filmCoverStyle;
		if (this.style.image != cur_style) this.createBorder();
		const y_text = !panel.style.fullWidthHeading || ppt.img_only || (!txt.text && !ppt.text_only) ? 0 : panel.text.t;
		if (this.text_y != y_text) this.setSize();
		panel.style.showFilmStrip = false;
		if (ppt.showFilmStrip) {
			this.images = [];
			switch (true) {
				case !this.style.auto:
					panel.style.showFilmStrip = true;
					switch (true) {
						case ppt.artistView:
							if (!ppt.cycPhoto || !img.art.images.length) break;
							this.images = img.art.images;
							break;
						case !ppt.artistView:
							if (!panel.stnd(panel.alb.ix, panel.alb.list) || !img.cov.cycle || !img.cov.images.length) break;
							this.images = img.cov.images;
							break;
					}
					break;
				case this.style.auto:
					switch (true) {
						case ppt.artistView:
							if (!ppt.cycPhoto || img.art.images.length < 2) break;
							this.images = img.art.images;
							panel.style.showFilmStrip = true;
							break;
						case !ppt.artistView:
							if (!panel.stnd(panel.alb.ix, panel.alb.list) || !img.cov.cycle || img.cov.images.length < 2) break;
							this.images = img.cov.images;
							panel.style.showFilmStrip = true;
							break;
					}
					break;
			}
			if (!this.images.length && !this.style.auto) this.images[0] = img.cur_pth();
			this.blocks.length = this.images.length;
			this.updScroll(n);
			if (n == 'imgUpd') this.scrollerType().checkScroll(this.scrollerType().scroll, 'step');
		}
		if (this.id() != this.cur_id) {
			this.cur_id = this.id();
			if (n != 'clear') {
				this.setSize(); // check required for initially hidden panels
				this.setFilmStripSize(); // check required for initially hidden panels
				panel.setStyle(resize.down); // if clear: called by refresh(0)
				panel.checkAutofilm(); // if clear: refresh(0) does text
			}
		} else {
			this.setFilmStripSize();
		}
		this.paint();
	}

	checkCache() {
		let keys = Object.keys(this.cache);
		const cacheLength = keys.length;
		if (cacheLength < this.cachesize.max && !img.memoryLimit()) return;
		this.cache = img.sortCache(this.cache, 'accessed');
		keys = Object.keys(this.cache);
		const numToRemove = Math.round((Math.min(this.cachesize.max, cacheLength) - this.cachesize.min) / 5);
		if (numToRemove > 0)
			for (let i = 0; i < numToRemove; i++) this.trimCache(false, keys[i]);
	}

	clearCache() {
		this.cache = {};
		this.accessed = 0;
	}

	createBorder() {
		if (!ppt.showFilmStrip) return;
		const sp = Math.round((this.blockSize - this.im_w) / 2);
		for (let i = 0; i < 3; i++) {
			const col = i < 2 ? ui.col.imgBor : ui.col.frame;
			const w = i < 2 ? ui.style.l_w : ui.style.l_w * 3;
			const floor = Math.floor(w / 2);
			const w1 = !this.style.horizontal || i == 2 ? w : i == 1 ? -100 : w;
			const w2 = this.style.horizontal || i == 2 ? w : i == 1 ? -100 : w;
			this.blocks.bor[i] = $.gr(this.blockSize, this.blockSize, true, g => { // 0 circ|rect; 1 circ|rect_no_trailing; 2 sel circ|rect
				switch (this.style.image) {
					case 2:
						g.SetSmoothingMode(2);
						g.DrawEllipse(sp + floor, sp + floor, this.im_w - w, this.im_w - w, w, col);
						g.SetSmoothingMode(0);
						break;
					default:
						g.DrawRect(sp + floor, sp + floor, this.im_w - w1, this.im_w - w2, w, col);
						break;
				}
			});
		}
	}

	draw(gr) {
		if (!panel.style.showFilmStrip || panel.block()) return;
		let box_x, box_y, iw, ih;
		this.getItemsToDraw();
		for (let i = this.blocks.start; i < this.blocks.end; i++) {
			box_x = this.style.horizontal ? Math.floor(this.x + i * this.blockSize - this.scrollerType().delta) : this.x;
			box_y = !this.style.horizontal ? Math.floor(this.y + i * this.blockSize - this.scrollerType().delta) : this.y;
			const im = this.getImg(i);
			if (im) {
				iw = im.Width;
				ih = im.Height;
				const sel = (!ppt.text_only || ui.style.isBlur) && this.blocks.length > 1 && this.images[i] == img.cur_pth();
				const x = box_x + Math.round((this.blockSize - iw) / 2);
				const y = box_y + Math.round((this.blockSize - ih) / 2);
				let bor = !sel ? this.blocks.bor[1] : this.blocks.bor[2];
				if (this.style.image != 2 && !sel && (this.style.gap || this.style.fit && i == this.blocks.end - 2 && i != this.blocks.length - 2 || i == this.blocks.length - 1)) bor = this.blocks.bor[0];
				!this.style.horizontal ? this.drawVerticalStrip(gr, im, bor, box_x, box_y, x, y, ih, iw) : this.drawhorizontalStrip(gr, im, bor, box_x, box_y, x, y, ih, iw);
			} else this.noIm(gr, box_x, box_y);
		}
	}

	drawhorizontalStrip(gr, im, bor, box_x, box_y, x, y, ih, iw) {
		const c = this.style.image == 2 ? 1 : 0;
		let x_offset = 0;
		if (x - this.x < 0) { // first
			x_offset = Math.abs(x - this.x);
			if (im) gr.DrawImage(im, this.x, y, iw - x_offset, ih, x_offset, 0, iw - x_offset, ih);
			x_offset = Math.abs(box_x - this.x);
			if (bor) gr.DrawImage(bor, this.x, box_y, this.blockSize - x_offset, this.blockSize + c, x_offset, 0, this.blockSize - x_offset, this.blockSize);
		} else if (x + this.blockSize > this.x + this.w) { // last
			x_offset = this.x + this.w - x;
			if (im) gr.DrawImage(im, x, y, x_offset, ih, 0, 0, x_offset, ih);
			x_offset = this.x + this.w - box_x;
			if (bor) gr.DrawImage(bor, box_x, box_y, x_offset, this.blockSize + c, 0, 0, x_offset, this.blockSize);
		} else { // others
			if (im) gr.DrawImage(im, x, y, iw, ih, 0, 0, iw, ih);
			if (bor) gr.DrawImage(bor, box_x, box_y, this.blockSize, this.blockSize + c, 0, 0, this.blockSize, this.blockSize);
		}
	}

	drawVerticalStrip(gr, im, bor, box_x, box_y, x, y, ih, iw) {
		const c = this.style.image == 2 ? 1 : 0;
		let y_offset = 0;
		if (y - this.y < 0) { // first
			y_offset = Math.abs(y - this.y);
			if (im) gr.DrawImage(im, x, this.y, iw, ih - y_offset, 0, y_offset, iw, ih - y_offset);
			y_offset = Math.abs(box_y - this.y);
			if (bor) gr.DrawImage(bor, box_x, this.y, this.blockSize, this.blockSize - y_offset + c, 0, y_offset, this.blockSize, this.blockSize - y_offset);
		} else if (y + this.blockSize > this.y + this.h) { // last
			y_offset = this.y + this.h - y;
			if (im) gr.DrawImage(im, x, y, iw, y_offset, 0, 0, iw, y_offset);
			y_offset = this.y + this.h - box_y;
			if (bor) gr.DrawImage(bor, box_x, box_y, this.blockSize, y_offset + c, 0, 0, this.blockSize, y_offset);
		} else { // others
			if (im) gr.DrawImage(im, x, y, iw, ih, 0, 0, iw, ih);
			if (bor) gr.DrawImage(bor, box_x, box_y, this.blockSize, this.blockSize + c, 0, 0, this.blockSize, this.blockSize);
		}
	}

	get_ix(x, y) {
		if (!ppt.showFilmStrip) return -1;
		if (!this.images.length || but.trace('lookUp', panel.m.x, panel.m.y)) return -1;
		if (panel.trace.film && y > this.y && y < this.y + this.h && x > this.x && x < this.x + this.w) {
			let idx = this.style.horizontal ? Math.ceil((x + this.scrollerType().delta - this.x) / this.blockSize) - 1 : Math.ceil((y + this.scrollerType().delta - this.y) / this.blockSize) - 1;
			idx = idx > this.images.length - 1 ? -1 : idx;
			return idx;
		}
		return -1;
	}

	getImg(i) {
		const o = this.cache[this.getKey(this.images[i])];
		if (!o || o.img == 'called') return undefined;
		o.accessed = ++this.accessed;
		return o.img;
	}

	getImages() {
		const finish = Math.min(this.blocks.end + this.blocks.drawn, this.blocks.length);
		for (let i = this.blocks.start; i < finish; i++) {
			const key = this.images[i];
			if (!this.cache[this.getKey(key)]) this.items.push({
				ix: i,
				key: key
			});
		}
		if (!this.items.length) return;
		if (!this.loadTimer) this.loadTimer = setInterval(() => {
			if (this.items.length) {
				const v = this.items[0];
				if (!v.key) this.items.shift();
				else if (window.ID) { // added window.ID check
					const key = this.getKey(v.key);
					if (!this.cache[key]) {
						const embeddedImg = img.isEmbedded('thumb', v.ix);
						if (!embeddedImg) {
							this.cache[key] = {
								img: 'called',
								accessed: ++this.accessed
							}
							gdi.LoadImageAsync(window.ID, v.key);
						} else this.cacheIt(embeddedImg, key);
					}
					this.items.shift();
				}
			} else {
				clearInterval(this.loadTimer);
				this.loadTimer = null;
			}
		}, 16);
	}

	getItemsToDraw() {
		if (this.blocks.length <= this.blocks.drawn) {
			this.blocks.start = 0;
			this.blocks.end = this.blocks.length;
		} else {
			this.blocks.start = Math.round(this.scrollerType().delta / this.blockSize);
			this.blocks.end = Math.min(this.blocks.start + this.blocks.drawn + (this.style.fit ? 1 : 2), this.blocks.length);
			this.blocks.start = $.clamp(this.blocks.start, 0, this.blocks.start - 1)
		}
		this.imageDebounce();
	}

	getScrollPos() {
		let v;
		switch (ppt.artistView) {
			case true:
				v = img.artist;
				if (!this.scroll.pos.art[v]) return art_scroller.setScroll(0);
				else if (this.scroll.pos.art[v].blockSize == this.blockSize) {
					if (img.art.list.length && $.equal(this.scroll.pos.art[v].images, img.art.list)) art_scroller.setScroll(this.scroll.pos.art[v].scroll || 0);
					else art_scroller.setScroll(0);
				} else {
					if (img.art.list.length && $.equal(this.scroll.pos.art[v].images, img.art.list)) art_scroller.setScroll(Math.round(this.scroll.pos.art[v].scroll / this.scroll.pos.art[v].blockSize) * this.blockSize || 0);
					else art_scroller.setScroll(0);
					this.logScrollPos();
				}
				break;
			case false: {
				if (!panel.stnd(panel.alb.ix, panel.alb.list)) return cov_scroller.setScroll(0);
				v = img.id.albCyc;
				if (!this.scroll.pos.cov[v]) return cov_scroller.setScroll(0);
				else if (this.scroll.pos.cov[v].blockSize == this.blockSize) cov_scroller.setScroll(this.scroll.pos.cov[v].scroll || 0);
				else cov_scroller.setScroll(Math.round(this.scroll.pos.cov[v].scroll / this.scroll.pos.cov[v].blockSize) * this.blockSize || 0);
				break;
			}
		}
	}

	id() {
		return panel.style.showFilmStrip + panel.filmStripSize.t + panel.filmStripSize.r + panel.filmStripSize.b + panel.filmStripSize.l + ppt.filmStripPos;
	}

	lbtn_dblclk(p_x, p_y) {
		let new_ix = this.get_ix(p_x, p_y);
		if (ppt.artistView) {
			if (new_ix != -1 && new_ix != img.art.ix) {
				img.art.ix = new_ix;
				img.setPhoto();
			}
		} else {
			if (new_ix != -1 && new_ix != img.cov.ix) {
				img.cov.ix = new_ix;
				img.setCov();
			}
		}
	}

	lbtn_up(p_x, p_y) {
		if (!ppt.dblClickToggle) {
			let new_ix = this.get_ix(p_x, p_y);
			if (ppt.artistView) {
				if (new_ix != -1 && new_ix != img.art.ix && (!ppt.touchControl || ui.id.touch_dn == new_ix)) {
					img.art.ix = new_ix;
					img.setPhoto();
				}
			} else {
				if (new_ix != -1 && new_ix != img.cov.ix && (!ppt.touchControl || ui.id.touch_dn == new_ix)) {
					img.cov.ix = new_ix;
					img.setCov();
				}
			}
		}
	}

	leave() {
		if (men.right_up) return;
		this.m_i = -1;
		this.paint();
	}

	logScrollPos(images) {
		if (!ppt.showFilmStrip) return;
		let keys = [];
		let v;
		switch (ppt.artistView) {
			case true: {
				keys = Object.keys(this.scroll.pos.art);
				if (keys.length > 25) delete this.scroll.pos.art[keys[0]];
				v = img.artist;
				if (!this.scroll.pos.art[v]) this.scroll.pos.art[v] = {
					images: []
				}
				const o = this.scroll.pos.art[v];
				if (images) o.images = images;
				else {
					o.arr = $.isArray(img.art.images) ? img.art.images.slice() : [];
					o.blockSize = this.blockSize;
					o.ix = img.art.ix;
					o.scroll = art_scroller.scroll;
				}
				break;
			}
			case false:
				if (!panel.stnd(panel.alb.ix, panel.alb.list)) break;
				v = img.id.albCyc;
				this.scroll.pos.cov[v] = {
					blockSize: this.blockSize,
					scroll: cov_scroller.scroll
				}
				break;
		}
	}

	mbtn_up(n) {
		switch (n) {
			case 'onOff':
				ppt.toggle('showFilmStrip');
				this.set('clear');
				this.paint();
				break;
			case 'showCurrent':
				if (this.blocks.length > this.blocks.drawn && (!ppt.text_only || ui.style.isBlur)) {
					this.showImage(ppt.artistView ? img.art.ix : img.cov.ix);
				}
				break;
		}
	}

	move(x, y) {
		if (!ppt.showFilmStrip || ppt.text_only && !ui.style.isBlur) return this.hand = false;
		this.m_i = this.get_ix(x, y);
		this.hand = this.m_i == -1 ? false : true;
	}

	noIm(gr, box_x, box_y) {
		if ((!this.style.horizontal && box_y >= this.y && box_y <= this.y + this.h - this.blockSize) || (this.style.horizontal && box_x >= this.x && box_x <= this.x + this.w - this.blockSize)) {
			if (this.style.image != 2) gr.FillSolidRect(box_x + this.noimg.xy, box_y + this.noimg.xy, this.noimg.wh, this.noimg.wh, ui.col.bg1);
			else gr.FillEllipse(box_x + this.noimg.xy, box_y + this.noimg.xy, this.noimg.wh, this.noimg.wh, ui.col.bg1);
		}
	}
	getKey(pth) {
		return this.im_w + this.style.image + pth;
	}

	on_load_image_done(image, image_path) {
		const key = this.getKey(image_path);
		const o = this.cache[key];
		if (o && o.img == 'called') this.cacheIt(image, key);
	}

	on_size() {
		if (this.init) this.setSize();
		else this.sizeDebounce();
		this.init = false;
	}

	paint() {
		if (!panel.style.showFilmStrip) return;
		window.RepaintRect(this.repaint.x, this.repaint.y, this.repaint.w, this.repaint.h);
	}

	scrollerType() {
		return ppt.artistView ? art_scroller : cov_scroller;
	}
	
	setFilmStripSize() {
		panel.filmStripSize = !panel.style.showFilmStrip ? {
			t: 0,
			r: 0,
			b: 0,
			l: 0
		} : {
			t: ppt.filmStripPos == 0 ? this.y + this.h : 0,
			r: ppt.filmStripPos == 1 ? panel.w - this.x : 0,
			b: ppt.filmStripPos == 2 ? panel.h - this.y : 0,
			l: ppt.filmStripPos == 3 ? this.x + this.w : 0
		}
	}

	set(i) {
		switch (i) {
			case 0:
			case 1:
			case 2:
			case 3:
				ppt.filmStripPos = i;
				break;
			case 4: {
				const continue_confirmation = (status, confirmed) => {
					if (confirmed) ppt.filmStripSize = 0.15;
				}
				popUpBox.confirm('Reset Filmstrip To Default Size', 'Continue?', 'Yes', 'No', continue_confirmation);
				break;
			}
		}
		filmStrip.logScrollPos();
		this.clearCache();
		this.setSize();
		this.check(i);
		txt.refresh(0);
		this.paint();
	}

	setSize() {
		if (!ppt.showFilmStrip) return;
		this.style.auto = ppt.autoFilm;
		this.style.fit = ppt.filmStripAutofit;
		this.style.gap = ppt.thumbNailGap;
		this.style.image = ppt.artistView ? ppt.filmPhotoStyle : ppt.filmCoverStyle;
		const spacer = Math.round((!this.style.gap ? 2 : this.style.gap < 3 ? 1 : 0) * $.scale);
		let max_h = panel.h;
		let max_w = panel.w;
		this.max_sz = panel.w;
		this.text_y = !panel.style.fullWidthHeading || ppt.img_only || (!txt.text && !ppt.text_only) ? 0 : panel.text.t;
		switch (ppt.filmStripPos) {
			case 0: // top
				this.y = ppt.filmStripMargin == 2 ? ppt.borT : ppt.filmStripMargin == 4 ? ppt.textT : spacer;
				max_h = panel.h - this.y;
				this.x = ppt.filmStripMargin == 1 || ppt.filmStripMargin == 2 ? ppt.borL : ppt.filmStripMargin == 3 || ppt.filmStripMargin == 4 ? ppt.textL : spacer;
				this.w = panel.w - this.x - (ppt.filmStripMargin == 1 || ppt.filmStripMargin == 2 ? ppt.borR : ppt.filmStripMargin == 3 || ppt.filmStripMargin == 4 ? ppt.textR : spacer);
				this.max_sz = Math.min(max_h - 5, this.w);
				this.blockSize = Math.round(ppt.filmStripSize * panel.h);
				if (this.style.fit) {
					this.blockSize = Math.floor(this.w / Math.max(Math.round(this.w / this.blockSize), 1));
					this.h = this.blockSize = Math.min(this.blockSize, this.max_sz);
					this.w = Math.floor(this.w / this.blockSize) * this.blockSize;
				} else {
					this.blockSize = Math.min(this.blockSize, this.max_sz);
					this.h = this.blockSize;
				}
				this.style.horizontal = true;
				this.repaint = {
					x: 0,
					y: 0,
					w: panel.w,
					h: this.y + this.h + 2
				}
				break;

			case 1: { // right
				const pad_r = ppt.filmStripMargin == 2 ? ppt.borR : ppt.filmStripMargin == 4 ? ppt.textR : spacer;
				max_w = panel.w - pad_r;
				this.y = this.text_y || (ppt.filmStripMargin == 1 || ppt.filmStripMargin == 2 ? ppt.borT : ppt.filmStripMargin == 3 || ppt.filmStripMargin == 4 ? ppt.textT : spacer);
				this.h = panel.h - this.y - (ppt.filmStripMargin == 1 || ppt.filmStripMargin == 2 ? ppt.borB : ppt.filmStripMargin == 3 || ppt.filmStripMargin == 4 ? ppt.textB : spacer);
				this.max_sz = Math.min(max_w - 5, this.h)
				this.blockSize = Math.round(ppt.filmStripSize * panel.w);
				if (this.style.fit) {
					this.blockSize = Math.floor(this.h / Math.max(Math.round(this.h / this.blockSize)), 1);
					this.w = this.blockSize = Math.min(this.blockSize, this.max_sz);
					this.h = Math.floor(this.h / this.blockSize) * this.blockSize;
				} else {
					this.blockSize = Math.min(this.blockSize, this.max_sz);
					this.w = this.blockSize;
				}
				this.x = panel.w - this.w - pad_r;
				this.style.horizontal = false;
				this.repaint = {
					x: this.x - 2,
					y: 0,
					w: panel.w - this.x + 2,
					h: panel.h
				}
				break;
			}

			case 2: { // bottom
				const pad_b = ppt.filmStripMargin == 2 ? ppt.borB : ppt.filmStripMargin == 4 ? ppt.textB : spacer
				max_h = panel.h - pad_b;
				this.x = ppt.filmStripMargin == 1 || ppt.filmStripMargin == 2 ? ppt.borL : ppt.filmStripMargin == 3 || ppt.filmStripMargin == 4 ? ppt.textL : spacer;
				this.w = panel.w - this.x - (ppt.filmStripMargin == 1 || ppt.filmStripMargin == 2 ? ppt.borR : ppt.filmStripMargin == 3 || ppt.filmStripMargin == 4 ? ppt.textR : spacer);
				this.max_sz = Math.min(max_h - 5, this.w);
				this.blockSize = Math.round(ppt.filmStripSize * panel.h);
				if (this.style.fit) {
					this.blockSize = Math.floor(this.w / Math.max(Math.round(this.w / this.blockSize), 1));
					this.h = this.blockSize = Math.min(this.blockSize, this.max_sz);
					this.w = Math.floor(this.w / this.blockSize) * this.blockSize;
				} else {
					this.blockSize = Math.min(this.blockSize, this.max_sz);
					this.h = this.blockSize;
				}
				this.y = panel.h - this.h - pad_b;
				this.style.horizontal = true;
				this.repaint = {
					x: 0,
					y: this.y - 2,
					w: panel.w,
					h: panel.h - this.y + 2
				}
				break;
			}

			case 3: // left
				this.x = ppt.filmStripMargin == 2 ? ppt.borL : ppt.filmStripMargin == 4 ? ppt.textL : spacer;
				max_w = panel.w - this.x;
				this.y = this.text_y || (ppt.filmStripMargin == 1 || ppt.filmStripMargin == 2 ? ppt.borT : ppt.filmStripMargin == 3 || ppt.filmStripMargin == 4 ? ppt.textT : spacer);
				this.h = panel.h - this.y - (ppt.filmStripMargin == 1 || ppt.filmStripMargin == 2 ? ppt.borB : ppt.filmStripMargin == 3 || ppt.filmStripMargin == 4 ? ppt.textB : spacer);
				this.max_sz = Math.min(max_w - 5, this.h);
				this.blockSize = Math.round(ppt.filmStripSize * panel.w);
				if (this.style.fit) {
					this.blockSize = Math.floor(this.h / Math.max(Math.round(this.h / this.blockSize)), 1);
					this.w = this.blockSize = Math.min(this.blockSize, this.max_sz);
					this.h = Math.floor(this.h / this.blockSize) * this.blockSize;
				} else {
					this.blockSize = Math.min(this.blockSize, this.max_sz);
					this.w = this.blockSize;
				}
				this.style.horizontal = false;
				this.repaint = {
					x: 0,
					y: 0,
					w: this.x + this.w + 2,
					h: panel.h
				}
				break;
		}
		this.blocks.drawn = Math.floor((this.style.horizontal ? this.w : this.h) / this.blockSize);
		this.im_w = Math.round(Math.max(this.blockSize - Math.round(this.style.gap), 10));

		this.cachesize.max = Math.max(this.blocks.drawn * 6, 200);
		this.cachesize.min = this.blocks.drawn * 3;

		this.noimg.xy = Math.round((this.blockSize - this.im_w) / 2) + 3;
		this.noimg.wh = this.im_w - 6;

		if (this.scrollerType().scroll > this.scrollerType().max_scroll) this.scrollerType().checkScroll(this.scrollerType().max_scroll);
		this.createBorder();

	}

	showImage(i) {
		this.m_i = -1;
		const b = $.clamp(Math.round(this.scrollerType().delta / this.scrollerType().row.h), 0, this.blocks.drawn - 1);
		const f = Math.min(b + Math.floor((this.style.horizontal ? this.w : this.h) / this.scrollerType().row.h), this.blocks.drawn);
		if (i <= b || i >= f) {
			const delta = (this.style.horizontal ? this.w : this.h) / 2 > this.scrollerType().row.h ? Math.floor((this.style.horizontal ? this.w : this.h) / 2) : 0;
			const deltaRows = Math.floor(delta / this.scrollerType().row.h) * this.scrollerType().row.h;
			this.scrollerType().checkScroll(i * this.scrollerType().row.h - deltaRows, 'full');
		}
	}

	trace(x, y) {
		if (!panel.style.showFilmStrip) return false;
		return [y < this.y + this.h, x > this.x, y > this.y, x < this.x + this.w][ppt.filmStripPos];
	}

	trimCache(image_path, key) {
		if (image_path) key = this.getKey(image_path);
		delete this.cache[key];
	}

	updScroll(n) {
		this.scrollerType().metrics(this.x, this.y, this.w, this.h, this.blocks.drawn, this.blockSize, this.style.horizontal);
		this.scrollerType().setRows(this.blocks.length);
		if (n !== false && !this.scrollerType().draw_timer) this.getScrollPos();
	}
}