var markdown = require("../")

exports.testH1 = function(assert) {
  assert.equal(markdown.parse("Hi\n="), "<h1>Hi</h1>\n", "test <h1>")
}

exports.testP = function(assert) {
  assert.equal(markdown.parse("Paragraph."), "<p>Paragraph.</p>\n", "test <p>")
}

if (require.main == module) require("test").run(exports)
