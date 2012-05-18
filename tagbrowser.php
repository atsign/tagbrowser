<?php

/******************************************************************
 * Tag Browser
 ******************************************************************
 * File: /tagbrowser.php
 *
 * PHP proxy for making ajax requests to the Instagram API
 *
 ******************************************************************/


include("config.php");

/*
 * function dataForTag
 *
 * @params: $client_id:string
 * 
 * Grabs photo and user data for the tag specified in $_GET["search"]
 */

function dataForTag($client_id) {
	if (tagIsWellFormed($_GET["search"])) {
		$ch = curl_init('https://api.instagram.com/v1/tags/' . stripHash($_GET["search"]) . '/media/recent?client_id=' . $client_id);
		curl_exec($ch);
	}
}



/*
 * function tagSuggestions
 *
 * @params: $client_id:string
 * 
 * Grabs suggested tags for the string in $_GET["suggest"]
 */

function tagSuggestions($client_id) {
	if (tagIsWellFormed($_GET["suggest"])) {
		$ch = curl_init('https://api.instagram.com/v1/tags/search?q=' . stripHash($_GET["suggest"]) . '&client_id=' . $client_id);
		curl_exec($ch);
	}
}


/*
 * function tagIsWellFormed
 *
 * @params: $tag:string
 * 
 * Predicate function checking whether a given tag is well-formed or not
 */

function tagIsWellFormed($tag) {
	$isWellFormed = true;
	
	// So far, just checks that the tag is alphanumeric. This might get more sophisticated in the future
	$isWellFormed = ctype_alnum(stripHash($tag));
	
	return $isWellFormed;
}


/*
 * function stripHash
 *
 * @params: $term:string
 * 
 * Helper function to remove the # from the front of a tag
 * in case the user typed one.
 */

function stripHash($term) {
	if ($term{0} == "#") return substr($term, 1);
	else return $term;
}


// Entry point for script execution

if (isset($_GET["search"])) dataForTag($CLIENT_ID);
else if (isset($_GET["suggest"])) tagSuggestions($CLIENT_ID);

?>