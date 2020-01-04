// *****************************************************************************************************************************************
// Common functions & flags by Br3tt aka Falstaff (c)2013-2015
// *****************************************************************************************************************************************

//=================================================// General declarations
SM_CXVSCROLL = 2;
SM_CYHSCROLL = 3;

DLGC_WANTARROWS = 0x0001; /* Control wants arrow keys         */
DLGC_WANTTAB = 0x0002; /* Control wants tab keys           */
DLGC_WANTALLKEYS = 0x0004; /* Control wants all keys           */
DLGC_WANTMESSAGE = 0x0004; /* Pass message to control          */
DLGC_HASSETSEL = 0x0008; /* Understands EM_SETSEL message    */
DLGC_DEFPUSHBUTTON = 0x0010; /* Default pushbutton               */
DLGC_UNDEFPUSHBUTTON = 0x0020; /* Non-default pushbutton           */
DLGC_RADIOBUTTON = 0x0040; /* Radio button                     */
DLGC_WANTCHARS = 0x0080; /* Want WM_CHAR messages            */
DLGC_STATIC = 0x0100; /* Static item: don't include       */
DLGC_BUTTON = 0x2000; /* Button item: can be checked      */

// }}
// Use with MenuManager()
// {{
MF_STRING = 0x00000000;
MF_SEPARATOR = 0x00000800;
MF_GRAYED = 0x00000001;
MF_DISABLED = 0x00000002;
MF_POPUP = 0x00000010;
// }}
// Used in get_colors()
// {{
COLOR_WINDOW = 5;
COLOR_HIGHLIGHT = 13;
COLOR_BTNFACE = 15;
COLOR_BTNTEXT = 18;
// }}
// Used in window.SetCursor()
// {{
IDC_ARROW = 32512;
IDC_IBEAM = 32513;
IDC_WAIT = 32514;
IDC_CROSS = 32515;
IDC_UPARROW = 32516;
IDC_SIZE = 32640;
IDC_ICON = 32641;
IDC_SIZENWSE = 32642;
IDC_SIZENESW = 32643;
IDC_SIZEWE = 32644;
IDC_SIZENS = 32645;
IDC_SIZEALL = 32646;
IDC_NO = 32648;
IDC_APPSTARTING = 32650;
IDC_HAND = 32649;
IDC_HELP = 32651;
// }}
// Use with GdiDrawText()
// {{
var DT_LEFT = 0x00000000;
var DT_RIGHT = 0x00000002;
var DT_TOP = 0x00000000;
var DT_BOTTOM = 0x00000008;
var DT_CENTER = 0x00000001;
var DT_VCENTER = 0x00000004;
var DT_WORDBREAK = 0x00000010;
var DT_SINGLELINE = 0x00000020;
var DT_CALCRECT = 0x00000400;
var DT_NOPREFIX = 0x00000800;
var DT_EDITCONTROL = 0x00002000;
var DT_END_ELLIPSIS = 0x00008000;
// }}
// Keyboard Flags & Tools
// {{
var VK_F1 = 0x70;
var VK_F2 = 0x71;
var VK_F3 = 0x72;
var VK_F4 = 0x73;
var VK_F5 = 0x74;
var VK_F6 = 0x75;
var VK_BACK = 0x08;
var VK_TAB = 0x09;
var VK_RETURN = 0x0D;
var VK_SHIFT = 0x10;
var VK_CONTROL = 0x11;
var VK_ALT = 0x12;
var VK_ESCAPE = 0x1B;
var VK_PGUP = 0x21;
var VK_PGDN = 0x22;
var VK_END = 0x23;
var VK_HOME = 0x24;
var VK_LEFT = 0x25;
var VK_UP = 0x26;
var VK_RIGHT = 0x27;
var VK_DOWN = 0x28;
var VK_INSERT = 0x2D;
var VK_DELETE = 0x2E;
var VK_SPACEBAR = 0x20;
var KMask = {
	none: 0,
	ctrl: 1,
	shift: 2,
	ctrlshift: 3,
	ctrlalt: 4,
	ctrlaltshift: 5,
	alt: 6
};

