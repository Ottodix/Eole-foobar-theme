'use strict';

class Tagger {
	constructor() {
		this.arr1 = [];
		this.arr2 = [];
		this.simList = [];
		this.setGenres();

		this.score = { // excel generated values for full precision
			artist: {
				pc: {
					baseLog: 1 / Math.log(2.1197528928493),
					scale: 257550.499880261,
					threshold: 545943.417175967
				},
				lis: {
					baseLog: 1 / Math.log(1.54156558875185),
					scale: 74462.4243948203,
					threshold: 114788.711102091
				}
			},
			album: {
				pc: {
					baseLog: 1 / Math.log(2.325),
					scale: 16307.4298580876,
					threshold: 37914.7744200536
				},
				lis: {
					baseLog: 1 / Math.log(2.0205),
					scale: 2680.06783221579,
					threshold: 5415.07705499201
				}
			}
		}
	}

	// Methods
	
	setGenres() {
		// edit this.genres on next line to use a different default whitelist for last.fm genres
		this.genres = ['2 tone', '2-step', 'acid house', 'acid jazz', 'acid rock', 'acid techno', 'acid trance', 'acoustic blues', 'acoustic rock', 'afox\u00ea', 'african blues', 'afrobeat', 'aggrotech', 'alternative country', 'alternative dance', 'alternative folk', 'alternative hip hop', 'alternative metal', 'alternative pop', 'alternative punk', 'alternative rock', 'ambient', 'ambient dub', 'ambient house', 'ambient pop', 'ambient techno', 'ambient trance', 'american primitive guitar', 'americana', 'anarcho-punk', 'anatolian rock', 'andalusian classical', 'anti-folk', 'aor', 'appalachian folk', 'arena rock', 'ars antiqua', 'ars nova', 'ars subtilior', 'art pop', 'art punk', 'art rock', 'atmospheric black metal', 'audiobook', 'avant-garde', 'avant-garde jazz', 'avant-garde metal', 'avant-garde pop', 'avant-prog', 'ax\u00e9', 'bachata', 'bai\u00e3o', 'balearic beat', 'ballad', 'baltimore club', 'barbershop', 'bardcore', 'baroque', 'baroque pop', 'bass house', 'bassline', 'battle rap', 'batucada', 'beat music', 'bebop', 'benga', 'berlin school', 'bhangra', 'big band', 'big beat', 'black metal', 'blackened death metal', 'blackgaze', 'bleep techno', 'blue-eyed soul', 'bluegrass', 'bluegrass gospel', 'blues', 'blues rock', 'bolero', 'bolero son', 'bongo flava', 'boogie rock', 'boogie-woogie', 'boom bap', 'bossa nova', 'bounce', 'breakbeat', 'breakbeat hardcore', 'breakcore', 'breaks', 'brega', 'brega funk', 'brill building', 'brit funk', 'britcore', 'britpop', 'broken beat', 'brostep', 'brutal death metal', 'bubblegum bass', 'bubblegum pop', 'cabaret', 'cajun', 'calypso', 'canci\u00f3n mel\u00f3dica', 'candombe', 'canterbury scene', 'cantopop', 'canzone napoletana', 'cape jazz', 'carimb\u00f3', 'carnatic classical', 'celtic', 'celtic punk', 'chacarera', 'chachach\u00e1', 'chalga', 'chamam\u00e9', 'chamber pop', 'champeta', 'chang\u00fc\u00ed', 'chanson \u00e0 texte', 'chanson fran\u00e7aise', 'chicago blues', 'chicano rap', 'chillout', 'chillstep', 'chillwave', 'chimurenga', 'chiptune', 'chopped and screwed', 'choro', 'christian metal', 'christian rock', 'christmas music', 'chutney', 'city pop', 'classic blues', 'classic country', 'classic jazz', 'classic rock', 'classical', 'classical crossover', 'cloud rap', 'club', 'coco', 'coldwave', 'comedy', 'comedy hip hop', 'comedy rock', 'compas', 'complextro', 'conscious hip hop', 'contemporary christian', 'contemporary classical', 'contemporary folk', 'contemporary gospel', 'contemporary jazz', 'contemporary r&b', 'contra', 'cool jazz', 'copla', 'corrido', 'country', 'country blues', 'country boogie', 'country folk', 'country pop', 'country rap', 'country rock', 'country soul', 'coup\u00e9-d\u00e9cal\u00e9', 'cowpunk', 'crossover jazz', 'crossover prog', 'crossover thrash', 'crunk', 'crust punk', 'cumbia', 'cumbia villera', 'cupl\u00e9', 'cyber metal', 'cybergrind', 'cyberpunk', 'd-beat', 'dance', 'dance-pop', 'dance-punk', 'dance-rock', 'dancehall', 'dangdut', 'dansband', 'danz\u00f3n', 'dark ambient', 'dark cabaret', 'dark electro', 'dark folk', 'dark jazz', 'dark psytrance', 'dark wave', 'darkstep', 'darksynth', "death 'n' roll", 'death industrial', 'death metal', 'death-doom metal', 'deathcore', 'deathgrind', 'deathrock', 'deathstep', 'deconstructed club', 'deep funk', 'deep house', 'delta blues', 'denpa', 'depressive black metal', 'descarga', 'desert blues', 'desert rock', 'detroit techno', 'dhrupad', 'digital hardcore', 'disco', 'disco polo', 'dixieland', 'djent', 'doo-wop', 'doom metal', 'doomcore', 'downtempo', 'dream pop', 'dreampunk', 'drill', 'drill and bass', 'drone', 'drone metal', 'drum and bass', 'dub', 'dub poetry', 'dub techno', 'dubstep', 'dungeon synth', 'east coast hip hop', 'easycore', 'ebm', 'edm', 'electric blues', 'electro', 'electro house', 'electro swing', 'electro-funk', 'electro-industrial', 'electroclash', 'electronic', 'electronic rock', 'electronica', 'electronicore', 'electropop', 'electropunk', 'electrotango', 'emo', 'emo pop', 'emo rap', 'emocore', 'enka', '\u00e9ntekhno', 'ethereal wave', 'euro house', 'euro-disco', 'eurobeat', 'eurodance', 'europop', 'exotica', 'experimental', 'experimental hip hop', 'experimental rock', 'extratone', 'fado', 'fidget house', 'filk', 'finnish tango', 'flamenco', 'flamenco jazz', 'folk', 'folk metal', 'folk pop', 'folk punk', 'folk rock', 'folktronica', 'footwork', 'forr\u00f3', 'forr\u00f3 eletr\u00f4nico', 'forr\u00f3 universit\u00e1rio', 'freak folk', 'freakbeat', 'free folk', 'free improvisation', 'free jazz', 'french house', 'frevo', 'fuji', 'funan\u00e1', 'funeral doom metal', 'funk', 'funk carioca', 'funk metal', 'funk rock', 'funk soul', 'funktronica', 'funky house', 'fusion', 'future bass', 'future funk', 'future garage', 'future house', 'future jazz', 'futurepop', 'g-funk', 'gabber', 'gagaku', 'gangsta rap', 'garage house', 'garage punk', 'garage rock', 'ghazal', 'ghetto house', 'ghettotech', 'glam', 'glam metal', 'glam punk', 'glam rock', 'glitch', 'glitch hop', 'glitch pop', 'go-go', 'goa trance', 'goregrind', 'gospel', 'gothic', 'gothic country', 'gothic metal', 'gothic rock', 'grebo', 'gregorian chant', 'grime', 'grindcore', 'groove metal', 'group sounds', 'grunge', 'guaguanc\u00f3', 'guajira', 'guaracha', 'gypsy jazz', 'gypsy punk', 'happy hardcore', 'hard bop', 'hard house', 'hard rock', 'hard trance', 'hardbass', 'hardcore hip hop', 'hardcore punk', 'hardcore techno', 'hardstyle', 'hardvapour', 'harsh noise', 'harsh noise wall', 'hauntology', 'heartland rock', 'heavy metal', 'heavy psych', 'heavy rock', 'hi-nrg', 'highlife', 'hindustani classical', 'hip hop', 'hip house', 'hiplife', 'honky tonk', 'hopepunk', 'horror punk', 'horrorcore', 'house', 'hyperpop', 'hyphy', 'idm', 'illbient', 'indian pop', 'indie', 'indie folk', 'indie pop', 'indie rock', 'indietronica', 'indorock', 'industrial', 'industrial hardcore', 'industrial hip hop', 'industrial metal', 'industrial musical', 'industrial rock', 'industrial techno', 'instrumental', 'instrumental jazz', 'instrumental rock', 'irish folk', 'italo dance', 'italo-disco', 'j-core', 'j-pop', 'j-rock', 'jaipongan', 'jazz', 'jazz blues', 'jazz fusion', 'jazz rap', 'jazz rock', 'jazz-funk', 'joik', 'j\u00f9j\u00fa', 'juke', 'jump blues', 'jump up', 'jungle', 'jungle terror', 'k-pop', 'kabarett', 'kaseko', 'kas\u00e9k\u00f2', 'kawaii future bass', 'kawaii metal', 'kay\u014dkyoku', 'keroncong', 'khyal', 'kizomba', 'kleinkunst', 'klezmer', 'krautrock', 'kuduro', 'kwaito', 'latin', 'latin ballad', 'latin jazz', 'latin pop', 'latin rock', 'latin soul', 'leftfield', 'levenslied', 'line dance', 'liquid funk', 'lo-fi', 'lo-fi hip hop', 'lolicore', 'louisiana blues', 'lounge', 'lovers rock', 'lowercase', 'luk krung', 'luk thung', 'madchester', 'mainstream rock', 'makossa', 'maloya', 'mambo', 'mandopop', 'mangue beat', 'manila sound', 'march', 'marchinha', 'mariachi', 'marrabenta', 'martial industrial', 'maskanda', 'math rock', 'mathcore', 'mbalax', 'mbaqanga', 'mbube', 'medieval', 'melodic black metal', 'melodic death metal', 'melodic dubstep', 'melodic hardcore', 'melodic metalcore', 'melodic rock', 'melodic trance', 'mento', 'merengue', 'metal', 'metalcore', 'miami bass', 'microhouse', 'microsound', 'milonga', "min'y\u014d", 'mincecore', 'minimal', 'minimal drum and bass', 'minimal techno', 'minimal wave', 'mod', 'modal jazz', 'modern blues', 'modern classical', 'modern country', 'mood kay\u014d', 'moombahcore', 'moombahton', 'mor lam', 'morna', 'motown', 'mpb', 'musical', 'musique concr\u00e8te', 'nashville sound', 'nature sounds', 'nederpop', 'neo soul', 'neo-progressive rock', 'neo-psychedelia', 'neo-rockabilly', 'neo-traditional country', 'neoclassical dark wave', 'neoclassical metal', 'neoclassicism', 'neofolk', 'nerdcore', 'neue deutsche h\u00e4rte', 'neue deutsche welle', 'neurofunk', 'neurohop', 'new age', 'new beat', 'new jack swing', 'new romantic', 'new wave', 'nightcore', 'no wave', 'noise', 'noise pop', 'noise rock', 'noisecore', 'non-music', 'norte\u00f1o', 'northern soul', 'nova can\u00e7\u00f3', 'nu disco', 'nu jazz', 'nu metal', 'nu skool breaks', 'nueva canci\u00f3n', 'nueva trova', 'nuevo flamenco', 'nuevo tango', 'ny\u016b my\u016bjikku', 'occult rock', 'oi', 'old school death metal', 'old-time', 'onkyo', 'opera', 'operatic pop', 'orchestral', 'orchestral jazz', 'outlaw country', 'p-funk', 'pachanga', 'pagod\u00e3o', 'pagode', 'pagode rom\u00e2ntico', 'paisley underground', 'palm-wine', 'parang', 'partido alto', 'pasodoble', 'philly soul', 'phleng phuea chiwit', 'phonk', 'piedmont blues', 'plena', 'plunderphonics', 'political hip hop', 'polka', 'pop', 'pop metal', 'pop punk', 'pop rap', 'pop rock', 'pop soul', 'pornogrind', 'porro', 'post-bop', 'post-classical', 'post-grunge', 'post-hardcore', 'post-metal', 'post-minimalism', 'post-punk', 'post-rock', 'power electronics', 'power metal', 'power noise', 'power pop', 'powerviolence', 'production music', 'progressive', 'progressive bluegrass', 'progressive country', 'progressive folk', 'progressive house', 'progressive metal', 'progressive pop', 'progressive rock', 'progressive trance', 'psybient', 'psychedelic', 'psychedelic folk', 'psychedelic pop', 'psychedelic rock', 'psychobilly', 'psytrance', 'pub rock', 'punk', 'punk blues', 'punk rap', 'punk rock', 'qawwali', 'queercore', 'quiet storm', 'r&b', 'ragga', 'ragga hip-hop', 'ragga jungle', 'ragtime', 'ra\u00ef', 'ranchera', 'rap metal', 'rap rock', 'rapcore', 'rautalanka', 'rave', 'rebetiko', 'red dirt', 'red song', 'reggae', 'reggaeton', 'rhythmic noise', 'ritual ambient', 'rock', 'rock and roll', 'rock opera', 'rockabilly', 'rocksteady', 'romantic classical', 'roots reggae', 'roots rock', 'rumba', 'runo song', 'ry\u016bk\u014dka', 'salegy', 'salsa', 'samba', 'samba-can\u00e7\u00e3o', 'samba-choro', 'samba-exalta\u00e7\u00e3o', 'samba-reggae', 'samba-rock', 'sasscore', 'schlager', 'schranz', 'screamo', 'sea shanty', 's\u00e9ga', 'sertanejo', 'sertanejo raiz', 'sertanejo rom\u00e2ntico', 'sertanejo universit\u00e1rio', 'shibuya-kei', 'shoegaze', 'sierre\u00f1o', 'singer-songwriter', 'ska', 'ska punk', 'skacore', 'skate punk', 'skiffle', 'skweee', 'slow waltz', 'slowcore', 'sludge metal', 'smooth jazz', 'smooth soul', 'soca', 'soft rock', 'son cubano', 'son montuno', 'songo', 'sophisti-pop', 'soukous', 'soul', 'soul blues', 'soul jazz', 'southern gospel', 'southern metal', 'southern rock', 'southern soul', 'space age pop', 'space ambient', 'space disco', 'space rock', 'spectralism', 'speed garage', 'speed metal', 'speedcore', 'spoken word', 'steampunk', 'stoner metal', 'stoner rock', 'street punk', 'stride', 'surf rock', 'swamp pop', 'swamp rock', 'swing', 'symphonic black metal', 'symphonic metal', 'symphonic prog', 'symphonic rock', 'symphony', 'synth funk', 'synth-pop', 'synthwave', 'taarab', 'tango', 'tech house', 'tech trance', 'technical death metal', 'techno', 'techno bass', 'techno kay\u014d', 'techstep', 'tecnobrega', 'teen pop', 'tejano', 'terrorcore', 'texas blues', 'thrash metal', 'thrashcore', 'thumri', 'timba', 'tizita', 'traditional country', 'trance', 'trap', 'trap edm', 'tribal ambient', 'tribal house', 'trip hop', 'tropical house', 'tropic\u00e1lia', 'trot', 'trova', 'tsapiky', 'turbo-folk', 'turntablism', 'twee pop', 'uk drill', 'uk funky', 'uk garage', 'uk hardcore', 'underground hip hop', 'urban cowboy', 'vallenato', 'vaportrap', 'vaporwave', 'vaudeville', 'viking metal', 'visual kei', 'vocal house', 'vocal jazz', 'vocal trance', 'waltz', 'wave', 'west coast hip hop', 'west coast swing', 'western swing', 'witch house', 'wonky', 'xote', 'yacht rock', 'y\u00e9-y\u00e9', 'zamba', 'zamrock', 'zarzuela', 'zeuhl', 'zouk', 'zydeco'];

		if (cfg.customGenres.length) {
			this.customGenres = cfg.customGenres.split(',');
			this.customGenres = this.customGenres.map(v => v.trim());
			this.genres = [...new Set(this.genres.concat(this.customGenres))];
		}
		this.genresStripped = this.genres.map(v => $.strip(v));
		
		this.arr1 = [];
		this.arr2 = [];
		const items = cfg.translate.split(',');
		items.forEach(v =>{
			const w = v.split('>');
			this.arr1.push($.strip(w[0]));
			this.arr2.push(w[1] ? $.strip(w[1]) : '');
		});
	}

