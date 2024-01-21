'use strict';

Array.prototype.srt=function(){for(var z=0,t;t=this[z];z++){this[z]=[];var x=0,y=-1,n=true,i,j;while(i=(j=t.charAt(x++)).charCodeAt(0)){var m=(i==46||(i>=48&&i<=57));if(m!==n){this[z][++y]='';n=m;}
this[z][y]+=j;}}
this.sort(function(a,b){for(var x=0,aa,bb;(aa=a[x])&&(bb=b[x]);x++){aa=aa.toLowerCase();bb=bb.toLowerCase();if(aa!==bb){var c=Number(aa),d=Number(bb);if(c==aa&&d==bb){return c-d;}else return(aa>bb)?1:-1;}}
return a.length-b.length;});for(var z=0;z<this.length;z++)
this[z]=this[z].join('');}

function on_script_unload() {
	_tt('');
	if (_bmp) {
		_bmp.ReleaseGraphics(_gr);
	}
	_gr = null;
	_bmp = null;
}

function _artistFolder(artist) {
	const a = _fbSanitise(artist);
	let folder = folders.artists + a;
	if (_isFolder(folder)) {
		return fso.GetFolder(folder) + '\\';
	} else {
		folder = folders.artists + _.truncate(a, { length : 64 });
		_createFolder(folder);
		return fso.GetFolder(folder) + '\\';
	}
}

function _blendColours(c1, c2, f) {
	c1 = _toRGB(c1);
	c2 = _toRGB(c2);
	const r = Math.round(c1[0] + f * (c2[0] - c1[0]));
	const g = Math.round(c1[1] + f * (c2[1] - c1[1]));
	const b = Math.round(c1[2] + f * (c2[2] - c1[2]));
	return _RGB(r, g, b);
}

function _button(x, y, w, h, img_src, fn, tiptext) {
	this.paint = (gr) => {
		if (this.img) {
			_drawImage(gr, this.img, this.x, this.y, this.w, this.h);
		}
	}
		
	this.trace = (x, y) => {
		return x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h;
	}
	
	this.lbtn_up = (x, y, mask) => {
		if (this.fn) {
			this.fn(x, y, mask);
		}
	}
	
	this.cs = (s) => {
		if (s == 'hover') {
			this.img = this.img_hover;
			_tt(this.tiptext);
		} else {
			this.img = this.img_normal;
		}
		window.RepaintRect(this.x, this.y, this.w, this.h);
	}
	
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.fn = fn;
	this.tiptext = tiptext;
	this.img_normal = typeof img_src.normal == 'string' ? _img(img_src.normal) : img_src.normal;
	this.img_hover = img_src.hover ? (typeof img_src.hover == 'string' ? _img(img_src.hover) : img_src.hover) : this.img_normal;
	this.img = this.img_normal;
}

function _buttons() {
	this.paint = (gr) => {
		_.invokeMap(this.buttons, 'paint', gr);
	}
	
	this.move = (x, y) => {
		let temp_btn = null;
		_.forEach(this.buttons, (item, i) => {
			if (item.trace(x, y)) {
				temp_btn = i;
			}
		});
		if (this.btn == temp_btn) {
			return this.btn;
		}
		if (this.btn) {
			this.buttons[this.btn].cs('normal');
		}
		if (temp_btn) {
			this.buttons[temp_btn].cs('hover');
		} else {
			_tt('');
		}
		this.btn = temp_btn;
		return this.btn;
	}
	
	this.leave = () => {
		if (this.btn) {
			_tt('');
			this.buttons[this.btn].cs('normal');
		}
		this.btn = null;
	}
	
	this.lbtn_up = (x, y, mask) => {
		if (this.btn) {
			this.buttons[this.btn].lbtn_up(x, y, mask);
			return true;
		} else {
			return false;
		}
	}
	
	this.buttons = {};
	this.btn = null;
}

function _cc(name) {
	return utils.CheckComponent(name, true);
}

function _chrToImg(chr, colour, font) {
	const size = 96;
	let temp_bmp = gdi.CreateImage(size, size);
	let temp_gr = temp_bmp.GetGraphics();
	temp_gr.SetTextRenderingHint(4);
	temp_gr.DrawString(chr, font || fontawesome, colour, 0, 0, size, size, SF_CENTRE);
	temp_bmp.ReleaseGraphics(temp_gr);
	temp_gr = null;
	return temp_bmp;
}

