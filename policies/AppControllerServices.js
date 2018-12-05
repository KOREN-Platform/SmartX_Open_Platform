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

		

		//swagger json parameters add
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
		//swagger json data
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
			'"basePath": "/api/v2",\n'+
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
						'"description": "Arguments for running the app",\n'+
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
					'"account",\n'+
					'"file",\n'+
					'"parameter",\n'+
					'"app_name"\n'+
				'],\n'+
				'"properties": {\n'+
					'"account": {\n'+
					'"type": "string",\n'+
					'"example": "'+req.user.email+'",\n'+
					'"description": "issuer\'s account(email)"\n'+
					'},\n'+
					'"app_name": {\n'+
					'"type": "string",\n'+
					'"example": "'+info.appName+'",\n'+
					'"description": "app name"\n'+
					'},\n'+
					'"file": {\n'+
					'"type": "string",\n'+
					'"example": "AtoZ.txt",\n'+
					'"description": "target file name"\n'+
					'},\n'+
					'"callback_method": {\n'+
					'"type": "string",\n'+
					'"example": "email",\n'+
					'"description": "callback target (email or slack)"\n'+
					'},\n'+
					'"callback_addr": {\n'+
					'"type": "string",\n'+
					'"example": "Your@email.com",\n'+
					'"description": "callback address"\n'+
					'},\n'+
					propertiesParams +
				'},\n'+
				'"title": "A spark",\n'+
				'"description": "running spark",\n'+
				'"example": {\n'+
					'"account": "'+req.user.email+'",\n'+
					'"app_name": "'+info.appName+'",\n'+
					'"file": "AtoZ.txt",\n'+
					'"parameter": "'+apiParameters+'",\n'+
					'"callback_method": "email",\n'+
					'"callback_addr": "Your@email.com"\n'+
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

		const checkDBExist = function (){
			return new Promise(function(resolve, reject){
				App.findOne({"appName": info.appName}, function(err, app){
					if(err) {
						res.send({status:false, result:'MongoDB findOne Failed'})
					}
					if(!app){
						Users.findOne({email: req.user.email}, function(err, user){
							if(err) {
								res.send({status:false, result:'MongoDB findOne Failed'})
							}
							if(!user) {
								res.send({status:false, result:"not exists"})
							}else{
								resolve(user)
							}
						})
					}else{
						res.send({status:false, result: 'file exists'})
					}
				})
			})
		}

		const saveDB = function (user){
			return new Promise(function(resolve, reject){

				let parameters = []

				for (let data of info.parameters){
					parameters.push(data)
				}

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
					if(err) {
						res.send({status:false, result:'MongoDB app save Failed'})
					}else{
						user.apps.push(app)
						user.save(function(err, data){
							if(err) {
								res.send({status:false, result:'MongoDB user save Failed'})
							}else{
								resolve(true)
							}
						})
					}
				})
			})
		}

		const swaggerControll = function (){
			return new Promise(function(resolve, reject){
				console.log("write swagger json")
				let file = conf.JsonFolder+info.appName.split('.')[0] + ".json"
				fs.writeFile(file, content, 'utf8', function(err){
					if(err) {res.send({status:false, result:err})}
					else{
						const submit = 'java -jar swagger-codegen-cli.jar generate -i '+conf.JsonFolder+ info.appName.split('.')[0]+'.json'+ ' -l python -o '+conf.SwaggerFolder+info.appName.split('.')[0]
						exec(submit, function(err, stdout, stderr){
							if(err){
								res.send({status:false, result:err})
							} else{
								zipper.sync.zip(conf.SwaggerFolder+info.appName.split('.')[0]).compress().save(conf.SwaggerFolder+info.appName.split('.')[0]+".zip")
								resolve(stdout)
							}
						})
					}	
				})
			})
		}
		
		checkDBExist()
		.then(user => saveDB(user))
		.then(result => swaggerControll())
		.then(result => {
			res.send({status:true, result:result})
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
		})
		
		form.parse(req, function(error, fields, files){
			let path = files.appFile[0].path
			let originalName = files.appFile[0].originalFilename
			let splitName = originalName.split('.')[0]

			const unlink = function (){
				return new Promise(function(resolve, reject){
					fs.unlink(path, function(err) {
						if(err) {
							res.send({status: false, result: "unlink Failed"})
						}else{
							resolve(true)
						}
					})
				})
			}

			const makeAppFolder = function (){
				return new Promise(function(resolve, reject){
					fs.mkdir(conf.AppFolder+splitName, function(err){
						if(err) {
							unlink()
							.then(result => {
								path = files.appFile[1].path
								unlink()
							})
							.then(result => {
								res.send({status: false, result: "file exists"})
							})
						}else{
							resolve(true)
						}
					})
				})
			}

			const rename = function (){
				return new Promise(function(resolve, reject){
					fs.rename(path, conf.AppFolder+splitName+'/'+originalName, function(err){
						if(err) {
							res.send({status: false, result: "rename Failed"})
						}else{
							resolve(true)
						}
					})
				})
			}

			makeAppFolder()
			.then(result => rename())
			.then(result => {
				path = files.appFile[1].path
				originalName = files.appFile[1].originalFilename
				rename()
			})
			.then(result => {
				req.info = originalName
				next()
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
	 * @name appData
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

		const exists = function (){
			return new Promise(function(resolve, reject){
				fs.exists(path, function(Exists) {
					if(!Exists) {
						res.send({status: false, result: "not exists"})
					}else{
						resolve(true)
					}
				})
			})
		}

		const unlink = function (){
			return new Promise(function(resolve, reject){
				fs.unlink(path, function(err) {
					if(err) {
						res.send({status: false, result: "unlink Failed"})
					}else{
						resolve(true)
					}
				})
			})
		}

		const rmdir = function (){
			return new Promise(function(resolve, reject){
				fs.rmdir(path, function(err){
					if(err) {
						res.send({status: false, result: "permission denied"})
					}else{
						resolve(true)
					}
				})
			})
		}

		const removeDBData = function (){
			return new Promise(function(resolve, reject){
				App.findOneAndRemove({appName : id+'.py'}, function(err, app) {
					if(err){
						res.send({status: false, result: "remove MongoDB's data Failed"})
					}else{
						console.log("findOneAndRemove"+ app)
						Users.update(
							{"apps" : app._id},
							{"$pull" : {"apps" : app._id}}
						)
						resolve(true)
					}
				})
			})
		}

		const removeSwaggerFolder = function (){
			return new Promise(function(resolve, reject){
				exec('rm -r '+conf.SwaggerFolder+id, function(err, stdout, stderr){
					if(err){
						res.send({status: false, result: "remove swagger folder Failed"})
					}else{
						resolve(true)
					}
				})
			})
		}

		exists()
		.then(result => unlink())
		.then(result => {
			path = conf.AppFolder+id+'/'+id+".json"
			exists()
		})
		.then(result => unlink())
		.then(result => {
			path = conf.AppFolder+id
			rmdir()
		})
		.then(result => removeSwaggerFolder())
		.then(result => {
			path = conf.SwaggerFolder+id+'.zip'
			unlink()
		})
		.then(result => {
			path = conf.SwaggerFolder+id+'.json'
			unlink()
		})
		.then(result => removeDBData())
		.then(result => {
			res.send({status: true, result: result})
		})		
    },
    /**
     * @name makeParameterBlank
     * @description 파라미터 입력 빈칸을 만들기위해 metaData 값을 mongoDB에서 받아서 전달한다.
     * @method
     * @param {Object} req.body.appname - 선택한 앱 이름
     * @param {Object} res
     */
    makeParameterBlank(req, res){
        const appname = req.body.appname
        App.findOne({appName : appname}, function(error, metadata){
                if(error){
                    console.log(error)
                }else{
                    //넘겨줄 데이터 리스트
                    let nameList = new Array()
                    let descriptionList = new Array()
                    let defaultList = new Array()
                    let typeList = new Array()
                    let typeDataList = new Array()
                    let typeMaxList = new Array()
                    let typeMinList = new Array()

                    //리스트 작성
                    for (let i=0 ; i < metadata.parameters.length ; i++ ){
                        nameList[i] = metadata.parameters[i].name
                        console.log(nameList)
                        descriptionList[i] = metadata.parameters[i].description
                        console.log(descriptionList)
                        defaultList[i] = metadata.parameters[i].default
                        console.log(defaultList)
                        typeList[i] = metadata.parameters[i].inputType.boxType
                        console.log(typeList)
                        typeDataList[i] = metadata.parameters[i].inputType.data
                        console.log(typeDataList)
                        typeMaxList[i] = metadata.parameters[i].inputType.max
                        console.log(typeMaxList)
                        typeMinList[i] = metadata.parameters[i].inputType.min
                        console.log(typeMinList)
                    }

                    //데이터 넘기기
                    res.send({	
                        nameList : nameList,
                        descriptionList : descriptionList,
                        defaultList : defaultList,
                        typeList : typeList,
                        typeDataList : typeDataList,
                        typeMaxList : typeMaxList,
                        typeMinList : typeMinList,
                        metadata : metadata
                        })
                }
        })
    }
}