	check(handles) {
		if (!handles) return;
		let artist = '';
		let cur_artist = '####';
		let rec = 0;
		let writeSent = false;
		const tf_artist = FbTitleFormat(`$upper(${cfg.tf.artist})`);
		const artists = tf_artist.EvalWithMetadbs(handles);
		const similarArtists = [];
		const similarArr = [];

		for (let i = 0; i < handles.Count; i++) {
			artist = artists[i];
			if (artist != cur_artist) {
				cur_artist = artist;
				similarArtists[i] = '';
				const lfmBio = panel.cleanPth(cfg.pth.foLfmBio, handles[i], 'tag') + $.clean(artist) + cfg.suffix.foLfmBio + '.txt';
				if ($.file(lfmBio)) {
					const lBio = $.open(lfmBio);
					similarArtists[i] = this.getTag(lBio, panel.similarArtistsKey).tag
					if (similarArtists[i].length > 6) similarArr.push(artist);
				}
			}
		}

		if (similarArr.length) {
			let i = 0;
			timer.clear(timer.sim1);
			timer.sim1.id = setInterval(() => {
				if (i < similarArr.length) {
					const lfm_similar = new LfmSimilarArtists(() => lfm_similar.onStateChange(), lfm_similar_search_done.bind(this));
					lfm_similar.search(similarArr[i], similarArr.length, handles, 6);
					i++;
				} else timer.clear(timer.sim1);
			}, similarArr.length < 100 ? 20 : 300);
		} else this.write(handles);

		const lfm_similar_search_done = (res1, res2, p_done, p_handles) => {
			rec++;
			if (!timer.sim2.id) timer.sim2.id = setTimeout(() => {
				writeSent = true;
				this.write(p_handles);
				timer.sim2.id = null;
			}, 60000);
			this.simList.push({
				name: res1,
				similar: res2
			});
			if (p_done == rec && !writeSent) {
				timer.clear(timer.sim2);
				this.write(p_handles);
			}
		};
	}

