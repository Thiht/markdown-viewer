window.addEventListener('load', function load(event) {
	window.removeEventListener('load', load, false);
	MarkdownViewer.init();
}, false);

// https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM/Reference/Interface/nsIURI
function makeURI(aURL, aOriginCharset, aBaseURI) {
	var ioService = Components.classes["@mozilla.org/network/io-service;1"]
	                .getService(Components.interfaces.nsIIOService);
	return ioService.newURI(aURL, aOriginCharset, aBaseURI);
}

/**
 * Safely parse an HTML fragment, removing any executable
 * JavaScript, and return a document fragment.
 * https://developer.mozilla.org/en-US/Add-ons/Overlay_Extensions/XUL_School/DOM_Building_and_HTML_Insertion
 *
 * @param {Document} doc The document in which to create the
 *   returned DOM tree.
 * @param {string} html The HTML fragment to parse.
 * @param {boolean} allowStyle If true, allow <style> nodes and
 *   style attributes in the parsed fragment. Gecko 14+ only.
 * @param {nsIURI} baseURI The base URI relative to which resource
 *   URLs should be processed. Note that this will not work for
 *   XML fragments.
 * @param {boolean} isXML If true, parse the fragment as XML.
 */
function parseHTML(doc, html, allowStyle, baseURI, isXML) {
	const PARSER_UTILS = "@mozilla.org/parserutils;1";

	// User the newer nsIParserUtils on versions that support it.
	if (PARSER_UTILS in Components.classes) {
		let parser = Components.classes[PARSER_UTILS]
		                       .getService(Ci.nsIParserUtils);
		if ("parseFragment" in parser)
			return parser.parseFragment(html, allowStyle ? parser.SanitizerAllowStyle : 0,
			                            !!isXML, baseURI, doc.documentElement);
	}

	return Components.classes["@mozilla.org/feed-unescapehtml;1"]
	                 .getService(Components.interfaces.nsIScriptableUnescapeHTML)
	                 .parseFragment(html, !!isXML, baseURI, doc.documentElement);
}

function BrowserSetForcedCharacterSet(aCharset) {
    var wnd = (gContextMenu ? document.commandDispatcher.focusedWindow : window);
    if ((window === wnd) || (wnd === null)) wnd = window.content;
    const Ci = Components.interfaces;
    var webNav = wnd.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIWebNavigation);
    var docShell = webNav.QueryInterface(Ci.nsIDocShell);
    docShell.QueryInterface(Ci.nsIDocCharset).charset = aCharset;
    webNav.reload(nsIWebNavigation.LOAD_FLAGS_CHARSET_CHANGE);
}

if (!MarkdownViewer) {

	var MarkdownViewer = {

		init: function() {
			const appcontent = document.getElementById('appcontent');
			if (appcontent)
				appcontent.addEventListener('DOMContentLoaded', this.onPageLoad, true);
		},

		onPageLoad: function(aEvent) {
			const document = aEvent.originalTarget;
			const markdownFileExtension = /\.m(arkdown|kdn?|d(o?wn)?)(#.*)?(.*)$/i;

			if (document.location.protocol !== "view-source:" &&
				markdownFileExtension.test(document.location.href) &&
				document.contentType !== "text/html") {

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

				var textContent = document.documentElement.textContent,
				    fragment = parseHTML(document, '<div class="container">' + md.render(textContent) + '</div>', false, makeURI(document.location.href));

				// Empty the body
				while (document.body.firstChild) {
					document.body.removeChild(document.body.firstChild);
				}

				// Give the page some styles
				const mdvStyle = document.createElement('link');
				mdvStyle.rel = 'stylesheet';
				mdvStyle.type = 'text/css';
				mdvStyle.href = 'resource://mdvskin/markdown-viewer.css';
				document.head.appendChild(mdvStyle);

				const hljsStyle = document.createElement('link');
				hljsStyle.rel = 'stylesheet';
				hljsStyle.type = 'text/css';
				hljsStyle.href = 'resource://mdvskin/default.css';
				document.head.appendChild(hljsStyle);

				// Adding this is considered a good practice for mobiles
				var meta = document.createElement('meta');
				meta.name = 'viewport';
				meta.content = 'width=device-width, initial-scale=1';
				document.head.appendChild(meta);

				// Add the content
				document.body.appendChild(fragment);

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
			}
		}
	};
}
