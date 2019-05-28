var vb = {};
vb.Function = function (func) {
    return function () {
        return vb.Function.eval.call(this, func, arguments);
    };
};

vb.Function.eval = function (func) {
    var args = Array.prototype.slice.call(arguments[1]);
    for (var i = 0;
    i < args.length;
    i++) {
        if (typeof args[i] != 'string') {
            continue;
        };
        args[i] = args[i].replace(/"/g, '" + Chr(34) + "') ;
		args[i] = '"' + args[i].replace(/\n/g, '" + Chr(13) + "') + '"';		
    };
    var vbe = new ActiveXObject('ScriptControl');
    vbe.Language = 'VBScript';
    return vbe.Eval(func + '(' + args.join(', ') + ')');
};

var execution_counter = 0;
function on_paint(gr){
	gr.GdiDrawText(execution_counter, gdi.Font("Segoe UI", 12, 0), 0xff000000, 10, 10, 100, 100);
	execution_counter++;
	if(execution_counter==3){
		var MsgBox = vb.Function('MsgBox');
		var result = MsgBox("test slow script detection ?", 4, "Please confirm");		
	}
}
function on_playback_time(){
	window.Repaint();
}