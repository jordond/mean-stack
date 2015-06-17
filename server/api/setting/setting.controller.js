'use strict';

var _ = require('lodash');
var Setting = require('./setting.model');

// Get list of settings
exports.index = function (req, res) {
  Setting.find(function (err, settings) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(settings);
  });
};

// Updates an existing setting in the DB.
exports.update = function (req, res) {
  Setting.find(function (err, settings) {
    if (err) { return handleError(res, err); }
    if(!settings) { return res.status(404); }
    var updated = _.merge(settings, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json({message: 'Settings successfully saved!', data: updated});
    });
  });
};

function handleError(res, err) {
  return res.status(500).json(err);
}