function GetKeyboardMask() {
	var c = utils.IsKeyPressed(VK_CONTROL) ? true : false;
	var a = utils.IsKeyPressed(VK_ALT) ? true : false;
	var s = utils.IsKeyPressed(VK_SHIFT) ? true : false;
	var ret = KMask.none;
	if (c && !a && !s)
		ret = KMask.ctrl;
	if (!c && !a && s)
		ret = KMask.shift;
	if (c && !a && s)
		ret = KMask.ctrlshift;
	if (c && a && !s)
		ret = KMask.ctrlalt;
	if (c && a && s)
		ret = KMask.ctrlaltshift;
	if (!c && a && !s)
		ret = KMask.alt;
	return ret;
};
// }}
// {{
// Used in window.GetColorCUI()
ColorTypeCUI = {
	text: 0,
	selection_text: 1,
	inactive_selection_text: 2,
	background: 3,
	selection_background: 4,
	inactive_selection_background: 5,
	active_item_frame: 6
};
// Used in window.GetFontCUI()
FontTypeCUI = {
	items: 0,
	labels: 1
};
// Used in window.GetColorDUI()
ColorTypeDUI = {
	text: 0,
	background: 1,
	highlight: 2,
	selection: 3
};
// Used in window.GetFontDUI()
FontTypeDUI = {
	defaults: 0,
	tabs: 1,
	lists: 2,
	playlists: 3,
	statusbar: 4,
	console: 5
};
//}}
// {{
// Used in gr.DrawString()
function StringFormat() {
	var h_align = 0,
	v_align = 0,
	trimming = 0,
	flags = 0;
	switch (arguments.length) {
	case 3:
		trimming = arguments[2];
	case 2:
		v_align = arguments[1];
	case 1:
		h_align = arguments[0];
		break;
	default:
		return 0;
	};
	return ((h_align << 28) | (v_align << 24) | (trimming << 20) | flags);
};
StringAlignment = {
	Near: 0,
	Centre: 1,
	Far: 2
};
var lt_stringformat = StringFormat(StringAlignment.Near, StringAlignment.Near);
var ct_stringformat = StringFormat(StringAlignment.Centre, StringAlignment.Near);
var rt_stringformat = StringFormat(StringAlignment.Far, StringAlignment.Near);
var lc_stringformat = StringFormat(StringAlignment.Near, StringAlignment.Centre);
var cc_stringformat = StringFormat(StringAlignment.Centre, StringAlignment.Centre);
var rc_stringformat = StringFormat(StringAlignment.Far, StringAlignment.Centre);
var lb_stringformat = StringFormat(StringAlignment.Near, StringAlignment.Far);
var cb_stringformat = StringFormat(StringAlignment.Centre, StringAlignment.Far);
var rb_stringformat = StringFormat(StringAlignment.Far, StringAlignment.Far);
//}}
// {{
// Used in utils.GetAlbumArt()
AlbumArtId = {
	front: 0,
	back: 1,
	disc: 2,
	icon: 3,
	artist: 4
};
//}}
// {{
// Used everywhere!
function RGB(r, g, b) {
	return (0xff000000 | (r << 16) | (g << 8) | (b));
};
function RGBA(r, g, b, a) {
	return ((a << 24) | (r << 16) | (g << 8) | (b));
};
function getAlpha(color) {
	return ((color >> 24) & 0xff);
};

function getRed(color) {
	return ((color >> 16) & 0xff);
};

function getGreen(color) {
	return ((color >> 8) & 0xff);
};

function getBlue(color) {
	return (color & 0xff);
};

function negative(colour) {
	var R = getRed(colour);
	var G = getGreen(colour);
	var B = getBlue(colour);
	return RGB(Math.abs(R - 255), Math.abs(G - 255), Math.abs(B - 255));
};

function toRGB(d) { // convert back to RGB values
	var d = d - 0xff000000;
	var r = d >> 16;
	var g = d >> 8 & 0xFF;
	var b = d & 0xFF;
	return [r, g, b];
};

function blendColors(c1, c2, factor) {
	// When factor is 0, result is 100% color1, when factor is 1, result is 100% color2.
	var c1 = toRGB(c1);
	var c2 = toRGB(c2);
	var r = Math.round(c1[0] + factor * (c2[0] - c1[0]));
	var g = Math.round(c1[1] + factor * (c2[1] - c1[1]));
	var b = Math.round(c1[2] + factor * (c2[2] - c1[2]));
	return (0xff000000 | (r << 16) | (g << 8) | (b));
};

