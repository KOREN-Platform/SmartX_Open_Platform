const exec = require('child_process').exec;
const fs = require('fs')
const multiparty = require('multiparty');
const conf = require('../config/config.json')

//mongodb model
const App = require('../models/appSchema').App
const Users = require('../models/users').Users
const Data = require('../models/dataSchema').Datas
const Result = require('../models/resultSchema').Results

module.exports = {
	/**
	 * @name resultLoad
	 * @description resultLoad : Load result file to hdfs
	 * @method
	 * @param {Object} req
	 * @param {Object} res
	 */
	resultLoad(req, res){
		app_id = req.body.app_id
		//find result file's data to db
		Result.findOne({application_id : app_id}, function(err, data){
			if(err){
				res.send({status: false, result: err})
			}else{
				//load to data by hdfs cat
				exec('curl -L "http://192.168.2.12:9870/webhdfs/v1//'+data.path+'?op=OPEN"', function(err, stdout, stderr){
					if(err){
						res.send({status: false, result: err})
					}else{
						res.send({status: true, result: stdout})
					}
				})
			}
		})
	}
}