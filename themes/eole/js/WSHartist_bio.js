Number.prototype.padLeft = function(base, chr) {
    var len = (String(base || 10).length - String(this).length) + 1;
    return len > 0 ? new Array(len).join(chr || '0') + this : this;
}
String.prototype.strip = function() {
    return this.replace(/[\.,\!\?\:;'’"\-_‐\s+]/g, "").toLowerCase();
}
if (!String.prototype.trim) {
    String.prototype.trim = function() {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };
}
var images = {
    nocover_img: gdi.Image(theme_img_path+"\\no_cover.png"),	
    noartist_img: gdi.Image(theme_img_path+"\\no_artist.png"),		
    stream_img: gdi.Image(theme_img_path+"\\stream_icon.png"),
};
var light_cover = false;
var nowplaying_cachekey = '';
var Update_Required_function = '';
var update_cover = true;
var update_size = true;
var first_on_size = true;
var script_initialized = false;
var cover_path = '';
properties = {
	panelName: 'WSHartist_bio',
    globalFontAdjustement: window.GetProperty("MAINPANEL: Global Font Adjustement", 0),
    preferFocusedItem: window.GetProperty("MAINPANEL: Show focused item", false),	
	panelFontAdjustement: window.GetProperty("MAINPANEL: Panel font Adjustement", 0),		
    enableDiskCache: window.GetProperty("COVER Disk Cache", true),		
    wallpaperdisplay: window.GetProperty("Wallpaper 0=Filling 1=Adjust 2=Stretch", 2),	
	showwallpaper: window.GetProperty("_DISPLAY: Show Wallpaper", true),
	darklayout: window.GetProperty("_DISPLAY: Dark layout", false),		
	stick2darklayout: window.GetProperty("_DISPLAY: stick to Dark layout", true),		
    wallpaperblurred: window.GetProperty("_DISPLAY: Wallpaper Blurred", true),
    wallpaperblurvalue: window.GetProperty("_DISPLAY: Wallpaper Blur Value", 1.05),
    wallpapermode: window.GetProperty("_SYSTEM: Wallpaper Mode", 0),	
    album_review: window.GetProperty("_SYSTEM: Display album review", false),
	circleArtwork: window.GetProperty("_DISPLAY: circle artwork", false),
	showCover: window.GetProperty("_DISPLAY: show cover", false),	
	ImgOnlyOnMouseHover: window.GetProperty("_DISPLAY: Img Only On Mouse over", true),		
	lastfm_server: window.GetProperty("SERVER: lastfm", "en"),	
	dont_communicate: window.GetProperty("SERVER: dont communicate with other panels", true),	
}
lastfm_servers = Array();
lastfm_servers[0] = "en|www.last.fm";
lastfm_servers[1] = "de|www.last.fm/de";
lastfm_servers[2] = "es|www.last.fm/es";
lastfm_servers[3] = "fr|www.last.fm/fr";
lastfm_servers[4] = "it|www.last.fm/it";
lastfm_servers[5] = "ja|www.last.fm/ja";
lastfm_servers[6] = "pl|www.last.fm/pl";
lastfm_servers[7] = "pt|www.last.fm/pt";
lastfm_servers[8] = "ru|www.last.fm/ru";
lastfm_servers[9] = "sv|www.last.fm/sv";
lastfm_servers[10] = "tr|www.last.fm/tr";
lastfm_servers[11] = "zh|www.last.fm/zh";

function userinterface() {
    var custom_col = window.GetProperty("_CUSTOM COLOURS/FONTS: USE", false),
        orig_font_sz = 16,
        zoom_font_sz = 16,
        zoom = 100;
    this.backcol = "";
    this.backcoltrans = "";
    this.bg = false;
    this.bot_ws = window.GetProperty("SYSTEM.Bottom White Space", 0);
    this.top_ws = window.GetProperty("SYSTEM.Top White Space", 0);	
    this.dui = window.InstanceType;
    this.font;
    this.font_h = 37;
    this.textcol = "";
    window.SetProperty("SERVER PREFERENCES:", "Set in biography.ini [foobar2000(profile)\\wsh-data]");
    window.SetProperty("_CUSTOM COLOURS/FONTS: EMPTY = DEFAULT", "R-G-B (any) or R-G-B-A (not Text...), e.g. 255-0-0")
    this.scrollbar_show = window.GetProperty(" Scrollbar Show", true);
    try {
        this.scr_type = parseFloat(window.GetProperty(" Scrollbar Type Default-0 Styled-1 Themed-2", "0").replace(/\s+/g, "").charAt(0));
        if (isNaN(this.scr_type)) this.scr_type = 0;
        if (this.scr_type > 2 || this.scr_type < 0) this.scr_type = 0;
        if (this.scr_type == 2) window.SetProperty(" Scrollbar Type Default-0 Styled-1 Themed-2", "2 // Scrollbar Settings N/A For Themed");
        else window.SetProperty(" Scrollbar Type Default-0 Styled-1 Themed-2", "" + this.scr_type + "");
    } catch (e) {
        this.scr_type = 0;
        window.SetProperty(" Scrollbar Type Default-0 Styled-1 Themed-2", "" + 0 + "");
    }
    this.scr_col = Math.min(Math.max(window.GetProperty(" Scrollbar Colour Grey-0 Blend-1", 1), 0), 1);
    if (this.scr_type == 2) {
        this.theme = window.CreateThemeManager("scrollbar");
        var im = gdi.CreateImage(21, 21),
            g = im.GetGraphics();
        try {
            this.theme.SetPartAndStateId(6, 1);
            this.theme.DrawThemeBackground(g, 0, 0, 21, 50);
            for (var i = 0; i < 3; i++) {
                this.theme.SetPartAndStateId(3, i + 1);
                this.theme.DrawThemeBackground(g, 0, 0, 21, 50);
            }
            for (i = 0; i < 3; i++) {
                this.theme.SetPartAndStateId(1, i + 1);
                this.theme.DrawThemeBackground(g, 0, 0, 21, 21);
            }
        } catch (e) {
            this.scr_type = 1;
            window.SetProperty(" Scrollbar Type Default-0 Styled-1 Themed-2", "" + 1 + "");
        }
        im.ReleaseGraphics(g);
        im.Dispose();
    }
    var themed_w = 21;
    try {
        themed_w = utils.GetSystemMetrics(2);
    } catch (e) {}
    var sbar_w = window.GetProperty(" Scrollbar Size", "Bar,11,Arrow,11,Gap(+/-),0").replace(/\s+/g, "").split(",");
    this.scr_w = cScrollBar.hoverWidth;
    if (isNaN(this.scr_w)) this.scr_w = 11;
    this.scr_w = Math.min(Math.max(this.scr_w, 0), 400);
    var scr_w_o = Math.min(Math.max(window.GetProperty("SYSTEM.Scrollbar Width Bar", 11), 0), 400);
    this.arrow_pad = parseFloat(sbar_w[5]);
    if (isNaN(this.arrow_pad)) this.arrow_pad = 0;
    if (this.scr_w != scr_w_o) {
        this.scr_but_w = parseFloat(sbar_w[3]);
        if (isNaN(this.scr_but_w)) this.scr_but_w = 11;
        this.scr_but_w = Math.min(this.scr_but_w, this.scr_w, 400);
        window.SetProperty(" Scrollbar Size", "Bar," + this.scr_w + ",Arrow," + this.scr_but_w + ",Gap(+/-)," + this.arrow_pad);
    } else {
        this.scr_but_w = parseFloat(sbar_w[3]);
        if (isNaN(this.scr_but_w)) this.scr_but_w = 11;
        this.scr_but_w = Math.min(Math.max(this.scr_but_w, 0), 400);
        this.scr_w = parseFloat(sbar_w[1]);
        if (isNaN(this.scr_w)) this.scr_w = 11;
        this.scr_w = Math.min(Math.max(this.scr_w, this.scr_but_w), 400);
        window.SetProperty(" Scrollbar Size", "Bar," + this.scr_w + ",Arrow," + this.scr_but_w + ",Gap(+/-)," + this.arrow_pad);
    }
    window.SetProperty("SYSTEM.Scrollbar Width Bar", this.scr_w);
    if (this.scr_type == 2) this.scr_w = themed_w;
    if (!this.scrollbar_show) this.scr_w = 0;
    this.but_h = this.scr_w + (this.scr_type != 2 ? 1 : 0);
    if (this.scr_type != 2) this.scr_but_w += 1;
    this.sbar_sp = this.scr_w ? this.scr_w + (this.scr_w - this.scr_but_w < 5 || this.scr_type == 2 ? 1 : 0) : 0;
    this.arrow_pad = Math.min(Math.max(-this.but_h / 5, this.arrow_pad), this.but_h / 5);
    var R = function(c) {
        return c >> 16 & 0xff;
    };
    var G = function(c) {
        return c >> 8 & 0xff;
    };
    var B = function(c) {
        return c & 0xff;
    }
    var get_textselcol = function(c) {
        var cc = [R(c), G(c), B(c)];
        var ccc = [];
        for (var i = 0; i < cc.length; i++) {
            ccc[i] = cc[i] / 255;
            ccc[i] = ccc[i] <= 0.03928 ? ccc[i] / 12.92 : Math.pow(((ccc[i] + 0.055) / 1.055), 2.4);
        }
        var L = 0.2126 * ccc[0] + 0.7152 * ccc[1] + 0.0722 * ccc[2];
        if (L > 0.31) return 50;
        else return 200;
    }
    var set_custom_col = function(c, t) {
        if (!custom_col) return "";
        try {
            var cc = "",
                col = [];
            col = c.split("-");
            if (col.length != 3 && col.length != 4) return "";
            switch (t) {
                case 0:
                    cc = RGB(col[0], col[1], col[2]);
                    break;
                case 1:
                    switch (col.length) {
                        case 3:
                            cc = RGB(col[0], col[1], col[2]);
                            break;
                        case 4:
                            cc = RGBA(col[0], col[1], col[2], col[3]);
                            break;
                    }
                    break;
            }
            return cc;
        } catch (e) {
            return ""
        };
    }
    this.draw = function(gr) {
        if (this.bg) try {
            gr.FillSolidRect(0, 0, p.w, p.h, this.backcol)
        } catch (e) {}
    }
    this.reset_colors = function() {
        this.backcol = "";
        this.backcoltrans = "";
        this.textcol = "";
    }
    this.zoom = function() {
        return utils.IsKeyPressed(0x11) && utils.IsKeyPressed(0x12);
    }

    this.get_colors = function() {
        this.backcol = g_color_bg;
        this.textcol = g_color_normal_txt;
        this.backcoltrans = set_custom_col(window.GetProperty("_Custom.Colour Transparent Fill", ""), 1);

        if (this.dui) { // custom colour mapping: DUI colours can be remapped by changing the numbers (0-3)
            if (this.textcol === "") this.textcol = window.GetColourDUI(0);
            if (this.backcol === "") this.backcol = window.GetColourDUI(1);
        } else { // custom colour mapping: CUI colours can be remapped by changing the numbers (0-6)
            if (this.textcol === "") this.textcol = window.GetColourCUI(0);
            if (this.backcol === "") this.backcol = window.GetColourCUI(3);
        }
        if (window.IsTransparent && this.backcoltrans) {
            this.bg = true;
            this.backcol = this.backcoltrans
        }
        if (!window.IsTransparent || this.dui) this.bg = true;
        this.ct = this.bg ? get_textselcol(this.backcol) : 200;
    }
    this.get_colors();

    this.get_font = function() {
		get_font();

		this.font = g_font.plus1;
		
        orig_font_sz = window.GetProperty("SYSTEM.Font Size", 16);
        if (this.font.Size != orig_font_sz) window.SetProperty(" Zoom Font Size (%)", 100);
        orig_font_sz = this.font.Size;
        window.SetProperty("SYSTEM.Font Size", this.font.Size);
		
		this.font_title = 	g_font.nowplaying_title;	
		this.font_subtitle = g_font.nowplaying_subtitle;
		
        zoom = window.GetProperty(" Zoom Font Size (%)", 100);
        zoom_font_sz = Math.max(Math.round(orig_font_sz * zoom / 100), 1);

        window.SetProperty(" Zoom Font Size (%)", Math.round(zoom_font_sz / orig_font_sz * 100));

        this.calc_text();
        p.sizes();
        t.art_calc();
        t.alb_calc();
    }

    this.calc_text = function() {
        var i = gdi.CreateImage(1, 1),
            g = i.GetGraphics();
        this.font_h = Math.round(g.CalcTextHeight("String", this.font))-5+window.GetProperty("SYSTEM.Font height", 5);
		
		this.font_title_h = Math.round(g.CalcTextHeight("String", this.font_title))-5+window.GetProperty("SYSTEM.Font height", 5)+5;

        i.ReleaseGraphics(g);
        i.Dispose();
    }

    this.wheel = function(step) {
        if (!p || (p.multi_artist && but.btns["mt"] && but.btns["mt"].trace(p.m_x, p.m_y))) return;
        if (p.yy) {
            zoom_font_sz += step;
            zoom_font_sz = Math.max(zoom_font_sz, 1);
            this.font = gdi.Font(this.font.Name, zoom_font_sz, this.font.Style);
            this.calc_text();
            p.sizes();
            t.alb_calc();
            t.art_calc();
            alb_scrollbar.reset();
            art_scrollbar.reset();
            window.Repaint();
            window.SetProperty(" Zoom Font Size (%)", Math.round(zoom_font_sz / orig_font_sz * 100));
        } else {
            p.rel_imgs += step * 0.01;
            p.rel_imgs = Math.max(Math.min(p.rel_imgs, 0.9), 0.1);
            window.SetProperty(" Layout Image Size 0-1", p.rel_imgs);
            p.sizes();
            img.clear_rs_cache();
            img.on_playback_new_track();
            t.alb_calc();
            t.art_calc();
        }
    }
}


function get_colors() {
	if(properties.darklayout || properties.stick2darklayout){
		wallpaper_overlay_dark = GetGrey(0,180);
		wallpaper_overlay_blurred_dark = GetGrey(0,80);
		
		wallpaper_overlay_light = GetGrey(0,180);
		wallpaper_overlay_blurred_light = GetGrey(0,120);		
		
		g_color_bg = GetGrey(40);			
		g_color_normal_txt = GetGrey(255,200);
		g_color_faded_txt = GetGrey(245);	
		g_color_border_left = GetGrey(255,30);	
		
		img_border_color = GetGrey(0);	
		img_shadow_color = GetGrey(0,200);
		
		if(properties.stick2darklayout && !properties.darklayout){
			scrollbar_normal_cursor_color = GetGrey(255,130);
			scrollbar_hover_cursor_color = GetGrey(255);		
		} else {
			scrollbar_normal_cursor_color = GetGrey(255,130);
			scrollbar_hover_cursor_color = GetGrey(225);			
		}	
		scrollbar_down_cursor_color = scrollbar_hover_cursor_color;			
		scrollbar_cursor_outline = GetGrey(0,60);
		
		rating_icon_on = GetGrey(255);
		rating_icon_off = GetGrey(255,60);
		rating_icon_border = GetGrey(255,0);
		
	} else {	
		wallpaper_overlay_dark = GetGrey(255,225);
		wallpaper_overlay_blurred_dark = GetGrey(255,205);
		
		wallpaper_overlay_light = GetGrey(255,215);
		wallpaper_overlay_blurred_light = GetGrey(255,195);	
		
		g_color_bg = GetGrey(40);				
		g_color_normal_txt = GetGrey(0);
		g_color_faded_txt = GetGrey(100);
		g_color_border_left = GetGrey(210);	
		
		img_border_color = GetGrey(0);	
		img_shadow_color = GetGrey(0,140);
		
		scrollbar_normal_cursor_color = GetGrey(0,120);	
		scrollbar_hover_cursor_color = GetGrey(0);		
		scrollbar_down_cursor_color = scrollbar_hover_cursor_color;			
		scrollbar_cursor_outline = GetGrey(255,60);		
		
		rating_icon_on = GetGrey(0);	
		rating_icon_off = GetGrey(0,30);	
		rating_icon_border = GetGrey(0,0);		
	}	
	if(properties.wallpaperblurred){
		bg_color_light = wallpaper_overlay_blurred_light;
		bg_color_dark = wallpaper_overlay_blurred_dark;		
	} else {
		bg_color_light = wallpaper_overlay_light;
		bg_color_dark = wallpaper_overlay_dark;		
	}
};

function on_colours_changed() {
    ui.reset_colors();
    ui.get_colors();
    img.create_images();
    but.create_images();
    but.refresh();
    t.paint();
}

function on_font_changed() {
    ui.get_font();
    alb_scrollbar.reset();
    art_scrollbar.reset();
    window.Repaint();
}

function panel_operations() {
    var artist_o = "",
        artist = "",
        corr_gap = 40,
        gap = 20,
        js_stnd = window.GetProperty("ADV.Scrollbar Height Always Full", false),
        text_auto = window.GetProperty(" Layout Auto Adjust", true);
    if (text_auto) ui.bot_ws = 0;
    js_stnd = !js_stnd ? 2 : 0;
    this.bor_x = 20;
    this.bor_top = 0;
    this.bor_bot = 0;	
    this.fill = window.GetProperty("SYSTEM.Cover Fill", false);
    this.img_x = 20;
	this.review_rating = -1;
    this.img_y = 0;
    this.imgs = 0;
    this.m_x = 0;
    this.m_y = 0;
    this.rel_imgs = window.GetProperty(" Layout Image Size 0-1", 0.7);
    this.rp_x = 0;
    this.rp_y = 0;
    this.rp_w = 0;
    this.rp_h = 0;
    this.sbar_o = 0;
    this.sbar_x = 0;
    this.sbar_y = 0;
    this.sbar_h = 0;
    this.style = 0;
    this.text_w = 0;
    this.yy = false;
    var q = function(s) {
        return s.split("").reverse().join("");
    };
    var text_x = Math.max(gap, this.bor_x = 20),
        text_y = Math.max(gap, this.bor_top);
    this.fs = new ActiveXObject("Scripting.FileSystemObject");
    this.file = function(f) {
        return this.fs.fileExists(f);
    };
    this.folder = function(fo) {
        return this.fs.FolderExists(fo);
    };
    this.click = function(x, y) {
        if (t.text && (!this.img_only && (!this.fill || img.artistart) || this.text_only) && ui.scrollbar_show && x > t.scrollbar_type().x - 10 && x < t.scrollbar_type().x + ui.sbar_sp || but.btns["mt"] && but.btns["mt"].trace(x, y)) return;
		if((y > img.img_real_y && y < img.img_real_y + img.img_real_h && x > img.img_real_x && x < img.img_real_x + img.img_real_w && !p.text_only) || p.img_only) {
			this.toggleImageOnly(); return;
		}
        img.artistart = !img.artistart;
        window.SetProperty("SYSTEM.Artist Art", img.artistart);
        if (this.multi_sel == -1 || !img.artistart) {
            t.grab_text(false, -1);
            img.get_images();
        } else {
            t.get_multi(false, this.multi_sel);
            img.get_multi(this.multi_sel);
        }
        if (!img.artistart) img.set_chk_arr(null);
    }
	this.toggleImageOnly = function(){
		if(this.img_only)
			this.mode(1);
		else
			this.mode(2);			
	}
    this.create = function(fo) {
        try {
            if (!this.folder(fo)) this.fs.CreateFolder(fo);
        } catch (e) {}
    }
    this.cyc = window.GetProperty("SYSTEM.Image [Artist] Cycle", true);
    this.h = 0;
    this.w = 0;
    var txt_h = this.h;
    this.img_only = window.GetProperty("SYSTEM.Image Only", false);
    this.ir = function() {
        return fb.IsPlaying && fb.PlaybackLength <= 0
    }
    this.eval = function(n, focus) {
        var metadb = fb.IsPlaying && !focus ? fb.GetNowPlaying() : fb.GetFocusItem();
        if (!metadb || n == "") return "";
        if (this.ir()) return fb.TitleFormat(n).Eval();
        else return fb.TitleFormat(n).EvalWithMetadb(metadb);
    }
    var json_sort = function(data, prop, reverse) {
        data.sort(function(a, b) {
            if (!a[prop]) return 1;
            if (!b[prop]) return -1;
            a = a[prop].toLowerCase();
            b = b[prop].toLowerCase();
            if (a < b) return reverse ? 1 : -1;
            if (a > b) return reverse ? -1 : 1;
            return 0;
        });
        return data;
    };
    this.last_modified = function(filespec) {
        return this.fs.GetFile(filespec).DateLastModified;
    }
    this.lfm_img = window.GetProperty("SYSTEM.Image [Artist] Prefer Last.fm", true);
    this.mbtn_dn = function() {
        switch (true) {
            case (this.img_only || this.text_only):
                this.mode(1);
                break;
            case !this.yy:
                this.mode(2);
                break;
            case this.yy:
                this.mode(3);
                break;
        }
    }
    this.move = function(x, y) {
		var hover_img_old = this.hover_img;
        switch (this.style) {
            case 0:
                this.yy = y > this.img_y + this.imgs;
				if(this.img_only) this.hover_img = y > img.img_real_y && y < img.img_real_y + img.img_real_h;
				else this.hover_img = y > img.img_real_y && y < img.img_real_y + img.img_real_h && x > img.img_real_x && x < img.img_real_x + img.img_real_w;	
                break;
            case 1:
                this.yy = x < this.img_x;
				if(this.img_only) this.hover_img = y > img.img_real_y && y < img.img_real_y + img.img_real_h;
				else this.hover_img = y > img.img_real_y && y < img.img_real_y + img.img_real_h && x > img.img_real_x && x < img.img_real_x + img.img_real_w;	
                break;
            case 2:
                this.yy = y < this.img_y;
				if(this.img_only) this.hover_img = y > img.img_real_y && y < img.img_real_y + img.img_real_h;
				else this.hover_img = y > img.img_real_y && y < img.img_real_y + img.img_real_h && x > img.img_real_x && x < img.img_real_x + img.img_real_w;	
                break;
            case 3:
                this.yy = x > this.img_x + this.imgs;
				if(this.img_only) this.hover_img = y > img.img_real_y && y < img.img_real_y + img.img_real_h;
				else this.hover_img = y > img.img_real_y && y < img.img_real_y + img.img_real_h && x > img.img_real_x && x < img.img_real_x + img.img_real_w;				
                break;
        }
		if(this.hover_img && !this.text_only && !this.img_only && !hover_img_old && properties.ImgOnlyOnMouseHover) {
			this.mode(2); 
		} else if(!this.hover_img && !this.text_only && this.img_only && properties.ImgOnlyOnMouseHover) {
			this.mode(1); // this.toggleImageOnly();
		}		// mode 1 = img+text / mode 2 = img only
    }
    var obj_contains = function(arr, p_name) {
        var i = arr.length;
        while (i--)
            if (arr[i].name == p_name) return true;
        return false;
    }
    this.paint = function() {
        window.RepaintRect(this.rp_x, this.rp_y, this.rp_w, this.rp_h);
    }
    this.sanitise_path = function(pth) {
        pth = pth.trim().replace(/(\s+|)[\/\\](\s+|)/g, "\\");
        var pth_arr = pth.split(/[\/\\]/),
            str = "",
            sub = "";
        if (pth_arr[0].indexOf("%path%") == -1 && pth_arr[0].indexOf("%_path_raw%") == -1) {
            if (pth.indexOf("%profile%\\") != -1) {
                pth = pth.replace(/%profile%\\/i, "");
                sub = fb.ProfilePath;
            } else if (pth.charAt(1) == ":") {
                sub = pth.substr(0, 3);
                pth = pth.substring(3);
            }
            pth_arr = pth.split(/[\/\\]/);
        } else if (pth_arr[0].indexOf("%path%") != -1 && !this.ir()) {
            sub = this.eval(pth_arr[0]) + "\\";
            pth = pth_arr.shift();
        }
        for (var i = 0; i < pth_arr.length; i++) {
            var ev = this.eval(pth_arr[i]);
            ev = ev.sanitise();
            str += ev + "\\";
        }
        return (sub + str).replace(/\//g, "\\");
    };
    this.d = parseFloat(q("0000029142"));
    this.lfm = q("f50a8f9d80158a0fa0c673faec4584be=yek_ipa&");
    this.save = function(l, n) {
        try {
            var ts = this.fs.OpenTextFile(n, 2, true, -1);
            ts.WriteLine(l);
            ts.Close();
            return true;
        } catch (e) {
            return false;
        }
    }
    this.server = true;
	this.lfm_bioserver_index = 0;
	this.lfm_albserver_index = 0;	
    if(!properties.dont_communicate) window.NotifyOthers("not_server", 0);
    this.text_only = window.GetProperty("SYSTEM.Text Only", false);
    this.trace = function(message, n) {
        var trace = true;
        if (trace) console.log("Biography" + (n ? " Server" : "") + ": " + message);
    } // true enables console.log
    var data_folder = fb.ProfilePath + "wsh-data\\";
    this.create(data_folder);
    this.bio_ini = data_folder + "biography.ini";
    this.def_dn = [{
            name: "Biography [Allmusic] Auto-Fetch",
            dn: 1
        },
        {
            name: "Biography [Lastfm] Auto-Fetch",
            dn: 1
        },
        {
            name: "Album Review [Allmusic] Auto-Fetch",
            dn: 1
        },
        {
            name: "Album Review [Lastfm] Auto-Fetch",
            dn: 1
        },
        {
            name: "Image [Artist] Auto-Fetch",
            dn: 1
        },
        {
            name: "Image [Cover] Auto-Fetch",
            dn: 0
        }
    ];
    var def_paths = [{
            name: "Album Review [Allmusic] Folder Location",
            path: "%profile%\\wsh-data\\review\\allmusic\\$lower($cut(album artist name,1))"
        },
        {
            name: "Album Review [Lastfm] Folder Location",
            path: "%profile%\\wsh-data\\review\\lastfm\\$lower($cut(album artist name,1))"
        },
        {
            name: "Biography [Allmusic] Folder Location",
            path: "%profile%\\wsh-data\\biography\\allmusic\\$lower($cut(artist name,1))"
        },
        {
            name: "Biography [Lastfm] Folder Location",
            path: "%profile%\\wsh-data\\biography\\lastfm\\$lower($cut(artist name,1))"
        },
        {
            name: "Image [Artist] Folder Location",
            path: "%profile%\\wsh-data\\art_img\\$lower($cut(artist name,1))\\artist name"
        },
        {
            name: "Image [Cover] Folder Location",
            path: "$directory_path(%path%)"
        },
        {
            name: "Image [Cover] File Name",
            path: "cover"
        }
    ];
    this.def_tf = [{
            name: "album artist name",
            tf: "$if3($meta(album artist,0),$meta(artist,0),$meta(composer,0),$meta(performer,0))"
        },
        {
            name: "artist name",
            tf: "$if3($meta(artist,0),$meta(album artist,0),$meta(composer,0),$meta(performer,0))"
        },
        {
            name: "album name",
            tf: "$meta(album,0)"
        },
        {
            name: "Album Review [Allmusic] Rating Name (0-Hides)",
            tf: "Album rating"
        },
        {
            name: "Album Review [Allmusic] Include Partial Matches",
            tf: 1
        },
        {
            name: "Album Review & Cover [Lastfm] Use Lastfm Autocorrect",
            tf: 1
        },
        {
            name: "Cache Expiry (days: minimum 28)",
            tf: 28
        },
        {
            name: "Image [Artist] Auto-Add New",
            tf: 1
        },
        {
            name: "Image [Artist] Cycle Time (seconds)",
            tf: 15
        },
        {
            name: "Lastfm Biography & Artist Image Server",
            tf: "www.last.fm"
        },
        {
            name: "Mouse Left Button Click: Map To Double-Click",
            tf: 0
        },
        {
            name: "Show More Tags",
            tf: 0
        },
        {
            name: "Various Artists",
            tf: "Various Artists"
        }
    ];

    var d = new Date,
        timestamp = [d.getFullYear(), (d.getMonth() + 1).padLeft(), d.getDate().padLeft()].join("-") + "_" + [d.getHours().padLeft(), d.getMinutes().padLeft(), d.getSeconds().padLeft()].join("-");
    if (this.file(this.bio_ini) && (utils.ReadTextFile(this.bio_ini).indexOf("Version 0.5 beta") == -1)) this.fs.MoveFile(this.bio_ini, data_folder + "biography_old_" + timestamp + ".ini");
    if (!this.file(this.bio_ini)) {
        utils.WriteINI(this.bio_ini, "A foobar2000 restart is required for any changes to take effect. Only change entries after the equal signs. Entries have a 255 character limit.\r\n\r\n" +
            "Version 0.5 beta.\r\n\r\n" +
            "========================================\r\n" +
            "CUSTOMISATION HELP:\r\n\r\n" +
            "AUTO-FETCH:\r\n" +
            "1 Enable web search for source. Results are cached.\r\n" +
            "0 Disable web search for source. Existing data cached to disc will be loaded. Nothing will load for a source if nothing is saved to disc.\r\n" +
            "Image [Cover] Auto-Fetch. If enabled, for the fetched covers to display ensure the correct search pattern is present in main foobar2000 preferences > display > album art > front cover: e.g. for default settings add \"cover.*\" without the quotes.\r\n\r\n" +
            "NAMES:\r\n" +
            "Used in search, for file names & optionally in folder locations. Change default title formatting if required.\r\n\r\n" +
            "PATHS:\r\n" +
            "Enter title formatting or absolute paths. Always use the defined \"NAMES\" (\"album artist name\", \"artist name\" or \"album name\" [minus quotes]), if applicable, to ensure correctly named paths (copy style of defaults). %profile% can be put at the start of the path and resolves to the foobar2000 profile folder or program folder in portable mode. Don't use %path% except in cover paths where $directory_path(%path%) can be used. As with title formatting, enclose literal ()[]'%$ in single quotes. It is recommended to validate changes by checking save paths of a few files. Trailing \\ not needed. Conditional folders are not supported.\r\n\r\n" +
            "MISCELLANEOUS:\r\n" +
            "Allmusic rating: enter 0 to hide; enter a name to display with that name.\r\n" +
            "Album Review [Allmusic] Include Partial Matches: 0 or 1; 1 includes partial matches of the album name.\r\n" +
            "Album Review & Cover [Lastfm] Use Lastfm Autocorrect: 0 or 1.\r\n" +
            "Cache Expiry: change if required - force update overrides.\r\n" +
            "Image [Artist] Auto-Add New: 0 or 1 (requires enabled auto-fetch).\r\n" +
            "Image [Artist] Cycle Time: enter value in seconds.\r\n" +
            "Known Last.fm Servers: www.last.fm, www.last.fm/de, www.last.fm/es, www.last.fm/fr, www.last.fm/it, www.last.fm/ja, www.last.fm/pl, www.last.fm/pt, www.last.fm/ru, www.last.fm/sv, www.last.fm/tr and www.last.fm/zh.\r\n" +
            "Mouse Left Button Click: Map To Double-Click: 0 or 1.\r\n" +
            "Show More Tags: 0 or 1; 1 enables display of last.fm biographies & photos of more tags. When available, a button appears in artist view. Expands all fields referenced by \"artist name\" and includes multivalues.\r\n" +
            "Various Artists. Change name used to identify compilations if required (not critical: helps with allmusic searches).", "", "=======================================\r\n");
        for (var i = 0; i < this.def_dn.length; i++) utils.WriteINI(this.bio_ini, "AUTO-FETCH", this.def_dn[i].name, this.def_dn[i].dn);
        for (var i = 0; i < 3; i++) utils.WriteINI(this.bio_ini, "NAMES", this.def_tf[i].name, this.def_tf[i].tf);
        for (var i = 0; i < def_paths.length; i++) utils.WriteINI(this.bio_ini, "PATHS", def_paths[i].name, def_paths[i].path);
        for (var i = 3; i < this.def_tf.length; i++) utils.WriteINI(this.bio_ini, "MISCELLANEOUS", this.def_tf[i].name, this.def_tf[i].tf);
    }
    this.cycle = utils.ReadINI(this.bio_ini, "MISCELLANEOUS", this.def_tf[8].name);
    if (!this.cycle || isNaN(this.cycle)) this.cycle = this.def_tf[8].tf;
    var pth_arr = ["dl_am_rev_pth", "dl_lfm_rev_pth", "dl_am_bio_pth", "dl_lfm_bio_pth", "dl_art_pth", "dl_lfm_cov_pth", "dl_lfm_cov_fn"],
        i = 0,
        j = 0;
    for (i = 0; i < pth_arr.length; i++) {
        this[pth_arr[i]] = utils.ReadINI(this.bio_ini, "PATHS", def_paths[i].name);
        if (!this[pth_arr[i]]) this[pth_arr[i]] = def_paths[i].path;
        for (j = 0; j < 3; j++) this[pth_arr[i]] = this[pth_arr[i]].replace(RegExp(this.def_tf[j].name, "gi"), utils.ReadINI(this.bio_ini, "NAMES", this.def_tf[j].name));
    }
    var misc_arr = ["dbl_click", "multi_artist"];
    j = 0;
    for (i = 10; i < 12; i++) {
        this[misc_arr[j]] = parseFloat(utils.ReadINI(this.bio_ini, "MISCELLANEOUS", this.def_tf[i].name));
        if (this[misc_arr[j]] !== 1 && this[misc_arr[j]] !== 0) this[misc_arr[j]] = this.def_tf[i].tf;
        j++;
    }
    var init_arr = [],
        mul_arr = ["dl_am_bio_mul", "dl_lfm_bio_mul", "dl_art_mul"],
        multi_fields_arr = [];
    j = 0;
    for (i = 2; i < 5; i++) {
        this[mul_arr[j]] = utils.ReadINI(this.bio_ini, "PATHS", def_paths[i].name);
        j++;
    }
    this.multi_arr = [];
    this.multi_sel = -1;
    var multi_fields = utils.ReadINI(this.bio_ini, "MISCELLANEOUS", this.def_tf[1].name);
    if (!multi_fields.length) multi_fields = this.def_tf[1].tf;
    multi_fields = multi_fields.replace(/\$.*?\(/gi, "").replace(/(,(|\s+)\d+)/gi, "").replace(/[,\(\)\[\]\%]/gi, "|").split("|");
    for (var i = 0; i < multi_fields.length; i++) {
        multi_fields[i] = multi_fields[i].trim();
        if (multi_fields[i].length) multi_fields_arr.push("%" + multi_fields[i] + "%");
    }
    this.multi_new = function() {
        artist_o = artist;
        artist = this.eval(multi_fields_arr);
        if (!this.multi_artist || !img.artistart) return true;
        else return artist != artist_o || !this.multi_arr.length || this.multi_sel == -1;
    }
    this.multi_same = function() {
        if (this.multi_artist && this.multi_sel != -1 && this.multi_arr.length && JSON.stringify(init_arr) === JSON.stringify(this.multi_arr)) return true;
        return false;
    }

    this.get_multi = function(p_clear) {
        if (!this.multi_artist) return;
        var mn = "",
            nm = "";
        init_arr = this.multi_arr.slice(0);
        this.multi_arr = [];
        for (var i = 0; i < multi_fields_arr.length; i++) {
            nm = multi_fields_arr[i].replace(/%/g, "");
            for (var j = 0; j < this.eval("$meta_num(" + nm + ")"); j++) {
                mn = "$trim($meta(" + nm + "," + j + "))";
                if (!obj_contains(this.multi_arr, this.eval(mn))) this.multi_arr.push({
                    name: this.eval(mn),
                    meta: mn
                });
            }
        }
        if (this.multi_arr.length > 1) try {
            json_sort(this.multi_arr, "name", false);
        } catch (e) {}
        if (this.multi_same()) return;
        else if (p_clear) this.multi_sel = -1;
    }

    this.on_size = function() {
        gap = window.GetProperty(" Layout Internal Padding", 20);
        this.bor_x = window.GetProperty(" Layout Outer Padding (left/right)", 20);
        this.bor_top = window.GetProperty(" Layout Outer Padding (top)", 0);
        this.bor_bot = window.GetProperty(" Layout Outer Padding (bottom)", 0);		
        this.style = window.GetProperty("SYSTEM.Layout", 0);
        text_x = Math.max(gap, this.bor_x);
        text_y = Math.max(gap, this.bor_top);
	
    }

    this.sizes = function() {
        if (window.GetProperty("SYSTEM.Bottom Size Correction", false)) { // size correction can be set to true for optimal text positioning where panel size is increased to compensate for shadow effect
            this.w = window.Width;
            this.h = window.Height - ui.top_ws;
        }
        this.sbar_o = [2 + ui.arrow_pad, Math.max(Math.floor(ui.scr_but_w * 0.2), 3) + ui.arrow_pad * 2, 0][ui.scr_type];
        var top_corr = [this.sbar_o - (ui.but_h - ui.scr_but_w) / 2, this.sbar_o, 0][ui.scr_type]-10;
        var bot_corr = [(ui.but_h - ui.scr_but_w) / 2 - this.sbar_o, -this.sbar_o, 0][ui.scr_type]+10;
        switch (this.style) {
            case 0: // top
                this.img_x = this.bor_x;
                this.img_y = this.bor_top;
                corr_gap = gap * 2;	
				bor_bot_adjusted = this.bor_bot+20;
                txt_h = Math.round((this.h - this.img_y * 2) * (1 - this.rel_imgs)) - bor_bot_adjusted - this.bor_top;
                this.lines_drawn = this.text_only ? Math.floor((this.h - text_y * 2) / ui.font_h) : Math.floor(txt_h / ui.font_h);
                txt_h = this.lines_drawn * ui.font_h + corr_gap + bor_bot_adjusted;
                this.imgs = this.text_only ? 0 : this.img_only ? this.h - this.bor_top - bor_bot_adjusted : this.h - txt_h - this.img_y * 2;
                this.text_x = ui.scrollbar_show ? Math.max(text_x, ui.sbar_sp + 10) : text_x;
                this.text_y = this.text_only ? (this.h - this.lines_drawn * ui.font_h) / 2 : !text_auto ? this.img_y + this.imgs + corr_gap : this.img_y + this.imgs + corr_gap / 2;
                this.text_w = this.w - this.text_x * 2;
                if (ui.scrollbar_show) {
                    this.sbar_x = this.w - ui.sbar_sp;
                    this.sbar_y = (ui.scr_type < js_stnd || !this.text_only && !text_auto ? this.text_y + ui.bot_ws : this.text_only ? 0 : this.img_y + this.imgs) + top_corr+ui.font_title_h;
                    if (!this.text_only && ui.scr_type >= js_stnd) {
                        this.sbar_y = Math.max(this.img_y + this.imgs + top_corr, this.sbar_y -= this.bor_top);
                    }
                    this.sbar_h = (ui.scr_type < js_stnd ? ui.font_h * this.lines_drawn + bot_corr : this.h - this.sbar_y) + bot_corr;
                }
                this.rp_x = Math.round(0);
                this.rp_y = Math.round(!this.text_only ? this.img_y + this.imgs : 0);
                this.rp_w = this.w;
                this.rp_h = this.h - this.rp_y;
                break;
            case 1: // right
                this.img_x = this.bor_x;
                this.img_y = this.bor_top;
                corr_gap = gap * 2;
                var txt_sp = Math.round((this.w - this.img_x * 2) * (1 - this.rel_imgs)) - corr_gap;
				
                this.text_y = this.bor_top;				
                txt_h = this.h - this.bor_bot - this.bor_top - ui.font_title_h;
                this.lines_drawn = Math.floor((txt_h) / ui.font_h);
                this.imgs = this.text_only ? 0 : this.img_only ? this.w - this.bor_x * 2 : this.w - txt_sp - this.img_x * 2 - corr_gap;
                if (ui.scrollbar_show) txt_sp -= (ui.sbar_sp + 10);
                this.text_x = ui.scrollbar_show ? Math.max(text_x, ui.sbar_sp + 10) : text_x;
                this.text_w = this.text_only ? this.w - this.text_x * 2 : txt_sp;
                if (!this.text_only) {
                    this.text_x = this.bor_x + (text_auto ? corr_gap / 2 : 0);
                    if (!this.img_only) this.img_x = this.bor_x + txt_sp + corr_gap + (ui.scrollbar_show ? ui.sbar_sp + 10 : 0)
                } else this.img_x = this.w;
                if (ui.scrollbar_show) {
                    this.sbar_x = this.text_only ? this.w - ui.scr_w : this.text_x + this.text_w + 10;
                    this.sbar_x = this.sbar_x - (ui.scr_w - ui.scr_but_w < 5 || ui.scr_type == 3 ? 1 : 0);
                    this.sbar_y = (ui.scr_type < js_stnd ? this.text_y + ui.bot_ws : 0) + top_corr+ui.font_title_h;
                    this.sbar_h = (ui.scr_type < js_stnd ? ui.font_h * this.lines_drawn : this.h) + bot_corr * 2;
                }
                this.rp_x = Math.round(0);
                this.rp_y = Math.round(0);
                this.rp_w = !this.text_only ? this.img_x : this.w;
                this.rp_h = this.h;
                break;
            case 2: // bottom
                this.img_x = this.bor_x;
                this.img_y = this.bor_top;
                corr_gap = gap * 2;
				
                this.text_y = this.bor_top;				
				
                txt_h = Math.round((this.h - this.img_y * 2) * (1 - this.rel_imgs)) - this.bor_bot - this.bor_top;
                this.lines_drawn = this.text_only ? Math.floor((this.h - text_y * 2) / ui.font_h) : Math.floor(txt_h / ui.font_h);
                txt_h = this.lines_drawn * ui.font_h + corr_gap + this.bor_bot;
                this.imgs = this.text_only ? 0 : this.img_only ? this.h - this.bor_top - this.bor_bot : this.h - txt_h - this.img_y * 2;
                this.img_y = this.h - this.bor_top - this.imgs;
                this.text_x = ui.scrollbar_show ? Math.max(text_x, ui.sbar_sp + 10) : text_x;

                this.text_w = this.w - this.text_x * 2;
                if (ui.scrollbar_show) {
                    this.sbar_x = this.w - ui.sbar_sp;
                    this.sbar_y = (ui.scr_type < js_stnd ? this.text_y + ui.bot_ws : 0) + top_corr+ui.font_title_h;
                    this.sbar_h = (ui.scr_type < js_stnd ? ui.font_h * this.lines_drawn : text_auto ? this.img_y : this.text_only ? this.h : this.text_y + ui.bot_ws + ui.font_h * this.lines_drawn) + bot_corr * 2;
                    if (!this.text_only && ui.scr_type >= js_stnd) {
                        this.sbar_h = Math.min(this.img_y + bot_corr, this.sbar_h += this.bor_top);
                    }
                }
                this.rp_x = Math.round(0);
                this.rp_y = Math.round(0);
                this.rp_w = this.w;
                this.rp_h = !this.text_only ? this.img_y : this.h;
                break;
            case 3: // left
                this.img_x = this.bor_x;
                this.img_y = this.bor_top;
                corr_gap = gap * 2;
                var txt_sp = Math.round((this.w - this.img_x * 2) * (1 - this.rel_imgs)) - corr_gap;
				
                this.text_y = this.bor_top;
				
                txt_h = this.h - this.bor_bot - this.bor_top - ui.font_title_h;
                this.lines_drawn = Math.floor((txt_h) / ui.font_h);
                this.imgs = this.text_only ? 0 : this.img_only ? this.w - this.bor_x * 2 : this.w - txt_sp - this.img_x * 2 - corr_gap;
                if (ui.scrollbar_show) txt_sp -= (ui.sbar_sp + 10);
                this.text_x = ui.scrollbar_show ? Math.max(text_x, ui.sbar_sp + 10) : text_x;
                this.text_w = this.text_only ? this.w - this.text_x * 2 : txt_sp;
                if (!this.text_only) this.text_x = !text_auto ? this.img_x + this.imgs + corr_gap : this.img_x + this.imgs + corr_gap / 2;
                if (ui.scrollbar_show) {
                    this.sbar_x = this.w - ui.sbar_sp;
                    this.sbar_y = (ui.scr_type < js_stnd ? this.text_y + ui.bot_ws : 0) + top_corr+ui.font_title_h;
                    this.sbar_h = (ui.scr_type < js_stnd ? ui.font_h * this.lines_drawn : this.h) + bot_corr * 2;
                }
                this.rp_x = Math.round(!this.text_only ? this.text_x : 0);
                this.rp_y = Math.round(0);
                this.rp_w = this.w - this.rp_x;
                this.rp_h = this.h;
                break;
        }
        if (ui.scr_type == 2) {
            this.sbar_y += 1;
            this.sbar_h -= 2;
        }
		this.title_y_adjustement = 18;
        this.text_w = Math.max(this.text_w, 10);
    }

    this.mode = function(n) {
        switch (n) {
            case 1:
                this.img_only = false;
                window.SetProperty("SYSTEM.Image Only", this.img_only);
                this.text_only = false;
                window.SetProperty("SYSTEM.Text Only", this.text_only);
                this.sizes();
                img.clear_rs_cache();
                if (this.multi_sel == -1 || !img.artistart) {
                    t.album_reset();
                    t.artist_reset();
                    t.grab_text(true, -1);
                    img.get_images();
                } else {
                    t.get_multi(true, this.multi_sel);
                    img.get_multi(this.multi_sel);
                }
                break;
            case 2:
                this.img_only = true;
                window.SetProperty("SYSTEM.Image Only", this.img_only);
                this.text_only = false;
                window.SetProperty("SYSTEM.Text Only", this.text_only);
                this.sizes();
                img.clear_rs_cache();
                img.get_images();
                break;
            case 3:
                this.text_only = true;
                window.SetProperty("SYSTEM.Text Only", this.text_only);
                this.img_only = false;
                window.SetProperty("SYSTEM.Image Only", this.img_only);
                this.sizes();
                if (this.multi_sel == -1 || !img.artistart) {
                    t.album_reset();
                    t.artist_reset();
                    t.grab_text(true, -1);
                } else t.get_multi(true, this.multi_sel);
                img.set_chk_arr(null);
                break;
        }
    }
}


function names() {
    var tf_arr = ["aa_tf", "a_tf", "l_tf"];
    for (var i = 0; i < tf_arr.length; i++) {
        this[tf_arr[i]] = utils.ReadINI(p.bio_ini, "NAMES", p.def_tf[i].name);
        if (!this[tf_arr[i]].length) this[tf_arr[i]] = p.def_tf[i].tf;
    }
    this.alb_artist = function(focus) {
        return p.eval("[$trim(" + this.aa_tf + ")]", focus);
    }
    this.artist = function(focus) {
        return p.eval("[$trim(" + this.a_tf + ")]", focus);
    }
    this.album = function(focus) {
        return p.eval("[$trim(" + this.l_tf + ")]", focus).replace(/ CD1| CD2| CD3| \(CD1\)| \(CD2\)| \(CD3\)| CD\.01| CD\.02| CD\.03| CD 1| CD 2| CD 3| CD One| CD Two| CD Three| Disc 1| Disc 2| Disc 3| \(Disc 1\)| \(Disc 2\)| \(Disc 3\)| Disc One| Disc Two| Disc Three| \(Disc One\)| \(Disc Two\)| \(Disc Three\)/gi, "");
    }
}


function scrollbar() {
    smoothness = 1 - window.GetProperty("ADV.Scroll: Smooth Scroll Level 0-1", 0.6561);
    smoothness = Math.max(Math.min(smoothness, 0.99), 0.01);
    this.count = -1;
    this.draw_timer = false;
    this.hover = false;
    this.s1 = 0;
    this.s2 = 0;
    this.scroll_step = window.GetProperty(" Scroll - Mouse Wheel: Page Scroll", true);
    this.smooth = window.GetProperty(" Scroll: Smooth Scroll", true);
    this.timer_but = false;
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;
    this.bar_ht = 0;
    this.but_h = 0;
    this.bar_y = 0;
    this.row_count = 0;
    this.scroll = 0;
    this.delta = 0;
    this.ratio = 1;
    this.rows_drawn = 0;
    this.row_h;
    this.scrollbar_height = 0;
    this.scrollable_lines = 0;
    this.scrollbar_travel = 0;
    this.b_is_dragging = false;
    this.drag_distance_per_row;
    this.initial_drag_y = 0; // dragging
    this.leave = function() {
        if (this.b_is_dragging) return;
        this.hover = false;
        this.hover_o = false;
        window.RepaintRect(Math.round(this.x), Math.round(this.y), this.w, this.h);
    }
    this.nearest = function(y) {
        y = (y - this.but_h) / this.scrollbar_height * this.scrollable_lines * this.row_h;
        y = y / this.row_h;
        y = Math.round(y) * this.row_h;
        return y;
    }
    this.reset = function() {
        this.delta = this.scroll = this.s1 = this.s2 = 0;
        this.metrics(this.x, this.y, this.w, this.h, this.rows_drawn, this.row_h);
    }
    this.scroll_timer = function() {
        var that = this;
        this.draw_timer = window.SetInterval(function() {
            if (p.w < 1 || !window.IsVisible) return;
            that.smooth_scroll();
        }, 16);
    }
    this.set_rows = function(row_count) {
        this.row_count = row_count;
        this.metrics(this.x, this.y, this.w, this.h, this.rows_drawn, this.row_h);
    }
    this.wheel = function(step, pgkey) {
        this.check_scroll(this.scroll + step * -(this.scroll_step || pgkey ? this.rows_drawn : 3) * this.row_h);
    }

    this.metrics = function(x, y, w, h, rows_drawn, row_h) {
        this.x = x;
        this.y = Math.round(y);
        this.w = w;
        this.h = h;
        this.rows_drawn = rows_drawn;
        this.row_h = row_h;
        this.but_h = ui.but_h;
        // draw info
        this.scrollbar_height = Math.round(this.h - this.but_h * 2 - ui.bot_ws);
        this.bar_ht = Math.max(Math.round(this.scrollbar_height * this.rows_drawn / this.row_count), 12);
        this.scrollbar_travel = this.scrollbar_height - this.bar_ht + ui.bot_ws;
        // scrolling info
        this.scrollable_lines = this.row_count - this.rows_drawn;
        this.ratio = this.row_count / this.scrollable_lines;
        this.bar_y = this.but_h + this.scrollbar_travel * (this.delta * this.ratio) / (this.row_count * this.row_h);
        this.drag_distance_per_row = this.scrollbar_travel / this.scrollable_lines;
    }

    this.lbtn_up = function(p_x, p_y) {
        var x = p_x - this.x;
        var y = p_y - this.y;
        if (this.b_is_dragging) this.b_is_dragging = false;
        window.RepaintRect(Math.round(this.x), Math.round(this.y), this.w, this.h);
        this.initial_drag_y = 0;
        if (this.timer_but) {
            window.ClearInterval(this.timer_but);
            this.timer_but = false;
        };
        this.count = -1;
    }

    this.draw = function(gr) {
        if (this.scrollable_lines > 0) {
            try {
                switch (ui.scr_type) {
                    case 0:
                        switch (ui.scr_col) {
                            case 0:
								color = scrollbar_normal_cursor_color;												
                                gr.FillSolidRect(this.x-1, this.y + this.bar_y, this.w-2, this.bar_ht, color);
                                break;
                            case 1:						
								color = (this.b_is_dragging) ? scrollbar_down_cursor_color : (this.hover) ? scrollbar_hover_cursor_color : scrollbar_normal_cursor_color;					
								width = (this.hover || this.b_is_dragging) ? this.w : cScrollBar.normalWidth-2;
								x_pos = (this.hover || this.b_is_dragging) ? this.x + (this.w-width) : this.x + (this.w-width)-2;
                                gr.FillSolidRect(x_pos, this.y + this.bar_y, width, this.bar_ht, color);
                                break;
                        }
                        break;
                    case 1:
                        switch (ui.scr_col) {
                            case 0:
                                gr.FillSolidRect(this.x, this.y - p.sbar_o, this.w, this.h + p.sbar_o * 2, scrollbar_normal_cursor_color);
                                gr.FillSolidRect(this.x, this.y + this.bar_y, this.w, this.bar_ht, RGBA(ui.ct, ui.ct, ui.ct, !this.hover && !this.b_is_dragging ? 75 : this.hover && !this.b_is_dragging ? 128 : 192));
                                break;
                            case 1:
                                gr.FillSolidRect(this.x, this.y - p.sbar_o, this.w, this.h + p.sbar_o * 2, scrollbar_normal_cursor_color);
                                gr.FillSolidRect(this.x, this.y + this.bar_y, this.w, this.bar_ht, ui.textcol & (!this.hover && !this.b_is_dragging ? 0x33ffffff : this.hover && !this.b_is_dragging ? 0x55ffffff : 0x99ffffff));
                                break;
                        }
                        break;
                    case 2:
                        ui.theme.SetPartAndStateId(6, 1);
                        ui.theme.DrawThemeBackground(gr, this.x, this.y, this.w, this.h);
                        ui.theme.SetPartAndStateId(3, !this.hover && !this.b_is_dragging ? 1 : this.hover && !this.b_is_dragging ? 2 : 3);
                        ui.theme.DrawThemeBackground(gr, this.x, this.y + this.bar_y, this.w, this.bar_ht);
                        break;
                }
            } catch (e) {}
        }
    }

    this.lbtn_dn = function(p_x, p_y) {
        var x = p_x - this.x;
        var y = p_y - this.y;
        if (x < 0 || x > this.w || y < 0 || y > this.h || this.row_count <= this.rows_drawn) return;
        if (y < this.but_h || y > this.h - this.but_h) return;
        if (y < this.bar_y) var dir = 1; // above bar
        else if (y > this.bar_y + this.bar_ht) var dir = -1; // below bar
        if (y < this.bar_y || y > this.bar_y + this.bar_ht)
            this.check_scroll(this.nearest(y));
        else { // on bar
            this.b_is_dragging = true;
            window.RepaintRect(Math.round(this.x), Math.round(this.y), this.w, this.h);
            this.initial_drag_y = y - this.bar_y;
        }
    }

    this.move = function(p_x, p_y) {
        var x = p_x - this.x;
        var y = p_y - this.y;
        if (x < 0 || x > this.w || y > this.bar_y + this.bar_ht || y < this.bar_y) this.hover = false;
        else this.hover = true;
        if (this.hover != this.hover_o) window.RepaintRect(Math.round(this.x), Math.round(this.y), this.w, this.h);
        this.hover_o = this.hover;
        if (!this.b_is_dragging || this.row_count <= this.rows_drawn) return;
        this.check_scroll(Math.round((y - this.initial_drag_y - this.but_h) / this.drag_distance_per_row) * this.row_h);
    }

    this.check_scroll = function(new_scroll) {
        var s = Math.max(0, Math.min(new_scroll, this.scrollable_lines * this.row_h));
        if (s == this.scroll) return;
        this.scroll = s;
        if (this.smooth) {
            if (!this.draw_timer) this.scroll_timer();
        }
        if (!this.smooth || this.draw_timer === 0) {
            this.delta = this.scroll;
            this.bar_y = this.but_h + this.scrollbar_travel * (this.delta * this.ratio) / (this.row_count * this.row_h);
            p.paint();
        }
    }

    this.smooth_scroll = function() {
        if (this.delta <= 0.5) {
            this.delta = 0;
            this.bar_y = this.but_h + this.scrollbar_travel * (this.delta * this.ratio) / (this.row_count * this.row_h);
            p.paint();
        }
        if (Math.abs(this.scroll - this.delta) > 0.5) {
            this.s1 += (this.scroll - this.s1) * smoothness;
            this.s2 += (this.s1 - this.s2) * smoothness;
            this.delta += (this.s2 - this.delta) * smoothness;
            this.bar_y = this.but_h + this.scrollbar_travel * (this.delta * this.ratio) / (this.row_count * this.row_h);
            p.paint();
        } else if (this.draw_timer) {
            window.ClearTimeout(this.draw_timer);
            this.draw_timer = false;
        }
    }

    this.but = function(dir) {
        this.check_scroll(this.scroll + (dir * -this.row_h));
        if (!this.timer_but) {
            var that = this;
            this.timer_but = window.SetInterval(function() {
                if (that.count > 6) {
                    that.check_scroll(that.scroll + (dir * -that.row_h));
                } else that.count++;
            }, 40);
        }
    }
}


function button_manager() {
    var arrow_symb = 0;	
    if (window.GetProperty(" Scrollbar Arrow Custom", false)) try {	
		var arrow_sy = window.GetProperty(" Scrollbar Arrow Custom: Icon // Examples", "x // > < v");
        arrow_symb = arrow_sy.replace(/\s+/g, "").charAt(0);
    } catch (e) {
        arrow_symb = 0
    }
    if (!arrow_symb.length) arrow_symb = 0;
    var custom_col = window.GetProperty("_CUSTOM COLOURS/FONTS: USE", false),
        cust_icon_font = window.GetProperty("_Custom.Font Icon [Scroll] (Name,Style[0or1])", "Segoe UI Symbol,0"),
        icon_f_name = "Segoe UI",
        icon_f_style = 0,
        pad = Math.min(Math.max(window.GetProperty(" Scrollbar Arrow Custom: Icon: Vertical Offset %", -24) / 100, -0.5), 0.3);
    if (custom_col) {
        if (cust_icon_font.length) {
            cust_icon_font = cust_icon_font.split(",");
            try {
                var st = Math.round(parseFloat(cust_icon_font[1]));
                icon_f_name = cust_icon_font[0];
                icon_f_style = st;
            } catch (e) {
                p.trace("JScript Panel is unable to use your scroll icon font. Using Segoe UI instead");
            }
        }
    }
    var b_x, b3 = ["alb_scrollDn", "alb_scrollUp", "art_scrollDn", "art_scrollUp"],
        but_tt = window.CreateTooltip("Segoe UI", 15, 0),
        byDn, byUp, i = 0,
        j = 0,
        mt_h, mt_w, orig_font_sz = 14,
        scr = [],
        scrollBut_x, scrollDn_y, scrollUp_y;
    this.btns = [];
    this.b = null;
    var zoom = window.GetProperty(" Zoom Button Size (%)", 100),
        zoom_font_sz = Math.max(Math.round(orig_font_sz * zoom / 100), 7),
        f_mt = gdi.Font("segoe ui", zoom_font_sz, 1);
    var scale = Math.round(zoom_font_sz / orig_font_sz * 100);
    window.SetProperty(" Zoom Button Size (%)", scale);
    var scroll_alb = function() {
        return ui.scrollbar_show && !img.artistart && !p.img_only && t.alb_txt && alb_scrollbar.scrollable_lines > 0
    }
    var scroll_art = function() {
        return ui.scrollbar_show && img.artistart && !p.img_only && t.art_txt && art_scrollbar.scrollable_lines > 0
    }
    this.draw = function(gr) {
        try {
            for (i in this.btns) {
                if (scroll_alb())
                    for (j = 0; j < 2; j++)
                        if (i == b3[j]) this.btns[i].draw(gr);
                if (scroll_art())
                    for (j = 2; j < 4; j++)
                        if (i == b3[j]) this.btns[i].draw(gr);
                if (img.artistart && i == "mt" && p.multi_arr.length > 1) this.btns[i].draw(gr);
            }
        } catch (e) {}
    }
    this.lbtn_dn = function(x, y) {
        if (!this.b) return false;
        if (ui.scrollbar_show)
            for (j = 0; j < b3.length; j++)
                if (this.b == b3[j]) {
                    if (this.btns[this.b].trace(x, y)) this.btns[this.b].down = true;
                    this.btns[this.b].changestate("down");
                }
        this.btns[this.b].lbtn_dn(x, y);
        return true;
    }
    this.lbtn_up = function(x, y) {
        if (!this.b) return false;
        if (ui.scrollbar_show)
            for (j = 0; j < b3.length; j++) {
                this.btns[b3[j]].down = false;
                if (this.b == b3[j]) this.btns[this.b].changestate(this.btns[this.b].trace(x, y) ? "hover" : "normal");
            }
        this.move(x, y);
        if (!this.b) return false;
        this.btns[this.b].lbtn_up(x, y);
        return true;
    }
    this.leave = function() {
        if (this.b) this.btns[this.b].changestate("normal");
        this.b = null;
        tooltip("");
    }
    this.on_script_unload = function() {
        tooltip("");
    }
    var tooltip = function(n) {
        if (but_tt.text == n) return;
        but_tt.text = n;
        but_tt.activate();
    }

    this.create_images = function() {
        var alpha = [75, 192, 228],
            col = [ui.textcol & 0x44ffffff, ui.textcol & 0x99ffffff, ui.textcol],
            g, sz = arrow_symb == 0 ? Math.max(Math.round(ui.but_h * 1.666667), 1) : 100,
            sc = sz / 100;
        for (j = 0; j < 3; j++) {
            scr[j] = gdi.CreateImage(sz, sz);
            g = scr[j].GetGraphics();
            g.SetTextRenderingHint(3);
            g.SetSmoothingMode(2);
            if (ui.scr_col) {
                arrow_symb == 0 ? g.FillPolygon(col[j], 1, [50 * sc, 0, 100 * sc, 76 * sc, 0, 76 * sc]) : g.DrawString(arrow_symb, gdi.Font(icon_f_name, sz, icon_f_style), col[j], 0, sz * pad, sz, sz, StringFormat(1, 1));
            } else {
                arrow_symb == 0 ? g.FillPolygon(RGBA(ui.ct, ui.ct, ui.ct, alpha[j]), 1, [50 * sc, 0, 100 * sc, 76 * sc, 0, 76 * sc]) : g.DrawString(arrow_symb, gdi.Font(icon_f_name, sz, icon_f_style), RGBA(ui.ct, ui.ct, ui.ct, alpha[j]), 0, sz * pad, sz, sz, StringFormat(1, 1));
            }
            g.SetSmoothingMode(0);
            scr[j].ReleaseGraphics(g);
        }
    };
    this.create_images();

    this.move = function(x, y) {
        if (this.b && this.btns[this.b].down == true) return;
        var b = null,
            hand = false;
        for (i in this.btns) {
            if (scroll_alb())
                for (j = 0; j < 2; j++)
                    if (i == b3[j] && this.btns[i].trace(x, y)) b = i;
            if (scroll_art())
                for (j = 2; j < 4; j++)
                    if (i == b3[j] && this.btns[i].trace(x, y)) b = i;
            if (i == "mt" && p.multi_arr.length > 1 && this.btns[i].trace(x, y)) {
                b = i;
                hand = true;
            }
        }
        window.SetCursor(hand ? 32649 : 32512);
        if (this.b == b) return this.b;
        if (b) this.btns[b].changestate("hover");
        if (this.b) this.btns[this.b].changestate("normal");
        this.b = b;
        if (!this.b) tooltip("");
        return this.b;
    }

    this.wheel = function(step) {
        if (!p.multi_artist || !this.btns["mt"] || !this.btns["mt"].trace(p.m_x, p.m_y)) return;
        zoom_font_sz += step;
        zoom_font_sz = Math.min(Math.max(zoom_font_sz, 7), 100);
        f_mt = gdi.Font("segoe ui", zoom_font_sz, 1);
        window.RepaintRect(Math.round(this.btns["mt"].x), Math.round(this.btns["mt"].y), this.btns["mt"].w, this.btns["mt"].h);
        scale = Math.round(zoom_font_sz / orig_font_sz * 100);
        this.refresh(true);
        window.SetProperty(" Zoom Button Size (%)", scale);
    }

    var btn = function(x, y, w, h, type, ft, txt, stat, img_src, down, l_dn, l_up, tooltext) {
        var k = 0;
        this.draw = function(gr) {
            switch (type) {
                case 5:
                    ui.theme.SetPartAndStateId(1, this.img);
                    ui.theme.DrawThemeBackground(gr, this.x, this.y, this.w, this.h);
                    break;
                case 6:
                    gr.SetTextRenderingHint(3);
                    gr.DrawString("MT", f_mt, k ? ui.textcol & 0x99ffffff : ui.textcol & 0x25ffffff, this.x, this.y - 2 * scale / 100, this.w, this.h, StringFormat(1, 1));
                    break;
                default:
                    if (this.img) gr.DrawImage(this.img, this.x + ft, txt, stat, stat, 0, 0, this.img.Width, this.img.Height, type == 1 || type == 3 ? 0 : 180);
                    break;
            }
        }

        this.trace = function(x, y) {
            return x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h;
        }
        this.lbtn_dn = function() {
            this.l_dn && this.l_dn(x, y);
        }
        this.lbtn_up = function() {
            this.l_up && this.l_up(x, y);
        }

        this.changestate = function(state) {
            switch (state) {
                case "hover":
                    k = 1;
                    this.img = this.img_hover;
                    tooltip(this.tooltext);
                    break;
                case "down":
                    this.img = this.img_down;
                    break;
                default:
                    k = 0;
                    this.img = this.img_normal;
                    break;
            }
            window.RepaintRect(Math.round(this.x), Math.round(this.y), this.w, this.h);
        }
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.l_dn = l_dn;
        this.l_up = l_up;
        this.tooltext = tooltext;
        this.img_normal = img_src.normal;
        this.img_hover = img_src.hover || this.img_normal;
        this.img_down = img_src.down || this.img_normal;
        this.img = this.img_normal;
    }

    this.refresh = function(upd) {
        if (upd) {
            b_x = p.sbar_x;
            byUp = Math.round(p.sbar_y);
            byDn = Math.round(p.sbar_y + p.sbar_h - ui.but_h);
            if (ui.scr_type < 2) {
                b_x -= 1;
                scrollBut_x = (ui.but_h - ui.scr_but_w) / 2;
                scrollUp_y = -ui.arrow_pad + byUp + (ui.but_h - 1 - ui.scr_but_w) / 2;
                scrollDn_y = ui.arrow_pad + byDn + (ui.but_h - 1 - ui.scr_but_w) / 2;
            }
            if (p.multi_artist) {
                var g = gdi.CreateImage(1, 1),
                    gb = g.GetGraphics(),
                    mt = gb.MeasureString("MT", f_mt, 0, 0, 500, 500);
                mt_w = mt.Width + 4 * scale / 100;
                mt_h = mt.Height;
                g.ReleaseGraphics(gb);
                g.Dispose();
            }
        }
        if (p.multi_artist) this.btns.mt = new btn(0, 0, mt_w, mt_h, 6, "", "", "", {
            normal: "1",
            hover: "1"
        }, false, "", function() {
            men.button(mt_w, 16)
        }, scale < 155 ? "More Tags" : "");
        if (ui.scrollbar_show) {
            switch (ui.scr_type) {
                case 2:
                    this.btns.alb_scrollUp = new btn(b_x, byUp, ui.but_h, ui.but_h, 5, "", "", "", {
                        normal: 1,
                        hover: 2,
                        down: 3
                    }, false, function() {
                        alb_scrollbar.but(1);
                    }, "", "");
                    this.btns.alb_scrollDn = new btn(b_x, byDn, ui.but_h, ui.but_h, 5, "", "", "", {
                        normal: 5,
                        hover: 6,
                        down: 7
                    }, false, function() {
                        alb_scrollbar.but(-1);
                    }, "", "");
                    this.btns.art_scrollUp = new btn(b_x, byUp, ui.but_h, ui.but_h, 5, "", "", "", {
                        normal: 1,
                        hover: 2,
                        down: 3
                    }, false, function() {
                        art_scrollbar.but(1);
                    }, "", "");
                    this.btns.art_scrollDn = new btn(b_x, byDn, ui.but_h, ui.but_h, 5, "", "", "", {
                        normal: 5,
                        hover: 6,
                        down: 7
                    }, false, function() {
                        art_scrollbar.but(-1);
                    }, "", "");
                    break;
                default:
                    this.btns.alb_scrollUp = new btn(b_x, byUp, ui.but_h, ui.but_h, 1, scrollBut_x, scrollUp_y, ui.scr_but_w, {
                        normal: scr[0],
                        hover: scr[1],
                        down: scr[2]
                    }, false, function() {
                        alb_scrollbar.but(1);
                    }, "", "");
                    this.btns.alb_scrollDn = new btn(b_x, byDn, ui.but_h, ui.but_h, 2, scrollBut_x, scrollDn_y, ui.scr_but_w, {
                        normal: scr[0],
                        hover: scr[1],
                        down: scr[2]
                    }, false, function() {
                        alb_scrollbar.but(-1);
                    }, "", "");
                    this.btns.art_scrollUp = new btn(b_x, byUp, ui.but_h, ui.but_h, 3, scrollBut_x, scrollUp_y, ui.scr_but_w, {
                        normal: scr[0],
                        hover: scr[1],
                        down: scr[2]
                    }, false, function() {
                        art_scrollbar.but(1);
                    }, "", "");
                    this.btns.art_scrollDn = new btn(b_x, byDn, ui.but_h, ui.but_h, 4, scrollBut_x, scrollDn_y, ui.scr_but_w, {
                        normal: scr[0],
                        hover: scr[1],
                        down: scr[2]
                    }, false, function() {
                        art_scrollbar.but(-1);
                    }, "", "");
                    break;
            }
        }
    }
}


function menu_object() {
    var i = 0,
        MenuMap = [],
        MF_GRAYED = 0x00000001,
        MF_POPUP = 0x00000010,
        MF_SEPARATOR = 0x00000800,
        MF_STRING = 0x00000000,
        pl_menu = [];
    this.NewMenuItem = function(index, type, value) {
        MenuMap[index] = [{
            type: ""
        }, {
            value: 0
        }];
        MenuMap[index].type = type;
        MenuMap[index].value = value;
    }
    this.BiographyTypeMenu = function(Menu, StartIndex) {
        var Index = StartIndex,
			lastfm_item = '',
			lasfm_menu = window.CreatePopupMenu(),
            c = [false, t.allmusic_bio, !t.allmusic_bio, t.allmusic_alb, !t.allmusic_alb, p.lfm_img, !p.lfm_img, p.cyc, false],
            n = ["Prefer:", "Biography: Allmusic", "Biography: Last.fm", "Review: Allmusic", "Review: Last.fm", "Photo: Last.fm", "Photo: foobar2000", "Auto Cycle Photo", "Lastfm server"];
        for (var i = 0; i < n.length; i++) {
			if(i==n.length-1){

			} else {
				this.NewMenuItem(Index, "Sources", i + 1);
				Menu.AppendMenuItem(i ? MF_STRING : MF_GRAYED, Index, n[i]);
				Menu.CheckMenuItem(Index++, c[i]);
				if ((i + 1) % 2 && i < 8 || i == 7) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);
			}
        }
		var i = 0;
		var lastfm_server_code = 'EN';
		for (var i = 0; i < lastfm_servers.length; i++) {
			lastfm_item = lastfm_servers[i].split('|');
			lasfm_menu.AppendMenuItem(MF_STRING, 6000+i, lastfm_item[0].toUpperCase()+" ("+lastfm_item[1]+")");
			if(properties.lastfm_server==i) {
				lasfm_menu.CheckMenuItem(6000+i, true);
				lastfm_server_code = lastfm_item[0].toUpperCase();
			}
		}		
		lasfm_menu.AppendMenuSeparator();		
		lasfm_menu.AppendMenuItem(MF_GRAYED, 0, "Lastfm searches always fall back to english");
		lasfm_menu.AppendTo(Menu, MF_STRING | MF_POPUP, "Lastfm server ("+lastfm_server_code+')');
		lasfm_menu.Dispose();
        return Index;
    }
    this.button = function(x, y) {
        var menu = window.CreatePopupMenu(),
            idx, Index = 1;
        Index = this.MoreMenu(menu, Index);
        idx = menu.TrackPopupMenu(x, y);
        if (idx >= 1 && idx <= Index) {
            var i = MenuMap[idx].value;
            p.multi_sel = i - 1;
            img.get = false;
            t.get = false;
            img.get_multi(p.multi_sel);
            t.get_multi(false, p.multi_sel);
            if (p.server) serv.get_bio(false, p.multi_sel);
            else if(!properties.dont_communicate) window.NotifyOthers("multi_tag", p.multi_sel);
            menu.Dispose();
        }
    }
    this.DefaultTypeMenu = function(Menu, StartIndex) {
        var Index = StartIndex,
            n = ["Properties", "Configure...", "Reload"];
        Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);
        for (var i = 0; i < 3; i++) {
            this.NewMenuItem(Index, "Default", i + 1);
            Menu.AppendMenuItem(MF_STRING, Index++, n[i]);
        }
        return Index;
    }
    this.DisplayTypeMenu = function(Menu, StartIndex) {
        var Index = StartIndex,
            c = [!p.text_only, false, false, p.text_only],
            r = [false, properties.ImgOnlyOnMouseHover, !properties.ImgOnlyOnMouseHover, false],			
            n = ["Image + Text", "Enlarge image on click", "Enlarge image on mouse over", "Text Only"],
			n_length = n.length;
        for (var i = 0; i < n_length; i++) {
            this.NewMenuItem(Index, "Display", i + 1);
            Menu.AppendMenuItem(((i==1 || i==2) && p.text_only)?MF_GRAYED:MF_STRING, Index, n[i]);
            Menu.CheckMenuItem(Index++, c[i]);
            if (i == n_length-1) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);
        }
		Menu.CheckMenuRadioItem(StartIndex+1, StartIndex+n_length-2, StartIndex+(properties.ImgOnlyOnMouseHover?2:1));
        return Index;
    }
    this.LayoutTypeMenu = function(Menu, StartIndex) {
        var Index = StartIndex,
            c = [!p.style, p.style == 1, p.style == 2, p.style == 3, img.border == 1 || img.border == 3, img.border > 1, false],
            n = ["Top", "Right", "Bottom", "Left", "Border", "Shadow", "Reload"];
        for (var i = 0; i < n.length; i++) {
            this.NewMenuItem(Index, "Layout", i + 1);
            Menu.AppendMenuItem(MF_STRING, Index, n[i]);
            Menu.CheckMenuItem(Index++, c[i]);
            if (i == 3 || i == 5) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);
        }
        return Index;
    }
    this.MoreMenu = function(Menu, StartIndex) {
        var Index = StartIndex;
        for (var i = 0; i < p.multi_arr.length; i++) {
            this.NewMenuItem(Index, "Multi-Tag", i + 1);
            Menu.AppendMenuItem(MF_STRING, Index, p.multi_arr[i].name);
            Menu.CheckMenuItem(Index++, p.multi_sel == -1 && name.artist() == p.multi_arr[i].name || p.multi_sel == i);
        }
        return Index;
    }
    this.playlists_changed = function() {
        pl_menu = [];
        for (var i = 0; i < plman.PlaylistCount; i++) pl_menu.push({
            name: plman.GetPlaylistName(i).replace(/&/g, "&&"),
            ix: i
        });
    };
    this.playlists_changed();
    this.PlaylistTypeMenu = function(i, Menu, StartIndex) {
        Index = StartIndex;
        for (var j = i * 30; j < Math.min(pl_menu.length, 30 + i * 30); j++) {
            this.NewMenuItem(Index, "Playlists", j);
            Menu.AppendMenuItem(MF_STRING, Index, pl_menu[j].name);
            Menu.CheckMenuItem(Index++, plman.ActivePlaylist == pl_menu[j].ix);
        }
        return Index;
    }
    this.ServerTypeMenu = function(Menu, StartIndex) {
        var Index = StartIndex;
        this.NewMenuItem(Index, "Server", 1);
        Menu.AppendMenuItem(MF_GRAYED, Index, "Biography Server");
        Index++;
        Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);
        return Index;
    }

    this.rbtn_up = function(x, y) {
        var BiographyMenu = window.CreatePopupMenu(),
            LayoutMenu = window.CreatePopupMenu(),
            menu = window.CreatePopupMenu(),
            PlaylistsMenu = window.CreatePopupMenu();
        var idx, Index = 1;
        if (p.server) Index = this.ServerTypeMenu(menu, Index);
        Index = this.DisplayTypeMenu(menu, Index);
        /*PlaylistsMenu.AppendTo(menu, MF_STRING | MF_POPUP, "Playlists");
        var pl_me = [],
            pl_no = Math.ceil(pl_menu.length / 30);
        for (var j = 0; j < pl_no; j++) {
            pl_me[j] = window.CreatePopupMenu();
            Index = this.PlaylistTypeMenu(j, pl_me[j], Index);
            pl_me[j].AppendTo(PlaylistsMenu, MF_STRING | MF_POPUP, "# " + (j * 30 + 1 + " - " + Math.min(pl_menu.length, 30 + j * 30) + (30 + j * 30 > plman.ActivePlaylist && ((j * 30) - 1) < plman.ActivePlaylist ? "  >>>" : "")));
        }
        menu.AppendMenuItem(MF_SEPARATOR, 0, 0);*/
        Index = this.BiographyTypeMenu(BiographyMenu, Index);
        BiographyMenu.AppendTo(menu, MF_STRING | MF_POPUP, "Sources");
        Index = this.LayoutTypeMenu(LayoutMenu, Index);
        LayoutMenu.AppendTo(menu, MF_STRING | MF_POPUP, "Layout");
		
		menu.AppendMenuItem(MF_SEPARATOR, 0, 0);
		menu.AppendMenuItem(MF_STRING, 7000, 'Stick to dark layout');
		menu.CheckMenuItem(7000, properties.stick2darklayout);
		menu.AppendMenuItem(MF_STRING, 7001, 'Force update');	
        if (utils.IsKeyPressed(0x10)) Index = this.DefaultTypeMenu(menu, Index);

        idx = menu.TrackPopupMenu(x, y);
		if(idx>=6000 && idx<6000+lastfm_servers.length){
			properties.lastfm_server = idx-6000;
			window.SetProperty("SERVER: lastfm", properties.lastfm_server);	
			if (p.server) serv.force_update(p.multi_sel);
			else if(!properties.dont_communicate) window.NotifyOthers("force_update", p.multi_sel);			
			window.Repaint();		
		} else if(idx==7000){
			properties.stick2darklayout = !properties.stick2darklayout;
			window.SetProperty("_DISPLAY: stick to Dark layout", properties.stick2darklayout);
			window.NotifyOthers("bio_stick_to_dark_theme",properties.stick2darklayout);
			get_colors();
			ui.get_colors();
			img.create_images();
			positionButtons();
			window.Repaint();
		} else if(idx==7001){			
			if (p.server) serv.force_update(p.multi_sel);
			else if(!properties.dont_communicate) window.NotifyOthers("force_update", p.multi_sel);
        } else if (idx >= 1 && idx <= Index) {
            var i = MenuMap[idx].value;
            switch (MenuMap[idx].type) {
                case "Display":
					if(i==1) p.mode(i);
					else if(i==4) p.mode(3);
					else if(i==2) {
						properties.ImgOnlyOnMouseHover = false;
						window.SetProperty("_DISPLAY: Img Only On Mouse over", properties.ImgOnlyOnMouseHover);
					}	
					else if(i==3) {
						properties.ImgOnlyOnMouseHover = true;
						window.SetProperty("_DISPLAY: Img Only On Mouse over", properties.ImgOnlyOnMouseHover);
					}
                    break
                case "Playlists":
                    plman.ActivePlaylist = pl_menu[i].ix;
                    break;
                case "Sources":
                    switch (i) {
                        case 2:
                        case 3:
                            t.allmusic_bio = !t.allmusic_bio;
                            window.SetProperty("SYSTEM.Allmusic Bio", t.allmusic_bio);
                            if (t.allmusic_bio) t.a_txt_run = 1;
                            else t.l_txt_run = 1;
                            p.multi_sel == -1 ? t.grab_text(false, -1) : t.grab_text(false, p.multi_sel);
                            img.get_images();
                            break;
                        case 4:
                        case 5:
                            t.allmusic_alb = !t.allmusic_alb;
                            window.SetProperty("SYSTEM.Allmusic Alb", t.allmusic_alb);
                            if (t.allmusic_alb) t.b_txt_run = 1;
                            else t.lfm_alb_run = 1;
                            p.multi_sel == -1 ? t.grab_text(false, -1) : t.grab_text(false, p.multi_sel);
                            img.get_images();
                            break;
                        case 6:
                        case 7:
                            p.lfm_img = !p.lfm_img;
                            window.SetProperty("SYSTEM.Image [Artist] Prefer Last.fm", p.lfm_img);
                            img.a_run = true;
                            img.get_images();
                            break;
                        case 8:
                            p.cyc = !p.cyc;
                            window.SetProperty("SYSTEM.Image [Artist] Cycle", p.cyc);
                            break;
                        case 9:
                            if (p.server) serv.force_update(p.multi_sel);
                            else if(!properties.dont_communicate) window.NotifyOthers("force_update", p.multi_sel);
                            break;
                    }
                    break;
                case "Layout":
                    switch (i) {
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                            p.style = i - 1;
                            p.sizes();
                            img.clear_rs_cache();
                            t.alb_calc();
                            t.art_calc();
                            img.get_images();
                            window.SetProperty("SYSTEM.Layout", p.style);
                            break;
                        case 5:
                            img.border = img.border == 0 ? 1 : img.border == 1 ? 0 : img.border == 2 ? 3 : 2;
                            window.SetProperty("SYSTEM.Image Border-1 Shadow-2 Both-3", img.border);
                            img.clear_rs_cache();
                            img.get_images();
                            break;
                        case 6:
                            img.border = img.border == 0 ? 2 : img.border == 1 ? 3 : img.border == 2 ? 0 : 1;
                            window.SetProperty("SYSTEM.Image Border-1 Shadow-2 Both-3", img.border);
                            img.clear_rs_cache();
                            img.get_images();
                            break;
                        case 7:
                            window.Reload();
                            break;
                    }
                    break;
                case "Default":
                    switch (i) {
                        case 1:
                            window.ShowProperties();
                            break;
                        case 2:
                            window.ShowConfigure();
                            break;
                        case 3:
                            window.Reload();
                            break;							
                    }
            }
        }
        BiographyMenu.Dispose();
        LayoutMenu.Dispose();
        menu.Dispose();
        PlaylistsMenu.Dispose();
        //for (var j in pl_me) pl_me[j].Dispose();
        return true;
    }
}