function _createFolder(folder) {
	if (!_isFolder(folder)) {
		fso.CreateFolder(folder);
	}
}

function _deleteFile(file) {
	if (_isFile(file)) {
		try {
			fso.DeleteFile(file);
		} catch (e) {
		}
	}
}

function _drawImage(gr, img, src_x, src_y, src_w, src_h, aspect, border, alpha) {
	if (!img) {
		return [];
	}
	gr.SetInterpolationMode(7);
	let dst_x, dst_y, dst_w, dst_h;
	switch (aspect) {
	case image.crop:
	case image.crop_top:
		if (img.Width / img.Height < src_w / src_h) {
			dst_w = img.Width;
			dst_h = Math.round(src_h * img.Width / src_w);
			dst_x = 0;
			dst_y = Math.round((img.Height - dst_h) / (aspect == image.crop_top ? 4 : 2));
		} else {
			dst_w = Math.round(src_w * img.Height / src_h);
			dst_h = img.Height;
			dst_x = Math.round((img.Width - dst_w) / 2);
			dst_y = 0;
		}
		gr.DrawImage(img, src_x, src_y, src_w, src_h, dst_x + 3, dst_y + 3, dst_w - 6, dst_h - 6, 0, alpha || 255);
		break;
	case image.stretch:
		gr.DrawImage(img, src_x, src_y, src_w, src_h, 0, 0, img.Width, img.Height, 0, alpha || 255);
		break;
	case image.centre:
	default:
		const s = Math.min(src_w / img.Width, src_h / img.Height);
		const w = Math.floor(img.Width * s);
		const h = Math.floor(img.Height * s);
		src_x += Math.round((src_w - w) / 2);
		src_y += Math.round((src_h - h) / 2);
		src_w = w;
		src_h = h;
		dst_x = 0;
		dst_y = 0;
		dst_w = img.Width;
		dst_h = img.Height;
		gr.DrawImage(img, src_x, src_y, src_w, src_h, dst_x, dst_y, dst_w, dst_h, 0, alpha || 255);
		break;
	}
	if (border) {
		gr.DrawRect(src_x, src_y, src_w - 1, src_h - 1, 1, border);
	}
	return [src_x, src_y, src_w, src_h];
}

function _drawOverlay(gr, x, y, w, h) {
	gr.FillGradRect(x, y, w, h, 90, _RGBA(0, 0, 0, 230), _RGBA(0, 0, 0, 200));
}

function _explorer(file) {
	if (_isFile(file)) {
		WshShell.Run('explorer /select,' + _q(file));
	}
}
function _fbDate(t) {
	const offset = new Date().getTimezoneOffset() * 60;
	if (typeof t == 'number') {
		t -= offset;
		const tmp = new Date(t * 1000).toISOString(); // ES5 only
		return tmp.substring(0, 10) + ' ' + tmp.substring(11, 19);
	} else {
		const tmp = new Date(t.substring(0, 10) + "T" + t.substring(11, 19) + "Z");
		return (Date.parse(tmp) / 1000) + offset;
	}
}

