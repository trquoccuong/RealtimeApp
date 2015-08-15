var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var expressValidator = require('express-validator');
var nunjucks = require('nunjucks');
var flash = require('connect-flash');
var Sequelize = require('sequelize');

global.db = new Sequelize('postgres://postgres:@localhost:5432/quoccuong');

db['user'] = db.import(__dirname + '/models/user.js');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup

nunjucks.configure('views', {
    autoescape: true,
    express: app
})

app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser('techmaster'));
app.use(express.static(path.join(__dirname, 'public')));


app.use(require('./session'));

app.use(passport.initialize());
app.use(passport.session());

app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

app.use(flash());
app.use(function (req, res, next) {
    res.locals.messages = req.session.flash;
    delete req.session.flash;
    next()
});

app.get('*', function (req, res, next) {
    res.locals.user = req.user || null;
    next()
});

app.use('/', routes);
app.use('/users', users);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
