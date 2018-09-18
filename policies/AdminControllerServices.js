const exec = require('child_process').exec;
const fs = require('fs')
const multiparty = require('multiparty');

//mongodb model
var App = require('../models/appSchema').App

module.exports = {
	saveInfo(req, res) {
		var body = req.info
		//console.log(fs.readFileSync('../jsonFolder/'+body,'utf8'))
		var info = JSON.parse(fs.readFileSync('../jsonFolder/'+body,'utf8'))
		console.log(info.appName)
		App.findOne({"appName" : info.appName}, function(err, user) {
			if(err) {
				res.send({status:false, result: err})
			}
			if(!user) {
				//save data
				parameter = []

				for (var data of info.parameters){
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

	saveFile(req, res, next) {
		var form = new multiparty.Form({
			autoFiles: false,
			uploadDir: '../appFolder/',
		});
		form.parse(req, function(error, fields, files){
			var path = files.appFile[0].path;
			var originalName = files.appFile[0].originalFilename
			if(error) {res.send({status: false, result:error})}
			fs.exists('../appFolder/'+originalName,function(appExists){
				if(appExists) {
					res.send({status: false, result: "same file name exists"})
				} else {
					fs.rename(path, '../appFolder/' +originalName, function(err){
						if(err) {res.send({status: false, result: err})}
						else {
							path = files.appFile[1].path
							originalName = files.appFile[1].originalFilename
							
							fs.rename(path, '../jsonFolder/' +originalName, function(err) {
								if(err) {res.send({status:false, result:err})}
								else {
									req.info = originalName
									//console.log("req body" +req.info)
									next()
								}
							})
						}
					})
				}
			})		
        });
	},
	appList(req, res) {
		var submit = 'ls ../appFolder/'
		exec(submit, function(error, stdout, stderr) {
			if(error !== null) {
				//console.log('exec error :' + error)
				res.send({status: false, result:error})
			} else {
				res.send({status:true ,result: stdout})
			}
		});	
	},
	appData(req, res) {
		var id = req.query.id
		App.findOne({appName:id}, function(err, app) {
			if(err) {res.send({status: false, result: err})}
			if(!app) {res.send({status: false, result: "not exists app data"})}
			else {
				res.send({status: true, result: app})
			}
		})
	},
	delApp(req, res) {
		var id = req.query.id
		var path = '../appFolder/'+id
		fs.exists(path, function(appExists) {
			if(!appExists) {res.send({status: false, result: "not exists"})}
			else {
				fs.unlink(path, function(err){
					if(err) {res.send({status: false, result: "permission denied"})}
					else {
						path = '../jsonFolder/' + id.split(".")[0] + ".json"
						fs.exists(path, function(jsonExists){
							if(!jsonExists) {res.send({status: false, result: "not exists"})}
							else {
								fs.unlink(path, function(err) {
									if(err) {res.send({status: false, result: "permission denied"})}
									 else {
										App.remove({appName:id},function(err, result) {
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
}

