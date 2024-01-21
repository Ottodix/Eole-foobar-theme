/** @module callbacks **/

/*
 * !!! Do NOT include this whole file !!!
 *
 * Only copy those callbacks that you actually need.
 */

/**
 * Called when "Always On Top" state changes: from using the menu, Alt + A, {@link fb.AlwaysOnTop} and etc.
 * 
 * @param {boolean} state
 */
function on_always_on_top_changed(state) { }

/**
 * Note: in order to use this callback, use {@link window.DlgCode}(DLGC_WANTCHARS).<br>
 * See Flags.js > DLGC_WANTCHARS.
 *
 * @param {number} code UTF16 encoded char
 */
function on_char(code) { }

/**
 * Called when colours are changed via default UI/columns UI preferences.<br>
 * Note: use {@link window.GetColourCUI}/{@link window.GetColourDUI} to get new colours.
 * 
 */
function on_colours_changed() { }

/**
 * Called when "cursor follow playback" state is changed.
 *
 * @param {boolean} state current "cursor follow playback" value
 */
function on_cursor_follow_playback_changed(state) { }

/**
 * See {@link fb.DoDragDrop} documentation and samples/basic/DragnDrop.txt
 *
 * @param {DropTargetAction} action
 * @param {number} x
 * @param {number} y
 * @param {number} mask see Flags.js > Mask
 */
function on_drag_drop(action, x, y, mask) { }

/**
 * See {@link fb.DoDragDrop} documentation and samples/basic/DragnDrop.txt
 *
 * @param {DropTargetAction} action
 * @param {number} x
 * @param {number} y
 * @param {number} mask see Flags.js > Mask
 */
function on_drag_enter(action, x, y, mask) { }

/**
 * See {@link fb.DoDragDrop} documentation and samples/basic/DragnDrop.txt
 *
 * @function
 */
function on_drag_leave() { }

/**
 * See {@link fb.DoDragDrop} documentation and samples/basic/DragnDrop.txt
 *
 * @param {DropTargetAction} action
 * @param {number} x
 * @param {number} y
 * @param {number} mask see Flags.js > Mask
 */
function on_drag_over(action, x, y, mask) { }

/**
 * Called when DSP preset changes.<br>
 * Note: this callback is only available in foobar2000 v1.4 and later.<br>
 * Note2: does not get called when presets are added or removed.
 *
 */
function on_dsp_preset_changed() { }

/**
 *  Called when the panel gets or loses focus.
 *
 * @param {boolean} is_focused New focus state
 */
function on_focus(is_focused) { }

/**
 * Called when fonts are changed via DUI or CUI preferences.
 * Note: you can retrieve fonts using {@link window.GetFontDUI}/{@link window.GetFontCUI}.
 * 
 */
function on_font_changed() { }

/**
 * Called when thread created by {@link utils.GetAlbumArtAsync} is done.
 *
 * @param {FbMetadbHandle} handle
 * @param {number} art_id See Flags.js > AlbumArtId
 * @param {?GdiBitmap} image null on failure
 * @param {string} image_path path to image file (or music file if image is embedded)
 */
function on_get_album_art_done(handle, art_id, image, image_path) { }

/**
 * Called when focused item in playlist has been changed.
 *
 * @param {number} playlistIndex
 * @param {number} from index of the previous focused item or -1 if there was no focused item.
 * @param {number} to index of the new focued item
 */
function on_item_focus_change(playlistIndex, from, to) { }

/**
 * Called when at least one minute of the track has been played or the track has reached
 * its end after at least 1/3 of it has been played through.
 *
 * @param {FbMetadbHandle} handle
 */
function on_item_played(handle) { }

/**
 * Requires "Grab focus" enabled in the Configuration window.<br>
 * In order to use arrow keys, use {@link window.DlgCode}(DLGC_WANTARROWS) (see Flags.js > DLGC_WANTARROWS).<br>
 * <br>
 * Note: keyboard shortcuts defined in the main preferences are always executed first
 * and are not passed to the callback.
 *
 * @param {number} vkey Virtual Key Code, refer to {@link http://msdn.microsoft.com/en-us/library/ms927178.aspx}
 */
