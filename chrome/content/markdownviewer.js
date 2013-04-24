window.addEventListener('load', function load(event) {
	window.removeEventListener('load', load, false);
	markdownviewer.init();
}, false);

if (typeof markdownviewer === 'undefined') {
	var markdownviewer = {

		init: function() {
			var appcontent = document.getElementById('appcontent');
			if (appcontent) {
				appcontent.addEventListener('DOMContentLoaded', this.onPageLoad, true);
			}
		},

		onPageLoad: function(aEvent) {
			var document = aEvent.originalTarget,
			    regexpMdFile = /\.m(arkdown|kdn?|do?(wn)?)$/i;

			if ((document.location.protocol != 'view-source:') && regexpMdFile.test(document.location)) {
				marked.setOptions({
					gfm: true,
					pedantic: false,
					sanitize: false
				});

				var content = document.firstChild;
				content.innerHTML = '<!DOCTYPE html>' +
				                    '<head>' +
				                    '    <title>Markdown Viewer</title>' +
				                    '    <link rel="stylesheet" type="text/css" href="resource://mdskin/bootstrapLite.css">' +
				                    '</head>' +
				                    '<body class="container">' +
				                        marked(content.textContent) +
				                    '</body>';
			}
		}
	};
}
