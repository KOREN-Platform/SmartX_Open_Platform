//slack config
const {WebClient} = require('@slack/client')
const token = 'xoxp-401187969874-400943764356-429588191991-fd8e255bcf9ee5b0ed296e6115fbd0ac'
const web = new WebClient(token)
const Request= require('request')

//mailer config
const nodemailer = require('nodemailer')

/**
 * @name sendToSlack 
 * @description slack으로 콜백
 * @method
 * @param {String} message - 보낼 메시지
 * @param {String} conversationId - 슬랙 개인별 고유 아이디
 * @param {requestCallback} callback - 보내는데 걸리는 시간
 */
function sendToSlack(message, conversationId, callback) {
  web.chat.postMessage({channel:conversationId, text: message})
  .then((res)=> {
    callback(res.ts)
  }).catch(console.error)
}

module.exports = {
  /**
   * @name sendToService
   * @description callback 서비스 slack email 구분
   * @method
   * @param {String} req.body.target -slack, email target id
   * @param {String} req.body.stdout - spark 앱 결과값
   * @param {String} req.body.user - email, slack id 정보
   */
  sendToService(req, res) {
    const target = req.body.target
    const stdout = req.body.stdout
    const user = req.body.user
    if (target == "slack") {
      checkUser(user, function(result) {
        if (!result) {
          res.send({status:false, result: "slack user not found"})
        } else {
          sendToSlack("result : " + stdout, result, function(response){  
            res.send({status: true, result: stdout})
          })
        }
      })
    } else if(target == "email") {
      sendToEmail("result : "+stdout, user, function(response) {
        res.send({status: true, result: stdout})
      })
    } else {}
  }
}
/**
 * @name sendToEmail
 * @description 이메일 보내기
 * @method
 * @param {String} message - 보낼 메세지
 * @param {String} ToMailName - 보낼 대상 이메일
 * @param {requestCallback} callback - error, info
 */
function sendToEmail(message, ToMailName, callback) {
      let transport = nodemailer.createTransport({
          service : 'gmail',
          auth: {
              user: 'guildzeta@gmail.com',
              pass: 'dksdidzja1'
          }
      })
      let mailOptions = {
          from: 'guildzeta@gmail.com',
          to: ToMailName,
          subject: 'spark result',
          html: '<h1> result </h1>' +
                '<p>'+ message +'</p>'
      }
      transport.sendMail(mailOptions, function(error, info){
          if(error){
              console.log(error)
              callback(error)
          } else {
              console.log(info)
              callback(info)
          }
      })
  }
  /**
   * @name checkUser
   * @description slack user인지 체크
   * @method
   * @param {String} id - slakc email
   * @param {requestCallback} callback - slack 유저 id 
   */
  function checkUser(id, callback) {
    Request({
      method: 'get',
      url: `https://slack.com/api/rtm.start?token=${token}&pretty=1`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      }
    }, function(err, response, body){
      try{
        if(!err && response.statusCode ==200){
          const result = JSON.parse(body)
          const users = result.users
          for (let i in users) {
            if (users[i].name == id ) {
              let ims = result.ims
              for (let j in ims) {
                if (ims[j].user == users[i].id){
                  callback(ims[j].id)
                  return
                }
              }
            }
          }
        }
      }catch(e){
        console.log(e)
        callback(false)
        return
      }
    })
  }