function text_manager() {
    var a_mod = "",
        a_mod_o = "",
        a_text = "",
        alb_id = "",
        alb_id_o = "",
        alb_txt_arr = [],
        alb_txt_o = "",
        art_txt_arr = [],
        art_txt_o = "",
        artist = "",
        artist_o = "",
        b_mod = "",
        b_mod_o = "",
        b_text = "",
        DT_LEFT = 0x00000000,
        DT_NOPREFIX = 0x00000800,
        l_mod = "",
        l_mod_o = "",
        l_text = "",
        lfm_alb_inf = "",
        lfm_alb_inf_o = "",
        lfm_alb_mod = "",
        lfm_alb_mod_o = "",
        new_text = 0,
        text_array = [];
    var allmusic_name = utils.ReadINI(p.bio_ini, "MISCELLANEOUS", p.def_tf[3].name);
    if (!allmusic_name) allmusic_name = p.def_tf[3].tf;
    this.a_txt_run = 1;
    this.alb_txt = "";
    this.art_txt = "";
    this.b_txt_run = 1;
    this.allmusic_alb = window.GetProperty("SYSTEM.Allmusic Alb", true);
    this.allmusic_bio = window.GetProperty("SYSTEM.Allmusic Bio", false);
    this.get = true;
    this.l_txt_run = 1;
    this.lfm_alb_run = 1;
    this.l = DT_LEFT | DT_NOPREFIX;
    this.text = "";
    this.text_run_a = 0;
    this.text_run_f = 0;
    this.update = 0;
    this.album_reset = function() {
        alb_id_o = alb_id;
        alb_id = !p.eval("[%album%]") ? p.eval("%path%") : p.eval("%album artist%%album%");
        var new_album = alb_id != alb_id_o;
        if (new_album) {
            this.text = null;
			t.title_length = false;			
            b_mod = b_text = lfm_alb_inf = lfm_alb_mod = "";
            b_mod_o = lfm_alb_inf_o = lfm_alb_mod_o = "1";
            this.b_txt_run = this.lfm_alb_run = 1;
        }
    }
    this.artist_reset = function() {
        if (p.multi_same()) return;
        artist_o = artist;
        artist = name.artist();
        var new_artist = artist != artist_o;
        if (new_artist) {
            this.text = false;
			t.title_length = false;			
            this.a_txt_run = this.l_txt_run = 1;
            a_mod = a_text = l_mod = l_text = "";
            a_mod_o = l_mod_o = "1";
        }
    }
    this.get_multi = function(p_calc, n) {
        if (p.img_only) return;
        artist_o = artist;
        artist = p.multi_arr[n].name;
        var new_artist = artist != artist_o;
        if (new_artist) {
            this.text = false;
            this.a_txt_run = this.l_txt_run = 1;
            a_mod = a_text = l_mod = l_text = "";
            a_mod_o = l_mod_o = "1";
        }
        this.grab_text(p_calc, n);
        this.get = false;
    }
    this.halt = function() {
        return p.w <= 10 || p.h <= 10;
    }
    this.block = function() {
        return this.halt() || !window.IsVisible;
    }
    this.get_txt_fallback = function() {
        if (!p.multi_new()) return;
        if (!this.get) return;
        this.album_reset();
        this.artist_reset();
        this.grab_text(false, -1);
        this.get = false;
    }
    this.grab = function(p_n) {
        if (this.block()) return;
        this.update = 1;
        this.grab_text(false, p_n);
        img.grab_a_img();
        img.grab_f_img();
        this.update = 0;
    }
    this.on_playback_dynamic_track = function() {
        if (this.block()) {
            this.get = true;
            this.artist_reset();
        } else {
            this.artist_reset();
            this.grab_text(false, -1);
            this.get = false;
        }
    }
    this.on_playback_new_track = function() {
        if (!p.multi_new()) return;
        if (this.block()) {
            this.get = true;
            if (fb.PlaybackLength > 0 || !fb.IsPlaying) {
                p.get_multi(true);
                this.album_reset();
                this.artist_reset();
            }
        } else {
            if (fb.PlaybackLength > 0 || !fb.IsPlaying) {
                p.get_multi(true);
                this.album_reset();
                this.artist_reset();
                this.grab_text(false, -1);
            }
            this.get = false;
        }
    }
    this.on_size = function() {
        this.grab_text(false, -1);
        p.get_multi(true);
        but.refresh();
    }
    this.rp = true;
    this.paint = function() {
        if (this.rp) window.Repaint();
    }
    this.scrollbar_type = function() {
        return img.artistart ? art_scrollbar : alb_scrollbar;
    }

    this.grab_text = function(p_calc, n) {
        if (p.img_only) return;
        new_text = 0;
        var a = artist.sanitise();
        switch (true) {
            case img.artistart:
                if (!this.allmusic_bio && (this.l_txt_run || this.update)) {
                    this.l_txt_run = 0;
                    this.text_l(a, n);
                    if (!l_text && (this.a_txt_run || this.update)) {
                        this.a_txt_run = 0;
                        this.text_a(a, n);
                    }
                }
                if (this.allmusic_bio && (this.a_txt_run || this.update)) {
                    this.a_txt_run = 0;
                    this.text_a(a, n);
                    if (!a_text && (this.l_txt_run || this.update)) {
                        this.l_txt_run = 0;
                        this.text_l(a, n);
                    }
                }
                break;
            case !img.artistart:
                if (p.ir()) break;
                if (this.allmusic_alb && (this.b_txt_run || this.update)) {
                    this.b_txt_run = 0;
                    this.text_b();
                    if (!b_text && (this.lfm_alb_run || this.update)) {
                        this.lfm_alb_run = 0;
                        this.lfm_alb();
                    }
                }
                if (!this.allmusic_alb && (this.lfm_alb_run || this.update)) {
                    this.lfm_alb_run = 0;
                    this.lfm_alb();
                    if (!lfm_alb_inf && (this.b_txt_run || this.update)) {
                        this.b_txt_run = 0;
                        this.text_b();
                    }
                }
                break;
        }
        if (!this.update || new_text) {
            this.art_txt = this.allmusic_bio ? a_text ? a_text : l_text : l_text ? l_text : a_text;
            this.alb_txt = this.allmusic_alb ? b_text ? b_text : lfm_alb_inf : lfm_alb_inf ? lfm_alb_inf : b_text;
            //this.text = img.artistart ? this.art_txt ? true : false : this.alb_txt ? true : false;
			this.text = !p.img_only;
            if (!this.art_txt && !p.img_only) this.art_txt = "There is no artist biography to display.";
            if (!this.alb_txt && !p.img_only) this.alb_txt = "There is no album review to display.";
            if (this.art_txt != art_txt_o || p_calc) {
                this.art_calc();
                art_txt_o = this.art_txt;
            }
            if (this.alb_txt != alb_txt_o || p_calc) {
				p.review_rating = -1;
                this.alb_calc();
                alb_txt_o = this.alb_txt;
            }
            if (p.text_only) this.paint();
        }
        new_text = 0;
    }

    this.alb_calc = function() {
        if (!this.alb_txt || p.img_only) return;
        var g = gdi.CreateImage(1, 1),
            gb = g.GetGraphics(),
            l = gb.EstimateLineWrap(this.alb_txt, ui.font, p.text_w).toArray();
        alb_txt_arr = [];
        for (var i = 0; i < l.length; i += 2) alb_txt_arr.push(l[i].trim());
		
		var rating = alb_txt_arr[0].split('###');
		if(rating[0].length<4) {
			p.review_rating = Number(rating[0])*2;
			alb_txt_arr[0] = rating[1];
			if(p.review_rating>0) alb_txt_arr.unshift("",""); 
			else p.review_rating = -1;
		}			
		
        but.refresh(true);
        alb_scrollbar.reset();
        alb_scrollbar.metrics(p.sbar_x, p.sbar_y, ui.scr_w, p.sbar_h, p.lines_drawn, ui.font_h);
        alb_scrollbar.set_rows(alb_txt_arr.length);
        g.ReleaseGraphics(gb);
        g.Dispose();
    }

    this.art_calc = function() {
        if (!this.art_txt || p.img_only) return;
        var g = gdi.CreateImage(1, 1),
            gb = g.GetGraphics(),
            l = gb.EstimateLineWrap(this.art_txt, ui.font, p.text_w).toArray();
        art_txt_arr = [];
        for (var i = 0; i < l.length; i += 2) art_txt_arr.push(l[i].trim());
        but.refresh(true);
        art_scrollbar.reset();
        art_scrollbar.metrics(p.sbar_x, p.sbar_y, ui.scr_w, p.sbar_h, p.lines_drawn, ui.font_h);
        art_scrollbar.set_rows(art_txt_arr.length);
        g.ReleaseGraphics(gb);
        g.Dispose();
    }

    this.text_l = function(a, n) {
        var lfm_a = p.sanitise_path(n == -1 || isNaN(n) || n != -1 && p.multi_arr.length < n + 1 ? p.dl_lfm_bio_pth : p.dl_lfm_bio_mul.replace(RegExp(p.def_tf[1].name, "gi"), p.multi_arr[n].meta)) + a + ".txt";
        if (!p.file(lfm_a)) return;
        l_mod = p.last_modified(lfm_a);
        if (!(l_mod - l_mod_o)) return;
        l_text = utils.ReadTextFile(lfm_a).trim();
        new_text = 1;
        l_mod_o = l_mod;
        if (!p.text_only) {
            this.text_run_a = 1;
            this.text_run_f = 1;
            img.clear_a_rs_cache();
        }
    }

    this.text_a = function(a, n) {
        var allmusic_a = p.sanitise_path(n == -1 || isNaN(n) || n != -1 && p.multi_arr.length < n + 1 ? p.dl_am_bio_pth : p.dl_am_bio_mul.replace(RegExp(p.def_tf[1].name, "gi"), p.multi_arr[n].meta)) + a + ".txt";
        if (!p.file(allmusic_a)) return;
        a_mod = p.last_modified(allmusic_a);
        if (!(a_mod - a_mod_o)) return;
        a_text = utils.ReadTextFile(allmusic_a).trim();
        new_text = 1;
        a_mod_o = a_mod;
        if (!p.text_only) {
            this.text_run_a = 1;
            this.text_run_f = 1;
            img.clear_a_rs_cache();
        }
    }

    this.text_b = function() {
        var allmusic = p.sanitise_path(p.dl_am_rev_pth) + name.alb_artist().sanitise() + " - " + name.album().sanitise() + ".txt";
        if (!p.file(allmusic)) return;
        b_mod = p.last_modified(allmusic);
        if (!(b_mod - b_mod_o)) return;
        b_text = utils.ReadTextFile(allmusic).trim();
        new_text = 1;
        b_mod_o = b_mod;
        if (allmusic_name == 0) {
            var s = b_text.indexOf(" <<  ") + 5;
            b_text = b_text.slice(s);
        } else if (allmusic_name != "Album rating") b_text = b_text.replace("Album rating", allmusic_name);
        if (!p.text_only) {
            this.text_run_a = 1;
            this.text_run_f = 1;
            img.clear_c_rs_cache();
        }
    }

    this.lfm_alb = function() {
        var lfm_b = p.sanitise_path(p.dl_lfm_rev_pth) + name.alb_artist().sanitise() + " - " + name.album().sanitise() + ".txt";
        if (!p.file(lfm_b)) return;
        lfm_alb_mod = p.last_modified(lfm_b);
        if (!(lfm_alb_mod - lfm_alb_mod_o)) return;
        lfm_alb_inf = utils.ReadTextFile(lfm_b).trim();
        new_text = 1;
        lfm_alb_mod_o = lfm_alb_mod;
        if (!p.text_only) {
            this.text_run_a = 1;
            this.text_run_f = 1;
            img.clear_c_rs_cache();
        }
    }

    this.draw = function(gr) {
        if (!p.img_only && (!p.fill || img.artistart) || p.text_only) {
           try {
                this.get_txt_fallback();
                var y = p.text_y + ui.bot_ws;
				
                if (img.artistart && this.art_txt) {
                    var s = Math.round(art_scrollbar.delta / ui.font_h + 0.4),
                        e = s + p.lines_drawn;
                    e = art_txt_arr.length < e ? art_txt_arr.length : e;
					
					if(typeof artist=='undefined') artist = name.artist();
					gr.GdiDrawText(artist, ui.font_title, ui.textcol, p.text_x, y-p.title_y_adjustement, p.text_w, ui.font_title_h, DT_LEFT | DT_BOTTOM | DT_CALCRECT | DT_NOPREFIX | DT_END_ELLIPSIS);
					
					y += ui.font_title_h;
                    for (var i = s; i < e; i++) {
                        var item_y = ui.font_h * i + y - art_scrollbar.delta;
                        gr.GdiDrawText(art_txt_arr[i], ui.font, ui.textcol, p.text_x, item_y, p.text_w, ui.font_h, this.l);
                    }
                }
                if (!img.artistart && this.alb_txt) {
                    var s = Math.round(alb_scrollbar.delta / ui.font_h + 0.4),
                        e = s + p.lines_drawn;
                    e = alb_txt_arr.length < e ? alb_txt_arr.length : e;
					
					if(typeof album=='undefined') album = name.album();
					if(typeof artist=='undefined') artist = name.artist();	
					if(typeof this.title_length=='undefined' || !this.title_length) this.title_length = gr.CalcTextWidth(album , ui.font_title);			
					gr.GdiDrawText(album , ui.font_title, ui.textcol, p.text_x, y-p.title_y_adjustement, p.text_w, ui.font_title_h, DT_LEFT | DT_BOTTOM | DT_CALCRECT | DT_NOPREFIX | DT_END_ELLIPSIS);
					gr.GdiDrawText(' - '+artist , ui.font_subtitle, ui.textcol, p.text_x+this.title_length, y-p.title_y_adjustement, p.text_w-this.title_length, ui.font_title_h, DT_LEFT | DT_BOTTOM | DT_CALCRECT | DT_NOPREFIX | DT_END_ELLIPSIS);
					
					y += ui.font_title_h;			
										
                    for (var i = s; i < e; i++) {
                        var item_y = ui.font_h * i + y - alb_scrollbar.delta;
						if(i==0 && p.review_rating>=0 && alb_txt_arr.length>1) {
							var rating_label_w = gr.CalcTextWidth("Allmusic rating:" , ui.font);								
							gr.GdiDrawText("Allmusic rating:", ui.font, ui.textcol, p.text_x, item_y, p.text_w, ui.font_h, this.l);
							gr.DrawImage(img.ratingImages[p.review_rating], p.text_x+rating_label_w+10, item_y+Math.floor((ui.font_h-img.ratingImages[p.review_rating].Height)/2)-1, img.ratingImages[p.review_rating].Width, img.ratingImages[p.review_rating].Height, 0, 0, img.ratingImages[p.review_rating].Width, img.ratingImages[p.review_rating].Height, 0, 255);								
						}
                        gr.GdiDrawText(alb_txt_arr[i], ui.font, ui.textcol, p.text_x, item_y, p.text_w, ui.font_h, this.l);
                    }
                }
            } catch (e) {console.log(e+' p.review_rating'+p.review_rating)}
        }
    }
}


