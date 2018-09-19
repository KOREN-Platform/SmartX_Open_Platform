const exec = require('child_process').exec;

module.exports = {
	/**
	 * @name AllYarnStates
	 * @description yarn 상태 전체 데이터
	 * @method
	 * @param {Object} req
	 * @param {Object} res
	 * @return {JSON}
	 */
    AllYarnStates(req, res) {
		const exec_command = 'curl --compressed -H "Accept:application/json"  POST  "http://zest2:8088/ws/v1/cluster/apps"'
		
		child = exec(exec_command, function(error, stdout, stderr){
			if(error !== null) {
				console.log('exec error :' + error)
				res.send({status: false, result:"error"})
			}
			const data = JSON.parse(stdout).apps.app;
			data.sort(function(a,b){
				return a.startedTime > b.startedTime ? -1 : a.startedTime < b.startedTime ? 1 : 0;
			})
			res.send({status:true, result:data})			
		})
	},
	/**
	 * @name appState
	 * @description yarn 개별 상세 데이터
	 * @method
	 * @param {Object} req.query.id - yarn id
	 * @param {Object} res
	 */
	appState(req, res) {
		const application_id =req.query.id
		const exec_command = 'curl --compressed -H "Accept:application/json"  POST  "http://zest2:8088/ws/v1/cluster/apps/"'+application_id
		 child = exec(exec_command, function(error, stdout, stderr){
                        if(error !== null) {
                                console.log('exec error :' + error)
                                res.send({status: false, result:"error"})
                        }
                        const data = JSON.parse(stdout).app;
                        res.send({status:true, result:data})
                })
	},
	/**
	 * @name clientAllYarnStates
	 * @description id 별 yarn 개별 상세 데이터
	 * @method
	 * @param {Object} req.query.email - 유저 이메일
	 * @param {Object} res
	 * @return {JSON}
	 */
	clientAllYarnStates(req, res) {
		const email = req.user.email;
		const exec_command = `curl --compressed -H "Accept:application/json" POST  "http://zest2:8088/ws/v1/cluster/apps"`

		child = exec(exec_command, function(error, stdout, stderr){
			if(error !== null) {
				console.log('exec error :' + error)
				res.send({status: false, result:"error"})
			}
			const data = JSON.parse(stdout).apps.app;
			const clientData = []
			for (let i in data) {
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