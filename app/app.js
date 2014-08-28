var config = require('./config')();
var express = require('express');
var path = require('path');
var fs = require('fs-extra');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var MongoClient = require('mongodb');
var db;
var attachDB = function(req, res, next) {
    req.db = db;
    next();
};

var app = express();
app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));

var IndexController = require('./controllers/Index');
var ApplicationController = require('./controllers/Application');

//routes
app.all('/', attachDB, function(req, res, next) {
    IndexController.run(req, res, next);
});
app.post('/launch-app', function(req, res, next) {
    ApplicationController.launchApp(req, res, next);
});
app.all('/add-application', attachDB, function(req, res, next) {
    ApplicationController.run(req, res, next);
});
app.post('/add-application-submit', attachDB, function(req, res, next) {
    ApplicationController.saveApplication(req, res, next);
});
app.post('/update-app-order', attachDB, function(req, res, next) {
    ApplicationController.updateApplicationOrder(req, res, next);
});
//end routes

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

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

MongoClient.connect('mongodb://' + config.mongo.host + ':' + config.mongo.port  + '/tv-launcher', function(err, resultDB) {
    if(err) {
        console.log('Sorry, there is no mongo db server running.');
    } else {
        db = resultDB;
			
        http.createServer(app).listen(config.port, function(){
            console.log('Express server listening on port ' + config.port);
        });
		
		/* start chrome with the server */
		//var exec = require('child_process').exec, child;
		//
		//child = exec('"C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe" --user-data-dir=C:\\tvlauncher\\windows-tv-launcher\\tmp --kiosk http://localhost:3000/',
		//  function (error, stdout, stderr) {
		//	console.log('stdout: ' + stdout);
		//	console.log('stderr: ' + stderr);
		//	if (error !== null) {
		//	  console.log('exec error: ' + error);
		//	}
		//});
    }
});


module.exports = app;