function image_manager() {
    var a_im = [],
        a_img = [],
        all_files_o_length = 0,
        artist = "",
        artist_o = "",
        artist_image_run = 0,
        artist_img = null,
        ax = [],
        ay = [],
        chk_arr = [],
        core_img = [],
        folder = "",
        g_valid_tid = 0,
        f_im = [],
        fx = [],
        fy = [],
        ha = 0,
        hf = 0,
        i_x = 0,
        ix = 0,
        image_path_o = "",
        init = true,
        nw = 0,
        pix = 0,
        piy = 0,
        sh_img = null,
        update = 0,
        wa = 0,
        wf = 0,
        wID1 = 0,
        wID2 = 0,
        xa = 0,
        xf = 0,
        ya = 0,
        yf = 0;
    this.a_run = true;
    this.arr = [];
    this.artistart = window.GetProperty("SYSTEM.Artist Art", false);
    this.border = window.GetProperty("SYSTEM.Image Border-1 Shadow-2 Both-3", 0);
    this.displayed_other_panel = null;
    this.get = true;
    this.nh = 0;
	this.ratingImages = Array();
    var arr_contains = function(arr, item) {
        for (var i = 0; i < arr.length; i++)
            if (arr[i] == item) return true;
        return false;
    }
	this.SetRatingImages = function(width, height, on_color, off_color, border_color){
		if(typeof(on_color) == "undefined" || typeof(off_color) == "undefined"|| typeof(border_color) == "undefined") return false;
		var star_padding =-1;
		var star_indent = 2;
		var star_size = height;	
	    var star_height = height;
		while(star_padding<=0) {
			star_size = star_height;
			star_padding = Math.round((width-5*star_size)/4);
			star_height--;
		}
		if(star_height < height) var star_vpadding = Math.floor((height - star_height)/2);

		ratingImages = Array();

		
		for (var rating = 0; rating <= 10; rating++) {
			real_rating = rating/2;
			if(Math.round(real_rating)!= real_rating){				
				var img_off = gdi.CreateImage(width, height);
				var gb = img_off.GetGraphics();
				for (var i = 0; i < 5; i++) {
					DrawPolyStar(gb, i*(star_size+star_padding), star_vpadding, star_size, star_indent, 10, 0, border_color, off_color);
				}
				img_off.ReleaseGraphics(gb);
				
				var img_on = gdi.CreateImage(width, height);
				var gb = img_on.GetGraphics();
				for (var i = 0; i < 5; i++) {
					DrawPolyStar(gb, i*(star_size+star_padding), star_vpadding, star_size, star_indent, 10, 0, border_color, on_color);
				}
				img_on.ReleaseGraphics(gb);
				
				var half_mask_left = gdi.CreateImage(width, height);				
				var gb = half_mask_left.GetGraphics();
					gb.FillSolidRect(0,0,width,height,GetGrey(255));
					gb.FillSolidRect(0,0,Math.round(width*rating/10),height,GetGrey(0));
				half_mask_left.ReleaseGraphics(gb);
				
				var half_mask_right = gdi.CreateImage(width, height);				
				var gb = half_mask_right.GetGraphics();
					gb.FillSolidRect(0,0,width,height,GetGrey(255));
					gb.FillSolidRect(Math.round(width*rating/10),0,width-Math.round(width*rating/10),height,GetGrey(0));
				half_mask_right.ReleaseGraphics(gb);				
				
				img_on.ApplyMask(half_mask_left);
				img_off.ApplyMask(half_mask_right);				
				
				var img = gdi.CreateImage(width, height);
				var gb = img.GetGraphics();
				gb.DrawImage(img_off, 0, 0, width, height, 0, 0, width, height);
				gb.DrawImage(img_on, 0, 0, width, height, 0, 0, width, height);				
				img.ReleaseGraphics(gb);
			} else {
				var img = gdi.CreateImage(width, height);
				var gb = img.GetGraphics();
				for (var i = 0; i < 5; i++) {
					DrawPolyStar(gb, i*(star_size+star_padding), star_vpadding, star_size, star_indent, 10, 0, border_color, ((i<real_rating) ? on_color : off_color));
				}
				img.ReleaseGraphics(gb);
			}
			ratingImages[rating] = img;
		}
		return ratingImages;
	}	
    this.artist_reset = function() {
        artist_o = artist;
        artist = name.artist();
        var new_artist = artist && artist != artist_o || !artist;
        timer.step = 0;
        if (new_artist) {
            folder = p.sanitise_path(p.dl_art_pth);
            this.clear_art_cache();
            if (p.lfm_img) this.a_run = true;
            if (!this.arr.length) {
                all_files_o_length = 0;
                ix = 0;
            }
        }
    }
    this.draw = function(gr) {
        if (p.text_only) return;
        try {
            this.get_img_fallback();
            if (fb.IsPlaying || fb.GetFocusItem()) this.pic(gr);
            else {
                this.noimg[2] && gr.DrawImage(this.noimg[2], (p.w - this.nh) / 2, p.img_y, this.nh, this.nh, 0, 0, this.noimg[2].Width, this.noimg[2].Height);
				this.img_real_x = 0;
				this.img_real_y = 0;
				this.img_real_w = 0;
				this.img_real_h = 0;
            }
        } catch (e) {}
    }
    this.grab = function(force) {
        if (t.block()) return;
        update = 1;
        this.grab_a_img();
        if (force) this.grab_f_img();
        update = 0;
    }
    this.grab_f_img = function() {
        if (t.update && !t.text_run_f) return;
        t.text_run_f = 0;
        i_x = 0;
        var handle = fb.IsPlaying ? fb.GetNowPlaying() : fb.GetFocusItem();
        if (handle) {
			cache_image = g_image_cache.hit(handle);
			if (!(typeof(cache_image) == "undefined" || cache_image == null)){
				final_image = cache_image.Clone(0, 0, cache_image.Width, cache_image.Height);
				if (p.server) serv.on_get_alb_art_done(final_image);
				img.get_album_art_done(final_image, cover_path);				
			}
            //utils.GetAlbumArtAsync(window.ID, handle, 0);
        }
    }
    this.get_images = function() {
        if (p.text_only) return;
        if (this.artistart && p.lfm_img) {
            if (p.multi_sel == -1) this.artist_reset();
            this.grab_a_img();
        } else this.grab_f_img();
    }
    this.get_img_fallback = function() {
        if (!p.multi_new()) return;
        if (!this.get) return;
        this.get_images();
        this.get = false;
    }
    this.im_a = function(i, image, x, y) {
        try {
            if (!image) return;
            wa = image.Width;
            ha = image.Height;
            xa = x[i];
            ya = y[i];
        } catch (e) {}
    }
    this.im_f = function(i, image, x, y) {
        try {
            if (!image) return;
            wf = image.Width;
            hf = image.Height;
            xf = x[i];
            yf = y[i];
        } catch (e) {}
    }
    this.on_playback_dynamic_track = function() {
        timer.image();
        if (t.block()) {
            this.get = true;
            this.artist_reset();
        } else {
            this.artist_reset();
            this.get_images();
            this.get = false;
        }
    }
    this.on_size = function() {
        if (p.text_only) return;
        this.img_c();
        this.clear_a_rs_cache();
        this.clear_c_rs_cache();
        if (this.artistart) this.grab_a_img();
        else this.grab_f_img();
        init = false;
        if (p.img_only) p.get_multi(true);
        but.refresh();
    }
    this.set_chk_arr = function(arr_ix) {
        chk_arr = [window.ID, arr_ix, this.displayed_other_panel];
        if(!properties.dont_communicate) window.NotifyOthers("chk_arr", chk_arr);
    }
    var shuffle = function(ary) {
        for (var i = ary.length - 1; i >= 0; i--) {
            var randomIndex = Math.floor(Math.random() * (i + 1)),
                itemAtIndex = ary[randomIndex];
            ary[randomIndex] = ary[i];
            ary[i] = itemAtIndex;
        }
        return ary;
    }

    this.on_playback_new_track = function() {
        timer.image();
        if (!p.multi_new()) return;
        if (t.block()) {
            this.get = true;
            if (fb.PlaybackLength > 0 || !fb.IsPlaying) this.artist_reset();
        } else {
            if (this.artistart && p.lfm_img) {
                if (fb.PlaybackLength > 0 || !fb.IsPlaying) {
                    this.artist_reset();
                    this.grab_a_img();
					if(update_cover) this.grab_f_img();
                }
            } else if(update_cover) this.grab_f_img();
            this.get = false;
        }
		delete album;
		update_cover=true;
    }

    this.get_multi = function(n) {
        if (p.text_only || n == -1 || isNaN(n) || n != -1 && p.multi_arr.length < n + 1) return;
        timer.image();
        artist_o = artist;
        artist = p.multi_arr[n].name;
        var new_artist = artist && artist != artist_o || !artist;
        timer.step = 0;
        if (p.lfm_img) {
            if (new_artist) {
                folder = p.sanitise_path(p.dl_art_mul.replace(RegExp(p.def_tf[1].name, "gi"), p.multi_arr[n].meta));
                this.clear_art_cache();
                if (p.lfm_img) this.a_run = true;
                if (!this.arr.length) all_files_o_length = 0;
                ix = 0;
            }
            this.grab_a_img();
        } else this.grab_f_img();
        this.get = false;
    }

    this.get_album_art_done = function(image, image_path) {
        if (image_path_o == image_path && f_im[i_x] && image) {
            core_img[i_x] = f_im[i_x].Clone(0, 0, f_im[i_x].Width, f_im[i_x].Height);
            this.im_f(i_x, core_img[i_x], fx, fy);
            if (this.border) core_img[i_x] = this.border_img(core_img[i_x], xf, yf, wf, hf, 0);
            return t.paint();
        }
        image_path_o = image_path;
        this.clear_cov_cache();
        core_img[i_x] = image;
        if (!core_img[i_x]) core_img[i_x] = this.artistart ? this.noimg[1].Clone(0, 0, this.noimg[1].Width, this.noimg[1].Height) : this.noimg[0].Clone(0, 0, this.noimg[0].Width, this.noimg[0].Height);
        if (!core_img[i_x]) return;
        this.img_c();
        this.img_s(core_img[i_x], 0);
        this.img_rs("", f_im, i_x, core_img[i_x], fx, fy, xf, yf, wf, hf, 0);
        if (this.border) core_img[i_x] = this.border_img(core_img[i_x], xf, yf, wf, hf, 0);
        t.paint();
    }

    this.grab_a_img = function() {
        if (!this.artistart || p.text_only) return;
        artist_image_run = 0;
        if (this.a_run || t.update || update) {
            this.a_run = false;
            if (artist) this.read_arr();
        }
        if (!t.update || !update || artist_image_run || t.text_run_a) {
            this.set_chk_arr(p.lfm_img ? this.arr[ix] : null);
            this.artist_image();
        };
        artist_image_run = 0;
        t.text_run_a = 0;
    }

    this.read_arr = function() {
        var all_files = utils.Glob(folder + "*").toArray();
        if (all_files.length == all_files_o_length) return;
        all_files_o_length = all_files.length;
        var incl_lge = 0; // 0 & 1 - exclude & include artist images > 8 MB
        var sel_files = [];
        for (var j = 0; j < all_files.length; j++) {
            if (p.fs.GetFile(all_files[j]).Size >= 8388608 && !incl_lge) continue;
            if ((/(?:jpe?g|gif|png|bmp)$/i).test(p.fs.GetExtensionName(all_files[j]))) {
                var bAdd = true;
                if (bAdd) {
                    if (t.update) {
                        if (!arr_contains(this.arr, all_files[j])) {
                            this.arr.push(all_files[j]);
                            artist_image_run = 1;
                        }
                    } else {
                        sel_files[sel_files.length] = all_files[j];
                        artist_image_run = 1;
                        this.arr = shuffle(sel_files);
                    } // randomized to give variable image order
                }
            }
        }
    }

    this.artist_image = function() {
        if (this.arr.length > 0) {
            if (a_im[ix]) {
                artist_img = a_im[ix];
                this.im_a(ix, artist_img, ax, ay);
                if (this.border) artist_img = this.border_img(artist_img, xa, ya, wa, ha, 1);
                t.paint();
            } else if (a_img[ix]) {
                artist_img = a_img[ix];
                this.img_c();
                this.img_s(artist_img, 1);
                this.img_rs(a_img, a_im, ix, artist_img, ax, ay, xa, ya, wa, ha, 1);
                if (this.border) artist_img = this.border_img(artist_img, xa, ya, wa, ha, 1);
                t.paint();
            } else g_valid_tid = gdi.LoadImageAsync(window.ID, this.arr[ix]);
        } else if (!init) this.grab_f_img();
    }

    this.load_done = function(tid, image) {
        if (g_valid_tid != tid) return;
        artist_img = image;
        if (!artist_img) return;
        this.img_c();
        this.img_s(artist_img, 1);
        this.img_rs(a_img, a_im, ix, artist_img, ax, ay, xa, ya, wa, ha, 1);
        if (this.border) artist_img = this.border_img(artist_img, xa, ya, wa, ha, 1);
        t.paint();
    }

    this.img_c = function() {
        pix = !t.text && p.style == 1 ? p.bor_x : p.img_x;
        nw = Math.max(!p.fill || this.artistart ? !p.style || p.style == 2 ? p.w - p.img_x * 2 : t.text ? p.imgs : p.w - pix * 2 : p.w, 10);
        piy = !t.text && p.style == 2 ? p.bor_top : p.img_y;
        this.nh = Math.max(!p.fill || this.artistart ? p.style == 1 || p.style == 3 ? p.h - p.img_y * 2 : t.text ? p.imgs : p.h - piy * 2 : p.h, 10);
    }

    this.img_s = function(image, n) {
        try {
            if (!image) return;
            var s = Math.min(this.nh / image.Height, nw / image.Width);
            var tw = !p.fill || this.artistart ? Math.round(image.Width * s) : nw;
            var th = !p.fill || this.artistart ? Math.round(image.Height * s) : this.nh;
            var tx = !p.fill || this.artistart ? Math.round((nw - tw) / 2 + pix) : 0;
            var ty = !p.fill || this.artistart ? Math.round((this.nh - th) / 2 + piy) : 0;
            switch (n) {
                case 0:
                    xf = tx;
                    yf = ty;
                    wf = tw;
                    hf = th;
                    break;
                case 1:
                    xa = tx;
                    ya = ty;
                    wa = tw;
                    ha = th;
                    break;
            }
        } catch (e) {}
    }

    this.img_rs = function(p_img, p_im, i, image, arr_x, arr_y, x, y, w, h, n) {
        try {
            if (!image) return;
            if (n) p_img[i] = image;
            p_im[i] = image.Clone(0, 0, image.Width, image.Height);
            p_im[i] = p_im[i].Resize(w, h, 2);
            image = p_im[i];
            arr_x[i] = x;
            arr_y[i] = y;
        } catch (e) {}
    }

    this.border_img = function(i_m, x, y, w, h, n) {
        var bor_w1 = 0,
            bor_w2 = bor_w1 * 2,
            imgbw = 0,
            imgbh = 0,
            th = 0,
            tw = 0;
        if (this.border > 1) {
            imgbw = 15;
            imgbh = 15;
            th = Math.max(Math.min(h, p.h - 10 - y), 10);
            if (n) ha = th;
            else hf = th;
            tw = Math.max(Math.min(w, p.w - 10 - x), 10);
            if (n) wa = tw;
            else wf = tw;
            sh_img = gdi.CreateImage(Math.floor(tw + imgbw), Math.floor(th + imgbh));
            var gb = sh_img.GetGraphics();
            gb.FillSolidRect(5, 5, tw-5, th-5, img_shadow_color);
            sh_img.ReleaseGraphics(gb);
            sh_img.StackBlur(6);
        } else {
            th = h;
            tw = w;
        }
        bor_img = gdi.CreateImage(Math.floor(tw + imgbw), Math.floor(th + imgbh));
        var gb = bor_img.GetGraphics();
        if (this.border > 1) gb.DrawImage(sh_img, 0, 0, Math.floor(tw + imgbw), Math.floor(th + imgbh), 0, 0, sh_img.Width, sh_img.Height);
        if (this.border == 1 || this.border == 3) {
            gb.FillSolidRect(0, 0, tw, th, img_border_color);
            bor_w1 = !this.nh ? 1 : this.nh > 400 ? 1 : Math.ceil(1 * this.nh / 400);
            bor_w2 = bor_w1 * 2;
        }
        gb.DrawImage(i_m, bor_w1, bor_w1, tw - bor_w2, th - bor_w2, 0, 0, i_m.Width, i_m.Height);
        bor_img.ReleaseGraphics(gb);
        if (sh_img) sh_img.Dispose();
        sh_img = null;
        return bor_img;
    }

    this.pic = function(gr) {
        //var pic = this.artistart && this.arr.length && p.lfm_img ? artist_img : this.artistart ? core_img[1] : core_img[0];
		var pic = this.artistart && this.arr.length && p.lfm_img ? artist_img : core_img[0];
        if (!pic) return;
        if (this.artistart && this.arr.length && p.lfm_img && ha) {
			this.img_real_x = xa;
			this.img_real_w =  wa + (this.border > 1 ? 15 : 0);
			this.img_real_h = ha + (this.border > 1 ? 15 : 0);	
			this.img_real_y = (p.style==1 || p.style==3)?p.text_y:(p.style==2)?p.h-this.img_real_h-p.bor_bot:p.bor_top;					
			gr.DrawImage(pic, this.img_real_x, this.img_real_y, this.img_real_w, this.img_real_h, 0, 0, pic.Width, pic.Height);	
        } else if (hf) {
			this.img_real_x = xf;
			this.img_real_w = wf + (this.border > 1 ? 15 : 0);
			this.img_real_h = hf + (this.border > 1 ? 15 : 0);		
			this.img_real_y = (p.style==1 || p.style==3)?p.text_y:(p.style==2)?p.h-this.img_real_h-p.bor_bot:p.bor_bot;			
			gr.DrawImage(pic, this.img_real_x, this.img_real_y, this.img_real_w, this.img_real_h, 0, 0, pic.Width, pic.Height);	
        } else {
			this.img_real_x = 0;
			this.img_real_y = 0;
			this.img_real_w = 0;
			this.img_real_h = 0;			
		}
    }

    this.change = function(incr) {
        ix += incr;
        if (ix < 0) ix = this.arr.length - 1;
        else if (ix >= this.arr.length) ix = 0;
        var i = 0;
        while (this.displayed_other_panel == this.arr[ix] && i < this.arr.length) {
            ix += incr;
            if (ix < 0) ix = this.arr.length - 1;
            else if (ix >= this.arr.length) ix = 0;
            i++;
        }
        this.set_chk_arr(this.arr[ix]);
        this.artist_image();
    }

    this.fresh = function() {
        if (t.block() || !p.cyc || !this.artistart || this.arr.length < 2 || p.text_only || (fb.IsPlaying ? fb.PlaybackTime - timer.step < p.cycle / 2 : false) || !p.lfm_img) return;
        this.change(1);
    }

    this.clear_cov_cache = function() {
        if (core_img[0]) core_img[0].Dispose();
        core_img[0] = null;
        this.clear_c_rs_cache();
    }

    this.clear_c_rs_cache = function() {
        if (f_im[0]) f_im[0].Dispose();
        f_im[0] = null;
    }

    this.clear_art_cache = function() {
        if (artist_img) artist_img.Dispose();
        for (var i in a_img)
            if (a_img[i]) a_img[i].Dispose();
        a_img = [];
        this.arr = [];
        if (core_img[1]) core_img[1].Dispose();
        artist_img = core_img[1] = null;
        this.clear_a_rs_cache();
    }

    this.clear_a_rs_cache = function() {
        for (var i in a_im)
            if (a_im[i]) a_im[i].Dispose();
        a_im = [];
        if (f_im[1]) f_im[1].Dispose();
        f_im[1] = null;
    }

    this.clear_rs_cache = function() {
        this.clear_c_rs_cache();
        this.clear_a_rs_cache();
    }

    this.wheel = function(step) {
        if (this.arr.length < 2 || !this.artistart || p.text_only || !p.lfm_img) return;
        this.change(-step);
        if (this.artistart && p.cyc) timer.step = Math.floor(fb.PlaybackTime);
    }

    this.chk_arr = function(info) {
        if (t.block()) return;
        if (this.arr.length < 2 || !this.artistart || p.text_only || !p.lfm_img) return;
        this.displayed_other_panel = info[1];
        if (!wID1) wID1 = info[0];
        wID2 = (wID1 == info[0]) ? 0 : info[0];
        if (this.arr[ix] != info[2] && !wID2) {
            chk_arr = [window.ID, this.arr[ix], this.displayed_other_panel];
            if(!properties.dont_communicate) window.NotifyOthers("chk_arr", chk_arr);
        }
        if (window.ID > info[0]) return;
        if (this.arr[ix] == this.displayed_other_panel) this.change(1);
    }

    this.create_images = function() {
        var cc = StringFormat(1, 1),
            gb;
        this.noimg = [images.nocover_img, images.noartist_img, "STOPPED"];			
        //this.noimg = ["COVER", "PHOTO", "STOPPED"];
        /*for (var i = 0; i < this.noimg.length; i++) {
            var n = this.noimg[i]
            this.noimg[i] = gdi.CreateImage(200, 200);
            gb = this.noimg[i].GetGraphics();
            //gb.FillSolidRect(0, 0, 200, 200, ui.textcol);
            //gb.FillGradRect(-1, 0, 202, 200, 90, ui.backcol & 0xbbffffff, ui.backcol, 1.0);
            gb.SetTextRenderingHint(4);
            gb.DrawString(i == 2 ? "f2k" : "NO", g_font.nowplaying_title, ui.textcol, 0, 0, 200, 110, cc);
            gb.DrawString(n, g_font.nowplaying_subtitle , ui.textcol, 1, 50, 200, 110, cc);
            this.noimg[i].ReleaseGraphics(gb);
        }*/
        this.get = true;
		this.ratingImages = this.SetRatingImages(60, 12, rating_icon_on, rating_icon_off, rating_icon_border);	
    }
}


