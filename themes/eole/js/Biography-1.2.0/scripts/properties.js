class PanelProperty {
	constructor(name, default_value) {
		this.name = name;
		this.default_value = default_value;
		this.value = ppt.get(this.name, default_value);
	}

	// Methods

	get() {
		return this.value;
	}
	set(new_value) {
		if (this.value !== new_value) {
			ppt.set(this.name, new_value);
			this.value = new_value;
		}
	}
}

class PanelProperties {
	constructor() { // this.name_list = {}; debug
	}

	// Methods

	init(type, properties, thisArg) {
		switch (type) {
			case 'auto':
				properties.forEach(v => { // this.validate(v); debug
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
			throw ('property_id: ' + item[2] + '\nThis id is reserved');
		}

		if (this[item[2]] != null || this[item[2] + '_internal'] != null) {
			throw ('property_id: ' + item[2] + '\nThis id is already occupied');
		}

		if (this.name_list[item[0]] != null) {
			throw ('property_name: ' + item[0] + '\nThis name is already occupied');
		}
	}

	add(item) {
		// this.name_list[item[0]] = 1; debug
		this[item[2] + '_internal'] = new PanelProperty(item[0], item[1]);

		Object.defineProperty(this, item[2], {
			get() {
				return this[item[2] + '_internal'].get();
			},
			set(new_value) {
				this[item[2] + '_internal'].set(new_value);
			}
		});
	}

	get(name, default_value) {
		return window.GetProperty(name, default_value);
	} // initialisation

	set(name, new_value) {
		return window.SetProperty(name, new_value);
	}

	toggle(name) {
		this[name] = !this[name];
	}
}

let properties = [
	['Album History', JSON.stringify([]), 'albumHistory'],
	['Allmusic Alb', true, 'allmusic_alb'],
	['Allmusic Bio', false, 'allmusic_bio'],
	['Artist History', JSON.stringify([]), 'artistHistory'],
	['Artist View', false, 'artistView'],
	['Bio & Rev Same Style', true, 'sameStyle'],
	['Both Bio', false, 'bothBio'],
	['Both Rev', false, 'bothRev'],
	['Button LookUp', 2, 'lookUp'],
	['Colour Swap', false, 'swapCol'],

	['Cover Border [Dual Mode]', false, 'covBorderDual'],
	['Cover Border [Image Only]', false, 'covBorderImgOnly'],
	['Cover Load All', false, 'loadCovAllFb'],

	['Cover Selection', JSON.stringify([0, 1, 2, 3, 4]), 'loadCovSelFb'],

	['Cover Load Folder', false, 'loadCovFolder'],
	['Cover Reflection [Dual Mode]', false, 'covReflDual'],
	['Cover Reflection [Image Only]', false, 'covReflImgOnly'],
	['Cover Shadow [Dual Mode]', false, 'covShadowDual'],
	['Cover Shadow [Image Only]', false, 'covShadowImgOnly'],
	['Cover Style [Dual Mode] Regular-0 Auto-Fill-1 Circular-2', 0, 'covStyleDual'],
	['Cover Style [Image Only] Regular-0 Auto-Fill-1 Circular-2', 0, 'covStyleImgOnly'],
	['Cover Type', 0, 'covType'],

	['Custom Colour Background', '4,39,68', 'bg'],
	['Custom Colour Film Active Item Frame', '29, 62, 99, 208', 'frame'],
	['Custom Colour Overlay Fill', 'rgb(64-0-0)', 'rectOv'],
	['Custom Colour Overlay Border', '0,255,255', 'rectOvBor'],
	['Custom Colour Text', '171,171,190', 'text'],
	['Custom Colour Text Highlight', '121,194,255', 'text_h'],
	['Custom Colour Transparent Fill', '0,0,0,0.06', 'bgTrans'],

	['Custom Colour Background Use', false, 'bgUse'],
	['Custom Colour Film Active Item Frame Use', false, 'frameUse'],
	['Custom Colour Overlay Fill Use', false, 'rectOvUse'],
	['Custom Colour Overlay Border Use', false, 'rectOvBorUse'],
	['Custom Colour Text Use', false, 'textUse'],
	['Custom Colour Text Highlight Use', false, 'text_hUse'],
	['Custom Colour Transparent Fill Use', false, 'bgTransUse'],

	['Custom Font', 'Segoe UI,16,0', 'custFont'],
	['Custom Font Heading', 'Segoe UI,18,2', 'custHeadFont'],

	['Custom Font Use', false, 'custFontUse'],
	['Custom Font Heading Use', false, 'custHeadFontUse'],

	['Custom Font Scroll Icon', 'Segoe UI Symbol', 'butCustIconFont'],
	['Cycle Item', false, 'cycItem'],
	['Cycle Photo', true, 'cycPhoto'],
	['Cycle Picture', true, 'cycPic'],
	['Cycle Time Item', 45, 'cycTimeItem'],
	['Cycle Time Picture', 15, 'cycTimePic'],
	['Double-Click Toggle', false, 'dblClickToggle'],
	['Expand Lists', true, 'expandLists'],
	['Fallback Text Biography: Heading|No Heading', 'Nothing Found|There is no biography to display', 'bioFallbackText'],
	['Fallback Text Review: Heading|No Heading', 'Nothing Found|There is no review to display', 'revFallbackText'],

	['Filmstrip Autofit', true, 'filmStripAutofit'],
	['Filmstrip Cover Regular-0 Auto-Fill-1 Circular-2', 1, 'filmCoverStyle'],
	['Filmstrip Margin', 0, 'filmStripMargin'],
	['Filmstrip Photo Regular-0 Auto-Fill-1 Circular-2', 2, 'filmPhotoStyle'],
	['Filmstrip Pos', 3, 'filmStripPos'],
	['Filmstrip Size 0-1', 0.15, 'filmStripSize'],
	['Filmstrip Show', true, 'showFilmStrip'],
	['Filmstrip Show Auto', false, 'autoFilm'],
	['Filmstrip Use Image Padding', 0, 'filmImagePadding'],
	['Filmstrip Use Text Padding', 0, 'filmTextPadding'],

	['Font Size', 16, 'baseFontSize'],
	['Freestyle Custom', JSON.stringify([]), 'styleFree'],

	['Heading', 2, 'heading'],
	['Heading Always Full Width', false, 'fullWidthHeading'],
	['Heading BtnName Biography [AllMusic]', 'allmusic', 'amBioBtn'],
	['Heading BtnName Biography [Last.fm]', 'last.fm', 'lfmBioBtn'],
	['Heading BtnName Review [AllMusic]', 'allmusic', 'amRevBtn'],
	['Heading BtnName Review [Last.fm]', 'last.fm', 'lfmRevBtn'],
	['Heading Button Hide-0 Left-1 Right-2', 2, 'src'],
	['Heading Center', false, 'hdCenter'],
	['Heading Button Position Left-0 Right-1 Center-2', 0, 'hdPos'],
	['Heading Button Show', true, 'hdBtnShow'],
	['Heading Button Show Label', 1, 'hdShowBtnLabel'],
	['Heading Line Hide-0 Bottom-1 Center-2', 1, 'hdLine'],
	['Heading Padding Button', 0, 'hdBtnPad'],
	['Heading Padding Bottom Line', 0, 'hdLinePad'],
	['Heading Padding', 0, 'hdPad'],
	['Heading Position', 0, 'hdRight'],
	['Heading Show Button Background', true, 'hdShowBtnBg'],
	['Heading Show Button Red Lfm', false, 'hdShowRedLfm'],
	['Heading Show Title', true, 'hdShowTitle'],
	['Heading Style', 2, 'headFontStyle'],
	['Heading Title Format Album Review [AllMusic]', '$if2(%BIO_ALBUMARTIST%,Artist Unknown) - $if2(%BIO_ALBUM%,Album Unknown)', 'amRevHeading'],
	['Heading Title Format Album Review [Last.fm]', '$if2(%BIO_ALBUMARTIST%,Artist Unknown) - $if2(%BIO_ALBUM%,Album Unknown)', 'lfmRevHeading'],
	['Heading Title Format Biography [AllMusic]', '$if2(%BIO_ARTIST%,Artist Unknown)', 'amBioHeading'],
	['Heading Title Format Biography [Last.fm]', '$if2(%BIO_ARTIST%,Artist Unknown)', 'lfmBioHeading'],
	['Heading Title Format Track Review [Last.fm]', '> $if2(%BIO_ARTIST%,Artist Unknown) - $if2(%BIO_TITLE%,Title Unknown)', 'lfmTrackHeading'],

	['Highlight Heading Button', false, 'highlightHdBtn'],
	['Highlight Heading Text', true, 'highlightHdText'],
	['Highlight Heading Line', true, 'highlightHdLine'],
	['Highlight Overlay Border', true, 'highlightOvBor'],
	['Highlight Rating Stars', true, 'highlightStars'],
	['Highlight Subheadings', true, 'highlightSubHd'],
	['Highlight Text', false, 'highlightText'],

	['Image Align Auto', true, 'alignAuto'],
	['Image Align With Text', false, 'textAlign'],
	['Image Alignment Horizontal', 1, 'alignH'],
	['Image Alignment Vertical', 1, 'alignV'],
	['Image Auto Enlarge', false, 'autoEnlarge'],
	['Image Blur Background Auto-Fill', false, 'blurAutofill'],
	['Image Blur Background Level (%)', 90, 'blurTemp'],
	['Image Blur Background Opacity (%)', 30, 'blurAlpha'],
	['Image Blur Background Always Use Front Cover', false, 'covBlur'],
	['Image Counter', false, 'imgCounter'],
	['Image Filter Lastfm', false, 'imgFilterLfm'],
	['Image Filter Size Max Size', 12000, 'imgFilterMaxSz'],
	['Image Filter Size Max Size Enabled', false, 'imgFilterMaxSzEnabled'],
	['Image Filter Size Min Number', 3, 'imgFilterMinNo'],
	['Image Filter Size Min Px', 500, 'imgFilterMinPx'],
	['Image Filter Size Min Px Enabled', false, 'imgFilterMinPxEnabled'],
	['Image Filter Size Min Size', 50, 'imgFilterMinSz'],
	['Image Filter Size Min Size Enabled', false, 'imgFilterMinSzEnabled'],
	['Image Filter Size Width & Height', true, 'imgFilterBothPx'],
	['Image Only', false, 'img_only'],
	['Image Reflection Type', 0, 'imgReflType'],
	['Image Seeker', 0, 'imgSeeker'],
	['Image Seeker Dots', true, 'imgSeekerDots'],
	['Image Smooth Transition', false, 'imgSmoothTrans'],
	['Image Smooth Transition Level (%)', 92, 'transLevel'],

	['Layout', 0, 'style'],
	['Layout Bio Mode', 0, 'bioMode'],
	['Layout Bio', 0, 'bioStyle'],
	['Layout Dual Image+Text', false, 'imgText'],
	['Layout Image Size 0-1', 0.65, 'rel_imgs'],
	['Layout Margin Between Image & Text', 20, 'gap'],
	['Layout Margin Image Left', 20, 'borL'],
	['Layout Margin Image Right', 20, 'borR'],
	['Layout Margin Image Top', 0, 'borT'],
	['Layout Margin Image Bottom', 0, 'borB'],
	['Layout Margin Text Left', 20, 'textL'],
	['Layout Margin Text Right', 20, 'textR'],
	['Layout Margin Text Top', 20, 'textT'],
	['Layout Margin Text Bottom', 20, 'textB'],
	['Layout Padding Between Thumbnails', 0, 'thumbNailGap'],
	['Layout Rev Mode', 0, 'revMode'],
	['Layout Rev', 0, 'revStyle'],

	['Line Padding', 0, 'textPad'],
	['Lock Bio', false, 'lockBio'],
	['Lock Rev', false, 'lockRev'],
	['Lock Auto', false, 'autoLock'],
	['Menu Show Inactivate', 0, 'menuShowInactivate'],
	['Menu Show Paste', 1, 'menuShowPaste'],
	['Menu Show Playlists', 0, 'menuShowPlaylists'],
	['Menu Show Missing Data', 0, 'menuShowMissingData'],
	['Menu Show Tagger', 1, 'menuShowTagger'],
	['Overlay', JSON.stringify({
		'name': 'Overlay',
		'imL': 0,
		'imR': 0,
		'imT': 0,
		'imB': 0,
		'txL': 0,
		'txR': 0,
		'txT': 0.632,
		'txB': 0
	}), 'styleOverlay'],
	['Overlay Border Width (px)', 1, 'overlayBorderWidth'],
	['Overlay Gradient (%)', 10, 'overlayGradient'],
	['Overlay Strength (%)', 84.5, 'overlayStrength'],
	['Overlay Type', 0, 'typeOverlay'],
	['Panel Active', true, 'panelActive'],

	['Photo Border [Dual Mode]', false, 'artBorderDual'],
	['Photo Border [Image Only]', false, 'artBorderImgOnly'],
	['Photo Reflection [Dual Mode]', false, 'artReflDual'],
	['Photo Reflection [Image Only]', false, 'artReflImgOnly'],
	['Photo Shadow [Dual Mode]', false, 'artShadowDual'],
	['Photo Shadow [Image Only]', false, 'artShadowImgOnly'],
	['Photo Style [Dual Mode] Regular-0 Auto-Fill-1 Circular-2', 0, 'artStyleDual'],
	['Photo Style [Image Only] Regular-0 Auto-Fill-1 Circular-2', 0, 'artStyleImgOnly'],

	['Prefer Focus', false, 'focus'],
	['Rating Position Prefer Heading-0 Text-1', 1, 'star'],
	['Rating Show AllMusic', true, 'amRating'],
	['Rating Show Last.fm', true, 'lfmRating'],
	['Rating Text Name AllMusic', 'Album rating', 'allmusic_name'],
	['Rating Text Name Last.fm', 'Album rating', 'lastfm_name'],
	['Rating Text Position Auto-0 Embed-1 Own Line-2', 0, 'ratingTextPos'],
	['Reflection Gradient (%)', 10, 'reflGradient'],
	['Reflection Size (%)', 100, 'reflSize'],
	['Reflection Strength (%)', 14.5, 'reflStrength'],

	['Scrollbar Height Prefer Full', false, 'sbarFullHeight'],
	['Scroll Step 0-10 (0 = Page)', 3, 'scrollStep'],
	['Scroll Smooth Duration 0-5000 msec (Max)', 500, 'durationScroll'],
	['Scroll Touch Flick Duration 0-5000 msec (Max)', 3000, 'durationTouchFlick'],
	['Scroll Touch Flick Distance 0-10', 0.8, 'flickDistance'],
	['Scroll: Smooth Scroll', true, 'smooth'],
	['Scrollbar Arrow Custom Icon', '\uE0A0', 'arrowSymbol'],
	['Scrollbar Arrow Custom Icon: Vertical Offset (%)', -24, 'sbarButPad'],
	['Scrollbar Arrow Width', Math.round(11 * $.scale), 'sbarArrowWidth'],
	['Scrollbar Button Type', 0, 'sbarButType'],
	['Scrollbar Colour Grey-0 Blend-1', 1, 'sbarCol'],
	['Scrollbar Grip MinHeight', Math.round(20 * $.scale), 'sbarGripHeight'],
	['Scrollbar Padding', 0, 'sbarPad'],
	['Scrollbar Narrow Bar Width (0 = Auto)', 0, 'narrowSbarWidth'],
	['Scrollbar Show', 1, 'sbarShow'],
	['Scrollbar Type Default-0 Styled-1 Windows-2', 0, 'sbarType'],
	['Scrollbar Width', Math.round(11 * $.scale), 'sbarWidth'],
	['Scrollbar Width Bar', 11, 'sbarBase_w'],
	['Scrollbar Windows Metrics', false, 'sbarWinMetrics'],

	['Show Album History', true, 'showAlbumHistory'],
	['Show Artist History', true, 'showArtistHistory'],
	['Show More Tags', true, 'showMoreTags'],
	['Show Similar Artists', true, 'showSimilarArtists'],
	['Show Top Albums', true, 'showTopAlbums'],
	['Statistics Show Last.fm Metacritic Score', true, 'score'],
	['Statistics Show Last.fm Scrobbles & Listeners', true, 'stats'],

	['Subheading [Source] Text Biography [AllMusic]: Heading|No Heading', 'AllMusic|AllMusic Biography', 'amBioSubHead'],
	['Subheading [Source] Text Biography [Last.fm]: Heading|No Heading', 'Last.fm|Last.fm Biography', 'lfmBioSubHead'],
	['Subheading [Source] Text Review [AllMusic]: Heading|No Heading', 'AllMusic|AllMusic Review', 'amRevSubHead'],
	['Subheading [Source] Text Review [Last.fm]: Heading|No Heading', 'Last.fm|Last.fm Review', 'lfmRevSubHead'],
	['Subheading [Track Review] Title Format [Last.fm]', '> $if2(%BIO_ARTIST%,Artist Unknown) - $if2(%BIO_TITLE%,Title Unknown)', 'lfmTrackSubHeading'],
	['Subheading Source Hide-0 Auto-1 Show-2', 1, 'sourceHeading'],
	['Subheading Source Style', 1, 'sourceStyle'],
	['Subheading Track Hide-0 Auto-1 Show-2', 1, 'trackHeading'],
	['Subheading Track Style', 1, 'trackStyle'],

	['Summary First', true, 'summaryFirst'],
	['Tagger Last.fm Genre Find>Replace', "-melancholic->melancholy|alt country>alt-country|alternativ>alternative|american artist>american|americana>american|america>american|andes>andean|australian artist>australian|australia>australian|avantgarde>avant-garde|blue eyed soul>blue-eyed soul|bluesrock>blues rock|blues-rock>blues rock|boyband>boybands|brasil>brazilian|british artist>british|britpop>brit pop|canada>canadian|canterbury>canterbury scene|chill out>chillout|christmas music>christmas|christmas songs>christmas|classique>classical|composer>composers|covers>cover|cover songs>cover|doo-wop>doo wop|duets>duet|easy-listening>easy listening|england>english|eurovision song contest>eurovision|experimental hip hop>experimental hip-hop|favourite albums of all time>favourite albums|favourite lps>favourite albums|favorite song>favourite song|favourite song>favourite albums|favorit>favourite albums|favourite>favourite albums|female>female vocalists|female vocalist>female vocalists|female vocals>female vocalists|fok rock>folk rock|folk-rock>folk rock|genre: psychedelic rock>psychedelic rock|good cd>good stuff|girl group>girl groups|greek music>greek|hip hop>hip-hop|is this what they call music nowedays>is this what they call music nowadays|jamaican artist>jamaican|jamaica>jamaican|jazz-rock>jazz rock|love songs>love|male>male vocalists|male vocals>male vocalists|mis albumes favoritos>favourite albums|motown soul>motown|movie>soundtrack|my favorites>favourite albums|musical>musicals|new orleans>new orleans blues|new orleans rhythm and blues>new orleans blues|nu-metal>nu metal|one hit wonder>one hit wonders|orchestra>orchestral|pop - adult>pop|pop-rock>pop rock|post punk>post-punk|prog>progressive|progressiv>progressive|prog rock>progressive rock|prog-rock>progressive rock|punk albums>punk|R&b>rnb|relaxation>relaxing|relax>relaxing|rhythm and blues>rnb|rock - progressive>progressive rock|rock & roll>rock n roll|rock and roll>rock n roll|rock n' roll>rock n roll|rock'n'roll>rock n roll|rock progressif>progressive rock|san fransico>san francisco|singer-songwriters>singer-songwriter|soul new>soul|synth>synthesiser|synthesizer>synthesiser|synthpop>synth pop|tech-house>tech house|underrated albums>underrated|weallgetold>we all get old|xmas>christmas|allboutguitar lesson>allboutguitar|allboutguitarcom>allboutguitar|-Progressive-And-Classic-Rock->|38 Special>|a good song>|acdc>|album cold play>|albums i have listened to>|albums i have on mp3>|albums i listened to>|albums i love>|albums i own>|albums i own on cd>|albums i own on vinyl>|albumsiown>|aleister crowley>|all>|barkley james harvest>|beatles>|best>|best album>|best albums ever>|best albums of all time>|best debut albums>|best top-rated albums>|bill bruford>|black sabbath>|blink 182>|bob dylan>|bob marley>|bowie>|cd i own>|christopher lee>|christine mcvie>|chupo buceta>|classic best of>|danny kirwan>|destinys child>|dylan>|ellie goulding>|elton john>|elvis costello>|featuring>|fleetwood mac>|frank zappa>|freddie mercury>|george michael and elton john>|girls aloud>|gonna listen>|grace slick>|guns n roses>|heaven and hell>|hello nadine>|intro>|j holiday>|j holiday - suffocate>|jan akkerman>|jan dismas zelenka>|jean michel jarre>|jecks>|joanne>|joe lynn turner>|jon anderson>|jonanderson>|jj cale>|jonas brothers>|judas priest>|kanye west>|kelis - kelis was here>|kesha>|lana del rey>|led zeppelin>|lesley garret>|liam gallagher>|lil boosie>|lord of the dance>|love this album>|love it>|loved>|lovely>|marillion>|michael jackson>|mia>|mike patton>|monkees>|music i love>|must-have>|my albums>|my collection>|my private work station>|my vinyl>|myhits>|n yepes>|neil young>|neil-young>|noel>|nyoung>|own cd>|own on vinyl>|paul kantner>|paul mccartney>|pavarotti>|pink>|pink floyd>|pj Harvey>|prince>|queen>|r kelly>|rahsaan patterson>|raul seixas>|robert plant>|rob halford>|roger waters>|rolling stones>|ryan adams>|selena gomez>|shirley bassey>|singles>|smashing pumpkins>|smokey robinson>|sonny terry>|special>|spice girls>|steelydan>|steve albini>|tarantino>|tatu>|the beatles>|the phantom of the opera>|to buy>|to listen>|tom petty>|tony visconti>|top cd>|trasy chapman-crossroads>|traveling wilburys>|try before i buy>|vinyl i own>|vinyl>|vocalist of the two- tone band the beat>|watson>|work bitch>|yes>|yes type>", 'replace'],
	['Tagger Last.fm Genre Number Clean Up', true, 'cleanNo'],
	['Tagger Last.fm Genre Run Find>Replace', true, 'runReplace'],
	['Tagger Last.fm Genre Strip Artist+Album Names', true, 'stripNames'],
	['Text Align Always Top', false, 'topAlign'],
	['Text Only', false, 'text_only'],
	['Theme', 0, 'theme'],
	['Touch Control', false, 'touchControl'],
	['Track Review', 0, 'inclTrackRev'],
	['Touch Step 1-10', 1, 'touchStep'],
	['Zoom Font Size (%)', 100, 'zoomFont'],
	['Zoom Heading Font Size (%)', 115, 'zoomHead'],
	['Zoom Button Heading Size (%)', 100, 'zoomHeadBtn'],
	['Zoom Button LookUp Size (%)', 100, 'zoomLookUpBtn'],
	['Zoom Tooltip (%)', 100, 'zoomTooltip']
];

class PanelPropertiesUpdate {
	getOrig(name) {
		return window.GetProperty(`\u200A${name}`);
	} // initialisation
	setNew(name, new_value) {
		window.SetProperty(name, new_value);
	}
	setOrigNull(name) {
		window.SetProperty(`\u200A${name}`, null);
	}

	update(properties) {
		if (this.getOrig(' Image Smooth Transition Level (0-100)') === null) return;

		const cusUsed = this.getOrig('_CUSTOM COLOURS/FONTS: USE');
		let val;
		let names = [
			'_Custom.Font (Name,Size,Style[0-4])',
			'_Custom.Font Heading (Name,Size,Style[0-4])',
			'_Custom.Colour Background',
			'_Custom.Colour Overlay Rect & RoundRect',
			'_Custom.Colour Overlay Rect & RoundRect Rim',
			'_Custom.Colour Text',
			'_Custom.Colour Text Highlight',
			'_Custom.Colour Transparent Fill'
		];
		let props = [
			'Custom Font Use',
			'Custom Font Heading Use',
			'Custom Colour Background Use',
			'Custom Colour Overlay Fill Use',
			'Custom Colour Overlay Border Use',
			'Custom Colour Text Use',
			'Custom Colour Text Highlight Use',
			'Custom Colour Transparent Fill Use'
		];
		if (cusUsed) {
			names.forEach((n, i) => {
				val = this.getOrig(n);
				if (val && val.length) this.setNew(props[i], true);
			});
		}
		props = [
			'Custom Font',
			'Custom Font Heading',
			'Custom Colour Background',
			'Custom Colour Overlay Fill',
			'Custom Colour Overlay Border',
			'Custom Colour Text',
			'Custom Colour Text Highlight',
			'Custom Colour Transparent Fill'
		];
		names.forEach((n, i) => {
			val = this.getOrig(n);
			if (val && val.length) this.setNew(props[i], val);
			this.setOrigNull(n);
		});
		names = [
			' Fallback  Text  Biography: Heading|No Heading',
			' Fallback  Text  Review: Heading|No Heading',
			' Heading  Title Format  Album Review [AllMusic]',
			' Heading  Title Format  Album Review [Last.fm]',
			' Heading  Title Format  Biography [AllMusic]',
			' Heading  Title Format  Biography [Last.fm]',
			' Heading  Title Format  Track Review [Last.fm]',
			' Image Smooth Transition Level (0-100)',
			' Layout Internal Padding',
			' Layout Outer Padding Image  Left',
			' Layout Outer Padding Image  Right',
			' Layout Outer Padding Image  Top',
			' Layout Outer Padding Image Bottom',
			' Layout Outer Padding Text  Left',
			' Layout Outer Padding Text  Right',
			' Layout Outer Padding Text  Top',
			' Layout Outer Padding Text Bottom',
			' Scrollbar Arrow Custom: Icon: Vertical Offset %',
			' Scrollbar Narrow Bar Width 2-10 (0 = Default)',
			' Subheading  [Source]  Text  Biography [AllMusic]: Heading|No Heading',
			' Subheading  [Source]  Text  Biography [Last.fm]: Heading|No Heading',
			' Subheading  [Source]  Text  Review [AllMusic]: Heading|No Heading',
			' Subheading  [Source]  Text  Review [Last.fm]: Heading|No Heading',
			' Subheading  [Track Review]  Title Format  [Last.fm]',
			' Zoom Button Size (%)',
			'ADV.Last.fmGenreTag Find>Replace',
			'ADV.Last.fmGenreTag Number Clean Up',
			'ADV.Last.fmGenreTag Run Find>Replace',
			'ADV.Last.fmGenreTag Strip Artist+Album Names',
			'ADV.Image Blur Background Level (0-100)',
			'ADV.Image Blur Background Opacity (0-100)',
			'ADV.Touch Flick Distance 0-10',
			'ADV.Scrollbar Height Always Full',
			'SYSTEM.Cycle Photo Last.fm Only',
			'SYSTEM.Image Bar'
		];
		props = [
			'Fallback Text Biography: Heading|No Heading',
			'Fallback Text Review: Heading|No Heading',
			'Heading Title Format Album Review [AllMusic]',
			'Heading Title Format Album Review [Last.fm]',
			'Heading Title Format Biography [AllMusic]',
			'Heading Title Format Biography [Last.fm]',
			'Heading Title Format Track Review [Last.fm]',
			'Image Smooth Transition Level (%)',
			'Layout Margin Between Image & Text',
			'Layout Margin Image Left',
			'Layout Margin Image Right',
			'Layout Margin Image Top',
			'Layout Margin Image Bottom',
			'Layout Margin Text Left',
			'Layout Margin Text Right',
			'Layout Margin Text Top',
			'Layout Margin Text Bottom',
			'Scrollbar Arrow Custom Icon: Vertical Offset (%)',
			'Scrollbar Narrow Bar Width (0 = Auto)',
			'Subheading [Source] Text Biography [AllMusic]: Heading|No Heading',
			'Subheading [Source] Text Biography [Last.fm]: Heading|No Heading',
			'Subheading [Source] Text Review [AllMusic]: Heading|No Heading',
			'Subheading [Source] Text Review [Last.fm]: Heading|No Heading',
			'Subheading [Track Review] Title Format [Last.fm]',
			'Zoom Button LookUp Size (%)',
			'Tagger Last.fm Genre Find>Replace',
			'Tagger Last.fm Genre Number Clean Up',
			'Tagger Last.fm Genre Run Find>Replace',
			'Tagger Last.fm Genre Strip Artist+Album Names',
			'Image Blur Background Level (%)',
			'Image Blur Background Opacity (%)',
			'Scroll Touch Flick Distance 0-10',
			'Scrollbar Height Prefer Full',
			'Image Filter Lastfm',
			'Image Seeker'
		];
		names.forEach((n, i) => {
			this.setNew(props[i], this.getOrig(n));
			this.setOrigNull(n);
		});
		names = [' Text Align Always Top', 'SYSTEM.Bottom Size Correction', '_CUSTOM COLOURS/FONTS: EMPTY = DEFAULT', '_CUSTOM COLOURS/FONTS: USE', 'SYSTEM.Cache Limit Advisory', 'SYSTEM.Image Border-1 Shadow-2 Both-3', 'SYSTEM.Image Reflection', 'SYSTEM.Properties Updated', 'SYSTEM.Properties Upd', 'SYSTEM.Software Notice Checked'];
		names.forEach(n => this.setOrigNull(n));
		names = props = undefined;

		let prop = ' Scrollbar Size';
		val = this.getOrig(prop);
		if (typeof val === 'string') {
			val = $.split(val, 0);
			if (val.length == 8) {
				const sbarWidth = $.clamp($.value(val[1], 11, 0), 0, 400);
				this.setNew('Scrollbar Width', sbarWidth)
				this.setNew('Scrollbar Arrow Width', Math.min($.value(val[3], 11, 0), sbarWidth, 400));
				this.setNew('Scrollbar Padding', $.value(val[5], 0, 0));
				this.setNew('Scrollbar Grip MinHeight', $.value(val[7], 12, 0));
			}
		}
		this.setOrigNull(prop);

		prop = ' Scrollbar Type Default-0 Styled-1 Themed-2';
		val = parseInt(this.getOrig(prop));
		if (typeof val !== 'number') val = 0;
		val = $.clamp(val, 0, 2);
		this.setNew('Scrollbar Type Default-0 Styled-1 Windows-2', val);
		this.setOrigNull(prop);

		ppt.star -= 1;

		prop = ' Rating Position Prefer Heading-1 Text-2';
		val = this.getOrig(prop);
		if (typeof val !== 'number') val = 1;
		val -= 1;
		val = $.clamp(val, 0, 1);
		this.setNew('Rating Position Prefer Heading-0 Text-1', val);
		this.setOrigNull(prop);

		prop = '_Custom.Font Icon [Scroll] (Name,Style[0or1])';
		val = this.getOrig(prop);
		if (typeof val === 'string') {
			const ch = val.split(',')[0].trim();
			if (ch.length) this.setNew('Custom Font Scroll Icon', ch);
		}
		this.setOrigNull(prop);

		prop = ' Scrollbar Arrow Custom: Icon // Examples';
		val = this.getOrig(prop);
		if (typeof val === 'string') {
			const ch = val.charAt();
			if (ch.length) this.setNew('Scrollbar Arrow Custom Icon', ch);
		}
		this.setOrigNull(prop);
		
		prop = 'SYSTEM.Button More Items';
		val = this.getOrig(prop);
		if (typeof val === 'boolean') this.setNew('Button LookUp', val ? 1 : 0);
		this.setOrigNull(prop);

		prop = ' Heading Metrics +/-';
		val = this.getOrig(prop);
		if (typeof val === 'string') {
			val = $.split(val, 0);
			if (val.length == 8) {
				this.setNew('Zoom Button Heading Size (%)', 100 + $.value(val[5], 0, 0) * 10);
				this.setNew('Heading Padding Button', $.value(val[7], 0, 0));
				this.setNew('Heading Padding Bottom Line', $.value(val[3], 0, 0));
				this.setNew('Heading Padding', $.value(val[1], 0, 0));
			}
		}
		this.setOrigNull(prop);

		prop = ' Menu Items Hide-0 Shift-1 Show-2';
		val = this.getOrig(prop);
		if (typeof val === 'string') {
			val = $.split(val, 0);
			if (val.length == 8) {
				this.setNew('Menu Show Paste', $.value(val[1], 1, 2));
				this.setNew('Menu Show Playlists', $.value(val[3], 0, 2));
				this.setNew('Menu Show Tagger', $.value(val[5], 1, 2));
				this.setNew('Menu Show Missing Data', $.value(val[7], 0, 2));
			}
		}
		this.setOrigNull(prop);

		prop = 'SYSTEM.Heading Style';
		val = this.getOrig(prop);
		if (val == 16) this.setNew('Heading Style', 4);
		if (val == 18) this.setNew('Heading Style', 5);

		prop = ' Highlight Colour 0 or 1';
		val = this.getOrig(prop);
		if (typeof val === 'string') {
			val = $.split(val, 0);
			if (val.length == 14) {
				this.setNew('Highlight Heading Button', $.value(val[1], 0, 1));
				this.setNew('Highlight Heading Text', $.value(val[3], 1, 1));
				this.setNew('Highlight Heading Line', $.value(val[5], 1, 1));
				this.setNew('Highlight Overlay Border', $.value(val[7], 1, 1));
				this.setNew('Highlight Rating Stars', $.value(val[9], 1, 1));
				this.setNew('Highlight Subheadings', $.value(val[11], 1, 1));
				this.setNew('Highlight Text', $.value(val[13], 0, 1));
			}
		}
		this.setOrigNull(prop);

		prop = ' Heading Items 0 or 1';
		val = this.getOrig(prop);
		const icon = 'SYSTEM.Heading Button Icon';
		const useIcon = this.getOrig(icon);
		if (typeof val === 'string') {
			val = $.split(val, 0);
			if (val.length == 8) {
				this.setNew('Heading Show Button Background', $.value(val[1], 1, 1) === 1);
				this.setNew('Heading Button Show Label', $.value(val[3], 1, 1) === 1 ? (useIcon ? 2 : 1) : 0);
				this.setNew('Heading Show Button Red Lfm', $.value(val[5], 0, 1) === 1);
				this.setNew('Heading Show Title', $.value(val[7], 1, 1) === 1);
			}
		}
		this.setOrigNull(prop);
		this.setOrigNull(icon);

		prop = ' Overlay Setting';
		val = this.getOrig(prop);
		if (typeof val === 'string') {
			val = $.split(val, 0);
			if (val.length == 6) {
				this.setNew('Overlay Strength (%)', $.value(val[1], 84.5, 0));
				this.setNew('Overlay Gradient (%)', $.value(val[3], 10, 0));
				this.setNew('Overlay Border Width (px)', $.value(val[5], 1, 0));
			}
		}
		this.setOrigNull(prop);

		prop = ' Image Reflection Setting (0-100)';
		val = this.getOrig(prop);
		if (typeof val === 'string') {
			val = $.split(val, 0);
			if (val.length == 6) {
				this.setNew('Reflection Strength (%)', $.value(val[1], 14.5, 0));
				this.setNew('Reflection Size (%)', $.value(val[3], 100, 0));
				this.setNew('Reflection Gradient (%)', $.value(val[5], 10, 0));
			}
		}
		this.setOrigNull(prop);

		prop = 'ADV.Smooth Duration 0-5000 msec (Max)';
		val = this.getOrig(prop);
		if (typeof val === 'string') {
			val = $.split(val, 0);
			if (val.length == 4) {
				this.setNew('Scroll Smooth Duration 0-5000 msec (Max)', $.clamp($.value(val[1], 500, 0), 0, 5000));
				this.setNew('Scroll Touch Flick Duration 0-5000 msec (Max)', $.clamp($.value(val[3], 3000, 0), 0, 5000));
			}
		}
		this.setOrigNull(prop);

		prop = 'SYSTEM.Image Bar Dots'
		val = this.getOrig(prop);
		if (val === 1) this.setNew('Image Seeker Dots', true);
		this.setOrigNull(prop);

		prop = ['SYSTEM.Cover Circular [Dual Mode]', 'SYSTEM.Cover Crop [Dual Mode]'];
		this.setNew('Cover Style [Dual Mode] Regular-0 Auto-Fill-1 Circular-2', this.getOrig(prop[0]) ? 2 : this.getOrig(prop[1]) ? 1 : 0)
		prop.forEach(v => this.setOrigNull(v));

		prop = ['SYSTEM.Photo Circular [Dual Mode]', 'SYSTEM.Photo Crop [Dual Mode]'];
		this.setNew('Photo Style [Dual Mode] Regular-0 Auto-Fill-1 Circular-2', this.getOrig(prop[0]) ? 2 : this.getOrig(prop[1]) ? 1 : 0)
		prop.forEach(v => this.setOrigNull(v));

		prop = ['SYSTEM.Cover Circular [Image Only]', 'SYSTEM.Cover Crop [Image Only]'];
		this.setNew('Cover Style [Image Only] Regular-0 Auto-Fill-1 Circular-2', this.getOrig(prop[0]) ? 2 : this.getOrig(prop[1]) ? 1 : 0)
		prop.forEach(v => this.setOrigNull(v));

		prop = ['SYSTEM.Photo Circular [Image Only]', 'SYSTEM.Photo Crop [Image Only]'];
		this.setNew('Photo Style [Image Only] Regular-0 Auto-Fill-1 Circular-2', this.getOrig(prop[0]) ? 2 : this.getOrig(prop[1]) ? 1 : 0)
		prop.forEach(v => this.setOrigNull(v));

		prop = 'SYSTEM.Cover Border-1 Shadow-2 Both-3 [Dual Mode] ';
		val = this.getOrig(prop);
		this.setNew('Cover Border [Dual Mode]', val == 1 || val == 3);
		this.setNew('Cover Shadow [Dual Mode]', val > 1);
		this.setOrigNull(prop);

		prop = 'SYSTEM.Photo Border-1 Shadow-2 Both-3 [Dual Mode]';
		val = this.getOrig(prop);
		this.setNew('Photo Border [Dual Mode]', val == 1 || val == 3);
		this.setNew('Photo Shadow [Dual Mode]', val > 1);
		this.setOrigNull(prop);

		prop = 'SYSTEM.Cover Border-1 Shadow-2 Both-3 [Image Only]';
		val = this.getOrig(prop);
		this.setNew('Cover Border [Image Only]', val == 1 || val == 3);
		this.setNew('Cover Shadow [Image Only]', val > 1);
		this.setOrigNull(prop);

		prop = 'SYSTEM.Photo Border-1 Shadow-2 Both-3 [Image Only]';
		val = this.getOrig(prop);
		this.setNew('Photo Border [Image Only]', val == 1 || val == 3);
		this.setNew('Photo Shadow [Image Only]', val > 1);
		this.setOrigNull(prop);

		prop = 'SYSTEM.Layout Dual Style Auto';
		val = this.getOrig(prop);
		if (typeof val === 'boolean') this.setNew('Layout Dual Image+Text', !val);
		this.setOrigNull(prop);

		prop = ['SYSTEM.Blur Dark Theme', 'SYSTEM.Blur Blend Theme', 'SYSTEM.Blur Light Theme'];
		this.setNew('Theme', this.getOrig(prop[0]) ? 1 : this.getOrig(prop[1]) ? 2 : this.getOrig(prop[2]) ? 3 : 0)
		prop.forEach(v => this.setOrigNull(v));

		const pr = [' ', 'ADV.', 'SYSTEM.']
		properties.forEach(v => {
			pr.forEach(w => {
				const val = this.getOrig(w + v[0]);
				if (val !== null) {
					ppt.set(v[0], val);
					this.setOrigNull(w + v[0]);
				}
			})
		});

		if (ppt.sbarShow === false) ppt.sbarShow = 0;
		if (ppt.sbarShow === true) ppt.sbarShow = 1;
		if (ppt.sourceStyle == 16) ppt.sourceStyle = 4;
		if (ppt.sourceStyle == 18) ppt.sourceStyle = 5;
		if (ppt.trackStyle == 16) ppt.trackStyle = 4;
		if (ppt.trackStyle == 18) ppt.trackStyle = 5;
		if (ppt.heading === false) ppt.heading = 0;
		if (ppt.heading === true) ppt.heading = 2;
	}
}

const ppt = new PanelProperties;
const pptUpdate = new PanelPropertiesUpdate;
pptUpdate.update(properties);
ppt.init('auto', properties);
properties = undefined;