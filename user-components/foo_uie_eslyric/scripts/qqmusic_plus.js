/**
 * QQ Music Lyrics Source for ESLyric
 * Original Author: btx258
 * Modified by: Robotxm
 * Version: 0.1.1
 * License: GPL 3.0
 * Description: Make foobar2000 with ESLyric able to show
 *              lyrics (and translation if it exists)
 *              from QQ Music server.
 * Github: https://github.com/Robotxm/ESLyric-LyricsSource
**/

/** 
 * Define whether to show dual-line desktop lyrics or not when translated lyrics doesn't exsit.
 * NOTICE: No matter what value is set, you must set ESLyric to show dual-line lyric.
 * true: Dual line
 * false: Single line
 * 当没有翻译歌词存在时，是否以双行样式显示桌面歌词。
 * 注意：无论此处设置为何值，都必须在 ESLyric 中设置桌面歌词的“显示模式”为“双行显示”。
 * true: 以双行显示
 * false: 以单行显示 
**/
var dual_line = false;

var QM_CFG = {
    DEBUG: false,
    E_SRV: "http://y.qq.com/portal/player.html",
    S_SRV: "http://c.y.qq.com/soso/fcgi-bin/client_search_cp",
    L_SRV: "http://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg",
    G_PRM: "&format=json&inCharset=utf8&outCharset=utf-8",
    P_MAX: 3,
    P_NUM: 30,
    L_LOW: 5,
    L_MAX: 10,
    RETRY: 1,
};

var qm_http = {
    handle: null,
    type: null
};

var qm_abort = {
    handle: null,
    isvalid: true
};

function get_my_name() {
    return "QQMusic plus";
}

function get_version() {
    return "0.1.1";
}

function get_author() {
    return "Robotxm & btx258";
}

function start_search(info, callback) {
    var json_text = null, new_lyric = null;
    var song = null, lyric = null, i = null, j = null;
    var page = null, count = null;
    qm_abort.handle = callback;
    qm_abort.isvalid = true;
    for (var page = 0, count = 0; page < QM_CFG.P_MAX && count < QM_CFG.L_LOW; page++) {
        if (qm_is_aborting()) {
            break;
        }
        json_text = qm_download(QM_CFG.S_SRV,
            "w=" + qm_normalize(info.Title) + "+" + qm_normalize(info.Artist)
            + "&p=" + (page + 1)
            + "&n=" + QM_CFG.P_NUM
            + "&new_json=1&cr=1"
            + QM_CFG.G_PRM
        );
        if (json_text) {
            try {
                song = qm_json(json_text);
            } catch (e) {
                song = null;
            }
        }
        if (song && !song.code) {
            if (song.subcode || !song.data.song.totalnum) {
                break;
            }
            new_lyric = fb.CreateLyric();
            for (i = 0; i < song.data.song.list.length && count < QM_CFG.L_MAX; i++) {
                if (qm_is_aborting()) {
                    break;
                }
                new_lyric.Title = song.data.song.list[i].title;
                new_lyric.Album = song.data.song.list[i].album.title;
                for (j = 0, new_lyric.Artist = ""; j < song.data.song.list[i].singer.length; j++) {
                    new_lyric.Artist += (j === 0 ? "" : ",") + song.data.song.list[i].singer[j].title;
                }
                // qm_trace("INFO-start_search-new_lyric Title: " + new_lyric.Title + ", Album: " + new_lyric.Album + ", Artist: " + new_lyric.Artist);
                new_lyric.Source = get_my_name();
                json_text = qm_download(QM_CFG.L_SRV,
                    "songmid=" + song.data.song.list[i].mid
                    + "&g_tk=5381"
                    + QM_CFG.G_PRM
                );
                if (json_text) {
                    try {
                        lyric = qm_json(json_text.replace(/(^\w+\()|(\)$)/g, ""));
                    } catch (e) {
                        lyric = null;
                    }
                }
                if (lyric && !lyric.code) {
                    if (lyric.lyric.length > 128) {
                        if (lyric.trans.length > 128) {
                            new_lyric.Source = get_my_name() + " (含翻译)";
                            new_lyric.LyricText = qm_generate_translation(Base64.decode(lyric.lyric), Base64.decode(lyric.trans));
                            callback.AddLyric(new_lyric);
                        } else {
                            if (!dual_line) {
                                new_lyric.LyricText = qm_generate_single_line(Base64.decode(lyric.lyric));
                                callback.AddLyric(new_lyric);
                            } else {
                                new_lyric.LyricText = Base64.decode(lyric.lyric);
                                callback.AddLyric(new_lyric);
                            }
                        }
                        count++;
                    }
                }
                if (count % 2 === 0) {
                    callback.Refresh();
                }
            }
            new_lyric.Dispose();
        }
    }
}

