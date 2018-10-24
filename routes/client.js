const express = require('express');
const router = express.Router();

//spark 앱 실행 기능 파일
const SparkPolicy = require('../policies/SparkPolicy')
//slack 또는 email 콜백 기능 파일
const ResultSendToServices = require('../policies/ResultSendToServices')
// yarn 상태 데이터를 가져오는 기능 파일
const YarnStateServices = require('../policies/YarnStateServices')
const ClientControllerServices = require('../policies/ClientControllerServices')
const ResultSaveLoad = require('../policies/resultSave')

/* GET client home page. */
router.get('/', function(req, res, next) {
	res.render('client', { title: 'Express'});  
});

// 로그인 상태 유무 체크
let isAuthenticated = function(req, res, next) {
	if(req.isAuthenticated()){
		return next()
	}
	res.redirect('/')
}
/*
isAuthenticated : 로그인유무
SparkPolicy.sparkSubmit  : spark parameter 호출
ResultSendToServices.sendToService : slack 또는 email로 콜백
*/
router.post('/sparkSubmit', isAuthenticated, SparkPolicy.sparkSubmit , ResultSendToServices.sendToService)
// YarnStateServices.appState : yarn의 앱 상태 데이터를 가져옴
router.get('/appState', YarnStateServices.appState)
// YarnStateServices.AllYarnStates : yarn의 전체 상태값을 가져옴
router.get('/clientYarnAll', isAuthenticated, YarnStateServices.clientAllYarnStates)

//HDFS에 업로드된 Data 파일의 리스트를 가져온다.
router.post('/makeList', ClientControllerServices.makeList)
//HDFS에서 접근하여 Data 파일을 업로드 및 삭제한다.
router.post('/dataUpload',ClientControllerServices.dataUpload)
router.post('/dataDelete',ClientControllerServices.dataDelete)
//mongoDB에서 선택한 App에 대한 메타데이터를 받아온다.
router.post('/makeParameterBlank',ClientControllerServices.makeParameterBlank)
//spark log Data를 받아온다.
router.post('/sparkLog', ClientControllerServices.sparkLog)
// ClientControllerServices.delApp : spark 앱 삭제 및 데이터 삭제
router.get('/delApp', ClientControllerServices.delApp)
// ClientControllerServices.saveFile :spark app 파일 저장 , ClientControllerServices.saveInfo : spark parameter 저장
router.post('/saveApp', ClientControllerServices.saveFile, ClientControllerServices.saveInfo);
// ClientControllerServices.appData : spark 앱 데이터 가져옴
router.get('/appData',ClientControllerServices.appData)

// router.post('/resultSave', ResultSaveLoad.resultSave)
router.post('/resultLoad', ResultSaveLoad.resultLoad)




//router.post('/slacklist', Slack.CheckUser,Slack.sendToService)
//router.get('/yarnAllState', YarnStateServices.AllYarnStates)
module.exports = router;
