const express = require('express');
const router = express.Router();

const AppControllerServices = require('../policies/AppControllerServices')
const DataControllerServices = require('../policies/DataControllerServices')
// yarn 상태 데이터를 가져오는 기능 파일
const YarnStateServices = require('../policies/YarnStateServices')

// 로그인 상태 유무 체크
let isAuthenticated = function(req, res, next) {
	if(req.isAuthenticated()){
		return next()
	}
	res.redirect('/')
}

/*
page rendering
*/
router.get('/',isAuthenticated, function(req,res) {
	res.render(req.query.name,{user:req.user, title: req.query.name})
})
/*
Client_main(List) page function
*/
// AdminControllerServices.saveFile :spark app 파일 저장 , AdminControllerServices.saveInfo : spark parameter 저장
router.post('/saveApp', AppControllerServices.saveFile, AppControllerServices.saveInfo);
//  AdminControllerServices.appList : 저장된 spark app 리스트 가져옴
router.get('/appList', AppControllerServices.appList)
// AdminControllerServices.appData : spark 앱 데이터 가져옴
router.get('/appData',AppControllerServices.appData)
// AdminControllerServices.delApp : spark 앱 삭제 및 데이터 삭제
router.get('/delApp', AppControllerServices.delApp)
//AdminControllerServices.downloadFile : download code stub
router.get('/download/:fileName', AppControllerServices.downloadFile)
//AdminControllerServices.getDoc : get api document 
router.get('/apiDoc/', AppControllerServices.getDoc)
//mongoDB에서 선택한 App에 대한 메타데이터를 받아온다.
router.post('/makeParameterBlank', AppControllerServices.makeParameterBlank)


/*
App_status(Status) page function and History(history) page function 
*/
// YarnStateServices.appState : yarn의 앱 상태 데이터를 가져옴
router.get('/appState', YarnStateServices.appState)
// YarnStateServices.AllYarnStates : yarn의 전체 상태값을 가져옴
router.get('/clientYarnAll', isAuthenticated, YarnStateServices.clientAllYarnStates)
//ResultSaveLoad.resultLoad : spark result load
router.post('/resultLoad', YarnStateServices.resultLoad)


/*
developer_main(Data) page function 
*/
//HDFS에 업로드된 Data 파일의 리스트를 가져온다.
router.post('/makeList', DataControllerServices.makeList)
//HDFS에서 접근하여 Data 파일을 업로드 및 삭제한다.
router.post('/dataUpload',DataControllerServices.dataUpload)
router.post('/dataDelete',DataControllerServices.dataDelete)


module.exports = router;
