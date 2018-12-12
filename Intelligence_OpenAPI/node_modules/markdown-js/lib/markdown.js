var Markdown = require("markdown-it")

exports.makeHtml = function(text) {
  const markdown = new Markdown()
  return markdown.render(text)
}

exports.markdown = exports.Markdown = exports.encode = exports.parse =
  exports.makeHtml
