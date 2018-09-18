const exec = require('child_process').exec;

module.exports = {
    AllYarnStates(req, res) {
		//var exec_command = "yarn application -list -appStates ALL"
		var exec_command = 'curl --compressed -H "Accept:application/json"  POST  "http://zest2:8088/ws/v1/cluster/apps"'
		
		child = exec(exec_command, function(error, stdout, stderr){
			if(error !== null) {
				console.log('exec error :' + error)
				res.send({status: false, result:"error"})
			}
			var data = JSON.parse(stdout).apps.app;
			data.sort(function(a,b){
				return a.startedTime > b.startedTime ? -1 : a.startedTime < b.startedTime ? 1 : 0;
			})
			res.send({status:true, result:data})			
		})
	},
	appState(req, res) {
		var application_id =req.query.id
		var exec_command = 'curl --compressed -H "Accept:application/json"  POST  "http://zest2:8088/ws/v1/cluster/apps/"'+req.query.id
		 child = exec(exec_command, function(error, stdout, stderr){
                        if(error !== null) {
                                console.log('exec error :' + error)
                                res.send({status: false, result:"error"})
                        }
                        var data = JSON.parse(stdout).app;
                        res.send({status:true, result:data})
                })
	},
	clientAllYarnStates(req, res) {
		var email = req.user.email;
		var exec_command = `curl --compressed -H "Accept:application/json" POST  "http://zest2:8088/ws/v1/cluster/apps"`

		child = exec(exec_command, function(error, stdout, stderr){
			if(error !== null) {
				console.log('exec error :' + error)
				res.send({status: false, result:"error"})
			}
			var data = JSON.parse(stdout).apps.app;
			var clientData = []
			for (var i in data) {
				if(data[i].name == email) {
					clientData.push(data[i])
				}
			}
			//console.log(clientData)
			clientData.sort(function(a,b){
				return a.startedTime > b.startedTime ? -1 : a.startedTime < b.startedTime ? 1 : 0;
			})
			res.send({status:true, result:clientData})			
		})
	}
}