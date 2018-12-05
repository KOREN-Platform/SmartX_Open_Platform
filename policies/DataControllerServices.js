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
    }
}