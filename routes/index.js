const express = require('express');
const router = express.Router();

const authenticateServices = require('../policies/AuthencationServices')
//spark 앱 실행 기능 파일
const SparkPolicy = require('../policies/SparkPolicy')
//slack 또는 email 콜백 기능 파일
const ResultSendToServices = require('../policies/ResultSendToServices')
/* GET home page. */
router.get('/', function(req,res) {
	res.render('Intro', {title: "Big Data App Container Service"})
})

 router.post('/login', authenticateServices.login, authenticateServices.loginResult)

router.post('/api/v2/*', SparkPolicy.sparkSubmit , ResultSendToServices.sendToService)
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
			res.send({status:true, message: "success logout"})
		}
	})
})

module.exports = router;
