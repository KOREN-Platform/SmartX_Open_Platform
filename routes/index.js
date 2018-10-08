const express = require('express');
const router = express.Router();

const authenticateServices = require('../policies/AuthencationServices')

const Users = require('../models/users').Users
const App = require('../models/appSchema').App
var mongoose = require('mongoose')

/* GET home page. */
router.get('/', function(req,res) {
	//res.render('index')
	res.render('intro')
})

// authenticateServices.login : 로그인 처리,authenticateServices.loginResult : 로그인 결과값
 router.post('/login', authenticateServices.login, authenticateServices.loginResult)
// 회원가입
router.post('/register', authenticateServices.register)
//로그인 유무 체크
let isAuthenticated = function(req, res, next) {
	if(req.isAuthenticated()){
		return next()
	}
	res.redirect('/')
}
// profile 접속시 로그인 유무 확인 false시 / 로 리다이렉션
router.get('/profile', isAuthenticated, function(req, res){
	res.render('profile', {
		title: 'my info',
		info : req.user
	})
})
//logout
router.get('/logout', function(req, res) {
	req.logout()
	req.session.destroy(function(err){
		if(err){res.send({status:false, message: err})}
		else{
			//res.redirect('/')
			res.send({status:true, message: "success logout"})
		}
	})
})
router.post('/mongo', function(req, res){
	data = req.body
	//console.log(data)
	// var user = new Users({
	// 	_id : new mongoose.Types.ObjectId(),
	// 	email : data.email,
	// 	password : data.password,
	// 	firstName : data.firstName,
	// 	lastName :data.lastName,
	// 	role : data.role
	// })
	
	// user.save(function(err){
	// 	if(err) {
	// 		console.log(err)
	// 		return
	// 	}
	// 	var app = new App({
	// 		appName : data.appName,
	// 		description : data.description,
	// 		author : data.author,
	// 		parameters : data.parameters,
	// 		version : data.version,
	// 		type : data.type,
	// 		user : user._id
	// 	})
	// 	app.save(function(err, result) {
	// 		if (err) {
	// 			console.log(err)
	// 			return
	// 		}
	// 		console.log(user)
	// 		res.send({app : result, user :user})
	// 	})
	// })
	Users.findOne({email : data.email}, function(err, user) {
		if(err) {res.send({err : err})}
		if(user) {
		var app = new App({
			appName : data.appName,
			description : data.description,
			author : data.author,
			parameters : data.parameters,
			version : data.version,
			type : data.type,
			user : user._id
			})
		}
		app.save(function(err, result) {
			if(err)  {res.send({err : err})}
			if(user) {
				//res.send({result :result})
				//console.log(result)
				// Users.findOne({email:"ghwlchlaks"}).populate('apps').exec(function(err, data){
				// 	if(err) {res.send({err : err})}
				// 	if(data) {
				// 		res.send({data: data})
				// 	}
				// })
				Users.findOne({email:"ghwlchlaks"}, function(err, data){
					if(err) {res.send({err : err})}
					if(data) {
						data.apps.push(app)
						data.save(function(err, result){
							if(err) {res.send({err : err})}
							if(result) {
								res.send({data: result})
							}
						})
						
					}
				})
			}
		})
	})
})

router.post('/mongoSel', function(req, res){
	data = req.body
	console.log(data)
	Users.findOne({email : data.email}).populate('apps').exec(function(err, result){
		if (err) {res.send  ({err:err})}
		if (result) {
			res.send({result:result})
		}
	})
})
module.exports = router;
