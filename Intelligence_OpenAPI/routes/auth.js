const express = require('express');
const router = express.Router();

const authenticateServices = require('../policies/AuthencationServices')

/* GET home page. */
router.get('/', function(req,res) {
	res.render('Intro', {title: "Big Data App Container Service"})
})
//signin
router.post('/login', authenticateServices.login, authenticateServices.loginResult)
//signup
router.post('/register', authenticateServices.register)
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
