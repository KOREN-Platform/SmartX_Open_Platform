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
	 * @name resultSave
	 * @description resultSave : save result file to hdfs
	 * @method
	 * @param {Object} req
	 * @param {Object} res
	 */
	resultSave(req, res){
		const DummyPath = conf.AppFolder
		const resultFolder = conf.ResultFolder
		let resultFileName
		let app_id = res.body.id

		result.findOne({app_id : app_id}, function(err, data){

			data.file_loca
			const resultFileLoca = resultFolder+'/'+data.app_id


		})

		//save result
		result = new Result({
			"app_id" : email,
			"file_loca" : conf.DataFolder,
		})
		result.save(function(err, data) {
			if(err){
				res.send({status: false, result: "db save error"})
			}else{
				res.send({status: true, result: data})
			}
		})

		//save to hdfs
		exec('hdfs dfs -put '+DummyPath+resultFileName+' '+resultFolder , function(err, stdout, stderr){
			if(err){

			}else{

			}
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
		app_id = req.body.id
		//find result file's data to db
		result.findOne({app_id : app_id}, function(err, data){
			if(err){
				res.send({status: false, result: err})
			}else{
				//load to data by hdfs cat
				exec('hdfs dfs -cat '+data.file_loca+'/'+data.app_id, function(err, stdout, stderr){
					if(err){
						res.send({status: false, result: err})
					}else if (stderr){
						res.send({status: false, result: stderr})
					}else{
						//return result data to front
						res.send({status: true, result: stdout})
					}
				})
			}
		})
	}
}