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

			if (regexpMdFile.test(document.location)) {
				marked.setOptions({
					gfm: true,
					pedantic: false,
					sanitize: false,
					langPrefix: 'language-'
				});

				var content = document.firstChild;
				content.innerHTML = '<!DOCTYPE html>' +
				                    '<head>' +
				                    '    <title>Markdown Viewer</title>' +
				                    '    <link rel="stylesheet" type="text/css" href="resource://mdskin/bootstrapLite.css">' +
						    '    <link rel="stylesheet" type="text/css" href="resource://mdskin/default.min.css">' +
				                    '</head>' +
				                    '<body class="container">' +
				                        marked(content.textContent) +
				                    '</body>';
				var loadjsfile=function(doc, jsfile){
					var script = doc.createElement("script");
					script.type = "text/javascript";
					script.src = "resource://mdskin/"+jsfile;
					var head = doc.getElementsByTagName("head")[0] || doc.documentElement;
					head.insertBefore(script, head.firstChild);
				};
				loadjsfile(document, 'highlight.min.js');
				loadjsfile(document, 'inithighlight.js'); 
			}
		}
	};
}
