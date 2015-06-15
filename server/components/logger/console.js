'use strict';

var moment = require('moment');

module.exports = {
  error: function (tag, message, data) {
    data = data ? data : '';
    console.error(timestamp() + '[' + tag + '][ERROR] ' + message, data);
  },

  info: function (tag, message, data) {
    data = data ? data : '';
    console.error(timestamp() + '[' + tag + '][INFO] ' + message, data);
  },

  warn: function (tag, message, data) {
    data = data ? data : '';
    console.error(timestamp() + '[' + tag + '][WARN] ' + message, data);
  },

  log: function (tag, message, data) {
    data = data ? data : '';
    console.error(timestamp() + '[' + tag + '][LOG] ' + message, data);
  },
};

function timestamp() {
  return '[' + moment().format('YYYY/DD/MM HH:mm:ss') + ']';
}