function draw_glass_reflect(w, h) {
	// Mask for glass effect
	var Mask_img = gdi.CreateImage(w, h);
	var gb = Mask_img.GetGraphics();
	gb.FillSolidRect(0, 0, w, h, 0xffffffff);
	gb.FillGradRect(0, 0, w - 20, h, 0, 0xaa000000, 0, 1.0);
	gb.SetSmoothingMode(2);
	gb.FillEllipse(-20, 25, w * 2 + 40, h * 2, 0xffffffff);
	Mask_img.ReleaseGraphics(gb);
	// drawing the white rect
	var glass_img = gdi.CreateImage(w, h);
	gb = glass_img.GetGraphics();
	gb.FillSolidRect(0, 0, w, h, 0xffffffff);
	glass_img.ReleaseGraphics(gb);
	// resizing and applying the mask
	var Mask = Mask_img.Resize(w, h);
	glass_img.ApplyMask(Mask);
	return glass_img;
};

function drawBlurbox(w, h, bgcolor, boxcolor, radius, iteration) {
	// Create a image which background is true transparent
	var g_blurbox = gdi.CreateImage(w + 40, h + 40);
	// Get graphics interface like "gr" in on_paint
	var gb = g_blurbox.GetGraphics();
	gb.FillSolidRect(20, 20, w, h, boxcolor);
	g_blurbox.ReleaseGraphics(gb);
	// Make box blur, radius = 2, iteration = 2
	g_blurbox.BoxBlur(radius, iteration);
	var g_blurbox_main = gdi.CreateImage(w + 40, h + 40);
	gb = g_blurbox_main.GetGraphics();
	gb.FillSolidRect(0, 0, w + 40, h + 40, bgcolor);
	gb.DrawImage(g_blurbox, 0, -10, w + 40, h + 40, 0, 0, w + 40, h + 40, 0, 255);
	g_blurbox_main.ReleaseGraphics(gb);
	return g_blurbox_main;
};

function num(strg, nb) {
	var i;
	var str = strg.toString();
	var k = nb - str.length;
	if (k > 0) {
		for (i = 0; i < k; i++) {
			str = "0" + str;
		};
	};
	return str.toString();
};
//Time formatting secondes -> 0:00
function TimeFromSeconds(t) {
	var zpad = function (n) {
		var str = n.toString();
		return (str.length < 2) ? "0" + str : str;
	};
	var h = Math.floor(t / 3600);
	t -= h * 3600;
	var m = Math.floor(t / 60);
	t -= m * 60;
	var s = Math.floor(t);
	if (h > 0)
		return h.toString() + ":" + zpad(m) + ":" + zpad(s);
	return m.toString() + ":" + zpad(s);
};
function TrackType(trkpath) {
	var taggable;
	var type;
	switch (trkpath) {
	case "file":
		taggable = 1;
		type = 0;
		break;
	case "cdda":
		taggable = 1;
		type = 1;
		break;
	case "FOO_":
		taggable = 0;
		type = 2;
		break;
	case "http":
		taggable = 0;
		type = 3;
		break;
	case "mms:":
		taggable = 0;
		type = 3;
		break;
	case "unpa":
		taggable = 0;
		type = 4;
		break;
	default:
		taggable = 0;
		type = 5;
	};
	return type;
};
function replaceAll(str, search, repl) {
	while (str.indexOf(search) != -1) {
		str = str.replace(search, repl);
	};
	return str;
};
function removeAccents(str) {
	/*
	var norm = new Array('À','Á','Â','Ã','Ä','Å','Æ','Ç','È','É','Ê','Ë',
	'Ì','Í','Î','Ï', 'Ð','Ñ','Ò','Ó','Ô','Õ','Ö','Ø','Ù','Ú','Û','Ü','Ý',
	'Þ','ß');
	var spec = new Array('A','A','A','A','A','A','AE','C','E','E','E','E',
	'I','I','I','I', 'D','N','O','O','O','O','O','O','U','U','U','U','Y',
	'b','SS');
	for (var i = 0; i < spec.length; i++) {
	str = replaceAll(str, norm[i], spec[i]);
	};
	*/
	return str;
};
//}}

