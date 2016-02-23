const prefsService = require('sdk/preferences/service');

const hljs = require('../lib/highlight.pack.min');
const md = require('../lib/markdown-it.min')({
	linkify: true,
	// Shameless copypasta https://github.com/markdown-it/markdown-it#syntax-highlighting
	highlight: function (str, lang) {
		if (lang && hljs.getLanguage(lang)) {
			try {
				return hljs.highlight(lang, str).value;
			} catch (__) {}
		}

		try {
			return hljs.highlightAuto(str).value;
		} catch (__) {}

		return ''; // use external default escaping
	}
});

function MarkdownFormatter() {
	this.baseUrl = prefsService.get('extensions.markdownviewer@thiht.sdk.baseURI', null);
}

MarkdownFormatter.prototype.markdownToHTML = function(markdownString) {
	const content = md.render(markdownString);
	return `<!DOCTYPE html>
<html>
	<head>
		<title>(untitled document)</title>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<link rel="stylesheet" href="${this.baseUrl}resources/styles/sss.css">
		<link rel="stylesheet" href="${this.baseUrl}resources/styles/default.css">
		<link rel="stylesheet" href="${this.baseUrl}resources/styles/sss.print.css" media="print">
	</head>
	<body>
		${content}
		<script src="${this.baseUrl}resources/scripts/main.js"></script>
	</body>
</html>`;
};

exports.MarkdownFormatter = MarkdownFormatter;
