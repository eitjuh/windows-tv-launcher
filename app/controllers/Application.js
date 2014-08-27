var Busboy = require('busboy');
var path = require('path');
var os = require('os');
var fs = require('fs-extra');

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
			exec("\"" + "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe" + "\" \"" + req.body.href + "\"", function(error,stdout,stderr){
			});
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
	}
};
