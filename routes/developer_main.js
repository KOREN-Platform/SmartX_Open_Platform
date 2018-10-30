const express = require('express');
const router = express.Router();

//admin 페이지 기능 파일
const AdminControllerServices = require('../policies/AdminControllerServices')

/* admin page. */
let isAdminAuthenticated = function(req, res, next) {
	if(req.isAuthenticated()){		
		return next()
	}
	res.redirect('/')
}
router.get('/',isAdminAuthenticated, function(req, res) {
	res.render('developer_main',{user:req.user, title: "Data List"});  
});

// AdminControllerServices.saveFile :spark app 파일 저장 , AdminControllerServices.saveInfo : spark parameter 저장
router.post('/saveApp', AdminControllerServices.saveFile, AdminControllerServices.saveInfo);
//  AdminControllerServices.appList : 저장된 spark app 리스트 가져옴
router.get('/appList', AdminControllerServices.appList)
// AdminControllerServices.appData : spark 앱 데이터 가져옴
router.get('/appData',AdminControllerServices.appData)
// AdminControllerServices.delApp : spark 앱 삭제 및 데이터 삭제
router.get('/delApp', AdminControllerServices.delApp)

module.exports = router;
