#!/bin/sh
rm markdown-viewer@thiht.fr.xpi 2> /dev/null
zip -r markdown-viewer@thiht.fr.xpi chrome.manifest install.rdf LICENSE README.md components \
  chrome/content chrome/skin chrome/lib/highlightjs/highlight.pack.min.js \
  chrome/lib/highlightjs/styles/default.css chrome/lib/markdown-it/dist/markdown-it.min.js \
  chrome/lib/sss/*.css
