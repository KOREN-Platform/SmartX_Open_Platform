const express = require('express');
const router = express.Router();

//spark 앱 실행 기능 파일
const SparkPolicy = require('../policies/SparkPolicy')
//slack 또는 email 콜백 기능 파일
const ResultSendToServices = require('../policies/ResultSendToServices')

//spark run
router.post('/v2/*', SparkPolicy.sparkSubmit , ResultSendToServices.sendToService)

module.exports = router;