//=================================================// Button object
ButtonStates = {
	normal: 0,
	hover: 1,
	down: 2
};
button = function (normal, hover, down) {
	this.img = Array(normal, hover, down);
	this.w = this.img[0].Width;
	this.h = this.img[0].Height;
	this.state = ButtonStates.normal;
	this.update = function (normal, hover, down) {
		this.img = Array(normal, hover, down);
		this.w = this.img[0].Width;
		this.h = this.img[0].Height;
	};
	this.draw = function (gr, x, y, alpha) {
		this.x = x;
		this.y = y;
		this.img[this.state] && gr.DrawImage(this.img[this.state], this.x, this.y, this.w, this.h, 0, 0, this.w, this.h, 0, alpha);
	};
	this.repaint = function () {
		window.RepaintRect(this.x, this.y, this.w, this.h);
	};
	this.checkstate = function (event, x, y) {
		this.ishover = (x > this.x && x < this.x + this.w - 1 && y > this.y && y < this.y + this.h - 1);
		this.old = this.state;
		switch (event) {
		case "down":
			switch (this.state) {
			case ButtonStates.normal:
			case ButtonStates.hover:
				this.state = this.ishover ? ButtonStates.down : ButtonStates.normal;
				this.isdown = true;
				break;
			};
			break;
		case "up":
			this.state = this.ishover ? ButtonStates.hover : ButtonStates.normal;
			this.isdown = false;
			break;
		case "right":

			break;
		case "move":
			switch (this.state) {
			case ButtonStates.normal:
			case ButtonStates.hover:
				this.state = this.ishover ? ButtonStates.hover : ButtonStates.normal;
				break;
			};
			break;
		case "leave":
			this.state = this.isdown ? ButtonStates.down : ButtonStates.normal;
			break;
		};
		if (this.state != this.old)
			this.repaint();
		return this.state;
	};
};

//=================================================// Tools (general)
function decode_colour(opt_colour, resultype) {
	var XYZ_colour = {
		RGBcolour: 0,
		H: 0,
		S: 0,
		L: 0
	};
	var R_read,
	G_read,
	B_read;
	switch (resultype) {
	case 1:
		switch (opt_colour.length) {
		case 23:
			XYZ_colour.H = Math.round(opt_colour.substring(0, 3));
			XYZ_colour.S = Math.round(opt_colour.substring(4, 7));
			XYZ_colour.L = Math.round(opt_colour.substring(8, 11));
			XYZ_colour.RGBcolour = HSL2RGB(XYZ_colour.H, XYZ_colour.S, XYZ_colour.L, "RGB");
			break;
		default:
			XYZ_colour.H = 0;
			XYZ_colour.S = 0;
			XYZ_colour.L = 0;
			XYZ_colour.RGBcolour = RGB(0, 0, 0)
		};
		return XYZ_colour;
		break;
	default:
		switch (opt_colour.length) {
		case 23:
			R_read = Math.round(opt_colour.substring(12, 15));
			G_read = Math.round(opt_colour.substring(16, 19));
			B_read = Math.round(opt_colour.substring(20, 23));
			break;
		default:
			R_read = 0;
			G_read = 0;
			B_read = 0
		};
		return RGB(R_read, G_read, B_read);
	};
};

function HSL2RGB(zH, zS, zL, result) {
	var L = zL / 100;
	var S = zS / 100;
	var H = zH / 100;
	var R,
	G,
	B,
	var_1,
	var_2;
	if (S == 0) { //HSL from 0 to 1
		R = L * 255; //RGB results from 0 to 255
		G = L * 255;
		B = L * 255;
	} else {
		if (L < 0.5)
			var_2 = L * (1 + S);
		else
			var_2 = (L + S) - (S * L);

		var_1 = 2 * L - var_2;

		R = 255 * Hue2RGB(var_1, var_2, H + (1 / 3));
		G = 255 * Hue2RGB(var_1, var_2, H);
		B = 255 * Hue2RGB(var_1, var_2, H - (1 / 3));
	};
	switch (result) {
	case "R":
		return Math.round(R);
		break;
	case "G":
		return Math.round(G);
		break;
	case "B":
		return Math.round(B);
		break;
	default:
		return RGB(Math.round(R), Math.round(G), Math.round(B));
	};
};

