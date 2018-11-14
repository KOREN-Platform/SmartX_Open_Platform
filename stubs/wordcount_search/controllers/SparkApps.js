'use strict';

var utils = require('../utils/writer.js');
var SparkApps = require('../service/SparkAppsService');

module.exports.wordcount_search = function wordcount_search (req, res, next) {
  var body = req.swagger.params['body'].value;
  SparkApps.wordcount_search(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
