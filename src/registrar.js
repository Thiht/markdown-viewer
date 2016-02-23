const Cu = Components.utils;
const { devtools } = Cu.import('resource://gre/modules/devtools/Loader.jsm', {});
const require = devtools.require;

const prefsService = require('sdk/preferences/service');
const basePref = prefsService.get('extensions.markdownviewer@thiht.sdk.baseURI');

const xpcom = require('sdk/platform/xpcom');

const { MarkdownViewer } = require(basePref + 'src/markdown-viewer.js');
const contractId = '@mozilla.org/streamconv;1?from=text/markdown&to=*/*';

const service = xpcom.Service({
	contract: contractId,
	Component: MarkdownViewer,
	register: false,
	unregister: false
});

if (!xpcom.isRegistered(service)) {
	xpcom.register(service);
}
