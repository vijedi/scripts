// ==UserScript==
// @name        zimbra
// @namespace   http://fluidapp.com
// @description Update docbadge for zimbra
// @include     https://mail.vijedi.net/*
// @author      Tejus Parikh
// ==/UserScript==

(function() {
	if (!window.fluid) {
		return;
	}
	var unread = 0;
	function updateDockBadge() {
		var newMessages = getNewMessageCount();
		
		if(newMessages == -1) {
			// We're looking at some other folder
			// and we probably don't want to update
			return;
		}
		
		if(newMessages > 0 && newMessages > unread) {
			var newSinceLast = (newMessages - unread);
			var description = (newSinceLast) + " new " + 
					( (newSinceLast > 1) ? "messages" : "message");
					
			if(unread > 0) {
				description += ", " + newMessages + " unread " + 
					((unread > 1) ? "messages" : "message");
			}
			
			fluid.showGrowlNotification({
		        title: "New Mail",
		        description: description,
		        priority: 3,
		        sticky: false
	      	});
		}
		unread = newMessages;
		window.fluid.setDockBadge((unread > 0) ? unread.toString() : "");
	}
	setInterval(function(){updateDockBadge();}, 3000);
})();


function getNewMessageCount() {
	var badgeString = -1;
	var title = document.title;
	
	// Only do this if the title exists and we're looking at the inbox
	if (title && title.length && title.indexOf("Inbox") > -1) {
		badgeString = 0;
		var start = title.indexOf("(");
		var end = title.indexOf(")");
		if (start > -1 && end > -1) {
			start++;
			badgeString = parseInt(title.substring(start, end));
		}
	}
	return badgeString;
}
