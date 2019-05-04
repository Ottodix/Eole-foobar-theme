// ======================================================
// Created by Jeannela <jeannela@foxmail.com>
// Updated: 2016-07-24 10:15
// Refer: www.bkjia.com/jQuery/1017034.html
// ======================================================

/** 说明：
 * - ESLyric 的天天动听歌词搜索脚本，仅适用于 ESLyric！
 * - 只适用于 ESLyric version 0.3.5+, 老版本的 ESLyric 还请用老脚本
 *   (当然还是推荐升级 ESLyric 到最新版) */

var debug = false; // 如果要调试的话，改为 true.

function get_my_name() {
	return "TTPod|天天动听";
}

function get_version() {
	return "0.2.0";
}

function get_author() {
	return "Jeannela";
}

function start_search(info, callback) {

    var url;
	var title = info.Title;
	var artist = info.Artist;

    // New method instead of xmlhttp...
    var http_client = utils.CreateHttpClient();

    url = generate_url(title, artist, true, -1);
	//debug && console(url);
    var json_txt = http_client.Request(url);
    if (http_client.StatusCode != 200) {
        console("Request url[" + url + "] error : " + http_client.StatusCode);
        return;
    }

    var _new_lyric = callback.CreateLyric();

    // parse json_txt
    //debug && console(json_txt);
    var data = json(json_txt)["data"];
    debug && console("data.length == " + data.length);
    // download lyric
    for (var j = 0; j < data.length; j++) {
        if (callback.IsAborting()) {
            console("user aborted");
            break;
        }
        url = generate_url(data[j].singer_name, data[j].song_name, false, data[j].song_id);
        var json_txt = http_client.Request(url);
        if (http_client.StatusCode != 200) {
            console("Request url[" + url + "] error : " + http_client.StatusCode);
            continue;
        }
        // add to eslyric
        try {
            var _lrc_txt = json(json_txt).data.lrc;
            if (_lrc_txt.indexOf("无歌词") > -1) {
                continue;
            }
            _new_lyric.LyricText = _lrc_txt;
            _new_lyric.Title = data[j].song_name;
            _new_lyric.Artist = data[j].singer_name;
            _new_lyric.Album = data[j].album_name;
            _new_lyric.Location = url,
            callback.AddLyric(_new_lyric);
            (j % 2 == 0) && callback.Refresh();
        } catch (e) {
            continue;
        }
    }
    _new_lyric.Dispose();

}

function generate_url(artist, title, query, song_id) {
    var url = "";
    if (query) {
        title = process_keywords(title);
        artist = process_keywords(artist);
        url = "http://so.ard.iyyin.com/s/song_with_out?q=" + encodeURIComponent(title) + "+" + encodeURIComponent(artist);
    } else {
        url = "http://lp.music.ttpod.com/lrc/down?lrcid=&artist=" + encodeURIComponent(artist) + "&title=" + encodeURIComponent(title) + "&song_id=" + song_id;
    }
    return url;
}

function process_keywords(str) {
	var s = str;
	s = s.toLowerCase();
	s = s.replace(/\'|·|\$|\&|–/g, "");
	//truncate all symbols
	s = s.replace(/\(.*?\)|\[.*?]|{.*?}|（.*?/g, "");
	s = s.replace(/[-/:-@[-`{-~]+/g, "");
	s = s.replace(/[\u2014\u2018\u201c\u2026\u3001\u3002\u300a\u300b\u300e\u300f\u3010\u3011\u30fb\uff01\uff08\uff09\uff0c\uff1a\uff1b\uff1f\uff5e\uffe5]+/g, "");
	return s;
}

function json(text) 
{
	try{
		var data=JSON.parse(text);
		return data;
	}catch(e){
		return false;
	}
}

function console(s) {
	fb.trace("TTPod: " + s);
};


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
