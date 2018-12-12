var mongoose = require('mongoose')
var Schema = mongoose.Schema

var ResultSchema = new Schema({
    application_id : {
        type: Number,
        required :true
    },
    path : {
        type:String,
        required: true
    },
    date : {
        type : Date,
        default: Date.now
    }
})

var Results = mongoose.model('Results', ResultSchema)

module.exports = {
    Results : Results
}