const express = require('express');
const { body,header } = require('express-validator')
const user_routes = express.Router();

const controller = require('../controllers/users_controller')
const { checkValidation } = require('../middleware/validationerror')
const { authenticate } = require("../middleware/authenticate");


user_routes.post('/register',[
        body("name").isAlpha().isLength({ min: 5 }).withMessage('Please provide a valid name'),
        body("password").isStrongPassword().withMessage('Please provide a strong password'),
        body("email").isEmail().withMessage('Please provide a valid email'),
        body("phonenumber").isNumeric().isLength({ min: 10, max: 10 }).withMessage('Please provide a valid phonenumber')
],checkValidation,controller.registerUser);

user_routes.post('/login',[
        body("email").isEmail().withMessage('Please provide valid credentials'),
        body("password").isStrongPassword().withMessage('Please provide valid credentials'),
],checkValidation ,controller.loginUser);

user_routes.post('/forgotpassword',[
        body("email").isEmail().withMessage('Please provide a valid email'),
],checkValidation ,controller.forgotpassword);

user_routes.post('/updatepassword',[
        body('otp').isAlphanumeric().isLength({ min: 7, max:7}).withMessage('Please provide valid otp'),
        body("email").isEmail().withMessage('Please provide a valid email'),
        body("updated_password").isStrongPassword().withMessage('Please provide a strong password'),
],checkValidation ,controller.updatepassword);

user_routes.get('/getuser',[
        header('token').isJWT().withMessage('Please provide a valid token'),
],checkValidation, authenticate, controller.getUser);

user_routes.put('/update',[
        header('token').isJWT().withMessage('Please provide a valid token'),
        body("name").isAlpha().isLength({ min: 5 }).withMessage('Please provide a valid name'),
        body("email").isEmail().withMessage('Please provide a valid email'),
        body("phonenumber").isNumeric().isLength({ min: 10, max: 10 }).withMessage('Please provide a valid phonenumber')
],checkValidation, authenticate,controller.updateUser);

user_routes.delete('/delete',[
        header('token').isJWT().withMessage('Please provide a valid token'),
],checkValidation, authenticate, controller.deleteUser);


user_routes.use('*',(req,res)=>{
    res.status(404).json({
        status:false,
        msg: 'This is not a valid url.'
    })
})


module.exports = user_routes;
