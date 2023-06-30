const mongoose = require('mongoose')
const { Schema } = mongoose;

const taskSchema = new Schema({
    taskname:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
    },
    user_id:{
        type:String,
        required:true,
    }
})

const taskModel = mongoose.model('Task',taskSchema);
module.exports = taskModel;
