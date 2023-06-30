const mongoose = require('mongoose')
const { Schema } = mongoose;

const userSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    phonenumber:{
        type:Number,
        min: 1000000000,
        max: 9999999999,
        required:true
    },
    otp:{
        type:String,
    }
})

const userModel = mongoose.model('User',userSchema);
module.exports = userModel;
