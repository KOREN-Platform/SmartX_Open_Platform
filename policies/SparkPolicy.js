const exec = require('child_process').exec;

module.exports = {
	sparkSubmit(req, res, next) {
		var email = req.user.email
		var submit = 'spark-submit '+'--name '+email+' ../app/'+req.body.APP+' --file='+req.body.data + ' ' +  req.body.parameter
		exec(submit, function (err, stdout, stderr) {
			console.log(submit)
			if(err !== null) {
				console.log('exec error :' + err)
				res.send({status: false, result:"error"})
			}
			else {
				req.body.stdout = stdout
				next()
			}
		});
	}
}

