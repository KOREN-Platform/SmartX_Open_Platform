'use strict';

var utils = require('../utils/writer.js');
var SparkSubmit = require('../service/SparkSubmitService');

module.exports.wordcount_search2.py = function wordcount_search2.py (req, res, next) {
  var body = req.swagger.params['body'].value;
  SparkSubmit.wordcount_search2.py(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
