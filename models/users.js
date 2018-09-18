var mongoose = require('mongoose')
var Schema = mongoose.Schema

var UserSchema = new Schema({
    email : {type: String, lowercase: true, unique: true, required: true},
    password : {type :String, required: true},
    firstName : {type: String},
    lastName :{type: String},
    date : {
        type : Date, 
        default: Date.now
    },
    applicationId : {type:String}
})
UserSchema.methods.comparePassword = function(inputPassword, cb) {
    if(inputPassword === this.password){
        cb(null, true)
    } else {
        cb('error')
    }
}
var Users = mongoose.model('Users', UserSchema)

module.exports = {
    Users : Users
}