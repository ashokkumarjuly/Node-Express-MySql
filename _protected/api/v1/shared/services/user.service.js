'use strict';
const Sequelize = require('sequelize');
const async = require('async');
const _ = require('lodash');
const {APP_CONSTANTS, logger} = require('../../../config');
const Models = require('../../models');
const {UTIL} = require('../../../helpers');
const log = logger.appLogger(1);

const APP_ROLES = APP_CONSTANTS.APP_ROLES;
const USER_STATUS = APP_CONSTANTS.STATUS;
const STATUS = APP_CONSTANTS.STATUS;
const STATUS_CODE = APP_CONSTANTS.STATUS_CODE;


var service = {};
service.getUserByEmail = getUserByEmail;
service.getUserById = getUserById;

module.exports = service;


function getUserByEmail(email, cb) {
    //log.trace('getUserByEmail... email:' + email);

    try {
        if (!email) {
            log.error('Email address missing while login ');
            cb({ 'msg': 'Email address missing.' });
            return;
        }

        Models.User.findOne({
            where: {
                email: email,
                //  accountStatus: { $ne: STATUS.DELETED } 
            }
        }).then(function (user) {
            if (!user) {
                log.error('getUserByEmail... User not found.' + JSON.stringify(email));
                cb({ 'msg': 'User not found.' });
            } else {
                cb(null, user);
            }
        }).catch(function (err) {
            log.error('getUserByEmail... Failed to get User... Error: ' + UTIL.err(err));
            cb({ 'msg': 'Failed to get User', 'info': err });
        });
    } catch (err) {
        log.error('getUserByEmail... Error: ' + UTIL.err(err));
        cb(err);
    }
}

function getUserById(userId, filters, cb) {
    log.trace('getUserById... id:' + userId);

    try {
        if (!userId) {
            log.error('getUserById... User id missing while login ');
            cb({ 'msg': 'User Id missing.' });
            return;
        }

        var cond = { id: userId };

        if (filters && filters.active_user) {
            cond.accountStatus = USER_STATUS.ACTIVE;
        } else if (filters && filters.include_disabled) {
            cond.accountStatus = { $ne: USER_STATUS.DELETED };
        }

        //attributes: ['id', 'first_name', 'last_name', 'email', 'password', 'role', 'email_verified', 'last_login_date', 'account_status'],

        Models.User.findOne({ where: cond }).then(function (user) {
            if (!user) {
                log.error('getUserById... User not found. user id: ' + userId);
                cb({ 'msg': 'User not found.' });
            } else {
                cb(null, user);
            }
        }).catch(function (err) {
            log.error('getUserById... Failed to get User... Error: ' + UTIL.err(err));
            cb({ 'msg': 'Failed to get User', 'info': UTIL.err(err) });
        });
    } catch (err) {
        log.error('getUserById... Error: ' + UTIL.err(err));
        cb(err);
    }
}
