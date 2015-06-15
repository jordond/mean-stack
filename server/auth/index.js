'use strict';

var express = require('express');
var passport = require('passport');
var config = require('../config');
var auth = require('./auth.service');
var User = require('../api/user/user.model');

// Passport Configuration
require('./local/passport').setup(User, config);

var router = express.Router();

router.use('/local', require('./local'));

router.get('/logout', auth.logout());

router.get('/valid', auth.isValidToken());

router.get('/refresh', auth.refreshToken());

router.put('/revoke', auth.revokeToken());

module.exports = router;