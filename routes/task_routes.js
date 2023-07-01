const express = require('express');
const task_routes = express.Router();
const { body,header } = require('express-validator')

const tasks_controller = require('../controllers/tasks_controller')
const { checkValidation } = require('../middleware/validationerror')
const { authenticate } = require("../middleware/authenticate");


task_routes.post('/tasks',[
        header('token').isJWT().withMessage('Please provide a valid token'),
        body("taskname").isString().withMessage('Please provide a valid Task name'),
        body("description").isString().withMessage('Please provide valid letters in description'),
],checkValidation, authenticate, tasks_controller.addTask);

task_routes.get('/tasks',[
        header('token').isJWT().withMessage('Please provide a valid token'),
],checkValidation, authenticate, tasks_controller.getAllTask);

task_routes.get('/tasks/:id',[
        header('token').isJWT().withMessage('Please provide a valid token'),
],checkValidation, authenticate, tasks_controller.getTask);

task_routes.patch('/tasks/:id',[
        header('token').isJWT().withMessage('Please provide a valid token'),
        body("taskname").isString().withMessage('Please provide a valid Task name'),
        body("description").isString().withMessage('Please provide valid letters in description'),
],checkValidation, authenticate, tasks_controller.editTask);

task_routes.delete('/tasks/:id',[
        header('token').isJWT().withMessage('Please provide a valid token'),
],checkValidation, authenticate, tasks_controller.deleteTask);

task_routes.use('*',(req,res)=>{
        res.status(404).json({
                status:false,
                msg: 'This is not a valid url.'
        })
})

module.exports = task_routes;
