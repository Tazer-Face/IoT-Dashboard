const mongoose = require('mongoose');

const userLoginSchema = mongoose.Schema({
    name : {
    type : String ,
    required : true ,
    match : /^\S+$/
    },
    email : {
    type : String ,
    required : true ,
    match : /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    unique : true,
    lowercase: true
    } ,
    password : {
    type : String ,
    required : true ,
    minlength : 8 ,
    unique: true ,
    match : /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
    },
    role : {
    type : String,
    enum : ['user','admin'],
    default : 'user'
    },
    devices :
        [{
            type: mongoose.Schema.Types.ObjectId, ref: 'devices', default: []
        }]
})

module.exports = mongoose.model("userDetail",userLoginSchema);