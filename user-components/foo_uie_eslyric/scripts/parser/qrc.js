import * as decoder from "parser_ext.so";

export function getConfig(cfg) {
    cfg.name = "QRC Parser";
    cfg.version = "0.1";
    cfg.author = "wistaria";
    cfg.parsePlainText = false;
    cfg.fileType = "qrc";
}

export function parseLyric(context) {
    var zipData = decoder.decodeQrc(context.lyricData);
    if (zipData == null) return;
    var unzipData = zlib.uncompress(zipData);
    if (unzipData == null) return;
    var lyricText = qrcToLrc(arrayBufferToString(unzipData));
    if (lyricText == null) return;
    context.lyricText = lyricText;
}

function escapeXml(xmlText)
{
    return xmlText.replace(/&/g, '&amp;');
}

function qrcToLrc(xmlText) {

    if (xmlText != null && typeof xmlText === 'string' && xmlText.indexOf('<?xml') == -1) {
        return xmlText;
    }

    var xmlRoot = mxml.loadString(xmlText);
    if (xmlRoot == null) {
        xmlText = escapeXml(xmlText);
        xmlRoot = mxml.loadString(xmlText);
    }
    if (xmlRoot == null) {
        console.log("parse xml failed: " + xmlText);
        return;
    }
    var lyricElement = xmlRoot.findElement("Lyric_1", mxml.MXML_DESCEND);
    if (lyricElement == null)
        return null;

    var lyricType = lyricElement.getAttr("LyricType");
    if (lyricType == null)
        return null;

    if (parseInt(lyricType) != 1) // unsupported type??? not sure
        return null;

    var qrcText = lyricElement.getAttr("LyricContent");
    if (qrcText == null)
        return null;

    var lyricText = "";
    var matches;
    var metaRegex = /^\[(\S+):(\S+)\]$/;
    var tsRegex = /^\[(\d+),(\d+)\]/;
    var ts2Regex = /([^(^\]]*)\((\d+),(\d+)\)/g;
    var lines = qrcText.split(/[\r\n]/);
    for (const line of lines) {
        //console.log(line);
        if (matches = metaRegex.exec(line)) { // meta info
            lyricText += matches[0] + "\r\n";
        } else if (matches = tsRegex.exec(line)) {
            let lyricLine = "";
            let baseTime = parseInt(matches[1]);
            let duration = parseInt(matches[2]);
            lyricLine += "[" + formatTime(baseTime) + "]";
            lyricLine += "<" + formatTime(baseTime) + ">";
            // parse sub-timestamps
            let subMatches;
            while (subMatches = ts2Regex.exec(line)) {
                var startTime = parseInt(subMatches[2]);
                let offset = parseInt(subMatches[3]);
                let subWord = subMatches[1];
                lyricLine += subWord + "<" + formatTime(startTime + offset) + ">";
            }
            lyricText += lyricLine + "\r\n";
        }
    }

    return lyricText;
}

function zpad(n) {
    var s = n.toString();
    return (s.length < 2) ? "0" + s : s;
}

function formatTime(time) {
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