	getScore(pc, lis, type) {
		const score = ['pc', 'lis'].map((v, i) => {
			const n = !i ? pc : lis;
			return n >= this.score[type][v].threshold ? (Math.log(n / this.score[type][v].scale) * this.score[type][v].baseLog) * 10 : (n * 0.9 / this.score[type][v].threshold + 0.1) * 10;
		});
		const pcScore = $.clamp(Math.floor(score[0]), 1, 105);
		const lisScore =  $.clamp(Math.floor(score[1]), 1, 105);
		return type == 'album' && lisScore > 99 ? 100 : $.clamp(Math.floor((pcScore + lisScore) / 2), 1, 100);
	}

	getTag(text, keywords, simple, listeners, type) {
		let ix = -1;
		let match = null;
		let v = '';
		match = text.match(RegExp(keywords));
		const correction = listeners || 0;

		if (match) {
			match = match[0];
			ix = text.lastIndexOf(match);
			if (ix != -1) {
				v = text.substring(ix + match.length - correction);
				v = v.split('\n')[0].trim();
				if (simple) return {
					tag: v,
					label: match,
					ix: ix
				};
				if (listeners) {
					const m1 = v.match(/\u200b\|[\d.,\s]*;/g);
					const m2 = v.match(/\u200b\|[\d.,\s]*$/gm);
					const playcount = m1 ? m1[0].replace(/\u200b\|/, '').slice(0, -1).trim() : '';
					const lis = m2 ? m2[0].replace(/\u200b\|/, '').trim() : '';
					const pcNum = parseInt(playcount.replace(/[,.\s]/g, ''));
					const lisNum = parseInt(lis.replace(/[,.\s]/g, ''));
					v = pcNum && lisNum ? ['Playcount', playcount, 'Listeners', lis, 'Score', this.getScore(pcNum, lisNum, type)] : '';
				} else {
					v = v.includes('\u200b') ? v.split(/\u200b,\s/) : v.split(/,\s/);
				}
			}
		}
		return {
			tag: v,
			label: match,
			ix: ix
		};
	}

