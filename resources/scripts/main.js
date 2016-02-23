function generatePageTitle() {
	var title = document.body.querySelector('h1'); // first h1
	if (title) {
		title = title.textContent;
	}
	else {
		title = document.body.textContent.trim().split("\n")[0]; // first line
	}
	title = title.trim().substr(0, 50).replace('<', '&lt;').replace('>', '&gt;');

	if (title) {
		document.title = title;
	}
}

document.addEventListener('DOMContentLoaded', function() {
	'use strict';

	generatePageTitle();
}, false);
