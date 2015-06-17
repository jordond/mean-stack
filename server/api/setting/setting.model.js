'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SettingSchema = new Schema({
  name: String,
  type: String,
  options: [],
  placeholder: String,
  required: Boolean,
  value: {}
});

module.exports = mongoose.model('Setting', SettingSchema);