var express = require('express');
var router = express.Router();

const SparkPolicy = require('../policies/SparkPolicy')
const ResultSendToServices = require('../policies/ResultSendToServices')
const YarnStateServices = require('../policies/YarnStateServices')
const ClientControllerServices = require('../policies/ClientControllerServices')
/* GET client home page. */
router.get('/', function(req, res, next) {
	res.render('client', { title: 'Express'});  
});
var isAuthenticated = function(req, res, next) {
	if(req.isAuthenticated()){
		return next()
	}
	res.redirect('/')
}
router.post('/sparkSubmit', isAuthenticated, SparkPolicy.sparkSubmit , ResultSendToServices.sendToService)

router.post('/makeList', ClientControllerServices.makeList)
router.post('/dataUpload',ClientControllerServices.dataUpload)
router.post('/dataDelete',ClientControllerServices.dataDelete)
router.post('/makeParameterBlank',ClientControllerServices.makeParameterBlank)
router.post('/sparkLog', ClientControllerServices.sparkLog)

router.get('/yarnAllState', YarnStateServices.AllYarnStates)
router.get('/appState', YarnStateServices.appState)
router.get('/clientYarnAll', isAuthenticated, YarnStateServices.clientAllYarnStates)

//router.post('/slacklist', Slack.CheckUser,Slack.sendToService)

module.exports = router;
