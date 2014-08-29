var Busboy = require('busboy');
var path = require('path');
var os = require('os');
var fs = require('fs-extra');
var ObjectID = require('mongodb').ObjectID;

module.exports = {
	launchApp: function(req, res, next) {
		var execFile = require('child_process').execFile, exec = require('child_process').exec;
		console.log(req.body);
		if(req.body.type == "launchExe") {
			var filePath = req.body.location;
			
			exec("\"" + filePath + "\"", function(error,stdout,stderr){
				
				if (error) {
					console.log(error.stack); 
					console.log('Error code: '+ error.code); 
					console.log('Signal received: '+ error.signal);
				}
				if(req.body.activationTitle != "Chrome") {
					exec("nircmd win activate ititle \"" + req.body.activationTitle + "\"");
					if(req.body.activationTitle != "XBMC") {
						exec("nircmd win max ititle \"" + req.body.activationTitle + "\"");
					}  
				}
			}); 
		} else if(req.body.type == "launchCommand") {
		
			console.log(req.body.command);
			exec(req.body.command, function(error,stdout,stderr){
				console.log(stdout);
			});
		} else if(req.body.type == "launchUrl") {
			if(req.body.href.match('http')) {
				exec("\"" + "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe" + "\" \"" + req.body.href + "\"", function(error,stdout,stderr){});
			} else {
				exec("\"" + "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe" + "\" \"http://localhost:3000" + req.body.href + "\"", function(error,stdout,stderr){});
			}
		}
			
		res.send(200);
		
		// sending a response does not pause the function
		foo();
	},
	run: function(req, res, next) {
		res.render('add-application',{  
			pagetitle: 'Express'
		});
	},
	saveApplication: function(req, res, next) {
	  var applicationObject = {};
	  
	  if (req.method === 'POST') {
		var busboy = new Busboy({ headers: req.headers });
		busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
			//console.log('File [' + fieldname + ']: filename: ' + filename);
			file.on('data', function(data) {
				//console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
			});
			file.on('end', function() {
				//console.log('File [' + fieldname + '] Finished');
			});
			//moving the uploaded file
			var saveTo = './app/public/img/app-icons/' + filename;
			applicationObject['icon-image'] = '/img/app-icons/' + filename;
			file.pipe(fs.createWriteStream(saveTo));
		});
		busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
			applicationObject[fieldname] = val;
			//console.log('Field [' + fieldname + ']: value: ' + val);
		});
		busboy.on('finish', function(data) {
			console.log('Done parsing form!');
			
			var db = req.db;
			db.collection("applications").insert(applicationObject, function(){
				res.writeHead(303, { Connection: 'close', Location: '/' });
				res.end();
			}); 
		});
		req.pipe(busboy);
	  }	
	},
	updateApplicationOrder: function(req, res, next) {
		if (req.method === 'POST') {
			for (var key in req.body) {
				var db = req.db; 
				
				db.collection("applications").update({_id: new ObjectID(key)}, { $set: {"order": parseFloat(req.body[key])}}, {safe:true}, function(err, result) {
					if (err) {
						console.log('Error updating application: ' + err);
						res.send({'error':'An error has occurred'});
					} else {
						console.log('' + result + ' document(s) updated');
						res.send(key);
					}
				});
			}
		}
	},
	removeApplication: function(req, res, next) {
		if (req.method === 'POST') {
			var db = req.db; 
			db.collection("applications").remove({_id: new ObjectID(req.body.removeId)}, function(err, result) {
				console.log(err);
			});
		}
	}
};
