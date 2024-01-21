'use strict';

function _rating(x, y, size, colour) {
	this.paint = (gr) => {
		if (panel.metadb) {
			gr.SetTextRenderingHint(4);
			for (let i = 0; i < this.get_max(); i++) {
				gr.DrawString(i + 1 > (this.hover ? this.hrating : this.rating) ? chars.rating_off : chars.rating_on, this.font, this.colour, this.x + (i * this.h), this.y, this.h, this.h, SF_CENTRE);
			}
		}
	}
	
	this.metadb_changed = () => {
		if (panel.metadb) {
			this.hover = false;
			this.rating = this.get_rating();
			this.hrating = this.rating;
			this.tiptext = this.properties.mode.value == 0 ? 'Choose a mode first.' : panel.tf('Rate "%title%" by "%artist%".');
		}
		window.Repaint();
	}
	
	this.trace = (x, y) => {
		return x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h;
	}
	
	this.move = (x, y) => {
		if (this.trace(x, y)) {
			if (panel.metadb) {
				_tt(this.tiptext);
				this.hover = true;
				this.hrating = Math.ceil((x - this.x) / this.h);
				window.RepaintRect(this.x, this.y, this.w, this.h);
			}
			return true;
		} else {
			this.leave();
			return false;
		}
	}
	
	this.leave = () => {
		if (this.hover) {
			_tt('');
			this.hover = false;
			window.RepaintRect(this.x, this.y, this.w, this.h);
		}
	}
	
	this.lbtn_up = (x, y) => {
		if (this.trace(x, y)) {
			if (panel.metadb) {
				this.set_rating();
			}
			return true;
		} else {
			return false;
		}
	}
	
	this.rbtn_up = (x, y) => {
		_.forEach(this.modes, (item, i) => {
			panel.s10.AppendMenuItem(i == 1 && !this.foo_playcount ? MF_GRAYED : MF_STRING, i + 1000, item);
		});
		panel.s10.CheckMenuRadioItem(1000, 1003, this.properties.mode.value + 1000);
		panel.s10.AppendTo(panel.m, MF_STRING, 'Mode');
		panel.m.AppendMenuItem(this.properties.mode.value == 2 ? MF_STRING : MF_GRAYED, 1004, 'Tag name');
		panel.m.AppendMenuItem(this.properties.mode.value > 1 ? MF_STRING : MF_GRAYED, 1005, 'Max value...');
		panel.m.AppendMenuSeparator();
	}
	
	this.rbtn_up_done = (idx) => {
		let tmp;
		switch (true) {
		case idx <= 1003:
			this.properties.mode.value = idx - 1000;
			break;
		case idx == 1004:
			tmp = utils.InputBox(window.ID, 'Enter a custom tag name. Do not use %%. Defaults to "rating" if left blank.', window.ScriptInfo.Name, this.properties.tag.value);
			this.properties.tag.value = tmp || this.properties.tag.default_;
			break;
		case idx == 1005:
			tmp = utils.InputBox(window.ID, 'Enter a maximum value. Defaults to "5" if left blank.', window.ScriptInfo.Name, this.properties.max.value);
			this.properties.max.value = tmp || this.properties.max.default_;
			break;
		}
		this.w = this.h * this.get_max();
		panel.item_focus_change();
	}
	
	this.get_rating = () => {
		switch (this.properties.mode.value) {
		case 1: // foo_playcount
			return panel.tf('$if2(%rating%,0)');
		case 2: // file tag
			let f = panel.metadb.GetFileInfo();
			const idx = f.MetaFind(this.properties.tag.value);
			const ret = idx > -1 ? f.MetaValue(idx, 0) : 0;
			return ret;
		case 3: // Spider Monkey Panel DB
			return panel.tf('$if2(%smp_rating%,0)');
		default:
			return 0;
		}
	}
	
	this.set_rating = () => {
		switch (this.properties.mode.value) {
		case 1: // foo_playcount
			fb.RunContextCommandWithMetadb('Playback Statistics/Rating/' + (this.hrating == this.rating ? '<not set>' : this.hrating), panel.metadb, 8);
			break;
		case 2: // file tag
			const tmp = this.hrating == this.rating ? '' : this.hrating;
			let obj = {};
			obj[this.properties.tag.value] = tmp;
			let handles = new FbMetadbHandleList(panel.metadb);
			handles.UpdateFileInfoFromJSON(JSON.stringify(obj));
			break;
		case 3: // Spider Monkey Panel DB
			panel.metadb.SetRating(this.hrating == this.rating ? 0 : this.hrating);
			panel.metadb.RefreshStats();
			break;
		}
	}
	
	this.get_max = () => {
		return this.properties.mode.value < 2 ? 5 : this.properties.max.value;
	}
	
	this.properties = {
		mode : new _p('2K3.RATING.MODE', 0), // 0 not set 1 foo_playcount 2 file tag 3 Spider Monkey Panel DB
		max : new _p('2K3.RATING.MAX', 5), // only use for file tag/Spider Monkey Panel DB
		tag: new _p('2K3.RATING.TAG', 'rating')
	};
	this.x = x;
	this.y = y;
	this.h = _scale(size);
	this.w = this.h * this.get_max();
	this.colour = colour;
	this.hover = false;
	this.rating = 0;
	this.hrating = 0;
	this.font = gdi.Font('FontAwesome', this.h - 2);
	this.modes = ['Not Set', 'foo_playcount', 'File Tag', 'Spider Monkey Panel DB'];
	this.foo_playcount = _cc('foo_playcount');
	window.SetTimeout(() => {
		if (this.properties.mode.value == 1 && !this.foo_playcount) { // if mode is set to 1 (foo_playcount) but component is missing, reset to 0.
			this.properties.mode.value = 0;
		}
		if (this.properties.mode.value == 0) {
			fb.ShowPopupMessage('This script has now been updated and supports 3 different modes.\n\nAs before, you can use foo_playcount which is limited to 5 stars.\n\nThe 2nd option is writing to your file tags. You can choose the tag name and a max value via the right click menu.\n\nLastly, a new "Playback Stats" database has been built into Spider Monkey Panel. It is bound to just "%artist% - %title%". This uses %smp_rating% which can be accessed via title formatting in all other components/search dialogs. This also supports a custom max value.\n\nAll options are available on the right click menu. If you do not see the new options when right clicking, make sure you have the latest "rating.txt" imported from the "samples\\complete" folder.', window.ScriptInfo.Name);
		}
	}, 500);
}
