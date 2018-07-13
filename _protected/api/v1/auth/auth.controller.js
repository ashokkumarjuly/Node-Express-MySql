'use strict';
const jwt = require('jwt-simple');
const async = require('async');
var crypto = require('crypto');
var moment = require('moment');
const _ = require('lodash');
const randomstring = require('randomstring');
const Sequelize = require('sequelize');
const {APP_CONSTANTS, logger} = require('../../config')
var userService = require('../shared/services/user.service');
const Models = require('../models');
var log = logger.appLogger();

const STATUS_CODE = APP_CONSTANTS.STATUS_CODE;
const JWTCONFIG = APP_CONSTANTS.JWTCONFIG;
const SITE_CONFIG = APP_CONSTANTS.SITE_CONFIG;

const APP_ROLES = APP_CONSTANTS.APP_ROLES;


module.exports = {
    //Get a list of all Users using model.findAll()
    login: function (req, res) {
        var data = req.body;

        if (!data.email) {
            log.debug('Email address missing while login ');
            return res.status(STATUS_CODE.UNAUTHORIZED).json({ error: { message: 'Email address missing while login.' } });
        } else if (!data.password) {
            log.debug('Password missing while login.. Email: ' + data.email);
            return res.status(STATUS_CODE.UNAUTHORIZED).json({ error: { message: 'Password missing while login.' } });
        }

        log.trace('API request: User login... email: ' + data.email + ', pin: ' + data.pin);



        async.waterfall([
            function (done) { // Get User by 

                userService.getUserByEmail(data.email, function (err, result) {
                    if (err) {
                        done(err);
                    } else {
                        if (result) {
                            if (result.accountStatus === APP_CONSTANTS.STATUS.DELETED) {
                                done({ msg: 'Account not exists.' });
                            } else {
                                done(null, result);
                            }

                        } else {
                            done({ msg: 'Account not exists.' });
                        }
                    }
                });
            },
            function (user, done) { // Verification                    
                // var iscomparePassword = user.verifyPassword(data.password);
                var iscomparePassword = true;
                // Verify if user is in active state
                if (user.emailVerified !== 1) {
                    log.debug('Login failed, Email address not verified. Email: ' + data.email);
                    done({ msg: 'Authentication failed. Email address not verified.' });
                } else if (iscomparePassword) { // Compare User password
                    if (user.accountStatus !== APP_CONSTANTS.STATUS.ACTIVE) { //Check account status
                        log.debug('Login failed, Account is inactive. Email: ' + data.email);
                        done({ msg: 'Please request this account to be activated.' });
                    } else {
                        done(null, user); //if success push to next fn
                    }
                } else {
                    log.debug('Login failed, Incorrect Password. Email: ' + data.email);
                    done({ msg: 'Authentication failed, Incorrect Password.' });
                } ``
            }, function (user, done) {
                const token = jwt.encode({ email: user.email, tokenExpiration: user.tokenExpiration }, JWTCONFIG.jwtSecret); // Generate JWT token with Payload
                user.authToken = token;
                user.save().then(function (user) {
                    var userData = _.pick(user.get({ plain: true }), ['id', 'email', 'role', 'firstName', 'lastName', 'accountStatus', 'lastLoginDate']);
                    userData.tokenExpiration = moment().utc().add(JWTCONFIG.expire_value, JWTCONFIG.expire_method).format('YYYY-MM-DD HH:mm:ss'); // Setting token expiration period
                    done(null, token, userData);
                })
            },
        ], function (err, token, userData) {
            if (err) {
                log.error('API response: Failed to Login, Email: ' + data.email + ' Error: ' + JSON.stringify(err));
                if (err.code && err.code > 0) {
                    return res.status(err.code).json({ error: { message: err.msg }, error_info: err.info });
                } else {
                    return res.status(STATUS_CODE.UNAUTHORIZED).json({ error: { message: err.msg }, error_info: err.info });
                }
            } else {
                log.debug('API response: Login Success Email: ' + data.email);
                return res.status(STATUS_CODE.SUCCESS).json({ success: true, message: 'Authentication success.', data: { token: `JWT ${token}`, user: userData } });
                // return res.status(STATUS_CODE.SUCCESS).json({ success: { message: 'Login Success' }, token: `JWT ${token}`, user: result });
            }
        });

    },
    logout: function (req, res) {
        try {
            var data = req.body;

            if (!data.email) {
                log.debug('Email address missing while login ');
                return res.status(STATUS_CODE.UNAUTHORIZED).json({ error: { message: 'Email address missing while login.' } });
            }

            log.trace('API request: User logout... email: ' + data.email);



            async.waterfall([
                function (done) { // Get User by Email
                    userService.getUserByEmail(data.email, function (err, result) {
                        if (err) {
                            done(err);
                        } else {
                            if (result) {
                                if (result.accountStatus === APP_CONSTANTS.STATUS.DELETED) {
                                    done({ msg: 'Account not exists.' });
                                } else {
                                    done(null, result);
                                }
                            } else {
                                done({ msg: 'Account not exists.' });
                            }
                        }
                    });
                }
            ], function (err, token, userData) {
                if (err) {
                    log.error('API response: Failed to Login, Email: ' + data.email + ' Error: ' + JSON.stringify(err));
                } else {
                    log.debug('API response: Login Success Email: ' + data.email);
                    return res.status(STATUS_CODE.SUCCESS).json({ success: true, message: 'Authentication success.', data: { token: `JWT ${token}`, user: userData } });
                    // return res.status(STATUS_CODE.SUCCESS).json({ success: { message: 'Login Success' }, token: `JWT ${token}`, user: result });
                }
            });
        } catch (err) {

            return res.status(STATUS_CODE.UNAUTHORIZED).json({ error: { message: 'Authentication failed.' }, error_info: err });
        }
    }

};

