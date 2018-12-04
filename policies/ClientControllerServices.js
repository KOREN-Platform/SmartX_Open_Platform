const exec = require('child_process').exec;
const fs = require('fs')
const multiparty = require('multiparty');
const conf = require('../config/config.json')

//mongodb model
const App = require('../models/appSchema').App
const Users = require('../models/users').Users
const Data = require('../models/dataSchema').Datas

module.exports = {
	/**
	 * @name makeList
	 * @description makeList : HDFS에 접근하여 HDFS Data에 업로드된 Data의 리스트와 app폴더에 있는 App의 리스트를 가져온다.
	 * @method
	 * @param {Object} req
	 * @param {Object} res
	 */
    makeList(req, res) {
		let role = req.user.role

		const appList = function(){
			return new Promise(function(resolve, reject){
				//developers can only use their own
				if(role == 2){//user == developer
					Users.findOne({email : req.user.email}).populate('apps').exec(function(err, appList){
						if(err){
							console.log('reject')
							reject("MongoDB AppList find Failed")
						}else{
							console.log('resolve')
							console.log(appList)
							resolve(appList.apps)
						}
					})
				}else{
					App.find({}, function(err, appList){
						if(err){
							reject("MongoDB AppList fine Failed")			
						}else{
							console.log(appList)
							resolve(appList)
						}
					})
				}		
			})
		}

		const dataList = function(){
			return new Promise(function(resolve, reject){
				Data.find({},function(err, dataList){
					if(err){
						reject("MongoDB DataList find Failed")
					}else{
						resolve(dataList)
					}
				})
			})
		}

		appList()
		.then(appList => dataList()
		.then(dataList => {
			res.send({applist: appList, datalist : dataList})
		})
		)
		
	},
	/**
	 * @name dataUpload
	 * @description dataUpload : HDFS에 선택한 Data파일을 업로드한다. 
	 * @method
	 * @param {Object} req - 업로드 할 파일들
	 * @param {Object} res
	 */
	dataUpload(req, res){
		//DummyPath : 임시 파일을 생성할 장소
		const DummyPath = conf.AppFolder
		const email = req.user.email


		const form = new multiparty.Form({
			fileNames: 'Dummy.txt',
			autoFiles: false,
			uploadDir: DummyPath,
			//maxFilesSize: 1024 * 1024 * 5
		})

		const formParsing = function(){
			return new Promise(function(resolve, reject){
				form.parse(req, function(err, fields, files){
					if(err){
						res.send({status: true, result: "File Form parsing Error"})
					}else{
						const description = fields.description[0]
						const fileSize = fields.fileSize[0]

						let formData = new Array()

						formData[0] = fields
						formData[1] = files
						resolve(formData)
					}
				})
			})
		}

		const fileRename = function(formData){
			return new Promise(function(resolve, reject){

				const files = formData[1]

				const path = files.fileInput[0].path
				const originalName = files.fileInput[0].originalFilename

				fs.rename(path, DummyPath+originalName, function (err){
					if(err){
						res.send({status: true, result: "dummyfile rename Failed"})
					}else{
						resolve(true)
					}
				})
			})
		}

		const fileUnlink = function(formData){
			return new Promise(function(resolve, reject){

				const files = formData[1]
				const originalName = files.fileInput[0].originalFilename

				fs.unlink(DummyPath+originalName, function(err){
					if(err){
						res.send({status: true, result: "dummyfile remove Failed"})
					}else{
						
						console.log('data file upload success')
						resolve(true)
					}
				})
			})
		}

		const fileDataSave = function(formData){
			return new Promise(function(resolve, reject){

				const fields = formData[0]
				const files = formData[1]
				const originalName = files.fileInput[0].originalFilename
				const description = fields.description[0]
				const fileSize = fields.fileSize[0]

				data = new Data({
					"Uploader" : email,
					"dataName" : originalName,
					"file_loca" : conf.DataFolder,
					"description" : description,
					"size" : fileSize
				})
				data.save(function(err, user) {
					if(err){
						res.send({status: true, result: "DB save Error"})
					}else{
						resolve(user)
					}
				})
			})
		}

		const uploadHDFS = function(formData){
			return new Promise(function(resolve, reject){

				const files = formData[1]
				const originalName = files.fileInput[0].originalFilename

				exec('hdfs dfs -put '+DummyPath+originalName+' '+conf.DataFolder , function(err, stdout, stderr){
					if(err){
						res.send({status: true, result: "HDFS upload Failed"})
					}else{
						resolve(true)
					}
				})
			})
		}

		formParsing()
		.then(formData => fileRename(formData)
		.then(result => uploadHDFS(formData))
		.then(result => fileUnlink(formData))
		.then(result => fileDataSave(formData))
		.then(user => {
			res.send({status: true, result: user})
		})
		)
	},
	/**
	 * @name dataDelete
	 * @description HDFS에 저장된 Data 파일을 삭제
	 * @method
	 * @param {Object} req.body.data - 삭제할 파일 이름
	 * @param {Object} res
	 */
	dataDelete(req, res){
		//const user_email = req.user.email

		//Remove DATA to HDFS
		exec('hdfs dfs -rm ' + conf.DataFolder +'/'+ req.body.data , function(err, stdout, stderr){
			console.log('Remove DATA to HDFS')
			Data.deleteOne({dataName : req.body.data},function(err, result) {
				if(err){
					console.log('DB delete Error')
					res.send({status: false, result: "DB delete Error"})
				}else{
					res.send({status: true, result: result})
				}
			})
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
	},
	delApp(req, res) {
		const id = req.query.id.split('.')[0]
		let path = conf.AppFolder+id+'/'+id+'.py'
		console.log('id='+id)

		const exists = function(){
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

		const unlink = function(){
			return new Promise(function(resolve, reject){
				fs.unlink(path, function(err){
					if(err) {
						res.send({status: false, result: "permission denied"})
					}else{
						resolve(true)
					}
				})
			})
		}

		const rmdir = function(){
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

		const DBDataRemove = function(){
			return new Promise(function(resolve, reject){
				App.deleteOne({appName : id+'.py'},function(err, result) {
					if(err) {res.send({status: false, result:err})}
					if(!result) {res.send({status: false, result: result})}
					else {
						resolve(result)
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
		.then(result => rmdir())
		.then(result => DBDataRemove())
		.then(result => {
			res.send({status: true, result: result})
		})

	},
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
		console.log(info.appName)
		App.findOne({"appName" : info.appName}, function(err, user) {
			if(err) {
				res.send({status:false, result: err})
			}
			if(!user) {
				//save data
				parameter = []

				for (let data of info.parameters){
					parameter.push(data)
				}
				app = new App({
					"appName" : info.appName,
					"description" : info.description,
					"author" : info.author,
					"parameters" : parameter,
					"version" : info.version,
					"type" :info.type
				})
				app.save(function(err, user) {
					//console.log('create', user)
					res.send({status: true, result: user})
				})
			} 
			else {
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

			const existCheckDB = function(){
				return new Promise(function(resolve, reject){
					App.findOne({"appName" : originalFilename}, function(err, data) {
						if(err) {
							{res.send({status:false, result:err})}
						}
						else {
							if(data == null){
								{res.send({status:false, result:'A file with the same name exists.'})}
							}else{
								resolve(true)
							}
						}
					})
				})
			}

			const mkdir = function(){
				return new Promise(function(resolve, reject){
					fs.mkdir(conf.AppFolder+splitName, function(err){
						if(err) {
							res.send({status: false, result: err})
						}else{
							resolve(true)
						}
					})
				})
			}

			const rename = function(){
				return new Promise(function(resolve, reject){
					fs.rename(path, conf.AppFolder+splitName+'/'+originalName, function(err){
						if(err){
							res.send({status: false, result: err})
						}else{
							resolve(true)
						}
					})
				})
			}

			existCheckDB()
			.then(result => mkdir())
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
	appData(req, res) {
		const id = req.query.id
		App.findOne({appName:id}, function(err, app) {
			if(err) {res.send({status: false, result: err})}
			if(!app) {res.send({status: false, result: "not exists app data"})}
			else {
				res.send({status: true, result: app})
			}
		})
	}
}