function on_key_down(vkey) { }

/**
 * Requires "Grab focus" enabled in the Configuration window.<br>
 * In order to use arrow keys, use {@link window.DlgCode}(DLGC_WANTARROWS) (see Flags.js > DLGC_WANTARROWS).
 *
 * @param {number} vkey Virtual Key Code, refer to {@link http://msdn.microsoft.com/en-us/library/ms927178.aspx}
 */
function on_key_up(vkey) { }

/**
 * @param {FbMetadbHandleList} handle_list
 */
function on_library_items_added(handle_list) { }

/**
 * @param {FbMetadbHandleList} handle_list
 */
function on_library_items_changed(handle_list) { }

/**
 * @param {FbMetadbHandleList} handle_list
 */
function on_library_items_removed(handle_list) { }

/**
 * Called when thread created by {@link gdi.LoadImageAsync} is done.
 *
 * @param {number} cookie the return value from the {@link gdi.LoadImageAsync} call
 * @param {?GdiBitmap} image null on failure (invalid path/not an image)
 * @param {string} image_path the path that was originally supplied to {@link gdi.LoadImageAsync}
 */
function on_load_image_done(cookie, image, image_path) { }

/**
 * On the main menu>File>Spider Monkey Panel, there are 10 menu items and whichever number
 * is selected is sent as the "index" to this callback. <br>
 * Being main menu items now means you can bind them to global keyboard shortcuts, standard toolbar buttons, panel stack splitter
 * buttons, etc.<br>
 * Remember to think carefully about where you use this code as you probably only
 * want it to run once and so don't include it in common files and scripts where you might have
 * multiple instances.<br>
 * Important: you should avoid sharing scripts containing this code so as not to conflict with what other users may already be using.
 *
 * Deprecated: use {@link module:callbacks~on_main_menu_dynamic on_main_menu_dynamic} instead.
 *
 * @deprecated
 * 
 * @param {number} index
 *
 * @example
 * function on_main_menu(index) {
 *     switch (index) {
 *     case 1: // triggered when File>Spider Monkey Panel>1 is run
 *         do_something();
 *         break;
 *     case 2: // triggered when File>Spider Monkey Panel>2 is run
 *         do_something_else();
 *         break;
 *     }
 * }
 */
function on_main_menu(index) { }

/**
 * Called whe one of the commands corresponding to this panel from `main menu`>`File`>`Spider Monkey Panel`>`Script commands` is executed.<br>
 * <br>
 * Related methods: {@link fb.RegisterMainMenuCommand}, {@link fb.UnregisterMainMenuCommand}
 *
 * @param {number} command_id Id of the associated command
 */
function on_main_menu_dynamic(command_id) { }

/**
 * Called when metadb contents change.
 *
 * @param {FbMetadbHandleList} handle_list affected items
 * @param {boolean} fromhook true if notification is not from tag update, but a component that provides
 *                           tag-like data from a database. E.g. foo_playcount and {@link FbMetadbHandle#RefreshStats}
 */
function on_metadb_changed(handle_list, fromhook) { }

/**
 * @param {number} x
 * @param {number} y
 * @param {number} mask see Flags.js > Mask
 */
function on_mouse_lbtn_dblclk(x, y, mask) { }

/**
 * @param {number} x
 * @param {number} y
 * @param {number} mask see Flags.js > Mask
 */
function on_mouse_lbtn_down(x, y, mask) { }

/**
 * @param {number} x
 * @param {number} y
 * @param {number} mask see Flags.js > Mask
 */
function on_mouse_lbtn_up(x, y, mask) { }

/**
 * @function
 */
function on_mouse_leave() { }

/**
 * @param {number} x
 * @param {number} y
 * @param {number} mask see Flags.js > Mask
 */
function on_mouse_mbtn_dblclk(x, y, mask) { }

/**
 * @param {number} x
 * @param {number} y
 * @param {number} mask see Flags.js > Mask
 */
function on_mouse_mbtn_down(x, y, mask) { }

/**
 * @param {number} x
 * @param {number} y
 * @param {number} mask see Flags.js > Mask
 */
