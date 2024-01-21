'use strict';

class PopUpBox {
	constructor() {
		this.getHtmlCode();
		this.ok = true;
		this.soFeat = {clipboard: true, gecko: true}
	}

	// Methods

	confirm(msg_title, msg_content, btn_yes_label, btn_no_label, height_adjust, h_center, confirm_callback) {
		utils.ShowHtmlDialog(0, this.confirmHtmlCode, {
			data: [msg_title, msg_content, btn_yes_label, btn_no_label, height_adjust, h_center, confirm_callback]
		});
	}

	getHtmlCode() {
		let cssPath = `${my_utils.packagePath}/assets/html/`;
		if (this.getWindowsVersion() === '6.1') {
			cssPath += 'styles7.css';
		} else {
			cssPath += 'styles10.css';
		}
		this.configHtmlCode = my_utils.getAsset('\\html\\config.html').replace(/href="styles10.css"/i, `href="${cssPath}"`);
		this.inputHtmlCode = my_utils.getAsset('\\html\\input.html').replace(/href="styles10.css"/i, `href="${cssPath}"`);
		this.confirmHtmlCode = my_utils.getAsset('\\html\\confirm.html').replace(/href="styles10.css"/i, `href="${cssPath}"`);
	}

	getWindowsVersion() {
		let version = '';

		try {
			version = (WshShell.RegRead('HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\CurrentMajorVersionNumber')).toString();
			version += '.';
			version += (WshShell.RegRead('HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\CurrentMinorVersionNumber')).toString();
			return version;
		} catch (e) {}
		try {
			version = WshShell.RegRead('HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\CurrentVersion');
			return version;
		} catch (e) {}
		return '6.1';
	}

	config(ppt, cfg, dialogWindow, ok_callback, lang, recycler) {
		utils.ShowHtmlDialog(0, this.configHtmlCode, {
			data: [ppt, cfg, dialogWindow, window.IsTransparent, ok_callback, this.tf_callback, lang, recycler],
			resizable: true
		});
	}

	input(title, msg, ok_callback, input, def) {
		utils.ShowHtmlDialog(0, this.inputHtmlCode, {
			data: [title, msg, 'Cancel', ok_callback, input, def]
		});
	}
	
	isHtmlDialogSupported() {
		if (ppt.isHtmlDialogSupported != 2) return ppt.isHtmlDialogSupported;

		if (typeof doc === 'undefined' || !doc) {
			this.soFeat.gecko = false;
		}
		if (this.soFeat.gecko) {
			let cache = null;
			let clText = 'test';
			try {
				cache = doc.parentWindow.clipboardData.getData('Text');
			} catch (e) {}
			try {
				doc.parentWindow.clipboardData.setData('Text', clText); 
				clText = doc.parentWindow.clipboardData.getData('Text');
			} catch (e) {
				this.soFeat.clipboard = false;
			}
			if (cache) { // Just in case previous clipboard data is needed
				try {
					doc.parentWindow.clipboardData.setData('Text', cache);
				} catch (e) {}
			} 
			if (clText !== 'test') {
				this.soFeat.clipboard = false;
			}
		} else {
			this.soFeat.clipboard = false;
		}

		ppt.isHtmlDialogSupported = this.soFeat.gecko && this.soFeat.clipboard || this.isIEInstalled() ? 1 : 0;
		if (!ppt.isHtmlDialogSupported) {
		const caption = 'Show HTML Dialog';
			const prompt = 
`A feature check indicates that Spider Monkey Panel show html dialog isn't supported by the current operating system.

This is used to display options. The console will show alternatives on closing this dialog.

Occassionally, the feature check may give the wrong answer.

If you're using windows and have Internet Explorer support it should work, so enter 1 and press OK.

The setting is saved in panel properties as the first item and can be changed there later.

Supported-1; unsupported-0`;
			let ns = '';
			let status = 'ok'
			try {
				ns = utils.InputBox(0, prompt, caption, ppt.isHtmlDialogSupported, true);
			} catch(e) {
				status = 'cancel';
			}
			if (status != 'cancel') {
				ppt.isHtmlDialogSupported = ns == 0 ? 0 : 1;
			}
		}
		return ppt.isHtmlDialogSupported;
	}

	isIEInstalled() {
		const diskLetters = Array.from(Array(26)).map((e, i) => i + 65).map((x) => `${String.fromCharCode(x)}:\\`);
		const paths = ['Program Files\\Internet Explorer\\ieinstal.exe', 'Program Files (x86)\\Internet Explorer\\ieinstal.exe'];
		return diskLetters.some(d => {
			try { // Needed when permission error occurs and current SMP implementation is broken for some devices....
				return utils.IsDirectory(d) ? paths.some(p => utils.IsFile(d + p)) : false;
			} catch (e) {return false;}
		});
	}

	tf_callback(tf, tfAll, type, sFind, sReplace) {
		return cfg.preview(tf, tfAll, type, sFind, sReplace);
	}
}