	lfmTidy(n) {
		// return n; // uncomment to write all the original last.fm tags
		n.forEach((v, i) => {
			this.arr1.forEach((w, j) => {
				if (!w.includes('\\b')) {
					if ($.strip(v) == w) n[i] = this.arr2[j];
				} else if (RegExp(w, 'i').test(v)) {
					n[i] = this.arr2[j]; // translate: includes is supported by regex test (regex should be 1st item of pair & must contain a word boundary marker [\b] for recognition); if test is true, 2nd item of pair is returned
				}
			});
		});
		n.forEach((v, i) => {
			const j = this.genresStripped.indexOf($.strip(v));
			n[i] = j != -1 ? this.genres[j] : ''; 
		});
		n = n.filter(v => v);
		n = this.uniq(n);
		return n;
	}

	uniq(n) {
		const out = [];
		const seen = {};
		let j = 0;
		n.forEach(v => {
			const item = v.toLowerCase();
			if (seen[item] !== 1) {
				seen[item] = 1;
				out[j++] = $.titlecase(v).replace(/\bAor\b/g, 'AOR').replace(/\bDj\b/g, 'DJ').replace(/\bFc\b/g, 'FC').replace(/\bIdm\b/g, 'IDM').replace(/\bNwobhm\b/g, 'NWOBHM').replace(/\bR&b\b/g, 'R&B').replace(/\bRnb\b/g, 'RnB').replace(/\bUsa\b/g, 'USA').replace(/\bUs\b/g, 'US').replace(/\bUk\b/g, 'UK');
			}
		});
		return out;
	}