function timers() {
    var timer_arr = ["dl", "img", "zSearch"];
    this.step = 0;
    for (var i = 0; i < timer_arr.length; i++) {
        this[timer_arr[i]] = false;
        this[timer_arr[i] + "i"] = i;
    }
    var res = function(force) {
        if(!properties.dont_communicate) window.NotifyOthers("grab_img", force);
        if (p.server) img.grab(force);
        timer.reset(timer.dl, timer.dli);
    }
    this.reset = function(timer, n) {
        if (timer) window.ClearTimeout(timer);
        this[timer_arr[n]] = false;
    }
    this.decelerating = function(force) {
        this.reset(this.dl, this.dli);
        this.dl = window.SetTimeout(function() {
            res(force);
            timer.dl = window.SetTimeout(function() {
                res(force);
                timer.dl = window.SetTimeout(function() {
                    res(force);
                    timer.dl = window.SetTimeout(function() {
                        res(force);
                        timer.dl = window.SetTimeout(function() {
                            res(force);
                            timer.dl = window.SetTimeout(function() {
                                res(force);
                                timer.dl = window.SetTimeout(function() {
                                    res(force);
                                    timer.dl = window.SetTimeout(function() {
                                        res(force);
                                    }, 7000)
                                }, 6000)
                            }, 5000)
                        }, 4000)
                    }, 3000)
                }, 2000)
            }, 1000)
        }, 1000)
    }
    this.image = function() {
        if (!p.server) return;
        this.reset(this.img, this.imgi);
        this.img = window.SetInterval(function() {
            img.fresh();
            if(!properties.dont_communicate) window.NotifyOthers("img_chg", 0);
        }, p.cycle * 1000);
    }
}

