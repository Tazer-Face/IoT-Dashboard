const mongoose = require("mongoose");

const deviceSchema = mongoose.Schema({
    name : { 
        type : String ,
        required : true
    },
    location : String ,
    topic : {
        type : String,
        required : true
    }
})

module.exports = mongoose.model("devices",deviceSchema)