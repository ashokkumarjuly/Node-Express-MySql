'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const path = require('path');
const cors = require('cors');
const passport = require('passport');
const helmet = require('helmet');
const expressValidator = require("express-validator");
const { APP_CONFIG,logger} = require('../config');
const { AUTH,HELPER} = require('../middleware');
 

const log = logger.appLogger(1);


const app = express();

// By nature helmet internally enables dnsPrefetchControl, frameguard, hidePoweredBy, hsts, ieNoOpen, noSniff, xssFilter modules
app.use(helmet());

// enable CORS - Cross Origin Resource Sharing
app.use(cors());

app.use(compression({ level: 9 }));

logger.serverLogger(app); // Log enabled

// Fetching the API Routes
const ApiRoutes_v1 = require(path.join(__dirname, `../${APP_CONFIG.API_VERSION}/routes`));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(expressValidator());

// Intializing passport + JWT authentication
app.use(AUTH.initialize());
app.use(HELPER.emptyStringsToNullMiddleware)

// Exclude the path which don't want JWt authentication
app.all(`/api/${APP_CONFIG.API_VERSION}/` + "*", function (req, res, next) {

    if (req.path.includes("/auth/login")) {
        return next();
    }
    else {
        return AUTH.authenticate((err, user, info) => {
            //   console.log(err,user, info);
            if (err) { return next(err); }
            if (!user) {
                if (info.name === "TokenExpiredError") {
                    log.error(`Auth - Token expired`);
                    return res.status(401).json({ message: "Your token has expired. Please generate a new one" });
                } else {
                    return res.status(401).json({ message: info.message });
                }
            }
            app.set("user", user);

            return next();
        })(req, res, next);
    }

});


//App API routes
app.use(`/api/${APP_CONFIG.API_VERSION}/`, ApiRoutes_v1);
// app.use('/v2/api', v2);

// To serve build files

app.use(express.static('public')) // to server html files for web
 
app.use('/assets', express.static(path.join(__dirname, 'api/v1/assets/'))); // assets folder 
 
app.use('/debug/:token/', express.static(path.join(__dirname, 'logs')));// Download logs [TEMPORARY FIX]

// If no route is matched by now, it must be a 404
app.use((req, res, next) => {
    res.status(404).json({ "error": "Endpoint not found" });
    next();
});

app.use((error, req, res, next) => {
    if (APP_CONFIG.env === "production") {
        return res.status(500).json({ "error": "Unexpected error: " + error });
    }
    next(error);
});

module.exports = app;


