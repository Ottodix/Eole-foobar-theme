'use strict';
const requiredVersionStr = '1.2.1'; function is_compatible(requiredVersionStr) {const requiredVersion = requiredVersionStr.split('.'), currentVersion = utils.Version.split('.'); if (currentVersion.length > 3) currentVersion.length = 3; for (let i = 0; i < currentVersion.length; ++i) if (currentVersion[i] != requiredVersion[i]) return currentVersion[i] > requiredVersion[i]; return true;} if (!is_compatible(requiredVersionStr)) fb.ShowPopupMessage(`Biography requires v${requiredVersionStr}. Current component version is v${utils.Version}.`);

const $ = {
	getDpi : () => {let dpi = 120; try {dpi = $.WshShell.RegRead("HKCU\\Control Panel\\Desktop\\WindowMetrics\\AppliedDPI");} catch (e) {} return Math.max(dpi / 120, 1);},
    isArray : arr => Array.isArray(arr),
    shuffle : arr => {for (let i = arr.length - 1; i >= 0; i--) {const randomIndex = Math.floor(Math.random() * (i + 1)), itemAtIndex = arr[randomIndex]; arr[randomIndex] = arr[i]; arr[i] = itemAtIndex;} return arr;},
    take : (arr, ln) => {if (ln >= arr.length) return arr; else arr.length = ln > 0 ? ln : 0; return arr;},
	WshShell : new ActiveXObject('WScript.Shell')
}

const s = {
    browser : (c, b) => {if (!s.run(c)) fb.ShowPopupMessage(b ? "Unable to launch your default browser." : "Unable to open windows explorer", "Biography");},
    buildPth : pth => {let result, tmpFileLoc = ""; const pattern = /(.*?)\\/gm; while (result = pattern.exec(pth)) {tmpFileLoc = tmpFileLoc.concat(result[0]); s.create(tmpFileLoc);}},
    clamp : (num, min, max) => {num = num <= max ? num : max; num = num >= min ? num : min; return num;},
    create : fo => {try {if (!s.folder(fo)) s.fs.CreateFolder(fo);} catch (e) {}},
    debounce : (e,r,i) => {var o,u,a,c,v,f,d=0,m=!1,j=!1,n=!0;if("function"!=typeof e)throw new TypeError(FUNC_ERROR_TEXT);function T(i){var n=o,t=u;return o=u=void 0,d=i,c=e.apply(t,n)}function b(i){var n=i-f;return void 0===f||r<=n||n<0||j&&a<=i-d}function l(){var i,n,t=Date.now();if(b(t))return w(t);v=setTimeout(l,(n=r-((i=t)-f),j?Math.min(n,a-(i-d)):n))}function w(i){return v=void 0,n&&o?T(i):(o=u=void 0,c)}function t(){var i,n=Date.now(),t=b(n);if(o=arguments,u=this,f=n,t){if(void 0===v)return d=i=f,v=setTimeout(l,r),m?T(i):c;if(j)return v=setTimeout(l,r),T(f)}return void 0===v&&(v=setTimeout(l,r)),c}return r=parseFloat(r)||0,s.isObject(i)&&(m=!!i.leading,a=(j="maxWait"in i)?Math.max(parseFloat(i.maxWait)||0,r):a,n="trailing"in i?!!i.trailing:n),t.cancel=function(){void 0!==v&&clearTimeout(v),o=f=u=v=void(d=0)},t.flush=function(){return void 0===v?c:w(Date.now())},t}, isObject : function(t) {var e=typeof t;return null!=t&&("object"==e||"function"==e)},
	doc : new ActiveXObject('htmlfile'),
    file : f => s.fs.FileExists(f),
    folder : fo => s.fs.FolderExists(fo),
    fs : new ActiveXObject('Scripting.FileSystemObject'),
    get : function getProp(n, keys, defaultVal) {keys = $.isArray(keys) ? keys : keys.split('.'); n = n[keys[0]]; if (n && keys.length > 1) {return getProp(n, keys.slice(1), defaultVal);} return n === undefined ? defaultVal : n;},
    gr : (w, h, im, func) => {let i = gdi.CreateImage(Math.max(w, 2), Math.max(h, 2)), g = i.GetGraphics(); func(g, i); i.ReleaseGraphics(g); g = null; if (im) return i; else i = null;},
	handle : (focus, ignoreLock) => !p.lock || ignoreLock ? fb.IsPlaying && !focus ? fb.GetNowPlaying() : fb.GetFocusItem() : p.lockHandle,
    htmlParse : (n, prop, match, func) => {
         const ln = n == null ? 0 : n.length, sw = prop ? 0 : 1; let i = 0;
         switch (sw) {
             case 0: while (i < ln) {if (n[i][prop] == match) if (func(n[i]) === true) break; i++;} break;
             case 1: while (i < ln) {if (func(n[i]) === true) break; i++;} break;
        }
    },
    jsonParse : (n, defaultVal, type, keys, isValid) => {
        switch (type) {
            case 'file': try {return JSON.parse(s.open(n));} catch (e) {return defaultVal;} break;
            case 'get': if (isValid) {isValid = isValid.split("|"); if (!isValid.every(v => n.includes(v))) return false;} let data; try {data = JSON.parse(n);} catch (e) {return defaultVal;} if (keys) return s.get(data, keys, defaultVal); return data;
            default: try {return JSON.parse(n);} catch (e) {return defaultVal;} break;
        }
    },
	lastModified : file => {try {return Date.parse(s.fs.GetFile(file).DateLastModified);} catch (e) {}}, // added try catch for rare cases where fileExists yet errors here [SMP not handling some special characters]
    open : f => s.file(f) ? utils.ReadTextFile(f) : '',
    padNumber : (num, len, base) => {if (!base) base = 10; return ('000000' + num.toString(base)).substr(-len);},
    query : (h, q) => {let l = FbMetadbHandleList(); try {l = fb.GetQueryItems(h, q);} catch (e) {} return l;},
    removeDiacritics : str => {const defaultDiacriticsRemovalMap = [{'base':'A', 'letters':/[\u0041\u24B6\uFF21\u00C0\u00C1\u00C2\u1EA6\u1EA4\u1EAA\u1EA8\u00C3\u0100\u0102\u1EB0\u1EAE\u1EB4\u1EB2\u0226\u01E0\u00C4\u01DE\u1EA2\u00C5\u01FA\u01CD\u0200\u0202\u1EA0\u1EAC\u1EB6\u1E00\u0104\u023A\u2C6F]/g}, {'base':'AA','letters':/[\uA732]/g}, {'base':'AE','letters':/[\u00C6\u01FC\u01E2]/g}, {'base':'AO','letters':/[\uA734]/g}, {'base':'AU','letters':/[\uA736]/g}, {'base':'AV','letters':/[\uA738\uA73A]/g}, {'base':'AY','letters':/[\uA73C]/g}, {'base':'B', 'letters':/[\u0042\u24B7\uFF22\u1E02\u1E04\u1E06\u0243\u0182\u0181]/g}, {'base':'C', 'letters':/[\u0043\u24B8\uFF23\u0106\u0108\u010A\u010C\u00C7\u1E08\u0187\u023B\uA73E]/g}, {'base':'D', 'letters':/[\u0044\u24B9\uFF24\u1E0A\u010E\u1E0C\u1E10\u1E12\u1E0E\u0110\u018B\u018A\u0189\uA779]/g}, {'base':'DZ','letters':/[\u01F1\u01C4]/g}, {'base':'Dz','letters':/[\u01F2\u01C5]/g}, {'base':'E', 'letters':/[\u0045\u24BA\uFF25\u00C8\u00C9\u00CA\u1EC0\u1EBE\u1EC4\u1EC2\u1EBC\u0112\u1E14\u1E16\u0114\u0116\u00CB\u1EBA\u011A\u0204\u0206\u1EB8\u1EC6\u0228\u1E1C\u0118\u1E18\u1E1A\u0190\u018E]/g}, {'base':'F', 'letters':/[\u0046\u24BB\uFF26\u1E1E\u0191\uA77B]/g}, {'base':'G', 'letters':/[\u0047\u24BC\uFF27\u01F4\u011C\u1E20\u011E\u0120\u01E6\u0122\u01E4\u0193\uA7A0\uA77D\uA77E]/g}, {'base':'H', 'letters':/[\u0048\u24BD\uFF28\u0124\u1E22\u1E26\u021E\u1E24\u1E28\u1E2A\u0126\u2C67\u2C75\uA78D]/g}, {'base':'I', 'letters':/[\u0049\u24BE\uFF29\u00CC\u00CD\u00CE\u0128\u012A\u012C\u0130\u00CF\u1E2E\u1EC8\u01CF\u0208\u020A\u1ECA\u012E\u1E2C\u0197]/g}, {'base':'J', 'letters':/[\u004A\u24BF\uFF2A\u0134\u0248]/g}, {'base':'K', 'letters':/[\u004B\u24C0\uFF2B\u1E30\u01E8\u1E32\u0136\u1E34\u0198\u2C69\uA740\uA742\uA744\uA7A2]/g}, {'base':'L', 'letters':/[\u004C\u24C1\uFF2C\u013F\u0139\u013D\u1E36\u1E38\u013B\u1E3C\u1E3A\u0141\u023D\u2C62\u2C60\uA748\uA746\uA780]/g}, {'base':'LJ','letters':/[\u01C7]/g}, {'base':'Lj','letters':/[\u01C8]/g}, {'base':'M', 'letters':/[\u004D\u24C2\uFF2D\u1E3E\u1E40\u1E42\u2C6E\u019C]/g}, {'base':'N', 'letters':/[\u004E\u24C3\uFF2E\u01F8\u0143\u00D1\u1E44\u0147\u1E46\u0145\u1E4A\u1E48\u0220\u019D\uA790\uA7A4]/g}, {'base':'NJ','letters':/[\u01CA]/g}, {'base':'Nj','letters':/[\u01CB]/g}, {'base':'O', 'letters':/[\u004F\u24C4\uFF2F\u00D2\u00D3\u00D4\u1ED2\u1ED0\u1ED6\u1ED4\u00D5\u1E4C\u022C\u1E4E\u014C\u1E50\u1E52\u014E\u022E\u0230\u00D6\u022A\u1ECE\u0150\u01D1\u020C\u020E\u01A0\u1EDC\u1EDA\u1EE0\u1EDE\u1EE2\u1ECC\u1ED8\u01EA\u01EC\u00D8\u01FE\u0186\u019F\uA74A\uA74C]/g}, {'base':'OI','letters':/[\u01A2]/g}, {'base':'OO','letters':/[\uA74E]/g}, {'base':'OU','letters':/[\u0222]/g}, {'base':'P', 'letters':/[\u0050\u24C5\uFF30\u1E54\u1E56\u01A4\u2C63\uA750\uA752\uA754]/g}, {'base':'Q', 'letters':/[\u0051\u24C6\uFF31\uA756\uA758\u024A]/g}, {'base':'R', 'letters':/[\u0052\u24C7\uFF32\u0154\u1E58\u0158\u0210\u0212\u1E5A\u1E5C\u0156\u1E5E\u024C\u2C64\uA75A\uA7A6\uA782]/g}, {'base':'S', 'letters':/[\u0053\u24C8\uFF33\u1E9E\u015A\u1E64\u015C\u1E60\u0160\u1E66\u1E62\u1E68\u0218\u015E\u2C7E\uA7A8\uA784]/g}, {'base':'T', 'letters':/[\u0054\u24C9\uFF34\u1E6A\u0164\u1E6C\u021A\u0162\u1E70\u1E6E\u0166\u01AC\u01AE\u023E\uA786]/g}, {'base':'TZ','letters':/[\uA728]/g}, {'base':'U', 'letters':/[\u0055\u24CA\uFF35\u00D9\u00DA\u00DB\u0168\u1E78\u016A\u1E7A\u016C\u00DC\u01DB\u01D7\u01D5\u01D9\u1EE6\u016E\u0170\u01D3\u0214\u0216\u01AF\u1EEA\u1EE8\u1EEE\u1EEC\u1EF0\u1EE4\u1E72\u0172\u1E76\u1E74\u0244]/g}, {'base':'V', 'letters':/[\u0056\u24CB\uFF36\u1E7C\u1E7E\u01B2\uA75E\u0245]/g}, {'base':'VY','letters':/[\uA760]/g}, {'base':'W', 'letters':/[\u0057\u24CC\uFF37\u1E80\u1E82\u0174\u1E86\u1E84\u1E88\u2C72]/g}, {'base':'X', 'letters':/[\u0058\u24CD\uFF38\u1E8A\u1E8C]/g}, {'base':'Y', 'letters':/[\u0059\u24CE\uFF39\u1EF2\u00DD\u0176\u1EF8\u0232\u1E8E\u0178\u1EF6\u1EF4\u01B3\u024E\u1EFE]/g}, {'base':'Z', 'letters':/[\u005A\u24CF\uFF3A\u0179\u1E90\u017B\u017D\u1E92\u1E94\u01B5\u0224\u2C7F\u2C6B\uA762]/g}, {'base':'a', 'letters':/[\u0061\u24D0\uFF41\u1E9A\u00E0\u00E1\u00E2\u1EA7\u1EA5\u1EAB\u1EA9\u00E3\u0101\u0103\u1EB1\u1EAF\u1EB5\u1EB3\u0227\u01E1\u00E4\u01DF\u1EA3\u00E5\u01FB\u01CE\u0201\u0203\u1EA1\u1EAD\u1EB7\u1E01\u0105\u2C65\u0250]/g}, {'base':'aa','letters':/[\uA733]/g}, {'base':'ae','letters':/[\u00E6\u01FD\u01E3]/g}, {'base':'ao','letters':/[\uA735]/g}, {'base':'au','letters':/[\uA737]/g}, {'base':'av','letters':/[\uA739\uA73B]/g}, {'base':'ay','letters':/[\uA73D]/g}, {'base':'b', 'letters':/[\u0062\u24D1\uFF42\u1E03\u1E05\u1E07\u0180\u0183\u0253]/g}, {'base':'c', 'letters':/[\u0063\u24D2\uFF43\u0107\u0109\u010B\u010D\u00E7\u1E09\u0188\u023C\uA73F\u2184]/g}, {'base':'d', 'letters':/[\u0064\u24D3\uFF44\u1E0B\u010F\u1E0D\u1E11\u1E13\u1E0F\u0111\u018C\u0256\u0257\uA77A]/g}, {'base':'dz','letters':/[\u01F3\u01C6]/g}, {'base':'e', 'letters':/[\u0065\u24D4\uFF45\u00E8\u00E9\u00EA\u1EC1\u1EBF\u1EC5\u1EC3\u1EBD\u0113\u1E15\u1E17\u0115\u0117\u00EB\u1EBB\u011B\u0205\u0207\u1EB9\u1EC7\u0229\u1E1D\u0119\u1E19\u1E1B\u0247\u025B\u01DD]/g}, {'base':'f', 'letters':/[\u0066\u24D5\uFF46\u1E1F\u0192\uA77C]/g}, {'base':'g', 'letters':/[\u0067\u24D6\uFF47\u01F5\u011D\u1E21\u011F\u0121\u01E7\u0123\u01E5\u0260\uA7A1\u1D79\uA77F]/g}, {'base':'h', 'letters':/[\u0068\u24D7\uFF48\u0125\u1E23\u1E27\u021F\u1E25\u1E29\u1E2B\u1E96\u0127\u2C68\u2C76\u0265]/g}, {'base':'hv','letters':/[\u0195]/g}, {'base':'i', 'letters':/[\u0069\u24D8\uFF49\u00EC\u00ED\u00EE\u0129\u012B\u012D\u00EF\u1E2F\u1EC9\u01D0\u0209\u020B\u1ECB\u012F\u1E2D\u0268\u0131]/g}, {'base':'j', 'letters':/[\u006A\u24D9\uFF4A\u0135\u01F0\u0249]/g}, {'base':'k', 'letters':/[\u006B\u24DA\uFF4B\u1E31\u01E9\u1E33\u0137\u1E35\u0199\u2C6A\uA741\uA743\uA745\uA7A3]/g}, {'base':'l', 'letters':/[\u006C\u24DB\uFF4C\u0140\u013A\u013E\u1E37\u1E39\u013C\u1E3D\u1E3B\u017F\u0142\u019A\u026B\u2C61\uA749\uA781\uA747]/g}, {'base':'lj','letters':/[\u01C9]/g}, {'base':'m', 'letters':/[\u006D\u24DC\uFF4D\u1E3F\u1E41\u1E43\u0271\u026F]/g}, {'base':'n', 'letters':/[\u006E\u24DD\uFF4E\u01F9\u0144\u00F1\u1E45\u0148\u1E47\u0146\u1E4B\u1E49\u019E\u0272\u0149\uA791\uA7A5]/g}, {'base':'nj','letters':/[\u01CC]/g}, {'base':'o', 'letters':/[\u006F\u24DE\uFF4F\u00F2\u00F3\u00F4\u1ED3\u1ED1\u1ED7\u1ED5\u00F5\u1E4D\u022D\u1E4F\u014D\u1E51\u1E53\u014F\u022F\u0231\u00F6\u022B\u1ECF\u0151\u01D2\u020D\u020F\u01A1\u1EDD\u1EDB\u1EE1\u1EDF\u1EE3\u1ECD\u1ED9\u01EB\u01ED\u00F8\u01FF\u0254\uA74B\uA74D\u0275]/g}, {'base':'oi','letters':/[\u01A3]/g}, {'base':'ou','letters':/[\u0223]/g}, {'base':'oo','letters':/[\uA74F]/g}, {'base':'p','letters':/[\u0070\u24DF\uFF50\u1E55\u1E57\u01A5\u1D7D\uA751\uA753\uA755]/g}, {'base':'q','letters':/[\u0071\u24E0\uFF51\u024B\uA757\uA759]/g}, {'base':'r','letters':/[\u0072\u24E1\uFF52\u0155\u1E59\u0159\u0211\u0213\u1E5B\u1E5D\u0157\u1E5F\u024D\u027D\uA75B\uA7A7\uA783]/g}, {'base':'s','letters':/[\u0073\u24E2\uFF53\u00DF\u015B\u1E65\u015D\u1E61\u0161\u1E67\u1E63\u1E69\u0219\u015F\u023F\uA7A9\uA785\u1E9B]/g}, {'base':'t','letters':/[\u0074\u24E3\uFF54\u1E6B\u1E97\u0165\u1E6D\u021B\u0163\u1E71\u1E6F\u0167\u01AD\u0288\u2C66\uA787]/g}, {'base':'tz','letters':/[\uA729]/g}, {'base':'u','letters':/[\u0075\u24E4\uFF55\u00F9\u00FA\u00FB\u0169\u1E79\u016B\u1E7B\u016D\u00FC\u01DC\u01D8\u01D6\u01DA\u1EE7\u016F\u0171\u01D4\u0215\u0217\u01B0\u1EEB\u1EE9\u1EEF\u1EED\u1EF1\u1EE5\u1E73\u0173\u1E77\u1E75\u0289]/g}, {'base':'v','letters':/[\u0076\u24E5\uFF56\u1E7D\u1E7F\u028B\uA75F\u028C]/g}, {'base':'vy','letters':/[\uA761]/g}, {'base':'w','letters':/[\u0077\u24E6\uFF57\u1E81\u1E83\u0175\u1E87\u1E85\u1E98\u1E89\u2C73]/g}, {'base':'x','letters':/[\u0078\u24E7\uFF58\u1E8B\u1E8D]/g}, {'base':'y','letters':/[\u0079\u24E8\uFF59\u1EF3\u00FD\u0177\u1EF9\u0233\u1E8F\u00FF\u1EF7\u1E99\u1EF5\u01B4\u024F\u1EFF]/g}, {'base':'z','letters':/[\u007A\u24E9\uFF5A\u017A\u1E91\u017C\u017E\u1E93\u1E95\u01B6\u0225\u0240\u2C6C\uA763]/g}]; defaultDiacriticsRemovalMap.forEach(v => {str = str.replace(v.letters, v.base);});return str;},
	removeNulls : o => {const isArray = $.isArray(o); Object.keys(o).forEach(v => {if (o[v].length == 0) isArray ? o.splice(v, 1) : delete o[v]; else if (typeof o[v] == "object") s.removeNulls(o[v]);});},
    replaceAt : (str, pos, chr) => str.substring(0, pos) + chr + str.substring(pos + 1),
    run : (c, w) => {try {typeof w === 'undefined' ? $.WshShell.Run(c) : $.WshShell.Run(c, w); return true;} catch (e) {return false;}},
    save : (fn, txt, bom) => {try {utils.WriteTextFile(fn, txt, bom)} catch (e) {s.trace("error saving: " + fn);}},
	scale : $.getDpi(),
	sortKeys : o => Object.keys(o).sort().reduce((a, c) => (a[c] = o[c], a), {}),
    throttle : (e,i,t) => {var n=!0,r=!0;if("function"!=typeof e)throw new TypeError(FUNC_ERROR_TEXT);return s.isObject(t)&&(n="leading"in t?!!t.leading:n,r="trailing"in t?!!t.trailing:r),s.debounce(e,i,{leading:n,maxWait:i,trailing:r})},
	toRGB : c => [c >> 16 & 0xff, c >> 8 & 0xff, c & 0xff],
    trace : (message, n) => console.log("Biography" + (n ? " Server" : "") + ": " + message),
    value : (num, def, type) => {num = parseFloat(num); if (isNaN(num)) return def; switch (type) {case 0: return num; case 1: if (num !== 1 && num !== 0) return def; break; case 2: if (num > 2 || num < 0) return def; break;} return num;}
}

class PanelProperty {
    constructor(name, default_value) {
		this.name = name;
		this.value = ppt.get(this.name, default_value);
    }

    get() {return this.value;}
	set(new_value) {if (this.value !== new_value) {ppt.set(this.name, new_value); this.value = new_value;}}
}

class PanelProperties {
    constructor() {
        this.name_list = {}; // collision checks only
    }
    init(type, properties, thisArg) {
        switch (type) {
			case 'auto':
                properties.forEach(v => {
                    // this.validate(v); // debug
                    this.add(v);
                });
				break;
			case 'manual':
				properties.forEach(v => thisArg[v[2]] = this.get(v[0], v[1]));
				break;
		}
    }

    validate(item) {
        if (!$.isArray(item) || item.length !== 3 || typeof item[2] !== 'string') {
            throw ('invalid property: requires array: [string, any, string]');
        }
        if (item[2] === 'add') {
            throw ('property_id: '+ item[2] + '\nThis id is reserved');
        }
        if (this[item[2]] != null || this[item[2] + '_internal'] != null) {
            throw ('property_id: '+ item[2] + '\nThis id is already occupied');
        }
        if (this.name_list[item[0]] != null) {
            throw ('property_name: '+ item[0] + '\nThis name is already occupied');
        }
    }

    add(item) {
        this.name_list[item[0]] = 1;

        this[item[2] + '_internal'] = new PanelProperty(item[0], item[1]);

        Object.defineProperty(this, item[2], {
            get() {return this[item[2] + '_internal'].get();},
            set(new_value) {this[item[2] + '_internal'].set(new_value);}
        });
    }

	get(n, v) {return window.GetProperty(`\u200A${n}`, v);}
	set(n, v) {return window.SetProperty(`\u200A${n}`, v);}
}

let properties = [
	[" Fallback  Text  Biography: Heading|No Heading", "Nothing Found|There is no biography to display", "bioFallbackText"],
	[" Fallback  Text  Review: Heading|No Heading", "Nothing Found|There is no review to display", "revFallbackText"],
	[" Heading  Title Format  Album Review [AllMusic]", "$if2(%BIO_ALBUMARTIST%,Artist Unknown) - $if2(%BIO_ALBUM%,Album Unknown)", "amRevHeading"],
	[" Heading  Title Format  Album Review [Last.fm]", "$if2(%BIO_ALBUMARTIST%,Artist Unknown) - $if2(%BIO_ALBUM%,Album Unknown)", "lfmRevHeading"],
	[" Heading  Title Format  Biography [AllMusic]", "$if2(%BIO_ARTIST%,Artist Unknown)", "amBioHeading"],
	[" Heading  Title Format  Biography [Last.fm]", "$if2(%BIO_ARTIST%,Artist Unknown)", "lfmBioHeading"],
	[" Heading  Title Format  Track Review [Last.fm]", "> $if2(%BIO_ARTIST%,Artist Unknown) - $if2(%BIO_TITLE%,Title Unknown)", "lfmTrackHeading"],
	[" Heading Items 0 or 1", "BtnBg,1,BtnName,1,BtnRedLastfm,0,Text,1", "show"],
	[" Heading Metrics +/-", "Gap,0,BottomLinePad,0,BtnSize,0,BtnPad,0", "headerConfig"],
	[" Highlight Colour 0 or 1", "Btn,0,Heading,1,Line,1,Rim,1,Stars,1,Subheadings,1,Text,0", "hl"],
	[" Image Reflection Setting (0-100)", "Strength,14.5,Size,100,Gradient,10", "reflSetup"],
	[" Image Smooth Transition Level (0-100)", 92, "transLevel"],
	[" Layout Internal Padding", 20, "gap"],
	[" Layout Outer Padding Image  Left", 20, "borL"],
	[" Layout Outer Padding Image  Right", 20, "borR"],
	[" Layout Outer Padding Image  Top", 0, "borT"],
	[" Layout Outer Padding Image Bottom", 0, "borB"],
	[" Layout Outer Padding Text  Left", 20, "textL"],
	[" Layout Outer Padding Text  Right", 20, "textR"],
	[" Layout Outer Padding Text  Top", 20, "textT"],
	[" Layout Outer Padding Text Bottom", 20, "textB"],
	[" Menu Items Hide-0 Shift-1 Show-2", "Paste Text From Clipboard,1,Playlists,0,Write Tags to Selected Files,1", "menu_items"],
	[" Overlay Setting", "Strength,84.5%,Gradient,10%,RimWidth,1px", "fadeSetup"],
	[" Rating Position Prefer Heading-1 Text-2", 1, "star"],
	[" Rating Show AllMusic", true, "amRating"],
	[" Rating Show Last.fm", true, "lfmRating"],
	[" Rating Text Name AllMusic", "Album rating", "allmusic_name"],
	[" Rating Text Name Last.fm", "Album rating", "lastfm_name"],
	[" Rating Text Position Auto-0 Embed-1 Own Line-2", 0, "ratingTextPos"],
	[" Scroll Step 0-10 (0 = Page)", 3, "scrollStep"],
	[" Scrollbar Arrow Custom: Icon // Examples", "\uE0A0 // \u25B2 \uE014 \u2B9D \uE098 \uE09C \uE0A0 \u2BC5 \u23EB \u23F6 \u290A \uE018 \uE010 \uE0E4", "arrowSymbol"],
	[" Scrollbar Arrow Custom: Icon: Vertical Offset %", -24, "sbarButPad"],
	[" Scrollbar Colour Grey-0 Blend-1", 1, "sbarCol"],
	[" Scrollbar Narrow Bar Width 2-10 (0 = Default)", 0, "narrowSbarWidth"],
	[" Scrollbar Size", "Bar," + Math.round(11 * s.scale) + ",Arrow," + Math.round(11 * s.scale) + ",Gap(+/-),0,GripMinHeight," + Math.round(20 * s.scale), "sbarMetrics"],
	[" Scrollbar Type Default-0 Styled-1 Themed-2", "0", "sbarType"],
	[" Statistics Show Last.fm Metacritic Score", true, "score"],
	[" Statistics Show Last.fm Scrobbles & Listeners", true, "stats"],
	[" Subheading  [Source]  Text  Biography [AllMusic]: Heading|No Heading", "AllMusic|AllMusic Biography", "amBioSubHead"],
	[" Subheading  [Source]  Text  Biography [Last.fm]: Heading|No Heading", "Last.fm|Last.fm Biography", "lfmBioSubHead"],
	[" Subheading  [Source]  Text  Review [AllMusic]: Heading|No Heading", "AllMusic|AllMusic Review", "amRevSubHead"],
	[" Subheading  [Source]  Text  Review [Last.fm]: Heading|No Heading", "Last.fm|Last.fm Review", "lfmRevSubHead"],
	[" Subheading  [Track Review]  Title Format  [Last.fm]", "> $if2(%BIO_ARTIST%,Artist Unknown) - $if2(%BIO_TITLE%,Title Unknown)", "lfmTrackSubHeading"],
	[" Text Align Always Top", false, "topAlign"],
	[" Touch Step 1-10", 1, "touchStep"],
	[" Zoom Button Size (%)", 100, "zoomBut"],
	[" Zoom Font Size (%)", 100, "zoomFont"],
	[" Zoom Heading Font Size (%)", 115, "zoomHead"],
	["_CUSTOM COLOURS/FONTS: EMPTY = DEFAULT", "R-G-B (any) or R-G-B-A (not Text...), e.g. 255-0-0", "customInfo"],
	["_CUSTOM COLOURS/FONTS: USE", false, "customCol"],
	["_Custom.Font (Name,Size,Style[0-4])", "Segoe UI,16,0", "custFont"],
	["_Custom.Font Heading (Name,Size,Style[0-4])", "", "custHeadFont"],
	["_Custom.Font Icon [Scroll] (Name,Style[0or1])", "Segoe UI Symbol,0", "butCustIconFont"],
	["ADV.Heading BtnName Biography [AllMusic]", "allmusic", "amBioBtn"],
	["ADV.Heading BtnName Biography [Last.fm]", "last.fm", "lfmBioBtn"],
	["ADV.Heading BtnName Review [AllMusic]", "allmusic", "amRevBtn"],
	["ADV.Heading BtnName Review [Last.fm]", "last.fm", "lfmRevBtn"],
	["ADV.Image Blur Background Auto-Fill", false, "blurAutofill"],
	["ADV.Image Blur Background Level (0-100)", 90, "blurTemp"],
	["ADV.Image Blur Background Opacity (0-100)", 30, "blurAlpha"],
	["ADV.Scrollbar Height Always Full", false, "sbarStyle"],
	["ADV.Smooth Duration 0-5000 msec (Max)", "Scroll,500,TouchFlick,3000", "duration"],
	["ADV.Touch Flick Distance 0-10", 0.8, "flickDistance"],
	["SYSTEM.Album History", JSON.stringify([]), "albumHistory"],
	["SYSTEM.Allmusic Alb", true, "allmusic_alb"],
	["SYSTEM.Allmusic Bio", false, "allmusic_bio"],
	["SYSTEM.Artist History", JSON.stringify([]), "artistHistory"],
	["SYSTEM.Artist View", false, "artistView"],
	["SYSTEM.Bio & Rev Same Style", true, "sameStyle"],
	["SYSTEM.Blur Blend Theme", false, "blurBlend"],
	["SYSTEM.Blur Dark Theme", false, "blurDark"],
	["SYSTEM.Blur Light Theme", false, "blurLight"],
	["SYSTEM.Both Bio", false, "bothBio"],
	["SYSTEM.Both Rev", false, "bothRev"],
	["SYSTEM.Button More Items", true, "mul_item"],
	["SYSTEM.Colour Swap", false, "swapCol"],
	["SYSTEM.Cover Border-1 Shadow-2 Both-3 [Dual Mode] ", 0, "covBorderDual"],
	["SYSTEM.Cover Border-1 Shadow-2 Both-3 [Image Only]", 0, "covBorderImgOnly"],
	["SYSTEM.Cover Circular [Dual Mode]", false, "covCircDual"],
	["SYSTEM.Cover Circular [Image Only]", false, "covCircImgOnly"],
	["SYSTEM.Cover Crop [Dual Mode]", false, "covCropDual"],
	["SYSTEM.Cover Crop [Image Only]", false, "covCropImgOnly"],
	["SYSTEM.Cover Load All", false, "loadCovAllFb"],
	["SYSTEM.Cover Load Folder", false, "loadCovFolder"],
	["SYSTEM.Cover Reflection [Dual Mode]", false, "covReflDual"],
	["SYSTEM.Cover Reflection [Image Only]", false, "covReflImgOnly"],
	["SYSTEM.Cover Type", 0, "covType"],
	["SYSTEM.Cycle Item", false, "cycItem"],
	["SYSTEM.Cycle Photo", true, "cycPhoto"],
	["SYSTEM.Cycle Picture", true, "cycPic"],
	["SYSTEM.Cycle Time Item", 45, "cycTimeItem"],
	["SYSTEM.Cycle Time Picture", 15, "cycTimePic"],
	["SYSTEM.Font Size", 16, "baseFontSize"],
	["SYSTEM.Freestyle Custom", JSON.stringify([]), "styles"],
	["SYSTEM.Heading Button Hide-0 Left-1 Right-2", 2, "src"],
	["SYSTEM.Heading Center", false, "hdCenter"],
	["SYSTEM.Heading Line Hide-0 Bottom-1 Center-2", 1, "hdLine"],
	["SYSTEM.Heading Position", 0, "hdRight"],
	["SYSTEM.Heading Style", 2, "headFontStyle"],
	["SYSTEM.Heading", true, "heading"],
	["SYSTEM.Image Align Auto", true, "alignAuto"],
	["SYSTEM.Image Align With Text", false, "textAlign"],
	["SYSTEM.Image Alignment Horizontal", 1, "alignH"],
	["SYSTEM.Image Alignment Vertical", 1, "alignV"],
	["SYSTEM.Image Auto Enlarge", false, "autoEnlarge"],
	["SYSTEM.Image Bar", 0, "imgBar"],
	["SYSTEM.Image Bar Dots", 1, "imgBarDots"],
	["SYSTEM.Image Blur Background Always Use Front Cover", false, "covBlur"],
	["SYSTEM.Image Counter", false, "imgCounter"],
	["SYSTEM.Image Only", false, "img_only"],
	["SYSTEM.Image Reflection Type", 0, "imgReflType"],
	["SYSTEM.Image Smooth Transition", false, "imgSmoothTrans"],
	["SYSTEM.Layout Bio Mode", 0, "bioMode"],
	["SYSTEM.Layout Bio", 0, "bioStyle"],
	["SYSTEM.Layout Dual Style Auto", true, "imgText"],
	["SYSTEM.Layout Image Size 0-1", 0.7, "rel_imgs"],
	["SYSTEM.Layout Rev Mode", 0, "revMode"],
	["SYSTEM.Layout Rev", 0, "revStyle"],
	["SYSTEM.Layout", 0, "style"],
	["SYSTEM.Line Padding", 0, "textPad"],
	["SYSTEM.Lock Bio", false, "lockBio"],
	["SYSTEM.Lock Rev", false, "lockRev"],
	["SYSTEM.Lock Auto", false, "autoLock"],
	["SYSTEM.Overlay Type", 0, "overlayStyle"],
	["SYSTEM.Overlay", JSON.stringify({"name":"Overlay", "imL":0, "imR":0, "imT":0, "imB":0, "txL":0, "txR":0, "txT":0.632, "txB":0}), "overlay"],
	["SYSTEM.Panel Active", true, "panelActive"],
	["SYSTEM.Photo Border-1 Shadow-2 Both-3 [Dual Mode]", 0, "artBorderDual"],
	["SYSTEM.Photo Border-1 Shadow-2 Both-3 [Image Only]", 0, "artBorderImgOnly"],
	["SYSTEM.Photo Circular [Dual Mode]", false, "artCircDual"],
	["SYSTEM.Photo Circular [Image Only]", false, "artCircImgOnly"],
	["SYSTEM.Photo Crop [Dual Mode]", false, "artCropDual"],
	["SYSTEM.Photo Crop [Image Only]", false, "artCropImgOnly"],
	["SYSTEM.Photo Reflection [Dual Mode]", false, "artReflDual"],
	["SYSTEM.Photo Reflection [Image Only]", false, "artReflImgOnly"],
	["SYSTEM.Prefer Focus", false, "focus"],
	["SYSTEM.Scroll: Smooth Scroll", true, "smooth"],
	["SYSTEM.Scrollbar Button Type", 0, "sbarButType"],
	["SYSTEM.Scrollbar Show", 1, "sbarShow"],
	["SYSTEM.Scrollbar Width Bar", 11, "sbarBase_w"],
	["SYSTEM.Scrollbar Windows Metrics", false, "sbarWinMetrics"],
	["SYSTEM.Show Album History", true, "showAlbumHistory"],
	["SYSTEM.Show Artist History", true, "showArtistHistory"],
	["SYSTEM.Show More Tags", true, "showMoreTags"],
	["SYSTEM.Show Similar Artists", true, "showSimilarArtists"],
	["SYSTEM.Show Top Albums", true, "showTopAlbums"],
	["SYSTEM.Summary First", true, "summaryFirst"],
	["SYSTEM.Subheading Source Hide-0 Auto-1 Show-2", 1, "sourceHeading"],
	["SYSTEM.Subheading Source Style", 1, "sourceStyle"],
	["SYSTEM.Subheading Track Hide-0 Auto-1 Show-2", 1, "trackHeading"],
	["SYSTEM.Subheading Track Style", 1, "trackStyle"],
	["SYSTEM.Text Only", false, "text_only"],
	["SYSTEM.Touch Control", false, "touchControl"],
	["SYSTEM.Track Review", 0, "inclTrackRev"],
];
const ppt = new PanelProperties;
ppt.init('auto', properties); properties = undefined;

if (!ppt.get("SYSTEM.Properties Updated", false)) {
	ppt.lfmTrackHeading = "> $if2(%BIO_ARTIST%,Artist Unknown) - $if2(%BIO_TITLE%,Title Unknown)";
	ppt.lfmTrackSubHeading = "> $if2(%BIO_ARTIST%,Artist Unknown) - $if2(%BIO_TITLE%,Title Unknown)";
	ppt.set(" Scrollbar Arrow Custom", null);
	ppt.set(" Text Spacing Pad", null);
	ppt.set("SYSTEM.Properties Updated", true);
} else if (!ppt.get("SYSTEM.Properties Upd", false)) {
	if (ppt.lfmRevHeading == "$if2(%BIO_ALBUMARTIST%,Artist Unknown) - $if2(%BIO_ALBUM%,Album Unknown)") {
		ppt.lfmTrackHeading = ppt.lfmTrackHeading.replace("$if2(%BIO_ARTIST%,Artist Unknown) - $if2(%BIO_TITLE% - Track Review,Title Unknown)", "> $if2(%BIO_ARTIST%,Artist Unknown) - $if2(%BIO_TITLE%,Title Unknown)");
		ppt.lfmTrackSubHeading = ppt.lfmTrackSubHeading.replace("$if2(%BIO_ARTIST%,Artist Unknown) - $if2(%BIO_TITLE% - Track Review,Title Unknown)", "> $if2(%BIO_ARTIST%,Artist Unknown) - $if2(%BIO_TITLE%,Title Unknown)");
	}
	ppt.set("SYSTEM.Properties Upd", true);
}

String.prototype.clean = function() {return this.replace(/[\/\\|:]/g, "-").replace(/\*/g, "x").replace(/"/g, "''").replace(/[<>]/g, "_").replace(/\?/g, "").replace(/^\./, "_").replace(/\.+$/, "").replace(/^\s+|[\n\s]+$/g, "");}
String.prototype.cut = function() {const n = this.split("(")[0].trim(); return n.length > 3 ? n : this;}
String.prototype.regex_escape = function() {return this.replace(/([*+\-?^!:&"~${}()|\[\]\/\\])/g, "\\$1");}
String.prototype.splt = function(n) {switch (n) {case 0: return this.replace(/\s+|^,+|,+$/g, "").split(","); case 1: return this.replace(/^[,\s]+|[,\s]+$/g, "").split(",");}}
String.prototype.strip = function() {return this.replace(/[\.,\!\?\:;'\u2019"\-_\u2010\s+]/g, "").toLowerCase();}
String.prototype.tf_escape = function() {let str = this.replace(/'/g, "''").replace(/[\(\)\[\],%]/g, "'$&'"); if (str.indexOf("$") != -1) {const strSplit = str.split("$"); str = strSplit.join("'$$'");} return str;}
String.prototype.titlecase = function() {
  const smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i; if (this == "N/A") return this;
    return this.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, function(match, index, title) {
    // uncomment for smallWord handling: if (index > 0 && index + match.length !== title.length && match.search(smallWords) > -1 && title.charAt(index - 2) !== ":" && (title.charAt(index + match.length) !== '-' || title.charAt(index - 1) === '-') && title.charAt(index - 1).search(/[^\s-]/) < 0) {return match.toLowerCase();}
    if (match.substr(1).search(/[A-Z]|\../) > -1) return match; return match.charAt(0).toUpperCase() + match.substr(1);
  });
}

const ui = new UserInterface, p = new Panel, name = new Names, alb_scrollbar = new Scrollbar, art_scrollbar = new Scrollbar, but = new Buttons, men = new MenuItems, t = new Text, tag = new Tagger, tb = new TextBox, lib = new Library, img = new Images, timer = new Timers, serv = new Server; window.DlgCode = 0x004;

function UserInterface() {
    const pptCol = [["_Custom.Colour Background", "", "bg", 1], ["_Custom.Colour Overlay Rect & RoundRect", "", "rectOv", 0], ["_Custom.Colour Overlay Rect & RoundRect Rim", "", "rectOvBor", 0], ["_Custom.Colour Text", "", "text", 0], ["_Custom.Colour Text Highlight", "", "text_h", 0], ["_Custom.Colour Transparent Fill", "", "bgTrans", 1]];
    const fadeSetup = ppt.fadeSetup.splt(0), headerConfig = ppt.headerConfig.splt(0), hl = ppt.hl.splt(0), show = ppt.show.splt(0), btn_h = s.value(hl[1], 0, 1), head_h = s.value(hl[3], 1, 1), line_h = s.value(hl[5], 1, 1), rim_h = s.value(hl[7], 1, 1), star_h = s.value(hl[9], 1, 1), subhead_h = s.value(hl[11], 1, 1), text_h = s.value(hl[13], 0, 1);
	if (fadeSetup.length> 2 && fadeSetup[2] == "FadeGradient") {fadeSetup[2] = "Gradient"; ppt.fadeSetup = fadeSetup.toString();}
	if ([0, 1, 2, 3, 16, 18].every(v => v !== ppt.headFontStyle)) ppt.headFontStyle =  2; if (ppt.overlayStyle > 4 || ppt.overlayStyle < 0) ppt.overlayStyle = 0;
    let baseHeadFontSize = 16, headerGapAdjust = s.value(headerConfig[1], 0, 0), headerLnAdjust = s.value(headerConfig[3], 0, 0), tcol = "", tcol_h = "", sbarMetrics = ppt.sbarMetrics.splt(0), style = 1, zoomFontSize = 16, zoomBold = 1;
    this.arc_w = ppt.overlayStyle != 2 && ppt.overlayStyle != 4 ? 0 : s.clamp(s.value(fadeSetup[5], 1, 0), 1, 10); this.arrow_pad = s.value(sbarMetrics[5], 0, 0); this.bg = false; this.blurAlpha = s.clamp(ppt.blurAlpha, 0, 100) / 30; this.blurLevel = ppt.blurBlend ? 91.05 - s.clamp(ppt.blurTemp, 1.05, 90) : s.clamp(ppt.blurTemp * 2, 0, 254); this.BtnBg = s.value(show[1], 1, 1); this.BtnName = s.value(show[3], 1, 1); this.local = typeof conf === 'undefined' ? false : true; this.c_c = this.local && typeof opt_c_c !== 'undefined'; this.col = {}; this.custHeadFont = false; this.dui = window.InstanceType; this.fadeAlpha = s.clamp(255 * (100 - s.value(fadeSetup[1], 14.5, 0)) / 100, 0, 255); this.fadeSlope = s.clamp(s.value(fadeSetup[3], 10, 0) / 10 - 1, -1, 9); this.font = ""; this.font_h = 37; this.fontAwesomeInstalled = utils.CheckFont("FontAwesome"); this.grip_h = s.value(sbarMetrics[7], 12, 0); this.headFont = ""; this.headFont_h = 37; this.heading_h = 56; ppt.hdLine = s.value(ppt.hdLine, 1, 2); this.head_ln_h = 46; this.headText = s.value(show[7], 0, 1); this.l_h = Math.round(1 * s.scale); this.lfmTheme = s.value(show[5], 0, 1); this.messageFont = ""; this.smallFont = ""; if (ppt.narrowSbarWidth != 0) ppt.narrowSbarWidth = s.clamp(ppt.narrowSbarWidth, 2, 10); this.narrowSbarWidth = 2; ppt.sbarCol = s.clamp(ppt.sbarCol, 0, 1); this.sbarCol = ppt.sbarCol; this.src_pad = s.value(headerConfig[7], 0, 0); ppt.src = s.value(ppt.src, 2, 2); this.srcSizeAdjust = s.value(headerConfig[5], 0, 0); this.sourceFont = ""; this.trans = false;

    const chgBrightness = (c, percent) => {c = s.toRGB(c); return RGB(s.clamp(c[0] + (256 - c[0]) * percent / 100, 0, 255), s.clamp(c[1] + (256 - c[1]) * percent / 100, 0, 255), s.clamp(c[2] + (256 - c[2]) * percent / 100, 0, 255));}
    const dim = (c, bg, alpha) => {c = s.toRGB(c); bg = s.toRGB(bg); const r = c[0] / 255, g = c[1] / 255, b = c[2] / 255, a = alpha / 255, bgr = bg[0] / 255, bgg = bg[1] / 255, bgb = bg[2] / 255; let nR = ((1 - a) * bgr) + (a * r), nG = ((1 - a) * bgg) + (a * g), nB = ((1 - a) * bgb) + (a * b); nR = s.clamp(Math.round(nR * 255), 0, 255); nG = s.clamp(Math.round(nG * 255), 0, 255); nB = s.clamp(Math.round(nB * 255), 0, 255); return RGB(nR, nG, nB);}
	const pptColour = () => {pptCol.forEach(v => this.col[v[2]] = set_custom_col(ppt.get(v[0], v[1]), v[3]));}
    const RGBtoRGBA = (rgb, a) => a << 24 | rgb & 0x00FFFFFF;
    const set_custom_col = (c, t) => {if (!ppt.customCol) return ""; c = c.split("-"); let cc = ""; if (c.length != 3 && c.length != 4) return ""; switch (t) {case 0: cc = RGB(c[0], c[1], c[2]); break; case 1: switch (c.length) {case 3: cc = RGB(c[0], c[1], c[2]); break; case 4: cc = RGBA(c[0], c[1], c[2], c[3]); break;} break;} return cc;}
	const getLineCol = type => this.get_blend(ppt.blurDark ? RGB(0, 0, 0) : ppt.blurLight ? RGB(255, 255, 255) : this.col.bg == 0 ? 0xff000000 : this.col.bg, line_h ? tcol_h : tcol, type == 'bottom' || this.blur ? 0.25 : 0.5, false);
    const toRGBA = c => [c >> 16 & 0xff, c >> 8 & 0xff, c & 0xff, c >> 24 & 0xff];

    this.chgBlur = n => {ppt.blurDark = false; ppt.blurBlend = false; ppt.blurLight = false; switch (n) {case 1: ppt.blurDark = true; break; case 2: ppt.blurBlend = true; break; case 3: ppt.blurLight = true; break;} this.blurLevel = ppt.blurBlend ? 91.05 - s.clamp(ppt.blurTemp, 1.05, 90) : s.clamp(ppt.blurTemp * 2, 0, 254); on_colours_changed(true);}
    this.draw = gr => {if (this.bg) gr.FillSolidRect(0, 0, p.w, p.h, this.col.bg)}
    this.get_blend = (c1, c2, f, alpha) => {const nf = 1 - f; let r, g, b, a; switch (true) {case !alpha: c1 = s.toRGB(c1); c2 = s.toRGB(c2); r = c1[0] * f + c2[0] * nf; g = c1[1] * f + c2[1] * nf; b = c1[2] * f + c2[2] * nf; return RGB(Math.round(r), Math.round(g), Math.round(b)); case alpha: c1 = toRGBA(c1); c2 = toRGBA(c2); r = c1[0] * f + c2[0] * nf; g = c1[1] * f + c2[1] * nf; b = c1[2] * f + c2[2] * nf; a = c1[3] * f + c2[3] * nf; return RGBA(Math.round(r), Math.round(g), Math.round(b), Math.round(a));}}
    this.get_selcol = (c, n, bypass) => {if (!bypass) c = s.toRGB(c); const cc = c.map(v => {v /= 255; return v <= 0.03928 ? v /= 12.92 : Math.pow(((v + 0.055 ) / 1.055), 2.4);}); const L = 0.2126 * cc[0] + 0.7152 * cc[1] + 0.0722 * cc[2]; if (L > 0.31) return n ? 50 : RGB(0, 0, 0); else return n ? 200 : RGB(255, 255, 255);}
    this.lines = gr => {if (!this.c_c) return; if (ppt.artistView && !ppt.img_only || !ppt.artistView && !ppt.img_only && t.text) {gr.DrawRect(0, 0, p.w - 1, p.h - 1, 1, RGB(155, 155, 155)); gr.DrawRect(1, 1, p.w - 3, p.h - 3, 1, RGB(0, 0, 0));}}
    this.reset_colors = () => {pptCol.forEach(v => this.col[v[2]] = ""); tcol = ""; tcol_h = ""; this.trans = false;}

    this.get_colors = () => {
        pptColour();
        this.blur = ppt.blurBlend || ppt.blurDark || ppt.blurLight;
        if (ppt.blurDark) {this.col.bg_light = RGBA(0, 0, 0, Math.min(160 / this.blurAlpha, 255)); this.col.bg_dark = RGBA(0, 0, 0, Math.min(80 / this.blurAlpha, 255)); if (ppt.overlayStyle) this.col.blurOv = RGBA(0, 0, 0, 255 - this.fadeAlpha);}
        if (ppt.blurLight) {this.col.bg_light = RGBA(255, 255, 255, Math.min(160 / this.blurAlpha, 255)); this.col.bg_dark = RGBA(255, 255, 255, Math.min(205 / this.blurAlpha, 255)); if (ppt.overlayStyle) this.col.blurOv = RGBA(255, 255, 255, 255 - this.fadeAlpha);}
        this.stars = s.value(ppt.star, 1, 2);
        if ((!ppt.heading || !ppt.src || ppt.hdCenter) && this.stars == 1) this.stars = 2; if (!ppt.amRating && !ppt.lfmRating) this.stars = 0;
        if (this.dui) { // custom colour mapping: DUI colours can be remapped by changing the numbers (0-3)
            if (this.col.bg === "") this.col.bg = window.GetColourDUI(1);
			tcol = window.GetColourDUI(0); tcol_h = window.GetColourDUI(2);
        } else { // custom colour mapping: CUI colours can be remapped by changing the numbers (0-6)
            if (this.col.bg === "") this.col.bg = window.GetColourCUI(3);
			tcol = window.GetColourCUI(0); tcol_h = window.GetColourCUI(2);
        }
        const lightBg = this.get_selcol(this.col.bg == 0 ? 0xff000000 : this.col.bg, true) == 50;
		if (this.col.text === "") tcol = ppt.blurBlend ? chgBrightness(tcol, lightBg ? -10 : 10) : ppt.blurDark ? RGB(255, 255, 255) : ppt.blurLight ? RGB(0, 0, 0) : tcol; else tcol = this.col.text;
		if (this.col.text_h === "") tcol_h = ppt.blurBlend ? chgBrightness(tcol_h, lightBg ? -10 : 10) : ppt.blurDark ? RGB(255, 255, 255) : ppt.blurLight ? RGB(71, 129, 183) : tcol_h; else tcol_h = this.col.text_h;
        if (window.IsTransparent && this.col.bgTrans) {this.bg = true; this.col.bg = this.col.bgTrans}
        if (!window.IsTransparent || this.dui) this.bg = true; if (this.local) {this.trans = c_trans; this.col.bg = c_backcol; tcol = ppt.blurBlend ? chgBrightness(c_textcol, this.get_selcol(c_backcol == 0 ? 0xff000000 : c_backcol, true) == 50 ? -10 : 10) : ppt.blurDark ? RGB(255, 255, 255) : ppt.blurLight ? RGB(0, 0, 0) : c_textcol; tcol_h = ppt.blurBlend ? chgBrightness(c_textcol_h, this.get_selcol(c_backcol == 0 ? 0xff000000 : c_backcol, true) == 50 ? -10 : 10) : ppt.blurDark || !this.bg && this.trans && !ppt.blurLight ? RGB(255, 255, 255) : ppt.blurLight ? RGB(71, 129, 183) : c_textcol_h;}
		if (ppt.swapCol) {const colH = tcol_h; tcol_h = tcol; tcol = colH;}

		this.col.text = !text_h ? tcol : tcol_h;
		this.col.text_h = !text_h ? tcol_h : tcol;
        this.col.btn = btn_h ? tcol_h : tcol; 
		this.col.shadow = this.get_selcol(this.col.text_h, false); this.col.t = this.bg ? this.get_selcol(this.col.bg, true) : 200;
        if (this.stars) {["starOn", "starOff", "starBor"].forEach((v, i) => {
            this.col[v] = i < 2 ? (this.stars == 2 ? RGBtoRGBA(star_h ? tcol : tcol_h, !i ? 232 : 60) : 
			this.bg || !this.bg && !this.trans || ppt.blurDark || ppt.blurLight ? RGBtoRGBA(star_h ? tcol_h : tcol, !i ? 232 : 60) : RGBA(255, 255, 255, !i ? 232 : 60)) : RGBA(0, 0, 0, 0);
        });}
		this.col.bottomLine = getLineCol('bottom');
		this.col.centerLine = getLineCol('center');
		this.col.source = ppt.blurDark ? RGB(240, 240, 240) : !ppt.blurLight && (ppt.sourceStyle == 1 || ppt.sourceStyle == 3) && (ppt.headFontStyle != 1 && ppt.headFontStyle != 3) ? 
		dim(subhead_h ? tcol_h : tcol, !window.IsTransparent ? this.col.bg : 0xff000000, 240) : subhead_h ? tcol_h : tcol;
		this.col.track = ppt.blurDark ? RGB(240, 240, 240) : !ppt.blurLight && (ppt.trackStyle == 1 || ppt.trackStyle == 3) && (ppt.headFontStyle != 1 && ppt.headFontStyle != 3) ? 
		dim(subhead_h ? tcol_h : tcol , !window.IsTransparent ? this.col.bg : 0xff000000, 240) : subhead_h ? tcol_h : tcol;
        if (this.col.rectOv === "") this.col.rectOv = this.col.bg; this.col.rectOv = RGBtoRGBA(this.col.rectOv, 255 - this.fadeAlpha);
        if (this.col.rectOvBor === "") {this.col.rectOvBor = rim_h ? tcol_h : tcol; this.col.rectOvBor = RGBtoRGBA(this.col.rectOvBor, 228);}
        this.col.edBg = (ppt.blurDark ? RGB(0, 0, 0) : ppt.blurLight ? RGB(255, 255, 255) : this.col.bg) & 0x99ffffff;
		this.sbarCol = ppt.blurDark || ppt.blurLight ? 1 : ppt.sbarCol;
        if (!ppt.heading) return;
        this.col.head = head_h ? tcol_h : tcol; ["blend1", "blend2", "blend3"].forEach((v, i) => {
            this.col[v] = ppt.blurBlend ? this.col.btn & RGBA(255, 255, 255, i == 2 ? 40 : 12) : ppt.blurDark || !this.bg && this.trans && !ppt.blurLight ? (i == 2 ? RGBA(255, 255, 255, 50) : RGBA(0, 0, 0, 40)) : ppt.blurLight ? RGBA(0, 0, 0, i == 2 ? 40 : 15) : this.get_blend(this.col.bg == 0 ? 0xff000000 : this.col.bg, this.col.btn, !i ? 0.9 : i == 2 ? 0.87 : (this.blur ? 0.75 : 0.82), false);
        });
        this.col.blend4 = toRGBA(this.col.blend1);
    }
    this.get_colors();

    this.get_font = () => {
        if (ppt.customCol && ppt.custFont.length) {const custFont = ppt.custFont.splt(1); this.font = gdi.Font(custFont[0], Math.round(s.value(custFont[1], 16, 0)), Math.round(s.value(custFont[2], 0, 0)));}
        else if (this.dui) this.font = window.GetFontDUI(3); else this.font = window.GetFontCUI(0);
        if (!this.font) {this.font = gdi.Font("Segoe UI", 16, 0); s.trace("Spider Monkey Panel is unable to use your default font. Using Segoe UI at default size & style instead");}
		if (this.font.Size != ppt.baseFontSize) ppt.zoomFont = 100;
		ppt.baseFontSize = baseHeadFontSize = this.font.Size;
        zoomFontSize = Math.max(Math.round(ppt.baseFontSize * ppt.zoomFont / 100), 1);
		const setSegoeUI = ppt.heading && ppt.headFontStyle > 15 || ppt.sourceHeading && ppt.sourceStyle > 15 || p.inclTrackRev && ppt.trackHeading && ppt.trackStyle > 15;
        if (ppt.customCol && ppt.custHeadFont.length) {const custHeadFont = ppt.custHeadFont.splt(1); baseHeadFontSize = Math.round(s.value(custHeadFont[1], 16, 0)); this.headFont = gdi.Font(custHeadFont[0], baseHeadFontSize, style); style = Math.round(s.value(custHeadFont[2], 3, 0)); this.custHeadFont = true;}
        else {style = ppt.headFontStyle; this.headFont = gdi.Font(!setSegoeUI ? this.font.Name : ppt.headFontStyle < 16 ? "Segoe UI" : "Segoe UI Semibold", this.font.Size, style);}
		zoomBold = style != 1 && style != 16 && style != 18 ? 1 : 1.5;
        this.font = gdi.Font(!setSegoeUI ? this.font.Name : "Segoe UI", zoomFontSize, this.font.Style);
        this.headFont = gdi.Font(this.headFont.Name, Math.max(Math.round(baseHeadFontSize * ppt.zoomFont / 100 * (100 + ((ppt.zoomHead - 100) / zoomBold)) / 100), 1), style);
        headerGapAdjust = s.clamp(headerGapAdjust, -ppt.gap * 2, this.font.Size * 5); headerLnAdjust = s.clamp(headerLnAdjust, -ppt.gap, this.font.Size * 5);
        ppt.zoomFont = Math.round(zoomFontSize / ppt.baseFontSize * 100);
        this.sourceFont = gdi.Font(!setSegoeUI ? this.font.Name : ppt.sourceStyle < 16 ? "Segoe UI" : "Segoe UI Semibold", this.font.Size, ppt.sourceStyle);
		this.trackFont = gdi.Font(!setSegoeUI ? this.font.Name : ppt.trackStyle < 16 ? "Segoe UI" : "Segoe UI Semibold", this.font.Size, ppt.trackStyle);
		this.messageFont = gdi.Font(this.font.Name, this.font.Size * 1.5, 1);
		this.smallFont = gdi.Font(this.font.Name, Math.round(this.font.Size * 12 / 14), this.font.Style);
		this.narrowSbarWidth = ppt.narrowSbarWidth == 0 ? s.clamp(Math.floor(this.font.Size / 7), 2, 10) : ppt.narrowSbarWidth;
        if (this.local) {this.font = c_font; this.sourceFont = gdi.Font(this.font.Name, this.font.Size, ppt.sourceStyle); this.trackFont = gdi.Font(this.font.Name, this.font.Size, ppt.trackStyle); this.messageFont = gdi.Font(this.font.Name, this.font.Size * 1.5, 1); if (ppt.sbarShow) {this.sbarType = 0; this.sbar_w = c_scr_w; this.scr_but_w = this.sbar_w + 1; this.but_h = this.sbar_w + 1; this.sbar_sp = this.sbar_w + 1;}}
        this.calc_text(); p.sizes(); but.create_stars(); t.get_widths(); t.art_calc(); t.alb_calc();
    }

    this.calc_text = () => {
        s.gr(1, 1, false, g => {
            this.font_h = Math.round(g.CalcTextHeight("String", this.font) + ppt.textPad);
            this.headFont_h = g.CalcTextHeight("String", this.headFont);
        });
        this.head_ln_h = ppt.heading ? Math.round(this.headFont_h * (ppt.hdLine == 1 ? 1.25 : 1.1) + (ppt.hdLine == 1 ? headerLnAdjust : 0)) : 0;
        this.heading_h = ppt.heading ? Math.round(this.head_ln_h + (ppt.gap * (ppt.hdLine == 1 ? 0.75 : 0.25)) + headerGapAdjust) : 0;
    }

    this.wheel = step => {
        if (!p || (ppt.mul_item && but.btns["mt"] && but.btns["mt"].trace(p.m_x, p.m_y)) || !p.text_trace) return;
        if (utils.IsKeyPressed(0x11)) {
            if (ppt.heading && but.btns["src"].trace(p.m_x, p.m_y)) {
                ppt.zoomHead = s.clamp(ppt.zoomHead += step * 5, 25, 400);
                this.headFont = gdi.Font(this.headFont.Name, Math.max(Math.round(baseHeadFontSize * zoomFontSize / ppt.baseFontSize * (100 + ((ppt.zoomHead - 100) / zoomBold)) / 100), 1), style);
            } else {
                zoomFontSize += step; zoomFontSize = Math.max(zoomFontSize, 1);
                this.font = gdi.Font(this.font.Name, zoomFontSize, this.font.Style);
                this.headFont = gdi.Font(this.headFont.Name, Math.max(Math.round(baseHeadFontSize * zoomFontSize / ppt.baseFontSize * (100 + ((ppt.zoomHead - 100) / zoomBold)) / 100), 1), style);
                this.sourceFont = gdi.Font(this.sourceFont.Name, zoomFontSize, ppt.sourceStyle);
				this.trackFont = gdi.Font(this.trackFont.Name, zoomFontSize, ppt.trackStyle);
                this.messageFont = gdi.Font(this.font.Name, zoomFontSize * 1.5, 1);
				this.smallFont = gdi.Font(this.font.Name, Math.round(zoomFontSize * 12 / 14), this.font.Style);
				this.narrowSbarWidth = ppt.narrowSbarWidth == 0 ? s.clamp(Math.floor(zoomFontSize / 7), 2, 10) : ppt.narrowSbarWidth;
            }
            this.calc_text(); but.create_stars(); t.get_widths(); window.Repaint(); ppt.zoomFont = Math.round(zoomFontSize / ppt.baseFontSize * 100); t.toggle(13);
        }
        if (utils.IsKeyPressed(0x10) && ppt.style > 3) {
            this.fadeAlpha += (-step * 5); this.fadeAlpha = s.clamp(this.fadeAlpha, 0, 255);
            ppt.fadeSetup = "Strength," + Math.round((255 - this.fadeAlpha) / 2.55) + "%,FadeGradient," + fadeSetup[3] + ",RimWidth," + fadeSetup[5];
            this.get_colors(); img.resetFade = true; if (!ppt.overlayStyle) {img.adjustMode = true; if (ppt.artistView && ppt.cycPhoto) img.clear_a_rs_cache(); if (!p.art_ix && ppt.artistView || !p.alb_ix && !ppt.artistView) img.get_images(); else img.get_multi(p.art_ix, p.alb_ix);} else t.paint();
        }
    }

	this.sbarSet = () => {
		this.sbarType = s.value(ppt.sbarType.replace(/\s+/g, "").charAt(), 0, 2); if (this.sbarType == 2)  ppt.sbarType = "2 // Scrollbar Arrow Settings N/A For Themed"; else ppt.sbarType = "" + this.sbarType + "";
		if (this.sbarType == 2) {this.theme = window.CreateThemeManager("scrollbar"); s.gr(21, 21, false, g => {try {this.theme.SetPartAndStateID(6, 1); this.theme.DrawThemeBackground(g, 0, 0, 21, 50); for (let k = 0; k < 3; k++) {this.theme.SetPartAndStateID(3, k + 1); this.theme.DrawThemeBackground(g, 0, 0, 21, 50);} for (let k = 0; k < 3; k++) {this.theme.SetPartAndStateID(1, k + 1); this.theme.DrawThemeBackground(g, 0, 0, 21, 21);}} catch (e) {this.sbarType = 1; ppt.sbarType = "" + 1 + "";}});}
		this.arrow_pad = s.value(sbarMetrics[5], 0, 0);
		this.sbar_w = s.clamp(s.value(sbarMetrics[1], 11, 0), 0, 400); ppt.sbarBase_w = s.clamp(ppt.sbarBase_w, 0, 400);
		if (this.sbar_w != ppt.sbarBase_w) {this.scr_but_w = Math.min(s.value(sbarMetrics[3], 11, 0), this.sbar_w, 400); ppt.sbarMetrics = "Bar," + this.sbar_w +",Arrow," + this.scr_but_w + ",Gap(+/-)," + this.arrow_pad + ",GripMinHeight," + this.grip_h;} else {this.scr_but_w = s.clamp(s.value(sbarMetrics[3], 11, 0), 0, 400); this.sbar_w = s.clamp(this.sbar_w, this.scr_but_w, 400); ppt.sbarMetrics = "Bar," + this.sbar_w +",Arrow," + this.scr_but_w + ",Gap(+/-)," + this.arrow_pad + ",GripMinHeight," + this.grip_h;}
		ppt.sbarBase_w = this.sbar_w;
			let themed_w = 21; try {themed_w = utils.GetSystemMetrics(2);} catch (e) {};
			if (ppt.sbarWinMetrics) {
				this.sbar_w = themed_w;
				this.scr_but_w = this.sbar_w;
			}
			if (!ppt.sbarWinMetrics && this.sbarType == 2) this.sbar_w = Math.max(this.sbar_w, 12);
			if (!ppt.sbarShow) this.sbar_w = 0; this.but_h = this.sbar_w + (this.sbarType != 2 ? 1 : 0);
			if (this.sbarType != 2) {
				if (ppt.sbarButType || !this.sbarType && this.scr_but_w < Math.round(15 * s.scale)) this.scr_but_w += 1;
				else if (this.sbarType == 1 && this.scr_but_w < Math.round(14 * s.scale)) this.arrow_pad += 1;
			}
			const sp = this.sbar_w - this.scr_but_w < 5 || this.sbarType == 2 ? Math.round(1 * s.scale) : 0;
			this.sbar_sp = this.sbar_w ? this.sbar_w + sp : 0;
			this.arrow_pad = s.clamp(-this.but_h / 5, this.arrow_pad, this.but_h / 5);
	}; this.sbarSet();
	
	this.updSbar = () => {
		if (ppt.sameStyle) {this.sbarSet(); but.setSbarIcon(); alb_scrollbar.active = true; art_scrollbar.active = true; ui.get_font(); 
		alb_scrollbar.setCol(); art_scrollbar.setCol(); but.create_images(); but.create_mt(); but.refresh(true); alb_scrollbar.resetAuto(); art_scrollbar.resetAuto(); t.toggle(12);} else window.Reload();
	}
	
	this.set = (n, i) => {
		switch (n) {
			case 'lineSpacing': const ns = utils.InputBox(window.ID, "Enter number to pad line height\n\n0 or higher", "Line Spacing", ppt.textPad); if (!ns || ns == ppt.textPad) return false; ppt.textPad = Math.round(ns); if (isNaN(ppt.textPad)) ppt.textPad = 0; ppt.textPad = s.clamp(ppt.textPad, 0, 100); this.updSbar(); break;
			case 'sbarButType': ppt.sbarButType = i; this.updSbar(); break;
			case 'sbarMetrics': ppt.sbarWinMetrics = !ppt.sbarWinMetrics; this.updSbar(); break;
			case 'sbarType': this.sbarType = i; if (this.sbarType == 2)  ppt.sbarType = "2 // Scrollbar Arrow Settings N/A For Themed"; else ppt.sbarType = ppt.sbarType = "" + i + "";  this.updSbar(); break;
			case 'scrollbar': ppt.sbarShow = i; this.updSbar(); break;
		}
	}
}

function Bezier(){const i=4,c=.001,o=1e-7,v=10,l=11,s=1/(l-1),n=typeof Float32Array==="function";function e(r,n){return 1-3*n+3*r}function u(r,n){return 3*n-6*r}function a(r){return 3*r}function w(r,n,t){return((e(n,t)*r+u(n,t))*r+a(n))*r}function y(r,n,t){return 3*e(n,t)*r*r+2*u(n,t)*r+a(n)}function h(r,n,t,e,u){let a,f,i=0;do{f=n+(t-n)/2;a=w(f,e,u)-r;if(a>0){t=f}else{n=f}}while(Math.abs(a)>o&&++i<v);return f}function A(r,n,t,e){for(let u=0;u<i;++u){const a=y(n,t,e);if(a===0){return n}const f=w(n,t,e)-r;n-=f/a}return n}function f(r){return r}function bezier(i,t,o,e){if(!(0<=i&&i<=1&&0<=o&&o<=1)){throw new Error("Bezier x values must be in [0, 1] range")}if(i===t&&o===e){return f}const v=n?new Float32Array(l):new Array(l);for(let r=0;r<l;++r){v[r]=w(r*s,i,o)}function u(r){const e=l-1;let n=0,t=1;for(;t!==e&&v[t]<=r;++t){n+=s}--t;const u=(r-v[t])/(v[t+1]-v[t]),a=n+u*s,f=y(a,i,o);if(f>=c){return A(r,a,i,o)}else if(f===0){return a}else{return h(r,n,n+s,i,o)}}return function r(n){if(n===0){return 0}if(n===1){return 1}return w(u(n),t,e)}} this.scroll = bezier(0.25, 0.1, 0.25, 1); this.full = this.scroll; this.step = this.scroll; this.bar = bezier(0.165,0.84,0.44,1); this.barFast = bezier(0.19, 1, 0.22, 1); this.inertia = bezier(0.23, 1, 0.32, 1);}; const ease = new Bezier;
function on_colours_changed(clear) {ui.reset_colors(); ui.get_colors(); alb_scrollbar.setCol(); art_scrollbar.setCol(); img.create_images(); but.create_images(); but.create_mt(); but.refresh(true); alb_scrollbar.resetAuto(); art_scrollbar.resetAuto(); if (ui.headFont && ui.headFont.Size) but.create_stars(); if (ppt.blurBlend || clear) {img.clear_rs_cache(); img.get_images();} t.paint();}
function on_font_changed() {ui.get_font(); alb_scrollbar.reset(); art_scrollbar.reset(); alb_scrollbar.resetAuto(); art_scrollbar.resetAuto(); t.on_size(); img.on_size(); window.Repaint();}

function Panel() {
    const bio_sim = [], id = {alb: "", alb_o: "", artist: "", artist_o: "", lockAlb: "", lockArt: "",   tr: "", tr_o: ""}, inBio = [false, false, true, true, true, false, false], inRev = [true, true, false, false, false, true, true], q = n => n.split("").reverse().join(""), sbarStyle = !ppt.sbarStyle ? 2 : 0, t_l = ppt.textL + ui.arc_w, t_t = ppt.textT + ui.arc_w;
    let alb_top = [], albumHistory = [], artFieldsArr = [], artistHistory = [], calc = true, enabled = 0, enlarged_img = false, history_a = "", history_aa_l = "", init_albums = [], init_artists = [], i = 0, j = 0, langSetOK = false, nn = 0, t_r = ppt.textR + ui.arc_w, t_b = ppt.textB + ui.arc_w, txt_sp = 0;
    this.alb_ix = 0; this.albums = []; this.albumsUniq = []; this.arc = 10; this.art_ix = 0; this.artistHistory = s.jsonParse(ppt.artistHistory, []); this.albumHistory = s.jsonParse(ppt.albumHistory, []); this.artists = []; this.artistsUniq = []; this.bor_l = ppt.borL; this.bor_r = ppt.borR; this.bor_t = ppt.borT; this.bor_b = ppt.borB; this.calcText = false; this.clicked = false; this.clip = false; this.covView = 1; this.cycTimeItem = Math.max(ppt.cycTimeItem, 30); this.h = 0; this.iBoxL = 0; this.iBoxT = 0; this.iBoxH = 100; this.iBoxW = 100; this.im_l = 0; this.im_r = 100; this.im_t = 0; this.im_b = 100; this.img_l = 20; this.img_r = 20; this.img_t = 0; this.img_b = 0; this.imgs = 0; this.imgText = !ppt.imgText; this.inclTrackRev = ppt.inclTrackRev; this.langArr = ["EN", "DE", "ES", "FR", "IT", "JA", "PL", "PT", "RU", "SV", "TR", "ZH"]; this.last_pressed_coord = {x: -1, y: -1}; this.lfmLang_ix = 0; this.local = s.file("C:\\check_local\\1450343922.txt"); this.lock = 0; this.lockHandle = null; this.m_x = 0; this.m_y = 0; this.max_y = 0; this.minH = 50; this.moreTags = false; this.mul = {}; this.newStyle = false; this.overlay = s.jsonParse(ppt.overlay, false); this.pth = {}; this.rp_x = 0; this.rp_y = 0; this.rp_w = 0; this.rp_h = 0; this.top_corr = 0; this.sbar_o = 0; this.sbar_x = 0; this.sbar_y = 0; this.sbar_h = 0; this.style_arr = []; this.styles = s.jsonParse(ppt.styles, false); this.sup = {}; this.tag = []; this.tBoxL = 0; this.tBoxT = 0; this.tBoxH = 100; this.tBoxW = 100; this.text_trace = false; this.text_w = 0; this.tx_l = 0; this.tx_r = 100; this.tx_t = 0; this.tx_b = 100; this.tf = {}; this.w = 0; let txt_h = this.h; if (ppt.overlayStyle == 2 || ppt.overlayStyle == 4) {t_r += 1; t_b += 1;};

    const albumsSame = () => {if (ppt.mul_item && this.alb_ix && this.albums.length && JSON.stringify(init_albums) === JSON.stringify(this.albums)) return true; return false;}
    const box = n => n != null ? 'Unescape("' + encodeURIComponent(n + "") + '")' : "Empty";
    const buIni = (name, o, b, bu, f) => {const ln = !f ? o.length : 3; for (let i = b; ln; i++) bu[i] = utils.ReadINI(this.bio_ini, name, o[i].name);}
    const getLangIndex = n => {
        if (n) this.lfmLang = n;
        this.langArr.some((v, i) => {
            if (v.toLowerCase() == this.lfmLang) {this.lfmLang_ix = i; return langSetOK = true;}
        });
    }
    const getSimilar_search_done = (artist, list) => {bio_sim.push({name:artist, similar:list}); this.get_multi(true);}
    const getTopAlb_search_done = (artist, list) => {alb_top.push({name:artist, album:list}); this.get_multi(true);}
    const sort = (data, prop) => {data.sort((a, b) => {a = a[prop].toLowerCase(); b = b[prop].toLowerCase(); return a.localeCompare(b);}); return data;}
    const uniqAlbum = a => {
        const flags = []; let result = [];
        a.forEach(v => {
			const name = v.artist.toLowerCase() + " - " + v.album.toLowerCase();
            if (flags[name]) return;
            result.push(v); flags[name] = true;
        });
        return result = result.filter(v => v.type != "label");
    }
    const uniqArtist = a => {
        const flags = []; let result = [];
        a.forEach(v => {
            if (flags[v.name]) return;
            result.push(v); flags[v.name] = true;
        });
		return result;
    }

    this.artistsSame = () => {if (ppt.mul_item && this.art_ix && this.artists.length && JSON.stringify(init_artists) === JSON.stringify(this.artists)) return true; return false;}
    this.changed = () => {if (ppt.focus || !fb.IsPlaying) this.getData(false, ppt.focus, "multi_tag_bio", 0); else if (this.server) this.getData(false, ppt.focus, "", 1);}
    this.cleanPth = (pth, item, type, a, l, bio) => {
        pth = pth.trim().replace(/\//g, "\\"); if (pth.toLowerCase().includes("%profile%")) {let fbPth = fb.ProfilePath.replace(/'/g, "''").replace(/(\(|\)|\[|\]|%|,)/g, "'$1'"); if (fbPth.includes("$")) {const fbPthSplit = fbPth.split("$"); fbPth = fbPthSplit.join("'$$'");} pth = pth.replace(/%profile%(\\|)/gi, fbPth);}
        switch (type) {
            case 'mul': pth = bio ? tfBio(pth, a, item) : tfRev(pth, a, l, item); break;
			case 'server': pth = this.eval(pth, item, true); break;
            case 'tag': const tf_p = FbTitleFormat(pth); pth = tf_p.EvalWithMetadb(item); break;
            default: pth = this.eval(pth, item); break;
        }
        if (!pth) return ""; if (!pth.endsWith("\\")) pth += "\\"; const c_pos = pth.indexOf(":"); pth = pth.replace(/[\/|:]/g, "-").replace(/\*/g, "x").replace(/"/g, "''").replace(/[<>]/g, "_").replace(/\?/g, "").replace(/\\\./g, "\\_").replace(/\.+\\/, "\\").replace(/\s*\\\s*/g, "\\"); if(c_pos < 3 && c_pos != -1) pth = s.replaceAt(pth, c_pos, ":"); while (pth.includes("\\\\")) pth = pth.replace(/\\\\/g,"\\_\\"); return pth.trim();
    }
	this.click = (x, y) => {
		if (!ppt.autoEnlarge && !this.text_trace && img.trace(x, y) && !ppt.text_only && !ppt.img_only) {
			this.mode(1);
		} else if(!ppt.autoEnlarge && ppt.img_only) {
			this.mode(0); 
			this.move(x,y,false);
		} else {
			if (this.zoom() || x < 0 || y < 0 || x > this.w || y > this.h || but.Dn) return; if (ppt.touchControl && !p.dblClick && Math.sqrt((Math.pow(this.last_pressed_coord.x - x, 2) + Math.pow(this.last_pressed_coord.y - y, 2))) > 3 * s.scale) return; if (t.text && (!ppt.img_only || ppt.text_only) && t.scrollbar_type().onSbar || ppt.heading && t.head && !ppt.img_only && (but.btns["src"] && but.btns["src"].trace(x, y) || but.btns["mt"] && but.btns["mt"].trace(x, y))) return; this.clicked = true; t.logScrollPos(); ppt.artistView = !ppt.artistView; if (ppt.cycPic) {ppt.artistView ? img.photoTimestamp = Date.now() : img.covTimestamp = Date.now();} if (!ppt.sameStyle && (ppt.bioMode != ppt.revMode || ppt.bioStyle != ppt.revStyle)) this.sizes(); t.na = ""; timer.clear(timer.source); ppt.sameStyle || (ppt.bioMode == ppt.revMode && ppt.bioStyle == ppt.revStyle) ? but.check() : but.refresh(true); if (calc) calc = ppt.artistView ? 1 : 2; if (!this.lock && this.multi_new()) {this.get_multi(true); if (!ppt.artistView) t.album_reset();} if (ppt.showAlbumHistory && ppt.artistView && !this.art_ix && this.alb_ix && this.albums[this.alb_ix].type.includes("history")) {t.get_multi(calc, this.art_ix, 0); img.get_images();} else if (!this.art_ix && ppt.artistView) {t.getText(calc); img.get_images();} else if (!this.alb_ix && !ppt.artistView) {p.inclTrackRev != 1 || !ppt.mul_item ? t.getText(calc) : t.get_multi(calc, this.art_ix, this.alb_ix); img.get_images();} else {t.get_multi(calc, this.art_ix, this.alb_ix); img.get_multi(this.art_ix, this.alb_ix);} if (ppt.img_only) img.setCrop(true); if (!ppt.artistView) img.set_chk_arr(null); this.move(x, y, true); t.getScrollPos(); calc = false;
		}
	}
	this.d = parseFloat(q("0000029142")); this.lfm = q("f50a8f9d80158a0fa0c673faec4584be=yek_ipa&");
    this.moveIni = n => {
        const d = new Date, timestamp = [d.getFullYear(), s.padNumber((d.getMonth()+1), 2), s.padNumber(d.getDate(), 2)].join("-") + "_" + [s.padNumber(d.getHours(), 2), s.padNumber(d.getMinutes(), 2), s.padNumber(d.getSeconds(), 2)].join("-");
        try {const fn = yttm + "biography_old_" + timestamp + ".ini"; if (!s.file(fn)) s.fs.MoveFile(this.bio_ini, fn);} catch (e) {if (n) fb.ShowPopupMessage("Unable to reset server settings.\n\nbiography.ini is being used by another program.", "Biography");}
    }
    this.eval = (n, focus, ignoreLock) => {if (!n) return ""; const tfo = FbTitleFormat(n); if (this.ir(focus)) return tfo.Eval(); const handle = s.handle(focus, ignoreLock); return handle ? tfo.EvalWithMetadb(handle) : "";}
	this.focus_load = s.debounce(() => {if (!ppt.img_only) t.on_playback_new_track(); if (!ppt.text_only || ui.blur) img.on_playback_new_track();}, 250, {'leading':true, 'trailing': true});
    this.focus_serv = s.debounce(() => {this.changed();}, 1000);
    this.getData = (force, focus, notify, type) => {
        switch (type) {
            case 0: if (this.server) serv.fetch(force, {ix:this.art_ix, focus:focus, arr:this.artists.slice(0)}, {ix:this.alb_ix, focus:focus, arr:this.albums.slice(0)}); else window.NotifyOthers(notify, [{ix:this.art_ix, focus:focus, arr:this.artists.slice(0)}, {ix:this.alb_ix, focus:focus, arr:this.albums.slice(0)}]); break;
            case 1: serv.fetch(force, {ix:this.art_ix, focus:focus, arr:this.artists.slice(0)}, {ix:this.alb_ix, focus:focus, arr:this.albums.slice(0)}); break;}
    }
    this.getPth = (sw, focus, artist, album, stnd, supCache, a, aa, l, src, basic, server) => {
		let fo, pth;
        switch (sw) {
            case 'bio':
                if (stnd === "") stnd = std(this.art_ix, this.artists);
				if (server) fo = stnd ? this.cleanPth(this.pth[src], focus, 'server') : this.cleanPth(this.mul[src], focus, 'mul', artist, "", 1);
				else fo = stnd && !this.lock ? this.cleanPth(this.pth[src], focus) : this.cleanPth(this.mul[src], focus, 'mul', artist, "", 1);
                pth = fo + a + ".txt";
                if (!stnd && supCache && !s.file(pth)) fo = this.cleanPth(this.sup[src], focus, 'mul', artist, "", 1); pth = fo + a + ".txt";
                if (basic) return {fo:fo, pth:pth}; else return [fo, pth, a ? true : false, s.file(pth)];
            case 'rev':
                if (stnd === "") stnd = std(this.alb_ix, this.albums); if (!stnd) aa = a;
				if (server) fo = stnd ? this.cleanPth(this.pth[src], focus, 'server') : this.cleanPth(this.mul[src], focus, 'mul', artist, album, 0);
				else fo = stnd && !this.lock ? this.cleanPth(this.pth[src], focus) : this.cleanPth(this.mul[src], focus, 'mul', artist, album, 0);
				pth = fo + aa + " - " + l + ".txt";
                if (!stnd && supCache && !s.file(pth)) fo = this.cleanPth(this.sup[src], focus, 'mul', artist, album, 0); pth = fo + aa + " - " + l + ".txt";
                if (basic) return {fo:fo, pth:pth}; else return [fo, pth, aa && l ? true : false, s.file(pth)];
            case 'track':
                fo = this.cleanPth(this.mul[src], focus, 'mul', artist, album, 0); pth = fo + a + " - " + l + ".json";
                if (basic) return {fo:fo, pth:pth}; else return [fo, pth, a ? true : false, s.file(pth)];
            case 'cov':
                fo = this.cleanPth(this.pth.imgCov, focus, 'server'); pth = fo + this.eval(this.pth.imgCovFn, focus, true).clean();
                return {fo:fo, pth:pth};
            case 'img':
                fo = this.cleanPth(this.mul.imgRev, focus, 'mul', artist, album, 0); const fn = (artist + " - " + album).clean(); pth = fo + fn;
                if (typeof supCache === 'undefined') return {fo:fo, fn:fn, pth:pth};
                const pe = [fo]; if (supCache) pe.push(this.cleanPth(this.sup.imgRev, focus, 'mul', artist, album, 0)); return {pe:pe, fe:fn}
        }
    }
    const ini = (name, o, prop, b, space, f) => {const ln = !f ? o.length : 3; for (let i = b; i < ln; i++) utils.WriteINI(this.bio_ini, name, o[i].name, o[i][prop] + (space ? (!f ? (i == o.length - 1 ? "\r\n" : "") : (i == 2 ? "\r\n" : "")) : ""));}
    const ir_focus = () => {if (this.lock) return true; const fid = plman.ActivePlaylist.toString() + plman.GetPlaylistFocusItemIndex(plman.ActivePlaylist).toString(), np = plman.GetPlayingItemLocation(); let pid = -2; if (np.IsValid) pid = plman.PlayingPlaylist.toString() + np.PlaylistItemIndex.toString(); return fid == pid;}
    const std = (a, b) => !a || a + 1 > b.length;
    const tfBio = (n, a, focus) => {n = n.replace(/((\$if|\$and|\$or|\$not|\$xor)(|\d)\(|\[)[^$%]*%bio_artist%/gi, "$&#@!%path%#@!").replace(/%bio_artist%/gi, a.tf_escape()).replace(/%bio_album%/gi, this.tf.l).replace(/%bio_title%/gi, this.tf.t); n = this.eval(n, focus); n = n.replace(/#@!.*?#@!/g, ""); return n;}
    const tfRev = (n, aa, l, focus) => {n = n.replace(/((\$if|\$and|\$or|\$not|\$xor)(|\d)\(|\[)[^$%]*(%bio_albumartist%|%bio_album%)/gi, "$&#@!%path%#@!").replace(/%bio_albumartist%/gi, aa.tf_escape()).replace(/%bio_album%/gi, l.tf_escape()).replace(/%bio_title%/gi, this.tf.t); n = this.eval(n, focus); n = n.replace(/#@!.*?#@!/g, ""); return n;}
	this.inactivate = () => {ppt.panelActive = !ppt.panelActive; window.NotifyOthers("status_bio", ppt.panelActive); window.Reload();}
    this.ir = focus => fb.IsPlaying && fb.PlaybackLength <= 0 && (!focus || ir_focus());
    this.leave = () => {if (!ppt.autoEnlarge || men.right_up) return; if (ppt.img_only) {this.mode(0); enlarged_img = false;}}
	this.logAlbumHistory = (aa, l) => {if (aa != "Artist Unknown" && l != "Album Unknown") this.albumHistory.unshift({artist: aa, album: l, type: "history"}); this.albumHistory = uniqAlbum(this.albumHistory); if (this.albumHistory.length > 20) this.albumHistory.length = 20; ppt.albumHistory = JSON.stringify(this.albumHistory);}
	this.logArtistHistory = a => {if (a != "Artist Unknown") this.artistHistory.unshift({name: a, field: "", type: "history"}); this.artistHistory = uniqArtist(this.artistHistory); if (this.artistHistory.length > 20) this.artistHistory.length = 20; ppt.artistHistory = JSON.stringify(this.artistHistory);}
	this.mbtn_up = (x, y, menuLock) => {if (x < 0 || y < 0 || x > this.w || y > this.h) return; if (ppt.mul_item && (but.btns["mt"].trace(x, y) || menuLock)) {let mArtist = ppt.artistView && this.art_ix; if (!this.lock && !mArtist) img.artist_reset(); if (!this.lock) {id.lockArt = this.eval(artFieldsArr, ppt.focus); id.lockAlb = name.albID(ppt.focus, 'full') + (this.inclTrackRev ? name.trackID(ppt.focus) : ""); this.lockHandle = s.handle(ppt.focus); img.set_id(); img.albFolder = p.cleanPth(p.albCovFolder, ppt.focus);} this.lock = this.lock == 0 || menuLock ? 1 : 0; t.curHeadingID = this.lock ? t.headingID() : ""; if (!this.lock && (ppt.artistView && id.lockArt != this.eval(artFieldsArr, ppt.focus) || !ppt.artistView && id.lockAlb != name.albID(ppt.focus, 'full') + (this.inclTrackRev ? name.trackID(ppt.focus) : ""))) {t.on_playback_new_track(true); img.on_playback_new_track(true);} but.check(); t.paint(); return;} switch (true) {case (ppt.img_only || ppt.text_only): this.mode(0); break; case !this.text_trace && img.trace(x, y): this.mode(1); break; case this.text_trace: this.mode(2); break;} this.move(x, y, true);}
    this.metadb_serv = s.debounce(() => {this.changed();}, 500);
    this.multi_new = () => {switch (true) {case ppt.artistView: id.artist_o = id.artist; id.artist = this.eval(artFieldsArr, ppt.focus); if (!ppt.mul_item) return true; else return id.artist != id.artist_o || !this.artists.length || !this.art_ix; break; case !ppt.artistView: id.alb_o = id.alb; id.alb = name.albID(ppt.focus, 'simple'); if (this.inclTrackRev) {id.tr_o = id.tr; id.tr = name.trackID(ppt.focus);} else id.tr_o = id.tr = ""; if (!ppt.mul_item) return true; else return id.alb != id.alb_o || id.tr != id.tr_o || !this.albums.length || !this.alb_ix; break;}}
    this.multi_serv = s.debounce(() => {this.getData(false, ppt.focus, "multi_tag_bio", 0);}, 1500);
    this.move = (x, y, click) => {if (ppt.text_only) this.text_trace = true; else if (ppt.img_only || !t.text) this.text_trace = false; else if (ppt.style < 4) {switch (ppt.style) {case 0: this.text_trace = y > this.img_t + this.imgs; break; case 1: this.text_trace = x < this.w - this.imgs - this.img_r; break; case 2: this.text_trace = y < this.img_t; break; case 3: this.text_trace =  x > this.img_l + this.imgs; break;}} else this.text_trace = y > this.tBoxT && y < this.tBoxT + this.tBoxH && x > this.tBoxL && x < this.tBoxL + this.tBoxW; if (!ppt.autoEnlarge || click || this.zoom()) return; const enlarged_img_o = enlarged_img; enlarged_img = !this.text_trace && img.trace(x, y); if (enlarged_img && !ppt.text_only && !ppt.img_only && !enlarged_img_o) this.mode(1);}
    this.paint = () => window.RepaintRect(this.rp_x, this.rp_y, this.rp_w, this.rp_h);
	this.resetAlbumHistory = () => {this.alb_ix = 0; this.lock = 0; this.albumHistory = []; ppt.albumHistory = JSON.stringify([]); history_aa_l = ""; this.get_multi(true);}
	this.resetArtistHistory = () => {this.art_ix = 0; this.lock = 0; this.artistHistory = []; ppt.artistHistory = JSON.stringify([]); history_a = ""; this.get_multi(true);}
    this.server = true; window.NotifyOthers("not_server_bio", 0);
    this.setBorder = (imgFull, bor, refl) => {if (imgFull) {this.bor_l = this.bor_r = this.bor_b = bor > 1 && !refl ? 10 * s.scale : 0; this.bor_t = 0;} else {this.bor_l = bor < 2 || refl ? ppt.borL : Math.max(ppt.borL, 10 * s.scale); this.bor_r = bor < 2 || refl ? ppt.borR : Math.max(ppt.borR, 10 * s.scale); this.bor_t = ppt.borT; this.bor_b = bor < 2 || refl ? ppt.borB : Math.max(ppt.borB, 10 * s.scale);}}
    this.setCycItem = n => {const ns = utils.InputBox(window.ID, "Enter time in seconds\n\nMinimum = 30 seconds", "Item: Cycle Time", this.cycTimeItem); if (!ns || ns == this.cycTimeItem) return false; this.cycTimeItem = Math.round(ns); if (!this.cycTimeItem || isNaN(this.cycTimeItem)) this.cycTimeItem = 30; this.cycTimeItem = Math.max(this.cycTimeItem, 30); ppt.cycTimeItem = this.cycTimeItem;}
    this.setCycPic = () => {const ns = utils.InputBox(window.ID, "\n\nEnter time in seconds", "Photo: Cycle Time", ppt.cycTimePic); if (!ns || ns == ppt.cycTimePic) return false; ppt.cycTimePic = Math.round(ns); if (!ppt.cycTimePic || isNaN(ppt.cycTimePic)) ppt.cycTimePic = 15; img.delay = Math.min(ppt.cycTimePic, 7) * 1000;}
	this.setSimTagNo = () => {const ns = utils.InputBox(window.ID, "Enter number 0-100 (0 Disables writing the tag)\n\nUp to 6 are read from the biography\nUsing 6+ requires saved lists\n\nSaving auto-enables while 6+\nLists save on playing tracks etc\n", "Set Number of Similar Artists to Write to Tag ", this.tag[8].enabled); if (!ns || ns == this.tag[8].enabled) return false; this.tag[8].enabled = parseFloat(ns); this.updIniTag(8);}
	this.updIniClickAction = n => {utils.WriteINI(this.bio_ini, "MISCELLANEOUS", this.def_tf[9].name, n); window.NotifyOthers("refresh_bio", "refresh_bio");}
    this.updIniLang = n => utils.WriteINI(this.bio_ini, "LASTFM LANGUAGE", this.lang[0].name, n);
    this.updIniTag = n => {enabled = this.tag[n].enabled; if (n < 8) {if (enabled !== 1 && enabled !== 0) enabled = advTag[n].tag;} else {enabled = s.clamp(enabled, 0, 100);} this.tag[n].enabled = enabled; utils.WriteINI(this.bio_ini, "ADVANCED: TAG WRITER", advTag[n].name, enabled); window.NotifyOthers("refresh_bio", "refresh_bio");}
    this.valueIni = (section, key, def, type) => {let n = ""; switch (type) {case 0: n = utils.ReadINI(this.bio_ini, section, key); if (!n) return def; break; case 1: n = parseFloat(utils.ReadINI(this.bio_ini, section, key)); if (n !== 1 && n !== 0) return def; break; case 2: n = parseFloat(utils.ReadINI(this.bio_ini, section, key)); if (isNaN(n)) return def; break;} return n;}
    const yttm = fb.ProfilePath + "yttm\\"; s.create(yttm); this.bio_ini = yttm + "biography.ini";
    this.zoom = () => utils.IsKeyPressed(0x10) || utils.IsKeyPressed(0x11);

    this.def_dn = [
        {name:"Biography [Allmusic] Auto-Fetch", dn:1},
        {name:"Biography [Lastfm] Auto-Fetch", dn:1},
        {name:"Album Review [Allmusic] Auto-Fetch", dn:1},
        {name:"Album Review [Lastfm] Auto-Fetch", dn:1},
        {name:"Image [Artist] Auto-Fetch", dn:1},
        {name:"Image [Review] Auto-Fetch", dn:1}
    ];
    const def_paths = [
        {name:"Album Review [Allmusic] Folder", path:"%profile%\\yttm\\review\\allmusic\\$lower($cut(%BIO_ALBUMARTIST%,1))"},
        {name:"Album Review [Lastfm] Folder",path:"%profile%\\yttm\\review\\lastfm\\$lower($cut(%BIO_ALBUMARTIST%,1))"},
        {name:"Biography [Allmusic] Folder", path:"%profile%\\yttm\\biography\\allmusic\\$lower($cut(%BIO_ARTIST%,1))"},
        {name:"Biography [Lastfm] Folder", path:"%profile%\\yttm\\biography\\lastfm\\$lower($cut(%BIO_ARTIST%,1))"},
        {name:"Image [Artist] Folder", path:"%profile%\\yttm\\art_img\\$lower($cut(%BIO_ARTIST%,1))\\%BIO_ARTIST%"},
        {name:"Image [Review] Folder", path:"%profile%\\yttm\\rev_img\\$lower($cut(%BIO_ALBUMARTIST%,1))\\%BIO_ALBUMARTIST%"}
    ];
    this.cov = [
        {name:"Auto-Save", path:0},
        {name:"Auto-Save Folder", path:"$directory_path(%path%)"},
        {name:"Auto-Save File Name", path:"cover"}
    ];
    const covFolder = {name:"Folder", path:"%profile%\\yttm\\art_img\\$lower($cut(%BIO_ARTIST%,1))\\%BIO_ARTIST%"};
    this.def_tf = [
        {name:"%BIO_ALBUMARTIST%", tf:"$if3($meta(album artist,0),$meta(artist,0),$meta(composer,0),$meta(performer,0))"},
        {name:"%BIO_ARTIST%", tf:"$if3($meta(artist,0),$meta(album artist,0),$meta(composer,0),$meta(performer,0))"},
        {name:"%BIO_ALBUM%", tf:"$meta(album,0)"},
		{name:"%BIO_TITLE%", tf:"$meta(title,0)"},
        {name:"Album Name Auto-Clean", tf:0},
        {name:"Cache Expiry (days: minimum 28)", tf:28},
        {name:"Image [Artist] Initial Fetch Number (1-20)", tf:5},
        {name:"Image [Artist] Auto-Add New", tf:1},
        {name:"Image [Artist] Cache Limit", tf:""},
        {name:"Mouse Left Button Click: Map To Double-Click", tf:0},
        {name:"Search: Include Partial Matches", tf:1},
        {name:"Various Artists", tf:"Various Artists"}
    ];
    this.lang = [
        {name:"Lastfm Language", tf:"EN"},
        {name:"Lastfm Language Fallback To English", tf:0}
    ];
    const advCov = [
        {name:"Image [Cover] Check Custom Paths", path:0},
        {name:"Image [Cover] Custom Path 1 [Full Path Minus Extension]", path:""},
        {name:"Image [Cover] Custom Path 2 [Full Path Minus Extension]", path:""},
        {name:"Image [Cover] Custom Path 3 [Full Path Minus Extension]", path:""},
        {name:"Image [Cover] Custom Path 4 [Full Path Minus Extension]", path:""},
        {name:"Image [Cover] Custom Path 5 [Full Path Minus Extension]", path:""}
    ];
    const advMore = [
        {name:"Use Supplemental Cache", path:0},
        {name:"Supplemental Cache [Use Find>Replace on SAVE paths]", path:"yttm>yttm\\bio_supplemental"},
        {name:"Review Image Quality 0-Medium 1-High", path:0},
        {name:"Similar Artists: Number to Display(0-10)", path:4}
    ];
    const advSimilar = [
        {name:"Save List 0-Never 1-Auto", tag:1},
        {name:"Save Folder", tag:"%profile%\\yttm\\lastfm\\$lower($cut(%BIO_ARTIST%,1))"}
    ];
    const advTag = [
        {name:"Write Tag: Album Genre AllMusic", tag:1},
        {name:"Write Tag: Album Mood AllMusic", tag:1},
        {name:"Write Tag: Album Rating AllMusic", tag:1},
        {name:"Write Tag: Album Theme AllMusic", tag:1},
        {name:"Write Tag: Artist Genre AllMusic", tag:1},
        {name:"Write Tag: Album Genre Last.fm", tag:1},
        {name:"Write Tag: Artist Genre Last.fm", tag:1},
        {name:"Write Tag: Similar Artists Last.fm: Number to Write (0-100)", tag:4},
        {name:"Tag Name: Album Genre AllMusic", tag:"Album Genre AllMusic"},
        {name:"Tag Name: Album Mood AllMusic", tag:"Album Mood AllMusic"},
        {name:"Tag Name: Album Rating AllMusic", tag:"Album Rating AllMusic"},
        {name:"Tag Name: Album Theme AllMusic", tag:"Album Theme AllMusic"},
        {name:"Tag Name: Artist Genre AllMusic", tag:"Artist Genre AllMusic"},
        {name:"Tag Name: Album Genre Last.fm", tag:"Album Genre Last.fm"},
        {name:"Tag Name: Artist Genre Last.fm", tag:"Artist Genre Last.fm"},
        {name:"Tag Name: Similar Artists Last.fm", tag:"Similar Artists Last.fm"}
    ];
    const helpText = "A foobar2000 restart is required for any changes to take effect. Only change entries after the equal signs. Entries have a 255 character limit.\r\n\r\n"
        + "Biography.ini Version A0001\r\n\r\n"
        + "========================================\r\n"
        + "CUSTOMISATION HELP:\r\n\r\nEnter 0 or 1 or as indicated.\r\n\r\n"
        + "AUTO-FETCH:\r\n1 Enable web search for source. Results are cached.\r\n0 Disable web search for source. Existing data cached to disc will be loaded.\r\n\r\n"
        + "NAMES:\r\nUsed in search, folder + file names & headings. %BIO_ALBUMARTIST%, %BIO_ARTIST% and %BIO_ALBUM% define titleformat used for albumartist, artist and album, respectively. Variables are specific to Biography. Change default title formatting if required.\r\n\r\n"
        + "SAVE:\r\nEnter title formatting or absolute paths. Always use the variables %BIO_ALBUMARTIST%, %BIO_ARTIST% or %BIO_ALBUM%, if applicable, to ensure correct functionality (copy style of defaults). The 2 reviews (& 2 biographies) must be saved in different folders. %profile% can be put at the start of the path and resolves to the foobar2000 profile folder or program folder in portable mode. Don't use %path% in save paths - it's incompatible with radio streams etc. As with title formatting, enclose literal ()[]'%$ in single quotes. It is recommended to validate changes by checking save paths of a few files. Trailing \\ not needed. File names are auto generated. To organise by artist instead of source, search documentation for SAVE & paste patterns therein.\r\n\r\n"
        + "COVERS: MUSIC FILES:\r\nEnable auto-save to have music file covers saved to a specified location.\r\n\r\n"
        + "LASTFM LANGUAGE:\r\nEnter language code: EN, DE, ES, FR, IT, JA, PL, PT, RU, SV, TR or ZH, or use \"Sources Menu\". Optional fallback to trying English (EN) server if no results. AllMusic info is only available in English.\r\n\r\n"
        + "MISCELLANEOUS:\r\nImage [Artist] Cache Limit: limits number of images stored to value set. If used with \"Auto-Add New\", newer images are added & older removed to give a fixed number of up-to-date images.\r\n\r\n"
        + "ADVANCED:\r\nCustom cover paths. Most users shouldn't need this feature as covers are auto-loaded via foobar2000 album art reader or from save locations. Enable if required.\r\nSimilar Artists (\"Tagger\" & \"More Menu\"). Up to 4 are read from the biography. Using 5+ requires a saved list. Saving auto-enables by default while either set to 5+.\r\nWrite Tag: sets which tags are available to be written. Enter 0 or 1 or as indicated. Change tag names as required.\r\n***See documentation for full info on advanced items.***"

    let bio_ini = s.open(this.bio_ini); if (s.file(this.bio_ini) && !bio_ini.includes("Version A0001") && !bio_ini.includes("Version A0002")) this.moveIni(); // Check correct ini. Remove & back-up any can't auto-update. Back compatibility: number as A0002.x.x etc to avoid old bios resetting; use A0003 etc to force reset
    if (!s.file(this.bio_ini)) { // No ini: fresh install, reset or unable to auto-update. Create new ini
        utils.WriteINI(this.bio_ini, helpText, "", "=======================================\r\n");
        ini("AUTO-FETCH", this.def_dn, 'dn', 0, 1);
        ini("NAMES", this.def_tf, 'tf', 0, 1, 3);
        ini("SAVE", def_paths, 'path', 0, 1);
        ini("COVERS: MUSIC FILES", this.cov, 'path', 0, 1);
        ini("LASTFM LANGUAGE", this.lang, 'tf', 0, 1);
        ini("MISCELLANEOUS", this.def_tf, 'tf', 4, 1);
        ini("ADVANCED: CUSTOM COVER PATHS", advCov, 'path', 0, 1);
        ini("ADVANCED: MORE MENU ITEMS", advMore, 'path', 0, 1);
        ini("ADVANCED: SIMILAR ARTISTS", advSimilar, 'tag', 0, 1);
        ini("ADVANCED: TAG WRITER", advTag, 'tag', 0, 0);
    }

    bio_ini = s.open(this.bio_ini);
	if (!bio_ini.includes("Version A0002")) { // Update A0001 to A0002
        bio_ini = bio_ini
            .replace("Version A0001", "Version A0002")
            .replace("%path% here -", "%path% in save paths -")
            .replace("specified location.", "specified location.\r\n\r\nCOVERS: CYCLE FOLDER:\r\nEnter folder. Title formatting, %BIO_ALBUMARTIST%, %BIO_ARTIST%, %BIO_ALBUM%, %profile% and absolute paths are supported.")
            .replace("limits number of images stored to value set", "number per artist. Blank = no limit")
			.replace("[LASTFM LANGUAGE]", "[COVERS: CYCLE FOLDER]\r\nFolder=" + utils.ReadINI(this.bio_ini, "SAVE", def_paths[4].name) + "\r\n\r\n[LASTFM LANGUAGE]")
            .replace("written. Enter 0 or 1 or as indicated", "written. Enter 0 or 1 or as indicated, or use \"Write Tags... Menu\"")
            .replace("Write Tag: Similar Artists Last.fm", "Write Tag: Locale Last.fm=1\r\nWrite Tag: Similar Artists Last.fm")
            .replace("Tag Name: Similar Artists Last.fm", "Tag Name: Locale Last.fm=Locale Last.fm\r\nTag Name: Similar Artists Last.fm");
    }
	
	if (!bio_ini.includes("Version A0002.1")) { // Update A0002 to A0002.1
		bio_ini = bio_ini
			.replace("Version A0002", "Version A0002.1")
			.replace(" and %BIO_ALBUM%", ", %BIO_ALBUM% and %BIO_TITLE%")
			.replace("artist and album", "artist, album and title")
			.replace(" or %BIO_ALBUM%", ", %BIO_ALBUM% or %BIO_TITLE")
			.replace(", %BIO_ALBUM%,", ", %BIO_ALBUM%, %BIO_TITLE,")
			.replace("\r\n\r\n[SAVE]", "\r\n" + this.def_tf[3].name + "=" + this.def_tf[3].tf + "\r\n\r\n[SAVE]");
			this.moveIni();
		s.save(this.bio_ini, bio_ini, true);
	}

	if (!bio_ini.includes("Version A0002.1.1")) { // Update A0002.1 to A0002.1.1
		bio_ini = bio_ini
			.replace("Version A0002.1", "Version A0002.1.1")
			.replace("Number to Display(0-10)=4", "Number to Display(0-10)=6")
			.replace("Number to Write (0-100)=4", "Number to Write (0-100)=6")
			.replace("4 are read from the biography. Using 5+ requires a saved list. Saving auto-enables by default while either set to 5+", "6 are read from the biography. Using 7+ requires a saved list. Saving auto-enables by default while either set to 7+")
			this.moveIni();
		s.save(this.bio_ini, bio_ini, true);
	} advTag.splice(7, 0, {name:"Write Tag: Locale Last.fm", tag:1}); advTag.splice(16, 0, {name:"Tag Name: Locale Last.fm", tag:"Locale Last.fm"}); // finalise advTag

    let pthArr = ["amRev", "lfmRev", "amBio", "lfmBio", "imgArt", "imgCov", "imgCovFn", "lfmSim"]; const tfArr = ["aa", "a", "l", "t"]; tfArr.forEach((v, i) => this.tf[v] = this.valueIni("NAMES", this.def_tf[i].name, this.def_tf[i].tf, 0).replace(RegExp(this.def_tf[i].name, "gi"), "")); // replace self
    for (i = 0; i < 4; i++) for (j = 0; j < 4; j++) this.tf[tfArr[i]] = this.tf[tfArr[i]].replace(RegExp(this.def_tf[j].name, "gi"), this.tf[tfArr[j]]); // substitute titleformat

    pthArr.forEach((v, i) => { // standard
        if (i < 5) this.pth[v] = this.valueIni("SAVE", def_paths[i].name, def_paths[i].path, 0);
    });

    pthArr.forEach((v, i) => {
        if (i > 4 && i < 7) this.pth[v] = this.valueIni("COVERS: MUSIC FILES", this.cov[i - 4].name, this.cov[i - 4].path, 0);
    }); this.pth[pthArr[7]] = this.valueIni("ADVANCED: SIMILAR ARTISTS", advSimilar[1].name, advSimilar[1].tag, 0);

    pthArr.forEach(v => { // substitute titleformat
        for (j = 0; j < 4; j++) this.pth[v] = this.pth[v].replace(RegExp(this.def_tf[j].name, "gi"), this.tf[tfArr[j]]);
    });

    this.dblClick = this.valueIni("MISCELLANEOUS", this.def_tf[9].name, this.def_tf[9].tf, 1);
    this.extra = this.valueIni("ADVANCED: CUSTOM COVER PATHS", advCov[0].name, advCov[0].path, 1);
    this.lfmLang = utils.ReadINI(this.bio_ini, "LASTFM LANGUAGE", this.lang[0].name).toLowerCase(); getLangIndex(); if (!langSetOK) this.lfmLang = "en";
    this.rev_img = this.valueIni("AUTO-FETCH", this.def_dn[5].name, this.def_dn[5].dn, 1);
    let similarNo = parseFloat(utils.ReadINI(this.bio_ini, "ADVANCED: MORE MENU ITEMS", advMore[3].name)); similarNo = s.clamp(similarNo, 0, 10);
    this.va = this.valueIni("MISCELLANEOUS", this.def_tf[11].name, this.def_tf[11].tf, 0); this.va = this.va.toLowerCase();

    pthArr = ["amRev", "lfmRev", "amBio", "lfmBio", "imgArt", "imgRev"]; pthArr.forEach((v, i) => { // look up
        this.mul[v] = this.valueIni("SAVE", def_paths[i].name, def_paths[i].path, 0);
        if (inRev[i]) this.mul[v] = this.mul[v].replace(/%BIO_ALBUMARTIST%|%BIO_ARTIST%/gi, "%BIO_ALBUMARTIST%"); // simplify later substitutions + convert case
        if (inBio[i]) this.mul[v] = this.mul[v].replace(/%BIO_ARTIST%|%BIO_ALBUMARTIST%/gi, "%BIO_ARTIST%"); // simplify later substitutions + convert case
    });

    pthArr = ["Cache", "imgRevHQ"]; pthArr.forEach((v, i) => this.sup[v] = this.valueIni("ADVANCED: MORE MENU ITEMS", advMore[i * 2].name, advMore[i * 2].path, 1));

    advTag.forEach((v, i) => {
        if (i < 9) {
            enabled = parseFloat(utils.ReadINI(this.bio_ini, "ADVANCED: TAG WRITER", v.name));
            if (i < 8) {if (enabled !== 1 && enabled !== 0) enabled = v.tag;}
            else {enabled = s.clamp(enabled, 0, 100);}
            nn = this.valueIni("ADVANCED: TAG WRITER", advTag[i + 9].name, advTag[i + 9].tag, 0);
            this.tag[i] = {name:nn, enabled:enabled};
        }
	}); this.lfm_sim = this.valueIni("ADVANCED: SIMILAR ARTISTS", advSimilar[0].name, advSimilar[0].tag, 1); if (this.lfm_sim && similarNo < 7 && this.tag[8].enabled < 7) this.lfm_sim = 0; if (this.local) {this.lfm_sim = 0; this.sup.imgRevHQ = 1; this.sup.Cache = 1;}

    if (this.sup.Cache) { // supplemental
        pthArr = ["amRev", "lfmRev", "amBio", "lfmBio", "imgArt", "imgRev"];
        const arr1 = [], arr2 = [], replace = utils.ReadINI(this.bio_ini, "ADVANCED: MORE MENU ITEMS", advMore[1].name).replace(/>/g, "|").split("|");
        replace.forEach((v, i) => {
            if (i % 2 == 0) arr1.push(v.trim() || "yttm"); else arr2.push(v.trim() || "yttm\\bio_supplemental");
        });
        pthArr.forEach((v, i) => {
            this.sup[v] = this.valueIni("SAVE", def_paths[i].name, def_paths[i].path, 0);
            if (arr1.length == arr2.length) for (j = 0; j < arr1.length; j++) this.sup[v] = this.sup[v].replace(RegExp(arr1[j], "gi"), arr2[j]);
            if (inRev[i]) this.sup[v] = this.sup[v].replace(/%BIO_ALBUMARTIST%|%BIO_ARTIST%/gi, "%BIO_ALBUMARTIST%");
            if (inBio[i]) this.sup[v] = this.sup[v].replace(/%BIO_ARTIST%|%BIO_ALBUMARTIST%/gi, "%BIO_ARTIST%");
        });
    }

    ["albartFields", "artFields", "albFields"].forEach((v, i) => this[v] = this.tf[tfArr[i]].replace(/\$.*?\(/gi, "").replace(/(,(|\s+)\d+)/gi,"").replace(/[,\(\)\[\]\%]/gi,"|").split("|"));

    this.albartFields = this.albartFields.filter(v => v.trim());
    this.artFields = this.artFields.filter(v => v.trim());
    artFieldsArr = this.artFields.map(v => "%" + v + "%");
    this.albFields = this.albFields.filter(v => v.trim());

	this.albCovFolder = this.valueIni("COVERS: CYCLE FOLDER", covFolder.name, covFolder.path, 0);
	for (j = 0; j < 4; j++) this.albCovFolder = this.albCovFolder.replace(RegExp(this.def_tf[j].name, "gi"), this.tf[tfArr[j]]);

    if (this.extra) { // extra covers
        this.extraPaths = []; for (i = 1; i < advCov.length; i++) {
            let ep = utils.ReadINI(this.bio_ini, "ADVANCED: CUSTOM COVER PATHS", advCov[i].name).replace(/%profile%\\/i, fb.ProfilePath);
            for (j = 0; j < 4; j++) ep = ep.replace(RegExp(this.def_tf[j].name, "gi"), this.tf[tfArr[j]]); if (ep) this.extraPaths.push(ep);
        }
    }

    this.get_multi = p_clear => {
        if (!ppt.mul_item) return; let a = name.artist(ppt.focus, true) || "Artist Unknown", aa = name.alb_artist(ppt.focus, true) || "Artist Unknown", l = name.album(ppt.focus, true) || "Album Unknown";
		if (this.lock) {this.logArtistHistory(a); this.logAlbumHistory(aa, l); return;}

		let ix = -1, k = 0, kw = ""; const lfmBio = this.cleanPth(this.pth.lfmBio, ppt.focus) + a.clean() + ".txt", lfm_a = s.open(lfmBio), lfmSim = this.cleanPth(this.pth.lfmSim, ppt.focus) + a.clean() + " And Similar Artists.json", mult_arr = []; let mn = "", nm = "", sa = "", ta = ""; init_albums = this.albums.slice(0); this.albums = []; init_artists = this.artists.slice(0); this.artists = []; this.artists.push({name: a, field: "", type: "Artist"});
		if (ppt.showSimilarArtists) {
			if (s.file(lfmSim)) {
				const lfm_s = s.jsonParse(lfmSim, false, 'file'); let newStyle = false;
				if (lfm_s) {
					if (lfm_s[0].hasOwnProperty('name')) newStyle = true; lfm_s.shift();
					$.take(lfm_s, similarNo);
					if (lfm_s.length) {
						this.artists.push({name: "Similar Artists:", field: "", type: "label"});
						lfm_s.forEach((v, i, arr) => this.artists.push({name: newStyle ? v.name : v, field: "", type: i != arr.length - 1 ? "similar" : "similarend"}));
					}
				}
			} else {
				if (s.file(lfmBio)) {
					kw = "Similar Artists: |Ähnliche Künstler: |Artistas Similares: |Artistes Similaires: |Artisti Simili: |似ているアーティスト: |Podobni Wykonawcy: |Artistas Parecidos: |Похожие исполнители: |Liknande Artister: |Benzer Sanatçılar: |相似艺术家: "
					let found = false, sim = lfm_a.match(RegExp(kw)); if (sim) {sim = sim.toString(); ix = lfm_a.lastIndexOf(sim); if (ix != -1) {sa = lfm_a.substring(ix + sim.length); sa = sa.split('\n')[0].trim().split(", ");}}
					if (sa.length < 7 && sa) {$.take(sa, similarNo); found = true;}
					if (!found) {
						bio_sim.some(v => {
							if (v.name == a) {sa = $.take(v.similar, similarNo); return found = true;}
						});
						if (!found) {const getSimilar = new Lfm_similar_artists(() => getSimilar.on_state_change(), getSimilar_search_done); getSimilar.Search(a, "", "", 6);}
					}
					if (found && $.isArray(sa) && sa.length) {
						this.artists.push({name: "Similar Artists:", field: "", type: "label"});
						sa.forEach((v, i) => this.artists.push({name: v, field: "", type: i != sa.length - 1 ? "similar" : "similarend"}));
					}
				}
			}
		}
		if (ppt.showMoreTags) {
			this.moreTags = false;
			artFieldsArr.forEach(v => {
				nm = v.replace(/%/g, "");
				for (let h = 0; h < this.eval("$meta_num(" + nm + ")", ppt.focus); h++) {
					mn = "$trim($meta(" + nm + "," + h + "))";
					const name = this.eval(mn, ppt.focus);
					if (this.artists.every(v => v.name !== name) && name.toLowerCase() != this.va) mult_arr.push({name: name, field: " ~ " + nm.titlecase(), type: "tag"});
				}
			});
			if (mult_arr.length > 1) {sort(mult_arr, "name"); k = mult_arr.length; while (k--) if (k != 0 && mult_arr[k].name.toLowerCase() == mult_arr[k - 1].name.toLowerCase()) {
				if (!mult_arr[k - 1].field.toLowerCase().includes(mult_arr[k].field.toLowerCase())) mult_arr[k - 1].field += mult_arr[k].field;
				mult_arr.splice(k, 1);
			}}
			if (mult_arr.length) {
				this.moreTags = true;
				this.artists.push({name: "More Tags:", field: "", type: "label"}); this.artists = this.artists.concat(mult_arr); this.artists[this.artists.length - 1].type = "tagend";}
		}

		if (!a || !history_a || a != history_a) {
			artistHistory = JSON.parse(JSON.stringify(this.artistHistory));
			if (artistHistory.length && artistHistory[0].name == a) artistHistory.shift();
			this.logArtistHistory(a);
			history_a = a;
		}

		if (!(aa + l) || !history_aa_l || aa + l != history_aa_l) {
			albumHistory = JSON.parse(JSON.stringify(this.albumHistory));
			if (albumHistory.length && albumHistory[0].artist == aa && albumHistory[0].album == l) albumHistory.shift();
			this.logAlbumHistory(aa, l);
			this.inclTrackRev = ppt.inclTrackRev;
			history_aa_l = aa + l;
		}

		if (artistHistory.length && ppt.showArtistHistory) {
			this.artists.push({name: "Artist History:", field: "", type: "label"}); 
			for (let h = 0; h < artistHistory.length; h++) this.artists.push(artistHistory[h]);
			this.artists[this.artists.length - 1].type = "historyend";
		}

        this.artists.forEach((v, i) => v.ix = i);
        this.artistsUniq = this.artists.filter(v => v.type != "label");

        if (ppt.showTopAlbums && s.file(lfmBio)) {
            kw = "Top Albums: |Top-Alben: |Álbumes Más Escuchados: |Top Albums: |Album Più Ascoltati: |人気アルバム: |Najpopularniejsze Albumy: |Álbuns Principais: |Популярные альбомы: |Toppalbum: |En Sevilen Albümler: |最佳专辑: "; ix = -1;
            let found = false, talb = lfm_a.match(RegExp(kw)); if (talb) {talb = talb.toString(); ix = lfm_a.lastIndexOf(talb); if (ix != -1) {ta = lfm_a.substring(ix + talb.length); ta = ta.split('\n')[0].trim().split(", ");}}
            if (ta.length < 7 && ta) found = true;
			if (!found) {
                alb_top.some(v => {
                    if (v.name == a) {ta = $.take(v.album, 6); return found = true;}
                });
                if (!found) {const getTopAlb = new Lfm_top_albums(() => getTopAlb.on_state_change(), getTopAlb_search_done); getTopAlb.Search(a);}
            }
			this.albums = [];
            this.albums.push({artist: aa, album: l, type: "Current Album"});
            if (found && $.isArray(ta) && ta.length) {
                this.albums.push({artist: "Last.fm Top Albums: " + a + ":", album: "Last.fm Top Albums: " + a + ":", type: "label"});
                ta.forEach((v, i) => this.albums.push({artist: a, album: v, type: i != ta.length - 1 ? "album" : "albumend"}));
            }
        } else {this.albums = []; this.albums.push({artist: aa, album: l, type: "Current Album"});}

		if (albumHistory.length && ppt.showAlbumHistory) {
			this.albums.push({artist: "Album History:", l: "", album: "Album History:", type: "label"}); 
			for (let h = 0; h < albumHistory.length; h++) this.albums.push(albumHistory[h]);
			this.albums[this.albums.length - 1].type = "historyend";
		}

        this.albums.forEach((v, i) => v.ix = i);
        this.albumsUniq = uniqAlbum(this.albums);
        if (!this.artistsSame() && p_clear) this.art_ix = 0; if (!albumsSame() && p_clear) this.alb_ix = 0;
    }

    if (!this.styles || !$.isArray(this.styles)) {ppt.set("SYSTEM.Freestyle Custom BackUp", ppt.styles); this.styles = []; ppt.styles = JSON.stringify(this.styles); fb.ShowPopupMessage("Unable to load custom styles.\n\nThe save location was corrupt. Custom styles have been reset.\n\nThe original should be backed up to \"SYSTEM.Freestyle Custom BackUp\" in panel properties.", "Biography");}
    else {let valid = true; this.styles.forEach(v => {if (!v.hasOwnProperty('name') || isNaN(v.imL) || isNaN(v.imR) || isNaN(v.imT) || isNaN(v.imB) || isNaN(v.txL) || isNaN(v.txR) || isNaN(v.txT) || isNaN(v.txB)) valid = false;}); if (!valid) {ppt.set("SYSTEM.Freestyle Custom BackUp", ppt.styles); this.styles = []; ppt.styles = JSON.stringify(this.styles); fb.ShowPopupMessage("Unable to load custom styles.\n\nThe save location was corrupt. Custom styles have been reset.\n\nThe original should be backed up to \"SYSTEM.Freestyle Custom BackUp\" in panel properties.", "Biography");}}
    if (!this.overlay || !this.overlay.hasOwnProperty('name') || isNaN(this.overlay.imL) || isNaN(this.overlay.imR) || isNaN(this.overlay.imT) || isNaN(this.overlay.imB) || isNaN(this.overlay.txL) || isNaN(this.overlay.txR) || isNaN(this.overlay.txT) || isNaN(this.overlay.txB)) {ppt.set("SYSTEM.Overlay BackUp", ppt.overlay); this.overlay = {"name":"Overlay", "imL":0, "imR":0, "imT":0, "imB":0, "txL":0, "txR":0, "txT":0.632, "txB":0}; ppt.overlay = JSON.stringify(this.overlay); fb.ShowPopupMessage("Unable to load \"SYSTEM.Overlay\".\n\nThe save location was corrupt. The overlay style has been reset to default.\n\nThe original should be backed up to \"SYSTEM.Overlay BackUp\" in panel properties.", "Biography");}
    const styleArr = () => {
        this.style_arr = ["Top", "Right", "Bottom", "Left", "Overlay"];
        this.styles.forEach(v => this.style_arr.push(v.name));
    }
    styleArr();

    this.sizes = bypass => {
        if (ppt.get("SYSTEM.Bottom Size Correction", false)) {this.w = ppt.img_only ? window.Width : window.Width - window.Width * 18 / 1018; this.h = ppt.img_only ? window.Height : window.Height - window.Height * 18 / 1018;} // size correction can be set to true for optimal text positioning where panel size is increased to compensate for shadow effect
        this.sbar_o = [2 + ui.arrow_pad, Math.max(Math.floor(ui.scr_but_w * 0.2), 2) + ui.arrow_pad * 2, 0][ui.sbarType]; this.top_corr = [this.sbar_o - (ui.but_h - ui.scr_but_w) / 2, this.sbar_o, 0][ui.sbarType]; const bot_corr = [(ui.but_h - ui.scr_but_w) / 2 - this.sbar_o, -this.sbar_o, 0][ui.sbarType];
		this.clip = false;
        if (!ppt.sameStyle) {
            switch (true) {
                case ppt.artistView:
                    if (ppt.bioMode == 1) {ppt.img_only = true; ppt.text_only = false;}
                    else if (ppt.bioMode == 2) {ppt.img_only = false; ppt.text_only = true;}
                    else {ppt.img_only = false; ppt.text_only = false; ppt.style = ppt.bioStyle;}
                    break;
                case !ppt.artistView:
                    if (ppt.revMode == 1) {ppt.img_only = true; ppt.text_only = false;}
                    else if (ppt.revMode == 2) {ppt.img_only = false; ppt.text_only = true;}
                    else {ppt.img_only = false; ppt.text_only = false; ppt.style = ppt.revStyle;}
                    break;
            }
        }
        switch (true){
            case ppt.img_only: // img_only
                this.img_l = this.bor_l; this.img_r = this.bor_r; this.img_t = this.bor_t; this.img_b = this.bor_b;
                this.imgs = s.clamp(this.h - this.bor_t - this.bor_b, 10, this.w - this.bor_l - this.bor_r);
                break;
            case ppt.text_only: // text_only
                this.lines_drawn = Math.max(Math.floor((this.h - ppt.textT - ppt.textB - ui.heading_h) / ui.font_h), 0);
                this.text_l = ppt.textL;
                this.text_r = ppt.sbarShow ? Math.max(ppt.textR, ui.sbar_sp + 10) : ppt.textR;
                this.text_t = !ppt.topAlign ? ppt.textT + (this.h - ppt.textT - ppt.textB - this.lines_drawn * ui.font_h + ui.heading_h) / 2 : ppt.textT + ui.heading_h;
                this.text_w = this.w - this.text_l - this.text_r;
                if (ppt.sbarShow) {this.sbar_x = this.w - ui.sbar_sp; this.sbar_y = (ui.sbarType < sbarStyle ? this.text_t : 0) + this.top_corr; this.sbar_h = (ui.sbarType < sbarStyle ? ui.font_h * this.lines_drawn + bot_corr : this.h - this.sbar_y) + bot_corr;}
                this.rp_x = 0; this.rp_y = 0; this.rp_w = this.w; this.rp_h = this.h;
                break;
            case ppt.style == 0: // top
                this.img_l = this.bor_l; this.img_r = this.bor_r; this.img_t = this.bor_t; this.img_b = this.bor_b;
                txt_h = Math.round((this.h - this.img_t - ppt.textB) * (1 - ppt.rel_imgs));
                this.lines_drawn = Math.max(Math.floor((txt_h - ui.heading_h) / ui.font_h), 0);
                txt_h = this.lines_drawn * ui.font_h + ppt.gap;
                this.imgs = Math.max(this.h - txt_h - this.img_t  - ppt.textB - ui.heading_h, 10);
                this.text_l = ppt.textL;
                this.text_r = ppt.sbarShow ? Math.max(ppt.textR, ui.sbar_sp + 10) : ppt.textR;
                this.text_t = this.img_t + this.imgs + ppt.gap + ui.heading_h;
                this.text_w = this.w - this.text_l - this.text_r;
                this.text_h = txt_h + ui.heading_h;
                if (ppt.sbarShow) {this.sbar_x = this.w - ui.sbar_sp; this.sbar_y = (ui.sbarType < sbarStyle || ppt.heading ? this.text_t : this.img_t + this.imgs) + this.top_corr; this.sbar_h = (ui.sbarType < sbarStyle ? ui.font_h * this.lines_drawn + bot_corr : this.h - this.sbar_y) + bot_corr;}
                this.rp_x = 0; this.rp_y = this.img_t + this.imgs; this.rp_w = this.w; this.rp_h = this.h - this.rp_y;
                break;
            case ppt.style == 1: // right
                this.img_l = this.bor_l; this.img_r = this.bor_r; this.img_t = this.bor_t; this.img_b = this.bor_b;
                txt_sp = Math.round((this.w - ppt.textL - this.img_r) * (1 - ppt.rel_imgs)); txt_h = this.h - ppt.textT - ppt.textB;
                this.lines_drawn = Math.max(Math.floor((txt_h - ui.heading_h) / ui.font_h), 0);
                this.imgs = Math.max(this.w - txt_sp -  this.img_r - ppt.textL - ppt.gap, 10);
                if (ppt.sbarShow) txt_sp -= (ui.sbar_sp + 10);
                this.text_l = ppt.textL;
                this.text_r = ppt.sbarShow ? Math.max(ppt.textR, ui.sbar_sp + 10) : ppt.textR;
                this.text_t = !ppt.topAlign ? ppt.textT + (this.h - ppt.textT - ppt.textB - this.lines_drawn * ui.font_h + ui.heading_h) / 2 : ppt.textT + ui.heading_h;
                this.text_w = txt_sp;
                this.text_h = this.lines_drawn * ui.font_h + ui.heading_h;
                this.img_l = ppt.textL + txt_sp + ppt.gap + (ppt.sbarShow ? ui.sbar_sp + 10 : 0);
                if (ppt.sbarShow) {this.sbar_x = this.text_l + this.text_w + 10; this.sbar_x = this.sbar_x - (ui.sbar_w - ui.scr_but_w < 5 || ui.sbarType == 3 ? 1 : 0); this.sbar_y = (ui.sbarType < sbarStyle || ppt.heading ? this.text_t : 0) + this.top_corr; this.sbar_h = ui.sbarType < sbarStyle ? ui.font_h * this.lines_drawn + bot_corr * 2 : this.h - this.sbar_y  + bot_corr;}
                this.rp_x = 0; this.rp_y = 0; this.rp_w = this.img_l; this.rp_h = this.h;
                break;
            case ppt.style == 2: // bottom
                this.img_l = this.bor_l; this.img_r = this.bor_r; this.img_t = this.bor_t; this.img_b = this.bor_b;
                txt_h = Math.round((this.h - ppt.textT - this.img_b) * (1 - ppt.rel_imgs));
                this.lines_drawn = Math.max(Math.floor((txt_h - ui.heading_h) / ui.font_h), 0);
                txt_h = this.lines_drawn * ui.font_h + ppt.gap;
                this.imgs = Math.max(this.h - txt_h - this.img_b  - ppt.textT - ui.heading_h, 10);
                this.img_t = this.h - this.bor_b - this.imgs;
                this.text_l = ppt.textL;
                this.text_r = ppt.sbarShow ? Math.max(ppt.textR, ui.sbar_sp + 10) : ppt.textR;
                this.text_t = this.img_t - txt_h;
                this.text_w = this.w - this.text_l - this.text_r;
                this.text_h = txt_h - ppt.gap + ui.heading_h;
                if (ppt.sbarShow) {this.sbar_x = this.w - ui.sbar_sp; this.sbar_y = (ui.sbarType < sbarStyle || ppt.heading ? this.text_t : 0) + this.top_corr; this.sbar_h = ui.sbarType < sbarStyle ? ui.font_h * this.lines_drawn + bot_corr * 2 : this.img_t - this.sbar_y + bot_corr;}
                this.rp_x = 0; this.rp_y = 0; this.rp_w = this.w; this.rp_h = this.img_t;
                break;
            case ppt.style == 3: // left
                this.img_l = this.bor_l; this.img_r = this.bor_r; this.img_t = this.bor_t; this.img_b = this.bor_b;
                this.text_r = ppt.sbarShow ? Math.max(ppt.textR, ui.sbar_sp + 10) : ppt.textR;
                txt_sp = Math.round((this.w - this.img_l - this.text_r) * (1 - ppt.rel_imgs));
                this.text_h = this.h - ppt.textT - ppt.textB;
                this.lines_drawn = Math.max(Math.floor((this.text_h - ui.heading_h) / ui.font_h), 0);
                this.imgs = Math.max(this.w - txt_sp -  this.img_l -  this.text_r - ppt.gap, 10);
                this.text_l = this.img_l + this.imgs + ppt.gap;
                this.text_t = !ppt.topAlign ? ppt.textT + (this.h - ppt.textT - ppt.textB - this.lines_drawn * ui.font_h + ui.heading_h) / 2 : ppt.textT + ui.heading_h;
                this.text_w = txt_sp;
                if (ppt.sbarShow) {this.sbar_x = this.w - ui.sbar_sp; this.sbar_y = (ui.sbarType < sbarStyle || ppt.heading ? this.text_t : 0) + this.top_corr; this.sbar_h = ui.sbarType < sbarStyle ? ui.font_h * this.lines_drawn + bot_corr * 2 : this.h - this.sbar_y  + bot_corr;}
                this.rp_x = this.text_l; this.rp_y = 0; this.rp_w = this.w - this.rp_x; this.rp_h = this.h;
                break;
            case ppt.style > 3:
                if (ppt.style - 5 >= this.styles.length) getStyleFallback();
                const obj = ppt.style == 4 ? this.overlay : this.styles[ppt.style - 5];
                if (!bypass) {this.im_l = s.clamp(obj.imL, 0, 1); this.im_r = s.clamp(obj.imR, 0, 1); this.im_t = s.clamp(obj.imT, 0, 1); this.im_b = s.clamp(obj.imB, 0, 1); this.tx_l = s.clamp(obj.txL, 0, 1); this.tx_r = s.clamp(obj.txR, 0, 1); this.tx_t = s.clamp(obj.txT, 0, 1); this.tx_b = s.clamp(obj.txB, 0, 1);}
                const imL = Math.round(this.im_l * this.w), imR = Math.round(this.im_r * this.w), imT = Math.round(this.im_t * this.h), imB = Math.round(this.im_b * this.h), txL = Math.round(this.tx_l * this.w), txR = Math.round(this.tx_r * this.w), txT = Math.round(this.tx_t * this.h), txB = Math.round(this.tx_b * this.h);
                this.iBoxL = Math.max(imL, 0); this.iBoxT = Math.max(imT, 0); this.iBoxW = this.w - imL - imR; this.iBoxH = this.h - imT - imB;
                this.img_l = imL + this.bor_l; this.img_r = imR + this.bor_r; this.img_t = imT + this.bor_t; this.img_b = imB + this.bor_b;
                txt_h = Math.round((this.h - txT - txB - t_t - t_b));
                this.lines_drawn = Math.max(Math.floor((txt_h - ui.heading_h) / ui.font_h), 0);
                this.text_l = txL + t_l;
                this.text_r = txR + (ppt.sbarShow ? Math.max(t_r, ui.sbar_sp + 10) : t_r);
                this.text_t = txT + ui.heading_h + t_t;
                this.text_w = this.w - this.text_l - this.text_r;
                this.text_h = Math.max(this.lines_drawn * ui.font_h + ui.heading_h, ui.font_h + ui.heading_h)
                this.tBoxL = Math.max(txL, 0); this.tBoxT = Math.max(txT, 0); this.tBoxW = this.w - Math.max(txL, 0) - Math.max(txR, 0); this.tBoxH = this.h - Math.max(txT, 0) - Math.max(txB, 0); this.minH = ui.font_h + ui.heading_h + t_t + t_b;
                if (ppt.overlayStyle == 2) this.arc_w = Math.max(Math.min(this.arc_w, this.tBoxW / 3, this.tBoxH / 3), 1);
                if (ppt.overlayStyle) this.arc = Math.max(ui.font_h / 1.5, 1);
				this.clip = this.iBoxT + 100 < this.tBoxT && this.tBoxT < this.iBoxT + this.iBoxH && (this.tBoxL < this.iBoxL + this.iBoxW || this.tBoxL + this.tBoxW < this.iBoxL + this.iBoxW);
                this.imgs = this.clip ? this.tBoxT - this.iBoxT : Math.min(this.h - imT - imB - this.bor_t - this.bor_b, this.w - imL - imR - this.bor_l - this.bor_r);
                if (ppt.sbarShow) {this.sbar_x = this.tBoxL + this.tBoxW - ui.sbar_sp - ui.arc_w; this.sbar_y = this.text_t + this.top_corr; this.sbar_h = ui.font_h * this.lines_drawn + bot_corr * 2;}
                this.rp_x = this.tBoxL; this.rp_y = this.tBoxT; this.rp_w = this.tBoxW; this.rp_h = this.tBoxH;
                break;
        }
        if (ui.sbarType == 2) {this.sbar_y += 1; this.sbar_h -= 2;} this.text_w = Math.max(this.text_w, 10);
        this.max_y = this.lines_drawn * ui.font_h + this.text_t - ui.font_h * 0.9;
		this.covView = ppt.artistView ? 0: 1;
    }

    this.imgBox = (x, y) => {
        if (ppt.style < 4) {
            switch (ppt.style) {
                case 0: case 2: return y > this.img_t && y < this.img_t + this.imgs;
                case 1: case 3: return x > this.img_l && x < this.img_l + this.imgs;
            }
        } else return y > this.iBoxT && y < this.iBoxT + this.iBoxH && x > this.iBoxL && x < this.iBoxL + this.iBoxW;
    }

    this.mode = n => {
        if (!ppt.sameStyle) ppt.artistView ? ppt.bioMode = n : ppt.revMode = n; let calcText = true;
        switch (n) {
            case 0:
                calcText = this.calcText || ppt.text_only; ppt.img_only = false; ppt.text_only = false; this.sizes(); img.clear_rs_cache();
				if (calcText && !ppt.sameStyle && (ppt.bioMode != ppt.revMode || ppt.bioStyle != ppt.revStyle)) calcText = ppt.artistView ? 1 : 2;
				if (!this.art_ix && ppt.artistView && !t.mulArtist || !this.alb_ix && !ppt.artistView && !t.mulAlbum) {t.album_reset(); t.artist_reset(); t.getText(calcText); img.get_images();} else {t.get_multi(calcText, this.art_ix, this.alb_ix); img.get_multi(this.art_ix, this.alb_ix);}
                break;
            case 1:
                ppt.img_only = true; ppt.text_only = false;
                img.setCrop(); this.sizes(); img.clear_rs_cache(); img.get_images();
                break;
            case 2:
                ppt.img_only = false; ppt.text_only = true; this.sizes(); if (ui.blur) img.clear_rs_cache();
				if (!ppt.sameStyle && (ppt.bioMode != ppt.revMode || ppt.bioStyle != ppt.revStyle)) calcText = ppt.artistView ? 1 : 2;
                if (!this.art_ix && ppt.artistView && !t.mulArtist || !this.alb_ix && !ppt.artistView && !t.mulAlbum) {t.album_reset(); t.artist_reset(); t.getText(calcText);
                if (ui.blur) img.get_images();} else {t.get_multi(calcText, this.art_ix, this.alb_ix);
                if (ui.blur) img.get_multi(this.art_ix, this.alb_ix); img.set_chk_arr(null);}
                break;
        }
		this.calcText = false;
        but.refresh();
    }

    this.createStyle = () => {
        let ns;
        try {ns = utils.InputBox(window.ID, "Enter new style name\n\n\Proceed?\n\nFreestyle layouts offer drag style positioning of image && text boxes + text overlay\n\nPress CTRL to alter layouts", "Create New Freestyle Layout", "My Style", true);} catch (e) {return false;} if (!ns) return false;
        let lines_drawn, imgs, te_t;
        switch (ppt.style) {
            case 0: txt_h = Math.round((this.h - this.bor_t - ppt.textB) * (1 - ppt.rel_imgs)); lines_drawn = Math.max(Math.floor((txt_h - ui.heading_h) / ui.font_h), 0); txt_h = lines_drawn * ui.font_h + ppt.gap; imgs = Math.max(this.h - txt_h - this.bor_t  - ppt.textB - ui.heading_h, 10); this.im_b = (this.h - this.bor_t - imgs - this.bor_b) / this.h; this.tx_t = (this.bor_t + imgs - ppt.textT + ppt.gap) / this.h; this.im_l = 0; this.im_r = 0; this.im_t = 0; this.tx_l = 0; this.tx_r = 0; this.tx_b = 0; break;
            case 1: txt_sp = Math.round((this.w - ppt.textL - this.bor_r) * (1 - ppt.rel_imgs)); lines_drawn = Math.max(Math.floor((this.h - ppt.textT - ppt.textB - ui.heading_h) / ui.font_h), 0); te_t = !ppt.topAlign ? ppt.textT + (this.h - ppt.textT - ppt.textB - lines_drawn * ui.font_h + ui.heading_h) / 2 : ppt.textT + ui.heading_h; this.im_l = (txt_sp + ppt.gap + (ppt.sbarShow ? ui.sbar_sp + 10 : 0)) / this.w; this.tx_r = (this.w - (txt_sp + ppt.textR)) / this.w; this.tx_t = (te_t - ui.heading_h - ppt.textT) / this.h; this.im_r = 0; this.im_t = 0; this.im_b = 0; this.tx_l = 0; this.tx_b = 0; break;
            case 2: txt_h = Math.round((this.h - text_t - this.bor_b) * (1 - ppt.rel_imgs)); lines_drawn = Math.max(Math.floor((txt_h - ui.heading_h) / ui.font_h), 0); txt_h = lines_drawn * ui.font_h + ppt.gap; imgs = Math.max(this.h - txt_h - this.bor_b  - ppt.textT - ui.heading_h, 10); const img_t = this.h - this.bor_b - imgs; this.im_t = img_t / this.h; this.tx_b = (this.h - img_t - ppt.textB + ppt.gap) / this.h; this.im_l = 0; this.im_r = 0; this.im_b = 0; this.tx_l = 0; this.tx_r = 0; this.tx_t = 0; break;
            case 3: const te_r = ppt.sbarShow ? Math.max(ppt.textR, ui.sbar_sp + 10) : ppt.textR, txt_sp = Math.round((this.w - this.bor_l - te_r) * (1 - ppt.rel_imgs)); imgs = Math.max(this.w - txt_sp -  this.bor_l -  te_r - ppt.gap, 10); lines_drawn = Math.max(Math.floor((this.h - ppt.textT - ppt.textB - ui.heading_h) / ui.font_h), 0); te_t = !ppt.topAlign ? ppt.textT + (this.h - ppt.textT - ppt.textB - lines_drawn * ui.font_h + ui.heading_h) / 2 : ppt.textT + ui.heading_h; this.im_r = (this.w - this.bor_l - imgs - this.bor_r) / this.w; this.tx_l = (this.bor_l + imgs - ppt.textL + ppt.gap) / this.w; this.tx_t = (te_t - ui.heading_h - ppt.textT) / this.h; this.im_l = 0; this.im_t = 0; this.im_b = 0; this.tx_r = 0; this.tx_b = 0; break;
        }
        this.styles.forEach(v => {if (v.name == ns) ns = ns + " New";});
        this.styles.push({"name":ns, "imL":this.im_l, "imR":this.im_r, "imT":this.im_t, "imB":this.im_b, "txL":this.tx_l, "txR":this.tx_r, "txT":this.tx_t, "txB":this.tx_b})
        sort(this.styles, "name"); ppt.styles = JSON.stringify(this.styles);
        this.styles.some((v, i) => {
            if (v.name == ns) {
                if (ppt.sameStyle) ppt.style = i + 5;
                else if (ppt.artistView) ppt.bioStyle = i + 5;
                else ppt.revStyle = i + 5;
                return true;
            }
        })
        styleArr(); t.toggle(8); timer.clear(timer.source); timer.source.id = setTimeout(() => {this.newStyle = false; window.Repaint(); timer.source.id = null;}, 10000); if (timer.source.id !== 0) {this.newStyle = true; window.Repaint();}
    }

    const getStyleFallback = () => {ppt.style = 4; if (!ppt.sameStyle) {if (ppt.artistView) ppt.bioStyle = 4; else ppt.revStyle = 4;} fb.ShowPopupMessage("Unable to locate style. Using overlay layout instead.", "Biography");}

    this.deleteStyle = n => {const ns = $.WshShell.Popup("Delete: " + this.style_arr[n] + "\n\nStyle will be set to top", 0, "Delete Current Style", 1); if (ns != 1) return false; this.styles.splice(n - 5, 1); ppt.styles = JSON.stringify(this.styles); ppt.style = 0; if (!ppt.sameStyle) {if (ppt.artistView) ppt.bioStyle = 0; else ppt.revStyle = 0;} styleArr(); t.toggle(8);}
    this.exportStyle = n => {const ns = $.WshShell.Popup("Export: " + this.style_arr[n], 0, "Export Current Style To Other Biography Panels", 1); if (ns != 1) return false; window.NotifyOthers("custom_style_bio", JSON.stringify(this.styles[n - 5]));}
    this.on_notify = info => {const rec = s.jsonParse(info, false); this.styles.forEach(v => {if (v.name == rec.name) rec.name = rec.name + " New";}); this.styles.push(rec); sort(this.styles, "name"); ppt.styles = JSON.stringify(this.styles); styleArr();}
    this.renameStyle = n => {const ns = utils.InputBox(window.ID, "Rename style: " + this.style_arr[n] + "\n\nEnter new name\n\nProceed?", "Rename Current Style", this.style_arr[n]); if (!ns || ns == this.style_arr[n]) return false; this.styles.forEach(v => {if (v.name == ns) ns = ns + " New";}); this.styles[n - 5].name = ns; sort(this.styles, "name"); ppt.styles = JSON.stringify(this.styles); this.styles.some((v, i) => {if (v.name == ns) {ppt.style = i + 5; return true;}}); styleArr(); window.Repaint();}
    this.resetStyle = n => {const ns = $.WshShell.Popup("Reset to Default " + (ppt.style < 4 ? this.style_arr[n] : "Overlay") + " Style", 0, "Reset Current Style", 1); if (ns != 1) return false; if (ppt.style < 4) ppt.rel_imgs = 0.7; else {const obj = ppt.style == 4 ? this.overlay : this.styles[ppt.style - 5]; obj.name = this.style_arr[n]; obj.imL = 0; obj.imR = 0; obj.imT = 0; obj.imB = 0; obj.txL = 0; obj.txR = 0; obj.txT = 0.632; obj.txB = 0; ppt.style == 4 ? ppt.overlay = JSON.stringify(this.overlay) : ppt.styles = JSON.stringify(this.styles);} t.toggle(13);}
}

function Lfm_similar_artists(state_callback, on_search_done_callback) {
    let artist, done, fn_sim, list = [], handles, lmt, pth_sim, retry = false; this.xmlhttp = null; this.func = null; this.ready_callback = state_callback; this.on_search_done_callback = on_search_done_callback;
    this.on_state_change = () => {if (this.xmlhttp != null && this.func != null) if (this.xmlhttp.readyState == 4) {if (this.xmlhttp.status == 200) this.func(); else if (this.on_search_done_callback) this.on_search_done_callback(artist, list, done, handles);}}

    this.Search = (p_artist, p_done, p_handles, p_lmt, p_pth_sim, p_fn_sim) => {
        artist = p_artist; done = p_done; handles = p_handles; lmt = p_lmt; pth_sim = p_pth_sim; fn_sim = p_fn_sim; if (retry) lmt = lmt == 249 ? 235 + Math.floor(Math.random() * 14) : lmt + 10; this.func = null; this.xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
        const URL = "http://ws.audioscrobbler.com/2.0/?format=json" + p.lfm + "&method=artist.getSimilar&artist=" + encodeURIComponent(artist) + "&limit=" + lmt + "&autocorrect=1";
        this.func = this.Analyse; this.xmlhttp.open("GET", URL); this.xmlhttp.onreadystatechange = this.ready_callback; this.xmlhttp.setRequestHeader('User-Agent', "foobar2000_script"); if (retry) this.xmlhttp.setRequestHeader('If-Modified-Since', 'Thu, 01 Jan 1970 00:00:00 GMT'); this.xmlhttp.send();
    }

    this.Analyse = () => {
        const data = s.jsonParse(this.xmlhttp.responseText, false, 'get', 'similarartists.artist', 'name\":');
        if ((!data || data.length < lmt) && !retry) {retry = true; return this.Search(artist, done, handles, lmt, pth_sim, fn_sim);}
        switch (true) {
            case lmt < 17: if (data) {$.take(data, 6); list = data.map(v => v.name);}
            if (data || retry) this.on_search_done_callback(artist, list, done, handles); break;
            case lmt > 99: if (data) {
                    list = data.map(v => ({name: v.name, score: Math.round(v.match * 100)}));
                    list.unshift({name:artist, score:100}); s.buildPth(pth_sim); s.save(fn_sim, JSON.stringify(list), true); if (p.lfm_sim) {p.get_multi(); window.NotifyOthers("get_multi_bio", "get_multi_bio");}
                } break;
        }
    }
}

function Lfm_top_albums(state_callback, on_search_done_callback) {
    const list = [], popAlbums = []; let artist, i = 0, topAlbums = []; this.xmlhttp = null; this.func = null; this.ready_callback = state_callback; this.on_search_done_callback = on_search_done_callback;
    this.on_state_change = () => {if (this.xmlhttp != null && this.func != null) if (this.xmlhttp.readyState == 4) {if (this.xmlhttp.status == 200) this.func(); else {this.on_search_done_callback(artist, list);}}}

    this.Search = (p_artist) => {
        artist = p_artist; this.func = null; this.xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
		const URL = "https://www.last.fm/music/" + encodeURIComponent(artist) + "/+albums";
        this.func = this.Analyse; this.xmlhttp.open("GET", URL); this.xmlhttp.onreadystatechange = this.ready_callback; this.xmlhttp.send();
    }

	this.Analyse = () => {
		s.doc.open(); const div = s.doc.createElement('div'); div.innerHTML = this.xmlhttp.responseText;
		s.htmlParse(div.getElementsByTagName('h3'), 'className', 'resource-list--release-list-item-name', v => {i < 4 ? popAlbums.push(v.innerText.trim().titlecase()) : topAlbums.push(v.innerText.trim().titlecase()); i++; if (i == 10) return true;});
		s.doc.close();
		if (popAlbums.length) {
			const mapAlbums = topAlbums.map(v => v.cut());
			const match = mapAlbums.includes(popAlbums[0].cut());
			if (topAlbums.length > 5 && !match) topAlbums.splice(5, 0, popAlbums[0]);
			else topAlbums = topAlbums.concat(popAlbums);
		}
		topAlbums = [...new Set(topAlbums)];
		topAlbums.length = Math.min(6, topAlbums.length);
		this.on_search_done_callback(artist, topAlbums);
	}
}

function Names() {
    this.alb_strip = p.valueIni("MISCELLANEOUS", p.def_tf[3].name, p.def_tf[3].tf, 1);
    this.alb_artist = (focus, ignoreLock) => p.eval("[$trim(" + p.tf.aa + ")]", focus, ignoreLock);
    this.artist = (focus, ignoreLock) => p.eval("[$trim(" + p.tf.a + ")]", focus, ignoreLock);
    this.alb = focus => p.eval("[$trim(" + p.tf.l + ")]", focus);
    this.albID = (focus, n) => {
		if (!this.alb(focus)) return p.eval(p.tf.a + p.tf.aa + "%path%", focus);
		else switch (n) {
			case 'simple': return p.eval(p.tf.a + p.tf.aa + p.tf.l, focus);
			case 'stnd': return p.eval(p.tf.aa + p.tf.l + "%discnumber%%date%", focus);
			case 'full': return p.eval(p.tf.a + p.tf.aa + p.tf.l + "%discnumber%%date%", focus);
		}
	}
    this.albm = (focus, ignoreLock) => p.eval("[" + p.tf.l + "]", focus, ignoreLock).replace(/CD(\s*\d|\.0\d)|CD\s*(One|Two|Three)|Disc\s*\d|Disc\s*(III|II|I|One|Two|Three)\b/gi,"").replace(/\(\s*\)|\[\s*\]/g, " ").replace(/\s\s+/g, " ").replace(/-\s*$/g, " ").trim();
    this.album = (focus, ignoreLock) => {if (!this.alb_strip) return this.albm(focus); return p.eval("[" + p.tf.l + "]", focus, ignoreLock).replace(/CD(\s*\d|\.0\d)|CD\s*(One|Two|Three)|Disc\s*\d|Disc\s*(III|II|I|One|Two|Three)\b|(Bonus\s*Track|Collector's|(Digital\s*|Super\s*|)Deluxe|Digital|Expanded|Limited|Platinum|Reissue|Special)\s*(Edition|Version)|(Bonus\s*(CD|Disc))|\d\d\w\w\s*Anniversary\s*(Expanded\s*|Re(-|)master\s*|)(Edition|Re(-|)master|Version)|((19|20)\d\d(\s*|\s*-\s*)|)(Digital(ly|)\s*|)(Re(-|)master(ed|)|Re(-|)recorded)(\s*Edition|\s*Version|)|\(Deluxe\)|\(Mono\)|\(Reissue\)|\(Revisited\)|\(Stereo\)|\(Web\)|\[Deluxe\]|\[Mono\]|\[Reissue\]|\[Revisited\]|\[Stereo\]|\[Web\]/gi,"").replace(/\(\s*\)|\[\s*\]/g, " ").replace(/\s\s+/g, " ").replace(/-\s*$/g, " ").trim();}
	this.title = (focus, ignoreLock) => {let n = p.eval("[$trim(" + p.tf.t + ")]", focus, ignoreLock); if (p.local && p.ir(focus)) {const kw = "(-\\s*|\\s+)\\d\\d\\d\\d"; let ix = -1, yr = n.match(RegExp(kw)); if (yr) {yr = yr[0].toString(); ix = n.indexOf(yr);} if (ix != -1) n = n.slice(0, ix).trim();} return n;}
	this.trackID = focus => p.eval(p.tf.a + p.tf.t, focus);
}

function Scrollbar() {
	let duration = ppt.duration.splt(0); duration = {drag : 200, inertia : s.clamp(s.value(duration[3], 3000, 0), 0, 5000), full : s.clamp(s.value(duration[1], 500, 0), 0, 5000)}; duration.scroll = Math.round(duration.full * 0.8); duration.step = Math.round(duration.full * 2 / 3); duration.bar = duration.full; duration.barFast = duration.step;
	let active_o = true, alpha = 255, alpha1 = alpha, alpha2 = 255, amplitude, b_is_dragging = false, bar_ht = 0, bar_timer = null, bar_y = 0, but_h = 0, clock = Date.now(), counter = 0, drag_distance_per_row = 0, elap = 0, event = 'scroll', frame, hover = false, hover_o = false, init = true, initial_drag_y = 0, initial_scr = 1, initial_y = -1, ix = -1, inStep = 18, lastTouchDn = Date.now(), narrowSbar_x = 0, offset = 0, ratio = 1, reference = -1, rows = 0, sbarZone = false, sbarZone_o = false, scrollbar_height = 0, scrollbar_travel = 0, start = 0, startTime = 0, ticker, timestamp, ts, velocity;
    const col = {}, min = 10 * s.scale, mv = 2 * s.scale;
    this.active = true; this.count = -1; this.delta = 0; ppt.flickDistance = s.clamp(ppt.flickDistance, 0, 10); this.draw_timer = null; this.item_y = 0; this.max_scroll = 0; this.narrow = ppt.sbarShow == 1 ? true : false; this.onSbar = false; this.row_count = 0; this.rows_drawn = 0; this.row_h = 0; this.scroll = 0; this.scrollable_lines = 0; ppt.scrollStep = s.clamp(ppt.scrollStep, 0, 10); ppt.touchStep = s.clamp(ppt.touchStep, 1, 10); this.timer_but = null; this.touch = {dn: false, end: 0, start: 0}; this.x = 0; this.y = 0; this.w = 0; this.h = 0;

	this.setCol = () => {
		let opaque = false;
		alpha = !ui.sbarCol ? 75 : (!ui.sbarType ? 68 : 51);
		alpha1 = alpha; alpha2 = !ui.sbarCol ? 128 : (!ui.sbarType ? 119 : 85);
		inStep = ui.sbarType && ui.sbarCol ? 12 : 18;
		switch (ui.sbarType) {
			case 0:
				switch (ui.sbarCol) {
					case 0:
						for (let i = 0; i < alpha2 - alpha + 1; i++) col[alpha + i] = opaque ? s.RGBAtoRGB(RGBA(ui.col.t, ui.col.t, ui.col.t, alpha + i), ui.col.bg) : RGBA(ui.col.t, ui.col.t, ui.col.t, alpha + i);
						col.max = opaque ? s.RGBAtoRGB(RGBA(ui.col.t, ui.col.t, ui.col.t, 192), ui.col.bg) : RGBA(ui.col.t, ui.col.t, ui.col.t, 192); break;
					case 1:
						for (let i = 0; i < alpha2 - alpha + 1; i++) col[alpha + i] = opaque ? s.RGBAtoRGB(ui.col.text & RGBA(255, 255, 255, alpha + i), ui.col.bg) : ui.col.text & RGBA(255, 255, 255, alpha + i);
						col.max = opaque ? s.RGBAtoRGB(ui.col.text & 0x99ffffff, ui.col.bg) : ui.col.text & 0x99ffffff; break;
				}
				break;
			case 1:
				switch (ui.sbarCol) {
					case 0:
						col.bg = opaque ? s.RGBAtoRGB(RGBA(ui.col.t, ui.col.t, ui.col.t, 15), ui.col.bg) : RGBA(ui.col.t, ui.col.t, ui.col.t, 15);
						for (let i = 0; i < alpha2 - alpha + 1; i++) col[alpha + i] = opaque ? s.RGBAtoRGB(RGBA(ui.col.t, ui.col.t, ui.col.t, alpha + i), ui.col.bg) : RGBA(ui.col.t, ui.col.t, ui.col.t, alpha + i);
						col.max = opaque ? s.RGBAtoRGB(RGBA(ui.col.t, ui.col.t, ui.col.t, 192), ui.col.bg) : RGBA(ui.col.t, ui.col.t, ui.col.t, 192); break;
					case 1:
						col.bg = opaque ? s.RGBAtoRGB(ui.col.text & 0x15ffffff, ui.col.bg) : ui.col.text & 0x15ffffff;
						for (let i = 0; i < alpha2 - alpha + 1; i++) col[alpha + i] = opaque ? s.RGBAtoRGB(ui.col.text & RGBA(255, 255, 255, alpha + i), ui.col.bg) : ui.col.text & RGBA(255, 255, 255, alpha + i);
						col.max = opaque ? s.RGBAtoRGB(ui.col.text & 0x99ffffff, ui.col.bg) : ui.col.text & 0x99ffffff; break;
				}
				break;
		}
	}; this.setCol();

	const minimise_debounce = s.debounce(() => {
		if (sbarZone) return t.paint();
		this.narrow = true;
		if (ppt.sbarShow == 1) but.set_scroll_btns_hide(true, this.type);
		sbarZone_o = sbarZone;
		hover = false; hover_o = false;
		alpha = alpha1;
		t.paint();
	}, 1000);
	
	const hide_debounce = s.debounce(() => {
		if (sbarZone) return;
		this.active = false;
		active_o = this.active;
		hover = false; hover_o = false;
		alpha = alpha1;
		t.paint()
	}, 5000);
	
	this.resetAuto = () => {
		minimise_debounce.cancel(); hide_debounce.cancel();
		if (!ppt.sbarShow) but.set_scroll_btns_hide(true); if (ppt.sbarShow == 1) {but.set_scroll_btns_hide(true, "both"); this.narrow = true;} if (ppt.sbarShow == 2) this.narrow = false;
	}

    const nearest = y => {y = (y - but_h) / scrollbar_height * this.max_scroll; y = y / this.row_h; y = Math.round(y) * this.row_h; return y;}
    const scroll_throttle = s.throttle(() => {this.delta = this.scroll; scroll_to();}, 16);
    const scroll_timer = () => {this.draw_timer = setInterval(() => {if (p.w < 1 || !window.IsVisible) return; smooth_scroll();}, 16);}

	this.leave = () => {if (this.touch.dn) this.touch.dn = false; if (!men.right_up) sbarZone = false; if (b_is_dragging || ppt.sbarShow == 1) return; hover = !hover; this.paint(); hover = false; hover_o = false;}
    this.page_throttle = s.throttle(dir => this.check_scroll(Math.round((this.scroll + dir * -this.rows_drawn * this.row_h) / this.row_h) * this.row_h, 'full'), 100);
    this.reset = () => {this.delta = this.scroll = 0; this.item_y = 0; this.metrics(this.x, this.y, this.w, this.h, this.rows_drawn, this.row_h);}
    this.set_rows = row_count => {if (!row_count) this.item_y = 0; this.row_count = row_count; this.metrics(this.x, this.y, this.w, this.h, this.rows_drawn, this.row_h);}
    this.set_scroll = new_scroll => {clock = 0; const b = Math.max(0, Math.min(new_scroll, this.max_scroll)); if (b == this.scroll) return; this.scroll = b; this.delta = this.scroll; bar_y = but_h + scrollbar_travel * (this.delta * ratio) / (this.row_count * this.row_h); p.paint();}
    this.wheel = step => this.check_scroll(Math.round((this.scroll + step * -(!ppt.scrollStep ? this.rows_drawn : ppt.scrollStep) * this.row_h) / this.row_h) * this.row_h, ppt.scrollStep ? 'step' : 'full');

    this.metrics = (x, y, w, h, rows_drawn, row_h) => {
        this.x = x; this.y = Math.round(y); this.w = w; this.h = h; this.rows_drawn = rows_drawn; this.row_h = row_h; but_h = ui.but_h;
        // draw info
        scrollbar_height = Math.round(this.h - but_h * 2);
        bar_ht = Math.max(Math.round(scrollbar_height * this.rows_drawn / this.row_count), s.clamp(scrollbar_height / 2, 5, ppt.sbarShow == 2 ? ui.grip_h : ui.grip_h * 2));
        scrollbar_travel = scrollbar_height - bar_ht;
        // scrolling info
        this.scrollable_lines = this.rows_drawn > 0 ? this.row_count - this.rows_drawn : 0;
        ratio = this.row_count / this.scrollable_lines;
        bar_y = but_h + scrollbar_travel * (this.delta * ratio) / (this.row_count * this.row_h);
        drag_distance_per_row = scrollbar_travel / this.scrollable_lines;
        // panel info
		narrowSbar_x = this.x + this.w - s.clamp(ui.narrowSbarWidth, 5, this.w);
        this.max_scroll = this.scrollable_lines * this.row_h;
        if (ppt.sbarShow != 1) but.set_scroll_btns_hide();
    }

    this.draw = gr => {
        if (this.scrollable_lines > 0 && this.active) {
			let sbar_x = this.x, sbar_w = this.w;
			if (ppt.sbarShow == 1) {sbar_x = !this.narrow ? this.x : narrowSbar_x; sbar_w = !this.narrow ? this.w : ui.narrowSbarWidth;}
            switch (ui.sbarType) {
                case 0:
					gr.FillSolidRect(sbar_x, this.y + bar_y, sbar_w, bar_ht, this.narrow ? col[alpha2] : !b_is_dragging ? col[alpha] : col['max']); break;
                case 1:
					if (!this.narrow || ppt.sbarShow != 1) gr.FillSolidRect(sbar_x, this.y - p.sbar_o, this.w, this.h + p.sbar_o * 2, col['bg']); 
					gr.FillSolidRect(sbar_x, this.y + bar_y, sbar_w, bar_ht, this.narrow ? col[alpha2] : !b_is_dragging ? col[alpha] : col['max']); break;
                case 2:
					ui.theme.SetPartAndStateID(6, 1); if (!this.narrow || ppt.sbarShow != 1) ui.theme.DrawThemeBackground(gr, sbar_x, this.y, sbar_w, this.h); 
					ui.theme.SetPartAndStateID(3, this.narrow ? 2 : !hover && !b_is_dragging ? 1 : hover && !b_is_dragging ? 2 : 3); 
					ui.theme.DrawThemeBackground(gr, sbar_x, this.y + bar_y, sbar_w, bar_ht); break; 
            }
        }
    }

    this.paint = () => {
		if (init) return; alpha = hover ? alpha1 : alpha2;
        clearTimeout(bar_timer); bar_timer = null;
        bar_timer = setInterval(() => {alpha = hover ? Math.min(alpha += inStep, alpha2) : Math.max(alpha -= 3, alpha1); window.RepaintRect(this.x, this.y, this.w, this.h);
        if (hover && alpha == alpha2 || !hover && alpha == alpha1) {hover_o = hover; clearTimeout(bar_timer); bar_timer = null;}}, 25);
    }

    this.lbtn_dn = (p_x, p_y) => {
        this.onSbar = false;
        if (!ppt.sbarShow && ppt.touchControl) return tap(p_y);
        const x = p_x - this.x, y = p_y - this.y; let dir;
        if (x > this.w || y < 0 || y > this.h || this.row_count <= this.rows_drawn) return;
        if (x < 0) {if (!ppt.touchControl) return; else return tap(p_y);}
        this.onSbar = true;
        if (y < but_h || y > this.h - but_h) return;
        if (y < bar_y) dir = 1; // above bar
        else if (y > bar_y + bar_ht) dir = -1; // below bar
        if (y < bar_y || y > bar_y + bar_ht) shift_page(dir, nearest(y));
        else { // on bar
            b_is_dragging = true; but.Dn = true; window.RepaintRect(this.x, this.y, this.w, this.h);
            initial_drag_y = y - bar_y + but_h;
        }
    }

    this.lbtn_dblclk = (p_x, p_y) => {
        const x = p_x - this.x, y = p_y - this.y; let dir;
        if (x < 0 || x > this.w || y < 0 || y > this.h || this.row_count <= this.rows_drawn) return;
        if (y < but_h || y > this.h - but_h) return;
        if (y < bar_y) dir = 1; // above bar
        else if (y > bar_y + bar_ht) dir = -1; // below bar
        if (y < bar_y || y > bar_y + bar_ht) shift_page(dir, nearest(y));
    }

    this.move = (p_x, p_y) => {
		this.active = true;
		const x = p_x - this.x, y = p_y - this.y;
		if (x >= 0 && x <= this.w && y >= 0 && y <= this.h) {
			sbarZone = true;
			this.narrow = false;
			if (ppt.sbarShow == 1 && sbarZone != sbarZone_o) {but.set_scroll_btns_hide(!sbarZone || this.scrollable_lines < 1 || ppt.img_only, this.type); sbarZone_o = sbarZone;}
		} else sbarZone = false;
		if (ppt.sbarShow == 1) {minimise_debounce(); hide_debounce();}
        if (ppt.touchControl) {
            const delta = reference - p_y;
            if (delta > mv || delta < -mv) {
                reference = p_y;
                if (ppt.flickDistance) offset = s.clamp(offset + delta, 0, this.max_scroll);
            }
        }
        if (this.touch.dn) {if (but.btns["mt"] && but.btns["mt"].trace(p.m_x, p.m_y) || !p.text_trace) return; ts = Date.now(); if (ts - startTime > 300) startTime = ts; lastTouchDn = ts; this.check_scroll(initial_scr + (initial_y - p_y) * ppt.touchStep, ppt.touchStep == 1 ? 'drag' : 'scroll'); return;}
        if (x < 0 || x > this.w || y > bar_y + bar_ht || y < bar_y || but.Dn) hover = false; else hover = true;
        if (!bar_timer && (hover != hover_o || this.active != active_o)) {init = false; this.paint(); active_o = this.active;}
        if (!b_is_dragging || this.row_count <= this.rows_drawn) return;
        this.check_scroll(Math.round((y - initial_drag_y) / drag_distance_per_row) * this.row_h, 'bar');
    }

    this.lbtn_drag_up = (p_x, p_y) => {
        if (this.touch.dn) {
            this.touch.dn = false;
            clearInterval(ticker);
            if (!counter) track(true);
            if (Math.abs(velocity) > min && Date.now() - startTime < 300) {
                amplitude = ppt.flickDistance * velocity * ppt.touchStep;
                timestamp = Date.now();
                this.check_scroll(Math.round((this.scroll + amplitude) / this.row_h) * this.row_h, 'inertia');
            }
        }
    }

    this.lbtn_up = (p_x, p_y) => {
		if (p.clicked) {if (ppt.sbarShow == 1 && this.narrow) but.set_scroll_btns_hide(true, this.type); return;}
		if (but.Dn == "src") return;
		const x = p_x - this.x, y = p_y - this.y;
        if (!hover && b_is_dragging) this.paint(); else window.RepaintRect(this.x, this.y, this.w, this.h); if (b_is_dragging) {b_is_dragging = false; but.Dn = false;} initial_drag_y = 0;
        if (this.timer_but) {clearTimeout(this.timer_but); this.timer_but = null;}; this.count = -1;
    }

    const tap = (p_y) => {
        if (!p.text_trace) return;
        if (amplitude) {clock = 0; this.scroll = this.delta;}
        counter = 0; initial_scr = this.scroll;
        this.touch.dn = true; initial_y = reference = p_y; if (!offset) offset = p_y;
        velocity = amplitude = 0;
        if (!ppt.flickDistance) return;
        frame = offset;
        startTime = timestamp = Date.now();
        clearInterval(ticker);
        ticker = setInterval(track, 100);
    }

    const track = (initial) => {
        let now, elapsed, delta, v;
        counter++; now = Date.now();
        if (now - lastTouchDn < 10000 && counter == 4)  p.last_pressed_coord = {x: -1, y: -1};
        elapsed = now - timestamp; if (initial) elapsed = Math.max(elapsed, 32);
        timestamp = now;
        delta = offset - frame;
        frame = offset;
        v = 1000 * delta / (1 + elapsed);
        velocity = 0.8 * v + 0.2 * velocity;
    }

    this.check_scroll = (new_scroll, type) => {
        const b = s.clamp(new_scroll, 0, this.max_scroll);
        if (b == this.scroll) return; this.scroll = b;
        if (ppt.smooth) {
            elap = 16; event = type || 'scroll'; this.item_y = 0; start = this.delta;
            if (event != 'drag') {
				if (b_is_dragging && Math.abs(this.delta - this.scroll) > scrollbar_height) event = 'barFast';
                clock = Date.now(); if (!this.draw_timer) {scroll_timer(); smooth_scroll();}
            } else scroll_drag();
        } else scroll_throttle();
    }

    const calc_item_y = () => {ix = Math.round(this.delta / ui.font_h + 0.4); this.item_y = Math.round(ui.font_h * ix + p.text_t - this.delta);}
	const position = (Start, End, Elapsed, Duration, Event) => {if (Elapsed > Duration) return End; if (Event == 'drag') return; const n = Elapsed / Duration; return Start + (End - Start) * ease[Event](n);}
    const scroll_drag = () => {this.delta = this.scroll; scroll_to(); calc_item_y();}
    const scroll_finish = () => {if (!this.draw_timer) return; this.delta = this.scroll; scroll_to(); calc_item_y(); clearTimeout(this.draw_timer); this.draw_timer = null;}
    const scroll_to = () => {bar_y = but_h + scrollbar_travel * (this.delta * ratio) / (this.row_count * this.row_h); p.paint();}
    const shift = (dir, nearest_y) => {let target = Math.round((this.scroll + dir * -this.rows_drawn * this.row_h) / this.row_h) * this.row_h; if (dir == 1) target = Math.max(target, nearest_y); else target = Math.min(target, nearest_y); return target;}
    const shift_page = (dir, nearest_y) => {this.check_scroll(shift(dir, nearest_y), 'full'); if (!this.timer_but) {this.timer_but = setInterval(() => {if (this.count > 1) {this.check_scroll(shift(dir, nearest_y), 'full');} else this.count++;}, 100);}}
    const smooth_scroll = () => {
        this.delta = position(start, this.scroll, Date.now() - clock + elap, duration[event], event);
        if (Math.abs(this.scroll - this.delta) > 0.5) scroll_to(); else scroll_finish();
    }

    this.but = dir => {this.check_scroll(Math.round((this.scroll + dir * -this.row_h) / this.row_h) * this.row_h, 'step'); if (!this.timer_but) {this.timer_but = setInterval(() => {if (this.count > 6) {this.check_scroll(this.scroll + dir * -this.row_h, 'step');} else this.count++;}, 40);}}
    this.scroll_to_end = () => this.check_scroll(this.max_scroll, 'full');
}
alb_scrollbar.type = "alb"; art_scrollbar.type = "art";

function Buttons() {
    let amBioBtn = ppt.amBioBtn, amRevBtn = ppt.amRevBtn, lfmBioBtn = ppt.lfmBioBtn, lfmRevBtn = ppt.lfmRevBtn, amlfmBioBtn = "", amlfmRevBtn = "", lfmamBioBtn = "", lfmamRevBtn = "";
    if (!ui.BtnName) {amBioBtn = ""; amRevBtn = ""; lfmBioBtn = ""; lfmRevBtn = "";} else {amlfmBioBtn = amBioBtn + " | " + lfmBioBtn; amlfmRevBtn = amRevBtn + " | " + lfmRevBtn; lfmamBioBtn = lfmBioBtn + " | " + amBioBtn; lfmamRevBtn = lfmRevBtn + " | " + amRevBtn;}
    const albScrBtns = ["alb_scrollDn", "alb_scrollUp"], artScrBtns = ["art_scrollDn", "art_scrollUp"], orig_mt_sz = 15 * s.scale, scc = 2, rc = StringFormat(2, 1, 3), scrBtns = albScrBtns.concat(artScrBtns);
    let arrow_symb = 0, b_x, btnTxt = false, btnVisible = false, byDn, byUp, cur_btn = null, drawTxt = "", hoverCol = ui.col.text & RGBA(255, 255, 255, 51), iconFontName = "Segoe UI Symbol", iconFontStyle = 0, init = true, l = false, m = false, mt = false, mtL = false, name_w = 0, r = false, sAlpha = 255, sbarButPad = s.clamp(ppt.sbarButPad / 100, -0.5, 0.3), scrollBtn = false, scrollBtn_x, scrollDn_y, scrollUp_y, sp_w = [], src_fs = 12, src_h = 19, src_im = false, src_w = 50, src_font = gdi.Font("Segoe UI", src_fs, 1), tooltip, transition, tt_start = Date.now() - 2000, zoom_mt_sz = Math.max(Math.round(orig_mt_sz * ppt.zoomBut / 100), 7), scale = Math.round(zoom_mt_sz / orig_mt_sz * 100); ppt.zoomBut = scale;
	let mt_w = 12, mtCol = s.toRGB(ui.col.text), mtFont = gdi.Font("FontAwesome", 15 * scale / 100, 0), mtFontL = gdi.Font("FontAwesome", 14 * scale / 100, 0);
    this.btns = {}; this.Dn = false; this.r_h1 = 0; this.r_h2 = 0; this.r_w1 = 0; this.r_w2 = 0; this.ratingImages = []; if (ui.stars == 1 && ui.lfmTheme) this.ratingImagesLfm = []; this.show_tt = true;

	this.setSbarIcon = () => {
		switch (ppt.sbarButType) {
			case 0:
				iconFontName = "Segoe UI Symbol"; iconFontStyle = 0;
				if (!ui.sbarType) {
					arrow_symb = ui.scr_but_w < Math.round(14 * s.scale) ? "\uE018" : "\uE0A0"; sbarButPad = ui.scr_but_w < Math.round(15 * s.scale) ? -0.3 : -0.22;
				} else {
					arrow_symb = ui.scr_but_w < Math.round(14 * s.scale) ? "\uE018" : "\uE0A0"; sbarButPad = ui.scr_but_w < Math.round(14 * s.scale) ? -0.26 : -0.22;
				}
				break;
			case 1: arrow_symb = 0; break;
			case 2:
				arrow_symb = ppt.arrowSymbol.replace(/\s+/g, "").charAt(); if (!arrow_symb.length) arrow_symb = 0;
				if (ppt.customCol && ppt.butCustIconFont.length) { 
					const butCustIconFont = ppt.butCustIconFont.splt(1);
					iconFontName = butCustIconFont[0];
					iconFontStyle = Math.round(s.value(butCustIconFont[1], 0, 0));
				}				
				break;
			}
	}; this.setSbarIcon();

    const clear = () => {this.Dn = false; Object.values(this.btns).forEach(v => v.down = false);}
    const scroll = () => ppt.sbarShow && alb.show;
    const scroll_alb = () => ppt.sbarShow && !ppt.artistView && !ppt.img_only && t.alb_txt && alb_scrollbar.scrollable_lines > 0 && alb_scrollbar.active && !alb_scrollbar.narrow;
    const scroll_art = () => ppt.sbarShow && ppt.artistView && !ppt.img_only && t.art_txt && art_scrollbar.scrollable_lines > 0 && art_scrollbar.active && !art_scrollbar.narrow;
    const src_tiptext = () => "Switch To " + (ppt.artistView ? (!ppt.allmusic_bio ? (!ppt.lockBio || ppt.bothBio ? "Prefer " : "") + "AllMusic" + (ppt.bothBio ? " First" : "") : (!ppt.lockBio || ppt.bothBio ? "Prefer " : "") + "Last.fm" + (ppt.bothBio ? " First" : "")) : (!ppt.allmusic_alb ? (!ppt.lockRev || ppt.bothRev ? "Prefer " : "") + "AllMusic"  + (ppt.bothRev ? " First" : ""): (!ppt.lockRev || ppt.bothRev ? "Prefer " : "") + "Last.fm" + (ppt.bothRev ? " First" : "")));
    const tt = (n, force) => {if (tooltip.Text !== n || force) {tooltip.Text = n; tooltip.SetMaxWidth(800); tooltip.Activate();}}

	this.clear_tooltip = () => {if (!tooltip.Text || !this.btns["mt"].tt) return; this.btns["mt"].tt.stop();}
    this.create_images = () => {
		const sz = arrow_symb == 0 ? Math.max(Math.round(ui.but_h * 1.666667), 1) : 100, sc = sz / 100, iconFont = gdi.Font(iconFontName, sz, iconFontStyle);
		sAlpha = !ui.sbarCol ? [75, 192, 228] : [68, 153, 255];
		const hovAlpha = (!ui.sbarCol ? 75 : (!ui.sbarType ? 68 : 51)) * 0.4;
		hoverCol = !ui.sbarCol ? RGBA(ui.col.t, ui.col.t, ui.col.t, hovAlpha) : ui.col.text & RGBA(255, 255, 255, hovAlpha);
		scrollBtn = s.gr(sz, sz, true, g => {g.SetTextRenderingHint(3); g.SetSmoothingMode(2); if (ppt.sbarCol) {arrow_symb == 0 ? g.FillPolygon(ui.col.text, 1, [50 * sc, 0, 100 * sc, 76 * sc, 0, 76 * sc]) : g.DrawString(arrow_symb, iconFont, ui.col.text, 0, sz * sbarButPad, sz, sz, StringFormat(1, 1));} else {arrow_symb == 0 ? g.FillPolygon(RGBA(ui.col.t, ui.col.t, ui.col.t, 255), 1, [50 * sc, 0, 100 * sc, 76 * sc, 0, 76 * sc]) : g.DrawString(arrow_symb, iconFont, RGBA(ui.col.t, ui.col.t, ui.col.t, 255), 0, sz * sbarButPad, sz, sz, StringFormat(1, 1));} g.SetSmoothingMode(0);});}; this.create_images();
    this.create_mt = () => {
		switch (ui.fontAwesomeInstalled) {
			case true: 
				mtCol = s.toRGB(ui.col.text); 
				s.gr(1, 1, true, g => {
					mt_w = Math.max(g.CalcTextWidth("\uF107", mtFont), g.CalcTextWidth("\uF023", mtFontL), g.CalcTextHeight("\uF107", mtFont), g.CalcTextHeight("\uF023", mtFontL));});
				break;
			case false:
				const sz = Math.max(Math.round(20 * scale / 100), 20), sc = sz / 100;
				mt = s.gr(sz, sz, true, g => {g.SetSmoothingMode(2); 
				g.FillPolygon(ui.col.text, 1, [50 * sc, 0, 100 * sc, 76 * sc, 0, 76 * sc]); 
				g.SetSmoothingMode(0);}); 
				mtL = s.gr(sz, sz, true, g => {g.SetSmoothingMode(2); 
				g.FillSolidRect(0, 0, sz, sz, ui.col.text); 
				g.SetSmoothingMode(0);});
				break;
		}
	}; this.create_mt();
    this.lbtn_dn = (x, y) => {this.move(x, y); if (!cur_btn || cur_btn.hide) {this.Dn = false; return false} else this.Dn = cur_btn.name; cur_btn.down = true; cur_btn.cs("down"); cur_btn.lbtn_dn(x, y); return true;}
	this.create_tooltip = () => tooltip = window.CreateTooltip("Segoe UI", 15 * s.scale * ppt.get(" Zoom Tooltip (%)", 100) / 100, 0); this.create_tooltip();
    this.leave = () => {if (cur_btn) {cur_btn.cs("normal"); if (!cur_btn.hide) transition.start();} cur_btn = null;}
    this.on_script_unload = () => tt("");
    this.draw = gr => Object.values(this.btns).forEach(v => {if (!v.hide) v.draw(gr);});
    this.reset = () => transition.stop();

	this.resetZoom = () => {
		ppt.zoomFont = 100; ppt.zoomHead = 115;
		zoom_mt_sz = orig_mt_sz;
		scale = ppt.zoomBut = 100;
		mtFont = gdi.Font("FontAwesome", 15 * scale / 100, 0);
		mtFontL = gdi.Font("FontAwesome", 14 * scale / 100, 0);
		ppt.set(" Zoom Tooltip (%)", 100); ui.get_font(); this.create_mt(); this.create_tooltip(); this.refresh(true); t.toggle(12);
	}

    this.set_scroll_btns_hide = (set, autoHide) => {
		if (autoHide) {
			const arr = autoHide == "both" ? scrBtns : autoHide == "alb" ? albScrBtns : artScrBtns;
			arr.forEach((v, i) => {if (this.btns[v]) this.btns[v].hide = set;}); t.paint();
		} else {
			if (!ppt.sbarShow && !set) return;
			scrBtns.forEach((v, i) => {if (this.btns[v]) this.btns[v].hide = i < 2 ? !scroll_alb() : !scroll_art();});
		}
	}

    this.set_src_btn_hide = () => {if (this.btns.src) this.btns.src.hide = !ppt.heading || !t.head || ppt.img_only;}

    const drawPolyStar = (gr, x, y, out_radius, in_radius, points, line_thickness, line_color, fill_color) => {
        const point_arr = []; let rr = 0;
        for (let i = 0; i != points; i++) {i % 2 ? rr = Math.round((out_radius-line_thickness * 4) / 2) / in_radius : rr = Math.round((out_radius-line_thickness * 4) / 2); const x_point = Math.floor(rr * Math.cos(Math.PI * i / points * 2 - Math.PI / 2)), y_point = Math.ceil(rr * Math.sin(Math.PI * i / points * 2 - Math.PI / 2)); point_arr.push(x_point + out_radius/2); point_arr.push(y_point + out_radius/2);}
        const img = s.gr(out_radius, out_radius, true, g => {g.SetSmoothingMode(2); g.FillPolygon(fill_color, 1, point_arr); if (line_thickness > 0) g.DrawPolygon(line_color, line_thickness, point_arr);});
        gr.DrawImage(img, x, y, out_radius, out_radius, 0, 0, out_radius, out_radius);
    }

	const setRatingImages = (w, h, onCol, offCol, borCol, lfm) => {
        w = w * scc; h = h * scc;
		const star_indent = 2;
        let img = null, real_rating = -1, star_height = h, star_padding = -1, star_size = h;
		while (star_padding <= 0) {star_size = star_height; star_padding = Math.round((w - 5 * star_size) / 4); star_height--;}
		const star_vpadding = star_height < h ? Math.floor((h - star_height) / 2) : 0;
		for (let rating = 0; rating < 11; rating++) {
			real_rating = rating / 2;
			if (Math.round(real_rating) != real_rating) {
                const img_off = s.gr(w, h, true, g => {for (let i = 0; i < 5; i++) drawPolyStar(g, i * (star_size + star_padding), star_vpadding, star_size, star_indent, 10, 0, borCol, offCol);});
                const img_on = s.gr(w, h, true, g => {for (let i = 0; i < 5; i++) drawPolyStar(g, i * (star_size + star_padding), star_vpadding, star_size, star_indent, 10, 0, borCol, onCol);});
                const half_mask_left = s.gr(w, h, true, g => {g.FillSolidRect(0, 0, w, h, RGBA(255, 255, 255, 255)); g.FillSolidRect(0, 0, Math.round(w * rating / 10), h, RGBA(0, 0, 0, 255));});
                const half_mask_right = s.gr(w, h, true, g => {g.FillSolidRect(0, 0, w, h, RGBA(255, 255, 255, 255)); g.FillSolidRect(Math.round(w * rating / 10), 0, w - Math.round(w * rating / 10), h, RGBA(0, 0, 0, 255));});
				img_on.ApplyMask(half_mask_left); img_off.ApplyMask(half_mask_right);
                img = s.gr(w, h, true, g => {g.DrawImage(img_off, 0, 0, w, h, 0, 0, w, h); g.DrawImage(img_on, 0, 0, w, h, 0, 0, w, h);});
			} else img = s.gr(w, h, true, g => {for (let i = 0; i < 5; i++) drawPolyStar(g, i * (star_size + star_padding), star_vpadding, star_size, star_indent, 10, 0, borCol, i < real_rating ? onCol : offCol);});
			!lfm ? this.ratingImages[rating] = img : this.ratingImagesLfm[rating] = img;
		}
        if (!lfm) {this.r_w1 = this.ratingImages[10].Width; this.r_w2 = this.r_w1 / scc; this.r_h1 = this.ratingImages[10].Height; this.r_h2 = this.r_h1 / scc;}
	}

     this.create_stars = () => {
        const fs = ui.headFont.Size; src_fs = s.clamp(Math.round(fs * 0.47 + ui.srcSizeAdjust), ui.stars != 1 ? 10 : 12, fs); src_font = gdi.Font("Segoe UI", src_fs, 1);
        s.gr(1, 1, false, g => {
            src_h = g.CalcTextHeight("allmusic", src_font);
            sp_w = [" ", amRevBtn, lfmRevBtn, amBioBtn, lfmBioBtn, amlfmRevBtn, amlfmBioBtn].map(v => g.CalcTextWidth(v, src_font));
        });
        this.ratingImages = []; if (ui.stars == 1 && ui.lfmTheme) this.ratingImagesLfm = [];
        if (ui.stars == 1) setRatingImages(Math.round(src_h / 1.5) * 5, Math.round(src_h / 1.5), ui.col.starOn, ui.col.starOff, ui.col.starBor, false);
        else if (ui.stars == 2) {setRatingImages(Math.round(ui.font_h / 1.75) * 5, Math.round(ui.font_h / 1.75), ui.col.starOn, ui.col.starOff, ui.col.starBor, false);}
        if (ui.stars == 1 && ui.lfmTheme) setRatingImages(Math.round(src_h / 1.5) * 5, Math.round(src_h / 1.5), RGBA(225, 225, 245, 255), RGB(225, 225, 245, 60), ui.col.starBor, true);
        m = (/[gjpqy]/).test(amRevBtn+lfmRevBtn+amBioBtn+lfmBioBtn);
    }

    const Btn = function(x, y, w, h, type, ft, txt, stat, im, hide, l_dn, l_up, tiptext, hand, name) {
        this.draw = gr => {
            switch (this.type) {
                case 5: ui.theme.SetPartAndStateID(1, im[this.state]); ui.theme.DrawThemeBackground(gr, this.x, this.y, this.w, this.h); break;
                case 6: drawHeading(gr); break;
                case 7: drawMT(gr); break;
                default: drawScrollBtn(gr); break;
            }
        }

        this.cs = state => {this.state = state; if (state === "down" || state === "normal") this.tt.clear(); this.repaint();}
        this.lbtn_dn = () => {if (!but.Dn) return; this.l_dn && this.l_dn(x, y);}
        this.lbtn_up = (x, y) => {if (ppt.touchControl && Math.sqrt((Math.pow(p.last_pressed_coord.x - x, 2) + Math.pow(p.last_pressed_coord.y - y, 2))) > 3 * s.scale) return; if (this.l_up) this.l_up();}
        this.repaint = () => {const expXY = 2, expWH = 4; window.RepaintRect(this.x - expXY, this.y - expXY, this.w + expWH, this.h + expWH);}
        this.trace = (x, y) => {return x > this.x && x < this.x + this.w && y > this.y && y < this.y + this.h;}

        this.x = x; this.y = y; this.w = w; this.h = h; this.type = type; this.hide = hide; this.l_dn = l_dn; this.l_up = l_up; this.tt = new Tooltip; this.tiptext = tiptext; this.transition_factor = 0; this.state = "normal"; this.hand = hand; this.name = name;

        const drawHeading = gr => {
            let dh, dx1, dx2;
            if (!ppt.hdCenter) {if (ppt.src < 2) {dh = ppt.src ? (r || btnTxt ? (!ppt.hdRight && ui.BtnBg ? "" :  (ppt.hdLine != 2 ? "  " : " ")) : "") + t.heading + t.na : t.heading + t.na; dx1 = this.x + src_w; dx2 = this.x;} else {dh = t.heading + t.na; dx1 = this.x; dx2 = this.x + this.w - src_w;}} else dh = t.heading + t.na;
            switch (true) {
                case ppt.hdLine == 1: gr.DrawLine(this.x, this.y + ui.head_ln_h, this.x + this.w, this.y + ui.head_ln_h, ui.l_h, ui.col.bottomLine); break;
                case ppt.hdLine == 2:
                    if (!ppt.hdCenter) {
                        let dh_w = gr.CalcTextWidth(dh, ui.headFont) + sp_w[0] * (!ppt.hdRight || !btnVisible ? 2 : 0);
                        if (ppt.src == 2 && dh_w < this.w - src_w - sp_w[0] * (!ppt.hdRight || !btnVisible ? 3 : 1)) gr.DrawLine(this.x + dh_w, Math.round(this.y + this.h / 2), this.x + this.w - src_w - sp_w[0] * 3, Math.round(this.y + this.h / 2), ui.l_h, ui.col.centerLine);
                        if (ppt.src < 2 && src_w + sp_w[0] * 2 + dh_w < this.w) gr.DrawLine(dx1 + (btnVisible ? sp_w[0] * 3 : ppt.hdRight ? 0 : dh_w), Math.ceil(this.y + this.h / 2), this.x + this.w - (ppt.src ? dh_w : ppt.hdRight ? dh_w : 0), Math.ceil(this.y + this.h / 2), ui.l_h, ui.col.centerLine);
                    } else {
                        let dh_w = gr.CalcTextWidth(dh, ui.headFont) + sp_w[0] * 4, ln_l = (this.w - dh_w) / 2;
                        if (ln_l > 1) {gr.DrawLine(this.x, Math.ceil(this.y + this.h / 2), this.x + ln_l, Math.ceil(this.y + this.h / 2), ui.l_h, ui.col.centerLine); gr.DrawLine(this.x + ln_l + dh_w, Math.ceil(this.y + this.h / 2), this.x + this.w, Math.ceil(this.y + this.h / 2), ui.l_h, ui.col.centerLine);}
                    } break;
            }
            gr.GdiDrawText(dh, ui.headFont, ui.col.head, !ppt.hdCenter ? dx1 : this.x, this.y, !ppt.hdCenter ? this.w - src_w - (ppt.src == 2 ? 10 : 0) : this.w, this.h, !ppt.hdCenter ? t.c[ppt.hdRight] : t.cc);
            if (!btnVisible) return; let col;
            if (ui.BtnBg) {
                gr.SetSmoothingMode(2);
                if (l || !ui.lfmTheme) {
                    if (this.state !== "down") gr.FillRoundRect(dx2, ft - (m ? 1 : 0), src_w, src_h + (m ? 2 : 0), 2, 2, RGBA(ui.col.blend4[0], ui.col.blend4[1], ui.col.blend4[2], ui.col.blend4[3] * (1 - this.transition_factor)));
                    col = this.state !== "down" ? ui.get_blend(ui.col.blend2, ui.col.blend1, this.transition_factor, true) : ui.col.blend2;
                    gr.FillRoundRect(dx2, ft - (m ? 1 : 0), src_w, src_h + (m ? 2 : 0), 2, 2, col);
                    gr.DrawRoundRect(dx2, ft - (m ? 1 : 0), src_w, src_h + (m ? 2 : 0), 2, 2, 1, ui.col.blend3);
                } else {
                    gr.FillRoundRect(dx2, ft - (m ? 1 : 0), src_w, src_h + (m ? 2 : 0), 2, 2, RGBA(210, 19, 9, 114));
                    col = this.state !== "down" ? ui.get_blend(RGBA(244, 31, 19, 255), RGBA(210, 19, 9, 228), this.transition_factor, true) : RGBA(244, 31, 19, 255);
                    gr.FillRoundRect(dx2, ft - (m ? 1 : 0), src_w, src_h + (m ? 2 : 0), 2, 2, col);
                }
            }
            col = this.state !== "down" ? ui.get_blend(src_im.hover, src_im.normal, this.transition_factor, false) : src_im.hover;
            gr.GdiDrawText(drawTxt, src_font, col, dx2, ft, src_w, src_h, !r ? t.cc : t.c[0]);
            if (r) gr.DrawImage(t.alb_allmusic ? but.ratingImages[!t.btnRevBoth ? t.amRating : t.avgRating] : ui.BtnBg && ui.lfmTheme ? but.ratingImagesLfm[!t.btnRevBoth ? t.lfmRating : t.avgRating] : but.ratingImages[!t.btnRevBoth? t.lfmRating : t.avgRating], ppt.src == 2 ? this.x + this.w - but.r_w2 - (ui.BtnBg ? sp_w[0] : 0) : dx2 + name_w, ft + (Math.round(src_h - but.r_h2) / 2), but.r_w2, but.r_h2, 0, 0, but.r_w1, but.r_h1, 0, 255);
        }

        const drawMT = gr => {
			switch (ui.fontAwesomeInstalled) {
				case true:
					const col = this.state !== "down" ? ui.get_blend(im.hover, im.normal, this.transition_factor, true) : im.hover;
				    gr.SetTextRenderingHint(5);
					!p.lock ? gr.DrawString(!p.moreTags || !ppt.artistView ? "\uF107" : "\uF13A", mtFont, col, this.x, this.y, ft, txt, StringFormat(1, 1)) :
					gr.DrawString("\uF023", mtFontL, col, this.x, this.y + 3 * s.scale, ft, txt, StringFormat(1, 1));
					break;
				case false:
					const a = this.state !== "down" ? Math.min(sAlpha[0] + (sAlpha[1] - sAlpha[0]) * this.transition_factor, sAlpha[1]) : sAlpha[2];
					if (im[p.lock]) gr.DrawImage(im[p.lock], this.x, this.y, this.w / 1.5, this.h / 1.5, 0, 0, im[p.lock].Width, im[p.lock].Height, 180, a);
					break;
				}
        }

        const drawScrollBtn = gr => {
            const a = this.state !== "down" ? Math.min(sAlpha[0] + (sAlpha[1] - sAlpha[0]) * this.transition_factor, sAlpha[1]) : sAlpha[2];
			if (this.state !== "normal" && ui.sbarType == 1) gr.FillSolidRect(p.sbar_x, this.y, ui.sbar_w, this.h, hoverCol);
            if (scrollBtn) gr.DrawImage(scrollBtn, this.x + ft, txt, stat, stat, 0, 0, scrollBtn.Width, scrollBtn.Height, this.type == 1 || this.type == 3 ? 0 : 180, a);
        }
    }

    this.move = (x, y) => {
        const hover_btn = Object.values(this.btns).find(v => {
             if (!v.hide && (!this.Dn || this.Dn == v.name)) return v.trace(x, y);
        });
        let hand = false; init = false;
        check_scrollBtns(x, y, hover_btn); if (hover_btn) hand = hover_btn.hand; if (!tb.down) {
			if(!hand && this.hand) {
				window.SetCursor(32512);
				this.hand = false;
			} else if(hover_btn){
				window.SetCursor(32649);
				this.hand = true;
			}
		}		
        if (hover_btn && hover_btn.hide) {if (cur_btn) {cur_btn.cs("normal"); transition.start();} cur_btn = null; return null;} // btn hidden, ignore
        if (cur_btn === hover_btn) return cur_btn;
        if (cur_btn) {cur_btn.cs("normal"); transition.start();} // return prev btn to normal state
        if (hover_btn && !(hover_btn.down && hover_btn.type < 6)) {hover_btn.cs("hover"); if (this.show_tt && hover_btn.tiptext) hover_btn.tt.show(hover_btn.tiptext()); transition.start();}
        cur_btn = hover_btn;
        return cur_btn;
    }

    this.lbtn_up = (x, y) => {
        if (!cur_btn || cur_btn.hide || this.Dn != cur_btn.name) {clear(); return false;}
        clear();
        if (cur_btn.trace(x, y)) cur_btn.cs("hover");
        cur_btn.lbtn_up(x, y);
        return true;
    }

    this.wheel = step => {
        if (!ppt.mul_item || !this.btns["mt"] || !this.btns["mt"].trace(p.m_x, p.m_y)) return;
        zoom_mt_sz += step; zoom_mt_sz = s.clamp(zoom_mt_sz, 7, 100);
        window.RepaintRect(this.btns["mt"].x, this.btns["mt"].y, this.btns["mt"].w, this.btns["mt"].h);
        scale = Math.round(zoom_mt_sz / orig_mt_sz * 100); 
		mtFont = gdi.Font("FontAwesome", 15 * scale / 100, 0);
		mtFontL = gdi.Font("FontAwesome", 14 * scale / 100, 0);
		this.create_mt(); this.refresh(true); ppt.zoomBut = scale;
    }

    this.check = refresh => {
        if (!refresh) {this.set_scroll_btns_hide(); if (ppt.sbarShow == 1 && init) but.set_scroll_btns_hide(true, "both"); this.set_src_btn_hide();}
        if (!this.btns.src || !ppt.heading) return;
        l = ppt.artistView && t.bio_allmusic || !ppt.artistView && t.alb_allmusic ? 1 : 0; r = ui.stars == 1 && !ppt.artistView && (t.alb_allmusic && (!t.btnRevBoth ? t.amRating != -1 : t.avgRating != -1) || !t.alb_allmusic && (!t.btnRevBoth ? t.lfmRating != -1 : t.avgRating != -1));
        drawTxt = l ? (ui.BtnBg ? " " : "") + (!ppt.artistView ? (!t.btnRevBoth ? amRevBtn : amlfmRevBtn) : (!t.btnBioBoth ? amBioBtn : amlfmBioBtn)) + (ui.BtnBg || r ? " " : "") : (ui.BtnBg ? " " : "") + (!ppt.artistView ? (!t.btnRevBoth ? lfmRevBtn : lfmamRevBtn) : (!t.btnBioBoth ? lfmBioBtn : lfmamBioBtn)) + (ui.BtnBg || r ? " " : "");
        btnTxt = drawTxt.trim().length ? true : false; btnVisible = ppt.src && (r || btnTxt) && !ppt.hdCenter;
        if (!ppt.src || (!r && !btnTxt) || ppt.hdCenter) src_w = 0; else {
            name_w = 0;
            if (r) name_w = t.alb_allmusic ? (!t.btnRevBoth ? sp_w[1] : sp_w[5]) : (!t.btnRevBoth ? sp_w[2] : sp_w[5]);
            name_w = name_w + sp_w[0] * (ui.BtnBg ? (name_w ? 2 : 1) : 0);
            src_w = r ? name_w + this.r_w2 + (btnTxt || ui.BtnBg ? sp_w[0] : 0) : btnTxt ? (ppt.artistView ? (t.bio_allmusic ? (!t.btnBioBoth ? sp_w[3] : sp_w[6]) : (!t.btnBioBoth ? sp_w[4] : sp_w[6])) : (t.alb_allmusic ? (!t.btnRevBoth ? sp_w[1] : sp_w[5]) : (!t.btnRevBoth ? sp_w[2] : sp_w[5]))) + sp_w[0] * (ui.BtnBg ? 2 : 0) : 0; if (!ui.BtnBg) name_w += sp_w[0] * (btnTxt ? 2 : 0);
        }
    }

    this.refresh = upd => {
        if (upd) {b_x = p.sbar_x; byUp = Math.round(p.sbar_y); byDn = Math.round(p.sbar_y + p.sbar_h - ui.but_h); if (ui.sbarType < 2) {b_x -= 1; scrollBtn_x = (ui.but_h - ui.scr_but_w) / 2; scrollUp_y = -ui.arrow_pad + byUp + (ui.but_h - 1 - ui.scr_but_w) / 2; scrollDn_y = ui.arrow_pad + byDn + (ui.but_h - 1 - ui.scr_but_w) / 2;}}
        if (ppt.heading) {
            this.check();
            this.btns.src = new Btn(p.text_l, p.text_t - ui.heading_h, p.text_w, ui.headFont_h, 6, s.clamp(Math.round(p.text_t - ui.heading_h + (ui.headFont_h - src_h) / 2 + ui.src_pad), p.text_t - ui.heading_h, p.text_t - ui.heading_h + ui.headFont_h - src_h), "", "", "", !ppt.heading || !t.head || ppt.img_only, "", () => {t.toggle(ppt.artistView ? (!ppt.bothBio ? 0 : 6) : (!ppt.bothRev ? 1 : 7)); but.check(true); if (ui.blur) window.Repaint();}, () => src_tiptext(), true, "src");
        }
        src_im = {normal: l || (!ui.lfmTheme || ui.lfmTheme && !ui.BtnBg) ? ui.bg || !ui.bg && !ui.trans || ppt.blurDark || ppt.blurLight ? ui.col.btn : RGB(255, 255, 255) : RGB(225, 225, 245), hover: l || (!ui.lfmTheme || ui.lfmTheme && !ui.BtnBg) ?  ui.bg || !ui.bg && !ui.trans || ppt.blurDark || ppt.blurLight ? ui.col.text_h : RGB(255, 255, 255) : RGB(225, 225, 245)};
        if (ppt.mul_item) {
			switch (ui.fontAwesomeInstalled) {
				case true:
					this.btns.mt = new Btn(1 * s.scale, 0, mt_w * 1.5, mt_w * 1.5, 7, mt_w, mt_w, "", {normal: RGBA(mtCol[0], mtCol[1], mtCol[2], 50), hover: RGBA(mtCol[0], mtCol[1], mtCol[2], sAlpha[1])}, !ppt.mul_item, "", () => men.button(12 * scale / 100, 16), () => "Click: More...\r\nMiddle Click: " + (!p.lock ? "Lock: Stop Track Change Updates" : "Unlock") + "...", true, "mt");
					break;
				case false:
					this.btns.mt = new Btn(0, 0, 12 * scale / 100 * 1.5, 12 * scale / 100 * 1.5, 7, "", "", "", [mt, mtL], !ppt.mul_item, "", () => men.button(12 * scale / 100, 16), () => "Click: More...\r\nMiddle Click: " + (!p.lock ? "Lock: Stop Track Change Updates" : "Unlock") + "...", true, "mt");
					break;
			}
		} else delete this.btns.mt;
        if (ppt.sbarShow) {
            switch (ui.sbarType) {
                case 2:
                    this.btns.alb_scrollUp = new Btn(b_x, byUp, ui.but_h, ui.but_h, 5, "", "", "", {normal: 1, hover: 2, down: 3}, ppt.sbarShow == 1 && alb_scrollbar.narrow || !scroll_alb(), () => alb_scrollbar.but(1), "", "", false, "alb_scrollUp");
                    this.btns.alb_scrollDn = new Btn(b_x, byDn, ui.but_h, ui.but_h, 5, "", "", "", {normal: 5, hover: 6, down: 7}, ppt.sbarShow == 1 && alb_scrollbar.narrow || !scroll_alb(), () => alb_scrollbar.but(-1), "", "", false, "alb_scrollDn");
                    this.btns.art_scrollUp = new Btn(b_x, byUp, ui.but_h, ui.but_h, 5, "", "", "", {normal: 1, hover: 2, down: 3}, ppt.sbarShow == 1 && art_scrollbar.narrow || !scroll_art(), () => art_scrollbar.but(1), "", "", false, "art_scrollUp");
                    this.btns.art_scrollDn = new Btn(b_x, byDn, ui.but_h, ui.but_h, 5, "", "", "", {normal: 5, hover: 6, down: 7}, ppt.sbarShow == 1 && art_scrollbar.narrow || !scroll_art(), () => art_scrollbar.but(-1), "", "", false, "art_scrollDn");
                    break;
                default:
                    this.btns.alb_scrollUp = new Btn(b_x, byUp - p.top_corr, ui.but_h, ui.but_h + p.top_corr, 1, scrollBtn_x, scrollUp_y, ui.scr_but_w, "", ppt.sbarShow == 1 && alb_scrollbar.narrow || !scroll_alb(), () => alb_scrollbar.but(1), "", "", false, "alb_scrollUp");
                    this.btns.alb_scrollDn = new Btn(b_x, byDn, ui.but_h, ui.but_h + p.top_corr, 2, scrollBtn_x, scrollDn_y, ui.scr_but_w, "", ppt.sbarShow == 1 && alb_scrollbar.narrow || !scroll_alb(), () => alb_scrollbar.but(-1), "", "", false, "alb_scrollDn");
                    this.btns.art_scrollUp = new Btn(b_x, byUp - p.top_corr, ui.but_h, ui.but_h + p.top_corr, 3, scrollBtn_x, scrollUp_y, ui.scr_but_w, "", ppt.sbarShow == 1 && art_scrollbar.narrow || !scroll_art(), () => art_scrollbar.but(1), "", "", false, "art_scrollUp");
                    this.btns.art_scrollDn = new Btn(b_x, byDn, ui.but_h, ui.but_h + p.top_corr, 4, scrollBtn_x, scrollDn_y, ui.scr_but_w, "", ppt.sbarShow == 1 && art_scrollbar.narrow || !scroll_art(), () => art_scrollbar.but(-1), "", "", false, "art_scrollDn");
                    break;
            }
        }
        transition = new Transition(this.btns, v => v.state !== 'normal');
    }

    const Transition = function(items_arg, hover_predicate) {
        this.start = () => {
            const hover_in_step = 0.2, hover_out_step = 0.06;
            if (!transition_timer) {
                transition_timer = setInterval(() => {
                    Object.values(items).forEach(v => {
                        const saved = v.transition_factor;
                        if (hover(v)) v.transition_factor = Math.min(1, v.transition_factor += hover_in_step);
                        else v.transition_factor = Math.max(0, v.transition_factor -= hover_out_step);
                        if (saved !== v.transition_factor) v.repaint();
                    });
                    const running = Object.values(items).some(v => v.transition_factor > 0 && v.transition_factor < 1);
                    if (!running) this.stop();
                }, 25);
            }
        }
        this.stop = () => {
            if (transition_timer) {
                clearInterval(transition_timer);
                transition_timer = null;
            }
        }
    const items = items_arg, hover = hover_predicate; let transition_timer = null;
    }

    const Tooltip = function() {
        this.show = text => {if (Date.now() - tt_start > 2000) this.showDelayed(text); else this.showImmediate(text); tt_start = Date.now();}
        this.showDelayed = text => tt_timer.start(this.id, text);
        this.showImmediate = text => {tt_timer.set_id(this.id); tt_timer.stop(this.id); tt(text);}
        this.clear = () => tt_timer.stop(this.id);
        this.stop = () => tt_timer.force_stop();
        this.id = Math.ceil(Math.random().toFixed(8) * 1000);
        const tt_timer = TooltipTimer;
    }

    const TooltipTimer = new function() {
        let delay_timer, tt_caller = undefined;
        this.start = (id, text) => {
            const old_caller = tt_caller; tt_caller = id;
            if (!delay_timer && tooltip.Text) tt(text, old_caller !== tt_caller );
            else {
                this.force_stop();
                if (!delay_timer) {
                    delay_timer = setTimeout(() => {
                        tt(text);
                        delay_timer = null;
                    }, 500);
                }
            }
        }
        this.set_id = id => tt_caller = id;
        this.stop = id => {if (tt_caller === id) this.force_stop();}
        this.force_stop = () => {
            tt("");
            if (delay_timer) {
                clearTimeout(delay_timer);
                delay_timer = null;
            }
        }
    }

    const check_scrollBtns = (x, y, hover_btn) => {
            const arr = alb_scrollbar.timer_but ? albScrBtns : art_scrollbar.timer_but ? artScrBtns : false;
            if (arr) {
               if ((this.btns[arr[0]].down || this.btns[arr[1]].down) && !this.btns[arr[0]].trace(x, y) && !this.btns[arr[1]].trace(x, y)) {
                   this.btns[arr[0]].cs("normal"); this.btns[arr[1]].cs("normal");
                   if (alb_scrollbar.timer_but) {clearTimeout(alb_scrollbar.timer_but); alb_scrollbar.timer_but = null; alb_scrollbar.count = -1;}
                   if (art_scrollbar.timer_but) {clearTimeout(art_scrollbar.timer_but); art_scrollbar.timer_but = null; art_scrollbar.count = -1;}
                }
            } else if (hover_btn) scrBtns.forEach(v => {
                if (hover_btn.name == v && hover_btn.down) {this.btns[v].cs("down"); hover_btn.l_dn();}
            });
        }
}

function MenuItems() {
    const cov_type_arr = ["Front", "Back", "Disc", "Icon", "Artist", "Cycle Above", "Cycle From Folder"], items = ppt.menu_items.splt(0), ln = p.tag.length, MenuMap = [], MF_GRAYED = 0x00000001, MF_SEPARATOR = 0x00000800, MF_STRING = 0x00000000, pl_show = s.value(items[3], 0, 2), tags_show = s.value(items[5], 1, 2);
    let amPth = [], b_n = "", bn, imgArtist = "", imgBlk = true, imgName = "", imgPth = false, lfmPth = [], imgList, paste_show = s.value(items[1], 1, 2), OrigIndex = 0, pl_menu = [], pths = [], shift = false, style_arr = [], tracksPth = [], undoFo = "", undoPth = "", undoTxt = "#!#";
	this.bioCounter = 0; this.revCounter = 0; this.right_up = false;

    const newMenuItem = (index, type, value) => {MenuMap[index] = {}; MenuMap[index].type = type; MenuMap[index].value = value;}
    const alignTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const n = ppt.style == 0 || ppt.style == 2 ? ["Left", "Centre", "Right", "Auto Align with Text"] : ["Top", "Centre", "Bottom", "Auto Align With Text"]; n.forEach((v, i) => {newMenuItem(Index, "Align", i); Menu.AppendMenuItem(MF_STRING, Index, v); if (i < 3) Index++; else Menu.CheckMenuItem(Index++, ppt.textAlign); if (i == 2) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); Menu.CheckMenuRadioItem(StartIndex, StartIndex + 2, StartIndex + (ppt.style == 0 || ppt.style == 2 ? ppt.alignH : ppt.alignV)); return Index;}
    const alignHTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const n = ["Left", "Centre", "Right"]; n.forEach((v, i) => {newMenuItem(Index, "alignH", i); Menu.AppendMenuItem(MF_STRING, Index, v); Index++;}); Menu.CheckMenuRadioItem(StartIndex, StartIndex + 2, StartIndex + ppt.alignH); return Index;}
    const alignVTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const c = [!ppt.alignV && !ppt.alignAuto, ppt.alignV == 1 && !ppt.alignAuto, ppt.alignV == 2 && !ppt.alignAuto, ppt.alignAuto], n = ["Top", "Centre", "Bottom", "Auto"]; n.forEach((v, i) => {newMenuItem(Index, "AlignV", i); Menu.AppendMenuItem(MF_STRING, Index, v); Index++; if (c[i]) Menu.CheckMenuRadioItem(StartIndex + i, StartIndex + i, StartIndex + i); if (i == 2) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); return Index;}
    const biographyTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; newMenuItem(Index, "Sources", 0); Index++; return Index;}
    const biogTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const c = [ppt.mul_item, ppt.cycPic, false, false], n = ["Show More Items Button", "Auto Cycle Images", "Cycle Time...", "Force Update"]; n.forEach((v, i) => {newMenuItem(Index, "Sources", i + 21); Menu.AppendMenuItem(MF_STRING, Index, v); Menu.CheckMenuItem(Index++, c[i]); if (i != 1) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); return Index;}
    const bioTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const c = [ppt.allmusic_bio && !ppt.bothBio, !ppt.allmusic_bio && !ppt.bothBio, ppt.bothBio, ppt.lockBio], n = [(!ppt.lockBio ? "Prefer " : "") + "AllMusic", (!ppt.lockBio ? "Prefer " : "") + "Last.fm", "Prefer Both", "Lock To Single Source"]; n.forEach((v, i) => {newMenuItem(Index, "Sources", i + 1); Menu.AppendMenuItem((i < 2 || i == 3) && ppt.bothBio ? MF_GRAYED : MF_STRING, Index, v); if (i > 1) Menu.CheckMenuItem(Index++, c[i]); else {Index++; if (c[i]) Menu.CheckMenuRadioItem(StartIndex + i, StartIndex + i, StartIndex + i);} if (i == 1 || i == 2) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); return Index;}
	const borderTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const c = [ppt.artBorderImgOnly == 1 || ppt.artBorderImgOnly == 3, ppt.artBorderDual == 1 || ppt.artBorderDual == 3, ppt.covBorderImgOnly == 1 || ppt.covBorderImgOnly == 3, ppt.covBorderDual == 1 || ppt.covBorderDual == 3], n = ["Photo [Image Only]", "Photo [Dual Mode]", "Cover [Image Only]", "Cover [Dual Mode]"]; n.forEach((v, i) => {newMenuItem(Index, "Border", i); Menu.AppendMenuItem(MF_STRING, Index, v); Menu.CheckMenuItem(Index++, c[i]); if (i == 1) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); return Index;}
    const circTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const c = [ppt.artCircImgOnly, ppt.artCircDual, ppt.covCircImgOnly, ppt.covCircDual], n = ["Photo [Image Only]", "Photo [Dual Mode]", "Cover [Image Only]", "Cover [Dual Mode]"]; n.forEach((v, i) => {newMenuItem(Index, "Circular", i); Menu.AppendMenuItem(MF_STRING, Index, v); Menu.CheckMenuItem(Index++, c[i]); if (i == 1) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); return Index;}
	const covTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const c = [false, false, false, false, false, ppt.loadCovAllFb, ppt.loadCovFolder], n = cov_type_arr; n.forEach((v, i) => {newMenuItem(Index, "Sources", i + 14); Menu.AppendMenuItem(img.cycCov && i < 5 ? MF_GRAYED : MF_STRING, Index, v); if (i > 4) Menu.CheckMenuItem(Index++, c[i]); else Index++; if (i == 4) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); Menu.CheckMenuRadioItem(StartIndex, StartIndex + 4, StartIndex + ppt.covType); return Index;}
    const cropTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const c = [ppt.artCropImgOnly, ppt.artCropDual, ppt.covCropImgOnly, ppt.covCropDual], g = [ppt.artCircImgOnly, ppt.artCircDual, ppt.covCircImgOnly, ppt.covCircDual], n = ["Photo [Image Only]", "Photo [Dual Mode]", "Cover [Image Only]", "Cover [Dual Mode]"]; n.forEach((v, i) => {newMenuItem(Index, "Crop", i); Menu.AppendMenuItem(!g[i] ? MF_STRING : MF_GRAYED, Index, v + (g[i] ? " N/A: Circular Set" : "")); Menu.CheckMenuItem(Index++, c[i]); if (i == 1) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); return Index;}
    const defaultTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const n = [ppt.panelActive ? "Inactivate" : "Activate Biography", "Panel Properties", "Configure..."]; if (ppt.panelActive) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0); n.forEach((v, i) => {newMenuItem(Index, "Default", i); if (i == 1 || shift || !ppt.panelActive) Menu.AppendMenuItem(MF_STRING, Index++, v); if ((shift || !ppt.panelActive) && !i) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); return Index;}
    const headingTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const c = [ppt.heading, !ppt.hdRight && !ppt.hdCenter, ppt.hdRight && !ppt.hdCenter, ppt.hdCenter, ppt.src, ppt.hdLine == 1, ppt.hdLine == 2, !ui.custHeadFont ? ppt.headFontStyle == 1 : false, !ui.custHeadFont ? ppt.headFontStyle == 2 : false, ppt.headFontStyle == 3, ppt.headFontStyle == 16, ppt.headFontStyle == 18], n = !ui.custHeadFont ? ["Show", "Left", "Right", "Center", "Button", "Line Bottom", "Line Center", "Bold", "Italic", "Bold Italic", "SemiBold [Segoe UI]", "SemiBold Italic [Segoe UI]", "Heading Title Format..."] : ["Show", "Left", "Right", "Center", "Button", "Line Bottom", "Line Center", "Font: Custom...", "Heading Title Format..."]; n.forEach((v, i) => {newMenuItem(Index, "Heading", i); Menu.AppendMenuItem(!i || ppt.heading && !(i == 4 && ppt.hdCenter) ? MF_STRING : MF_GRAYED, Index, v); if (i > 0 && i < 4 ) {Index++; if (c[i]) Menu.CheckMenuRadioItem(StartIndex + i, StartIndex + i, StartIndex + i);} else {Menu.CheckMenuItem(Index++, c[i]);} if (!i || i == 3 || i == 4 || i == 6 || i == 9 || i == n.length - 2) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); return Index;}
    const imageTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const c = [ppt.autoEnlarge, ppt.imgSmoothTrans], n = ["Enlarge on Hover", "Smooth Transition"]; n.forEach((v, i) => {newMenuItem(Index, "Image", i); Menu.AppendMenuItem(MF_STRING, Index, v); Menu.CheckMenuItem(Index++, c[i]); if (i) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); return Index;}
    const langTypeMenu= (Menu, StartIndex) => {let Index = StartIndex; const n = p.langArr; n.forEach((v, i) => {newMenuItem(Index, "Language", i); Menu.AppendMenuItem(MF_STRING, Index, v); Index++;}); Menu.CheckMenuRadioItem(StartIndex, StartIndex + n.length - 1, StartIndex + p.lfmLang_ix); return Index;}
    const lfmRevTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const n = ["Album", "Album + Track", "Track"]; n.forEach((v, i) => {newMenuItem(Index, "Sources", i + 9); Menu.AppendMenuItem(MF_STRING, Index, v); Index++;}); Menu.CheckMenuRadioItem(StartIndex, StartIndex + 2, StartIndex + ppt.inclTrackRev); return Index;}
    const modeTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const n = [!p.imgText ? "Auto Display" : "Image+Text", "Image Only", "Text Only"]; n.forEach((v, i) => {newMenuItem(Index, "Mode", i); Menu.AppendMenuItem(i != 1 || !ppt.autoEnlarge ? MF_STRING : MF_GRAYED, Index, v); Index++; if (i == 2) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); Menu.CheckMenuRadioItem(StartIndex, StartIndex + 2, StartIndex + (ppt.sameStyle ? (!ppt.img_only && !ppt.text_only ? 0 : ppt.img_only ? 1 : 2) : ppt.artistView ? ppt.bioMode : ppt.revMode)); return Index;}
    const moreAlbMenu = (Menu, StartIndex) => {let Index = StartIndex; const n = ["Manual Cycle: Wheel Over Button", "Auto Cycle Items", "Cycle Time...", "Reload"]; p.albums.forEach((v, i) => {newMenuItem(Index, "More-Album", i); Menu.AppendMenuItem(v.type != "label" ? MF_STRING : MF_GRAYED, Index, !i || v.type.includes("history") ? v.artist.replace(/&/g, "&&") + " - " + v.album.replace(/&/g, "&&") : v.album.replace(/&/g, "&&")); Index++; if (!i || v.type == "albumend" || v.type == "label" || v.type == "historyend") Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); if (p.albums.length) Menu.CheckMenuRadioItem(StartIndex, StartIndex + p.albums.length, StartIndex + p.alb_ix); n.forEach((v, i) => {newMenuItem(Index, "More-Album", p.albums.length + i); Menu.AppendMenuItem(!i ? MF_GRAYED : MF_STRING, Index, v); if (i == 1) Menu.CheckMenuItem(Index++, ppt.cycItem); else Index++; if (!i || i == 2) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); return Index;}
	const moreArtMenu = (Menu, StartIndex) => {let Index = StartIndex; const n = ["Manual Cycle: Wheel Over Button", "Auto Cycle Items", "Cycle Time...", "Reload"]; p.artists.forEach((v, i) => {newMenuItem(Index, "More-Artist", i); Menu.AppendMenuItem(v.type != "label" ? MF_STRING : MF_GRAYED, Index, v.name.replace(/&/g, "&&") + v.field.replace(/&/g, "&&")); Index++; if (!i || v.type == "similarend" || v.type == "label" || v.type == "tagend" || v.type == "historyend") Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); if (p.artists.length) Menu.CheckMenuRadioItem(StartIndex, StartIndex + p.artists.length, StartIndex + p.art_ix); n.forEach((v, i) => {newMenuItem(Index, "More-Artist", p.artists.length + i); Menu.AppendMenuItem(!i ? MF_GRAYED : MF_STRING, Index, v); if (i == 1) Menu.CheckMenuItem(Index++, ppt.cycItem); else Index++; if (!i || i == 2) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); return Index;}
    const openTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const fo = [imgPth, amPth[3], lfmPth[3], tracksPth[3]], n = ["Image", ppt.artistView ? "Biography [AllMusic]" : "Review [AllMusic]", ppt.artistView ? "Biography [Last.fm]" : "Review [Last.fm]", ppt.artistView ? "" : "Tracks [Last.fm]"]; let i = n.length; while (i--) if (!fo[i]) {n.splice(i, 1); fo.splice(i, 1); pths.splice(i, 1);} n.forEach((v, i) => {newMenuItem(Index, "Open", i); Menu.AppendMenuItem(MF_STRING, Index, v); Index++; if (!i && n.length > 1 && imgPth) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); return Index;}
	const optionsTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const c = [ppt.sameStyle, !p.imgText, ppt.smooth, ppt.touchControl, p.dblClick,,], n = ["Use Same Style for Artist && Album", "Dual Style Auto", "Smooth Scroll", "Touch Control", "Click Action: Use Double Click", "Fallback Text...", "Line Spacing...", "Reset Zoom", "Reload"]; n.forEach((v, i) => {newMenuItem(Index, "Options", i); Menu.AppendMenuItem(MF_STRING, Index, v); if (i < 2 || i > 2 && i < 6) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0); Menu.CheckMenuItem(Index++, c[i]);}); return Index;}
    const overlayTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const n = ["Gradient", "Standard", "Standard + Rim", "Rounded", "Rounded + Rim"]; n.forEach((v, i) => {newMenuItem(Index, "Overlay", i); Menu.AppendMenuItem(MF_STRING, Index, v); Menu.CheckMenuItem(Index++, i == ppt.overlayStyle); if (!i || i == 2) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); return Index;}
    const pasteTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const n = [ppt.artistView ? "Biography [AllMusic Location]" : "Review [AllMusic Location]", ppt.artistView ? "Biography [Last.fm Location]" : "Review [Last.fm Location]", "Open Last Edited", "Undo"]; n.forEach((v, i) => {newMenuItem(Index, "Paste", i); Menu.AppendMenuItem(!i && !amPth[2] || i == 1 && !lfmPth[2] || i == 2 && !undoPth || i == 3 && undoTxt == "#!#" ? MF_GRAYED : MF_STRING, Index, v); Index++; if (i == 1 || i == 2) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); return Index;}
    const photoTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const c = [ppt.cycPhoto, !ppt.cycPhoto], n = ["Cycle From Folder", "Artist"]; n.forEach((v, i) => {newMenuItem(Index, "Sources", i + 12); Menu.AppendMenuItem(MF_STRING, Index, v); Index++; if (c[i]) Menu.CheckMenuRadioItem(StartIndex + i, StartIndex + i, StartIndex + i);}); return Index;}
    const playlistTypeMenu = (i, Menu, StartIndex) => {let Index = StartIndex; for (let j = i * 30; j < Math.min(pl_menu.length, 30 + i * 30); j++) {newMenuItem(Index, "Playlists", j); Menu.AppendMenuItem(MF_STRING, Index, pl_menu[j].name); Index++;} if (OrigIndex + plman.ActivePlaylist >= StartIndex && OrigIndex + plman.ActivePlaylist <= StartIndex + 29) Menu.CheckMenuRadioItem(StartIndex, StartIndex + 29, OrigIndex + plman.ActivePlaylist); return Index;}
    const reflTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const c = [ppt.artReflImgOnly, ppt.artReflDual, ppt.covReflImgOnly, ppt.covReflDual], n = ["Photo [Image Only]", "Photo [Dual Mode]", "Cover [Image Only]", "Cover [Dual Mode]", "Auto Position", "Top", "Left", "Bottom", "Right"]; n.forEach((v, i) => {newMenuItem(Index, "Reflection", i); Menu.AppendMenuItem(MF_STRING, Index, v); if (i < 4) Menu.CheckMenuItem(Index++, c[i]); else Index++; if (i == 1 || i == 3) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); Menu.CheckMenuRadioItem(StartIndex + 4, StartIndex + 8, StartIndex + ppt.imgReflType + 4); return Index;}
    const revTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const c = [ppt.allmusic_alb && !ppt.bothRev, !ppt.allmusic_alb && !ppt.bothRev, ppt.bothRev, ppt.lockRev], n = [(!ppt.lockRev ? "Prefer " : "") + "AllMusic", (!ppt.lockRev ? "Prefer " : "") + "Last.fm", "Prefer Both", "Lock To Single Source"]; n.forEach((v, i) => {newMenuItem(Index, "Sources", i + 5); Menu.AppendMenuItem((i < 2 || i == 3) && ppt.bothRev ? MF_GRAYED : MF_STRING, Index, v); if (i > 1) Menu.CheckMenuItem(Index++, c[i]); else {Index++; if (c[i]) Menu.CheckMenuRadioItem(StartIndex + i, StartIndex + i, StartIndex + i);} if (i) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); return Index;}
	const sbarTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const n = ["Hide", "Auto", "Show", "Default", "Styled", "Themed", "Use Theme Metrics", "Arrows", "Triangles", "Custom Arrows", "Set Custom Arrows..."]; n.forEach((v, i) => {newMenuItem(Index, "Scrollbar", i); Menu.AppendMenuItem(ui.sbarType != 2 || i < 7 ? MF_STRING : MF_GRAYED, Index, v); if (i == 2 || i == 5 || i == 6 || i == 9) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0); if ( i == 6) Menu.CheckMenuItem(Index++, ppt.sbarWinMetrics); else Index++;}); Menu.CheckMenuRadioItem(StartIndex, StartIndex + 2, StartIndex + ppt.sbarShow); Menu.CheckMenuRadioItem(StartIndex + 3, StartIndex + 5, StartIndex + 3 + ui.sbarType); Menu.CheckMenuRadioItem(StartIndex + 7, StartIndex + 9, StartIndex + 7 + ppt.sbarButType); return Index;}
	const seekerTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const c = [false, false, false, ppt.imgBarDots == 2, ppt.imgBarDots == 1, ppt.imgCounter], n = ["Hide", "Auto", "Show", "Bar", "Dots", "Counter"]; n.forEach((v, i) => {newMenuItem(Index, "Seeker", i); Menu.AppendMenuItem(MF_STRING, Index, v); if (i == 2) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0); if (i > 2) Menu.CheckMenuItem(Index++, c[i]); else Index++;}); Menu.CheckMenuRadioItem(StartIndex, StartIndex + 2, StartIndex + ppt.imgBar); return Index;}
    const selectionTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const n = ["Prefer Now Playing", "Follow Selected Track (Playlist)"]; n.forEach((v, i) => {newMenuItem(Index, "Selection", i); Menu.AppendMenuItem(MF_STRING, Index, v); Index++;}); Menu.CheckMenuRadioItem(StartIndex, StartIndex + 1, StartIndex + ppt.focus); return Index;}
    const serverTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; newMenuItem(Index, "Server", 0); if (shift && utils.IsKeyPressed(0x11)) {Menu.AppendMenuItem(MF_GRAYED, Index, "Biography Server"); Menu.AppendMenuItem(MF_SEPARATOR, 0, 0); Index++;} return Index;}
    const servTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const n = ["Configure...", "Reset To Default"]; n.forEach((v, i) => {newMenuItem(Index, "Sources", i + 25); Menu.AppendMenuItem(MF_STRING, Index, v); Index++;}); return Index;}
	const shadowTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const c = [ppt.artBorderImgOnly > 1, ppt.artBorderDual > 1, ppt.covBorderImgOnly > 1, ppt.covBorderDual > 1], g = [ppt.artReflImgOnly, ppt.artReflDual, ppt.covReflImgOnly, ppt.covReflDual], n = ["Photo [Image Only]", "Photo [Dual Mode]", "Cover [Image Only]", "Cover [Dual Mode]"]; n.forEach((v, i) => {newMenuItem(Index, "Shadow", i); Menu.AppendMenuItem(!g[i] ? MF_STRING : MF_GRAYED, Index, v + (g[i] ? " N/A: Reflection Set" : "")); Menu.CheckMenuItem(Index++, c[i]); if (i == 1) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); return Index;}
	const sort = data => data.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
	const sourceHeadTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const c = [, , , ppt.sourceStyle == 1, ppt.sourceStyle == 2, ppt.sourceStyle == 3, ppt.sourceStyle == 16, ppt.sourceStyle == 18, false], n = ["Hide", "Auto", "Show", "Bold", "Italic", "Bold Italic", "SemiBold [Segoe UI]", "SemiBold Italic [Segoe UI]", "Subheading Text..."]; n.forEach((v, i) => {newMenuItem(Index, "SourceHead", i); Menu.AppendMenuItem(MF_STRING, Index, v); if (i < 3) Index++; else Menu.CheckMenuItem(Index++, c[i]); if (i == 2 || i == 5 || i == 7) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); Menu.CheckMenuRadioItem(StartIndex, StartIndex + 2, StartIndex + ppt.sourceHeading); return Index;}
    const stylesEditorTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const n = ["Press CTRL to Alter Existing Styles", "Create New Style...", "Rename Custom Style...", "Delete Custom Style...", "Export Custom Style...", "Reset Style..."]; n.forEach((v, i) => {newMenuItem(Index, "Styles", i); Menu.AppendMenuItem(!i ? MF_GRAYED : i == 1 || ppt.style > 4 || i == 5 ? MF_STRING : MF_GRAYED, Index, v); Index++; if (!i) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); return Index;}
    const styleTypeMenu = (Menu, StartIndex) => {style_arr = p.style_arr.slice(); let Index = StartIndex; style_arr.forEach((v, i) => {newMenuItem(Index, "Style", i); Menu.AppendMenuItem(MF_STRING, Index, v); Index++; if (i == 4) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0); if (style_arr.length > 5 && i == style_arr.length - 1) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); Menu.CheckMenuRadioItem(StartIndex, StartIndex + style_arr.length - 1, StartIndex + (ppt.sameStyle ? ppt.style : ppt.artistView ? ppt.bioStyle : ppt.revStyle)); return Index;}
    const tagsTypeMenu = (Menu, StartIndex) => {let Index = StartIndex, tags = false; for (let i = 0; i < ln; i++) if (p.tag[i].enabled) {tags = true; break;} for (let i = 0; i < ln + 3; i++) {newMenuItem(Index, "Tags", i); Menu.AppendMenuItem(!i || i == ln + 1 && !tags ? MF_GRAYED : MF_STRING, Index, !i ? "Write Existing File Info to Tags: " : i == ln + 1 ? "Proceed" + (tags ? "" : " N/A No Tags Enabled") : i == ln + 2 ? "Cancel" : i == ln ? p.tag[i - 1].name + (p.tag[i - 1].enabled ? " (" + p.tag[i - 1].enabled + ")" : "") : p.tag[i - 1].name); if (i && i < ln + 1) Menu.CheckMenuItem(Index++, p.tag[i - 1].enabled); else Index++; if (!i || i == 5 || i == 9) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0)} return Index;}
    const themeTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const c = [!ppt.blurDark && !ppt.blurBlend && !ppt.blurLight, ppt.blurDark, ppt.blurBlend, ppt.blurLight, ppt.covBlur, ppt.swapCol, ppt.summaryFirst], n = ["None", "Dark", "Blend", "Light", "Always Cover-Based", "Swap Colours", "Text: Summary First"]; n.forEach((v, i) 	=> {newMenuItem(Index, "Theme", i); Menu.AppendMenuItem(!ui.blur && i == 4 ? MF_GRAYED : MF_STRING, Index, v); if (i < 4) {Index++; if (c[i]) Menu.CheckMenuRadioItem(StartIndex + i, StartIndex + i, StartIndex + i);} else Menu.CheckMenuItem(Index++, c[i]); if (!i || i == 3  || i == 4 || i == 5) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); return Index;}
    const toggleTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const n = ppt.artistView ? "Biography: Switch To " + (!ppt.allmusic_bio ? (!ppt.lockBio || ppt.bothBio ? "Prefer " : "") + "AllMusic" + (ppt.bothBio ? " First" : "") : (!ppt.lockBio || ppt.bothBio ? "Prefer " : "") + "Last.fm" + (ppt.bothBio ? " First" : "")) : "Review: Switch To " + (!ppt.allmusic_alb ? (!ppt.lockRev || ppt.bothRev ? "Prefer " : "") + "AllMusic" + (ppt.bothRev ? " First" : "") : (!ppt.lockRev || ppt.bothRev ? "Prefer " : "") + "Last.fm" + (ppt.bothRev ? " First" : "")); newMenuItem(Index, "Toggle", 0); Menu.AppendMenuItem(MF_STRING, Index, n); Index++; Menu.AppendMenuItem(MF_SEPARATOR, 0, 0); return Index;}
	const trackHeadTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const c = [, , , ppt.trackStyle == 1, ppt.trackStyle == 2, ppt.trackStyle == 3, ppt.trackStyle == 16, ppt.trackStyle == 18, false], n = ["Hide", "Auto", "Show", "Bold", "Italic", "Bold Italic", "SemiBold [Segoe UI]", "SemiBold Italic [Segoe UI]", "Subheading Title Format..."]; n.forEach((v, i) => {newMenuItem(Index, "TrackHead", i); Menu.AppendMenuItem(MF_STRING, Index, v); if (i < 3) Index++; else Menu.CheckMenuItem(Index++, c[i]); if (i == 2 || i == 5 || i == 7) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); Menu.CheckMenuRadioItem(StartIndex, StartIndex + 2, StartIndex + ppt.trackHeading); return Index;}
	const webAlbumTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const artist = p.artists.length ? p.artists[0].name : name.artist(ppt.focus), c = [ppt.showTopAlbums, ppt.showAlbumHistory, ppt.autoLock], n = ["Show Top Albums", "Show Album History", "Auto Lock", "Reset Album History...", "Last.fm: " + artist + "...", "Last.fm: " + artist + ": Similar Artists...", "Last.fm: " + artist + ": Top Albums...", "AllMusic: " + artist + "..."]; n.forEach((v, i) => {newMenuItem(Index, "Web", i); Menu.AppendMenuItem(MF_STRING, Index, v); if (i < 3) Menu.CheckMenuItem(Index++, c[i]); else Index++; if (i == 1 || i == 2 || i == 3 || i == 4) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); return Index;}
    const webArtistTypeMenu = (Menu, StartIndex) => {let Index = StartIndex; const artist = p.artists.length ? p.artists[0].name : name.artist(ppt.focus), c = [ppt.showSimilarArtists, ppt.showMoreTags, ppt.showArtistHistory, ppt.autoLock], n = ["Show Similar Artists", "Show More Tags" + (ui.fontAwesomeInstalled ? " (Circle Button if Present)" : ""), "Show Artist History", "Auto Lock", "Reset Artist History...", "Last.fm: " + artist + "...", "Last.fm: " + artist + ": Similar Artists...", "Last.fm: " + artist + ": Top Albums...", "AllMusic: " + artist + "..."]; n.forEach((v, i) => {newMenuItem(Index, "Web", i); Menu.AppendMenuItem(MF_STRING, Index, v); if (i < 4) Menu.CheckMenuItem(Index++, c[i]); else Index++; if (i == 2 || i == 3 || i == 4 || i == 5) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0);}); return Index;}

    const blacklistImageMenu = (Menu, StartIndex) => {
        let blacklist = [], Index = StartIndex; bn = fb.ProfilePath + "yttm\\" + "blacklist_image.json";
		if (!s.file(bn)) s.save(bn, JSON.stringify({"blacklist":{}}), true); if (s.file(bn)) {b_n = imgArtist.clean().toLowerCase(); imgList = s.jsonParse(bn, false, 'file'); blacklist = imgList.blacklist[b_n] || [];}
		const n = [imgBlk ? "+ Add to Black List: " + imgArtist + "_" + imgName : "+ Add to Black List: " + (imgName ? "N/A - Requires Last.fm Artist Image. Selected Image : " + imgName : "N/A - No Image"), blacklist.length ? " - Remove from Black List (Click Name): " : "No Black Listed Images For Current Artist", "Undo"];
        for (let i = 0; i < 3; i++) {newMenuItem(Index, "ImageBlacklist", i); if (i < 2 || img.undo[0] == b_n) Menu.AppendMenuItem(!i && imgBlk || i == 2 ? MF_STRING : MF_GRAYED, Index, n[i]); if (!i) Menu.AppendMenuItem(MF_SEPARATOR, 0, 0); Index++;}
        blacklist.forEach((v, i) => {newMenuItem(Index, "ImageBlacklist", i + (img.undo[0] == b_n ? 3 : 2)); Menu.AppendMenuItem(MF_STRING, Index, (imgArtist + "_" + v).replace(/&/g, "&&")); Index++;});
        return Index;
    }

    this.fresh = () => {
		if (t.block() || !ppt.cycItem || p.zoom()) return;
		if (ppt.artistView) {
			this.bioCounter++; if (this.bioCounter < ppt.cycTimeItem) return; this.bioCounter = 0;
			if (p.artists.length < 2) return; this.wheel(1, true, false);
		}
		else {
			this.revCounter++; if (this.revCounter < ppt.cycTimeItem) return; this.revCounter = 0;
			if (p.albums.length < 2) return; this.wheel(1, true, false);
		}
	}

    this.playlists_changed = () => {if (!pl_show) return; pl_menu = []; for (let i = 0; i < plman.PlaylistCount; i++) pl_menu.push({name:plman.GetPlaylistName(i).replace(/&/g, "&&"), ix:i});}; this.playlists_changed();

    this.rbtn_up = (x, y) => {
        shift = utils.IsKeyPressed(0x10); this.right_up = true; const popupMenu = ["alignMenu", "alignHMenu", "alignVMenu", "bioMenu", "biographyMenu", "blackImageMenu", "borderMenu", "circMenu", "covMenu", "cropMenu", "headingMenu", "imageMenu", "langMenu", "lfmRevMenu", "menu", "openMenu", "optionsMenu", "overlayMenu", "pasteMenu", "photoMenu", "reflMenu", "revMenu", "sbarMenu", "seekerMenu", "selectionMenu", "servMenu", "shadowMenu", "styleMenu", "stylesEditorMenu", "sourceHeadMenu", "tagsMenu", "themeMenu", "trackHeadMenu"]; let handles, imgInfo = img.pth();
        popupMenu.forEach(v => this[v] = window.CreatePopupMenu()); let PlaylistsMenu; if (pl_show) PlaylistsMenu = window.CreatePopupMenu();
        amPth = ppt.artistView ? t.amBioPth() : t.amRevPth(); imgArtist = imgInfo.artist; imgPth = imgInfo.imgPth; imgBlk = imgInfo.blk && imgPth; imgName = imgBlk ? imgPth.slice(imgPth.lastIndexOf("_") + 1) : imgPth.slice(imgPth.lastIndexOf("\\") + 1); lfmPth = ppt.artistView ? t.lfmBioPth() : t.lfmRevPth(); tracksPth = t.lfmTrackPth(); pths = [imgPth, amPth[1], lfmPth[1], tracksPth[1]];
        const docTxt = s.doc.parentWindow.clipboardData.getData('text'); let idx, Index = 1;
        if (p.server) Index = serverTypeMenu(this.menu, Index);
        if (!ppt.img_only) Index = toggleTypeMenu(this.menu, Index);
        Index = modeTypeMenu(this.menu, Index);
        Index = biographyTypeMenu(this.biographyMenu, Index); this.biographyMenu.AppendTo(this.menu, MF_STRING, "Sources");
        Index = bioTypeMenu(this.bioMenu, Index); this.bioMenu.AppendTo(this.biographyMenu, MF_STRING, "Biography: " + (ppt.allmusic_bio ? !ppt.bothBio ? (!ppt.lockBio ? "Prefer " : "") + "AllMusic" : "Prefer Both" :  !ppt.bothBio ? (!ppt.lockBio ? "Prefer " : "") + "Last.fm" : "Prefer Both" ));
        Index = revTypeMenu(this.revMenu, Index); this.revMenu.AppendTo(this.biographyMenu, MF_STRING, "Review: " + (ppt.allmusic_alb ? !ppt.bothRev ? (!ppt.lockRev ? "Prefer " : "") + "AllMusic" : "Prefer Both" : !ppt.bothRev ? (!ppt.lockRev ? "Prefer " : "") + "Last.fm" : "Prefer Both")); this.biographyMenu.AppendMenuItem(MF_SEPARATOR, 0, 0);
        Index = lfmRevTypeMenu(this.lfmRevMenu, Index); this.lfmRevMenu.AppendTo(this.revMenu, MF_STRING, "Last.fm Type");
        Index = photoTypeMenu(this.photoMenu, Index); this.photoMenu.AppendTo(this.biographyMenu, MF_STRING, "Photo: " + (ppt.cycPhoto ? "Cycle" : "Artist"));
        Index = covTypeMenu(this.covMenu, Index); this.covMenu.AppendTo(this.biographyMenu, !p.alb_ix || ppt.artistView ? MF_STRING : MF_GRAYED, "Cover: " + (!p.alb_ix || ppt.artistView ? ppt.loadCovAllFb || ppt.loadCovFolder ? "Cycle" : cov_type_arr[ppt.covType] : "Front")); this.biographyMenu.AppendMenuItem(MF_SEPARATOR, 0, 0);
        Index = selectionTypeMenu(this.selectionMenu, Index); this.selectionMenu.AppendTo(this.biographyMenu, MF_STRING, "Selection Mode"); this.biographyMenu.AppendMenuItem(MF_SEPARATOR, 0, 0);
        Index = openTypeMenu(this.openMenu, Index); this.openMenu.AppendTo(this.biographyMenu, imgPth || amPth[3] || lfmPth[3] || tracksPth[3] ? MF_STRING : MF_GRAYED, "Open Containing Folder"); this.biographyMenu.AppendMenuItem(MF_SEPARATOR, 0, 0);
        if (paste_show == 2 || paste_show && shift) {Index = pasteTypeMenu(this.pasteMenu, Index); this.pasteMenu.AppendTo(this.biographyMenu, docTxt && !ppt.img_only ? MF_STRING : MF_GRAYED, "Paste Text From Clipboard"); this.biographyMenu.AppendMenuItem(MF_SEPARATOR, 0, 0);}
        Index = biogTypeMenu(this.biographyMenu, Index);
        Index = servTypeMenu(this.servMenu, Index); this.servMenu.AppendTo(this.biographyMenu, MF_STRING, "Server Settings..."); this.biographyMenu.AppendMenuItem(MF_SEPARATOR, 0, 0);
        Index = langTypeMenu(this.langMenu, Index); this.langMenu.AppendTo(this.biographyMenu, MF_STRING, "Last.fm Language");
        Index = styleTypeMenu(this.styleMenu, Index); this.styleMenu.AppendTo(this.menu, MF_STRING, "Layout");
        Index = stylesEditorTypeMenu(this.stylesEditorMenu, Index); this.stylesEditorMenu.AppendTo(this.styleMenu, MF_STRING, "Create && Manage Styles"); this.styleMenu.AppendMenuItem(MF_SEPARATOR, 0, 0);
        Index = headingTypeMenu(this.headingMenu, Index); this.headingMenu.AppendTo(this.styleMenu, MF_STRING, "Heading"); this.styleMenu.AppendMenuItem(MF_SEPARATOR, 0, 0);
        Index = sourceHeadTypeMenu(this.sourceHeadMenu, Index); this.sourceHeadMenu.AppendTo(this.styleMenu, MF_STRING, "Subheading [Source]"); this.styleMenu.AppendMenuItem(MF_SEPARATOR, 0, 0);
		Index = trackHeadTypeMenu(this.trackHeadMenu, Index); this.trackHeadMenu.AppendTo(this.styleMenu, ppt.inclTrackRev ? MF_STRING : MF_GRAYED, "Subheading [Track Review]"); this.styleMenu.AppendMenuItem(MF_SEPARATOR, 0, 0);
		Index = sbarTypeMenu(this.sbarMenu, Index); this.sbarMenu.AppendTo(this.styleMenu, MF_STRING, "Scrollbar"); this.styleMenu.AppendMenuItem(MF_SEPARATOR, 0, 0);
		Index = themeTypeMenu(this.themeMenu, Index); this.themeMenu.AppendTo(this.styleMenu, MF_STRING, "Theme");
		Index = overlayTypeMenu(this.overlayMenu, Index); this.overlayMenu.AppendTo(this.themeMenu, ppt.style < 4 ? MF_GRAYED : MF_STRING, "Overlay Type"); this.styleMenu.AppendMenuItem(MF_SEPARATOR, 0, 0);
		Index = optionsTypeMenu(this.optionsMenu, Index); this.optionsMenu.AppendTo(this.styleMenu, MF_STRING, "Mode");
        Index = imageTypeMenu(this.imageMenu, Index); this.imageMenu.AppendTo(this.menu, MF_STRING, "Image");
		Index = seekerTypeMenu(this.seekerMenu, Index); this.seekerMenu.AppendTo(this.imageMenu, !img.bar.disabled ? MF_STRING : MF_GRAYED, !img.bar.disabled ? "Seeker && Counter" : "Seeker && Counter N/A with Current Overlay Metrics"); this.imageMenu.AppendMenuItem(MF_SEPARATOR, 0, 0);
		if (ppt.style < 4) {Index = alignTypeMenu(this.alignMenu, Index); this.alignMenu.AppendTo(this.imageMenu, !ppt.img_only && t.text && !ppt.text_only ? MF_STRING : MF_GRAYED, "Alignment");}
        else {Index = alignHTypeMenu(this.alignHMenu, Index); this.alignHMenu.AppendTo(this.imageMenu, !ppt.img_only && t.text && !ppt.text_only ? MF_STRING : MF_GRAYED, "Alignment Horizontal"); Index = alignVTypeMenu(this.alignVMenu, Index); this.alignVMenu.AppendTo(this.imageMenu, !ppt.img_only && t.text && !ppt.text_only ? MF_STRING : MF_GRAYED, "Alignment Vertical");} this.imageMenu.AppendMenuItem(MF_SEPARATOR, 0, 0);
		Index = blacklistImageMenu(this.blackImageMenu, Index); this.blackImageMenu.AppendTo(this.imageMenu, MF_STRING, "Black List"); this.imageMenu.AppendMenuItem(MF_SEPARATOR, 0, 0);
		Index = circTypeMenu(this.circMenu, Index); this.circMenu.AppendTo(this.imageMenu, MF_STRING, "Circular");
        Index = cropTypeMenu(this.cropMenu, Index); this.cropMenu.AppendTo(this.imageMenu, MF_STRING, "Auto-Fill"); this.imageMenu.AppendMenuItem(MF_SEPARATOR, 0, 0);
        Index = reflTypeMenu(this.reflMenu, Index); this.reflMenu.AppendTo(this.imageMenu, MF_STRING, "Reflection");
		Index = borderTypeMenu(this.borderMenu, Index); this.borderMenu.AppendTo(this.imageMenu, MF_STRING, "Border");
		Index = shadowTypeMenu(this.shadowMenu, Index); this.shadowMenu.AppendTo(this.imageMenu, MF_STRING, "Shadow");
        if (pl_show == 2 || pl_show && shift) {this.menu.AppendMenuItem(MF_SEPARATOR, 0, 0); PlaylistsMenu.AppendTo(this.menu, MF_STRING, "Playlists"); const pl_me = [], pl_no = Math.ceil(pl_menu.length / 30); OrigIndex = Index; for (let j = 0; j < pl_no; j++) {pl_me[j] = window.CreatePopupMenu(); Index = playlistTypeMenu(j, pl_me[j], Index); pl_me[j].AppendTo(PlaylistsMenu, MF_STRING, "# " + (j * 30 + 1 +  " - " + Math.min(pl_menu.length, 30 + j * 30) + (30 + j * 30 > plman.ActivePlaylist && ((j * 30) - 1) < plman.ActivePlaylist ? "  >>>" : "")));}}
        if (tags_show == 2 || tags_show && shift) {this.menu.AppendMenuItem(MF_SEPARATOR, 0, 0); Index = tagsTypeMenu(this.tagsMenu, Index); handles = plman.GetPlaylistSelectedItems(plman.ActivePlaylist); this.tagsMenu.AppendTo(this.menu, handles.Count ? MF_STRING : MF_GRAYED, "Write Tags to Selected Tracks" + (handles.Count ? "" : ": N/A No Playlist Tracks Selected"));}
        Index = defaultTypeMenu(this.menu, Index);

        idx = this.menu.TrackPopupMenu(x, y);
        if (idx >= 1 && idx <= Index) {
            const i = MenuMap[idx].value;
            switch (MenuMap[idx].type) {
                case "Toggle": t.toggle(ppt.artistView ? (!ppt.bothBio ? 0 : 6) : (!ppt.bothRev ? 1 : 7)); break;
                case "Mode": if (ppt.sameStyle) p.mode(i); else {ppt.artistView ? ppt.bioMode = i : ppt.revMode = i; t.toggle(8);} break;
                case "Sources":
                    switch (i) {
                        case 1: case 2: t.toggle(0); break; case 3: t.toggle(4); break; case 4: t.toggle(2); break; case 5: case 6: t.toggle(1); break; case 7: t.toggle(5); break; case 8: t.toggle(3); break;
                        case 9: case 10: case 11: ppt.inclTrackRev = i - 9; p.inclTrackRev = ppt.inclTrackRev; if (ppt.inclTrackRev) serv.chk_track({force: true, artist: p.artists.length ? p.artists[0].name : name.artist(ppt.focus), title: name.title(ppt.focus)}); t.toggle(9); break;
                        case 12: case 13: ppt.cycPhoto = !ppt.cycPhoto; if (!ppt.artistView) img.clear_art_cache(); if (!p.art_ix && ppt.artistView || !p.alb_ix && !ppt.artistView) img.get_images(true); else img.get_multi(p.art_ix, p.alb_ix, true); break;
                        case 14: case 15: case 16: case 17:  case 18:  ppt.covType = i - 14; img.get_images(); break;
						case 19: img.toggle('loadCovAllFb'); break;
						case 20: img.toggle('loadCovFolder'); break;
                        case 21: t.toggle(14); break;
                        case 22: ppt.cycPic = !ppt.cycPic; break;
                        case 23: p.setCycPic(); break;
                        case 24: p.getData(1, ppt.focus, "force_update_bio", 0); break;
                        case 25: const open = (c, w) => {if (!s.run(c, w)) fb.ShowPopupMessage("Unable to launch your default text editor.", "Biography");}; open("\"" + p.bio_ini, 1); break;
                        case 26: const ns = $.WshShell.Popup("Reset server settings to default (biography.ini)\n\nOriginal will be backed up\n\nProceed?", 0, "Reset Server Settings", 1); if (ns != 1) return false; p.moveIni(true); window.Reload(); window.NotifyOthers("refresh_bio", "refresh_bio");} break;
                case "Selection": ppt.focus = !ppt.focus; p.changed(); t.on_playback_new_track(); img.on_playback_new_track(); break;
                case "Open": s.browser('explorer /select,' + pths[i], false); break;
                case "Paste":
                    switch (i) {
                        case 0: undoFo = amPth[0]; undoPth = amPth[1]; undoTxt = s.open(undoPth); s.buildPth(undoFo); s.save(undoPth, docTxt + "\r\n\r\nCustom " + (ppt.artistView ? "Biography" : "Review"), true); const amPth_n = ppt.artistView ? t.amBioPth() : t.amRevPth(); if (amPth[1] == amPth_n[1]) {ppt.artistView ? ppt.allmusic_bio = true : ppt.allmusic_alb = true;} window.NotifyOthers("get_txt_bio", "get_txt_bio"); t.grab(); if (ppt.text_only) t.paint(); break;
                        case 1: undoFo = lfmPth[0]; undoPth = lfmPth[1]; undoTxt = s.open(undoPth); s.buildPth(undoFo); s.save(undoPth, docTxt + "\r\n\r\nCustom " + (ppt.artistView ? "Biography" : "Review"), true); const lfmPth_n = ppt.artistView ? t.lfmBioPth() : t.lfmRevPth(); if (lfmPth[1] == lfmPth_n[1]) {ppt.artistView ? ppt.allmusic_bio = false: ppt.allmusic_alb = false;} window.NotifyOthers("get_txt_bio", "get_txt_bio"); t.grab(); if (ppt.text_only) t.paint(); break;
                        case 2: const open = (c, w) => {if (!s.run(c, w)) fb.ShowPopupMessage("Unable to launch your default text editor.", "Biography");}; open("\"" + undoPth, 1); break;
                        case 3: if (!undoTxt.length && s.file(undoPth)) {s.fs.DeleteFile(undoPth); window.NotifyOthers("reload_bio", "reload_bio"); if (!p.art_ix && ppt.artistView || !p.alb_ix && !ppt.artistView) window.Reload(); else {t.artistFlush(); t.albumFlush(); t.grab(); if (ppt.text_only) t.paint();} break;} s.buildPth(undoFo); s.save(undoPth, undoTxt, true); undoTxt = "#!#"; window.NotifyOthers("get_txt_bio", "get_txt_bio"); t.grab(); if (ppt.text_only) t.paint(); break;} break;
                case "Language": p.lfmLang_ix = i; p.updIniLang(p.langArr[p.lfmLang_ix]); p.lfmLang = p.langArr[p.lfmLang_ix].toLowerCase(); p.server = true; window.NotifyOthers("not_server_bio", 0); if (p.server) {serv.setLfm(p.lfmLang); p.getData(2, ppt.focus, "", 1); window.NotifyOthers("refresh_bio", "refresh_bio");} break;
                case "Style":
                    switch (true) {
                        case ppt.sameStyle: if (i < 5) ppt.style = i; else ppt.style = i; break;
                        case ppt.artistView: if (i < 5) ppt.bioStyle = i; else ppt.bioStyle = i; break;
                        case !ppt.artistView: if (i < 5) ppt.revStyle = i; else ppt.revStyle = i; break;
                    }
                    t.toggle(8);
                    break;
                case "Overlay": ppt.overlayStyle = i; window.Reload(); break;
                case "Styles": switch (i) {case 1: p.createStyle(); break; case 2: p.renameStyle(ppt.style); break; case 3: p.deleteStyle(ppt.style); break; case 4: p.exportStyle(ppt.style); break; case 5: p.resetStyle(ppt.style); break;} break;
                case "Heading":
                    switch (i) {
                        case 0: ppt.heading = !ppt.heading; t.toggle(9); break;
                        case 1: case 2: ppt.hdRight = i - 1; if (ppt.src) !ppt.hdRight ? ppt.src = 2 : ppt.src = 1; ppt.hdCenter = false; t.toggle(9); break;
                        case 3: ppt.hdCenter = !ppt.hdCenter; t.toggle(9); break;
                        case 4: !ppt.hdRight ? (ppt.src ? ppt.src = 0 : ppt.src = 2) : (ppt.src ? ppt.src = 0 : ppt.src = 1); t.toggle(9); break;
                        case 5: case 6: ppt.hdLine = ppt.hdLine == i - 4 ? 0 : i - 4; t.toggle(10); break;
                        case 7: if (!ui.custHeadFont) {ppt.headFontStyle = ppt.headFontStyle == 1 ? 0 : 1; t.toggle(12);} else window.ShowProperties(); break;
                        case 8: if (!ui.custHeadFont) {ppt.headFontStyle = ppt.headFontStyle == 2 ? 0 : 2; t.toggle(12);} else window.ShowProperties(); break;
                        case 9: ppt.headFontStyle = ppt.headFontStyle == 3 ? 0 : 3; t.toggle(12); break;
                        case 10: ppt.headFontStyle = ppt.headFontStyle == 16 ? 0 : 16; t.toggle(12); break;
                        case 11: ppt.headFontStyle = ppt.headFontStyle == 18 ? 0 : 18; t.toggle(12); break;
                        case 12: window.ShowProperties(); break;
                    }
                    break;
                case "SourceHead": switch (i) {case 3: ppt.sourceStyle = ppt.sourceStyle == 1 ? 0 : 1; t.toggle(12); break; case 4: ppt.sourceStyle = ppt.sourceStyle == 2 ? 0 : 2; t.toggle(12); break; case 5: ppt.sourceStyle = ppt.sourceStyle == 3 ? 0 : 3; t.toggle(12); break; case 6: ppt.sourceStyle = ppt.sourceStyle == 16 ? 0 : 16; t.toggle(12); break; case 7: ppt.sourceStyle = ppt.sourceStyle == 18 ? 0 : 18; t.toggle(12); break; case 8: window.ShowProperties(); break; default: ppt.sourceHeading = i; t.toggle(11); break;} break;
				case "TrackHead": switch (i) {case 3: ppt.trackStyle = ppt.trackStyle == 1 ? 0 : 1; t.toggle(12); break; case 4: ppt.trackStyle = ppt.trackStyle == 2 ? 0 : 2; t.toggle(12); break; case 5: ppt.trackStyle = ppt.trackStyle == 3 ? 0 : 3; t.toggle(12); break; case 6: ppt.trackStyle = ppt.trackStyle == 16 ? 0 : 16; t.toggle(12); break; case 7: ppt.trackStyle = ppt.trackStyle == 18 ? 0 : 18; t.toggle(12); break; case 8: window.ShowProperties(); break; default: ppt.trackHeading = i; t.toggle(11); break;} break;
                case "Theme":
					switch (true) {
						case (i < 4): ui.chgBlur(i); break;
						case (i == 4): ppt.covBlur = !ppt.covBlur; on_colours_changed(true); break;
						case (i == 5): {ppt.swapCol = !ppt.swapCol; on_colours_changed(true); break;}
						default: {ppt.summaryFirst = !ppt.summaryFirst; t.toggle(9); break;}
					}
                    break;
				case "Scrollbar":
                    switch (i) {
						case 0: case 1: case 2: ui.set('scrollbar', i); break;
						case 3: case 4: case 5: ui.set('sbarType', i - 3); break;
						case 6: ui.set('sbarMetrics'); break;
						case 7: case 8: case 9: ui.set('sbarButType', i - 7); break;
						case 10: window.ShowProperties(); break;
                    }
                    break;
				case "Options":
					switch (i) {
						case 0: ppt.sameStyle = !ppt.sameStyle; t.toggle(8); break;
                        case 1: p.imgText = !p.imgText; ppt.imgText = !p.imgText; t.toggle(8); break;
						case 2: ppt.smooth = !ppt.smooth; break;
						case 3: ppt.touchControl = !ppt.touchControl; break;
						case 4: p.dblClick = !p.dblClick ? 1 : 0; p.updIniClickAction(p.dblClick); break;
						case 5: window.ShowProperties(); break;
						case 6: ui.set('lineSpacing'); break;
						case 7: but.resetZoom(); break;
						case 8: window.Reload(); break;
						
					}
				break;
				case "Image": switch (i) {case 0: ppt.autoEnlarge = !ppt.autoEnlarge; break; case 1: ppt.imgSmoothTrans = !ppt.imgSmoothTrans; if (ui.blur) {img.clear_rs_cache(); img.get_images();} break;} break;
				case "Seeker": 
					switch (i) {
						case 0: case 1: case 2: ppt.imgBar = i; img.bar.show = !ppt.artistView && p.alb_ix || ppt.imgBar != 2 ? false : true; break;
						case 3: ppt.imgBarDots = ppt.imgBarDots == 2 ? 0 : 2; break;
						case 4: ppt.imgBarDots = ppt.imgBarDots == 1 ? 0 : 1; break;
						case 5: ppt.imgCounter = !ppt.imgCounter; break;
					}
					img.clear_rs_cache(); img.get_images(); break;
                case "Align":switch (i) {case 3: ppt.textAlign = !ppt.textAlign; p.sizes(); img.clear_rs_cache(); img.get_images(); break; default: if (ppt.style == 0 || ppt.style == 2) ppt.alignH = i; else ppt.alignV = i; img.clear_rs_cache(); img.get_images(); break;} break;
                case "alignH": ppt.alignH = i; img.clear_rs_cache(); img.get_images(); break;
                case "AlignV": switch (i) {case 3: ppt.alignAuto = true; p.sizes(); img.clear_rs_cache(); img.get_images(); break; default: ppt.alignV = i; ppt.alignAuto = false; p.sizes(); img.clear_rs_cache(); img.get_images(); break;} break;
                case "ImageBlacklist":
                    if (!i) {
						if (!imgList.blacklist[b_n]) imgList.blacklist[b_n] = []; imgList.blacklist[b_n].push(imgName);
					}
					else if (img.undo[0] == b_n && i == 2) {
						if (!imgList.blacklist[img.undo[0]]) imgList.blacklist[b_n] = []; if (img.undo[1].length) imgList.blacklist[img.undo[0]].push(img.undo[1]); img.undo = [];
					}
					else {
						const bl_ind = i - (img.undo[0] == b_n ? 3 : 2); img.undo = [b_n, imgList.blacklist[b_n][bl_ind]]; imgList.blacklist[b_n].splice(bl_ind, 1); s.removeNulls(imgList);
					}
					let bl = imgList.blacklist[b_n]; if (bl) imgList.blacklist[b_n] = sort([...new Set(bl)]); img.blkArtist = ""; s.save(bn, JSON.stringify({"blacklist": s.sortKeys(imgList.blacklist)}, null, 3), true);
					img.chkArtImg(); window.NotifyOthers("blacklist_bio", "blacklist_bio");
                    break;
                case "Circular":
                    switch (i) {
                        case 0: ppt.artCircImgOnly = !ppt.artCircImgOnly; img.setCrop(true); img.clear_rs_cache(); img.get_images(); break;
                        case 1: ppt.artCircDual = !ppt.artCircDual; img.setCrop(true); img.clear_rs_cache(); img.get_images(); break;
                        case 2: ppt.covCircImgOnly = !ppt.covCircImgOnly; img.setCrop(true); img.clear_rs_cache(); img.get_images();  break;
                        case 3: ppt.covCircDual = !ppt.covCircDual; img.setCrop(true); img.clear_rs_cache(); img.get_images(); break;
                    }
                    break;
                case "Crop":
                    switch (i) {
                        case 0: ppt.artCropImgOnly = !ppt.artCropImgOnly; img.setCrop(true); img.clear_rs_cache(); img.get_images(); break;
                        case 1: ppt.artCropDual = !ppt.artCropDual; img.setCrop(true); img.clear_rs_cache(); img.get_images(); break;
                        case 2: ppt.covCropImgOnly = !ppt.covCropImgOnly; img.setCrop(true); img.clear_rs_cache(); img.get_images();  break;
                        case 3: ppt.covCropDual = !ppt.covCropDual; img.setCrop(true); img.clear_rs_cache(); img.get_images(); break;
                    }
                    break;
                case "Reflection":
					switch (i) {
						case 0: ppt.artReflImgOnly = !ppt.artReflImgOnly; break;
						case 1: ppt.artReflDual = !ppt.artReflDual; break;
						case 2: ppt.covReflImgOnly = !ppt.covReflImgOnly; break;
						case 3: ppt.covReflDual = !ppt.covReflDual; break;
						default: ppt.imgReflType = i - 4; break;
					}
					img.setCrop(true); img.clear_rs_cache(); img.get_images();
					break;
                case "Border":
					switch (i) {
						case 0: ppt.artBorderImgOnly = ppt.artBorderImgOnly == 0 ? 1 : ppt.artBorderImgOnly == 1 ? 0 : ppt.artBorderImgOnly == 2 ? 3 : 2; break;
						case 1: ppt.artBorderDual = ppt.artBorderDual == 0 ? 1 : ppt.artBorderDual == 1 ? 0 : ppt.artBorderDual == 2 ? 3 : 2; break;
						case 2: ppt.covBorderImgOnly = ppt.covBorderImgOnly == 0 ? 1 : ppt.covBorderImgOnly == 1 ? 0 : ppt.covBorderImgOnly == 2 ? 3 : 2; break;
						case 3: ppt.covBorderDual = ppt.covBorderDual == 0 ? 1 : ppt.covBorderDual == 1 ? 0 : ppt.covBorderDual == 2 ? 3 : 2; break;
					}
					img.create_images(); img.setCrop(true); img.clear_rs_cache(); img.get_images();
					break;
                case "Shadow":
					switch (i) {
						case 0: ppt.artBorderImgOnly = ppt.artBorderImgOnly == 0 ? 2 : ppt.artBorderImgOnly == 1 ? 3 : ppt.artBorderImgOnly == 2 ? 0 : 1; break;
						case 1: ppt.artBorderDual = ppt.artBorderDual == 0 ? 2 : ppt.artBorderDual == 1 ? 3 : ppt.artBorderDual == 2 ? 0 : 1; break;
						case 2: ppt.covBorderImgOnly = ppt.covBorderImgOnly == 0 ? 2 : ppt.covBorderImgOnly == 1 ? 3 : ppt.covBorderImgOnly == 2 ? 0 : 1; break;
						case 3: ppt.covBorderDual = ppt.covBorderDual == 0 ? 2 : ppt.covBorderDual == 1 ? 3 : ppt.covBorderDual == 2 ? 0 : 1; break;
					}
					img.setCrop(true); img.clear_rs_cache(); img.get_images();
					break;
                case "Tags": if (i && i < ln) {p.tag[i - 1].enabled = p.tag[i - 1].enabled ? 0 : 1; p.updIniTag(i - 1);} if (i == ln) p.setSimTagNo(); if (i == ln + 1) {if (p.tag[8].enabled && p.tag[8].enabled < 7) tag.check(handles); else tag.write_tags(handles);} break;
                case "Playlists": plman.ActivePlaylist = pl_menu[i].ix; break;
				case "Default": switch (i) {case 0: shift ? p.inactivate() : window.ShowProperties(); break; case 1: window.ShowProperties(); break; case 2: window.ShowConfigure(); break;}
            }
        } this.right_up = false;
    }
	
	this.activate = (x, y) => {
		const menu = window.CreatePopupMenu(); let idx, Index = 1; Index = defaultTypeMenu(menu, Index);
		idx = menu.TrackPopupMenu(x, y);
		if (idx >= 1 && idx <= Index) {
			switch (MenuMap[idx].value) {case 0: p.inactivate(); break; case 1: window.ShowProperties(); break; case 2: window.ShowConfigure(); break;}
		}
	}

    this.button = (x, y) => {
        const menu = window.CreatePopupMenu(), WebMenu = window.CreatePopupMenu(); let idx, Index = 1; Index = ppt.artistView ? moreArtMenu(menu, Index) : moreAlbMenu(menu, Index); menu.AppendMenuItem(MF_SEPARATOR, 0, 0); Index = ppt.artistView ? webArtistTypeMenu(WebMenu, Index) : webAlbumTypeMenu(WebMenu, Index); WebMenu.AppendTo(menu, MF_STRING, "More...");
        const origArr = JSON.stringify(p.artists), origArrl = JSON.stringify(p.albums);
        idx = menu.TrackPopupMenu(x, y);
        if (idx >= 1 && idx <= Index) {
            const i = MenuMap[idx].value;
            switch (MenuMap[idx].type) {
                case "More-Artist":
                    switch (true) {
                        case i < p.artists.length: if (origArr != JSON.stringify(p.artists) || !i && !p.art_ix || p.art_ix == i) break;
							t.logScrollPos(); p.art_ix = i; img.get = false; t.get = 0;
							t.get_multi(false, p.art_ix, p.alb_ix); t.getScrollPos(); img.get_multi(p.art_ix, p.alb_ix); p.getData(false, ppt.focus, "multi_tag_bio", 0);
							if (ppt.autoLock) p.mbtn_up(1, 1, true);
							if (p.artists[p.art_ix].type.includes("history")) break;
							p.logArtistHistory(p.artists[p.art_ix].name);
							p.get_multi();
							break;
                        case i == p.artists.length + 1: ppt.cycItem = !ppt.cycItem; break;
                        case i == p.artists.length + 2: p.setCycItem(); break;
						case i == p.artists.length + 3: window.Reload(); break;
                    }
					this.bioCounter = 0;
                    break;
                case "More-Album":
                    switch (true) {
                        case i < p.albums.length: 
						if (origArrl != JSON.stringify(p.albums) || !i && !p.alb_ix || p.alb_ix == i) break;
							t.logScrollPos(); p.alb_ix = i; img.get = false; t.get = 0; let force = false; p.inclTrackRev = ppt.inclTrackRev;
							if (ppt.showAlbumHistory && ppt.inclTrackRev) {
								if (p.albums[p.alb_ix].type.includes("history")) p.inclTrackRev = 0;
								t.albumFlush(); force = true;
							}
							t.get_multi(false, p.art_ix, p.alb_ix, force); t.getScrollPos(); img.get_multi(p.art_ix, p.alb_ix); p.getData(false, ppt.focus, "multi_tag_bio", 0);
							if (ppt.autoLock) p.mbtn_up(1, 1, true);
							if (p.albums[p.alb_ix].type.includes("history")) break;
							p.logAlbumHistory(p.albums[p.alb_ix].artist, p.albums[p.alb_ix].album); p.get_multi();
							break;
                        case i == p.albums.length + 1: ppt.cycItem = !ppt.cycItem; break;
                        case i == p.albums.length + 2: p.setCycItem(); break;
						case i == p.albums.length + 3: window.Reload(); break;
                    }
					this.revCounter = 0;
                    break;
                case "Web":
					switch (true) {
						case ppt.artistView:
							switch (i) {
								case 0: p.art_ix = 0; ppt.showSimilarArtists = !ppt.showSimilarArtists; p.get_multi(!ppt.showSimilarArtists ? true : false); break;
								case 1: p.art_ix = 0; ppt.showMoreTags = !ppt.showMoreTags; p.get_multi(!ppt.showMoreTags ? true : false); break;
								case 2: p.art_ix = 0; ppt.showArtistHistory = !ppt.showArtistHistory; p.get_multi(!ppt.showArtistHistory ? true : false); break;
								case 3: ppt.autoLock = !ppt.autoLock; break;
								case 4: p.resetArtistHistory(); break;
								default: const artist = p.artists.length ? p.artists[0].name : name.artist(ppt.focus), brArr = ["", "/+similar", "/+albums"]; if (i < 8) s.browser("https://" + "www.last.fm/" + (p.lfmLang == "en" ? "" : p.lfmLang + "/") + "music/" + encodeURIComponent(artist) + brArr[i - 5], true); else s.browser("https://www.allmusic.com/search/artists/" + encodeURIComponent(artist), true); break;
							}
							if (i < 5) {
								t.logScrollPos(); img.get = false; t.get = 0; 
								t.get_multi(false, p.art_ix, p.alb_ix); t.getScrollPos(); img.get_multi(p.art_ix, p.alb_ix); p.getData(false, ppt.focus, "multi_tag_bio", 0);
							}
							break;
						case !ppt.artistView:
							switch (i) {
								case 0: p.alb_ix = 0; ppt.showTopAlbums = !ppt.showTopAlbums; p.get_multi(!ppt.showTopAlbums ? true : false); break;
								case 1: p.alb_ix = 0; ppt.showAlbumHistory = !ppt.showAlbumHistory; p.get_multi(!ppt.showAlbumHistory ? true : false); break;
								case 2: ppt.autoLock = !ppt.autoLock; break;
								case 3: p.resetAlbumHistory(); break;
								default: const artist = p.artists.length ? p.artists[0].name : name.artist(ppt.focus), brArr = ["", "/+similar", "/+albums"]; if (i < 7) s.browser("https://" + "www.last.fm/" + (p.lfmLang == "en" ? "" : p.lfmLang + "/") + "music/" + encodeURIComponent(artist) + brArr[i - 4], true); else s.browser("https://www.allmusic.com/search/artists/" + encodeURIComponent(artist), true); break;
							}
							if (i < 4) {
								t.logScrollPos(); img.get = false; t.get = 0; p.inclTrackRev = ppt.inclTrackRev;
								if (ppt.inclTrackRev) {
									if (p.albums[p.alb_ix].type.includes("history")) p.inclTrackRev = 0;
									t.albumFlush();
								}
								t.get_multi(false, p.art_ix, p.alb_ix, true); t.getScrollPos(); img.get_multi(p.art_ix, p.alb_ix); p.getData(false, ppt.focus, "multi_tag_bio", 0);
							}
							break;
				}
            }
        }
    }

    this.wheel = (step, resetCounters) => {
        let i = 0; but.clear_tooltip(); let force = false;
        switch (true) {
            case ppt.artistView:
				if (!p.artistsUniq.length) break; for (i = 0; i < p.artistsUniq.length; i++) if (!p.art_ix && name.artist(ppt.focus) == p.artistsUniq[i].name || p.art_ix == p.artistsUniq[i].ix) break;
				i += step; if (i < 0) i = p.artistsUniq.length - 1; else if (i >= p.artistsUniq.length) i = 0; t.logScrollPos(); p.art_ix = p.artistsUniq[i].ix;
				if (p.artists[p.art_ix].type.includes("history")) break; p.logArtistHistory(p.artists[p.art_ix].name); p.get_multi(); break;
            case !ppt.artistView: 
				if (!p.albumsUniq.length) break; for (i = 0; i < p.albumsUniq.length; i++) if (!p.alb_ix && name.alb_artist(ppt.focus) + " - " +  name.album(ppt.focus) == p.albumsUniq[i].artist + " - " + p.albumsUniq[i].album || p.alb_ix == p.albumsUniq[i].ix) break;
				i += step; if (i < 0) i = p.albumsUniq.length - 1; else if (i >= p.albumsUniq.length) i = 0; t.logScrollPos(); p.alb_ix = p.albumsUniq[i].ix; if (p.alb_ix) img.bar.show = false;
				if (ppt.showAlbumHistory && ppt.inclTrackRev) {
					p.inclTrackRev = ppt.inclTrackRev;
					if (p.albums[p.alb_ix].type.includes("history")) p.inclTrackRev = 0;
					t.albumFlush(); force = true;
				}
				if (p.albums[p.alb_ix].type.includes("history")) break; p.logAlbumHistory(p.albums[p.alb_ix].artist, p.albums[p.alb_ix].album); p.get_multi();
				break;
        } img.get = false; t.get_multi(false, p.art_ix, p.alb_ix, force); t.getScrollPos(); img.get_multi(p.art_ix, p.alb_ix); p.multi_serv(); if (resetCounters) ppt.artistView ? this.bioCounter = 0 : this.revCounter = 0;
    }
}

function Text() {
	const amBioSubHead = ppt.amBioSubHead.split("|"), amRevSubHead = ppt.amRevSubHead.split("|"), lfmBioSubHead = ppt.lfmBioSubHead.split("|"), lfmRevSubHead = ppt.lfmRevSubHead.split("|");
	const bioFallbackText = ppt.bioFallbackText.split("|"), revFallbackText = ppt.revFallbackText.split("|");
    const DT_CENTER = 0x00000001, DT_RIGHT = 0x00000002, DT_VCENTER = 0x00000004, DT_SINGLELINE = 0x00000020, DT_CALCRECT = 0x00000400, DT_NOPREFIX = 0x00000800, DT_WORD_ELLIPSIS = 0x00040000, extra_y = Math.round(Math.max(1, ui.font_h * 0.05));
    const d = {ax1: 0, ax2: 0, aB1: false, aB2: false, aR1: false, aR2: false, bothB_ix: -1, bothR_ix: -1, lB1: false, lB2: false, lR1: false, lR2: false, lx1: 0, lx2: 0, w: []}
    const done = {amBio: false, amRev: false,  lfmBio: false, lfmRev: false}
    const id = {alb: "", alb_o: "", album: "", album_o: "",   tr: "", tr_o: ""}
    const mod = {amBio: "", amBio_o: "", amRev: "", amRev_o: "", lfmBio: "", lfmBio_o: "", lfmRev: "", lfmRev_o: ""}
    const popNow = "Popular Now: |Beliebt Jetzt: |Popular Ahora: |Populaire Maintenant: |Popolare Ora: |今人気: |Popularne Teraz: |Popular Agora: |Популярные сейчас: |Populär Nu: |ŞImdi Popüler: |热门 现在";
    const releaseDate = "Release Date: |Veröffentlichungsdatum: |Fecha De Lanzamiento: |Date De Sortie: |Data Di Pubblicazione: |リリース日: |Data Wydania: |Data De Lançamento: |Дата релиза: |Utgivningsdatum: |Yayınlanma Tarihi: |发布日期: ";
	const topTags = ["Tags", "Tags", "Tags", "Tags", "Tag", "タグ", "Tagi", "Tags", "Теги", "Taggar", "Etiketler", "标签"];
    const yrsActive = "Years Active: |Jahre aktiv: |Años de actividad: |Années d'activité: |Anni di attività: |活動期間: |Lata aktywności: |Anos de atividade: |Активность \\(лет\\): |År aktiv: |Aktif yıllar: |活跃年份: |Born: |Geburtstag: |Fecha de nacimiento: |Né\\(e\\) le: |Data di nascita: |生年月日: |Urodzony: |Data de nascimento: |Год рождения: |Född: |Doğum tarihi: |出生";
    let alb_inf = "", alb_txt_arr = [], alb_txt_o = "", album = "", albumartist = "", amBio = "", amRev = "", art_txt_arr = [], art_txt_o = "", artist = "", artist_o = "", bioSubHead = 0, calc = true, checkedTrackSubHead = true, init = true, initialise = true, lfmBio = "", lfmRev = "", new_text = false, revSubHead = 0, scrollBioPos = {}, scrollRevPos = {}, showTrackHead = true, textUpdate = 0, track = "", trackartist = "", trackUpd = false;
	this.alb_allmusic = true; this.alb_txt = ""; this.art_txt = ""; this.avgRating = -1; this.bio_allmusic = false; this.btnBioBoth = 0; this.btnRevBoth = 0; this.cc = DT_CENTER | DT_VCENTER | DT_SINGLELINE | DT_NOPREFIX | DT_WORD_ELLIPSIS; this.get = 1; this.head = true; this.heading = ""; this.l = DT_NOPREFIX; this.lfmRating = -1; const lc = DT_VCENTER | DT_SINGLELINE | DT_NOPREFIX | DT_WORD_ELLIPSIS, rc = DT_RIGHT | + lc; this.c = [lc, rc]; this.cc = DT_CENTER | DT_VCENTER | DT_CALCRECT | DT_NOPREFIX | DT_WORD_ELLIPSIS; this.mulAlbum = false; this.mulArtist = false; this.na = ""; this.amRating = -1; this.rp = true; this.text = ""; ppt.sourceHeading = s.clamp(ppt.sourceHeading, 0, 2); ppt.trackHeading = s.clamp(ppt.trackHeading, 0, 2);

    const getTxtFallback = () => {if (this.scrollbar_type().draw_timer) return; if (!p.multi_new()) return; if (!this.get && !textUpdate) return; this.na = ""; if (textUpdate) updText(); if (this.get) {this.album_reset(); this.artist_reset(); if (calc) calc = ppt.artistView ? 1 : 2; this.getText(calc); if (this.get == 2) p.focus_serv(); calc = false; this.get = 0;}}
	const halt = () => p.w <= 10 || p.h <= 10;
	const updText = () => {this.getText(false, true); img.getArtImg(); img.getFbImg(); textUpdate = 0; done.amBio = done.lfmBio = done.amRev = done.lfmRev = false;}
	const updTrackSubHead = () => {if (ppt.artistView || p.inclTrackRev != 2 || checkedTrackSubHead || !showTrackHead || !ppt.bothRev || !amRev) return false; mod.amRev = amRev = lfmRev = mod.lfmRev = ""; mod.amRev_o = mod.lfmRev_o = "1"; done.amRev = done.lfmRev = false; checkedTrackSubHead = true; return true;}

	this.albumFlush = () => {this.text = false; mod.amRev = amRev = lfmRev = mod.lfmRev = ""; mod.amRev_o = mod.lfmRev_o = "1"; checkedTrackSubHead = done.amRev = done.lfmRev = false; this.alb_txt = ""; this.head = false; but.set_scroll_btns_hide(); but.set_src_btn_hide();}
    this.amBioPth = () => {if (ppt.img_only) return ["", "", false, false]; return p.getPth('bio', ppt.focus, artist, "", "", p.sup.Cache, artist.clean(), "", "", 'amBio', false);}
    this.amRevPth = () => {if (ppt.img_only) return ["", "", false, false]; return p.getPth('rev', ppt.focus, artist, album, "", p.sup.Cache, artist.clean(), albumartist.clean(), album.clean(), 'amRev', false);}
    this.artistFlush = () => {this.text = false; done.amBio = done.lfmBio = false; mod.amBio = amBio = mod.lfmBio = lfmBio = ""; mod.amBio_o = mod.lfmBio_o = "1"; this.art_txt = ""; this.head = false; but.set_scroll_btns_hide(); but.set_src_btn_hide();}
    this.album_reset = upd => {if (p.lock) return; id.album_o = id.album; id.album = name.albID(ppt.focus, 'simple'); const new_album = id.album != id.album_o; if (new_album) id.alb = ""; if (new_album || upd) {album = name.album(ppt.focus); albumartist = name.alb_artist(ppt.focus); this.albumFlush(); this.mulAlbum = false;} if (p.inclTrackRev) {id.tr_o = id.tr; id.tr = name.trackID(ppt.focus); const new_track = id.tr != id.tr_o; if (new_track) {checkedTrackSubHead = done.amRev = done.lfmRev = false; if (p.inclTrackRev == 1) this.logScrollPos('rev');}}}
	this.artist_reset = upd => {if (p.artistsSame() || p.lock) return; artist_o = artist; artist = name.artist(ppt.focus); const new_artist = artist != artist_o; if (new_artist || upd) {this.mulArtist = false; this.artistFlush();}}
    this.get_multi = (p_calc, art_ix, alb_ix, force) => {if (ppt.img_only) return; switch (true) {case ppt.artistView: artist_o = artist; artist = art_ix < p.artists.length ? p.artists[art_ix].name : name.artist(ppt.focus); const new_artist = artist != artist_o; if (new_artist) {this.artistFlush(); p.art_ix = art_ix; this.mulArtist = true;} this.getText(p_calc); this.get = 0; break; case !ppt.artistView: id.alb_o = id.alb; artist = alb_ix < p.albums.length ? p.albums[alb_ix].artist : name.alb_artist(ppt.focus); const alb = alb_ix < p.albums.length ? p.albums[alb_ix].album : name.album(ppt.focus); id.alb = artist + alb; const new_album = id.alb != id.alb_o; if (new_album || force) {album = alb; albumartist = artist; this.albumFlush(); this.mulAlbum = true;} this.getText(p_calc); this.get = 0; break;}}
    this.block = () => halt() || !window.IsVisible;
    this.get_widths = () => {s.gr(1, 1, false, g => d.w = [" ", amBioSubHead[0] + " ", lfmBioSubHead[0] + " ", amRevSubHead[0] + " ", lfmRevSubHead[0] + " ", amBioSubHead[1] + " ", lfmBioSubHead[1] + " ", amRevSubHead[1] + " ", lfmRevSubHead[1] + " "].map(v => Math.max(g.CalcTextWidth(v, ui.sourceFont), 1)));}
    this.grab = () => {textUpdate = 1; if (this.block()) return; updText();}
	this.headingID = () => ppt.artistView + "-" + p.art_ix + "-" + p.alb_ix + "-" + ppt.allmusic_bio + "-" + ppt.allmusic_alb + "-" + p.inclTrackRev;
    this.lfmBioPth = () => {if (ppt.img_only) return ["", "", false, false]; return p.getPth('bio', ppt.focus, artist, "", "", p.sup.Cache, artist.clean(), "", "", 'lfmBio', false);}
    this.lfmRevPth = () => {if (ppt.img_only) return ["", "", false, false]; return p.getPth('rev', ppt.focus, artist, album, "", p.sup.Cache, artist.clean(), albumartist.clean(), album.clean(), 'lfmRev', false);}
    this.lfmTrackPth = () => {if (ppt.img_only || ppt.artistView) return ["", "", false, false]; return p.getPth('track', ppt.focus, artist, "Track Reviews", "", "", artist.clean(), "", "Track Reviews", 'lfmRev', false);}
	this.messageDraw = gr => {if (ppt.heading || !this.na) return; const j_x = Math.round(p.text_w / 2) + p.text_l, j_h = Math.round(ui.font_h * 1.5), j_y = p.text_t + (p.lines_drawn * ui.font_h - j_h) / 3, rs1 = Math.min(5, j_h / 2), rs2 = Math.min(4, (j_h - 2) / 2); gr.SetSmoothingMode(4); const j_w = gr.CalcTextWidth(this.na, ui.messageFont) + 25; gr.FillRoundRect(j_x - j_w / 2, j_y, j_w, j_h, rs1, rs1, 0xDB000000); gr.DrawRoundRect(j_x - j_w / 2, j_y, j_w, j_h, rs1, rs1, 1, 0x64000000); gr.DrawRoundRect(j_x - j_w / 2 + 1, j_y + 1, j_w - 2, j_h - 2, rs2, rs2, 1, 0x28ffffff); gr.GdiDrawText(this.na, ui.messageFont, RGB(0, 0, 0), j_x - j_w / 2 + 1, j_y + 1 , j_w, j_h, this.cc); gr.GdiDrawText(this.na, ui.messageFont, 0xffff4646, j_x - j_w / 2, j_y, j_w, j_h, this.cc);}
	this.on_playback_new_track = force => {if (p.lock) p.get_multi(); if (!p.multi_new() && !force) return; if (this.block()) {this.get = 1; if (!p.lock) p.get_multi(true); this.logScrollPos(); this.album_reset(); this.artist_reset(); if (p.inclTrackRev) trackUpd = true;} else {if (!p.lock) p.get_multi(true); this.logScrollPos(); this.album_reset(); this.artist_reset(); this.na = ""; this.getText(false); this.get = 0;}}
    this.on_size = () => {if (initialise) {this.album_reset(); this.artist_reset(); initialise = false;} scrollBioPos = {}; scrollRevPos = {}; this.getText(false); p.get_multi(true); but.refresh();}
    this.paint = () => {if (this.rp) window.Repaint();}
    this.scrollbar_type = () => ppt.artistView ? art_scrollbar : alb_scrollbar;

	this.getScrollPos = () => {
		let v;
		switch (ppt.artistView) {
			case true:
				v = artist + "-" + this.bio_allmusic + "-" + ppt.lockBio + "-" + ppt.bothBio;
				if (!scrollBioPos[v]) return art_scrollbar.set_scroll(0);
				if (scrollBioPos[v].text === art_txt_arr.length + "-" + this.art_txt) art_scrollbar.set_scroll(scrollBioPos[v].scroll || 0);
				else {scrollBioPos[v].scroll = 0; scrollBioPos[v].text = "";}
				break;
			case false:
				v = (this.alb_allmusic || p.inclTrackRev != 2 || ppt.bothRev ? albumartist + album + "-" : "") + this.alb_allmusic + "-" + ppt.lockRev + "-" + ppt.bothRev + "-" + ppt.inclTrackRev;
				if (!scrollRevPos[v]) return alb_scrollbar.set_scroll(0);
				let match = false;
				if (p.inclTrackRev != 1) {
					if (scrollRevPos[v].text === ui.font.Size + "-" + p.text_w + "-" + this.alb_txt) match = true;
				} else {
					const tx1 = (ui.font.Size + "-" + p.text_w).toString(), tx2 = (alb_inf || lfmRev).strip(), tx3 = amRev.strip();
					if (scrollRevPos[v].text.startsWith(tx1) && (tx2 && scrollRevPos[v].text.includes(tx2) || tx3 && scrollRevPos[v].text.includes(tx3))) match = true;
				}
				if (match) {
					const set_scroll = p.inclTrackRev != 1 ? scrollRevPos[v].scroll : Math.min(scrollRevPos[v].scroll, alb_scrollbar.max_scroll);
					alb_scrollbar.set_scroll(set_scroll || 0);
				}
				else {scrollRevPos[v].scroll = 0; scrollRevPos[v].text = "";}
				break;
			}
	}

	this.logScrollPos = n => {
		let keys = [], v;
		n = n == 'rev' ? false : ppt.artistView;
		switch (n) {
			case true:
				keys = Object.keys(scrollBioPos);
				if (keys.length > 70) delete scrollBioPos[keys[0]];
				v = artist + "-" + this.bio_allmusic + "-" + ppt.lockBio + "-" + ppt.bothBio;
				scrollBioPos[v] = {};
				scrollBioPos[v].scroll = art_scrollbar.scroll;
				scrollBioPos[v].text = art_txt_arr.length + "-" + this.art_txt;
				break;
			case false:
				keys = Object.keys(scrollRevPos);
				if (keys.length > 70) delete scrollRevPos[keys[0]];
				v = (this.alb_allmusic || p.inclTrackRev != 2 || ppt.bothRev ? albumartist + album + "-" : "") + this.alb_allmusic + "-" + ppt.lockRev + "-" + ppt.bothRev + "-" + ppt.inclTrackRev;
				scrollRevPos[v] = {};
				scrollRevPos[v].scroll = alb_scrollbar.scroll;
				scrollRevPos[v].text = ui.font.Size + "-" + p.text_w + "-" + (p.inclTrackRev != 1 ? this.alb_txt : ((alb_inf || lfmRev) + amRev).strip());
				break;
		}
	}

    const summaryFirstText = (s1, s2, text, s3, rating) => {
        let ix = -1, m = text.match(RegExp(s2, "gi")), sub1 = "", sub2 = ""; ix = text.lastIndexOf(s1);
        if (ix != -1) {
            sub1 = text.substring(ix); sub1 = sub1.split('\n')[0].trim();
            text = text.replace(RegExp(sub1), "");
            sub1 = sub1.replace(RegExp(s1), "").replace(/, /g, " \u2219 ");
            let sub1_w = 0; s.gr(1, 1, false, g => sub1_w = g.CalcTextWidth(sub1, ui.font));
            if (sub1) sub1 += sub1_w < p.text_w || init ? "\r\n" : "  |  ";
        }
		init = false;
        if (m) {ix = -1; m = m[m.length - 1].toString(); ix = text.lastIndexOf(m);}
        if (ix != -1) {sub2 = text.substring(ix); sub2 = sub2.split('\n')[0].trim();
            text = text.replace(RegExp(sub2.regex_escape()), "");
            sub2 = sub2.replace(" | ", "  |  ");
            if (sub2 && rating && !s3) sub2 += ("  |  " + rating);
            if (sub2 && !s3) sub2 += "\r\n";
        }
        if (!s3) {
            text = sub1 + sub2.titlecase() + (sub1 || sub2 ? "\r\n" : "") + text;
            return text;
        }
        let sub3 = "", sub4 = ""; ix = -1; m = text.match(RegExp(s3, "i"));
        if (m) {
            m = m.toString();
            ix = text.lastIndexOf(m);
            if (ix != -1) {
                sub3 = text.substring(ix).replace("\r\n\r\n", ";"); sub3 = sub3.split(';')[0].trim();
                text = text.replace(RegExp(sub3.regex_escape() + "; "), ""); text = text.replace(RegExp(sub3.regex_escape() + "\r\n\r\n"), "");
            }
        }
        if (sub2 && sub3) sub4 += sub2 + "  |  " + sub3; else sub4 += sub2 + sub3;
        if (sub4) sub4 += "\r\n";
        text = sub1 + sub4.titlecase() + (sub1 || sub4 ? "\r\n" : "") + text;
        return text;
    }

    const tf = (n, trackreview) => {
        if (p.lock) n = n.replace(/%artist%|\$meta\(artist,0\)/g, "#¦#¦#%artist%#¦#¦#").replace(/%title%|\$meta\(title,0\)/g, "#!#!#%title%#!#!#");
		let a = (ppt.artistView ? artist : (!trackreview ? (p.alb_ix ? albumartist : artist) : trackartist)).tf_escape(), aa = (ppt.artistView ? (p.art_ix ? artist : albumartist) : (!trackreview ? albumartist : trackartist)).tf_escape(), l = album.replace("Album Unknown", "").tf_escape(), tr = track.tf_escape();
        const stnd = ppt.artistView && !p.art_ix || !ppt.artistView && !p.alb_ix; n = n.replace(/%more_item%/gi, !stnd ? "$&#@!%path%#@!" : "$&");
        n = n.replace(/((\$if|\$and|\$or|\$not|\$xor)(|\d)\(|\[)[^$%]*%bio_artist%/gi, a ? "$&#@!%path%#@!" : "$&").replace(/%bio_artist%/gi, a).replace(/((\$if|\$and|\$or|\$not|\$xor)(|\d)\(|\[)[^$%]*%bio_albumartist%/gi, aa ? "$&#@!%path%#@!" : "$&").replace(/%bio_albumartist%/gi, aa).replace(/((\$if|\$and|\$or|\$not|\$xor)(|\d)\(|\[)[^$%]*%bio_album%/gi, l ? "$&#@!%path%#@!" : "$&").replace(/%bio_album%/gi, l).replace(/((\$if|\$and|\$or|\$not|\$xor)(|\d)\(|\[)[^$%]*%bio_title%/gi, tr ? "$&#@!%path%#@!" : "$&").replace(/%bio_title%/gi, tr);
        n = p.eval(n, ppt.focus);
        if (p.lock) n = n.replace(/#¦#¦#.*?#¦#¦#/g, trackartist).replace(/#!#!#.*?#!#!#/g, track); n = n.replace(/#@!.*?#@!/g, "") || "No Selection";
        return n;
    }

    this.getText = (p_calc, update) => {
        if (ppt.img_only) return; const a = artist.clean(); new_text = false; if (!p.lock) {trackartist = name.artist(ppt.focus); track = name.title(ppt.focus);}
        switch (true) {
            case ppt.artistView:
				if (!a) break;
                if (ppt.bothBio) {if (!done.amBio || update) {done.amBio = true; am_bio(a); if (!done.lfmBio || update) {done.lfmBio = true; lfm_bio(a);}} break;}
                if (!ppt.allmusic_bio && (!done.lfmBio || update)) {done.lfmBio = true; lfm_bio(a); if (!lfmBio && !ppt.lockBio && (!done.amBio || update)) {done.amBio = true; am_bio(a);}}
                if (ppt.allmusic_bio && (!done.amBio || update)) {done.amBio = true; am_bio(a); if (!amBio && !ppt.lockBio && (!done.lfmBio || update)) {done.lfmBio = true; lfm_bio(a);}}
                break;
            case !ppt.artistView:
                const aa = albumartist.clean(), l = album.clean();
                if (!aa || !l && !p.inclTrackRev) {this.amRating = -1; this.lfmRating = -1; this.avgRating = -1; but.check(); break;}
                if (p.ir(ppt.focus) && !p.inclTrackRev && !p.alb_ix) break;
                if (ppt.bothRev) {if (!done.amRev || update) {done.amRev = true; am_rev(a, aa, l); if (!done.lfmRev || update) {done.lfmRev = true; lfm_rev(a, aa, l);}} break;}
                if (ppt.allmusic_alb && (!done.amRev || update)) {done.amRev = true; am_rev(a, aa, l); if (!amRev && !ppt.lockRev && (!done.lfmRev || update)) {done.lfmRev = true; lfm_rev(a, aa, l);}}
                if (!ppt.allmusic_alb && (!done.lfmRev || update)) {done.lfmRev = true; lfm_rev(a, aa, l); if (!lfmRev && !ppt.lockRev && (!done.amRev || update)) {done.amRev = true; am_rev(a, aa, l);}}
                break;
        }
        if (!update || new_text) {
            this.alb_txt = ""; d.aB1 = false; d.aB2 = false; d.aR1 = false; d.aR2 = false; this.art_txt = ""; this.head = true; but.set_src_btn_hide(); d.lB1 = false; d.lB2 = false; d.lR1 = false; d.lR2 = false;
            switch (true) {
                case !ppt.bothBio:
                    if (ppt.allmusic_bio) {if (ppt.sourceHeading == 2 && !amRev && lfmRev) lfmRev = lfmRev.replace(/Last.fm: /g, "");
                    this.art_txt = !ppt.lockBio ? amBio ? (ppt.sourceHeading == 2 ? amBioSubHead[ppt.heading ? 0 : 1] + "\r\n" : "") + amBio : (ppt.sourceHeading == 2 && lfmBio ? lfmBioSubHead[ppt.heading ? 0 : 1] + "\r\n" : "") + lfmBio : (ppt.sourceHeading == 2 && (amBio || p.imgText || ppt.text_only) ? amBioSubHead[ppt.heading ? 0 : 1] + "\r\n" + (amBio ? "" : "Nothing Found") : "") + amBio; if (amBio || ppt.lockBio) d.aB1 = true; else if (lfmBio) d.lB1 = true; if (amBio || ppt.lockBio) this.bio_allmusic = true; else if (lfmBio) this.bio_allmusic = false; else this.bio_allmusic = true;}
                    else {if (ppt.sourceHeading == 2 && lfmBio) lfmBio = lfmBio.replace(/Last.fm: /g, ""); this.art_txt = !ppt.lockBio ? lfmBio ? (ppt.sourceHeading == 2 ? lfmBioSubHead[ppt.heading ? 0 : 1] + "\r\n" : "") + lfmBio : (ppt.sourceHeading == 2 && amBio ? amBioSubHead[ppt.heading ? 0 : 1] + "\r\n" : "") + amBio : (ppt.sourceHeading == 2 && (lfmBio || p.imgText || ppt.text_only) ? lfmBioSubHead[ppt.heading ? 0 : 1] + "\r\n" + (lfmBio ? "" : "Nothing Found") : "") + lfmBio; if (lfmBio || ppt.lockBio) d.lB1 = true; else if (amBio) d.aB1 = true; if (lfmBio || ppt.lockBio) this.bio_allmusic = false; else if (amBio) this.bio_allmusic = true; else this.bio_allmusic = false;} this.btnBioBoth = false; break;
                case ppt.bothBio:
                    if (ppt.allmusic_bio) {if (amBio) {this.art_txt = (ppt.sourceHeading ? amBioSubHead[ppt.heading ? 0 : 1] + "\r\n" : "") + amBio; d.aB1 = true;} if (lfmBio) {lfmBio = lfmBio.replace(/Last.fm: /g, ""); this.art_txt = this.art_txt + (amBio ? "\r\n\r\n" : "") + (ppt.sourceHeading ? "#!#" + lfmBioSubHead[ppt.heading ? 0 : 1] + "\r\n" : "") + lfmBio; d.lB2 = true;} if (amBio) this.bio_allmusic = true; else if (lfmBio) this.bio_allmusic = false; else this.bio_allmusic = true;}
                    else {if (lfmBio) {lfmBio = lfmBio.replace(/Last.fm: /g, ""); this.art_txt = (ppt.sourceHeading ? lfmBioSubHead[ppt.heading ? 0 : 1] + "\r\n" : "") + lfmBio; d.lB1 = true;} if (amBio) {this.art_txt = this.art_txt + (lfmBio ? "\r\n\r\n" : "") + (ppt.sourceHeading ? "#!#" + amBioSubHead[ppt.heading ? 0 : 1] + "\r\n" : "") + amBio; d.aB2 = true;} if (lfmBio) this.bio_allmusic = false; else if (amBio) this.bio_allmusic = true; else this.bio_allmusic = false;}
                    this.btnBioBoth = amBio && lfmBio || !amBio && !lfmBio ? true : false; break;
            }
            switch (true) {
                case !ppt.bothRev:
                    if (ppt.allmusic_alb) {if (ppt.sourceHeading == 2 && !amRev && lfmRev) lfmRev = lfmRev.replace(/Last.fm: /g, ""); this.alb_txt = !ppt.lockRev ? amRev ? (ppt.sourceHeading == 2 ? amRevSubHead[ppt.heading ? 0 : 1] + "\r\n" : "") + amRev : (ppt.sourceHeading == 2 && lfmRev ? lfmRevSubHead[ppt.heading ? 0 : 1] + "\r\n" : "") + lfmRev : (ppt.sourceHeading == 2 && (amRev || p.imgText || ppt.text_only) ? amRevSubHead[ppt.heading ? 0 : 1] + "\r\n" + (amRev ? "" : "Nothing Found") : "") + amRev; if (amRev || ppt.lockRev) d.aR1 = true; else if (lfmRev) d.lR1 = true; if (amRev || ppt.lockRev) this.alb_allmusic = true; else if (lfmRev) this.alb_allmusic = false; else this.alb_allmusic = true;}
                    else {if (ppt.sourceHeading == 2 && lfmRev) lfmRev = lfmRev.replace(/Last.fm: /g, ""); this.alb_txt = !ppt.lockRev ? lfmRev ? (ppt.sourceHeading == 2 ? lfmRevSubHead[ppt.heading ? 0 : 1] + "\r\n" : "") + lfmRev : (ppt.sourceHeading == 2 && amRev ? amRevSubHead[ppt.heading ? 0 : 1] + "\r\n" : "") + amRev : (ppt.sourceHeading == 2 && (lfmRev || p.imgText || ppt.text_only) ? lfmRevSubHead[ppt.heading ? 0 : 1] + "\r\n" + (lfmRev ? "" : "Nothing Found") : "") + lfmRev; if (lfmRev || ppt.lockRev) d.lR1 = true; else if (amRev) d.aR1 = true; if (lfmRev || ppt.lockRev) this.alb_allmusic = false; else if (amRev) this.alb_allmusic = true; else this.alb_allmusic = false;} this.btnRevBoth = false; break;
                case ppt.bothRev:
                    if (ppt.allmusic_alb) {if (amRev) {this.alb_txt = (ppt.sourceHeading ? amRevSubHead[ppt.heading ? 0 : 1] + "\r\n" : "") + amRev; d.aR1 = true;} if (lfmRev) {lfmRev = lfmRev.replace(/Last.fm: /g, ""); this.alb_txt = this.alb_txt + (amRev ? "\r\n\r\n" : "") + (ppt.sourceHeading ? "#!#" + lfmRevSubHead[ppt.heading ? 0 : 1] + "\r\n" : "") + lfmRev; d.lR2 = true;} if (amRev) this.alb_allmusic = true; else if (lfmRev) this.alb_allmusic = false; else this.alb_allmusic = true;}
                    else {if (lfmRev) {lfmRev = lfmRev.replace(/Last.fm: /g, ""); this.alb_txt = (ppt.sourceHeading ? lfmRevSubHead[ppt.heading ? 0 : 1] + "\r\n" : "") + lfmRev; d.lR1 = true;} if (amRev) {this.alb_txt = this.alb_txt + (lfmRev ? "\r\n\r\n" : "") + (ppt.sourceHeading ? "#!#" + amRevSubHead[ppt.heading ? 0 : 1] + "\r\n" : "") + amRev; d.aR2 = true;} if (lfmRev) this.alb_allmusic = false; else if (amRev) this.alb_allmusic = true; else this.alb_allmusic = false;}
                    this.btnRevBoth = amRev && lfmRev || !amRev && !lfmRev ? true : false; break;
            }
            bioSubHead = !ppt.sourceHeading || !this.art_txt || !ppt.bothBio && ppt.sourceHeading != 2 ? 0 : 1; revSubHead = !ppt.sourceHeading || !this.alb_txt || !ppt.bothRev && ppt.sourceHeading != 2 ? 0 : 1;
            if (ui.stars == 1 && ppt.src && this.btnRevBoth) {let c = 0; this.avgRating = -1; if (this.amRating != -1 || this.lfmRating != -1) {this.avgRating = 0; if (this.amRating != -1) {this.avgRating += this.amRating; c++;} if (this.lfmRating != -1) {this.avgRating += this.lfmRating; c++;} this.avgRating /= c; this.avgRating = Math.round(this.avgRating);}}
            if (!p.imgText) this.text = ppt.artistView ? this.art_txt ? true : false : this.alb_txt ? true : false; else this.text = true; img.setCrop(true);
            if (!this.art_txt && (ppt.text_only || p.imgText)) this.art_txt = !ppt.heading ? bioFallbackText[1] : bioFallbackText[0];
            if (!this.alb_txt && (ppt.text_only || p.imgText)) this.alb_txt = !ppt.heading ? revFallbackText[1] : revFallbackText[0];
            if ((ppt.artistView && !this.art_txt || !ppt.artistView && !this.alb_txt) && !ppt.text_only) {this.head = false; but.set_src_btn_hide();}
            if (this.art_txt != art_txt_o || p_calc && p_calc !== 2) {art_txt_o = this.art_txt; this.art_calc();}
            if (this.alb_txt != alb_txt_o || p_calc && p_calc !== 1) {alb_txt_o = this.alb_txt; this.alb_calc();}
            if (ppt.text_only && !ui.blur) this.paint();
			if (p.alb_ix && p.inclTrackRev) this.paint();
        }
        if (!ppt.heading) {new_text = false; return;}
		if (updTrackSubHead()) return this.getText(false);
		if (p.lock && !new_text) {if (this.curHeadingID == this.headingID()) {new_text = false; return;} else this.curHeadingID = this.headingID();}
		new_text = false;
        if (ppt.artistView) this.heading = ui.headText ? tf(this.bio_allmusic ? ppt.amBioHeading : ppt.lfmBioHeading) : "";
		else this.heading = ui.headText ? (p.inclTrackRev && !this.alb_allmusic && showTrackHead ? tf(ppt.lfmTrackHeading, true) : tf(this.alb_allmusic ? ppt.amRevHeading : ppt.lfmRevHeading)) : "";
		if (p.lock) this.curHeadingID = this.headingID();
    }

    this.alb_calc = () => {
        if (!this.alb_txt || ppt.img_only) return; alb_txt_arr = []; d.bothR_ix = -1; let ctt = 0, l = [];
        s.gr(1, 1, false, g => {if (p.inclTrackRev) {let ti = this.alb_txt.match(/#!!#.+?$/m); if (ti) {ti = ti.toString(); if (g.CalcTextWidth(ti, ui.font) > p.text_w) {const new_ti = g.EstimateLineWrap(ti, ui.font, p.text_w - g.CalcTextWidth("... ", ui.font))[0] +"..."; this.alb_txt = this.alb_txt.replace(RegExp(ti.regex_escape()), new_ti);}}} l = g.EstimateLineWrap(this.alb_txt, ui.font, p.text_w);});
        for (let i = 0; i < l.length; i += 2) {if (!revSubHead) alb_txt_arr.push(l[i].trim()); else {if (l[i].includes("#!#")) {d.bothR_ix = ctt; l[i] = l[i].replace("#!#", "");} !i || ctt == d.bothR_ix ? alb_txt_arr.push(l[i]) : alb_txt_arr.push(l[i].trim()); ctt++;}}
        but.refresh(true); alb_scrollbar.reset(); alb_scrollbar.metrics(p.sbar_x, p.sbar_y, ui.sbar_w, p.sbar_h, p.lines_drawn, ui.font_h); alb_scrollbar.set_rows(alb_txt_arr.length);
        d.r = !ppt.summaryFirst && (ui.stars == 2 || ui.stars == 1 && !ppt.src) && (ppt.ratingTextPos == 2 || revSubHead && !ppt.ratingTextPos) && !ppt.artistView && alb_txt_arr.length > 1 && (!revSubHead ? (this.alb_allmusic && this.amRating != -1 || !this.alb_allmusic && this.lfmRating != -1) : true);
        d.aw1 = d.w[ppt.heading ? 3 : 7]; d.aw2 = d.w[ppt.heading ? 3 : 7]; d.lw1 = d.w[ppt.heading ? 4 : 8]; d.lw2 = d.w[ppt.heading ? 4 : 8];
        if (d.r) {
            if (this.amRating >= 0) {if (d.aR1) d.aw1 += d.w[0] + but.r_w2; if (d.aR2) d.aw2 += d.w[0] + but.r_w2; if (d.aR1 || d.aR2) d.ax = p.text_l + d.w[ppt.heading ? 3 : 7];}
            if (this.lfmRating >= 0) {if (d.lR1) d.lw1 += d.w[0] + but.r_w2; if (d.lR2) d.lw2 += d.w[0] + but.r_w2; if (d.lR1 || d.lR2)  d.lx = p.text_l + d.w[ppt.heading ? 4 : 8];}
            d.ry = Math.round((ui.font_h - but.r_h1 / 2) / 1.8);
        }
        if (!ppt.heading && revSubHead) {d.xa1 = p.text_l + d.aw1; d.xl1 = p.text_l +  d.lw1; d.x1a = p.text_l + d.aw2; d.x1l = p.text_l + d.lw2; const lw = p.text_l + p.text_w; d.xa2 = Math.max(d.xa1, lw); d.xl2 = Math.max(d.xl1, lw); d.x2a = Math.max(d.x1a, lw); d.x2l = Math.max(d.x1l, lw);}
		if (p.inclTrackRev == 1) this.getScrollPos();
    }

    this.art_calc = () => {
        if (!this.art_txt || ppt.img_only) return; art_txt_arr = []; d.bothB_ix = -1; let ctt = 0, l = [];
        s.gr(1, 1, false, g => l = g.EstimateLineWrap(this.art_txt, ui.font, p.text_w));
        for (let i = 0; i < l.length; i += 2) {if (!bioSubHead) art_txt_arr.push(l[i].trim()); else {if (l[i].includes("#!#")) {d.bothB_ix = ctt; l[i] = l[i].replace("#!#", "");} !i || ctt == d.bothB_ix ? art_txt_arr.push(l[i]) : art_txt_arr.push(l[i].trim()); ctt++;}}
        but.refresh(true); art_scrollbar.reset(); art_scrollbar.metrics(p.sbar_x, p.sbar_y, ui.sbar_w, p.sbar_h, p.lines_drawn, ui.font_h); art_scrollbar.set_rows(art_txt_arr.length);
		if (!ppt.heading && bioSubHead) {d.ax1 = p.text_l + d.w[5]; d.ax2 = Math.max(d.ax1, p.text_l + p.text_w); d.lx1 = p.text_l + d.w[6]; d.lx2 = Math.max(d.lx1, p.text_l + p.text_w);}
    }

    const lfm_bio = a => {
        const lfm_a = p.getPth('bio', ppt.focus, artist, "", "", p.sup.Cache, a, "", "", 'lfmBio', true).pth;
        if (!s.file(lfm_a)) return; mod.lfmBio = s.lastModified(lfm_a); if (mod.lfmBio == mod.lfmBio_o) return; lfmBio = s.open(lfm_a).trim(); if (!ppt.stats) {const f = lfmBio.indexOf("Last.fm: "); if (f != -1) lfmBio = lfmBio.slice(0, f).trim();}
        if (ppt.summaryFirst) {lfmBio = summaryFirstText("Top Tags: ", yrsActive, lfmBio, popNow); while(lfmBio.includes("\r\n\r\n\r\n")) lfmBio = lfmBio.replace(/\r\n\r\n\r\n/g, "\r\n\r\n");}
		else if (p.lfmLang_ix > 3) lfmBio = lfmBio.replace("Top Tags: ", topTags[p.lfmLang_ix] + ": ");
        new_text = true; mod.lfmBio_o = mod.lfmBio;
    }

    const am_bio = a => {
        const am_a = p.getPth('bio', ppt.focus, artist, "", "", p.sup.Cache, a, "", "", 'amBio', true).pth;
        if (!s.file(am_a)) return; mod.amBio = s.lastModified(am_a); if (mod.amBio == mod.amBio_o) return; amBio = s.open(am_a).trim();
        if (ppt.summaryFirst) {amBio = summaryFirstText("Genre: ", "Active: ", amBio); while(amBio.includes("\r\n\r\n\r\n")) amBio = amBio.replace(/\r\n\r\n\r\n/g, "\r\n\r\n");}
        new_text = true; mod.amBio_o = mod.amBio;
    }

    const am_rev = (a, aa, l) => {
        const am_b = p.getPth('rev', ppt.focus, artist, album, "", p.sup.Cache, a, aa, l, 'amRev', true).pth; let rat = "";
        if (!s.file(am_b)) {this.amRating = -1; but.check(); return;} mod.amRev = s.lastModified(am_b); if (mod.amRev == mod.amRev_o) return; amRev = s.open(am_b).trim();
        new_text = true; mod.amRev_o = mod.amRev; this.amRating = -1;
        let b = amRev.indexOf(">> Album rating: ") + 17; const f = amRev.indexOf(" <<"), subHeadOn = ppt.bothRev && ppt.sourceHeading || ppt.sourceHeading == 2;
        if (ppt.amRating) {if (b !=-1 && f != -1 && f > b) this.amRating = amRev.substring(b, f); if (!isNaN(this.amRating) && this.amRating != 0 && this.amRating != -1) this.amRating *= 2; else this.amRating = -1;}
        if ((ui.stars == 1 && ppt.src || !ppt.amRating) && f != -1) amRev = amRev.substring(f + 5);
        else if (!ppt.summaryFirst && (ui.stars == 2 || ui.stars == 1 && !ppt.src) && (ppt.ratingTextPos == 2 || subHeadOn && !ppt.ratingTextPos) && this.amRating != -1) {amRev = (!subHeadOn ? ppt.allmusic_name + ":\r\n\r\n" : "") + amRev.substring(f + 5);}
        else {if (!ui.stars || this.amRating == -1 || ppt.summaryFirst) {b = amRev.indexOf(" <<"); if (b != -1) amRev = amRev.slice(b + 3); if (ppt.summaryFirst) rat = this.amRating != -1 ? ppt.allmusic_name + ": " + this.amRating / 2 : "";} else if (ppt.allmusic_name != "Album rating") amRev = amRev.replace("Album rating", ppt.allmusic_name);}
        if (ppt.summaryFirst) {amRev = summaryFirstText("Genre: ", "Release Date: ", amRev, "", rat); while(amRev.includes("\r\n\r\n\r\n")) amRev = amRev.replace(/\r\n\r\n\r\n/g, "\r\n\r\n");}
		if (!amRev) but.check();
    }

    const lfm_rev = (a, aa, l) => {
        let lfm_tr_mod = "", rat = "", trackRev = "", trk = ""; const lfm_b = p.getPth('rev', ppt.focus, artist, album, "", p.sup.Cache, a, aa, l, 'lfmRev', true).pth;
        if (!s.file(lfm_b)) {this.lfmRating = -1; but.check(); if (!p.inclTrackRev) {alb_inf = ""; return;}}
        if (p.inclTrackRev) {
			trk = track.toLowerCase();
            trackRev = s.jsonParse(p.getPth('track', ppt.focus, trackartist, "Track Reviews", "", "", trackartist.clean(), "", "Track Reviews", 'lfmRev', true).pth, false, 'file');
            if (trackRev[trk] && trackRev[trk].update) lfm_tr_mod = trackRev[trk].update;
        }
        mod.lfmRev = s.file(lfm_b) && p.inclTrackRev != 2 ? s.lastModified(lfm_b) + lfm_tr_mod : lfm_tr_mod;
        if (mod.lfmRev == mod.lfmRev_o) return; alb_inf = "";
        if (p.inclTrackRev != 2) alb_inf = s.open(lfm_b).trim();
        new_text = true; mod.lfmRev_o = mod.lfmRev; this.lfmRating = -1;
        if (p.inclTrackRev != 2) {
            if (ppt.lfmRating) {const b = alb_inf.indexOf("Rating: "); if (b != -1) {this.lfmRating = alb_inf.substring(b).replace(/\D/g, "");
			this.lfmRating = Math.min(((Math.floor(0.1111 * this.lfmRating + 0.3333) / 2)), 5);
			if (ui.stars == 1 && ppt.src) this.lfmRating *= 2;
			if ((ui.stars == 2 || ui.stars == 1 && !ppt.src) && this.lfmRating != -1) {const subHeadOn = ppt.bothRev && ppt.sourceHeading || ppt.sourceHeading == 2; if (ppt.ratingTextPos == 2 || subHeadOn && !ppt.ratingTextPos) {this.lfmRating *= 2; if (!ppt.summaryFirst) alb_inf = (!subHeadOn ? ppt.lastfm_name + ":\r\n\r\n" : "") + alb_inf; else rat = ppt.lastfm_name + ": " + this.lfmRating;} else {if (!ppt.summaryFirst) alb_inf = ">> " + ppt.lastfm_name + ": " + this.lfmRating + " <<  " + ((/^Top Tags: /).test(alb_inf) ? "\r\n\r\n" : "") + alb_inf; else rat = ppt.lastfm_name + ": " + this.lfmRating;}}}}
            alb_inf = ppt.score ? alb_inf.replace("Rating: ", "") : alb_inf.replace(/^Rating: .*$/m, "").trim();
            if (ppt.summaryFirst) alb_inf = summaryFirstText("Top Tags: ", releaseDate, alb_inf, "", rat);
			else if (p.lfmLang_ix > 3) alb_inf = alb_inf.replace("Top Tags: ", topTags[p.lfmLang_ix] + ": ");
        }
		if (!ppt.stats) {alb_inf = alb_inf.replace(/^Last.fm: .*$(\n)?/gm, "").trim();}
        lfmRev = alb_inf;
        if (p.inclTrackRev) {
            if (trackRev && trackRev[trk]) {
                let wiki = ""; if (trackRev[trk].releases) wiki = trackRev[trk].releases;
                if (trackRev[trk].wiki) wiki += wiki ? "\r\n\r\n" + trackRev[trk].wiki : trackRev[trk].wiki;
                if (trackRev[trk].stats) wiki += wiki ? "\r\n\r\n" + trackRev[trk].stats : trackRev[trk].stats;
				if (wiki) {if (ppt.trackHeading == 1 && (alb_inf || !ppt.heading || ppt.bothRev && p.inclTrackRev == 2 && (alb_inf || amRev)) || ppt.trackHeading == 2) {showTrackHead = false; trackRev =  "#!!#" + tf(ppt.lfmTrackSubHeading, true) + "\r\n" + wiki;} else {showTrackHead = true; trackRev = wiki;} lfmRev = alb_inf + (alb_inf ? "\r\n\r\n" : "") + trackRev;} else showTrackHead = false;
				if ((alb_inf || amRev) && ppt.heading && !ppt.trackHeading) showTrackHead = false;
            }
        }
		if (!ppt.stats) {lfmRev = lfmRev.replace(/^Last.fm: .*$(\n)?/gm, "").trim();}
        if (ppt.summaryFirst || !ppt.stats) while(lfmRev.includes("\r\n\r\n\r\n")) lfmRev = lfmRev.replace(/\r\n\r\n\r\n/g, "\r\n\r\n");
		if (!lfmRev) but.check();
    }

    this.draw = gr => {
        if (!ppt.img_only || ppt.text_only) {
            getTxtFallback();
            if (ppt.overlayStyle && ppt.style > 3 && this.text && !ppt.text_only) {gr.SetSmoothingMode(2); const c = !ppt.blurDark && !ppt.blurLight ? ui.col.rectOv : ui.col.blurOv; let o = 0;
                switch (ppt.overlayStyle) {
                    case 1: gr.FillSolidRect(p.tBoxL, p.tBoxT, p.tBoxW, p.tBoxH, c); break;
                    case 2: o = Math.round(ui.arc_w / 2); gr.FillSolidRect(p.tBoxL + o, p.tBoxT + o, p.tBoxW - o * 2, p.tBoxH - o * 2, c); gr.DrawRect(p.tBoxL + o, p.tBoxT + o, p.tBoxW - ui.arc_w - 1, p.tBoxH - ui.arc_w - 1, ui.arc_w, ui.col.rectOvBor); break;
                    case 3: gr.FillRoundRect(p.tBoxL, p.tBoxT, p.tBoxW, p.tBoxH, p.arc, p.arc, c); break;
                    case 4: o = Math.round(ui.arc_w / 2); gr.FillRoundRect(p.tBoxL + o, p.tBoxT + o, p.tBoxW - o * 2, p.tBoxH - o * 2, p.arc, p.arc, c); gr.DrawRoundRect(p.tBoxL + o, p.tBoxT + o, p.tBoxW - ui.arc_w - 1, p.tBoxH - ui.arc_w - 1, p.arc, p.arc, ui.arc_w, ui.col.rectOvBor); break;
                }
            }
            if (ppt.artistView && this.art_txt) {
                const b = Math.max(Math.round(art_scrollbar.delta / ui.font_h + 0.4), 0), f = Math.min(b + p.lines_drawn, art_txt_arr.length);
                for (let i = b; i < f; i++) {
                    const item_y = ui.font_h * i + p.text_t - art_scrollbar.delta;
                    if (item_y < p.max_y) {
                        if (!ppt.heading && bioSubHead) {const iy = Math.round(item_y + ui.font_h / 2);
                            if (!i && d.aB1) gr.DrawLine(d.ax1, iy, d.ax2, iy, ui.l_h, ui.col.centerLine);
                            if (!i && d.lB1) gr.DrawLine(d.lx1, iy, d.lx2, iy, ui.l_h, ui.col.centerLine);
                            if (i == d.bothB_ix && d.aB2) gr.DrawLine(d.ax1, iy, d.ax2, iy, ui.l_h, ui.col.centerLine);
                            if (i == d.bothB_ix && d.lB2) gr.DrawLine(d.lx1, iy, d.lx2, iy, ui.l_h, ui.col.centerLine);
                        }
                    if (bioSubHead && (!i || i == d.bothB_ix)) gr.GdiDrawText(art_txt_arr[i], ui.sourceFont, ui.col.source, p.text_l, item_y, p.text_w, ui.font_h, this.l);
                    else gr.GdiDrawText(art_txt_arr[i], ui.font, ui.col.text, p.text_l, item_y, p.text_w, ui.font_h, this.l);
                    }
                }
                if (ppt.sbarShow) art_scrollbar.draw(gr);
            }
            if (!ppt.artistView && this.alb_txt) {
                const b = Math.max(Math.round(alb_scrollbar.delta / ui.font_h + 0.4), 0), f = Math.min(b + p.lines_drawn, alb_txt_arr.length);
                const r = !ppt.summaryFirst && (ui.stars == 2 || ui.stars == 1 && !ppt.src) && (ppt.ratingTextPos == 2 || revSubHead && !ppt.ratingTextPos) && !ppt.artistView && alb_txt_arr.length > 1 && (!revSubHead ? (this.alb_allmusic && this.amRating != -1 || !this.alb_allmusic && this.lfmRating != -1) : true);
                let song = -1;
                for (let i = b; i < f; i++) {
                    let item_y = ui.font_h * i + p.text_t - alb_scrollbar.delta;
                    if (item_y < p.max_y) {
                        if (alb_txt_arr[i].startsWith("#!!#")) song = i; if (i > song && song != -1 && !revSubHead) item_y += extra_y;
                        if (r) switch (revSubHead) {
                            case 0: const rating = this.alb_allmusic ? this.amRating : this.lfmRating; if (i == 0 && rating >= 0)
                            gr.DrawImage(but.ratingImages[rating], p.text_l + gr.CalcTextWidth((this.alb_allmusic ? ppt.allmusic_name : ppt.lastfm_name) + ":  ", ui.font), item_y + d.ry, but.r_w1 / 2, but.r_h1 / 2, 0, 0, but.r_w1, but.r_h1, 0, 255); break;
                            case 1:
                                if (!i) {
                                    if (d.aR1 && this.amRating >= 0) {gr.DrawImage(but.ratingImages[this.amRating], d.ax, item_y + d.ry, but.r_w1 / 2, but.r_h1 / 2, 0, 0, but.r_w1, but.r_h1, 0, 255);}
                                    if (d.lR1 && this.lfmRating >= 0) {gr.DrawImage(but.ratingImages[this.lfmRating], d.lx, item_y + d.ry, but.r_w1 / 2, but.r_h1 / 2, 0, 0, but.r_w1, but.r_h1, 0, 255);}
                                }
                                if (i == d.bothR_ix) {
                                    if (d.aR2 && this.amRating >= 0) {gr.DrawImage(but.ratingImages[this.amRating], d.ax, item_y + d.ry, but.r_w1 / 2, but.r_h1 / 2, 0, 0, but.r_w1, but.r_h1, 0, 255);}
                                    if (d.lR2 && this.lfmRating >= 0) {gr.DrawImage(but.ratingImages[this.lfmRating], d.lx, item_y + d.ry, but.r_w1 / 2, but.r_h1 / 2, 0, 0, but.r_w1, but.r_h1, 0, 255);}
                                }
                                break;
                        }
                        if (!ppt.heading && revSubHead) {const iy = Math.round(item_y + ui.font_h / 2);
                            if (!i) {
                                if (d.aR1) gr.DrawLine(d.xa1, iy, d.xa2, iy, ui.l_h, ui.col.centerLine);
                                if (d.lR1) gr.DrawLine(d.xl1, iy, d.xl2, iy, ui.l_h, ui.col.centerLine);
                            }
                            if (i == d.bothR_ix) {
                                if (d.aR2) gr.DrawLine(d.x1a, iy, d.x2a, iy, ui.l_h, ui.col.centerLine);
                                if (d.lR2) gr.DrawLine(d.x1l, iy, d.x2l, iy, ui.l_h, ui.col.centerLine);
                            }
                        }
                        if (revSubHead && (!i || i == d.bothR_ix)) gr.GdiDrawText(alb_txt_arr[i], ui.sourceFont, ui.col.source, p.text_l, item_y, p.text_w, ui.font_h, this.l);
                        else if (song == i) {
                            const trlabel = alb_txt_arr[i].replace("#!!#", "");
                            if (!ppt.heading && !i) {const iy = Math.round(item_y + ui.font_h / 2); const x1 = p.text_l + gr.CalcTextWidth(trlabel + " ", ui.trackFont); gr.DrawLine(x1, iy, Math.max(x1, p.text_l + p.text_w), iy, ui.l_h, ui.col.centerLine);}
                            gr.GdiDrawText(trlabel, ui.trackFont, ui.col.track, p.text_l, item_y, p.text_w, ui.font_h, this.l);
                        }
                        else gr.GdiDrawText(alb_txt_arr[i], ui.font, ui.col.text, p.text_l, item_y, p.text_w, ui.font_h, this.l);
                    }
                } if (ppt.sbarShow) alb_scrollbar.draw(gr);}
        }
    }

    this.toggle = (n) => {
        const text_state = this.text;
        switch (n) {
            case 0:
				this.logScrollPos(); ppt.allmusic_bio = !ppt.allmusic_bio; if (ppt.allmusic_bio) done.amBio = false; else done.lfmBio = false; this.getText(false);
                if (ppt.allmusic_bio != this.bio_allmusic) {if (ppt.heading) this.na = ppt.allmusic_bio ? "  [AllMusic N/A]" : "  [Last.fm N/A]"; else {this.na = ppt.allmusic_bio ? "AllMusic N/A" : "Last.fm N/A"; this.paint();} timer.clear(timer.source); timer.source.id = setTimeout(() => {this.na = ""; this.paint(); timer.source.id = null;}, 5000);} else this.na = "";
                this.getScrollPos(); if (!ppt.img_only && !ppt.text_only && this.text != text_state) img.clear_rs_cache(); img.get_images();
				break;
            case 1:
				this.logScrollPos(); ppt.allmusic_alb = !ppt.allmusic_alb; if (ppt.allmusic_alb) done.amRev = false; else done.lfmRev = false; this.getText(false);
                if (ppt.allmusic_alb != this.alb_allmusic) {if (ppt.heading) this.na = ppt.allmusic_alb ? "  [AllMusic N/A]" : "  [Last.fm N/A]"; else {this.na = ppt.allmusic_alb ? "AllMusic N/A" : "Last.fm N/A"; this.paint();} timer.clear(timer.source); timer.source.id = setTimeout(() => {this.na = ""; this.paint(); timer.source.id = null;}, 5000);} else this.na = "";
				this.getScrollPos(); if (!ppt.img_only && !ppt.text_only && this.text != text_state) img.clear_rs_cache(); img.get_images();
				break;
            case 2: ppt.lockBio = !ppt.lockBio; if (ppt.allmusic_bio) done.amBio = false; else done.lfmBio = false; this.getText(false); img.clear_rs_cache(); img.get_images(); but.check(); break;
            case 3: ppt.lockRev = !ppt.lockRev; if (ppt.allmusic_alb) done.amRev = false; else done.lfmRev = false; this.getText(false); img.clear_rs_cache(); img.get_images(); but.check(); break;
            case 4: ppt.bothBio = !ppt.bothBio; done.amBio = false; done.lfmBio = false; this.getText(true); img.clear_rs_cache(); img.get_images(); but.check(); break;
            case 5: ppt.bothRev = !ppt.bothRev; this.albumFlush(); this.getText(true); img.clear_rs_cache(); img.get_images(); but.check(); break;
            case 6:
				this.logScrollPos(); ppt.allmusic_bio = !ppt.allmusic_bio; done.amBio = false; done.lfmBio = false; this.getText(1);
                if (ppt.allmusic_bio != this.bio_allmusic) {if (ppt.heading) this.na = ppt.allmusic_bio ? "  [AllMusic N/A]" : "  [Last.fm N/A]"; else {this.na = ppt.allmusic_bio ? "AllMusic N/A" : "Last.fm N/A"; this.paint();} timer.clear(timer.source); timer.source.id = setTimeout(() => {this.na = ""; this.paint(); timer.source.id = null;}, 5000);} else this.na = "";
				this.getScrollPos(); if (!ppt.img_only && !ppt.text_only && this.text != text_state) img.clear_rs_cache(); img.get_images();
				break;
            case 7:
				this.logScrollPos(); ppt.allmusic_alb = !ppt.allmusic_alb; done.amRev = false; done.lfmRev = false; this.getText(2);
                if (ppt.allmusic_alb != this.alb_allmusic) {if (ppt.heading) this.na = ppt.allmusic_alb ? "  [AllMusic N/A]" : "  [Last.fm N/A]"; else {this.na = ppt.allmusic_alb ? "AllMusic N/A" : "Last.fm N/A"; this.paint();} timer.clear(timer.source); timer.source.id = setTimeout(() => {this.na = ""; this.paint(); timer.source.id = null;}, 5000);} else this.na = "";
				this.getScrollPos(); if (!ppt.img_only && !ppt.text_only && this.text != text_state) img.clear_rs_cache(); img.get_images();
				break;
            case 8: p.sizes(); img.clear_rs_cache(); this.albumFlush(); this.artistFlush(); alb_txt_o = ""; art_txt_o = ""; this.getText(true); img.get_images(); break;
            case 9: if (p.inclTrackRev == 1) this.logScrollPos(); ui.get_font(); ui.calc_text(); p.sizes(); ui.get_colors(); but.create_stars(); this.albumFlush(); this.artistFlush(); if (!ppt.img_only ) img.clear_rs_cache(); alb_txt_o = ""; art_txt_o = ""; this.getText(true); but.refresh(true); img.get_images(); break;
            case 10: if (p.inclTrackRev == 1) this.logScrollPos(); ui.calc_text(); p.sizes(); if (!ppt.img_only ) img.clear_rs_cache(); alb_txt_o = ""; art_txt_o = ""; this.alb_calc(); this.art_calc(); img.get_images(); if (ppt.text_only && !ui.blur) this.paint(); break;
            case 11: if (p.inclTrackRev == 1) ui.get_colors(); ui.get_font(); p.sizes(); if (!ppt.img_only ) img.clear_rs_cache(); this.albumFlush(); this.getText(false); img.get_images(); break;
            case 12: if (p.inclTrackRev == 1) this.logScrollPos(); ui.get_colors(); ui.get_font(); p.sizes(); if (!ppt.img_only ) img.clear_rs_cache(); alb_txt_o = ""; art_txt_o = ""; this.alb_calc(); this.art_calc(); img.get_images(); if (ppt.text_only && !ui.blur) this.paint(); break;
            case 13: p.sizes(); this.albumFlush(); this.artistFlush(); img.clear_rs_cache(); if (!p.art_ix && ppt.artistView || !p.alb_ix && !ppt.artistView) {this.getText(false); img.get_images();} else {this.get_multi(false, p.art_ix, p.alb_ix); img.get_multi(p.art_ix, p.alb_ix);} if (ppt.artistView) {alb_txt_o = ""; this.art_calc();} else {art_txt_o = ""; this.alb_calc();} break;
			case 14: ppt.mul_item = !ppt.mul_item; if (ppt.mul_item) p.get_multi(); else {p.lock = 0; p.alb_ix = 0; p.art_ix = 0; p.albums = []; p.artists = []; this.album_reset(true); this.artist_reset(true); this.getText(false); img.get_images(true);} but.refresh(); this.paint(); break;
        }
    }
}

function Tagger() {
    let pt = [["ADV.Last.fmGenreTag Find>Replace", "-melancholic->melancholy|alt country>alt-country|alternativ>alternative|american artist>american|americana>american|america>american|andes>andean|australian artist>australian|australia>australian|avantgarde>avant-garde|blue eyed soul>blue-eyed soul|bluesrock>blues rock|blues-rock>blues rock|boyband>boybands|brasil>brazilian|british artist>british|britpop>brit pop|canada>canadian|canterbury>canterbury scene|chill out>chillout|christmas music>christmas|christmas songs>christmas|classique>classical|composer>composers|covers>cover|cover songs>cover|doo-wop>doo wop|duets>duet|easy-listening>easy listening|england>english|eurovision song contest>eurovision|experimental hip hop>experimental hip-hop|favourite albums of all time>favourite albums|favourite lps>favourite albums|favorite song>favourite song|favourite song>favourite albums|favorit>favourite albums|favourite>favourite albums|female>female vocalists|female vocalist>female vocalists|female vocals>female vocalists|fok rock>folk rock|folk-rock>folk rock|genre: psychedelic rock>psychedelic rock|good cd>good stuff|girl group>girl groups|greek music>greek|hip hop>hip-hop|is this what they call music nowedays>is this what they call music nowadays|jamaican artist>jamaican|jamaica>jamaican|jazz-rock>jazz rock|love songs>love|male>male vocalists|male vocals>male vocalists|mis albumes favoritos>favourite albums|motown soul>motown|movie>soundtrack|my favorites>favourite albums|musical>musicals|new orleans>new orleans blues|new orleans rhythm and blues>new orleans blues|nu-metal>nu metal|one hit wonder>one hit wonders|orchestra>orchestral|pop - adult>pop|pop-rock>pop rock|post punk>post-punk|prog>progressive|progressiv>progressive|prog rock>progressive rock|prog-rock>progressive rock|punk albums>punk|R&b>rnb|relaxation>relaxing|relax>relaxing|rhythm and blues>rnb|rock - progressive>progressive rock|rock & roll>rock n roll|rock and roll>rock n roll|rock n' roll>rock n roll|rock'n'roll>rock n roll|rock progressif>progressive rock|san fransico>san francisco|singer-songwriters>singer-songwriter|soul new>soul|synth>synthesiser|synthesizer>synthesiser|synthpop>synth pop|tech-house>tech house|underrated albums>underrated|weallgetold>we all get old|xmas>christmas|allboutguitar lesson>allboutguitar|allboutguitarcom>allboutguitar|-Progressive-And-Classic-Rock->|38 Special>|a good song>|acdc>|album cold play>|albums i have listened to>|albums i have on mp3>|albums i listened to>|albums i love>|albums i own>|albums i own on cd>|albums i own on vinyl>|albumsiown>|aleister crowley>|all>|barkley james harvest>|beatles>|best>|best album>|best albums ever>|best albums of all time>|best debut albums>|best top-rated albums>|bill bruford>|black sabbath>|blink 182>|bob dylan>|bob marley>|bowie>|cd i own>|christopher lee>|christine mcvie>|chupo buceta>|classic best of>|danny kirwan>|destinys child>|dylan>|ellie goulding>|elton john>|elvis costello>|featuring>|fleetwood mac>|frank zappa>|freddie mercury>|george michael and elton john>|girls aloud>|gonna listen>|grace slick>|guns n roses>|heaven and hell>|hello nadine>|intro>|j holiday>|j holiday - suffocate>|jan akkerman>|jan dismas zelenka>|jean michel jarre>|jecks>|joanne>|joe lynn turner>|jon anderson>|jonanderson>|jj cale>|jonas brothers>|judas priest>|kanye west>|kelis - kelis was here>|kesha>|lana del rey>|led zeppelin>|lesley garret>|liam gallagher>|lil boosie>|lord of the dance>|love this album>|love it>|loved>|lovely>|marillion>|michael jackson>|mia>|mike patton>|monkees>|music i love>|must-have>|my albums>|my collection>|my private work station>|my vinyl>|myhits>|n yepes>|neil young>|neil-young>|noel>|nyoung>|own cd>|own on vinyl>|paul kantner>|paul mccartney>|pavarotti>|pink>|pink floyd>|pj Harvey>|prince>|queen>|r kelly>|rahsaan patterson>|raul seixas>|robert plant>|rob halford>|roger waters>|rolling stones>|ryan adams>|selena gomez>|shirley bassey>|singles>|smashing pumpkins>|smokey robinson>|sonny terry>|special>|spice girls>|steelydan>|steve albini>|tarantino>|tatu>|the beatles>|the phantom of the opera>|to buy>|to listen>|tom petty>|tony visconti>|top cd>|trasy chapman-crossroads>|traveling wilburys>|try before i buy>|vinyl i own>|vinyl>|vocalist of the two- tone band the beat>|watson>|work bitch>|yes>|yes type>", "replace"], ["ADV.Last.fmGenreTag Number Clean Up", true, "cleanNo"], ["ADV.Last.fmGenreTag Run Find>Replace", true, "runReplace"], ["ADV.Last.fmGenreTag Strip Artist+Album Names", true, "stripNames"]]; ppt.init('manual', pt, this); pt = undefined;
    const arr1 = [], arr2 = [], simList = [];
    let ix = -1; this.replace = this.replace.replace(/>/g, "|").split("|");
    this.replace.forEach((v, i) => {if (i % 2 == 0) arr1.push(v.trim()); else arr2.push(v.trim());}); this.replace = undefined;
    const kww = "Founded In: |Born In: |Gegründet: |Formado en: |Fondé en: |Luogo di fondazione: |出身地: |Założono w: |Local de fundação: |Место основания: |Grundat år: |Kurulduğu tarih: |创建于: |Geboren in: |Lugar de nacimiento: |Né\\(e\\) en: |Luogo di nascita: |出身地: |Urodzony w: |Local de nascimento: |Место рождения: |Född: |Doğum yeri: |生于: ";
    const kw = "Similar Artists: |Ähnliche Künstler: |Artistas Similares: |Artistes Similaires: |Artisti Simili: |似ているアーティスト: |Podobni Wykonawcy: |Artistas Parecidos: |Похожие исполнители: |Liknande Artister: |Benzer Sanatçılar: |相似艺术家: ";

    const uniq = a => {const out = [], seen = {}; let j = 0; a.forEach(v => {const item = v.toLowerCase(); if (seen[item] !== 1) {seen[item] = 1; out[j++] = v.titlecase().replace(/\bAor\b/g, "AOR").replace(/\bDj\b/g, "DJ").replace(/\bFc\b/g, "FC").replace(/\bIdm\b/g, "IDM").replace(/\bNwobhm\b/g, "NWOBHM").replace(/\bR&b\b/g, "R&B").replace(/\bRnb\b/g, "RnB").replace(/\bUsa\b/g, "USA").replace(/\bUs\b/g, "US").replace(/\bUk\b/g, "UK");}}); return out;}

    const lfmTidy = (n, a, l) => {
        n = n.split('\n')[0].trim().split(", ");
        const match = (v, a, l) => {v = v.toLowerCase(); if (v == a.toLowerCase() || v == s.removeDiacritics(a).toLowerCase() || v == l.toLowerCase()) return true;}
        if (this.cleanNo) n.forEach((v, i) => {n[i] = v.replace(/\b(\d\d\d\d).+\b/g, "$1").replace(/\b(\d\d)'s\b/gi, "$1s").replace(/^\b(twenties|192\d(s|))\b/gi, "20s").replace(/^\b(thirties|193\d(s|))\b/gi, "30s").replace(/^\b(forties|194\d(s|))\b/gi, "40s").replace(/^\b(fifties|195\d(s|))\b/gi, "50s").replace(/^\b(sixties|196\d(s|))\b/gi, "60s").replace(/^\b(seventies|197\d(s|))\b/gi, "70s").replace(/^\b(eighties|198\d(s|))\b/gi, "80s").replace(/^\b(nineties|199\d(s|))\b/gi, "90s").replace(/^\b(noughties|200\d(s|))\b/gi, "00s").replace(/^\b(tens|201\d(s|))\b/gi, "10s"); if ((/\b\d\ds\b/).test(n[i])) n[i] = n[i].replace(/\b(\d\ds).+\b/, "$1"); else n[i] = n[i].replace(/.*\d.*/, "");});
        if (this.stripNames) n = n.filter(v => !match(v, a, l));
        if (this.runReplace) n.forEach((v, i) => {arr1.forEach((w, j) => {if (v.toLowerCase() == w.toLowerCase()) n[i] = arr2[j];});});
        n = n.filter(v => v); n = uniq(n); return n;
    }

    this.check = handles => {
        if (!handles) return;
        let a = "", a_o = "####", rec = 0, writeSent = false;
        const tf_a = FbTitleFormat(p.tf.a), artists = tf_a.EvalWithMetadbs(handles), sa = [], simArr = [];
        for (let i = 0; i < handles.Count; i++) {a = artists[i].toUpperCase(); if (a != a_o) {a_o = a; sa[i] = ""; const lfmBio = p.cleanPth(p.pth.lfmBio, handles[i], 'tag') + a.clean() + ".txt"; if (s.file(lfmBio)) {const lfm_a = s.open(lfmBio); let sim = lfm_a.match(RegExp(kw)); if (sim) {sim = sim.toString(); ix = lfm_a.lastIndexOf(sim); if (ix != -1) {sa[i] = lfm_a.substring(ix + sim.length); sa[i] = sa[i].split('\n')[0].trim().split(", "); if (sa[i].length > 6) simArr.push(a);}}}}}
        if (simArr.length) {let i = 0; timer.clear(timer.sim1); timer.sim1.id = setInterval(() => {if (i < simArr.length) {const lfm_similar = new Lfm_similar_artists(() => lfm_similar.on_state_change(), lfm_similar_search_done); lfm_similar.Search(simArr[i], simArr.length, handles, 6); i++;} else timer.clear(timer.sim1);}, simArr.length < 100 ? 20 : 300);} else this.write_tags(handles);
        const lfm_similar_search_done = (res1, res2, p_done, p_handles) => {rec++; if (!timer.sim2.id) timer.sim2.id = setTimeout(() => {writeSent = true; this.write_tags(p_handles); timer.sim2.id = null;}, 60000); simList.push({name:res1,similar:res2}); if (p_done == rec && !writeSent) {timer.clear(timer.sim2); this.write_tags(p_handles);}};
    }

    this.write_tags = handles => {
        if (!handles) return;
        let a = "", a_o = "####",  aa = "", aa_o = "####", l = "", l_o = "####";
        const albGenre_am = [], albTags = [], amMoods = [], amRating = [], amThemes = [], artGenre_am = [], artTags = [], cue = [], locale = [], rem = [], sa = [], tags = [];
        const tf_a = FbTitleFormat(p.tf.a), tf_aa = FbTitleFormat(p.tf.aa), tf_cue = FbTitleFormat("$ext(%path%)"), tf_l = FbTitleFormat(p.tf.l);
        const artists = tf_a.EvalWithMetadbs(handles), albumartists = tf_aa.EvalWithMetadbs(handles), cues = tf_cue.EvalWithMetadbs(handles), albums = tf_l.EvalWithMetadbs(handles);
        for (let i = 0; i < handles.Count; i++) {
            a = artists[i].toUpperCase(); aa = albumartists[i].toUpperCase(); cue[i] = cues[i].toLowerCase() == "cue"; l = albums[i].toUpperCase();
            if (!name.alb_strip) l = l.replace(/CD(\s*\d|\.0\d)|CD\s*(One|Two|Three)|Disc\s*\d|Disc\s*(III|II|I|One|Two|Three)\b/gi,"").replace(/\(\s*\)|\[\s*\]/g, " ").replace(/\s\s+/g, " ").replace(/-\s*$/g, " ").trim();
            else l = l.replace(/CD(\s*\d|\.0\d)|CD\s*(One|Two|Three)|Disc\s*\d|Disc\s*(III|II|I|One|Two|Three)\b|(Bonus\s*Track|Collector's|(Digital\s*|Super\s*|)Deluxe|Digital|Expanded|Limited|Platinum|Reissue|Special)\s*(Edition|Version)|(Bonus\s*(CD|Disc))|\d\d\w\w\s*Anniversary\s*(Expanded\s*|Re(-|)master\s*|)(Edition|Re(-|)master|Version)|((19|20)\d\d(\s*|\s*-\s*)|)(Digital(ly|)\s*|)(Re(-|)master(ed|)|Re(-|)recorded)(\s*Edition|\s*Version|)|\(Deluxe\)|\(Mono\)|\(Reissue\)|\(Revisited\)|\(Stereo\)|\(Web\)|\[Deluxe\]|\[Mono\]|\[Reissue\]|\[Revisited\]|\[Stereo\]|\[Web\]/gi,"").replace(/\(\s*\)|\[\s*\]/g, " ").replace(/\s\s+/g, " ").replace(/-\s*$/g, " ").trim();
            if (a != a_o) {
                a_o = a; sa[i] = "";
                if (p.tag[6].enabled || p.tag[7].enabled || p.tag[8].enabled && p.tag[8].enabled < 7) {
                    artTags[i] = ""; locale[i] = ""; const lfmBio = p.cleanPth(p.pth.lfmBio, handles[i], 'tag') + a.clean() + ".txt";
                    if (s.file(lfmBio)) {
                        const lfm_a = s.open(lfmBio);
                        if (p.tag[6].enabled) {ix = lfm_a.lastIndexOf("Top Tags: "); if (ix != -1) {artTags[i] = lfm_a.substring(ix + 10); artTags[i] = lfmTidy(artTags[i], a, l);}}
                        if (p.tag[7].enabled) {
                            let loc = lfm_a.match(RegExp(kww, "i")); if (loc) {
                                loc = loc.toString();
                                ix = lfm_a.lastIndexOf(loc);
                                if (ix != -1) {
                                    locale[i] = lfm_a.substring(ix + loc.length);
                                    locale[i] = locale[i].split('\n')[0].trim().split(", ");
                        }}}
                        if (p.tag[8].enabled && p.tag[8].enabled < 7) {
                            let sim = lfm_a.match(RegExp(kw)); if (sim) {
                                sim = sim.toString(); ix = lfm_a.lastIndexOf(sim); if (ix != -1) {
                                    sa[i] = lfm_a.substring(ix + sim.length); sa[i] = sa[i].split('\n')[0].trim().split(", ");
                                }
                                if (sa[i].length > 6) {
                                    sa[i] = ""; simList.some(v => {
                                        if (v.name == a && v.similar.length) {
                                            sa[i] =  v.similar; return true;
                                }});}
                                if (sa[i]) $.take(sa[i], p.tag[8].enabled);
                }}}}
                if (p.tag[8].enabled > 6) {
                    const lfmSim = p.cleanPth(p.pth.lfmSim, handles[i], 'tag') + a.clean() + " And Similar Artists.json"; let nm = ""; sa[i] = "";
                    if (s.file(lfmSim)) {const lfm_s = s.jsonParse(lfmSim, false, 'file'); let newStyle = false; if (lfm_s) {
                        if (lfm_s[0].hasOwnProperty('name')) {newStyle = true; lfm_s.shift();}
                        $.take(lfm_s, p.tag[8].enabled);
                        if (lfm_s.length) {
                            sa[i] = [];
                            lfm_s.forEach(v => {
                                nm = newStyle ? v.name : v; if (nm) sa[i].push(nm);
                });}}}}
                if (!sa[i].length) sa[i] = "";
                if (p.tag[4].enabled) {
                    artGenre_am[i] = ""; const amBio = p.cleanPth(p.pth.amBio, handles[i], 'tag') + a.clean() + ".txt";
                    if (s.file(amBio)) {const am_a = s.open(amBio); ix = am_a.lastIndexOf("Genre: "); if (ix != -1) {artGenre_am[i] = am_a.substring(ix + 7); artGenre_am[i] = artGenre_am[i].split('\n')[0].trim().split(", ");}}
                }
            } else {artGenre_am[i] = artGenre_am[i - 1]; artTags[i] = artTags[i - 1]; locale[i] = locale[i - 1]; sa[i] = sa[i - 1];}
            if (aa + l != aa_o + l_o) {
                aa_o = aa; l_o = l;
                if (p.tag[0].enabled || p.tag[1].enabled || p.tag[2].enabled || p.tag[3].enabled) {
                    albGenre_am[i] = ""; amMoods[i] = ""; amRating[i] = ""; amThemes[i] = ""; const amRev = p.cleanPth(p.pth.amRev, handles[i], 'tag') + aa.clean() + " - " + l.clean() + ".txt";
                    if (s.file(amRev)) {
                        const aRev = s.open(amRev);
                        if (p.tag[0].enabled) {ix = aRev.lastIndexOf("Genre: "); if (ix != -1) {albGenre_am[i] = aRev.substring(ix + 7); albGenre_am[i] = albGenre_am[i].split('\n')[0].trim().split(", ");}}
                        if (p.tag[1].enabled) {ix = aRev.lastIndexOf("Album Moods: "); if (ix != -1) {amMoods[i] = aRev.substring(ix + 13); amMoods[i] = amMoods[i].split('\n')[0].trim().split(", ");}}
                        if (p.tag[2].enabled) {const b = aRev.indexOf(">> Album rating: ") + 17, f = aRev.indexOf(" <<"); if (b != -1 && f != -1 && f > b) {amRating[i] = aRev.substring(b, f).trim() * 2; if (amRating[i] == 0) amRating[i] = "";}}
                        if (p.tag[3].enabled) {ix = aRev.lastIndexOf("Album Themes: "); if (ix != -1) {amThemes[i] = aRev.substring(ix + 14); amThemes[i] = amThemes[i].split('\n')[0].trim().split(", ");}}
                    }
                }
                if (p.tag[5].enabled) {
                    albTags[i] = ""; const lfmRev = p.cleanPth(p.pth.lfmRev, handles[i], 'tag') + aa.clean() + " - " + l.clean() + ".txt";
                    if (s.file(lfmRev)) {const lRev = s.open(lfmRev); ix = lRev.lastIndexOf("Top Tags: "); if (ix != -1) {albTags[i] = lRev.substring(ix + 10); albTags[i] = lfmTidy(albTags[i], aa, l);}}
                }
            } else {albGenre_am[i] = albGenre_am[i - 1]; amMoods[i] = amMoods[i - 1]; amRating[i] = amRating[i - 1]; amThemes[i] = amThemes[i- 1]; albTags[i] = albTags[i - 1];}
		}
		for (let i = 0; i < handles.Count; i++) {
            let tg = {}, albG_amkey = "", albM_amkey = "", albR_amkey = "", albT_amkey = "", artG_amkey = "", albG_lfkey = "", artG_lfkey = "", localekey = "", sikey = "";
            if (!cue[i] && (albGenre_am[i] || amMoods[i] || amRating[i] || amThemes[i] || artGenre_am[i] ||  albTags[i] || artTags[i] || locale[i] || sa[i])) {tg = {};
                albG_amkey = albGenre_am[i] ? p.tag[0].name : "##Null##"; tg[albG_amkey] = albGenre_am[i];
                albM_amkey = amMoods[i] ? p.tag[1].name : "##Null##"; tg[albM_amkey] = amMoods[i];
                albR_amkey = amRating[i] ? p.tag[2].name : "##Null##"; tg[albR_amkey] = amRating[i];
                albT_amkey = amThemes[i] ? p.tag[3].name : "##Null##"; tg[albT_amkey] = amThemes[i];
                artG_amkey = artGenre_am[i] ? p.tag[4].name : "##Null##"; tg[artG_amkey] = artGenre_am[i];
                albG_lfkey = albTags[i] ? p.tag[5].name : "##Null##"; tg[albG_lfkey] = albTags[i];
                artG_lfkey = artTags[i] ? p.tag[6].name : "##Null##"; tg[artG_lfkey] = artTags[i];
                localekey = locale[i] ? p.tag[7].name : "##Null##"; tg[localekey] = locale[i];
                sikey = sa[i] ? p.tag[8].name : "##Null##"; tg[sikey] = sa[i];
                tags.push(tg);
            } else rem.push(i);
        }
        let i = rem.length; while (i--)  handles.RemoveById(rem[i]);
        if (handles.Count) handles.UpdateFileInfoFromJSON(JSON.stringify(tags));
    }
}

function TextBox() {
    const font_e = gdi.Font("Segoe UI", 15 * s.scale, 1), lc = StringFormat(0, 1);
    let init_x = 0, init_y = 0, x_init = 0, y_init = 0, si = "", st = ""; this.down = false; this.focus = true;

	const editText = () => (ppt.text_only ? "Type: Text Only" : (ppt.img_only ? "Type: Image Only" : "Name: " + p.style_arr[ppt.style] + (ppt.style < 4 ? "\n\nType: Auto\n - Layout Adjust: Drag Line" : "\n\nType: Freestyle\n - Layout Adjust: Drag Lines or Boxes: Ctrl (Any), Ctrl + Alt (Image) or Ctrl + Shift (Text)\n - Overlay Strength: Shift + Wheel Over Text"))) + (img.reflection() && !ppt.text_only ? "\n - Reflection Strength: Shift + Wheel Over Main Image" : "") + (!ppt.img_only ? "\n - Text Size: Ctrl + Wheel Over Text" : "") + "\n - Padding: Panel Properties";
    const sizes = bypass => {p.sizes(bypass); but.check(); t.paint();}

    this.lbtn_dn = (x, y) => {p.newStyle = false; if (!utils.IsKeyPressed(0x11)) return; this.down = true; init_x = x; init_y = y; x_init = x; y_init = y;}

    this.lbtn_up = (x, y) => {
        if (!this.down) return; window.SetCursor(32512); this.down = false; img.resetFade = true;
        if (ppt.style > 3) {
            const obj = ppt.style == 4 ? p.overlay : p.styles[ppt.style - 5];
            const imL = Math.round(p.im_l * p.w), imR = Math.round(p.im_r * p.w), imT = Math.round(p.im_t * p.h), imB = Math.round(p.im_b * p.h), txL = Math.round(p.tx_l * p.w), txR = Math.round(p.tx_r * p.w), txT = Math.round(p.tx_t * p.h), txB = Math.round(p.tx_b * p.h);
            let sv = false;
            if (p.h > txB + txT + ppt.textT + ppt.textB + 10 && p.w > txR + txL + ppt.textL + ppt.textR + 10) {obj.txL = p.tx_l; obj.txR = p.tx_r; obj.txT = p.tx_t; obj.txB = p.tx_b; sv = true;}
            if (p.h > imB + imT + p.bor_t + p.bor_b + 10 && p.w > imR + imL + p.bor_l + p.bor_r + 10) {obj.imL = p.im_l; obj.imR = p.im_r; obj.imT = p.im_t; obj.imB = p.im_b; sv = true;}
            if (sv) {ppt.style == 4 ? ppt.overlay = JSON.stringify(p.overlay) : ppt.styles = JSON.stringify(p.styles);}
            else {p.im_l = s.clamp(obj.imL, 0, 1); p.im_r = s.clamp(obj.imR, 0, 1); p.im_t = s.clamp(obj.imT, 0, 1); p.im_b = s.clamp(obj.imB, 0, 1); p.tx_l = s.clamp(obj.txL, 0, 1); p.tx_r = s.clamp(obj.txR, 0, 1); p.tx_t = s.clamp(obj.txT, 0, 1); p.tx_b = s.clamp(obj.txB, 0, 1);}
        } t.toggle(13);
    }

    const setCursor = n => {
        let c = 0; switch (n) {
            case "all": c = 32646; break;
            case "left": case "right": c = 32644; break;
            case "ne": case "sw": c = 32643; break;
            case "nw": case "se": c = 32642; break;
            case "top": case "bottom": c = 32645; break;
        }
        if (c) window.SetCursor(c);
    }

    this.move = (x, y) => {
        if (ppt.style < 4 || !utils.IsKeyPressed(0x11) || utils.IsKeyPressed(0x12) || !this.focus) return;
        if (!this.down) {
            st = y > p.tBoxT - 5 && y < p.tBoxT + 5 && x > p.tBoxL + 10 && x < p.tBoxL + p.tBoxW - 10 ? "top" :
            y > p.tBoxT - 5 && y < p.tBoxT + 15 && x > p.tBoxL && x < p.tBoxL + 10 ? "nw" :
            y > p.tBoxT - 5 && y < p.tBoxT + 15 && x > p.tBoxL + p.tBoxW - 10 && x < p.tBoxL + p.tBoxW ? "ne" :
            y > p.tBoxT + p.tBoxH - 5 && y < p.tBoxT + p.tBoxH + 5 && x > p.tBoxL + 10 && x < p.tBoxL + p.tBoxW - 10 ? "bottom" :
            y > p.tBoxT + p.tBoxH - 15 && y < p.tBoxT + p.tBoxH + 5 && x > p.tBoxL && x < p.tBoxL + 10 ? "sw" :
            y > p.tBoxT + p.tBoxH - 15 && y < p.tBoxT + p.tBoxH + 5 && x > p.tBoxL + p.tBoxW - 10 && x < p.tBoxL + p.tBoxW ? "se" :
            y > p.tBoxT + 10 && y < p.tBoxT + p.tBoxH && x > p.tBoxL - 5 && x < p.tBoxL + 5 ? "left" :
            y > p.tBoxT + 10 && y < p.tBoxT + p.tBoxH && x > p.tBoxL + p.tBoxW - 5 && x < p.tBoxL + p.tBoxW + 5 ? "right" :
            y > p.tBoxT + 20 && y < p.tBoxT + p.tBoxH - 20 && x > p.tBoxL + 20 && x < p.tBoxL + p.tBoxW - 20 ? "all": "";
            setCursor(st);
        } if (!this.down) return; let txT = Math.round(p.tx_t * p.h), txB = Math.round(p.tx_b * p.h), txL = Math.round(p.tx_l * p.w), txR = Math.round(p.tx_r * p.w);
        switch (st){
            case "top": if (y > p.h - txB - p.minH) break; p.tx_t = s.clamp(y / p.h, 0, 1); break;
            case "nw": if (y < p.h - txB - p.minH) p.tx_t = s.clamp(y / p.h, 0, 1); if (x > p.w - txR - 30) break; p.tx_l = s.clamp(x / p.w, 0, 1); break;
            case "ne": if (y < p.h - txB - p.minH) p.tx_t = s.clamp(y / p.h, 0, 1); if (x < txL + 30) break; p.tx_r = s.clamp((p.w - x) / p.w, 0, 1); break;
            case "left": if (x > p.w - txR - 30) break; p.tx_l = s.clamp(x / p.w, 0, 1); break;
            case "bottom": if (y < txT + p.minH) break; p.tx_b = s.clamp((p.h - y) / p.h, 0, 1); break;
            case "sw": if (x < p.w - txR - 30) p.tx_l = s.clamp(x / p.w, 0, 1); if (y < txT + p.minH) break; p.tx_b = s.clamp((p.h - y) / p.h, 0, 1); break;
            case "se": if (y > txT + p.minH) p.tx_b = s.clamp((p.h - y) / p.h, 0, 1); if (x < txL + 30) break; p.tx_r = s.clamp((p.w - x) / p.w, 0, 1); break;
            case "right": if (x < txL + 30) break; p.tx_r = s.clamp((p.w - x) / p.w, 0, 1); break;
            case "all": if ((txT >= p.h - p.tBoxH && y - init_y > 0) || (txL >= p.w - p.tBoxW && x - init_x > 0)) break; txT += (y - init_y); p.tx_t = s.clamp(txT / p.h, 0, 1); txL += (x - init_x); p.tx_l = s.clamp(txL / p.w, 0, 1); txB = p.h - Math.max(txT, 0) - p.tBoxH; p.tx_b = s.clamp(txB / p.h, 0, 1); txR = p.w - Math.max(txL, 0) - p.tBoxW; p.tx_r = s.clamp(txR / p.w, 0, 1); break;
        } sizes(true); init_x = x; init_y = y;
    }

    this.img_move = (x, y) => {
        if (!this.focus) return;
        switch (true) {
            case ppt.style > 3:
                if (!utils.IsKeyPressed(0x11) || utils.IsKeyPressed(0x10)) break;
                if (!this.down) {
                    si = y > p.iBoxT - 5 && y < p.iBoxT + 5 && x > p.iBoxL + 10 && x < p.iBoxL + p.iBoxW - 10 ? "top" :
                    y > p.iBoxT - 5 && y < p.iBoxT + 15 && x > p.iBoxL && x < p.iBoxL + 10 ? "nw" :
                    y > p.iBoxT - 5 && y < p.iBoxT + 15 && x > p.iBoxL + p.iBoxW - 10 && x < p.iBoxL + p.iBoxW ? "ne" :
                    y > p.iBoxT + p.iBoxH - 5 && y < p.iBoxT + p.iBoxH + 5 && x > p.iBoxL + 10 && x < p.iBoxL + p.iBoxW - 5 ? "bottom" :
                    y > p.iBoxT + p.iBoxH - 15 && y < p.iBoxT + p.iBoxH + 5 && x > p.iBoxL && x < p.iBoxL + 10 ? "sw" :
                    y > p.iBoxT + p.iBoxH - 15 && y < p.iBoxT + p.iBoxH + 5 && x > p.iBoxL + p.iBoxW - 10 && x < p.iBoxL + p.iBoxW ? "se" :
                    y > p.iBoxT && y < p.iBoxT + p.iBoxH && x > p.iBoxL - 5 && x < p.iBoxL + 5 ? "left" :
                    y > p.iBoxT && y < p.iBoxT + p.iBoxH && x > p.iBoxL + p.iBoxW - 5 && x < p.iBoxL + p.iBoxW + 5 ? "right" :
                    y > p.iBoxT + 20 && y < p.iBoxT + p.iBoxH - 20 && x > p.iBoxL + 20 && x < p.iBoxL + p.iBoxW - 20 ? "all": "";
                    setCursor(si);
                } if (!this.down) return;
                let imT = Math.round(p.im_t * p.h), imB = Math.round(p.im_b * p.h), imL = Math.round(p.im_l * p.w), imR = Math.round(p.im_r * p.w);
                switch (si){
                    case "top": if (y > p.h - imB - 30) break; p.im_t = s.clamp(y / p.h, 0, 1); break;
                    case "nw": if (y < p.h - imB - 30) p.im_t = s.clamp(y / p.h, 0, 1); if (x > p.w - imR - 30) break; p.im_l = s.clamp(x / p.w, 0, 1); break;
                    case "ne": if (y < p.h - imB - 30) p.im_t = s.clamp(y / p.h, 0, 1); if (x < imL + 30) break; p.im_r = s.clamp((p.w - x) / p.w, 0, 1); break;
                    case "left": if (x > p.w - imR - 30) break; p.im_l = s.clamp(x / p.w, 0, 1); break;
                    case "bottom": if (y < imT + 30) break; p.im_b = s.clamp((p.h - y) / p.h, 0, 1); break;
                    case "sw": if (x < p.w - imR - 30) p.im_l = s.clamp(x / p.w, 0, 1); if (y < imT + 30) break; p.im_b = s.clamp((p.h - y) / p.h, 0, 1); break;
                    case "se":if (y > imT + 30) p.im_b = s.clamp((p.h - y) / p.h, 0, 1); if (x < imL + 30) break; p.im_r = s.clamp((p.w - x) / p.w, 0, 1); break;
                    case "right": if (x < imL + 30) break; p.im_r = s.clamp((p.w - x) / p.w, 0, 1); break;
                    case "all": if ((imT >= p.h - p.iBoxH && y - y_init > 0) || (imL >= p.w - p.iBoxW && x - x_init > 0)) break; imT += (y - y_init); p.im_t = s.clamp(imT / p.h, 0, 1); imB = p.h - Math.max(imT, 0) - p.iBoxH; p.im_b = s.clamp(imB / p.h, 0, 1); imL += (x - x_init); p.im_l = s.clamp(imL / p.w, 0, 1); imR = p.w - Math.max(imL, 0) - p.iBoxW; p.im_r = s.clamp(imR / p.w, 0, 1); break;
                } sizes(true);
                break;
            case ppt.style < 4:
                if (!utils.IsKeyPressed(0x11)) break;
                if (!this.down) {switch (ppt.style) {case 0: si = y > p.img_t + p.imgs && y < p.img_t + p.imgs + 5; if (si) window.SetCursor(32645); break; case 1: si = x > p.img_l - 5 && x < p.img_l; if (si) window.SetCursor(32644); break; case 2: si = y > p.img_t - 5 && y < p.img_t; if (si) window.SetCursor(32645); break; case 3: si = x > p.img_l + p.imgs && x < p.img_l + p.imgs + 5; if (si) window.SetCursor(32644); break;}}
                if (!this.down || !si) return;
                switch (ppt.style) {case 0: ppt.rel_imgs = (ppt.rel_imgs * p.h + y - y_init) / p.h; break; case 1: ppt.rel_imgs = (ppt.rel_imgs * p.w + x_init - x) / p.w; break; case 2: ppt.rel_imgs = (ppt.rel_imgs * p.h + y_init - y) / p.h; break; case 3: ppt.rel_imgs = (ppt.rel_imgs * p.w + x - x_init) / p.w; break;}
                ppt.rel_imgs = s.clamp(ppt.rel_imgs, 0.1, 0.9); sizes();
                break;
        } x_init = x; y_init = y;
    }

    this.drawEd = gr => {
        if (utils.IsKeyPressed(0x11) && this.focus && p.m_y != -1 || p.newStyle) {
            const ed = gr.MeasureString(editText(), font_e, 15, 15, p.w - 15, p.h - 15, lc);
            gr.FillSolidRect(10, 10, ed.Width + 10, ed.Height + 10, ui.col.edBg);
            if (!ppt.text_only && !ppt.img_only) {
                if (ppt.style > 3) {if (!utils.IsKeyPressed(0x10)) gr.DrawRect(p.iBoxL + 2, p.iBoxT + 2, p.iBoxW - 4, p.iBoxH - 4, 5, RGB(0, 255, 0)); if (!utils.IsKeyPressed(0x12)) gr.DrawRect(p.tBoxL + 2, p.tBoxT + 2, p.tBoxW - 4, p.tBoxH - 4, 5, RGB(255, 0, 0));}
                else if (ppt.style < 4) {switch (ppt.style) {case 0: gr.FillSolidRect(0, p.img_t + p.imgs, p.w, 5, RGB(255, 128, 0)); break; case 1: gr.FillSolidRect(p.img_l - 5, 0, 5, p.h, RGB(255, 128, 0)); break; case 2: gr.FillSolidRect(0, p.img_t - 5, p.w, 5, RGB(255, 128, 0)); break; case 3: gr.FillSolidRect(p.img_l + p.imgs, 0, 5, p.h, RGB(255, 128, 0)); break;}}
            } gr.SetTextRenderingHint(5); gr.DrawString(editText(), font_e, ui.col.shadow, 16, 16, ed.Width, ed.Height, lc); gr.DrawString(editText(), font_e, ui.col.text_h, 15, 15, ed.Width, ed.Height, lc);
        }
    }
}

function Library() {
    let db_lib, i = 0, items, q = "", ql; this.update = true; this.get_lib_items = () => {if (!this.update) return db_lib; this.update = false; db_lib = fb.GetLibraryItems(); return db_lib;}
    this.in_library = (type, a, l) => {
        switch (type) {
            case 1:
                q = ""; ql = "";
                p.albartFields.forEach((v, i) => q += (i ? " OR " : "") + v + " IS " + a);
                p.albFields.forEach((v, i) => ql += (i ? " OR " : "") + v + " IS " + l);
                items = s.query(this.get_lib_items(), "(" + q + ") AND (" + ql + ")"); if (!items.Count) return false; return items.Count;
            case 2:
				q = "(" + "\"" + p.def_tf[0].tf + "\"" + " IS " + a + ") AND ((" + "\"" + p.def_tf[2].tf + "\"" + " IS " + l + ") OR (" + "\"" + "$trim($replace($replace(" + p.def_tf[2].tf + ",CD1,,CD2,,CD3,,CD 1,,CD 2,,CD 3,,CD.01,,CD.02,,CD.03,,CD One,,CD Two,,CD Three,,Disc1,,Disc2,,Disc3,,Disc 1,,Disc 2,,Disc 3,,Disc One,,Disc Two,,Disc Three,,Disc I,,Disc II,,Disc III,,'()',,'[]',),  , ,'()',,'[]',))" + "\"" + " IS " + l + "))";
                items = s.query(this.get_lib_items(), q); if (!items.Count) return false; return items[0];
            default: q = "";
                p.artFields.forEach((v, i) => q += (i ? " OR " : "") + v + " IS " + a);
                items = s.query(this.get_lib_items(), q); if (!items.Count) return false; return !type ? true : items[0]; break;
        }
}}

function Images() {
    this.albFolder = ""; this.blkArtist = ""; this.cycCov = ppt.loadCovAllFb || ppt.loadCovFolder; this.covTimestamp = Date.now(); this.crop = false; this.delay = Math.min(ppt.cycTimePic, 7) * 1000; this.displayed_other_panel = null; this.down = false; this.get = true; this.photoTimestamp = Date.now(); this.resetFade = false; this.adjustMode = false; this.touch = {dn: false, end: 0, start: 0}; this.undo = [];
	this.imgBar = ppt.imgBar;
	this.bar = {
		debounce: s.debounce(() => {if (this.imgBar == 2 || p.m_x > this.bar.x1 && p.m_x < this.bar.x1 + this.bar.w1 && p.m_y > this.bar.y1 + this.bar.y4 && p.m_y < this.bar.y1 + this.bar.y5) return; this.bar.show = false; paint();}, 3000),
		dn: false, disabled: false, dot_w: 4, grip_h: 10 * s.scale, gripOffset: 2, hand: false, imgNo: 0, l: 0, progMin: 0, progMax: 200, overlap: false, overlapCorr: 0, show: this.imgBar == 2 ? true : false, verticalCorr: 1.1565, x1: 25, x2: 26, x3: 25, x4: 29, y1: 25, y2: 200, y3: 201, y4: 200, y5: 200, w1: 100, w2: 110, h: 6 * s.scale
	}
    const aPth = fb.ProfilePath + "yttm\\artist_stub_user", art_img = {}, artImgFolder = p.albCovFolder.toUpperCase() == p.pth.imgArt.toUpperCase(), cov_img = {}, cPth = fb.ProfilePath + "yttm\\front_cover_stub_user", exclArr = [6467, 6473, 6500, 24104, 24121, 34738, 35875, 37235, 47700, 68626, 86884, 92172], ext = [".jpg", ".png", ".gif", ".bmp", ".jpeg"], blacklist_img = fb.ProfilePath + "yttm\\" + "blacklist_image.json", noimg = [], reflSetup = ppt.reflSetup.splt(0), reflSlope = s.clamp(s.value(reflSetup[5], 10, 0) / 10 - 1, -1, 9), reflSz = s.clamp(s.value(reflSetup[3], 100, 0) / 100, 0.1, 1), transLevel = s.clamp(100 - ppt.transLevel, 0.1, 100), transIncr = Math.pow(284.2171 / transLevel, 0.0625), userArtStubFile = fb.ProfilePath + "yttm\\artist_stub_user.png", userCovStubFile = fb.ProfilePath + "yttm\\front_cover_stub_user.png";
    const id = {albCounter: "", albCounter_o: "", albCyc: "", albCyc_o: "", album: "", album_o: "", artCounter: "", artCounter_o: "", blur: "", blur_o: "", img: "", img_o: "", w1: 0, w2: 0}
    let a_run = true, all_files_o_length = 0, alpha = 255, ap = "", artImages = [], artist = "", artist_o = "", blkArtist = "", blacklist = [], bor_w1 = 0, bor_w2 = 0, border = 0, chk_arr = [], circular = false, counter = 0, covCycle_ix = 1, covers = [{id: 0, pth: ""}], covImages = [], cp = "", cur_blur = null, cur_handle = null, cur_img = null, cur_imgPth = "", f_blur = null, fade_mask = null, fe_done = "", folder = "", folderSup = "", g_mask = null, i_x = 0, ix = 0, imgb = 0, imgx = 0, imgy = 0, imgw = 100, imgh = 100, init = true, new_BlurAlb = false, nh = 10, nhh = 10, nw = 10, refl_mask = null, reflAlpha = s.clamp(255 * s.value(reflSetup[1], 14.5, 0) / 100, 0, 255), reflection = false, s1 = 1, s2 = 1, sc = 1, sh_img = null, tw = 0, th = 0, userArtStub = null, userCovStub = null, validate = [], x_l = 0, x_r = 0, xa = 0, y_b = 0, y_t = 0, ya = 0;

    if (transLevel == 100) transLevel = 255;
    ext.some(v => {ap = aPth + v; if (s.file(ap)) {userArtStub = gdi.Image(ap); return true;}});
    ext.some(v => {cp = cPth + v; if (s.file(cp)) {userCovStub = gdi.Image(cp); return true;}});

	const blackListed = v => {blkArtist = this.blkArtist; this.blkArtist = artist || name.artist(ppt.focus); if (this.blkArtist && this.blkArtist != blkArtist) {blacklist = this.blacklist(this.blkArtist.clean().toLowerCase());} return blacklist.includes(v.slice(v.lastIndexOf("_") + 1));}
    const blurCheck = () => {if (!(ppt.covBlur && ui.blur) && !ppt.imgSmoothTrans) return; id.blur_o = id.blur; id.blur = name.albID(ppt.focus, 'stnd'); id.blur += ppt.covType; if (id.blur != id.blur_o) {new_BlurAlb = true; t.mulAlbum = false;}}
	const changeCov = incr => {covCycle_ix += incr; if (covCycle_ix < 1) covCycle_ix = covers.length - 1; else if (covCycle_ix >= covers.length) covCycle_ix = 1; i_x = covCycle_ix; if (cov.cacheHit(i_x, covers[i_x].pth)) return; cov_img.i_x = i_x; cov_img.id = gdi.LoadImageAsync(window.ID, covers[i_x].pth);}
    const changePhoto = incr => {ix += incr; if (ix < 0) ix = artImages.length - 1; else if (ix >= artImages.length) ix = 0; let i = 0; while (this.displayed_other_panel == artImages[ix] && i < artImages.length) {ix += incr; if (ix < 0) ix = artImages.length - 1; else if (ix >= artImages.length) ix = 0; i++;} this.set_chk_arr(artImages[ix]); loadArtImage();}
    const clear = (a, type) => {a.forEach((v, i) => {if (!v) return; if (type == 0 && i == 0 || type == 1 && i) {if (v.img) v.img = null; v.time = 0; if (v.blur) v.blur = null;}});}
	const clear_cov_cache = () => cov.cache = [];
    const defStub = () => {if (s.handle(ppt.focus)) {const n = ppt.artistView ? 1 : 0; return noimg[n].Clone(0, 0, noimg[n].Width, noimg[n].Height);} else {return noimg[2].Clone(0, 0, noimg[2].Width, noimg[2].Height);}}
    const getImgFallback = () => {if (t.scrollbar_type().draw_timer) return; if (!p.multi_new()) {paint(); this.get = false; return;} this.get_images(); this.get = false;}
    const incl_lge = 0; // incl_lge 0 & 1 - exclude & include artist images > 8 MB
    const images = v => {if (!s.file(v)) return false; const fileSize = utils.FileTest(v, "s"); return (incl_lge || fileSize <= 8388608) && ((/_([a-z0-9]){32}\.jpg$/).test(s.fs.GetFileName(v)) || (/(?:jpe?g|gif|png|bmp)$/i).test(s.fs.GetExtensionName(v)) && !(/ - /).test(s.fs.GetBaseName(v))) && !exclArr.includes(fileSize) && !blackListed(v);}
	const cycImages = artImgFolder ? images : v => {if (!s.file(v)) return false; const fileSize = utils.FileTest(v, "s"); return (incl_lge || fileSize <= 8388608) && (/(?:jpe?g|gif|png|bmp)$/i).test(s.fs.GetExtensionName(v));}
	const imgBorder = () => {switch (ppt.artistView) {case true: return !ppt.img_only ? ppt.artBorderDual : ppt.artBorderImgOnly; case false: return !ppt.img_only ? ppt.covBorderDual : ppt.covBorderImgOnly;}}
	const imgCircular = () => ppt.artistView && (ppt.artCircImgOnly && ppt.img_only || ppt.artCircDual && !ppt.img_only) || !ppt.artistView && (ppt.covCircImgOnly && ppt.img_only || ppt.covCircDual && !ppt.img_only);
	const intersectRect = () => !(p.tBoxL > p.iBoxL + p.iBoxW || p.tBoxL + p.tBoxW < p.iBoxL || p.tBoxT > p.iBoxT + p.iBoxH || p.tBoxT + p.tBoxH < p.iBoxT);
    const memoryLimit = () => window.PanelMemoryUsage / window.MemoryLimit > 0.4 || window.TotalMemoryUsage / window.MemoryLimit > 0.5;
	const paint = () => {if (!ppt.imgSmoothTrans) {alpha = 255; t.paint(); return;} id.img_o = id.img; id.img = cur_imgPth; if (id.img_o != id.img) alpha = transLevel; else alpha = 255; timer.clear(timer.transition); timer.transition.id = setInterval(() => {alpha = Math.min(alpha *= transIncr, 255); t.paint(); if (alpha == 255) timer.clear(timer.transition);}, 12);}
	const resetCounters = () => {if (p.lock) return; id.albCounter_o = id.albCounter; id.albCounter = name.albID(ppt.focus, 'full'); if (id.albCounter != id.albCounter_o || !id.albCounter) {counter = 0; men.revCounter = 0;} id.artCounter_o = id.artCounter; id.artCounter = name.artist(ppt.focus); if (id.artCounter && id.artCounter != id.artCounter_o || !id.artCounter) {counter = 0; men.bioCounter = 0;}}
	const setCov = s.debounce(() => {if (i_x < 1) i_x = covers.length - 1; else if (i_x >= covers.length) i_x = 1; covCycle_ix = i_x; if (cov.cacheHit(i_x, covers[i_x].pth)) return; cov_img.i_x = i_x; cov_img.id = gdi.LoadImageAsync(window.ID, covers[i_x].pth); this.covTimestamp = Date.now();}, 100);	
	const setPhoto = s.debounce(() => {if (ix < 0) ix = artImages.length - 1; else if (ix >= artImages.length) ix = 0; loadArtImage(); this.photoTimestamp = Date.now();}, 100);
    const setReflStrength = n => {reflAlpha += n; reflAlpha = s.clamp(reflAlpha, 0, 255); ppt.reflSetup = "Strength," + Math.round(reflAlpha / 2.55) + ",Size," + reflSetup[3] + ",Gradient," + reflSetup[5]; refl_mask = false; this.adjustMode = true; if (ppt.artistView && ppt.cycPhoto) this.clear_a_rs_cache(); if (!p.art_ix && ppt.artistView || !p.alb_ix && !ppt.artistView) this.get_images(); else this.get_multi(p.art_ix, p.alb_ix);}
	const sort = (data, prop) => {data.sort((a, b) => a[prop] - b[prop]); return data;}
	const uniq = a => [...new Set(a)];
	const uniqPth = a => {const flags = []; let result = []; a.forEach(v => {const vpth = v.pth.toLowerCase(); if (flags[vpth]) return; result.push(v); flags[vpth] = true;}); return result;}

    this.artist_reset = force => {if (p.lock) return; blurCheck(); artist_o = artist; artist = name.artist(ppt.focus); const new_artist = artist && artist != artist_o || !artist || ppt.covBlur && ui.blur && id.blur != id.blur_o || force; if (new_artist) {folderSup = ""; folder = p.cleanPth(p.pth.imgArt, ppt.focus); this.clear_art_cache(); if (ppt.cycPhoto) a_run = true; if (!artImages.length) {all_files_o_length = 0; ix = 0;}}}
	this.blacklist = clean_artist => {let black_list = []; if (!s.file(blacklist_img)) return black_list; const list = s.jsonParse(blacklist_img, false, 'file'); return list.blacklist[clean_artist] || black_list;}
    this.chk_arr = info => {if (t.block()) return; if (artImages.length < 2 || !ppt.artistView || ppt.text_only || !ppt.cycPhoto) return; if (!validate.includes(info[0])) validate.push(info[0]); this.displayed_other_panel = info[1]; if (!id.w1) id.w1 = info[0]; id.w2 = (id.w1== info[0]) ? 0 : info[0]; if (artImages[ix] != info[2] && !id.w2) {chk_arr = [window.ID, artImages[ix], this.displayed_other_panel]; window.NotifyOthers("chk_arr_bio", chk_arr);} if (window.ID > info[0]) return; if (artImages[ix] == this.displayed_other_panel && validate.length < 2) changePhoto(1);}
	this.chkArtImg = () => {id.albCyc = ""; id.albCyc_o = ""; this.clear_art_cache(); clear_cov_cache(); if (!p.art_ix && ppt.artistView || !p.alb_ix && !ppt.artistView) {a_run = true; if (!artImages.length) {all_files_o_length = 0; ix = 0;} if (ppt.artistView && ppt.cycPhoto) this.getArtImg(); else this.getFbImg();} else this.get_multi(p.art_ix, p.alb_ix, true);}
    this.clear_a_rs_cache = () => {art.cache = []; clear(cov.cache, 0);}
	this.clear_c_rs_cache = () => clear(cov.cache, 1);
    this.clear_art_cache = () => {artImages = []; validate = []; this.clear_a_rs_cache();}
    this.clear_rs_cache = () => {this.clear_c_rs_cache(); this.clear_a_rs_cache();}
	this.create_images = () => {const cc = StringFormat(1, 1), font1 = gdi.Font("Segoe UI", 230, 1), font2 = gdi.Font("Segoe UI", 120, 1), font3 = gdi.Font("Segoe UI", 200, 1), font4 = gdi.Font("Segoe UI", 90, 1), tcol = !ppt.blurDark && !ppt.blurLight || (ppt.imgBorder != 1 && ppt.imgBorder != 3) ? ui.col.text : ui.dui ? window.GetColourDUI(0) : window.GetColourCUI(0); for (let i = 0; i < 3; i++) {noimg[i] = s.gr(500, 500, true, g => {g.SetSmoothingMode(2); if (!ppt.blurDark && !ppt.blurLight || ppt.artBorderImgOnly == 1 || ppt.artBorderImgOnly == 3 || ppt.artBorderDual == 1 || ppt.artBorderDual == 3 || ppt.covBorderImgOnly == 1 || ppt.covBorderImgOnly == 3 || ppt.covBorderDual == 1 || ppt.covBorderDual == 3) {g.FillSolidRect(0, 0, 500, 500, tcol); g.FillGradRect(-1, 0, 505, 500, 90, ui.col.bg & 0xbbffffff, ui.col.bg, 1.0);} g.SetTextRenderingHint(3); g.DrawString("NO", i == 2 ? font3 : font1, tcol & 0x25ffffff, 0, 0, 500, 275, cc); g.DrawString(["COVER", "PHOTO", "SELECTION"][i], i == 2 ? font4 : font2, tcol & 0x20ffffff, 2.5, 175, 500, 275, cc); g.FillSolidRect(60, 400, 380, 20, tcol & 0x15ffffff);}); g_mask = s.gr(500, 500, true, g => {g.FillSolidRect(0, 0, 500, 500, RGB(255, 255, 255)); g.SetSmoothingMode(2); g.FillEllipse(1, 1, 498, 498, RGBA(0, 0, 0, 255));});} this.get = true;}; this.create_images();
    this.fresh = () => {
		counter++; if (counter < ppt.cycTimePic) return; counter = 0;
		if (t.block() || !ppt.cycPic || ppt.text_only || this.bar.dn || p.zoom()) return;
		if (ppt.artistView) {
			if (artImages.length < 2 || Date.now() - this.photoTimestamp < this.delay || !ppt.cycPhoto) return; changePhoto(1);
		} else if (this.cycCov) {
			if (covers.length < 2 || Date.now() - this.covTimestamp < this.delay || p.alb_ix) return; changeCov(1);
		}
	}
    this.get_images = force => {if (ppt.text_only && !ui.blur) return; if (ppt.artistView && ppt.cycPhoto) {if (!p.art_ix) this.artist_reset(force); this.getArtImg();} else this.getFbImg();}
    this.getArtImg = update => {if (!ppt.artistView || ppt.text_only && !ui.blur) return; if (a_run || update) {a_run = false; if (artist) getArtImages();} this.set_chk_arr(ppt.cycPhoto ? artImages[ix] : null); loadArtImage();}
	this.grab = force => {if (t.block()) return this.get = true; this.getArtImg(true); if (force) this.getFbImg();}
    this.leave = () => {if (this.touch.dn) {this.touch.dn = false; this.touch.start = 0;}}
	this.on_playback_new_track = force => {resetCounters(); if (!p.multi_new() && !force) return; if (t.block()) {this.get = true; this.artist_reset();} else {if (ppt.artistView && ppt.cycPhoto) {this.artist_reset(); this.getArtImg();} else this.getFbImg(); this.get = false;}}
    this.on_size = () => {if (ppt.text_only) {this.clear_c_rs_cache(); this.getFbImg();} if (ppt.text_only && !ui.blur) return init = false; this.clear_a_rs_cache(); this.clear_c_rs_cache(); if (ppt.artistView) {if (init) this.artist_reset(); this.getArtImg();} else this.getFbImg(); init = false; if (ppt.img_only) p.get_multi(true); but.refresh(true);}
	this.pth = () => ({imgPth: ppt.text_only || !s.file(cur_imgPth) ? "" : cur_imgPth, artist: artist || name.artist(ppt.focus), blk: (/_([a-z0-9]){32}\.jpg$/).test(s.fs.GetFileName(cur_imgPth))});
	this.reflection = () => ppt.artistView && (ppt.artReflImgOnly && ppt.img_only || ppt.artReflDual && !ppt.img_only) || !ppt.artistView && (ppt.covReflImgOnly && ppt.img_only || ppt.covReflDual && !ppt.img_only);
    this.set_chk_arr = arr_ix => {chk_arr = [window.ID, arr_ix, this.displayed_other_panel]; window.NotifyOthers("chk_arr_bio", chk_arr);}
	this.set_id = () => {id.albCyc_o = id.albCyc; id.albCyc = name.albID(ppt.focus, 'full');}
    this.setCrop = sz => {const imgRefresh = ppt.img_only || !ppt.text_only && !t.text; this.crop = imgCircular() ? false : ppt.artistView && (ppt.artCropImgOnly && imgRefresh || ppt.artCropDual && !ppt.img_only) || !ppt.artistView && (ppt.covCropImgOnly && imgRefresh || ppt.covCropDual && !ppt.img_only); p.setBorder(imgRefresh && this.crop, imgBorder(), this.reflection()); if (sz) {p.sizes(); if (ppt.heading && !ppt.img_only) but.check();}}; if (ppt.img_only) this.setCrop(true);
    this.trace = (x, y) => {//if (!ppt.autoEnlarge) return true; 
	let arr = [], ex; if (ppt.artistView && ppt.cycPhoto && artImages.length) {arr = art.cache; ex = ix;} else {arr = cov.cache; ex = i_x;} if (ex >= arr.length || !arr[ex]) return false; return x > arr[ex].x && x < arr[ex].x + arr[ex].w && y > arr[ex].y && y < arr[ex].y + arr[ex].h;}
    this.wheel = step => {switch (utils.IsKeyPressed(0x10)) {case false: if (artImages.length > 1 && ppt.artistView && !ppt.text_only && ppt.cycPhoto) {changePhoto(-step); if (ppt.cycPic) this.photoTimestamp = Date.now();} if (this.cycCov && covers.length > 1 && !ppt.artistView && !ppt.text_only && !p.alb_ix) {changeCov(-step); if (this.cycCov) this.covTimestamp = Date.now();} break; case true: if (!p || (ppt.mul_item && but.btns["mt"] && but.btns["mt"].trace(p.m_x, p.m_y)) || p.text_trace || !this.reflection()) break; setReflStrength(-step * 5); break;}}

    this.chkPths = (pths, fn, type, extraPaths) => {
        let h = false;
        pths.some(v => {
            if (h) return true;
			const ph = !extraPaths ? v + fn : p.eval(v + fn, ppt.focus);
            ext.some(w => {
                const ep = ph + w;
                if (s.file(ep)) {
                    h = true;
                    switch (type) {
                        case 0:
                            if (cov.cacheHit(i_x, ep)) return true;
							cov_img.i_x = i_x; cov_img.id = gdi.LoadImageAsync(window.ID, ep); return true;
                        case 1: f_blur = gdi.Image(ep); return true;
                        case 2: return true;
                        case 3: h = ep; return true;
                    }
                }
            });
        });
        return h;
    }

    this.get_multi = (art_ix, alb_ix, force) => {
        switch (true) {
            case ppt.artistView:
                if (ppt.text_only && !ui.blur) return; artist_o = artist; const stndBio = !art_ix || art_ix + 1 > p.artists.length; artist = !stndBio ? p.artists[art_ix].name : !p.lock ? name.artist(ppt.focus) :  p.artists.length ? p.artists[0].name : artist; const new_artist = artist && artist != artist_o || !artist || force; if (new_artist) men.bioCounter = 0;
                if (ppt.cycPhoto) {if (new_artist) {counter = 0; folder = p.lock ? p.cleanPth(p.mul.imgArt, ppt.focus, 'mul', artist, "", 1) : stndBio ? p.cleanPth(p.pth.imgArt, ppt.focus) : p.cleanPth(p.mul.imgArt, ppt.focus, 'mul', artist, "", 1); folderSup = ""; if (!stndBio && p.sup.Cache && !s.folder(folder)) folderSup = p.cleanPth(p.sup.imgArt, ppt.focus, 'mul', artist, "", 1); this.clear_art_cache(); a_run = true; if (!artImages.length) all_files_o_length = 0; ix = 0;} this.getArtImg();}
                else this.getFbImg(); this.get = false; break;
            case !ppt.artistView:
                const stndAlb = !alb_ix || alb_ix + 1 > p.albums.length;
                if (stndAlb) resetCounters();
                else if (!p.lock) {
                    id.album_o = id.album;
                    id.album = (!p.art_ix ? artist : p.artists[0].name) + p.albums[alb_ix].name;
                    if (id.album != id.album_o || force) {counter = 0; men.revCounter = 0;}
                }
                t.mulAlbum = true; if (alb_ix) cov_img.id = -1; /*stop occ late async loading of covCyc img*/ this.getFbImg(); this.get = false; break;
        }
    }

    const getArtImages = () => {
        let all_files = folder ? utils.Glob(folder + "*") : [];
        if (!all_files.length && folderSup) all_files = utils.Glob(folderSup + "*");
        if (all_files.length == all_files_o_length) return; let newArr = false;
        if (!artImages.length) {newArr = true; art.cache = [];}
        all_files_o_length = all_files.length;
        const arr = all_files.filter(images); artImages = artImages.concat(arr);
        if (artImages.length > 1) artImages = uniq(artImages); if (newArr && artImages.length > 1) artImages = $.shuffle(artImages);
    }

    this.load_image_done = (id, image, image_path) => {
		switch (true) {
			case cov_img.id == id:
				if (!t.mulAlbum && !this.cycCov) clear_cov_cache();
				if (!image) {
					if (cov.cacheHit(cov_img.i_x, cp)) return; 
					if (userCovStub) {image = userCovStub; image_path = cp;} 
					else {image = defStub(); image_path = "stub";}
				}
				if (!image) return;
				cov.cacheIt(cov_img.i_x, image, image_path, 1);
				break;
			case art_img.id == id:
				if (!image) {artImages.splice(art_img.ix, 1); if (artImages.length > 1) changePhoto(1); return;}
				art.cacheIt(art_img.ix, image, image_path, 0);
				break;
		}
    }

    const loadArtImage = () => {
        if (artImages.length && ppt.cycPhoto) {
            if (art.cacheHit(ix, artImages[ix])) return; art_img.ix = ix; art_img.id = gdi.LoadImageAsync(window.ID, artImages[ix]);
        } else if (!init) this.getFbImg();
    }

    const getCovImages = () => {
		if (ppt.artistView || !this.cycCov || p.alb_ix) return false;
		if (!p.lock) this.set_id();
		const new_album = id.albCyc != id.albCyc_o || !id.albCyc;
		if (ppt.loadCovFolder && !p.lock) this.albFolder = p.cleanPth(p.albCovFolder, ppt.focus);
		if (new_album) {
			clear_cov_cache();
			covers = [];
			i_x = covCycle_ix = 1;
			if (ppt.loadCovFolder) {
					covImages = this.albFolder ? utils.Glob(this.albFolder + "*") : [];
					covImages = covImages.filter(cycImages);
					if (artImgFolder) covImages = $.shuffle(covImages);
				for (let i = 0; i < covImages.length; i++) {
	                covers[i + 10] = {}
                    covers[i + 10].id = i + 10;
                    covers[i + 10].pth = covImages[i];
				}
			covers = covers.filter(Boolean);
			covers.unshift({id: 0, pth: ""});
			}
			if (ppt.loadCovAllFb) {
			    const handle = s.handle(ppt.focus);
				if (handle) {cur_handle = handle; for (let i = 0; i < 5; i++) utils.GetAlbumArtAsync(window.ID, handle, i, false, false, true);}
			}
		}
		if (!new_album || !ppt.loadCovAllFb) {
			const ep = covers[i_x] ? covers[i_x].pth : "";
			if (!ep) return false;
            if (cov.cacheHit(i_x, ep)) return true;
			cov_img.i_x = i_x; 
			cov_img.id = gdi.LoadImageAsync(window.ID, ep);
		}
		return true;
	}

	const loadCycCov = (art_id, image_path) => { // stndAlb
        if (!this.cycCov) return false;
		if (blackListed(image_path)) image_path = "";
		if (ppt.loadCovAllFb) {
            if (covers.every(v => v.id !== art_id + 1)) {
                if (!art_id) {
                    let path = "";
                    if (p.extra) path = this.chkPths(p.extraPaths, "", 3, true);
                    if (image_path && !p.extra || !path) path = image_path;
                    if (!path) path = this.chkPths([p.getPth('cov', ppt.focus).pth, p.getPth('img', ppt.focus, name.alb_artist(ppt.focus), name.album(ppt.focus)).pth], "", 3);
                    if (path) {
                        let ln = covers.length;
				        covers[ln] = {};
				        covers[ln].id = art_id + 1;
                        covers[ln].pth = path;
                    }
                } else if (image_path) {
                    let ln = covers.length; covers[ln] = {};
                    covers[ln].id = art_id + 1;
                    covers[ln].pth = image_path;
                }
				covers = covers.filter(Boolean);
				covers.unshift({id: 0, pth: ""});
                sort(covers, 'id');
				covers = uniqPth(covers);
            }
		}
        if (!ppt.artistView && !p.alb_ix) {
			const ep = covers[i_x] ? covers[i_x].pth : "";
			if (!ep) return false;
			cov_img.i_x = i_x;
			cov_img.id = gdi.LoadImageAsync(window.ID, ep);
			return true;
		}
	}

    const loadAltCov = (handle, n) => {
        let a, l;
        switch (n) {
            case 0: // !stndAlb inLib !fbImg: chkCov save pths: if !found get_rev_img else load stub || metadb
                a = p.albums[p.alb_ix].artist; l = p.albums[p.alb_ix].album; const pth = p.getPth('img', ppt.focus, a, l, "", p.sup.Cache);
                if (this.chkPths(pth.pe, pth.fe, 0)) return;
                if (pth.fe != fe_done && p.rev_img) {const pth_cov = pth.pe[!p.sup.Cache ? 0 : 1], fn_cov = pth_cov + pth.fe; if (p.server) serv.get_rev_img(a, l, pth_cov, fn_cov, false); else window.NotifyOthers("get_rev_img_bio", [a, l, pth_cov, fn_cov]); fe_done = pth.fe;}
				cov_img.i_x = i_x; cov_img.id = gdi.LoadImageAsync(window.ID, ""); return;
            case 1: // stndAlb !fbImg: chkCov save pths: if !found chk/save stubCovUser
                a = name.alb_artist(ppt.focus); l = name.album(ppt.focus);
                if (this.chkPths([p.getPth('cov', ppt.focus).pth, p.getPth('img', ppt.focus, a, l).pth], "", 0)) return true;
                if (cov.cacheHit(i_x, cp)) return true;
                if (!userCovStub) {const stubCovUser = utils.GetAlbumArtV2(handle, 0); if (stubCovUser) stubCovUser.SaveAs(userCovStubFile); if (s.file(userCovStubFile)) {userCovStub = gdi.Image(userCovStubFile); cp = userCovStubFile;}}
                return false;
        }
    }

    const loadStndCov = (handle, art_id, image, image_path) => { // stndAlb load fbImg else stub
		if (blackListed(image_path)) {image = null; image_path = "";}
        if (!image && ppt.artistView) {
            if (cov.cacheHit(i_x, ap)) return;
            let cpp = "";
            if (!userArtStub) {
                const stubArtUser = utils.GetAlbumArtV2(handle, 4);
                if (stubArtUser) stubArtUser.SaveAs(userArtStubFile);
                if (s.file(userArtStubFile)) {userArtStub = gdi.Image(userArtStubFile); ap = userArtStubFile;}} if (userArtStub) {image = userArtStub; image_path = ap;} // chk/save/load stubArtUser
        }
		if (!t.mulAlbum) clear_cov_cache();
        if (!image) {
			if (cov.cacheHit(i_x, "stub" + art_id)) return;
			image = defStub(); image_path = "stub" + art_id;
		} if (!image) return;
        cov.cacheIt(i_x, image, image_path, 1);
    }

	this.get_album_art_done = (handle, art_id, image, image_path) => {
        if (image && cov.cacheHit(i_x, image_path) || !cur_handle.Compare(handle)) return;
		if (loadCycCov(art_id, image_path)) return;
        if (p.alb_ix && p.alb_ix < p.albums.length && !image && !ppt.artistView) return loadAltCov(handle, 0);
        if (!image && !ppt.artistView && !art_id && !p.alb_ix) {
			if (loadAltCov(handle, 1)) return; if (userCovStub) {image = userCovStub; image_path = cp;}
		}
        loadStndCov(handle, art_id, image, image_path);
    }

    this.getFbImg = () => {
		if (ppt.artistView && artImages.length && ppt.cycPhoto) return;
		i_x = ppt.artistView ? 0 : this.cycCov && !p.alb_ix ? covCycle_ix : p.alb_ix + 1;
        blurCheck(); if (getCovImages()) return;
        if (p.alb_ix && p.alb_ix < p.albums.length && !ppt.artistView) { // !stndAlb
            const a = p.albums[p.alb_ix].artist, l = p.albums[p.alb_ix].album, l_handle = lib.in_library(2, a, l);
			if (l_handle) {cur_handle = l_handle; utils.GetAlbumArtAsync(window.ID, l_handle, 0, false); return;} // check local
            else {
                const pth = p.getPth('img', ppt.focus, a, l, "", p.sup.Cache);
                if (this.chkPths(pth.pe, pth.fe, 0)) return;
                if (pth.fe != fe_done && p.rev_img) {const pth_cov = pth.pe[!p.sup.Cache ? 0 : 1], fn_cov = pth_cov + pth.fe; if (p.server) serv.get_rev_img(a, l, pth_cov, fn_cov, false); else window.NotifyOthers("get_rev_img_bio", [a, l, pth_cov, fn_cov]); fe_done = pth.fe;}
				cov_img.i_x = i_x; cov_img.id = gdi.LoadImageAsync(window.ID, ""); return;
            }
        }
        if (!p.alb_ix && p.extra && !ppt.artistView && !ppt.covType) {
            if (this.chkPths(p.extraPaths, "", 0, true)) return;
        }
        if (p.art_ix && p.art_ix < p.artists.length && ppt.artistView) { // !stndBio
            const a_handle = lib.in_library(3, artist);
			if (a_handle) {cur_handle = a_handle; utils.GetAlbumArtAsync(window.ID, a_handle, 4, false); return;}
            if (cov.cacheHit(i_x, ap)) return;
            let image = null, image_path = "";
            if (userArtStub) {image = userArtStub; image_path = ap;} else {image = defStub(); image_path = "stub"}
            if (!image) return; cov.cacheIt(i_x, image, image_path, 1); return;
        }
        // stndAlb
        const handle = s.handle(ppt.focus);
		if (handle) {cur_handle = handle; utils.GetAlbumArtAsync(window.ID, handle, ppt.artistView ? 4 : ppt.covType, !ppt.covType || ppt.artistView ? false: true); return;}
        if (fb.IsPlaying && handle) return; if (p.imgText) t.text = true; if (cov.cacheHit(i_x, "noitem")) return;
        let image = defStub(); if (!image) return; cov.cacheIt(i_x, image, "noitem", 1);
    }

	const bar_metrics = (horizontal, vertical) => {
		this.bar.disabled = ppt.style > 3 && !ppt.img_only && t.text && !p.clip && intersectRect(); 
		this.imgBar = !this.bar.disabled ? ppt.imgBar : 0;
		if (!this.imgBar) {this.bar.show = false; paint(); return;}
		this.bar.imgNo = ppt.artistView ? artImages.length : covers.length - 1;
		if (this.bar.imgNo < 2) return;
		this.bar.overlap = ppt.style > 3 && !ppt.img_only && t.text && p.clip;
		this.bar.overlapCorr = this.bar.overlap ? p.bor_t : 0;
		const alignBottom = vertical && !this.crop && ppt.alignV == 2 && !this.bar.overlap;
		const alignCenter = vertical && !this.crop && ppt.alignV == 1 && !this.bar.overlap;
		const alignLeft = horizontal && !this.crop && ppt.alignH == 0;
		const alignRight = horizontal && !this.crop && ppt.alignH == 2;
		this.bar.verticalCorr = circular ? ppt.imgBorder == 1 || ppt.imgBorder == 3 ? 1.25 : 1.2 : 1.1565;
		nhh = !t.text || ppt.img_only ? nh : ppt.style < 4 ? Math.min(!this.crop ? nw * (!alignBottom ? this.bar.verticalCorr : 1) : nh, nh) : this.bar.overlap ? p.imgs : Math.min(!this.crop ? (p.iBoxW - p.bor_l - p.bor_r) * (!alignBottom ? this.bar.verticalCorr : 1) : p.iBoxH - p.bor_t - p.bor_b, p.iBoxH - p.bor_t - p.bor_b);
		const bar_img_t = nw * (!alignBottom ? this.bar.verticalCorr : 1) < nh ? alignCenter ? (nh - nw) / 2 : alignBottom ? nh - nw : 0 : 0;
		this.bar.h = (ppt.imgBarDots == 1 ? 6 : 5) * s.scale;
		this.bar.grip_h = (ppt.imgBarDots == 1 ? 10 : 11) * s.scale;
		this.bar.gripOffset = Math.round((this.bar.grip_h - this.bar.h) / 2) + Math.ceil(ui.l_h / 2);
		this.bar.w1 = ppt.imgBarDots == 1 ? Math.min(this.bar.imgNo * 30 * s.scale, (!this.crop ? Math.min(nw, nhh) : nw) - 30 * s.scale) : Math.round((!this.crop ? Math.min(nw, nhh) : nw) * 2 / 3);
		this.bar.w2 = this.bar.w1 + Math.round(this.bar.grip_h);
		this.bar.l = !t.text ? p.bor_l : p.img_l;
		this.bar.x1 = alignLeft ? Math.round(this.bar.l + 15 * s.scale) : alignRight ? Math.round(p.w - (!t.text ? p.bor_r : p.img_r) - 15 * s.scale - this.bar.w1) : Math.round(this.bar.l + (nw - this.bar.w1) / 2);
		this.bar.x3 = this.bar.x1 - Math.round(this.bar.grip_h / 2);
		this.bar.y1 = !t.text ? p.bor_t + bar_img_t : p.img_t + bar_img_t;
		imgbar_metrics(nhh * 0.9);
		if (ppt.imgBarDots == 1) {
			this.bar.dot_w =  Math.floor(s.clamp(this.bar.w1 / this.bar.imgNo, 2, this.bar.h));
			this.bar.x2 = this.bar.x1 - Math.round(this.bar.dot_w / 2);
			this.bar.progMin = 0.5 / this.bar.imgNo * this.bar.w1 - (this.bar.grip_h - this.bar.dot_w) / 2;
			this.bar.progMax = ((this.bar.imgNo - 0.5) / this.bar.imgNo) * this.bar.w1 - (this.bar.grip_h - this.bar.dot_w) / 2;
		} else this.bar.x2 = this.bar.x1 + Math.ceil(ui.l_h / 2);	
	}
	const imgbar_metrics = (top_padding) => {
		this.bar.y2 = Math.round(this.bar.y1 + top_padding - this.bar.h / 2) - this.bar.overlapCorr;
		this.bar.y3 = this.bar.y2 + Math.ceil(ui.l_h / 2);
		this.bar.y4 = top_padding - this.bar.overlapCorr;
		this.bar.y5 = top_padding - this.bar.overlapCorr;	
	}
    const img_metrics = (image, n) => {
        if (!ppt.img_only && t.text && ppt.textAlign && ppt.style < 4) {if (ppt.style == 0 || ppt.style == 2) {p.img_l = p.text_l; p.img_r = p.text_r;} if (ppt.style == 1 || ppt.style == 3) {p.img_t = Math.round(p.text_t - ui.heading_h + ui.font_h / 4.1); p.img_b = Math.round(p.h - (p.text_t + p.lines_drawn * ui.font_h - ui.font_h / 12.5 - ppt.textPad));}}
        x_l = !t.text ? p.bor_l : p.img_l; x_r = !t.text ? p.bor_r : p.img_r; y_t = !t.text ? p.bor_t : p.img_t; y_b = !t.text ? p.bor_b : p.img_b;
        nw = !ppt.style || ppt.style == 2 || ppt.style > 3 && t.text ? p.w - p.img_l - p.img_r : !ppt.img_only && t.text ? p.imgs : p.w - x_l - x_r;
        nh = ppt.style == 1 || ppt.style == 3 || ppt.style > 3 && t.text && !ppt.alignAuto ? p.h - p.img_t - p.img_b : !ppt.img_only && t.text ? p.imgs : p.h - y_t - y_b;
		border = imgBorder();
        if (border == 1 || border == 3) {const i_sz = s.clamp(nh, 0, nw) / s.scale; bor_w1 = !i_sz || i_sz > 500 ? 5 * s.scale : Math.ceil(5 * s.scale * i_sz / 500);} else bor_w1 = 0; bor_w2 = bor_w1 * 2;
		nw = Math.max(nw - bor_w2, 10); nh = Math.max(nh - bor_w2, 10);
		circular = imgCircular();
		reflection = this.reflection();
		switch (true) {
			case circular:
				if (ppt.style > 3 && ppt.alignAuto && t.text && !ppt.img_only) nh = Math.max(p.h - p.img_t - p.img_b - bor_w2, 10);
				const szz = nh > nw ? nw : nh;
				s1 = image.Width / szz; s2 = image.Height / szz;
				if (s1 > s2) {imgw = Math.round(szz * s2); imgh = image.Height; imgx = Math.round((image.Width - imgw) / 2); imgy = 0; tw = Math.round(szz); th = Math.round(szz);} else {imgw = image.Width; imgh = Math.round(szz * s1); imgx = 0; imgy = Math.round((image.Height - imgh) / 8); tw = Math.round(szz); th = Math.round(szz);}
				break;
			case !this.crop:
				if (ppt.style < 4 || !ppt.alignAuto || !t.text || ppt.img_only) {sc = Math.min(nh / image.Height, nw / image.Width); tw = Math.round(image.Width * sc); th = Math.round(image.Height * sc);}
				else {
					s1 = image.Width / image.Height; s2 = nw / nh;
					if (s1 > s2) {sc = Math.min(nh / image.Height, nw / image.Width); tw = Math.round(image.Width * sc); th = Math.round(image.Height * sc); y_t = Math.round((nh - th) / 2 + y_t);}
					else {y_t = p.img_t; nh = Math.max(p.h - p.img_t - p.img_b - bor_w2, 10); sc = Math.min(nh / image.Height, nw / image.Width); tw = Math.round(image.Width * sc); th = Math.round(image.Height * sc);}
				}
				break;
			case this.crop:
				if (ppt.style > 3 && t.text) nh = Math.max(p.h - p.img_t - p.img_b - bor_w2, 10);
				s1 = image.Width / nw; s2 = image.Height / nh;
				if (n && Math.abs(s1 / s2 - 1) < 0.05) {imgx = 0; imgy = 0; imgw = image.Width; imgh = image.Height; tw = Math.round(nw); th = Math.round(nh);}
				else {if (s1 > s2) {imgw = Math.round(nw * s2); imgh = image.Height; imgx = Math.round((image.Width - imgw) / 2); imgy = 0; tw = Math.round(nw); th = Math.round(nh);} else {imgw = image.Width; imgh = Math.round(nh * s1); imgx = 0; imgy = Math.round((image.Height - imgh) / 8); tw = Math.round(nw); th = Math.round(nh);}}
				break;
		}
		const horizontal = (ppt.style == 0 || ppt.style == 2 || ppt.style > 3) && !ppt.img_only && t.text;
		const vertical = (ppt.style == 1 || ppt.style == 3 || ppt.style > 3 && !ppt.alignAuto) && !ppt.img_only && t.text;
		if (horizontal && ppt.alignH != 1) {if (ppt.alignH == 2) x_l = Math.round(p.w - p.img_r - tw - bor_w2);} else x_l = Math.round((nw - tw) / 2 + x_l);
		if (vertical && ppt.alignV != 1) {if (ppt.alignV == 2) y_t = Math.round(p.h - p.img_b - th - bor_w2);} else if (ppt.style < 4 || !ppt.alignAuto || !t.text || ppt.img_only) y_t = Math.round((nh - th) / 2 + y_t);
		bar_metrics(horizontal, vertical);
    }

    const blur_img = (image, im, x, y, w, h) => {
        if (!image || !im || !p.w || !p.h) return;
        if (ppt.covBlur && ui.blur && (ppt.artistView || this.cycCov || ppt.text_only || p.alb_ix) && new_BlurAlb) {
            let handle = null; f_blur = null;
            if (p.extra && !ppt.covType) {this.chkPths(p.extraPaths, "", 1, true);}
            if (!f_blur) {handle = s.handle(ppt.focus); if (handle) f_blur = utils.GetAlbumArtV2(handle, ppt.covType, !ppt.covType ? false: true);}
            if (!f_blur && !ppt.covType) {
                const pth_cov = p.getPth('cov', ppt.focus).pth;
                ext.some(v => {if (s.file(pth_cov + v)) {f_blur = gdi.Image(pth_cov + v); return true;}});
            }
            if (!f_blur && !ppt.covType) {
                const a = name.alb_artist(ppt.focus), l = name.album(ppt.focus), pth_cov = [p.getPth('cov', ppt.focus).pth, p.getPth('img', ppt.focus, a, l).pth];
                this.chkPths(pth_cov, "", 1);
            }
            if (!f_blur && !ppt.covType) if (handle) f_blur = utils.GetAlbumArtV2(handle, 0); if (!f_blur) f_blur = noimg[0].Clone(0, 0, noimg[0].Width, noimg[0].Height); new_BlurAlb = false; if (f_blur && !ppt.blurAutofill) f_blur = f_blur.Resize(p.w, p.h);
        }
        if (ppt.covBlur && ui.blur && (ppt.artistView || this.cycCov || ppt.text_only || p.alb_ix) && f_blur) image = f_blur;
        if (ppt.blurAutofill) {const s1 = image.Width / p.w, s2 = image.Height / p.h; let imgw, imgh, imgx, imgy; if (s1 > s2) {imgw = Math.round(p.w * s2); imgh = image.Height; imgx = Math.round((image.Width - imgw) / 2); imgy = 0;} else {imgw = image.Width; imgh = Math.round(p.h * s1); imgx = 0; imgy = Math.round((image.Height - imgh) / 8);} image = image.Clone(imgx, imgy, imgw, imgh);}
            const i = s.gr(p.w, p.h, true, (g, gi) => {
                g.SetInterpolationMode(0);
                if (ppt.blurBlend) {
                    const iSmall = image.Resize(p.w * ui.blurLevel / 100, p.h * ui.blurLevel / 100, 2), iFull = iSmall.Resize(p.w, p.h, 2), offset = 90 - ui.blurLevel;
                    g.DrawImage(iFull, 0 - offset, 0 - offset, p.w + offset * 2, p.h + offset * 2, 0, 0, iFull.Width, iFull.Height, 0, 63 * ui.blurAlpha);
                } else {
                    g.DrawImage(image, 0, 0, p.w, p.h, 0, 0, image.Width, image.Height); if (ui.blurLevel > 1) gi.StackBlur(ui.blurLevel);
					g.FillSolidRect(0, 0, p.w, p.h, darkImage(gi) ? ui.col.bg_light : ui.col.bg_dark);
                }
            });        
        return i;
    }
	
	const darkImage = image => {
		const colorSchemeArray = JSON.parse(image.GetColourSchemeJSON(15)); let rTot = 0, gTot = 0, bTot = 0, freqTot = 0;
		colorSchemeArray.forEach(v => {const col = s.toRGB(v.col); rTot += col[0] ** 2 * v.freq; gTot += col[1] ** 2 * v.freq; bTot += col[2] ** 2 * v.freq; freqTot += v.freq;});
		const avgCol = [s.clamp(Math.round(Math.sqrt(rTot / freqTot)), 0 , 255), s.clamp(Math.round(Math.sqrt(gTot / freqTot)), 0 , 255), s.clamp(Math.round(Math.sqrt(gTot / freqTot)), 0 , 255)];
		return ui.get_selcol(avgCol, true, true) == 50 ? true : false;
	}

    const fade_img = (image, x, y, w, h) => {
        const xl = Math.max(0, p.tBoxL - x); let f = Math.min(w, p.tBoxL - x + p.tBoxW); this.adjustMode = false; if (xl >= f) return image; const wl = f - xl, yl = Math.max(0, p.tBoxT - y); f = Math.min(h, p.tBoxT - y + p.tBoxH); if (yl >= f) return image; const hl = f - yl;
        if (!fade_mask || this.resetFade) {const km = ui.fadeSlope != -1 && p.img_t <= p.text_t - ui.heading_h ? ui.fadeAlpha / 500 + ui.fadeSlope / 10 : 0;  fade_mask = s.gr(500, 500, true, g => {for (let k = 0; k < 500; k++) {const c = 255 - s.clamp(ui.fadeAlpha - k * km, 0, 255); g.FillSolidRect(0, k, 500, 1, RGB(c, c, c));}}); this.resetFade = false;}
        const fade = image.Clone(0, 0, image.Width, image.Height), f_mask = fade_mask.Clone(0, 0, fade_mask.Width, fade_mask.Height);
        const fadeI = s.gr(w, h, true, g => g.DrawImage(f_mask, xl, yl, wl, hl, 0, 0, f_mask.Width, f_mask.Height));
        fade.ApplyMask(fadeI); return fade;
    }

    const refl_img = (image, i, x, y, w, h, cache) => {
        if (!refl_mask) {const km = reflSlope != -1 ? reflAlpha / 500 + reflSlope  / 10 : 0; refl_mask = s.gr(500, 500, true, g => {for (let k = 0; k < 500; k++) {const c = 255 - s.clamp(reflAlpha - k * km, 0, 255); g.FillSolidRect(0, k, 500, 1, RGB(c, c, c));}});} let r_mask, refl, reflImg, ref_sz, sw = 0;
        if (!ppt.imgReflType) {switch (ppt.style) {case 0: case 2: sw = ppt.alignH == 1 ? ppt.style : ppt.alignH == 0 ? 3 : 1; break; case 1: case 3: sw = ppt.alignV == 1 ? ppt.style : ppt.alignV == 0 ? 0 : 2; break; default: sw = ppt.alignH == 1 ? 0 : 3 - ppt.alignH; break;}} else sw = [2, 1, 0, 3][ppt.imgReflType - 1]; this.adjustMode = false;
        switch (sw) {
            case 0: ref_sz = Math.round(Math.min(p.h - y - h, image.Height * reflSz)); if (ref_sz <= 0) return image; refl = image.Clone(0, image.Height - ref_sz, image.Width, ref_sz); r_mask = refl_mask.Clone(0, 0, refl_mask.Width, refl_mask.Height); if (refl) {r_mask = r_mask.Resize(refl.Width, refl.Height); refl.RotateFlip(6); refl.ApplyMask(r_mask);} reflImg = s.gr(w, h + ref_sz, true, g => {g.DrawImage(image, 0, 0, w, h, 0, 0, w, h); g.DrawImage(refl, 0, h, w, h, 0, 0, w, h);}); cache[i].h = h + ref_sz; break;
            case 1: ref_sz = Math.round(Math.min(x, image.Width * reflSz)); if (ref_sz <= 0) return image; refl = image.Clone(0, 0, ref_sz, image.Height); r_mask = refl_mask.Clone(0, 0, refl_mask.Width, refl_mask.Height); r_mask.RotateFlip(1); if (refl) {r_mask = r_mask.Resize(refl.Width, refl.Height); refl.RotateFlip(4); refl.ApplyMask(r_mask);} reflImg = s.gr(ref_sz + w, h, true, g => {g.DrawImage(image, ref_sz, 0, w, h, 0, 0, w, h); g.DrawImage(refl, 0, 0, ref_sz, h, 0, 0, ref_sz, h);}); xa = x - ref_sz; cache[i].x = xa; cache[i].w = w + ref_sz; break;
            case 2: ref_sz = Math.round(Math.min(y, image.Height * reflSz)); if (ref_sz <= 0) return image; refl = image.Clone(0, 0, image.Width, ref_sz); r_mask = refl_mask.Clone(0, 0, refl_mask.Width, refl_mask.Height); r_mask.RotateFlip(2); if (refl) {r_mask = r_mask.Resize(refl.Width, refl.Height); refl.RotateFlip(6); refl.ApplyMask(r_mask);} reflImg = s.gr(w, ref_sz + h, true, g => {g.DrawImage(image, 0, ref_sz, w, h, 0, 0, w, h); g.DrawImage(refl, 0, 0, w, ref_sz, 0, 0, w, ref_sz);}); ya = y  - ref_sz; cache[i].y = ya; cache[i].h = ref_sz + h; break;
            case 3: ref_sz = Math.round(Math.min(p.w - x - w, image.Width * reflSz)); if (ref_sz <= 0) return image; refl = image.Clone(image.Width - ref_sz, 0, ref_sz, image.Height); r_mask = refl_mask.Clone(0, 0, refl_mask.Width, refl_mask.Height); r_mask.RotateFlip(3); if (refl) {r_mask = r_mask.Resize(refl.Width, refl.Height); refl.RotateFlip(4); refl.ApplyMask(r_mask);} reflImg = s.gr(w + ref_sz, h, true, g => {g.DrawImage(image, 0, 0, w, h, 0, 0, w, h); g.DrawImage(refl, w, 0, ref_sz, h, 0, 0, ref_sz, h);}); cache[i].w = w + ref_sz; break;
        } return reflImg;
    }

    const getBorder = (image, w, h, bor_w1, bor_w2) => {
        const imgo = 7, dpiCorr = (s.scale - 1) * imgo, imb = imgo - dpiCorr;
        if (border > 1 && !reflection) {imgb = 15 + dpiCorr; sh_img = s.gr(Math.floor(w + bor_w2 + imb), Math.floor(h + bor_w2 + imb), true, g => !circular ? g.FillSolidRect(imgo, imgo, w + bor_w2 - imgb, h + bor_w2 - imgb, RGB(0, 0, 0)) : g.FillEllipse(imgo, imgo, w + bor_w2 - imgb, h + bor_w2 - imgb, RGB(0, 0, 0))); sh_img.StackBlur(12);}
        let bor_img = s.gr(Math.floor(w + bor_w2 + imgb), Math.floor(h + bor_w2 + imgb), true, g => {
        if (border > 1 && !reflection) g.DrawImage(sh_img, 0, 0, Math.floor(w + bor_w2 + imgb), Math.floor(h + bor_w2 + imgb), 0, 0, sh_img.Width, sh_img.Height);
        if (border == 1 || border == 3) {
			if (!circular) g.FillSolidRect(0, 0, w + bor_w2, h + bor_w2, RGB(255, 255, 255));
			else {
				g.SetSmoothingMode(2);
				g.FillEllipse(0, 0, w + bor_w2, h + bor_w2, RGB(255, 255, 255));
			}
		}
        g.DrawImage(image, bor_w1, bor_w1, w, h, 0, 0, image.Width, image.Height);
        }); sh_img = null;
        return bor_img;
    }

	const circularMask = (image, tw, th) => {
		const g_img_mask = g_mask, mask = g_img_mask.Resize(tw, th);
		image.ApplyMask(mask);
	}

	const ImageCache = function () {
		this.cache = [];
		this.trimCache = function(n) { // keep slowest to resize
			let lowest = n;
			for (let i = n + 1; i < this.cache.length; i++) { // n = 1 keep fb fallback artist img
				const v1 = this.cache[i] && this.cache[i].time || Infinity, v2 = this.cache[lowest] && this.cache[lowest].time || Infinity;
				if (v1 < v2) lowest = i;
			}
			if (this.cache[lowest]) {this.cache[lowest].img = null; this.cache[lowest].time = null; if (this.cache[lowest].blur) this.cache[lowest].blur = null;}
		}

		this.cacheIt = (i, image, image_path, n) => {
			try {
				if (!image || ppt.cycPhoto && !ppt.sameStyle && n != p.covView && artImages.length) return paint();
				if (memoryLimit()) this.trimCache(n);
				const start = Date.now();
				img_metrics(image, n);
				let tx = x_l, ty = y_t; xa = tx; ya = ty;
				this.cache[i] = {};
				this.cache[i].x = tx; this.cache[i].y = ty; this.cache[i].w = tw; this.cache[i].h = th; this.cache[i].text = t.text; imgb = 0;
				switch (border) {
					case 0:
						this.cache[i].img = !img.crop && !circular ? image : image.Clone(imgx, imgy, imgw, imgh);
						this.cache[i].img = this.cache[i].img.Resize(tw, th, 2);
						if (circular) circularMask(this.cache[i].img, tw, th);
						if (!ppt.overlayStyle && ppt.style > 3 && t.text && !ppt.img_only) this.cache[i].img = fade_img(this.cache[i].img, tx, ty, tw, th);
						if (reflection) {this.cache[i].img = refl_img(this.cache[i].img, i, tx, ty, tw, th, this.cache); tx = this.cache[i].x; ty = this.cache[i].y;}
						if (ui.blur && this.cache[i].img && !(ppt.img_only && img.crop)) {
							this.cache[i].blur = blur_img(image, this.cache[i].img, tx, ty, this.cache[i].img.Width, this.cache[i].img.Height);
							cur_blur = this.cache[i].blur;
						}
						cur_img = this.cache[i].img;
						break;
					default:
						this.cache[i].img = image.Clone(0, 0, image.Width, image.Height);
						if (img.crop || circular) image = image.Clone(imgx, imgy, imgw, imgh);
						if (circular) circularMask(image, imgw, imgh);
						let bor_img = getBorder(image, tw, th, bor_w1, bor_w2);
						if (!ppt.overlayStyle && ppt.style > 3 && t.text && !ppt.img_only) bor_img = fade_img(bor_img, tx, ty, bor_img.Width, bor_img.Height);
						if (reflection) {bor_img = refl_img(bor_img, i, tx, ty, bor_img.Width, bor_img.Height, this.cache); tx = this.cache[i].x; ty = this.cache[i].y; }
						if (ui.blur && bor_img && !(ppt.img_only && img.crop && border < 2)) {
							this.cache[i].blur = blur_img(this.cache[i].img, bor_img, tx, ty, bor_img.Width, bor_img.Height);
							cur_blur = this.cache[i].blur;
						}
						this.cache[i].img = bor_img;
						cur_img = bor_img;
						break;
				}
				this.cache[i].pth = image_path;
				cur_imgPth = image_path;
				this.cache[i].time = Date.now() - start;
				paint();
			} catch (e) {paint(); s.trace("unable to load image: " + image_path);}
		}
		
		this.cacheHit = (i, imgPth) => {
			if (!this.cache[i] || !this.cache[i].img || this.cache[i].pth != imgPth || !ppt.img_only && this.cache[i].text != t.text || img.adjustMode) return false;
			xa = this.cache[i].x; ya = this.cache[i].y; if (ui.blur && this.cache[i].blur && !(ppt.img_only && img.crop)) cur_blur = this.cache[i].blur; cur_img = this.cache[i].img; cur_imgPth = imgPth;
			paint(); return true;
		}
	}
	const art = new ImageCache, cov = new ImageCache;

    this.draw = gr => {
        if (ppt.text_only && !ui.blur) return;
        if (ui.blur && cur_blur) gr.DrawImage(cur_blur, 0, 0, cur_blur.Width, cur_blur.Height, 0, 0, cur_blur.Width, cur_blur.Height);
		if (this.get) return getImgFallback();
        if (!ppt.text_only && cur_img) gr.DrawImage(cur_img, xa, ya, cur_img.Width, cur_img.Height, 0, 0, cur_img.Width, cur_img.Height, 0, alpha);

		if (!this.bar.show || this.bar.imgNo < 2) return;
		
		if (!ppt.text_only && cur_img) imgbar_metrics(ya+cur_img.Height-15);
		
		if (ppt.text_only || !(ppt.cycPhoto && ppt.artistView && artImages.length > 1) && !(this.cycCov && !ppt.artistView && covers.length > 2 && !p.alb_ix)) return;

		let prog = 0;
		switch (ppt.imgBarDots) {
			case 1:
				gr.SetSmoothingMode(2);
				prog = this.bar.dn ? s.clamp(p.m_x - this.bar.x2 - this.bar.grip_h / 2, this.bar.progMin, this.bar.progMax) : (ppt.artistView ? ix + 0.5 : i_x - 0.5) * this.bar.w1 / this.bar.imgNo - (this.bar.grip_h - this.bar.dot_w) / 2;
				for (let i = 0; i < this.bar.imgNo; i++) {
					gr.FillEllipse(this.bar.x2 + ((i + 0.5) / this.bar.imgNo) * this.bar.w1, this.bar.y2, this.bar.dot_w, this.bar.h, RGB(245, 245, 245));
					//gr.DrawEllipse(this.bar.x2 + ((i + 0.5) / this.bar.imgNo) * this.bar.w1, this.bar.y2, this.bar.dot_w, this.bar.h, ui.l_h, RGB(128, 128, 128));
				}
				gr.FillEllipse(this.bar.x2 + prog, this.bar.y3 - this.bar.gripOffset, this.bar.grip_h, this.bar.grip_h, RGB(245, 245, 245));
				//gr.DrawEllipse(this.bar.x2 + prog, this.bar.y3 - this.bar.gripOffset, this.bar.grip_h, this.bar.grip_h, ui.l_h, RGB(128, 128, 128));
				break;
			case 2:
				prog = this.bar.dn ? s.clamp(p.m_x - this.bar.x1, 0, this.bar.w1) : (ppt.artistView ? ix + 1 : i_x) * this.bar.w1 / this.bar.imgNo;
				//gr.DrawRect(this.bar.x1, this.bar.y2, this.bar.w1, this.bar.h, ui.l_h, RGB(128, 128, 128));
				gr.FillSolidRect(this.bar.x2, this.bar.y3, this.bar.w1 - ui.l_h, this.bar.h - ui.l_h, RGBA(0, 0, 0, 150));
				gr.FillSolidRect(this.bar.x2, this.bar.y3, prog - ui.l_h, this.bar.h - ui.l_h, RGB(245, 245, 245));
				//gr.SetSmoothingMode(2);
				//gr.FillEllipse(this.bar.x2 + prog - Math.round((this.bar.grip_h) / 2), this.bar.y3 - this.bar.gripOffset, this.bar.grip_h, this.bar.grip_h, RGB(245, 245, 245));
				//gr.DrawEllipse(this.bar.x2 + prog - Math.round((this.bar.grip_h) / 2), this.bar.y3 - this.bar.gripOffset, this.bar.grip_h, this.bar.grip_h, ui.l_h, RGB(128, 128, 128));
				break;
		}
		if (ppt.imgCounter) {
			if (ppt.imgBarDots == 1) prog += Math.round(this.bar.grip_h / 2 - this.bar.dot_w / 2);
			const count = (ppt.artistView ? ix + 1 : i_x) + (" / " + this.bar.imgNo), count_m = (this.bar.imgNo + (" / " + this.bar.imgNo)) + " ";
			if (count) {
				const count_w = gr.CalcTextWidth(count_m, ui.smallFont), count_x = ppt.imgBarDots ? Math.round(s.clamp(this.bar.x1 - count_w / 2 + prog, this.bar.l + 2, this.bar.l + nw + (!t.text ? p.bor_r : p.img_r) - count_w - 4)) : xa + ui.l_h * 2 + bor_w1, count_h = gr.CalcTextHeight(count, ui.smallFont), count_y = ppt.imgBarDots ? Math.round(this.bar.y2 - this.bar.gripOffset - count_h * 1.5) : ya + ui.l_h * 2 + bor_w1;
				gr.FillRoundRect(count_x, count_y, count_w + 2, count_h + 2, 3, 3, RGBA(0, 0, 0, 210));
				gr.DrawRoundRect(count_x + 1, count_y + 1, count_w, count_h, 1, 1, 1, RGBA(255, 255, 255, 60));
				gr.DrawRoundRect(count_x, count_y, count_w + 2, count_h + 2, 1, 1, 1, RGBA(0, 0, 0, 200));
				gr.GdiDrawText(count, ui.smallFont, RGB(250, 250, 250), count_x + 1, count_y, count_w, count_h + 2, t.cc);
			}
		}
		gr.SetSmoothingMode(0);
    }
	
    this.lbtn_dn = (p_x, p_y) => {
		this.bar.dn = false;
		this.down = true;
		if (this.imgBar) {
			if (!ppt.text_only && ((ppt.cycPhoto && ppt.artistView && artImages.length > 1) || (this.cycCov && !ppt.artistView && covers.length > 2 && !p.alb_ix)))
				this.bar.dn = p_x > this.bar.x3 && p_x < this.bar.x3 + this.bar.w2 && p_y > this.bar.y1 + this.bar.y4 && p_y < this.bar.y1 + this.bar.y5;
			
		if (this.bar.dn) {
			const prog = s.clamp(p_x - this.bar.x1, 0, this.bar.w1);
			if (ppt.artistView) {
				const new_ix = Math.min(Math.floor(prog / this.bar.w1 * artImages.length), artImages.length - 1);
				if (new_ix != ix) {ix = new_ix; setPhoto();}
		   } else {
				const new_i_x = Math.min(Math.floor(prog / this.bar.w1 * (covers.length - 1) + 1), covers.length - 1);
				if (new_i_x != i_x) {i_x = new_i_x; setCov();}
			}
			paint();
		}

		}
		if (!ppt.touchControl || p.text_trace || this.bar.dn) return; this.touch.dn = true; this.touch.start = p_x;
	}

    this.lbtn_up = (p_x, p_y) => {
		if (ppt.imgBar && !this.bar.dn && cur_img && !ppt.text_only) img_metrics(cur_img, ppt.artistView ? 0 : 1);
		this.bar.dn = false;
		this.down = false;
		if (this.touch.dn) {this.touch.dn = false;}
		if (this.imgBar) paint();
	}

    this.move = (p_x, p_y) => {
		this.bar.hand = false;
		if (this.imgBar) {
			const trace = p_x > this.bar.l && p_x < this.bar.l + nw && p_y > this.bar.y1 && p_y < this.bar.y1 + this.bar.y5;
			const show = !ppt.text_only && (ppt.artistView || !p.alb_ix) && (this.imgBar == 2 || trace);
			if (!ppt.text_only && ((ppt.cycPhoto && ppt.artistView && artImages.length > 1) || (this.cycCov && !ppt.artistView && covers.length > 2 && !p.alb_ix)))
				if (!this.down || this.bar.dn) this.bar.hand = p_x > this.bar.x3 && p_x < this.bar.x3 + this.bar.w2 && p_y > this.bar.y1 + nhh * 0.8  - this.bar.overlapCorr && p_y < this.bar.y1 + this.bar.y5;
			if (show != this.bar.show && !ppt.text_only && trace) paint();
			if (show) this.bar.show = true;
			this.bar.debounce();
		}

        if (this.bar.dn) {
			const prog = s.clamp(p_x - this.bar.x1, 0, this.bar.w1);
			if (ppt.artistView) {
				const new_ix = Math.min(Math.floor(prog / this.bar.w1 * artImages.length), artImages.length - 1);
				if (new_ix != ix) {ix = new_ix; setPhoto();}
			} else {
				const new_i_x = Math.min(Math.floor(prog / this.bar.w1 * (covers.length - 1) + 1), covers.length - 1);
				if (new_i_x != i_x) {i_x = new_i_x; setCov();}
			}
			paint();
		}

        if (this.touch.dn) {
            if (!p.imgBox(p_x, p_y)) return;
            this.touch.end = p_x;
            const x_delta = this.touch.end - this.touch.start;
            if (x_delta > p.imgs / 5) {this.wheel(1); this.touch.start = this.touch.end;}
            if (x_delta < -p.imgs / 5) {this.wheel(-1); this.touch.start = this.touch.end;}
        }
    }

    this.toggle = function(n) {
        switch (n) {
            case 'loadCovAllFb':
				ppt.loadCovAllFb = !ppt.loadCovAllFb; this.cycCov = ppt.loadCovAllFb || ppt.loadCovFolder; covCycle_ix = 1;
				id.albCyc = ""; id.albCyc_o = ""; if (ppt.artistView) break;
				if (this.cycCov) getCovImages(); else this.get_images(); break;
            case 'loadCovFolder':
				ppt.loadCovFolder = !ppt.loadCovFolder; this.cycCov = ppt.loadCovAllFb || ppt.loadCovFolder; covCycle_ix = 1;
				id.albCyc = ""; id.albCyc_o = ""; if (ppt.artistView) break;
				if (this.cycCov) getCovImages(); else this.get_images();
				if (ppt.loadCovFolder && !ppt.get("SYSTEM.Cover Folder Checked", false)) {fb.ShowPopupMessage("Enter folder in \"Server Settings\": [COVERS: CYCLE FOLDER].\n\nDefault: artist image folder.\n\nThis is a static load: images arriving after choosing the current album aren't included.", "Biography: load folder for cover cycling"); ppt.set("SYSTEM.Cover Folder Checked", true);} break;
        }	
    }
}

function Timers() {
    const timerArr = ["dl", "img", "sim1", "sim2", "source", "transition", "zSearch"], times = [1000, 1000, 1000, 1000, 2000, 4000, 5000, 6000, 7000]; let counter = 0, force = false;
    timerArr.forEach(v => this[v] = {id: null});
    const res = force => {window.NotifyOthers("get_img_bio", force); if (p.server) img.grab(force);}
    this.clear = timer => {if (timer) clearTimeout(timer.id); timer.id = null;}
    this.decelerating = function(p_force) {
        let counter = 0; this.clear(this.dl);
        const func = () => {res(p_force); counter++; if (counter < times.length) timer_dl(); else this.clear(this.dl);}
        const timer_dl = () => {this.dl.id = setTimeout(func, times[counter]);}
        timer_dl();
    }
    this.image = () => {if (!p.server) return; this.clear(this.img); this.img.id = setInterval(() => {img.fresh(); men.fresh(); //window.NotifyOthers("img_chg_bio", 0);
	}, 1000);}
}
timer.image();

function on_focus(is_focused) {tb.focus = is_focused;}
function on_get_album_art_done(handle, art_id, image, image_path) {img.get_album_art_done(handle, art_id, image, image_path);}
function on_item_focus_change() {
	//if (!ppt.panelActive) return; if (fb.IsPlaying && !ppt.focus) return; if (ppt.mul_item) p.get_multi(true); else if (!p.multi_new()) return; if (t.block() && !p.server) {img.get = true; t.get = ppt.focus ? 2 : 1; img.artist_reset(); t.album_reset(); t.artist_reset();} else {if (t.block() && p.server) {img.get = true; t.get = 1; img.artist_reset(); t.album_reset(); t.artist_reset();} else {img.get = false; t.get = 0;} p.focus_load(); p.focus_serv();}
}
function on_key_down(vkey) {switch(vkey) {case VK_ESCAPE: if(g_uihacks.getFullscreenState()) g_uihacks.toggleFullscreen(); break; case 0x10: case 0x11: case 0x12: t.paint(); break; case 0x21: if (!ppt.img_only && !p.zoom()) t.scrollbar_type().page_throttle(1); break; case 0x22: if (!ppt.img_only && !p.zoom()) t.scrollbar_type().page_throttle(-1); break; case 35: if (!ppt.img_only && !p.zoom()) t.scrollbar_type().scroll_to_end(); break; case 36:if (!ppt.img_only && !p.zoom()) t.scrollbar_type().check_scroll(0, 'full'); break; case 37: img.wheel(1); break; case 39: img.wheel(-1); break;}}
function on_key_up(vkey) {if (vkey == 0x10 || vkey == 0x11 || vkey == 0x12) t.paint();}
function on_library_items_added() {if (!ppt.panelActive) return; if (!lib) return; lib.update = true;}; function on_library_items_removed() {if (!ppt.panelActive) return; if (!lib) return; lib.update = true;}; function on_library_items_changed() {if (!ppt.panelActive) return; if (!lib) return; lib.update = true;}
function on_load_image_done(id, image, image_path) {img.load_image_done(id, image, image_path);}
//function on_metadb_changed() 
function on_playback_edited() {if (!ppt.panelActive) return; if (p.ir(ppt.focus) || t.block() && !p.server || !p.multi_new()) return; p.get_multi(true); if (!ppt.img_only) t.on_playback_new_track(); if (!ppt.text_only || ui.blur) img.on_playback_new_track(); p.metadb_serv();}
function on_mouse_lbtn_dblclk(x, y) {if (!ppt.panelActive) return; but.lbtn_dn(x, y); t.scrollbar_type().lbtn_dblclk(x, y); if (!p.dblClick) return; if (ppt.touchControl) p.last_pressed_coord = {x: x, y: y}; p.click(x, y);}
function on_mouse_lbtn_down(x, y) {
	if(g_cursor.x!=x || g_cursor.y!=y) on_mouse_move(x,y);		
	var hover_btn = btns_manager.on_mouse("lbtn_down",x, y);
	if(!hover_btn){
		if (!ppt.panelActive) return; if (ppt.touchControl) p.last_pressed_coord = {x: x, y: y}; tb.lbtn_dn(x, y); but.lbtn_dn(x, y); t.scrollbar_type().lbtn_dn(x, y); img.lbtn_dn(x, y);
	}
}
function on_mouse_lbtn_up(x, y) {
	var down_btn = btns_manager.on_mouse("lbtn_up",x, y);
	if(!down_btn){	
		if (!ppt.panelActive) return; t.scrollbar_type().lbtn_drag_up(x, y); if (!p.dblClick && !but.Dn && !img.bar.dn) p.click(x, y); t.scrollbar_type().lbtn_up(x, y); p.clicked = false; tb.lbtn_up(x, y); but.lbtn_up(x, y); img.lbtn_up(x, y);
	}
}
function on_mouse_leave() {
	if (!ppt.panelActive) return; p.leave(); but.leave(); t.scrollbar_type().leave(); img.leave(); p.m_y = -1;
	btns_manager.on_mouse("leave");
	g_cursor.x = 0;
    g_cursor.y = 0;	
}
function on_mouse_mbtn_up(x, y, mask) {if (mask == 0x0004) p.inactivate(); else if (ppt.panelActive) p.mbtn_up(x, y);}
function on_mouse_move(x, y, m) {
    if(x == g_cursor.x && y == g_cursor.y) return;
	g_cursor.onMouse("move", x, y, m);	  	
	if (!ppt.panelActive) return; if (p.m_x == x && p.m_y == y) return; p.move(x, y); but.move(x, y); t.scrollbar_type().move(x, y); tb.img_move(x, y); tb.move(x, y); img.move(x, y); p.m_x = x; p.m_y = y;
	btns_manager.on_mouse("move",x, y);
}
function on_mouse_rbtn_up(x, y) {if (!ppt.panelActive) {men.activate(x, y); return true}; men.rbtn_up(x, y); return true;}
function on_mouse_wheel(step) {if (!ppt.panelActive) return; switch (p.zoom()) {case false: if (but.btns["mt"] && but.btns["mt"].trace(p.m_x, p.m_y)) men.wheel(step, true); else if (p.text_trace) {if (!ppt.img_only) t.scrollbar_type().wheel(step, false);} else img.wheel(step); break; case true: ui.wheel(step); if (utils.IsKeyPressed(0x11)) but.wheel(step); if (utils.IsKeyPressed(0x10)) {if (!p.text_trace) img.wheel(step); if (but.btns["mt"] && but.btns["mt"].trace(p.m_x, p.m_y)) men.wheel(step, true);} break;}}
function on_notify_data(name, info) {let clone; if (ui.local) {clone = typeof info === 'string' ? String(info) : info; on_cui_notify(name, clone);} switch (name) {case "chkTrackRev_bio": if (!p.server && p.inclTrackRev) {clone = JSON.parse(JSON.stringify(info)); clone.inclTrackRev = true; window.NotifyOthers("isTrackRev_bio", clone);} break; case "isTrackRev_bio": if (p.server && info.inclTrackRev == true) {clone = JSON.parse(JSON.stringify(info)); serv.get_track(clone);} break; case "lyrics_state": lyrics_state.value = info; positionButtons(); break; case "img_chg_bio": img.fresh(); men.fresh(); break; case "chk_arr_bio": clone = JSON.parse(JSON.stringify(info)); img.chk_arr(clone); break; case "custom_style_bio": clone = String(info); p.on_notify(clone); break; case "force_update_bio": if (p.server) {clone = JSON.parse(JSON.stringify(info)); serv.fetch(1, clone[0], clone[1]);} break; case "get_multi_bio": p.get_multi(); break; case "get_rev_img_bio": if (p.server) {clone = JSON.parse(JSON.stringify(info)); serv.get_rev_img(clone[0], clone[1], clone[2], clone[3], false);} break; case "get_img_bio": img.grab(info ? true : false); break; case "get_txt_bio": t.grab(); break; case "multi_tag_bio": if (p.server) {clone = JSON.parse(JSON.stringify(info)); serv.fetch(false, clone[0], clone[1]);} break; case "not_server_bio": p.server = false; timer.clear(timer.img); timer.clear(timer.zSearch); break; case "blacklist_bio": img.blkArtist = ""; img.chkArtImg(); break; case "script_unload_bio": p.server = true; window.NotifyOthers("not_server_bio", 0); break; case "refresh_bio": window.Reload(); break; case "reload_bio": if (!p.art_ix && ppt.artistView || !p.alb_ix && !ppt.artistView) window.Reload(); else {t.artistFlush(); t.albumFlush(); t.grab(); if (ppt.text_only) t.paint();} break; case "status_bio": ppt.panelActive = info; window.Reload(); break;}}
function on_paint(gr) {if(on_size_2Call){ on_size(window.Width, window.Height);on_size_2Call=false;}ui.draw(gr); if (!ppt.panelActive) {gr.GdiDrawText("Biography Inactive\r\n\r\nNo Internet Searches. No Text or Image Loading.\r\n\r\nACTIVATE: RIGHT CLICK\r\n\r\n(Toggle: Shift + Middle Click)", ui.font, ui.col.text, 0, 0, p.w, p.h, t.cc); return;} img.draw(gr); t.draw(gr); t.messageDraw(gr); but.draw(gr); tb.drawEd(gr); ui.lines(gr);btns_manager.draw(gr);}
function on_playback_dynamic_info_track() {if (!ppt.panelActive) return; if (p.server) serv.fetch_dynamic(); t.on_playback_new_track(); img.on_playback_new_track();}
function on_playback_new_track() {if (!ppt.panelActive) return; if (p.server) serv.fetch(false, {ix:0, focus:false, arr:[]}, {ix:0, focus:false, arr:[]}); if (ppt.focus) return; t.on_playback_new_track(); img.on_playback_new_track();}
function on_playback_stop(reason) {if (!ppt.panelActive) return; if (reason == 2) return; on_item_focus_change();}
function on_playlist_items_added() {if (!ppt.panelActive) return; on_item_focus_change();}
function on_playlist_items_removed() {if (!ppt.panelActive) return; on_item_focus_change();}
function on_playlist_switch() {if (!ppt.panelActive) return; on_item_focus_change();}
function on_playlists_changed() {if (!ppt.panelActive) return; men.playlists_changed();}
function on_script_unload() {if (p.server) {window.NotifyOthers("script_unload_bio", 0); timer.clear(timer.img);} but.on_script_unload();}
function on_size(w, h) {t.rp = false; p.w = w; p.h = h; if (!p.w || !p.h) return; if(!window.IsVisible) {on_size_2Call = true;return;} ui.get_font(); if (!ppt.panelActive) return; p.calcText = true; t.on_size(); img.on_size(); t.rp = true; img.displayed_other_panel = null;}
function RGB(r, g, b) {return 0xff000000 | r << 16 | g << 8 | b;}
function RGBA(r, g, b, a) {return a << 24 | r << 16 | g << 8 | b;}
function StringFormat() {const a = arguments, flags = 0; let h_align = 0, v_align = 0, trimming = 0; switch (a.length) {case 3: trimming = a[2]; case 2: v_align = a[1]; case 1: h_align = a[0]; break; default: return 0;} return (h_align << 28 | v_align << 24 | trimming << 20 | flags);}

function Server() {
    if (!p.server) return;
    String.prototype.format = function() {return this.replace(/<P><\/P>/gi, "").replace(/<p[^>]*>/gi, "").replace(/\r/g, "").replace(/\n/g, "").replace(/<\/p>/gi, "\r\n\r\n").replace(/<br>/gi, "\r\n").replace(/(<([^>]+)>)/ig, '').replace(/&amp(;|)/g,"&").replace(/&quot(;|)/g,'"').replace(/&#39(;|)/g,"'").replace(/&gt(;|)/g, ">").replace(/&nbsp(;|)/g, "").replace(/^ +/gm, "").replace(/^\s+|\s+$/g, "");}
    String.prototype.tidy = function() {return this.replace(/&amp(;|)/g,"&").replace(/&quot(;|)/g,'"').replace(/&#39(;|)/g,"'").replace(/&gt(;|)/g, ">").replace(/&nbsp(;|)/g, "").replace(/\band\b|\//gi, "&").replace(/[\.,\!\?\:;'\u2019"\-_\(\)\[\]\u2010\s+]/g, "").replace(/\$/g, "s").toLowerCase();}
    const ext = [".jpg", ".png", ".gif", ".bmp", ".jpeg"];
    let albm = "", album = "", alb_artist = "", alb_id = "", album_id = "", artist = "", auto_corr = 1, trackID1 = "", trackID2 = "";
    const bioCacheSave = n => {if (!$.isArray(imgToDelete)) {imgToDelete = []; n = true;} if (n) s.save(bioCache, JSON.stringify(imgToDelete, null, 3), true);}
    const bioCache = fb.ProfilePath + "yttm\\" + "cache_bio.json"; let imgToDelete = []; if (s.file(bioCache)) imgToDelete = s.jsonParse(bioCache, false, 'file'); bioCacheSave();
    if (p.server) {
        const dn_arr = ["am_bio", "lfm_bio", "am_rev", "lfm_rev", "dl_art_img", "lfm_cov"];
        dn_arr.forEach((v, i, arr) => {
            if (i < arr.length - 1) this[v] = p.valueIni("AUTO-FETCH", p.def_dn[i].name, p.def_dn[i].dn, 1);
            else this[v] = p.valueIni("COVERS: MUSIC FILES", p.cov[0].name, p.cov[0].path, 1);
        });
    }
    const auto_add = p.valueIni("MISCELLANEOUS", p.def_tf[7].name, p.def_tf[7].tf, 1); let exp = Math.max(p.d * utils.ReadINI(p.bio_ini, "MISCELLANEOUS", p.def_tf[5].name) / 28, p.d), upd = p.d / 28, url = {lfm: "https://ws.audioscrobbler.com/2.0/?format=json" + p.lfm, lfm_sf: "https://www.songfacts.com/"}; if (!exp || isNaN(exp)) exp = p.d;
    const imgNo = s.clamp(p.valueIni("MISCELLANEOUS", p.def_tf[6].name, p.def_tf[6].tf, 2), 0, 40);
    let artLimit = parseFloat(utils.ReadINI(p.bio_ini, "MISCELLANEOUS", p.def_tf[8].name)); artLimit = artLimit ? Math.max(artLimit, imgNo) : 0; if (artLimit && !ppt.get("SYSTEM.Cache Limit Advisory", false)) {let f_pth = p.cleanPth(p.pth.imgArt, ppt.focus); f_pth = f_pth ? f_pth : "N/A"; fb.ShowPopupMessage("Artist image cache limit: now enabled. \r\n\r\nLimits number of images stored per artist to the value set*. If used with auto-add, newer images are added & older removed to give a fixed number of up-to-date images.\r\n\r\nOnly considers images ending in \"_32-alphanumeric-string.jpg\", e.g. Coldplay_421cac7d8e42662f069c4b69e7934d7b.jpg.\r\n\r\nIf a custom save location is used, ensure images are saving where expected & there aren't other matching images.\r\n\r\nCurrent save folder: " + f_pth + "\r\n\r\nThe cache limit is applied following image update and when images are no longer in use.\r\n\r\n*Actual number also depends on minimum target number (initial fetch number) and whether auto-add is enabled (tops up to a minimum of 5) as these take precedence.", "Biography"); ppt.set("SYSTEM.Cache Limit Advisory", true);}
    const bio_json = fb.ProfilePath + "yttm\\" + "update_bio.json"; if (!s.file(bio_json)) s.save(bio_json, JSON.stringify([{"name":"update", "time":Date.now()}], null, 3), true); let m = s.jsonParse(bio_json, false, 'file'); if (!$.isArray(m)) {m = [{"name":"update", "time":Date.now()}]; s.save(bio_json, JSON.stringify(m, null, 3), true);} if (m[0].name != "update") {m.unshift({"name":"update", "time":Date.now()}); s.save(bio_json, JSON.stringify(m, null, 3), true)}

    const done = (f, exp) => {if (!s.file(bio_json)) return false; const m = s.jsonParse(bio_json, false, 'file'); const n = Date.now(), r = n - exp, u = n - upd; let k = m.length; if (m.length && m[0].time < u) {while (k--) if (m[k].time < r && k) m.splice(k, 1); m[0].time = n; s.save(bio_json, JSON.stringify(m, null, 3), true);} for (k = 0; k < m.length; k++) if (m[k].name == f) return true; return false;}
    const update = f => {if (!s.file(bio_json)) return; const m = s.jsonParse(bio_json, false, 'file'), n = Date.now(); let k = m.length; for (k = 0; k < m.length; k++) if (m[k].name == f) return; m.push({"name":f, "time":n}); s.save(bio_json, JSON.stringify(m, null, 3), true);}
    const expired = (f, exp, f_done, langCheck, type) => {if (langCheck) {let i = 0; switch (type) {case 0: for (i = 0; i < similar.length; i++) if (langCheck.includes(similar[i]) && i != p.lfmLang_ix) return true; for (i = 0; i < listeners.length; i++) if (langCheck.includes(listeners[i]) && i != p.lfmLang_ix) return true; break; case 1: for (i = 0; i < releaseDate.length; i++) if (langCheck.includes(releaseDate[i]) && i != p.lfmLang_ix) return true; for (i = 0; i < listeners.length; i++) if (langCheck.includes(listeners[i]) && i != p.lfmLang_ix) return true; break;}} if (f_done && done(f_done, exp)) return false; if (!s.file(f)) return true; return Date.now() - s.lastModified(f) > exp;}
    const cov_loc = handle => {return !handle.RawPath.startsWith('fy+') && !handle.RawPath.startsWith('3dydfy:') && !handle.RawPath.startsWith('http');}
    const check_match = (n, l) => {return 1 - levenshtein(n, l) / (n.length > l.length ? n.length : l.length) > 0.8;} // 0.8 sets fuzzy match level
    const levenshtein = (a, b) => {if (a.length === 0) return b.length; if (b.length === 0) return a.length; let i, j, prev, row, tmp, val; if (a.length > b.length) {tmp = a; a = b; b = tmp;} row = Array(a.length + 1); for (i = 0; i <= a.length; i++) row[i] = i; for (i = 1; i <= b.length; i++) {prev = i; for (j = 1; j <= a.length; j++) {if (b[i - 1] === a[j - 1]) val = row[j - 1]; else val = Math.min(row[j - 1] + 1, Math.min(prev + 1, row[j] + 1)); row[j - 1] = prev; prev = val;} row[a.length] = prev;} return row[a.length];}
    const compilation = n => {n = n.toLowerCase(); const kw = ["all the best", "all time greatest hits", "all-time greatest hits", "anthology", "at their best", "best of", "the best of", "very best of", "the very best of", "collection", "the collection", "definitive collection", "the definitive collection", "essential", "the essential", "essential collection", "the essential collection", "essentials", "the essentials", "gold", "gold greatest hits", "gold collection", "the gold collection", "greatest hits", "the greatest hits", "hits", "the hits", "platinum collection", "the platinum collection", "singles collection", "the singles collection", "super hits", "the ultimate collection", "ultimate collection"]; for (let i = 0; i < kw.length; i++) if (n == kw[i]) return true; return false;}
    const fallback = p.valueIni("LASTFM LANGUAGE", p.lang[1].name, p.lang[1].tf, 1);
    let lfm_server = p.lfmLang, def_server_EN = lfm_server == "www.last.fm", serverFallback = fallback && !def_server_EN;
    this.setLfm = lang => {if (lang) lfm_server = lang; lfm_server = lfm_server == "en" ? "www.last.fm" : "www.last.fm/" + lfm_server; def_server_EN = lfm_server == "www.last.fm"; serverFallback = fallback && !def_server_EN;}; this.setLfm();
    const listeners = ["Listeners", "Hörer", "Oyentes", "Auditeurs", "Ascoltatori", "リスナー", "Słuchaczy", "Ouvintes", "Слушатели", "Lyssnare", "Dinleyiciler", "听众"];
    const noWiki = n => (/wiki|vikimiz|\u0412\u0438\u043A\u0438|\u7EF4\u57FA/i).test(n);
    const partial_match = p.valueIni("MISCELLANEOUS", p.def_tf[10].name, p.def_tf[10].tf, 1);
    const releaseDate = ["Release Date: ", "Veröffentlichungsdatum: ", "Fecha De Lanzamiento: ", "Date De Sortie: ", "Data Di Pubblicazione: ", "リリース日: ", "Data Wydania: ", "Data De Lançamento: ", "Дата релиза: ", "Utgivningsdatum: ", "Yayınlanma Tarihi: ", "发布日期: "];
    const res = () => {window.NotifyOthers("get_txt_bio", "get_txt_bio"); t.grab();}
    const similar = ["Similar Artists: ", "Ähnliche Künstler: ", "Artistas Similares: ", "Artistes Similaires: ", "Artisti Simili: ", "似ているアーティスト: ", "Podobni Wykonawcy: ", "Artistas Parecidos: ", "Похожие исполнители: ", "Liknande Artister: ", "Benzer Sanatçılar: ", "相似艺术家: "];
    const sort = data => data.sort((a, b) => a.m - b.m);
	const topAlb = ["Top Albums: ", "Top-Alben: ", "Álbumes Más Escuchados: ", "Top Albums: ", "Album Più Ascoltati: ", "人気アルバム: ", "Najpopularniejsze Albumy: ", "Álbuns Principais: ", "Популярные альбомы: ", "Toppalbum: ", "En Sevilen Albümler: ", "最佳专辑: "];
    this.fetch = (force, art, alb) => {get_bio(force, art, alb, force == 2 ? true : false); get_rev(force, art, alb, force == 2 ? true : false);}
    this.fetch_dynamic = () => {get_bio(false, {ix:0, focus:false, arr:[]}, {ix:0, focus:false, arr:[]}); amBio(false, {ix:0, focus:false, arr:[]})}
    function create_dl_file() {const n = fb.ProfilePath + "yttm\\foo_lastfm_img.vbs"; if (!s.file(n) || s.fs.GetFile(n).Size == "696") {const dl_im = "If (WScript.Arguments.Count <> 2) Then\r\nWScript.Quit\r\nEnd If\r\n\r\nurl = WScript.Arguments(0)\r\nfile = WScript.Arguments(1)\r\n\r\nSet objFSO = Createobject(\"Scripting.FileSystemObject\")\r\nIf objFSO.Fileexists(file) Then\r\nSet objFSO = Nothing\r\nWScript.Quit\r\nEnd If\r\n\r\nSet objXMLHTTP = CreateObject(\"MSXML2.XMLHTTP\")\r\nobjXMLHTTP.open \"GET\", url, false\r\nobjXMLHTTP.send()\r\n\r\nIf objXMLHTTP.Status = 200 Then\r\nSet objADOStream = CreateObject(\"ADODB.Stream\")\r\nobjADOStream.Open\r\nobjADOStream.Type = 1\r\nobjADOStream.Write objXMLHTTP.ResponseBody\r\nobjADOStream.Position = 0\r\nobjADOStream.SaveToFile file\r\nobjADOStream.Close\r\nSet objADOStream = Nothing\r\nEnd If\r\n\r\nSet objFSO = Nothing\r\nSet objXMLHTTP = Nothing"; s.save(n, dl_im, false);}}; if (p.server) create_dl_file();

    const img_exp = (p_dl_ar, imgFolder, ex) => {
        const f = imgFolder + "update.txt", imgExisting = []; let allFiles = []; if (!s.file(f)) return [imgNo, 0, allFiles];
        const getNew = Date.now() - s.lastModified(f) > ex;
        if (!getNew) return [0, auto_add, allFiles];
        allFiles = utils.Glob(imgFolder + "*"); let imNo = 0;
        allFiles.forEach(v => {
            if ((/_([a-z0-9]){32}\.jpg$/).test(s.fs.GetFileName(v))) {
                imNo++; if (artLimit) imgExisting.push({p: v, m: s.lastModified(v)});
            }
        });
        if (artLimit) sort(imgExisting);
        const newImgNo = imgNo - imNo
        if (newImgNo > 0) return [newImgNo, 0, allFiles]; else if (!auto_add) {
            if (artLimit) {
                const remove = imgExisting.length - artLimit; if (remove > 0) {
                    for (let j = 0; j < remove; j++) imgToDelete.push({a: p_dl_ar, p: imgExisting[j].p});
                    bioCacheSave(true);}} return [0, auto_add, allFiles];} else return [5, auto_add, allFiles, imgExisting];
    }

	const match = (p_a, p_release, list, type) => {
		const a = s.removeDiacritics(p_a.replace(/^The /i, "").tidy()), rel = s.removeDiacritics(p_release.tidy()), rel_m = [], art_m = []; let i = 0;
		for (i = 0; i < list.length; i++) {
			rel_m[i] = list[i].nextSibling ? s.removeDiacritics(list[i].nextSibling.innerText.tidy()) : "N/A";
			art_m[i] = list[i].nextSibling && list[i].nextSibling.nextSibling ? s.removeDiacritics(list[i].nextSibling.nextSibling.innerText.replace(/^The /i, "").tidy()) : "N/A"; 
			if (rel == rel_m[i] && art_m[i] == a) return i;
		} 
		if (!partial_match) return -1;
		switch (true) {
			case type == 'rev':
				for (i = 0; i < list.length; i++) if (rel_m[i].includes(rel) && art_m[i].includes(a)) return i;
				for (i = 0; i < list.length; i++) if (check_match(rel, rel_m[i]) && art_m[i].includes(a)) return i;
				break;
			case type == 'title':
				for (i = 0; i < list.length; i++) if (rel_m[i].includes(rel) && art_m[i] == a) return i;
				for (i = 0; i < list.length; i++) {if (check_match(rel, rel_m[i]) && art_m[i] == a) return i;}
				break;
		}
		return -1;
	}

    const get_bio = (force, art, alb, onlyForceLfm) => {
        const stndBio = !art.ix || art.ix + 1 > art.arr.length;
        let artist_done = false, new_artist = stndBio ? name.artist(art.focus, true) : art.arr[art.ix].name, supCache = false;
        if (new_artist == artist && !force || new_artist == "") artist_done = true; else artist = new_artist;
        if (!stndBio) supCache = p.sup.Cache && !lib.in_library(0, artist);
        if (this.lfm_bio && !artist_done) {
            const lfm_bio = p.getPth('bio', art.focus, artist, "", stndBio, supCache, artist.clean(), "", "", 'lfmBio', true, true), text = s.open(lfm_bio.pth), custBio = text.includes("Custom Biography");
            if (expired(lfm_bio.pth, exp, "", text, 0) && !custBio || force == 2 && !custBio || force == 1) {const dl_lfm_bio = new Dl_lastfm_bio(() => dl_lfm_bio.on_state_change()); dl_lfm_bio.Search(artist, lfm_bio.fo, lfm_bio.pth, force);}
        }
        this.chk_track({force: force, artist: stndBio ? artist : name.artist(art.focus, true), title: name.title(art.focus, true)});
        if (!artist_done) {
            if (this.dl_art_img) {const dl_art = new Dl_art_images; dl_art.run(artist, force, art, stndBio, supCache);} else timer.decelerating();
            if (p.lfm_sim && stndBio) {
                const fo_sim = p.cleanPth(p.pth.lfmSim, ppt.focus, 'server'), pth_sim = fo_sim + artist.clean() + " And Similar Artists.json";
                let len = 0, valid = false;
                if (s.file(pth_sim)) {const list = s.jsonParse(pth_sim, false, 'file'); if (list) {valid = list[0].hasOwnProperty('name'); len = list.length;}}
                if (expired(pth_sim, exp) || !valid || force) {const dl_lfm_sim = new Lfm_similar_artists(() => dl_lfm_sim.on_state_change()); dl_lfm_sim.Search(artist, "", "", len > 115 ? 249 : 100, fo_sim, pth_sim);}
            }
            if (stndBio && artLimit && !p.lock) {
                let j = imgToDelete.length; while (j--) {
                    if (imgToDelete[j].a != name.artist(true) && imgToDelete[j].a != name.artist(false)) {
                    try {if (s.file(imgToDelete[j].p)) s.fs.DeleteFile(imgToDelete[j].p);} catch (e) {}
                    if (!s.file(imgToDelete[j].p)) imgToDelete.splice(j, 1)
                    }
                }
                bioCacheSave(true);
            }
        }
    }

    this.chk_track = tr => {
        let track_done = false; if (tr.artist + tr.title == trackID1 && !tr.force || tr.artist == "" || tr.title == "") track_done = true; else trackID1 = tr.artist + tr.title;
        if (this.lfm_rev && !track_done) {if (ppt.inclTrackRev) this.get_track(tr); else window.NotifyOthers("chkTrackRev_bio", tr);}
    }

    this.get_track = tr => {
        if (trackID2 == tr.artist + tr.title && !tr.force) return; trackID2 = tr.artist + tr.title;
        const lfm_tracks = p.getPth('track', ppt.focus, tr.artist, "Track Reviews", "", "", tr.artist.clean(), "", "Track Reviews", 'lfmRev', true, true), text = s.jsonParse(lfm_tracks.pth, false, 'file'), trk = tr.title.toLowerCase();
        if (!text || !text[trk] || text[trk].update < Date.now() - exp || text[trk].lang != p.lfmLang || tr.force) {const dl_lfm_track = new Lfm_track(() => dl_lfm_track.on_state_change()); dl_lfm_track.Search(tr.artist, trk, lfm_tracks.fo, lfm_tracks.pth, tr.force);}
    }
	
	const amBio = (force, art) => {
		const stndBio = !art.ix || art.ix + 1 > art.arr.length;
		if (!stndBio || !this.am_bio) return; const title = name.title(art.focus, true);
		if (!artist || !title) return;
		const am_bio = p.getPth('bio', art.focus, artist, "", stndBio, false, artist.clean(), "", "", 'amBio', true, true);
		if (force || expired(am_bio.pth, exp, "Bio " + partial_match + " " + artist + " - " + title, false) && !s.open(am_bio.pth).includes("Custom Biography")) {
		const dl_am_bio = new Dl_allmusic_bio(() => dl_am_bio.on_state_change()); dl_am_bio.Search(0, "https://www.allmusic.com/search/songs/" + encodeURIComponent(title), title, artist, am_bio.fo, am_bio.pth, force);
		}
	}

    const get_rev = (force, art, alb, onlyForceLfm) => {
        const stndAlb = !alb.ix || alb.ix + 1 > alb.arr.length, new_album_id = stndAlb ? p.eval(p.tf.aa + p.tf.l, alb.focus, true) : alb.arr[alb.ix].artist + alb.arr[alb.ix].album;
        let supCache = false;
        if (new_album_id == album_id && !force) return amBio(force, art);
        album_id = new_album_id; album = stndAlb ? name.album(alb.focus, true) : alb.arr[alb.ix].album; albm = stndAlb ? name.albm(alb.focus, true) : alb.arr[alb.ix].album;
        alb_artist = stndAlb ? name.alb_artist(alb.focus, true) : alb.arr[alb.ix].artist;
        if (!album || !alb_artist) return amBio(force, art);
        if (!stndAlb) supCache = p.sup.Cache && !lib.in_library(1, alb_artist, album);
		if (stndAlb) {if (albm) get_cover(force, alb);} else if (force && p.rev_img) this.get_rev_img(alb_artist, album, "", "", force);
        if (this.am_rev && !onlyForceLfm) {
            const am_rev = p.getPth('rev', alb.focus, alb_artist, album, stndAlb, supCache, alb_artist.clean(), alb_artist.clean(), album.clean(), 'amRev', true, true);
            const artiste = stndAlb ? name.artist(alb.focus, true) : alb_artist;
            const am_bio = p.getPth('bio', alb.focus, artiste, "", stndAlb, p.sup.Cache && !lib.in_library(0, artiste), artiste.clean(), "", "", 'amBio', true, true);
            const art_upd = expired(am_bio.pth, exp, "Bio " + partial_match + " " + am_rev.pth, false) && !s.open(am_bio.pth).includes("Custom Biography");
			let rev_upd = !done("Rev " + partial_match + " " + am_rev.pth, exp);
			if (rev_upd) {
				let amRev = s.open(am_rev.pth);
				rev_upd = !amRev || (!amRev.includes("Genre: ") || !amRev.includes("Review by ") && Date.now() - s.lastModified(s.file(am_rev.pth)) < exp) && !amRev.includes("Custom Review");
			}
            let dn_type = "";
            if (rev_upd || art_upd || force) {
                if ((this.am_rev && rev_upd) && (this.am_bio && art_upd) || force) dn_type = "both"; else if (this.am_rev && rev_upd || force) dn_type = "review"; else if (this.am_bio && art_upd || force) dn_type = "bio";
                const dl_am_rev = new Dl_allmusic_rev(() => dl_am_rev.on_state_change()); dl_am_rev.Search(0, "https://www.allmusic.com/search/albums/" + encodeURIComponent(!compilation(album) ? album : alb_artist + " " + album.replace(/^The /i, "")), album, alb_artist, artiste, dn_type, am_rev.fo, am_rev.pth, am_bio.fo, am_bio.pth, art, force);
            } else amBio(force, art);
        }
        if (!this.lfm_rev) return;
        const lfm_rev = p.getPth('rev', alb.focus, alb_artist, album, stndAlb, supCache, alb_artist.clean(), alb_artist.clean(), album.clean(), 'lfmRev', true, true), lfmRev = s.open(lfm_rev.pth), custRev = lfmRev.includes("Custom Review");
        if ((!expired(lfm_rev.pth, exp, "", lfmRev, 1) || custRev) && !force || custRev && force == 2) return;
        const lfm_alb = new Lfm_album(() => lfm_alb.on_state_change()); lfm_alb.Search(alb_artist, album, true, lfm_rev.fo, lfm_rev.pth, "", force, false);
    }

    const get_cover = (force, alb) => { // stndAlb
        const handle = s.handle(alb.focus, true); if (!handle) return;
        const g_img = utils.GetAlbumArtV2(handle, 0, false); if (g_img) return;
        const sw = this.lfm_cov && cov_loc(handle) ? 1 : p.rev_img ? 0 : 2; let lfm_cov;
        switch (sw) {
            case 1: // cover
                const cov = p.getPth('cov', alb.focus, 'server');
                if (done(alb_artist + " - " + album + " " +  auto_corr + " " + cov.pth, exp) && !force) return;
                if (img.chkPths([cov.pth], "", 2)) return;
                if (p.extra && img.chkPths(p.extraPaths, "", 2, true)) return;
                lfm_cov = new Lfm_album(() => lfm_cov.on_state_change()); lfm_cov.Search(alb_artist, album, false, cov.fo, cov.pth, albm, force, false);
                break;
            case 0: // rev_img
                const rev_img = p.getPth('img', alb.focus, alb_artist, album);
                if (done(alb_artist + " - " + album + " " +  auto_corr + " " + rev_img.pth, exp) && !force) return;
                if (img.chkPths([rev_img.pth, p.getPth('cov', alb.focus).pth], "", 2)) return;
                if (p.extra && img.chkPths(p.extraPaths, "", 2, true)) return;
                lfm_cov = new Lfm_album(() => lfm_cov.on_state_change()); lfm_cov.Search(alb_artist, album, false, rev_img.fo, rev_img.pth, albm, force, true);
                break;
            }
    }

    this.get_rev_img = (a, l, pe, fe, force) => { // !stndAlb
        if (!force) {if (done(a + " - " + l + " " +  auto_corr + " " + fe, exp)) return; const lfm_cov = new Lfm_album(() => lfm_cov.on_state_change()); lfm_cov.Search(a, l, false, pe, fe, l, false, true);}
        else {
            const metadb = lib.in_library(2, a, l);
            if (metadb) {const g_img = utils.GetAlbumArtV2(metadb, 0, false); if (g_img) return;}
            else {
                const pth = p.getPth('img', ppt.focus, a, l, "", p.sup.Cache);
                if (img.chkPths(pth.pe, pth.fe, 2)) return;
                const lfm_cov = new Lfm_album(() => lfm_cov.on_state_change()); lfm_cov.Search(a, l, false, pth.pe[p.sup.Cache], pth.pe[p.sup.Cache] + pth.fe, l, true, true);
            }
        }
    }

    function Dl_allmusic_bio(state_callback) {
        let artist = "", artistLink = "", fo_bio, pth_bio, sw = 0, title = ""; this.xmlhttp = null; this.func = null; this.ready_callback = state_callback; this.ie_timer = null;
        this.on_state_change = () => {if (this.xmlhttp != null && this.func != null) if (this.xmlhttp.readyState == 4) {clearTimeout(this.ie_timer); this.ie_timer = null; if (this.xmlhttp.status == 200) this.func(); else {s.trace("allmusic album review / biography: " + album + " / " + alb_artist + ": not found" + " Status error: " + this.xmlhttp.status, true);}}}

        this.Search = (p_sw, URL, p_title, p_artist, p_fo_bio, p_pth_bio, force) => {
            sw = p_sw; if (!sw) {fo_bio = p_fo_bio; pth_bio = p_pth_bio; title = p_title; artist = p_artist;}
            this.func = null; this.xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
            this.func = this.Analyse; this.xmlhttp.open("GET", URL); this.xmlhttp.onreadystatechange = this.ready_callback; if (force) this.xmlhttp.setRequestHeader('If-Modified-Since', 'Thu, 01 Jan 1970 00:00:00 GMT');
			if (!this.ie_timer) {const a = this.xmlhttp; this.ie_timer = setTimeout(() => {a.abort(); this.ie_timer = null;}, 30000);}
			this.xmlhttp.send();
        }

        this.Analyse = () => {
			switch (sw) {
				case 0:
					s.doc.open(); const div = s.doc.createElement('div'); let i = 0, list;
					try {div.innerHTML = this.xmlhttp.responseText.replace(/by\s*<a href/gi, "<a href");
					list = div.getElementsByTagName('h4'); i = match(artist, title, list, 'title');
					if (i != -1) {
						artistLink = list[i].nextSibling.nextSibling.firstChild.getAttribute('href');
						if (artistLink) {sw = 1; s.doc.close(); return this.Search(sw, artistLink + "/biography");}
						update("Bio " + partial_match + " " + artist + " - " + title); s.trace("allmusic biography: " + artist + ": not found [search method: title / artist]", true);
					} update("Bio " + partial_match + " " + artist + " - " + title); s.trace("allmusic biography: " + artist + ": not found [search method: title / artist]", true);
					} catch (e) {update("Bio " + partial_match + " " + artist + " - " + title); s.trace("allmusic biography: " + artist + ": not found [search method: title / artist]", true);}
					s.doc.close();
					break;
				case 1:
					processAmBio(this.xmlhttp.responseText, artist, "", title, fo_bio, pth_bio, "");
					break;
			}
        }
    }
	
	const processAmBio = (responseText, artist, album, title, fo_bio, pth_bio, pth_rev) => {
		s.doc.open(); const div = s.doc.createElement('div');
		try {div.innerHTML = responseText; const dv = div.getElementsByTagName('div'); let active = "", biography = "", biographyAuthor = "", biographyGenre = [], tg = "";
		s.htmlParse(dv, 'className', 'text', v => biography = v.innerHTML.format());
		s.htmlParse(dv, 'className', 'active-dates', v => active = (v.childNodes[0].innerText + ": " + v.childNodes[1].innerText).trim());
		s.htmlParse(div.getElementsByTagName('a'), false, false, v => {const str = v.toString(); if (str.includes("www.allmusic.com/genre") || str.includes("www.allmusic.com/style")) {tg = v.innerText.trim(); if (tg) biographyGenre.push(tg);}});
		if (active.length) active = "\r\n\r\n" + active;
		if (biographyGenre.length) biographyGenre = "\r\n\r\n" + "Genre: " + biographyGenre.join(", ");
		s.htmlParse(div.getElementsByTagName('h3'), 'className', 'headline', v => biographyAuthor = v.innerHTML.format()); if (biographyAuthor) biographyAuthor = "\r\n\r\n" + biographyAuthor;
		biography = biography + biographyGenre + active + biographyAuthor;
		biography = biography.trim();
		if (biography.length > 19) {s.buildPth(fo_bio); s.save(pth_bio, biography, true); res();}
		else {album ? update("Bio " + partial_match + " " + pth_rev) : update("Bio " + partial_match + " " + artist + " - " + title); s.trace("allmusic biography: " + artist + ": not found [search method: " + (album ? "album" : "title") + " / artist]", true);}
		} catch (e) {album ? update("Bio " + partial_match + " " + pth_rev) : update("Bio " + partial_match + " " + artist + " - " + title); s.trace("allmusic biography: " + artist + ": not found [search method: " + (album ? "album" : "title") + " / artist]", true);}
		s.doc.close();
	}

    function Dl_allmusic_rev(state_callback) {
        let alb_artist, album, art, artist = "", artistLink = "", dn_type = "", fo_bio, fo_rev, force, pth_bio, pth_rev, sw = 0; this.xmlhttp = null; this.func = null; this.ready_callback = state_callback; this.ie_timer = null;
        this.on_state_change = () => {if (this.xmlhttp != null && this.func != null) if (this.xmlhttp.readyState == 4) {clearTimeout(this.ie_timer); this.ie_timer = null; if (this.xmlhttp.status == 200) this.func(); else {s.trace("allmusic album review / biography: " + album + " / " + alb_artist + ": not found" + " Status error: " + this.xmlhttp.status, true);}}}

        this.Search = (p_sw, URL, p_album, p_alb_artist, p_artist, p_dn_type, p_fo_rev, p_pth_rev, p_fo_bio, p_pth_bio, p_art, p_force) => {
            sw = p_sw; if (!sw) {dn_type = p_dn_type; fo_rev = p_fo_rev; pth_rev = p_pth_rev; fo_bio = p_fo_bio; pth_bio = p_pth_bio; album = p_album; alb_artist = p_alb_artist; artist = p_artist; art = p_art; force = p_force;}
            this.func = null; this.xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
            this.func = this.Analyse; this.xmlhttp.open("GET", URL); this.xmlhttp.onreadystatechange = this.ready_callback; if (force) this.xmlhttp.setRequestHeader('If-Modified-Since', 'Thu, 01 Jan 1970 00:00:00 GMT');
			if (!this.ie_timer) {const a = this.xmlhttp; this.ie_timer = setTimeout(() => {a.abort(); this.ie_timer = null;}, 30000);}
			this.xmlhttp.send();
        }

        this.Analyse = () => {
            s.doc.open(); const div = s.doc.createElement('div'); let i = 0, list, str = "", tg = "";
			switch (sw) {
				case 0:
					try {div.innerHTML = this.xmlhttp.responseText;
					list = div.getElementsByTagName('h4');  let va = alb_artist.toLowerCase() == p.va || alb_artist.toLowerCase() != artist.toLowerCase(); i = match(alb_artist, album, list, 'rev');
					if (i != -1) {
						if (!va) artistLink = list[i].nextSibling.nextSibling.firstChild.getAttribute('href');
						if (dn_type == "both" || dn_type == "review") {sw = 1; s.doc.close(); return this.Search(sw, list[i].nextSibling.firstChild.getAttribute('href'));}
						else if (dn_type == "bio" && !va) {sw = 2; s.doc.close(); return this.Search(sw, artistLink + "/biography");}
					} amBio(force, art); update("Bio " + partial_match + " " + pth_rev); update("Rev " + partial_match + " " + pth_rev); s.trace("allmusic album review: " + album + " / " + alb_artist + ": not found", true);
					} catch (e) {amBio(force, art); update("Bio " + partial_match + " " + pth_rev); update("Rev " + partial_match + " " + pth_rev); s.trace("allmusic album review: " + album + " / " + alb_artist + ": not found", true);}
					s.doc.close();
					break;
				case 1:
					try {div.innerHTML = this.xmlhttp.responseText;
					const a = div.getElementsByTagName('a'), dv = div.getElementsByTagName('div');
					let rating = "x", releaseDate = "", review = "", reviewAuthor = "", reviewGenre = [], reviewMood = [], reviewTheme = [];
					s.htmlParse(dv, 'className', 'text', v => review = v.innerHTML.format());
					s.htmlParse(dv, 'className', 'release-date', v => releaseDate = (v.childNodes[0].innerText + ": " + v.childNodes[1].innerText).trim());
					s.htmlParse(a, false, false, v => {str = v.toString(); if (str.includes("www.allmusic.com/genre") || str.includes("www.allmusic.com/style")) {tg = v.innerText.trim(); if (tg) reviewGenre.push(tg);}})
					s.htmlParse(a, false, false, v => {str = v.toString(); if (str.includes("www.allmusic.com/mood")) {const tm = v.innerText.trim(); if (tm) reviewMood.push(tm);} if (str.includes("www.allmusic.com/theme")) {const tth = v.innerText.trim(); if (tth) reviewTheme.push(tth);}})
					if (releaseDate.length) releaseDate = "\r\n\r\n" + releaseDate;
					if (reviewGenre.length) reviewGenre = "\r\n\r\n" + "Genre: " + reviewGenre.join(", ");
					if (reviewMood.length) reviewMood = "\r\n\r\n" + "Album Moods: " + reviewMood.join(", ");
					if (reviewTheme.length) reviewTheme = "\r\n\r\n" + "Album Themes: " + reviewTheme.join(", ");
					s.htmlParse(div.getElementsByTagName('h3'), 'className', 'review-author headline', v => reviewAuthor = v.innerHTML.format()); if (reviewAuthor) reviewAuthor = "\r\n\r\n" + reviewAuthor;
					review = review + reviewGenre + reviewMood + reviewTheme + releaseDate + reviewAuthor;
					review = review.trim();
					s.htmlParse(div.getElementsByTagName('li'), 'id', 'microdata-rating', v => rating = v.childNodes[2].innerText / 2);
					review = ">> Album rating: " + rating + " <<  " + review;
					if (review.length > 22) {s.buildPth(fo_rev); s.save(pth_rev, review, true); res();} else {update("Rev " + partial_match + " " + pth_rev); s.trace("allmusic album review: " + album + " / " + alb_artist + ": not found", true);}
					} catch (e) {update("Rev " + partial_match + " " + pth_rev); s.trace("allmusic album review: " + album + " / " + alb_artist + ": not found", true);}
					s.doc.close();
					if (dn_type != "both") return;
					if (artistLink) {sw = 2; return this.Search(sw, artistLink + "/biography");} amBio(force, art);
					break;
				case 2:
					s.doc.close();
					processAmBio(this.xmlhttp.responseText, artist, album, "", fo_bio, pth_bio, pth_rev);
					break;
			}
        }
    }

    function Dl_lastfm_bio(state_callback) {
        const popAlbums = [], scrobbles = ["", ""]; let artist, con = "", counts = ["", ""], fo_bio, itemDate = "", itemName = ["", ""], itemValue = ["", ""], pop = "", pth_bio, retry = false, searchBio = 0, simArtists = [], tags = [], topAlbums = []; this.xmlhttp = null; this.func = null; this.ready_callback = state_callback; this.ie_timer = null;
        const r1 = ["Popular this week", "Beliebt diese Woche", "Popular esta semana", "Populaire cette semaine", "Popolare questa settimana", "今週の人気音楽", "Popularne w tym tygodniu", "Mais ouvida na semana", "Популярно на этой неделе", "Populärt denna vecka", "Bu hafta popüler olanlar", "本周热门"];
        const r2 = ["Popular Now", "Beliebt Jetzt", "Popular Ahora", "Populaire Maintenant", "Popolare Ora", "今人気", "Popularne Teraz", "Popular Agora", "Популярные сейчас", "Populär Nu", "Şimdi Popüler", "热门 现在"];
        this.on_state_change = () => {if (this.xmlhttp != null && this.func != null) if (this.xmlhttp.readyState == 4) {clearTimeout(this.ie_timer); this.ie_timer = null; if (this.xmlhttp.status == 200) this.func(); else {if (searchBio < 2 || searchBio == 2 && itemValue[0]) {searchBio++; this.Search(artist, fo_bio, pth_bio);} if (searchBio == 3) this.func(true);}}}

        this.Search = (p_artist, p_fo_bio, p_pth_bio, force) => {
            artist = p_artist; fo_bio = p_fo_bio; pth_bio = p_pth_bio;
            this.func = null; this.xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
            const URL = searchBio == 3 ? "https://" + lfm_server + "/music/" + encodeURIComponent(artist) + "/" + encodeURIComponent(itemValue[0]) : searchBio == 2 ? "https://www.last.fm/music/" + encodeURIComponent(artist) + "/+albums" : "https://" + (!retry ? lfm_server : "www.last.fm") + "/music/" + encodeURIComponent(artist) + (searchBio ? "/+wiki" : "");
            this.func = this.Analyse; this.xmlhttp.open("GET", URL); this.xmlhttp.onreadystatechange = this.ready_callback; if (force) this.xmlhttp.setRequestHeader('If-Modified-Since', 'Thu, 01 Jan 1970 00:00:00 GMT');
			if (!this.ie_timer) {const a = this.xmlhttp; this.ie_timer = setTimeout(() => {a.abort(); this.ie_timer = null;}, 30000);}
			this.xmlhttp.send();
        }

        this.Analyse = saveOnly => {
			if (!saveOnly) {
				s.doc.open(); const div = s.doc.createElement('div'); div.innerHTML = this.xmlhttp.responseText;
				let i = 0;
				switch (searchBio) {
					case 0:
						const h3 = div.getElementsByTagName('h3'), h4 = div.getElementsByTagName('h4'); let j = 0;
						s.htmlParse(div.getElementsByTagName('li'), 'className', 'tag', v => tags.push(v.innerText.trim().titlecase().replace(/\bAor\b/g, "AOR").replace(/\bDj\b/g, "DJ").replace(/\bFc\b/g, "FC").replace(/\bIdm\b/g, "IDM").replace(/\bNwobhm\b/g, "NWOBHM").replace(/\bR&b\b/g, "R&B").replace(/\bRnb\b/g, "RnB").replace(/\bUsa\b/g, "USA").replace(/\bUs\b/g, "US").replace(/\bUk\b/g, "UK")));
						s.htmlParse(h4, 'className', 'artist-header-featured-items-item-header', v => {itemName[j] = v.innerText.trim(); j++;}); j = 0;
						s.htmlParse(h3, 'className', 'artist-header-featured-items-item-name', v => {itemValue[j] = v.innerText.trim(); j++;}); j = 0;
						s.htmlParse(div.getElementsByTagName('p'), 'className', 'artist-header-featured-items-item-aux-text artist-header-featured-items-item-date', v => {itemDate = v.innerText.trim(); return true;});
						s.htmlParse(h3, 'className', 'catalogue-overview-similar-artists-full-width-item-name', v => {simArtists.push(v.innerText.trim().titlecase())});
						s.htmlParse(h4, 'className', 'header-metadata-tnew-title', v => {scrobbles[j] = v.innerText.trim().titlecase(); j++;}); j = 0;
						s.htmlParse(div.getElementsByTagName('abbr'), 'className', 'intabbr js-abbreviated-counter', v => {counts[j] = v.innerText.trim().titlecase(); j++;});
						if (tags.length) tags = "\r\n\r\n" + "Top Tags: " + tags.join(", "); else tags = "";
						if (itemValue[1].length) {
							r1.forEach((v, i) => itemName[1] = itemName[1].replace(RegExp(v, "i"), r2[i]));
							pop = "\r\n\r\n" + itemName[1] + ": " + itemValue[1];
						}
						if (itemValue[0].length) {
							pop += "; " + itemName[0].titlecase() + ": " + itemValue[0];
						}
						if (simArtists.length) simArtists = "\r\n\r\n" + similar[p.lfmLang_ix] + simArtists.join(", "); else simArtists = ""; s.doc.close();
						searchBio = 1; 
						return this.Search(artist, fo_bio, pth_bio);
					case 1:
						let factbox = ""; con = "";
						s.htmlParse(div.getElementsByTagName('div'), 'className', 'wiki-content', v => {con = v.innerHTML.format(); return true;});
						s.htmlParse(div.getElementsByTagName('li'), 'className', 'factbox-item', v => {factbox = ""; factbox = v.innerHTML.replace(/<\/H4>/gi, ": ").replace(/\s*<\/LI>\s*/gi, ", ").replace(/\s*Show all members…\s*/gi, "").format().replace(/,$/, ""); if (factbox) con += ("\r\n\r\n" + factbox);});
						s.doc.close();
						if (!retry) {searchBio = 2; return this.Search(artist, fo_bio, pth_bio);}
						break;
					case 2:
						i = 0;
						s.htmlParse(div.getElementsByTagName('h3'), 'className', 'resource-list--release-list-item-name', v => {i < 4 ? popAlbums.push(v.innerText.trim().titlecase()) : topAlbums.push(v.innerText.trim().titlecase()); i++; if (i == 10) return true;});
						s.doc.close();
						if (popAlbums.length) {
							const mapAlbums = topAlbums.map(v => v.cut()), match = mapAlbums.includes(popAlbums[0].cut());
							if (topAlbums.length > 5 && !match) topAlbums.splice(5, 0, popAlbums[0]); else topAlbums = topAlbums.concat(popAlbums);
						}
						topAlbums = [...new Set(topAlbums)];
						topAlbums.length = Math.min(6, topAlbums.length);
						if (topAlbums.length) topAlbums = "\r\n\r\n" + topAlb[p.lfmLang_ix] + topAlbums.join(", "); else topAlbums = "";
						if (itemValue[0]) {searchBio = 3; return this.Search(artist, fo_bio, pth_bio);}
						break;
					case 3:
						s.htmlParse(div.getElementsByTagName('dd'), 'className', 'catalogue-metadata-description', v => {itemValue[2] = v.innerText.trim().split(',')[0]; return true});
						s.doc.close();
						if (typeof itemValue[2] !== 'undefined') {
							if (itemValue[0].length) {
								const item = itemDate.length && itemValue[2].length && itemDate.length != itemValue[2].length ? " (" + itemDate + " - " + itemValue[2] + ")" : itemValue[2].length ? " (" + itemValue[2] + ")" : itemDate.length ? " (" + itemDate + ")" : "";
								if (item) pop += item;
							}
						}
						break;
				}
			}
            if ((!con.length || con.length < 45 && noWiki(con)) && serverFallback && !retry) {retry = true; searchBio = 1; return this.Search(artist, fo_bio, pth_bio);}
            if (con.length < 45 && noWiki(con)) con = "";
			con += tags; con += topAlbums; con += pop; con += simArtists; if (scrobbles[1].length && counts[1].length || scrobbles[0].length && counts[0].length) con += ("\r\n\r\nLast.fm: " + (counts[1].length ? scrobbles[1] + " " + counts[1] + "; " : "") + (counts[0].length ? scrobbles[0] + " " + counts[0] : "")); con = con.trim();
            if (!con.length) {s.trace("last.fm biography: " + artist +  ": not found", true); return;}
            s.buildPth(fo_bio); s.save(pth_bio, con, true); res(); p.get_multi(); window.NotifyOthers("get_multi_bio", "get_multi_bio");
        }
    }

    function Dl_art_images() {
        this.run = (dl_ar, force, art, p_stndBio, p_supCache) => {
            if (!s.file(fb.ProfilePath + "yttm\\foo_lastfm_img.vbs")) return;
            let img_folder = p_stndBio ? p.cleanPth(p.pth.imgArt, art.focus, 'server') : p.cleanPth(p.mul.imgArt, art.focus, 'mul', dl_ar, "", 1);
			if (p_supCache && !s.folder(img_folder)) img_folder = p.cleanPth(p.sup.imgArt, art.focus, 'mul', dl_ar, "", 1);
            const getNo = img_exp(dl_ar, img_folder, !force ? exp : 0); if (!getNo[0]) return; const lfm_art = new Lfm_art_img(() => lfm_art.on_state_change()); lfm_art.Search(dl_ar, img_folder, getNo[0], getNo[1], getNo[2], getNo[3], force);
        }
    }

    function Lfm_art_img(state_callback) {
        let allFiles, autoAdd, dl_ar, getNo, imgExisting, img_folder, retry = false; this.xmlhttp = null; this.func = null; this.ready_callback = state_callback; this.ie_timer = null;
        this.on_state_change = () => {if (this.xmlhttp != null && this.func != null) if (this.xmlhttp.readyState == 4) {clearTimeout(this.ie_timer); this.ie_timer = null; if (this.xmlhttp.status == 200) this.func(); else {s.trace("last.fm artist images: " + dl_ar + ": none found" + " Status error: " + this.xmlhttp.status, true);}}}

        this.Search = (p_dl_ar, p_img_folder, p_getNo, p_autoAdd, p_allFiles, p_imgExisting, force) => {
            dl_ar = p_dl_ar; img_folder = p_img_folder; getNo = p_getNo; autoAdd = p_autoAdd; allFiles = p_allFiles; imgExisting = p_imgExisting;
            this.func = null; this.xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
            const URL = "https://" + (!retry ? lfm_server : "www.last.fm") + "/music/" + encodeURIComponent(dl_ar) + "/+images";
            this.func = this.Analyse; this.xmlhttp.open("GET", URL); this.xmlhttp.onreadystatechange = this.ready_callback; if (force) this.xmlhttp.setRequestHeader('If-Modified-Since', 'Thu, 01 Jan 1970 00:00:00 GMT');
			if (!this.ie_timer) {const a = this.xmlhttp; this.ie_timer = setTimeout(() => {a.abort(); this.ie_timer = null;}, 30000);}
			this.xmlhttp.send();
        }

        this.Analyse = () => {
            const a = dl_ar.clean(); s.doc.open();
            const div = s.doc.createElement('div'); div.innerHTML = this.xmlhttp.responseText;
            const list = div.getElementsByTagName('img'); let links = []; if (!list) {if (serverFallback && !retry) {retry = true; s.doc.close(); return this.Search(dl_ar, img_folder);} s.doc.close(); return s.trace("last.fm artist images: " + dl_ar + ": none found", true);}
			s.htmlParse(list, false, false, v => {const attr = v.getAttribute("src"); if (attr.includes("avatar170s/")) links.push(attr.replace("avatar170s/", ""));});
			s.doc.close();
			const blacklist = img.blacklist(a.toLowerCase());
			links = links.filter(v => !blacklist.includes(v.substring(v.lastIndexOf("/") + 1) + ".jpg"));
            if (links.length) {
                s.buildPth(img_folder); if (s.folder(img_folder)) {
                    if (autoAdd && artLimit) {
                        let k = 0, noNewLinks = 0; for (k = 0; k < Math.min(links.length, 5); k++) {
                            const iPth = img_folder + a + "_" + links[k].substring(links[k].lastIndexOf("/") + 1) + ".jpg";
                            if (imgExisting.every(v => v.p !== iPth)) noNewLinks++; if (noNewLinks == 5) break;
                        }
                        let remove = imgExisting.length + noNewLinks - artLimit; remove = Math.min(remove, imgExisting.length); if (remove > 0) {
                            for (k = 0; k < remove; k++) imgToDelete.push({a: a, p: imgExisting[k].p}); bioCacheSave(true);
                        }
                    }
                    s.save(img_folder + "update.txt", "", true); timer.decelerating();
                    if (autoAdd) {
                        $.take(links, getNo).forEach(v => s.run("cscript //nologo \"" + fb.ProfilePath + "yttm\\foo_lastfm_img.vbs\" \"" + v + "\" \"" + img_folder + a + "_" + v.substring(v.lastIndexOf("/") + 1) + ".jpg" + "\"", 0));
                    } else {
                        let c = 0;
                        $.take(links, imgNo).some(v => {
                            const imPth = img_folder + a + "_" + v.substring(v.lastIndexOf("/") + 1) + ".jpg";
                            if (!allFiles.includes(imPth)) {
                                s.run("cscript //nologo \"" + fb.ProfilePath + "yttm\\foo_lastfm_img.vbs\" \"" + v + "\" \"" + imPth + "\"", 0); c++;
                                return c == getNo;
                            }
                        });
                    }
                }
            }
        }
    }

    function Lfm_album(state_callback) {
        const scrobbles = ["", "", ""];
        let alb_artist, albm, album, con = "", counts = ["", "", ""], fo, getStats = true, pth, rd = "", rd_n = "", retry = false, rev, rev_img, score = "", score_n = "", stats = "", tags = [], tr = "", URL = ""; this.xmlhttp = null; this.func = null; this.ready_callback = state_callback; this.ie_timer = null;
        this.on_state_change = () => {if (this.xmlhttp != null && this.func != null) if (this.xmlhttp.readyState == 4) {clearTimeout(this.ie_timer); this.ie_timer = null; if (this.xmlhttp.status == 200) this.func(); else {s.trace("last.fm album " + (rev ? "review: " :"cover: ") + album + " / " + alb_artist + ": not found" + " Status error: " + this.xmlhttp.status, true);}}}

        this.Search = (p_alb_artist, p_album, p_rev, p_fo, p_pth, p_albm, force, p_rev_img) => {
            alb_artist = p_alb_artist; album = p_album; rev = p_rev; fo = p_fo; pth = p_pth; albm = p_albm; rev_img = p_rev_img;
            if (!getStats && rev || !rev) {
                URL = url.lfm; if (rev && !def_server_EN && !retry) URL += "&lang=" + p.lfmLang;
                URL += "&method=album.getInfo&artist=" + encodeURIComponent(alb_artist) + "&album=" + encodeURIComponent(rev || retry ? album : albm) + "&autocorrect=" + auto_corr;
            } else URL = "https://" + lfm_server + "/music/" + encodeURIComponent(alb_artist) + "/" + encodeURIComponent(album);
            this.func = null; this.xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
            this.func = this.Analyse; this.xmlhttp.open("GET", URL); this.xmlhttp.onreadystatechange = this.ready_callback;
            if (!getStats && rev || !rev) this.xmlhttp.setRequestHeader('User-Agent', "foobar2000_script"); if (force) this.xmlhttp.setRequestHeader('If-Modified-Since', 'Thu, 01 Jan 1970 00:00:00 GMT');
			if (!this.ie_timer) {const a = this.xmlhttp; this.ie_timer = setTimeout(() => {a.abort(); this.ie_timer = null;}, 30000);}
			this.xmlhttp.send();
        }

        this.Analyse = () => {
            if (!getStats && rev) {
                let wiki = s.jsonParse(this.xmlhttp.responseText, false, 'get', 'album.wiki.content', 'name\":');
                if (!wiki) {if (serverFallback && !retry) {retry = true; return this.Search(alb_artist, album, rev, fo, pth);} if (!stats.length) return s.trace("last.fm album review: " + album + " / " + alb_artist + ": not found", true);}
                else {wiki = wiki.replace(/<[^>]+>/ig,""); const f = wiki.indexOf(" Read more on Last.fm"); if (f != -1) wiki = wiki.slice(0, f); wiki = wiki.replace(/\n/g, "\r\n").replace(/(\r\n)(\r\n)+/g, "\r\n\r\n").trim();}
                wiki = wiki ? wiki + tags + stats : tags + stats; wiki = wiki.trim(); s.buildPth(fo); s.save(pth, wiki, true); res();
            } else if (rev) {
                s.doc.open(); const div = s.doc.createElement('div'); div.innerHTML = this.xmlhttp.responseText; let j = 0;
                s.htmlParse(div.getElementsByTagName('li'), 'className', 'tag', v => tags.push(v.innerText.trim().titlecase().replace(/\bAor\b/g, "AOR").replace(/\bDj\b/g, "DJ").replace(/\bFc\b/g, "FC").replace(/\bIdm\b/g, "IDM").replace(/\bNwobhm\b/g, "NWOBHM").replace(/\bR&b\b/g, "R&B").replace(/\bRnb\b/g, "RnB").replace(/\bUsa\b/g, "USA").replace(/\bUs\b/g, "US").replace(/\bUk\b/g, "UK")));
				s.htmlParse(div.getElementsByTagName('dt'), 'className', 'catalogue-metadata-heading', v => {if (j) {rd_n = v.innerText.trim().titlecase(); return true;} j++;}); j = 0;
				s.htmlParse(div.getElementsByTagName('dd'), 'className', 'catalogue-metadata-description', v => {if (!j) tr = v.innerText.trim().replace(/\b1 tracks/, "1 track").split(',')[0]; else {rd = v.innerText.trim(); return true;} j++;}); j = 0;
				s.htmlParse(div.getElementsByTagName('h4'), 'className', 'header-metadata-tnew-title', v => {scrobbles[j] = v.innerText.trim().titlecase(); j++}); j = 0;
				s.htmlParse(div.getElementsByTagName('abbr'), 'className', 'intabbr js-abbreviated-counter', v => {counts[j] = v.innerText.trim().titlecase(); j++});
                s.doc.close();
                if (tags.length) {tags = [...new Set(tags)]; tags.length = Math.min(5, tags.length); tags = "\r\n\r\n" + "Top Tags: " + tags.join(", ");} else tags = "";
                if (rd_n && rd && (/\d\d\d\d/).test(rd)) stats += ("\r\n\r\n" + rd_n + ": " + rd + (tr ? " | " + tr : ""));
				if (scrobbles[1].length && counts[1].length || scrobbles[0].length && counts[0].length) stats += ("\r\n\r\nLast.fm: " + (counts[1].length ? scrobbles[1] + " " + counts[1] + "; " : "") + (counts[1].length ? scrobbles[0] + " " + counts[0] : ""));
				if (scrobbles[2] && counts[2] && scrobbles[2] != scrobbles[0] && scrobbles[1] != scrobbles[0]) stats += ("\r\n\r\n" + "Rating: " + scrobbles[2] + ": " + counts[2]);
                getStats = false; return this.Search(alb_artist, album, rev, fo, pth);
            } else {
                if (!s.file(fb.ProfilePath + "yttm\\foo_lastfm_img.vbs")) return;
                const data = s.jsonParse(this.xmlhttp.responseText, false, 'get', 'album.image', 'name\":'); if (!data || data.length < 5) {update(alb_artist + " - " + (retry ? album : albm) + " " + auto_corr + " " + pth); if (!retry && name.alb_strip && album != albm) {retry = true; return this.Search(alb_artist, album, rev, fo, pth, albm);} return s.trace("last.fm album cover: " + album + " / " + alb_artist + ": not found", true);}
                let link = data[p.sup.imgRevHQ || !rev_img ? 4 : 3]["#text"];
                if (link && (p.sup.imgRevHQ || !rev_img)) {const linkSplit = link.split("/"); linkSplit.splice(linkSplit.length - 2, 1); link = linkSplit.join("/");} if (!link) {update(alb_artist + " - " + (retry ? album : albm) + " " + auto_corr + " " + pth); if (!retry && name.alb_strip && album != albm) {retry = true; return this.Search(alb_artist, album, rev, fo, pth, albm);} return s.trace("last.fm album cover: " + album + " / " + alb_artist + ": not found", true);} timer.decelerating(true);
                s.buildPth(fo); s.run("cscript //nologo \"" + fb.ProfilePath + "yttm\\foo_lastfm_img.vbs\" \"" + link + "\" \"" + pth + link.slice(-4) + "\"", 0);
            }
        }
    }

    function Lfm_track(state_callback) {
        const counts = ["", ""], scrobbles = ["", ""];
        let album = "", artist, con = "", feat = "", fo, force = false, from = "", getIDs = true, getStats = true, lfm_done = false, others = "", pth, releases = "", retry = false, src = 0, stats = "", text = {ids:{}}, track, URL = "", wiki = "";
        this.xmlhttp = null; this.func = null; this.ready_callback = state_callback; this.ie_timer = null;
        this.on_state_change = () => {if (this.xmlhttp != null && this.func != null) if (this.xmlhttp.readyState == 4) {clearTimeout(this.ie_timer); this.ie_timer = null; if (this.xmlhttp.status == 200) this.func(); else {if (getStats) {getStats = false; return this.Search(artist, track, fo, pth, force);} if (lfm_done) revSave(releases || stats.length ? false : true);}}}

        this.Search = (p_artist, p_track, p_fo, p_pth, p_force) => {
            artist = p_artist; track = p_track; fo = p_fo; pth = p_pth; force = p_force;
            if (!lfm_done) {
                if (!getStats) {
                    URL = url.lfm; if (!def_server_EN && !retry) URL += "&lang=" + p.lfmLang;
                    URL += "&method=track.getInfo&artist=" + encodeURIComponent(artist) + "&track=" + encodeURIComponent(track) + "&autocorrect=" + auto_corr;
                } else {
                    text = s.jsonParse(pth, false, 'file'); if (!text) text = {ids:{}}
                    URL = "https://" + lfm_server + "/music/" + encodeURIComponent(artist) + "/_/" + encodeURIComponent(track);
                }
            } else {
                if (text[track] && text[track].wiki && !force) {wiki = text[track].wiki; if (text[track].s) src = text[track].s; return revSave();}
                if (getIDs && (!text.ids['ids_update'] || text.ids['ids_update'] < Date.now() - exp || force)) URL = url.lfm_sf + "songs/" + encodeURIComponent(artist).replace(/%20/g, "-").toLowerCase();
                else if (text.ids[track.tidy()]) {getIDs = false; URL = url.lfm_sf + text.ids[track.tidy()];}
                else return revSave();
            }
            this.func = null; this.xmlhttp = new ActiveXObject('Microsoft.XMLHTTP');
            this.func = this.Analyse; this.xmlhttp.open("GET", URL); this.xmlhttp.onreadystatechange = this.ready_callback;
            if (!getStats && !lfm_done) this.xmlhttp.setRequestHeader('User-Agent', "foobar2000_script"); if (force) this.xmlhttp.setRequestHeader('If-Modified-Since', 'Thu, 01 Jan 1970 00:00:00 GMT');
			if (!this.ie_timer) {const a = this.xmlhttp; this.ie_timer = setTimeout(() => {a.abort(); this.ie_timer = null;}, 30000);}
			this.xmlhttp.send();
    }

        this.Analyse = () => {
            if (!lfm_done) {
                if (!getStats) {
                    wiki = s.jsonParse(this.xmlhttp.responseText, false, 'get', 'track.wiki.content', 'name\":');
                    if (wiki) {wiki = wiki.replace(/<[^>]+>/ig,""); const f = wiki.indexOf(" Read more on Last.fm"); if (f != -1) wiki = wiki.slice(0, f); wiki = wiki.replace(/\n/g, "\r\n").replace(/(\r\n)(\r\n)+/g, "\r\n\r\n").replace(/\[edit\]\s*$/i,"").trim();}
                    if (!wiki) {
                        if (serverFallback && !retry) {retry = true; return this.Search(artist, track, fo, pth, force);}
                        if (!lfm_done && (p.lfmLang == "en" || serverFallback)) {lfm_done = true;  return this.Search(artist, track, fo, pth, force);}
                        if (!releases && !stats.length) return revSave(true);
                    } else src = 1;
                    revSave();
                } else {
                    s.doc.open(); const div = s.doc.createElement('div'); div.innerHTML = this.xmlhttp.responseText; let j = 0;
					s.htmlParse(div.getElementsByTagName('h3'), 'className', 'text-18', v => {if (v.parentNode && v.parentNode.className && v.parentNode.className == 'visible-xs') {from = v.innerText.trim(); return true;}});
					s.htmlParse(div.getElementsByTagName('h4'), 'className', 'source-album-name', v => {album = v.innerText.trim(); return true;});
                    if (!p.lfmLang_ix) s.htmlParse(div.getElementsByTagName('p'), 'className', 'more-link-fullwidth', v => {feat = v.innerText.trim(); return true;});
					s.htmlParse(div.getElementsByTagName('h4'), 'className', 'header-metadata-tnew-title', v => {scrobbles[j] = v.innerText.trim().titlecase(); j++}); j = 0;
					s.htmlParse(div.getElementsByTagName('abbr'), 'className', 'intabbr js-abbreviated-counter', v => {counts[j] = v.innerText.trim().titlecase(); j++});
                    s.doc.close();
					if (from && album) releases += from + ": " + album + "."; 
					if (feat) {const featNo = feat.replace(/\D/g, ""), rel = featNo != "1" ? "releases" : "release"; feat = ` Also featured on ${featNo} other ${rel}.`; releases += feat;}
					if (scrobbles[1].length && counts[1].length || scrobbles[0].length && counts[0].length) stats += ("Last.fm: " + (counts[1].length ? scrobbles[1] + " " + counts[1] + "; " : "") + (counts[0].length ? scrobbles[0] + " " + counts[0] : ""));
                    getStats = false; return this.Search(artist, track, fo, pth, force);
                }
            } else {
                s.doc.open(); const div = s.doc.createElement('div'); div.innerHTML = this.xmlhttp.responseText;
                if (!getIDs) {
                    let j = 0; div.innerHTML = this.xmlhttp.responseText;
                    s.htmlParse(div.getElementsByTagName('div'), 'className', 'inner', v => {let tx = v.innerText; if (tx && tx.includes(" >>")) tx = tx.split(" >>")[0]; if (tx) {if (!j) wiki = tx; else wiki += "\r\n\r\n" + tx; j++;}}); wiki = wiki.trim();
                    s.doc.close();
                    if (!wiki) {if (!releases && !stats.length) return revSave(true);} else src = 2; revSave();
                } else {
                    text.ids = {}
                    s.htmlParse(div.getElementsByTagName('a'), false, false, v => {if (v.href.includes("/facts/") && !v.innerText.includes("Artistfacts")) text.ids[v.innerText.tidy()] = v.href.replace("about:/", "");});
                    text.ids['ids_update'] = Date.now();
                    s.doc.close(); getIDs = false; this.Search(artist, track, fo, pth, force);
                }
            }
        }

        const revSave = ret => {
            if (text[track] && text[track].lang == p.lfmLang) {
                if (!releases) releases = text[track].releases;
                if (!wiki && !force) {wiki = text[track].wiki; if (wiki) src = text[track].s;}
                if (!stats) stats = text[track].stats;
            }
			text[track] = {releases: releases, wiki: wiki || "", stats: stats, s: src, lang: p.lfmLang, update: Date.now()}; s.buildPth(fo); s.save(pth, JSON.stringify(text, null, 3), true); if (ret) return s.trace("last.fm track review: " + track + " / " + artist + ": not found", true); res();
        }
    }
}
timer.clear(timer.zSearch); timer.zSearch.id = setTimeout(() => {if (p.server && ppt.panelActive) {serv.fetch(false, {ix:0, focus:false}, {ix:0, focus:false}); serv.fetch(false, {ix:0, focus:true}, {ix:0, focus:true});} timer.zSearch.id = null;}, 3000);

if (!ppt.get("SYSTEM.Software Notice Checked", false)) fb.ShowPopupMessage("THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS \"AS IS\" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE AUTHORS OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.", "Biography"); ppt.set("SYSTEM.Software Notice Checked", true);
ppt.set("SYSTEM.Image Border-1 Shadow-2 Both-3", null); ppt.set("SYSTEM.Image Reflection", null);
// ================================================== // Lyrics Buttons 
// Update on_mouse_lbtn_down, on_mouse_lbtn_up, on_mouse_leave, on_mouse_move {
/*
function on_mouse_lbtn_down(x, y) {
	if(g_cursor.x!=x || g_cursor.y!=y) on_mouse_move(x,y);		
	var hover_btn = btns_manager.on_mouse("lbtn_down",x, y);
	if(!hover_btn){
		// previous code
	}
}
function on_mouse_lbtn_up(x, y) {
	var down_btn = btns_manager.on_mouse("lbtn_up",x, y);
	if(!down_btn){	
		// previous code
	}
}
function on_mouse_leave() {
	// previous code
	btns_manager.on_mouse("leave");
	g_cursor.x = 0;
    g_cursor.y = 0;	
}

function on_mouse_move(x, y, m) {
    if(x == g_cursor.x && y == g_cursor.y) return;
	g_cursor.onMouse("move", x, y, m);	  	
	// previous code
	btns_manager.on_mouse("move",x, y);
}
*/
// Modify on_size
/*
function on_size(w, h) {
	t.rp = false; p.w = w; p.h = h; if (!p.w || !p.h) return; if(!window.IsVisible) {on_size_2Call = true;return;} ui.get_font(); t.on_size(); img.on_size(); t.rp = true; img.displayed_other_panel = null;
}
*/
// Add to on_paint, at the beggining :
/*
if(on_size_2Call){ on_size(window.Width, window.Height);on_size_2Call=false;}
*/
// Add to on_paint, at the end :
/*
	btns_manager.draw(gr);
*/

// Update this.click function of panel object:
/*function Panel() {
	this.click = (x, y) => {
	if (!ppt.autoEnlarge && !this.text_trace && img.trace(x, y) && !ppt.text_only && !ppt.img_only) {
		this.mode(1);
	} else if(!ppt.autoEnlarge && ppt.img_only) {
		this.mode(0); 
		this.move(x,y,false);
	} else {
		// Previous this.click code
	}
}*/

// Remove in this.trace function of Images object if (!ppt.autoEnlarge) return true;
/* function Images() {
	this.trace = (x, y) => {
		// if (!ppt.autoEnlarge) return true;
		// previous code
	}
*/
// In this.move function of Buttons object
/*
    this.move = (x, y) => {
        //before check_scrollBtns code
        check_scrollBtns(x, y, hover_btn); if (hover_btn) hand = hover_btn.hand; if (!tb.down) {
			if(!hand && this.hand) {
				window.SetCursor(32512);
				this.hand = false;
			} else if(hover_btn){
				window.SetCursor(32649);
				this.hand = true;
			}
		}
        //after check_scrollBtns code		
*/

// Add to function on_key_down(vkey) {switch(vkey) {
// case VK_ESCAPE: if(g_uihacks.getFullscreenState()) g_uihacks.toggleFullscreen(); break; 

// Add to on_notify_data
// case "lyrics_state": lyrics_state.value = info; positionButtons(); break;

// Comment window.NotifyOthers("img_chg_bio", 0)

// For the image seekbar vertical position, create a new function 
/*
	const imgbar_metrics = (top_padding) => {
		this.bar.y2 = Math.round(this.bar.y1 + top_padding - this.bar.h / 2) - this.bar.overlapCorr;
		this.bar.y3 = this.bar.y2 + Math.ceil(ui.l_h / 2);
		this.bar.y4 = top_padding - this.bar.overlapCorr;
		this.bar.y5 = top_padding - this.bar.overlapCorr;	
	} 
*/
// Call it instead of the this.bar.yXXX definitions in const bar_metrics = (horizontal, vertical) => { with imgbar_metrics(nhh * 0.9);


// Call it in this.draw = gr => { of the Images object
// if (!ppt.text_only && cur_img) imgbar_metrics(ya+cur_img.Height-15);

// Comment some drawing in switch (ppt.imgBarDots) {} in this.draw = gr => { of the Images object 

function SimpleButtonManager(){
	this.buttons = {};
	this.cur_btn = null;
	this.cur_btn_down = null;	
	this.g_down = false;	
	this.addButton = function(name, x, y, w, h, text, tooltip_text, fonClick, fonDbleClick, N_img, H_img, state,opacity){
		this.buttons[name] = new SimpleButton(name, x, y, w, h, text, tooltip_text, fonClick, fonDbleClick, N_img, H_img, state,opacity);
	};
	this.chooseButton = function(x, y){
		for (var i in this.buttons) {
			if (this.buttons[i].containXY(x, y) && this.buttons[i].state != ButtonStates.hide) {
				this.cur_btn = this.buttons[i];
				return this.cur_btn;
			}
		}
		this.cur_btn = null;
		return this.cur_btn;		
	};
	this.draw = function(gr){
		for (var i in this.buttons) {
			this.buttons[i].draw(gr);
		}		
	}
	this.on_mouse = function(event, x, y) {
        switch(event) {
            case "move":
				var old = this.cur_btn;
				this.cur_btn = this.chooseButton(x, y);
				if (old == this.cur_btn) {
					this.cur_btn && this.cur_btn.onMouse("move", x, y);		
					if (this.g_down) return;
				} else if (this.g_down && this.cur_btn && this.cur_btn.state != ButtonStates.down) {
					this.cur_btn.onMouse("move", x, y);
					this.cur_btn.changeState(ButtonStates.down);
					return;
				} else {
					var repaint = false;
					if(old){
						old.changeState(ButtonStates.normal);
						old.onMouse("move", x, y);
						repaint = true;
					}
					if(this.cur_btn){
						this.cur_btn.changeState(ButtonStates.hover);
						this.cur_btn.onMouse("move", x, y);
						repaint = true;
					}	
					else g_tooltip.Deactivate();
					if(repaint) window.Repaint();
				}				
			break;
            case "leave":
				this.g_down = false;    
				if (this.cur_btn) {
					this.cur_btn.changeState(ButtonStates.normal);
					window.Repaint();
					this.cur_btn=null;        
				}
				g_tooltip.Deactivate();
			break;
            case "lbtn_up":
				this.g_down = false;      
				if (this.cur_btn_down != null && typeof this.cur_btn_down === 'object') {
					this.cur_btn_down.onClick();
					this.cur_btn_down.onMouse("leave", x, y);
				}
				return (this.cur_btn_down != null && typeof this.cur_btn_down === 'object');				
			break;
            case "lbtn_down":
				this.cur_btn_down = this.chooseButton(x, y);		
				if (this.cur_btn_down) {
					this.g_down = true;	
					this.cur_btn_down.changeState(ButtonStates.down);
					window.Repaint();
				}	
				return (this.cur_btn_down != null && typeof this.cur_btn_down === 'object');
			break;			
		}
	}	
}
function SimpleButton(name, x, y, w, h, text, tooltip_text, fonClick, fonDbleClick, N_img, H_img, state,opacity) {
    this.state = state ? state : ButtonStates.normal;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.name = name;	
    this.text = text;
    this.tooltip_text = tooltip_text;		
    this.fonClick = fonClick;
    this.fonDbleClick = fonDbleClick;
    this.N_img = N_img;
    this.H_img = H_img;   
	this.opacity = opacity;
	this.first_draw=true;	
	this.tooltip_activated = false;
	if (typeof opacity == "undefined") this.opacity = 255;
	else this.opacity = opacity;
	
    this.containXY = function (x, y) {
		if(this.x<0) return (window.Width+this.x-this.w <= x) && (x <= window.Width + this.x + this.w) && (this.y <= y) && (y <= this.y + this.h);
        else return (this.x <= x) && (x <= this.x + this.w) && (this.y <= y) && (y <= this.y + this.h);
    }
    this.changeState = function (state) {
        var old_state = this.state;
        this.state = state;
		if(this.state==ButtonStates.hover && this.cursor != IDC_HAND) {
			g_cursor.setCursor(IDC_HAND,this.text);
			this.cursor = IDC_HAND;
		} else if(this.cursor != IDC_ARROW && this.state!=ButtonStates.hover && this.state!=ButtonStates.down){
			g_cursor.setCursor(IDC_ARROW,11);	
			this.cursor = IDC_ARROW;
		}			
        return old_state;
    }    
    this.draw = function (gr) {
				
		if(this.first_draw && this.text!="") {
			this.w = gr.CalcTextWidth(this.text, g_font.normal)+this.N_img.Width;
		}
		this.first_draw=false;		
		
		if(this.x<0) var real_x_position = window.Width+this.x-this.w;
		else var real_x_position = this.x;		
		
        if (this.state == ButtonStates.hide || this.hide) return;
        var b_img=this.N_img;        
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
			
			gr.GdiDrawText(this.text, g_font.normal, colors.normal_txt, real_x_position+b_img.Width, this.y, this.w, this.h, DT_LEFT| DT_VCENTER | DT_CALCRECT | DT_NOPREFIX);			
		}		

    }

    this.onClick = function () {        
        this.fonClick && this.fonClick();
    }
    this.onDbleClick = function () {
        if(this.fonDbleClick) {this.fonDbleClick && this.fonDbleClick();}
    }    
    this.onMouse = function (state,x,y) {    
		switch(state){
			case 'lbtn_down':
				this.fonDown && this.fonDown();
			break;				
			case 'lbtn_up':
				this.fonUp && this.fonUp();
				if (this.containXY(x, y) && this.state != ButtonStates.hide && !this.hide){
					this.changeState(ButtonStates.hover);
				}
			break;
			case 'dble_click':
				if(this.fonDbleClick) {this.fonDbleClick && this.fonDbleClick();}
				else this.onMouse('lbtn_up',x,y);
			break;
			case 'leave':
				if(this.tooltip_activated){
					this.tooltip_activated = false;
					g_tooltip.Deactivate();
				}
			break;			
			case 'move':
				if(this.text=='' && this.tooltip_text!='' && g_tooltip.activeZone != this.name){
					var tooltip_text = this.tooltip_text;
					g_tooltip.ActivateDelay(tooltip_text, x+10, y+20, globalProperties.tooltip_button_delay, 1200, false, this.name);
					this.tooltip_activated = true;
				} else if(this.tooltip_activated && this.state!=ButtonStates.hover && g_tooltip.activeZone == this.name){
					this.tooltip_activated = false;
					g_tooltip.Deactivate();
				}
			break;					
		}
    }  	
}
var on_size_2Call = false;
var lyrics_off_icon = gdi.Image(theme_img_path + "\\icons\\nowplaying_off.png");   
var lyrics_off_hover_icon = gdi.Image(theme_img_path + "\\icons\\nowplaying_off_hover.png");  
var lyrics_on_icon = gdi.Image(theme_img_path + "\\icons\\nowplaying_on.png"); 
var lyrics_on_hover_icon = gdi.Image(theme_img_path + "\\icons\\nowplaying_on_hover.png"); 	
var lyrics_off_icon_white = gdi.Image(theme_img_path + "\\icons\\white\\nowplaying_off.png");   
var lyrics_off_hover_icon_white = gdi.Image(theme_img_path + "\\icons\\white\\nowplaying_off_hover.png");  
var lyrics_on_icon_white = gdi.Image(theme_img_path + "\\icons\\white\\nowplaying_on.png"); 
var lyrics_on_hover_icon_white = gdi.Image(theme_img_path + "\\icons\\white\\nowplaying_on_hover.png"); 	
var lyrics_off_icon_white = gdi.Image(theme_img_path + "\\icons\\white\\nowplaying_off.png");  
var g_cursor = new oCursor();
var g_tooltip = new oTooltip();
var btns_manager = new SimpleButtonManager();
btns_manager.addButton("lyricsReduce",-20, 8, 15, lyrics_off_icon.Height, "Reduce Lyrics", "Reduce Lyrics width", function () {
		lyrics_state.decrement(1);
		positionButtons();
		g_tooltip.Deactivate();
		window.Repaint();		
    },false,lyrics_off_icon,lyrics_off_hover_icon,ButtonStates.normal,255);
btns_manager.addButton("lyricsIncrease",-45, 8, 15, lyrics_off_icon.Height, "Extend Lyrics", "Extend Lyrics width", function () {
		lyrics_state.increment(1);
		positionButtons();
		g_tooltip.Deactivate();
		window.Repaint();		
    },false,lyrics_on_icon,lyrics_on_hover_icon,ButtonStates.normal,255);	
	
function positionButtons(){
	btns_manager.buttons.lyricsReduce.first_draw = true;
	if(ppt.blurDark){
		btns_manager.buttons.lyricsReduce.N_img = lyrics_on_icon_white;
		btns_manager.buttons.lyricsReduce.H_img = lyrics_on_hover_icon_white;
		btns_manager.buttons.lyricsReduce.text = "";
		
		btns_manager.buttons.lyricsIncrease.N_img = lyrics_off_icon_white;
		btns_manager.buttons.lyricsIncrease.H_img = lyrics_off_hover_icon_white;
		btns_manager.buttons.lyricsIncrease.text = "";			
	} else {
		btns_manager.buttons.lyricsReduce.N_img = lyrics_on_icon;
		btns_manager.buttons.lyricsReduce.H_img = lyrics_on_hover_icon;
		btns_manager.buttons.lyricsReduce.text = "";
		
		btns_manager.buttons.lyricsIncrease.N_img = lyrics_off_icon;
		btns_manager.buttons.lyricsIncrease.H_img = lyrics_off_hover_icon;
		btns_manager.buttons.lyricsIncrease.text = "";				
	}
	if(lyrics_state.isMaximumValue()) {	
		btns_manager.buttons.lyricsIncrease.hide = true;	
		btns_manager.buttons.lyricsReduce.hide = false;			
	} else if(lyrics_state.isMinimumValue()) {
		btns_manager.buttons.lyricsIncrease.text = "Lyrics";
		btns_manager.buttons.lyricsIncrease.first_draw=true;
		btns_manager.buttons.lyricsIncrease.x = -20;		
		btns_manager.buttons.lyricsReduce.hide = true;
		btns_manager.buttons.lyricsIncrease.hide = false;		
	} else {
		btns_manager.buttons.lyricsReduce.hide = false;		
		btns_manager.buttons.lyricsIncrease.hide = false;	
		btns_manager.buttons.lyricsIncrease.w = 15;
		btns_manager.buttons.lyricsIncrease.x = -45;		
	}
}

var colors = {};
function get_colors() {
	if(ppt.blurDark){	
		colors.bg = GetGrey(40);			
		colors.faded_txt = GetGrey(245);
		colors.normal_txt = GetGrey(245);	
	} else {	
		colors.bg = GetGrey(40);				
		colors.faded_txt = GetGrey(100);
		colors.normal_txt = GetGrey(245);		
	}	
};
properties = {
	panelName: 'WSHartist_bio',
    globalFontAdjustement: window.GetProperty("MAINPANEL: Global Font Adjustement", 0),
	panelFontAdjustement: window.GetProperty("MAINPANEL: Panel font Adjustement", 0),		
}
positionButtons();
get_colors();
get_font();
