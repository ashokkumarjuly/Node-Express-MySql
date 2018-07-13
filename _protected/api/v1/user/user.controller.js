"use strict";

const Sequelize = require('sequelize');
const async = require('async');
var crypto = require('crypto');
const _ = require('lodash');
var moment = require('moment');
const uniqid = require('uniqid');
const path = require('path');
const fs = require('fs');
var models = require('../models');
const {APP_CONSTANTS, logger} = require('../../config');
var userService = require('../shared/services/user.service');

const {UTIL} = require('../../helpers');


const log = logger.appLogger();

const USER_STATUS = APP_CONSTANTS.STATUS.USER_STATUS;
const USER_ROLE = APP_CONSTANTS.APP_ROLES;
const STATUS_CODE = APP_CONSTANTS.STATUS_CODE;


const User = models.User;

module.exports = {
    //Get a list of all Users using model.findAll()
    //To get the Current users data by JWT token
    myProfile: function (req, res) {
        var userId = req.user.id;
        log.info('API request: Get my profile... id: ' + userId);

        //Return all associated table that have a matching User_id for the User
        //include: associated table
        async.waterfall([
            function (done) {
                User.findById(userId).then(function (user) {
                    user = user.get({ plain: true });
                    user = _.omit(user, 'password', 'verification_token', 'reset_password_otp', 'reset_password_token', 'reset_password_expires', 'CustomerUserMaps');

                    done(null, user);
                }).catch(function (error) {
                    done(error);
                });
            },
        ], function (error, user) {
            if (error) {
                log.error('API response: Failed to get my profile... id: ' + userId + ' Error: ' + utilities.err(error));
                return res.status(STATUS_CODE.BADREQUEST).json({ success: false, error: { message: 'Profile not exists.' }, error_info: error });
            } else {
                log.info('API response: Get my profile... userId: ' + userId);
                return res.status(STATUS_CODE.SUCCESS).json({ success: true, result: user });
            }
        });
    }
};