function qm_download(url, param) {
    // qm_trace("INFO-qm_download-url: " + url + ", param: " + param);
    // retry several times at most
    var i = null, xml_text = null;
    for (i = 0; i < QM_CFG.RETRY; i++) {
        if (!qm_http.handle) {
            try {
                qm_http.handle = utils.CreateHttpClient();
                qm_http.type = "u_c";
            } catch (e) {
                // qm_trace("ERROR-qm_download-CreateHttpClient message: " + e.message);
                try {
                    qm_http.handle = utils.CreateHttpRequest("GET");
                    qm_http.type = "u_r";
                } catch (err) {
                    // qm_trace("ERROR-qm_download-CreateHttpRequest message: " + err.message);
                    try {
                        qm_http.handle = new ActiveXObject("Microsoft.XMLHTTP");
                        qm_http.type = "ie";
                    } catch (error) {
                        // qm_trace("ERROR-qm_download-ActiveXObject message: " + error.message);
                        qm_http.handle = null;
                        qm_http.type = null;
                        continue;
                    }
                }
            }
            // qm_trace("INFO-qm_download-qm_http.type: " + qm_http.type);
        }
        try {
            if (param) {
                url += "?" + encodeURI(param);
            }
            if (qm_http.type == "u_c") {
                qm_http.handle.addHttpHeader("Referer", QM_CFG.E_SRV);
                xml_text = qm_http.handle.Request(url, "GET");
                if (qm_http.handle.StatusCode == 200) {
                    return xml_text;
                }
            } else if (qm_http.type == "u_r") {
                qm_http.AddHeader("Referer", QM_CFG.E_SRV);
                xml_text = qm_http.handle.Run(url);
                return xml_text;
            } else if (qm_http.type == "ie") {
                qm_http.handle.open("GET", url, false);
                qm_http.handle.setRequestHeader("Referer", QM_CFG.E_SRV);
                qm_http.handle.send();
                if (qm_http.handle.readyState == 4 && qm_http.handle.status == 200) {
                    xml_text = qm_http.handle.responseText;
                    return xml_text;
                }
            }
        } catch (e) {
            // qm_trace("ERROR-qm_download-request message: " + e.message);
            continue;
        }
    }
    // qm_trace("FAILED-qm_download");
    return null;
}

function qm_json(str) {
    if (typeof JSON == 'object') {
        return JSON.parse(str);
    } else {
        try {
            // Method 1: eval
            return eval("(" + str + ")");
        } catch (e) {
            // qm_trace("ERROR-qm_json-eval message: " + e.message);
            try {
                // Method 2: new Function
                return (new Function('return ' + str))();
            } catch (err) {
                // qm_trace("ERROR-qm_json-Function message: " + e.message);
                throw new SyntaxError('FAILED-qm_json');
                // Method 3: json2.js
            }
        }
    }
}

function qm_normalize(str) {
    var s = null;
    if (str) {
        s = str;
        // !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~
        s = s.replace(/([\u0021-\u002F]|[\u003A-\u0040]|[\u005B-\u0060]|[\u007B-\u007E])+/g, " ");
        // ！＂＃＄％＆＇（）＊＋，－．／：；＜＝＞？＠［＼］＾＿｀｛｜｝～
        s = s.replace(/([\uFF01-\uFF20]|[\uFF3B-\uFF40]|[\uFF5B-\uFF5E])+/g, " ");
        // ·×‐‑‒–—―‖‗‘’‚‛“”„‟…‧‰、。〇〈〉《》「」『』【】〔〕〖〗〜・
        s = s.replace(/(\u00B7|\u00D7|[\u2010-\u201F]|[\u2026-\u2027]|\u2030|[\u3001-\u3002]|[\u3007-\u3011]|[\u3014-\u3017]|\u301C|\u30FB)+/g, " ");
        s = s.replace(/\s+/g, " ");
    } else {
        s = "";
    }
    return s;
}

function qm_capitalize(str) {
    var s = null;
    if (str) {
        s = str;
        s = s.toLowerCase().replace(/(\b[a-z])/g, function (c) {
            return c.toUpperCase();
        }
        );
    } else {
        s = "";
    }
    return s;
}

