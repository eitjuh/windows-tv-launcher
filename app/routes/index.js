var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	console.log(req.db);
	res.render('index', { title: 'Express' });
});

router.post('/launch-app', function(req, res) {
	var execFile = require('child_process').execFile, exec = require('child_process').exec;
	
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
	
		//console.log('komtiehier');
		console.log(req.body.command);
		exec(req.body.command, function(error,stdout,stderr){
			console.log(stdout);
		});
	}
		
	res.send(200);
	
	// sending a response does not pause the function
	foo();
});

module.exports = router;
