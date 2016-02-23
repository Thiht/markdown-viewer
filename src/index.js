const { Cu, Cc, Ci, components } = require("chrome");
const categoryManager = Cc["@mozilla.org/categorymanager;1"].getService(Ci.nsICategoryManager);
const messageListenerManager = Cc["@mozilla.org/globalmessagemanager;1"].getService(Ci.nsIMessageListenerManager);

const url = module.uri.replace('index.js', 'registrar.js') + '?' + Date.now();
const MARKDOWN_EXTENSIONS = ['md', 'mdown', 'mkd', 'mkdn', 'markdown'];
const MARKDOWN_MIME_TYPE = 'text/markdown';

function main() {
	messageListenerManager.loadFrameScript(url, true);
	//MARKDOWN_EXTENSIONS.forEach(extension => categoryManager.addCategoryEntry('ext-to-type-mapping', extension, MARKDOWN_MIME_TYPE, false, true));
}

function onUnload() {
	messageListenerManager.removeDelayedFrameScript(url);
}

exports.main = main;
exports.onUnload = onUnload;
