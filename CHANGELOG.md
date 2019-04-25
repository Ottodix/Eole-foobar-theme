# Changelog

#### Table of Contents
- [1.0.0](#100---2019-04-25)
___


## [1.0.0][] - 2019-04-25
### Added
- Integrated `foo_acfu` update checks.
- Added Scintilla line-wrap settings to `Preferences > Tools > Spider Monkey Panel`.

### Changed
- **\[Experimental]** Replaced `utils.CreateHtmlWindow()` with `utils.ShowHtmlDialog()`.
- Updated `Interfaces.js`:
  - Updated `window.GetProperty()`/`window.SetProperty()` docs.
  - Updated `utils.Version` doc.
  - Updated `FbMetadbHandleList.UpdateFileInfoFromJSON` doc.

### Fixed
- Disabled callback invocation until script is fully evaluated.
- Fixed `fb.RunContextCommandWithMetadb()`.
- Fixed samples:
  - Removed left-over `.Dispose()` calls.
  - Rewrote HTML dialog sample (HtmlDialogWithCheckBox.txt).
- Added a few fixes to `ActiveXObject` for better compatibility.