function on_mouse_mbtn_up(x, y, mask) { }

/**
 * @param {number} x
 * @param {number} y
 * @param {number} mask see Flags.js > Mask
 */
function on_mouse_move(x, y, mask) { }

/**
 * @param {number} x
 * @param {number} y
 * @param {number} mask see Flags.js > Mask
 */
function on_mouse_rbtn_dblclk(x, y, mask) { }

/**
 * @param {number} x
 * @param {number} y
 * @param {number} mask see Flags.js > Mask
 */
function on_mouse_rbtn_down(x, y, mask) { }

/**
 * You must return true, if you want to suppress the default context menu.<br>
 * Note: left shift + left windows key will bypass this callback and will open default context menu.
 *
 * @param {number} x
 * @param {number} y
 * @param {number} mask see Flags.js > Mask
 * 
 * @retuen {boolean}}
 */
function on_mouse_rbtn_up(x, y, mask) { }

/**
 * Scroll up/down
 *
 * @param {number} step scroll direction: -1 or 1
 */
function on_mouse_wheel(step) { }
// 

/**
 * Scroll left/right
 *
 * @param {number} step scroll direction: -1 or 1
 */
function on_mouse_wheel_h(step) { }

/**
 * Called in other panels after {@link window.NotifyOthers} is executed.<br>
 * <br>
 * <b>!!! Beware !!!</b><br>
 * 1. Data from `info` argument is only accessible inside `on_notify_data` callback:
 *    if stored and accessed outside of the callback it will throw JS error.<br>
 *    This also applies to the data produced from that `info`: e.g. storing `info.Path` directly (if `info` is FbMetadbHandle).<br>
 * 2. If you want to store the data from `info` you have to perform a deep copy:<br>
 *    - `String(info)` for strings.<br>
 *    - `JSON.parse(JSON.stringify(info))` for serializable objects.<br>
 *    - `new ObjectType(info)` for objects that have an approppriate constructor available, e.g. `new GdiBitmap(info)` or `new FbMetadbHandleList(info)`.<br>
 * 3. `info` argument is shared between panels, so it should NOT be modified in any way.
 *
 * @param {string} name
 * @param {*} info
 */
function on_notify_data(name, info) { }

/**
 * Called when output device changes. Use {@link fb.GetOutputDevices} to retrieve settings.<br>
 * Note: available only in foobar2000 v1.4 and later.
 * 
 * @function
 */
function on_output_device_changed() { }

/**
 * Called when window is ready to draw.
 *
 * @param {GdiGraphics} gr
 */
function on_paint(gr) { }

/**
 * Called when "playback follow cursor" state is changed.
 *
 * @param {boolean} state current "playback follow cursor" value
 */
function on_playback_follow_cursor_changed(state) { }

/**
 * Called when dynamic info (VBR bitrate etc) changes.
 *
 * @function
 */
function on_playback_dynamic_info() { }

/**
 * Called when Per-track dynamic info (stream track titles etc) changes.
 * Happens less often than {@link module:callbacks~on_playback_dynamic_info on_playback_dynamic_info}.
 *
 * @function
 */
function on_playback_dynamic_info_track() { }

/**
 * Called when currently playing file gets edited.<br>
 * It's also called by components that provide tag-like data such as foo_playcount.
 *
 * @param {FbMetadbHandle} handle
 */
function on_playback_edited(handle) { }

/**
 * Playback advanced to the new track.
 *
 * @param {FbMetadbHandle} handle
 */
function on_playback_new_track(handle) { }

/**
 * Called when playback order is changed.
 *
 * @param {any} new_order_index 
 *     - 0 Default<br>
 *     - 1 Repeat (Playlist)<br>
 *     - 2 Repeat (Track)<br>
 *     - 3 Random<br>
 *     - 4 Shuffle (tracks)<br>
 *     - 5 Shuffle (albums)<br>
 *     - 6 Shuffle (folders)
 */
function on_playback_order_changed(new_order_index) { }

/**
 * @param {boolean} state true when paused, false when unpaused.
 */
function on_playback_pause(state) { }

