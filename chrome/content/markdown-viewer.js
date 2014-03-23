window.addEventListener('load', function load(event) {
	window.removeEventListener('load', load, false);
	MarkdownViewer.init();
}, false);


if (!MarkdownViewer) {

	var MarkdownViewer = {

		init: function() {
			var appcontent = document.getElementById('appcontent');
			if (appcontent)
				appcontent.addEventListener('DOMContentLoaded', this.onPageLoad, true);
		},

		onPageLoad: function(aEvent) {
			var document = aEvent.originalTarget;
			var markdownFileExtension = /\.m(arkdown|kdn?|d(o?wn)?)(#.*)?$/i;

			if (document.location.protocol !== "view-source:"
				&& markdownFileExtension.test(document.location.href)) {

				var content = document.firstChild;
				content.innerHTML = '<!DOCTYPE html>' +
				                    '<head>' +
				                    '    <title></title>' +
				                    '    <meta charset="utf-8" />' +
				                    '    <link rel="stylesheet" type="text/css" href="resource://mdvskin/markdown-viewer.css" />' +
				                    '</head>' +
				                    '<body class="container">' +
				                        marked(content.textContent) +
				                    '</body>';

				document.title = document.body.firstChild.textContent.substr(0, 50).replace('<', '&lt;').replace('>', '&gt;');
			}
		}
	};
}
