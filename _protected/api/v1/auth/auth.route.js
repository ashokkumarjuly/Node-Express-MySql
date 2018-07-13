'use strict';
const express = require('express');
const validate = require('express-validation');
const authController = require('./auth.controller')
const router = express.Router(); // eslint-disable-line new-cap
const { AUTH } = require('../../middleware');


router.post('/login', AUTH.login);
// router.post('./login', authController.logout)

module.exports = router;