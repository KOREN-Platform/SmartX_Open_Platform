var mongoose = require('mongoose')
var Schema = mongoose.Schema
const App = require('../models/appSchema').App

var UserSchema = new Schema({
    email : {type: String, lowercase: true, unique: true, required: true},
    password : {type :String, required: true},
    firstName : {type: String},
    lastName :{type: String},
    role :{type:Number , default : 1}, // 1: user, 2: developer, 3: manager
    date : {
        type : Date, 
        default: Date.now
    },
    applicationId : {type:String},
    apps : [{type: Schema.Types.ObjectId, ref: 'App'}]
})

UserSchema.methods.comparePassword = function(inputPassword, cb) {
    if(inputPassword === this.password){
        cb(null, true)
    } else {
        cb('error')
    }
}
// UserSchema.pre('remove', function(next){
//     App.update(
//         {apps :this._id},
//         {$pull : {apps : this._id}}
//     ).exec()
//     next()
// })
var Users = mongoose.model('Users', UserSchema)

module.exports = {
    Users : Users
}