function qm_is_aborting() {
    if (qm_abort.isvalid) {
        try {
            return qm_abort.handle.IsAborting();
        } catch (e) {
            // qm_trace("ERROR-qm_is_aborting message: " + e.message);
            qm_abort.isvalid = false;
        }
    }
    return false;
}

function qm_trace(str) {
    if (QM_CFG.DEBUG) {
        fb.trace("QM_DEBUG> " + str);
    }
}

function qm_generate_translation(plain, translation) {
    var arr_plain = plain.split("\n");
    var arr_translation = translation.split("\n");
    var translated_lyrics = "";
    for (var i = translation.indexOf("kana") == -1 ? 5 : 6; i < arr_plain.length; i++) {
        translated_lyrics += arr_plain[i] + "\r\n";
        var timestamp = "";
        if (i < arr_plain.length - 1) {
            timestamp = arr_translation[i + 1].substr(0, 10);
        }
        else {
            timestamp = "[" + format_time(to_millisecond(arr_translation[i].substr(1, 8)) + 1000) + "]";
        }
        if (arr_translation[i] == "腾讯享有本翻译作品的著作权" || arr_translation[i].indexOf("//") != -1) {

            translated_lyrics += timestamp + arr_translation[i].substring(10).replace("//", "　　") + "\r\n";
        } else {
            translated_lyrics += timestamp + arr_translation[i].substring(10) + "\r\n";
        }
    }

    return translated_lyrics;
}

function qm_generate_single_line(plain) {
    var arr_plain = plain.split("\n");
    var single_line_lyrics = "";
    for (var i = 0; i < arr_plain.length; i++) {
        single_line_lyrics += arr_plain[i] + "\r\n";
        var timestamp = "";
        if (i < arr_plain.length - 1) {
            timestamp = arr_plain[i + 1].substr(0, 10);
        }
        else {
            timestamp = "[" + format_time(to_millisecond(arr_plain[i].substr(1, 8)) + 1000) + "]";
        }
        single_line_lyrics += timestamp + "　　" + "\r\n";
    }

    return single_line_lyrics;
}

function to_millisecond(timeString) {
    return parseInt(timeString.slice(0, 2), 10) * 60000 + parseInt(timeString.substr(3, 2), 10) * 1000 + parseInt(timeString.substr(6, 2), 10);
}

function zpad(n) {
    var s = n.toString();
    return (s.length < 2) ? "0" + s : s;
}

function format_time(time) {
    var t = Math.abs(time / 1000);
    var h = Math.floor(t / 3600);
    t -= h * 3600;
    var m = Math.floor(t / 60);
    t -= m * 60;
    var s = Math.floor(t);
    var ms = t - s;
    var str = (h ? zpad(h) + ":" : "") + zpad(m) + ":" + zpad(s) + "." + zpad(Math.floor(ms * 100));
    return str;
}


