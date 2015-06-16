'use strict';

// Use env.js for environment variables that grunt will set when the server starts locally.
// Use for your api keys, secrets, etc. This file should not be tracked by git.
//
// You will need to set these on the server you deploy to.

module.exports = {
  secrets: {
    session: 'replace-me'
  },

  // Port to run the server on
  // port: 5679,

  // Should I seed the database, [true, false, once]
  // seedDB: false,

  // Token settings, default expiry of 3 hours in minutes
  // token: {
  //   expiry: 3 * 60
  // },

  // Database address, and name
  // mongo: {
  //   uri: 'mongodb://address/db-name'
  // },

  // Environment to run, default is environment variables
  // env: process.env.NODE_ENV,

  // Control debug level for modules using visionmedia/debug
  DEBUG: ''
};
