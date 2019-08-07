/**
 * Created by cimoc on 2016/12/23
 * Netease Cloud Music Lyric Source Script For ESLyric
 * version : 0.1.2 b6
 * Thanks to ChowDPa02K,Jeannela\Elia,and the provider of N.C.M. api
 * page : https://sokka.cn/107/, https://github.com/cimoc-sokka/Some-js-script-for-FB2K/releases/download/0.1.2/ncm_0.1.2.js
 * download page : https://sokka.cn/down/ncm_lyric/
 * cimoc : mail : cimoc@sokka.cn
 *         blog : https://sokka.cn
 *                akkos.lofter.com
 */

    //更改lrc_order内标识顺序,设置歌词输出顺序,删除即不获取
    //old_merge:并排合并歌词,newtype:并列合并,tran:翻译,origin:原版歌词,
	/*
	new_merge:并排合并歌词,在卡拉OK模式下仅高亮原语言歌词
	不推荐使用,仅能即时获取歌词即时使用,不能保存,且若原词为全英文或英文符号则翻译前会显示时间轴
	*/
var lrc_order = [
        "old_merge",
        "newtype",
        "origin",
        "tran", 
		//"new_merge"
    ];

//搜索歌词数,如果经常搜不到试着改小或改大
var limit = 4;

//更改或删除翻译外括号
//提供一些括号〔 〕〈 〉《 》「 」『 』〖 〗【 】( ) [ ] { }
var bracket = [
    "「", //左括号
    "」"  //右括号
];

//修复newtype歌词保存 翻译提前秒数 设为0则取消 如果翻译歌词跳的快看的难过,蕴情设为0.4-1.0
var savefix = 0.01;
//new_merge歌词翻译时间轴滞后秒数，防闪
var timefix = 0.01;
//当timefix有效时设置offset(毫秒),防闪
var offset=-20;


var xmlHttp = new ActiveXObject("WinHttp.WinHttpRequest.5.1");
var debug = false;
function get_my_name() {
    return "Netease Chinese script";
}

function get_version() {
    return "0.1.2 b6";
}

function get_author() {
    return "cimoc";
}

