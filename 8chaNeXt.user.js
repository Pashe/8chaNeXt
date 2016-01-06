// ==UserScript==
// @name        Pashe's 8chaNeXt
// @version     0.0.1452043750
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
	////////////////
	//SETTINGS
	////////////////
	var settings = {
		"imageHover": true,
		"parseTimestampImage": true,
	};
	
	function getSetting(key) {
		if (settings.hasOwnProperty(key)) {
			return settings[key];
		} else {return false;}
	}
	
	////////////////
	//GENERAL FUNCTIONS
	////////////////
	function isOnCatalog() {
		return !!location.pathname.match("catalog$"); //Fuck it
	}

	function isOnThread() {
		return !location.pathname.match("catalog$");
	}

	function getFileExtension(filename) { //Pashe, WTFPL
		if (filename.match(/\.([a-z0-9]+)(&loop.*)?$/i) !== null) {
			return filename.match(/\.([a-z0-9]+)(&loop.*)?$/i)[1];
		} else if (filename.match(/https?:\/\/(www\.)?youtube.com/)) {
			return 'Youtube';
		} else {
			return sprintf("unknown: %s", filename);
		}
	}

	function isImage(fileExtension) { //Pashe, WTFPL
		return ($.inArray(fileExtension, ["jpg", "jpeg", "gif", "png"]) !== -1);
	}

	function isVideo(fileExtension) { //Pashe, WTFPL
		return ($.inArray(fileExtension, ["webm", "mp4"]) !== -1);
	}

	////////////////
	//IMAGE HOVER
	////////////////
	function imageHoverStart(e) { //Pashe, anonish, WTFPL
		var hoverImage = $("#chx_hoverImage");
		
		if (hoverImage.length) {
			if (getSetting("imageHoverFollowCursor")) {
				var scrollTop = $(window).scrollTop();
				var imgY = e.pageY;
				var imgTop = imgY;
				var windowWidth = $(window).width();
				var imgWidth = hoverImage.width() + e.pageX;
				
				if (imgY < scrollTop + 15) {
					imgTop = scrollTop;
				} else if (imgY > scrollTop + $(window).height() - hoverImage.height() - 15) {
					imgTop = scrollTop + $(window).height() - hoverImage.height() - 15;
				}
				
				if (imgWidth > windowWidth) {
					hoverImage.css({
						'left': (e.pageX + (windowWidth - imgWidth)),
						'top' : imgTop,
					});
				} else {
					hoverImage.css({
						'left': e.pageX,
						'top' : imgTop,
					});
				}
				
				hoverImage.appendTo($("body"));
			}
			
			return;
		}
		
		var $this = $(this);
		
		var fullUrl;
		if (!isOnCatalog()) {
			fullUrl = $this.parent().parent().parent().attr("data-download-url"); //I don't remember how to do this properly
		} else {
			fullUrl = $this.attr("src").replace("/thumb/", "/");
		}
		
		if (isVideo(getFileExtension(fullUrl))) {return;}
		
		hoverImage = $(sprintf('<img id="chx_hoverImage" src="%s" />', fullUrl));
		if (getSetting("imageHoverFollowCursor")) {
			hoverImage.css({
				"position"      : "absolute",
				"z-index"       : 101,
				"pointer-events": "none",
				"max-width"     : $(window).width(),
				"max-height"    : $(window).height(),
				'left'          : e.pageX,
				'top'           : imgTop,
			});
		} else {
			hoverImage.css({
				"position"      : "fixed",
				"top"           : 0,
				"right"         : 0,
				"z-index"       : 101,
				"pointer-events": "none",
				"max-width"     : "100%",
				"max-height"    : "100%",
			});
		}
		hoverImage.appendTo($("body"));
		if (isOnThread()) {$this.css("cursor", "none");}
	}

	function imageHoverEnd() { //Pashe, WTFPL
		$("#chx_hoverImage").remove();
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
	
	function initParseTimestampImage() { //Pashe, WTFPL
		if (!getSetting("parseTimestampImage")) {return;}
		try {
			var minTimestamp = new Date(1985,1).valueOf();
			var maxTimestamp = Date.now()+(24*60*60*1000);
			
			$("span.filename-cleartext").each(function() {
				var $this = $(this);
				var filename = $this.text();
				
				if (!filename.match(/^([0-9]{9,13})[^a-zA-Z0-9]?.*$/)) {return;}
				var timestamp = parseInt(filename.match(/^([0-9]{9,13})[^a-zA-Z0-9]?.*$/)[1]);
				
				if (timestamp < minTimestamp) {timestamp *= 1000;}
				if ((timestamp < minTimestamp) || (timestamp > maxTimestamp)) {return;}
				
				var fileDate = new Date(timestamp);
				
				var fileTimeElement = $('<span class="chx_PTIStamp"></span>');
				fileTimeElement.attr("title", fileDate.toGMTString());
				fileTimeElement.attr("data-timestamp", timestamp);
				fileTimeElement.attr("data-isotime", fileDate.toISOString());
				fileTimeElement.text(" (" + $.timeago(timestamp) + ")");
				fileTimeElement.css({"font-size": "x-small"});
				fileTimeElement.appendTo($this.parent());
			});
		} catch (e) {}
	}
	
	function initImageHover() { //Pashe, influenced by tux, et al, WTFPL
		if (!(getSetting("imageHover") || getSetting("catalogImageHover"))) {return;}
		if (!getSetting("catalogImageHover") && isOnCatalog()) {return;}
		
		var selectors = [];
		
		if (getSetting("imageHover")) {selectors.push("img.attachment-img");}
		
		$(selectors.join(", ")).each(function () {
			var $this = $(this);
			
			$this.on("mousemove", imageHoverStart);
			$this.on("mouseout",  imageHoverEnd);
			$this.on("click",     imageHoverEnd);
		});
	}
	
	////////////////
	//INIT CALLS
	////////////////
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
		initParseTimestampImage();
		//initNotifications();
		//initFlagIcons();
		//initKeyboardShortcuts();
		//initpurgeDeadFavorites();
		//initClearLocalStorage();
		//initClearChxSettings();
		//initFavicon();
		initImageHover();
	} catch(e) {chxErrorHandler(e, "ready");}});
} catch(e) {chxErrorHandler(e, "global");}