function on_get_album_art_done(metadb, art_id, image, image_path) {
    if (p.server) serv.on_get_alb_art_done(image);
    img.get_album_art_done(image, image_path);
}

function on_load_image_done(tid, image) {
    img.load_done(tid, image);
}

/*function on_item_focus_change() {
    if (fb.IsPlaying || !p.multi_new()) return;
	if(window.IsVisible){	
		p.get_multi(true);
		if (t.block() && !p.server) {
			img.get = true;
			t.get = true;
			img.artist_reset();
			t.album_reset();
			t.artist_reset();
		} else {
			if (t.block() && p.server) {
				img.get = true;
				t.get = true;
				img.artist_reset();
				t.album_reset();
				t.artist_reset();
			} else {
				img.get = false;
				t.get = false;
			}
			if (!p.text_only) img.on_playback_new_track();
			if (!p.img_only) t.on_playback_new_track();
			timer.reset(timer.zSearch, timer.zSearchi);
			timer.zSearch = window.SetTimeout(function() {
				if (p.server) serv.on_playback_new_track();
				timer.reset(timer.zSearch, timer.zSearchi);
			}, 1000);
			if (timer.zSearch === 0 && p.server) {
				serv.on_playback_new_track();
				timer.reset(timer.zSearch, timer.zSearchi);
			}
		}
	} else {
		set_update_function('on_item_focus_change()');
	}		

}*/

