var mongoose = require('mongoose')
var Schema = mongoose.Schema

var DataSchema = new Schema({
    Uploader : {type: String},
    dataName : {type: String, unique: true, required: true},
    file_loca : {type :String,},
    description : {type: String},
    size : {type: Number},
    date : {
        type : Date,
        default: Date.now
    }
})

var Datas = mongoose.model('datas', DataSchema)

module.exports = {
    Datas : Datas
}