# Markdown Viewer

A simple Markdown Viewer, for Firefox.

Most of the basis of the code comes from the project [JSONView](https://github.com/bhollis/jsonview).

## Development

Markdown Viewer uses Firefox's [Add-on SDK](https://developer.mozilla.org/en-US/Add-ons/SDK).

To build and test Markdown Viewer, you need to:

* [Install the SDK](https://developer.mozilla.org/en-US/Add-ons/SDK/Tools/jpm#Installation)
* And that's it, really!

You can use the command `jpm run` to start a Firefox instance with the extension loaded. You can also generate an XPI with the command `jpm xpi`. You can also check out [this kind of workflows](https://developer.mozilla.org/en-US/Add-ons/SDK/Tools/jpm#jpm_watchpost) if you want to be efficient.

## TODO

This is a **Work In Progress**, before the release the following points must be checked:

- [x] Support local files and local links
- [ ] Support HTTP files
- [ ] Support all markdown mime-types: text/markdown, text/x-markdown + text/plain and text/html for HTTP served files
- [ ] Test on Windows and several Linux distros
- [ ] e10s