function on_key_down(vkey) {
    switch (vkey) {
        case 0x21:
            if (!p.img_only && !ui.zoom()) t.scrollbar_type().wheel(1, true);
            break;
        case 0x22:
            if (!p.img_only && !ui.zoom()) t.scrollbar_type().wheel(-1, true);
            break;
        case 37:
            img.wheel(1);
            break;
        case 39:
            img.wheel(-1);
            break;
    }
}

function on_metadb_changed(metadbs, fromhook) {
    if (p.ir() || t.block() && !p.server || !p.multi_new()) return;
	if(fromhook) return;
    p.get_multi(true);
    if (!p.text_only) img.on_playback_new_track();
    if (!p.img_only) t.on_playback_new_track();
    timer.reset(timer.zSearch, timer.zSearchi);
    timer.zSearch = window.SetTimeout(function() {
        if (p.server) serv.on_playback_new_track();
        timer.reset(timer.zSearch, timer.zSearchi);
    }, 500);
    if (timer.zSearch === 0 && p.server) {
        serv.on_playback_new_track();
        timer.reset(timer.zSearch, timer.zSearchi);
    }
}

function on_notify_data(name, info) {
    if (ui.local) on_cui_notify(name, info);
    switch (name) {
		case "set_font":
			properties.globalFontAdjustement = info;
			window.SetProperty("MAINPANEL: Global Font Adjustement", properties.globalFontAdjustement),
			ui.get_font();
			window.Repaint();
		break; 		
		case "cover_cache_finalized": 
			g_image_cache._cachelist = info
			window.Repaint();
		break;		
		case "screensaver_state": 
			screensaver_state=info;
			m_x = -1;
			m_y = -1;
		break;	
		case "lyrics_state": 
			lyrics_state=info;
		break;	
		case "bio_dark_theme":
			properties.darklayout = info;
			window.SetProperty("_DISPLAY: Dark layout", properties.darklayout);
			get_colors();
			ui.get_colors();
			img.create_images();
			positionButtons();
			window.repaint();	
            break;	
		case "wallpaperVisibility":   
			if(window.IsVisible){
				properties.showwallpaper = info;			
				g_wallpaperImg = setWallpaperImg(wallpaperpath, fb.IsPlaying ? fb.GetNowPlaying() : null, properties.wallpaperblurred);
				window.SetProperty("_DISPLAY: Show Wallpaper", properties.showwallpaper);
				window.repaint();
			}
            break;	
		case "wallpaperBlur":
			if(window.IsVisible){	
				properties.wallpaperblurred = info;		
				g_wallpaperImg = setWallpaperImg(wallpaperpath, fb.IsPlaying ? fb.GetNowPlaying() : null, properties.wallpaperblurred);				
				window.SetProperty("_DISPLAY: Wallpaper Blurred", properties.wallpaperblurred);
				window.repaint();
			}
            break;			
        case "img_chg":
            img.fresh();
            break;
        case "not_server":
            p.server = false;
            timer.reset(timer.img, timer.imgi);
            break;
        case "script_unload":
            p.server = true;
            if(!properties.dont_communicate) window.NotifyOthers("not_server", 0);
            break;
        case "grab_img":
            img.grab(info);
            break;
        case "grab_txt":
            t.grab(info);
            break;
        case "chk_arr":
            img.chk_arr(info);
            break;
        case "force_update":
            if (p.server) serv.force_update(info);
            break;
        case "multi_tag":
            if (p.server) serv.get_bio(false, info);
            break;
    }
}
function set_update_function(string){
	if(string=="") Update_Required_function=string;
	else if( Update_Required_function.indexOf("on_playback_new_track")!=-1) return;
	else Update_Required_function=string;
}

