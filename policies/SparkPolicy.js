const exec = require('child_process').exec;
const conf = require('../config/config.json')
const Results = require('../models/resultSchema').Results
const fs = require('fs')
let count = 0

module.exports = {
	/**
	 * @name sparkSubmit
	 * @description spark 앱을 실행
	 * @method 
	 * @param {String} req.user.account - 유저 이메일
	 * @param {String} req.body.app_name - 선택한 앱
	 * @param {String} req.body.file - 선택한 데이터 파일
	 * @param {String} req.body.parameter - 입력한 파라미터
	 */
	sparkSubmit(req, res, next) {
		let account =  req.body.email
		if (req.body.email) {
			account = req.body.email
		}else {
			account = req.user.email
		}

		const submit = 'spark-submit '+'--name '+account+' '+conf.AppFolder+req.body.app_name.split('.')[0]+'/'+req.body.app_name+' --file='+req.body.file + ' ' +  req.body.parameter
		count+=1

		const sparkSubmit = function (){
			return new Promise(function(resolve, reject){
				exec(submit, function (err, stdout, stderr) {
					if(err !== null) {
						console.log('exec error :' + err)
						res.send({status: false, result:"error"})
					} else{
						resolve(stdout)
					}
				})
			})
		}

		const makeResultFile = function (stdout){
			return new Promise(function(resolve, reject){
				console.log("count "+ count)
				req.body.stdout = stdout
				let file = account+count+".txt"
				fs.writeFile(file, stdout, 'utf8', function(err){
					if (err) {throw err}
					else{
						resolve(file)
					}
				})
			})
		}

		const resultFileUploadToHDFS = function (file){
			return new Promise(function(resolve, reject){
				exec('hdfs dfs -put '+file+' /result', function(err, stdout, stderr){
					if (err){
						console.log(err)
						throw err
					}
					else{
						resolve(file)
					}
				})
			})
		}

		const deleteResultFile = function (file){
			return new Promise(function(resolve, reject){
				fs.unlink(file, function(err){
					if(err){console.log(err)
						throw err}
					else{
						resolve(file)
					}
				})
			})
		}
		
		const resultDataSaveToDB = function (file){
			return new Promise(function(resolve, reject){
				let results = new Results({
					application_id : count,
					path : "result/"+file,
					date : Date.now()
				})
				results.save(function(err, result){
					if (err) {
						console.log(err)
						throw err
					}else{
						console.log("result : " + result)
						resolve(true)
					}
				})
			})
		}

		sparkSubmit()
		.then(stdout => makeResultFile(stdout))
		.then(file => resultFileUploadToHDFS(file))
		.then(file => deleteResultFile(file))
		.then(file => resultDataSaveToDB(file))
		.then(result => {
			next()
		})
	},
	startCount(){
		Results.find({}, function(err, results){
			if (err) {
				console.log(err)
				throw err
			} else {
				count = results.length
				console.log(count)
			}
		})
	}
}

