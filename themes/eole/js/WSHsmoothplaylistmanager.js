function ok_callback(status, clicked) {
	fb.ShowPopupMessage('ok_callback status:'+status+' and checkbox clicked:'+clicked+'', "ok_callback_title");
}
var external_delete_pid = -1;
function DeletePlaylist(delete_pid){
	external_delete_pid = delete_pid;
	parsed_tabname = plman.GetPlaylistName(delete_pid);	

	utils.ShowHtmlDialog(window.ID, htmlCode(skin_global_path+"\\html","ConfirmDialog.html"), {
		data: ["Delete this playlist", "Delete the playlist '"+parsed_tabname+"' ?", 'No', ok_callback],            
	});
}
DeletePlaylist(0);