function start_search(info, callback) {
    var searchURL, lyricURL;

    //删除feat.及之后内容并保存
    var str1 = del(info.Title, "feat.");
    var str2 = del(info.Artist, "feat.");
    var title = str1[0];
    var outstr1 = str1[1];
    var artist = str2[0];
    var outstr2 = str2[1];
    //搜索
    var s = artist ? (title + "-" + artist) : title;
    //searchURL = "http://music.163.com/api/search/get/web?csrf_token=";//如果下面的没用,试试改成这句
    searchURL = "http://music.163.com/api/search/get/";
    var post_data = 'hlpretag=<span class="s-fc7">&hlposttag=</span>&s=' + encodeURIComponent(s) + '&type=1&offset=0&total=true&limit=' + limit;
    try {
        xmlHttp.Open("POST", searchURL, false);
        //noinspection JSAnnotator
        xmlHttp.Option(4) = 13056;
        //noinspection JSAnnotator
        xmlHttp.Option(6) = false;
        xmlHttp.SetRequestHeader("Host", "music.163.com");
        xmlHttp.SetRequestHeader("Origin", "http://music.163.com");
        xmlHttp.SetRequestHeader("User-Agent", "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.90 Safari/537.36");
        xmlHttp.SetRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xmlHttp.SetRequestHeader("Referer", "http://music.163.com/search/");
        xmlHttp.SetRequestHeader("Connection", "Close");
        xmlHttp.Send(post_data);
    } catch (e) {
        debug && console("search failed");
        return;
    }
    var newLyric = fb.CreateLyric();

    if (xmlHttp.Status == 200) {
        //  console(xmlHttp.responseText);
        var ncm_back = json(xmlHttp.responseText);
        var result = ncm_back.result;
        if (ncm_back.code != 200 || !result.songCount) {
            debug && console("get info failed");
            return false;
        }
        //筛选曲名及艺术家
        var song = result.songs;
        var out = [0, 0];
        var b = 0;
        var c = 0;
        for (var k in song) {
            var ncm_name = song[k].name;
            for (var a_k in song[k].artists) {
                var ncm_artist = song[k].artists[a_k].name;
                var p0 = compare(title, ncm_name);
                var p1 = compare(artist, ncm_artist);
                if (p0 == 100 && p1 == 100) {
                    b = k;
                    c = a_k;
                    out[0] = p0;
                    out[1] = p1;
                    break;
                }
                if (p0 > out[0]) {
                    b = k;
                    c = a_k;
                    out[0] = p0;
                } else {
                    if (!artist && (p0 == out[0] && p1 > out[1])) {
                        b = k;
                        c = a_k;
                        out[1] = p1;
                    }
                }
            }
        }
        var res_id = song[b].id;
        var res_name = song[b].name;
        var res_artist = song[b].artists[c].name;
        debug && console(res_id + "-" + res_name + "-" + res_artist);

        //获取歌词
        lyricURL = "http://music.163.com/api/song/lyric?os=pc&id=" + res_id + "&lv=-1&kv=-1&tv=-1";
        try {
            xmlHttp.Open("GET", lyricURL, false);
            //noinspection JSAnnotator
            xmlHttp.Option(4) = 13056;
            //noinspection JSAnnotator
            xmlHttp.Option(6) = false;
            xmlHttp.SetRequestHeader("Cookie", "appver=1.5.0.75771");
            xmlHttp.SetRequestHeader("Referer", "http://music.163.com/");
            xmlHttp.SetRequestHeader("Connection", "Close");
            xmlHttp.Send(post_data);
        } catch (e) {
            debug && console("Get Lyric failed");
            return;
        }
        //添加歌词
        if (xmlHttp.Status == 200) {
            var ncm_lrc = json(xmlHttp.responseText);
            var issettran = 0;
            var issetlrc = 0;
            if (!ncm_lrc.lrc) return false;
            if (ncm_lrc.tlyric && ncm_lrc.tlyric.lyric) {
                tranlrc = ncm_lrc.tlyric.lyric.replace(/(〔|〕|〈|〉|《|》|「|」|『|』|〖|〗|【|】|{|}|\/)/g, "");
                issettran = 1;
            } else debug && console("no translation");
            if (ncm_lrc.lrc.lyric) {
                issetlrc = 1;
            } else debug && console("no lyric");
            if (!lrc_order.length) lrc_order = ["new_merge", "newtype", "origin", "tran"];
            for (var key in lrc_order) {
                switch (lrc_order[key]) {
                    case "new_merge" :
                        if (issetlrc && issettran) {
                            newLyric.LyricText = lrc_newtype(ncm_lrc.lrc.lyric, tranlrc, false);
                            newLyric.Title = res_name + outstr1;
                            newLyric.Artist = res_artist + outstr2;
                            newLyric.Source = "(并排)" + get_my_name();
                            callback.AddLyric(newLyric);
                        }
                        break;
                    case "origin" :
                        if (issetlrc) {
                            newLyric.LyricText = ncm_lrc.lrc.lyric;
                            newLyric.Title = res_name + outstr1;
                            newLyric.Artist = res_artist + outstr2;
                            newLyric.Source = "(原词)" + get_my_name();
                            callback.AddLyric(newLyric);
                        }
                        break;
                    case "tran" :
                        if (issettran) {
                            newLyric.LyricText = tranlrc;
                            newLyric.Title = res_name + outstr1;
                            newLyric.Artist = res_artist + outstr2;
                            newLyric.Source = "(翻译)" + get_my_name();
                            callback.AddLyric(newLyric);
                        }
                        break;
                    case "newtype":
                        if (issetlrc && issettran) {
                            newLyric.LyricText = lrc_newtype(ncm_lrc.lrc.lyric, tranlrc, true);
                            newLyric.Title = res_name + outstr1;
                            newLyric.Artist = res_artist + outstr2;
                            newLyric.Source = "(并列)" + get_my_name();
                            callback.AddLyric(newLyric);
                        }
                        break;
                    case "old_merge" :
                        if (issetlrc && issettran) {
                            newLyric.LyricText = lrc_merge(ncm_lrc.lrc.lyric, tranlrc);
                            newLyric.Title = res_name + outstr1;
                            newLyric.Artist = res_artist + outstr2;
                            newLyric.Source = "(并排-旧)" + get_my_name();
                            callback.AddLyric(newLyric);
                        }
                        break;
                }
            }
        }
    }
    newLyric.Dispose();
}


