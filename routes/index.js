const express = require('express');
const router = express.Router();

const authenticateServices = require('../policies/AuthencationServices')

/* GET home page. */
router.get('/', function(req,res) {
	res.render('index')
})
/* 
 author : 최지호
*/
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
			res.redirect('/')
		}
	})
})

module.exports = router;
