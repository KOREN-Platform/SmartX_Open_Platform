var mongoose = require('mongoose');
var Schema = mongoose.Schema
const Users = require('../models/users').Users

var parameterSchema = new Schema({
    "name" : String,
    "description" : String,
    "inputType" : {
        "boxType" : String,
        "data" : Array,
        "min" : Number,
        "max" : Number,
    },
    "default" : String
})

var appSchema = new Schema({
    "appName" : String,
    "description" : String,
    "author" : {
        "name" : String,
        "email" : {
            type: String,
            lowercase : true
        }
    },
    "parameters" : [parameterSchema],
    "version" : {
        type : String, 
        default: "0.0.1"
    },
    "type" : String,
    "issuedDate" : {
        type : Date, 
        default: Date.now
    },
    user : {type:Schema.Types.ObjectId, ref:'Users'}
})
appSchema.post('deleteOne', function(next){
    console.log("etetetetetettet"+ this._id)
    Users.update(
        {apps :this._id},
        {$pull : {apps : this._id}}
    ).exec()
    next()
})
var App = mongoose.model('App', appSchema)
var Parameter = mongoose.model('Parameter', parameterSchema)

module.exports = {
    App : App,
    Parameter:Parameter,
}