'use strict';

function _lastfm() {
	this.notify_data = (name, data) => {
		if (name == '2K3.NOTIFY.LASTFM') {
			this.username = this.read_ini('username');
			this.sk = this.read_ini('sk');
			if (typeof buttons == 'object' && typeof buttons.update == 'function') {
				buttons.update();
				window.Repaint();
			}
			_.forEach(panel.list_objects, (item) => {
				if (item.mode == 'lastfm_info' && item.properties.mode.value > 0) {
					item.update();
				}
			});
		}
	}
	
	this.post = (method, token, metadb) => {
		let api_sig, data;
		switch (method) {
		case 'auth.getToken':
			this.update_sk('');
			api_sig = md5('api_key' + this.api_key + 'method' + method + this.secret);
			data = 'format=json&method=' + method + '&api_key=' + this.api_key + '&api_sig=' + api_sig;
			break;
		case 'auth.getSession':
			api_sig = md5('api_key' + this.api_key + 'method' + method + 'token' + token + this.secret);
			data = 'format=json&method=' + method + '&api_key=' + this.api_key + '&api_sig=' + api_sig + '&token=' + token;
			break;
		case 'track.love':
		case 'track.unlove':
			switch (true) {
			case !this.username.length:
				return console.log(N, 'Last.fm username not set.');
			case this.sk.length != 32:
				return console.log(N, 'This script has not been authorised.');
			}
			const artist = this.tfo.artist.EvalWithMetadb(metadb);
			const track = this.tfo.title.EvalWithMetadb(metadb);
			if (!_tagged(artist) || !_tagged(track)) {
				return;
			}
			console.log(N, 'Attempting to ' + (method == 'track.love' ? 'love ' : 'unlove ') + _q(track) + ' by ' + _q(artist));
			console.log(N, 'Contacting Last.fm....');
			api_sig = md5('api_key' + this.api_key + 'artist' + artist + 'method' + method + 'sk' + this.sk + 'track' + track + this.secret);
			// can't use format=json because Last.fm API is broken for this method
			data = 'method=' + method + '&api_key=' + this.api_key + '&api_sig=' + api_sig + '&sk=' + this.sk + '&artist=' + encodeURIComponent(artist) + '&track=' + encodeURIComponent(track);
			break;
		default:
			return;
		}
		this.xmlhttp.open('POST', 'https://ws.audioscrobbler.com/2.0/', true);
		this.xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		this.xmlhttp.setRequestHeader('User-Agent', this.ua);
		this.xmlhttp.send(data);
		this.xmlhttp.onreadystatechange = () => {
			if (this.xmlhttp.readyState == 4) {
				this.done(method, metadb);
			}
		}
	}
	
	this.get_loved_tracks = (p) => {
		if (!this.username.length) {
			return console.log(N, 'Last.fm Username not set.');
		}
		this.page = p;
		const url = this.get_base_url() + '&method=user.getLovedTracks&limit=200&user=' + this.username + '&page=' + this.page;
		this.xmlhttp.open('GET', url, true);
		this.xmlhttp.setRequestHeader('User-Agent', this.ua);
		this.xmlhttp.setRequestHeader('If-Modified-Since', 'Thu, 01 Jan 1970 00:00:00 GMT');
		this.xmlhttp.send();
		this.xmlhttp.onreadystatechange = () => {
			if (this.xmlhttp.readyState == 4) {
				this.done('user.getLovedTracks');
			}
		}
	}
	
	this.done = (method, metadb) => {
		let data
		switch (method) {
		case 'user.getLovedTracks':
			data = _jsonParse(this.xmlhttp.responseText);
			if (this.page == 1) {
				fb.ShowConsole();
				if (data.error) {
					return console.log(N, 'Last.fm server error:', data.message);
				}
				this.loved_tracks = [];
				this.pages = _.get(data, 'lovedtracks["@attr"].totalPages', 0);
			}
			data = _.get(data, 'lovedtracks.track', []);
			if (data.length) {
				this.loved_tracks = [...this.loved_tracks, ...(_.map(data, (item) => {
					const artist = item.artist.name.toLowerCase();
					const title = item.name.toLowerCase();
					return artist + ' - ' + title;
				}))];
				console.log('Loved tracks: completed page', this.page, 'of', this.pages);
			}
			if (this.page < this.pages) {
				this.page++;
				this.get_loved_tracks(this.page);
			} else {
				console.log(this.loved_tracks.length, 'loved tracks were found on Last.fm.');
				let items = fb.GetLibraryItems();
				items.OrderByFormat(this.tfo.key, 1);
				let items_to_refresh = new FbMetadbHandleList();
				for (let i = 0; i < items.Count; i++) {
					let m = items[i];
					let current = this.tfo.key.EvalWithMetadb(m);
					let idx = _.indexOf(this.loved_tracks, current);
					if (idx > -1) {
						this.loved_tracks.splice(idx, 1);
						m.SetLoved(1);
						items_to_refresh.Add(m);
					}
				}
				console.log(items_to_refresh.Count, 'library tracks matched and updated. Duplicates are not counted.');
				console.log('For those updated tracks, %SMP_LOVED% now has the value of 1 in all components/search dialogs.');
				if (this.loved_tracks.length) {
					console.log('The following tracks were not matched:');
					_.forEach(this.loved_tracks, (item) => {
						console.log(item);
					});
				}
				items_to_refresh.RefreshStats();
			}
			return;
		case 'track.love':
			if (this.xmlhttp.responseText.includes('ok')) {
				console.log(N, 'Track loved successfully.');
				metadb.SetLoved(1);
				metadb.RefreshStats();
				return;
			}
			break;
		case 'track.unlove':
			if (this.xmlhttp.responseText.includes('ok')) {
				console.log(N, 'Track unloved successfully.');
				metadb.SetLoved(0);
				metadb.RefreshStats();
				return;
			}
			break;
		case 'auth.getToken':
			data = _jsonParse(this.xmlhttp.responseText);
			if (data.token) {
				_run('https://last.fm/api/auth/?api_key=' + this.api_key + '&token=' + data.token);
				if (WshShell.Popup('If you granted permission successfully, click Yes to continue.', 0, window.ScriptInfo.Name, popup.question + popup.yes_no) == popup.yes) {
					this.post('auth.getSession', data.token);
				}
				return;
			}
			break;
		case 'auth.getSession':
			data = _jsonParse(this.xmlhttp.responseText);
			if (data.session && data.session.key) {
				this.update_sk(data.session.key);
				return;
			}
			break;
		}
		// display response text/error if we get here, any success returned early
		console.log(N, this.xmlhttp.responseText || this.xmlhttp.status);
	}
	
	this.update_username = () => {
		const username = utils.InputBox(window.ID, 'Enter your Last.fm username', window.ScriptInfo.Name, this.username);
		if (username != this.username) {
			this.write_ini('username', username);
			this.update_sk('');
		}
	}
	
	this.get_base_url = () => {
		return 'http://ws.audioscrobbler.com/2.0/?format=json&api_key=' + this.api_key;
	}
	
	this.read_ini = (k) => {
		return utils.ReadINI(this.ini_file, 'Last.fm', k);
	}
	
	this.write_ini = (k, v) => {
		utils.WriteINI(this.ini_file, 'Last.fm', k, v);
	}
	
	this.update_sk = (sk) => {
		this.write_ini('sk', sk);
		window.NotifyOthers('2K3.NOTIFY.LASTFM', 'update');
		this.notify_data('2K3.NOTIFY.LASTFM', 'update');
	}
	
	this.tfo = {
		key : fb.TitleFormat('$lower(%artist% - %title%)'),
		artist : fb.TitleFormat('%artist%'),
		title : fb.TitleFormat('%title%'),
		album : fb.TitleFormat('[%album%]'),
		loved : fb.TitleFormat('$if2(%SMP_LOVED%,0)'),
		playcount : fb.TitleFormat('$if2(%SMP_PLAYCOUNT%,0)'),
		first_played : fb.TitleFormat('%SMP_FIRST_PLAYED%')
	};
	
	_createFolder(folders.data);
	this.ini_file = folders.data + 'lastfm.ini';
	this.api_key = '1f078d9e59cb34909f7ed56d7fc64aba';
	this.secret = 'a8b4adc5de20242f585b12ef08a464a9';
	this.username = this.read_ini('username');
	this.sk = this.read_ini('sk');
	this.ua = 'foo_jscript_panel_lastfm2';
	this.xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
}

