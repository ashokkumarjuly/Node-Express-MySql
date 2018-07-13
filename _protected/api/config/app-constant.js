'use strict';
const SITE_CONFIG = {
    RESTRICT_IP: false,
    // Mobile version code
    MOBILE_APP_MIN_SUPPORT_VERSION: 1,
    CLEAN_OLD_FILES: 1
};

const JWT_CONFIG = {
    jwtSecret: 'secret',
    saltRounds: 10,
    expire_value: 1,
    expire_method: 'year' // seconds, minutes, hours, day, week, months and year
};

const APP_ROLES = {
    ADMIN: "admin",
};

const STATUS_CODE = {
    SUCCESS: 200,
    NOCONTENT: 203,
    ALREADY_REPORTED: 208,
    BADREQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOTFOUND: 404,
    VERSION_OUTDATED: 426,
};

const STATUS = {
    ACTIVE: 1, INACTIVE: 0, DELETED: -1

};

const LOAN_TYPES = {
    LOAN: 1, DEPOSIT: 2
}

const PAGINATION = {
    DEFAULT_LIMIT: 10
};


const LOGGER = {
    CLEANUP_ON_LOGIN: 0, //change to 0 when cron job is configured
    CLEANUP_OLDER_LOGS: 30 // clean logs older than 30 days
};

const DATE_FORMAT = {
    FORMAT_ONE: 'll', //Mar 21, 2017
    FORMAT_TWO: 'YYYY-MM-DD HH:mm:ss', // 2017-03-21 11:10:52
    FORMAT_THREE: 'MMM Do YYYY, h:mm a' // Apr 5th 2017, 6:52 pm
};

const DEPOSIT_INTEREST_RANGE = [
    { "min": 0, "max": 30, "interest": "1.000" },
    { "min": 31, "max": 90, "interest": "2.000" },
    { "min": 91, "max": 180, "interest": "2.125" },
    { "min": 181, "max": 270, "interest": "2.250" },
    { "min": 271, "max": 359, "interest": "2.250" },
    { "min": 360, "max": 539, "interest": "2.375" },
    { "min": 540, "max": 719, "interest": "2.357" },
    { "min": 720, "max": 0, "interest": "2.500" }
]

var PATHS = {
    FILES: {// All the paths should be relative to the web root folder. i.e. /server/
        DOWNLOADS: 'files/downloads/',
        TEMP: 'files/temp/',
        LOGS: 'logs/',
    }
};

const APP_CONSTANTS = {
    SITE_CONFIG: SITE_CONFIG,
    JWTCONFIG: JWT_CONFIG,
    CLIENT_MOBILE: 'mobile',
    APP_ROLES: APP_ROLES,
    STATUS: STATUS,
    STATUS_CODE: STATUS_CODE,
    DATE_FORMAT: DATE_FORMAT,
    PAGINATION: PAGINATION,
    LOGGER: LOGGER,
    LOAN_TYPES: LOAN_TYPES,
    DEPOSIT_INTEREST_RANGE: DEPOSIT_INTEREST_RANGE,
    PATHS:PATHS
};


module.exports = APP_CONSTANTS;
