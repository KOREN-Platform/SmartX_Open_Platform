var express = require('express');
var router = express.Router();

/* GET home page. */
let isAuthenticated = function(req, res, next) {
	if(req.isAuthenticated()){
		return next()
	}
	res.redirect('/')
}
router.get('/',isAuthenticated ,function(req,res) {
	res.render('yarn',{user:req.user, title:"Yarn"})
})
module.exports = router;
