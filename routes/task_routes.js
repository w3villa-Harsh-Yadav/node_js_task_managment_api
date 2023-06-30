const express = require('express');
const task_routes = express.Router();
const { body,header } = require('express-validator')

const tasks_controller = require('../controllers/tasks_controller')
const { checkValidation } = require('../middleware/validationerror')
const { authenticate } = require("../middleware/authenticate");



task_routes.post('/tasks',[
        body("name").isAlpha().isLength({ min: 5 }).withMessage('Please provide a valid name'),
        body("password").isStrongPassword().withMessage('Please provide a strong password'),
        body("email").isEmail().withMessage('Please provide a valid email'),
        body("phonenumber").isNumeric().isLength({ min: 10, max: 10 }).withMessage('Please provide a valid phonenumber')
], authenticate, tasks_controller.addTask);
task_routes.get('/tasks', authenticate, tasks_controller.getAllTask);
task_routes.get('/tasks/:id', authenticate, tasks_controller.getTask);
task_routes.patch('/tasks/:id', authenticate, tasks_controller.editTask);
task_routes.delete('/tasks/:id', authenticate, tasks_controller.deleteTask);

module.exports = task_routes;
