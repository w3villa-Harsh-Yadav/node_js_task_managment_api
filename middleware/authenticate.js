const jwt = require("jsonwebtoken");
const userModel = require('../models/user_model')
const logger = require('../logger')

const authenticate = async (req) => {
    try {
        let user;
        const token = req.get("token");
        if (token) {
            user = jwt.verify(token, process.env.SECRET_KEY);
            if(!user){
                return null;
            }
            user = await userModel.findOne({email: user.email});
            return user;
        }
        logger.error(`Status Code: ${400} - Token not provided - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        return null;
    } catch (error) {
        logger.error(`Status Code: ${error.status || 500} - Some internal error occured - ${error.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
        return null;
    }
};

module.exports = {
    authenticate,
}
