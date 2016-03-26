# Markdown Viewer README [![Build Status](https://travis-ci.org/Thiht/markdown-viewer.svg?branch=master)](https://travis-ci.org/Thiht/markdown-viewer)
A Markdown Viewer add-on for Firefox.

The add-on is downloadable on [addons.mozilla.org](https://addons.mozilla.org/fr/firefox/addon/markdown-viewer/).

![Markdown Viewer rendering with an example file](http://i.imgur.com/iA5BaAu.png)

## Build
* Download the current version
* Build the .xpi with `build.bat` if you're using Windows (7-zip required in the path) or with `build.sh` if you're using Linux
* The project uses bower to manage the dependencies but they are vendored within chrome/lib so you don't need to manually run `bower install`. The dependencies are easily updatable with `bower update` though.

## Install
* Open the .xpi with Firefox
* If Firefox prevents the install because the add-on is unsigned, go to `about:config` and change the key `xpinstall.signatures.required` from `true` to `false`.
