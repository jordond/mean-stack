'use strict';

/**
 * Edit Seed options object, end doExtra function if needed.
 */
var SEED_OPTIONS = {
  modelName: 'user',
  data: [{
    name: 'Test User',
    username: 'tester',
    email: 'test@test.com',
    password: 'password'
  }, {
    role: 'admin',
    name: 'testadmin',
    username: 'testadmin',
    email: 'test@admin.com',
    password: 'admin'
  }],
  replace: false
};

/**
 * Extra things to do before the model is seeded
 */
function preSeed() {
  var config = require('../../../config');
  if (config.initialUser) {
    SEED_OPTIONS.data.push(config.initialUser);
  }
  return;
}

// ============================================================
// Seeder logic, shouldn't need to edit
// ============================================================

function run(seedSetting, callback) {
  SEED_OPTIONS.seedSetting = seedSetting;
  SEED_OPTIONS.callback = callback;
  preSeed();
  require('../seeder').seed(SEED_OPTIONS);
}

exports.run = run;
