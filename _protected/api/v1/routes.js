'use strict';
const express = require('express');
const authRoutes = require('./auth/auth.route')
const userRoutes = require('./user/user.route');

const router = express.Router(); // eslint-disable-line new-cap

router.use('/auth', authRoutes); // mount authentication routes at /auth
router.use('/users', userRoutes); // mount user routes at /users

module.exports = router;



