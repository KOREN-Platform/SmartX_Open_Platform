const exec = require('child_process').exec;

//mongodb model
const Result = require('../models/resultSchema').Results


module.exports = {
	/**
	 * @name resultLoad
	 * @description resultLoad : Load result file to hdfs / require mongodb's results collection
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