'use strict';

var utils = require('../utils/writer.js');
var SparkApps = require('../service/SparkAppsService');

module.exports.wordcount_search2 = function wordcount_search2 (req, res, next) {
  var body = req.swagger.params['body'].value;
  SparkApps.wordcount_search2(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