function Hue2RGB(v1, v2, vH) {
	if (vH < 0)
		vH += 1;
	if (vH > 1)
		vH -= 1;
	if ((6 * vH) < 1)
		return (v1 + (v2 - v1) * 6 * vH);
	if ((2 * vH) < 1)
		return (v2);
	if ((3 * vH) < 2)
		return (v1 + (v2 - v1) * ((2 / 3) - vH) * 6);
	return (v1);
};

function RGB2HSL(RGB_colour) {
	var R = (getRed(RGB_colour) / 255);
	var G = (getGreen(RGB_colour) / 255);
	var B = (getBlue(RGB_colour) / 255);
	var HSL_colour = {
		RGB: 0,
		H: 0,
		S: 0,
		L: 0
	};

	var_Min = Math.min(R, G, B); //Min. value of RGB
	var_Max = Math.max(R, G, B); //Max. value of RGB
	del_Max = var_Max - var_Min; //Delta RGB value

	L = (var_Max + var_Min) / 2;

	if (del_Max == 0) { //This is a gray, no chroma...
		H = 0; //HSL results from 0 to 1
		S = 0;
	} else { //Chromatic data...
		if (L < 0.5)
			S = del_Max / (var_Max + var_Min);
		else
			S = del_Max / (2 - var_Max - var_Min);

		del_R = (((var_Max - R) / 6) + (del_Max / 2)) / del_Max;
		del_G = (((var_Max - G) / 6) + (del_Max / 2)) / del_Max;
		del_B = (((var_Max - B) / 6) + (del_Max / 2)) / del_Max;

		if (R == var_Max)
			H = del_B - del_G;
		else if (G == var_Max)
			H = (1 / 3) + del_R - del_B;
		else if (B == var_Max)
			H = (2 / 3) + del_G - del_R;

		if (H < 0)
			H += 1;
		if (H > 1)
			H -= 1;
	};
	HSL_colour.RGB = RGB_colour;
	HSL_colour.H = Math.round(H * 100);
	HSL_colour.S = Math.round(S * 100);
	HSL_colour.L = Math.round(L * 100);
	return HSL_colour;
};

