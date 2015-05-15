'use strict';

var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/environment');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var compose = require('composable-middleware');
var moment = require('moment');
var User = require('../api/user/user.model');
var validateJwt = expressJwt({ secret: config.secrets.session });

/**
 * Attaches the user object to the request if authenticated
 * Otherwise returns 403
 */
function isAuthenticated() {
  return compose()
    // Validate jwt
    .use(function (req, res, next) {
      // allow access_token to be passed through query parameter as well
      if(req.query && req.query.hasOwnProperty('access_token')) {
        req.headers.authorization = 'Bearer ' + req.query.access_token;
      }
      validateJwt(req, res, next);
    })
    // Handle the validation errors
    .use(function (err, req, res, next) {
      if (err) {
        return res.status(err.status).json(err);
      } else {
        next();
      }
    })
    // Attach user to request
    .use(function (req, res, next) {
      User.findById(req.user._id, function (err, user) {
        if (err) return next(err);
        if (!user) return res.sendStatus(401);

        req.user = user;
        next();
      });
    });
}

/**
 * Check to see if the token needs to be refreshed.
 * The token expires in 7 days, so if it less than a day
 * before it expires, then issue a new one.
 * If a user doesn't use the app or login for 7 days, their
 * token will expire
 * @return {String} Either their current token or a new one
 */
function refreshToken() {
  return compose()
    .use(isAuthenticated())
    .use(function (req, res, next) {
      var token = getToken(req.headers.authorization),
        decoded,
        now = moment().unix().valueOf();

      if (token) {
        decoded = jwt.decode(token);
        if ((decoded.exp - now) < (24 * 60 * 60)) {
          token = signToken(req.user.id);
        }
        return res.status(200).json({token: token});
      }
      return res.status(401).json({message: 'Token error'});
    });
}

/**
 * Checks if the user role meets the minimum requirements of the route
 */
function hasRole(roleRequired) {
  if (!roleRequired) throw new Error('Required role needs to be set');

  return compose()
    .use(isAuthenticated())
    .use(function meetsRequirements(req, res, next) {
      if (config.userRoles.indexOf(req.user.role) >= config.userRoles.indexOf(roleRequired)) {
        next();
      }
      else {
        res.status(403).json({message: 'You don\'t have the authority for that'});
      }
    });
}

/**
 * Checks if it is the current user, or is an admin
 */
function isMeOrHasRole(roleRequired) {
  return compose()
    .use(function checkIsMe(req, res, next) {
      var userId = req.params.id;
      if (req.user.id) {
        if (req.user.id === userId) {
          next();
        } else {
          if (compareRole(roleRequired, req.user.role)) {
            next();
          } else {
            res.status(403).json({message: 'You don\'t have the authority for that'});
          }
        }
      } else {
        res.sendStatus(401);
      }
    });
}

/**
 * Helper function
 * Check if the user is admin
 */
function checkIsAdmin(roleToCheck) {
  if (config.userRoles.indexOf(roleToCheck) >= config.userRoles.indexOf('admin')) {
    return true;
  } else {
    return false;
  }
}

function compareRole(roleRequired, roleToCheck) {
  if (config.userRoles.indexOf(roleToCheck) >= config.userRoles.indexOf(roleRequired)) {
    return true;
  } else {
    return false;
  }
}

function getToken(header) {
  var token = '';
  if (header.indexOf('Bearer ') !== -1) {
    token = header.split(' ')[1];
  }
  return token;
}

/**
 * Returns a jwt token signed by the app secret
 */
function signToken(id) {
  return jwt.sign({ _id: id }, config.secrets.session, { expiresInMinutes: 60*168 });
}

/**
 * Set token cookie directly for oAuth strategies
 */
function setTokenCookie(req, res) {
  if (!req.user) return res.status(404).json({ message: 'Something went wrong, please try again.'});
  var token = signToken(req.user._id, req.user.role);
  res.cookie('token', JSON.stringify(token));
  res.redirect('/');
}

exports.isAuthenticated = isAuthenticated;
exports.refreshToken = refreshToken;
exports.hasRole = hasRole;
exports.isMeOrHasRole = isMeOrHasRole;

exports.checkIsAdmin = checkIsAdmin;
exports.compareRole = compareRole;
exports.signToken = signToken;
exports.setTokenCookie = setTokenCookie;