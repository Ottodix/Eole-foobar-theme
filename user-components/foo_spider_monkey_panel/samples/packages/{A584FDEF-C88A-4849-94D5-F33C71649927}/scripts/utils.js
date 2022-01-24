let my_utils = {}

my_utils.scriptInfo = window.ScriptInfo;
my_utils.packageInfo = utils.GetPackageInfo(my_utils.scriptInfo.PackageId);
my_utils.showScriptInfo = function() {
    let si = my_utils.scriptInfo;
    fb.ShowPopupMessage(`Package information: ${si.Name} v${si.Version} by ${si.Author}`);
};
my_utils.loadAndDisplayAsset = function(assetFile) {
    let content = utils.ReadTextFile(`${my_utils.packageInfo.Directories.Assets}/${assetFile}`);
    fb.ShowPopupMessage(`Asset '${assetFile}' content:\n${content}`);
};
