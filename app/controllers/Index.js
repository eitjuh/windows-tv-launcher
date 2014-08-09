var express = require('express');
var router = express.Router();


var applications = [];

//module.exports = router;
module.exports = {
	run: function(req, res, next) {
	
		var db = req.db;
	
		db.collection("applications").find({}).toArray(function(err, result) {
			if (err) {
				throw err;
			} else {
				for (i=0; i<result.length; i++) {
					applications[i] = result[i];
				}
			}
		});
		
		//http://stackoverflow.com/questions/18299749/node-js-express-mongodb-multiple-collections
		/*The only bug, per se, that I found, was that when Node restarted and I hit "refresh" in the browser, I didn't see any content being rendered in the HTML. However, any subsequent refresh showed the content consistently.
		*/
		res.render('index',{
			pagetitle: 'Express',
			applications: applications
		});
		
	}
};
