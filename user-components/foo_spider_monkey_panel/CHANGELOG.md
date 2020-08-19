# Changelog

#### Table of Contents
- [Unreleased](#unreleased)
- [1.3.1](#131---2020-07-18)
- [1.3.0](#130---2020-07-10)
- [1.2.3](#123---2020-01-04)
- [1.2.2](#122---2019-09-14)
- [1.2.1](#121---2019-04-24)
- [1.2.0](#120---2019-04-22)
- [1.1.5](#115---2019-01-21)
- [1.1.4](#114---2019-01-20)
- [1.1.3](#113---2019-01-17)
- [1.1.2](#112---2019-01-09)
- [1.1.1](#111---2018-11-20)
- [1.1.0](#110---2018-11-19)
- [1.0.5](#105---2018-11-06)
- [1.0.4](#104---2018-10-25)
- [1.0.3](#103---2018-10-11)
- [1.0.2](#102---2018-10-05)
- [1.0.1](#101---2018-10-05)
- [1.0.0](#100---2018-10-01)

___

## [Unreleased][]

## [1.3.1][] - 2020-07-18
### Fixed
- Fixed `FbTooltip.SetFont()` not working.
- Fixed a memory leak when using `window.Tooltip`.
- Fixed task id collision in `gdi.LoadImageAsync()`.

## [1.3.0][] - 2020-07-10
### Added
- Re-added ability to automatically download thumbnail images to `thumbs.js` sample (by marc2003).
- Added missing documentation for `fb.GetDSPPresets()` and `fb.SetDSPPreset()`.
- API changes:
  - Added `GdiBitmap.InvertColours()` method.
  - Added `ActiveXObject.ActiveX_CreateArray()` method.
  - Added `window.Tooltip` property.
  - Added `FbTooltip.SetFont()` method.
  - Deprecated `window.CreateTooltip()` method.

### Changed
- Updated SpiderMonkey JavaScript engine to 68.8.0 ESR:
  - ECMAScript 2019 conformant JavaScript.
  - Various performance improvements and bug fixes.
- Adjusted a "Function failed successfully" error message (e.g. when running out of GDI handles).
- Updated `Tooltip` sample.

### Fixed
- Fixed incorrect sorting in `FbMetadbHandleList.OrderByRelativePath()`.
- Fixed `fb.GetDSPPresets()`: now it returns a proper value.
- Fixed `fb.IsMainMenuCommandChecked()` not working with hidden by default menu items.
- Fixed garbled error messages on systems with non-English locale.
- Fixed `Replace All` action and RegExp handling in `Find/Replace` dialog.
- Fixed crash in some of `.js` samples when deleting a file via context menu.

## [1.2.3][] - 2020-01-04
### Added
- Moved documentation from Wiki to a new homepage: <https://theqwertiest.github.io/foo_spider_monkey_panel>:
  - Contains JS documentation for the latest release.
  - Contains script showcase with basic information about sample scripts and user-made scripts.
- Updated `FindReplace` dialog in `Configure`:
  - Added wrap-around support.
  - Dialog is transparent when unfocused.
- Made `Go to` dialog in `Configure` modeless.

### Changed
- Reimplemented `FbMetadbHandleList::OrderByRelativePath()`:
  - Uses MUCH less memory.
  - Faster by 10% (on sorted list) to 500% (on unsorted list).
- Adjusted codepage detection with various file handling methods.
- Adjusted playlist lock check during drag-n-drop and `plman.AddLocations()`: now only `playlist_lock::filter_add` flag is checked.
- Removed unneeded `on_size()` call.
- Adjusted component initialization time reported in console to be more accurate.
- Updated marc2003 scripts: 
  - Note: `ListenBrainz` sample was removed - use <https://github.com/marc2k3/foo_listenbrainz2> instead.

### Fixed
- Fixed rare crash when using `utils.RunMainMenuCommand()` and `utils.IsMainMenuCommandChecked()`.
- Fixed crash when working with COM on systems with non-English locale.
- Fixed `window.GetProperty()` not working when name contained whistespace at the beggining.
- Fixed other various crashes.
- Fixed occasional double error report in console.
- Fixed crashes in `jsplaylist-mod` and other complete samples (by marc2003).

## [1.2.2][] - 2019-09-14
### Added
- API changes:
  - Added global constructor for `GdiFont`.
  - Added support for passing arguments to the callback in `setInterval()` and `setTimeout()`.

### Changed
- More accurate colour calculation in `GetColourScheme()` and `GetColourSchemeJson()`.
- Made GetColourXXX and GetFontXXX behaviour more consistent:
  - GetColourXXX always returns black colour when the requested one is not available.
  - GetFontXXX always returns null when the required font is not found.
- Tweaked GC behaviour to reduce memory consumption during panel reload.
- Updated `HtmlDialogWithCheckBox` sample.

### Fixed
- A lot of fixes to `utils.ShowHtmlDialog()`:
  - Fixed an occasional fb2k crash.
  - Added proper shortcut handling (e.g. CTRL-C, CTRL-V).
  - Fixed `enter` key always closing the dialog.
  - Fixed incorrect handling of some keyboard events (e.g. space and tab keys).
- Fixed `FbUiSelectionHolder.SetPlaylistSelectionTracking()` not working.
- Fixed fb2k crash when there is an error in a cached script.
- Fixed slow script handler triggering wrongly with some modal dialogs.
- Fixed error report being blank in some cases.
- Fixed docs for `FbMetadbHandle.GetFileInfo()`: was missing info about return value.
- Fixed crashes in `jsplaylist-mod`, `js-smooth`, `thumbs` and other complete samples (by marc2003).

## [1.2.1][] - 2019-04-24
### Fixed
- Fixed another fb2k freeze on exit.

## [1.2.0][] - 2019-04-22
### Added
- Improved `include()` method:
  - Added support for relative paths.
  - Added script caching - script file will be read only once from filesystem (even if it is included from different panels).
    Improves panel initialization speed when re-using same script files.
  - Added *include guard* - script won't be evaluated a second time if it was evaluated before in the same panel (handled by new `options.always_evaluate` argument).
- Added slow script handling: script can be aborted now if it's unresponsive for some time.

### Changed
- Improved performance of `utils.FileTest(path, 's')`.

### Fixed
- Fixed crashes in `Thumbs` and `Album Art` complete samples (by marc2003).
- Fixed `GdiBitmap.GetColourScheme()` not limiting the number of output colours.
- Fixed potential memory leaks when using `window.NotifyOthers()`.
- Tweaked GC to reduce the memory footprint.
- Fixed fb2k freeze on exit.
- Fixed invalid colour calculation in `GdiBitmap.GetColourSchemeJSON()`.
- Fixed colour rounding errors in `GdiBitmap.GetColourScheme()` and `GdiBitmap.GetColourSchemeJSON()`.

## [1.1.5][] - 2019-01-21
### Changed
- Panel Properties now uses JSON format by default for export.

### Fixed
- Fixed incorrect parsing of UCS-2 LE encoded files.

## [1.1.4][] - 2019-01-20
### Fixed
- Fixed `fb.RunContextCommandWithMetadb()` not working with most commands.

## [1.1.3][] - 2019-01-17
### Changed
- Removed image resizing for `custom_image` in `fb.DoDragDrop()` when image is smaller than the drag window.
- All file dialogs now remember last used location.

### Fixed
- Fixed `Last.fm Similar Artists + User Charts + Recent Tracks` script crash.
- Fixed callbacks not triggering when `MenuObject.TrackPopupMenu()` or default context menu is active.

## [1.1.2][] - 2019-01-09
### Added
- Added additional options to `fb.DoDragDrop()`: `show_text`, `use_album_art`, `use_theming` and `custom_image`.
- By default `fb.DoDragDrop()` now displays an album art of the dragged item (if available).

### Changed
- Cleaned up `Panel Configuration` dialog:
  - Moved all buttons and checkboxes to menu bar.
  - Added `Help` button, which opens supplied html documentation.
  - `Export`\\`Import` now use `*.js` extension by default.

### Fixed
- Fixed callbacks not triggering when `fb.DoDragDrop()` is active.
- Fixed `on_colours_changed()` callback not triggering in DUI.
- Fixed several fb2k crashes when triggerring script error.
- Fixed several fb2k freezes when fetching album art through 3rd party components.
- Fixed a few more fb2k freezes.
- Fixed `utils.ReadTextFile()` not working with empty files.
- Fixed `utils.GetAlbumArtAsync()` not working in some cases.
- Removed extra quotes in `console.log()` when printing strings outside of objects and arrays.
- Fixed occasional EOL issues in error report.

## [1.1.1][] - 2018-11-20
### Fixed
- Fixed error in object constructor when it is invoked with data from `on_notify_data()` callback.

## [1.1.0][] - 2018-11-19
### Added
- Improved drag-n-drop window:
  - Image displays number of tracks being dragged.
  - Tooltip text describes the performed drop action (configurable through `action.Text` field).
- API changes:
  - Added `clearInterval()`, `clearTimeout()`, `setInterval()`, `setTimeout()` methods to global namespace.
  - Added `gdi.LoadImageSyncV2()` method.
  - Added `utils.GetAlbumArtAsyncV2()` method.
  - Added arguments to `FbProfiler.Print()`: additional message and an option to disable component info.
  - Added global constructors for the following objects:
    - `FbMetadbHandleList`: from another `FbMetadbHandleList`, from an array of `FbMetadbHandle`, from a single `FbMetadbHandle` and a default constructor.
    - `GdiBitmap`: from another `GdiBitmap`.
    - `FbProfiler`: accepts the same arguments as `fb.CreateProfiler()`.
    - `FbTitleFormat`: accepts the same arguments as `fb.TitleFormat()`.
- Improved logging of objects through `console.log`: now it displays object's content as well.
- Added documentation link to default context menu (accessible via `WIN-SHIFT-RightClick`).
- Added `callbacks` to HTML documentation.
- Updated basic samples with the new methods.

### Changed
- API changes:
  - `fb.DoDragDrop()` now requires an additional `window.ID` argument.
  - `fb.CreateHandleList()` is marked as **\[Deprecated]** and will be removed in v2.0.0.
- Reimplemented SMP call handling so as to conform with `Run to completion` rule.
- Made adjustment to GC policies.

### Fixed
- `FbMetadbHandle.FileSize` returns -1 properly now when file size is not available.

## [1.0.5][] - 2018-11-06
### Added
- Added basic handling of exception-like objects and objects derived from `Error` in pre-ES6 style.
- Added handling of unhandled rejected promises.
- API changes:
  - Added properties to `window` for memory usage tracking: `MemoryLimit`, `TotalMemoryUsage` and `PanelMemoryUsage`.

### Fixed
- Fixed timing of promises invocation: now conforms to ES standard.
- Fixed several memory leaks on panel layout switch and on script error.
- Fixed crash on in-panel layout switch.

## [1.0.4][] - 2018-10-25
### Added
- Added HTML documentation.
- Improved error reports of component startup failures.
- Ported JScript Panel changes:
  - Added `FbMetadbHandleList.RemoveAttachImages()` method.

### Changed
- Improved `include()` performance by 2x.
- Tweaked GC for better UX during high load.
- Rewrote `plman.PlaylistRecyclerManager`, since it was broken:
  - Replaced `Name` property with `GetName()` method.
  - Replaced `Content` property with `GetContent()` method.
  - Renamed to `plman.PlaylistRecycler`.
- Rewrote `Interfaces.js`
  - Fixed invalid and incorrect JSDoc tags.
  - Renamed to `foo_spider_monkey_panel.js`.

### Fixed
- Fixed crash when `on_main_menu()` callback was invoked.
- Fixed crash when switching layout from inside the panel.
- Fixed occasional crash on panel removal.
- Fixed incorrect handling of UTF-16 BOM files in `include()` and `utils.ReadTextFile()`.
- Fixed `ThemeManager.DrawThemeBackground()`: was ignoring `state_id` argument.
- Fixed invalid calculation of image size, which resulted in premature OOM errors.

## [1.0.3][] - 2018-10-11
### Changed
- Reimplemented `utils.ShowHtmlDialog()`. It's no longer considered **\[Experimental]** and is safe to use.
- Updated `Interfaces.js`:
  - Updated `utils.ShowHtmlDialog()` doc.
  - Updated `fb.DoDragDrop()` doc.
  - Updated `fb.IsMainMenuCommandChecked()` doc.
- Updated `ActiveXObject.js`: added info on helper methods `ActiveX_Get()`/`ActiveX_Set()`.

## [1.0.2][] - 2018-10-05
### Fixed
- Fixed regression in `ActiveXObject` handling.

## [1.0.1][] - 2018-10-05
### Added
- Integrated `foo_acfu` update checks.
- Added Scintilla line-wrap settings to `Preferences > Tools > Spider Monkey Panel`.

### Changed
- **\[Experimental]** Replaced `utils.CreateHtmlWindow()` with `utils.ShowHtmlDialog()`.
- Updated `Interfaces.js`:
  - Updated `window.GetProperty()`/`window.SetProperty()` docs.
  - Updated `utils.Version` doc.
  - Updated `FbMetadbHandleList.UpdateFileInfoFromJSON()` doc.

### Fixed
- Disabled callback invocation until script is fully evaluated.
- Fixed `fb.RunContextCommandWithMetadb()`.
- Fixed samples:
  - Removed left-over `.Dispose()` calls.
  - Rewrote HTML dialog sample (HtmlDialogWithCheckBox.txt).
- Added a few fixes to `ActiveXObject` for better compatibility.

## [1.0.0][] - 2018-10-01
### Added
- Added stack trace to error reports.
- API changes:
  - JavaScript is now conformant to ES2017 standard.
  - All arrays now can be accessed directly with [] operator (no need for `toArray()` cast).
  - FbMetadbHandleList items now can be accessed with [] operator.
  - Added global `include()` method.
  - Added `window.DefinePanel()` method.
  - **\[Experimental]** Added `utils.CreateHtmlWindow()` method.

### Changed
- Rewrote component to use Mozilla SpiderMonkey JavaScript engine.
- Windows 7 is the minimum supported OS now.
- API changes:
  - All methods and properties are case-sensitive as required by ECMAScript standard.
  - Removed `Dispose()` and `toArray()` methods.
  - Removed `FbMetadbHandleList.Item()` method.
  - Removed old `==PREPROCESSOR==` panel header support.
  - `utils.Version` returns string instead of number.
  - More rigorous error checks.
- Updated samples with compatibility fixes.

[unreleased]: https://github.com/theqwertiest/foo_spider_monkey_panel/compare/v1.3.1...HEAD
[1.3.1]: https://github.com/TheQwertiest/foo_spider_monkey_panel/compare/v1.3.0...v1.3.1
[1.3.0]: https://github.com/TheQwertiest/foo_spider_monkey_panel/compare/v1.2.3...v1.3.0
[1.2.3]: https://github.com/TheQwertiest/foo_spider_monkey_panel/compare/v1.2.2-preview...v1.2.3
[1.2.2]: https://github.com/TheQwertiest/foo_spider_monkey_panel/compare/v1.2.1...v1.2.2-preview
[1.2.1]: https://github.com/TheQwertiest/foo_spider_monkey_panel/compare/v1.2.0...v1.2.1
[1.2.0]: https://github.com/TheQwertiest/foo_spider_monkey_panel/compare/v1.1.5...v1.2.0
[1.1.5]: https://github.com/TheQwertiest/foo_spider_monkey_panel/compare/v1.1.4...v1.1.5
[1.1.4]: https://github.com/TheQwertiest/foo_spider_monkey_panel/compare/v1.1.3...v1.1.4
[1.1.3]: https://github.com/TheQwertiest/foo_spider_monkey_panel/compare/v1.1.2...v1.1.3
[1.1.2]: https://github.com/TheQwertiest/foo_spider_monkey_panel/compare/v1.1.1...v1.1.2
[1.1.1]: https://github.com/TheQwertiest/foo_spider_monkey_panel/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/TheQwertiest/foo_spider_monkey_panel/compare/v1.0.5...v1.1.0
[1.0.5]: https://github.com/TheQwertiest/foo_spider_monkey_panel/compare/v1.0.4...v1.0.5
[1.0.4]: https://github.com/TheQwertiest/foo_spider_monkey_panel/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/TheQwertiest/foo_spider_monkey_panel/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/TheQwertiest/foo_spider_monkey_panel/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/TheQwertiest/foo_spider_monkey_panel/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/TheQwertiest/foo_spider_monkey_panel/compare/vanilla_2_0...v1.0.0
