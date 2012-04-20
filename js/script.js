/******************************************************************
 * Tag Browser
 ******************************************************************
 * File: /js/script.js
 *
 * All of the main javascript for Tag Browser. Global data
 * and common event handlers are stored in the object TagBrowser.
 * See individual comments for more details.
 *
 ******************************************************************/


/*
 * var TagBrowser
 *
 * Global photo and tag data, as well as common event handlers 
 *
 */

var TagBrowser = {
	
	/*
	 * Instance Variables
	 */
	
	// Global photo data from latest call to Instagram API
	photoData: null,
	
	// Global tag data from latest call to Instagram API
	tagData: null,
	
	
	
	
	
	/*
	 * Instance Methods
	 */
	
	// Animate thumbnails on hover so they're slightly larger
	thumbHoverOn: function() {
		$(this).css('position', 'relative');
		$(this).animate({'width': '+=8px', 'top': "-=2px", 'left': '-=2px'}, 250);
		$(this).css('box-shadow', '0 0 5px #333');
	},
	
	
	// Return thumbnails to original size and position on rollout
	thumbHoverOff: function() {
		$(this).css({'width': '-=8px', 'top': "+=2px", 'left': '+=2px'});
		$(this).css('position', 'static');
		$(this).css('box-shadow', 'none');
	}
	
	
}

/*
 * function SetEventHandlers()
 *
 * Assigns event handlers to their corresponding objects
 */


function SetEventHandlers() {
	$('#gallery').on('mouseenter', '.thumb', null, TagBrowser.thumbHoverOn);
	$('#gallery').on('mouseleave', '.thumb', null, TagBrowser.thumbHoverOff);
}


/*
 * Main jQuery function
 */

$(document).ready(function() {
	
	SetEventHandlers();
	
});


