const exec = require('child_process').exec;
const fs = require('fs')
const multiparty = require('multiparty');
const conf = require('../config/config.json')

//mongodb model
const App = require('../models/appSchema').App
const Users = require('../models/users').Users

module.exports = {
	/**
	 * @name saveInfo
	 * @description app 데이터 스키마 저장
	 * @method
	 * @param {Object} req - 저장할 앱 스키마 정보
	 * @param {Object} res
	*/
	saveInfo(req, res) {
		const body = req.info
		const info = JSON.parse(fs.readFileSync(conf.AppFolder+body.split('.')[0]+'/'+body,'utf8'))
		//console.log(info.appName)
		App.findOne({"appName": info.appName}, function(err, app){
			if(err) {res.send({status:false, result: err})}
			if(!app){
			Users.findOne({email: req.user.email}, function(err, user){
				if(err) {res.send({status:false, result:err})}
				if(!user) {res.send({status:false,result:"not exists"})}
				else{
					let parameters = []

					for (let data of info.parameters){
						parameters.push(data)
					}
					console.log(parameters)
					let app = new App({
						appName : info.appName,
						description : info.description,
						author : info.author,
						parameters : parameters,
						version : info.version,
						type : info.type,
						user : user._id
					})
					app.save(function(err, result){
						if(err) {res.send({status:false, result:err})}
						if(result) {
							user.apps.push(app)
							user.save(function(err, data){
								if(err) {res.send({status:false, result:err})}
								if(data){
									res.send({status:true, result:data})
								}
							})
						}
					})
				}
			})
		}
		else{
				res.send({status: false, result: "file exists"})
			}
		})

		// App.findOne({"appName" : info.appName}, function(err, user) {
		// 	if(err) {
		// 		res.send({status:false, result: err})
		// 	}
		// 	if(!user) {
		// 		//save data
		// 		parameter = []

		// 		for (let data of info.parameters){
		// 			parameter.push(data)
		// 		}
		// 		app = new App({
		// 			"appName" : info.appName,
		// 			"description" : info.description,
		// 			"author" : info.author,
		// 			"parameters" : parameter,
		// 			"version" : info.version,
		// 			"type" :info.type
		// 		})
		// 		app.save(function(err, user) {
		// 			//console.log('create', user)
		// 			res.send({status: true, result: user})
		// 		})
		// 	} 
		// 	else {
		// 		res.send({status: false, result: "file exists"})
		// 	}
		// })
	},
	
	/**
	 * @name saveFile
	 * @description spark 앱 파일과 스키마 파일 저장
	 * @method
	 * @param {Object} req - 저장할 파일(앱, 스키마)
	 * @param {Object} res
	 * @param {Object} next - 성공시 saveInfo 메소드로 이동
	 */
	saveFile(req, res, next) {
		const form = new multiparty.Form({
			autoFiles: false,
			uploadDir: conf.AppFolder,
		});
		form.parse(req, function(error, fields, files){
			let path = files.appFile[0].path
			let originalName = files.appFile[0].originalFilename
			let splitName = originalName.split('.')[0]
			fs.mkdir(conf.AppFolder+splitName, function(err){
				if(err) {res.send({status: false, result: err})}
				else {
					fs.rename(path, conf.AppFolder+splitName+'/'+originalName, function(err){
						if(err) {res.send({status: false, result: err})}
						else {
							path = files.appFile[1].path
							originalName = files.appFile[1].originalFilename
							fs.rename(path, conf.AppFolder+splitName+'/'+originalName, function(err) {
								if(err) {res.send({status:false, result:err})}
								else {
									req.info = originalName
									next()
								}
							})
						}
					})
				}
			})
		})
	},
	/**
	 * @name appList
	 * @description spark 앱 리스트 가져오기
	 * @method
	 * @param {Object} req
	 * @param {Object} res
	*/
	appList(req, res) {
		const submit = 'ls '+conf.AppFolder
		exec(submit, function(error, stdout, stderr) {
			if(error !== null) {
				res.send({status: false, result:error})
			} else {
				res.send({status:true ,result: stdout})
			}
		});	
	},
	/**
	 * @name appList
	 * @description spark 앱 데이터 가져오기
	 * @method
	 * @param {Object} req.query.id - 앱 아이디
	 * @param {Object} res
	*/
	appData(req, res) {
		const id = req.query.id+'.py'
		App.findOne({appName:id}, function(err, app) {
			if(err) {res.send({status: false, result: err})}
			if(!app) {res.send({status: false, result: "not exists app data"})}
			else {
				res.send({status: true, result: app})
			}
		})
	},
	/**
	 * @name delApp
	 * @description spark 앱 삭제, json파일 삭제 및 mongodb 데이터 삭제
	 * @method
	 * @param {Object} req.query.id - 앱 아이디
	 * @param {Object} res
	 */
	delApp(req, res) {
		const id = req.query.id.split('.')[0]
		let path = conf.AppFolder+id+'/'+id+'.py'
		console.log('id='+id)
		fs.exists(path, function(appExists) {
			if(!appExists) {res.send({status: false, result: "not exists"})}
			else {
				fs.unlink(path, function(err){
					if(err) {res.send({status: false, result: "permission denied"})}
					else {
						 path = conf.AppFolder+id+'/'+id+".json"
						 fs.exists(path, function(jsonExists){
						 	if(!jsonExists) {res.send({status: false, result: "not exists"})}
						 	else {
						 		fs.unlink(path, function(err) {
						 			if(err) {res.send({status: false, result: "permission denied"})}
						 			else {
										path = conf.AppFolder+id
										fs.rmdir(path, function(err){
											if(err) {res.send({status: false, result: "permission denied"})}
											else{
												App.deleteOne({appName : id+'.py'},function(err, result) {
													if(err) {res.send({status: false, result:err})}
													if(!result) {res.send({status: false, result: result})}
													else {
														res.send({status: true, result: result})
													}
												})													
											}
										})
									 }
								})
							}
						})
					}
				}) 
			}
		})
		
	}
}