	write(handles, notify) {
		if (!handles) return;
		const kww = 'Founded In: |Born In: |Gegr\\u00fcndet: |Formado en: |Fond\\u00e9 en: |Luogo di fondazione: |\\u51fa\\u8eab\\u5730: |Za\\u0142o\\u017cono w: |Local de funda\\u00e7\\u00e3o: |\\u041c\\u0435\\u0441\\u0442\\u043e \\u043e\\u0441\\u043d\\u043e\\u0432\\u0430\\u043d\\u0438\\u044f: |Grundat \\u00e5r: |Kuruldu\\u011fu tarih: |\\u521b\\u5efa\\u4e8e: |Geboren in: |Lugar de nacimiento: |N\\u00e9\\(e\\) en: |Luogo di nascita: |\\u51fa\\u8eab\\u5730: |Urodzony w: |Local de nascimento: |\\u041c\\u0435\\u0441\\u0442\\u043e \\u0440\\u043e\\u0436\\u0434\\u0435\\u043d\\u0438\\u044f: |F\\u00f6dd: |Do\\u011fum yeri: |\\u751f\\u4e8e: ';
		const lkw = 'Last.fm: ';
		let artist = '';
		let albumArtist = '';
		let cur_artist = '####';
		let cur_albumArtist = '####';
		let cur_album = '####';
		let album = '';
		const albGenre_am = [];
		const albGenre_w = [];
		const albListeners = [];
		const albTags = [];
		const amMoods = [];
		const amRating = [];
		const amThemes = [];
		const artGenre_am = [];
		const artGenre_w = [];
		const artListeners = [];
		const artTags = [];
		const cue = [];
		const locale = [];
		const radioStream = notify && panel.isRadio(panel.id.focus);
		const rem = [];
		const similarArtists = [];
		const tags = [];
		const tf_artist = FbTitleFormat(`$upper(${cfg.tf.artist})`);
		const tf_albumArtist = FbTitleFormat(`$upper(${cfg.tf.albumArtist})`);
		const tf_cue = FbTitleFormat('$ext(%path%)');
		const tf_l = FbTitleFormat(`$upper(${cfg.tf.album})`);
		const artists = !radioStream ? tf_artist.EvalWithMetadbs(handles) : [tf_artist.Eval()];
		const albumArtists = tf_albumArtist.EvalWithMetadbs(handles);
		const cues = tf_cue.EvalWithMetadbs(handles);
		const albums = tf_l.EvalWithMetadbs(handles);

		for (let i = 0; i < handles.Count; i++) {
			artist = artists[i];
			albumArtist = albumArtists[i];
			cue[i] = cues[i].toLowerCase() == 'cue';
			album = albums[i];
			album = !cfg.albStrip ? name.albumTidy(album) : name.albumClean(album);
			if (artist != cur_artist) {
				cur_artist = artist;
				similarArtists[i] = '';
				if (cfg.tagEnabled7 || cfg.tagEnabled8 || cfg.tagEnabled9 || cfg.tagEnabled10 && cfg.tagEnabled13 < 7) {
					artTags[i] = '';
					artListeners[i] = '';
					locale[i] = '';
					const lfmBio = panel.cleanPth(cfg.pth.foLfmBio, !radioStream ? handles[i] : panel.id.focus, !radioStream ? 'tag' : 'notifyRadioStream') + $.clean(artist) + cfg.suffix.foLfmBio + '.txt';
					if ($.file(lfmBio)) {
						const lBio = $.open(lfmBio);
						if (cfg.tagEnabled7) {
							artTags[i] = this.getTag(lBio, 'Top Tags: ').tag;
							if (artTags[i]) artTags[i] = this.lfmTidy(artTags[i]);
						}
						if (cfg.tagEnabled8) artListeners[i] = this.getTag(lBio, lkw, false, 1, 'artist').tag;
						if (cfg.tagEnabled9) locale[i] = this.getTag(lBio, kww).tag;
						if (cfg.tagEnabled10 && cfg.tagEnabled13 < 7) {
							similarArtists[i] = this.getTag(lBio, panel.similarArtistsKey).tag;
							if (similarArtists[i].length > 6) {
								similarArtists[i] = '';
								this.simList.some(v => {
									if (v.name == artist && v.similar.length) {
										similarArtists[i] = v.similar;
										return true;
									}
								});
							}
							if (similarArtists[i]) $.take(similarArtists[i], cfg.tagEnabled13);
						}
					}
				}
				if (!similarArtists[i].length) similarArtists[i] = '';
				if (cfg.tagEnabled4) {
					artGenre_am[i] = '';
					const amBio = panel.cleanPth(cfg.pth.foAmBio, !radioStream ? handles[i] : panel.id.focus, !radioStream ? 'tag' : 'notifyRadioStream') + $.clean(artist) + cfg.suffix.foAmBio + '.txt';
					if ($.file(amBio)) {
						const aBio = $.open(amBio);
						artGenre_am[i] = this.getTag(aBio, 'Genre: ').tag;
					}
				}
				if (cfg.tagEnabled12) {
					artGenre_w[i] = '';
					const wikiBio = panel.cleanPth(cfg.pth.foWikiBio, !radioStream ? handles[i] : panel.id.focus, !radioStream ? 'tag' : 'notifyRadioStream') + $.clean(artist) + cfg.suffix.foWikiBio + '.txt';
					if ($.file(wikiBio)) {
						const wBio = $.open(wikiBio);
						artGenre_w[i] = this.getTag(wBio, 'Genre: ').tag;
					}
				}
			} else {
				artGenre_am[i] = artGenre_am[i - 1];
				artGenre_w[i] = artGenre_w[i - 1];
				artListeners[i] = artListeners[i - 1];
				artTags[i] = artTags[i - 1];
				locale[i] = locale[i - 1];
				similarArtists[i] = similarArtists[i - 1];
			}
			if (albumArtist + album != cur_albumArtist + cur_album) {
				cur_albumArtist = albumArtist;
				cur_album = album;
				if (cfg.tagEnabled0 || cfg.tagEnabled1 || cfg.tagEnabled2 || cfg.tagEnabled3) {
					albGenre_am[i] = '';
					amMoods[i] = '';
					amRating[i] = '';
					amThemes[i] = '';
					let amRev = panel.cleanPth(cfg.pth.foAmRev, handles[i], 'tag') + $.clean(albumArtist) + ' - ' + $.clean(album) + cfg.suffix.foAmRev + '.txt';
					if (amRev.length > 259) {
						album = $.abbreviate(album);
						amRev = panel.cleanPth(cfg.pth.foAmRev, handles[i], 'tag') + $.clean(albumArtist) + ' - ' + $.clean(album) + cfg.suffix.foAmRev + '.txt';
					}
					if ($.file(amRev)) {
						const aRev = $.open(amRev);
						if (cfg.tagEnabled0) albGenre_am[i] = this.getTag(aRev, 'Genre: ').tag;
						if (cfg.tagEnabled1) amMoods[i] = this.getTag(aRev, 'Album Moods: ').tag;
						if (cfg.tagEnabled2) {
							const b = aRev.indexOf('>> Album rating: ') + 17;
							const f = aRev.indexOf(' <<');
							if (b != -1 && f != -1 && f > b) {
								amRating[i] = aRev.substring(b, f).trim() * 2;
								if (amRating[i] == 0) amRating[i] = '';
							}
						}
						if (cfg.tagEnabled3) amThemes[i] = this.getTag(aRev, 'Album Themes: ').tag;
					}
				}
				if (cfg.tagEnabled5 || cfg.tagEnabled6) {
					albTags[i] = '';
					albListeners[i] = '';
					let lfmRev = panel.cleanPth(cfg.pth.foLfmRev, handles[i], 'tag') + $.clean(albumArtist) + ' - ' + $.clean(album) + cfg.suffix.foLfmRev + '.txt';
					if (lfmRev.length > 259) {
						album = $.abbreviate(album);
						lfmRev = panel.cleanPth(cfg.pth.foLfmRev, handles[i], 'tag') + $.clean(albumArtist) + ' - ' + $.clean(album) + cfg.suffix.foLfmRev + '.txt';
					}
					if ($.file(lfmRev)) {
						const lRev = $.open(lfmRev);
						if (cfg.tagEnabled5) {
							albTags[i] = this.getTag(lRev, 'Top Tags: ').tag;
							if (albTags[i]) albTags[i] = this.lfmTidy(albTags[i]);
						}
						if (cfg.tagEnabled6) albListeners[i] = this.getTag(lRev, lkw, false, 1, 'album').tag;
					}
				}
				if (cfg.tagEnabled11) {
					albGenre_w[i] = '';
					let wikiRev = panel.cleanPth(cfg.pth.foWikiRev, handles[i], 'tag') + $.clean(albumArtist) + ' - ' + $.clean(album) + cfg.suffix.foWikiRev + '.txt';
					if (wikiRev.length > 259) {
						album = $.abbreviate(album);
						wikiRev = panel.cleanPth(cfg.pth.foWikiRev, handles[i], 'tag') + $.clean(albumArtist) + ' - ' + $.clean(album) + cfg.suffix.foWikiRev + '.txt';
					}
					if ($.file(wikiRev)) {
						const wRev = $.open(wikiRev);
						albGenre_w[i] = this.getTag(wRev, 'Genre: ').tag;
					}
				}
			} else {
				albGenre_am[i] = albGenre_am[i - 1];
				albGenre_w[i] = albGenre_w[i - 1];
				albListeners[i] = albListeners[i - 1];
				amMoods[i] = amMoods[i - 1];
				amRating[i] = amRating[i - 1];
				amThemes[i] = amThemes[i - 1];
				albTags[i] = albTags[i - 1];
			}
		}

		for (let j = 0; j < 13; j++) this[`tagName${j}`] = !notify ? cfg[`tagName${j}`] : cfg[`tagName${j}_internal`].default_value;

		for (let i = 0; i < handles.Count; i++) {
			if (!cue[i] && (albGenre_am[i] || amMoods[i] || amRating[i] || amThemes[i] || artGenre_am[i] || albTags[i] || albListeners[i] || artTags[i] || artListeners[i] || locale[i] || similarArtists[i] || albGenre_w[i] || artGenre_w[i])) {
				const tg = {};
				if (albGenre_am[i]) tg[this.tagName0] = albGenre_am[i];
				if (amMoods[i]) tg[this.tagName1] = amMoods[i];
				if (amRating[i]) tg[this.tagName2] = amRating[i];
				if (amThemes[i]) tg[ this.tagName3] = amThemes[i];
				if (artGenre_am[i]) tg[this.tagName4] = artGenre_am[i];
				if (albTags[i]) tg[this.tagName5] = albTags[i];
				if (albListeners[i]) tg[this.tagName6] = albListeners[i];
				if (artTags[i]) tg[this.tagName7] = artTags[i];
				if (artListeners[i]) tg[this.tagName8] = artListeners[i];
				if (locale[i]) tg[this.tagName9] = locale[i];
				if (similarArtists[i]) tg[this.tagName10] = similarArtists[i];
				if (albGenre_w[i]) tg[this.tagName11] = albGenre_w[i];
				if (artGenre_w[i]) tg[this.tagName12] = artGenre_w[i];
				tags.push(tg);
			} else rem.push(i);
		}
		let i = rem.length;
		while (i--) handles.RemoveById(rem[i]);
		if (handles.Count && tags.length && notify) {
			window.NotifyOthers('biographyTags', {
				handle: handles[0],
				selectionMode: !panel.id.focus ? 'Prefer nowplaying' : 'Follow selected track (playlist)',
				tags: tags[0]
			});
		}
		if (notify) return;
		if (handles.Count) handles.UpdateFileInfoFromJSON(JSON.stringify(tags));
	}
}