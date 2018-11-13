const exec = require('child_process').exec;
const fs = require('fs')
const multiparty = require('multiparty');
const conf = require('../config/config.json')
const zipper = require('zip-local')
const mime = require('mime')
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
									let	content = '{\n'+
										'"swagger": "2.0",\n'+
										'"info": {\n'+
										  '"description": "This is a sample server Spark server.  You can find out more about Swagger at [http://swagger.io](http://swagger.io) or on [irc.freenode.net, #swagger](http://swagger.io/irc/).  For this sample, you can use the api key `special-key` to test the authorization filters.",\n'+
										  '"version": "'+info.version+'",\n'+
										  '"title": "'+info.appName+'",\n'+
										  '"termsOfService": "http://swagger.io/terms/",\n'+
										  '"contact": {\n'+
											'"email": "ghwlchlaks@naver.com"\n'+
										  '},\n'+
										  '"license": {\n'+
											'"name": "Apache-2.0",\n'+
											'"url": "http://www.apache.org/licenses/LICENSE-2.0.html"\n'+
										  '}\n'+
										'},\n'+
										'"host": "zest3:3000",\n'+
										'"basePath": "/client/v2",\n'+
										'"tags": [\n'+
										  '{\n'+
											'"name": "'+info.appName+'",\n'+
											'"description": "'+info.description+'",\n'+
											'"externalDocs": {\n'+
											  '"description": "Find out more",\n'+
											  '"url": "http://192.168.2.13:3000"\n'+
											'}\n'+
										  '},\n'+
										  '{\n'+
											'"name": "pet",\n'+
											'"description": "Everything about your Pets",\n'+
											'"externalDocs": {\n'+
											  '"description": "Find out more",\n'+
											  '"url": "http://swagger.io"\n'+
											'}\n'+
										  '}\n'+
										'],\n'+
										'"schemes": [\n'+
										  '"http"\n'+
										'],\n'+
										'"paths": {\n'+
										  '"/sparkSubmit": {\n'+
											'"post": {\n'+
											  '"tags": [\n'+
												'"sparkSubmit"\n'+
											  '],\n'+
											  '"summary": "apps description",\n'+
											  '"description": "",\n'+
											  '"operationId": "'+info.appName+'",\n'+
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
												  '"description": "apps description",\n'+
												  '"required": true,\n'+
												  '"schema": {\n'+
													'"$ref": "#/definitions/Spark"\n'+
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
											  '"security": [\n'+
												'{\n'+
												  '"petstore_auth": [\n'+
													'"write:pets",\n'+
													'"read:pets"\n'+
												  ']\n'+
												'}\n'+
											  '],\n'+
											  '"x-swagger-router-controller": "Spark"\n'+
											'}\n'+
										  '}\n'+
										'},\n'+
										'"securityDefinitions": {\n'+
										  '"petstore_auth": {\n'+
											'"type": "oauth2",\n'+
											'"authorizationUrl": "http://petstore.swagger.io/api/oauth/dialog",\n'+
											'"flow": "implicit",\n'+
											'"scopes": {\n'+
											  '"write:pets": "modify pets in your account",\n'+
											  '"read:pets": "read your pets"\n'+
											'}\n'+
										  '}\n'+
										'},\n'+
										'"definitions": {\n'+
										  '"Spark": {\n'+
											'"type": "object",\n'+
											'"required": [\n'+
											  '"email",\n'+
											  '"data",\n'+
											  '"paramter",\n'+
											  '"target",\n'+
											  '"user",\n'+
											  '"APP"\n'+
											'],\n'+
											'"properties": {\n'+
											  '"email": {\n'+
												'"type": "string",\n'+
												'"example": "'+info.author.email+'"\n'+
											  '},\n'+
											  '"data": {\n'+
												'"type": "string",\n'+
												'"example": "AtoZ.txt"\n'+
											  '},\n'+
											  '"target": {\n'+
												'"type": "string",\n'+
												'"example": "email"\n'+
											  '},\n'+
											  '"user": {\n'+
												'"type": "string",\n'+
												'"example": "ghwlchlaks@naver.com"\n'+
											  '},\n'+
											  '"APP": {\n'+
												'"type": "string",\n'+
												'"example": "wordcount_search.py"\n'+
											  '}\n'+
											'},\n'+
											'"title": "A spark",\n'+
											'"description": "running spark",\n'+
											'"example": {\n'+
											  '"email": "'+info.author.email+'",\n'+
											  '"data": "AtoZ.txt",\n'+
											  '"parameter": "--word A",\n'+
											  '"target": "email",\n'+
											  '"user": "ghwlchlaks@naver.com",\n'+
											  '"APP": "wordcount_search.py"\n'+
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
											const submit = 'java -jar swagger-codegen/modules/swagger-codegen-cli/target/swagger-codegen-cli.jar generate -i '+conf.JsonFolder+ info.appName.split('.')[0]+'.json'+ ' -l nodejs-server -o '+conf.SwaggerFolder+info.appName.split('.')[0]
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
			console.log(path)
			console.log(originalName)
			console.log(splitName)
			
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
	downloadFile(req, res){
		const fileName = req.params.fileName
		console.log(fileName)
		const savedPath = "./swagger-codegen/node/"
		let file = savedPath+fileName
		// let mimetype = mime.lookup(fileName)
		// res.setHeader("Content-disposition", 'attachment; filename='+fileName)
		// res.setHeader("Content-type", mimetype)
		// let filestream = fs.createReadStream(file)
		//filestream.pipe(res)
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
																					res.send({status: true, result: result})
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

