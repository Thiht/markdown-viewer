const { Class } = require('sdk/core/heritage');
const { Unknown } = require('sdk/platform/xpcom');
const { Cc, Ci } = require('chrome');
const { MarkdownFormatter } = require('./markdown-formatter');

const MarkdownViewer = Class({
	extends: Unknown,
	interfaces: [
		'nsIStreamConverter',
		'nsIStreamListener',
		'nsIRequestObserver'
	],
	get wrappedJSObject() this,

	initialize: function() {
		this.markdownFormatter = new MarkdownFormatter();
	},

	// nsIStreamConverter::convert
	convert: function(aFromStream, aFromType, aToType, aCtxt) {
		return aFromStream;
	},

	// nsIStreamConverter::asyncConvertData
	asyncConvertData: function(aFromType, aToType, aListener, aCtxt) {
		this.listener = aListener;
	},

	// nsIStreamListener::onDataAvailable
	onDataAvailable: function(aRequest, aContext, aInputStream, aOffset, aCount) {
		const is = Cc['@mozilla.org/intl/converter-input-stream;1'].createInstance(Ci.nsIConverterInputStream);
		is.init(aInputStream, this.charset, -1, Ci.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER);

		// This used to read in a loop until readString returned 0, but it caused it to crash Firefox on OSX/Win32 (but not Win64)
		// It seems just reading once with -1 (default buffer size) gets the file done.
		// However, *not* reading in a loop seems to cause problems with Firebug
		// So I read in a loop, but do whatever I can to avoid infinite-looping.
		var totalBytesRead = 0;
		var bytesRead = 1; // Seed it with something positive

		while (totalBytesRead < aCount && bytesRead > 0) {
			var str = {};
			bytesRead = is.readString(-1, str);
			totalBytesRead += bytesRead;
			this.data += str.value;
		}
	},

	// nsIRequestObserver::onStartRequest
	onStartRequest: function(aRequest, aContext) {
		this.data = '';
		this.uri = aRequest.QueryInterface(Ci.nsIChannel).URI.spec;
		this.charset = aRequest.QueryInterface(Ci.nsIChannel).contentCharset || 'UTF-8';

		this.channel = aRequest;
		this.channel.contentType = 'text/html';
		this.channel.contentCharset = 'UTF-8';

		this.listener.onStartRequest(this.channel, aContext);
	},

	// nsIRequestObserver::onStopRequest
	onStopRequest: function(aRequest, aContext, aStatusCode) {
		const outputDoc = this.markdownFormatter.markdownToHTML(this.data);

		const storage = Cc['@mozilla.org/storagestream;1'].createInstance(Ci.nsIStorageStream);
		storage.init(4, 0xffffffff, null);

		const binout = Cc['@mozilla.org/binaryoutputstream;1'].createInstance(Ci.nsIBinaryOutputStream);
		binout.setOutputStream(storage.getOutputStream(0));
		binout.writeUtf8Z(outputDoc);
		binout.close();

		const trunc = 4;
		const instream = storage.newInputStream(trunc);

		this.listener.onDataAvailable(this.channel, aContext, instream, 0, storage.length - trunc);
		this.listener.onStopRequest(this.channel, aContext, aStatusCode);
	}
})

exports.MarkdownViewer = MarkdownViewer;
