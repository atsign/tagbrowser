<?php

include("config.php");

function dataForTag($client_id) {
	if (tagIsWellFormed($_GET["search"])) {
		$ch = curl_init('https://api.instagram.com/v1/tags/' . stripHash($_GET["search"]) . '/media/recent?client_id=' . $client_id);
		curl_exec($ch);
	}
}

function tagSuggestions($client_id) {
	if (tagIsWellFormed($_GET["suggest"])) {
		$ch = curl_init('https://api.instagram.com/v1/tags/search?q=' . stripHash($_GET["suggest"]) . '&client_id=' . $client_id);
		curl_exec($ch);
	}
}

function tagIsWellFormed($tag) {
	if (strpos($tag, " ") === false) return true;
	else return false;
}

function stripHash($term) {
	if ($term{0} == "#") return substr($term, 1);
	else return $term;
}

if (isset($_GET["search"])) dataForTag($CLIENT_ID);
else if (isset($_GET["suggest"])) tagSuggestions($CLIENT_ID);

?>