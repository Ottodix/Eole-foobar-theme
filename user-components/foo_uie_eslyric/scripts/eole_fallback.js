//===================================================
//============Fallback lyrics For ESLyric============
//===============Anonymous 2016-10-22================
//===================================================

function get_my_name() {
	return "Eole fallback lyrics";
}

function get_version() {
	return "1.0.0";
}

function get_author() {
	return "Eole";
}

function start_search(info, callback) {
	var http_client = utils.CreateHttpClient();
	var new_lyric = fb.CreateLyric();
	new_lyric.Title = info.Title;
	new_lyric.Artist = info.Artist;
	new_lyric.Source = get_my_name();
	new_lyric.Location = "";
	new_lyric.LyricText = "Title: "+info.Title+"\nArtist: "+info.Artist+"\nAlbum: "+ info.Album+"\n\nCouldn't find any lyrics locally\nor online for this track.";
	callback.AddLyric(new_lyric);
	new_lyric.Dispose();
}



