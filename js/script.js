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
 * Pre-defined Constants
 */

var MAX_SUGGESTIONS = 5;
var MIN_SEARCH_SUGGEST_LENGTH = 3;
var TIME_BETWEEN_API_CALLS = 500;
var MODAL_FADEIN = 200;
var MODAL_FADEOUT = 200;

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
	
	// The current tag being queried/displayed, as a string
	tag: null,
	
	
	
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
	
	// Query the Instagram API to get tag suggestions for the given tag
	getSuggestionsForTag: function(termObj, callback) {
		$.ajax({
			autocompleteCallback: callback,
			url: 'tagbrowser.php?suggest=' + encodeURIComponent(termObj.term),
			success: function(data) {
				if (data != "") {
					var newTagData = $.parseJSON(data);
					var suggestList = [];
					for (i = 0; i < newTagData['data'].length && i < MAX_SUGGESTIONS; i++) {
						suggestList[i] = {
							label: newTagData['data'][i]['name'] + "  (" + newTagData['data'][i]['media_count'] + ")",
							value: newTagData['data'][i]['name']
						}
					}
					this.autocompleteCallback(suggestList);
				}
			}
		});
	},
	
	// Use global photo data to refresh photo gallery
	refreshGallery: function() {		
		if (TagBrowser.photoData) {
			if (TagBrowser.photoData.length > 0) {
				$('#gallery').removeClass('empty').addClass('filled').empty();
				for (i = 0; i < TagBrowser.photoData.length; i++) {
					var figure = $('<figure />');
					var imageAnchor = $('<a href="' + TagBrowser.photoData[i]['images']['standard_resolution']['url'] + '"><img src="' + TagBrowser.photoData[i]['images']['low_resolution']['url'] + '" class="thumb"/></a>');
					
					$(imageAnchor).on('click', null, TagBrowser.photoData[i], TagBrowser.showPhoto);
					$(imageAnchor).appendTo(figure)
					$(figure).appendTo('#gallery');
				}	
			} else {
				TagBrowser.showMessage('Sorry! There aren\'t any photos for that tag.');
			}
		} else {
			TagBrowser.showMessage('There was a problem showing this photo set!');
		}
	},
	
	// Show a higher resolution photo in a modal box
	showPhoto: function(e) {
		e.preventDefault();
		$('#photo-box').remove(); // In case there's already a photo box showing, remove it
		
		$('<div/>', {
			class: 'modal clearfix',
			id: 'photo-box'
		}).prependTo('#main').hide();
		$('#photo-box').append('<div class="close"></div>');
		$('#photo-box').append('<img src="' + e.data['images']['standard_resolution']['url'] + '" id="large-photo" />');
		$('#photo-box').append('<img src="' + e.data['user']['profile_picture'] + '" id="profile-pic" />');
		$('#photo-box').append('<div id="photo-details" />');
		$('#photo-details').append('<h2>Author</h2');
		$('#photo-details').append('<p>' + e.data['user']['username'] + '</p');
		$('#photo-details').append('<h2>Description</h2>');
		
		if (e.data['caption'] != null)
			$('#photo-details').append('<p>' + e.data['caption']['text'] + '</p>');
		
		$('#photo-box').fadeIn(MODAL_FADEIN);
	},
	
	// Display the About box
	showAbout: function(e) {
		e.preventDefault();
		$('#about').remove() // Remove existing instance of the About box
		
		$('<div/>', {
			class: 'modal clearfix',
			id: 'about'
		}).prependTo('#main').hide();
		$('#about').append('<div class="close"></div>');
		$('#about').append('<h2>About Tag Browser</h2>');
		$('#about').append('<p>Tag Browser is a Web-based <a href="http://instagr.am" />Instagram</a> client. It allows you to search Instagram for the latest photos under your favorite hashtags. It was created by Andrew Iafrate (<a href="http://www.aifrate.com">aiafrate.com</a>). Andrew is a computer science student at Indiana University Southeast. Tag Browser is written in Javascript and PHP. The source code is freely available on <a href="http://www.github.com">github.com</a>. Want to make Tag Browser better? Start a fork and write some code! :)</p>');
		
		$('#about').fadeIn(MODAL_FADEIN);
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
	
	// Replace gallery content with a generic message
	showMessage: function(message) {
		$('#gallery').removeClass('filled').addClass('empty').empty().prepend('<p id="message"></p>');
		$('#message').text(message);
	}
}

/*
 * function init()
 *
 * Assigns event handlers to their corresponding objects,
 * and initializes jQuery UI objects
 */


function init() {
	
	// Event handlers
	$('#gallery').on('mouseenter', '.thumb', null, TagBrowser.thumbHoverOn);
	$('#gallery').on('mouseleave', '.thumb', null, TagBrowser.thumbHoverOff);
	$('#search').on('submit', TagBrowser.searchSubmit);
	$('#about-link').on('click', TagBrowser.showAbout);
	
	
	// jQuery autocomplete init
	$("#search-input").autocomplete({
		source: TagBrowser.getSuggestionsForTag,
		delay: TIME_BETWEEN_API_CALLS,
		minLength: MIN_SEARCH_SUGGEST_LENGTH
	});
	
	// Close icon for modal boxes
	$('body').on('click', '.close', null, function(e) {
		e.preventDefault();
		$(this).parent().fadeOut(MODAL_FADEOUT);
	});
	
}


/*
 * Main jQuery function
 */

$(document).ready(function() {
	
	init();
	
});


