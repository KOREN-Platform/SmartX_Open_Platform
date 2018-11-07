'use strict';

var utils = require('../utils/writer.js');
var Pet = require('../service/PetService');

module.exports.addPet = function addPet (req, res, next) {
  var body = req.swagger.params['body'].value;
  Pet.addPet(body)
    .then(function (response) {
      utils.writeJson(res, response);
    })
    .catch(function (response) {
      utils.writeJson(res, response);
    });
};
