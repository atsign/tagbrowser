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
	
	// The current tag being queried/displayed, as a string
	tag: null,
	
	// The current value of the search input field
	typedTag: null,
	
	// Timeout object used for search suggest timeout
	searchSuggestTimeout: null,
	
	
	
	/*
	 * Instance Methods
	 */
	
	// Set global tag variable to whatever is being searched, perform query on that tag
	searchSubmit: function(e) {
		e.preventDefault();
		TagBrowser.tag = $('#search-input').val();
		TagBrowser.getPhotoDataForTag();
	},
	
	
	// Query the Instagram API and set the gallery to the new photos
	getPhotoDataForTag: function() {
		
		// Prepare gallery by setting its class to "filled" and adding loading message
		$('#gallery').removeClass('empty').addClass('filled').empty().prepend('<p id="message"></p>');
		$('#message').addClass('loading').text('Grabbing new photos...');
		
		// Make ajax call to Instagram API to get photo data
		$.ajax({
			url: 'tagbrowser.php?search=' + encodeURIComponent(TagBrowser.tag),
			success: function(data) {
				if (data == "") {
					TagBrowser.showMessage('Sorry! That doesn\'t appear to be a valid tag.');
				} else {
					var newPhotoData = $.parseJSON(data);
					TagBrowser.photoData = newPhotoData["data"];
					TagBrowser.refreshGallery();
				} 
			},
			error: function() {
				TagBrowser.showMessage('We\'re having trouble connecting to Instagram right now. Try again later.');
			}
		});
	},
	
	// Event handler for search suggestions
	searchInputKeyPress: function(e) {
		
		/* clearTimeout() and setTimeout() are used in order to limit
		 * the number of calls to the Instagram API */
		
		clearTimeout(TagBrowser.searchSuggestTimeout);
		TagBrowser.searchSuggestTimeout = setTimeout('TagBrowser.getSuggestionsForTag()', 1000);
	},
	
	// Query the Instagram API to get tag suggestions for the given tag
	getSuggestionsForTag: function() {
		TagBrowser.typedTag = $('#search-input').val();
		if (TagBrowser.typedTag != "") {
			$.ajax({
				url: 'tagbrowser.php?suggest=' + encodeURIComponent(TagBrowser.typedTag),
				success: function(data) {
					if (data != "") {
						var newTagData = $.parseJSON(data);
						TagBrowser.tagData = newTagData['data'];
						TagBrowser.refreshSuggestions();
					}
				}
			});			
		}
	},
	
	refreshSuggestions: function() {
		suggestions = "Search Suggestions:\n";
		for (i = 0; i < TagBrowser.tagData.length; i++) {
			suggestions += TagBrowser.tagData[i]['name'];
			suggestions += '\n';
		}
		alert(suggestions);
	},
	
	// Use global photo data to refresh photo gallery
	refreshGallery: function() {		
		if (TagBrowser.photoData) {
			if (TagBrowser.photoData.length > 0) {
				$('#gallery').removeClass('empty').addClass('filled').empty();
				for (i = 0; i < TagBrowser.photoData.length; i++) {
					$("#gallery").append('<figure><img src="' + TagBrowser.photoData[i]['images']['low_resolution']['url'] + '" class="thumb"/></figure>');
				}	
			} else {
				TagBrowser.showMessage('Sorry! There aren\'t any photos for that tag.');
			}
		} else {
			TagBrowser.showMessage('There was a problem showing this photo set!');
		}
	},
	
	// Animate thumbnails on hover so they're slightly larger
	thumbHoverOn: function() {
		$(this).stop(true, true);
		$(this).css('position', 'relative');
		$(this).animate({'width': '+=8px', 'top': '-=2px', 'left': '-=2px'}, 250);
		$(this).css('box-shadow', '0 0 5px #333');
	},
	
	
	// Return thumbnails to original size and position on rollout
	thumbHoverOff: function() {
		$(this).stop(true, true);
		$(this).css({'width': '-=8px', 'top': '+=2px', 'left': '+=2px'});
		$(this).css('position', 'static');
		$(this).css('box-shadow', 'none');
	},
	
	showMessage: function(message) {
		$('#gallery').removeClass('filled').addClass('empty').empty().prepend('<p id="message"></p>');
		$('#message').text(message);
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
	$('#search').on('submit', TagBrowser.searchSubmit);
	$('#search-input').on('keypress', TagBrowser.searchInputKeyPress);
}


/*
 * Main jQuery function
 */

$(document).ready(function() {
	
	SetEventHandlers();
	
});


