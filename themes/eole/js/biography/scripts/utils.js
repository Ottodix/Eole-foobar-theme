let my_utils = {}

biography_root = theme_scripts_path+"\\biography";
biography_assets = biography_root+"\\assets\\";
biography_scripts = biography_root+"\\scripts\\";

my_utils.packagePath = biography_root;
my_utils.getAsset = assetFile => utils.ReadTextFile(biography_assets+`${assetFile}`);
my_utils.getImageAsset = assetFile => gdi.Image(biography_assets+`/images/${assetFile}`);
my_utils.getFlagAsset = assetFile => gdi.Image(biography_assets+`/images/flags/${assetFile}`); 
my_utils.getScriptPath = biography_scripts;
my_utils.packageInfo = {};
my_utils.packageInfo.Directories = {};
my_utils.packageInfo.Directories.Assets = biography_assets;
my_utils.packageInfo.Directories.Scripts = biography_scripts;
my_utils.packageInfo.Directories.Storage = ProfilePath+"yttm\\art_img";

//my_utils.scriptInfo = window.ScriptInfo;
//my_utils.packageInfo = utils.GetPackageInfo(my_utils.scriptInfo.PackageId);
//my_utils.packagePath = `${my_utils.packageInfo.Directories.Root}/`;

//my_utils.getAsset = assetFile => utils.ReadTextFile(`${my_utils.packageInfo.Directories.Assets}/${assetFile}`);
//my_utils.getImageAsset = assetFile => gdi.Image(`${my_utils.packageInfo.Directories.Assets}/images/${assetFile}`);
//my_utils.getFlagAsset = assetFile => gdi.Image(`${my_utils.packageInfo.Directories.Assets}/images/flags/${assetFile}`);
//my_utils.getScriptPath = `${my_utils.packageInfo.Directories.Scripts}/`;