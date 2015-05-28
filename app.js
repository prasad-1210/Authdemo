var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var mysql = require('mysql');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

var pool = mysql.createPool({
	connectionLimit : 1000,
	host: '10.47.34.45',
	user:'bess_ui',
	password:'bess',
	database:'test_db',
	debug : false
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret: process.env.SESSION_SECRET, resave: true, saveUninitialized:true, cookie: { maxAge: 60000 }}));
var sess;

app.use('/users', users);
//app.use('/', routes);
app.get('/', function(req,res){
	sess = req.session;
	if(sess.username){
		//logged in user exists, redirect to user home
		res.redirect('/users/home');
		//res.send('User home page');
	}else{
		//logged in user not exists, redirect to user login
		res.redirect('/users/signin');		
		//res.send('User Singin page');
	}
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;