/**
 * @param {number} origin
 *     - 0 User added<br>
 *     - 1 User removed<br>
 *     - 2 Playback advance
 */
function on_playback_queue_changed(origin) { }

/**
 * @param {float} time new position in seconds
 */
function on_playback_seek(time) { }

/**
 * Playback process is being initialized.<br>
 * {@link module:callbacks~on_playback_new_track on_playback_new_track} should be called soon after this when first file is successfully opened for decoding.
 *
 * @param {number} cmd
 *     - 0 Default<br>
 *     - 1 Play<br>
 *     - 2 Plays the next track from the current playlist according to the current playback order<br>
 *     - 3 Plays the previous track from the current playlist according to the current playback order<br>
 *     - 4 settrack (internal fb2k value)<br>
 *     - 5 Plays a random track from the current playlist<br>
 *     - 6 resume (internal fb2k value)
 * @param {boolean} is_paused Current paused state
 * 
 */
function on_playback_starting(cmd, is_paused) { }

/**
 * @param {number} reason
 *     - 0 Invoked by user<br>
 *     - 1 End of file<br>
 *     - 2 Starting another track<br>
 *     - 3 Fb2k is shytting down<br>
 */
function on_playback_stop(reason) { }

/**
 * Called every second, for time display.
 *
 * @param {float} time current playback time in seconds
 */
function on_playback_time(time) { }

/**
 * @param {number} playlistIndex
 * @param {number} playlistItemIndex
 */
function on_playlist_item_ensure_visible(playlistIndex, playlistItemIndex) { }

/**
 * @param {number} playlistIndex
 */
function on_playlist_items_added(playlistIndex) { }

/**
 * @param {number} playlistIndex
 * @param {number} new_count
 */
function on_playlist_items_removed(playlistIndex, new_count) { }

/**
 * Changes selection too. Doesn't actually change the set of items that are selected or item having focus, just changes their order.
 *
 * @param {number} playlistIndex
 */
function on_playlist_items_reordered(playlistIndex) { }

/**
 * Workaround for some 3rd party playlist viewers not working with {@link module:callbacks~on_selection_changed on_selection_changed}.
 *
 * @function
 */
function on_playlist_items_selection_change() { }

/**
 * Called when "stop after current" is enabled/disabled.
 *
 * @param {boolean} state "stop after current" value
 */
function on_playlist_stop_after_current_changed(state) { }

/**
 * @function
 */
function on_playlist_switch() { }

/**
 * Called when:<br>
 * - Playlists are added/removed/reordered/renamed.<br>
 * - A playlist's lock status changes through the use of {@link plman.SetPlaylistLockedActions} or
 *   components such as `foo_utils` or `foo_playlist_attributes`.
 *
 * @function
 */
function on_playlists_changed() { }

/**
 * Note: available only in foobar2000 v1.4 and later.
 *
 * @param {number} new_mode
 *     - 0 None<br>
 *     - 1 Track<br>
 *     - 2 Album<br>
 *     - 3 Track/Album by Playback Order
 */
function on_replaygain_mode_changed(new_mode) { }

/**
 * Called when:<br>
 * - Panel script is reloaded via context menu > Reload.<br>
 * - Panel script is changed via panel menu > Configure.<br>
 * - fb2k is exiting normally.<br>
 * Not called when:<br>
 * - Script fails with error.<br>
 * - fb2k closed externally (e.g. killed with process manager).<br>
 * - fb2k fails with exception.
 *
 * @function
 */
function on_script_unload() { }

/**
 * Called when selection changes based on "File>Preferences>Display>Selection viewers".
 *
 * @function
 */
function on_selection_changed() { }

/**
 * Called when panel is resized.<br>
 * Note: width and height arguments have the same values as {@link window.Width} and {@link window.Height}.<br>
 * <b>IMPORTANT</b>: do NOT call {@link window.Repaint} from this callback!
 *
 * @param {number} width
 * @param {number} height
 */
function on_size(width, height) { }

/**
 * @param {float} val volume level in dB. Minimum is -100. Maximum is 0.
 */
function on_volume_change(val) { }
