var express = require('express');
var passport = require('passport')
var router = express.Router();

const authenticateServices = require('../policies/AuthencationServices')

/* GET home page. */
router.get('/', function(req,res) {
	res.render('index')
})
router.post('/login', authenticateServices.login, authenticateServices.loginResult)
router.post('/register', authenticateServices.register)
var isAuthenticated = function(req, res, next) {
	if(req.isAuthenticated()){
		return next()
	}
	res.redirect('/')
}
router.get('/profile', isAuthenticated, function(req, res){
	res.render('profile', {
		title: 'my info',
		info : req.user
	})
})
router.get('/logout', function(req, res) {
	req.logout()
	req.session.destroy(function(err){
		if(err){res.send({status:false, message: err})}
		else{
			res.redirect('/')
		}
	})
})

module.exports = router;
