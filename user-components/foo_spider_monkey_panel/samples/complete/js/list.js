'use strict';

_.mixin({
	nest(collection, keys) {
		if (!keys.length) {
			return collection;
		} else {
			return _(collection)
				.groupBy(keys[0])
				.mapValues((values) => _.nest(values, keys.slice(1)))
				.value();
		}
	}
});

function _list(mode, x, y, w, h) {
	this.playback_queue_changed = () => {
		if (this.mode == 'queue_viewer') {
			this.update();
		}
	}
	
	this.size = () => {
		this.index = 0;
		this.offset = 0;
		this.rows = Math.floor((this.h - _scale(24)) / panel.row_height);
		this.up_btn.x = this.x + Math.round((this.w - _scale(12)) / 2);
		this.down_btn.x = this.up_btn.x;
		this.up_btn.y = this.y;
		this.down_btn.y = this.y + this.h - _scale(12);
	}
	
	this.paint = (gr) => {
		if (this.items == 0) {
			return;
		}
		switch (true) {
		case this.mode == 'lastfm_info' && this.properties.mode.value == 1: // charts
			this.text_x = this.spacer_w + 5;
			this.text_width = Math.round(this.w / 2) + 30;
			const lastfm_charts_bar_x = this.x + this.text_x + this.text_width + 10;
			const unit_width = (this.w - lastfm_charts_bar_x - _scale(50)) / this.data[0].playcount;
			for (let i = 0; i < Math.min(this.items, this.rows); i++) {
				let bar_width = Math.ceil(unit_width * this.data[i + this.offset].playcount);
				gr.GdiDrawText(this.data[i + this.offset].rank + '.', panel.fonts.normal, panel.colours.highlight, this.x, this.y + _scale(12) + (i * panel.row_height), this.text_x - 5, panel.row_height, RIGHT);
				gr.GdiDrawText(this.data[i + this.offset].name, panel.fonts.normal, panel.colours.text, this.x + this.text_x, this.y + _scale(12) + (i * panel.row_height), this.text_width, panel.row_height, LEFT);
				gr.FillSolidRect(lastfm_charts_bar_x, this.y + _scale(13) + (i * panel.row_height), bar_width, panel.row_height - 3, this.properties.colour.value);
				gr.GdiDrawText(_formatNumber(this.data[i + this.offset].playcount, ','), panel.fonts.normal, panel.colours.text, lastfm_charts_bar_x + bar_width + 5, this.y + _scale(12) + (i * panel.row_height), _scale(60), panel.row_height, LEFT);
			}
			break;
		case this.mode == 'musicbrainz' && this.properties.mode.value == 0: // releases
			this.text_width = this.w - this.spacer_w - 10;
			for (let i = 0; i < Math.min(this.items, this.rows); i++) {
				gr.GdiDrawText(this.data[i + this.offset].name, panel.fonts.normal, this.data[i + this.offset].width == 0 ? panel.colours.highlight : panel.colours.text, this.x, this.y + _scale(12) + (i * panel.row_height), this.text_width, panel.row_height, LEFT);
				gr.GdiDrawText(this.data[i + this.offset].date, panel.fonts.normal, panel.colours.highlight, this.x, this.y + _scale(12) + (i * panel.row_height), this.w, panel.row_height, RIGHT);
			}
			break;
		case this.mode == 'properties':
			this.text_width = this.w - this.text_x;
			for (let i = 0; i < Math.min(this.items, this.rows); i++) {
				gr.GdiDrawText(this.data[i + this.offset].name, panel.fonts.normal, panel.colours.highlight, this.x, this.y + _scale(12) + (i * panel.row_height), this.text_x - 10, panel.row_height, LEFT);
				gr.GdiDrawText(this.data[i + this.offset].value, panel.fonts.normal, panel.colours.text, this.x + this.text_x, this.y + _scale(12) + (i * panel.row_height), this.text_width, panel.row_height, LEFT);
			}
			break;
		default: // autoplaylists / last.fm similar artists / last.fm recent tracks / musicbrainz links / queue viewer
			this.text_x = 0;
			this.text_width = this.w;
			for (let i = 0; i < Math.min(this.items, this.rows); i++) {
				gr.GdiDrawText(this.data[i + this.offset].name, panel.fonts.normal, panel.colours.text, this.x, this.y + _scale(12) + (i * panel.row_height), this.text_width, panel.row_height, LEFT);
			}
			break;
		}
		this.up_btn.paint(gr, panel.colours.text);
		this.down_btn.paint(gr, panel.colours.text);
	}
	
	this.metadb_changed = () => {
		let temp_artist;
		switch (true) {
		case this.mode == 'autoplaylists':
		case this.mode == 'lastfm_info' && this.properties.mode.value > 0:
		case this.mode == 'queue_viewer':
			break;
		case !panel.metadb:
			this.artist = '';
			this.data = [];
			this.items = 0;
			window.Repaint();
			break;
		case this.mode == 'properties':
			this.update();
			break;
		case this.mode == 'musicbrainz':
			temp_artist = panel.tf(DEFAULT_ARTIST);
			const temp_id = panel.tf('$if3($meta(musicbrainz_artistid,0),$meta(musicbrainz artist id,0),)');
			if (this.artist == temp_artist && this.mb_id == temp_id) {
				return;
			}
			this.artist = temp_artist;
			this.mb_id = temp_id;
			this.update();
			break;
		default:
			temp_artist = panel.tf(DEFAULT_ARTIST);
			if (this.artist == temp_artist) {
				return;
			}
			this.artist = temp_artist;
			this.update();
			break;
		}
	}
	
	this.playback_new_track = () => {
		panel.item_focus_change();
		this.time_elapsed = 0;
	}
	
	this.playback_time = () => {
		if (this.mode == 'lastfm_info') {
			this.time_elapsed++;
			if (this.time_elapsed == 3 && this.properties.mode.value == 2 && lastfm.username.length) {
				this.get();
			}
		}
	}
	
	this.trace = (x, y) => {
		return x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h;
	}
	
	this.wheel = (s) => {
		if (this.trace(this.mx, this.my)) {
			if (this.items > this.rows) {
				let offset = this.offset - (s * 3);
				if (offset < 0) {
					offset = 0;
				}
				if (offset + this.rows > this.items) {
					offset = this.items - this.rows;
				}
				if (this.offset != offset) {
					this.offset = offset;
					window.RepaintRect(this.x, this.y, this.w, this.h);
				}
			}
			return true;
		} else {
			return false;
		}
	}
	
	this.move = (x, y) => {
		this.mx = x;
		this.my = y;
		window.SetCursor(IDC_ARROW);
		if (this.trace(x, y)) {
			this.index = Math.floor((y - this.y - _scale(12)) / panel.row_height) + this.offset;
			this.in_range = this.index >= this.offset && this.index < this.offset + Math.min(this.rows, this.items);
			switch (true) {
			case this.up_btn.move(x, y):
			case this.down_btn.move(x, y):
				break;
			case !this.in_range:
				break;
			case this.mode == 'autoplaylists':
				switch (true) {
				case x > this.x && x < this.x + Math.min(this.data[this.index].width, this.text_width):
					window.SetCursor(IDC_HAND);
					_tt('Autoplaylist: ' + this.data[this.index].name);
					break;
				default:
					_tt('');
					break;
				}
				break;
			case x > this.x + this.text_x && x < this.x + this.text_x + Math.min(this.data[this.index].width, this.text_width):
				window.SetCursor(IDC_HAND);
				if (this.data[this.index].url.startsWith('http')) {
					_tt(this.data[this.index].url);
				} else {
					_tt('Autoplaylist: ' + this.data[this.index].url);
				}
				break;
			default:
				_tt('');
				break;
			}
			return true;
		} else {
			return false;
		}
	}
	
	this.lbtn_up = (x, y) => {
		if (this.trace(x, y)) {
			switch (true) {
			case this.up_btn.lbtn_up(x, y):
			case this.down_btn.lbtn_up(x, y):
			case !this.in_range:
				break;
			case this.mode == 'autoplaylists':
				if (x > this.x && x < this.x + Math.min(this.data[this.index].width, this.text_width)) {
					this.edit(x, y);
				}
				break;
			case x > this.x + this.text_x && x < this.x + this.text_x + Math.min(this.data[this.index].width, this.text_width):
				if (this.data[this.index].url.startsWith('http')) {
					_run(this.data[this.index].url);
				} else {
					plman.CreateAutoPlaylist(plman.PlaylistCount, this.data[this.index].name, this.data[this.index].url);
					plman.ActivePlaylist = plman.PlaylistCount - 1;
				}
				break;
			}
			return true;
		} else {
			return false;
		}
	}
	
	this.rbtn_up = (x, y) => {
		switch (this.mode) {
		case 'autoplaylists':
			panel.m.AppendMenuItem(MF_STRING, 1000, 'Add new autoplaylist...');
			panel.m.AppendMenuSeparator();
			if (this.deleted_items.length) {
				_(this.deleted_items)
					.take(8)
					.forEach((item, i) => {
						panel.s10.AppendMenuItem(MF_STRING, i + 1010, item.name);
					})
				panel.s10.AppendTo(panel.m, MF_STRING, 'Restore');
				panel.m.AppendMenuSeparator();
			}
			break;
		case 'lastfm_info':
			panel.m.AppendMenuItem(MF_STRING, 1100, 'Similar artists');
			panel.m.AppendMenuItem(MF_STRING, 1101, 'User Charts');
			panel.m.AppendMenuItem(MF_STRING, 1102, 'Recent Tracks');
			panel.m.CheckMenuRadioItem(1100, 1102, this.properties.mode.value + 1100);
			panel.m.AppendMenuSeparator();
			if (this.properties.mode.value < 2) {
				panel.s10.AppendMenuItem(MF_STRING, 1110, 'Open Last.fm website');
				panel.s10.AppendMenuItem(MF_STRING, 1111, 'Autoplaylist');
				panel.s10.CheckMenuRadioItem(1110, 1111, this.properties.link.value + 1110);
				panel.s10.AppendTo(panel.m, this.properties.mode.value == 0 || this.properties.method.value == 0 ? MF_STRING : MF_GRAYED, 'Links');
				panel.m.AppendMenuSeparator();
			}
			if (this.properties.mode.value == 1) {
				_.forEach(this.methods, (item, i) => {
					panel.m.AppendMenuItem(MF_STRING, i + 1120, _.capitalize(item.display));
				});
				panel.m.CheckMenuRadioItem(1120, 1122, this.properties.method.value + 1120);
				panel.m.AppendMenuSeparator();
				_.forEach(this.periods, (item, i) => {
					panel.m.AppendMenuItem(MF_STRING, i + 1130, _.capitalize(item.display));
				});
				panel.m.CheckMenuRadioItem(1130, 1135, this.properties.period.value + 1130);
				panel.m.AppendMenuSeparator();
				panel.m.AppendMenuItem(MF_STRING, 1140, 'Bar colour...');
				panel.m.AppendMenuSeparator();
			}
			panel.m.AppendMenuItem(MF_STRING, 1150, 'Last.fm username...');
			panel.m.AppendMenuSeparator();
			break;
		case 'musicbrainz':
			panel.m.AppendMenuItem(MF_STRING, 1200, 'Releases');
			panel.m.AppendMenuItem(MF_STRING, 1201, 'Links');
			panel.m.CheckMenuRadioItem(1200, 1201, this.properties.mode.value + 1200);
			panel.m.AppendMenuSeparator();
			if (!_isUUID(this.mb_id)) {
				panel.m.AppendMenuItem(MF_GRAYED, 1203, 'Artist MBID missing. Use Musicbrainz Picard or foo_musicbrainz to tag your files.');
				panel.m.AppendMenuSeparator();
			}
			break;
		case 'properties':
			panel.m.AppendMenuItem(MF_STRING, 1300, 'Metadata');
			panel.m.CheckMenuItem(1300, this.properties.meta.enabled);
			panel.m.AppendMenuItem(MF_STRING, 1301, 'Location');
			panel.m.CheckMenuItem(1301, this.properties.location.enabled);
			panel.m.AppendMenuItem(MF_STRING, 1302, 'Tech Info');
			panel.m.CheckMenuItem(1302, this.properties.tech.enabled);
			panel.m.AppendMenuItem(this.foo_playcount ? MF_STRING : MF_GRAYED, 1303, 'Playback Statistics (foo_playcount)');
			panel.m.CheckMenuItem(1303, this.foo_playcount && this.properties.playcount.enabled);
			panel.m.AppendMenuItem(MF_STRING, 1304, 'Spider Monkey Panel Stats');
			panel.m.CheckMenuItem(1304, this.properties.stats.enabled);
			panel.m.AppendMenuItem(MF_STRING, 1305, 'Replaygain');
			panel.m.CheckMenuItem(1305, this.properties.rg.enabled);
			panel.m.AppendMenuSeparator();
			break;
		case 'queue_viewer':
			panel.m.AppendMenuItem(MF_STRING, 1400, 'Item display title formatting...');
			panel.m.AppendMenuItem(this.data.length ? MF_STRING : MF_GRAYED, 1401, 'Flush playback queue');
			panel.m.AppendMenuSeparator();
			break;
		}
		if (this.mode != 'queue_viewer') {
			panel.m.AppendMenuItem(_isFile(this.filename) ? MF_STRING : MF_GRAYED, 1999, 'Open containing folder');
			panel.m.AppendMenuSeparator();
		}
	}
	
	this.rbtn_up_done = (idx) => {
		switch (idx) {
		case 1000:
			this.add();
			break;
		case 1010:
		case 1011:
		case 1012:
		case 1013:
		case 1014:
		case 1015:
		case 1016:
		case 1017:
			const item = idx - 1010;
			this.data.push(this.deleted_items[item]);
			this.deleted_items.splice(item, 1);
			this.save();
			break;
		case 1100:
			this.properties.mode.value = 0;
			this.reset();
			break;
		case 1101:
		case 1102:
			this.properties.mode.value = idx - 1100;
			this.update();
			break;
		case 1110:
		case 1111:
			this.properties.link.value = idx - 1110;
			this.update();
			break;
		case 1120:
		case 1121:
		case 1122:
			this.properties.method.value = idx - 1120;
			this.update();
			break;
		case 1130:
		case 1131:
		case 1132:
		case 1133:
		case 1134:
		case 1135:
			this.properties.period.value = idx - 1130;
			this.update();
			break;
		case 1140:
			this.properties.colour.value = utils.ColourPicker(window.ID, this.properties.colour.value);
			window.Repaint();
			break;
		case 1150:
			lastfm.update_username();
			break;
		case 1200:
		case 1201:
			this.properties.mode.value = idx - 1200;
			this.reset();
			break;
		case 1300:
			this.properties.meta.toggle();
			panel.item_focus_change();
			break;
		case 1301:
			this.properties.location.toggle();
			panel.item_focus_change();
			break;
		case 1302:
			this.properties.tech.toggle();
			panel.item_focus_change();
			break;
		case 1303:
			this.properties.playcount.toggle();
			panel.item_focus_change();
			break;
		case 1304:
			this.properties.stats.toggle();
			panel.item_focus_change();
			break;
		case 1305:
			this.properties.rg.toggle();
			panel.item_focus_change();
			break;
		case 1400:
			let tmp = utils.InputBox(window.ID, 'Enter title formatting', window.ScriptInfo.Name, this.properties.tf.value);
			this.properties.tf.value = tmp || this.properties.tf.default_;
			this.tfo = fb.TitleFormat(this.properties.tf.value);
			this.update();
			break;
		case 1401:
			plman.FlushPlaybackQueue();
			break;
		case 1999:
			_explorer(this.filename);
			break;
		}
	}
	
	this.key_down = (k) => {
		switch (k) {
		case VK_UP:
			this.wheel(1);
			return true;
		case VK_DOWN:
			this.wheel(-1);
			return true;
		default:
			return false;
		}
	}
	
	this.update = () => {
		this.data = [];
		this.spacer_w = _textWidth('0000', panel.fonts.normal);
		switch (this.mode) {
		case 'autoplaylists':
			if (_isFile(this.filename)) {
				this.data = _(_jsonParseFile(this.filename))
					.forEach((item) => {
						item.width = _textWidth(item.name, panel.fonts.normal);
					})
			}
			break;
		case 'lastfm_info':
			this.filename = '';
			switch (this.properties.mode.value) {
			case 0:
				this.filename = _artistFolder(this.artist) + 'lastfm.artist.getSimilar.json';
				if (_isFile(this.filename)) {
					this.data = _(_.get(_jsonParseFile(this.filename), 'similarartists.artist', []))
						.map((item) => ({
							name : item.name,
							width : _textWidth(item.name, panel.fonts.normal),
							url : this.properties.link.value == 0 ? item.url : 'artist HAS ' + item.name
						}))
						.value();
					if (_fileExpired(this.filename, ONE_DAY)) {
						this.get();
					}
				} else {
					this.get();
				}
				break;
			case 1:
				if (!lastfm.username.length) {
					console.log(N, 'Last.fm username not set.');
					break;
				}
				this.filename = folders.lastfm + lastfm.username + '.' + this.methods[this.properties.method.value].method + '.' + this.periods[this.properties.period.value].period + '.json';
				if (_isFile(this.filename)) {
					let data = _.get(_jsonParseFile(this.filename), this.methods[this.properties.method.value].json, []);
					for (let i = 0; i < data.length; i++) {
						let name, url;
						if (this.properties.method.value == 0) {
							name = data[i].name;
							url = this.properties.link.value == 0 ? data[i].url : 'artist HAS ' + name;
						} else {
							name = data[i].artist.name + ' - ' + data[i].name;
							url = data[i].url;
						}
						this.data[i] = {
							name : name,
							width : _textWidth(name, panel.fonts.normal),
							url : url,
							playcount : data[i].playcount,
							rank : i > 0 && data[i].playcount == data[i - 1].playcount ? this.data[i - 1].rank : i + 1
						};
					}
					if (_fileExpired(this.filename, ONE_DAY)) {
						this.get();
					}
				} else {
					this.get();
				}
				break;
			case 2:
				if (!lastfm.username.length) {
					console.log(N, 'Last.fm username not set.');
					break;
				}
				this.filename = folders.lastfm + lastfm.username + '.user.getRecentTracks.json';
				if (_isFile(this.filename)) {
					this.data = _(_.get(_jsonParseFile(this.filename), 'recenttracks.track', []))
						.filter('date')
						.map((item) => {
							const name = item.artist['#text'] + ' - ' + item.name;
							return {
								name : name,
								width : _textWidth(name, panel.fonts.normal),
								url : item.url
							};
						})
						.value();
				} else {
					this.get();
				}
			}
			break;
		case 'musicbrainz':
			if (this.properties.mode.value == 0) {
				this.mb_data = [];
				this.mb_offset = 0;
				this.attempt = 1;
				this.filename = _artistFolder(this.artist) + 'musicbrainz.releases.' + this.mb_id + '.json';
				if (_isFile(this.filename)) {
					let data = _(_jsonParseFile(this.filename))
						.orderBy(['first-release-date', 'title'], ['desc', 'asc'])
						.map((item) => ({
							name : item.title,
							width : _textWidth(item.title, panel.fonts.normal),
							url : 'https://musicbrainz.org/release-group/' + item.id,
							date : item['first-release-date'].substring(0, 4),
							primary : item['primary-type'],
							secondary : item['secondary-types'].sort()[0] || null
						}))
						.nest(['primary', 'secondary'])
						.value()
					_.forEach(['Album', 'Single', 'EP', 'Other', 'Broadcast', 'null'], (primary) => {
						_.forEach(['null', 'Audiobook', 'Compilation', 'Demo', 'DJ-mix', 'Interview', 'Live', 'Mixtape/Street', 'Remix', 'Spokenword', 'Soundtrack'], (secondary) => {
							let group = _.get(data, primary + '.' + secondary);
							if (group) {
								const name = (primary + ' + ' + secondary).replace('null + null', 'Unspecified type').replace('null + ', '').replace(' + null', '');
								this.data.push({name : name, width : 0, url : '', date : ''});
								this.data = [...this.data, ...group];
								this.data.push({name : '', width : 0, url : '', date : ''});
							}
						});
					});
					this.data.pop();
					if (_fileExpired(this.filename, ONE_DAY)) {
						this.get();
					}
				} else {
					this.get();
				}
			} else {
				this.filename = _artistFolder(this.artist) + 'musicbrainz.links.' + this.mb_id + '.json';
				if (_isFile(this.filename)) {
					this.data = _(_.get(_jsonParseFile(this.filename), 'relations', []))
						.map((item) => {
							const url = decodeURIComponent(item.url.resource);
							return {
								name : url,
								url : url,
								width : _textWidth(url, panel.fonts.normal)
							};
						})
						.sortBy((item) => {
							return item.name.split('//')[1].replace('www.', '');
						})
						.value();
					const url = 'https://musicbrainz.org/artist/' + this.mb_id;
					this.data.unshift({
						name : url,
						url : url,
						width : _textWidth(url, panel.fonts.normal)
					});
					if (_fileExpired(this.filename, ONE_DAY)) {
						this.get();
					}
				} else {
					this.get();
				}
			}
			break;
		case 'properties':
			this.text_x = 0;
			this.filename = panel.metadb.Path;
			let fileinfo = panel.metadb.GetFileInfo();
			if (this.properties.meta.enabled) {
				this.add_meta(fileinfo);
			}
			if (this.properties.location.enabled) {
				this.add_location();
			}
			if (this.properties.tech.enabled) {
				this.add_tech(fileinfo);
			}
			if (this.custom_fields) {
				this.add_custom();
			}
			if (this.foo_playcount && this.properties.playcount.enabled) {
				this.add_playcount();
			}
			if (this.properties.stats.enabled) {
				this.add_stats();
			}
			if (this.properties.rg.enabled) {
				this.add_rg();
			}
			this.data.pop();
			_.forEach(this.data, (item) => {
				item.width = _textWidth(item.value, panel.fonts.normal);
				this.text_x = Math.max(this.text_x, _textWidth(item.name, panel.fonts.normal) + 20);
			});
			break;
		case 'queue_viewer':
			let items = plman.GetPlaybackQueueHandles();
			this.data = _.map(this.tfo.EvalWithMetadbs(items), (item) => ({ name : item }));
			break;
		}
		this.items = this.data.length;
		this.offset = 0;
		this.index = 0;
		window.Repaint();
	}
	
	this.get = () => {
		let url;
		const f = this.filename;
		switch (this.mode) {
		case 'lastfm_info':
			switch (this.properties.mode.value) {
			case 0:
				if (!_tagged(this.artist)) {
					return;
				}
				url = lastfm.get_base_url() + '&limit=100&method=artist.getSimilar&artist=' + encodeURIComponent(this.artist);
				break;
			case 1:
				url = lastfm.get_base_url() + '&limit=100&method=' + this.methods[this.properties.method.value].method + '&period=' + this.periods[this.properties.period.value].period + '&user=' + lastfm.username;
				break;
			case 2:
				url = lastfm.get_base_url() + '&limit=100&method=user.getRecentTracks&user=' + lastfm.username;
				break;
			}
			break;
		case 'musicbrainz':
			if (!_isUUID(this.mb_id)) {
				return console.log(N, 'Invalid/missing MBID');
			}
			if (this.properties.mode.value == 0) {
				url = 'https://musicbrainz.org/ws/2/release-group?fmt=json&limit=100&offset=' + this.mb_offset + '&artist=' + this.mb_id;
			} else {
				url = 'https://musicbrainz.org/ws/2/artist/' + this.mb_id + '?fmt=json&inc=url-rels';
			}
			break;
		default:
			return;
		}
		this.xmlhttp.open('GET', url, true);
		this.xmlhttp.setRequestHeader('User-Agent', this.ua);
		this.xmlhttp.setRequestHeader('If-Modified-Since', 'Thu, 01 Jan 1970 00:00:00 GMT');
		this.xmlhttp.send();
		this.xmlhttp.onreadystatechange = () => {
			if (this.xmlhttp.readyState == 4) {
				switch (true) {
				case this.xmlhttp.status == 200:
					this.success(f);
					break;
				case this.xmlhttp.status == 503 && this.mode == 'musicbrainz' && this.attempt < 5:
					window.SetTimeout(this.mb_retry, 1500);
					break;
				default:
					console.log(N, 'HTTP error:', this.xmlhttp.status);
					this.xmlhttp.responseText && console.log(this.xmlhttp.responseText);
					break;
				}
			}
		}
	}
	
	this.success = (f) => {
		let data;
		switch (true) {
		case this.mode == 'musicbrainz' && this.properties.mode.value == 0: // releases
			data = _jsonParse(this.xmlhttp.responseText);
			const max_offset = Math.min(500, data['release-group-count'] || 0) - 100;
			let rg = data['release-groups'] || [];
			if (rg.length) {
				this.mb_data = [...this.mb_data, ...rg];
			}
			if (this.mb_offset < max_offset) {
				this.mb_offset += 100;
				this.get();
			} else {
				if (_save(f, JSON.stringify(this.mb_data))) {
					this.reset();
				}
			}
			break;
		case this.mode == 'musicbrainz': // links
			if (_save(f, this.xmlhttp.responseText)) {
				this.reset();
			}
			break;
		case this.mode == 'lastfm_info':
			data = _jsonParse(this.xmlhttp.responseText);
			if (data.error) {
				return console.log(N, data.message);
			}
			if (this.properties.mode.value == 0) {
				// last.fm playing up again so don't overwrite cached data with nothing
				if (_.get(data, 'similarartists.artist', []).length == 0) {
					return;
				}
				if (_save(f, this.xmlhttp.responseText)) {
					this.reset();
				}
			} else {
				if (_save(f, this.xmlhttp.responseText)) {
					this.update();
				}
			}
			break;
		}
	}
	
	this.header_text = () => {
		switch (this.mode) {
		case 'autoplaylists':
			return 'Autoplaylists';
		case 'lastfm_info':
			switch (this.properties.mode.value) {
			case 0:
				return this.artist + ': similar artists';
			case 1:
				return lastfm.username + ': ' + this.periods[this.properties.period.value].display + ' ' + this.methods[this.properties.method.value].display + ' charts';
			case 2:
				return lastfm.username + ': recent tracks';
			}
			break;
		case 'musicbrainz':
			return this.artist + ': ' + (this.properties.mode.value == 0 ? 'releases' : 'links');
		case 'properties':
			return panel.tf('%artist% - %title%');
		case 'queue_viewer':
			return 'Queue Viewer';
		}
	}
	
	this.reset = () => {
		this.items = 0;
		this.data = [];
		this.artist = '';
		panel.item_focus_change();
	}
	
	this.init = () => {
		switch (this.mode) {
		case 'autoplaylists':
			this.save = () => {
				_save(this.filename, JSON.stringify(this.data, this.replacer));
				this.update();
			}
			
			this.replacer = (key, value) => {
				return key == 'width' ? undefined : value;
			}
			
			this.add = () => {
				const new_name = utils.InputBox(window.ID, 'Enter autoplaylist name', window.ScriptInfo.Name);
				if (!new_name.length) {
					return;
				}
				const new_query = utils.InputBox(window.ID, 'Enter autoplaylist query', window.ScriptInfo.Name);
				if (!new_query.length) {
					return;
				}
				const new_sort = utils.InputBox(window.ID, 'Enter sort pattern\n\n(optional)', window.ScriptInfo.Name);
				const new_forced = (new_sort.length ? WshShell.Popup('Force sort?', 0, window.ScriptInfo.Name, popup.question + popup.yes_no) : popup.no) == popup.yes;
				this.data.push({
					name : new_name,
					query : new_query,
					sort : new_sort,
					forced : new_forced
				});
				this.edit_done(this.data.length - 1);
			}
			
			this.edit = (x, y) => {
				const z = this.index;
				_tt('');
				let m = window.CreatePopupMenu();
				m.AppendMenuItem(MF_STRING, 1, 'Run query');
				m.AppendMenuSeparator();
				m.AppendMenuItem(MF_STRING, 2, 'Rename...');
				m.AppendMenuItem(MF_STRING, 3, 'Edit query...');
				m.AppendMenuItem(MF_STRING, 4, 'Edit sort pattern...');
				m.AppendMenuItem(MF_STRING, 5, 'Force Sort');
				m.CheckMenuItem(5, this.data[z].forced);
				m.AppendMenuSeparator();
				m.AppendMenuItem(z > 0 ? MF_STRING : MF_GRAYED, 6, 'Move up');
				m.AppendMenuItem(z < this.data.length - 1 ? MF_STRING : MF_GRAYED, 7, 'Move down');
				m.AppendMenuSeparator();
				m.AppendMenuItem(MF_STRING, 8, 'Delete');
				const idx = m.TrackPopupMenu(x, y);
				switch (idx) {
				case 1:
					this.run_query(this.data[z].name, this.data[z].query, this.data[z].sort, this.data[z].forced);
					break;
				case 2:
					const new_name = utils.InputBox(window.ID, 'Rename autoplaylist', window.ScriptInfo.Name, this.data[z].name);
					if (new_name.length && new_name != this.data[z].name) {
						this.data[z].name = new_name;
						this.edit_done(z);
					}
					break;
				case 3:
					const new_query = utils.InputBox(window.ID, 'Enter autoplaylist query', window.ScriptInfo.Name, this.data[z].query);
					if (new_query.length && new_query != this.data[z].query) {
						this.data[z].query = new_query;
						this.edit_done(z);
					}
					break;
				case 4:
					const new_sort = utils.InputBox(window.ID, 'Enter sort pattern\n\n(optional)', window.ScriptInfo.Name, this.data[z].sort);
					if (new_sort != this.data[z].sort) {
						this.data[z].sort = new_sort;
						if (new_sort.length) {
							this.data[z].forced = WshShell.Popup('Force sort?', 0, window.ScriptInfo.Name, popup.question + popup.yes_no) == popup.yes;
						}
						this.edit_done(z);
					}
					break;
				case 5:
					this.data[z].forced = !this.data[z].forced;
					this.edit_done(z);
					break;
				case 6:
				case 7:
					let tmp = this.data[z];
					this.data.splice(z, 1);
					this.data.splice(idx == 6 ? z - 1 : z + 1, 0, tmp);
					this.save();
					break;
				case 8:
					this.deleted_items.unshift(this.data[z]);
					this.data.splice(z, 1);
					this.save();
					break;
				}
			}
			
			this.edit_done = (z) => {
				this.run_query(this.data[z].name, this.data[z].query, this.data[z].sort, this.data[z].forced);
				this.save();
			}
			
			this.run_query = (n, q, s, f) => {
				let i = 0;
				while (i < plman.PlaylistCount) {
					if (plman.GetPlaylistName(i) == n) {
						plman.RemovePlaylist(i);
					} else {
						i++;
					}
				}
				try {
					plman.CreateAutoPlaylist(plman.PlaylistCount, n, q, s, f ? 1 : 0);
					plman.ActivePlaylist = plman.PlaylistCount - 1;
				} catch (e) {
					fb.ShowPopupMessage(`${e}`);
				}
			}
			
			_createFolder(folders.data);
			this.deleted_items = [];
			this.filename = folders.data + 'autoplaylists.json';
			this.update();
			break;
		case 'lastfm_info':
			_createFolder(folders.data);
			_createFolder(folders.artists);
			_createFolder(folders.lastfm);
			this.time_elapsed = 0;
			this.ua = lastfm.ua;
			this.methods = [{
					method : 'user.getTopArtists',
					json : 'topartists.artist',
					display : 'artist'
				}, {
					method : 'user.getTopAlbums',
					json : 'topalbums.album',
					display : 'album'
				}, {
					method : 'user.getTopTracks',
					json : 'toptracks.track',
					display : 'track'
				}
			];
			this.periods = [{
					period : 'overall',
					display : 'overall'
				}, {
					period : '7day',
					display : 'last 7 days'
				}, {
					period : '1month',
					display : '1 month'
				}, {
					period : '3month',
					display : '3 month'
				}, {
					period : '6month',
					display : '6 month'
				}, {
					period : '12month',
					display : '12 month'
				}
			];
			this.properties = {
				mode : new _p('2K3.LIST.LASTFM.MODE', 0), // 0 similar artists 1 charts
				method : new _p('2K3.LIST.LASTFM.CHARTS.METHOD', 0),
				period : new _p('2K3.LIST.LASTFM.CHARTS.PERIOD', 0),
				colour : new _p('2K3.LIST.LASTFM.CHARTS.BAR.COLOUR', _RGB(60, 60, 60)),
				link : new _p('2K3.LIST.LASTFM.LINK', 0) // 0 last.fm website 1 autoplaylist
			};
			if (this.properties.mode.value > 0) {
				this.update();
			}
			break;
		case 'musicbrainz':
			this.mb_retry = () => {
				console.log(N, 'Retrying...');
				this.attempt++;
				this.get();
			}
			
			_createFolder(folders.data);
			_createFolder(folders.artists);
			this.ua = 'foo_jscript_panel_musicbrainz +https://github.com/marc2k3';
			this.mb_id = '';
			this.properties = {
				mode : new _p('2K3.LIST.MUSICBRAINZ.MODE', 0) // 0 releases 1 links
			};
			break;
		case 'properties':
			this.add_meta = (f) => {
				for (let i = 0; i < f.MetaCount; i++) {
					let name = f.MetaName(i);
					let num = f.MetaValueCount(i);
					for (let j = 0; j < num; j++) {
						let url;
						let value = f.MetaValue(i, j).replace(/\s{2,}/g, ' ');
						if (_isUUID(value)) {
							switch (name.toUpperCase()) {
							case 'MUSICBRAINZ_ARTISTID':
							case 'MUSICBRAINZ_ALBUMARTISTID':
							case 'MUSICBRAINZ ARTIST ID':
							case 'MUSICBRAINZ ALBUM ARTIST ID':
								url = 'https://musicbrainz.org/artist/' + value;
								break;
							case 'MUSICBRAINZ_ALBUMID':
							case 'MUSICBRAINZ ALBUM ID':
								url = 'https://musicbrainz.org/release/' + value;
								break;
							case 'MUSICBRAINZ_RELEASEGROUPID':
							case 'MUSICBRAINZ RELEASE GROUP ID':
								url = 'https://musicbrainz.org/release-group/' + value;
								break;
							case 'MUSICBRAINZ_RELEASETRACKID':
							case 'MUSICBRAINZ RELEASE TRACK ID':
								url = 'https://musicbrainz.org/track/' + value;
								break;
							case 'MUSICBRAINZ_TRACKID':
							case 'MUSICBRAINZ TRACK ID':
								url = 'https://musicbrainz.org/recording/' + value;
								break;
							case 'MUSICBRAINZ_WORKID':
							case 'MUSICBRAINZ WORK ID':
								url = 'https://musicbrainz.org/work/' + value;
								break;
							default:
								url = name.toLowerCase() + (num == 1 ? ' IS ' : ' HAS ') + value;
								break;
							}
						} else {
							url = name.toLowerCase() + (num == 1 ? ' IS ' : ' HAS ') + value;
						}
						this.data.push({
							name : j == 0 ? name.toUpperCase() : '',
							value : value,
							url : url
						});
					}
				}
				if (this.data.length) { // only add blank line if there is some metadata
					this.add();
				}
			}
			
			this.add_location = () => {
				let names = ['FILE NAME', 'FOLDER NAME', 'FILE PATH', 'SUBSONG INDEX', 'FILE SIZE', 'LAST MODIFIED'];
				let values = [panel.tf('%filename_ext%'), panel.tf('$directory_path(%path%)'), this.filename, panel.metadb.SubSong, panel.tf('[%filesize_natural%]'), panel.tf('[%last_modified%]')];
				let urls = ['%filename_ext% IS ', '"$directory_path(%path%)" IS ', '%path% IS ', '%subsong% IS ', '%filesize_natural% IS ', '%last_modified% IS '];
				for (let i = 0; i < 6; i++) {
					this.data.push({
						name : names[i],
						value : values[i],
						url : urls[i] + values[i]
					});
				}
				this.add();
			}
			
			this.add_tech = (f) => {
				const duration = utils.FormatDuration(Math.max(0, panel.metadb.Length));
				const samples = _formatNumber(panel.tf('%length_samples%'), ' ');
				this.data.push({
					name : 'DURATION',
					value : duration + ' (' + samples + ' samples)',
					url : '%length% IS ' + duration
				});
				let tmp = [];
				for (let i = 0; i < f.InfoCount; i++) {
					const name = f.InfoName(i);
					const value = f.InfoValue(i).replace(/\s{2,}/g, ' ');
					tmp.push({
						name : name.toUpperCase(),
						value : value,
						url : '%__' + name.toLowerCase() + '% IS ' + value
					});
				}
				this.data = [...this.data, ...(_.orderBy(tmp, 'name'))];
				this.add();
			}
			
			this.add_custom = () => {
				this.add(this.custom_fields);
				this.add();
			}
			
			this.add_playcount = () => {
				this.add(['PLAY_COUNT', 'FIRST_PLAYED', 'LAST_PLAYED', 'ADDED', 'RATING']);
				this.add();
			}
			
			this.add_stats = () => {
				this.add(['SMP_PLAYCOUNT', 'SMP_LOVED', 'SMP_FIRST_PLAYED', 'SMP_LAST_PLAYED', 'SMP_RATING']);
				this.add();
			}
			
			this.add_rg = () => {
				this.add(['REPLAYGAIN_ALBUM_GAIN', 'REPLAYGAIN_ALBUM_PEAK', 'REPLAYGAIN_TRACK_GAIN', 'REPLAYGAIN_TRACK_PEAK']);
				this.add();
			}
			
			this.add = (names) => {
				if (names) {
					this.data = [...this.data, ...(_.map(names, (item) => ({
						name : item,
						value : panel.tf('[%' + item + '%]'),
						url : '%' + item + '% IS ' + panel.tf('[%' + item + '%]')
					})))];
				} else {
					this.data.push({name : '', value : '', url : ''});
				}
			}
			
			this.properties = {
				meta : new _p('2K3.LIST.PROPERTIES.META', true),
				location : new _p('2K3.LIST.PROPERTIES.LOCATION', true),
				tech : new _p('2K3.LIST.PROPERTIES.TECH', true),
				playcount : new _p('2K3.LIST.PROPERTIES.PLAYCOUNT', true),
				stats: new _p('2K3.LIST.PROPERTIES.STATS', true),
				rg : new _p('2K3.LIST.PROPERTIES.RG', true)
			};
			
			this.foo_playcount = _cc('foo_playcount');
			break;
		case 'queue_viewer':
			this.properties = {
				tf : new _p('2K3.LIST.QUEUE.TF', '%artist% - %title%')
			};
			this.tfo = fb.TitleFormat(this.properties.tf.value);
			this.update();
			break;
		}
	}
	
	panel.list_objects.push(this);
	this.mode = mode;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.mx = 0;
	this.my = 0;
	this.index = 0;
	this.offset = 0;
	this.items = 0;
	this.text_x = 0;
	this.spacer_w = 0;
	this.artist = '';
	this.filename = '';
	this.up_btn = new _sb(chars.up, this.x, this.y, _scale(12), _scale(12), () => { return this.offset > 0; }, () => { this.wheel(1); });
	this.down_btn = new _sb(chars.down, this.x, this.y, _scale(12), _scale(12), () => { return this.offset < this.items - this.rows; }, () => { this.wheel(-1); });
	this.xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
	this.init();
}
