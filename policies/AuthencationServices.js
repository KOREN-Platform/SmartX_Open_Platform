const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const Users = require('../models/users').Users
const session = require('express-session')
var mongoose = require('mongoose')
module.exports = {
    /**
     * @name service
     * @description  로그인 정보 확인
     * @method
     * @param {Object} req 
	 * @param {Object} res
    */
    service(req, res) {
        passport.serializeUser(function(user, done){
            done(null, user)
        });
        passport.deserializeUser(function(id, done){
            Users.findById(id, function(err, user) {
                done(err, user)
            });
        });

        passport.use(new LocalStrategy({
            usernameField : 'email',
            passwordField : 'password',
            session : true,
            passReqToCallback :false
        },(email, password, done)=> {
            Users.findOne({email: email},(err, user) =>{
                if(err) {return done(err)}
                if (!user) {return done(null, false, {message:"not exists"})}
                else {
                    return user.comparePassword(password, (error, isMatch)=> {
                        if (isMatch) {
                            return done(null, user)
                        } else {
                            return done(null, false, {message: "not match password"})
                        }
                    })
                }
            })
        }))
    },
    /**
     * @name login
     * @description 로그인 처리
     * @method
     * @param {Object} req.query
	 * @param {Object} res
     */
    login(req, res, next) {
        passport.authenticate('local', function(err, user) {
            if(err) {return next(err)}
            if(!user) {
                return res.status(401).send({
                    status:false,
                    message: "failed login"
                })
            }
            req.login(user, function(err){
                if(err){return next(err)}
                else{next()}
            })
        })(req, res, next)
    },
    /**
     *  @name loginResult
     *  @description 로그인 결과
     *  @method
     */
    loginResult (req, res) {
        req.session.email = req.user.email
        req.session.role = req.user.role
        console.log(req.session)
        res.send({
            status: true,
            message: req.user.email
        })
    },
    /**
     * @name register
     * @description 회원가입
     * @method
     * @param {Object} req.body - 앱 아이디
	 * @param {Object} res
     */
    register(req, res) {
        const inputUser = req.body
        inputUser["_id"] = new mongoose.Types.ObjectId()
        Users.findOne({email : inputUser.email}, function(err, user){
            if(err) {res.send({status: false, message: err})}
            if(user) {res.send({status: false, message: "user exists"})}
            else {
                user = new Users(inputUser)
                user.save(function(err, user){
                    if(err) {res.send({status: false, message: err})}
                    else{
                        res.send({status: true, message: user})
                    }
                })
            }
        })
    }
}


