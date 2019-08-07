/**
 * KRC Parser Plus (Original 'KRC Parser')
 * Original Author: btx258
 * Modified by: Robotxm
 * Version: 0.3.7
 * License: GPL 3.0
 * Description: Make foobar2000 with ESLyric able to parse
 *              KRC and translated lyrics if they exist.
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

/** 
 * Define whether to use beta function.
 * true: Enablde beta function
 * false: Disable beta function
 * 是否使用测试功能。此功能主要用于使存在翻译时歌词的显示效果与酷狗音乐一致。原理是在每一行歌词原文前添加一个空格。
 * 此空格不会被 ESLyric 显示，因此并不会影响观感。
 * 如果有处理歌词文件的需求，请避免使用测试功能。
 * true: 启用 Beta 测试功能
 * false: 禁用 Beta 测试功能
**/
var beta = true;

/**
 * Define whether to use alpha function.
 * NOTICE: If lyrics shows incorrectly, set to false and open an issue.
 * true: Enable alpha function
 * false: Disable alpha function
 * 是否使用 Alpha 测试功能。此功能主要是使得 ESLyric 成为真正的“逐字”模式。原理和酷狗一样，使用“开始”和“结束”
 * 两个时间标签控制一个字符。
 * 注意：如果启用后出现歌词显示错误，请关闭并提交 issue。
 * true: 启用 Alpha 测试功能
 * false: 禁用 Alpha 测试功能
 */
var alpha = true;

function get_my_name() {
    return "KRC Parser Plus";
}

function get_version() {
    return "0.3.7";
}

function get_author() {
    return "Robotxm & wistaria";
}

function is_our_type(type) {
    return type.toLowerCase() == "krc";
}

function start_parse(data) {
    var zip_data = null;
    var krc_text = null;
    zip_data = krchex_xor(data);
    if (!zip_data)
        return;
    unzip_data = utils.ZUnCompress(zip_data);
    if (!unzip_data)
        return;
    krc_text = utils.UTF8ToUnicode(unzip_data);
    return krc2lrc(krc_text);
}

function krchex_xor(s) {
    var magic_bytes = [0x6b, 0x72, 0x63, 0x31]; // 'k' , 'r' , 'c' ,'1'
    if (s.length < magic_bytes.length) return;
    for (var i = 0; i < magic_bytes.length; ++i) {
        var c = s.charCodeAt(i);
        if (c != magic_bytes[i]) return;
    }
    var enc_key = [0x40, 0x47, 0x61, 0x77, 0x5e, 0x32, 0x74, 0x47, 0x51, 0x36, 0x31, 0x2d, 0xce, 0xd2, 0x6e, 0x69];
    var buf = "";
    var krc_header = magic_bytes.length; // First 4 bytes
    for (var i = krc_header; i < s.length; ++i) {
        var x1 = s.charCodeAt(i);;
        var x2 = enc_key[(i - krc_header) % 16];
        buf += String.fromCharCode(x1 ^ x2);
    }
    return buf;
}

