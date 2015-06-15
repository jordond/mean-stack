/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/environment');

mongoose.connection.on('connected', function (reference) {
  if(config.seedDB) {
    require('./config/seed');
  }

  // Setup server
  var app = express();
  var server = require('http').createServer(app);
  var socketio = require('socket.io')(server, {
    serveClient: (config.env === 'production') ? false : true,
    path: '/socket.io-client'
  });
  require('./config/socketio')(socketio);
  require('./config/express')(app);
  require('./routes')(app);

  // Start server
  server.listen(config.port, config.ip, function () {
    console.log('[App] Express server listening on %d, in %s mode', config.port, app.get('env'));
  });

  process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);

  // Expose app
  exports = module.exports = app;
});

mongoose.connection.on('error', function (err) {
  console.error('[Mongoose] Failed to connect to database [' + config.mongo.uri +'] : ', err.message);
  console.error('[App] Connection to database failed, app will now terminate');
  process.exit(1);
});

mongoose.connection.on('disconnected', function () {
  console.log('[Mongoose] Connection to database has been lost');
});

function gracefulExit() {
  mongoose.connection.close(function () {
    console.log('[Mongoose] App is terminating, closing connection to database');
    process.exit(0);
  });
}

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);
console.log('[App] Attempting to connect to the database [' + config.mongo.uri + ']');