function on_paint(gr) {
	if(Update_Required_function!="" && window.isVisible) {
		eval(Update_Required_function);
		Update_Required_function = "";
	}
	if(update_size) on_size();
	gr.FillSolidRect(0,0,ww,wh,g_color_bg);
    //BG wallpaper	
	if((typeof(g_wallpaperImg) == "undefined" || !g_wallpaperImg || update_wallpaper) && properties.showwallpaper){
		g_wallpaperImg = setWallpaperImg(wallpaperpath, fb.GetNowPlaying(), properties.wallpaperblurred);
	}	
	if(properties.showwallpaper) {
		gr.DrawImage(g_wallpaperImg, 0, 0, ww, wh, 0, 0, g_wallpaperImg.Width, g_wallpaperImg.Height);
	}
	if(!fb.IsPlaying && script_initialized) {
        var y = Math.floor(wh/2-50);		
        var x = p.text_y + ui.bot_ws;	
		
		gr.gdiDrawText("No sound", ui.font_title, ui.textcol, x, y, ww-x*2, 35, DT_CENTER | DT_TOP | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
		gr.FillSolidRect(Math.floor(ww/2-90),y+ui.font_title_h, 180, 1, g_color_border_left);
		gr.gdiDrawText("Nothing played",  ui.font, ui.textcol, x, y+ui.font_title_h+10, ww-x*2, 20, DT_CENTER | DT_TOP | DT_CALCRECT | DT_END_ELLIPSIS | DT_NOPREFIX);
		
	} else {
		if(light_cover)
			gr.FillSolidRect(0,0,ww,wh,bg_color_light);
		else
			gr.FillSolidRect(0,0,ww,wh,bg_color_dark);
		//ui.draw(gr);
		t.draw(gr);
		img.draw(gr);
	   // but.draw(gr);
	   
		drawAllButtons(gr);
		
		if (img.artistart && t.art_txt && ui.scrollbar_show) art_scrollbar.draw(gr);
		if (!img.artistart && t.alb_txt && ui.scrollbar_show)  alb_scrollbar.draw(gr);	
	}
	gr.FillSolidRect(p.w-1,0,1,p.h,g_color_border_left);
}

function on_playback_new_track(metadb) {
	if(window.IsVisible){
		old_cachekey = nowplaying_cachekey;
		nowplaying_cachekey = process_cachekey(metadb);
		if(old_cachekey!=nowplaying_cachekey) {
			update_cover = true;
			g_wallpaperImg = null;
		} else {
			update_cover = false;
		}
		if (p.server) serv.on_playback_new_track();
		t.on_playback_new_track();
		img.on_playback_new_track();
	} else {
		set_update_function('on_playback_new_track(fb.GetNowPlaying())');
	}
}

function on_playback_dynamic_info_track() {
    if (p.server) serv.on_playback_dynamic_track();
    t.on_playback_dynamic_track();
    img.on_playback_dynamic_track();
}

function on_playback_stop(reason) {
	g_wallpaperImg = null;
    if (reason == 2) return;
	/*if(window.IsVisible){
		on_item_focus_change();
	} else {
		set_update_function('on_item_focus_change()');
	}	*/
}

function on_playback_time() {
	if(window.IsVisible){
		if (!p.server) return;
		if (timer.img === 0) timer.image();
		if (timer.dl === 0) timer.decelerating(serv.lfm_cov && cov_loc() ? true : false);
	}
}

function on_playlists_changed() {
    //men.playlists_changed();
}

function on_playlist_items_added() {
	/*if(window.IsVisible){
		on_item_focus_change();
	} else {
		set_update_function('on_item_focus_change()');
	}	*/
}

function on_playlist_items_removed() {
	/*if(window.IsVisible){
		on_item_focus_change();
	} else {
		set_update_function('on_item_focus_change()');
	}	*/
}

function on_playlist_switch() {
	/*if(window.IsVisible){
		on_item_focus_change();
	} else {
		set_update_function('on_item_focus_change()');
	}	*/
}

function on_mouse_lbtn_dblclk(x, y) {
    but.lbtn_dn(x, y);
    if (!p.dbl_click) return;
    p.click(x, y);
}

function on_mouse_lbtn_down(x, y) {
	cur_btn_down = chooseButton(x, y);		
	if (cur_btn_down) {
		g_down = true;	
		cur_btn_down.changeState(ButtonStates.down);
		 window.Repaint();
	} else {
		but.lbtn_dn(x, y);
		t.scrollbar_type().lbtn_dn(x, y);
		if (p.dbl_click) return;
		p.click(x, y);
	}
}

function on_mouse_lbtn_up(x, y) {
    t.scrollbar_type().lbtn_up(x, y);
    but.lbtn_up(x, y);
	g_down = false;      
	if (cur_btn_down != null && typeof cur_btn_down === 'object') {
		cur_btn_down.onClick();
	}		
}

function on_mouse_leave() {
    but.leave();
    t.scrollbar_type().leave();
	if(p.img_only && properties.ImgOnlyOnMouseHover) p.mode(1);
	g_down = false;    
	if (cur_btn) {
		cur_btn.changeState(ButtonStates.normal);
		 window.Repaint();
		cur_btn=null;        
	}	
}

function on_mouse_mbtn_down() {
    p.mbtn_dn();
}

function on_mouse_move(x, y) {
    if (p.m_x == x && p.m_y == y) return;
	notifyMouseMove(); 		
    p.move(x, y);
    but.move(x, y);
    t.scrollbar_type().move(x, y);
    p.m_x = x;
    p.m_y = y;
	
	var old = cur_btn;
	cur_btn = chooseButton(x, y);
	if (old == cur_btn) {
		if (g_down) return;
	} else if (g_down && cur_btn && cur_btn.state != ButtonStates.down) {
		cur_btn.changeState(ButtonStates.down);
		return;
	} else {
		old && old.changeState(ButtonStates.normal);
		cur_btn && cur_btn.changeState(ButtonStates.hover);
		window.Repaint();
	}	
}

function on_mouse_rbtn_up(x, y) {
    men.rbtn_up(x, y);
    return true;
}

function on_mouse_wheel(step) {
    if (ui.zoom()) but.wheel(step);
    if (p.yy) {
        if (!p.img_only) {
            if (!ui.zoom()) t.scrollbar_type().wheel(step, false);
            else ui.wheel(step);
        }
    } else {
        if (!p.img_only && ui.zoom()) return ui.wheel(step);
        img.wheel(step);
    }
}

function on_script_unload() {
    if (p.server) {
        if(!properties.dont_communicate) window.NotifyOthers("script_unload", 0);
        timer.reset(timer.img, timer.imgi);
    }
    but.on_script_unload();
}

function on_size() {
	if(window.IsVisible || first_on_size){
		t.rp = false;
		p.w = window.Width;
		p.h = window.Height;
		ww = window.Width;
		wh = window.Height;
		if (!p.w || !p.h) return;
		ui.get_font();
		p.on_size();
		p.sizes();
		t.on_size();
		img.on_size();
		t.rp = true;
		img.displayed_other_panel = null;
		update_size = false;
		first_on_size = false;
	} else {
		update_size = true;
	}
	script_initialized = true;		
}

function RGB(r, g, b) {
    return 0xff000000 | r << 16 | g << 8 | b;
}

function RGBA(r, g, b, a) {
    return a << 24 | r << 16 | g << 8 | b;
}

function StringFormat() {
    var a = arguments,
        h_align = 0,
        v_align = 0,
        trimming = 0,
        flags = 0;
    switch (a.length) {
        case 3:
            trimming = a[2];
        case 2:
            v_align = a[1];
        case 1:
            h_align = a[0];
            break;
        default:
            return 0;
    }
    return (h_align << 28 | v_align << 24 | trimming << 20 | flags);
}

function server() {
    String.prototype.format = function() {
        return this.replace(/<p[^>]*>/gi, "").replace(/\n/g, "").replace(/<\/p>/gi, "\r\n\r\n").replace(/<br>/gi, "\r\n").replace(/(<([^>]+)>)/ig, '').replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&quot/g, '"').replace(/^ +/gm, "").replace(/^\s+|\s+$/g, "");
    }
    var album = "",
        alb_artist = "",
        album_id = "",
        artist = "",
        fn_cov = "";
    if (p.server) {
        var dn_arr = ["am_bio", "lfm_bio", "am_rev", "lfm_rev", "dl_art_img", "lfm_cov"];
        for (var i = 0; i < dn_arr.length; i++) {
            this[dn_arr[i]] = parseFloat(utils.ReadINI(p.bio_ini, "AUTO-FETCH", p.def_dn[i].name).trim());
            if (this[dn_arr[i]] !== 1 && this[dn_arr[i]] !== 0) this[dn_arr[i]] = p.def_dn[i].dn;
        }
    }
    var auto_add = parseFloat(utils.ReadINI(p.bio_ini, "MISCELLANEOUS", p.def_tf[7].name));
    if (auto_add !== 1 && auto_add !== 0) auto_add = p.def_tf[7].tf;
    var exp = Math.max(p.d * utils.ReadINI(p.bio_ini, "MISCELLANEOUS", p.def_tf[6].name) / 28, p.d);
    if (!exp || isNaN(exp)) exp = p.d;
    var expired = function(f, exp) {
        if (!p.file(f)) return true;
        return Date.parse(Date()) - Date.parse(p.fs.GetFile(f).DateLastModified) > exp;
    };
    var img_exp = function(img_folder, ex) {
        var Aug_17_2015 = 1439820000000;
        if (!p.folder(img_folder)) return true;
        var f = img_folder + "update.txt";
        if (p.file(f)) {
            if (!auto_add) return false;
            var last_upd = Date.parse(p.fs.GetFile(f).DateLastModified);
            return (Date.parse(Date()) - last_upd > ex) && (last_upd > Aug_17_2015);
        } else if (p.folder(img_folder)) {
            if (art_images(img_folder)) return false;
            return true;
        }
    };
    var art_images = function(folder) {
        var all_files = utils.Glob(folder + "*").toArray();
        for (var j = 0; j < all_files.length; j++)
            if ((/(?:jpe?g|gif|png|bmp)$/i).test(p.fs.GetExtensionName(all_files[j]))) return true;
        return false;
    }
    var auto_corr = parseFloat(utils.ReadINI(p.bio_ini, "MISCELLANEOUS", p.def_tf[5].name));
    if (auto_corr !== 1 && auto_corr !== 0) auto_corr = p.def_tf[5].tf;
    var BuildFullPath = function(path) {
        var tmpFileLoc = "",
            pattern = /(.*?)\\/gm;
        while (result = pattern.exec(path)) {
            tmpFileLoc = tmpFileLoc.concat(result[0]);
            try {
                p.create(tmpFileLoc);
            } catch (e) {}
        }
    }
    var cov_loc = function() {
        var yt_video = p.eval("%path%").replace(/[\.\/\\]/g, "");
        yt_video = yt_video.indexOf("youtubecomwatch") != -1 ? true : false;
        return !p.ir() && !yt_video;
    }
    var check_match = function(n, l) {
        try {
            return 1 - levenshtein(n, l) / (n.length > l.length ? n.length : l.length) > 0.8;
        } catch (e) {
            return false
        }
    } // 0.8 sets fuzzy match level
    var levenshtein = function(a, b) {
        if (a.length === 0) return b.length;
        if (b.length === 0) return a.length;
        var i, j, prev, row, tmp, val;
        if (a.length > b.length) {
            tmp = a;
            a = b;
            b = tmp;
        }
        row = Array(a.length + 1);
        for (i = 0; i <= a.length; i++) row[i] = i;
        for (i = 1; i <= b.length; i++) {
            prev = i;
            for (j = 1; j <= a.length; j++) {
                if (b[i - 1] === a[j - 1]) val = row[j - 1];
                else val = Math.min(row[j - 1] + 1, Math.min(prev + 1, row[j] + 1));
                row[j - 1] = prev;
                prev = val;
            }
            row[a.length] = prev;
        }
        return row[a.length];
    }
    var compilation = function(n) {
        try {
            var kw = "best of|collection|essential|greatest|hits";
            if (n.match(RegExp(kw, "i")) || n.length < 3) return true;
            return false;
        } catch (e) {}
    }

    var match = function(p_a, p_b) {
        try {
            var a = p_a.strip(),
                b = p_b.strip();
            if (a == b) return true;
            if (!partial_match) return false;
            if (a.indexOf(b) != -1) return true;
            if (check_match(a, b)) return true;
            return false;
        } catch (e) {}
    }
    var partial_match = parseFloat(utils.ReadINI(p.bio_ini, "MISCELLANEOUS", p.def_tf[4].name));
    if (partial_match !== 1 && partial_match !== 0) partial_match = p.def_tf[4].tf;
    var res = function(p_n) {
        if(!properties.dont_communicate) window.NotifyOthers("grab_txt", p_n);
        if (p.server) t.grab(p_n);
    }
    var various_artists = utils.ReadINI(p.bio_ini, "MISCELLANEOUS", p.def_tf[12].name);
    if (!various_artists.length) various_artists = p.def_tf[12].tf;
    various_artists = various_artists.toLowerCase();
    this.force_update = function(n) {
        if (n == -1) this.on_playback_new_track(true);
        else {
            this.get_bio(true, n);
            this.get_rev(true);
        }
    }
    this.on_playback_new_track = function(force) {
        this.get_bio(force, -1);
        this.get_rev(force);
    }
    this.on_playback_dynamic_track = function() {
        this.get_bio(false, -1);
    }

    function create_dl_file() {
        var n = fb.ProfilePath + "wsh-data\\foo_lastfm_img.vbs";
        if (!p.file(n)) {
            var dl_im = "If (WScript.Arguments.Count <> 2) Then\r\nWScript.Quit\r\nEnd If\r\n\r\nurl = WScript.Arguments(0)\r\nfile = WScript.Arguments(1)\r\n\r\nSet objFSO = Createobject(\"Scripting.FileSystemObject\")\r\nIf objFSO.Fileexists(file) Then\r\nSet objFSO = Nothing\r\nWScript.Quit\r\nEnd If\r\n\r\nSet objXMLHTTP = CreateObject(\"MSXML2.XMLHTTP\")\r\nobjXMLHTTP.open \"GET\", url, false\r\nobjXMLHTTP.send()\r\n\r\nIf objXMLHTTP.Status = 200 Then\r\nSet objADOStream = CreateObject(\"ADODB.Stream\")\r\nobjADOStream.Open\r\nobjADOStream.Type = 1\r\nobjADOStream.Write objXMLHTTP.ResponseBody\r\nobjADOStream.Position = 0\r\nobjADOStream.SaveToFile file\r\nobjADOStream.Close\r\nSet objADOStream = Nothing\r\nEnd If\r\n\r\nSet objFSO = Nothing\r\nSet objXMLHTTP = Nothing";
            p.save(dl_im, n);
        }
    };
    if (p.server) create_dl_file();

    var json_parse = function(text, prop, test) {
        if (test) {
            test = test.split("|");
            for (var i in test) {
                if (text.indexOf(test[i]) != -1) continue;
                else return false;
            }
        }
        try {
            var data = JSON.parse(text);
        } catch (e) {
            return false;
        }
        if (prop) {
            prop = prop.split(".");
            for (var i in prop) {
                if (data === null || typeof data[prop[i]] === 'undefined') return false;
                data = data[prop[i]];
            }
        }
        return data;
    }
    this.get_lastfm_server = function(lastfm_index) {
		var server_item,server;
		try{
			server_item = lastfm_servers[lastfm_index].split('|'); 
			server = server_item[1];
		} catch(e){}
		if(server === null || typeof server === 'undefined' || server == '') {
			server_item = lastfm_servers[0].split('|'); 
			server = server_item[1];
		}
		return server;
	}
   // var p.lfm_server = utils.ReadINI(p.bio_ini, "MISCELLANEOUS", p.def_tf[9].name);
   // if (!p.lfm_server) p.lfm_server = p.def_tf[9].tf;
	p.lfm_default_server = this.get_lastfm_server(0);	
    this.get_bio = function(force, n) {
        var fn_bio, new_artist = n == -1 || isNaN(n) || n != -1 && p.multi_arr.length < n + 1 ? name.artist() : p.multi_arr[n].name,
            pth_bio;
        if (new_artist == artist && !force || new_artist == "") return;
        artist = new_artist;
        if (this.lfm_bio) {
            pth_bio = p.sanitise_path(n == -1 || isNaN(n) || n != -1 && p.multi_arr.length < n + 1 ? p.dl_lfm_bio_pth : p.dl_lfm_bio_mul.replace(RegExp(p.def_tf[1].name, "gi"), p.multi_arr[n].meta));
            fn_bio = pth_bio + artist.sanitise() + ".txt";
            if (expired(fn_bio, exp) || force) {
                var dl_lfm_bio = new dl_lastfm_bio(function() {
                    dl_lfm_bio.on_state_change();
                });
                dl_lfm_bio.Search(artist, pth_bio, fn_bio, n, properties.lastfm_server);
            }
        }
        if (this.dl_art_img) dl_art.run(artist, force, n);
        else timer.decelerating(this.lfm_cov && cov_loc() ? true : false);
        if (n != -1 && !force) return;
        if (this.am_bio && !this.am_rev) {
            album = name.album();
            alb_artist = name.alb_artist();
            if (!album || !alb_artist) return;
            pth_bio = p.sanitise_path(p.dl_am_bio_pth);
            fn_bio = pth_bio + artist.sanitise() + ".txt";
            if (expired(fn_bio, exp) || force) {
                var dl_am_bio = new dl_allmusic_bio(function() {
                    dl_am_bio.on_state_change();
                });
                dl_am_bio.Search(0, "https://www.allmusic.com/search/albums/" + encodeURIComponent(album + (!compilation(album) ? "" : " " + alb_artist)), album, alb_artist, "bio", "", "", pth_bio, fn_bio);
            }
        }
    }

    this.get_rev = function(force) {
        var new_album_id = p.eval("%album artist%%album%");
        if (new_album_id == album_id && !force) return;
        album_id = new_album_id;
        album = name.album();
        alb_artist = name.alb_artist();
        if (!album || !alb_artist) return;
        var pth_rev = "",
            fn_rev = ""
        if (!force) this.get_cover();
        if (this.am_rev) {
            pth_rev = p.sanitise_path(p.dl_am_rev_pth);
            fn_rev = pth_rev + alb_artist.sanitise() + " - " + album.sanitise() + ".txt";
            var pth_bio = p.sanitise_path(p.dl_am_bio_pth),
                fn_bio = pth_bio + name.artist().sanitise() + ".txt",
                art_upd = expired(fn_bio, exp),
                dn_type = "",
                rev_upd = !p.file(fn_rev);
            if (rev_upd || art_upd || force) {
                if ((this.am_rev && rev_upd) && (this.am_bio && art_upd) || force) dn_type = "both";
                else if (this.am_rev && rev_upd || force) dn_type = "review";
                else if (this.am_bio && art_upd || force) dn_type = "bio";
                var dl_am_bio = new dl_allmusic_bio(function() {
                    dl_am_bio.on_state_change();
                });
                dl_am_bio.Search(0, "https://www.allmusic.com/search/albums/" + encodeURIComponent(album + (!compilation(album) ? "" : " " + alb_artist)), album, alb_artist, dn_type, pth_rev, fn_rev, pth_bio, fn_bio);
            }
        }
        if (!this.lfm_rev) return;
        pth_rev = p.sanitise_path(p.dl_lfm_rev_pth);
        fn_rev = pth_rev + alb_artist.sanitise() + " - " + album.sanitise() + ".txt";
        if (!expired(fn_rev, exp) && !force) return;
        var lfm_alb = new lastfm_alb(function() {
            lfm_alb.on_state_change();
        });
        lfm_alb.Search(alb_artist, album, true, pth_rev, fn_rev, properties.lastfm_server);	
    }

    this.get_cover = function() {
        if (!this.lfm_cov || !cov_loc()) return;
        this.cov_done = false;
        fn_cov = p.sanitise_path(p.dl_lfm_cov_pth) + p.eval(p.dl_lfm_cov_fn).sanitise();
        var exts = [".png", ".jpg", ".gif"];
        for (var k = 0; k < exts.length; k++)
            if (p.fs.fileExists(fn_cov + exts[k])) return;
        var handle = fb.IsPlaying ? fb.GetNowPlaying() : fb.GetFocusItem();
		
        if (handle) {
			//utils.GetAlbumArtAsync(window.ID, handle, 0, false);
			cache_image = g_image_cache.hit(handle);
			if (!(typeof(cache_image) == "undefined" || cache_image == null)){
				final_image = cache_image.Clone(0, 0, cache_image.Width, cache_image.Height);
				if (p.server) serv.on_get_alb_art_done(final_image);
				img.get_album_art_done(final_image, cover_path);			
			}				
		}
    }
    this.on_get_alb_art_done = function(image) {
        if (!album || this.cov_done || !this.lfm_cov || !cov_loc()) return;
        if (!image) {
            var lfm_cov = new lastfm_alb(function() {
                lfm_cov.on_state_change();
            });
            lfm_cov.Search(alb_artist, album, false, "", fn_cov);
        }
    }

    function dl_allmusic_bio(state_callback) {
        var alb_artist, album, artistLink = "",
            dn_type = "",
            fn_bio, fn_rev, pth_bio, pth_rev, sw = 0;
        this.xmlhttp = null;
        this.func = null;
        this.ready_callback = state_callback;
        this.ie_timer = false;

        this.on_state_change = function() {
            if (this.xmlhttp != null && this.func != null)
                if (this.xmlhttp.readyState == 4) {
                    window.ClearTimeout(this.ie_timer);
                    this.ie_timer = false;
                    if (this.xmlhttp.status == 200) this.func();
                    else {
                        p.trace("allmusic album review / biography: " + album + " / " + alb_artist + ": not found" + " Status error: " + this.xmlhttp.status, true);
                    }
                }
        }

        this.Search = function(p_sw, URL, p_album, p_alb_artist, p_dn_type, p_pth_rev, p_fn_rev, p_pth_bio, p_fn_bio) {
            sw = p_sw;
            if (!sw) {
                dn_type = p_dn_type;
                pth_rev = p_pth_rev;
                fn_rev = p_fn_rev;
                pth_bio = p_pth_bio;
                fn_bio = p_fn_bio;
                album = p_album;
                alb_artist = p_alb_artist;
                BuildFullPath(pth_bio);
            }
            this.func = null;
            this.xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            this.func = this.Analyse;
            this.xmlhttp.open("GET", URL);
            this.xmlhttp.onreadystatechange = this.ready_callback;
            this.xmlhttp.send();
            if (!this.ie_timer) {
                var a = this.xmlhttp;
                this.ie_timer = window.SetTimeout(function() {
                    a.abort();
                    window.ClearTimeout(this.ie_timer);
                    this.ie_timer = false;
                }, 30000);
            }
        }

        this.Analyse = function() {
            var WshShell = new ActiveXObject("WScript.Shell"),
                doc = new ActiveXObject("htmlfile");
            doc.open();
            try {
                switch (sw) {
                    case 0:
                        var div = doc.createElement("div");
                        div.innerHTML = this.xmlhttp.responsetext;
                        var list = div.getElementsByTagName("h4"),
                            links = [],
                            va = alb_artist.toLowerCase() == various_artists;
                        for (var i = 0; i < list.length; i++) {
                            if (match(album, list[i].nextSibling.innerText) && (!va ? list[i].nextSibling.nextSibling.innerText.strip() == alb_artist.strip() : true)) {
                                if (!va) artistLink = list[i].nextSibling.nextSibling.firstChild.getAttribute("href") + "\\biography";
                                doc.close();
                                if (dn_type == "both" || dn_type == "review") {
                                    sw = 1;
                                    return this.Search(sw, list[i].nextSibling.firstChild.getAttribute("href"));
                                } else if (dn_type == "bio" && !va) {
                                    sw = 2;
                                    return this.Search(sw, artistLink)
                                }
                            }
                        }
                        p.trace("allmusic album review / biography: " + album + " / " + alb_artist + ": not found", true);
                        break;
                    case 1:
                        var div = doc.createElement("div");
                        div.innerHTML = this.xmlhttp.responsetext;
                        var list = div.getElementsByTagName("p")(1).parentNode;
                        var review = list.innerHTML.format();
                        var reviewAuthor = list.previousSibling.innerText;
                        review = (review + "\r\n\r\n" + reviewAuthor);
                        var rating = "x";
                        var li = div.getElementsByTagName("li");
                        for (var i = 0; i < li.length; i++) {
                            if (li[i].id == "microdata-rating") {
								rating = li[i](0).childNodes(2).innerText / 2;
								//p.review_rating = rating*2;
								review = rating+"###" + review;
							}
						}
						
                        if (review.length > 22) {
                            BuildFullPath(pth_rev);
                            p.save(review, fn_rev);
                            res(-1);
                        } else p.trace("allmusic album review: " + album + " / " + alb_artist + ": not found", true);
                        if (dn_type == "both") {
                            sw = 2;
                            return this.Search(sw, artistLink);
                        }
                        break;
                    case 2:
                        var div = doc.createElement("div");
                        div.innerHTML = this.xmlhttp.responsetext;
                        var list = div.getElementsByTagName("p")(2).parentNode;
                        var biography = list.innerHTML.format();
                        var biographyAuthor = list.previousSibling.innerText;
                        biography = (biography + "\r\n\r\n" + biographyAuthor);
                        if (biography.length > 19) {
                            BuildFullPath(pth_bio);
                            p.save(biography, fn_bio);
                            res(-1);
                        } else p.trace("allmusic biography: " + alb_artist + ": not found", true);
                        break;
                }
            } catch (e) {
                p.trace("allmusic album review / biography: " + album + " / " + alb_artist + ": not found", true);
            }
        }
    }

    function dl_lastfm_bio(state_callback) {
        var artist, fn_bio, n, pth_bio;
        this.xmlhttp = null;
        this.func = null;
        this.ready_callback = state_callback;
        this.ie_timer = false;

        this.on_state_change = function() {
            if (this.xmlhttp != null && this.func != null)
                if (this.xmlhttp.readyState == 4) {
                    window.ClearTimeout(this.ie_timer);
                    this.ie_timer = false;
                    if (this.xmlhttp.status == 200) this.func();
                    else {
						if(p.lfm_bioserver_index!=0){
							p.trace("last.fm biography: " + artist + ": not found in desired language, fallback to english" + " Status error: " + this.xmlhttp.status, true);
							var dl_lfm_bio = new dl_lastfm_bio(function() {
								dl_lfm_bio.on_state_change();
							});					
							dl_lfm_bio.Search(artist, pth_bio, fn_bio, n, 0);
						} else p.trace("last.fm biography: " + artist + ": not found in english" + " Status error: " + this.xmlhttp.status, true);
                    }
                }
        }

        this.Search = function(p_artist, p_pth_bio, p_fn_bio, p_n, lastfm_server_index) {
			var lastfm_server_index = typeof lastfm_server_index !== 'undefined' ? lastfm_server_index : 0;
			var server = serv.get_lastfm_server(lastfm_server_index);
			p.lfm_bioserver_index = lastfm_server_index;			
            artist = p_artist;
            pth_bio = p_pth_bio;
            n = p_n;
            fn_bio = p_fn_bio;
            this.func = null;
            this.xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            var URL = "https://" + server + "/music/" + encodeURIComponent(artist) + "/+wiki";
            this.func = this.Analyse;
            this.xmlhttp.open("GET", URL);
            this.xmlhttp.onreadystatechange = this.ready_callback;
            this.xmlhttp.send();
            if (!this.ie_timer) {
                var a = this.xmlhttp;
                this.ie_timer = window.SetTimeout(function() {
                    a.abort();
                    window.ClearTimeout(this.ie_timer);
                    this.ie_timer = false;
                }, 30000);
            }
        }

        this.Analyse = function() {
            var WshShell = new ActiveXObject("WScript.Shell"),
                doc = new ActiveXObject("htmlfile");
            doc.open();
            var div = doc.createElement("div");
            div.innerHTML = this.xmlhttp.responsetext;
            var con = "",
                list = div.getElementsByTagName("div"),
                links = [];
            for (var i = 0; i < list.length; i++)
                if (list[i].className == "wiki-content") {
                    con = div.getElementsByTagName("div").item(i).innerHTML.format();
                    break;
                }
            doc.close();
            if (con.length < 20) {
				if(p.lfm_bioserver_index!=0){
					p.trace("last.fm biography: " + artist + ": not found in desired language, fallback to english" + " Status error: " + this.xmlhttp.status, true);
					var dl_lfm_bio = new dl_lastfm_bio(function() {
						dl_lfm_bio.on_state_change();
					});					
					dl_lfm_bio.Search(artist, pth_bio, fn_bio, n, 0);
				} else p.trace("last.fm biography: " + artist + ": not found in english", true);
                return;
            }
            BuildFullPath(pth_bio);
            p.save(con, fn_bio);
            res(n);
        }
    }

    function dl_art_images() {
        this.run = function(dl_ar, force, n) {
            if (!p.file(fb.ProfilePath + "wsh-data\\foo_lastfm_img.vbs")) return;
            var img_folder = p.sanitise_path(n == -1 || isNaN(n) || n != -1 && p.multi_arr.length < n + 1 ? p.dl_art_pth : p.dl_art_mul.replace(RegExp(p.def_tf[1].name, "gi"), p.multi_arr[n].meta));
            if (!img_exp(img_folder, !force ? exp : 0)) return;
            var lfm_art = new lfm_art_img(function() {
                lfm_art.on_state_change();
            });
            lfm_art.Search(dl_ar, img_folder);
        }
    }
    if (this.dl_art_img) var dl_art = new dl_art_images();

    function lfm_art_img(state_callback) {
        var dl_ar, img_folder;
        this.xmlhttp = null;
        this.func = null;
        this.ready_callback = state_callback;
        this.ie_timer = false;

        this.on_state_change = function() {
            if (this.xmlhttp != null && this.func != null)
                if (this.xmlhttp.readyState == 4) {
                    window.ClearTimeout(this.ie_timer);
                    this.ie_timer = false;
                    if (this.xmlhttp.status == 200) this.func();
                    else {
                        p.trace("last.fm artist images: " + dl_ar + ": none found" + " Status error: " + this.xmlhttp.status, true);
                    }
                }
        }

        this.Search = function(p_dl_ar, p_img_folder) {
            dl_ar = p_dl_ar;
            img_folder = p_img_folder;
            this.func = null;
            this.xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            var URL = "https://" + p.lfm_default_server + "/music/" + encodeURIComponent(dl_ar) + "/+images";
            this.func = this.Analyse;
            this.xmlhttp.open("GET", URL);
            this.xmlhttp.onreadystatechange = this.ready_callback;
            this.xmlhttp.send();
            if (!this.ie_timer) {
                var a = this.xmlhttp;
                this.ie_timer = window.SetTimeout(function() {
                    a.abort();
                    window.ClearTimeout(this.ie_timer);
                    this.ie_timer = false;
                }, 30000);
            }
        }

        this.Analyse = function() {
            var WshShell = new ActiveXObject("WScript.Shell"),
                artist = dl_ar.sanitise(),
                doc = new ActiveXObject("htmlfile");
            doc.open();
            var div = doc.createElement("div");
            div.innerHTML = this.xmlhttp.responsetext;
            var list = div.getElementsByTagName("img"),
                links = [];
            if (!list) return p.trace("last.fm artist images: " + dl_ar + ": none found", true);
            for (var i = 0; i < list.length; i++)
                if (list[i].className == "image-list-image") links.push(list[i].src.replace("avatar170s/", ""));
            if (links.length) {
                BuildFullPath(img_folder);
                if (p.folder(img_folder)) {
                    p.save("", img_folder + "update.txt");
                    timer.decelerating(serv.lfm_cov && cov_loc() ? true : false);
                    for (var j = 0; j < Math.min(links.length, 5); j++)
                        WshShell.Run("cscript //nologo \"" + fb.ProfilePath + "wsh-data\\foo_lastfm_img.vbs\" \"" + links[j] + "\" \"" + img_folder + artist + "_" + links[j].substring(links[j].lastIndexOf("/") + 1) + ".jpg" + "\"", false);
                }
            }
            doc.close();
        }
    }

    function lastfm_alb(state_callback) {
        var alb_artist, album, fn, path, rev;
        this.xmlhttp = null;
        this.func = null;
        this.ready_callback = state_callback;
        this.ie_timer = false;

        this.on_state_change = function() {
            if (this.xmlhttp != null && this.func != null)
                if (this.xmlhttp.readyState == 4) {
                    window.ClearTimeout(this.ie_timer);
                    this.ie_timer = false;
                    if (this.xmlhttp.status == 200) this.func();
                    else {
                        p.trace("last.fm album cover: " + album + " / " + alb_artist + ": not found" + " Status error: " + this.xmlhttp.status, true);
                    }
                }
        }

        this.Search = function(p_alb_artist, p_album, p_rev, p_path, p_fn, lastfm_server_index) {
			var lastfm_server_index = typeof lastfm_server_index !== 'undefined' ? lastfm_server_index : 0;
			var server = serv.get_lastfm_server(lastfm_server_index);
			p.lfm_albserver_index = lastfm_server_index;						
		
            alb_artist = p_alb_artist;
            album = p_album;
            rev = p_rev;
            path = p_path;
            fn = p_fn;
            if (!rev) serv.cov_done = true;
			
            var URL = "https://" + server + "/music/" + encodeURIComponent(alb_artist) + "/" + encodeURIComponent(album) + "/+wiki";	

            //var URL = "http://ws.audioscrobbler.com/2.0/?format=json" + p.lfm;
            //URL += "&method=album.getInfo&artist=" + encodeURIComponent(alb_artist) + "&album=" + encodeURIComponent(album) + "&autocorrect=" + auto_corr;
            this.func = null;
            this.xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            this.func = this.Analyse_new;
            this.xmlhttp.open("GET", URL);

            this.xmlhttp.onreadystatechange = this.ready_callback;
            this.xmlhttp.setRequestHeader('User-Agent', "foobar2000_script");
            this.xmlhttp.send();
            if (!this.ie_timer) {
                var a = this.xmlhttp;
                this.ie_timer = window.SetTimeout(function() {
                    a.abort();
                    window.ClearTimeout(this.ie_timer);
                    this.ie_timer = false;
                }, 30000);
            }
        }
        this.Analyse_new = function() {
            var WshShell = new ActiveXObject("WScript.Shell"),
                doc = new ActiveXObject("htmlfile");
            doc.open();
            var div = doc.createElement("div");
            div.innerHTML = this.xmlhttp.responsetext;
            var con = "",
                list = div.getElementsByTagName("div"),
                links = [];
            for (var i = 0; i < list.length; i++)
                if (list[i].className == "wiki-content") {
                    con = div.getElementsByTagName("div").item(i).innerHTML.format();
                    break;
                }
            doc.close();
            if (con.length < 20) {
				if(p.lfm_albserver_index!=0){
					p.trace("last.fm album review: " + album + " / " + alb_artist + ": not found in desired language, fallback to english" + " Status error: " + this.xmlhttp.status, true);
					var lfm_alb = new lastfm_alb(function() {
						lfm_alb.on_state_change();
					});	
					pth_rev = p.sanitise_path(p.dl_lfm_rev_pth);
					fn_rev = pth_rev + alb_artist.sanitise() + " - " + album.sanitise() + ".txt";					
					lfm_alb.Search(alb_artist, album, true, pth_rev, fn_rev,0);					
				} else p.trace("last.fm album review: " + album + " / " + alb_artist + ": not found in english", true);
                return;
            }
            BuildFullPath(path);
            p.save(con, fn);
            res(-1);
        }
        this.Analyse = function() {
            if (rev) {
                var data = json_parse(this.xmlhttp.responsetext, "album.wiki.content", "name\":");
                if (data.length) {
                    data = data.replace(/<[^>]+>/ig, "");
                    var e = data.indexOf(" Read more on Last.fm");
                    if (e != -1) data = data.slice(0, e);
                    if (data.length < 20) return p.trace("last.fm album review: " + album + " / " + alb_artist + ": not found", true);
                    BuildFullPath(path);
                    p.save(data, fn);
                    res(-1);
                } else p.trace("last.fm album review: " + album + " / " + alb_artist + ": not found", true);
            } else {
                if (!p.file(fb.ProfilePath + "wsh-data\\foo_lastfm_img.vbs")) return;
                var data = json_parse(this.xmlhttp.responsetext, "album.image", "name\":");
                if (!data || data.length < 5) return p.trace("last.fm album cover: " + album + " / " + alb_artist + ": not found", true);
                var pth = data[4]["#text"];
                if (!pth) return p.trace("last.fm album cover: " + album + " / " + alb_artist + ": not found", true);
                timer.decelerating(true);
                var WshShell = new ActiveXObject("WScript.Shell");
                WshShell.Run("cscript //nologo \"" + fb.ProfilePath + "wsh-data\\foo_lastfm_img.vbs\" \"" + pth + "\" \"" + fn + pth.slice(-4) + "\"", 0, false);
            }
        }
    }
}
// ================================================== // Buttons
var cur_btn = null;
var g_down = false;
function SimpleButton(x, y, w, h, text, fonClick, fonDbleClick, N_img, H_img, state,opacity) {
    this.state = state ? state : ButtonStates.normal;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.text = text;
    this.fonClick = fonClick;
    this.fonDbleClick = fonDbleClick;
    this.N_img = N_img;
    this.H_img = H_img;   
	this.opacity = opacity;
	this.first_draw=true;	
	
	if (typeof opacity == "undefined") this.opacity = 255;
	else this.opacity = opacity;
	
    this.containXY = function (x, y) {
		if(this.x<0) return (window.Width+this.x-this.w <= x) && (x <= window.Width + this.x + this.w) && (this.y <= y) && (y <= this.y + this.h);
        else return (this.x <= x) && (x <= this.x + this.w) && (this.y <= y) && (y <= this.y + this.h);
    }
    this.changeState = function (state) {
        var old = this.state;
        this.state = state;
        return old;
    }    
    this.draw = function (gr) {
				
		if(this.first_draw && this.text!="") {
			this.w = gr.CalcTextWidth(this.text, g_font.normal)+this.N_img.Width;
		}
		this.first_draw=false;		
		
		if(this.x<0) var real_x_position = window.Width+this.x-this.w;
		else var real_x_position = this.x;		
		
        if (this.state == ButtonStates.hide || this.hide) return;
        b_img=this.N_img;        
        switch (this.state)
        {
        case ButtonStates.normal:
            b_img=this.N_img;
            break;
        case ButtonStates.hover:
            b_img=this.H_img;
            break;
        case ButtonStates.down:
            break;
            
        case ButtonStates.hide:
            return;
        }
        switch (this.state)
        {    
        case ButtonStates.hover: 
        default: 
			gr.DrawImage(b_img, real_x_position, this.y, b_img.Width, b_img.Height, 0, 0, b_img.Width, b_img.Height,0,this.opacity);
            break;            
        }  

		if(this.text!="") {
			gr.GdiDrawText(this.text, g_font.normal, g_color_normal_txt, real_x_position+b_img.Width, this.y, this.w, this.h, DT_LEFT| DT_VCENTER | DT_CALCRECT | DT_NOPREFIX);			
		}		

    }

    this.onClick = function () {        
        this.fonClick && this.fonClick();
    }
    this.onDbleClick = function () {
        if(this.fonDbleClick) {this.fonDbleClick && this.fonDbleClick();}
    }    
}
function drawAllButtons(gr) {
    for (var i in buttons) {
        buttons[i].draw(gr);
    }
}
function chooseButton(x, y) {
    for (var i in buttons) {
        if (buttons[i].containXY(x, y) && buttons[i].state != ButtonStates.hide) return buttons[i];
    }
    return null;
}