function krc2lrc(text) {

    var lrcBuf = "";
    var regx_meta_info = /^\[([^\d:][^:]*):([^:]*)\]\s*$/;
    var regx_timestamps1 = /^\[(\d*,\d*)\]/;
    var regx_timestamps2 = /<(\d*,\d*,\d*)>([^<]*)/g;
    var lrcMetaInfo = ["ar", "ti", "al", "by", "offset"];
    var metaInfoUnlock = true;
    var line, arr;
    var _end = 0;

    // Get translation
    var jkrc, trans;
    var lrcBuf2 = "";
    var lc = 0; // LRC metadata lines
    var btrans = false;
    if (text.indexOf("language") != -1 && text.indexOf("eyJjb250ZW50IjpbXSwidmVyc2lvbiI6MX0=") == -1) {
        var regx_lrc = text.match(/language:(.*)/g);
        regx_lrc[0] = regx_lrc[0].substring(0, regx_lrc[0].length - 1);
        var lrc = unescape(base64decode(regx_lrc[0].replace("language:", "")).replace(/\\u/g, '%u'));
        var jkrc = eval('(' + lrc + ')');
        for (var j = 0; j < jkrc.content.length; j++) {
            if (jkrc.content[j].type == 1) {
                btrans = true;
                var trans = jkrc.content[j].lyricContent;
            }
        }
    }
    var lines = text.split(/[\n\r]/);

    // Start conversion
    for (var i = 0; i < lines.length; ++i) {
        line = lines[i];
        // Copy known meta tag back
        if (metaInfoUnlock && (arr = regx_meta_info.exec(line))) {
            for (var idx in lrcMetaInfo) {
                if (lrcMetaInfo[idx] == arr[1]) {
                    lrcBuf = lrcBuf + arr[0] + "\r\n";
                    lc++;
                    break;
                }
            }
            var lrcMeta = lrcBuf;
        }
        else if ((arr = regx_timestamps1.exec(line))) {
            // Parse lyric line
            metaInfoUnlock = false;
            var buf = "";
            var _time_array = arr[1].split(',');
            var _start = parseInt(_time_array[0], 10);
            var _duaration = parseInt(_time_array[1], 10);
            while ((arr = regx_timestamps2.exec(line))) {
                var _sub_time = arr[1].split(',');
                var _sub_start = parseInt(_sub_time[0], 10);
                var _sub_duaration = parseInt(_sub_time[1], 10);
                var cnt = arr[2];
                buf = buf + "[" + format_time(_start + _sub_start) + "]" + cnt + (alpha ? ("[" + format_time(_start + _sub_start + _sub_duaration) + "]") : "");
                _duaration = parseInt(_sub_start + _sub_duaration, 10);
            }
            if (!alpha)
                buf = buf + "[" + format_time(_start + _duaration) + "]";
            _end = _start + _duaration;
            lrcBuf += buf + "\r\n";
        }
    }

    // Add translation if exists
    if (btrans) {
        if (beta) {
            var lrc_lines = lrcBuf.split("\r\n");
            for (var k = 0; k < trans.length; k++) {
                if (k != trans.length - 1) {
                    if (k == 0) {
                        if (ToMilliSec(lrc_lines[k + lc].substr(lrc_lines[k + lc].length - 9, 8)) < ToMilliSec(lrc_lines[k + lc + 1].substr(1, 8)))
                            lrcBuf2 += lrc_lines[k + lc] + "\r\n" + lrc_lines[k + lc].slice(-10) + (trans[k] == "" ? "　　" : trans[k]) + lrc_lines[k + lc].slice(-10) + "\r\n";
                        else
                            lrcBuf2 += lrc_lines[k + lc] + "\r\n" + lrc_lines[k + lc + 1].substr(0, 10) + (trans[k] == "" ? "　　" : trans[k]) + lrc_lines[k + lc + 1].substr(0, 10) + "\r\n";
                    }
                    else {
                        if (ToMilliSec(lrc_lines[k + lc - 1].substr(lrc_lines[k + lc - 1].length - 9, 8)) < ToMilliSec(lrc_lines[k + lc].substr(1, 8))) {
                            if (ToMilliSec(lrc_lines[k + lc].substr(lrc_lines[k + lc].length - 9, 8)) < ToMilliSec(lrc_lines[k + lc + 1].substr(1, 8)))
                                lrcBuf2 += lrc_lines[k + lc - 1].slice(-10) + " " + lrc_lines[k + lc] + "\r\n" + lrc_lines[k + lc].slice(-10) + (trans[k] == "" ? "　　" : trans[k]) + lrc_lines[k + lc].slice(-10) + "\r\n";
                            else
                                lrcBuf2 += lrc_lines[k + lc - 1].slice(-10) + " " + lrc_lines[k + lc] + "\r\n" + lrc_lines[k + lc + 1].substr(0, 10) + (trans[k] == "" ? "　　" : trans[k]) + lrc_lines[k + lc + 1].substr(0, 10) + "\r\n";
                        }
                        else {
                            if (ToMilliSec(lrc_lines[k + lc].substr(lrc_lines[k + lc].length - 9, 8)) < ToMilliSec(lrc_lines[k + lc + 1].substr(1, 8)))
                                lrcBuf2 += lrc_lines[k + lc] + "\r\n" + lrc_lines[k + lc].slice(-10) + (trans[k] == "" ? "　　" : trans[k]) + lrc_lines[k + lc].slice(-10) + "\r\n";
                            else
                                lrcBuf2 += lrc_lines[k + lc] + "\r\n" + lrc_lines[k + lc + 1].substr(0, 10) + (trans[k] == "" ? "　　" : trans[k]) + lrc_lines[k + lc + 1].substr(0, 10) + "\r\n";
                        }
                    }
                }
                else {
                    if (ToMilliSec(lrc_lines[k + lc - 1].substr(lrc_lines[k + lc - 1].length - 9, 8)) < ToMilliSec(lrc_lines[k + lc].substr(1, 8)))
                        lrcBuf2 += lrc_lines[k + lc - 1].slice(-10) + " " + lrc_lines[k + lc] + "\r\n" + "[" + format_time(_end + 1000) + "]" + (trans[k] == "" ? "　　" : trans[k]) + "[" + format_time(_end + 1000) + "]" + "\r\n" + "[" + format_time(_end + 1001) + "]　\r\n";
                    else
                        lrcBuf2 += lrc_lines[k + lc] + "\r\n[" + format_time(_end + 1001) + "]" + (trans[k] == "" ? "　　" : trans[k]) + "[" + format_time(_end + 1001) + "]" + "\r\n" + "[" + format_time(_end + 1001) + "]　\r\n";
                }
            }
            lrcBuf = lrcMeta + "\r\n" + lrcBuf2;
        }
        else {
            var lrc_lines = lrcBuf.split("\r\n");
            for (var k = 0; k < trans.length; k++) {
                if (k != trans.length - 1)
                    lrcBuf2 += lrc_lines[k + lc] + "\r\n" + lrc_lines[k + lc + 1].slice(0, 10) + (trans[k] == "" ? "　　" : trans[k]) + lrc_lines[k + lc + 1].slice(0, 10) + "\r\n";
                else
                    lrcBuf2 += lrc_lines[k + lc] + "\r\n" + "[" + format_time(_end + 1000) + "]" + (trans[k] == "" ? "　　" : trans[k]) + "[" + format_time(_end + 1000) + "]" + "\r\n" + "[" + format_time(_end + 1001) + "]　\r\n";
            }
            lrcBuf = lrcMeta + "\r\n" + lrcBuf2;
        }
    }

    // Process something about single-line mode
    if (!dual_line && !btrans) {
        var lrc_lines = lrcBuf.split("\r\n");
        for (var k = lc; k < lrc_lines.length; k++) {
            if (k != lrc_lines.length - 1) {
                if (ToMilliSec(lrc_lines[k + 1].substr(1, 8)) < ToMilliSec(lrc_lines[k].substr(lrc_lines[k].length - 9, 8)))
                    lrcBuf2 += lrc_lines[k] + "\r\n" + lrc_lines[k + 1].substr(0, 10) + "　　" + lrc_lines[k + 1].substr(0, 10) + "\r\n";
                else
                    lrcBuf2 += lrc_lines[k] + "\r\n" + lrc_lines[k].slice(-10) + "　　" + lrc_lines[k].slice(-10) + "\r\n";
            }
            else
                lrcBuf2 += lrc_lines[k] + "\r\n" + lrc_lines[k].slice(-10) + "　　" + lrc_lines[k].slice(-10) + "\r\n";
        }
        lrcBuf = lrcBuf2;
    }

    return lrcBuf;
}

function ToMilliSec(timeString) {
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

var base64DecodeChars = new Array(- 1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

function base64decode(str) {
    var c1, c2, c3, c4;
    var i, len, out;

    len = str.length;
    i = 0;
    out = "";
    while (i < len) {
        /* c1 */
        do {
            c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while (i < len && c1 == - 1);
        if (c1 == -1) break;

        /* c2 */
        do {
            c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
        } while (i < len && c2 == - 1);
        if (c2 == -1) break;

        out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

        /* c3 */
        do {
            c3 = str.charCodeAt(i++) & 0xff;
            if (c3 == 61) return out;
            c3 = base64DecodeChars[c3];
        } while (i < len && c3 == - 1);
        if (c3 == -1) break;

        out += String.fromCharCode(((c2 & 0xF) << 4) | ((c3 & 0x3C) >> 2));

        /* c4 */
        do {
            c4 = str.charCodeAt(i++) & 0xff;
            if (c4 == 61) return out;
            c4 = base64DecodeChars[c4];
        } while (i < len && c4 == - 1);
        if (c4 == -1) break;
        out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
    }
    return out;
}
