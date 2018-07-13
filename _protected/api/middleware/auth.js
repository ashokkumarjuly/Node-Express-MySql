'use strict';
const jwt = require('jwt-simple');
const passport = require('passport');
const moment = require('moment');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const { APP_CONFIG, APP_CONSTANTS, logger} = require('../config');
const STATUS_CODE = APP_CONSTANTS.STATUS_CODE;

const Models = require(`../${APP_CONFIG.API_VERSION}/Models`);
const userService = require(`../${APP_CONFIG.API_VERSION}/shared/services/user.service`);
const log = logger.appLogger(1);

var auth = {}
auth.authenticate = authenticate;
auth.initialize = initialize;
auth.genToken = genToken;
auth.getStrategy = getStrategy;
auth.login = login;
module.exports = auth;

function authenticate(cb) {

    return passport.authenticate("jwt", { session: false, failWithError: true });
}


function initialize() {
    passport.use("jwt", this.getStrategy());
    return passport.initialize();
}

function genToken(user) {
    let expires = moment().utc().add({ days: 7 }).unix();
    let token = jwt.encode({
        exp: expires,
        email: user.email
    }, APP_CONFIG.JWT_SECRET);

    return {
        token: "JWT " + token,
        expires: moment.unix(expires).format(),
        user: user.id
    };
}
function getStrategy() {
    const params = {
        secretOrKey: APP_CONFIG.JWT_SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
        passReqToCallback: true
    };

    return new JwtStrategy(params, (req, payload, done) => {

        Models.User.findOne({ where: { email: payload.email, accountStatus: APP_CONSTANTS.STATUS.ACTIVE } })
            .then((user) => {
                /* istanbul ignore next: passport response */
                if (user === null) {

                    return done(null, false, { message: "The user in the token was not found" });
                } else {

                    return done(null, { id: user.id, email: user.email });
                }
            });
    });
}
function login(req, res) {
    try {
        req.checkBody("email", "Invalid email").notEmpty();
        req.checkBody("password", "Invalid password").notEmpty();

        let errors = req.validationErrors();
        if (errors) throw errors;

        // let user = userService.findOne({ "email": req.body.email }).exec();
        userService.getUserByEmail(req.body.email, function (err, user) {
            if (err) {
                res.status(STATUS_CODE.UNAUTHORIZED).json({ "message": "Invalid credentials", "errors": err });

            } else {
                if (user) {
                    if (user.accountStatus === APP_CONSTANTS.STATUS.DELETED) {

                        res.status(STATUS_CODE.UNAUTHORIZED).json({ "message": "Invalid credentials", "errors": 'Account not exists' });

                    } else if (user.emailVerified !== APP_CONSTANTS.STATUS.ACTIVE) {
                        res.status(STATUS_CODE.UNAUTHORIZED).json({ success: false, msg: 'Authentication failed. Email address not verified.' });

                    } else if (!user.verifyPassword(req.body.password)) {
                        //compare password
                        res.status(STATUS_CODE.UNAUTHORIZED).json({ success: false, msg: 'Authentication failed, Incorrect Password.' });

                    }
                    else {



                        let data = {}
                        let jwtDecodedString = genToken(user)
                        data.token = jwtDecodedString.token
                        data.user = {
                            email: user.email,
                            id: jwtDecodedString.id,
                            expires: jwtDecodedString.expires,
                            firstName: user.firstName
                        }
                        //  user.lastLoginDate = moment.utc().format('Y-m-d');
                        user.authToken = data.user.token;
                        user.save().then(function (user) {
                            let infoMsg = { success: true, message: 'Authentication success.', data };
                            log.info('Auth [Login] - Invalid credentials, [Error]:'+JSON.stringify(infoMsg));
                            return res.status(STATUS_CODE.SUCCESS).json(infoMsg);
                        });

                    }

                } else {
                    let errorMsg = { "message": "Invalid credentials3", "errors": 'Account not exists' };
                     log.error('Auth [Login] - Invalid credentials, [Error]:'+JSON.stringify(errorMsg));
                    res.status(STATUS_CODE.UNAUTHORIZED).json(errorMsg);
                }
            }
        });


    } catch (err) {
        console.log(err);
        let errorMsg = { "message": "Invalid credentials", "errors": err };
        log.error('Auth [Login] - Invalid credentials, [Error]:'+JSON.stringify(errorMsg));
        res.status(STATUS_CODE.UNAUTHORIZED).json(errorMsg);
    }
}
