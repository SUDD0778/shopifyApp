'use strict';

var _ = require('lodash');
var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var logger = require('../../components/logger');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var shortid = require('shortid');
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');
var templateCreator = function(exres, neres) {
  var foo = JSON.stringify(exres).replace(/,/g,'<br>');
  var bar = JSON.stringify(neres).replace(/,/g,'<br>');
  return  '<br>Exitsing Resources:<br>' +foo+ '<br><br>Requested Resources:<br>' +bar;
}
var validationError = function(res, err) {
  return res.json(422, err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  User.find({role:'user'}, 'name service_status', function (err, users) {
    if(err) return res.send(500, err);
    res.json(200, users);
  });
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.send(401);
    res.json(user.profile);
  });
};
/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(err) return res.send(500, err);
    return res.send(204);
  });
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err, user) {
        if (err) {console.log(err); return validationError(res, err);}
        logger.user('info', {user_id: user._id, message: 'Password changed.'});
        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};

exports.forgotPassword = function(req, res){
  User.findOne({email: req.body.email}, function(err, user){
    if(err)
      res.status(500).send('Server Error. Please try again later.');
    else if(!user)
      res.status(400).send('No account with that email has been found');
    else{
      var password = shortid.generate();
      user.password = password;
      user.save(function(err, user){
        if (err) res.status(500).send('Server Error. Please try again later.');
        else{
          var mailer = nodemailer.createTransport(sgTransport(config.APPMAILER));
          var email = {
            to: user.email,
            from: 'admin@posist.com',
            subject: 'New password for Posist API',
            html: '<h3>Your new password for logging into POSIST API PLATFORM is: '+password+'</h3>'
          };
          mailer.sendMail(email, function(err, sent) {
            if(err){
              console.log('Forgot password failed for:'+user.email);
              res.status(500).send('Server Error. Please try again later.');
            }else{
              console.log('Forgot password:'+user.email);
              res.send('An email has been sent to ' + user.email + ' with further instructions.');
            }
          });
        }
      });
    }
  });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  res.json(req.user);
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
