/*
	* Linux associates the *.md file to the application/x-genesis-rom mime type by default
	* We have to modify the stream to text/html
*/
if (!MarkdownViewer)
	var MarkdownViewer = {};

if (!MarkdownViewer.StreamConverter) {
	Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");

	MarkdownViewer.StreamConverter = function() {};

	MarkdownViewer.StreamConverter.prototype = {
		classDescription: "Genesis ROM to HTML stream converter",
		classID: Components.ID("{ee55ae20-b205-11e3-a5e2-0800200c9a66}"),
		contractID: "@mozilla.org/streamconv;1?from=application/x-genesis-rom&to=*/*",

		_xpcom_factory: {
			createInstance: function(outer, iid) {
				if (outer != null)
					throw Components.results.NS_ERROR_NO_AGGREGATION;

				if (iid.equals(Components.interfaces.nsISupports) ||
					iid.equals(Components.interfaces.nsIStreamConverter) ||
					iid.equals(Components.interfaces.nsIStreamListener) ||
					iid.equals(Components.interfaces.nsIRequestObserver)) {
					return new MarkdownViewer.StreamConverter();
				}
				throw Components.results.NS_ERROR_NO_INTERFACE;
			}
		},

		QueryInterface: XPCOMUtils.generateQI(
			[Components.interfaces.nsIObserver,
			Components.interfaces.nsIStreamConverter,
			Components.interfaces.nsIStreamListener,
			Components.interfaces.nsIRequestObserver]
		),

		onStartRequest: function(aRequest, aContext) {
			this.data    = "";
			this.uri     = aRequest.QueryInterface (Components.interfaces.nsIChannel).URI.spec;
		    this.channel = aRequest;
		    this.channel.contentType = "text/plain";
		    this.listener.onStartRequest (this.channel, aContext);
		},

		onStopRequest: function(aRequest, aContext, aStatusCode) {
		    var sis = Components.classes["@mozilla.org/io/string-input-stream;1"].createInstance(Components.interfaces.nsIStringInputStream);
		    sis.setData(this.data, this.data.length);
		    this.listener.onDataAvailable(this.channel, aContext, sis, 0, this.data.length);
		    this.listener.onStopRequest(this.channel, aContext, aStatusCode);
		},

		onDataAvailable: function(aRequest, aContext, aInputStream, aOffset, aCount) {
			var si = Components.classes["@mozilla.org/scriptableinputstream;1"].createInstance();
			si     = si.QueryInterface(Components.interfaces.nsIScriptableInputStream);
			si.init(aInputStream);
			this.data += si.read(aCount);
		},

		asyncConvertData: function(aFromType, aToType, aListener, aCtxt) {
		    this.listener = aListener;
		},

		convert: function(aFromStream, aFromType, aToType, aCtxt) {
		    return aFromStream;
		}
	};
}

if (XPCOMUtils.generateNSGetFactory)
    var NSGetFactory = XPCOMUtils.generateNSGetFactory([MarkdownViewer.StreamConverter]);
else
    var NSGetModule = XPCOMUtils.generateNSGetModule([MarkdownViewer.StreamConverter]);
