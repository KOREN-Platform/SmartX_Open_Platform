

module.exports = {
    services(req, res) {
        //let ToMailName = req.body.email
        //console.log(ToMailName)
        let transport = nodemailer.createTransport({
            service : 'gmail',
            auth: {
                user: 'guildzeta@gmail.com',
                pass: 'dksdidzja1'
            }
        })
        let mailOptions = {
            from: 'guildzeta@gmail.com',
            //to: ToMailName,
            subject: 'spark result',
            html: '<h1> result </h1>'
        }
        transport.sendMail(mailOptions, function(error, info){
            if(error){
                console.log(error)
                res.send({state: false, result: error})
            } else {
                console.log(info)
                res.send({state: true, result: info})
            }
        })
    }
}