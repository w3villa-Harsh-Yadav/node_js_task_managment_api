const express = require('express');
const { body,header } = require('express-validator')
const routes = express.Router();

const controller = require('../controllers/users_controller')
const { checkValidation } = require('../middleware/validationerror')

// Users routes

routes.post('/register',[
        body("name").isAlpha().isLength({ min: 5 }).withMessage('Please provide a valid name'),
        body("password").isStrongPassword().withMessage('Please provide a strong password'),
        body("email").isEmail().withMessage('Please provide a valid email'),
        body("phonenumber").isNumeric().isLength({ min: 10, max: 10 }).withMessage('Please provide a valid phonenumber')
],checkValidation,controller.registerUser);

routes.post('/login',[
        body("email").isEmail().withMessage('Please provide valid credentials'),
        body("password").isStrongPassword().withMessage('Please provide valid credentials'),
],checkValidation ,controller.loginUser);

routes.post('/forgotpassword',[
        body("email").isEmail().withMessage('Please provide a valid email'),
],checkValidation ,controller.forgotpassword);

routes.post('/updatepassword',[
        body('otp').isAlphanumeric().isLength({ min: 7, max:7}).withMessage('Please provide valid otp'),
        body("email").isEmail().withMessage('Please provide a valid email'),
        body("updated_password").isStrongPassword().withMessage('Please provide a strong password'),
],checkValidation ,controller.updatepassword);

routes.get('/getuser',[
        header('token').isJWT().withMessage('Please provide a valid token'),
],checkValidation, controller.getUser);

routes.put('/update',[
        header('token').isJWT().withMessage('Please provide a valid token'),
        body("name").isAlpha().isLength({ min: 5 }).withMessage('Please provide a valid name'),
        body("email").isEmail().withMessage('Please provide a valid email'),
        body("phonenumber").isNumeric().isLength({ min: 10, max: 10 }).withMessage('Please provide a valid phonenumber')
],checkValidation,controller.updateUser);

routes.delete('/delete',[
        header('token').isJWT().withMessage('Please provide a valid token'),
],checkValidation, controller.deleteUser);

routes.use('*',(req,res)=>{
    res.status(404).json({
        status:false,
        msg: 'This is not a valid url from routes'
    })
})


module.exports = routes;
