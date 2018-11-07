'use strict';

var utils = require('../utils/writer.js');
var SparkSubmit = require('../service/SparkSubmitService');

module.exports.sparkSubmit = function sparkSubmit (req, res, next) {
  var body = req.swagger.params['body'].value;
  SparkSubmit.sparkSubmit(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