function console(s) {
    fb.trace("NCMscript: \n" + s);
}
function del(str, delthis) {
    var s = [str, ""];
    var set = str.indexOf(delthis);

    if (set == -1) {
        return s;
    }
    s[1] = " " + str.substr(set);
    s[0] = str.substring(0, set);

    return s;
}
function compare(x, y) {
    x = x.split("");
    y = y.split("");
    var z = 0;
    var s = x.length + y.length;


    x.sort();
    y.sort();
    var a = x.shift();
    var b = y.shift();

    while (a !== undefined && b !== undefined) {
        if (a === b) {
            z++;
            a = x.shift();
            b = y.shift();
        } else if (a < b) {
            a = x.shift();
        } else if (a > b) {
            b = y.shift();
        }
    }
    return z / s * 200;
}
function lrc_merge(olrc, tlrc) {
    olrc = olrc.split("\n");
    tlrc = tlrc.split("\n");
    var o_f = olrc[0].indexOf("[by:");
    if (o_f == 0) {
        var o_b = olrc[0].indexOf("]");
        var o = (o_f != -1 && o_b != -1) ? olrc[0].substring(4, o_b) : "";

        var t_f = tlrc[0].indexOf("[by:");
        var t_b = tlrc[0].indexOf("]");
        var t = (t_f != -1 && t_b != -1) ? olrc[0].substring(4, o_b) : "";
        olrc[0] = "[by:" + o + "/译:" + t + "]";
    }
    for (var ii = 5,set=0,counter; ii < 10; ii++) {//玄学取set...
        counter = olrc[ii].indexOf("]");
        debug &&console(ii+':'+counter);
        counter = (counter == -1) ? 9 : counter;
        set+=counter;
    }
	set = Math.round(set/5);
    var i = 0;
    var l = tlrc.length;
    var lrc = [];
    for (var k in olrc) {
        var a = olrc[k].substring(1, set);
        while (i < l) {
            var j = 0;
            var tf = 0;
            while (j < 5) {
                if (i + j >= l) break;
                var b = tlrc[i + j].substring(1, set);
                if (a == b) {
                    tf = 1;
                    i += j;
                    break;
                }
                j++;
            }
            if (tf == 0) {
                lrc[k] = olrc[k];
                break;
            }
            var c = tlrc[i].substr(set + 1);
            if (c) {
                lrc[k] = olrc[k] + bracket[0] + tlrc[i].substr(set + 1) + bracket[1];
                i++;
                break;
            } else {
                lrc[k] = olrc[k];
                break;
            }
        }
    }
    return lrc.join("\n");

}
function lrc_newtype(olrc, tlrc, merge_type) {
    olrc = olrc.split("\n");
    tlrc = tlrc.split("\n");
    /*
    var o_f = olrc[0].indexOf("[by:");
    if (o_f == 0) {
        var o_b = olrc[0].indexOf("]");
        var o = (o_f != -1 && o_b != -1) ? olrc[0].substring(4, o_b) : "";

        var t_f = tlrc[0].indexOf("[by:");
        var t_b = tlrc[0].indexOf("]");
        var t = (t_f != -1 && t_b != -1) ? olrc[0].substring(4, o_b) : "";
        olrc[0] = "[by:" + o + "/译:" + t + "]";
    }
    */
    for (var ii = 5,set=0,counter; ii < 10; ii++) {//玄学取set...
        counter = olrc[ii].indexOf("]");
        debug &&console(ii+':'+counter);
        counter = (counter == -1) ? 9 : counter;
        set+=counter;
    }
    set = Math.round(set/5);
    debug &&console("set:"+set);
    var i = 0;
    var l = tlrc.length;
    var lrc = new Array();
    var r = new Array();
    for (var k in olrc) {
        var a = olrc[k].substring(1, set);
        if (i >= l) break;//防溢出数组
        var j = 0;
        var tf = 0;//标记变量,时间轴符合置1
        while (j < 5) {
            if (i + j >= l) break;//防溢出数组
            var b = tlrc[i + j].substring(1, set);
            if (a == b) {
                tf = 1;
                i += j;
                break;
            }
            j++;
        }
        if (tf == 0) {
            r.push([k, false, a]);
        } else {
            r.push([k, i, a]);
        }

    }
    var l_r = r.length;

    if (merge_type) {
        for (var kk = 0; kk < l_r; kk++) {
            o = r[kk][0];
            t = r[kk][1];
            var o_lrc=olrc[o].substr(set + 1);
            o_lrc=o_lrc?olrc[o]:"["+r[kk][2]+"]  ";
            lrc.push(o_lrc);
            var t_lrc = t !==false && tlrc[t].substr(set + 1) ? bracket[0] + tlrc[t].substr(set + 1) + bracket[1] : " ";
            if (kk + 2 > l_r) break;
            if (r[kk + 1][2]) {
                var timeb = r[kk + 1][2].replace(/(])/, "");

                if (savefix) {
                    var x = parseInt(timeb.substr(0, 2));
                    var y = parseFloat(timeb.substr(3, set - 4));
                    var ut = x * 60 + y - savefix;
                    var time = "[" + prefix(Math.floor(ut / 60),2) + ":" + prefix((ut % 60).toFixed(2),5) + "]";
                    debug && console(time);
                } else var time = "[" + timeb + "]";
            } else {
                var x = parseInt(r[kk][2].substr(0, 2));
                var y = parseInt(r[kk][2].substr(3, 2));
                var z = r[kk][2].substr(5, 3);
                var ut = x * 60 + y + 4;
                var time = "[" + prefix(Math.floor(ut / 60),2) + ":" + prefix((ut % 60).toFixed(2),5) + "]";
                debug && console(time);
            }

            lrc.push(time + t_lrc);
        }
    } else {
        if (timefix&&offset) lrc.push("[offset:"+offset+"]");
        for (var kk = 0; kk < l_r; kk++) {
            o = r[kk][0];
            t = r[kk][1];
            var o_lrc=olrc[o].substr(set + 1);
            o_lrc=o_lrc?olrc[o]:"["+r[kk][2]+"]  ";//重要：空格
            var t_lrc = t !==false && tlrc[t].substr(set + 1) ? bracket[0] + tlrc[t].substr(set + 1) + bracket[1] : " ";
            if (kk + 2 > l_r) break;
            if (r[kk + 1][2]) {
                var timeb = r[kk + 1][2].replace(/(])/, "");
                debug &&console("timeb="+timeb);

                if (timefix) {
                    var x = parseInt(timeb.substr(0, 2));
                    var y = parseFloat(timeb.substr(3, set - 4));
                    var ut = x * 60 + y + timefix;
                    var time = "[" + prefix(Math.floor(ut / 60),2) + ":" + prefix((ut % 60).toFixed(2),5) + "]";
                    debug &&console("time="+time);
                } else {var time = "[" + timeb + "]";}
                lrc.push(o_lrc + " " + time + t_lrc);
            } else {
                var x = parseInt(r[kk][2].substr(0, 2));
                var y = parseInt(r[kk][2].substr(3, 2));
                var z = r[kk][2].substr(5, 3);
                var ut = x * 60 + y + 4;
                var time = "[" + prefix(Math.floor(ut / 60),2) + ":" + prefix((ut % 60).toFixed(2),5) + "]";
                lrc.push(o_lrc + " " + time + t_lrc);
                lrc.push(time+"-End-");
                debug && console(time);
            }
            debug &&console(o_lrc + time + t_lrc);

        }


    }


    debug && console("lyric length:" + lrc.length);
    return lrc.join("\n");

}
function prefix(num, length) {
 return (Array(length).join('0') + num).slice(-length);
}
function json(text) {
    try {
        var data = JSON.parse(text);
        return data;
    } catch (e) {
        return false;
    }
}

