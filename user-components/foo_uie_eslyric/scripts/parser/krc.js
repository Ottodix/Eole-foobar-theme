
export function getConfig(cfg) {
    cfg.name = "KRC Parser";
    cfg.version = "0.1";
    cfg.author = "ohyeah";
    cfg.parsePlainText = false;
    cfg.fileType = "krc";
}

export function parseLyric(context) {
    let zipData = xorKRC(context.lyricData);
    if (!zipData)
        return;
    let unzipData = zlib.uncompress(zipData.buffer);
    if (unzipData == null)
        return;
    context.lyricText = krc2lrc(arrayBufferToString(unzipData));
}

function xorKRC(rawData) {

    if (null == rawData)
        return;

    let dataView = new Uint8Array(rawData);
    let magicBytes = [0x6b, 0x72, 0x63, 0x31];// 'k' , 'r' , 'c' ,'1'
    if (dataView.length < magicBytes.length)
        return;
    for (let i = 0; i < magicBytes.length; ++i) {
        if (dataView[i] != magicBytes[i])
            return;
    }

    let decryptedData = new Uint8Array(dataView.length - magicBytes.length);
    let encKey = [0x40, 0x47, 0x61, 0x77, 0x5e, 0x32, 0x74, 0x47, 0x51, 0x36, 0x31, 0x2d, 0xce, 0xd2, 0x6e, 0x69];
    let hdrOffset = magicBytes.length;
    for (let i = hdrOffset; i < dataView.length; ++i) {
        let x = dataView[i];
        let y = encKey[(i - hdrOffset) % encKey.length];
        decryptedData[i - hdrOffset] = x ^ y;
    }

    return decryptedData;
}

// example
// [1000,1200]<0,400,0>word1<400,200,0>word2<600,300,0>word3
// [playback pos, duration]<word offset, word duration, 0>word
function krc2lrc(krcText) {
    let lyricText = "";
    let matches;
    let metaRegex = /^\[(\S+):(\S+)\]$/;
    let timestampsRegex = /^\[(\d+),(\d+)\]/;
    let timestamps2Regex = /<(\d+),(\d+),(\d+)>([^<]*)/g;
    let lines = krcText.split(/[\r\n]/);
    for (const line of lines) {
        if (matches = metaRegex.exec(line)) { // meta info
            lyricText += matches[0] + "\r\n";
        } else if (matches = timestampsRegex.exec(line)) {
            let lyricLine = "";
            let startTime = parseInt(matches[1]);
            let duration = parseInt(matches[2]);
            lyricLine = "[" + formatTime(startTime) + "]";
            // parse sub-timestamps
            let subMatches;
            while (subMatches = timestamps2Regex.exec(line)) {
                let offset = parseInt(subMatches[1]);
                let subWord = subMatches[4];
                lyricLine += "<" + formatTime(startTime + offset) + ">" + subWord;
            }
            lyricLine += "<" + formatTime(startTime + duration) + ">";
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