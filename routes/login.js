var express = require('express');
var router = express.Router();

/* GET home page. */
let isAuthenticated = function(req, res, next) {
	if(req.isAuthenticated()){
		res.redirect('/client_main')
	}
	else{next()}
}

router.get('/', isAuthenticated,function(req,res) {
	res.render('login')
})
module.exports = router;
