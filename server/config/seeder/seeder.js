'use strict';

/**
 * Seed options schema
 */
// {
//   modelName: 'name of the model',
//   data: {field: ''},
//   replace: 'Whether or not to delete the items each time',
//   seedSetting: 'true/initial',
//   callback: function ()
// }

var glob = require('glob');
var config = require('../../config');

//================================================
// Main Seeding Logic
//================================================

exports.seed = function(options) {
  var Model, pattern;
  try {
    pattern = config.root + '/**/' + options.modelName + '.model.js';
    Model = require(glob.sync(pattern)[0]);
  } catch (err) {
    options.callback(err.message);
    return;
  }

  Model.find({}, function (err, docs) {
    if (err) {
      options.callback(err);
      return;
    }
    if (options.seedSetting) {
      if (docs.length > 0) {
        if (options.replace || options.seedSetting === 'override') {
          Model.remove(docs, function () {
            create();
          });
        } else {
          options.callback(null, 'Skipping [' + options.modelName + '] documents exist');
        }
      } else {
        create();
      }
    }
    return;
  });

  function create() {
    Model.create(options.data, function (err) {
      options.callback(err);
    });
  }
}