var lyrics_off_icon = gdi.Image(theme_img_path + "\\icons\\nowplaying_off.png");   
var lyrics_off_hover_icon = gdi.Image(theme_img_path + "\\icons\\nowplaying_off_hover.png");  
var lyrics_on_icon = gdi.Image(theme_img_path + "\\icons\\nowplaying_on.png"); 
var lyrics_on_hover_icon = gdi.Image(theme_img_path + "\\icons\\nowplaying_on_hover.png"); 	
var lyrics_off_icon_white = gdi.Image(theme_img_path + "\\icons\\white\\nowplaying_off.png");   
var lyrics_off_hover_icon_white = gdi.Image(theme_img_path + "\\icons\\white\\nowplaying_off_hover.png");  
var lyrics_on_icon_white = gdi.Image(theme_img_path + "\\icons\\white\\nowplaying_on.png"); 
var lyrics_on_hover_icon_white = gdi.Image(theme_img_path + "\\icons\\white\\nowplaying_on_hover.png"); 	
var lyrics_off_icon_white = gdi.Image(theme_img_path + "\\icons\\white\\nowplaying_off.png");  

buttons = { 
    lyricsReduce: new SimpleButton(-20, 8, 15, lyrics_off_icon.Height, "Show Lyrics", function () {
		toggleLyricsState(lyrics_state-1);
    },false,lyrics_off_icon,lyrics_off_hover_icon,ButtonStates.normal,255),	
    lyricsIncrease: new SimpleButton(-45, 8, 15, lyrics_off_icon.Height, "Show Lyrics", function () {
		toggleLyricsState(lyrics_state+1);
    },false,lyrics_on_icon,lyrics_on_hover_icon,ButtonStates.normal,255)	
}
function positionButtons(){
	buttons.lyricsReduce.first_draw = true;
	if(properties.darklayout || properties.stick2darklayout){
		buttons.lyricsReduce.N_img = lyrics_on_icon_white;
		buttons.lyricsReduce.H_img = lyrics_on_hover_icon_white;
		buttons.lyricsReduce.text = "";
		
		buttons.lyricsIncrease.N_img = lyrics_off_icon_white;
		buttons.lyricsIncrease.H_img = lyrics_off_hover_icon_white;
		buttons.lyricsIncrease.text = "";			
	} else {
		buttons.lyricsReduce.N_img = lyrics_on_icon;
		buttons.lyricsReduce.H_img = lyrics_on_hover_icon;
		buttons.lyricsReduce.text = "";
		
		buttons.lyricsIncrease.N_img = lyrics_off_icon;
		buttons.lyricsIncrease.H_img = lyrics_off_hover_icon;
		buttons.lyricsIncrease.text = "";				
	}
	if(lyrics_state==number_of_lyrics_state-1) {	
		buttons.lyricsIncrease.hide = true;	
		buttons.lyricsReduce.hide = false;			
	} else if(lyrics_state==0) {
		buttons.lyricsIncrease.text = "Lyrics";
		buttons.lyricsIncrease.first_draw=true;
		buttons.lyricsIncrease.x = -20;		
		buttons.lyricsReduce.hide = true;
		buttons.lyricsIncrease.hide = false;		
	} else {
		buttons.lyricsReduce.hide = false;		
		buttons.lyricsIncrease.hide = false;	
		buttons.lyricsIncrease.w = 15;
		buttons.lyricsIncrease.x = -45;		
	}
}
function toggleLyricsState(new_lyrics_state){
	new_lyrics_state = typeof new_lyrics_state !== 'undefined' ? new_lyrics_state : lyrics_state-1;
	if(new_lyrics_state<0) new_lyrics_state=0;
	else if(new_lyrics_state>=number_of_lyrics_state) new_lyrics_state=number_of_lyrics_state-1;
	set_lyrics_state(new_lyrics_state);
	positionButtons();
	window.Repaint();
}
// ===================================================== // Wallpaper

var wallpaperpath = theme_img_path + "\\nothing_played_full.png";
var wpp_img_info = {orient: 0, cut: 0, cut_offset: 0, ratio: 0, x: 0, y: 0, w: 0, h: 0};
var update_wallpaper = false;

function setWallpaperImg(defaultpath, metadb, blurred) {   
	update_wallpaper = false;
    if(metadb && properties.wallpapermode == 0 && properties.showwallpaper) {
		var tmp_img = get_albumArt(metadb);
    } else {
        if(defaultpath) {
            tmp_img = gdi.Image(defaultpath);
        } else {
            tmp_img = null;
        };
    };
    if(!tmp_img) tmp_img = gdi.Image(defaultpath);

    if(!blurred) g_wallpaperImg = null;
	
    var img = FormatWallpaper(tmp_img, ww, wh, 0, properties.wallpaperdisplay, 0, "", false, blurred);
	
	var colorScheme_array = tmp_img.GetColourScheme(1).toArray();
	var HSL_colour = RGB2HSL(colorScheme_array[0]);
	if(HSL_colour.L>80){
		light_cover = true;
	} else light_cover = false;
	
    return img;
};
image_cache = function () {
    this._cachelist = {};
    this.hit = function (metadb) {	
		var img;
		cachekey = process_cachekey(metadb);
		try{img = this._cachelist[cachekey];cover_path = cover_img_cache+"\\"+cachekey+"."+globalProperties.ImageCacheExt;}catch(e){}
		if ((typeof(img) == "undefined" || img == null) && globalProperties.enableDiskCache ) {			
			cache_exist = check_cache(metadb, 0, cachekey);	
			// load img from cache				
			if(cache_exist) {	
				img = load_image_from_cache_direct(metadb, cache_exist);
				cover_path = cover_img_cache+"\\"+cache_exist+"."+globalProperties.ImageCacheExt;
			} else utils.GetAlbumArtAsync(window.ID, metadb, 0);
		}
		return img;
    };	
    this.refresh = function (metadb, cachekey) {
		cachekey = typeof cachekey !== 'undefined' ? cachekey : process_cachekey(metadb);
		if(globalProperties.enableDiskCache) delete_file_cache(metadb,0, cachekey);
		this._cachelist[cachekey] = null;
		nowplaying_cachekey = "";
		if(!properties.dont_communicate) window.NotifyOthers("RefreshImageCover",metadb);
		window.Repaint();
	}
};
function FormatCover(image, w, h, rawBitmap) {
	if(!image || w<=0 || h<=0) return image;
	if(rawBitmap) {
		return image.Resize(w, h, properties.ResizeQLY).CreateRawBitmap();
	} else {
		try {
			return image.Resize(w, h, properties.ResizeQLY);
		} catch(e){MsgBox(properties.panelName+" resize error w:"+w+" h:"+h); return null;}
	}
};

window.SetProperty(" Scroll: Smooth Scroll Level 0-1", null);
window.SetProperty(" Scrollbar Width", null);
window.SetProperty("_CUSTOM COLOURS: EMPTY = DEFAULT", null);
window.SetProperty("_CUSTOM COLOURS: USE", null);

function on_init(){
	get_colors();
	get_font();
	positionButtons();
	ui = new userinterface();	
	p = new panel_operations();
	name = new names();
	alb_scrollbar = new scrollbar();
	art_scrollbar = new scrollbar();
	but = new button_manager();
	men = new menu_object();
	t = new text_manager();
	img = new image_manager();
	img.create_images();
	timer = new timers();
	timer.image();
	g_image_cache = new image_cache;	
	window.DlgCode = 0x004;
	if (p.server) serv = new server();

}
on_init();