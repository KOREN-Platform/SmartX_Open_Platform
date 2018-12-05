const exec = require('child_process').exec;

//mongodb model
const Result = require('../models/resultSchema').Results

module.exports = {
	/**
	 * @name AllYarnStates
	 * @description yarn 상태 전체 데이터
	 * @method
	 * @param {Object} req
	 * @param {Object} res
	 * @return {JSON}
	 */
    AllYarnStates(req, res) {
		const exec_command = 'curl --compressed -H "Accept:application/json"  POST  "http://zest2:8088/ws/v1/cluster/apps"'
		
		child = exec(exec_command, function(error, stdout, stderr){
			if(error !== null) {
				console.log('exec error :' + error)
				res.send({status: false, result:"error"})
			}
			const data = JSON.parse(stdout).apps.app;
			console.log(data)
			data.sort(function(a,b){
				return a.startedTime > b.startedTime ? -1 : a.startedTime < b.startedTime ? 1 : 0;
			})
			res.send({status:true, result:data})			
		})
	},
	/**
	 * @name appState
	 * @description yarn 개별 상세 데이터
	 * @method
	 * @param {Object} req.query.id - yarn id
	 * @param {Object} res
	 */
	appState(req, res) {
		const application_id =req.query.id
		const exec_command = 'curl --compressed -H "Accept:application/json"  POST  "http://zest2:8088/ws/v1/cluster/apps/"'+application_id
		 child = exec(exec_command, function(error, stdout, stderr){
                        if(error !== null) {
                                console.log('exec error :' + error)
                                res.send({status: false, result:"error"})
                        }
                        const data = JSON.parse(stdout).app;
                        res.send({status:true, result:data})
                })
	},
	/**
	 * @name clientAllYarnStates
	 * @description id 별 yarn 개별 상세 데이터
	 * @method
	 * @param {Object} req.query.email - 유저 이메일
	 * @param {Object} res
	 * @return {JSON}
	 */
	clientAllYarnStates(req, res) {
		const email = req.user.email;
		const exec_command = `curl --compressed -H "Accept:application/json" POST  "http://zest2:8088/ws/v1/cluster/apps"`

		child = exec(exec_command, function(error, stdout, stderr){
			if(error !== null) {
				console.log('exec error :' + error)
				res.send({status: false, result:"error"})
			}
			const data = JSON.parse(stdout).apps.app;
			let clientData = []
			if (req.user.role == 3){
				clientData = data
			}
			else{
				for (let i in data) {
					if(data[i].name == email) {
						clientData.push(data[i])
					}
				}
			}
			//console.log(clientData)
			clientData.sort(function(a,b){
				return a.startedTime > b.startedTime ? -1 : a.startedTime < b.startedTime ? 1 : 0;
			})
			res.send({status:true, result:clientData})			
		})
	},
	/**
	 * @name resultLoad
	 * @description resultLoad : Load result file to hdfs
	 * @method
	 * @param {Object} req
	 * @param {Object} res
	 */
	resultLoad(req, res){
		
		//clicked application's id
		app_id = req.body.app_id

		//find result file's data to db
		const findDataToMongo = function (){
			return new Promise(function(resolve, reject){
				Result.findOne({application_id : app_id}, function(err, data){
					if(!err){
						resolve(data)
					}else{
						reject("MongoDB findOne Failed")
					}
				})
			})
		}
		//Loading data from hdfs
		const loadToHDFS = function(data){
			return new Promise(function(resolve, reject){
				exec('curl -L "http://192.168.2.12:9870/webhdfs/v1//'+data.path+'?op=OPEN"', function(err, stdout, stderr){
					if(!err){
						resolve(stdout)
					}else{
						reject("exec Failed\nerr: " +err+ "\nstderr: " +stderr)
					}
				})
			})
		}

		findDataToMongo()
		.then(result => loadToHDFS(result))
		.then(result2 => {
			res.send({status: true, result: result2})
		})
		.catch(function (err){
			console.log(err)
		})

	}
}