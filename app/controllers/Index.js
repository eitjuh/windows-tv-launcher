var express = require('express');
var router = express.Router();


var applications = [];

//module.exports = router;
module.exports = {
	run: function(req, res, next) {
	
		var db = req.db;
	
		db.collection("applications").find({}).sort( { order: 1 } ).toArray(function(err, result) {
			if (err) {
				throw err;
			} else {
				for (i=0; i<result.length; i++) {
					applications[i] = result[i];
				}
				res.render('index',{
					pagetitle: 'Express',
					applications: applications
				});
			}
		});
		
	}
};
