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
	 * @param {String} req.user.email - 유저 이메일
	 * @param {String} req.body.App - 선택한 앱
	 * @param {String} req.body.data - 선택한 데이터 파일
	 * @param {String} req.body.parameter - 입력한 파라미터
	 */
	sparkSubmit(req, res, next) {
		const email = req.user.email
		const submit = 'spark-submit '+'--name '+email+' '+conf.AppFolder+req.body.APP.split('.')[0]+'/'+req.body.APP+' --file='+req.body.data + ' ' +  req.body.parameter
		count+=1

		exec(submit, function (err, stdout, stderr) {
			//console.log(submit)
			if(err !== null) {
				console.log('exec error :' + err)
				res.send({status: false, result:"error"})
			}
			else {
				console.log("count "+ count)
				req.body.stdout = stdout
				let file = email+count+".txt"
				fs.writeFile(file, stdout, 'utf8', function(err){
					if (err) {throw err}
					else{
						console.log("test: " +'hdfs dfs -put '+file+' result')
						exec('hdfs dfs -put '+file+' result', function(err, stdout, stderr){
							if (err){
								console.log(err)
								throw err
							}
							else{
								fs.unlink(file, function(err){
									if(err){console.log(err)
										throw err}
									else{console.log("unlink test")}
									let results = new Results({
										application_id : count,
										path : "result/"+file,
										date : Date.now()
									})
									results.save(function(err, result){
										if (err) {console.log(err)
											throw err}
										else{
											console.log("result : " + result)
											next()
										}
									})
								})
							}
						})
					}
				})
			}
		});
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

