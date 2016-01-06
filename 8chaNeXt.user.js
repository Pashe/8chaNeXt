// ==UserScript==
// @name        Pashe's 8chaNeXt
// @version     0.0.1452040250
// @description Small userscript to improve Infinity Next
// @icon        https://cdn.rawgit.com/Pashe/8chanX/2-0/images/logo.svg
// @namespace   https://github.com/Pashe/8chaNeXt/tree/2-0
// @updateURL   https://github.com/Pashe/8chaNeXt/raw/0-0/8chaNeXt.meta.js
// @downloadURL https://github.com/Pashe/8chaNeXt/raw/0-0/8chaNeXt.user.js

// @grant       unsafeWindow

// @require     https://code.jquery.com/jquery-2.1.3.min.js
// @require     https://code.jquery.com/ui/1.11.2/jquery-ui.min.js
// @require     https://github.com/alexei/sprintf.js/raw/master/src/sprintf.js
// @require     https://raw.githubusercontent.com/rmm5t/jquery-timeago/master/jquery.timeago.js
// @require     https://raw.githubusercontent.com/samsonjs/strftime/master/strftime.js

// @match       *://beta.8ch.net/*
// ==/UserScript==

/*Contributors
** tux3
** Zaphkiel
** varemenos
** 7185
** anonish
** Pashe
*/

function chxErrorHandler(e, section) {
	console.error(e);
	console.trace();
	
	var rptObj = { //Chrome needs this
		name:          e?(e.name||"unknown"):"VERY unknown",
		msg:           e?(e.message||"unknown"):"VERY unknown",
		file:          e?((e.fileName||"unknown").split("/").slice(-1).join("")):"VERY unknown",
		line:          e?(e.lineNumber||"?"):"???",
		col:           e?(e.columnNumber||"?"):"???",
		section:       (section||"unknown"),
		scriptName:    (GM_info&&GM_info.script)?(GM_info.script.name||"unknown"):"VERY unknown",
		scriptVersion: (GM_info&&GM_info.script)?(GM_info.script.version||"unknown"):"VERY unknown",
		gmVersion:     (GM_info&&GM_info.version)?(GM_info.version||"unknown"):"VERY unknown",
		activePage:    unsafeWindow?(unsafeWindow.active_page||"unknown"):"VERY unknown",
		browser:       (unsafeWindow&&unsafeWindow.navigator)?((unsafeWindow.navigator.userAgent||"unknown").match(/(Chrom\S*|\S*fox\/\S*|Ice\S*)/gi)||["unknown"]).join(", "):"VERY unknown",
		userAgent:     (unsafeWindow&&unsafeWindow.navigator)?(unsafeWindow.navigator.userAgent||"unknown"):"VERY unknown",
		location:      (unsafeWindow&&unsafeWindow.location)?(unsafeWindow.location.href||"unknown"):"VERY unknown",
		stack:         e?((e.stack||"unknown").replace(/file:[^ \n]*\//g, "file:").replace(/^/gm, "  ")):"VERY unknown",
	};
	
	console.error(sprintf(
		"8chaNeXt experienced an error. Please include the following information with your report:\n"+ 
		"[code]%s in %s/%s @ L%s C%s: %s\n\nVersion: %s (2-0@%s)\nGreasemonkey: %s\nActive page: %s\nBrowser: %s\nUser agent: %s\nLocation: %s\nStack:\n%s[/code]",
		rptObj.name, rptObj.file, rptObj.section, rptObj.line, rptObj.col, rptObj.msg,
		rptObj.scriptName, rptObj.scriptVersion,
		rptObj.gmVersion,
		rptObj.activePage,
		rptObj.browser,
		rptObj.userAgent,
		rptObj.location,
		rptObj.stack
	));
	
	alert("8chaNeXt experienced an error. Check the console for details (typically F12).");
}

try {
	var settings = {};
	
	function getSetting(key) {
		if (settings.hasOwnProperty(key)) {
			return settings[key];
		} else {return false;}
	}
	
	////////////////
	//INIT FUNCTIONS
	////////////////
	function initFormattedTime() { //Pashe, WTFPL
		$("time").text(function() {
			var $this = $(this);
			
			if (!getSetting("dateFormat")) {
				return this.title;
			} else {
				//%Y-%m-%d %H:%M:%S is nice
				var thisDate = new Date($this.attr("datetime"));
				
				if (getSetting("localTime")) {
					return strftime(getSetting("dateFormat"), thisDate);
				} else {
					return strftimeUTC(getSetting("dateFormat"), thisDate);
				}
			}
		});
	}
	
	$(unsafeWindow.document).ready(function() { try {
		//initSettings();
		//initBRLocalStorage();
		//initDefaultSettings();
		//initMenu();
		//initCatalog();
		//initFilter();
		initFormattedTime();
		//initMascot();
		//initRevealImageSpoilers();
		//initRISLinks();
		//initParseTimestampImage();
		//initNotifications();
		//initFlagIcons();
		//initKeyboardShortcuts();
		//initpurgeDeadFavorites();
		//initClearLocalStorage();
		//initClearChxSettings();
		//initFavicon();
	} catch(e) {chxErrorHandler(e, "ready");}});
} catch(e) {chxErrorHandler(e, "global");}