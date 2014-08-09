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
	}
};
