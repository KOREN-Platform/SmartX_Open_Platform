var express = require('express');
var router = express.Router();

const AdminControllerServices = require('../policies/AdminControllerServices')

/* admin page. */
var isAdminAuthenticated = function(req, res, next) {
	if(req.isAuthenticated()){		
		return next()
	}
	res.redirect('/')
}
router.get('/',isAdminAuthenticated, function(req, res) {
	res.render('admin');  
});

router.post('/saveApp', AdminControllerServices.saveFile, AdminControllerServices.saveInfo);
router.get('/appList', AdminControllerServices.appList)
router.get('/appData',AdminControllerServices.appData)
router.get('/delApp', AdminControllerServices.delApp)

module.exports = router;
