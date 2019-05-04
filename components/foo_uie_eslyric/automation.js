// ==PREPROCESSOR==
// @name "ESLyric automation"
// ==/PREPROCESSOR==

/*
interface IESLyric
{
Properties:
	[r] String Version;
	[r,w] Boolean ShowDesktopLyric;
	[r,w] Boolean LockDesktopLyric;
	[r,w] Boolean DesktopLyricAlwaysOnTop;
	[r] Boolean DesktopLyricDisplaySchemeCount;
	[r,w] UINT DesktopLyricDisplayScheme;
	[r,w] String DesktopLyricDisplaySchemeName;
	[r,w] UINT SaveScheme;
	[r,w] String SaveFilename;
	
Methods:
	//panel_guid : press CTRL and then right click on a eslyric panel, you'll see guid of this panel, apply to all if omitted
	void SetPanelUIMode(UINT mode, String panel_guid = "");
	void SetPanelTextRenderer(UINT r, String panel_guid = "");
	void SetPanelBackgroundType(UINT r, String panel_guid = "");
	void SetPanelBackgroundSource(UINT r, String panel_guid = "");
	void SetPanelBackgroundPos(UINT r, String panel_guid = "");
	void SetPanelBackgroundImageBlendAlpha(UINT r, String panel_guid = "");
	void SetPanelBackgroundImageBlurRadius(UINT r, String panel_guid = "");
	void SetPanelBackgroundImagePath(String path, String panel_guid = "");
	void SetPanelBackgroundImage(IGdiBitmap img, String panel_guid = "");
	void SetPanelTextNormalColor(UINT color, String panel_guid = "");
	void SetPanelTextHighlightColor(UINT color, String panel_guid = "");
	void SetPanelTextBackgroundColor(UINT color, String panel_guid = "");
	void SetPanelTextFont(IGdiFont, String panel_guid = "");
	void RunPanelContextMenu(String cmd, String panel_guid = "");
	void SetLyricCallback(callback);
}
*/

//flags
PanelUIMode = {
	MODE_UI: 0,
	MODE_CUSTOM: 1
}

PanelTextRenderer = {
	RENDERER_GDI: 0,
	RENDERER_GDIP: 1
}

PanelBackgroundType = {
	BACKGROUND_SOLID_COLOR: 0,
	BACKGROUND_IMAGE: 1
}

PanelBackgroundSource = {
	BACKGROUND_SRC_ALBUM_ART: 0,
	BACKGROUND_SRC_CUSTOM: 1,
	BACKGROUND_SRC_WSH: 0,
}

PanelBackgroundImagePos = {
	IMAGE_POS_FILL: 0,
	IMAGE_POS_FIT: 1,
	IMAGE_POS_STRETCH: 2,
	IMAGE_POS_CENTER: 3,
}

//helpers
function RGB(r, g, b) {
	return (0xff000000 | (r << 16) | (g << 8) | (b));
}



//ommit error handling...
var esl = new ActiveXObject("ESLyric");

//set highlight text color of all eslyric panels
esl.SetPanelTextHighlightColor(RGB(0, 255, 0));

//change normal text color of specified panel 
//to get the guid of panel, press 'CTRL' and then popup context menu, click 'Panel Info'
var esl_panel_guid = "B2767C0C-73DF-401B-B2EF-F05C9400348A";
esl.SetPanelTextHighlightColor(RGB(255, 255, 0), esl_panel_guid);

//set backgound
var g_img;
var g_img_cookie;
g_img_cookie = gdi.gdi.LoadImageAsync(window.ID, "c:\\path\\to\\image.jpg");

function on_load_image_done(cookie, image) 
{
    if (cookie == g_img_cookie) 
    {
        g_img && g_img.Dispose();
        g_img = image;
        esl.SetPanelBackgroundImage(g_img);
    }
}

//exec context command
esl.RunPanelContextMenu("Search...");
//or
esl.RunPanelContextMenu("Align/Left");
