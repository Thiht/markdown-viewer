/* globals Components, markdownit, hljs, gContextMenu */

window.addEventListener('load', function load(event) {
	window.removeEventListener('load', load, false);
	MarkdownViewer.init();
}, false);

function BrowserSetForcedCharacterSet(aCharset) {
	var wnd = (gContextMenu ? document.commandDispatcher.focusedWindow : window);
	if (window === wnd || wnd === null) {
		wnd = window.content;
	}
	var webNav = wnd.QueryInterface(Components.interfaces.nsIInterfaceRequestor).getInterface(Components.interfaces.nsIWebNavigation);
	var docShell = webNav.QueryInterface(Components.interfaces.nsIDocShell);
	docShell.QueryInterface(Components.interfaces.nsIDocCharset).charset = aCharset;
	webNav.reload(0);
}

if (!MarkdownViewer) {

	var MarkdownViewer = {

		init: function() {
			const appcontent = document.getElementById('appcontent');
			if (appcontent) {
				appcontent.addEventListener('DOMContentLoaded', this.onPageLoad, true);
			}
		},

		onPageLoad: function(aEvent) {
			if (aEvent.originalTarget.documentURI.indexOf('about:neterror') === 0) {
				return;
			}

			const document = aEvent.originalTarget;
			const markdownFileExtension = /\.m(arkdown|kdn?|d(o?wn)?)(\?.*)?(#.*)?$/i;

			if (document.location.protocol !== "view-source:" &&
				markdownFileExtension.test(document.location.href) &&
				document.contentType !== "text/html") {

				var textContent = document.body.textContent;
				// Empty the body
				while (document.body.firstChild) {
					document.body.removeChild(document.body.firstChild);
				}

				// Change the charset
				if (document.characterSet.toLowerCase() !== 'utf-8') {
					BrowserSetForcedCharacterSet('utf-8');
					return;
				}

				// Parse the content Markdown => HTML
				var md = markdownit({
					html: true,
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

				var html = md.render(textContent);

				// For links, copy href attribute to data-original-href, for sanitizing later. Do
				// that for both href="...", either generated by markdown-it, which uses escape(),
				// or from the original .md file, and also for HTML5-style href='...' which can
				// come from the original .md file. Assume that HTML from the original .md file is
				// well-formed. Pass any attributes left of href unchanged; allow attribute names
				// without value (e.g. xxx in <a xxx href='...'>).
				html = html.replace( /<a((\s+(?!href)[a-zA-Z-_0-9]+(=("[^"]*"|'[^']'))?)*)\s+href="([^"]*)"/gi, '<a$1 href="$5" data-original-href="$5"' );
				html = html.replace( /<a((\s+(?!href)[a-zA-Z-_0-9]+(=("[^"]*"|'[^']'))?)*)\s+href='([^']*)'/gi, "<a$1 href='$5' data-original-href='$5'" );

				// Sanitize the HTML
				// See https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIParserUtils
				var fragment = Components.classes["@mozilla.org/parserutils;1"]
				                         .getService(Components.interfaces.nsIParserUtils)
				                         .parseFragment(html, Components.interfaces.nsIParserUtils.SanitizerAllowStyle, false, null, document.body);

				// Add the content
				document.body.appendChild(fragment);

				// Give the page some styles
				const mdvStyle = document.createElement('link');
				mdvStyle.rel = 'stylesheet';
				mdvStyle.type = 'text/css';
				mdvStyle.href = 'resource://mdvlib/sss/sss.css';
				document.head.appendChild(mdvStyle);

				const printStyle = document.createElement('link');
				printStyle.rel = 'stylesheet';
				printStyle.setAttribute('media', 'print');
				printStyle.type = 'text/css';
				printStyle.href = 'resource://mdvlib/sss/sss.print.css';
				document.head.appendChild(printStyle);

				const hljsStyle = document.createElement('link');
				hljsStyle.rel = 'stylesheet';
				hljsStyle.type = 'text/css';
				hljsStyle.href = 'resource://mdvlib/highlightjs/styles/default.css';
				document.head.appendChild(hljsStyle);

				// Adding this is considered a good practice for mobiles
				const viewport = document.createElement('meta');
				viewport.name = 'viewport';
				viewport.content = 'width=device-width, initial-scale=1';
				document.head.appendChild(viewport);

				// Generate a title
				var title = document.body.querySelector('h1'); // first h1
				if (title) {
					title = title.textContent;
				}
				else {
					title = document.body.textContent.trim().split("\n")[0]; // first line
				}
				title = title.trim().substr(0, 50).replace('<', '&lt;').replace('>', '&gt;');
				document.title = title;

				// Restore the links
				var links = document.getElementsByTagName('a');
				var relativeLinkWithHash = /^(\/?(?:[^#/]+\/)*(?:[^#/.]+(\.[^#/.]*)*))(#.*)?$/;

				for (var i=0; i < links.length; i++) {
					var link = links[i];
					if (!link.getAttribute('href')) {
						var originalHref = link.getAttribute('data-original-href');
						if (originalHref === './'){
							originalHref = './index.md';
						}
						if (originalHref !== '') {
							var match = relativeLinkWithHash.exec(originalHref);
							if (match) {
								var url = match[1];
								if(!match[2]){
									url += ".md";
								}
								if(match[3]){
									url += match[3];
								}
								link.setAttribute('href', url);
							}
						}
					}
				}
			}
		}
	};
}