/*
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */
var hexcase=0;function md5(a){return rstr2hex(rstr_md5(str2rstr_utf8(a)))}
function hex_hmac_md5(a,b){return rstr2hex(rstr_hmac_md5(str2rstr_utf8(a),str2rstr_utf8(b)))}
function md5_vm_test(){return md5('abc').toLowerCase()=='900150983cd24fb0d6963f7d28e17f72'}
function rstr_md5(a){return binl2rstr(binl_md5(rstr2binl(a),a.length*8))}
function rstr_hmac_md5(c,f){var e=rstr2binl(c);if(e.length>16){e=binl_md5(e,c.length*8)}
var a=Array(16),d=Array(16);for(var b=0;b<16;b++){a[b]=e[b]^909522486;d[b]=e[b]^1549556828}
var g=binl_md5(a.concat(rstr2binl(f)),512+f.length*8);return binl2rstr(binl_md5(d.concat(g),512+128))}
function rstr2hex(c){try{hexcase}catch(g){hexcase=0}
var f=hexcase?'0123456789ABCDEF':'0123456789abcdef';var b='';var a;for(var d=0;d<c.length;d++){a=c.charCodeAt(d);b+=f.charAt((a>>>4)&15)+f.charAt(a&15)}
return b}
function str2rstr_utf8(c){var b='';var d=-1;var a,e;while(++d<c.length){a=c.charCodeAt(d);e=d+1<c.length?c.charCodeAt(d+1):0;if(55296<=a&&a<=56319&&56320<=e&&e<=57343){a=65536+((a&1023)<<10)+(e&1023);d++}
if(a<=127){b+=String.fromCharCode(a)}else{if(a<=2047){b+=String.fromCharCode(192|((a>>>6)&31),128|(a&63))}else{if(a<=65535){b+=String.fromCharCode(224|((a>>>12)&15),128|((a>>>6)&63),128|(a&63))}else{if(a<=2097151){b+=String.fromCharCode(240|((a>>>18)&7),128|((a>>>12)&63),128|((a>>>6)&63),128|(a&63))}}}}}
return b}
function rstr2binl(b){var a=Array(b.length>>2);for(var c=0;c<a.length;c++){a[c]=0}
for(var c=0;c<b.length*8;c+=8){a[c>>5]|=(b.charCodeAt(c/8)&255)<<(c%32)}
return a}
function binl2rstr(b){var a='';for(var c=0;c<b.length*32;c+=8){a+=String.fromCharCode((b[c>>5]>>>(c%32))&255)}
return a}
function binl_md5(p,k){p[k>>5]|=128<<((k)%32);p[(((k+64)>>>9)<<4)+14]=k;var o=1732584193;var n=-271733879;var m=-1732584194;var l=271733878;for(var g=0;g<p.length;g+=16){var j=o;var h=n;var f=m;var e=l;o=md5_ff(o,n,m,l,p[g+0],7,-680876936);l=md5_ff(l,o,n,m,p[g+1],12,-389564586);m=md5_ff(m,l,o,n,p[g+2],17,606105819);n=md5_ff(n,m,l,o,p[g+3],22,-1044525330);o=md5_ff(o,n,m,l,p[g+4],7,-176418897);l=md5_ff(l,o,n,m,p[g+5],12,1200080426);m=md5_ff(m,l,o,n,p[g+6],17,-1473231341);n=md5_ff(n,m,l,o,p[g+7],22,-45705983);o=md5_ff(o,n,m,l,p[g+8],7,1770035416);l=md5_ff(l,o,n,m,p[g+9],12,-1958414417);m=md5_ff(m,l,o,n,p[g+10],17,-42063);n=md5_ff(n,m,l,o,p[g+11],22,-1990404162);o=md5_ff(o,n,m,l,p[g+12],7,1804603682);l=md5_ff(l,o,n,m,p[g+13],12,-40341101);m=md5_ff(m,l,o,n,p[g+14],17,-1502002290);n=md5_ff(n,m,l,o,p[g+15],22,1236535329);o=md5_gg(o,n,m,l,p[g+1],5,-165796510);l=md5_gg(l,o,n,m,p[g+6],9,-1069501632);m=md5_gg(m,l,o,n,p[g+11],14,643717713);n=md5_gg(n,m,l,o,p[g+0],20,-373897302);o=md5_gg(o,n,m,l,p[g+5],5,-701558691);l=md5_gg(l,o,n,m,p[g+10],9,38016083);m=md5_gg(m,l,o,n,p[g+15],14,-660478335);n=md5_gg(n,m,l,o,p[g+4],20,-405537848);o=md5_gg(o,n,m,l,p[g+9],5,568446438);l=md5_gg(l,o,n,m,p[g+14],9,-1019803690);m=md5_gg(m,l,o,n,p[g+3],14,-187363961);n=md5_gg(n,m,l,o,p[g+8],20,1163531501);o=md5_gg(o,n,m,l,p[g+13],5,-1444681467);l=md5_gg(l,o,n,m,p[g+2],9,-51403784);m=md5_gg(m,l,o,n,p[g+7],14,1735328473);n=md5_gg(n,m,l,o,p[g+12],20,-1926607734);o=md5_hh(o,n,m,l,p[g+5],4,-378558);l=md5_hh(l,o,n,m,p[g+8],11,-2022574463);m=md5_hh(m,l,o,n,p[g+11],16,1839030562);n=md5_hh(n,m,l,o,p[g+14],23,-35309556);o=md5_hh(o,n,m,l,p[g+1],4,-1530992060);l=md5_hh(l,o,n,m,p[g+4],11,1272893353);m=md5_hh(m,l,o,n,p[g+7],16,-155497632);n=md5_hh(n,m,l,o,p[g+10],23,-1094730640);o=md5_hh(o,n,m,l,p[g+13],4,681279174);l=md5_hh(l,o,n,m,p[g+0],11,-358537222);m=md5_hh(m,l,o,n,p[g+3],16,-722521979);n=md5_hh(n,m,l,o,p[g+6],23,76029189);o=md5_hh(o,n,m,l,p[g+9],4,-640364487);l=md5_hh(l,o,n,m,p[g+12],11,-421815835);m=md5_hh(m,l,o,n,p[g+15],16,530742520);n=md5_hh(n,m,l,o,p[g+2],23,-995338651);o=md5_ii(o,n,m,l,p[g+0],6,-198630844);l=md5_ii(l,o,n,m,p[g+7],10,1126891415);m=md5_ii(m,l,o,n,p[g+14],15,-1416354905);n=md5_ii(n,m,l,o,p[g+5],21,-57434055);o=md5_ii(o,n,m,l,p[g+12],6,1700485571);l=md5_ii(l,o,n,m,p[g+3],10,-1894986606);m=md5_ii(m,l,o,n,p[g+10],15,-1051523);n=md5_ii(n,m,l,o,p[g+1],21,-2054922799);o=md5_ii(o,n,m,l,p[g+8],6,1873313359);l=md5_ii(l,o,n,m,p[g+15],10,-30611744);m=md5_ii(m,l,o,n,p[g+6],15,-1560198380);n=md5_ii(n,m,l,o,p[g+13],21,1309151649);o=md5_ii(o,n,m,l,p[g+4],6,-145523070);l=md5_ii(l,o,n,m,p[g+11],10,-1120210379);m=md5_ii(m,l,o,n,p[g+2],15,718787259);n=md5_ii(n,m,l,o,p[g+9],21,-343485551);o=safe_add(o,j);n=safe_add(n,h);m=safe_add(m,f);l=safe_add(l,e)}
return Array(o,n,m,l)}
function md5_cmn(h,e,d,c,g,f){return safe_add(bit_rol(safe_add(safe_add(e,h),safe_add(c,f)),g),d)}
function md5_ff(g,f,k,j,e,i,h){return md5_cmn((f&k)|((~f)&j),g,f,e,i,h)}
function md5_gg(g,f,k,j,e,i,h){return md5_cmn((f&j)|(k&(~j)),g,f,e,i,h)}
function md5_hh(g,f,k,j,e,i,h){return md5_cmn(f^k^j,g,f,e,i,h)}
function md5_ii(g,f,k,j,e,i,h){return md5_cmn(k^(f|(~j)),g,f,e,i,h)}
function safe_add(a,d){var c=(a&65535)+(d&65535);var b=(a>>16)+(d>>16)+(c>>16);return(b<<16)|(c&65535)}
function bit_rol(a,b){return(a<<b)|(a>>>(32-b))}
