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
		if(role == 2){
			//developer
			//condtion = {email :req.user.email}
			Users.findOne({email : req.user.email}).populate('apps').exec(function(err, appList){
				if (err) {res.send  ({err:err})}
				if (appList) {
					Data.find({},function(err, dataList){
						if (err){
							console.log('mongodb err')
						}else{
							//console.log(appList)
							res.send({applist: appList.apps, datalist : dataList})
						}
					})
				}
			})
		}else if(role == 1){
			//user
			//condtion = {}
			App.find({}, function(err, appList){
				if (err){
					console.log('mongodb err')
				}else{
					Data.find({},function(err, dataList){
						if (err){
							console.log('mongodb err')
						}else{
							//console.log(appList)
							res.send({applist: appList, datalist : dataList})
						}
					})
				}
			})
		}else{}
		
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
		
		//req.User.email

		const form = new multiparty.Form({
			fileNames: 'uploadtest.txt',
			autoFiles: false,
			uploadDir: DummyPath,
			//maxFilesSize: 1024 * 1024 * 5
		});
		form.parse(req, function(err, fields, files){
			// if (err){
			// 	console.log(err)
			// }else{
			// 	const path = files.fileInput[0].path
			// 	const originalName = files.fileInput[0].originalFilename
			// }

			const path = files.fileInput[0].path
			const originalName = files.fileInput[0].originalFilename

			//HDFS에 올릴 파일을 임시로 생성하고 rename
			console.log(originalName)
			console.log(path)
			fs.rename(path, DummyPath+originalName, function (err){});

			//HDFS에 Data 파일을 업로드
			exec('hdfs dfs -put '+DummyPath+originalName + ' /' + conf.DataFolder , function(err, stdout, stderr){
				//임시 생성한 파일을 삭제
				exec('rm '+DummyPath+originalName , function(err, stdout, stderr){
					//업로드 후 새로운 dataList를 생성하여 준다.
					exec("curl -i 'http://"+conf.ManagerIp+":"+conf.HDFSPort+"/webhdfs/v1//"+conf.DataFolder+"?op=LISTSTATUS'" , function(err, stdout, stderr){
						let dataList = stdout.split('pathSuffix":"')
						for(let i=1 ; i<dataList.length ; i++){
			                		dataList[i] = dataList[i].split('","permission')[0]
			        		}
						fs.readdir(conf.AppFolder, function (err, files){
							res.send({datalist : dataList});
						});
					});
				});
			});
        	});
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
		exec('hdfs dfs -rm /' + conf.DataFolder +'/'+ req.body.data , function(err, stdout, stderr){
			console.log('Remove DATA to HDFS')
			//make new data list
			exec("curl -i 'http://"+conf.ManagerIp+":"+conf.HDFSPort+"/webhdfs/v1//"+conf.DataFolder+"?op=LISTSTATUS'" , function(err, stdout, stderr){
				//make data list
				let dataList = stdout.split('pathSuffix":"')
				for(let i=1 ; i<dataList.length ; i++){
	                		dataList[i] = dataList[i].split('","permission')[0]
	        		}
				//fs.readdir(conf.AppFolder, function (err, files){
				res.send({datalist : dataList})
				//});
			});
		});
	},
	/**
	 * @name makeParameterBlank
	 * @description 파라미터 입력 빈칸을 만들기위해 metaData 값을 mongoDB에서 받아서 전달한다.
	 * @method
	 * @param {Object} req.body.appname - 선택한 앱 이름
	 * @param {Object} res
	 */
	 makeParameterBlank(req, res){
		const appname = req.body.appname//+'.py'
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
						// appname : metadata.appName,
						// author : metadata.author,
						// version : metadata.version,
						// description : metadata.description,
						nameList : nameList,
						descriptionList : descriptionList,
						defaultList : defaultList,
						typeList : typeList,
						typeDataList : typeDataList,
						typeMaxList : typeMaxList,
						typeMinList : typeMinList
						})
				}
		})
	},
	/**
	 * @name sparkLog
	 * @description spark log data를 받아온다. log를 받아야할 파일이 없다면 만든다.
	 * @method
	 * @param {Object} req
	 * @param {Object} res
	 */
	sparkLog(req, res){
		//spark log가 저장되는 파일을 불러온다.
		fs.readFile('/var/log/spark.log', 'utf-8', function(err, data){
			//log4j 설정 내용
			const addLog4j = "log4j.rootLogger=${root.logger}\nlog4j.appender.RollingAppender=org.apache.log4j.DailyRollingFileAppender\nlog4j.appender.RollingAppender.File=/var/log/spark.log\nlog4j.appender.RollingAppender.DatePattern='.'yyyy-MM-dd\nlog4j.appender.RollingAppender.layout=org.apache.log4j.PatternLayout\nlog4j.appender.RollingAppender.layout.ConversionPattern=[%p] %d %c %M - %m%n\n# By default, everything goes to console and file\nlog4j.rootLogger=INFO, RollingAppender\nroot.logger=INFO,console\nlog4j.appender.console=org.apache.log4j.ConsoleAppender\nlog4j.appender.console.target=System.err\nlog4j.appender.console.layout=org.apache.log4j.PatternLayout\nlog4j.appender.console.layout.ConversionPattern=%d{yy/MM/dd HH:mm:ss} %p %c{2}: %m%n\nshell.log.level=WARN\nlog4j.logger.org.eclipse.jetty=WARN\nlog4j.logger.org.spark-project.jetty=WARN\nlog4j.logger.org.spark-project.jetty.util.component.AbstractLifeCycle=ERROR\nlog4j.logger.org.apache.spark.repl.SparkIMain$exprTyper=INFO\nlog4j.logger.org.apache.spark.repl.SparkILoop$SparkILoopInterpreter=INFO\nlog4j.logger.org.apache.parquet=ERROR\nlog4j.logger.parquet=ERROR\nlog4j.logger.org.apache.hadoop.hive.metastore.RetryingHMSHandler=FATAL\nlog4j.logger.org.apache.hadoop.hive.ql.exec.FunctionRegistry=ERROR\nlog4j.logger.org.apache.spark.repl.Main=${shell.log.level}\nlog4j.logger.org.apache.spark.api.python.PythonGatewayServer=${shell.log.level}\nlog4j.logger.org.apache.spark.repl.Main=${shell.log.level}\nlog4j.logger.org.apache.spark.api.python.PythonGatewayServer=${shell.log.level}"

			if(err){//spark.log 파일을 찾을 수 없을 경우 spark.log 파일을 만들고 log4j를 수정하여 spark.log에 log 데이터를 저장 하도록 설정한다.

				//log4j 파일 수정(cloudera를 이용하여 설치 하였을 경우 한정)
				fs.writeFile('/opt/cloudera/parcels/CDH/lib/spark/conf/log4j.properties',addLog4j,'utf-8',function(err){
					if(err){
						//console.log('first, install spark with Cloudera Manager')
					} else {
						//console.log('revise log4j')
					}
				})

				//spark.log를 생성
				fs.writeFile('/var/log/spark.log','make new log file','utf-8',function(err){
					if(err){
					} else {
						//console.log('make new log file')
					}
				})
			
			} else {
				let latelyLog = new Array()
				latelyLog[0] = ''
				//보여주는 log 줄 수 (모든 로그를 보여주면 양이 너무 많아서 매우 느려짐)
				const visibleLog = 20

				data = data.split('\n')

				for(i = data.length-2 ; i > data.length-visibleLog ; i--){
					for(j = visibleLog+2 ; j > -1 ; j--){
						latelyLog[j] = latelyLog[j] + data[i] + '\n'
					}
				}
				//latelyLog : 최근 log data
				//allLog : 모든 log data
				res.send({latelyLog : latelyLog, allLog : data})
			}
		})
	},
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