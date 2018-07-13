"use strict";
const express = require('express');
const validate = require('express-validation');
const userController = require('./user.controller')
// const paramValidation = require('../../config/param-validation');

const router = express.Router(); // eslint-disable-line new-cap

router.get('/me', (req, res) =>
res.send('user OK')
);

router.post('/me', userController.myProfile);

module.exports = router;