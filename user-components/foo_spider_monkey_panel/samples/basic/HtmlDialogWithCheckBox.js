window.DefineScript('Html window with checkbox', {author: 'TheQwertiest'});

include('docs/Flags.js');

let WshShell = new ActiveXObject('WScript.Shell');

function get_windows_version() {
    let version = '';

    try {
        version = (WshShell.RegRead('HKLM/SOFTWARE/Microsoft/Windows NT/CurrentVersion/CurrentMajorVersionNumber')).toString();
        version += '.';
        version += (WshShell.RegRead('HKLM/SOFTWARE/Microsoft/Windows NT/CurrentVersion/CurrentMinorVersionNumber')).toString();

        return version;
    }
    catch (e) {
    }

    try {
        version = WshShell.RegRead('HKLM/SOFTWARE/Microsoft/Windows NT/CurrentVersion/CurrentVersion');

        return version;
    }
    catch (e) {
    }

    return '6.1';
}

const htmlCode = function() {
    let htmlCode = utils.ReadTextFile( `${fb.ComponentPath}samples/basic/html/PopupWithCheckBox.html`);
    
    let cssPath = `${fb.ComponentPath}samples/basic/html/`;
    if ( get_windows_version() === '6.1' ) {
        cssPath += 'styles7.css';
    }
    else {
        cssPath += 'styles10.css';
    }
    htmlCode = htmlCode.replace(/href="styles10.css"/i, `href="${cssPath}"`);
    return htmlCode;
}();

let ww = 0;
let wh = 0;
let text = '>> Click Me To Open Dialog <<';
let font = gdi.Font('Segoe Ui Semibold', 11);

function on_paint(gr) {
    gr.SetTextRenderingHint(TextRenderingHint.ClearTypeGridFit);
    gr.DrawString(text, font, 0xFF000000, 0, 0, ww, wh, 0x11000000);
}

function on_size(w,h) {
    ww = w;
    wh = h;
}

function on_mouse_lbtn_up() {
    utils.ShowHtmlDialog(0, htmlCode, {
        data: ['Html Window', 'This is an HTML notification window with a check box\n', '< Click me', window_ok_callback],            
    });
}

function window_ok_callback(status, clicked) {
    text = `Dialog was closed with ${status} and checkbox ${clicked}\n`
        + '>> Click Me To Open Dialog <<';
    window.Repaint();
}