/**
 * Used to debug error codes for the client side
 */
'use strict';

exports.index = function (req, res) {
  return res.status(404).json({message: 'YOU HAD ONE JOB, SEND A CODE'});
};

exports.returnError = function (req, res) {
  var code = req.params.code;
  if (code) {
    return res.status(code).json({message: code});
  } else {
    return res.sendStatus(404);
  }
}