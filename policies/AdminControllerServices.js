const exec = require('child_process').exec;
const fs = require('fs')
const multiparty = require('multiparty');
const conf = require('../config/config.json')
const zipper = require('zip-local')
const markdown = require('markdown-js')
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
									//res.send({status:true, result:data})
									console.log("write swagger json")

									let apiParameters = ''
									let propertiesParams = ''

									for( let i = 0 ; info.parameters.length > i ; i++ ){
										apiParameters+= info.parameters[i].name + ' ' + info.parameters[i].default + ' '
										propertiesParams +=
										'"'+info.parameters[i].name+'": {\n'+
										'"type": "string",\n'+
										'"example": "'+info.parameters[i].default+'",\n'+
										'"description": "'+info.parameters[i].description+'"\n'
										//last cut
										if(info.parameters.length-1 == i){
											propertiesParams += '}\n'
										}else{
											propertiesParams += '},\n'
										}
									}

									console.log(propertiesParams)

									let	content = '{\n'+
										'"swagger": "2.0",\n'+
										'"info": {\n'+
										  '"description": "'+info.description+'",\n'+
										  '"version": "'+info.version+'",\n'+
										  '"title": "'+info.appName.split('.')[0]+'",\n'+
										  '"termsOfService": "http://swagger.io/terms/",\n'+
										  '"contact": {\n'+
											'"email": "'+info.author.email+'"\n'+
										  '},\n'+
										  '"license": {\n'+
											'"name": "Apache-2.0",\n'+
											'"url": "http://www.apache.org/licenses/LICENSE-2.0.html"\n'+
										  '}\n'+
										'},\n'+
										'"host": "'+conf.HostName+':3000",\n'+
										'"basePath": "/client/api/v2",\n'+
										'"tags": [\n'+
										  '{\n'+
											'"name": "'+info.appName.split('.')[0]+'",\n'+
											'"description": "'+info.description+'",\n'+
											'"externalDocs": {\n'+
											  '"description": "Find out more",\n'+
											  '"url": "http://'+conf.ManagerIp+':3000"\n'+
											'}\n'+
										  '}\n'+
										'],\n'+
										'"schemes": [\n'+
										  '"http"\n'+
										'],\n'+
										'"paths": {\n'+
										  '"/'+info.appName.split('.')[0]+'": {\n'+
											'"post": {\n'+
											  '"tags": [\n'+
												'"sparkApps"\n'+
											  '],\n'+
											  '"summary": "'+info.description+'",\n'+
											  '"description": "'+info.description+'",\n'+
											  '"operationId": "'+info.appName.split('.')[0]+'",\n'+
											  '"consumes": [\n'+
												'"application/json",\n'+
												'"application/xml"\n'+
											  '],\n'+
											  '"produces": [\n'+
												'"application/xml",\n'+
												'"application/json"\n'+
											  '],\n'+
											  '"parameters": [\n'+
												'{\n'+
												  '"in": "body",\n'+
												  '"name": "body",\n'+
												  '"description": "Data for running the app",\n'+
													'"required": true,\n'+
												  '"schema": {\n'+
													'"$ref": "#/definitions/JSON"\n'+
													'}\n'+
												'}\n'+
												'],\n'+
											  '"responses": {\n'+
												'"200": {\n'+
												  '"description": "successful operation"\n'+
												'},\n'+
												'"400": {\n'+
												  '"description": "Invalid status value"\n'+
												'},\n'+
												'"404": {\n'+
												  '"description": "not found"\n'+
												'},\n'+
												'"500": {\n'+
												  '"description": "server error"\n'+
												'}\n'+
											  '},\n'+
											  '"x-swagger-router-controller": "Spark"\n'+
											'}\n'+
										  '}\n'+
										'},\n'+
										'"definitions": {\n'+
										  '"Spark": {\n'+
											'"type": "object",\n'+
											'"required": [\n'+
											  '"email",\n'+
											  '"data",\n'+
											  '"parameter",\n'+
											  '"APP"\n'+
											'],\n'+
											'"properties": {\n'+
											  '"email": {\n'+
												'"type": "string",\n'+
												'"example": "'+req.user.email+'",\n'+
												'"description": "your email",\n'+
												'"notes": "your email"\n'+
											  '},\n'+
											  '"data": {\n'+
												'"type": "string",\n'+
												'"example": "AtoZ.txt",\n'+
												'"description": "target data name"\n'+
											  '},\n'+
											  '"target": {\n'+
												'"type": "string",\n'+
												'"example": "email",\n'+
												'"description": "callback target (email or slack)"\n'+
											  '},\n'+
											  '"user": {\n'+
												'"type": "string",\n'+
												'"example": "Your@email.com",\n'+
												'"description": "callback address"\n'+
											  '},\n'+
											  '"APP": {\n'+
												'"type": "string",\n'+
												'"example": "'+info.appName+'",\n'+
												'"description": "target app name"\n'+
												'},\n'+
												propertiesParams +
											'},\n'+
											'"title": "A spark",\n'+
											'"description": "running spark",\n'+
											'"example": {\n'+
											  '"email": "'+req.user.email+'",\n'+
											  '"data": "AtoZ.txt",\n'+
											  '"parameter": "'+apiParameters+'",\n'+
											  '"target": "email",\n'+
											  '"user": "Your@email.com",\n'+
											  '"APP": "'+info.appName+'"\n'+
											'},\n'+
											'"xml": {\n'+
											  '"name": "Spark"\n'+
											'}\n'+
										  '}\n'+
										'},\n'+
										'"externalDocs": {\n'+
										  '"description": "Find out more about Swagger",\n'+
										  '"url": "http://swagger.io"\n'+
										'}\n'+
									  '}'

									let file = conf.JsonFolder+info.appName.split('.')[0] + ".json"
									fs.writeFile(file, content, 'utf8', function(err){
										if(err) {res.send({status:false, result:err})}
										else{
											const submit = 'java -jar swagger-codegen-cli.jar generate -i '+conf.JsonFolder+ info.appName.split('.')[0]+'.json'+ ' -l python -o '+conf.SwaggerFolder+info.appName.split('.')[0]
											exec(submit, function(err, stdout, stderr){
												if(err){
													console.log("1" + err)
													res.send({status:false, result:err})
												} else{
													
													zipper.sync.zip(conf.SwaggerFolder+info.appName.split('.')[0]).compress().save(conf.SwaggerFolder+info.appName.split('.')[0]+".zip")

													res.send({status:true, result:stdout})

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
		else{
				res.send({status: false, result: "file exists"})
			}
		})
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
			// console.log(path)
			// console.log(originalName)
			// console.log(splitName)
			
			fs.mkdir(conf.AppFolder+splitName, function(err){
				if(err) {
					fs.unlink(path, function(err){
						if(!err){
							fs.unlink(files.appFile[1].path, function(err){
								if(!err){
									res.send({status: false, result: "file exists"})
								} else{
									res.send({status:false, result: err})
								}
							})
						}
						else{
							res.send({status:false, result: err})		
						}
					})
				}
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
	getDoc(req, res){
		let appName = req.query.appName
		let str1 = fs.readFileSync(conf.SwaggerFolder+appName.split('.')[0] + "/docs/SparkAppsApi.md", "utf8")
		let str2 = fs.readFileSync(conf.SwaggerFolder+appName.split('.')[0] + "/docs/Spark.md", "utf8")
		let result = markdown.makeHtml(str1 +str2)
		res.send({status:true, result:result})
	},
	downloadFile(req, res){
		const fileName = req.params.fileName
		let file = conf.SwaggerFolder+fileName
		res.download(file)
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

												App.findOneAndRemove({appName : id+'.py'}, function(err, app) {
													if(err) throw err
													if(app){
														console.log("findOneAndRemove"+ app)
														Users.update(
															{"apps" : app._id},
															{"$pull" : {"apps" : app._id}},
															function(err, result){
																if(err) throw err
																if (result){
																	exec('rm -r '+conf.SwaggerFolder+id, function(err, stdout, stderr){
																		if(err){
																			res.send({status: false, result: 'rmdir err'})
																		} else {
																			fs.unlink(conf.SwaggerFolder+id+'.zip',function(err){
																				if(err){
																					res.send({status: false, result: 'unlink err'})
																				}else{
																					fs.unlink(conf.SwaggerFolder+id+'.json',function(err){
																						if(err){
																							res.send({status: false, result: 'unlink err'})
																						} else{
																							res.send({status: true, result: result})
																						}
																					})
																				}
																			})
																		}
																	})
																}
															}
														)
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

