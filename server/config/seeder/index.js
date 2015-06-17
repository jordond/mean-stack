/**
 * Database Seeder
 * calling `exports.seeder()` will search for all seed files in
 * `./seeds/*.seed.js`
 * It will then call the run() function on each file.
 *
 * seedOption: Is set in your env.js
 */



'use strict';

var fs = require('fs');
var path = require('path');
var log = require('../../components/logger/console');
var TAG = 'Seeder';

exports.seeder = function (seedSetting) {
  var normalizedPath = path.join(__dirname, 'seeds');

  var acceptableSeedSettings = [false, true, 'override'];
  if (acceptableSeedSettings.indexOf(seedSetting) === -1) {
    log.error(TAG, 'Invalid config setting for [seedDB], defaulting to [true]');
    seedSetting = true;
  }

  var files = fs.readdirSync(normalizedPath);
  var count = 0;

  files.splice(files.indexOf('sample.seed.js'), 1);

  var mode = seedSetting === 'override' ? seedSetting : 'normal';
  log.info(TAG, 'Starting Seeder in [' + mode + '] mode');
  log.info(TAG, 'Found [' + files.length + '] Seeds');

  files.forEach(function(file) {
    try {
      require('./seeds/' + file)
        .run(seedSetting, function (err, message) {
          if (err) {
            log.error(TAG, 'Failed to seed [' + file + ']', err);
          } else if (message) {
            log.info(TAG, message);
          } else {
            log.info(TAG, 'Finished seeding [' + file + ']');
          }
          count++;
          if (count === files.length) {
            log.info(TAG, 'Finished seeding database [' + count + '] seeds');
          }
        });
    } catch (err) {
      log.error(TAG, 'Failed to load seed file [' + file +']', err);
    }
  });
}
