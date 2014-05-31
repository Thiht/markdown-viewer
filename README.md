# Markdown Viewer README
A Markdown Viewer add-on for Firefox.

The add-on is downloadable on [addons.mozilla.org](https://addons.mozilla.org/fr/firefox/addon/markdown-viewer/).

![Markdown Viewer rendering with an example file](http://i.imgur.com/iA5BaAu.png)

## Important note
The version available on http://addons.mozilla.org/ is different of this one. I can't submit the latest changes because of the use of a JS property I can't not use. So it gets rejected every time:

> Comments:
> Your version was rejected because of the following problems:
> 
> 1) Your add-on creates DOM nodes from HTML strings containing unsanitized data, by assigning to `innerHTML` or through similar means. Aside from being inefficient, this is a major security risk. For more information, see https://developer.mozilla.org/en/XUL_School/DOM_Building_and_HTML_Insertion

The easiest thing to do for now is to build it by yourself:
* Download the current version
* Build the .xpi with `build.bat` if you're using Windows (7-zip required in the path) or with `build.sh` if you're using Linux