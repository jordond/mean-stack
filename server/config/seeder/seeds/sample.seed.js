'use strict';

/**
 * Edit Seed options object, end doExtra function if needed.
 */
var SEED_OPTIONS = {
  modelName: '',
  data: [{
    field1: '',
    field2: ''
  }, {
    field1: '',
    field2: ''
  }],
  replace: false
};

/**
 * Extra things to do before the model is seeded
 */
function preSeed() {
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
