function testHtmlDialog(){
	function confirm_callback(status, validate) {
		if(validate) fb.ShowPopupMessage('ok_callback status:'+status+' and ok btn clicked:'+validate+'', "ok_callback_title");
		//window.Reload();
	}	
	HtmlDialog("Test basic dialog", "Test basic dialog msg<br/><br/>A second line of text for some explanations<br/><br/>Here is the biggest text ever written by a human in the history of humanity.<br/>But.....ok, it's big, but is it so big that it meet and exceed the end of this dialog box? Hmmmmm? And how does that look?<br/>Not so goog i guess, judging from this refresh trial. What do you think?", 'Yes', 'No', confirm_callback);
	
	//HtmlMsg("Explanation on the disk image cache", "The disk image cache is built little by little: when a cover is displayed, if it isn't stored yet in the cache, it will be added to the cache.\n\nThe disk image cache is based on the %album artist% & %album% tags.\n\nAfter updating a existing cover, you must manually refresh it in foobar, do a right click over the cover which need to be refreshed, and you will have a menu item for that.", "Ok")	
}
testHtmlDialog();