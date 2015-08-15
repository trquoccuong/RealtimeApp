'use strict';
var session = require('express-session');

module.exports = session({
    secret: "secret",
    key: 'techmaster.vn',
    saveUninitialized: true,
    resave: true
})