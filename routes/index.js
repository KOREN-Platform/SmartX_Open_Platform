const express = require('express');
const router = express.Router();

const authenticateServices = require('../policies/AuthencationServices')
//spark 앱 실행 기능 파일
const SparkPolicy = require('../policies/SparkPolicy')
//slack 또는 email 콜백 기능 파일
const ResultSendToServices = require('../policies/ResultSendToServices')
/* GET home page. */
router.get('/', function(req,res) {
	//res.render('index')
	res.render('intro', {title: "Big Data App Container Service"})
})

// authenticateServices.login : 로그인 처리,authenticateServices.loginResult : 로그인 결과값
 router.post('/login', authenticateServices.login, authenticateServices.loginResult)
// 회원가입
/*
isAuthenticated : 로그인유무
SparkPolicy.sparkSubmit  : spark parameter 호출
ResultSendToServices.sendToService : slack 또는 email로 콜백
*/
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
			//res.redirect('/')
			res.send({status:true, message: "success logout"})
		}
	})
})

module.exports = router;