function _fbEscape(value) {
	return value.replace(/'/g, "''").replace(/[\(\)\[\],$]/g, "'$&'");
}

function _fbSanitise(value) {
	return value.replace(/[\/\\|:]/g, '-').replace(/\*/g, 'x').replace(/"/g, "''").replace(/[<>]/g, '_').replace(/\?/g, '').replace(/(?! )\s/g, '');
}

function _fileExpired(file, period) {
	return _.now() - _lastModified(file) > period;
}

function _formatNumber(number, separator) {
	return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}

function _gdiFont(name, size, style) {
	return gdi.Font(name, _scale(size), style);
}

function _getClipboardData() {
	try {
		return doc.parentWindow.clipboardData.getData('Text');
	} catch (e) {
		return null;
	}
}

function _getElementsByTagName(value, tag) {
	doc.open();
	let div = doc.createElement('div');
	div.innerHTML = value;
	let data = div.getElementsByTagName(tag);
	doc.close();
	return data;
}

function _getExt(path) {
	return path.split('.').pop().toLowerCase();
}

function _getFiles(folder, exts, newest_first) {
	let files = [];
	if (_isFolder(folder)) {
		let e = new Enumerator(fso.GetFolder(folder).Files);
		for (; !e.atEnd(); e.moveNext()) {
			const path = e.item().Path;
			files.push(path);
		}
	}
	if (exts) {
		files = _.filter(files, function (item) {
			let ext = _getExt(item);
			return exts.includes(ext);
		});
	}
	if (newest_first) {
		return _.orderBy(files, (item) => {
			return _lastModified(item);
		}, 'desc');
	} else {
		files.srt();
		return files;
	}
}

function _hacks() {
	this.disable = () => {
		this.uih.MainMenuState = this.MainMenuState.Show;
		this.uih.FrameStyle = this.FrameStyle.Default;
		this.uih.StatusBarState = true;
	}
	
	this.enable = () => {
		this.uih.MainMenuState = this.MainMenuState.Hide;
		this.uih.FrameStyle = this.FrameStyle.NoBorder;
		this.uih.StatusBarState = false;
	}
	
	this.set_caption = (x, y, w, h) => {
		this.uih.SetPseudoCaption(x, y, w, h);
	}
	
	this.MainMenuState = { Show : 0, Hide : 1, Auto : 2 };
	this.FrameStyle = { Default : 0, SmallCaption : 1, NoCaption : 2, NoBorder : 3 };
	this.MoveStyle = { Default : 0, Middle : 1, Left : 2, Both : 3 };
	
	this.uih = new ActiveXObject('UIHacks');
	this.uih.MoveStyle = this.MoveStyle.Default;
	this.uih.DisableSizing = false;
	this.uih.BlockMaximize = false;
	this.uih.MinSize = false;
	this.uih.MaxSize = false;
}

function _help(x, y, flags) {
	let m = window.CreatePopupMenu();
	_.forEach(ha_links, (item, i) => {
		m.AppendMenuItem(MF_STRING, i + 100, item[0]);
		if (i == 1) {
			m.AppendMenuSeparator();
		}
	});
	m.AppendMenuSeparator();
	m.AppendMenuItem(MF_STRING, 1, 'Configure...');
	const idx = m.TrackPopupMenu(x, y, flags);
	switch (true) {
	case idx == 0:
		break;
	case idx == 1:
		window.ShowConfigure();
		break;
	default:
		_run(ha_links[idx - 100][1]);
		break;
	}
}

function _img(value) {
	if (_isFile(value)) {
		return gdi.Image(value);
	} else {
		return gdi.Image(folders.images + value);
	}
}

function _isFile(file) {
	return _.isString(file) ? fso.FileExists(file) : false;
}

function _isFolder(folder) {
	return _.isString(folder) ? fso.FolderExists(folder) : false;
}

function _isUUID(value) {
	const re = /^[0-9a-f]{8}-[0-9a-f]{4}-[345][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
	return re.test(value);
}
function _jsonParse(value) {
	try {
		let data = JSON.parse(value);
		return data;
	} catch (e) {
		return [];
	}
}

function _jsonParseFile(file) {
	return _jsonParse(_open(file));
}

function _lastModified(file) {
	return Date.parse(fso.GetFile(file).DateLastModified);
}

function _lineWrap(value, font, width) {
	return _(_gr.EstimateLineWrap(value, font, width))
		.filter((item, i) => { return i % 2 == 0; })
		.map((line) => {
			// only trim if line begins with single space.
			if (line.startsWith(' ') && !line.startsWith('  ')) return _.trim(line);
			else return line;
		})
		.value()
}

function _lockSize(w, h) {
	window.MinWidth = window.MaxWidth = w;
	window.MinHeight = window.MaxHeight = h;
}

function _menu(x, y, flags) {
	let menu = window.CreatePopupMenu();
	let file = new _main_menu_helper('File', 1000, menu);
	let edit = new _main_menu_helper('Edit', 2000, menu);
	let view = new _main_menu_helper('View', 3000, menu);
	let playback = new _main_menu_helper('Playback', 4000, menu);
	let library = new _main_menu_helper('Library', 5000, menu);
	let help = new _main_menu_helper('Help', 6000, menu);
	
	let idx = menu.TrackPopupMenu(x, y, flags);
	switch (true) {
	case idx == 0:
		break;
	case idx < 2000:
		file.mm.ExecuteByID(idx - 1000);
		break;
	case idx < 3000:
		edit.mm.ExecuteByID(idx - 2000);
		break;
	case idx < 4000:
		view.mm.ExecuteByID(idx - 3000);
		break;
	case idx < 5000:
		playback.mm.ExecuteByID(idx - 4000);
		break;
	case idx < 6000:
		library.mm.ExecuteByID(idx - 5000);
		break;
	case idx < 7000:
		help.mm.ExecuteByID(idx - 6000);
		break;
	}
}

function _main_menu_helper(name, base_id, main_menu) {
	this.popup = window.CreatePopupMenu();
	this.mm = fb.CreateMainMenuManager();
	this.mm.Init(name);
	this.mm.BuildMenu(this.popup, base_id, -1);
	this.popup.AppendTo(main_menu, MF_STRING, name);
}

function _open(file) {
	if (_isFile(file)) {
		return utils.ReadTextFile(file);
	} else {
		return '';
	}
}

function _p(a, b) {
	Object.defineProperty(this, _.isBoolean(b) ? 'enabled' : 'value', {
		get() {
			return this.b;
		},
		set(value) {
			this.b = value;
			window.SetProperty(this.a, this.b);
		}
	});

	this.toggle = () => {
		this.b = !this.b;
		window.SetProperty(this.a, this.b);
	}

	this.a = a;
	this.b = window.GetProperty(a, b);
}

function _q(value) {
	return '"' + value + '"';
}

function _recycleFile(file) {
	if (_isFile(file)) {
		try {
			app.NameSpace(10).MoveHere(file);
		} catch (e) {
			console.log(N, 'Failed to recycle file:', file);
		}
	}
}

function _RGB(r, g, b) {
	return 0xFF000000 | r << 16 | g << 8 | b;
}

function _RGBA(r, g, b, a) {
	return a << 24 | r << 16 | g << 8 | b;
}

function _run() {
	try {
		WshShell.Run(_.map(arguments, _q).join(' '));
		return true;
	} catch (e) {
		return false;
	}
}

function _runCmd(command, wait) {
	try {
		WshShell.Run(command, 0, wait);
	} catch (e) {
	}
}

function _save(file, value) {
	if (_isFolder(utils.FileTest(file, 'split')[0]) && utils.WriteTextFile(file, value)) {
		return true;
	}
	console.log('Error saving to ' + file);
	return false;
}

function _sb(t, x, y, w, h, v, fn) {
	this.paint = (gr, colour) => {
		gr.SetTextRenderingHint(4);
		if (this.v()) {
			gr.DrawString(this.t, this.font, colour, this.x, this.y, this.w, this.h, SF_CENTRE);
		}
	}
	
	this.trace = (x, y) => {
		return x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h && this.v();
	}
	
	this.move = (x, y) => {
		if (this.trace(x, y)) {
			window.SetCursor(IDC_HAND);
			return true;
		} else {
			//window.SetCursor(IDC_ARROW);
			return false;
		}
	}
	
	this.lbtn_up = (x, y) => {
		if (this.trace(x, y)) {
			if (this.fn) {
				this.fn(x, y);
			}
			return true;
		} else {
			return false;
		}
	}
	
	this.t = t;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.v = v;
	this.fn = fn;
	this.font = gdi.Font('FontAwesome', this.h);
}

function _setClipboardData(value) {
	try {
		doc.parentWindow.clipboardData.setData('Text', value.toString());
	} catch(e) {
		console.log(N, 'Failed to set clipboard text.');
	}
}

function _scale(size) {
	return Math.round(size * DPI / 72);
}

function _stripTags(value) {
	doc.open();
	let div = doc.createElement('div');
	div.innerHTML = value.toString().replace(/<[Pp][^>]*>/g, '').replace(/<\/[Pp]>/g, '<br>').replace(/\n/g, '<br>');
	const tmp = _.trim(div.innerText);
	doc.close();
	return tmp;
}

function _tagged(value) {
	return value != '' && value != '?';
}

function _textWidth(value, font) {
	return _gr.CalcTextWidth(value, font);
}

function _toRGB(a) {
	const b = a - 0xFF000000;
	return [b >> 16, b >> 8 & 0xFF, b & 0xFF];
}

function _ts() {
	return Math.floor(_.now() / 1000);
}

function _tt(value) {
	if (tooltip.Text != value) {
		tooltip.Text = value;
		tooltip.Activate();
	}
}

let doc = new ActiveXObject('htmlfile');
let app = new ActiveXObject('Shell.Application');
let WshShell = new ActiveXObject('WScript.Shell');
let fso = new ActiveXObject('Scripting.FileSystemObject');

const DT_LEFT = 0x00000000;
const DT_CENTER = 0x00000001;
const DT_RIGHT = 0x00000002;
const DT_VCENTER = 0x00000004;
const DT_WORDBREAK = 0x00000010;
const DT_CALCRECT = 0x00000400;
const DT_NOPREFIX = 0x00000800;
const DT_END_ELLIPSIS = 0x00008000;

const LEFT = DT_VCENTER | DT_END_ELLIPSIS | DT_CALCRECT | DT_NOPREFIX;
const RIGHT = DT_VCENTER | DT_RIGHT | DT_END_ELLIPSIS | DT_CALCRECT | DT_NOPREFIX;
const CENTRE = DT_VCENTER | DT_CENTER | DT_END_ELLIPSIS | DT_CALCRECT | DT_NOPREFIX;
const SF_CENTRE = 285212672;

const VK_ESCAPE = 0x1B;
const VK_SHIFT = 0x10;
const VK_LEFT = 0x25;
const VK_UP = 0x26;
const VK_RIGHT = 0x27;
const VK_DOWN = 0x28;

const MF_STRING = 0x00000000;
const MF_GRAYED = 0x00000001;

const IDC_ARROW = 32512;
const IDC_HAND = 32649;

const TPM_RIGHTALIGN = 0x0008;
const TPM_BOTTOMALIGN = 0x0020;

const DLGC_WANTALLKEYS = 0x0004;

const ONE_DAY = 86400000;
const ONE_WEEK = 604800000;

const DEFAULT_ARTIST = '$meta(artist,0)';
const N = window.ScriptInfo.Name + ':';

let DPI = 96;
try { DPI = WshShell.RegRead('HKCU\\Control Panel\\Desktop\\WindowMetrics\\AppliedDPI'); } catch (e) {}

const LM = _scale(5);
const TM = _scale(20);

let tooltip = window.CreateTooltip('Segoe UI', _scale(12));
tooltip.SetMaxWidth(1200);

let folders = {};
folders.home = fb.ComponentPath + 'samples\\complete\\';
folders.images = folders.home + 'images\\';
folders.data = fb.ProfilePath + 'js_data\\';
folders.artists = folders.data + 'artists\\';
folders.lastfm = folders.data + 'lastfm\\';

let fontawesome = gdi.Font('FontAwesome', 48);
let chars = {
	up : '\uF077',
	down : '\uF078',
	close : '\uF00D',
	rating_on : '\uF005',
	rating_off : '\uF006',
	heart_on : '\uF004',
	heart_off : '\uF08A',
	prev : '\uF049',
	next : '\uF050',
	play : '\uF04B',
	pause : '\uF04C',
	stop : '\uF04D',
	preferences : '\uF013',
	search : '\uF002',
	console : '\uF120',
	info : '\uF05A',
	audioscrobbler : '\uF202',
	minus : '\uF068',
	music : '\uF001',
	menu : '\uF0C9'
};

let popup = {
	ok : 0,
	yes_no : 4,
	yes : 6,
	no : 7,
	stop : 16,
	question : 32,
	info : 64
};

let image = {
	crop : 0,
	crop_top : 1,
	stretch : 2,
	centre : 3
};

let ha_links = [
	['Title Formatting Reference', 'https://wiki.hydrogenaud.io/index.php?title=Foobar2000:Title_Formatting_Reference'],
	['Query Syntax', 'https://wiki.hydrogenaud.io/index.php?title=Foobar2000:Query_syntax'],
	['Homepage', 'https://www.foobar2000.org/'],
	['Components', 'https://www.foobar2000.org/components'],
	['Wiki', 'https://wiki.hydrogenaud.io/index.php?title=Foobar2000:Foobar2000'],
	['Forums', 'https://hydrogenaud.io/index.php/board,28.0.html']
];

let _bmp = gdi.CreateImage(1, 1);
let _gr = _bmp.GetGraphics();