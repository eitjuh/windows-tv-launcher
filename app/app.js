var config = require('./config')();
var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var MongoClient = require('mongodb');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

app.post('/', function(req, res) {

	var execFile = require('child_process').execFile, child;
	var filePath = "../../iexplore.exe";

	child = execFile(filePath, function(error,stdout,stderr) {
		if (error) {
			console.log(error.stack); 
			console.log('Error code: '+ error.code); 
			console.log('Signal received: '+ error.signal);
		}
		console.log('Child Process stdout: '+ stdout);
		console.log('Child Process stderr: '+ stderr);
	}); 
	 
	child.on('exit', function (code) { 
		console.log('Child process exited with exit code '+ code);
	});

  res.send(200);

  // sending a response does not pause the function
  foo();
});

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

MongoClient.connect('mongodb://' + config.mongo.host + ':' + config.mongo.port  + '/fastdelivery', function(err, db) {
    if(err) {
        console.log('Sorry, there is no mongo db server running.');
    } else {
        var attachDB = function(req, res, next) {
            req.db = db;
            next();
        };
        http.createServer(app).listen(config.port, function(){
            console.log('Express server listening on port ' + config.port);
        });
    }
});


module.exports = app;