function DrawColoredText(gr, text, font, default_color, x, y, w, h, alignment, force_default_color) {
	var txt = "",
	color = default_color,
	lg = 0,
	i = 1,
	z = 0,
	tmp = "";
	var pos = text.indexOf(String.fromCharCode(3));
	if (pos < 0) { // no specific color
		gr.GdiDrawText(text, font, default_color, x, y, w, h, alignment | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
	} else {
		var tab = text.split(String.fromCharCode(3));
		var fin = tab.length;

		switch (alignment) {
		case DT_CENTER:
			var full_lg = gr.CalcTextWidth(tab[0], font);
			for (var m = i; m < fin; m += 2) {
				full_lg += gr.CalcTextWidth(tab[m + 1], font);
			};
			if (full_lg > w)
				full_lg = w;
			var delta_align = ((w - full_lg) / 2);
			break;
		case DT_RIGHT:
			var full_lg = gr.CalcTextWidth(tab[0], font);
			for (var m = i; m < fin; m += 2) {
				full_lg += gr.CalcTextWidth(tab[m + 1], font);
			};
			if (full_lg > w)
				full_lg = w;
			var delta_align = (w - full_lg);
			break;
		default:
			var delta_align = 0;
		};

		// if first part is default color
		if (pos > 0) {
			txt = tab[0];
			lg = gr.CalcTextWidth(txt, font);
			gr.GdiDrawText(txt, font, color, x + delta_align + z, y, w - z, h, DT_LEFT | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
			z += lg;
		};

		// draw all other colored parts
		while (i < fin && z < w) {
			if (!force_default_color) {
				tmp = tab[i];
				color = eval("0xFF" + tmp.substr(4, 2) + tmp.substr(2, 2) + tmp.substr(0, 2));
			};
			//color = RGB(parseInt(tmp.substr(0,2),16), parseInt(tmp.substr(2,2),16), parseInt(tmp.substr(4,2),16));
			txt = tab[i + 1];
			lg = gr.CalcTextWidth(txt, font);
			gr.GdiDrawText(txt, font, color, x + delta_align + z, y, w - z, h, DT_LEFT | DT_CALCRECT | DT_VCENTER | DT_END_ELLIPSIS | DT_NOPREFIX);
			z += lg;
			i += 2;
		};
	};
};

function DrawPolyStar(gr, x, y, out_radius, in_radius, points, line_thickness, line_color, fill_color, angle, opacity) {
	// ---------------------
	// code by ExtremeHunter
	// ---------------------

	if (!opacity && opacity != 0)
		opacity = 255;

	//---> Create points
	var point_arr = [];
	for (var i = 0; i != points; i++) {
		i % 2 ? r = Math.round((out_radius - line_thickness * 4) / 2) / in_radius : r = Math.round((out_radius - line_thickness * 4) / 2);
		var x_point = Math.floor(r * Math.cos(Math.PI * i / points * 2 - Math.PI / 2));
		var y_point = Math.ceil(r * Math.sin(Math.PI * i / points * 2 - Math.PI / 2));
		point_arr.push(x_point + out_radius / 2);
		point_arr.push(y_point + out_radius / 2);
	};

	//---> Crate poligon image
	var img = gdi.CreateImage(out_radius, out_radius);
	var _gr = img.GetGraphics();
	_gr.SetSmoothingMode(2);
	_gr.FillPolygon(fill_color, 1, point_arr);
	if (line_thickness > 0)
		_gr.DrawPolygon(line_color, line_thickness, point_arr);
	img.ReleaseGraphics(_gr);

	//---> Draw image
	gr.DrawImage(img, x, y, out_radius, out_radius, 0, 0, out_radius, out_radius, angle, opacity);
};

function zoom(value, factor) {
	return Math.ceil(value * factor / 100);
};

function get_system_scrollbar_width() {
	var tmp = utils.GetSystemMetrics(SM_CXVSCROLL);
	return tmp;
};

function get_system_scrollbar_height() {
	var tmp = utils.GetSystemMetrics(SM_CYHSCROLL);
	return tmp;
};

String.prototype.repeat = function (num) {
	if (num >= 0 && num <= 5) {
		var g = Math.round(num);
	} else {
		return "";
	};
	return new Array(g + 1).join(this);
};

function cloneObject(obj) {
	var clone = {};
	for (var i in obj) {
		if (typeof(obj[i]) == "object" && obj[i] != null)
			clone[i] = cloneObject(obj[i]);
		else
			clone[i] = obj[i];
	};
	return clone;
};

function compareObject(o1, o2) {
	for (var p in o1) {
		if (o1[p] != o2[p]) {
			return false;
		};
	};
	for (var p in o2) {
		if (o1[p] != o2[p]) {
			return false;
		};
	};
	return true;
};

function getTimestamp() {
	var d,
	s1,
	s2,
	s3,
	hh,
	min,
	sec,
	timestamp;
	d = new Date();
	s1 = d.getFullYear();
	s2 = (d.getMonth() + 1);
	s3 = d.getDate();
	hh = d.getHours();
	min = d.getMinutes();
	sec = d.getSeconds();
	if (s3.length == 1)
		s3 = "0" + s3;
	timestamp = s1 + ((s2 < 10) ? "-0" : "-") + s2 + ((s3 < 10) ? "-0" : "-") + s3 + ((hh < 10) ? " 0" : " ") + hh + ((min < 10) ? ":0" : ":") + min + ((sec < 10) ? ":0" : ":") + sec;
	return timestamp;
};

// --- UIHacks

MainMenuState = {
	Show: 0,
	Hide: 1,
	Auto: 2
};

FrameStyle = {
	Default: 0,
	SmallCaption: 1,
	NoCaption: 2,
	NoBorder: 3
};

MoveStyle = {
	Default: 0,
	Middle: 1,
	Left: 2,
	Both: 3
};

AeroEffect = {
	Default: 0,
	Disabled: 1,
	GlassFrame: 2,
	SheetOfGlass: 3
};

WindowState = {
	Normal: 0,
	Minimized: 1,
	Maximized: 2
};

var fonts = {};
function gdi_font(name, size, style) {
	var id = name.toLowerCase() + "_" + size + "_" + (style || 0);
	if (!fonts[id]) {
		fonts[id] = gdi.Font(name, size, style || 0);
	}
	return fonts[id];
}

function fb2k_length(h) {
	return Math.max(h.Length, 0);
}
