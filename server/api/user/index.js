'use strict';

var express = require('express');
var controller = require('./user.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', auth.hasRole('admin'), controller.index);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);
router.get('/me', controller.me);
router.post('/', auth.hasRole('admin'), controller.create);
router.get('/:id', auth.hasRole('admin'), controller.show);
router.put('/:id', auth.isMeOrHasRole('admin'), controller.update)
router.put('/:id/password', auth.isMeOrHasRole('admin'), controller.changePassword);

module.exports = router;
