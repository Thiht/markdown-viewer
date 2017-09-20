const md = new markdownit({
  html: true,
  linkify: true,
  highlight: function(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (__) {}
    }
    return "";
  }
});

const mdDocument = jsyaml.loadFront(document.body.textContent);
document.body.innerHTML = md.render(mdDocument.__content);

if (mdDocument.title) {
  document.title = mdDocument.title;
}

document.body.style.display = "block";
