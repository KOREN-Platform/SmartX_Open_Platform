const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const Users = require('../models/users').Users

module.exports = {
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
    loginResult (req, res) {
        res.send({
            status: true,
            message: 'login success'
        })
    },
    register(req, res) {
        var inputUser = req.body
        console.log(req.body)
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


