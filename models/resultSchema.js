var mongoose = require('mongoose')
var Schema = mongoose.Schema

var ResultSchema = new Schema({
    app_id : {type: String},
    file_loca : {type :String,},
    date : {
        type : Date,
        default: Date.now
    }
})

var Results = mongoose.model('datas', ResultSchema)

module.exports = {
    Results : Results
}