//json2.js
if(typeof JSON!=='object'){JSON={};}
 (function(){'use strict';function f(n){return n<10?'0'+n:n;}
 if(typeof Date.prototype.toJSON!=='function'){Date.prototype.toJSON=function(key){return isFinite(this.valueOf())?this.getUTCFullYear()+'-'+
 f(this.getUTCMonth()+1)+'-'+
 f(this.getUTCDate())+'T'+
 f(this.getUTCHours())+':'+
 f(this.getUTCMinutes())+':'+
 f(this.getUTCSeconds())+'Z':null;};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf();};}
 var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==='string'?c:'\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4);})+'"':'"'+string+'"';}
 function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==='object'&&typeof value.toJSON==='function'){value=value.toJSON(key);}
 if(typeof rep==='function'){value=rep.call(holder,key,value);}
 switch(typeof value){case'string':return quote(value);case'number':return isFinite(value)?String(value):'null';case'boolean':case'null':return String(value);case'object':if(!value){return'null';}
 gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==='[object Array]'){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||'null';}
 v=partial.length===0?'[]':gap?'[\n'+gap+partial.join(',\n'+gap)+'\n'+mind+']':'['+partial.join(',')+']';gap=mind;return v;}
 if(rep&&typeof rep==='object'){length=rep.length;for(i=0;i<length;i+=1){if(typeof rep[i]==='string'){k=rep[i];v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}else{for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}
 v=partial.length===0?'{}':gap?'{\n'+gap+partial.join(',\n'+gap)+'\n'+mind+'}':'{'+partial.join(',')+'}';gap=mind;return v;}}
 if(typeof JSON.stringify!=='function'){JSON.stringify=function(value,replacer,space){var i;gap='';indent='';if(typeof space==='number'){for(i=0;i<space;i+=1){indent+=' ';}}else if(typeof space==='string'){indent=space;}
 rep=replacer;if(replacer&&typeof replacer!=='function'&&(typeof replacer!=='object'||typeof replacer.length!=='number')){throw new Error('JSON.stringify');}
 return str('',{'':value});};}
 if(typeof JSON.parse!=='function'){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==='object'){for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v;}else{delete value[k];}}}}
 return reviver.call(holder,key,value);}
 text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return'\\u'+
 ('0000'+a.charCodeAt(0).toString(16)).slice(-4);});}
 if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,'@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']').replace(/(?:^|:|,)(?:\s*\[)+/g,''))){j=eval('('+text+')');return typeof reviver==='function'?walk({'':j},''):j;}
 throw new SyntaxError('JSON.parse');};}}());
