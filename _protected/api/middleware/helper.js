'use strict';
const { UTIL, APP_CONSTANTS} = require('../helpers');



module.exports = {
    emptyStringsToNullMiddleware: emptyStringsToNullMiddleware
}



function emptyStringsToNullMiddleware(req, res, next) {
    req.body = UTIL.emptyStringsToNull(req.body);
    next();
}
