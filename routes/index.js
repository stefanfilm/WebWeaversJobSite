const router = require('express').Router();
const homeRoute = require('./homeroutes');

router.use('/' , homeRoute)

module.exports = router;