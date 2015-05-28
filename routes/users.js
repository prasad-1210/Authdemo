var express = require('express');
var router = express.Router();
var db = require('../database');
var crypto = require('crypto');

router.get('/signin', function(req, res){
	res.render('singin', { title: 'Login'});
});

router.post('/login', function(req, res){
	console.log(req.body);
	db.loginUser(
		req.body.username, 
		req.body.password,
		function(err, records){
			//records:{username, password, salt}
			console.log(records);
			if(!err){
				if(records.length>0){
					var passHash = crypto.createHash('md5').update(req.body.password).digest('hex');
					var passSaltHash = crypto.createHash('md5').update(passHash+""+records[0].salt).digest('hex');
					console.log("Password hash:"+ passHash+"; Password + salt Hash: "+passSaltHash);
					if(passSaltHash===records[0].password){
						req.session.username = req.body.username;
						//res.send(JSON.stringify({response:true}));
					}else{
						//res.send(JSON.stringify({response:false,data:"Incorrect password"}));						
					}
				}else{
					//res.send(JSON.stringify({response:false,data:"No User found with given username"}));
				}
			}else{
				//res.send(JSON.stringify({response:false}));
			}
			//res.render('home', {'title':'Home page'});
			res.redirect('/');
		});
});

router.post('/logout', function(req, res){
		req.session.destroy(function(err){
			res.redirect('/');
		});
});

router.get('/home', function(req, res){
	if(req.session.username){
		res.render('home', {'title':'Home page'});
	}else{
		res.redirect('/');
	}
});

router.post('/getData',function(req,res){
	var start = parseInt(req.body.page) * parseInt(req.body.limit);
	if(req.session.username){
		db.getData(req.body.orderBy, req.body.orderType, start, req.body.limit, function(err, results){
			if(err){
				res.send(JSON.stringify({response:false}));
			}else{
				res.set("Content-Type","application/json");
				res.send(JSON.stringify({response:true, data: results}));
			}
		});
	}else{
		res.send(JSON.stringify({response:false}));
	}
});

router.post('/getCount', function(req, res){
	if(req.session.username){
		db.getCount(function(err, results){
			if(err){
				res.send(JSON.stringify({response:false}));
			}else{
				res.send(JSON.stringify({response:true, data:results[0]}));
			}
		});
	}else{
		res.send(JSON.stringify({response:false}));
	}
});

module.exports = router;
