const mongoose = require('mongoose');

const File = new mongoose.Schema({
    path:{
        type:String,
        required:true
    },
    original_name:{
        type:String,
        required:true
    },
    password:{
        type:String
    },
    download_count:{
        type:Number,
        default:0
    }
})

module.exports = mongoose.model("File",File);