// https://github.com/dankogai/js-base64
// https://github.com/dankogai/js-base64/raw/master/base64.min.js
(function (global) { "use strict"; var _Base64 = global.Base64; var version = "2.3.2"; var buffer; if (typeof module !== "undefined" && module.exports) { try { buffer = require("buffer").Buffer } catch (err) { } } var b64chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"; var b64tab = function (bin) { var t = {}; for (var i = 0, l = bin.length; i < l; i++)t[bin.charAt(i)] = i; return t }(b64chars); var fromCharCode = String.fromCharCode; var cb_utob = function (c) { if (c.length < 2) { var cc = c.charCodeAt(0); return cc < 128 ? c : cc < 2048 ? fromCharCode(192 | cc >>> 6) + fromCharCode(128 | cc & 63) : fromCharCode(224 | cc >>> 12 & 15) + fromCharCode(128 | cc >>> 6 & 63) + fromCharCode(128 | cc & 63) } else { var cc = 65536 + (c.charCodeAt(0) - 55296) * 1024 + (c.charCodeAt(1) - 56320); return fromCharCode(240 | cc >>> 18 & 7) + fromCharCode(128 | cc >>> 12 & 63) + fromCharCode(128 | cc >>> 6 & 63) + fromCharCode(128 | cc & 63) } }; var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g; var utob = function (u) { return u.replace(re_utob, cb_utob) }; var cb_encode = function (ccc) { var padlen = [0, 2, 1][ccc.length % 3], ord = ccc.charCodeAt(0) << 16 | (ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8 | (ccc.length > 2 ? ccc.charCodeAt(2) : 0), chars = [b64chars.charAt(ord >>> 18), b64chars.charAt(ord >>> 12 & 63), padlen >= 2 ? "=" : b64chars.charAt(ord >>> 6 & 63), padlen >= 1 ? "=" : b64chars.charAt(ord & 63)]; return chars.join("") }; var btoa = global.btoa ? function (b) { return global.btoa(b) } : function (b) { return b.replace(/[\s\S]{1,3}/g, cb_encode) }; var _encode = buffer ? buffer.from && buffer.from !== Uint8Array.from ? function (u) { return (u.constructor === buffer.constructor ? u : buffer.from(u)).toString("base64") } : function (u) { return (u.constructor === buffer.constructor ? u : new buffer(u)).toString("base64") } : function (u) { return btoa(utob(u)) }; var encode = function (u, urisafe) { return !urisafe ? _encode(String(u)) : _encode(String(u)).replace(/[+\/]/g, function (m0) { return m0 == "+" ? "-" : "_" }).replace(/=/g, "") }; var encodeURI = function (u) { return encode(u, true) }; var re_btou = new RegExp(["[À-ß][-¿]", "[à-ï][-¿]{2}", "[ð-÷][-¿]{3}"].join("|"), "g"); var cb_btou = function (cccc) { switch (cccc.length) { case 4: var cp = (7 & cccc.charCodeAt(0)) << 18 | (63 & cccc.charCodeAt(1)) << 12 | (63 & cccc.charCodeAt(2)) << 6 | 63 & cccc.charCodeAt(3), offset = cp - 65536; return fromCharCode((offset >>> 10) + 55296) + fromCharCode((offset & 1023) + 56320); case 3: return fromCharCode((15 & cccc.charCodeAt(0)) << 12 | (63 & cccc.charCodeAt(1)) << 6 | 63 & cccc.charCodeAt(2)); default: return fromCharCode((31 & cccc.charCodeAt(0)) << 6 | 63 & cccc.charCodeAt(1)) } }; var btou = function (b) { return b.replace(re_btou, cb_btou) }; var cb_decode = function (cccc) { var len = cccc.length, padlen = len % 4, n = (len > 0 ? b64tab[cccc.charAt(0)] << 18 : 0) | (len > 1 ? b64tab[cccc.charAt(1)] << 12 : 0) | (len > 2 ? b64tab[cccc.charAt(2)] << 6 : 0) | (len > 3 ? b64tab[cccc.charAt(3)] : 0), chars = [fromCharCode(n >>> 16), fromCharCode(n >>> 8 & 255), fromCharCode(n & 255)]; chars.length -= [0, 0, 2, 1][padlen]; return chars.join("") }; var atob = global.atob ? function (a) { return global.atob(a) } : function (a) { return a.replace(/[\s\S]{1,4}/g, cb_decode) }; var _decode = buffer ? buffer.from && buffer.from !== Uint8Array.from ? function (a) { return (a.constructor === buffer.constructor ? a : buffer.from(a, "base64")).toString() } : function (a) { return (a.constructor === buffer.constructor ? a : new buffer(a, "base64")).toString() } : function (a) { return btou(atob(a)) }; var decode = function (a) { return _decode(String(a).replace(/[-_]/g, function (m0) { return m0 == "-" ? "+" : "/" }).replace(/[^A-Za-z0-9\+\/]/g, "")) }; var noConflict = function () { var Base64 = global.Base64; global.Base64 = _Base64; return Base64 }; global.Base64 = { VERSION: version, atob: atob, btoa: btoa, fromBase64: decode, toBase64: encode, utob: utob, encode: encode, encodeURI: encodeURI, btou: btou, decode: decode, noConflict: noConflict }; if (typeof Object.defineProperty === "function") { var noEnum = function (v) { return { value: v, enumerable: false, writable: true, configurable: true } }; global.Base64.extendString = function () { Object.defineProperty(String.prototype, "fromBase64", noEnum(function () { return decode(this) })); Object.defineProperty(String.prototype, "toBase64", noEnum(function (urisafe) { return encode(this, urisafe) })); Object.defineProperty(String.prototype, "toBase64URI", noEnum(function () { return encode(this, true) })) } } if (global["Meteor"]) { Base64 = global.Base64 } if (typeof module !== "undefined" && module.exports) { module.exports.Base64 = global.Base64 } else if (typeof define === "function" && define.amd) { define([], function () { return global.Base64 }) } })(typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : this);
